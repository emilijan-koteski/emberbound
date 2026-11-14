// The look a set of materials is drawn under: one palette and one lighting rig, held as the uniform
// objects every material made from it shares (story 0.9, D2). three.js keeps a material's `uniforms`
// by reference (Material.setValues), so changing a value here changes every material at once:
// apply() recolours and relights them all in place, with no new material and no shader recompile.
// That is how a level swap (story 0.10) and an enemy recolour (NR104) stay data changes.
//
// Never clone a factory material: ShaderMaterial.copy() clones its uniforms, which breaks the sharing.
//
// Directions, depths and intensities follow render/lighting/lightingRig.ts; what an intensity means
// for the bands is render/materials/shading.ts.
import { Color, Vector3 } from 'three';
import type { IUniform, Material } from 'three';
import { invariant } from '../../core/invariant.ts';
import type { LevelPalette, LevelPaletteSlot } from '../../core/paletteSlots.ts';
import { FIRE_LIGHTS } from '../lighting/fireLights.ts';
import type { FireLight } from '../lighting/fireLights.ts';
import type { Direction, LightingRig, WarmCarrier } from '../lighting/lightingRig.ts';
import { isWarm } from '../palettes/warmth.ts';
import { SHADING } from './shading.ts';
import { slotTones } from './tones.ts';

/** A warm point light to draw this frame: who carries it, and where it is, in world tiles. */
export interface WarmLight {
  readonly carrier: WarmCarrier;
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** The uniforms the shader reads, shared by every material made from one look. */
export interface LookUniforms {
  /** Where the key light comes from, normalised (world axes; lightingRig.ts). */
  readonly uKeyDir: IUniform<Vector3>;
  readonly uKeyIntensity: IUniform<number>;
  readonly uFillDir: IUniform<Vector3>;
  readonly uFillIntensity: IUniform<number>;
  readonly uLitFrom: IUniform<number>;
  readonly uShadowBelow: IUniform<number>;
  readonly uGroundTopFrom: IUniform<number>;
  readonly uFogColor: IUniform<Color>;
  /** Tiles behind the play plane. */
  readonly uFogStart: IUniform<number>;
  readonly uFogFull: IUniform<number>;
  readonly uFogMax: IUniform<number>;
  readonly uGroundFogColor: IUniform<Color>;
  /** World y where the ground fog is thickest; the stage sets it (setGroundFogBaseY). */
  readonly uGroundFogBaseY: IUniform<number>;
  readonly uGroundFogHeight: IUniform<number>;
  /** 0 where the rig has no ground fog. */
  readonly uGroundFogMax: IUniform<number>;
  /** Fixed length SHADING.maxWarmLights; the first uWarmCount are live. */
  readonly uWarmPos: IUniform<Vector3[]>;
  readonly uWarmColor: IUniform<Color[]>;
  readonly uWarmReach: IUniform<number[]>;
  /** clamp(SHADING.warmLift × intensity, 0, 1). */
  readonly uWarmAmount: IUniform<number[]>;
  readonly uWarmCount: IUniform<number>;
}

/** One slot's three tones, named as the shader's uniforms. */
export interface SlotToneUniforms {
  readonly uLit: IUniform<Color>;
  readonly uMid: IUniform<Color>;
  readonly uShadow: IUniform<Color>;
}

export interface Look {
  readonly palette: LevelPalette;
  readonly rig: LightingRig;
  /** The shared uniform objects, for the factories only: nothing outside materials/ reads them. */
  readonly uniforms: LookUniforms;
  /** The slot's lit, mid and shadow uniforms, created on first use and recomputed by apply(). */
  tones(slot: LevelPaletteSlot): SlotToneUniforms;
  /**
   * Recolours and relights every material made from this look, in place. Drops the warm lights whose
   * carrier the new rig doesn't list. Throws (invariant), changing nothing, if a live glowing material
   * would break the warm rule under the new palette and rig: dispose it first (code review, 2026-11-14).
   */
  apply(palette: LevelPalette, rig: LightingRig): void;
  /**
   * Checks a glowing material against the warm rule now, and on every apply() while it lives; it is
   * forgotten when the material is disposed. The factories call it; nothing else needs to.
   */
  trackGlow(material: Material, slot: LevelPaletteSlot, carrier: WarmCarrier | null): void;
  /**
   * The warm lights to draw. Throws (invariant) for a carrier the rig doesn't list, a member that
   * glows but carries no light, or more than SHADING.maxWarmLights. Allocates nothing.
   */
  setWarmLights(lights: readonly WarmLight[]): void;
  /** Where the ground fog lies (world y); 0 until set. */
  setGroundFogBaseY(y: number): void;
}

/**
 * The warm rule for anything that glows (style guide §3; NFR28; story 0.9, AC12): a carrier must be in
 * the rig's warm list, and a slot that is warm in this palette must name one. Returns why it fails, or
 * null.
 */
function glowProblem(
  palette: LevelPalette,
  rig: LightingRig,
  slot: LevelPaletteSlot,
  carrier: WarmCarrier | null,
): string | null {
  if (carrier !== null && !rig.warmLight.includes(carrier)) {
    return `"${carrier}" may not glow warm under this rig (its warm list: ${rig.warmLight.join(', ')})`;
  }
  if (carrier === null && isWarm(palette[slot])) {
    return `"${slot}" is warm here, so whatever glows in it must name a carrier the rig lists`;
  }
  return null;
}

/**
 * GLSL's smoothstep is undefined when its edges are equal, so a level with no ground fog keeps this
 * height (its amount is 0, so nothing shows).
 */
const NO_GROUND_FOG_HEIGHT = 1;

function setDirection(target: Vector3, from: Direction): void {
  target.set(from.x, from.y, from.z).normalize();
}

/** The light a carrier casts under this rig, or null if it glows without one. */
function lightOf(rig: LightingRig, carrier: WarmCarrier): FireLight | null {
  if (carrier === 'lantern') return rig.lanterns;
  return carrier in FIRE_LIGHTS ? FIRE_LIGHTS[carrier as keyof typeof FIRE_LIGHTS] : null;
}

export function createLook(initialPalette: LevelPalette, initialRig: LightingRig): Look {
  let palette = initialPalette;
  let rig = initialRig;
  const count = SHADING.maxWarmLights;

  const uniforms: LookUniforms = {
    uKeyDir: { value: new Vector3() },
    uKeyIntensity: { value: 0 },
    uFillDir: { value: new Vector3() },
    uFillIntensity: { value: 0 },
    uLitFrom: { value: SHADING.litFrom },
    uShadowBelow: { value: SHADING.shadowBelow },
    uGroundTopFrom: { value: SHADING.groundTopFrom },
    uFogColor: { value: new Color() },
    uFogStart: { value: 0 },
    uFogFull: { value: 0 },
    uFogMax: { value: 0 },
    uGroundFogColor: { value: new Color() },
    uGroundFogBaseY: { value: 0 },
    uGroundFogHeight: { value: NO_GROUND_FOG_HEIGHT },
    uGroundFogMax: { value: 0 },
    uWarmPos: { value: Array.from({ length: count }, () => new Vector3()) },
    uWarmColor: { value: Array.from({ length: count }, () => new Color()) },
    uWarmReach: { value: Array.from({ length: count }, () => 0) },
    uWarmAmount: { value: Array.from({ length: count }, () => 0) },
    uWarmCount: { value: 0 },
  };

  const tonesBySlot = new Map<LevelPaletteSlot, SlotToneUniforms>();
  /** Every live glowing material made from this look, re-checked on apply(). */
  const glows = new Map<Material, { slot: LevelPaletteSlot; carrier: WarmCarrier | null }>();
  /** Who carries each live warm light, in the same order as the arrays. */
  const carriers: (WarmCarrier | null)[] = Array.from({ length: count }, () => null);
  /**
   * The light each carrier casts under the current rig, resolved once per apply(), so
   * setWarmLights() copies numbers and colours and allocates nothing. A carrier missing here either
   * isn't in the rig's warm list or glows without a light.
   */
  const castable = new Map<WarmCarrier, { color: Color; reach: number; amount: number }>();

  function resolveCastable(): void {
    castable.clear();
    for (const carrier of rig.warmLight) {
      const source = lightOf(rig, carrier);
      if (source === null) continue;
      castable.set(carrier, {
        color: new Color(palette[source.color]),
        reach: source.reachTiles,
        amount: Math.min(Math.max(SHADING.warmLift * source.intensity, 0), 1),
      });
    }
  }

  function writeLight(index: number, carrier: WarmCarrier): void {
    const cast = castable.get(carrier);
    if (cast === undefined) {
      // The message is built only on failure: this runs every frame from Epic 1.
      invariant(
        false,
        rig.warmLight.includes(carrier)
          ? `"${carrier}" glows but carries no light (FIRE_LIGHTS; story 0.9, D8)`
          : `"${carrier}" may not carry warm light under this rig (its warm list: ${rig.warmLight.join(', ')})`,
      );
    }
    uniforms.uWarmColor.value[index]?.copy(cast.color);
    uniforms.uWarmReach.value[index] = cast.reach;
    uniforms.uWarmAmount.value[index] = cast.amount;
    carriers[index] = carrier;
  }

  function applyRig(): void {
    setDirection(uniforms.uKeyDir.value, rig.key.from);
    uniforms.uKeyIntensity.value = rig.key.intensity;
    setDirection(uniforms.uFillDir.value, rig.fill.from);
    uniforms.uFillIntensity.value = rig.fill.intensity;
    uniforms.uFogColor.value.set(palette[rig.fog.color]);
    uniforms.uFogStart.value = rig.fog.startDepth;
    uniforms.uFogFull.value = rig.fog.fullDepth;
    uniforms.uFogMax.value = rig.fog.maxAmount;
    const { groundFog } = rig;
    uniforms.uGroundFogColor.value.set(palette[groundFog?.color ?? rig.fog.color]);
    uniforms.uGroundFogHeight.value = groundFog?.heightTiles ?? NO_GROUND_FOG_HEIGHT;
    uniforms.uGroundFogMax.value = groundFog?.maxAmount ?? 0;
    for (const [slot, tones] of tonesBySlot) {
      slotTones(palette, rig, slot, {
        lit: tones.uLit.value,
        mid: tones.uMid.value,
        shadow: tones.uShadow.value,
      });
    }
    resolveCastable();
  }

  /** Keeps the live lights the rig still lists, in order, and recolours them. */
  function refreshLights(): void {
    const positions = uniforms.uWarmPos.value;
    let kept = 0;
    for (let i = 0; i < uniforms.uWarmCount.value; i += 1) {
      const carrier = carriers.at(i);
      if (carrier === null || carrier === undefined || !castable.has(carrier)) continue;
      if (kept !== i) positions.at(kept)?.copy(positions[i]);
      writeLight(kept, carrier);
      kept += 1;
    }
    for (let i = kept; i < count; i += 1) carriers[i] = null;
    uniforms.uWarmCount.value = kept;
  }

  applyRig();

  return {
    get palette() {
      return palette;
    },
    get rig() {
      return rig;
    },
    uniforms,
    tones(slot) {
      const existing = tonesBySlot.get(slot);
      if (existing !== undefined) return existing;
      // Slot names may come from model files at run time (Epic 2's glTF material names).
      invariant(Object.hasOwn(palette, slot), `"${slot}" is not a level palette slot`);
      const computed = slotTones(palette, rig, slot);
      const tones: SlotToneUniforms = {
        uLit: { value: computed.lit },
        uMid: { value: computed.mid },
        uShadow: { value: computed.shadow },
      };
      tonesBySlot.set(slot, tones);
      return tones;
    },
    apply(nextPalette, nextRig) {
      // Checked before anything changes, so a refused apply() leaves the look as it was.
      for (const [material, glow] of glows) {
        const problem = glowProblem(nextPalette, nextRig, glow.slot, glow.carrier);
        if (problem !== null) {
          invariant(false, `${material.name}: ${problem}; dispose it before the level changes`);
        }
      }
      palette = nextPalette;
      rig = nextRig;
      applyRig();
      refreshLights();
    },
    setWarmLights(lights) {
      if (lights.length > count) {
        invariant(
          false,
          `${String(lights.length)} warm lights; the shader draws at most ${String(count)} (SHADING.maxWarmLights)`,
        );
      }
      // Every light is checked before any is written, so a refused call leaves the old set intact.
      for (const light of lights) {
        if (!castable.has(light.carrier)) writeLight(0, light.carrier); // throws, with the reason
      }
      for (let i = 0; i < lights.length; i += 1) {
        const light = lights[i];
        writeLight(i, light.carrier);
        uniforms.uWarmPos.value[i]?.set(light.x, light.y, light.z);
      }
      for (let i = lights.length; i < count; i += 1) carriers[i] = null;
      uniforms.uWarmCount.value = lights.length;
    },
    trackGlow(material, slot, carrier) {
      const problem = glowProblem(palette, rig, slot, carrier);
      if (problem !== null) invariant(false, problem);
      glows.set(material, { slot, carrier });
      const forget = (): void => {
        glows.delete(material);
        material.removeEventListener('dispose', forget);
      };
      material.addEventListener('dispose', forget);
    },
    setGroundFogBaseY(y) {
      uniforms.uGroundFogBaseY.value = y;
    },
  };
}

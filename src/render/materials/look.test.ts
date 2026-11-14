// The look: the uniforms every material made from it shares (story 0.9, AC7–AC8, AC10, AC12). three.js
// core runs in Node; no WebGLRenderer is created. Values come from the rigs, palettes and settings.
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import type { LevelPalette } from '../../core/paletteSlots.ts';
import { DROWNED_MILL_RIG } from '../lighting/drownedMill.ts';
import { EMBERWOOD_RIG } from '../lighting/emberwood.ts';
import { FIRE_LIGHTS } from '../lighting/fireLights.ts';
import { HARROWMERE_RIG } from '../lighting/harrowmere.ts';
import type { LightingRig, WarmCarrier } from '../lighting/lightingRig.ts';
import { DROWNED_MILL_PALETTE } from '../palettes/drownedMill.ts';
import { EMBERWOOD_PALETTE } from '../palettes/emberwood.ts';
import { HARROWMERE_PALETTE } from '../palettes/harrowmere.ts';
import { createEffectMaterial } from './effectMaterial.ts';
import { createLook } from './look.ts';
import type { Look, WarmLight } from './look.ts';
import { SHADING } from './shading.ts';
import { slotTones } from './tones.ts';

const LEVELS = [
  { name: 'emberwood', palette: EMBERWOOD_PALETTE, rig: EMBERWOOD_RIG },
  { name: 'drowned-mill', palette: DROWNED_MILL_PALETTE, rig: DROWNED_MILL_RIG },
  { name: 'harrowmere', palette: HARROWMERE_PALETTE, rig: HARROWMERE_RIG },
] as const satisfies readonly { name: string; palette: LevelPalette; rig: LightingRig }[];

const [EMBERWOOD, DROWNED_MILL] = LEVELS;

function light(carrier: WarmCarrier, x = 0): WarmLight {
  return { carrier, x, y: 1, z: 0 };
}

function normalised(from: { x: number; y: number; z: number }): Vector3 {
  return new Vector3(from.x, from.y, from.z).normalize();
}

/** Every object a look's uniforms hold (each uniform and its value, array members included). */
function uniformObjects(look: Look): unknown[] {
  const found: unknown[] = [];
  for (const uniform of Object.values(look.uniforms)) {
    found.push(uniform);
    const { value } = uniform as { value: unknown };
    if (Array.isArray(value)) found.push(value, ...(value as unknown[]));
    else if (typeof value === 'object' && value !== null) found.push(value);
  }
  return found;
}

describe.each(LEVELS)('a look under $name', ({ name, palette, rig }) => {
  it('takes the rig’s key and fill directions (normalised) and intensities', () => {
    const { uniforms } = createLook(palette, rig);
    expect(uniforms.uKeyDir.value.distanceTo(normalised(rig.key.from))).toBeLessThan(1e-12);
    expect(uniforms.uFillDir.value.distanceTo(normalised(rig.fill.from))).toBeLessThan(1e-12);
    expect(uniforms.uKeyDir.value.length()).toBeCloseTo(1, 12);
    expect(uniforms.uKeyIntensity.value).toBe(rig.key.intensity);
    expect(uniforms.uFillIntensity.value).toBe(rig.fill.intensity);
  });

  it('takes the rig’s fog, and its ground fog only where the rig has one', () => {
    const { uniforms } = createLook(palette, rig);
    expect(uniforms.uFogColor.value.getHexString()).toBe(
      palette[rig.fog.color].slice(1).toLowerCase(),
    );
    expect(uniforms.uFogStart.value).toBe(rig.fog.startDepth);
    expect(uniforms.uFogFull.value).toBe(rig.fog.fullDepth);
    expect(uniforms.uFogMax.value).toBe(rig.fog.maxAmount);
    if (rig.groundFog === null) {
      expect(uniforms.uGroundFogMax.value, name).toBe(0);
      // GLSL's smoothstep is undefined for equal edges, so a level without one keeps a height.
      expect(uniforms.uGroundFogHeight.value).toBeGreaterThan(0);
    } else {
      expect(uniforms.uGroundFogMax.value).toBe(rig.groundFog.maxAmount);
      expect(uniforms.uGroundFogHeight.value).toBe(rig.groundFog.heightTiles);
      expect(uniforms.uGroundFogColor.value.getHexString()).toBe(
        palette[rig.groundFog.color].slice(1).toLowerCase(),
      );
    }
  });

  it('carries the shading settings the shader reads', () => {
    const { uniforms } = createLook(palette, rig);
    expect(uniforms.uLitFrom.value).toBe(SHADING.litFrom);
    expect(uniforms.uShadowBelow.value).toBe(SHADING.shadowBelow);
    expect(uniforms.uGroundTopFrom.value).toBe(SHADING.groundTopFrom);
  });

  it('gives each slot its tones, one shared set per slot', () => {
    const look = createLook(palette, rig);
    const tones = look.tones('walkerBody');
    expect(look.tones('walkerBody')).toBe(tones);
    const expected = slotTones(palette, rig, 'walkerBody');
    expect(tones.uLit.value.equals(expected.lit)).toBe(true);
    expect(tones.uMid.value.equals(expected.mid)).toBe(true);
    expect(tones.uShadow.value.equals(expected.shadow)).toBe(true);
  });

  it(`${rig.lanterns === null ? 'refuses' : 'accepts'} a lantern light`, () => {
    const look = createLook(palette, rig);
    if (rig.lanterns === null) {
      expect(() => {
        look.setWarmLights([light('lantern')]);
      }).toThrow(/Invariant failed/);
      return;
    }
    look.setWarmLights([light('lantern')]);
    const { uniforms } = look;
    expect(uniforms.uWarmCount.value).toBe(1);
    expect(uniforms.uWarmReach.value[0]).toBe(rig.lanterns.reachTiles);
    expect(uniforms.uWarmAmount.value[0]).toBeCloseTo(SHADING.warmLift * rig.lanterns.intensity);
    expect(uniforms.uWarmColor.value[0]?.getHexString()).toBe(
      palette[rig.lanterns.color].slice(1).toLowerCase(),
    );
  });

  it('accepts Rowan’s and a shot’s light, and refuses one from a member that only glows', () => {
    const look = createLook(palette, rig);
    look.setWarmLights([light('rowan'), light('shot', 2)]);
    expect(look.uniforms.uWarmCount.value).toBe(2);
    expect(look.uniforms.uWarmReach.value[0]).toBe(FIRE_LIGHTS.rowan.reachTiles);
    expect(look.uniforms.uWarmPos.value[1]?.x).toBe(2);
    for (const carrier of ['ember', 'bell', 'weaponPickup'] as const) {
      expect(() => {
        look.setWarmLights([light(carrier)]);
      }, carrier).toThrow(/Invariant failed/);
    }
  });

  it('refuses more warm lights than the shader draws, and takes exactly that many', () => {
    const look = createLook(palette, rig);
    const many = Array.from({ length: SHADING.maxWarmLights }, (_, i) => light('shot', i));
    look.setWarmLights(many);
    expect(look.uniforms.uWarmCount.value).toBe(SHADING.maxWarmLights);
    expect(() => {
      look.setWarmLights([...many, light('rowan')]);
    }).toThrow(/Invariant failed/);
  });

  it('keeps every warm-light array at the shader’s fixed length', () => {
    const { uniforms } = createLook(palette, rig);
    for (const array of [
      uniforms.uWarmPos.value,
      uniforms.uWarmColor.value,
      uniforms.uWarmReach.value,
      uniforms.uWarmAmount.value,
    ]) {
      expect(array).toHaveLength(SHADING.maxWarmLights);
    }
  });
});

describe('look.apply()', () => {
  it('recolours a slot’s tones in place, in each palette, by slot alone', () => {
    const look = createLook(EMBERWOOD.palette, EMBERWOOD.rig);
    const tones = look.tones('walkerBody');
    const lit = tones.uLit.value;
    for (const level of LEVELS) {
      look.apply(level.palette, level.rig);
      const expected = slotTones(level.palette, level.rig, 'walkerBody');
      expect(look.tones('walkerBody')).toBe(tones);
      expect(tones.uLit.value).toBe(lit);
      expect(tones.uLit.value.equals(expected.lit), level.name).toBe(true);
      expect(tones.uMid.value.equals(expected.mid), level.name).toBe(true);
      expect(tones.uShadow.value.equals(expected.shadow), level.name).toBe(true);
    }
  });

  it('never replaces a uniform object', () => {
    const look = createLook(EMBERWOOD.palette, EMBERWOOD.rig);
    look.tones('groundTop');
    look.setWarmLights([light('rowan'), light('lantern')]);
    const before = uniformObjects(look);
    look.apply(DROWNED_MILL.palette, DROWNED_MILL.rig);
    look.apply(EMBERWOOD.palette, EMBERWOOD.rig);
    const after = uniformObjects(look);
    expect(after).toHaveLength(before.length);
    after.forEach((object, i) => {
      expect(object).toBe(before[i]);
    });
  });

  it('drops the lights the new rig doesn’t list, and keeps and recolours the rest', () => {
    const look = createLook(EMBERWOOD.palette, EMBERWOOD.rig);
    look.setWarmLights([light('lantern', 1), light('rowan', 2)]);
    look.apply(DROWNED_MILL.palette, DROWNED_MILL.rig);
    expect(look.uniforms.uWarmCount.value).toBe(1);
    expect(look.uniforms.uWarmPos.value[0]?.x).toBe(2);
    expect(look.uniforms.uWarmColor.value[0]?.getHexString()).toBe(
      DROWNED_MILL.palette[FIRE_LIGHTS.rowan.color].slice(1).toLowerCase(),
    );
    expect(look.palette).toBe(DROWNED_MILL.palette);
    expect(look.rig).toBe(DROWNED_MILL.rig);
  });
});

describe('look.setGroundFogBaseY()', () => {
  it('moves the ground fog’s base and nothing else', () => {
    const look = createLook(DROWNED_MILL.palette, DROWNED_MILL.rig);
    const before = Object.fromEntries(
      Object.entries(look.uniforms).map(([key, uniform]) => [
        key,
        JSON.stringify((uniform as { value: unknown }).value),
      ]),
    );
    look.setGroundFogBaseY(-3.5);
    expect(look.uniforms.uGroundFogBaseY.value).toBe(-3.5);
    for (const [key, uniform] of Object.entries(look.uniforms)) {
      if (key !== 'uGroundFogBaseY')
        expect(JSON.stringify((uniform as { value: unknown }).value), key).toBe(before[key]);
    }
  });
});

describe('the warm rule across a level change (code review, 2026-11-14)', () => {
  it('refuses to apply a rig that forbids a live glow, and changes nothing', () => {
    const look = createLook(EMBERWOOD.palette, EMBERWOOD.rig);
    const glass = createEffectMaterial(look, { slot: 'lantern', carrier: 'lantern' });
    const midBefore = look.tones('lantern').uMid.value.clone();
    expect(() => {
      look.apply(DROWNED_MILL.palette, DROWNED_MILL.rig);
    }).toThrow(/Invariant failed: effect:lantern/);
    expect(look.palette).toBe(EMBERWOOD.palette);
    expect(look.rig).toBe(EMBERWOOD.rig);
    expect(look.tones('lantern').uMid.value.equals(midBefore)).toBe(true);
    glass.dispose();
  });

  it('allows the change once the glowing material is disposed', () => {
    const look = createLook(EMBERWOOD.palette, EMBERWOOD.rig);
    createEffectMaterial(look, { slot: 'lantern', carrier: 'lantern' }).dispose();
    look.apply(DROWNED_MILL.palette, DROWNED_MILL.rig);
    expect(look.rig).toBe(DROWNED_MILL.rig);
  });

  it('refuses a palette where a cold glow’s slot turns warm', () => {
    // `lantern` is cold in the Drowned Mill and warm in Emberwood (style guide §3).
    const look = createLook(DROWNED_MILL.palette, DROWNED_MILL.rig);
    createEffectMaterial(look, { slot: 'lantern', carrier: null });
    expect(() => {
      look.apply(EMBERWOOD.palette, EMBERWOOD.rig);
    }).toThrow(/Invariant failed/);
  });
});

describe('a refused setWarmLights() (code review, 2026-11-14)', () => {
  it('leaves the lights that were set before it untouched', () => {
    const look = createLook(EMBERWOOD.palette, EMBERWOOD.rig);
    look.setWarmLights([light('rowan', 1), light('lantern', 2)]);
    const reach = [...look.uniforms.uWarmReach.value];
    expect(() => {
      look.setWarmLights([light('shot', 5), light('ember', 6)]);
    }).toThrow(/Invariant failed/);
    expect(look.uniforms.uWarmCount.value).toBe(2);
    expect(look.uniforms.uWarmPos.value[0]?.x).toBe(1);
    expect(look.uniforms.uWarmReach.value).toEqual(reach);
  });
});

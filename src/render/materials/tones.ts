// The three tones of every palette slot (docs/STYLE_GUIDE.md §2, Shading; story 0.9, D3): computed
// here, in TypeScript, and uploaded as uniforms, so the shader only picks one and the rule is
// unit-tested in Node. The page's swatches use the same function, so they are what the shader draws.
//
// Colours mix in three.js's linear working space (Color.lerp): `new Color(hex)` converts the palette's
// sRGB hex to linear, and the renderer's sRGB output converts back, so mid comes out as the hex.
import { Color, ColorManagement, Vector3 } from 'three';
import type { HexColor, LevelPalette, LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { LightingRig } from '../lighting/lightingRig.ts';
import { SHADING } from './shading.ts';

/**
 * Pits and deep water read as dark (NR102; style guide §3): no tone of theirs is ever lighter than
 * the slot, so lit and shadow both stay mid. (Every fill colour is lighter than `pit` and `water`, so
 * pulling their shadow toward it would lighten them too.)
 */
export const NEVER_LIGHTER_SLOTS = ['pit', 'water'] as const satisfies readonly LevelPaletteSlot[];

export interface SlotTones {
  readonly lit: Color;
  readonly mid: Color;
  readonly shadow: Color;
}

export interface SlotToneHexes {
  readonly lit: HexColor;
  readonly mid: HexColor;
  readonly shadow: HexColor;
}

function isNeverLighter(slot: LevelPaletteSlot): boolean {
  return (NEVER_LIGHTER_SLOTS as readonly LevelPaletteSlot[]).includes(slot);
}

/** The working space's luminance weights (linear sRGB: Rec. 709), read from three.js. */
const LUMA = ColorManagement.getLuminanceCoefficients(new Vector3());

function luminance(color: Color): number {
  return LUMA.x * color.r + LUMA.y * color.g + LUMA.z * color.b;
}

/**
 * Scales `color` uniformly (its hue unchanged) up to a luminance of at least `min`. It stops where a
 * channel would pass 1, so the hue is never clipped.
 */
function brightenTo(color: Color, min: number): void {
  const current = luminance(color);
  if (current >= min || current <= 0) return;
  const brightest = Math.max(color.r, color.g, color.b);
  color.multiplyScalar(Math.min(min / current, 1 / brightest));
}

/** Scales `color` uniformly (its hue unchanged) down to a luminance of at most `max`. */
function darkenTo(color: Color, max: number): void {
  const current = luminance(color);
  if (current <= max) return;
  color.multiplyScalar(max / current);
}

/**
 * The slot's lit, mid and shadow tones under this palette and rig, written into `target` when given
 * (the look reuses its uniform colours, so `apply()` allocates nothing new per slot).
 *
 * The style guide's mix (lit toward the key colour, shadow toward the fill colour) sets each tone's
 * hue. A slot paler than the key, or darker than the fill, would then get a darker lit or a lighter
 * shadow, so the value is guarded: lit is at least `minToneStep` brighter than mid, shadow at least
 * that much darker (D15).
 */
export function slotTones(
  palette: LevelPalette,
  rig: LightingRig,
  slot: LevelPaletteSlot,
  target?: SlotTones,
): SlotTones {
  const tones = target ?? { lit: new Color(), mid: new Color(), shadow: new Color() };
  tones.mid.set(palette[slot]);
  tones.lit.copy(tones.mid);
  tones.shadow.copy(tones.mid);
  if (isNeverLighter(slot)) return tones;
  const midLuminance = luminance(tones.mid);
  tones.lit.lerp(new Color(palette[rig.key.color]), SHADING.litLift);
  brightenTo(tones.lit, midLuminance * (1 + SHADING.minToneStep));
  tones.shadow.lerp(new Color(palette[rig.fill.color]), SHADING.shadowPull);
  darkenTo(tones.shadow, midLuminance * (1 - SHADING.minToneStep));
  return tones;
}

function toHex(color: Color): HexColor {
  return `#${color.getHexString().toUpperCase()}`;
}

/** The same tones as `#RRGGBB` (sRGB), for the look-dev page's swatches. */
export function slotToneHexes(
  palette: LevelPalette,
  rig: LightingRig,
  slot: LevelPaletteSlot,
): SlotToneHexes {
  const { lit, mid, shadow } = slotTones(palette, rig, slot);
  return { lit: toHex(lit), mid: toHex(mid), shadow: toHex(shadow) };
}

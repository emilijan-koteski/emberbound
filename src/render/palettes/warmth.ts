// The style guide's warm-light rule as code (docs/STYLE_GUIDE.md, section 3): the working definition
// of a warm colour, and the slots allowed to be warm. Warm light belongs only to Rowan and his fire
// family (his shots, the collectables, which are the embers and the bells, and the weapon pickups),
// plus the lanterns in Emberwood (NFR28, NR100–NR103). The palette tests and the look-dev palettes
// view use these; story 0.9's materials may too.
import { CHANNEL_MAX, parseHex } from '../../core/color.ts';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';

/**
 * A colour is warm when its HSL hue is from 330° through 360° to 70° and its saturation is at least
 * 25 %, both ends inclusive, computed from the hex without rounding (style guide, section 3). The
 * style guide's definition, not a tuning number.
 */
export const WARM_RULE = {
  hueFromDegrees: 330,
  hueToDegrees: 70,
  minSaturation: 0.25,
} as const;

/** Rowan's slots. `heroScarf` and `heroHorn` are warm colours on surfaces, not lights. */
export const ROWAN_SLOTS = [
  'heroSkin',
  'heroSeam',
  'heroGlow',
  'heroScarf',
  'heroCloth',
  'heroLeather',
  'heroHorn',
] as const satisfies readonly LevelPaletteSlot[];

/** His fire family's slots: his shots, the embers, the weapon pickups and the bells. */
export const FIRE_FAMILY_SLOTS = [
  'shot',
  'ember',
  'pickupWarm',
  'bell',
] as const satisfies readonly LevelPaletteSlot[];

/** Degrees per sixth of the hue circle, and in a full turn. */
const SEXTANT_DEGREES = 60;
const FULL_TURN_DEGREES = 360;
const OPAQUE_HEX = /^#[0-9a-f]{6}$/i;

/**
 * The warm test on an opaque `#RRGGBB` colour, computed exactly. Floating-point HSL puts colours
 * that sit exactly on an end just outside it (#D9BFCC is exactly 330° but computes to
 * 329.99999999999994°; code review, 2026-11-14), so this compares in whole numbers on the 0–255
 * channels instead:
 * - hue × chroma is a whole number (60 × the channel difference, plus 360 × chroma when negative),
 *   compared with 330 × chroma and 70 × chroma;
 * - saturation is chroma / (255 − |max + min − 255|), so "at least 25 %" is
 *   chroma × 100 ≥ 25 × that denominator.
 */
export function isWarm(hex: string): boolean {
  const rgb = OPAQUE_HEX.test(hex) ? parseHex(hex) : null;
  if (rgb === null) throw new Error(`Not an opaque #RRGGBB colour: "${hex}"`);
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  if (chroma === 0) return false; // achromatic: saturation 0

  const saturationDenominator = CHANNEL_MAX - Math.abs(max + min - CHANNEL_MAX);
  const percent = 100;
  if (chroma * percent < WARM_RULE.minSaturation * percent * saturationDenominator) return false;

  // The same sextant order as core/color.ts's hsl(): red, then green, then blue.
  let hueTimesChroma: number;
  if (max === r) hueTimesChroma = SEXTANT_DEGREES * (g - b);
  else if (max === g) hueTimesChroma = SEXTANT_DEGREES * (b - r) + 2 * SEXTANT_DEGREES * chroma;
  else hueTimesChroma = SEXTANT_DEGREES * (r - g) + 4 * SEXTANT_DEGREES * chroma;
  if (hueTimesChroma < 0) hueTimesChroma += FULL_TURN_DEGREES * chroma;

  return (
    hueTimesChroma >= WARM_RULE.hueFromDegrees * chroma ||
    hueTimesChroma <= WARM_RULE.hueToDegrees * chroma
  );
}

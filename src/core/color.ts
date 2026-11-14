// Colour maths shared by the palette rules (render/palettes/), the look-dev page and the contrast
// check (scripts/checkContrast.ts). Pure functions on hex strings; no DOM, no three.js. Moved here
// from scripts/checkContrast.ts in story 0.7 (D4), since render/ may not import scripts/.

/**
 * WCAG 2.x relative luminance (https://www.w3.org/TR/WCAG22/#dfn-relative-luminance). The spec's
 * constants, not tuning numbers.
 */
const WCAG_LUMINANCE = {
  linearBelow: 0.04045,
  linearDivisor: 12.92,
  gammaOffset: 0.055,
  gammaDivisor: 1.055,
  gamma: 2.4,
  redWeight: 0.2126,
  greenWeight: 0.7152,
  blueWeight: 0.0722,
} as const;

/** 8-bit channel maximum. */
export const CHANNEL_MAX = 255;

/** Degrees in a full turn of hue. */
const FULL_TURN_DEGREES = 360;
/** Degrees per sixth of the hue circle (the HSL hexcone). */
const SEXTANT_DEGREES = 60;

export interface Rgba {
  /** Channels 0 to 255; fractional after compositing. */
  readonly r: number;
  readonly g: number;
  readonly b: number;
  /** 0 (transparent) to 1 (opaque). */
  readonly a: number;
}

export interface Hsl {
  /** 0 up to, not including, 360. An achromatic colour has hue 0. */
  readonly hueDegrees: number;
  /** 0 to 1. */
  readonly saturation: number;
  /** 0 to 1. */
  readonly lightness: number;
}

const HEX = /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i;
const OPAQUE_HEX = /^#[0-9a-f]{6}$/i;

/** `#RRGGBB` or `#RRGGBBAA`, either case; anything else is null. */
export function parseHex(hex: string): Rgba | null {
  if (!HEX.test(hex)) return null;
  const channel = (start: number): number => parseInt(hex.slice(start, start + 2), 16);
  return {
    r: channel(1),
    g: channel(3),
    b: channel(5),
    a: hex.length === 9 ? channel(7) / CHANNEL_MAX : 1,
  };
}

function linear(channel: number): number {
  const s = channel / CHANNEL_MAX;
  return s <= WCAG_LUMINANCE.linearBelow
    ? s / WCAG_LUMINANCE.linearDivisor
    : ((s + WCAG_LUMINANCE.gammaOffset) / WCAG_LUMINANCE.gammaDivisor) ** WCAG_LUMINANCE.gamma;
}

/** WCAG relative luminance of an opaque colour, 0 (black) to 1 (white). */
export function relativeLuminance(rgb: Pick<Rgba, 'r' | 'g' | 'b'>): number {
  return (
    WCAG_LUMINANCE.redWeight * linear(rgb.r) +
    WCAG_LUMINANCE.greenWeight * linear(rgb.g) +
    WCAG_LUMINANCE.blueWeight * linear(rgb.b)
  );
}

/**
 * HSL of an opaque `#RRGGBB` colour, computed from the hex without rounding. Floating point still
 * puts a value that sits exactly on a boundary a hair to either side, so a rule with inclusive ends
 * (the style guide's warm test) compares in whole numbers instead: render/palettes/warmth.ts.
 * Anything else throws: palette values are compile-time data, so a bad one is a bug.
 */
export function hsl(hex: string): Hsl {
  const rgb = OPAQUE_HEX.test(hex) ? parseHex(hex) : null;
  if (rgb === null) throw new Error(`Not an opaque #RRGGBB colour: "${hex}"`);
  const r = rgb.r / CHANNEL_MAX;
  const g = rgb.g / CHANNEL_MAX;
  const b = rgb.b / CHANNEL_MAX;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const chroma = max - min;
  if (chroma === 0) return { hueDegrees: 0, saturation: 0, lightness };

  // Float error can push this a hair above 1 for very light or dark colours (#FFFBFD gives
  // 1.000000000000007; code review, 2026-11-14), so clamp it to the documented range.
  const saturation = Math.min(1, chroma / (1 - Math.abs(2 * lightness - 1)));
  let sextant: number;
  if (max === r) sextant = (g - b) / chroma;
  else if (max === g) sextant = (b - r) / chroma + 2;
  else sextant = (r - g) / chroma + 4;
  let hueDegrees = sextant * SEXTANT_DEGREES;
  if (hueDegrees < 0) hueDegrees += FULL_TURN_DEGREES;
  return { hueDegrees, saturation, lightness };
}

// The level palettes against docs/STYLE_GUIDE.md: the drift test (AC13) and the style guide's
// palette rules (section 3, checks 1–4; AC10–AC11). The style guide is read through Vite's ?raw
// import, not node:fs (render/ may not use Node built-ins, tests included; story 0.7, D7).
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import styleGuideSource from '../../../docs/STYLE_GUIDE.md?raw';
import { hsl, parseHex, relativeLuminance } from '../../core/color.ts';
import { LEVEL_PALETTE_SLOTS } from '../../core/paletteSlots.ts';
import type { LevelPalette, LevelPaletteSlot } from '../../core/paletteSlots.ts';
import { DROWNED_MILL_PALETTE } from './drownedMill.ts';
import { EMBERWOOD_PALETTE } from './emberwood.ts';
import { HARROWMERE_PALETTE } from './harrowmere.ts';
import { FIRE_FAMILY_SLOTS, ROWAN_SLOTS, WARM_RULE, isWarm } from './warmth.ts';

/** The frontmatter's key for each palette (camelCase there; level ids are kebab-case). */
const LEVELS = [
  { key: 'emberwood', palette: EMBERWOOD_PALETTE },
  { key: 'drownedMill', palette: DROWNED_MILL_PALETTE },
  { key: 'harrowmere', palette: HARROWMERE_PALETTE },
] as const satisfies readonly { key: string; palette: LevelPalette }[];

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const BOM = '\uFEFF';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The style guide's `palettes:` map, each value kept as the text written (failsafe schema). */
function styleGuidePalettes(): Map<string, Record<string, unknown>> {
  const text = styleGuideSource.startsWith(BOM)
    ? styleGuideSource.slice(BOM.length)
    : styleGuideSource;
  const match = FRONTMATTER.exec(text);
  if (match === null) throw new Error('docs/STYLE_GUIDE.md has no frontmatter');
  const frontmatter: unknown = parse(match[1], { schema: 'failsafe' });
  if (!isRecord(frontmatter) || !isRecord(frontmatter.palettes)) {
    throw new Error('docs/STYLE_GUIDE.md frontmatter has no palettes: map');
  }
  const palettes = new Map<string, Record<string, unknown>>();
  for (const [key, value] of Object.entries(frontmatter.palettes)) {
    if (!isRecord(value)) throw new Error(`palettes.${key} is not a map`);
    palettes.set(key, value);
  }
  return palettes;
}

function luminance(hex: string): number {
  const rgb = parseHex(hex);
  if (rgb === null) throw new Error(`Not a colour: ${hex}`);
  return relativeLuminance(rgb);
}

const ALLOWED_WARM: readonly LevelPaletteSlot[] = [...ROWAN_SLOTS, ...FIRE_FAMILY_SLOTS];
/** Rowan's slots, the fire family's, and the two markers: "same" in every level (section 5). */
const SHARED_SLOTS: readonly LevelPaletteSlot[] = [...ALLOWED_WARM, 'checkpoint', 'exit'];
/** Slots allowed to be darker than `water` (section 3, check 4). */
const DARKER_THAN_WATER: readonly LevelPaletteSlot[] = ['pit', 'foregroundDark', 'ink'];
/** The slots Emberwood's lantern must be less saturated than (section 3, check 2). */
const MORE_SATURATED_THAN_LANTERN: readonly LevelPaletteSlot[] = [
  'heroSeam',
  'heroGlow',
  ...FIRE_FAMILY_SLOTS,
];

describe('the slot list', () => {
  it('has the 36 slots, each once', () => {
    expect(LEVEL_PALETTE_SLOTS).toHaveLength(36);
    expect(new Set(LEVEL_PALETTE_SLOTS).size).toBe(LEVEL_PALETTE_SLOTS.length);
  });

  it('names the warm-family slots from the slot list', () => {
    expect(ROWAN_SLOTS.every((slot) => slot.startsWith('hero'))).toBe(true);
    expect(LEVEL_PALETTE_SLOTS.filter((slot) => slot.startsWith('hero'))).toEqual([...ROWAN_SLOTS]);
    expect(FIRE_FAMILY_SLOTS).toEqual(['shot', 'ember', 'pickupWarm', 'bell']);
  });
});

describe('the warm definition (style guide, section 3)', () => {
  it('is hue 330° through 360° to 70°, at saturation 25 % or more', () => {
    expect(WARM_RULE).toEqual({ hueFromDegrees: 330, hueToDegrees: 70, minSaturation: 0.25 });
    expect(isWarm('#FF0000')).toBe(true); // hue 0
    expect(isWarm('#FF0055')).toBe(true); // hue 340
    expect(isWarm('#EEFF00')).toBe(true); // hue 64
    expect(isWarm('#FF00AA')).toBe(false); // hue 320
    expect(isWarm('#FF0080')).toBe(false); // hue 329.88: just under 330
    expect(isWarm('#CCFF00')).toBe(false); // hue 72
    expect(isWarm('#00FF00')).toBe(false); // hue 120
    expect(isWarm('#808080')).toBe(false); // no saturation
    expect(hsl('#FF0080').hueDegrees).toBeLessThan(330);
  });

  it('includes both hue ends and the saturation floor exactly, with no float error', () => {
    // Each of these lands exactly on an end; floating-point HSL puts the first and the last just
    // outside (329.99999999999994°, saturation 0.24999999999999994), so the test must be exact.
    expect(isWarm('#D9BFCC')).toBe(true); // hue exactly 330°, saturation 26/102
    expect(isWarm('#FE007F')).toBe(true); // hue exactly 330°
    expect(isWarm('#D2FC00')).toBe(true); // hue exactly 70°
    expect(isWarm('#3D4127')).toBe(true); // hue 69.2°, saturation exactly 25 %
    // Just outside each end.
    expect(isWarm('#FF0080')).toBe(false); // hue 329.88°
    expect(isWarm('#D1FC00')).toBe(false); // hue 70.2°
    expect(isWarm('#3D4028')).toBe(false); // hue 67.5°, saturation 24/104
  });

  it('reproduces the figures the style guide measured (2026-11-14)', () => {
    expect(hsl(EMBERWOOD_PALETTE.lantern).saturation).toBeCloseTo(0.6556, 4);
    expect(hsl(EMBERWOOD_PALETTE.bell).saturation).toBeCloseTo(0.7051, 4);
    expect(hsl(EMBERWOOD_PALETTE.hazard).hueDegrees).toBeCloseTo(38, 0);
    expect(hsl(EMBERWOOD_PALETTE.hazard).saturation).toBeCloseTo(0.207, 3);
  });
});

describe('the style guide’s level palettes', () => {
  it('are exactly the three the code has, so a new one in the guide fails until it is added', () => {
    expect([...styleGuidePalettes().keys()]).toEqual(LEVELS.map((level) => level.key));
  });
});

describe.each(LEVELS)('the $key palette', ({ key, palette }) => {
  it('matches docs/STYLE_GUIDE.md, slot for slot and in the same order (drift, AC13)', () => {
    const fromGuide = styleGuidePalettes().get(key);
    if (fromGuide === undefined) throw new Error(`docs/STYLE_GUIDE.md has no palettes.${key}`);
    expect(Object.keys(fromGuide)).toEqual([...LEVEL_PALETTE_SLOTS]);
    for (const slot of LEVEL_PALETTE_SLOTS) {
      const guideValue = fromGuide[slot];
      expect(typeof guideValue, `palettes.${key}.${slot}`).toBe('string');
      expect(palette[slot].toUpperCase(), `${key}.${slot}`).toBe(String(guideValue).toUpperCase());
    }
  });

  it('lists its slots in slot order (AC3)', () => {
    expect(Object.keys(palette)).toEqual([...LEVEL_PALETTE_SLOTS]);
  });

  it('writes every value as an uppercase #RRGGBB', () => {
    for (const slot of LEVEL_PALETTE_SLOTS) {
      expect(palette[slot], `${key}.${slot}`).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('has no warm slot outside Rowan, his fire family and Emberwood’s lantern (check 1)', () => {
    const allowed = new Set<LevelPaletteSlot>(ALLOWED_WARM);
    if (key === 'emberwood') allowed.add('lantern');
    const strayWarm = LEVEL_PALETTE_SLOTS.filter(
      (slot) => !allowed.has(slot) && isWarm(palette[slot]),
    );
    expect(strayWarm).toEqual([]);
  });

  it('keeps the fire family warm (NR103: pickups look warm)', () => {
    for (const slot of FIRE_FAMILY_SLOTS) expect(isWarm(palette[slot]), slot).toBe(true);
  });

  it('makes pit the darkest slot, strictly (check 4)', () => {
    const pit = luminance(palette.pit);
    for (const slot of LEVEL_PALETTE_SLOTS) {
      if (slot !== 'pit') expect(luminance(palette[slot]), slot).toBeGreaterThan(pit);
    }
  });

  it('makes water darker than every slot but pit, foregroundDark and ink (check 4)', () => {
    const water = luminance(palette.water);
    for (const slot of LEVEL_PALETTE_SLOTS) {
      if (slot === 'water' || DARKER_THAN_WATER.includes(slot)) continue;
      expect(luminance(palette[slot]), slot).toBeGreaterThan(water);
    }
  });
});

describe('across the levels', () => {
  it('keeps Emberwood’s lantern less saturated than Rowan’s glow and his fire family (check 2)', () => {
    const lantern = hsl(EMBERWOOD_PALETTE.lantern).saturation;
    for (const slot of MORE_SATURATED_THAN_LANTERN) {
      expect(hsl(EMBERWOOD_PALETTE[slot]).saturation, slot).toBeGreaterThan(lantern);
    }
  });

  it('lights no lantern outside Emberwood (check 3)', () => {
    expect(isWarm(EMBERWOOD_PALETTE.lantern)).toBe(true);
    expect(isWarm(DROWNED_MILL_PALETTE.lantern)).toBe(false);
    expect(isWarm(HARROWMERE_PALETTE.lantern)).toBe(false);
  });

  it('gives Rowan, his fire family and the markers the same value in every level', () => {
    for (const slot of SHARED_SLOTS) {
      expect(DROWNED_MILL_PALETTE[slot], slot).toBe(EMBERWOOD_PALETTE[slot]);
      expect(HARROWMERE_PALETTE[slot], slot).toBe(EMBERWOOD_PALETTE[slot]);
    }
  });
});

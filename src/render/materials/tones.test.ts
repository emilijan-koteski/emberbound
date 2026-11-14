// The tone rule (docs/STYLE_GUIDE.md §2, Shading; story 0.9, AC3 and AC9): mid is the slot as it is,
// lit moves toward the key light's colour, shadow toward the fill light's, and pits and water never
// get lighter. Hex values come from the palette modules, never retyped.
import { Color, ColorManagement, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { LEVEL_PALETTE_SLOTS } from '../../core/paletteSlots.ts';
import type { LevelPalette, LevelPaletteSlot } from '../../core/paletteSlots.ts';
import { DROWNED_MILL_RIG } from '../lighting/drownedMill.ts';
import { EMBERWOOD_RIG } from '../lighting/emberwood.ts';
import { HARROWMERE_RIG } from '../lighting/harrowmere.ts';
import type { LightingRig } from '../lighting/lightingRig.ts';
import { DROWNED_MILL_PALETTE } from '../palettes/drownedMill.ts';
import { EMBERWOOD_PALETTE } from '../palettes/emberwood.ts';
import { HARROWMERE_PALETTE } from '../palettes/harrowmere.ts';
import { SHADING } from './shading.ts';
import { NEVER_LIGHTER_SLOTS, slotToneHexes, slotTones } from './tones.ts';

const LEVELS = [
  { name: 'emberwood', palette: EMBERWOOD_PALETTE, rig: EMBERWOOD_RIG },
  { name: 'drowned-mill', palette: DROWNED_MILL_PALETTE, rig: DROWNED_MILL_RIG },
  { name: 'harrowmere', palette: HARROWMERE_PALETTE, rig: HARROWMERE_RIG },
] as const satisfies readonly { name: string; palette: LevelPalette; rig: LightingRig }[];

const LUMA = ColorManagement.getLuminanceCoefficients(new Vector3());

function luminance(color: Color): number {
  return LUMA.x * color.r + LUMA.y * color.g + LUMA.z * color.b;
}

/** Where a colour sits on the hue plane, whatever its brightness: each channel over their sum. */
function chromaticity(color: Color): readonly [number, number, number] {
  const sum = color.r + color.g + color.b;
  return [color.r / sum, color.g / sum, color.b / sum];
}

function chromaDistance(a: Color, b: Color): number {
  const [ar, ag, ab] = chromaticity(a);
  const [br, bg, bb] = chromaticity(b);
  return Math.hypot(ar - br, ag - bg, ab - bb);
}

/** Float slack for "the same hue": uniform scaling keeps chromaticity up to rounding. */
const SAME_HUE = 1e-9;

function isNeverLighter(slot: LevelPaletteSlot): boolean {
  return (NEVER_LIGHTER_SLOTS as readonly LevelPaletteSlot[]).includes(slot);
}

describe.each(LEVELS)('tones in $name', ({ palette, rig }) => {
  const keyColor = new Color(palette[rig.key.color]);
  const fillColor = new Color(palette[rig.fill.color]);

  it('makes mid the slot’s colour exactly, for every slot', () => {
    for (const slot of LEVEL_PALETTE_SLOTS) {
      expect(slotTones(palette, rig, slot).mid.equals(new Color(palette[slot])), slot).toBe(true);
    }
  });

  it('moves lit’s hue toward the key colour and shadow’s toward the fill colour', () => {
    for (const slot of LEVEL_PALETTE_SLOTS) {
      if (isNeverLighter(slot)) continue;
      const { lit, mid, shadow } = slotTones(palette, rig, slot);
      // A slot that is the light's own colour can't move toward it: its hue stays the slot's.
      if (slot === rig.key.color)
        expect(chromaDistance(lit, mid), `${slot} lit`).toBeLessThan(SAME_HUE);
      else
        expect(chromaDistance(lit, keyColor), `${slot} lit`).toBeLessThan(
          chromaDistance(mid, keyColor),
        );
      if (slot === rig.fill.color)
        expect(chromaDistance(shadow, mid), `${slot} shadow`).toBeLessThan(SAME_HUE);
      else
        expect(chromaDistance(shadow, fillColor), `${slot} shadow`).toBeLessThan(
          chromaDistance(mid, fillColor),
        );
    }
  });

  it('keeps the three tones in order: lit lighter than mid, shadow darker, by at least the step', () => {
    for (const slot of LEVEL_PALETTE_SLOTS) {
      if (isNeverLighter(slot)) continue;
      const { lit, mid, shadow } = slotTones(palette, rig, slot);
      expect(luminance(lit), `${slot} lit`).toBeGreaterThan(luminance(mid));
      expect(luminance(shadow), `${slot} shadow`).toBeLessThanOrEqual(
        luminance(mid) * (1 - SHADING.minToneStep) * (1 + SAME_HUE),
      );
      // Lit reaches the full step unless a channel would pass 1 (its hue is kept, not clipped).
      const isCapped = Math.max(lit.r, lit.g, lit.b) > 1 - SAME_HUE;
      if (!isCapped)
        expect(luminance(lit), `${slot} lit step`).toBeGreaterThanOrEqual(
          luminance(mid) * (1 + SHADING.minToneStep) * (1 - SAME_HUE),
        );
    }
  });

  it('never lightens pits and water: every tone is mid', () => {
    for (const slot of NEVER_LIGHTER_SLOTS) {
      const { lit, mid, shadow } = slotTones(palette, rig, slot);
      expect(lit.equals(mid), `${slot} lit`).toBe(true);
      expect(shadow.equals(mid), `${slot} shadow`).toBe(true);
    }
  });

  it('gives the page the same tones as hex, mid as the palette writes it', () => {
    for (const slot of LEVEL_PALETTE_SLOTS) {
      const tones = slotTones(palette, rig, slot);
      const hexes = slotToneHexes(palette, rig, slot);
      expect(hexes.mid, slot).toBe(palette[slot].toUpperCase());
      expect(new Color(hexes.lit).getHex(), slot).toBe(tones.lit.getHex());
      expect(new Color(hexes.shadow).getHex(), slot).toBe(tones.shadow.getHex());
    }
  });
});

describe('the never-lighter slots', () => {
  it('are pits and water (NR102)', () => {
    expect([...NEVER_LIGHTER_SLOTS].sort()).toEqual(['pit', 'water']);
  });
});

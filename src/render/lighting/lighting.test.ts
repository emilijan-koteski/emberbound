// The lighting rigs' rules (docs/STYLE_GUIDE.md, sections 2 and 3; AC9, AC12): warm light only for
// Rowan and his fire family, lanterns in Emberwood alone, and cold key, fill and fog.
import { describe, expect, it } from 'vitest';
import type { LevelPalette } from '../../core/paletteSlots.ts';
import { DROWNED_MILL_PALETTE } from '../palettes/drownedMill.ts';
import { EMBERWOOD_PALETTE } from '../palettes/emberwood.ts';
import { HARROWMERE_PALETTE } from '../palettes/harrowmere.ts';
import { isWarm } from '../palettes/warmth.ts';
import { DROWNED_MILL_RIG } from './drownedMill.ts';
import { EMBERWOOD_RIG } from './emberwood.ts';
import { HARROWMERE_RIG } from './harrowmere.ts';
import { FIRE_FAMILY } from './lightingRig.ts';
import type { Direction, LightingRig, WarmCarrier } from './lightingRig.ts';

const LEVELS = [
  { name: 'emberwood', rig: EMBERWOOD_RIG, palette: EMBERWOOD_PALETTE, hasLanterns: true },
  {
    name: 'drowned-mill',
    rig: DROWNED_MILL_RIG,
    palette: DROWNED_MILL_PALETTE,
    hasLanterns: false,
  },
  { name: 'harrowmere', rig: HARROWMERE_RIG, palette: HARROWMERE_PALETTE, hasLanterns: false },
] as const satisfies readonly {
  name: string;
  rig: LightingRig;
  palette: LevelPalette;
  hasLanterns: boolean;
}[];

function count(list: readonly WarmCarrier[], carrier: WarmCarrier): number {
  return list.filter((each) => each === carrier).length;
}

function length(direction: Direction): number {
  return Math.hypot(direction.x, direction.y, direction.z);
}

describe.each(LEVELS)('the $name rig', ({ name, rig, palette, hasLanterns }) => {
  it('allows warm light for Rowan and each of his fire family exactly once', () => {
    for (const carrier of FIRE_FAMILY) expect(count(rig.warmLight, carrier), carrier).toBe(1);
  });

  it(`allows ${hasLanterns ? 'the lanterns, once, and ' : ''}nothing else warm`, () => {
    const allowed = new Set<WarmCarrier>(FIRE_FAMILY);
    if (hasLanterns) allowed.add('lantern');
    expect(rig.warmLight.filter((carrier) => !allowed.has(carrier))).toEqual([]);
    expect(count(rig.warmLight, 'lantern')).toBe(hasLanterns ? 1 : 0);
    expect(rig.warmLight).toHaveLength(allowed.size);
  });

  it(`${hasLanterns ? 'has' : 'has no'} lanterns, matching its warm list`, () => {
    expect(rig.lanterns !== null).toBe(hasLanterns);
    expect(rig.lanterns !== null).toBe(rig.warmLight.includes('lantern'));
  });

  it('lights with cold colours: key, fill, fog and ground fog are not warm', () => {
    const slots = [rig.key.color, rig.fill.color, rig.fog.color];
    if (rig.groundFog !== null) slots.push(rig.groundFog.color);
    for (const slot of slots) expect(isWarm(palette[slot]), `${name}: ${slot}`).toBe(false);
  });

  it('takes the style guide’s slots for its key and fog', () => {
    expect(rig.key.color).toBe('skyGlow');
    expect(rig.fog.color).toBe('fog');
    if (rig.lanterns !== null) expect(rig.lanterns.color).toBe('lantern');
  });

  it('has numbers of a usable shape (not a tuning check)', () => {
    for (const light of [rig.key, rig.fill]) {
      expect(light.intensity).toBeGreaterThan(0);
      expect(length(light.from)).toBeGreaterThan(0);
    }
    expect(rig.fog.startDepth).toBeGreaterThanOrEqual(0);
    expect(rig.fog.fullDepth).toBeGreaterThan(rig.fog.startDepth);
    expect(rig.fog.maxAmount).toBeGreaterThan(0);
    expect(rig.fog.maxAmount).toBeLessThanOrEqual(1);
    if (rig.groundFog !== null) {
      expect(rig.groundFog.heightTiles).toBeGreaterThan(0);
      expect(rig.groundFog.maxAmount).toBeGreaterThan(0);
      expect(rig.groundFog.maxAmount).toBeLessThanOrEqual(1);
    }
    if (rig.lanterns !== null) {
      expect(rig.lanterns.reachTiles).toBeGreaterThan(0);
      expect(rig.lanterns.intensity).toBeGreaterThan(0);
    }
  });
});

describe('the fills (style guide, section 2)', () => {
  it('are plum in Emberwood and cold teal-grey or blue-grey elsewhere', () => {
    expect(EMBERWOOD_RIG.fill.color).toBe('bark');
    expect(DROWNED_MILL_RIG.fill.color).toBe('treeMid');
    expect(HARROWMERE_RIG.fill.color).toBe('treeMid');
  });
});

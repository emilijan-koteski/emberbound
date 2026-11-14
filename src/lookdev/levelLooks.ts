// The three levels' looks, for the look-dev page: id, label, the style guide's key, palette and rig
// (story 0.9, D14; lifted from palettesView.ts, as story 0.7's notes suggested). Development only.
// The game's own level list (ids, order, display names) is content/levels.ts, from Epic 1.
import type { LevelPalette } from '../core/paletteSlots.ts';
import { DROWNED_MILL_RIG } from '../render/lighting/drownedMill.ts';
import { EMBERWOOD_RIG } from '../render/lighting/emberwood.ts';
import { HARROWMERE_RIG } from '../render/lighting/harrowmere.ts';
import type { LightingRig } from '../render/lighting/lightingRig.ts';
import { DROWNED_MILL_PALETTE } from '../render/palettes/drownedMill.ts';
import { EMBERWOOD_PALETTE } from '../render/palettes/emberwood.ts';
import { HARROWMERE_PALETTE } from '../render/palettes/harrowmere.ts';

export interface LevelLook {
  /** The level id (kebab-case, the level-id rule). */
  readonly id: string;
  readonly label: string;
  /** The level's key under the style guide's `palettes:` (camelCase there). */
  readonly guideKey: string;
  readonly palette: LevelPalette;
  readonly rig: LightingRig;
}

export const LEVEL_LOOKS: readonly LevelLook[] = [
  {
    id: 'emberwood',
    label: 'Emberwood',
    guideKey: 'emberwood',
    palette: EMBERWOOD_PALETTE,
    rig: EMBERWOOD_RIG,
  },
  {
    id: 'drowned-mill',
    label: 'The Drowned Mill',
    guideKey: 'drownedMill',
    palette: DROWNED_MILL_PALETTE,
    rig: DROWNED_MILL_RIG,
  },
  {
    id: 'harrowmere',
    label: 'Harrowmere',
    guideKey: 'harrowmere',
    palette: HARROWMERE_PALETTE,
    rig: HARROWMERE_RIG,
  },
];

export function findLevelLook(id: string): LevelLook | undefined {
  return LEVEL_LOOKS.find((level) => level.id === id);
}

/** The level's look; throws, naming the known ids, for an unknown one (a view then ends in error). */
export function levelLookOrThrow(id: string): LevelLook {
  const level = findLevelLook(id);
  if (level === undefined) {
    throw new Error(
      `Unknown level "${id}" (known: ${LEVEL_LOOKS.map((each) => each.id).join(', ')})`,
    );
  }
  return level;
}

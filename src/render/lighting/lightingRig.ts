// The shape of a level's lighting rig: key, fill, fog, and where warm light is allowed (AR165;
// docs/STYLE_GUIDE.md, section 2 "Lighting, per level", and section 3). Plain data, no three.js:
// render/materials/ turns a rig into lights and fog (story 0.9; story 0.7, D3).
//
// Units and axes (story 0.7, D10–D11):
// - Colours are palette slot names, never hex, so a rig and its palette can't disagree (D6).
// - Directions are where the light comes from, in world axes: x right, y up, z toward the viewer;
//   the play plane is z = 0, so "behind" is negative z. Unnormalised; the materials normalise.
// - Depths are tiles behind the play plane, not distances from the camera, since the camera's
//   distance is set by story 0.10.
// - Intensities are relative, Emberwood's key = 1. What an intensity means for banded shading is a
//   material setting (story 0.9); every number is judged on the test scene (story 0.12).
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';

/** What may carry warm light. `lantern` is allowed in Emberwood only (NR101). */
export type WarmCarrier = 'rowan' | 'shot' | 'ember' | 'bell' | 'weaponPickup' | 'lantern';

/**
 * Rowan and his fire family: his shots, the collectables (embers and bells) and the weapon pickups.
 * Every level allows exactly these warm, and Emberwood adds the lanterns (NFR28).
 */
export const FIRE_FAMILY = [
  'rowan',
  'shot',
  'ember',
  'bell',
  'weaponPickup',
] as const satisfies readonly WarmCarrier[];

export interface Direction {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface RigLight {
  readonly color: LevelPaletteSlot;
  /** Where the light comes from (not where it points). */
  readonly from: Direction;
  /** Relative; Emberwood's key = 1. */
  readonly intensity: number;
}

export interface RigFog {
  readonly color: LevelPaletteSlot;
  /** Tiles behind the play plane where the fog begins. */
  readonly startDepth: number;
  /** Tiles behind the play plane where it reaches `maxAmount`. */
  readonly fullDepth: number;
  /** 0 to 1: how much fog colour the farthest things take, so far ridges still read. */
  readonly maxAmount: number;
}

/** A low fog lying over the ground or water, thickest at the bottom. */
export interface RigGroundFog {
  readonly color: LevelPaletteSlot;
  /** Tiles above the ground line where it fades out. */
  readonly heightTiles: number;
  /** 0 to 1, at the ground line. */
  readonly maxAmount: number;
}

/** Small warm point lights hung from ledges and trunks, lighting only what they hang from. */
export interface RigLanterns {
  readonly color: LevelPaletteSlot;
  readonly reachTiles: number;
  /** Relative; Emberwood's key = 1. */
  readonly intensity: number;
}

export interface LightingRig {
  readonly key: RigLight;
  readonly fill: RigLight;
  readonly fog: RigFog;
  /** The Drowned Mill's low fog over water; null elsewhere. */
  readonly groundFog: RigGroundFog | null;
  /** What may carry warm light in this level. Rowan's own small lights are story 0.9's. */
  readonly warmLight: readonly WarmCarrier[];
  /** Emberwood's lanterns; null where the level has none. */
  readonly lanterns: RigLanterns | null;
}

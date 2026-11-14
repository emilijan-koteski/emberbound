// The fire family's own warm lights (docs/STYLE_GUIDE.md §2, Lighting per level): which members carry
// a small warm point light, its colour, reach and strength. Decided by the developer at story 0.9's
// creation (2026-11-14, D8): Rowan and his shots light the surfaces near them; embers, bells and
// weapon pickups glow (the effect material) and light nothing. Lanterns are the rig's (Emberwood).
// Rowan's own light doesn't light Rowan (decided on the look-dev page, 2026-11-14): a light at his
// skin paints a hard stripe on him. Story 2.7 applies it to his model and picks how: lanterns may
// still warm him, which canReceiveWarmLight: false alone would forbid.
// Plain data, no three.js: render/materials/look.ts turns these into shader uniforms.
//
// The same in every level: Rowan's light is his, not the level's. Every number is a starting guess
// (†), judged in story 0.9's critic loop and on story 0.12's test scene. Intensities are relative,
// on the rigs' scale (Emberwood's key = 1).
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { WarmCarrier } from './lightingRig.ts';

export interface FireLight {
  /** A warm slot, so the light is the same colour as the glow that carries it. */
  readonly color: LevelPaletteSlot;
  /** Surfaces farther than this from the light take none of it (a hard edge). */
  readonly reachTiles: number;
  /** Relative; × SHADING.warmLift is how far a surface in reach moves toward the colour. */
  readonly intensity: number;
}

export const FIRE_LIGHTS = {
  // His chest furnace, about 1 to 2 tiles (style guide §2).
  rowan: { color: 'heroGlow', reachTiles: 1.5, intensity: 0.5 }, // †
  // A shot in flight: a smaller, moving warm light.
  shot: { color: 'shot', reachTiles: 1, intensity: 0.4 }, // †
} as const satisfies Partial<Record<WarmCarrier, FireLight>>;

/** The members that carry a light of their own. */
export type FireLightCarrier = keyof typeof FIRE_LIGHTS;

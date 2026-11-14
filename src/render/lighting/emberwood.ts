// Emberwood's lighting rig: a dusk forest lit by lanterns (docs/STYLE_GUIDE.md, section 2,
// "Lighting, per level"). Every number marked † is a starting guess: story 0.9 decides what an
// intensity means for the banded shading, and story 0.12 judges them all on the test scene.
// Units and axes: lightingRig.ts.
import { FIRE_FAMILY } from './lightingRig.ts';
import type { LightingRig } from './lightingRig.ts';

export const EMBERWOOD_RIG: LightingRig = {
  // Cold moonlit teal-white, from the upper right and behind; medium.
  key: { color: 'skyGlow', from: { x: 0.6, y: 0.8, z: -0.5 }, intensity: 1 }, // † (the reference: 1)
  // Dim plum, from the lower left; low.
  fill: { color: 'bark', from: { x: -0.6, y: -0.3, z: 0.7 }, intensity: 0.35 }, // †
  // Teal, from the middle distance back. "Thickest over pits and the far layer" is staging and
  // materials (stories 0.9, 0.12), not rig data.
  fog: { color: 'fog', startDepth: 4, fullDepth: 40, maxAmount: 0.85 }, // †
  groundFog: null,
  warmLight: [...FIRE_FAMILY, 'lantern'],
  // Small warm point lights, short reach, lighting only the ledge or trunk they hang from.
  lanterns: { color: 'lantern', reachTiles: 1.5, intensity: 0.6 }, // †
};

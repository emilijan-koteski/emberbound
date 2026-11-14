// The Drowned Mill's lighting rig: fog over a marsh, black water, turning wheels
// (docs/STYLE_GUIDE.md, section 2, "Lighting, per level"). Every number marked † is a starting
// guess: story 0.9 decides what an intensity means for the banded shading, and story 0.12 judges
// them all on the test scene. Units and axes: lightingRig.ts.
import { FIRE_FAMILY } from './lightingRig.ts';
import type { LightingRig } from './lightingRig.ts';

export const DROWNED_MILL_RIG: LightingRig = {
  // Pale grey-green, from overhead, overcast; low.
  key: { color: 'skyGlow', from: { x: 0, y: 1, z: 0.2 }, intensity: 0.6 }, // †
  // Cold teal-grey; low. The style guide gives no direction: from the front is a guess.
  fill: { color: 'treeMid', from: { x: 0, y: -0.2, z: 1 }, intensity: 0.3 }, // †
  // Grey-teal, the densest of the three, starting nearer.
  fog: { color: 'fog', startDepth: 2, fullDepth: 25, maxAmount: 0.9 }, // †
  // A low ground fog over water.
  groundFog: { color: 'fog', heightTiles: 1, maxAmount: 0.5 }, // †
  // Almost no warmth: Rowan and his fire family only, no lanterns (NR100, NR101).
  warmLight: [...FIRE_FAMILY],
  lanterns: null,
};

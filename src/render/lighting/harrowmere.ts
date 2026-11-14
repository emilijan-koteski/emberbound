// Harrowmere's lighting rig: charred ruins, cold grey ash, the coldest place in the game
// (docs/STYLE_GUIDE.md, section 2, "Lighting, per level"). Every number marked † is a starting
// guess: story 0.9 decides what an intensity means for the banded shading, and story 0.12 judges
// them all on the test scene. Units and axes: lightingRig.ts.
import { FIRE_FAMILY } from './lightingRig.ts';
import type { LightingRig } from './lightingRig.ts';

export const HARROWMERE_RIG: LightingRig = {
  // Ash blue-grey, from the high left, flat; low to medium.
  key: { color: 'skyGlow', from: { x: -0.6, y: 0.9, z: 0.3 }, intensity: 0.8 }, // †
  // Near-neutral blue-grey; low. The style guide gives no direction: from the front right is a
  // guess.
  fill: { color: 'treeMid', from: { x: 0.4, y: -0.1, z: 1 }, intensity: 0.3 }, // †
  // Ash grey, a medium haze.
  fog: { color: 'fog', startDepth: 3, fullDepth: 32, maxAmount: 0.85 }, // †
  groundFog: null,
  // No warm light but Rowan's and his fire family's (NR100), no lanterns (NR101).
  warmLight: [...FIRE_FAMILY],
  lanterns: null,
};

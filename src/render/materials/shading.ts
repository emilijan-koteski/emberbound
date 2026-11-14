// The shading settings: how the style guide's banded rule is drawn (docs/STYLE_GUIDE.md §2, Shading).
// Every number here is a starting guess (†), tuned with the developer in story 0.9's critic loop and
// judged again on story 0.12's test scene. Look data, not gameplay, so not sim/config.ts (AR248).
//
// What a rig intensity means (story 0.9, D4, as revised in its critic loop): with N the surface's world
// normal and key and fill the directions the lights come from,
//   key term  = key.intensity × (N·key)            signed: a surface facing away scores below 0
//   fill term = fill.intensity × max(N·fill, 0)
// A surface whose key term is at or above `litFrom` takes the lit tone. Otherwise, one whose key term
// plus fill term is below `shadowBelow` takes the shadow tone, and the rest take mid. The key alone
// decides lit, so a surface lit only by the fill never takes the key's colour. The fill lifts surfaces
// near the shadow line back into mid; a surface turned fully away from the key stays in shadow even
// where the fill reaches it (code review, 2026-11-14). So the rig's lights decide WHICH tone a surface takes, and the
// settings below decide WHAT each tone looks like: lit is the slot moved `litLift` of the way to the
// key colour, shadow the slot moved `shadowPull` of the way to the fill colour, and then lit is kept
// at least `minToneStep` brighter than mid and shadow at least that much darker
// (render/materials/tones.ts). A warm light's intensity times `warmLift` is how far a surface within
// its reach moves toward the warm colour.

export const SHADING = {
  /** † Key term at or above this: lit. */
  litFrom: 0.3,
  /** † Key term plus fill term below this (it may be negative): shadow. Otherwise, not lit: mid. */
  shadowBelow: -0.25,
  /** † 0 to 1: how far the lit tone moves from the slot toward the key light's colour. */
  litLift: 0.3,
  /** † 0 to 1: how far the shadow tone moves from the slot toward the fill light's colour. */
  shadowPull: 0.75,
  /**
   * † 0 to 1: the least a band steps in luminance. Lit is at least this much brighter than mid (less
   * only where a channel would pass 1: the hue is kept) and shadow at least this much darker, so a
   * slot paler than the key or darker than the fill keeps its tones in order (story 0.9, D15).
   */
  minToneStep: 0.45,
  /** † × a warm light's intensity: how far a surface in its reach moves toward its colour. */
  warmLift: 1.1,
  /** † World normal y at or above this: the ground's top slot; below, its side slot. */
  groundTopFrom: 0.7,
  /** † Warm point lights drawn at once: a fixed shader array size, so no recompile. */
  maxWarmLights: 8,
} as const;

// The level palettes' slot names: one string-literal union in core/, so content/ (story 0.13's
// cards) and render/palettes/ share them without content/ importing render/ (default X-B34).
//
// The order is docs/STYLE_GUIDE.md's (section 5 and the frontmatter's `palettes:`), and a slot's
// position is the slot index assets carry (AR164). Append only, never reorder; append in the style
// guide too, since render/palettes/palettes.test.ts checks the order against it.
//
// These are the LEVEL slots only. The story palettes for scenes outside the levels have their own
// slot list (style guide, section 8), which story 0.13 adds here as a separate union, so a warm
// `home` or `forge` slot never exists in a level palette (story 0.7, D1).

export const LEVEL_PALETTE_SLOTS = [
  // The world
  'skyFar',
  'skyGlow',
  'ridgeFar',
  'treeMid',
  'bark',
  'fog',
  'groundTop',
  'groundSide',
  'ledgeWood',
  'foliage',
  'foregroundDark',
  'ink',
  'pit',
  'water',
  'hazard',
  // Rowan
  'heroSkin',
  'heroSeam',
  'heroGlow',
  'heroScarf',
  'heroCloth',
  'heroLeather',
  'heroHorn',
  // His fire family, and the markers
  'shot',
  'ember',
  'pickupWarm',
  'bell',
  'checkpoint',
  'exit',
  // Enemies: recoloured per level by palette swap (NR104)
  'walkerBody',
  'walkerAccent',
  'flyerBody',
  'flyerAccent',
  'spitterBody',
  'spitterAccent',
  'seed',
  // Lanterns: lit in Emberwood only (NR101); the slot exists in every palette
  'lantern',
] as const;

export type LevelPaletteSlot = (typeof LEVEL_PALETTE_SLOTS)[number];

/** A colour as written in the style guide: `#RRGGBB`. The palette tests check the exact form. */
export type HexColor = `#${string}`;

/** One level's palette: a hex value for every slot. A missing or unknown slot fails the type check. */
export type LevelPalette = Readonly<Record<LevelPaletteSlot, HexColor>>;

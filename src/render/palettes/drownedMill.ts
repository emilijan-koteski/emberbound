// The Drowned Mill's palette: greyer and greener, more fog, black water; its one dominant colour is
// grey-teal. Copied from docs/STYLE_GUIDE.md (frontmatter `palettes.drownedMill`; section 5),
// derived from Emberwood under the level look and the warmth rule. palettes.test.ts fails if this
// file and the style guide differ, so change a value in the style guide first (it is the
// developer's, approved 2026-11-14), then here. Plain data: render/materials/ turns these into
// colours (story 0.9).
import type { LevelPalette } from '../../core/paletteSlots.ts';

export const DROWNED_MILL_PALETTE = {
  skyFar: '#2A3638',
  skyGlow: '#A9BFC0',
  ridgeFar: '#5E6D6E',
  treeMid: '#2F3D3E',
  bark: '#3A3638',
  fog: '#56686A',
  groundTop: '#3A4A40',
  groundSide: '#2B3533',
  ledgeWood: '#3A3F3C',
  foliage: '#34443A',
  foregroundDark: '#090C0C',
  ink: '#151719',
  pit: '#050708',
  water: '#0B1416',
  hazard: '#BDB8AC',
  heroSkin: '#545553',
  heroSeam: '#ED5E13',
  heroGlow: '#F6B025',
  heroScarf: '#8B332C',
  heroCloth: '#34393A',
  heroLeather: '#4C3F3F',
  heroHorn: '#C4B198',
  shot: '#FF8F2E',
  ember: '#F59A3C',
  pickupWarm: '#E8742A',
  bell: '#E8C27A',
  checkpoint: '#9ED6D4',
  exit: '#DCE8EA',
  walkerBody: '#35606A',
  walkerAccent: '#C7E3D0',
  flyerBody: '#2B4560',
  flyerAccent: '#BDB8AC',
  spitterBody: '#2F6A47',
  spitterAccent: '#A9D9A0',
  seed: '#CBE6A8',
  lantern: '#3C4446',
} as const satisfies LevelPalette;

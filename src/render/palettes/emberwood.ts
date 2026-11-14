// Emberwood's palette: cold teal and plum, with lantern warmth; its one dominant colour is teal.
// Copied from docs/STYLE_GUIDE.md (frontmatter `palettes.emberwood`; section 5), sampled from the
// chosen key art and hero sheet. palettes.test.ts fails if this file and the style guide differ, so
// change a value in the style guide first (it is the developer's, approved 2026-11-14), then here.
// Plain data: render/materials/ turns these into colours (story 0.9).
import type { LevelPalette } from '../../core/paletteSlots.ts';

export const EMBERWOOD_PALETTE = {
  skyFar: '#254049',
  skyGlow: '#B0E1E5',
  ridgeFar: '#5C7882',
  treeMid: '#28444D',
  bark: '#4A3A42',
  fog: '#3F5761',
  groundTop: '#335950',
  groundSide: '#2D454F',
  ledgeWood: '#373D3E',
  foliage: '#2E4F49',
  foregroundDark: '#080B0D',
  ink: '#1C1419',
  pit: '#06090B',
  water: '#142229',
  hazard: '#CFC6B6',
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
  walkerBody: '#5B3A5E',
  walkerAccent: '#A7D47A',
  flyerBody: '#3E2F55',
  flyerAccent: '#CFC6B6',
  spitterBody: '#4A5B2E',
  spitterAccent: '#9EE07A',
  seed: '#C2F07A',
  lantern: '#E0A86A',
} as const satisfies LevelPalette;

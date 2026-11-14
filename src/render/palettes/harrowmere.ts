// Harrowmere's palette: ash blue-grey, low saturation, the coldest; its one dominant colour is ash
// grey. Copied from docs/STYLE_GUIDE.md (frontmatter `palettes.harrowmere`; section 5), derived
// from Emberwood under the level look and the warmth rule. palettes.test.ts fails if this file and
// the style guide differ, so change a value in the style guide first (it is the developer's,
// approved 2026-11-14), then here. Plain data: render/materials/ turns these into colours (story
// 0.9).
import type { LevelPalette } from '../../core/paletteSlots.ts';

export const HARROWMERE_PALETTE = {
  skyFar: '#2B2F36',
  skyGlow: '#A7AFB8',
  ridgeFar: '#5C626B',
  treeMid: '#353A42',
  bark: '#2C2A2D',
  fog: '#6B727A',
  groundTop: '#4D5258',
  groundSide: '#2E3237',
  ledgeWood: '#2A2A2C',
  foliage: '#3D433F',
  foregroundDark: '#0A0B0D',
  ink: '#121317',
  pit: '#050608',
  water: '#0C1014',
  hazard: '#C8CCD0',
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
  walkerBody: '#6A6390',
  walkerAccent: '#B7C4E8',
  flyerBody: '#4B4570',
  flyerAccent: '#C8CCD0',
  spitterBody: '#3E6E62',
  spitterAccent: '#A9D6C4',
  seed: '#D3DCE8',
  lantern: '#35383D',
} as const satisfies LevelPalette;

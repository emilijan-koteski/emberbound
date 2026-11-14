// The card-silhouette factory (AR161): one flat fill from its slot, with no light and no world fog
// (docs/STYLE_GUIDE.md §8: each layer is one flat fill). Story 0.13 adds what a card needs, such as
// the story palettes' slots and per-layer fog.
import type { ShaderMaterial } from 'three';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { Look } from './look.ts';
import { createLookShaderMaterial } from './lookShader.ts';

export interface CardSilhouetteMaterialOptions {
  readonly slot: LevelPaletteSlot;
}

export function createCardSilhouetteMaterial(
  look: Look,
  options: CardSilhouetteMaterialOptions,
): ShaderMaterial {
  return createLookShaderMaterial(look, {
    kind: 'cardSilhouette',
    slot: options.slot,
    isBanded: false,
    hasFog: false,
    canReceiveWarmLight: false,
  });
}

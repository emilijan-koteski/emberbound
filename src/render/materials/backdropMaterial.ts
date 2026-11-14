// The backdrop factory (AR161): one flat tone, the slot's value, with fog, as the key art's soft
// silhouettes (story 0.9, D7). A backdrop plane faces the camera, so bands would give one tone anyway.
import type { ShaderMaterial } from 'three';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { Look } from './look.ts';
import { createLookShaderMaterial } from './lookShader.ts';

export interface BackdropMaterialOptions {
  readonly slot: LevelPaletteSlot;
}

export function createBackdropMaterial(
  look: Look,
  options: BackdropMaterialOptions,
): ShaderMaterial {
  return createLookShaderMaterial(look, {
    kind: 'backdrop',
    slot: options.slot,
    isBanded: false,
    hasFog: true,
    canReceiveWarmLight: false,
  });
}

// The prop factory (AR161): banded, one slot, for kit props, ledges, signs and markers.
import type { ShaderMaterial } from 'three';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { Look } from './look.ts';
import { createLookShaderMaterial } from './lookShader.ts';

export interface PropMaterialOptions {
  readonly slot: LevelPaletteSlot;
  /** Default true; always off for `pit` and `water`. */
  readonly canReceiveWarmLight?: boolean;
}

export function createPropMaterial(look: Look, options: PropMaterialOptions): ShaderMaterial {
  return createLookShaderMaterial(look, {
    kind: 'prop',
    slot: options.slot,
    isBanded: true,
    hasFog: true,
    canReceiveWarmLight: options.canReceiveWarmLight ?? true,
  });
}

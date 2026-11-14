// The foliage factory (AR161): banded, both faces drawn, a back face shaded with its normal flipped,
// so thin leaf planes band the same from either side.
import type { ShaderMaterial } from 'three';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { Look } from './look.ts';
import { createLookShaderMaterial } from './lookShader.ts';

export interface FoliageMaterialOptions {
  readonly slot: LevelPaletteSlot;
  /** Default true. */
  readonly canReceiveWarmLight?: boolean;
}

export function createFoliageMaterial(look: Look, options: FoliageMaterialOptions): ShaderMaterial {
  return createLookShaderMaterial(look, {
    kind: 'foliage',
    slot: options.slot,
    isBanded: true,
    isDoubleSided: true,
    hasFog: true,
    canReceiveWarmLight: options.canReceiveWarmLight ?? true,
  });
}

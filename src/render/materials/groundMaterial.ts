// The ground factory (AR161): banded, with its top slot on faces whose world normal points up and its
// side slot elsewhere (story 0.9, D6), so one material draws any ground mesh from any tool.
import type { ShaderMaterial } from 'three';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { Look } from './look.ts';
import { createLookShaderMaterial } from './lookShader.ts';

export interface GroundMaterialOptions {
  /** Walkable tops: moss, grass, ash (`groundTop`), or a ledge's planks. */
  readonly top: LevelPaletteSlot;
  /** Faces under the top (`groundSide`). */
  readonly side: LevelPaletteSlot;
  /** Default true; always off when either slot is `pit` or `water`. */
  readonly canReceiveWarmLight?: boolean;
}

export function createGroundMaterial(look: Look, options: GroundMaterialOptions): ShaderMaterial {
  return createLookShaderMaterial(look, {
    kind: 'ground',
    slot: options.side,
    topSlot: options.top,
    isBanded: true,
    hasFog: true,
    canReceiveWarmLight: options.canReceiveWarmLight ?? true,
  });
}

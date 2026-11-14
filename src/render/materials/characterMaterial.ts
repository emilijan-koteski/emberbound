// The character factory (AR161): banded, for Rowan and the enemies; or, with `isGlowing`, unshaded,
// for Rowan's glowing seams, chest and eyes (docs/STYLE_GUIDE.md §2: glowing parts ignore the bands).
// Works on a SkinnedMesh: the shared shader uses three.js's skinning chunks.
import type { ShaderMaterial } from 'three';
import { invariant } from '../../core/invariant.ts';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { Look } from './look.ts';
import { createLookShaderMaterial } from './lookShader.ts';

/**
 * The only character parts that glow: Rowan's seams, and his chest and eyes. His scarf and horns are
 * warm colours on surfaces, not lights (style guide §3).
 */
export const ROWAN_GLOW_SLOTS = [
  'heroSeam',
  'heroGlow',
] as const satisfies readonly LevelPaletteSlot[];

export interface CharacterMaterialOptions {
  readonly slot: LevelPaletteSlot;
  /** Unshaded, at full brightness: only for ROWAN_GLOW_SLOTS. */
  readonly isGlowing?: boolean;
  /** Default true, for banded parts; a glowing part takes no light. */
  readonly canReceiveWarmLight?: boolean;
}

export function createCharacterMaterial(
  look: Look,
  options: CharacterMaterialOptions,
): ShaderMaterial {
  const isGlowing = options.isGlowing === true;
  if (isGlowing) {
    invariant(
      (ROWAN_GLOW_SLOTS as readonly LevelPaletteSlot[]).includes(options.slot),
      `"${options.slot}" can't glow: only Rowan's seams and glow do (${ROWAN_GLOW_SLOTS.join(', ')})`,
    );
  }
  return createLookShaderMaterial(look, {
    kind: 'character',
    slot: options.slot,
    isBanded: !isGlowing,
    hasFog: true,
    canReceiveWarmLight: options.canReceiveWarmLight ?? true,
    ...(isGlowing ? { glowCarrier: 'rowan' as const } : {}),
  });
}

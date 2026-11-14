// The effect factory (AR161): unshaded, the slot's colour at full brightness, with fog (shots, embers,
// the bell's glint, lantern glass; docs/STYLE_GUIDE.md §2). A warm slot must name a carrier the rig
// lists, so warm glows exist only where the level allows them (NFR28; story 0.9, AC12).
import type { ShaderMaterial } from 'three';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { WarmCarrier } from '../lighting/lightingRig.ts';
import type { Look } from './look.ts';
import { createLookShaderMaterial } from './lookShader.ts';

export interface EffectMaterialOptions {
  readonly slot: LevelPaletteSlot;
  /** Who carries the glow, or null for a cold effect. Required, so every glow says whose it is. */
  readonly carrier: WarmCarrier | null;
}

export function createEffectMaterial(look: Look, options: EffectMaterialOptions): ShaderMaterial {
  return createLookShaderMaterial(look, {
    kind: 'effect',
    slot: options.slot,
    isBanded: false,
    hasFog: true,
    canReceiveWarmLight: false,
    glowCarrier: options.carrier,
  });
}

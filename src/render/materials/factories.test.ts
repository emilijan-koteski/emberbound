// The seven factories (story 0.9, AC1–AC3, AC6–AC7, AC12): each returns a ShaderMaterial that shares
// its look's uniforms, takes colours from palette slots only, and keeps warm light to what the rig
// lists. Shaders can't compile in Node (no WebGL); the look-dev checks compile them in Chromium.
import { DoubleSide, ShaderMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import type { LevelPalette } from '../../core/paletteSlots.ts';
import { DROWNED_MILL_RIG } from '../lighting/drownedMill.ts';
import { EMBERWOOD_RIG } from '../lighting/emberwood.ts';
import { HARROWMERE_RIG } from '../lighting/harrowmere.ts';
import type { LightingRig } from '../lighting/lightingRig.ts';
import { DROWNED_MILL_PALETTE } from '../palettes/drownedMill.ts';
import { EMBERWOOD_PALETTE } from '../palettes/emberwood.ts';
import { HARROWMERE_PALETTE } from '../palettes/harrowmere.ts';
import { createBackdropMaterial } from './backdropMaterial.ts';
import { createCardSilhouetteMaterial } from './cardSilhouetteMaterial.ts';
import { createCharacterMaterial } from './characterMaterial.ts';
import { createEffectMaterial } from './effectMaterial.ts';
import { createFoliageMaterial } from './foliageMaterial.ts';
import { createGroundMaterial } from './groundMaterial.ts';
import { createLook } from './look.ts';
import type { Look } from './look.ts';
import { createPropMaterial } from './propMaterial.ts';
import { SHADING } from './shading.ts';
import { slotTones } from './tones.ts';

const LEVELS = [
  { name: 'emberwood', palette: EMBERWOOD_PALETTE, rig: EMBERWOOD_RIG },
  { name: 'drowned-mill', palette: DROWNED_MILL_PALETTE, rig: DROWNED_MILL_RIG },
  { name: 'harrowmere', palette: HARROWMERE_PALETTE, rig: HARROWMERE_RIG },
] as const satisfies readonly { name: string; palette: LevelPalette; rig: LightingRig }[];

const [EMBERWOOD, DROWNED_MILL] = LEVELS;

function emberwoodLook(): Look {
  return createLook(EMBERWOOD.palette, EMBERWOOD.rig);
}

/** Every factory, called with an ordinary slot, so the shared checks run over all seven. */
const FACTORIES = [
  {
    kind: 'ground',
    make: (look: Look) => createGroundMaterial(look, { top: 'groundTop', side: 'groundSide' }),
    slot: 'groundSide',
    defines: ['LOOK_BANDED', 'LOOK_GROUND'],
  },
  {
    kind: 'foliage',
    make: (look: Look) => createFoliageMaterial(look, { slot: 'foliage' }),
    slot: 'foliage',
    defines: ['LOOK_BANDED', 'LOOK_DOUBLE_SIDED'],
  },
  {
    kind: 'character',
    make: (look: Look) => createCharacterMaterial(look, { slot: 'heroSkin' }),
    slot: 'heroSkin',
    defines: ['LOOK_BANDED'],
  },
  {
    kind: 'prop',
    make: (look: Look) => createPropMaterial(look, { slot: 'ledgeWood' }),
    slot: 'ledgeWood',
    defines: ['LOOK_BANDED'],
  },
  {
    kind: 'effect',
    make: (look: Look) => createEffectMaterial(look, { slot: 'ember', carrier: 'ember' }),
    slot: 'ember',
    defines: [],
  },
  {
    kind: 'backdrop',
    make: (look: Look) => createBackdropMaterial(look, { slot: 'treeMid' }),
    slot: 'treeMid',
    defines: [],
  },
  {
    kind: 'cardSilhouette',
    make: (look: Look) => createCardSilhouetteMaterial(look, { slot: 'ridgeFar' }),
    slot: 'ridgeFar',
    defines: ['LOOK_NO_FOG'],
  },
] as const;

const SHADING_DEFINES = ['LOOK_BANDED', 'LOOK_GROUND', 'LOOK_DOUBLE_SIDED', 'LOOK_NO_FOG'] as const;

function receivesWarm(material: ShaderMaterial): number {
  return (material.uniforms.uReceivesWarm as { value: number }).value;
}

describe.each(FACTORIES)('the $kind factory', ({ kind, make, slot, defines }) => {
  it('returns a ShaderMaterial named for its kind and slot', () => {
    const material = make(emberwoodLook());
    expect(material).toBeInstanceOf(ShaderMaterial);
    expect(material.name).toContain(kind);
    expect(material.name).toContain(slot);
  });

  it('shares its look’s uniform objects and its slot’s tones, not copies', () => {
    const look = emberwoodLook();
    const material = make(look);
    for (const [key, uniform] of Object.entries(look.uniforms)) {
      expect(material.uniforms[key], key).toBe(uniform);
    }
    const tones = look.tones(slot);
    expect(material.uniforms.uLit).toBe(tones.uLit);
    expect(material.uniforms.uMid).toBe(tones.uMid);
    expect(material.uniforms.uShadow).toBe(tones.uShadow);
  });

  it('sets exactly its kind’s shading defines, and the warm-light array size', () => {
    const material = make(emberwoodLook());
    const set = SHADING_DEFINES.filter((name) => name in material.defines);
    expect(set).toEqual([...defines]);
    expect(material.defines.MAX_WARM_LIGHTS).toBe(SHADING.maxWarmLights);
  });

  // apply() touches only shared uniform values: it never sets needsUpdate, so the version stays put.
  // This guards against a future apply() that would (a recompile); the live check is P5's.
  it('recolours in place when its look is applied, with no recompile', () => {
    const look = emberwoodLook();
    const material = make(look);
    const { version } = material;
    look.apply(DROWNED_MILL.palette, DROWNED_MILL.rig);
    const expected = slotTones(DROWNED_MILL.palette, DROWNED_MILL.rig, slot);
    expect(
      (material.uniforms.uMid as { value: { equals(other: unknown): boolean } }).value.equals(
        expected.mid,
      ),
    ).toBe(true);
    expect(material.version).toBe(version);
  });
});

describe('the shader source', () => {
  it('uses three.js’s skinning, instancing, batching and morph chunks, so any mesh draws', () => {
    const { vertexShader } = createPropMaterial(emberwoodLook(), { slot: 'ledgeWood' });
    for (const chunk of [
      '<skinning_pars_vertex>',
      '<skinbase_vertex>',
      '<skinnormal_vertex>',
      '<skinning_vertex>',
      '<batching_pars_vertex>',
      '<batching_vertex>',
      '<morphtarget_pars_vertex>',
      '<morphtarget_vertex>',
      '<project_vertex>',
    ]) {
      expect(vertexShader, chunk).toContain(`#include ${chunk}`);
    }
    expect(vertexShader).toContain('USE_INSTANCING');
  });

  it('writes the output colour space, and names nothing "worldPosition" (story 0.11’s shadow chunks do)', () => {
    const { vertexShader, fragmentShader } = createPropMaterial(emberwoodLook(), {
      slot: 'ledgeWood',
    });
    expect(fragmentShader).toContain('#include <colorspace_fragment>');
    expect(`${vertexShader}\n${fragmentShader}`).not.toMatch(/\bworldPosition\b/);
  });
});

describe('foliage', () => {
  it('draws both faces', () => {
    expect(createFoliageMaterial(emberwoodLook(), { slot: 'foliage' }).side).toBe(DoubleSide);
  });
});

describe('the ground', () => {
  it('shares the top slot’s tones as its top uniforms', () => {
    const look = emberwoodLook();
    const material = createGroundMaterial(look, { top: 'groundTop', side: 'groundSide' });
    expect(material.uniforms.uTopLit).toBe(look.tones('groundTop').uLit);
    expect(material.uniforms.uTopMid).toBe(look.tones('groundTop').uMid);
    expect(material.uniforms.uTopShadow).toBe(look.tones('groundTop').uShadow);
  });
});

describe.each(LEVELS)('glowing materials under $name', ({ name, palette, rig }) => {
  const look = (): Look => createLook(palette, rig);

  it('need a carrier for a warm slot', () => {
    expect(() => createEffectMaterial(look(), { slot: 'ember', carrier: null })).toThrow(
      /Invariant failed/,
    );
    expect(() => createEffectMaterial(look(), { slot: 'ember', carrier: 'ember' })).not.toThrow();
  });

  it(`${rig.warmLight.includes('lantern') ? 'allow' : 'refuse'} lantern glass`, () => {
    const make = (): ShaderMaterial =>
      createEffectMaterial(look(), { slot: 'lantern', carrier: 'lantern' });
    if (rig.warmLight.includes('lantern')) expect(make, name).not.toThrow();
    else expect(make, name).toThrow(/Invariant failed/);
  });

  it('allow a cold effect with no carrier', () => {
    expect(() => createEffectMaterial(look(), { slot: 'checkpoint', carrier: null })).not.toThrow();
  });

  it('allow Rowan’s seams and glow to glow, and nothing else on a character', () => {
    for (const slot of ['heroSeam', 'heroGlow'] as const) {
      expect(() => createCharacterMaterial(look(), { slot, isGlowing: true }), slot).not.toThrow();
    }
    for (const slot of ['walkerBody', 'heroScarf', 'heroSkin'] as const) {
      expect(() => createCharacterMaterial(look(), { slot, isGlowing: true }), slot).toThrow(
        /Invariant failed/,
      );
    }
  });

  it('are flat: a glowing character part has no bands', () => {
    const material = createCharacterMaterial(look(), { slot: 'heroSeam', isGlowing: true });
    expect('LOOK_BANDED' in material.defines).toBe(false);
  });
});

describe('warm light on surfaces', () => {
  it('is on for banded surfaces by default and can be turned off', () => {
    const look = emberwoodLook();
    expect(receivesWarm(createPropMaterial(look, { slot: 'ledgeWood' }))).toBe(1);
    expect(
      receivesWarm(createPropMaterial(look, { slot: 'ledgeWood', canReceiveWarmLight: false })),
    ).toBe(0);
  });

  it('never reaches pits or water, even when asked', () => {
    const look = emberwoodLook();
    for (const slot of ['pit', 'water'] as const) {
      expect(
        receivesWarm(createPropMaterial(look, { slot, canReceiveWarmLight: true })),
        slot,
      ).toBe(0);
      expect(
        receivesWarm(createGroundMaterial(look, { top: slot, side: 'groundSide' })),
        slot,
      ).toBe(0);
      expect(receivesWarm(createGroundMaterial(look, { top: 'groundTop', side: slot })), slot).toBe(
        0,
      );
    }
  });

  it('never changes backdrops, card silhouettes, effects or glowing parts', () => {
    const look = emberwoodLook();
    expect(receivesWarm(createBackdropMaterial(look, { slot: 'treeMid' }))).toBe(0);
    expect(receivesWarm(createCardSilhouetteMaterial(look, { slot: 'ridgeFar' }))).toBe(0);
    expect(receivesWarm(createEffectMaterial(look, { slot: 'ember', carrier: 'ember' }))).toBe(0);
    expect(receivesWarm(createCharacterMaterial(look, { slot: 'heroGlow', isGlowing: true }))).toBe(
      0,
    );
  });
});

describe('colours', () => {
  it('come from palette slots only, never a colour (checked by make typecheck)', () => {
    const look = emberwoodLook();
    // @ts-expect-error a colour is not a slot
    expect(() => createPropMaterial(look, { slot: '#FF0000' })).toThrow();
  });
});

// The one shader every factory material uses (story 0.9, D1): the style guide's banded rule, its
// unshaded glow, and the materials' own fog (docs/STYLE_GUIDE.md §2). The ONLY GLSL in the game lives
// in render/materials/ (AR160); every other module asks a factory for a material.
//
// - Vertex: three.js's own chunks, in the order r187's ShaderLib/meshlambert.glsl.js uses, so a plain
//   Mesh, an InstancedMesh, a BatchedMesh, a SkinnedMesh and morph targets all draw.
// - Fragment: the tones arrive precomputed (tones.ts); the shader picks one from the key and fill
//   light term, adds warm point lights, then fog by depth behind the play plane and ground fog by
//   height. No tuning number lives in the GLSL: every setting is a uniform (look.ts).
// - Shading differences are #defines fixed per factory: banded, ground, double-sided, no fog. Kinds
//   that shade alike share a program (effect, backdrop and glowing parts; prop and banded
//   character), and instancing and skinning add their own variants. Per-level differences are
//   uniforms only, so switching levels never compiles a shader (AC10).
// - Nothing is named `worldPosition`: three's shadow-map chunks declare it (story 0.11, D1).
import { DoubleSide, FrontSide, ShaderMaterial } from 'three';
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
import type { WarmCarrier } from '../lighting/lightingRig.ts';
import type { Look } from './look.ts';
import { SHADING } from './shading.ts';
import { NEVER_LIGHTER_SLOTS } from './tones.ts';

const VERTEX = /* glsl */ `
#include <common>
#include <batching_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

varying vec3 vLookNormal; // world space
varying vec3 vLookWorld; // world position

void main() {
  #include <morphinstance_vertex>
  #include <batching_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <project_vertex>

  // transformedNormal is in view space (instancing included); the common chunk takes it back to world
  // space. inverseTransformDirection is its deprecated alias (three r185).
  vLookNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );

  vec4 lookWorld = vec4( transformed, 1.0 );
  #ifdef USE_BATCHING
    lookWorld = batchingMatrix * lookWorld;
  #endif
  #ifdef USE_INSTANCING
    lookWorld = instanceMatrix * lookWorld;
  #endif
  vLookWorld = ( modelMatrix * lookWorld ).xyz;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uLit;
uniform vec3 uMid;
uniform vec3 uShadow;

#ifdef LOOK_BANDED
  uniform vec3 uKeyDir;
  uniform float uKeyIntensity;
  uniform vec3 uFillDir;
  uniform float uFillIntensity;
  uniform float uLitFrom;
  uniform float uShadowBelow;

  uniform vec3 uWarmPos[ MAX_WARM_LIGHTS ];
  uniform vec3 uWarmColor[ MAX_WARM_LIGHTS ];
  uniform float uWarmReach[ MAX_WARM_LIGHTS ];
  uniform float uWarmAmount[ MAX_WARM_LIGHTS ];
  uniform int uWarmCount;
  uniform float uReceivesWarm;
#endif

#ifdef LOOK_GROUND
  uniform vec3 uTopLit;
  uniform vec3 uTopMid;
  uniform vec3 uTopShadow;
  uniform float uGroundTopFrom;
#endif

#ifndef LOOK_NO_FOG
  uniform vec3 uFogColor;
  uniform float uFogStart;
  uniform float uFogFull;
  uniform float uFogMax;
  uniform vec3 uGroundFogColor;
  uniform float uGroundFogBaseY;
  uniform float uGroundFogHeight;
  uniform float uGroundFogMax;
#endif

varying vec3 vLookNormal;
varying vec3 vLookWorld;

// A hard step at edge, antialiased over about one pixel so band edges don't stair-step. On a flat
// face x doesn't change across the pixel and fwidth is 0; smoothstep is undefined for equal edges,
// so the width has a floor (the one number in this shader).
float hardStep( float edge, float x ) {
  float w = max( fwidth( x ), 1e-5 );
  return smoothstep( edge - w, edge + w, x );
}

void main() {
  vec3 color = uMid;

  #ifdef LOOK_BANDED
    vec3 n = normalize( vLookNormal );
    #ifdef LOOK_DOUBLE_SIDED
      if ( ! gl_FrontFacing ) n = - n;
    #endif

    vec3 lit = uLit;
    vec3 mid = uMid;
    vec3 shadow = uShadow;
    #ifdef LOOK_GROUND
      float top = hardStep( uGroundTopFrom, n.y );
      lit = mix( lit, uTopLit, top );
      mid = mix( mid, uTopMid, top );
      shadow = mix( shadow, uTopShadow, top );
    #endif

    // The rig's lights pick the tone (shading.ts). The key alone decides lit; it is signed, so a
    // surface facing away from it scores below 0. The key and the fill together decide shadow: a
    // surface the fill reaches is held up out of it.
    float key = uKeyIntensity * dot( n, uKeyDir );
    float fill = uFillIntensity * max( dot( n, uFillDir ), 0.0 );
    color = mix( shadow, mid, hardStep( uShadowBelow, key + fill ) );
    color = mix( color, lit, hardStep( uLitFrom, key ) );

    // Warm point lights: within reach and facing the light, the surface moves toward its colour,
    // with a hard edge at the reach.
    for ( int i = 0; i < MAX_WARM_LIGHTS; i ++ ) {
      if ( i >= uWarmCount ) break;
      vec3 toLight = uWarmPos[ i ] - vLookWorld;
      float inside = 1.0 - hardStep( uWarmReach[ i ], length( toLight ) );
      float facing = hardStep( 0.0, dot( n, toLight ) );
      color = mix( color, uWarmColor[ i ], uWarmAmount[ i ] * inside * facing * uReceivesWarm );
    }
  #endif

  #ifndef LOOK_NO_FOG
    // Fog by depth behind the play plane (z = 0; -z is away from the viewer), capped.
    float depth = max( - vLookWorld.z, 0.0 );
    color = mix( color, uFogColor, uFogMax * smoothstep( uFogStart, uFogFull, depth ) );
    // Low fog by height above its base (the Drowned Mill); its amount is 0 elsewhere.
    float low = 1.0 - smoothstep( uGroundFogBaseY, uGroundFogBaseY + uGroundFogHeight, vLookWorld.y );
    color = mix( color, uGroundFogColor, uGroundFogMax * low );
  #endif

  gl_FragColor = vec4( color, 1.0 );
  #include <colorspace_fragment>
}
`;

/** Which factory made a material: its name starts with this. */
export type LookMaterialKind =
  'ground' | 'foliage' | 'character' | 'prop' | 'effect' | 'backdrop' | 'cardSilhouette';

export interface LookMaterialSpec {
  readonly kind: LookMaterialKind;
  /** The slot drawn (the ground's side slot). */
  readonly slot: LevelPaletteSlot;
  /** The ground's top slot, drawn on faces whose normal points up. */
  readonly topSlot?: LevelPaletteSlot;
  /** Three tones picked by the light; otherwise one flat tone (the slot). */
  readonly isBanded: boolean;
  readonly isDoubleSided?: boolean;
  readonly hasFog: boolean;
  /** Asked for by the caller; forced off for flat materials and for pits and water (AC3). */
  readonly canReceiveWarmLight: boolean;
  /**
   * Set for a glowing part (an effect, or Rowan's seams and glow): who carries it, or null for a cold
   * effect. A warm slot needs a carrier the rig lists (AC12).
   */
  readonly glowCarrier?: WarmCarrier | null;
}

function isNeverLighter(slot: LevelPaletteSlot): boolean {
  return (NEVER_LIGHTER_SLOTS as readonly LevelPaletteSlot[]).includes(slot);
}

/** Builds a factory's material from its spec. The factories are the only callers. */
export function createLookShaderMaterial(look: Look, spec: LookMaterialSpec): ShaderMaterial {
  const { kind, slot, topSlot } = spec;

  const tones = look.tones(slot);
  const defines: Record<string, string | number> = { MAX_WARM_LIGHTS: SHADING.maxWarmLights };
  if (spec.isBanded) defines.LOOK_BANDED = '';
  if (spec.isDoubleSided === true) defines.LOOK_DOUBLE_SIDED = '';
  if (!spec.hasFog) defines.LOOK_NO_FOG = '';

  const hasNeverLighterSlot =
    isNeverLighter(slot) || (topSlot !== undefined && isNeverLighter(topSlot));
  const canReceiveWarm = spec.isBanded && spec.canReceiveWarmLight && !hasNeverLighterSlot;

  const uniforms: Record<string, { value: unknown }> = {
    ...look.uniforms,
    ...tones,
    uReceivesWarm: { value: canReceiveWarm ? 1 : 0 },
  };
  if (topSlot !== undefined) {
    defines.LOOK_GROUND = '';
    const top = look.tones(topSlot);
    uniforms.uTopLit = top.uLit;
    uniforms.uTopMid = top.uMid;
    uniforms.uTopShadow = top.uShadow;
  }

  const material = new ShaderMaterial({
    name: topSlot === undefined ? `${kind}:${slot}` : `${kind}:${topSlot}/${slot}`,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    defines,
    uniforms,
    side: spec.isDoubleSided === true ? DoubleSide : FrontSide,
  });
  // Glowing parts are held to the warm rule now and on every level change (look.ts).
  if (spec.glowCarrier !== undefined) look.trackGlow(material, slot, spec.glowCarrier);
  return material;
}

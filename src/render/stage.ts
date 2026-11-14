// The stage: the scene and its four depth layers (architecture, Rendering Structure; AR163; FR208).
// Far distance, middle distance, the play layer at z = 0 (the kit, characters, pickups and effects)
// and the foreground, which never covers the play area. Every level uses it; the look-dev staging
// view is its first user (story 0.10), the test scene its second (0.12), the game from Epic 1.
//
// The stage holds the level's look (0.9, D2): every material on it is made from `stage.look`, so
// switching level is `applyLevel(palette, rig)` and nothing else (story 0.10, D6).
//
// "The play area" is the logical-view box on screen for now (story 0.10, D4; the developer's choice,
// 2026-11-14). Whether level dressing may overlap it away from the route is Epic 3's.
import { Color, Group, InstancedMesh, Mesh, Scene, SkinnedMesh } from 'three';
import type { Material, Object3D } from 'three';
import { invariant } from '../core/invariant.ts';
import type { LevelPalette } from '../core/paletteSlots.ts';
import { CONFIG } from '../sim/config.ts';
import type { LightingRig } from './lighting/lightingRig.ts';
import { createLook } from './materials/look.ts';
import type { Look } from './materials/look.ts';
import { viewFraming } from './viewCamera.ts';
import type { FramedView, Framing } from './viewCamera.ts';

/**
 * Each layer's depth along z, in tiles: negative is behind the play plane, positive toward the
 * camera. Look data shared by every level, not gameplay, so not CONFIG (flagged under AR248).
 * Locked by the developer at story 0.10's sign-off (2026-11-14); † story 0.12 judges them again on
 * the test scene. Against the rigs' fog (Emberwood 4 → 40 tiles), the middle layer takes a little
 * fog and the far layer nearly its cap; at 16:9 the far layer moves at about 0.36 of the play
 * layer's speed, the middle 0.71 and the foreground 1.18.
 */
export const STAGE_LAYERS = {
  far: -36,
  middle: -8,
  play: 0,
  foreground: 3,
} as const;

export type StageLayer = keyof typeof STAGE_LAYERS;

/** Far to near: the order the layers are added to the scene. */
const LAYER_ORDER = [
  'far',
  'middle',
  'play',
  'foreground',
] as const satisfies readonly StageLayer[];

/** An axis-aligned rectangle in world tiles (x right, y up). */
export interface Rect {
  readonly left: number;
  readonly right: number;
  readonly bottom: number;
  readonly top: number;
}

export interface Stage {
  readonly scene: Scene;
  readonly layers: Readonly<Record<StageLayer, Group>>;
  /** Every material on the stage is made from this look (0.9, D2). */
  readonly look: Look;
  /** Swaps the palette and rig: look.apply() and the background. Nothing else changes. */
  applyLevel(palette: LevelPalette, rig: LightingRig): void;
  /** Frees every geometry and material under the layers, then empties the scene. */
  dispose(): void;
}

/** Frees the GPU resources under `root`: geometries, materials, instance buffers and skeletons. */
function disposeTree(root: Object3D): void {
  const materials = new Set<Material>();
  root.traverse((object) => {
    if (object instanceof InstancedMesh) object.dispose();
    if (object instanceof SkinnedMesh) object.skeleton.dispose();
    if (!(object instanceof Mesh)) return;
    (object.geometry as { dispose(): void }).dispose();
    const material = object.material as Material | Material[];
    for (const each of Array.isArray(material) ? material : [material]) materials.add(each);
  });
  for (const material of materials) material.dispose();
}

export function createStage(palette: LevelPalette, rig: LightingRig): Stage {
  const scene = new Scene();
  const background = new Color(palette.skyFar);
  scene.background = background;
  const look = createLook(palette, rig);

  const layers = {} as Record<StageLayer, Group>;
  for (const layer of LAYER_ORDER) {
    const group = new Group();
    group.name = `stage-${layer}`;
    group.position.z = STAGE_LAYERS[layer];
    layers[layer] = group;
    scene.add(group);
  }

  return {
    scene,
    layers,
    look,
    applyLevel(nextPalette, nextRig) {
      look.apply(nextPalette, nextRig);
      background.set(nextPalette.skyFar);
    },
    dispose() {
      disposeTree(scene);
      scene.clear();
    },
  };
}

/**
 * Where a rectangle at depth `z` lands on the play plane, seen from a camera at (cx, cy, distance)
 * looking along −z: each point moves to c + (p − c) × distance / (distance − z). Pure.
 */
export function projectToPlayPlane(
  rect: Rect,
  z: number,
  cx: number,
  cy: number,
  distance: number,
): Rect {
  invariant(z < distance, `a rectangle at depth ${String(z)} is not in front of the camera`);
  const scale = distance / (distance - z);
  return {
    left: cx + (rect.left - cx) * scale,
    right: cx + (rect.right - cx) * scale,
    bottom: cy + (rect.bottom - cy) * scale,
    top: cy + (rect.top - cy) * scale,
  };
}

/** The area of the plane at depth `z` that the framing shows, for a camera centred on (cx, cy). Pure. */
export function visibleRectAt(framing: Readonly<Framing>, cx: number, cy: number, z: number): Rect {
  invariant(z < framing.distance, `depth ${String(z)} is not in front of the camera`);
  const scale = (framing.distance - z) / framing.distance;
  const halfWidth = (framing.visibleWidth / 2) * scale;
  const halfHeight = (framing.visibleHeight / 2) * scale;
  return {
    left: cx - halfWidth,
    right: cx + halfWidth,
    bottom: cy - halfHeight,
    top: cy + halfHeight,
  };
}

/** The logical view (CONFIG.view, without the margin), centred on (cx, cy): "the play area". */
export function logicalViewBox(cx: number, cy: number, view: FramedView = CONFIG.view): Rect {
  return {
    left: cx - view.width / 2,
    right: cx + view.width / 2,
    bottom: cy - view.height / 2,
    top: cy + view.height / 2,
  };
}

function overlaps(a: Rect, b: Rect): boolean {
  return a.left < b.right && a.right > b.left && a.bottom < b.top && a.top > b.bottom;
}

/**
 * The foreground pieces (world rectangles at STAGE_LAYERS.foreground) that cover the play area on
 * screen, for a camera centred on (cx, cy): empty means the foreground is clear (AC11). Pure.
 */
export function foregroundIntruders(
  framing: Readonly<Framing>,
  cx: number,
  cy: number,
  pieces: readonly Rect[],
  view: FramedView = CONFIG.view,
): readonly Rect[] {
  const box = logicalViewBox(cx, cy, view);
  return pieces.filter((piece) =>
    overlaps(projectToPlayPlane(piece, STAGE_LAYERS.foreground, cx, cy, framing.distance), box),
  );
}

/**
 * The rectangle a layer at depth `z` must cover so it never shows an edge: the union of what the
 * camera sees at that depth for every aspect in `aspects`, with the camera centred on any x in
 * [−panRange, panRange] and on `centreY`. Pure.
 */
export function coverageNeeded(
  z: number,
  options: {
    readonly aspects: readonly number[];
    readonly panRange: number;
    readonly centreY: number;
    readonly view?: FramedView;
  },
): Rect {
  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.POSITIVE_INFINITY;
  let top = Number.NEGATIVE_INFINITY;
  for (const aspect of options.aspects) {
    const framing = viewFraming(aspect, undefined, options.view);
    for (const cx of [-options.panRange, options.panRange]) {
      const seen = visibleRectAt(framing, cx, options.centreY, z);
      left = Math.min(left, seen.left);
      right = Math.max(right, seen.right);
      bottom = Math.min(bottom, seen.bottom);
      top = Math.max(top, seen.top);
    }
  }
  invariant(Number.isFinite(left), 'coverage needs at least one aspect');
  return { left, right, bottom, top };
}

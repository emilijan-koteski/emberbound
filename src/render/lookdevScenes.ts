// 3D content for the look-dev page (story 0.6, D4). lookdev/ may not import three.js, so every
// scene and camera the page shows is built here; the page holds the returned objects and hands
// them to the renderer without naming three.js types. Stories 0.9, 0.10 and 0.12 add their
// builders here; story 0.10 replaces the placeholder camera with render/viewCamera.ts.
import {
  Bone,
  BoxGeometry,
  CapsuleGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Skeleton,
  SkinnedMesh,
  SphereGeometry,
  Texture,
  Uint16BufferAttribute,
  Vector3,
} from 'three';
import type { Material, Object3D } from 'three';
import { invariant } from '../core/invariant.ts';
import type { LevelPalette, LevelPaletteSlot } from '../core/paletteSlots.ts';
import type { LightingRig } from './lighting/lightingRig.ts';
import { createBackdropMaterial } from './materials/backdropMaterial.ts';
import { createCardSilhouetteMaterial } from './materials/cardSilhouetteMaterial.ts';
import { createCharacterMaterial } from './materials/characterMaterial.ts';
import { createEffectMaterial } from './materials/effectMaterial.ts';
import { createFoliageMaterial } from './materials/foliageMaterial.ts';
import { createGroundMaterial } from './materials/groundMaterial.ts';
import { createLook } from './materials/look.ts';
import type { Look } from './materials/look.ts';
import { createPropMaterial } from './materials/propMaterial.ts';

export interface LookdevScene {
  /** Shown on the look-dev page, so a shot says which scene it holds. */
  readonly label: string;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  setAspect(aspect: number): void;
  /** Advances any animation to `timeSeconds`; a spot passes the same frozen time every frame. */
  update(timeSeconds: number): void;
  dispose(): void;
}

/** † Placeholder until story 0.10's view camera: the architecture's "about 30°". */
const PLACEHOLDER_FOV_DEGREES = 30;
/** Placeholder camera distance from the play plane (z = 0), in tiles. */
const PLACEHOLDER_CAMERA_Z = 10;
const NEAR = 0.1;
const FAR = 1000;

/** Frees the GPU resources under `root`: geometries, materials and the textures they hold. */
function disposeTree(root: Object3D): void {
  const materials = new Set<Material>();
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    (object.geometry as { dispose(): void }).dispose();
    const material = object.material as Material | Material[];
    for (const each of Array.isArray(material) ? material : [material]) materials.add(each);
  });
  for (const material of materials) {
    for (const value of Object.values(material)) if (value instanceof Texture) value.dispose();
    material.dispose();
  }
}

/** An empty scene with a placeholder camera on the z axis, looking at the origin. */
export function createEmptyLookdevScene(): LookdevScene {
  const scene = new Scene();
  const camera = new PerspectiveCamera(PLACEHOLDER_FOV_DEGREES, 1, NEAR, FAR);
  camera.position.set(0, 0, PLACEHOLDER_CAMERA_Z);
  camera.lookAt(0, 0, 0);

  return {
    label: 'Empty scene (later stories add to it)',
    scene,
    camera,
    setAspect(aspect) {
      if (!Number.isFinite(aspect) || aspect <= 0) return;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    },
    update() {
      // Nothing animates in an empty scene.
    },
    dispose() {
      disposeTree(scene);
      scene.clear();
    },
  };
}

// --- The materials view (story 0.9) -------------------------------------------------------------
//
// Every factory on a box, a sphere, a plane and a capsule, one row per factory, under the level's look;
// plus the recolour strip, the fog sample, the warm samples, and one instanced and one skinned shape.
// Rows sit on the play plane (z = 0) from the ground at the bottom up, like a level, with the fog row
// in the middle at the camera's height, so depth scaling moves its samples only sideways. Only the
// factories make materials here.

/** One level's look, as the view passes it in (render/ may not import lookdev/). */
export interface MaterialsLevel {
  readonly id: string;
  readonly label: string;
  readonly palette: LevelPalette;
  readonly rig: LightingRig;
}

export type MaterialsRowKind =
  | 'ground'
  | 'foliage'
  | 'character'
  | 'prop'
  | 'effect'
  | 'backdrop'
  | 'cardSilhouette'
  | 'recolour'
  | 'fog';

export interface MaterialsRowSlot {
  readonly slot: LevelPaletteSlot;
  /** Banded slots show three tones; flat ones (glow, backdrop, card) draw only mid. */
  readonly isBanded: boolean;
}

export interface MaterialsRow {
  readonly kind: MaterialsRowKind;
  readonly label: string;
  /** The slots whose tones the page shows beside the row. */
  readonly slots: readonly MaterialsRowSlot[];
  /** A factory's row (true) or a strip (the recolour strip, the fog sample). */
  readonly isFactory: boolean;
}

const banded = (slot: LevelPaletteSlot): MaterialsRowSlot => ({ slot, isBanded: true });
const flat = (slot: LevelPaletteSlot): MaterialsRowSlot => ({ slot, isBanded: false });

/** Rows in the page's order: the seven factories in story 0.9's AC1 order, then the strips. */
export const MATERIALS_ROWS: readonly MaterialsRow[] = [
  {
    kind: 'ground',
    label: 'Ground',
    slots: [banded('groundTop'), banded('groundSide')],
    isFactory: true,
  },
  { kind: 'foliage', label: 'Foliage', slots: [banded('foliage')], isFactory: true },
  {
    kind: 'character',
    label: 'Character',
    slots: [banded('heroSkin'), flat('heroGlow')],
    isFactory: true,
  },
  { kind: 'prop', label: 'Prop', slots: [banded('ledgeWood')], isFactory: true },
  {
    kind: 'effect',
    label: 'Effect',
    slots: [flat('pickupWarm'), flat('ember'), flat('shot'), flat('bell')],
    isFactory: true,
  },
  { kind: 'backdrop', label: 'Backdrop', slots: [flat('treeMid')], isFactory: true },
  {
    kind: 'cardSilhouette',
    label: 'Card silhouette',
    slots: [flat('ridgeFar')],
    isFactory: true,
  },
  {
    kind: 'recolour',
    label: 'Recolour: the walker in each level, left to right',
    slots: [banded('walkerBody'), banded('walkerAccent')],
    isFactory: false,
  },
  { kind: 'fog', label: 'Fog by depth', slots: [banded('hazard')], isFactory: false },
];

/** Bottom to top on screen; the fog row sits in the middle, at the camera's height. */
const SCREEN_ORDER: readonly MaterialsRowKind[] = [
  'ground',
  'foliage',
  'character',
  'prop',
  'fog',
  'effect',
  'backdrop',
  'cardSilhouette',
  'recolour',
];

/** The backdrop plane whose centre the colour probe reads (story 0.9, P4). */
const PROBE_SLOT: LevelPaletteSlot = 'treeMid';

/** Layout in tiles (1 unit = 1 tile). Look-dev staging only. */
const ROW_SPACING = 1.8;
const COLUMN_SPACING = 1.6;
const SHAPE_SIZE = 0.9;
const CAPSULE_RADIUS = 0.3;
const CAPSULE_MIDDLE = 0.45;
/** Fixed turns, so the box shows three faces and the capsule leans: the bands read on both. */
const BOX_TURN = { x: 0.35, y: 0.6 } as const;
const CAPSULE_LEAN = 0.3;
/** Room around the content, in tiles, so nothing touches the canvas edge. */
const FRAME_MARGIN = 0.8;
/** Where an item's caption goes, below its centre. */
const CAPTION_DROP = 0.75;
/** The fog sample's depths, as fractions of the rig's: 0, start, halfway, full, 1.5 × full. */
const FOG_SAMPLE_COUNT = 5;
const FOG_BEYOND = 1.5;
/** The ember glow beside each fog sample: its size, and where it sits from the sphere's centre. */
const FOG_GLOW_RADIUS = 0.13;
const FOG_GLOW_OFFSET = { x: 0.5, y: 0.38 } as const;
/** Decimal places in a fog caption, so float noise never shows (6.300000000000001). */
const FOG_CAPTION_DECIMALS = 2;

// Where the extra samples sit, in columns (the four shapes take columns 0 to 3).
const EXTRA_COLUMN = 4;
const SAMPLE_COLUMN = 5.2;
const PIT_COLUMN = 6.4;
/** The recolour strip's stand-ins, this many columns apart. */
const RECOLOUR_STEP = 1.5;
/** The instanced boxes: their size against a shape, and their offsets from the column's centre. */
const INSTANCE_SCALE = 0.45;
const INSTANCE_OFFSETS = [
  [-0.25, -0.22],
  [0.25, -0.22],
  [0, 0.25],
] as const;
/** The skinned capsule's upper bone, bent by this angle (radians). */
const BONE_BEND = -0.6;
/** The walker stand-in: a short body and an accent head, set up and to the right. */
const WALKER_BODY_MIDDLE = CAPSULE_MIDDLE * 0.6;
const WALKER_BODY_DROP = 0.1;
const WALKER_HEAD_RADIUS = 0.2;
const WALKER_HEAD_AT = { x: 0.15, y: 0.42, z: 0.05 } as const;
/** Rowan's sample: his chest glow, and the ground box at his feet. */
const ROWAN_GLOW_RADIUS = 0.11;
const ROWAN_GLOW_RAISE = 0.1;
const ROWAN_GLOW_PROUD = 0.02;
const ROWAN_GROUND = { widthScale: 1.6, height: 0.3 } as const;
/** The lantern sample: the low boxes either side, and the lantern above and in front. */
const LANTERN_BOX_HEIGHT_SCALE = 0.6;
const LANTERN_BOX_DROP = 0.15;
const LANTERN_RAISE = 0.45;
const LANTERN_FRONT = 0.35;
const LANTERN_GLASS_RADIUS = 0.13;

export interface MaterialsLayout {
  /** Each row's centre, in CSS pixels from the canvas's top. */
  readonly rows: readonly { readonly kind: MaterialsRowKind; readonly yPx: number }[];
  /** Captions under single items (fog depths, recolour levels, the samples). */
  readonly captions: readonly {
    readonly text: string;
    readonly xPx: number;
    readonly yPx: number;
  }[];
  /** The colour probe's centre, and the slot it should read. */
  readonly probe: { readonly xPx: number; readonly yPx: number; readonly slot: LevelPaletteSlot };
}

export interface MaterialsLookdevScene extends LookdevScene {
  readonly levelId: string;
  /** Switches level in place: the look is applied, nothing is rebuilt (story 0.9, D13). */
  setLevel(id: string): void;
  /** Screen positions for the page's labels, projected with the scene's camera. */
  layout(widthPx: number, heightPx: number): MaterialsLayout;
  /** The warm samples drawn: 'rowan', and 'lantern' (Emberwood only). Read from the scene itself. */
  warmSamples(): readonly string[];
  /** The warm point lights the shader draws now. */
  warmLightCount(): number;
}

function rowY(kind: MaterialsRowKind): number {
  return SCREEN_ORDER.indexOf(kind) * ROW_SPACING;
}

function columnX(column: number): number {
  return column * COLUMN_SPACING;
}

/** The four shapes every factory row shows. */
function rowShapes(materialFor: (column: number) => Material, y: number): Mesh[] {
  const box = new Mesh(new BoxGeometry(SHAPE_SIZE, SHAPE_SIZE, SHAPE_SIZE), materialFor(0));
  box.rotation.set(BOX_TURN.x, BOX_TURN.y, 0);
  const sphere = new Mesh(new SphereGeometry(SHAPE_SIZE / 2, 48, 24), materialFor(1));
  const plane = new Mesh(new PlaneGeometry(SHAPE_SIZE, SHAPE_SIZE), materialFor(2));
  const capsule = new Mesh(
    new CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_MIDDLE, 8, 24),
    materialFor(3),
  );
  capsule.rotation.z = CAPSULE_LEAN;
  const shapes = [box, sphere, plane, capsule];
  shapes.forEach((shape, column) => {
    shape.position.set(columnX(column), y, 0);
  });
  return shapes;
}

/** Three small boxes in one InstancedMesh, with bounds set so culling keeps it (a known trap). */
function instancedBoxes(material: Material, x: number, y: number): InstancedMesh {
  const size = SHAPE_SIZE * INSTANCE_SCALE;
  const mesh = new InstancedMesh(new BoxGeometry(size, size, size), material, 3);
  const matrix = new Matrix4();
  INSTANCE_OFFSETS.forEach(([dx, dy], i) => {
    matrix.makeRotationY(BOX_TURN.y).setPosition(x + dx, y + dy, 0);
    mesh.setMatrixAt(i, matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
  return mesh;
}

/** A capsule with two bones, the upper one bent: proves the shader's skinning chunks. */
function skinnedCapsule(material: Material, x: number, y: number): SkinnedMesh {
  const geometry = new CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_MIDDLE, 8, 24);
  const half = CAPSULE_RADIUS + CAPSULE_MIDDLE / 2;
  const position = geometry.attributes.position;
  const indices: number[] = [];
  const weights: number[] = [];
  for (let i = 0; i < position.count; i += 1) {
    // 0 at the bottom of the capsule, 1 at the top: the upper bone's share.
    const upper = Math.min(Math.max((position.getY(i) + half) / (2 * half), 0), 1);
    indices.push(0, 1, 0, 0);
    weights.push(1 - upper, upper, 0, 0);
  }
  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(indices, 4));
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(weights, 4));

  const root = new Bone();
  root.position.y = -half;
  const upperBone = new Bone();
  upperBone.position.y = half;
  root.add(upperBone);
  const mesh = new SkinnedMesh(geometry, material);
  mesh.add(root);
  mesh.position.set(x, y, 0);
  mesh.updateMatrixWorld(true);
  mesh.bind(new Skeleton([root, upperBone]));
  upperBone.rotation.z = BONE_BEND;
  return mesh;
}

/** The walker stand-in: a body capsule and an accent head. */
function walkerStandIn(look: Look, x: number, y: number): Mesh[] {
  const body = new Mesh(
    new CapsuleGeometry(CAPSULE_RADIUS, WALKER_BODY_MIDDLE, 8, 24),
    createCharacterMaterial(look, { slot: 'walkerBody' }),
  );
  body.position.set(x, y - WALKER_BODY_DROP, 0);
  const head = new Mesh(
    new SphereGeometry(WALKER_HEAD_RADIUS, 32, 16),
    createCharacterMaterial(look, { slot: 'walkerAccent' }),
  );
  head.position.set(x + WALKER_HEAD_AT.x, y + WALKER_HEAD_AT.y, WALKER_HEAD_AT.z);
  return [body, head];
}

export function createMaterialsLookdevScene(options: {
  readonly levels: readonly MaterialsLevel[];
  readonly levelId: string;
}): MaterialsLookdevScene {
  const { levels } = options;
  const levelOf = (id: string): MaterialsLevel => {
    const level = levels.find((candidate) => candidate.id === id);
    if (level === undefined) {
      throw new Error(
        `Unknown level "${id}" (known: ${levels.map((candidate) => candidate.id).join(', ')})`,
      );
    }
    return level;
  };
  let current = levelOf(options.levelId);

  const scene = new Scene();
  const background = new Color(current.palette.skyFar);
  scene.background = background;
  const camera = new PerspectiveCamera(PLACEHOLDER_FOV_DEGREES, 1, NEAR, FAR);
  const look = createLook(current.palette, current.rig);

  const add = (...objects: Object3D[]): void => {
    scene.add(...objects);
  };

  // The seven factory rows.
  const ground = createGroundMaterial(look, { top: 'groundTop', side: 'groundSide' });
  add(...rowShapes(() => ground, rowY('ground')));
  const foliage = createFoliageMaterial(look, { slot: 'foliage' });
  add(...rowShapes(() => foliage, rowY('foliage')));
  const skin = createCharacterMaterial(look, { slot: 'heroSkin' });
  add(...rowShapes(() => skin, rowY('character')));
  const prop = createPropMaterial(look, { slot: 'ledgeWood' });
  add(...rowShapes(() => prop, rowY('prop')));
  const effects = [
    createEffectMaterial(look, { slot: 'pickupWarm', carrier: 'weaponPickup' }),
    createEffectMaterial(look, { slot: 'ember', carrier: 'ember' }),
    createEffectMaterial(look, { slot: 'shot', carrier: 'shot' }),
    createEffectMaterial(look, { slot: 'bell', carrier: 'bell' }),
  ];
  add(...rowShapes((column) => effects[column] ?? prop, rowY('effect')));
  const backdrop = createBackdropMaterial(look, { slot: PROBE_SLOT });
  const backdropShapes = rowShapes(() => backdrop, rowY('backdrop'));
  add(...backdropShapes);
  const card = createCardSilhouetteMaterial(look, { slot: 'ridgeFar' });
  add(...rowShapes(() => card, rowY('cardSilhouette')));

  // Instancing and skinning (story 0.9, D10).
  add(instancedBoxes(prop, columnX(EXTRA_COLUMN), rowY('prop')));
  add(skinnedCapsule(skin, columnX(EXTRA_COLUMN), rowY('character')));

  // Rowan's sample: his skin, his chest glow, and his light at the glow (D8), falling on a ground box
  // at his feet. His body takes none of his own light: a light at his skin paints a hard stripe on
  // him (critic round 14).
  const rowanX = columnX(SAMPLE_COLUMN);
  const rowanY = rowY('character');
  const rowanBody = new Mesh(
    new CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_MIDDLE, 8, 24),
    createCharacterMaterial(look, { slot: 'heroSkin', canReceiveWarmLight: false }),
  );
  rowanBody.position.set(rowanX, rowanY, 0);
  const rowanGround = new Mesh(
    new BoxGeometry(SHAPE_SIZE * ROWAN_GROUND.widthScale, ROWAN_GROUND.height, SHAPE_SIZE),
    ground,
  );
  rowanGround.position.set(
    rowanX,
    rowanY - CAPSULE_RADIUS - CAPSULE_MIDDLE / 2 - ROWAN_GROUND.height / 2,
    0,
  );
  add(rowanGround);
  const rowanGlow = new Mesh(
    new SphereGeometry(ROWAN_GLOW_RADIUS, 24, 12),
    createCharacterMaterial(look, { slot: 'heroGlow', isGlowing: true }),
  );
  rowanGlow.position.set(rowanX, rowanY + ROWAN_GLOW_RAISE, CAPSULE_RADIUS + ROWAN_GLOW_PROUD);
  add(rowanBody, rowanGlow);

  // The lantern sample (Emberwood only): a ledge box and a pit box, the lantern between them.
  const propY = rowY('prop');
  const lowBox = (): BoxGeometry =>
    new BoxGeometry(SHAPE_SIZE, SHAPE_SIZE * LANTERN_BOX_HEIGHT_SCALE, SHAPE_SIZE);
  const lanternBox = new Mesh(lowBox(), prop);
  lanternBox.position.set(columnX(SAMPLE_COLUMN), propY - LANTERN_BOX_DROP, 0);
  const pitBox = new Mesh(lowBox(), createGroundMaterial(look, { top: 'pit', side: 'pit' }));
  pitBox.position.set(columnX(PIT_COLUMN), propY - LANTERN_BOX_DROP, 0);
  const lanternAt = {
    x: (columnX(SAMPLE_COLUMN) + columnX(PIT_COLUMN)) / 2,
    y: propY + LANTERN_RAISE,
    z: LANTERN_FRONT,
  };
  const lanternGlassGeometry = new SphereGeometry(LANTERN_GLASS_RADIUS, 24, 12);
  let lanternGlass: Mesh | null = null;
  const lanternGroup = new Group();
  lanternGroup.add(lanternBox, pitBox);
  add(lanternGroup);

  // The recolour strip: the same stand-in under each level's own look.
  const recolourLooks = levels.map((level) => createLook(level.palette, level.rig));
  recolourLooks.forEach((recolourLook, i) => {
    add(...walkerStandIn(recolourLook, columnX(i * RECOLOUR_STEP), rowY('recolour')));
  });

  // The fog sample: the same sphere at increasing depth, moved and scaled to land in place, each with
  // an ember glow beside it, since glowing parts fog too (style guide §2; critic round 15).
  const fogMaterial = createPropMaterial(look, { slot: 'hazard', canReceiveWarmLight: false });
  const fogGeometry = new SphereGeometry(SHAPE_SIZE / 2, 48, 24);
  const fogGlowMaterial = createEffectMaterial(look, { slot: 'ember', carrier: 'ember' });
  const fogGlowGeometry = new SphereGeometry(FOG_GLOW_RADIUS, 24, 12);
  const fogSamples = Array.from({ length: FOG_SAMPLE_COUNT }, () => {
    const sphere = new Mesh(fogGeometry, fogMaterial);
    const glow = new Mesh(fogGlowGeometry, fogGlowMaterial);
    add(sphere, glow);
    return { sphere, glow };
  });
  let fogDepths: number[] = [];

  // Framing: the content's bounds on the play plane.
  const contentLeft = columnX(0) - SHAPE_SIZE / 2 - FRAME_MARGIN;
  const contentRight = columnX(PIT_COLUMN) + SHAPE_SIZE / 2 + FRAME_MARGIN;
  const contentBottom = rowY(SCREEN_ORDER[0] ?? 'ground') - SHAPE_SIZE / 2 - FRAME_MARGIN;
  const contentTop = rowY(SCREEN_ORDER.at(-1) ?? 'recolour') + SHAPE_SIZE / 2 + FRAME_MARGIN;
  const centreX = (contentLeft + contentRight) / 2;
  const centreY = rowY('fog');
  const halfHeight = Math.max(contentTop - centreY, centreY - contentBottom);
  const halfWidth = (contentRight - contentLeft) / 2;
  const tanHalfFov = Math.tan(MathUtils.degToRad(PLACEHOLDER_FOV_DEGREES) / 2);
  let distance = halfHeight / tanHalfFov;

  function placeFogSamples(): void {
    const { startDepth, fullDepth } = current.rig.fog;
    fogDepths = [0, startDepth, (startDepth + fullDepth) / 2, fullDepth, fullDepth * FOG_BEYOND];
    invariant(fogDepths.length === FOG_SAMPLE_COUNT, 'one fog depth per fog sample');
    fogDepths.forEach((depth, i) => {
      const sample = fogSamples.at(i);
      if (sample === undefined) return;
      // c + (p − c) × (D + d) / D lands on the same screen spot, at the same size, as at z = 0.
      const scale = (distance + depth) / distance;
      const place = (mesh: Mesh, x: number, y: number): void => {
        mesh.position.set(centreX + (x - centreX) * scale, centreY + (y - centreY) * scale, -depth);
        mesh.scale.setScalar(scale);
      };
      place(sample.sphere, columnX(i), rowY('fog'));
      place(sample.glow, columnX(i) + FOG_GLOW_OFFSET.x, rowY('fog') + FOG_GLOW_OFFSET.y);
    });
  }

  function frame(aspect: number): void {
    distance = Math.max(halfHeight / tanHalfFov, halfWidth / (tanHalfFov * aspect));
    camera.aspect = aspect;
    camera.position.set(centreX, centreY, distance);
    camera.lookAt(centreX, centreY, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    placeFogSamples();
  }

  function applyLevel(): void {
    const hasLanterns = current.rig.lanterns !== null;
    // Lantern glass exists only where the rig lists lanterns: it is disposed before a level without
    // them, or the look refuses the change (the warm rule; code review, 2026-11-14).
    if (!hasLanterns && lanternGlass !== null) {
      lanternGroup.remove(lanternGlass);
      (lanternGlass.material as Material).dispose();
      lanternGlass = null;
    }
    look.apply(current.palette, current.rig);
    background.set(current.palette.skyFar);
    // The low fog lies at the ground row's foot, so only that row sits in it.
    look.setGroundFogBaseY(rowY('ground') - SHAPE_SIZE / 2);
    if (hasLanterns && lanternGlass === null) {
      lanternGlass = new Mesh(
        lanternGlassGeometry,
        createEffectMaterial(look, { slot: 'lantern', carrier: 'lantern' }),
      );
      lanternGlass.position.set(lanternAt.x, lanternAt.y, lanternAt.z);
      lanternGroup.add(lanternGlass);
    }
    lanternGroup.visible = hasLanterns;
    const rowanLight = {
      carrier: 'rowan' as const,
      x: rowanGlow.position.x,
      y: rowanGlow.position.y,
      z: rowanGlow.position.z,
    };
    look.setWarmLights(
      hasLanterns ? [rowanLight, { carrier: 'lantern', ...lanternAt }] : [rowanLight],
    );
    placeFogSamples();
  }

  frame(1);
  applyLevel();

  const project = (x: number, y: number, z: number, widthPx: number, heightPx: number) => {
    const ndc = new Vector3(x, y, z).project(camera);
    return { xPx: ((ndc.x + 1) / 2) * widthPx, yPx: ((1 - ndc.y) / 2) * heightPx };
  };

  return {
    label: 'Materials',
    scene,
    camera,
    get levelId() {
      return current.id;
    },
    setAspect(aspect) {
      if (!Number.isFinite(aspect) || aspect <= 0) return;
      frame(aspect);
    },
    update() {
      // Nothing moves: a spot freezes time, and the shapes hold fixed angles.
    },
    setLevel(id) {
      current = levelOf(id);
      applyLevel();
    },
    layout(widthPx, heightPx) {
      const rows = MATERIALS_ROWS.map((row) => ({
        kind: row.kind,
        yPx: project(centreX, rowY(row.kind), 0, widthPx, heightPx).yPx,
      }));
      const caption = (text: string, x: number, y: number) => ({
        text,
        ...project(x, y - CAPTION_DROP, 0, widthPx, heightPx),
      });
      const captions = [
        ...fogDepths.map((depth, i) =>
          caption(
            `depth ${String(Number(depth.toFixed(FOG_CAPTION_DECIMALS)))}`,
            columnX(i),
            rowY('fog'),
          ),
        ),
        ...levels.map((level, i) =>
          caption(level.label, columnX(i * RECOLOUR_STEP), rowY('recolour')),
        ),
        caption('instanced', columnX(EXTRA_COLUMN), rowY('prop')),
        caption('skinned', columnX(EXTRA_COLUMN), rowY('character')),
        caption('Rowan + light', rowanX, rowanY),
        ...(current.rig.lanterns === null
          ? []
          : [caption('lantern, ledge, pit', lanternAt.x, rowY('prop'))]),
      ];
      // The backdrop row's plane (column 2) faces the camera: one flat tone, no fog at z = 0.
      const probeAt = backdropShapes.at(2)?.position ?? new Vector3();
      return {
        rows,
        captions,
        probe: { ...project(probeAt.x, probeAt.y, 0, widthPx, heightPx), slot: PROBE_SLOT },
      };
    },
    warmSamples() {
      // What the scene draws, not what the rig says: Rowan's glow, and the lantern glass if it exists
      // and shows.
      const samples = rowanGlow.parent === scene ? ['rowan'] : [];
      if (lanternGlass?.parent === lanternGroup && lanternGroup.visible) samples.push('lantern');
      return samples;
    },
    warmLightCount() {
      return look.uniforms.uWarmCount.value;
    },
    dispose() {
      scene.traverse((object) => {
        if (object instanceof SkinnedMesh) object.skeleton.dispose();
        // Frees the instance-matrix buffer, which only InstancedMesh.dispose() releases.
        if (object instanceof InstancedMesh) object.dispose();
      });
      disposeTree(scene);
      lanternGlassGeometry.dispose();
      scene.clear();
    },
  };
}

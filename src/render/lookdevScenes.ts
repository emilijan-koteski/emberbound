// 3D content for the look-dev page (story 0.6, D4). lookdev/ may not import three.js, so every
// scene and camera the page shows is built here; the page holds the returned objects and hands
// them to the renderer without naming three.js types. Stories 0.9, 0.10 and 0.12 add their
// builders here; story 0.10 replaces the placeholder camera with render/viewCamera.ts.
import { Mesh, PerspectiveCamera, Scene, Texture } from 'three';
import type { Material, Object3D } from 'three';

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

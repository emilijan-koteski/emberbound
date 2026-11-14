// The WebGLRenderer: setup, canvas fit, pixel ratio and statistics (architecture, Rendering
// Structure and Performance Budget; AR177). The game and the look-dev page both use it.
//
// Settings (story 0.6, D13): antialiasing on †; three's default colour management with sRGB
// output, so palette hex values come out as written on flat materials; no tone mapping, since
// the style guide has no grading pass.
import { NoToneMapping, Texture, WebGLRenderer } from 'three';
import type { Camera, Material, Object3D, Scene } from 'three';
import { log } from '../core/log.ts';

/** † Starting budget (architecture, Performance Budget); story 0.12 may move it into its table. */
export const MAX_PIXEL_RATIO = 1.5;

/** Bytes per texel the estimate assumes: uncompressed RGBA8. */
const BYTES_PER_TEXEL = 4;
/** A full mipmap chain adds a third to the base level. */
const MIPMAP_FACTOR = 4 / 3;

export interface RendererStats {
  /** Draw calls in the last render() call. */
  readonly drawCalls: number;
  /** Triangles in the last render() call. */
  readonly triangles: number;
  /** Geometries uploaded to the GPU. */
  readonly geometries: number;
  /** Textures uploaded to the GPU (a count, not a size). */
  readonly textures: number;
  /** Shader programs compiled. */
  readonly programs: number;
  /** An estimate: three.js counts textures but never measures them (D8). */
  readonly textureBytesEstimate: number;
  readonly pixelRatio: number;
}

export interface GameRenderer {
  readonly canvas: HTMLCanvasElement;
  render(scene: Scene, camera: Camera): void;
  /** The canvas size in CSS pixels, as last fitted. */
  size(): { readonly width: number; readonly height: number };
  /**
   * The GPU WebGL runs on, as the browser reports it (WEBGL_debug_renderer_info). Firefox gives
   * only a class ("…, or similar"); headless Chromium without a GPU reports SwiftShader.
   */
  gpuName(): string;
  /** Read right after the frame's render() call: three.js resets its counts on every call. */
  readStats(scene: Scene): RendererStats;
  /** Calls `listener` after every fit, with the canvas size in CSS pixels. Returns an unsubscribe. */
  onResize(listener: (width: number, height: number) => void): () => void;
  dispose(): void;
}

/** The device pixel ratio, capped at MAX_PIXEL_RATIO; 1 for anything not positive and finite. */
export function cappedPixelRatio(devicePixelRatio: number): number {
  if (!Number.isFinite(devicePixelRatio) || devicePixelRatio <= 0) return 1;
  return Math.min(devicePixelRatio, MAX_PIXEL_RATIO);
}

/** `instanceof Texture` narrows to `Texture<any, any>`; this guard keeps the default parameters. */
function isTexture(value: unknown): value is Texture {
  return value instanceof Texture;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function sizeOf(image: object, widthKey: string, heightKey: string): number {
  const record = image as Record<string, unknown>;
  const width = record[widthKey];
  const height = record[heightKey];
  return isPositiveNumber(width) && isPositiveNumber(height) ? width * height : 0;
}

/**
 * Texels in one image: an HTML image, canvas or bitmap, a `{ data, width, height }` record (with
 * `depth` for 3D and array textures), a video (its intrinsic size) or a cube's array of faces.
 */
function imageTexels(image: unknown): number {
  if (Array.isArray(image)) return image.reduce<number>((sum, face) => sum + imageTexels(face), 0);
  if (typeof image !== 'object' || image === null) return 0;
  const area = sizeOf(image, 'width', 'height') || sizeOf(image, 'videoWidth', 'videoHeight');
  const { depth } = image as { depth?: unknown };
  return isPositiveNumber(depth) ? area * depth : area;
}

function textureBytes(texture: Texture): number {
  const bytes = imageTexels(texture.image) * BYTES_PER_TEXEL;
  return texture.generateMipmaps ? bytes * MIPMAP_FACTOR : bytes;
}

function materialsOf(object: Object3D): readonly Material[] {
  const { material } = object as Object3D & { material?: Material | Material[] };
  if (material === undefined) return [];
  return Array.isArray(material) ? material : [material];
}

/** A uniform's value: a texture, or an array of them (null entries skipped). */
function texturesInValue(value: unknown, found: Texture[]): void {
  if (isTexture(value)) found.push(value);
  else if (Array.isArray(value)) for (const item of value) texturesInValue(item, found);
}

/** Textures held by a material: its own properties, and shader uniforms (render/materials/). */
function texturesOf(material: Material): Texture[] {
  const found: Texture[] = [];
  for (const value of Object.values(material)) {
    if (isTexture(value)) found.push(value);
  }
  const { uniforms } = material as Material & {
    uniforms?: Record<string, { value?: unknown } | undefined>;
  };
  if (uniforms !== undefined) {
    for (const uniform of Object.values(uniforms)) texturesInValue(uniform?.value, found);
  }
  return found;
}

/**
 * Estimated GPU bytes for every texture the scene reaches (D8): width × height (× depth) × 4 per
 * unique image source, × 4/3 with mipmaps. Clones that share a source count once (three.js shares
 * one GPU texture between clones with the same settings). Ignores compression, other formats,
 * render targets and uniforms added inside `onBeforeCompile`.
 */
export function estimateTextureBytes(scene: Scene): number {
  const textures = new Map<string, Texture>();
  const add = (texture: Texture): void => {
    textures.set(texture.source.uuid, texture);
  };
  if (isTexture(scene.background)) add(scene.background);
  if (scene.environment !== null) add(scene.environment);
  if (scene.overrideMaterial !== null) texturesOf(scene.overrideMaterial).forEach(add);
  scene.traverse((object) => {
    for (const material of materialsOf(object)) texturesOf(material).forEach(add);
  });
  let total = 0;
  for (const texture of textures.values()) total += textureBytes(texture);
  return total;
}

/**
 * Creates the renderer, appends its canvas to `host` and keeps it fitted to the host's size
 * with the capped pixel ratio. Throws, after logging, if WebGL is unavailable.
 */
export function createRenderer(host: HTMLElement): GameRenderer {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true });
  } catch (error) {
    log.error('render', 'WebGL is unavailable: the renderer could not be created', error);
    throw error;
  }
  renderer.toneMapping = NoToneMapping;

  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  host.append(canvas);

  let width = 0;
  let height = 0;
  const listeners = new Set<(width: number, height: number) => void>();

  function fit(): void {
    width = host.clientWidth;
    height = host.clientHeight;
    renderer.setPixelRatio(cappedPixelRatio(window.devicePixelRatio));
    // The canvas's CSS size is 100 % of the host; only the drawing buffer is set here.
    renderer.setSize(width, height, false);
    if (ratioQuery !== undefined && !ratioQuery.matches) watchPixelRatio();
    for (const listener of listeners) listener(width, height);
  }

  // A ResizeObserver misses a device-pixel-ratio change with no CSS size change (the window moved
  // to another monitor). A resolution media query matching the current ratio fires once when the
  // ratio changes; it is re-armed for the new ratio on every fit.
  let ratioQuery: MediaQueryList | undefined;
  function watchPixelRatio(): void {
    ratioQuery?.removeEventListener('change', fit);
    ratioQuery = window.matchMedia(`(resolution: ${String(window.devicePixelRatio)}dppx)`);
    ratioQuery.addEventListener('change', fit);
  }

  fit();
  watchPixelRatio();
  const observer = new ResizeObserver(fit);
  observer.observe(host);

  return {
    canvas,
    render(scene, camera) {
      renderer.render(scene, camera);
    },
    size: () => ({ width, height }),
    gpuName() {
      const gl = renderer.getContext();
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const name: unknown = gl.getParameter(
        debugInfo === null ? gl.RENDERER : debugInfo.UNMASKED_RENDERER_WEBGL,
      );
      return typeof name === 'string' ? name : 'unknown';
    },
    readStats(scene) {
      const { info } = renderer;
      return {
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length ?? 0,
        textureBytesEstimate: estimateTextureBytes(scene),
        pixelRatio: renderer.getPixelRatio(),
      };
    },
    onResize(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose() {
      observer.disconnect();
      ratioQuery?.removeEventListener('change', fit);
      listeners.clear();
      renderer.dispose();
      // Release the WebGL context now, not at garbage collection: browsers cap live contexts.
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

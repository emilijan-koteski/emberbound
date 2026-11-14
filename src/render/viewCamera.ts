// The view camera (architecture, Rendering Structure; AR162): a perspective camera with a narrow
// field of view, looking along −z at the play plane (z = 0), placed so the logical view in
// CONFIG.view is always fully visible. The style guide locked perspective on 2026-11-14 (§2
// Camera), so the orthographic option AR162 allows is not built.
//
// The field of view is fixed and the camera's distance follows the window's shape (story 0.10, D2):
// the box fills the axis that limits it, and a wider or taller window shows more around it, never a
// bigger box. 19 × 10.4 is wider than 16:9, so even 16:9 is limited by the width and shows a little
// extra height (about 0.29 tiles at margin 0).
//
// Following the simulation camera, with interpolation, is Epic 1's (stories 1.5 and 1.8): they call
// frame() every frame with the interpolated centre, so it allocates nothing.
import { MathUtils, PerspectiveCamera } from 'three';
import { invariant } from '../core/invariant.ts';
import { CONFIG } from '../sim/config.ts';

/** What the camera frames: the logical view, the margin around it, and the field of view. */
export interface FramedView {
  /** Tiles. */
  readonly width: number;
  readonly height: number;
  /** Tiles per side around the logical view, also framed (X-B35). */
  readonly margin: number;
  /** Degrees, vertical. */
  readonly fovDeg: number;
}

export interface Framing {
  /** The camera's distance from the play plane (z = 0), in tiles. */
  distance: number;
  /** The visible rectangle at z = 0, in tiles. */
  visibleWidth: number;
  visibleHeight: number;
  /** Width over height of the canvas this framing is for. */
  aspect: number;
}

/** Near and far planes, in tiles: the foreground sits a few tiles in front of z = 0, the far layer tens behind. */
export const VIEW_NEAR = 0.1;
export const VIEW_FAR = 1000;
/** A field of view must lie strictly between these, in degrees. */
const MAX_FOV_DEG = 180;

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/**
 * Frames a `boxWidth` × `boxHeight` rectangle at z = 0 for a canvas of `aspect`, with a vertical field
 * of view of `fovDeg`. Pure; writes into `out` when given and returns it. Throws (invariant) for an
 * aspect or size that isn't positive and finite, or a field of view outside (0°, 180°).
 */
export function frameBox(
  boxWidth: number,
  boxHeight: number,
  aspect: number,
  fovDeg: number,
  out: Framing = { distance: 0, visibleWidth: 0, visibleHeight: 0, aspect: 0 },
): Framing {
  invariant(isPositiveFinite(aspect), `aspect must be positive and finite, not ${String(aspect)}`);
  invariant(
    isPositiveFinite(boxWidth) && isPositiveFinite(boxHeight),
    `the framed box must have a positive size, not ${String(boxWidth)} × ${String(boxHeight)}`,
  );
  invariant(
    fovDeg > 0 && fovDeg < MAX_FOV_DEG,
    `the field of view must lie between 0° and 180°, not ${String(fovDeg)}°`,
  );
  const visibleHeight = Math.max(boxHeight, boxWidth / aspect);
  out.distance = visibleHeight / 2 / Math.tan(MathUtils.degToRad(fovDeg) / 2);
  out.visibleWidth = visibleHeight * aspect;
  out.visibleHeight = visibleHeight;
  out.aspect = aspect;
  return out;
}

/** frameBox for the logical view and its margin on every side: CONFIG.view unless `view` is given. */
export function viewFraming(
  aspect: number,
  out?: Framing,
  view: FramedView = CONFIG.view,
): Framing {
  return frameBox(
    view.width + 2 * view.margin,
    view.height + 2 * view.margin,
    aspect,
    view.fovDeg,
    out,
  );
}

/** On-screen pixels per tile at z = 0, for a canvas `heightPx` tall. */
export function tilePx(framing: Readonly<Framing>, heightPx: number): number {
  return heightPx / framing.visibleHeight;
}

export interface ViewCamera {
  readonly camera: PerspectiveCamera;
  /** The last framing: one object, rewritten by every frame(). */
  readonly framing: Readonly<Framing>;
  /** Frames the logical view centred on (centreX, centreY) for a canvas of `aspect`. Allocates nothing. */
  frame(centreX: number, centreY: number, aspect: number): void;
}

export function createViewCamera(view: FramedView = CONFIG.view): ViewCamera {
  const camera = new PerspectiveCamera(view.fovDeg, 1, VIEW_NEAR, VIEW_FAR);
  const framing = viewFraming(1, undefined, view);

  function frame(centreX: number, centreY: number, aspect: number): void {
    // Checked by comparison, so the per-frame call builds the message only on failure.
    if (!Number.isFinite(centreX) || !Number.isFinite(centreY)) {
      invariant(
        false,
        `the camera centre must be finite, not ${String(centreX)}, ${String(centreY)}`,
      );
    }
    viewFraming(aspect, framing, view);
    camera.aspect = aspect;
    camera.position.set(centreX, centreY, framing.distance);
    camera.lookAt(centreX, centreY, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  frame(0, 0, 1);
  return { camera, framing, frame };
}

// The stage and its depth layers (story 0.10, AC9–AC11, AC13). three.js core runs in Node; no
// WebGLRenderer is created. Depths come from STAGE_LAYERS and the framing from viewCamera.ts.
import type { BufferGeometry } from 'three';
import { Color, Mesh, PlaneGeometry, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import type { LevelPalette } from '../core/paletteSlots.ts';
import { CONFIG } from '../sim/config.ts';
import { DROWNED_MILL_RIG } from './lighting/drownedMill.ts';
import { EMBERWOOD_RIG } from './lighting/emberwood.ts';
import { HARROWMERE_RIG } from './lighting/harrowmere.ts';
import type { LightingRig } from './lighting/lightingRig.ts';
import { createBackdropMaterial } from './materials/backdropMaterial.ts';
import { DROWNED_MILL_PALETTE } from './palettes/drownedMill.ts';
import { EMBERWOOD_PALETTE } from './palettes/emberwood.ts';
import { HARROWMERE_PALETTE } from './palettes/harrowmere.ts';
import {
  coverageNeeded,
  createStage,
  foregroundIntruders,
  logicalViewBox,
  projectToPlayPlane,
  STAGE_LAYERS,
  visibleRectAt,
} from './stage.ts';
import type { Rect } from './stage.ts';
import { createViewCamera, VIEW_NEAR, viewFraming } from './viewCamera.ts';

const EXACT = 9;
const LEVELS = [
  { palette: EMBERWOOD_PALETTE, rig: EMBERWOOD_RIG },
  { palette: DROWNED_MILL_PALETTE, rig: DROWNED_MILL_RIG },
  { palette: HARROWMERE_PALETTE, rig: HARROWMERE_RIG },
] as const satisfies readonly { palette: LevelPalette; rig: LightingRig }[];
const [EMBERWOOD] = LEVELS;
/** 4:3, 16:9 and 21:9: the shapes the staging view is shot at (AC15). */
const ASPECTS = [1440 / 1080, 1920 / 1080, 2560 / 1080] as const;
/** A pan range for the tests; the staging view passes its own. */
const PAN_RANGE = 6;

function contains(outer: Rect, inner: Rect): boolean {
  const slack = 1e-9;
  return (
    outer.left <= inner.left + slack &&
    outer.right >= inner.right - slack &&
    outer.bottom <= inner.bottom + slack &&
    outer.top >= inner.top - slack
  );
}

describe('createStage', () => {
  it('holds four named layers at their depths, far to near', () => {
    const stage = createStage(EMBERWOOD.palette, EMBERWOOD.rig);
    const order = ['far', 'middle', 'play', 'foreground'] as const;
    expect(stage.scene.children).toEqual(order.map((layer) => stage.layers[layer]));
    for (const layer of order) {
      expect(stage.layers[layer].name).toBe(`stage-${layer}`);
      expect(stage.layers[layer].position.z).toBe(STAGE_LAYERS[layer]);
    }
    expect(STAGE_LAYERS.far).toBeLessThan(STAGE_LAYERS.middle);
    expect(STAGE_LAYERS.middle).toBeLessThan(STAGE_LAYERS.play);
    expect(STAGE_LAYERS.play).toBe(0);
    expect(STAGE_LAYERS.foreground).toBeGreaterThan(STAGE_LAYERS.play);
  });

  it('keeps the foreground in front of the camera at every window shape', () => {
    const nearest = Math.min(...ASPECTS.map((aspect) => viewFraming(aspect).distance));
    expect(STAGE_LAYERS.foreground).toBeLessThan(nearest - VIEW_NEAR);
  });

  it("sets the background to the palette's skyFar", () => {
    const stage = createStage(EMBERWOOD.palette, EMBERWOOD.rig);
    expect(stage.scene.background).toEqual(new Color(EMBERWOOD.palette.skyFar));
  });

  it('switches level by the palette and rig only: same materials, same uniforms, no recompile', () => {
    const stage = createStage(EMBERWOOD.palette, EMBERWOOD.rig);
    const material = createBackdropMaterial(stage.look, { slot: 'treeMid' });
    stage.layers.middle.add(new Mesh(new PlaneGeometry(), material));
    const version = material.version;
    const uniforms = Object.values(stage.look.uniforms);
    const background = stage.scene.background;
    for (const level of LEVELS) {
      stage.applyLevel(level.palette, level.rig);
      expect(stage.scene.background).toBe(background);
      expect(stage.scene.background).toEqual(new Color(level.palette.skyFar));
      expect(stage.look.palette).toBe(level.palette);
      expect(stage.look.rig).toBe(level.rig);
      Object.values(stage.look.uniforms).forEach((uniform, i) => {
        expect(uniform).toBe(uniforms[i]);
      });
      expect(material.version).toBe(version);
    }
  });

  it('frees what its layers hold and empties the scene on dispose', () => {
    const stage = createStage(EMBERWOOD.palette, EMBERWOOD.rig);
    const geometry: BufferGeometry = new PlaneGeometry();
    const material = createBackdropMaterial(stage.look, { slot: 'ridgeFar' });
    stage.layers.far.add(new Mesh(geometry, material));
    let freed = 0;
    geometry.addEventListener('dispose', () => (freed += 1));
    material.addEventListener('dispose', () => (freed += 1));
    stage.dispose();
    expect(freed).toBe(2);
    expect(stage.scene.children).toEqual([]);
  });
});

describe('projectToPlayPlane', () => {
  const distance = 20;
  const rect: Rect = { left: -1, right: 1, bottom: -1, top: 1 };

  it('leaves a rectangle on the play plane where it is', () => {
    expect(projectToPlayPlane(rect, 0, 5, 3, distance)).toEqual(rect);
  });

  it('grows a foreground rectangle and shrinks a far one about the camera centre', () => {
    const near = projectToPlayPlane(rect, STAGE_LAYERS.foreground, 0, 0, distance);
    const nearScale = distance / (distance - STAGE_LAYERS.foreground);
    expect(near.right).toBeCloseTo(nearScale, EXACT);
    expect(near.bottom).toBeCloseTo(-nearScale, EXACT);
    const far = projectToPlayPlane(rect, STAGE_LAYERS.far, 0, 0, distance);
    expect(far.top).toBeCloseTo(distance / (distance - STAGE_LAYERS.far), EXACT);
  });

  it('matches three.js: a projected corner lands on the same screen point', () => {
    const view = createViewCamera();
    view.frame(2, 1, 16 / 9);
    const corner = new Vector3(-3, -4, STAGE_LAYERS.foreground);
    const onPlane = projectToPlayPlane(
      { left: corner.x, right: corner.x, bottom: corner.y, top: corner.y },
      corner.z,
      2,
      1,
      view.framing.distance,
    );
    const screen = corner.clone().project(view.camera);
    const planeScreen = new Vector3(onPlane.left, onPlane.bottom, 0).project(view.camera);
    expect(planeScreen.x).toBeCloseTo(screen.x, EXACT);
    expect(planeScreen.y).toBeCloseTo(screen.y, EXACT);
  });

  it('refuses a rectangle at or behind the camera', () => {
    expect(() => projectToPlayPlane(rect, distance, 0, 0, distance)).toThrow('Invariant failed');
  });
});

describe('foregroundIntruders', () => {
  const framing = viewFraming(16 / 9);
  const box = logicalViewBox(0, 0);

  it('is the logical view, without the margin, centred on the camera', () => {
    expect(box.right - box.left).toBe(CONFIG.view.width);
    expect(box.top - box.bottom).toBe(CONFIG.view.height);
  });

  it('passes a piece that stays below the box', () => {
    const low: Rect = { left: -4, right: 4, bottom: box.bottom - 3, top: box.bottom - 1 };
    expect(foregroundIntruders(framing, 0, 0, [low])).toEqual([]);
  });

  // Seen from the camera, a foreground piece is pushed away from the screen's centre, by
  // D / (D − z): one that overlaps the box in world space may still land clear of it on screen.
  const scale = framing.distance / (framing.distance - STAGE_LAYERS.foreground);

  it('passes a piece inside the box in world space that lands below it on screen', () => {
    const top = (box.bottom / scale) * 1.01;
    const piece: Rect = { left: -1, right: 1, bottom: box.bottom - 2, top };
    expect(top).toBeGreaterThan(box.bottom);
    expect(foregroundIntruders(framing, 0, 0, [piece])).toEqual([]);
  });

  it('reports a piece that still overlaps the box on screen', () => {
    const piece: Rect = {
      left: -1,
      right: 1,
      bottom: box.bottom - 2,
      top: (box.bottom / scale) * 0.9,
    };
    expect(foregroundIntruders(framing, 0, 0, [piece])).toEqual([piece]);
  });
});

describe('coverageNeeded', () => {
  it('matches the area three.js sees at each depth, every shape and both pan extremes', () => {
    const centreY = 1.5;
    const view = createViewCamera();
    for (const z of Object.values(STAGE_LAYERS)) {
      const coverage = coverageNeeded(z, { aspects: ASPECTS, panRange: PAN_RANGE, centreY });
      for (const aspect of ASPECTS) {
        for (const pan of [-PAN_RANGE, PAN_RANGE]) {
          view.frame(pan, centreY, aspect);
          // The screen's corners, cast from the camera onto the plane at depth z.
          for (const [x, y] of [
            [-1, -1],
            [1, 1],
          ] as const) {
            const through = new Vector3(x, y, 0.5).unproject(view.camera);
            const from = view.camera.position;
            const t = (z - from.z) / (through.z - from.z);
            const hit = from.clone().lerp(through, t);
            expect(hit.x).toBeGreaterThanOrEqual(coverage.left - 1e-9);
            expect(hit.x).toBeLessThanOrEqual(coverage.right + 1e-9);
            expect(hit.y).toBeGreaterThanOrEqual(coverage.bottom - 1e-9);
            expect(hit.y).toBeLessThanOrEqual(coverage.top + 1e-9);
          }
          expect(contains(coverage, visibleRectAt(view.framing, pan, centreY, z))).toBe(true);
        }
      }
    }
  });
});

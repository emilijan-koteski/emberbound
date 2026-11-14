// The view camera's framing (story 0.10, AC1–AC4): a pure function, checked at the window shapes the
// game targets, and against three.js's own view-size maths on a real camera. Values come from
// CONFIG.view; nothing is retyped.
import { Vector2, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { CONFIG } from '../sim/config.ts';
import { createViewCamera, frameBox, tilePx, viewFraming } from './viewCamera.ts';
import type { FramedView } from './viewCamera.ts';

const EXACT = 9;

/** The window shapes: 16:9 (the main target and the itch.io embed), 4:3 and 21:9 (NFR14). */
const WINDOWS = [
  { name: '16:9, 1920 × 1080', width: 1920, height: 1080 },
  { name: '16:9, 1280 × 720', width: 1280, height: 720 },
  { name: '4:3, 1440 × 1080', width: 1440, height: 1080 },
  { name: '21:9, 2560 × 1080', width: 2560, height: 1080 },
] as const;

const { width, height, margin } = CONFIG.view;
const boxWidth = width + 2 * margin;
const boxHeight = height + 2 * margin;

describe('frameBox and viewFraming', () => {
  for (const window of WINDOWS) {
    it(`frames the whole logical view, and no more on the limiting axis, at ${window.name}`, () => {
      const aspect = window.width / window.height;
      const framing = viewFraming(aspect);
      expect(framing.aspect).toBe(aspect);
      expect(framing.visibleWidth / framing.visibleHeight).toBeCloseTo(aspect, EXACT);
      // The box fits on both axes…
      expect(framing.visibleWidth).toBeGreaterThanOrEqual(boxWidth - 1e-9);
      expect(framing.visibleHeight).toBeGreaterThanOrEqual(boxHeight - 1e-9);
      // …and fills the axis that limits it: a wider window adds width, a taller one adds height.
      if (aspect >= boxWidth / boxHeight) {
        expect(framing.visibleHeight).toBeCloseTo(boxHeight, EXACT);
        expect(framing.visibleWidth).toBeGreaterThan(boxWidth);
      } else {
        expect(framing.visibleWidth).toBeCloseTo(boxWidth, EXACT);
        expect(framing.visibleHeight).toBeGreaterThan(boxHeight);
      }
    });
  }

  it('limits 16:9 by the width too, at margin 0: 19 × 10.4 is wider than 16:9 (AC3)', () => {
    const view: FramedView = { ...CONFIG.view, margin: 0 };
    const framing = viewFraming(1920 / 1080, undefined, view);
    expect(framing.visibleWidth).toBeCloseTo(CONFIG.view.width, EXACT);
    expect(framing.visibleHeight).toBeGreaterThan(CONFIG.view.height);
  });

  it('limits 4:3 by the width and 21:9 by the height (AC3)', () => {
    expect(viewFraming(1440 / 1080).visibleWidth).toBeCloseTo(boxWidth, EXACT);
    expect(viewFraming(2560 / 1080).visibleHeight).toBeCloseTo(boxHeight, EXACT);
  });

  it('puts the camera where a vertical field of view of CONFIG.view.fovDeg sees that height', () => {
    const framing = viewFraming(16 / 9);
    const halfFov = (CONFIG.view.fovDeg * Math.PI) / 180 / 2;
    expect(framing.distance).toBeCloseTo(framing.visibleHeight / 2 / Math.tan(halfFov), EXACT);
  });

  it('frames any box the same way (the look-dev scenes frame their own)', () => {
    const framing = frameBox(4, 2, 1, CONFIG.view.fovDeg);
    expect(framing.visibleWidth).toBeCloseTo(4, EXACT);
    expect(framing.visibleHeight).toBeCloseTo(4, EXACT);
  });

  it('writes into the object it is given, and returns it', () => {
    const out = viewFraming(1);
    const again = viewFraming(2, out);
    expect(again).toBe(out);
    expect(out.aspect).toBe(2);
  });
});

describe('tilePx', () => {
  for (const window of WINDOWS) {
    it(`gives the overlay's --tile formula at ${window.name}`, () => {
      const framing = viewFraming(window.width / window.height);
      // ui/overlay.ts's computeTilePx, written out: render/ can't import ui/, and the look-dev check
      // ties the two together in the browser.
      const expected = Math.min(window.width / boxWidth, window.height / boxHeight);
      expect(tilePx(framing, window.height)).toBeCloseTo(expected, EXACT);
    });
  }
});

describe('a margin', () => {
  it('adds its width on each side of each axis', () => {
    const view: FramedView = { ...CONFIG.view, margin: 1 };
    const wide = viewFraming(2560 / 1080, undefined, view);
    expect(wide.visibleHeight).toBeCloseTo(CONFIG.view.height + 2, EXACT);
    const narrow = viewFraming(1440 / 1080, undefined, view);
    expect(narrow.visibleWidth).toBeCloseTo(CONFIG.view.width + 2, EXACT);
  });
});

describe('createViewCamera', () => {
  for (const window of WINDOWS) {
    it(`agrees with three.js's own view size at ${window.name}`, () => {
      const aspect = window.width / window.height;
      const view = createViewCamera();
      view.frame(3, -2, aspect);
      const { camera } = view;
      // Expected from the pure function, computed on its own, not read back from the camera.
      const expected = viewFraming(aspect);
      expect(camera.fov).toBe(CONFIG.view.fovDeg);
      expect(camera.aspect).toBe(aspect);
      expect(camera.position.toArray()).toEqual([3, -2, expected.distance]);
      const size = camera.getViewSize(camera.position.z, new Vector2());
      expect(size.x).toBeCloseTo(expected.visibleWidth, EXACT);
      expect(size.y).toBeCloseTo(expected.visibleHeight, EXACT);
      // It looks straight along −z, at the play plane.
      const direction = camera.getWorldDirection(new Vector3());
      expect(direction.x).toBeCloseTo(0, EXACT);
      expect(direction.y).toBeCloseTo(0, EXACT);
      expect(direction.z).toBeCloseTo(-1, EXACT);
    });
  }

  it('reuses one framing object across frames (no allocation per frame)', () => {
    const view = createViewCamera();
    view.frame(0, 0, 16 / 9);
    const first = view.framing;
    view.frame(1, 1, 4 / 3);
    expect(view.framing).toBe(first);
    expect(view.framing.aspect).toBe(4 / 3);
  });
});

describe('bad input', () => {
  for (const aspect of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    it(`throws for an aspect of ${String(aspect)}`, () => {
      expect(() => viewFraming(aspect)).toThrow(
        `aspect must be positive and finite, not ${String(aspect)}`,
      );
    });
  }

  it('throws for a centre that is not finite', () => {
    const view = createViewCamera();
    expect(() => {
      view.frame(Number.NaN, 0, 1);
    }).toThrow('the camera centre must be finite');
    expect(() => {
      view.frame(0, Number.POSITIVE_INFINITY, 1);
    }).toThrow('the camera centre must be finite');
  });

  it('throws for a field of view outside (0°, 180°) or an empty box', () => {
    expect(() => frameBox(1, 1, 1, 0)).toThrow('Invariant failed');
    expect(() => frameBox(1, 1, 1, 180)).toThrow('Invariant failed');
    expect(() => frameBox(0, 1, 1, 30)).toThrow('Invariant failed');
    expect(() => frameBox(1, -1, 1, 30)).toThrow('Invariant failed');
  });
});

import { expect, test } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { LOOKDEV_SPOTS } from '../../../src/lookdev/spots.ts';
import type { LookdevSpot } from '../../../src/lookdev/spots.ts';
import {
  PAN_RANGE_TILES,
  PAN_SPOT_TILES,
  RULER_SLOTS,
  STAGING_ASPECTS,
} from '../../../src/render/lookdevScenes.ts';
import { CONFIG } from '../../../src/sim/config.ts';
import { computeTilePx } from '../../../src/ui/overlay.ts';
import {
  expectLookdevReady,
  programs,
  waitForLookdevSettled,
  waitFrames,
} from '../lookdevReady.ts';
import { collectPageErrors, expectNoPageErrors } from '../pageErrors.ts';
import { channels, rowAt } from '../pixels.ts';
import type { Rgb } from '../pixels.ts';
import { GUIDE_LEVELS, guideHex } from '../styleGuidePalettes.ts';

// The staging view's checks (story 0.10, AC7, AC16, AC17; S1–S7). The on-screen tile is measured from
// the ruler's pixels and compared with --tile as ui/overlay.ts sets it, never with a number the page
// computed; colours are compared with docs/STYLE_GUIDE.md read here in Node.

/** AC7: --tile and the measured tile agree to within 1 px. */
const TILE_TOLERANCE_PX = 1;
/** The box's edges may sit half a pixel off the window's after projection and rounding. */
const EDGE_TOLERANCE_PX = 1;
/** --tile and computeTilePx: the same formula, so only float noise separates them. */
const FORMULA_TOLERANCE_PX = 0.5;
/** A rendered channel may round one step away from the hex (8-bit output of a linear value). */
const CHANNEL_TOLERANCE = 1;
/** At least this many cell edges in the measured row, so the average means something. */
const MIN_RULER_EDGES = 10;
/** Share of a ruler row that must be one of the two slots exactly (the rest: antialiased edges). */
const MIN_RULER_SHARE = 0.8;
/** Pixels kept between a sampled row and the box outline (2 px wide) or the caption. */
const OUTLINE_INSET_PX = 4;
/** Frames to wait after a switch: the statistics panel refreshes every 15. */
const FRAMES_AFTER_SWITCH = 20;
/** The width of the row S4 samples, centred on the window. */
const SAMPLE_ROW_PX = 300;

const STAGING_SPOTS = LOOKDEV_SPOTS.filter((spot) => spot.view === 'staging');
const { width: viewWidth, height: viewHeight, margin } = CONFIG.view;

interface Box {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

function spot(width: number, height: number, panTiles: number): LookdevSpot {
  const found = STAGING_SPOTS.find(
    (each) => each.width === width && each.height === height && each.panTiles === panTiles,
  );
  if (found === undefined)
    throw new Error(
      `no staging spot at ${String(width)} × ${String(height)}, pan ${String(panTiles)}`,
    );
  return found;
}

async function openSpot(page: Page, each: LookdevSpot): Promise<void> {
  await page.setViewportSize({ width: each.width, height: each.height });
  await page.goto(`/lookdev.html?spot=${encodeURIComponent(each.id)}`);
  await expectLookdevReady(page);
}

async function attribute(page: Page, name: string): Promise<string> {
  const value = await page.locator('.lookdev-staging').getAttribute(name);
  if (value === null) throw new Error(`the staging view has no ${name}`);
  return value;
}

async function readBox(page: Page): Promise<Box> {
  return {
    left: Number(await attribute(page, 'data-box-left')),
    top: Number(await attribute(page, 'data-box-top')),
    right: Number(await attribute(page, 'data-box-right')),
    bottom: Number(await attribute(page, 'data-box-bottom')),
  };
}

function readTile(page: Page): Promise<number> {
  return page
    .locator('.ui-overlay')
    .evaluate((root) => Number.parseFloat(getComputedStyle(root).getPropertyValue('--tile')));
}

function distanceSquared(a: Rgb, b: Rgb): number {
  return a.reduce((sum, value, i) => sum + (value - (b[i] ?? 0)) ** 2, 0);
}

function isWithinTolerance(seen: Rgb, expected: Rgb): boolean {
  return seen.every((value, i) => Math.abs(value - (expected[i] ?? 0)) <= CHANNEL_TOLERANCE);
}

/** The ruler's two slot colours for a level, from the style guide. */
function rulerColours(levelId: string, slots: readonly string[]): Rgb[] {
  return slots.map((slot) => channels(guideHex(levelId, slot)));
}

/** The share of `row` that draws one of `colours` exactly (within a channel step). */
function shareOf(row: readonly Rgb[], colours: readonly Rgb[]): number {
  const exact = row.filter((pixel) => colours.some((colour) => isWithinTolerance(pixel, colour)));
  return exact.length / row.length;
}

/**
 * The tile measured on the ruler: classify each pixel as the nearer of the two slot colours, find
 * where the class changes, and average the spacing between the first and the last change.
 */
function measureTile(
  row: readonly Rgb[],
  colours: readonly Rgb[],
): { tile: number; edges: number } {
  const first = colours.at(0);
  const second = colours.at(1);
  if (first === undefined || second === undefined) throw new Error('the ruler needs two colours');
  const classes = row.map((pixel) =>
    distanceSquared(pixel, first) <= distanceSquared(pixel, second) ? 0 : 1,
  );
  const edges: number[] = [];
  classes.forEach((value, i) => {
    if (i > 0 && value !== classes[i - 1]) edges.push(i);
  });
  const firstEdge = edges.at(0) ?? 0;
  const lastEdge = edges.at(-1) ?? 0;
  return { tile: (lastEdge - firstEdge) / Math.max(edges.length - 1, 1), edges: edges.length };
}

async function readRuler(page: Page, browser: Browser): Promise<Rgb[]> {
  const y = Number(await attribute(page, 'data-ruler-y'));
  const x0 = Number(await attribute(page, 'data-ruler-x0'));
  const x1 = Number(await attribute(page, 'data-ruler-x1'));
  return rowAt(page, browser, y, x0, x1);
}

for (const level of GUIDE_LEVELS) {
  test(`the ${level.id} staging view loads with no error (S1)`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`/lookdev.html?view=staging&level=${level.id}`);
    await expectLookdevReady(page);
    await expect(page.locator('.lookdev-staging')).toHaveAttribute('data-level', level.id);
    expectNoPageErrors(errors);
  });
}

for (const [width, height] of [
  [1920, 1080],
  [1280, 720],
] as const) {
  test(`--tile equals the tile measured on the ruler at ${String(width)} × ${String(height)} (S2, AC7)`, async ({
    page,
    browser,
  }) => {
    const errors = collectPageErrors(page);
    await openSpot(page, spot(width, height, 0));
    expect(
      await page.evaluate(() => window.devicePixelRatio),
      'a CSS pixel is one screenshot pixel',
    ).toBe(1);

    const tile = await readTile(page);
    expect(Math.abs(tile - computeTilePx(width, height, CONFIG.view))).toBeLessThan(
      FORMULA_TOLERANCE_PX,
    );

    const slots = (await attribute(page, 'data-ruler-slots')).split(' ');
    expect(slots).toEqual([...RULER_SLOTS]);
    const colours = rulerColours('emberwood', slots);
    const row = await readRuler(page, browser);
    // The row is on the ruler: almost every pixel is one of its two slots exactly.
    expect(
      shareOf(row, colours),
      'share of the row drawn in the ruler slots',
    ).toBeGreaterThanOrEqual(MIN_RULER_SHARE);
    const measured = measureTile(row, colours);
    expect(measured.edges).toBeGreaterThanOrEqual(MIN_RULER_EDGES);
    expect(
      Math.abs(measured.tile - tile),
      `measured ${measured.tile.toFixed(2)} px a tile, --tile ${tile.toFixed(2)} px`,
    ).toBeLessThanOrEqual(TILE_TOLERANCE_PX);
    expectNoPageErrors(errors);
  });
}

for (const each of STAGING_SPOTS) {
  test(`the logical view is fully on screen, limited by the right axis, at ${each.id} (S3)`, async ({
    page,
  }) => {
    await openSpot(page, each);
    // The spot's pan reached the camera: at its frozen time the sweep would also say 0, so a broken
    // pan path would otherwise shoot every spot at pan 0 (code review, 2026-11-14).
    expect(Number(await attribute(page, 'data-pan'))).toBe(each.panTiles);
    const box = await readBox(page);
    expect(box.left).toBeGreaterThanOrEqual(-EDGE_TOLERANCE_PX);
    expect(box.top).toBeGreaterThanOrEqual(-EDGE_TOLERANCE_PX);
    expect(box.right).toBeLessThanOrEqual(each.width + EDGE_TOLERANCE_PX);
    expect(box.bottom).toBeLessThanOrEqual(each.height + EDGE_TOLERANCE_PX);

    const framedWidth = viewWidth + 2 * margin;
    const framedHeight = viewHeight + 2 * margin;
    const isWidthLimited = each.width / each.height < framedWidth / framedHeight;
    if (isWidthLimited) {
      expect(
        Math.abs(box.right - box.left - (each.width * viewWidth) / framedWidth),
      ).toBeLessThanOrEqual(EDGE_TOLERANCE_PX);
    } else {
      expect(
        Math.abs(box.bottom - box.top - (each.height * viewHeight) / framedHeight),
      ).toBeLessThanOrEqual(EDGE_TOLERANCE_PX);
    }
    // 4:3 shows extra rows, 21:9 extra width (AC3).
    if (each.width === 1440) expect(isWidthLimited).toBe(true);
    if (each.width === 2560) expect(isWidthLimited).toBe(false);
  });

  test(`the foreground stays clear of the logical view at ${each.id} (S6, AC17)`, async ({
    page,
  }) => {
    await openSpot(page, each);
    const box = await readBox(page);
    const pieces = JSON.parse(await attribute(page, 'data-foreground')) as Box[];
    expect(pieces.length).toBeGreaterThan(0);
    const intruders = pieces.filter(
      (piece) =>
        piece.left < box.right - EDGE_TOLERANCE_PX &&
        piece.right > box.left + EDGE_TOLERANCE_PX &&
        piece.top < box.bottom - EDGE_TOLERANCE_PX &&
        piece.bottom > box.top + EDGE_TOLERANCE_PX,
    );
    expect(intruders, 'foreground pieces over the logical view').toEqual([]);
    // Not vacuous: at 4:3 the foreground shows below the box (D4).
    if (each.width === 1440) {
      const shown = pieces.filter(
        (piece) => piece.top < each.height && piece.right > 0 && piece.left < each.width,
      );
      expect(shown.length, 'foreground pieces on screen at 4:3').toBeGreaterThan(0);
    }
  });

  if (each.width === 1440) {
    test(`no foreground pixel lies inside the logical view at ${each.id} (S6, pixels)`, async ({
      page,
      browser,
    }) => {
      // The rendered pixels, not the page's numbers: the row just inside the box's bottom edge (clear
      // of the outline and the caption) holds no foregroundDark, while the window's bottom row, where
      // the plants stand at 4:3, does, so the colour test can see them (code review, 2026-11-14).
      await openSpot(page, each);
      const box = await readBox(page);
      const caption = await page.locator('.lookdev-staging-box-caption').boundingBox();
      if (caption === null) throw new Error('the box caption is not shown');
      const dark = channels(guideHex('emberwood', 'foregroundDark'));
      const isDark = (pixel: Rgb): boolean => isWithinTolerance(pixel, dark);
      const x0 = Math.ceil(caption.x + caption.width) + OUTLINE_INSET_PX;
      const x1 = Math.floor(box.right) - OUTLINE_INSET_PX;
      const inside = await rowAt(page, browser, Math.floor(box.bottom) - OUTLINE_INSET_PX, x0, x1);
      expect(inside.filter(isDark).length, 'foregroundDark pixels inside the box').toBe(0);
      const bottom = await rowAt(page, browser, each.height - 1, 0, each.width - 1);
      expect(
        bottom.filter(isDark).length,
        'foregroundDark pixels at the window bottom',
      ).toBeGreaterThan(0);
    });
  }
}

test('the picker switches level in place, with no new shader program (S4)', async ({
  page,
  browser,
}) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/lookdev.html?view=staging');
  await expectLookdevReady(page);
  await waitFrames(page, FRAMES_AFTER_SWITCH);
  const before = await programs(page);
  expect(before).not.toBe('');

  const sampleRuler = async (levelId: string): Promise<void> => {
    const slots = (await attribute(page, 'data-ruler-slots')).split(' ');
    const y = Number(await attribute(page, 'data-ruler-y'));
    const x0 = (1920 - SAMPLE_ROW_PX) / 2;
    // The camera sweeps, so the cells move under the row, but their colours don't.
    const row = await rowAt(page, browser, y, x0, x0 + SAMPLE_ROW_PX - 1);
    expect(
      shareOf(row, rulerColours(levelId, slots)),
      `${levelId}: the ruler in its own slots`,
    ).toBeGreaterThanOrEqual(MIN_RULER_SHARE);
  };

  await sampleRuler('emberwood');
  for (const levelId of ['drowned-mill', 'harrowmere', 'emberwood'] as const) {
    await page.locator(`[data-level-button="${levelId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`[?&]level=${levelId}(&|$)`));
    await expect(page.locator('.lookdev-staging')).toHaveAttribute('data-level', levelId);
    await waitFrames(page, FRAMES_AFTER_SWITCH);
    await sampleRuler(levelId);
    expect(await programs(page), `no program compiled for ${levelId}`).toBe(before);
  }
  expectNoPageErrors(errors);
});

test('an unknown level ends in the error state, naming it (S5)', async ({ page }) => {
  await page.goto('/lookdev.html?view=staging&level=zz-missing');
  expect(await waitForLookdevSettled(page)).toBe('error');
  await expect(page.locator('.lookdev-error')).toContainText('zz-missing');
});

test('the staging spots: four window shapes at two pans, in Emberwood (S7)', () => {
  expect(PAN_SPOT_TILES).toBeGreaterThan(0);
  expect(PAN_SPOT_TILES).toBeLessThanOrEqual(PAN_RANGE_TILES);
  const seen = STAGING_SPOTS.map(
    (each) => `${String(each.width)}x${String(each.height)}@${String(each.panTiles)}`,
  );
  const expected = ['1920x1080', '1280x720', '1440x1080', '2560x1080'].flatMap((size) => [
    `${size}@0`,
    `${size}@${String(PAN_SPOT_TILES)}`,
  ]);
  expect(seen).toEqual(expected);
  for (const each of STAGING_SPOTS) {
    expect(each.level, each.id).toBe('emberwood');
    // Every spot's shape is one the scene is built and checked for.
    const aspect = each.width / each.height;
    expect(
      STAGING_ASPECTS.some((covered) => Math.abs(covered - aspect) < 1e-9),
      `${each.id}: aspect ${aspect.toFixed(4)} is in STAGING_ASPECTS`,
    ).toBe(true);
  }
});

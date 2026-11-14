import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DESIGN_MD_PATH, readFrontmatter, readTokenGroups } from '../../../scripts/designTokens.ts';
import { MAX_PIXEL_RATIO } from '../../../src/render/renderer.ts';
import { CONFIG } from '../../../src/sim/config.ts';
import { LOOKDEV_SPOTS } from '../../../src/lookdev/spots.ts';
import { computeTilePx } from '../../../src/ui/overlay.ts';
import { expectLookdevReady, waitForLookdevSettled } from '../lookdevReady.ts';
import { collectPageErrors, expectNoPageErrors } from '../pageErrors.ts';

// The look-dev checks (story 0.6, AC15). `make shots` runs every spec in this folder against the
// dev server before it takes a shot, and stops on a failure. Stories 0.8, 0.10 and 0.12 add theirs.

const TILE_TOLERANCE_PX = 0.5;
const SPOT_SIZES = [
  { width: 1920, height: 1080 },
  { width: 1280, height: 720 },
] as const;

const designTokens = readTokenGroups(readFrontmatter(readFileSync(DESIGN_MD_PATH, 'utf8')));

async function openView(page: Page, viewId: string): Promise<void> {
  await page.goto(`/lookdev.html?view=${viewId}`);
  await expectLookdevReady(page);
}

function readTile(page: Page): Promise<number> {
  return page
    .locator('.ui-overlay')
    .evaluate((root) => Number.parseFloat(getComputedStyle(root).getPropertyValue('--tile')));
}

test('the page loads with no error and lists its views', async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto('/lookdev.html');
  await expectLookdevReady(page);
  await expect(page).toHaveTitle('Emberbound look-dev');
  await expect(page.locator('[data-lookdev-view]')).not.toHaveCount(0);
  expectNoPageErrors(errors);
});

test('every view renders with no error and has a spot', async ({ page, context }) => {
  await page.goto('/lookdev.html');
  const viewIds = await page
    .locator('[data-lookdev-view]')
    .evaluateAll((links) => links.map((link) => (link as HTMLElement).dataset.lookdevView ?? ''));
  expect(viewIds.length).toBeGreaterThan(0);

  for (const viewId of viewIds) {
    // A fresh page per view, so each view's errors are its own.
    const viewPage = await context.newPage();
    const errors = collectPageErrors(viewPage);
    await openView(viewPage, viewId);
    expectNoPageErrors(errors);
    await viewPage.close();
  }
  const spotViews = new Set(LOOKDEV_SPOTS.map((spot) => spot.view));
  expect(
    viewIds.filter((viewId) => !spotViews.has(viewId)),
    'views with no spot',
  ).toEqual([]);
  expect(
    LOOKDEV_SPOTS.filter((spot) => !viewIds.includes(spot.view)).map((spot) => spot.id),
    'spots whose view does not exist',
  ).toEqual([]);
});

test('an empty ?view= opens the first view', async ({ page }) => {
  await page.goto('/lookdev.html?view=');
  await expectLookdevReady(page);
  await expect(page.locator('[data-lookdev-view][aria-current="page"]')).toHaveCount(1);
});

test('an unknown view or spot ends in the error state with a message', async ({ page }) => {
  for (const query of ['view=zz-missing', 'spot=zz-missing']) {
    await page.goto(`/lookdev.html?${query}`);
    expect(await waitForLookdevSettled(page)).toBe('error');
    await expect(page.locator('.lookdev-error')).toContainText('zz-missing');
  }
});

test('--tile follows CONFIG.view at both spot sizes, and on resize', async ({ page }) => {
  const [first, second] = SPOT_SIZES;
  await page.setViewportSize(first);
  await openView(page, 'overlay');
  expect(
    Math.abs((await readTile(page)) - computeTilePx(first.width, first.height, CONFIG.view)),
  ).toBeLessThan(TILE_TOLERANCE_PX);

  // Resized without a reload: overlay.ts recomputes --tile.
  await page.setViewportSize(second);
  await expect
    .poll(async () =>
      Math.abs((await readTile(page)) - computeTilePx(second.width, second.height, CONFIG.view)),
    )
    .toBeLessThan(TILE_TOLERANCE_PX);
});

test("the overlay view shows DESIGN.md's colour roles and typography tokens", async ({ page }) => {
  await openView(page, 'overlay');

  const swatches = await page.locator('[data-lookdev-swatch]').evaluateAll((figures) =>
    figures.map((figure) => ({
      role: (figure as HTMLElement).dataset.lookdevSwatch ?? '',
      shown: figure.querySelector('[data-lookdev-swatch-value]')?.textContent ?? '',
    })),
  );
  expect(swatches.map((swatch) => swatch.role)).toEqual(Object.keys(designTokens.colors));
  // Each shown value is DESIGN.md's (base.css writes hex in lower case).
  for (const swatch of swatches) {
    expect(swatch.shown.toLowerCase(), swatch.role).toBe(
      (designTokens.colors[swatch.role] ?? '').toLowerCase(),
    );
  }

  const typeTokens = await page
    .locator('[data-lookdev-type]')
    .evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.lookdevType ?? ''));
  expect(typeTokens).toEqual(Object.keys(designTokens.typography));
});

for (const size of SPOT_SIZES) {
  test(`the overlay view fits ${String(size.width)} × ${String(size.height)} with no scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize(size);
    await openView(page, 'overlay');
    // The page itself can't scroll (html and body hide overflow), so the overlay root is what
    // must not overflow: it clips anything that doesn't fit.
    const overflow = await page.locator('.ui-overlay').evaluate((root) => ({
      height: root.scrollHeight - root.clientHeight,
      width: root.scrollWidth - root.clientWidth,
    }));
    expect(overflow).toEqual({ height: 0, width: 0 });
  });
}

test('the renderer view shows its statistics', async ({ page }) => {
  await openView(page, 'renderer');
  const panel = page.locator('.lookdev-stats');
  await expect(panel.locator('dt')).toHaveText([
    'Draw calls',
    'Triangles',
    'Geometries',
    'Textures',
    'Shader programs',
    'Texture memory (estimate)',
    'Pixel ratio',
  ]);
  await expect(panel.locator('dd')).toHaveCount(7);
  for (const value of await panel.locator('dd').allTextContents()) expect(value).not.toBe('');

  const pixelRatio = Number.parseFloat(
    (await panel.locator('[data-lookdev-stat="pixelRatio"]').textContent()) ?? '',
  );
  expect(pixelRatio).toBeGreaterThan(0);
  expect(pixelRatio).toBeLessThanOrEqual(MAX_PIXEL_RATIO);
});

test('the pixel ratio is capped on a high-density screen', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await openView(page, 'renderer');
  await expect(page.locator('[data-lookdev-stat="pixelRatio"]')).toHaveText(
    MAX_PIXEL_RATIO.toFixed(2),
  );
  await context.close();
});

// The developer's rule (2026-11-14): tests run WebGL on the GTX 1650. playwright.config.ts turns
// on PRIME render offload when GPU=nvidia (the Makefile's default); this fails if it didn't take.
test('WebGL runs on the GTX 1650 when GPU=nvidia', async ({ page }) => {
  test.skip(process.env.GPU !== 'nvidia', 'GPU=default: the browser picks its own GPU');
  await openView(page, 'renderer');
  await expect(page.locator('.lookdev-stats-gpu')).toContainText('GTX 1650');
});

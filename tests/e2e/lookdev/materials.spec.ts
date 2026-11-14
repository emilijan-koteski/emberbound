import { expect, test } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';
import { LOOKDEV_SPOTS } from '../../../src/lookdev/spots.ts';
import {
  expectLookdevReady,
  programs,
  waitForLookdevSettled,
  waitFrames,
} from '../lookdevReady.ts';
import { collectPageErrors, expectNoPageErrors } from '../pageErrors.ts';
import { channels, pixelAt } from '../pixels.ts';
import { GUIDE_LEVELS, guideHex } from '../styleGuidePalettes.ts';

// The materials view's checks (story 0.9, AC19; P1–P8). Shown values are compared with
// docs/STYLE_GUIDE.md read here in Node, never with the page itself. A shader that fails to compile is
// a console error from three.js, so P1 fails on it.

const SPOT_SIZE = { width: 1920, height: 1080 } as const;

/** The level ids the view uses, with each one's style-guide key and whether it hangs lanterns. */
const LEVELS = GUIDE_LEVELS;
type LevelId = (typeof LEVELS)[number]['id'];

/** The seven factories, in story 0.9's AC1 order. */
const FACTORY_ORDER = [
  'ground',
  'foliage',
  'character',
  'prop',
  'effect',
  'backdrop',
  'cardSilhouette',
] as const;

/** A rendered channel may round one step away from the hex (8-bit output of a linear value). */
const CHANNEL_TOLERANCE = 1;
/** Frames to wait after a switch: the statistics panel refreshes every 15. */
const FRAMES_AFTER_SWITCH = 20;

async function openLevel(page: Page, levelId: string): Promise<void> {
  await page.setViewportSize(SPOT_SIZE);
  await page.goto(`/lookdev.html?view=materials&level=${levelId}`);
  await expectLookdevReady(page);
}

async function probe(page: Page): Promise<{ x: number; y: number; slot: string }> {
  const root = page.locator('.lookdev-materials');
  const read = async (name: string): Promise<string> => (await root.getAttribute(name)) ?? '';
  return {
    x: Number(await read('data-probe-x')),
    y: Number(await read('data-probe-y')),
    slot: await read('data-probe-slot'),
  };
}

async function expectProbeShows(page: Page, browser: Browser, levelId: string): Promise<void> {
  const { x, y, slot } = await probe(page);
  expect(slot).not.toBe('');
  const seen = await pixelAt(page, browser, x, y);
  const expected = channels(guideHex(levelId, slot));
  const differences = seen.map((value, i) => Math.abs(value - (expected[i] ?? 0)));
  expect(
    Math.max(...differences),
    `${levelId} ${slot}: seen rgb(${seen.join(', ')}), expected rgb(${expected.join(', ')})`,
  ).toBeLessThanOrEqual(CHANNEL_TOLERANCE);
}

for (const level of LEVELS) {
  test(`the ${level.id} materials view loads with no error (P1)`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await openLevel(page, level.id);
    expectNoPageErrors(errors);
  });

  test(`the ${level.id} view shows the seven factories and the guide's mid values (P2, P3)`, async ({
    page,
  }) => {
    await openLevel(page, level.id);
    const rows = page.locator('[data-factory]');
    expect(
      await rows.evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).dataset.factory)),
    ).toEqual([...FACTORY_ORDER]);
    for (const factory of FACTORY_ORDER) {
      await expect(
        page.locator(`[data-factory="${factory}"] [data-slot]`),
        `${factory} names its slots`,
      ).not.toHaveCount(0);
    }

    const mids = await page.locator('[data-tone="mid"]').evaluateAll((nodes) =>
      nodes.map((node) => ({
        slot: (node as HTMLElement).dataset.slot ?? '',
        level: (node as HTMLElement).dataset.level ?? '',
        text: node.textContent,
      })),
    );
    expect(mids.length).toBeGreaterThan(FACTORY_ORDER.length);
    for (const mid of mids) {
      const shown = /#[0-9a-f]{6}/i.exec(mid.text)?.[0] ?? 'none';
      expect(shown.toUpperCase(), `${mid.level} ${mid.slot}`).toBe(
        guideHex(mid.level, mid.slot).toUpperCase(),
      );
    }
  });

  test(`the ${level.id} backdrop probe draws its slot's hex (P4)`, async ({ page, browser }) => {
    await openLevel(page, level.id);
    await expectProbeShows(page, browser, level.id);
  });

  test(`the ${level.id} view ${level.hasLanterns ? 'shows' : 'has no'} lantern, and Rowan's sample (P6)`, async ({
    page,
  }) => {
    await openLevel(page, level.id);
    await expect(page.locator('[data-warm-sample="lantern"]')).toHaveCount(
      level.hasLanterns ? 1 : 0,
    );
    await expect(page.locator('[data-warm-sample="rowan"]')).toHaveCount(1);
    // The lights the shader draws, read from the scene: Rowan's, and the lantern's in Emberwood.
    await expect(page.locator('.lookdev-materials')).toHaveAttribute(
      'data-warm-lights',
      level.hasLanterns ? '2' : '1',
    );
  });

  test(`the ${level.id} view fits 1920 × 1080: no column overflows, no labels overlap (P8)`, async ({
    page,
  }) => {
    await openLevel(page, level.id);
    // Each column is measured on its own: the side panel clips (overflow: hidden), so the root
    // alone can't see it (code review, 2026-11-14).
    for (const selector of ['.lookdev-materials', '.lookdev-materials-side']) {
      const overflow = await page.locator(selector).evaluate((node) => ({
        height: node.scrollHeight - node.clientHeight,
        width: node.scrollWidth - node.clientWidth,
      }));
      expect(overflow, selector).toEqual({ height: 0, width: 0 });
    }
    const boxes = await page
      .locator('.lookdev-materials-row')
      .evaluateAll((rows) => rows.map((row) => row.getBoundingClientRect().toJSON() as DOMRect));
    const sorted = [...boxes].sort((a, b) => a.top - b.top);
    sorted.forEach((box, i) => {
      expect(box.top, `label ${String(i)} top`).toBeGreaterThanOrEqual(0);
      expect(box.bottom, `label ${String(i)} bottom`).toBeLessThanOrEqual(SPOT_SIZE.height);
      const next = sorted.at(i + 1);
      if (next !== undefined)
        expect(box.bottom, `label ${String(i)} overlap`).toBeLessThanOrEqual(next.top);
    });
  });
}

// The program count catches a new set of defines (three caches programs by key, so a recompile with
// the same defines reuses one): that is the per-level #define this story forbids (AC10).
test('the picker switches level in place, with no new shader program (P5)', async ({
  page,
  browser,
}) => {
  const errors = collectPageErrors(page);
  await openLevel(page, 'emberwood');
  await waitFrames(page, FRAMES_AFTER_SWITCH);
  const before = await programs(page);
  expect(Number(before)).toBeGreaterThan(0);

  const switchTo = async (id: LevelId): Promise<void> => {
    await page.locator(`[data-level-button="${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`[?&]level=${id}(&|$)`));
    await expect(page.locator('.lookdev-materials')).toHaveAttribute('data-level', id);
    await waitFrames(page, FRAMES_AFTER_SWITCH);
  };

  await switchTo('drowned-mill');
  await expectProbeShows(page, browser, 'drowned-mill');
  expect(await programs(page), 'no shader compiled for the switch').toBe(before);
  await expect(page.locator('[data-warm-sample="lantern"]')).toHaveCount(0);

  await switchTo('emberwood');
  await expectProbeShows(page, browser, 'emberwood');
  expect(await programs(page), 'none compiled for the way back either').toBe(before);
  await expect(page.locator('[data-warm-sample="lantern"]')).toHaveCount(1);

  await switchTo('harrowmere');
  await expectProbeShows(page, browser, 'harrowmere');
  expect(await programs(page), 'none compiled for Harrowmere').toBe(before);
  expectNoPageErrors(errors);
});

test('a level without lanterns switches to Emberwood and back, its lantern made and disposed (P5)', async ({
  page,
}) => {
  // Opening where the lantern glass doesn't exist yet: the switch makes it, the way back disposes it
  // (the warm rule refuses a level change while it lives; code review, 2026-11-14).
  const errors = collectPageErrors(page);
  await openLevel(page, 'drowned-mill');
  await expect(page.locator('[data-warm-sample="lantern"]')).toHaveCount(0);
  await page.locator('[data-level-button="emberwood"]').click();
  await expect(page.locator('.lookdev-materials')).toHaveAttribute('data-warm-lights', '2');
  await expect(page.locator('[data-warm-sample="lantern"]')).toHaveCount(1);
  await page.locator('[data-level-button="drowned-mill"]').click();
  await expect(page.locator('.lookdev-materials')).toHaveAttribute('data-warm-lights', '1');
  await expect(page.locator('[data-warm-sample="lantern"]')).toHaveCount(0);
  expectNoPageErrors(errors);
});

test('an unknown level ends in the error state, naming it (P7)', async ({ page }) => {
  await page.goto('/lookdev.html?view=materials&level=zz-missing');
  expect(await waitForLookdevSettled(page)).toBe('error');
  await expect(page.locator('.lookdev-error')).toContainText('zz-missing');
});

test('every spot with a level names a known one (P8)', () => {
  const known = new Set<string>(LEVELS.map((level) => level.id));
  const materialsSpots = LOOKDEV_SPOTS.filter((spot) => spot.view === 'materials');
  expect(materialsSpots.map((spot) => spot.id)).toEqual([
    'lookdev-materials-emberwood-1080',
    'lookdev-materials-drowned-mill-1080',
    'lookdev-materials-harrowmere-1080',
  ]);
  // Every view's spots, the staging view's included (story 0.10).
  const levelSpots = LOOKDEV_SPOTS.filter((spot) => spot.level !== undefined);
  for (const spot of levelSpots) expect(known.has(spot.level ?? ''), spot.id).toBe(true);
});

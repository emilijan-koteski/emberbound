import { fileURLToPath } from 'node:url';
import { test } from '@playwright/test';
import { LOOKDEV_SPOTS } from '../../src/lookdev/spots.ts';
import { expectLookdevReady } from './lookdevReady.ts';
import { collectPageErrors, expectNoPageErrors } from './pageErrors.ts';

// The critic loop's screenshot harness (story 0.6; architecture, Deterministic Screenshot Spots).
// `make shots ROUND=n` runs it after the look-dev checks, against the dev server, in headless
// Chromium, and saves shots/round-<n>/<spotId>.png. Shots are compared by eye against the style
// guide, never pixel-diffed, and never used for performance numbers: headless WebGL renders in
// software. Epic 1 adds gameplay spots through src/debug/spots.ts and ?shot=<spotId>.

const round = process.env.ROUND ?? '';
if (!/^[0-9]+$/.test(round)) {
  throw new Error('shots.spec.ts needs ROUND, a whole number: run it through `make shots ROUND=n`');
}

// Absolute, so the shots land in the repository's shots/ whatever folder Playwright runs from.
// `make shots` renames round-<n>.partial/ to round-<n>/ only when every spot succeeds.
const roundFolder = fileURLToPath(new URL(`../../shots/round-${round}.partial/`, import.meta.url));

for (const spot of LOOKDEV_SPOTS) {
  test(`shot ${spot.id}`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: spot.width, height: spot.height });
    await page.goto(`/lookdev.html?spot=${encodeURIComponent(spot.id)}`);
    await expectLookdevReady(page);
    expectNoPageErrors(errors);
    await page.screenshot({ path: `${roundFolder}${spot.id}.png` });
  });
}

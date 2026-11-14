import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { collectPageErrors, expectNoPageErrors } from './pageErrors.ts';

// The production build boots with no console error. Epic 6 extends this to the full smoke
// checks (title gate, level, pause, refused storage and so on).
test('the production build boots without console errors', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/');
  await page.waitForLoadState('load');

  await expect(page).toHaveTitle('Emberbound');
  await expect(page.locator('#game')).toHaveCount(1);
  expectNoPageErrors(errors);
});

const DIST = fileURLToPath(new URL('../../dist/', import.meta.url));
const TEXT_FILE = /\.(html|js|css)$/;

function listFiles(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

// The look-dev page is development only (AR170, AR228): no entry and no code of it in dist/
// (story 0.6, AC3). It reads files, not a page, so it runs once, not per browser.
test('dist/ holds no look-dev entry and no look-dev code', () => {
  test.skip(test.info().project.name !== 'chromium', 'reads dist/ once, not per browser');
  const files = listFiles(DIST);
  expect(files.length).toBeGreaterThan(0);

  const paths = files.map((file) => relative(DIST, file));
  expect(paths.filter((path) => /lookdev/i.test(path))).toEqual([]);

  const withLookdevCode = files
    .filter((file) => TEXT_FILE.test(file))
    .filter((file) => /lookdev/i.test(readFileSync(file, 'utf8')))
    .map((file) => relative(DIST, file));
  expect(withLookdevCode).toEqual([]);
});

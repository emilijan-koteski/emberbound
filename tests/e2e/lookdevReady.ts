import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// The look-dev page's ready flag (story 0.6, D3): <html data-lookdev-ready> is "false" while a view
// starts, then "true", or "error" if it failed. Shared by the look-dev checks and the harness, with
// two small helpers the checks share: waiting a few frames, and reading the program count.
// Not a test file: Playwright's default testMatch skips it.

/** Waits until the page has finished starting, either way, and returns the final state. */
export async function waitForLookdevSettled(page: Page): Promise<string> {
  await page.waitForFunction(() => {
    const state = document.documentElement.dataset.lookdevReady;
    return state === 'true' || state === 'error';
  });
  return (await page.locator('html').getAttribute('data-lookdev-ready')) ?? '';
}

/** Waits for the page and fails at once, with the page's own message, if it reports an error. */
export async function expectLookdevReady(page: Page): Promise<void> {
  const state = await waitForLookdevSettled(page);
  const message = state === 'error' ? await page.locator('.lookdev-error').textContent() : null;
  expect(state, message ?? undefined).toBe('true');
}

/** Resolves after `count` animation frames in the page. */
export function waitFrames(page: Page, count: number): Promise<void> {
  return page.evaluate(
    (frames) =>
      new Promise<void>((resolve) => {
        let left = frames;
        const tick = (): void => {
          left -= 1;
          if (left <= 0) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    count,
  );
}

/** The shader-program count the look-dev statistics panel shows (story 0.9; refreshed every 15 frames). */
export function programs(page: Page): Promise<string> {
  return page
    .locator('[data-lookdev-stat="programs"]')
    .textContent()
    .then((text) => text ?? '');
}

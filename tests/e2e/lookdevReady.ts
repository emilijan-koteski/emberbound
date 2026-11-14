import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// The look-dev page's ready flag (story 0.6, D3): <html data-lookdev-ready> is "false" while a view
// starts, then "true", or "error" if it failed. Shared by the look-dev checks and the harness.
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

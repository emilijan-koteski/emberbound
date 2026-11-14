import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Collects what a page got wrong while it loaded (story 0.6, D14): console errors, uncaught page
// errors and failed requests. Shared by the smoke check, the look-dev checks and the screenshot
// harness. Not a test file: Playwright's default testMatch skips it.

export interface PageErrors {
  readonly consoleErrors: string[];
  readonly pageErrors: string[];
  readonly failedRequests: string[];
}

export function collectPageErrors(page: Page): PageErrors {
  const errors: PageErrors = { consoleErrors: [], pageErrors: [], failedRequests: [] };
  page.on('console', (message) => {
    if (message.type() === 'error') errors.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.pageErrors.push(error.message);
  });
  // A missing asset is not always a console error, so check the requests too. Both `vite
  // preview` and Vite's dev server answer a missing file with their SPA fallback (200,
  // index.html) whenever the request accepts */*, as image, fetch and script requests do. So an
  // HTML response to anything but the page itself counts as missing too.
  page.on('requestfailed', (request) => {
    errors.failedRequests.push(`${request.url()} (${request.failure()?.errorText ?? 'failed'})`);
  });
  page.on('response', (response) => {
    const status = response.status();
    const isHtml = (response.headers()['content-type'] ?? '').startsWith('text/html');
    if (status >= 400) errors.failedRequests.push(`${response.url()} (${String(status)})`);
    else if (isHtml && response.request().resourceType() !== 'document')
      errors.failedRequests.push(`${response.url()} (SPA fallback: HTML instead of the file)`);
  });
  return errors;
}

/** Asserts all three lists are empty, as one object, so a failure shows every kind at once. */
export function expectNoPageErrors(errors: PageErrors): void {
  expect(errors).toEqual({ consoleErrors: [], pageErrors: [], failedRequests: [] });
}

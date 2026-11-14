import { expect, test } from '@playwright/test';

// The production build boots with no console error. Epic 6 extends this to the full smoke
// checks (title gate, level, pause, refused storage and so on).
test('the production build boots without console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  // A missing asset is not always a console error, so check the requests too. `vite preview`
  // answers a missing file with its SPA fallback (200, index.html) whenever the request
  // accepts */*, as image, fetch and script requests do. So an HTML response to anything but
  // the page itself counts as missing too.
  const failedRequests: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.url()} (${request.failure()?.errorText ?? 'failed'})`);
  });
  page.on('response', (response) => {
    const status = response.status();
    const isHtml = (response.headers()['content-type'] ?? '').startsWith('text/html');
    if (status >= 400) failedRequests.push(`${response.url()} (${String(status)})`);
    else if (isHtml && response.request().resourceType() !== 'document')
      failedRequests.push(`${response.url()} (SPA fallback: HTML instead of the file)`);
  });

  await page.goto('/');
  await page.waitForLoadState('load');

  await expect(page).toHaveTitle('Emberbound');
  await expect(page.locator('#game')).toHaveCount(1);
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

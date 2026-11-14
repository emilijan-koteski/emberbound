import { defineConfig, devices } from '@playwright/test';

// Browser checks. `make smoke` builds first, then runs tests/e2e/smoke.spec.ts against the
// production build served by `make preview` (default X-B20). Story 0.6 adds the dev-server
// checks and the screenshot harness.

// The Makefile owns the port and exports it; 4173 matches its default for a direct run.
const port = process.env.PREVIEW_PORT ?? '4173';
const url = `http://localhost:${port}`;

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: true,
  use: { baseURL: url },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    // The preview command is defined once, in the Makefile.
    command: `make preview PREVIEW_PORT=${port}`,
    url,
    // Always serve the build `make smoke` just made, never a server left running.
    reuseExistingServer: false,
    timeout: 30_000,
  },
});

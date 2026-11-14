import { defineConfig, devices } from '@playwright/test';

// Browser checks, against one of two servers (story 0.6, D1):
//
// - preview (default): `make smoke` builds first, then runs tests/e2e/smoke.spec.ts against the
//   production build served by `make preview`, in Chromium and Firefox (default X-B20).
// - dev (E2E_TARGET=dev; any value but "dev" or "preview" is an error): `make shots` runs the look-dev checks in tests/e2e/lookdev/, then the
//   screenshot harness tests/e2e/shots.spec.ts, against the Vite dev server, in Chromium only.
//
// Each target ignores the other's specs, so a bare `playwright test` never runs the dev specs
// against the build. The Makefile owns both ports and exports them; the defaults here match its
// defaults for a direct run.
const target = process.env.E2E_TARGET ?? 'preview';
if (target !== 'dev' && target !== 'preview') {
  throw new Error(`E2E_TARGET must be "dev" or "preview", not "${target}"`);
}
const isDevTarget = target === 'dev';

/** An unset or empty variable takes the default; anything else must be a port number. */
function portFrom(value: string | undefined, fallback: string): string {
  if (value === undefined || value === '') return fallback;
  if (!/^[0-9]+$/.test(value)) throw new Error(`Not a port number: "${value}"`);
  return value;
}
const previewPort = portFrom(process.env.PREVIEW_PORT, '4173');
const shotsPort = portFrom(process.env.SHOTS_PORT, '5174');
const port = isDevTarget ? shotsPort : previewPort;
const url = `http://localhost:${port}`;

// The GPU (decided by the developer, 2026-11-14): every browser test runs WebGL on the laptop's
// NVIDIA GTX 1650, never the Intel UHD 630 or software (SwiftShader). GPU=nvidia (the Makefile's
// default) sets NVIDIA PRIME render offload for the browsers Playwright launches, and Chromium's
// ANGLE takes the desktop GL path that honours it (checked 2026-11-14: headless Chromium reports
// "NVIDIA GeForce GTX 1650", Firefox its masked NVIDIA class). GPU=default leaves the browsers
// alone, for a machine without that card. tests/e2e/lookdev/ checks the GPU in use.
const gpu = process.env.GPU ?? 'default';
if (gpu !== 'nvidia' && gpu !== 'default') {
  throw new Error(`GPU must be "nvidia" or "default", not "${gpu}"`);
}
const isNvidia = gpu === 'nvidia';
const NVIDIA_OFFLOAD_ENV = {
  __NV_PRIME_RENDER_OFFLOAD: '1',
  __VK_LAYER_NV_optimus: 'NVIDIA_only',
  __GLX_VENDOR_LIBRARY_NAME: 'nvidia',
};
/** The parent environment plus the offload variables; Playwright's `env` replaces, not merges. */
function nvidiaEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) if (value !== undefined) env[key] = value;
  return { ...env, ...NVIDIA_OFFLOAD_ENV };
}
const chromiumLaunch = isNvidia
  ? { env: nvidiaEnv(), args: ['--ignore-gpu-blocklist', '--use-angle=gl'] }
  : {};
const firefoxLaunch = isNvidia ? { env: nvidiaEnv() } : {};

const chromium = {
  name: 'chromium',
  use: { ...devices['Desktop Chrome'], launchOptions: chromiumLaunch },
};
const firefox = {
  name: 'firefox',
  use: { ...devices['Desktop Firefox'], launchOptions: firefoxLaunch },
};

export default defineConfig({
  testDir: 'tests/e2e',
  testIgnore: isDevTarget ? ['smoke.spec.ts'] : ['lookdev/**', 'shots.spec.ts'],
  forbidOnly: true,
  use: { baseURL: url },
  projects: isDevTarget ? [chromium] : [chromium, firefox],
  webServer: isDevTarget
    ? {
        // The harness starts its own dev server on its own port and never reuses one, so a
        // `make dev` left open (or another project's server) is never captured (D2).
        command: `make dev DEV_PORT=${shotsPort}`,
        url: `${url}/lookdev.html`,
        reuseExistingServer: false,
        timeout: 60_000,
      }
    : {
        // The preview command is defined once, in the Makefile.
        command: `make preview PREVIEW_PORT=${previewPort}`,
        url,
        // Always serve the build `make smoke` just made, never a server left running.
        reuseExistingServer: false,
        timeout: 30_000,
      },
});

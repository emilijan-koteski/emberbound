/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative URLs everywhere in dist/, as itch.io's HTML5 hosting needs.
  base: './',
  test: {
    // Node only, no DOM environment (no jsdom): DOM screens are checked with Playwright.
    environment: 'node',
    // Explicit, because Vitest's default also matches the Playwright *.spec.ts files.
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'tests/levels/**/*.test.ts'],
  },
});

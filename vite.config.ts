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
    // Off (Vitest 5 turns it on): the module cache keys a file by its own content, so a test that
    // lists files with import.meta.glob (render/materials/shaderBoundary.test.ts) would keep the list
    // from its first run and miss every file added since (story 0.9, D16).
    fsModuleCache: false,
  },
});

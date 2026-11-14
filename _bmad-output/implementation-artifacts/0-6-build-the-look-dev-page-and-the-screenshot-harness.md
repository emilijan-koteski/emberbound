---
baseline_commit: 766e01ca5a53c0cb418c374901916c501188e051
---

# Story 0.6: Build the look-dev page and the screenshot harness

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a development-only look-dev page with the renderer, its statistics and the overlay's colour roles and type, plus a harness that screenshots it at fixed spots,
so that every asset and screen is judged in the engine against the style guide, and the critic loop can run from this story on.

**Requirements:** PR14, PR23, AR170, AR177, AR178, AR219, AR221 (`make shots`), AR222, AR228 (look-dev left out of the build), UX-DR16, X-B35; UX-DR9 and AR183 (the `--tile` setter only)
**Epic:** 0, Reference and style lock. Stories 0.1 to 0.5 are done; this is the sixth story and the first that renders anything, so it is the first with a critic loop.

## Acceptance Criteria

The epic's ACs, made exact. Where this story reads the epic differently, the decision is in Dev Notes › Decisions (D1–D14) and the developer can veto it at review.

### The page

1. **Given** `lookdev.html` at the repository root as a second Vite entry, with `src/lookdev/main.ts` and `src/lookdev/assetBrowser.ts`, **when** the developer runs `make dev`, **then** the page is served at `/lookdev.html`, and `assetBrowser.ts` holds the one list of views; the page shows that list as navigation, and each later story adds its view there.
2. The page opens a view from `?view=<id>` (default: the first view), and a spot from `?spot=<spotId>`, which fixes the view, the camera and the animation time (D3).
3. **Given** `make build`, **then** `dist/` holds no look-dev entry and no look-dev code: no path in `dist/` contains `lookdev`, and no `.html`, `.js` or `.css` file in it contains the string `lookdev`. A permanent check in `tests/e2e/smoke.spec.ts` asserts this (D11). `make build`'s budget check still passes.

### The renderer and its statistics

4. **Given** `src/render/renderer.ts`, **when** the page's 3D view opens or the window is resized, **then** it owns the `WebGLRenderer`, fits the canvas to its host, and sets the pixel ratio to `min(devicePixelRatio, MAX_PIXEL_RATIO)`, with `MAX_PIXEL_RATIO = 1.5` † (D7). The 3D view holds an empty scene until later stories add to it.
5. The 3D view shows a statistics panel with: draw calls, triangles, geometries, textures, shader programs, texture memory (estimate) and the pixel ratio in use. The texture-memory row is labelled as an estimate (D8: three.js r187's `renderer.info` counts textures but never measures bytes; confirmed in `node_modules/three/src/renderers/webgl/WebGLInfo.js`). Shadow-map size and post-processing pass count are not shown yet; story 0.11 adds them.
6. Vitest tests in Node cover the pixel-ratio cap and the texture-memory estimate (Tests).

### The overlay view

7. **Given** `src/ui/styles/base.css`, **when** the overlay view opens, **then** it shows the 16 colour roles as labelled swatches, each filled from and labelled with its `--colors-*` property's value, and the 8 typography tokens, each rendered through its `--typography-*` properties with a sample line. Both lists are read at runtime from the `.ui-overlay` rule in `base.css`, never typed out in look-dev code (D9).
8. Every swatch and sample sits inside the overlay root (`.ui-overlay`) and uses only token properties; the numeric samples add `font-variant-numeric: tabular-nums` (DESIGN.md's `note`, not emitted by `base.css`). Each type sample's label shows its token name and its computed font size in px, so the pixel floors can be checked at 1280 × 720.
9. The overlay view fits the viewport with no scrolling at 1920 × 1080 and at 1280 × 720.
10. **Given** `src/ui/overlay.ts`, **then** it creates the overlay root (`div.ui-overlay`) in a host element and sets `--tile` on it on load and on every resize, from `CONFIG.view` in `src/sim/config.ts`: `min(innerWidth / (width + 2 × margin), innerHeight / (height + 2 × margin))` px, with `CONFIG.view = { width: 19, height: 10.4, margin: 0 }` in tiles (D6, default X-B35). That gives about 101 px at 1920 × 1080 and about 67 px at 1280 × 720 (UX-DR9). Layer stacking and the mute indicator are left for story 1.11.
11. The ESLint boundary for `lookdev/` allows `ui/` (overlay root, styles, components), `render/`, `content/` and `core/`, and bans three.js, `sim/`, `app/`, `audio/`, `platform/`, `input/` and `debug/`. It already does (story 0.1); throwaway checks L1–L3 prove it.

### The harness

12. **Given** `tests/e2e/shots.spec.ts`, headless Chromium and the Vite dev server started by Playwright's `webServer`, **when** the developer runs `make shots ROUND=n`, **then** every look-dev spot is saved as `shots/round-<n>/<spotId>.png`.
13. Each spot fixes the view, the window size (1920 × 1080 unless the spot says otherwise), the camera and the animation time, and the spec waits until the page reports that the view has rendered (`<html data-lookdev-ready="true">`, D3) before it captures.
14. The spots are one list in `src/lookdev/spots.ts`, which the spec imports. Epic 1 adds gameplay spots through `src/debug/spots.ts` and `?shot=<spotId>`.
15. Look-dev Playwright checks live in `tests/e2e/lookdev/`. `make shots` runs them first, against the dev server, and a failing check stops the run before any shot is taken or `shots/round-<n>/` is created. This story adds `tests/e2e/lookdev/lookdev.spec.ts` (Tests); stories 0.8, 0.10 and 0.12 add theirs there.
16. `make shots` without `ROUND`, with a `ROUND` that isn't a whole number, or with a `shots/round-<n>/` that already exists, exits non-zero with a one-line usage message and takes no shot (D10).
17. **Given** two `make shots` runs with different round numbers, **when** their shots are compared by eye, **then** they match. Shots are never pixel-diffed, and no performance number is ever taken from them, they are judged by eye, and headless runs aren't real frames, even with WebGL on the developer's GTX 1650 (sprint change proposal 2026-11-14, GPU; without the GPU settings, Playwright 1.65.0's headless Chromium 158 falls back to SwiftShader).

### The critic loop

18. **Given** the look-dev spots at 1920 × 1080 and 1280 × 720, **when** the critic loop runs (`make shots ROUND=n`, at most 3 rounds), **then** each shot is opened and looked at before it is described, the swatches are compared with the token values and `docs/STYLE_GUIDE.md`, the type is checked for legibility at both sizes, and the three biggest problems are written down, most important first, and fixed.
19. Until story 0.14 updates DESIGN.md, the swatches show DESIGN.md's provisional greys. Differences from `docs/STYLE_GUIDE.md` are expected and listed for 0.14 (Dev Notes › Expected differences), not fixed; neither `base.css` nor DESIGN.md is edited to match (readiness proposal 2026-11-13, Q14). The same holds for the typefaces (`system-ui` until 0.8 and 0.14).
20. The developer sees the before and after shots and signs off.

### Done means checked

21. `make check`, `make build`, `make smoke` and `make shots ROUND=<n>` pass. `make help` lists `shots`. README says how to open the look-dev page and run the harness.

## Tasks / Subtasks

- [x] **T0: Baseline** (AC: all)
  - [x] `git status`: story 0.5's work (`docs/STYLE_GUIDE.md`, its story file, the correct-course edits) must be committed before this story starts. If it isn't, stop and ask the developer to commit it (commit straight on master; push only when asked).
  - [x] Set `baseline_commit` in this file's frontmatter to `git rev-parse HEAD`.
- [x] **T1: `CONFIG.view`** (AC: 10)
  - [x] Add `view: { width: 19, height: 10.4, margin: 0 }` to `CONFIG` in `src/sim/config.ts`, units in comments (tiles; margin per side, † until story 0.10 locks the framing, X-B35). Keep `as const`. Update the file's header comment.
- [x] **T2: `ui/overlay.ts`** (AC: 10)
  - [x] Export `computeTilePx(viewportWidth, viewportHeight, view)` (pure) and `createOverlay(host: HTMLElement)`, which appends `div.ui-overlay`, sets `--tile` (`${px}px`) on it, recomputes on `resize`, and returns `{ root, dispose() }` (dispose removes the listener and the root).
  - [x] No DOM access at module top level, so Node tests and Playwright specs can import `computeTilePx`.
  - [x] Write `src/ui/overlay.test.ts` (Tests).
- [x] **T3: `render/renderer.ts`** (AC: 4, 5, 6)
  - [x] Export `MAX_PIXEL_RATIO = 1.5` (†), `cappedPixelRatio(devicePixelRatio)`, `estimateTextureBytes(scene)` and `createRenderer(host: HTMLElement)`.
  - [x] `createRenderer` makes one `WebGLRenderer({ antialias: true })` (D13), appends its canvas to the host, keeps three's default colour management (`outputColorSpace` sRGB) and **no tone mapping**, fits the canvas with a `ResizeObserver` on the host (`setSize(w, h, false)` plus CSS 100 %), re-applies the capped pixel ratio on every resize, and returns `{ canvas, render(scene, camera), readStats(scene): RendererStats, onResize(cb), dispose() }`.
  - [x] If `WebGLRenderer` throws (no WebGL), log once on the `render` channel and rethrow; the view shows a plain message.
  - [x] Write `src/render/renderer.test.ts` (Tests).
- [x] **T4: `render/lookdevScenes.ts`** (AC: 4) (D4)
  - [x] Export `createEmptyLookdevScene()` returning `{ scene, camera, setAspect(aspect), update(timeSeconds), dispose() }`: an empty `Scene` and a placeholder `PerspectiveCamera` (fov 30 †, at z = 10 looking at the origin). Story 0.10 replaces the camera with `viewCamera.ts`; 0.9, 0.10 and 0.12 add their 3D builders here.
- [x] **T5: The look-dev page** (AC: 1, 2, 7, 8, 9)
  - [x] `lookdev.html` at the root (title `Emberbound look-dev`, `<link rel="icon" href="data:,">` like `index.html`), loading `/src/lookdev/main.ts`. Do **not** add it to `build.rolldownOptions.input` (D11).
  - [x] `src/lookdev/assetBrowser.ts`: the `LOOKDEV_VIEWS` list (`{ id, label, mount(host, options) }`) and the navigation built from it, each link marked `data-lookdev-view="<id>"`.
  - [x] `src/lookdev/main.ts`: reads `?view=` and `?spot=`, mounts the view, runs the frame loop, and manages the ready flag (D3). Imports `../ui/styles/base.css` and `./lookdev.css`.
  - [x] `src/lookdev/rendererView.ts`: the renderer, the empty scene and the statistics panel (lookdev chrome, updated in the DOM only when a value changes).
  - [x] `src/lookdev/overlayView.ts`: `createOverlay()`, then the swatch grid and the type samples inside the overlay root, enumerated from base.css (D9). Fits both spot sizes (AC9).
  - [x] `src/lookdev/spots.ts`: `LOOKDEV_SPOTS` (pure data, no DOM, no imports).
  - [x] `src/lookdev/lookdev.css`: the page chrome (D12).
- [x] **T6: Playwright and the Makefile** (AC: 3, 12–17, 21)
  - [x] `playwright.config.ts`: the `E2E_TARGET` switch (D1). Keep the preview target exactly as it behaves now.
  - [x] Makefile: `DEV_PORT` for `make dev` (D2), `SHOTS_PORT`, the `shots` target with its guards (D10); remove `shots` from the header's "Targets added by later stories"; add `shots` to `.PHONY`.
  - [x] `tests/e2e/pageErrors.ts`: move smoke's console, page-error and failed-request collector into a helper (D14); `smoke.spec.ts`, `lookdev.spec.ts` and `shots.spec.ts` use it.
  - [x] `tests/e2e/lookdev/lookdev.spec.ts` (Tests) and `tests/e2e/shots.spec.ts`.
  - [x] `tests/e2e/smoke.spec.ts`: add the `dist/` look-dev check (AC3).
- [x] **T7: Throwaway checks** L1–L8 (Dev Notes), each recorded in the Debug Log, then removed.
- [x] **T8: README** (AC: 21): the look-dev page (`make dev`, then `/lookdev.html`), `make shots ROUND=n`, where shots land, and that they are git-ignored and kept by `make clean`.
- [x] **T9: `make check`, `make build`, `make smoke`** pass; record the counts.
- [x] **T10: Critic loop** (AC: 17–20)
  - [x] Determinism: `make shots ROUND=100` and `ROUND=101`, opened side by side, match by eye; then delete both folders.
  - [x] Rounds 1 to 3 at most: `make shots ROUND=1`, look at every shot, write the three biggest problems, fix, repeat. Record each round's problems in the Debug Log.
  - [x] Confirm the Expected differences list still holds (don't fix them).
  - [x] Show the developer round 1 and the last round side by side (send the files), and get his sign-off.
- [x] **T11: Close**: Dev Agent Record, File List, Change Log; status `review`.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). Four findings dismissed:
- the token rule must be one top-level `.ui-overlay` rule, which the story 0.3 drift test already enforces;
- the mipmap ×4/3 for non-mipmap filters, wrong for three r187, which mipmaps whenever `generateMipmaps` is true;
- the overlay test's pinned 101 and 67 px, whose failure on a margin change is the intended signal for 0.10 and 0.14;
- `parentPath`'s Node version, since Node 26 is pinned.

- [x] [Review][Decision] Look-dev code names typography tokens. `sampleText()` hard-codes `display-xl`/`display-lg`, and `isNumericToken()` the `numeric-` prefix, against D9 ("no list of names in look-dev code"). Options: (a) keep the names and state the exception in D9 and the file header; (b) choose the sample by computed font size and treat a token as numeric only by a data source. **Resolved 2026-11-14: (a)**, with the exception written in the file header.
- [x] [Review][Decision] Raw colours inside `.ui-overlay`. The swatch chip's light/dark backing (`#ffffff`/`#000000`) and the error line (`#ff8a80`) sit inside the overlay root, against AC8 and D12. Options: (a) accept them as judging aids and amend D12; (b) build the backing from token colours (`warning` and `hud-outline`) and move the error line outside the root. **Resolved 2026-11-14: (b).**
- [x] [Review][Decision] `--tile` is computed from the window, but in look-dev the overlay sits below a 32 px bar. The overlay is 32 px shorter than the tile math assumes, so content sized to the full height can clip, and shots don't show the game's proportions. Options: (a) make the bar float over the page (the overlay gets the full window and the bar covers its top 32 px); (b) document look-dev as approximate; (c) let `createOverlay` take a size source. **Resolved 2026-11-14: (a).** During the fix, a spot (the harness) was also given no bar (see the Debug Log).
- [x] [Review][Decision] The `dist/` leak check greps for "lookdev", which minification can hide: game code importing `render/lookdevScenes.ts` would leave no such string. A static guard is stronger: ESLint banning imports of `lookdev/` and `lookdevScenes.ts` from every layer but `lookdev/`. The story said to ask before changing `eslint.config.js`. Options: (a) add the ESLint ban and keep the grep; (b) keep the grep only. **Resolved 2026-11-14: (a).**
- [x] [Review][Patch] A broken view, spot, mount or first frame never sets a ready state, so the harness waits about 30 s, the error is lost, and no WebGL gives no plain message (T3). Wrap mount and frame in try/catch, set `data-lookdev-ready="error"`, and have the specs wait for true or error; check that every spot's `view` exists; let an empty `?view=` fall back to the first view [src/lookdev/main.ts:46]
- [x] [Review][Patch] A failed shots run leaves a partial round and burns the number. Capture into `shots/round-<n>.partial/` and rename on success [Makefile:71]
- [x] [Review][Patch] The swatch check compares the page with itself. Compare each shown value with DESIGN.md's value (case-insensitive) [tests/e2e/lookdev/lookdev.spec.ts:89]
- [x] [Review][Patch] The page-level no-scroll check can never fail (`html, body { overflow: hidden }`). Check the overlay root only, and say so [tests/e2e/lookdev/lookdev.spec.ts:110]
- [x] [Review][Patch] The pixel-ratio cap is never exercised end to end (DPR 1). Add a check at device scale factor 2 that expects 1.50 [tests/e2e/lookdev/lookdev.spec.ts:118]
- [x] [Review][Patch] The ready flag can be set before a web font starts loading. After the first frame, wait one frame for layout, then for `document.fonts.ready`, then one more frame [src/lookdev/main.ts:35]
- [x] [Review][Patch] The view `mount` lost T5's `options` argument. Pass `{ spot }`, so story 0.10's camera preset has a place [src/lookdev/assetBrowser.ts:17]
- [x] [Review][Patch] The pixel ratio goes stale when devicePixelRatio changes without a resize. Re-fit on a `matchMedia` resolution change, re-armed after each change [src/render/renderer.ts:139]
- [x] [Review][Patch] The texture estimate counts clones that share a source as separate textures. Dedupe on `texture.source.uuid` [src/render/renderer.ts:103]
- [x] [Review][Patch] The texture estimate misses textures in uniform arrays and `scene.overrideMaterial`, and throws on an undefined uniform [src/render/renderer.ts:85]
- [x] [Review][Patch] The texture estimate ignores `depth` (3D and array textures) and video sizes (`videoWidth`/`videoHeight`) [src/render/renderer.ts:63]
- [x] [Review][Patch] `dispose()` leaks GPU resources: the scene's `dispose()` only detaches its children, and the renderer keeps its context. Dispose the scene's geometries, materials and textures, and call `forceContextLoss()` [src/render/lookdevScenes.ts:44]
- [x] [Review][Patch] An inherited `E2E_TARGET=dev` breaks `make smoke`. The smoke recipe sets `E2E_TARGET=preview`, and the config rejects unknown values [Makefile:61]
- [x] [Review][Patch] An exported empty `SHOTS_PORT`/`PREVIEW_PORT` makes the URL invalid. Use `||` in the config [playwright.config.ts:15]
- [x] [Review][Patch] `ROUND=01` and `ROUND=1` make two folders for the same round. Reject leading zeros [Makefile:70]

## Dev Notes

### Current state of the files this story touches

| File | Today | This story | Keep |
| --- | --- | --- | --- |
| `src/sim/config.ts` | `export const CONFIG = {} as const;` with a comment that says `CONFIG.view` arrives in 0.6 | Adds `view` | `as const`; nothing frozen at runtime (AR58, 0.1 review) |
| `playwright.config.ts` | One `webServer` (`make preview`), projects chromium and firefox, `testDir: 'tests/e2e'`, port from `PREVIEW_PORT` | Target switch (D1) | Preview target unchanged: same server, both browsers, `reuseExistingServer: false`, port from env (0.1 review) |
| `Makefile` | No `shots`; `dev` runs bare `vite`; header lists `shots` as a later target; `PREVIEW_PORT` exported | `DEV_PORT`, `SHOTS_PORT`, `shots` | Every recipe through `$(MISE)` and `$(BIN)/…`; `-eu -o pipefail`; the help format; `smoke: build` |
| `tests/e2e/smoke.spec.ts` | One test: boots with no console error, no page error, no failed request, no SPA-fallback HTML | Uses the helper; adds the `dist/` check | Every existing assertion, including the SPA-fallback rule (Vite's dev server has the same fallback) |
| `README.md` | Start steps, prerequisites, version policy | Look-dev and `make shots` | Everything else |
| `eslint.config.js` | `lookdev/` entry already: `banThree`, bans `sim app audio platform input debug` | **No change expected.** If a new file needs a rule change, stop and ask | All of it |
| `src/ui/styles/base.css` | DESIGN.md's provisional tokens on `.ui-overlay` | **Not edited** (AC19) | All of it; the drift test guards it |
| `vite.config.ts` | `base: './'`, Vitest in Node with explicit `include` | **No change expected**: Vite 8 builds only `index.html` unless `build.rolldownOptions.input` says otherwise (checked in `node_modules/vite/dist/node/index.d.ts`), and the dev server serves any `.html` at the root | All of it |

### Decisions (the developer can veto any at review)

- **D1 — One Playwright config with a target switch.** `E2E_TARGET=dev` selects the dev server (`make dev DEV_PORT=$SHOTS_PORT`, URL `http://localhost:$SHOTS_PORT`), Chromium only, and `testIgnore: ['smoke.spec.ts']`. Anything else selects today's preview target and adds `testIgnore: ['lookdev/**', 'shots.spec.ts']`, so a bare `playwright test` never runs the dev specs against the build. A second config file was rejected: the architecture lists one `playwright.config.ts`, and Epic 1's `tests/e2e/dev/` (run by `make smoke` against the dev server) fits the same switch.
- **D2 — Ports.** `DEV_PORT ?= 5173`, exported; `make dev` runs `vite --port $(DEV_PORT) --strictPort`, so a busy port fails loudly instead of drifting. `SHOTS_PORT ?= 5174`, exported; the harness always starts its own dev server there with `reuseExistingServer: false`, so a `make dev` the developer has open (or another project's server) is never captured.
- **D3 — Spots, the URL and the ready flag.** `?view=<id>` opens a view; `?spot=<id>` opens the spot's view and freezes time at its `animTimeSeconds`. `<html>` carries `data-lookdev-ready="false"` while a view mounts and `"true"` once the view has rendered a frame **and** `document.fonts.ready` has resolved **and** one more `requestAnimationFrame` has passed. The flag is reset on every view change. A data attribute avoids a `window` global before Epic 1's `window.__emberbound`.
- **D4 — 3D look-dev content lives in `src/render/lookdevScenes.ts`.** `lookdev/` may not import three.js (ESLint, story 0.1), so anything that builds a `Scene` or a camera for the page belongs to `render/`. Look-dev code holds the returned objects and passes them to `renderer.render()` without naming three.js types. One new file in an existing folder, no new folder; flagged under AR248 (closest pattern).
- **D5 — Look-dev files stay flat in `src/lookdev/`**: `main.ts`, `assetBrowser.ts`, `rendererView.ts`, `overlayView.ts`, `spots.ts`, `lookdev.css`. No subfolder (CLAUDE.md: ask before a folder-structure change).
- **D6 — `CONFIG.view` shape.** `{ width: 19, height: 10.4, margin: 0 }`, all in tiles, `margin` per side around the logical view. `--tile = min(innerWidth / (width + 2·margin), innerHeight / (height + 2·margin))`. With margin 0 it is DESIGN.md's `min(100vw / 19, 100vh / 10.4)`; `innerWidth`/`innerHeight` match `100vw`/`100vh` (both include a scrollbar). Story 0.10 may add the field of view here and set the margin. Story 1.11's "viewWidth, viewHeight" read as these fields.
- **D7 — Pixel-ratio cap** as `MAX_PIXEL_RATIO` in `render/renderer.ts`. Story 0.12 builds "one table in `render/`" for the render budgets and may move it there. `cappedPixelRatio` returns 1 for a non-finite or non-positive input.
- **D8 — Texture-memory estimate.** For each unique texture (by `uuid`) reachable from the scene (`scene.background`, `scene.environment`, and every `Texture`-valued property of every object's material or materials): `width × height × 4` bytes from `texture.image`, × 4/3 when `generateMipmaps` is true. Textures without a sized image count 0. Shown in MB of 1,000,000 bytes (story 0.2's unit). It ignores compression, formats and render targets; the label says "estimate".
- **D9 — Swatches and type samples are enumerated at runtime** from the `CSSStyleRule` whose selector is `.ui-overlay` in `base.css` (iterate `document.styleSheets`, then the rule's `style` items): `--colors-*` become swatches in declaration order; `--typography-<token>-<attribute>` group into one sample per token (attributes `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`). No list of names in look-dev code; the e2e check compares the page with DESIGN.md through `scripts/designTokens.ts`. Values are read with `getComputedStyle(root).getPropertyValue()` and trimmed.
- **D10 — `make shots` guards.** `ROUND` must match `^[0-9]+$`; `shots/round-$(ROUND)` must not exist (keeps a round's "before" shots from being overwritten). Both fail with exit 2 and a usage line, before Playwright starts.
- **D11 — The `dist/` look-dev check is permanent**, in `smoke.spec.ts` (runs after `make build`, in Node through `node:fs`), not a throwaway. Run it once, not per browser: guard with `test.skip(testInfo.project.name !== 'chromium')` or put it in its own `describe` with that guard.
- **D12 — Page chrome CSS** (`src/lookdev/lookdev.css`: navigation, statistics panel, labels, layout) is development tooling, not the overlay, so it may use raw neutral values. Everything inside `.ui-overlay` uses token properties only. The chrome must be visually quiet and clearly separate from the overlay root (for example a thin bar at the top, the overlay root filling the rest).
- **D13 — Renderer settings.** `antialias: true` † (stories 0.11 and 0.12 revisit it with the outline pass and the budgets); three's default colour management and sRGB output, so palette hex values come out as written on flat materials; `toneMapping` left at `NoToneMapping` (style guide: no grading pass).
- **D14 — Shared page-error helper** `tests/e2e/pageErrors.ts`: `collectPageErrors(page)` returns the arrays smoke builds today (console errors, page errors, failed requests including status ≥ 400 and HTML answers to non-document requests). Not matched by Playwright's default `testMatch`, so it is not a test file.

### Module shapes (sketches, not final code)

```typescript
// src/sim/config.ts
export const CONFIG = {
  view: {
    width: 19, // tiles: the logical view (GDD; AR77)
    height: 10.4, // tiles
    margin: 0, // tiles per side around the logical view; † until story 0.10 locks the framing (X-B35)
  },
} as const;

// src/ui/overlay.ts (may import values from sim/config.ts)
export interface ViewSize { readonly width: number; readonly height: number; readonly margin: number }
export function computeTilePx(viewportWidth: number, viewportHeight: number, view: ViewSize): number;
export function createOverlay(host: HTMLElement): { readonly root: HTMLDivElement; dispose(): void };

// src/render/renderer.ts
export const MAX_PIXEL_RATIO = 1.5; // † starting budget (architecture, Performance Budget)
export interface RendererStats {
  readonly drawCalls: number;         // info.render.calls
  readonly triangles: number;         // info.render.triangles
  readonly geometries: number;        // info.memory.geometries
  readonly textures: number;          // info.memory.textures
  readonly programs: number;          // info.programs?.length ?? 0
  readonly textureBytesEstimate: number; // D8
  readonly pixelRatio: number;        // renderer.getPixelRatio()
}

// src/lookdev/spots.ts (pure data: the Playwright spec imports it in Node)
export interface LookdevSpot {
  readonly id: string;               // kebab-case, used as the file name
  readonly view: string;             // a LOOKDEV_VIEWS id
  readonly width: number;            // px
  readonly height: number;           // px
  readonly animTimeSeconds: number;  // frozen animation time
}
export const LOOKDEV_SPOTS: readonly LookdevSpot[] = [
  { id: 'lookdev-overlay-1080', view: 'overlay', width: 1920, height: 1080, animTimeSeconds: 0 },
  { id: 'lookdev-overlay-720', view: 'overlay', width: 1280, height: 720, animTimeSeconds: 0 },
  { id: 'lookdev-renderer-1080', view: 'renderer', width: 1920, height: 1080, animTimeSeconds: 0 },
];
```

- `info.render` is reset by every `render()` call (`autoReset` is true), so read the statistics right after the frame's one render call. Rendering the empty scene still costs 0 draw calls; that is the expected reading.
- The camera of each spot is the view's fixed default for now; when a view gains camera presets (0.10), the spot gains a `camera` field.
- Frame loop: `renderer.setAnimationLoop` (or one `requestAnimationFrame` loop in `main.ts`), passing `timeSeconds` to the view's `update`; with `?spot=` it passes the spot's `animTimeSeconds` every frame.
- Logging: `core/log.ts` only, on `render` (renderer, 3D view) and `ui` (overlay, overlay view). The channel union is fixed; don't add a `lookdev` channel.

### Makefile and config sketches

```make
# Exported so playwright.config.ts starts and reaches the same ports.
DEV_PORT ?= 5173
SHOTS_PORT ?= 5174
export DEV_PORT SHOTS_PORT

dev: ## Start the Vite dev server (the game, and the look-dev page at /lookdev.html)
	$(MISE) $(BIN)/vite --port $(DEV_PORT) --strictPort

shots: ## Look-dev checks, then the critic-loop screenshots: make shots ROUND=n
	@[[ "$(ROUND)" =~ ^[0-9]+$$ ]] || { echo "usage: make shots ROUND=n (a whole number)" >&2; exit 2; }
	@[[ ! -e "shots/round-$(ROUND)" ]] || { echo "shots/round-$(ROUND) exists: use a new round number" >&2; exit 2; }
	E2E_TARGET=dev $(MISE) $(BIN)/playwright test tests/e2e/lookdev/
	E2E_TARGET=dev ROUND=$(ROUND) $(MISE) $(BIN)/playwright test tests/e2e/shots.spec.ts
```

`ROUND` read from the command line only, like `COLORS` in `make contrast` (0.3 review: an exported shell variable must not leak in): use `$(if $(filter command line,$(origin ROUND)),$(ROUND))`. Two Playwright runs start the dev server twice; that costs a few seconds and keeps "checks fail, no shots" obvious.

`playwright.config.ts`: build `webServer`, `use.baseURL`, `projects` and `testIgnore` from `const isDevTarget = process.env.E2E_TARGET === 'dev'`. Dev `webServer.command`: `make dev DEV_PORT=${shotsPort}`, `url` `http://localhost:${shotsPort}/lookdev.html`, `reuseExistingServer: false`, `timeout: 60_000`.

`shots.spec.ts`: require `process.env.ROUND` (throw a clear error if missing); for each spot: `page.setViewportSize`, `goto('/lookdev.html?spot=<id>')`, wait for `html[data-lookdev-ready="true"]`, assert no page errors (helper), `page.screenshot({ path: 'shots/round-<n>/<id>.png' })` (viewport only, not `fullPage`).

### Tests

**Vitest, Node** (`make test`):

`src/ui/overlay.test.ts`
1. `computeTilePx(1920, 1080, CONFIG.view)` is about 101 (DESIGN.md) and equals `min(1920 / 19, 1080 / 10.4)` computed from `CONFIG.view`'s fields, not retyped numbers.
2. `computeTilePx(1280, 720, CONFIG.view)` is about 67.
3. 4:3 (`1440 × 1080`) is width-limited; 21:9 (`2560 × 1080`) is height-limited.
4. A margin of 1 divides by `width + 2` and `height + 2`.

`src/render/renderer.test.ts` (three.js core runs in Node; no `WebGLRenderer` is created)
5. `cappedPixelRatio`: 2 → `MAX_PIXEL_RATIO`; 1 → 1; 1.25 → 1.25; `NaN`, 0 and −1 → 1.
6. `estimateTextureBytes`: one 256 × 256 texture with mipmaps on one mesh → `256·256·4·4/3`; the same texture on two meshes counts once; `generateMipmaps = false` drops the 4/3; a material array is walked; `scene.background` texture counts; a texture with no image counts 0; an empty scene is 0.

**Playwright, Chromium, dev server** (`make shots` runs it first): `tests/e2e/lookdev/lookdev.spec.ts`
7. `/lookdev.html` loads with no console error, page error or failed request (helper); the navigation lists the views (`[data-lookdev-view]`).
8. Every listed view, opened by `?view=`, reaches `data-lookdev-ready="true"` with no error, and every view id has at least one spot in `LOOKDEV_SPOTS` (import it), so no view escapes the critic loop.
9. At 1920 × 1080 and at 1280 × 720, `--tile` on `.ui-overlay` equals `computeTilePx(w, h, CONFIG.view)` (import both) within 0.5 px; resizing the viewport from one to the other without a reload updates it.
10. The overlay view shows exactly the 16 colour roles of DESIGN.md's frontmatter (read with `readFrontmatter` and `readTokenGroups` from `scripts/designTokens.ts`) and the 8 typography tokens, each swatch's label equal to the role's computed `--colors-*` value.
11. At both spot sizes, the overlay view doesn't scroll (`scrollHeight <= clientHeight` on the document element) (AC9).
12. The renderer view's statistics panel shows the 7 rows, the texture row labelled as an estimate, and a pixel ratio ≤ `MAX_PIXEL_RATIO`.

**Playwright, Chromium and Firefox, production build** (`make smoke`): the existing boot test, unchanged in what it asserts, plus the `dist/` check (AC3, D11).

Playwright loads these TypeScript imports itself (`../../src/lookdev/spots.ts`, `../../src/ui/overlay.ts`, `../../src/sim/config.ts`, `../../scripts/designTokens.ts`), with `.ts` extensions in an ESM package. **Unverified:** that Playwright 1.65's loader accepts `.ts`-extension imports here; check on the first run, and if it fails, stop and report rather than restructure.

### Throwaway checks (create, run, record the output, delete)

| # | Change | Run | Expected |
| --- | --- | --- | --- |
| L1 | `src/lookdev/zz.ts` imports `three` | `make lint` | fails: three.js only in `render/` |
| L2 | `src/lookdev/zz.ts` imports `../sim/config.ts` | `make lint` | fails: `lookdev/` may not import `sim/` |
| L3 | `src/lookdev/zz.ts` imports `../ui/overlay.ts` and `../render/renderer.ts` | `make lint` | passes |
| L4 | `src/ui/zz.ts` imports `../render/renderer.ts` | `make lint` | fails: `ui/` may not import `render/` |
| L5 | In `lookdev.spec.ts`, temporarily expect 17 colour roles | `make shots ROUND=900` | the check fails, `make` stops, `shots/round-900/` doesn't exist |
| L6 | `make shots` (no ROUND), `make shots ROUND=x`, then `make shots ROUND=1` twice | — | usage error twice; the second `ROUND=1` refuses because the folder exists (run L6 before T10, then delete `shots/round-1/`) |
| L7 | `export ROUND=5; make shots` | — | usage error: an inherited `ROUND` is ignored |
| L8 | Temporarily import `./lookdev/main.ts` from `src/main.ts` | `make smoke` | the `dist/` check fails; revert and it passes |

### Expected differences for story 0.14 (AC19: list, don't fix)

`base.css` holds DESIGN.md's provisional values; `docs/STYLE_GUIDE.md` §9 holds the approved ones. 15 of 16 colour roles differ; `warning` matches.

| Role | `base.css` now | Style guide |
| --- | --- | --- |
| `surface-screen` | `#0e0f11` | `#0B1012` |
| `surface-scrim` | `#0e0f11bf` | `#0B1012BF` |
| `surface-panel` | `#18191c` | `#141C1F` |
| `surface-focus` | `#2b2e33` | `#25323A` |
| `border-subtle` | `#3a3d43` | `#35454D` |
| `text-primary` | `#ececec` | `#E6EEF0` |
| `text-muted` | `#a3a6ab` | `#9FB0B6` |
| `focus-ring` | `#aebbc9` | `#9CCBD2` |
| `hud-outline` | `#0e0f11` | `#0B1012` |
| `hud-track` | `#232529` | `#1E282C` |
| `heart-fill` | `#e6e6e6` | `#E4ECEE` |
| `heart-empty` | `#8e9196` | `#84959B` |
| `ember` | `#e8902e` | `#F59A3C` |
| `weapon-timer` | `#c8ced6` | `#C2D3DA` |
| `warden-bar` | `#a9b3bd` | `#A3B6C0` |
| `warning` | `#ffffff` | `#FFFFFF` (same) |

Typefaces: every token is `system-ui, sans-serif`; the guide names Alegreya (display) and Source Sans 3 (UI and numeric). Story 0.8 ships the files; 0.14 puts them in DESIGN.md. Confirm in the critic loop that the page shows exactly these differences and nothing else; anything else is a real problem.

### What the critic loop judges here

There is no art yet, so the loop judges the look-dev page as a judging tool: are the swatches true to the token values, are labels and type samples legible at 1280 × 720 (the itch.io embed, `--tile` about 67 px), are the pixel floors visible in the labels, does the overlay view fit without scrolling, is the chrome quiet and separate from the overlay root, and does the renderer view show its statistics plainly. "Hero, enemies, hazards and pickups stand out" (PR14) has nothing to check yet; say so in each round's notes.

### Previous story intelligence

- **0.1 review:** ports come from the environment, never hard-coded twice; the smoke check must catch failed requests, status ≥ 400 and SPA-fallback HTML (Vite's dev server falls back the same way, so the helper keeps that rule for the dev specs); `make build` lints first; Node globals and built-ins are banned in browser layers (`lookdev/` included, so `spots.ts` stays pure data).
- **0.2:** MB means 1,000,000 bytes; the budget check fails any shipped file that fits no group, so a stray `lookdev.html` in `dist/` would also fail `make build` there, but AC3's check names it directly.
- **0.3:** tokens are declared on `.ui-overlay`, not `:root`, because `var(--tile)` resolves where it is declared; any element that reads the tokens must be inside the overlay root. Make variables that change behaviour come from the command line only (`COLORS`). Subprocess tests use absolute paths and `cwd`.
- **0.5:** the style guide is approved; DESIGN.md and `base.css` change only in 0.14. Look at every image before describing it.
- **Git:** recent commits are one per story, titled `<what>: story 0.N, reviewed and done`, straight on master.

### Project structure notes

- New: `lookdev.html`; `src/lookdev/{main,assetBrowser,rendererView,overlayView,spots}.ts`, `src/lookdev/lookdev.css`; `src/render/renderer.ts`, `src/render/lookdevScenes.ts` (D4), `src/render/renderer.test.ts`; `src/ui/overlay.ts`, `src/ui/overlay.test.ts`; `tests/e2e/pageErrors.ts`, `tests/e2e/shots.spec.ts`, `tests/e2e/lookdev/lookdev.spec.ts`.
- Changed: `src/sim/config.ts`, `playwright.config.ts`, `Makefile`, `tests/e2e/smoke.spec.ts`, `README.md`.
- No new dependency: three.js, Vite and Playwright are already pinned. No new folder except `tests/e2e/lookdev/` and `src/lookdev/`, `src/render/`, `src/ui/` files the architecture already names.
- `shots/` is already git-ignored and ESLint-ignored; `make clean` keeps it.

### Project context rules

- `_bmad-output/project-context.md` doesn't exist yet (follow-up F3); CLAUDE.md and the architecture's Consistency Rules apply.
- TypeScript strict; relative imports carry `.ts`; `import type` for types; no enums, namespaces or parameter properties; booleans `is…`/`has…`/`can…`; `…Seconds`/`…Ms` outside `sim/`; every `switch` on a union ends in `assertNever` (create `core/assertNever.ts` if a switch needs it).
- Rendering reads, never writes, simulation state; only `render/` imports three.js; GLSL and `ShaderMaterial` only in `render/materials/` (none in this story).
- Run commands through `make`, never raw `npx`/`vite`/`playwright`.
- Look at every screenshot before describing it; never claim a render you didn't see.
- Ask before adding a dependency, changing the folder structure, or changing a tuned gameplay number.

### References

- Epic and story: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md`, Epic 0, Story 0.6 (and 0.7–0.15 for the views that follow).
- Requirements: `requirements-inventory.md`: PR14, PR23, AR170, AR177–AR178, AR183, AR219, AR221–AR222, AR228, UX-DR9, UX-DR16, X-B35.
- Architecture `game-architecture.md`: Rendering Structure (look-dev page), User Interface (`--tile`), Testing Strategy (screenshot and look-dev rows), Performance Budget, Debug Tools (activation), Directory and Source Structure, Architectural Boundaries (`lookdev/` row), Deterministic Screenshot Spots, Consistency Rules.
- UX: `ux-designs/ux-emberbound-2026-11-13/DESIGN.md` (frontmatter tokens; Layout & Spacing › the tile unit; Do's and Don'ts: judge the overlay on the look-dev page); `EXPERIENCE.md` (Resize; itch.io embed at 1280 × 720).
- `docs/STYLE_GUIDE.md` §9 (overlay colours, typefaces), §2 (no grading, perspective camera).
- three.js r187: `node_modules/three/src/renderers/webgl/WebGLInfo.js` and `@types/three/src/renderers/webgl/WebGLInfo.d.ts` (`render.calls/triangles`, `memory.geometries/textures`, `programs`; no byte counts).
- Vite 8.3.8: `build.rolldownOptions` replaces `rollupOptions` (`node_modules/vite/dist/node/index.d.ts`); not needed here.
- Playwright 1.65.0: `webServer` accepts one server or an array (`node_modules/playwright/types/test.d.ts`); headless Chromium 158 gives WebGL2 through SwiftShader with no extra flags (probed 2026-11-14); with `GPU=nvidia` it runs on the GTX 1650 (sprint change proposal 2026-11-14, GPU).

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code.

### Debug Log References

- **T0:** story 0.5 was committed by the developer (`766e01c`) before work started; `baseline_commit` is set to it.
- **Red, then green:** `src/ui/overlay.test.ts` failed first (no `overlay.ts`), then passed after T1–T2 (164 → 168 tests). `src/render/renderer.test.ts` failed first (no `renderer.ts`), then passed after T3 (178 tests).
- **Lint fixes on the way:**
  - `instanceof Texture` narrows to `Texture<any, any>`, which `no-unsafe-argument` rejects. An `isTexture()` type guard keeps the default type parameters.
  - `LOOKDEV_VIEWS[0]?.id` was flagged as an unnecessary condition (no `noUncheckedIndexedAccess`), so it became `.at(0)?.id`.
  - `dispose: overlay.dispose` was flagged by `unbound-method`, so it is wrapped in a method.
- **Unverified item from the story, now checked:** Playwright 1.65 loads the specs' `.ts`-extension imports (`src/lookdev/spots.ts`, `src/ui/overlay.ts`, `src/sim/config.ts`, `src/render/renderer.ts`, `scripts/designTokens.ts`) with no change. That is the first `make shots` run.
- **First run** (`make shots ROUND=0`, a scratch round, deleted after): 7 look-dev checks and 3 shots passed. The shots were looked at: 16 swatches with their `base.css` values, the scrim's alpha visible over the light and dark backing, 8 type samples with computed sizes, and the stats panel on the empty scene (0 draw calls, pixel ratio 1.00).
- **Throwaway checks** (each file created, run, removed; `git status` clean of them afterwards):
  - L1 `src/lookdev/zz.ts` imports `three`: `make lint` fails, "lookdev/: three.js is imported only in render/".
  - L2 imports `../sim/config.ts`: fails, "lookdev/: may not import sim/".
  - L3 imports `../ui/overlay.ts` and `../render/renderer.ts`: `make lint` exit 0.
  - L4 `src/ui/zz.ts` imports `../render/renderer.ts`: fails, "ui/: may not import render/".
  - L5 the spec expects a 17th colour role: `make shots ROUND=900` reports 1 failed and 6 passed, then `make: *** [Makefile:72: shots] Error 1`. `shots/round-900` doesn't exist. The spec was restored from a scratchpad copy.
  - L6 `make shots` with no ROUND, and with `ROUND=x`: "usage: make shots ROUND=n (n a whole number)", exit 2. `ROUND=1` ran (7 + 3 passed). `ROUND=1` again: "shots/round-1 exists: use a new round number", exit 2. `shots/round-1` was then deleted.
  - L7 `export ROUND=5; make shots`: usage error, exit 2 (an inherited ROUND is ignored).
  - L8 `import './lookdev/main.ts'` appended to `src/main.ts`: `make smoke` fails the `dist/` check, listing `assets/index-C29hc7AU.css` and `assets/index-C93d2QMT.js`. Reverted from a scratchpad copy; `make smoke` passes again.
- **T9, final runs:**
  - `make check`: exit 0. Lint, Prettier, both type checks, and Vitest with 6 files and 178 tests (164 before, plus 4 overlay and 10 renderer tests).
  - `make build` (through `make smoke`): budgets OK, code gzipped 878 bytes, 2 files in `dist/` (`index.html`, one JS bundle). There is no look-dev file in `dist/`.
  - `make smoke`: 3 passed and 1 skipped (the `dist/` check runs in Chromium only, by design, D11).
  - `make shots ROUND=2`: 7 look-dev checks and 3 shots passed.
- **T10, determinism:** `ROUND=100` and `ROUND=101`, each spot side by side at half size, opened and looked at: they match by eye. Both folders were deleted. No pixel diff was taken.
- **T10, critic round 1** (`shots/round-1/`; all three shots opened). Swatch values match `base.css`, the labels are legible at the 13 px floor at 1280 × 720, and nothing scrolls. The three biggest problems with the page as a judging tool:
  1. The type labels didn't name the font family each token asks for, so the page couldn't show that every token is still `system-ui`, or which face is in use after 0.8 and 0.14. **Fix:** the label adds the computed `font-family`.
  2. The numeric samples couldn't show tabular figures: one line, with the spaces collapsed by HTML. **Fix:** two lines (`0:00.0   12 / 30` over `1:11.1   19 / 30`) with `white-space: pre`, so the digits stack in columns.
  3. The renderer shot was a black field with no sign of which scene it held. **Fix:** `LookdevScene` gains a `label`, and the stats panel starts with "Scene: Empty scene (later stories add to it)".
- **T10, critic round 2** (`shots/round-2/`; all three shots opened). All three problems are fixed: the labels read `… · system-ui, sans-serif`, the numeric digits line up in columns, and the panel names the scene. No problem was found worth a third round. One watch item, owned by story 0.8: the `display-xl` sample ends close to the column's right edge (about 40 px at 720). With a wider face it would wrap, not overflow (the no-scroll check guards the height). 0.8 judges it with Alegreya.
- **Expected differences** (AC19): the page shows `base.css`'s provisional values, which differ from the style guide in 15 of 16 colours (`warning` matches), and `system-ui, sans-serif` for every typography token, exactly as the story's table lists. Nothing else differs. Neither `base.css` nor DESIGN.md was edited. The list is for story 0.14.
- **Sign-off:** before and after sheets (round 1 against round 2, for each spot) were looked at, then sent to the developer: `0-6-before-after-lookdev-overlay-720.png`, `…-overlay-1080.png` and `…-renderer-1080.png`, in the scratchpad, not committed. He signed off on the page as a judging tool (AskUserQuestion, 2026-11-14).

- **Code review fixes (2026-11-14),** after the developer resolved the 4 decisions (all as recommended) and chose to apply every patch:
  - Renderer estimate: written test-first, 5 new tests (red, then green; 178 → 183). They cover clones sharing one source, uniform arrays with null and undefined entries, `overrideMaterial`, `depth`, and video sizes. `ShaderMaterial` is banned outside `render/materials/`, so the uniforms test uses a material carrying a `uniforms` map.
  - ESLint bans: a throwaway `src/main.ts` importing `./lookdev/main.ts` and `./render/lookdevScenes.ts` gets 2 errors ("main.ts: may not import lookdev/", "render/lookdevScenes.ts is for the look-dev page only"). A throwaway `src/render/zz.ts` importing `./lookdevScenes.ts` gets 1 error. Both files were removed.
  - Partial rounds: a throwaway failure on spot 2 makes `make shots ROUND=901` stop at `Makefile:76`, leaving only `shots/round-901.partial`. After restoring the spec, `ROUND=901` runs again and is renamed to `round-901`. Deleted afterwards.
  - Misspelled spot view: a throwaway `view: 'renderr'` makes the look-dev check fail in 6 s with "spots whose view does not exist", before any shot. Restored.
  - **A regression found and fixed in the process.** Round 3 (`shots/round-3/`, the floating bar) showed a 32 px strip of page background along the bottom of the renderer shot. Probes found the canvas, its drawing buffer and the GL viewport all at 1920 × 1080, and the canvas under the point. Removing the bar, or its `z-index`, cleared the strip; moving the bar after `<main>`, or making it `position: absolute`, did not. Any full-width bar drawn over the canvas leaves the canvas's bottom rows unpainted in headless Chromium's shot (SwiftShader). **Fix:** a spot (`?spot=`, used only by the harness) shows no bar, so a shot is the game's full window and nothing else; interactive use keeps the floating bar. Round 4 (`shots/round-4/`) was looked at: the renderer is black to the bottom edge, and the overlay content sits at the safe margin.   - **GPU browser check** (the developer's request, 2026-11-14). The same condition (`?view=renderer`, bar over canvas, 1920 × 1080) was opened in headed Playwright Chromium and headed system Chromium (`/usr/bin/chromium`), both reporting "ANGLE (Intel, Mesa Intel(R) UHD Graphics 630 (CFL GT2), OpenGL ES 3.2)". It was also opened in headed Playwright Firefox, which reports Firefox's masked "Intel(R) HD Graphics 400, or similar". All three paint black to the bottom edge (pixel (960, 1070) is `#000000`), and the system Chromium shot was looked at. Headless Chromium on SwiftShader, in the same run, still shows the strip (`#1c1c1e`). So the artifact belongs to headless software compositing only; the page and the game are unaffected in a real browser. The spot-mode fix stays, because the harness runs headless. **For story 1.11:** its full-screen pause scrim sits over the canvas, so check its headless shots for the same strip; a real browser is fine.
  - Final runs: `make check` exit 0 (183 tests); `make smoke` 3 passed, 1 skipped (budgets OK, 878 bytes of code); `make shots ROUND=4`: 10 look-dev checks and 3 shots passed.

- **The GTX 1650 rule** (the developer's request, 2026-11-14, after review). Every browser test now runs WebGL on the NVIDIA GTX 1650.
  - **Probe:**
    - Headless Chromium reaches the card with the PRIME offload variables plus `--use-angle=gl --ignore-gpu-blocklist` ("ANGLE (NVIDIA Corporation, NVIDIA GeForce GTX 1650/PCIe/SSE2, OpenGL ES 3.2)").
    - Headed Chromium also needs `--ozone-platform=x11`; on Wayland it stays on the Intel GPU.
    - Setting `__EGL_VENDOR_LIBRARY_FILENAMES` to NVIDIA breaks headed WebGL.
    - Firefox, headed and headless, reports its masked NVIDIA class with the variables alone.
  - **Built:**
    - The Makefile exports `GPU ?= nvidia`.
    - `playwright.config.ts` applies the offload and the Chromium flags when `GPU=nvidia`, and rejects any value but `nvidia` or `default`.
    - `GameRenderer.gpuName()` returns the GPU, and the renderer view's stats panel shows it as `GPU: …`.
    - A look-dev check fails unless it names the GTX 1650; it skips with `GPU=default`.
    - The README documents the rule and the development command for Chromium, which is this machine's browser, not Chrome.
  - **Proof:**
    - `make shots ROUND=5`: 11 look-dev checks and 3 shots pass on the GTX 1650.
    - A throwaway with the offload switched off fails the check ("Received: GPU: ANGLE (Google, Vulkan 1.3.0 (SwiftShader …))"). Restored.
    - `GPU=default`: the check is skipped and the other 10 pass.
    - `make smoke`: 3 passed and 1 skipped, with Firefox on the offload.
    - `make check`: 183 tests.
  - **For a planning update (not edited here):** two statements are now untrue on this machine, since headless shots render on the GPU. They are the architecture's Testing Strategy row and risk table ("Headless WebGL in Playwright renders in software"), and this story's AC17 reason. The rule they protect still holds: shots are never pixel-diffed and never used for performance numbers. If the developer wants the documents changed, that goes through `gds-correct-course`.

### Completion Notes List

- **The page (AC1–AC3):** `lookdev.html` is served by `make dev` at `/lookdev.html`. `assetBrowser.ts` holds `LOOKDEV_VIEWS` (overlay, renderer) and builds the navigation from them. `?view=` and `?spot=` work, and an unknown spot or view shows an error line and logs it. `dist/` has no look-dev file and no look-dev code, and a permanent smoke check guards that. No `vite.config.ts` change was needed.
- **Renderer (AC4–AC6):** `render/renderer.ts` owns the `WebGLRenderer` (antialias on †, no tone mapping, three's default colour management). It fits the canvas with a `ResizeObserver`, re-applies the capped pixel ratio on every fit (`MAX_PIXEL_RATIO` 1.5 †), and reads 7 statistics. Texture memory is labelled as an estimate (D8). The stats panel refreshes every 15 frames, and touches the DOM only when a value changes.
- **Overlay (AC7–AC11):** `ui/overlay.ts` creates `div.ui-overlay` and sets `--tile` from `CONFIG.view` on creation and on every resize. The look-dev check confirms it within 0.5 px at both sizes, and on a live resize. The overlay view reads its swatches and type tokens from base.css's `.ui-overlay` rule at runtime (D9); the check compares them with DESIGN.md through `scripts/designTokens.ts`. The view fits both spot sizes with no scrolling. ESLint's `lookdev/` boundary was already right and is unchanged (L1–L3).
- **Harness (AC12–AC17):** `make shots ROUND=n` runs `tests/e2e/lookdev/` first, then `tests/e2e/shots.spec.ts`, against its own dev server on `SHOTS_PORT` 5174, in Chromium only. The guards behave as specified (L5–L7). The spots live in `src/lookdev/spots.ts`. The ready flag is `<html data-lookdev-ready>`, set after the first frame, then `document.fonts.ready`, then one more `requestAnimationFrame`. Repeated rounds match by eye.
- **Critic loop (AC18–AC20):** two rounds; the problems and fixes are listed above. The developer signed off.
- **Decisions D1–D14 were applied as written.** Three points of execution were not spelled out in the story:
  - Views are switched by navigating (the bar's links reload the page), so `dispose()` exists but nothing calls it yet. A `pagehide` dispose was tried and removed: it would break a page restored from the back-forward cache.
  - The swatch chip's light and dark backing is page chrome (raw `#ffffff` and `#000000` in `lookdev.css`), though it sits inside `.ui-overlay`. It is a judging aid for alpha, not overlay content (a D12 reading).
  - `expectNoPageErrors()` replaced the shared-constant idea in `tests/e2e/pageErrors.ts`, so no mutable "empty" object is exported.
- **For later stories:**
  - 0.8 judges the `display-xl` sample width with Alegreya.
  - 0.9, 0.10 and 0.12 add their 3D builders to `render/lookdevScenes.ts` and their views and spots to `assetBrowser.ts` and `spots.ts`. The look-dev check fails if a view has no spot.
  - 0.10 replaces the placeholder camera and may add the field of view to `CONFIG.view`.
  - 0.11 adds the shadow-map and pass rows to the stats panel.
  - 0.12 may move `MAX_PIXEL_RATIO` into its budget table.
  - 0.14 clears the expected differences.

### File List

- `lookdev.html` (new)
- `src/lookdev/main.ts` (new)
- `src/lookdev/assetBrowser.ts` (new)
- `src/lookdev/rendererView.ts` (new)
- `src/lookdev/overlayView.ts` (new)
- `src/lookdev/spots.ts` (new)
- `src/lookdev/lookdev.css` (new)
- `src/render/renderer.ts` (new)
- `src/render/renderer.test.ts` (new)
- `src/render/lookdevScenes.ts` (new)
- `src/ui/overlay.ts` (new)
- `src/ui/overlay.test.ts` (new)
- `src/sim/config.ts` (modified: `CONFIG.view`)
- `tests/e2e/pageErrors.ts` (new)
- `tests/e2e/lookdevReady.ts` (new, code review)
- GTX 1650 rule (after review): `Makefile`, `playwright.config.ts`, `README.md`, `src/render/renderer.ts`, `src/lookdev/rendererView.ts`, `src/lookdev/lookdev.css`, `tests/e2e/lookdev/lookdev.spec.ts` (all already listed)
- `eslint.config.js` (modified at code review: `main.ts` may not import `lookdev/`; nothing but `lookdev/` may import `render/lookdevScenes.ts`)
- `tests/e2e/lookdev/lookdev.spec.ts` (new)
- `tests/e2e/shots.spec.ts` (new)
- `tests/e2e/smoke.spec.ts` (modified: uses the helper; the `dist/` check)
- `playwright.config.ts` (modified: the `E2E_TARGET` switch)
- `Makefile` (modified: `DEV_PORT`, `SHOTS_PORT`, `shots`; header)
- `README.md` (modified: the look-dev page and the critic loop)
- `_bmad-output/implementation-artifacts/0-6-build-the-look-dev-page-and-the-screenshot-harness.md` (this story)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

## Change Log

- 2026-11-14: Story created (ready-for-dev).
- 2026-11-14: Story implemented. The look-dev page has overlay and renderer views, `render/renderer.ts`, `ui/overlay.ts` with `--tile`, and `CONFIG.view`. `make shots ROUND=n` runs the look-dev checks first, and smoke has a permanent `dist/` check. 14 new Vitest tests (178 in all), 7 look-dev checks and 3 spots. Two critic rounds fixed 3 problems, and the developer signed off. Status set to review.
- 2026-11-14: Code review. 4 decisions resolved as recommended; 15 patches applied; 0 deferred; 4 dismissed. The fixes: error state and fast failure, partial rounds, a floating bar with none on spots, token-coloured chip backing, the ESLint look-dev bans, a stronger texture estimate, and stronger checks. A headless shot regression was found and fixed on the way. 183 tests and 10 look-dev checks pass. Status set to done.
- 2026-11-14: At the developer's request, every browser test now runs WebGL on the GTX 1650 (GPU=nvidia by default, through PRIME offload), checked by a new look-dev check. The renderer view shows the GPU. The README documents Chromium on the GTX 1650 for development.
- 2026-11-14: `gds-correct-course` (`sprint-change-proposal-2026-11-14-gpu.md`, approved) corrected AC17's reason and the Playwright reference note: WebGL runs on the GTX 1650, not in software.

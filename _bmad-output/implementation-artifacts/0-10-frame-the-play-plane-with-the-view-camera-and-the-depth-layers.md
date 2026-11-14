---
baseline_commit: 636f1b9280a33b2c2ddab5daceb2d6deafbffc0c
---

# Story 0.10: Frame the play plane with the view camera and the depth layers

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the view camera and the four depth layers that every level uses, with the camera's framing recorded in `CONFIG.view`,
so that the play area always shows at least 19 × 10.4 tiles, wide screens only add backdrop, and the overlay's `--tile` matches the world.

**Requirements:** FR208, NFR14, AR162, AR163, X-B35 (and AR248 for the homes this story picks)
**Epic:** 0, Reference and style lock. Stories 0.1 to 0.9 are done (`636f1b9`). 0.9 built the material factories and `createLook`; this story puts them on a stage with a real camera. 0.11 adds shadows and the outline pass to the staged scene; 0.12 builds the test scene on this stage and camera; Epic 1 (1.5, 1.8) makes the camera follow the simulation camera with interpolation.

## Acceptance Criteria

The epic's ACs, made exact. Where this story reads the epic one way of several, the decision is in Dev Notes › Decisions (D1–D12), and the developer can veto it at review.

### The view camera

1. **Given** `src/render/viewCamera.ts`, **then** it frames the play plane (z = 0) with a three.js `PerspectiveCamera` (the style guide locked perspective on 2026-11-14, §2 Camera, so the orthographic branch of AR162 is not built). Its vertical field of view is `CONFIG.view.fovDeg` (30 †, D1), looking along −z.
2. **The framing is a pure function** (D2): `frameBox(boxWidth, boxHeight, aspect, fovDeg)` returns `{ distance, visibleWidth, visibleHeight }`, where `distance` is the camera's distance from z = 0 and the visible rectangle at z = 0 contains the box, equal to it on the limiting axis. `viewFraming(aspect)` applies it to `CONFIG.view`: box = `(width + 2 × margin) × (height + 2 × margin)`. It throws (`invariant`) for an aspect that isn't positive and finite.
3. **Extra width or height shows more around the box, never a bigger box:** tiles are the same on-screen size whatever the window shape, set by the limiting axis.
   - 4:3 (1440 × 1080) is width-limited: visible width = 19 + 2m, extra rows above and below.
   - 21:9 (2560 × 1080) is height-limited: visible height = 10.4 + 2m, extra width.
   - **16:9 is width-limited too** (19 / 10.4 ≈ 1.827 > 16 / 9 ≈ 1.778): it shows about 0.29 extra tiles of height at margin 0 (about 15 px top and bottom at 1080). Tests must not assume 16:9 fits exactly on both axes.
4. **Unit tests** (`src/render/viewCamera.test.ts`) at 16:9, 4:3 and 21:9 (and the 1280 × 720 embed): the visible rectangle contains the framed box, equals it on the limiting axis, and the on-screen tile size `heightPx / visibleHeight` equals `min(widthPx / (19 + 2m), heightPx / (10.4 + 2m))`, the formula `ui/overlay.ts` uses. A second test frames a real `PerspectiveCamera` with `createViewCamera()` and checks three's own `camera.getViewSize(distance, target)` (r187) against `frameBox`, so the formula is checked by a second source.
5. `CONFIG.view` in `src/sim/config.ts` holds `fovDeg` beside `width`, `height` and `margin`, each with its comment; `margin`'s comment no longer says "† until story 0.10" but records the locked value and the date.

### The margin and `--tile`

6. **Given** the developer locks the framing in the critic loop (AC21), **then** the margin (default 0, D3) is recorded in `CONFIG.view.margin` (X-B35).
7. **A Playwright check** in `tests/e2e/lookdev/staging.spec.ts` finds that `--tile`, as set by `ui/overlay.ts` on an overlay root the staging view mounts, equals the on-screen size of one tile on the play plane to within 1 px, at 1920 × 1080 and at 1280 × 720. The on-screen size is **measured from pixels** (the tile ruler, D9), not computed from the camera (readiness proposal 2026-11-13, Q12).
8. **If the locked margin isn't 0:** the story's Completion Notes give the change to DESIGN.md's `--tile` formula (`min(100vw / (19 + 2m), 100vh / (10.4 + 2m))`) and its expected sizes (about 101 px and 67 px today), for story 0.14's DESIGN.md update; `src/ui/overlay.test.ts`'s "about 101 px / 67 px" expectations are updated to the new values with a comment naming 0.14. DESIGN.md itself is not edited here.

### The stage and its depth layers

9. **Given** `src/render/stage.ts`, **when** `createStage(palette, rig)` builds a scene, **then** the scene holds four named `Group`s, one per depth layer, at their depths from `STAGE_LAYERS` (D5): `far` (far distance), `middle` (middle distance), `play` (z = 0: kit, characters, pickups and effects) and `foreground`. Far < middle < play = 0 < foreground < the nearest camera distance any supported aspect gives (unit-tested).
10. **The stage owns the level's look** (D6): it creates one `Look` with `createLook(palette, rig)`, sets `scene.background` from the palette's `skyFar`, and `stage.applyLevel(palette, rig)` changes only those (by `look.apply()` and the background colour), never a material, a mesh or a shader program. The look-dev staging view switches level in place through it, and the check (AC16) proves no new program.
11. **Nothing in the foreground covers the play area.** For this story the play area is the logical-view box on screen (D4). `stage.ts` exports a pure check, `foregroundClear(framing, centreX, centreY, pieces)`, that projects each foreground piece's world rectangle onto the play plane (from depth `z`, a point projects to `c + (p − c) × D / (D − z)`) and reports any that overlap the box. Unit-tested with a piece that clears and one that intrudes. The staging view's own foreground pieces are checked in the browser (AC17): ESLint's `LOOKDEV_SCENES` rule stops any `render/` file, tests included, from importing `lookdevScenes.ts`.

### The staging view

12. **Given** the look-dev page, **when** the staging view opens (`?view=staging`, optionally `&level=<id>`, Emberwood by default), **then** the canvas fills the whole window (so its size equals `window.innerWidth × innerHeight`, which `--tile` uses), and it shows:
    - placeholder shapes from **the backdrop material only** in each of the four layers (`createBackdropMaterial`; slots in Dev Notes › The staging scene), shaped so motion reads (repeated trunks, a ridge line, plant silhouettes), not plain full planes;
    - the tile ruler on the play layer (D9);
    - **the logical-view box outlined** as page chrome positioned from the scene's projected corners (D8), with its size in tiles as a caption;
    - a level picker that switches in place (as the materials view's: `history.replaceState`, `aria-pressed`), the current pan and framing (distance, visible tiles, aspect, tile px) as text, and the reused stats panel.
13. **When the camera pans**, the layers move at different rates (parallax): the camera's centre x moves; y stays at the box centre. Without a spot, the view sweeps the pan across `±PAN_RANGE_TILES` † with time; a spot fixes it with its new `panTiles` field (D7). The box stays fully on screen at every pan. Every layer's shapes cover the visible area at their depth at 4:3, 16:9 and 21:9 across the whole pan range, so no layer ever shows an edge (unit-tested from `frameBox`; wider than 21:9 is out of scope for the staging view).
14. **Following the simulation camera, with interpolation, is not built here:** Epic 1 builds that camera (1.5 frames a fixed view around the `PlayerStart`, 1.8 follows). `viewCamera.ts` exposes `frame(centreX, centreY, aspect)` for them to call.
15. **Spots:** eight, all Emberwood, at 1920 × 1080, 1280 × 720, 1440 × 1080 and 2560 × 1080, each at two pans: `panTiles: 0` and `panTiles: PAN_SPOT_TILES` † (ids `lookdev-staging-<w>x<h>-pan-<0|n>`). The materials and empty scenes keep their own spots.

### Checks

16. **`tests/e2e/lookdev/staging.spec.ts`** (Dev Notes › Tests, S1–S7), run first by `make shots` as every check in that folder is:
    - each level opens with no console error, page error or failed request;
    - `--tile` against the measured ruler at both sizes (AC7);
    - the box fully on screen, and the right axis limiting, at the four sizes and two pans;
    - switching level in place keeps the shader-program count and changes the ruler's colours to the new level's slot values (exact hex, flat backdrop material at z = 0);
    - an unknown level ends in the error state, naming it.
17. The foreground pieces' projected rectangles (from the view's data attributes) don't overlap the box at any of the eight spot configurations.

### The critic loop

18. **Given** the staging view at the eight spots, **when** the critic loop runs (`make shots ROUND=n`, at most 3 rounds), **then** each shot is opened and looked at before it is described, and checked: the logical-view box fully visible; tiles the same size at every window shape; the extra area showing the layers continuing (backdrop, the play layer's ground) with no layer edge and no bare background; the foreground clear of the box; parallax visible between the two pans (far moves least, foreground most).
19. The three biggest problems are written down, most important first, and fixed. Tune only the † staging numbers (`STAGE_LAYERS`, the pan constants, the placeholder layout) and, with the developer, `CONFIG.view.fovDeg`.
20. Every other spot is glanced at: the materials shots must be unchanged after the framing refactor (D10), compared with round 17.
21. **The developer sees before and after and signs off on the framing:** the field of view, the margin (D3) and the layer depths. The locked values go into `CONFIG.view`, `STAGE_LAYERS` and the style guide (§2 Camera; §10 closes "The camera's field of view and framing margin").

### Done means checked

22. `make check`, `make build`, `make smoke` and `make shots ROUND=<n>` pass. `make build`'s output is unchanged in kind: nothing in the game's graph imports `stage.ts` or `viewCamera.ts` yet (`src/main.ts` is untouched), so a grep of `dist/` for a unique string from each (an `invariant` message) finds nothing.

## Tasks / Subtasks

- [x] **T0: Baseline** (AC: all)
  - [x] `git status` is clean. At story creation (2026-11-14) story 0.9 was committed as `636f1b9` and the tree was clean. If it isn't, stop and ask the developer.
  - [x] Set `baseline_commit` in this file's frontmatter to `git rev-parse HEAD`.
- [x] **T1: `CONFIG.view.fovDeg`** (AC: 1, 5)
  - [x] Add `fovDeg: 30` (†, vertical, degrees) to `CONFIG.view` with a comment: vertical as three's `PerspectiveCamera.fov`; locked in story 0.10's critic loop; the field of view had no stated home (ga#17), so it sits beside the margin (X-B35), the epic's reading. Keep `as const`.
- [x] **T2: `src/render/viewCamera.ts`** (AC: 1–4, 14) (D1, D2)
  - [x] `viewCamera.test.ts` first (Tests 1–6), run red, then the module: `frameBox`, `viewFraming`, `tilePx(framing, heightPx)`, `createViewCamera()` → `{ camera, framing, frame(centreX, centreY, aspect) }`. `frame` sets aspect, position `(cx, cy, distance)`, `lookAt(cx, cy, 0)`, `updateProjectionMatrix()`, `updateMatrixWorld()`, and allocates nothing (Epic 1 calls it every frame: keep the returned framing in one reused object).
- [x] **T3: `src/render/stage.ts`** (AC: 9–11, 13) (D4, D5, D6)
  - [x] `stage.test.ts` first (Tests 7–12), run red, then the module: `STAGE_LAYERS` (`as const`, each depth †), `createStage(palette, rig)` → `{ scene, layers: { far, middle, play, foreground }, look, applyLevel(palette, rig), dispose() }`, `projectToPlayPlane(...)`, `foregroundClear(...)`, `coverageNeeded(depth, aspects, panRange)`.
- [x] **T4: One framing for every look-dev scene** (AC: 20) (D10)
  - [x] `createEmptyLookdevScene()` uses `createViewCamera()` and `CONFIG.view` (the renderer view then shows the real framing on an empty scene).
  - [x] `createMaterialsLookdevScene` keeps its own box (its rows) but calls `frameBox` instead of its inline formula, with `CONFIG.view.fovDeg`. Delete `PLACEHOLDER_FOV_DEGREES` and `PLACEHOLDER_CAMERA_Z`. Update the file header (it says 0.10 replaces the placeholder camera).
  - [x] Run `materials.spec.ts`: all green, unchanged.
- [x] **T5: The staging scene** (AC: 12, 13) (D7, D8, D9)
  - [x] `createStagingLookdevScene({ levels, levelId })` in `src/render/lookdevScenes.ts` (not a new file: ESLint's `LOOKDEV_SCENES` rule keys on that file name). It builds on `createStage` and `createViewCamera`, fills the layers from the backdrop factory only, and exposes `setAspect`, `setPan(panTiles)`, `setLevel(id)`, `update(timeSeconds)` (the sweep, unless a pan is fixed), `layout(widthPx, heightPx)` → `{ box, foreground[], ruler, framing }` in canvas pixels, `rulerSlots` (the two slots), and `dispose()`.
- [x] **T6: Look-dev plumbing** (AC: 13, 15) (D7)
  - [x] `LookdevSpot` gains `readonly panTiles?: number` (`spots.ts` stays import-free). `LookdevMountOptions` gains `readonly panTiles: number | undefined`, filled by `main.ts` from the spot only (a spot is fixed by its own data, 0.9's review). Update the `LookdevMountOptions` comment ("Story 0.10 adds camera presets here").
  - [x] The eight spots in `LOOKDEV_SPOTS`, after the materials spots.
- [x] **T7: The staging view** (AC: 12, 13)
  - [x] `src/lookdev/stagingView.ts` (`mountStagingView`). Register `{ id: 'staging', label: 'Staging', mount: mountStagingView }` after `materials`.
  - [x] The canvas host fills `.lookdev-main` (the existing `.lookdev-canvas-host`). Mount `createOverlay(host)` and give its root a staging class whose rule (inside `.ui-overlay`, tokens only) makes it empty and `pointer-events: none`; it exists only so `--tile` is set by `ui/overlay.ts` on this page. The box outline, captions and side panel are page chrome (`lookdev-staging-*` in `lookdev.css`), never inside `.ui-overlay`.
  - [x] Data attributes for the checks, in page pixels: `data-box-left/top/right/bottom`, `data-tile-px` (computed, for display only; the check never trusts it), `data-ruler-y`, `data-ruler-x0`, `data-ruler-x1`, `data-ruler-slots`, `data-foreground` (JSON of rectangles), `data-level`, `data-pan`.
  - [x] Extract the level picker from `materialsView.ts` into `src/lookdev/levelPicker.ts` (`buildLevelPicker(levels, current, onPick)` → `{ element, setCurrent(id) }`, plus the `replaceState` helper) and use it in both views. `materials.spec.ts` must pass unchanged (its `data-level-button` and `aria-pressed` contract stays).
- [x] **T8: `tests/e2e/lookdev/staging.spec.ts`** (AC: 7, 16, 17) (Tests S1–S7)
  - [x] Extract `pixelAt` (and the decoder page) from `materials.spec.ts` into `tests/e2e/pixels.ts` (not a spec file, like `lookdevReady.ts`), add `rowAt(page, browser, y, x0, x1)`; `materials.spec.ts` imports it and passes unchanged.
  - [x] Throwaways F1–F3 (Dev Notes), each recorded in the Debug Log, then reverted (`cmp` against a scratchpad copy).
- [x] **T9: Docs**
  - [x] `docs/STYLE_GUIDE.md` §2 Camera: replace "The framing and its margin are locked in story 0.10" with the locked field of view, margin and layer depths (prose; frontmatter untouched, so the drift tests don't move). §10: mark "The camera's field of view and framing margin" closed with the date.
  - [x] `README.md`, "The look-dev page and the critic loop": add the staging view (one clause).
  - [x] If the margin isn't 0: the DESIGN.md note in Completion Notes and the `overlay.test.ts` update (AC8).
- [x] **T10: `make check`, `make build`, `make smoke`** pass; record the test counts; grep `dist/` (AC22).
- [x] **T11: Critic loop** (AC: 18–21)
  - [x] Rounds 18 to 20 at most (`shots/` holds rounds 1–17; check `ls shots/` first): `make shots ROUND=n`, open the eight staging shots, write the three biggest problems, fix, repeat. Record each round in the Debug Log. Compare the materials shots with round 17.
  - [x] Show the developer the first and last rounds' staging shots (SendUserFile) with the framing values, and get his sign-off on field of view, margin and layer depths (AskUserQuestion). If he picks a non-zero margin, do AC8.
- [x] **T12: Close:** Dev Agent Record, File List, Change Log; status `review`.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). Seven findings were dismissed:
- **Texture leak in the stage's `disposeTree`:** the factory materials hold no textures (colour uniforms only).
- **HiDPI scaling in the outline:** `renderer.size()` returns CSS pixels.
- **The materials scene's first distance changed:** `frame(1)` runs at construction, before anything reads it.
- **Ground fog touching the ruler:** `smoothstep(base, base + h, y)` is exactly 0 at the ruler's bottom.
- **S2's `--tile` against `computeTilePx` is a tautology:** it is the wiring check the story asks for (three-way agreement); the measured ruler is the real check.
- **The `foregroundIntruders` rename:** declared and accepted.
- **Only three layers show at 16:9 and 21:9:** D4 and margin 0, both signed off.

- [x] [Review][Decision] The staging view is correct only for window shapes from 4:3 to 21:9 and pans within ±6 tiles — the plants' highest clear top is computed from the 4:3 camera only, so a narrower window (5:4, 1:1, portrait, or a window with side-docked DevTools) puts the camera further back and the plants project 1–19 px into the logical view, breaking AC11 on the live page; the layers' cover is computed for the same three shapes, so narrower or wider than that shows layer edges; `setPan` accepts any value. S6 runs only at the spot shapes, so nothing catches it. **Resolved 2026-11-14: option 1** (patch below).
- [x] [Review][Patch] Make the staging view right at any window shape: the plants' tops at the box's bottom edge less the clearance (clear for every camera distance, since the foreground's scale is always above 1), the layers' cover widened to include narrow and portrait windows, and `setPan` clamped to ±`PAN_RANGE_TILES` [src/render/lookdevScenes.ts]
- [x] [Review][Patch] No check proves a spot's `panTiles` reaches the camera: at frozen time 0 the sweep is 0 too, so a broken pan path would render every pan-3 spot at pan 0 and S3/S6 would still pass; assert `data-pan` equals the spot's pan [tests/e2e/lookdev/staging.spec.ts]
- [x] [Review][Patch] AC12: the box caption doesn't give the box's size in tiles (19 × 10.4) [src/lookdev/stagingView.ts]
- [x] [Review][Patch] S6 compares the page's numbers with themselves and is lenient: no rendered pixel is checked, the 1 px tolerance eats most of the 0.02-tile clearance; add a pixel check that the row just inside the box's bottom edge shows no `foregroundDark` at the 4:3 spots [tests/e2e/lookdev/staging.spec.ts]
- [x] [Review][Patch] The scene never checks its own foreground and `foregroundIntruders` has no real caller; nothing ties `STAGING_ASPECTS` to the spot shapes, and `stage.test.ts` retypes the pan range and aspects: check the scene's plants with `foregroundIntruders` at construction (`invariant`), and assert in S7 that every staging spot's shape is in `STAGING_ASPECTS` [src/render/lookdevScenes.ts, tests/e2e/lookdev/staging.spec.ts]
- [x] [Review][Patch] The staging page allocates and forces a reflow every frame while sweeping (`layout()`, `.map`, `JSON.stringify`, `getBoundingClientRect` after style writes): cache the canvas rectangle on resize and skip the layout when pan, size and level are unchanged [src/lookdev/stagingView.ts]
- [x] [Review][Patch] Two assertions in the stage's level-switch test can't fail (`toEqual` on the same references; children untouched by `applyLevel`): remove them, keep the identity and `version` checks [src/render/stage.test.ts]
- [x] [Review][Patch] AC3's "16:9 is width-limited too" is never pinned: both tests decide the axis from the ratio; assert it explicitly at margin 0 [src/render/viewCamera.test.ts]
- [x] [Review][Patch] `viewCamera.frame` doesn't guard its centre: a NaN centre gives a NaN camera with no error; add an `invariant` [src/render/viewCamera.ts]
- [x] [Review][Patch] `rowAt` with an inverted or empty range gives Playwright a confusing clip error: throw a clear one [tests/e2e/pixels.ts]
- [x] [Review][Patch] AC18: the critic loop opened 4 of 8 staging shots per round, no 1280 × 720 shot, and never both 4:3 pans, so the foreground's parallax wasn't judged: open the remaining round 19 shots and record them [this story]
- [x] [Review][Patch] The record is inaccurate in two places: F3 ran before the pan changed from 4 to 3 (it says "passed at pan 4"), and several small deviations are undeclared (`buildLevelPicker` takes no `current`; `replaceLevelInUrl`; `coverageNeeded`'s options object; the `view` parameter on `viewFraming`/`createViewCamera`; the ruler slots inside `layout().ruler`; `RULER_SLOTS` exported) [this story]

## Dev Notes

### Current state of the files this story touches

| File | Today | This story | Keep |
| --- | --- | --- | --- |
| `src/sim/config.ts` | `CONFIG.view = { width: 19, height: 10.4, margin: 0 }`, margin marked † until 0.10 | Adds `fovDeg`; margin's comment records the lock | `as const`; `width`, `height` (AR77; not †) |
| `src/ui/overlay.ts` | `computeTilePx(w, h, view)` = `min(w / (19 + 2m), h / (10.4 + 2m))`; `createOverlay` sets `--tile` from `innerWidth`/`innerHeight` on resize | **Not touched.** It already includes the margin | All of it |
| `src/ui/overlay.test.ts` | Expects about 101 px and 67 px | Only if margin ≠ 0 (AC8) | Otherwise unchanged |
| `src/render/lookdevScenes.ts` | `LookdevScene` interface; `createEmptyLookdevScene()` with a placeholder 30° camera at z = 10; `createMaterialsLookdevScene` with an inline `frame(aspect)`: `distance = max(halfHeight / tanHalfFov, halfWidth / (tanHalfFov × aspect))`, the same maths as `frameBox` | Both use `viewCamera.ts`; adds `createStagingLookdevScene` | `LookdevScene`, `disposeTree`, the materials scene's behaviour and shots |
| `src/lookdev/assetBrowser.ts` | 5 views; `LookdevMountOptions { spot, level }` with the comment "Story 0.10 adds camera presets here" | `staging` view; `panTiles` in the options | Every existing view |
| `src/lookdev/main.ts` | Fills `level` from the spot, else `?level=` | Fills `panTiles` from the spot only | Every state and message |
| `src/lookdev/spots.ts` | 9 spots, pure data, no imports | `panTiles?`; 8 spots | No imports |
| `src/lookdev/materialsView.ts` | Builds its own level picker | Uses `levelPicker.ts` | Its DOM contract (`data-level-button`, `aria-pressed`, URL `level`) |
| `src/lookdev/rendererView.ts` | `buildStatsPanel` exported; empty scene | **Not touched** (its scene changes camera via T4) | — |
| `src/lookdev/lookdev.css` | Chrome, palettes, type and materials rules; `.lookdev-main > .ui-overlay` lays out the overlay views (grid, padding) | `lookdev-staging-*` chrome; a staging overlay class that overrides the grid to empty, `pointer-events: none` | Everything else |
| `tests/e2e/lookdev/materials.spec.ts` | Owns `pixelAt` and its decoder | Imports them from `tests/e2e/pixels.ts` | Every check, unchanged |
| `docs/STYLE_GUIDE.md`, `README.md` | §2 Camera says 0.10 locks the framing; §10 lists it open | Locked values; one README clause | Frontmatter, every value |
| `src/render/renderer.ts`, materials, palettes, rigs, DESIGN.md, `base.css`, `src/main.ts` | — | **Not touched** | — |

`tests/e2e/lookdev/lookdev.spec.ts` already checks that every view opens with no error and has a spot, and that `--tile` follows `CONFIG.view`, so the new view is covered there with no edit. `tests/e2e/shots.spec.ts` iterates `LOOKDEV_SPOTS` and needs no edit.

### Decisions (the developer can veto any at review)

- **D1 — Perspective, vertical 30° †, in `CONFIG.view.fovDeg`.** The style guide locked perspective (§2 Camera, 2026-11-14). three's `fov` is vertical, so `fovDeg` is too (about 51° horizontal at 16:9, a lens near 45 mm full-frame: narrow enough that the 3D characters keep little depth distortion). The epic's note puts it in `CONFIG.view` beside the margin; it isn't a gameplay number, so the comment says so.
- **D2 — The field of view is fixed; the distance changes with the aspect.** `distance = max(boxHeight / 2, boxWidth / (2 × aspect)) / tan(fov / 2)`. At margin 0: 16:9 → 10.69 tiles visible high, D ≈ 19.9; 4:3 → 14.25 high, D ≈ 26.6; 21:9 → 10.4 high, D ≈ 19.4.
  - Trade-off: the parallax ratios between layers shift a little with the window shape (the camera sits further back at 4:3). The other way, a fixed distance and a varying field of view, changes the perspective on the 3D characters with the window, and the epic fixes the field of view in config. Flag if the 4:3 shots look wrong.
- **D3 — The margin defaults to 0** (X-B35; recommended):
  - `--tile` stays DESIGN.md's (about 101 px at 1080, 67 px at 720), so every overlay size already specified stays right and story 0.14 has nothing to change;
  - "on screen" (the simulation's logical view, ADR-2) is what the player sees on the limiting axis, so an enemy never stands visible and idle in a margin band;
  - NFR14 is met at every aspect.
  - A margin > 0 shrinks every tile and HUD size by `19 / (19 + 2m)`, and is the only way to give the foreground a framing band at 16:9 (D4). The developer locks it at sign-off (AC21).
- **D4 — "The play area" is the logical-view box on screen, for this story.** It is the only reading that can be checked before a level exists, and it is what the epic's AC and AR163 say. Consequence: at 16:9 with margin 0 there are only about 15 px above and below the box, so the staging foreground shows mostly at 4:3 (bottom band) and as slivers at 16:9, and hardly at 21:9 (extra width, but foreground pieces move faster than the box as the camera pans, so side pieces would cross into it). The staging foreground therefore sits **low, below the box's bottom edge** at every pan. The GDD hides bells "behind foreground scenery", which suggests level dressing may overlap the box away from the route; that is Epic 3's level dressing (3.2, 3.3), not decided here. **The developer chose this reading at story creation (2026-11-14): strict box for now; Epic 3 decides level dressing.**
- **D5 — The layer depths live in `render/stage.ts` as `STAGE_LAYERS`** (look data, shared by every level, not gameplay, so not `CONFIG`; flagged under AR248). Starting values †, in tiles along z: `foreground: 3`, `play: 0`, `middle: -8`, `far: -36`. Against the rigs' fog (Emberwood 4 → 40, the Drowned Mill 2 → 25, Harrowmere 3 → 32): the middle layer takes some fog, the far layer close to `maxAmount`, so far ridges still read through the cap. Parallax at D ≈ 19.9: far moves at `D / (D + 36)` ≈ 0.36 of the play layer, middle ≈ 0.71, foreground `D / (D − 3)` ≈ 1.18. The critic loop tunes them with the developer.
- **D6 — The stage holds the look.** `createStage(palette, rig)` makes the one `Look` every material on the stage shares (0.9, D2), and `applyLevel` = `look.apply()` + `background.set(palette.skyFar)`. That is the whole of "the look-dev page switches level by swapping the palette and rig data only". Glowing materials made under one level must still satisfy the warm rule after `apply()` (0.9's review: `look.apply()` throws otherwise); the staging scene has none, so this doesn't bite here, but Epic 1's level view must dispose level-only glows before a switch, as the materials scene does with its lantern glass.
- **D7 — Pan:** `LookdevSpot.panTiles` (a spot fixes it; the URL never does); without a spot the camera sweeps `panX = PAN_RANGE_TILES × sin(2π × timeSeconds / PAN_PERIOD_SECONDS)` (both †; starting 6 tiles and 12 s). `PAN_SPOT_TILES` † starting at 4 (inside the range, far enough for parallax to read between the two pan shots). The y centre is fixed at the box centre; the stage's world puts the ground line at the box's lower part as a level would (Dev Notes › The staging scene).
- **D8 — The logical-view box is page chrome, not a 3D line.** A DOM rectangle placed from `layout()`'s projected corners, like 0.9's labels. No line material is needed, so `render/materials/` stays the game's material set (0.9's notes suggested a line factory; a development-only guide doesn't belong in it). The box is drawn above the scene, so the critic sees any foreground crossing it.
- **D9 — The tile ruler measures `--tile` from pixels.** A strip of 1-tile cells on the play layer at z = 0, alternating two slots (`groundTop`, `groundSide`) from the backdrop material, which is flat with no fog at z = 0, so each cell draws its exact hex. The check reads one pixel row across the strip, finds the edges between the two colours, and divides the distance between the first and last full-cell edges by the cell count. Over many cells, the antialiased edge pixels cost a fraction of a pixel. The same strip proves the in-place level switch (exact hex per level). Measured in Emberwood (no ground fog); the Drowned Mill's low fog would tint it if the strip sat within `heightTiles` of the fog base, so the staging scene sets the ground-fog base below the ruler (`look.setGroundFogBaseY`).
- **D10 — One framing function for every look-dev scene.** The materials scene's inline formula is `frameBox`; it calls it with its own box. The empty scene takes `createViewCamera()`. The materials shots must not change (compare with round 17); if they do, the refactor is wrong.
- **D11 — `stage.ts` and `viewCamera.ts` are game code** (architecture, Directory Structure), not look-dev code: no `lookdev` or `lookdevScenes` import, no `window` or `document`. Only `lookdevScenes.ts` uses them for now; Epic 1's `main.ts` will.
- **D12 — No new dependency, no new folder.** New files sit in existing folders: `render/`, `lookdev/`, `tests/e2e/`, `tests/e2e/lookdev/`.

### Module shapes (sketches, not final code)

```typescript
// src/render/viewCamera.ts — the view camera (AR162). Following the simulation camera with
// interpolation is Epic 1's (1.5, 1.8); this story frames a given centre.
export interface Framing {
  /** Camera distance from the play plane (z = 0), in tiles. */
  distance: number;
  /** The visible rectangle at z = 0, in tiles. */
  visibleWidth: number;
  visibleHeight: number;
  aspect: number;
}
/** Pure. Throws (invariant) for an aspect, size or field of view that isn't positive and finite. */
export function frameBox(boxWidth: number, boxHeight: number, aspect: number, fovDeg: number, out?: Framing): Framing;
/** frameBox for CONFIG.view: (width + 2 × margin) × (height + 2 × margin), CONFIG.view.fovDeg. */
export function viewFraming(aspect: number, out?: Framing): Framing;
/** On-screen pixels per tile at z = 0 for a canvas `heightPx` tall. */
export function tilePx(framing: Framing, heightPx: number): number;
export interface ViewCamera {
  readonly camera: PerspectiveCamera;
  /** The last framing, one reused object. */
  readonly framing: Readonly<Framing>;
  /** Frames the logical view centred on (centreX, centreY). Allocates nothing. */
  frame(centreX: number, centreY: number, aspect: number): void;
}
export function createViewCamera(): ViewCamera;

// src/render/stage.ts — the scene and its depth layers (AR163; FR208).
export const STAGE_LAYERS = { far: -36, middle: -8, play: 0, foreground: 3 } as const; // † (story 0.10's critic loop)
export type StageLayer = keyof typeof STAGE_LAYERS;
export interface Stage {
  readonly scene: Scene;
  readonly layers: Readonly<Record<StageLayer, Group>>;
  /** Every material on the stage is made from this look (0.9, D2). */
  readonly look: Look;
  /** Swaps the palette and rig: look.apply() and the background. Nothing else changes. */
  applyLevel(palette: LevelPalette, rig: LightingRig): void;
  dispose(): void;
}
export function createStage(palette: LevelPalette, rig: LightingRig): Stage;
export interface Rect { readonly left: number; readonly right: number; readonly bottom: number; readonly top: number }
/** A rectangle at depth z, as it lands on the play plane seen from (cx, cy, distance). */
export function projectToPlayPlane(rect: Rect, z: number, cx: number, cy: number, distance: number): Rect;
/** The foreground pieces (world rectangles at STAGE_LAYERS.foreground) that overlap the logical-view box. */
export function foregroundClear(framing: Framing, cx: number, cy: number, pieces: readonly Rect[]): readonly Rect[];
```

Layer `Group`s are named (`stage-far`, …) so a debugger finds them. `dispose()` disposes what is under the groups (`disposeTree`-style: geometries, materials) and clears the scene; `lookdevScenes.ts`'s private `disposeTree` can't be imported by game code, so `stage.ts` has its own (or `disposeTree` moves to a small `render/dispose.ts`; the architecture names `render/assets/dispose.ts` for the loader in Epic 1: don't create that folder here; keep it local in `stage.ts`).

### The staging scene (starting layout, all †, tuned in the critic loop)

World: the box centre at `(0, BOX_CENTRE_Y)`, with the ground strip's top at about 2 tiles above the box's bottom edge, as a level's ground line would sit. Pan moves the centre x within `±PAN_RANGE_TILES`.

| Layer | z | Shapes (backdrop material) | Slot |
| --- | --- | --- | --- |
| far | −36 | a ridge line of rectangles of varying heights, one wide band behind them | `ridgeFar` |
| middle | −8 | tall trunks every 3 tiles, two heights | `treeMid` |
| play | 0 | the ground strip as the tile ruler (D9), 1-tile cells alternating; a few posts every 4 tiles above it | `groundTop` / `groundSide`; `bark` |
| foreground | +3 | plant silhouettes along the bottom, kept below the box at every pan (D4, `foregroundClear`) | `foregroundDark` |

- Sizes: each layer spans `coverageNeeded(depth, …)`: the visible width at its depth for 21:9, plus the pan range, plus a tile each side; the far band tall enough for 4:3. A Vitest test proves coverage at the three aspects and both pan extremes.
- `scene.background` is `skyFar` (the stage sets it).
- Draw calls stay low: share one geometry per shape kind and one material per slot; scale meshes, don't rebuild geometry on resize. An `InstancedMesh` per repeated shape is fine (compute its bounding sphere after setting matrices, or culling drops it: 0.9's note and project-context). Story 0.12 checks budgets; just don't be wasteful here.
- **The layout for the page** (`layout(widthPx, heightPx)`): project the box's corners at z = 0, each foreground piece's rectangle, and the ruler strip's row and ends through the scene's camera into canvas pixels. The view adds the canvas's page offset (0 here: the canvas fills the window). lookdev/ never computes 3D positions itself.

### Tests

**Vitest, Node** (`make test`). three.js core runs in Node; no `WebGLRenderer`. Tests import `CONFIG` and `STAGE_LAYERS`; they never retype numbers.

`src/render/viewCamera.test.ts`
1. `frameBox` at 16:9, 4:3, 21:9 and 1280 × 720 for `CONFIG.view`: the visible rectangle contains the box; it equals the box on the limiting axis (width at 16:9 and 4:3, height at 21:9) within 1e-9; the other axis is larger.
2. Tile size: `tilePx(framing, h)` equals `min(w / (width + 2m), h / (height + 2m))` (written out from `CONFIG.view` in the test; `render/` can't import `ui/`, and the Playwright check ties it to `computeTilePx`).
3. A margin of 1 (a local view object, not `CONFIG`): the framed box grows by 2 on each axis.
4. `createViewCamera().frame(cx, cy, aspect)`, then three's `camera.getViewSize(framing.distance, new Vector2())` equals `(visibleWidth, visibleHeight)`; the camera's world position is `(cx, cy, distance)` and it looks along −z.
5. An aspect of 0, −1, `NaN` or `Infinity` throws (`invariant`), naming the value.
6. `frame` called twice returns the same `framing` object (no allocation per call).

`src/render/stage.test.ts`
7. `createStage` gives four named groups at `STAGE_LAYERS`' depths, in the scene, in the order far, middle, play, foreground; far < middle < play = 0 < foreground.
8. The foreground is in front of the camera at every supported aspect: `STAGE_LAYERS.foreground` < the smallest `viewFraming(aspect).distance` for 4:3, 16:9 and 21:9, less the camera's `near`.
9. `applyLevel` with each palette and rig: the background equals the palette's `skyFar`; the look's uniform objects are the same objects (0.9's identity rule); a backdrop material made before the switch is the same object, `version` unchanged.
10. `projectToPlayPlane`: a rectangle at z = 0 projects to itself; one at the foreground depth, centred on the camera, grows by `D / (D − z)`; one at the far depth shrinks by `D / (D + |z|)`.
11. `foregroundClear`: a piece below the box at every pan returns nothing; a piece that crosses the box's bottom edge at one pan is returned.
12. Coverage: for each layer, `coverageNeeded` contains the visible rectangle at that depth at 4:3, 16:9 and 21:9 and pans `±PAN_RANGE_TILES`. (If the pan constants live in `lookdevScenes.ts`, pass them in; the pure function lives in `stage.ts`.)

**Playwright, Chromium, dev server** (`make shots` runs it first): `tests/e2e/lookdev/staging.spec.ts`. Use `expectLookdevReady` and the page-error helpers, and import `CONFIG`, `computeTilePx` and the palettes in Node; read the style guide's hex values with `readFrontmatter` as `materials.spec.ts` does. Assert `devicePixelRatio` is 1 in the page (Playwright's default), so screenshot pixels are CSS pixels.
- **S1:** each level, `?view=staging&level=<id>`, reaches ready with no console error, page error or failed request.
- **S2 (`--tile`, AC7):** at 1920 × 1080 and 1280 × 720, in Emberwood with the pan fixed (open a spot, or `?spot=` for the 1080 and 720 pan-0 spots): read `--tile` from the `.ui-overlay` root (as `lookdev.spec.ts`'s `readTile` does); read the ruler row with `rowAt` between `data-ruler-x0` and `data-ruler-x1` at `data-ruler-y`; classify each pixel as the nearer of the two slot colours (`data-ruler-slots`, hex from the style guide), find the colour changes, and take (last change − first change) / (changes − 1) as the measured tile. `|measured − --tile| ≤ 1`. Also `|--tile − computeTilePx(w, h, CONFIG.view)| < 0.5`, so the three agree.
- **S3 (the box):** for each of the eight spots, the box (`data-box-*`) is inside the viewport (each edge within it, 1 px tolerance for antialiasing); at 4:3 and 16:9 its width equals the viewport width × `19 / (19 + 2m)` within 1 px, at 21:9 its height equals the viewport height × `10.4 / (10.4 + 2m)` within 1 px.
- **S4 (in-place switch):** open `?view=staging` with no spot, so the picker shows and the pan sweeps. The sweep moves the cells but not their colours, so sample one pixel at the ruler's middle after each switch and accept either of that level's two ruler slots. From Emberwood, click `[data-level-button="drowned-mill"]`, the URL's `level` is `drowned-mill`, the sampled ruler pixel is one of the Drowned Mill's two slot values within 1 per channel, and the shader-program count (`[data-lookdev-stat="programs"]`, polled) is unchanged; then Harrowmere, then back to Emberwood, same.
- **S5:** `?view=staging&level=zz-missing` settles in `error`, and `.lookdev-error` names `zz-missing`.
- **S6 (AC17):** for each spot, no rectangle in `data-foreground` overlaps the box.
- **S7:** every staging spot has `panTiles` set and names no level other than `emberwood`; the eight sizes × pans are all present.

### Throwaway checks (make the change, run, record the output, revert; `cmp` against a scratchpad copy)

| # | Change | Run | Expected |
| --- | --- | --- | --- |
| F1 | `CONFIG.view.fovDeg` to 31 in the camera only (pass a local 31 to `frameBox` in `createViewCamera`, leaving `viewFraming` at 30) | `make test` | Test 4 fails (three's view size and the framing disagree) |
| F2 | `margin: 0.5` in `CONFIG.view`, but `createViewCamera` frames the box without the margin | Playwright staging check (Makefile environment) | S2 fails: the ruler's tile differs from `--tile` by more than 1 px |
| F3 | One staging foreground piece raised into the box | Playwright staging check (Makefile environment) | S6 fails, naming the spot |

### What the critic loop judges here

Each round, open all eight staging shots and compare:

- the box fully on screen in every shot, the same tile size in all eight (the ruler cells look identical);
- 4:3 shows extra rows above and below; 21:9 extra width; 16:9 a sliver of extra height;
- the extra area shows the layers continuing: no layer edge, no bare background colour where a layer should be;
- the foreground stays out of the box; it reads as a dark frame low on screen where there is room;
- parallax between the pan-0 and pan-n shots: far moves least, then middle, then the play layer, then the foreground most;
- fog: the far layer is faint but still reads; the middle layer is lightly fogged.

Shadows and outlines are absent by design (0.11): note it, don't fix it. The look of the shapes is placeholder; judge framing, depth and parallax, not art. Tune `STAGE_LAYERS`, the pan constants and the placeholder layout; ask the developer before changing `CONFIG.view.fovDeg` or the margin.

### Previous story intelligence (0.9, 0.7, 0.6)

- **0.9's materials and look:** every material is made from a `Look` (`createLook(palette, rig)`) and shares its uniform objects; never `clone()` a factory material (it breaks the sharing). `look.apply()` recolours in place with no new program. The backdrop material is one flat tone (the slot) plus fog; at z = 0 the fog is 0 and the Drowned Mill's ground fog depends on `setGroundFogBaseY` (default 0). Colours on screen equal the guide's hex (no tone mapping, sRGB output); 0.9's P4 checked it within 1 per channel.
- **The materials scene already frames a box** with the formula in D2 and places fog samples with `c + (p − c) × (D + d) / D`: the same projection `projectToPlayPlane` needs. Reuse the maths; don't invent a second convention.
- **Look-dev plumbing (0.6–0.9):** a view is `{ id, label, mount(host, options) }` returning `{ frame, ready?, dispose }`; ready waits for the first frame, the fonts, the view's `ready`, then a frame. An exception in `mount` ends in `error` with the message. lookdev/ can't import three.js. Spots show no bar; the canvas must not depend on it. A spot is fixed by its own data, never the URL.
- **Review patterns to pre-empt** (0.9's code review): checks that compare the page with itself (here: measure the ruler, never trust `data-tile-px`); ready flags too early; a check that can't fail (F1–F3 prove three can); repeated literals in tests (import them); unhandled `ready` rejections; magic numbers in staging layout (name them); float noise in captions (round them); `dispose()` missing `InstancedMesh.dispose()`.
- **Lint lessons:** `.at()` for indexed access; type guards rather than `instanceof` narrowing to `any` generics; wrap methods passed as values (`unbound-method`); `Array.from` rather than string spreads; Prettier the new files before `make check`.
- **Vitest's module cache is off** (`vite.config.ts`, 0.9 D16); don't turn it back on.
- **Running Playwright by hand** needs the Makefile's environment (`GPU=nvidia E2E_TARGET=dev SHOTS_PORT=5174`), or the GTX 1650 check skips. Record only results from `make` targets.
- **`make shots`** refuses an existing round. Rounds 1–17 exist; start at 18.
- **Git:** one commit per story, `Frame the play plane with the view camera and the depth layers: story 0.10, reviewed and done`, straight on master, only when the developer asks.

### Git intelligence (last five commits)

`636f1b9` (0.9) added `render/materials/`, `core/invariant.ts`, the materials view and spec, and extended the ESLint shader boundary; `6468b3e` (0.8) the fonts and type view; `1ddab1d` (0.7) palettes and rigs as data and `levelLooks`' ancestor; `2ea6e9f` (0.6) the look-dev page, `renderer.ts`, `ui/overlay.ts` with `computeTilePx`, `CONFIG.view`, spots and the shots harness. Every story added one look-dev view, its spots and one spec in `tests/e2e/lookdev/`, and recorded throwaway checks. Follow the same shape.

### Latest technical notes (checked in `node_modules/three` 0.187.0, 2026-11-14)

- `PerspectiveCamera(fov, aspect, near, far)`: `fov` is the **vertical** field of view in degrees; `zoom` 1 by default (leave it). After changing `aspect` or `fov`, call `updateProjectionMatrix()`.
- `getViewSize(distance, target: Vector2)` and `getViewBounds(distance, minTarget, maxTarget)` exist in r187 (`src/cameras/PerspectiveCamera.js`, lines 234 and 253): the visible rectangle at a distance in front of the camera, from the inverse projection. Use them in Test 4 only, as the second source; the game's framing stays the pure `frameBox`.
- `Vector3.project(camera)` needs the camera's `matrixWorld` current: call `updateMatrixWorld()` in `frame()` (the materials scene does).
- The renderer fits the canvas to its host with a `ResizeObserver` and calls `onResize` listeners; `ui/overlay.ts` listens to `window` `resize`. Both fire on a Playwright `setViewportSize`; S2 waits with `expect.poll` as `lookdev.spec.ts` does.

### Project structure notes

- **New:** `src/render/viewCamera.ts` and `viewCamera.test.ts`; `src/render/stage.ts` and `stage.test.ts`; `src/lookdev/stagingView.ts`; `src/lookdev/levelPicker.ts`; `tests/e2e/pixels.ts`; `tests/e2e/lookdev/staging.spec.ts`.
- **Changed:** `src/sim/config.ts`, `src/render/lookdevScenes.ts`, `src/lookdev/{assetBrowser,main,spots,materialsView}.ts`, `src/lookdev/lookdev.css`, `tests/e2e/lookdev/materials.spec.ts`, `docs/STYLE_GUIDE.md` (§2, §10 prose), `README.md`; `src/ui/overlay.test.ts` only if the margin isn't 0.
- `stage.ts` and `viewCamera.ts` are where the architecture's Directory Structure puts them. No new folder; no new dependency.
- **Flagged under AR248 (closest pattern):** `STAGE_LAYERS` in `stage.ts` (no stated home; look data, not gameplay); `fovDeg` in `CONFIG.view` (the epic's reading of ga#17); `levelPicker.ts` and `tests/e2e/pixels.ts` as shared helpers (the closest pattern is `lookdevReady.ts` and `rendererView.ts`'s exported `buildStatsPanel`).

### Project context rules

- TypeScript strict. Relative imports carry `.ts`; `import type` for types. No enums, namespaces or parameter properties. Booleans `is…`, `has…`, `can…`. Every `switch` on a union ends in `assertNever` (create `core/assertNever.ts` only if one is needed).
- three.js only in `render/` (and tests). `render/` imports types from `sim/` and values only from `sim/config.ts`; never `ui/`, `app/`, `lookdev/`. lookdev/ imports `render/`, `ui/`, `content/`, `core/`, never three.js. Materials only from `render/materials/` factories; no GLSL, `ShaderMaterial` or `onBeforeCompile` outside it.
- "On screen" is the simulation's logical view, never the canvas size: the view camera only frames it (ADR-2). Nothing here touches `sim/` but `config.ts`.
- No per-frame allocation in render hot paths: `frame()` reuses its framing object; the staging sweep writes into existing objects.
- `invariant()` for bugs; log only through `core/log.ts` (`render` channel).
- One main export per file (shared helpers in the same file are fine, as `warmth.ts` and `lightingRig.ts` do), camelCase file names, no barrel files.
- `--tile` is set only by `ui/overlay.ts`; never hard-code it, never set it from `render/` or `lookdev/`.
- Run everything through `make`; `make check` before saying a change works; the critic loop after this visual change; look at every shot before describing it.
- Ask before adding a dependency (none needed), changing the folder structure, or changing a tuned number. `CONFIG.view.width` and `height` (19 × 10.4) are GDD numbers, not †: never change them.

### References

- Epic and story: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md`, Epic 0 (In scope: "The view camera and the four depth layers…"), Story 0.10 and its note; 0.11, 0.12 for what builds on it; 1.5 and 1.8 for the camera's later work.
- Requirements: `requirements-inventory.md`: FR208, NFR14, AR162, AR163, X-B35 (ga#20), AR248; AR77 (the logical view).
- GDD `gdd.md`: Art fixed rules (line 720, the four layers); Camera (lines 312–318); Screen (lines 803–808); bells "behind foreground scenery" (line 487).
- Architecture `game-architecture.md`: Gameplay Camera (lines 448–455); Rendering Structure (lines 562–563); User Interface, `--tile` (lines 596–597); ADR-2; Directory Structure (`render/stage.ts`, `render/viewCamera.ts`, `ui/overlay.ts`).
- `docs/STYLE_GUIDE.md` §2: Camera (perspective, about 30°, locked 2026-11-14); Outlines ("the far distance takes none", for 0.11); Colour grading ("the foreground framing never covers the play area"); Lighting per level (the fog depths); §10 open items.
- DESIGN.md `spacing.tile: 'min(100vw / 19, 100vh / 10.4)'` and its expected sizes; `ui/overlay.ts`'s `computeTilePx`.
- Readiness proposal `sprint-change-proposal-2026-11-13-readiness.md`, S0.10-a (Q12: the `--tile` check in `tests/e2e/lookdev/`).
- Previous stories: `0-9-build-the-shared-materials.md` (D2, D5, D7, D13; For later stories: 0.10), `0-6-build-the-look-dev-page-and-the-screenshot-harness.md` (D4: look-dev 3D in `render/lookdevScenes.ts`; `--tile` and `computeTilePx`).
- Code: `src/sim/config.ts`, `src/ui/overlay.ts` and its test, `src/render/lookdevScenes.ts`, `src/render/renderer.ts`, `src/render/materials/{look,backdropMaterial}.ts`, `src/lookdev/*`, `tests/e2e/lookdev/{lookdev,materials}.spec.ts`, `tests/e2e/{lookdevReady,pageErrors}.ts`, `eslint.config.js` (`LOOKDEV_SCENES`, `SIM_VALUES_EXCEPT_CONFIG`).
- three.js r187: `node_modules/three/src/cameras/PerspectiveCamera.js`.

### For later stories (not this one)

- **0.11:** the snapped directional shadow's camera must cover the visible play area at the widest supported framing; the outline pass skips the far layer (style guide: "the far distance takes none") — `STAGE_LAYERS.far` tells it where that is.
- **0.12:** the test scene builds on `createStage` and `createViewCamera`, with the key art's composition in the four layers; it judges `STAGE_LAYERS` again with real shapes, and the "fog thickest over pits and the far layer" staging.
- **0.14:** if the margin isn't 0, DESIGN.md's `--tile` formula and sizes change (AC8's note).
- **Epic 1:** 1.5 frames a fixed view around the `PlayerStart` with `frame()`; 1.8 follows the interpolated simulation camera and adds the resize test against `sim/camera.ts`'s logical view. Beyond the level's edges (3 tiles of dressing, then plain bands in the darkest slot) is staging in Epic 1 and 3, not here.
- **Epic 3:** whether level foreground may overlap the logical-view box away from the route (D4).

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code.

### Debug Log References

- **T0:** the tree held only this file and `sprint-status.yaml` (from story creation), as at 0.9's start. `baseline_commit` is `636f1b9` (story 0.9).
- **T1:** `CONFIG.view.fovDeg: 30` (vertical) beside the margin. `ui/overlay.ts`'s `ViewSize` takes `CONFIG.view` structurally, so the extra field changes nothing there.
- **T2, red then green:** `viewCamera.test.ts` failed red (no module), then passed: 365 → 388 tests. Test 4 checks `createViewCamera()` against three's `camera.getViewSize()` at four window shapes.
- **T3:** `stage.test.ts` was written before `stage.ts` but **not run red separately** (both landed before the first run). Green at 402.
  - **My first `foregroundIntruders` test was wrong:** it expected a piece below the box to cross into it once projected. Seen from the camera, a foreground point moves *away* from the screen centre (by D / (D − z)), so a piece outside the box in world space can never land inside it. The tests now cover the case that matters: a piece inside the box in world space that lands below it on screen passes, and one that still overlaps after projection is reported.
  - **Rename:** the story's `foregroundClear(...)` returns the pieces that break the rule, so it is `foregroundIntruders` (empty means clear). Added beside it: `visibleRectAt` and `logicalViewBox`, which the coverage test and the staging scene use.
  - The coverage test casts the screen's corners from a real camera onto each layer's depth (`Vector3.unproject`), a second source beside `visibleRectAt`.
- **T4:** the empty scene uses `createViewCamera()`; the materials scene calls `frameBox` with its own box. `PLACEHOLDER_FOV_DEGREES`, `PLACEHOLDER_CAMERA_Z`, `NEAR` and `FAR` are gone (`VIEW_NEAR`/`VIEW_FAR` from `viewCamera.ts`). `materials.spec.ts` and `lookdev.spec.ts`: 30 passed, unchanged.
- **T5–T7, the staging view:**
  - **The first scratch shot was a flat `#0E0F11`:** the look-dev CSS gives every overlay root `background: surface-screen` (right for the overlay sample views), so the empty root painted over the canvas and the outline. The staging overlay rule now sets `background: none`, as the game's overlay over a canvas will be.
  - At 1920 × 1080 the shot showed the box full width with about 15 px of extra height top and bottom (16:9 is width-limited, AC3), the ruler cells on the ground's top, trunks, posts and the ridge line; no foreground at 16:9, as D4 predicts.
  - **Deviation:** the canvas host is `.lookdev-staging-canvas` (the same two rules as `.lookdev-canvas-host`), inside the view's own root, so the outline and panel stack over it in one place.
  - `levelLookOrThrow` moved from `materialsView.ts` into `levelLooks.ts`, so both views share one lookup.
  - A spot hides the side panel (the shot shows the framing and the outline only); without a spot the panel shows the picker, the framing numbers and the statistics.
- **T8, the checks:**
  - `tests/e2e/pixels.ts` (`pixelAt`, `rowAt`, `channels`) and `tests/e2e/styleGuidePalettes.ts` (the guide's palettes, read in Node) were lifted out of `materials.spec.ts`; `waitFrames` and `programs` moved into `tests/e2e/lookdevReady.ts`. Flagged under AR248 (closest pattern: `lookdevReady.ts`).
  - **Deviation, `materials.spec.ts` P8:** it asserted that the only spots with a `level` are the three materials spots; every staging spot names `emberwood`, so P8 now lists the materials view's spots and still checks every spot's level is known. Every other materials check is unchanged.
  - **S2's first run failed at 1080** (measured 98.26 px against 101.05): the measured row ran through the dashed outline at both window edges, adding two false edges. The view now publishes the ruler row's ends 4 px inside the outline. Measured since: **101.056 px against `--tile` 101.053 at 1920 × 1080, and 67.333 against 67.368 at 1280 × 720**, 19 edges each.
  - All 24 staging checks pass (S1 ×3, S2 ×2, S3 ×8, S6 ×8, S4, S5, S7).
- **Throwaways** (each reverted, `cmp` against a scratchpad copy):
  - **F1:** `createViewCamera` framed with 31° while the camera kept 30°: `make test` failed Test 4 at all four shapes, and the coverage test.
  - **F2:** `margin: 0.5` with the camera framing no margin: S2 failed at both sizes (measured 101.06 against `--tile` 94.74 at 1080; 67.33 against 63.16 at 720).
  - **F3:** one foreground plant raised 3 tiles: S6 failed at every pan-0 spot and passed at pan 4, where that plant sits outside the box.
- **T9:** README gained the staging view (one clause). The style guide's §2 Camera and §10 were written after the sign-off (below). Margin 0, so AC8 (the DESIGN.md note and the `overlay.test.ts` change) doesn't apply.
- **T10, first pass:** `make check` exit 0 (402 tests); `make smoke` 3 passed, 1 skipped (by design); the budget sheet unchanged from 0.9 (code 878 bytes, 8 files). A grep of `dist/` for `aspect must be positive and finite`, `is not in front of the camera`, `stage-far`, `createStagingLookdevScene` and `lookdev-staging` finds nothing.
- **T11, critic round 18** (`shots/round-18/`; 66 look-dev checks, 17 shots). Opened: 1080 at both pans, 4:3 pan 0, 21:9 pan 4. The box was fully on screen in each; 4:3 showed extra rows and 21:9 extra width, with no layer edge; the foreground showed only at 4:3, below the box. Compared with `emberwood-key-art-mix.jpeg`:
  1. **The pan step aliased with the repeating shapes.** Posts stood every 4 tiles and ruler cells every 2, so a 4-tile pan put the play layer exactly where it was; the trunks (every 3 drawn tiles, moving about 2.85) seemed to swap heights rather than move. The parallax couldn't be read between the two shots. **Fix:** uneven gaps and widths in every layer; the second pan is 3 tiles (`PAN_SPOT_TILES` and `spots.ts`), not a multiple of the ruler's period.
  2. **The far ridge read as a near wall:** a solid, lighter band from the ground to mid-screen, about half the frame. In the key art the far distance is a low band of misty shapes with the sky glow above it. **Fix:** `RIDGE.baseY` 3.5 → 1.5, shorter teeth of varied widths.
  3. **The middle trunks read as a fence:** one width, two heights, flat tops inside the frame. **Fix:** varied widths, running off the top of the frame, as the key art's trees do.
  - Not fixed (D4, the developer's choice): the key art frames its corners with dark foreground; under the strict box the foreground shows only at 4:3.
- **Round 19** (`shots/round-19/`; 66 checks, 17 shots). Opened: 1080 at both pans, 4:3 pan 3, 21:9 pan 0. Between pan 0 and pan 3 the posts move 303 px (3 tiles at 101.05 px), the trunks about 216 px, the ridge about 108 px, and the ruler's alternation flips: the parallax reads, far least, then middle, then play. The ridge sits low with sky above it; the trunks run out of the frame. Remaining problems, none within this story's tunables, so the loop stopped at two rounds:
  1. Above the ridge the trunks almost vanish against the sky: `treeMid #28444D` against `skyFar #254049`; fog at depth 8 is about 3 % in Emberwood, so moving the layer won't help. The key art reads through its bright sky glow behind the trees. Palette (the developer's) or test-scene staging (story 0.12).
  2. The foreground placeholders read as black boxes: framing placeholders; plant shapes are 0.12's.
  3. Foreground only at 4:3 (D4), raised again at sign-off.
- **The other spots against round 17:** the overlay, renderer, palettes, type and Harrowmere materials shots are pixel-identical. The Emberwood and Drowned Mill materials shots differ by 199 pixels each, all in the top-left 409 × 228 corner (the label column's text). It is run-to-run noise from before this story: the same 199 pixels differ between rounds 16 and 17, and between 17 and 18 for one level but not the other.
- **Sign-off (AskUserQuestion, 2026-11-14),** after the round 18 and round 19 staging shots were sent (SendUserFile): the developer locked a vertical field of view of 30° and a margin of 0, locked the layer depths (far −36, middle −8, play 0, foreground +3), and kept the foreground question for Epic 3. The comments in `config.ts` and `stage.ts`, and the style guide's §2 Camera and §10, record it.
- **Final runs** (after the sign-off edits, which changed comments and docs only, so round 19 stands for `make shots`):
  - `make check`: exit 0, 17 test files, **402 tests** (365 before this story);
  - `make smoke`: 3 passed, 1 skipped (by design); the budget sheet unchanged (878 bytes, 8 files);
  - `make shots ROUND=19`: **66 look-dev checks** (42 before) and **17 shots** (9 before);
  - the `dist/` grep: nothing.

### Completion Notes List

- **Code review fixes (2026-11-14),** after the developer chose option 1 for the decision and to apply every patch:
  - **Any window shape:** the plants' tops sit at the box's bottom edge less the clearance. A foreground point is pushed away from the centre by D / (D − z) > 1 at every camera distance, so they stay clear at any shape. At 4:3 about two-thirds of a tile of foreground now shows, down from about 1.9.
    - The layers cover 9:16 to 32:9 (`COVERED_ASPECTS`); a fixed pan is clamped to ±`PAN_RANGE_TILES`.
    - The scene checks its plants with `foregroundIntruders` at every covered shape and both pan extremes, and refuses to start (`invariant`) if one covers the box. That gives the helper a real caller.
  - **Checks:**
    - S3 checks that each spot's `panTiles` reached the camera (`data-pan`).
    - A new pixel check at the two 4:3 spots finds no `foregroundDark` pixel just inside the box's bottom edge, and finds some at the window's bottom row, so the colour test can see plants.
    - S7 checks that every spot's shape is in `STAGING_ASPECTS`.
    - 68 look-dev checks.
  - **Throwaways** (reverted, `cmp`-checked):
    - plants raised 1.5 tiles with the self-check bypassed: the pixel check failed at both 4:3 spots;
    - the same raise with the self-check on: the view refused to start in every level ("a staging plant covers the logical view at aspect 0.563, pan -6").
  - **The view:**
    - the box caption gives its size, "Logical view 19 × 10.4 tiles" (AC12), from a new `boxTiles` in the layout;
    - the canvas rectangle is read on resize only;
    - the outline is laid out only when size, level or pan change, and only every 15 frames while the camera sweeps.
  - **Unit tests:**
    - 16:9 width-limited at margin 0 is pinned;
    - `frame()` refuses a non-finite centre (a new `invariant`, its message built only on failure);
    - the two assertions that couldn't fail are gone;
    - 404 tests.
  - **`rowAt`** throws a clear error for an inverted range.
  - **Critic round 20** (`shots/round-20/`; 68 checks, 17 shots): **all eight staging shots opened**.
    - The 720 shots frame as the 1080 ones.
    - At 4:3 the plants sit lower and clear, and between pan 0 and pan 3 they move about 258 px against the posts' 227 px: the foreground moves most, judged for the first time.
    - The other spots are pixel-identical to round 19.
  - **Records corrected:**
    - **F3 ran before the second pan changed from 4 to 3** (critic round 18), so "passed at pan 4" was that run's pan.
    - Undeclared small deviations, now declared:
      - `buildLevelPicker(levels, onPick)` takes no `current` (the caller calls `setCurrent`), and its URL helper is `replaceLevelInUrl`;
      - `coverageNeeded(z, { aspects, panRange, centreY, view? })` takes an options object;
      - `viewFraming` and `createViewCamera` take an optional `view` (for the margin test);
      - the ruler's slots are in `layout().ruler.slots`, and `RULER_SLOTS` is exported for the check.
  - **Final runs:**
    - `make check` exit 0 (404 tests);
    - `make smoke` 3 passed, 1 skipped, with the budget sheet unchanged (878 bytes, 8 files);
    - `make shots ROUND=20`, 68 checks and 17 shots;
    - the `dist/` grep: nothing.

- **The view camera (AC1–AC5, AC14):** `src/render/viewCamera.ts`. `frameBox` is the pure framing: the field of view is fixed, and the camera's distance follows the window's shape so the box fills its limiting axis (D2). `viewFraming` applies it to `CONFIG.view` and its margin, `tilePx` gives pixels per tile, and `createViewCamera()` returns a perspective camera with `frame(centreX, centreY, aspect)`, which allocates nothing and is ready for Epic 1's interpolated simulation camera. `CONFIG.view.fovDeg` is 30 (vertical). Tested at 16:9, 1280 × 720, 4:3 and 21:9, and against three's own `getViewSize`.
- **The margin and `--tile` (AC6–AC8):** margin 0, locked by the developer. The staging check measures the on-screen tile from a ruler of 1-tile cells in the rendered pixels and compares it with `--tile` read from the overlay root: 101.056 px against 101.053 at 1080, 67.333 against 67.368 at 720. DESIGN.md needs no change.
- **The stage (AC9–AC11, AC13):** `src/render/stage.ts`. `createStage(palette, rig)` holds four named layers at `STAGE_LAYERS`' depths (far −36, middle −8, play 0, foreground +3) and the level's look; `applyLevel` swaps the palette and rig only. Pure helpers: `projectToPlayPlane`, `visibleRectAt`, `logicalViewBox`, `foregroundIntruders` (the story's `foregroundClear`, renamed: it returns the pieces that break the rule) and `coverageNeeded`.
- **One framing everywhere (AC20, D10):** the empty and materials scenes use `viewCamera.ts`; the placeholder camera is gone. The materials shots match round 17 apart from known run-to-run text noise.
- **The staging view (AC12, AC13, AC15):** `src/lookdev/stagingView.ts`, built on `createStagingLookdevScene` in `lookdevScenes.ts`. It shows:
  - the four layers in backdrop-material placeholders (ridge, trunks, the ground with its tile ruler and posts, foreground plants), each covering every supported shape and pan;
  - the logical view as a dashed outline, from the scene's projected corners;
  - a sweeping pan, or a spot's fixed `panTiles`;
  - a side panel with the picker, the framing numbers and the statistics, hidden in spots.
  - Eight spots: four window shapes, each at pans 0 and 3.
- **Checks (AC16, AC17):** `tests/e2e/lookdev/staging.spec.ts`, 24 checks: S1 no error in any level; S2 `--tile` against the measured ruler; S3 the box on screen and limited by the right axis at every spot; S4 the in-place switch with no new program and the ruler in the new level's guide colours; S5 an unknown level; S6 the foreground clear of the box (and on screen at 4:3); S7 the spots. Three throwaways proved the new checks can fail.
- **Shared helpers:** `src/lookdev/levelPicker.ts` (the picker, for the materials and staging views), `levelLookOrThrow` in `levelLooks.ts`, `tests/e2e/pixels.ts`, `tests/e2e/styleGuidePalettes.ts`, and `waitFrames`/`programs` in `tests/e2e/lookdevReady.ts`.
- **Deviations from the story's text,** each recorded in the Debug Log:
  - `foregroundClear` is named `foregroundIntruders`;
  - the canvas host is `.lookdev-staging-canvas`, not `.lookdev-canvas-host`;
  - `materials.spec.ts` P8 lists the materials view's spots instead of every spot with a level, since the staging spots name a level too;
  - `stage.test.ts` was written first but not run red on its own;
  - the second pan is 3 tiles, not 4 (critic round 18).
- **The critic loop:** two rounds (18, 19), three problems fixed in round 18; round 19's remaining problems were outside this story (palette and 0.12 staging). The developer signed off on the framing, the margin and the depths.
- **For later stories:**
  - **0.11:** the outline pass skips the far layer, which sits at `STAGE_LAYERS.far`; a directional shadow's camera must cover the widest framing (`coverageNeeded` gives it).
  - **0.12:** builds on `createStage` and `createViewCamera`. To judge there: the trunks against the sky (palette, or a sky-glow shape in the far layer, as the key art has); the layer depths again; plant shapes for the foreground.
  - **Epic 1 (1.5, 1.8):** call `frame()` with the interpolated simulation camera's centre every frame. The game's level view must dispose level-only glows before `applyLevel`, as 0.9's warm rule requires.
  - **Epic 3:** whether level dressing may overlap the logical view away from the route (D4).
- **Proposed for `_bmad-output/project-context.md`** (the developer edits it; not edited here): "Over a canvas, an overlay root must be transparent: the look-dev overlay views give `.ui-overlay` a screen background."

### File List

- `src/render/viewCamera.ts` (new)
- `src/render/viewCamera.test.ts` (new)
- `src/render/stage.ts` (new)
- `src/render/stage.test.ts` (new)
- `src/lookdev/stagingView.ts` (new)
- `src/lookdev/levelPicker.ts` (new)
- `tests/e2e/lookdev/staging.spec.ts` (new)
- `tests/e2e/pixels.ts` (new)
- `tests/e2e/styleGuidePalettes.ts` (new)
- `src/sim/config.ts` (modified: `CONFIG.view.fovDeg`; the margin's comment records the lock)
- `src/render/lookdevScenes.ts` (modified: every scene framed by `viewCamera.ts`; `createStagingLookdevScene` and its layout constants)
- `src/lookdev/assetBrowser.ts` (modified: the staging view; `panTiles` in the mount options)
- `src/lookdev/main.ts` (modified: passes a spot's `panTiles`)
- `src/lookdev/spots.ts` (modified: `panTiles` field, eight staging spots)
- `src/lookdev/materialsView.ts` (modified: uses `levelPicker.ts` and `levelLookOrThrow`)
- `src/lookdev/levelLooks.ts` (modified: `levelLookOrThrow`)
- `src/lookdev/lookdev.css` (modified: the shared picker's class names; `lookdev-staging-*`; the transparent staging overlay root)
- `tests/e2e/lookdev/materials.spec.ts` (modified: imports the shared helpers; P8 lists the materials view's spots)
- `tests/e2e/lookdevReady.ts` (modified: `waitFrames`, `programs`)
- `docs/STYLE_GUIDE.md` (modified: §2 Camera, the locked framing and depths; §10 closes the camera item)
- `README.md` (modified: the look-dev page shows the staging view)
- `_bmad-output/implementation-artifacts/0-10-frame-the-play-plane-with-the-view-camera-and-the-depth-layers.md` (this story)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

## Change Log

- 2026-11-14: Story created (ready-for-dev). The developer chose D4 at creation: the play area is the logical-view box for now; whether level foreground may overlap it away from the route is Epic 3's.
- 2026-11-14: Story implemented.
  - Added: the view camera (`viewCamera.ts`) and the stage with its four depth layers (`stage.ts`); `CONFIG.view.fovDeg`; the look-dev staging view with a measured tile ruler; shared look-dev and test helpers.
  - Every look-dev scene is framed by the view camera; the placeholder camera is gone.
  - Tests: 37 new (402 in all); 24 new look-dev checks (66 in all); 8 new spots (17 in all). Three throwaways behaved as specified.
  - Two critic rounds (18, 19) fixed 3 problems. The developer locked a 30° field of view, a margin of 0 and the layer depths. Status set to review.
- 2026-11-14: Code review. 1 decision resolved (option 1: the staging view holds at any window shape); 12 patches applied, 0 deferred, 7 dismissed. 404 tests, 68 look-dev checks, critic round 20 with all eight staging shots opened. Status set to done.

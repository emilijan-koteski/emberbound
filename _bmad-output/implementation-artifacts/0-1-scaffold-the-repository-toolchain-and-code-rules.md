---
baseline_commit: 513cbd337a13e2993be00f1585e4d1aa6b22bcab
---

# Story 0.1: Scaffold the repository, toolchain and code rules

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the repository scaffolded on the pinned toolchain, with one Makefile front door, the layer boundaries enforced and logging in place,
so that every later story builds, tests, lints and logs the same way on any machine, and a layer violation fails before it is merged.

**Requirements:** NFR9, AR1–AR12, AR14–AR37, AR203–AR206, AR215–AR217, AR220, AR221, AR228, AR229, AR233, X-B20, X-B33, X-B36, X-B37
**Epic:** 0, Reference and style lock. This is its first story; no earlier story exists.

## Acceptance Criteria

### Scaffold

- **AC1.** `mise.toml` pins Node 26.13 at an exact patch, and git-lfs at an exact version. mise's registry has git-lfs (`aqua:git-lfs/git-lfs`, seen with `mise registry` on 2026-11-13), so it goes in `mise.toml`, not the README.
- **AC2.** Vite's `vanilla-ts` template is generated with the pinned Node into a temporary folder outside the repository, from `create-vite` at an exact version, and its `package.json`, `tsconfig.json`, `index.html` and `src/` are moved into the repository root.
- **AC3.** The template's demo code, styles and images are removed, and `src/main.ts` boots an empty game page.
- **AC4.** `.gitignore` adds `mise.local.toml`, `shots/`, `public/assets/levels/` and `public/assets/manifest.json`. Existing entries stay.

### Dependencies

- **AC5.** `package.json` pins exact versions, with no ranges, of: `three` 0.187.x with `@types/three` at the matching version; Vite 8.3.x at 8.3.7 or later (raised from 8.3.3 for advisory GHSA-p4f5-76q4-ffq7); TypeScript 6.0.x; ESLint 10.x; typescript-eslint 8.72.x; Prettier 3.x; `@gltf-transform/cli` 4.5.x; `@types/node` for Node 26; Vitest 5.x; `@playwright/test` 1.65.x. Each is the newest patch at least two weeks old on the day, checked against the registry. Exceptions are a security fix and a named line with no release that old; each is recorded with its reason (see Pinned Versions).
- **AC6.** `package-lock.json` is committed with the rest.
- **AC7.** typescript-eslint's peer range is confirmed to cover the installed ESLint 10. If it doesn't, the story stops and the developer decides; neither version changes silently.
- **AC8.** Nothing outside that list is added. If the flat config needs a package such as `@eslint/js` or `globals`, the developer is asked first. (`yaml` is in the architecture's Toolchain table but is added by story 0.3, not here.)

### Makefile

- **AC9.** `make` with no target runs `make help`, which lists every target with one line each.
- **AC10.** The targets are `help`, `setup` (`mise install`, `npm ci`, Playwright's Chromium and Firefox), `dev`, `test`, `test-watch`, `smoke`, `lint`, `format`, `typecheck`, `check`, `build`, `preview` and `clean`. The Makefile's header lists the targets left for later stories: `shots` (story 0.6), `levels` and the Tiled check in `setup` (Epic 1), `models` (Epic 2), `release` (Epic 6).
- **AC11.** Every target runs with the mise-pinned tools, through `mise exec --` or an activated shell. The choice is made after reading mise's current documentation and recorded, with the reason, in the Makefile's header.
- **AC12.** `make test` runs every Node test layer that exists, once (default X-B36). `make check` runs lint, `prettier --check`, the type check and `make test`. `make build` runs the type check, the tests and the Vite build. `make preview` serves `dist/`. `make clean` removes build output and tool caches.

### Type check

- **AC13.** `make typecheck` runs `tsc --noEmit` on the root project, then on `src/sim/tsconfig.json`. `scripts/` and `tests/` are type-checked too.
- **AC14.** Both projects are strict and set `allowImportingTsExtensions`, `verbatimModuleSyntax` and `erasableSyntaxOnly`.
- **AC15.** The root project excludes `src/sim/**`, and the simulation project is checked on its own. The simulation project's `lib` has no DOM and it loads no Node types (default X-B37). The epic says the root "references" the simulation project; TypeScript project references can't be type-checked with `tsc --noEmit`, so the two projects are independent (see TypeScript Projects, D12).
- **AC16.** A throwaway file in `src/sim/` that uses `document` or `window` fails `make typecheck`, and so does an `enum` anywhere. The files are removed and the run is noted in this story.

### Lint

- **AC17.** `eslint.config.js` (flat config) builds on typescript-eslint's `strictTypeChecked`. Import restrictions are set per folder to the architecture's boundary table for `core/`, `sim/`, `content/`, `platform/`, `input/`, `app/`, `render/`, `render/materials/`, `audio/`, `ui/`, `debug/`, `lookdev/` and `scripts/`. `ShaderMaterial`, `RawShaderMaterial` and three.js post-processing imports are banned outside `render/materials/`.
- **AC18.** `consistent-type-imports`, `no-explicit-any`, `switch-exhaustiveness-check` and `no-floating-promises` are on. `no-console` is on everywhere except `src/core/log.ts`. `src/sim/**` bans `Math.random`, `Math.sin`, `Math.cos`, `Date` and `performance`.
- **AC19.** `make lint` reports a throwaway file for each rule, for example `sim/` importing `three`, `ui/` importing `render/`, `render/` importing `ShaderMaterial` outside `materials/`, `Math.random` in `sim/`, `console.log` outside `core/log.ts`. The files are removed and the run is noted in this story.

### Format, test, build, smoke

- **AC20.** Prettier formats code and config with the project's config, and ignores `_bmad/`, `_bmad-output/`, `prototype/` and generated output.
- **AC21.** Vitest's config sits in `vite.config.ts`. It runs in Node only, with no DOM environment, and finds tests beside the code in `src/` and `scripts/` and under `tests/levels/`. Playwright specs live in `tests/e2e/`.
- **AC22.** `vite build` uses `base: './'` and hashed asset names, so every URL in `dist/` is relative.
- **AC23.** `make smoke` runs one spec in headless Chromium and Firefox that opens the production build served by `make preview` (default X-B20) and fails on any console error. Epic 6 extends it to the full smoke checks.

### Logging

- **AC24.** Each line from `src/core/log.ts` is `[channel] message` plus an optional data object. Levels are `error`, `warn`, `info` and `debug`. Channels are the fixed union `loop`, `app`, `sim-host`, `render`, `audio`, `input`, `save`, `assets`, `ui`. Output goes to the browser or Node console only.
- **AC25.** `warnOnce` writes a given key once per session.
- **AC26.** The level filter comes from a setter that `main.ts` calls: everything in development builds, `warn` and `error` only in release builds. Node scripts that import `core/` get the default, everything (default X-B33).
- **AC27.** Vitest tests in Node cover the line format, the filter and `warnOnce`.

### Git LFS, README, clean clone

- **AC28.** `art-src/**`, `*.glb`, `*.blend`, `*.fbx`, `*.obj`, `*.png`, `*.jpg`, `*.webp`, `*.psd`, `*.kra`, `*.wav`, `*.flac`, `*.ogg`, `*.mp3`, `*.m4a`, `*.woff2` and `*.ttf` go to Git LFS. Code, JSON, `.tmj` and `.tsj` stay in plain git. Both are checked with `git check-attr` on a sample path of each.
- **AC29.** Before the first file matching those patterns is committed, the developer checks GitHub's current LFS storage and bandwidth quota and runs `git lfs install`. The quota and the date are noted in this story.
- **AC30.** `README.md` says how to start (`git lfs install`, `mise install`, `make setup`, `make dev`, `make check`) and lists the prerequisites. It states the version policy: exact pins; the newest patch at least two weeks old; a three.js upgrade, or the move to TypeScript 7, is a story of its own; no dependency without the developer; any service runs in Docker through a committed `docker compose` file (version one needs none).
- **AC31.** `make setup`, `make check` and `make build` pass on a clean clone.

## Tasks / Subtasks

- [x] **T1. Pin the toolchain** (AC 1, 11)
  - [x] Read mise's current docs on `mise.toml`, `mise exec` and `mise trust` (see Latest Technical Information) before writing anything.
  - [x] Write `mise.toml` with `[tools]` `node = "26.13.1"` and `git-lfs = "3.8.1"` (re-check both; see Pinned Versions). Run `mise trust` if mise asks, then `mise install`. Check `mise exec -- node --version` (v26.13.1, not the global v24.18.0) and `mise exec -- git-lfs version`.
- [x] **T2. Generate and move the template** (AC 2, 3, 4)
  - [x] Generate `vanilla-ts` into a fresh temporary folder outside the repository (`mktemp -d`), with the pinned Node and `create-vite@<exact>`: `mise exec -- npm create vite@9.3.3 <tmp>/app -- --template vanilla-ts`. Check `npm create vite@9.3.3 -- --help` for the flag that skips its interactive prompts and its "install and start now?" step. Never let it install dependencies or start a server. If the generated files differ from the list in Latest Technical Information, note the difference.
  - [x] Move only `package.json`, `tsconfig.json`, `index.html` and `src/` into the root. Do not move the template's `.gitignore`, `public/` or `README.md`. Delete the temporary folder.
  - [x] Delete the demo files (`counter.ts`, `style.css`, `src/assets/`) and the template's favicon link. Write the empty game page (see Empty Game Page).
  - [x] Add the four `.gitignore` entries, plus `.vitest/` (D22).
- [x] **T3. Pin the dependencies** (AC 5–8)
  - [x] For each package, run `npm view <pkg> time --json` and take the newest patch in its allowed line that is at least 14 days old on the day. Record the version and its publish date in the Dev Agent Record.
  - [x] Check `npm view typescript-eslint@<v> peerDependencies`: `eslint` must cover 10.x and `typescript` must cover 6.0.x. **Stop and ask if either doesn't.**
  - [x] Write exact versions (no `^` or `~`) in `package.json`: `three` under `dependencies`, the rest under `devDependencies`. Replace the template's `typescript ~7.0.2` and `vite ^8.3.6`; both are wrong for this project. Set `"private": true`, `"type": "module"`, `"name": "emberbound"`, and `"engines": { "node": "26.13.1" }` (documentation only; mise enforces it). Remove the template's npm scripts (the Makefile is the only entry point).
  - [x] Add `.npmrc` with `save-exact=true`, so a later `npm install <pkg>` can't write a range. Run `mise exec -- npm install` once to create `package-lock.json`. This is the one raw npm call this story makes, before the Makefile exists. Confirm with `mise exec -- npm ls --depth=0` that the top level is exactly the 11 packages in Pinned Versions, and that `npm ls typescript` shows only 6.0.3.
- [x] **T4. Write the Makefile** (AC 9–12)
  - [x] Header comment: what the file is, the `mise exec` decision with its reason, and the later targets with their stories.
  - [x] Write the 13 targets (see Makefile). Make `help` the default goal and generate its list from `## ` comments.
- [x] **T5. TypeScript projects** (AC 13–16)
  - [x] Root `tsconfig.json`, `src/sim/tsconfig.json` and `src/sim/config.ts` (see TypeScript Projects).
  - [x] Run `make typecheck`. Then run the throwaway checks T5a, T5b and T5c from the table below, record them, and delete the files.
- [x] **T6. ESLint boundaries** (AC 17–19)
  - [x] Write `eslint.config.js` (see ESLint). Generate the per-folder restrictions from one `LAYERS` table that mirrors the architecture's boundary table.
  - [x] Run `make lint` clean. Then run every throwaway lint check (L1–L19 below), including the must-pass ones, record them, and delete the files.
- [x] **T7. Prettier** (AC 20)
  - [x] Write `.prettierrc.json` and `.prettierignore` (see Prettier). Run `make format`, then `make check`, and confirm no file under `_bmad/`, `_bmad-output/`, `.claude/`, `prototype/` or `docs/` changed (`git status`).
- [x] **T8. Logging** (AC 24–27)
  - [x] Write `src/core/log.ts` and `src/core/log.test.ts` (see core/log.ts). `main.ts` calls the setter.
  - [x] Check that Node can import it without Vite: `mise exec -- node --input-type=module -e "const { log } = await import('./src/core/log.ts'); log.debug('app', 'node import ok')"` prints `[app] node import ok`.
- [x] **T9. Vite, Vitest, Playwright** (AC 21–23)
  - [x] Write `vite.config.ts` with the Vitest block, and `playwright.config.ts` (see Vite and Vitest, and Playwright).
  - [x] Write `tests/e2e/smoke.spec.ts` (see Playwright).
  - [x] Run `make build`, then check `dist/index.html` for relative URLs (`./assets/…-<hash>.js`, no `src="/`). Then run `make smoke` in both browsers, then throwaway S1. Afterwards confirm nothing still listens on 4173.
- [x] **T10. Git LFS and README** (AC 28–30)
  - [x] Write `.gitattributes` (see Git LFS). Run `git check-attr filter diff merge -- <path>` for one sample path per pattern and for `src/main.ts`, `package.json`, `levels/emberwood.tmj` and `levels/tilesets/collision.tsj`, then record the output.
  - [x] Re-check GitHub's documented LFS quota (pre-filled under Git LFS below; the page is in References) and copy the numbers, the date and the URL into the Dev Agent Record. Running `git lfs install` is the developer's step; remind him in the completion notes.
  - [x] Replace the one-line `README.md` (see README).
- [x] **T11. Clean-clone check and finish** (AC 31)
  - [x] Copy what a commit would contain (`git ls-files -co --exclude-standard`) into a fresh temporary folder, `git init` it, and run `make setup`, `make check` and `make build` there. Record the results. Delete the folder.
  - [x] Run `make check` and `make build` in the repository one last time. Fill in the Dev Agent Record (versions, throwaway runs, LFS quota, decisions), then set Status to `review`.
  - [x] Do not commit. The developer commits on `master` when he asks.

### Throwaway checks (create, run, record the output, delete)

| # | File (all deleted afterwards) | Content | Expected |
| --- | --- | --- | --- |
| T5a | `src/sim/zzDom.ts` | `export const w = window.innerWidth;` and `document.title` | `make typecheck` fails in the sim project |
| T5b | `src/core/zzEnum.ts` and `src/sim/zzEnum.ts` | `export enum Zz { A }` | `make typecheck` fails in both projects (`erasableSyntaxOnly`). Create them one at a time, since the first failure stops the target |
| T5c | `src/sim/zz.test.ts` | `import { it } from 'vitest'; it('zz', () => {});` | **passes** `make typecheck` (sim tests type-check without DOM) |
| S1 | `src/main.ts` (temporary line) | `console.error('smoke-check')` | `make smoke` fails in both browsers; line removed |
| L1 | `src/sim/zzThree.ts` | `import { Vector3 } from 'three';` | `make lint` reports it |
| L2 | `src/ui/zzRender.ts` | `import '../render/zz.ts';` (any path into `render/`) | reported |
| L3 | `src/render/zzShader.ts` | `import { ShaderMaterial } from 'three';` | reported |
| L4 | `src/render/zzPost.ts` | `import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';` | reported |
| L5 | `src/sim/zzRandom.ts` | `Math.random()`, `Math.sin(1)`, `new Date()`, `performance.now()` | four reports |
| L6 | `src/app/zzConsole.ts` | `console.log('x')` | reported |
| L7 | `src/ui/zzSimValue.ts` | value import from `../sim/world.ts` (any non-config sim file) | reported |
| L8 | `src/ui/zzSimType.ts` | `import type { X } from '../sim/zz.ts'` plus a value import from `../sim/config.ts` | **passes** (types from `sim/`, values from `config.ts` are allowed) |
| L9 | `src/render/materials/zzOk.ts` | `import { ShaderMaterial } from 'three';` | **passes** |
| L10 | `src/core/zzImport.ts` | an import from `../sim/…` | reported (`core/` imports nothing) |
| L11 | `src/app/zzDebug.ts` | an import from `../debug/…` | reported |
| L12 | `src/lookdev/zzSim.ts` | an import from `../sim/…` | reported |
| L13 | `scripts/zzRender.ts` | an import from `../src/render/…` | reported |
| L14 | `src/sim/zzAny.ts` | `export function f(x: any) {}` and a `switch` missing a case on a string union, and an un-awaited promise | `no-explicit-any`, `switch-exhaustiveness-check`, `no-floating-promises` each report |
| L15 | `src/app/zzInputValue.ts` | a value import from `../input/…`, and a separate `import type` from it | the value import is reported; the type import passes |
| L16 | `src/render/zzWebgpu.ts` | `import { WebGPURenderer } from 'three/webgpu';` | reported |
| L17 | `src/ui/zzInlineType.ts` | `import { type X } from '../app/zz.ts';` | reported (`no-import-type-side-effects`; `--fix` turns it into `import type`) |
| L18 | `src/render/materials/zzSibling.ts` | an import from `../stage.ts` | reported (`materials/` takes only `palettes/` and `lighting/` from `render/`) |
| L19 | `src/content/zzProcess.ts` | `process.env.X` | reported (`no-restricted-globals`) |

Imports of files that don't exist are fine for lint (the rules match the import string). For the type-only and type-check cases, create the target files too, and delete them afterwards.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor).

- [x] [Review][Decision] Determinism bans in `sim/` stop at the AC18 list — resolved 2026-11-14: keep AC18 as written; dismissed.
- [x] [Review][Patch] Dynamic `import()` and `import('x').T` type queries bypass every layer ban — decided 2026-11-14: in `core/`, `sim/` and `content/`, ban `ImportExpression` and `TSImportType` outright with `no-restricted-syntax` [eslint.config.js:190]
- [x] [Review][Patch] `.gitattributes`: add `* text=auto eol=lf` and LFS patterns for `*.jpeg`, the upper-case variants, `*.ktx2`, `*.hdr`, `*.exr`, `*.tga`, `*.otf`, `*.bin`, `*.mp4` and `*.webm` — decided 2026-11-14: add now; re-run `git check-attr` and confirm the 6 committed PNGs stay unmodified [.gitattributes:1]
- [x] [Review][Patch] AC29: record it as carried over to the first story that commits an LFS file (0.4 or 0.8), where the developer's billing-page quota check happens — decided 2026-11-14 [story file, Dev Agent Record]
- [x] [Review][Patch] ESLint applies no shader, three.js or Node-global bans to `src/` files outside the listed layers (for example `src/foo.ts` or `src/newfolder/x.ts`), against AC17 and the Dev Notes; add a catch-all `src/**` entry [eslint.config.js:146]
- [x] [Review][Patch] The boundary regexes miss bare-folder imports (`'../render'` passes in `sim/`, because `seg()` needs a trailing `/`) and `./../` paths (`./../x.ts` escapes `core/`) [eslint.config.js:12]
- [x] [Review][Patch] `warnOnce` marks the key as seen even when the level filter drops the warning, so the warning never appears after `setLevel` lowers the filter; add a test [src/core/log.ts:61]
- [x] [Review][Patch] `warnOnce` keys are global, not per channel, so the same key on two channels drops the second warning; key on `${channel}:${key}` and add a test [src/core/log.ts:62]
- [x] [Review][Patch] `setLevel` with an unknown runtime value (from JS or a URL parameter) sets `maxSeverity` to `undefined`, which disables filtering; ignore or reject unknown levels and add a test [src/core/log.ts:66]
- [x] [Review][Patch] Port 4173 is hard-coded in `playwright.config.ts` as well as the Makefile, so `make smoke PREVIEW_PORT=5000` times out; take the port from the environment [playwright.config.ts:9]
- [x] [Review][Patch] The smoke test misses failed asset requests (404s are not always console errors in Firefox); fail on `requestfailed` and on responses with status 400 or higher [tests/e2e/smoke.spec.ts:12]
- [x] [Review][Patch] The README's version policy says each exception is recorded "where the version is pinned", which is false for Vite and Playwright (`package.json` can't hold comments). It also narrows the second exception to "the only release" of a line, where AC5 covers any named line with no release that old [README.md:35]
- [x] [Review][Patch] The Dev Agent Record is inaccurate. The completion notes call `git lfs install` a pending developer step, while the Debug Log says it ran on 2026-11-14. They claim "all 31 acceptance criteria" while AC29 is pending. They don't disclose that `create-vite -C` put the template inside the repository (`app/`), which deviates from AC2 [story file:708]
- [x] [Review][Patch] AC31's evidence is incomplete: `make setup` and `make build` ran only on a copy without `_bmad/` and `.claude/`, which are tracked. Re-run T11 on the full `git ls-files -co --exclude-standard` copy and record it [story file, Debug Log T11]
- [x] [Review][Patch] `make build` didn't lint, so `make release` (story 6.21, which runs `make build`) could ship a layer violation — revisited 2026-11-14: `build` now runs `make lint` first. CI and a pre-push hook were dropped, not deferred: the project has one developer, CLAUDE.md requires `make check`, and git-lfs owns the pre-push hook [Makefile:72]
- [x] [Review][Patch] The root tsconfig gives Node types to browser code — revisited 2026-11-14: ESLint bans Node built-in modules (`node:*` and bare names, from `builtinModules`) and the globals `process`, `Buffer`, `global`, `require`, `__dirname`, `__filename` and `setImmediate` in every non-Node layer [eslint.config.js]
- [x] [Review][Patch] `render/materials/` could re-enter `render/` through `../../render/stage.ts` — revisited 2026-11-14: a second pattern bans `render/` paths other than `palettes/`, `lighting/` and `materials/` [eslint.config.js:119]
- [x] [Review][Dismiss] Freeze `CONFIG` at runtime — removed 2026-11-14: the architecture decides "nothing frozen at runtime" (AR58); the shape comes from the fields when story 0.6 adds them
- [x] [Review][Dismiss] npm `engine-strict` and a `packageManager` pin — removed 2026-11-14: every npm call goes through `make`, which goes through mise's pinned Node

## Dev Notes

### Scope

**In this story:** `mise.toml`, the template moved in, `package.json` and its lockfile, `.npmrc`, the `Makefile`, `tsconfig.json`, `src/sim/tsconfig.json`, `src/sim/config.ts` (an empty `CONFIG`, D13), `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `vite.config.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`, `src/main.ts`, `index.html`, `src/core/log.ts` and its test, `.gitattributes`, `.gitignore` additions, `README.md`.

**Not in this story (don't build ahead):**

- The budget checker in `make build`: story 0.2. The level compile and the manifest steps: Epic 1.
- `yaml`, DESIGN.md tokens and `base.css`: story 0.3.
- `lookdev.html`, `src/lookdev/`, `make shots`, `tests/e2e/lookdev/`: story 0.6. Vite's look-dev exclusion is configured there, not here.
- `CONFIG.view` and any other field in `src/sim/config.ts`: story 0.6. The rest of `sim/`: Epic 1.
- `core/result.ts`, `invariant.ts`, `deepReadonly.ts`, `assertNever.ts`, `uiTimings.ts`, `loading.ts`, and `platform/`: Epic 1.
- Empty layer folders. Don't create them or add `.gitkeep` files; the ESLint globs work whether a folder exists or not.
- `docs/ASSETS.md`: story 0.4 creates it. This story adds no asset, so nothing is logged.

### Previous work

This is the first implementation story; there's no previous story file. The last five commits are planning only: sprint status, tool choices, the readiness report and its correct-course, epics and stories, and UX folded into the GDD and architecture. No code, config or test pattern exists yet. This story sets the patterns every later story copies, so keep them plain and conventional.

### Current repository state (read before changing anything)

- **Exists and must be kept:** `CLAUDE.md`, `docs/PROJECT_BRIEF.md`, `prototype/sprout-demo.html`, `_bmad/`, `_bmad-output/`, `.claude/` (BMad skills: 367 `.md`, 23 `.py`, and `.toml`, `.yaml`, `.csv`, `.json`, `.html` files), `.gitignore` (secrets, Node, Playwright, `.playwright-mcp/`, Blender backups, Claude personal settings, OS clutter).
- **Replaced:** `README.md` (currently just `# emberbound`).
- **No code exists:** no `package.json`, no `src/`, no `.gitattributes`.
- **Machine (checked 2026-11-13):** mise 2026.11.7, global Node 24.18.0 (set in `~/.config/mise/config.toml`; the project's `mise.toml` overrides it inside the repository), npm 11.16, GNU Make 4.4.1, Docker 29.9, Blender 5.2.3. **git-lfs is not installed**; it comes from `mise.toml`. Tiled isn't installed (Epic 1's concern). The OS is CachyOS (Arch-based); the login shell is fish.
- **Already-committed PNGs:** `_bmad-output/planning-artifacts/ux-designs/…` holds 6 PNGs in plain git. Once `.gitattributes` exists, don't run `git add --renormalize` or `git lfs migrate`: the first rewrites them into LFS and the second rewrites history. If `git status` shows them modified after `.gitattributes` lands, leave them unstaged and tell the developer.

### Pinned versions

Candidates as of 2026-11-13. **Re-check on the day** with `npm view <pkg> time --json`: the rule is the newest patch in the allowed line that is **at least 14 days old**.

| Package | Line | Candidate on 2026-11-13 | Published | Where |
| --- | --- | --- | --- | --- |
| `three` | 0.187.x | 0.187.0 | 2026-10-30 | `dependencies` |
| `@types/three` | match three | 0.187.0 | 2026-10-30 | dev |
| `typescript` | 6.0.x | 6.0.3 | 2026-04-16 | dev. **Not 7.x** (7.0.2 exists; typescript-eslint can't run on it) |
| `eslint` | 10.x | 10.14.0 | 2026-10-30 | dev. 10.15.0 (2026-11-13) is too new |
| `typescript-eslint` | 8.72.x | 8.72.1 | 2026-10-26 | dev. 8.72.2 (11-09) is too new. Peers: `eslint ^8.57 \|\| ^9 \|\| ^10`, `typescript >=4.8.4 <6.1.0` (checked) |
| `prettier` | 3.x | 3.9.10 | 2026-10-10 | dev. 3.10.0 and 3.10.1 (11-11, 11-12) are too new |
| `@gltf-transform/cli` | 4.5.x | 4.5.1 | 2026-09-28 | dev |
| `@types/node` | 26.x | 26.6.6 | 2026-10-28 | dev |
| `vite` | 8.3.x, **≥ 8.3.7** | **8.3.8** | 2026-11-11 | dev. **Security exception, see below** |
| `vitest` | 5.x | 5.0.5 | 2026-10-15 | dev. 5.1.0 (11-02) is too new |
| `@playwright/test` | 1.65.x | **1.65.0** | 2026-11-05 | dev. **Line exception, see below**. Not 1.65.1 (published 11-13) |
| `create-vite` | exact (scaffold only, not installed) | 9.3.3 | 2026-10-27 | run once through `npm create vite@9.3.3` |
| Node (mise) | 26.13.x | **26.13.1** | 2026-11-10 | `mise.toml`. **Security exception, see below**. Write `"26.13.1"`; mise rejects `"26.13.x"` |
| git-lfs (mise) | exact | 3.8.1 | 2026-10-22 | `mise.toml`, as `git-lfs = "3.8.1"` |

**Exceptions to the 14-day rule (approved by the developer on 2026-11-13, at story creation):**

- **Vite (Q1).** GHSA-p4f5-76q4-ffq7 is a *critical* remote-code-execution flaw in Vite 8.3.0–8.3.6, fixed in 8.3.7 (8.3.7 published 2026-11-09; advisory published 2026-11-10). It is exploitable only when the dev server is exposed with `--host` or `server.host`. The newest 8.3.x that is 14 days old (8.3.5) is affected, so a security fix overrides the age rule: pin 8.3.8. Whichever version is pinned, `make dev` never uses `--host`. 8.3.7 reaches 14 days on 2026-11-23.
- **Node (Q1).** 26.13.1 is a security release. Same rule: take it. 26.13.0 (2026-10-28) meets the rule if security releases are not exempted.
- **Playwright (Q2).** The 1.65 line every document names has one release, 1.65.0, and it is 8 days old. It reaches 14 days on 2026-11-19; after that, there's no exception.
- Record each exception and its reason in the Dev Agent Record, and add the security rule to the README's version policy.

**Never** run a bare `npm install typescript` or `npm install -D typescript`. npm's `latest` for TypeScript is **7.0.2**, and create-vite's template asks for `~7.0.2`, but typescript-eslint 8.72 only supports TypeScript below 6.1. Always pin `typescript@6.0.3`.

`@types/three` 0.187.0 pulls in its own dependencies (`@types/webxr`, `meshoptimizer`, `fflate`, `@tweenjs/tween.js`, `@types/stats.js`, `@dimforge/rapier3d-compat`). These are transitive and types-only, not project dependencies, and need no approval. Vitest 5.0.5 lists optional peers (`jsdom`, `happy-dom`, `@vitest/browser-*` and others). None may be installed; `npm ls --depth=0` must not show them.

### Latest technical information (checked 2026-11-13; sources in References)

- **TypeScript 6.0** changed several defaults:
  - `strict` is `true`, `module` is `esnext`, and `moduleResolution` is `bundler`.
  - `target` floats to the newest edition (es2025).
  - **`types` is `[]`**, so no `@types` package loads unless it is listed.
  - **`noUncheckedSideEffectImports` is `true`**.
  - `baseUrl`, `moduleResolution: node10`, `target: es5`, `downlevelIteration` and `esModuleInterop: false` are deprecated (error TS5101/TS5107). Don't use them.
  - `allowImportingTsExtensions` still needs `noEmit` (TS5096 otherwise).
- **Project references don't work with `tsc --noEmit -p`** (tested on 6.0.3): a referenced project must be `composite` (TS6306) and may not disable emit (TS6310); an unbuilt reference gives TS6305 when root code imports it; `tsc -b --noEmit` gives TS6310. See TypeScript Projects for the layout that works.
- **An empty project fails:** `include` that matches no file gives TS18003 "No inputs were found", exit 2. `src/sim/` has no source yet, hence `src/sim/config.ts` below.
- **Vitest's and Vite's `.d.ts` files use DOM types** (`EventTarget`, `AbortSignal`, `WebSocket`). A no-DOM project that type-checks a sim test importing `vitest` fails with about 20 TS2304 errors unless `skipLibCheck: true` (tested). DOM use in sim *source* is still caught.
- **ESLint 10:**
  - It loads `eslint.config.js` natively; `eslint.config.ts` needs `jiti` (a new dependency), so keep the config in JavaScript.
  - Core `no-restricted-imports` supports `allowTypeImports` per path and per pattern (since ESLint 9.37), so type-only allowances work with the built-in rule.
  - `@eslint/js` and `globals` are **not** needed. `strictTypeChecked` works without `@eslint/js`, and typescript-eslint turns `no-undef` off for TS files.
- **typescript-eslint 8.72:**
  - Use ESLint's `defineConfig` (and `globalIgnores`) from `eslint/config`. `tseslint.config()` is deprecated.
  - Typed linting uses `languageOptions.parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname }`.
  - Every linted `.ts` file must belong to a tsconfig, or it fails with "was not found by the project service".
- **Vitest 5:**
  - A `test` block in `vite.config.ts` is supported (`/// <reference types="vitest/config" />` with Vite's `defineConfig`, or `defineConfig` from `vitest/config`).
  - The default environment is `node`.
  - The **default `include` also matches `*.spec.ts`**, so without an explicit `include` Vitest would try to run `tests/e2e/smoke.spec.ts`.
  - `vitest run` runs once; plain `vitest` watches.
  - Vitest 5 writes reporter output to **`.vitest/`** at the root, so ignore it in git and clean it.
- **Vite 8.3:**
  - Builds use hashed names by default (`dist/assets/index-<8-char hash>.js`), and `base: './'` makes the built `index.html` URLs relative (tested).
  - Only `index.html` is built by default, so story 0.6's `lookdev.html` is left out without extra config.
  - Preview defaults to port 4173.
- **create-vite 9.3.x, `vanilla-ts` template:**
  - It holds `_gitignore`, `index.html`, `package.json` (scripts `dev`, `build: tsc && vite build`, `preview`; devDependencies `typescript ~7.0.2`, `vite ^8.3.6`), `tsconfig.json`, `public/favicon.svg` and `public/icons.svg`, plus `src/main.ts`, `src/counter.ts`, `src/style.css` and `src/assets/{hero.png,typescript.svg,vite.svg}`.
  - There is no `vite.config.ts` and no `vite-env.d.ts`.
  - The template's tsconfig sets `types: ["vite/client"]` (needed under TS 6 for `import.meta.env`), `skipLibCheck`, `moduleDetection: "force"`, `allowArbitraryExtensions`, `noUnusedLocals`, `noUnusedParameters` and `noFallthroughCasesInSwitch`. Keep those.
- **Playwright 1.65:**
  - `webServer` takes `command`, `url`, `reuseExistingServer` and `timeout`.
  - `playwright install chromium firefox` also fetches Chromium's headless shell.
  - `--with-deps` and `install-deps` run `apt-get` through sudo, so they **can't work on CachyOS**. Missing libraries go through `pacman`, and that needs the developer, since it's sudo.
  - Expect the warning "BEWARE: your OS is not officially supported"; Playwright falls back to its Ubuntu 24.04 builds.
- **mise:**
  - The docs recommend `mise exec` for scripts and CI, shims for IDEs and GUI apps, and `activate` for interactive shells. They don't mention Makefiles.
  - `mise exec` resolves `mise.toml` on each call and installs a missing tool itself.
  - A `mise.toml` with only plain `[tools]` versions needs no `mise trust`, and `mise exec`/`mise install` trust their active config.
- **Node 26:** `.ts` files run natively (type stripping is stable and needs no flag). Relative imports need `.ts`. Enums, runtime namespaces and parameter properties throw `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. Type stripping is refused under `node_modules`.
- **Prettier 3** reads `./.gitignore` and `./.prettierignore` by default, so anything git ignores is skipped already.

### Empty game page

- `index.html`: `<!doctype html>`, `lang="en"`, `<meta charset>`, the viewport meta, `<title>Emberbound</title>` (working title), `<link rel="icon" href="data:,">` (so no `/favicon.ico` request can 404 into the smoke check's console), an empty `<div id="game"></div>`, and the template's `<script type="module" src="/src/main.ts"></script>` unchanged. Vite rewrites it to `./assets/index-<hash>.js` under `base: './'` (tested).
- `src/main.ts` is only boot for now: `log.setLevel(import.meta.env.DEV ? 'debug' : 'warn');` then `log.info('app', 'Boot');`. Nothing else. Later stories add the renderer, the app and the loop here.
- No CSS file yet. `base.css` arrives in story 0.3.

### Makefile

```make
# Emberbound: the single entry point. `make` lists the targets.
# Tools: every recipe runs through $(MISE) so the versions in mise.toml are used,
#        not whatever is on PATH. <decision + reason from mise's docs, dated>
# Later targets: shots (story 0.6) · levels, plus the Tiled check in setup (Epic 1)
#                · models (Epic 2) · release (Epic 6)
MISE := mise exec --
```

**The recommended choice is `MISE := mise exec --`.** Check it against mise's docs on the day and write the reason in the header:

- mise's docs recommend `mise exec` for scripts and CI.
- It works from any shell, including VS Code tasks, fish or a plain `sh` without `mise activate`.
- It never falls back silently to the global Node 24 the way a missing shim or an unactivated shell would.
- The cost is a few milliseconds of resolution per call, which doesn't matter here.

The rejected options are an activated shell (it depends on the caller's shell) and a `PATH` built from `mise bin-paths` (untested, and it breaks if a tool isn't installed yet). Check with `make` from a shell where mise is *not* activated: `$(MISE) node --version` must print v26.13.1, not v24.18.0.

| Target | Recipe (through `$(MISE)`) | Notes |
| --- | --- | --- |
| `help` | list the targets from `## ` comments | `.DEFAULT_GOAL := help` |
| `setup` | `mise install`, then `npm ci`, then `$(BIN)/playwright install chromium firefox` | **No `--with-deps`**: it calls apt and sudo, and this machine is Arch-based. Playwright may warn that the OS isn't officially supported; note what it says. `mise install` runs as plain `mise install`, not through `$(MISE)`. |
| `dev` | `vite` | the dev server, on localhost only: never `--host` (Vite advisory GHSA-p4f5-76q4-ffq7) |
| `test` | `vitest run` | once |
| `test-watch` | `vitest` | watch |
| `smoke` | depends on `build`; `playwright test tests/e2e/smoke.spec.ts` | both browser projects; Playwright starts `make preview` itself (see Playwright) |
| `lint` | `eslint .` | |
| `format` | `prettier --write .` | |
| `typecheck` | `tsc --noEmit -p tsconfig.json` then `tsc --noEmit -p src/sim/tsconfig.json` | see TypeScript Projects |
| `check` | lint, `prettier --check .`, typecheck, test | in that order; stop at the first failure |
| `build` | typecheck, test, `vite build` | 0.2 adds the budget check last; Epic 1 adds levels first and the manifest |
| `preview` | `vite preview --port 4173 --strictPort` | fails with a clear message if `dist/` is missing |
| `clean` | `rm -rf dist .vitest test-results playwright-report blob-report coverage node_modules/.vite node_modules/.cache node_modules/.tmp` | keeps `node_modules/` and `shots/` (critic-loop history) |

- Mark every target `.PHONY`. Use `SHELL := bash` and `.SHELLFLAGS := -eu -o pipefail -c` so a failing step fails the target.
- Call local binaries by path: `BIN := node_modules/.bin`, then `$(MISE) $(BIN)/vite`. A missing install then fails with "No such file" instead of `npx` downloading something unpinned. The one exception is `setup`'s `npm ci`.
- Running these binaries inside the Makefile is allowed. The "make targets only" rule is for people and agents at the command line.

### TypeScript projects

**Two independent projects, no `references` (approved by the developer on 2026-11-13, at story creation).** AC 15 asks for the root to "reference" the simulation project, but that can't work with `tsc --noEmit -p` (see Latest Technical Information). The layout below keeps what AC 15 is for: the simulation is checked without DOM or Node types, and the Makefile command stays as AC 13 states. It was tested on TS 6.0.3. Record the deviation in the completion notes, so the architecture's "references src/sim/tsconfig.json" line (Directory Structure; AR15) can be corrected through `gds-correct-course` or at the Epic 0 retrospective.

Root `tsconfig.json`, starting from the template's and keeping its flags:

```jsonc
{
  "compilerOptions": {
    "target": "es2023", "module": "esnext", "moduleResolution": "bundler",
    "lib": ["ES2023", "DOM"],
    "types": ["vite/client", "node"],
    "strict": true, "noEmit": true, "skipLibCheck": true,
    "allowImportingTsExtensions": true, "verbatimModuleSyntax": true, "erasableSyntaxOnly": true,
    "moduleDetection": "force", "allowArbitraryExtensions": true,
    "noUnusedLocals": true, "noUnusedParameters": true, "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "scripts", "tests", "vite.config.ts", "playwright.config.ts"],
  "exclude": ["src/sim/**"]
}
```

- Write `strict: true` explicitly, even though TS 6 defaults to it.
- `types` lists `vite/client` (for `import.meta.env`) and `node` (for `scripts/`, `tests/` and the two config files). The trade-off: browser code in `src/` could type-check `process` or `Buffer`. ESLint's `no-restricted-globals` closes that gap for `src/**` (see ESLint).
- `exclude` only stops the glob from collecting sim files. Once root code imports a sim file (Epic 1), that file is checked in the root program too, under DOM, which is harmless. The sim run below is the strict one.
- The root program must include every `.ts` file ESLint lints, or typed linting fails with "not found by the project service". So `scripts`, `tests` and the two config files are listed even while `scripts/` is empty.

`src/sim/tsconfig.json`:

```jsonc
{
  "extends": "../../tsconfig.json",
  "compilerOptions": { "lib": ["ES2023"], "types": [] },
  "include": ["./**/*.ts"],
  "exclude": []
}
```

- It inherits `strict`, `noEmit`, `skipLibCheck`, `allowImportingTsExtensions`, `verbatimModuleSyntax` and `erasableSyntaxOnly`. AC 14's "both projects" is satisfied by inheritance; confirm it with `tsc --showConfig -p src/sim/tsconfig.json` and paste the relevant lines in the Debug Log.
- `skipLibCheck` must stay `true`, or the first sim test that imports `vitest` breaks the sim type check.
- **`src/sim/config.ts`** is created now, as `export const CONFIG = {} as const;` with a one-line comment that every gameplay number lives here. Without it the sim project has no input and fails with TS18003. Story 0.6 adds `CONFIG.view` to this file and Epic 1 the rest; don't add any field now.
- `make typecheck` = `tsc --noEmit -p tsconfig.json` then `tsc --noEmit -p src/sim/tsconfig.json`, both through `$(MISE)`.

Throwaway T5c, which must pass: `src/sim/zz.test.ts` with `import { it } from 'vitest'; it('zz', () => {});` passes `make typecheck`. That proves sim tests will type-check. Delete it afterwards.

### ESLint

`eslint.config.js` (plain JavaScript; `package.json` has `"type": "module"`):

```js
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([/* see below */]),
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: { allowDefaultProject: ['eslint.config.js'] }, tsconfigRootDir: import.meta.dirname },
    },
    rules: { /* project-wide rules below */ },
  },
  { files: ['src/core/log.ts'], rules: { 'no-console': 'off' } },
  ...layerConfigs(LAYERS), // one object per layer, generated from one table
]);
```

- Check `defineConfig`, `globalIgnores` and `allowDefaultProject` against the current ESLint and typescript-eslint docs as you write. If linting `eslint.config.js` itself with type information fights you, give `**/*.js` `tseslint.configs.disableTypeChecked` instead. Either way, `make lint` must pass on `eslint.config.js`.
- **`globalIgnores`:** `_bmad/`, `_bmad-output/`, `.claude/`, `prototype/`, `dist/`, `coverage/`, `.vitest/`, `test-results/`, `playwright-report/`, `blob-report/`, `shots/`, `public/`. ESLint doesn't read `.gitignore`. `.claude/` and `_bmad/` hold installed BMad files.
- **Project-wide rules:**
  - `@typescript-eslint/consistent-type-imports`: `['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }]`.
  - `@typescript-eslint/no-import-type-side-effects`: `'error'`. Under `verbatimModuleSyntax`, `import { type X } from '…'` with only inline type specifiers compiles to a bare side-effect import that loads the module at runtime. This rule forces `import type` instead. Confirm the rule exists in 8.72's docs; if it doesn't, note that and skip it.
  - `@typescript-eslint/no-explicit-any`, `@typescript-eslint/switch-exhaustiveness-check` and `@typescript-eslint/no-floating-promises`: set each to `'error'` explicitly, even where the preset already has it.
  - `no-console`: `'error'`.
- **Flat config replaces rule options; it never merges them.** When two config objects set the same rule for a file, the later one wins entirely. So each file must match exactly one layer object, and that object must carry the layer's complete `no-restricted-imports` and `no-restricted-globals` lists. Build them from one `LAYERS` table with a small helper, so the table reads like the architecture's.
- **The rule:** use core `no-restricted-imports`, with `paths` for package names and `patterns: [{ regex, message, allowTypeImports? }]` for folders. Imports are relative strings like `../render/stage.ts`, so match folder *segments*: `seg(x) = '(^|/)' + x + '/'`. Every message names the layer and points to the architecture's Architectural Boundaries.

**The `LAYERS` table.** Glob → what it bans. "Types only" means `allowTypeImports: true`. "sim values except config" is the regex `(^|/)sim/(?!config\.ts$)` with `allowTypeImports: true`.

| Files | Bans `three`? | Bans these folder segments | Types only | Notes |
| --- | --- | --- | --- | --- |
| `src/core/**` | yes | any parent path: regex `^\.\./` | | `core/` imports nothing outside itself |
| `src/sim/**` | yes, `three` and `three/*` | `app render ui audio input platform content debug lookdev scripts` | | plus the sim globals below |
| `src/content/**` | yes | `sim app render ui audio input platform debug lookdev` | | |
| `src/platform/**` | yes | `sim render app ui audio input content debug lookdev` | | |
| `src/input/**` | yes | `app render ui audio content debug lookdev` | all of `sim/` | |
| `src/app/**` | yes | `render ui audio debug lookdev` | all of `input/` | `app/` may import `sim/` values: it hosts the simulation |
| `src/render/**` except `materials/` | no | `app ui audio platform input debug lookdev` | sim values except config | plus the three.js shader bans below |
| `src/render/materials/**` | no | `sim app ui audio platform input content debug lookdev`, and render siblings other than palettes and lighting: regex `^\.\./(?!(palettes\|lighting)/\|\.\./)` | | the only place `ShaderMaterial` and post-processing are allowed. The sibling regex assumes `materials/` stays flat; note that in a comment |
| `src/audio/**` | yes | `render ui app input debug lookdev` | sim values except config | |
| `src/ui/**` | yes | `render audio platform input debug lookdev` | all of `app/`; sim values except config | `ui/` takes only command and read-only state types from `app/` |
| `src/debug/**` | no | none | | may import anything, but the shader bans apply |
| `src/lookdev/**` | yes | `sim app audio platform input debug` | | may import `render/ ui/ content/ core/`; it reaches three.js through `render/` |
| `scripts/**` | yes | `src/(render\|ui\|audio\|app\|input\|platform\|content\|debug\|lookdev)/`, and sim except level and config: `(^\|/)sim/(?!level/\|config\.ts$)` | | values from `sim/config.ts` are allowed |
| `src/main.ts` | no | none | | the only file that knows every layer |
| `tests/**` | no | none | | tests reach across layers by design |

- **three.js shader bans** apply to every file outside `src/render/materials/`. Layers that ban `three` entirely already have them.
  - `paths: [{ name: 'three', importNames: ['ShaderMaterial', 'RawShaderMaterial'] }]`.
  - patterns `^three/(addons|examples/jsm)/postprocessing/` and the exact barrel `^three/addons$`, which re-exports the passes. Render code takes loaders from deep paths such as `three/addons/loaders/GLTFLoader.js`.
  - With `importNames` set, ESLint also reports `import * as THREE from 'three'`. That's by design: outside `materials/`, three.js is imported by name.
- **Everywhere except `render/materials/`, also ban** `three/webgpu`, `three/tsl` and `three/src/*` deep imports. The renderer is WebGLRenderer with GLSL (architecture Decision 1), and deep `three/src` paths would bypass the shader ban.
- **`src/sim/**` globals:**
  - `no-restricted-properties`: `Math.random`, `Math.sin` and `Math.cos`, with a message pointing to `sim/math.ts` and `world.rng`.
  - `no-restricted-globals`: `Date`, `performance`, `process` and `Buffer`.
- **`src/**` outside `sim/`:** `no-restricted-globals` for `process` and `Buffer`. These are browser layers, but the root tsconfig carries Node types.
- **`debug/` imports:** every layer above except `main.ts`, `debug/` and `tests/` bans `debug`. That `main.ts` imports `debug/` only behind `import.meta.env.DEV` stays a review rule.

### core/log.ts

```ts
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogChannel = 'loop' | 'app' | 'sim-host' | 'render' | 'audio' | 'input' | 'save' | 'assets' | 'ui';
```

- **API:** `log.error|warn|info|debug(channel, message, data?)`, `log.warnOnce(channel, key, message, data?)` (the architecture's example: `log.warnOnce('input', 'gamepad-off', 'Gamepad access refused; keyboard only', err)`), and `log.setLevel(level)`.
- **Line:** `console[level](\`[${channel}] ${message}\`)`, adding `data` as a second argument only when it was given, so no stray `undefined` is printed. Use `console.debug` for `debug` and `console.info` for `info`.
- **Filter:** a threshold. `setLevel('warn')` passes `error` and `warn`; `setLevel('debug')` passes everything. **The default is `'debug'`**, so Node scripts that never call the setter get everything (X-B33).
- **`warnOnce`:** keeps a `Set` of keys. A key logs once per session; another key logs separately. It's a `warn`, so it passes every level `main.ts` sets.
- **Never read `import.meta.env` in `core/`.** Node runs `scripts/*.ts` natively, where `import.meta.env` is `undefined`, so `import.meta.env.DEV` would throw. That is why `main.ts` owns the setter.
- **Testability without test-only paths:** export `createLogger(sink: LogSink = console)` and `export const log = createLogger();`. Tests build their own logger over a fake sink (`{ error, warn, info, debug }` recording calls), so no global spying or module resets are needed. `LogSink` is a small interface with those four methods. Name the module constant `log`, as every architecture example uses it.
- **Tests (`src/core/log.test.ts`), each a separate `it`:**
  - The line format: `[assets] Level loaded` with and without a data object, and the data object passed through by reference.
  - Each level maps to its console method.
  - The default level passes all four.
  - `setLevel('warn')` drops `info` and `debug` and keeps `warn` and `error`.
  - `warnOnce`: the same key twice writes once; two keys write twice.
- `src/core/log.ts` is the only file allowed to touch `console` (the ESLint exception). No logging in `sim/`, and none in per-step or per-frame paths except behind a development flag (AR206). Those rules bind later stories.

### Prettier

- `.prettierrc.json`: `{ "singleQuote": true, "printWidth": 100 }`. Everything else stays at Prettier 3's defaults (semicolons, two-space indent, trailing commas "all"). Single quotes match every code example in the architecture and the project context.
- `.prettierignore`: `_bmad/`, `_bmad-output/`, `.claude/`, `prototype/`, `*.md`, `package-lock.json`.
  - Prettier 3 also reads `.gitignore`, which already covers `dist/`, `shots/`, `.vitest/`, generated assets and the Playwright output. Don't repeat those.
  - `.claude/` holds installed BMad skills. Formatting them would rewrite installer-managed files.
  - `*.md` is ignored because the AC says code and config. CLAUDE.md, `docs/` and the planning artifacts are written by people and by the BMad workflows, and reformatting them would churn diffs.
- After `make format`, `git status` must show changes only in files this story created.
- No `eslint-config-prettier` is needed: `strictTypeChecked` has no stylistic rules, so ESLint and Prettier don't overlap. Don't add the package.

### Vite and Vitest

`vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'tests/levels/**/*.test.ts'],
  },
});
```

- **`include` is required:** Vitest's default pattern also matches `*.spec.ts`, so it would pick up the Playwright specs in `tests/e2e/`.
- Leave `environment: 'node'` written out, though it's the default: it documents the no-DOM rule (AR220).
- Don't set `server.host`. With the Vite advisory above, the dev server stays on localhost.
- Hashed asset names are Vite's default. Don't override `build.rolldownOptions.output` names.
- No look-dev input yet. Vite builds only `index.html` by default, so story 0.6's `lookdev.html` stays out of `dist/` with no config. 0.6 checks that.
- `make test` = `vitest run`. Today it runs `src/core/log.test.ts`. Story 0.2 adds `scripts/` tests and Epic 1 adds `tests/levels/`, `src/sim/`, `src/app/` and `src/input/`. The `include` already covers all of them (X-B36). With no test files Vitest exits non-zero, but `log.test.ts` exists from this story on.
- Add `.vitest/` to `.gitignore`, `.prettierignore`, the ESLint ignores and `make clean`. Vitest 5 writes reporter output there.

### Playwright

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: true,
  use: { baseURL: 'http://localhost:4173' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'make preview',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
```

- **The webServer command is `make preview`** (AC 23, default X-B20), so the preview command is defined once, in the Makefile. It starts a chain: make, then `mise exec`, then the vite binary. After `make smoke`, check that nothing still listens on 4173 (`ss -ltn 'sport = :4173'`). If a server survives, Playwright didn't kill the whole chain. In that case change the command to `node_modules/.bin/vite preview --port 4173 --strictPort`, which Playwright starts directly under the pinned Node already on PATH, and record why in the Makefile header and the completion notes.
- `reuseExistingServer: false` makes the smoke check always serve the build it just made, never a stale server left on 4173. `--strictPort` makes a busy port fail loudly instead of moving.
- **`vite preview` falls back to `index.html` for unknown paths** (SPA fallback): `/lookdev.html` returns the game page with status 200 when lookdev wasn't built. Story 0.6 must not point a check at lookdev under preview; it uses the dev server. Record this in the completion notes for 0.6.
- `tests/e2e/smoke.spec.ts`:
  - Register `page.on('console', …)` (collect messages of type `error`) and `page.on('pageerror', …)` **before** `page.goto('/')`.
  - Wait for `load`, then assert both lists are empty and that `#game` exists.
  - One `test()`, run by both projects.
- Prove the check can fail: temporarily add `console.error('smoke-check')` to `src/main.ts`, run `make smoke`, see both browsers fail, remove the line, and record it (throwaway S1).
- **Browsers on CachyOS:** `make setup` runs `playwright install chromium firefox` without `--with-deps`. If a browser fails to launch for missing system libraries, stop and give the developer the library list and the `pacman` command; installing system packages needs sudo and is his call. The architecture notes that Playwright MCP already drives a browser on this machine, which suggests Chromium works; Firefox is unverified.

### Git LFS

`.gitattributes`, one line per pattern, each `filter=lfs diff=lfs merge=lfs -text`:

```text
art-src/** filter=lfs diff=lfs merge=lfs -text
*.glb filter=lfs diff=lfs merge=lfs -text
… (*.blend *.fbx *.obj *.png *.jpg *.webp *.psd *.kra *.wav *.flac *.ogg *.mp3 *.m4a *.woff2 *.ttf)
```

- Nothing for code, JSON, `.tmj` or `.tsj`: they stay in plain git by default. `git check-attr` must show `filter: unspecified` for them.
- **git-lfs comes from mise.** So the README's start order is `mise trust` (if mise asks), `mise install`, `git lfs install`, then `make setup`. `git lfs install` can't run before mise has installed git-lfs. On an existing clone made without git-lfs, add `git lfs pull`.
- **PATH caveat:** `git lfs install` writes git hooks that call `git lfs`. Git run outside a mise-activated shell (for example VS Code's built-in git) may not find a mise-installed git-lfs, and pushes would fail with "git-lfs was not found on your path". Check `git lfs version` from VS Code's git environment before the first LFS commit (story 0.4 or 0.8). If it fails, the fix is mise's shims on the login PATH or the system package (`pacman -S git-lfs`); that choice is the developer's. Record what you find.
- **GitHub's LFS quota, as checked on 2026-11-13** (GitHub's "About storage and bandwidth usage" page, linked in References; the page shows no "as of" date):
  - GitHub Free and Pro include 10 GiB of LFS storage and 10 GiB of bandwidth a month.
  - Without a payment method, going over blocks LFS: bandwidth until the next month, and storage until usage drops.
  - Files are limited to 2 GB each.
  - Planned binaries are small next to that: about 30 MB shipped, plus source art and Blender files. AC 29 still asks the developer to confirm the numbers on his own billing page (github.com/settings/billing) on the day he runs `git lfs install`. Copy the figures above into the Dev Agent Record as "documented quota" and leave a line for his confirmation.

### README

Replace `README.md` with short sections:

1. What the project is (one line).
2. Prerequisites: mise (system package on Arch: `pacman -S mise`, or mise's installer), git, Docker (only if a service is ever needed). Node and git-lfs come from `mise.toml`, never a global install.
3. Getting started: `git clone …`, `mise trust` (if asked), `mise install`, `git lfs install`, `make setup`, `make dev`, `make check`. `make help` lists the rest.
4. Version policy, as AC 30 states it, plus the exceptions in Pinned Versions: a security fix may be younger than 14 days, and so may a named line with no older release. Each exception is written down with its reason.
5. Where the rules live: `CLAUDE.md`, `_bmad-output/project-context.md`, the architecture document.

### Decisions made in this story (the developer can veto them at review)

| # | Decision | Why |
| --- | --- | --- |
| D1 | git-lfs pinned in `mise.toml` | AC 1; the registry has it (`aqua:git-lfs/git-lfs`). The PATH caveat is noted above. |
| D2 | `.npmrc` with `save-exact=true` | Keeps the exact-pin policy when anyone runs `npm install <pkg>` later. A config file, not a dependency. |
| D3 | Template npm scripts removed | One front door; nobody drifts to `npm run dev`. |
| D4 | Prettier: `singleQuote`, `printWidth` 100; `*.md` and `.claude/` ignored | Matches the architecture's code style; leaves docs and installed BMad files alone. |
| D5 | `core/log.ts` exports `createLogger(sink)` plus a `log` constant; default level `debug` | Testable without globals or test-only code; X-B33. |
| D6 | `smoke` depends on `build`; preview on port 4173 with `--strictPort` | The smoke check must test a fresh production build. |
| D7 | `make clean` keeps `node_modules/` and `shots/` | Clean shouldn't force a reinstall or delete critic-loop history. |
| D8 | `index.html` gets `<link rel="icon" href="data:,">` | Prevents a favicon 404 from failing the console-error check. |
| D9 | No empty layer folders or `.gitkeep` files | They'd be noise; folders arrive with their first file. |
| D10 | Security fixes override the 14-day rule: Vite 8.3.8, Node 26.13.1 | Approved 2026-11-13 (Q1). A critical Vite RCE (8.3.0–8.3.6); the README's version policy gains this exception |
| D11 | Playwright 1.65.0, though only 8 days old | Approved 2026-11-13 (Q2). The only release on the named 1.65 line; 14 days old on 2026-11-19 |
| D12 | Two independent tsconfigs, no `references` | Approved 2026-11-13 (Q3). `references` can't work with `tsc --noEmit -p` (tested). The architecture's wording is corrected later through correct-course or the retro |
| D13 | `src/sim/config.ts` created now with an empty `CONFIG` | Without it the sim type check fails with TS18003 until story 0.6 |
| D14 | `skipLibCheck: true` in both projects | Vitest's types use DOM types; without it, the first sim test breaks the no-DOM check |
| D15 | Root tsconfig carries `node` types, and `src/**` bans `process` and `Buffer` through lint | Keeps two configs while type-checking `scripts/`, `tests/` and the config files |
| D16 | Core `no-restricted-imports` with `allowTypeImports`, generated from one `LAYERS` table | Built in since ESLint 9.37; flat config replaces options, so one object per file |
| D17 | `consistent-type-imports` (separate style) plus `no-import-type-side-effects` | `verbatimModuleSyntax` would otherwise keep inline-type imports as runtime imports |
| D18 | `eslint.config.js` stays JavaScript | A `.ts` config needs `jiti`, a new dependency |
| D19 | `three/webgpu`, `three/tsl`, `three/src/*` and the `three/addons` barrel banned outside `render/materials/`; namespace `three` imports flagged there | Enforces WebGLRenderer and GLSL, and closes the deep-import route around the shader ban |
| D20 | `MISE := mise exec --` | mise's docs recommend it for scripts; it doesn't depend on the caller's shell |
| D21 | Playwright `webServer` runs `make preview`, `reuseExistingServer: false` | One definition of preview; never tests a stale server |
| D22 | `.vitest/` ignored and cleaned | Vitest 5 writes output there |

### Project Structure Notes

- All files land where the architecture's Directory Structure puts them: root configs, `src/main.ts`, `src/core/`, `src/sim/tsconfig.json`, `tests/e2e/`. No new top-level folder.
- `.npmrc`, `.prettierrc.json` and `.prettierignore` are root config files that the architecture's tree doesn't list. They add no folder (CLAUDE.md asks before folder-structure changes, not config files). Mention them in the completion notes.
- File naming: camelCase TypeScript, one main export per file, tests beside the code (`log.test.ts`), Playwright specs as `tests/e2e/*.spec.ts`.

### Project Context Rules

- **Stack lines:** three r187 (WebGLRenderer and GLSL; not WebGPURenderer, not TSL); TypeScript 6.0.x, strict, never 7.x; Vite 8.3.x ≥ 8.3.3; Vitest 5.x in Node only, no jsdom; Playwright 1.65.x; ESLint 10 flat config with typescript-eslint 8.72.x `strictTypeChecked`; Prettier 3.x; Node 26.13.x from `mise.toml`, running `scripts/*.ts` natively.
- **Syntax:** relative imports carry `.ts`; `import type` for types; no enums, namespaces or parameter properties.
- **Dependencies:** nothing beyond the Toolchain table without asking. No React, Howler, jsdom, tsx and the like.
- **Commands:** always `make` targets; tool versions from `mise.toml`; any service in Docker; binaries in Git LFS; never commit secrets (`.env` is already ignored).
- **Layers:** `core/` imports nothing; `sim/` only `core/`; `render/`, `audio/` and `ui/` take types from `sim/` and values only from `sim/config.ts`; `debug/` only from `main.ts` behind `import.meta.env.DEV`; GLSL and `ShaderMaterial` only in `render/materials/`.
- **Logging:** only through `core/log.ts`; never in `sim/`.
- **Done means checked:** run `make check` before saying anything works. When something is a guess or untested, say so.
- **No visual change in this story,** so no critic loop runs. The page is blank on purpose.

### References

- Story and ACs: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md` (Story 0.1, and the Epic 0 scope)
- Toolchain, version policy, local development, project initialization: `_bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md` (Engine & Framework: Toolchain, Local Development Environment, Project Initialization)
- Directory and source structure, naming, boundary table, Git LFS: same document, Project Structure (Directory Structure, Source Structure, Naming Conventions, Architectural Boundaries)
- Logging: same document, Cross-cutting Concerns, Logging
- Testing layers: same document, Architectural Decisions, Testing Strategy
- Build: same document, Build and Release
- Consistency rules (lint baseline, imports and syntax, formatting): same document, Implementation Patterns, Consistency Rules
- Setup commands and prerequisites: same document, Development Environment
- Requirement rows AR1–AR37, AR203–AR206, AR215–AR221, AR228–AR233 and defaults X-B20, X-B33, X-B36, X-B37: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md`
- Agent rules: `_bmad-output/project-context.md`, `CLAUDE.md`
- External sources (checked 2026-11-13):
  - TypeScript 6.0 release notes: <https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html>
  - typescript-eslint, getting started and typed linting: <https://typescript-eslint.io/getting-started/typed-linting/>
  - ESLint `no-restricted-imports`: <https://eslint.org/docs/latest/rules/no-restricted-imports>
  - ESLint configuration files: <https://eslint.org/docs/latest/use/configure/configuration-files>
  - Vitest config: <https://vitest.dev/config/>
  - Vitest 5 migration: <https://vitest.dev/guide/migration>
  - Vite build guide: <https://vite.dev/guide/build>
  - Vite security advisories: <https://github.com/vitejs/vite/security/advisories> (GHSA-p4f5-76q4-ffq7)
  - Playwright `webServer`: <https://playwright.dev/docs/test-webserver>
  - Playwright browsers: <https://playwright.dev/docs/browsers>
  - mise `exec`: <https://mise.jdx.dev/cli/exec.html>
  - mise shims: <https://mise.jdx.dev/dev-tools/shims.html>
  - Node TypeScript support: <https://nodejs.org/docs/latest-v26.x/api/typescript.html>
  - Prettier ignore: <https://prettier.io/docs/ignore>
  - GitHub LFS quota: <https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-storage-and-bandwidth-usage>

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code, `gds-dev-story`, 2026-11-13 to 2026-11-14.

### Debug Log References

**Pinned versions, as installed (registry dates checked 2026-11-13):**

| Package | Version | Published | Note |
| --- | --- | --- | --- |
| node (mise) | 26.13.1 | 2026-11-10 | security exception (D10) |
| git-lfs (mise) | 3.8.1 | 2026-10-22 | |
| three | 0.187.0 | 2026-10-30 | |
| @types/three | 0.187.0 | 2026-10-30 | |
| typescript | 6.0.3 | 2026-04-16 | |
| eslint | 10.14.0 | 2026-10-30 | |
| typescript-eslint | 8.72.1 | 2026-10-26 | peers: `eslint ^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0`, `typescript >=4.8.4 <6.1.0`, so ESLint 10 is covered (AC 7) |
| prettier | 3.9.10 | 2026-10-10 | |
| @gltf-transform/cli | 4.5.1 | 2026-09-28 | |
| @types/node | 26.6.6 | 2026-10-28 | |
| vite | 8.3.8 | 2026-11-11 | security exception (D10, GHSA-p4f5-76q4-ffq7) |
| vitest | 5.0.5 | 2026-10-15 | |
| @playwright/test | 1.65.0 | 2026-11-05 | line exception (D11) |
| create-vite (scaffold only) | 9.3.3 | 2026-10-27 | not installed |

`npm ls --depth=0` shows exactly these 11 packages; `npm ls typescript` resolves 6.0.3 everywhere. No optional Vitest peer (jsdom, happy-dom, `@vitest/browser-*`) is installed. npm with Node 26.13.1 is 11.20.0.

**`npm audit`: 11 moderate findings, all in dev-only tooling, left as they are (see Completion Notes):**

- GHSA-g3hv-75wg-m249 (minimatch, a denial of service through crafted glob patterns), reached through `eslint` 10.14.0 (minimatch 10.2.6 and 11.0.8) and `typescript-eslint` 8.72.1 (minimatch 10.2.6). Every typescript-eslint version up to 8.72.2 is affected.
- GHSA-3g3m-2fjr-6pw4 (glob 10.5.0), reached through `@gltf-transform/cli` 4.5.1 → `@donmccurdy/caporal` 0.0.10. There is no fix on the 4.x line.
- npm's suggested fixes are downgrades (typescript-eslint 8.36.0, gltf-transform 3.5.1). They were not applied.

**Scaffold (T2):**

- `mise exec -C <repo> -- npm create vite@9.3.3 -- app --template vanilla-ts --no-interactive --no-immediate`.
- `-C` also changes the working directory, so the template landed briefly in `<repo>/app/`. Its 12 untracked files were moved to the temporary folder at once, before anything else ran, and nothing else in the repository was touched. It was still generated with the pinned Node 26.13.1.
- The template matched the expected list, except that its `package.json` asks for `vite ^8.3.5` (create-vite 9.3.4 asks for `^8.3.6`) and `typescript ~7.0.2`. Both were replaced with exact pins.

**Type check (T5):**

- `tsc --showConfig -p src/sim/tsconfig.json` gives `strict: true`, `noEmit: true`, `skipLibCheck: true`, `allowImportingTsExtensions: true`, `verbatimModuleSyntax: true`, `erasableSyntaxOnly: true`, `lib: ["es2023"]`, `types: []`, and `files: ["./config.ts"]`.

| Check | Result |
| --- | --- |
| T5a `src/sim/zzDom.ts` (window, document) | exit 2: `TS2304: Cannot find name 'window'`, `TS2584: Cannot find name 'document'` |
| T5b `src/core/zzEnum.ts` | exit 2: `TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled` (root project) |
| T5b `src/sim/zzEnum.ts` | exit 2: the same TS1294 (sim project) |
| T5c `src/sim/zz.test.ts` importing `vitest` | exit 0, **passes** as required |

**Lint (T6):** each file was linted on its own, with ESLint's JSON formatter (ESLint 10 dropped the `unix` formatter).

| Check | Result |
| --- | --- |
| L1 `sim/` imports `three` | `no-restricted-imports` "sim/: three.js is imported only in render/" |
| L2 `ui/` imports `../render/zz.ts` | `no-restricted-imports` "ui/: may not import render/" |
| L3 `render/` imports `ShaderMaterial` | `no-restricted-imports` "'ShaderMaterial' import from 'three' is restricted" |
| L4 `render/` imports `three/addons/postprocessing/EffectComposer.js` | `no-restricted-imports` "Post-processing passes live only in render/materials/" |
| L5 `sim/` uses `Math.random`, `Math.sin`, `Date`, `performance` | `no-restricted-properties` ×2, `no-restricted-globals` ×2, plus typed-lint errors on the unresolvable `performance` type |
| L6 `app/` calls `console.log` | `no-console` |
| L7 `ui/` value import from `../sim/world.ts` | `no-restricted-imports` "Only types from sim/, and values from sim/config.ts" |
| L8 `ui/` type from `../sim/zz.ts` plus value `CONFIG` from `../sim/config.ts` | **0 problems** (must pass) |
| L9 `render/materials/` imports `ShaderMaterial` | **0 problems** (must pass) |
| L10 `core/` imports `../sim/zz.ts` | "core/ imports nothing outside itself" |
| L11 `app/` imports `../debug/zz.ts` | "app/: may not import debug/" |
| L12 `lookdev/` imports `../sim/zz.ts` | "lookdev/: may not import sim/" |
| L13 `scripts/` imports `../src/render/zz.ts` | "scripts/ may import core/, sim/level/ and values from sim/config.ts only" |
| L14 `any`, a non-exhaustive switch, a floating promise | `no-explicit-any`, `switch-exhaustiveness-check` ("Cases not matched: \"b\""), `no-floating-promises` (and `no-meaningless-void-operator` on the test file's own `void x`) |
| L15 `app/` value import from `../input/zz.ts`, plus `import type` from it | 1 problem, the value import: "app/: only type imports from input/". The type import passes |
| L16 `render/` imports `three/webgpu` | "The renderer is WebGLRenderer with GLSL: no WebGPU, no TSL, no deep three/src imports" |
| L17 `ui/` `import { type X } from '../app/zz.ts'` | `no-import-type-side-effects` |
| L18 `render/materials/` imports `../stage.ts` | "render/materials/ takes only render/palettes/ and render/lighting/ from render/" |
| L19 `content/` uses `process.env` | `no-restricted-globals` "browser code: no Node globals" |

All 26 throwaway and support files were deleted. Afterwards `make lint` and `make typecheck` pass (exit 0).

**Smoke (T9):**

- `make build` gives `dist/index.html` (0.36 kB) and `dist/assets/index-Onv2HcQv.js` (1.11 kB, 0.59 kB gzipped). The built `index.html` loads `./assets/index-Onv2HcQv.js`, and no URL starts with `/`.
- `make smoke`: chromium ✓, firefox ✓ (2 passed).
- Throwaway S1, a temporary `console.error('smoke-check')` in `main.ts`: both browsers fail with `+ "smoke-check"`. The line was removed.
- After each run, `ss -ltn 'sport = :4173'` shows no listener, so Playwright stops the whole `make preview` chain and the direct-binary fallback isn't needed.
- `make setup`: Playwright warned "BEWARE: your OS is not officially supported by Playwright" and installed its Ubuntu 24.04 builds: Chrome for Testing 158.0.8127.18, Chrome Headless Shell, FFmpeg and Firefox 159.0. Both browsers launched with no extra system library.

**Git LFS (T10):** `git check-attr filter`:

- `filter: lfs` for `art-src/hero/notes.txt`, `*.glb`, `*.blend`, `*.fbx`, `*.obj`, `*.png`, `*.jpg`, `*.webp`, `*.psd`, `*.kra`, `*.wav`, `*.flac`, `*.ogg`, `*.mp3`, `*.m4a`, `*.woff2` and `*.ttf` sample paths.
- `filter: unspecified` for `src/main.ts`, `package.json`, `levels/emberwood.tmj`, `levels/tilesets/collision.tsj`, `public/assets/manifest.json` and `docs/ASSETS.md`.
- The 6 PNGs already committed under `_bmad-output/` don't show as modified after `.gitattributes` was added. Nothing was renormalized or migrated.
  - *Corrected at code review (2026-11-14):* they looked unchanged only because git hadn't re-read them. After `touch`, all 6 show as modified, because the `*.png` LFS filter turns them into pointers that don't match the plain-git blobs. `.gitattributes` now ends with `_bmad-output/** !filter !diff !merge`, so planning images stay in plain git; after another `touch`, `git status` is clean.
- **Documented GitHub LFS quota**, checked 2026-11-13 at <https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-storage-and-bandwidth-usage>: GitHub Free and Pro include 10 GiB of storage and 10 GiB of bandwidth a month; a file can be at most 2 GB; without a payment method, going over blocks LFS. **Developer's confirmation on his billing page:** carried over (decided at code review, 2026-11-14) to the first story that commits an LFS file, 0.4 or 0.8. Check it there before that commit.
- **`git lfs install`:** run by the developer on 2026-11-14, from fish with mise activated. It installed the `pre-push`, `post-checkout`, `post-commit` and `post-merge` hooks and set the global `filter.lfs.*` config (`required = true`). `git lfs version` gives 3.8.1. Afterwards `git status` shows the 6 committed PNGs unchanged.
- **Where git-lfs resolves:** git finds git-lfs through mise's shims (`~/.local/share/mise/shims/git-lfs`). zsh gets the shims from `~/.zshenv`; fish uses `mise activate fish`.
  - Inside the repository the shim resolves to 3.8.1.
  - Outside it, the shim fails with "No version is set for shim: git-lfs", because the global mise config pins only Node. This doesn't matter for Emberbound, since git runs the hooks and filters from the repository. It would matter in another repository that uses LFS.
  - With a plain system PATH (no shims), git-lfs isn't found.
  - Not yet verified from VS Code's built-in git.

**Clean clone (T11):**

- `git ls-files -co --exclude-standard` was copied into a fresh folder and `git init` was run there. Without `_bmad/` and `.claude/`: `make setup` exit 0, `make check` exit 0, `make build` exit 0.
  - *Code review note:* `_bmad/` and `.claude/` are tracked, so this copy wasn't what a commit contains. The second run below added them but ran only `make check`. Re-run in full after the review fixes: see "Code review fixes".
- With `_bmad/`, `_bmad-output/` and `.claude/` added (the real repository's content): `make check` exit 0. The folder was deleted.
- Final run in the repository: `make check` exit 0 (8 tests passed), `make build` exit 0.

### Completion Notes List

- **Done:** all 11 tasks. 30 of the 31 acceptance criteria are met; AC 15 in the approved form, with no `references` (D12).
  - **AC 29 is carried over** (decided at code review, 2026-11-14). The developer ran `git lfs install` on 2026-11-14 (Debug Log, T10). The documented quota is recorded. His own billing-page check moves to the first story that commits an LFS file (0.4 or 0.8).
  - **AC 2 deviated in process:** `create-vite -C` generated the template inside the repository (`<repo>/app/`), not in a temporary folder outside it. The files were moved out at once, so the end state is the same (Debug Log, T2).
- **Tests:**
  - `src/core/log.test.ts`: 11 Vitest tests (8 from the story, 3 added at code review: `warnOnce` under a level filter, `warnOnce` keys per channel, an unknown level ignored), covering the line format with and without data, data passed by reference, the level-to-method mapping, the default level, `setLevel('warn')`, `setLevel('error')` then `'debug'`, and `warnOnce` for the same key and for two keys.
  - Written first; they failed while `log.ts` didn't exist, then passed.
  - `tests/e2e/smoke.spec.ts`: one Playwright test, run in Chromium and Firefox.
  - Plain Node 26 imports `src/core/log.ts` without Vite and prints `[app] node import ok` (X-B33).
- **Order change:** T8 (`core/log.ts`) was done before T5's type check, because `src/main.ts` imports it.
- **The ESLint config file itself is linted without type information** (`tseslint.configs.disableTypeChecked` for `**/*.js`). That's the fallback the story allowed: with `allowDefaultProject`, `strictTypeChecked` reported 20 `no-unsafe-*` errors on its untyped helpers. All TypeScript is still type-linted.
- **ESLint 10 removed the `unix` formatter.** Use the default or `--format json`.
- **`npm audit` findings: decision for the developer.** There are 11 moderate findings in dev tooling (Debug Log), not exploitable here: the only glob patterns these tools see are our own config, and none of this code ships in `dist/`.
  - ESLint 10.15.0 (published 2026-11-13) fixes ESLint's own minimatch, but typescript-eslint has no fixed release yet. So upgrading ESLint alone wouldn't clear the audit, and 10.15.0 is too new under the 14-day rule (it isn't a fix for an exploitable path here).
  - Suggested follow-up: revisit when typescript-eslint ships a fixed release, or at the Epic 0 retrospective.
- **For later stories:**
  - **Story 0.6:** `vite preview` answers `/lookdev.html` with the game page (SPA fallback), so look-dev checks must run against the dev server.
  - **Story 0.6:** `src/sim/config.ts` already exists (empty `CONFIG`); add `view` to it.
  - **Stories 0.4 and 0.8:** check `git lfs version` from VS Code's git environment before the first LFS commit (mise PATH caveat).
- **Planning text to correct** through `gds-correct-course` or the Epic 0 retrospective:
  - The architecture's "tsconfig.json … references src/sim/tsconfig.json" (Directory Structure; AR15).
  - The Vite minimum of 8.3.3, now 8.3.7 (Toolchain; AR1; story Project Context Rules).
  - The project context's "Vite 8.3.x (8.3.3 or later)".
  - The architecture's `make build` row (Toolchain, "Levels, type check, tests, Vite build, manifest, budget checks") and story 6.21's list: `make build` now lints first (code review, 2026-11-14).
- **Root config files the architecture's tree doesn't list:** `.npmrc`, `.prettierrc.json`, `.prettierignore`. They add no folder.
- **Not touched:** `requirements-inventory.md` and `sprint-change-proposal-2026-11-13-tools.md` have uncommitted citation fixes (`gdd.md:121` to `122`, written 2026-11-13 22:47), which predate this story. Nothing was committed; the developer commits on `master` when he asks.

### Code review fixes (2026-11-14)

Applied after the code review (findings under Tasks / Subtasks, Review Findings):

- **`eslint.config.js`:**
  - `seg()` also matches a bare folder import (`'../render'`), and the `sim/` and `scripts/` value rules do too.
  - `core/` and `render/materials/` catch `./../` paths.
  - A catch-all `src/ (no layer)` entry gives any unlisted `src/` file the shader bans and no Node globals.
  - `core/`, `sim/` and `content/` ban dynamic `import()` and `import('…')` type queries (`no-restricted-syntax`).
- **`src/core/log.ts`:**
  - `warnOnce` checks the level filter before using a key up, and keys per channel.
  - `setLevel` ignores an unknown level.
  - Three tests were added.
- **`Makefile`, `playwright.config.ts`:** `PREVIEW_PORT ?= 4173` is exported, and Playwright reads it for the server and the base URL.
- **`tests/e2e/smoke.spec.ts`:** it fails on failed requests, on status 400 or higher, and on any non-document response served as HTML. `vite preview` answers a missing file with its SPA fallback (200, `index.html`) whenever the request accepts `*/*`; checked with curl, where `image/png` gets a 404 and `*/*` gets a 200 with `text/html`.
- **`.gitattributes`:**
  - `* text=auto eol=lf`.
  - Installer folders `_bmad/` and `.claude/` are excluded from line-ending conversion (`!text !eol`), because `.claude/skills/bmad-brainstorming/assets/brain-methods.csv` is committed with CRLF.
  - The LFS patterns match any letter case, and `*.jpeg`, `*.bin`, `*.ktx2`, `*.hdr`, `*.exr`, `*.tga`, `*.mp4`, `*.webm` and `*.otf` were added.
  - `_bmad-output/**` stays out of LFS (see T10).
- **`README.md`:** the version-policy exceptions are corrected.
- **Deferred items, revisited the same day** (none was covered by a planned story, so nothing stays deferred):
  - `make build` runs `make lint` first.
  - ESLint bans Node built-in modules and more Node globals in browser layers.
  - `render/materials/` can't re-enter `render/` through `../../render/…`.
  - `CONFIG` freezing and npm `engine-strict` were dropped (AR58; mise).
  - Verified with throwaway files: `content/` importing `node:fs` and `path`, and using `__dirname` and `setImmediate`, is reported; `materials/` importing `../../render/stage.ts` is reported, while `../../render/palettes/…` and `../lighting/…` pass; `scripts/` importing `node:fs` passes. `make check` exit 0, and `make build` exit 0 with ESLint running.

Verification:

- `make check`: exit 0, 11 tests.
- **Lint, throwaway files, all deleted afterwards:**
  - Reported: `sim/` importing `'../render'`; `sim/` with `import('three')` and `import('three').Vector3`; `core/` importing `./../sim/zz.ts`; `src/zzRoot.ts` with `ShaderMaterial` and `process`; `src/zzfolder/zz.ts` with an EffectComposer import; `render/materials/` importing `./../stage.ts`; `ui/` importing `'../sim'`.
  - Not reported, as required: `materials/` importing `'../palettes'`; `ui/` importing `CONFIG` from `../sim/config.ts`; `render/` with a dynamic `import()`.
- `git check-attr` gives `filter: lfs` for `hero.PNG`, `x.jpeg`, `m.ktx2`, `b.bin` and `s.glb`, and `text: auto` with `eol: lf` for `src/main.ts`, `package.json`, `levels/emberwood.tmj` and `m.gltf`. After a `touch`, `git status` shows no tracked file modified that wasn't modified before.
- `make smoke PREVIEW_PORT=5050`: 2 passed, and the port is free afterwards.
- `make smoke` with a throwaway missing `<img>` in `index.html`: both browsers fail on "SPA fallback: HTML instead of the file". After removing it: 2 passed.
- **Clean copy (AC 31):** `git ls-files -co --exclude-standard` (557 files, with `_bmad/`, `.claude/` and `_bmad-output/`) was copied to a fresh folder, followed by `git init`. `make setup` exit 0, `make check` exit 0, `make build` exit 0. The folder was deleted.

### File List

New:

- `.gitattributes`
- `.npmrc`
- `.prettierignore`
- `.prettierrc.json`
- `Makefile`
- `eslint.config.js`
- `index.html`
- `mise.toml`
- `package.json`
- `package-lock.json`
- `playwright.config.ts`
- `tsconfig.json`
- `vite.config.ts`
- `src/main.ts`
- `src/core/log.ts`
- `src/core/log.test.ts`
- `src/sim/config.ts`
- `src/sim/tsconfig.json`
- `tests/e2e/smoke.spec.ts`

Modified:

- `.gitignore` (added `mise.local.toml`, `.vitest/`, `shots/`, `public/assets/levels/`, `public/assets/manifest.json`)
- `README.md` (replaced)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (story status)
- `_bmad-output/implementation-artifacts/0-1-scaffold-the-repository-toolchain-and-code-rules.md` (this file: frontmatter, task boxes, Dev Agent Record, Change Log, Status)

## Change Log

| Date | Change |
| --- | --- |
| 2026-11-14 | Story 0.1 implemented. Repository scaffolded on the pinned toolchain (mise, Makefile, Vite vanilla-ts, TypeScript 6 with a DOM-free sim project, ESLint layer boundaries, Prettier, Vitest, Playwright smoke, Git LFS attributes, README); `core/log.ts` with 8 tests. Status: review. |
| 2026-11-14 | Code review: 13 patches applied (ESLint boundary gaps, logger `warnOnce` and `setLevel`, `PREVIEW_PORT`, smoke request checks, `.gitattributes`, README, Dev Agent Record), 5 deferred items revisited the same day (3 fixed, 2 dropped), 1 decision dismissed. AC 29 carried over to story 0.4 or 0.8. Status: done. |

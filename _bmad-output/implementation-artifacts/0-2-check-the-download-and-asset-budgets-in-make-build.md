---
baseline_commit: 229e4317e388157db0bf62ceb3dbc342351610b4
---

# Story 0.2: Check the download and asset budgets in `make build`

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `make build` to fail when the build breaks the 30 MB total, itch.io's file limits or a per-asset budget,
so that the download budget is guarded from the first asset on, not discovered at release.

**Requirements:** NFR5 (the checker), NFR10, PR33, AR152 (the checker), AR226 (the 30 MB total), AR229, AR230
**Epic:** 0, Reference and style lock. Story 0.1 (scaffold) is done; this is the second story.

## Acceptance Criteria

### Where it runs

- **AC1.** `scripts/checkBudgets.ts` runs as the last step of `make build`, over `dist/`, after lint, the type check, the tests and the Vite build.
- **AC2.** The level compile, the release manifest and the removal of test levels from `dist/` are left for Epic 1 (stories 1.2 and 1.3). The Makefile marks where each one goes, in the architecture's order (see Build Order below).

### The limits

- **AC3.** The check fails when the download total is over 30 MB, when `dist/` holds more than 1,000 files, when any file is over 200 MB, or when the raw total is over 500 MB (itch.io's limits). Each failure names the limit and the measured value.

### The per-asset budgets

- **AC4.** The budgets are starting values (†), in one table in `scripts/checkBudgets.ts`:

  | Group | Budget | Shared by |
  | --- | --- | --- |
  | Hero, both stages | 2 MB | every `hero-` file |
  | Each enemy | 0.6 MB | each enemy on its own |
  | The warden | 2 MB | every `warden-` file |
  | Each level kit with its backdrops | 3.5 MB | each level on its own |
  | Story cards | 1 MB | every `card-` file |
  | Pickups and markers | 0.5 MB | every `pickup-` and `marker-` file |
  | Music and ambience | 8.5 MB | every `music-` and `amb-` file |
  | Sound effects | 2 MB | every `sfx-` file |
  | Code, gzipped | 1 MB | the JavaScript and CSS bundles plus `index.html` |
  | Fonts | 0.3 MB | everything in `fonts/` |
  | Level data and manifest | 0.25 MB | the compiled `levels/*.json` plus `manifest.json` |
  | Interface icons | 0.05 MB | every `icon-` file |

  That is about 29.9 MB planned in all (readiness proposal 2026-11-13, Q1).
- **AC5.** Each shipped file is assigned to one group by kind prefix or folder, by the rules in File Grouping below.
- **AC6.** A group over its budget fails the build, naming the group, its size and its budget.
- **AC7.** A shipped file that fits no group fails the build, with its path listed, so nothing slips past the per-asset budgets.

### The report

- **AC8.** The check reports each group's size against its budget, and the download total against 30 MB. A failing run prints the same report, then the failures.

### Tests

- **AC9.** The checking logic is a pure function over a list of file paths and sizes. Vitest tests in Node cover:
  - a group exactly at its budget passes, and one byte over fails
  - 1,001 files fail
  - a file that fits no group fails
  - code is measured gzipped
  - `index.html` counts as code
  - a level JSON and the manifest fall in level data and manifest
  - an `icon-` file falls in interface icons
- **AC10.** The tests read the budget table and the limits from `scripts/checkBudgets.ts` and never repeat their numbers.

### The current build

- **AC11.** On the current code-only build, `make build` passes and reports the gzipped code size.

## Tasks / Subtasks

- [x] **T1. Write the tests first** (AC 9, 10)
  - [x] Create `scripts/checkBudgets.test.ts` with the cases in Tests below. Run `make test` and see them fail, because `checkBudgets.ts` doesn't exist yet.
- [x] **T2. Write `scripts/checkBudgets.ts`** (AC 3–8)
  - [x] The budget table and the limits (see Module Shape).
  - [x] `classifyFile(path)`, by the rules in File Grouping.
  - [x] `checkBudgets(files)`, the pure check, and `formatReport(result)`.
  - [x] `collectFiles(distDir)`, the Node part: it walks `dist/`, measures each file, and gzips the code files.
  - [x] The command-line entry, under `if (import.meta.main)`.
  - [x] Run `make test` until every test passes. Then run `make lint` and `make typecheck`.
- [x] **T3. Wire it into `make build`** (AC 1, 2)
  - [x] Add the step and the Epic 1 placeholders (see Build Order). Update the `build` target's `## ` help text.
  - [x] Run `make build`. It passes and reports the code size (AC 11). Paste the report in the Debug Log.
- [x] **T4. Prove it can fail** (AC 3, 6, 7)
  - [x] Run the throwaway checks B1–B3 below, record the output, then delete `public/` completely (it doesn't exist today).
- [x] **T5. Finish**
  - [x] Run `make check` and `make build` one last time.
  - [x] Fill in the Dev Agent Record, including the planning-text discrepancy under Build Order and any decision you changed. Set Status to `review`.
  - [x] Do not commit. The developer commits on `master` when he asks.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). Four findings dismissed: dist/ left after a failed check (the release gate in story 6.21 re-runs `make build`); symlinks (Vite dereferences them when copying `public/`); `.map`, `.wasm` and hashed-font messages (failing them is intended, D4); the gzip level and itch.io serving (already D2, recorded as unverified).

- [x] [Review][Decision] A per-item budget can be split by a suffixed file name — `enemy-walker.glb` plus `enemy-walker-mask.webp` become items `walker` and `walker-mask`, each allowed 0.6 MB, so the walker ships 1.2 MB with no failure; the same for `kit-emberwood-props.glb` (verified by probe). Resolved 2026-11-14: merge into the existing shorter item (`walker-mask` counts against `walker`); a name with no shorter item stays its own item.
- [x] [Review][Patch] A backdrop folder with no matching `kit-<level>` file forms its own kit item (a typo or a case change splits the sum); fail it [scripts/checkBudgets.ts:139]
- [x] [Review][Patch] Dotfiles copied from `public/` (`.gitkeep`, `.DS_Store`) fail with the generic "fits no budget group" message; keep failing, with a message that names it as a dotfile, and test it [scripts/checkBudgets.ts:228]
- [x] [Review][Patch] Nothing runs the script the way `make build` does: export `main`, and add a subprocess test (`node scripts/checkBudgets.ts <tmp>`) that proves the exit codes, the `import.meta.main` guard and that the import chain stays Node-native [scripts/checkBudgets.ts:288]
- [x] [Review][Patch] An empty folder, or one without `index.html`, passes; fail when `index.html` is missing [scripts/checkBudgets.ts:294]
- [x] [Review][Patch] Sorting uses locale-dependent `localeCompare`; compare by code unit [scripts/checkBudgets.ts:191]
- [x] [Review][Patch] The per-file and raw-total failure messages give the limit in MB only; add its byte count (Module Shape) [scripts/checkBudgets.ts:165]
- [x] [Review][Patch] The `collectFiles` test never checks `index.html`'s size (Tests item 12) [scripts/checkBudgets.test.ts:329]
- [x] [Review][Patch] The gzip test's passing case sits at the budget, not under it (Tests item 4) [scripts/checkBudgets.test.ts:126]

### Throwaway checks (create, run `make build`, record the output, delete)

`public/` doesn't exist yet. Vite copies `public/` into `dist/` unchanged, so the way to plant a file in `dist/` is through `public/assets/`. `make build` empties `dist/` first, so files planted straight into `dist/` would disappear.

| # | Planted file | Expected |
| --- | --- | --- |
| B1 | `public/assets/zz-unknown.dat` (a few bytes) | `make build` fails, listing `assets/zz-unknown.dat` as fitting no group |
| B2 | `public/assets/models/hero-zz.dat`, exactly 1 byte over the hero budget (`head -c 2000001 /dev/zero > …`) | fails, naming the hero group, its size and its 2 MB budget |
| B3 | `public/assets/icons/icon-zz.dat` and `public/assets/levels/zz.json`, a few bytes each, with B1 and B2 removed | **passes**. The report shows them under interface icons and level data |

Afterwards run `rm -rf public` and confirm `git status` shows nothing under `public/`. These files are never staged. `public/assets/levels/` is git-ignored anyway, and the `.dat` names keep them clear of the LFS patterns.

## Dev Notes

### Scope

**In this story:** `scripts/checkBudgets.ts`, `scripts/checkBudgets.test.ts`, and the `build` target in the `Makefile`.

**Not in this story (don't build ahead):**

- The level compile, `make levels`, the rule that fails a `test-*` level left in `dist/`, and deleting test levels from `dist/assets/levels/`: story 1.2. Today the classifier puts `assets/levels/test-x.json` in level data like any level. Story 1.2 adds the test-level failure to this checker, with its own test.
- `scripts/buildManifest.ts` and the release manifest: story 1.3.
- `public/assets/` and any real asset. The first real assets arrive with story 0.8 (fonts) and Epic 2 (the hero).
- No new dependency. Everything here is Node's standard library (`node:fs`, `node:path`, `node:zlib`) plus `src/core/log.ts`.
- No README change: no target is added, and the README doesn't list the build steps.

### Current repository state (read before changing anything)

- **`Makefile`:** `build` runs `$(MAKE) lint`, `$(MAKE) typecheck`, `$(MAKE) test`, then `$(MISE) $(BIN)/vite build`. Lint was added to `build` at story 0.1's code review, so `make release` can't ship a layer violation; keep it. Recipes run under `SHELL := bash` with `-eu -o pipefail`, so a failing step fails the target. `MISE := mise exec --` runs everything with the pinned Node 26.13.1.
- **`scripts/` doesn't exist.** This story creates it. Everything that uses it is already in place:
  - `tsconfig.json` includes `scripts` and carries Node types.
  - Vitest's `include` in `vite.config.ts` has `scripts/**/*.test.ts`.
  - `eslint.config.js` has a `scripts/` layer: Node built-ins and globals (`process`) are allowed, and three.js is banned. Imports from `src/` are banned except `core/`, `sim/level/` and values from `sim/config.ts`.
- **`src/core/log.ts`** exports `log` with `error | warn | info | debug(channel, message, data?)`. Channels are a fixed union: use **`assets`**. In Node the default level passes everything (X-B33), so `log.info` prints. `no-console` is on everywhere except `log.ts`, so the script writes **only** through `log`.
- **The current build:** `dist/index.html` (360 bytes) and `dist/assets/index-<hash>.js` (1,169 bytes, about 0.6 kB gzipped). No CSS bundle yet; story 0.3 adds `base.css`.
- **`public/` doesn't exist.**

### Build order

The architecture's Build and Release section gives `make build`'s order. This story adds step 7 and leaves comments where Epic 1 adds steps 1, 4 and 6:

1. the level compile and validation (story 1.2)
2. the type check
3. the tests
4. the release manifest, `scripts/buildManifest.ts --release` (story 1.3)
5. `vite build`
6. removing the test levels from `dist/assets/levels/` (story 1.2)
7. **the budget check (this story)**

Lint, added at 0.1's review, stays first.

**Planning-text discrepancy, to record in the completion notes:** the epic's AC says the manifest goes "just before the budget check". The architecture puts it **before `vite build`**, and it has to go there: the manifest writes `public/assets/manifest.json`, which Vite then copies into `dist/`. The architecture wins (CLAUDE.md, project context). Story 1.3 says "in the place Story 0.2 left for it", so the comment must sit before `vite build`. The architecture's Toolchain row ("Levels, type check, tests, Vite build, manifest, budget checks") has the same error. Story 0.1 already flagged that row for `gds-correct-course` or the Epic 0 retrospective; add this to the same list.

**Makefile shape.** Put the order in a comment block above the target, not as tab-indented `#` lines inside the recipe: make passes tab-indented lines to the shell and echoes them.

```make
# make build, in the architecture's order (Build and Release). Epic 1 fills in the gaps:
#   story 1.2: the level compile, before the type check
#   story 1.3: the release manifest, before vite build (Vite copies it into dist/)
#   story 1.2: removing test levels from dist/assets/levels/, before the budget check
build: ## Lint, type check, test, build into dist/, then check the download budgets
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) test
	$(MISE) $(BIN)/vite build
	$(MISE) node scripts/checkBudgets.ts dist
```

- Node 26 runs `.ts` natively (type stripping), so no runner is needed. `tsx` and the like are banned (project context).
- The script takes the folder as its first argument. Without one, it exits 1 with a usage line. If the folder doesn't exist, it exits 1 with "dist/ has no build: run 'make build'", the same wording `make preview` uses.
- `make smoke` depends on `build`, so it runs the check too. That's fine.

### File grouping

Paths are relative to `dist/`, with `/` separators. Vite puts its bundles in `dist/assets/` (`build.assetsDir`, default `assets`) and copies `public/` to the root of `dist/` unchanged (Vite 8.3 docs, checked 2026-11-14). So `public/assets/models/hero-rowan.glb` ships as `assets/models/hero-rowan.glb`, next to the bundles in `assets/`.

Apply the rules in this order. The first match wins.

| # | Rule (path relative to `dist/`) | Group |
| --- | --- | --- |
| 1 | `index.html` exactly | code |
| 2 | `assets/<name>.js` or `assets/<name>.css`, directly in `assets/`, not in a subfolder | code |
| 3 | `assets/manifest.json` exactly | level data and manifest |
| 4 | `assets/levels/<name>.json`, directly in `levels/` | level data and manifest |
| 5 | anything under `assets/fonts/` | fonts |
| 6 | anything under `assets/backdrops/<level>/` | the kit group for `<level>` |
| 7 | under `assets/`, by the file name's prefix: `hero-`, `enemy-<name>`, `warden-`, `kit-<level>`, `card-`, `pickup-` or `marker-`, `music-` or `amb-`, `sfx-`, `icon-` | the matching group |
| 8 | anything else | **fits no group: fails** |

- **Per-enemy and per-level keys** come from the file name up to its first `.`, minus the prefix: `enemy-thorn-flyer.glb` gives `thorn-flyer`, and `kit-drowned-mill.glb` gives `drowned-mill`. `assets/backdrops/drowned-mill/far.webp` joins `drowned-mill` too. Each key is checked against the per-item budget (0.6 MB per enemy, 3.5 MB per level).
- **Names are case-sensitive.** Asset names are kebab-case (AR154), so `Hero-Rowan.glb` fits no group and fails. That is intended.
- **Anything Vite emits outside these rules fails, and that is intended.** That covers hashed images or fonts imported from code (`assets/font-<hash>.woff2`), source maps, and a stray `lookdev.html` (story 0.6 keeps it out of `dist/`). Fonts belong in `public/assets/fonts/` (story 0.8). If 0.8 imports them through CSS so that Vite hashes them into `assets/`, the check fails, and 0.8 has to fix the paths or ask for a new rule. Note this for 0.8 in the completion notes.
- A `.js` or `.css` file inside an `assets/` subfolder is not code. If it has no kind prefix, it fails.

### Module shape (`scripts/checkBudgets.ts`)

One file. The architecture names only `checkBudgets.ts`, and the AC puts the table in it. The pure part, the Node part and the command-line entry live together. `import.meta.main` keeps the entry from running when a test imports the file.

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { log } from '../src/core/log.ts';

/** 1 MB = 1,000,000 bytes, the stricter reading (epic note). */
const MB = 1_000_000;

export const LIMITS = {
  downloadBytes: 30 * MB, // NFR5: code counted gzipped, everything else raw (decision D2)
  maxFiles: 1_000, // itch.io
  maxFileBytes: 200 * MB, // itch.io, raw
  maxRawTotalBytes: 500 * MB, // itch.io, raw
} as const;

export type BudgetId =
  | 'hero' | 'enemy' | 'warden' | 'kit' | 'cards' | 'pickupsMarkers'
  | 'musicAmbience' | 'sfx' | 'code' | 'fonts' | 'levelData' | 'icons';

/** Starting values (†), tuned only with the developer (architecture, Asset Management). */
export const BUDGETS: Readonly<Record<BudgetId, { label: string; bytes: number; isPerItem: boolean }>> = {
  hero: { label: 'Hero, both stages', bytes: 2 * MB, isPerItem: false },
  enemy: { label: 'Each enemy', bytes: 0.6 * MB, isPerItem: true },
  // …the rest of the AC4 table, in its order
};

export interface BuiltFile {
  readonly path: string; // relative to dist/, '/' separators
  readonly bytes: number;
  readonly gzipBytes?: number; // required for code files
}

export interface FileGroup { readonly budget: BudgetId; readonly item?: string } // item: enemy or level key

export function classifyFile(path: string): FileGroup | null { /* File Grouping rules */ }
export function checkBudgets(files: readonly BuiltFile[]): BudgetResult { /* pure */ }
export function formatReport(result: BudgetResult): string[] { /* one line per row */ }
export function collectFiles(distDir: string): BuiltFile[] { /* Node: walk, stat, gzip code */ }

if (import.meta.main) { /* parse argv, collect, check, log the report, set process.exitCode */ }
```

The sketch shows the shape only. The names are suggestions; keep the meaning.

- **`BUDGETS`:** the twelve rows of AC4, in that order, which is also the report's order. The module constants follow the naming rules: UPPER_SNAKE, and booleans named `is…`. Float rounding is not a problem here: on Node 26.13.1, every value in the table and the limits times `1_000_000` is an exact integer (checked 2026-11-14 for 2, 0.6, 3.5, 1, 0.5, 8.5, 0.3, 0.25, 0.05, 30, 200 and 500).
- **`checkBudgets(files)`** is pure: no file system, no logging. It returns:
  - the rows: one per budget, or one per found item for the per-item budgets, each with its bytes, its budget and whether it's over
  - the files that fit no group
  - `fileCount`, `rawBytes` (the sum of raw sizes) and `downloadBytes` (code gzipped plus everything else raw)
  - `failures: string[]`, one human-readable line per broken limit. It collects **every** failure, not just the first.
- **Code is measured gzipped.** For a code file, the check uses `gzipBytes`. A code file without `gzipBytes` is a caller bug: `throw new Error(...)` naming the path. `core/invariant.ts` doesn't exist yet (Epic 1), so a plain `Error` is fine in `scripts/`. Every other group uses raw `bytes`.
- **Failure messages** name the limit and the measured value: both in MB to 3 decimals, plus the exact byte counts, so a value one byte over is visible. Examples:
  - `Hero, both stages: 2.000 MB (2,000,001 bytes) is over its 2.000 MB budget (2,000,000 bytes)`
  - `1,001 files is over itch.io's limit of 1,000`
  - `assets/zz-unknown.dat fits no budget group (see the kind prefixes in the architecture, Naming Conventions)`
  - Format the numbers through `toFixed` or `toLocaleString('en-US')`: `restrict-template-expressions` in `strictTypeChecked` rejects raw numbers in template literals (`allowNumber: false`, checked in typescript-eslint 8.72.1).
- **`formatReport(result)`** returns lines like `  Code, gzipped                 0.001 / 1.000 MB`. Every row of the table appears, even at 0 bytes. A per-item budget lists each item found (`  Each enemy: thorn-flyer  0.412 / 0.600 MB`), or one line `  Each enemy  none yet` when there's none. The report ends with the download total against 30 MB and the file count against 1,000. Mark rows over budget with `OVER`.
- **`collectFiles(distDir)`:**
  - `readdirSync(distDir, { recursive: true, withFileTypes: true })`, keeping entries where `isFile()` is true.
  - Take the path from `join(entry.parentPath, entry.name)`, made relative to `distDir`, with `sep` replaced by `/`. `parentPath` was checked on Node 26.13.1; `Dirent.path` is deprecated, don't use it.
  - Get `bytes` from `statSync`.
  - Only for files `classifyFile` puts in code: `gzipBytes = gzipSync(readFileSync(p)).length`, at zlib's default level (decision D3).
- **The command-line entry:**
  - Log every report line with `log.info('assets', line)`, then every failure with `log.error('assets', line)`.
  - On failure, set `process.exitCode = 1` and return, rather than calling `process.exit()`, so the output flushes.
  - On success, finish with one line: `Budgets OK: <download> of 30.000 MB, <n> files`.

### Tests (`scripts/checkBudgets.test.ts`)

Build `BuiltFile` lists in memory. Take every number from `BUDGETS` and `LIMITS` (AC 10), for example `bytes: BUDGETS.hero.bytes + 1` and `Array.from({ length: LIMITS.maxFiles + 1 }, …)`. Write each case as its own `it`:

1. A group exactly at its budget passes. One byte over fails, and the failure names the group's label.
2. `LIMITS.maxFiles` files pass the file-count limit; `LIMITS.maxFiles + 1` fail it. Use small, valid, grouped files (for example `assets/icons/icon-<i>.svg` at 1 byte) so that only the count fails.
3. A file that fits no group (`assets/models/rowan.glb`, with no prefix) fails, and the failure lists its path. Also check: a root file other than `index.html`, and `assets/sub/x.js`.
4. Code is measured gzipped. A code file whose `bytes` is over the code budget but whose `gzipBytes` is under it passes. The reverse fails.
5. `index.html` counts as code. `assets/index-AbC123.js` and `assets/index-AbC123.css` count as code.
6. `assets/levels/emberwood.json` and `assets/manifest.json` fall in level data and manifest.
7. `assets/icons/icon-gamepad-south.svg` falls in interface icons.
8. Per-item groups are separate. Two enemies, each at `BUDGETS.enemy.bytes`, pass; one enemy at budget + 1 fails, naming the enemy. A level's kit plus its `backdrops/<level>/` files are summed, and one byte over fails.
9. The download total. Use enough per-item groups (for example nine kits, each exactly at `BUDGETS.kit.bytes`) that every group stays within budget but the total goes over `LIMITS.downloadBytes`: only the total fails. Code counts at its gzipped size in the total.
10. itch.io's raw limits. A file of `LIMITS.maxFileBytes + 1` fails the per-file limit. Files summing over `LIMITS.maxRawTotalBytes` fail the raw-total limit; assert that this failure is in the list, among others.
11. `formatReport` has one line per table row, `none yet` for an empty per-item budget, and the total line.
12. `collectFiles` on a temporary folder (`mkdtempSync(join(tmpdir(), 'budgets-'))`, removed in `afterEach`) holding `index.html`, `assets/index-x.js` (a few kB of repeated text) and `assets/models/hero-x.glb`. It returns three files with `/` paths, sizes that match, and `gzipBytes` smaller than `bytes` for the JavaScript file only.

Also check `classifyFile` directly for the table in File Grouping: one path per rule, including the first-match order (`assets/fonts/icon-x.woff2` is fonts, not icons).

### Decisions made in this story (the developer can veto them at review)

| # | Decision | Why |
| --- | --- | --- |
| D1 | 1 MB = 1,000,000 bytes | The epic's note: the stricter reading |
| D2 | **The 30 MB total counts code gzipped and everything else raw.** itch.io's 500 MB and 200 MB limits count raw bytes | NFR5 says "total download". The budget table only adds up to about 29.9 MB when code counts gzipped (1 MB), so measuring the total raw would break the plan even with every group within budget. itch.io's limits are on the upload, which is raw. **Guess:** whether itch.io's CDN actually serves code gzipped is unverified. The stricter alternative is to count everything raw; say if you want that |
| D3 | gzip at zlib's default level, not brotli | The budget says "gzipped"; the default level gives a slightly larger number than level 9, so it's the stricter choice |
| D4 | Code is `index.html` plus `.js` and `.css` directly in `dist/assets/` | Vite's `assetsDir`. Anything else Vite emits fails, which flags it |
| D5 | Kind prefixes only count under `dist/assets/`. Any root file other than `index.html` fails. Names are case-sensitive | Every shipped asset lives in `public/assets/` (architecture, Directory Structure) and is kebab-case (AR154) |
| D6 | Per-item keys from the file name up to its first `.`, minus the prefix. `backdrops/<level>/` joins `kit-<level>` | Matches the naming table. A backdrop folder with no kit still forms its own level group |
| D7 | One file holds the table, the pure check, the Node part and the entry, behind `import.meta.main` | The AC puts the table in `checkBudgets.ts`. `import.meta.main` is true when Node runs the file and false when it's imported; under Vitest 5 it's not true either (both tested 2026-11-14) |
| D8 | Every table row is reported, even at 0 bytes. Per-item rows are listed per item, or as "none yet" | The report doubles as the budget sheet the developer reads |
| D9 | Every failure is collected and printed after the report, and the exit code is set through `process.exitCode` | One run shows everything that's wrong. `process.exit()` can cut off output |
| D10 | Output goes through `core/log.ts` on the `assets` channel | `no-console` everywhere except `log.ts` |
| D11 | The Epic 1 placeholders follow the architecture's order: the manifest goes before `vite build` | See Build Order. The epic's wording is wrong |

### Previous story intelligence (0.1)

- **The patterns to copy:** tests beside the code and written first; `createLogger` testability without global spies; exact, plain config; comments that explain *why*. Keep the script plain: no classes and no clever generics.
- **Throwaway checks** are how this project proves a check can fail. Story 0.1 recorded every one (file, command, output) in the Debug Log and deleted the files. Do the same with B1–B3.
- **Lint traps found in 0.1:**
  - Typed linting needs every `.ts` file in a tsconfig. `scripts/` is already in the root's `include`.
  - ESLint 10 has no `unix` formatter; use the default or `--format json`.
  - `restrict-template-expressions` rejects numbers in template literals (see Module Shape).
- **Node runs `scripts/*.ts` directly,** so:
  - relative imports carry `.ts`
  - no enums, namespaces or parameter properties
  - `import type` for types
  - `import.meta.env` doesn't exist in Node, which is why `core/` never reads it
- **The Makefile** calls binaries by path (`$(BIN)/…`), and Node through `$(MISE) node`. Never `npx`.
- **Review lessons from 0.1** that apply here:
  - The Dev Agent Record must match what happened: no "all ACs met" while something is pending.
  - Disclose any deviation from an AC's wording.
  - Run the final checks on the real repository.
- **Review findings** are fixed now, mapped to a planned story, or dropped. Never left in a deferred list.

### Git intelligence

The last commit, `229e431`, is story 0.1: the whole scaffold (23 files). Before that, planning commits only. No `scripts/` file and no `public/` asset exists yet. `package.json` and `package-lock.json` don't change in this story.

### Latest technical information (checked 2026-11-14)

- **Node 26.13.1** (`mise exec -- node`, tested in the scratchpad):
  - `import.meta.main` is `true` when the file is run directly and `false` when it's imported. `@types/node` 26.6.6 declares it (`web-globals/importmeta.d.ts`: `main: boolean`).
  - `readdirSync(dir, { recursive: true, withFileTypes: true })` returns nested files, with `Dirent.parentPath` set.
  - `gzipSync` from `node:zlib` works as expected.
- **Vitest 5.0.5:** a module guarded by `if (import.meta.main)` doesn't run its guarded code when a test imports it (tested).
- **Vite 8.3:**
  - `build.assetsDir` defaults to `assets`.
  - `publicDir` (`public`) is copied to the root of `outDir` as-is, without hashing.
  - `build.emptyOutDir` clears `dist/` on each build, so no stale file is measured.
- **typescript-eslint 8.72.1 `strictTypeChecked`:** `restrict-template-expressions` sets `allowNumber: false`.

### Project Structure Notes

- New: `scripts/checkBudgets.ts` and `scripts/checkBudgets.test.ts`, exactly where the architecture's Directory Structure puts them (`scripts/checkBudgets.ts: Total size, file count, per-asset budgets`; System Location Mapping: "Build and budgets").
- Modified: `Makefile` (the `build` target and its comment).
- No new folder except `scripts/`, which the architecture already lists. No new config file.
- The test sits beside the code (`scripts/checkBudgets.test.ts`), as the naming rules require.

### Project Context Rules

- **Commands:** use `make` targets (`make test`, `make check`, `make build`), never raw `npm`, `npx`, `vite` or `vitest`. Tool versions come from `mise.toml`.
- **Dependencies:** none added. Node built-ins only. Ask before anything else.
- **Syntax:** TypeScript strict; `.ts` on relative imports; `import type`; no enums; no `any` without a comment.
- **Layers:** `scripts/` may import `core/` (for `log`), `sim/level/` and values from `sim/config.ts`, and nothing else from `src/`. No three.js.
- **Logging:** only through `core/log.ts`.
- **Numbers:** the budget numbers live in one table in `scripts/checkBudgets.ts`, and tests read them from it. They are † starting values; changing one needs the developer (CLAUDE.md: ask before changing a tuned number).
- **Done means checked:** run `make check` and `make build` before saying it works. Say which checks ran.
- **No visual change** in this story, so no critic loop.
- **Git:** don't commit. The developer commits straight on `master` when he asks.

### References

- Story and ACs: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md` (Story 0.2; Epic 0 scope; Story 1.2's test-level rule; Story 1.3's manifest step; Story 6.21's final budget check)
- Budget table, bundle membership and naming: `_bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md` (Architectural Decisions: Asset Management, Build and Release; Project Structure: Directory Structure, System Location Mapping, Naming Conventions; Technical Requirements, for the itch.io limits)
- The two new groups, and `index.html` as code: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-11-13-readiness.md` (Q1; edits A8, A9, S0.2-a to S0.2-d)
- Requirement rows NFR5, NFR10, PR33, AR152, AR154, AR226, AR229, AR230: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md`
- Previous story: `_bmad-output/implementation-artifacts/0-1-scaffold-the-repository-toolchain-and-code-rules.md`
- Agent rules: `_bmad-output/project-context.md`, `CLAUDE.md`
- External sources (checked 2026-11-14):
  - Vite build options (`build.assetsDir`, `build.copyPublicDir`): <https://vite.dev/config/build-options>
  - Vite, the `public` directory: <https://vite.dev/guide/assets#the-public-directory>
  - Node `fs.readdirSync` and `Dirent.parentPath`: <https://nodejs.org/docs/latest-v26.x/api/fs.html>
  - Node `import.meta.main`: <https://nodejs.org/docs/latest-v26.x/api/esm.html>
  - Node `zlib.gzipSync`: <https://nodejs.org/docs/latest-v26.x/api/zlib.html>
  - typescript-eslint `restrict-template-expressions`: <https://typescript-eslint.io/rules/restrict-template-expressions/>

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code, `gds-dev-story`, 2026-11-14.

### Debug Log References

**T1, tests first:** `make test` failed, because `scripts/checkBudgets.test.ts` couldn't import `./checkBudgets.ts`, which didn't exist yet. `log.test.ts`'s 11 tests still passed.

**T2:** after `checkBudgets.ts` was written, `make test` gave 62 passed: 51 new and 11 existing. Then:

- `make lint` reported one error: `no-unnecessary-condition` on `argv[2] === undefined`. The project doesn't set `noUncheckedIndexedAccess`, so `argv[2]` is typed `string`. Fixed with `argv.at(2)`, which is typed `string | undefined`.
- `prettier --check` flagged the test file's layout; `make format` fixed it. Afterwards `git status` showed changes only in this story's files.
- `make typecheck`: exit 0.

**Mutation check.** Each mutation was applied to a copy, then the original was restored (`cmp` confirmed it):

| Mutation | Tests that failed |
| --- | --- |
| Budget comparison `>` changed to `>=` | 6, including "passes a group exactly at its budget" |
| Code measured raw instead of gzipped | 2: "measures code gzipped" and the download-total test |
| File limit off by one (`> maxFiles + 1`) | 1: "passes 1000 files and fails one more" |

**T3, `make build` on the current code-only build** (exit 0):

```text
dist/index.html                0.36 kB │ gzip: 0.25 kB
dist/assets/index-BJzbiKZt.js  1.16 kB │ gzip: 0.62 kB
[assets] Budgets (1 MB = 1,000,000 bytes; code gzipped):
[assets]   Hero, both stages                              0.000 / 2.000 MB
[assets]   Each enemy                                     none yet (0.600 MB each)
[assets]   The warden                                     0.000 / 2.000 MB
[assets]   Each level kit with its backdrops              none yet (3.500 MB each)
[assets]   Story cards                                    0.000 / 1.000 MB
[assets]   Pickups and markers                            0.000 / 0.500 MB
[assets]   Music and ambience                             0.000 / 8.500 MB
[assets]   Sound effects                                  0.000 / 2.000 MB
[assets]   Code, gzipped                                  0.001 / 1.000 MB  (878 bytes)
[assets]   Fonts                                          0.000 / 0.300 MB
[assets]   Level data and manifest                        0.000 / 0.250 MB
[assets]   Interface icons                                0.000 / 0.050 MB
[assets]   Download total                                 0.001 / 30.000 MB  (878 bytes)
[assets]   Files                                          2 / 1,000
[assets] Budgets OK: 0.001 of 30.000 MB, 2 files
```

Our gzipped total of 878 bytes matches Vite's own figures (0.25 kB plus 0.62 kB); the small difference is the compression level. The first run printed "0.001 MB" only, which says little about a bundle this small, so each non-empty row and the total now add the exact byte count.

**T4, throwaway checks.** `public/` didn't exist before and was deleted afterwards; `git status` shows nothing under it.

| # | Planted | `make build` | Output |
| --- | --- | --- | --- |
| B1 | `public/assets/zz-unknown.dat`, 2 bytes | exit 2 (the check exited 1) | `assets/zz-unknown.dat fits no budget group (see the kind prefixes in the architecture, Naming Conventions)` |
| B2 | `public/assets/models/hero-zz.dat`, 2,000,001 bytes | exit 2 | Report row `Hero, both stages  2.000 / 2.000 MB  (2,000,001 bytes)  OVER`, then `Hero, both stages: 2.000 MB (2,000,001 bytes) is over its 2.000 MB budget (2,000,000 bytes)` |
| B3 | `public/assets/icons/icon-zz.dat` (4 bytes) and `public/assets/levels/zz.json` (2 bytes) | exit 0 | `Level data and manifest  0.000 / 0.250 MB  (2 bytes)`, `Interface icons  0.000 / 0.050 MB  (4 bytes)`, `Files 4 / 1,000`, `Budgets OK` |

**Error paths,** run directly, because `make build` always passes `dist`:

- `node scripts/checkBudgets.ts` with no argument prints `[assets] Usage: node scripts/checkBudgets.ts <dist-folder>` and exits 1.
- `node scripts/checkBudgets.ts nope` prints `[assets] nope/ has no build: run 'make build'` and exits 1.

**T5, final runs:**

- `make check`: exit 0, 62 tests.
- `make build`: exit 0, `Budgets OK: 0.001 of 30.000 MB, 2 files`.
- `make smoke`: exit 0. It runs `make build`, budget check included, then Chromium and Firefox: 2 passed. Port 4173 is free afterwards.

### Completion Notes List

- **Done:** all 5 tasks, and all 11 acceptance criteria are met. Decisions D1–D11 are implemented as written in Dev Notes; none was changed.
- **What was built:**
  - `scripts/checkBudgets.ts` holds `LIMITS` and `BUDGETS` (the AC4 table, in report order), plus:
    - `classifyFile`, the File Grouping rules, data-driven from a `PREFIXES` table
    - `checkBudgets`, pure: it collects every failure and throws on a code file that has no gzipped size
    - `formatReport`
    - `collectFiles`, the only part that touches the file system
    - the command-line entry, behind `import.meta.main`
  - Output goes through `core/log.ts` on the `assets` channel. The exit code is set through `process.exitCode`.
  - `make build` runs it last.
- **Tests:** `scripts/checkBudgets.test.ts` has 51 tests:
  - 29 `classifyFile` path cases, one or more per rule, including the first-match order (`assets/fonts/icon-x.woff2` counts as fonts) and the paths that must fit no group (a hashed font, a source map, `lookdev.html`, a capitalised name, `enemy-.glb`)
  - 3 named classification checks (`index.html`, level data and manifest, `icon-`)
  - 16 `checkBudgets` cases covering every AC9 item, per-item groups, a kit plus its backdrops, the download total (code counted gzipped) and itch.io's raw limits
  - 2 `formatReport` cases
  - 1 `collectFiles` case on a temporary folder

  Every number comes from `BUDGETS` and `LIMITS` (AC 10). The only literal sizes are made-up file sizes for fixtures, such as the 360-byte `index.html`.
- **Beyond the story's sketch:**
  - The report adds the exact byte count to non-empty rows and to the total (see Debug Log T3).
  - A per-item budget with no item shows its per-item value: `none yet (0.600 MB each)`.
  - `main` is not exported; tests cover the pure functions and `collectFiles`, and the entry's two error paths were run by hand (Debug Log).
- **Planning text to correct** through `gds-correct-course` or the Epic 0 retrospective. Add these to the list from story 0.1:
  - The epic's Story 0.2 AC says the manifest goes "just before the budget check". The architecture puts it before `vite build`, and it has to go there, because Vite copies `public/assets/manifest.json` into `dist/`. The Makefile's comment follows the architecture.
  - The architecture's Toolchain row for `make build` ("Levels, type check, tests, Vite build, manifest, budget checks") has the same misplaced manifest. Story 0.1 already listed that row because lint now runs first.
- **For later stories:**
  - **Story 0.8 (fonts):** fonts must ship from `public/assets/fonts/`. If CSS imports them so that Vite hashes them into `dist/assets/` (`assets/<name>-<hash>.woff2`), the budget check fails them as fitting no group. Reference them by their public path, or ask for a new rule.
  - **Story 1.2:** `assets/levels/test-*.json` currently counts as level data. 1.2 adds the failure for a test level left in `dist/` to `checkBudgets`, with its own test, and the removal step at the marked place in the Makefile.
  - **Story 1.3:** the release manifest step goes where the Makefile comment says: before `vite build`.
  - **Story 0.3:** a CSS bundle (`assets/index-<hash>.css`) is counted as code, gzipped, with no change needed.
- **Unverified (decision D2):** whether itch.io's CDN serves code gzipped. If it doesn't, the download total understates code by its compression ratio, about 0.3 kB today.
- **Not committed.** The developer commits on `master` when he asks.

### Code review fixes (2026-11-14)

Applied after the code review (findings under Tasks / Subtasks, Review Findings):

- **The per-item merge rule** (the developer's decision): a per-item key that extends a shorter key with a dash counts against the shorter one, so `enemy-walker-mask.webp` counts against `walker` and `kit-emberwood-props.glb` against `emberwood`. A key with no shorter item stays its own item. Added to File Grouping's per-item rule in effect; the story's Dev Notes text is unchanged.
- **Backdrops without a kit:** an `assets/backdrops/<key>/` folder whose key resolves to no `kit-` file fails.
- **Dotfiles** get their own failure message.
- **A folder without `index.html`** now fails with "has no build", which covers an empty or wrong folder. This replaces the directory-only check.
- **Sorting** is by code unit, not `localeCompare`.
- **The per-file and raw-total messages** give the limit in MB and in bytes.
- **Tests: 71 in all, 60 in this file** (9 added, 0 removed):
  - merge into a shorter item, and no merge without one
  - a backdrop folder with no kit
  - the dotfile message
  - sorting by code unit
  - limit messages in bytes
  - three subprocess tests that run `node scripts/checkBudgets.ts <folder>` as `make build` does: exit 0 with "Budgets OK", exit 1 naming the file, exit 1 for a folder without `index.html` and for no argument
  - the `collectFiles` test now checks `index.html`'s size, and the gzip test's passing case is now under the budget
- **One deviation from the finding's wording:** the finding asked to export `main` as well. The subprocess tests cover `main` through the real entry point, guard included, so `main` stays unexported.
- **Failing first:** the 6 new behaviour tests failed before the code changed. The subprocess tests for a passing and a failing build passed from the start, because that behaviour already worked.
- **Verification:** `make check` exit 0 (71 tests); `make build` exit 0 (`Budgets OK: 0.001 of 30.000 MB, 2 files`, 878 bytes of gzipped code); `make smoke` exit 0 (2 passed).
- **Dismissed at review (4):** dist/ left after a failed check (story 6.21's release re-runs `make build`); symlinks (Vite copies the real file); `.map`, `.wasm` and hashed-font messages (failing is intended, D4); the gzip level and itch.io's serving (D2, unverified).

### File List

New:

- `scripts/checkBudgets.ts`
- `scripts/checkBudgets.test.ts`

Modified:

- `Makefile` (the `build` target runs the budget check last; a comment marks the Epic 1 steps; new help text)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (story status)
- `_bmad-output/implementation-artifacts/0-2-check-the-download-and-asset-budgets-in-make-build.md` (this file: frontmatter, task boxes, Dev Agent Record, Change Log, Status)

## Change Log

| Date | Change |
| --- | --- |
| 2026-11-14 | Story 0.2 implemented. `scripts/checkBudgets.ts` checks `dist/` against the 30 MB download total, itch.io's limits and the 12 per-asset budgets, and runs last in `make build`. 51 Vitest tests; throwaway checks B1–B3 recorded. Status: review. |
| 2026-11-14 | Code review: 1 decision resolved (merge a suffixed per-item name into its shorter item) and 8 patches applied (backdrops without a kit, dotfile message, subprocess tests, a missing `index.html` fails, code-unit sorting, limit bytes in messages, two test gaps); 4 findings dismissed, none deferred. 71 tests. Status: done. |

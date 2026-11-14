---
baseline_commit: a50628c6d7ebf2756fc94dc1419e0aa3a3a83da4
---

# Story 0.3: Emit the DESIGN.md tokens as CSS custom properties, with a contrast check

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want every DESIGN.md token available to overlay CSS as a `--{group}-{name}` custom property, and DESIGN.md's contrast targets checked by a test,
so that overlay CSS never carries a raw value, and a token change that breaks a contrast target fails `make check` instead of reaching a player.

**Requirements:** UX-DR1, UX-DR2, UX-DR4, UX-DR6, UX-DR8, UX-DR10, AR184
**Epic:** 0, Reference and style lock. Stories 0.1 (scaffold) and 0.2 (budgets) are done; this is the third story.

## Acceptance Criteria

The epic's ACs, made exact. Where this story reads the epic differently, the decision is in Dev Notes › Decisions (D1–D10) and the developer can veto it at review.

### `base.css`

- **AC1.** `src/ui/styles/base.css` declares every `colors`, `typography`, `rounded` and `spacing` token in DESIGN.md's frontmatter as a custom property named `--{group}-{name}`, all inside **one** rule whose selector is `.ui-overlay` (D2), for example `--colors-surface-scrim: #0e0f11bf;` and `--spacing-safe-margin: calc(var(--tile) * 0.25);`. The file is written by hand (D1). That is 70 properties on today's DESIGN.md.
- **AC2.** Each typography token becomes one property per attribute, the attribute name turned from camelCase into kebab-case: `--typography-display-body-font-size`, `--typography-display-xl-letter-spacing`. The `note` attribute is not emitted (D3).
- **AC3.** `spacing.tile` is not emitted, and no `--tile` is declared anywhere in `base.css`: `ui/overlay.ts` sets it at runtime (story 0.6). The `components` entries are not emitted. Each component's CSS is built from the group properties when that component is built.
- **AC4.** Values are DESIGN.md's, verbatim, except that hex colours are lowercase, as Prettier prints them (D4). The 8-digit `surface-scrim` (75 % alpha) is intentional.

### The drift test

- **AC5.** A Vitest test in Node reads DESIGN.md's frontmatter and `base.css`, and fails, naming the property, when `base.css`:
  - lacks a token
  - holds a different value
  - declares a `--colors-`, `--typography-`, `--rounded-` or `--spacing-` property that DESIGN.md doesn't have, or declares one twice
  - declares one outside the `.ui-overlay` rule
  - declares `--tile` (D5)
- **AC6.** The test parses the frontmatter with the `yaml` package, added as an exact-pinned development dependency: **`yaml@2.9.1`**. The developer approved `yaml` on 2026-11-13 (sprint change proposal 2026-11-13, A7), and the architecture's Toolchain table lists it. `package-lock.json` is updated.

### The contrast check

- **AC7.** The check computes WCAG 2.x contrast from relative luminance. A colour with alpha (today only `surface-scrim`) is composited over white first, as the worst case DESIGN.md states (D6). A ratio is compared unrounded, so 4.49 fails 4.5.
- **AC8.** It asserts **≥ 4.5:1** for the 9 text pairs:
  - `text-primary` on `surface-panel`, `surface-screen` and `surface-focus`
  - `text-muted` on `surface-panel`, `surface-screen` and `surface-focus`
  - `text-primary` on `surface-scrim`
  - HUD text (`text-primary`) against `hud-outline`
  - the "New best" tag: `surface-panel` on `text-primary`
- **AC9.** It asserts **≥ 3:1** for the 16 non-text pairs:
  - `focus-ring` on `surface-panel`, `surface-focus` and `surface-screen`
  - the slider fill: `text-muted` on `border-subtle`
  - `heart-fill`, `ember`, `weapon-timer`, `warden-bar` and `warning`, each on `hud-track` and against `hud-outline` (10 pairs)
  - `heart-empty` on `hud-track`
  - `heart-empty` against `hud-outline` (D7)
- **AC10.** On the provisional values, held as a frozen fixture in the test, the check reproduces DESIGN.md's measurements to within 0.1. It measures `text-muted` on the scrim at about 3.6 and reports that pair as a "never" rule, without asserting it (D8).
- **AC11.** `make test`, and so `make check` and `make build`, fails when the colours in DESIGN.md's frontmatter miss any target in AC8–AC9.

### Checking proposed colours

- **AC12.** `make contrast` runs the check on DESIGN.md's colours. `make contrast COLORS=<file>` runs it on a proposed set (D9). The file is a YAML file with a top-level `colors:` map, or a Markdown file whose frontmatter has one, and it must name exactly DESIGN.md's 16 roles.
- **AC13.** The run reports every pair with its ratio, its target and PASS or FAIL, then the "never" pair as information. It exits 0 when every target is met. It exits 1 when any target fails, when a role is missing or unknown, or when a value isn't `#RRGGBB` or `#RRGGBBAA`, naming the role.

### Nothing rendered

- **AC14.** This story renders nothing. No module imports `base.css` yet (D10), so the build output doesn't change and no critic loop runs. `make check` and `make build` pass.

## Tasks / Subtasks

- [x] **T1. Add `yaml`** (AC 6)
  - [x] `mise exec -- npm install --save-dev --save-exact yaml@2.9.1`. This is the story's one raw npm call: no `make` target adds a dependency. `.npmrc` already has `save-exact=true`.
  - [x] Confirm `package.json` reads `"yaml": "2.9.1"` under `devDependencies`, with no range, and that `package-lock.json` changed. Then run `make setup`, whose `npm ci` must pass on the new lockfile.
- [x] **T2. Tests first** (AC 5, 7–11, 13)
  - [x] Write `scripts/designTokens.test.ts` and `scripts/checkContrast.test.ts` with the cases under Tests. Run `make test` and see them fail, because the modules don't exist yet.
- [x] **T3. `scripts/designTokens.ts`** (AC 2–6): read the frontmatter, build the expected property map, parse `base.css`, compare. See Module Shape.
- [x] **T4. `src/ui/styles/base.css`** (AC 1–4)
  - [x] Write it by hand from DESIGN.md, in DESIGN.md's order: colours, typography, rounded, spacing, with a short header comment (see `base.css` Shape).
  - [x] Run `make format` (Prettier lowercases the hex), then `make test` until the drift test passes.
- [x] **T5. `scripts/checkContrast.ts`** (AC 7–13): the pure check, the pair table, the report and the command-line entry. See Module Shape.
- [x] **T6. `make contrast`** (AC 12)
  - [x] Add the target to the `Makefile`, with a `## ` help line, in `.PHONY`. See Makefile.
  - [x] Run `make contrast` and paste its output in the Debug Log.
- [x] **T7. Prove the checks fail**: run throwaway checks C1–C6 below, record each output, and restore every file. `git diff` must show only this story's changes afterwards.
- [x] **T8. Finish**
  - [x] Run `make check` and `make build`. `make build`'s budget report must be unchanged from story 0.2: 2 files, no CSS bundle (D10).
  - [x] Fill in the Dev Agent Record: the yaml pin's reason (README version policy), any decision changed, and the planning-text corrections listed under Planning Text. Set Status to `review`.
  - [x] Do not commit. The developer commits on `master` when he asks.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). The Acceptance Auditor found no AC violations and confirmed the Dev Agent Record's claims. Four findings dismissed: a `;` inside a token value (token values never hold one), `!important` kept in a value (it fails loudly), the spec's 3.44 for C5 (it measures 3.43; the test checks which pairs fail, not the figure), and the parser's `[\w-]` name class (broader than the sketch, with the same meaning).

- [x] [Review][Decision] The drift test fails on any DESIGN.md value Prettier rewrites — Prettier (`singleQuote: true`) prints `"Ember Sans"` as `'Ember Sans'`, `1.30` as `1.3`, `.02em` as `0.02em`, `calc(var(--tile)*0.5)` with spaces and `2PX` as `2px`. `normalise` only lowercases hex, so after a story 0.8 or 0.14 edit, `base.css` can match DESIGN.md or pass `prettier --check`, never both, and the message points at `base.css`. Options: (1) the test formats the expected declarations with the project's Prettier config (the API, already a dev dependency) and compares exactly; (2) `.prettierignore` `base.css`, compare verbatim and drop the hex lowercasing; (3) leave it, and write DESIGN.md values in Prettier's form. Resolved 2026-11-14: option 1, the test formats the expected declarations with the project's Prettier config and compares exactly.
- [x] [Review][Patch] Compare base.css with the expected declarations as Prettier formats them, using the project's config, instead of the hand-made hex normalisation [scripts/designTokens.ts:160]
- [x] [Review][Patch] A foreground with alpha is composited over white, not over its background, so it can pass falsely (`#FFFFFF40` on `surface-panel` reports 17.58:1; the real ratio is 2.28:1). Composite the background over white, then the foreground over that background [scripts/checkContrast.ts:149]
- [x] [Review][Patch] Nested blocks are flattened: a token declared only inside `@media` or `@supports` passes as a plain `.ui-overlay` declaration, and unbalanced braces are accepted. Track brace depth, keep the enclosing at-rule in the selector, and throw on unbalanced braces [scripts/designTokens.ts:143]
- [x] [Review][Patch] A statement at-rule before the rule (`@layer tokens;`, `@import …;`, `@charset …;`) becomes part of the selector, so every token reads as misplaced. Take the selector from the text after the last `;` [scripts/designTokens.ts:143]
- [x] [Review][Patch] YAML coerces numbers: `1.10` becomes `1.1` and `0700` becomes `700`, so the expected value isn't the text DESIGN.md holds. Parse with the `failsafe` schema [scripts/designTokens.ts:62]
- [x] [Review][Patch] An unquoted hex (`ember: #E8902E`) is a YAML comment, so the value is empty, and the error reads "a object". Say the value is empty and that hex values need quotes in YAML [scripts/checkContrast.ts:248]
- [x] [Review][Patch] Frontmatter: a UTF-8 BOM gives "No frontmatter"; `.MD` and `.markdown` files are parsed as plain YAML; and the error doesn't name the file. Strip the BOM, match the extension case-insensitively, and prefix errors with the path [scripts/designTokens.ts:55]
- [x] [Review][Patch] Token names that can't round-trip are accepted: a key that isn't a CSS identifier (`'text primary'`) is reported as "missing" for ever, and two typography attributes that kebab-case to the same name overwrite one another silently. Throw, naming the key [scripts/designTokens.ts:115]
- [x] [Review][Patch] `make contrast`: `$(COLORS)` is unquoted, so a path with spaces splits; a `COLORS` inherited from the environment is used silently; and extra arguments are ignored. Take `COLORS` only from the command line, quote it, and reject more than one argument [Makefile:78]
- [x] [Review][Patch] The subprocess tests use a relative script path and no `cwd`, so they fail when Vitest runs from another folder. Use the absolute path and set `cwd`, in `checkBudgets.test.ts` too (fixed now rather than deferred) [scripts/checkContrast.test.ts:330]
- [x] [Review][Patch] A FAIL line can print a ratio equal to its target (4.4996 prints as `4.50:1 is under 4.5:1`). Truncate printed ratios to 2 decimals instead of rounding [scripts/checkContrast.ts:184]

### Throwaway checks (change, run, record, restore)

| # | Change | Run | Expected |
| --- | --- | --- | --- |
| C1 | In `base.css`, change `--colors-text-muted` to `#a3a6ac` | `make test` | the drift test fails, naming `--colors-text-muted` and both values |
| C2 | Delete the `--spacing-safe-margin` line | `make test` | fails, naming `--spacing-safe-margin` as missing |
| C3 | Add `--tile: 67px;` inside the rule, then (separately) `--colors-extra: #fff;` | `make test` | each fails, naming the property |
| C4 | Move `--rounded-sm` into a second rule `:root { … }` | `make test` | fails: declared outside `.ui-overlay` |
| C5 | A scratchpad YAML file with the 16 provisional colours but `text-muted: '#6B6E73'` | `make contrast COLORS=<file>` | exit 2 from make (the script exits 1); the three `text-muted` text pairs and the slider fill show FAIL with their ratios |
| C6 | The same file with `ember` removed, then with `ember: 'orange'` | `make contrast COLORS=<file>` | exits 1 naming `ember`: missing, then not a hex value |

Keep C5 and C6 files in the scratchpad, never in the repository. Don't edit DESIGN.md for any check: it lives in `_bmad-output/` and changes only through `gds-ux` Update.

## Dev Notes

### Scope

**In this story:** `package.json` and `package-lock.json` (`yaml`), `src/ui/styles/base.css`, `scripts/designTokens.ts`, `scripts/designTokens.test.ts`, `scripts/checkContrast.ts`, `scripts/checkContrast.test.ts`, and the `contrast` target in the `Makefile`.

**Not in this story (don't build ahead):**

- `ui/overlay.ts`, `--tile`, and anything that imports `base.css`: story 0.6, with the look-dev overlay view. The class `.ui-overlay` is the contract 0.6 builds on (D2).
- `@font-face` rules and font files: story 0.8, which adds them to `base.css`. The drift test must keep passing with other rules in the file, so the parser looks only at custom properties (see Module Shape).
- Changing any DESIGN.md value, adding a pixel floor to `display-xl`, or the test that every typography size has a floor: story 0.14, through `gds-ux` Update.
- `screens.css` and every component's CSS: Epic 1 onward.
- No README change. `make help` lists the new target, and the README doesn't list targets.

### Current repository state (read before changing anything)

- **No `src/ui/` folder exists.** This story creates `src/ui/styles/`. The architecture's Directory Structure already lists it, so this isn't a folder-structure change.
- **`scripts/`** holds `checkBudgets.ts` and its test (story 0.2). Copy its patterns: the pure part and the command-line entry in one file behind `if (import.meta.main)`, output through `log`, `process.exitCode` rather than `process.exit()`, and subprocess tests that run the real entry with `process.execPath`.
- **`vite.config.ts`:** Vitest's `include` already has `scripts/**/*.test.ts`, in the Node environment. No change needed.
- **`eslint.config.js`:** the `scripts/` layer allows Node built-ins and `process`, bans three.js, and lets scripts import only `core/`, `sim/level/` and values from `sim/config.ts` from `src/`. Reading `base.css` with `readFileSync` is a file read, not an import, so it's allowed. `src/ui/**` bans Node built-ins, which is why the drift test lives in `scripts/` and not beside `base.css` (see Project Structure Notes).
- **`.prettierignore`** ignores `*.md` and `_bmad-output/`, not CSS. `prettier --check .` (in `make check`) covers `base.css`. Prettier lowercases hex colours, even in custom properties (checked 2026-11-14 with the repo's Prettier 3.9.10: `#0E0F11BF` became `#0e0f11bf`). It left `calc()`, `max()`, `min()`, `system-ui, sans-serif`, `0` and `9999px` unchanged.
- **`src/core/log.ts`:** channels are a fixed union. Use **`ui`** for both scripts.
- **`Makefile`:** recipes run under `SHELL := bash` with `-eu -o pipefail` and call tools through `$(MISE)`; Node scripts run as `$(MISE) node scripts/x.ts`. `build` runs lint, typecheck, test, `vite build` and then the budget check.
- **DESIGN.md:** `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md`. Its frontmatter opens with `---` on line 1. `yaml@2.9.1` parses it with every token value a string (checked 2026-11-14): 16 colours; 8 typography tokens with 4 or 5 attributes, plus `note` on the two numeric tokens; 3 radii; 18 spacing entries, `tile` included. Integer-like keys (`'1'` to `'6'`) come first in JavaScript object order. That doesn't matter, because the comparison is by name.

### `base.css` shape

```css
/*
 * DESIGN.md tokens as --{group}-{name} custom properties (DESIGN.md, Colors rule 5; architecture,
 * Naming Conventions). Written by hand; scripts/designTokens.test.ts fails on any drift.
 * Change a value in DESIGN.md first, through gds-ux Update, then here.
 * Declared on the overlay root, where ui/overlay.ts sets --tile: a token that uses var(--tile)
 * resolves where it is declared, so declaring it on :root would make it invalid.
 * Not emitted: spacing.tile (overlay.ts sets --tile), typography `note`, components.
 */
.ui-overlay {
  /* colors */
  --colors-surface-screen: #0e0f11;
  --colors-surface-scrim: #0e0f11bf; /* 75 % alpha, intentional */
  /* … */

  /* typography */
  --typography-display-xl-font-family: system-ui, sans-serif;
  --typography-display-xl-font-size: calc(var(--tile) * 0.9);
  --typography-display-xl-font-weight: 700;
  --typography-display-xl-line-height: 1.1;
  --typography-display-xl-letter-spacing: 0.02em;
  /* … */

  /* rounded */
  --rounded-none: 0;
  /* … */

  /* spacing */
  --spacing-1: calc(var(--tile) * 0.05);
  /* … */
}
```

The count is 70: 16 colours, 34 typography attributes, 3 radii and 17 spacing entries. Copy each value from DESIGN.md, not from this sketch.

### Module shape

Two modules. The names are suggestions; keep the meaning.

**`scripts/designTokens.ts`** reads DESIGN.md and checks `base.css`. Both the drift test and the contrast CLI use it.

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const DESIGN_MD_PATH = fileURLToPath(
  new URL('../_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md', import.meta.url),
);
export const BASE_CSS_PATH = fileURLToPath(new URL('../src/ui/styles/base.css', import.meta.url));
export const TOKEN_SELECTOR = '.ui-overlay';
export const EMITTED_GROUPS = ['colors', 'typography', 'rounded', 'spacing'] as const;

/** The frontmatter between the first two `---` lines, parsed with yaml. Throws if missing. */
export function readFrontmatter(markdown: string): unknown;
/** { name → value } for every property base.css must declare (AC1–AC3). */
export function expectedProperties(frontmatter: unknown): Map<string, string>;
/** Every custom property declared in the CSS, with the selector of its rule. */
export function parseCustomProperties(css: string): { name: string; value: string; selector: string }[];
/** One message per problem (AC5), empty when base.css matches. */
export function compareTokens(expected: Map<string, string>, css: string): string[];
```

- **Narrowing.** `yaml`'s `parse` returns `any`. Assign it to `unknown` (`const data: unknown = parse(text)`), which `no-unsafe-assignment` allows. Then narrow with small type guards (`isRecord`, every value a string), so no `any` spreads. When the shape is wrong (a group missing, or a value not a scalar), throw an `Error` naming the path, such as `typography.ui-sm.fontSize`. A number or boolean scalar may be turned into a string with `String()`. Today every value is already a string.
- **Naming** (D3): `--${group}-${name}` for colours, radii and spacing. For typography it's `--typography-${token}-${kebab(attr)}`, where `kebab` turns `fontFamily` into `font-family`. Skip `spacing.tile` and the typography `note` attribute, and nothing else, so a new attribute added to DESIGN.md fails the drift test until `base.css` has it.
- **The CSS parser** is a small hand-written scan, not a library:
  - Strip `/* … */` comments first.
  - Walk the rule blocks (`selector { body }`). Inside an at-rule like `@font-face { … }` there are only declarations, so the same scan works.
  - Pick declarations matching `/(--[a-z0-9-]+)\s*:\s*([^;]*);/g`. Token values hold parentheses and commas but never `;`, `{` or `}`.
  - Nested CSS isn't used in this project; no need to handle it.
- **Normalising a value** for comparison (D4): trim it, collapse runs of whitespace to one space, and lowercase hex colour literals (`/#[0-9a-f]{3,8}\b/gi`). Apply this to both sides. Nothing else is normalised: `0` vs `0px`, or `700` vs `bold`, is a difference.
- **`compareTokens` messages** name the property and quote both values:
  - `--colors-text-muted: base.css has "#a3a6ac", DESIGN.md has "#a3a6ab"`
  - `--spacing-safe-margin: missing from base.css`
  - `--colors-extra: not a DESIGN.md token`
  - `--rounded-sm: declared twice`
  - `--rounded-sm: declared in ":root", not in ".ui-overlay"`
  - `--tile: must not be declared in base.css; ui/overlay.ts sets it`

  A property counts as a token property when it starts with `--colors-`, `--typography-`, `--rounded-` or `--spacing-`. Other custom properties, such as a `--font-…` helper in 0.8, are ignored.

**`scripts/checkContrast.ts`** holds the pure contrast check, the pair table, the report and the command-line entry.

```ts
export const TEXT_MIN_RATIO = 4.5; // WCAG 2.x AA, normal text
export const NON_TEXT_MIN_RATIO = 3; // WCAG 2.x, non-text contrast (1.4.11)

export const COLOR_ROLES = [
  'surface-screen', 'surface-scrim', 'surface-panel', 'surface-focus', 'border-subtle',
  'text-primary', 'text-muted', 'focus-ring', 'hud-outline', 'hud-track', 'heart-fill',
  'heart-empty', 'ember', 'weapon-timer', 'warden-bar', 'warning',
] as const;
export type ColorRole = (typeof COLOR_ROLES)[number];
export type Colors = Readonly<Record<ColorRole, string>>;

export interface ContrastPair {
  readonly fg: ColorRole;
  readonly bg: ColorRole;
  readonly kind: 'text' | 'non-text';
  readonly label: string; // e.g. 'Slider fill: text-muted on border-subtle'
}
export const PAIRS: readonly ContrastPair[] = [/* the 25 pairs of AC8–AC9, in DESIGN.md's table order */];
export const NEVER_PAIRS: readonly ContrastPair[] = [/* text-muted on surface-scrim */];

export function parseHex(hex: string): { r: number; g: number; b: number; a: number } | null;
export function relativeLuminance(rgb: { r: number; g: number; b: number }): number;
export function contrastRatio(fg: string, bg: string): number; // composites alpha over white first
export function checkContrast(colors: Colors): { rows: ContrastRow[]; never: ContrastRow[]; failures: string[] };
export function formatContrastReport(result: ReturnType<typeof checkContrast>): string[];
export function readColors(path: string): Colors; // YAML or Markdown frontmatter; throws naming the role
```

- **The maths** (WCAG 2.x, <https://www.w3.org/TR/WCAG22/#dfn-relative-luminance>):
  - Each 8-bit channel `c` becomes `s = c / 255`, then linear `s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4`.
  - `L = 0.2126 R + 0.7152 G + 0.0722 B`.
  - The ratio is `(L_lighter + 0.05) / (L_darker + 0.05)`.
  - The order of fg and bg doesn't change the ratio, but keep them as DESIGN.md names them, for the report.
  - The constants 0.04045, 12.92, 0.055, 1.055, 2.4, 0.2126, 0.7152, 0.0722 and 0.05 are WCAG's. Name them in one place and cite the spec. They are not gameplay numbers and don't go in `CONFIG`.
- **Alpha** (D6): a colour with `a < 1` is composited over white per channel, in gamma-encoded sRGB and without rounding to 8 bits (`c = a·c + (1 − a)·255`), then measured. For the scrim that gives about `#4a4b4d`, as DESIGN.md's review recorded. A foreground with alpha is treated the same way. No role has one today; say so in a comment.
- **`readColors(path)`:**
  - A path ending in `.md` goes through `readFrontmatter`. Anything else is parsed as YAML.
  - Take the `colors` map. Fail if it's missing, or if any role in `COLOR_ROLES` is missing, any extra key exists, or any value fails `parseHex`. `parseHex` accepts exactly `#RRGGBB` or `#RRGGBBAA`, in either case.
  - The error names the role and the file.
- **The report**, one line per pair, then the "never" pair, then a summary:

  ```text
  [ui] Contrast (WCAG 2.x; colours with alpha composited over white):
  [ui]   PASS  14.88:1 ≥ 4.5  text-primary on surface-panel
  [ui]   PASS   4.46:1 ≥ 3    Slider fill: text-muted on border-subtle
  [ui]   info   3.56:1        text-muted on surface-scrim (a "never" rule, DESIGN.md Colors: not a target)
  [ui] Contrast OK: 25 pairs, every target met (DESIGN.md)
  ```

  Print ratios to 2 decimals. Failures are logged with `log.error` after the report, one per failing pair: `FAIL text-muted on surface-focus: 3.12:1 is under 4.5:1`. Format numbers with `toFixed`, because `restrict-template-expressions` rejects raw numbers in template literals.
- **The command-line entry**, behind `if (import.meta.main)`:
  - `node scripts/checkContrast.ts [file]`, defaulting to `DESIGN_MD_PATH`.
  - On bad input, `log.error` the message, set `process.exitCode = 1` and return.
  - Never `process.exit()`.

### Makefile

```make
# Proposed colours: a YAML file with a top-level colors: map (all 16 roles), or a Markdown file
# whose frontmatter has one. Story 0.5 re-measures the style guide's values with it.
contrast: ## Check DESIGN.md's contrast targets, or a proposed set: make contrast COLORS=file.yaml
	$(MISE) node scripts/checkContrast.ts $(COLORS)
```

Add `contrast` to `.PHONY`. `$(COLORS)` is empty by default, so the script falls back to DESIGN.md. `make help` aligns names to 11 characters (`%-11s`), and `contrast` fits.

### Tests

Build fixtures in memory where possible. Each case is its own `it`.

**`scripts/designTokens.test.ts`:**

1. **The drift test (AC5, AC11)** on the real files: `compareTokens(expectedProperties(readFrontmatter(DESIGN.md)), base.css)` returns `[]`. On failure, show the messages, for example `expect(problems).toEqual([])`, so the output names each token.
2. `expectedProperties` on the real DESIGN.md yields 70 entries. Assert the count through the inputs, not a magic 70: the number of colours + typography attributes without `note` + radii + spacing entries without `tile`. Also check these:
   - it contains `--colors-surface-scrim`, `--typography-display-body-font-size`, `--typography-ui-sm-letter-spacing` and `--spacing-safe-margin`
   - it has no `--spacing-tile`, no `--typography-numeric-lg-note` and no `--components-…` key
3. The naming rule on a small fixture frontmatter, `typography: { t: { fontFamily: 'a', lineHeight: '1' } }`: gives `--typography-t-font-family` and `--typography-t-line-height`.
4. A shape error, such as `colors` missing or a value that is a map, throws, naming the path.
5. `readFrontmatter` throws on text without a frontmatter block.
6. `compareTokens` on fixture CSS, one case each: missing, different value, extra token property, duplicate, outside `.ui-overlay`, `--tile` declared. Each message names the property.
7. Normalisation. `#0E0F11BF` equals `#0e0f11bf`, and extra spaces inside `calc( … )` are collapsed. But `0` vs `0px` is a difference.
8. The parser ignores comments, including a commented-out `--colors-x` declaration. It accepts a later `@font-face { font-family: X; src: url(a.woff2); }` rule, and it ignores a non-token custom property such as `--font-display`.

**`scripts/checkContrast.test.ts`:**

1. **The math against DESIGN.md (AC10).** Use a frozen `PROVISIONAL` fixture: the 16 provisional hex values, copied into the test with a comment saying they are a frozen copy, because story 0.14 replaces DESIGN.md's values and this case must keep testing the maths. The expected values are DESIGN.md's table; assert `Math.abs(ratio − expected) <= 0.1` for each:

   | Pair | DESIGN.md | Computed (2026-11-14) |
   | --- | --- | --- |
   | `text-primary` on panel / screen / focus | 14.9 / 16.2 / 11.5 | 14.880 / 16.232 / 11.533 |
   | `text-muted` on panel / screen / focus | 7.2 / 7.9 / 5.6 | 7.199 / 7.853 / 5.580 |
   | `text-primary` on scrim (over white) | 7.4 | 7.363 |
   | `text-muted` on scrim (the "never" pair) | 3.6 | 3.562 |
   | `text-primary` against `hud-outline` | 16.2 | 16.232 |
   | `surface-panel` on `text-primary` | 14.9 | 14.880 |
   | `focus-ring` on panel / focus / screen | 9.0 / 7.0 / 9.8 | 8.999 / 6.975 / 9.818 |
   | `text-muted` on `border-subtle` | 4.5 | 4.459 |
   | on `hud-track`: heart-fill / ember / weapon-timer / warden-bar / warning | 12.3 / 6.2 / 9.7 / 7.2 / 15.4 | 12.299 / 6.184 / 9.689 / 7.214 / 15.350 |
   | `heart-empty` on `hud-track` | 4.9 | 4.854 |
   | fills against `hud-outline`, lowest to highest | 6.1 to 19.2 | `heart-empty` 6.064 … `warning` 19.176 (heart-fill 15.365, ember 7.725, weapon-timer 12.104, warden-bar 9.013) |

   For the range row, assert the lowest and the highest of the six `hud-outline` pairs, `heart-empty` included (D7).
2. **Live DESIGN.md (AC11):** `checkContrast(readColors(DESIGN_MD_PATH)).failures` is `[]`.
3. Known WCAG values: black on white is 21, white on white is 1, and the ratio is symmetric.
4. Alpha: `#000000FF` measures the same as `#000000`; `#00000000` measures as white; the scrim composite is about `#4a4b4d` (luminance within 0.001 of `#4a4b4d`'s).
5. Thresholds are compared unrounded. Build a pair just under the target: for example, find a grey on white that measures in [4.45, 4.5) and assert it FAILS. Take the numbers from `TEXT_MIN_RATIO` and `NON_TEXT_MIN_RATIO`, never from literals.
6. `PAIRS` holds 9 text and 16 non-text pairs. Every role in `COLOR_ROLES` appears in at least one pair or in `NEVER_PAIRS`, which catches a role left unchecked. `NEVER_PAIRS` has `text-muted` on `surface-scrim`, and `checkContrast` never puts it in `failures`.
7. A failing proposal: `PROVISIONAL` with `text-muted: '#6B6E73'` fails exactly 4 pairs. Those are the three `text-muted` text pairs (3.44, 3.75 and 2.66) and the slider fill (2.13, computed 2026-11-14). Each failure names the pair and the ratio. The "never" pair stays out of `failures`.
8. `parseHex` accepts `#abcdef` and `#ABCDEF80`, and rejects `#abc`, `abcdef`, `orange` and `#abcdefg`.
9. `readColors` from a temporary YAML file and a temporary `.md` file with frontmatter (`mkdtempSync`, removed in `afterEach`). Also its errors: a missing role, an extra role and a bad value, each naming the role.
10. **Subprocess tests,** as in story 0.2: run `process.execPath` with `scripts/checkContrast.ts`, using `spawnSync` and `encoding: 'utf8'`:
    - no argument: exit 0, output contains `Contrast OK`
    - a failing temporary YAML file: exit 1, output names the pair
    - a file missing a role: exit 1, output names the role

### Decisions made in this story (the developer can veto them at review)

| # | Decision | Why |
| --- | --- | --- |
| D1 | **`base.css` is written by hand, not generated.** | The epic says "is written", and its drift test only makes sense against a hand-kept file. Story 0.8 adds `@font-face` rules to the same file, which a generator would overwrite. 70 lines that change only at 0.14 don't justify a build step. |
| D2 | **Tokens are declared on `.ui-overlay`, not `:root`.** Story 0.6's `ui/overlay.ts` gives the overlay root that class and sets `--tile` on the same element. The look-dev page mounts the same root. | `var()` inside a custom property is resolved on the element where the property is declared. Checked 2026-11-14 in Chromium and Firefox through the repo's Playwright: `--x: calc(var(--tile) * .5)` declared on `:root`, with `--tile: 100px` set on a child, gave an invalid value (`width` fell back to auto). Declared on the child's own selector, it gave 50px. On `:root`, every spacing, radius and type-size token would be dead. The `ui-` prefix follows the architecture's CSS naming for shared `ui/` pieces. |
| D3 | **Typography attributes are named in kebab-case; `note` is not emitted.** Any other attribute is emitted. | The readiness report (Epic 0 notes) found that `note` would become a meaningless CSS property. It's prose about tabular figures, which each numeric component applies itself (`font-variant-numeric: tabular-nums`, DESIGN.md Typography). Skipping only `note` means a new real attribute can't be dropped silently. |
| D4 | **Values are compared after trimming, collapsing whitespace and lowercasing hex.** | Prettier, which `make check` runs on CSS, lowercases hex (tested). DESIGN.md keeps uppercase. The AC's `#0E0F11BF` example therefore appears as `#0e0f11bf`, which is the same colour. |
| D5 | **The drift test also fails on extra, duplicated or misplaced token properties and on `--tile`.** | The AC names "lacks" and "different". Without the other checks, a renamed role could leave a stale property behind, or a second rule could quietly override the first. `--tile` in CSS is banned by DESIGN.md (M3). |
| D6 | **Any colour with alpha is composited over white, unrounded, before measuring.** | That's DESIGN.md's stated worst case for the scrim, applied generally so a proposed value with alpha can't skip the check. Rounding to 8 bits gives 7.392 instead of 7.363 for `text-primary` on the scrim. Both are within 0.1 of 7.4. |
| D7 | **`heart-empty` against `hud-outline` is checked (≥ 3:1).** | The epic's AC leaves it out, but DESIGN.md's row "HUD fills against `hud-outline`: 6.1 to 19.2" only works with it. The lowest of the five fills is `ember` at 7.7; `heart-empty` against the ring is 6.06. The lost heart's stroke sits inside the ring like any fill. That makes 25 asserted pairs. |
| D8 | **`text-muted` on the scrim is reported as information, never asserted.** | It fails by design (3.56). DESIGN.md makes it a "never" rule, not a target. Showing it lets story 0.5 see whether the new values move it. |
| D9 | **A new `make contrast [COLORS=file]` target.** The input is YAML with a `colors:` map, or Markdown frontmatter. | The epic's last AC needs the check run on colours DESIGN.md doesn't hold yet (story 0.5). The readiness report found that input unspecified. CLAUDE.md routes every command through `make`. Using the same `colors:` shape as DESIGN.md lets 0.5 paste its proposal straight in. |
| D10 | **Nothing imports `base.css` yet.** | No surface exists. Importing it from `main.ts` would add a CSS bundle and a `.ui-overlay` rule that no element uses. Story 0.6 imports it with `ui/overlay.ts` for the look-dev page, and Epic 1 imports it into the game. The architecture's "the DESIGN.md tokens become CSS custom properties" is met by the file and its test. |

### Planning text to correct later

Record these in the Dev Agent Record, for `gds-correct-course` or the Epic 0 retrospective:

- The epic's Story 0.3 AC example `--colors-surface-scrim: #0E0F11BF`: under Prettier it reads `#0e0f11bf` (D4).
- The epic's non-text pair list lacks `heart-empty` against `hud-outline`, which DESIGN.md's 6.1 needs (D7).
- DESIGN.md, the architecture and story 0.6 don't say which selector carries the tokens. Story 0.6 must set `--tile` on the `.ui-overlay` element (D2). Story 0.14's `gds-ux` Update could add that to DESIGN.md's Layout & Spacing.

### Previous story intelligence (0.2, 0.1)

- **Patterns to copy:**
  - Write the tests first and watch them fail.
  - Put the pure function, the Node part and the entry in one file behind `import.meta.main`.
  - Test the entry with subprocess tests, not by exporting `main`.
  - Send output through `log` and set the exit code through `process.exitCode`.
  - Sort with a plain code-unit comparison, not `localeCompare`.
  - Tests read their limits from the module's constants and never repeat them. Frozen fixtures are the one exception, and need a comment (the provisional colours here).
- **Throwaway checks** prove that a check can fail. Record each one (change, command, output), then restore the file. Story 0.2's B1–B3 are the model.
- **Lint traps:**
  - `restrict-template-expressions` rejects numbers in template literals.
  - Without `noUncheckedIndexedAccess`, `argv[2]` is typed `string`. Use `argv.at(2)`.
  - ESLint 10 has no `unix` formatter.
  - Every `.ts` file must be in a tsconfig; `scripts/` already is.
- **Node runs `scripts/*.ts` natively:** relative imports carry `.ts`, use `import type`, and no enums. `import.meta.env` doesn't exist there. `import.meta.main` is `true` only when the file is run directly, under Vitest too (tested in 0.2).
- **Review lessons:**
  - The Dev Agent Record must match what happened.
  - Disclose every deviation from an AC's wording.
  - Run the final checks on the real repository.
  - Count tests honestly: 0.2 reported 51, then 71 after the review.
- **Review findings** are fixed now, mapped to a planned story, or dropped. Never deferred.
- **A dependency:** story 0.1 left `yaml` to this story on purpose (0.1 AC8). Never run a bare `npm install <pkg>` without an exact version.

### Git intelligence

The last two commits are stories 0.2 (`a50628c`: `scripts/checkBudgets.ts`, its test, the `build` target) and 0.1 (`229e431`: the scaffold). No CSS file, no `src/ui/` and no `yaml` exist yet. The working tree is clean.

### Latest technical information (checked 2026-11-14)

- **`yaml` on npm:**
  - The newest stable release is 2.9.1, published 2026-09-11, more than two weeks ago. Pin it exactly.
  - 3.0.0-2 is a prerelease: don't use it.
  - Licence ISC, no runtime dependencies, `engines.node >= 14.6`.
  - `import { parse } from 'yaml'` parses DESIGN.md's frontmatter under Node 26.13.1 (tested). Its type is `any`; see Module Shape for narrowing.
  - Docs: <https://eemeli.org/yaml/#parse>
- **CSS custom properties:**
  - `var()` substitution happens at computed-value time on the declaring element. A reference to an undefined property, with no fallback, makes the declaration invalid at computed-value time, and descendants inherit that invalid value (CSS Custom Properties Level 1, <https://www.w3.org/TR/css-variables-1/#invalid-at-computed-value-time>).
  - Verified in Chromium and Firefox (D2). 8-digit hex is supported in both and computes to `rgba(14, 15, 17, 0.75)` for the scrim (verified).
- **Prettier 3.9.10** lowercases hex colours in custom property values (D4, verified).
- **WCAG 2.2:** relative luminance, contrast ratio, 1.4.3 (4.5:1 text) and 1.4.11 (3:1 non-text). <https://www.w3.org/TR/WCAG22/>
- **Node 26.13.1:** `fileURLToPath(new URL(rel, import.meta.url))` works both in Node and under Vitest. Prefer it to `import.meta.dirname`, which wasn't checked under Vitest 5.

### Project Structure Notes

- New: `src/ui/styles/base.css`, exactly where the architecture puts it (Directory Structure: `ui/styles/ base.css (DESIGN.md tokens as --{group}-{name})`; AR184).
- New: `scripts/designTokens.ts`, `scripts/checkContrast.ts` and their tests. **Variance, flagged per AR248:** the naming rules put tests beside the code, but the drift test checks a file in `src/ui/styles/`, and `src/ui/**` bans Node built-ins through lint. The test needs `node:fs` and DESIGN.md. It lives in `scripts/` beside the module it tests, and the contrast check is a `scripts/` tool run by `make contrast`, which matches the folder's role ("Node TypeScript tools run by the Makefile", CLAUDE.md). The architecture's tree lists no such scripts; they add no folder.
- Modified: `package.json`, `package-lock.json`, `Makefile`.
- No config file changes. Vitest, ESLint and tsconfig already cover `scripts/`. A CSS file needs no tsconfig entry.

### Project Context Rules

- **Commands:** `make` targets only (`make test`, `make check`, `make build`, `make contrast`). The one exception is T1's `mise exec -- npm install --save-dev --save-exact yaml@2.9.1`, which no target covers.
- **Dependencies:** only `yaml@2.9.1`, development only and approved 2026-11-13. Nothing else: no CSS parser, no colour library, no `postcss`, no jsdom. Ask before anything more.
- **Syntax:** TypeScript strict, `.ts` on relative imports, `import type`, no enums, no `any` without a comment. `parse` returns `any`, so narrow it from `unknown` instead.
- **Layers:** `scripts/` may import `core/` (for `log`) and nothing else from `src/`. Reading `base.css` and DESIGN.md as files is fine.
- **Overlay rules this story sets up:** colours and type only through the token properties, never raw hex in screen CSS. `--tile` is set only by `ui/overlay.ts`. `ui/` never imports `render/` palettes (DESIGN.md Colors rules 1, 4, 5; architecture, Consistency Rules).
- **DESIGN.md is read-only here.** It changes only through `gds-ux` Update (story 0.14), and `base.css` follows it.
- **Logging:** only through `core/log.ts`, channel `ui`.
- **Done means checked:** run `make check` and `make build`, and say which checks ran.
- **No visual change**, so no critic loop.
- **Git:** don't commit. The developer commits straight on `master` when he asks.

### References

- Story and ACs: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md` (Epic 0 scope; Story 0.3; the users of 0.3: Story 0.5 "re-measured with Story 0.3's check", Story 0.6 overlay view, Story 0.8 `@font-face` in `base.css`, Story 0.14 "`base.css` follows it")
- Tokens, contrast table, value lifecycle, `--tile`: `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md` (frontmatter; Colors; Typography; Layout & Spacing)
- `--tile`, overlay root, `base.css`, CSS naming, `yaml`: `_bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md` (Toolchain; User Interface; Directory Structure; Naming Conventions › Code Elements; Consistency Rules › Overlay values)
- The open gaps settled here (D3, D9): `_bmad-output/planning-artifacts/implementation-readiness-report-2026-11-13.md` (Epic 0 notes)
- `yaml` approval: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-11-13-planning-gaps.md` (A7)
- Requirement rows UX-DR1, UX-DR2, UX-DR4, UX-DR6, UX-DR8, UX-DR10, AR184: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md`
- Previous stories: `_bmad-output/implementation-artifacts/0-2-check-the-download-and-asset-budgets-in-make-build.md`, `0-1-scaffold-the-repository-toolchain-and-code-rules.md`
- Agent rules: `_bmad-output/project-context.md`, `CLAUDE.md`

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code, `gds-dev-story`, 2026-11-14.

### Debug Log References

**T1, `yaml`.** `mise exec -- npm install --save-dev --save-exact yaml@2.9.1`:

- `package.json` gained `"yaml": "2.9.1"` under `devDependencies`, with no range.
- `package-lock.json` gained exactly one package, `node_modules/yaml` 2.9.1: ISC licence, `dev: true`, no dependencies.
- `make setup` exits 0, so `npm ci` passes on the new lockfile.
- npm printed an audit warning: 11 moderate findings. None involve `yaml`; all are in packages pinned before this story (`eslint`, `typescript-eslint` and `@gltf-transform/cli`, through `minimatch` and `glob`). They are outside this story, and a version change would need the developer.

**Pin reason** (README version policy; `package.json` can't hold comments): 2.9.1, published 2026-09-11, is the newest stable `yaml` release more than two weeks old. 3.0.0-2 is a prerelease and was not taken.

**T2, tests first.** `make test` failed on both new files: `Cannot find module './designTokens.ts'` and `'./checkContrast.ts'`. The 71 existing tests passed.

**T3–T5.**

- With `designTokens.ts` written, 24 of its 25 tests passed. The drift test failed with `ENOENT … src/ui/styles/base.css`, because the file didn't exist yet.
- With `base.css` written and `make format` run, the drift test passed: 96 tests in all.
- With `checkContrast.ts` written, all 148 passed.
- First `make lint`: 3 errors, all `no-unused-vars` on `{ ember: _ember, ...rest }`-style key removal in the tests. Replaced with a filter (`without()` in the contrast test, `Object.fromEntries(... .filter(...))` in the token test).
- `make typecheck`: exit 0 throughout.

**T6, `make contrast`** (exit 0):

```text
[ui] Contrast (WCAG 2.x; colours with alpha composited over white):
[ui]   PASS  14.88:1 ≥ 4.5  text-primary on surface-panel
[ui]   PASS  16.23:1 ≥ 4.5  text-primary on surface-screen
[ui]   PASS  11.53:1 ≥ 4.5  text-primary on surface-focus
[ui]   PASS   7.20:1 ≥ 4.5  text-muted on surface-panel
[ui]   PASS   7.85:1 ≥ 4.5  text-muted on surface-screen
[ui]   PASS   5.58:1 ≥ 4.5  text-muted on surface-focus
[ui]   PASS   7.36:1 ≥ 4.5  text-primary on surface-scrim
[ui]   PASS  16.23:1 ≥ 4.5  HUD text: text-primary on hud-outline
[ui]   PASS  14.88:1 ≥ 4.5  "New best" tag: surface-panel on text-primary
[ui]   PASS   9.00:1 ≥ 3    focus-ring on surface-panel
[ui]   PASS   6.98:1 ≥ 3    focus-ring on surface-focus
[ui]   PASS   9.82:1 ≥ 3    focus-ring on surface-screen
[ui]   PASS   4.46:1 ≥ 3    Slider fill: text-muted on border-subtle
[ui]   PASS  12.30:1 ≥ 3    heart-fill on hud-track
[ui]   PASS   6.18:1 ≥ 3    ember on hud-track
[ui]   PASS   9.69:1 ≥ 3    weapon-timer on hud-track
[ui]   PASS   7.21:1 ≥ 3    warden-bar on hud-track
[ui]   PASS  15.35:1 ≥ 3    warning on hud-track
[ui]   PASS   4.85:1 ≥ 3    heart-empty on hud-track
[ui]   PASS  15.36:1 ≥ 3    heart-fill on hud-outline
[ui]   PASS   7.73:1 ≥ 3    ember on hud-outline
[ui]   PASS  12.10:1 ≥ 3    weapon-timer on hud-outline
[ui]   PASS   9.01:1 ≥ 3    warden-bar on hud-outline
[ui]   PASS  19.18:1 ≥ 3    warning on hud-outline
[ui]   PASS   6.06:1 ≥ 3    heart-empty on hud-outline
[ui]   info   3.56:1        text-muted on surface-scrim (a "never" rule, DESIGN.md Colors: not a target)
[ui] 25 of 25 targets met
[ui] Contrast OK: 25 pairs, every target met (_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md)
```

Every ratio is within 0.1 of DESIGN.md's table.

**T7, throwaway checks.** `base.css` was copied to the scratchpad before C1, restored after each check, and `cmp` confirmed it matched the copy. The proposal files for C5 and C6 lived only in the scratchpad.

| # | Change | Result |
| --- | --- | --- |
| C1 | `--colors-text-muted: #a3a6ac` | `make test`: 1 failed, 147 passed. `--colors-text-muted: base.css has "#a3a6ac", DESIGN.md has "#A3A6AB"` |
| C2 | `--spacing-safe-margin` line deleted | 1 failed. `--spacing-safe-margin: missing from base.css` |
| C3a | `--tile: 67px;` added inside the rule | 1 failed. `--tile: must not be declared in base.css; ui/overlay.ts sets it` |
| C3b | `--colors-extra: #fff;` added | 1 failed. `--colors-extra: not a DESIGN.md token` |
| C4 | `--rounded-sm` moved into a second `:root { … }` rule | 1 failed. `--rounded-sm: declared in ":root", not in ".ui-overlay"` |
| C5 | Proposal with `text-muted: '#6B6E73'` | `make contrast COLORS=…`: make exit 2, script exit 1. FAIL on `text-muted` on panel 3.43, screen 3.75, focus 2.66, and the slider fill 2.13. `21 of 25 targets met`. The "never" pair (1.70) is shown as info, not failed |
| C6a | Proposal without `ember` | make exit 2, script exit 1. `colors.ember is missing` |
| C6b | Proposal with `ember: 'orange'` | make exit 2, script exit 1. `colors.ember is not a #RRGGBB or #RRGGBBAA colour: "orange"` |

**Mutation checks** on `scripts/checkContrast.ts`, beyond C1–C6. Each was applied to a copy and then restored; `cmp` confirmed it.

| Mutation | Tests that failed |
| --- | --- |
| No compositing (a colour with alpha measured as if opaque) | 5: both scrim rows of the DESIGN.md table, the provisional-targets test, the alpha test and the scrim composite test |
| WCAG's linear segment dropped (gamma curve only) | 2 |

**T8, final runs:**

- `make check`: exit 0. Prettier is clean, and 148 tests pass: 60 `checkBudgets`, 52 `checkContrast`, 25 `designTokens`, 11 `log`.
- `make build`: exit 0. The report is identical to story 0.2's: `dist/index.html` plus `dist/assets/index-BJzbiKZt.js` (same hash), `Code, gzipped 0.001 / 1.000 MB (878 bytes)`, `Files 2 / 1,000`, `Budgets OK`. No CSS bundle (D10).
- `git status` shows only this story's files.

### Completion Notes List

- **Done:** all 8 tasks. All 14 acceptance criteria are met, as the ACs state them. Decisions D1–D10 are implemented as written in Dev Notes; none was changed.
- **What was built:**
  - `src/ui/styles/base.css`: 70 custom properties (16 colours, 34 typography attributes, 3 radii, 17 spacing entries) in one `.ui-overlay` rule, written by hand from DESIGN.md, hex in lowercase.
  - `scripts/designTokens.ts`:
    - `readFrontmatter`; `readTokenGroups`, which narrows the frontmatter from `unknown` and names the path of anything malformed
    - `expectedProperties`
    - `parseCustomProperties`, a small comment-stripping scan of flat rule blocks that handles `@font-face`
    - `compareTokens`, which reports missing, different, extra, duplicate and misplaced tokens and any `--tile`, sorted by code unit
  - `scripts/checkContrast.ts`:
    - WCAG 2.x luminance and contrast, compositing alpha over white without rounding
    - `PAIRS` (9 text, 16 non-text, in DESIGN.md's order) and `NEVER_PAIRS`
    - `checkContrast` and `formatContrastReport`
    - `readColors` (YAML or Markdown frontmatter, exactly the 16 roles, every problem listed in one error)
    - the command-line entry behind `import.meta.main`, logging on the `ui` channel
  - `make contrast [COLORS=file]`.
- **Tests: 77 new** (25 `designTokens`, 52 `checkContrast`); 148 in all. They cover every item under Dev Notes › Tests. Beyond the list:
  - CRLF frontmatter, a number scalar, non-map frontmatter, and a `@font-face` rule with `url()` in the parser test
  - no duplicate pair, the report's line counts and FAIL marks, and a subprocess run on a file that doesn't exist
  - `it.each` over DESIGN.md's 20 table rows, so each row is its own test
- **Deviations from the story's sketch** (the sketch said "names are suggestions; keep the meaning"):
  - `expectedProperties` takes the narrowed `TokenGroups` from a new `readTokenGroups(frontmatter)` instead of raw frontmatter. The test can then count the expected properties from the inputs (Tests item 2), and the shape errors live in one function.
  - `TOKEN_GROUPS`, `SKIPPED_SPACING` and `SKIPPED_TYPOGRAPHY_ATTRIBUTE` are exported, so the tests read the skip rules instead of repeating them.
  - `formatContrastReport` ends with `N of M targets met`. The command-line entry adds the `Contrast OK: …` line, or the `FAIL …` lines on `stderr`.
  - `readColors` collects every problem (missing, extra, not hex) into one error instead of stopping at the first. A proposal file then shows everything that's wrong in one run.
- **Planning text to correct** through `gds-correct-course` or the Epic 0 retrospective. Add these to the lists from stories 0.1 and 0.2:
  - The epic's Story 0.3 AC example `--colors-surface-scrim: #0E0F11BF` reads `#0e0f11bf` in `base.css`, because Prettier lowercases hex (D4).
  - The epic's non-text pair list lacks `heart-empty` against `hud-outline`, which DESIGN.md's "6.1 to 19.2" needs (D7).
  - DESIGN.md, the architecture and story 0.6 don't name the selector that carries the tokens. Story 0.6 must set `--tile` on the `.ui-overlay` element (D2). Story 0.14's `gds-ux` Update could add that to DESIGN.md's Layout & Spacing.
  - Architecture AR248 variance: the drift test sits in `scripts/`, not beside `base.css`, because `src/ui/**` bans Node built-ins (Project Structure Notes).
- **For later stories:**
  - **0.5:** re-measure the style guide's colours with `make contrast COLORS=<file>`. The file uses the same `colors:` shape as DESIGN.md's frontmatter, so a YAML file or a Markdown file with frontmatter both work.
  - **0.6:**
    - `ui/overlay.ts` must give the overlay root the class `ui-overlay` and set `--tile` on that same element.
    - Import `base.css` there (or from the look-dev page). It isn't imported anywhere yet.
    - Read swatches with `getComputedStyle(root).getPropertyValue('--colors-…')` on that element, not on `document.documentElement`.
  - **0.8:** `@font-face` rules can go in `base.css`; the parser ignores them (tested). The font URLs must stay clear of Vite's hashing, which story 0.2 flagged.
  - **0.14:** after `gds-ux` Update changes DESIGN.md, edit `base.css` until the drift test passes, and run `make contrast`. The frozen `PROVISIONAL` fixture in `checkContrast.test.ts` stays as it is, because it tests the maths against DESIGN.md's published provisional table. The "every typography size has a pixel floor" test is 0.14's, not this story's.
- **Unverified:** nothing user-facing. The CSS behaviour behind D2 was checked in Chromium and Firefox while the story was written. No surface uses the properties yet, so there's nothing to look at.
- **Not committed.** The developer commits on `master` when he asks.

### Code review fixes (2026-11-14)

Applied after the code review (findings under Tasks / Subtasks, Review Findings). One decision resolved, 11 patches applied, 4 findings dismissed, none deferred.

- **The drift check formats both sides with Prettier** (the developer's decision, option 1):
  - `checkBaseCss(expected, css)` formats DESIGN.md's expected values, as one `.ui-overlay` rule, and `base.css` with the project's Prettier config (`resolveConfig`, parser `css`). It then compares them exactly with `compareTokens`.
  - This replaces D4's hand-made normalisation. A DESIGN.md value written as `"Ember Sans"`, `1.30`, `.02em` or `calc(a*b)` now matches the form Prettier keeps in `base.css`.
  - `compareTokens` itself compares exactly, after trimming. Messages quote DESIGN.md's value as Prettier prints it (for example `"#a3a6ab"`).
  - Prettier is already a development dependency; nothing was added.
- **Contrast with alpha:**
  - A background with alpha is composited over white, as before.
  - A foreground with alpha is now composited over that background, not over white.
  - `#FFFFFF40` on `surface-panel` now measures 2.28:1, where it used to measure 17.58:1.
  - No provisional ratio changed, because only the scrim has alpha and it is always a background.
  - The report header says how alpha is handled.
- **The CSS scan** now tracks braces by depth:
  - A nested rule's selector keeps its at-rule (`@media (min-width: 1px) .ui-overlay`), so a token inside `@media` or `@supports` is reported as misplaced.
  - Statement at-rules (`@charset`, `@layer x;`, `@import`) are skipped.
  - A last declaration without `;` is read.
  - Unbalanced braces throw.
- **YAML:**
  - `parseYaml` uses the `failsafe` schema, so every value stays the text written (`1.10`, `0700`).
  - A UTF-8 byte-order mark is ignored, in YAML files and in frontmatter.
- **Token names:** `expectedProperties` throws, naming the key, when a name isn't lowercase kebab-case (typography attributes: camelCase), or when two keys would become the same property.
- **`readColors`:**
  - Markdown is recognised by `.md` or `.markdown`, in any case.
  - Every error starts with the file path.
  - An empty value (an unquoted `#…`, which YAML reads as a comment) is explained with a hint to quote it.
  - A map or a list is named as such.
- **The command line** rejects more than one file.
- **`make contrast`:** `COLORS` counts only when given on the command line (`$(origin COLORS)`), so an exported `COLORS` is ignored. The path is quoted, so it may hold spaces.
- **Printed ratios** are truncated to 2 decimals (`formatRatio`), so 4.4996 prints as 4.49, not 4.50.
- **The subprocess tests** in `checkContrast.test.ts`, and in story 0.2's `checkBudgets.test.ts`, use the script's absolute path and an explicit `cwd`. All 164 tests also pass when Vitest is run from `/tmp`.
- **Tests:** 164 in all, 16 more than before: 33 in `designTokens` (8 added) and 60 in `checkContrast` (8 added). Three existing tests changed with the patches:
  - YAML list values are now strings.
  - The scrim composite test passes the scrim as the background.
  - The report test reads the panel ratio through `formatRatio` (14.87, truncated).
- **Checked end to end**, with `base.css` backed up and restored (`cmp`):
  - an `@layer tokens;` line above the rule passes
  - a token only inside `@media` fails, named
  - a changed value fails, named
  - `make contrast COLORS="<path with space>/p.yaml"` with `text-muted: '#FFFFFF40'` fails four pairs at 2.12 to 2.27
  - an unquoted `ember: #E8902E` gets the quote hint
  - `COLORS=… make contrast` from the environment checks DESIGN.md
- **One test expectation was wrong while writing the patches:** the blend of 25 % white over `#18191C` is `#525355`, not `#4f5052`. The test was fixed; the code was right.
- **Verification:** `make check` exit 0 (164 tests); `make build` exit 0, unchanged (`Budgets OK: 0.001 of 30.000 MB, 2 files`, same bundle hash).

### File List

New:

- `src/ui/styles/base.css`
- `scripts/designTokens.ts`
- `scripts/designTokens.test.ts`
- `scripts/checkContrast.ts`
- `scripts/checkContrast.test.ts`

Modified:

- `package.json` (`yaml` 2.9.1, development only)
- `package-lock.json` (one package added: `yaml` 2.9.1)
- `Makefile` (the `contrast` target, its comment and help line, and `.PHONY`)
- `scripts/checkBudgets.test.ts` (code review: absolute script path and `cwd` in the subprocess tests)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (story status)
- `_bmad-output/implementation-artifacts/0-3-emit-the-design-md-tokens-as-css-custom-properties-with-a-contrast-check.md` (this file: frontmatter, task boxes, Dev Agent Record, File List, Change Log, Status)

## Change Log

| Date | Change |
| --- | --- |
| 2026-11-14 | Story 0.3 implemented. `src/ui/styles/base.css` declares DESIGN.md's 70 tokens as `--{group}-{name}` on `.ui-overlay`. `scripts/designTokens.ts` adds the drift test. `scripts/checkContrast.ts` checks the 25 WCAG contrast pairs and backs `make contrast [COLORS=file]`. `yaml` 2.9.1 added (development only). 77 new tests, 148 in all; throwaway checks C1–C6 and two mutation checks recorded. Status: review. |
| 2026-11-14 | Code review: 1 decision resolved (the drift check formats both sides with Prettier) and 11 patches applied (foreground alpha over its background, nested and statement at-rules, the `failsafe` YAML schema, byte-order marks and `.markdown`, token-name checks, clearer colour errors, `make contrast` quoting and command-line-only `COLORS`, one file at most, truncated ratios, `cwd`-independent subprocess tests); 4 findings dismissed, none deferred. 164 tests. Status: done. |

---
baseline_commit: 2ea6e9f9540f5fb60726727dbf30be8c7ca48ba7
---

# Story 0.7: Put the level palettes and lighting rigs in data

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want each level's palette and lighting rig as typed data, taken from the style guide,
so that every material reads its colours and light from one place per level, and the warm-light rules are visible and tested.

**Requirements:** NR100–NR104, NFR28, AR164, AR165, X-B34
**Epic:** 0, Reference and style lock. Stories 0.1 to 0.6 are done. This story is data, rules and one DOM view: no three.js object, no material, no shader. Story 0.9 builds the materials that read this data; 0.10 swaps levels by swapping it; 0.12 judges it on the test scene; 0.13 adds the story palettes.

## Acceptance Criteria

The epic's ACs, made exact. Where this story reads the epic differently, the decision is in Dev Notes › Decisions (D1–D11) and the developer can veto it at review.

### The slot union and the palettes

1. **Given** the 36 slots in `docs/STYLE_GUIDE.md` (§5 table and the frontmatter's `palettes:`), **then** `src/core/paletteSlots.ts` exports `LEVEL_PALETTE_SLOTS`, the 36 slot names as one `as const` tuple **in the style guide's order**, and `type LevelPaletteSlot = (typeof LEVEL_PALETTE_SLOTS)[number]`, so `content/` (story 0.13) and `render/palettes/` share them without `content/` importing `render/` (X-B34). The tuple's position is the slot index assets carry (AR164): append only, never reorder (D2).
2. `src/core/paletteSlots.ts` also exports `type HexColor = \`#${string}\`` and `type LevelPalette = Readonly<Record<LevelPaletteSlot, HexColor>>`.
3. **Given** `src/render/palettes/emberwood.ts`, `drownedMill.ts` and `harrowmere.ts`, **then** each exports one palette (`EMBERWOOD_PALETTE`, `DROWNED_MILL_PALETTE`, `HARROWMERE_PALETTE`) declared `as const satisfies LevelPalette`, holding the style guide's hex value for every slot, written exactly as in the frontmatter (uppercase `#RRGGBB`). The type checker fails if a slot is missing or an unknown slot is added (throwaway checks L1–L2).
4. The palette modules are plain data: no three.js import, no `Color` objects (D3). Story 0.9 converts hex to colours inside `render/materials/`.
5. Enemy colours are slots in every palette (`walkerBody`, `walkerAccent`, `flyerBody`, `flyerAccent`, `spitterBody`, `spitterAccent`, `seed`), so an enemy's recolour is a palette swap with no rule change (NR104). The weapon pickups' slot (`pickupWarm`) sits in Rowan's warm family (NR103).

### The lighting rigs

6. **Given** the style guide's lighting rule (§2 "Lighting, per level", §3), **then** `src/render/lighting/emberwood.ts`, `drownedMill.ts` and `harrowmere.ts` each export one rig (`EMBERWOOD_RIG`, `DROWNED_MILL_RIG`, `HARROWMERE_RIG`), typed by `LightingRig` from `src/render/lighting/lightingRig.ts` (D5), holding as data:
   - the **key light**: colour as a palette slot, the direction it comes from, a relative intensity †;
   - the **fill light**: the same three fields;
   - the **fog**: colour as a palette slot, the depth behind the play plane where it starts and where it is fullest, and its maximum amount †; plus an optional **ground fog** (the Drowned Mill's low fog over water) †;
   - the **warm list**: what may carry warm light in that level;
   - the **lanterns**: colour slot, reach in tiles † and relative intensity †, or `null` where the level has none.
7. Colours in the rigs are palette slot names (`LevelPaletteSlot`), never hex, so a rig and its palette can't disagree (D6). The slots follow the style guide's table: key `skyGlow` in all three; fill `bark` (Emberwood), `treeMid` (the Drowned Mill and Harrowmere); fog `fog`; lanterns `lantern`.
8. Every intensity, depth, amount, reach and direction is a starting guess marked † with a comment naming story 0.12 (the test scene) as where it is judged, and story 0.9 as where the materials decide what an intensity means for banded shading (style guide §2: "how far each tone moves is a material setting †, set in story 0.9"). The rigs are plain data: no three.js import (D3).

### The rules, in unit tests (`make test`)

9. Every level's warm list allows warm light only for Rowan and his fire family (his shots, the embers, the bells and the weapon pickups): `rowan`, `shot`, `ember`, `bell`, `weaponPickup`, each exactly once; Emberwood alone also allows `lantern`. Emberwood's `lanterns` is non-null and the other two are `null`, consistent with the warm lists (NR101, NFR28).
10. The style guide's four palette checks (§3), with its warm definition (HSL hue from 330° through 360° to 70°, both ends inclusive, and saturation at least 25 %, computed from the hex without rounding):
    1. Outside Rowan's slots (`hero…`), the fire family's slots (`shot`, `ember`, `pickupWarm`, `bell`) and Emberwood's `lantern`, no slot in any level palette is warm.
    2. Emberwood's `lantern` is less saturated than each of `heroSeam`, `heroGlow`, `shot`, `ember`, `pickupWarm` and `bell`.
    3. In the Drowned Mill and Harrowmere, `lantern` is not warm.
    4. `pit` is the darkest slot in each palette (WCAG relative luminance, strictly), and `water` is darker than every slot but `pit`, `foregroundDark` and `ink`.
11. The fire family's slots `shot`, `ember`, `pickupWarm` and `bell` are warm in every palette (NR103: pickups look warm), and Rowan's seven slots plus those four, `checkpoint` and `exit` are identical in all three palettes (style guide §5, "same").
12. No rig's key, fill or fog colour is warm in its own palette (the lights are cold; only the warm list carries warmth).
13. **Drift:** a test parses `docs/STYLE_GUIDE.md`'s frontmatter and fails if any palette module's value differs from it (case-insensitive), or if `LEVEL_PALETTE_SLOTS` differs from the frontmatter's slot names in order, for each level. A changed style guide then fails `make test` until the module follows (D7).
14. The warmth falling from Emberwood to the Drowned Mill to Harrowmere, and pits and deep water reading as dark on screen, are **not** unit-tested: no number defines them. They are judged on screenshots, in this story's critic loop as swatches and bindingly in story 0.12 on the test scene.

### The palettes view

15. **Given** the look-dev page, **when** the palettes view opens (`?view=palettes`), **then** each level's 36 slots show as labelled swatches, each with the module's hex value and the style guide's hex value beside it; a slot whose two values differ is marked visibly (D8). Slots the warm definition calls warm carry a "warm" tag.
16. Each rig shows its key, fill and fog colours as swatches (resolved through that level's palette, labelled with the slot name), the key's and fill's direction and intensity, the fog's depths and amount, the ground fog if any, the lanterns (or "none") and its warm list.
17. The view is DOM only (no renderer), lives in `src/lookdev/palettesView.ts`, is listed in `LOOKDEV_VIEWS` in `assetBrowser.ts`, and has the spot `lookdev-palettes-1080` (1920 × 1080) in `spots.ts`. At 1920 × 1080 it fits with no scrolling, so one shot holds everything (D9).
18. A Playwright check, `tests/e2e/lookdev/palettes.spec.ts`, runs first in `make shots` (as every check in `tests/e2e/lookdev/` does): the view reaches ready with no page error; it shows 3 × 36 slots; every shown module value and style-guide value equals the frontmatter (read in Node through `readFrontmatter` from `scripts/designTokens.ts`); no slot is marked as differing; Emberwood's warm list shows `lantern` and the other two don't; the view doesn't scroll at 1920 × 1080.

### The critic loop

19. **Given** the palettes view at 1920 × 1080, **when** the critic loop runs (`make shots ROUND=n`, at most 3 rounds), **then** each shot is opened and looked at before it is described, every swatch is compared with the style guide, and the three biggest problems are written down, most important first, and fixed.
20. The developer sees the before and after shots and signs off.

### Done means checked

21. `make check`, `make build` and `make shots ROUND=<n>` pass. `make build`'s output is unchanged in kind: no palette or rig module enters `dist/` yet, since nothing in the game's graph imports them (they join the game with Epic 1's stage and Epic 3's materials in use). `make smoke` still passes.

## Tasks / Subtasks

- [x] **T0: Baseline** (AC: all)
  - [x] `git status`: story 0.6's work and the GPU correct-course edits must be committed before this story starts (at story creation, 2026-11-14 18:11, they were **not**: `src/lookdev/`, `src/render/`, `lookdev.html`, the 0.6 story file and others were untracked or modified). If they still aren't, stop and ask the developer to commit them (commit straight on master; push only when asked).
  - [x] Set `baseline_commit` in this file's frontmatter to `git rev-parse HEAD`.
- [x] **T1: `core/color.ts`** (AC: 10, 12) (D4)
  - [x] Move `parseHex` and `relativeLuminance` (with the `WCAG` constants they use, the `Rgba` interface and `CHANNEL_MAX`) from `scripts/checkContrast.ts` into `src/core/color.ts`. `checkContrast.ts` imports them from `../src/core/color.ts` and re-exports `parseHex`, `relativeLuminance` and `Rgba`, so `scripts/checkContrast.test.ts` and `make contrast` don't change. `contrastRatio` and `over()` stay in the script (the `flare` constant can stay there too; split `WCAG` as needed).
  - [x] Add `hsl(hex): { hueDegrees, saturation, lightness }` (hue 0 to < 360, saturation and lightness 0 to 1, no rounding; an achromatic colour has hue 0 and saturation 0). Opaque `#RRGGBB` only; anything else throws an `Error` naming the value (a bug: palette values are compile-time data). `core/invariant.ts` doesn't exist yet and isn't needed for this; don't create it here.
  - [x] `src/core/color.test.ts` (Tests 1–3), test-first.
- [x] **T2: `core/paletteSlots.ts`** (AC: 1, 2)
  - [x] The tuple, `LevelPaletteSlot`, `HexColor`, `LevelPalette`, with a header comment: the order is the slot index (append only); story 0.13 adds the story palettes' own slot union here (style guide §8), separate from the level slots.
- [x] **T3: The three palette modules** (AC: 3, 4, 5)
  - [x] Copy each level's 36 values from the frontmatter, in slot order, one per line, `as const satisfies LevelPalette`. A header comment: source `docs/STYLE_GUIDE.md` (frontmatter `palettes.<key>`), the drift test guards it, change values in the style guide first.
- [x] **T4: `render/palettes/warmth.ts`** (AC: 10, 11, 15) (D5)
  - [x] `WARM_RULE` (hue bounds 330 and 70, minimum saturation 0.25, with the style guide reference), `isWarm(hex)`, `ROWAN_SLOTS` (the seven `hero…` slots), `FIRE_FAMILY_SLOTS` (`shot`, `ember`, `pickupWarm`, `bell`). Typed with `LevelPaletteSlot`.
  - [x] `src/render/palettes/palettes.test.ts` (Tests 4–10), test-first.
- [x] **T5: The lighting rigs** (AC: 6, 7, 8)
  - [x] `src/render/lighting/lightingRig.ts`: `WarmCarrier`, `FIRE_FAMILY` (`rowan`, `shot`, `ember`, `bell`, `weaponPickup`), `LightingRig` and its parts (sketch below).
  - [x] `emberwood.ts`, `drownedMill.ts`, `harrowmere.ts`: one rig each, starting values from the table in Dev Notes, every guess marked †.
  - [x] `src/render/lighting/lighting.test.ts` (Tests 11–14), test-first.
- [x] **T6: The palettes view** (AC: 15, 16, 17)
  - [x] `src/lookdev/palettesView.ts` (`mountPalettesView`), the style-guide source (D8), `lookdev.css` rules prefixed `lookdev-palettes-`.
  - [x] Add `{ id: 'palettes', label: 'Palettes', mount: mountPalettesView }` to `LOOKDEV_VIEWS` (after `renderer`) and `{ id: 'lookdev-palettes-1080', view: 'palettes', width: 1920, height: 1080, animTimeSeconds: 0 }` to `LOOKDEV_SPOTS`.
- [x] **T7: `tests/e2e/lookdev/palettes.spec.ts`** (AC: 18) (Tests 15–19)
- [x] **T8: Throwaway checks** L1–L6 (Dev Notes), each recorded in the Debug Log, then removed.
- [x] **T9: README**: in "The look-dev page and the critic loop", add the palettes view to what the page shows (one clause).
- [x] **T10: `make check`, `make build`, `make smoke`** pass; record the counts.
- [x] **T11: Critic loop** (AC: 19, 20)
  - [x] Rounds 1 to 3 at most: `make shots ROUND=n` (use the next free numbers; check `ls shots/`), open `lookdev-palettes-1080.png`, compare every swatch with the style guide, write the three biggest problems, fix, repeat. Record each round in the Debug Log.
  - [x] Note what the swatches suggest about the warmth fall-off and dark pits and water (AC14), and say that story 0.12 judges them bindingly.
  - [x] Look at the other spots in the round too: nothing else should have changed.
  - [x] Show the developer round 1 and the last round (send the files with SendUserFile) and get his sign-off.
- [x] **T12: Close**: Dev Agent Record, File List, Change Log; status `review`.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). Eight findings were dismissed:
- **Tautological tests** (`FIRE_FAMILY_SLOTS` checked against a literal, `rig.key.color` against `'skyGlow'`): they pin style-guide facts on purpose (AC7).
- **The e2e parser's `String(hex)` coercion:** `readFrontmatter` uses the failsafe schema, so every value is already a string.
- **The three copies of the frontmatter parse:** layer boundaries prevent sharing them (D7, D8).
- **`HexColor` is loose:** TypeScript can't express six hex digits; the regex test covers it.
- **`repeat(0, …)` in the strip grid:** unreachable.
- **The level table exists twice (D8):** `palettes.spec.ts` can't import the view, which uses `?raw`.
- **AC8 † marked per number, not per story name:** a fair reading.
- **Emberwood's key intensity of 1 is marked †:** cosmetic.

- [x] [Review][Decision] `yaml` used beyond its approval. `project-context.md` approved `yaml` for "the token drift test" only. This story also uses it in the look-dev view (`src/lookdev/palettesView.ts`, D8) and in a render test (`src/render/palettes/palettes.test.ts`, D7). Both are development only, and the build was checked free of it. Options: (a) approve the wider use and record it in `project-context.md`; (b) keep `yaml` in tests only, so the view shows module values and the e2e check alone compares them with the guide. **Resolved 2026-11-14: (a), approved by the developer.** The agent's edit to `project-context.md` was blocked by the permission check, so the developer updated its `yaml` line himself.
- [x] [Review][Patch] The warm test is wrong at its inclusive ends: float error puts exact 330°, 70° and 25 % values outside (`#D9BFCC` gives 329.99999999999994°; `#3D4127` gives saturation 0.24999999999999994). Compute `isWarm` exactly in integer channel arithmetic, test the ends with real hex values (`#FE007F`, `#D2FC00`, `#D9BFCC`, `#3D4127`), and correct the false test title "no hex lands on them" [src/render/palettes/warmth.ts:51]
- [x] [Review][Patch] `hsl()` can return saturation slightly above 1 (`#FFFBFD`), against its documented 0 to 1. Clamp it [src/core/color.ts:96]
- [x] [Review][Patch] The drift test ignores a palette the style guide adds that the code lacks. Assert that the guide's palette keys are exactly the three levels [src/render/palettes/palettes.test.ts:113]
- [x] [Review][Patch] AC3's "in slot order" has no check. Assert that each module's `Object.keys` equals `LEVEL_PALETTE_SLOTS` [src/render/palettes/palettes.test.ts:113]
- [x] [Review][Patch] The e2e check never asserts 36 rows of 3 cells outright. Add the counts [tests/e2e/lookdev/palettes.spec.ts:54]
- [x] [Review][Patch] `replace` turns only the first space or minus. Use `replaceAll` in `rigRow` and `formatNumber` [src/lookdev/palettesView.ts]

## Dev Notes

### Current state of the files this story touches

| File | Today | This story | Keep |
| --- | --- | --- | --- |
| `scripts/checkContrast.ts` | Defines and exports `parseHex`, `relativeLuminance`, `Rgba`; private `WCAG`, `CHANNEL_MAX`, `over`, `linear`, `colour` | Moves `parseHex`, `relativeLuminance` (and what they need) to `core/color.ts`; imports and re-exports them | Every export's name and behaviour; `make contrast`; `checkContrast.test.ts` unchanged and green |
| `src/lookdev/assetBrowser.ts` | `LOOKDEV_VIEWS`: overlay, renderer; `buildNavigation` | Adds `palettes` | The list shape, the navigation, `findView` |
| `src/lookdev/spots.ts` | 3 spots; pure data, no imports (the spec imports it in Node) | Adds `lookdev-palettes-1080` | No imports in this file |
| `src/lookdev/lookdev.css` | Page chrome (bar, stats panel, swatch chip backing) | Adds `lookdev-palettes-*` rules | Everything else |
| `README.md` | Look-dev section names the renderer and overlay views | One clause for the palettes view | Everything else |
| `eslint.config.js` | `core/` imports nothing outside itself; `render/` bans app, ui, audio, platform, input, debug, lookdev; `lookdev/` bans three.js, sim, app, audio, platform, input, debug | **No change expected.** If a file needs a rule change, stop and ask | All of it |
| `src/sim/config.ts`, `src/ui/styles/base.css`, DESIGN.md | — | **Not touched**: palettes are look data, not gameplay numbers, and the overlay colours change only in 0.14 | — |

`tests/e2e/lookdev/lookdev.spec.ts` already checks that every view opens, reaches ready, and has at least one spot, so the new view is covered there with no edit.

### Decisions (the developer can veto any at review)

- **D1 — One union, the level slots only.** X-B34 asks for "one string-literal union in `core/`". The style guide (§8) gives the story palettes their own slot list, so a warm `home` or `forge` slot never exists in a level palette. This story writes `LevelPaletteSlot`; story 0.13 adds `StoryPaletteSlot` to the same file. Flagged under AR248 (closest pattern).
- **D2 — The tuple's order is the slot index** (AR164: "assets carry slot indices"). It matches the style guide's table and frontmatter order (checked 2026-11-14: identical across all three palettes). The drift test pins the order; appending a slot means appending in the style guide too.
- **D3 — Data stays three.js-free.** Palettes are hex strings; rigs name slots and hold plain numbers and `{ x, y, z }` objects. `lookdev/` can then show them without a renderer, Node tests need no three.js, and `render/materials/` (0.9) owns every conversion to `Color`, lights and fog (it may import `render/palettes/` and `render/lighting/`, per the boundary table).
- **D4 — Colour maths in `core/color.ts`.** `render/` may not import `scripts/` (boundary table), and `scripts/` may import `core/`, so the existing WCAG luminance moves to `core/` rather than being written twice. The script keeps its exports by re-exporting.
- **D5 — Two helper modules beyond the architecture's file list:** `render/palettes/warmth.ts` (the warm definition and the Rowan and fire-family slot lists) and `render/lighting/lightingRig.ts` (the rig types and `FIRE_FAMILY`). The architecture lists only the per-level files; the closest pattern is one main export per file in the same folder. Flagged under AR248. No new folder.
- **D6 — Rig colours are slot names**, never hex (style guide §2: "colours are palette slots or close to them"). "Close to" is not needed yet; if 0.12 wants a light that isn't a slot, it adds the slot to the style guide first.
- **D7 — The drift test** lives in `src/render/palettes/palettes.test.ts` and reads the style guide through Vite's `?raw` import (`import styleGuide from '../../../docs/STYLE_GUIDE.md?raw'`; `vite/client` declares `*?raw`, checked in `node_modules/vite/client.d.ts`), then parses the frontmatter with `yaml`'s `parse(text, { schema: 'failsafe' })`. Not `node:fs` (ESLint bans Node built-ins in `render/`, tests included), and not `scripts/designTokens.ts` (`render/` may not import `scripts/`). **Unverified:** that Vitest 5 resolves `?raw` for a file outside `src/`; check on the first run. If it fails, stop and report rather than restructure.
- **D8 — The view shows the style guide's values from the style guide itself**, not from the modules, so a mismatch is visible on the page: `palettesView.ts` imports `../../docs/STYLE_GUIDE.md?raw` and parses the frontmatter with `yaml` (an approved development dependency, already used by `scripts/designTokens.ts`; the look-dev page is development only and never built). The frontmatter's level keys are camelCase (`emberwood`, `drownedMill`, `harrowmere`); the view and the tests map them from the level ids `emberwood`, `drowned-mill`, `harrowmere` (the level-id rule) in one small table. If the developer vetoes `yaml` in the browser, the fallback is: the view shows only the module values, and the Playwright check alone compares them with the frontmatter.
- **D9 — Layout for one shot at 1920 × 1080.** One table: a row per slot (36 rows), a column group per level (chip, module hex, style-guide hex), the warm tag beside the chip; the three rigs stacked in a side panel on the right. Page chrome (`lookdev.css`, raw neutral values allowed, D12 of story 0.6), not the overlay: nothing here goes inside `.ui-overlay`. Chips get a hairline border so `pit`, `foregroundDark` and `ink` stay visible on a dark page. Monospace hex values so columns line up.
- **D10 — Fog is measured from the play plane**, in tiles of depth behind it (`startDepth`, `fullDepth`), not from the camera, because the camera distance is set in story 0.10. Materials (0.9) convert. `maxAmount` (0 to 1) keeps the far ridges readable instead of vanishing into fog colour.
- **D11 — Directions are the direction the light comes from**, world axes (x right, y up, z toward the viewer; the play plane is z = 0), unnormalised; materials normalise. "Behind" in the style guide is negative z.

### Module shapes (sketches, not final code)

```typescript
// src/core/paletteSlots.ts
export const LEVEL_PALETTE_SLOTS = [
  'skyFar', 'skyGlow', 'ridgeFar', 'treeMid', 'bark', 'fog', 'groundTop', 'groundSide',
  'ledgeWood', 'foliage', 'foregroundDark', 'ink', 'pit', 'water', 'hazard',
  'heroSkin', 'heroSeam', 'heroGlow', 'heroScarf', 'heroCloth', 'heroLeather', 'heroHorn',
  'shot', 'ember', 'pickupWarm', 'bell', 'checkpoint', 'exit',
  'walkerBody', 'walkerAccent', 'flyerBody', 'flyerAccent', 'spitterBody', 'spitterAccent',
  'seed', 'lantern',
] as const; // 36; the position is the slot index (append only)
export type LevelPaletteSlot = (typeof LEVEL_PALETTE_SLOTS)[number];
export type HexColor = `#${string}`;
export type LevelPalette = Readonly<Record<LevelPaletteSlot, HexColor>>;

// src/render/palettes/emberwood.ts
import type { LevelPalette } from '../../core/paletteSlots.ts';
export const EMBERWOOD_PALETTE = {
  skyFar: '#254049',
  // … all 36, in slot order
  lantern: '#E0A86A',
} as const satisfies LevelPalette;

// src/render/lighting/lightingRig.ts
import type { LevelPaletteSlot } from '../../core/paletteSlots.ts';
export type WarmCarrier = 'rowan' | 'shot' | 'ember' | 'bell' | 'weaponPickup' | 'lantern';
export const FIRE_FAMILY = ['rowan', 'shot', 'ember', 'bell', 'weaponPickup'] as const satisfies readonly WarmCarrier[];
export interface Direction { readonly x: number; readonly y: number; readonly z: number }
export interface RigLight {
  readonly color: LevelPaletteSlot;
  readonly from: Direction;       // where the light comes from (D11)
  readonly intensity: number;     // relative, † (0.9 maps it; 0.12 judges it)
}
export interface RigFog {
  readonly color: LevelPaletteSlot;
  readonly startDepth: number;    // tiles behind the play plane where fog begins (D10) †
  readonly fullDepth: number;     // tiles behind the play plane where it reaches maxAmount †
  readonly maxAmount: number;     // 0..1 †
}
export interface RigGroundFog { readonly color: LevelPaletteSlot; readonly heightTiles: number; readonly maxAmount: number }
export interface RigLanterns { readonly color: LevelPaletteSlot; readonly reachTiles: number; readonly intensity: number }
export interface LightingRig {
  readonly key: RigLight;
  readonly fill: RigLight;
  readonly fog: RigFog;
  readonly groundFog: RigGroundFog | null;
  readonly warmLight: readonly WarmCarrier[];
  readonly lanterns: RigLanterns | null;
}
```

Rowan's and the fire family's own small point lights (style guide §2: "about 1 to 2 tiles †; story 0.9 decides whether real lights or emissive-only") are **not** in the rig: 0.9 decides them. The warm list only says who may carry warm light.

### Starting rig values (all †; story 0.12 judges them on the test scene)

From the style guide's lighting table. Intensities are relative to Emberwood's key = 1.

| | Emberwood | The Drowned Mill | Harrowmere |
| --- | --- | --- | --- |
| Key | `skyGlow`, from upper right and behind `{ x: 0.6, y: 0.8, z: -0.5 }`, 1.0 (medium) | `skyGlow`, from overhead `{ x: 0, y: 1, z: 0.2 }`, 0.6 (low, overcast) | `skyGlow`, from the high left `{ x: -0.6, y: 0.9, z: 0.3 }`, 0.8 (low to medium, flat) |
| Fill | `bark` (plum), from the lower left `{ x: -0.6, y: -0.3, z: 0.7 }`, 0.35 | `treeMid` (teal-grey), from the front `{ x: 0, y: -0.2, z: 1 }`, 0.3 | `treeMid` (blue-grey), from the front right `{ x: 0.4, y: -0.1, z: 1 }`, 0.3 |
| Fog | `fog`, start 4, full 40, max 0.85 (from the middle distance back) | `fog`, start 2, full 25, max 0.9 (densest, starts nearer) | `fog`, start 3, full 32, max 0.85 (medium haze) |
| Ground fog | `null` | `fog`, height 1 tile, max 0.5 (low fog over water) | `null` |
| Warm list | `rowan`, `shot`, `ember`, `bell`, `weaponPickup`, `lantern` | the fire family | the fire family |
| Lanterns | `lantern`, reach 1.5 tiles, intensity 0.6 (short reach; lights only the ledge or trunk it hangs from) | `null` | `null` |

The fill directions for the Drowned Mill and Harrowmere aren't in the style guide; they are guesses, flagged in the rig comments. "Thickest over pits" (Emberwood fog) is a staging and materials matter (0.9, 0.12), not rig data.

### Tests

**Vitest, Node** (`make test`). Tests import the modules and the style guide's values; they never retype a palette's hex values (generic colour-maths cases such as `#FF0000` are fine).

`src/core/color.test.ts`
1. `hsl('#FF0000')` → hue 0, saturation 1, lightness 0.5; `'#00FF00'` → 120; `'#0000FF'` → 240; `'#808080'` → saturation 0.
2. The style guide's measured values: Emberwood `lantern` (`#E0A86A`) saturation ≈ 0.6556; `bell` ≈ 0.7051; `hazard` (`#CFC6B6`) hue ≈ 38°, saturation ≈ 0.207 (read the hex from the palette module, compare with `toBeCloseTo`).
3. `parseHex` and `relativeLuminance` behave as before (the existing `checkContrast.test.ts` cases still pass through the re-export; add one direct test in `core/`).

`src/render/palettes/palettes.test.ts`
4. Drift (AC13): for each level, the module's entries equal the frontmatter's (case-insensitive), and `LEVEL_PALETTE_SLOTS` equals `Object.keys(frontmatter.palettes[key])` in order.
5. Every value matches `/^#[0-9A-F]{6}$/i`.
6. Check 1 (AC10.1): no slot outside `ROWAN_SLOTS`, `FIRE_FAMILY_SLOTS` and Emberwood's `lantern` is warm, in any palette. Expected warm today: `heroSeam`, `heroGlow`, `heroScarf`, `heroHorn`, `shot`, `ember`, `pickupWarm`, `bell` everywhere, plus `lantern` in Emberwood (measured 2026-11-14).
7. Check 2 (AC10.2): Emberwood's `lantern` saturation is below each of the six.
8. Check 3 (AC10.3): `lantern` is not warm in the Drowned Mill or Harrowmere.
9. Check 4 (AC10.4): `pit` strictly darkest; `water` darker than every slot except `pit`, `foregroundDark`, `ink`. (Today, Emberwood's order is pit, foregroundDark, ink, water; the other two have water above ink.)
10. AC11: the fire-family slots are warm in every palette; the 13 shared slots are equal across the three.

`src/render/lighting/lighting.test.ts`
11. AC9: each rig's warm list contains every `FIRE_FAMILY` member exactly once and nothing else, except Emberwood, which also has `lantern` once.
12. AC9: `lanterns` is non-null exactly for the rigs whose warm list has `lantern` (Emberwood only).
13. AC12: key, fill and fog colours (and the ground fog's, if any) are not warm in that level's palette.
14. Sanity: intensities > 0, `0 < maxAmount ≤ 1`, `0 ≤ startDepth < fullDepth`, no zero-length direction. These are shape checks, not tuning; they import nothing but the rigs.

**Playwright, Chromium, dev server** (`make shots` runs it first): `tests/e2e/lookdev/palettes.spec.ts`. Use `waitForLookdevReady` from `tests/e2e/lookdevReady.ts` and the error helpers from `tests/e2e/pageErrors.ts`, as `lookdev.spec.ts` does.
15. `?view=palettes` reaches ready with no console error, page error or failed request.
16. The page shows 36 slot rows and, per level, a module value and a style-guide value for each (mark them with data attributes, for example `data-level`, `data-slot`, `data-source="module|guide"`, so the check reads values, not layout).
17. Every shown value equals the frontmatter (read with `readFrontmatter` from `scripts/designTokens.ts` and `node:fs`, as `lookdev.spec.ts` reads DESIGN.md), case-insensitive; no row carries the mismatch mark.
18. The rig panels: Emberwood's warm list includes `lantern`, the other two don't; each shows key, fill and fog.
19. At 1920 × 1080, the view's root element (for example `.lookdev-palettes`, given `overflow: auto` so overflow is measurable) has `scrollHeight - clientHeight` and `scrollWidth - clientWidth` both 0, as `lookdev.spec.ts` checks the overlay root. Never check `html` (`html, body` are `overflow: hidden`, so that check can't fail; 0.6 review).

### Throwaway checks (create, run, record the output, delete)

| # | Change | Run | Expected |
| --- | --- | --- | --- |
| L1 | Delete `lantern` from `harrowmere.ts` | `make typecheck` | fails: property missing for `LevelPalette` |
| L2 | Add `torch: '#FF0000'` to `emberwood.ts` | `make typecheck` | fails: unknown property |
| L3 | Change one hex in `drownedMill.ts` | `make test` | the drift test fails, naming the slot; `make shots` would also show the mismatch mark |
| L4 | Add `lantern` to `HARROWMERE_RIG.warmLight` | `make test` | the warm-list test fails |
| L5 | Make Emberwood `walkerBody` warm (`#C04020`) | `make test` | check 1 fails, naming the slot (and the drift test) |
| L6 | `src/core/zz.ts` imports `../render/palettes/emberwood.ts` | `make lint` | fails: `core/` imports nothing outside itself |

### What the critic loop judges here

The view is a judging tool and the first look at the three palettes side by side. Check: are the chips true to their hex values, is every label and hex legible at 1920 × 1080, are the darkest chips (`pit`, `foregroundDark`, `ink`, `water`) distinguishable from the page and from each other, are the warm tags on exactly the expected slots, do the rig panels read plainly. Then the look itself, as far as swatches show it: does warmth fall from Emberwood to the Drowned Mill to Harrowmere; does each level have its one dominant colour (teal, grey-teal, ash grey); do the enemy bodies stand apart from their level's ground and foliage. Problems in the palette *values* are not fixed here: they go to the developer, and values change in the style guide first (drift test), normally in story 0.12. "Hero, enemies, hazards and pickups stand out at a glance" has no scene to check yet; say so in each round.

### Previous story intelligence (0.6)

- The look-dev page: `LOOKDEV_VIEWS` in `assetBrowser.ts` (`{ id, label, mount(host, { spot }) }` returning `{ frame(timeSeconds), dispose() }`); `?view=` and `?spot=`; `<html data-lookdev-ready>` is `false`, `true` after the first frame plus fonts plus one frame, or `error`. A view whose `mount` throws ends in `error` with the message on the page. A DOM-only view still returns a `frame` (a no-op is fine) so the ready flow works.
- Spots show no bar (headless shot artifact over the canvas); the palettes view has no canvas, but keep the rule.
- `tests/e2e/lookdev/lookdev.spec.ts` already fails if a view has no spot, or a spot names a missing view.
- Playwright specs import `.ts` files from `src/` and `scripts/` with `.ts` extensions (checked in 0.6).
- Page chrome may use raw neutral colours (D12 of 0.6); everything inside `.ui-overlay` uses tokens only. This view is chrome.
- Lint lessons: `instanceof` narrowing to `any`-typed generics trips `no-unsafe-argument`; use type guards. `arr[0]?.x` is "unnecessary condition" without `noUncheckedIndexedAccess`: use `.at(0)`. Wrap methods passed as values (`unbound-method`).
- Every browser test runs WebGL on the GTX 1650 (`GPU=nvidia`, the Makefile default). This view doesn't render WebGL, but `make shots` runs the renderer checks too; keep `GPU=nvidia`.
- `make shots` refuses a round that exists; rounds 0–5 and others may already exist in `shots/` (git-ignored). Pick the next free numbers.
- Review patterns to pre-empt: checks that compare the page with itself (compare with the source document instead); scroll checks on `html` that can never fail; ready flags set too early.
- **Git:** one commit per story, `<what>: story 0.N, reviewed and done`, straight on master; commit only when the developer asks.

### Latest technical notes

- No three.js API is used in this story (D3), so no r187 check is needed. Story 0.9 checks `Color`, lights and `Fog` against r187's docs when it converts this data.
- Vite 8.3: `?raw` imports are declared in `vite/client` (`declare module '*?raw'`, `node_modules/vite/client.d.ts`); the root tsconfig already includes `vite/client` types. The dev server serves files under the project root, so `docs/STYLE_GUIDE.md` is reachable.
- `yaml` 2.9.1 (pinned): `parse(text, { schema: 'failsafe' })` keeps every scalar as written text, as `scripts/designTokens.ts` does. The frontmatter is the block between the first two `---` lines (copy `designTokens.ts`'s `FRONTMATTER` pattern and BOM handling; don't import the script into `render/` or `lookdev/`, since it imports `prettier` and `node:url`).
- TypeScript 6: `as const satisfies T` keeps literal types and checks the shape; excess and missing properties both fail on an object literal.

### Project structure notes

- New: `src/core/paletteSlots.ts`, `src/core/color.ts`, `src/core/color.test.ts`; `src/render/palettes/{emberwood,drownedMill,harrowmere,warmth}.ts`, `src/render/palettes/palettes.test.ts`; `src/render/lighting/{emberwood,drownedMill,harrowmere,lightingRig}.ts`, `src/render/lighting/lighting.test.ts`; `src/lookdev/palettesView.ts`; `tests/e2e/lookdev/palettes.spec.ts`.
- Changed: `scripts/checkContrast.ts` (D4), `src/lookdev/assetBrowser.ts`, `src/lookdev/spots.ts`, `src/lookdev/lookdev.css`, `README.md`.
- New folders `src/render/palettes/` and `src/render/lighting/` are named by the architecture. No other new folder. No new dependency.
- `render/palettes/story.ts` is story 0.13's, not this story's.

### Project context rules

- TypeScript strict; relative imports carry `.ts`; `import type` for types; no enums, namespaces or parameter properties; string-literal unions; booleans `is…`/`has…`/`can…`; every `switch` on a union ends in `assertNever`.
- `core/` imports nothing. `render/` may import `core/` and `content/`; `render/materials/` may import `render/palettes/` and `render/lighting/`. `lookdev/` may import `render/`, `ui/`, `content/`, `core/`. Only `render/` imports three.js (none here).
- Palettes and lighting are data in `render/palettes/` and `render/lighting/` (project-context, "Where things go"); gameplay numbers stay in `sim/config.ts` (none added).
- One main export per file, camelCase file names, no barrel files.
- Log only through `core/log.ts` (`render` channel for data problems, `ui` for the view).
- Run commands through `make`; run `make check` before saying a change works.
- Look at every screenshot before describing it; never claim a render you didn't see.
- Ask before adding a dependency, changing the folder structure or changing a tuned number. Palette values are the developer's (style guide, approved); never retune them here.

### References

- Epic and story: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md`, Epic 0, Story 0.7 (and 0.9, 0.10, 0.12, 0.13 for what reads this data).
- Requirements: `requirements-inventory.md`: NR100–NR104, NFR28, NFR29, AR164, AR165, AR248, X-B34.
- `docs/STYLE_GUIDE.md`: frontmatter `palettes:`; §2 Shading, Lighting per level; §3 Warm light (the definition and the four checks); §5 Palettes; §7 Enemies; §8 Story cards (separate slot list).
- Architecture `game-architecture.md`: Rendering Structure (palette module, lighting rig); Configuration (look data row); Source Structure (`render/palettes/`, `render/lighting/`); Architectural Boundaries; Consistency Rules.
- Previous story: `_bmad-output/implementation-artifacts/0-6-build-the-look-dev-page-and-the-screenshot-harness.md`.
- Code: `scripts/checkContrast.ts` (`parseHex`, `relativeLuminance`), `scripts/designTokens.ts` (`readFrontmatter`, `parseYaml`), `src/lookdev/*`, `tests/e2e/lookdev/lookdev.spec.ts`, `tests/e2e/lookdevReady.ts`, `tests/e2e/pageErrors.ts`.

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code.

### Debug Log References

- **T0:** story 0.6 was committed by the developer (`2ea6e9f`) before work started; `baseline_commit` is set to it.
- **Red, then green, per task:**
  - `src/core/color.test.ts` failed first (no `color.ts`), then passed: 183 → 191 tests. `scripts/checkContrast.test.ts` passed unchanged through the re-exports, and `make contrast` prints the same 25 of 25 targets met.
  - `src/render/palettes/palettes.test.ts` failed first (no palette modules), then passed: 217 tests.
  - `src/render/lighting/lighting.test.ts` failed first (no rigs), then passed: 236 tests.
- **Deviation from the story's Tests section:** Test 2 (the style guide's measured figures for `lantern`, `bell` and `hazard`) reads its hex values from the palette modules, but `core/` may import nothing outside itself, tests included (ESLint). So it lives in `palettes.test.ts`, not `color.test.ts`. `color.test.ts` checks the same arithmetic on `#E0A86A` with literal channel maths instead.
- **Own test mistakes caught before the first run:**
  - `#FF00AA` has hue 320°, not warm; the expectation was corrected.
  - No `#RRGGBB` value lands exactly on 330° or 70°, so the inclusive ends are tested through a new `isWarmHsl()` beside `isWarm()`.
- **Unverified item from the story, now checked:** Vitest 5 resolves `import … from '../../../docs/STYLE_GUIDE.md?raw'` for a file outside `src/`. The drift test reads the real file: L3 below fails on a one-digit change.
- **The palette modules were generated** from the frontmatter by a scratch script (`yaml`, failsafe schema), so no value was retyped by hand. The script was not kept; the drift test guards the result.
- **Throwaway checks** (each change made, run, then restored from a scratchpad copy; `cmp` confirmed every file byte-identical afterwards, and `make test` went back to 236):
  - L1, `lantern` deleted from `harrowmere.ts`: `make typecheck` fails at `src/render/palettes/harrowmere.ts(45,12): error TS1360` (does not satisfy `LevelPalette`), and at every use site.
  - L2, `torch: '#FF0000'` added to `emberwood.ts`: `error TS2353: Object literal may only specify known properties, and 'torch' does not exist`.
  - L3, Drowned Mill `bark` changed to `#3A3639`: the drift test fails, "drownedMill.bark: expected '#3A3639' to be '#3A3638'".
  - L4, `lantern` added to `HARROWMERE_RIG.warmLight`: 2 tests fail ("allows nothing else warm", "has no lanterns, matching its warm list").
  - L5, Emberwood `walkerBody` set to `#C04020`: check 1 fails with `[ 'walkerBody' ]`, and the drift test fails too.
  - L6, `src/core/zz.ts` importing `../render/palettes/emberwood.ts`: `make lint` fails, "core/: core/ imports nothing outside itself".
- **Formatting:** the first `make check` flagged 3 new files for Prettier; they were formatted with Prettier on those files only.
- **One look-dev run outside `make`:** Playwright was run directly once against the dev server while writing `palettes.spec.ts`. Without the Makefile's `GPU=nvidia`, its GTX 1650 check skipped. Every recorded run below went through `make shots`, where it passes.
- **T10, final runs:**
  - `make check`: exit 0, with 9 test files and 236 tests (183 before; 8 colour, 26 palette and 19 lighting tests added).
  - `make smoke`: 3 passed, 1 skipped (by design: the `dist/` check runs in Chromium only). Budgets OK at 878 bytes in 2 files, the same as after story 0.6. A grep of `dist/` for `skyGlow`, `STYLE_GUIDE`, `EMBERWOOD`, `warmLight` and `#254049` finds nothing, so no palette, rig or style-guide content ships (AC21).
- **T11, critic round 6** (`shots/round-6/`; rounds 1–5 belong to story 0.6). 15 look-dev checks passed, the GTX 1650 check included, then 4 shots. All four were opened:
  - The overlay views at 1080 and 720 and the renderer view are unchanged from story 0.6 (DESIGN.md's provisional values, as expected; GPU "NVIDIA GeForce GTX 1650").
  - In the palettes shot, all 108 cells show the module value beside an identical style-guide value, with no mismatch mark. The warm tags sit on `heroSeam`, `heroGlow`, `heroScarf`, `heroHorn`, `shot`, `ember`, `pickupWarm` and `bell` in every level, and on `lantern` in Emberwood only.

  The three biggest problems with the view as a judging tool:
  1. No side-by-side view of the levels. The colours that change between levels sit in a 36-row column among 13 rows that are identical everywhere, so the warmth fall-off, each level's dominant colour and enemy bodies against ground can't be judged at a glance. **Fix:** a "levels side by side" panel, one row of large chips per level for the slots that differ, computed from the palettes.
  2. The darkest chips (`foregroundDark`, `ink`, `pit`, `water`) read as holes in the page background (`#1c1c1e`). **Fix:** a mid-grey mat (`box-shadow` ring) around every chip.
  3. No grouping in the table. **Fix:** labelled group rows (World, Rowan, Fire family and markers, Enemies, Lanterns), with "the same in every level" added where the palettes say so (computed).

  Minor: "height 1 tiles" now reads "1 tile".
- **T11, critic round 7** (`shots/round-7/`, opened). All three are fixed, and the strips show the warmth falling from Emberwood to Harrowmere. Remaining:
  1. The strip chips had no labels, and a shot can't hover. **Fix:** vertical slot names under the strips.
  2. The strip grid stretched its label column (about 200 px of dead space), pushing the Lanterns chip to the window edge. **Fix:** `justify-content: start`, and the column template is computed from the number of groups.
- **T11, critic round 8** (`shots/round-8/`, opened). Both are fixed, and the view still fits 1920 × 1080 (the check passes). This was the third round, the limit, so the loop stopped.
- **AC14, what the swatches suggest** (story 0.12 judges these bindingly on the test scene):
  - The warmth falls as intended: teal with the only warm lantern in Emberwood, grey-teal in the Drowned Mill, ash grey in Harrowmere.
  - `pit` and `water` are the darkest chips in each level, next to the ground chips.
  - **Watch items for 0.12** (values not touched; they are the developer's):
    - the Drowned Mill's `walkerBody` `#35606A` and `flyerBody` `#2B4560` are close in value to its `fog` and `treeMid`;
    - Emberwood's `flyerBody` `#3E2F55` is about as dark as `treeMid` and `groundSide`;
    - Harrowmere's `hazard` `#C8CCD0`, `exit` `#DCE8EA` and `seed` `#D3DCE8` are near-identical pale greys;
    - `hazard` against `heroHorn` is already on the style guide's list.
- **Sign-off:** round 6 and round 8 of `lookdev-palettes-1080.png` were sent to the developer (SendUserFile). He signed off on the view (AskUserQuestion, 2026-11-14).

- **Code review fixes (2026-11-14),** after the developer resolved the decision as (a) and chose to apply every patch:
  - **Exact warm test:** written test-first. The new boundary test failed on `#D9BFCC` (exact 330°), then passed with `isWarm` computed in whole numbers on the 0–255 channels. `isWarmHsl` was removed, since a float test of the ends can't be exact.
    - A sweep of all 16.7M colours found 1,398 where the exact and float versions differ, and every one sits exactly on an end, where the exact test (correctly) calls it warm.
    - No palette value changes its verdict.
  - **`hsl()` clamps saturation to 1:** test-first; `#FFFBFD` and `#040002` gave 1.000000000000007 and 1.0000000000000036.
  - **New guards:** the style guide must have exactly the three level palettes; each module's keys must be in slot order; the e2e check asserts 36 rows of 3 cells. All pass on today's data.
  - **`replaceAll`** in `rigRow` and `formatNumber`.
  - **Final runs:** `make check` exit 0 with 241 tests. `make smoke` 3 passed, 1 skipped, budgets OK at 2 files. `make shots ROUND=9`: 15 look-dev checks and 4 shots pass. The palettes shot was looked at and is unchanged from round 8.

### Completion Notes List

- **Slots (AC1–AC2):** `src/core/paletteSlots.ts` holds the 36 slots as one `as const` tuple in the style guide's order (the slot index; append only), plus `LevelPaletteSlot`, `HexColor` and `LevelPalette`. Story 0.13 adds the story palettes' own union to this file (D1).
- **Palettes (AC3–AC5):** three modules of plain hex strings (`EMBERWOOD_PALETTE`, `DROWNED_MILL_PALETTE`, `HARROWMERE_PALETTE`), each `as const satisfies LevelPalette`. The type checker rejects a missing or unknown slot (L1, L2). There are no three.js imports.
- **Rigs (AC6–AC8):** `lightingRig.ts` defines `LightingRig`, `WarmCarrier` and `FIRE_FAMILY`. The three rigs hold key, fill, fog, ground fog, warm list and lanterns. Colours are slot names, and every number is marked † with its tuning stories (0.9, 0.12). The fill directions for the Drowned Mill and Harrowmere are guesses, said so in their comments.
- **Rules (AC9–AC13):** the warm definition is in `render/palettes/warmth.ts` (`WARM_RULE`, `isWarm`, `isWarmHsl`, `ROWAN_SLOTS`, `FIRE_FAMILY_SLOTS`). Tests cover:
  - the warm lists, and lanterns in Emberwood only;
  - the style guide's four palette checks;
  - the fire family warm everywhere, and the 13 shared slots identical;
  - cold key, fill and fog;
  - the drift test against `docs/STYLE_GUIDE.md`, values and slot order.
- **Colour maths (D4):** `parseHex` and `relativeLuminance` moved to `src/core/color.ts`, with a new `hsl()`. `scripts/checkContrast.ts` imports them and re-exports them, so its tests and `make contrast` don't change. It keeps only the WCAG flare constant.
- **View (AC15–AC18):** `src/lookdev/palettesView.ts` is DOM only. It shows the slot table, grouped, with the module's hex beside the style guide's (read from the file itself, D8), mismatch marking and warm tags. It also shows the three rigs and a labelled side-by-side strip of the slots that differ per level. It is registered in `LOOKDEV_VIEWS`, with spot `lookdev-palettes-1080`. `tests/e2e/lookdev/palettes.spec.ts` compares the page with the frontmatter read in Node and checks the rigs and no scrolling (4 checks).
- **Beyond the story's text, within its tasks:**
  - the side-by-side strip and the group rows came from the critic loop;
  - `isWarmHsl()` exists so the inclusive hue ends can be tested.
- **For later stories:**
  - 0.9 converts these hex values and rigs into colours, lights and fog inside `render/materials/` (which may import `render/palettes/` and `render/lighting/`). It decides what a rig intensity means for banded shading, and whether Rowan's fire family carries real point lights.
  - 0.10 swaps levels by swapping palette and rig. A small level-to-look table may be worth lifting out of `palettesView.ts` then.
  - 0.12 judges the rig numbers and the watch items above on the test scene.
  - 0.13 adds `StoryPaletteSlot` and `render/palettes/story.ts`.

### File List

- `src/core/color.ts` (new)
- `src/core/color.test.ts` (new)
- `src/core/paletteSlots.ts` (new)
- `src/render/palettes/emberwood.ts` (new)
- `src/render/palettes/drownedMill.ts` (new)
- `src/render/palettes/harrowmere.ts` (new)
- `src/render/palettes/warmth.ts` (new)
- `src/render/palettes/palettes.test.ts` (new)
- `src/render/lighting/lightingRig.ts` (new)
- `src/render/lighting/emberwood.ts` (new)
- `src/render/lighting/drownedMill.ts` (new)
- `src/render/lighting/harrowmere.ts` (new)
- `src/render/lighting/lighting.test.ts` (new)
- `src/lookdev/palettesView.ts` (new)
- `tests/e2e/lookdev/palettes.spec.ts` (new)
- `scripts/checkContrast.ts` (modified: imports and re-exports the colour maths from `core/color.ts`)
- `src/lookdev/assetBrowser.ts` (modified: the palettes view)
- `src/lookdev/spots.ts` (modified: `lookdev-palettes-1080`)
- `src/lookdev/lookdev.css` (modified: `lookdev-palettes-*` rules)
- `README.md` (modified: the look-dev page shows the palettes and rigs)
- `_bmad-output/implementation-artifacts/0-7-put-the-level-palettes-and-lighting-rigs-in-data.md` (this story)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)
- `_bmad-output/project-context.md` (modified by the developer at code review: the `yaml` approval widened)

## Change Log

- 2026-11-14: Story created (ready-for-dev).
- 2026-11-14: Story implemented.
  - Added: the slot union in `core/`, three palettes and three lighting rigs as typed data, the warm rule and `core/color.ts`, and the look-dev palettes view with its Playwright check.
  - Tests: 53 new (236 in all) and 4 new look-dev checks (15 in all). Six throwaway checks behaved as specified.
  - Three critic rounds (6–8) fixed 5 problems with the view, and the developer signed off. Status set to review.
- 2026-11-14: Code review.
  - 1 decision resolved: (a), the wider use of `yaml` approved, with `project-context.md` updated by the developer. 6 patches applied, 0 deferred, 8 dismissed.
  - The main fix: the warm test is now exact at its inclusive ends.
  - 241 tests and 15 look-dev checks pass. Status set to done.

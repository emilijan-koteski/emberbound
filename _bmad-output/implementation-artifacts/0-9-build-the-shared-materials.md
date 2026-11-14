---
baseline_commit: 6468b3e6049d9445f8d51f07699f3c2111a32dac
---

# Story 0.9: Build the shared materials

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want one set of material factories that draws everything in the chosen style from the level's palette and light,
so that any model, from any tool, ends up looking like part of the same game.

**Requirements:** NFR33, PR23, AR160, AR161, AR165 (plus NR102 and NFR28 through the warm and dark rules)
**Epic:** 0, Reference and style lock. Stories 0.1 to 0.8 are done (`6468b3e`). This is the first story that draws the game's look in the engine. It reads 0.7's palettes and rigs and owns every shader in the game. 0.10 adds the view camera and depth layers; 0.11 adds the shadow decision and the outline pass to `render/materials/`; 0.12 builds the test scene from these factories; 0.13 uses the card-silhouette factory.

## Acceptance Criteria

The epic's ACs, made exact. Where this story reads the epic one way of several, the decision is in Dev Notes › Decisions (D1–D14), and the developer can veto it at review.

### The factories

1. **Given** `docs/STYLE_GUIDE.md` §2 (Shading), **then** `src/render/materials/` exports seven factories, one per file: `createGroundMaterial`, `createFoliageMaterial`, `createCharacterMaterial`, `createPropMaterial`, `createEffectMaterial`, `createBackdropMaterial`, `createCardSilhouetteMaterial`. Each returns a three.js `ShaderMaterial` built from one shared GLSL module (D1), and each applies the shading rule as its kind needs:
   - **Banded** (ground, foliage, character, prop): exactly 3 tones, lit, mid and shadow, with hard steps between them and no gradient across a surface. Mid is the slot's value as it is. Lit is the slot lifted toward the key light's colour; shadow is the slot pulled toward the fill light's colour (D3). No specular, no rim light, no texture.
   - **Ground:** the `top` slot on faces whose world normal points up (y at or above `groundTopFrom` †), the `side` slot elsewhere (D6).
   - **Foliage:** both faces drawn; a back face is shaded with its normal flipped, so thin planes band the same from either side.
   - **Character:** banded; or, with `isGlowing`, unshaded (for Rowan's seams, chest and eyes). Works on a `SkinnedMesh`.
   - **Effect:** unshaded. The slot's colour at full brightness, ignoring the bands (shots, embers, the bell's glint, lantern glass).
   - **Backdrop:** one flat tone, the slot's value, with fog (D7).
   - **Card silhouette:** one flat fill from its slot, with no light and no world fog (style guide §8; 0.13 adds what a card needs).
   - **Fog** applies to every kind except the card silhouette, glowing parts included.
2. Every factory's material draws correctly on a plain `Mesh`, an `InstancedMesh` and a `SkinnedMesh`: the vertex shader is built from three.js's own skinning, instancing, batching and morph chunks, in the order r187's `meshlambert` uses (Dev Notes › The shader). The look-dev view shows one instanced and one skinned shape to prove it (D10).
3. **The `pit` and `water` slots never get lighter than themselves:** their lit tone equals their mid tone, and they take no warm light (NR102; style guide §3: "pits and deep water read as dark"; §2: "no warm light ever reaches into a pit").

### The shader boundary

4. **Given** the rest of `src/`, **then** no module outside `src/render/materials/` contains GLSL, imports `ShaderMaterial`, `RawShaderMaterial`, `ShaderChunk`, `ShaderLib`, `UniformsLib` or `UniformsUtils`, or uses `onBeforeCompile` (AR160; D11):
   - ESLint catches the imports (the existing `three.shaderNames` rule, with its `importNames` extended) and any `onBeforeCompile` member, property or method (a new `no-restricted-syntax` rule), in every layer except `render/materials/`;
   - `src/render/materials/shaderBoundary.test.ts` searches every `src/**/*.ts` file outside `render/materials/` for GLSL and finds none, finds GLSL inside `render/materials/` (a control, so the search can't pass by matching nothing), and finds no `.glsl`, `.vert` or `.frag` file anywhere in `src/`.
5. **No colour literal in the materials' code:** the same test fails on a `#RGB`, `#RRGGBB` or `0xRRGGBB` literal in any non-test file under `render/materials/`, with comments stripped before the search. Colours come from palette slots only.

### Palette slots

6. **Given** a material from a factory, **then** its colours come from palette slots, never from colour literals: every factory option that sets a colour is typed `LevelPaletteSlot`, and a `@ts-expect-error` line in a test proves a hex string is rejected by `make typecheck`.
7. **Given** `createLook(palette, rig)` in `src/render/materials/look.ts` (D2), which holds the uniforms every material made from it shares, **when** `look.apply(otherPalette, otherRig)` runs, **then** every material made from that look recolours in place: the same material objects, `material.version` unchanged (no shader recompile), no other change.
8. **Given** one enemy stand-in (a material for `walkerBody`), **when** the look is applied with each of the three level palettes in turn, **then** its tones equal that palette's `walkerBody` tones each time, by slot alone (unit test); and the look-dev view shows the stand-in under all three levels' looks side by side (AC17).
9. **Given** `src/render/materials/tones.ts`, **then** the lit, mid and shadow colours of every slot are computed in TypeScript from the palette, the rig and the shading settings, and uploaded as uniforms; the shader only picks one (D3). Unit tests, for every slot in every palette: mid equals the slot's colour exactly; lit is nearer the key colour than mid is; shadow is nearer the fill colour than mid is; for `pit` and `water`, lit equals mid.

### The lighting rig

10. **Given** a level's rig, **when** materials are lit by it, **then** they take its key, fill and fog:
    - key and fill colours are `palette[rig.key.color]` and `palette[rig.fill.color]`; their directions are `rig.key.from` and `rig.fill.from`, normalised; their intensities are the rig's;
    - the fog is measured in tiles **behind the play plane** (`-z`), from `startDepth` to `fullDepth`, capped at `maxAmount`, in `palette[rig.fog.color]` (0.7, D10). It is the materials' own fog: `scene.fog` stays null and three.js's fog chunks are not used (D5);
    - the ground fog (the Drowned Mill) fades with height from a base height, a uniform the stage sets (0 by default), up `heightTiles`, from `maxAmount` at the base; where the rig has none, its amount is 0;
    - every per-level value is a uniform, never a `#define`, so switching levels never compiles a shader (AC18 checks it).
11. **What a rig intensity means for banded shading** (the question 0.7 left to this story): the key and fill together decide which tone a surface takes; the shading settings decide what each tone looks like (D4). Every number lives in `src/render/materials/shading.ts` (`SHADING`), each marked † with a comment naming the critic loop of this story and story 0.12. The meaning is written in `shading.ts`'s header and in `docs/STYLE_GUIDE.md` §2, Shading, replacing "set in story 0.9".
12. **Warm light falls only on what the rig lists** (NFR28):
    - warm point lights are set with `look.setWarmLights(…)`, each naming its `WarmCarrier` and position. A carrier missing from `rig.warmLight`, or one that carries no light (D8), or more lights than `SHADING.maxWarmLights` †, is a bug: `invariant` throws;
    - lantern lights take `rig.lanterns` (colour slot, reach, intensity), so they exist only in Emberwood;
    - a glowing material (an effect, or a glowing character part) whose slot is warm in the current palette must name a carrier the rig lists; an effect whose slot is cold may name none; anything else throws;
    - `look.apply()` to a rig that doesn't list a carrier drops that carrier's lights;
    - a warm light lights only surfaces within its reach that face it, with a hard edge at the reach; pit and water surfaces, backdrops, card silhouettes, effects and glowing parts take none (AC3);
    - unit-tested for all three rigs.
13. **Rowan's fire family and their lights** (style guide §2: "story 0.9 decides whether real lights or emissive-only, and which members get one"): Rowan and his shots carry a real short warm light, and embers, bells and weapon pickups glow but light nothing (D8; the developer's choice at story creation, 2026-11-14). The lights' colour slot, reach and intensity † are plain data in `src/render/lighting/fireLights.ts`. The decision replaces the parenthesis in style guide §2 (Lighting, per level).

### The materials view

14. **Given** the look-dev page, **when** the materials view opens (`?view=materials`, optionally `&level=<level id>`; Emberwood by default), **then** each factory shows on a box, a sphere, a plane and a capsule, one row per factory, under the palette and rig of the level picked on the page. Each row is labelled with its factory and its slots, and each slot shows its lit, mid and shadow tones as swatches with hex values (mid marked as the style guide's value).
15. Beside the rows: the chosen key art (`art-src/reference/emberwood-key-art-mix.jpeg`, labelled as the Emberwood reference and the only key art; D12), the level's rig (key, fill and fog colours), a level picker and the renderer statistics (draw calls and shader programs at least, reusing the renderer view's panel).
16. The level picker switches **in place** by `look.apply()`, with no reload and no new material, and updates the URL's `level` with `history.replaceState` (D13).
17. The view also shows:
    - **the recolour strip:** the walker stand-in (`walkerBody` body, `walkerAccent` accent) under each of the three levels' looks, side by side;
    - **the fog sample:** one shape repeated at depths 0, `startDepth`, halfway, `fullDepth` and 1.5 × `fullDepth`, each moved and scaled so it lands at the same screen size in its row (Dev Notes › The materials view), labelled with its depth;
    - **the warm samples:** in Emberwood only, a lantern (glass in the effect material, `lantern` slot, plus its light) between a `ledgeWood` prop box and a `pit` ground box within its reach; and Rowan's sample (a `heroSkin` capsule, a `heroGlow` glowing part and, per D8, his light) in every level;
    - **one instanced and one skinned shape** (AC2), labelled.
18. The view has three spots, `lookdev-materials-emberwood-1080`, `lookdev-materials-drowned-mill-1080` and `lookdev-materials-harrowmere-1080` (1920 × 1080), carrying the new optional `level` field in `LookdevSpot`. At 1920 × 1080 the view fits with no scrolling.
19. A Playwright check, `tests/e2e/lookdev/materials.spec.ts`, runs first in `make shots` as every check in that folder does (Dev Notes › Tests, P1–P8):
    - each level's view reaches ready with no page error; a shader that fails to compile is a console error, so it fails here;
    - the seven rows are there, in order, and every mid hex shown equals the style guide's frontmatter value for that level;
    - a flat backdrop probe at z = 0 draws its slot's hex within 1 per channel, so colour management is right and judging on the page is direct (style guide §2, Colour grading);
    - switching level in place changes the probe to the new level's value, keeps the shader-program count, and removes or restores the lantern sample;
    - an unknown level ends in the error state, naming it;
    - the view doesn't scroll at 1920 × 1080.

### The critic loop

20. **Given** the materials view for each level at 1920 × 1080, **when** the critic loop runs (`make shots ROUND=n`, at most 3 rounds), **then** each shot is opened and looked at before it is described, compared with the chosen references and the style guide, and the three biggest problems are written down, most important first, and fixed.
21. The developer sees the before and after shots and signs off, including the starting `SHADING` values he accepts.

### Done means checked

22. `make check`, `make build`, `make smoke` and `make shots ROUND=<n>` pass. `make build`'s output is unchanged in kind: nothing in the game's graph imports `render/materials/` yet, so no shader ships (a grep of `dist/` for a unique uniform name finds nothing).

## Tasks / Subtasks

- [x] **T0: Baseline** (AC: all)
  - [x] `git status` is clean. At story creation (2026-11-14) story 0.8 was committed as `6468b3e` and the tree was clean. If it isn't, stop and ask the developer.
  - [x] Set `baseline_commit` in this file's frontmatter to `git rev-parse HEAD`.
- [x] **T1: `src/core/invariant.ts`** (AC: 12) (D9)
  - [x] `invariant(condition: unknown, message: string): asserts condition`, throwing an `Error` whose message starts with `Invariant failed:`. `src/core/invariant.test.ts`, test-first.
- [x] **T2: Settings and tones** (AC: 3, 9, 11) (D3, D4)
  - [x] `src/render/materials/shading.ts`: `SHADING` `as const`, the starting values in Dev Notes, each †, with the header that says what an intensity means.
  - [x] `src/render/materials/tones.ts`: `slotTones(palette, rig, slot)` returning `{ lit, mid, shadow }` as three.js `Color`s (linear working space), plus a hex view for the page (`getHexString`).
  - [x] `tones.test.ts` (Tests 1–4), test-first.
- [x] **T3: Fire-family lights data** (AC: 13) (D8)
  - [x] `src/render/lighting/fireLights.ts`: plain data, no three.js, one entry per carrier that carries a light (`rowan`: `heroGlow`; `shot`: `shot`; D8), each `{ color: LevelPaletteSlot; reachTiles; intensity }` †.
  - [x] Add a case to `src/render/lighting/lighting.test.ts`: every fire light's colour is warm in every palette, and its carrier is in `FIRE_FAMILY`.
- [x] **T4: The look** (AC: 7, 8, 10, 12) (D2, D5, D8)
  - [x] `src/render/materials/look.ts`: `createLook(palette, rig)` → `{ apply, setWarmLights, setGroundFogBaseY, tones(slot), uniforms }` (sketch in Dev Notes). Uniform objects are created once and mutated in place, never replaced.
  - [x] `look.test.ts` (Tests 5–12), test-first.
- [x] **T5: The shader and the seven factories** (AC: 1, 2, 3, 6) (D1, D6, D7)
  - [x] `src/render/materials/lookShader.ts`: the vertex and fragment GLSL as `/* glsl */` template strings, and the per-kind defines. No number in the GLSL but 0, 1 and one documented epsilon: every setting arrives as a uniform.
  - [x] The seven factory files (`groundMaterial.ts`, `foliageMaterial.ts`, `characterMaterial.ts`, `propMaterial.ts`, `effectMaterial.ts`, `backdropMaterial.ts`, `cardSilhouetteMaterial.ts`), each one main export.
  - [x] `factories.test.ts` (Tests 13–17), test-first.
- [x] **T6: The boundary** (AC: 4, 5) (D11)
  - [x] `eslint.config.js`: extend `three.shaderNames.importNames` with `ShaderChunk`, `ShaderLib`, `UniformsLib`, `UniformsUtils`; add an `onBeforeCompile` selector to `no-restricted-syntax` for every layer except `render/materials/`. **Flat config replaces a rule's options:** layers with `noDynamicImport` already set `no-restricted-syntax`, so `layerConfig` must emit one entry holding both selector lists.
  - [x] `src/render/materials/shaderBoundary.test.ts` (Tests 18–20).
  - [x] Throwaway checks M1–M5 (Dev Notes), each recorded in the Debug Log, then removed.
- [x] **T7: Look-dev plumbing** (AC: 14–18) (D13)
  - [x] `src/lookdev/levelLooks.ts`: lift the `LEVELS` table (`id`, `label`, `guideKey`, `palette`, `rig`) out of `palettesView.ts`, with `findLevelLook(id)`. `palettesView.ts` imports it and behaves exactly as before (`palettes.spec.ts` passes unchanged).
  - [x] `LookdevSpot` gains `readonly level?: string` (a level id; `spots.ts` stays import-free). `LookdevMountOptions` gains `readonly level: string | undefined`, which `main.ts` fills from the spot's `level`, else `?level=`.
  - [x] `LookdevViewHandle` gains `readonly ready?: Promise<void>`; `main.ts` waits for it after the fonts, before setting `data-lookdev-ready="true"`, and a rejection ends in `error` with its message (the key art must be decoded before a shot).
  - [x] Export the stats panel builder from `rendererView.ts` so the materials view reuses it.
- [x] **T8: The materials scene** (AC: 2, 14, 16, 17)
  - [x] Add `createMaterialsLookdevScene(…)` to `src/render/lookdevScenes.ts` (its header names 0.9 as adding here; a new file would escape ESLint's `LOOKDEV_SCENES` rule). It builds the rows, strips and samples from the factories only, sets `scene.background` from the level's `skyFar` slot, and exposes `setLevel(id)`, the row list, and a `layout(widthPx, heightPx)` giving each row's screen centre and the probe's screen point (projected, so the DOM labels line up at any window size).
- [x] **T9: The materials view** (AC: 14–18)
  - [x] `src/lookdev/materialsView.ts` (`mountMaterialsView`), `lookdev.css` rules prefixed `lookdev-materials-` (page chrome, raw neutral values allowed; nothing inside `.ui-overlay`).
  - [x] Register `{ id: 'materials', label: 'Materials', mount: mountMaterialsView }` in `LOOKDEV_VIEWS` after `type`, and the three spots in `LOOKDEV_SPOTS`.
  - [x] Data attributes for the check: `data-factory` on each row, `data-slot` and `data-tone` on each swatch, `data-level-button` on the picker, `data-warm-sample` on each warm sample, `data-probe-x`, `data-probe-y` and `data-probe-slot` on the view root.
- [x] **T10: `tests/e2e/lookdev/materials.spec.ts`** (AC: 19) (Tests P1–P8)
- [x] **T11: Docs**
  - [x] `docs/STYLE_GUIDE.md` §2: in Shading, replace "How far each tone moves is a material setting †, set in story 0.9" with the meaning and a pointer to `SHADING`; in Lighting, replace the parenthesis about real lights with the decision (AC13). Prose only: the frontmatter is untouched, so the drift tests don't move.
  - [x] `README.md`, "The look-dev page and the critic loop": add the materials view (one clause).
  - [x] Propose (don't edit; the developer edits it) one line for `_bmad-output/project-context.md`: "Factory materials share their look's uniforms: never `clone()` one; ask the factory for another."
- [x] **T12: `make check`, `make build`, `make smoke`** pass; record the test counts. Grep `dist/` for `uKeyDir` (or another unique uniform name) and `lookShader`: nothing (AC22).
- [x] **T13: Critic loop** (AC: 20, 21)
  - [x] Rounds 14 to 16 at most (`shots/` holds rounds 1–13; check `ls shots/` first): `make shots ROUND=n`, open the three materials shots, compare with `emberwood-key-art-mix.jpeg`, `hero-sheet-mix.jpeg` and the style guide, write the three biggest problems, fix, repeat. Record each round in the Debug Log.
  - [x] Glance at every other spot in the round: nothing else should have changed.
  - [x] Tune `SHADING` (and only `SHADING`) in the loop. A rig or palette value that looks wrong goes to the developer: rig numbers are judged in story 0.12, and palette values change in the style guide first.
  - [x] Show the developer the first and last round's three shots (SendUserFile), with the final `SHADING` values, and get his sign-off (AskUserQuestion).
- [x] **T14: Close:** Dev Agent Record, File List, Change Log; status `review`.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). Seven findings were dismissed:
- **Banded surfaces may use warm slots** (scarf, horns): intended; style guide §3 calls them warm surfaces, not lights.
- **Far plane:** the depth-60 samples sit well inside `FAR` (1000).
- **No logdepth, clipping or tone-mapping chunks:** the renderer enables none, and tone mapping is off by design (exact hex values).
- **Rig values aren't checked at run time:** the rigs are compile-time data, and `lighting.test.ts` checks their shape.
- **Several exports per file:** the existing pattern (`warmth.ts`, `lightingRig.ts`).
- **Lit and shadow swatches aren't checked against the render:** by design they come from the same function as the uniforms (D3).
- **P4's margin over the sky:** a probe that hit the sky would fail, which is the point.

- [x] [Review][Decision] The warm-glow rule is checked only when a material is made — `checkGlow` runs once in `createLookShaderMaterial`; `look.apply()` never re-checks glowing materials, so lantern glass made under Emberwood keeps glowing after a switch to a rig that doesn't list lanterns (the view hides it with `lanternGroup.visible`). Linked: the view creates the lantern glass lazily inside `setLevel`, against AC16's "no new material" (opening on the Drowned Mill, then picking Emberwood). **Resolved 2026-11-14: option 1, enforce it in the look** (patch below).
- [x] [Review][Decision] "Rowan's light doesn't light Rowan" lives only in the look-dev staging — `characterMaterial.ts` defaults `canReceiveWarmLight` to true, and neither the style guide nor `fireLights.ts` records the decision, so Epic 2's Rowan gets the stripe by default. **Resolved 2026-11-14: option 1, record it now; story 2.7 applies it** (patch below).
- [x] [Review][Patch] Enforce the glow rule in the look: it tracks the glowing materials it made (forgotten on dispose); `apply()` throws if a live one isn't allowed by the new rig; the view disposes the lantern glass on leaving Emberwood and recreates it on return; reword AC16/D13 in the record (the rows' materials are reused; level-only ones come and go) [src/render/materials/look.ts, lookShader.ts, src/render/lookdevScenes.ts]
- [x] [Review][Patch] Record "Rowan's own light doesn't light Rowan" in style guide §2 and the `fireLights.ts` header, naming story 2.7 as where it applies; lanterns may still warm him [docs/STYLE_GUIDE.md, src/render/lighting/fireLights.ts]
- [x] [Review][Patch] The fill is described wrongly: a fill-facing face lands in shadow (Emberwood: key −0.88 + fill 0.35 = −0.53); the fill only lifts faces near the shadow line into mid. Also the minimum step is promised unconditionally but capped where a channel reaches 1 [docs/STYLE_GUIDE.md:172, src/render/materials/shading.ts:5]
- [x] [Review][Patch] `setWarmLights` writes slots before validating, so a failed call leaves mixed old and new lights; validate every entry first [src/render/materials/look.ts]
- [x] [Review][Patch] The deprecated GLSL alias `inverseTransformDirection` (three r185); use `transformNormalByInverseViewMatrix` [src/render/materials/lookShader.ts]
- [x] [Review][Patch] ESLint `onBeforeCompile` misses string keys (`{ 'onBeforeCompile': f }`, class string keys), template-literal members, `Object.defineProperty`/`Reflect.set` with a literal name; and nothing stops assigning `vertexShader`/`fragmentShader` outside `render/materials/` [eslint.config.js]
- [x] [Review][Patch] The boundary scans have gaps: colour literals miss 8-digit hex, `#RGBA`, and `Color`/`setRGB`/`setHex`/`setStyle` with literal arguments; `withoutComments` eats code after a `//` inside a string; the GLSL markers miss `uniform highp float`, more sampler types and `layout(` [src/render/materials/shaderBoundary.test.ts]
- [x] [Review][Patch] P8 can't see the side panel (`overflow: hidden`) and runs for Emberwood only; measure each column, in every level [tests/e2e/lookdev/materials.spec.ts, src/lookdev/lookdev.css]
- [x] [Review][Patch] P5 and P6 read the warm-sample tags from the rig, not from what the scene draws; derive them from the scene (lantern shown, live warm-light count), and switch from a lantern-less level too [src/render/lookdevScenes.ts, tests/e2e/lookdev/materials.spec.ts]
- [x] [Review][Patch] The view's `ready` promise can reject with no handler attached (unhandled rejection), and main.ts's new message blames the view for a font failure [src/lookdev/materialsView.ts, src/lookdev/main.ts]
- [x] [Review][Patch] A spot's level falls back to `?level=`; a spot should be fixed by its own data [src/lookdev/main.ts]
- [x] [Review][Patch] The scene's `dispose()` never calls `InstancedMesh.dispose()`, so the instance buffer outlives the scene [src/render/lookdevScenes.ts]
- [x] [Review][Patch] Fog captions can show float noise (`6.300000000000001`), and `FOG_SAMPLE_COUNT` can drift from the depth list; magic numbers in the staging layout [src/render/lookdevScenes.ts]
- [x] [Review][Patch] Comments and records that overclaim: "one program per kind" (`lookShader.ts`; flat kinds share a program), the "7 programs" note, the version and program-count tests' comments; and the story's AC1, AC3, AC9, AC14 and Test 3 wording now superseded by D4 revised and D15, and T5's "test-first" (not run red) — record both in the Dev Agent Record [src/render/materials/lookShader.ts, factories.test.ts, this story]

## Dev Notes

### Current state of the files this story touches

| File | Today | This story | Keep |
| --- | --- | --- | --- |
| `src/render/lookdevScenes.ts` | `LookdevScene` interface; `createEmptyLookdevScene()` with a placeholder 30° camera at z = 10; private `disposeTree` | Adds `createMaterialsLookdevScene` (its own camera distance, so its rows fit) | The interface, the empty scene, `disposeTree`. The placeholder camera stays until 0.10 |
| `src/lookdev/assetBrowser.ts` | 4 views (overlay, renderer, palettes, type); `LookdevMountOptions { spot }`; `LookdevViewHandle { frame, dispose }` | Adds the `materials` view; `level` in the options; optional `ready` in the handle | Every existing view and `buildNavigation` unchanged |
| `src/lookdev/main.ts` | Parses `?view=` and `?spot=`; ready = first frame + fonts + a frame; bar hidden for spots | Passes `level`; waits for `handle.ready` | Every existing state and message |
| `src/lookdev/spots.ts` | 6 spots, pure data, no imports | `level?` field, 3 spots | No imports |
| `src/lookdev/palettesView.ts` | Holds its own `LEVELS` table | Imports it from `levelLooks.ts` | Its output, byte for byte in the shot |
| `src/lookdev/rendererView.ts` | Private `buildStatsPanel` | Exported | The renderer view's behaviour |
| `src/lookdev/lookdev.css` | Chrome, palettes and type rules | `lookdev-materials-*` | Everything else |
| `eslint.config.js` | Shader-name import ban outside `render/materials/`; post-processing paths banned; `no-restricted-syntax` for dynamic `import()` in `core/`, `sim/`, `content/` | Four more banned names; an `onBeforeCompile` selector merged into `no-restricted-syntax` | Every existing rule and message |
| `src/render/lighting/lighting.test.ts` | 0.7's rig rules | One case for `fireLights.ts` | Every existing case |
| `README.md`, `docs/STYLE_GUIDE.md` | — | One clause in the README; two in the style guide's §2 prose | The frontmatter, every value |
| `src/render/renderer.ts` | Owns the `WebGLRenderer` (sRGB output, `NoToneMapping`, MSAA on); reads `uniforms` for textures in its estimate | **Not touched** | All of it |
| Palettes, rigs, `core/paletteSlots.ts`, `sim/config.ts`, `base.css`, DESIGN.md | — | **Not touched.** Palette and rig values are the developer's (0.7); `SHADING` is new and separate | — |

`tests/e2e/lookdev/lookdev.spec.ts` already checks that every view opens with no error and has a spot, so the new view is covered there with no edit. `tests/e2e/shots.spec.ts` iterates `LOOKDEV_SPOTS` and needs no edit.

### Decisions (the developer can veto any at review)

- **D1 — One shared `ShaderMaterial` shader, our own lighting, no three.js lights.** Not `MeshToonMaterial`, not `onBeforeCompile` patches, and no `DirectionalLight` or `PointLight` objects:
  - the style guide's bands are a colour mix (toward the key colour, toward the fill colour), not a light multiply;
  - the rig's fog is measured behind the play plane with a cap, which three.js's camera-distance `Fog` can't express;
  - string patches of three's built-in chunks break between revisions (architecture: no semantic versioning);
  - a later move to TSL rewrites one module (ADR-1).
  - **Cost, for story 0.11:** if the developer picks the snapped directional shadow, 0.11 adds the shadow-map sampling to this shader itself (three's shadow chunks need `lights: true` and a light object). Blob shadows need nothing from it. The shader names nothing `worldPosition`, which three's shadow chunks declare.
- **D2 — `createLook(palette, rig)` holds the shared uniforms.** One uniform object per value: key and fill direction, colour and intensity; the fog; the ground fog; the warm-light arrays; the shading settings; and, per slot used, the slot's three tones. Every factory material references those objects (three.js keeps a passed `uniforms` object by reference; only `clone()` copies). `apply()` mutates them in place, so all materials recolour at once with no new material and no recompile. This is how "switching the palette module recolours it with no other change" holds, and how 0.10's level swap will work.
- **D3 — Tones are computed in TypeScript.** `tones.ts` mixes each slot toward the key colour (lit) and the fill colour (shadow) with three.js `Color.lerp` in the linear working space, and the shader only picks one of the three. The rule is then unit-tested in Node, the page's swatches are exactly what the shader draws, and the GLSL stays small.
- **D4 — What an intensity means.** A surface's light term is `key.intensity × max(N·key, 0) + fill.intensity × max(N·fill, 0)`. At or above `litFrom` † the surface is lit; below `shadowBelow` † it is in shadow; between, mid. `litLift` † and `shadowPull` † set how far the lit and shadow tones move. So **the rig's lights decide which tone a surface takes, and the shading settings decide what the tones look like**: every rig number (both directions, both intensities) has an effect, and still only 3 tones exist. A warm light's intensity times `warmLift` † is how far a surface in its reach moves toward the warm colour. If the critic loop shows a better reading, change it with the developer and rewrite the header and the style guide clause to match.
- **D5 — Fog is the materials' own.** Depth behind the play plane is `max(-worldZ, 0)`, so foreground silhouettes (z > 0) take none. Depth fog is `maxAmount × smoothstep(startDepth, fullDepth, depth)`, the same curve three's linear fog uses. Ground fog is `maxAmount × (1 − smoothstep(baseY, baseY + heightTiles, worldY))`, with `baseY` a uniform set by `look.setGroundFogBaseY()` (0 by default). Limiting it to water regions is Epic 5's staging. Both are mixed toward their colour after lighting. `scene.fog` stays null. "Thickest over pits and the far layer" is staging (0.12).
- **D6 — Ground picks top or side by world normal.** One ground material draws any ground mesh, whatever tool made it, with no per-face authoring. `groundTopFrom` †.
- **D7 — Backdrops are flat:** one tone (the slot) plus fog, as the key art's soft silhouettes. A backdrop plane faces the camera, so bands would give one tone anyway. If the critic loop wants bands on middle-distance shapes, ask first.
- **D8 — Fire-family lights (the style guide's open choice; decided by the developer at story creation, 2026-11-14):** Rowan and his shots carry a real short warm light. Embers, bells and weapon pickups glow (effect material) and light nothing. Lanterns light as the rig says (Emberwood only).
  - Why: "a cold world with one warm light moving through it" is Rowan and his fire. Embers and bells are many and static, so lights on them would warm the ground everywhere and compete with Rowan.
  - Count: Rowan 1 + up to 3 shots in a triple shot + the nearest lanterns fit `maxWarmLights` † = 8. The game picks which lights to send each frame (Epic 1 and 2); this story provides the array and the rules.
  - Whether Rowan's light also lights Rowan is judged on the view. Banded factories take `canReceiveWarmLight` (default true). It is forced false for `pit` and `water`, and always false for backdrops, card silhouettes, effects and glowing parts: unshaded means no light changes them.
- **D9 — `core/invariant.ts` is created here.** The architecture lists it in `core/`, and a warm light for a carrier the rig doesn't list is a bug, not an expected failure. `assertNever` (also listed) is created only if a `switch` on a union needs it.
- **D10 — The view proves instancing and skinning** with one `InstancedMesh` (three instances of the prop box) and one `SkinnedMesh` (a capsule with two bones, posed), so Epic 1's kit and Epic 2's Rowan don't find a broken shader. A small addition to the epic's text, flagged.
- **D11 — The boundary covers GLSL-adjacent exports too.** `ShaderChunk` and `ShaderLib` are GLSL source; `UniformsLib` and `UniformsUtils` only make sense with them. The GLSL search is a Vitest test using Vite's `import.meta.glob('/src/**/*.ts', { query: '?raw', import: 'default', eager: true })`, not `node:fs` (ESLint bans Node built-ins in `render/`, tests included; 0.7, D7). **Unverified:** that Vitest 5 resolves an eager raw glob over `src/`; check on the first run. If it doesn't, stop and report rather than restructure.
- **D12 — The look-dev page loads the key art from `art-src/`** through Vite's `?url` import. CLAUDE.md says the **game** never loads `art-src/`; the look-dev page is development only and `make build` leaves it out (0.6, AC3), so the image never ships. A clone without `git lfs pull` gets a pointer file that fails to decode: the view ends in `error` saying so.
- **D13 — The picker switches in place,** through `setLevel()` → `look.apply()`, and keeps the URL in step with `history.replaceState`. That shows the AC's "no other change" live (P5 checks the shader-program count), and gives 0.10 its level swap. A spot opens the view at its `level`.
- **D14 — `LEVELS` moves to `src/lookdev/levelLooks.ts`,** as 0.7's notes suggested, so the palettes and materials views share one table. `render/` may not import `lookdev/`, so the view passes the three palettes and rigs into `createMaterialsLookdevScene`.

### Module shapes (sketches, not final code)

```typescript
// src/render/materials/shading.ts — every number † (this story's critic loop; story 0.12)
export const SHADING = {
  litFrom: 0.5,        // light term at or above → lit
  shadowBelow: 0.15,   // light term below → shadow; between → mid
  litLift: 0.3,        // 0..1: how far lit moves from the slot toward the key colour
  shadowPull: 0.45,    // 0..1: how far shadow moves toward the fill colour
  warmLift: 0.8,       // × a warm light's intensity: how far a lit surface moves toward its colour
  groundTopFrom: 0.7,  // world normal y at or above → the ground's top slot
  maxWarmLights: 8,    // warm point lights drawn at once (a shader array size, fixed: no recompile)
} as const;

// src/render/materials/look.ts
export interface WarmLight { readonly carrier: WarmCarrier; readonly x: number; readonly y: number; readonly z: number }
export interface Look {
  /** Recolour and relight every material made from this look, in place. Drops lights the new rig doesn't list. */
  apply(palette: LevelPalette, rig: LightingRig): void;
  /** Throws (invariant) for a carrier the rig doesn't list, one that carries no light, or too many lights. */
  setWarmLights(lights: readonly WarmLight[]): void;
  setGroundFogBaseY(y: number): void;
  readonly palette: LevelPalette;
  readonly rig: LightingRig;
  /** The shared uniform objects, for the factories only: nothing outside materials/ reads them. */
  readonly uniforms: LookUniforms;
  /** The slot's lit, mid and shadow uniforms, created on first use, recomputed by apply(). */
  tones(slot: LevelPaletteSlot): SlotToneUniforms;
}
export function createLook(palette: LevelPalette, rig: LightingRig): Look;

// src/render/materials/effectMaterial.ts (the others follow the same shape)
export function createEffectMaterial(
  look: Look,
  options: { readonly slot: LevelPaletteSlot; readonly carrier: WarmCarrier | null },
): ShaderMaterial;
// ground: { top, side }   foliage / prop / backdrop / card silhouette: { slot }
// character: { slot, isGlowing? }  — glowing needs a warm Rowan slot ('rowan' in the warm list)
// banded kinds also take { canReceiveWarmLight? } (forced false for pit and water)

// src/render/lighting/fireLights.ts — plain data, no three.js (D8)
export const FIRE_LIGHTS = {
  rowan: { color: 'heroGlow', reachTiles: 1.5, intensity: 0.5 }, // †
  shot: { color: 'shot', reachTiles: 1, intensity: 0.4 },        // †
} as const satisfies Partial<Record<WarmCarrier, FireLight>>;
```

Every factory sets `material.name` (for example `ground:groundTop/groundSide`), so a material can be found in a debugger.

### The shader (a sketch: untested; verify every chunk name in `node_modules/three/src/renderers/shaders/`)

Vertex, mirroring r187's `ShaderLib/meshlambert.glsl.js` minus uv, colour, envmap, displacement, shadow and fog chunks:

```glsl
#include <common>
#include <batching_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
varying vec3 vLookNormal;   // world space
varying vec3 vLookWorld;    // world position; never "worldPosition" (three's shadow chunks declare it)
void main() {
  #include <morphinstance_vertex>
  #include <batching_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <project_vertex>
  vLookNormal = inverseTransformDirection( transformedNormal, viewMatrix ); // view → world (common chunk)
  vec4 lookWorld = vec4( transformed, 1.0 );
  #ifdef USE_BATCHING
    lookWorld = batchingMatrix * lookWorld;
  #endif
  #ifdef USE_INSTANCING
    lookWorld = instanceMatrix * lookWorld;
  #endif
  vLookWorld = ( modelMatrix * lookWorld ).xyz;
}
```

Fragment, the banded kind (flat and unshaded kinds skip the band pick; card silhouettes skip fog):

```glsl
// hard step, antialiased over one pixel so band edges don't stair-step (fwidth is core in WebGL 2)
float hardStep( float edge, float x ) { float w = fwidth( x ); return smoothstep( edge - w, edge + w, x ); }
void main() {
  vec3 n = normalize( vLookNormal );
  #ifdef LOOK_DOUBLE_SIDED
    if ( ! gl_FrontFacing ) n = - n;
  #endif
  float light = uKeyIntensity * max( dot( n, uKeyDir ), 0.0 ) + uFillIntensity * max( dot( n, uFillDir ), 0.0 );
  vec3 color = mix( uShadow, uMid, hardStep( uShadowBelow, light ) );
  color = mix( color, uLit, hardStep( uLitFrom, light ) );
  for ( int i = 0; i < MAX_WARM_LIGHTS; i ++ ) {   // MAX_WARM_LIGHTS: a fixed define from SHADING
    if ( i >= uWarmCount ) break;
    vec3 toLight = uWarmPos[ i ] - vLookWorld;
    float d = length( toLight );
    float inside = 1.0 - hardStep( uWarmReach[ i ], d );
    float facing = hardStep( 0.0, dot( n, toLight ) );
    color = mix( color, uWarmColor[ i ], uWarmAmount[ i ] * inside * facing * uReceivesWarm );
  }
  float depth = max( - vLookWorld.z, 0.0 );
  color = mix( color, uFogColor, uFogMax * smoothstep( uFogStart, uFogFull, depth ) );
  color = mix( color, uGroundFogColor,
    uGroundFogMax * ( 1.0 - smoothstep( uGroundFogBaseY, uGroundFogBaseY + uGroundFogHeight, vLookWorld.y ) ) );
  gl_FragColor = vec4( color, 1.0 );
  #include <colorspace_fragment>
}
```

- Per-kind differences are `#define`s fixed per factory (`LOOK_BANDED`, `LOOK_GROUND`, `LOOK_DOUBLE_SIDED`, `LOOK_FLAT`, `LOOK_UNSHADED`, `LOOK_NO_FOG`), so there is one program per kind. Per-level differences are uniforms only (AC10).
- `MAX_WARM_LIGHTS` comes from `SHADING.maxWarmLights` as a define; the arrays are always that size, and `uWarmCount` says how many are live.
- Ground: pick the top or side tones with `hardStep( uGroundTopFrom, n.y )` before the band pick.
- `uWarmAmount[i]` is `clamp(SHADING.warmLift × intensity, 0, 1)`, computed in `look.ts`.
- `ShaderMaterial` defaults are right: `lights: false`, `fog: false`. Use `side: DoubleSide` for foliage only.

### Tests

**Vitest, Node** (`make test`). three.js core runs in Node (`renderer.test.ts` already relies on it); no `WebGLRenderer` is created. Tests read hex values from the palette modules; they never retype them.

`src/core/invariant.test.ts`
1. It returns for a truthy condition; for a falsy one it throws an `Error` whose message includes the given text.

`src/render/materials/tones.test.ts`
2. For every slot in all three palettes, `mid` equals `new Color(palette[slot])` exactly.
3. For every slot but `pit` and `water`: `lit` is nearer the key colour than `mid` is, and `shadow` nearer the fill colour (distance in linear RGB). A slot that *is* the light's colour can't move toward it, so skip it by name and assert its tone equals `mid`: `skyGlow` for lit in every level (every key's colour); for shadow, `bark` in Emberwood and `treeMid` in the other two (the fills' colours). Derive the skipped slots from the rig, not from literals.
4. For `pit` and `water`, in every palette: `lit` equals `mid` (AC3).

`src/render/materials/look.test.ts`
5. Key and fill colours, directions (normalised, length 1) and intensities equal the rig's, in all three levels; fog colour, depths and amount equal the rig's; the ground-fog amount is the rig's in the Drowned Mill and 0 elsewhere.
6. Recolour (AC7–AC8): a `walkerBody` prop material made under Emberwood; after `apply` with each palette, its tone uniforms equal that palette's `walkerBody` tones; the material is the same object and its `version` hasn't changed; the uniform objects are the same objects, mutated.
7. Warm lights (AC12): in Emberwood a `lantern` light is accepted and takes `rig.lanterns`' reach, intensity and colour; in the Drowned Mill and Harrowmere it throws.
8. `rowan` and `shot` lights are accepted in all three levels (D8); `ember`, `bell` and `weaponPickup` lights throw (they carry no light).
9. More than `SHADING.maxWarmLights` lights throws; exactly that many is accepted.
10. `apply` from Emberwood to the Drowned Mill drops a lantern light (the live count falls) and keeps Rowan's.
11. `setGroundFogBaseY` moves the base uniform; nothing else changes.
12. `apply` never replaces a uniform object (every object identity in `uniforms` is kept).

`src/render/materials/factories.test.ts`
13. Each of the seven factories returns a `ShaderMaterial` whose uniforms include the look's shared objects (identity, not equal copies), with its kind's define set.
14. `createEffectMaterial` with a warm slot (`ember`) and `carrier: null` throws; with `carrier: 'ember'` it works in every level; with slot `lantern` and carrier `lantern` it works in Emberwood and throws elsewhere; a cold slot (`checkpoint`) with `carrier: null` works.
15. `createCharacterMaterial({ slot: 'heroSeam', isGlowing: true })` works in every level; `{ slot: 'walkerBody', isGlowing: true }` throws.
16. A ground or prop material for `pit` or `water` has warm light off even when `canReceiveWarmLight: true` is asked; backdrop, card-silhouette, effect and glowing character materials always have it off (the `uReceivesWarm` uniform is 0).
17. Type pin: `// @ts-expect-error a colour is not a slot` on `createPropMaterial(look, { slot: '#FF0000' })`. `make typecheck` fails if that line ever compiles.

`src/render/materials/shaderBoundary.test.ts` (D11)
18. Every `src/**/*.ts` outside `src/render/materials/` contains no GLSL marker: `gl_FragColor`, `gl_Position`, `gl_FrontFacing`, `#include <`, `void main(`, `precision (lowp|mediump|highp)`, or `(uniform|varying|attribute) (float|int|bool|vec[234]|mat[234]|sampler2D)`. Control: at least one file inside it matches, and more than 30 files were scanned.
19. No `.glsl`, `.vert` or `.frag` file exists under `src/` (a second glob).
20. No non-test file under `src/render/materials/` holds a colour literal (`#[0-9a-fA-F]{3}` or `{6}` as a whole token, or `0x[0-9a-fA-F]{6}`) once `//` and `/* */` comments are stripped. Control: the same search finds one in a string written in the test itself.

**Playwright, Chromium, dev server** (`make shots` runs it first): `tests/e2e/lookdev/materials.spec.ts`. Use `expectLookdevReady` and the page-error helpers, as the other specs do. Read the style guide's values in Node with `readFrontmatter` from `scripts/designTokens.ts`, never from the page.
- **P1:** for each level, `?view=materials&level=<id>` reaches ready with no console error, page error or failed request (a shader compile error is a console error from three.js; the key art is a request).
- **P2:** seven `[data-factory]` rows, in the order of AC1; each names its slots.
- **P3:** every mid swatch's hex equals the frontmatter's value for that level and slot, case-insensitive.
- **P4:** the probe. Take a 1 × 1 screenshot at (`data-probe-x`, `data-probe-y`), decode it in the page (draw the PNG data URL to a canvas and read `getImageData`; no new dependency), and compare with the frontmatter value of `data-probe-slot` for that level: each channel within 1. Put the probe above the Drowned Mill's ground fog, at z = 0, on a flat backdrop plane.
- **P5:** in-place switch. From Emberwood, click `[data-level-button="drowned-mill"]`: the URL's `level` is `drowned-mill`; the probe now reads the Drowned Mill's value; the shader-program count (`[data-lookdev-stat="programs"]`, polled, since the panel refreshes every 15 frames) is unchanged; `[data-warm-sample="lantern"]` is gone. Click back to Emberwood: the lantern sample returns and the program count still hasn't changed.
- **P6:** the lantern sample exists only in Emberwood; Rowan's sample exists in all three.
- **P7:** `?view=materials&level=zz-missing` settles in `error`, and `.lookdev-error` names `zz-missing`.
- **P8:** the view root (`overflow: auto`) has no overflow at 1920 × 1080. Every spot with a `level` names one of the three level ids.

### Throwaway checks (make the change, run, record the output, revert; `cmp` against a scratchpad copy)

| # | Change | Run | Expected |
| --- | --- | --- | --- |
| M1 | `src/render/zz.ts`: `import { ShaderChunk } from 'three'` | `make lint` | fails: shader names only in `render/materials/` |
| M2 | `src/render/zz.ts`: `import * as THREE from 'three'` and `new THREE.ShaderMaterial()` | `make lint` | fails, if ESLint reports a namespace import of a module with restricted `importNames`. **Unverified:** if it passes, record that and propose a rule to the developer |
| M3 | `src/render/zz.ts`: `export function f(m: Material): void { m.onBeforeCompile = () => {}; }`; and, separately, `src/content/zz.ts` with a dynamic `import('./x.ts')` | `make lint` | both fail: the new selector works, and merging it didn't drop the dynamic-import ban |
| M4 | `src/lookdev/zz.ts` exporting `'void main() { gl_FragColor = vec4(1.0); }'` | `make test` | the boundary test fails, naming the file |
| M5 | `'#FF0000'` in a string in `propMaterial.ts` | `make test` | the colour-literal test fails, naming the file |
| M6 | A typo in the fragment shader (`vec4( color 1.0 )`) | `make shots ROUND=<free n>` | stops at a look-dev check with three's "Shader Error" before any shot. Delete the half round if one exists (`make shots` writes `round-n.partial/` only after the checks) |

### The materials view

- **Layout at 1920 × 1080, one shot:** a left column of row labels and tone swatches; the canvas in the middle; a right column with the key art (about 480 px wide), the level picker, the rig's key, fill and fog swatches, and the stats panel. Spots show no bar (main.ts), so the panels must not depend on it.
- **Rows (top to bottom):** ground (`groundTop` / `groundSide`), foliage (`foliage`), character (`heroSkin`, plus Rowan's sample), prop (`ledgeWood`, plus the instanced box and, in Emberwood, the lantern sample), effect (box `pickupWarm`, sphere `ember`, plane `shot`, capsule `bell`, each with its carrier), backdrop (`treeMid`; the probe is its plane), card silhouette (`ridgeFar`), the recolour strip, the fog sample (the prop sphere). The skinned capsule goes in the character row.
- **Shapes:** 1 unit = 1 tile. Turn the box and capsule a little (fixed angles), so the box shows three faces and the bands read. The spot freezes time, so nothing should need to move. Shapes sit on the play plane (z = 0), except the fog sample.
- **Fog sample placement:** with the camera at distance `D` from z = 0, looking along −z from `(cx, cy, D)`, a shape at depth `d` placed at `c + (p − c) × (D + d) / D` (x and y) and scaled by `(D + d) / D` projects to the same spot and size as at z = 0. It then shows nothing but the fog changing. Put the fog row at the camera's height (`cy`), so depth scaling moves its samples only sideways and never into the ground fog. `layout()` gives the labels their positions.
- **Ground fog in the view:** in the Drowned Mill, set `setGroundFogBaseY` to the bottom edge of the lowest row, so only that row sits in the low fog. Every other row, the probe included, stays above `base + heightTiles`. Elsewhere the amount is 0 whatever the base.
- **Instanced and skinned shapes:**
  - The `InstancedMesh` (three prop boxes) needs `computeBoundingSphere()` after its matrices are set, or culling drops it (a known trap, project-context).
  - The `SkinnedMesh` is a `CapsuleGeometry` with `skinIndex` and `skinWeight` attributes computed from each vertex's height: two bones, the second bent by a fixed angle. Use the pattern in the three.js `SkinnedMesh` documentation: root bone added to the mesh, then `bind(skeleton)`.
- **Labels line up with the rows** because `layout(width, height)` projects each row's centre with the scene's camera on every resize. The DOM never computes 3D positions itself (lookdev/ may not import three.js).
- **Background:** `scene.background` takes the level's `skyFar` (a `Color` from the palette in `lookdevScenes.ts`, not a material), so shapes are judged against the level's sky. It updates on `setLevel`.
- **The key art:** `import keyArtUrl from '../../art-src/reference/emberwood-key-art-mix.jpeg?url'` (Vite declares `*?url` in `vite/client`). The handle's `ready` promise is `image.decode()`, so the shot never catches it half-loaded.
- **Dispose:** the view's `dispose()` disposes the scene (geometries, materials) and the renderer, as the renderer view does.

### What the critic loop judges here

Compare each level's shot with `emberwood-key-art-mix.jpeg` and `hero-sheet-mix.jpeg` (in Emberwood, the teal lit and plum shadow bands on Rowan's skin) and the style guide. Check:

- exactly three tones on every banded shape, hard-edged, with no shading gradient or stair-stepping;
- mid reads as the swatch;
- nothing shines (no specular, no rim);
- glowing parts are flat and bright;
- fog grows with depth and stops at its cap, so the farthest sample still reads;
- the lantern's warmth reaches only nearby surfaces, and the pit box beside it stays dark;
- the recolour strip shows three distinct enemy colours with the same shape;
- the fire family looks like the warmest things in each shot;
- the Drowned Mill's ground fog is visible low down.

Ink outlines and shadows are absent by design (0.11): note it, don't fix it. "Hero, enemies, hazards and pickups stand out at a glance" has no scene yet (0.12): say so each round, and note what the stand-ins suggest. Tune `SHADING` here; rig and palette values go to the developer (0.12 judges the rigs).

### Previous story intelligence (0.7, 0.8)

- **Data shapes (0.7):** palettes are uppercase `#RRGGBB` strings, `as const satisfies LevelPalette`. Rigs name slots (never hex), and their directions say where light comes **from** (x right, y up, z toward the viewer; "behind" is −z), unnormalised. Fog depths are tiles behind the play plane. Intensities are relative (Emberwood's key = 1). `FIRE_FAMILY` and `WarmCarrier` are in `lightingRig.ts`; `isWarm`, `ROWAN_SLOTS` and `FIRE_FAMILY_SLOTS` in `palettes/warmth.ts` (exact integer warm test: use it, don't re-derive). `materials/` may import both folders (ESLint already allows exactly `palettes/` and `lighting/` from `render/`).
- **The look-dev page (0.6–0.8):** a view is `{ id, label, mount(host, options) }` returning `{ frame(timeSeconds), dispose() }`. Ready means the first frame, then the fonts, then one more frame. An exception in `mount` ends in `error` with the message shown on the page. lookdev/ can't import three.js, so 3D is built in `render/lookdevScenes.ts`.
- **Watch items 0.7 left for 0.12** (don't fix here; note what the materials view suggests):
  - the Drowned Mill's `walkerBody` and `flyerBody` are close in value to its `fog` and `treeMid`;
  - Emberwood's `flyerBody` is about as dark as its `treeMid`;
  - Harrowmere's `hazard`, `exit` and `seed` are near-identical pale greys;
  - `hazard` against `heroHorn`.
- **Review patterns to pre-empt:**
  - checks that compare the page with itself (compare with the style guide instead);
  - scroll checks on `html` that can't fail (check the view's own `overflow: auto` root);
  - ready flags set too early (hence `handle.ready` for the image);
  - a check that can't fail (each throwaway proves one can);
  - repeated literals in tests (import from the source).
- **Lint lessons:**
  - `instanceof` narrowing to `any`-typed generics trips `no-unsafe-argument`, so use type guards (see `isTexture` in `renderer.ts`);
  - `arr[0]?.x` is an "unnecessary condition" without `noUncheckedIndexedAccess`, so use `.at(0)`;
  - wrap methods passed as values (`unbound-method`);
  - no string spreads (`no-misused-spread`), so use `Array.from`;
  - Prettier the new files before `make check`.
- **Running Playwright by hand** needs the Makefile's environment (`GPU=nvidia E2E_TARGET=dev SHOTS_PORT=5174`), or the GTX 1650 check skips. Record only results from `make` targets.
- **`make shots`** refuses an existing round. Rounds 1–13 exist; start at 14.
- **Git:** one commit per story, `Build the shared materials: story 0.9, reviewed and done`, straight on master, only when the developer asks.

### Latest technical notes (checked in `node_modules/three` 0.187.0, 2026-11-14)

- A non-raw `ShaderMaterial` gets three's prefix: `#version 300 es` (WebGL 2 only since r163), `precision highp`, the `USE_INSTANCING`, `USE_SKINNING` and `USE_BATCHING` defines with their attributes, and `linearToOutputTexel` (`src/renderers/webgl/WebGLProgram.js`, lines 398–763). So `#include <colorspace_fragment>` converts to the sRGB output, and dynamic uniform-array indexing and `fwidth` are allowed.
- **Colour management:** `ColorManagement` defaults to a `LinearSRGBColorSpace` working space, so `new Color('#335950')` stores linear values. `WebGLUniforms` uploads `Color` `r, g, b` as stored, and the renderer's output is `SRGBColorSpace`. A mid tone therefore comes out as its hex (P4 checks it within 1).
- **`worldpos_vertex` is conditional** (envmap, shadow map, transmission only), so compute the world position yourself (sketch). `fog_vertex` uses camera-space depth (`-mvPosition.z`), which is why D5 doesn't use it.
- **`Material.setValues`** assigns `uniforms` by reference; `ShaderMaterial.copy()` (and so `clone()`) calls `cloneUniforms`, which breaks sharing. Never clone a factory material.
- **`CapsuleGeometry(radius = 1, height = 1, capSegments = 4, radialSegments = 8, heightSegments = 1)`:** `height` is the middle section, so the total is `height + 2 × radius`.
- **Shader compile errors:** with `renderer.debug.checkShaderErrors` (default true), three logs "WebGLProgram: Shader Error …" through its `error()` helper, which calls `console.error`. `collectPageErrors` already fails on it.
- **Uniform arrays:** `{ value: Vector3[] }` and `{ value: Color[] }` upload as `vec3` arrays, and `{ value: number[] }` as `float` arrays (`WebGLUniforms.js`, the `…Array` setters flatten through `toArray`). Keep array lengths fixed at `maxWarmLights`.
- **Vite 8:** `import.meta.glob` and `*?url` / `*?raw` are declared in `vite/client` (`node_modules/vite/types/importGlob.d.ts`), and the root tsconfig includes those types.

### Project structure notes

- **New:**
  - `src/core/invariant.ts` and `invariant.test.ts`;
  - `src/render/materials/`: `shading.ts`, `tones.ts`, `look.ts`, `lookShader.ts`, the seven factory files, `tones.test.ts`, `look.test.ts`, `factories.test.ts`, `shaderBoundary.test.ts`;
  - `src/render/lighting/fireLights.ts`;
  - `src/lookdev/levelLooks.ts`, `src/lookdev/materialsView.ts`;
  - `tests/e2e/lookdev/materials.spec.ts`.
- **Changed:** `eslint.config.js`, `src/render/lookdevScenes.ts`, `src/render/lighting/lighting.test.ts`, `src/lookdev/{assetBrowser,main,spots,palettesView,rendererView}.ts`, `src/lookdev/lookdev.css`, `README.md`, `docs/STYLE_GUIDE.md` (§2 prose).
- `src/render/materials/` is named by the architecture (flat, with no subfolders; the ESLint rule assumes flat). No other new folder, and no new dependency.
- **Flagged under AR248 (closest pattern):**
  - `shading.ts`, `tones.ts`, `look.ts` and `lookShader.ts` beside the seven factories (the architecture lists only "factories"), and `fireLights.ts` in `render/lighting/`, where 0.7 put the other light data;
  - `SHADING` has no stated home; it is look data, not gameplay, so not `sim/config.ts`.

### Project context rules

- TypeScript strict. Relative imports carry `.ts`; use `import type` for types. No enums, namespaces or parameter properties; use string-literal unions. Booleans are `is…`, `has…` or `can…` (`isGlowing`, `canReceiveWarmLight`). Every `switch` on a union ends in `assertNever`.
- three.js only in `render/` (and tests). GLSL, `ShaderMaterial`, `onBeforeCompile` and passes only in `render/materials/`, which imports only three.js, `core/`, `render/palettes/` and `render/lighting/`. lookdev/ imports `render/`, `ui/`, `content/`, `core/`, never three.js.
- Rendering never writes simulation state (nothing here touches `sim/`). Dispose geometry, materials and textures when a view goes away.
- No per-frame allocation in hot render paths: `setWarmLights` writes into the fixed arrays and allocates nothing (the game calls it every frame from Epic 1).
- `invariant()` for bugs; log only through `core/log.ts` (`render` channel).
- One main export per file, camelCase file names, no barrel files.
- Run everything through `make`; run `make check` before saying a change works; run the critic loop after this visual change; look at every shot before describing it.
- Ask before adding a dependency (none needed), changing the folder structure, or changing a tuned number. Palette and rig values are the developer's. `SHADING` is new, tuned with him in this story's loop.

### References

- Epic and story: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md`, Epic 0 (In scope, the materials bullet), Story 0.9; and 0.10, 0.11, 0.12 and 0.13 for what builds on it.
- Requirements: `requirements-inventory.md`: NFR33, PR23, AR160, AR161, AR165; NR102, NFR28; AR248.
- `docs/STYLE_GUIDE.md`:
  - §2: Shading (the band rule, unshaded glow, fog on everything, no specular or rim); Outlines (0.11's, for context); Colour grading (none: on-screen colours stay the guide's); Lighting per level (the lantern reach, and the open fire-family choice);
  - §3: the warm definition and who may be warm;
  - §5: the palettes;
  - §8: card silhouettes are flat fills.
- Architecture `game-architecture.md`:
  - Engine & Framework (Decision 1, ADR-1);
  - Asset Management (generated materials stripped and replaced by the factories);
  - Rendering Structure (`render/materials`, the palette module, the lighting rig, instancing, shadows);
  - Performance Budget;
  - Project Structure: Source Structure and Architectural Boundaries;
  - Consistency Rules (shader code).
- `_bmad-output/project-context.md`: Engine-Specific Rules (three.js only in `render/`; GLSL only in `render/materials/`; glTF materials replaced by the factories); Performance Rules.
- Previous stories: `0-7-put-the-level-palettes-and-lighting-rigs-in-data.md` (D3, D6, D7, D10, D11), `0-8-self-host-the-overlay-typefaces.md`, `0-6-build-the-look-dev-page-and-the-screenshot-harness.md` (D4: lookdev 3D lives in `render/lookdevScenes.ts`).
- Code: `src/render/lighting/lightingRig.ts`, `src/render/palettes/warmth.ts`, `src/core/paletteSlots.ts`, `src/render/renderer.ts`, `src/render/lookdevScenes.ts`, `src/lookdev/*`, `eslint.config.js` (`three.shaderNames`, `layerConfig`), `tests/e2e/lookdev/*.spec.ts`, `tests/e2e/pageErrors.ts`, `tests/e2e/lookdevReady.ts`.
- three.js r187 source: `node_modules/three/src/renderers/shaders/ShaderLib/meshlambert.glsl.js`, `ShaderChunk/*`, `src/renderers/webgl/WebGLProgram.js`, `WebGLUniforms.js`, `src/materials/ShaderMaterial.js`, `src/math/ColorManagement.js`.

### For later stories (not this one)

- **0.10:** level swap by `look.apply()`; backdrop planes per layer from `createBackdropMaterial`; the logical-view outline needs a line material, so add a factory here rather than a raw `LineBasicMaterial` elsewhere.
- **0.11:** a directional shadow means adding shadow-map sampling to `lookShader.ts` (D1). The outline pass must fade lines with fog (style guide §2); the fog is reconstructable from depth (D5's formula). Keep within 2 passes.
- **0.12:**
  - judges `SHADING` and the rig numbers on the test scene, and the warm-light count;
  - "fog thickest over pits", and the ground fog's base over water, are staging there;
  - the pit stays dark under fog.
- **0.13:** the card-silhouette factory takes level slots today. Story palettes (`StoryPaletteSlot`) and per-layer fog are added there, in `render/materials/`.
- **Epic 1 (1.3, 1.5):** the loader strips glTF materials and asks the factories; kit pieces use `InstancedMesh` (proven here). The game picks which warm lights to send each frame (nearest to the camera, at most `maxWarmLights`).
- **Epic 2 (2.6, 2.7):** Rowan's slot regions map to factory materials (glowing for `heroSeam` and `heroGlow`). A per-vertex slot index (AR164) could replace per-region materials if draw calls need it; that change stays inside `render/materials/`.
- **Epic 4:** stage 2's dimmer chest glow is a material change, likely a glow-strength uniform on the glowing character material.

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code.

### Debug Log References

- **T0:** the tree held only this file and `sprint-status.yaml` (from story creation). `baseline_commit` is `6468b3e` (story 0.8).
- **Red, then green, per task** (`make test` counts):
  - T1 `invariant`: red (no module), then 253 → 255.
  - T2 tones: red, then 268. All 108 palette values round-trip exactly through three's linear working space (the "mid as the palette writes it" test).
  - T3 `fireLights`: red, then 275.
  - T4 look: red, then 303.
  - T5 factories: `factories.test.ts` was written before the factories but **not run red separately** (the modules didn't exist yet). It was green at 354 on its first run.
  - T6 boundary: 360.
- **T2 finding: the plain mix inverts bands.** A scratch script measured the style guide's rule (lit toward the key colour, shadow toward the fill colour) on all 108 values:
  - slots darker than the fill get a **lighter** shadow: Harrowmere `ledgeWood` 1.36×, `bark` 1.34×; the Drowned Mill `groundSide` 1.14×; Emberwood `flyerBody` 1.14×; `heroCloth`, `skyFar`, `ink`, `foregroundDark`;
  - slots paler than the key get a **darker** lit tone: in the Drowned Mill and Harrowmere `hazard`, `heroHorn`, `checkpoint`, `exit`, the accents and `seed`.
  - **D15 (new):** a value guard. Lit is at least `minToneStep` † brighter than mid and shadow at least that much darker, by uniform scaling, so the hue shift survives. Brightening stops where a channel would pass 1.
  - **Deviation from Test 3:** "nearer the key colour" is measured in chromaticity, not RGB distance. A lit tone of a slot paler than the key can't be both lighter and RGB-nearer a darker key.
  - The new order test failed red (3 levels), then passed: 271.
  - `pit` and `water`: shadow equals mid too, not only lit. Every fill is lighter than both, so a shadow toward it would lighten them (AC3's "never lighter").
- **T4:**
  - Refactor: each carrier's light (colour, reach, amount) is resolved once per `apply()`, so `setWarmLights()` only copies values, and its invariant messages are built only on failure. It allocates nothing per frame.
  - `look.tones()` guards an unknown slot (`invariant`), since Epic 2's slot names come from glTF material names at run time.
  - Lint: `.at()` for indexed access, as 0.6 learned.
- **T6, the boundary:**
  - D11's unverified item, checked: Vitest 5 resolves an eager raw glob over `/src` (50 files), and the control finds GLSL in `lookShader.ts`.
  - **M1:** `import { ShaderChunk } from 'three'` in `src/render/zz.ts`: `no-restricted-imports` error.
  - **M2** (unverified item): `import * as THREE` plus `new THREE.ShaderMaterial()`: "* import is invalid because 'ShaderMaterial', … from 'three' are restricted".
  - **M3a:** an `onBeforeCompile` assignment, an object-literal method and a computed member: three errors.
  - **M3b:** a dynamic `import()` in `src/content/zz.ts` still errors, so merging the selectors kept that ban.
  - M1–M3 ran ESLint on the single file (the same config as `make lint`).
  - **M4's first run did not fail.** Cause: Vitest 5's `fsModuleCache` (default on, in `node_modules/.vitest-cache`) keys a module by its own content, so the glob's file list was baked into a cached transform. A fresh probe test saw the planted file.
  - **D16 (new):** `fsModuleCache: false` in `vite.config.ts`. The suite went from about 0.9 s to 2.9 s wall time. M4 then failed, naming `/src/lookdev/zz.ts`.
  - **M5:** `'#FF0000'` in `propMaterial.ts` failed the colour-literal test, naming the file.
  - Every throwaway file was deleted or restored; `cmp` confirmed the restored files byte-identical.
- **T8–T9, the view:**
  - A first scratch capture (round 900, deleted) showed every row drawing and the shaders compiling on the GTX 1650.
  - Fixed then: the swatch lines overflowed a 400 px label column, so the labels got 470 px and the side panel 450 px, and the recolour swatches show bare hex.
  - On screen, rows run from the ground at the bottom up, like a level, with the fog row in the middle at the camera's height. The row list and the DOM keep AC1's order.
- **T10:** 15 checks, all green on the first run (Playwright run directly with the Makefile's environment: `GPU=nvidia E2E_TARGET=dev SHOTS_PORT=5174`). Throwaways proving two of them can fail:
  - **F1:** with `colorspace_fragment` commented out, P4 failed in all three levels (Emberwood `treeMid` seen `rgb(5, 15, 19)`, expected `rgb(40, 68, 77)`).
  - **F2:** a Drowned-Mill-only define with `needsUpdate` made P5 fail ("Expected 7, Received 8" programs).
  - Both files were restored and checked with `cmp`.
- **M6:** a shader typo (`vec4( color 1.0 )`) made `make shots ROUND=950` exit 2 at the look-dev checks: 9 failed, 29 passed, three's "Shader Error … syntax error", and no round folder. Restored with `cmp`.
- **T13, critic round 14** (`shots/round-14/`; 38 look-dev checks, 9 shots, all opened). Compared with `hero-sheet-mix.jpeg`: teal on the planes facing the light, plum on those facing away, grey on the front.
  1. **The fill can lift a surface into the lit tone.** D4's additive term scored Emberwood's fill-facing lower-left front (about 0.34) like the key-facing upper right (about 0.32), so lit showed only as a rim crescent. Harrowmere's capsules, whose front faces sat at 0.49 against a `litFrom` of 0.5, drew threshold stripes. **Fix, D4 revised:** the key alone, signed, decides lit; key plus fill decide shadow, so the fill holds the faces it reaches out of shadow. `litFrom` 0.5 → 0.3, `shadowBelow` 0.15 → −0.25.
  2. **Shadow barely darker than mid** (`heroSkin` `#545553` against `#504A4C`). **Fix:** `shadowPull` 0.45 → 0.6, `minToneStep` 0.15 → 0.3.
  3. **Rowan's light painted a hard orange stripe on his own body** (the light sits at his skin, so only a narrow strip faces it). **Fix:** his body takes none of his own light; a ground box at his feet takes it instead (D8's open question, judged: no).
- **Round 15** (`shots/round-15/`, opened). Three bands now read on every curved shape, and Rowan's light falls on the ground.
  1. **Emberwood's plum shadow still faint** next to the hero sheet. **Fix:** `shadowPull` 0.75, `minToneStep` 0.45.
  2. **Warm light read as tan paint.** **Fix:** `warmLift` 0.8 → 1.1 (Rowan 0.55, lantern 0.66).
  3. **No proof that glow fogs** (style guide: "far lanterns dim into the mist"). **Fix:** an ember glow beside each fog sample.
- **Round 16** (`shots/round-16/`, opened; the third round, so the loop stopped):
  - The plum shadow reads; the glows dim from orange to brown with depth; the lantern and Rowan's light are warmer.
  - The other six spots were glanced at and are unchanged from round 13; the palettes view is identical after the `levelLooks.ts` move.
  - **Left, not fixed:**
    - the Drowned Mill's front faces rarely reach the shadow tone (its rig: an overhead key and a front fill), for story 0.12;
    - Harrowmere's leaned capsules show a thin lit strip where the key grazes the cylinder side: correct banding, to judge on real models;
    - warm light on dark wood still reads slightly tan.
  - Shadows and ink outlines are absent by design (0.11). "Stand out at a glance" has no scene yet (0.12). Among the stand-ins, the walker colours read distinctly in all three levels, and the fire family is the warmest thing in every shot.
- **Sign-off:** the round 14 and round 16 materials shots for each level were sent (SendUserFile). The developer signed off on the view, the revised band rule, the value guard and the final `SHADING` values (AskUserQuestion, 2026-11-14).
- **Final runs** (after the critic loop's last edit):
  - `make check`: exit 0, with 15 test files and 360 tests (253 before this story).
  - `make smoke`: exit 0, 3 passed and 1 skipped (by design). It runs `make build`, whose budget sheet is unchanged from 0.8: code 878 bytes, 8 files, 0.252 MB.
  - A grep of `dist/` for `uKeyDir`, `uWarmPos`, `lookShader`, `LOOK_BANDED`, the key art's name and `createMaterialsLookdevScene` finds nothing.
  - `make shots ROUND=16`: 38 look-dev checks and 9 shots.

- **Code review fixes (2026-11-14),** after the developer chose option 1 for both decisions and to apply every patch:
  - **The glow rule across a level change:** `look.trackGlow()` holds each glowing material (forgotten on `dispose`). `apply()` checks them all before changing anything and throws if one breaks the warm rule. `checkGlow` moved from `lookShader.ts` into `look.ts` (`glowProblem`). The view now disposes the lantern glass before leaving Emberwood and recreates it on return.
  - **AC16 and D13, reread with the developer's choice:** the rows' materials are reused across a switch; level-only materials (the lantern glass) come and go.
  - **Tests:** three new tests failed with the check disabled, then passed: a refused `apply()` changes nothing; it works once the glow is disposed; a cold `lantern` glow can't move into Emberwood. A fourth covers `setWarmLights()`, which now validates every light before writing any; a refused call leaves the old set. 365 tests.
  - **Shader:** `inverseTransformDirection`, deprecated in r185, is now `transformNormalByInverseViewMatrix`.
  - **ESLint:** string-keyed, template-literal and `Object.defineProperty`/`Reflect.set` forms of `onBeforeCompile`, and assignments to `vertexShader`/`fragmentShader`, are banned outside `render/materials/`. A throwaway file got 10 errors, one per form, while reading `fragmentShader` stayed allowed.
  - **Boundary scans:**
    - colour literals now include `#RGBA`, 8-digit hex and `Color`/`setRGB`/`setHex`/`setHSL`/`setStyle` with literal arguments;
    - a private field (`this.#add`) no longer counts as a colour;
    - a URL's `//` no longer hides the code after it;
    - GLSL markers include precision-qualified uniforms, every sampler type, `out vec4` and `layout(`, each with a control.
  - **Look-dev checks** (42 now):
    - P8 runs in every level and measures the side panel too, and the row labels must not overlap;
    - P6 reads the live warm-light count (`data-warm-lights`) and samples taken from the scene, not the rig;
    - P5 also visits Harrowmere, and a new check opens the Drowned Mill and switches to Emberwood and back (lantern made, then disposed).
  - **The view:**
    - `ready` is observed as soon as the view mounts;
    - a font failure and an asset failure get their own messages;
    - a spot's level comes only from the spot;
    - the scene disposes its `InstancedMesh`;
    - fog captions are rounded, and the depth list must match the sample count;
    - the staging layout's numbers are named constants.
  - **Prose:** the style guide and `shading.ts` now say the fill lifts surfaces near the shadow line into mid, but a surface turned fully away from the key stays in shadow; and that the minimum step can fall short only where a channel is near full. The Rowan rule is recorded in style guide §2 and `fireLights.ts`, for story 2.7.
  - **Records:**
    - AC1, AC3, AC9 and AC14 and Test 3 read as written before D15 and the revised D4. Where they differ, the Debug Log's deviations and this record govern: the value guard; `pit`/`water` shadow equals mid; chromaticity instead of RGB distance; flat slots show only mid.
    - T5's "test-first" means written first but not run red.
    - The "7 programs" note means 5 define sets plus instanced and skinned variants.
  - **Final runs:** `make check` exit 0 (365 tests); `make smoke` exit 0, with the budget sheet unchanged (878 bytes, 8 files); `make shots ROUND=17` with 42 checks and 9 shots. The materials shots were looked at and match round 16.

### Completion Notes List

- **The factories (AC1–AC3):** seven files in `src/render/materials/`, each a thin wrapper over `createLookShaderMaterial` in `lookShader.ts`. That file holds the one shared GLSL shader:
  - the vertex shader uses three's chunks in `meshlambert`'s order; a plain mesh, an `InstancedMesh` and a `SkinnedMesh` all draw on the page;
  - per-kind `#define`s give 7 programs in the view; per-level values are uniforms only.
  - Ground picks top or side by world normal; foliage is double-sided with flipped back normals; effects, backdrops, card silhouettes and Rowan's glowing parts are flat; card silhouettes take no fog.
- **Tones (AC9, D3, D15):** `tones.ts` computes lit, mid and shadow in TypeScript; mid is exactly the slot. The value guard keeps the bands in order; `pit` and `water` take only mid.
- **The look (AC7–AC8, AC10, AC12, D2):** `createLook(palette, rig)` holds the uniform objects every material shares. `apply()` recolours and relights in place: same materials, `version` unchanged, uniform objects never replaced. `setWarmLights()` throws for a carrier the rig doesn't list, for one that only glows, or past `maxWarmLights`, and allocates nothing.
- **What an intensity means (AC11, D4 revised):** the key alone, by its signed direction term and intensity, decides lit; the key plus the fill decide shadow. It is written in `shading.ts` and in the style guide §2.
- **Fire-family lights (AC13, D8):** `render/lighting/fireLights.ts` (Rowan: `heroGlow`, reach 1.5, intensity 0.5; shot: `shot`, reach 1, intensity 0.4; all †). The decision is recorded in the style guide §2.
- **The boundary (AC4–AC5):**
  - ESLint bans `ShaderChunk`, `ShaderLib`, `UniformsLib` and `UniformsUtils` beside the existing names, and `onBeforeCompile` in every layer but `render/materials/`, merged with the dynamic-import selectors.
  - `shaderBoundary.test.ts` finds no GLSL outside `render/materials/`, finds GLSL inside it (the control), finds no shader files, and finds no colour literal in materials code.
- **The view (AC14–AC18):** `src/lookdev/materialsView.ts` shows:
  - nine rows: seven factories, the recolour strip, and the fog sample with its glows;
  - each slot's tones beside its row;
  - the key art, the rig, an in-place level picker (`history.replaceState`) and the reused stats panel.
  - Plumbing: `LookdevSpot.level`, `LookdevMountOptions.level` and `LookdevViewHandle.ready`. The key art is decoded before the page reports ready.
- **Checks (AC19):** `tests/e2e/lookdev/materials.spec.ts`, 15 checks:
  - P1 no page error in any level;
  - P2 and P3 the seven rows in order, every mid against the style guide;
  - P4 the probe within 1 per channel;
  - P5 the in-place switch with no new program;
  - P6 the warm samples; P7 an unknown level; P8 no scrolling, and the spots' levels.
- **New decisions beyond D1–D14** (the developer saw D15 and the revised D4 at sign-off):
  - **D15**, the value guard;
  - **D16**, Vitest's `fsModuleCache` turned off (a test-config line, not a dependency);
  - **D4 revised** in the critic loop;
  - **D8's open question judged:** Rowan's body takes none of his own light.
- **Proposed for `_bmad-output/project-context.md`** (the developer edits it; not edited here):
  - "Factory materials share their look's uniforms: never `clone()` one; ask the factory for another."
  - "Vitest's module cache is off (`vite.config.ts`), because a test that lists files with `import.meta.glob` would otherwise miss new files."
- **For later stories:**
  - **0.11:** a directional shadow needs shadow-map sampling added to `lookShader.ts`; nothing there is named `worldPosition`.
  - **0.12:**
    - judges the rigs; the Drowned Mill's flat front faces and Harrowmere's grazing strips;
    - whether warm light on dark wood is warm enough (`warmLift`);
    - 0.7's watch items.
  - **0.13:** the card-silhouette factory takes level slots today.
  - **Epic 1:** picks which warm lights to send each frame (at most `maxWarmLights`).
  - **Epic 2:** maps glTF material names to slots (`look.tones()` already guards unknown names).

### File List

- `src/core/invariant.ts` (new)
- `src/core/invariant.test.ts` (new)
- `src/render/materials/shading.ts` (new)
- `src/render/materials/tones.ts` (new)
- `src/render/materials/tones.test.ts` (new)
- `src/render/materials/look.ts` (new)
- `src/render/materials/look.test.ts` (new)
- `src/render/materials/lookShader.ts` (new)
- `src/render/materials/groundMaterial.ts` (new)
- `src/render/materials/foliageMaterial.ts` (new)
- `src/render/materials/characterMaterial.ts` (new)
- `src/render/materials/propMaterial.ts` (new)
- `src/render/materials/effectMaterial.ts` (new)
- `src/render/materials/backdropMaterial.ts` (new)
- `src/render/materials/cardSilhouetteMaterial.ts` (new)
- `src/render/materials/factories.test.ts` (new)
- `src/render/materials/shaderBoundary.test.ts` (new)
- `src/render/lighting/fireLights.ts` (new)
- `src/lookdev/levelLooks.ts` (new)
- `src/lookdev/materialsView.ts` (new)
- `tests/e2e/lookdev/materials.spec.ts` (new)
- `src/render/lighting/lighting.test.ts` (modified: the fire-light cases)
- `src/render/lookdevScenes.ts` (modified: `createMaterialsLookdevScene`, `MATERIALS_ROWS`)
- `src/lookdev/assetBrowser.ts` (modified: the materials view; `level` in the options; `ready` in the handle)
- `src/lookdev/main.ts` (modified: passes `level`; waits for `ready`)
- `src/lookdev/spots.ts` (modified: `level` field, three spots)
- `src/lookdev/palettesView.ts` (modified: imports the level table from `levelLooks.ts`)
- `src/lookdev/rendererView.ts` (modified: exports `buildStatsPanel`)
- `src/lookdev/lookdev.css` (modified: `lookdev-materials-*` rules)
- `eslint.config.js` (modified: four more banned names; the `onBeforeCompile` rule)
- `vite.config.ts` (modified: `fsModuleCache: false`, D16)
- `docs/STYLE_GUIDE.md` (modified: §2 prose, the shading settings and the fire-family lights)
- `README.md` (modified: the look-dev page shows the materials)
- `_bmad-output/implementation-artifacts/0-9-build-the-shared-materials.md` (this story)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

## Change Log

- 2026-11-14: Story created (ready-for-dev). The developer chose the fire-family lights at creation (D8): Rowan and his shots carry real warm lights; embers, bells and weapon pickups glow only.
- 2026-11-14: Story implemented.
  - Added:
    - the seven material factories on one shared shader, with tones in TypeScript, the shared-uniform look and warm-light gating;
    - `core/invariant.ts`, the fire-light data, and the shader boundary in ESLint and a test;
    - the look-dev materials view with 15 checks.
  - New decisions: D15 (the value guard), D16 (Vitest's module cache off), D4 revised in the critic loop.
  - Tests: 107 new (360 in all); 15 new look-dev checks (38 in all). Nine throwaways behaved as specified, after the M4 cache fix.
  - Three critic rounds (14–16) fixed 6 problems, and the developer signed off. Status set to review.
- 2026-11-14: Code review.
  - 2 decisions resolved, both option 1: the glow rule is enforced in the look across level changes, and the Rowan rule is recorded for story 2.7.
  - 14 patches applied, 0 deferred, 7 dismissed.
  - 365 tests and 42 look-dev checks pass. Status set to done.

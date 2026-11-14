---
project_name: 'emberbound'
user_name: 'Emilijan'
date: '2026-11-13'
sections_completed: ['technology_stack', 'engine_rules', 'performance_rules', 'organization_rules', 'testing_rules', 'platform_rules', 'anti_patterns']
existing_patterns_found: 0
status: 'complete'
rule_count: 130
optimized_for_llm: true
source: '_bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md'
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing game code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **three.js r187** (`three@0.187.x`, `@types/three` at the same version). Uses WebGLRenderer with GLSL; not WebGPURenderer, not TSL.
  - three.js has no semantic versioning, so any revision can break APIs.
  - Check the docs for this revision before using an API (CLAUDE.md).
- **TypeScript 6.0.x**, strict.
  - **Not 7.x:** typescript-eslint cannot run on TypeScript 7.0.
  - Relative imports carry `.ts`. Type-only imports use `import type`.
  - No enums, namespaces or parameter properties (`erasableSyntaxOnly`).
- **Vite 8.3.x** (8.3.3 or later): dev server, production build with `base: './'`, and a second entry `lookdev.html` for development only.
- **Vitest 5.x**, Node environment only. There is no jsdom; DOM screens are tested through Playwright.
- **Playwright 1.65.x**: smoke checks in Chromium and Firefox, and critic-loop screenshots against the dev server. **Every browser test runs WebGL on the NVIDIA GTX 1650** (`GPU=nvidia`, the Makefile's default; README, "The GPU"). Keep it so, and check the WebGL renderer string before claiming that a render ran on the GPU.
- **ESLint 10.x** (flat config only) with **typescript-eslint 8.72.x** `strictTypeChecked`, plus **Prettier 3.x**.
- **Node.js 26.13.x**, pinned in `mise.toml`. It runs `scripts/*.ts` natively, with no runner.
- **`@gltf-transform/cli` 4.5.x** (development only) and **`@types/node`**.
- **`yaml`** (development only, the token drift test, approved 2026-11-13).
- **Outside npm:**
  - Tiled 1.12.x, the level editor.
  - Blender, version pinned in Epic 2.
  - git-lfs.
  - Web apps the developer runs by hand, outside the build: the Gemini app (Nano Banana Pro) for reference art and concepts, and Tripo (Pro plan) for the four views and the meshes. Agents write the prompts and check the results; they never call these services or handle their keys unless the developer approves it.
  - Docker, only if a service is ever needed.
- **Nothing else.** Ask the developer before adding any dependency, library or tool.

## Critical Implementation Rules

### Engine-Specific Rules (three.js and the browser)

- **`sim/` is pure.**
  - No three.js, no `window` or `document`, no `Math.random`, `Date`, `performance.now`, `Math.sin` or `Math.cos`.
  - Use `sim/math.ts` (its own vectors, sine and cosine) and `world.rng`. Node tests and browsers must agree to the bit.
- **three.js only in `render/` and `lookdev/`.**
  - GLSL, `ShaderMaterial`, `RawShaderMaterial`, `onBeforeCompile` and post-processing passes live **only** in `render/materials/`. Everything else asks its factories for materials.
  - Materials from loaded glTF files are stripped and replaced by those factories.
- **Rendering reads `DeepReadonly<World>` plus the frame's `SimEvent`s, and never writes.**
  - Interpolate from `prevX`/`prevY` to `x`/`y` with the alpha.
  - Key views by entity id (view-sync pattern); never keep a simulation object between frames.
  - Dispose geometry, materials and textures when a view or a level goes away.
- **Animation:** the clip comes from simulation state through `CLIP_FOR_STATE` and `chooseHeroClip` (spit clips are upper-body overlays played over the base clip; land replaces the idle clip briefly). `AnimationMixer` advances on real frame time; it is visual only.
- **"On screen" is the simulation's logical view** (at least 19 × 10.4 tiles, owned by `sim/camera.ts`), never the canvas size. The view camera only frames it.
- **Hit-stop lives in the simulation,** counted in steps. **Shake lives in rendering:**
  - driven by events, through `shake.raise()`, which takes the higher value and never adds
  - its values come from `CONFIG.feedback`
  - reduced motion turns it off, and turns full-screen flashes (`render/fx`, such as the seal-break ember flash) into a short fade; hit-stop and the 9 Hz blink stay
- **Story moments** (the seal break, the held beat) are simulation state, with cues in `CONFIG.story`.
  - Rendering stages them from the cues and keeps no timings of its own.
  - Rowan can't be hurt during them, and attacks already in flight are cleared.
- **The step that emits `levelCompleted` is the World's last.** `step()` does nothing afterwards, so the clear time is final even when the loop runs more steps that frame.
- **Known three.js traps:**
  - Give `InstancedMesh` bounding volumes, or culling drops it.
  - Snap the shadow camera to texel steps, or edges crawl.
  - `Clock` is deprecated (r183); the loop uses the `requestAnimationFrame` timestamp.
  - Cap the pixel ratio at 1.5.
- **Model conventions:** 1 unit = 1 tile; +Y up; characters' origin at the feet, facing +X; kit pieces' origin at the bottom-left of their tile.

### Performance Rules

- **Target:** median frame time 16.7 ms or less and 99th percentile 20 ms or less, on an Iris Xe-class laptop at 1080p. Measure the **release build on real hardware with `?perf=1`**. Headless or Playwright timings never count.
- **The loop:**
  - clamp `dt` to between 0 and 0.25 s
  - at most 5 simulation steps per frame, then drop the backlog
  - one simulation step takes 1 ms or less †
- **No allocation per simulation step:**
  - Shots, seeds, millstones and particles come from pools allocated in `createWorld` (`isActive` flag).
  - No closures, arrays or `.map`/`.filter` in per-step or per-frame hot paths; use loops.
- **Render budgets (†):**
  - 150 draw calls or fewer, 250,000 triangles or fewer, 256 MB of texture memory or less.
  - One shadow map, 2048² at most.
  - 2 post-processing passes at most.
- **Assets:**
  - 30 MB in total; per-asset budgets are enforced by `make build`.
  - Models are `.glb` with meshopt (`make models`).
  - Shared assets (fonts, icons, sound effects, Emberwood's music, the hero, enemies, pickups and markers, story cards) load at boot; each level's own assets load behind its level-line card, and the previous level is disposed. Bundles are assigned by kind prefix (architecture, Asset Management).
  - The manifest is built from `public/assets/` before Vite. Test levels never ship: the release manifest leaves them out and `make build` deletes them from `dist/`.

### Code Organization Rules

- **Layers:**
  - `core/` imports nothing.
  - `sim/` imports only `core/`.
  - `render/`, `audio/` and `ui/` import types from `sim/` and *values* from `sim/config.ts` only.
  - `app/` hosts the simulation.
  - `debug/` is imported only by `main.ts`, behind `import.meta.env.DEV`.
  - `lookdev/` imports `render/`, `ui/`, `content/` and `core/`.
  - ESLint enforces the full boundary table in the architecture.
- **Where things go:**

| What | Where |
| --- | --- |
| Gameplay numbers | `sim/config.ts`, the only place |
| Story text | `content/storyText.ts` |
| Palettes and lighting | Data in `render/palettes/` and `render/lighting/` |
| Browser features | `platform/` |
| UI timings, card minimum, loading-card floor | `core/uiTimings.ts`, in `…Seconds`, never frames |
| Shared UI components | `ui/components/` (menu item, panel, scrim, slider, toggle, notice line, confirm dialog) |
| Overlay sizes and tokens | Multiples of `--tile` (set only by `ui/overlay.ts`); DESIGN.md tokens as `--{group}-{name}` |
| Level sources | `levels/*.tmj` |
| Shipped assets | `public/assets/`, referenced by **manifest id**, never by path |

- **Wiring:** everything is wired explicitly in `main.ts`. No singletons and no service locator.
  - Loading goes through the `AssetLoader` port in `core/loading.ts`, implemented by `render/assets/loader.ts` and passed in by `main.ts`. The app owns loading state, progress and the one silent retry.
  - Two typed channels: `SimEvent` (past tense, simulation to presentation) and `AppCommand` (imperative, into the app).
  - Presentation reads settings, the last-used device and feature status (`isAudioLocked`, `isFullscreen`, features turned off) only from the per-frame `PresentationSettings` snapshot.
- **Entities:** plain objects with `kind`, `state` and `stateSteps`.
  - All of an entity's transitions live in one function.
  - Ids come from `world.nextId++`.
  - Factories are in the enemy registry.
- **Naming:**
  - TypeScript files are camelCase, one main export each, no barrel files (except `sim/enemies/index.ts`).
  - Types are PascalCase.
  - String-literal unions, never enums.
  - Step counts end in `…Steps`. Booleans start with `is`, `has` or `can`.
  - **A level's id is its kebab-case file name, used everywhere** (`drowned-mill`).
  - Asset files are kebab-case with a kind prefix (`enemy-thorn-flyer.glb`). glTF nodes and clips are snake_case.
  - Times outside `sim/` end in `…Seconds` or `…Ms`.
  - CSS classes start with the component's name from the UX spines (`hud-hearts`, `results-stat`); shared components use `ui-` (`ui-menu-item`).
- **Failures:**
  - `invariant()` for bugs.
  - `Result` for expected failures.
  - `platform/` wrappers turn a feature off at its first failure.
  - No `try`/`catch` inside `sim/`.
  - Log only through `core/log.ts`, never in `sim/`.

### Testing Rules

- **Every simulation rule has a unit test,** beside the code (`x.test.ts`). Tests import `CONFIG` values and never repeat literal numbers.
- **The feel regression test** (full jump 3.30 tiles; a tap, jump held for exactly one step, about 0.8; about 52 steps in the air) must stay green. Never "fix" it by changing numbers.
- **The determinism test:** a recorded input stream run twice gives identical state hashes. Any new randomness goes through `world.rng`.
- **Levels:**
  - Every break or rise on the main path needs a mark in the `jumps` layer.
  - `make test` runs the compile validation, the jump search and the coverage check.
- **Start tests anywhere** with `createWorld(level, { spawnAt })`. There are no test-only code paths in the simulation.
- **No jsdom.** DOM screens are covered by Playwright smoke checks. Screenshots are compared by eye, never pixel-diffed. So navigation rules (confirm dialog, settings return, auto-pause, card guard, hold-to-repeat) live in `app/` and `input/`, where Vitest covers them.
- **Before saying a change works:** run `make check`.
- **For any visual change:** run the critic loop with `make shots ROUND=n`: at most 3 rounds, then report before and after. It runs the look-dev checks in `tests/e2e/lookdev/` first.

### Platform & Build Rules

- **Targets:** desktop Chrome, Edge and Firefox (Safari best-effort); keyboard and standard gamepads. No touch; phones and tablets get a note.
- **itch.io runs the game in a cross-origin iframe.**
  - Gamepad, storage, audio and fullscreen may throw or be refused. Each is wrapped in `platform/`, and the first failure turns that feature off. **The frame loop never stops.**
  - The `AudioContext` is resumed on the first key press or click. Gamepad presses are not user activation: after a gamepad-passed title gate, audio stays locked, the game runs silently, and the title menu shows the audio notice. Locked is not a failure.
- **Build:**
  - `base: './'`, so every URL is relative.
  - 1,000 files or fewer, 30 MB or less.
  - The look-dev page is excluded.
  - Development-only code sits behind `import.meta.env.DEV`; only `?perf=1` ships.
- **Input:**
  - One `InputFrame` per step. During play, confirm also latches `InputFrame.confirmPressed`; only the story director reads it (the replay skip).
  - Presses are latched until consumed, and hit-stop never counts input buffers down.
  - Stick thresholds: 0.35 sideways, 0.5 up and down.
  - Menu, pause and mute actions go to the app, never to the simulation. Menu actions: up, down, left, right, confirm, back. Esc pauses in play and means Back elsewhere.
  - A held menu direction repeats after 0.4 s at 8 per second. The values come from `core/uiTimings.ts`.
  - Cards count only a press that began after the card appeared; presses latched before it are dropped.
  - Bound keys call `preventDefault` while the game has focus.
  - Last device: a key press or click sets keyboard; a gamepad button, or a stick past the play thresholds, sets gamepad.
  - Auto-pause on a hidden tab, window blur, leaving fullscreen, or the gamepad disconnecting or turning off. Held input is cleared, and Paused never resumes by itself. On cards and the loading card, a trigger only clears held input.
- **Tooling:**
  - Always run `make` targets.
  - Tool versions come from `mise.toml`; any service runs in Docker; binaries go in Git LFS.
  - Relative imports carry `.ts` and types use `import type`: Node runs `scripts/*.ts` natively.
  - Never commit secrets.

### Critical Don't-Miss Rules

- **Never retune a proven GDD number** (one without †) without asking. Numbers marked † are tuned only with the developer, in the epic named.
- **Never write to `World` outside `sim/`.** Cheats go through `sim/debugCommands.ts`.
- **Never let a press vanish,** never decide "on screen" from the canvas, and never put GLSL outside `render/materials/`.
- **Never hard-code** story text, asset paths, gameplay numbers, UI timings or `--tile`.
- **Never add a dependency or framework without asking.** No React, Howler, jsdom, tsx and so on. **Never TypeScript 7, never enums.**
- **Never grow scope** unless the developer asks for it (GDD PR30).
- **When no pattern covers a situation,** follow the closest one and flag it in the story's notes (architecture AR248).
- **The pit rule:** "last stable ground" is never a moving platform and never next to a hazard.
- **Story:**
  - No text during play; level lines appear on loading cards, on every load. On a replay, confirm skips the reading floor once loading is done.
  - Level 3 ends: held beat, closing card, all-bells card if earned, then results, then the title menu (first play) or the level select (replay).
  - On a Level 1 or 2 replay, the all-bells card comes after the results.
- **After a three.js upgrade,** read the migration notes and re-run the critic loop: revisions change APIs and looks.
- **Legal:**
  - Nothing from Toki or any other game. Nothing invented by D&D.
  - Log every asset, its tool, its licence and its AI flag in `docs/ASSETS.md`.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any game code. Read CLAUDE.md too; this file doesn't repeat its general rules.
- Follow ALL rules exactly as documented. When in doubt, prefer the more restrictive option.
- **The architecture document wins on any conflict.** Its sections: boundaries in Project Structure, patterns and examples in Implementation Patterns. Fix this file to match.
- If a new pattern emerges, propose an update to this file in the story's notes. Don't silently diverge.

**For Humans:**

- Keep this file lean and focused on what agents would otherwise get wrong.
- Update it when the stack or the architecture changes (for example, three.js or TypeScript upgrades).
- Review it after each epic's retrospective, and remove rules that have become obvious.

Last Updated: 2026-11-13

---
title: 'Game Architecture'
project: 'Emberbound (working title)'
date: '2026-11-13'
author: 'Emilijan'
version: '1.1'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
status: 'complete'
engine: 'three.js r187 (WebGLRenderer, GLSL), TypeScript 6.0, Vite 8.3'
platform: 'Desktop web browsers (HTML5 on itch.io)'

# Source Documents
gdd: '_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md'
epics: '_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md'
brief: '_bmad-output/planning-artifacts/briefs/brief-emberbound-2026-11-12/brief.md'
narrative: '_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md'
ux_experience: '_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md'
ux_design: '_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md'
planning_doc: 'docs/PROJECT_BRIEF.md'
---

# Game Architecture

## Executive Summary

**Emberbound (working title)** is built on three.js r187 (WebGLRenderer with GLSL), TypeScript 6.0 and Vite 8.3, for desktop browsers (Chrome, Edge, Firefox), shipped as an HTML5 build on itch.io.

**Key architectural decisions:**

- **A pure, deterministic simulation** (`sim/`: no three.js, no DOM), stepped at a fixed 60 Hz. Rendering, audio and the interface read a `DeepReadonly` snapshot plus typed events, and never write.
- **The simulation owns the gameplay camera and the in-level story moments** (the seal break, the held beat). So the on-screen attack rule, story safety and clear time are deterministic and testable.
- **Levels are authored in Tiled and compiled at build time** into a validated game format. A marked-jump search on the real simulation proves every jump is possible.
- **The renderer owns the style.**
  - All shader and material code lives in `render/materials`: WebGL and GLSL now, and a one-module switch to TSL later.
  - Palette and lighting are data, per level.
- **No framework dependencies:** a DOM overlay for the interface and the Web Audio API directly.
- **Local development** is pinned with mise and driven by a Makefile. Binaries live in Git LFS. Any service ever needed runs in Docker.

**Project Structure:** domain layers with enforced import boundaries (ESLint, plus a DOM-free TypeScript config for the simulation). All 21 core systems are mapped to locations.

**Implementation Patterns:** 8 patterns (4 standard, 4 novel) and 24 consistency rules.

**Ready for:** epics and stories (`gds-create-epics-and-stories`), after the two follow-ups in Architecture Validation (CLAUDE.md and the GDD).

## Document Status

This architecture document was created through the GDS Architecture Workflow on 2026-11-13.

**Revised 2026-11-13 (version 1.1)** through `gds-correct-course`, folding in the UX design's notes for architecture (`ux-designs/ux-emberbound-2026-11-13/`: EXPERIENCE.md and DESIGN.md). Changes: more auto-pause triggers; reduced motion for full-screen flashes, and its default; the audio-locked state; `--tile`; the new interface modules and UI timings; and the app states the UX adds. "UX" plus a decision id (D14, M3, …) cites that folder's `.decision-log.md`.

† marks a starting guess, tuned with the developer in the epic named (the GDD's convention).

**Steps Completed:** 9 of 9 (Complete)

---

## Project Context

### Game Overview

**Emberbound (working title)**: a short 2.5D side-scrolling action platformer for the desktop browser. A cursed fire-caster runs, jumps and spits embers through three levels and one warden; each broken seal changes his body and gives back an ability. Version one is 20 to 30 minutes long and free on itch.io.

### Technical Scope

**Platform:**

- Desktop web browsers: current Chrome, Edge and Firefox; Safari best-effort.
- Hosted as an HTML5 game on itch.io.
- Keyboard and standard gamepads.
- Landscape, resizable, fullscreen. Phones and tablets get a note only.
- Later, not in version one: a desktop build (Electron and steamworks.js, per the planning doc).

**Genre:** Action platformer, a high-complexity genre: the feel table, the combat specs and the checkpoint rules must hold exactly.

**Project Level:** Medium. Single-player, offline, small content. Demanding on feel, look and test discipline. One developer, new to game development, building through AI agents, so rules that keep agents consistent matter more than usual.

**Settled stack (CLAUDE.md):**

- three.js on WebGL, TypeScript (strict), Vite.
- Vitest for the simulation; Playwright for screenshots.
- Tripo, then Blender (through MCP), then glTF.
- Open when this document started: the level editor, the audio tools, the image model. The level editor is now settled as Tiled (Architectural Decisions); the other two remain open.

### Core Systems

| System | Complexity | GDD Reference |
| --- | --- | --- |
| Fixed-step loop and render interpolation (60 Hz, independent of refresh rate) | Medium | Technical Specifications; CLAUDE.md |
| Player controller (feel table, buffer, coyote, apex gravity, jump cut, crouch, drop-through, stomp bounce) | High | Movement System |
| Bodies and tile collision (solid, one-way, drop-through, moving and circular waterwheel platforms, spikes, pits) | High | Movement System; Combat System |
| Combat and damage (ember spit, aiming, triple and piercing shots, hitbox rules, thorn rule, knockback, invulnerability, pit rule, death and respawn) | High | Combat System |
| Enemies: walker, thorn flyer, rooted spitter, with the on-screen-only attack rule | Medium | Enemy roster |
| The warden (dormant until entry, 2 phases, attack scheduler, warnings, millstone targeting, reset on respawn) | Medium-high | The Warden of the First Seal |
| Ledge grab (from Epic 4) | Medium | Player Abilities and Unlocks |
| Hit feedback (hit-stop, trauma-based shake, blink, flash, reduced motion) | Medium | Hit feedback |
| Camera (look-ahead, vertical dead zone, re-centring, clamping, minimum 19 × 10.4 tiles at any aspect ratio) | Medium | Camera |
| Input (keyboard and gamepad, latched taps, stick thresholds, last-used device for icons, auto-pause, safe failure) | Medium | Controls and Input |
| Level data and loading (tiles, entities, checkpoints, bells, embers, pickups, story props, regions, exit at a prop) | Medium | Level Design Framework |
| Jump-possibility verification for every jump in every level | High (novel) | Platforming metrics; Success Metrics |
| Rendering and look (2.5D layers, shared materials, palette per level, lighting rig per level, outline and grading passes, recoloured enemies, hero stage swap) | High | Art Style; CLAUDE.md |
| Look-dev page and critic-loop screenshot harness | Medium (novel) | Development Epics; Epic 0 |
| Asset pipeline integration (glTF from Blender, 13 hero animations, size budgets within 30 MB) | Medium | Asset Requirements |
| Story director (intro, level-line loading cards, seal break, held beat, closing and all-bells cards, safe story moments, skip rules, replay-form rule) | Medium (novel) | Story Delivery; Session flow; narrative design |
| Silhouette story cards rendered in the engine, with the text drawn over them | Medium | Story Delivery |
| Audio (music per level, warden arrangement switching at phase 2, stingers, ambience beds, the wheel getting louder with distance, Level 3 fade-out, motif, browser autoplay rules) | Medium | Audio and Music |
| Interface and session flow (boot loading, HUD, title gate and menu, Continue, level select, loading card, results, pause with restart and quit confirms, settings, notices, error panels, control signs) | Medium | Session flow; Controls and Input; UX spines |
| Save and progress (local storage, auto-save per level, bells across replays, best times, safe failure) | Low | Platform-Specific Details |
| Clear-time tracking (excludes pauses and story moments) | Low | Session flow |

### Technical Requirements

- **Frame rate:**
  - 60 fps sustained.
  - Median frame time 16.7 ms or less, and 99th percentile 20 ms or less, over a full Level 1 playthrough.
  - Measured on real hardware: a 2020-era laptop with Iris Xe-class integrated graphics, at 1080p.
- **Same game at any refresh rate:**
  - Identical gameplay at 60, 120 and 144 Hz, and a slow frame never changes an outcome.
  - A fixed 60 Hz simulation step, with rendering interpolated between steps.
  - Frame time clamped to zero or above; steps per frame capped.
- **Loading:**
  - 30 MB or less in total.
  - First input within 10 s on a 50 Mbit/s connection.
  - Level transitions of 3 s or less (loading, behind the level-line card).
- **itch.io limits:** 1,000 files, 500 MB in total, 200 MB per file.
- **Resilience:**
  - Gamepad, storage, audio and fullscreen each fail independently.
  - The frame loop never stops because of one of them.
  - Auto-pause when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or is turned off (UX D14, Q7).
- **Saves:** in the browser, automatically after each level. Leaving mid-level restarts that level.
- **Networking:** none.
- **Code rules (CLAUDE.md):**
  - The simulation is pure TypeScript with no three.js imports and runs in Node.
  - Rendering reads the simulation and never writes to it.
  - Collision comes from the tile grid only.
  - Gameplay numbers live in one config module.
  - Every simulation rule has a unit test.
  - An automated test proves every jump is possible.
- **Accessibility and text:**
  - Reduced motion turns shake off and full-screen flashes into a short fade, and stops the HUD's last-heart pulse and icon shake. Hit-stop and the 9 Hz blink stay (UX D17).
  - A new save takes its reduced-motion default from the browser's `prefers-reduced-motion` (UX Q5).
  - Hitboxes favour the player.
  - English only, with story text kept apart from the art.

### Complexity Drivers

**High complexity:**

1. **Feel fidelity.** The prototype's proven numbers must reproduce exactly in a step-based simulation: durations rounded to whole steps, apex gravity, jump cut, buffer and coyote time, the turn-around boost. Drift breaks the game's main selling point.
2. **Variety of collision:**
   - one-way ledges with the "feet above on the previous step" rule
   - the drop-through window
   - moving platforms that carry their rider
   - circular waterwheel platforms that stay level
   - spikes that aren't solid
   - finding ledge corners for ledge grab
   - the pit rule's "last stable ground"
3. **A renderer that owns the style.**
   - Shared materials, a palette per level, a lighting rig per level, outline and grading passes, and a look-dev page.
   - Meshes from the AI pipeline are normalised on import.
   - Enemies are recoloured per level, and the hero swaps stage.

**Novel concepts:**

4. **Jump-possibility verification:** tooling that drives the real simulation to prove every jump in every level can be made.
5. **Critic-loop screenshot harness:** fixed camera spots, captured headless, compared against the style guide.
6. **Story director:**
   - The simulation owns story moments (the seal break, the held beat), and Rowan can't be hurt during them.
   - Skip rules, and clear time that excludes story moments.
   - The replay-form rule: Rowan's form and abilities follow his first arrival in the level.
   - Silhouette cards rendered in the engine.
7. **Hit-stop and shake around a fixed-step simulation.** Hit-stop has to pause simulation steps deterministically. Shake has to stay visual-only.

### Technical Risks

| Risk | Why it matters |
| --- | --- |
| AI-generated meshes need clean rigging and animation | The GDD's top risk. Epic 2 proves the pipeline; the fallback is a model built by hand. |
| WebGL performance on integrated graphics | Shadows, post-processing passes and many props on an Iris Xe-class laptop. Must be measured on real hardware. |
| itch.io runs the game in a cross-origin iframe | Gamepad security errors (already seen in the prototype), partitioned or blocked storage, autoplay rules for audio, permission for fullscreen. Verify against current itch.io and browser documentation. |
| Headless WebGL in Playwright renders in software | Slow, and possibly different from a GPU. Screenshots are only for the critic loop, never for performance. |
| Level editor not chosen | Resolved: Tiled (Architectural Decisions, decision 9). |
| three.js API changes between versions | Check the current documentation (CLAUDE.md); pin the version. |
| Determinism | Simulation and jump tests need identical results on every run: no unseeded randomness and no wall-clock time in the simulation. |
| Audio tools not chosen | Blocks Epic 3's audio. |

---

## Engine & Framework

### Selected Engine

**three.js r187** (npm `three@0.187.x`) on WebGL, with TypeScript 6.0, Vite 8.3 and Node.js 26 LTS. The stack is settled in CLAUDE.md; versions verified on 2026-11-13.

**Rationale:**

- **Browser first.** The game ships as an HTML5 build on itch.io.
- **We own the loop, the simulation and the rules.** three.js is a rendering library, not an engine. The project needs that anyway: a pure simulation that runs in Node for tests, a fixed 60 Hz step and tile collision. The Sprout prototype was built the same way, on r128.
- **We own the style.** 3D characters on a 2D play plane with layered backdrops need full control of materials, passes and lighting, as the "renderer owns the style" rule requires.
- **Small download.** three.js is modular and tree-shakes well, which fits the 30 MB budget.
- **Trade-off:** no editor, and no built-in physics, scene management, UI or audio. All of it is custom. That's accepted: the simulation is custom by design, and the other pieces are small at this scope.
- **Watch:** three.js development is moving to WebGPURenderer and its shader language, TSL (about 79% of r187's core changes). WebGLRenderer remains supported. The renderer is chosen in Architectural Decisions.

### Toolchain

| Tool | Version line | Pinned in | Notes |
| --- | --- | --- | --- |
| Node.js | 26 LTS (26.13.x) | `mise.toml` | Active LTS since 2026-10-28. npm comes with it. Runs `scripts/*.ts` directly through its built-in type stripping (stable since 24.12). |
| three | r187 (0.187.x) | `package.json` | Released 2026-10-30. No semantic versioning: any revision can break APIs. Types from `@types/three` at the matching version. |
| Vite | 8.3.x | `package.json` | Rolldown bundler since Vite 8. Dev server, production build, hashed asset names. Use 8.3.3 or later: 8.3.0 to 8.3.2 have known vulnerabilities. |
| TypeScript | 6.0.x | `package.json` | The last JavaScript-based compiler, strict by default. Chosen over 7.0 because typescript-eslint can't run on 7.0, which has no compiler API. Move to 7.x as its own story once 7.1 and typescript-eslint support it. |
| ESLint and typescript-eslint | ESLint 10.x; typescript-eslint 8.72.x | `package.json` | Flat config only (ESLint 10). typescript-eslint 8 supports TypeScript 6.0 but not 7.0; confirm its peer range for ESLint 10 at scaffold. Rules in Implementation Patterns. |
| Prettier | 3.x (3.9, or 3.10 once two weeks old) | `package.json` | Formatting, so agents' code looks the same. Approved by the developer on 2026-11-13. |
| `@gltf-transform/cli` | 4.5.x | `package.json` | Model compression, development only. Approved 2026-11-13. |
| `@types/node` | Matching Node 26 | `package.json` | Types for `scripts/` and Node-side tests; types only. Approved 2026-11-13. |
| Vitest | 5.x | `package.json` | Simulation tests in Node. Needs Vite 6.4+ and Node 22.12+. |
| Playwright (`@playwright/test`) | 1.65.x | `package.json` | Screenshot harness and browser checks. Pin the exact version. Its browsers are installed by `make setup`. |

**Version policy:**

- Exact versions everywhere: in `mise.toml` for tools and in `package.json` for libraries, with the lockfile committed.
- At scaffold time, take the newest patch that is at least two weeks old.
- Each three.js upgrade is its own story, with the critic loop re-run: a new revision can change how materials look.
- Per CLAUDE.md, ask the developer before adding any dependency beyond this table.

### Local Development Environment

**Rule (developer decision, 2026-11-13):** local development on the developer's machine is reproducible and started through one front door.

- **Tool versions live in `mise.toml`** ([mise-en-place](https://mise.jdx.dev/)), committed at the repository root.
  - Its `[tools]` section pins every command-line tool the project needs, at an exact version: Node.js now; later tools, such as the itch.io upload tool in Epic 6, are added there too.
  - Nobody relies on a globally installed Node or tool version.
  - Personal overrides go in `mise.local.toml`, which is never committed.
- **Library versions live in `package.json` and its lockfile.** mise does not manage the project's npm dependencies.
- **A `Makefile` is the single entry point** for starting, developing, testing and building.
  - Every target runs its commands with the mise-pinned tools, through `mise exec --` or an activated shell; Epic 0 decides which, after checking mise's current documentation.
  - Agents and the developer use `make` targets rather than raw `npm`, `npx` or `vite` commands, so everyone runs the same thing.
  - `make help` is the default target and lists the others.
- **Starting targets** (the exact set is finalised in Epic 0, story 1; later epics add to it):

| Target | Does |
| --- | --- |
| `make help` | List the targets (default) |
| `make setup` | `mise install`, `npm ci`, install Playwright's browsers |
| `make dev` | Start the Vite dev server (the game and the look-dev page) |
| `make test` | Run the simulation tests (Vitest), once |
| `make test-watch` | Run the simulation tests in watch mode |
| `make shots ROUND=n` | Run the screenshot harness against the dev server and save to `shots/round-n/` (critic loop) |
| `make smoke` | Playwright smoke checks in headless Chromium and Firefox |
| `make lint` | ESLint |
| `make format` | Prettier, writing changes |
| `make typecheck` | `tsc --noEmit` on the root project, then on `src/sim/tsconfig.json` (no DOM types) |
| `make check` | Lint, formatting check, type check and tests together. Run before saying a change works (CLAUDE.md). |
| `make levels` | Compile and validate the Tiled levels into `public/assets/levels/` |
| `make models` | Compress Blender exports with gltf-transform into `public/assets/` |
| `make build` | Levels, type check, tests, Vite build, manifest, budget checks (see Build and Release) |
| `make preview` | Serve the production build locally |
| `make clean` | Remove build output and caches |
| `make release` | Upload `dist/` to itch.io with butler (added in Epic 6) |

- **Services run in Docker.** Version one needs no database or server: saves stay in the browser. If a database or any other service is ever needed (for example, an analytics backend for release measurement), it runs in Docker through a committed `docker compose` file, started and stopped with `make` targets (such as `make services-up` and `make services-down`). It is never installed on the host.

### Project Initialization

Epic 0, story 1: scaffold from Vite's official minimal template into the existing repository root, add `mise.toml` and the `Makefile`, then reshape everything into the structure set in Project Structure.

```bash
# 1. pin the toolchain
mise use node@26.13      # writes mise.toml; then pin the exact patch
# 2. scaffold into a temporary folder with the pinned Node
mise exec -- npm create vite@latest <temp-dir> -- --template vanilla-ts
# 3. move package.json, tsconfig.json, index.html and src/ into the repository root,
#    pin library versions per the table above, then add vitest, @playwright/test,
#    eslint, typescript-eslint and @types/three
# 4. write the Makefile; from then on, use `make setup` and `make dev`
```

### Engine-Provided Architecture

| Component | Solution | Notes |
| --- | --- | --- |
| Rendering | three.js renderer, scene graph, materials, shadows, `InstancedMesh` | Our shared materials and palette own the style. Check instanced-mesh culling in this version (a prototype bug). |
| Post-processing | three.js add-ons | Outlines and grading, if the style uses them. The API depends on the renderer choice. |
| Model loading and animation | `GLTFLoader`, `AnimationMixer` | Skeletal clips from Blender's glTF export. |
| Maths | three.js maths, in rendering only | The simulation keeps its own small vector maths and imports nothing from three.js (CLAUDE.md). |
| Build and dev server | Vite 8 | Static build uploaded to itch.io. |
| Unit tests | Vitest 5 | Runs the simulation in Node. |
| Screenshot and browser tests | Playwright 1.65 | Headless; WebGL renders in software, so no performance numbers from it. |
| Physics | None: a custom tile simulation | By design (CLAUDE.md). |
| Input | None: custom, over the browser's keyboard and Gamepad APIs | |
| Audio | None chosen | Decision below. |
| Scene and session management | None: custom | Decision below. |
| User interface | None | Decision below. |
| Saving | None: browser storage | Decision below. |

### Development Tools (MCP)

| MCP | Use | Status |
| --- | --- | --- |
| Playwright MCP | Drive the game in a real browser: the critic loop, run checks, screenshots | Already available in the Claude Code environment |
| Blender MCP | Clean-up, rigging, animation and glTF export (asset pipeline) | Settled in CLAUDE.md |
| Context7 (`upstash/context7`) | Current documentation for three.js, Vite, Vitest and Playwright, instead of training data | Plugin installed. The developer authorizes it through `/mcp` in an interactive session. |

Not adopted: three.js-specific MCP servers. The official `@modelcontextprotocol/server-threejs` is a visualization app, not a development tool. The community documentation servers are third-party or in beta and overlap with Context7.

### Remaining Architectural Decisions

All of these are resolved in Architectural Decisions (2026-11-13). The list stays as the record of what the engine left to us.

1. **Renderer:** WebGLRenderer, or WebGPURenderer with its WebGL 2 fallback; GLSL or TSL for the shared materials.
2. **Simulation core:** how entities and their data are laid out, the step pipeline and its order, determinism (no wall-clock time, a seeded random generator), and the units in use.
3. **Game loop:** fixed step with an accumulator, the cap on steps per frame, interpolation, and how hit-stop and pause interact with steps.
4. **Session and state flow:** title, level, story moments, results, pause. Who owns which state.
5. **Story director:** story moments owned by the simulation, the safety rule, skip rules, the replay-form rule.
6. **Level data:** the level editor (LDtk or Tiled; open in CLAUDE.md), the format, entities, regions, and validating levels on load.
7. **Jump-possibility verification:** the solver or test approach, driving the real simulation.
8. **Assets:** glTF compression, texture formats, per-asset size budgets within 30 MB, a manifest, loading and progress.
9. **Rendering structure:** layers, the camera rig, palette and lighting per level, the hero's stage swap, enemy recolours, silhouette cards.
10. **Audio:** Web Audio directly or a library, music switching, stingers, ambience beds, the wheel getting louder with distance, unlocking audio on the first input.
11. **User interface:** DOM overlay or drawn on the canvas, for the HUD, menus, results and card text.
12. **Input:** the action-state model, latched taps, device tracking for icons, safe failure inside the itch.io iframe.
13. **Saving:** the storage schema and its versioning, safe failure, what is saved.
14. **Testing:** the layers of unit, solver and screenshot tests, the critic-loop camera spots, determinism checks.
15. **Performance:** draw-call, triangle and texture budgets, and how frame times are measured on real hardware.
16. **Build and release:** the itch.io package (file count, relative paths), and the upload tool.
17. **Debug tools:** an in-game debug view for development builds only (hitboxes, step counter, frame timing).

---

## Architectural Decisions

### Decision Summary

| # | Category | Decision | Version | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Renderer | three.js WebGLRenderer with GLSL shaders. **All shader and material code lives in `render/materials`; nothing else touches GLSL.** | r187 | Settled stack, mature, plenty of examples for agents. A later move to TSL means rewriting one module. |
| 2 | Simulation core | Plain data in one `World`, updated in place by system functions in a fixed order. No ECS. | — | Dozens of entities, not thousands. Easy to read, test and step. |
| 3 | Game loop | Fixed 60 Hz step with an accumulator, clamped frame time, at most 5 steps per frame, interpolated rendering | — | The GDD requires refresh-rate independence. |
| 4 | Determinism | The simulation depends only on its state and input. No clock time, a seeded random generator, its own trigonometry. | — | Unit tests, jump search and input replays need identical results. |
| 5 | Simulation to presentation | Rendering, audio and the interface read a read-only snapshot plus each step's event list | — | Rendering never writes to the simulation (CLAUDE.md). |
| 6 | Gameplay camera | Lives in the simulation, with a fixed logical view of at least 19 × 10.4 tiles | — | "Enemies attack only while on screen" is a gameplay rule. |
| 7 | Session flow | An app-level state machine outside the simulation | — | The simulation knows nothing about menus. |
| 8 | Story director | In-level story moments (seal break, held beat) belong to the simulation; story cards belong to the app | — | Safety rule, skip rules, clear time |
| 9 | Level editor and data | Tiled, with levels compiled at build time into a validated game format | Tiled 1.12.x | Chosen by the developer on 2026-11-13 (open in CLAUDE.md until then). Actively maintained; LDtk's last release was January 2024. |
| 10 | Jump verification | Marked jumps plus a bounded input search on the real simulation, plus static metric checks | — | Precise, fast, and uses the real rules |
| 11 | Input | An action state per step, with latched presses, device tracking and a guarded gamepad | — | GDD input rules; the itch.io iframe |
| 12 | User interface | DOM overlay in plain TypeScript, no framework | — | Crisp text, no dependency |
| 13 | Audio | The Web Audio API directly: a small mixer with buses. No library. | Browser API | The needs are small; no dependency |
| 14 | Saving | Versioned JSON in `localStorage`, with an in-memory fallback | Browser API | The GDD's resilience rule |
| 15 | Assets | `.glb` models compressed with meshopt through `@gltf-transform/cli`; a generated manifest; loading at boot plus per level | gltf-transform: current at Epic 0 | 30 MB total budget |
| 16 | Rendering structure | Perspective camera with a narrow field of view; 4 depth layers; palette and lighting as data per level | — | The 2.5D look, with parallax for free |
| 17 | Build and release | Vite static build with relative paths, size and file-count checks; upload with `butler` through `make release` | butler: current at Epic 6 | itch.io limits |
| 18 | Debug tools | Development-only overlay, URL parameters and input recording; stripped from release builds, except the `?perf=1` frame-time recorder | — | Tuning feel, reproducing bugs, measuring on real hardware |
| 19 | Local development | mise, Makefile, Docker for any service | See Engine & Framework | Developer rule |
| 20 | Testing | Vitest in Node for simulation, levels and app logic; Playwright for smoke checks and screenshots | See Toolchain | CLAUDE.md: every simulation rule is tested |
| 21 | Performance | Frame, draw-call, triangle and memory budgets (†), measured with `?perf=1` on real hardware | — | GDD performance targets |
| 22 | TypeScript in Node | Node runs `scripts/*.ts` natively; relative imports carry `.ts`; `import type` for types; erasable syntax only | Node 26 | No runner dependency (developer choice, 2026-11-13) |

**Dependencies added by these decisions:** `@gltf-transform/cli` (development only) and `@types/node` (types only). The developer approved both on 2026-11-13.

### State Management

**Approach:** three layers, each with one owner.

| Layer | Owner | Holds |
| --- | --- | --- |
| App state | `app/` state machine | The current screen, current level, first play or replay, settings, save data |
| Level state | `sim/` `World` | Everything that affects gameplay within one level, the camera and story moments included |
| Presentation state | `render/`, `audio/`, `ui/` | Visual-only things: interpolation, animation mixers, particles, shake, audio voices, the DOM |

**App state machine:**

- Boot (loading bar) → (Device note, on a phone or tablet; "Try anyway" continues) → Title gate → Title menu → (Intro cards, on a new save) → Level loading (level-line card) → Playing ⇄ Paused → end of level. Epic 3 builds the gate alone, going straight to the intro cards and Emberwood; the title menu comes in Epic 6 (UX F5).
- Level loading shows the level name and its line on every load. It holds for the GDD's reading floor (about 3 s †) and until loading is done, then goes to Playing. On a replay, once loading is done, confirm skips the rest of the floor (UX F10).
- Paused opens Settings or the confirm dialog (Restart level, Quit). Both are app states over Paused: the simulation stays stopped, and Back or Cancel returns to Paused. Settings opened from the title menu returns there. Restart recreates the level and fades straight to Playing, without the loading card. Quit goes to the level select, or to the title menu before the level select unlocks (UX D9). Pausing works during in-level story moments, the death sequence and the pit fade, and the simulation resumes where it stopped (UX M5).
- End of level, Levels 1 and 2: Results → next level loading (first play) or Level select (replay). On a replay where the ninth bell is found, the all-bells card plays after the results.
- End of level, Level 3: closing card → all-bells card, if all 9 bells are found → Results → Title menu (first play; Continue there now opens the level select) or Level select (replay). Replays keep the order; the held beat and the cards can be skipped.
- The level select offers the all-bells card again once all 9 bells are found.
- Auto-pause: a hidden tab, window blur, leaving fullscreen, or the gamepad disconnecting or being turned off after an error sends Playing to Paused, with Resume focused. It never resumes by itself. `platform/visibility.ts` (tab hidden, window blur), `platform/fullscreen.ts` (fullscreen left) and `platform/gamepad.ts` (disconnect, or off after an error) report to `main.ts`, which clears held input and dispatches one auto-pause command. Outside Playing, a trigger only clears held input; on cards and the loading card nothing else is running (UX D14, M5, Q7).
- A failed asset load, at boot or behind the loading card, shows the Retry panel after one silent retry; Retry repeats that load as often as it is pressed (UX Q8). A release-build bug shows the "Something went wrong" panel over Playing, and "Restart level" restarts the level.

**Simulation `World`:** plain TypeScript objects, created by `createWorld(level, params)` and advanced by `step(world, input)`.

- Fields:
  - `params: WorldParams`: `{ levelId, form: 'beast' | 'changed', spawnAt?: { x: number; y: number } | { checkpointId: string }, isStorySkippable: boolean }`. Debug URL parameters and the jump search use `spawnAt`; replays set `isStorySkippable`.
  - `level` (the compiled level, read-only), `step`, `nextId`, `rng`.
  - `player`, `enemies` (a union typed by kind), `warden` (or `null`), `platforms`, `pickups`, `checkpoints`, `regions`, `doors`.
  - Pools: `shots`, `seeds`, `millstones`.
  - `camera`, `story`, `hitStopSteps`.
  - `stats`: `clearSteps`, `respawns`, `hitsTaken`, `embersCollected`, `bellsFound`.
  - `events`: the current step's `SimEvent`s.
- Mutated in place, to avoid garbage-collection pauses at 60 Hz.
- Only `sim/` code mutates it. Everything else receives it as `DeepReadonly<World>`, so the type checker enforces "rendering never writes".
- Every timer is a whole number of steps. `config.ts` converts the GDD's seconds to steps once, by rounding to the nearest step.

**System order per step:**

0. Start of step: clear `events`, and copy each moving body's position into `prevX` and `prevY` (for interpolation).
1. Apply the input frame: presses are written into the player's buffers (the jump buffer, the spit request), so none is lost.
2. Story director: while a story moment is active, it overrides input and advances its timeline.
3. Hit-stop: while it is above 0, count it down and skip steps 4 to 11. The input buffers keep their presses and don't count down during hit-stop (GDD: a press always registers).
4. Platforms move.
5. Player: movement, tile collision, being carried, ledge grab.
6. Enemies.
7. The warden.
8. Shots and seeds: move them, and stop them on tiles.
9. Combat: stomp before contact, damage, knockback, deaths.
10. Pickups, checkpoints, regions, the pit rule, the exit.
11. Camera.
12. Statistics: clear time counts only steps outside story moments.

**Determinism rules:**

- No `Date`, `performance.now` or `Math.random` inside `sim/`.
- One seeded random generator lives in `World`, for things such as where the millstones land.
- `sim/math` provides its own `sin` and `cos`, so Node tests and browsers agree on waterwheel paths and flyer bobbing.
- Test: the same level with the same input stream produces identical state hashes.

**Simulation to presentation:** each step appends typed events; the full `SimEvent` union is in Cross-cutting Concerns (Event System). The loop gathers them per frame and hands them to audio, rendering effects and the interface. The rules:

- Shake is computed in rendering from events, using `CONFIG.feedback`. A new shake raises trauma to its value if that is higher, and never adds (GDD). Reduced motion turns it off.
- Full-screen flashes (`render/fx/flash.ts`, such as the seal-break ember flash staged by `storyStaging.ts`) read `reducedMotion`. With it on, each becomes a short fade. Hit-stop and the 9 Hz blink stay (UX D17).
- The 9 Hz blink is derived from the invulnerability timer and the step count.
- **Presentation settings:** `main.ts` passes rendering, audio and the interface one read-only `PresentationSettings` snapshot per frame: `reducedMotion`, `musicVolume`, `effectsVolume`, `isMuted`, `lastDevice`, plus the feature status that the notices and the fullscreen toggle show: `isAudioLocked`, `isFullscreen`, and the optional features turned off for the session (storage, gamepad, fullscreen). No presentation layer reads settings, devices or feature status any other way.

### Game Loop

```text
frame(now):
  dt = clamp((now - last) / 1000, 0, 0.25); last = now   # clamp ≥ 0 (prototype bug)
  if app is Playing: acc += dt
  steps = 0
  while acc >= STEP and steps < 5:
      sim.step(world, input.consumeStep())   # latched presses delivered once
      collect(world.events); acc -= STEP; steps += 1
  if steps == 5: acc = min(acc, STEP)       # drop the backlog instead of spiralling
  alpha = acc / STEP
  render(world, alpha); audio.update(events); ui.update(world, app)
```

- `STEP` is 1/60 s.
- Pausing stops the simulation steps; rendering and the interface keep running.
- Hit-stop happens inside the simulation, so it stays deterministic.

### Gameplay Camera

- The camera's position, look-ahead, vertical dead zone, re-centring and clamping are simulation state, following the GDD's camera rules.
- **The logical view** is a box at least 19 × 10.4 tiles, centred on the simulation camera. It defines "on screen" for the attack rule and the spitter's range.
- The renderer frames at least that box at any aspect ratio. Extra width on wide screens is visual only, so behaviour doesn't change with window size.

### Story Director

- **In the simulation:** `story` is `none`, `sealBreak` or `heldBeat`, with a start step.
  - **Triggers:** the warden reaching 0 HP starts `sealBreak`; Rowan touching Level 3's exit starts `heldBeat`.
  - **While active:**
    - Player input is ignored, except the skip action (jump or confirm) when `params.isStorySkippable` is set (replays).
    - Rowan can't be hurt.
    - At the start, enemy shots, seeds and attacks in progress are removed.
  - **Timelines** are data in `CONFIG.story`, in steps: a total length plus named cues.
  - **Cues apply during the timeline.** The seal break's `rowanChange` cue makes Rowan stage 2 with ledge grab. Each cue emits `storyCueReached`, so audio can cut the music and play the stinger.
  - **The end:** `endStory` applies any cue not yet reached (when skipped), emits `storyEnded`, then `levelCompleted`.
- **In rendering:** it reads `story`, the step count and the cue steps in `CONFIG.story` to stage the camera, effects and model swap. The cue values come from the narrative document's timings; rendering keeps no timings of its own.
- **In the app:** story cards (intro, level-line, closing, all-bells) are app states. A separate card scene renders the silhouettes of the intro, closing and all-bells cards, with the text in the DOM overlay. The level-line card has no silhouettes: the level name and its line sit on the opaque screen ground (UX `loading-card`).
- **Replay-form rule:** a fixed table in `config.ts` (`levelForm`: Levels 1 and 2 beast, Level 3 changed) sets Rowan's stage and abilities when a level is created. It matches the GDD rule without storing anything.

### Data Persistence

**Save system:** versioned JSON in `localStorage`, under one key (`emberbound.save`).

```text
{ version,
  progress: { unlockedLevel, introSeen,
              levels: { [levelId]: { bestClearSteps, bellsFound: bellId[] } } },
  settings: { musicVolume, effectsVolume, reducedMotion } }
```

- Written at the end of each level and when a setting changes. Read at boot, then validated and migrated by `version`.
- Bells found are a union across replays (GDD).
- Whether the all-bells card is unlocked is derived from the bells found (all 9), not stored.
- Any storage error switches to an in-memory store for the session. The game keeps running (GDD resilience rule).
- Storage inside itch.io's cross-origin iframe may be partitioned or blocked. Verify on a private itch.io upload by Epic 6.

### Level Data

- **Editor:** Tiled 1.12.x. Levels are authored as Tiled JSON (`.tmj`, with `.tsj` tilesets) under `levels/`.
- **Tiled layers, by convention:**

| Layer | Type | Holds |
| --- | --- | --- |
| `collision` | Tile layer | Collision only, from the tileset class: empty, solid, one-way, spike. Art never defines collision (CLAUDE.md). |
| `entities` | Object layer | `PlayerStart`, enemies, the `Warden`, pickups, embers, bells, checkpoints, the exit, moving and waterwheel platforms, `ControlSign`s; each a typed Tiled class |
| `regions` | Object layer | Typed rectangles: `KillZone` (a pit or deep water, which triggers the pit rule; falling below the level's bottom edge counts too), `ArenaTrigger` (wakes the warden), `Door` (tiles the simulation makes solid when the arena is entered), `MusicFade` (Level 3), `AudioAnchor` (the great wheel) |
| `dressing` | Object layer | Kit props and story props by kit id: the glade, the sacks, the fallen bell |
| `jumps` | Object layer | Marked jumps: from-point, to-area, tier (standard or challenge), required ability |

- **Compile step** (`make levels`, also run by `make build` and `make test`): a Node TypeScript script turns each `.tmj` into `assets/levels/<id>.json` in the game's own format. It also validates each level:
  - 3 checkpoints and 3 bells, plus 1 checkpoint at the warden's door in a warden level
  - exactly one `PlayerStart`, and either an exit or a warden
  - checkpoints on safe ground, with no enemy within 8 tiles †
  - challenge-tier jumps within the level's cap
  - typed entity fields
- **Kit pieces:** ground and ledge pieces are picked automatically from the collision grid at compile time, by neighbour rules. Props are placed by hand in `dressing`.
- **Test levels:** `levels/test-*.tmj`, such as `test-ledge-grab.tmj` and Epic 4's standalone `test-warden-arena.tmj`, compile like the others but are left out of the release build and the level select. Epic 5 joins the arena to `drowned-mill.tmj`.
- **Tiled itself** is a desktop app. It's pinned in `mise.toml` if a mise backend can install it (checked in Epic 1). If not, the required version is recorded and `make setup` checks `tiled --version`.

### Jump Verification

- **Marked-jump search:** for each object in `jumps`, a Vitest test loads the compiled level, puts Rowan at the from-point with the level's form and abilities, and runs the **real simulation** over a bounded set of input patterns:
  - run-up steps
  - which step the jump is pressed on
  - how long jump is held
  - air steering
  - waiting steps, to pick a moving platform's phase
  - ledge-grab climbs in Level 3

  The jump passes if Rowan stands in the to-area, unhurt, within a step limit.
- **Static checks:** gap widths, step heights, the clear space above take-offs, and the spacing of one-way ledges against the GDD's metrics table, read from `config.ts`.
- **Coverage check:** the compile step lists the main path: the ground segments from `PlayerStart` to the exit or warden, through every checkpoint. Every break, or rise of more than 1 tile, between consecutive segments must have a jump mark.
- These run in Node through `make test`; they need no rendering.

### Asset Management

**Loading strategy:** shared assets load at boot; each level's assets load behind its level-line card.

- **Models:** `.glb` exported from Blender, then compressed (meshopt) and quantized with `@gltf-transform/cli`, a development-only dependency. The loader uses three.js's `MeshoptDecoder`.
- **Model conventions:** 1 unit = 1 tile; +Y up; characters' origin at the feet (bottom centre), facing +X (screen right); kit pieces' origin at the bottom-left of their tile cell. `optimizeModels.ts` checks scale and origin and rejects a model that breaks them.
- **Generated materials are stripped on load** and replaced by `render/materials` factories (the renderer owns the style).
- **Textures:** few. The look comes from flat palette regions and simple masks: PNG or WebP. KTX2 only if the budget needs it.
- **Audio formats:** chosen in Epic 3 with the audio tool. Constraint: they must loop without gaps through Web Audio in Chrome, Edge and Firefox.
- **Manifest:** `assets/manifest.json` is generated at build time, with a shared bundle plus one bundle per level.
- **Changing levels** disposes the previous level's geometries, materials and textures.

**Budgets (†, enforced by `make build`):**

| Item | Budget |
| --- | --- |
| Hero, both stages | 2 MB |
| Each enemy | 0.6 MB |
| The warden | 2 MB |
| Each level kit with its backdrops | 3.5 MB |
| Story cards, all together | 1 MB |
| Pickups and markers, all 6 | 0.5 MB |
| Music and ambience | 8.5 MB |
| Sound effects | 2 MB |
| Code, gzipped | 1 MB |
| Fonts | 0.3 MB |
| **Total** | **30 MB or less** (about 29.6 MB planned) |

### Rendering Structure

- **Camera:** a perspective camera with a narrow field of view (about 30° †), framing the play plane (z = 0) so the logical view fits at any aspect ratio. It is interpolated from the simulation camera. Depth layers get parallax for free. If the style locked in Epic 0 calls for it, this may switch to an orthographic camera with hand-made parallax.
- **Layers by depth:** far distance, middle distance, the play layer (z = 0: the kit, characters, pickups, effects), and the foreground, which never covers the play area (GDD).
- **`render/materials`** is the only module that contains GLSL, uses `ShaderMaterial` or `onBeforeCompile`, or defines post-processing passes.
  - Its exports are factories for ground, foliage, character, prop, effect, backdrop and card-silhouette materials, plus the outline and grading passes if the style uses them.
  - Every other module asks it for materials.
- **The palette module:** a palette per level as data, with named slots (ground, foliage, hazard, warm, and so on). Assets carry slot indices; enemy recolours are palette swaps.
- **The lighting rig:** per level, as data: key, fill, fog, and where warm light is allowed.
- **The hero:** one skinned mesh with named parts (the horns, the right claw and hand). Stage 2 toggles parts on the same rig and animations.
- **Instancing and shadows:**
  - Repeated kit pieces use `InstancedMesh`, with bounding volumes computed so culling works (a prototype bug).
  - One directional shadow, snapped to texel steps (a prototype lesson), or blob shadows if performance needs them. Decided in Epic 0.
- **The card scene:** a separate scene with an orthographic camera and flat layered silhouette planes, using palette and light data per card. The text is in the DOM overlay.
- **The look-dev page:** a second Vite entry (`lookdev.html`), development only and left out of the production build.

### Input

- `input/` turns keyboard events and polled gamepads into one action state. **The simulation receives one `InputFrame` per step:** `moveX` (-1, 0 or 1), `up`, `down`, `jumpPressed`, `jumpHeld`, `spitPressed` and `spitHeld`.
- A press is latched until the next step consumes it, so a tap shorter than one step is never lost (GDD).
- Stick thresholds: 0.35 sideways and 0.5 up and down (GDD).
- **Gamepad reads are wrapped in try/catch.** The first error turns the gamepad off for the session, logs once, and the keyboard keeps working. This is the prototype bug inside an embedded iframe.
- The last-used device (keyboard or gamepad) goes into the `PresentationSettings` snapshot, which picks the icons on the control signs and the card advance hint. A key press or a click sets keyboard; a gamepad button, or a stick past the play thresholds above, sets gamepad (UX).
- **App-level actions** (pause, mute, and menu up, down, left, right, confirm and back) go to the app, never to the simulation. Menus can be navigated with a gamepad.
  - Esc pauses during play; in menus and on cards it means Back. Back on the pause menu resumes; on the title menu it does nothing (UX).
  - **Hold-to-repeat:** a held menu direction, on lists and sliders, repeats after 0.4 s at 8 steps per second (UX). The values live in `core/uiTimings.ts`, which every layer may import (UX DN-2).
  - **Card guard:** menu actions are presses, never held state. When a card appears, presses latched before it are dropped, so only a press that began on the card counts. The app ignores all card input, Back included, before the GDD's card minimum (about 1.5 s †, in `core/uiTimings.ts`) (UX).
- **Bound keys call `preventDefault`** while the game has focus, so Space and the arrows never scroll the itch.io page (UX; verify on the Epic 6 upload).
- **Auto-pause clears held input:** every auto-pause trigger (State Management) releases held keys and directions, so Rowan stops (UX D14).
- Input frames can be recorded and replayed. The same path feeds the jump search and the development replay tool.

### User Interface

- **The DOM overlay** sits above the canvas: plain TypeScript modules, one per screen, plus CSS.
  - Screens: boot loading, HUD, title (the "Click or press any key" gate, then the menu), loading card, level select, results, settings, pause, card text, the error panels (bug; retry, for boot and level loads), and the note for phone and tablet visitors.
  - Shared components, one file each in `ui/components/`: menu item, panel, scrim, slider, toggle, notice line, confirm dialog. Screens are built from them (UX M8).
  - `ui/overlay.ts` is the root. It stacks the layers in DESIGN.md's order (Elevation & Depth), owns the mute indicator, which sits above every scrim including the error panel's (UX M6), and sets `--tile`.
- **`--tile`** is the on-screen size of one world tile. `ui/overlay.ts` sets it on the overlay root on resize, from the logical view's size in `sim/config.ts` and DESIGN.md's formula. CSS never hard-codes it, and every overlay size is a multiple of it (UX M3). If Epic 0's camera frames a margin around the logical view, the value must include that margin, since `ui/` cannot import `render/`. The DESIGN.md tokens become CSS custom properties named `--{group}-{name}`.
- **UI timings** (fades, holds, the results stagger, menu repeat, and the GDD's card minimum and loading-card reading floor) live in one module, `core/uiTimings.ts`, so `input/`, `app/` and `ui/` all read the same values, in seconds (`…Seconds`), never frames. Every value is provisional † and tuned in the epic that builds its surface (UX M2).
- **Mouse:** menus only, never required. Hover moves focus and a click confirms. The cursor hides when play starts and shows when a menu opens (UX D13).
- **The interface reads** the app state and `DeepReadonly<World>` each frame and only touches the DOM when a value changes. It sends commands to the app (start, select level, change setting) and never to the simulation.
- **Story text** comes from one typed module keyed by moment (narrative design), never hard-coded in screens.
- **Fonts are self-hosted:** no runtime requests to third parties.
- **Interface sounds** (menu move, confirm, back, pause) play through a `playUiSound` callback that `main.ts` passes in, so `ui/` never imports `audio/`.
- **Control signs are scenery,** not interface: carved waymarkers drawn by `render/level/controlSigns.ts`, with icons from `public/assets/icons/`.

### Audio

- **The Web Audio API directly**, with an `AudioContext` created or resumed on the first key press or click, normally at the title gate (browser autoplay rules). Gamepad presses are not user activation, so a gate passed with a gamepad leaves audio locked: the game runs silently, and the title menu shows the audio notice until the first key press or click (UX A1; verify on the Epic 6 upload).
- **Buses:** master, then music, effects and ambience. The settings volumes map to the bus gains, and M toggles the master mute.
- **Music:**
  - one looping buffer per level
  - the warden arrangement crossfades in on the `wardenPhaseChanged` event
  - stingers play once
  - at the seal break, the music cuts and the stinger plays on `storyCueReached`
  - in Level 3, the music fades out on the `regionEntered` event for the `MusicFade` region
- **Ambience:** one looping bed per level. The great wheel's loop gain follows Rowan's distance from the arena anchor, read from the snapshot.
- **Failure:** if creating or resuming the `AudioContext` throws or is rejected, audio stays off for the session and the game runs, with no notice (UX Q7). A context still waiting for a key press or click is locked, not failed.

### Build and Release

- `vite build` with `base: './'`, so every URL is relative, as itch.io's HTML5 hosting needs. The look-dev entry is excluded.
- **`make build` runs:**
  1. the level compile and validation
  2. type checking
  3. the tests
  4. the Vite build
  5. the manifest (`scripts/buildManifest.ts`)
  6. the budget checks: total size 30 MB or less, 1,000 files or fewer, the per-asset budgets
- **`make release`** uploads `dist/` to itch.io with `butler`, pinned in `mise.toml` in Epic 6. Before the public release, a private itch.io upload checks the iframe behaviour: gamepad, storage, audio, fullscreen, plus the UX's browser checks: audio unlock after a gamepad-passed gate, fullscreen refused from a gamepad, the Esc that leaves browser fullscreen, iframe focus, page scrolling, and the 1280 × 720 embed with itch.io's fullscreen button (UX A1-A3, Q9).

### Debug Tools (development builds only)

- These sit behind `import.meta.env.DEV` and are stripped from release builds. The one exception is the `?perf=1` frame-time recorder (Cross-cutting Concerns).
- **An overlay**, toggled with F1:
  - hitboxes, the collision grid and the logical-view box
  - the step counter, the player's state, the story state
  - frame-time graph and percentiles
- **URL parameters:** `?level=drowned-mill&checkpoint=cp-2&form=changed`, to start at any spot (they set `params.spawnAt`).
- **Input recording to a file, and replay from it,** to reproduce bugs.

### Testing Strategy

| Layer | Tool | Location | Runs in | Covers |
| --- | --- | --- | --- | --- |
| Simulation rules | Vitest | `src/sim/**/*.test.ts`, beside the code | Node | Every simulation rule (CLAUDE.md), the story-moment safety rule, the feel regression test |
| Determinism | Vitest | `src/sim/determinism.test.ts` | Node | A recorded input stream run twice on each level gives identical state hashes |
| Levels | Vitest | `tests/levels/` | Node | Compile validation, the marked-jump search, coverage, static metric checks |
| App and input logic | Vitest | `src/app/*.test.ts`, `src/input/*.test.ts` | Node | Save validation and migration, the app state machine (the UX states, the confirm dialog and auto-pause included), the reduced-motion default, and input latching, hold-to-repeat and the card guard, with synthetic events |
| Browser smoke checks | Playwright | `tests/e2e/smoke.spec.ts` | Headless Chromium and Firefox | Boot, the title gate, title, level, pause and the restart confirm; no console errors; a gamepad error doesn't stop the frame loop; refused storage falls back |
| Screenshots | Playwright | `tests/e2e/shots.spec.ts` | Headless Chromium, against the dev server | The critic loop's spots |
| Performance | `?perf=1` | Release build | Real hardware | The GDD's frame-time pass marks; level load times |
| First load | Browser developer tools | Release build | Real hardware, network throttled to 50 Mbit/s | First input within 10 s (GDD) |

- No DOM test environment is added (no jsdom): interface screens are checked through Playwright.
- `make test` runs the Node layers. `make smoke` and `make shots` run Playwright. `make check` runs lint, the format check, the type check and `make test`.

### Performance Budget

Starting budgets (†), checked on Epic 0's test scene and in Epic 6's performance pass, and tuned with the developer.

| Item | Budget |
| --- | --- |
| Frame time (release build, Iris Xe-class laptop, 1080p) | Median 16.7 ms or less, 99th percentile 20 ms or less (GDD) |
| One simulation step | 1 ms or less † |
| Draw calls per frame | 150 or fewer † |
| Triangles on screen | 250,000 or fewer † |
| GPU texture memory | 256 MB or less † |
| Shadow maps | One, 2048 × 2048 at most † |
| Post-processing passes | 2 at most: outline and grading † |
| Pixel ratio | Capped at 1.5 †; dropped to 1.0 if the pass needs it |
| Garbage | No allocation per simulation step (pools), and none per frame in hot render paths |

**Measurement:** `?perf=1` for frame times and load times. The debug overlay shows draw calls and triangles from three.js's renderer statistics. Browser profilers for spikes.

### Architecture Decision Records

**ADR-1: WebGLRenderer, with all shaders in one module.**

- **Context:** three.js is moving to WebGPURenderer and TSL, but WebGL is settled and mature.
- **Decision:** WebGLRenderer with GLSL. `render/materials` is the only place that contains shader or material code.
- **Consequence:** a later move to TSL rewrites one module, not the game.

**ADR-2: The simulation owns the gameplay camera.**

- **Context:** "enemies attack only while on screen" makes the camera part of the gameplay. A camera that lived in rendering would make outcomes depend on window size and on render timing.
- **Decision:** the camera is simulation state, with a fixed logical view.
- **Consequence:** deterministic and testable. Wide screens show extra backdrop only.

**ADR-3: Tiled, compiled into the game's own format.**

- **Context:** the editor was open. LDtk hasn't had a release since January 2024.
- **Decision:** Tiled. A compile step validates levels and writes the game's format.
- **Consequence:** the game and the tests never depend on Tiled's format, and the editor could be swapped by rewriting the compiler.

**ADR-4: Marked jumps with an input search.**

- **Context:** the GDD requires proof that every jump is possible.
- **Decision:** designers mark the jumps; tests search a bounded set of inputs on the real simulation.
- **Consequence:** marks are part of making a level, and the coverage check catches gaps nobody marked.

**ADR-5: A read-only snapshot and events.**

- **Context:** rendering must never write to the simulation.
- **Decision:** presentation code gets `DeepReadonly<World>` plus an event list per step.
- **Consequence:** the type checker enforces the rule. Audio and effects are driven by events.

**ADR-6: Story moments belong to the simulation.**

- **Context:** the safety rule, the skip rules and clear time all depend on story moments.
- **Decision:** the seal break and the held beat are simulation state; cards are app state.
- **Consequence:** story timing is deterministic and testable. The rule "Rowan can't be hurt during story moments" has a unit test.

**ADR-7: No audio or interface framework.**

- **Context:** the needs are small, and CLAUDE.md asks for care with every dependency.
- **Decision:** the Web Audio API and a DOM overlay in plain TypeScript.
- **Consequence:** more code of our own, but no third-party update churn.

---

## Cross-cutting Concerns

These patterns apply to every system. Every implementation follows them, and ESLint enforces the ones it can (see Implementation Patterns).

### Error Handling

**Strategy:** three classes of failure, each handled exactly one way.

| Class | Examples | Handling |
| --- | --- | --- |
| **Bug:** an invariant is broken | Rowan's position becomes NaN; an entity id is unknown | `invariant()` throws. **Development:** fail loudly, with the error in the debug overlay. **Release:** the frame loop catches it, logs it, and shows a small "Something went wrong" panel with "Restart level". The loop keeps running. |
| **Optional feature unavailable** | Gamepad refused inside the itch.io iframe; storage blocked; audio can't start; fullscreen denied | Wrapped at the feature's edge in `platform/`. The first failure turns the feature off for the session and logs one warning. The game continues (GDD resilience rule). A request refused only for lack of user activation (a fullscreen toggle or audio unlock from a gamepad, UX A1) is not a failure: the feature stays available and the next key press or click can retry. |
| **Expected failure** | An asset fetch fails; a saved game is corrupt or old | Return `Result<T, E>`. The caller decides: retry an asset once, then show a Retry panel; fall back to a fresh save. Never throw for these. |

- Level rules are validated at build time. At runtime, `parseLevel` checks only the file's shape and version; a failure there is an expected failure (`Result`).
- **The simulation contains no `try`/`catch`.** It only asserts invariants.
- **Players never see stack traces or technical text.**

**Example:**

```typescript
// core/result.ts
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

// core/invariant.ts
export function invariant(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`Invariant failed: ${msg}`);
}

// platform/gamepad.ts: every optional browser feature is wrapped like this
let isGamepadEnabled = true;
export function readGamepads(): readonly Gamepad[] {
  if (!isGamepadEnabled) return [];
  try {
    return navigator.getGamepads().filter((g): g is Gamepad => g !== null);
  } catch (err) {
    isGamepadEnabled = false; // off for the session; the keyboard still works
    log.warnOnce('input', 'gamepad-off', 'Gamepad access refused; keyboard only', err);
    return [];
  }
}

// app/save.ts: an expected failure returns a Result
const loaded = loadSave(store);
const save = loaded.ok ? loaded.value : freshSave();
if (!loaded.ok) log.warn('save', `Starting a fresh save: ${loaded.error}`);

// main.ts: the frame loop never dies in release builds
function frame(now: number): void {
  requestAnimationFrame(frame); // scheduled first, so one bad frame can't stop the loop
  try {
    runFrame(now);
  } catch (err) {
    if (import.meta.env.DEV) throw err;
    log.error('loop', 'Frame failed', err);
    app.dispatch({ type: 'showLevelError' }); // "Something went wrong", then Restart level
  }
}
```

### Logging

**Format:** `[channel] message`, plus an optional data object, written to the browser console.

**Destination:** the console only. There is no remote logging or telemetry. If release-success measurement is ever added (an open GDD question), it is a separate, consented feature.

**Log levels:**

| Level | Use | Release build |
| --- | --- | --- |
| `error` | A bug caught by the frame loop | Yes |
| `warn` | A feature turned off, a fallback taken, a retry | Yes |
| `info` | Milestones: boot, level loaded, save written | No |
| `debug` | Detail while diagnosing | No |

**Rules:**

- Channels are a fixed union: `loop`, `app`, `sim-host`, `render`, `audio`, `input`, `save`, `assets` and `ui`.
- `warnOnce` stops a repeated failure from flooding the console.
- **No logging inside `sim/`,** where ESLint bans `console`. The simulation reports through events and the debug overlay.
- **No logging inside per-frame or per-step paths,** except behind a development flag.

**Example:**

```typescript
// core/log.ts
log.info('assets', 'Level loaded', { level: 'emberwood', ms: 812 });
log.warnOnce('audio', 'audio-off', 'Audio could not start; continuing without sound');
log.error('loop', 'Frame failed', err);
```

### Configuration

**Approach:** typed TypeScript modules declared `as const` (read-only to the type checker; nothing is frozen at runtime). No runtime config files and no remote config.

**Configuration structure:**

| Kind | Where | Rule |
| --- | --- | --- |
| Gameplay numbers | `sim/config.ts`, **the only place** (CLAUDE.md) | Written in GDD units (tiles, seconds), so it reads like the GDD. Step counts are derived once with `steps()`. Every † number has a comment naming the epic that tunes it. Tests import these values and never repeat literal numbers. |
| Fixed per-level tables | `sim/config.ts` | For example `levelForm` (the replay-form rule), the challenge-jump caps, and story timelines in steps |
| Look data | `render/palettes/`, `render/lighting/` | Palette and lighting rig per level, as data. `render/materials` consumes them. |
| Audio mix | `audio/mix.ts` | Bus levels, crossfade times, the wheel's distance curve |
| UI timings | `core/uiTimings.ts` | Every overlay fade, hold, stagger and menu-repeat time, plus the GDD's card minimum and loading-card reading floor (†), in seconds (`…Seconds`), never frames. Provisional †, each tuned in the epic that builds its surface (UX M2). In `core/` so `input/`, `app/` and `ui/` all import it (UX DN-2). |
| Story text | `content/storyText.ts` | Every on-screen story line, keyed by moment (narrative design) |
| Player settings | `app/settings.ts`, stored in the save | Music volume, effects volume, reduced motion. Defaults live here. A new save takes `reducedMotion` from the browser's `prefers-reduced-motion`, read by `platform/device.ts` and passed in (UX Q5). The settings screen's fullscreen toggle and the M mute are never saved. |
| Build constants | Vite's `import.meta.env` | `DEV` gates the debug tools. No secrets, ever (CLAUDE.md). |

**Example:**

```typescript
// sim/config.ts
export const STEP_HZ = 60;
const steps = (seconds: number): number => Math.round(seconds * STEP_HZ);

export const CONFIG = {
  movement: {
    gravity: 40,                    // tiles/s², proven
    fallGravityMul: 1.35,
    apexGravityMul: 0.55,
    apexSpeedBand: 2.2,             // tiles/s
    jumpSpeed: 16.5,
    jumpCutMul: 0.45,
    coyoteSteps: steps(0.10),       // 6
    jumpBufferSteps: steps(0.12),   // 7
    crouchHurtboxHeight: 0.6,       // † tune in Epic 1
  },
  feedback: {                       // hit feedback (GDD table); rendering and audio read these too
    hitStopSteps: { stomp: steps(0.05), rowanHurt: steps(0.06) },   // 3, 4
    trauma: { stomp: 0.2, shotKill: 0.12, rowanHurt: 0.35, rowanDied: 0.4 },
    traumaDecayPerSecond: 1.6,
    shakeMaxTiles: 2,               // offset = shakeMaxTiles × trauma²
    blinkHz: 9,
    landingSoundMinSpeed: 9,        // tiles/s
    spitClipSteps: steps(0.2),      // † tune in Epic 2
    landClipSteps: steps(0.15),     // † tune in Epic 2
  },
  levelForm: { emberwood: 'beast', 'drowned-mill': 'beast', harrowmere: 'changed' }, // level id = file name
} as const;
```

**A regression test for feel:** a unit test derives the full jump's height (3.30 tiles), the tap jump (about 0.8) and the air time (about 52 steps) from `CONFIG`, using the real controller, and fails if they drift.

### Event System

**Pattern:** two typed, synchronous channels. No global event bus and no string event names outside these unions.

| Channel | Direction | Shape | Naming |
| --- | --- | --- | --- |
| Simulation events | `sim/` out to `render/`, `audio/` and `ui/` | `SimEvent`, a union keyed by `type`, appended to `world.events` during a step and collected per frame | Past tense, camelCase: `enemyKilled`, `rowanHurt`, `checkpointReached` |
| App commands | `ui/` and `input/` in to `app/` | `AppCommand`, a union keyed by `type`, handled by `app.dispatch(cmd)` | Imperative, camelCase: `startLevel`, `changeSetting`, `togglePause` |

**Rules:**

- Events are plain data. They carry ids, kinds and positions, never object references or functions, so they can be recorded and replayed.
- Only `sim/` creates `SimEvent`s, and presentation code never sends anything back.
- Handlers are exhaustive `switch` statements, and TypeScript checks that every type is handled.

**Example:**

```typescript
// sim/events.ts: the full union; every name is past tense
export type SimEvent =
  // Rowan
  | { type: 'rowanJumped' }
  | { type: 'rowanLanded'; impactSpeed: number }           // sound only above CONFIG.feedback.landingSoundMinSpeed
  | { type: 'shotFired'; x: number; y: number; dirX: number; dirY: number }
  | { type: 'rowanStomped'; enemyId: number }
  | { type: 'rowanHurt'; source: 'enemy' | 'enemyShot' | 'spikes' | 'warden' }
  | { type: 'rowanFellInPit' }
  | { type: 'rowanDied' }
  | { type: 'rowanRespawned'; checkpointId: string }
  | { type: 'ledgeGrabbed' }
  | { type: 'ledgeClimbed' }
  // enemies
  | { type: 'enemyHit'; enemyId: number }                    // survived: flash
  | { type: 'enemyKilled'; enemyId: number; kind: EnemyKind; by: 'shot' | 'stomp' }
  | { type: 'spitterSwelled'; enemyId: number }
  | { type: 'seedFired'; enemyId: number }
  // pickups and progress
  | { type: 'emberCollected'; total: number }
  | { type: 'heartRestored' }
  | { type: 'bellFound'; bellId: string }
  | { type: 'weaponCollected'; weapon: 'tripleShot' | 'piercingShot' }
  | { type: 'weaponRunningOut' }                             // 3 s left
  | { type: 'weaponExpired' }
  | { type: 'checkpointReached'; checkpointId: string }
  | { type: 'regionEntered'; regionId: string; kind: RegionKind }
  // the warden
  | { type: 'arenaEntered' }                                 // door shut, warden awake
  | { type: 'wardenWarned'; attack: WardenAttack }
  | { type: 'wardenAttacked'; attack: WardenAttack }
  | { type: 'wardenHit' }
  | { type: 'wardenPhaseChanged'; phase: 2 }
  | { type: 'wardenDefeated' }
  // story and level
  | { type: 'storyStarted'; moment: StoryMoment }
  | { type: 'storyCueReached'; moment: StoryMoment; cue: string }
  | { type: 'storyEnded'; moment: StoryMoment }
  | { type: 'levelCompleted' };

// inside the simulation (the only producer)
world.events.push({ type: 'enemyKilled', enemyId: e.id, kind: e.kind, by: 'stomp' });

// presentation (consumers only)
for (const ev of frameEvents) {
  switch (ev.type) {
    case 'enemyKilled':
      fx.burst(ev.enemyId); sfx.play('enemyDeath');
      shake.raise(ev.by === 'stomp' ? CONFIG.feedback.trauma.stomp : CONFIG.feedback.trauma.shotKill);
      break;
    case 'rowanHurt': sfx.play('hurt'); shake.raise(CONFIG.feedback.trauma.rowanHurt); break;
    // …every type handled; TypeScript checks the switch is exhaustive
  }
}
```

### Debug Tools

**Available tools:**

| Tool | Builds | Purpose |
| --- | --- | --- |
| Debug overlay (F1) | Development | Hitboxes, the collision grid, the logical-view box, step counter, player and story state, frame-time graph |
| URL parameters `?level=…&checkpoint=…&form=…` | Development | Start at any spot |
| Cheats: invulnerable, set hearts, grant ledge grab | Development | Testing. They call `sim/debugCommands.ts`, so only `sim/` mutates the `World`. |
| Input recording and replay (file) | Development | Reproduce bugs exactly; the jump search uses the same path |
| `window.__emberbound` handle: `isReady()`, `getState()`, `gotoSpot(id)`, `pause()`, `stepFrames(n)` | Development | Lets the Playwright MCP and the screenshot harness, which runs against the dev server, drive and inspect the game |
| **Screenshot mode** `?shot=<spotId>` | Development | Deterministic captures for the critic loop: the simulation set to a stored spot, animations frozen at a fixed time, particles seeded. Spots are listed in `src/debug/spots.ts`. |
| **Frame-time recorder** `?perf=1` | **All builds, release included** | Records frame times and level load times over a run and shows the median and 99th percentile. `app/perf.ts` records; `ui/screens/perfReport.ts` shows the result. The GDD's performance pass must measure the real build on real hardware. |

**Activation:**

- Development tools sit behind `import.meta.env.DEV`, and the bundler removes them from release builds.
- The screenshot harness runs against the dev server (Playwright's `webServer`), so it needs no special build.
- Only `?perf=1` exists in the release build. It is tiny, and it changes nothing about play.

---

## Project Structure

### Organization Pattern

**Pattern:** domain layers with enforced import boundaries. Within the simulation, files are grouped by gameplay feature.

**Rationale:**

- The most important rules in this project are boundaries: the simulation is pure, rendering never writes, and shaders live only in `render/materials`. A layer layout makes each boundary a folder, which tools can check.
- Grouping the simulation by feature keeps each rule next to its test.
- The developer approved this structure on 2026-11-13 (CLAUDE.md asks before folder-structure changes).

### Directory Structure

```text
emberbound/
├── .claude/                    Claude Code skills and settings (BMad)
├── _bmad/                      BMad install, managed by its installer
├── _bmad-output/               BMad planning and implementation artifacts
├── art-src/                    Source art, all in Git LFS; the game never loads these
│   ├── reference/              Generated reference images and concepts (AI-generated, logged in docs/ASSETS.md)
│   ├── hero/                   rowan.blend, Tripo meshes, reference views
│   ├── enemies/                walker.blend, thorn-flyer.blend, rooted-spitter.blend
│   ├── warden/                 drowned-miller.blend
│   ├── kits/                   emberwood.blend, drowned-mill.blend, harrowmere.blend
│   ├── cards/                  Sources for the silhouette cards
│   └── audio/                  Project files and masters for music and effects
├── docs/
│   ├── PROJECT_BRIEF.md
│   ├── STYLE_GUIDE.md          Written in Epic 0
│   └── ASSETS.md               Every asset, tool, licence and AI flag
├── levels/                     Tiled sources (authored)
│   ├── emberbound.tiled-project   Custom classes: entities, regions, jumps
│   ├── tilesets/collision.tsj
│   ├── emberwood.tmj
│   ├── drowned-mill.tmj
│   ├── harrowmere.tmj
│   └── test-*.tmj              Test levels (ledge-grab room, Epic 4's standalone arena); never shipped
├── prototype/sprout-demo.html  Reference only; never built
├── public/
│   └── assets/                 Shipped runtime assets, copied into the build as they are
│       ├── models/             hero-rowan.glb, enemy-walker.glb, enemy-thorn-flyer.glb,
│       │                       enemy-rooted-spitter.glb, warden-drowned-miller.glb,
│       │                       pickup-ember.glb, pickup-bell.glb, pickup-triple-shot.glb,
│       │                       pickup-piercing-shot.glb, marker-checkpoint.glb, marker-exit.glb
│       ├── kits/               kit-emberwood.glb, kit-drowned-mill.glb, kit-harrowmere.glb
│       ├── backdrops/          One folder per level
│       ├── cards/              Silhouette shape layers
│       ├── icons/              Control-sign icons for keyboard and gamepad
│       ├── fonts/
│       ├── audio/              music/, ambience/, sfx/
│       ├── levels/             GENERATED by `make levels` (git-ignored)
│       └── manifest.json       GENERATED at build time (git-ignored)
├── scripts/                    Node TypeScript tools, run through the Makefile
│   ├── compileLevels.ts        Tiled to the game's level JSON, with validation
│   ├── optimizeModels.ts       gltf-transform: meshopt and quantization of Blender exports
│   ├── buildManifest.ts
│   └── checkBudgets.ts         Total size, file count, per-asset budgets
├── shots/                      Critic-loop captures, one folder per round (git-ignored)
├── src/                        See Source Structure below
├── tests/
│   ├── levels/                 Jump search, coverage and level-rule tests (Vitest, in Node)
│   └── e2e/                    Playwright specs: the screenshot harness, smoke checks
├── index.html                  Game entry
├── lookdev.html                Look-dev entry (development only)
├── mise.toml                   Tool versions: Node, git-lfs, later butler, possibly Tiled
├── Makefile                    The single entry point
├── package.json
├── package-lock.json
├── tsconfig.json               Strict; references src/sim/tsconfig.json (no DOM types)
├── vite.config.ts              Includes the Vitest config
├── playwright.config.ts
├── eslint.config.js            Includes the import boundaries
├── .gitattributes              Git LFS patterns
├── .gitignore
├── CLAUDE.md
└── README.md                   How to start: `make setup`, `make dev`
```

### Source Structure

```text
src/
├── main.ts                     Boot, wiring, frame loop. The only file that knows every layer.
├── core/                       Shared basics; no DOM, no three.js
│   ├── result.ts, invariant.ts, log.ts, deepReadonly.ts, assertNever.ts
│   ├── uiTimings.ts            Every UI fade, hold, repeat and card time, in …Seconds (provisional †; UX M2, DN-2)
├── sim/                        The pure simulation. Runs in Node. No DOM, no three.js (own tsconfig)
│   ├── tsconfig.json           lib without DOM
│   ├── config.ts               Every gameplay number (GDD units, converted to steps)
│   ├── world.ts                The World type and createWorld(level, params)
│   ├── step.ts                 step(world, input): the system order
│   ├── inputFrame.ts           The InputFrame type
│   ├── events.ts               The SimEvent union
│   ├── math.ts                 Vectors, its own sin and cos, the seeded random generator
│   ├── tiles.ts                Collision-grid queries: solid, one-way, spike
│   ├── body.ts                 Bounding boxes; move and resolve on X, then on Y
│   ├── platforms.ts            Moving and waterwheel platforms; carrying riders
│   ├── player/                 controller.ts, ledgeGrab.ts, damage.ts, respawn.ts
│   ├── combat/                 shots.ts, stomp.ts, hitboxes.ts, weapons.ts
│   ├── enemies/                walker.ts, thornFlyer.ts, rootedSpitter.ts, seeds.ts, index.ts (registry)
│   ├── warden/                 warden.ts, attacks.ts, schedule.ts
│   ├── pickups.ts              Embers, the ember meter, bells, weapon pickups
│   ├── checkpoints.ts          Checkpoints, the pit rule's last stable ground, the exit
│   ├── regions.ts              Region triggers
│   ├── camera.ts               The gameplay camera and its logical view
│   ├── story.ts                The story director: seal break, held beat
│   ├── stats.ts                Clear time, respawns, embers
│   ├── debugCommands.ts        Development cheats; the only way debug/ changes the World
│   └── level/                  levelData.ts (runtime format types), parseLevel.ts (validated load → Result)
├── app/                        Session flow; hosts the simulation
│   ├── app.ts                  The state machine and dispatch(cmd)
│   ├── commands.ts             The AppCommand union
│   ├── levelHost.ts            Creates a World per level, runs steps, gathers events
│   ├── save.ts                 Versioned save and migrations
│   ├── settings.ts             Settings schema and defaults
│   └── perf.ts                 The ?perf=1 frame-time recorder (ships in release)
├── platform/                   Guarded browser features: try/catch, turned off on failure
│   ├── gamepad.ts, storage.ts, audioContext.ts, fullscreen.ts, visibility.ts, device.ts
├── input/                      keyboard.ts, gamepadMapping.ts, actions.ts (latching, InputFrame, menu actions), lastDevice.ts
├── render/                     The only layer that imports three.js
│   ├── renderer.ts             WebGLRenderer setup, resize, pixel ratio
│   ├── stage.ts                The scene and its depth layers
│   ├── viewCamera.ts           Perspective camera framing the logical view; interpolation
│   ├── materials/              THE ONLY place for GLSL, ShaderMaterial, onBeforeCompile and post-processing passes
│   ├── palettes/               emberwood.ts, drownedMill.ts, harrowmere.ts, story.ts (scenes outside levels)
│   ├── lighting/               emberwood.ts, drownedMill.ts, harrowmere.ts
│   ├── assets/                 loader.ts (GLTFLoader, MeshoptDecoder, manifest), dispose.ts
│   ├── level/                  levelView.ts (kit instancing), backdrops.ts, dressing.ts, controlSigns.ts
│   ├── actors/                 hero.ts (stages; animation from simulation state), enemies.ts, warden.ts, pickups.ts
│   ├── fx/                     particles.ts, shake.ts, flash.ts, storyStaging.ts (seal break, held beat)
│   └── cards/                  cardScene.ts (silhouette cards)
├── audio/                      mixer.ts (buses), music.ts, sfx.ts, ambience.ts, mix.ts (levels and curves)
├── ui/                         The DOM overlay
│   ├── overlay.ts              The root: layer stacking, sets --tile, owns the mute indicator
│   ├── components/             Shared: menuItem.ts, panel.ts, scrim.ts, slider.ts, toggle.ts,
│   │                           noticeLine.ts, confirmDialog.ts
│   ├── screens/                bootLoading.ts, hud.ts, title.ts (gate, then menu), loadingCard.ts,
│   │                           levelSelect.ts, results.ts, settings.ts, pause.ts, cardText.ts, deviceNote.ts,
│   │                           levelError.ts (bug panel; retry panel for boot and level loads), perfReport.ts
│   └── styles/                 base.css (DESIGN.md tokens as --{group}-{name}), screens.css
├── content/                    Data only
│   ├── storyText.ts            Every story line, keyed by moment
│   ├── cards.ts                Story card definitions: layers, palette slots, light
│   └── levels.ts               Level ids, order, display names
├── debug/                      Development only; imported only by main.ts, behind import.meta.env.DEV
│   ├── overlay.ts, urlParams.ts, cheats.ts, inputRecorder.ts, devHandle.ts (window.__emberbound), screenshotMode.ts, spots.ts (critic-loop spots)
└── lookdev/                    The look-dev page (development only): main.ts, assetBrowser.ts
```

### System Location Mapping

| System | Location | Responsibility |
| --- | --- | --- |
| Fixed-step loop | `src/main.ts`, `src/app/levelHost.ts` | Accumulator, step cap, interpolation alpha, gathering events |
| Player controller | `src/sim/player/` | The feel table, buffer, coyote, crouch, drop-through, ledge grab |
| Bodies and tile collision | `src/sim/body.ts`, `tiles.ts`, `platforms.ts` | Move and resolve, one-way rules, carrying riders, waterwheels |
| Combat | `src/sim/combat/`, `src/sim/player/damage.ts` | Shots, aiming, weapons, the hitbox rules, stomp, knockback |
| Enemies | `src/sim/enemies/` | Walker, thorn flyer, rooted spitter, seeds, the on-screen rule |
| The warden | `src/sim/warden/` | Phases, attack schedule, warnings, millstone targeting, reset |
| Pickups and checkpoints | `src/sim/pickups.ts`, `checkpoints.ts` | Embers and healing, bells, weapons, respawn, the pit rule |
| Gameplay camera | `src/sim/camera.ts` | Look-ahead, dead zone, clamping, the logical view |
| Story director | `src/sim/story.ts` (in level); `src/app/app.ts` (cards) | Story moments and safety; card sequences |
| Hit feedback | `src/sim/` (hit-stop); `src/render/fx/` (shake, flash, blink) | Deterministic hit-stop; visual-only effects |
| Session flow | `src/app/app.ts` | Boot, device note, title gate and menu, intro, loading, playing, pause (settings, confirm dialog), auto-pause, results, level select, error panels |
| Saving and settings | `src/app/save.ts`, `settings.ts`, `src/platform/storage.ts` | Versioned save, fallback, settings |
| Input | `src/input/`, `src/platform/gamepad.ts` | Action state, latching, devices, menu actions |
| Level data | `levels/` (sources), `scripts/compileLevels.ts`, `src/sim/level/` | Authoring, compiling and validating, loading at runtime |
| Jump verification | `tests/levels/` | Marked-jump search, coverage, static metric checks |
| Rendering and look | `src/render/` (`materials/` owns all shader code) | Layers, camera, palette, lighting, actors, kits |
| Story cards | `src/render/cards/`, `src/content/cards.ts`, `src/ui/screens/cardText.ts` | Silhouette art in the engine; text in the DOM |
| Assets | `public/assets/`, `scripts/optimizeModels.ts`, `buildManifest.ts`, `src/render/assets/` | Shipped files, compression, manifest, loading and disposal |
| Audio | `src/audio/`, `src/platform/audioContext.ts` | Buses, music, stingers, ambience, the wheel's distance curve |
| Interface | `src/ui/` | HUD, menus, results, card text, notices, the perf report |
| Control signs | `src/render/level/controlSigns.ts` | Waymarkers with icons picked from the presentation settings |
| Story text | `src/content/storyText.ts` | Every on-screen story line |
| Debug tools | `src/debug/`, `src/sim/debugCommands.ts`, `src/app/perf.ts` | Overlay, cheats, recorder, development handle, screenshot mode, perf |
| Look-dev page | `lookdev.html`, `src/lookdev/` | Any asset under the game's look, next to the style swatches |
| Build and budgets | `Makefile`, `vite.config.ts`, `scripts/checkBudgets.ts` | Build, size and file-count checks, release |

### Naming Conventions

#### Files

- **TypeScript:** camelCase, one main export per file: `thornFlyer.ts`, `levelSelect.ts`, `compileLevels.ts`.
- **No barrel `index.ts` files,** except `sim/enemies/index.ts` (the enemy registry).
- **Tests:**
  - Unit tests next to the code: `controller.test.ts` beside `controller.ts`.
  - Level tests: `tests/levels/*.test.ts`.
  - Playwright: `tests/e2e/*.spec.ts`.
- **Levels:** a level's id is its file name, in kebab-case, used unchanged everywhere: `emberwood`, `drowned-mill`, `harrowmere` (`levels/drowned-mill.tmj` compiles to `public/assets/levels/drowned-mill.json`).
- **Shipped assets:** kebab-case with a kind prefix:

| Kind | Prefix | Example |
| --- | --- | --- |
| Hero | `hero-` | `hero-rowan.glb` |
| Enemy | `enemy-` | `enemy-thorn-flyer.glb` |
| Warden | `warden-` | `warden-drowned-miller.glb` |
| Level kit | `kit-` | `kit-harrowmere.glb` |
| Pickup | `pickup-` | `pickup-triple-shot.glb` |
| Marker | `marker-` | `marker-checkpoint.glb` |
| Music | `music-` | `music-drowned-mill.*` |
| Ambience | `amb-` | `amb-harrowmere.*` |
| Effect | `sfx-` | `sfx-ember-spit.*` |
| Card shape | `card-` | `card-intro-2-crack.*` |
| Control icon | `icon-` | `icon-gamepad-south.*` |

- **Source art** in `art-src/`: kebab-case, matching the shipped asset's name.

#### Code Elements

| Element | Convention | Example |
| --- | --- | --- |
| Types and interfaces | PascalCase | `World`, `SimEvent`, `InputFrame` |
| Functions and variables | camelCase | `createWorld`, `stepPlayer` |
| Module constants | UPPER_SNAKE | `STEP_HZ`, `CONFIG` |
| Choices | String-literal unions, never TS `enum` | `'beast' \| 'changed'` |
| Step counts (in the simulation) | `…Steps` suffix | `coyoteSteps`, `invulnerableSteps` |
| Seconds or milliseconds (outside the simulation) | `…Seconds` or `…Ms` suffix | `fadeSeconds`, `loadMs` |
| Positions and velocities | Tiles and tiles/s, no suffix; y up; a body's x is its centre and y its feet | `player.x`, `player.vy` |
| Booleans | `is…`, `has…`, `can…` | `isGrounded`, `hasLedgeGrab` |
| Entity ids | Numbers, assigned in level order at load | `enemyId: 7` |
| Lasting ids (saved or authored) | Kebab-case strings taken from Tiled object names, scoped by level | `drowned-mill/bell-2` |
| Simulation events | Past tense, camelCase `type` | `enemyKilled` |
| App commands | Imperative, camelCase `type` | `startLevel` |
| CSS classes | kebab-case, prefixed by the component's name in the UX spines; shared components in `ui/components/` take `ui-` (proposed) | `hud-hearts`, `results-stat`, `ui-menu-item` |
| CSS custom properties | `--{group}-{name}` from the DESIGN.md tokens; `--tile` is set only by `ui/overlay.ts` | `--colors-surface-scrim`, `--tile` |

#### Game Assets

- **glTF node names** are snake_case, for example the hero's parts: `horn_left`, `horn_right`, `horn_right_broken`, `claw_right`, `hand_right`.
- **Animation clips** are snake_case and match the GDD's lists:
  - Hero: `idle`, `run`, `jump`, `fall`, `land`, `spit`, `spit_up`, `spit_down`, `crouch`, `hurt`, `death`, `hang`, `climb_up`.
  - Enemies: `move`, `idle`, `swell_fire`, `hurt`, `death`.
  - Warden: `idle`, `wash_warn`, `wash`, `millstone_warn`, `millstone`, `roll_warn`, `roll`, `hurt`, `phase_change`, `defeat`.
- **Kit pieces** inside a kit `.glb`: `<kind>_<variant>`, such as `ground_top`, `ledge_oneway`, `prop_lantern`, `story_glade_arch`.
- **Tiled:** layer names as in Level Data (`collision`, `entities`, `regions`, `dressing`, `jumps`). Classes are PascalCase (`PlayerStart`, `Walker`, `ThornFlyer`, `RootedSpitter`, `Warden`, `Checkpoint`, `Bell`, `Ember`, `WeaponPickup`, `Exit`, `MovingPlatform`, `WaterwheelPlatform`, `ControlSign`, `KillZone`, `ArenaTrigger`, `Door`, `MusicFade`, `AudioAnchor`, `Jump`); custom properties are camelCase.

### Architectural Boundaries

| Layer | May import | Must not import |
| --- | --- | --- |
| `core/` | Nothing | Anything else |
| `sim/` | `core/` | three.js, DOM types (its tsconfig has no DOM library), any other layer |
| `content/` | `core/` | Runtime layers |
| `platform/` | `core/` | three.js, `sim/`, `render/` |
| `input/` | `core/`, `platform/`, types from `sim/` | three.js, `render/`, `app/` |
| `app/` | `core/`, `sim/`, `content/`, `platform/`, types from `input/` | three.js, `render/`, `ui/`, `audio/` |
| `render/` | three.js, `core/`, `content/`, types from `sim/` (read through `DeepReadonly`), values from `sim/config.ts` | `app/`, `ui/`, `audio/`, `platform/` |
| `render/materials/` | three.js, `core/`, `render/palettes/`, `render/lighting/` | Nothing outside `render/` may contain GLSL or import `ShaderMaterial` |
| `audio/` | `core/`, `platform/`, `content/`, types from `sim/`, values from `sim/config.ts` | three.js, `render/`, `ui/` |
| `ui/` | `core/`, `content/`, the command and read-only state types from `app/`, types from `sim/`, values from `sim/config.ts` | three.js, `render/`, `audio/` |
| `debug/` | Anything | Nothing imports `debug/`, except `main.ts` behind `import.meta.env.DEV` |
| `lookdev/` | `render/`, `content/`, `core/` | `sim/`, `app/` |
| `scripts/` | Node, `core/`, `sim/level/`, values from `sim/config.ts` | Runtime presentation layers |

`sim/config.ts` is constant data, so presentation layers and scripts may import its values. They still never mutate the `World`.

**Enforcement:**

- ESLint's built-in `no-restricted-imports`, configured per folder in `eslint.config.js`.
- `consistent-type-imports`, so cross-layer type imports are type-only.
- The separate `src/sim/tsconfig.json` without DOM types.
- `make check` runs all of these.

**Git LFS** (`.gitattributes`):

- Covers `art-src/**`, plus `*.glb`, `*.blend`, `*.fbx`, `*.obj`, `*.png`, `*.jpg`, `*.webp`, `*.psd`, `*.kra`, `*.wav`, `*.flac`, `*.ogg`, `*.mp3`, `*.m4a`, `*.woff2` and `*.ttf`.
- Code, JSON, `.tmj` and `.tsj` stay in plain git.
- `git-lfs` is pinned in `mise.toml` if the mise registry has it.
- Check GitHub's current LFS storage and bandwidth quota before Epic 0.

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents. If a situation isn't covered here, follow the closest pattern and flag it in the story's notes.

### Novel Patterns

#### Marked-Jump Search

**Purpose:** prove, with the real simulation, that every intended jump in every level can be made (GDD; ADR-4).

**Components:**

- **`JumpMark`:** the `jumps` objects from Tiled, compiled into the level: `id`, `from` (point), `to` (area), `tier`, and the required `ability`.
- **`patterns(mark)`:** a generator of a bounded set of input patterns, most likely first:
  - run-up steps
  - direction
  - which step jump is pressed on
  - how long it is held
  - air steering
  - waiting steps, to pick a moving platform's phase
  - a ledge-grab climb, when `ability` is `ledgeGrab`
- **`tryJump(level, mark, pattern)`:** creates a `World` with `spawnAt: mark.from` and the level's form, feeds the pattern as `InputFrame`s, and reports success. Success means Rowan is standing in `to`, unhurt, within a step limit.
- **Coverage check:** finds the gaps and steps on the main path from the collision grid, and fails if any has no mark.

**Data flow:** compiled level, then the marks, then the patterns, then the real `step()`, then pass or fail per mark. It needs no rendering, and the first success ends the search early.

**Implementation guide:**

```typescript
// tests/levels/jumpSearch.ts
export function tryJump(level: LevelData, mark: JumpMark, p: InputPattern): boolean {
  const world = createWorld(level, { levelId: level.id, form: CONFIG.levelForm[level.id],
                                     spawnAt: mark.from, isStorySkippable: false });
  const frameAt = toInputFrames(p);               // pure: step index → InputFrame
  for (let i = 0; i < JUMP_MAX_STEPS; i++) {         // test limit, defined in this file
    step(world, frameAt(i));
    if (world.player.state === 'dead' || world.stats.hitsTaken > 0) return false;
    if (world.player.isGrounded && rectContainsFeet(mark.to, world.player)) return true;
  }
  return false;
}

// tests/levels/jumps.test.ts
for (const level of compiledLevels()) {
  for (const mark of level.jumps) {
    it(`${level.id}: jump ${mark.id} is possible`, () => {
      expect(someMatch(patterns(mark), (p) => tryJump(level, mark, p))).toBe(true);
    });
  }
}
```

**Usage:**

- Every level change runs it, through `make test`.
- Marking jumps is part of finishing any level layout.
- `spawnAt` is the same `createWorld` option the debug URL parameters use. There is no test-only code path in the simulation.

#### Story-Moment Timeline

**Purpose:** in-level story moments (the seal break, the held beat) must be deterministic, skippable on replays, safe for Rowan, and staged by rendering without rendering ever writing state (ADR-6).

**Components:**

- The timeline data in `CONFIG.story`: total steps, plus named cue steps.
- `sim/story.ts`: starts and ends moments, applies the state changes at cues, and enforces safety and skipping.
- `render/fx/storyStaging.ts`: reads `world.story` and the elapsed steps, and stages the camera, effects and model parts to match.

**Data flow:** a trigger (warden at 0 HP, or Rowan reaching the exit) leads to `startStory` (events, then clearing hazards), then the cues per step (state changes in the simulation), then `endStory` (event `levelCompleted`). Rendering reads every step and never writes.

**Implementation guide:**

```typescript
// sim/config.ts (timings † from the narrative design, tuned in Epic 4)
story: {
  sealBreak: { totalSteps: steps(14), cues: { sealShatter: steps(2.5), wheelStop: steps(3.5),
               millerSink: steps(6), rowanChange: steps(8), stinger: steps(12) } },
  heldBeat:  { totalSteps: steps(3), cues: {} },
},

// sim/story.ts
export function stepStory(world: World, input: InputFrame): void {
  const s = world.story;
  if (s.kind === 'none') return;
  const t = world.step - s.startStep;
  const timeline = CONFIG.story[s.kind];
  if (s.kind === 'sealBreak' && t === timeline.cues.rowanChange) applyStage(world, 'changed');
  const skipped = world.params.isStorySkippable && input.jumpPressed;
  if (t >= timeline.totalSteps || skipped) endStory(world); // applies remaining cues first
}
```

**Usage:**

- Any new in-level story moment adds a timeline to `CONFIG.story` and a `kind` to `story`.
- Its staging goes in `storyStaging.ts`.
- A unit test covers its safety, its skip behaviour and its end state.

#### View Sync by Entity Id

**Purpose:** rendering mirrors simulation entities that appear and disappear (enemies, shots, pickups) without ever writing to the simulation, and without leaking three.js objects.

**Components:** a `Map<entityId, View>` per entity family in `render/actors/`; a `createXView(kind)` factory; `view.update(entity, alpha)`; `view.dispose()`.

**Data flow:** each frame, for each live entity, the matching view is created if missing, then updated with the interpolated position and the state-driven clip. Views whose entity is gone are disposed and removed.

**Implementation guide:**

```typescript
// render/actors/enemies.ts
const views = new Map<number, EnemyView>();
let frameNo = 0;

export function syncEnemies(world: DeepReadonly<World>, alpha: number): void {
  frameNo += 1;
  for (const e of world.enemies) {
    let v = views.get(e.id);
    if (!v) { v = createEnemyView(e.kind, currentPalette()); views.set(e.id, v); stage.play.add(v.root); }
    v.root.position.set(lerp(e.prevX, e.x, alpha), lerp(e.prevY, e.y, alpha), 0);
    v.showState(e.state);           // picks the animation clip; visual only
    v.seenFrame = frameNo;
  }
  for (const [id, v] of views) {
    if (v.seenFrame !== frameNo) { stage.play.remove(v.root); v.dispose(); views.delete(id); }
  }
}
```

**Usage:** every entity family that is drawn uses this shape. No view keeps a reference to a simulation object between frames; it uses the id.

#### Deterministic Screenshot Spots

**Purpose:** the critic loop compares screenshots taken at fixed spots, so captures must be identical from run to run.

**Components:**

- `src/debug/spots.ts`: id, level, position, form, and the time at which animation is frozen. The Playwright spec imports the same list.
- `debug/screenshotMode.ts`: on `?shot=<id>`, it builds the `World` at the spot, pauses the simulation, sets animation time to the frozen value, seeds particles, and reports ready through `window.__emberbound.isReady()`.
- `tests/e2e/shots.spec.ts`: visits each spot and saves its screenshot.

**Implementation guide:**

```typescript
// src/debug/spots.ts
export const SPOTS = [
  { id: 'l1-start',     level: 'emberwood',    at: { x: 4,   y: 3 }, form: 'beast',   animTime: 0.25 },
  { id: 'l1-glade',     level: 'emberwood',    at: { x: 138, y: 5 }, form: 'beast',   animTime: 0.25 },
  { id: 'l3-fallen-bell', level: 'harrowmere', at: { x: 0,   y: 0 }, form: 'changed', animTime: 0.25 }, // coordinates set in Epic 5
] as const;

// tests/e2e/shots.spec.ts
for (const spot of SPOTS) {
  test(`shot ${spot.id}`, async ({ page }) => {
    await page.goto(`/?shot=${spot.id}`);
    await page.waitForFunction(() => window.__emberbound?.isReady() === true);
    await page.screenshot({ path: `shots/round-${process.env.ROUND ?? '0'}/${spot.id}.png` });
  });
}
```

**Usage:**

- `make shots ROUND=n` saves each critic-loop round to `shots/round-n/`, so the before and after shots are kept for the developer.
- Spots are added when a level or set piece is built.
- Screenshots are compared by eye against the style guide, never pixel-diffed. Software WebGL output differs from GPU output.

### Communication Patterns

**Pattern:** explicit wiring in `main.ts`, with dependencies passed as parameters.

- No singletons and no service locator.
- Inside the simulation, systems are plain functions called in the fixed order, with `world` passed explicitly.
- Across layers, use the two typed channels: `SimEvent`s out of the simulation, and `AppCommand`s into the app.
- Input reaches the app through a callback, so `input/` never imports `app/`.

**Example:**

```typescript
// main.ts: the only place that knows every layer
const storage = createStorage();                         // platform (guarded)
const app = createApp({ storage, levels: LEVELS });
const input = createInput({ onAppAction: (a) => app.dispatch(a) });
const view = createRenderer(canvas);
const audio = createAudio(createAudioContext());         // platform (guarded)
const ui = createUi(overlayEl, { dispatch: app.dispatch, playUiSound: audio.playUi });
const presentation = () => presentationSettings(app.state, input.lastDevice(), featureStatus()); // read-only, per frame; featureStatus() reads the platform/ wrappers
startLoop({ app, input, view, audio, ui, presentation });
```

### Entity Patterns

**Creation:**

- **Simulation entities** are plain objects with a `kind` discriminant. They are built by factory functions from level definitions when the `World` is created, through the registry in `sim/enemies/index.ts`.
- **Ids** come from `world.nextId++`, so they are deterministic.
- **Things that spawn mid-level** (shots, seeds, millstones) use fixed-capacity pools, allocated in `createWorld`, with an `isActive` flag. They are never allocated per step.
- **Views** in rendering are created on demand by the view-sync pattern.

**Example:**

```typescript
// sim/enemies/walker.ts
export interface Walker {
  kind: 'walker'; id: number; x: number; y: number; prevX: number; prevY: number;
  vx: number; vy: number; dir: -1 | 1; hp: number; state: 'patrol' | 'dead'; stateSteps: number;
}
export function createWalker(def: WalkerDef, id: number): Walker {
  return { kind: 'walker', id, x: def.x, y: def.y, prevX: def.x, prevY: def.y,
           vx: CONFIG.walker.speed * def.dir, vy: 0, dir: def.dir, hp: CONFIG.walker.hp, state: 'patrol', stateSteps: 0 };
}

// sim/combat/shots.ts: pool allocated in createWorld(), capacity in CONFIG
export function fireShot(world: World, x: number, y: number, dirX: number, dirY: number): void {
  const shot = world.shots.find((s) => !s.isActive);
  if (!shot) return;                                       // pool full: drop the shot
  activateShot(shot, world.nextId++, x, y, dirX, dirY);
  world.events.push({ type: 'shotFired', x, y, dirX, dirY });
}
```

### State Patterns

**Pattern:**

- Each entity has an explicit state machine: a string-literal `state`, plus a `stateSteps` counter.
- All transitions for an entity live in one function. There are no scattered boolean flags.
- Rendering maps `state` to an animation clip through one table per actor, plus one `choose…Clip` function for short overlays (spit, land) driven by `spitSteps`, `landSteps` and `aim`.
- The app uses the same pattern for screens.

**Example:**

```typescript
// sim/player/controller.ts
export type PlayerState = 'idle' | 'run' | 'jump' | 'fall' | 'crouch' | 'hang' | 'climb' | 'hurt' | 'dead';

function nextPlayerState(p: Player): PlayerState {      // the ONLY place transitions are decided
  if (p.hp <= 0) return 'dead';
  if (p.knockbackSteps > 0) return 'hurt';
  if (p.ledge) return p.climbSteps > 0 ? 'climb' : 'hang';
  if (!p.isGrounded) return p.vy > 0 ? 'jump' : 'fall';
  if (p.isCrouching) return 'crouch';
  return p.vx !== 0 ? 'run' : 'idle';
}

export function updatePlayerState(p: Player): void {
  const next = nextPlayerState(p);
  if (next !== p.state) { p.state = next; p.stateSteps = 0; } else { p.stateSteps += 1; }
}

// render/actors/hero.ts
const CLIP_FOR_STATE: Record<PlayerState, HeroClip> = {
  idle: 'idle', run: 'run', jump: 'jump', fall: 'fall', crouch: 'crouch',
  hang: 'hang', climb: 'climb_up', hurt: 'hurt', dead: 'death',
};

// The one place overlays are chosen: spitting and landing win over the base clip briefly
export function chooseHeroClip(p: DeepReadonly<Player>): HeroClip {
  const canSpitOverlay = p.state === 'idle' || p.state === 'run' || p.state === 'jump' || p.state === 'fall' || p.state === 'crouch';
  if (canSpitOverlay && p.spitSteps < CONFIG.feedback.spitClipSteps) {
    return p.aim === 'up' ? 'spit_up' : p.aim === 'down' ? 'spit_down' : 'spit';
  }
  if (p.state === 'idle' && p.landSteps < CONFIG.feedback.landClipSteps) return 'land';
  return CLIP_FOR_STATE[p.state];
}
```

### Data Patterns

**Access:**

- **Gameplay numbers:** import `CONFIG` from `sim/config.ts`.
- **Story text:** import from `content/storyText.ts`.
- **Level data:** passed into `createWorld()`.
- **Assets:** looked up by manifest id through `render/assets/loader.ts`, never by a path string.
- **Saves:** only through `app/save.ts`.
- No module reads `localStorage`, `fetch` or a file path directly, except its owner in `platform/` or `render/assets/`.

**Example:**

```typescript
import { CONFIG } from '../sim/config.ts';              // numbers (relative imports carry .ts)
import { STORY_TEXT } from '../content/storyText.ts';   // words
const hero = await assets.model('hero-rowan');          // manifest id, not 'assets/models/…'
ui.loadingCard.show(STORY_TEXT.levelLine['drowned-mill']);
```

### Consistency Rules

| Pattern | Convention | Enforcement |
| --- | --- | --- |
| Units | Tiles and tiles/s; steps for time inside `sim/`; y up; a body's x is its centre and y its feet | `…Steps` naming; unit tests |
| Time in the simulation | Whole steps only. No seconds or milliseconds in `sim/` logic. | Review; `CONFIG` derives steps |
| Randomness and clocks | `world.rng` only. No `Math.random`, `Date` or `performance` in `sim/`. | ESLint `no-restricted-properties` and `no-restricted-globals` on `src/sim/**` |
| Mutating `World` | Only `sim/`; everything else sees `DeepReadonly<World>` | TypeScript types |
| Gameplay numbers | Only in `sim/config.ts`; tests import them | Review; tests |
| Shader code | Only in `render/materials/` | ESLint `no-restricted-imports` (`ShaderMaterial` and friends) outside it; review for GLSL strings |
| Layer imports | The boundary table in Project Structure | ESLint `no-restricted-imports` per folder; sim tsconfig without DOM |
| `any` | Not without a comment explaining why (CLAUDE.md) | `@typescript-eslint/no-explicit-any`; an inline disable needs a reason |
| Exhaustive handling | Every `switch` on a union ends with `assertNever` | `@typescript-eslint/switch-exhaustiveness-check` |
| Promises | Never left floating | `@typescript-eslint/no-floating-promises` |
| Failures | `invariant` for bugs, `Result` for expected failures, `platform/` wrappers for features | Review |
| Logging | Only through `core/log.ts`; never in `sim/` | ESLint `no-console` everywhere except `core/log.ts` |
| Asset references | Manifest ids, never path strings | Review |
| Story text | Only in `content/storyText.ts` | Review |
| Overlay values | UI timings only in `core/uiTimings.ts` (`…Seconds`, never frames); sizes as multiples of `--tile`, which only `ui/overlay.ts` sets; colours and type only through the token properties (`--{group}-{name}`) | Review |
| Formatting | Prettier with the project config (approved 2026-11-13) | `make format`; `make check` runs `prettier --check` |
| Imports and syntax | Relative imports carry `.ts`; `import type` for types; no enums, namespaces or parameter properties (Node runs `scripts/*.ts` natively) | tsconfig `allowImportingTsExtensions`, `verbatimModuleSyntax`, `erasableSyntaxOnly` |
| Presentation settings | Read only from the per-frame `PresentationSettings` snapshot | Review |
| Booleans | `is…`, `has…` or `can…` names | Review |
| Lint baseline | typescript-eslint `strictTypeChecked` plus the rules above | `make lint` |
| Commands | `make` targets, never raw tool commands | Makefile; README |
| Dependencies | Ask the developer before adding any (CLAUDE.md) | Review |
| Done means checked | Every simulation rule has a unit test; run `make check` before saying a change works | CLAUDE.md |
| Visual changes | Run the critic loop (`make shots`, compare, fix; at most 3 rounds) | CLAUDE.md |

---

## Architecture Validation

### Validation Summary

| Check | Result | Notes |
| --- | --- | --- |
| Decision Compatibility | Pass, after fixes | 5 conflicts fixed: config imports versus boundaries; presses lost during hit-stop; when story cues apply; Level 2 failing validation; presentation access to settings and the last-used device |
| GDD Coverage | Pass, after fixes | Added: pits and deep water, data for the warden, door, start and control signs; hit-feedback numbers; all-bells ordering on replays; the full event set (weapon warning, warden warnings, landings, heart restored, enemy flash) |
| Pattern Completeness | Pass | Entity creation, communication, state, error handling, data access and events, each with an example; 4 novel patterns fully documented |
| Epic Mapping | Pass | Epics 0 to 6 map to locations; Epic 4's standalone arena and ledge-grab room are test levels; pickups and markers added |
| Document Completeness | Pass | No placeholders. Testing Strategy and Performance Budget added. Versions pinned, except butler (chosen in Epic 6) and whether mise can install Tiled (checked in Epic 1). |

### Coverage Report

**Systems Covered:** 21 of 21 (the core systems in Project Context)
**Patterns Defined:** 4 standard, 4 novel, 24 consistency rules
**Decisions Made:** 22

### Issues Resolved

1. Presentation layers and scripts may import values from `sim/config.ts`. Hit feedback lives in `CONFIG.feedback`; shake raises and never adds.
2. Level data gained `PlayerStart`, `Warden`, `ControlSign`, `KillZone`, `ArenaTrigger`, `Door`, `MusicFade` and `AudioAnchor`.
3. Presses are written into input buffers, which hit-stop doesn't count down.
4. Validation accepts a door checkpoint, and either an exit or a warden.
5. Story cues apply during the timeline and emit `storyCueReached`; `endStory` applies any cue not yet reached.
6. A `PresentationSettings` snapshot, a `playUiSound` callback, and control signs rendered as scenery.
7. The full `SimEvent` union, with past-tense names used throughout.
8. `WorldParams` and every `World` field defined; no undefined terms remain.
9. Cheats go through `sim/debugCommands.ts`.
10. The screenshot harness runs against the dev server. Spots live in `src/debug/spots.ts`; shots are saved per round; the perf report sits in `ui/`; `?perf=1` is the one release exception.
11. Makefile targets for levels, models, smoke checks and release. The build generates the manifest; the type check covers the simulation's config.
12. Scripts may use config values. At runtime, `parseLevel` checks shape and version only.
13. Testing Strategy and Performance Budget sections; the remaining-decisions list marked resolved; stale "not chosen" text removed.
14. `chooseHeroClip` handles the spit and land overlays; every entity carries `stateSteps`.
15. Pickup and marker models, their naming and their budget; model conventions; test levels; the main path defined.
16. App flow: the all-bells card after a Level 1 or 2 replay, and rewatching it from the level select. The stored flag was removed.
17. URL parameters use level ids.
18. Boolean names, the `as const` wording, † defined, a step 0 in the system order, tool versions pinned.
19. Tiled recorded as the developer's choice (2026-11-13).
20. Node runs `scripts/*.ts` natively: relative imports carry `.ts`; `@types/node` approved.
21. Performance budgets have starting numbers marked †.

**Process:**

- An independent validator found 5 blockers, 13 fixes and 3 items for the developer.
- After the fixes, a second independent pass failed with an API authentication error.
- Every fix was then re-verified with targeted searches of the document.

### Follow-ups Outside This Document

- **CLAUDE.md** still lists the level editor as open, and doesn't mention the mise, Makefile and Docker rule. Update it with the developer's approval.
- **The GDD's Dependencies table** still lists the level editor as "not chosen". Update it through `gds-gdd` (update) or `gds-correct-course`.
- **`_bmad-output/project-context.md`** is generated from this document. Refresh it after the 1.1 revision (the UX fold-in), with `gds-generate-project-context` or by applying the listed rule edits.

### Validation Date

2026-11-13

---

## Development Environment

### Prerequisites

| Tool | How it's installed | Notes |
| --- | --- | --- |
| mise | System package (on Arch-based systems such as CachyOS: `pacman`), or mise's installer | Installs every pinned tool from `mise.toml` |
| Node.js 26.13.x | `mise install` | Never a global Node |
| git and git-lfs | git from the system; git-lfs through mise if its registry has it, otherwise the system package | `git lfs install` once per machine. Check GitHub's LFS quota before the first binary is committed. |
| Tiled 1.12.x | Through mise if a backend can install it (checked in Epic 1), otherwise the system package | Desktop app. `make setup` checks its version. |
| Blender | System package or blender.org | The version is pinned in Epic 2, when the pipeline is proven with the Blender MCP |
| Docker | System package | Only if a service is ever needed; version one needs none |
| A current browser | Chrome, Edge or Firefox | For `make dev`; Playwright brings its own for tests |

### AI Tooling (MCP Servers)

The following MCP servers were selected during architecture to enhance AI-assisted development:

| MCP Server | Purpose | Install Type |
| --- | --- | --- |
| Playwright MCP | Drive the game in a real browser: the critic loop, run checks, screenshots | Already configured in the Claude Code environment |
| Blender MCP | Clean-up, rigging, animation and glTF export | Blender add-on plus MCP server, set up in Epic 2 following its own documentation |
| Context7 (`upstash/context7`) | Current documentation for three.js, Vite, Vitest and Playwright | Claude Code plugin, already installed. Authorize it with `/mcp` in an interactive session. |

**Setup:**

- Context7 needs one authorization in an interactive Claude Code session (`/mcp`). Until then, agents fall back to web search for documentation.
- The Blender MCP's install steps are taken from its current documentation in Epic 2, not from memory (CLAUDE.md).

These give your AI assistant direct access to the browser game, the asset pipeline and current documentation for context-aware code generation.

### Setup Commands

Available once Epic 0, story 1, has scaffolded the repository:

```bash
git clone https://github.com/emilijan-koteski/emberbound.git
cd emberbound
git lfs install      # once per machine
mise install         # Node and the other pinned tools
make setup           # npm ci, Playwright browsers, tool checks
make dev             # the game, plus the look-dev page at /lookdev.html
make check           # lint, format check, type check, tests
```

### First Steps

1. **Epic 0, story 1:** scaffold the repository as in Project Initialization: `mise.toml`, the `Makefile`, the Vite `vanilla-ts` template, ESLint, Prettier, Vitest, Playwright, `.gitattributes` for Git LFS, and the DOM-free `src/sim/tsconfig.json`.
2. **Before the first binary is committed:** check GitHub's LFS quota and turn LFS on.
3. **Authorize Context7** with `/mcp`.
4. **Choose the image model** and log its terms in `docs/ASSETS.md`. It blocks Epic 0's reference art (GDD Dependencies).

---
title: 'Sprint Change Proposal — planning gaps from story creation'
project: emberbound
date: 2026-11-13
status: approved
mode: batch
trigger: '_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md (triage, X-C1 to X-C11)'
scope: moderate
artifacts:
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md
  - _bmad-output/project-context.md
---

# Sprint Change Proposal — Emberbound — planning gaps (2026-11-13)

Paths are relative to the project root. X-C numbers refer to the triage table at the top of `requirements-inventory.md`.

## 1. Issue Summary

`gds-create-epics-and-stories` (2026-11-13) extracted every requirement from the GDD, narrative, architecture and UX spines and wrote 132 stories. It found gaps that no story can close without changing a settled document:

- **Underspecified architecture (X-C1, X-C2, X-C3, X-C10):** nothing owns asset and level loading; the asset manifest can't reach the dev server or `dist/` as written; test levels have no way out of the release build; the replay skip by "confirm" has no path into the simulation; Emberwood's "hushed" glade has no audio mechanism.
- **A rule conflict (X-C4):** the camera stops at the level edges yet always shows 19 × 10.4 tiles, which can't both hold in the 19-tile warden arena on screens wider than 16:9.
- **A design gap (X-C5):** 30 HP that can be hit at any time, at 5 shots a second (15 with the triple shot from the door), gives a fight of roughly 5 to 15 s against the GDD's 60 to 120 s target. The walk-back after the wheel roll can't be dodged (3 × 4 body †, 3.30-tile jump, ledges 3 tiles up). Attack timing details are unstated.
- **Decisions the developer made during story creation (X-C7, X-C8, X-C9, X-C11):** the look-dev page imports `ui/`; the `yaml` package for the token drift test; spit as an upper-body overlay; a warden `walk` clip (superseded below).
- **Follow-up F1:** the architecture lists a CLAUDE.md update as open (it turned out to be done already; Section 4.4).

Category: requirements underspecified at planning time, found before any code exists. Evidence: the inventory's Appendix A (gdd#1, #3, #4; ga#1, #4, #5, #6) and the Notes in stories 0.3, 0.6, 1.2, 1.3, 2.8, 3.15, 4.2–4.4, 4.7, 4.11.

## 2. Impact Analysis

- **Epics:** all seven keep their scope, order and exit criteria. No epic is added or removed.
- **Stories:** no story is added or removed. Stories 0.3, 0.6, 1.2, 1.3, 2.8, 3.2, 3.3, 3.15, 4.2, 4.3, 4.4, 4.7, 4.10, 4.11, 4.14, 4.15, 5.10, 5.13, 5.16 change (Section 4.5). Their `**Blocked on:**` lines go.
- **Artifacts:** the architecture (9 sections), the GDD (camera, warden, decision log), `project-context.md` (6 rules), `epics.md`, `requirements-inventory.md`. The UX spines don't change here; X-C6 stays in story 0.14.
- **Technical:** nothing is built yet, so no code changes and nothing to roll back. The changes add one `core/` type, one `InputFrame` field, one region rename and one build-order change.
- **MVP:** unaffected. Epic 3 gains only the glade hush mechanism. The warden changes land in Epic 4.

## 3. Recommended Approach

**Direct adjustment** (checklist 4.1: viable, low effort, low risk). Rollback is not applicable (nothing built); an MVP review is not needed (scope unchanged).

The warden change is the only design change. The developer chose a weak point with damage windows over raising HP or shortening the target, because it fits the story (the seal is the hub) and pillar 2's pattern-learning fight, and it keeps every attack dodgeable. The developer chose a roll back over a walk back, which keeps every rule intact and drops the `walk` clip (X-C11).

## 4. Detailed Change Proposals

### 4.1 Architecture (`game-architecture.md`)

**A1 — X-C1, who loads. Section Asset Management.**

OLD:
> **Loading strategy:** shared assets load at boot; each level's assets load behind its level-line card.

NEW:
> **Loading strategy:** shared assets load at boot; each level's assets load behind its level-line card.
>
> - **Who loads:** `core/loading.ts` defines the `AssetLoader` port: `loadShared(onProgress)` and `loadLevel(levelId, onProgress)`, each returning `Promise<Result<…, LoadError>>`, with `onProgress(loaded, total)` counted in files. `render/assets/loader.ts` implements it and is the only code that fetches: it decodes models and textures itself, returns audio files as bytes for `audio/` to decode, and returns the level file as raw JSON. `main.ts` passes the port to the app.
> - **The app owns loading state:** it calls the port, keeps the progress in app state (the boot bar and the loading card read it), parses the level with `parseLevel`, retries a failed load once silently, then enters the Retry state (UX Q8). A level file that fails `parseLevel` counts as a failed load.

Also, in Architectural Boundaries, no row changes: `core/loading.ts` imports nothing, and `app/` and `render/` both already import `core/`.

**A2 — X-C2, the manifest and test levels. Section Asset Management, Manifest bullet.**

OLD:
> - **Manifest:** `assets/manifest.json` is generated at build time, with a shared bundle plus one bundle per level.

NEW:
> - **Manifest:** `scripts/buildManifest.ts` writes `public/assets/manifest.json` from the files in `public/assets/`, with a shared bundle plus one bundle per level. It runs before Vite, in `make dev`, `make shots`, `make test` and `make build`. Vite copies `public/` unchanged, so the manifest's paths stay valid in `dist/`. Development manifests list the test levels; the release manifest that `make build` writes leaves them out.

**Section Build and Release, `make build` list.**

OLD:
> 1. the level compile and validation
> 2. type checking
> 3. the tests
> 4. the Vite build
> 5. the manifest (`scripts/buildManifest.ts`)
> 6. the budget checks: total size 30 MB or less, 1,000 files or fewer, the per-asset budgets

NEW:
> 1. the level compile and validation
> 2. the release manifest (`scripts/buildManifest.ts --release`), without the test levels
> 3. type checking
> 4. the tests
> 5. the Vite build
> 6. removing the test levels from `dist/assets/levels/`
> 7. the budget checks: total size 30 MB or less, 1,000 files or fewer, the per-asset budgets, and no test level left in `dist/`

**Section Level Data, Test levels bullet.**

OLD:
> - **Test levels:** `levels/test-*.tmj`, such as `test-ledge-grab.tmj` and Epic 4's standalone `test-warden-arena.tmj`, compile like the others but are left out of the release build and the level select. Epic 5 joins the arena to `drowned-mill.tmj`.

NEW:
> - **Test levels:** `levels/test-*.tmj`, such as `test-ledge-grab.tmj` and Epic 4's standalone `test-warden-arena.tmj`, compile like the others into `public/assets/levels/`. The release manifest leaves them out, `make build` deletes them from `dist/`, and the budget check fails if one remains; they never appear in the level select. Epic 5 joins the arena to `drowned-mill.tmj` and deletes `test-warden-arena.tmj`.

**A3 — X-C3, skip by confirm. Section Input.**

OLD:
> - `input/` turns keyboard events and polled gamepads into one action state. **The simulation receives one `InputFrame` per step:** `moveX` (-1, 0 or 1), `up`, `down`, `jumpPressed`, `jumpHeld`, `spitPressed` and `spitHeld`.

NEW:
> - `input/` turns keyboard events and polled gamepads into one action state. **The simulation receives one `InputFrame` per step:** `moveX` (-1, 0 or 1), `up`, `down`, `jumpPressed`, `jumpHeld`, `spitPressed`, `spitHeld` and `confirmPressed`. `confirmPressed` is latched from the confirm keys and button (Enter, Space, gamepad south) during play; only the story director reads it, as the replay skip, so recorded input still replays exactly.

OLD:
> - **App-level actions** (pause, mute, and menu up, down, left, right, confirm and back) go to the app, never to the simulation. Menus can be navigated with a gamepad.

NEW:
> - **App-level actions** (pause, mute, and menu up, down, left, right, confirm and back) go to the app, never to the simulation, while a menu or card is up. During play, a confirm press reaches the simulation only as `confirmPressed`. Menus can be navigated with a gamepad.

**Section Story Director.**

OLD:
> - Player input is ignored, except the skip action (jump or confirm) when `params.isStorySkippable` is set (replays).

NEW:
> - Player input is ignored, except the skip action (`jumpPressed` or `confirmPressed`) when `params.isStorySkippable` is set (replays).

**Section Implementation Patterns, `stepStory` example.**

OLD:
> `const skipped = world.params.isStorySkippable && input.jumpPressed;`

NEW:
> `const skipped = world.params.isStorySkippable && (input.jumpPressed || input.confirmPressed);`

**A4 — X-C4, framing beyond the level. Section Gameplay Camera, after "The renderer frames at least that box at any aspect ratio…".**

NEW bullet:
> - **Beyond the level's edges:** the simulation camera stops at the level edges, so in the 19-tile warden arena it holds still with the arena filling the logical view's width. Where the window is wider or taller than the logical view, the margin shows the level's dressing up to 3 tiles † past its edges (every kit carries that margin); past that, the view camera shows plain bands in the level palette's darkest slot.

**A5 — X-C5, the warden's weak point. Section Project Context, systems table, warden row.**

OLD:
> | The warden (dormant until entry, 2 phases, attack scheduler, warnings, millstone targeting, reset on respawn) | Medium-high | The Warden of the First Seal |

NEW:
> | The warden (dormant until entry, 2 phases, attack scheduler, warnings, millstone targeting, the hub weak point and its damage windows, reset on respawn) | Medium-high | The Warden of the First Seal |

**A6 — X-C7, look-dev imports `ui/`. Section Architectural Boundaries, `lookdev/` row.**

OLD:
> | `lookdev/` | `render/`, `content/`, `core/` | `sim/`, `app/` |

NEW:
> | `lookdev/` | `render/`, `ui/` (overlay root, styles, components, so the overlay is judged on the look-dev page), `content/`, `core/` | `sim/`, `app/` |

**A7 — X-C8, `yaml`. Section Toolchain, new row after `@types/node`.**

NEW:
> | `yaml` | Exact version, the newest patch at least two weeks old | `package.json` | Development only: the DESIGN.md token drift test reads its frontmatter. Approved by the developer on 2026-11-13. |

**A8 — X-C9, spit as an upper-body overlay. Section Implementation Patterns, the hero clip example.**

OLD:
> ```ts
> // The one place overlays are chosen: spitting and landing win over the base clip briefly
> export function chooseHeroClip(p: DeepReadonly<Player>): HeroClip {
>   const canSpitOverlay = …;
>   if (canSpitOverlay && p.spitSteps < CONFIG.feedback.spitClipSteps) {
>     return p.aim === 'up' ? 'spit_up' : p.aim === 'down' ? 'spit_down' : 'spit';
>   }
>   if (p.state === 'idle' && p.landSteps < CONFIG.feedback.landClipSteps) return 'land';
>   return CLIP_FOR_STATE[p.state];
> }
> ```

NEW:
> ```ts
> // The one place clips are chosen. Spit clips key only the upper body and play as a
> // second action over the base clip, so the legs keep running, jumping or crouching.
> export function chooseHeroClip(p: DeepReadonly<Player>): { base: HeroClip; overlay: HeroOverlayClip | null } {
>   const base = p.state === 'idle' && p.landSteps < CONFIG.feedback.landClipSteps ? 'land' : CLIP_FOR_STATE[p.state];
>   const canSpitOverlay = p.state === 'idle' || p.state === 'run' || p.state === 'jump' || p.state === 'fall' || p.state === 'crouch';
>   const overlay = canSpitOverlay && p.spitSteps < CONFIG.feedback.spitClipSteps
>     ? (p.aim === 'up' ? 'spit_up' : p.aim === 'down' ? 'spit_down' : 'spit')
>     : null;
>   return { base, overlay };
> }
> ```
> Spit as an upper-body overlay was decided by the developer on 2026-11-13.

**A9 — X-C10, `AudioFade`. Section Level Data, `regions` row:** `MusicFade` (Level 3) becomes `AudioFade` (fades the music or the ambience bus to the region's target gain: Level 3's music drop-out, Emberwood's hushed glade). **Section Consistency Rules, Tiled classes:** `MusicFade` becomes `AudioFade`. **Section Audio, Music list.**

OLD:
> - in Level 3, the music fades out on the `regionEntered` event for the `MusicFade` region

NEW:
> - on the `regionEntered` event for an `AudioFade` region, its bus (`music` or `ambience`, a Tiled property) fades to the region's target gain (Level 3's music to 0; Emberwood's glade ambience lowered); a respawn outside the region restores the bus

**X-C11 is dropped:** with the roll back (A5, G2), the warden needs no `walk` clip, and the clip list stays as it is.

### 4.2 GDD (`gdd.md`)

**G1 — X-C4. Section Movement System, Camera.**

OLD:
> - Stops at the level edges.

NEW:
> - Stops at the level edges. On windows wider or taller than the 19 × 10.4 view, the margin shows the level's dressing up to 3 tiles † past its edges, then plain bands. In the 19-tile warden arena the camera holds still.

**G2 — X-C5. Section The Warden of the First Seal, Arena and rules.**

OLD:
> - **Body:** the warden is 3 × 4 tiles † and stands at the arena's right side. Its body is its hurtbox.
> - **Health:** 30 HP. Each ember hit does 1 damage, a triple shot can land 3 hits, and the warden can be hit at any time.

NEW:
> - **Body:** the warden is 3 × 4 tiles † and stands at the arena's right side. Shots that hit the body splash off with a clear blocked cue and do no damage.
> - **Weak point:** the seal at the wheel's hub, a 1 × 1 tile † target near the top of the body, is the only hurtbox. It glows open for 1.5 s † at the start of each gap between attacks and is shut the rest of the time; a shot at the shut hub splashes off like a body hit. The open hub can be hit with aim-up from the floor or with straight shots from the ledges.
> - **Health:** 30 HP †. Each ember hit on the open hub does 1 damage, and a triple shot can land 3 hits. HP and the window length are tuned together in Epic 4 so a first-time player's fight lands in 60 to 120 s.

**Attacks table, wheel roll row, Numbers column.**

OLD:
> A 2 × 1.5 wheel at 12 tiles/s. It rolls to the far wall, then walks back to its side.

NEW:
> A 2 × 1.5 wheel at 12 tiles/s. It rolls to the far wall, then rolls back to its side: two passes, each jumped the same way.

**Attacks table, millstone row, Numbers column.**

OLD:
> … One lands where Rowan stands when the warning starts, and the rest are at least 2 tiles apart. A 3-tile gap is always left clear.

NEW:
> … One lands where Rowan stands when the warning starts, and the rest have at least 2 tiles of clear floor between them. A 3-tile gap is always left clear. A millstone lands on the first surface below it, a ledge or the floor, and its shadow marks that surface.

**Pacing.**

OLD:
> - **No overlap.** Attacks never run at the same time. The gap before the next attack starts counts from the end of the previous one: 2.5 s † in phase 1, 1.8 s † in phase 2.
> - **Phase 2** begins at 15 HP: the warden flinches and the music shifts.

NEW:
> - **No overlap.** Attacks never run at the same time. The gap before the next attack's warning counts from the end of the previous attack's hazard (the wave leaving the arena, the last millstone landing, the roll back reaching his side): 2.5 s † in phase 1, 1.8 s † in phase 2. The hub window opens at the start of each gap.
> - **Phase 2** begins at 15 HP, once the current attack has ended: the warden flinches and the music shifts. It never cuts an attack short.

### 4.3 `project-context.md`

| Section | Change |
| --- | --- |
| Technology Stack | `@gltf-transform/cli` line adds: "`yaml` (development only, the token drift test, approved 2026-11-13)." |
| Code Organization, Layers | Adds: "`lookdev/` imports `render/`, `ui/`, `content/` and `core/`." |
| Code Organization, Wiring | Adds: "Loading goes through the `AssetLoader` port in `core/loading.ts`, implemented by `render/assets/loader.ts` and passed in by `main.ts`. The app owns loading state, progress and the one silent retry." |
| Engine-Specific Rules, Animation | "(spit and land overlays)" becomes "(spit clips are upper-body overlays played over the base clip; land replaces the idle clip briefly)". |
| Performance Rules, Assets | Adds: "The manifest is built from `public/assets/` before Vite. Test levels never ship: the release manifest leaves them out and `make build` deletes them from `dist/`." |
| Platform and Build Rules, Input | Adds: "During play, confirm also latches `InputFrame.confirmPressed`; only the story director reads it (the replay skip)." |

### 4.4 CLAUDE.md

**No change needed (found while applying, 2026-11-13).** CLAUDE.md already names Tiled 1.12.x in its Settled stack and carries the mise, Makefile and Docker rule (Settled stack; How to work), added with the architecture commit. The architecture's follow-up list was stale; it is marked done instead (A10).

**A10 — Architecture, Follow-ups Outside This Document:** all three follow-ups are marked done, and the "Ready for" line points to the readiness check.

### 4.5 Stories (`epics.md`)

Every `**Blocked on:**` line naming X-C1 to X-C11 is removed. Story text that read "as the X-Cn fix gives it" is replaced with the decided mechanism.

| Story | Change |
| --- | --- |
| 0.3 | The `yaml` package is in the Toolchain table (A7); the blocked line goes. |
| 0.6 | The `lookdev/` boundary includes `ui/` (A6); the blocked line goes. |
| 1.2 | Compiling writes test levels like any other; the manifest step (`make levels` then `buildManifest`) runs before Vite in `make dev`, `make test` and `make shots` (A2). New AC: `make build` leaves no `test-*` level in `dist/`, and the budget check fails if one is planted there. |
| 1.3 | Loading goes through the `AssetLoader` port (A1): new ACs for `core/loading.ts`, `render/assets/loader.ts` as the only fetcher, progress reported to app state, `parseLevel` failure treated as a failed load, one silent retry, then a stopped load-error state until Epic 6's Retry panel. |
| 2.8, 2.10 | Cite A8: `chooseHeroClip` returns `{ base, overlay }`. |
| 3.2, 3.3 | The Emberwood kit and backdrops carry 3 tiles † of dressing past the level's edges (A4, G1); the critic loop includes a 21:9 and a 4:3 window. |
| 3.15 | The glade hush uses an `AudioFade` region on the ambience bus (A9); the blocked line goes. |
| 4.2 | Arena framing per A4/G1: at 16:9 and wider the camera holds still and the margin shows millhouse dressing. Hurtbox: the body splashes shots; the hub is the only hurtbox (G2). |
| 4.3 | Gap timing from the end of each hazard; millstone landing and spacing per G2; the hub window opens at each gap's start, with unit tests: a hit on the shut hub or the body does no damage; a hit on the open hub does 1. |
| 4.4 | The wheel roll rolls back instead of walking back (G2); the walk-back dodge note goes; phase 2 starts after the current attack ends. |
| 4.7 | Adds `confirmPressed` to `InputFrame` and reads it as the skip (A3). |
| 4.10 | Arena art includes the 3-tile margin (A4) and the hub's open and shut looks. |
| 4.11 | Back to ten clips: no `walk` (X-C11 dropped); `roll` plays both ways; the hub glow is part of the model. |
| 4.14 | Adds a hub-open cue sound and the blocked splash sound (every audio cue has its visual twin: the glow, the splash). |
| 4.15 | Tunes HP † and the window length † with the developer until a first-time player's fight lands in 60 to 120 s; the "win without damage" proof includes the roll back. |
| 5.10, 5.13 | The Drowned Mill and Harrowmere kits carry the 3-tile margin (A4). |
| 5.16 | Level 3's music drop-out uses an `AudioFade` region on the music bus (A9). |

**Epic list:** Epic 0's, Epic 3's and Epic 4's `**Blocked on:**` lines go. **Overview, "Conflicts, gaps and defaults":** X-C1 to X-C11 are marked resolved by this proposal, X-C11 as dropped.

### 4.6 `requirements-inventory.md`

The X-C table gains a Status column: X-C1 to X-C5 and X-C7 to X-C10 "Resolved, sprint-change-proposal-2026-11-13-planning-gaps"; X-C6 "In story 0.14"; X-C11 "Dropped: the warden rolls back". F1 "Already done (CLAUDE.md Settled stack)"; F2 "Already done (gdd.md:937)"; F3 "Done in this pass (4.3)".

## 5. Implementation Handoff

- **Scope:** moderate. Planning documents only; no code exists.
- **Who:** the facilitating agent applies Sections 4.1 to 4.6 in this session, after approval.
- **Success criteria:**
  - every edit in Section 4 is applied word for word
  - no `**Blocked on:** X-C` line remains in `epics.md`
  - a coverage re-check still finds every requirement ID cited by a story
  - the readiness check (`gds-check-implementation-readiness`) is run next
- **Sprint status:** `sprint-status.yaml` doesn't exist yet (checklist 6.4 not applicable); sprint planning creates it from the updated epics.

## 6. Approval and application

- **Approved** by the developer on 2026-11-13 and applied the same day.
- **Section 4.4 changed while applying:** CLAUDE.md already carried both edits, so it is untouched; the architecture's stale follow-up list is marked done instead (A10).
- **Follow-on fixes made while applying, within this proposal's decisions:**
  - The SimEvent union gains `wardenShotBlocked { x, y }` and `wardenHubOpened`, which the hub cues in stories 4.2, 4.3, 4.10 and 4.14 need.
  - `make build` writes the release manifest after the tests, not before: the tests write the development manifest, which would otherwise overwrite it.
  - Phase 2 starts at half health (15 HP while HP is 30 †), so retuning HP in Epic 4 doesn't need a second decision; the warden bar's notch follows (GDD; stories 4.4, 4.5, 4.15).
  - Story 2.9, where `chooseHeroClip` is written, returns `{ base, overlay }` (A8), and the epic headers and a few neighbouring stories (0.13, 5.4, 5.5, 5.7, 6.5, 6.9) are worded to match.
  - The GDD decision log records the warden decisions.

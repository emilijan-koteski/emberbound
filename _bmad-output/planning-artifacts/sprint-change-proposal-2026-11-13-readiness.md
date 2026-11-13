---
title: 'Sprint Change Proposal — implementation readiness gaps'
project: emberbound
date: 2026-11-13
status: approved
mode: batch
trigger: '_bmad-output/planning-artifacts/implementation-readiness-report-2026-11-13.md (NEEDS WORK)'
scope: moderate
artifacts:
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/decision-log.md
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md
  - _bmad-output/project-context.md
---

# Sprint Change Proposal — Emberbound — readiness gaps (2026-11-13)

Paths are relative to the project root. Q-, D- and U-numbers refer to the readiness report's findings (`implementation-readiness-report-2026-11-13.md`, sections Epic Quality Review and UX Alignment).

## 1. Issue Summary

`gds-check-implementation-readiness` (2026-11-13) found every requirement traced and every epic independent, but rated planning **NEEDS WORK**: 15 major issues and 6 small within-epic dependencies, plus drift between the requirements inventory and its sources. The issues that change a settled document, or more than one story, are fixed here:

- **Design gaps in the warden fight (Q2–Q4):** the arena camera couldn't hold still by the stated mechanism (the level edge bounds only the far wall); hub-versus-body precedence, hub reachability and the phase-2 handover were undefined; the piercing shot contradicted the hub rule.
- **Simulation rules left open (Q5, Q6, Q13):** the clear time could keep counting after `levelCompleted`; the tap-jump feel test had no defined input; respawn and pit-return resets were unspecified.
- **Things used but never built (Q7):** `regionEntered` emission, enemy clip tables, warden-level validation, the `AudioAnchor` class, the kit-origin rule.
- **Build and test plumbing (Q1, Q10, Q12):** files with no budget group fail the build; no bundle membership; checks with no way to run them.
- **Missing stop rules (Q9, Q15)** where money, scarce testers or a release are involved; no story chose the audio tools.
- **Content contradiction (Q11):** Elin on intro card 5.
- **Six within-epic dependencies (D1–D6)** and **drift** in `requirements-inventory.md` (8 FR texts, 1 NR text and 20 AR items behind architecture v1.2).

Category: requirements underspecified at planning time, found before any code exists. Evidence: the readiness report, whose Major findings were each re-checked against the source text.

## 2. Impact Analysis

- **Epics:** all seven keep their scope, order and exit criteria. No epic is added or removed. Epic 3's dependency line now points to story 3.15 for the audio tools; Epic 3's exit text adds "3 of 4" (X-B31); Epic 4's scope bullets carry the hub position and the phase-2 handover.
- **Stories:** none added, removed or renumbered. **53 stories change**: 0.2, 0.4, 0.6, 0.8, 0.10, 0.12, 0.14, 1.1, 1.2, 1.3, 1.4, 1.6, 1.14, 1.15, 1.17, 1.18, 1.19, 1.21, 1.22, 1.23, 1.25, 1.26, 2.2, 2.5, 2.8, 3.2, 3.7, 3.8, 3.9, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.17, 3.18, 3.22, 4.2, 4.4, 4.6, 4.10, 4.11, 4.14, 4.15, 5.2, 5.4, 6.10, 6.15, 6.18, 6.19, 6.20, 6.21. The coverage map gains Epic 3 or 4 on four AR rows.
- **Artifacts:** architecture (v1.3: camera, state management, asset management, event system, debug tools, testing, view sync), GDD (camera, piercing shot, damage table, warden weak point and phase 2, dependencies) and its decision log, narrative design (one production-list line), `epics.md`, `requirements-inventory.md`, `project-context.md`. The UX spines don't change here: U1–U3 join X-C6 in story 0.14.
- **Technical:** nothing is built yet, so no code changes and nothing to roll back.
- **Tuned numbers:** none change. Two new budget groups (†) and a flinch time (†) are starting guesses.
- **MVP:** unaffected. Epic 3 gains the audio-tool decision at the start of 3.15, the `regionEntered` rule, enemy clip tables and a dev bypass of the gate.

## 3. Recommended Approach

**Direct adjustment** (checklist 4.1: viable, low effort, low risk). Rollback is not applicable (nothing built). An MVP review is not needed (scope unchanged).

**Developer decisions (2026-11-13):**

1. **Phase 2 starts mid-gap.** Damage lands only while the hub is open, so health reaches half during a gap. The hub shuts at once, the warden flinches (†) and the music shifts, then a full phase-2 gap with its hub window, then a wheel wash. Chosen over letting the current window run out: a clear beat, and "the window opens at the start of each gap" stays true.
2. **Elin stays on intro card 5**, receding with Maldrek. The narrative's script row wins; its production list and story 3.13 are corrected.
3. **Two small budget groups:** level data and manifest 0.25 MB †, interface icons 0.05 MB †; `index.html` counts as code. Planned total about 29.9 MB.
4. **Batch review** of this proposal.

**Decisions made for the developer (veto any):**

| # | Decision | Why |
| --- | --- | --- |
| R1 | Arena camera: `ArenaTrigger` spans the arena's inside; on `arenaEntered` the camera locks to it until a respawn or the level's end | One region does both jobs; no new Tiled class |
| R2 | Hub at the top of the body's front face; it takes the hit when a shot also touches the body; a search test proves it's reachable from the floor and both ledges | Removes an unwinnable reading; the GDD already promises both angles |
| R3 | Piercing shot: 1 damage on the open hub only, splashes off the body and the shut hub | Keeps the hub rule universal |
| R4 | After a respawn or a pit return the camera snaps to Rowan during the fade, and every shot and seed in flight is cleared | Pillar 2 (modern mercy); a glide across the level reads as a bug |
| R5 | The step that emits `levelCompleted` is the World's last; the exit can't trigger while Rowan is dead or fading | Clear time independent of frame timing (NFR4) |
| R6 | Feel test: a tap is jump held for exactly one step (0.75–0.90 tiles); a sub-step press still jumps and peaks no higher | Defines the input without touching a tuned number |
| R7 | Bundles by kind prefix: shared = fonts, icons, sound effects, Emberwood's music, hero, enemies, pickups and markers, story cards; level = level data, kit, backdrops, ambience, Level 2–3 music, warden | The title reuses the Level 1 tune; cards play before any level |
| R8 | **Placeholder `emberwood.tmj` from story 1.3** (a flat strip that passes validation), so release builds always have a startup level; 1.26 replaces it | Without it, `make smoke` fails on a 404 from 1.3 to 1.26. This also resolves D2 more simply than moving 1.11's checks to the dev server |
| R9 | Dev-server Playwright checks live in `tests/e2e/dev/`, run by `make smoke`; look-dev checks live in `tests/e2e/lookdev/`, run by `make shots` | Every check has a runner; no new `make` target |
| R10 | In development builds a debug URL (`level`, `checkpoint`, `shot`) skips the gate, the intro and the loading card's floor; `reducedMotion=1` sets reduced motion before Epic 6 | Epic 1's tests survive Epic 3's gate; the HUD check is possible before Epic 6 |
| R11 | HUD animation choices are a pure, Vitest-tested function of the World's read-only state, the snapshot and the frame's events | No DOM test environment exists |
| R12 | `regionEntered` fires once per entry, again only after Rowan leaves; a respawn or pit return clears it. Built in 3.15, its first consumer | Simulation rule with tests (CLAUDE.md) |
| R13 | A killed enemy's view plays its `death` clip before disposal (View Sync exception) | 3.7's death clip needs it |
| R14 | Recordings store the `WorldParams` they started from, so the no-damage run can start at the door | 4.15 and 5.4 re-record it |
| R15 | Stop rules: image and Tripo spend within budget, then stop and ask; developer approves enemy concepts and views before Tripo credits; audio tools and formats chosen at the start of 3.15; one playtest re-test, then `gds-correct-course` | Money and testers are the scarce inputs |
| R16 | Release: 6.18 and 6.21 re-check licences for in-game credit; a failed butler push stops with nothing public; the developer handles the key; `.env` is git-ignored | CLAUDE.md: never commit secrets |
| R17 | `project-context.md` gains PR30 (no scope growth unless asked) and AR248 (closest pattern, flagged) | The readiness check found them nowhere agents load |
| R18 | Cross-story minors folded in because no single story would catch them: clip-step `CONFIG` keys (2.5, 2.8), the grant-ledge-grab cheat (4.6), "HUD icon style" (Epic 1 header), the Epic 3 exit's "3 of 4", re-recording the no-damage run (4.15, 5.4) | — |

**Corrections to the readiness report:** the three coverage-map "typos" (FR204, FR207, NFR11) are grouped ranges whose "What" column explains the split; no change. D2 is resolved by R8 rather than by moving 1.11's checks.

**Not in this proposal:** story splits (Q8) and story-local minor items go to `gds-create-story`, story by story. U4 (X-C6) stays in story 0.14. The open decisions (image model, tool budgets, who writes the `.tmj` files, reference machines, release measurement) stay with the developer.

**Checklist status:** 1.1–1.3 done (trigger: the readiness report; evidence: its re-checked findings). 2.1–2.5 done (no epic invalidated, added or reordered). 3.1–3.4 done (GDD, narrative, architecture and inventory change; UX deferred to 0.14; no deployment artifacts exist). 4.1 viable, 4.2 and 4.3 not needed, 4.4 direct adjustment. 5.1–5.5 this document. 6.1–6.3 on approval; 6.4 N/A (`sprint-status.yaml` doesn't exist yet); 6.5 below.

## 4. Detailed Change Proposals

**176 edits across 7 documents.** Every OLD text below was checked by script to occur exactly once in its file, and no two edits overlap. A dry run applied all 176 to copies of the files. New text is tagged "(readiness proposal 2026-11-13, Qn/Dn)".

| Document | Edits |
| --- | --- |
| `game-architecture.md` | 16 |
| `gdd.md` | 9 |
| `decision-log.md` | 1 |
| `narrative-design.md` | 1 |
| `epics.md` | 109 |
| `requirements-inventory.md` | 35 |
| `project-context.md` | 5 |

### 4.1 Architecture (`game-architecture.md`)

16 edits, in document order.

**A1** (line 6) — Version bump

OLD:

> version: '1.2'

NEW:

> version: '1.3'

**A6** (line 410) — Q5 results freeze

OLD:

> 12. Statistics: clear time counts only steps outside story moments.

NEW:

> 12. Statistics: clear time counts only steps outside story moments.
>
> **The last step:** the step that emits `levelCompleted` is the World's last. From then on `step()` returns at once, so steps the loop still runs in the same frame change nothing and the clear time is final. The exit can't trigger while Rowan is dead or fading after a pit. (readiness proposal 2026-11-13, Q5)

**A3** (line 450) — Q2: the level edge bounds only the arena's far wall

OLD:

> - **Beyond the level's edges:** the simulation camera stops at the level edges, so in the 19-tile warden arena it holds still with the arena filling the logical view's width. Where

NEW:

> - **Beyond the level's edges:** the simulation camera stops at the level edges. Where

**A4** (line 450) — Q2 arena lock; Q13 respawn snap

OLD:

> past that, the view camera shows plain bands in the level palette's darkest slot.

NEW:

> past that, the view camera shows plain bands in the level palette's darkest slot.
> - **The warden arena:** its door side opens onto the rest of the level, so the level edge alone can't hold the camera. `ArenaTrigger` spans the arena's 19-tile inside; on `arenaEntered` the simulation camera locks to it, centred horizontally, and holds still until Rowan respawns or the level ends. (readiness proposal 2026-11-13, Q2)
> - **Respawns and pit returns:** the camera snaps to Rowan while the screen is faded; it never glides from where he fell. (readiness proposal 2026-11-13, Q13)

**A5** (line 493) — Q2

OLD:

> `ArenaTrigger` (wakes the warden), `Door`

NEW:

> `ArenaTrigger` (spans the arena's inside; entering it wakes the warden and locks the camera), `Door`

**A7** (line 527) — Q10 bundles

OLD:

> A level file that fails `parseLevel` counts as a failed load.

NEW:

> A level file that fails `parseLevel` counts as a failed load.
> - **Bundle membership:** `scripts/buildManifest.ts` assigns each file by its kind prefix. The shared bundle, loaded at boot, holds what is used before a level or in every level: fonts, `icon-` files, every `sfx-` file, Emberwood's music (the title reuses the Level 1 tune), the hero, the three enemies, pickups and markers, and the story cards. Each level's bundle, loaded behind its loading card, holds the compiled level, its kit and backdrops, its ambience, its music (Levels 2 and 3) and, for the Drowned Mill and the test arena, the warden. (readiness proposal 2026-11-13, Q10)

**A8** (line 549) — Q1 budget groups (developer's choice)

OLD:

> | Code, gzipped | 1 MB |

NEW:

> | Code, gzipped: the JavaScript and CSS bundles and `index.html` | 1 MB |
> | Level data: the compiled levels and `manifest.json` | 0.25 MB |
> | Interface icons (`icon-` files) | 0.05 MB |

**A9** (line 551) — Q1

OLD:

> | **Total** | **30 MB or less** (about 29.6 MB planned) |

NEW:

> | **Total** | **30 MB or less** (about 29.9 MB planned) |

**A14** (line 632) — Q12

OLD:

> to start at any spot (they set `params.spawnAt`).

NEW:

> to start at any spot (they set `params.spawnAt`). They also skip the title gate, the intro and the loading card's reading floor.

**F-A15** (line 643) — Q12

OLD:

> | Browser smoke checks | Playwright | `tests/e2e/smoke.spec.ts` | Headless Chromium and Firefox | Boot, the title gate, title, level, pause and the restart confirm; no console errors; a gamepad error doesn't stop the frame loop; refused storage falls back |

NEW:

> | Browser smoke checks | Playwright | `tests/e2e/smoke.spec.ts` | Headless Chromium and Firefox | Boot, the title gate, title, level, pause and the restart confirm; no console errors; a gamepad error doesn't stop the frame loop; refused storage falls back |
> | Development checks | Playwright | `tests/e2e/dev/` | Headless Chromium, against the dev server | Checks that need development tools (the dev handle, URL parameters); `make smoke` runs them after the production-build spec (readiness proposal 2026-11-13, Q12) |

**A13** (line 644) — Q12 look-dev checks

OLD:

> | Screenshots | Playwright | `tests/e2e/shots.spec.ts` | Headless Chromium, against the dev server | The critic loop's spots |

NEW:

> | Screenshots and look-dev checks | Playwright | `tests/e2e/lookdev/`, then `tests/e2e/shots.spec.ts` | Headless Chromium, against the dev server | `make shots` first runs the look-dev checks (fonts, framing, render budgets) and stops on a failure, then captures the critic loop's spots (readiness proposal 2026-11-13, Q12) |

**A10** (line 902) — Q7 regionEntered rule

OLD:

> | { type: 'regionEntered'; regionId: string; kind: RegionKind }

NEW:

> | { type: 'regionEntered'; regionId: string; kind: RegionKind }  // once per entry; again only after Rowan leaves; a respawn or pit return clears it

**A11** (line 941) — Q12 dev bypass

OLD:

> | URL parameters `?level=…&checkpoint=…&form=…` | Development | Start at any spot |

NEW:

> | URL parameters `?level=…&checkpoint=…&form=…`, plus `reducedMotion=1` | Development | Start at any spot. Any of `level`, `checkpoint` or `shot` also skips the title gate, the intro and the loading card's reading floor; audio stays locked until a key press. `reducedMotion=1` sets the snapshot's reduced motion before Epic 6's setting exists. (readiness proposal 2026-11-13, Q12) |

**A12** (line 946) — Q12 perf segments

OLD:

> Records frame times and level load times over a run and shows the median and 99th percentile.

NEW:

> Records frame times and level load times over a run, split into segments at each `checkpointReached` and at `arenaEntered`, and shows the median and 99th percentile for the whole level and for each segment.

**F-A16** (line 1334) — Q7 ripple from 3.7

OLD:

> Views whose entity is gone are disposed and removed.

NEW:

> Views whose entity is gone are disposed and removed, with one exception: a killed enemy's view, told by `enemyKilled`, plays its `death` clip to the end first and never reads the World for it again. (readiness proposal 2026-11-13, Q7)

**A2** (line 1598) — Changelog

OLD:

> spit as an upper-body overlay (Implementation Patterns) and `AudioFade` (Level Data, Audio).

NEW:

> spit as an upper-body overlay (Implementation Patterns) and `AudioFade` (Level Data, Audio).
>
> **v1.3 (2026-11-13):** the sprint change proposal `sprint-change-proposal-2026-11-13-readiness.md` closed gaps the implementation readiness check found: the arena camera lock and the respawn snap (Gameplay Camera, Level Data), the World's last step at `levelCompleted` (State Management), bundle membership and two budget groups (Asset Management), when `regionEntered` fires (Event System), the debug-URL bypass, `reducedMotion=1` and `?perf=1` segments (Debug Tools), and the look-dev checks run by `make shots` (Testing Strategy).

### 4.2 GDD (`gdd.md`)

9 edits, in document order.

**G1** (line 316) — Q2

OLD:

> then plain bands. In the 19-tile warden arena the camera holds still.

NEW:

> then plain bands. Once Rowan enters the 19-tile warden arena, the camera locks to it and holds still until he respawns or the level ends.

**G2** (line 317) — Q13

OLD:

> - Always shows at least 19 × 10.4 tiles in landscape.

NEW:

> - Always shows at least 19 × 10.4 tiles in landscape.
> - After a respawn or a pit return, the camera snaps to Rowan while the screen is faded.

**G3** (line 328) — Q4

OLD:

> Passes through enemies; still stops on solid tiles. 20 s. |

NEW:

> Passes through enemies; still stops on solid tiles. Against the warden it follows the hub rule: it damages only the open hub, once, and splashes off the body and the shut hub. 20 s. |

**G4** (line 351) — Q13

OLD:

> A pit return is not a respawn. |

NEW:

> A pit return is not a respawn. Shots and seeds in flight are cleared. |

**G5** (line 352) — Q13

OLD:

> Collected embers and bells stay collected. |

NEW:

> Collected embers and bells stay collected. Shots and seeds in flight are cleared. |

**G6** (line 409) — Q3 hub position

OLD:

> - **Weak point:** the seal at the wheel's hub, a 1 × 1 tile † target near the top of the body, is the only hurtbox.

NEW:

> - **Weak point:** the seal at the wheel's hub, a 1 × 1 tile † target at the top of the body's front face (the side facing the arena), is the only hurtbox.

**G7** (line 409) — Q3 hub precedence

OLD:

> The open hub can be hit with aim-up from the floor or with straight shots from the ledges.

NEW:

> The open hub can be hit with aim-up from the floor or with straight shots from the ledges. If a shot touches the open hub and the body in the same step, the hub takes the hit.

**G8** (line 430) — Q3 phase 2 (developer's choice)

OLD:

> - **Phase 2** begins at half health (15 HP while HP is 30 †), once the current attack has ended: the warden flinches and the music shifts. It never cuts an attack short.

NEW:

> - **Phase 2** begins the moment health reaches half (15 HP while HP is 30 †). Damage lands only while the hub is open, so this always happens during a gap: the hub shuts at once, the warden flinches (†) and the music shifts, then a full phase-2 gap opens with its hub window, then the first phase-2 attack, a wheel wash. It never cuts an attack short.

**G9** (line 940) — Q9

OLD:

> | Audio tools | Epic 3 | Not chosen. Check licence terms. |

NEW:

> | Audio tools | Epic 3 | Not chosen. The developer chooses them and the audio formats at the start of story 3.15, before any audio asset. Check licence terms. |

### 4.3 GDD decision log (`decision-log.md`)

1 edits, in document order.

**G10** (line 236) — Decision log

OLD:

> and the camera holds still in the 19-tile arena.

NEW:

> and the camera holds still in the 19-tile arena.
>
> ### Update from the readiness check (2026-11-13)
>
> - **Intent: update, through `gds-correct-course`.** Change signal: `implementation-readiness-report-2026-11-13.md` (NEEDS WORK). Proposal: `sprint-change-proposal-2026-11-13-readiness.md`.
> - **Developer decisions:**
>   - **Phase 2 starts mid-gap.** Damage lands only while the hub is open, so health reaches half during a gap. The hub shuts at once, the warden flinches (†) and the music shifts, then a full phase-2 gap with its hub window, then a wheel wash. Chosen over letting the current window run out, because it gives the phase change a clear beat and keeps "the window opens at the start of each gap" true.
>   - **Elin stays on intro card 5**, receding with Maldrek (narrative design).
>   - **Two small budget groups:** level data and manifest 0.25 MB †, interface icons 0.05 MB †; planned total about 29.9 MB (architecture).
> - **Settled without a design choice:**
>   - The arena camera locks to the arena on entry and holds until a respawn or the level's end. The earlier "holds still in the 19-tile arena" relied on the level edge, which bounds only the far wall.
>   - "Phase 2 waits for the current attack to end" could never apply: health drops only during gaps.
>   - The hub sits at the top of the body's front face and takes the hit when a shot also touches the body.
>   - The piercing shot follows the hub rule against the warden.
>   - After a respawn or a pit return the camera snaps to Rowan during the fade, and shots and seeds in flight are cleared.
>   - The audio tools and formats are chosen at the start of story 3.15.

### 4.4 Narrative design (`narrative-design.md`)

1 edits, in document order.

**N1** (line 1051) — Q11 (developer's choice)

OLD:

> Rowan mid-change (5), Elin (3, 4), Maldrek (4, 5)

NEW:

> Rowan mid-change (5), Elin (3, 4, 5), Maldrek (4, 5)

### 4.5 Epics and stories (`epics.md`)

109 edits, in document order.

**F-CM1** (line 371) — Coverage map: Q7 ripple (3.7 builds the enemy clip tables)

OLD:

> | AR75–AR76 | 1, 2 | View sync (1); clip tables (2) |

NEW:

> | AR75–AR76 | 1, 2, 3 | View sync (1); clip tables: the hero's (2), the enemies' (3) |

**F-CM2** (line 372) — Coverage map: 4.2 extends the camera

OLD:

> | AR77–AR78 | 1 | Simulation camera and logical view |

NEW:

> | AR77–AR78 | 1, 4 | Simulation camera and logical view (1); the arena camera lock (4) |

**F-CM3** (line 385) — Coverage map: 4.2 and 4.14 extend the compiler

OLD:

> | AR123–AR131, AR133–AR135 | 1 | Tiled levels and the compiler |

NEW:

> | AR123–AR131, AR133–AR135 | 1, 4 | Tiled levels and the compiler (1); warden-level validation and the `AudioAnchor` class (4) |

**F-CM4** (line 407) — Coverage map: 4.6 adds the cheat

OLD:

> | AR207–AR213 | 1 | Debug tools |

NEW:

> | AR207–AR213 | 1, 4 | Debug tools (1); the grant-ledge-grab cheat (4) |

**F-EL3** (line 501) — Epic list: Q9 ripple

OLD:

> **Depends on:** audio tools chosen and their terms logged.

NEW:

> **Depends on:** the audio tools and formats, chosen by the developer at the start of Story 3.15, with their terms logged.

**S0.2-a** (line 652) — Q1: budget table gains the level data and manifest and interface icons groups; code includes index.html

OLD:

> **Given** the per-asset budgets, starting values † in one table in `scripts/checkBudgets.ts`: hero, both stages, 2 MB; each enemy 0.6 MB; the warden 2 MB; each level kit with its backdrops 3.5 MB; story cards together 1 MB; pickups and markers together 0.5 MB; music and ambience 8.5 MB; sound effects 2 MB; code, gzipped, 1 MB; fonts 0.3 MB

NEW:

> **Given** the per-asset budgets, starting values † in one table in `scripts/checkBudgets.ts`: hero, both stages, 2 MB; each enemy 0.6 MB; the warden 2 MB; each level kit with its backdrops 3.5 MB; story cards together 1 MB; pickups and markers together 0.5 MB; music and ambience 8.5 MB; sound effects 2 MB; code (the JavaScript and CSS bundles plus `index.html`), gzipped, 1 MB; fonts 0.3 MB; level data and manifest 0.25 MB; interface icons 0.05 MB; about 29.9 MB planned in all (readiness proposal 2026-11-13, Q1)

**S0.2-b** (line 654) — Q1: grouping rule covers index.html, level JSON, manifest and icon- files; 'fits no group fails' kept

OLD:

> **Then** it goes by kind prefix or folder: `hero-`; `enemy-`, per enemy; `warden-`; `kit-<level>` together with `backdrops/<level>/`; `card-`; `pickup-` and `marker-`; `music-` and `amb-`; `sfx-`; `fonts/`; and the JavaScript and CSS bundles as code

NEW:

> **Then** it goes by kind prefix or folder: `hero-`; `enemy-`, per enemy; `warden-`; `kit-<level>` together with `backdrops/<level>/`; `card-`; `pickup-` and `marker-`; `music-` and `amb-`; `sfx-`; `fonts/`; `icon-` as interface icons; the compiled `levels/*.json` plus `manifest.json` as level data and manifest; and the JavaScript and CSS bundles plus `index.html` as code (readiness proposal 2026-11-13, Q1)

**S0.2-c** (line 664) — Q1: Vitest list gains the three new grouping cases

OLD:

> **Then** Vitest tests in Node cover: a group exactly at its budget passes, one byte over fails, 1,001 files fail, an asset that fits no group fails, and code is measured gzipped

NEW:

> **Then** Vitest tests in Node cover: a group exactly at its budget passes, one byte over fails, 1,001 files fail, an asset that fits no group fails, code is measured gzipped, `index.html` counts as code, a level JSON and the manifest fall in level data and manifest, and an `icon-` file falls in interface icons (readiness proposal 2026-11-13, Q1)

**S0.2-d** (line 671) — Q1: Note records what counts as code and the two added groups

OLD:

> Note: the architecture gives the budget values but not their home, their unit (this story reads MB as 1,000,000 bytes, the stricter reading) or what counts as code (here the JS and CSS bundles); failing an asset that fits no group is my reading of the kind-prefix naming rule (AR154).

NEW:

> Note: the architecture gives the budget values but not their home, their unit (this story reads MB as 1,000,000 bytes, the stricter reading) or what counts as code (here the JS and CSS bundles plus `index.html`); failing an asset that fits no group is my reading of the kind-prefix naming rule (AR154). The architecture lists no group for level data, the manifest or interface icons; this story adds the two groups as † starting values, which brings the planned total to about 29.9 MB of the 30 MB (readiness proposal 2026-11-13, Q1).

**S0.4-a** (line 733) — Q9: stop rule when the image tool budget runs out

OLD:

> **Then** it is opened and looked at before it is described or kept; one that misses a rule above is regenerated, within the tool budget

NEW:

> **Then** it is opened and looked at before it is described or kept; one that misses a rule above is regenerated, within the tool budget
> **And** if the tool budget runs out before every image meets the rules, the story stops, reports the spend and the rules each image still fails, and the developer decides (readiness proposal 2026-11-13, Q9)

**S0.6-a** (line 825) — Q12: look-dev Playwright checks get a home and a runner (make shots)

OLD:

> **And** the spots are one list in `src/lookdev/` that the spec imports; Epic 1 adds gameplay spots through `src/debug/spots.ts` and `?shot=<spotId>`

NEW:

> **And** the spots are one list in `src/lookdev/` that the spec imports; Epic 1 adds gameplay spots through `src/debug/spots.ts` and `?shot=<spotId>`
> **And** look-dev Playwright checks live in `tests/e2e/lookdev/`; `make shots` runs them against the dev server before it captures, and a failing check stops the run before any shot is taken; Stories 0.8, 0.10 and 0.12 add theirs there (readiness proposal 2026-11-13, Q12)

**S0.6-b** (line 834) — Q14: swatch mismatches with the style guide are expected until 0.14

OLD:

> **Then** each shot is opened and looked at before it is described, the swatches are compared with the token values and `docs/STYLE_GUIDE.md`, the type is checked for legibility at both sizes, and the three biggest problems are written down, most important first, and fixed

NEW:

> **Then** each shot is opened and looked at before it is described, the swatches are compared with the token values and `docs/STYLE_GUIDE.md`, the type is checked for legibility at both sizes, and the three biggest problems are written down, most important first, and fixed
> **And** until Story 0.14 updates DESIGN.md, the swatches show DESIGN.md's provisional greys: differences from `docs/STYLE_GUIDE.md` are expected and listed for 0.14, not fixed, and neither `base.css` nor DESIGN.md is edited to match (readiness proposal 2026-11-13, Q14)

**S0.8-a** (line 895) — Q12: font-request check lives in tests/e2e/lookdev/

OLD:

> **Then** the faces load from the game's own files, and a Playwright check finds no request to any host other than the dev server

NEW:

> **Then** the faces load from the game's own files, and a Playwright check in `tests/e2e/lookdev/` finds no request to any host other than the dev server (readiness proposal 2026-11-13, Q12)

**S0.8-b** (line 905) — Q12: tabular-figures check lives in tests/e2e/lookdev/

OLD:

> **Then** a Playwright check measures both at the same width (tabular figures)

NEW:

> **Then** a Playwright check in `tests/e2e/lookdev/` measures both at the same width (tabular figures; readiness proposal 2026-11-13, Q12)

**S0.10-a** (line 964) — Q12: --tile check lives in tests/e2e/lookdev/

OLD:

> **And** a Playwright check finds that `--tile`, set by `ui/overlay.ts`, equals the on-screen size of one tile on the play plane to within 1 px, at 1920 × 1080 and at 1280 × 720

NEW:

> **And** a Playwright check in `tests/e2e/lookdev/` finds that `--tile`, set by `ui/overlay.ts`, equals the on-screen size of one tile on the play plane to within 1 px, at 1920 × 1080 and at 1280 × 720 (readiness proposal 2026-11-13, Q12)

**S0.12-a** (line 1039) — Q12: render-budget check lives in tests/e2e/lookdev/

OLD:

> **When** a Playwright check reads them

NEW:

> **When** a Playwright check in `tests/e2e/lookdev/` reads them (readiness proposal 2026-11-13, Q12)

**S0.14-a** (line 1127) — U1–U3: UX spine drift folded into 0.14's gds-ux Update

OLD:

> **And** the loading card's replay advance hint gets a visual spec of its own (placement and tokens), since the loading card has no scrim band

NEW:

> **And** the loading card's replay advance hint gets a visual spec of its own (placement and tokens), since the loading card has no scrim band
>
> **Given** the UX spine drift the readiness check found (U1–U3)
> **When** the same Update runs
> **Then** EXPERIENCE.md's `hud-warden-bar` notch marks half health, not "15 of 30 HP"
> **And** EXPERIENCE.md's "Audio has a visual twin" rule adds the hub-open cue with the hub glow, and the blocked splash sound with the splash
> **And** the spines' `gdd.md` line citations are refreshed to the current GDD (readiness proposal 2026-11-13, U1–U3)

**SE1-a** (line 1210) — Minor (Epic 0): Epic 0 records only the HUD icon style, not an icon set

OLD:

> **Depends on:** Epic 0: the scaffold, `core/log.ts`, the ESLint boundary rules, the token CSS pipeline with the Epic 0 colour and type values in DESIGN.md, the basic screenshot harness (`make shots ROUND=n`), the materials, palettes, lighting rigs, stage and view camera, the look-dev page, the HUD icon set, and `CONFIG.view` with any camera margin (X-B35). Tiled 1.12.x, the level editor settled in the architecture.

NEW:

> **Depends on:** Epic 0: the scaffold, `core/log.ts`, the ESLint boundary rules, the token CSS pipeline with the Epic 0 colour and type values in DESIGN.md, the basic screenshot harness (`make shots ROUND=n`), the materials, palettes, lighting rigs, stage and view camera, the look-dev page, the HUD icon style (readiness proposal 2026-11-13, minor concern), and `CONFIG.view` with any camera margin (X-B35). Tiled 1.12.x, the level editor settled in the architecture.

**S1.1-a** (line 1245) — Q13: 'same in Node and browser' points to 1.15's browser-to-Node replay check

OLD:

> **Then** it provides vector helpers, its own `sin` and `cos`, and a small seeded PRNG; `createWorld` seeds `world.rng` from the level id (X-B15), and the same seed gives the same sequence in Node and in the browser (AR45)

NEW:

> **Then** it provides vector helpers, its own `sin` and `cos`, and a small seeded PRNG; `createWorld` seeds `world.rng` from the level id (X-B15), and the same seed gives the same sequence in Node and in the browser (AR45), which Story 1.15's replay in Node of a browser-recorded run checks (readiness proposal 2026-11-13, Q13)

**S1.2-a** (line 1310) — D1: manifest step moves to 1.3, which builds scripts/buildManifest.ts

OLD:

> **Then** test levels compile like any other into `public/assets/levels/` and are available to all three, since each runs the manifest step (`make levels`, then `scripts/buildManifest.ts`) before Vite (AR132; sprint change proposal 2026-11-13, A2)

NEW:

> **Then** test levels compile like any other into `public/assets/levels/` and are available to all three, since each runs `make levels` before Vite; Story 1.3 adds the manifest step after it (AR132; sprint change proposal 2026-11-13, A2; readiness proposal 2026-11-13, D1)

**S1.2-b** (line 1314) — D1: --release manifest clause moves to 1.3; 1.2 keeps the dist/ deletion and planted-file test

OLD:

> **Then** the release manifest (`scripts/buildManifest.ts --release`) leaves them out, and `make build` deletes them from `dist/assets/levels/`, so `dist/` holds no `test-*` level (AR132; sprint change proposal 2026-11-13, A2)

NEW:

> **Then** `make build` deletes them from `dist/assets/levels/`, so `dist/` holds no `test-*` level; the release manifest that leaves them out is Story 1.3's (AR132; sprint change proposal 2026-11-13, A2; readiness proposal 2026-11-13, D1)

**S1.3-a** (line 1330) — D1: 1.3 now delivers the release manifest part of AR132

OLD:

> **Requirements:** AR39, AR57 (`levelHost` creates the `World`), AR100, AR101, AR133, AR144, AR150, AR189, AR201 (the silent retry), AR217, AR236, AR237, X-B17

NEW:

> **Requirements:** AR39, AR57 (`levelHost` creates the `World`), AR100, AR101, AR132 (the release manifest), AR133, AR144, AR150, AR189, AR201 (the silent retry), AR217, AR236, AR237, X-B17

**S1.3-b** (line 1336) — Q10: shared vs level bundle assignment by kind prefix

OLD:

> **Then** `public/assets/manifest.json` lists a shared bundle and one bundle per level, holding that level's data and assets (AR150)

NEW:

> **Then** `public/assets/manifest.json` lists a shared bundle and one bundle per level, holding that level's data and assets (AR150)
> **And** the builder assigns each file to a bundle by its kind prefix: the shared bundle, loaded at boot, holds the fonts, the `icon-` files, every `sfx-` file, Emberwood's music (the title reuses the Level 1 tune), the hero, the three enemies, pickups and markers, and the story cards; a level's bundle, loaded behind its loading card, holds that level's compiled data, kit, backdrops and ambience, its music in Levels 2 and 3, and the warden in the warden's level (readiness proposal 2026-11-13, Q10)
> **And** Vitest tests place a sample file of each kind in its bundle

**S1.3-c** (line 1337) — D1: release manifest clause moved here from 1.2

OLD:

> **And** `make dev`, `make test` and `make shots` always work from a current manifest, since each runs the manifest step before Vite, and Vite copies `public/` unchanged, so the manifest's paths stay valid in `dist/` (sprint change proposal 2026-11-13, A2)

NEW:

> **And** `make dev`, `make test` and `make shots` always work from a current manifest, since each runs the manifest step before Vite, and Vite copies `public/` unchanged, so the manifest's paths stay valid in `dist/` (sprint change proposal 2026-11-13, A2)
> **And** `make build` runs the release manifest step (`scripts/buildManifest.ts --release`) in the place Story 0.2 left for it, and the release manifest leaves out every `test-*` level, which a Vitest test of the builder proves (AR132; readiness proposal 2026-11-13, D1)

**F-S1.3** (line 1359) — D2 via a placeholder level

OLD:

> **And** with no boot screen (Epic 6) or loading card (Epic 3) yet, the page goes straight to the startup level, here `test-movement`

NEW:

> **And** with no boot screen (Epic 6) or loading card (Epic 3) yet, the page goes straight to the startup level, here `test-movement`
> **And** release builds can't start in `test-movement`, which they strip (Story 1.2), so this story also adds `levels/emberwood.tmj` as a placeholder: a flat strip with a `PlayerStart`, 3 checkpoints, 3 bells and an exit, which passes compile validation. Release builds start in it, so `make smoke` (Story 0.1) always has a level to load; Story 1.26 replaces it with grey-box Level 1 (readiness proposal 2026-11-13, D2)

**F-S1.4** (line 1422) — Q12: dev-server specs need a runner

OLD:

> **And** a Playwright check reads `defaultPrevented` on synthetic key events; behaviour inside itch.io's iframe is verified on the Epic 6 upload

NEW:

> **And** a Playwright check reads `defaultPrevented` on synthetic key events; behaviour inside itch.io's iframe is verified on the Epic 6 upload
> **And** Playwright checks that need development tools live in `tests/e2e/dev/`; from this story on, `make smoke` runs them against the dev server after the production-build spec (readiness proposal 2026-11-13, Q12)

**S1.6-a** (line 1512) — Q6: tap defined as held exactly one step; sub-step tap asserted separately

OLD:

> **Then** a full jump peaks at 3.30 ± 0.02 tiles, a tap jump at 0.75 to 0.90 tiles, and a full jump spends 52 ± 1 steps in the air (AR64, X-B1)

NEW:

> **Then** a full jump peaks at 3.30 ± 0.02 tiles, a tap jump (jump pressed and held for exactly one step) at 0.75 to 0.90 tiles, and a full jump spends 52 ± 1 steps in the air (AR64, X-B1)
> **And** a press released within its first step still jumps (FR17): the test asserts Rowan leaves the ground and peaks no higher than the one-step tap; `CONFIG` is never changed to make either test pass (readiness proposal 2026-11-13, Q6)

**S1.14-a** (line 1857) — Q13: 'nothing else resets' names the camera, projectiles and 1.21's weapon return

OLD:

> **And** nothing else in the `World` is reset; the enemy and pickup stories assert that killed enemies stay dead and collected embers and bells stay collected (FR67)

NEW:

> **And** nothing else in the `World` is reset beyond the camera and projectile rules below, with one named exception: weapon pickups return (Story 1.21's rule); the enemy and pickup stories assert that killed enemies stay dead and collected embers and bells stay collected (FR67; readiness proposal 2026-11-13, Q13)

**S1.14-b** (line 1868) — Q13: respawn and pit-return camera snap, projectile clearing, no-stable-ground fallback

OLD:

> **And** Vitest tests show a moving platform and a ledge next to spikes are never recorded, and a one-way ledge is

NEW:

> **And** Vitest tests show a moving platform and a ledge next to spikes are never recorded, and a one-way ledge is
>
> **Given** Rowan respawns at a checkpoint or returns from a pit
> **When** he is placed
> **Then** the camera snaps to him while the screen is faded, with no glide, and every shot in flight is cleared (Story 1.19 clears seeds the same way)
> **And** a pit return before any stable ground has been recorded returns him to the respawn point: the last checkpoint, or the `PlayerStart` (X-B5)
> **And** Vitest tests cover the snap, the cleared shots, the pit return with no stable ground, and that nothing else changes (readiness proposal 2026-11-13, Q13)

**S1.14-c** (line 1872) — Q5: exit can't fire during death or pit fade (placed with the exit it guards)

OLD:

> **Then** `levelCompleted` is emitted once (FR2)

NEW:

> **Then** `levelCompleted` is emitted once (FR2)
> **And** the exit can't trigger while Rowan is dead or fading after a pit, shown by a Vitest test (readiness proposal 2026-11-13, Q5)

**S1.15-a** (line 1904) — Q13: 1.15 now delivers AR45's browser check

OLD:

> **Requirements:** AR30, AR99, AR140, AR207, AR208, AR209, AR210, AR211, X-B16, X-B17

NEW:

> **Requirements:** AR30, AR45 (browser check), AR99, AR140, AR207, AR208, AR209, AR210, AR211, X-B16, X-B17

**F-S1.15a** (line 1930) — Ripple: 4.15 and 5.4 record from the door checkpoint

OLD:

> **When** the developer records a run from level start and saves it to a file

NEW:

> **When** the developer records a run, from level start or from a spot the URL parameters set, and saves it to a file

**F-S1.15b** (line 1931) — Ripple: recordings carry their start

OLD:

> **Then** replaying the file into a fresh `World` reproduces the run step for step, with the same state hash at the end (AR211)

NEW:

> **Then** replaying the file into a fresh `World` reproduces the run step for step, with the same state hash at the end; the file stores the `WorldParams` the run started from, `spawnAt` included (AR211; readiness proposal 2026-11-13, Q13)

**S1.15-b** (line 1932) — Q13: browser determinism check

OLD:

> **And** the file holds the same `InputFrame` stream format the determinism test uses and the jump search will use, with no test-only path in the simulation (AR99, AR140)

NEW:

> **And** the file holds the same `InputFrame` stream format the determinism test uses and the jump search will use, with no test-only path in the simulation (AR99, AR140)
> **And** a run recorded in the browser with the input recorder, saved with its final state hash and replayed in Vitest in Node, ends with the same hash, so the simulation is shown to match in the browser and in Node (AR45; readiness proposal 2026-11-13, Q13)

**S1.17-a** (line 1992) — D3: 1.17 no longer delivers FR72 (the survivor flash); 1.19 already cites it

OLD:

> **Requirements:** FR29, FR63 (blink), FR68, FR69, FR70, FR71, FR72, AR44, AR62 (feedback numbers; clip steps are Epic 2), AR171, AR172, AR173, PB52, UX-DR88, X-B6 (hit-stop)

NEW:

> **Requirements:** FR29, FR63 (blink), FR68, FR69, FR70, FR71, AR44, AR62 (feedback numbers; clip steps are Epic 2), AR171, AR172, AR173, PB52, UX-DR88, X-B6 (hit-stop)

**S1.17-b** (line 2020) — D3: survivor flash moves to 1.19; 'adds trauma 0.4' fixed to 'raises trauma to 0.4'

OLD:

> **Given** a hit an enemy survives, a shot kill, or Rowan's death
> **When** rendering handles the event
> **Then** the surviving enemy flashes briefly on `enemyHit` (FR72); a shot kill plays a short burst from a particle pool seeded so screenshot mode captures it the same every time (FR69); death adds trauma 0.4 to the fade from Story 1.14 (FR71)

NEW:

> **Given** a shot kill, or Rowan's death
> **When** rendering handles the event
> **Then** a shot kill plays a short burst from a particle pool seeded so screenshot mode captures it the same every time (FR69); death raises trauma to 0.4 alongside the fade from Story 1.14 (FR71); the flash of an enemy that survives a hit comes in Story 1.19, with the first such enemy (readiness proposal 2026-11-13, D3)

**S1.18-a** (line 2047) — Q13: 'identical in Node and browser' points to 1.15's check

OLD:

> **And** its path is identical in Node and in the browser, covered by the determinism hash

NEW:

> **And** its path is identical in Node and in the browser, covered by the determinism hash and by Story 1.15's check that a run recorded in the browser replays in Node to the same state hash, run here on `test-enemies` with the flyer (readiness proposal 2026-11-13, Q13)

**S1.19-a** (line 2100) — Q13: seeds cleared on respawn and pit return (seeds arrive after 1.14)

OLD:

> **And** a killed spitter stays dead after Rowan respawns

NEW:

> **And** a killed spitter stays dead after Rowan respawns
> **And** every seed in flight is cleared on a checkpoint respawn and on a pit return, as Story 1.14 clears shots, shown by a Vitest test (readiness proposal 2026-11-13, Q13)

**S1.21-a** (line 2187) — D4: warning-time sign-off moves to 1.22; emission rule stays

OLD:

> **Then** the pickup is a grey-box shape apart from embers and bells, and he signs off the warning time (†)

NEW:

> **Then** the pickup is a grey-box shape apart from embers and bells; the warning time (†) is signed off in Story 1.22, where the bar's blink shows it (readiness proposal 2026-11-13, D4)

**S1.22-a** (line 2218) — D4: weapon-warning sign-off moved here from 1.21

OLD:

> **And** the blink is the visual twin of Epic 3's warning sound (UX-DR87)

NEW:

> **And** the blink is the visual twin of Epic 3's warning sound (UX-DR87)
> **And** on `test-pickups`, the developer signs off the warning time in `CONFIG.weapons` (†) against the blink (readiness proposal 2026-11-13, D4)

**S1.22-b** (line 2228) — Q12: HUD animation choices as a pure, Vitest-tested function; dev URL parameter

OLD:

> **And** with `reducedMotion` set in the snapshot, the last-heart pulse and the icon shake stop and the crack stays (AR174); the setting itself is Epic 6

NEW:

> **And** the HUD's animation choices (pulse, shake, crack, pop, blink) come from a pure function in `ui/` of the World's read-only state (hearts, meter, weapon time), the presentation snapshot and the frame's events, which Vitest tests in Node run with `reducedMotion` off and on: on, the last-heart pulse and the icon shake stop and the crack stays (AR174); the setting itself is Epic 6
> **And** until then, a development-only URL parameter, `reducedMotion=1`, sets the snapshot value for the browser check (readiness proposal 2026-11-13, Q12)

**S1.23-a** (line 2248) — Q5: results freeze replaces 'stops steps, so the clear time is final'

OLD:

> **Then** it enters Results and stops simulation steps, so the clear time is final; the world dims under the scrim and the HUD stays under it; a panel shows the results; the cursor shows (FR2, UX-DR55)

NEW:

> **Then** it enters Results and stops simulation steps; the world dims under the scrim and the HUD stays under it; a panel shows the results; the cursor shows (FR2, UX-DR55)
>
> **Given** the step that emits `levelCompleted`
> **When** later steps run, in the same frame or after
> **Then** that step was the `World`'s last: `step()` returns at once, so they change nothing and the clear time is final (AR87)
> **And** a Vitest test runs a 5-step frame across the exit and finds the clear time, hearts and Rowan's position unchanged after `levelCompleted`, which reaches the app once (readiness proposal 2026-11-13, Q5)

**S1.25-a** (line 2350) — Q13: coverage, metric and cap checks apply to non-test levels only

OLD:

> **And** the developer reviews the † metric values against play on the test levels and signs them off (PR17)

NEW:

> **And** the developer reviews the † metric values against play on the test levels and signs them off (PR17)
>
> **Given** a level whose file name starts with `test-`
> **When** the checks above run
> **Then** every check in this story skips it, as the content rules do (Story 1.2), and the fixtures that prove each check can fail are named without the prefix
> **And** Story 1.24's jump search still runs on its marked jumps (readiness proposal 2026-11-13, Q13)

**F-S1.26** (line 2369) — D2

OLD:

> and the game now starts in Emberwood (AR134)

NEW:

> and the game now starts in Emberwood in every build, replacing Story 1.3's placeholder strip (AR134)

**S2.2-A** (line 2590) — Q9: stop rule for view regeneration in 2.2

OLD:

> **And** any views that disagree with each other (horn shape, scarf side, proportions, claws) are regenerated until the set agrees, and the developer approves the set.

NEW:

> **And** any views that disagree with each other (horn shape, scarf side, proportions, claws) are regenerated until the set agrees, within the tool budget set in Epic 0, and the developer approves the set
> **And** if the budget runs out before the set agrees, the story stops, reports the spend and what still disagrees, and the developer decides (readiness proposal 2026-11-13, Q9).

**S2.5-A** (line 2721) — Minor (E2-3): landClipSteps used before any story adds it

OLD:

> **Given** `CONFIG.feedback.landClipSteps` (starting value `steps(0.15)`, 9 steps †) and the crouch hurtbox height in `CONFIG` (0.6 tiles †, tuned in Epic 1)

NEW:

> **Given** `CONFIG.feedback.landClipSteps`, which this story adds to `CONFIG.feedback` (starting value `steps(0.15)`, 9 steps †; readiness proposal 2026-11-13, minor), and the crouch hurtbox height in `CONFIG` (0.6 tiles †, tuned in Epic 1)

**S2.8-A** (line 2835) — Minor (E2-3): spitClipSteps used before any story adds it

OLD:

> **And** each is timed to `CONFIG.feedback.spitClipSteps` (starting value `steps(0.2)`, 12 steps †) and restarts cleanly from its first frame on the next shot.

NEW:

> **And** each is timed to `CONFIG.feedback.spitClipSteps`, which this story adds to `CONFIG.feedback` (starting value `steps(0.2)`, 12 steps †; readiness proposal 2026-11-13, minor), and restarts cleanly from its first frame on the next shot.

**S3-A** (line 3042) — Q9: no story chose the audio tools; 3.15 now does, so the epic no longer depends on them from outside

OLD:

> **Depends on:** Epic 2 (Rowan stage 1, fully animated, playing the grey-box level); the audio tools the developer chose, with their licence and commercial-use terms logged in `docs/ASSETS.md` (PR26).

NEW:

> **Depends on:** Epic 2 (Rowan stage 1, fully animated, playing the grey-box level). The audio tools and formats are chosen by the developer at the start of Story 3.15, with their licence and commercial-use terms logged in `docs/ASSETS.md` before any audio asset is made (PR26; readiness proposal 2026-11-13, Q9).

**S3-B** (line 3048) — Minor (E2-3): epic exit omitted X-B31's 3 of 4, which 3.21 and 3.22 use

OLD:

> - At least 4 of 5 (or 3 of 3) first-time testers from the primary audience finish Level 1 without help.

NEW:

> - At least 4 of 5 (or 3 of 3, or 3 of 4) first-time testers from the primary audience finish Level 1 without help (X-B31; readiness proposal 2026-11-13, minor).

**S3.2-A** (line 3113) — Q7: kit-origin rule in optimizeModels.ts was assumed but never built

OLD:

> **And** `optimizeModels.ts` accepts the file and still rejects a piece with the wrong scale or origin

NEW:

> **And** this story adds the kit-piece rule to `optimizeModels.ts`, since Story 2.6 checks only characters: a piece is 1 unit = 1 tile, with its origin at the bottom-left of its tile cell; the file passes, and Vitest unit tests under `make test` show a well-formed synthetic piece passing and pieces with the wrong scale or the wrong origin each failing with the matching rule (readiness proposal 2026-11-13, Q7)

**F-S3.7** (line 3325) — Traceability for the Q7 clip-table ACs

OLD:

> **Requirements:** FR73, FR74, FR75, FR76, FR77, FR212, NR85, NR104, NFR35, PB59, PB62, AR145,

NEW:

> **Requirements:** FR73, FR74, FR75, FR76, FR77, FR212, NR85, NR104, NFR35, PB59, PB62, AR75, AR76, AR145,

**S3.7-A** (line 3332) — Q9: no concept approval before spending Tripo credits; no route if Tripo was refused

OLD:

> **And** `make models` produces `enemy-walker.glb`, which `optimizeModels.ts` accepts

NEW:

> **And** `make models` produces `enemy-walker.glb`, which `optimizeModels.ts` accepts
> **And** before any Tripo credit is spent, the developer approves the walker's concept and its four views; the walker takes the route Epic 2 recorded in `docs/ASSETS.md`: Tripo, or the hand-built model if Tripo's terms were refused or Rowan's mesh would not deform (readiness proposal 2026-11-13, Q9)

**S3.7-B** (line 3343) — Q7: enemy clip tables used in 3.7-3.9 but never built (mirrors 2.9)

OLD:

> **And** a kill plays `death` together with Epic 1's arcade burst

NEW:

> **And** a kill plays `death` together with Epic 1's arcade burst
>
> **Given** `render/actors/enemies.ts`
> **When** the enemy clip table is written, as Story 2.9 wrote the hero's (AR75)
> **Then** `EnemyClip` is a string-literal union of AR155's enemy clip names (`move`, `idle`, `swell_fire`, `hurt`, `death`), and a pure clip table per enemy kind maps the enemy's simulation state to its clip; for the walker, patrolling gives `move` and killed gives `death` (readiness proposal 2026-11-13, Q7)
> **And** its Vitest unit tests run in Node, with no WebGL context, under `make test`, and cover every walker state
>
> **Given** walkers in the level
> **When** their views are created and updated (AR76)
> **Then** each walker gets its own skinned clone of the shared model, made as the three.js r187 documentation says for skinned meshes, so walkers animate independently
> **And** every enemy mixer advances on the loop's clamped frame time (0 to 0.25 s), as the hero's does (AR52)
> **And** leaving or reloading a level disposes every enemy view, its mixer and the materials it made; switching levels repeatedly through the dev handle leaves the renderer's geometry and texture counts flat (AR151)
> **And** in screenshot mode each enemy's clip is set to the spot's `animTime` and holds there, so two captures of the same spot match (AR213)
>
> **Given** a walker is killed
> **When** `enemyKilled` arrives for it
> **Then** its model stays where it died until its `death` clip ends, then goes, even once its entity has left the `World`; the view never writes to the simulation

**S3.8-A** (line 3376) — Q9: concept approval before Tripo spend; Epic 2's route

OLD:

> **And** `make models` produces `enemy-thorn-flyer.glb`, which `optimizeModels.ts` accepts

NEW:

> **And** `make models` produces `enemy-thorn-flyer.glb`, which `optimizeModels.ts` accepts
> **And** as for the walker, the developer approves its concept and four views before any Tripo credit is spent, and it takes the route Epic 2 recorded (readiness proposal 2026-11-13, Q9)

**S3.8-B** (line 3385) — Q7: flyer rows in the enemy clip table

OLD:

> **Then** its position comes only from the simulation's path, the `move` clip adds no travel of its own, and a kill plays `death` with Epic 1's burst

NEW:

> **Then** its position comes only from the simulation's path, the `move` clip adds no travel of its own, and a kill plays `death` with Epic 1's burst
> **And** it reuses Story 3.7's enemy clip table and view code, adding the flyer's rows (`move`, and `death` on a kill) with their unit tests (readiness proposal 2026-11-13, Q7)

**S3.9-A** (line 3413) — Q9: concept approval before Tripo spend; Epic 2's route

OLD:

> **And** `make models` produces `enemy-rooted-spitter.glb`, which `optimizeModels.ts` accepts

NEW:

> **And** `make models` produces `enemy-rooted-spitter.glb`, which `optimizeModels.ts` accepts
> **And** as for the walker, the developer approves its concept and four views before any Tripo credit is spent, and it takes the route Epic 2 recorded (readiness proposal 2026-11-13, Q9)

**S3.9-B** (line 3423) — Q7: spitter rows in the enemy clip table

OLD:

> **And** a first hit plays `hurt` with Epic 1's flash, and the second plays `death` with the burst

NEW:

> **And** a first hit plays `hurt` with Epic 1's flash, and the second plays `death` with the burst
> **And** it reuses Story 3.7's enemy clip table and view code, adding the spitter's rows (`idle`, `swell_fire`, `hurt` and `death`) with their unit tests (readiness proposal 2026-11-13, Q7)

**S3.11-A** (line 3533) — Q12: gate and intro break Epic 1's Playwright specs and debug URLs; dev-only bypass

OLD:

> **And** a Playwright smoke check loads the page, sees the gate, presses a key and reaches play

NEW:

> **And** a Playwright smoke check loads the page, sees the gate, presses a key and reaches play
>
> **Given** a development build opened with a debug URL parameter (`level`, `checkpoint` or `shot`)
> **When** the page loads
> **Then** it skips the title gate and goes straight to the level, checkpoint or spot asked for, and Stories 3.12 and 3.14 keep it skipping the loading card's reading floor and the intro; audio stays locked until the first key press or click (readiness proposal 2026-11-13, Q12)
> **And** a release build has no bypass, since the URL parameters are development-only (AR207), and an app test covers a start with and without a parameter
> **And** Epic 1's Playwright specs (Story 1.11's pause checks, Story 1.27's sign swap and `make smoke`) are updated here to pass the gate or use the bypass, and stay green as Stories 3.12 and 3.14 add the loading card and the intro

**S3.12-A** (line 3567) — Q12: the bypass skips the reading floor this story builds

OLD:

> **And** app tests with a fake clock and a fake loader cover both orders: loading finishing before the floor, and after it

NEW:

> **And** app tests with a fake clock and a fake loader cover both orders: loading finishing before the floor, and after it
> **And** under Story 3.11's dev bypass, the card has no reading floor and goes to Playing as soon as loading is done, covered by an app test (readiness proposal 2026-11-13, Q12)

**S3.13-A** (line 3615) — Q10: card assets are needed before any level bundle loads

OLD:

> **And** card 2 reuses the Epic 0 sample card; the shapes come from the source Epic 0 chose, and placeholder silhouettes are acceptable (NR26)

NEW:

> **And** card 2 reuses the Epic 0 sample card; the shapes come from the source Epic 0 chose, and placeholder silhouettes are acceptable (NR26)
> **And** the card shapes are in the shared bundle, loaded at boot with the other shared assets, so the intro shows before any level loads (readiness proposal 2026-11-13, Q10)

**S3.13-B** (line 3625) — Q11: card 5 shows Elin; developer kept her there

OLD:

> **And** Maldrek appears only on cards 4 and 5, and Elin only on cards 3 and 4 (NR78, NR79)

NEW:

> **And** Maldrek appears only on cards 4 and 5, and Elin only on cards 3, 4 and 5, receding with Maldrek on card 5 as the script has it (NR25, NR78, NR79; readiness proposal 2026-11-13, Q11)

**S3.14-A** (line 3660) — Q12: the bypass skips the intro this story builds

OLD:

> **And** in Epic 3 every pass through the gate plays the intro; saving whether it was seen is Epic 6

NEW:

> **And** in Epic 3 every pass through the gate plays the intro; saving whether it was seen is Epic 6
> **And** Story 3.11's dev bypass skips the intro along with the gate, and Epic 1's Playwright specs stay green (readiness proposal 2026-11-13, Q12)

**S3.15-A** (line 3704) — Q9/Q7: 3.15 now chooses the audio tools and builds regionEntered's rule

OLD:

> **Requirements:** FR196, FR198, FR199, FR200, FR202, FR217, NR105, NR108, NR109, AR149, AR193, AR194, AR196, PR26, X-B23
> **Depends on:** the audio tools the developer chose, with their licence and commercial-use terms logged in `docs/ASSETS.md`

NEW:

> **Requirements:** FR196, FR198, FR199, FR200, FR202, FR217, NR105, NR108, NR109, AR68 (`regionEntered`), AR149, AR193, AR194, AR196, PR15 (`regionEntered`), PR26, X-B23
> **Depends on:** the developer's choice of audio tools and formats, made at the start of this story (readiness proposal 2026-11-13, Q9)

**S3.15-B** (line 3709) — Q9: no story chose the audio tools; no stop if their terms forbid commercial use

OLD:

> **Given** the audio tools the developer chose
> **When** this story starts
> **Then** each tool's licence and commercial-use terms are in `docs/ASSETS.md` before any asset is made (PR26)

NEW:

> **Given** the audio tools, which the GDD leaves open until Epic 3
> **When** this story starts
> **Then** the developer chooses the audio tools and their formats, and each tool's licence and commercial-use terms are in `docs/ASSETS.md` before any asset is made (PR26; readiness proposal 2026-11-13, Q9)
> **And** if a tool's terms forbid commercial use, the story stops and the developer decides

**S3.15-C** (line 3722) — Q10: music plays from the gate, before any level bundle loads

OLD:

> **And** the same tune serves as the title tune: it starts when the gate unlocks audio, or on the first key press or click after a gamepad pass, and plays on through the intro and the loading card into Emberwood without restarting (FR198, NR109, X-B23)

NEW:

> **And** the same tune serves as the title tune: it starts when the gate unlocks audio, or on the first key press or click after a gamepad pass, and plays on through the intro and the loading card into Emberwood without restarting (FR198, NR109, X-B23)
> **And** `music-emberwood` is in the manifest's shared bundle, loaded at boot, so it is ready at the gate before Emberwood's own assets load; the architecture says which bundle every other asset kind goes in (readiness proposal 2026-11-13, Q10)

**S3.15-D** (line 3736) — Q7: regionEntered emission is a simulation rule with no story or test

OLD:

> **And** a respawn outside the region restores the bus; the `AudioFade` class (`bus`: `music` or `ambience`, and a target gain) joins the Tiled project and the compiler's checks here, ready for Level 3's music drop-out in story 5.16

NEW:

> **And** a respawn outside the region restores the bus; the `AudioFade` class (`bus`: `music` or `ambience`, and a target gain) joins the Tiled project and the compiler's checks here, ready for Level 3's music drop-out in story 5.16
>
> **Given** the compiled level's regions, which `regionEntered` so far only names in the `SimEvent` union
> **When** the simulation steps
> **Then** it emits `regionEntered { regionId, kind }` once on the step Rowan's box first overlaps a region, and for that region again only after his box has left it; which regions he is inside is kept on the `World`, and a respawn or a pit return clears it, so he re-enters cleanly (AR68; readiness proposal 2026-11-13, Q7)
> **And** Vitest unit tests in Node cover a single entry with no repeat while he stays inside, leaving and re-entering, a respawn inside the region (one new event) and a respawn outside it (none) (PR15)

**S3.16-A** (line 3755) — Q9: audio tools are now chosen in 3.15

OLD:

> **Requirements:** FR203, FR204, NR4, NR63, AR196
> **Depends on:** the audio tools the developer chose, with their licence and commercial-use terms logged in `docs/ASSETS.md`

NEW:

> **Requirements:** FR203, FR204, NR4, NR63, AR196
> **Depends on:** the audio tools and formats chosen in Story 3.15, with their terms logged in `docs/ASSETS.md` (readiness proposal 2026-11-13, Q9)

**S3.17-A** (line 3796) — Q9: audio tools are now chosen in 3.15

OLD:

> **Requirements:** FR54, FR206, FR207, UX-DR87, AR196
> **Depends on:** the audio tools the developer chose, with their licence and commercial-use terms logged in `docs/ASSETS.md`

NEW:

> **Requirements:** FR54, FR206, FR207, UX-DR87, AR196
> **Depends on:** the audio tools and formats chosen in Story 3.15, with their terms logged in `docs/ASSETS.md` (readiness proposal 2026-11-13, Q9)

**S3.18-A** (line 3834) — Q9: audio tools are now chosen in 3.15

OLD:

> **Requirements:** FR120, FR200, FR206, NR3, NR79, NR80, NR108, AR185, UX-DR20, UX-DR39, UX-DR41, UX-DR102
> **Depends on:** the audio tools the developer chose, with their licence and commercial-use terms logged in `docs/ASSETS.md`

NEW:

> **Requirements:** FR120, FR200, FR206, NR3, NR79, NR80, NR108, AR185, UX-DR20, UX-DR39, UX-DR41, UX-DR102
> **Depends on:** the audio tools and formats chosen in Story 3.15, with their terms logged in `docs/ASSETS.md` (readiness proposal 2026-11-13, Q9)

**S3.22-A** (line 4018) — Q9: re-test loop was uncapped

OLD:

> **Then** a new playtest with different first-time players from the primary audience runs as in Story 3.21, until at least 4 of 5 (or 3 of 3, or 3 of 4) finish without help and a majority want to play Level 2 and can say who Rowan is and what he wants (NFR45)

NEW:

> **Then** one new playtest at most, with different first-time players from the primary audience, runs as in Story 3.21, and passes when at least 4 of 5 (or 3 of 3, or 3 of 4) finish without help and a majority want to play Level 2 and can say who Rowan is and what he wants (NFR45)
> **And** if that playtest also misses a threshold, the developer takes it to `gds-correct-course` (readiness proposal 2026-11-13, Q9)

**F-E4a** (line 4037) — Epic 4 scope bullet, Q3

OLD:

> shots on the body or the shut hub splash off (sprint change proposal 2026-11-13, G2)

NEW:

> shots on the body or the shut hub splash off (sprint change proposal 2026-11-13, G2); the hub sits at the top of the body's front face and takes the hit when a shot also touches the body (readiness proposal 2026-11-13, Q3)

**F-E4b** (line 4038) — Epic 4 scope bullet, Q3

OLD:

> phase 2 at half health (15 of 30 HP at the starting values), once the current attack has ended, with a flinch

NEW:

> phase 2 at half health (15 of 30 HP at the starting values), which is always reached during a gap: the hub shuts, the warden flinches, then a full phase-2 gap with its window, then a wheel wash (readiness proposal 2026-11-13, Q3)

**S4.2-a** (line 4117) — Q2, Q7: cite what the new camera-lock and warden-validation ACs deliver

OLD:

> **Requirements:** FR82, FR83, FR84, FR85, FR87, FR88, NR72 (unstompable, 30 HP), AR132 (test arena), X-B10, PR15

NEW:

> **Requirements:** FR82, FR83, FR84, FR85, FR87, FR88, NR72 (unstompable, 30 HP), AR77 (arena camera lock), AR130 (warden-level validation), AR132 (test arena), X-B10, PR15

**S4.2-b** (line 4123) — Q2 decision 1: the trigger spans the arena's inside, so the camera lock has a frame

OLD:

> **Then** the compiled level holds a `PlayerStart`, a triple-shot `WeaponPickup` just before a `Checkpoint` at the arena door, a `Door` region, an `ArenaTrigger` inside the arena and a `Warden` at the arena's right side, all as typed data (this story extends Epic 1's compiler wherever it doesn't emit these classes yet)

NEW:

> **Then** the compiled level holds a `PlayerStart`, a triple-shot `WeaponPickup` just before a `Checkpoint` at the arena door, a `Door` region, an `ArenaTrigger` spanning the arena's whole inside, all 19 tiles (readiness proposal 2026-11-13, Q2), and a `Warden` at the arena's right side, all as typed data (this story extends Epic 1's compiler wherever it doesn't emit these classes yet)

**S4.2-c** (line 4125) — Q7 decision 3: no story built the warden-level validation; Epic 1's exit rule would reject drowned-mill

OLD:

> **And** the warden-level validation runs on it: a checkpoint at the warden's door, and a warden instead of an exit

NEW:

> **And** this story adds the warden-level validation to `scripts/compileLevels.ts`, and it passes on this level: a level with a `Warden` needs exactly one `Warden`, exactly one `Checkpoint` at the warden's door (beside the `Door`, outside the `ArenaTrigger`) and no `Exit`, the warden taking the exit's place; the rule applies to every level with a `Warden`, test levels included, Epic 1's exit rule gives way to it, and in a shipped level the door checkpoint comes on top of Epic 1's 3 checkpoints (AR130; readiness proposal 2026-11-13, Q7)
> **And** level tests compile broken fixtures and expect each failure, with the file and the reason: a warden level with no checkpoint at the door, one with a warden and an exit, and one with two wardens (AR216)

**S4.2-d** (line 4145) — Q3 decision 2: fix where the hub sits on the body

OLD:

> **Given** the warden awake, with its weak point, the seal at the wheel's hub: a hub box of `CONFIG.warden` hub size (starting value 1 × 1 tile †) near the top of the body, its only hurtbox (sprint change proposal 2026-11-13, G2)

NEW:

> **Given** the warden awake, with its weak point, the seal at the wheel's hub: a hub box of `CONFIG.warden` hub size (starting value 1 × 1 tile †) at the top of the body's front face, the side facing the arena (readiness proposal 2026-11-13, Q3), its only hurtbox (sprint change proposal 2026-11-13, G2)

**S4.2-e** (line 4150) — Q3 decision 2: hub-over-body precedence and a reachability search from the floor and each ledge

OLD:

> **And** unit tests cover a single shot and a full volley on the open hub, a volley whose lower shot hits the floor first, and a shot on the body and one on the shut hub, both doing no damage.

NEW:

> **And** when a shot overlaps the open hub and the body in the same step, the hub takes the hit (readiness proposal 2026-11-13, Q3)
> **And** unit tests cover a single shot and a full volley on the open hub, a volley whose lower shot hits the floor first, a shot on the body and one on the shut hub, both doing no damage, and a shot overlapping the open hub and the body in the same step, which hits the hub
> **And** a search test, run like the marked-jump search on the real `step()` and `CONFIG`, proves the open hub can be hit: for Rowan on the floor, aiming up, and on each ledge, shooting straight, some position and input pattern fires a shot inside the hub window that reaches the open hub before the window ends, without Rowan touching the body; it reads the window from `CONFIG.warden`'s hub window (starting value 1.5 s †, which Story 4.3's gaps then drive) and fails naming the surface if any has no such shot, so tuning the body, the hub or the ledges can't make the hub unreachable.

**S4.2-f** (line 4160) — Q2 decision 1: the edge clamp can't hold the arena still (door side opens onto the level); explicit lock and release

OLD:

> **And** since the camera stops at the level's edges, it holds still with the arena filling the logical view's width; at 16:9 and wider, and in a taller 4:3 window, the margin past the arena's edges shows the millhouse's dressing up to 3 tiles †, then plain bands in the palette's darkest slot (placeholder dressing until Story 4.10) (sprint change proposal 2026-11-13, A4, G1)
> **And** a unit test on `sim/camera.ts` asserts the arena stays inside the logical view and the camera doesn't move while Rowan crosses the arena, and screenshots in a 16:9, a 4:3 and a 21:9 window confirm the framing.

NEW:

> **And** on `arenaEntered` the simulation camera in `sim/camera.ts` locks to the `ArenaTrigger`: centred on the arena horizontally, with the arena filling the logical view's width, it holds still until Rowan respawns or the level ends; after a respawn at the door it follows Rowan normally until the next `arenaEntered` locks it again (the seal break's camera move to Rowan is Story 4.12's staging; readiness proposal 2026-11-13, Q2)
> **And** at 16:9 and wider, and in a taller 4:3 window, the margin past the arena's edges shows the millhouse's dressing up to 3 tiles †, then plain bands in the palette's darkest slot (placeholder dressing until Story 4.10) (sprint change proposal 2026-11-13, A4, G1)
> **And** unit tests on `sim/camera.ts` assert the lock: the arena stays inside the logical view and the camera doesn't move while Rowan crosses the arena both ways, on the floor and on both ledges; and its release: after a respawn at the door the camera follows Rowan again, and the next `arenaEntered` locks it again; screenshots in a 16:9, a 4:3 and a 21:9 window confirm the framing.

**S4.4-a** (line 4254) — Q3 decision 4: define the phase-1 to phase-2 handover; replace the unreachable 'crossing while an attack runs' test

OLD:

> **Then** phase 2 starts once, after the current attack, if one is running, has ended: `wardenPhaseChanged{phase: 2}` is emitted and the warden flinches for `CONFIG.warden`'s flinch time (†), during which it starts no attack, and the hub stays open only for what is left of its window (sprint change proposal 2026-11-13, G2)
> **And** phase 2 never cuts an attack short; no two attacks overlap and no hazard comes without its full warning
> **And** unit tests cover the crossing by a single shot and by a volley, the flinch, and a crossing while an attack runs, which waits for that attack's end.

NEW:

> **Then** phase 2 starts once, on that step: the hub shuts at once, cutting its window short, `wardenPhaseChanged{phase: 2}` is emitted (the music shifts on it), and the warden flinches for `CONFIG.warden`'s flinch time (†), with the hub shut and no attack started (readiness proposal 2026-11-13, Q3)
> **And** after the flinch a full phase-2 gap runs (`CONFIG.warden`'s phase-2 gap, starting value 1.8 s †), its hub window opening at its start as in every gap, then the first phase-2 attack, a wheel wash
> **And** phase 2 never starts during an attack: damage lands only on the open hub, which is shut through every warning and hazard, so health can't cross half while an attack runs; phase 2 never cuts an attack short, no two attacks overlap and no hazard comes without its full warning
> **And** unit tests cover the crossing by a single shot and by a volley, the hub shutting on the crossing step, the flinch, and the full phase-2 gap and window before the first wheel wash; a crossing early in a gap; a crossing on the window's last step; a triple-shot volley straddling the crossing, whose shots arriving after the hub shuts splash off with `wardenShotBlocked`; and an invariant test that the warden's health never drops while an attack's warning or hazard runs.

**S4.4-b** (line 4260) — Q3 decision 4: the cycle starts after the flinch and a full phase-2 gap

OLD:

> **Then** they cycle wheel wash, millstone fall, wheel roll, starting with a wheel wash after the flinch

NEW:

> **Then** they cycle wheel wash, millstone fall, wheel roll, starting with a wheel wash after the flinch and the first phase-2 gap (readiness proposal 2026-11-13, Q3)

**S4.4-c** (line 4282) — Q3 decision 4 ripple: the hub is shut through the flinch, so 'a final hit landed during the flinch' is unreachable

OLD:

> **And** unit tests cover the defeat, including a final hit landed during the flinch; this story leaves the seal break, the removal of hazards still in flight and the level's end to Story 4.7.

NEW:

> **And** unit tests cover the defeat, including a final hit on a hub window's last step and a volley with more shots than health left; no hit lands during the flinch, since the hub is shut through it (readiness proposal 2026-11-13, Q3); this story leaves the seal break, the removal of hazards still in flight and the level's end to Story 4.7.

**S4.6-a** (line 4347) — Minor (decision 5): cite the grant-ledge-grab cheat's requirement

OLD:

> **Requirements:** FR102, FR103, FR104, FR105, FR106, FR107, FR108, FR109, FR110, FR111 (`levelForm`), NR59, NR60, NR61, NR111 (ledge-grab lock), AR85, AR132 (ledge-grab room), AR137 (ledge-grab patterns), X-B17, PR15, PR17

NEW:

> **Requirements:** FR102, FR103, FR104, FR105, FR106, FR107, FR108, FR109, FR110, FR111 (`levelForm`), NR59, NR60, NR61, NR111 (ledge-grab lock), AR85, AR132 (ledge-grab room), AR137 (ledge-grab patterns), AR210 (grant ledge grab), X-B17, PR15, PR17

**S4.6-b** (line 4382) — Minor (decision 5): Story 1.15 left the 'grant ledge grab' cheat to Epic 4 and no story built it

OLD:

> **And** the room loads with `?level=test-ledge-grab` and stays out of the release build and the level select.

NEW:

> **And** the room loads with `?level=test-ledge-grab` and stays out of the release build and the level select.
>
> **Given** the cheats Story 1.15 built, in a development build
> **When** the developer uses "grant ledge grab"
> **Then** it calls `sim/debugCommands.ts`, the one way `debug/` may change the `World` (AR210), which sets Rowan's form to `changed`, so he can grab ledges from the next step without a restart
> **And** a unit test shows a beast Rowan failing to catch a ledge, then catching it after the command, and Story 1.15's search of the release bundle still finds none of `debug/` (readiness proposal 2026-11-13, minor).

**S4.10-a** (line 4574) — D5 decision 6: the hub open/shut check needs 4.11's glow; 4.10 keeps the splash check

OLD:

> **Given** the hub's open and shut states (Story 4.3) and a shot that splashes off the body or the shut hub (Story 4.2)
> **When** they replace the placeholders, seen against the millhouse
> **Then** the hub's open look (the glow Story 4.11 builds into the model) and its shut look tell apart at a glance at play distance against the arena behind them, in a cold palette slot, never the warm one (sprint change proposal 2026-11-13, G2; NFR28)
> **And** a blocked shot shows a splash where it struck on `wardenShotBlocked`, plainly different from the hit flash (FR72), so the player sees which shots count.

NEW:

> **Given** a shot that splashes off the body or the shut hub (Story 4.2)
> **When** the splash replaces its placeholder, seen against the millhouse
> **Then** a blocked shot shows a splash where it struck on `wardenShotBlocked`, plainly different from the hit flash (FR72), so the player sees which shots count
> **And** this story leaves the hub's open and shut looks to Story 4.11, which builds the glow into the model and judges it in this arena (readiness proposal 2026-11-13, D5).

**S4.10-b** (line 4579) — D5 decision 6: drop the hub spots and the open-hub check from 4.10's critic loop; 4.11 carries them

OLD:

> **Given** spots for the door open and shut, a wave mid-sweep, a phase-1 and a phase-2 millstone warning, the hub open and shut, a blocked shot, and the arena in a 21:9 and a 4:3 window, added to `src/debug/spots.ts`
> **When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
> **Then** each round compares the shots with `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that the hero, the warden, the open hub, the hazards and the pickups stand out at a glance and that Rowan is the warmest thing on screen

NEW:

> **Given** spots for the door open and shut, a wave mid-sweep, a phase-1 and a phase-2 millstone warning, a blocked shot, and the arena in a 21:9 and a 4:3 window, added to `src/debug/spots.ts` (the hub's spots are Story 4.11's; readiness proposal 2026-11-13, D5)
> **When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
> **Then** each round compares the shots with `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that the hero, the warden, the hazards and the pickups stand out at a glance and that Rowan is the warmest thing on screen

**S4.11-a** (line 4599) — Q3 decision 2 ripple: the model's hub matches the simulation's hub position

OLD:

> **And** it follows the model conventions (feet at the origin, 1 unit = 1 tile, facing +X), its body matches the simulation's contact box (3 × 4 tiles †), its hub the 1 × 1 tile † hurtbox near the top of the body, its curled wheel the roll's 2 × 1.5 tiles †, and its generated materials are replaced by the shared materials and the Drowned Mill palette slots.

NEW:

> **And** it follows the model conventions (feet at the origin, 1 unit = 1 tile, facing +X), its body matches the simulation's contact box (3 × 4 tiles †), its hub the 1 × 1 tile † hurtbox at the top of the body's front face (readiness proposal 2026-11-13, Q3), its curled wheel the roll's 2 × 1.5 tiles †, and its generated materials are replaced by the shared materials and the Drowned Mill palette slots.

**S4.11-b** (line 4604) — D5 decision 6: the hub open/shut check moves here, judged in 4.10's arena

OLD:

> **And** the hub's open glow and its shut look are part of the model, the glow in a cold palette slot, never the warm one, so the weak point reads on the warden itself (sprint change proposal 2026-11-13, G2)

NEW:

> **And** the hub's open glow and its shut look are part of the model, the glow in a cold palette slot, never the warm one, so the weak point reads on the warden itself (sprint change proposal 2026-11-13, G2)
> **And** in the arena Story 4.10 built, the open hub and the shut hub tell apart at a glance at play distance against the millhouse behind them (NFR28; readiness proposal 2026-11-13, D5)

**S4.11-c** (line 4625) — D5 decision 6: carry the open-hub critic check removed from 4.10

OLD:

> **Then** each round compares the shots with the approved concept and `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that the hero, the warden and the hazards stand out at a glance and that nothing on the warden is warm

NEW:

> **Then** each round compares the shots with the approved concept and `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that the hero, the warden, the open hub (readiness proposal 2026-11-13, D5) and the hazards stand out at a glance and that nothing on the warden is warm

**S4.14-a** (line 4723) — Q7 decision 7: cite the `AudioAnchor` class this story now adds

OLD:

> **Requirements:** FR205, FR206 (seal break), FR203 (ledge grab, climb), FR217 (the great wheel's loop), NR38, NR69, AR193 (seal-break cues), AR194 (arena loop), UX-DR87 (warden warnings, hub and splash cues)

NEW:

> **Requirements:** FR205, FR206 (seal break), FR203 (ledge grab, climb), FR217 (the great wheel's loop), NR38, NR69, AR128 (`AudioAnchor` class), AR193 (seal-break cues), AR194 (arena loop), UX-DR87 (warden warnings, hub and splash cues)

**S4.14-b** (line 4745) — Q7 decision 7: no story added `AudioAnchor` to the Tiled project and the compiler

OLD:

> **And** on `storyCueReached` for `wheelStop` the loop ends in a long creak, then silence, and doesn't come back.

NEW:

> **And** on `storyCueReached` for `wheelStop` the loop ends in a long creak, then silence, and doesn't come back
> **And** the `AudioAnchor` class (a region marking the sound's source) joins the Tiled project and the compiler here, compiled as typed data, and a level test compiles a fixture holding one and asserts its compiled data (AR128, AR216; readiness proposal 2026-11-13, Q7).

**S4.15-a** (line 4773) — Q9 decision 8: tester recruiting was unplanned; mirror Story 5.18's line

OLD:

> **Requirements:** NFR46, NFR20, NFR47, NFR48, NFR49, PR11, PR28, UX-DR74 (Tomás's journey), PR14, NFR27

NEW:

> **Requirements:** NFR46, NFR20, NFR47, NFR48, NFR49, PR11, PR28, UX-DR74 (Tomás's journey), PR14, NFR27
> **Depends on:** 3 to 5 first-time players from the primary audience (35–55, arcade-era players), found by the developer

**S4.15-b** (line 4800) — Q9 decision 8: cap re-tests at one round, then gds-correct-course

OLD:

> **Then** he and the agent tune the † numbers, starting with the warden's HP † (starting value 30) and the hub window's length † (starting value 1.5 s), tuned together until a first-time player's fight lands in 60 to 120 s (sprint change proposal 2026-11-13, G2), rerun every affected test, the dodge and hub-window tests included, and repeat the playtest with new first-time testers

NEW:

> **Then** he and the agent tune the † numbers, starting with the warden's HP † (starting value 30) and the hub window's length † (starting value 1.5 s), tuned together until a first-time player's fight lands in 60 to 120 s (sprint change proposal 2026-11-13, G2), rerun every affected test, the dodge, hub-window and hub-reachability tests included, and repeat the playtest once with new first-time testers; if the re-test misses a threshold too, there is no third round: the agent takes it to `gds-correct-course` with the developer (readiness proposal 2026-11-13, Q9)

**S4.15-c** (line 4801) — Q9 decision 8 (and minor list): tuning breaks the recorded no-damage run; re-record and re-pass

OLD:

> **And** every † number changes only with the developer, and the unmarked ones only by his decision; the phase-2 threshold follows HP, at half health.

NEW:

> **And** every † number changes only with the developer, and the unmarked ones only by his decision; the phase-2 threshold follows HP, at half health
> **And** once the fight's † numbers are tuned, the HP † and the hub window † included, the developer re-records the no-damage run of the first criterion above, and its Vitest replay passes again, to `wardenDefeated` with `stats.hitsTaken` at 0 (readiness proposal 2026-11-13, Q9).

**S5.2-a** (line 4931) — Q4 decision 10: 'hits the warden once per shot' contradicted the hub rule

OLD:

> **Then** it stops on the solid tile, passes through one-way ledges and platforms (FR45), destroys the seed and keeps flying, and hits the warden once per shot
> **And** unit tests cover each case

NEW:

> **Then** it stops on the solid tile, passes through one-way ledges and platforms (FR45), and destroys the seed and keeps flying
> **And** against the warden it follows Story 4.2's hub rule and never passes through: on the open hub it does 1 damage and is used up, so it hits once per shot; on the body or the shut hub it splashes off, is used up and emits `wardenShotBlocked` (readiness proposal 2026-11-13, Q4)
> **And** unit tests cover each case, the warden's open hub, shut hub and body included

**S5.2-b** (line 4950) — Q4 decision 10: fix the Note to match the hub rule

OLD:

> Note: The GDD says the piercing shot "passes through enemies" but not how often it hits each one; this story hits each enemy, and the warden, once per shot, and lets the shot fly on after it destroys a seed.

NEW:

> Note: The GDD says the piercing shot "passes through enemies" but not how often it hits each one; this story hits each enemy once per shot and lets the shot fly on after it destroys a seed. Against the warden it follows Story 4.2's hub rule and never passes through (readiness proposal 2026-11-13, Q4).

**S5.4-a** (line 5026) — Minor (decision 9): the RNG seed comes from the level id, so the 4.15 recording breaks once the arena joins Level 2

OLD:

> **And** Epic 4's warden, seal-break and story-safety tests run against `drowned-mill`, spawned at the door checkpoint, and pass

NEW:

> **And** Epic 4's warden, seal-break and story-safety tests run against `drowned-mill`, spawned at the door checkpoint, and pass
> **And** the developer re-records Story 4.15's no-damage run in `drowned-mill`, started at the door checkpoint like these tests, since `world.rng` is seeded from the level id and the millstones fall differently here; it replaces the standalone arena's recording, and its Vitest replay passes again, to `wardenDefeated` with `stats.hitsTaken` at 0 (readiness proposal 2026-11-13, minor)

**S6.10-a** (line 6138) — D6 decision 11: steps 3 and 6 need 6.12 and 6.11; limit the walk as 6.9 does

OLD:

> **And** the developer plays the Ines journey both ways (3 of 3 bells, and the 2 of 3 failure path) on a seeded save and signs off

NEW:

> **And** the developer plays the routing steps of the Ines journey (steps 1–2, 4–5 and 7–8) and its 2 of 3 failure path on a seeded save and signs off; this story leaves the full walk to Story 6.16 (readiness proposal 2026-11-13, D6)

**S6.15-a** (line 6351) — Q12 decision 12: 6.19 had no way to measure the warden fight alone

OLD:

> **Then** `app/perf.ts` records the time of every frame (from the `requestAnimationFrame` timestamps) while the app is playing, story moments included and pause, menus and cards left out

NEW:

> **Then** `app/perf.ts` records the time of every frame (from the `requestAnimationFrame` timestamps) while the app is playing, story moments included and pause, menus and cards left out
> **And** it splits the record into segments, starting a new one at each `checkpointReached` and at each `arenaEntered`, each kept as a start index into the one buffer, so the warden fight and each stretch between checkpoints can be measured on their own; a Vitest test proves the split on a recorded event sequence (readiness proposal 2026-11-13, Q12)

**S6.15-b** (line 6356) — Q12 decision 12: the report shows median and 99th percentile per segment and for the whole level

OLD:

> **Then** `ui/screens/perfReport.ts` shows the level, the frame count, the median and the 99th-percentile frame time in milliseconds, and the load time, in a corner beside the results, built from the shared components and tokens

NEW:

> **Then** `ui/screens/perfReport.ts` shows the level, the frame count, the median and the 99th-percentile frame time in milliseconds for the whole level and for each segment, named by the event that started it (readiness proposal 2026-11-13, Q12), and the load time, in a corner beside the results, built from the shared components and tokens

**S6.18-a** (line 6461) — Q15 decision 13: cite the credit check this story now runs

OLD:

> **Requirements:** UX-DR58 (title ground), UX-DR61, UX-DR111 (the backdrop build)

NEW:

> **Requirements:** UX-DR58 (title ground), UX-DR61, UX-DR111 (the backdrop build), PR32 (credit check)

**S6.18-b** (line 6481) — Q15 decision 13: 6.17's credits decision comes before 6.18 adds backdrop assets

OLD:

> **Then** it is logged in `docs/ASSETS.md` with its tool, licence and AI flag, and `make build`'s budget checks still pass

NEW:

> **Then** it is logged in `docs/ASSETS.md` with its tool, licence and AI flag, and `make build`'s budget checks still pass
> **And** its licence is read for an in-game credit requirement and the answer recorded in `docs/ASSETS.md`; if one exists, this story stops as Story 6.17 does, and the Credits surface goes through `gds-correct-course` before anything more is built (readiness proposal 2026-11-13, Q15)

**S6.19-a** (line 6505) — Q12 decision 12: pass mark per segment and for the whole level

OLD:

> **Then** the median frame time is 16.7 ms or less and the 99th percentile 20 ms or less in each (NFR1, NFR3, AR224)

NEW:

> **Then** the median frame time is 16.7 ms or less and the 99th percentile 20 ms or less in each, for the whole level and for every segment the `?perf=1` report shows (NFR1, NFR3, AR224; readiness proposal 2026-11-13, Q12)

**S6.19-b** (line 6509) — Q12 decision 12: the debug overlay is stripped from the release build this story measures

OLD:

> **When** the starting budgets (†) are measured with the debug overlay and the browser profiler (AR227)

NEW:

> **When** the starting budgets (†) are measured with the browser profiler, and draw calls and triangles are read from the F1 overlay in a development build on the same machine, since the overlay isn't in release builds (AR227; readiness proposal 2026-11-13, Q12)

**S6.19-c** (line 6516) — Q12 decision 12: 'hold 60 fps' had no pass mark per stretch

OLD:

> **Given** the warden fight in the Drowned Mill and the Harrowmere ruins mixed-enemy stretch
> **When** they are recorded the same way
> **Then** they hold 60 fps on each machine and browser (NFR1); a miss is fixed like a Level 1 miss

NEW:

> **Given** the warden fight in the Drowned Mill and Level 3's last stretch, with the Harrowmere ruins mixed-enemy stretch
> **When** full plays of Levels 2 and 3 are recorded the same way
> **Then** each level as a whole and every segment meets the same pass mark, median 16.7 ms or less and 99th percentile 20 ms or less, on each machine and browser, the warden fight's segment (from `arenaEntered`) and Level 3's last segment included (NFR1); a miss is fixed like a Level 1 miss (readiness proposal 2026-11-13, Q12)

**S6.20-a** (line 6557) — Q15 decision 13: 'one to one' read literally would credit every logged asset

OLD:

> **Then** every asset and tool that needs credit appears on the page, matching `docs/ASSETS.md` one to one (NFR44, FR192)

NEW:

> **Then** every asset and tool that needs credit appears on the page, matching one to one the rows of `docs/ASSETS.md` whose licence asks for credit (NFR44, FR192; readiness proposal 2026-11-13, Q15)

**S6.21-a** (line 6582) — Q15 decision 13: cite the credit check this story now runs

OLD:

> **Requirements:** AR152 (final), AR228, AR229, AR230, AR231, NFR5, NFR10, UX-DR95 (embed set up)

NEW:

> **Requirements:** AR152 (final), AR228, AR229, AR230, AR231, NFR5, NFR10, PR32 (credit check), UX-DR95 (embed set up)

**S6.21-b** (line 6591) — Q15 decision 13: butler arrives after 6.17's credits decision

OLD:

> **And** butler and its licence are logged in `docs/ASSETS.md`

NEW:

> **And** butler and its licence are logged in `docs/ASSETS.md`
> **And** its licence is read for an in-game credit requirement and the answer recorded there; if one exists, this story stops as Story 6.17 does (readiness proposal 2026-11-13, Q15)

**S6.21-c** (line 6596) — Q15 decision 13: no path for a failed push

OLD:

> **And** any failed check stops it before the upload

NEW:

> **And** any failed check stops it before the upload
> **And** a failed butler push (network, authentication or a wrong target) stops `make release` with a non-zero exit and a clear message naming the cause, and leaves nothing public (readiness proposal 2026-11-13, Q15)

**S6.21-d** (line 6605) — Q15 decision 13: say who supplies the key; keep .env out of git

OLD:

> **And** `git status` shows no credential file afterwards

NEW:

> **And** `git status` shows no credential file afterwards
> **And** the developer, not the agent, runs `butler login` or sets the API key in an environment variable outside the repository, and `.gitignore` gains `.env` (readiness proposal 2026-11-13, Q15)

### 4.6 Requirements inventory (`requirements-inventory.md`)

35 edits, in document order.

**I0** (line 20) — Inventory drift

OLD:

> - It is an extract, not a new source of truth. When a requirement here and its source disagree, the source wins; fix this file.

NEW:

> - It is an extract, not a new source of truth. When a requirement here and its source disagree, the source wins; fix this file.
> - Refreshed 2026-11-13 by `sprint-change-proposal-2026-11-13-readiness.md`: FR27, FR52, FR64, FR66, FR84–FR86, FR90, FR91, FR93, FR94, NR79 and the AR items changed by architecture v1.2 and v1.3 now match their sources.

**I-FR27** (line 180) — Drift (G1) + Q2, Q13

OLD:

> FR27: The camera stops at the level edges. (gdd.md:316) [epic: E1]

NEW:

> FR27: The camera stops at the level edges. On windows wider or taller than the 19 × 10.4 view, the margin shows the level's dressing up to 3 tiles † past its edges, then plain bands. Once Rowan enters the 19-tile warden arena, the camera locks to it and holds still until he respawns or the level ends. After a respawn or a pit return, it snaps to Rowan while the screen is faded. (gdd.md:316, 318) [epic: E1]

**I-FR52** (line 217) — Q4

OLD:

> passes through enemies; still stops on solid tiles; lasts 20 s. (gdd.md:232, 328)

NEW:

> passes through enemies; still stops on solid tiles; against the warden it follows the hub rule, damaging only the open hub, once, and splashing off the body and the shut hub; lasts 20 s. (gdd.md:232, 329)

**I-FR64** (line 232) — Q13

OLD:

> if it was his last heart, he dies instead. (gdd.md:211, 351) [epic: E1]

NEW:

> if it was his last heart, he dies instead; shots and seeds in flight are cleared. (gdd.md:211, 352) [epic: E1]

**I-FR66** (line 234) — Q13

OLD:

> respawn at the last checkpoint with 3 hearts and 1.0 s of invulnerability. (gdd.md:210, 352, 587) [epic: E1]

NEW:

> respawn at the last checkpoint with 3 hearts and 1.0 s of invulnerability; shots and seeds in flight are cleared. (gdd.md:210, 353, 588) [epic: E1]

**I-FR84** (line 261) — Drift (G2) + Q3

OLD:

> FR84: Warden body is 3 × 4 tiles †, stands at the arena's right side, and its body is its hurtbox. (gdd.md:408) [epic: E4]

NEW:

> FR84: Warden body is 3 × 4 tiles † and stands at the arena's right side; shots that hit the body splash off with a clear blocked cue and do no damage. Weak point: the seal at the wheel's hub, a 1 × 1 tile † target at the top of the body's front face, is the only hurtbox; it glows open for 1.5 s † at the start of each gap between attacks and is shut the rest of the time; a shot at the shut hub splashes off; a shot touching the open hub and the body in the same step hits the hub; the open hub can be hit with aim-up from the floor or straight shots from the ledges. (gdd.md:409-410) [epic: E4]

**I-FR85** (line 262) — Drift (G2)

OLD:

> FR85: Warden health is 30 HP; each ember hit does 1 damage; a triple shot can land 3 hits; the warden can be hit at any time. (gdd.md:409) [epic: E4]

NEW:

> FR85: Warden health is 30 HP †; each ember hit on the open hub does 1 damage; a triple shot can land 3 hits; HP and the hub window are tuned together in Epic 4 so a first-time fight lands in 60 to 120 s. (gdd.md:411) [epic: E4]

**I-FR86** (line 263) — Drift (G2)

OLD:

> has a notch at 15 HP marking phase 2, and empties and fades when the warden falls. (gdd.md:410, 829)

NEW:

> has a notch at half health marking phase 2, and empties and fades when the warden falls. (gdd.md:412, 831)

**I-FR90** (line 267) — Drift (G2)

OLD:

> the rest at least 2 tiles apart; a 3-tile gap is always left clear;

NEW:

> the rest with at least 2 tiles of clear floor between them; a 3-tile gap is always left clear; each lands on the first surface below it, a ledge or the floor, and its shadow marks that surface;

**I-FR91** (line 268) — Drift (G2)

OLD:

> then walks back to its side;

NEW:

> then rolls back to its side (two passes, each jumped the same way);

**I-FR93** (line 270) — Drift (G2)

OLD:

> FR93: Attacks never overlap; the gap before the next attack counts from the end of the previous one: 2.5 s † in phase 1, 1.8 s † in phase 2. (gdd.md:428) [epic: E4]

NEW:

> FR93: Attacks never overlap; the gap before the next attack's warning counts from the end of the previous attack's hazard (the wave leaving the arena, the last millstone landing, the roll back reaching his side): 2.5 s † in phase 1, 1.8 s † in phase 2; the hub window opens at the start of each gap. (gdd.md:430) [epic: E4]

**I-FR94** (line 271) — Drift (G2) + Q3

OLD:

> FR94: Phase 2 begins at 15 HP: the warden flinches and the music shifts. (gdd.md:429, 753) [epic: E4]

NEW:

> FR94: Phase 2 begins the moment health reaches half (15 HP while HP is 30 †), which is always during a gap: the hub shuts at once, the warden flinches (†) and the music shifts, then a full phase-2 gap with its hub window, then a wheel wash; it never cuts an attack short. (gdd.md:431, 755) [epic: E4]

**I-NR79** (line 550) — Q11

OLD:

> Elin appears only on cards: intro cards 3 and 4,

NEW:

> Elin appears only on cards: intro cards 3, 4 and 5,

**I-AR2** (line 801) — Drift (A7)

OLD:

> `@playwright/test` 1.65.x. (ga:208, 211-216) [epic: E0]

NEW:

> `@playwright/test` 1.65.x, `yaml` (dev only, the DESIGN.md token drift test, approved 2026-11-13). (ga:208, 211-217) [epic: E0]

**I-AR31** (line 833) — Drift (A6)

OLD:

> - AR31: `lookdev/` may import `render/`, `content/`, `core/`;

NEW:

> - AR31: `lookdev/` may import `render/`, `ui/` (overlay root, styles, components), `content/`, `core/`;

**I-AR43** (line 848) — Q5

OLD:

> 11 camera; 12 statistics. (ga:396-409)

NEW:

> 11 camera; 12 statistics. The step that emits `levelCompleted` is the World's last: afterwards `step()` returns at once, so the clear time is final. (ga:396-412)

**I-AR68a** (line 882) — Q7

OLD:

> `regionEntered{regionId,kind}`

NEW:

> `regionEntered{regionId,kind}` (once per entry; again only after Rowan leaves; a respawn or pit return clears it)

**I-AR68b** (line 882) — Drift (G2 events)

OLD:

> `wardenHit`, `wardenPhaseChanged{phase:2}`

NEW:

> `wardenHit` (a shot hit the open hub), `wardenShotBlocked{x,y}` (a shot splashed off the body or the shut hub), `wardenHubOpened` (start of a gap), `wardenPhaseChanged{phase:2}`

**I-AR75** (line 892) — Drift (A8)

OLD:

> plus one `choose…Clip` function for short overlays (spit, land) driven by `spitSteps`, `landSteps` and `aim`; spit overlay only in idle/run/jump/fall/crouch; land overlay only in idle.

NEW:

> plus one `choose…Clip` function driven by `spitSteps`, `landSteps` and `aim`. For the hero it returns `{ base, overlay }`: spit clips key only the upper body and play over the base clip (only in idle/run/jump/fall/crouch), and land replaces the idle clip briefly.

**F-I76** (line 893) — Q7 ripple

OLD:

> and disposed when their entity is gone;

NEW:

> and disposed when their entity is gone (a killed enemy's view first plays its `death` clip to the end);

**I-AR78** (line 898) — Drift (A4) + Q2, Q13

OLD:

> extra width is visual only. (ga:96, 447-448, 671-675)

NEW:

> extra width is visual only. Beyond the level's edges the margin shows up to 3 tiles † of the level's dressing, then plain bands; in the warden arena the camera locks to the arena on `arenaEntered` until a respawn or the level's end; after a respawn or a pit return it snaps to Rowan. (ga:96, 447-454, 671-675)

**I-AR80** (line 903) — Drift (A3)

OLD:

> ignored except the skip action (jump or confirm) when

NEW:

> ignored except the skip action (`jumpPressed` or `confirmPressed`) when

**I-AR88** (line 914) — Drift (A3)

OLD:

> `spitPressed`, `spitHeld` (type in `sim/inputFrame.ts`).

NEW:

> `spitPressed`, `spitHeld`, `confirmPressed` (latched from Enter, Space or gamepad south during play; only the story director reads it, as the replay skip) (type in `sim/inputFrame.ts`).

**I-AR126a** (line 961) — Q2

OLD:

> `ArenaTrigger` (wakes the warden), `Door` (tiles made solid when the arena is entered),

NEW:

> `ArenaTrigger` (spans the arena's inside; wakes the warden and locks the camera), `Door` (tiles made solid when the arena is entered),

**I-AR126b** (line 961) — Drift (A9)

OLD:

> `MusicFade` (Level 3), `AudioAnchor` (the great wheel). (ga:491)

NEW:

> `AudioFade` (fades the music or the ambience bus to the region's target gain: Level 3's music drop-out, Emberwood's hushed glade), `AudioAnchor` (the great wheel). (ga:493)

**I-AR128** (line 963) — Drift (A9)

OLD:

> `Door`, `MusicFade`, `AudioAnchor`, `Jump`

NEW:

> `Door`, `AudioFade`, `AudioAnchor`, `Jump`

**I-AR132** (line 967) — Drift (A2)

OLD:

> compile like the others but are left out of the release build and the level select;

NEW:

> compile like the others into `public/assets/levels/`; the release manifest leaves them out, `make build` deletes them from `dist/`, and the budget check fails if one remains; they never appear in the level select;

**I-AR144** (line 985) — Drift (A1) + Q10

OLD:

> - AR144: Shared assets load at boot; each level's assets load behind its level-line card. (ga:349, 522)

NEW:

> - AR144: Shared assets load at boot; each level's assets load behind its level-line card. `core/loading.ts` defines the `AssetLoader` port (`loadShared`, `loadLevel`, progress counted in files), implemented by `render/assets/loader.ts`, the only code that fetches; the app owns loading state, parses the level, retries a failed load once silently, then shows Retry. Bundles by kind prefix: the shared bundle holds fonts, `icon-` files, every `sfx-` file, Emberwood's music, the hero, the enemies, pickups and markers, and the story cards; each level's bundle holds its compiled level, kit and backdrops, ambience, music (Levels 2 and 3) and the warden. (ga:349, 522-528)

**I-AR150** (line 991) — Drift (A2)

OLD:

> - AR150: `public/assets/manifest.json` is generated at build time by `scripts/buildManifest.ts`, with a shared bundle plus one bundle per level;

NEW:

> - AR150: `scripts/buildManifest.ts` writes `public/assets/manifest.json` from the files in `public/assets/`, with a shared bundle plus one bundle per level; it runs before Vite in `make dev`, `make shots`, `make test` and `make build`; development manifests list the test levels, the release manifest leaves them out;

**I-AR152** (line 993) — Q1

OLD:

> code gzipped 1 MB; fonts 0.3 MB; total 30 MB or less (about 29.6 MB planned).

NEW:

> code gzipped (JS and CSS bundles and `index.html`) 1 MB; fonts 0.3 MB; level data (compiled levels and `manifest.json`) 0.25 MB; interface icons 0.05 MB; total 30 MB or less (about 29.9 MB planned).

**I-AR193** (line 1043) — Drift (A9)

OLD:

> in Level 3 music fades out on `regionEntered` for the `MusicFade` region.

NEW:

> on `regionEntered` for an `AudioFade` region its bus (`music` or `ambience`) fades to the region's target gain (Level 3's music to 0, Emberwood's glade ambience lowered), and a respawn outside the region restores the bus.

**I-AR209** (line 1068) — Q12

OLD:

> start at any spot by setting `params.spawnAt`, using level ids.

NEW:

> start at any spot by setting `params.spawnAt`, using level ids. In development builds any of `level`, `checkpoint` or `shot` also skips the title gate, the intro and the loading card's reading floor; `reducedMotion=1` sets the snapshot's reduced motion before Epic 6.

**I-AR214** (line 1073) — Q12

OLD:

> records frame times and level load times over a run and shows median and 99th percentile;

NEW:

> records frame times and level load times over a run, split into segments at each `checkpointReached` and at `arenaEntered`, and shows median and 99th percentile for the level and each segment;

**I-AR219** (line 1081) — Q12

OLD:

> `make shots ROUND=n` saves `shots/round-<n>/<spotId>.png`;

NEW:

> `make shots ROUND=n` first runs the look-dev checks in `tests/e2e/lookdev/` (fonts, framing, render budgets) and stops on a failure, then saves `shots/round-<n>/<spotId>.png`;

**I-AR229** (line 1097) — Drift (A2)

OLD:

> level compile and validation; type checking; tests; Vite build; manifest (`scripts/buildManifest.ts`); budget checks (total 30 MB or less, 1,000 files or fewer, per-asset budgets).

NEW:

> level compile and validation; type checking; tests (which write the development manifest); the release manifest (`scripts/buildManifest.ts --release`, without test levels); Vite build; removing test levels from `dist/assets/levels/`; budget checks (total 30 MB or less, 1,000 files or fewer, per-asset budgets, no test level left in `dist/`).

### 4.7 Project context (`project-context.md`)

5 edits, in document order.

**P1** (line 64) — Q5

OLD:

>   - Rowan can't be hurt during them, and attacks already in flight are cleared.

NEW:

>   - Rowan can't be hurt during them, and attacks already in flight are cleared.
> - **The step that emits `levelCompleted` is the World's last.** `step()` does nothing afterwards, so the clear time is final even when the loop runs more steps that frame.

**P2** (line 89) — Q10

OLD:

>   - Each level loads behind its level-line card, and the previous level is disposed.

NEW:

>   - Shared assets (fonts, icons, sound effects, Emberwood's music, the hero, enemies, pickups and markers, story cards) load at boot; each level's own assets load behind its level-line card, and the previous level is disposed. Bundles are assigned by kind prefix (architecture, Asset Management).

**P3** (line 143) — Q6

OLD:

> - **The feel regression test** (full jump 3.30 tiles, tap jump about 0.8, about 52 steps in the air)

NEW:

> - **The feel regression test** (full jump 3.30 tiles; a tap, jump held for exactly one step, about 0.8; about 52 steps in the air)

**P4** (line 151) — Q12

OLD:

> - **For any visual change:** run the critic loop with `make shots ROUND=n`: at most 3 rounds, then report before and after.

NEW:

> - **For any visual change:** run the critic loop with `make shots ROUND=n`: at most 3 rounds, then report before and after. It runs the look-dev checks in `tests/e2e/lookdev/` first.

**P5** (line 186) — Readiness step 3: 'All' rules not where agents load them

OLD:

> - **Never add a dependency or framework without asking.** No React, Howler, jsdom, tsx and so on. **Never TypeScript 7, never enums.**

NEW:

> - **Never add a dependency or framework without asking.** No React, Howler, jsdom, tsx and so on. **Never TypeScript 7, never enums.**
> - **Never grow scope** unless the developer asks for it (GDD PR30).
> - **When no pattern covers a situation,** follow the closest one and flag it in the story's notes (architecture AR248).

## 5. Implementation Handoff

- **Scope:** moderate. Planning documents only; no code exists.
- **Who:** the facilitating agent applies Section 4 in this session after approval, by script, from the same validated edit set rendered above, so the text applied is the text approved.
- **Success criteria:**
  - every edit in Section 4 applied word for word (the script refuses to apply unless every OLD text matches exactly once)
  - a traceability re-check still finds every requirement ID cited by a story, and no story cites an unknown ID
  - `git diff --stat` touches only the seven documents listed
- **Next:** commit; then `gds-sprint-planning` generates `sprint-status.yaml`; then `gds-create-story` for story 0.1, after the developer chooses the image model and sets the tool budgets.

## 6. Approval and application

- **Approved** by the developer on 2026-11-13 and applied the same day, by script, from the edit set rendered in Section 4.
- **Verified:** all 176 edits applied; each changed file is byte-identical to the dry run; traceability re-check: 782 requirement IDs, every one cited by a story except NR64 and NR116 (deliberately after version one), no unknown IDs, 132 of 132 stories with a Requirements line.
- **Changed while applying:** none. Before approval, the drafted D2 edits (1.11's checks moved to the dev server) were replaced by R8, the placeholder `emberwood.tmj`.

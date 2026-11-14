---
title: "Emberbound (working title) - Epic Breakdown"
gdd: gdd.md
requirements: requirements-inventory.md
ux:
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
created: 2026-11-12
updated: 2026-11-14
stepsCompleted: [1, 2, 3, 4]
status: complete
inputDocuments:
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
  - _bmad-output/project-context.md
  - docs/PROJECT_BRIEF.md
---

# Emberbound (working title) - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Emberbound, decomposing the requirements from the GDD, the narrative design, the UX spines and the game architecture into implementable stories.

**What this file is:**

- The epic and story breakdown behind the epic table in `gdd.md` (Development Epics).
- Each epic comes from one milestone (M0 to M6) in `docs/PROJECT_BRIEF.md`. The GDD's exit criteria for that epic become the epic's acceptance criteria.
- Every requirement, with its source citation, is in `requirements-inventory.md` in this folder. This file keeps an index of the ID ranges, the coverage map and the stories. Stories cite requirement IDs.
- How each system is built belongs to the architecture document. How the overlay looks and behaves belongs to the UX spines: `DESIGN.md` for tokens and components, `EXPERIENCE.md` for surfaces, flows, states and on-screen strings. D-, F-, A-, Q-, M- and DN- numbers refer to that folder's `.decision-log.md`.

**Rules for every epic:**

- An epic starts only when the previous epic's exit criteria are met and the developer approves.
- Every simulation rule gets a unit test.
- After any visual change, the critic loop defined in `gdd.md` (Development Epics) runs.
- Every asset and tool is logged in `docs/ASSETS.md`, including whether the asset is AI-generated.
- Overlay surfaces read the DESIGN.md tokens, never raw values, and follow EXPERIENCE.md for behaviour and strings. EXPERIENCE.md's provisional UI timings are tuned in the epic that builds each surface.
- Every story follows `_bmad-output/project-context.md` and CLAUDE.md. Their conventions (naming, layering, testing, failures, logging) apply to every story without being repeated in its acceptance criteria.

## Requirements Inventory

All requirements, with citations, are in [requirements-inventory.md](requirements-inventory.md). This index lists the ID ranges and groups.

### Functional Requirements

From the GDD (inventory Part 1) and the narrative design (Part 2).

| IDs | Group |
| --- | --- |
| FR1–FR6 | Version-one scope, win and loss |
| FR7 | Simulation timing |
| FR8–FR24 | Movement (feel table, one-way ledges, drop-through, moving and waterwheel platforms, crouch) |
| FR25–FR29 | Camera and screen shake |
| FR30–FR36 | Controls, input, auto-pause, gamepad failure |
| FR37–FR42 | Control signs |
| FR43–FR50 | Ember spit, aiming, stomp, thorn rule |
| FR51–FR57 | Weapon pickups (triple shot, piercing shot) |
| FR58–FR67 | Hitboxes, damage, hearts, knockback, invulnerability, pit rule, death and respawn |
| FR68–FR72 | Hit feedback |
| FR73–FR81 | Enemies: walker, thorn flyer, rooted spitter |
| FR82–FR101 | The warden of the first seal and the seal break |
| FR102–FR112 | Ledge grab, Rowan's form, the replay-form rule |
| FR113–FR124 | Embers, ember meter, bells |
| FR125–FR128 | Checkpoints and pacing |
| FR129–FR144 | Level design rules and metrics |
| FR145–FR155 | Level content: Emberwood, the Drowned Mill, Harrowmere ruins |
| FR156–FR169 | Story delivery |
| FR170–FR184 | Session flow, menus, results |
| FR185–FR187 | Saving |
| FR188–FR193 | Settings and accessibility |
| FR194–FR195 | HUD and interface set |
| FR196–FR207 | Music, ambience and sound effects |
| FR208–FR217 | Art and content assets |
| NR1–NR13 | Story text: global rules |
| NR14–NR18 | Story cards: style and behaviour |
| NR19–NR27 | Intro (all 5 cards, text and images) |
| NR28–NR32 | Level lines on the loading card |
| NR33–NR40 | Seal break: beats and timetable |
| NR41 | Held beat |
| NR42–NR46 | Closing card |
| NR47–NR51 | All-bells card |
| NR52–NR55 | End-of-level order and replay skips |
| NR56–NR64 | Rowan's form and ability per seal |
| NR65–NR76 | The Drowned Miller |
| NR77–NR82 | Maldrek, Elin and others |
| NR83–NR104 | Environmental storytelling per level |
| NR105–NR110 | Audio storytelling, Elin's motif |
| NR111–NR117 | Gating, ending, scope, originality checks |

### NonFunctional Requirements

From the GDD (inventory Part 3).

| IDs | Group |
| --- | --- |
| NFR1–NFR7 | Performance: frame time, reference machine, refresh-rate independence, download, first input, level transitions |
| NFR8–NFR16 | Platform, browser, resilience, itch.io limits, input devices, screen, language |
| NFR17–NFR22 | Fairness and difficulty targets |
| NFR23–NFR25 | Length targets |
| NFR26–NFR34 | Readability and visual rules |
| NFR35–NFR36 | Asset quality |
| NFR37–NFR44 | Originality, legal, licensing, credits |
| NFR45–NFR49 | Success metrics and playtest thresholds |

### Additional Requirements

From the architecture (inventory Part 5), the GDD's process rules (Part 4) and the project brief's retained items (Part 7).

**Starter template:** yes. Epic 0, story 1 scaffolds from Vite's official `vanilla-ts` template into the repository root, adds `mise.toml` and the `Makefile`, then reshapes into the architecture's Project Structure (inventory Part 5, Starter / Scaffold; ga:262-275, 1646).

| IDs | Group |
| --- | --- |
| AR1–AR16 | Toolchain, versions, mise, Makefile, Git LFS, tsconfig |
| AR17–AR37 | Project structure and layer boundaries |
| AR38–AR51 | Simulation core: World, step order, hit-stop, determinism, units, collision |
| AR52–AR57 | Game loop and timing |
| AR58–AR65 | Configuration (`sim/config.ts`, feel regression test, other config homes) |
| AR66–AR69 | Events and commands |
| AR70–AR76 | Entity and state patterns, view sync |
| AR77–AR78 | Gameplay camera and logical view |
| AR79–AR87 | Story director, story cards as app states, replay-form rule, clear time |
| AR88–AR99 | Input |
| AR100–AR113 | App state and session flow |
| AR114–AR122 | Save data and settings |
| AR123–AR135 | Level data and compilation (Tiled) |
| AR136–AR143 | Jump-possibility verification |
| AR144–AR159 | Asset pipeline and budgets |
| AR160–AR179 | Rendering |
| AR180–AR189 | Interface (DOM overlay) |
| AR190–AR196 | Audio |
| AR197–AR202 | Error handling |
| AR203–AR206 | Logging |
| AR207–AR214 | Debug tooling |
| AR215–AR223 | Testing |
| AR224–AR227 | Performance budgets |
| AR228–AR233 | Build and release |
| AR234–AR237 | Platform and browser compatibility |
| AR238–AR248 | Naming and coding conventions (apply to every story) |
| PR1–PR35 | Process: precedence, tuning rules, epic order and exits, critic loop, testing, tool deadlines, playtests |
| PB52, PB59, PB61, PB62 | Brief: stable integrator for visual springs, the asset pipeline steps, kit pieces, mesh quality |

### UX Design Requirements

From EXPERIENCE.md and DESIGN.md (inventory Part 6).

| IDs | Group |
| --- | --- |
| UX-DR1–UX-DR16 | Design tokens: colour roles, warm rule, contrast, HUD backing, type, spacing, `--tile`, radii, icons, elevation, UI timings, motion, value lifecycle |
| UX-DR17–UX-DR39 | The 22 components, one each, and module ownership |
| UX-DR40–UX-DR43 | HUD layout, visibility, legibility check, diegetic UI |
| UX-DR44–UX-DR62 | The 17 surfaces, the wordmark, the depth limit |
| UX-DR63–UX-DR74 | Flows and the four key journeys |
| UX-DR75–UX-DR85 | Input and focus |
| UX-DR86–UX-DR92 | Accessibility |
| UX-DR93–UX-DR99 | Responsive, platform, browser checks |
| UX-DR100–UX-DR103 | Strings and voice |
| UX-DR104–UX-DR107 | Persistence |
| UX-DR108–UX-DR112 | Notes for the architecture (folded into v1.1) and epic-scope notes |

### Conflicts, gaps and defaults

The inventory's first section triages about 120 conflicts and gaps found across the documents:

- **X-A1–X-A13:** settled by precedence or by another document. No action.
- **X-B1–X-B37:** story-level defaults. The first story that hits each one applies the default and cites its ID; the developer can veto at story review.
- **X-C1–X-C11:** resolved by `sprint-change-proposal-2026-11-13-planning-gaps.md` (approved 2026-11-13), except X-C6, which story 0.14 carries, and X-C11, dropped because the warden rolls back.
- **F1–F3:** follow-ups the architecture lists (CLAUDE.md, the GDD Dependencies table, project-context.md), done through their own workflows with the developer's approval.

### FR Coverage Map

Every requirement ID maps to at least one epic. Where an ID spans epics, the first epic builds it and the later ones extend or finish it. "All" means a rule every story follows (through CLAUDE.md and `project-context.md`) rather than something one story builds. Story numbers are added in step 3.

#### Functional requirements (GDD)

| IDs | Epic | What |
| --- | --- | --- |
| FR1 | 5 | Three levels in order, one warden: version one complete |
| FR2 | 1, 4 | Win by exit (Levels 1, 3); win by warden (Level 2) |
| FR3 | 5 | Version one ends with the closing card, then the all-bells card if earned |
| FR4–FR5 | 1 | No game over; respawns counted, never punished |
| FR6 | All | One generous difficulty; no selection exists |
| FR7 | 1 | 60 Hz step, tile units, seconds to steps |
| FR8–FR21 | 1 | Movement feel table, ledges, drop-through, moving platforms |
| FR22 | 5 | Waterwheel platforms |
| FR23–FR24 | 1 | Crouch and the low shot |
| FR25–FR29 | 1 | Camera and screen shake |
| FR30–FR35 | 1 | Bindings, thresholds, auto-pause, gamepad failure |
| FR36 | 6 | Gamepad notice on the pause and title menus |
| FR37–FR42 | 1, 3 | Control signs: placement and device swap (1); icon art (3) |
| FR43–FR51 | 1 | Ember spit, aim, stomp, thorn rule, triple shot |
| FR52 | 5 | Piercing shot |
| FR53, FR55–FR56 | 1 | Weapon swap, kept through pits, lost on death, returned on respawn |
| FR54 | 1, 3 | Weapon timer bar (1, placeholder); final bar and warning sound (3) |
| FR57 | 3, 5 | Weapon pickup placement per level |
| FR58–FR67 | 1 | Hitboxes, spikes, hearts, knockback, invulnerability, pit rule, death and respawn |
| FR68–FR72 | 1 | Hit feedback |
| FR73–FR81 | 1, 3 | Enemy behaviour (1); enemy models and animations (3) |
| FR82–FR98, FR100 | 4 | The warden: arena, health, bar, attacks, phases, warnings, seal break, look |
| FR99 | 5 | After the seal break: results, then the Level 3 loading card |
| FR101 | 5 | Marked grain sacks at the door checkpoint |
| FR102–FR110 | 4 | Ledge grab |
| FR111 | 4, 6 | Replay-form rule: `levelForm` (4); replays from the level select (6) |
| FR112 | 2, 4 | Rowan stage 1 (2); stage 2 (4) |
| FR113–FR117, FR119 | 1 | Embers, ember meter, bells in the level |
| FR118, FR122–FR124 | 3, 5 | Ember and bell placement rules per level |
| FR120 | 3 | Bell toast on the HUD |
| FR121 | 6 | Bells saved as a union across replays; all 9 unlock the card |
| FR125–FR127 | 1 | Checkpoints |
| FR128 | 3, 5 | Sections end calm; the hardest section is last |
| FR129–FR133 | 1 | Platforming metrics, checked by the level tests |
| FR134–FR135 | 1, 5 | Challenge-jump caps and enemy-count caps (1: compile checks; 5: Levels 2, 3) |
| FR136–FR140 | 1, 3, 5 | Teaching pattern and enemy placement rules per level |
| FR141 | 1, 5 | Linear progress; ledge-grab gates in Level 3 |
| FR142 | 5, 6 | Finishing level N unlocks N+1: first-play flow (5); saved unlock (6) |
| FR143 | 1, 3, 5 | Standard level structure |
| FR144 | 5 | Level 2 ends in the arena |
| FR145–FR151 | 1, 3 | Emberwood: grey box (1); final layout and art (3) |
| FR152–FR155 | 5 | The Drowned Mill and Harrowmere ruins |
| FR156 | All | Story text only in the intro, level lines and the two end cards |
| FR157 | 3 | Intro: 5 cards, skippable |
| FR158 | 6 | Intro on the first Continue of a new save |
| FR159 | 3, 5, 6 | Loading card: Level 1 (3); Levels 2, 3 (5); replay skip (6) |
| FR160 | 5 | Held beat |
| FR161 | 4 | Story moments are safe (first story moment) |
| FR162–FR163 | 5 | Closing card; all-bells card |
| FR164–FR166 | 0, 3, 5 | Silhouette cards: sample (0); intro (3); closing and all-bells (5) |
| FR167 | 0 | Card warm-light exception decided |
| FR168–FR169 | 3, 5 | Story text and approved terms |
| FR170, FR172–FR178 | 6 | Boot loading, title menu, Continue, level select, pause menu, confirms, leaving mid-level |
| FR171 | 3 | Title gate |
| FR179 | 5, 6 | End of Levels 1 and 2: first play (5); replay (6) |
| FR180 | 5 | End of Level 3 order |
| FR181 | 1, 6 | Results: basic (1); final (6) |
| FR182 | 6 | "New best" |
| FR183 | 5, 6 | All-bells card timing: first play (5); replays (6) |
| FR184 | 6 | Phone and tablet note |
| FR185–FR187 | 6 | Saving |
| FR188, FR191–FR192 | 6 | Settings, reduced-motion default, Credits rule |
| FR189 | 3 | Mute key and indicator |
| FR190 | 4, 6 | Reduced motion: seal-break fade (4); the setting and its full scope (6) |
| FR193 | 1, 6 | Resize (1); fullscreen toggle (6) |
| FR194 | 1, 3, 4 | HUD: placeholder (1); final with toast and mute (3); warden bar (4) |
| FR195 | 1, 3, 6 | Interface set, built across the epics that need each surface |
| FR196, FR200 | 3, 4, 5 | Level tunes and Elin's motif |
| FR197, FR205, FR213 | 4 | Warden arrangement, warden sounds, warden animations |
| FR198 | 3 | Title gate and title use the Level 1 tune |
| FR199 | 3, 4, 5 | Stingers: end of level (3); seal break (4); closing card (5) |
| FR201 | 5 | Level 3 music fade |
| FR202 | 3, 5 | Ambience beds |
| FR203–FR204, FR206–FR207 | 3, 4 | Hero, enemy, world and interface sounds (3); ledge-grab, climb and seal-break sounds (4) |
| FR208 | 0, 3 | Depth layers (0); dressed in Level 1 (3) |
| FR209 | 3 | Lanterns only in Emberwood |
| FR210 | 0, 2 | Rowan's design: concept (0); model (2) |
| FR211 | 2, 4 | Hero model: stage 1 and 11 base animations (2); stage 2, hang, climb-up (4) |
| FR212 | 3 | Enemy animations |
| FR214 | 3, 5 | Environment kits |
| FR215 | 3, 5 | Pickups and markers (piercing shot in 5) |
| FR216 | 0, 3, 5 | Story card art |
| FR217 | 3, 4, 5 | Music and ambience assets |

#### Narrative requirements

| IDs | Epic | What |
| --- | --- | --- |
| NR1–NR5, NR7–NR13 | 3, 5 | Story-text module and text rules (3); the rest of the text (5) |
| NR6 | 5 | 80-character limit checked on screen |
| NR14–NR15 | 0 | Card style and warm-light exception |
| NR16–NR18 | 3 | Card input, no interaction, Maldrek never warm |
| NR19–NR27 | 3 | Intro: 5 cards, text, images, trigger |
| NR28–NR30 | 3 | Loading card and the Level 1 line |
| NR31–NR32 | 5 | Level 2 and 3 lines |
| NR33–NR40 | 4 | Seal break |
| NR41 | 5 | Held beat |
| NR42–NR49, NR51 | 5 | Closing card; all-bells card |
| NR50 | 6 | All-bells card rewatch from the level select |
| NR52–NR55 | 5, 6 | End-of-level order (5); replay skips (6) |
| NR56–NR58 | 2, 4 | Rowan's look and scarf: stage 1 (2); stage 2 (4) |
| NR59–NR62 | 4 | Ledge grab from the first seal; ability matches body; dimmer glow |
| NR63 | 3 | Rowan's sounds, no words |
| NR64, NR116 | — | Later versions; not built (inventory Part 8) |
| NR65–NR74, NR76 | 4 | The Drowned Miller |
| NR75 | 5 | Marked sacks at the door |
| NR77–NR79, NR81 | 3, 5 | Maldrek, Elin, the Ember Below on cards |
| NR80 | 3, 5 | Bells as Elin's trail |
| NR82 | 3, 5 | The unnamed lord: card 1 (3); the siege-camp banner (5) |
| NR83–NR88 | 3 | Emberwood story props and placement rules |
| NR89–NR98 | 5 | Drowned Mill and Harrowmere story props |
| NR99 | 4 | Harrowmere's mark and the Tithe's sign checked, then drawn |
| NR100–NR104 | 0, 3, 5 | Warmth across the levels, lanterns, dark pits, pickups, recolours: palette rules (0); per level (3, 5) |
| NR105, NR109 | 3 | Emberwood ambience; title uses the Emberwood tune |
| NR106–NR107, NR110 | 5 | Drowned Mill and Harrowmere ambience; Level 3 music drop-out |
| NR108 | 3, 4, 5 | Elin's motif |
| NR111 | 4, 6 | Story locks: ledge grab (4); unlocks and the all-bells card (6) |
| NR112–NR115 | All | Single ending, no branches, no respawn lore, no extras |
| NR117 | 6 | Story-name originality checks |

#### Non-functional requirements

| IDs | Epic | What |
| --- | --- | --- |
| NFR1–NFR3 | 0, 6 | Frame-time budgets: test scene (0); performance pass on real hardware (6) |
| NFR4 | 1 | Refresh-rate independence |
| NFR5 | 0, 6 | Download budget: budget checker in `make build` (0); final (6) |
| NFR6–NFR7 | 6 | First input in 10 s; level transitions in 3 s |
| NFR8 | 1, 6 | Optional features fail safely: wrappers (1); verified on itch.io (6) |
| NFR9–NFR11 | 0, 6 | Stack (0); itch.io build and limits, free release (6) |
| NFR12 | 6 | Browser checks |
| NFR13 | 1 | Keyboard and standard gamepads |
| NFR14 | 0, 1 | Landscape framing of the logical view |
| NFR15 | 6 | Desktop only: device note |
| NFR16 | All | English only |
| NFR17–NFR19 | 1, 3, 5 | Replay limit, checkpoint spacing, respawn targets |
| NFR20 | 4 | Warden fight length (the hub weak point, sprint change proposal 2026-11-13, G2) |
| NFR21 | 1 | Hitboxes favour the player |
| NFR22, NFR24 | 5 | Intensity curve; version one in 20 to 30 minutes |
| NFR23 | 1, 3, 5 | 6 to 8 minutes per level: pace measured (1); per level (3, 5) |
| NFR25 | 3, 4, 5 | Intro, seal-break and held-beat lengths |
| NFR26, NFR29–NFR31 | 3, 5 | Layout teaches; pits dark; hazards contrast; clear aim lines |
| NFR27 | 0–5 | Readable at a glance: every critic-loop round |
| NFR28 | 0, 3, 5 | Warm-light rule: style guide (0); per level (3, 5) |
| NFR32 | 3 | Collectable embers look different from shots |
| NFR33–NFR34 | 0 | The game owns its look; dark-fantasy tone |
| NFR35 | 2, 3, 4 | Clean deformation, hand-built fallback |
| NFR36 | 1, 3 | Art never defines collision; kits snap to the grid |
| NFR37–NFR38, NFR43 | All | Originality and licence logging for every asset and tool |
| NFR39, NFR41–NFR42, NFR44 | 6 | Name and title checks; credits |
| NFR40 | 4 | Symbol checks |
| NFR45 | 3 | MVP playtest thresholds |
| NFR46 | 4 | Warden playtest thresholds |
| NFR47–NFR49 | 3, 4, 5 | Pillar success metrics in each playtest |

#### Process requirements

| IDs | Epic | What |
| --- | --- | --- |
| PR1–PR6, PR29–PR31, PR35 | All | Precedence, tuning rules, pillars, epic order, retrospectives, scope, audience |
| PR7, PR22–PR23, PR25 | 0 | Epic 0 exit; style lock; judged in engine; card style |
| PR24 | 0, 2 | Hero sign-off: concept (0); model (2) |
| PR8, PR18 | 1 | Epic 1 exit; feel first |
| PR9, PR21 | 2 | Epic 2 exit; pipeline proven on Rowan |
| PR10 | 3 | Epic 3 exit |
| PR11 | 4 | Epic 4 exit |
| PR12 | 5 | Epic 5 exit |
| PR13, PR27, PR32 | 6 | Epic 6 exit; reference machines and release measurement decided; Credits question |
| PR14 | 0–5 | Critic loop: harness (0); every visual change after |
| PR15 | 1, 4, 5 | Every simulation rule tested; story-moment safety test |
| PR16, PR20 | 1, 5 | Every jump proven; tile length from the measured pace |
| PR17 | 1, 4 | Metrics verified (1); ledge-grab reach (4) |
| PR19 | 1, 3, 5 | Art dresses a proven grey box |
| PR26 | 0, 2, 3 | Tool deadlines: image model and budgets (0); Tripo (2); audio tools (3) |
| PR28 | 3, 4, 5 | Playtests |
| PR33 | 0 | Per-asset budgets enforced by `make build` |
| PR34 | 4, 6 | Originality-check timing |

#### Architecture requirements

| IDs | Epic | What |
| --- | --- | --- |
| AR1–AR12, AR14–AR16 | 0 | Toolchain, versions, mise, Makefile, Git LFS, tsconfig |
| AR13 | 1 | Tiled pinned or checked |
| AR17–AR37 | 0, All | Folder structure and ESLint boundaries (0); every story stays inside them |
| AR38–AR51 | 1 | World, step order, hit-stop, determinism, units, collision |
| AR52–AR57 | 1 | Frame loop |
| AR58–AR61, AR63–AR65 | 1 | `sim/config.ts`, feel regression test, `levelForm`, config homes |
| AR62 | 1, 2 | Feedback numbers (1); clip overlay steps (2) |
| AR66–AR74 | 1 | Events, commands, entities, pools, state machines |
| AR75–AR76 | 1, 2, 3 | View sync (1); clip tables: the hero's (2), the enemies' (3) |
| AR77–AR78 | 1, 4 | Simulation camera and logical view (1); the arena camera lock (4) |
| AR79–AR83, AR86 | 4, 5 | Story director: seal break (4); held beat (5) |
| AR84 | 0, 3 | Card scene (0 sample); cards as app states (3) |
| AR85 | 4 | Replay-form rule in `createWorld` |
| AR87 | 1 | Clear time |
| AR88–AR95, AR97–AR99 | 1 | Input |
| AR96 | 3 | Card guard |
| AR100–AR101, AR111, AR113 | 1 | App state machine, auto-pause, cursor |
| AR102–AR104 | 3, 6 | App flow: bare gate and loading card (3); full flow (6) |
| AR105–AR106, AR112 | 6 | Pause sub-states, restart and quit, saves |
| AR107 | 1, 4, 5 | Pause during death and pit fade (1), seal break (4), held beat (5) |
| AR108–AR110 | 5, 6 | End-of-level routing |
| AR114–AR122 | 6 | Save data and settings |
| AR123–AR131, AR133–AR135 | 1, 4 | Tiled levels and the compiler (1); warden-level validation and the `AudioAnchor` class (4) |
| AR132 | 1, 4, 5 | Test levels (1); test arena (4); arena joined to Level 2 (5) |
| AR136–AR143 | 1 | Jump-possibility verification |
| AR144, AR150–AR151 | 1 | Shared and per-level loading, manifest, disposal (sprint change proposal 2026-11-13, A1–A2) |
| AR145–AR148, AR153–AR156 | 2, 3 | Model pipeline and conventions (2); kits, pickups, enemies (3) |
| AR149 | 3 | Audio formats |
| AR152 | 0, 6 | Per-asset budgets: checker (0); final (6) |
| AR157–AR158 | 0 | Self-hosted fonts; `docs/ASSETS.md` |
| AR159 | 2 | AI-mesh pipeline and Blender MCP |
| AR160–AR165, AR168–AR170, AR177–AR179 | 0 | Materials, view camera, stage, palettes, lighting, shadows, card scene, look-dev page, renderer, style guide |
| AR166 | 2, 4 | Hero parts; stage 2 toggles |
| AR167 | 3 | Kit instancing and culling |
| AR171–AR175 | 1 | Shake, flash, blink, presentation snapshot |
| AR176 | 1, 3 | Control signs: placement (1); art (3) |
| AR180, AR182–AR186, AR188–AR189 | 1, 3, 6 | DOM overlay: root, tokens, `--tile`, timings (1); more screens (3, 6) |
| AR181 | 1, 6 | Shared components: `menu-item`, `panel`, `scrim` (1); `slider`, `toggle`, `confirm-dialog` (6) |
| AR187 | 3 | Story text module |
| AR190–AR192, AR195–AR196 | 3 | Web Audio, unlock, buses, failure |
| AR193–AR194 | 3, 4, 5 | Music and ambience rules per level |
| AR197–AR200, AR202 | 1 | `Result`, `invariant`, platform wrappers |
| AR201 | 6 | Retry after a failed fetch |
| AR203–AR206 | 0 | `core/log.ts` |
| AR207–AR213 | 1, 4 | Debug tools (1); the grant-ledge-grab cheat (4) |
| AR214 | 6 | `?perf=1` recorder |
| AR215–AR217, AR220–AR221 | 0, 1 | Test tooling (0); simulation, level, app and input tests (1) |
| AR218 | 6 | Browser smoke checks |
| AR219 | 0, 1 | Screenshot harness: look-dev spots (0); gameplay spots through `?shot=` (1) |
| AR222–AR227 | 0, 6 | Performance budgets: test scene (0); performance pass (6) |
| AR228–AR230, AR233 | 0, 6 | Build, budgets, preview (0); release limits (6) |
| AR231–AR232 | 6 | `make release`, private itch.io upload |
| AR234–AR237 | 1, 6 | Platform wrappers (1); browser targets verified (6) |
| AR238–AR248 | All | Naming and coding conventions |

#### UX design requirements

| IDs | Epic | What |
| --- | --- | --- |
| UX-DR1–UX-DR8, UX-DR10, UX-DR16 | 0, 1 | Token values, type, spacing, radii (0); used by the first overlay (1) |
| UX-DR15 | 0, 1, 3 | Token value lifecycle: values (0); first use (1); judged in play on the final HUD (3) |
| UX-DR9, UX-DR12–UX-DR14 | 1 | `--tile`, stacking, UI timings, motion rules |
| UX-DR11 | 0, 3 | HUD icon set |
| UX-DR17–UX-DR19 | 1, 3 | Hearts, ember meter, weapon timer: placeholder (1); final (3) |
| UX-DR20–UX-DR21 | 3 | Bell toast; mute indicator |
| UX-DR22 | 4 | Warden bar |
| UX-DR23–UX-DR25 | 1 | `menu-item`, `panel`, `scrim` (basic results, placeholder pause) |
| UX-DR26–UX-DR28 | 6 | `slider`, `toggle`, `confirm-dialog` |
| UX-DR29 | 1, 6 | `results-stat`: basic (1); stagger and "New best" (6) |
| UX-DR30, UX-DR34–UX-DR37 | 6 | Level-select row, boot bar, notices, error panels, device note |
| UX-DR31 | 0, 3 | `card-text`: placement on the sample card (0); intro (3) |
| UX-DR32 | 3, 6 | `loading-card` (3); replay skip (6) |
| UX-DR33 | 3 | Title-gate prompt |
| UX-DR38 | 1, 3 | Control glyphs: placeholder (1); final set (3) |
| UX-DR39 | 1, 3, 6 | Module ownership as each component lands |
| UX-DR40–UX-DR41, UX-DR43 | 1, 3 | HUD layout, visibility, diegetic UI |
| UX-DR42 | 3 | Heart legibility check |
| UX-DR44–UX-DR45, UX-DR47, UX-DR52–UX-DR54, UX-DR58–UX-DR60, UX-DR62 | 6 | Boot, device note, title menu, pause, settings, confirm, level select, error panels, depth limit |
| UX-DR46, UX-DR48–UX-DR49 | 3 | Bare title gate, intro, loading card |
| UX-DR50 | 1, 3 | Playing states |
| UX-DR51 | 4, 5 | In-level story moments |
| UX-DR55 | 1, 5, 6 | Results surface: basic (1); over the last card (5); final routing (6) |
| UX-DR56–UX-DR57 | 5, 6 | Closing and all-bells cards (5); replay and rewatch (6) |
| UX-DR61 | 0, 6 | Wordmark: provisional (0); after the name check (6) |
| UX-DR63, UX-DR65–UX-DR67, UX-DR71, UX-DR73 | 6 | Boot, replay, rewatch, pause, settings, error flows |
| UX-DR64 | 3, 5, 6 | First-play campaign flow |
| UX-DR68 | 1, 6 | Auto-pause: placeholder pause (1); pause menu (6) |
| UX-DR69 | 1, 4 | Death, respawn and pit HUD flow; warden bar on respawn |
| UX-DR70 | 4 | Warden encounter HUD flow |
| UX-DR72 | 3, 6 | Audio unlock and mute (3); audio notice (6) |
| UX-DR74 | 3, 4, 5, 6 | The four journeys as acceptance scenarios |
| UX-DR75–UX-DR78, UX-DR80–UX-DR84 | 1 | Menu input map, Back, focus, hold-to-repeat, cursor, last device, gamepad, keyboard, mouse |
| UX-DR79 | 3, 6 | Double-press guards: cards (3); results and confirm (6) |
| UX-DR85 | 1, 3 | Pause scope |
| UX-DR86–UX-DR88 | 1, 3 | Colour-independence, audio twins, flash safety |
| UX-DR89 | 3, 4, 6 | Reduced motion: HUD pulse and shake (3); seal-break fade (4); the setting (6) |
| UX-DR90, UX-DR92 | 3, 6 | No timed decisions; no blame |
| UX-DR91 | 0, 6 | Pixel floors (0); native menu buttons (6) |
| UX-DR93 | 1 | Resize and aspect |
| UX-DR94–UX-DR99 | 6 | Browsers, itch.io embed, fullscreen, iframe focus, browser checks |
| UX-DR100–UX-DR103 | 1, 3, 6 | Strings, voice, formats, rejected patterns, as each surface lands |
| UX-DR104–UX-DR107 | 6 | Persistence |
| UX-DR108–UX-DR110 | 1, 6 | Architecture notes, as each module lands |
| UX-DR111 | 0 | Epic 0 scope extension |
| UX-DR112 | 3 | Epic 3 bare gate |

#### Brief retained items

| IDs | Epic | What |
| --- | --- | --- |
| PB52 | 1 | Stable integration for any visual spring |
| PB59, PB62 | 2, 3, 4 | Asset pipeline steps; mesh quality |
| PB61 | 3, 5 | Kit pieces snap to the grid |

## Epic List

Seven epics, one per milestone (M0 to M6), in order. Each delivers something playable or viewable in the browser, ends in an exit criterion the developer approves, and builds only on the epics before it.

### Epic 0: Reference and style lock

The developer can open a look-dev page and a test scene that show the game's chosen look rendered in the engine, with the repository, tooling and overlay tokens in place, so every later asset inherits one look.
**Covers:** FR167, FR208, FR210 (concept), FR216 (sample card); NR14–NR15, NR100–NR104 (palette rules); NFR1–NFR3 and NFR5 (budget checks on the test scene), NFR9, NFR14, NFR27–NFR28, NFR33–NFR34; PR7, PR14, PR22–PR26, PR33; AR1–AR12, AR14–AR37, AR152, AR157–AR158, AR160–AR165, AR168–AR170, AR177–AR179, AR203–AR206, AR215–AR217, AR219, AR222–AR230, AR233; UX-DR1–UX-DR8, UX-DR10–UX-DR11, UX-DR15–UX-DR16, UX-DR31 (placement), UX-DR61, UX-DR91, UX-DR111; X-C6.
**Depends on:** the image model, chosen 2026-11-13 (the Gemini app with Nano Banana Pro, on the developer's Google AI Pro plan), with its terms logged in story 0.4 before the first image; the tool budgets in the GDD's Dependencies table (tools decision 2026-11-13).

### Epic 1: Grey-box core

The developer can play grey-box Level 1 start to finish in the browser, with every base mechanic working and feeling right, on keyboard or gamepad, with a placeholder HUD, a placeholder pause and a basic results screen.
**Covers:** FR2, FR4–FR5, FR7–FR21, FR23–FR35, FR37–FR51, FR53–FR56, FR58–FR81 (behaviour), FR113–FR117, FR119, FR125–FR127, FR129–FR136, FR141, FR143, FR145–FR151 (grey box), FR181 (basic), FR193 (resize), FR194–FR195 (placeholder); NFR4, NFR8, NFR13–NFR14, NFR17–NFR19, NFR21, NFR23 (pace), NFR36; PR8, PR15–PR20; PB52; AR13, AR38–AR78, AR87–AR95, AR97–AR101, AR107, AR111, AR113, AR123–AR144, AR150–AR151, AR171–AR176, AR180–AR186, AR188–AR189, AR197–AR200, AR202, AR207–AR213, AR215–AR221, AR234–AR237; UX-DR9, UX-DR12–UX-DR14, UX-DR17–UX-DR19 (placeholder), UX-DR23–UX-DR25, UX-DR29 (basic), UX-DR38 (placeholder), UX-DR39–UX-DR41, UX-DR43, UX-DR50, UX-DR55 (basic), UX-DR68–UX-DR69, UX-DR75–UX-DR78, UX-DR80–UX-DR88, UX-DR93, UX-DR100–UX-DR103, UX-DR108–UX-DR110; X-B1, X-B4–X-B19, X-B21.

### Epic 2: Hero

The player sees Rowan, stage 1, fully animated and matching his concept, playing the grey-box level; the AI-mesh pipeline is proven on one character before any level art.
**Covers:** FR112 (stage 1), FR210 (model), FR211 (stage 1, 11 animations); NR56–NR58 (stage 1); NFR35; PR9, PR21, PR26 (Tripo); PB59, PB62; AR62 (clip steps), AR75–AR76 (clips), AR145–AR148, AR153–AR156, AR159, AR166.

### Epic 3: Level 1 vertical slice (the MVP)

A first-time player from the primary audience can start at the title gate, watch the intro, play Emberwood start to finish with final art and audio, and come away knowing who Rowan is and wanting to play Level 2.
**Covers:** FR37–FR42 (art), FR54 (final), FR57, FR73–FR81 (models), FR118, FR120, FR122–FR124, FR128, FR136–FR140, FR143, FR145–FR151 (final), FR156–FR157, FR159 (Level 1), FR164–FR166, FR168–FR169, FR171, FR189, FR194 (final), FR196, FR198–FR200, FR202–FR204, FR206–FR209, FR212, FR214–FR217; NR1–NR5, NR7–NR13, NR16–NR30, NR63, NR77–NR88, NR100–NR105, NR108–NR109; NFR17–NFR19, NFR23, NFR25–NFR32, NFR35–NFR36, NFR45, NFR47–NFR49; PR10, PR19, PR26 (audio tools), PR28; PB59, PB61–PB62; AR84, AR96, AR102–AR104, AR145–AR149, AR153–AR156, AR167, AR176, AR187, AR190–AR196; UX-DR11, UX-DR17–UX-DR21 (final), UX-DR31–UX-DR33, UX-DR38, UX-DR40–UX-DR43, UX-DR46, UX-DR48–UX-DR50, UX-DR64, UX-DR72, UX-DR74, UX-DR79, UX-DR85–UX-DR90, UX-DR92, UX-DR100–UX-DR103, UX-DR112; X-B2, X-B23–X-B24, X-B27–X-B29, X-B31–X-B32.
**Depends on:** the audio tools and formats, chosen by the developer at the start of Story 3.15, with their terms logged.

### Epic 4: First warden

The player can fight the Drowned Miller in his arena, win, and watch the seal break change Rowan's body and hand him ledge grab.
**Covers:** FR2 (warden win), FR82–FR98, FR100, FR102–FR111, FR112 (stage 2), FR161, FR190 (seal-break fade), FR194 (warden bar), FR196–FR197, FR199–FR200, FR203, FR205–FR206, FR211 (stage 2, hang, climb-up), FR213, FR217; NR33–NR40, NR56–NR62, NR65–NR74, NR76, NR99, NR108, NR111; NFR20, NFR25, NFR35, NFR40, NFR46–NFR49; PR11, PR15, PR17, PR28, PR34; AR79–AR83, AR85–AR86, AR107, AR132, AR166, AR193; UX-DR22, UX-DR51, UX-DR69–UX-DR70, UX-DR74, UX-DR89; X-B10, X-B17.

### Epic 5: Levels 2 and 3

A new player can play version one from start to finish, the Drowned Mill into the warden, then Harrowmere ruins to the fallen fire bell, the closing card and the all-bells card, in 20 to 30 minutes.
**Covers:** FR1, FR3, FR22, FR52, FR57, FR99, FR101, FR118, FR122–FR124, FR128, FR134–FR144, FR152–FR155, FR159 (Levels 2, 3), FR160, FR162–FR166, FR168–FR169, FR179–FR180, FR183, FR196, FR199–FR202, FR214–FR217; NR6, NR31–NR32, NR41–NR49, NR51–NR55, NR75, NR77–NR82, NR89–NR98, NR100–NR104, NR106–NR108, NR110; NFR17–NFR19, NFR22–NFR26, NFR28–NFR31, NFR47–NFR49; PR12, PR16, PR19–PR20, PR28; PB61; AR79–AR83, AR86, AR107–AR110, AR132, AR193–AR194; UX-DR51, UX-DR55–UX-DR57, UX-DR64, UX-DR74; X-B2, X-B9, X-B23, X-B29.

### Epic 6: Wrap and release

A player on itch.io gets the whole session: boot, title menu with Continue, level select with replays and the all-bells row, pause with restart and quit, settings, saving that survives a reload, safe failure everywhere, and the game live under its final title.
**Covers:** FR36, FR111 (replays), FR121, FR142, FR158–FR159 (replay skip), FR170, FR172–FR179, FR181–FR188, FR190–FR193; NR50, NR52–NR55 (replays), NR111, NR117; NFR1–NFR3, NFR5–NFR12, NFR15, NFR39, NFR41–NFR42, NFR44; PR13, PR27, PR32, PR34; AR102–AR106, AR108–AR110, AR112, AR114–AR122, AR152, AR201, AR214, AR218, AR222–AR232, AR234–AR237; UX-DR26–UX-DR30, UX-DR32 (replay skip), UX-DR34–UX-DR37, UX-DR44–UX-DR45, UX-DR47, UX-DR52–UX-DR62, UX-DR63–UX-DR68, UX-DR71–UX-DR74, UX-DR79, UX-DR89–UX-DR92, UX-DR94–UX-DR99, UX-DR104–UX-DR107; X-B2–X-B3, X-B20, X-B22, X-B24–X-B26, X-B30.
**Depends on:** the final title; the reference machines named; the release-measurement decision (PR27).

---

## Epic 0: Reference and style lock

The developer can open a look-dev page and a test scene that show the game's chosen look rendered in the engine, with the repository, tooling and overlay tokens in place, so every later asset inherits one look.

**In scope:**

- Repository scaffold on the settled stack and the architecture's toolchain: `mise.toml`, the `Makefile`, the Vite `vanilla-ts` template, TypeScript (strict, with the DOM-free `src/sim/tsconfig.json`), ESLint with the layer boundaries, Prettier, Vitest, Playwright, `.gitattributes` for Git LFS, `core/log.ts` and `README.md`.
- The budget checker in `make build`: the 30 MB total, itch.io's file limits and the per-asset budgets. The manifest step joins `make build` in Epic 1.
- The DESIGN.md tokens as `--{group}-{name}` CSS custom properties, with a test that keeps them in step with DESIGN.md and a contrast check.
- **Reference art:** the hero design sheet and Emberwood key art, in each candidate style (dark fantasy, comic, mix), from the reference prompts in `docs/PROJECT_BRIEF.md` §5. The agent adapts the prompts; the developer runs them in the Gemini app and saves the images; the agent looks at each one and logs it (tools decision 2026-11-13). The key art keeps:
  - the hero small in the lower third
  - a clear walkable ground line, a gap and a raised platform
  - layered depth
- The developer picks a style and signs off on Rowan's concept. `docs/STYLE_GUIDE.md` records:
  - palette with hex values, per level
  - shading rule, outline rule, grading rule, lighting rule
  - what warm light is reserved for
  - the reference images
  - the story-card style: layered paper-cut silhouettes built in the engine; the warm-light exception and the card-shape source are decided on the sample card
  - values for the 16 overlay colour roles in DESIGN.md (Colors), with `ember` still the only warm one
  - the 3 overlay typefaces (display, UI, numeric), licence checked, all faces and weights together 0.3 MB or less
  - the DESIGN.md contrast table, re-measured on those values, with every target still met
  - the HUD icon style, the wordmark and the title-backdrop style
- The game's own look, applied to everything: a palette and a lighting rig per level as data; the shared material factories for ground, foliage, characters, props, effects, backdrops and card silhouettes; the shadow decision; and outlines and colour grading if the style uses them.
- The view camera and the four depth layers, with the camera's framing margin in `CONFIG.view` (default X-B35).
- A look-dev page that shows any asset under the game's look, next to the style-guide swatches. It also shows the overlay colour roles and typefaces, since the overlay is judged there too, and three.js renderer statistics for the budget check.
- A basic screenshot harness (decision 1): `make shots ROUND=n` captures fixed spots on the look-dev page and the test scene, so the critic loop can run in this epic.
- The overlay typefaces, self-hosted as `.woff2`, with their licences logged in `docs/ASSETS.md`.
- A test scene built from simple shapes that reproduces the chosen look, checked against the starting render budgets.
- **A sample story card** on the look-dev page: intro card 2, the glowing crack.
  - It confirms the silhouette style and the cards' warm-light exception. If the exception is refused, the forge glow on cards turns pale and cold.
  - It sets the palette for story scenes outside the levels: the village and the hollow chamber.
  - It settles where the card shapes come from (made by hand or generated), logged in `docs/ASSETS.md`.
  - It builds the card scene and `content/cards.ts` (default X-B34).
  - It fixes where card text sits, reused on every later card: one line on a scrim band over the card art, with the advance hint at the band's lower right (DESIGN.md, `card-text`).
- DESIGN.md takes the overlay colours and typefaces through `gds-ux` Update before this epic closes, so Epic 1 builds on them (F9). The same update fixes the UX spine inconsistencies (X-C6).

**Out of scope:** gameplay and the simulation beyond `CONFIG.view`; the hero model; level layout; the asset loader and the manifest (Epic 1); the `?shot=` screenshot mode, gameplay spots and the other debug tools (Epic 1); the HUD and every other overlay surface (Epic 1 onward); card input, card timings and the other six cards (Epics 3 and 5); the `?perf=1` recorder and the performance pass on the reference machines (Epic 6).

**Depends on:** the image model, chosen 2026-11-13 (the Gemini app with Nano Banana Pro, on the developer's Google AI Pro plan), with its terms logged in story 0.4 before the first image; the tool budgets in the GDD's Dependencies table (tools decision 2026-11-13).

**Playable deliverable:** the look-dev page and the test scene, running in the browser.

**Exit criteria:** the developer approves the look as rendered in the engine, not only the images, and DESIGN.md carries the style guide's overlay colours and typefaces, with every contrast target met.

### Story 0.1: Scaffold the repository, toolchain and code rules

As a developer,
I want the repository scaffolded on the pinned toolchain, with one Makefile front door, the layer boundaries enforced and logging in place,
So that every later story builds, tests, lints and logs the same way on any machine, and a layer violation fails before it is merged.

**Requirements:** NFR9, AR1–AR12, AR14–AR37, AR203–AR206, AR215–AR217, AR220, AR221, AR228, AR229, AR233, X-B20, X-B33, X-B36, X-B37

**Acceptance Criteria:**

**Given** the repository with no code yet, and mise and git-lfs installed on the machine
**When** the scaffold runs as in the architecture's Project Initialization
**Then** `mise.toml` pins Node 26.13 at an exact patch, plus git-lfs at an exact version if mise's registry has it (otherwise `README.md` names the system package)
**And** Vite's `vanilla-ts` template is generated with the pinned Node into a temporary folder, from `create-vite` at an exact version, and its `package.json`, `tsconfig.json`, `index.html` and `src/` are moved into the repository root
**And** the template's demo code, styles and images are removed, and `src/main.ts` boots an empty game page
**And** `.gitignore` adds `mise.local.toml`, `shots/`, `public/assets/levels/` and `public/assets/manifest.json`

**Given** the architecture's Toolchain table
**When** the dependencies are installed
**Then** `package.json` pins exact versions, no ranges, of `three` 0.187.x with `@types/three` at the matching version, Vite 8.3.x at 8.3.3 or later, TypeScript 6.0.x, ESLint 10.x, typescript-eslint 8.72.x, Prettier 3.x, `@gltf-transform/cli` 4.5.x, `@types/node` for Node 26, Vitest 5.x and `@playwright/test` 1.65.x, each the newest patch at least two weeks old on the day, checked against the registry
**And** `package-lock.json` is committed
**And** typescript-eslint's peer range is confirmed to cover the installed ESLint 10; if it doesn't, the story stops and the developer decides, rather than either version changing silently
**And** nothing outside the table is added; if the flat config needs a package such as `@eslint/js` or `globals`, the developer is asked first

**Given** the Makefile as the single entry point
**When** the developer runs `make` with no target
**Then** `make help` runs and lists every target with one line each
**And** the targets are `help`, `setup` (`mise install`, `npm ci`, Playwright's Chromium and Firefox), `dev`, `test`, `test-watch`, `smoke`, `lint`, `format`, `typecheck`, `check`, `build`, `preview` and `clean`; the Makefile's header lists the targets left for later stories: `shots` with this epic's screenshot harness, `levels` and the Tiled check in `setup` in Epic 1, `models` in Epic 2, `release` in Epic 6
**And** every target runs with the mise-pinned tools, through `mise exec --` or an activated shell; the choice is made after reading mise's current documentation and recorded, with the reason, in the Makefile's header
**And** `make test` runs every Node test layer that exists, once (default X-B36); `make check` runs lint, `prettier --check`, the type check and `make test`; `make build` runs the type check, the tests and the Vite build; `make preview` serves `dist/`; `make clean` removes build output and tool caches

**Given** `tsconfig.json` and `src/sim/tsconfig.json`
**When** `make typecheck` runs
**Then** it runs `tsc --noEmit` on the root project, then on `src/sim/tsconfig.json`, and `scripts/` and `tests/` are type-checked too
**And** both projects are strict and set `allowImportingTsExtensions`, `verbatimModuleSyntax` and `erasableSyntaxOnly`
**And** the root project excludes `src/sim/**` and references the simulation project, whose `lib` has no DOM and which loads no Node types (default X-B37)
**And** a throwaway file in `src/sim/` that uses `document` or `window` fails `make typecheck`, as does an `enum` anywhere; the files are removed and the run is noted in the story

**Given** `eslint.config.js` (flat config) on typescript-eslint's `strictTypeChecked`
**When** `make lint` runs
**Then** `no-restricted-imports` is set per folder to the architecture's boundary table for `core/`, `sim/`, `content/`, `platform/`, `input/`, `app/`, `render/`, `render/materials/`, `audio/`, `ui/`, `debug/`, `lookdev/` and `scripts/`, and it bans `ShaderMaterial`, `RawShaderMaterial` and three.js post-processing imports outside `render/materials/`
**And** `consistent-type-imports`, `no-explicit-any`, `switch-exhaustiveness-check` and `no-floating-promises` are on; `no-console` is on everywhere except `src/core/log.ts`; `src/sim/**` bans `Math.random`, `Math.sin`, `Math.cos`, `Date` and `performance`
**And** a throwaway file for each rule (for example `sim/` importing `three`, `ui/` importing `render/`, `render/` importing `ShaderMaterial` outside `materials/`, `Math.random` in `sim/`, `console.log` outside `core/log.ts`) is reported by `make lint`; the files are removed and the run is noted in the story

**Given** Prettier, Vitest, Vite and Playwright configured
**When** `make format`, `make test`, `make build` and `make smoke` run
**Then** Prettier formats code and config with the project's config, and ignores `_bmad/`, `_bmad-output/`, `prototype/` and generated output
**And** Vitest's config sits in `vite.config.ts`; it runs in Node only, with no DOM environment, and finds tests beside the code in `src/` and `scripts/` and under `tests/levels/`; Playwright specs live in `tests/e2e/`
**And** `vite build` uses `base: './'` and hashed asset names, so every URL in `dist/` is relative
**And** `make smoke` runs one spec in headless Chromium and Firefox that opens the production build served by `make preview` (default X-B20) and fails on any console error; Epic 6 extends it to the full smoke checks

**Given** `src/core/log.ts`
**When** code logs through it
**Then** each line is `[channel] message` plus an optional data object, at `error`, `warn`, `info` or `debug`, on a channel from the fixed union `loop`, `app`, `sim-host`, `render`, `audio`, `input`, `save`, `assets`, `ui`, written to the browser or Node console only
**And** `warnOnce` writes a given key once per session
**And** the level filter comes from a setter that `main.ts` calls: everything in development builds, `warn` and `error` only in release builds; Node scripts that import `core/` get the default, everything (default X-B33)
**And** Vitest tests in Node cover the line format, the filter and `warnOnce`

**Given** `.gitattributes`, `README.md` and a clean clone
**When** files are added and the developer follows the README
**Then** `art-src/**`, `*.glb`, `*.blend`, `*.fbx`, `*.obj`, `*.png`, `*.jpg`, `*.webp`, `*.psd`, `*.kra`, `*.wav`, `*.flac`, `*.ogg`, `*.mp3`, `*.m4a`, `*.woff2` and `*.ttf` go to Git LFS while code, JSON, `.tmj` and `.tsj` stay in plain git, checked with `git check-attr` on a sample path of each
**And** before the first file matching those patterns is committed, the developer checks GitHub's current LFS storage and bandwidth quota and runs `git lfs install`; the quota and the date are noted in the story
**And** `README.md` says how to start (`git lfs install`, `mise install`, `make setup`, `make dev`, `make check`), lists the prerequisites, and states the version policy: exact pins; the newest patch at least two weeks old; a three.js upgrade, or the move to TypeScript 7, is a story of its own; no dependency without the developer; any service runs in Docker through a committed `docker compose` file (version one needs none)
**And** `make setup`, `make check` and `make build` pass on the clean clone

Note: the architecture's command uses `npm create vite@latest`, which breaks its own exact-version policy (ga#14), so this story pins `create-vite`; Prettier's ignore list is my reading, since no document states it.

### Story 0.2: Check the download and asset budgets in `make build`

As a developer,
I want `make build` to fail when the build breaks the 30 MB total, itch.io's file limits or a per-asset budget,
So that the download budget is guarded from the first asset on, not discovered at release.

**Requirements:** NFR5 (the checker), NFR10, PR33, AR152 (the checker), AR226 (the 30 MB total), AR229, AR230

**Acceptance Criteria:**

**Given** `scripts/checkBudgets.ts`
**When** `make build` runs
**Then** the budget check runs last, over `dist/`, after the type check, the tests and the Vite build
**And** the level compile (first in the order) and the manifest (just before the budget check) are left for Epic 1, which adds them in the architecture's order

**Given** the built files
**When** the check measures them
**Then** it fails when the total is over 30 MB, when there are more than 1,000 files, or when any file is over 200 MB or the total is over 500 MB (itch.io's limits), naming the limit and the measured value

**Given** the per-asset budgets, starting values † in one table in `scripts/checkBudgets.ts`: hero, both stages, 2 MB; each enemy 0.6 MB; the warden 2 MB; each level kit with its backdrops 3.5 MB; story cards together 1 MB; pickups and markers together 0.5 MB; music and ambience 8.5 MB; sound effects 2 MB; code (the JavaScript and CSS bundles plus `index.html`), gzipped, 1 MB; fonts 0.3 MB; level data and manifest 0.25 MB; interface icons 0.05 MB; about 29.9 MB planned in all (readiness proposal 2026-11-13, Q1)
**When** the check assigns each shipped file to a budget
**Then** it goes by kind prefix or folder: `hero-`; `enemy-`, per enemy; `warden-`; `kit-<level>` together with `backdrops/<level>/`; `card-`; `pickup-` and `marker-`; `music-` and `amb-`; `sfx-`; `fonts/`; `icon-` as interface icons; the compiled `levels/*.json` plus `manifest.json` as level data and manifest; and the JavaScript and CSS bundles plus `index.html` as code (readiness proposal 2026-11-13, Q1)
**And** a group over its budget fails the build, naming the group, its size and its budget
**And** a shipped asset that fits no group fails the build with its path listed, so nothing slips past the per-asset budgets

**Given** a build that passes
**When** the check finishes
**Then** it reports each group's size against its budget, and the total against 30 MB

**Given** the checking logic as a pure function over a list of file paths and sizes
**When** `make test` runs
**Then** Vitest tests in Node cover: a group exactly at its budget passes, one byte over fails, 1,001 files fail, an asset that fits no group fails, code is measured gzipped, `index.html` counts as code, a level JSON and the manifest fall in level data and manifest, and an `icon-` file falls in interface icons (readiness proposal 2026-11-13, Q1)
**And** the tests read the budget table and never repeat its numbers

**Given** the current code-only build
**When** the developer runs `make build`
**Then** it passes and reports the gzipped code size

Note: the architecture gives the budget values but not their home, their unit (this story reads MB as 1,000,000 bytes, the stricter reading) or what counts as code (here the JS and CSS bundles plus `index.html`); failing an asset that fits no group is my reading of the kind-prefix naming rule (AR154). The architecture lists no group for level data, the manifest or interface icons; this story adds the two groups as † starting values, which brings the planned total to about 29.9 MB of the 30 MB (readiness proposal 2026-11-13, Q1).

### Story 0.3: Emit the DESIGN.md tokens as CSS custom properties, with a contrast check

As a developer,
I want every DESIGN.md token available to overlay CSS as a `--{group}-{name}` custom property, and DESIGN.md's contrast targets checked by a test,
So that overlay CSS never carries a raw value, and a token change that breaks a contrast target fails `make check` instead of reaching a player.

**Requirements:** UX-DR1, UX-DR2, UX-DR4, UX-DR6, UX-DR8, UX-DR10, AR184

**Acceptance Criteria:**

**Given** DESIGN.md's frontmatter
**When** `src/ui/styles/base.css` is written
**Then** every `colors`, `typography`, `rounded` and `spacing` token is declared as a custom property named `--{group}-{name}`, for example `--colors-surface-scrim: #0E0F11BF` (the 8-digit hex, 75 % alpha, is intentional) and `--spacing-safe-margin`
**And** each typography token becomes one property per attribute, for example `--typography-display-body-font-size`
**And** `spacing.tile` is not emitted, since `--tile` is set at runtime only by `ui/overlay.ts`; the `components` entries are not emitted either, since each component's CSS is built from the group properties when that component is built

**Given** `base.css` and DESIGN.md
**When** `make test` runs
**Then** a Node test reads DESIGN.md's frontmatter and fails, naming the token, if `base.css` lacks a token or holds a different value, so a later DESIGN.md change can't drift from the CSS
**And** the test reads the frontmatter with the `yaml` package, a development-only dependency the developer approved on 2026-11-13, pinned to an exact version like the rest, as the architecture's Toolchain table records it (sprint change proposal 2026-11-13, A7)

**Given** the pairs in DESIGN.md's contrast table
**When** the contrast check runs on the token values
**Then** it computes WCAG 2.x contrast from relative luminance, compositing `surface-scrim` over white as the worst case
**And** it asserts at least 4.5:1 for the text pairs: `text-primary` and `text-muted` on `surface-panel`, `surface-screen` and `surface-focus`; `text-primary` on the scrim; HUD text (`text-primary`) against `hud-outline`; the "New best" tag (`surface-panel` on `text-primary`)
**And** it asserts at least 3:1 for the non-text pairs: `focus-ring` on `surface-panel`, `surface-focus` and `surface-screen`; the slider fill (`text-muted` on `border-subtle`); `heart-fill`, `ember`, `weapon-timer`, `warden-bar` and `warning` on `hud-track` and against `hud-outline`; `heart-empty` on `hud-track`
**And** on the provisional values it reproduces DESIGN.md's measurements to within 0.1 (for example 14.9 for `text-primary` on `surface-panel`, 7.4 on the scrim), and it measures `text-muted` on the scrim at about 3.6, which is why that pair is a "never" rule and not a target

**Given** a proposed set of colour values that DESIGN.md doesn't hold yet
**When** the developer runs the contrast check on it
**Then** it reports every pair with its ratio and a pass or fail, so the style guide can re-measure before DESIGN.md changes
**And** this story renders nothing, since no surface reads the properties yet, so no critic loop runs

Note: DESIGN.md doesn't say whether `base.css` is generated or written by hand, how composite typography tokens are named, or whether `components` are emitted; the outcome above is my reading, and the drift test guards it either way.

### Story 0.4: Generate the hero and Emberwood references in each candidate style

As a developer,
I want a hero design sheet and Emberwood key art in each candidate style,
So that I choose the game's look from images of my own hero and first level, not from placeholder scenes.

**Requirements:** FR210 (concept), NFR34, PR22, PR26 (image model and tool budgets), AR158
**Depends on:** the image model the developer chose (the Gemini app with Nano Banana Pro, on his Google AI Pro plan; tools decision 2026-11-13), with its terms, commercial use included, logged in `docs/ASSETS.md`; the tool budget in the GDD's Dependencies table

**Acceptance Criteria:**

**Given** the image model the developer chose
**When** the story starts
**Then** `docs/ASSETS.md` exists with a tools table (tool, version or plan, licence and commercial-use terms, date checked) and an assets table (file, tool, licence, AI-generated yes or no, date), and the image model's row is filled in
**And** that row records, from Google's official pages: the plan and when the student offer ends; who owns the images and whether they may be used commercially; whether prompts and uploads may be read by people or used for training, and the activity setting the developer chose; any visible watermark the plan adds; the date checked; and the page addresses (tools decision 2026-11-13)
**And** if the terms don't allow commercial use of the images, or the tool budget isn't set, the story stops and the developer decides

**Given** the reference prompts in `docs/PROJECT_BRIEF.md` §5, adapted to the chosen model by the agent
**When** the developer runs them in the Gemini app and saves the results where the agent can open them (tools decision 2026-11-13)
**Then** each candidate style gets one hero design sheet and one Emberwood key art: stylised dark fantasy (a cold teal and plum palette, fog, a pale glow behind trees, simple flat shapes with soft gradients); comic illustration (flat colours, banded shading, dark ink outlines, one dominant colour per level); and the mix (comic shading and outlines with the dark-fantasy palette)
**And** every hero sheet is full body, in a neutral standing pose on a plain light background, and shows Rowan's cursed form: a horned ember-beast, clearly not an ape; upright, with two legs and two arms, about 3 heads tall; two bone horns sweeping back; a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; a torn red woodsman's scarf; determined, not monstrous
**And** every key art is a side-on 2.5D platformer view of Emberwood at dusk, with the hero small in the lower third, a clear walkable ground line, a gap, one raised platform, hanging lanterns, drifting embers and layered depth (dark foreground plants, the play area, misty trees, distant ridges)
**And** no image carries text or interface, warm light belongs only to the hero, the embers and the lanterns, and the tone is dark fantasy in every style

**Given** each generated image
**When** it comes back from the model
**Then** it is opened and looked at before it is described or kept; one that misses a rule above is regenerated, within the tool budget
**And** if the tool budget runs out before every image meets the rules, the story stops, reports the spend and the rules each image still fails, and the developer decides (readiness proposal 2026-11-13, Q9); on the flat-rate plan, the budget for an image runs out after 5 † generations or edits (tools decision 2026-11-13)
**And** the prompts name no other game, studio or artist, and no image takes a name, character or layout from Toki or any other game, or anything Dungeons & Dragons invented

**Given** the kept images
**When** they are committed
**Then** they live in `art-src/reference/`, in Git LFS, under kebab-case names that state the subject and the style
**And** each is logged in `docs/ASSETS.md` as AI-generated, with the tool, the prompt and the date

**Given** the six kept images
**When** the story is done
**Then** the developer sees them side by side, the three hero sheets in one row and the three key arts in another, with the tool budget spent so far
**And** nothing is rendered in the engine, so no critic loop runs

Note: "prompts name no other game, studio or artist" is my reading of CLAUDE.md's hard limits; the GDD names games only as mood references for the candidates.

### Story 0.5: Pick the style and write `docs/STYLE_GUIDE.md`

As a developer,
I want to pick one style from the references, have it written down as rules, palettes and overlay values, and sign off on Rowan's concept,
So that every later material, asset and screen is built and judged against one written look, not against a new generated image.

**Requirements:** FR167 (recorded as open), FR210 (concept sign-off), NR14, NR100–NR104, NFR28, NFR33, NFR34, PR22, PR24, AR179, UX-DR2, UX-DR3, UX-DR4, UX-DR6, UX-DR7, UX-DR11, UX-DR15, UX-DR61, UX-DR111

**Acceptance Criteria:**

**Given** the six references side by side
**When** the developer compares them
**Then** he picks one style: stylised dark fantasy, comic illustration or the mix
**And** `docs/STYLE_GUIDE.md` records the choice, his reasons and the reference images it was made from, and the setting's tone stays dark fantasy

**Given** the chosen style
**When** the look is written down
**Then** the guide records: a palette with hex values for each level (Emberwood, the Drowned Mill, Harrowmere), as named slots; the shading rule; the outline rule, outlines used or not; the colour-grading rule, used or not; the lighting rule (key, fill and fog for each level); and whether the style keeps the perspective camera or calls for an orthographic one with hand-made parallax
**And** it records the warm-light rule: warm light belongs only to Rowan, the embers and the lanterns; Rowan, his shots and the collectables are always the warmest things on screen; lanterns appear only in Emberwood; warmth fades across version one, most in Emberwood (the lanterns, home), almost none in the Drowned Mill, none in Harrowmere but Rowan and the embers; pits and deep water read as dark, and story lighting never overrides that; weapon pickups look warm, part of Rowan's palette; enemies recolour per level by palette swap, with no rule change
**And** it states that every asset takes the game's own materials, palette and lighting and is judged on the look-dev page against this guide, never against a new generated image

**Given** the hero sheet in the chosen style
**When** the developer checks it against Rowan's design (FR210)
**Then** he signs off on the concept, and any change he asks for is written into the guide as the concept Epic 2 models from
**And** a new sheet, if he asks for one, is generated within the tool budget, looked at and logged in `docs/ASSETS.md`

**Given** the story cards
**When** their style is written down
**Then** the guide records layered paper-cut silhouettes built in the engine from flat layers in the game's palettes, about 3 to 5 layers per card †, with text drawn over the art and never baked in, fitted to the chosen style
**And** the cards' warm-light exception (Elin and home) and where the card shapes come from are marked open, to be decided on this epic's sample card

**Given** DESIGN.md's 16 overlay colour roles and 3 type roles
**When** their values are chosen
**Then** the guide gives a value for every colour role, role names unchanged; `ember` is the only warm value, and hearts, bells, timer, warden bar and focus stay neutral or cool; values may be copied from palette slots
**And** it names the typefaces for the three roles (display, UI, numeric), two faces if the UI face has tabular figures and serves the numeric role, each with its licence checked (OFL or an equivalent that allows self-hosting and commercial use), together 0.3 MB or less as `.woff2` in the weights the typography tokens use, covering Latin plus the story text's punctuation, with tabular figures for the numeric role or a separate numeric face
**And** the contrast table is re-measured with Story 0.3's check on the proposed values and every target is met; a value that misses is changed before the guide is approved

**Given** the rest of the overlay's look
**When** the guide is completed
**Then** it records the HUD icon style (single-colour silhouettes readable at `hud-icon-sm`; the triple and piercing shot differ by outline shape, never by colour alone; with the comic style or the mix, panel edges and icons may take its ink outline), the wordmark "Emberbound" (working title) in `display-xl` in the display face, and the style of the title backdrop that Epic 6 builds

**Given** the full draft of `docs/STYLE_GUIDE.md`
**When** the developer reviews it
**Then** the decisions made for him are listed so he can veto them, and he approves the guide
**And** nothing is rendered in the engine yet, so no critic loop runs

### Story 0.6: Build the look-dev page and the screenshot harness

As a developer,
I want a development-only look-dev page with the renderer, its statistics and the overlay's colour roles and type, plus a harness that screenshots it at fixed spots,
So that every asset and screen is judged in the engine against the style guide, and the critic loop can run from this story on.

**Requirements:** PR14, PR23, AR170, AR177, AR178, AR219, AR221 (`make shots`), AR222, AR228 (look-dev left out of the build), UX-DR16, X-B35; UX-DR9 and AR183 (the `--tile` setter only)

**Acceptance Criteria:**

**Given** `lookdev.html` as a second Vite entry, with `src/lookdev/main.ts` and `src/lookdev/assetBrowser.ts`
**When** the developer runs `make dev`
**Then** the page is served at `/lookdev.html`, and `assetBrowser.ts` lists its views; each later story adds its own view there
**And** `make build` leaves it out: `dist/` holds no look-dev entry and no look-dev code

**Given** `src/render/renderer.ts`
**When** the page's 3D view opens or the window is resized
**Then** it owns the `WebGLRenderer`, fits the canvas, and caps the pixel ratio at 1.5 †; the 3D view holds an empty scene until later stories add to it
**And** the page shows three.js renderer statistics: draw calls, triangles, geometries, textures, shader programs, an estimate of texture memory, and the pixel ratio in use; the shadow map size and the number of post-processing passes join the panel when those exist
**And** the texture-memory figure is labelled as an estimate, since three.js counts textures rather than measuring them (to be confirmed in r187's `renderer.info` documentation)

**Given** `src/ui/styles/base.css`
**When** the overlay view opens
**Then** it shows the 16 colour roles as labelled swatches read from the `--colors-*` properties, and the 8 typography tokens, each rendered through its `--typography-*` properties with a sample line
**And** `--tile` comes from `src/ui/overlay.ts`, which sets it on load and on resize from the logical view in `CONFIG.view` in `src/sim/config.ts`: 19 × 10.4 tiles, with a margin of 0 until the camera framing is locked (default X-B35); layer stacking and the mute indicator are left for Epic 1
**And** the ESLint boundary for `lookdev/` allows `ui/` (the overlay root, styles and components), as the architecture's boundary table states (sprint change proposal 2026-11-13, A6), so the overlay can be judged here as DESIGN.md asks

**Given** `tests/e2e/shots.spec.ts`, headless Chromium, and the dev server started by Playwright's `webServer`
**When** the developer runs `make shots ROUND=n`
**Then** every look-dev spot is saved as `shots/round-<n>/<spotId>.png`
**And** each spot fixes the view, the window size (1920 × 1080 unless the spot says otherwise), the camera and the animation time, and the spec waits until the page reports that the view has rendered
**And** the spots are one list in `src/lookdev/` that the spec imports; Epic 1 adds gameplay spots through `src/debug/spots.ts` and `?shot=<spotId>`
**And** look-dev Playwright checks live in `tests/e2e/lookdev/`; `make shots` runs them against the dev server before it captures, and a failing check stops the run before any shot is taken; Stories 0.8, 0.10 and 0.12 add theirs there (readiness proposal 2026-11-13, Q12)

**Given** two `make shots` runs with different round numbers
**When** their shots are compared by eye
**Then** they match
**And** shots are never pixel-diffed, and no performance number is ever taken from them: they are judged by eye, and headless runs aren't real frames, even with WebGL on the developer's GTX 1650 (sprint change proposal 2026-11-14, GPU)

**Given** the look-dev spots at 1920 × 1080 and 1280 × 720
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each shot is opened and looked at before it is described, the swatches are compared with the token values and `docs/STYLE_GUIDE.md`, the type is checked for legibility at both sizes, and the three biggest problems are written down, most important first, and fixed
**And** until Story 0.14 updates DESIGN.md, the swatches show DESIGN.md's provisional greys: differences from `docs/STYLE_GUIDE.md` are expected and listed for 0.14, not fixed, and neither `base.css` nor DESIGN.md is edited to match (readiness proposal 2026-11-13, Q14)
**And** the developer sees the before and after shots and signs off

Note: the look-dev spots' home and the page's ready signal are unstated (the `window.__emberbound` handle arrives in Epic 1); this story keeps both inside `src/lookdev/`.

### Story 0.7: Put the level palettes and lighting rigs in data

As a developer,
I want each level's palette and lighting rig as typed data, taken from the style guide,
So that every material reads its colours and light from one place per level, and the warm-light rules are visible and tested.

**Requirements:** NR100–NR104, NFR28, AR164, AR165, X-B34

**Acceptance Criteria:**

**Given** the palette slots named in `docs/STYLE_GUIDE.md`
**When** the palette modules are written
**Then** the slot names are one string-literal union in `core/`, so `content/` and `render/palettes/` share them without `content/` importing `render/` (default X-B34)
**And** `src/render/palettes/emberwood.ts`, `drownedMill.ts` and `harrowmere.ts` each give the style guide's hex value for every slot, and the type checker fails if one is missing
**And** enemy colours are slots in every palette, so an enemy's recolour is a palette swap with no rule change, and the weapon pickups' slots sit in Rowan's warm family

**Given** the lighting rule in the style guide
**When** the rigs are written
**Then** `src/render/lighting/emberwood.ts`, `drownedMill.ts` and `harrowmere.ts` each hold the key light, the fill, the fog and the list of what may carry warm light in that level, as data

**Given** the three rigs
**When** `make test` runs
**Then** unit tests check that every level allows warm light only for Rowan and his fire family (his shots, the embers, the bells and the weapon pickups), and that Emberwood alone also allows lanterns
**And** the warmth falling from Emberwood to the Drowned Mill to Harrowmere, and pits and deep water reading as dark, are judged on screenshots, since no number defines them

**Given** the look-dev page
**When** the palettes view opens
**Then** each level's slots show as labelled swatches with their hex values beside the style guide's, and each rig shows its key, fill and fog colours and its warm list

**Given** the palettes view at 1920 × 1080
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at, every swatch is compared with the style guide, and the three biggest problems are written down, most important first, and fixed
**And** the developer sees before and after and signs off

### Story 0.8: Self-host the overlay typefaces

As a developer,
I want the overlay typefaces self-hosted, licensed and within their budget,
So that every overlay surface from Epic 1 on can use the chosen faces with no request to another server and no surprise in the download.

**Requirements:** AR152 (fonts budget), AR157, UX-DR6 (the faces), UX-DR7, UX-DR61

**Acceptance Criteria:**

**Given** the typefaces named in `docs/STYLE_GUIDE.md` (two faces for the three roles)
**When** they are added
**Then** only the weights the typography tokens use are shipped, as `.woff2` in `public/assets/fonts/`: static files, or one unmodified variable file covering them where the style guide names one (Source Sans 3, whose Reserved Font Name rules out a subset), (in Git LFS), together 0.3 MB or less, which `make build`'s fonts budget enforces
**And** if they don't fit, subsetting to Latin plus the story text's punctuation is proposed to the developer, with any tool it needs; no tool is added without his approval

**Given** the font files
**When** they are logged
**Then** each has a row in `docs/ASSETS.md` with its source, its licence and "not AI-generated"
**And** a licence that asks for credit inside the game is flagged for the Credits question in Epic 6

**Given** `@font-face` rules in `src/ui/styles/base.css`
**When** the look-dev page loads
**Then** the faces load from the game's own files, and a Playwright check in `tests/e2e/lookdev/` finds no request to any host other than the dev server (readiness proposal 2026-11-13, Q12)

**Given** the look-dev type view
**When** it opens
**Then** each face shows in each weight it ships in, and the wordmark "Emberbound" (working title) shows in `display-xl` in the display face
**And** every character the version-one story text uses (narrative design, Story Text Script), the curly quotes included, renders in the display face with no fallback glyph, checked by eye
**And** the typography tokens still name `system-ui` until DESIGN.md takes the faces through `gds-ux` Update, so the view shows each face by name beside its tokens

**Given** the numeric role
**When** "0:00.0" and "1:11.1" are set in it on the type view
**Then** a Playwright check in `tests/e2e/lookdev/` measures both at the same width (tabular figures; readiness proposal 2026-11-13, Q12)

**Given** the type view at 1920 × 1080 and 1280 × 720
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at, the faces are compared with the style guide and checked for legibility at both sizes, and the three biggest problems are written down and fixed
**And** the developer sees before and after and signs off

### Story 0.9: Build the shared materials

As a developer,
I want one set of material factories that draws everything in the chosen style from the level's palette and light,
So that any model, from any tool, ends up looking like part of the same game.

**Requirements:** NFR33, PR23, AR160, AR161, AR165

**Acceptance Criteria:**

**Given** the shading rule in `docs/STYLE_GUIDE.md`
**When** `src/render/materials/` is built
**Then** it exports factories for ground, foliage, character, prop, effect, backdrop and card-silhouette materials, all implementing that rule
**And** no other module contains GLSL or uses `ShaderMaterial`, `RawShaderMaterial` or `onBeforeCompile`: ESLint catches the imports, and a search of `src/` for GLSL strings outside `render/materials/` comes back empty

**Given** a material from a factory
**When** it is given a palette
**Then** its colours come from palette slots, never from colour literals, and switching the palette module recolours it with no other change
**And** one enemy stand-in shape, shown in the three level palettes, changes colour by slot alone

**Given** a level's lighting rig
**When** materials are lit by it
**Then** they take its key, fill and fog, and warm light falls only on what that rig lists

**Given** the look-dev materials view
**When** it opens
**Then** each factory shows on simple shapes (a box, a sphere, a plane and a capsule), one row per factory, under the palette and rig of the level picked on the page, beside the style guide's swatches and the chosen key art

**Given** the materials view for each level at 1920 × 1080
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at and compared with the chosen references and the style guide, and the three biggest problems are written down, most important first, and fixed
**And** the developer sees before and after and signs off

### Story 0.10: Frame the play plane with the view camera and the depth layers

As a developer,
I want the view camera and the four depth layers that every level uses, with the camera's framing recorded in `CONFIG.view`,
So that the play area always shows at least 19 × 10.4 tiles, wide screens only add backdrop, and the overlay's `--tile` matches the world.

**Requirements:** FR208, NFR14, AR162, AR163, X-B35

**Acceptance Criteria:**

**Given** `src/render/viewCamera.ts`
**When** it frames the play plane (z = 0)
**Then** it is a perspective camera with a narrow field of view (about 30° †), or an orthographic camera with hand-made parallax if the style guide calls for one, placed so the whole logical view in `CONFIG.view` (19 × 10.4 tiles) is visible at any aspect ratio
**And** extra width or height shows more backdrop only: 16:9 is the main target, 4:3 shows extra rows above and below, 21:9 shows extra width
**And** the framing is a pure function, unit-tested at 16:9, 4:3 and 21:9, and the field of view sits in `CONFIG.view` beside the margin

**Given** the developer locks the framing
**When** it frames a margin around the logical view, or none
**Then** the margin is recorded in `CONFIG.view` (default X-B35)
**And** a Playwright check in `tests/e2e/lookdev/` finds that `--tile`, set by `ui/overlay.ts`, equals the on-screen size of one tile on the play plane to within 1 px, at 1920 × 1080 and at 1280 × 720 (readiness proposal 2026-11-13, Q12)
**And** if the margin isn't 0, the change it makes to DESIGN.md's `--tile` formula and expected sizes (about 101 px and 67 px) is noted in the story, for DESIGN.md's update

**Given** `src/render/stage.ts`
**When** it builds a scene
**Then** the scene has four depth layers: far distance, middle distance, the play layer at z = 0 (the kit, characters, pickups and effects) and the foreground
**And** nothing in the foreground covers the play area
**And** the look-dev page switches level by swapping the palette and rig data only

**Given** the look-dev staging view, with placeholder planes from the backdrop material in each layer and the logical view outlined
**When** the camera pans across it
**Then** the layers move at different rates (parallax), and the logical-view box stays fully on screen
**And** following the simulation camera, with interpolation, is left for Epic 1, which builds that camera

**Given** the staging view at 1920 × 1080, 1280 × 720, 1440 × 1080 (4:3) and 2560 × 1080 (21:9), at two pan positions
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at and checked: the logical-view box fully visible, extra area showing backdrop only, the foreground clear of the play area; the three biggest problems are written down and fixed
**And** the developer sees before and after and signs off on the framing

Note: the field of view has no stated home (ga#17); putting it in `CONFIG.view`, beside the margin that X-B35 puts there, is my reading.

### Story 0.11: Add shadows, and the outline and grading passes the style calls for

As a developer,
I want the shadow approach decided, and the outline and grading passes built if the style uses them,
So that grounding and edges look the same on every asset, and their cost is known before any level is built.

**Requirements:** AR160, AR161 (the passes), AR168, AR225 (the shadow map and pass budgets)

**Acceptance Criteria:**

**Given** the staged look-dev scene with materials
**When** shadows are added
**Then** they are either one directional shadow whose shadow camera snaps to texel steps, or blob shadows if the directional shadow costs too much; the developer picks, and the choice goes into the style guide's lighting rule
**And** there is at most one shadow map, 2048 × 2048 at most †, and its size shows in the look-dev statistics

**Given** the directional shadow, if chosen
**When** the camera pans by less than one shadow texel across a short run of spots
**Then** the shadow edges don't crawl from shot to shot

**Given** the style guide's outline rule
**When** it calls for outlines
**Then** an edge-outline pass in `src/render/materials/` draws them over the whole frame, never baked into textures
**And** when it doesn't, no outline pass exists

**Given** the style guide's grading rule
**When** it calls for colour grading
**Then** a grading pass in `src/render/materials/` applies it, and when it doesn't, no grading pass exists
**And** there are never more than 2 post-processing passes †, and the count shows in the look-dev statistics

**Given** the materials and staging views for each level at 1920 × 1080
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at and compared with the chosen references and the style guide, and the three biggest problems are written down and fixed
**And** the developer sees before and after and signs off

### Story 0.12: Build the test scene and check it against the budgets

As a developer,
I want a test scene of simple shapes that reproduces the chosen key art in each level's look, with its render counts and frame time checked,
So that I see the chosen look working in the engine, and know it fits the starting budgets, before any real asset exists.

**Requirements:** FR208, NFR1–NFR3 (an early check), NFR27, NFR28, NR100–NR104, AR222–AR225, AR227

**Acceptance Criteria:**

**Given** the stage, the view camera, the materials, the palettes and the rigs
**When** the look-dev test-scene view opens
**Then** simple shapes at 1 unit = 1 tile, characters standing with their origin at their feet, reproduce the chosen Emberwood key art's composition: a hero stand-in small in the lower third (horns, chest glow, ember eyes, the red scarf), a walkable ground line, a gap that reads as a dark pit, a raised platform, a one-way ledge, spikes, stand-ins for the walker, the thorn flyer and the rooted spitter, an ember, a bell, a weapon pickup, a shot in flight, lanterns, and backdrop shapes in all four layers (dark foreground plants, the play layer, misty trees, distant ridges)

**Given** the same scene
**When** the page switches between Emberwood, the Drowned Mill and Harrowmere
**Then** only the palette and the rig change
**And** the lanterns show only in Emberwood; the warmth falls from Emberwood to the Drowned Mill to Harrowmere; Harrowmere shows no warm light but the hero and his fire family (his shot, the collectables and the weapon pickup); the enemy stand-ins change colour by palette alone

**Given** the look-dev statistics on each level's test scene
**When** a Playwright check in `tests/e2e/lookdev/` reads them (readiness proposal 2026-11-13, Q12)
**Then** it fails above the starting budgets: 150 draw calls †, 250,000 triangles †, 256 MB of estimated texture memory †, one shadow map of 2048 × 2048 at most †, 2 post-processing passes †, a pixel ratio of 1.5 †
**And** these counts don't depend on the GPU, so a headless run may check them; frame times from headless runs are never used

**Given** the test scene on the developer's own machine, in Chromium on its GTX 1650 (sprint change proposal 2026-11-14, GPU)
**When** it runs for a sustained stretch
**Then** a frame-time readout on the look-dev page, added here, shows a median of 16.7 ms or less and a 99th percentile of 20 ms or less
**And** the result is recorded with the machine's name and GPU as an early check only: it is the development build on a discrete GPU, so it is optimistic against the Iris Xe-class reference, and the binding measurement is Epic 6's, with `?perf=1` on the release build and the named reference machines

**Given** a budget that is missed
**When** the check or the readout shows it
**Then** the developer is told what costs the most, and he decides between cutting the scene's cost and retuning the † budget; no budget changes without him

**Given** the test scene for each level at 1920 × 1080
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at and compared with the chosen key art and the style guide, and the three biggest problems are written down, most important first, and fixed
**And** every round checks that the hero, enemies, hazards and pickups stand out from the background at a glance, that Rowan, his shot and the collectables are the warmest things on screen, and that the pit reads as dark
**And** the developer sees before and after and signs off

Note: the render budgets have no stated home (ga#17); here the look-dev page and the check read them from one table in `render/`. The frame-time readout is new: it is the only frame-time check Epic 0 can make before `?perf=1` exists.

### Story 0.13: Build the sample story card and fix where card text sits

As a developer,
I want intro card 2 built in the engine as a layered silhouette card, with its line placed over it,
So that the card style, the cards' warm-light exception, the story palette and the card-text placement are settled once, and every later card reuses them.

**Requirements:** FR164, FR165, FR166 (advance-hint placement only), FR167, FR216 (sample card), NR14, NR15, PR25, AR84 (the sample card scene), AR169, AR187 (this card's line), UX-DR16, UX-DR31 (placement), UX-DR111, X-B34

**Acceptance Criteria:**

**Given** `src/render/cards/cardScene.ts`
**When** intro card 2 shows on the look-dev card view
**Then** it renders in its own scene with an orthographic camera, as 3 to 5 flat silhouette layers † drawn with the card-silhouette material, each layer's shapes, palette slots and light coming from the card's entry in `src/content/cards.ts`, which names slots through the `core/` union (default X-B34)
**And** the image follows the script: human Rowan kneeling at a glowing crack in the earth, fire rising into his cupped hands, nothing else warm; there are no models of Rowan, Elin, Maldrek or the village

**Given** the choice between card shapes made by hand and shapes generated with the image model
**When** the developer decides, on this card
**Then** the choice is recorded in `docs/STYLE_GUIDE.md`, and the shapes are logged in `docs/ASSETS.md` with their tool, licence and AI flag
**And** their sources sit in `art-src/cards/`, and any shipped file is named like `card-intro-2-crack.*`, inside the 1 MB budget for all story cards

**Given** `src/render/palettes/story.ts`
**When** the card is lit
**Then** it uses the palettes for story scenes outside the levels, the village and the hollow chamber, which this story adds to the style guide

**Given** the sample card and the story palettes on the look-dev page
**When** the developer decides the cards' warm-light exception
**Then** if he confirms it, warm light on cards may also mark Elin and home, and the story palettes' home and forge slots are warm; if he refuses it, the forge glow on cards turns pale and cold
**And** in play, warm light stays reserved for Rowan and his fire (his shots, the embers, the bells and the weapon pickups) and the lanterns either way (`docs/STYLE_GUIDE.md`, section 3)
**And** the decision, and the silhouette style checked against the locked style, are recorded in `docs/STYLE_GUIDE.md`

**Given** `src/ui/screens/cardText.ts`
**When** the card shows
**Then** its line, `“I will pay with what I hold dearest when the debt is called,” he had sworn.`, comes from `src/content/storyText.ts`, created here with this one line (Epic 3 adds the rest), and is drawn in the DOM overlay, never in the card scene: hiding the overlay leaves no text on the canvas
**And** the line sits on one `surface-scrim` band over the art, in `display-body` and `text-primary`, wrapped at `text-measure`; the band's extent is judged on this card
**And** the advance hint, a placeholder confirm glyph until the control glyphs exist, sits at the band's lower right in `text-muted` at `hud-icon-sm`, never on bare art, inset by the one value the developer picks here between `spacing.safe-margin` and `spacing.2` (X-C6)
**And** card input, the card minimum, the fades and the hint's fade-in are left for Epic 3

**Given** the card view at 1920 × 1080 and 1280 × 720
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at and compared with the chosen style and the style guide, the text is checked for legibility, and the three biggest problems are written down and fixed
**And** the developer sees before and after and signs off on the card style and the text placement, which every later card reuses

Note: card 2's image has nothing warm but Rowan's fire, so the Elin-and-home exception is judged from the story palettes shown beside it (a second sample card would be scope growth). If the shapes are image files rather than shape data in `content/cards.ts`, the look-dev page (development only) loads them through Vite's own asset import; the game's card scene loads them through Epic 1's `AssetLoader` port (Story 1.3) when Epic 3 builds the intro.

### Story 0.14: Update DESIGN.md with the overlay colours and typefaces

As a developer,
I want DESIGN.md updated through `gds-ux` Update with the style guide's overlay colours and typefaces, and the UX spines' known inconsistencies fixed,
So that Epic 1's first overlay builds on the final values, and no later story trips over two specs that disagree.

**Requirements:** UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR6, UX-DR15, UX-DR16, UX-DR91, UX-DR111, X-C6

**Acceptance Criteria:**

**Given** `docs/STYLE_GUIDE.md`
**When** `gds-ux` Update runs with the developer
**Then** DESIGN.md's 16 colour values and the typefaces for the three roles (each font family with its fallbacks) take the style guide's values, with role names unchanged and `ember` still the only warm value
**And** the [PROVISIONAL] markers are removed from what is now set, and the contrast table shows the re-measured values with every target met

**Given** the UX spine inconsistencies in X-C6
**When** the same Update runs
**Then** the card advance hint has one inset, the same in DESIGN.md's frontmatter and prose: the value picked on the sample card
**And** `display-xl` gets a pixel floor, so every text token has one
**And** the spines state whether the error panel's scrim sits at layer 3 or layer 7, so the mute indicator stays above every scrim
**And** a scrim and its panel follow one fade rule (one duration, or a stated reason the two differ) in EXPERIENCE.md and its UI timings table
**And** DESIGN.md places the wordmark on the title menu too, in the upper third above the menu items, as the developer decided on 2026-11-13
**And** EXPERIENCE.md's Voice and Tone table gives the Retry panel a boot-failure line of its own, since "Couldn't load the level." misreads when the boot load fails
**And** the loading card's replay advance hint gets a visual spec of its own (placement and tokens), since the loading card has no scrim band

**Given** the UX spine drift the readiness check found (U1–U3)
**When** the same Update runs
**Then** EXPERIENCE.md's `hud-warden-bar` notch marks half health, not "15 of 30 HP"
**And** EXPERIENCE.md's "Audio has a visual twin" rule adds the hub-open cue with the hub glow, and the blocked splash sound with the splash
**And** the spines' `gdd.md` line citations are refreshed to the current GDD (readiness proposal 2026-11-13, U1–U3)

**Given** a margin noted when the camera framing was locked
**When** DESIGN.md is updated
**Then** its `--tile` formula and its expected sizes match `CONFIG.view`

**Given** the updated DESIGN.md
**When** `make check` runs
**Then** `base.css` follows it and the token test passes, the contrast check passes on the new values, and a new test fails if any typography size lacks a pixel floor

**Given** the look-dev overlay view
**When** it opens
**Then** the colour roles and the faces show through the token properties with the new values
**And** each HUD fill sits in its `hud-track` with the `hud-outline` ring and its soft shadow, over the test scene's brightest and darkest areas in each level, so the HUD backing can be judged before any HUD exists

**Given** the overlay view at 1920 × 1080 and 1280 × 720
**When** the critic loop runs (at most 3 rounds)
**Then** each shot is looked at and compared with the style guide, never with a generated image, and the three biggest problems are written down and fixed
**And** the developer sees before and after and signs off

### Story 0.15: Run the critic loop on the test scene and approve the look

As a developer,
I want a last critic loop over every Epic 0 spot, and my approval of the look as rendered in the engine,
So that Epic 1 starts from a locked look that every later asset inherits.

**Requirements:** PR7, PR14, PR23, NFR27, NFR28, UX-DR15

**Acceptance Criteria:**

**Given** every Epic 0 spot: the test scene in each level, the materials, staging, palettes, type and overlay views, and the sample card
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round's shots are looked at and compared with the chosen references and `docs/STYLE_GUIDE.md`, and the three biggest problems are written down, most important first, and fixed
**And** every round checks that the hero, enemies, hazards and pickups stand out from the background at a glance, that Rowan, his shots and the collectables are the warmest things on screen, and that pits read as dark

**Given** the before and after shots, and the look-dev page in his own browser
**When** the developer reviews them
**Then** he approves the look as rendered in the engine, not only the images
**And** if he doesn't, each problem goes back to the story that owns it, and this story runs again after the fix

**Given** DESIGN.md
**When** the epic closes
**Then** it carries the style guide's overlay colours and typefaces, every contrast target is met, and `make check` and `make build` pass on a clean clone

**Given** the epic's records
**When** the epic closes
**Then** `docs/ASSETS.md` lists every Epic 0 tool and asset (the image model, the reference images, the fonts, the card shapes) with its licence and AI flag
**And** `docs/STYLE_GUIDE.md` records every Epic 0 decision: the style, the hero concept, the card style and the warm-light exception, the card-shape source, the shadows, the passes and the camera framing
**And** the test scene's budget check and frame-time reading are recorded with the epic

---

## Epic 1: Grey-box core

The developer can play grey-box Level 1 start to finish in the browser, with every base mechanic working and feeling right, on keyboard or gamepad, with a placeholder HUD, a placeholder pause and a basic results screen.

**In scope:**

- **Simulation core:** one `World`, a fixed step order, `sim/config.ts` as the only home of gameplay numbers, the `SimEvent` union, a seeded RNG and a determinism test. Error-handling foundations: `core/result.ts`, `core/invariant.ts`, `platform/` wrappers that turn a feature off at its first failure, and the frame loop's catch that keeps the loop alive.
- **Timing:** a fixed 60 Hz step with interpolated rendering. Gameplay behaves the same at any display refresh rate, and a slow frame never changes an outcome.
- **Movement:** the full movement feel table and its regression test. Solid tiles, one-way ledges, drop-through, moving platforms. Crouch with the 0.6-tile hurtbox †.
- **Input:**
  - keyboard and gamepad map to the same actions, the menu actions included: move focus, confirm, back (D13)
  - short taps always register; jump buffer and coyote time
  - the last-used device is tracked, for the control-sign glyphs (and, from Epic 3, the card advance hint)
  - bound keys never scroll the host page
  - pause on Esc, P or Start
  - auto-pause when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or is turned off after an error (D14, Q7); held inputs are cleared so Rowan stops, and play never resumes by itself
  - pausing during the death sequence or the pit fade stops the simulation, which resumes where it was (M5)
  - optional browser features (gamepad, visibility, fullscreen) fail safely
- **Camera:** look-ahead, the vertical dead zone in the air, re-centring on landing, clamping to level bounds, and the logical view that defines "on screen".
- **Combat:** ember spit with aiming, hold-to-fire and the hitbox rules; stomp with the thorn rule, where a stomp beats contact; spikes; hearts, knockback, invulnerability; the pit rule; death and respawn at a checkpoint; hit feedback (hit-stop, shake as a trauma level, the 9 Hz blink, the enemy flash, the kill burst).
- **Enemies:** behaviour for the walker, the thorn flyer and the rooted spitter (seed, swell warning, ducking), including the on-screen-only attack rule.
- **Pickups:** embers and the ember meter, bells, the triple shot pickup with its timer and pickup rules.
- **Level pipeline:** Tiled 1.12.x levels compiled and validated by `make levels`; levels and assets loaded through the manifest and the `AssetLoader` port, with one silent retry and disposal on level change; test levels that never ship; the marked-jump search, the main-path coverage check and the metric checks.
- **Level 1 in grey boxes:** 4 sections, 3 checkpoints, 3 bells, the triple shot, and the control signs with placeholder glyphs that swap with the last-used device.
- **Interface:** the overlay root with `--tile`; the shared `menu-item`, `panel` and `scrim`; a placeholder pause (a single "Resume" item); a placeholder HUD (hearts, ember meter, weapon timer); a basic results screen (the 4 stats and Continue). All read the DESIGN.md tokens, which carry the Epic 0 values (F9).
- **Grey-box rendering** with Epic 0's materials, palette, lighting, stage and view camera: tiles as boxes, Rowan as a capsule, enemies as blocks, pickups and shots as simple shapes.
- **Debug tools:** the F1 overlay, URL parameters, cheats, the dev handle, the input recorder, and the `?shot=<spotId>` screenshot mode with gameplay spots in `src/debug/spots.ts`, so the critic loop runs on gameplay.
- **Pace:** measure the grey-box pace and set the level-length target in tiles.

**Out of scope:** Rowan's model and animations (Epic 2); final art, enemy models, final control-sign icons, the final HUD, the bell toast, the mute indicator, all audio, the title gate, the intro and the loading card (Epic 3); ledge grab, the warden, story moments and the replay-form rule in `createWorld` (Epic 4); the piercing shot and waterwheel platforms (Epic 5); the full pause menu, confirm dialog, settings, `slider`, `toggle`, notice lines, error panels, saving, the level select, the final results (stagger, "New best"), the reduced-motion setting, the fullscreen toggle and the `?perf=1` recorder (Epic 6).

**Depends on:** Epic 0: the scaffold, `core/log.ts`, the ESLint boundary rules, the token CSS pipeline with the Epic 0 colour and type values in DESIGN.md, the basic screenshot harness (`make shots ROUND=n`), the materials, palettes, lighting rigs, stage and view camera, the look-dev page, the HUD icon style (readiness proposal 2026-11-13, minor concern), and `CONFIG.view` with any camera margin (X-B35). Tiled 1.12.x, the level editor settled in the architecture.

**Playable deliverable:** grey-box Level 1, start to finish, in the browser, on keyboard or gamepad, with the placeholder HUD, the placeholder pause and the basic results screen.

**Exit criteria:** every mechanic works in tests and feels right to the developer in the browser, and the grey-box pace is measured.

### Story 1.1: Build the simulation core: World, fixed step order, config and events

As a developer,
I want one pure, plain-data `World` advanced by a fixed step order, with every number in one config module and every outcome reported as a typed event,
So that every mechanic in this epic plugs into the same deterministic simulation that runs, and is tested, in Node.

**Requirements:** FR7, AR38, AR39, AR40, AR41, AR42, AR43, AR45, AR46, AR47, AR49, AR58, AR59, AR60, AR63, AR65 (`sim/config.ts`), AR66, AR67, AR68, AR73, AR88, AR99, AR197, AR200, AR215, PR15, X-B15

**Acceptance Criteria:**

**Given** a level and `WorldParams` `{ levelId, form, spawnAt?, isStorySkippable }`
**When** `createWorld(level, params)` (`sim/world.ts`) is called
**Then** it returns one plain-data `World` holding `params`, the read-only compiled `level`, `step`, `nextId`, `rng`, `player`, `stats` and `events`, with Rowan's feet at the level's `PlayerStart`, or at `spawnAt` when it is a point
**And** positions are in tiles and velocities in tiles/s, y up, a body's `x` its centre and `y` its feet (AR47)
**And** fields for systems built later (platforms, enemies, pickups, checkpoints, camera, pools) are added by the stories that build them, and the warden, doors and story fields by Epics 4 and 5

**Given** `sim/step.ts`
**When** `step(world, input)` runs
**Then** it mutates the `World` in place and calls the systems in the architecture's order 0 to 12 (AR43), with systems not built yet present as empty functions named for their slot
**And** a Vitest test shows that each step starts by clearing `world.events` and copying every moving body's position into `prevX` and `prevY`

**Given** `sim/config.ts` (which already holds Epic 0's `CONFIG.view`)
**When** this story extends it
**Then** it exports `STEP_HZ = 60`, `steps(seconds) = Math.round(seconds * STEP_HZ)` and `CONFIG` declared `as const`, written in GDD units, with every † value carrying a comment that names the epic that tunes it (AR58, AR59)
**And** it holds `CONFIG.levelForm = { emberwood: 'beast', 'drowned-mill': 'beast', harrowmere: 'changed' }` (AR60, AR63)
**And** a unit test shows `steps()` rounds to the nearest whole step and that every `…Steps` value in `CONFIG` is an integer, so no seconds or milliseconds reach simulation logic (FR7, AR42)

**Given** the determinism rules
**When** `sim/math.ts` is written
**Then** it provides vector helpers, its own `sin` and `cos`, and a small seeded PRNG; `createWorld` seeds `world.rng` from the level id (X-B15), and the same seed gives the same sequence in Node and in the browser (AR45), which Story 1.15's replay in Node of a browser-recorded run checks (readiness proposal 2026-11-13, Q13)
**And** ESLint rejects `Math.random`, `Date`, `performance`, `Math.sin` and `Math.cos` in `src/sim/**` (this story adds any of these Epic 0's rules lack), shown once with a deliberate violation that `make lint` fails on

**Given** the two typed channels
**When** `sim/events.ts` and `sim/inputFrame.ts` are written
**Then** `SimEvent` is the full union listed in the architecture (AR68), each event plain data named in past tense, so presentation switches are exhaustive from the start; events no system emits yet are declared now
**And** `InputFrame` is `{ moveX: -1 | 0 | 1, up, down, jumpPressed, jumpHeld, spitPressed, spitHeld }` (AR88)
**And** only `sim/` creates `SimEvent`s (AR66, AR67)

**Given** the read-only boundary and the failure classes
**When** `core/deepReadonly.ts`, `core/result.ts`, `core/invariant.ts` and `core/assertNever.ts` are written
**Then** `Result<T, E = string>` is `{ ok: true; value: T } | { ok: false; error: E }` and `invariant(cond, msg): asserts cond` throws `Invariant failed: ${msg}` (AR197, AR200), with a unit test for the message
**And** a type-level test (`// @ts-expect-error` on a write through `DeepReadonly<World>`) passes `make typecheck`, so code outside `sim/` cannot write the `World` (AR41)
**And** an ESLint `no-restricted-syntax` rule rejects `try`/`catch` in `src/sim/**`; the simulation only asserts invariants (AR49)

**Given** a fixture level and a recorded input stream (an array of `InputFrame`, the same format the jump search and the input recorder use later, AR99)
**When** `src/sim/determinism.test.ts` runs the stream twice from `createWorld`
**Then** a state hash covering every numeric field of the `World` in a fixed order (X-B15) is identical at every step of both runs (AR46)
**And** changing a single input frame changes the hash, so the test can fail
**And** the Tiled story extends this test to every compiled level

**Given** simulation rules need small test levels before Tiled exists
**When** a sim unit test needs a level
**Then** a test helper builds `LevelData` (`sim/level/levelData.ts`, holding the fields this story needs) from an ASCII grid, and it is imported only by tests (AR215, PR15)

Note: the architecture lists no home for a fixture-level helper. This story adds one beside `sim/level/` (e.g. `asciiLevel.ts`), imported only by `*.test.ts` files, and flags it in the story notes (AR248).

### Story 1.2: Author levels in Tiled and compile them to the game's format

As a developer,
I want to build levels in Tiled and have `make levels` compile and validate them into the game's own format,
So that every later mechanic is tested and felt on real levels, and art never defines collision.

**Requirements:** AR13, AR46, AR123, AR124, AR125, AR128, AR129, AR130 (shape and type checks), AR131, AR132, AR135, AR216, NFR36

**Acceptance Criteria:**

**Given** a fresh checkout
**When** `make setup` runs
**Then** Tiled 1.12.x is pinned in `mise.toml` if a mise backend can install it, checked against mise's current documentation
**And** otherwise the required version is recorded, and `make setup` fails with a clear message when `tiled --version` does not report 1.12.x (AR13)

**Given** the Tiled project
**When** the developer opens `levels/emberbound.tiled-project`
**Then** it defines the custom classes in PascalCase with camelCase properties, starting with `PlayerStart`, and later stories add theirs (`MovingPlatform`, `Checkpoint`, `Walker` and so on) as they build them (AR128)
**And** `levels/tilesets/collision.tsj` gives each tile exactly one class: empty, solid, one-way or spike (AR124)
**And** layer names are exactly `collision`, `entities`, `regions`, `dressing` and `jumps` (AR123, AR125)

**Given** one or more `levels/*.tmj` files
**When** `make levels` runs (and `make test` and `make build`, which run it first)
**Then** `scripts/compileLevels.ts`, run by Node with no runner, writes each level as JSON in the game's format (`sim/level/levelData.ts`), with the level id equal to its kebab-case file name (AR129)
**And** the collision grid comes only from the `collision` layer's tile classes; no other layer, and no art, can add or remove collision (NFR36, AR124)

**Given** a compiled collision grid
**When** the compiler reads each solid and one-way cell's neighbours
**Then** it tags the cell with a piece kind by neighbour rules, named like the kit's `<kind>_<variant>` pieces (e.g. `ground_top`, `ground_fill`, `ledge_oneway`), so the grey-box view now and the Emberwood kit in Epic 3 draw from the same data (AR131)

**Given** a level with a broken object
**When** it is compiled
**Then** a missing or second `PlayerStart`, an unknown class or layer, or a missing or wrongly typed property fails the compile with the file, the object name and the reason, and a non-zero exit (AR130)
**And** a level test in `tests/levels/` compiles deliberately broken fixtures and expects each failure (AR216)
**And** rules about level content (checkpoints, bells, exit) are added by the stories that add those entities, and apply only to levels whose file name does not start with `test-`

**Given** the first test level, `levels/test-movement.tmj` (flat run, steps of 1, 2 and 3 tiles, gaps up to 5 tiles, no wider than one 19-tile screen)
**When** the developer runs `make dev`, `make test` or `make shots`
**Then** test levels compile like any other into `public/assets/levels/` and are available to all three, since each runs `make levels` before Vite; Story 1.3 adds the manifest step after it (AR132; sprint change proposal 2026-11-13, A2; readiness proposal 2026-11-13, D1)

**Given** test levels in `levels/`
**When** `make build` runs
**Then** `make build` deletes them from `dist/assets/levels/`, so `dist/` holds no `test-*` level; the release manifest that leaves them out is Story 1.3's (AR132; sprint change proposal 2026-11-13, A2; readiness proposal 2026-11-13, D1)
**And** the budget check fails, naming the file, if a `test-*` level is planted in `dist/` before it runs, and a test proves it

**Given** compiled levels
**When** simulation code or tests read a level
**Then** they read only the game's format, never `.tmj`, so the editor could be swapped by rewriting the compiler (AR135)
**And** the determinism test now runs on every compiled level as well as the fixtures (AR46)

Note: AR130 lists content rules for every level, but test levels exist to exercise single mechanics. This story applies the content rules only to levels not prefixed `test-`.

### Story 1.3: Load a compiled level by id through the asset manifest

As a developer,
I want the app to load a level and its assets by id through the manifest, and enter play only when both are ready,
So that every level, test levels included, starts the same way and a failed load never crashes the game.

**Requirements:** AR39, AR57 (`levelHost` creates the `World`), AR100, AR101, AR132 (the release manifest), AR133, AR144, AR150, AR189, AR201 (the silent retry), AR217, AR236, AR237, X-B17

**Acceptance Criteria:**

**Given** compiled levels and the files in `public/assets/`
**When** `scripts/buildManifest.ts` runs
**Then** `public/assets/manifest.json` lists a shared bundle and one bundle per level, holding that level's data and assets (AR150)
**And** the builder assigns each file to a bundle by its kind prefix: the shared bundle, loaded at boot, holds the fonts, the `icon-` files, every `sfx-` file, Emberwood's music (the title reuses the Level 1 tune), the hero, the three enemies, pickups and markers, and the story cards; a level's bundle, loaded behind its loading card, holds that level's compiled data, kit, backdrops and ambience, its music in Levels 2 and 3, and the warden in the warden's level (readiness proposal 2026-11-13, Q10)
**And** Vitest tests place a sample file of each kind in its bundle
**And** `make dev`, `make test` and `make shots` always work from a current manifest, since each runs the manifest step before Vite, and Vite copies `public/` unchanged, so the manifest's paths stay valid in `dist/` (sprint change proposal 2026-11-13, A2)
**And** `make build` runs the release manifest step (`scripts/buildManifest.ts --release`) in the place Story 0.2 left for it, and the release manifest leaves out every `test-*` level, which a Vitest test of the builder proves (AR132; readiness proposal 2026-11-13, D1)
**And** code asks for assets by manifest id through the `AssetLoader` port, never by a path string

**Given** `src/core/loading.ts`, which imports nothing
**When** the loading port is defined
**Then** it declares `AssetLoader` with `loadShared(onProgress)` and `loadLevel(levelId, onProgress)`, each returning `Promise<Result<…, LoadError>>`, with `onProgress(loaded, total)` counted in files (sprint change proposal 2026-11-13, A1)
**And** `src/render/assets/loader.ts` implements it and is the only code that fetches: it decodes models and textures itself, returns audio files as bytes for `audio/` to decode, and returns the level file as raw JSON
**And** `main.ts` passes the port to the app, and the app parses the returned level file with `parseLevel`

**Given** a level file in the game's format
**When** `sim/level/parseLevel.ts` reads it
**Then** it checks only the file's shape and version and returns `Result<LevelData>`, without re-checking level rules, which the compiler owns (AR133)
**And** Vitest tests show a compiled test level parses, and a wrong version or a missing field returns an error `Result` with a reason, without throwing

**Given** the app state machine (`app/app.ts`, `dispatch(cmd)`, the `AppCommand` union in `app/commands.ts`)
**When** it receives `startLevel { levelId }`
**Then** it enters Loading; once the level data and the level's bundle are both ready, `app/levelHost.ts` creates the `World` with `form` from `CONFIG.levelForm[levelId]` (X-B17) and `isStorySkippable: false`, and the app enters Playing (AR39, AR57, AR100, AR101)
**And** the app knows nothing about the simulation's internals beyond the `World` it hosts

**Given** the page opens
**When** the game starts
**Then** the shared bundle loads once, before the first level, and each level's bundle loads when that level starts (AR144)
**And** with no boot screen (Epic 6) or loading card (Epic 3) yet, the page goes straight to the startup level, here `test-movement`
**And** release builds can't start in `test-movement`, which they strip (Story 1.2), so this story also adds `levels/emberwood.tmj` as a placeholder: a flat strip with a `PlayerStart`, 3 checkpoints, 3 bells and an exit, which passes compile validation. Release builds start in it, so `make smoke` (Story 0.1) always has a level to load; Story 1.26 replaces it with grey-box Level 1 (readiness proposal 2026-11-13, D2)

**Given** a shared or level load in progress
**When** the loader calls `onProgress(loaded, total)`
**Then** the app keeps that progress, counted in files, in app state for the boot bar (Epic 6) and the loading card (Epic 3) to read (sprint change proposal 2026-11-13, A1)
**And** nothing draws it in this epic, and the simulation never sees it

**Given** a shared or level load whose files fail to fetch or decode, or whose level file fails `parseLevel`
**When** the app tries to load it
**Then** the failure reaches the app as an error `Result` and counts as a failed load; it is logged once with `log.warn('assets', …)`, and the app retries the load once, silently, so a retry that succeeds shows nothing (AR201; sprint change proposal 2026-11-13, A1)
**And** if the retry fails too, the app enters its Retry state (UX Q8): a stopped load-error state, out of Playing, that Epic 6's Retry panel is drawn over; until then nothing shows, and no stack trace or technical text ever appears on screen (AR189)

**Given** the app and the loading path
**When** `make test` runs
**Then** Vitest tests drive the state machine with a stubbed `AssetLoader` through success, progress, a failure that the silent retry recovers, a failure that reaches the Retry state, and a level file that fails `parseLevel` (AR217)
**And** no module other than `render/assets/loader.ts` calls `fetch`, and every request is a relative, same-origin URL (AR236, AR237)

Note: `CONFIG.levelForm` lists the three campaign levels only. Test levels start in the `'beast'` form.

### Story 1.4: Step the simulation from a fixed 60 Hz loop with latched keyboard input

As a developer,
I want a frame loop that runs the simulation at a fixed 60 Hz from latched keyboard input and never dies on a bad frame,
So that gameplay is identical at 60, 120 and 144 Hz and no key press is ever lost.

**Requirements:** FR7, FR17, FR30 (play keys), NFR4, NFR13 (keyboard), AR36, AR52, AR53, AR54, AR55, AR56, AR57, AR88, AR89, AR97, AR197, AR198, AR202, AR217, UX-DR83

**Acceptance Criteria:**

**Given** the frame loop in `main.ts`
**When** `frame(now)` runs
**Then** `dt = clamp((now - last) / 1000, 0, 0.25)`, the accumulator grows only while the app is Playing, at most 5 steps run per frame, after 5 steps `acc = min(acc, STEP)`, and `alpha = acc / STEP` is passed to rendering (AR52, AR54)
**And** a Vitest test with synthetic timestamps shows a timestamp that goes backwards runs no step and never makes the accumulator negative, a 1 s hitch runs 5 steps and drops the backlog, and no step runs outside Playing

**Given** the same per-step input stream
**When** it is fed through the loop at 60, 120 and 144 Hz frame intervals, and again with hitches of 0.1 to 0.25 s
**Then** the `World` hash is identical at the same step count in every run, so a slow frame never changes the outcome of a jump (NFR4, AR55)

**Given** the loop and the level host
**When** a frame runs steps
**Then** each step consumes one `InputFrame` from `input.consumeStep()`, `app/levelHost.ts` runs the step, and the frame's `SimEvent`s are collected and handed to rendering, audio and the interface after stepping (AR53, AR57)
**And** `main.ts` wires every layer explicitly, and input reaches the app only through `createInput({ onAppAction })` (AR36)

**Given** an exception thrown inside `runFrame`
**When** `frame(now)` runs
**Then** `requestAnimationFrame` was scheduled before `runFrame`; in development the error is rethrown; in release it is logged with `log.error('loop', 'Frame failed', err)`, `{ type: 'showLevelError' }` is dispatched, and the loop keeps running (AR56, AR197, AR198, AR202)
**And** in this epic the app answers `showLevelError` by leaving Playing for a stopped `levelError` state; the player-facing "Something went wrong" panel is Epic 6
**And** a Vitest test with an injected failing `runFrame` covers both builds

**Given** the keyboard (`input/keyboard.ts`, `input/actions.ts`)
**When** the player presses the play keys
**Then** A/D or ←/→ set `moveX`, W or ↑ set `up`, S or ↓ set `down`, Space, Z or K are jump, and J or X are spit, delivered as one `InputFrame` per step (FR30, NFR13, AR88)
**And** this story leaves the pause, mute and menu keys to the pause story

**Given** a jump or spit key
**When** it is pressed and released within one step
**Then** the next step receives `jumpPressed` (or `spitPressed`) exactly once, and a held key reports `jumpHeld` (or `spitHeld`) until released (FR17, AR89)
**And** the operating system's key auto-repeat never creates a new press
**And** Vitest tests drive these with synthetic key events (AR217)

**Given** the game has focus
**When** a bound key is pressed
**Then** its event calls `preventDefault`, so Space and the arrows never scroll the host page, and unbound keys pass through (AR97, UX-DR83)
**And** a Playwright check reads `defaultPrevented` on synthetic key events; behaviour inside itch.io's iframe is verified on the Epic 6 upload
**And** Playwright checks that need development tools live in `tests/e2e/dev/`; from this story on, `make smoke` runs them against the dev server after the production-build spec (readiness proposal 2026-11-13, Q12)

Note: the architecture puts the accumulator in `main.ts`, which Vitest cannot import without the DOM. This story extracts the accumulator, step cap, alpha and the try/catch wrapper into a pure helper beside `main.ts` and flags it (AR248).

Note: ignoring key auto-repeat is not stated in the sources; it follows from "a press is latched" and stops a held key from firing repeated jumps.

Note: the bug panel that answers `showLevelError` is Epic 6. Until then the app stops stepping in a `levelError` state, so a repeating bug can't flood the console every frame.

### Story 1.5: Draw the level and Rowan as interpolated grey boxes, with gameplay screenshot spots

As a developer,
I want the level and Rowan drawn as grey boxes in the game's look, interpolated between steps, and deterministic screenshots of fixed gameplay spots,
So that I can see the simulation move smoothly and run the critic loop on gameplay from this story on.

**Requirements:** AR41, AR55, AR75 (state-driven view; clip tables are Epic 2), AR76, AR151, AR207, AR212, AR213, AR219, PR14, NFR27, X-B21

**Acceptance Criteria:**

**Given** a loaded level
**When** `render/level/levelView.ts` draws it
**Then** each collision cell is a box on the play plane (z = 0), drawn by its piece kind with Epic 0's shared materials, palette and lighting rig; test levels use the Emberwood palette and rig
**And** one-way ledges read as thin slabs, visibly different from solid ground
**And** until the camera story, the view camera frames a fixed logical view around the `PlayerStart`, so test levels so far fit one screen

**Given** Rowan in the `World`
**When** a frame renders
**Then** he is a capsule 0.72 wide and 0.92 tall with its base at his feet, in Epic 0's character material, drawn at the position interpolated from `prevX`/`prevY` to `x`/`y` by `alpha` (AR55)
**And** views follow the view-sync pattern in `render/actors/`: a `Map<entityId, View>`, views created when missing, updated from state, disposed when their entity is gone, and no simulation object kept between frames (AR76)
**And** rendering receives `DeepReadonly<World>` and never writes it (AR41); shape changes driven by state (the crouch, the blink) come with the stories that add those states

**Given** a level is started again, or another level starts
**When** the previous level view goes away
**Then** `render/assets/dispose.ts` disposes its geometries, materials and textures (AR151)
**And** in the browser, `renderer.info.memory` returns to the same counts after 10 restarts of the same level

**Given** a development build
**When** the game runs
**Then** `debug/devHandle.ts` exposes `window.__emberbound` with `isReady()`, `getState()`, `gotoSpot(id)`, `pause()` and `stepFrames(n)` (AR212), and it is absent from release builds (AR207)

**Given** `?shot=<spotId>`
**When** the page loads in a development build
**Then** `debug/screenshotMode.ts` builds the `World` at the spot through `spawnAt`, pauses the simulation, freezes animation time at the spot's `animTime`, seeds anything random in presentation, and reports ready through `isReady()` (AR213)
**And** `src/debug/spots.ts` exports `SPOTS` (`id`, `level`, `at`, `form`, `animTime`) with a first spot on `test-movement`; each later story adds spots for what it builds

**Given** Epic 0's `tests/e2e/shots.spec.ts`
**When** `make shots ROUND=n` runs
**Then** it also visits every `SPOTS` entry, importing `src/debug/spots.ts` from `tests/` (X-B21), and saves `shots/round-<n>/<spotId>.png` (AR219)
**And** two runs give captures that look identical by eye

**Given** the `test-movement` spot
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round compares the shots with `docs/STYLE_GUIDE.md`, writes down the three biggest problems, fixes them, and checks that the hero stands out from the ground and background at a glance (PR14, NFR27)
**And** the developer sees the before and after shots

### Story 1.6: Move Rowan to the movement feel table

As a player,
I want Rowan to run and jump exactly as the proven feel table says,
So that the first two minutes feel right before anything else is built on top.

**Requirements:** FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, AR47, AR50, AR61, AR64, AR69 (`rowanLanded.impactSpeed`; the sound is Epic 3), AR73, AR74, PR15, PR18, X-B1

**Acceptance Criteria:**

**Given** Rowan on the ground or in the air
**When** horizontal input is held, reversed or released
**Then** on the ground he accelerates at `CONFIG.movement` ground acceleration (70 tiles/s²) to run speed (7 tiles/s), decelerates at 60 tiles/s², and accelerates 1.7 times as hard while turning around (input opposite to his velocity); in the air he accelerates at 40 and decelerates at 16 tiles/s² (FR8, FR9, FR10)
**And** Vitest tests derive time to top speed, stopping distance and turn-around time from `CONFIG`, never from literals

**Given** Rowan in the air
**When** gravity applies
**Then** it is 40 tiles/s², multiplied by 1.35 while falling, with fall speed capped at 18 tiles/s; with jump held and vertical speed between -2.2 and 2.2 tiles/s it is multiplied by 0.55 instead of the fall multiplier (FR11, FR12)

**Given** Rowan on the ground
**When** jump is pressed
**Then** his vertical speed becomes 16.5 tiles/s and `rowanJumped` is emitted; integration is semi-implicit Euler, velocity then position (X-B1)
**And** releasing jump while rising multiplies vertical speed by 0.45 once; releasing while falling changes nothing (FR13, FR14, X-B1)

**Given** the coyote and buffer windows
**When** jump is pressed within `coyoteSteps` (6) after walking off a ledge, or up to `jumpBufferSteps` (7) before landing
**Then** the jump fires, off the ledge or on landing (FR15, FR16)
**And** a press one step outside either window does not jump, and a tap shorter than one step still jumps (FR17)

**Given** Rowan's collision body, 0.72 wide and 0.92 tall, `x` at its centre and `y` at his feet (FR18, AR47)
**When** he moves among solid tiles
**Then** `sim/body.ts` moves and resolves him on X, then on Y, against `sim/tiles.ts` (AR50); landing zeroes his vertical speed and emits `rowanLanded { impactSpeed }`; a ceiling stops his rise
**And** at the maximum fall speed he never passes through a one-tile floor

**Given** the real controller and `CONFIG`
**When** the feel regression test runs on flat ground
**Then** a full jump peaks at 3.30 ± 0.02 tiles, a tap jump (jump pressed and held for exactly one step) at 0.75 to 0.90 tiles, and a full jump spends 52 ± 1 steps in the air (AR64, X-B1)
**And** a press released within its first step still jumps (FR17): the test asserts Rowan leaves the ground and peaks no higher than the one-step tap; `CONFIG` is never changed to make either test pass (readiness proposal 2026-11-13, Q6)
**And** it fails if any value drifts, and is never "fixed" by changing feel-table numbers without the developer

**Given** Rowan's state
**When** he stands, runs, rises or falls
**Then** `PlayerState` takes `idle`, `run`, `jump` or `fall`, decided only in `nextPlayerState`, and `updatePlayerState` resets `stateSteps` on every change (AR73, AR74); later stories add `crouch`, `hurt` and `dead`

**Given** `test-movement` in the browser
**When** the developer plays it on the keyboard
**Then** he signs off that running and jumping feel right before any later mechanic is built (PR18)

### Story 1.7: Add one-way ledges, drop-through and moving platforms

As a player,
I want ledges I can jump up through and drop down through, and platforms that carry me,
So that Level 1 can teach climbing, dropping and riding across a pit.

**Requirements:** FR19, FR20, FR21, FR132 (`CONFIG` values; the check is Story 1.25), AR43, AR50, X-B9, X-B14, PR15

**Acceptance Criteria:**

**Given** a one-way ledge tile
**When** Rowan meets it
**Then** he lands on it only while falling and only if his feet were at or above its top on the previous step; he jumps up through it from below and walks through it sideways (FR19, AR50)

**Given** Rowan standing on a one-way ledge
**When** he holds down and presses jump
**Then** he drops through it, and one-way ledges are ignored for `dropThroughSteps` (13), after which he can land on a one-way ledge below (FR20)
**And** down plus jump on solid ground is a normal jump (X-B14)

**Given** a `MovingPlatform` object in Tiled
**When** the level compiles and runs
**Then** the platform follows its per-instance path and period, moves before Rowan in each step (AR43, slot 4), uses `sim/math.ts` so it is deterministic, and keeps `prevX`/`prevY` for interpolation
**And** `CONFIG` holds the metric limits, at least 3 tiles wide and a peak speed of 5.3 tiles/s or less † (FR132)

**Given** a moving platform
**When** Rowan meets it
**Then** it is solid from above only: he lands on it only from above, passes through its sides and underside, and is never crushed (X-B9)
**And** while he stands on it he is carried by its movement each step, and jumping off adds the platform's velocity to his (FR21)
**And** down plus jump on a moving platform is a normal jump, not a drop-through (FR21)

**Given** `levels/test-platforms.tmj` (a stack of one-way ledges 3 tiles apart, a bridge to drop through, a 3-tile platform over a floored gap; one screen wide)
**When** the developer plays it
**Then** one-way ledges and the platform are drawn as grey boxes in Epic 0's materials, the platform interpolated, and he signs off the feel of landing, dropping and riding
**And** Vitest tests cover each rule above, including a landing from below that must not happen and a jump off a moving platform that keeps its speed

**Given** a spot on `test-platforms`
**When** the critic loop runs (at most 3 rounds)
**Then** each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks that solid ground, one-way ledges and the platform read apart at a glance (PR14, NFR27)
**And** the developer sees the before and after shots

Note: no document says how a moving platform's path is authored. This story uses two end points and a period per `MovingPlatform` instance, with a sinusoidal speed profile, since the GDD caps a "peak" speed.

### Story 1.8: Follow Rowan with the gameplay camera and frame the logical view at any window size

As a player,
I want the camera to look where I'm heading, hold still while I jump, and always show the same play area whatever my window shape,
So that I can see what's coming, and behaviour never depends on my screen.

**Requirements:** FR25, FR26, FR27, FR28, FR193 (window resize), NFR14, AR77, AR78, UX-DR93 (canvas framing)

**Acceptance Criteria:**

**Given** the gameplay camera in `sim/camera.ts`, held in the `World`
**When** Rowan faces a direction or runs
**Then** its horizontal target is 1.2 tiles ahead of him in his facing direction, or 2.4 tiles while running (FR25, AR77)
**And** the target moves toward a new value at `CONFIG.camera`'s look-ahead rate, a † starting value the developer tunes in this story

**Given** Rowan in the air
**When** he rises or falls
**Then** the camera holds still vertically until he is more than 1.8 tiles below or 2.4 tiles above the framing point, then follows (FR26)
**And** when he lands, the camera re-centres on him at `CONFIG.camera`'s re-centring rate (†)

**Given** the logical view, a box from `CONFIG.view` at least 19 × 10.4 tiles centred on the camera
**When** the camera nears a level edge
**Then** it stops so the logical view never shows past the level's bounds (FR27)
**And** `sim/camera.ts` exports the check that decides whether a box is in the logical view; later stories use it for "on screen" (AR78)

**Given** the window is resized, or has a 16:9, 4:3 or 21:9 shape
**When** `render/viewCamera.ts` frames the play plane
**Then** it follows the interpolated simulation camera and shows at least the whole logical view, with extra width or height showing backdrop only (FR28, NFR14, UX-DR93)
**And** a Vitest test of the framing calculation proves the visible play-plane rectangle contains the logical view at all three shapes
**And** resizing re-frames on the next frame (FR193); the simulation's state hash does not depend on the canvas size

**Given** a scrolling test level with tall climbs and both level edges (e.g. `test-camera.tmj`)
**When** the developer plays it
**Then** he signs off the look-ahead and dead-zone feel and the two † rates
**And** Vitest tests cover look-ahead, the dead zone, re-centring and clamping

**Given** spots on the scrolling test level, including one at a level edge
**When** the critic loop runs (at most 3 rounds)
**Then** each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks Rowan and the path ahead read at a glance (PR14, NFR27)
**And** the developer sees the before and after shots

Note: the GDD gives look-ahead distances and the dead zone but no smoothing. The look-ahead and re-centring rates are new † values in `CONFIG.camera`, tuned with the developer in this story.

### Story 1.9: Read standard gamepads safely and track the last-used device

As a player,
I want to play with a standard gamepad as well as the keyboard, and never have a gamepad problem stop the game,
So that I can use the device I like, even inside an iframe that refuses gamepad access.

**Requirements:** FR31 (play buttons), FR32, FR34, FR35 (turned off for the session), NFR8 (gamepad), NFR13, AR90, AR91, AR92, AR175, AR202, AR218 (gamepad failure check), AR234 (input devices), AR235 (`platform/gamepad.ts`), X-B11, X-B19, UX-DR81, UX-DR82

**Acceptance Criteria:**

**Given** a gamepad with the standard mapping (Xbox or PlayStation layout as the browser reports it)
**When** the player uses it
**Then** the left stick or d-pad moves and holds up or down, the south face button jumps, and the west or east face button spits, merged with the keyboard into the same `InputFrame` with the same latching (FR31, NFR13)

**Given** the stick
**When** it is pushed
**Then** it counts sideways past 0.35 and up or down past 0.5, with both thresholds in `CONFIG.input` and passed into `createInput` by `main.ts` (FR32, AR90, X-B19)
**And** Vitest tests check values just under and just over each threshold

**Given** `platform/gamepad.ts` `readGamepads()`
**When** the Gamepad API is missing, refused (including a permission refusal inside an iframe), or a read throws
**Then** the gamepad is off for the session, `log.warnOnce('input', 'gamepad-off', …)` logs once, the keyboard keeps working, and the frame loop keeps running (FR34, FR35, AR91, AR202, NFR8, X-B11)
**And** Vitest tests use throwing stubs
**And** this story leaves the browser smoke check for this case to the placeholder-pause story (1.11), whose pause screen gives the production build something to observe

**Given** a connected gamepad
**When** it disconnects and later reconnects
**Then** the disconnect is reported to `main.ts` (the next story turns it into an auto-pause), and after reconnecting the pad works normally without a reload (X-B11)

**Given** the last-used device (`input/lastDevice.ts`)
**When** the player presses a key or clicks, or presses a gamepad button or pushes a stick past the play thresholds
**Then** the last device becomes keyboard or gamepad respectively, and stick drift under the thresholds never changes it (AR92, UX-DR81)
**And** no code path detects the pad's brand or picks letters, colours or logos from it (UX-DR82)

**Given** one frame
**When** `main.ts` builds the `PresentationSettings` snapshot
**Then** it holds `reducedMotion`, `musicVolume`, `effectsVolume`, `isMuted`, `lastDevice`, `isAudioLocked`, `isFullscreen` and the optional features turned off for the session, read-only (AR175)
**And** fields this epic does not drive yet keep fixed defaults until their epics (`reducedMotion` is `false` until Epic 6)
**And** rendering and the interface read settings, the last device and feature status only from it

Note: the architecture does not say where the `PresentationSettings` type lives. `render/` may not import `app/`, so the story puts it where every presentation layer may import it (e.g. `core/`) and flags it (AR248).

### Story 1.10: Route pause and menu actions to the app, and auto-pause when focus is lost

As a player,
I want Esc, P or Start to pause, menus I can drive with any device, and the game to pause itself whenever I look away,
So that I never lose progress to an alt-tab, a hidden tab or a dropped controller.

**Requirements:** FR30 (pause, mute, confirm keys), FR31 (Start, south confirm), FR33, FR35 (pauses as for a disconnect), NFR8 (visibility, fullscreen), AR54, AR65 (`core/uiTimings.ts`), AR93, AR94, AR95, AR98, AR101, AR111, AR199, AR217, AR235 (`platform/visibility.ts`, `platform/fullscreen.ts`), UX-DR13 (menu repeat timings), UX-DR68, UX-DR75, UX-DR76, UX-DR78, UX-DR85 (pause in play), UX-DR108, X-B11

**Acceptance Criteria:**

**Given** input from any device
**When** the player presses an app-level key or button
**Then** it reaches the app through `onAppAction`, never the `InputFrame`: Esc or P and Start pause; M mutes (keyboard only); arrows or WASD, the d-pad, and the stick past the play thresholds move focus; Enter or Space and the south button confirm; Esc or Backspace and the east button go back (FR30, FR31, AR93, UX-DR75)
**And** menu actions are presses, never held state
**And** with no audio until Epic 3, the mute action only flips `isMuted` in the snapshot

**Given** the app is Playing
**When** the player presses Esc, P or Start
**Then** the app enters Paused, simulation steps stop, and rendering and the interface keep running (AR54, UX-DR85)
**And** in Paused, Back (Esc, Backspace, east), P or Start resumes; nothing else resumes play (AR94, UX-DR76)

**Given** the app is Paused
**When** play resumes
**Then** every play press latched while paused is dropped, so the confirm or Back that resumes never makes Rowan jump or spit on the first step

**Given** the app is Playing
**When** the tab is hidden, the window loses focus, fullscreen is left, the gamepad disconnects, or the gamepad is turned off after an error
**Then** `platform/visibility.ts`, `platform/fullscreen.ts` or `platform/gamepad.ts` reports it to `main.ts`, which clears held input and dispatches one auto-pause command, and the app enters Paused (FR33, FR35, AR111, UX-DR68, UX-DR108, X-B11)
**And** play never resumes by itself: showing the tab or refocusing the window leaves it Paused
**And** two triggers at once give one pause, and outside Playing a trigger only clears held input

**Given** the player is holding right when an auto-pause trigger fires
**When** play resumes with nothing pressed
**Then** Rowan stands still: held keys, directions and buttons were released (AR98)

**Given** the Page Visibility or Fullscreen API is missing or throws
**When** its wrapper starts or reads it
**Then** that trigger turns off for the session with one `warnOnce`, and the game keeps running (NFR8, AR235)
**And** a fullscreen request refused only for lack of user activation is not treated as a failure, so the feature stays available (AR199); the fullscreen toggle that makes requests is Epic 6

**Given** a held menu direction
**When** it stays held
**Then** it repeats after `menuRepeatDelaySeconds` (starting value 0.4 †) at `menuRepeatIntervalSeconds` (starting value 0.125 †, 8 per second), from `core/uiTimings.ts`, created here in seconds (AR95, AR65, UX-DR13, UX-DR78)

**Given** the app state machine and input
**When** `make test` runs
**Then** Vitest tests with synthetic events cover Playing to Paused and back, auto-pause only from Playing, no automatic resume, held input cleared, dropped presses on resume, and hold-to-repeat timing (AR101, AR217)
**And** this story leaves the visible pause surface to the next story; pausing during the death sequence and pit fade is tested when those exist

Note: dropping presses latched during the pause, so the resuming press can't also jump, is not stated in the sources; it applies the card guard's rule (AR96) to resuming play.

### Story 1.11: Show a placeholder pause over a scrim, on the overlay root

As a player,
I want a clear pause screen over a dimmed world, with Resume ready to press,
So that I always know the game is paused and how to get back.

**Requirements:** FR193 (resize), FR195 (placeholder pause), AR113, AR180, AR181 (`menuItem`, `panel`, `scrim`), AR182, AR183, AR184, AR185, AR186, AR188, AR189, AR218 (pause check), AR220, UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR6, UX-DR7, UX-DR8, UX-DR9, UX-DR10, UX-DR12, UX-DR13 (panel and scrim fades), UX-DR14, UX-DR15, UX-DR16, UX-DR23, UX-DR24, UX-DR25, UX-DR39, UX-DR68 (pause surface), UX-DR77, UX-DR80, UX-DR84, UX-DR93, UX-DR100, UX-DR101, UX-DR109, UX-DR110

**Acceptance Criteria:**

**Given** `ui/overlay.ts`
**When** the game starts or the window is resized
**Then** it creates the overlay root above the canvas, stacks layers in DESIGN.md's order (canvas, HUD, scrim, a slot for the Epic 3 mute indicator, panel, and slots for Epic 6's confirm dialog and error panel), and sets `--tile` on the root to `min(100vw / viewWidth, 100vh / viewHeight)` with the logical-view size, margin included, from `CONFIG.view` (AR182, AR183, UX-DR9, UX-DR12, UX-DR110)
**And** `--tile` is recomputed on resize and is about 101 px at 1920 × 1080 and about 67 px at 1280 × 720 (FR193, UX-DR93); no CSS hard-codes it

**Given** any overlay CSS
**When** it sizes, colours or sets type on an element
**Then** every size is a multiple of `--tile` with DESIGN.md's pixel floors, and colour, type, spacing and radii come only from Epic 0's `--{group}-{name}` custom properties; there is no raw hex and `ui/` imports no `render/` palette (UX-DR1 to UX-DR4, UX-DR6 to UX-DR8, UX-DR10, UX-DR15, AR184)
**And** the overlay is judged on the look-dev page against the style guide (UX-DR16)

**Given** the shared components in `ui/components/` (`menuItem.ts`, `panel.ts`, `scrim.ts`), with `ui-` class prefixes (AR181, AR188, UX-DR109)
**When** a screen uses them
**Then** a `menu-item` is a centred `ui-lg` `text-primary` row at least `menu-item-height` tall; focused, it takes the `surface-focus` fill and a `focus-ring` ring that jumps with no tween; there is no disabled state (UX-DR23)
**And** a `panel` is `surface-panel` with a `border-subtle` hairline, `rounded.sm`, `spacing.5` padding and `panel-width`, centred, with no drop shadow, fading over `panelFadeSeconds` (starting value 0.15 †) (UX-DR24)
**And** a `scrim` covers the viewport in `surface-scrim`, fades over `scrimFadeSeconds` (starting value 0.2 †), and never carries muted text (UX-DR25)
**And** these fade values join `core/uiTimings.ts`; screen changes use fades only and animate only opacity and transform (UX-DR13, UX-DR14, AR185)

**Given** the app enters Paused from Esc, P, Start or any auto-pause trigger
**When** `ui/screens/pause.ts` shows
**Then** the world dims under the scrim, and a panel shows one `menu-item`, "Resume", focused (UX-DR68, UX-DR39, UX-DR100, UX-DR101)
**And** confirm or a click on "Resume", or Back, returns to play; the surface never resumes by itself
**And** the full pause menu (Restart level, Settings, Quit, the confirm dialog) is Epic 6

**Given** the pause panel
**When** the player uses the mouse
**Then** hovering moves focus and a click confirms; exactly one item is always focused; the mouse is never required (UX-DR77, UX-DR84)
**And** focus changes and activations call the `playUiSound` callback `main.ts` passes in, a no-op until Epic 3 adds audio

**Given** play starts or a menu opens
**When** the app changes state
**Then** the cursor hides when Playing starts and shows when Paused opens (AR113, UX-DR80)

**Given** the overlay each frame
**When** it reads the app state and `DeepReadonly<World>`
**Then** it touches the DOM only when a value changes, sends commands only to the app, and never shows technical text (AR186, AR189)
**And** with no DOM test environment (AR220), `tests/e2e/smoke.spec.ts`, against the production build as set up in story 0.1 (default X-B20), shows Esc opening the pause with "Resume" focused, Enter resuming, and no console errors (AR218, partial)
**And** the same spec, with `navigator.getGamepads` replaced by one that throws, still opens the pause on Esc and logs no console error besides the one gamepad warning, so a gamepad failure never stops the frame loop (AR218, partial; FR35)

**Given** the pause surface over a test-level spot (the shots spec opens it once the spot is ready)
**When** the critic loop runs (at most 3 rounds)
**Then** each round compares it with DESIGN.md and the style guide, writes down the three biggest problems and fixes them (PR14)
**And** the developer sees the before and after shots

### Story 1.12: Fire the ember spit, aim it, and crouch for the low shot

As a player,
I want to spit embers straight, up or down, hold to keep firing, and crouch to shoot low,
So that I have Rowan's one attack, with the aiming Level 1 teaches.

**Requirements:** FR17 (spit), FR23, FR24, FR43, FR44, FR45, FR46, FR47, AR48, AR72, AR74 (`crouch`), PR15, X-B14 (aim up while running), X-B18

**Acceptance Criteria:**

**Given** Rowan able to act
**When** spit is pressed, or held
**Then** one shot fires per press, and holding fires again every `spitCooldownSteps` (`steps(0.2)`); a tap shorter than one step still fires (FR17, FR44)
**And** each shot flies at 15 tiles/s for `steps(0.55)` (8.25 tiles), carries 1 damage for the enemy stories, and `shotFired { x, y, dirX, dirY }` is emitted
**And** the spit is Rowan's only attack besides the stomp: no melee, no combos (FR43)

**Given** a shot in flight
**When** it moves
**Then** it ignores gravity, is removed when it meets a solid tile, and passes through one-way ledges and moving platforms (FR45)

**Given** Rowan's aim
**When** a shot fires
**Then** it leaves 0.42 tiles in front of him at height 0.48; holding up aims 45° upward from height 0.7, also while running (X-B14); holding down in the air aims 45° downward from height 0.3 (FR46, FR47)
**And** directions come from `sim/math.ts`

**Given** Rowan on the ground
**When** he holds down
**Then** he stops in place but can still turn, his state is `crouch`, and his hurtbox shrinks to 0.72 × `CONFIG.movement.crouchHurtboxHeight` (starting value 0.6 †) while his collision body stays 0.92 tall, so he cannot crawl under a gap lower than that (FR23, AR74)
**And** shots fired while crouched leave horizontally from height 0.3 (FR24)
**And** the spitter story tunes the crouch hurtbox with the developer

**Given** the shot pool, allocated in `createWorld` with its capacity in `CONFIG` and an `isActive` flag
**When** a shot is requested while every slot is active
**Then** the shot is dropped, and no step allocates anything except event objects (AR48, AR72, X-B18)
**And** a Vitest test fills the pool to show it

**Given** `levels/test-combat.tmj`
**When** the developer plays it
**Then** shots are small grey-box shapes in Epic 0's effect material, interpolated, and the crouching capsule is visibly shorter
**And** he signs off the spit's rate, range and aim
**And** Vitest tests cover every rule above

**Given** a spot with shots in flight on `test-combat`
**When** the critic loop runs (at most 3 rounds)
**Then** each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the shots and Rowan stand out from the background (PR14, NFR27)
**And** the developer sees the before and after shots

### Story 1.13: Hurt Rowan on spikes, with hearts, knockback and invulnerability

As a player,
I want spikes that hurt fairly, three hearts, a clear knockback and a moment of safety after each hit,
So that I can tell what hurt me and recover.

**Requirements:** FR60, FR61, FR62, FR63 (invulnerability; the blink is Story 1.17), AR51, AR74 (`hurt`, `dead`), NFR21, PR15

**Acceptance Criteria:**

**Given** a level starts
**When** Rowan appears
**Then** he has 3 hearts; every hit costs 1; nothing in the game adds a heart beyond 3 (FR61)

**Given** a spike tile, which is not solid
**When** Rowan's feet are inside the bottom 0.45 of the tile, narrowed by 0.12 on each side
**Then** he is hurt; feet anywhere else in or over the tile do not hurt him (FR60, NFR21, AR51)
**And** Vitest tests place his feet just inside and just outside each edge of that box

**Given** Rowan is hurt
**When** the hit applies
**Then** he loses 1 heart, is knocked back at 6 tiles/s horizontally away from the source and 11 tiles/s upward from spikes (9 from enemies, used by the enemy stories), has no horizontal control for `knockbackSteps` (17), enters `hurt`, `rowanHurt { source: 'spikes' }` is emitted, and `stats.hitsTaken` goes up by 1 (FR62)

**Given** Rowan was just hurt
**When** another source touches him within `invulnerableSteps` (78)
**Then** he takes no damage, and the counter runs in steps (FR63)

**Given** Rowan has 1 heart
**When** he is hurt
**Then** his hearts reach 0 and his state becomes `dead`, where he stops; this story leaves the death sequence, respawn and checkpoints to the next story

**Given** `levels/test-hazards.tmj` with spikes on flat ground and on a cliff top
**When** the developer plays it
**Then** spike tiles are grey boxes in Epic 0's hazard material, clearly apart from the ground, and he signs off the knockback
**And** a spot is added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the spikes stand out from the ground at a glance (PR14, NFR27); the developer sees the before and after shots

### Story 1.14: Respawn at checkpoints, return from pits and finish at the exit

As a player,
I want checkpoints that catch me, pits that cost a heart instead of a life, and an exit that ends the level,
So that failing is cheap and the level has a goal, with no game over.

**Requirements:** FR2 (Levels 1 and 3: exit), FR4, FR5, FR64, FR65, FR66, FR67 (Rowan's part; the enemy and pickup stories assert theirs), FR125, FR127, AR39 (`spawnAt` a checkpoint), AR87, AR107 (death sequence and pit fade), AR126 (`KillZone`), AR130 (checkpoints, exit), AR172 (canvas fades), UX-DR85, PR15, X-B4, X-B5, X-B6 (clear time), X-B16

**Acceptance Criteria:**

**Given** a `Checkpoint` object in Tiled, with a kebab-case name stored level-scoped (e.g. `emberwood/cp-2`) (X-B16)
**When** Rowan touches it
**Then** it becomes the respawn point, `checkpointReached { checkpointId }` is emitted when the respawn point changes, and his hearts are unchanged (FR127)
**And** before he touches any checkpoint, the respawn point is the level's `PlayerStart` (X-B5)
**And** `createWorld` with `spawnAt: { checkpointId }` starts Rowan there (AR39)

**Given** Rowan's hearts reach 0
**When** the death rule runs
**Then** `rowanDied` is emitted, he is out of control for `deathSteps` (`steps(0.85)`), then he respawns at the respawn point with 3 hearts and `respawnInvulnerableSteps` (`steps(1.0)`), `rowanRespawned { checkpointId }` is emitted, and `stats.respawns` goes up by 1 (FR66, FR5)
**And** there are no lives, no countdown and no game over: every death ends in a respawn (FR4)
**And** nothing else in the `World` is reset beyond the camera and projectile rules below, with one named exception: weapon pickups return (Story 1.21's rule); the enemy and pickup stories assert that killed enemies stay dead and collected embers and bells stay collected (FR67; readiness proposal 2026-11-13, Q13)

**Given** Rowan enters a `KillZone` region, or falls below the level's bottom edge (AR126)
**When** the pit rule runs
**Then** he loses 1 heart, `rowanFellInPit` is emitted, he is out of control for the fade steps in `CONFIG.pit` (starting value 0.5 s †), then he returns to the last stable ground with `invulnerableSteps` (78) (FR64)
**And** a pit return is not a respawn: `stats.respawns` is unchanged (FR5)
**And** if that was his last heart, he dies instead and the death rule runs

**Given** Rowan stands on ground
**When** the step records stable ground
**Then** it records only solid or one-way ground that is not a moving platform and has no spike tile within the hazard clearance in `CONFIG.pit` (starting value 1 tile †) horizontally (FR65, X-B4)
**And** Vitest tests show a moving platform and a ledge next to spikes are never recorded, and a one-way ledge is

**Given** Rowan respawns at a checkpoint or returns from a pit
**When** he is placed
**Then** the camera snaps to him while the screen is faded, with no glide, and every shot in flight is cleared (Story 1.19 clears seeds the same way)
**And** a pit return before any stable ground has been recorded returns him to the respawn point: the last checkpoint, or the `PlayerStart` (X-B5)
**And** Vitest tests cover the snap, the cleared shots, the pit return with no stable ground, and that nothing else changes (readiness proposal 2026-11-13, Q13)

**Given** an `Exit` object
**When** Rowan touches it
**Then** `levelCompleted` is emitted once (FR2)
**And** the exit can't trigger while Rowan is dead or fading after a pit, shown by a Vitest test (readiness proposal 2026-11-13, Q5)
**And** the compiler rejects a non-test level that lacks exactly 3 checkpoints and an exit (FR125, AR130)
**And** until the results story, the app only logs the completion

**Given** `sim/stats.ts`
**When** steps run
**Then** `stats.clearSteps` counts every step, hit-stop and the death sequence included, and nothing while paused, because no step runs (AR87, X-B6)
**And** Vitest tests check `clearSteps` and `respawns` across a death and a pit return

**Given** the death sequence or the pit fade is running
**When** the player pauses, or an auto-pause trigger fires
**Then** the simulation stops and resumes exactly where it was (AR107, UX-DR85)
**And** a Vitest test pauses mid-fade and compares the state hash after resuming with an unpaused run

**Given** `levels/test-hazards.tmj` extended with checkpoints, a pit and an exit
**When** the developer plays it
**Then** rendering darkens the canvas during the pit fade and the death sequence, under the HUD layer, timed from the simulation's counters through `render/fx/flash.ts` (AR172); these are fades, so reduced motion leaves them as they are
**And** he signs off the pit-fade length (†)
**And** spots at a checkpoint and mid-fade are added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the pit reads as a gap and the checkpoint and exit markers stand out (PR14, NFR27); the developer sees the before and after shots

Note: FR127 says touching a checkpoint sets the respawn point. Taken literally, going back to an earlier checkpoint moves the respawn point back. The story follows the literal rule.

Note: `rowanRespawned` carries a `checkpointId`, but before the first checkpoint the respawn point is the `PlayerStart` (X-B5). The story picks the value for that case (e.g. the `PlayerStart` object's id) and flags it (AR248).

Note: no document says whether living enemies reset when Rowan respawns. The story leaves them as they are.

### Story 1.15: Inspect and drive the game with the debug overlay, URL parameters, cheats and input recording

As a developer,
I want to see hitboxes and state, start anywhere, cheat past danger, and record and replay a run,
So that I can tune feel, reproduce any bug exactly, and test the later mechanics quickly.

**Requirements:** AR30, AR45 (browser check), AR99, AR140, AR207, AR208, AR209, AR210, AR211, X-B16, X-B17

**Acceptance Criteria:**

**Given** a development build
**When** the developer presses F1
**Then** the overlay toggles and draws Rowan's collision box and hurtbox, shots, the collision grid with solid, one-way and spike tiles told apart, regions, and the logical-view box; a panel shows the step counter, Rowan's state, hearts and invulnerability steps, and the story state (`none` until Epic 4) (AR208)
**And** each later story adds its entity kinds to the overlay

**Given** the F1 overlay is shown
**When** frames run
**Then** it shows a frame-time graph with the median and 99th percentile over recent frames, and draw calls and triangles from three.js's renderer statistics (AR208)
**And** these numbers are for development only; headless or Playwright timings never count as performance

**Given** a URL such as `?level=test-hazards&checkpoint=cp-2&form=beast`
**When** the game starts in a development build
**Then** it loads that level and starts Rowan at that checkpoint through `params.spawnAt`, taking the short checkpoint id within the given level (AR209, X-B16)
**And** `form` overrides `CONFIG.levelForm` only through this parameter (X-B17)
**And** an unknown level or checkpoint logs a warning and falls back to the level's `PlayerStart`, or to the startup level

**Given** the cheats "invulnerable" and "set hearts"
**When** the developer uses them
**Then** they change the `World` only through `sim/debugCommands.ts`, the one way `debug/` may change it (AR210)
**And** this story leaves the "grant ledge grab" cheat to Epic 4

**Given** `debug/inputRecorder.ts`
**When** the developer records a run, from level start or from a spot the URL parameters set, and saves it to a file
**Then** replaying the file into a fresh `World` reproduces the run step for step, with the same state hash at the end; the file stores the `WorldParams` the run started from, `spawnAt` included (AR211; readiness proposal 2026-11-13, Q13)
**And** the file holds the same `InputFrame` stream format the determinism test uses and the jump search will use, with no test-only path in the simulation (AR99, AR140)
**And** a run recorded in the browser with the input recorder, saved with its final state hash and replayed in Vitest in Node, ends with the same hash, so the simulation is shown to match in the browser and in Node (AR45; readiness proposal 2026-11-13, Q13)

**Given** a release build (`make build`)
**When** its bundle is searched for the debug modules' names
**Then** none of `debug/` is in it, and only `main.ts` imports `debug/`, behind `import.meta.env.DEV` (AR207, AR30)

Note: the fallback for an unknown level or checkpoint in the URL is not stated; this story logs a warning and falls back.

### Story 1.16: Add the walker, with stomps, contact damage and shot hits

As a player,
I want a patrolling walker I can stomp or shoot, that hurts me if I walk into it,
So that Level 1's first enemy teaches both of Rowan's attacks.

**Requirements:** FR48, FR49, FR50 (stompable side), FR58, FR59, FR62 (enemy knockback), FR67 (enemies), FR73, FR75, FR76, FR77, AR70, AR71, NFR21, PR15, X-B9 (walkers don't ride platforms)

**Acceptance Criteria:**

**Given** a `Walker` object in Tiled with a `dir` property
**When** the level is created
**Then** `sim/enemies/index.ts` builds it with `createWalker(def, id)`, ids taken from `world.nextId` in level order (AR70, AR71)
**And** the enemy union admits only the three version-one kinds, each added by its story (FR76)

**Given** a walker
**When** steps run
**Then** it has 1 HP, patrols at 1.6 tiles/s, falls under gravity, turns at walls and at ledge edges, and never rides a moving platform; its hitbox is 0.84 × 0.62 (FR77, X-B9)
**And** its states are `patrol` and `dead`, decided in one function

**Given** Rowan touches a walker
**When** both boxes, each shrunk by 0.08 tiles on every side, overlap and Rowan is not invulnerable
**Then** he loses 1 heart, is knocked back 6 tiles/s away and 9 tiles/s up, and `rowanHurt { source: 'enemy' }` is emitted (FR58, FR62, FR73, NFR21)

**Given** Rowan falling onto a walker
**When** his feet are no lower than 0.35 tiles below its top
**Then** the walker dies, `rowanStomped` and `enemyKilled { by: 'stomp' }` are emitted, and Rowan bounces at 11 tiles/s, or 15.5 tiles/s with jump held (FR48, FR49, FR50)
**And** if a stomp and a contact hit happen in the same step, the stomp wins and Rowan is not hurt (FR49)

**Given** a shot
**When** it overlaps a walker's box grown by 0.12 tiles on every side
**Then** the walker takes 1 damage and dies, `enemyKilled { by: 'shot' }` is emitted, and the shot is removed (FR59)
**And** `enemyHit` is emitted only when an enemy survives a hit, shown by a Vitest test with a walker given 2 HP in the test

**Given** several walkers and a death
**When** they meet each other, or Rowan dies and respawns
**Then** walkers never hurt each other (FR75), and a killed walker stays dead after the respawn (FR67)

**Given** `levels/test-enemies.tmj`
**When** the developer plays it
**Then** the walker is a grey-box block 0.84 × 0.62 in Epic 0's character material, clearly apart from Rowan's capsule, drawn by view sync; the F1 overlay draws its hitbox
**And** he signs off the stomp and contact feel
**And** a spot is added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the walker stands out from the background at a glance (PR14, NFR27); the developer sees the before and after shots

Note: walkers stand on solid and one-way tiles alike, and walk through each other; FR75 only rules out damage.

### Story 1.17: Add hit feedback: hit-stop, shake, blink, flash and burst

As a player,
I want every stomp, kill and hit to land with weight, and to see when I'm safe after being hurt,
So that combat feels punchy and readable.

**Requirements:** FR29, FR63 (blink), FR68, FR69, FR70, FR71, AR44, AR62 (feedback numbers; clip steps are Epic 2), AR171, AR172, AR173, PB52, UX-DR88, X-B6 (hit-stop)

**Acceptance Criteria:**

**Given** a stomp or Rowan being hurt
**When** the combat step applies it
**Then** `world.hitStopSteps` is set to `CONFIG.feedback.hitStopSteps.stomp` (3) or `.rowanHurt` (4); shot kills and death set none (FR68, FR69, FR70, FR71, AR62)
**And** while it is above 0, the step counts it down and skips slots 4 to 11; input buffers keep their presses and do not count down, and `clearSteps` keeps counting (AR44, X-B6)
**And** a Vitest test presses jump during hit-stop and sees the jump fire after it

**Given** `render/fx/shake.ts`
**When** `rowanStomped`, `enemyKilled { by: 'shot' }`, `rowanHurt` or `rowanDied` arrives
**Then** trauma rises to 0.2, 0.12, 0.35 or 0.4 if that is higher than the current trauma, and never adds; the view offset is at most `shakeMaxTiles × trauma²` (2 × trauma²); trauma falls by 1.6 per second of real frame time (FR29, AR171)

**Given** the shake decay
**When** a Vitest test advances the same total time in 1/30 s frames and in 1/144 s frames
**Then** trauma ends at the same value (PB52)
**And** any visual spring added in rendering is sub-stepped at the simulation rate or uses a stable integrator; this epic needs none

**Given** `reducedMotion` in the snapshot (`false` until Epic 6 adds the setting)
**When** it is `true`
**Then** there is no shake, while hit-stop and the blink stay (AR171, AR172)
**And** a Vitest test sets it in the snapshot to show it

**Given** Rowan is invulnerable
**When** frames render
**Then** his capsule blinks at 9 Hz, derived from his invulnerability counter and the step count, so it looks the same at any refresh rate and stops when the counter ends (FR63, FR70, AR173)

**Given** a shot kill, or Rowan's death
**When** rendering handles the event
**Then** a shot kill plays a short burst from a particle pool seeded so screenshot mode captures it the same every time (FR69); death raises trauma to 0.4 alongside the fade from Story 1.14 (FR71); the flash of an enemy that survives a hit comes in Story 1.19, with the first such enemy (readiness proposal 2026-11-13, D3)
**And** no large-area flash runs faster than 3 times a second, and the `warning` colour never fills a large area (UX-DR88)

**Given** `test-enemies` in the browser
**When** the developer stomps, shoots and gets hurt
**Then** he signs off the feel of hit-stop and shake
**And** a spot mid-burst is added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the burst never hides Rowan or an enemy (PR14, NFR27); the developer sees the before and after shots

### Story 1.18: Add the thorn flyer and the thorn rule

As a player,
I want a thorned flyer that drifts on a fixed path, hurts me if I land on it, and dies to one shot,
So that Level 1 can teach shooting low and high, and that thorns mean "don't stomp".

**Requirements:** FR50, FR73, FR78, AR45, PR15, X-B13

**Acceptance Criteria:**

**Given** a `ThornFlyer` object in Tiled with a per-instance `swing` property
**When** the level compiles
**Then** a `swing` outside 0.9 to 1.2 tiles fails the compile (X-B13)

**Given** a thorn flyer
**When** steps run
**Then** it moves around its placed anchor, through walls, swinging ±`swing` tiles horizontally with a 7 s period and bobbing ±0.22 tiles with a 2.7 s period, sinusoidal on both axes using `sim/math.ts` (FR78, X-B13, AR45)
**And** its path is identical in Node and in the browser, covered by the determinism hash and by Story 1.15's check that a run recorded in the browser replays in Node to the same state hash, run here on `test-enemies` with the flyer (readiness proposal 2026-11-13, Q13)

**Given** Rowan lands on a thorn flyer from above
**When** the combat step tests the touch
**Then** he is hurt as by contact (1 heart, knockback 6 away and 9 up), gets no bounce, and no stomp is recorded (FR50, FR73)

**Given** a shot or Rowan's body
**When** the flyer is tested
**Then** it has 1 HP and a 0.74 × 0.74 hitbox: a shot (box grown by 0.12) kills it, and touching it (both boxes shrunk by 0.08) hurts Rowan (FR78, FR73)
**And** a killed flyer stays dead after Rowan respawns

**Given** `test-enemies` with a low flyer and a high one that needs aim-up
**When** the developer plays it
**Then** the flyer is a grey-box block with visible thorns (a spiked silhouette or Epic 0's hazard material on its edges), so it reads as not stompable even in grey box, and he signs off its motion
**And** a spot is added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks that thorned and stompable enemies read apart at a glance (PR14, NFR27); the developer sees the before and after shots

### Story 1.19: Add the rooted spitter and its seeds, and tune the crouch

As a player,
I want a rooted spitter that warns before it fires a seed I can duck, jump or shoot,
So that Level 1 teaches crouching and reading a telegraph.

**Requirements:** FR23 (crouch hurtbox tuned), FR72, FR74, FR79, FR80, FR81, AR72 (seed pool), AR78, PR15, X-B8, X-B10

**Acceptance Criteria:**

**Given** a `RootedSpitter` object in Tiled
**When** steps run
**Then** the spitter is stationary, faces Rowan, has 2 HP, and uses `CONFIG.spitter` for its hitbox (starting value 0.8 × 1.0 †) (FR79)
**And** it cannot be stomped (thorned crown): landing on it hurts Rowan, with no bounce

**Given** a spitter and Rowan
**When** the spitter is inside the logical view and Rowan is within the range in `CONFIG.spitter` (starting value 10 tiles †) horizontally
**Then** it swells for `steps(0.5)` (`spitterSwelled`) and then fires a seed (`seedFired`), on a `steps(2.5)` period that includes the swell; the first swell starts when both conditions first hold (FR80, X-B8)

**Given** a spitter outside the logical view
**When** steps run
**Then** it never starts a swell and never fires (FR74, AR78)
**And** if it leaves the logical view during a swell, no seed fires, and the cycle waits until both conditions hold again

**Given** a seed, from a fixed pool
**When** it flies
**Then** it has a 0.12-tile radius, its centre travels at the seed height in `CONFIG.spitter` above the spitter's ground (starting value 0.75 tiles †), it moves at 5 tiles/s, and it lasts the seed lifetime in `CONFIG.spitter` (starting value 2 s †) (FR81)
**And** a solid tile or an ember shot destroys it, and the shot that hits it is removed too

**Given** a seed reaches Rowan
**When** it is tested against his hurtbox, both shrunk by 0.08
**Then** it hits a standing Rowan and passes over a crouching one (hurtbox 0.72 × `crouchHurtboxHeight`) (FR81, FR23)
**And** a hit costs 1 heart with knockback 6 tiles/s away and 9 tiles/s up, and emits `rowanHurt { source: 'enemyShot' }` (X-B10)

**Given** shots hit a spitter
**When** the first one lands
**Then** `enemyHit` is emitted and the spitter flashes; the second kills it (`enemyKilled`) (FR72)
**And** a killed spitter stays dead after Rowan respawns
**And** every seed in flight is cleared on a checkpoint respawn and on a pit return, as Story 1.14 clears shots, shown by a Vitest test (readiness proposal 2026-11-13, Q13)

**Given** `test-enemies` with a spitter on flat ground
**When** the developer ducks, jumps and shoots
**Then** the spitter is a grey-box block with a thorned crown that visibly swells during the warning, and the seed is a small sphere apart from Rowan's shots
**And** he tunes and signs off the crouch hurtbox height, the spitter's range, hitbox, seed height and seed lifetime (all †), with the final values in `CONFIG`
**And** a spot mid-swell is added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the swell and the seed read at a glance (PR14, NFR27); the developer sees the before and after shots

Note: the sources don't say what happens when a spitter leaves the screen mid-swell, or whether the shot that destroys a seed survives. This story cancels the seed and removes the shot.

### Story 1.20: Collect embers to refill hearts, and find bells

As a player,
I want embers that slowly buy back a lost heart, and three hidden bells to find,
So that following the path heals me and exploring is rewarded.

**Requirements:** FR67 (embers, bells), FR113 (level total), FR114, FR115, FR116, FR117, FR119, AR68, AR130 (3 bells), PR15, X-B12

**Acceptance Criteria:**

**Given** an `Ember` object in Tiled
**When** Rowan touches it
**Then** it is collected, `emberCollected { total }` is emitted, and `stats.embersCollected` goes up by 1
**And** the level data holds the level's total ember count, for the results screen (FR113)

**Given** the ember meter
**When** it reaches `CONFIG.embers.perHeart` (50) with a heart missing
**Then** 1 heart is restored, `heartRestored` is emitted, the meter resets to 0, and any remainder is dropped (FR114, X-B12)

**Given** Rowan at full hearts
**When** the meter reaches 50
**Then** it stops at 50 and waits; the next heart he loses, to a hit or a pit, is refilled at once and the meter resets to 0 (FR116)
**And** embers collected past a full meter count only toward the total (FR116)

**Given** a level in progress
**When** Rowan reaches a checkpoint, returns from a pit, or dies and respawns
**Then** the meter keeps its value; it starts at 0 only when a level starts (FR115)
**And** collected embers stay collected after a respawn, so each ember heals at most once (FR117, FR67)

**Given** a `Bell` object in Tiled with a kebab-case name
**When** Rowan touches it
**Then** `bellFound { bellId }` is emitted, `stats.bellsFound` counts it for this run, and it stays collected after a respawn (FR119, FR67)
**And** the compiler rejects a non-test level without exactly 3 bells (AR130)
**And** the bell toast is Epic 3, and saving bells across runs is Epic 6

**Given** `levels/test-pickups.tmj`
**When** the developer plays it
**Then** embers and bells are grey-box shapes, embers clearly apart from Rowan's shots in shape
**And** a spot is added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks pickups stand out from the background at a glance (PR14, NFR27); the developer sees the before and after shots

Note: no document gives pickup collection box sizes. They are new values in `CONFIG`, marked †, tuned with the developer here.

### Story 1.21: Add the triple shot pickup and the weapon rules

As a player,
I want a triple shot pickup that lasts 20 seconds and survives a fall but not a death,
So that Level 1 can hand me a stronger spit before its combat-heavy stretch.

**Requirements:** FR51, FR53, FR54 (`weaponRunningOut`; the bar is Story 1.22), FR55, FR56, AR68, PR15, X-B6 (weapon timer), X-B7

**Acceptance Criteria:**

**Given** a `WeaponPickup` object in Tiled with `weapon: 'tripleShot'`
**When** Rowan touches it
**Then** it is removed from the level, Rowan's weapon becomes the triple shot, `weaponCollected { weapon: 'tripleShot' }` is emitted, and the weapon timer starts at `steps(20)` (FR53)

**Given** Rowan holds the triple shot
**When** he spits
**Then** 3 shots fire, at the aim and at ±0.16 rad around it, with speed, range and cooldown unchanged (FR51)
**And** if the pool cannot hold all three, the extra shots are dropped

**Given** Rowan already holds a weapon
**When** he takes another pickup
**Then** it replaces the current weapon and restarts the timer from 20 s (FR53)

**Given** the weapon timer
**When** steps run
**Then** it counts down in the combat step, so it holds during hit-stop and while paused (X-B6)
**And** `weaponRunningOut` is emitted once at the warning time left in `CONFIG.weapons` (starting value 3 s †) (FR54), and at 0 `weaponExpired` is emitted and the spit returns to single shots

**Given** Rowan holds a weapon
**When** he falls into a pit, or dies
**Then** he keeps it through the pit return, and loses it on death (FR55)
**And** when he respawns, every weapon pickup taken in the level, used up or lost and wherever it was, is back in its place (FR56, X-B7)

**Given** `test-pickups` with a triple shot pickup and a few walkers
**When** the developer plays it
**Then** the pickup is a grey-box shape apart from embers and bells; the warning time (†) is signed off in Story 1.22, where the bar's blink shows it (readiness proposal 2026-11-13, D4)
**And** a spot is added, and the critic loop runs (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the triple shot's three shots stay readable against the background (PR14, NFR27); the developer sees the before and after shots

### Story 1.22: Show the placeholder HUD: hearts, ember meter and weapon timer

As a player,
I want to see my hearts, my ember meter and my weapon's time left at a glance, in a corner that never covers play,
So that I always know how safe I am without reading a number.

**Requirements:** FR54 (placeholder bar), FR194 (placeholder), FR195, AR174, AR186, UX-DR3, UX-DR5, UX-DR13 (HUD timings), UX-DR14, UX-DR17 (placeholder), UX-DR18 (placeholder), UX-DR19 (placeholder), UX-DR39, UX-DR40, UX-DR41, UX-DR50, UX-DR69 (death, respawn, pit), UX-DR86, UX-DR87, UX-DR88

**Acceptance Criteria:**

**Given** `ui/screens/hud.ts`
**When** play is shown at any window size
**Then** the top-left cluster sits `spacing.safe-margin` in from the corner: three hearts at `spacing.hud-icon`, `spacing.1` apart; the ember meter `spacing.2` below; the weapon timer `spacing.4` right of the meter, centred on its line; the cluster stays within about 3 × 0.75 tiles and nothing sits mid-screen or at the bottom (UX-DR40)
**And** every element has an opaque `hud-outline` ring plus a soft shadow of the same colour, every bar sits in `hud-track`, and there is no plate (UX-DR5)
**And** the bell toast and mute indicator are Epic 3, the warden bar Epic 4

**Given** the hearts
**When** `rowanHurt` or `rowanFellInPit`, `heartRestored`, a last heart, or `rowanRespawned` arrives
**Then** there are always three slots; filled hearts use `heart-fill` and a lost heart is a `heart-empty` outline around `hud-track`; the rightmost filled heart empties with a crack (`heartCrackSeconds` in `core/uiTimings.ts`, starting value 0.15 †) and an icon shake; a restored heart pops (`heartPopSeconds`, starting value 0.15 †) after the ember transfer; at one heart the last heart pulses by scale at 2 Hz or less until healed or respawned; on respawn all three refill (UX-DR17, UX-DR69)

**Given** the ember meter
**When** embers are collected or a heart is restored
**Then** its `ember` fill grows by length from 0 to 50, left to right, from the simulation's count, with square ends; full with full hearts it holds a steady `ember` glow (`spacing.3` blur, no pulse); on a restore it drains into the heart within `emberTransferSeconds` (starting value 0.3 †), then the heart pops; embers past a full meter change nothing (UX-DR18)
**And** `ember` is the only warm colour in the overlay (UX-DR3)

**Given** the weapon timer
**When** `weaponCollected`, `weaponRunningOut`, `weaponExpired`, `rowanDied` or `rowanFellInPit` arrives
**Then** it appears with a placeholder triple-shot icon; its `weapon-timer` bar reads the simulation's remaining steps (never its own clock) and drains right to left; a new pickup swaps the icon and refills it; on `weaponRunningOut` the bar blinks at 3 Hz or less between `warning` and empty track; it hides on `weaponExpired` and on death, and stays through a pit fall (UX-DR19, FR54)
**And** the blink is the visual twin of Epic 3's warning sound (UX-DR87)
**And** on `test-pickups`, the developer signs off the warning time in `CONFIG.weapons` (†) against the blink (readiness proposal 2026-11-13, D4)

**Given** the app's state
**When** play, the death sequence, the pit fade, Loading or Paused is shown
**Then** the HUD shows through all of play, the death sequence and pit fade included (the canvas fades under it), is hidden while Loading, and sits under the scrim while Paused (UX-DR41, UX-DR50, UX-DR69)
**And** there is no clock, score, bell counter, minimap, damage vignette or edge tint (UX-DR41)

**Given** the HUD each frame
**When** it reads the app state, `DeepReadonly<World>` and the snapshot
**Then** it touches the DOM only when a value changes, animates only opacity and transform, and times every animation in seconds (AR186, UX-DR14)
**And** the HUD's animation choices (pulse, shake, crack, pop, blink) come from a pure function in `ui/` of the World's read-only state (hearts, meter, weapon time), the presentation snapshot and the frame's events, which Vitest tests in Node run with `reducedMotion` off and on: on, the last-heart pulse and the icon shake stop and the crack stays (AR174); the setting itself is Epic 6
**And** until then, a development-only URL parameter, `reducedMotion=1`, sets the snapshot value for the browser check (readiness proposal 2026-11-13, Q12)
**And** nothing relies on colour alone: hearts are counted shapes, meters read by length, the timer carries an icon (UX-DR86); no large area flashes (UX-DR88)

**Given** the HUD uses Epic 0's token values and placeholder icons (heart, triple shot) that this story draws as simple single-colour silhouettes in the icon style `docs/STYLE_GUIDE.md` records; the final icon set and the judgement in play are Epic 3
**When** the critic loop runs on the brightest and busiest test-level spots (at most 3 rounds)
**Then** each round compares the HUD with DESIGN.md and the style guide, writes down the three biggest problems, fixes them, and checks every HUD element reads against the backdrop (PR14, NFR27)
**And** the developer sees the before and after shots

### Story 1.23: Show basic results at the end of a level

As a player,
I want a short, plain summary when I reach the exit: my time, bells, respawns and embers,
So that I know how the run went, with no judgement attached.

**Requirements:** FR2, FR4, FR5, FR181 (basic), FR195, AR87, UX-DR29 (basic), UX-DR39, UX-DR55 (basic), UX-DR100, UX-DR101, UX-DR102, UX-DR103, X-B24 (results input)

**Acceptance Criteria:**

**Given** `levelCompleted` arrives
**When** the app handles it
**Then** it enters Results and stops simulation steps; the world dims under the scrim and the HUD stays under it; a panel shows the results; the cursor shows (FR2, UX-DR55)

**Given** the step that emits `levelCompleted`
**When** later steps run, in the same frame or after
**Then** that step was the `World`'s last: `step()` returns at once, so they change nothing and the clear time is final (AR87)
**And** a Vitest test runs a 5-step frame across the exit and finds the clear time, hearts and Rowan's position unchanged after `levelCompleted`, which reaches the app once (readiness proposal 2026-11-13, Q5)

**Given** `ui/screens/results.ts`
**When** the panel shows
**Then** it lists four `results-stat` rows in this order: "Clear time", "Bells", "Respawns", "Embers", each label in `ui-md` `text-muted` on the left and each value in `numeric-lg` `text-primary` on the right with tabular figures and one shared right edge; rows are `spacing.3` apart, with `spacing.5` before "Continue" (FR181, UX-DR29, UX-DR39, UX-DR100)
**And** the values are the clear time as `m:ss.s`, bells as "x of 3", respawns as a plain number, and embers as "x of <level total>" (UX-DR102)

**Given** `stats.clearSteps`
**When** it is formatted
**Then** it becomes `m:ss.s` with tenths truncated, excluding pauses because no steps run while paused (AR87)
**And** a Vitest test of the pure formatter covers 0 steps ("0:00.0"), a time just under a minute, and a time over ten minutes

**Given** any run
**When** the results show
**Then** respawns look exactly like every other row, with no comment and no colour; there are no lives, score, rank or game-over words (FR4, FR5, UX-DR101, UX-DR103)

**Given** the "Continue" `menu-item`, focused
**When** the player presses confirm or clicks it
**Then** the level just played restarts from its start, with a fresh `World` and run stats
**And** Back is ignored on this screen (X-B24)
**And** the stagger, the "New best" tag and the two-press guard are Epic 6

**Given** a spot at a test level's exit, stepped one frame so the results show
**When** the critic loop runs (at most 3 rounds)
**Then** each round compares the results surface with DESIGN.md and the style guide, writes down the three biggest problems and fixes them (PR14)
**And** the developer sees the before and after shots

Note: with no title gate until Epic 3 and no level select until Epic 6, Continue restarts the level just played. This is the simplest flow that keeps the build playable; Epics 3 and 5 replace it.

Note: the sources give the `m:ss.s` format but not whether tenths round or truncate. Truncating keeps a shown time from beating the real one.

### Story 1.24: Prove every marked jump with the real simulation

As a developer,
I want an automated search that proves every jump I mark in a level can be made with the real simulation and tuning,
So that no level ever ships a jump that is impossible, or possible only by luck.

**Requirements:** AR127 (`jumps` layer), AR136, AR137, AR138, AR139, AR140, AR143, AR216, PR16

**Acceptance Criteria:**

**Given** `Jump` objects in a level's `jumps` layer
**When** the level compiles
**Then** each becomes a `JumpMark` with `id`, a `from` point, a `to` area, a `tier` (standard or challenge) and the required `ability` (AR127, AR136)

**Given** a mark
**When** `patterns(mark)` runs
**Then** it yields a bounded set of input patterns, most likely first: run-up steps, direction, the step jump is pressed on, how long it is held, air steering, and waiting steps that pick a moving platform's phase (AR137)
**And** ledge-grab climbs are added in Epic 4

**Given** a mark and a pattern
**When** `tryJump(level, mark, pattern)` runs
**Then** it creates a `World` with `spawnAt: mark.from` and the level's form, feeds the pattern as `InputFrame`s through the real `step()`, and passes only if Rowan stands grounded with his feet in `to`, is not dead and has `hitsTaken === 0`, within `JUMP_MAX_STEPS` (defined in the test file) (AR138)
**And** the first success ends the search, and the simulation has no test-only path; `spawnAt` is the same option the debug URL uses (AR140)

**Given** `tests/levels/jumpSearch.ts` and `tests/levels/jumps.test.ts`
**When** `make test` runs
**Then** there is one test per mark per level, titled `` `${level.id}: jump ${mark.id} is possible` `` (AR139)
**And** a failure names the level and mark

**Given** `levels/test-jumps.tmj` with a 4-tile gap, a 3-tile step-up, a drop through a one-way ledge and a ride on a moving platform that needs waiting
**When** the search runs
**Then** every mark passes
**And** a separate fixture with a deliberately impossible mark (a gap wider than any jump) shows the search fails it, so the test can fail

**Given** a level changes
**When** `make test` runs
**Then** the search runs in Node with no rendering, on every level (AR143, AR216, PR16)

### Story 1.25: Check the main path, the platforming metrics and the level caps

As a developer,
I want the compiler and the level tests to check the main path's coverage, the GDD's platforming metrics and the difficulty caps,
So that a layout breaking the rules fails `make test` before anyone plays it.

**Requirements:** FR126, FR129, FR130, FR131, FR132, FR133, FR134 (compile check), FR135 (check), AR130 (checkpoint safety, challenge cap), AR141, AR142, AR216, PR17

**Acceptance Criteria:**

**Given** a compiled level
**When** the coverage check runs
**Then** it lists the main path, the ground segments from `PlayerStart` through every checkpoint to the exit, and fails, naming the spot, if any break or rise of more than 1 tile between consecutive segments has no jump mark (AR142)

**Given** `CONFIG`'s metric values
**When** the static checks run
**Then** using `CONFIG.levelMetrics`, they fail on a gap at equal height over 4 tiles, or 5 for a challenge-tier mark (starting values †); a step-up over 3 tiles, with 1 tile the short-hold step (starting values †); less than 5 tiles of clear space above a full-jump take-off unless the mark says the ceiling is intended (starting value †); a moving platform under 3 tiles wide or with a peak speed over 5.3 tiles/s (starting values †); or one-way ledges more than 3 tiles apart vertically (starting value †) (FR129, FR130, FR131, FR132, FR133, AR141)

**Given** challenge-tier marks
**When** the compiler checks them
**Then** each must be close to a checkpoint, and the level's share must be within its cap in `CONFIG.levels` (Level 1: none, starting value †) (FR134, AR130)

**Given** enemies and the main path
**When** the enemy cap check runs
**Then** at camera positions along the main path, the enemies whose start position or movement bounds fall inside the logical view never exceed the level's cap in `CONFIG.levels` (Level 1: 2, starting value †) (FR135)

**Given** each checkpoint
**When** the compiler checks it
**Then** it stands on solid ground that is not a moving platform, with no enemy within the checkpoint distance in `CONFIG.levels` (starting value 8 tiles †) and no spike within the stable-ground clearance (FR126, AR130)

**Given** each check above
**When** `make test` runs
**Then** a fixture level that breaks it makes it fail with a message naming the level, the rule and the spot (AR216)
**And** the developer reviews the † metric values against play on the test levels and signs them off (PR17)

**Given** a level whose file name starts with `test-`
**When** the checks above run
**Then** every check in this story skips it, as the content rules do (Story 1.2), and the fixtures that prove each check can fail are named without the prefix
**And** Story 1.24's jump search still runs on its marked jumps (readiness proposal 2026-11-13, Q13)

Note: the GDD names an intended ceiling and "close to a checkpoint" without a way to mark one or a distance. This story adds an optional `isCeilingIntended` property on `Jump` marks and a † checkpoint distance for challenge jumps in `CONFIG`.

Note: enemies move, so the enemy cap uses each enemy's start position and movement bounds (a walker's ground segment, a flyer's swing and bob, a spitter's spot) as an approximation of what can be on screen at once.

### Story 1.26: Build grey-box Level 1 to the teaching order

As a player,
I want to play Emberwood from start to exit in grey boxes, learning every move and enemy in a sensible order,
So that the layout is proven fun and fair before any art goes on it.

**Requirements:** FR113, FR119, FR125, FR126, FR136, FR137, FR138, FR139, FR140, FR141, FR143, FR145 (grey box), FR146, FR147, FR148, FR149, FR150, FR151, AR134, AR219, NFR17, NFR18, NFR19, NFR36, PR16, PR19

**Acceptance Criteria:**

**Given** `levels/emberwood.tmj`
**When** it compiles
**Then** it is a standard level: side-scrolling and linear, left to right with vertical variation, within the level height in `CONFIG.levels` (starting values 18 to 24 tiles †), with 3 checkpoints, 3 bells and an exit marker where the wedding glade's arch will stand; nothing locks off an area (FR141, FR143, FR145)
**And** `content/levels.ts` holds its id `emberwood`, its order and the display name "Emberwood", and the game now starts in Emberwood in every build, replacing Story 1.3's placeholder strip (AR134)
**And** its length starts from the prototype's 146 tiles; the exit story measures the pace

**Given** the start to checkpoint 1
**When** the developer plays it
**Then** it has, in order: a run on flat ground, a small step, a tall step that needs a held jump, a gap, stompable walkers, a low thorn flyer to shoot, and a high flyer that needs aim-up (FR146)

**Given** checkpoint 1 to checkpoint 2
**When** the developer plays it
**Then** it has a rooted spitter on flat ground where he can choose to crouch, jump or shoot, a moving platform over a pit, and one-way ledges to climb (FR147, FR140)

**Given** checkpoint 2 to the exit
**When** the developer plays it
**Then** checkpoint 2 to 3 has spikes on a cliff top, a bridge that must be dropped through, and the triple shot below it; checkpoint 3 to the exit has mixed enemies that reward the triple shot, then a calm walk to the exit (FR148, FR149)
**And** intensity is low, rising to medium in the last section, with no more than 2 enemies on screen and no challenge-tier jumps (the `CONFIG.levels` caps, starting values †) (FR151)

**Given** the layout
**When** the developer reviews it against the teaching rules
**Then** every new element is introduced where failure is cheap, with no pit under it, practised once safely, combined with something known, and tested before the next checkpoint (FR136); Level 1's new tools are the base moves and the triple shot (FR137)
**And** each enemy is visible for at least 1 s before Rowan can reach it at full run speed, no enemy sits on the landing spot of a jump the player can't see, and each section ends in a calm spot at a checkpoint (FR138, FR139, FR125, FR126)

**Given** the collectables
**When** they are placed
**Then** the ember count is within `CONFIG.levels` (starting values 100 to 150 †), tracing jump arcs from the first gap onward, enough for a first heal by mid-level; the 3 bells are spread across sections 2 to 4 (FR113, FR150, FR119)

**Given** `make test`
**When** it runs on Emberwood
**Then** compile validation, the jump search with every main-path jump marked, the coverage check, the metric checks and the caps all pass (PR16)
**And** collision comes only from the `collision` layer (NFR36)
**And** `SPOTS` gains `l1-start`, `l1-glade` and at least one spot per section, including the brightest and the busiest (AR219)

**Given** grey-box Level 1 in the browser
**When** the developer plays it start to finish on keyboard and on gamepad
**Then** sections aim at 60 to 120 s of first play each, no single failure costs more than about 120 s of replay, and first-play respawns aim at 5 or fewer †; the exit story measures them (NFR17, NFR18, NFR19)
**And** the critic loop runs on every Level 1 spot (at most 3 rounds): each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the hero, enemies, hazards and pickups stand out at a glance (PR14, NFR27, PR19); the developer sees the before and after shots

### Story 1.27: Place the control signs and swap them with the last-used device

As a player,
I want a small wordless sign showing the right key or button the first time I need each action,
So that I learn the controls from the world, on whichever device I'm using.

**Requirements:** FR37, FR38, FR39, FR40, FR41, FR42, AR150 (icons), AR151 (sign textures), AR176 (placement and swap; art is Epic 3), UX-DR38 (placeholder), UX-DR43, UX-DR101, UX-DR103, NFR43

**Acceptance Criteria:**

**Given** a `ControlSign` object in Tiled with `action` one of `move`, `jump`, `spit`, `aimUp`, `crouch`, `dropThrough`
**When** Emberwood compiles
**Then** it has six signs, each at the first place its action is needed (FR37, FR38)
**And** the compiler rejects a `ControlSign` in any level other than `emberwood`, and no action exists for ledge grab (FR38)

**Given** placeholder glyph images in `public/assets/icons/`, named with the `icon-` prefix
**When** the game starts
**Then** they are listed in the manifest's shared bundle and loaded by manifest id through `render/assets/loader.ts` (AR150)
**And** the keyboard set is a keycap outline with its legend, and the gamepad set is a diamond of four circles with the one to press filled, plus direction glyphs for the stick and d-pad; all monochrome, with no platform letters, colours, shapes or logos (UX-DR38)
**And** they are logged in `docs/ASSETS.md` as hand-made placeholders, not AI-generated (NFR43); the final set is Epic 3

**Given** the keyboard set
**When** a sign shows it
**Then** it shows only the arcade keys: ← → to move, ↑ to aim up, ↓ to crouch, Z to jump, ↓ + Z to drop through, X to spit; no other bound key is ever shown (FR40, UX-DR43)

**Given** the gamepad set
**When** a sign shows it
**Then** it shows button positions only: the jump sign lights the south button, the spit sign the west button, move, aim up and crouch show direction glyphs, and drop-through shows down plus south (FR41)

**Given** `render/level/controlSigns.ts`
**When** the last device in the snapshot changes
**Then** every sign, drawn as a grey-box carved waymarker with its icon, shows the new set on the next frame (FR39, AR176)
**And** a Playwright check presses a key, then a stubbed gamepad button, and reads the shown set through the dev handle

**Given** the signs in play
**When** Rowan, enemies and shots pass them
**Then** the signs sit behind the play layer, carry no words, and never cover the play area; nothing on screen teaches with text (FR42, UX-DR101, UX-DR103)
**And** sign textures are disposed with the level (AR151)

**Given** spots at each sign, captured once with each device set
**When** the critic loop runs (at most 3 rounds)
**Then** each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks each sign reads at a glance without covering play (PR14, NFR27)
**And** the developer sees the before and after shots

### Story 1.28: Measure the grey-box pace, sign off the feel and close the epic

As a developer,
I want to measure how long grey-box Level 1 takes to play, confirm every mechanic is tested and feels right, and approve the epic,
So that Epic 2 starts on a proven core and the level length in tiles comes from real play.

**Requirements:** PR8, PR14, PR15, PR18, PR19, PR20, NFR4, NFR13, NFR17, NFR18, NFR19, NFR23 (pace measured), NFR27, AR221

**Acceptance Criteria:**

**Given** the finished epic
**When** `make check` runs
**Then** lint, the format check, the type check and `make test` all pass (AR221)
**And** a list in the story notes maps every simulation rule in this epic's requirements to its unit test, and any gap is filled before sign-off (PR15)

**Given** recorded runs of grey-box Level 1 (the input recorder)
**When** they are replayed
**Then** each section's time and tile span come from the `checkpointReached` and `levelCompleted` steps and Rowan's position
**And** the developer chooses which runs stand for first-play pace

**Given** the measured pace
**When** tiles per minute are worked out
**Then** the level-length target in tiles for a 6 to 8 minute first play is set, starting from the prototype's 146 tiles, written in the story notes, and proposed to the developer as a GDD update through its own workflow; Epic 5's exit checks it again (PR20, NFR23)

**Given** the same runs
**When** sections and failures are checked
**Then** each section takes 60 to 120 s, no single failure costs more than about 120 s of replay, and first-play respawns are within 5 or fewer † where a first-time run exists (NFR17, NFR18, NFR19)
**And** any miss becomes a fix to the grey box now, or a listed item for Epic 3's final layout

**Given** the developer plays the whole level on keyboard and on a standard gamepad, on a 60 Hz display and, if one is available, a 120 or 144 Hz display
**When** he works through PR8's list: moves, the three enemies, spikes, hearts, the pit rule, checkpoints, embers, bells, triple shot, hit feedback, control signs, camera, input
**Then** he signs off that each works and feels right, and that play is the same at every refresh rate (PR8, PR18, NFR4, NFR13)
**And** every † value tuned in this epic is listed in the story notes with its final value

**Given** every Level 1 spot
**When** the final critic loop runs (at most 3 rounds)
**Then** each round compares the shots with the style guide, writes down the three biggest problems, fixes them, and checks the hero, enemies, hazards and pickups stand out at a glance (PR14, NFR27)
**And** the developer sees the before and after shots

**Given** the criteria above are met
**When** the developer reviews the epic
**Then** he approves grey-box Level 1 as the proven layout that Epic 3's art will dress, and Epic 1 closes; the retrospective follows (PR8, PR19)

Note: the sources say to measure "first-play pace" on the grey box but not whose play counts. The developer knows the level, so he picks the runs that stand for a first play (for example a friend's first run, or his own careful run) and says which in the notes.

Note: PR20 sets the tile length from this measurement but names no document to hold it. The story writes it in its notes and proposes the GDD change through the GDD's own workflow, since CLAUDE.md requires settled artifacts to change only that way.

---

## Epic 2: Hero

The player sees Rowan, stage 1, fully animated and matching his concept, playing the grey-box level; the AI-mesh pipeline is proven on one character before any level art.

**In scope:**

- **Tools, before any mesh:** Tripo's licence and commercial-use terms checked and logged in `docs/ASSETS.md` (PR26); Blender pinned; the Blender MCP set up from its current documentation (AR159).
- **Who runs the generators** (tools decision 2026-11-13): on the Tripo Pro plan, the developer runs Tripo in its web app, and the Gemini app for any fallback views, and saves each file in `art-src/`. The agent prepares the prompts and inputs, checks every result and logs it. Driving Tripo through its API, its MCP server or its CLI needs the developer's approval, its spend in the budget and its terms logged first.
- **The asset pipeline** from `docs/PROJECT_BRIEF.md` §7 (PB59), run for Rowan in stage 1:
  1. the reference concept signed off in Epic 0
  2. four views (front, back, left, right) made from that concept with Tripo's own multiview tool, or in the Gemini app if Tripo's views don't agree (tools decision 2026-11-13)
  3. the Tripo mesh
  4. clean-up in Blender through the MCP: scale and origin, polygons, materials, named parts
  5. rig
  6. animate
  7. export, then `make models` (meshopt, quantization, the scale and origin check)
  8. the game's own look: generated materials replaced by the `render/materials` factories, checked on the look-dev page
  9. every asset and tool logged in `docs/ASSETS.md`
- **The fallback** (NFR35): a simpler model built by hand in Blender if the generated mesh won't deform cleanly, or if Tripo's terms rule it out. The epic succeeds on either route.
- **The 11 base animations,** with the clip names from AR155: `idle`, `run`, `jump`, `fall`, `land`, `spit`, `spit_up`, `spit_down`, `crouch`, `hurt`, `death`.
- **Named parts** for stage 1 per AR156 (`horn_left`, `horn_right`, `claw_right`) on one skeleton, built so Epic 4 can add and toggle the stage-2 parts without re-rigging or re-animating (AR166).
- **Animation follows play** in every gameplay state: `CLIP_FOR_STATE` and `chooseHeroClip`, which returns `{ base, overlay }`: the spit clips as upper-body overlays, `land` replacing `idle` briefly (AR75; sprint change proposal 2026-11-13, A8), the clip steps tuned with the developer (AR62). This includes the hurt blink, death and respawn, crouch, aim up and down, the spit overlay while running or in the air, pause and hit-stop.
- Rowan replaces the placeholder in grey-box Level 1, through Epic 1's view sync by entity id.
- The critic loop on look-dev and gameplay spots, the hero's 2 MB budget checked by `make build`, and the developer's sign-off.

**Out of scope:** stage 2 (`horn_right_broken`, `hand_right`, the dimmer chest glow) and the `hang` and `climb_up` clips (Epic 4); enemy, pickup, marker and kit models (Epic 3); Rowan's sounds (Epic 3); final Level 1 art (Epic 3); any change to a simulation rule or tuned gameplay number, beyond the presentation-only player fields the clip choice reads.

**Depends on:**

- Epic 1, done and approved: grey-box Level 1 with a placeholder Rowan, view sync by entity id, asset loading and the manifest, the F1 debug overlay, the dev handle and screenshot mode.
- Epic 0: the signed-off hero concept, `docs/STYLE_GUIDE.md`, the materials factories, palettes and lighting, the look-dev page with renderer statistics, the screenshot harness and the budget checker.
- The image model the developer chose (the Gemini app), with its terms logged in `docs/ASSETS.md`.
- The Tripo Pro plan ($20 a month, 3,000 credits a month), taken monthly from Story 2.1, with Tripo's terms logged (Story 2.1) before any image is uploaded or mesh generated (tools decision 2026-11-13).

**Playable deliverable:** Rowan, stage 1 with all 11 base animations, playing grey-box Level 1 in the browser, and shown under the game's look on the look-dev page.

**Exit criteria:** Rowan matches the concept in the critic loop and animates cleanly in every state.

### Story 2.1: Clear Tripo's terms and set up Blender and the Blender MCP

As a developer,
I want Tripo's terms checked and logged, Blender pinned, and Claude Code able to drive Blender through the Blender MCP,
So that no mesh is made under terms the game can't ship with, and every later pipeline step runs on known, repeatable tools.

**Requirements:** PR26 (Tripo), AR159 (Blender MCP set-up), PB59 (step 7, tool logging), NFR43
**Depends on:** the Tripo Pro plan in the GDD's tool budgets ($20 a month), which the developer takes, billed monthly, at the start of this story (tools decision 2026-11-13).

**Acceptance Criteria:**

**Given** Tripo is the planned mesh tool and nothing has been uploaded to it yet
**When** the developer and the agent read Tripo's current terms of service, licence and pricing pages
**Then** `docs/ASSETS.md` has a Tripo entry that records: the plan used; whether that plan's outputs may be used in a game sold commercially; who owns the outputs; any attribution requirement; whether that plan makes outputs or uploaded images public or uses them for training; the date checked; and the page addresses
**And** the entry exists before any image is uploaded to Tripo (PR26)
**And** it also records whether the terms cover the images Tripo's own image tools make (the four views come from its multiview tool), whether the plan's credits pay for API, MCP or CLI use or only for the web app, and whether the commercial rights to outputs made on the plan survive cancelling it (tools decision 2026-11-13).

**Given** the terms don't allow the use on a plan within the tool budget, or carry a condition the developer rejects
**When** the check ends
**Then** nothing is uploaded to Tripo, `docs/ASSETS.md` records why, and the epic continues on the hand-built route: a simpler model built in Blender from the reference views, which are then made in the Gemini app, since Tripo's multiview tool is ruled out too (tools decision 2026-11-13)
**And** the story still closes, because every later story in this epic works on either route.

**Given** Blender is needed for clean-up, rigging, animation and export
**When** its version is pinned
**Then** one exact Blender version is pinned the way Epic 1 pinned Tiled: through `mise.toml` if a mise backend can install it, otherwise recorded and checked by `make setup`
**And** `make setup` reports a missing Blender or a different version the same way it does for Tiled
**And** Blender is logged in `docs/ASSETS.md` with its licence.

**Given** the Blender MCP named in CLAUDE.md's stack
**When** it is installed from its current documentation, not from memory (AR159)
**Then** its version, its licence and the install steps actually used are recorded in `docs/ASSETS.md`
**And** a smoke test passes: through the MCP, Claude Code drives the pinned Blender to create, inspect and delete an object in a scratch file, and captures a viewport image that the agent looks at
**And** any asset-download or generator integration the MCP offers stays off unless the developer approves it and its terms are logged first
**And** no API key, token or account secret, Tripo's included, is committed; keys live only in local, git-ignored configuration.

Note: CLAUDE.md and the architecture say "Blender MCP" without naming a server. If more than one server matches, the developer picks one before install.

### Story 2.2: Make Rowan's four reference views and his Tripo mesh

As a developer,
I want front, back, left and right views of Rowan drawn from his signed-off concept, and a mesh made from them in Tripo,
So that the pipeline starts from one consistent design, and the mesh is judged fit for rigging before any clean-up work.

**Requirements:** FR210 (model input), NR56, NR58 (stage 1), PB59 (steps 1 to 3, and 7), AR154, AR158
**Depends on:** Tripo's terms logged and the Pro plan taken (Story 2.1); the Gemini app, with its terms logged in `docs/ASSETS.md` (Story 0.4), for fallback views (tools decision 2026-11-13).

**Acceptance Criteria:**

**Given** the hero concept signed off in Epic 0, in the locked style
**When** the developer makes the four views from it in Tripo's web app with Tripo's multiview tool, uploading the concept with any visible watermark cropped out, and choosing the options from Tripo's current documentation (tools decision 2026-11-13)
**Then** the front, back, left and right views are saved in `art-src/hero/` under kebab-case names (AR154)
**And** each is logged in `docs/ASSETS.md` as AI-generated, with the tool, the prompt or settings, and the date (AR158).

**Given** the four views
**When** the agent looks at each one beside the concept, and the developer reviews them
**Then** all four show every feature of the concept signed off in `docs/STYLE_GUIDE.md`, section 6: a horned ember-beast, clearly not an ape, with pointed ears; upright, with two legs and two arms, about 4 heads tall, on a human-shaped skeleton, with heavy arms; two mismatched bone horns, each on the same side as on the concept (his left sweeps out and back, his right curls up into a hook); a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; the torn red woodsman's scarf; worn, belted woodsman's trousers; bare clawed feet; determined, not monstrous (FR210, NR56, NR58)
**And** any views that disagree with each other (horn shape, scarf side, proportions, claws) are regenerated until the set agrees, within the tool budget in the GDD's Dependencies table, and the developer approves the set
**And** if Tripo's views still disagree after the regenerations the developer allows, the views are made in the Gemini app instead, from the concept with the brief's view prompt (the same character and outfit, arms slightly away from the body, a plain background), at most 5 † attempts per kept view (tools decision 2026-11-13)
**And** if the budget runs out before the set agrees, the story stops, reports the spend and what still disagrees, and the developer decides (readiness proposal 2026-11-13, Q9).

**Given** Tripo's terms are logged and permit the use (Story 2.1)
**When** the mesh is generated from the approved views with Tripo's multi-view input, choosing the input and output options from Tripo's current documentation
**Then** the raw output is saved unchanged in `art-src/hero/` and logged in `docs/ASSETS.md` as AI-generated, with the plan, the settings and the date.

**Given** the raw mesh
**When** it is opened in the pinned Blender through the MCP, and the agent looks at viewport captures from the front, the back and both sides
**Then** a short findings list records how it matches the views and what clean-up it needs, for example fused limbs, a scarf merged into the body, holes, horns or claws melted into the head or hand, and the triangle count
**And** the developer decides: continue to clean-up, regenerate in Tripo, or take the hand-built route.

**Given** the hand-built route was chosen, in Story 2.1 or here
**When** the story ends
**Then** the approved views are the input for the hand-built model, no Tripo mesh is needed, and `docs/ASSETS.md` records the route and the reason.

### Story 2.3: Clean up Rowan's mesh in Blender

As a developer,
I want Rowan's mesh at game scale, standing on his origin, light enough to animate, and cut into the named parts the game toggles,
So that rigging starts from a mesh that follows the model conventions, and Epic 4 can swap stage-2 parts on the same body.

**Requirements:** FR210, NR56, NR58 (stage 1), PB59 (step 4), AR146, AR148, AR156, AR166 (named parts), NFR35

**Acceptance Criteria:**

**Given** the approved raw Tripo mesh, imported into `art-src/hero/rowan.blend` (tracked by Git LFS)
**When** it is cleaned up through the Blender MCP
**Then** it follows the model conventions (AR146): 1 unit = 1 tile, the origin at his feet (bottom centre), facing +X and +Y up in the exported file, transforms applied
**And** standing, his body reads at the size of his collision box, 0.72 wide × 0.92 tall from `CONFIG` (FR18); the horns and the scarf may extend past it.

**Given** the scaled mesh
**When** it is checked with Blender's mesh analysis through the MCP
**Then** it has no holes, non-manifold edges, flipped normals, or loose pieces hidden inside the body
**And** its polygons are reduced while keeping enough edge loops at the shoulders, elbows, wrists, hips, knees and neck to bend cleanly
**And** the triangle count is recorded in `docs/ASSETS.md`.

**Given** the horns and the right claw
**When** they are cut into separate parts
**Then** `horn_left`, `horn_right` and `claw_right` are separate snake_case nodes (AR156), the right claw cut at the wrist
**And** every cut is closed on both sides, so hiding any part leaves a clean head or wrist, not a hole
**And** every other node is snake_case too; `horn_right_broken` and `hand_right` don't exist yet (Epic 4).

**Given** Tripo's materials and textures
**When** the materials are checked (PB59 step 4)
**Then** none of Tripo's materials, baked lighting or textures is kept as the look; instead, each surface region is marked with the palette slot it takes: skin, seams, chest glow, eyes, horns, claws, scarf
**And** the glow regions (seams, chest, eyes) are separate from the skin, so the character material can make them glow and Epic 4 can dim the chest
**And** the marking follows one convention that the loader can read and Epic 3's models can reuse, recorded with the material rules in `docs/STYLE_GUIDE.md`
**And** any texture that remains is a flat palette region or a simple mask, in PNG or WebP (AR148).

**Given** the hand-built route was chosen in Story 2.1 or 2.2
**When** this story runs
**Then** a simpler model is built by hand in Blender through the MCP, following the approved views, and meets every criterion above: the conventions, the size, clean geometry, the named parts and the palette regions
**And** `docs/ASSETS.md` records how it was made and flags the AI involvement (built by Claude through the MCP, from AI-generated views).

**Given** the cleaned mesh
**When** it is reviewed in a critic-loop round on viewport captures (front, back, both sides, and a close-up of each cut) that the agent looks at
**Then** the top three problems are listed, most important first, and fixed, for at most three rounds
**And** the developer approves the mesh against the views before rigging starts.

Note: No document gives the model's height. These criteria read it from the 0.72 × 0.92 collision box (FR18), with the horns and the scarf allowed past it.

Note: No per-hero triangle target is stated. The count is recorded and judged against the 2 MB hero budget (AR152) and the frame budget (AR225).

Note: AR164 says assets "carry slot indices" but not how a glTF file carries them. Rowan is the first glTF asset, so this story sets the convention (for example, material name = slot name) and records it for Epic 3.

Note: Nothing says whether a model Claude builds through the Blender MCP counts as AI-generated. The stories record it as AI-assisted, so store forms can be answered truthfully.

### Story 2.4: Rig Rowan and prove he deforms cleanly, or build the hand-built fallback

As a developer,
I want Rowan rigged on a human-shaped skeleton and tested in the extreme poses of every base clip,
So that animation starts only on a body that bends cleanly, and the fallback is taken on evidence if it doesn't.

**Requirements:** FR211 (one rig), NFR35, PB62, PB59 (step 5), AR159 (pipeline and fallback), AR166, PR21

**Acceptance Criteria:**

**Given** the cleaned mesh from Story 2.3
**When** it is rigged in Blender through the MCP
**Then** one human-shaped skeleton drives Rowan, with its root at the origin between his feet (PB59 step 5)
**And** the bones are named so later human-shaped characters can share the skeleton and its motion library
**And** the horns follow the head rigidly, the claws follow the hands rigidly, and the scarf has bones or weights that let it move in the clips.

**Given** the rigged Rowan
**When** each named part is hidden and shown in Blender
**Then** `horn_left`, `horn_right` and `claw_right` hide independently, and nothing else moves or changes shape
**And** the right-hand bones that `hand_right` will be skinned to in Epic 4 exist, so the stage-2 parts can be added later without re-rigging Rowan or re-making his clips (AR166).

**Given** a deformation test action, kept in `rowan.blend` and left out of the export
**When** it poses Rowan at the extremes the base clips need: a full run stride, a jump tuck, a deep crouch, arms and head raised to spit up and lowered to spit down, a hurt recoil, a death collapse
**Then** captures from the front and the side, which the agent looks at, show no tearing, no collapsing or twisting joints, no body passing through the scarf, and no stretched horns or claws
**And** the developer approves the result (NFR35, PB62).

**Given** the generated mesh fails the deformation test
**When** the fixes the developer agrees to try (re-weighting, reworking the topology around the joints, regenerating in Tripo) don't clear it
**Then** the developer confirms the fallback, and the reason is recorded in `docs/ASSETS.md` (NFR35, AR159).

**Given** the fallback is confirmed in this story
**When** the simpler model is built by hand in Blender through the MCP, from the approved views
**Then** it meets every criterion of Story 2.3 (conventions, size, geometry, named parts, palette regions), is rigged on the same kind of skeleton, and passes the same deformation test
**And** the Tripo mesh stays in `art-src/hero/` for the record, and `docs/ASSETS.md` records the route and the model's AI involvement.

**Given** either route
**When** the story ends
**Then** one rigged Rowan in `art-src/hero/rowan.blend` passes the deformation test
**And** `docs/ASSETS.md` records which route he took and why, as the evidence for PR21.

### Story 2.5: Animate Rowan's movement clips

As a developer,
I want Rowan's six movement clips (`idle`, `run`, `jump`, `fall`, `land`, `crouch`) made on his rig,
So that he can stand, run, jump, fall, land and crouch the way the simulation moves him, and the export path can be proven on real motion before the action clips are made.

**Requirements:** FR211 (stage 1: idle, run, jump, fall, land, crouch), AR155, NFR35, PB59 (step 5)

**Acceptance Criteria:**

**Given** the rigged Rowan
**When** the clips are made in Blender through the MCP
**Then** `idle`, `run`, `jump`, `fall`, `land` and `crouch` exist as actions with exactly those names (AR155)
**And** each is in place: the root never travels, because only the simulation moves Rowan.

**Given** the six clips
**When** each is played
**Then** `idle`, `run` and `fall` loop with no visible pop at the seam; `crouch` holds a low pose, looping or still; `jump` plays once and ends on a rising pose that can hold; `land` plays once
**And** `jump` and `fall` read as different poses at the game's small size.

**Given** the run speed in `CONFIG` (7 tiles/s, FR8)
**When** `run` is played in Blender with Rowan moved forward at that speed
**Then** his feet stay planted while they touch the ground, with no visible sliding.

**Given** `CONFIG.feedback.landClipSteps`, which this story adds to `CONFIG.feedback` (starting value `steps(0.15)`, 9 steps †; readiness proposal 2026-11-13, minor), and the crouch hurtbox height in `CONFIG` (0.6 tiles †, tuned in Epic 1)
**When** `land` and `crouch` are timed and posed
**Then** `land` reads within that many steps
**And** the crouch pose brings Rowan's head and horns down to the top of the crouch hurtbox or below, so a seed that passes over him looks like it passes over.

**Given** the six clips
**When** the deforming parts are checked
**Then** the horns and claws stay rigid, the scarf moves with each clip without passing through the body, and no foot goes below the ground line at the origin.

**Given** the six clips
**When** they are reviewed in a critic-loop round on viewport captures at fixed frames and on playback, which the agent looks at
**Then** the top three problems are listed, most important first, and fixed, for at most three rounds
**And** the developer approves the motion as clean (NFR35).

Note: No document says how low the crouch pose goes. This story reads it from the crouch hurtbox, so that near misses look like misses.

### Story 2.6: Export Rowan through `make models`

As a developer,
I want Rowan exported from Blender and compressed by `make models`, with a check that rejects any model breaking the conventions,
So that every model the game ships, starting with Rowan, is small, correctly scaled and named, and loadable by manifest id.

**Requirements:** AR145, AR146, AR153, AR154, AR155, AR156, AR150 (hero entry), AR152 (hero budget), PB59 (step 6, export)

**Acceptance Criteria:**

**Given** Rowan with his movement clips
**When** he is exported from Blender as binary glTF
**Then** the raw export sits in `art-src/hero/`, with +Y up, his skin, and one animation per clip named as in Blender, and with no cameras, lights or generator textures
**And** the export settings are recorded so every later export repeats them.

**Given** the raw export
**When** `make models` runs
**Then** `scripts/optimizeModels.ts` (created here, or finished if Epic 0 left a stub) compresses it with meshopt and quantizes it through `@gltf-transform/cli` (AR145), and writes `public/assets/models/hero-rowan.glb` (AR153, AR154).

**Given** a model that breaks a convention
**When** `make models` checks it
**Then** it rejects: a character whose bind pose doesn't stand on the origin (feet at the bottom centre); a size off by a unit factor (AR146); a node or clip name that isn't snake_case; a hero clip that isn't one of AR155's hero clips; and a hero file missing `horn_left`, `horn_right` or `claw_right` (AR156)
**And** on a rejection it exits non-zero, names the model and the rule it broke, and writes no output for that model.

**Given** the checks
**When** their Vitest unit tests run in Node under `make test`
**Then** a well-formed synthetic hero document passes
**And** documents with the feet off the origin, a centimetre scale, a non-snake-case node, an unknown clip name or a missing part each fail with the matching rule.

**Given** `hero-rowan.glb`
**When** the manifest is built
**Then** `hero-rowan` is in the shared bundle, so it loads at boot (AR144, AR150), and code refers to it only by that id
**And** the raw export, the shipped file and `rowan.blend` are tracked by Git LFS.

**Given** the shipped file
**When** its size is measured
**Then** the size is recorded in `docs/ASSETS.md`
**And** the budget check in `make build` passes against the hero budget of 2 MB † for both stages (AR152), leaving room for the five action clips and the stage-2 parts still to come.

Note: AR146 doesn't give the scale and origin check's tolerances. They are named constants in `optimizeModels.ts`, with starting values agreed with the developer.

### Story 2.7: Show Rowan under the game's look on the look-dev page

As a developer,
I want Rowan loaded by the game's loader, shaded only by the game's materials and palette, and inspectable clip by clip on the look-dev page,
So that he is judged in the engine against the style guide, not against a generated image, before he enters a level.

**Requirements:** FR210, NR56–NR58 (stage 1), AR145 (loader), AR147, AR148, AR166, PB59 (step 6), NFR33, PR14, PR23

**Acceptance Criteria:**

**Given** `hero-rowan` in the manifest
**When** `render/assets/loader.ts` loads it by id (`assets.model('hero-rowan')`)
**Then** it uses three.js `GLTFLoader` with `MeshoptDecoder`, set up per the r187 documentation (AR145)
**And** a failed or invalid load returns a `Result` error, logged on the `assets` channel, and no partial Rowan is shown.

**Given** the loaded model
**When** it is prepared for display
**Then** every glTF material and texture is stripped and replaced by `render/materials` factories (AR147), each region coloured from its slot in the current level's palette, so no shading from Tripo or Blender reaches the screen (NFR33)
**And** a hero colour the palette lacks is added to `render/palettes/` and `docs/STYLE_GUIDE.md` only with the developer's approval
**And** in development, a check fails loudly if any of Rowan's meshes still carries a loaded material.

**Given** the character material from Epic 0
**When** Rowan plays a clip under it
**Then** the mesh deforms with the skeleton, and his shadow and outline (whichever Epic 0's style uses) follow the animated pose, not the bind pose
**And** the seams, chest and eyes glow with the warm light the style guide reserves for him
**And** the chest glow's strength is a material or palette value, so Epic 4 can dim it without a re-export.

**Given** the look-dev page
**When** Rowan is selected
**Then** he shows next to the style swatches, with a picker for every clip in the file, a way to freeze any clip at a set time, toggles for `horn_left`, `horn_right` and `claw_right`, and a switch between the Emberwood and Drowned Mill palettes and lighting, the two levels where stage 1 plays (NR57)
**And** hiding a part through the hero view's part toggle leaves the rest of Rowan unchanged, which proves the stage toggle Epic 4 will use (AR166)
**And** his draw calls and triangles, from the page's renderer statistics, are recorded in `docs/ASSETS.md`.

**Given** the optimized file and the raw export
**When** they are compared playing the same clips
**Then** the optimized file shows no quantization artefacts: no vertex jitter, cracks or swimming at the joints
**And** if it does, the `optimizeModels.ts` settings are changed, and recorded, until it doesn't.

**Given** Rowan on the look-dev page
**When** hero spots are added to the screenshot harness (each movement clip frozen at a fixed time and framed at the gameplay camera's distance, plus `idle` close up and `idle` under the Drowned Mill look) and a critic-loop round runs with `make shots ROUND=n`
**Then** the shots are compared with the concept and `docs/STYLE_GUIDE.md`, the top three problems are listed, most important first, and fixed, for at most three rounds (PR14, PR23)
**And** every round checks that he reads at a glance at the play framing (horns, chest glow, eyes, scarf) and, with his fire family, is the warmest thing in view
**And** the developer sees the before and after shots.

### Story 2.8: Animate Rowan's action clips

As a developer,
I want the `spit`, `spit_up`, `spit_down`, `hurt` and `death` clips made on the same rig,
So that every action the player takes, and every hit Rowan takes, shows on his body.

**Requirements:** FR211 (stage 1: spit, spit_up, spit_down, hurt, death), AR155, NFR35, PB59 (steps 5 and 6)

**Acceptance Criteria:**

**Given** the rigged Rowan
**When** `spit`, `spit_up` and `spit_down` are made through the MCP
**Then** each is an in-place, one-shot clip that keys only the upper body (spine, arms, neck, head, and the scarf where it hangs from them), so the game can lay it over whatever the legs are doing: standing, running, crouched, jumping or falling, as the `overlay` half of `chooseHeroClip`'s `{ base, overlay }` (sprint change proposal 2026-11-13, A8)
**And** each is timed to `CONFIG.feedback.spitClipSteps`, which this story adds to `CONFIG.feedback` (starting value `steps(0.2)`, 12 steps †; readiness proposal 2026-11-13, minor), and restarts cleanly from its first frame on the next shot.

**Given** the shot spawn points in `CONFIG`: 0.42 tiles in front, 0.48 tiles high, 0.7 when aiming up, and 0.3 when aiming down or crouched (FR46), with aim at 45° up or down (FR47)
**When** the spit clips are checked in Blender against markers placed at those points
**Then** at the release frame Rowan's mouth sits at the matching spawn point, and his head points along the shot: level for `spit` (standing, and over crouched legs), 45° up for `spit_up`, 45° down for `spit_down`
**And** any offset the poses can't close is listed for the developer.

**Given** the knockback time in `CONFIG` (0.28 s, 17 steps, FR62)
**When** `hurt` is made
**Then** it is an in-place, one-shot recoil that reads within that time, because the knockback ends Rowan's hurt state.

**Given** the death sequence in `CONFIG` (0.85 s, FR66)
**When** `death` is made
**Then** it is an in-place, one-shot collapse that reads within the death sequence and ends on a resting pose that can hold, with no part sinking below the ground line.

**Given** all 11 base clips
**When** Rowan is re-exported and `make models` runs
**Then** `hero-rowan.glb` carries the 11 clips, named exactly as in AR155
**And** `make models` now also rejects a hero file that lacks any of them
**And** the size check from Story 2.6 still passes.

**Given** the 11 clips on the look-dev page
**When** a hero spot is added for each action clip and a critic-loop round runs with `make shots ROUND=n`
**Then** the horns and claws stay rigid, the scarf never passes through the body, and no joint tears or collapses at any frame
**And** the top three problems are listed, most important first, and fixed, for at most three rounds
**And** the developer approves all 11 clips as clean (NFR35).

Note: decided by the developer on 2026-11-13: the spit clips are upper-body overlays layered on the base clip, so Rowan keeps running, jumping or crouching while he fires. The architecture's animation pattern (AR75) records it: `chooseHeroClip` returns `{ base, overlay }` (sprint change proposal 2026-11-13, A8).

Note: Shots leave at 0.48 tiles (FR46, proven), while a 3-heads-tall Rowan's mouth sits near three quarters of his 0.92-tile height. The spit poses are authored to close the gap; anything left goes to the developer, since FR46 changes only with him.

### Story 2.9: Put Rowan in the grey-box level, with his clip chosen from his state

As a player,
I want Rowan's own body in place of the grey placeholder, showing the motion that matches what he is doing,
So that the character I steer is the hero of the story, not a box.

**Requirements:** FR112 (stage 1), NR57 (stage 1), AR75, AR76 (clips), AR144 (hero), AR151 (hero), AR52 (hero mixer), AR208 (hero clip), AR213 (hero animation), NFR36, X-B14, X-B17, X-B36

**Acceptance Criteria:**

**Given** `hero-rowan` loaded at boot as a shared asset (AR144)
**When** grey-box Level 1 is played
**Then** Rowan's model replaces the placeholder in the hero view, keyed by entity id (AR76), on the play layer at z = 0, at the position interpolated from `prevX`/`prevY` to `x`/`y`, facing the way the simulation says; how far he turns toward the camera is a visual value the developer sets in the critic loop
**And** his mixer advances on the loop's clamped frame time (0 to 0.25 s), so the first frame after a slow load never gets a negative step (AR52; a prototype bug)
**And** leaving or reloading a level disposes the hero view's own objects (its mixer, the materials it made) but not the shared model; switching levels repeatedly through the dev handle leaves the renderer's geometry and texture counts flat (AR151).

**Given** Rowan's form in the simulation is `beast`, filled from `levelForm` (default X-B17)
**When** the hero view shows him
**Then** the stage-1 parts `horn_left`, `horn_right` and `claw_right` are visible (FR112, NR57)
**And** this story leaves the `changed` form to Epic 4, which adds the stage-2 parts; until then every form shows stage 1.

**Given** `render/actors/hero.ts`
**When** `CLIP_FOR_STATE` and `chooseHeroClip` are written as in the architecture (AR75)
**Then** `HeroClip` is a string-literal union of AR155's 13 hero clip names, `HeroOverlayClip` is `spit`, `spit_up` or `spit_down`, and `CLIP_FOR_STATE` maps every `PlayerState`: `idle`, `run`, `jump`, `fall` and `crouch` to the clip of the same name, `hang` to `hang`, `climb` to `climb_up`, `hurt` to `hurt`, and `dead` to `death`
**And** `chooseHeroClip` returns `{ base, overlay }` (sprint change proposal 2026-11-13, A8): `base` is `land` while `landSteps` is under `CONFIG.feedback.landClipSteps`, in `idle` only, and otherwise the state's clip; `overlay` is `spit`, `spit_up` or `spit_down` by `aim` while `spitSteps` is under `CONFIG.feedback.spitClipSteps`, in `idle`, `run`, `jump`, `fall` and `crouch` only, and otherwise `null`.

**Given** the clip choice
**When** its Vitest unit tests run in Node, with no WebGL context, under `make test` (default X-B36)
**Then** they cover: every state's base clip; each spit overlay in each of the five overlay states; no spit overlay in `hurt` or `dead`; a crouched spit giving `spit`, never `spit_down`; aim up while running giving `spit_up` (default X-B14); a spit overlay over the `land` base; no `land` base outside `idle`; and the spit overlay and the `land` base each ending exactly at their `CONFIG` step count, with the values imported from `CONFIG`.

**Given** the `Player` in the simulation
**When** this story needs `spitSteps`, `landSteps` and `aim`
**Then** `Player` carries them (added in `sim/player/` if Epic 1 did not), each with a unit test: `spitSteps` resets on the step a shot is fired and counts up otherwise; `landSteps` resets on the step `rowanLanded` fires; both start, and restart after a respawn or a pit return, at values that show no overlay; neither counts during hit-stop
**And** they are presentation-only: no simulation rule reads them.

**Given** the hero file
**When** the hero view is created
**Then** it checks with `invariant` that the 11 base clips and the stage-1 parts are present
**And** a state whose clip the file doesn't have yet (`hang`, `climb_up`; unreachable until Epic 4 adds ledge grab) holds the current clip and logs one warning, instead of failing.

**Given** the debug tools from Epic 1
**When** the F1 overlay is on
**Then** it shows the clip `chooseHeroClip` picked, next to the player state (AR208)
**And** in screenshot mode, the hero's clip is set to the spot's `animTime` and holds there, so two captures of the same spot match (AR213).

**Given** Rowan's model in the level
**When** `make check` runs
**Then** every simulation test, the feel regression test and the determinism test pass, and his hitbox still comes from `CONFIG`, never from the model (NFR36)
**And** a critic-loop round on Epic 1's gameplay spots (`make shots ROUND=n`, at most three rounds) shows Rowan in place of the placeholder and standing out from the grey box at a glance, and the developer sees the before and after shots.

Note: `CLIP_FOR_STATE` must map `hang` and `climb`, whose clips arrive in Epic 4. Holding the current clip with one warning, when the file lacks a clip, is this story's reading.

Note: Default X-B36 lists the Node layers in `make test` without `render/`. This story adds the pure clip-choice test to it.

Note: No document says whether Rowan turns partly toward the camera. It changes how well his chest glow and eyes read, so the developer sets it.

### Story 2.10: Make Rowan's animation follow every gameplay state

As a player,
I want Rowan's body to move cleanly with everything I do and everything that happens to him,
So that I can read his state at a glance and the controls feel connected to him.

**Requirements:** FR211 (stage 1), AR62 (clip steps), AR75, AR173 (hero blink), NFR35, X-B14

**Acceptance Criteria:**

**Given** Rowan's clip changes
**When** he enters a state
**Then** its clip starts from its first frame, and staying in the state continues it; a stomp bounce or a new jump restarts `jump`
**And** `idle`, `run`, `fall` and `crouch` loop, while `jump`, `land`, `hurt` and `death` play once and hold their last pose until the state changes
**And** changes between clips blend over short crossfades, held as named `…Seconds` constants in the hero view and set with the developer, with no visible pop at the jump-to-fall apex, on landing, or between run and idle.

**Given** Rowan spits while standing, running, crouched, jumping or falling
**When** `chooseHeroClip` returns a spit clip as `overlay` over the state's `base` clip (sprint change proposal 2026-11-13, A8)
**Then** the hero view plays the overlay as a second action, so his upper body shows the spit while his legs keep the base clip: running legs keep running, crouched legs stay crouched for the low shot, and an airborne pose stays airborne
**And** aim up while running shows `spit_up` over running legs (default X-B14), and aim down in the air shows `spit_down`
**And** holding spit at the 0.2 s cooldown replays the spit from its first frame on every shot, with no pop between shots
**And** with the F1 overlay on, each shot appears at Rowan's mouth when standing, crouched, aiming up, and aiming down in the air, or the offset is listed for the developer.

**Given** Rowan is hit by an enemy, an enemy shot or spikes
**When** he is knocked back
**Then** `hurt` plays for the knockback (0.28 s, 17 steps, from `CONFIG`), then the clip follows his new state
**And** during the invulnerability after a hit (1.3 s), a pit return (1.3 s) or a respawn (1.0 s), all of Rowan, every part and glow region included, blinks at `CONFIG.feedback.blinkHz` (9), the Epic 1 blink, with his clip running beneath (AR173).

**Given** Rowan loses his last heart
**When** the death sequence runs (0.85 s, from `CONFIG`)
**Then** `death` plays once and holds its last pose through the fade
**And** on respawn he appears in `idle` with no blend from the death pose, and the next death plays from its start
**And** after a fall into a pit, his clip follows his state through the pit fade and on the stable ground he returns to; a pit on his last heart shows the death sequence as Epic 1 runs it.

**Given** the game is paused (Esc, P, Start or any auto-pause trigger), including during the death sequence or the pit fade
**When** the simulation stops
**Then** Rowan's pose holds, and on Resume it continues from the same frame
**And** during hit-stop (`CONFIG.feedback.hitStopSteps`: 3 steps for a stomp, 4 when Rowan is hurt) his pose holds too, then continues.

**Given** `CONFIG.feedback.spitClipSteps` (starting value `steps(0.2)`, 12 steps †) and `CONFIG.feedback.landClipSteps` (starting value `steps(0.15)`, 9 steps †) (AR62)
**When** the developer tries them in the browser
**Then** he tunes both and signs off on how the spit and the landing feel
**And** the clips are re-timed to the tuned values and re-exported through `make models`, and the tests still import the values from `CONFIG` without repeating a literal.

**Given** grey-box Level 1 with Rowan
**When** the developer plays these situations: running into a wall; standing on a moving platform; turning while crouched; dropping through a one-way ledge; a coyote jump; a buffered jump on landing; a stomp bounce; aiming up standing and running; aiming down in the air; the crouched low shot; holding spit while running and in the air; the triple shot; being hurt by an enemy, a seed and spikes; a pit return; a pit on the last heart; death and respawn; and pausing in each
**Then** Rowan's clip matches what he is doing in each, as `chooseHeroClip` and the F1 overlay report
**And** a mismatch caused by Epic 1's state machine (for example `run` while standing still on a moving platform) is raised with the developer rather than patched in rendering, since fixing it changes Epic 1's controller.

**Given** the changes above
**When** a critic-loop round runs on the look-dev and gameplay spots (`make shots ROUND=n`, at most three rounds)
**Then** the top three problems are listed, most important first, and fixed
**And** the developer sees the before and after shots.

Note: No document gives crossfade times or says a respawn snaps without a blend. Both are this story's reading of "animates cleanly", tuned with the developer.

Note: The architecture says the mixer runs on real frame time and that rendering keeps running while paused. Holding the pose while paused and during hit-stop is this story's reading of "animation follows play" and of hit-stop as a freeze.

### Story 2.11: Run the hero critic loop and get the developer's sign-off

As a developer,
I want Rowan judged against his concept in the critic loop, checked against his budget, and signed off in play,
So that Epic 2 closes on its exit criterion and the pipeline is proven before any level art.

**Requirements:** PR9, PR21, PR24 (model sign-off), PR14, NFR27, NFR35, FR210, FR211 (stage 1), AR152 (hero budget), PB59 (step 7)

**Acceptance Criteria:**

**Given** the look-dev hero spots (all 11 clips) and Epic 1's gameplay spots, now with Rowan
**When** the critic loop runs with `make shots ROUND=n`
**Then** each round compares the shots with the signed-off concept and `docs/STYLE_GUIDE.md`, writes down the three biggest problems, most important first, and fixes them, for at most three rounds (PR14)
**And** every round checks that Rowan stands out from the background at a glance (NFR27), is, with his fire family, the warmest thing on screen, reads as a horned ember-beast and clearly not an ape, and stays readable as a small figure (horns, chest glow, eyes, scarf) at the 1280 × 720 embed, where a tile is about 67 px
**And** the developer sees the before and after shots.

**Given** the build after the last round
**When** the developer plays grey-box Level 1 from start to finish with Rowan
**Then** he confirms that Rowan animates cleanly in every state, using Story 2.10's situations as the checklist
**And** each remaining problem is either fixed in this story or recorded as accepted by the developer.

**Given** the final `hero-rowan.glb`
**When** `make build` runs
**Then** its budget check passes with the hero within 2 MB † (AR152)
**And** the size, triangle count and draw calls are recorded in `docs/ASSETS.md`, with the room left for the stage-2 parts.

**Given** the finished pipeline
**When** it is recorded
**Then** `docs/ASSETS.md` lists every hero asset (the views, the Tripo mesh if used, `rowan.blend`, the shipped file) with its tool, licence and AI flag, and which route Rowan took
**And** the pipeline as actually run is written down for Epic 3's enemies to repeat: the tool versions, the MCP set-up, the clean-up, rig and export steps and settings, the palette-slot convention, `make models`, and the look-dev check (PR21).

**Given** the critic loop, the play check and the budget all pass
**When** the developer reviews Rowan
**Then** he signs off that Rowan matches the concept and animates cleanly in every state, which is the epic's exit criterion (PR9, PR24)
**And** if he doesn't, the open problems are fixed here, or go through `gds-correct-course` if they change a planning document; Epic 3 doesn't start until he approves.

Note: No document says where the pipeline's how-to lives. This story writes it into `docs/ASSETS.md`, beside the hero entry, unless the developer prefers another place.

---

## Epic 3: Level 1 vertical slice (the MVP)

A first-time player from the primary audience can start at the title gate, watch the intro, play Emberwood start to finish with final art and audio, and come away knowing who Rowan is and wanting to play Level 2.

**In scope:**

- **The final Level 1 layout,** built from the proven grey box: the teaching order and control signs from the GDD; 3 checkpoints, 3 bells, 100 to 150 embers †, a triple shot pickup; a length that gives 6 to 8 minutes of first play.
- **The Emberwood art kit:** ground pieces, solid and one-way ledges, the moving platform, spikes, props, lanterns, 3 or 4 backdrop layers, with 3 tiles † of dressing past the level's edges for windows wider or taller than the logical view (sprint change proposal 2026-11-13, A4).
- **Emberwood story props** (narrative design, Environmental Storytelling): the empty wedding glade with benches and a garland arch, which carries the exit; carved woodsman's waymarkers that carry the control signs; the cold chimney of Elin's foundry in the far layer.
- **Enemy models and animations** for the walker, the thorn flyer and the rooted spitter, each checked for clean deformation, with a hand-built fallback.
- **Pickup and marker art:** ember, bell, triple shot, checkpoint, exit. Collectable embers look different from Rowan's shots.
- **Control-sign icons:** the keyboard arcade set only (arrows to move, ↑ aim up, ↓ crouch, Z jump, ↓ + Z drop-through, X spit) and one neutral set of gamepad position glyphs, with the spit sign lighting the west face button. Signs swap set on the next frame after a device change.
- **The final HUD:** hearts, ember meter, weapon timer with its warning blink and sound, the bell toast ("Bell n of 3"), and the mute indicator (owned by `ui/overlay.ts`). Judged in play on critic-loop screenshots at Emberwood's brightest and busiest spots; heart legibility at the 1280 × 720 embed is checked with the primary audience before the icon size is raised.
- **Audio:** the Web Audio mixer with music, effects and ambience buses and the guarded `AudioContext`; the Level 1 tune carrying Elin's motif, which the bell sound also plays; the end-of-level stinger; the Emberwood ambience; the hero, enemy, world and interface sounds Level 1 uses; the M mute key; audio formats chosen with the audio tool and checked for gapless looping.
- **The bare title gate** (UX F5): the wordmark and "Click or press any key", then the intro cards, then Emberwood's loading card. A key or click unlocks audio and gives the frame keyboard focus; a gamepad button passes the gate but cannot unlock audio. Until Epic 6, "the title" means this gate (X-B23); after Level 1's results the game returns to it.
- **Story:** the story-text module (`content/storyText.ts`); the 5 intro cards with their final text, built as layered silhouettes in the engine (placeholder silhouettes acceptable, placeholder text not); the card input rules (the ~1.5 s † minimum, presses must begin on the card, confirm advances, Back skips the rest of the intro); the loading card with Emberwood's name and line on every load.
- **First play vs replay** decided as a level loads (X-B2).
- **Readability checks:** pits read as dark, hazards contrast, aiming spots have clear lines of sight, control signs stay clear of the play area.
- **The critic loop on the Level 1 spots,** then a playtest with 3 to 5 first-time players from the primary audience, and the fixes it calls for.

**Out of scope:** the boot loading screen, title menu, full pause menu, level select, settings, saving, notices and error panels (Epic 6); the loading card's replay skip (Epic 6); the warden, its bar and sounds, ledge grab, Rowan stage 2 (Epic 4); the piercing shot pickup model, Levels 2 and 3, the closing and all-bells cards (Epic 5); the performance pass on real hardware (Epic 6).

**Depends on:** Epic 2 (Rowan stage 1, fully animated, playing the grey-box level). The audio tools and formats are chosen by the developer at the start of Story 3.15, with their licence and commercial-use terms logged in `docs/ASSETS.md` before any audio asset is made (PR26; readiness proposal 2026-11-13, Q9).

**Playable deliverable:** Emberwood start to finish, from the title gate and the intro, with final art, HUD and audio.

**Exit criteria:**

- At least 4 of 5 (or 3 of 3, or 3 of 4) first-time testers from the primary audience finish Level 1 without help (X-B31; readiness proposal 2026-11-13, minor).
- A majority want to play Level 2 and can say who Rowan is and what he wants.
- The developer approves the look.

### Story 3.1: Finalise Emberwood's layout and placements

As a player,
I want Emberwood's final layout to teach every move in order, pace out over 6 to 8 minutes and hide its bells fairly,
So that I can finish it without help and the art goes onto a level that already plays well.

**Requirements:** FR57, FR118, FR122, FR123, FR124, FR128, FR136, FR137, FR138, FR139, FR140, FR143, FR146, FR147, FR148, FR149, FR150, FR151, NR80, NR87, NFR17, NFR18, NFR23, NFR26, PR19

**Acceptance Criteria:**

**Given** the first-play pace measured on the grey box in Epic 1
**When** the final layout is set in `levels/emberwood.tmj`
**Then** the main path's length targets 6 to 8 minutes of first play at that pace (NFR23), and each of the four sections targets 60 to 120 s, so no single failure costs more than about 120 s of replay (NFR17, NFR18)
**And** the level stays linear, left to right, within the level height in `CONFIG` (starting value 18 to 24 tiles †) (FR143)

**Given** the final layout
**When** the developer walks it section by section
**Then** the teaching order of FR146 to FR149 is unchanged, every new element follows the teaching pattern (introduced where failure is cheap, practised once safely, combined, tested before the next checkpoint) (FR136), and the only new tools are the base moves and the triple shot (FR137)
**And** each section ends in a calm spot at a checkpoint, intensity stays low and rises to medium in the last section, and the last section before the exit is the hardest (FR128, FR151)
**And** every control sign still sits at the first use of its action, and no spot needs text to be understood (NFR26)

**Given** the entities layer
**When** `make levels` compiles Emberwood
**Then** it holds 3 checkpoints, 3 bells placed in sections 2 to 4 (FR150, NR87, NR80), embers within the range in `CONFIG` (starting value 100 to 150 †), one triple shot pickup below the drop-through bridge, before the mixed-enemy stretch (FR57, FR148), and the exit at the wedding glade (FR143, FR149)
**And** the compile validation passes

**Given** the embers
**When** their placement is reviewed with the developer on the level map
**Then** they trace jump arcs from the first gap onward, and the split is about 60% on intended arcs and paths, 25% on detours and 15% in clusters after hard stretches † (FR118, FR150)
**And** a level test proves that at least the ember heal cost from `CONFIG` lies on the main path before the level's midpoint, so the first heal is possible by mid-level (FR150)

**Given** the three bells
**When** the level tests and the developer's review run
**Then** each bell is reachable with Level 1's abilities, proven by a jump mark that the jump search passes (FR122)
**And** each has at least one visual hint: an ember trail leading off the path, a lantern position marked in `dressing`, or a gap in foliage (FR123)
**And** no bell sits behind a gamble on a pit, checked by the developer on each bell's route (FR124)

**Given** the enemy placements
**When** the developer walks the level with the F1 overlay's logical-view box shown
**Then** each enemy is visible for at least 1 s before Rowan can reach it at full run speed (FR138), no enemy sits on the landing spot of a jump the player cannot see (FR139), and every spitter stands where the player can choose to crouch, jump or shoot (FR140)
**And** the compile check for most enemies on screen at once still passes

**Given** the final layout
**When** `make test` runs
**Then** the jump search passes for every mark, the coverage check finds a mark for every break or rise on the main path, the static metric checks pass, and Level 1 has no challenge-tier jumps
**And** the Level 1 spots in `src/debug/spots.ts` follow the final layout, with a spot for each bell, each control sign and each section's teaching beat
**And** the developer plays the final layout in grey boxes in the browser and signs off on its flow and pace before any art goes on (PR19)

### Story 3.2: Dress Emberwood's ground, ledges, platforms and spikes

As a player,
I want Emberwood's ground, ledges, moving platform and spikes to look like an old forest of mossy rock and wooden ledges,
So that the level I already know how to play feels like Rowan's home wood.

**Requirements:** FR145, FR214, PB61, NFR27, NFR30, NFR36, PR14, PR19, AR145, AR146, AR147, AR148, AR153, AR154, AR156, AR167

**Acceptance Criteria:**

**Given** `art-src/kits/emberwood.blend`, built in Blender by hand or from Tripo meshes
**When** `make models` exports and optimises it
**Then** `kit-emberwood.glb` holds the terrain pieces, each named `<kind>_<variant>` (for example `ground_top`, `ledge_oneway`), with its origin at the bottom-left of its tile cell and 1 unit = 1 tile, compressed with meshopt
**And** this story adds the kit-piece rule to `optimizeModels.ts`, since Story 2.6 checks only characters: a piece is 1 unit = 1 tile, with its origin at the bottom-left of its tile cell; the file passes, and Vitest unit tests under `make test` show a well-formed synthetic piece passing and pieces with the wrong scale or the wrong origin each failing with the matching rule (readiness proposal 2026-11-13, Q7)

**Given** the kit
**When** its pieces are reviewed on the look-dev page
**Then** it has ground (top, fill, edges and corners), solid ledges, one-way ledges and the drop-through bridge as wooden ledges, the moving platform and spikes, in Emberwood's look: old trees, mossy rock, wooden ledges (FR145, FR214)
**And** generated materials are replaced on load by the `render/materials` factories with Emberwood palette slots, and any texture is a PNG or WebP of flat palette regions or a simple mask

**Given** the compiled Emberwood level
**When** the level view builds
**Then** ground and ledge pieces are picked from the collision grid by the compile step's neighbour rules, every collision tile is dressed, and the moving platform's art matches its simulation width (PB61)
**And** the dressing carries on 3 tiles † past each of the level's edges, so a window wider or taller than the logical view shows Emberwood there, and past that the view camera shows plain bands in the palette's darkest slot (sprint change proposal 2026-11-13, A4, G1)
**And** the art changes nothing in the compiled collision, the margin past the edges included, so the level, jump and simulation tests pass unchanged (NFR36, PR19)

**Given** repeated kit pieces
**When** they render
**Then** they use `InstancedMesh` with bounding volumes computed so culling works, checked against the three.js r187 documentation (AR167)
**And** at the busiest Level 1 spot the F1 overlay shows draw calls and triangles within the render budgets (150 draw calls †, 250,000 triangles †)

**Given** the dressed level
**When** the developer plays it
**Then** one-way ledges and the bridge read as wood, distinct from solid rock, and no piece overhangs into an empty tile in a way that suggests collision that is not there
**And** spikes contrast with the ground around them and read as a hazard at a glance (NFR30, NFR27)

**Given** the kit
**When** `make build` runs
**Then** the kit counts toward the 3.5 MB † kit-and-backdrop budget and the budget check passes
**And** `docs/ASSETS.md` records the kit with its tool, its licence and whether it is AI-generated

**Given** the dressed level
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at the start, the moving platform over the pit, the spikes on the cliff top and the drop-through bridge, plus the start in a 21:9 and a 4:3 window
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that the hero, enemies, hazards and pickups stand out from the background at a glance (PR14, NFR27)
**And** in the 21:9 and 4:3 shots the margin past the level's edges shows Emberwood's dressing, then the plain bands, with no gap, cut-off piece or empty space between them (sprint change proposal 2026-11-13, A4)
**And** the before and after shots are shown to the developer

### Story 3.3: Build Emberwood's backdrops, lanterns and dusk lighting

As a player,
I want Emberwood set in layered dusk forest, with wedding lanterns along the path and the cold chimney of Elin's foundry in the distance,
So that the wood reads as home on the night it turned strange.

**Requirements:** FR208, FR209, FR214, NR83, NR84, NR85, NR100, NR101, NR102, NFR28, NFR29, PR14

**Acceptance Criteria:**

**Given** the dressed play layer from Story 3.2
**When** Emberwood's backdrops are added
**Then** there are 3 or 4 backdrop layers (far distance, middle distance, foreground) from `public/assets/backdrops/emberwood/`, with parallax from the view camera (FR208, FR214)
**And** each layer covers the view out to 3 tiles † past the level's edges, as the kit does, so a 21:9 or 4:3 window shows backdrop there and then the plain bands in the palette's darkest slot, never an empty edge (sprint change proposal 2026-11-13, A4, G1)
**And** the foreground never covers the play area and never hides Rowan, an enemy, a hazard or a pickup

**Given** the level start
**When** the start spot is captured
**Then** it shows the forest edge below the village, with the cold chimney of Elin's bell foundry in the far layer and no warm light on it (NR84)

**Given** the `dressing` layer
**When** lanterns are placed
**Then** `prop_lantern` pieces hang along the path, lit for the wedding (NR85), including the lantern positions marked as bell hints in Story 3.1
**And** lanterns appear in Emberwood only (FR209, NR101)

**Given** `render/lighting/emberwood.ts` and `render/palettes/emberwood.ts`
**When** they are tuned on the dressed level for dusk
**Then** warm light comes only from Rowan, his shots, the collectables (embers and bells), the weapon pickups and the lanterns, and Rowan, his shots and the collectables stay the warmest things on screen (NFR28, NR100)
**And** every pit reads as dark: no lantern or backdrop light lifts a `KillZone` above the ground around it (NFR29, NR102)

**Given** the lit level
**When** the spots are reviewed
**Then** `src/debug/spots.ts` gains Emberwood's brightest spot and its busiest spot, for the HUD checks
**And** any story detail in the backdrops sits where players pause, never mid-jump (NR83)

**Given** the backdrops
**When** `make build` runs
**Then** the kit and backdrops together stay within the 3.5 MB † budget
**And** `docs/ASSETS.md` records each backdrop with its tool, its licence and whether it is AI-generated

**Given** the lit, dressed level
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at the start, a lantern stretch, a pit, and the brightest and busiest spots, plus the start in a 21:9 and a 4:3 window
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that the hero, enemies, hazards and pickups stand out at a glance (PR14)
**And** in the 21:9 and 4:3 shots the backdrops and lighting carry through the margin past the level's edges to the plain bands (sprint change proposal 2026-11-13, A4)
**And** the before and after shots are shown to the developer

### Story 3.4: Build the wedding glade and the exit under its arch

As a player,
I want Emberwood to end in an empty wedding glade, with the exit under its garland arch,
So that Rowan leaves home through his own wedding and I can see where the level ends.

**Requirements:** FR143, FR149, FR214, FR215, NR83, NR88, NFR36, AR153, AR156, X-B29

**Acceptance Criteria:**

**Given** the Emberwood kit
**When** the glade props are added
**Then** the kit holds `story_glade_arch` (the garland arch), benches and the glade's lanterns, and the glade is set up and empty, with no people (NR88)
**And** the props are placed by hand in `dressing` in the last calm stretch, after the mixed-enemy section (FR149, NR83)

**Given** the `Exit` object
**When** the level loads
**Then** `marker-exit.glb` stands at the exit under the arch, and the arch and the marker sit at play depth (FR143, X-B29)
**And** walking under the arch touches the exit and ends the level exactly as in Epic 1

**Given** the glade props
**When** Rowan walks through the glade
**Then** he passes under the arch and in front of the benches without touching anything solid, because story props never define collision, and the level and jump tests pass unchanged (NFR36, X-B29)
**And** the benches and other glade props sit in the middle-distance and foreground layers; only the arch and the exit marker sit at play depth, and none covers the play area (NR83, X-B29)

**Given** the final layout
**When** the developer reviews the level map
**Then** no enemy can reach the glade, so the exit stays calm (FR149)

**Given** the exit marker and the glade props
**When** `make build` runs
**Then** the exit marker counts toward the 0.5 MB † pickups-and-markers budget and the glade props toward the kit budget, and both checks pass
**And** `docs/ASSETS.md` records each with its tool, its licence and whether it is AI-generated

**Given** the glade
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at `l1-glade`
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that the exit marker and Rowan stand out at a glance
**And** the developer sees the before and after shots and agrees the glade reads as a wedding set up and left empty

### Story 3.5: Carve the waymarkers and draw the final control-sign icons

As a player,
I want each control sign to be a carved waymarker showing the key or button I would actually press,
So that I learn each move from the wood itself, without reading a word.

**Requirements:** FR37, FR38, FR39, FR40, FR41, FR42, NR86, AR154, AR176, UX-DR38, UX-DR43, UX-DR101, UX-DR103

**Acceptance Criteria:**

**Given** the keyboard icon set in `public/assets/icons/` (`icon-` prefix, monochrome, keycap outline with its legend)
**When** the six Level 1 signs use it
**Then** they show only the arcade set: ← and → to move, ↑ aim up, ↓ crouch, Z jump, ↓ + Z drop-through, X spit (FR38, FR40, UX-DR43)
**And** no other bound key (A/D, W/S, Space, K, J) is ever shown

**Given** the gamepad icon set
**When** the same six signs use it
**Then** buttons are position glyphs only, a diamond of four circles with the one to press filled, and the stick and d-pad are direction glyphs: jump fills the south circle, spit fills the west circle, drop-through combines down with south (FR41)
**And** no platform letters, button colours, shapes or logos appear (UX-DR38, UX-DR103)

**Given** each `ControlSign` in the level
**When** `render/level/controlSigns.ts` draws it
**Then** it is a carved woodsman's waymarker with the icon burned into the wood, its colour and light coming from `render/` (NR86, AR176)
**And** it carries no words (UX-DR101), stays at the first use of its action (FR37), and never covers the play area (FR42)

**Given** the last-used device changes from keyboard to gamepad or back
**When** the next frame renders
**Then** every sign shows the new device's set (FR39)
**And** the function that picks the set from `lastDevice` has a unit test, and the developer confirms the swap in the browser with a real keyboard and pad

**Given** the 1280 × 720 viewport
**When** the developer reviews each sign in play
**Then** every icon is legible at a glance, and no sign competes with a hazard, an enemy or a pickup

**Given** the waymarker model and the icons
**When** `make build` runs
**Then** the waymarker counts toward the kit budget, every icon file follows the `icon-` naming, and `docs/ASSETS.md` records each with its tool, its licence and whether it is AI-generated

**Given** the signs
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at each sign's spot, once with each device's set
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that the signs stay clear of the play area
**And** the before and after shots are shown to the developer

### Story 3.6: Make the ember, bell, triple shot and checkpoint art

As a player,
I want embers, bells, the triple shot and checkpoints to look distinct and inviting,
So that I know at a glance what to collect and never mistake a collectable ember for one of my shots.

**Requirements:** FR215, NR80, NR103, NFR28, NFR32, AR145, AR146, AR147, AR148, AR153

**Acceptance Criteria:**

**Given** the pickup and marker sources in `art-src/`
**When** `make models` exports them
**Then** `pickup-ember.glb`, `pickup-bell.glb`, `pickup-triple-shot.glb` and `marker-checkpoint.glb` follow the model conventions, and their generated materials are replaced by the `render/materials` factories (FR215)

**Given** embers on the path and Rowan firing next to them
**When** the developer compares them in play
**Then** collectable embers differ from ember shots in both shape and motion: shots fly straight and fast, embers keep an idle motion of their own that never reads as flight (NFR32)

**Given** the bell and the triple shot
**When** they are reviewed on the look-dev page and in play
**Then** the bell reads as one of Elin's small wedding bells and carries no text (NR80)
**And** the triple shot looks warm, part of Rowan's palette (NR103), with a silhouette distinct enough to become the HUD's triple-shot icon outline
**And** the collectables stay among the warmest things on screen (NFR28)

**Given** the checkpoint marker
**When** the developer reviews it in play
**Then** it reads as a checkpoint at a glance and cannot be confused with the exit marker

**Given** 100 to 150 embers in the level
**When** they render
**Then** they are drawn instanced, with bounding volumes so culling works, so they do not cost a draw call each

**Given** the four models
**When** `make build` runs
**Then** together with the exit marker they stay within the 0.5 MB † pickups-and-markers budget, leaving room for Epic 5's piercing shot
**And** `docs/ASSETS.md` records each with its tool, its licence and whether it is AI-generated

**Given** the pickups in the level
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at an ember arc, each bell, the triple shot and a checkpoint
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that every pickup stands out from the background at a glance
**And** the before and after shots are shown to the developer

Note: the docs give the checkpoint marker no reached or unreached look; reading: one look, with the checkpoint sound marking the touch, unless the developer asks for a visual state.

### Story 3.7: Build the walker model and animations

As a player,
I want the walker to look like a twisted creature of the wood that I can tell at a glance is safe to stomp,
So that the first enemy I meet teaches the stomp without a word.

**Requirements:** FR73, FR74, FR75, FR76, FR77, FR212, NR85, NR104, NFR35, PB59, PB62, AR75, AR76, AR145, AR146, AR147, AR148, AR153, AR154, AR155, AR156

**Acceptance Criteria:**

**Given** the asset pipeline proven on Rowan in Epic 2
**When** the walker goes through it
**Then** it follows each step: a reference concept in the locked style from the image model the developer chose, four views, a Tripo mesh, cleanup in Blender through MCP (1 unit = 1 tile, origin at the feet, facing +X, polygons reduced, parts named in snake_case), its own creature rig, animation, export, and the game's own look (PB59)
**And** `make models` produces `enemy-walker.glb`, which `optimizeModels.ts` accepts
**And** before any Tripo credit is spent, the developer approves the walker's concept and its four views; the walker takes the route Epic 2 recorded in `docs/ASSETS.md`: Tripo, or the hand-built model if Tripo's terms were refused or Rowan's mesh would not deform (readiness proposal 2026-11-13, Q9)

**Given** the walker model
**When** the developer reviews it on the look-dev page and in play
**Then** it reads as a creature the wood twisted (NR85, NR104), with no thorns or spikes, so it looks stompable under the thorn rule
**And** its silhouette matches its 0.84 × 0.62 simulation hitbox closely, checked with the F1 hitbox overlay (FR77)
**And** its colours come from Emberwood palette slots, so Epic 5's recolours are palette swaps (FR76)

**Given** the clips `move` and `death` (FR212, AR155)
**When** the walker patrols and is killed
**Then** the clip follows its simulation state through the enemy clip table, and `move` matches the 1.6 tiles/s patrol without visible foot sliding
**And** a kill plays `death` together with Epic 1's arcade burst

**Given** `render/actors/enemies.ts`
**When** the enemy clip table is written, as Story 2.9 wrote the hero's (AR75)
**Then** `EnemyClip` is a string-literal union of AR155's enemy clip names (`move`, `idle`, `swell_fire`, `hurt`, `death`), and a pure clip table per enemy kind maps the enemy's simulation state to its clip; for the walker, patrolling gives `move` and killed gives `death` (readiness proposal 2026-11-13, Q7)
**And** its Vitest unit tests run in Node, with no WebGL context, under `make test`, and cover every walker state

**Given** walkers in the level
**When** their views are created and updated (AR76)
**Then** each walker gets its own skinned clone of the shared model, made as the three.js r187 documentation says for skinned meshes, so walkers animate independently
**And** every enemy mixer advances on the loop's clamped frame time (0 to 0.25 s), as the hero's does (AR52)
**And** leaving or reloading a level disposes every enemy view, its mixer and the materials it made; switching levels repeatedly through the dev handle leaves the renderer's geometry and texture counts flat (AR151)
**And** in screenshot mode each enemy's clip is set to the spot's `animTime` and holds there, so two captures of the same spot match (AR213)

**Given** a walker is killed
**When** `enemyKilled` arrives for it
**Then** its model stays where it died until its `death` clip ends, then goes, even once its entity has left the `World`; the view never writes to the simulation

**Given** every clip
**When** the developer checks it on the look-dev page
**Then** the mesh deforms cleanly (NFR35, PB62)
**And** if it does not, a simpler hand-built model replaces it, and `docs/ASSETS.md` records the switch

**Given** the walker in play
**When** the simulation tests run
**Then** the walker's behaviour tests from Epic 1 pass unchanged: the model replaces only the grey box (FR73, FR74, FR75, FR77)

**Given** the model
**When** `make build` runs
**Then** it stays within the 0.6 MB † per-enemy budget, and `docs/ASSETS.md` records it with its tools, licences and AI flag

**Given** the walker in the dressed level
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at the stomp-teaching spot and in section 4
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that the walker stands out from the backdrop at a glance
**And** the before and after shots are shown to the developer

### Story 3.8: Build the thorn flyer model and animations

As a player,
I want the thorn flyer to show its thorns clearly,
So that I know at a glance it hurts to land on and must be shot.

**Requirements:** FR78, FR212, NR104, NFR35, PB59, PB62, AR153, AR155

**Acceptance Criteria:**

**Given** the asset pipeline
**When** the thorn flyer goes through it
**Then** it follows the same steps as the walker in Story 3.7, with its own creature rig (PB59)
**And** `make models` produces `enemy-thorn-flyer.glb`, which `optimizeModels.ts` accepts
**And** as for the walker, the developer approves its concept and four views before any Tripo credit is spent, and it takes the route Epic 2 recorded (readiness proposal 2026-11-13, Q9)

**Given** the model
**When** the developer reviews it on the look-dev page and in play
**Then** its thorns are clearly visible from every angle the camera shows, so it reads as not stompable under the thorn rule (FR78)
**And** its silhouette matches its 0.74 × 0.74 hitbox closely, checked with the F1 hitbox overlay, and its colours come from Emberwood palette slots (NR104)

**Given** the clips `move` and `death` (FR212, AR155)
**When** the flyer swings, bobs and is killed
**Then** its position comes only from the simulation's path, the `move` clip adds no travel of its own, and a kill plays `death` with Epic 1's burst
**And** it reuses Story 3.7's enemy clip table and view code, adding the flyer's rows (`move`, and `death` on a kill) with their unit tests (readiness proposal 2026-11-13, Q7)

**Given** every clip
**When** the developer checks it on the look-dev page
**Then** the mesh deforms cleanly, or a simpler hand-built model replaces it and `docs/ASSETS.md` records the switch (NFR35, PB62)

**Given** the flyer in play
**When** the simulation tests and `make build` run
**Then** its Epic 1 behaviour tests pass unchanged, the model stays within the 0.6 MB † per-enemy budget, and `docs/ASSETS.md` records it with its tools, licences and AI flag

**Given** the flyer in the dressed level
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at the low-flyer and the aim-up spots
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that the flyer and its thorns stand out at a glance
**And** the before and after shots are shown to the developer

### Story 3.9: Build the rooted spitter model and animations

As a player,
I want the rooted spitter to swell visibly before it fires and its seed to read as danger,
So that I can see each shot coming and choose to duck, jump or shoot.

**Requirements:** FR79, FR80, FR81, FR212, NR104, NFR35, PB59, PB62, AR153, AR155

**Acceptance Criteria:**

**Given** the asset pipeline
**When** the rooted spitter goes through it
**Then** it follows the same steps as the walker in Story 3.7, with its own rig (PB59)
**And** `make models` produces `enemy-rooted-spitter.glb`, which `optimizeModels.ts` accepts
**And** as for the walker, the developer approves its concept and four views before any Tripo credit is spent, and it takes the route Epic 2 recorded (readiness proposal 2026-11-13, Q9)

**Given** the model
**When** the developer reviews it on the look-dev page and in play
**Then** its thorned crown is clearly visible, so it reads as not stompable (FR79), and it turns to face Rowan as the simulation says
**And** its silhouette matches its 0.8 × 1.0 † hitbox closely, checked with the F1 hitbox overlay, and its colours come from Emberwood palette slots (NR104)

**Given** the clips `idle`, `swell_fire`, `hurt` and `death` (FR212, AR155)
**When** the spitter attacks
**Then** the swell is visible for the whole of the simulation's 0.5 s swell, and the seed leaves at the moment `swell_fire` releases it (FR80)
**And** a first hit plays `hurt` with Epic 1's flash, and the second plays `death` with the burst
**And** it reuses Story 3.7's enemy clip table and view code, adding the spitter's rows (`idle`, `swell_fire`, `hurt` and `death`) with their unit tests (readiness proposal 2026-11-13, Q7)

**Given** a seed in flight
**When** the developer watches it against the Emberwood backdrops
**Then** it reads as a hazard at a glance, carries no warm light, and cannot be mistaken for an ember or one of Rowan's shots (FR81)

**Given** every clip
**When** the developer checks it on the look-dev page
**Then** the mesh deforms cleanly, or a simpler hand-built model replaces it and `docs/ASSETS.md` records the switch (NFR35, PB62)

**Given** the spitter in play
**When** the simulation tests and `make build` run
**Then** its Epic 1 behaviour tests pass unchanged, the model stays within the 0.6 MB † per-enemy budget, and `docs/ASSETS.md` records it with its tools, licences and AI flag

**Given** the spitter in the dressed level
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at the spitter-teaching spot, with one capture mid-swell
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks that the spitter, its swell and its seed stand out at a glance
**And** the before and after shots are shown to the developer

### Story 3.10: Start sound through a guarded mixer, and mute with M

As a player,
I want sound to start on my first key press or click, M to silence it at any time, and the game to keep running if my browser refuses audio,
So that sound works inside the itch.io embed without ever stopping the game, and I can mute it instantly.

**Requirements:** FR189, AR182, AR190, AR191, AR192, AR195, AR196, UX-DR21, UX-DR39, UX-DR72

**Acceptance Criteria:**

**Given** `platform/audioContext.ts`, built on the Web Audio API with no library (AR190)
**When** the first key press or click arrives
**Then** the `AudioContext` is created or resumed, and `isAudioLocked` in the `PresentationSettings` snapshot turns false
**And** before that, the context is locked: nothing plays and the game runs normally
**And** these transitions have unit tests in Vitest against a stub context

**Given** a gamepad button press
**When** audio is still locked
**Then** it does not unlock audio, because a gamepad press is not user activation; the game keeps running silently, and the next key press or click unlocks it (AR191; the audio notice is Epic 6)

**Given** creating or resuming the context throws or is rejected
**When** the wrapper catches it
**Then** audio is off for the session, the failure is logged once, no notice is shown, and the game keeps running (AR195)
**And** a context still waiting for a key press or click counts as locked, not failed
**And** both cases have unit tests with a throwing stub

**Given** an unlocked context
**When** `audio/mixer.ts` builds the graph
**Then** a master bus feeds music, effects and ambience buses (AR192), and the bus gains follow `musicVolume` and `effectsVolume` in the snapshot through the curves in `audio/mix.ts` (the settings that change them are Epic 6)
**And** the graph's wiring has a unit test against the stub context

**Given** any app state, including play, pause and results
**When** the player presses M
**Then** the master bus mutes or unmutes and `isMuted` in the snapshot flips (FR189); the press goes to the app, never to the simulation, and has no gamepad binding
**And** mute is never saved: every page load starts unmuted

**Given** `isMuted` is true
**When** the overlay renders
**Then** `ui/overlay.ts`, not `hud.ts`, shows `hud-mute-indicator`: the speaker-off icon at `{spacing.hud-icon}` in `text-primary` with the `hud-outline` ring, top-right, `{spacing.safe-margin}` in, with no animation (UX-DR21, AR182)
**And** it shows in play, on the pause scrim and on the results scrim, drawn above every scrim
**And** it disappears as soon as M unmutes

**Given** the mute indicator
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) over Emberwood's brightest spot and over the pause scrim
**Then** each round lists the three biggest problems against the style guide and fixes them
**And** the before and after shots are shown to the developer

Note: the docs map two volume settings onto three buses without saying which drives ambience; reading: the effects volume, with ambience's level relative to it in `audio/mix.ts`; Epic 6's settings work confirms.

### Story 3.11: Add the bare title gate

As a player,
I want the game to open on its name and "Click or press any key",
So that my first press starts the sound and gives the game keyboard focus inside the itch.io page.

**Requirements:** FR171, FR195, AR102, AR103, AR180, AR183, AR184, AR188, AR189, AR191, UX-DR33, UX-DR39, UX-DR46, UX-DR64, UX-DR72, UX-DR100, UX-DR101, UX-DR112, X-B23, X-B24, X-B32

**Acceptance Criteria:**

**Given** the page has opened and the shared assets have loaded (the boot loading screen is Epic 6)
**When** the app enters the title gate
**Then** the gate screen, inside `ui/screens/title.ts`, shows the provisional wordmark "Emberbound" in `display-xl`, centred in the upper third, and "Click or press any key" in `ui-md` under it, on `surface-screen` (UX-DR33, UX-DR46)
**And** the cursor shows (X-B32), the mute indicator does not, and the simulation does not run

**Given** the gate
**When** a key press or click arrives
**Then** it passes the gate: the `AudioContext` is created or resumed through Story 3.10's wrapper, the game's root element takes keyboard focus so the next key press reaches the game without another click, the last device becomes keyboard, and the prompt fades out (FR171, UX-DR72)
**And** the press that passed the gate is consumed: it does not also toggle mute or reach the next screen

**Given** the gate
**When** a gamepad button is pressed
**Then** it passes the gate, the last device becomes gamepad, audio stays locked and the game goes on silently until the first key press or click (AR191, UX-DR72)
**And** the developer confirms this with a real pad (the itch.io check is Epic 6)

**Given** the gate is passed
**When** the app moves on
**Then** Emberwood starts as Epic 1's level start does (AR102, AR103, UX-DR112)
**And** this story leaves the slot between the gate and play for the intro and the loading card

**Given** Level 1's results screen
**When** the player confirms Continue
**Then** the app returns to the title gate, because until Epic 6 "the title" means the gate (X-B23), and passing it again starts a new run with fresh run stats
**And** Back on the results screen is ignored (X-B24)

**Given** the gate is showing
**When** Esc, P or Start is pressed, or an auto-pause trigger fires
**Then** Esc and P pass the gate like any key and Start like any gamepad button, nothing pauses, and an auto-pause trigger only clears held input

**Given** the app state machine
**When** its Vitest tests run
**Then** they cover each gate transition: key, click and gamepad button, the locked audio after a gamepad pass, results confirm returning to the gate, results Back doing nothing
**And** a Playwright smoke check loads the page, sees the gate, presses a key and reaches play

**Given** a development build opened with a debug URL parameter (`level`, `checkpoint` or `shot`)
**When** the page loads
**Then** it skips the title gate and goes straight to the level, checkpoint or spot asked for, and Stories 3.12 and 3.14 keep it skipping the loading card's reading floor and the intro; audio stays locked until the first key press or click (readiness proposal 2026-11-13, Q12)
**And** a release build has no bypass, since the URL parameters are development-only (AR207), and an app test covers a start with and without a parameter
**And** Epic 1's Playwright specs (Story 1.11's pause checks, Story 1.27's sign swap and `make smoke`) are updated here to pass the gate or use the bypass, and stay green as Stories 3.12 and 3.14 add the loading card and the intro

**Given** the gate screen
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds), with `make shots` extended to capture the gate
**Then** each round lists the three biggest problems against the style guide and fixes them
**And** the before and after shots are shown to the developer

Note: the gate's fade-out has no entry in the UI timings; reading: a new `gateFadeSeconds` in `core/uiTimings.ts` (starting value 0.3 s †), like the other screen fades.
Note: what the press that passes the gate does besides passing it is unspecified; reading: nothing (M there passes the gate without muting).

### Story 3.12: Show Emberwood's loading card from the story-text module

As a player,
I want each level to open on a card with its name and one line of story while it loads,
So that I learn why Rowan is going through Emberwood before I play it.

**Requirements:** FR156, FR159, FR168, FR195, NR1, NR3, NR4, NR5, NR8, NR10, NR13, NR28, NR29, NR30, AR104, AR183, AR184, AR185, AR187, AR188, UX-DR32, UX-DR39, UX-DR49, UX-DR85, UX-DR90, UX-DR100, X-B2, X-B24, X-B32

**Acceptance Criteria:**

**Given** a new module `content/storyText.ts` exporting `STORY_TEXT`, keyed by moment (NR1, AR187)
**When** it is created
**Then** it holds Emberwood's line exactly as the narrative design's script has it: "He went after her through Emberwood, in a body that was no longer his." (NR30, FR168)
**And** a unit test checks the line character for character against the script and counts its 14 words (NR10)
**And** no screen hard-codes story text, nothing inside the level renders text, and the line appears only on the loading card (FR156, NR3, NR4); the voice rules hold because the line is the approved script (NR5, NR8)

**Given** the gate is passed
**When** the app enters Level loading for Emberwood
**Then** `ui/screens/loadingCard.ts` shows the `loading-card`: `surface-screen` ground, the name "Emberwood" from `content/levels.ts` centred in `display-lg`, and the line below it in `display-body`, wrapped at `{spacing.text-measure}` (UX-DR32, UX-DR49, UX-DR100)
**And** Emberwood's assets load behind the card, and the card looks the same on every load (NR28, FR159)

**Given** the loading card
**When** time passes
**Then** it stays up for at least the reading floor in `core/uiTimings.ts` (starting value 3 s †) and until loading is done, whichever is later, then goes to Playing by itself, fading in and out over `loadingCardFadeSeconds` (starting value 0.3 s †) (AR104, NR29, UX-DR90)
**And** app tests with a fake clock and a fake loader cover both orders: loading finishing before the floor, and after it
**And** under Story 3.11's dev bypass, the card has no reading floor and goes to Playing as soon as loading is done, covered by an app test (readiness proposal 2026-11-13, Q12)
**And** the developer signs off on the floor; a failed load keeps Epic 1's handling (the Retry panel is Epic 6)

**Given** the loading card
**When** the player presses Back, Esc, P or Start, or an auto-pause trigger fires
**Then** nothing happens except that the trigger clears held input (UX-DR85, UX-DR49, X-B24)
**And** M toggles mute and the mute indicator shows on the card; the cursor is hidden (X-B32); confirm does nothing (the replay skip is Epic 6)

**Given** a level starts loading
**When** the app decides first play or replay (default X-B2)
**Then** it is a replay only if the level is already in the finished set as it loads; until Epic 6's save, the finished set is held in memory for the session, a level joins it when its results show, and a page reload empties it
**And** the result sets `isStorySkippable` on the new `World` and is kept for the loading card's replay skip in Epic 6
**And** unit tests in `app/` cover a first load, a load after finishing, and a load after a reload

**Given** the player spends any time on the loading card
**When** Playing starts
**Then** the clear time is 0, and time on the gate and the loading card never counts toward it (NR13), shown by an app test

**Given** the loading card
**When** a Playwright smoke check passes the gate
**Then** it sees "Emberwood" and its line, then play after the floor
**And** the critic loop (`make shots ROUND=n`, at most 3 rounds, with `make shots` extended to capture the card) lists the three biggest problems against the style guide and fixes them, and the before and after shots are shown to the developer

Note: X-B2 assumes a save; reading for Epic 3: the finished set lives in memory for the session until Epic 6's save replaces its source.

### Story 3.13: Build the five intro cards

As a player,
I want the intro told on five silhouette cards with one line each,
So that I learn who Rowan is and what he lost before I play.

**Requirements:** FR164, FR165, FR168, FR169, FR195, FR216, NR2, NR5, NR7, NR9, NR10, NR11, NR18, NR21, NR22, NR23, NR24, NR25, NR26, NR77, NR78, NR79, NR81, NR82, AR84, UX-DR31, UX-DR39, X-B27, PR14

**Acceptance Criteria:**

**Given** `content/storyText.ts`
**When** the intro lines are added
**Then** `STORY_TEXT` holds the five lines exactly as the script has them, curly quotes included (FR168, NR26):
**And** card 1: `Ten years ago, for a lord's coin, Rowan the Cindersworn burned Harrowmere.` (NR21)
**And** card 2: `“I will pay with what I hold dearest when the debt is called,” he had sworn.` (NR22)
**And** card 3: `He held nothing dear, until he put the fire away and met Elin the bell-maker.` (NR23)
**And** card 4: `“The debt is called,” said Lord Maldrek, the Tithe-Collector, and took Elin.` (NR24, NR77; "the Tithe-Collector" is an approved term, X-B27)
**And** card 5: `Rowan reached for the old fire to stop him, and the Ember Below claimed him too.` (NR25)
**And** unit tests check each line character for character against the script, the word counts 12, 16, 15, 12 and 16 (71 in all, NR10), exactly two quoted lines, on cards 2 and 4 (NR9), and only the approved story terms (NR7, FR169); `STORY_TEXT` now holds 6 of version one's 10 text moments (NR11)

**Given** `content/cards.ts`
**When** the five intro cards are defined
**Then** each card is 3 to 5 † flat silhouette layers with palette slots from the story palette and its own light, rendered by `render/cards/cardScene.ts` as an app state's scene (FR164, AR84)
**And** card 2 reuses the Epic 0 sample card; the shapes come from the source Epic 0 chose, and placeholder silhouettes are acceptable (NR26)
**And** the card shapes are in the shared bundle, loaded at boot with the other shared assets, so the intro shows before any level loads (readiness proposal 2026-11-13, Q10)

**Given** each card's image
**When** the developer reviews it
**Then** it shows every element the script lists, so the story reads even with placeholder shapes:
**And** card 1: night, the siege line on a rise, human Rowan's silhouette with fire pouring up from a crack at his feet, the walled town below catching; the lord who paid is not shown (NR82)
**And** card 2: Rowan kneeling at a glowing crack in the earth, fire rising into his cupped hands, nothing else warm; the crack has no face (NR81)
**And** card 3: the village foundry, Elin at work among hanging bells, Rowan in the doorway with an axe on his shoulder (NR79)
**And** card 4: the wedding eve, lanterns and a garland, Maldrek's tall cold silhouette holding Elin by the wrist, a string of small bells at her waist, Rowan behind
**And** card 5: Rowan mid-change, horns breaking out, a furnace in his chest; Maldrek and Elin receding down a path into the dark of the wood
**And** Maldrek appears only on cards 4 and 5, and Elin only on cards 3, 4 and 5, receding with Maldrek on card 5 as the script has it (NR25, NR78, NR79; readiness proposal 2026-11-13, Q11)

**Given** the card lighting
**When** it is reviewed against `docs/STYLE_GUIDE.md`
**Then** warm light marks only Rowan's fire and, if Epic 0 accepted the cards' warm-light exception, Elin and home; if Epic 0 refused it, the forge glow on card 3 is pale and cold
**And** Maldrek never carries warm light (NR18)

**Given** a card on screen
**When** `ui/screens/cardText.ts` shows its line
**Then** the line is `display-body` `text-primary`, wrapped at `{spacing.text-measure}`, on a `surface-scrim` band over the art at the place fixed on the Epic 0 sample card, fading in over `cardTextFadeSeconds` (starting value 0.3 s †) (UX-DR31)
**And** the text is drawn over the art, never baked into it (FR165, NR2)

**Given** the look-dev page
**When** it shows the five intro cards with their text
**Then** the developer judges each card's band extent there (UX-DR31)
**And** `make build` keeps the cards within the 1 MB † story-card budget, leaving room for Epic 5's two cards, and `docs/ASSETS.md` records each shape source with its tool, its licence and whether it is AI-generated (FR216)

**Given** the five cards
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) on the look-dev page
**Then** each round compares the cards with the style guide's card style, lists the three biggest problems and fixes them (PR14)
**And** the before and after shots are shown to the developer

### Story 3.14: Play the intro after the gate, with the card input rules

As a player,
I want the intro to wait for me, ignore a stray double press, and let me skip it,
So that I read each card at my own pace and never lose one by accident.

**Requirements:** FR157, FR166, NR12, NR16, NR17, NR19, NR20, NFR25, AR84, AR96, UX-DR31, UX-DR38, UX-DR48, UX-DR64, UX-DR79, UX-DR85, UX-DR90, UX-DR112, X-B24, X-B28, X-B32

**Acceptance Criteria:**

**Given** the gate is passed
**When** the app moves on
**Then** it plays intro cards 1 to 5 as app states, then Emberwood's loading card (UX-DR48, UX-DR64, UX-DR112, NR19, NR20 as the bare gate reads it)
**And** in Epic 3 every pass through the gate plays the intro; saving whether it was seen is Epic 6
**And** Story 3.11's dev bypass skips the intro along with the gate, and Epic 1's Playwright specs stay green (readiness proposal 2026-11-13, Q12)
**And** story stops play only here and at the loading card, before the level starts (NR12)

**Given** a card has just appeared
**When** confirm, Back or a click arrives before the card minimum in `core/uiTimings.ts` (starting value 1.5 s †)
**Then** it is ignored (FR166, NR16, AR96, UX-DR79); only M still acts, as it does anywhere
**And** a press that began before the card appeared is dropped, even if it is released after the minimum; menu actions are presses, never held state
**And** Vitest tests in `input/` and `app/` cover a press just before and just after the minimum, a press latched before the card appeared, and a key held across two cards

**Given** the card minimum has passed
**When** the card waits
**Then** the advance hint fades in over `advanceHintFadeSeconds` (starting value 0.3 s †) at the band's lower right, as DESIGN.md `card-text` places it, in `text-muted` at `{spacing.hud-icon-sm}`: the keyboard confirm keycap or the gamepad south position glyph for the last-used device (UX-DR31, UX-DR38)
**And** it never sits on bare art, and it swaps on the next frame after a device change
**And** the card waits for the player indefinitely; nothing auto-advances (X-B28, UX-DR90)

**Given** the minimum has passed
**When** the player confirms (Enter, Space, gamepad south, or a click, X-B24)
**Then** the intro advances one card, and confirm on card 5 opens the loading card
**And** when the player presses Back (Esc, Backspace or gamepad east), the rest of the intro is skipped and the loading card opens (FR157)
**And** the cards hold nothing else to interact with (NR17)

**Given** an intro card
**When** P or Start is pressed, or an auto-pause trigger fires
**Then** nothing pauses and a trigger only clears held input (UX-DR85)
**And** M toggles mute, but the mute indicator stays hidden on cards; the cursor is hidden (X-B32)

**Given** the five cards
**When** the developer reads through them at a normal pace, advancing once each hint appears
**Then** the intro takes about 60 s or less, the script's content budget, not a timer (NFR25, X-B28)
**And** the developer signs off on the card minimum and the fade timings

**Given** the intro in the app
**When** Playwright smoke checks run
**Then** one passes the gate, confirms through all five cards after each minimum and reaches the loading card, and another presses Back on card 2 after the minimum and reaches the loading card
**And** the critic loop (`make shots ROUND=n`, at most 3 rounds, with `make shots` extended to capture a card with each device's hint) lists the three biggest problems against the style guide and fixes them, and the before and after shots are shown to the developer

Note: the keyboard confirm glyph for the hint is unspecified (Enter and Space both confirm); reading: an Enter keycap, as in Marta's journey, added to `public/assets/icons/`.

### Story 3.15: Add Emberwood's music and ambience

As a player,
I want a short, hummable Emberwood tune carrying a bell-like phrase, a stinger when I reach the exit, and the sound of the dusk forest under it all,
So that the wood sounds like home and I start to link the bells with the music.

**Requirements:** FR196, FR198, FR199, FR200, FR202, FR217, NR105, NR108, NR109, AR68 (`regionEntered`), AR149, AR193, AR194, AR196, PR15 (`regionEntered`), PR26, X-B23
**Depends on:** the developer's choice of audio tools and formats, made at the start of this story (readiness proposal 2026-11-13, Q9)

**Acceptance Criteria:**

**Given** the audio tools, which the GDD leaves open until Epic 3
**When** this story starts
**Then** the developer chooses the audio tools and their formats, and each tool's licence and commercial-use terms are in `docs/ASSETS.md` before any asset is made (PR26; readiness proposal 2026-11-13, Q9)
**And** if a tool's terms forbid commercial use, the story stops and the developer decides
**And** the file formats are chosen with the tool, and each loop plays through Web Audio with no audible gap or click at the seam in Chrome, Edge and Firefox, checked by the developer over at least three repeats (AR149; Safari is best effort)

**Given** the Level 1 tune, `music-emberwood.*`
**When** the developer reviews it
**Then** it is a short, hummable, arcade-era melody played on modern instruments (FR196)
**And** it carries Elin's motif, a bell-like phrase of 3 or 4 notes (FR200, NR108), whose notes are written into the story's completion notes for the bell sound to reuse

**Given** Emberwood in play
**When** `audio/music.ts` plays the level's music
**Then** one looping buffer plays on the music bus (AR193)
**And** the same tune serves as the title tune: it starts when the gate unlocks audio, or on the first key press or click after a gamepad pass, and plays on through the intro and the loading card into Emberwood without restarting (FR198, NR109, X-B23)
**And** `music-emberwood` is in the manifest's shared bundle, loaded at boot, so it is ready at the gate before Emberwood's own assets load; the architecture says which bundle every other asset kind goes in (readiness proposal 2026-11-13, Q10)

**Given** Rowan touches the exit
**When** `levelCompleted` arrives
**Then** the level music stops and the end-of-level stinger plays once on the music bus (FR199, AR193)
**And** when the results return to the gate, the tune starts again from the top

**Given** Emberwood in play
**When** `audio/ambience.ts` plays the level's bed, `amb-emberwood.*`
**Then** one looping bed of dusk forest, wind in the leaves and creaking lanterns plays on the ambience bus, under the music (FR202, NR105, AR194)

**Given** an `AudioFade` region over the wedding glade in `emberwood.tmj`, with its `bus` property set to `ambience` and a lowered target gain set with the developer
**When** Rowan enters it and `regionEntered` arrives for it
**Then** the ambience bus fades to the region's target gain, so the bed is hushed in the glade (NR105; sprint change proposal 2026-11-13, A9)
**And** a respawn outside the region restores the bus; the `AudioFade` class (`bus`: `music` or `ambience`, and a target gain) joins the Tiled project and the compiler's checks here, ready for Level 3's music drop-out in story 5.16

**Given** the compiled level's regions, which `regionEntered` so far only names in the `SimEvent` union
**When** the simulation steps
**Then** it emits `regionEntered { regionId, kind }` once on the step Rowan's box first overlaps a region, and for that region again only after his box has left it; which regions he is inside is kept on the `World`, and a respawn or a pit return clears it, so he re-enters cleanly (AR68; readiness proposal 2026-11-13, Q7)
**And** Vitest unit tests in Node cover a single entry with no repeat while he stays inside, leaving and re-entering, a respawn inside the region (one new event) and a respawn outside it (none) (PR15)

**Given** the music and ambience files
**When** `make build` runs
**Then** they stay within the 8.5 MB † music-and-ambience budget with room for the other levels' tunes, the warden arrangement, the other stingers, the other beds and the great wheel's loop (FR217)
**And** `docs/ASSETS.md` records each with its tool, its licence and whether it is AI-generated

**Given** a full play from the gate to the results
**When** the developer listens
**Then** the developer signs off on the tune, the motif, the stinger and the mix levels in `audio/mix.ts`

Note: music on the gate, intro and loading card is unspecified; reading: the Emberwood tune runs unbroken from the gate unlock into play, and restarts on the gate after the results.

### Story 3.16: Add the hero and enemy sounds

As a player,
I want every jump, shot, stomp, hit and death to have its own sound, with the ember spit recognisable on its own,
So that I feel each action land and can hear a spitter about to fire.

**Requirements:** FR203, FR204, NR4, NR63, AR196
**Depends on:** the audio tools and formats chosen in Story 3.15, with their terms logged in `docs/ASSETS.md` (readiness proposal 2026-11-13, Q9)

**Acceptance Criteria:**

**Given** a new `audio/sfx.ts` that handles every `SimEvent` in an exhaustive switch
**When** Rowan acts
**Then** `shotFired` plays the ember spit, `rowanJumped` the jump, `rowanStomped` the stomp, `rowanHurt` the hurt sound, `rowanDied` the death sound and `rowanFellInPit` the pit fall, on the effects bus (FR203)
**And** events with no sound yet (Epic 4's ledge grab, climb and warden events) are listed as silent cases, so the switch stays exhaustive

**Given** `rowanLanded`
**When** its `impactSpeed` is compared with `CONFIG.feedback.landingSoundMinSpeed`
**Then** the landing sound plays only above 9 tiles/s, and a unit test checks a landing at exactly the threshold (silent) and one just above it (FR203)

**Given** enemies in play
**When** their events arrive
**Then** `enemyHit` plays the hit, `enemyKilled` the death, `spitterSwelled` the swell and `seedFired` the seed (FR204)
**And** the swell sound starts with the visible swell, so the warning is both seen and heard

**Given** Rowan's sounds
**When** the developer reviews them
**Then** none contains words or grunted speech; his voice is the ember spit, his furnace breath and his hurt and death sounds (NR63, NR4)

**Given** a triple-shot volley, which fires three shots in one step
**When** the three `shotFired` events arrive
**Then** the spit plays once for the volley, not three times stacked

**Given** the sound files, named `sfx-<name>.*`
**When** `make build` runs
**Then** they count toward the 2 MB † sound-effects budget, and `docs/ASSETS.md` records each with its tool, its licence and whether it is AI-generated
**And** the developer signs off that the ember spit is recognisable on its own, and that holding spit at full rate stays clean (FR203)

Note: when the furnace breath plays is unspecified; reading: an occasional quiet breath while Rowan idles.
Note: the triple shot's three `shotFired` events in one step are unaddressed for sound; reading: one spit per volley.

### Story 3.17: Add the world and interface sounds

As a player,
I want pickups, checkpoints and menus to answer me with sound, and a warning when my weapon is about to run out,
So that I notice progress without looking at the HUD and the weapon never ends by surprise.

**Requirements:** FR54, FR206, FR207, UX-DR87, AR196
**Depends on:** the audio tools and formats chosen in Story 3.15, with their terms logged in `docs/ASSETS.md` (readiness proposal 2026-11-13, Q9)

**Acceptance Criteria:**

**Given** world events in play
**When** they arrive
**Then** `emberCollected` plays the ember pickup, `heartRestored` the heart restored, `checkpointReached` the checkpoint and `weaponCollected` the weapon pickup, on the effects bus (FR206)
**And** a run through an ember trail sounds clean, not clipped or piled up, by the developer's ear

**Given** a weapon with time left
**When** `weaponRunningOut` arrives at the weapon-warning time in `CONFIG` (starting value 3 s †)
**Then** the weapon running-out sound plays (FR54, FR206)
**And** it plays on the same event that starts the HUD bar's blink, so the warning is heard and seen (UX-DR87)
**And** the developer signs off on the warning time

**Given** the interface
**When** focus moves, the player confirms, presses Back, or pause opens
**Then** the menu-move, confirm, back and pause sounds play through the `playUiSound` callback that `main.ts` passes to `ui/` (FR207)
**And** on the intro cards, an advance plays confirm and a skip plays back

**Given** the sounds made so far in this epic
**When** they are listed in `docs/ASSETS.md`
**Then** Level 1 uses about 22 sounds, leaving Epic 4's ledge-grab, climb, seal-break and five warden sounds inside the game's total of about 30 (FR207)

**Given** the sound files
**When** `make build` runs
**Then** they stay within the 2 MB † sound-effects budget, and `docs/ASSETS.md` records each with its tool, its licence and whether it is AI-generated
**And** the developer signs off on the set in a full play

Note: which interface sounds the cards use is unspecified; reading: confirm on an advance, back on a skip, none on the gate.

### Story 3.18: Ring Elin's bell: the bell sound and the bell toast

As a player,
I want each bell I find to ring with the tune's motif and briefly show how many I have found,
So that I connect the bells with Elin and know my count without a lasting counter on screen.

**Requirements:** FR120, FR200, FR206, NR3, NR79, NR80, NR108, AR185, UX-DR20, UX-DR39, UX-DR41, UX-DR102
**Depends on:** the audio tools and formats chosen in Story 3.15, with their terms logged in `docs/ASSETS.md` (readiness proposal 2026-11-13, Q9)

**Acceptance Criteria:**

**Given** `bellFound`
**When** it arrives
**Then** a clear bell tone plays the first notes of Elin's motif from the Emberwood tune, on the effects bus (FR200, FR206, NR108)
**And** the developer hears the link to the tune; every bell pickup is Elin's voice (NR79)

**Given** `bellFound`
**When** `ui/screens/hud.ts` shows `hud-bell-toast`
**Then** the bell icon at `{spacing.hud-icon-sm}` is followed, `{spacing.2}` after it, by "Bell n of 3" in `ui-sm` `text-primary`, on the hearts row `{spacing.4}` right of the last heart, with the `hud-outline` ring on glyph and text and no plate (UX-DR20, UX-DR102)
**And** it fades in, holds and fades out over `bellToastInSeconds`, `bellToastHoldSeconds` and `bellToastOutSeconds` in `core/uiTimings.ts` (starting values 0.15, 2.0 and 0.4 s †) (AR185)

**Given** bells found in this run
**When** the toast counts them
**Then** n is the number of bells found this run, the same number the results screen shows as "Bells n of 3" (FR120)
**And** a respawn does not reset it, because found bells stay found
**And** there is no lasting bell counter on the HUD, and the bell and the toast carry no story text (UX-DR41, NR3, NR80)

**Given** the toast is holding
**When** a second bell is found
**Then** the text changes to the new count and the hold restarts

**Given** the bell toast
**When** a Playwright check places Rowan on a bell through the dev handle and steps a frame
**Then** it reads "Bell 1 of 3"

**Given** the toast at Emberwood's brightest spot and a dark spot
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the three biggest problems against the style guide and fixes them, and checks the toast reads on both
**And** the before and after shots are shown to the developer, who signs off on the toast timings

### Story 3.19: Finish the HUD and judge it in play

As a player,
I want the HUD to show my hearts, ember meter and weapon time clearly over the busiest parts of Emberwood,
So that I read my state at a glance and never have to hunt for it.

**Requirements:** FR54, FR194, UX-DR11, UX-DR15, UX-DR17, UX-DR18, UX-DR19, UX-DR40, UX-DR41, UX-DR42, UX-DR43, UX-DR50, UX-DR86, UX-DR87, UX-DR88, UX-DR89, UX-DR92, UX-DR103, AR186, PR14

**Acceptance Criteria:**

**Given** the HUD icon set
**When** its final versions replace the provisional ones
**Then** heart, bell, triple shot, piercing shot and speaker-off are single-colour silhouettes readable at `{spacing.hud-icon-sm}`, used by the hearts, the toast, the weapon timer and the mute indicator (UX-DR11)
**And** the triple-shot icon follows the pickup's outline from Story 3.6, and triple and piercing differ by outline shape, never by colour alone (UX-DR86)
**And** `docs/ASSETS.md` records each icon

**Given** play events
**When** the hearts, ember meter and weapon timer respond
**Then** they behave as UX-DR17 to UX-DR19 specify with the final art: the rightmost heart cracks and shakes on a hit or pit fall, pops after the ember transfer, the last heart pulses by scale at 2 Hz or less, and all three refill on respawn; the meter fills by length from 0 to 50 and glows steadily when full with full hearts; the timer's icon and bar drain from the simulation's remaining time, hide on expiry and death, and stay through a pit fall (FR194, UX-DR50)
**And** the overlay touches the DOM only when a value changes (AR186)

**Given** `weaponRunningOut`
**When** the timer warns
**Then** the bar blinks at 3 Hz or less, alternating `warning` and the empty track, in step with Story 3.17's warning sound (FR54, UX-DR87)
**And** reduced motion does not change the blink, and `warning` never covers a large area (UX-DR88)

**Given** `reducedMotion` is set in the `PresentationSettings` snapshot
**When** Rowan is hit or down to one heart
**Then** the heart cracks without the icon shake and the last heart does not pulse (FR194, UX-DR89 for the HUD; the setting itself is Epic 6)

**Given** the HUD in play
**When** the developer reviews it at 1280 × 720 and at 1920 × 1080
**Then** the cluster sits top-left within about 3 × 0.75 tiles with a weapon active, the mute indicator top-right, nothing in the middle or bottom of the screen (UX-DR40)
**And** the HUD is hidden on the gate, the cards and the loading card, and sits under the scrim when paused (UX-DR41)
**And** there is no clock, score, lives, persistent bell counter, minimap, damage vignette or edge tint, and nothing counts deaths (UX-DR41, UX-DR92, UX-DR103); the only diegetic UI is the waymarkers and the ember arcs (UX-DR43)

**Given** the HUD in its busiest state (a heart lost, the meter part-filled, a weapon warning, the toast and the mute indicator showing), set up through the debug tools
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds) at Emberwood's brightest and busiest spots
**Then** the `hud-outline` ring, shadow and `hud-track` hold every element clear of the backdrop, and the Epic 0 token values are judged in play (UX-DR15)
**And** a token value that fails in play changes only through `gds-ux` Update, with the contrast table re-measured and every target still met
**And** each round lists the three biggest problems and fixes them, and the before and after shots are shown to the developer (PR14)

**Given** the hearts at about 23 px at 1280 × 720
**When** this story ends
**Then** `{spacing.hud-icon}` is unchanged; raising it waits for the heart legibility check with the primary audience (UX-DR42)

Note: reduced motion cannot be set until Epic 6's settings, so the HUD case is checked through a development-only `?reducedMotion=1` URL parameter added to `debug/urlParams.ts`; Epic 4 reuses it.

### Story 3.20: Run the critic loop on the Level 1 spots

As a developer,
I want a full critic-loop pass over every Level 1 spot with the readability checks,
So that the finished Emberwood is judged in the engine against the style guide before players see it.

**Requirements:** PR14, NFR26, NFR27, NFR28, NFR29, NFR30, NFR31, NFR32, NR100, NR102, FR42, FR123

**Acceptance Criteria:**

**Given** `src/debug/spots.ts`
**When** the Level 1 spot list is reviewed
**Then** it covers the start with the foundry chimney, each checkpoint, each section's teaching beat (the aim-up flyer, the spitter, the moving platform over the pit, the spikes on the cliff top, the drop-through bridge, the triple shot), each control sign, each bell and its hint, the brightest and busiest spots, a pit, Rowan firing near embers, and the glade exit
**And** `make shots ROUND=n` captures every spot headless

**Given** a round's captures
**When** they are compared with the reference image and `docs/STYLE_GUIDE.md`
**Then** the three biggest problems are written down, most important first, and fixed
**And** the loop stops after at most three rounds, and the developer sees the before and after shots (PR14)

**Given** every round
**When** the readability checks run
**Then** the hero, enemies, hazards and pickups stand out from the background at a glance (NFR27), pits read as dark (NFR29, NR102), hazards contrast with the ground around them (NFR30), and the aim-up and low-flyer spots have a clear line of sight (NFR31)
**And** control signs stay clear of the play area (FR42), collectable embers differ from shots in shape and motion (NFR32), and each bell's hint is visible (FR123)
**And** warm light comes only from Rowan, his shots, the collectables (embers and bells), the weapon pickups and the lanterns, with Rowan and the collectables the warmest things on screen (NFR28, NR100)

**Given** the full Level 1 shot set
**When** the developer looks through it
**Then** no spot needs text to be understood: the layout teaches (NFR26)

### Story 3.21: Playtest Emberwood with first-time players

As a developer,
I want 3 to 5 first-time players from the primary audience to play from the gate to the results while I watch without helping,
So that I know whether the MVP works: they finish, they know who Rowan is and what he wants, and they want Level 2.

**Requirements:** PR28, NFR17, NFR18, NFR19, NFR23, NFR45, NFR47, NFR48, NFR49, NR27, UX-DR42, UX-DR64, UX-DR74, X-B2, X-B31

**Acceptance Criteria:**

**Given** the playtest build
**When** the developer runs Marta's journey as Epic 3 has it
**Then** it works end to end: a click at the gate starts sound and gives focus, the five intro cards advance after their hints, Emberwood's loading card holds about 3 s, the signs, HUD, deaths and respawns behave, the arch ends the level, the results show, and Continue returns to the gate (UX-DR74, UX-DR64)
**And** its failure path works: alt-tabbing auto-pauses, clears the held key so Rowan stops, and the pause waits with Resume focused

**Given** `gds-playtest-plan`
**When** the plan is made
**Then** it names 3 to 5 first-time players from the primary audience (35 to 55, arcade-era players), watched without help (PR28), playing a production build at a 1280 × 720 viewport
**And** the page is reloaded before each tester, so every run is a first play (X-B2)
**And** it lists what the observer records and the questions asked after play

**Given** each tester's run
**When** the observer records it
**Then** the record holds: finished without help or not; clear time and respawns from the results screen; the time of each section; the longest time stuck at one spot; any question about what a button does after the first 2 minutes; any quit from frustration
**And** the run is checked against the targets: 6 to 8 minutes (NFR23), sections of 60 to 120 s and no single failure costing more than about 120 s (NFR17, NFR18), 5 or fewer respawns † (NFR19, NFR48), nobody stuck more than 60 s, no button question after 2 minutes (NFR47)

**Given** a tester has finished or stopped
**When** the observer asks, unprompted first, who Rowan is, what he wants, and whether they want to play Level 2
**Then** the answers are written down in the tester's words (NR27, NFR49, NFR45)
**And** "who" counts when it matches card 1 (the man who burned Harrowmere for a lord's coin, now cursed), and "what he wants" when it matches cards 4 and 5 and the Level 1 line (to go after Elin, whom Maldrek took)

**Given** in-play screenshots at 1280 × 720 from Emberwood's brightest and busiest spots
**When** each tester is asked how many hearts are left
**Then** each answer is recorded as the heart legibility check (UX-DR42)

**Given** all runs
**When** the results are tallied in the playtest report
**Then** the epic's thresholds are evaluated: at least 4 of 5, 3 of 4 (X-B31) or 3 of 3 testers finish without help, and a majority want to play Level 2 and can say who Rowan is and what he wants (NFR45)
**And** every miss, stuck spot and failed target is listed for Story 3.22

Note: what counts as "can say who Rowan is and what he wants" is unspecified; reading: the narrative design's coverage check (card 1; cards 4, 5 and the Level 1 line).
Note: how heart legibility is checked with the audience is unspecified; reading: testers read the heart count from 1280 × 720 in-play screenshots after play.

### Story 3.22: Fix the playtest findings and get the developer's approval

As a developer,
I want the playtest's findings fixed, re-checked and, if a threshold failed, re-tested with new players, then the look approved,
So that Epic 3 closes on its exit criteria and Epic 4 starts from a proven MVP.

**Requirements:** PR10, PR14, PR19, NFR26, NFR45, UX-DR42

**Acceptance Criteria:**

**Given** the playtest report
**When** the findings are triaged with the developer
**Then** each stuck spot, button question, frustration quit and missed target becomes a ranked fix, and anything that changes a settled planning document goes through that document's workflow or `gds-correct-course`

**Given** a spot where players needed help
**When** it is fixed
**Then** the fix changes the layout or the art, never adds a hint text (NFR26)
**And** a † number changes only with the developer, no unmarked number changes, and `make check` and the level and jump tests pass (PR19)

**Given** the heart legibility results
**When** testers misread the heart count
**Then** `{spacing.hud-icon}` is raised through `gds-ux` Update, with the contrast table re-measured and every target met; otherwise it stays (UX-DR42)

**Given** a visual fix
**When** it lands
**Then** the critic loop re-runs at the affected spots (`make shots ROUND=n`, at most 3 rounds), and the developer sees the before and after shots (PR14)

**Given** a threshold the first playtest missed
**When** the fixes are in
**Then** one new playtest at most, with different first-time players from the primary audience, runs as in Story 3.21, and passes when at least 4 of 5 (or 3 of 3, or 3 of 4) finish without help and a majority want to play Level 2 and can say who Rowan is and what he wants (NFR45)
**And** if that playtest also misses a threshold, the developer takes it to `gds-correct-course` (readiness proposal 2026-11-13, Q9)

**Given** the thresholds are met
**When** the developer reviews the final critic-loop shots and plays from the gate to the results in the browser
**Then** the developer approves the look as rendered in the engine (PR10)
**And** `docs/ASSETS.md` lists every Epic 3 asset and tool with its licence and AI flag, `make build` passes its budgets, and the playable deliverable runs from the gate through the intro, Emberwood and the results back to the gate

---

## Epic 4: First warden

The player can fight the Drowned Miller in his arena, win, and watch the seal break change Rowan's body and hand him ledge grab.

**In scope:**

- **The two story symbols,** Harrowmere's mark and the Tithe's sign, designed and checked for originality before either is drawn (NR99, PR34). The Tithe's sign is drawn on the seal in this epic; Harrowmere's mark is drawn on the sacks and the Harrowmere gate in Epic 5.
- **The standalone test arena** `levels/test-warden-arena.tmj`: one screen, 19 tiles wide, a flat floor, two one-way ledges 3 tiles up †, a checkpoint at the door with a triple shot pickup just before it. Epic 5 joins it to `drowned-mill.tmj` (AR132).
- **The warden's behaviour, as specified in the GDD,** with unit tests:
  - 30 HP †, unstompable, dormant until Rowan enters the arena, the door shut behind him
  - the seal at the wheel's hub as the only hurtbox, open for 1.5 s † at the start of each gap between attacks; shots on the body or the shut hub splash off (sprint change proposal 2026-11-13, G2); the hub sits at the top of the body's front face and takes the hit when a shot also touches the body (readiness proposal 2026-11-13, Q3)
  - 2 phases with the set attack order; phase 2 at half health (15 of 30 HP at the starting values), which is always reached during a gap: the hub shuts, the warden flinches, then a full phase-2 gap with its window, then a wheel wash (readiness proposal 2026-11-13, Q3)
  - three attacks that never overlap (wheel wash, millstone fall, wheel roll), each with a warning of at least 0.6 s
  - millstone targeting through `world.rng`
  - a full reset when Rowan respawns at the door
  - knockback from every warden source at the enemy values (default X-B10)
  - tests that prove every attack can be dodged
- **The warden bar** on the HUD (F1): "The Warden" over a bar at the top centre, clear of the arena floor where the millstone shadows warn. It fades in when the door shuts, drops with each hit, has a notch at 15 of 30 HP, stays through Rowan's death sequence, hides when he respawns at the door, returns full when he enters again, and drains and fades on the final hit.
- **The story director and the seal-break moment:** the beats and timetable from the narrative design (Gameplay Integration) as `CONFIG.story` cues; in the engine, 15 s or less †, no text, skippable on replays only. Rowan can't be hurt during it and attacks already in flight are removed, with a unit test. The HUD fades out as it starts and stays hidden through the results. Pausing during it stops the simulation, which resumes where it was (M5). With reduced motion, the ember flash becomes a short fade (D17). The staging follows the narrative design:
  1. the seal shatters
  2. the wheel stops
  3. the Miller sinks, at rest
  4. Rowan changes under a flash of embers
- **Rowan stage 2** on the same rig: the right horn broken, a human right hand, a dimmer chest glow. The replay-form rule through `levelForm` (default X-B17).
- **Ledge grab:** the simulation, with tests including a reach of 4 tiles or less † in `levels/test-ledge-grab.tmj`, and the hang and climb-up animations.
- **The warden's model and animations, and the arena art** (the millhouse interior, with the Drowned Mill palette and lighting data), built standalone.
- **Audio:** the Level 2 tune and its warden arrangement shifting at phase 2, both carrying Elin's motif; the warden's three warning sounds, phase-change and defeat sounds; the great wheel's loop in the arena, which stops at the seal break; the seal-break sound and stinger, the stinger carrying Elin's motif; the ledge-grab and climb sounds.
- **The warden playtest** and the epic's exit.

**Out of scope:**

- The Level 2 layout, joining the arena to `drowned-mill.tmj`, the marked grain sacks at the door (FR101, NR75), the Drowned Mill ambience bed and the wheel loop's distance curve across the level (Epic 5).
- The piercing shot (Epic 5).
- Routing from the Level 2 results to the Level 3 loading card (FR99) and the held beat, which reuses this epic's story director (Epic 5).
- Replays, the level select, saving and the reduced-motion setting (Epic 6). The seal break's replay skip is proven by unit tests in this epic.
- Originality checks of story names, the Miller's placeholder name included (Epic 6). No name of the Miller appears on screen.
- Ideas the narrative design marks as not committed: the Miller's face turned toward Rowan at his defeat, a more human breath after the seal break.

**Depends on:**

- Epic 3's exit criteria met and approved by the developer.
- The warden concept from the narrative design (done).
- The tools chosen in earlier epics, with their terms logged in `docs/ASSETS.md`: the image model (Epic 0), Tripo and the Blender MCP (Epic 2), the audio tools (Epic 3).

**Playable deliverable:** the warden fight in its standalone arena (`?level=test-warden-arena`), ending in the seal-break moment. Rowan stage 2 can try out ledge grab in a test room (`?level=test-ledge-grab`).

**Exit criteria:**

- A full fight can be won without taking damage, which proves every attack can be dodged.
- At least 4 of 5 first-time testers win within 5 attempts.
- Ledge grab passes its tests and feels right to the developer.

### Story 4.1: Check Harrowmere's mark and the Tithe's sign for originality

As a developer,
I want both story symbols designed and checked for originality before anyone draws them,
So that nothing on the warden or in the later levels copies an existing symbol, game emblem or trademark.

**Requirements:** NR99, NFR40, PR34, NFR37, NFR38, NFR43

**Acceptance Criteria:**

**Given** the narrative design's placeholder for Harrowmere's mark (a sheaf of grain in a ring) and its symbol table (the mark: the consequence that follows Rowan; the Tithe's sign: the Tithe's hold, shown on the seal at the wheel's hub and later wardens)
**When** the two symbols are drafted, by hand or with the image model the developer chose
**Then** each exists as a flat source design in `art-src/` under a kebab-case name, with no text in it, simple enough to read as a decal at game scale
**And** the developer picks the design to check for each symbol.

**Given** the two picked designs
**When** each is checked
**Then** the check covers the games named in the GDD (Toki included), the symbols Dungeons & Dragons invented (deity, faction and setting emblems), trademark and logo databases searched by image, and a reverse image search
**And** each search, its date, what it found and the conclusion are recorded in `docs/ASSETS.md` beside the symbol, with the reminder that the check is not legal advice (PR35).

**Given** a search finds a match the developer judges close
**When** the result is reviewed
**Then** the design changes and the whole check runs again on the new design
**And** the record keeps both rounds.

**Given** both symbols pass
**When** the developer approves them
**Then** `docs/ASSETS.md` marks each as checked and approved for drawing, with the date
**And** neither symbol is drawn before this approval: the Tithe's sign is drawn on the seal in Story 4.11, and this story leaves Harrowmere's mark for Epic 5's sacks and gate.

Note: No document says where originality checks are recorded. This story uses `docs/ASSETS.md`, beside the symbol, unless the developer prefers another place.

### Story 4.2: Build the standalone warden arena, its door and the warden's body

As a player,
I want to take a triple shot, touch a checkpoint and step into a one-screen arena whose door shuts behind me, facing a warden I can shoot but not stomp,
So that the fight starts from a safe place and its rules are plain before any attack exists.

**Requirements:** FR82, FR83, FR84, FR85, FR87, FR88, NR72 (unstompable, 30 HP), AR77 (arena camera lock), AR130 (warden-level validation), AR132 (test arena), X-B10, PR15

**Acceptance Criteria:**

**Given** `levels/test-warden-arena.tmj`, authored in Tiled with Epic 1's layers and classes
**When** `make levels` compiles it
**Then** the compiled level holds a `PlayerStart`, a triple-shot `WeaponPickup` just before a `Checkpoint` at the arena door, a `Door` region, an `ArenaTrigger` spanning the arena's whole inside, all 19 tiles (readiness proposal 2026-11-13, Q2), and a `Warden` at the arena's right side, all as typed data (this story extends Epic 1's compiler wherever it doesn't emit these classes yet)
**And** a level test asserts that the arena's inside is 19 tiles wide with a flat floor and two one-way ledges 3 tiles up (†, tuned with the developer in this epic), and the static checks (AR141) pass on it
**And** this story adds the warden-level validation to `scripts/compileLevels.ts`, and it passes on this level: a level with a `Warden` needs exactly one `Warden`, exactly one `Checkpoint` at the warden's door (beside the `Door`, outside the `ArenaTrigger`) and no `Exit`, the warden taking the exit's place; the rule applies to every level with a `Warden`, test levels included, Epic 1's exit rule gives way to it, and in a shipped level the door checkpoint comes on top of Epic 1's 3 checkpoints (AR130; readiness proposal 2026-11-13, Q7)
**And** level tests compile broken fixtures and expect each failure, with the file and the reason: a warden level with no checkpoint at the door, one with a warden and an exit, and one with two wardens (AR216)
**And** the level loads with `?level=test-warden-arena` and stays out of the release build and the level select, like Epic 1's test levels; this story leaves joining it to `drowned-mill.tmj` to Epic 5.

**Given** Rowan outside the arena
**When** he takes the triple shot, touches the door checkpoint and waits there
**Then** the warden stays dormant: it starts no attack and takes no damage
**And** a unit test runs Rowan from the start to the checkpoint and asserts no `arenaEntered`, no attack and no health lost.

**Given** Rowan walking into the arena
**When** his whole body is inside the `ArenaTrigger`
**Then** on that step the `Door` tiles turn solid behind him, `arenaEntered` is emitted once and the warden wakes
**And** the door never turns solid on a tile Rowan's body overlaps, and once shut it blocks his way out
**And** unit tests cover each of these, including one `arenaEntered` per entry.

**Given** the warden awake
**When** Rowan touches its body from the side or lands on it from above
**Then** he loses 1 heart with the enemy knockback, 6 tiles/s away and 9 tiles/s up (default X-B10), and `rowanHurt{source: 'warden'}` is emitted; a landing never counts as a stomp, because its cog teeth are spikes under the thorn rule
**And** its body is one contact box of `CONFIG.warden` body size (starting value 3 × 4 tiles †) at its Tiled position, tested with Epic 1's hitbox rules (contact boxes shrink by 0.08 tiles a side); it hurts Rowan but is not a hurtbox (sprint change proposal 2026-11-13, G2)
**And** unit tests cover side contact, a landing from above and the knockback, reading every number from `CONFIG`.

**Given** the warden awake, with its weak point, the seal at the wheel's hub: a hub box of `CONFIG.warden` hub size (starting value 1 × 1 tile †) at the top of the body's front face, the side facing the arena (readiness proposal 2026-11-13, Q3), its only hurtbox (sprint change proposal 2026-11-13, G2)
**When** an ember shot reaches the hub while it is open
**Then** the warden loses 1 HP of `CONFIG.warden`'s health (starting value 30 †, tuned with the hub window in Story 4.15), `wardenHit` is emitted and the shot is used up; a triple-shot volley whose three shots reach the open hub lands 3 hits
**And** a shot that reaches the body or the shut hub splashes off: it does no damage, it is used up, and `wardenShotBlocked` is emitted for the blocked cue
**And** whether the hub is open is warden state that Story 4.3's gap windows drive; until that story, the hub stays open from `arenaEntered` on, so hits can be tried in the browser
**And** when a shot overlaps the open hub and the body in the same step, the hub takes the hit (readiness proposal 2026-11-13, Q3)
**And** unit tests cover a single shot and a full volley on the open hub, a volley whose lower shot hits the floor first, a shot on the body and one on the shut hub, both doing no damage, and a shot overlapping the open hub and the body in the same step, which hits the hub
**And** a search test, run like the marked-jump search on the real `step()` and `CONFIG`, proves the open hub can be hit: for Rowan on the floor, aiming up, and on each ledge, shooting straight, some position and input pattern fires a shot inside the hub window that reaches the open hub before the window ends, without Rowan touching the body; it reads the window from `CONFIG.warden`'s hub window (starting value 1.5 s †, which Story 4.3's gaps then drive) and fails naming the surface if any has no such shot, so tuning the body, the hub or the ledges can't make the hub unreachable.

**Given** Rowan dies inside the arena
**When** he respawns at the door checkpoint
**Then** the warden is back at full health, dormant and at its start position, the door is open, the trigger is armed again, and the triple shot is back before the door (Epic 1's respawn rule)
**And** entering again emits `arenaEntered` again, and a unit test covers the whole reset.

**Given** Rowan inside the arena after `arenaEntered`
**When** he runs, turns, jumps or stands on either ledge anywhere in it
**Then** the logical view holds the whole arena: the shut door to the far wall, the floor, both ledges and the warden's full height, so no attack or warning ever starts off screen
**And** on `arenaEntered` the simulation camera in `sim/camera.ts` locks to the `ArenaTrigger`: centred on the arena horizontally, with the arena filling the logical view's width, it holds still until Rowan respawns or the level ends; after a respawn at the door it follows Rowan normally until the next `arenaEntered` locks it again (the seal break's camera move to Rowan is Story 4.12's staging; readiness proposal 2026-11-13, Q2)
**And** at 16:9 and wider, and in a taller 4:3 window, the margin past the arena's edges shows the millhouse's dressing up to 3 tiles †, then plain bands in the palette's darkest slot (placeholder dressing until Story 4.10) (sprint change proposal 2026-11-13, A4, G1)
**And** unit tests on `sim/camera.ts` assert the lock: the arena stays inside the logical view and the camera doesn't move while Rowan crosses the arena both ways, on the floor and on both ledges; and its release: after a respawn at the door the camera follows Rowan again, and the next `arenaEntered` locks it again; screenshots in a 16:9, a 4:3 and a 21:9 window confirm the framing.

**Given** the arena in the browser
**When** the developer plays it
**Then** placeholder views draw the warden's body, the hub open and shut, the door open and shut, a flash when the warden survives a hit (FR72) and a splash when a shot is blocked, until Stories 4.10 and 4.11 replace them
**And** screenshot spots for the arena (the door checkpoint, the arena just after entry) are added to `src/debug/spots.ts` for later critic loops.

Note: AR130's count of 3 checkpoints and 3 bells can't hold in a one-room test level. This story reads it as applying to the three shipped levels, as for Epic 1's test levels.

Note: The dormant warden can't be hurt: its hub opens only after `arenaEntered` (sprint change proposal 2026-11-13, G2), so nothing can be scored through the open door and the checkpoint stays a safe place.

Note: The `SimEvent` union (AR68) has no event for a shot that splashes off or for the hub opening, and the sprint change proposal (G2) doesn't name one. This story's reading adds `wardenShotBlocked` (and Story 4.3 `wardenHubOpened`) to `sim/events.ts` for the splash and the cues (Stories 4.10, 4.11, 4.14); the architecture's union should list them, which the developer confirms at story review.

Note: No document says the door must wait until Rowan is clear of it. Turning it solid only when his whole body is inside the trigger is this story's reading of "the door shuts behind him".

### Story 4.3: Build the warden's attack scheduler and its phase-1 attacks

As a player,
I want the warden to alternate a wheel wash and a millstone fall, each clearly warned and never overlapping,
So that I can learn to read his attacks and dodge them.

**Requirements:** FR89, FR90 (phase 1), FR92 (phase 1), FR93 (phase 1), FR95, NR68, NFR46 (every attack dodgeable), X-B10, PR15, AR45 (millstone spots), AR46 (arena), AR72 (millstone pool)

**Acceptance Criteria:**

**Given** the warden wakes on `arenaEntered`
**When** phase 1 runs
**Then** its attacks alternate wheel wash, millstone fall, wheel wash and so on, starting with a wheel wash one phase-1 gap after `arenaEntered`
**And** no two attacks ever overlap: while any attack's warning or hazard is live, no other attack begins
**And** the gap before the next attack's warning is `CONFIG.warden`'s phase-1 gap (starting value 2.5 s †), counted from the end of the previous attack's hazard: the wave leaving the arena, or the last millstone landing (sprint change proposal 2026-11-13, G2)
**And** unit tests run a long phase 1 and assert the order, the gaps and the absence of overlap, reading every number from `CONFIG`.

**Given** any phase-1 attack
**When** it begins
**Then** its warning comes first, with `wardenWarned{attack}` on its first step, and lasts the GDD's time: 0.8 s for the wheel wash (the wheel spins up and glows) and 0.8 s for the millstone fall (shadows mark the landing spots)
**And** `wardenAttacked{attack}` is emitted on the step the hazard begins
**And** a unit test asserts that each attack's warning is at least the GDD's 0.6 s minimum held in `CONFIG`, so tuning can never shorten one below it; Story 4.4 adds the wheel roll to the same test.

**Given** a wheel wash's warning ends
**When** the wave runs
**Then** a wave of `CONFIG.warden` size and speed (starting values 1 tile tall †, 8 tiles/s †) sweeps along the floor from the warden to the far wall and ends there
**And** touching it costs Rowan 1 heart with the enemy knockback (default X-B10), and a jump clears it
**And** the wave runs on the floor only, so Rowan on a one-way ledge 3 tiles up is clear of it
**And** unit tests cover the wave's height, speed and reach, a hit, and a clean jump over it.

**Given** a millstone fall's warning starts
**When** the landing spots are chosen
**Then** `CONFIG.warden`'s phase-1 count of pieces (starting value 3 †, each 1 tile wide †) is placed across the arena: one lands where Rowan stands when the warning starts, and the rest have at least 2 tiles of clear floor between them (†), always leaving a 3-tile clear gap (†; sprint change proposal 2026-11-13, G2)
**And** each piece lands on the first surface below it, a one-way ledge or the floor, and its shadow marks that surface
**And** the spots come only from `world.rng`, and the shadows mark exactly those spots
**And** a piece that lands on Rowan costs him 1 heart with the enemy knockback (default X-B10); a landed piece is removed and leaves no obstacle
**And** the pieces come from the `millstones` pool, whose capacity in `CONFIG` covers the largest fall, so no spawn is ever dropped
**And** a unit test runs the placement over many seeds and positions of Rowan and asserts every rule each time.

**Given** the real `step()` and `CONFIG`
**When** a dodge test starts Rowan on each floor tile and on each ledge as a warning begins, and searches a bounded set of input patterns the way the marked-jump search does
**Then** for every start a pattern exists that ends the attack with Rowan unhurt, for the wheel wash and for the millstone fall over many seeds
**And** the test fails naming the start and the seed if any start has no dodge, which keeps every attack dodgeable as the † numbers are tuned (NFR46).

**Given** a recorded input stream through several wheel washes and millstone falls
**When** the determinism test (AR46) runs it twice on `test-warden-arena`
**Then** the state hashes match
**And** when Rowan respawns at the door, the scheduler, any attack in progress, the wave and every millstone are cleared and the hub is shut, so the next entry starts phase 1 from its first attack; a unit test covers the reset.

**Given** the end of an attack's hazard
**When** the gap before the next warning starts
**Then** the hub opens for `CONFIG.warden`'s hub window (starting value 1.5 s †) and `wardenHubOpened` is emitted; the rest of the time, through every warning and hazard, the hub is shut (sprint change proposal 2026-11-13, G2)
**And** a unit test asserts the window is shorter than either phase's gap, so tuning can never leave the hub open into a warning
**And** unit tests cover: a hit on the open hub does 1 damage; a hit on the shut hub or on the body does none and emits `wardenShotBlocked`; the hub opens at the start of each gap and shuts when its window ends; it stays shut through the lead-in after `arenaEntered`.

**Given** the arena in the browser
**When** the developer plays phase 1
**Then** placeholder telegraphs show each warning (the placeholder warden's spin-up, the shadows on the surfaces the pieces will land on), placeholder hazards show the wave and the pieces, and the placeholder hub glows while it is open, until Stories 4.10 and 4.11 replace them
**And** the developer agrees each warning reads in time, or the † numbers are tuned with him and the tests rerun.

Note: No document says when the first attack starts after the door shuts. This story starts it one phase-1 gap after `arenaEntered`, with a wheel wash, the first attack in the GDD's order.

Note: The sprint change proposal (G2) opens the hub at the start of each gap between attacks. The lead-in after `arenaEntered` comes before any attack, so this story keeps the hub shut through it; the first window opens when the first wheel wash ends.

Note: No document says what a landed millstone does. Removing it at impact is this story's reading, since collision comes only from the tile grid.

### Story 4.4: Add phase 2, the wheel roll and the warden's defeat

As a player,
I want the warden to flinch at half health and add a rolling attack, then fall at 0 HP,
So that the fight builds to version one's highest-tension moment and can be won.

**Requirements:** FR90 (phase 2), FR91, FR92 (phase 2), FR93 (phase 2), FR94, NR72 (phase 2 at half health), NFR46 (every attack dodgeable), NFR20 (developer's runs), X-B10, PR15

**Acceptance Criteria:**

**Given** the warden in phase 1
**When** its health first drops to half its starting HP or below (15 of 30 at the starting values; a volley that crosses it counts)
**Then** phase 2 starts once, on that step: the hub shuts at once, cutting its window short, `wardenPhaseChanged{phase: 2}` is emitted (the music shifts on it), and the warden flinches for `CONFIG.warden`'s flinch time (†), with the hub shut and no attack started (readiness proposal 2026-11-13, Q3)
**And** after the flinch a full phase-2 gap runs (`CONFIG.warden`'s phase-2 gap, starting value 1.8 s †), its hub window opening at its start as in every gap, then the first phase-2 attack, a wheel wash
**And** phase 2 never starts during an attack: damage lands only on the open hub, which is shut through every warning and hazard, so health can't cross half while an attack runs; phase 2 never cuts an attack short, no two attacks overlap and no hazard comes without its full warning
**And** unit tests cover the crossing by a single shot and by a volley, the hub shutting on the crossing step, the flinch, and the full phase-2 gap and window before the first wheel wash; a crossing early in a gap; a crossing on the window's last step; a triple-shot volley straddling the crossing, whose shots arriving after the hub shuts splash off with `wardenShotBlocked`; and an invariant test that the warden's health never drops while an attack's warning or hazard runs.

**Given** phase 2
**When** its attacks run
**Then** they cycle wheel wash, millstone fall, wheel roll, starting with a wheel wash after the flinch and the first phase-2 gap (readiness proposal 2026-11-13, Q3)
**And** the gap before the next attack's warning is `CONFIG.warden`'s phase-2 gap (starting value 1.8 s †), counted from the end of the previous attack's hazard as in Story 4.3, and the hub window opens at the start of each gap (sprint change proposal 2026-11-13, G2)
**And** a millstone fall drops `CONFIG.warden`'s phase-2 count of pieces (starting value 5 †) under Story 4.3's rules, its placement test extended to this count
**And** unit tests run a long phase 2 and assert the order, the gaps and the absence of overlap.

**Given** a wheel roll begins
**When** it runs
**Then** its warning (the warden rears back and vents steam) lasts 0.6 s, with `wardenWarned{attack: 'wheelRoll'}`, and Story 4.3's warning-minimum test covers it
**And** then the warden curls into a wheel of `CONFIG.warden` size (starting value 2 × 1.5 tiles †), which is its contact body (shots on it splash off, since the hub is shut through every attack), rolls at `CONFIG.warden`'s roll speed (starting value 12 tiles/s †) to the far wall, then rolls back to its side: two passes at the same size and speed, each jumped the same way (sprint change proposal 2026-11-13, G2)
**And** touching the wheel on either pass costs Rowan 1 heart with the enemy knockback (default X-B10)
**And** the roll back is part of the attack: its hazard ends when the wheel reaches the warden's side, and the gap and the hub window start then
**And** unit tests cover the warning, the size and speed of both passes, the turn at the wall, the end of the hazard at his side, and a hit on each pass.

**Given** the real `step()` and `CONFIG`
**When** Story 4.3's dodge test runs on the wheel roll from every floor tile and ledge, and on the 5-piece fall over many seeds
**Then** a dodge exists from every start, for both passes of the roll: Rowan clears the wheel going out and coming back without touching it
**And** the test fails naming the start if not.

**Given** the warden at 1 HP or more
**When** a hit brings it to 0 HP
**Then** `wardenDefeated` is emitted once, and the warden starts no new warning and stops hurting Rowan by contact
**And** further hits do nothing
**And** unit tests cover the defeat, including a final hit on a hub window's last step and a volley with more shots than health left; no hit lands during the flinch, since the hub is shut through it (readiness proposal 2026-11-13, Q3); this story leaves the seal break, the removal of hazards still in flight and the level's end to Story 4.7.

**Given** Rowan dies in phase 2
**When** he respawns at the door
**Then** the warden is back in phase 1, at full health and dormant, with every phase-2 attack and hazard cleared
**And** a unit test covers it.

**Given** the grey-box fight in the browser, with placeholder telegraphs for the roll (the rear-back and steam)
**When** the developer plays full fights
**Then** he signs off on the † attack numbers or tunes them with the agent, and the tests are rerun after each change
**And** the time from `arenaEntered` to `wardenDefeated` in his fights is recorded with the numbers used; the 60 to 120 s target for a first-time player (NFR20) is measured in Story 4.15.

Note: No document gives the flinch's length. It is a `CONFIG.warden` value with a starting value the developer sets.

Note: No document says where the phase-2 cycle starts. This story starts it with a wheel wash, the first attack in the GDD's order.

### Story 4.5: Show the warden bar on the HUD

As a player,
I want a bar labelled "The Warden" at the top centre that shows his health and where phase 2 begins,
So that I can see my progress while the floor, where the millstone shadows warn, stays clear.

**Requirements:** FR86, FR194 (warden bar), UX-DR22, UX-DR41 (warden bar), UX-DR69 (warden bar), UX-DR70 (bar), UX-DR13 (`wardenBarFadeInSeconds`, `wardenBarDrainSeconds`), UX-DR101 (label), NR74, PR14, NFR27

**Acceptance Criteria:**

**Given** Epic 3's final HUD
**When** the warden bar is built in `ui/screens/hud.ts`
**Then** it matches DESIGN.md's `hud-warden-bar`: the label "The Warden" in `ui-sm` with the `hud-outline` ring, centred `{spacing.2}` above a `{spacing.bar-long}` bar `{spacing.hud-bar-thickness}` thick, a `warden-bar` fill on `hud-track`, top-centre inside `{spacing.safe-margin}`, sized in `--tile` and reading only tokens
**And** a `hud-outline` notch at half health, 15 of 30 HP at the starting values (read from `CONFIG.warden`) overhangs the bar by `{spacing.1}` above and below, so it stays visible after the fill passes it
**And** the label reads exactly "The Warden": the word "seal", "the Drowned Miller" and his placeholder given name never appear on screen.

**Given** Rowan in the arena
**When** `arenaEntered` arrives
**Then** the bar fades in, full, over `wardenBarFadeInSeconds` (`core/uiTimings.ts`, starting value 0.4 s †)
**And** it isn't shown at any time before that, at the door checkpoint included.

**Given** the bar shown
**When** `wardenHit` arrives
**Then** the fill drops to the warden's health over its maximum, read by length, and the DOM changes only when the health does
**And** a triple-shot volley that lands 3 hits drops it by three.

**Given** Rowan loses his last heart in the arena
**When** the death sequence plays
**Then** the bar stays on screen through it
**And** on `rowanRespawned` at the door the bar hides, and on the next `arenaEntered` it fades in full again.

**Given** the final hit
**When** `wardenDefeated` arrives
**Then** the fill drains to empty over `wardenBarDrainSeconds` (starting value 0.4 s †)
**And** this story leaves the fade-out with the rest of the HUD at the seal break's start to Story 4.12
**And** while the game is paused, the bar sits under the scrim with the rest of the HUD.

**Given** screenshot spots for the bar fading in, full, past the notch and draining, added to `src/debug/spots.ts`
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round compares the shots with DESIGN.md and `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, checks that the hero, hazards and pickups stand out at a glance, and checks that no HUD element sits over the arena floor
**And** a Playwright check through the dev handle confirms the bar is hidden at the door, shown after entry and hidden after a respawn
**And** the developer sees before and after, approves, and signs off on the two timings.

### Story 4.6: Add ledge grab and the replay-form rule to the simulation

As a player,
I want the changed Rowan to catch a ledge corner, hang, and climb up or let go,
So that the hand the seal gives back is a real ability that reaches ledges up to 4 tiles high.

**Requirements:** FR102, FR103, FR104, FR105, FR106, FR107, FR108, FR109, FR110, FR111 (`levelForm`), NR59, NR60, NR61, NR111 (ledge-grab lock), AR85, AR132 (ledge-grab room), AR137 (ledge-grab patterns), AR210 (grant ledge grab), X-B17, PR15, PR17

**Acceptance Criteria:**

**Given** Epic 1's `CONFIG.levelForm` table
**When** any `World` is created
**Then** the app fills `params.form` from `CONFIG.levelForm[levelId]`, and only the debug URL's `form=` overrides it (default X-B17)
**And** `createWorld` gives a `changed` Rowan stage 2 with ledge grab and a `beast` Rowan stage 1 without it, storing nothing
**And** `levelForm` gives `test-warden-arena` the beast form and `test-ledge-grab` the changed form
**And** unit tests cover every shipped and test level id, and show that a beast Rowan never grabs a ledge.

**Given** a changed Rowan in the air, falling or at the top of a jump, and holding toward a wall
**When** his hand point (`CONFIG.ledgeGrab`, starting value 0.92 tiles above his feet †) comes within 0.3 tiles (†) below the top corner of a solid tile, and the tile above that corner is empty with at least 1 tile of headroom
**Then** he catches it: his state becomes `hang`, his hand point holds at the corner and `ledgeGrabbed` is emitted
**And** unit tests probe each condition at and just past its boundary, reading the values from `CONFIG`.

**Given** the same approach
**When** the corner belongs to a one-way ledge, a moving platform or a spike tile, has a solid tile above it, or Rowan is rising faster than the top of a jump or isn't holding toward the wall
**Then** no catch happens
**And** a unit test covers each case.

**Given** Rowan hanging
**When** time passes, spit is pressed, Up or jump is pressed, or Down is pressed
**Then** he doesn't fall and fires no shot; Up or jump climbs him onto the ledge in 0.35 s (†) through the `climb` state, ending grounded on the ledge top with `ledgeClimbed` emitted; Down lets him go, and he can't grab again for 0.25 s (†)
**And** a hit while he hangs or climbs takes its normal heart and knockback and knocks him off the ledge
**And** unit tests cover each of these.

**Given** the real controller and `CONFIG`
**When** a unit test searches jump, grab and climb patterns from flat ground
**Then** a ledge top 4 tiles (†) above the take-off ground is reached, a ledge top one tile higher is not, and a beast Rowan doesn't reach the 4-tile ledge
**And** the reach value lives in `CONFIG`, and the static checks (AR141) apply it to every ledge-grab climb (PR17).

**Given** `levels/test-ledge-grab.tmj`, with ledges from 1 tile up to the reach and one past it, walls to grab facing both ways, a one-way ledge, a moving platform, spike tiles and a low ceiling, and a `jumps` mark with `ability: ledgeGrab` on every climb meant to work
**When** `make test` runs
**Then** the marked-jump search, extended with ledge-grab climb patterns for marks whose `ability` is `ledgeGrab` (AR137), proves every marked climb
**And** the room loads with `?level=test-ledge-grab` and stays out of the release build and the level select.

**Given** the cheats Story 1.15 built, in a development build
**When** the developer uses "grant ledge grab"
**Then** it calls `sim/debugCommands.ts`, the one way `debug/` may change the `World` (AR210), which sets Rowan's form to `changed`, so he can grab ledges from the next step without a restart
**And** a unit test shows a beast Rowan failing to catch a ledge, then catching it after the command, and Story 1.15's search of the release bundle still finds none of `debug/` (readiness proposal 2026-11-13, minor).

**Given** the test room in the browser, with the hero view holding its current clip in `hang` and `climb` until Story 4.9 adds those clips (Epic 2's rule)
**When** the developer plays it on keyboard and on gamepad
**Then** he signs off on the five † numbers (hand point, catch window, climb time, regrab lockout, reach) or tunes them with the agent, and the tests are rerun after each change
**And** the feel regression test (AR64) still passes unchanged.

Note: `levelForm` has entries only for the three shipped levels, yet the jump search reads it for every level (AR138). This story adds the two test levels to it.

Note: "At the top of a jump" is read as vertical speed within the feel table's apex band (2.2 tiles/s) or falling, and a hit during the climb is read as knocking Rowan off like a hit while hanging.

### Story 4.7: Build the story director and the seal break in the simulation

As a player,
I want the warden's defeat to stop play for a fixed, safe sequence that leaves Rowan changed and ends the level,
So that the seal break always plays out on a first play, can't hurt me, and gives me ledge grab.

**Requirements:** FR2 (warden win), FR96, FR98, FR161, NR33, NR34, NR35 (beat order), NR36 (timetable as cues), NR39, NR59, NR60, NR111 (ledge-grab lock), NFR25 (seal break), AR79, AR80, AR81, AR82, AR86, AR87 (story steps), AR88 (`confirmPressed`), AR93 (confirm during play), AR107, UX-DR51 (input, skip, pause), PR15

**Acceptance Criteria:**

**Given** the warden reaches 0 HP
**When** `wardenDefeated` is emitted
**Then** `world.story` becomes `sealBreak` with its start step, and `storyStarted{moment: 'sealBreak'}` is emitted
**And** `CONFIG.story.sealBreak` holds the total (starting value 14 s †) and one cue per beat of the narrative design's timetable, in this order: a crack cue (1.0 s †), `sealShatter` (2.5 s †), `wheelStop` (3.5 s †), `millerSink` (6 s †), a camera cue for the move to Rowan (8 s †), `rowanChange` (once the camera has reached him, inside the 8 to 12 s beat †) and `stinger` (12 s †); the five named cues are the architecture's, the crack and camera cues are added (see Note)
**And** each cue emits `storyCueReached` once, in order, on its step
**And** a unit test checks that the cues are in order, all inside the total, and that the total stays within the GDD's 15 s cap (†), held in `CONFIG`.

**Given** the seal break starts
**When** its first step runs
**Then** enemy shots, seeds, millstones, the wave and the rolling wheel are removed
**And** nothing hurts Rowan until it ends
**And** a unit test ("story moments are safe") places live hazards on Rowan as the moment starts and asserts that no heart is lost and no `rowanHurt` is emitted for the whole timeline.

**Given** the final hit and a hit on Rowan land in the same step
**When** the step resolves
**Then** the seal break wins and Rowan loses no heart
**And** while Rowan is in his death sequence the warden takes no damage, so the seal break never starts while he is dead
**And** unit tests cover both cases.

**Given** a first play (`params.isStorySkippable` false)
**When** any play input arrives during the seal break (move, jump, spit, crouch, the skip action)
**Then** Rowan ignores it, comes to rest (landing first if he was in the air) and stays in `idle`, and nothing skips the moment
**And** a unit test feeds every input through the whole timeline and asserts it runs to its total.

**Given** a replay (`params.isStorySkippable` true)
**When** the player's skip action arrives: `jumpPressed` or `confirmPressed` (`isStorySkippable && (input.jumpPressed || input.confirmPressed)`)
**Then** `endStory` runs at once: it applies every cue not yet reached, emits `storyEnded{moment: 'sealBreak'}`, then `levelCompleted`
**And** a unit test covers a skip by each of the two at several points of the timeline
**And** the app sets `isStorySkippable` on replays as default X-B2 defines them; until Epic 6's save exists every play is a first play, so this story leaves the in-browser skip check to Epic 6.

**Given** the `rowanChange` cue, reached or applied by a skip
**When** it applies
**Then** from that step Rowan's form is `changed`, with ledge grab
**And** at the total, `endStory` emits `storyEnded` then `levelCompleted`, and the app shows the results: the level is won by the warden's defeat (FR2)
**And** a unit test asserts the end state (form `changed`, ledge grab on, one `levelCompleted`); this story leaves routing from the results to the Level 3 loading card to Epic 5.

**Given** the seal break running
**When** clear time is counted and the player pauses (Esc, P, Start or an auto-pause trigger)
**Then** `stats.clearSteps` doesn't advance during the moment
**And** the Epic 1 pause opens, no simulation step runs while paused, and Resume continues from the same story step; a Vitest app test covers it
**And** the F1 overlay shows `sealBreak` and its step; this story leaves the visible staging to Story 4.12, and the director is built so Epic 5's held beat adds only a timeline, a `kind` and its staging (AR86).

**Given** `InputFrame` in `sim/inputFrame.ts` and the input layer in `input/`
**When** the player presses a confirm key or button (Enter, Space, gamepad south) during play
**Then** `InputFrame` carries it as `confirmPressed`, latched and delivered once like `jumpPressed`, and only the story director reads it, as the replay skip (sprint change proposal 2026-11-13, A3)
**And** while a menu or card is up, confirm still goes to the app through `onAppAction` as Story 1.10 built it; during play it reaches the simulation only as `confirmPressed`
**And** the input recorder and the determinism test carry the new field, so recorded input still replays exactly, and unit tests cover the latch and the routing.

Note: The narrative's 8 to 12 s beat moves the camera to Rowan before the flash hides the swap, but AR81 puts `rowanChange` at 8 s, and the timetable's crack at 1.0 s has no cue. This story adds a crack cue and a camera cue and places `rowanChange` after the camera's arrival, all †, since rendering keeps no timings of its own.

Note: No document says what happens when the final hit and a hit on Rowan land together, or when a shot already in flight lands the final hit during his death sequence. The seal break winning, and the warden ignoring hits while Rowan is dying, are this story's reading.

### Story 4.8: Build Rowan stage 2 on the same rig

As a player,
I want Rowan after the seal break to have a broken right horn, a human right hand and a dimmer chest glow,
So that the curse visibly loosens and the new hand explains the new ability.

**Requirements:** FR112 (stage 2), FR211 (stage 2), NR56, NR57, NR58, NR62, AR166 (stage-2 toggle), NFR35, NFR28, NFR49 (readable change), PB59, PB62, PR14
**Depends on:** Tripo and the Blender MCP as set up in Epic 2, and the image model the developer chose, with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** `hero-rowan.glb` and `art-src/hero/rowan.blend` from Epic 2
**When** the stage-2 parts are added
**Then** `horn_right_broken` and `hand_right` exist beside `horn_right` and `claw_right`, skinned to the right-hand and head bones Epic 2 left for them, on the same skeleton (made by the route Epic 2 recorded, or hand-built in Blender where a generated part won't deform cleanly)
**And** no clip is re-made or duplicated: stage 2 plays every existing clip
**And** the model still passes `make models` (scale and origin).

**Given** the hero view
**When** `world.player.form` is `beast`, and when it is `changed`
**Then** `beast` shows `horn_right` and `claw_right`; `changed` shows `horn_right_broken` and `hand_right` and hides the other two; the parts switch on the step the form changes, with nothing reloaded
**And** this works through `?form=changed`, in the ledge-grab room, and on the look-dev page, which shows both stages side by side.

**Given** stage 2
**When** it is shown under the game's look
**Then** the chest glow is dimmer than stage 1's by a value in the hero's look data (†, set with the developer), while Rowan, his shots and the collectables stay the warmest things on screen
**And** the red scarf shows in both stages.

**Given** stage 2 playing every clip
**When** the agent and the developer check close up on the look-dev page and at play distance
**Then** the hand and the broken horn deform cleanly, with no stretching, gaps or parts passing through each other (NFR35)
**And** both changes read at the 1280 × 720 embed, the broken horn in silhouette and the hand by its shape, since players must notice the change without being told (NFR49).

**Given** the updated `hero-rowan.glb`
**When** `make build` runs
**Then** the hero, both stages together, stays within 2 MB † (AR152)
**And** `docs/ASSETS.md` records the new parts, their route, tool, licence and AI flag.

**Given** spots for stage 1 and stage 2 at play distance and close up, added to `src/debug/spots.ts`
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round compares the shots with the Epic 0 concept and `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that Rowan stands out at a glance
**And** the developer sees before and after and approves the stage-2 look.

### Story 4.9: Animate hang and climb-up

As a player,
I want Rowan to grip the ledge and haul himself up,
So that ledge grab reads at a glance and feels as solid as the rest of his movement.

**Requirements:** FR211 (hang, climb-up), NFR35, PB62, PR11 (ledge grab feels right), PR14, NFR27

**Acceptance Criteria:**

**Given** the shared rig in `art-src/hero/rowan.blend`
**When** the `hang` and `climb_up` clips are animated and exported through `make models`
**Then** both clips are in `hero-rowan.glb`, play on both stages, and `CLIP_FOR_STATE`'s existing mapping (`hang` to `hang`, `climb` to `climb_up`) now finds them, so the stand-in from Story 4.6 is gone
**And** no spit or land overlay plays over them (AR75's rule).

**Given** Rowan hanging, facing either way
**When** the hang clip plays
**Then** his hands rest on the ledge corner at the simulation's hand point, his body hangs against the wall, and nothing gaps from or sinks into the tile.

**Given** Rowan climbing
**When** the `climb_up` clip plays
**Then** it spans the simulation's climb time (`CONFIG.ledgeGrab`, 0.35 s †) and ends with his feet on the ledge top where the simulation places him, with no visible pop or slide at its start or end
**And** it looks the same at 60, 120 and 144 Hz.

**Given** both clips on both stages
**When** checked close up on the look-dev page
**Then** they deform cleanly (NFR35)
**And** `make build` keeps the hero within its 2 MB † budget, and `docs/ASSETS.md` records the clips.

**Given** spots in the ledge-grab room for hanging and mid-climb, facing both ways, added to `src/debug/spots.ts`
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round compares the shots with `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that Rowan stands out at a glance
**And** the developer sees before and after and approves.

**Given** the room with the finished clips
**When** the developer plays it on keyboard and on gamepad
**Then** he signs off that ledge grab feels right, or the † numbers are tuned with him and Story 4.6's tests rerun.

### Story 4.10: Build the millhouse arena art

As a player,
I want the arena to be the inside of the drowned millhouse, with the great wheel's water, a door that slams shut and rafters the millstones fall from,
So that the fight has a place and every hazard reads clearly against it.

**Requirements:** NR70, NR68 (stones and beams from the rafters), NR100 (Drowned Mill), NR102, NFR27, NFR28, NFR30, UX-DR43 (warden telegraphs: floor shadows), PB59, PB62, PR14
**Depends on:** the image model the developer chose, Tripo and the Blender MCP, with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** no Drowned Mill look data yet
**When** the arena's look is set up
**Then** `render/palettes/drownedMill.ts` and `render/lighting/drownedMill.ts` hold it as data: cold fog, black water, almost no warm light, with warm light allowed only on Rowan, his shots, the embers, the bells and the weapon pickups
**And** this story leaves extending them across the level to Epic 5.

**Given** `test-warden-arena`
**When** the millhouse interior is built for it
**Then** its floor and two one-way ledges come from kit pieces the compiler picks from the collision grid, starting `kit-drowned-mill.glb`, which Epic 5 completes; around them sit the rafters, the great wheel's water where the Miller will sink, and the middle and far depth layers
**And** the foreground never covers the play area, and the art adds no collision.

**Given** the door
**When** Rowan enters the arena, and when he respawns at the checkpoint
**Then** the door piece shuts visibly on the step its tiles turn solid, and is open again after the respawn.

**Given** the wave, the millstone pieces (stones and beams from the rafters) and their floor shadows
**When** they replace the placeholders from Stories 4.3 and 4.4
**Then** each shadow marks exactly its piece's landing spot from the first step of the warning, on the ledge or the floor the piece will land on, and stays readable there
**And** the wave, the pieces and the shadows contrast with the floor and the background (NFR30), and the pieces are drawn from the `millstones` pool by entity id.

**Given** a 16:9, a 4:3 and a 21:9 window
**When** the arena is framed, the camera holding still with the arena filling the logical view's width (sprint change proposal 2026-11-13, A4)
**Then** the millhouse dressing carries on 3 tiles † past the arena's edges, replacing Story 4.2's placeholder margin, and past that the view camera shows plain bands in the Drowned Mill palette's darkest slot, so nothing past the walls is an empty void
**And** the margin adds no collision.

**Given** the finished arena
**When** `make build` runs
**Then** the arena's share of the Drowned Mill kit with its backdrops stays within the 3.5 MB † budget with room left for Epic 5, and `docs/ASSETS.md` records every piece, its tool, licence and AI flag.

**Given** a shot that splashes off the body or the shut hub (Story 4.2)
**When** the splash replaces its placeholder, seen against the millhouse
**Then** a blocked shot shows a splash where it struck on `wardenShotBlocked`, plainly different from the hit flash (FR72), so the player sees which shots count
**And** this story leaves the hub's open and shut looks to Story 4.11, which builds the glow into the model and judges it in this arena (readiness proposal 2026-11-13, D5).

**Given** spots for the door open and shut, a wave mid-sweep, a phase-1 and a phase-2 millstone warning, a blocked shot, and the arena in a 21:9 and a 4:3 window, added to `src/debug/spots.ts` (the hub's spots are Story 4.11's; readiness proposal 2026-11-13, D5)
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round compares the shots with `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that the hero, the warden, the hazards and the pickups stand out at a glance and that Rowan and his fire family are the warmest things on screen
**And** the developer sees before and after and approves the arena.

### Story 4.11: Build the Drowned Miller model and animations

As a player,
I want to face a hunched miller fused with his waterwheel, cold and tired rather than cruel, whose body shows each attack coming,
So that the warden reads as a sad opponent and every warning is visible in the world.

**Requirements:** FR100, FR213, NR65, NR66, NR67, NR68, NR71, NR76, NR99 (the Tithe's sign drawn), NFR35, NFR28, NFR27, UX-DR43 (warden telegraphs), PB59, PB62, PR14
**Depends on:** the image model the developer chose, Tripo and the Blender MCP, with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** the narrative design's description and the locked style
**When** the warden goes through the pipeline Epic 2 recorded (reference concept, views, Tripo mesh, Blender clean-up through the MCP, its own creature rig, `make models`)
**Then** the developer approves the concept before any mesh is made
**And** `warden-drowned-miller.glb` shows a hunched miller fused with the great waterwheel, which rises from his back like a shell with split, dripping paddles; iron cog teeth along his back and shoulders; pale, weed-hung and cold, with no warm light anywhere on him; a tired face, not a cruel one
**And** it follows the model conventions (feet at the origin, 1 unit = 1 tile, facing +X), its body matches the simulation's contact box (3 × 4 tiles †), its hub the 1 × 1 tile † hurtbox at the top of the body's front face (readiness proposal 2026-11-13, Q3), its curled wheel the roll's 2 × 1.5 tiles †, and its generated materials are replaced by the shared materials and the Drowned Mill palette slots.

**Given** the great wheel
**When** the model is built
**Then** its hub, the seal, is its own named node, marked with the Tithe's sign drawn from the design approved in Story 4.1, through the shared materials
**And** the hub's open glow and its shut look are part of the model, the glow in a cold palette slot, never the warm one, so the weak point reads on the warden itself (sprint change proposal 2026-11-13, G2)
**And** in the arena Story 4.10 built, the open hub and the shut hub tell apart at a glance at play distance against the millhouse behind them (NFR28; readiness proposal 2026-11-13, D5)
**And** the hub is ready for Story 4.12's crack and shatter.

**Given** the warden view
**When** it replaces Stories 4.2 to 4.4's placeholder
**Then** it maps the warden's state to the ten clips (`idle`, `wash_warn`, `wash`, `millstone_warn`, `millstone`, `roll_warn`, `roll`, `hurt`, `phase_change`, `defeat`) through one `CLIP_FOR_STATE` table, and `roll` plays both ways: out to the far wall and back to his side (sprint change proposal 2026-11-13, G2)
**And** the hub glows from the step the simulation's hub opens to the step it shuts, read from state
**And** the great wheel turns in every state until the seal break stops it, and water pours from him all the time.

**Given** a warning starts
**When** `wardenWarned` arrives
**Then** the wheel wash shows the wheel spinning up and glowing, in a cold palette slot and never the warm one; the wheel roll shows him rearing back and venting steam; each starts on the warning's first step and reads at a glance
**And** a hit he survives flashes him (FR72).

**Given** the rigged model in every clip
**When** checked close up on the look-dev page and at play distance
**Then** it deforms cleanly; if the generated mesh can't, a simpler hand-built model replaces it, and `docs/ASSETS.md` records the route and the reason (NFR35)
**And** `make build` keeps it within the warden's 2 MB † budget, and `docs/ASSETS.md` records the model, its tool, licence and AI flag, and the check behind the Tithe's sign.

**Given** spots for the dormant warden, each warning, the roll out and back, the hub open and shut, the phase change and a hit flash, added to `src/debug/spots.ts`
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round compares the shots with the approved concept and `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that the hero, the warden, the open hub (readiness proposal 2026-11-13, D5) and the hazards stand out at a glance and that nothing on the warden is warm
**And** the developer sees before and after and approves the warden.

Note: X-C11 dropped: the warden rolls back after the wheel roll (sprint change proposal 2026-11-13, G2), so no `walk` clip.

### Story 4.12: Stage the seal break

As a player,
I want to watch the seal crack and shatter, the wheel grind to a stop, the Miller sink at rest and Rowan change under a flash of embers,
So that the win lands as a release and the change in Rowan is impossible to miss.

**Requirements:** FR96 (in the engine, no text), FR97, NR35, NR36 (staging), NR37, NR40, NR71, NR73, AR83, FR190 (seal-break fade), UX-DR89 (seal-break flash), UX-DR88, UX-DR51 (HUD fade, mute indicator), UX-DR70 (HUD fade), UX-DR13 (`hudStoryFadeSeconds`), AR107 (in the browser), NFR27, NFR28, PR14

**Acceptance Criteria:**

**Given** the seal break running
**When** `render/fx/storyStaging.ts` stages it
**Then** it reads only `world.story`, the step count and the cues in `CONFIG.story.sealBreak`, with no timings of its own (checked in review)
**And** the Miller plays `defeat` from the start; the hub cracks and cold light leaks out from the crack cue; it shatters at `sealShatter`; the great wheel grinds to a stop at `wheelStop` and the water pouring from him ends; from `millerSink` the water stills and he sinks beneath it, at rest; the camera moves to Rowan from its cue; from `stinger` the view fades into the results, which appear at the total
**And** no text appears at any point.

**Given** the camera on Rowan
**When** the `rowanChange` step comes
**Then** Rowan stands in his idle pose, the ember flash from his chest peaks on that step and hides the part swap from Story 4.8, and the camera then pushes in on the human hand; there is no transformation animation
**And** stepping frame by frame with the dev handle's `stepFrames` shows no frame where the swap is visible without the flash covering it
**And** the flash's length is a named value beside the cues in `CONFIG.story.sealBreak` (†).

**Given** `storyStarted` arrives
**When** the HUD responds
**Then** every `hud.ts` element, the warden bar after its drain included, fades out over `hudStoryFadeSeconds` (starting value 0.4 s †) and stays hidden through the Level 2 results
**And** the mute indicator is hidden during the moment and shows in a pause opened during it.

**Given** `reducedMotion` on in the `PresentationSettings` snapshot
**When** the seal break plays
**Then** the ember flash becomes a short fade over the same window, which still hides the swap; hit-stop and the blink are unchanged (FR190, UX-DR89)
**And** in either mode no large-area flash repeats faster than 3 per second (UX-DR88).

**Given** the seal break at any point
**When** the player pauses with Esc, P or Start, or the window loses focus
**Then** the staging freezes with the simulation (camera, effects and clips hold), and Resume continues it seamlessly
**And** the developer checks both in the browser.

**Given** spots at the crack, the shatter, the stopped wheel, the sinking, the flash's peak and the push-in on the hand, with and without reduced motion, added to `src/debug/spots.ts`
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round compares the shots with `docs/STYLE_GUIDE.md`, lists the three biggest problems and fixes them, and checks that Rowan reads at a glance, is, with his fire family, the warmest thing on screen, and that the seal's light is cold
**And** the developer sees before and after, approves the sequence, and signs off on each beat's visual timing; the timing sign-off with sound is in Story 4.14.

Note: Reduced motion's "short fade" has no duration in any document, and no flash length is given either. Both use the flash window's named value in `CONFIG.story.sealBreak`, set with the developer.

Note: The reduced-motion setting arrives in Epic 6. This story turns `reducedMotion` on through the development-only `?reducedMotion=1` URL parameter that story 3.19 added.

Note: The UX spines don't say whether the HUD returns on the Level 2 results after a story moment (UX conflict 18). This story keeps it hidden through those results, reading "stays hidden until the level ends" as including them.

### Story 4.13: Compose the Level 2 tune, its warden arrangement and the seal-break stinger

As a player,
I want a hummable Drowned Mill tune that turns fiercer when phase 2 starts, and a stinger that carries Elin's motif when the seal breaks,
So that the music builds the fight's tension and ties the release back to Elin without a word.

**Requirements:** FR196 (Level 2), FR197, FR199 (seal-break stinger), FR200, FR217 (Level 2 tune, warden arrangement, seal-break stinger), NR108 (Epic 4 part), NR38 (music), AR193
**Depends on:** the audio tools the developer chose in Epic 3, with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** the audio tools and formats chosen in Epic 3
**When** the Level 2 tune is made
**Then** it is one short, hummable, arcade-era melody on modern instruments, and it carries Elin's motif: the same 3- to 4-note bell-like phrase as the Level 1 tune and the bell pickup
**And** it loops without a gap in Chrome, Edge and Firefox, and the test arena plays it from the level's start, as Level 2 will in Epic 5
**And** the developer signs it off.

**Given** the Level 2 tune
**When** the warden arrangement is made
**Then** it is a more intense arrangement of the same tune, aligned with it so the change keeps the beat
**And** it crossfades in on `wardenPhaseChanged`, over a crossfade time held in `audio/mix.ts` (†)
**And** when Rowan respawns at the door after phase 2 has started, the Level 2 tune comes back with the warden's reset.

**Given** the seal break
**When** `storyStarted{moment: 'sealBreak'}` arrives
**Then** the music cuts at once
**And** the seal-break stinger, short and carrying Elin's motif, plays once on `storyCueReached` for the `stinger` cue and has finished by the time the results appear.

**Given** the three new files
**When** `make build` runs
**Then** music and ambience together stay within 8.5 MB † (AR152)
**And** `docs/ASSETS.md` records each file, its tool, licence and AI flag.

**Given** the arena with all three in place
**When** the developer plays a full fight to the seal break
**Then** he signs off on the tune, the shift at phase 2 and the stinger, or they are reworked with him.

Note: No document says what the music does when the warden resets. This story brings back the Level 2 tune on respawn, so the shift at phase 2 is heard again in every attempt.

### Story 4.14: Add the warden, seal-break, wheel and ledge-grab sounds

As a player,
I want each attack to have its own warning sound, the great wheel to rush until the seal breaks, and Rowan's grip and climb to be heard,
So that I can hear what is coming and hear the Miller's release.

**Requirements:** FR205, FR206 (seal break), FR203 (ledge grab, climb), FR217 (the great wheel's loop), NR38, NR69, AR128 (`AudioAnchor` class), AR193 (seal-break cues), AR194 (arena loop), UX-DR87 (warden warnings, hub and splash cues)
**Depends on:** the audio tools the developer chose in Epic 3, with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** the three attacks
**When** `wardenWarned{attack}` arrives
**Then** that attack's own warning sound plays on the same step its telegraph starts, so each warning is seen and heard together (UX-DR87)
**And** the developer can tell the three apart by ear alone.

**Given** the fight
**When** `wardenPhaseChanged`, `wardenDefeated` and `wardenHit` arrive
**Then** the phase-change and defeat sounds play once each, and `wardenHit` plays Epic 3's enemy hit sound.

**Given** the hub weak point (sprint change proposal 2026-11-13, G2)
**When** `wardenHubOpened` arrives, and when `wardenShotBlocked` arrives
**Then** the hub-open cue plays on the step the hub starts to glow, and the blocked splash sound plays on the step the splash shows, so each has its visual twin: the glow and the splash (UX-DR87)
**And** the splash sound is plainly different from the enemy hit sound `wardenHit` plays, so the player hears which shots count.

**Given** `test-warden-arena` with an `AudioAnchor` added at the great wheel
**When** the level plays
**Then** the great wheel's loop plays from the start on the ambience bus, its gain following Rowan's distance from the anchor through a curve in `audio/mix.ts` (starting values †); this story leaves tuning it across Level 2 to Epic 5
**And** on `storyCueReached` for `wheelStop` the loop ends in a long creak, then silence, and doesn't come back
**And** the `AudioAnchor` class (a region marking the sound's source) joins the Tiled project and the compiler here, compiled as typed data, and a level test compiles a fixture holding one and asserts its compiled data (AR128, AR216; readiness proposal 2026-11-13, Q7).

**Given** the seal break with all audio in place
**When** it plays on a first play
**Then** the order is the narrative's: the music cuts, the seal-break sound plays on `sealShatter`, the wheel creaks to a stop, a beat of silence, then the stinger
**And** a skipped seal break doesn't pile up the sounds of the beats it skipped; a Vitest test on the audio layer's event handling (the part that decides which sounds start) covers it.

**Given** ledge grab
**When** `ledgeGrabbed` and `ledgeClimbed` arrive
**Then** the ledge-grab and climb sounds play.

**Given** every new sound
**When** `make build` runs
**Then** the sound effects stay within 2 MB † and the wheel loop within the music and ambience budget (AR152)
**And** `docs/ASSETS.md` records each file, its tool, licence and AI flag.

**Given** a full fight and seal break with sound
**When** the developer plays and listens
**Then** he signs off on the sounds and on the `CONFIG.story.sealBreak` † timings, or they are tuned with him and Story 4.7's tests rerun.

Note: The architecture says `endStory` applies unreached cues on a skip and that each cue emits `storyCueReached`. This story reads a skip as playing none of the skipped beats' sounds, so a skip cuts cleanly to the results.

### Story 4.15: Playtest the warden and close the epic

As a developer,
I want proof that every attack can be dodged and a first-time playtest that meets the GDD's thresholds,
So that Epic 4 exits on evidence and Epic 5 can join the arena to Level 2.

**Requirements:** NFR46, NFR20, NFR47, NFR48, NFR49, PR11, PR28, UX-DR74 (Tomás's journey), PR14, NFR27
**Depends on:** 3 to 5 first-time players from the primary audience (35–55, arcade-era players), found by the developer

**Acceptance Criteria:**

**Given** the finished arena, warden, seal break and audio
**When** the developer wins a full fight without taking damage, with the input recorder on (AR211)
**Then** the recording is kept with the tests, it takes in at least one full wheel roll, out and back (sprint change proposal 2026-11-13, G2), and a Vitest test replays it to `wardenDefeated` with `stats.hitsTaken` at 0
**And** together with Stories 4.3 and 4.4's dodge tests, this proves every attack can be dodged (the first exit criterion).

**Given** a standard gamepad and the test arena
**When** the developer plays steps 2 to 9 of EXPERIENCE.md's journey "Tomás beats the Warden of the First Seal"
**Then** each step holds: the triple shot and its timer; the door shuts and the bar fades in, "The Warden", full and notched; the timer's warning at 3 s; the notch crossed, the flinch and the music shift; the failure path, where a phase-2 death keeps the HUD and the bar through the death sequence and the respawn at the door brings three hearts, a hidden bar and the triple shot back, and entering again brings the bar back full; the final hit drains the bar, the HUD fades and the seal break plays with no text while his presses do nothing; the results show "Respawns" 1
**And** this story leaves the Level 3 loading card after the results to Epic 5.

**Given** 5 first-time testers from the primary audience (35 to 55, arcade-era players), each watched without help and playing on keyboard or gamepad as they prefer
**When** each plays Emberwood from the title gate, then the test arena
**Then** the developer records, per tester, the attempts (one attempt is one arena entry, ending in a death or the win), the time from `arenaEntered` to `wardenDefeated` of the winning fight, where they got stuck and for how long, every question asked, and what they say after the seal break.

**Given** the playtest records
**When** they are checked against the GDD's thresholds
**Then** at least 4 of 5 testers win within 5 attempts (NFR46)
**And** the testers' winning fights land in the 60 to 120 s target (NFR20)
**And** no tester is stuck for more than 60 s at one spot without understanding what to do, no tester asks what a button does after the first 2 minutes (NFR47), and no tester quits from frustration (NFR48)
**And** testers mention the change in Rowan after the seal break without being prompted (NFR49), with the count recorded.

**Given** a threshold is missed
**When** the developer reviews the records
**Then** he and the agent tune the † numbers, starting with the warden's HP † (starting value 30) and the hub window's length † (starting value 1.5 s), tuned together until a first-time player's fight lands in 60 to 120 s (sprint change proposal 2026-11-13, G2), rerun every affected test, the dodge, hub-window and hub-reachability tests included, and repeat the playtest once with new first-time testers; if the re-test misses a threshold too, there is no third round: the agent takes it to `gds-correct-course` with the developer (readiness proposal 2026-11-13, Q9)
**And** every † number changes only with the developer, and the unmarked ones only by his decision; the phase-2 threshold follows HP, at half health
**And** once the fight's † numbers are tuned, the HP † and the hub window † included, the developer re-records the no-damage run of the first criterion above, and its Vitest replay passes again, to `wardenDefeated` with `stats.hitsTaken` at 0 (readiness proposal 2026-11-13, Q9).

**Given** ledge grab finished
**When** `make check` runs
**Then** every ledge-grab test from Story 4.6 passes
**And** the developer plays the test room with stage 2 and its animations and signs off that ledge grab feels right (the third exit criterion).

**Given** everything above passes
**When** a last critic-loop round runs on the arena and seal-break spots
**Then** the hero, the warden, the hazards and the pickups stand out at a glance in every shot
**And** the playtest results are written into this story's file, the developer confirms PR11's list (the warden in its arena, the seal-break moment, Rowan stage 2, ledge grab, the Level 2 tune and its warden arrangement), and approves the epic.

Note: Having testers play Emberwood first, so they learn the controls the way the game teaches them, is this story's reading; no document says how a standalone arena is playtested.

Note: NFR20 and NFR49 give no aggregate. This story reads NFR20 as the median winning fight within 60 to 120 s with none over 120 s, and leaves NFR49's pass to the developer's judgment from the recorded count.

Note: Default X-B31 (3 of 4 testers) covers Epic 3 only. If fewer than 5 testers are available, the developer sets the threshold before the playtest.

---

## Epic 5: Levels 2 and 3

A new player can play version one from start to finish, the Drowned Mill into the warden, then Harrowmere ruins to the fallen fire bell, the closing card and the all-bells card, in 20 to 30 minutes.

**In scope:**

- **Level 2, the Drowned Mill:**
  - waterwheel platforms that move on a circular path and stay level (default X-B9), and deep water that works like a pit
  - the piercing shot: its simulation, its pickup model and its HUD icon
  - a grey box with jump marks and tests, then the Drowned Mill kit and dressing
  - Epic 4's arena joined to `drowned-mill.tmj`, with the door checkpoint and the triple shot before it
  - story props: the valley-rim start, drowned carts and fences, decorative waterwheels, the millhouse, and grain sacks marked with Harrowmere's mark at the warden's door checkpoint (default X-B29)
- **Level 3, Harrowmere ruins:**
  - a grey box built around ledge grab, with jump marks and tests, then the Harrowmere kit and dressing
  - the siege-line start (rotted camp, faded banner, scorched circle), the burned gate with Harrowmere's mark, household props left in the streets; no bodies and no child imagery
  - a last mixed-enemy stretch, then a calm walk to the exit at the fallen fire bell below its collapsed tower
- Both levels follow the GDD's difficulty caps (challenge-tier jumps, enemies on screen) and the 6 to 8 minute target, with their lengths taken from the pace measured in Epic 1.
- Bell hints in Levels 2 and 3 use ember trails and gaps, never lanterns.
- The three enemies recoloured in each level's palette.
- **Audio:** the Drowned Mill ambience and the great wheel's loop, louder near the arena (`AudioAnchor`); the Level 3 tune, fading to wind on the last calm stretch (an `AudioFade` region on the music bus); the Harrowmere ambience; the closing-card stinger carrying Elin's motif.
- **Story:**
  - the Level 2 and 3 lines on their loading cards, and the first-play route from Level 1 to Level 2 to Level 3, with first play and replay told apart (default X-B2) from the session's progress, kept in memory until Epic 6 saves it
  - the held beat at the fallen bell: about 3 s †, no text, safe, skippable on replays only, HUD hidden, pausable
  - the closing card and the all-bells card: final text, silhouettes in the card scene, Epic 3's card input rules, with Back skipping them on replays only
  - Level 3's end order: the held beat, the closing card, the all-bells card if all 9 bells are found, then the results over the dimmed last card scene; after a first play the game returns to the title gate (default X-B23)
  - every story line checked on screen against the 80-character limit (NR6)
- A critic loop across both levels, and a playtest of version one from start to finish.

**Out of scope:**

- New enemy types; Levels 4 to 6.
- The title menu, the level select, saving, settings, restart and quit (Epic 6).
- Entering a replay from the level select, replay routing after the results, the all-bells card after a Level 1 or 2 replay, its rewatch row, and the loading card's replay skip (Epic 6). This epic builds the replay rules for the held beat and the two end cards; the way into a replay comes with Epic 6.
- The intro cards' silhouettes (Epic 3).

**Depends on:** Epic 4's exit criteria met and approved by the developer. The ending is decided (narrative design, 2026-11-13). The image model, Tripo and the audio tools are chosen, with their terms logged in `docs/ASSETS.md` (Epics 0, 2 and 3).

**Playable deliverable:** version one from start to finish in the browser: the title gate, the intro, Emberwood, the Drowned Mill into the warden and the seal break, Harrowmere ruins to the fallen fire bell, the held beat, the closing card, the all-bells card when earned, and the results.

**Exit criteria:** A new player finishes version one in 20 to 30 minutes.

### Story 5.1: Add waterwheel platforms and deep water

As a player,
I want platforms that ride a turning wheel and stay level, over water that works like a pit,
So that the Drowned Mill has its own platforming without new rules to learn.

**Requirements:** FR22, X-B9, FR21 and FR132 (applied to waterwheels), FR64–FR65 (deep water), X-B4

**Acceptance Criteria:**

**Given** a `WaterwheelPlatform` object in a Tiled level with its per-instance radius and speed properties (default X-B9)
**When** the level compiles and the simulation steps
**Then** the platform moves on a circle around its wheel's centre at that speed in tiles/s, its position computed from the step count with the `sim/math.ts` sine and cosine, never accumulated, so it is back at its start after one full turn
**And** its collision top stays horizontal at every angle: it moves along the circle and never rotates
**And** unit tests check one full turn, and the state-hash determinism test passes on a level with waterwheels

**Given** a waterwheel platform faster than the moving-platform cap in `CONFIG` (starting value 5.3 tiles/s †), narrower than the 3-tile minimum, or whose path would carry its box into a solid tile
**When** `make levels` runs
**Then** the compile fails and names the object
**And** compile tests cover all three cases

**Given** Rowan falls onto a waterwheel platform from above
**When** he lands and then gives no input for one full turn
**Then** the platform carries him round the whole circle without him slipping off or sinking into it, as Epic 1's moving platforms carry him (FR21)
**And** jumping off keeps the platform's velocity by Epic 1's rule, and Down + jump is a normal jump, not a drop-through
**And** unit tests cover landing, a full ride, jumping off and Down + jump

**Given** a waterwheel platform moving into Rowan from below or from the side
**When** its box overlaps his
**Then** it never pushes, lifts or crushes him: it is solid from above only, and he lands on it only while falling with his feet above its top the step before (default X-B9)
**And** a walker never stands on or rides a waterwheel platform
**And** unit tests cover both

**Given** a `KillZone` region over deep water
**When** Rowan falls into it from a waterwheel platform
**Then** the pit rule applies unchanged: he loses 1 heart, the screen fades for 0.5 s †, and he returns to the last stable ground, which is never a waterwheel platform (FR64, FR65, default X-B4)
**And** if it was his last heart he dies instead
**And** unit tests on a small level with a waterwheel over deep water cover both cases

**Given** a test level (`levels/test-*.tmj`) with waterwheels of different radius, speed and direction
**When** the developer rides them in the browser
**Then** the developer signs off on how landing, riding and jumping off feel

Note: X-B9 names radius and speed only. Several platforms on one wheel need a per-instance start angle, and the wheel needs a turning direction; this story adds both as Tiled properties.
Note: No document asks for the compile check that a waterwheel's path never meets a solid tile; it is added so X-B9's "no crushing" holds by construction.

### Story 5.2: Add the piercing shot

As a player,
I want a pickup that makes my ember spit reach twice as far and pass through enemies,
So that the Drowned Mill gives me one new tool, and a line of flyers becomes a chance instead of a wall.

**Requirements:** FR52, FR53, FR55–FR56 (piercing shot), X-B6, X-B7

**Acceptance Criteria:**

**Given** Rowan takes a `WeaponPickup` whose weapon is the piercing shot
**When** he spits
**Then** each shot flies at the ember spit's speed (15 tiles/s) for the piercing-shot lifetime in `CONFIG` (starting value 1.1 s †, about 16.5 tiles), with the spit's cooldown and hold-to-fire unchanged
**And** a unit test, reading only `CONFIG` values, checks the speed and the distance a shot travels before it ends

**Given** a piercing shot whose path crosses several enemies
**When** it reaches each one
**Then** it deals 1 damage to each enemy it passes through, once per enemy per shot, and keeps flying
**And** the shot rules still apply: the enemy box grows by 0.12 tiles for the test (FR59), a kill has no hit-stop and shake trauma 0.12 (FR69), and a survivor flashes (FR72)
**And** unit tests cover three thorn flyers in a line killed by one shot, and a rooted spitter (2 HP) taking 1 damage from one shot

**Given** a piercing shot that meets a solid tile, a one-way ledge, a moving or waterwheel platform, a spitter's seed, or the warden
**When** the step resolves
**Then** it stops on the solid tile, passes through one-way ledges and platforms (FR45), and destroys the seed and keeps flying
**And** against the warden it follows Story 4.2's hub rule and never passes through: on the open hub it does 1 damage and is used up, so it hits once per shot; on the body or the shut hub it splashes off, is used up and emits `wardenShotBlocked` (readiness proposal 2026-11-13, Q4)
**And** unit tests cover each case, the warden's open hub, shut hub and body included

**Given** Rowan holds one weapon pickup and takes the other (triple shot or piercing shot)
**When** the pickup is taken
**Then** the new weapon replaces the old one and its timer starts from 20 s (FR53); `weaponCollected` carries `piercingShot` or `tripleShot`; `weaponRunningOut` fires at 3 s left and `weaponExpired` at 0
**And** the timer counts in the combat step, so it holds during hit-stop, pause and story moments (default X-B6)
**And** the HUD weapon timer reads the piercing shot's remaining time as it does the triple shot's
**And** unit tests cover both swaps and the timer events

**Given** Rowan holds the piercing shot
**When** he falls into a pit, and later dies and respawns at a checkpoint
**Then** he keeps it through the pit fall, loses it on death, and every weapon pickup he has taken in the level is back in its place on respawn (FR55, FR56, default X-B7)
**And** unit tests cover all three

**Given** a piercing-shot pickup in a test level
**When** the developer plays with it in the browser
**Then** the developer signs off on its range and feel; the lifetime stays a † value in `CONFIG`

Note: The GDD says the piercing shot "passes through enemies" but not how often it hits each one; this story hits each enemy once per shot and lets the shot fly on after it destroys a seed. Against the warden it follows Story 4.2's hub rule and never passes through (readiness proposal 2026-11-13, Q4).
Note: No document says a piercing shot looks different in flight; it reuses the ember-shot view.

### Story 5.3: Lay out grey-box Level 2 with its jump tests

As a player,
I want the Drowned Mill as a complete grey-box level that teaches waterwheels and the piercing shot through its layout,
So that Level 2 plays well before any art dresses it.

**Requirements:** FR57 (piercing shot), FR118, FR122–FR124, FR128, FR134–FR141, FR152 (layout), NR80, NR96 (ember trails), NFR17–NFR19, NFR22–NFR23, PR16, PR20

**Acceptance Criteria:**

**Given** `levels/drowned-mill.tmj` with its `collision`, `entities`, `regions` and `jumps` layers
**When** `make levels` runs
**Then** it compiles and passes validation with one `PlayerStart`, 3 checkpoints, 3 bells, 100 to 150 embers †, a height of 18 to 24 tiles †, and a temporary `Exit` where the warden's door will be; this story leaves the arena join to Story 5.4
**And** `?level=drowned-mill` loads it with Rowan as the full beast, without ledge grab (`CONFIG.levelForm`)
**And** progress is linear, left to right with vertical variation, with nothing locked off (FR141)

**Given** the level's length
**When** it is set
**Then** the main path's length in tiles comes from the pace Epic 1 measured on grey-box Level 1, so a first play takes about 6 to 8 minutes before the warden (NFR23, PR20)
**And** each section, from the start to the door, is 60 to 120 s of first-play time at that pace, so no single failure costs more than about 120 s (NFR17, NFR18)
**And** each section ends in a calm spot at a checkpoint, the intensity is medium, and the hardest section is the last one before the door (FR128, FR152, NFR22)

**Given** waterwheel platforms and the piercing shot, Level 2's two new elements (FR137)
**When** each first appears
**Then** it follows the teaching pattern: introduced where failure is cheap (no pit or deep water below), practised once safely, combined with something already known, and tested before the next checkpoint (FR136)
**And** the piercing-shot pickup sits before a combat-heavy stretch where enemies line up, so passing through them shows at once (FR57)
**And** deep water is authored as `KillZone` regions

**Given** the enemies in the level
**When** they are checked
**Then** they are the three existing types with unchanged rules, in harder combinations, and no more than 3 are on screen at once (`CONFIG` cap, starting value 3 †), by Epic 1's compile check (FR135)
**And** each is visible for at least 1 s before Rowan can reach it at full run speed, none sits on the landing of a jump the player can't see, and every spitter stands where the player can crouch, jump or shoot (FR138–FR140), checked by Epic 1's level tests where they exist and by the developer with the F1 overlay's logical-view box otherwise

**Given** the marked jumps
**When** `make levels` and `make test` run
**Then** challenge-tier jumps are at most 10% † of the level's jumps and sit only close to a checkpoint (FR134)
**And** every break or rise on the main path has a jump mark, every waterwheel jump included, and the jump search proves each one possible in the beast form, waiting for a waterwheel's phase where needed (PR16)
**And** the static metric checks and the coverage check pass

**Given** the 3 bells, Elin's trail (NR80)
**When** they are placed
**Then** each is reachable with the beast form's abilities, shown by a jump mark on its route (FR122); none sits behind a gamble on a pit or deep water (FR124); and each has an ember trail leading off the path, with room left for a gap in the dressing (FR123, NR96)
**And** the embers follow the placement split: about 60% on jump arcs and paths, 25% on detours, 15% in clusters after hard stretches † (FR118)

**Given** the grey-box level
**When** the developer plays it from the start to the temporary exit in the browser
**Then** the developer signs off on its flow and its teaching
**And** the Level 2 critic-loop spots are in `src/debug/spots.ts`: the start, the first waterwheel, a deep-water stretch, the piercing-shot pickup, each checkpoint and the door's position
**And** the respawn target of 8 or fewer, warden included † (NFR19), is designed for here; the epic's playtest measures it

### Story 5.4: Join the warden arena to the Drowned Mill

As a player,
I want the Drowned Mill to end at the millhouse door and the warden's arena,
So that I win Level 2 by beating the warden, as version one intends.

**Requirements:** AR132, FR144, FR57 (door pickup), FR2 (warden win in the full level), AR193 (Level 2 music in the full level), AR194 (the anchor)

**Acceptance Criteria:**

**Given** Epic 4's standalone arena in `test-warden-arena.tmj`
**When** it is joined to the end of `drowned-mill.tmj` in place of the temporary exit
**Then** the level has its 3 checkpoints plus one at the warden's door, a triple-shot pickup just before the door, the `ArenaTrigger`, the `Door` and the `Warden`, and no `Exit`, and it passes compile validation as a warden level (FR144)
**And** the level holds 2 weapon pickups: the piercing shot earlier and the triple shot at the door (FR57)

**Given** the joined arena
**When** it is compared with the standalone one
**Then** its layout is unchanged: one screen 19 tiles wide, a flat floor and two one-way ledges 3 tiles up †, framed as Story 4.2 holds it: the camera still, with the millhouse dressing 3 tiles † past the edges on wider or taller windows (sprint change proposal 2026-11-13, A4)
**And** jump marks from the last section through the door into the arena pass the jump search

**Given** Rowan in the full level at the door checkpoint
**When** he enters the arena, dies, respawns at the door and enters again
**Then** the warden behaves as in Epic 4: dormant until the `ArenaTrigger`, the door shuts behind Rowan, the warden bar shows, and after the respawn the warden is back at full health (FR83, FR88)
**And** Epic 4's warden, seal-break and story-safety tests run against `drowned-mill`, spawned at the door checkpoint, and pass
**And** the developer re-records Story 4.15's no-damage run in `drowned-mill`, started at the door checkpoint like these tests, since `world.rng` is seeded from the level id and the millstones fall differently here; it replaces the standalone arena's recording, and its Vitest replay passes again, to `wardenDefeated` with `stats.hitsTaken` at 0 (readiness proposal 2026-11-13, minor)

**Given** the warden reaches 0 HP in the full level
**When** the seal break ends
**Then** Rowan is in stage 2 with ledge grab and the level completes into the results, so Level 2 is won by the warden, not by an exit (FR2)

**Given** the great wheel in the arena
**When** the level is authored
**Then** an `AudioAnchor` region marks it; this story leaves the wheel's loop to Story 5.15
**And** the Level 2 tune plays from the level's start, and the warden arrangement crossfades in at phase 2 as it did in the standalone arena (AR193)

**Given** the arena now lives in `drowned-mill.tmj`
**When** the story is reviewed
**Then** the arena's layout has one source: `test-warden-arena.tmj` is deleted, and `?level=drowned-mill&checkpoint=<door checkpoint>` starts a warden test at the door instead

**Given** the arena spots in `src/debug/spots.ts`, now pointing at `drowned-mill`
**When** the critic loop runs (`make shots ROUND=n`)
**Then** the captures match Epic 4's standalone-arena captures by eye, with any regression fixed, for at most 3 rounds, with before and after shown to the developer
**And** the developer plays Level 2 from its start through the seal break in the browser and signs off

Note: decided by the developer on 2026-11-13: the standalone test arena is deleted once the arena joins Level 2, so the layout never exists in two copies.

### Story 5.5: Lay out grey-box Level 3 around ledge grab, with its jump tests

As a player,
I want Harrowmere ruins as a complete grey-box level that teaches ledge grab through its layout alone,
So that the hand the seal gave back carries the hardest platforming in version one.

**Requirements:** FR57 (Level 3), FR118, FR122–FR124, FR128, FR134–FR141, FR143, FR153 (layout), FR154–FR155, NR80, NR95, NR96 (ember trails), NR97 (layout), NFR17–NFR19, NFR22–NFR23, NFR26, PR16, PR20

**Acceptance Criteria:**

**Given** `levels/harrowmere.tmj`
**When** `make levels` runs
**Then** it compiles and passes validation with one `PlayerStart`, 3 checkpoints, 3 bells, 100 to 150 embers †, a height of 18 to 24 tiles †, and an `Exit` where the fallen fire bell will lie (FR143)
**And** `?level=harrowmere` loads it with Rowan changed, with ledge grab (`CONFIG.levelForm`)

**Given** the level's shape
**When** it is laid out
**Then** it runs from a `PlayerStart` on a rise at the old siege line, through the gate and the town, to a last mixed-enemy stretch, then a calm walk to the exit (FR153, FR155)
**And** the main path's length in tiles comes from Epic 1's measured pace, so a first play takes about 6 to 8 minutes, with each section 60 to 120 s at that pace (NFR17, NFR18, NFR23, PR20)
**And** the intensity is medium-high with the hardest platforming in version one; each section ends calm at a checkpoint; the last mixed-enemy stretch is the hardest section (FR128, NFR22)

**Given** ledge grab, Level 3's new tool (FR137)
**When** it first appears
**Then** the layout alone teaches it, with no control sign: introduced where failure is cheap (no pit below), practised once safely, combined with something known, and tested before the next checkpoint (FR136, FR154, NFR26)
**And** every ledge-grab climb has its ledge top at most 4 tiles † above the take-off ground, on a solid tile corner with headroom, never on a one-way ledge, a moving platform or a hazard tile (FR104, FR105, FR110), checked by the static metric checks
**And** ledge-grab climbs are the only places that lock progress (FR141, NR95)

**Given** the enemies and pickups
**When** they are checked
**Then** no more than 4 enemies are on screen at once (starting value 4 †, FR135), challenge-tier jumps are at most 20% † and only close to a checkpoint (FR134), and the combat-space rules hold as in Story 5.3 (FR138–FR140)
**And** the level holds 1 or 2 weapon pickups, placed before combat-heavy stretches (FR57)

**Given** the calm walk to the exit
**When** a level test runs
**Then** an `AudioFade` region with its `bus` set to `music` spans it, its length is within the calm-walk range in `CONFIG` (starting value 15 to 25 tiles †), and no enemy is placed in it or can walk or fly into it (FR155, NR97)

**Given** the marked jumps and the bells
**When** `make test` runs
**Then** every break or rise on the main path has a jump mark, and the jump search proves each one possible in the changed form, with a ledge-grab climb where the mark's ability is `ledgeGrab` (PR16)
**And** each bell is reachable with the changed form's abilities, ledge grab included (FR122), none sits behind a gamble on a pit (FR124), each has an ember trail with room left for a gap in the dressing (FR123, NR80, NR96), and the embers follow the 60/25/15 split † (FR118)

**Given** the grey-box level
**When** the developer plays it from start to exit in the browser
**Then** the developer signs off on the ledge-grab platforming and the flow
**And** the Level 3 critic-loop spots are in `src/debug/spots.ts`: the start, the gate, the first ledge-grab climb, a street, the last mixed-enemy stretch, the calm walk, and `l3-fallen-bell` with its coordinates set
**And** the respawn target of 8 or fewer † (NFR19) is designed for here; the epic's playtest measures it

### Story 5.6: Route the first-play campaign through the Level 2 and 3 loading cards

As a player,
I want each finished level to lead to the next level's loading card and its line,
So that I play Emberwood, the Drowned Mill and Harrowmere ruins in order, in one sitting.

**Requirements:** FR1, FR99, FR142 (first-play flow), FR159 (Levels 2, 3), FR168 (level lines), FR179 (first play), NR1, NR31–NR32, NR52 (first play), AR108 (first play), UX-DR55 (Levels 1 and 2, first play), UX-DR64, UX-DR74 (Marta's and Tomás's last steps), X-B2, X-B23

**Acceptance Criteria:**

**Given** a level ends and Epic 6's save does not exist yet
**When** the app handles the end of the level
**Then** it records the level in the session's progress, kept in memory in the shape of the save's `progress` (finished levels, the unlocked level, bells found per level as a union), and finishing level N unlocks level N+1 (FR142)
**And** Vitest app tests check the record after each of the three levels

**Given** a level starts to load
**When** the app decides between first play and replay
**Then** it is a replay only if the level is already in the session's finished set as it loads (default X-B2); dying and respawning never change that
**And** the app sets `isStorySkippable` only on a replay
**And** Vitest app tests cover both cases

**Given** the story-text module and `content/levels.ts`
**When** the Level 2 and 3 lines are added
**Then** they read exactly "Her bells led into a drowned valley, where a wheel had turned for ten years." (NR31) and "The road to her ran through Harrowmere. He had not been back since." (NR32), keyed by level id, with the names "The Drowned Mill" and "Harrowmere ruins" (X-A5)
**And** no screen hard-codes a line or a name (NR1)

**Given** a first play of Emberwood has ended
**When** the player confirms Continue on its results
**Then** the Drowned Mill loading card shows the level's name and line, holds for the reading floor (about 3 s †) and until loading is done, then the level starts with Rowan as the full beast (FR159, FR179, NR52, AR108)
**And** Emberwood's assets are disposed and the Drowned Mill's bundle loads behind the card, through Epic 1's loader

**Given** a first play of the Drowned Mill has ended with the warden's defeat
**When** the seal break ends and the player confirms Continue on the results
**Then** the Harrowmere ruins loading card shows the level's name and line, and the level starts with Rowan changed, with ledge grab (FR99)

**Given** a first play of Harrowmere ruins has reached its results
**When** the player confirms Continue
**Then** the game returns to the title gate, which stands in for the title menu until Epic 6 (default X-B23)
**And** a replay's results also return to the title gate until Epic 6 builds the level select

**Given** the whole first-play chain
**When** Vitest app tests drive it from the title gate through the intro, the three loading cards and three level ends (with the seal break in Level 2) back to the title gate
**Then** every step matches EXPERIENCE.md's first-play campaign flow, with the title gate in place of the title menu (UX-DR64)
**And** in the browser the developer plays the end of Emberwood into the Drowned Mill, and the seal break into Harrowmere ruins, matching the last steps of the "Marta finishes Emberwood" and "Tomás beats the Warden" journeys (UX-DR74), and signs off

Note: No document says where progress lives before Epic 6's save; this story keeps it in memory in the save's `progress` shape, so Epic 6 can persist it without reshaping it.
Note: Before Epic 6 there is no level select for a replay's results to return to; this story sends them to the title gate.

### Story 5.7: Add the held beat at the fallen fire bell

As a player,
I want Rowan to stop at Harrowmere's fallen fire bell for a few silent seconds,
So that I see him face what he did before the closing card.

**Requirements:** FR160, FR161 (held beat), NR13, NR41, NR55, NFR25 (held beat), PR15, AR79–AR83, AR86, AR107, UX-DR51, X-B2

**Acceptance Criteria:**

**Given** Rowan touches Harrowmere's exit
**When** the step resolves
**Then** the story director starts `heldBeat` with its start step and emits `storyStarted` (AR79), and enemy shots, seeds and attacks in progress are removed (AR80)
**And** touching Emberwood's exit still completes the level at once, with no story moment
**And** which exit starts the held beat comes from level data or `CONFIG`, never from a level-id check in logic
**And** unit tests cover both exits

**Given** the held beat is running
**When** an enemy body or spikes overlap Rowan in a unit test
**Then** he takes no damage (FR161), proven by the story-safety unit test extended to `heldBeat` (PR15, AR86)

**Given** the held beat is running on a first play
**When** the player presses any play input, jump and the skip action included
**Then** it is ignored: Rowan finishes any fall, comes to rest and stands in `idle`, with no text on screen (NR41)
**And** after `CONFIG.story.heldBeat.totalSteps` (starting value 3 s †, no cues) the director emits `storyEnded`, then `levelCompleted` (AR81, AR82)
**And** clear time does not count during it (NR13)
**And** unit tests cover the end state, the events and the clear time

**Given** the held beat is running on a replay (`isStorySkippable`, default X-B2)
**When** the player uses the skip action, `jumpPressed` or `confirmPressed`, as Story 4.7 built it (sprint change proposal 2026-11-13, A3)
**Then** the held beat ends at once, with the same end state and events as a full one (FR160, NR55)
**And** unit tests cover the skip on a replay and its absence on a first play

**Given** the held beat is running
**When** the player pauses with Esc, P or Start, or an auto-pause trigger fires
**Then** the simulation stops, and on Resume the held beat continues where it was with its remaining steps unchanged (AR107)
**And** a Vitest app test covers it

**Given** `storyStarted` for the held beat
**When** presentation reacts
**Then** the HUD fades out over `hudStoryFadeSeconds` and stays hidden until the level ends, and the mute indicator is hidden (UX-DR51)
**And** `render/fx/storyStaging.ts` stages it from `world.story` and the step count alone: the camera holds on Rowan at the exit, and at the end the screen fades to the next screen as the seal break's end does (AR83)
**And** until Story 5.9 puts the closing card in Level 3's end order, the next screen is the results

**Given** the held beat in the browser on a first play
**When** the developer watches it at the grey-box exit
**Then** the developer signs off on its length, which stays a † value in `CONFIG.story` (NFR25)

Note: No document says how the simulation knows that Level 3's exit, and only that exit, starts the held beat; the AC asks for data rather than a level-id check and leaves the form (an `Exit` property or a `CONFIG` table) to the developer.

### Story 5.8: Build the closing card and the all-bells card

As a player,
I want the closing card to cut away to Elin far below, and the all-bells card to give me a memory of her,
So that version one ends on Rowan's first payment and on Elin acting on her own.

**Requirements:** FR162, FR163 (the card), FR164–FR165, FR167 (applied), FR168–FR169, FR216 (closing, all-bells), NR1–NR5, NR6, NR7–NR11, NR43–NR44, NR47, NR77–NR79, NR81, X-B27
**Depends on:** where card shapes come from (made by hand or with the image model the developer chose), as decided in Epic 0 and logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** `content/cards.ts`
**When** the closing card is defined
**Then** it shows, in 3 to 5 † flat silhouette layers in the card scene, using the story palette Epic 0 set for the hollow chamber: far below, in a cold, hollow chamber, Elin at a makeshift forge, a small bell taking shape in its glow; Rowan is not on the card (NR43, FR164)
**And** with its line it delivers both things the card must: Rowan's first payment, and Elin acting on her own (FR162, NR44)

**Given** `content/cards.ts`
**When** the all-bells card is defined
**Then** it shows a memory in 3 to 5 † layers: Elin at her bench threading small bells onto a cord, by forge light, warm (NR47, FR163)
**And** neither card uses a model; Maldrek and the Ember Below appear on neither (FR164, NR78, NR79, NR81)

**Given** Epic 0's decision on the cards' warm-light exception
**When** both cards are lit
**Then** the forge glow marks Elin warm if the exception was accepted, or is pale and cold if it was refused, and nothing else on either card is warm (FR167, NR15)

**Given** the story-text module
**When** the two lines are added
**Then** they read exactly "This was his first payment. Far below, Elin was making a bell of her own." (NR43) and "She made the wedding bells herself, so he would always hear her coming." (NR47), drawn by `card-text` in the DOM on its scrim band over the art, never baked into it (FR165, NR2)
**And** a Vitest content test checks the whole script now in the module: 10 text moments; 141 words (intro 71, level lines 42, closing card 15, all-bells card 13); every line 67 to 80 characters, counting a curly quote as one; exactly two quoted lines, both in the intro; "seal" nowhere, and "Tithe" only in "the Tithe-Collector" (NR3, NR7, NR9–NR11, NR77, FR168, FR169, default X-B27)
**And** the module holds the narrative design's script word for word and nothing else, so the voice rules, the narrator's stance and the no-dialogue rule hold by construction (NR4, NR5, NR8)

**Given** every story line now on screen: the 5 intro cards, the 3 loading-card lines, the closing card and the all-bells card
**When** each is viewed at the 1280 × 720 embed, in a 1920 × 1080 window and in a 4:3 window
**Then** each fits its scrim band or the loading card at `text-measure`, on one line or a clean wrap, legible at its type's pixel floor, which checks the 80-character limit on screen (NR6)
**And** any line that fails is reported to the developer; story text changes only through the narrative design's own workflow, never in code

**Given** the card art
**When** `make build` runs
**Then** all seven story cards together stay within their 1 MB † budget
**And** the new card sources are in `art-src/cards/`, logged in `docs/ASSETS.md` with their tool and AI flag

**Given** both cards on the look-dev page
**When** the critic loop runs (`make shots ROUND=n`, capturing them as the Epic 0 sample card was captured)
**Then** each round compares them with the style guide and the sample card, writes down the three biggest problems and fixes them, for at most 3 rounds, with before and after shown to the developer
**And** the developer approves both cards and the extent of each card's text band

### Story 5.9: Play Level 3's end order and return to the title gate

As a player,
I want the held beat, the closing card, the all-bells card when I've earned it, and then my results,
So that the story lands before the numbers do.

**Requirements:** FR3, FR163 (timing), FR166, FR180, FR183 (first play), NR12, NR42, NR45, NR48–NR49, NR51, NR53–NR54, AR109, AR110 (the shared bell rule), UX-DR55 (Level 3), UX-DR56–UX-DR57, UX-DR64, UX-DR74 (Marta finishes Harrowmere ruins), X-B2, X-B23, X-B24, X-B32

**Acceptance Criteria:**

**Given** a first play of Harrowmere ruins
**When** the held beat ends
**Then** the closing card follows straight away, before any results (NR42, FR180)
**And** with fewer than 9 bells found by then, the results follow the closing card and no all-bells card plays (NR51)

**Given** all 9 bells are found by the end of the closing card, counted from the session's bells found per level with this run's bells included
**When** the player advances the closing card
**Then** the all-bells card plays, then the results (FR3, FR183, NR48, NR49, NR53)
**And** "all 9 found" is derived from the bells found and never stored as a flag, so Epic 6's level-select row can use the same rule (AR110)

**Given** the results after Level 3
**When** they show
**Then** the results panel sits over the last card's scene, dimmed by the scrim, not over the world (UX-DR55)
**And** confirm is the only input that acts on them, Back is ignored (default X-B24), and Continue on a first play returns to the title gate (AR109, default X-B23)

**Given** the closing card or the all-bells card is showing
**When** the player presses anything before the card minimum (about 1.5 s †), or a press began before the card appeared
**Then** it is ignored, Back included; after the minimum the advance hint fades in, and confirm or a click advances one card (FR166, default X-B24), by Epic 3's card rules
**And** on a first play Back does nothing (NR45); on a replay Back skips the rest of the sequence, straight to the results (NR54)
**And** P and Start do nothing and Esc acts as Back; an auto-pause trigger only clears held input; the cursor and the mute indicator are hidden (default X-B32)

**Given** a replay of Harrowmere ruins (default X-B2)
**When** it reaches its exit
**Then** the order is the same, and the held beat, the closing card and the all-bells card can each be skipped (NR54)
**And** Vitest app tests cover a first play and a replay, each with 8 and with 9 bells, and confirm that no card or text state is entered from Playing except at a level's end (NR12); entering a replay in the browser waits for Epic 6's level select

**Given** the developer plays Harrowmere ruins to its end in the browser on a first play
**When** the held beat, the closing card and the results run
**Then** they follow EXPERIENCE.md's "Marta finishes Harrowmere ruins" journey from its step 3, with the title gate in place of the title menu and without the settings detour, which is Epic 6's (UX-DR64, UX-DR74)
**And** the developer also sees the 9-bell branch once on a full run with all 9 bells, and signs off on the order and timing

### Story 5.10: Build the Drowned Mill kit and recolour the enemies

As a player,
I want the Drowned Mill to look like fog over a marsh, black water and turning wheels,
So that Level 2 feels like a new, colder place in the same game.

**Requirements:** FR22 (look), FR152 (look), FR214 (Drowned Mill kit), NR91 (waterwheel platforms), NR100–NR102, NR104, NFR27–NFR31, PR14, PR19, PB61
**Depends on:** the image model the developer chose (Epic 0) and Tripo (Epic 2), with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** grey-box Level 2 with its arena, its jump tests green and its flow signed off (PR19)
**When** the Drowned Mill kit is made through the pipeline proven in Epic 2 (reference image, Tripo or a hand-built mesh, clean-up in Blender, glTF export, `make models`)
**Then** `kit-drowned-mill.glb` holds ground pieces, solid ledges, one-way ledges, the waterwheel platform and its wheel, spikes and props, named `<kind>_<variant>`, 1 unit = 1 tile, each origin at the bottom-left of its tile, and `optimizeModels.ts` accepts it
**And** the compile step's neighbour rules (Epic 1) pick its ground and ledge pieces from the collision grid; every piece snaps to the grid and none defines collision (PB61, NFR36)
**And** the dressing carries on 3 tiles † past each of the level's edges, so a window wider or taller than the logical view shows the Drowned Mill there, then plain bands in the palette's darkest slot; the margin adds no collision (sprint change proposal 2026-11-13, A4)
**And** its generated materials are replaced by the `render/materials` factories

**Given** waterwheel platforms in play
**When** they turn
**Then** each is drawn as a small wheel on a post whose platforms stay level, each platform's art matches its collision width, and the wheel's angle comes from the simulation's platform positions, never from a clock of its own (FR22, NR91)

**Given** deep water and pits
**When** they are drawn
**Then** they read as dark at a glance, black water under the fog, and no light in the rig brightens them (NR102, NFR29)

**Given** `render/palettes/drownedMill.ts` and `render/lighting/drownedMill.ts`
**When** Level 2 is lit
**Then** it has almost no warm light: Rowan, his shots, the embers, the bells and the weapon pickups are the warmest things on screen, and there are no lanterns (NR100, NR101, NFR28)
**And** hazards contrast with the ground around them (NFR30)
**And** 3 or 4 backdrop layers show the drowned valley, the fog and distant turning wheels, each covering the view out to the same 3-tile margin

**Given** the walker, the thorn flyer and the rooted spitter
**When** they appear in Level 2
**Then** they are recoloured by the Drowned Mill palette through the palette module, with their models, animations and rules unchanged, and the thorns on the thorned ones still read (NR104, FR76)
**And** each stands out from the background at a glance (NFR27)

**Given** the finished kit
**When** `make build` runs
**Then** the kit with its backdrops stays within its 3.5 MB † budget, repeated pieces use `InstancedMesh` with bounding volumes, and every new asset is logged in `docs/ASSETS.md` with its tool, licence and AI flag

**Given** the Level 2 spots in `src/debug/spots.ts`, with the level's start added in a 21:9 and a 4:3 window
**When** the critic loop runs (`make shots ROUND=n`)
**Then** each round compares the spots with the reference images and the style guide, writes down the three biggest problems and fixes them, and checks that hero, enemies, hazards and pickups stand out, that lines of sight are clear where aiming is taught, and that the margin past the level's edges shows dressing, then the plain bands, never empty space, for at most 3 rounds, with before and after shown to the developer (PR14, NFR27, NFR31; sprint change proposal 2026-11-13, A4)

### Story 5.11: Dress the Drowned Mill with its story props

As a player,
I want the drowned valley to show what happened there without a word,
So that the water, the wheels and the marked sacks tell me this is someone else's bargain, tied to Rowan's.

**Requirements:** FR101, FR123 (gaps), FR214 (Drowned Mill story props), NR75, NR83 (Level 2), NR89–NR91, NR96, NR101, X-B29
**Depends on:** the image model the developer chose (Epic 0) and Tripo (Epic 2), with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** the level's start
**When** the player first sees it
**Then** Rowan stands on the valley rim looking down on the drowned valley in fog, shown in the middle-distance and far layers (NR89)

**Given** the drowned stretches
**When** they are dressed
**Then** fence lines and fields sit under black water, and grain carts lie half-sunk on a drowned road that points toward Harrowmere (NR90)
**And** small decorative waterwheels on posts turn all over the valley in the middle-distance and foreground layers, never on the play layer, so none can be mistaken for a waterwheel platform (NR91)

**Given** the end of the level
**When** Rowan reaches the warden's door checkpoint
**Then** the millhouse stands there around the arena's door, with rotting grain sacks marked with Harrowmere's mark (the decal checked in Epic 4) stacked by the door, visible from the checkpoint and never named in any text (NR75, FR101)
**And** the sacks sit off the play layer (default X-B29)

**Given** every story prop
**When** it is placed in the `dressing` layer
**Then** it sits where players pause (checkpoints, calm spots, bell detours, section starts) and never mid-jump; it never defines collision and never covers the play area (NR83, default X-B29)

**Given** the 3 bells
**When** the dressing is done
**Then** each bell's detour shows a gap in fences, reeds or rubble beside its ember trail, and no lantern appears anywhere in the level (FR123, NR96, NR101)

**Given** the new props
**When** `make build` runs
**Then** the kit still fits its 3.5 MB † budget, and every new prop is logged in `docs/ASSETS.md` with its tool, licence and AI flag

**Given** the Level 2 spots, with the half-sunk carts added
**When** the critic loop runs (`make shots ROUND=n`)
**Then** each round compares the spots with the reference images and the style guide, writes down the three biggest problems and fixes them, and checks that hero, enemies, hazards and pickups still stand out, for at most 3 rounds, with before and after shown to the developer
**And** the developer confirms that the sacks read as marked from the checkpoint without drawing the eye from play

### Story 5.12: Make the piercing-shot pickup and its HUD icon

As a player,
I want the piercing shot to look like Rowan's fire and to show its own icon on the weapon timer,
So that I can tell it from the triple shot at a glance.

**Requirements:** FR52 (look), FR215, NR103, UX-DR11 (piercing-shot icon)
**Depends on:** the image model the developer chose (Epic 0) and Tripo (Epic 2), with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** the pipeline proven in Epic 2
**When** `pickup-piercing-shot.glb` is made
**Then** it follows the model conventions, takes its materials from the factories, looks warm as part of Rowan's palette (NR103), and differs from the triple-shot pickup by shape, not by colour alone
**And** all six pickups and markers together stay within their 0.5 MB † budget, and the model is logged in `docs/ASSETS.md` with its tool, licence and AI flag

**Given** the HUD icon set
**When** the piercing-shot icon is checked, and made if the set lacks it
**Then** it is a single-colour silhouette, readable at `hud-icon-sm`, that differs from the triple-shot icon by outline shape, never by colour alone (UX-DR11)

**Given** Rowan takes the piercing shot, then the triple shot
**When** the weapon timer shows
**Then** it carries the piercing-shot icon, then swaps to the triple-shot icon and refills, as Epic 3's weapon timer does for any pickup

**Given** the piercing-shot pickup in Level 2
**When** it is drawn in play
**Then** it stands out from the Drowned Mill's background at a glance (NFR27)

**Given** the look-dev page with both weapon pickups side by side, the Level 2 spot at the pickup, and a spot with the piercing shot's timer active
**When** the critic loop runs (`make shots ROUND=n`)
**Then** each round compares them with the style guide, writes down the three biggest problems and fixes them, for at most 3 rounds, with before and after shown to the developer

### Story 5.13: Build the Harrowmere kit and recolour the enemies

As a player,
I want Harrowmere ruins charred, cold and grey, with Rowan the only warm thing left,
So that the town he burned feels like the coldest place in the game.

**Requirements:** FR153 (look), FR214 (Harrowmere kit), NR62, NR100–NR102, NR104, NFR26–NFR31, PR14, PR19, PB61
**Depends on:** the image model the developer chose (Epic 0) and Tripo (Epic 2), with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** grey-box Level 3 with its jump tests green and its flow signed off (PR19)
**When** the Harrowmere kit is made through the pipeline proven in Epic 2
**Then** `kit-harrowmere.glb` holds ground pieces, solid ledges, one-way ledges, spikes and props (charred walls, fallen beams, collapsed granaries), with the same naming, origins, neighbour rules, grid snap and material factories as the Drowned Mill kit (PB61, NFR36)
**And** like that kit, the dressing carries on 3 tiles † past each of the level's edges, then plain bands in the palette's darkest slot, and the margin adds no collision (sprint change proposal 2026-11-13, A4)

**Given** solid ledges, which Rowan can grab, and one-way ledges, which he can't (FR105)
**When** they are drawn
**Then** the two read differently at a glance, so the layout can teach ledge grab without a sign (NFR26)

**Given** `render/palettes/harrowmere.ts` and `render/lighting/harrowmere.ts`
**When** Level 3 is lit
**Then** it has no warm light but Rowan's, his shots', the embers', the bells' and the weapon pickups'; the dimmer stage-2 Rowan and his fire family are still the warmest things on screen; there are no lanterns (NFR28, NR62, NR100, NR101)
**And** pits read as dark and hazards contrast with the ground (NR102, NFR29, NFR30)
**And** 3 or 4 backdrop layers show the walls, the ruined town and an ash sky, cold and grey, each covering the view out to the same 3-tile margin

**Given** the walker, the thorn flyer and the rooted spitter
**When** they appear in Level 3
**Then** they are recoloured by the Harrowmere palette, with their models, animations and rules unchanged, the thorns still readable, and each stands out from the background (NR104, NFR27)

**Given** the finished kit
**When** `make build` runs
**Then** the kit with its backdrops stays within its 3.5 MB † budget, repeated pieces use `InstancedMesh` with bounding volumes, and every new asset is logged in `docs/ASSETS.md` with its tool, licence and AI flag

**Given** the Level 3 spots in `src/debug/spots.ts`, with the level's start added in a 21:9 and a 4:3 window
**When** the critic loop runs (`make shots ROUND=n`)
**Then** each round compares the spots with the reference images and the style guide, writes down the three biggest problems and fixes them, and checks that hero, enemies, hazards and pickups stand out, that lines of sight are clear where aiming is taught, and that the margin past the level's edges shows dressing, then the plain bands, never empty space, for at most 3 rounds, with before and after shown to the developer (PR14, NFR27, NFR31; sprint change proposal 2026-11-13, A4)

### Story 5.14: Dress Harrowmere ruins with its story props

As a player,
I want to walk from the siege line where Rowan stood, through the gate and the streets he burned, to the fallen fire bell,
So that the level tells me what he did without a word.

**Requirements:** FR123 (gaps), FR143 (exit marker), FR214 (Harrowmere story props), NR82, NR83 (Level 3), NR92–NR94, NR96–NR98, NR101, X-B29
**Depends on:** the image model the developer chose (Epic 0) and Tripo (Epic 2), with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** the level's start
**When** the player first sees it
**Then** Rowan starts on a rise at the old siege line, in a scorched circle where the fire was cast, beside a rotted siege camp and a faded banner of the unnamed lord (NR92, NR82)
**And** the developer compares the view with intro card 1, which shows the same spot (NR21)

**Given** the gate
**When** Rowan reaches it
**Then** it is burned and carries Harrowmere's mark, the same decal as on the mill's sacks (NR93)

**Given** the town
**When** it is dressed
**Then** charred walls, fallen beams and collapsed granaries line the way, with household things left where they were: a table set under ash, a door left open, a cart still loaded (NR94)
**And** there are no bodies, no child imagery, no people and no text anywhere in the level; it is dark, not grim (NR94, NR98)

**Given** the exit
**When** Rowan reaches the square after the calm walk
**Then** Harrowmere's fire bell lies cracked below its collapsed tower, both set-piece props, and the fallen bell is the exit's marker, at play depth as default X-B29 allows (NR97, FR143)
**And** the held beat's camera frames Rowan standing at the bell

**Given** every story prop
**When** it is placed in the `dressing` layer
**Then** it sits where players pause and never mid-jump; apart from the exit's bell, it stays off the play layer, never defines collision and never covers the play area (NR83, default X-B29)

**Given** the 3 bells
**When** the dressing is done
**Then** each bell's detour shows a gap in the rubble beside its ember trail, and no lantern appears anywhere in the level (FR123, NR96, NR101)

**Given** the new props
**When** `make build` runs
**Then** the kit still fits its 3.5 MB † budget, and every new prop is logged in `docs/ASSETS.md` with its tool, licence and AI flag

**Given** the Level 3 spots, with a street of household props added and `l3-fallen-bell` at the exit
**When** the critic loop runs (`make shots ROUND=n`)
**Then** each round compares the spots with the reference images and the style guide, writes down the three biggest problems and fixes them, and checks that hero, enemies, hazards and pickups still stand out, for at most 3 rounds, with before and after shown to the developer

Note: The narrative names "a faded banner of the unnamed lord" but no device on it; this story fades it past reading, with no device or text, since the lord stays unnamed (NR82).

### Story 5.15: Add the Drowned Mill ambience and the great wheel's loop

As a player,
I want to hear the valley's water and small wheels, and the great wheel growing louder as I near the mill,
So that dread builds toward the warden and the wheel's silence lands when the seal breaks.

**Requirements:** FR202 (the Drowned Mill), FR217 (bed and wheel loop), NR69, NR106, AR194
**Depends on:** the audio tools the developer chose in Epic 3, with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** Level 2 is playing
**When** the ambience runs
**Then** its bed (lapping water, fog drip, small wheels creaking everywhere) loops without a gap on the ambience bus, under the music, in Chrome, Edge and Firefox (FR202, NR106)

**Given** the great wheel's loop and the `AudioAnchor` in the arena
**When** Rowan moves through Level 2
**Then** the loop plays throughout the level, its gain following his distance from the anchor, read from the snapshot, through the distance curve in `audio/mix.ts` (AR194, NR106)
**And** a Vitest test of the curve checks that the gain is highest at the anchor, never rises with distance, and stays above zero across the level's width

**Given** the seal break reaches its `wheelStop` cue, or a replay's skip applies it
**When** audio handles `storyCueReached`
**Then** the great wheel's loop ends with the wheel and the valley's bed falls silent with it, so the beat of silence before the seal-break stinger holds (NR35, NR38, NR69)

**Given** Rowan dies in the arena and respawns at the door
**When** play resumes
**Then** the loop and the bed carry on as they did before the fight

**Given** the new audio files
**When** `make build` runs
**Then** they use the format chosen in Epic 3, all music and ambience together stay within the 8.5 MB † budget, and each file is logged in `docs/ASSETS.md` with its tool, licence and AI flag

**Given** the developer walks Level 2 from the rim to the arena and through the seal break
**When** listening
**Then** the developer signs off on the bed, the wheel's rise toward the arena and the silence after `wheelStop`, with the curve tuned in `audio/mix.ts`

Note: The narrative stages "a long creak, then silence" when the wheel stops, but no document says whether the valley's bed stops too; this story silences it at `wheelStop`.
Note: No document gives the wheel's distance curve beyond "heard throughout the level, louder near the arena"; this story keeps the gain above zero everywhere in the level and leaves the shape to the developer's ear.

### Story 5.16: Add the Harrowmere tune, its fade to wind, its ambience and the closing-card stinger

As a player,
I want Harrowmere's sparse tune to drop away to wind on the last walk, and Elin's motif to return with the closing card,
So that the town's silence and Elin's bell frame the end of version one.

**Requirements:** FR196 (Level 3), FR199 (closing card), FR200, FR201, FR202 (Harrowmere), FR217, NR46, NR107, NR108, NR110, AR193, AR194 (Harrowmere bed)
**Depends on:** the audio tools the developer chose in Epic 3, with their terms logged in `docs/ASSETS.md`

**Acceptance Criteria:**

**Given** the Level 3 tune made with the developer's audio tools
**When** Harrowmere ruins starts
**Then** the tune plays: short and hummable, an arcade-era melody on modern instruments, the sparest of the three, carrying Elin's motif (FR196, FR200, NR108, NR110)
**And** it loops without a gap

**Given** Rowan enters the `AudioFade` region on the last calm stretch, its `bus` set to `music` and its target gain 0, through the class Story 3.15 added (sprint change proposal 2026-11-13, A9)
**When** `regionEntered` arrives for it
**Then** the music bus fades to the region's target gain over the fade time in `audio/mix.ts`, so the tune drops out, leaving only the ambience's wind (AR193, FR201)
**And** walking back out of the region does not bring the tune back; a respawn at a checkpoint before the region restores the bus, as for every `AudioFade` region
**And** a Vitest test covers the fade and the respawn case, as far as the music state is plain logic

**Given** Level 3 is playing
**When** its ambience runs
**Then** its bed is wind, settling ash and timber creak, with no birds and no water, looping without a gap (FR202, NR107)

**Given** the closing card appears
**When** it fades in
**Then** the closing-card stinger plays once, carrying Elin's motif, as the first music since the fade (FR199, FR200, NR46)

**Given** the new audio files
**When** `make build` runs
**Then** version one's music and ambience are complete (3 tunes, the warden arrangement, the stingers, 3 ambience beds and the great wheel's loop) within the 8.5 MB † budget (FR217)
**And** each new file is logged in `docs/ASSETS.md` with its tool, licence and AI flag

**Given** the developer plays from Harrowmere's last checkpoint through the closing card
**When** listening
**Then** the developer signs off on the tune, the fade to wind, the ambience and the stinger, with the fade time tuned in `audio/mix.ts`

Note: No document gives the music fade's length; it lives in `audio/mix.ts` beside the other crossfade times and is tuned by ear.
Note: The sprint change proposal (A9) settles the respawn case: a respawn outside the region restores the bus, so the drop-out always happens on the last walk.

### Story 5.17: Run the critic loop across Levels 2 and 3

As a developer,
I want both new levels judged together, against the style guide and against Emberwood,
So that version one reads as one game whose warmth fades level by level, and I can approve its look.

**Requirements:** NFR26–NFR31, NR100, NR102, PR14

**Acceptance Criteria:**

**Given** the full spot list: Emberwood's, the Drowned Mill's, the arena's, Harrowmere's, and the closing and all-bells cards
**When** `make shots ROUND=n` runs
**Then** every spot is captured in `shots/round-n/` with the game running headless

**Given** a round's captures
**When** they are compared with the reference images and `docs/STYLE_GUIDE.md`
**Then** the three biggest problems are written down, most important first, and fixed, for at most 3 rounds, with before and after shown to the developer (PR14)

**Given** each spot in Levels 2 and 3
**When** it is checked for readability
**Then** hero, enemies, hazards and pickups stand out at a glance (NFR27); pits and deep water read as dark (NFR29, NR102); hazards contrast with the ground (NFR30); lines of sight are clear wherever aiming is taught (NFR31); and no spot needs a hint box to be understood (NFR26)

**Given** Emberwood's, the Drowned Mill's and Harrowmere's spots side by side
**When** their warmth is compared
**Then** Emberwood has the most warm light, the Drowned Mill almost none, and Harrowmere none but Rowan, his shots, the embers, the bells and the weapon pickups (NR100, NFR28)

**Given** the HUD over each new level's brightest and busiest spots
**When** it is checked
**Then** the hearts, the ember meter and the weapon timer stay as legible as Epic 3 judged them in Emberwood

**Given** the last round
**When** the developer reviews it
**Then** the developer approves the look of both levels as rendered in the engine

### Story 5.18: Playtest version one from start to finish

As a developer,
I want new players to play version one from the title gate to the end without help,
So that I know it takes 20 to 30 minutes, and every level is fair, readable and well paced, before release work starts.

**Requirements:** FR1, NFR17–NFR19, NFR22–NFR24, NFR47–NFR49, PR12, PR20, PR28, UX-DR74
**Depends on:** 3 to 5 first-time players from the primary audience (35–55, arcade-era players), found by the developer

**Acceptance Criteria:**

**Given** 3 to 5 first-time players from the primary audience
**When** each plays version one from the title gate, through the intro, Emberwood, the Drowned Mill and the warden, Harrowmere ruins, the held beat and the closing card, to the last results
**Then** each is watched without help, on the keyboard or gamepad they prefer (PR28)
**And** for each player the developer records the total time, each level's clear time from its results, the time between checkpoints, the respawns per level, and every spot where they got stuck

**Given** those records
**When** the exit criterion is checked
**Then** a majority of the players finish version one, each in 20 to 30 minutes, timed from passing the title gate to the Level 3 results, with story moments counted and pauses left out (NFR24, PR12)

**Given** each level's times
**When** they are compared with the targets
**Then** each level takes 6 to 8 minutes on a first play, plus 1 to 2 minutes of warden fight in Level 2 (NFR23); each checkpoint section takes 60 to 120 s, and no single failure costs more than about 120 s of replay (NFR17, NFR18); so the level lengths taken from Epic 1's pace hold up (PR20)
**And** the intensity rises across the three levels and peaks at the warden, judged from the respawns and the developer's notes (NFR22)

**Given** the respawns per level
**When** they are compared with the targets
**Then** first-play respawns stay within the Difficulty Curve targets †: 8 or fewer in Level 2, warden included, and 8 or fewer in Level 3 (NFR19)
**And** no player quits from frustration (NFR48)

**Given** the pillar measures
**When** they are checked
**Then** no player is stuck for more than 60 s at one spot without understanding what to do, ledge grab with no sign included, and no player asks what a button does after the first 2 minutes (NFR47)
**And** after the seal break, players mention the change in Rowan without being prompted (NFR49)
**And** each Harrowmere ending plays out as in Story 5.9, matching the "Marta finishes Harrowmere ruins" journey (UX-DR74)

**Given** a finding that misses a target
**When** it is fixed
**Then** every layout change re-runs `make test` (jump search, coverage and caps) and the critic loop on the changed spots; † numbers change only with the developer, and unmarked GDD numbers never change
**And** the missed measure is checked again with a new first-time player, or by the developer if the developer accepts that

**Given** the results meet the exit criterion
**When** the developer reviews them
**Then** the developer approves Epic 5's exit, and the results are written up for the epic's retrospective (PR12)

Note: "A new player finishes version one in 20 to 30 minutes" sets no pass mark across 3 to 5 players; this story reads it as a majority, each within 20 to 30 minutes.
Note: No document says how the 20 to 30 minutes are timed; this story times from passing the title gate to the Level 3 results, with story moments counted and pauses left out.

---

## Epic 6: Wrap and release

A player on itch.io gets the whole session: boot, title menu with Continue, level select with replays and the all-bells row, pause with restart and quit, settings, saving that survives a reload, safe failure everywhere, and the game live under its final title.

**In scope:**

- **Saving and settings:**
  - A versioned save in `localStorage` under `emberbound.save`, only through `app/save.ts` and `platform/storage.ts`. Written after each level and on every setting change; validated and migrated by version at boot; an in-memory store for the session when storage is refused, with the storage notice (D15).
  - The settings schema and defaults in `app/settings.ts`. A new save takes its reduced-motion default from `prefers-reduced-motion` (Q5). Reduced motion covers its full scope (D17).
- **Shared components:** `slider`, `toggle`, `confirm-dialog` and `notice-line` in `ui/components/`. `menu-item`, `panel` and `scrim` exist from Epic 1.
- **Session flow:**
  - Boot loading screen: the wordmark and a progress bar while shared assets load, with no text or tips (D8). It leads to the Epic 3 title gate, or to the device note.
  - Device note for phones and tablets, with "Try anyway" (Q3, D16).
  - Title menu after the gate: Continue, Level select (once Level 1 is finished), Settings. The first Continue of a new save plays the intro. Its notices: storage, audio locked, gamepad unavailable.
  - Level select: finished levels plus the next unlocked one, with best time and the union of bells found; the "All-bells card" row and rewatch once all 9 bells are found.
  - Replays: the replay-form rule, the replay loading-card skip (F10), story skips on replays only (D12), the all-bells card after a Level 1 or 2 replay's results, and the end-of-level routing to the level select.
  - The final results screen: stagger, two presses, "New best" (D11).
  - Pause menu: Resume, Restart level, Settings, Quit to level select ("Quit to title" before the level select unlocks, D9), with the one-step confirm dialog. It replaces Epic 1's placeholder pause.
  - Settings: music and effects volume, reduced motion, fullscreen with refusal snap-back and its notice (D10). Mute stays on M.
  - Error panels (DN-4): the bug panel with "Restart level", and the Retry panel for boot and level loads after one silent retry (Q8).
- **Tooling:** the `?perf=1` frame-time recorder and perf report, which ship in the release build; Playwright smoke checks against the production build (default X-B20).
- **Release:**
  - originality checks of the final title, the story names and the enemy working names; the Credits question (Q10)
  - the final title on screen, and the title backdrop (Epic 0 style, Epic 6 build)
  - the performance pass on the reference machines: frame time and loading
  - the itch.io page with credits from `docs/ASSETS.md`, and the release-measurement decision applied (PR27)
  - `make release` with butler, an HTML5 build within itch.io's limits
  - browser checks on a private itch.io upload before the public release: A1 to A3, storage partitioning, gamepad permission in the iframe, page scrolling, the 1280 × 720 embed with itch.io's fullscreen button (Q9)
  - the public release

**Out of scope:** the desktop and Steam build; touch controls; screen-reader support beyond native menu buttons (Q6); key remapping; cloud saves; a mute row in Settings; release analytics or any other network request, unless the PR27 decision brings them in through `gds-correct-course`; Levels 4 to 6.

**Depends on:** Epic 5 (version one plays start to finish from the bare title gate); the final title; the reference machines named; the release-measurement decision (PR27).

**Playable deliverable:** version one live on itch.io.

**Exit criteria:** performance targets met on the reference machines, the browser checks on the private itch.io upload behave as EXPERIENCE.md specifies, and the game released on itch.io under the final title.

### Story 6.1: Add the settings model and apply volumes and reduced motion

As a player,
I want my volume and motion settings to reach every part of the game, with reduced motion already on when my browser asks for it,
So that the game respects my comfort from the first frame.

**Requirements:** FR190 (the setting's scope), FR191, AR120, UX-DR89, UX-DR104, UX-DR107, X-B25

**Acceptance Criteria:**

**Given** `app/settings.ts` holds the settings schema (`musicVolume` and `effectsVolume` as integers 0 to 10, `reducedMotion` as a boolean) and its defaults
**When** the game starts with no stored settings
**Then** music and effects volume take the defaults in `app/settings.ts` (starting values 8 and 8 of 10 †, default X-B25)
**And** `reducedMotion` takes the browser's `prefers-reduced-motion`, read by `platform/device.ts` and passed in by `main.ts` (FR191, Q5); a failed read counts as no preference
**And** fullscreen and mute are not part of the schema (AR120, UX-DR107)

**Given** the app receives a `changeSetting` command
**When** it applies the change
**Then** a volume is clamped to a whole step from 0 to 10
**And** the next frame's `PresentationSettings` snapshot carries the new `musicVolume`, `effectsVolume` or `reducedMotion`
**And** the settings live in memory for the session; this story leaves storing them to Story 6.2

**Given** the volumes in the snapshot
**When** `audio/` reads them each frame
**Then** `musicVolume` sets the music bus gain, and `effectsVolume` sets the effects and ambience bus gains, through a mapping in `audio/mix.ts` where 0 is silent and 10 is the full mix level
**And** the M mute stays on the master bus, independent of both volumes
**And** the developer signs off by ear on the mapping and on the default volumes

**Given** `reducedMotion` is on
**When** the game runs
**Then** screen shake is off; full-screen flashes from `render/fx/flash.ts`, the seal-break ember flash included, become a short fade; the last heart does not pulse; a lost heart cracks without its icon shake (D17)
**And** hit-stop, the 9 Hz invulnerability blink, the weapon-timer warning blink, the bell toast and the results stagger are unchanged
**And** a change applies from the next frame, and every item holds whether an earlier epic already read `reducedMotion` or this story wires it

**Given** the defaults and the clamp
**When** `make test` runs
**Then** Vitest tests in `src/app/settings.test.ts` cover the defaults (imported from `app/settings.ts`, never repeated as literals), `reducedMotion` true and false from the browser preference, and the clamp
**And** the developer checks reduced motion in a development build with `prefers-reduced-motion: reduce` emulated in the browser's developer tools, on Level 1 and on the Level 2 seal break (reached through the debug URL parameters), before and after

Note: No source says which volume drives the ambience bus; this story puts ambience under the effects volume.
Note: No source gives the volume-to-gain curve; it is set in `audio/mix.ts` and judged by ear.

### Story 6.2: Build the versioned save with validation and an in-memory fallback

As a player,
I want my progress and settings stored safely in this browser, with the game still running when storage is refused or the save is damaged,
So that a browser setting or a broken save never stops me playing.

**Requirements:** FR185 (storage), FR186, FR187, AR114, AR115, AR117, AR118, AR119, AR121, AR237, NFR8, UX-DR104, UX-DR106, UX-DR107, X-B22

**Acceptance Criteria:**

**Given** `app/save.ts`
**When** it makes a fresh save
**Then** the save is `{ version: 1, progress: { unlockedLevel, introSeen: false, levels: {} }, settings }`, stored under the key `emberbound.save` (AR114, default X-B22)
**And** `unlockedLevel` holds the first level id in `content/levels.ts`, and `settings` holds the Story 6.1 defaults, the browser's reduced-motion preference included
**And** the schema holds nothing else: no mute, fullscreen, audio-locked or gamepad state (UX-DR107)

**Given** a stored save that passes validation
**When** the page boots
**Then** `loadSave` returns `{ ok: true }` with the stored data, and its settings apply from the first frame; a stored `reducedMotion` wins over the browser preference (AR115)
**And** writing a save and reading it back gives the same data
**And** saves are reached only through `app/save.ts`, and only `platform/storage.ts` touches `localStorage` (AR119, AR237), enforced by an ESLint rule outside `platform/`

**Given** stored data that is not JSON, has the wrong shape, or holds an invalid value: an unknown level id; a bell id not scoped to its level (`emberwood/bell-2`, AR121) or repeated; more bells than the level holds (the bells-per-level value in `CONFIG`); a `bestClearSteps` that is not a positive integer; a volume outside 0 to 10
**When** the save is read
**Then** `loadSave` returns `{ ok: false }`, the caller uses `freshSave()` and logs `log.warn('save', …)` (AR118)
**And** no notice is shown (UX-DR106), and the damaged data is replaced at the next write

**Given** a save whose `version` is missing or below 1
**When** the save is read
**Then** it counts as old: with no migration path to version 1 it falls back to a fresh save with a warning and no notice
**And** migration is a chain of steps keyed by version, applied in order and then validated, so a later schema adds one step; a Vitest test proves the chain with a test step

**Given** a save whose `version` is higher than the code's
**When** the save is read
**Then** the stored save is left untouched for the whole session and the session runs on an in-memory fresh save, as if storage were refused (default X-B22)

**Given** `platform/storage.ts` throws or is refused, on the first read or on any later write
**When** the save is read or written
**Then** the session switches to an in-memory store, logs one warning, and keeps running; every later read and write this session uses memory (AR117, FR187, NFR8)
**And** storage is reported as turned off in the `PresentationSettings` feature status, for the title notice in Story 6.7
**And** nothing is ever sent off the device (FR186)

**Given** a `changeSetting` command for music volume, effects volume or reduced motion
**When** the app applies it
**Then** the save is written at once with the new settings (AR115, UX-DR104)
**And** fullscreen and mute changes never write

**Given** a fake storage port
**When** `make test` runs
**Then** `src/app/save.test.ts` covers the fresh save, the round trip, each invalid case, an old save, a newer save, refusal on read, refusal on a later write, and settings writes

### Story 6.3: Save progress at the end of each level

As a player,
I want the game to remember which levels I finished, my best times and every bell I've found,
So that closing the tab never costs me a finished level.

**Requirements:** FR121, FR142, FR178, FR185, AR112, AR116, NR111, UX-DR105, X-B2, X-B3, X-B26

**Acceptance Criteria:**

**Given** a level completes (`levelCompleted`: Level 1 at its exit, Level 2 after the seal break, Level 3 after the held beat, before any card or results)
**When** the app handles it
**Then** the save is written at once (FR185, AR112) with that level's entry: `bestClearSteps` is this run's clear steps on the level's first finish, and the lower of the stored and this run's afterwards
**And** `bellsFound` becomes the union of the stored bells and this run's (FR121, AR116)
**And** `unlockedLevel` moves to the next level in `content/levels.ts` order when that is further on, so levels unlock in order (FR142, NR111)

**Given** the first time Emberwood completes
**When** the save is written
**Then** `introSeen` becomes true in that same write and never earlier (default X-B26)

**Given** a run that is quit, restarted, or ended by a reload or a closed tab
**When** the session continues or the page loads again
**Then** nothing from that run is written, and its bells don't count (default X-B3)
**And** bells already in the union are still placed in the level and count toward this run's total when taken again
**And** a settings write during a level carries the progress of completed levels only (FR178: no mid-level save)

**Given** the save
**When** the app needs any of these values
**Then** it derives them and never stores them: the finished set (levels with an entry); first play or replay (a level is a replay when it is in the finished set as it loads, and a restarted or quit first attempt stays a first play, default X-B2); the next unfinished level; whether everything is finished; whether the level select is unlocked (Emberwood finished); whether the all-bells card is unlocked (every level's union holds all its bells, 9 in version one, AR116)
**And** the counts come from `CONFIG` and `content/levels.ts`, never a literal 9

**Given** the progress the app kept in memory through Epics 3 to 5
**When** this story lands
**Then** it comes from the save instead, and a session on the in-memory store behaves the same until the tab closes

**Given** the rules above
**When** `make test` runs
**Then** Vitest tests in `src/app/` cover each write rule and each derived value: a first finish, a slower and a faster replay, a quit run, a restart, the Level 1 end write of `introSeen`, the ninth bell

**Given** a development build
**When** the developer finishes Emberwood and reloads the page
**Then** the browser's storage panel shows Emberwood finished with its best time, its bells and `introSeen` true
**And** with site storage blocked in the browser, the same run completes and nothing is stored

### Story 6.4: Build the slider, toggle, confirm dialog and notice line

As a developer,
I want the remaining shared components built once from the DESIGN.md tokens,
So that settings, pause and the title menu share one look and one behaviour.

**Requirements:** UX-DR26, UX-DR27, UX-DR28, UX-DR35, UX-DR91

**Acceptance Criteria:**

**Given** `ui/components/slider.ts`
**When** it renders
**Then** it shows its label left in `ui-md`, a thin `border-subtle` track with a `text-muted` fill, a round `text-primary` thumb (`rounded.full`), and the value right as an integer 0 to 10 in `numeric-md` (UX-DR26)
**And** it reports left and right presses, and a click or drag on the track mapped to one of its 11 steps
**And** when focused it shows the ring around the whole row

**Given** `ui/components/toggle.ts`
**When** it renders
**Then** it shows its label left and the state text "On" or "Off" right, beside a switch whose knob position shows the state; the track is `border-subtle` when off and `text-muted` when on; the knob is `text-primary` (UX-DR27)
**And** confirm or a click flips it, and the state text always matches the knob
**And** when focused it shows the ring around the whole row

**Given** `ui/components/confirmDialog.ts`
**When** it opens over a `panel`
**Then** it is a smaller panel stacked one level deep, above its panel and below `error-panel`, with one prompt line in `ui-lg` and two stacked `menu-item`s: the action, then "Cancel" (UX-DR28)
**And** "Cancel" is focused on open, and Back reports Cancel

**Given** `ui/components/noticeLine.ts`
**When** a screen shows a notice
**Then** it is one static line in `ui-md` `text-muted`, under the menu it belongs to, only on a panel or on `surface-screen`, with no icon, colour coding or dismiss (UX-DR35)

**Given** the four components
**When** they are built
**Then** each lives in its own file with `ui-` CSS classes, reads colours and type only through the token properties, and sizes everything as a multiple of `--tile`
**And** each interactive row is a native button, so its label is exposed (UX-DR91)
**And** hover moves focus, a click confirms, focus changes and activations play through `playUiSound`, and each fades over `panelFadeSeconds`, never sliding

**Given** the look-dev page
**When** it shows each component in every state (slider at 0, 5 and 10, at rest and focused; toggle off, on and focused; the confirm dialog over a panel; a notice line on a panel and on `surface-screen`) at 1280 × 720 and 1920 × 1080
**Then** the DESIGN.md contrast targets still hold on the Epic 0 values, including the slider fill at 3:1 or more on its track and text at 4.5:1 or more

**Given** the look-dev captures
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, and the developer sees before and after

### Story 6.5: Show the boot loading screen

As a player,
I want a quiet loading screen with the wordmark and a filling bar while the game loads,
So that I know it's working and nothing distracts me.

**Requirements:** FR170, AR102, AR218 (harness), AR233, UX-DR34, UX-DR44, UX-DR63, X-B20

**Acceptance Criteria:**

**Given** the page opens
**When** shared assets start loading
**Then** the boot surface shows a `surface-screen` ground, the wordmark centred in the upper third in `display-xl`, and below it the `boot-loading-bar`: `bar-long` long, `{spacing.1}` thick, a `text-muted` fill in `hud-track` (FR170, UX-DR34)
**And** there is no other text, percentage or tip (D8), and the cursor is visible

**Given** the shared-asset progress the `AssetLoader` port reports into app state (Story 1.3; sprint change proposal 2026-11-13, A1)
**When** assets arrive
**Then** the bar fills by length in step with it, never moves backward, and is full when loading is done

**Given** boot is running
**When** a key, click or gamepad button is pressed
**Then** nothing happens, and the press does not carry over to the title gate

**Given** shared loading is done
**When** the bar is full
**Then** the boot screen fades out over `bootFadeSeconds` (starting value 0.3 †) to the title gate (AR102, UX-DR63)
**And** the developer signs off on the fade
**And** this story leaves a failed boot load to the Retry panel in Story 6.14

**Given** `tests/e2e/smoke.spec.ts`, created in story 0.1 and extended in 1.11, running against the production build served by `make preview` with real key presses, in headless Chromium and Firefox (default X-B20, AR233)
**When** `make smoke` runs
**Then** a new check passes: the page shows boot, then the gate, with no console errors (AR218, boot part)

**Given** captures of the boot screen mid-load (shared-asset responses held back by the harness) at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, and the developer sees before and after

### Story 6.6: Show the device note on phones and tablets

As a player on a phone or tablet,
I want a plain note that the game is made for desktop, with a way to try anyway,
So that I'm not left at a gate I can't use, and a tablet with a keyboard can still play.

**Requirements:** FR184, NFR15, AR102, AR234 (device note), UX-DR37, UX-DR45, UX-DR63, X-B24

**Acceptance Criteria:**

**Given** `platform/device.ts`
**When** boot finishes
**Then** the device counts as a phone or tablet only when the primary pointer is coarse and no fine pointer exists anywhere, checked with `matchMedia` (Q3)
**And** a touchscreen laptop with a mouse or trackpad gets the title gate
**And** if `matchMedia` throws, the device counts as a desktop

**Given** a phone or tablet
**When** the boot screen fades out
**Then** the device note shows instead of the gate: a `surface-screen` ground, the wordmark, "Best played on desktop with keyboard or gamepad." in `ui-lg`, and "Try anyway" as an underlined link in `ui-md`, with the focus ring when focused (UX-DR37, AR102)

**Given** the device note
**When** the player clicks or taps "Try anyway", or presses Enter, Space (default X-B24) or gamepad south
**Then** the title gate shows (D16, UX-DR45, UX-DR63)
**And** no other input does anything

**Given** the routing and the screen
**When** the tests run
**Then** a Vitest app test sends boot to the device note or to the gate from an injected detection result
**And** a smoke check in an emulated touch-device context shows the note and reaches the gate with Enter; if Playwright's emulation does not set the pointer media features, an init script stubs `matchMedia`

**Given** captures of the device note in a phone portrait viewport, a tablet landscape viewport and at 1280 × 720
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, the text floors hold, and the developer sees before and after

### Story 6.7: Add the title menu with Continue, the intro on a new save, and its notices

As a player,
I want a title menu after the gate where Continue always takes me to the right place,
So that a new save starts with the story and a returning session picks up where I left off.

**Requirements:** FR36 (title menu), FR158, FR172, FR173, FR187, AR102, AR103, UX-DR35, UX-DR47, UX-DR64, UX-DR72, UX-DR106, UX-DR107, X-B22, X-B26

**Acceptance Criteria:**

**Given** the Epic 3 title gate
**When** the player passes it
**Then** the title menu opens instead of the intro (AR102, AR103): a `panel` on the title ground with "Continue" focused
**And** the gate shows once per session; later returns to the title go straight to the menu
**And** Back does nothing on the title menu (UX-DR47)
**And** this story leaves the "Level select" item to Story 6.8 and the "Settings" item to Story 6.13; nothing locked or disabled is listed

**Given** a new save (`introSeen` false)
**When** the player confirms "Continue"
**Then** the five intro cards play, still skippable with Back after the card minimum, then the Emberwood loading card (FR158, UX-DR64)
**And** a player who quit their first Emberwood play sees the intro again on Continue and can skip it (default X-B26)

**Given** a save with at least one finished level
**When** the player confirms "Continue"
**Then** the next unfinished level's loading card opens (FR173)
**And** this story leaves the everything-finished case to Story 6.8

**Given** storage was refused or failed this session, or a save newer than the code was found (default X-B22)
**When** the title menu shows
**Then** "Progress won't be saved this session." shows as a `notice-line` under the menu for the rest of the session (FR187, D15)
**And** a corrupt or old save shows no notice (UX-DR106)

**Given** the gate was passed with a gamepad and audio is still locked
**When** the title menu shows
**Then** "Click or press a key for sound" shows under the menu until the first key press or click unlocks audio, then goes at once (A1, UX-DR72)
**And** if creating or resuming audio failed, no notice shows (Q7)

**Given** the gamepad was turned off after an error this session
**When** the title menu shows
**Then** "Gamepad unavailable. Keyboard still works." shows under the menu until the session ends (FR36, X-A13)
**And** when several notices apply, each has its own line; none is ever saved (UX-DR107)

**Given** the rules above
**When** the tests run
**Then** Vitest app tests cover each Continue target and each notice condition
**And** a smoke check on a clean profile goes from the gate to the title menu, then Continue to the first intro card

**Given** captures of the title menu on a new save, after Level 1, and with all three notices, at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, and the developer sees before and after

Note: The order of several notices is not specified; this story uses the Voice and Tone table's order (storage, audio, gamepad).
Note: decided by the developer on 2026-11-13: the title menu keeps the wordmark in the upper third, above its items; DESIGN.md records it through Epic 0's update (X-C6, story 0.14).

### Story 6.8: Add the level select with best times, bells and the all-bells row

As a player,
I want a level select showing each finished level's best time and bells, and the all-bells card once I've earned it,
So that I can replay any level, hunt the bells I missed and watch the memory again.

**Requirements:** FR121, FR172, FR173, FR174, FR175, NR50, NR111, AR110, UX-DR30, UX-DR57, UX-DR58, UX-DR66, UX-DR105, X-B2

**Acceptance Criteria:**

**Given** Emberwood is finished
**When** the title menu shows
**Then** "Level select" appears directly after "Continue" (FR172); before Emberwood is finished it is not listed
**And** once every level is finished, "Continue" opens the level select (FR173)

**Given** the level select opens
**When** it lists the levels
**Then** it shows, in `content/levels.ts` order, one `level-select-row` per finished level plus the next unlocked one (FR174): the name from `content/levels.ts` ("Emberwood", "The Drowned Mill", "Harrowmere ruins") in `ui-lg`; the best time in `m:ss.s` from `bestClearSteps` (`numeric-md`, `text-muted`); three bell slots, filled in `text-primary` for each bell in the union across all runs and outlined in `text-muted` for the rest (FR121, UX-DR30)
**And** an unlocked level that was never finished shows "–" and three outlined bells
**And** the rows sit in a `panel` on the title ground, followed by "Back", each group `{spacing.5}` apart (UX-DR58)

**Given** the level select opens
**When** focus is placed
**Then** it starts on the next unlocked level, or on the first row when everything is finished; arriving from a level's results it starts on that level (this story builds the rule; Story 6.10 routes results here) (UX-DR58)
**And** exactly one item is focused, the list wraps, and hold-to-repeat works

**Given** a level row is focused
**When** the player confirms
**Then** that level's loading card opens and the level plays
**And** a finished level starts as a replay and the next unlocked level as a first play (default X-B2)
**And** this story leaves the replay behaviour (form, skips, end routing) to Stories 6.9 and 6.10

**Given** every level's union holds all its bells (9, derived, AR110)
**When** the level select opens
**Then** a label-only "All-bells card" row sits after the level rows and before "Back"
**And** confirming it plays the all-bells card with the card input rules (the ~1.5 s minimum, a press must begin on the card, confirm advances, Back skips), then returns to the level select with focus on that row (FR175, NR50, UX-DR57, UX-DR66)
**And** with fewer than 9 bells the row is not listed (NR111)

**Given** the level select
**When** the player presses Back (the "Back" row, Esc, Backspace or gamepad east)
**Then** the title menu shows with focus on the item that opened the level select ("Level select", or "Continue" when everything is finished)

**Given** the rules above
**When** the tests run
**Then** Vitest app tests cover the row list, every focus rule and the all-bells row condition (UX-DR105)
**And** smoke checks with seeded saves cover a save with 8 of 9 bells (no row) and one with 9 of 9 (row, rewatch, return)

**Given** captures of the level select matching `key-level-select` frames A and B, at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md, `docs/STYLE_GUIDE.md` and the mock (the spines win on conflict) and fixes them, and the developer sees before and after

Note: UX-DR30 says a row "starts that level as a replay"; under X-B2 the next unlocked, unfinished level is a first play, and this story follows X-B2.
Note: Focus after Back from the level select, and after a rewatch, is not specified; this story returns it to the item that opened the level select or the card, as UX-DR77 does for settings and the confirm dialog.

### Story 6.9: Start replays with the replay form and the replay skips

As a player,
I want a replay to give me Rowan as he was on first arrival and let me skip what I've already seen,
So that replaying a level for bells or time is quick and still makes sense.

**Requirements:** FR111 (replays), FR159 (replay skip), NR54, NR55, AR104, UX-DR32 (replay skip), UX-DR56, UX-DR57, UX-DR65, UX-DR90, X-B2, X-B24

**Acceptance Criteria:**

**Given** a level starts from the title menu, the level select or the results
**When** the app creates the `World`
**Then** `params.form` comes from `levelForm` (default X-B17) and `params.isStorySkippable` is true exactly when the level is a replay (default X-B2)
**And** an Emberwood or Drowned Mill replay after the seal break runs Rowan as the full beast without ledge grab, and a Harrowmere ruins replay runs him changed, with ledge grab; the ability always matches the body (FR111)
**And** Vitest app tests assert the params for each level, first play and replay

**Given** a replay's loading card
**When** loading is done
**Then** the advance hint (the confirm glyph for the last-used device) fades in over `advanceHintFadeSeconds`, placed as DESIGN.md specifies since the Epic 0 update (story 0.14, X-C6)
**And** a confirm (Enter, Space, gamepad south, or a click, default X-B24) skips the rest of the reading floor and play starts (FR159, AR104, UX-DR32)
**And** the card shows the same level name and line as on a first play (F10)

**Given** a replay's loading card before loading is done, or any first play's loading card
**When** the player presses confirm
**Then** nothing happens and the press is not kept for later; on a first play the reading floor always holds
**And** the press that chose the level never counts as the skip (the card guard)
**And** Back, Esc, P and Start are ignored (default X-B24, M5), M still mutes, and the card still advances by itself (UX-DR90)

**Given** a replay
**When** the player presses jump or confirm during the seal break or the held beat
**Then** the moment ends at once with its remaining cues applied, and the level end follows (NR55)
**And** on a first play the same presses do nothing

**Given** a Level 3 replay
**When** the closing card or the all-bells card shows
**Then** after the ~1.5 s minimum, Back skips the rest of the sequence and confirm advances (D12, NR54, UX-DR56, UX-DR57)
**And** on a first play Back does nothing on those cards
**And** the intro stays skippable on every play

**Given** the skip rules
**When** the tests run
**Then** Vitest app tests cover the loading-card and card skip rules for first plays and replays
**And** a smoke check with a seeded save (Emberwood finished) goes from the level select to Emberwood's loading card and starts play with confirm once the hint shows, before the reading floor ends

**Given** captures of a replay's loading card with the keyboard hint and with the gamepad hint, at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, and the developer sees before and after
**And** the developer plays steps 2 and 4 of the Ines journey in the browser and signs off

Note: No source says whether a confirm pressed before loading is done should count later; this story drops it, matching the hint not being shown yet.

### Story 6.10: Route the end of a replay and play the all-bells card after the ninth bell

As a player,
I want replays to return me to the level select, and the all-bells card to play right after I find the ninth bell,
So that the reward lands when I earn it and I'm back where I can pick the next level.

**Requirements:** FR179 (replays), FR183 (replays), NR52, NR53 (replays), NR54, AR108, AR109, UX-DR55, UX-DR57, UX-DR64, UX-DR65, X-B30

**Acceptance Criteria:**

**Given** a Level 1 or Level 2 replay ends (Level 2 after its seal break)
**When** the player continues from the results
**Then** the level select opens with focus on the level just played (FR179, NR52, UX-DR65)

**Given** a Level 1 or Level 2 replay whose level-end save unlocked the all-bells card for the first time (the ninth bell)
**When** the player continues from the results
**Then** the all-bells card plays, skippable with Back (default X-B30), then the level select opens with focus on the level just played (FR183, AR108, UX-DR57)

**Given** a Level 1 or Level 2 replay that ends with fewer than 9 bells, or with all 9 already found before the run
**When** the player continues from the results
**Then** no card plays and the level select opens with focus on the level just played

**Given** a Level 3 replay
**When** Rowan reaches the fallen fire bell
**Then** the order is the held beat, the closing card, the all-bells card if all 9 bells are found by then (this run's included), then the results over the dimmed last card scene, then the level select with focus on Harrowmere ruins (NR53, NR54, AR109)
**And** each moment and card can be skipped as Story 6.9 set

**Given** a Level 3 first play
**When** the player continues from the results
**Then** the title menu opens, ending the Epic 5 return to the gate (X-B23), and "Continue" there opens the level select (AR109, UX-DR64)

**Given** a first play of Level 1 or Level 2, including one started from the level select's next-unlocked row
**When** the player continues from the results
**Then** the next level's loading card opens, as in Epic 5 (FR179, UX-DR55)

**Given** the routes above
**When** the tests run
**Then** Vitest app tests cover each route, including the ninth bell found on a replay, 9 bells already found before it, and fewer than 9
**And** the developer plays the routing steps of the Ines journey (steps 1–2, 4–5 and 7–8) and its 2 of 3 failure path on a seeded save and signs off; this story leaves the full walk to Story 6.16 (readiness proposal 2026-11-13, D6)

### Story 6.11: Finish the results screen with the stagger and "New best"

As a player,
I want my results to arrive in a short stagger and to be told plainly when I beat my best,
So that the end of a level feels earned and a fast replay is recognised.

**Requirements:** FR181 (final), FR182, UX-DR29, UX-DR55, UX-DR79, UX-DR90, UX-DR92, X-B24

**Acceptance Criteria:**

**Given** a level ends
**When** the results show
**Then** the rows read, in this order, "Clear time" (`m:ss.s`), "Bells" ("x of 3"), "Respawns" (a number) and "Embers" ("x of" the level total), then "Continue" (FR181)
**And** each label is left in `ui-md` `text-muted` and each value right in `numeric-lg` `text-primary` with tabular figures, every value on one right edge, rows `{spacing.3}` apart and `{spacing.5}` before "Continue" (UX-DR29)
**And** the panel sits over the scrim, which dims the world, or the last card scene after Level 3 (UX-DR55)

**Given** the results open
**When** the stagger runs
**Then** the rows start hidden and appear one after another, the whole stagger taking `resultsStaggerSeconds` (starting value 0.6 †, never above 0.6 s, D11), by fading only
**And** reduced motion leaves the stagger unchanged
**And** the developer signs off on the feel

**Given** the stagger is running
**When** the player presses confirm
**Then** every row shows at once and the screen stays
**And** the next confirm, on "Continue", leaves (UX-DR79)
**And** Back is ignored (default X-B24), and the results never advance by themselves (UX-DR90)

**Given** a replay whose clear steps are lower than the best stored before this run
**When** the results show
**Then** a "New best" tag sits directly after the "Clear time" label, in `ui-sm`, `surface-panel` text on `text-primary`, `rounded.sm`, and the value keeps the right edge (FR182)
**And** the tag never shows on a first play (a level first played from the level select included) or on an equal time
**And** the level-end save already written does not change the comparison

**Given** any results
**When** "Respawns" shows
**Then** it looks like every other row, with no comment, colour or icon (UX-DR92)

**Given** the rules above
**When** `make test` runs
**Then** Vitest app tests cover "New best" for a first play and for a slower, an equal and a faster replay, and the two-press state

**Given** captures of an Emberwood first play and a replay with "New best" matching `key-results` frames A and B, plus Level 3 results over the dimmed card scene, at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md, `docs/STYLE_GUIDE.md` and the mock (the spines win: the tag goes after the label) and fixes them, the tag keeps 4.5:1 contrast or more, and the developer sees before and after

### Story 6.12: Build the pause menu with Restart and Quit behind a confirm

As a player,
I want to restart or leave a level from the pause menu, with one confirmation so a slip never costs me,
So that I can start over or stop without losing anything by accident.

**Requirements:** FR36 (pause menu), FR176, FR177, FR178, AR105, AR106, AR112, AR218 (pause and restart confirm), UX-DR28, UX-DR35, UX-DR52, UX-DR54, UX-DR62, UX-DR67, UX-DR68, UX-DR79

**Acceptance Criteria:**

**Given** play is running
**When** the player presses Esc, P or Start, or any auto-pause trigger fires
**Then** the pause menu replaces Epic 1's placeholder: over the scrim, "Resume" focused, then "Restart level", then "Quit to level select", or "Quit to title" while Emberwood is not yet finished (FR176, D9, UX-DR52, UX-DR68)
**And** Back resumes; the HUD stays under the scrim and the mute indicator above it
**And** this story leaves the "Settings" item, between "Restart level" and the quit item, to Story 6.13

**Given** the gamepad was turned off after an error this session
**When** the pause menu shows
**Then** "Gamepad unavailable. Keyboard still works." shows as a `notice-line` under the menu until the session ends (FR36, X-A13, Q7)

**Given** the pause menu
**When** the player confirms "Restart level"
**Then** the confirm dialog opens over the pause panel, one level deep (UX-DR62): "Restart level? You'll go back to the start." with "Restart" and "Cancel", "Cancel" focused (FR177, UX-DR54)
**And** "Cancel", Back or Esc returns to the pause menu with focus on "Restart level"

**Given** the restart dialog
**When** the player confirms "Restart"
**Then** the screen fades out, the level is recreated at its start with run stats reset (clear time, respawns, embers, this run's bells, the weapon), and it fades in to play with no loading card, over `restartFadeSeconds` (starting value 0.3 †) (AR106, UX-DR67)
**And** a first play stays a first play and a replay stays a replay (default X-B2); nothing is written to the save
**And** the developer signs off on the fade

**Given** the pause menu
**When** the player confirms the quit item
**Then** the confirm dialog shows "Quit this level? You'll start it from the beginning next time." with "Quit" and "Cancel", "Cancel" focused
**And** "Quit" goes to the level select (with its default focus) or, before the level select unlocks, to the title menu (AR106, UX-DR67)
**And** nothing from the run is saved, and the next start of that level begins at its start behind its loading card (FR178, AR112, X-B3)

**Given** a pause opened during the seal break, the held beat, the death sequence or the pit fade
**When** the player picks "Restart level" or the quit item
**Then** both behave as above
**And** an auto-pause trigger while the dialog is open only clears held input (AR105)

**Given** the rules above
**When** the tests run
**Then** Vitest app tests cover opening (by key and by each auto-pause trigger), the quit label, dialog focus, Cancel and Back, Restart, and both Quit routes
**And** a smoke check goes from Emberwood play, Esc, "Restart level", the dialog with "Cancel" focused, then "Cancel" back to the pause menu (AR218)

**Given** captures of the pause menu in play, with the gamepad notice, and with each dialog open, at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, and the developer sees before and after

### Story 6.13: Build the settings screen with volumes, reduced motion and fullscreen

As a player,
I want a settings screen reachable from the title and from pause, where each change applies at once,
So that I can set sound and motion to suit me, or go fullscreen, without losing my place.

**Requirements:** FR188, FR190 (the setting), FR193 (fullscreen), AR105, AR120, NFR8, UX-DR26, UX-DR27, UX-DR35, UX-DR53, UX-DR62, UX-DR71, UX-DR89, UX-DR96

**Acceptance Criteria:**

**Given** the title menu or the pause menu
**When** it shows
**Then** "Settings" is the title menu's last item, and sits between "Restart level" and the quit item on the pause menu
**And** confirming it opens Settings: "Music volume" and "Effects volume" (sliders), "Reduced motion" and "Fullscreen" (toggles), and "Back", with "Music volume" focused (FR188, UX-DR53)
**And** from the title it sits on the title ground; from pause it replaces the pause panel over the same scrim, so nothing is more than two steps from play (UX-DR62)
**And** there is no mute row, and M still mutes here (D10)

**Given** Settings
**When** the player presses Back (the "Back" row, Esc, Backspace or gamepad east)
**Then** the opener returns with focus on its "Settings" item (UX-DR71)
**And** when opened from pause, Esc is Back, not resume

**Given** a slider is focused
**When** the player presses left or right (arrows, A/D, d-pad or stick), or clicks or drags its track
**Then** the value moves one step within 0 to 10, and a held direction repeats after `menuRepeatDelaySeconds` at the `menuRepeatIntervalSeconds` rate (UX-DR26)
**And** each change sends `changeSetting`, is heard at once and is saved at once (FR188)
**And** holding left on "Music volume" from 8 steps down after 0.4 s at 8 per second and stops where the key is released (the Marta journey)

**Given** "Reduced motion" is focused
**When** the player confirms or clicks it
**Then** it flips between "On" and "Off", applies from the next frame with the Story 6.1 scope, and is saved at once (FR190, UX-DR89)

**Given** "Fullscreen"
**When** Settings shows, or the browser enters or leaves fullscreen
**Then** the toggle shows the real browser state from `platform/fullscreen.ts`, including "Off" after the player leaves fullscreen with Esc or the browser's own controls (UX-DR27)
**And** confirm or a click requests or leaves fullscreen; the state is never saved (FR193, AR120)
**And** `--tile` recomputes, and leaving fullscreen during play still auto-pauses as in Epic 1

**Given** a fullscreen request that is refused or fails
**When** the toggle is used
**Then** it snaps back, and "Fullscreen isn't available here." shows as a `notice-line` under the settings menu until Settings closes (D10, UX-DR35, UX-DR96)
**And** a refusal for lack of user activation, such as a toggle from a gamepad (A1), is not a failure: the next key press or click can try again (AR199)
**And** an API that throws turns fullscreen off for the session with one warning; every later attempt snaps back with the notice (NFR8)

**Given** the rules above
**When** the tests run
**Then** Vitest app tests cover opening from both menus, Back with focus return, Esc as Back from pause, slider steps, clamp and repeat, the reduced-motion toggle, and with a fake fullscreen port: the mirrored state, the snap-back and the notice's lifetime
**And** smoke checks open Settings from the title, change "Music volume" and go Back with "Settings" focused, and, with the fullscreen request stubbed to refuse, see the snap-back and the notice

**Given** captures of Settings from the title and from pause, with the fullscreen notice, at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, and the developer sees before and after
**And** the developer checks the fullscreen toggle in Chrome, Edge and Firefox and signs off

### Story 6.14: Show the bug panel and the Retry panel

As a player,
I want a plain way back into the game when something breaks or fails to load,
So that a bug or a dropped connection never leaves me on a dead screen.

**Requirements:** AR201, NFR8, UX-DR36, UX-DR44 (load failure), UX-DR59, UX-DR60, UX-DR73

**Acceptance Criteria:**

**Given** a release build and a level running
**When** the frame loop's catch (Epic 1) handles a bug
**Then** a `scrim` and the bug `error-panel` show topmost: "Something went wrong" in `ui-lg` and "Restart level" focused, with no technical text (UX-DR36, UX-DR59)
**And** the frame loop keeps running, and the mute indicator stays above the panel
**And** a bug that repeats every frame shows one panel and logs one error

**Given** the bug panel
**When** the player confirms "Restart level"
**Then** the level restarts by the same path as the confirm dialog's "Restart": fade out, level recreated, run stats reset, no loading card, fade in to play
**And** a first play stays a first play and a replay stays a replay

**Given** a development build
**When** a bug happens
**Then** it still fails loudly with the error in the debug overlay
**And** a development cheat dispatches the same app command the catch sends, so the panel can be seen and captured

**Given** an asset fetch fails at boot or behind a loading card, or a level file fails `parseLevel`
**When** the load reports the failure
**Then** the load is retried once silently, with `log.warn('assets', …)`, and if that succeeds the player sees nothing (AR201)

**Given** the silent retry also fails
**When** the second failure arrives
**Then** a `scrim` and the Retry `error-panel` show over the boot screen or the loading card: "Couldn't load the level." for a level load, or the boot-failure line set in story 0.14 (X-C6) for a boot load, and "Retry" focused (UX-DR60)
**And** "Retry" repeats the whole load, boot (back to boot loading) or level (back to its loading card), as often as it is pressed, and the line never changes (Q8, UX-DR73)

**Given** the rules above
**When** the tests run
**Then** Vitest app tests cover the error states, the restart, the retry routing and repeated retries
**And** smoke checks on the production build abort asset requests through Playwright routing: one failure gives a silent retry and no panel; two failures give the Retry panel; with routing restored, "Retry" completes the load, for boot and for a level

**Given** captures of both panels at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against DESIGN.md and `docs/STYLE_GUIDE.md` and fixes them, and the developer sees before and after

Note: A bug caught while no level is running (title menu, level select) has no specified handling; suggested default for the developer: the same panel, with its item returning to the title menu.
Note: Back on an error panel is not specified; it does nothing, since each panel has one item and nowhere to go back to.
Note: This story treats a level file that fails `parseLevel` like a failed fetch (both are expected load failures, AR197).

### Story 6.15: Add the `?perf=1` frame-time recorder and perf report

As a developer,
I want a frame-time recorder that ships in the release build,
So that the performance pass measures the real game on real hardware.

**Requirements:** AR214, AR227 (frame and load times)

**Acceptance Criteria:**

**Given** the page is opened with `?perf=1`, in any build, release included
**When** the game runs
**Then** `app/perf.ts` records the time of every frame (from the `requestAnimationFrame` timestamps) while the app is playing, story moments included and pause, menus and cards left out
**And** it splits the record into segments, starting a new one at each `checkpointReached` and at each `arenaEntered`, each kept as a start index into the one buffer, so the warden fight and each stretch between checkpoints can be measured on their own; a Vitest test proves the split on a recorded event sequence (readiness proposal 2026-11-13, Q12)
**And** it records each level's load time, from the start of the load to the end, not counting the reading floor

**Given** recording is on
**When** a level ends
**Then** `ui/screens/perfReport.ts` shows the level, the frame count, the median and the 99th-percentile frame time in milliseconds for the whole level and for each segment, named by the event that started it (readiness proposal 2026-11-13, Q12), and the load time, in a corner beside the results, built from the shared components and tokens

**Given** the recorder
**When** it runs, or the parameter is absent
**Then** without `?perf=1` nothing records or shows
**And** with it, the recorder only reads timestamps, allocates its buffer once, and never touches the simulation or the app state

**Given** known samples (odd and even counts, one sample, none)
**When** `make test` runs
**Then** Vitest tests prove the median and the 99th percentile

**Given** `make build` served by `make preview`
**When** the developer opens it with `?perf=1`
**Then** the recorder and the report work, and the development tools (F1 overlay, URL level parameters, cheats) are absent

**Given** a capture of the results with the report showing
**When** one critic-loop round runs
**Then** the report is readable and leaves the results panel clear

Note: When and where the report shows, and which frames count, are not specified; this story records playing frames only and shows the report at each level's end, beside the results.

### Story 6.16: Complete the smoke checks and walk the four journeys

As a developer,
I want the browser smoke checks complete on the production build and the four UX journeys walked end to end,
So that the whole session is proven before the release work starts.

**Requirements:** AR218, AR233, AR234, AR235, AR236, NFR8, NFR12, UX-DR74, UX-DR94, UX-DR98, X-B20

**Acceptance Criteria:**

**Given** the production build served by `make preview` and driven by real key presses (default X-B20)
**When** `make smoke` runs in headless Chromium and Firefox
**Then** it passes boot, the title gate, the title menu, Continue into the Emberwood loading card and play, pause, and the restart confirm, with no console errors anywhere on the path (AR218, AR233, AR234)

**Given** an init script that makes every gamepad read throw
**When** the smoke check runs
**Then** the gamepad is off for the session, the game keeps rendering and responding to the keyboard, and the gamepad notice shows on the title and pause menus (AR235, NFR8, UX-DR98)

**Given** an init script that makes `localStorage` throw
**When** the smoke check runs
**Then** the game boots and plays on the in-memory save, and the storage notice shows on the title menu (AR218, AR235)

**Given** the full smoke run
**When** every request is recorded
**Then** every request goes to the page's own origin (AR236)

**Given** the checks added in Stories 6.5 to 6.14
**When** `make smoke` and `make check` run
**Then** all of them pass together in both browsers (NFR12, UX-DR94)

**Given** the production build in Chrome
**When** the developer plays the four journeys in EXPERIENCE.md Key Flows, failure paths included (Marta finishes Emberwood, with the alt-tab auto-pause; Tomás beats the warden on a gamepad, with the gamepad gate, the audio notice and the phase-2 death; Marta finishes Harrowmere ruins, with the settings detour, reduced motion, the held beat, the closing card, the results and the title; Ines finds her ninth bell, and the 2 of 3 failure path), starting from seeded saves where a journey needs one
**Then** every step behaves as EXPERIENCE.md describes (its numbers are illustrative) (UX-DR74)
**And** each deviation is fixed or raised with the developer

### Story 6.17: Check the final title, the story names and the credit requirements

As a developer,
I want the final title, the story names and every asset licence checked before anything goes public,
So that the release never collides with another game, a trademark or a licence term.

**Requirements:** FR192, NR117, NFR39, NFR41, NFR42, PR32, PR34
**Depends on:** the developer's final-title candidates

**Acceptance Criteria:**

**Given** the developer's final-title candidates
**When** each is searched in game stores and databases (itch.io and Steam at least) and in trademark registers (for example the USPTO, EUIPO and WIPO databases)
**Then** the findings are recorded with their sources and the date, marked as not legal advice
**And** "Emberbound" is not a candidate, since at least six games use it (NFR42)
**And** the developer picks and approves the final title

**Given** the story names: Rowan Ashby, Elin, Lord Maldrek, Harrowmere, Emberwood, Cindersworn, the Tithe, the Ember Below, Emberfire, the Drowned Mill, the Drowned Miller, Tobin Weir, Bellspire Pass, the Tithe Road, the Hollow Court
**When** each is checked the same way
**Then** the findings are recorded (NR117, NFR39); Tobin Weir is checked although it is not on screen, so both lists are satisfied

**Given** a title candidate or a story name that collides with an existing game or a registered mark
**When** it is reported to the developer with the evidence
**Then** the developer decides
**And** a story-name change goes through `gds-correct-course`, since the narrative design owns story text (PR3); this story never edits `content/storyText.ts`, `content/levels.ts` or any on-screen term directly

**Given** the enemy working names "grub", "burr-wing" and "pod"
**When** every on-screen string, the story text and the credits are searched
**Then** none of them appears anywhere a player sees; if one does, it is checked like the story names (NFR41)

**Given** `docs/ASSETS.md` lists every asset and tool with its licence, commercial-use terms and AI flag, those added in this epic included
**When** each licence is read for an in-game credit requirement
**Then** the answer is recorded in `docs/ASSETS.md`, which settles the Credits question (PR32)
**And** if no licence requires it, no Credits row exists and the credits go on the itch.io page (FR192, Q10)
**And** if one does, this story stops and the Credits surface goes through `gds-correct-course` before anything is built, since its content and input are unspecified and, opened from pause, it would be a third step from play (UX-DR62)

**Given** all of the above
**When** the story closes
**Then** every check is closed before any public page or build exists (PR34)

Note: No document names where the originality findings are recorded; this story uses the record Epic 4 kept for the symbol checks (NFR40), or asks the developer if there is none.
Note: If a licence requires in-game credit, the Credits surface is unspecified and conflicts with the two-step depth limit; that needs a planning change, not a story default.

### Story 6.18: Put the final title on screen and build the title backdrop

As a player,
I want the title screens to carry the game's real name over a backdrop in its own look,
So that the first thing I see is the game itself, not a placeholder.

**Requirements:** UX-DR58 (title ground), UX-DR61, UX-DR111 (the backdrop build), PR32 (credit check)

**Acceptance Criteria:**

**Given** the final title approved in Story 6.17
**When** boot, the title gate and the device note show
**Then** the wordmark reads the final title, centred in the upper third in `display-xl`, legible at 1280 × 720 (UX-DR61)
**And** the page's `<title>` reads the final title, and the working title appears in no on-screen string

**Given** the title-backdrop style Epic 0 recorded in `docs/STYLE_GUIDE.md` (UX-DR111)
**When** the backdrop is built
**Then** it renders in the engine from the shared materials, palette and lighting, behind the title gate, the title menu, Settings opened from the title and the level select (UX-DR58)
**And** boot and the device note stay on `surface-screen`

**Given** text over the backdrop
**When** those screens show
**Then** the gate prompt takes the `card-text` band rule (UX-DR33, over-art case), menus sit on their panels, and no `text-muted` sits on a scrim

**Given** any new asset the backdrop uses
**When** it is added
**Then** it is logged in `docs/ASSETS.md` with its tool, licence and AI flag, and `make build`'s budget checks still pass
**And** its licence is read for an in-game credit requirement and the answer recorded in `docs/ASSETS.md`; if one exists, this story stops as Story 6.17 does, and the Credits surface goes through `gds-correct-course` before anything more is built (readiness proposal 2026-11-13, Q15)
**And** this story leaves the first-input measurement to Story 6.19

**Given** captures of boot, the gate, the title menu, the level select, Settings from the title and the device note, at 1280 × 720 and 1920 × 1080
**When** the critic loop runs (`make shots ROUND=n`, at most 3 rounds)
**Then** each round lists the top three problems against `docs/STYLE_GUIDE.md` and DESIGN.md and fixes them, and the developer sees before and after
**And** the developer approves the title screens

Note: The title backdrop is "Epic 0 style, Epic 6 build" (EXPERIENCE.md open item 1, UX-DR111) but is not on Epic 6's coverage line; it is included so it isn't lost. If `docs/STYLE_GUIDE.md` records no backdrop style, the developer decides whether to build one, and the grounds stay `surface-screen` as the spines allow.
Note: Internal names that carry the working title (the save key `emberbound.save`, `window.__emberbound`, the repository) stay unchanged; renaming the save key would orphan existing saves.

### Story 6.19: Run the performance pass on the reference machines

As a developer,
I want the release build measured and fixed on the reference machines,
So that players on a 2020-era laptop get a steady 60 fps and short loads.

**Requirements:** NFR1, NFR2, NFR3, NFR5, NFR6, NFR7, PR27 (machines), AR222, AR223, AR224, AR225, AR226, AR227, X-B18 (the Epic 6 check)
**Depends on:** the reference machines the developer named (PR27)

**Acceptance Criteria:**

**Given** the release build (`make build`, served by `make preview`) on each reference machine at 1080p
**When** the developer plays a full Level 1 with `?perf=1` in current Chrome, Edge and Firefox
**Then** the median frame time is 16.7 ms or less and the 99th percentile 20 ms or less in each, for the whole level and for every segment the `?perf=1` report shows (NFR1, NFR3, AR224; readiness proposal 2026-11-13, Q12)
**And** headless or Playwright timings are never used (AR222)

**Given** the same machines
**When** the starting budgets (†) are measured with the browser profiler, and draw calls and triangles are read from the F1 overlay in a development build on the same machine, since the overlay isn't in release builds (AR227; readiness proposal 2026-11-13, Q12)
**Then** one simulation step takes 1 ms or less; draw calls are 150 or fewer; triangles on screen 250,000 or fewer; GPU texture memory 256 MB or less; one shadow map of 2048 × 2048 at most; 2 post-processing passes at most; the pixel ratio is capped at 1.5 (AR225)

**Given** the per-step event objects allowed by default X-B18
**When** the profiler records a Level 1 run
**Then** their garbage-collection cost is recorded, and if it shows in the 99th percentile they are pooled, with the developer's approval

**Given** the warden fight in the Drowned Mill and Level 3's last stretch, with the Harrowmere ruins mixed-enemy stretch
**When** full plays of Levels 2 and 3 are recorded the same way
**Then** each level as a whole and every segment meets the same pass mark, median 16.7 ms or less and 99th percentile 20 ms or less, on each machine and browser, the warden fight's segment (from `arenaEntered`) and Level 3's last segment included (NFR1); a miss is fixed like a Level 1 miss (readiness proposal 2026-11-13, Q12)

**Given** a reference machine with the browser's network throttled to 50 Mbit/s and the cache disabled
**When** the page opens
**Then** the title gate accepts input within 10 s (NFR6, AR223)
**And** each level's load time from `?perf=1` is 3 s or less, not counting the reading floor (NFR7, AR226)
**And** the total transfer is 30 MB or less (NFR5)

**Given** any miss
**When** it is fixed
**Then** fixes go in order of cost; any change to a † budget (a pixel ratio of 1.0, a smaller shadow map, fewer passes) or to a tuned number is made only with the developer
**And** any visual change runs the critic loop, and the pass is measured again after the fixes

**Given** the final numbers per machine, browser and level
**When** they are recorded in the story's completion notes
**Then** the developer reviews and approves them (exit criterion: performance targets met on the reference machines)

### Story 6.20: Prepare the itch.io page with credits

As a developer,
I want the itch.io page ready under the final title with full credits, kept private until release,
So that the release is one switch away and every asset is credited.

**Requirements:** FR192 (credits on the page), NFR9, NFR11, NFR44, PR27 (release measurement)
**Depends on:** the developer's itch.io account; the release-measurement decision (PR27)

**Acceptance Criteria:**

**Given** the developer's itch.io account
**When** the developer creates the project
**Then** it is an HTML5 game under the final title, played in the browser with nothing to install (NFR9), free with donations only (NFR11), and not public (draft or restricted)

**Given** the page text the agent drafts for the developer
**When** it is reviewed
**Then** it covers the controls (keyboard and gamepad, as in the GDD controls table), the supported browsers (Chrome, Edge and Firefox; Safari best-effort), desktop only, and that progress stays in this browser (FR186)
**And** it follows the voice rules (sentence case, no exclamation marks), uses only approved terms, and contains no enemy working name

**Given** `docs/ASSETS.md`
**When** the credits are written
**Then** every asset and tool that needs credit appears on the page, matching one to one the rows of `docs/ASSETS.md` whose licence asks for credit (NFR44, FR192; readiness proposal 2026-11-13, Q15)
**And** if itch.io's form asks about AI-generated content, it is answered from `docs/ASSETS.md`

**Given** the page's screenshots
**When** they are added
**Then** each is captured from the release build and looked at before it is placed; no generated image stands in for the game

**Given** the release-measurement decision (PR27)
**When** it is applied
**Then** with no measurement, nothing is added
**And** with a proxy signal, the page invites players to share their clear times, in wording the developer approves
**And** with analytics, this story stops: analytics need a consent surface and network requests the architecture rules out (AR236), so they go through `gds-correct-course` before any build

**Given** the finished page
**When** the developer reviews it
**Then** the developer approves it, and it stays non-public until Story 6.23

Note: The page's content beyond credits and price is not specified; the listed items repeat what the GDD already promises players.

### Story 6.21: Add `make release` and push the first private upload

As a developer,
I want one `make release` target that builds, checks and uploads the game to itch.io,
So that every upload is the same checked build and no credential ever enters the repository.

**Requirements:** AR152 (final), AR228, AR229, AR230, AR231, NFR5, NFR10, PR32 (credit check), UX-DR95 (embed set up)
**Depends on:** the developer's itch.io account and a butler API key kept outside the repository

**Acceptance Criteria:**

**Given** butler's current documentation
**When** butler is added
**Then** it is pinned in `mise.toml` at an exact version at least two weeks old, and `make setup` installs it (AR231)
**And** if mise cannot install butler, the story stops and asks the developer; nothing is installed globally
**And** butler and its licence are logged in `docs/ASSETS.md`
**And** its licence is read for an in-game credit requirement and the answer recorded there; if one exists, this story stops as Story 6.17 does (readiness proposal 2026-11-13, Q15)

**Given** `make release`
**When** it runs
**Then** it runs `make build` (level compile and validation, type check, tests, Vite build, manifest, budget checks) and only then uploads `dist/` with butler to the project's HTML5 channel (AR229, AR231)
**And** any failed check stops it before the upload
**And** a failed butler push (network, authentication or a wrong target) stops `make release` with a non-zero exit and a clear message naming the cause, and leaves nothing public (readiness proposal 2026-11-13, Q15)

**Given** the final build
**When** the budget checks run
**Then** every asset is within its per-asset budget (AR152, †; moved within the 30 MB total only with the developer), the total is 30 MB or less, the code is 1 MB or less gzipped, and the build has 1,000 files or fewer, 500 MB or less in total and no file over 200 MB (NFR5, NFR10, AR230)

**Given** the butler credential
**When** a release runs
**Then** the key comes from the environment or butler's own login, never from the repository, the Makefile or a log
**And** `git status` shows no credential file afterwards
**And** the developer, not the agent, runs `butler login` or sets the API key in an environment variable outside the repository, and `.gitignore` gains `.env` (readiness proposal 2026-11-13, Q15)

**Given** the first upload
**When** the developer opens the private page
**Then** the project stays non-public; the upload is set to play in the browser in a 1280 × 720 embed with itch.io's fullscreen button on (Q9, UX-DR95)
**And** the game loads through boot, the gate and the title menu in Chrome, every URL relative (AR228), and the look-dev page is not in the upload

### Story 6.22: Run the browser checks on the private itch.io upload

As a developer,
I want every iframe behaviour EXPERIENCE.md lists checked on the private upload in each supported browser,
So that what players get on itch.io matches what was tested locally.

**Requirements:** AR122, AR232, AR234, AR235, NFR6, NFR8, NFR12, UX-DR72 (verify), UX-DR94, UX-DR95, UX-DR96, UX-DR97, UX-DR98, UX-DR99
**Depends on:** a standard gamepad; Chrome, Edge and Firefox on the developer's machine, and Safari if available (best-effort)

**Acceptance Criteria:**

**Given** the private upload and a gamepad (A1)
**When** the gate is passed with a gamepad button
**Then** the game goes on silently and the title menu shows "Click or press a key for sound"; the next key press or click starts sound and removes the notice
**And** the fullscreen toggle used from the gamepad is refused with snap-back and the fullscreen notice, or granted; the result per browser is recorded

**Given** fullscreen entered from Settings (A2)
**When** the player presses Esc during play
**Then** leaving fullscreen auto-pauses with "Resume" focused, P and Start still pause, and the toggle shows "Off"

**Given** the page has just loaded (A3)
**When** keys are pressed before the frame has focus
**Then** they don't reach the game; a click on the gate gives it focus
**And** a click outside the frame during play blurs it and auto-pauses; a click back focuses it

**Given** a finished level on the upload
**When** the page reloads, and again in a new browser session
**Then** the progress is still there (AR122); if the browser partitions or blocks the iframe's storage, the session runs on the in-memory save with the storage notice, and the game keeps running

**Given** a gamepad inside the itch.io iframe
**When** the game reads it
**Then** it works, or, if permission is refused, the pad is off for the session, the keyboard works and the gamepad notice shows (NFR8)

**Given** the game has focus inside the itch.io page
**When** the player presses Space or the arrow keys
**Then** the host page never scrolls

**Given** the 1280 × 720 embed
**When** the game runs in it
**Then** `--tile` is about 67 px, every text floor holds, and the HUD and menus are legible (UX-DR95)
**And** itch.io's fullscreen button fills the screen, `--tile` recomputes, and the Settings fullscreen toggle's state is compared with what the player sees; a mismatch is fixed or taken to the developer
**And** from the itch.io page, the gate accepts input within 10 s on a 50 Mbit/s throttle (NFR6)

**Given** the results per browser (Chrome, Edge, Firefox; Safari best-effort)
**When** a check fails
**Then** it is fixed, uploaded again with `make release`, and the affected checks run again
**And** the developer confirms every check behaves as EXPERIENCE.md specifies (exit criterion: the browser checks on the private itch.io upload)

Note: Whether the in-frame Fullscreen API reports itch.io's own fullscreen button is untested; a guess is that it doesn't, so the toggle may read "Off" while the frame fills the screen.

### Story 6.23: Release version one on itch.io

As a player,
I want to find the game on itch.io under its final title and play it straight away,
So that I can play version one free in my browser.

**Requirements:** PR13, NFR9, NFR11

**Acceptance Criteria:**

**Given** the performance pass approved (Story 6.19), the browser checks confirmed (Story 6.22), the originality checks closed (Story 6.17) and the page approved (Story 6.20)
**When** the release is prepared
**Then** the build on itch.io is the one those checks covered; if anything changed since, `make release` uploads it again and the affected checks run again

**Given** the developer makes the page public
**When** it is opened in a signed-out browser session in Chrome, Edge and Firefox
**Then** it shows the final title, free with donations (NFR11), and the game plays in the page with nothing to install (NFR9): boot, the gate, the title menu, Continue into Emberwood
**And** a finished level survives a reload

**Given** the public page and the game
**When** they are checked
**Then** the credits match `docs/ASSETS.md`, and the working title appears on neither

**Given** all of the above
**When** the developer reviews the epic
**Then** the developer approves the exit: performance targets met on the reference machines, the browser checks on the private itch.io upload behave as EXPERIENCE.md specifies, and the game released on itch.io under the final title (PR13)

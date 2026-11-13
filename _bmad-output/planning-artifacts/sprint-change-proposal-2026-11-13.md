---
title: 'Sprint Change Proposal — UX fold-in'
project: emberbound
date: 2026-11-13
status: approved
mode: batch
trigger: '_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/ (gds-ux, final 2026-11-13)'
scope: moderate
artifacts:
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/decision-log.md
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - _bmad-output/project-context.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
  - CLAUDE.md
---

# Sprint Change Proposal — Emberbound — 2026-11-13

Paths are relative to the project root unless an edit names its own file. Decision IDs (D-, F-, A-, Q-, M-) refer to `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/.decision-log.md`.

## 1. Issue Summary

**Trigger.** The UX design run (`gds-ux`, 2026-11-13) produced two final spines, `DESIGN.md` and `EXPERIENCE.md`, with three key-screen mocks and a reviewed validation report. The run settled menu, HUD, input, state and browser behaviour that the GDD, the epics, the architecture and the narrative design do not yet carry, and it resolved several places where those documents disagreed with each other.

**Category.** New requirements from a planned design pass, plus gaps and contradictions in the original requirements. Not a technical failure: nothing is built yet.

**When and how it surfaced.** No epic has started (`implementation-artifacts/` is empty; there is no `sprint-status.yaml`). The UX run's last section, EXPERIENCE.md › "Open Questions & Notes for GDD", lists the items to fold in. Three drafting passes then read each artifact in full and found the exact places to change.

**Evidence.**

- New UX elements the GDD does not list: the warden HP bar (F1), the bell toast (F2), the mute indicator (D7), the boot loading screen and title gate (D8), the restart and quit confirms (D9), the "New best" tag (D11), the notices (D15, A1, Q7), and "Try anyway" on the device note (D16).
- Contradictions the UX run resolved:
  - Settings list (gdd.md:765 vs gdd.md:803): mute is the M key only (D10).
  - Loading-card line on replays (gdd.md:628 vs gdd.md:647): name and line on every load, skippable on replays (F10).
  - "Quit to level select" before the level select exists: reads "Quit to title" (D9).
- Behaviour the architecture states more narrowly than the UX now needs: auto-pause only on a hidden tab (game-architecture.md:371); reduced motion turns off shake only (game-architecture.md:135, 412); no screen modules for boot, the loading card or shared components (game-architecture.md:1060-1064).
- Epic placement: the title gate has to exist in Epic 3 for the playtests to have audio and the intro (F5). The overlay colours and typefaces need an owner, which is Epic 0 (F9).
- Found while checking, not from the UX run:
  - The narrative bans the word "seal" from version-one text (narrative-design.md:860), but the UX warden label shows it.
  - The GDD contradicts itself on kill hit-stop (gdd.md:177 vs gdd.md:373).
  - epics.md:101 still lists the level editor as "LDtk or Tiled", although the architecture pinned Tiled 1.12.x.

## 2. Impact Analysis

### 2.1 Epic impact

| Epic | Change type | Summary |
| --- | --- | --- |
| File-level | scope add | Frontmatter lists both spines; "What this file is" points story creation at them; a new rule says overlay surfaces read the DESIGN.md tokens and follow EXPERIENCE.md, with UI timings tuned in the epic that builds each surface (M2); the coverage table gains UX rows. |
| 0 | scope add, exit criterion added | The style guide also records the 16 overlay colour roles and the 3 typefaces (woff2, licence in `docs/ASSETS.md`, 0.3 MB or less) and re-measures the contrast table; DESIGN.md is then updated through `gds-ux` Update (F9). The look-dev page shows the overlay tokens. The sample card fixes where card text sits. New exit criterion; stories 3 and 8 edited, story 9 added. |
| 1 | scope add | Input: menu actions (D13), last-used device, bound keys don't scroll the page, pause, the D14/Q7 auto-pause triggers with held inputs cleared, and pausing during death and the pit fade (M5). The placeholder HUD and results read the DESIGN.md tokens and `--tile` (M3). Depends on the Epic 0 values. Stories 4 and 20 edited. |
| 2 | none | Nothing from the UX run lands here. |
| 3 (MVP) | scope add | Bare title gate (F5, D8, A1). The final HUD adds the bell toast (F2) and the mute indicator (D7), judged in play with the Epic 0 values; heart legibility is checked. Control signs use the arcade key set and position glyphs (F3, F6). Card input rules (D12) and the loading card's name and line (F10). Exit criteria unchanged. |
| 4 | scope add | Warden bar (F1). Seal break: the HUD fades out, pause is allowed (M5), the reduced-motion fade applies (D17). Exit criteria unchanged. |
| 5 | scope add | Held beat hides the HUD and allows pause (M5); closing and all-bells cards follow the card input rules, skippable only on replays (D12); Level 3 results sit over the dimmed last card scene, then go to the title on a first play. Exit criteria unchanged. |
| 6 | scope add, exit criterion added | Boot loading, title menu after the gate, pause with "Quit to title" before unlock, restart and quit confirms (D9), level-select focus and the "All-bells card" row, replay loading-card skip (F10), results stagger and "New best" (D11), notices (D15, A1, Q7), in-memory saving, settings details (D10, Q5, D17), device note with "Try anyway" (Q3, D16), credits rule (Q10), browser checks on the private upload (A1-A3, Q9). Screen readers out of scope (Q6). New exit criterion for the browser checks. |

No epic is added, removed, renumbered or resequenced (checklist 2.4, 2.5). No existing exit-criterion threshold changes.

### 2.2 Story impact

No story files exist yet. epics.md carries draft story lists per epic; the edits change Epic 0 stories 3 and 8 and add story 9, Epic 1 stories 4 and 20, Epic 3 stories 6, 7 and 9, Epic 4 stories 2 and 5, Epic 5 story 9, and Epic 6 stories 1-4 and 7. `gds-create-story` will pull the spines through the new frontmatter entry (E-01, E-02).

### 2.3 Artifact conflicts

| Artifact | Conflict | Edits |
| --- | --- | --- |
| GDD (`gdd.md`) | Missing UX elements; two internal contradictions resolved by UX (settings list, loading card); one found while checking (kill hit-stop) | G-01 to G-19 |
| Narrative (`narrative-design.md`) | F10 and the end-of-level order; the "seal" word rule vs the warden label | N-01 to N-03 |
| Architecture (`game-architecture.md`) | State machine, auto-pause, reduced motion, audio unlock, input, UI modules, timings, CSS naming, settings defaults | A-01 to A-29 |
| Project context (`project-context.md`) | Derived from the architecture; ten rules go stale | P-01 to P-10 |
| Epics (`epics.md`) | Scope, stories, exit criteria, coverage table | E-01 to E-38 |
| UX spines | Citations into epics.md go stale after E-edits; the warden label depends on decision DN-1 | U-01, U-02 |
| Other | epics.md level-editor line; CLAUDE.md "still open" list; fullscreen-refusal semantics | X-01 to X-03 |

There is no PRD; the GDD serves that role (checklist 3.1).

### 2.4 Technical impact

Nothing is built, so no code changes or rollback. Effects on the future build:

- **New UI modules under `ui/`.** These are part of DN-3, which needs your approval because it changes the folder structure.
- **Wiring.** Auto-pause triggers are added in `platform/` and `main.ts`. The `render/fx` flash reads `reducedMotion`.
- **Two new `PresentationSettings` fields:** `isAudioLocked` and the feature status.
- **Tests.** Two more app-state transitions for Vitest, plus one Playwright smoke line covering the gate and the confirm dialog.
- **No new dependency and no tuned gameplay number changed.** G-18 changes prose only.

## 3. Recommended Approach

**Selected: Option 1, Direct Adjustment** (checklist 4.4). The approved UX decisions go into the existing artifacts in place.

| Option | Viable | Effort | Risk | Note |
| --- | --- | --- | --- | --- |
| 1. Direct adjustment | Yes | Low | Low | Document edits only, each one checked against its file as an exact match before applying. |
| 2. Rollback | No | — | — | Nothing is built or in progress to roll back. |
| 3. MVP review | Not needed | — | — | The MVP (Epic 3, the Level 1 vertical slice) grows slightly: bare gate, bell toast, mute indicator. All three were approved in the UX run. |

**Rationale.** The changes are additive and settled. Applying them before any story exists costs a few document edits now and avoids stories built against stale requirements. The project brief says "reject scope growth unless the developer asks for it". Every scope addition here comes from a decision you made or approved in the UX run, and this proposal is where you confirm them.

**Timeline.** No change to epic order. Epic 0 gains one story (the DESIGN.md value update). Epic 3 gains the bare gate and two HUD elements. Epic 6 gains a browser-check exit criterion. All are small.

### 3.1 Decisions needed before approval

| ID | Question | Options | Recommended |
| --- | --- | --- | --- |
| DN-1 | The narrative says "Tithe" and "seal" never appear in version-one text (narrative-design.md:860), but the UX warden-bar label reads "Warden of the First Seal". | (a) Label "The Warden" — keep a name tag, respect the narrative rule. (b) No label — bar only. (c) Keep the label; N-03 makes HUD text an exception. | (a) |
| DN-2 | `input/` (menu repeat) and `app/` (card minimum, loading-card floor) cannot import `ui/`, but M2 puts every UI time in `ui/timings.ts`. | (a) One module in `core/` (e.g. `core/uiTimings.ts`), which every layer may import (game-architecture.md:1165). (b) Keep `ui/timings.ts`; `main.ts` passes values to `input/` and `app/`. (c) Split by owner: card guards in `sim/config.ts`, repeat in `input/`, fades in `ui/timings.ts`. | (a) |
| DN-3 | New folder and files under `ui/` (A-22), which CLAUDE.md says needs your approval: `ui/components/` (one file per shared component), `ui/timings.ts` or the DN-2 location, `screens/bootLoading.ts`, `screens/loadingCard.ts`. | Approve, or a single `ui/components.ts` file instead of a folder. | Approve the folder (fits the architecture's one-main-export rule). |
| DN-4 | Error panels (bug and retry) have no owning epic. | (a) Epic 6, with the other menus and the release build. (b) Epic 1, with safe failure. | (a) |

### 3.2 Decisions made by the facilitator (veto any)

1. **G-18 included.** It fixes the GDD prose to match the hit-feedback table: a stomp gets hit-stop, a shot kill doesn't. No tuned number changes.
2. **G-19 included.** It adds a change-record entry to the GDD's own `decision-log.md`.
3. **Fullscreen refused ≠ failed (X-03).** If fullscreen is refused for lack of user activation, for example from a gamepad, the toggle snaps back and can be retried with a key or a click. Only an API error turns fullscreen off for the session.
4. **A click sets the last device to keyboard.** `input/` listens for pointer events on the window, so last-device logic stays in one place.
5. **Reduced-motion flash fade.** The short fade's length is a † value tuned in Epic 4 with the seal-break staging. It lives in `CONFIG.feedback` beside the other feedback values, which `render/` already reads.
6. **Architecture proposals accepted as drafted:**
   - Settings and the confirm dialog are app states (A-08).
   - `ui-` is the CSS prefix for shared components (A-24).
   - `base.css` holds the tokens as `--{group}-{name}`.
   - `prefers-reduced-motion` is read in `platform/device.ts`.
   - The feature-status field names go in the snapshot (A-12).
7. **X-01 included.** epics.md's level-editor line becomes "Tiled 1.12.x", which the architecture already settled.
8. **X-02 included.** CLAUDE.md's "Still open" list drops the level editor. CLAUDE.md is your file, so this edit is listed for your approval like the rest.
9. **Left open, with no edits:** the title backdrop (Epic 0 style, Epic 6 build) and the release-analytics consent prompt (it depends on the release-measurement decision Epic 6 already lists).
10. **Narrative rewatch suggestion left open.** narrative-design.md:1002 suggests rewatching the intro and closing card from the level select. The UX run did not take it up, and closing it now would be a new decision.
11. **project-context.md `rule_count`** goes from 119 to 129. That's an estimate; P-10 says so.

Where a decision above changes a drafted edit, apply-time adjustments are listed in 4.7.

### 3.3 Decisions recorded (Emilijan, 2026-11-13)

| ID | Answer |
| --- | --- |
| DN-1 | (a) The bar is labelled "The Warden". Apply U-02; G-05 and E-22 use "The Warden"; drop N-03. |
| DN-2 | (a) `core/uiTimings.ts`, with the card minimum and loading-card floor included; no `main.ts` injection. |
| DN-3 | Approved: `ui/components/` (one file per shared component), `screens/bootLoading.ts`, `screens/loadingCard.ts`. |
| DN-4 | (a) Epic 6 owns both error panels. |
| 3.2 | No vetoes. |

## 4. Detailed Change Proposals

Each OLD block was checked to occur exactly once in its target file, and each group applies cleanly top to bottom on a scratch copy. Edits marked OPTIONAL are included unless vetoed (3.2).

### 4.1 GDD (`gdds/gdd-emberbound-2026-11-12/gdd.md`, plus G-19 in its `decision-log.md`)

#### G-01 — Add the UX spines to the GDD's inputs
- **Artifact:** gdd.md › YAML frontmatter, `inputs:` (line 14)
- **Source:** EXPERIENCE.md › Open Questions & Notes for GDD (fold-in instruction); precedent: the narrative update added its document to `inputs`
- **OLD:**
```
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
---
```
- **NEW:**
```
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
---
```
- **Rationale:** The GDD now carries decisions from the UX run, so the spines become inputs, as the narrative document did. `updated:` is already 2026-11-13 and needs no change if applied today.

#### G-02 — Pointer: the UX spines own menu and HUD behaviour
- **Artifact:** gdd.md › How to Read This Document (line 28)
- **Source:** EXPERIENCE.md › Foundation (Spines); caller's request for a pointer instead of duplication
- **OLD:**
```
- **Narrative.** The story content lives in the narrative design document (`_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md`): characters, world, every line of story text, environmental storytelling and the seal-break staging. This GDD keeps the rules and decisions that affect play and production.
```
- **NEW:**
```
- **Narrative.** The story content lives in the narrative design document (`_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md`): characters, world, every line of story text, environmental storytelling and the seal-break staging. This GDD keeps the rules and decisions that affect play and production.
- **Interface.** The HUD, menus and screens are specified in the UX spines in `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/`: `EXPERIENCE.md` for behaviour, flows and interface text, `DESIGN.md` for the overlay's look. They are the authority on menu and HUD behaviour. This GDD names only what affects play and production.
```
- **Rationale:** Mirrors the existing Narrative bullet. Lets every later edit stay one line and keeps the GDD from restating the spines' tables.

#### G-03 — Input rules: auto-pause clears held inputs; gamepad failure notice
- **Artifact:** gdd.md › Game Mechanics › Controls and Input › Input rules (lines 255–256)
- **Source:** D14, Q7; EXPERIENCE.md › State Patterns (Playing: tab hidden…; Gamepad error), Component Patterns › `notice-line`
- **OLD:**
```
- The game pauses automatically when the browser tab is hidden.
- If the browser refuses gamepad access, the keyboard still works and the game keeps running.
```
- **NEW:**
```
- The game pauses automatically when the browser tab is hidden, and in the other cases listed under Platform-Specific Details. Held inputs are cleared, so Rowan stops.
- If the browser refuses gamepad access, the keyboard still works and the game keeps running.
- If the gamepad fails during play, it turns off for the session and the game pauses, as it does for a disconnect. The pause and title menus then show a one-line notice that the gamepad is unavailable and the keyboard still works.
```
- **Rationale:** The trigger list lives once, at gdd.md:802 (G-15); this line keeps only the input consequence, clearing held inputs. Q7 adds the pause and the notice for a pad that fails mid-level.

#### G-04 — Control signs: arcade key set and neutral gamepad glyphs
- **Artifact:** gdd.md › Game Mechanics › Controls and Input › Teaching the controls (line 262)
- **Source:** F6, F3; EXPERIENCE.md › Component Patterns › `control-glyphs`, Input Schemes
- **OLD:**
```
- The icon matches the device the player last used, keyboard or gamepad.
```
- **NEW:**
```
- The icon matches the device the player last used, keyboard or gamepad.
- Keyboard signs teach one key set only: the arrow keys, Z to jump and X to spit. The other keys in the table work but are never shown.
- Gamepad signs show button positions, never platform letters, colours or logos. The spit sign shows the west face button.
```
- **Rationale:** The controls table lists three key sets; the signs need one. F6 picks the arcade set, F3 the position glyphs, and the west button is the spit row's first-listed binding (gdd.md:243).

#### G-05 — Warden: health bar on the HUD
- **Artifact:** gdd.md › Action Platformer Specific Elements › Combat System › The Warden of the First Seal › Arena and rules (line 403)
- **Source:** F1; EXPERIENCE.md › Component Patterns › `hud-warden-bar`, HUD & Diegetic UI
- **OLD:**
```
- **Health:** 30 HP. Each ember hit does 1 damage, a triple shot can land 3 hits, and the warden can be hit at any time.
```
- **NEW:**
```
- **Health:** 30 HP. Each ember hit does 1 damage, a triple shot can land 3 hits, and the warden can be hit at any time.
- **Health bar:** a HUD bar labelled "Warden of the First Seal" appears when the door shuts and drops with each hit. A notch at 15 HP marks where phase 2 starts. It empties and fades when the warden falls.
```
- **Rationale:** F1 adds a HUD element tied to the fight's rules (phase 2 at 15 HP). The label uses the approved term, so the given name stays off screen (gdd.md:396). Respawn and fade details stay in the spine.

#### G-06 — Bells: the pickup counter toast
- **Artifact:** gdd.md › Progression and Balance › Economy and Resources, Bells row (line 583)
- **Source:** F2, D4; EXPERIENCE.md › Component Patterns › `hud-bell-toast`, HUD & Diegetic UI (no persistent bell counter)
- **OLD:**
```
| Bells | 3 hidden per level, 9 in version one | Replay goal; all 9 unlock a story card | Bells found add up across replays |
```
- **NEW:**
```
| Bells | 3 hidden per level, 9 in version one | Replay goal; all 9 unlock a story card | Bells found add up across replays. A pickup briefly shows "Bell n of 3" on the HUD, counting this run's bells as the results screen does. There is no lasting bell counter. |
```
- **Rationale:** The GDD has no HUD section; the resource row is where bell tracking already lives. "Briefly" leaves the timing to the spines' UI timings table.

#### G-07 — Session flow: boot loading screen and title gate
- **Artifact:** gdd.md › Level Design Framework › Level Progression › Session flow (line 620)
- **Source:** D8; EXPERIENCE.md › Information Architecture (Boot loading, Title gate), Component Patterns › `boot-loading-bar`, `title-gate-prompt`
- **OLD:**
```
**Session flow:**

- **Title screen:** Continue, Level select, Settings.
```
- **NEW:**
```
**Session flow:**

- **Boot:** a loading screen (the wordmark and a progress bar, no tips) while shared assets load, then a "Click or press any key" gate. The gate's key press or click starts sound and gives the game keyboard focus inside the itch.io page.
- **Title screen:** Continue, Level select, Settings.
```
- **Rationale:** Two new surfaces before the title. The gate exists because browsers need a user gesture before sound plays and before an iframe gets keys. Gamepad-only behaviour (A1, unverified until the Epic 6 upload) stays in the spine.

#### G-08 — Session flow: pause menu, "Quit to title" and confirms
- **Artifact:** gdd.md › Level Design Framework › Level Progression › Session flow (line 626)
- **Source:** D9; EXPERIENCE.md › Information Architecture (Paused, Confirm dialog), Voice and Tone (Pause, Confirm strings), State Patterns (Paused: first Level 1 play)
- **OLD:**
```
- **Intro:** plays once, on the first Continue of a new save. Skippable.
```
- **NEW:**
```
- **Intro:** plays once, on the first Continue of a new save. Skippable.
- **Pause menu:** Resume, Restart level, Settings, Quit to level select. Until the level select unlocks, the last item reads "Quit to title". Restart level and Quit each ask for one confirmation, with Cancel as the default, because leaving mid-level restarts the level.
```
- **Rationale:** The GDD never lists the pause menu (epics.md has it). D9 adds the before-unlock wording and the confirms; the reason ties back to gdd.md:801.

#### G-09 — End-of-level order: loading card on first play, level select on replay
- **Artifact:** gdd.md › Level Design Framework › Level Progression › Session flow › Order at the end of a level (line 628)
- **Source:** F10; EXPERIENCE.md › Information Architecture (Results → next loading card on a first play, level select on a replay), Open Questions & Notes for GDD (F10)
- **OLD:**
```
  - Levels 1 and 2: the results, then, on a first play, the next level's line on its loading card. In Level 2 the seal break comes before the results.
```
- **NEW:**
```
  - Levels 1 and 2: the results, then, on a first play, the next level's loading card; a replay returns to the level select. In Level 2 the seal break comes before the results.
```
- **Rationale:** Half of the F10 reconciliation. "On a first play" now qualifies where the flow goes, not whether the line shows. G-11 states that every load shows the line.

#### G-10 — Results: "New best" tag
- **Artifact:** gdd.md › Level Design Framework › Level Progression › Session flow › Results screen (line 634)
- **Source:** D11; EXPERIENCE.md › Component Patterns › `results-stat`
- **OLD:**
```
  - embers collected, out of the level total
```
- **NEW:**
```
  - embers collected, out of the level total
  - a "New best" tag on the clear time when a replay beats the level's best; never on a first play
```
- **Rationale:** D11 adds the tag; the GDD's results list is otherwise unchanged.

#### G-11 — Story Delivery: the level line shows on every load; replays can skip the reading floor
- **Artifact:** gdd.md › Story Delivery › Rules (line 647)
- **Source:** F10; EXPERIENCE.md › Component Patterns › `loading-card`, State Patterns (Loading card: first play vs replay)
- **OLD:**
```
- One line of text before each level, shown on the level's loading card for at least about 3 s † of reading time. Loading happens behind the card; the 3 s transition limit applies to loading, not to reading.
```
- **NEW:**
```
- One line of text before each level, shown with the level's name on its loading card on every load, first play or replay, for at least about 3 s † of reading time. On a replay, confirm skips the rest of the reading time once loading is done. Loading happens behind the card; the 3 s transition limit applies to loading, not to reading.
```
- **Rationale:** The developer's F10 choice: name and line on every load, skippable only on replays. With G-09 this resolves gdd.md:628 against 647. The 3 s † value is unchanged.

#### G-12 — Audio settings: mute is the M key only, with an icon
- **Artifact:** gdd.md › Art and Audio Direction › Audio and Music (line 765)
- **Source:** D10, D7, M6; EXPERIENCE.md › Component Patterns › `hud-mute-indicator`
- **OLD:**
```
**Settings:** music volume, effects volume, and mute (M).
```
- **NEW:**
```
**Settings:** music volume and effects volume. Mute is the M key only, not a settings row; a speaker-off icon shows while sound is muted.
```
- **Rationale:** Resolves gdd.md:765 against 803: mute is a key, not a setting. The indicator is the only feedback that M did something when no sound is playing.

#### G-13 — Phones and tablets: "Try anyway"
- **Artifact:** gdd.md › Technical Specifications › Platform-Specific Details (line 797)
- **Source:** D16, Q3; EXPERIENCE.md › Component Patterns › `device-note`
- **OLD:**
```
- **Phones and tablets:** not supported in version one. They show a "best played on desktop with keyboard or gamepad" note.
```
- **NEW:**
```
- **Phones and tablets:** not supported in version one. They show a "best played on desktop with keyboard or gamepad" note instead of the title, with a "Try anyway" link for tablets with a keyboard.
```
- **Rationale:** D16 adds a way through for keyboard tablets. The detection rule (Q3) stays in the spine.

#### G-14 — Saves: storage refused
- **Artifact:** gdd.md › Technical Specifications › Platform-Specific Details › Saves (line 801)
- **Source:** D15; EXPERIENCE.md › State Patterns (Title menu: storage refused), Browser Constraints (storage partitioning)
- **OLD:**
```
  - Leaving mid-level restarts that level.
```
- **NEW:**
```
  - Leaving mid-level restarts that level.
  - If the browser refuses storage, progress is kept in memory for the session, and the title screen says in one line that it won't be saved.
```
- **Rationale:** gdd.md:784 already says a refused feature turns off. D15 adds the one player-facing consequence: the player is told that progress will be lost.

#### G-15 — Auto-pause triggers, settings list, reduced-motion scope and default
- **Artifact:** gdd.md › Technical Specifications › Platform-Specific Details (lines 802–803)
- **Source:** D14, D10, D17, Q5; EXPERIENCE.md › State Patterns (Playing: tab hidden…), Game Feel & Juice (reduced-motion column and note), Accessibility Floor › Motion
- **OLD:**
```
- **Auto-pause** when the tab is hidden.
- **Settings:** music volume, effects volume, reduced motion (turns screen shake off), fullscreen. There is no key remapping in version one.
```
- **NEW:**
```
- **Auto-pause** when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or fails. The game never resumes by itself.
- **Settings:** music volume, effects volume, reduced motion, fullscreen. Mute is the M key only. There is no key remapping in version one.
  - **Reduced motion** turns screen shake off and turns full-screen flashes, such as the seal-break ember flash, into a short fade. It also stops the HUD's last-heart pulse and icon shake. Hit-stop and the invulnerability blink stay, because they carry timing and readability.
  - A new save takes its reduced-motion default from the browser's `prefers-reduced-motion` setting.
```
- **Rationale:** Covers D14's extra triggers, mute reconciled with G-12, D17's wider scope (which also reaches the seal-break flash at gdd.md:429) and Q5. The line at gdd.md:377 ("Shake is off when reduced motion is set") stays true, so it is left alone.

#### G-16 — Interface asset list: new HUD elements and surfaces
- **Artifact:** gdd.md › Technical Specifications › Asset Requirements, Interface row (line 816)
- **Source:** F1, F2, D7, D8, D9, D15, D16, Q7, F10; EXPERIENCE.md › Information Architecture, HUD & Diegetic UI; DESIGN.md › Components
- **OLD:**
```
| Interface | 1 set | HUD (hearts, ember meter, weapon timer), title, pause, level select, results, settings, story cards, control signs (keyboard and gamepad icons for about 6 actions) |
```
- **NEW:**
```
| Interface | 1 set | HUD (hearts, ember meter, weapon timer, bell toast, warden health bar, mute icon), boot loading screen, title gate, title, loading card, pause, confirm dialog, level select, results, settings, phone and tablet note, one-line notices, error panels, story cards, control signs (keyboard and gamepad icons for about 6 actions). Specified in the UX spines. |
```
- **Rationale:** Brings the asset list in line with the spines' component set (22 components). "Specified in the UX spines" points to G-02 instead of listing component names.

#### G-17 — Asset rules: the credits rule
- **Artifact:** gdd.md › Technical Specifications › Asset Requirements › Asset rules (line 826)
- **Source:** Q10; EXPERIENCE.md › Open Questions & Notes for GDD ("Open, decided outside this UX run", item 2)
- **OLD:**
```
- Every asset, its tool and its licence are logged in `docs/ASSETS.md`, including whether it was made with AI.
```
- **NEW:**
```
- Every asset, its tool and its licence are logged in `docs/ASSETS.md`, including whether it was made with AI.
- Credits go on the itch.io page. If an asset's licence requires credit inside the game, a Credits row joins Settings. This is settled once `docs/ASSETS.md` lists every licence.
```
- **Rationale:** The credits rule depends on licences, so it sits beside the licence-logging rule. The Settings list (G-15) is left unchanged until a licence requires the row.

#### G-18 — [OPTIONAL — found while checking, not from UX] Kill hit-stop: prose contradicts the hit-feedback table
- **Artifact:** gdd.md › Core Gameplay › Core Gameplay Loop, moment to moment (line 177)
- **Source:** None from UX. Internal inconsistency: gdd.md:177 against the Hit feedback table (gdd.md:372–373: Stomp 0.05 s hit-stop; "Kill with a shot | None"). Evidence that the table is right: `prototype/sprout-demo.html:1881` (stomp sets `hitstop = 0.05`), `:1888` (shot kill calls `shake(0.12)` with no hit-stop); `game-architecture.md:817` (`hitStopSteps: { stomp, rowanHurt }`, with no entry for a shot kill).
- **OLD:**
```
3. An enemy dies, with hit-stop and a burst, or a hazard is cleared.
```
- **NEW:**
```
3. An enemy dies in a burst (a stomp also gets a short hit-stop), or a hazard is cleared.
```
- **Rationale:** This is the minimal fix: the prose changes to match the proven table, the prototype and the architecture config, and no number changes. **The developer decides.** The alternative is to give shot kills hit-stop. That changes a proven feel number (the table has no † on it), which CLAUDE.md says to ask about, and it also changes `game-architecture.md:817`.

#### G-19 — [OPTIONAL — outside gdd.md] Change record entry in the GDD's decision log
- **Artifact:** `gdds/gdd-emberbound-2026-11-12/decision-log.md` › end of file, after "### Update from narrative design (2026-11-13)" (last line)
- **Source:** gdd.md has no changelog or revision section. Its frontmatter `updated:` is already 2026-11-13, so gdd.md needs no edit. The GDD's own change record is the sibling `decision-log.md` ("Canonical record of decisions, changes and version transitions"), which logged the previous update the same way. Drop this edit if only gdd.md is in scope.
- **OLD:**
```
- **Status: final.** `gdd.md` and `epics.md` are updated from narrative design and ready for `gds-game-architecture`.
```
- **NEW:**
```
- **Status: final.** `gdd.md` and `epics.md` are updated from narrative design and ready for `gds-game-architecture`.

### Update from UX design (2026-11-13)

- **Intent: update, through `gds-correct-course`.** Change signal: the UX spines, `ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md` and `DESIGN.md` (final), section "Open Questions & Notes for GDD".
- **Conflict check:** no pillar, core-loop or tuned-number change. Two GDD contradictions resolved: settings vs mute (gdd.md:765 against 803: mute is the M key only, D10) and the level line on replays (gdd.md:628 against 647: every load shows the name and line; replays can skip the reading floor, F10).
- **Added:** a pointer to the UX spines as the authority on menu and HUD behaviour; the warden health bar (F1); the bell toast (F2); the mute icon (D7); the boot screen and title gate (D8); the pause menu with "Quit to title" before unlock and the restart and quit confirms (D9); the "New best" tag (D11); auto-pause on blur, fullscreen exit and gamepad loss (D14); the storage notice (D15); "Try anyway" on the phone and tablet note (D16); the wider reduced-motion scope (D17) and its browser default (Q5); the gamepad-unavailable notice (Q7); the credits rule (Q10); the control signs' arcade key set and position glyphs (F6, F3); the interface asset list.
```
- **Rationale:** This keeps the GDD's change history in one place. Before applying, add the developer's approvals (and the G-18 decision, if taken) to the entry.

---


### 4.2 Narrative (`narratives/narrative-emberbound-2026-11-13/narrative-design.md`)

#### N-01 — Player Control: the level line on every load; replays can skip the reading time
- **Artifact:** narrative-design.md › Narrative Delivery › In-Game Storytelling › Player Control (line 891)
- **Source:** F10; EXPERIENCE.md › Component Patterns › `loading-card`
- **OLD:**
```
- Level lines show while the level loads. The card stays up for a minimum reading time, about 3 s (a guess), then continues.
```
- **NEW:**
```
- Level lines show with the level's name while the level loads, on every load, first play or replay. The card stays up for a minimum reading time, about 3 s (a guess), then continues. On a replay, confirm skips the rest of the reading time once loading is done.
```
- **Rationale:** As written, the line says the ~3 s floor always holds, which F10 now relaxes on replays. The narrative's mandatory-beat rule ("Level lines: brief, always shown on the loading card", line 994) still holds.

#### N-02 — End-of-level order: the next level's card on a first play only
- **Artifact:** narrative-design.md › Narrative Delivery › In-Game Storytelling › Order at the end of a level (line 898)
- **Source:** EXPERIENCE.md › Information Architecture (Results → next loading card on a first play; level select on a replay); gdd.md:628 already says "on a first play"
- **OLD:**
```
- Levels 1 and 2: exit (or the seal break), then results, then the next level's line card.
```
- **NEW:**
```
- Levels 1 and 2: exit (or the seal break), then results, then, on a first play, the next level's line card. A replay returns to the level select.
```
- **Rationale:** A minor, older imprecision that the UX flow makes explicit. Without the qualifier, a Level 1 replay would lead into Level 2.

#### N-03 — Script notes: "seal" now appears on screen in the warden bar's label
- **Artifact:** narrative-design.md › Narrative Delivery › Story Text Script (version one) › Script notes (line 860)
- **Source:** F1 and the warden-bar label decision in `.decision-log.md` ("Warden of the First Seal" as its label); EXPERIENCE.md › Voice and Tone (HUD row)
- **OLD:**
```
- The words “Tithe” and “seal” do not appear in version one's text. The warden and the seal break show them.
```
- **NEW:**
```
- The words “Tithe” and “seal” do not appear in version one's story text. The warden and the seal break show them. The one on-screen “seal” is interface text: the warden's health bar is labelled “Warden of the First Seal” (UX, F1), which the GDD counts as HUD, not story text.
```
- **Rationale:** By the GDD's definition (gdd.md:163, where HUD is not story text) this is not a rule break, but the note's intent was that "seal" is shown, never written, and the bar now writes it in every warden fight. **Developer fork:** accept the label (apply this edit) or keep "seal" off screen entirely. The second option changes the label through `gds-ux` Update, not this document.

---

#### Narrative conflict check (items with no edit)

| Item | Line(s) checked | Result |
| --- | --- | --- |
| F10, level line on every load | 972 "Level line \| Each level load, on the loading card"; 994 "Level lines: brief, always shown on the loading card." | No conflict. F10 confirms both. Only 891 needed an edit (N-01). |
| Story-card minimum and skips | 803 "Cards advance on confirm, with a short minimum display, about 1.5 s (a guess), so a double press doesn't skip one."; 893 "The closing card and the all-bells card advance on confirm."; 900 "Level 3 replays: … The held beat, the closing card and the all-bells card can be skipped." | No conflict. The UX adds detail (Back skips the rest where allowed; all input, Back included, is ignored before the minimum; a press must begin on the card) without contradicting anything. Intro "always skippable" (801, 890) matches D12. |
| Title gate | 745 "The title screen reuses it (GDD), so the title screen sounds like home."; 604 and 971, intro on the first Continue of a new save | No conflict. Sound can only start at the gate (browser rule), so the tune plays from the gate's press onward. The intro trigger is unchanged. |
| Held beat skip rules | 802 "The seal break and the held beat can be skipped on replays only."; 818; 892 | No conflict. This matches the UX rule (jump or confirm, replays only; HUD hidden). UX also allows pause during story moments (M5); the narrative is silent on pause. |
| Seal-break skip rules | 158, 620, 802, 995 | No conflict. |
| Seal-break ember flash under reduced motion | 987 "A flash of embers from his chest hides the model swap…" | No conflict. Under reduced motion the full-screen flash becomes a short fade (D17), which still hides the swap. The GDD records this in G-15; no narrative edit. |
| "No text" rules | 619 "In-engine, no text (GDD)"; 818 "no text"; 882 "The HUD carries no story." | No conflict. The HUD hides during story moments, and the mute icon is not shown on cards or in story moments (M6). The "seal" wording is handled in N-03. |
| Interface text ownership | 657 (card legibility belongs to `gds-ux`); 1038 (interface text "Owned by `gds-ux`") | No conflict. Both are now done by the UX run. |
| Rewatch suggestion | 1002 "*Suggestion for `gds-ux`, not decided:* rewatch the intro and the closing card from the level select." | Not picked up. The narrative document was not a UX source (`.decision-log.md` line 8), and the level select offers only the all-bells card. No edit drafted, because marking it rejected would invent a decision. The developer can close it or carry it forward. |
| Narrative changelog | Frontmatter `version: '1.0'`; Document Status (line 19) | No changelog or revision section, so no edit proposed. |

### 4.3 Architecture (`architectures/architecture-emberbound-2026-11-13/game-architecture.md`)

#### A-01: Version bump

- **Artifact:** game-architecture.md › frontmatter (line 6)
- **Source:** process (correct-course revision)
- **OLD:**
```
version: '1.0'
```
- **NEW:**
```
version: '1.1'
```
- **Rationale:** There is no changelog, so the version field records the revision. A-04 says what changed.

#### A-02: UX spines as source documents

- **Artifact:** game-architecture.md › frontmatter, Source Documents (line 16)
- **Source:** EXPERIENCE.md and DESIGN.md (both `status: final`)
- **OLD:**
```
narrative: '_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md'
```
- **NEW:**
```
narrative: '_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md'
ux_experience: '_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md'
ux_design: '_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md'
```
- **Rationale:** After this revision the architecture depends on the UX spines, so they are listed with its other inputs. Keys are snake_case, like `planning_doc`.

#### A-03: Consistency-rule count, Executive Summary

- **Artifact:** game-architecture.md › Executive Summary (line 39)
- **Source:** follows from A-27
- **OLD:**
```
**Implementation Patterns:** 8 patterns (4 standard, 4 novel) and 23 consistency rules.
```
- **NEW:**
```
**Implementation Patterns:** 8 patterns (4 standard, 4 novel) and 24 consistency rules.
```
- **Rationale:** A-27 adds one consistency rule ("Overlay values"). Drop this edit if A-27 is rejected.

#### A-04: Revision note in Document Status

- **Artifact:** game-architecture.md › Document Status (line 45)
- **Source:** process; defines the "UX + id" citation used below
- **OLD:**
```
This architecture document was created through the GDS Architecture Workflow on 2026-11-13.
```
- **NEW:**
```
This architecture document was created through the GDS Architecture Workflow on 2026-11-13.

**Revised 2026-11-13 (version 1.1)** through `gds-correct-course`, folding in the UX design's notes for architecture (`ux-designs/ux-emberbound-2026-11-13/`: EXPERIENCE.md and DESIGN.md). Changes: more auto-pause triggers; reduced motion for full-screen flashes, and its default; the audio-locked state; `--tile`; the new interface modules and UI timings; and the app states the UX adds. "UX" plus a decision id (D14, M3, …) cites that folder's `.decision-log.md`.
```
- **Rationale:** This is the only place in the document that can record a revision. It also sets up the "UX D14" citation style, which matches the document's existing "(GDD)" citations.

#### A-05: Interface row in Core Systems

- **Artifact:** game-architecture.md › Project Context › Core Systems (line 102)
- **Source:** EXPERIENCE.md Information Architecture; M8
- **OLD:**
```
| Interface and session flow (HUD, title, Continue, level select, results, pause, settings, control signs) | Medium | Session flow; Controls and Input |
```
- **NEW:**
```
| Interface and session flow (boot loading, HUD, title gate and menu, Continue, level select, loading card, results, pause with restart and quit confirms, settings, notices, error panels, control signs) | Medium | Session flow; Controls and Input; UX spines |
```
- **Rationale:** The system's scope now includes the surfaces the UX adds. The count of 21 systems doesn't change.

#### A-06: Auto-pause requirement

- **Artifact:** game-architecture.md › Technical Requirements › Resilience (line 124)
- **Source:** UX D14, Q7; EXPERIENCE.md State Patterns (Playing rows)
- **OLD:**
```
  - Auto-pause when the tab is hidden.
```
- **NEW:**
```
  - Auto-pause when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or is turned off (UX D14, Q7).
```
- **Rationale:** D14 adds three triggers. Q7 treats a gamepad turned off after an error like a disconnect.

#### A-07: Reduced-motion requirement and default

- **Artifact:** game-architecture.md › Technical Requirements › Accessibility and text (lines 134-135)
- **Source:** UX D17, Q5; EXPERIENCE.md Game Feel & Juice, Accessibility Floor
- **OLD:**
```
- **Accessibility and text:**
  - Reduced motion turns shake off.
```
- **NEW:**
```
- **Accessibility and text:**
  - Reduced motion turns shake off and full-screen flashes into a short fade, and stops the HUD's last-heart pulse and icon shake. Hit-stop and the 9 Hz blink stay (UX D17).
  - A new save takes its reduced-motion default from the browser's `prefers-reduced-motion` (UX Q5).
```
- **Rationale:** D17 widens the scope beyond shake. Q5 sets the default for a new save. The HUD pulse and icon shake are `ui/` concerns; they are listed here so the requirement covers the whole scope.

#### A-08: App state machine: boot, gate, loading card, pause sub-states

- **Artifact:** game-architecture.md › Architectural Decisions › State Management › App state machine (line 367)
- **Source:** EXPERIENCE.md Information Architecture (table and Mermaid flow); UX D8, D9, D16, F5, F10, M5; EXPERIENCE.md `confirm-dialog`, `loading-card`
- **OLD:**
```
- Boot → Title → (Intro cards, on a new save) → Level loading (level-line card) → Playing ⇄ Paused → end of level.
```
- **NEW:**
```
- Boot (loading bar) → (Device note, on a phone or tablet; "Try anyway" continues) → Title gate → Title menu → (Intro cards, on a new save) → Level loading (level-line card) → Playing ⇄ Paused → end of level. Epic 3 builds the gate alone, going straight to the intro cards and Emberwood; the title menu comes in Epic 6 (UX F5).
- Level loading shows the level name and its line on every load. It holds for the GDD's reading floor (about 3 s †) and until loading is done, then goes to Playing. On a replay, once loading is done, confirm skips the rest of the floor (UX F10).
- Paused opens Settings or the confirm dialog (Restart level, Quit). Both are app states over Paused: the simulation stays stopped, and Back or Cancel returns to Paused. Settings opened from the title menu returns there. Restart recreates the level and fades straight to Playing, without the loading card. Quit goes to the level select, or to the title menu before the level select unlocks (UX D9). Pausing works during in-level story moments, the death sequence and the pit fade, and the simulation resumes where it stopped (UX M5).
```
- **Rationale:**
  - The UX adds boot, the device note, the gate and the confirm dialog, and changes the loading card (F10).
  - **Proposal:** Settings and the confirm dialog are app states, not local to a screen. The UX doesn't decide this. The argument for app states: the architecture already says app state holds "the current screen", and with no jsdom, navigation logic in `app/` is the only kind Vitest can cover.
  - The ~3 s floor is the GDD's † number. Where it lives is undecided (see Open items).

#### A-09: Level 3 results go to the title menu on a first play

- **Artifact:** game-architecture.md › State Management › App state machine (line 369)
- **Source:** EXPERIENCE.md Information Architecture (Mermaid: `results -->|"Level 3, first play"| titleMenu`); State Patterns, Title menu
- **OLD:**
```
- End of level, Level 3: closing card → all-bells card, if all 9 bells are found → Results. Replays keep the order; the held beat and the cards can be skipped.
```
- **NEW:**
```
- End of level, Level 3: closing card → all-bells card, if all 9 bells are found → Results → Title menu (first play; Continue there now opens the level select) or Level select (replay). Replays keep the order; the held beat and the cards can be skipped.
```
- **Rationale:** The architecture didn't say where Level 3's results lead. The UX settles it. The order results → all-bells card after a Level 1 or 2 replay (line 368) already matches the UX, so line 368 is unchanged.

#### A-10: Auto-pause triggers and error panels in the state machine

- **Artifact:** game-architecture.md › State Management › App state machine (line 371)
- **Source:** UX D14, M5, Q7, Q8; EXPERIENCE.md State Patterns (Playing, Loading card, Boot rows), Mermaid `errRetry`
- **OLD:**
```
- A hidden tab sends Playing to Paused.
```
- **NEW:**
```
- Auto-pause: a hidden tab, window blur, leaving fullscreen, or the gamepad disconnecting or being turned off after an error sends Playing to Paused, with Resume focused. It never resumes by itself. `platform/visibility.ts` (tab hidden, window blur), `platform/fullscreen.ts` (fullscreen left) and `platform/gamepad.ts` (disconnect, or off after an error) report to `main.ts`, which clears held input and dispatches one auto-pause command. Outside Playing, a trigger only clears held input; on cards and the loading card nothing else is running (UX D14, M5, Q7).
- A failed asset load, at boot or behind the loading card, shows the Retry panel after one silent retry; Retry repeats that load as often as it is pressed (UX Q8). A release-build bug shows the "Something went wrong" panel over Playing, and "Restart level" restarts the level.
```
- **Rationale:**
  - This puts the triggers "beside `platform/visibility.ts`", as the UX note asks. `platform/` can't import `app/`, so the wiring goes through `main.ts`, which matches Communication Patterns.
  - The command is left unnamed on purpose. When it is named, it should be imperative camelCase.
  - Not settled: what happens in menus outside Playing. The UX only defines cards and the loading card; "only clears held input" elsewhere is my reading.
  - **Untested guess:** leaving itch.io's own fullscreen button (Q9) may not fire `fullscreenchange` inside the iframe. Check this on the Epic 6 upload.

#### A-11: Full-screen flash reads `reducedMotion`

- **Artifact:** game-architecture.md › State Management › Simulation to presentation (line 412)
- **Source:** UX D17; EXPERIENCE.md Game Feel & Juice (closing paragraph); Notes for architecture
- **OLD:**
```
- Shake is computed in rendering from events, using `CONFIG.feedback`. A new shake raises trauma to its value if that is higher, and never adds (GDD). Reduced motion turns it off.
```
- **NEW:**
```
- Shake is computed in rendering from events, using `CONFIG.feedback`. A new shake raises trauma to its value if that is higher, and never adds (GDD). Reduced motion turns it off.
- Full-screen flashes (`render/fx/flash.ts`, such as the seal-break ember flash staged by `storyStaging.ts`) read `reducedMotion`. With it on, each becomes a short fade. Hit-stop and the 9 Hz blink stay (UX D17).
```
- **Rationale:**
  - This is the D17 note for `render/fx`. Only full-screen flashes change, so the single-actor enemy hit flash (`enemyHit`) is unaffected; that is my reading of "full-screen".
  - The length of the fade is not set anywhere. It is a render value; see Open items.

#### A-12: Feature status in the `PresentationSettings` snapshot

- **Artifact:** game-architecture.md › State Management › Simulation to presentation (line 414)
- **Source:** UX A1, D10, D15, Q7 (the four notices); EXPERIENCE.md `notice-line`, `toggle`
- **OLD:**
```
- **Presentation settings:** `main.ts` passes rendering, audio and the interface one read-only `PresentationSettings` snapshot per frame: `reducedMotion`, `musicVolume`, `effectsVolume`, `isMuted`, `lastDevice`. No presentation layer reads settings or devices any other way.
```
- **NEW:**
```
- **Presentation settings:** `main.ts` passes rendering, audio and the interface one read-only `PresentationSettings` snapshot per frame: `reducedMotion`, `musicVolume`, `effectsVolume`, `isMuted`, `lastDevice`, plus the feature status that the notices and the fullscreen toggle show: `isAudioLocked`, `isFullscreen`, and the optional features turned off for the session (storage, gamepad, fullscreen). No presentation layer reads settings, devices or feature status any other way.
```
- **Rationale:**
  - The UX adds four notices and a fullscreen toggle that mirrors the real state. `ui/` may not import `platform/`, so that state needs a path to `ui/`, and this snapshot is the architecture's one sanctioned path.
  - **Proposal:** the field names and shape. The UX only decides the behaviour.

#### A-13: The level-line card has no card-scene art

- **Artifact:** game-architecture.md › Architectural Decisions › Story Director (line 453)
- **Source:** DESIGN.md Components `loading-card` and Colors (`surface-screen`: "Opaque ground: boot, device note, loading card"); EXPERIENCE.md Foundation (loading card = level-line card)
- **OLD:**
```
- **In the app:** story cards (intro, level-line, closing, all-bells) are app states. A separate card scene renders the silhouettes, with the text in the DOM overlay.
```
- **NEW:**
```
- **In the app:** story cards (intro, level-line, closing, all-bells) are app states. A separate card scene renders the silhouettes of the intro, closing and all-bells cards, with the text in the DOM overlay. The level-line card has no silhouettes: the level name and its line sit on the opaque screen ground (UX `loading-card`).
```
- **Rationale:** This fixes a contradiction. The line implied that every story card, the level-line card included, gets card-scene silhouettes. The UX puts the loading card on an opaque flat ground.

#### A-14: Input: last device, menu actions, hold-to-repeat, card guard, `preventDefault`, clearing held input

- **Artifact:** game-architecture.md › Architectural Decisions › Input (lines 561-562)
- **Source:** EXPERIENCE.md Interaction Primitives (table, Back, hold-to-repeat, guards), Input Schemes (last device), Browser Constraints (page scrolling), `card-text`; UX D13, D14; log "Lows" (hold-to-repeat; card press must begin on the card; stick sets last device; Esc is Back from pause)
- **OLD:**
```
- The last-used device (keyboard or gamepad) goes into the `PresentationSettings` snapshot, which picks the icons on the control signs.
- **App-level actions** (pause, mute, and menu up, down, confirm and back) go to the app, never to the simulation. Menus can be navigated with a gamepad.
```
- **NEW:**
```
- The last-used device (keyboard or gamepad) goes into the `PresentationSettings` snapshot, which picks the icons on the control signs and the card advance hint. A key press or a click sets keyboard; a gamepad button, or a stick past the play thresholds above, sets gamepad (UX).
- **App-level actions** (pause, mute, and menu up, down, left, right, confirm and back) go to the app, never to the simulation. Menus can be navigated with a gamepad.
  - Esc pauses during play; in menus and on cards it means Back. Back on the pause menu resumes; on the title menu it does nothing (UX).
  - **Hold-to-repeat:** a held menu direction, on lists and sliders, repeats after 0.4 s at 8 steps per second (UX). The values live in `ui/timings.ts`; `main.ts` passes them to `input/`, which may not import `ui/`.
  - **Card guard:** menu actions are presses, never held state. When a card appears, presses latched before it are dropped, so only a press that began on the card counts. The app ignores all card input, Back included, before the GDD's card minimum (about 1.5 s †) (UX).
- **Bound keys call `preventDefault`** while the game has focus, so Space and the arrows never scroll the itch.io page (UX; verify on the Epic 6 upload).
- **Auto-pause clears held input:** every auto-pause trigger (State Management) releases held keys and directions, so Rowan stops (UX D14).
```
- **Rationale:**
  - Covers every input item in the UX notes. Left and right are new, for the sliders.
  - **Boundary catch:** `input/` may not import `ui/` (boundary table, line 1169). So the repeat values have to be passed in from `main.ts`, or else live in `input/`, which would split UI timings across two modules.
  - Implementation note, not in the UX: the repeat should ignore the OS's key repeat (`KeyboardEvent.repeat`), or 0.4 s at 8 per second won't hold.
  - **Undecided:** how a click reaches `input/lastDevice.ts`, either a `pointerdown` listener in `input/` or a report from `ui/`.

#### A-15: Interface: screens, shared components, overlay root, `--tile`, timings, mouse

- **Artifact:** game-architecture.md › Architectural Decisions › User Interface (lines 567-568)
- **Source:** UX M2, M3, M6, M8, D13; EXPERIENCE.md Component Patterns (Owning modules), Responsive & Platform; DESIGN.md Layout & Spacing (the tile unit), Colors rule 5, Elevation & Depth
- **OLD:**
```
- **The DOM overlay** sits above the canvas: plain TypeScript modules, one per screen, plus CSS.
  - Screens: HUD, title, level select, results, settings, pause, card text, and the note for phone and tablet visitors.
```
- **NEW:**
```
- **The DOM overlay** sits above the canvas: plain TypeScript modules, one per screen, plus CSS.
  - Screens: boot loading, HUD, title (the "Click or press any key" gate, then the menu), loading card, level select, results, settings, pause, card text, the error panels (bug; retry, for boot and level loads), and the note for phone and tablet visitors.
  - Shared components, one file each in `ui/components/`: menu item, panel, scrim, slider, toggle, notice line, confirm dialog. Screens are built from them (UX M8).
  - `ui/overlay.ts` is the root. It stacks the layers in DESIGN.md's order (Elevation & Depth), owns the mute indicator, which sits above every scrim including the error panel's (UX M6), and sets `--tile`.
- **`--tile`** is the on-screen size of one world tile. `ui/overlay.ts` sets it on the overlay root on resize, from the logical view's size in `sim/config.ts` and DESIGN.md's formula. CSS never hard-codes it, and every overlay size is a multiple of it (UX M3). If Epic 0's camera frames a margin around the logical view, the value must include that margin, since `ui/` cannot import `render/`. The DESIGN.md tokens become CSS custom properties named `--{group}-{name}`.
- **UI timings** (fades, holds, the results stagger, menu repeat) live in one module, `ui/timings.ts`, in seconds (`…Seconds`), never frames. Every value is provisional † and tuned in the epic that builds its surface (UX M2).
- **Mouse:** menus only, never required. Hover moves focus and a click confirms. The cursor hides when play starts and shows when a menu opens (UX D13).
```
- **Rationale:**
  - Covers the M8 module list, the mute indicator (M6), `--tile` (M3, including DESIGN.md's camera-margin caveat), the tokens rule (DESIGN Colors rule 5) and the timings module (M2).
  - **Proposal:** `ui/components/` as a folder, one file per component. The UX says "a shared component module", but the architecture's "one main export per file" rule (line 1108) argues for a folder. The single-file `ui/components.ts` is the alternative.
  - New folders need the developer's approval (CLAUDE.md).

#### A-16: Audio unlock at the gate; gamepad leaves audio locked

- **Artifact:** game-architecture.md › Architectural Decisions › Audio (line 577)
- **Source:** UX A1, D8; EXPERIENCE.md `title-gate-prompt`, Browser Constraints (Autoplay row), State Patterns (Title menu, audio locked)
- **OLD:**
```
- **The Web Audio API directly**, with an `AudioContext` created or resumed on the first user input on the title screen (browser autoplay rules).
```
- **NEW:**
```
- **The Web Audio API directly**, with an `AudioContext` created or resumed on the first key press or click, normally at the title gate (browser autoplay rules). Gamepad presses are not user activation, so a gate passed with a gamepad leaves audio locked: the game runs silently, and the title menu shows the audio notice until the first key press or click (UX A1; verify on the Epic 6 upload).
```
- **Rationale:**
  - "First user input" is wrong for a gamepad press under A1.
  - `isAudioLocked` reaches the UI through A-12.
  - A1 is tagged as an assumption to verify on the Epic 6 upload.

#### A-17: Audio failure versus audio locked

- **Artifact:** game-architecture.md › Architectural Decisions › Audio (line 586)
- **Source:** UX A1, Q7 (failed audio start: no notice)
- **OLD:**
```
- **Failure:** if audio can't start, audio stays off and the game runs.
```
- **NEW:**
```
- **Failure:** if creating or resuming the `AudioContext` throws or is rejected, audio stays off for the session and the game runs, with no notice (UX Q7). A context still waiting for a key press or click is locked, not failed.
```
- **Rationale:**
  - Without the split, the "first failure turns the feature off for the session" rule (line 701) would kill audio after a gamepad-passed gate. A1 says a later key press or click unlocks it.
  - **Untested:** how each browser's `resume()` promise behaves without user activation. The locked check should read `AudioContext.state`, not the promise.

#### A-18: Browser checks on the private itch.io upload

- **Artifact:** game-architecture.md › Architectural Decisions › Build and Release (line 598)
- **Source:** EXPERIENCE.md "Browser checks on the Epic 6 private itch.io upload"; UX A1-A3, Q9
- **OLD:**
```
- **`make release`** uploads `dist/` to itch.io with `butler`, pinned in `mise.toml` in Epic 6. Before the public release, a private itch.io upload checks the iframe behaviour: gamepad, storage, audio, fullscreen.
```
- **NEW:**
```
- **`make release`** uploads `dist/` to itch.io with `butler`, pinned in `mise.toml` in Epic 6. Before the public release, a private itch.io upload checks the iframe behaviour: gamepad, storage, audio, fullscreen, plus the UX's browser checks: audio unlock after a gamepad-passed gate, fullscreen refused from a gamepad, the Esc that leaves browser fullscreen, iframe focus, page scrolling, and the 1280 × 720 embed with itch.io's fullscreen button (UX A1-A3, Q9).
```
- **Rationale:** The UX lists these as Epic 6 checks. The architecture's checklist is where agents will look for them.

#### A-19: Testing: app logic and smoke checks

- **Artifact:** game-architecture.md › Architectural Decisions › Testing Strategy (lines 617-618)
- **Source:** follows from A-08, A-10, A-14, A-21; EXPERIENCE.md `title-gate-prompt`, `confirm-dialog`
- **OLD:**
```
| App and input logic | Vitest | `src/app/*.test.ts`, `src/input/*.test.ts` | Node | Save validation and migration, the app state machine, input latching with synthetic events |
| Browser smoke checks | Playwright | `tests/e2e/smoke.spec.ts` | Headless Chromium and Firefox | Boot, title, level, pause; no console errors; a gamepad error doesn't stop the frame loop; refused storage falls back |
```
- **NEW:**
```
| App and input logic | Vitest | `src/app/*.test.ts`, `src/input/*.test.ts` | Node | Save validation and migration, the app state machine (the UX states, the confirm dialog and auto-pause included), the reduced-motion default, and input latching, hold-to-repeat and the card guard, with synthetic events |
| Browser smoke checks | Playwright | `tests/e2e/smoke.spec.ts` | Headless Chromium and Firefox | Boot, the title gate, title, level, pause and the restart confirm; no console errors; a gamepad error doesn't stop the frame loop; refused storage falls back |
```
- **Rationale:**
  - The smoke row gets the one-line addition the brief allowed: the gate and the confirm dialog.
  - The Node row names the new logic, which is testable only because A-08, A-14 and A-21 keep it in `app/` and `input/`, with `prefers-reduced-motion` passed in.

#### A-20: UI timings in the Configuration table

- **Artifact:** game-architecture.md › Cross-cutting Concerns › Configuration (insert after line 792)
- **Source:** UX M2; EXPERIENCE.md UI timings table; naming rule at line 1142
- **OLD:**
```
| Audio mix | `audio/mix.ts` | Bus levels, crossfade times, the wheel's distance curve |
```
- **NEW:**
```
| Audio mix | `audio/mix.ts` | Bus levels, crossfade times, the wheel's distance curve |
| UI timings | `ui/timings.ts` | Every overlay fade, hold, stagger and menu-repeat time, in seconds (`…Seconds`), never frames. Provisional †, each tuned in the epic that builds its surface (UX M2). `input/` gets the menu-repeat values from `main.ts`. |
```
- **Rationale:**
  - These are presentation timings, not gameplay numbers, so they sit beside `audio/mix.ts`, not in `sim/config.ts`.
  - **Not settled:** where the GDD's card minimum and loading-card reading floor live (see Open items).

#### A-21: Player settings: reduced-motion default; fullscreen and mute not saved

- **Artifact:** game-architecture.md › Cross-cutting Concerns › Configuration (line 794)
- **Source:** UX Q5, D10; EXPERIENCE.md `toggle` (fullscreen not saved), `hud-mute-indicator` (mute not saved)
- **OLD:**
```
| Player settings | `app/settings.ts`, stored in the save | Music volume, effects volume, reduced motion. Defaults live here. |
```
- **NEW:**
```
| Player settings | `app/settings.ts`, stored in the save | Music volume, effects volume, reduced motion. Defaults live here. A new save takes `reducedMotion` from the browser's `prefers-reduced-motion`, read by `platform/device.ts` and passed in (UX Q5). The settings screen's fullscreen toggle and the M mute are never saved. |
```
- **Rationale:**
  - Q5 puts the default in `app/settings.ts`. Passing the media-query result in keeps the module testable in Node, and keeps `matchMedia` in `platform/`, where Q3 already puts it (`platform/device.ts`).
  - **Proposal:** using `device.ts` for this.
  - The save schema (line 464) is unchanged.

#### A-22: Source tree: `ui/`

- **Artifact:** game-architecture.md › Project Structure › Source Structure (lines 1060-1064)
- **Source:** UX M8, M6, M3, M2, Q8; EXPERIENCE.md Component Patterns › Owning modules; DESIGN.md Colors rule 5
- **OLD:**
```
├── ui/                         The DOM overlay
│   ├── overlay.ts
│   ├── screens/                hud.ts, title.ts, levelSelect.ts, results.ts, settings.ts, pause.ts,
│   │                           cardText.ts, deviceNote.ts, levelError.ts, perfReport.ts
│   └── styles/                 base.css, screens.css
```
- **NEW:**
```
├── ui/                         The DOM overlay
│   ├── overlay.ts              The root: layer stacking, sets --tile, owns the mute indicator
│   ├── timings.ts              Every UI fade, hold and repeat time, in …Seconds (provisional †)
│   ├── components/             Shared: menuItem.ts, panel.ts, scrim.ts, slider.ts, toggle.ts,
│   │                           noticeLine.ts, confirmDialog.ts
│   ├── screens/                bootLoading.ts, hud.ts, title.ts (gate, then menu), loadingCard.ts,
│   │                           levelSelect.ts, results.ts, settings.ts, pause.ts, cardText.ts, deviceNote.ts,
│   │                           levelError.ts (bug panel; retry panel for boot and level loads), perfReport.ts
│   └── styles/                 base.css (DESIGN.md tokens as --{group}-{name}), screens.css
```
- **Rationale:**
  - This adds the modules the UX found missing (M8).
  - **Proposals** (the UX names none of these): `components/`, `bootLoading.ts`, `loadingCard.ts`, and putting the tokens in `base.css`.
  - `levelError.ts` keeps its name, as the UX does, although it now also serves boot loads.
  - Needs the developer's approval as a folder-structure change (CLAUDE.md).

#### A-23: Session flow in System Location Mapping

- **Artifact:** game-architecture.md › Project Structure › System Location Mapping (line 1088)
- **Source:** follows from A-08, A-10
- **OLD:**
```
| Session flow | `src/app/app.ts` | Title, intro, loading, playing, pause, results, level select |
```
- **NEW:**
```
| Session flow | `src/app/app.ts` | Boot, device note, title gate and menu, intro, loading, playing, pause (settings, confirm dialog), auto-pause, results, level select, error panels |
```
- **Rationale:** Agents use this table to decide where code goes, so it has to list the new states.

#### A-24: CSS class prefix for shared components; CSS custom properties

- **Artifact:** game-architecture.md › Naming Conventions › Code Elements (line 1149)
- **Source:** UX M8 (and log "Accepted as-is: shared components need a CSS prefix rule"); DESIGN.md Colors rule 5
- **OLD:**
```
| CSS classes | kebab-case, prefixed by screen | `hud-hearts`, `results-time` |
```
- **NEW:**
```
| CSS classes | kebab-case, prefixed by the component's name in the UX spines; shared components in `ui/components/` take `ui-` (proposed) | `hud-hearts`, `results-stat`, `ui-menu-item` |
| CSS custom properties | `--{group}-{name}` from the DESIGN.md tokens; `--tile` is set only by `ui/overlay.ts` | `--colors-surface-scrim`, `--tile` |
```
- **Rationale:**
  - "Prefixed by screen" has no answer for shared components. It also breaks for `hud-mute-indicator`, which `overlay.ts` owns, and for `error-panel`, which `levelError.ts` owns. Prefixing by the UX component name fixes both.
  - **Proposal:** the `ui-` prefix itself.
  - `results-time` becomes `results-stat`, the UX component name.

#### A-25: Communication example: snapshot inputs

- **Artifact:** game-architecture.md › Implementation Patterns › Communication Patterns, example (line 1382)
- **Source:** follows from A-12
- **OLD:**
```
const presentation = () => presentationSettings(app.state, input.lastDevice()); // read-only, per frame
```
- **NEW:**
```
const presentation = () => presentationSettings(app.state, input.lastDevice(), featureStatus()); // read-only, per frame; featureStatus() reads the platform/ wrappers
```
- **Rationale:**
  - Agents copy examples, and this one would otherwise contradict A-12.
  - `featureStatus()` is an illustrative name.

#### A-26: Data Patterns example: the level line goes to the loading card

- **Artifact:** game-architecture.md › Implementation Patterns › Data Patterns, example (line 1480)
- **Source:** follows from A-13, A-22 (UX `loading-card` module)
- **OLD:**
```
ui.cardText.show(STORY_TEXT.levelLine['drowned-mill']);
```
- **NEW:**
```
ui.loadingCard.show(STORY_TEXT.levelLine['drowned-mill']);
```
- **Rationale:** Level lines now belong to the loading-card screen, not `cardText`. The method name is illustrative.

#### A-27: Consistency rule for overlay values

- **Artifact:** game-architecture.md › Implementation Patterns › Consistency Rules (insert after line 1500)
- **Source:** UX M2, M3; DESIGN.md Colors rule 5, Layout & Spacing
- **OLD:**
```
| Story text | Only in `content/storyText.ts` | Review |
```
- **NEW:**
```
| Story text | Only in `content/storyText.ts` | Review |
| Overlay values | UI timings only in `ui/timings.ts` (`…Seconds`, never frames); sizes as multiples of `--tile`, which only `ui/overlay.ts` sets; colours and type only through the token properties (`--{group}-{name}`) | Review |
```
- **Rationale:** This mirrors the "Gameplay numbers" rule for the overlay, so agents don't scatter fade times or pixel sizes. It requires A-03 and A-28.

#### A-28: Consistency-rule count, Coverage Report

- **Artifact:** game-architecture.md › Architecture Validation › Coverage Report (line 1528)
- **Source:** follows from A-27
- **OLD:**
```
**Patterns Defined:** 4 standard, 4 novel, 23 consistency rules
```
- **NEW:**
```
**Patterns Defined:** 4 standard, 4 novel, 24 consistency rules
```
- **Rationale:** Keeps the count in step with A-27. Drop this edit if A-27 is rejected.

#### A-29: Follow-up: refresh project-context.md

- **Artifact:** game-architecture.md › Architecture Validation › Follow-ups Outside This Document (insert after line 1564)
- **Source:** process; project-context.md frontmatter `source:` is this document
- **OLD:**
```
- **The GDD's Dependencies table** still lists the level editor as "not chosen". Update it through `gds-gdd` (update) or `gds-correct-course`.
```
- **NEW:**
```
- **The GDD's Dependencies table** still lists the level editor as "not chosen". Update it through `gds-gdd` (update) or `gds-correct-course`.
- **`_bmad-output/project-context.md`** is generated from this document. Refresh it after the 1.1 revision (the UX fold-in), with `gds-generate-project-context` or by applying the listed rule edits.
```
- **Rationale:** project-context.md defers to the architecture on any conflict. Without a refresh, agents would read stale rules.

---


### 4.4 Project context (`_bmad-output/project-context.md`)

#### P-01: Reduced motion also changes full-screen flashes

- **Artifact:** project-context.md › Engine-Specific Rules › Hit-stop and shake (line 60)
- **Source:** A-11 (UX D17)
- **OLD:**
```
  - reduced motion turns it off
```
- **NEW:**
```
  - reduced motion turns it off, and turns full-screen flashes (`render/fx`, such as the seal-break ember flash) into a short fade; hit-stop and the 9 Hz blink stay
```
- **Rationale:** The current rule covers only shake.

#### P-02: Where things go: overlay entries

- **Artifact:** project-context.md › Code Organization Rules › Where things go (insert after line 106)
- **Source:** A-15, A-20, A-22, A-27 (UX M2, M3, M8)
- **OLD:**
```
| Browser features | `platform/` |
```
- **NEW:**
```
| Browser features | `platform/` |
| UI timings | `ui/timings.ts`, in `…Seconds`, never frames |
| Shared UI components | `ui/components/` (menu item, panel, scrim, slider, toggle, notice line, confirm dialog) |
| Overlay sizes and tokens | Multiples of `--tile` (set only by `ui/overlay.ts`); DESIGN.md tokens as `--{group}-{name}` |
```
- **Rationale:** These are the new places agents would otherwise guess.

#### P-03: PresentationSettings carries feature status

- **Artifact:** project-context.md › Code Organization Rules › Wiring (line 112)
- **Source:** A-12
- **OLD:**
```
  - Presentation reads settings and the last-used device only from the per-frame `PresentationSettings` snapshot.
```
- **NEW:**
```
  - Presentation reads settings, the last-used device and feature status (`isAudioLocked`, `isFullscreen`, features turned off) only from the per-frame `PresentationSettings` snapshot.
```
- **Rationale:** Keeps this rule matching A-12.

#### P-04: Naming: seconds suffix and CSS prefixes

- **Artifact:** project-context.md › Code Organization Rules › Naming (insert after line 123)
- **Source:** A-24; architecture naming rule at line 1142 (not yet in this file)
- **OLD:**
```
  - Asset files are kebab-case with a kind prefix (`enemy-thorn-flyer.glb`). glTF nodes and clips are snake_case.
```
- **NEW:**
```
  - Asset files are kebab-case with a kind prefix (`enemy-thorn-flyer.glb`). glTF nodes and clips are snake_case.
  - Times outside `sim/` end in `…Seconds` or `…Ms`.
  - CSS classes start with the component's name from the UX spines (`hud-hearts`, `results-stat`); shared components use `ui-` (`ui-menu-item`).
```
- **Rationale:** UI timings make the `…Seconds` rule matter for the first time. The CSS rule is new in A-24.

#### P-05: Why navigation logic lives in `app/` and `input/`

- **Artifact:** project-context.md › Testing Rules (line 140)
- **Source:** A-19
- **OLD:**
```
- **No jsdom.** DOM screens are covered by Playwright smoke checks. Screenshots are compared by eye, never pixel-diffed.
```
- **NEW:**
```
- **No jsdom.** DOM screens are covered by Playwright smoke checks. Screenshots are compared by eye, never pixel-diffed. So navigation rules (confirm dialog, settings return, auto-pause, card guard, hold-to-repeat) live in `app/` and `input/`, where Vitest covers them.
```
- **Rationale:** Without this, an agent could put that logic in `ui/` screens, where no Node test can reach it.

#### P-06: AudioContext unlock

- **Artifact:** project-context.md › Platform & Build Rules › itch.io iframe (line 149)
- **Source:** A-16, A-17 (UX A1)
- **OLD:**
```
  - The `AudioContext` is resumed on the first user input.
```
- **NEW:**
```
  - The `AudioContext` is resumed on the first key press or click. Gamepad presses are not user activation: after a gamepad-passed title gate, audio stays locked, the game runs silently, and the title menu shows the audio notice. Locked is not a failure.
```
- **Rationale:** "First user input" becomes wrong for gamepad players.

#### P-07: Input: menu actions, repeat, guard, scrolling, last device, auto-pause

- **Artifact:** project-context.md › Platform & Build Rules › Input (line 159)
- **Source:** A-10, A-14 (UX D13, D14, M5, Q7; Interaction Primitives)
- **OLD:**
```
  - Menu, pause and mute actions go to the app, never to the simulation.
```
- **NEW:**
```
  - Menu, pause and mute actions go to the app, never to the simulation. Menu actions: up, down, left, right, confirm, back. Esc pauses in play and means Back elsewhere.
  - A held menu direction repeats after 0.4 s at 8 per second. The values come from `ui/timings.ts` through `main.ts` (`input/` may not import `ui/`).
  - Cards count only a press that began after the card appeared; presses latched before it are dropped.
  - Bound keys call `preventDefault` while the game has focus.
  - Last device: a key press or click sets keyboard; a gamepad button, or a stick past the play thresholds, sets gamepad.
  - Auto-pause on a hidden tab, window blur, leaving fullscreen, or the gamepad disconnecting or turning off. Held input is cleared, and Paused never resumes by itself. On cards and the loading card, a trigger only clears held input.
```
- **Rationale:**
  - This file never mentioned auto-pause, even for the hidden tab.
  - The `input/` to `ui/` boundary catch is the one agents would most likely get wrong.

#### P-08: Never hard-code overlay values

- **Artifact:** project-context.md › Critical Don't-Miss Rules (line 171)
- **Source:** A-27
- **OLD:**
```
- **Never hard-code** story text, asset paths or gameplay numbers.
```
- **NEW:**
```
- **Never hard-code** story text, asset paths, gameplay numbers, UI timings or `--tile`.
```
- **Rationale:** The don't-miss form of the new "Overlay values" consistency rule.

#### P-09: Story: loading card on every load; where Level 3 ends

- **Artifact:** project-context.md › Critical Don't-Miss Rules › Story (lines 175-176)
- **Source:** A-08, A-09 (UX F10)
- **OLD:**
```
  - No text during play; level lines appear on loading cards.
  - Level 3 ends: held beat, closing card, all-bells card if earned, then results.
```
- **NEW:**
```
  - No text during play; level lines appear on loading cards, on every load. On a replay, confirm skips the reading floor once loading is done.
  - Level 3 ends: held beat, closing card, all-bells card if earned, then results, then the title menu (first play) or the level select (replay).
```
- **Rationale:** F10 changes the replay loading card, and the destination after Level 3's results is new.

#### P-10: Rule count

- **Artifact:** project-context.md › frontmatter (line 8)
- **Source:** follows from P-02, P-04 and P-07
- **OLD:**
```
rule_count: 119
```
- **NEW:**
```
rule_count: 129
```
- **Rationale:**
  - +10 new rules: 3 table rows in P-02, 2 bullets in P-04, 5 bullets in P-07. P-01, P-03, P-05, P-06, P-08 and P-09 change existing rules.
  - **Guess:** the generator's counting method is unknown, so recount on regeneration.
  - `date` and "Last Updated" stay at 2026-11-13, because it is the same day.

---


### 4.5 Epics (`gdds/gdd-emberbound-2026-11-12/epics.md`)

#### E-01: List the UX spines in the frontmatter

- **Artifact:** epics.md > frontmatter (line 3)
- **Source:** EXPERIENCE.md Foundation ("Spines"); DESIGN.md Brand & Style
- **OLD:**
```
gdd: gdd.md
```
- **NEW:**
```
gdd: gdd.md
ux:
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
```
- **Rationale:** The frontmatter is the file's only source list. Story creation needs both spines as inputs. Paths are root-relative, like the GDD's `inputs:` list.

#### E-02: Point story creation at the UX spines

- **Artifact:** epics.md > "What this file is" (line 15)
- **Source:** EXPERIENCE.md Foundation ("Spines", "Decision IDs")
- **OLD:**
```
- How each system is built belongs to the architecture document. This file says what each epic delivers.
```
- **NEW:**
```
- How each system is built belongs to the architecture document. This file says what each epic delivers.
- How the overlay (HUD, menus, cards, notices) looks and behaves belongs to the UX spines in `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/`: `DESIGN.md` for tokens and components, `EXPERIENCE.md` for surfaces, flows, states and on-screen strings. Story creation pulls both for every epic that builds an overlay surface. D-, F-, A-, Q- and M-numbers in this file refer to that folder's `.decision-log.md`.
```
- **Rationale:** This matches the existing pointer to the architecture document, and it explains the decision IDs that the later edits cite.

#### E-03: Rule for every epic that builds overlay UI

- **Artifact:** epics.md > "Rules for every epic" (line 22)
- **Source:** DESIGN.md Colors (rule 1, "Roles stay, values change"); EXPERIENCE.md Interaction Primitives > UI timings (M2)
- **OLD:**
```
- Every asset and tool is logged in `docs/ASSETS.md`, including whether the asset is AI-generated.
```
- **NEW:**
```
- Every asset and tool is logged in `docs/ASSETS.md`, including whether the asset is AI-generated.
- Overlay surfaces read the DESIGN.md tokens, never raw values, and follow EXPERIENCE.md for behaviour and strings. EXPERIENCE.md's provisional UI timings are tuned in the epic that builds each surface (M2).
```
- **Rationale:** Overlay work spans Epics 1, 3, 4, 5 and 6. One rule here means each epic doesn't have to repeat it.

#### E-04: Epic 0 style guide records overlay colours, typefaces and contrast (F9)

- **Artifact:** epics.md > Epic 0 > In scope, `docs/STYLE_GUIDE.md` list (line 44)
- **Source:** F9, D1, D2, D3; DESIGN.md Colors > Value lifecycle, Typography; EXPERIENCE.md Notes for epics
- **OLD:**
```
  - the story-card style: layered paper-cut silhouettes built in the engine, and whether cards may also use warm light for Elin and home (see the narrative design document, Narrative Delivery)
```
- **NEW:**
```
  - the story-card style: layered paper-cut silhouettes built in the engine, and whether cards may also use warm light for Elin and home (see the narrative design document, Narrative Delivery)
  - values for the 16 overlay colour roles in DESIGN.md (Colors), with `ember` still the only warm one
  - the 3 overlay typefaces (display, UI, numeric): self-hosted `.woff2`, licence checked and recorded in `docs/ASSETS.md`, all faces and weights together 0.3 MB or less
  - the DESIGN.md contrast table, re-measured on those values, with every target still met
- DESIGN.md then takes the overlay colours and typefaces through `gds-ux` Update, before this epic closes, so Epic 1 builds on them (F9).
```
- **Rationale:** F9 makes Epic 0 responsible for replacing the provisional greys. Without this, no story picks the faces or re-measures contrast (validation report, high finding).

#### E-05: Look-dev page shows the overlay tokens

- **Artifact:** epics.md > Epic 0 > In scope, look-dev page (line 46)
- **Source:** DESIGN.md Do's and Don'ts ("Judge the overlay on the look-dev page against the style guide"); DESIGN.md Components > `card-text` (band judged on the look-dev page)
- **OLD:**
```
- A look-dev page that shows any asset under the game's look, next to the style-guide swatches.
```
- **NEW:**
```
- A look-dev page that shows any asset under the game's look, next to the style-guide swatches. It also shows the overlay colour roles and typefaces, since the overlay is judged there too (DESIGN.md).
```
- **Rationale:** DESIGN.md says the overlay is judged on the look-dev page. If the page doesn't show the overlay, that check can't happen.

#### E-06: Sample card fixes card-text placement

- **Artifact:** epics.md > Epic 0 > In scope, sample story card (line 50)
- **Source:** DESIGN.md Layout & Spacing ("Text measure"), Components > `card-text`; decision log, Finalization (card text always on the scrim band; hint on the band)
- **OLD:**
```
  - It settles where the card shapes come from (made by hand or generated), logged in `docs/ASSETS.md`.
```
- **NEW:**
```
  - It settles where the card shapes come from (made by hand or generated), logged in `docs/ASSETS.md`.
  - It fixes where card text sits, reused on every later card: one line on a scrim band over the card art, with the advance hint at the band's lower right (DESIGN.md, `card-text`).
```
- **Rationale:** DESIGN.md says card-text placement is fixed on this sample card and reused on every card. The epic should say so.

#### E-07: Epic 0 exit criterion for the overlay values

- **Artifact:** epics.md > Epic 0 > Exit criteria (line 59)
- **Source:** F9; DESIGN.md Colors > Value lifecycle (step 3: Epic 0 closes before Epic 1 starts); decision log, Finalization (F9 lifecycle correction)
- **OLD:**
```
**Exit criteria:** the developer approves the look as rendered in the engine, not only the images.
```
- **NEW:**
```
**Exit criteria:** the developer approves the look as rendered in the engine, not only the images, and DESIGN.md carries the style guide's overlay colours and typefaces, with every contrast target met.
```
- **Rationale:** Epic 1 depends on the values being in DESIGN.md when Epic 0 closes, so the update has to be an exit criterion. This adds a criterion and changes no threshold.

#### E-08: Epic 0 story 3 covers the overlay values

- **Artifact:** epics.md > Epic 0 > Draft stories (line 65)
- **Source:** F9; DESIGN.md Colors > Value lifecycle
- **OLD:**
```
3. Run the style review with the developer and write `docs/STYLE_GUIDE.md`, including the story-card style.
```
- **NEW:**
```
3. Run the style review with the developer and write `docs/STYLE_GUIDE.md`, including the story-card style, the overlay colours and typefaces, and the re-measured contrast table.
```
- **Rationale:** This story now carries the new scope from E-04.

#### E-09: Epic 0 story 8 covers card-text placement; new story 9 updates DESIGN.md

- **Artifact:** epics.md > Epic 0 > Draft stories (line 70)
- **Source:** F9; DESIGN.md Layout & Spacing ("Text measure")
- **OLD:**
```
8. Build the sample story card and confirm the card style.
```
- **NEW:**
```
8. Build the sample story card and confirm the card style and where card text sits.
9. Update DESIGN.md with the overlay colours and typefaces through `gds-ux` Update.
```
- **Rationale:** Story 9 goes at the end, so nothing is renumbered. It is the last step before Epic 0's exit.

#### E-10: Epic 1 input gains menu actions, last device, pause and the auto-pause triggers

- **Artifact:** epics.md > Epic 1 > In scope, Input (line 82)
- **Source:** D13, D14, Q7, M5; EXPERIENCE.md Interaction Primitives, Input Schemes ("Last device"), State Patterns (Playing rows), Browser Constraints ("Page scrolling"); decision log, Finalize (bound keys `preventDefault`)
- **OLD:**
```
- **Input:** keyboard and gamepad map to the same actions. Short taps always register. Jump buffer and coyote time. Auto-pause on a hidden tab. Optional browser features fail safely.
```
- **NEW:**
```
- **Input:**
  - keyboard and gamepad map to the same actions, the menu actions included: move focus, confirm, back (D13)
  - short taps always register; jump buffer and coyote time
  - the last-used device is tracked, for the control-sign glyphs and the card advance hint
  - bound keys never scroll the host page
  - pause on Esc, P or Start
  - auto-pause when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or is turned off after an error (D14, Q7); held inputs are cleared so Rowan stops, and play never resumes by itself
  - pausing during the death sequence or the pit fade stops the simulation, which resumes where it was (M5)
  - optional browser features fail safely
```
- **Rationale:** Epic 1 owns input mapping and auto-pause. D14 adds three triggers and the held-input clear, and M5 is a simulation rule that needs a unit test here. Last device and `preventDefault` sit in the input layer. Epic 6 checks them on itch.io. The pause menu stays in Epic 6. Epic 1 only needs the paused state.

#### E-11: Epic 1 placeholder HUD and results read DESIGN.md tokens and `--tile`

- **Artifact:** epics.md > Epic 1 > In scope, Interface (line 96)
- **Source:** F9, M3, D4, D5; DESIGN.md Colors > Value lifecycle (step 3), Layout & Spacing ("The tile unit", "HUD anchors"); EXPERIENCE.md Component Patterns
- **OLD:**
```
- **Interface:** a placeholder HUD (hearts, ember meter, weapon timer) and a basic results screen.
```
- **NEW:**
```
- **Interface:** a placeholder HUD (hearts, ember meter, weapon timer) and a basic results screen.
  - Both read the DESIGN.md tokens and components, which already carry the Epic 0 values (F9), and scale with `--tile`, which `ui/overlay.ts` sets from the logical view in `sim/config.ts` (M3).
  - The HUD is the top-left cluster, with the states and timings in EXPERIENCE.md (Component Patterns).
```
- **Rationale:** Epic 1 is the first epic to build overlay UI, so this is where the token and `--tile` conventions start. The final HUD is still judged in Epic 3.

#### E-12: Epic 1 depends on the Epic 0 overlay values

- **Artifact:** epics.md > Epic 1 > Depends on (line 101)
- **Source:** F9; DESIGN.md Colors > Value lifecycle (step 3)
- **OLD:**
```
**Depends on:** Epic 0 (the scaffold); the level editor choice (LDtk or Tiled).
```
- **NEW:**
```
**Depends on:** Epic 0 (the scaffold, and the overlay colours and typefaces in DESIGN.md); the level editor choice (LDtk or Tiled).
```
- **Rationale:** This states the dependency that E-07 enforces.

#### E-13: Epic 1 story 4 covers the new input scope

- **Artifact:** epics.md > Epic 1 > Draft stories (line 114)
- **Source:** D13, D14, Q7
- **OLD:**
```
4. Map keyboard and gamepad input to the game's actions, with safe failure for optional features.
```
- **NEW:**
```
4. Map keyboard and gamepad input to the game's actions and the menu actions, with last-device tracking, pause and the auto-pause triggers, and safe failure for optional features.
```
- **Rationale:** This story now carries the scope from E-10.

#### E-14: Epic 1 story 20 builds from the tokens

- **Artifact:** epics.md > Epic 1 > Draft stories (line 128)
- **Source:** F9, M3
- **OLD:**
```
20. Add the placeholder HUD and results screen.
```
- **NEW:**
```
20. Add the placeholder HUD and results screen, built from the DESIGN.md tokens and components on the `--tile` unit.
```
- **Rationale:** This story now carries the scope from E-11.

#### E-15: Epic 3 control-sign icons use the arcade key set and position glyphs

- **Artifact:** epics.md > Epic 3 > In scope, Control-sign icons (line 190)
- **Source:** F3, F6; EXPERIENCE.md Component Patterns > `control-glyphs`, Input Schemes ("Glyphs", "Keyboard"); DESIGN.md Components > `control-glyphs`
- **OLD:**
```
- **Control-sign icons** for keyboard and gamepad.
```
- **NEW:**
```
- **Control-sign icons** for keyboard and gamepad. The signs show the last-used device's set and swap on the next frame after a change.
  - keyboard: the arcade set only, arrows to move, ↑ aim up, ↓ crouch, Z jump, ↓ + Z drop-through, X spit (F6)
  - gamepad: one neutral set of position glyphs, with no platform letters, colours or logos; the spit sign lights the west face button (F3, F6)
```
- **Rationale:** F3 and F6 settle which glyphs the signs show. The no-trademark rule also serves the hard limits in CLAUDE.md.

#### E-16: Epic 3 final HUD adds the bell toast and mute indicator and is judged in play

- **Artifact:** epics.md > Epic 3 > In scope, The final HUD (line 191)
- **Source:** F2, D7, M6, F9; DESIGN.md Colors > Value lifecycle (step 4), HUD backing treatment; EXPERIENCE.md HUD & Diegetic UI; decision log (flag for the Epic 3 critic loop: hearts about 23 px at 1280 × 720)
- **OLD:**
```
- **The final HUD:** hearts, ember meter, weapon timer.
```
- **NEW:**
```
- **The final HUD:** hearts, ember meter, weapon timer, the bell toast ("Bell n of 3" for about 2 s, F2) and the mute indicator (a speaker-off icon top-right while muted, D7).
  - It is judged in play with the Epic 0 values, on the critic-loop screenshots at Emberwood's brightest and busiest spots (F9).
  - Heart legibility at the 1280 × 720 embed (hearts about 23 px) is checked with the primary audience before the icon size is raised.
```
- **Rationale:** F2 and D7 add two HUD elements. F9 step 4 and the logged critic-loop flag both name Epic 3's final HUD as the place to check them.

#### E-17: Epic 3 builds the bare title gate (F5)

- **Artifact:** epics.md > Epic 3 > In scope, inserted after the Audio list (after line 196)
- **Source:** F5, D8, A1; EXPERIENCE.md Notes for epics, Component Patterns > `title-gate-prompt`, Information Architecture (Title gate)
- **OLD:**
```
  - the mute key
```
- **NEW:**
```
  - the mute key
- **The bare title gate** (F5): the wordmark, then "Click or press any key", then the intro cards, then Emberwood's loading card. Any key, click or gamepad button passes it. A key or click starts the audio and gives the frame keyboard focus; a gamepad button can't start the audio (D8, A1). It exists so the playtest has audio and the intro; the title menu, level select, saving and settings stay in Epic 6.
```
- **Rationale:** F5 moves the gate into Epic 3 so playtesters get sound and the intro. The scope boundary is stated where the gate is built.

#### E-18: Epic 3 loading card and card input rules

- **Artifact:** epics.md > Epic 3 > In scope, Story (line 198)
- **Source:** D12, F10; EXPERIENCE.md Component Patterns > `card-text`, `loading-card`; State Patterns (Cards); decision log, Reviewer gate lows (card input guard)
- **OLD:**
```
  - The story text, the 5 intro cards, and Level 1's line on its loading card.
```
- **NEW:**
```
  - The story text, the 5 intro cards, and Level 1's loading card, which shows the level name and its line (F10).
  - Card input (D12): all input, Back included, is ignored for the minimum of about 1.5 s †, and a press counts only if it began after the card appeared. Then the confirm glyph for the last-used device fades in, confirm advances one card, and Back skips the rest of the intro.
```
- **Rationale:** Epic 3 builds the first cards and the first loading card, so their input rules and content (D12, F10) start here. The replay skip on the loading card stays in Epic 6.

#### E-19: Epic 3 out-of-scope line names the gate boundary

- **Artifact:** epics.md > Epic 3 > Out of scope (line 204)
- **Source:** F5; EXPERIENCE.md Notes for epics
- **OLD:**
```
**Out of scope:** menus beyond what's needed to start and finish a level, saving, other levels.
```
- **NEW:**
```
**Out of scope:** menus beyond the bare title gate and what's needed to start and finish a level (the title menu, pause menu, level select and settings are Epic 6), saving, other levels.
```
- **Rationale:** Without this, "menus beyond what's needed" could be read as including or excluding the gate.

#### E-20: Epic 3 playable deliverable starts at the gate

- **Artifact:** epics.md > Epic 3 > Playable deliverable (line 208)
- **Source:** F5
- **OLD:**
```
**Playable deliverable:** Emberwood start to finish, with final art and audio.
```
- **NEW:**
```
**Playable deliverable:** Emberwood start to finish, from the title gate and the intro, with final art and audio.
```
- **Rationale:** The playtest build now starts at the gate (F5).

#### E-21: Epic 3 draft stories 6, 7 and 9

- **Artifact:** epics.md > Epic 3 > Draft stories (lines 223-226)
- **Source:** F2, D7, F3, F6, F5, D12
- **OLD:**
```
6. Make the pickup, marker and control-sign art.
7. Build the final HUD.
8. Add the Level 1 tune and sound effects.
9. Add the story text, the intro silhouette cards, and the Level 1 line on its loading card.
```
- **NEW:**
```
6. Make the pickup, marker and control-sign art, with the arcade key set and the position glyphs.
7. Build the final HUD, with the bell toast and the mute indicator.
8. Add the Level 1 tune and sound effects.
9. Build the bare title gate, then add the story text, the intro silhouette cards with their input rules, and the Level 1 loading card.
```
- **Rationale:** Existing stories carry the new scope, so nothing is renumbered. The gate joins story 9 because it leads straight into the intro.

#### E-22: Epic 4 warden bar (F1)

- **Artifact:** epics.md > Epic 4 > In scope, after the warden behaviour list (after line 245)
- **Source:** F1; EXPERIENCE.md Component Patterns > `hud-warden-bar`, HUD & Diegetic UI; DESIGN.md Components > `hud-warden-bar`
- **OLD:**
```
  - a full reset when Rowan respawns
```
- **NEW:**
```
  - a full reset when Rowan respawns
- **The warden bar** on the HUD (F1): "Warden of the First Seal" over a bar at the top centre, clear of the arena floor where the millstone shadows warn.
  - It fades in when the door shuts, drops with each hit, and has a notch at 15 of 30 HP, where phase 2 starts.
  - It stays through Rowan's death sequence, hides when he respawns at the door, and returns full when he enters again.
  - On the final hit it drains to empty and fades with the rest of the HUD.
```
- **Rationale:** F1 adds a HUD element that exists only for the warden, so it belongs with the first warden.

#### E-23: Epic 4 seal break hides the HUD, allows pause, honours reduced motion

- **Artifact:** epics.md > Epic 4 > In scope, seal-break moment (line 254)
- **Source:** M5, D17; EXPERIENCE.md State Patterns (Playing > In-level story moment; pause during a story moment), Game Feel & Juice
- **OLD:**
```
  Rowan can't be hurt during it, and attacks already in flight are removed; this has a unit test.
```
- **NEW:**
```
  Rowan can't be hurt during it, and attacks already in flight are removed; this has a unit test. The HUD fades out as it starts and stays hidden until the results. Pausing during it stops the simulation, which resumes where it was (M5). With reduced motion, the ember flash becomes a short fade (D17).
```
- **Rationale:** Epic 4 builds the first in-level story moment. M5 is a simulation rule that needs a test here. The flash's reduced-motion variant is built where the flash is built, and the setting UI stays in Epic 6.

#### E-24: Epic 4 draft stories 2 and 5

- **Artifact:** epics.md > Epic 4 > Draft stories (lines 274-277)
- **Source:** F1, M5
- **OLD:**
```
2. Build the warden's behaviour and attack order, with tests.
3. Build the arena layout and the door checkpoint.
4. Build the warden model and animations.
5. Build the seal-break moment.
```
- **NEW:**
```
2. Build the warden's behaviour and attack order, with tests, and the warden bar.
3. Build the arena layout and the door checkpoint.
4. Build the warden model and animations.
5. Build the seal-break moment, with the HUD fade-out.
```
- **Rationale:** Existing stories carry E-22 and E-23, so nothing is renumbered.

#### E-25: Epic 5 held beat, closing and all-bells input, Level 3 end order

- **Artifact:** epics.md > Epic 5 > In scope, Story (lines 315-317)
- **Source:** M5, D12; EXPERIENCE.md State Patterns (Results > Level 3; Cards), Component Patterns > `scrim`, Information Architecture (Results > title), Key Flows ("Marta finishes Harrowmere ruins", steps 6-9)
- **OLD:**
```
  - the held beat at the fallen bell: about 3 s †, no text, skippable on replays only. Rowan can't be hurt during it.
  - the closing card and the all-bells card. Their text is final (narrative design document); the cards are silhouettes built in the engine.
  - Level 3's end order: the held beat, the closing card, the all-bells card if earned, then the results
```
- **NEW:**
```
  - the held beat at the fallen bell: about 3 s †, no text, skippable on replays only. Rowan can't be hurt during it. The HUD fades out and stays hidden until the level ends; pausing during it stops the simulation, which resumes where it was (M5).
  - the closing card and the all-bells card. Their text is final (narrative design document); the cards are silhouettes built in the engine. They follow the card input rules from Epic 3, but Back skips them on replays only (D12).
  - Level 3's end order: the held beat, the closing card, the all-bells card if earned, then the results, over the last card scene dimmed by the scrim. After the results of a first play, the game returns to the title (the title menu is built in Epic 6).
```
- **Rationale:** The UX changes three things in this order: Level 3's results sit on the dimmed card scene, not the world; a first play then goes to the title; and these cards are not skippable on a first play.

#### E-26: Epic 5 draft story 9 ends on the results

- **Artifact:** epics.md > Epic 5 > Draft stories (line 338)
- **Source:** EXPERIENCE.md State Patterns (Results > Level 3)
- **OLD:**
```
9. Add the story lines, the held beat, the closing card and the all-bells card, in Level 3's end order.
```
- **NEW:**
```
9. Add the story lines, the held beat, the closing card and the all-bells card, in Level 3's end order, ending on the results over the dimmed last card scene.
```
- **Rationale:** Story 9 now carries E-25.

#### E-27: Epic 6 session flow

- **Artifact:** epics.md > Epic 6 > In scope, Session flow (lines 349-354)
- **Source:** D8, D9, D11, D14, D15, A1, Q7, F10, M5; EXPERIENCE.md Information Architecture, Component Patterns (`boot-loading-bar`, `confirm-dialog`, `level-select-row`, `results-stat`, `loading-card`, `notice-line`), State Patterns, Voice and Tone
- **OLD:**
```
- **Session flow:**
  - Title screen: Continue, Level select, Settings. The first Continue of a new save plays the intro once.
  - Pause menu: resume, restart level, settings, quit to level select.
  - Level select: finished levels plus the next unlocked one, with best time and bells found. Replays follow the replay-form rule (the form and abilities Rowan had on first arrival).
  - The all-bells card when the ninth bell is found on a replay, and watching it again from the level select.
  - The final results screen.
```
- **NEW:**
```
- **Session flow:**
  - Boot loading screen: the wordmark and a progress bar while shared assets load, with no text or tips (D8). It leads to the Epic 3 title gate, or to the device note.
  - Title screen, after the gate: Continue, Level select, Settings. The first Continue of a new save plays the intro once. Level select appears once Level 1 is finished.
  - Pause menu: resume, restart level, settings, quit to level select. On a first Level 1 play, before the level select unlocks, the last item reads "Quit to title" (D9). It opens with Resume focused, after an auto-pause too. Pause input is ignored on loading cards and story cards (M5).
  - Restart level and Quit ask a one-step confirm with Cancel focused (D9). Restart fades straight to the level start with run stats reset, without a loading card.
  - Level select: finished levels plus the next unlocked one, with best time and bells found. Replays follow the replay-form rule (the form and abilities Rowan had on first arrival). Focus starts on the level just played when arriving from results, otherwise on the next unlocked level, or on the first row when everything is finished.
  - The all-bells card when the ninth bell is found on a replay, and watching it again from an "All-bells card" row in the level select, shown once all 9 bells are found.
  - The replay loading card: once loading is done, the advance hint fades in and confirm skips the rest of the reading floor (F10).
  - The final results screen: the values stagger in, a confirm completes the stagger and the next one continues, and a "New best" tag marks a replay that beats the stored best (D11).
  - Notices, one static line each: storage refused, on the title menu (D15); audio locked after a gamepad passed the gate, on the title menu until a key or click (A1); gamepad unavailable after an error, on the pause and title menus (Q7).
```
- **Rationale:** These are the menu surfaces and states the UX added or settled for Epic 6. The bullet keeps the existing list form and wording, so existing references still match.

#### E-28: Epic 6 saving falls back to memory

- **Artifact:** epics.md > Epic 6 > In scope, Saving (line 355)
- **Source:** D15; EXPERIENCE.md State Patterns (Title menu > Storage refused), Browser Constraints ("Storage partitioning")
- **OLD:**
```
- **Saving:** automatic after each level, stored in the browser, with safe failure if storage is refused.
```
- **NEW:**
```
- **Saving:** automatic after each level, stored in the browser, with safe failure if storage is refused: progress lives in memory for the session, and the storage notice shows (D15).
```
- **Rationale:** D15 says what "safe failure" means here.

#### E-29: Epic 6 settings details

- **Artifact:** epics.md > Epic 6 > In scope, Settings (line 356)
- **Source:** D10, D17, Q5; EXPERIENCE.md Component Patterns (`slider`, `toggle`), State Patterns (Settings), Game Feel & Juice, Accessibility Floor ("Motion")
- **OLD:**
```
- **Settings:** music volume, effects volume, reduced motion, fullscreen.
```
- **NEW:**
```
- **Settings:** music volume, effects volume, reduced motion, fullscreen. Mute stays on the M key, not a settings row (D10).
  - Changes apply and save at once. Back returns to the title or the pause menu, whichever opened Settings.
  - Reduced motion takes its default for a new save from the browser's `prefers-reduced-motion` (Q5). It turns screen shake off, turns full-screen flashes into a short fade, and stops the last-heart pulse and the HUD icon shake; hit-stop and the 9 Hz blink stay (D17).
  - Fullscreen isn't saved, and the toggle shows the real state. If the browser refuses, the toggle snaps back and "Fullscreen isn't available here." shows until Settings closes (D10).
```
- **Rationale:** The row list stays as it was. D10 confirms mute isn't a row. Q5 and D17 widen what reduced motion does, and D10 adds the fullscreen-refused case.

#### E-30: Epic 6 device note with "Try anyway"

- **Artifact:** epics.md > Epic 6 > In scope, phone and tablet note (line 357)
- **Source:** D16, Q3; EXPERIENCE.md Component Patterns > `device-note`
- **OLD:**
```
- **A note for phone and tablet visitors.**
```
- **NEW:**
```
- **A note for phone and tablet visitors,** shown instead of the title gate when the primary pointer is coarse and there is no fine pointer (Q3). "Try anyway" continues to the gate, for tablets with a keyboard (D16).
```
- **Rationale:** Q3 sets how the note detects a device, and D16 adds a way past it.

#### E-31: Epic 6 credits rule and browser checks

- **Artifact:** epics.md > Epic 6 > In scope, The release (lines 363-364)
- **Source:** Q10, A1, A2, A3, Q9; EXPERIENCE.md "Browser checks on the Epic 6 private itch.io upload", Browser Constraints, Responsive & Platform ("itch.io embed")
- **OLD:**
```
  - an HTML5 build within itch.io's limits
  - asset credits from `docs/ASSETS.md`
```
- **NEW:**
```
  - an HTML5 build within itch.io's limits
  - asset credits from `docs/ASSETS.md`, on the itch.io page; a "Credits" row joins Settings if an asset licence requires in-game credit (Q10)
  - browser checks on a private itch.io upload, before the public release: a gamepad passing the title gate, the audio unlock that follows, and fullscreen refused from a gamepad (A1); the Esc that leaves fullscreen (A2); iframe focus (A3); storage partitioning; gamepad permission in the iframe; bound keys not scrolling the page; the 1280 × 720 embed with itch.io's fullscreen button (Q9)
```
- **Rationale:** Q10 decides where credits go. The A-items and Q9 are untested assumptions that the UX says to verify on the Epic 6 upload.

#### E-32: Epic 6 out of scope: screen readers

- **Artifact:** epics.md > Epic 6 > Out of scope (line 367)
- **Source:** Q6; EXPERIENCE.md Accessibility Floor ("Screen readers")
- **OLD:**
```
**Out of scope:** the desktop and Steam build, touch controls.
```
- **NEW:**
```
**Out of scope:** the desktop and Steam build, touch controls, screen-reader support beyond native menu buttons (Q6).
```
- **Rationale:** Q6 sets a v1 boundary. Stating it stops a settings or menu story from growing into accessibility work.

#### E-33: Epic 6 exit criterion for the browser checks

- **Artifact:** epics.md > Epic 6 > Exit criteria (line 373)
- **Source:** EXPERIENCE.md "Browser checks on the Epic 6 private itch.io upload", Browser Constraints (Verify column)
- **OLD:**
```
**Exit criteria:** performance targets met on the reference machines, and the game released on itch.io under the final title.
```
- **NEW:**
```
**Exit criteria:** performance targets met on the reference machines, the browser checks on the private itch.io upload behave as EXPERIENCE.md specifies, and the game released on itch.io under the final title.
```
- **Rationale:** Every row in the Browser Constraints table is marked "verify at Epic 6". This makes that check gate the release. It adds a criterion and changes no existing threshold.

#### E-34: Epic 6 draft stories 1-4 and 7

- **Artifact:** epics.md > Epic 6 > Draft stories (lines 377-383)
- **Source:** D8, D9, D11, D15, A1, Q7, F10, Q5, D16, Q9
- **OLD:**
```
1. Build the title screen with Continue, and the pause menu.
2. Build the level select, the replay-form rule and the save system.
3. Build the settings screen.
4. Add the phone and tablet note.
5. Run the performance pass on real hardware.
6. Choose and check the title, check the story names, and build the itch.io page.
7. Package the release build and check it against itch.io's limits.
```
- **NEW:**
```
1. Build the boot loading screen, the title screen with Continue and its notices, and the pause menu with its confirms.
2. Build the level select with its all-bells row, the final results screen, the replay-form rule, the replay loading-card skip and the save system.
3. Build the settings screen, with the reduced-motion default.
4. Add the phone and tablet note, with "Try anyway".
5. Run the performance pass on real hardware.
6. Choose and check the title, check the story names, and build the itch.io page.
7. Package the release build, check it against itch.io's limits, and run the browser checks on a private upload.
```
- **Rationale:** Existing stories carry E-27 to E-31, so nothing is renumbered. The final results screen had no story before; it joins story 2 because "New best" needs the save system.

#### E-35: Coverage heading includes UX surfaces

- **Artifact:** epics.md > Coverage check heading (line 388)
- **Source:** EXPERIENCE.md Information Architecture
- **OLD:**
```
## Coverage check: every GDD mechanic lands in an epic
```
- **NEW:**
```
## Coverage check: every GDD mechanic and UX surface lands in an epic
```
- **Rationale:** The table now traces UX surfaces too (E-38). No other document links to this heading (checked with grep).

#### E-36: Coverage row for control signs

- **Artifact:** epics.md > Coverage table (line 398)
- **Source:** F3, F6
- **OLD:**
```
| Control signs | 1 (placement), 3 (art) |
```
- **NEW:**
```
| Control signs | 1 (placement), 3 (art: arcade key set, position glyphs) |
```
- **Rationale:** This traces E-15.

#### E-37: Coverage rows for results and the menus

- **Artifact:** epics.md > Coverage table (lines 404-405)
- **Source:** D9, D11; EXPERIENCE.md Information Architecture
- **OLD:**
```
| Results screen | 1 (basic), 6 (final) |
| Title, Continue, pause, level select, replay-form rule, saving, settings | 6 |
```
- **NEW:**
```
| Results screen | 1 (basic), 6 (final: stagger, "New best") |
| Title menu, Continue, pause menu with its confirms, level select with its all-bells row, replay-form rule, saving, settings | 6 |
```
- **Rationale:** This traces E-27 and E-34.

#### E-38: Coverage rows for the new UX surfaces and elements

- **Artifact:** epics.md > Coverage table, after the last row (line 414)
- **Source:** F1, F2, F5, F9, D7, D8, D12, D14, D15, D16, D17, A1, Q5, Q7, Q9, Q10, F10, M5; EXPERIENCE.md Information Architecture, HUD & Diegetic UI, Notes for epics
- **OLD:**
```
| Performance targets | 6 |
```
- **NEW:**
```
| Performance targets | 6 |
| Overlay colours and typefaces (DESIGN.md tokens) | 0 (values), 1 (first use), 3 (judged in play) |
| HUD: hearts, ember meter, weapon timer | 1 (placeholder), 3 (final) |
| HUD: bell toast, mute indicator | 3 |
| HUD: warden bar | 4 |
| Pause, auto-pause triggers, menu input actions, last-used device | 1 (pause during story moments: 4, 5) |
| Title gate | 3 |
| Boot loading screen, device note with "Try anyway" | 6 |
| Card input rules | 3 (intro), 5 (closing, all-bells), 6 (rewatch) |
| Loading card: level name and line, replay skip | 3, 5 (name and line), 6 (replay skip) |
| Notices: storage refused, audio locked, gamepad unavailable, fullscreen refused | 6 |
| Reduced motion: default and scope | 4 (seal-break flash), 6 (setting) |
| Credits rule | 6 |
| Browser checks on the private itch.io upload | 6 |
```
- **Rationale:** Every UX surface or element that has no row yet gets one, using the table's existing "Epic (note)" style.

---


### 4.6 Other edits (facilitator)

#### X-01 — epics.md: level editor is settled (amends E-12)
- **Artifact:** epics.md › Epic 1 › Depends on (line 101). The same line as E-12, so this replaces E-12's NEW block.
- **Source:** game-architecture.md:338, 658-662 (Tiled 1.12.x settled by the developer on 2026-11-13)
- **OLD:**
```
**Depends on:** Epic 0 (the scaffold); the level editor choice (LDtk or Tiled).
```
- **NEW (E-12 and X-01 combined):**
```
**Depends on:** Epic 0 (the scaffold, and the overlay colours and typefaces in DESIGN.md); Tiled 1.12.x, the level editor settled in the architecture (game-architecture.md:338).
```
- **Rationale:** The architecture recorded the choice; epics.md still reads as open.

#### X-02 — CLAUDE.md: drop the level editor from "Still open"
- **Artifact:** CLAUDE.md › Settled stack (your file; applied only with your approval)
- **OLD:**
```
Still open: the image model for reference art, the audio tools, and the level editor (LDtk or Tiled). Do not pick these silently.
```
- **NEW:**
```
Still open: the image model for reference art and the audio tools. Do not pick these silently. The level editor is Tiled 1.12.x (settled in the architecture).
```
- **Rationale:** Same as X-01. Agents read CLAUDE.md first, so a stale "still open" there invites re-deciding a settled choice.

#### X-03 — Architecture: a refused fullscreen request is not a failure
- **Artifact:** game-architecture.md › Error handling table, "Optional feature unavailable" row (line 701)
- **Source:** facilitator decision 3.2-3; A1; EXPERIENCE.md › Browser Constraints (fullscreen)
- **OLD:**
```
| **Optional feature unavailable** | Gamepad refused inside the itch.io iframe; storage blocked; audio can't start; fullscreen denied | Wrapped at the feature's edge in `platform/`. The first failure turns the feature off for the session and logs one warning. The game continues (GDD resilience rule). |
```
- **NEW:**
```
| **Optional feature unavailable** | Gamepad refused inside the itch.io iframe; storage blocked; audio can't start; fullscreen denied | Wrapped at the feature's edge in `platform/`. The first failure turns the feature off for the session and logs one warning. The game continues (GDD resilience rule). A request refused only for lack of user activation (a fullscreen toggle or audio unlock from a gamepad, UX A1) is not a failure: the feature stays available and the next key press or click can retry. |
```
- **Rationale:** Otherwise a gamepad player who presses the fullscreen toggle once would lose fullscreen for the whole session. A-17 already makes the same distinction for audio ("locked" vs "failed"); this states it once for every feature.

#### U-01 — UX spines: epics citations by section, not line
- **Artifact:** DESIGN.md:106, DESIGN.md:178, EXPERIENCE.md:408, EXPERIENCE.md:409
- **Change:** replace `epics.md:191` → `epics.md › Epic 3 › Final HUD`; `epics.md:47` → `epics.md › Epic 0 › sample story card`; `epics.md:192-200` → `epics.md › Epic 3 › In scope`; `epics.md:349-356` → `epics.md › Epic 6 › In scope`; `epics.md:37-44` → `epics.md › Epic 0 › style guide`.
- **Rationale:** The E-edits move most lines in epics.md, so line citations would go stale. Section names survive later edits too.

#### U-02 — UX spines: warden-bar label (only if DN-1 is (a) or (b))
- **Artifact:** DESIGN.md:209 (`hud-warden-bar` anatomy); EXPERIENCE.md:114 (Voice and Tone, HUD row); EXPERIENCE.md:354 (Tomás step 3); `mockups/key-hud.html` label string. The Key Flow heading at EXPERIENCE.md:348 names the boss, not on-screen text, and stays.
- **Change:** "Warden of the First Seal" → "The Warden" (DN-1 a), or the label removed with its `label`, `label-type` and `label-gap` tokens (DN-1 b). The same string changes in G-05 and E-22 at apply time. Log the change in the UX `.decision-log.md` as a correction through this proposal.
- **Rationale:** The narrative keeps "seal" off screen in version one (narrative-design.md:860). With DN-1 (a) or (b), N-03 is dropped.

### 4.7 Apply-time adjustments by decision

| Decision | If the recommended option is approved | Otherwise |
| --- | --- | --- |
| DN-1 | Apply U-02 with "The Warden"; G-05 and E-22 use "The Warden"; drop N-03. | (b): U-02 removes the label; G-05 and E-22 say "an unlabelled bar". (c): keep the label and apply N-03. |
| DN-2 | A-14, A-15, A-20, A-22, P-02 and P-08 name `core/uiTimings.ts` instead of `ui/timings.ts`, with no `main.ts` injection; the card minimum and loading-card floor (GDD †) live there too; EXPERIENCE.md's UI timings line names the new path. | (b): apply as drafted. (c): A-20 is split three ways and EXPERIENCE.md's "one module" line is reworded. |
| DN-3 | A-22 and P-02 as drafted. | A single `ui/components.ts` replaces the folder in A-22 and P-02. |
| DN-4 | E-27 gains one bullet: the error panels (bug: "Something went wrong" and "Restart level"; retry for boot and level loads) built with the other menus. The coverage table (E-38) gains one row. | (b): the same bullet goes into Epic 1's scope instead. |
| 3.2 vetoes | A vetoed item is skipped; X-01 falls back to E-12's NEW as drafted. | — |

## 5. Implementation Handoff

**Scope: Moderate.** These are planning changes across five epics, the architecture and the GDD. No backlog exists yet, so nothing needs reorganising and no PM/Architect replan is needed. The architecture edits are proposals that become decisions when you approve this document.

| Role | Responsibility |
| --- | --- |
| Developer (Emilijan) | Answers DN-1 to DN-4, vetoes any of 3.2, approves the proposal. |
| Developer agent (this session, after approval) | Applies every approved edit in this order: GDD, GDD decision log, narrative, architecture, project context, epics, UX spines, CLAUDE.md. Then it checks that each OLD block is gone and each NEW block is present, that every frontmatter block still parses, and that no `{token}` reference or mock link broke. |
| Architect (`gds-agent-game-architect`) | No separate step. The A-edits are drafted in the architecture's own structure, and `gds-check-implementation-readiness` is the cross-check. |
| Scrum master / developer (`gds-sprint-planning`) | After the readiness check, generates `sprint-status.yaml` from the edited epics. |

**Success criteria**

1. Every approved edit is applied and verified in its file; vetoed ones are recorded as skipped.
2. The GDD, the narrative, the architecture, the epics and the UX spines agree on the items in 2.3. There are no "Warden of the First Seal" strings on screen unless DN-1 (c) was chosen, no `LDtk or Tiled`, and no mute row in the GDD's settings list.
3. `gds-check-implementation-readiness` reports no critical finding caused by these changes.
4. Then Epic 0 can start, once you approve it, per CLAUDE.md.

## Appendix: Change-analysis checklist record

| Item | Status | Note |
| --- | --- | --- |
| 1.1 Triggering story | N/A | Pre-implementation; the trigger is the UX run, not a story. |
| 1.2 Core problem | Done | New requirements and resolved contradictions from the UX pass (Section 1). |
| 1.3 Evidence | Done | EXPERIENCE.md Notes; review-rubric.md; three full-document drafting passes. |
| 2.1 Current epic | N/A | No epic in progress. |
| 2.2 Epic-level changes | Done | Scope and exit-criteria additions in Epics 0, 1, 3, 4, 5, 6 (2.1). |
| 2.3 Remaining epics | Done | All seven epics reviewed; Epic 2 unaffected. |
| 2.4 Obsolete or new epics | Done | None. |
| 2.5 Order or priority | Done | Unchanged; the title gate moves from Epic 6 into Epic 3 (F5). |
| 3.1 PRD | N/A | No PRD; GDD checked instead (G-edits). |
| 3.2 Architecture | Action-needed | A-01 to A-29, X-03; DN-2 and DN-3 open. |
| 3.3 UI/UX | Action-needed | U-01, U-02; DN-1 open. |
| 3.4 Other artifacts | Action-needed | project-context.md (P-edits), CLAUDE.md (X-02), GDD decision log (G-19). No CI, deployment or infrastructure exists yet. |
| 4.1 Direct adjustment | Viable | Effort low, risk low. |
| 4.2 Rollback | Not viable | Nothing to roll back. |
| 4.3 MVP review | Not needed | MVP grows slightly with approved UX items. |
| 4.4 Path | Done | Option 1. |
| 5.1 to 5.5 | Done | Sections 1 to 5 of this document. |
| 6.1 Checklist complete | Done | |
| 6.2 Proposal accuracy | Done | OLD blocks checked against their files; groups apply cleanly in order. |
| 6.3 Approval | Pending | |
| 6.4 sprint-status.yaml | N/A | Does not exist yet; `gds-sprint-planning` creates it from the edited epics. |
| 6.5 Next steps | Pending | After approval. |

## Implementation record (2026-11-13)

**Approved by Emilijan on 2026-11-13** ("Yes, apply it"), with DN-1 to DN-4 as recorded in 3.3 and no vetoes on 3.2.

**Applied: 100 edits.** Each NEW block was checked as present after applying; each OLD block was matched exactly once before replacing.

| Artifact | Applied | Adjusted at apply time (4.7) |
| --- | --- | --- |
| gdd.md | G-01 to G-18 | G-05 label → "The Warden" (DN-1) |
| GDD decision-log.md | G-19 | — |
| narrative-design.md | N-01, N-02 | — |
| game-architecture.md (now v1.1) | A-01 to A-29, A-22b (new: `core/uiTimings.ts` in the source tree), X-03 | A-14, A-15, A-20, A-22, A-27 → `core/uiTimings.ts`, no `main.ts` injection (DN-2) |
| project-context.md | P-01 to P-10 | P-02, P-07 → `core/uiTimings.ts` (DN-2) |
| epics.md | E-01 to E-38 except E-12; X-01 in its place | E-22 label → "The Warden" (DN-1); E-27 + error-panels bullet, E-38 + error-panels row (DN-4) |
| UX spines and mock | U-01, U-02, plus the DN-2 path in EXPERIENCE.md and a "folded in" note on its notes section | Logged in the UX `.decision-log.md` |

**Skipped:**

- N-03, dropped by DN-1.
- E-12, superseded by X-01.
- X-02: CLAUDE.md already listed only the image model and the audio tools as open.

**Checks after applying:**

- Frontmatter parses in all six edited planning files. Code fences are balanced.
- No `ui/timings` reference remains.
- No on-screen "Warden of the First Seal" string remains. The Key Flow heading in EXPERIENCE.md and the GDD section title still name the boss, which is not on-screen text.

**Found after applying, then fixed at the developer's request (2026-11-13):** gdd.md › Dependencies, the level-editor row, changed from "Level editor (LDtk or Tiled) … Not chosen" to "Tiled 1.12.x, chosen 2026-11-13 (game-architecture.md, decision 9)". This is the same fix X-01 made in epics.md.

**Next:** `gds-check-implementation-readiness`, then `gds-sprint-planning` to create `sprint-status.yaml`. Then Epic 0 can start, once the developer approves it.

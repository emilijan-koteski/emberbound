---
title: Sprint change proposal: agentic working agreement
date: 2026-11-14
status: approved (developer, 2026-11-14)
scope: moderate
mode: batch
trigger: developer's process review after story 0.10
---

# Sprint change proposal: agentic working agreement (2026-11-14)

## 1. Issue summary

**Trigger:** the developer's review of the pace after story 0.10 (committed `2475f2f`).

**Type:** process change, not a design or scope change. The game, its requirements, its look and its tuned numbers do not change.

**Problem:** one story takes about an hour of the developer's attention. Stories 0.1 to 0.9 ran from 12:03 to 21:07 on 2026-11-14. With 132 stories planned, that is about 130 hours, nearly all of them with the developer approving each step. The cost comes from the process, not the work:

- every story runs create, dev, a full parallel review, triage, a three-round critic loop and a commit, each waiting on the developer;
- stories are small (0.13 and 0.14 are each well under an hour of work);
- dev runs at xhigh effort for every story;
- nothing says the agent writes the levels, so Story 1.26 reads as hand work in Tiled.

**Evidence:** git log times for 0.1 to 0.10; sprint-status.yaml (132 stories); epics.md (about 70 acceptance criteria run a three-round critic loop); CLAUDE.md "After any visual change, run the critic loop".

## 2. Impact analysis

### Epics

No epic is added, removed or resequenced. Exit criteria are unchanged. Every epic's stories are merged into fewer, larger stories (section 4.1). Each merged story keeps every acceptance criterion of the stories it absorbs.

### Stories

- 10 done (0.1 to 0.10). 122 left become 56, for 66 in total.
- Six stories gain or change acceptance criteria: 1.2, 1.26, 3.1, 5.3, 5.5 (who writes the level) and 4.15 (takes the full critic loop that 4.10 and 4.12 drop).
- Every non-gate critic-loop acceptance criterion now runs one round (section 4.3), through one rule in the epics header rather than about 70 separate edits.

### Artifact conflicts

| Artifact | Conflict | Change |
| --- | --- | --- |
| `gdd.md` › Development Epics › The critic loop | "used after every visual change", three rounds | Full loop at gates; one round elsewhere |
| `requirements-inventory.md` › PR14 | Quotes the same rule | Adds the 2026-11-14 amendment |
| `epics.md` › Rules for every epic | Same rule; no working agreement | Adds the working agreement and the merge map |
| `game-architecture.md` › Key decisions, Level Data | "authored in Tiled" | Agent writes `.tmj` directly; Tiled opens it for hand edits |
| `project-context.md` › Testing rules | "For any visual change: run the critic loop… at most 3 rounds" | Same split as the GDD |
| `CLAUDE.md` › How to work, Visual work | No approval gates, review cadence or effort policy; critic loop after every visual change | Adds the working agreement |
| `sprint-status.yaml` | 122 open story keys | 56 merged keys, tagged with effort, gate and human input |
| `docs/PROJECT_BRIEF.md` § 8 | "after any visual change" | Unchanged. The BMad artifacts win over the brief (CLAUDE.md) |
| UX spines, narrative | None | N/A |

### Technical impact

None on code. Story 1.2 gains one acceptance criterion: the compiler accepts a `.tmj` that Tiled never saved, so the agent can write levels by hand.

## 3. Recommended approach

**Direct adjustment** (checklist option 1). Rollback: not viable, nothing built is wrong. MVP review: not needed, scope is unchanged.

- **Effort:** low. One pass of document edits; no code.
- **Risk:** medium. Fewer human checkpoints mean a mistake can run for up to three stories before review catches it. Tests and `make check` still run on every story, and every gate is still human.
- **Timeline:** the developer's time per story falls from about an hour of approvals to one command and a glance at the result. Machine time per story may grow, since merged stories are larger.

**Developer's choices (2026-11-14):**

1. No unattended loop. One command, "next story", runs a whole story end to end.
2. Merge to about 65 stories in total, not 50: about 55 left, 2 to 4 originals each.
3. The agent writes `.tmj` files directly. Tiled stays the only level source.
4. Full parallel code review every 3 stories and before every gate.

**Decisions made for the developer** (veto any):

| # | Decision | Why |
| --- | --- | --- |
| D1 | Merge with a map in `epics.md`, not by rewriting story text | Rewriting 122 stories risks losing acceptance criteria. The create step builds one story file from the absorbed stories' text. |
| D2 | A merged story keeps the id and position of its first original (`1.24` absorbs `1.25`) | References like "Story 1.25" across the artifacts still resolve, through the map. |
| D3 | `bmad-build-auto` is not used | It fails to start (`planning_artifacts` defined in both the bmm and gds modules), uses its own `stories.yaml` and spec format, reviews every story, and wants a feature branch. |
| D4 | "Next story" may also take "next N stories" or "to the gate" | Same steps, run in sequence. It stops at a gate, at human input, at a failing check it can't fix, or at the count. Ignore it if you only ever want one. |
| D5 | Gates are human checkpoints only: 0.15, 1.28, 2.11, 3.21, 4.15, 5.17, 6.19, 6.21 | These need the developer's eyes, hands or hardware: approve the look, sign off the feel, playtests, the reference machines, the release. |
| D6 | Human-input stories pause at the step that needs the developer (Gemini or Tripo runs, Blender open, accounts, the audio-tool choice) and ask, then continue | Known: 2.1, 2.3, 3.7, 3.15, 4.10, 6.17. The create step flags any others. |
| D7 | Effort tags: xhigh for 1.1, 1.6, 1.24, 4.3, 4.6, 5.1; high for every other dev pass; medium for create and review | 1.1 and 1.4 build the fixed step; 1.6 and 1.7 are movement and moving platforms; 1.24 is the jump search; 4.3 is the warden scheduler; 4.6 is ledge grab; 5.1 is waterwheels. |
| D8 | Small merged stories fold create into dev: one subagent writes the story file, then implements it | The developer allowed this for small stories. "Small" means every absorbed story has three or fewer acceptance criteria. |
| D9 | Non-gate critic loop: one round. Capture, look at every shot, fix clear breaks, run the readability check. Before and after shots are saved and listed in the story file. The developer sees them at the next gate. | Keeps "look before you claim it" and the readability check (NFR27). Drops two of the three rounds and the approval wait. |
| D10 | Full three-round critic loop at 0.15, 2.11, 3.19 (with 3.20), 4.15 (taking 4.10 and 4.12's loops), 5.17, and after a three.js upgrade | These are the look gates in the GDD's exit criteria, plus the existing upgrade rule. |
| D11 | Review findings follow the no-deferred rule: fix now, name the planned story that covers it, or drop with a reason | Standing preference. |
| D12 | The developer still approves each epic's start | CLAUDE.md and the GDD both require it. The gate story at the end of each epic is where it happens. |

## 4. Detailed change proposals

### 4.1 Story merge map (`epics.md`, new section; `sprint-status.yaml`)

`G` = human gate. `H` = needs the developer's hands partway. Effort is the dev pass. Where a cell shows no merge, the story stands alone.

| New story | Absorbs | Effort | Flag |
| --- | --- | --- | --- |
| **Epic 0** | | | |
| 0.11 Add shadows, and the outline and grading passes | | high | |
| 0.12 Build the test scene, the sample story card and the DESIGN.md overlay update | 0.12, 0.13, 0.14 | high | |
| 0.15 Run the critic loop on the test scene and approve the look | | high | G |
| **Epic 1** | | | |
| 1.1 Build the simulation core and step it from a fixed 60 Hz loop with keyboard input | 1.1, 1.4 | xhigh | |
| 1.2 Author, compile and load levels | 1.2, 1.3 | high | |
| 1.5 Draw interpolated grey boxes and follow Rowan with the gameplay camera | 1.5, 1.8 | high | |
| 1.6 Move Rowan to the feel table, with one-way ledges and moving platforms | 1.6, 1.7 | xhigh | |
| 1.9 Read gamepads, route pause and menu actions, and show the placeholder pause | 1.9, 1.10, 1.11 | high | |
| 1.12 Ember spit, spikes and hearts, checkpoints, pits and the exit | 1.12, 1.13, 1.14 | high | |
| 1.15 Debug overlay, URL parameters, cheats and input recording | | high | |
| 1.16 Add the walker and hit feedback | 1.16, 1.17 | high | |
| 1.18 Add the thorn flyer and the rooted spitter | 1.18, 1.19 | high | |
| 1.20 Embers, bells, the triple shot, the placeholder HUD and basic results | 1.20, 1.21, 1.22, 1.23 | high | |
| 1.24 Prove every marked jump, and check the main path, metrics and caps | 1.24, 1.25 | xhigh | |
| 1.26 Build grey-box Level 1 with its control signs | 1.26, 1.27 | high | |
| 1.28 Measure the grey-box pace, sign off the feel and close the epic | | high | G |
| **Epic 2** | | | |
| 2.1 Clear Tripo's terms, set up the Blender MCP, and make Rowan's views and mesh | 2.1, 2.2 | high | H |
| 2.3 Clean up and rig Rowan | 2.3, 2.4 | high | H |
| 2.5 Animate Rowan's movement and action clips | 2.5, 2.8 | high | |
| 2.6 Export Rowan and show him on the look-dev page | 2.6, 2.7 | high | |
| 2.9 Put Rowan in the grey-box level, following every gameplay state | 2.9, 2.10 | high | |
| 2.11 Run the hero critic loop and get the developer's sign-off | | high | G |
| **Epic 3** | | | |
| 3.1 Finalise Emberwood's layout and dress its ground, ledges, platforms and spikes | 3.1, 3.2 | high | |
| 3.3 Build Emberwood's backdrops, dusk lighting and the wedding glade | 3.3, 3.4 | high | |
| 3.5 Make the waymarkers, control-sign icons and pickup art | 3.5, 3.6 | high | |
| 3.7 Build the walker, thorn flyer and rooted spitter models | 3.7, 3.8, 3.9 | high | H |
| 3.10 Start sound, add the title gate and Emberwood's loading card | 3.10, 3.11, 3.12 | high | |
| 3.13 Build the intro cards and play the intro after the gate | 3.13, 3.14 | high | |
| 3.15 Add Emberwood's music and ambience | | high | H |
| 3.16 Add the hero, enemy, world, interface and bell sounds | 3.16, 3.17, 3.18 | high | |
| 3.19 Finish the HUD and run the full critic loop on the Level 1 spots | 3.19, 3.20 | high | |
| 3.21 Playtest Emberwood, fix the findings and get the developer's approval | 3.21, 3.22 | high | G |
| **Epic 4** | | | |
| 4.1 Check the symbols, and build the warden arena, door and body | 4.1, 4.2 | high | |
| 4.3 Build the warden fight: both phases, defeat and the warden bar | 4.3, 4.4, 4.5 | xhigh | |
| 4.6 Add ledge grab and the story director with the seal break | 4.6, 4.7 | xhigh | |
| 4.8 Build Rowan stage 2 and animate hang and climb-up | 4.8, 4.9 | high | |
| 4.10 Build the millhouse arena art and the Drowned Miller | 4.10, 4.11 | high | H |
| 4.12 Stage the seal break, with its music and sounds | 4.12, 4.13, 4.14 | high | |
| 4.15 Playtest the warden and close the epic | | high | G |
| **Epic 5** | | | |
| 5.1 Add waterwheel platforms, deep water and the piercing shot | 5.1, 5.2 | xhigh | |
| 5.3 Lay out grey-box Level 2 and join the warden arena | 5.3, 5.4 | high | |
| 5.5 Lay out grey-box Level 3 and route the campaign through the loading cards | 5.5, 5.6 | high | |
| 5.7 Play the fallen-bell beat, the closing cards and Level 3's end order | 5.7, 5.8, 5.9 | high | |
| 5.10 Build and dress the Drowned Mill, with the piercing-shot pickup | 5.10, 5.11, 5.12 | high | |
| 5.13 Build and dress Harrowmere ruins | 5.13, 5.14 | high | |
| 5.15 Add the Level 2 and 3 audio | 5.15, 5.16 | high | |
| 5.17 Run the critic loop across Levels 2 and 3, and playtest version one | 5.17, 5.18 | high | G |
| **Epic 6** | | | |
| 6.1 Settings model, versioned save, and saving progress | 6.1, 6.2, 6.3 | high | |
| 6.4 Build the widgets, the boot loading screen and the device note | 6.4, 6.5, 6.6 | high | |
| 6.7 Add the title menu and the level select | 6.7, 6.8 | high | |
| 6.9 Replays, replay-end routing and the final results screen | 6.9, 6.10, 6.11 | high | |
| 6.12 Build the pause menu, settings screen, and bug and Retry panels | 6.12, 6.13, 6.14 | high | |
| 6.15 Add the perf recorder and complete the smoke checks and journeys | 6.15, 6.16 | high | |
| 6.17 Check and show the final title, and prepare the itch.io page | 6.17, 6.18, 6.20 | high | H |
| 6.19 Run the performance pass on the reference machines | | high | G |
| 6.21 Add `make release`, check the private upload and release version one | 6.21, 6.22, 6.23 | high | G |

**Order inside a merged story:** the absorbed stories' acceptance criteria run in their original order. Before starting, the create step checks that every absorbed story's "Depends on" is done.

### 4.2 Working agreement (`epics.md` › Rules for every epic; `CLAUDE.md` › How to work)

**epics.md, Rules for every epic.** OLD:

```
- An epic starts only when the previous epic's exit criteria are met and the developer approves.
- Every simulation rule gets a unit test.
- After any visual change, the critic loop defined in `gdd.md` (Development Epics) runs.
```

NEW:

```
- An epic starts only when the previous epic's exit criteria are met and the developer approves.
- Every simulation rule gets a unit test.
- The critic loop defined in `gdd.md` (Development Epics) runs in full in gate stories and after a three.js upgrade. In every other story, an acceptance criterion that says "the critic loop runs (at most 3 rounds)" means one round: capture the spots, look at every shot, fix clear breaks, run the readability check, and save and list the before and after shots in the story file for the developer to see at the next gate (sprint change proposal 2026-11-14, agentic).
- Stories are built and reviewed under the working agreement below.
```

A new section, **Working agreement and story merge map (2026-11-14)**, goes after "Rules for every epic". It holds:

- the merge table from 4.1;
- the gate, human-input and effort definitions from D5 to D8;
- "A merged story keeps every acceptance criterion of the stories it absorbs. A reference to an absorbed story (for example 'Story 1.25') means the merged story that holds it."

**CLAUDE.md › How to work.** Add after the BMad bullet:

```
- **"Next story"** runs one story end to end, with no approval between steps:
  1. Take the first story in `sprint-status.yaml` that is not done. If it is a gate (`G`), stop and walk the developer through it.
  2. Create the story file with `gds-create-story` in a subagent at medium effort. A small story (every absorbed story has three or fewer acceptance criteria) folds this into step 3.
  3. Implement it with `gds-dev-story` in a subagent at the story's effort tag: high by default, xhigh where `sprint-status.yaml` says so.
  4. If the story needs the developer's hands (`H`: Gemini or Tripo runs, Blender open, an account, a choice CLAUDE.md reserves), stop at that step, ask, and continue once it's done.
  5. Run `make check` and fix until it passes. Commit on master.
  6. After every third story since the last review, and before any gate, run `gds-code-review` in a subagent at medium effort on the commits since the last review. Fix each finding, name the planned story that covers it, or drop it with a reason.
  "Next N stories" and "to the gate" repeat this, stopping at a gate, at human input, at a check it can't fix, or at the count.
- Subagents run at the effort levels above. How BMad splits work across subagents inside a workflow is left to BMad.
```

**CLAUDE.md › Visual work.** OLD:

```
- After any visual change, run the critic loop from the brief: screenshot fixed spots, compare with the reference and style guide, list the top three problems, fix, repeat. Stop after three rounds and report.
```

NEW:

```
- After any visual change, take the fixed screenshots and look at every one: one round, fix clear breaks, run the readability check, and save the before and after shots in the story file. The full critic loop (three rounds, then report) runs in gate stories and after a three.js upgrade.
```

### 4.3 Critic loop (`gdd.md`, `requirements-inventory.md`, `project-context.md`)

**gdd.md › Development Epics.** OLD: `**The critic loop**, used after every visual change and in every exit criterion that mentions it:`

NEW: `**The critic loop**, used in full in every exit criterion that mentions it and in each epic's gate story. After other visual changes it runs one round, and its shots are shown to the developer at the next gate (sprint change proposal 2026-11-14, agentic):`

**requirements-inventory.md › PR14.** Append: `Amended 2026-11-14 (sprint change proposal, agentic): full loop in gate stories and exit criteria; one round after other visual changes, shots shown at the next gate.`

**project-context.md › Testing rules.** OLD:

```
- **For any visual change:** run the critic loop with `make shots ROUND=n`: at most 3 rounds, then report before and after. It runs the look-dev checks in `tests/e2e/lookdev/` first.
```

NEW:

```
- **For any visual change:** run one round of `make shots ROUND=1`, look at every shot, fix clear breaks, run the readability check, and list the before and after shots in the story file. The full critic loop (at most 3 rounds, then report) runs in gate stories and after a three.js upgrade. `make shots` runs the look-dev checks in `tests/e2e/lookdev/` first.
```

**epics.md, Story 4.15.** The acceptance criterion "**When** a last critic-loop round runs on the arena and seal-break spots" becomes "**When** the full critic loop runs on the arena, millhouse art, Drowned Miller and seal-break spots (taking over the loops of 4.10 and 4.12)".

### 4.4 Agent-authored levels (`epics.md` 1.2, 1.26, 3.1, 5.3, 5.5; `game-architecture.md`)

**Story 1.2,** a new acceptance criterion after the Tiled project criterion:

```
**Given** a `.tmj` file written by hand or by the agent, never opened in Tiled
**When** `make levels` compiles it
**Then** it compiles exactly as a Tiled-saved file would: the compiler needs only the layers, classes and properties in Level Data, never fields only Tiled's editor writes, and a Vitest fixture written as plain JSON proves it
```

**Story 1.26,** a new first acceptance criterion:

```
**Given** the teaching order below and the level rules in `CONFIG.levels`
**When** the agent builds Level 1
**Then** the agent writes `levels/emberwood.tmj` directly, sketching each section as an ASCII grid in the story file first, and iterates until `make levels` and `make test` pass (compile validation, the jump search and the coverage check) and its screenshots read correctly
**And** the developer plays it at the epic gate (Story 1.28) and gives notes, which the agent applies; the developer may also edit the file in Tiled
```

**Stories 3.1, 5.3 and 5.5,** the same pattern in one line, appended to each story's first acceptance criterion:

```
**And** the agent writes and edits the `.tmj` directly, as in Story 1.26; the developer's notes come from the gate playtest
```

**game-architecture.md › Key architectural decisions.** OLD: `- **Levels are authored in Tiled and compiled at build time** into a validated game format.`
NEW: `- **Levels are Tiled JSON (`.tmj`), written by the agent and editable in Tiled, compiled at build time** into a validated game format.`

**game-architecture.md › Level Data.** OLD: `- **Editor:** Tiled 1.12.x. Levels are authored as Tiled JSON (`.tmj`, with `.tsj` tilesets) under `levels/`.`
NEW: `- **Editor:** Tiled 1.12.x. Levels are Tiled JSON (`.tmj`, with `.tsj` tilesets) under `levels/`. The agent writes them directly; the developer may edit them in Tiled. The compiler depends only on the fields listed here, so a file Tiled never saved compiles the same way (sprint change proposal 2026-11-14, agentic).`

### 4.5 Sprint status (`sprint-status.yaml`)

The 122 open story keys are replaced by the 56 merged keys in 4.1, in the same epic order. Each key gets a comment such as `# merges 1.24, 1.25 · effort: xhigh` or `# GATE`. The header notes point to this proposal. Done stories and epic keys are unchanged.

## 5. Implementation handoff

**Scope: moderate.** The backlog is reorganised; no design is replanned.

| Role | Does |
| --- | --- |
| Developer agent (this session) | Applies 4.2 to 4.5 to the artifacts, CLAUDE.md and sprint status, and commits on master |
| Developer (Emilijan) | Approves this proposal; says "next story" to start 0.11 |

**Success criteria:**

1. `sprint-status.yaml` has 56 open stories, and every original story appears in exactly one merged story.
2. CLAUDE.md, `project-context.md`, the GDD, PR14 and `epics.md` agree on the critic-loop split.
3. "Next story" on 0.11 runs to a commit with no approval prompts except an `H` step or a gate.
4. Measured after Epic 1: the developer's attention is spent at gates and human-input steps, not inside stories.

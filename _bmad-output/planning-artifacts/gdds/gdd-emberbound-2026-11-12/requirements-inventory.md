---
title: "Emberbound (working title) - Requirements Inventory"
purpose: "Traceability base for epics.md. Every story cites the IDs it delivers."
created: 2026-11-13
sources:
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
  - _bmad-output/project-context.md
  - docs/PROJECT_BRIEF.md
---

# Emberbound: requirements inventory

**What this file is:**

- The full requirements inventory behind `epics.md`, produced in step 1 of `gds-create-epics-and-stories` (2026-11-13). `epics.md` carries the coverage map and the stories; this file carries every requirement with its source citation.
- It is an extract, not a new source of truth. When a requirement here and its source disagree, the source wins; fix this file.
- Refreshed 2026-11-13 by `sprint-change-proposal-2026-11-13-readiness.md`: FR27, FR52, FR64, FR66, FR84–FR86, FR90, FR91, FR93, FR94, NR79 and the AR items changed by architecture v1.2 and v1.3 now match their sources.
- Refreshed 2026-11-14 by `sprint-change-proposal-2026-11-14-style-lock.md`: FR210, NR15, NR56, NR100 and NFR28 now match the signed-off concept and the bell decision; gaps 14 and 20 are resolved.
- Citations: `gdd.md:` the GDD; `narrative-design.md:` the narrative design; `ga:` the game architecture; `EXPERIENCE.md:` and `DESIGN.md:` the UX spines; `PROJECT_BRIEF.md:` the brief. `†` marks a starting guess, tuned with the developer in the epic named.
- `[epic: En]` tags appear only where the source itself assigns the item to an epic. The coverage map in `epics.md` assigns everything else.

**Precedence (CLAUDE.md, GDD PR1–PR4):**

1. BMad artifacts win over `docs/PROJECT_BRIEF.md`. The brief's items survive here only where nothing else covers them (Part 7).
2. The narrative design owns story content: every line of text, story props, seal-break staging (PR3).
3. The UX spines own overlay behaviour, look and interface strings (PR4). The spines win over their mockups.
4. The architecture owns how things are built. Where it says more than the GDD about a rule the GDD owns, the GDD's rule stands and the architecture says where it lives.

**ID prefixes:**

| Prefix | Source | Count |
| --- | --- | --- |
| FR | GDD functional requirements | 217 |
| NR | Narrative requirements | 117 |
| NFR | GDD non-functional requirements | 49 |
| PR | GDD process requirements | 35 |
| AR | Architecture requirements | 248 |
| UX-DR | UX design requirements | 112 |
| PB | Project brief, retained items only | 4 |
| X-A, X-B, X-C | Conflicts and gaps, triaged (top of this file); X-C7–X-C11 added in step 3 | — |

---

## Conflicts and gaps, triaged (read first)

The five extractions found about 120 conflicts, ambiguities and gaps across the documents (raw lists in Appendix A). They fall into three groups.

### X-A. Settled by precedence or by another document (no action)

| ID | Item | Settled by |
| --- | --- | --- |
| X-A1 | Brief vs GDD, 25 rows (embers as currency, touch, a boss per level, desktop build, LDtk, animation lists, milestone exits) | GDD wins (Appendix A, brief C1–C25) |
| X-A2 | Mockup vs spine (stale "Warden of the First Seal" label in `key-hud.png`, "New best" position, warden-bar notch) | Spines win (EXPERIENCE.md:24, DESIGN.md:95) |
| X-A3 | "On screen" depends on the window shape | The simulation's logical view, at least 19 × 10.4 tiles, owned by `sim/camera.ts` (AR78) |
| X-A4 | Intro trigger: "first launch" vs "first Continue on a new save" | E3 bare gate → intro → Emberwood; E6 first Continue on a new save (UX-DR112, AR103) |
| X-A5 | Level names on the loading card | "Emberwood", "The Drowned Mill", "Harrowmere ruins" (UX-DR100) |
| X-A6 | Level-line card style | It is the UX `loading-card`, not a silhouette card (UX-DR32, AR84) |
| X-A7 | Menu navigation and Back bindings missing from the GDD controls table | UX-DR75 |
| X-A8 | Whether settings persist | Saved on change (AR115, UX-DR104) |
| X-A9 | Level-transition budget vs the ~3 s reading floor | The 3 s budget measures loading only (NFR7) |
| X-A10 | Which horn breaks | The right one (`horn_right_broken`, AR156) |
| X-A11 | Level editor listed as open in CLAUDE.md | Tiled 1.12.x (architecture decision 9, gdd.md:937); CLAUDE.md is stale. Follow-up F1 |
| X-A12 | "Two follow-ups" vs three in the architecture | Three; all listed under Follow-ups below |
| X-A13 | Where the gamepad notice shows | Pause and title menus (FR36, EXPERIENCE.md:163) |

### X-B. Story-level defaults (the story that first hits it applies the default and says so; the developer can veto at story review)

| ID | Gap | Default | Epic |
| --- | --- | --- | --- |
| X-B1 | Jump numbers depend on the integration order; feel-test tolerances unstated (gdd#5, ga#11) | Semi-implicit Euler (velocity, then position). Jump cut applies only while rising. Feel test: full jump 3.30 ± 0.02 tiles, tap jump 0.75–0.90 tiles, air time 52 ± 1 steps | E1 |
| X-B2 | "First play" vs "replay" never defined (gdd#7) | A level is a replay when it is already in the save's finished set as it loads. A restarted or quit first attempt is still a first play | E3, E5, E6 |
| X-B3 | Bells found in a run that is quit (gdd#8, UX#10) | Do not count: progress saves only at level end. Bells already in the union still appear in the level and count toward "this run" when taken again | E6 |
| X-B4 | Pit return: which "last stable ground" (gdd#6) | The last position where Rowan stood on solid or one-way ground that is not a moving platform and has no hazard tile within 1 tile † horizontally | E1 |
| X-B5 | Respawn before checkpoint 1 (gdd#13) | The level's `PlayerStart` | E1 |
| X-B6 | Which timers run when (gdd#18) | Weapon timer counts in the combat step, so it holds during hit-stop, pause and story moments. Clear time counts every step outside story moments, hit-stop and the death sequence included (AR87) | E1 |
| X-B7 | Which weapon pickups return on respawn (gdd#19) | Every weapon pickup taken in the level, wherever it was | E1 |
| X-B8 | Spitter cadence (gdd#10) | The 2.5 s period includes the 0.5 s swell; the first swell starts when the spitter is on screen with Rowan within range | E1 |
| X-B9 | Moving-platform solidity (gdd#11) | Solid from above only; no side or underside collision; no crushing; walkers do not ride them. Waterwheel radius and speed are per-instance Tiled properties under the 5.3 tiles/s cap | E1, E5 |
| X-B10 | Knockback for enemy shots and warden attacks (gdd#12) | The enemy values: 6 tiles/s away, 9 tiles/s up | E1, E4 |
| X-B11 | Gamepad disconnect vs failure (gdd#15) | A disconnect auto-pauses and a reconnect works normally. A thrown read turns the pad off for the session | E1 |
| X-B12 | Ember meter overflow (gdd#28) | Reaching 50 with a heart missing restores it and resets the meter to 0; the remainder is dropped | E1 |
| X-B13 | Thorn-flyer swing (gdd#23) | A per-instance Tiled property in 0.9–1.2 tiles, sinusoidal on both axes | E1 |
| X-B14 | Aim-up while running; Down + jump on solid ground (gdd#25) | Aim-up works while running. Down + jump on solid ground is a normal jump | E1 |
| X-B15 | Seeded RNG and the state hash (ga#18) | A small seeded PRNG in `sim/math.ts`, seeded from the level id; the hash covers every numeric field of the `World` in a fixed order | E1 |
| X-B16 | Checkpoint id format (ga#16) | Level-scoped in data (`emberwood/cp-2`); the URL parameter takes the short id within the given level | E1 |
| X-B17 | `params.form` vs the `levelForm` table (ga#8) | The app fills `form` from `levelForm`; only the debug URL overrides it | E1, E4 |
| X-B18 | No allocation per step vs per-step event literals (ga#9) | Pools and hot loops are allocation-free; event objects are the accepted exception, checked in the E6 performance pass | E1 |
| X-B19 | Where non-simulation numbers live (ga#17) | Stick thresholds in `CONFIG.input`, passed into `createInput` by `main.ts` (explicit wiring), since `input/` may not import values from `sim/` | E1 |
| X-B20 | Smoke checks: dev server or production build (ga#15) | The production build through `make preview`, driven by real key presses | E6 |
| X-B21 | `tests/` importing `src/debug/spots.ts` (ga#10) | Allowed: `tests/` sits outside the `src/` boundary table | E1 |
| X-B22 | Save `version`, newer-than-code saves, `unlockedLevel` type (ga#19) | `version: 1`. A save newer than the code is left untouched and the session runs in memory, as if storage were refused. `unlockedLevel` holds a level id | E6 |
| X-B23 | Before E6 there is no title menu, yet flows say "return to the title" (ga#7) | Until E6, "the title" means the title gate | E3, E5 |
| X-B24 | UX inputs left unspecified (UX#14) | Results: confirm only, Back ignored. Loading card: Back ignored. A click counts as confirm on cards. Space also confirms on the device note | E3, E6 |
| X-B25 | Default volumes (UX#13) | Music 8, effects 8, of 10 † | E6 |
| X-B26 | Whether "intro seen" is saved, and when (UX#13) | `introSeen` is written with the Level 1 end save; a player who quits during the first Emberwood play sees the intro again, and can skip it | E6 |
| X-B27 | "Tithe" appears on intro card 4 despite the note that it doesn't (narr#1) | The scripted text stands: "Lord Maldrek, the Tithe-Collector" is an approved term; the note means the standalone words | E3 |
| X-B28 | Intro "60 s at most" with cards that wait for confirm (narr#2) | A content budget for the script, not an auto-advance | E3 |
| X-B29 | Story props "never on the play layer" vs the glade arch, the sacks at the checkpoint and the fire bell exit (narr#4) | Story props never define collision and never cover play. The exit markers (arch, fire bell) may sit at play depth | E3, E5 |
| X-B30 | All-bells card first shown on a replay is skippable (narr#5) | Accepted: the replay rule applies | E6 |
| X-B31 | Playtest with 4 testers (gdd#22) | At least 3 of 4 | E3 |
| X-B32 | Cursor on cards, loading card, boot and gate (UX#17) | Hidden on cards and the loading card; shown on boot, the gate and every menu | E3 |
| X-B33 | Logging from Node scripts that import `core/` (ga#29) | `core/log.ts` takes its level filter from a setter called by `main.ts`; scripts get the default (everything) | E0 |
| X-B34 | `content/cards.ts` naming palette slots it may not import (ga#25) | Slot names are a string-literal union in `core/`, shared by `content/` and `render/palettes/` | E0 |
| X-B35 | How `ui/` learns the camera margin for `--tile` (ga#20) | The margin lives in `CONFIG.view` in `sim/config.ts`, set when the E0 camera is locked | E0 |
| X-B36 | `make test` scope (ga#12) | Every Node layer: level compile, sim, levels, app, input | E0 |
| X-B37 | Typecheck of `src/sim/**` with DOM types (ga#30) | The root tsconfig excludes `src/sim/**`; the sim tsconfig checks it | E0 |

### X-C. Needs a planning-document change, through `gds-correct-course`, before the epic named

All resolved or dropped by `sprint-change-proposal-2026-11-13-planning-gaps.md` (approved 2026-11-13), except X-C6, which story 0.14 carries.

These are gaps a story cannot close without changing a settled document (CLAUDE.md: "change a settled artifact through its own workflow").

| ID | Gap | Documents | Needed before | Status |
| --- | --- | --- | --- | --- |
| X-C1 | No owner for loading. `app/` cannot import `render/`; only `platform/` or `render/assets/` may fetch; `parseLevel` is pure. Nothing says who fetches level JSON and assets, or how progress, completion and failure reach the app's state machine (boot bar, loading card, Retry panel) (ga#6) | Architecture | E1 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A1 |
| X-C2 | The manifest is generated after the Vite build but lives in `public/`, which Vite copies as-is; how `make dev` and `make shots` get one is unstated. Test levels compile into `public/assets/levels/` yet must stay out of the release build (ga#4, ga#5) | Architecture | E1 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A2 |
| X-C3 | The story skip is "jump or confirm", but confirm never reaches the simulation and `InputFrame` has no confirm field (ga#1) | Architecture | E4 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A3 |
| X-C4 | The warden arena is 19 tiles wide; the camera stops at level edges yet shows at least 19 × 10.4 tiles. At aspect ratios wider than 16:9 both cannot hold (gdd#1) | GDD, architecture | E4 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A4 and G1 |
| X-C5 | Warden fight length: 30 HP that can be hit at any time, at 5 shots a second (15 with the triple shot from the door), is about 2–6 s of firing against a 60–120 s target. Also open: when an attack "starts" for the gap, what phase 2 does to an attack in progress, millstone spacing, whether ledges block hazards (gdd#3, gdd#4). 30 HP is unmarked, so it changes only with the developer. Found in step 3: the walk-back after the wheel roll can't be dodged as specified (3 × 4 body †, 3.30-tile full jump, ledges 3 tiles up) | GDD | E4 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A5 and G2 (hub weak point, roll back) |
| X-C6 | UX spine inconsistencies: advance-hint inset (`safe-margin` vs `spacing.2`); `display-xl` has no pixel floor; mute indicator vs error-panel stacking; scrim and panel fade durations differ; the loading card's replay hint has no visual spec (UX#1, #2, #4, #6, #9). Added in step 3: the title menu keeps the wordmark (developer, 2026-11-13); the Retry panel needs a boot-failure line | DESIGN.md, EXPERIENCE.md | Folded into story 0.14 (`gds-ux` Update), so no separate pass | Carried by story 0.14 |
| X-C7 | The boundary table must let `lookdev/` import `ui/` (overlay root and styles), so the overlay is judged on the look-dev page as DESIGN.md asks. Found in step 3 (story 0.6) | Architecture | E0 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A6 |
| X-C8 | Add the `yaml` package (development only, for the token drift test) to the Toolchain table; approved by the developer 2026-11-13 (story 0.3) | Architecture | E0 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A7 |
| X-C9 | The animation pattern (AR75, `chooseHeroClip`) records that spit clips are upper-body overlays layered on the base clip; decided by the developer 2026-11-13 (stories 2.8, 2.10) | Architecture (doc only) | E2, not blocking | Resolved: sprint change proposal 2026-11-13 (planning gaps), A8 |
| X-C10 | Generalise the `MusicFade` region so it can fade music or ambience; Emberwood's glade hush (NR105) needs it (story 3.15, hush criterion only) | Architecture | E3 | Resolved: sprint change proposal 2026-11-13 (planning gaps), A9 |
| X-C11 | Add a `walk` clip to the warden's clip list (AR155) for the walk-back; decided by the developer 2026-11-13 (story 4.11) | Architecture (doc only) | E4 | Dropped: the warden rolls back (G2), so no `walk` clip |

### Follow-ups the architecture already lists (need the developer's approval)

- F1 (already done: CLAUDE.md names Tiled and the mise/Makefile/Docker rule): Update CLAUDE.md: the level editor is Tiled 1.12.x, no longer open; add the mise / Makefile / Docker rule (ga:1589).
- F2 (already done: gdd.md Dependencies records Tiled): Update the GDD Dependencies table, which still says the level editor is "not chosen" (ga:1590).
- F3 (done 2026-11-13, with the v1.2 rule edits): Refresh `_bmad-output/project-context.md` after architecture v1.1 (ga:1591).

These are planning-document edits, done through their own workflows, not by a story.

---

## Part 1: Functional requirements (GDD)


#### Version-one scope, win and loss

FR1: Version one contains exactly three levels, played in order: Level 1 Emberwood, Level 2 the Drowned Mill, Level 3 the ruins of Harrowmere; it has one warden, at the end of Level 2. (gdd.md:54-58, 612-616)
FR2: Winning a level: Levels 1 and 3 are won by reaching the exit; Level 2 is won by defeating the warden. (gdd.md:205-207, 194)
FR3: Winning version one: finishing Level 3 shows the closing card; if all 9 bells have been found, the all-bells card follows. (gdd.md:208)
FR4: There is no game over, no lives and no countdown timer; failure resolves only to a pit return or a checkpoint respawn. (gdd.md:209-211, 909)
FR5: A "respawn" is a death that sends Rowan back to a checkpoint; pit returns do not count as respawns. Respawns are counted and shown on the results screen but never punished. (gdd.md:212, 351)
FR6: There is one difficulty setting, tuned generous; no difficulty selection exists. (gdd.md:73, 155, 562, 908)

#### Simulation timing

FR7: The simulation updates 60 times a second (one "step"); one tile is one world unit; all durations convert to whole steps by rounding to the nearest step. (gdd.md:28, 302)

#### Movement [Movement feel table proven in prototype]

FR8: Run: Rowan moves left/right on the ground and in the air with run speed 7 tiles/s. (gdd.md:222, 287) [epic: E1]
FR9: Ground acceleration 70 tiles/s² and deceleration 60 tiles/s²; turn-around boost 1.7×. (gdd.md:288-289) [epic: E1]
FR10: Air acceleration 40 tiles/s² and air deceleration 16 tiles/s². (gdd.md:290) [epic: E1]
FR11: Gravity is 40 tiles/s²; while falling it is multiplied by 1.35; max fall speed is 18 tiles/s. (gdd.md:283-284, 286) [epic: E1]
FR12: Apex gravity: in the air with jump held and vertical speed between -2.2 and 2.2 tiles/s, gravity is multiplied by 0.55, replacing the fall multiplier. (gdd.md:285) [epic: E1]
FR13: Jump: jump speed 16.5 tiles/s; a full jump peaks at 3.30 tiles with about 0.87 s (about 52 steps) in the air on flat ground. (gdd.md:223, 291-292) [epic: E1]
FR14: Variable jump: releasing jump multiplies vertical speed by 0.45 (jump cut); a tap jump reaches about 0.8 tiles. (gdd.md:223, 293-294) [epic: E1]
FR15: Coyote time 0.10 s (6 steps). (gdd.md:295) [epic: E1]
FR16: Jump buffer 0.12 s (7 steps): a jump pressed up to 0.12 s before landing fires on landing. (gdd.md:256, 296) [epic: E1]
FR17: A jump or spit press always registers, even a tap shorter than one step. (gdd.md:255) [epic: E1]
FR18: Rowan's collision hitbox is 0.72 wide × 0.92 tall. (gdd.md:298) [epic: E1]
FR19: One-way ledges: Rowan lands on them only while falling and only if his feet were above the ledge top a moment earlier; he can jump up through them from below. (gdd.md:306) [epic: E1]
FR20: Drop-through: Down + jump on a one-way ledge drops Rowan through it; one-way ledges are ignored for 0.22 s (13 steps). (gdd.md:228, 247, 300) [epic: E1]
FR21: Moving platforms: Rowan can land on them from above only; they carry him as they move; jumping off keeps the platform's speed; Down + jump on a moving platform is a normal jump, not a drop-through. (gdd.md:307) [epic: E1]
FR22: Waterwheel platforms (Level 2) are moving platforms on a circular path that stay level as they turn. (gdd.md:308, 615) [epic: E5]
FR23: Crouch: holding down on the ground stops Rowan in place (he can still turn) and shrinks only his hurtbox to 0.72 × 0.6 tiles †; his level-collision body stays 0.92 tall, so he cannot crawl under gaps. (gdd.md:227, 244, 299, 309) [epic: E1]
FR24: While crouched, Rowan's shots fire from 0.3 tiles high. (gdd.md:309, 325) [epic: E1]

#### Camera

FR25: Camera look-ahead is 1.2 tiles in the facing direction, or 2.4 tiles while running. (gdd.md:314) [epic: E1]
FR26: In the air the camera holds still vertically until Rowan moves more than 1.8 tiles below or 2.4 tiles above the framing point; it re-centres when he lands. (gdd.md:315) [epic: E1]
FR27: The camera stops at the level edges. On windows wider or taller than the 19 × 10.4 view, the margin shows the level's dressing up to 3 tiles † past its edges, then plain bands. Once Rowan enters the 19-tile warden arena, the camera locks to it and holds still until he respawns or the level ends. After a respawn or a pit return, it snaps to Rowan while the screen is faded. (gdd.md:316, 318) [epic: E1]
FR28: The camera always shows at least 19 × 10.4 tiles of play area in landscape; other aspect ratios show more or less backdrop but never less than that. (gdd.md:317, 806) [epic: E1]
FR29: Screen shake uses a trauma level: a new shake raises trauma to its value if higher (never adds); the screen moves by up to 2 × trauma² tiles; trauma falls by 1.6 per second. (gdd.md:383) [epic: E1]

#### Controls and input

FR30: Keyboard bindings: Move A/D or ←/→; aim up hold W or ↑; crouch / aim down in air hold S or ↓; jump Space, Z or K; spit J or X (hold to keep firing); drop-through Down + jump; ledge climb Up or jump, let go Down; pause Esc or P; mute M; confirm in menus Enter or Space. (gdd.md:240-251) [epic: E1]
FR31: Gamepad bindings (standard layout): move left stick or d-pad; aim up stick/d-pad up; crouch / aim down stick/d-pad down; jump south face button (A / Cross); spit west face button (X / Square) or east (B / Circle); drop-through Down + jump; ledge climb Up or jump, let go Down; pause Start; confirm in menus south face button; mute has no gamepad binding. (gdd.md:240-251) [epic: E1]
FR32: Stick thresholds: the stick must be pushed 0.35 of the way sideways and 0.5 of the way up or down to count. (gdd.md:257) [epic: E1]
FR33: Auto-pause: the game pauses when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or fails; held inputs are cleared so Rowan stops; the game never resumes by itself. (gdd.md:258, 813) [epic: E1]
FR34: If the browser refuses gamepad access, the keyboard still works and the game keeps running. (gdd.md:259, 794) [epic: E1]
FR35: If the gamepad fails during play, it is turned off for the session and the game pauses as for a disconnect. (gdd.md:260) [epic: E1]
FR36: After a gamepad failure, the pause and title menus show a one-line notice that the gamepad is unavailable and the keyboard still works. (gdd.md:260) [epic: E6]

#### Control signs (teaching)

FR37: The first time each action is needed, a small wordless sign in the scenery shows the key or button icon for that action. (gdd.md:265, 579) [epic: E1]
FR38: There are about 6 control signs, all in Level 1 (move, jump, spit, aim up, crouch, drop-through); none after Level 1; ledge grab gets no sign. (gdd.md:269, 271) [epic: E1]
FR39: A sign's icon matches the device the player last used (keyboard or gamepad). (gdd.md:266) [epic: E1]
FR40: Keyboard signs show only one key set: arrow keys, Z to jump, X to spit; other bound keys are never shown. (gdd.md:267) [epic: E1]
FR41: Gamepad signs show button positions, never platform letters, colours or logos; the spit sign shows the west face button. (gdd.md:268) [epic: E1]
FR42: Control signs never cover the play area. (gdd.md:270, 514) [epic: E1]

#### Combat: attacks

FR43: Rowan has exactly one attack, the ember spit, plus the stomp; no combos and no melee. (gdd.md:224, 321)
FR44: Ember spit: 1 damage, 15 tiles/s for 0.55 s (range 8.25 tiles), 0.2 s cooldown; holding the button fires repeatedly at that rate. (gdd.md:224, 246, 325) [epic: E1]
FR45: Ember shots fly straight without gravity, stop on solid tiles, and pass through one-way ledges and platforms. (gdd.md:306, 325) [epic: E1]
FR46: Shots leave Rowan 0.42 tiles in front of him at height 0.48 (0.7 when aiming up; 0.3 when aiming down or crouched). (gdd.md:325) [epic: E1]
FR47: Aim: holding up aims 45° upward; holding down in the air aims 45° downward. (gdd.md:225, 243-244) [epic: E1]
FR48: Stomp: landing on an enemy without thorns or spikes kills it and bounces Rowan at 11 tiles/s, or 15.5 tiles/s with jump held (a full-height jump from an enemy's back). (gdd.md:226, 297, 326, 542) [epic: E1]
FR49: A stomp counts while Rowan is falling, with a forgiveness of 0.35 tiles below the enemy's top; if a stomp and a contact hit happen in the same step, the stomp wins. (gdd.md:326) [epic: E1]
FR50: Thorn rule: an enemy with visible thorns or spikes cannot be stomped, and touching it from above hurts; anything else can be stomped. Only thorned/spiked enemies have stomp immunity. (gdd.md:344, 360) [epic: E1]

#### Combat: weapon pickups

FR51: Triple shot pickup: fires 3 shots spread ±9° (±0.16 rad) around the aim; speed, range and cooldown unchanged; lasts 20 s. (gdd.md:232, 327) [epic: E1]
FR52: Piercing shot pickup: 15 tiles/s for 1.1 s † (about 16.5 tiles, double range); passes through enemies; still stops on solid tiles; against the warden it follows the hub rule, damaging only the open hub, once, and splashing off the body and the shut hub; lasts 20 s. (gdd.md:232, 329)
FR53: Picking up a weapon replaces the current one and starts its timer from 20 s. (gdd.md:332) [epic: E1]
FR54: A HUD bar shows the weapon time left, and a warning sound plays at 3 s left †. (gdd.md:333, 772) [epic: E3]
FR55: Rowan keeps a weapon pickup through a pit fall and loses it on death. (gdd.md:334) [epic: E1]
FR56: Every weapon pickup Rowan has taken (used up or lost) goes back in the level when he respawns at a checkpoint. (gdd.md:335) [epic: E1]
FR57: Each level has 1 or 2 weapon pickups, placed before combat-heavy stretches and before the warden. (gdd.md:589)

#### Combat: hitboxes, damage and recovery

FR58: When an enemy, enemy shot or the warden touches Rowan, both boxes shrink by 0.08 tiles on each side before the overlap test. (gdd.md:341) [epic: E1]
FR59: When Rowan's shot is tested against an enemy, the enemy box grows by 0.12 tiles on each side. (gdd.md:342) [epic: E1]
FR60: Spikes are not solid and hurt only when Rowan's feet are in the bottom 0.45 of the spike tile, with the tile narrowed by 0.12 on each side. (gdd.md:343) [epic: E1]
FR61: Hearts: Rowan has 3 hearts; every hit costs 1; there are no heart pickups and no extra hearts. (gdd.md:230, 587) [epic: E1]
FR62: Being hit by an enemy, enemy shot, the warden or spikes: -1 heart; knockback 6 tiles/s horizontally away from the source, and 9 tiles/s upward from an enemy or 11 tiles/s from spikes; no horizontal control for 0.28 s (17 steps). (gdd.md:350) [epic: E1]
FR63: After a hit, Rowan has 1.3 s (78 steps) of invulnerability, shown by a 9 Hz blink. (gdd.md:230, 350) [epic: E1]
FR64: Pit rule: falling into a pit (or into deep water in the Drowned Mill) costs 1 heart; the screen fades for 0.5 s †; Rowan returns to the last stable ground with 1.3 s of invulnerability; if it was his last heart, he dies instead; shots and seeds in flight are cleared. (gdd.md:211, 352) [epic: E1]
FR65: Stable ground for pit returns means solid ground or a one-way ledge, never a moving platform and never next to a hazard. (gdd.md:351) [epic: E1]
FR66: At 0 hearts: a 0.85 s death sequence, then respawn at the last checkpoint with 3 hearts and 1.0 s of invulnerability; shots and seeds in flight are cleared. (gdd.md:210, 353, 588) [epic: E1]
FR67: On death/respawn, killed enemies stay dead (enemies never respawn when Rowan dies), and collected embers and bells stay collected. (gdd.md:352, 358) [epic: E1]

#### Hit feedback

FR68: Stomp feedback: hit-stop 0.05 s (3 steps), shake trauma 0.2, bounce. (gdd.md:180, 378) [epic: E1]
FR69: Kill with a shot: no hit-stop, shake trauma 0.12, burst effect. (gdd.md:180, 379) [epic: E1]
FR70: Rowan hurt: hit-stop 0.06 s (4 steps), shake trauma 0.35, knockback and blink. (gdd.md:350, 380) [epic: E1]
FR71: Rowan dies: no hit-stop, shake trauma 0.4, fade. (gdd.md:381) [epic: E1]
FR72: An enemy that survives a hit flashes. (gdd.md:384) [epic: E1]

#### Enemies

FR73: Every enemy's contact damage is 1 heart. (gdd.md:356) [epic: E1]
FR74: Enemies attack only while on screen, so Rowan is never hit from off-screen. (gdd.md:357) [epic: E1]
FR75: Enemies do not hurt each other. (gdd.md:359) [epic: E1]
FR76: Version one has exactly three enemy types; Levels 2 and 3 reuse them recoloured by each level's palette, arranged in harder combinations, with no rule changes; the warden is the only new enemy after Level 1. (gdd.md:364-365) [epic: E1]
FR77: Walker ("grub"): 1 HP; patrols at 1.6 tiles/s and falls under gravity; turns at walls and at ledge edges; contact damage only; stompable; hitbox 0.84 × 0.62. (gdd.md:370) [epic: E1]
FR78: Thorn flyer ("burr-wing"): 1 HP; follows a fixed path through walls, swinging ±0.9 to 1.2 tiles horizontally every 7 s and bobbing ±0.22 tiles every 2.7 s; contact damage only; not stompable (thorns); hitbox 0.74 × 0.74. (gdd.md:371) [epic: E1]
FR79: Rooted spitter ("pod"): 2 HP; stationary; faces Rowan; not stompable (thorned crown); hitbox 0.8 × 1.0 †. (gdd.md:372) [epic: E1]
FR80: Spitter attack: swells for 0.5 s, then fires a seed at 5 tiles/s every 2.5 s, only while on screen and with Rowan within 10 tiles horizontally †. (gdd.md:372) [epic: E1]
FR81: Spitter seed: radius 0.12 tiles, centre travelling 0.75 tiles above the spitter's ground † (covering 0.63–0.87), so it hits a standing Rowan and passes over a crouching one; lasts 2 s †; destroyed by solid tiles or by an ember shot. (gdd.md:372) [epic: E1]

#### The warden of the first seal (the Drowned Miller)

FR82: Warden arena: one screen, 19 tiles wide, flat floor, two one-way ledges 3 tiles up †. (gdd.md:406) [epic: E4]
FR83: A checkpoint sits at the arena door with a triple shot pickup just before it; the warden stays dormant until Rowan enters the arena (so the checkpoint is safe); the door shuts behind him. (gdd.md:234, 407) [epic: E4]
FR84: Warden body is 3 × 4 tiles † and stands at the arena's right side; shots that hit the body splash off with a clear blocked cue and do no damage. Weak point: the seal at the wheel's hub, a 1 × 1 tile † target at the top of the body's front face, is the only hurtbox; it glows open for 1.5 s † at the start of each gap between attacks and is shut the rest of the time; a shot at the shut hub splashes off; a shot touching the open hub and the body in the same step hits the hub; the open hub can be hit with aim-up from the floor or straight shots from the ledges. (gdd.md:409-410) [epic: E4]
FR85: Warden health is 30 HP †; each ember hit on the open hub does 1 damage; a triple shot can land 3 hits; HP and the hub window are tuned together in Epic 4 so a first-time fight lands in 60 to 120 s. (gdd.md:411) [epic: E4]
FR86: Warden health bar: a HUD bar labelled "The Warden" appears when the door shuts, drops with each hit, has a notch at half health marking phase 2, and empties and fades when the warden falls. (gdd.md:412, 831) [epic: E4]
FR87: The warden cannot be stomped (spikes: iron cog teeth); touching its body costs 1 heart. (gdd.md:397, 411) [epic: E4]
FR88: The warden returns to full health when Rowan respawns at the door checkpoint. (gdd.md:412) [epic: E4]
FR89: Wheel wash (phases 1 and 2): warning = the wheel spins up and glows for 0.8 s; a wave of water 1 tile tall sweeps along the floor across the arena at 8 tiles/s †; dodged by jumping over it. (gdd.md:419) [epic: E4]
FR90: Millstone fall (phases 1 and 2): shadows mark the floor 0.8 s before impact; pieces are 1 tile wide; 3 pieces in phase 1, 5 in phase 2 †; one lands where Rowan stood when the warning started, the rest with at least 2 tiles of clear floor between them; a 3-tile gap is always left clear; each lands on the first surface below it, a ledge or the floor, and its shadow marks that surface; dodged by walking out of the marked spots. (gdd.md:420) [epic: E4]
FR91: Wheel roll (phase 2 only): warning = rears back and vents steam for 0.6 s; the warden curls into a 2 × 1.5 wheel rolling at 12 tiles/s † to the far wall, then rolls back to its side (two passes, each jumped the same way); dodged by jumping over it. (gdd.md:421) [epic: E4]
FR92: Attack order: phase 1 alternates wheel wash and millstone fall; phase 2 cycles wheel wash, millstone fall, wheel roll. (gdd.md:425-427) [epic: E4]
FR93: Attacks never overlap; the gap before the next attack's warning counts from the end of the previous attack's hazard (the wave leaving the arena, the last millstone landing, the roll back reaching his side): 2.5 s † in phase 1, 1.8 s † in phase 2; the hub window opens at the start of each gap. (gdd.md:430) [epic: E4]
FR94: Phase 2 begins the moment health reaches half (15 HP while HP is 30 †), which is always during a gap: the hub shuts at once, the warden flinches (†) and the music shifts, then a full phase-2 gap with its hub window, then a wheel wash; it never cuts an attack short. (gdd.md:431, 755) [epic: E4]
FR95: Every attack warning is at least 0.6 s, and each attack has its own warning sound. (gdd.md:430, 771) [epic: E4]
FR96: Seal-break sequence: after the warden falls, an in-engine sequence of 15 s or less † plays with no text. (gdd.md:434, 659) [epic: E4]
FR97: Seal-break content: the seal at the wheel's hub shatters, the great wheel grinds to a stop, the water stills and the Miller sinks at rest; one of Rowan's horns breaks, his right claw becomes a human hand and his chest's ember glow dims slightly, with a flash of embers from his chest covering the change (no transformation animation). Beat-by-beat staging is in the narrative design document. (gdd.md:400, 435-436, 439) [epic: E4]
FR98: The seal-break sequence can be skipped on replays only. (gdd.md:438) [epic: E4]
FR99: After the seal break: the results screen, then the Level 3 story line (loading card). (gdd.md:437, 637)
FR100: Warden look: a hunched miller fused with the great waterwheel rising from his back like a shell; iron cog teeth along back and shoulders (the spikes); water pouring from him, pale and cold with no warm light; tired, not cruel, face; the seal is the wheel's hub, marked with the Tithe's sign. (gdd.md:395-399) [epic: E4]
FR101: Grain sacks marked with Harrowmere's mark sit at the door checkpoint; the warden's link to Rowan is never stated. (gdd.md:401) [epic: E4]

#### Ledge grab and Rowan's form

FR102: Ledge grab is unlocked by the first seal (end of Level 2) and is available only from then on. (gdd.md:229, 519, 555) [epic: E4]
FR103: Ledge-grab hand point is the top of Rowan's hitbox, 0.92 tiles above his feet †. (gdd.md:520) [epic: E4]
FR104: Rowan catches a ledge when all hold: he is in the air (falling or at the top of a jump); he is holding toward the wall; his hand point comes within 0.3 tiles † below the corner of a solid tile; the tile above that corner is empty with at least 1 tile of headroom. (gdd.md:521-525) [epic: E4]
FR105: One-way ledges, moving platforms and hazard tiles are not grabbable. (gdd.md:526) [epic: E4]
FR106: While hanging, Rowan does not fall and cannot shoot. (gdd.md:527) [epic: E4]
FR107: While hanging, Up or jump climbs onto the ledge, taking 0.35 s †. (gdd.md:248, 528) [epic: E4]
FR108: While hanging, Down lets go, and Rowan cannot grab again for 0.25 s †. (gdd.md:248, 529) [epic: E4]
FR109: A hit knocks Rowan off a ledge. (gdd.md:530) [epic: E4]
FR110: Ledge-grab reach: a ledge top up to 4 tiles above the take-off ground †. (gdd.md:452, 531) [epic: E4]
FR111: Replay form rule: a replay uses the form and abilities Rowan had on first arrival in that level: Levels 1 and 2 full beast with no ledge grab; Level 3 changed with ledge grab; the ability always matches the body shown. (gdd.md:533-537, 169)
FR112: Rowan's body: stage 1 (full beast) in Levels 1 and 2; stage 2 (one horn broken, a human hand) in Level 3. Stage 3 is not in version one. Rowan never switches back between forms. (gdd.md:85, 554, 733-738, 907) [epic: E4]

#### Embers, bells and economy

FR113: Each level places about 100 to 150 embers †. (gdd.md:588) [epic: E1]
FR114: Collecting embers fills the ember meter; 50 embers restore 1 heart. (gdd.md:231, 588) [epic: E1]
FR115: The ember meter starts at 0 in each level and carries across checkpoints and respawns. (gdd.md:588) [epic: E1]
FR116: At full hearts, a full meter waits and refills the next heart lost; embers collected past a full meter count only toward the total. (gdd.md:588) [epic: E1]
FR117: Collected embers stay collected, so each ember heals at most once (at most 2 or 3 heals per level). (gdd.md:588) [epic: E1]
FR118: Ember placement: about 60% trace intended jump arcs and paths, 25% reward detours, 15% sit in clusters after hard stretches †. (gdd.md:181, 592)
FR119: Each level hides 3 bells (9 in version one). (gdd.md:233, 479, 590) [epic: E1]
FR120: Collecting a bell briefly shows "Bell n of 3" on the HUD, counting this run's bells as the results screen does; there is no lasting bell counter. (gdd.md:590) [epic: E1]
FR121: Bells found add up across replays (per level, persisted); finding all 9 unlocks the all-bells story card. (gdd.md:233, 590, 665) [epic: E1]
FR122: Every bell is reachable with the abilities Rowan has on first arrival in that level (the same abilities as on replays). (gdd.md:480)
FR123: Every bell has at least one visual hint: an ember trail leading off the path, a lantern (Emberwood only), or a gap in foliage or rubble; Levels 2 and 3 use ember trails and gaps. (gdd.md:481-482)
FR124: No bell sits behind a gamble on a pit. Suggested hiding spots: behind foreground scenery, above the usual camera view, under a drop-through bridge, at the end of an optional detour. (gdd.md:484-489)

#### Checkpoints and pacing

FR125: Each level has 3 checkpoints, plus one at the warden's door in Level 2. (gdd.md:234, 493, 604) [epic: E1]
FR126: Each checkpoint sits on safe ground, with no active enemy within 8 tiles † and a safe run-up to whatever comes next. (gdd.md:494) [epic: E1]
FR127: Touching a checkpoint sets the respawn point and does not heal. (gdd.md:187, 495) [epic: E1]
FR128: Each section ends in a calm spot at a checkpoint; the hardest section of a level is the last one before the exit or the warden. (gdd.md:190, 499-500)

#### Level design rules

FR129: Gaps at equal height: standard up to 4 tiles; challenge tier 5 tiles †. (gdd.md:447) [epic: E1]
FR130: Step-ups: 1 tile (short hold); up to 3 tiles (full jump) †. (gdd.md:448) [epic: E1]
FR131: At least 5 tiles of clear space above a full-jump take-off, unless a ceiling is intended †. (gdd.md:449) [epic: E1]
FR132: Moving platforms are at least 3 tiles wide with peak speed 5.3 tiles/s or less †. (gdd.md:450) [epic: E1]
FR133: Vertical spacing of one-way ledges is 3 tiles or less †. (gdd.md:451) [epic: E1]
FR134: Challenge-tier jumps appear only close to a checkpoint and are capped per level: Level 1 none, Level 2 up to 10% †, Level 3 up to 20% †. (gdd.md:454, 564-568)
FR135: Most enemies on screen at once: Level 1 2, Level 2 3, Level 3 4 †. (gdd.md:564-568)
FR136: Teaching pattern for every new element (including Level 2's waterwheel platforms and the warden): introduce where failure is cheap (no pit underneath), let the player practise once safely, combine with something known, test before the next checkpoint. (gdd.md:456-461, 469)
FR137: One new player tool per level: Level 1 the base moves and the triple shot; Level 2 the piercing shot; Level 3 ledge grab. (gdd.md:141, 463-467)
FR138: Each enemy is visible for at least 1 s before Rowan can reach it at full run speed. (gdd.md:473)
FR139: No enemy sits on the landing spot of a jump the player cannot see. (gdd.md:474)
FR140: Spitters stand where the player can choose to crouch, jump or shoot. (gdd.md:475)
FR141: Inside a level, progress is linear, left to right with vertical variation; nothing locks off an area except Level 3's ledge-grab climbs. (gdd.md:504)
FR142: Finishing level N unlocks level N+1. (gdd.md:505)
FR143: Standard levels (1 and 3) are side-scrolling, linear, 18 to 24 tiles tall †, with 3 checkpoints, 3 bells and an exit marker; the exit marker sits at a story prop (Level 1: the wedding glade's arch; Level 3: the fallen fire bell). (gdd.md:604)
FR144: Level 2 is a standard level whose exit is the one-screen warden arena, with a checkpoint at the door. (gdd.md:506, 605) [epic: E5]

#### Level content

FR145: Level 1 Emberwood: Rowan's home forest at dusk (old trees, mossy rock, wooden ledges, lanterns hung for his wedding); introduces the base moves, the 3 enemies, the triple shot and the ember meter; ends with the exit under the wedding glade's arch. (gdd.md:614, 744) [epic: E1 grey box; E3 final art]
FR146: Level 1, start to checkpoint 1: run on flat ground; small step; tall step needing a held jump; gap; stompable walkers; low thorn flyer to shoot; high flyer needing aim-up. (gdd.md:574) [epic: E1]
FR147: Level 1, checkpoint 1 to 2: rooted spitter on flat ground (duck, jump or shoot); moving platform over a pit; one-way ledges to climb. (gdd.md:575) [epic: E1]
FR148: Level 1, checkpoint 2 to 3: spikes on a cliff top; a bridge that must be dropped through; triple shot below it. (gdd.md:576) [epic: E1]
FR149: Level 1, checkpoint 3 to exit: mixed enemies, using the triple shot; a calm exit through the empty wedding glade under its garland arch. (gdd.md:577) [epic: E1]
FR150: Level 1: embers trace jump arcs from the first gap onward; the first ember heal becomes possible by mid-level; bells are spread across sections 2 to 4. (gdd.md:580-581) [epic: E1]
FR151: Level 1 intensity is low, rising to medium in the last section. (gdd.md:566)
FR152: Level 2 the Drowned Mill: marsh and waterwheels (fog, black water, turning wheels); deep water works like a pit; introduces the piercing shot and waterwheel platforms; intensity medium, peaking at the warden; ends with the first warden then the seal-break moment. (gdd.md:567, 615, 745) [epic: E5]
FR153: Level 3 Harrowmere ruins: the town Rowan burned, starting at the old siege line outside the walls, then charred walls, fallen beams, empty streets (cold and grey); ledge-grab platforming and mixed enemies; medium-high intensity with the hardest platforming in version one. (gdd.md:568, 616, 746) [epic: E5]
FR154: Level 3 teaches ledge grab through layout alone (no sign); ledge-grab climbs are the only gated areas. (gdd.md:271, 504) [epic: E5]
FR155: Level 3 ends with a last mixed-enemy stretch, then a short calm walk (about 15 to 25 tiles †) to the town's fallen fire bell, the held beat and the closing card; version one ends there. (gdd.md:616) [epic: E5]

#### Story delivery

FR156: Story text on screen is limited to the intro, one line before each level, the closing card and the all-bells card; HUD, menus, results and control icons are not story text. No dialogue during play. (gdd.md:160-166, 658)
FR157: Intro: 5 cards, one line each, about 60 s at most, skippable. (gdd.md:656) [epic: E5]
FR158: The intro plays once, on the first Continue of a new save. (gdd.md:634, 656) [epic: E6]
FR159: Loading card: on every level load (first play or replay) the level's name and its one story line show for at least about 3 s † of reading time; loading happens behind the card; on a replay, confirm skips the rest of the reading time once loading is done. (gdd.md:197, 657)
FR160: Held beat: at Level 3's exit, control stops for about 3 s † while Rowan stands at the fallen fire bell, then the closing card; no text; skippable on replays only. (gdd.md:660) [epic: E5]
FR161: Story moments are safe: while control is stopped (seal break, held beat), Rowan cannot be hurt and enemy attacks already in progress are removed. (gdd.md:661)
FR162: The closing card delivers (1) Rowan facing Harrowmere, his first payment for what he did, and (2) a sign that Elin is acting on her own (far below, Elin is making a bell of her own). (gdd.md:65, 662-664, 699) [epic: E5]
FR163: The all-bells card (a memory of Elin the bell-maker) appears if all 9 bells are found. (gdd.md:665) [epic: E5]
FR164: Story cards (intro, closing, all-bells) are layered paper-cut silhouettes built in the engine from flat layers in the game's palettes, about 3 to 5 layers per card †; no models of Elin, Maldrek or the village. (gdd.md:667, 671, 830) [epic: E5]
FR165: Story-card text is drawn over the art, never baked into it. (gdd.md:668) [epic: E5]
FR166: Story cards advance on confirm only after a minimum of about 1.5 s †; the closing and all-bells cards can be skipped on replays. (gdd.md:669) [epic: E5]
FR167: On story cards only, warm light may also mark Elin and home (exception pending Epic 0); if refused, the forge glow on cards turns pale and cold. (gdd.md:670, 719) [epic: E0]
FR168: Story text is exactly the version-one text in the narrative design document: 141 words over 5 intro cards, 3 level lines, the closing card and the all-bells card. (gdd.md:672)
FR169: On-screen story terms use only the approved terms: Cindersworn, the Tithe, the Ember Below, Lord Maldrek the Tithe-Collector, Emberfire, Wardens of the six seals. (gdd.md:683-692)

#### Session flow, menus and results

FR170: Boot: a loading screen (wordmark and progress bar, no tips) shows while shared assets load. (gdd.md:627) [epic: E6]
FR171: After boot loading, a "Click or press any key" gate appears; its key press or click starts sound and gives the game keyboard focus inside the itch.io page. (gdd.md:627) [epic: E6]
FR172: Title screen offers Continue, Level select and Settings; the Level select entry appears only after Level 1 is finished. (gdd.md:628-630) [epic: E6]
FR173: Continue starts the next unfinished level, or opens the level select once everything is finished. (gdd.md:629) [epic: E6]
FR174: Level select lists the finished levels plus the next unlocked one, each with best clear time and bells found; any listed level can be played (replays follow the replay-form rule). (gdd.md:201, 631-633) [epic: E6]
FR175: The all-bells card can be watched again from the level select. (gdd.md:201, 648) [epic: E6]
FR176: Pause menu: Resume, Restart level, Settings, Quit to level select; until the level select unlocks, the last item reads "Quit to title". (gdd.md:249, 635) [epic: E6]
FR177: Restart level and Quit each ask for one confirmation, with Cancel as the default. (gdd.md:635) [epic: E6]
FR178: Leaving a level mid-play restarts that level (no mid-level save). (gdd.md:635, 811) [epic: E6]
FR179: End of Levels 1 and 2: the results, then on a first play the next level's loading card; on a replay, return to the level select. In Level 2 the seal break comes before the results. (gdd.md:637) [epic: E6]
FR180: End of Level 3: the held beat, the closing card, the all-bells card if earned, then the results (clear time and respawns arrive after the story lands). (gdd.md:195, 638) [epic: E6]
FR181: Results screen after each level shows: clear time in m:ss.s excluding pauses and story moments; bells found this run out of 3; respawns; embers collected out of the level total. (gdd.md:195, 639-643) [epic: E6]
FR182: The results screen tags the clear time "New best" when a replay beats the level's best; never on a first play. (gdd.md:644) [epic: E6]
FR183: All-bells card timing: it plays after the closing card if all 9 bells have been found by then; if the ninth bell is found on a Level 1 or 2 replay, it plays after that level's results; on a Level 3 replay it follows the closing card. (gdd.md:646-647) [epic: E6]
FR184: On phones and tablets, a "best played on desktop with keyboard or gamepad" note shows instead of the title, with a "Try anyway" link for tablets with a keyboard. (gdd.md:807)

#### Saving

FR185: Progress is stored in the browser on that device and saves automatically after each level. (gdd.md:196, 809) [epic: E6]
FR186: There are no cloud saves; clearing browser data clears progress. (gdd.md:810) [epic: E6]
FR187: If the browser refuses storage, progress is kept in memory for the session and the title screen says in one line that it won't be saved. (gdd.md:812) [epic: E6]

#### Settings and accessibility

FR188: Settings contain music volume, effects volume, reduced motion and fullscreen; no key remapping. (gdd.md:775, 814) [epic: E6]
FR189: Mute is toggled by the M key only (not a settings row); a speaker-off icon shows while sound is muted. (gdd.md:250, 775, 829)
FR190: Reduced motion turns screen shake off, turns full-screen flashes (such as the seal-break ember flash) into a short fade, and stops the HUD's last-heart pulse and icon shake; hit-stop and the invulnerability blink stay. (gdd.md:383, 815) [epic: E6]
FR191: A new save takes its reduced-motion default from the browser's `prefers-reduced-motion` setting. (gdd.md:816) [epic: E6]
FR192: A Credits row joins Settings only if an asset's licence requires credit inside the game. (gdd.md:840)
FR193: The game supports window resizing and fullscreen, in landscape. (gdd.md:804) [epic: E6]

#### HUD and interface

FR194: The HUD shows hearts, the ember meter, the weapon timer, the bell toast, the warden health bar and the mute icon; it includes a last-heart pulse and icon shake (suppressed by reduced motion). (gdd.md:815, 829) [epic: E3]
FR195: The interface set comprises: HUD, boot loading screen, title gate, title, loading card, pause, confirm dialog, level select, results, settings, phone and tablet note, one-line notices, error panels, story cards, control signs (keyboard and gamepad icons for about 6 actions), as specified in the UX spines. (gdd.md:31, 829)

#### Audio

FR196: One short, hummable tune per level: an arcade-era melody on modern instruments. (gdd.md:752, 831) [epic: E3 (Level 1), E4 (Level 2)]
FR197: The warden fight uses a more intense arrangement of the Level 2 tune, shifting when phase 2 starts. (gdd.md:753, 429) [epic: E4]
FR198: The title screen reuses the Level 1 tune. (gdd.md:754)
FR199: Short stingers mark the end of a level, the seal break and the closing card. (gdd.md:755)
FR200: Elin's motif (a bell-like phrase of 3 or 4 notes) runs through every level tune and the closing-card stinger; the bell pickup sound plays its first notes. (gdd.md:756)
FR201: In Level 3 the music fades out on the last calm stretch before the fallen bell, leaving only wind until the closing-card stinger. (gdd.md:757) [epic: E5]
FR202: One ambience bed per level under the music: Emberwood (dusk forest, wind in the leaves, creaking lanterns); the Drowned Mill (lapping water, creaking wheels, plus the great wheel's rush growing louder as Rowan nears the arena); Harrowmere (wind, settling ash, timber creak; no birds, no water). (gdd.md:759-763, 831) [epic: E3 (Emberwood)]
FR203: Hero sounds: ember spit (the signature sound, recognisable on its own), jump, landing (only on impacts faster than 9 tiles/s), stomp, hurt, death, falling into a pit, ledge grab, climb. (gdd.md:385, 769)
FR204: Enemy sounds: hit, death, spitter swell, spitter seed. (gdd.md:770)
FR205: Warden sounds: one distinct warning sound per attack, phase change, defeat. (gdd.md:771) [epic: E4]
FR206: World sounds: ember pickup, heart restored, bell (a clear bell tone tied to Elin), checkpoint, weapon pickup, weapon running out (3 s left), seal break. (gdd.md:772)
FR207: Interface sounds: menu move, confirm, back, pause. About 30 sound effects in total. (gdd.md:773, 832)

#### Art and content assets

FR208: Rendering composition: 3D characters on a 2D play plane in front of layered backdrops (foreground, play layer, middle distance, far distance). (gdd.md:718)
FR209: Lanterns appear only in Emberwood. (gdd.md:482, 719, 827)
FR210: Rowan's cursed-form design, as signed off on 2026-11-14 (`docs/STYLE_GUIDE.md`, section 6): a horned ember-beast, clearly not an ape, with pointed ears; upright, two legs and two arms, about 4 heads tall, human-shaped skeleton, heavy arms; two mismatched bone horns (his left sweeps out and back, his right curls up into a hook); a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; a torn red woodsman's scarf; worn, belted woodsman's trousers; bare clawed feet; determined, not monstrous; readable as a small figure on screen. (gdd.md:725-731) [epic: E0 concept, E2 model]
FR211: Hero model: 1 rig with 2 visual stages; 13 animations (idle, run, jump, fall, land, spit, spit aiming up, spit aiming down, crouch, hurt, death, hang, climb-up); stage 2 reuses the rig and animations. (gdd.md:532, 824) [epic: E2 (stage 1, base set), E4 (stage 2, hang and climb-up)]
FR212: Enemy animations: walker move, death; thorn flyer move, death (no hurt animation, 1 HP); spitter idle, swell and fire, hurt, death. (gdd.md:825)
FR213: Warden animations: idle, three attacks with their warnings, the roll curl, hurt, phase change, defeat. (gdd.md:826) [epic: E4]
FR214: Environment kits: 3 (one per level), snapping to the tile grid: ground pieces, solid ledges, one-way ledges, moving platforms (waterwheel platforms in Level 2), spikes, props, lanterns (Emberwood only), 3 or 4 backdrop layers, plus per-level story props from the narrative design document (e.g. wedding glade, marked grain sacks, siege camp, fallen fire bell). (gdd.md:827) [epic: E3 (Emberwood)]
FR215: Pickups and markers: 6 (ember, bell, triple shot, piercing shot, checkpoint, exit). (gdd.md:828)
FR216: Story art: 7 cards (intro 5, closing card, all-bells card). (gdd.md:830) [epic: E5]
FR217: Music and ambience assets: 3 tunes, a warden arrangement, stingers, 3 ambience beds and the great wheel's loop. (gdd.md:831)

---

## Part 2: Narrative requirements


#### Story text: global rules

- NR1: All story text lives in one data module, keyed by moment, not scattered through code. Version one is English only. The architecture doc decides where the module goes. (narrative-design.md:653-655, 1065-1068) [epic: E3]
- NR2: Card text is drawn on top of the silhouette art and is never baked into the image. (narrative-design.md:1069)
- NR3: On-screen story text appears only in the intro, the 3 level lines, the closing card and the all-bells card. No found documents and no text inside levels. Bells carry no text. The HUD carries no story. (narrative-design.md:766-771, 882, 188)
- NR4: Version one has no dialogue during play, no conversations, no voice-over and no choices or branches. Replays show the same text. (narrative-design.md:550, 599, 647-656, 1016, 1079-1084)
- NR5: Story text voice: an unseen folk-tale narrator, third person, past tense throughout (intro, level lines, cards). Plain words, one idea per line. No archaic words ("thee", "thou"), no mock-medieval spelling, no modern idiom, no humour, no profanity. (narrative-design.md:554-570)
- NR6: Each card carries one line of about 80 characters at most. The limit is a guess, to be checked on screen in Epic 5. Every scripted line is 67 to 80 characters (verified: 67-80 counting curly quotes as one character). (narrative-design.md:560, 824, 1035) [epic: E5]
- NR7: Story text uses the GDD's on-screen terms exactly: Cindersworn, the Tithe, the Ember Below, Lord Maldrek the Tithe-Collector, Emberfire, the wardens of the six seals. No other invented terms, and no name the player hasn't been given. (narrative-design.md:568, 869)
- NR8: The narrator never judges or forgives Rowan, and never hints that Elin will learn the truth. (narrative-design.md:569)
- NR9: Version one has exactly two quoted lines, both in the intro: the oath (card 2) and Maldrek's "The debt is called." (card 4). No one else is quoted. Elin is never quoted in version one. (narrative-design.md:573-582, 590, 858)
- NR10: Story text totals 141 words: intro 71 over 5 cards, level lines 42, closing card 15, all-bells card 13. (Verified against the script: 12+16+15+12+16, 14+15+13, 15, 13.) (narrative-design.md:1026-1035)
- NR11: Version one has 10 text moments (5 intro cards, 3 level lines, the closing card, the all-bells card) and 2 in-engine sequences (the seal break and the held beat). (narrative-design.md:791, 1040)
- NR12: Story stops play only at level boundaries, at the seal break and at the held beat, never in the middle of a section. (narrative-design.md:154, 886, 945)
- NR13: Clear time excludes story moments (held beat, cards). (narrative-design.md:952)

#### Story cards: style and behaviour

- NR14: The story cards (intro, closing, all-bells) are layered paper-cut silhouettes, built in-engine from flat layers using the palette module, so the renderer owns their style. Epic 0 confirms the style against the locked art style and records it in `docs/STYLE_GUIDE.md`. (narrative-design.md:796, 1050) [epic: E0]
- NR15: Card warm-light exception: on cards, warm light also marks Elin and home. In play, warm light stays reserved for Rowan and his fire (his shots, the embers, the bells and the weapon pickups) and the lanterns. Epic 0 confirms the exception and records it in `docs/STYLE_GUIDE.md`. (narrative-design.md:797, 1050) [epic: E0]
- NR16: Cards advance on confirm after a short minimum display of about 1.5 s (a guess), so a double press doesn't skip one. (narrative-design.md:803)
- NR17: Cutscenes and cards have no interactive elements. (narrative-design.md:805)
- NR18: Maldrek never carries warm light. On screen he belongs with the cold world, never with Rowan's fire. (narrative-design.md:254)

#### Intro

- NR19: The intro is 5 silhouette cards, one line each, 60 s at most, and can always be skipped. It covers beats 1 to 4 (Harrowmere, the bargain, Elin, the wedding eve, the change). (narrative-design.md:156, 604-607, 801, 809, 826)
- NR20: The intro triggers on the first Continue of a new save, before Level 1. (narrative-design.md:604, 971)
- NR21: Intro card 1 text: "Ten years ago, for a lord's coin, Rowan the Cindersworn burned Harrowmere." Image: night, the siege line on a rise, Rowan's silhouette with fire pouring up from a crack at his feet, the walled town below catching. Same spot where Level 3 begins. (narrative-design.md:830)
- NR22: Intro card 2 text: "“I will pay with what I hold dearest when the debt is called,” he had sworn." Image: Rowan kneeling at a glowing crack in the earth, fire rising into his cupped hands. Nothing else warm. (narrative-design.md:831)
- NR23: Intro card 3 text: "He held nothing dear, until he put the fire away and met Elin the bell-maker." Image: the village foundry, Elin at work among hanging bells, Rowan in the doorway with an axe on his shoulder. Warm: home. (narrative-design.md:832)
- NR24: Intro card 4 text: "“The debt is called,” said Lord Maldrek, the Tithe-Collector, and took Elin." Image: the wedding eve, lanterns and a garland, Maldrek's tall cold silhouette holding Elin by the wrist, a string of small bells at her waist, Rowan behind. (narrative-design.md:833)
- NR25: Intro card 5 text: "Rowan reached for the old fire to stop him, and the Ember Below claimed him too." Image: Rowan mid-change, horns breaking out, a furnace in his chest; Maldrek and Elin receding down a path into the dark of the wood. (narrative-design.md:834)
- NR26: Epic 3 builds the 5 intro silhouette cards (human Rowan on cards 1-4, Rowan mid-change on 5, Elin on 3 and 4, Maldrek on 4 and 5, the siege line, the glowing crack, the foundry, the wedding eve, the wood path) and the story text module. Placeholder silhouettes are acceptable; the final intro text is required. (narrative-design.md:1051) [epic: E3]
- NR27: After Level 1, a player must be able to say who Rowan is (card 1) and what he wants (cards 4 and 5 and the Level 1 line). This supports Epic 3's exit criterion. (narrative-design.md:606, 865-866, 1051) [epic: E3]

#### Level lines (loading card)

- NR28: Each level shows one line with the level's name on its loading card, on every level load, first play or replay. (narrative-design.md:613, 836, 891, 972, 994)
- NR29: The loading card stays up for a minimum reading time of about 3 s (a guess), then continues by itself. On a replay, confirm skips the rest of the reading time once loading is done. (narrative-design.md:891)
- NR30: Level 1 line: "He went after her through Emberwood, in a body that was no longer his." Tone: urgent. (narrative-design.md:615, 840, 1051) [epic: E3]
- NR31: Level 2 line: "Her bells led into a drowned valley, where a wheel had turned for ten years." Tone: uneasy. (narrative-design.md:615, 841, 1053) [epic: E5]
- NR32: Level 3 line: "The road to her ran through Harrowmere. He had not been back since." Tone: heavy. (narrative-design.md:615, 842, 1053) [epic: E5]

#### Seal break (in-engine sequence)

- NR33: The seal break triggers when the warden reaches 0 HP. (narrative-design.md:973)
- NR34: The seal break runs in-engine, with no text, for 15 s at most. It is mandatory on a first play and can be skipped on replays only. (narrative-design.md:158, 617-623, 810, 978, 995)
- NR35: Seal-break beat order: (1) the Miller falls still; (2) the seal at the wheel's hub cracks and shatters; (3) the great wheel grinds to a stop, then silence; (4) the water stills and the Miller sinks, at rest; (5) Rowan's horn breaks, his right claw becomes a human hand, his chest glow dims; (6) the stinger, then a fade to the results. (narrative-design.md:811-816)
- NR36: Seal-break staging (timings are guesses, tuned in Epic 4): 0.0-1.0 s Miller's defeat animation and the music cuts; 1.0-2.5 s the hub seal cracks and cold light leaks out; 2.5-3.5 s the seal shatters (seal-break sound); 3.5-6.0 s the wheel grinds to a stop, a long creak, then silence; 6.0-8.0 s the water stills and the Miller sinks; 8.0-12.0 s camera moves to Rowan, ember flash from his chest hides the stage 1 to stage 2 model swap, camera pushes in on the hand; 12.0-14.0 s seal-break stinger carrying Elin's motif, then a fade to the results. (narrative-design.md:978-988) [epic: E4]
- NR37: The stage change uses no new animation: a flash of embers hides the model swap and Rowan stays in his idle pose. In-engine sequences use the game's renderer and existing animations only, beyond the GDD's list and the seal-break changes. (narrative-design.md:795, 987)
- NR38: Audio at the seal break: the wheel stops, a beat of silence, then the seal-break stinger. (narrative-design.md:748, 760)
- NR39: Cutscene state belongs to the simulation, or to a director the simulation owns. The renderer only reads it. (narrative-design.md:990)
- NR40: Epic 4 builds the seal as the wheel's hub, the crack and shatter effects, the ember flash that hides the model swap, the camera moves, and the swap to Rowan's stage 2. (narrative-design.md:1052) [epic: E4]

#### Held beat (Level 3 exit)

- NR41: The held beat triggers when Rowan touches Level 3's exit at the fallen fire bell. Control stops. Rowan stands at the cracked fire bell in his idle pose, the camera holds for about 3 s, there is no text, and the screen fades to the closing card. It can be skipped on replays only. (narrative-design.md:792, 818, 892, 974, 995, 1053) [epic: E5]

#### Closing card

- NR42: The closing card shows straight after the held beat when Level 3 is completed. (narrative-design.md:628, 975)
- NR43: Closing card text: "This was his first payment. Far below, Elin was making a bell of her own." Image: far below, in a cold, hollow chamber, Elin at a makeshift forge, a small bell taking shape in its glow. Rowan is not on the card. (narrative-design.md:848, 1053) [epic: E5]
- NR44: The closing card must deliver two things: Rowan facing Harrowmere as his first payment, and Elin acting on her own (she has begun a bell). (narrative-design.md:629, 868)
- NR45: The closing card advances on confirm. It is mandatory on a first play and can be skipped on replays. (narrative-design.md:893, 900, 995)
- NR46: The closing-card stinger brings Elin's motif back after Level 3's music drop-out. (narrative-design.md:744, 747)

#### All-bells card

- NR47: All-bells card text: "She made the wedding bells herself, so he would always hear her coming." Image: a memory, Elin at her bench threading small bells onto a cord, by forge light. Warm. Tone: tender. (narrative-design.md:638, 854, 1053) [epic: E5]
- NR48: The all-bells card stays locked until all 9 bells are found (3 per level). (narrative-design.md:906, 965)
- NR49: The all-bells card plays after the closing card if all 9 bells are found by then. Otherwise it plays after the results of the level where the ninth bell is found. (narrative-design.md:636, 976)
- NR50: The all-bells card advances on confirm and can be watched again from the level select. Its replay and level-select access are Epic 6 work. (narrative-design.md:893-894, 1054) [epic: E6]
- NR51: The all-bells card adds a memory, not a different outcome. Nothing is gated behind collectables. (narrative-design.md:920)

#### End-of-level order and replay behaviour

- NR52: Levels 1 and 2 end with the exit (or, in Level 2, the seal break), then results, then on a first play the next level's line card. A replay returns to the level select. (narrative-design.md:898)
- NR53: Level 3 first completion order: held beat, closing card, all-bells card if earned, then results. (narrative-design.md:899, 1053) [epic: E5]
- NR54: Level 3 replays use the same order; the held beat, the closing card and the all-bells card can be skipped. (narrative-design.md:900)
- NR55: The intro can always be skipped. The seal break and the held beat can be skipped on replays only. (narrative-design.md:651, 801-802, 892)

#### Rowan: form and ability per seal

- NR56: Rowan in cursed form: about 4 heads tall, pointed ears, charcoal skin with glowing seams, two mismatched bone horns, a furnace glow in his chest, ember-bright eyes, a torn red woodsman's scarf, worn belted trousers, bare clawed feet. Determined, not monstrous. The signed-off concept is `docs/STYLE_GUIDE.md`, section 6. (narrative-design.md:208)
- NR57: Stage 1 (full beast) in Levels 1 and 2. Stage 2 in Level 3: one broken horn, a human right hand, a dimmer chest glow. Replays follow the GDD's replay-form rule. (narrative-design.md:705-706)
- NR58: The red scarf appears in every stage. (narrative-design.md:707, 719)
- NR59: The first seal gives back ledge grab (the human hand is the ability). It is the one story-driven mechanic in version one. (narrative-design.md:929, 937)
- NR60: Ledge grab stays locked until the first seal breaks. Level 3 needs ledge grab, so Harrowmere is reached only after the seal break. (narrative-design.md:964)
- NR61: The ability always matches the body the player sees (the replay-form rule). (narrative-design.md:938)
- NR62: Rowan's glow dims at the seal break, so in Harrowmere the warmest thing on screen is a dimmer Rowan. (narrative-design.md:727)
- NR63: Rowan has no words and no grunted speech. His sounds are the ember spit (signature sound), furnace breath, and hurt and death sounds. (narrative-design.md:589, 756, 1079)
- NR64: For later versions: one horn breaks per seal; stage 3 (mostly human, embers fading) arrives in Level 5. Not in version one. (narrative-design.md:126, 718)

#### Warden of the First Seal (the Drowned Miller)

- NR65: The Warden of the First Seal is the Drowned Miller: a hunched miller fused with the great waterwheel of his mill. The wheel rises from his back like a shell, its paddles split and dripping. (narrative-design.md:270-276) [epic: E4]
- NR66: Iron cog teeth run along his back and shoulders. These are the spikes that make him unstompable under the thorn rule. (narrative-design.md:277)
- NR67: River water pours from him all the time. Pale, weed-hung and cold, with no warm light anywhere on him. His face is tired, not cruel. (narrative-design.md:278-279)
- NR68: His attacks fit his body: wheel wash (the wheel spins up and drives a wave along the floor); millstone fall (the mill's stones and beams come down from the rafters); wheel roll (he curls into his own wheel and rolls across the arena). (narrative-design.md:280-283)
- NR69: His voice is the wheel (creak and rush, louder through Level 2) plus his three attack warnings (GDD). The wheel stopping is his last word. (narrative-design.md:592)
- NR70: The arena is inside the millhouse, with the Miller fused with the great wheel. (narrative-design.md:688) [epic: E4]
- NR71: The seal is the hub of the great wheel, marked with the Tithe's sign. When it shatters, the wheel stops. (narrative-design.md:689) [epic: E4]
- NR72: The warden is unstompable with 30 HP; phase 2 starts at 15 HP, version one's highest-tension moment. (narrative-design.md:196, 943)
- NR73: The warden is released, not killed. When the seal breaks, the wheel stops turning for the first time in ten years; he goes still and sinks into calm water, at rest. (narrative-design.md:297, 943)
- NR74: "The Drowned Miller" is a working title. His given name, Tobin Weir, is an internal placeholder and needs an originality check before it appears on screen. (narrative-design.md:272, 1058)
- NR75: At the warden's door checkpoint, rotting grain sacks marked with Harrowmere's mark are stacked by the millhouse door. This is the hidden link between the Miller's ruin and Rowan's fire, and it is never stated. (narrative-design.md:293, 502, 687) [epic: E5]
- NR76: Epic 4 builds the Drowned Miller model with the GDD's animations. (narrative-design.md:1052) [epic: E4]

#### Maldrek, Elin and others

- NR77: Maldrek's one line is "The debt is called.": four words taken from the oath, cold, procedural and polite, with no gloating, on the wedding-eve card (card 4). (narrative-design.md:576-580, 858)
- NR78: Maldrek appears in version one only on intro cards 4 and 5. He doesn't fight until the end of the full game. (narrative-design.md:264, 1051)
- NR79: Elin appears only on cards: intro cards 3, 4 and 5, the closing card and the all-bells card. Her voice is the bell, and every bell pickup is her voice. (narrative-design.md:590, 1051, 1053)
- NR80: The bells are Elin's wedding bells, hidden along the road as a trail: 9 in version one, 3 per level. (narrative-design.md:421, 906)
- NR81: The Ember Below never gets a face or a voice. (narrative-design.md:307, 593)
- NR82: The lord who ordered the burning stays offscreen and unnamed: an order on card 1, not a face, and a faded banner at the Level 3 siege camp. (narrative-design.md:312-315, 693)

#### Environmental storytelling

- NR83: Story details sit where players pause (checkpoints, calm spots, bell detours, section starts), never mid-jump. Story props go in the middle-distance and foreground layers, never on the play layer. (narrative-design.md:665, 669)
- NR84: Emberwood start: the forest edge below the village, with the cold chimney of Elin's bell foundry in the far layer. (narrative-design.md:675, 779, 1051) [epic: E3]
- NR85: Emberwood: lanterns hang along the path, lit for tomorrow's wedding in the wood; twisted creatures appear where the wood turned. (narrative-design.md:484, 676-677)
- NR86: Emberwood control signs are carved woodsman's waymarkers, with the icon burned into the wood. (narrative-design.md:678, 779) [epic: E3]
- NR87: Elin's bells, the first of her trail, appear in Emberwood from section 2 on. (narrative-design.md:679)
- NR88: Emberwood exit: the last calm stretch is the wedding glade, set up and empty, with benches, lanterns and a garland arch. The exit runs under the arch. (narrative-design.md:680, 779, 1051) [epic: E3]
- NR89: Drowned Mill start: the valley rim, looking down on the drowned valley in fog. (narrative-design.md:684)
- NR90: Drowned Mill: fence lines and fields under black water, and grain carts half-sunk on the drowned road, which still points toward Harrowmere. (narrative-design.md:499, 685, 780, 1053) [epic: E5]
- NR91: Drowned Mill: small waterwheels on posts turn everywhere. These are the GDD's waterwheel platforms, plus decorative wheels. (narrative-design.md:500, 686, 780, 1053) [epic: E5]
- NR92: Harrowmere start: the old siege line on a rise outside the walls, with a rotted siege camp, a faded banner of the unnamed lord, and a scorched circle where the fire was cast. The player starts where Rowan stood. (narrative-design.md:693, 781, 1053) [epic: E5]
- NR93: Harrowmere gate: burned, with Harrowmere's mark (the same sign as on the mill's sacks). (narrative-design.md:694, 781) [epic: E5]
- NR94: Harrowmere town: charred walls, fallen beams and collapsed granaries, with household things left where they were (a table set under ash, a door left open, a cart still loaded). No bodies and no child imagery. (narrative-design.md:511, 696-698, 781) [epic: E5]
- NR95: Harrowmere: ledge-grab routes climb through the ruins. (narrative-design.md:699)
- NR96: Bell hints in Levels 2 and 3 use ember trails and gaps, never lanterns. (narrative-design.md:700, 714, 1103)
- NR97: Harrowmere exit: after the last hard section, a short calm stretch with no enemies leads to the square, where Harrowmere's fire bell lies cracked where its tower fell. The collapsed bell tower and the fallen fire bell are set-piece props. (narrative-design.md:701, 781, 1053) [epic: E5]
- NR98: Level 3 has no text inside the level. Its inhabitants are creatures twisted by the ash; no people. (narrative-design.md:188, 520)
- NR99: Harrowmere's mark (placeholder design: a sheaf of grain in a ring) and the Tithe's sign are two decals. Both get an originality check before they are drawn, in Epic 4. (narrative-design.md:716-717, 782, 1052, 1059) [epic: E4]
- NR100: Warmth fades across version one: Emberwood has the most warm light (the wedding lanterns), the Drowned Mill almost none, and Harrowmere none but Rowan and his fire family (his shots, the embers, the bells and the weapon pickups). (narrative-design.md:723-726)
- NR101: Lanterns appear only in Emberwood. (narrative-design.md:714)
- NR102: Pits and deep water read as dark, and story lighting never overrides that. (narrative-design.md:728)
- NR103: Weapon pickups look warm, part of Rowan's palette. Enemy deaths use the GDD's plain arcade burst. (narrative-design.md:949, 951)
- NR104: Enemies are creatures the land twisted to pay for bargains. Each place twists in its own colours, which is the story reason for per-level recolours; no rule changes. (narrative-design.md:394, 1104)

#### Audio storytelling

- NR105: Emberwood ambience: dusk forest, wind in the leaves, lanterns creaking; the glade is hushed. (narrative-design.md:738)
- NR106: Drowned Mill ambience: lapping water, fog drip, small wheels creaking everywhere. The great wheel's rush is heard throughout the level, its volume scaled by distance to the arena. (narrative-design.md:501, 739, 783, 1053) [epic: E5]
- NR107: Harrowmere ambience: wind, settling ash, timber creak; no birds and no water. (narrative-design.md:740)
- NR108: Elin's motif, a bell-like phrase of 3 to 4 notes, runs through every level tune and the closing-card stinger. The bell pickup sound plays its first notes. In Epic 3 it goes into the Level 1 tune and the bell pickup; in Epic 4 into the Level 2 tune and the seal-break stinger. (narrative-design.md:744, 1051-1052) [epic: E3, E4]
- NR109: The title screen reuses the Emberwood tune. (narrative-design.md:745)
- NR110: Harrowmere has the sparest tune. It drops out entirely in the last calm stretch, leaving wind, until the closing card's stinger. (narrative-design.md:747, 783, 1053) [epic: E5]

#### Gating, ending and scope

- NR111: Levels unlock in order. Ledge grab and the all-bells card are the only other story locks. (narrative-design.md:961-965)
- NR112: Single ending, no story choices, no branches. The player never changes the outcome and never makes Elin's choice for her. (narrative-design.md:916-921, 1008-1016)
- NR113: Version one ends on Rowan's first payment at Harrowmere's fallen fire bell, then the closing card. (narrative-design.md:920)
- NR114: The in-world reason for respawns is never shown. (narrative-design.md:950)
- NR115: Not in version one: side quests, extra conversations, secret endings, new game plus. (narrative-design.md:910)
- NR116: Full-game ending (after version one, not built now): Elin learns what Rowan did, rings the bell that breaks the last seal by her own choice, Rowan gives up the fire, and whether she stays is her choice. The closing card points toward it. (narrative-design.md:128-133, 921)
- NR117: Originality checks before any public build or page, in Epic 6 at the latest, for: Rowan Ashby, Elin, Lord Maldrek, Harrowmere, Emberwood, Cindersworn, the Tithe, the Ember Below, Emberfire, the Drowned Mill, the Drowned Miller and Tobin Weir, Bellspire Pass, the Tithe Road, the Hollow Court. (narrative-design.md:1058, 1054) [epic: E6]

#### Candidates and ideas the doc marks as not committed (do not build as requirements)

- Miller's defeat ends with his face turned toward Rowan, left ambiguous ("Candidate"). (narrative-design.md:982, 1052)
- Rowan's breath sounds slightly more human after the seal break ("Audio idea, not committed"). (narrative-design.md:589)
- Sound drops away around Maldrek ("Audio idea"). (narrative-design.md:591)
- Drowned Mill tune in a turning, triple-time rhythm ("suggestion"). (narrative-design.md:746)
- Rewatch the intro and the closing card from the level select ("Suggestion for `gds-ux`, not decided"). (narrative-design.md:1002)
- Narrator voice-over for the intro in a later Steam build ("not planned"). (narrative-design.md:1086)
- Localisation sizing: card text boxes take about 105 characters or wrap to two lines ("If the game is ever localized"). (narrative-design.md:1070-1072)

---

## Part 3: Non-functional requirements (GDD)


#### Performance

NFR1: 60 fps sustained in current Chrome, Edge and Firefox. (gdd.md:785) [epic: E6]
NFR2: Reference machine: a 2020-era laptop with integrated graphics (Intel Iris Xe class) at 1080p; the developer names the actual test machines before Epic 6. (gdd.md:786, 944) [epic: E6]
NFR3: Pass mark: median frame time ≤16.7 ms and 99th percentile ≤20 ms over a full Level 1 playthrough, measured on real hardware; frame rates from headless screenshot runs do not count. (gdd.md:787-788, 879) [epic: E6]
NFR4: Refresh-rate independence: gameplay behaves the same on 60, 120 and 144 Hz displays, and a slow frame never changes the outcome of a jump. (gdd.md:789)
NFR5: Total download is 30 MB or less; per-asset size budgets (set in the architecture document) sit within it. (gdd.md:791, 841)
NFR6: From page open to first input in 10 s or less on a 50 Mbit/s connection. (gdd.md:792)
NFR7: Level transitions take 3 s or less (applies to loading, not to loading-card reading time). (gdd.md:657, 793)

#### Platform, browser and resilience

NFR8: Resilience: if an optional browser feature (gamepad, storage, audio, fullscreen) fails or is refused, that feature turns off and the game keeps running. (gdd.md:794, 880)
NFR9: Engine and platform: three.js on WebGL in a desktop browser, hosted as an HTML5 game on itch.io; nothing to install. (gdd.md:87, 798)
NFR10: Build must fit itch.io limits: at most 1,000 files, 500 MB total, 200 MB per file. (gdd.md:799)
NFR11: Version one is free to play in the browser on itch.io (donations only). (gdd.md:59, 117, 800)
NFR12: Supported browsers: current Chrome, Edge and Firefox; Safari is best-effort. (gdd.md:801)
NFR13: Input devices: keyboard; standard gamepads (Xbox and PlayStation layouts as the browser reports them). (gdd.md:5, 802)
NFR14: Screen: landscape; 16:9 is the main target; other aspect ratios never show less than 19 × 10.4 tiles of play area. (gdd.md:803-806)
NFR15: Desktop only: phones and tablets are not supported in version one. (gdd.md:807, 915)
NFR16: Language: English only. (gdd.md:817, 918)

#### Fairness and difficulty (measurable)

NFR17: Pillar 2 decision test: no single failure costs more than about 120 s of replay. (gdd.md:148)
NFR18: Checkpoint spacing: one every 60 to 120 s of first-play time (each section 60 to 120 s). (gdd.md:184, 493)
NFR19: First-play respawn targets †: Level 1 5 or fewer; Level 2 8 or fewer, warden included; Level 3 8 or fewer. (gdd.md:564-568, 892)
NFR20: Warden fight target length: 60 to 120 s for a first-time player; a fight of 120 s or less stays within the pillar 2 replay limit. (gdd.md:412-413)
NFR21: Hitboxes favour the player (the shrink/grow rules in FR58–FR60 are the implementation). (gdd.md:154, 337)
NFR22: Intensity rises across version one with a peak at the warden. (gdd.md:562)

#### Length

NFR23: Each level takes 6 to 8 minutes on a first play (Level 2 plus 1 to 2 minutes of warden fight); level length is a time target, not a tile count. (gdd.md:192, 608, 614-616)
NFR24: Version one totals about 20 to 26 minutes of play plus story moments, inside a 20 to 30 minute target; a first playthrough takes 20 to 30 minutes. (gdd.md:57, 621, 858, 894) [epic: E5]
NFR25: Intro is about 60 s at most; seal break 15 s or less †; held beat about 3 s †. (gdd.md:434, 656, 660)

#### Readability and visual rules

NFR26: Pillar 1 decision test: if a player needs a hint box to get past a spot, the spot is wrong; layout teaches, text does not. (gdd.md:136-137)
NFR27: The hero, enemies, hazards and pickups can each be told apart from the background at a glance. (gdd.md:134, 720, 871)
NFR28: Warm light belongs only to the hero, embers and lanterns, where "the embers" means Rowan's fire family: his shots, the collectables (embers and bells) and the weapon pickups. Rowan, his shots and the collectables are always the warmest things on screen, and lanterns stay less saturated than all of them (story cards may be an exception pending Epic 0). Harrowmere has no warm light other than Rowan's and his fire family's. (gdd.md:143, 719, 746; `docs/STYLE_GUIDE.md`, section 3)
NFR29: Pits read as dark. (gdd.md:509)
NFR30: Hazards contrast with the ground around them. (gdd.md:510)
NFR31: Wherever a level teaches aiming, the line of sight is clear. (gdd.md:512)
NFR32: Collectable embers look clearly different from Rowan's ember shots in both shape and motion. (gdd.md:513)
NFR33: Every asset takes the game's own look (its materials, its per-level palette, its per-level lighting); the look comes from the game, not the image generator. (gdd.md:721)
NFR34: The setting's tone is dark fantasy whichever art style wins. (gdd.md:708)

#### Asset quality

NFR35: The hero and the enemies must deform cleanly when animated; raw generated meshes are acceptable only for background props; a character mesh that won't deform cleanly is replaced with a simpler hand-built model. (gdd.md:838, 967)
NFR36: Art never defines collision; environment kits snap to the tile grid. (gdd.md:827, 837)

#### Originality, legal and licensing

NFR37: Nothing is taken from Toki or any other game named in the GDD: no names, characters, levels, scenes, art or sound; art styles are reference only. (gdd.md:108, 951)
NFR38: Nothing Dungeons & Dragons invented is used: no settings, named characters, signature monsters, spell or feature names, or rules text. (gdd.md:952)
NFR39: Story names are checked for originality and trademarks before any public build or page: Rowan Ashby, Elin, Lord Maldrek, Harrowmere, Emberwood, Cindersworn, the Tithe, the Ember Below, Emberfire, the Drowned Mill, the Drowned Miller, Bellspire Pass, the Tithe Road, the Hollow Court, and Tobin Weir (only if it ever appears on screen). (gdd.md:402, 943, 960)
NFR40: Story symbols (Harrowmere's mark, the Tithe's sign) are checked before they are drawn, in Epic 4. (gdd.md:943, 961) [epic: E4]
NFR41: Enemy names ("grub", "burr-wing", "pod") are internal working names, checked for originality before any appears on screen. (gdd.md:366)
NFR42: The final title is checked against existing games and trademarks before any public page; "Emberbound" is a working title used by at least six other games. (gdd.md:945, 958, 972)
NFR43: The licence and commercial-use terms of every tool and asset (Tripo, image model, audio tools included) are checked and logged in `docs/ASSETS.md`, with the asset's tool and whether it was AI-generated. (gdd.md:777, 839, 934, 938-939, 957)
NFR44: Credits go on the itch.io page (plus an in-game Credits row only if a licence requires it). (gdd.md:840)

#### Success metrics (playtest)

NFR45: Epic 3 (MVP) pass: at least 4 of 5 (or 3 of 3) first-time testers from the primary audience finish Level 1 without help; a majority want to play Level 2 and can say who Rowan is and what he wants. (gdd.md:856, 890) [epic: E3]
NFR46: Epic 4 pass: a full warden fight can be won without taking damage; at least 4 of 5 first-time testers win within 5 attempts. (gdd.md:857) [epic: E4]
NFR47: Understood in seconds: no player is stuck for more than 60 s at one spot without understanding what to do; no player asks what a button does after the first 2 minutes. (gdd.md:891)
NFR48: Modern mercy: first-play respawns stay within the Difficulty Curve targets; no player quits from frustration. (gdd.md:892)
NFR49: The curse shows on the body: after Level 1, players can say who Rowan is and what he wants; after the seal break, players mention the change in Rowan without being prompted. (gdd.md:893)

---

## Part 4: Process requirements (GDD)


PR1: The GDD supersedes the design defaults in `docs/PROJECT_BRIEF.md`; decisions and reasons live in `decision-log.md`; the detailed epic breakdown, scope and draft stories live in `epics.md`. (gdd.md:27, 849)
PR2: Unmarked numbers were proven in the Sprout prototype or decided by the developer and do not change without the developer; numbers marked † are starting guesses, tuned with the developer in the epic named. The movement feel table is retuned only with the developer. (gdd.md:29, 279)
PR3: Story content (characters, world, every line of story text, environmental storytelling, seal-break staging and its timings) comes from the narrative design document, not the GDD. (gdd.md:30, 439, 672)
PR4: The UX spines (`EXPERIENCE.md` for behaviour, flows and interface text; `DESIGN.md` for the overlay's look) are the authority on menu and HUD behaviour. (gdd.md:31, 829)
PR5: Every mechanic, level and asset answers to the three pillars and their decision tests. (gdd.md:131)
PR6: Epic order is 0 → 1 → 2 → 3 → 4 → 5 → 6; an epic starts only after the previous epic's exit criteria are met and the developer approves. Epic 3 is the MVP; version one ships at the end of Epic 6. (gdd.md:849, 861)
PR7: Epic 0 (Reference and style lock) exit: the chosen look reproduced in the engine on a test scene of simple shapes, shown on the look-dev page; the developer approves the look as rendered in the engine, not only the images. (gdd.md:853)
PR8: Epic 1 (Grey-box core) exit: Level 1's layout in grey boxes with every base mechanic (moves, the three enemies, spikes, hearts, the pit rule, checkpoints, embers, bells, triple shot, hit feedback, control signs, camera, input); every mechanic works in tests and feels right to the developer in the browser; the grey-box pace is measured. (gdd.md:854)
PR9: Epic 2 (Hero) exit: Rowan (stage 1) with all base animations playing the grey level; Rowan matches the concept in the critic loop and animates cleanly in every state. (gdd.md:855)
PR10: Epic 3 (Level 1 vertical slice, MVP) exit: Emberwood start to finish with final art, HUD and audio; playtest thresholds in NFR45; the developer approves the look. (gdd.md:856)
PR11: Epic 4 (First warden) exit: the warden in its arena, the seal-break moment, Rowan stage 2, ledge grab, the Level 2 tune and its warden arrangement; thresholds in NFR46; ledge grab passes its tests and feels right to the developer. (gdd.md:857)
PR12: Epic 5 (Levels 2 and 3) exit: version one complete (Level 2 into the warden, Level 3, story cards); a new player finishes version one in 20 to 30 minutes. (gdd.md:858)
PR13: Epic 6 (Wrap and release) exit: menus, session flow, saving, level select, settings, performance pass, itch.io release; performance targets met on the reference machines; released on itch.io under the final title. (gdd.md:859)
PR14: The critic loop is used after every visual change and in every exit criterion that mentions it. Steps, verbatim: "1. Capture screenshots at a fixed list of camera spots, with the game running headless. 2. Compare each screenshot with the reference image and the style guide. 3. Write down the three biggest problems, most important first. 4. Fix them. 5. Repeat, for at most three rounds, then show the developer before and after." "Every round also checks that the hero, enemies, hazards and pickups stand out from the background at a glance." (gdd.md:863-871) Amended 2026-11-14 (sprint change proposal, agentic): full loop in gate stories and exit criteria; one round after other visual changes, shots shown at the next gate.
PR15: Every simulation rule has a unit test; the story-moments-are-safe rule has its own unit test. (gdd.md:661, 881)
PR16: Every jump in every level is shown to be possible with the tuning numbers by an automated test. (gdd.md:443, 882)
PR17: Platforming metrics are verified in Epic 1 (ledge-grab reach in Epic 4). (gdd.md:443, 452, 531)
PR18: Movement feel must be right before anything else is built (it carries the first two minutes). (gdd.md:63, 176)
PR19: Art dresses a layout that already plays well in grey boxes. (gdd.md:836)
PR20: Level tile length is derived from the pace measured on grey-box Level 1 in Epic 1 (the prototype's 146 tiles are the starting point), and checked in Epic 5's exit criteria. (gdd.md:608, 971)
PR21: Prove the image → Tripo mesh → Blender rig → animation pipeline on Rowan alone in Epic 2, before any level art; the fallback is a simpler hand-built model for the hero and enemies. (gdd.md:967)
PR22: Art style lock in Epic 0: generated reference images in each candidate style (stylised dark fantasy, comic illustration, mix) are compared, the developer picks one, and the choice is recorded in `docs/STYLE_GUIDE.md`, then reproduced in the engine. (gdd.md:708-714, 935)
PR23: Every asset is judged in the engine against the style guide, not against a newly generated image; the architecture document defines how. (gdd.md:721)
PR24: Hero design sign-off happens in Epic 0 (concept) and Epic 2 (model). (gdd.md:740, 936)
PR25: Epic 0 confirms the story-card style and the cards' warm-light exception on a sample card rendered in the engine, and decides (with the image model) where card shapes come from (hand-made or generated), logged in `docs/ASSETS.md`. (gdd.md:670-671, 935)
PR26: Tool-choice deadlines: image model before Epic 0 starts; tool budgets by Epic 0; Tripo licence checked by Epic 2; audio tools chosen by Epic 3; each tool's licence checked and logged. (gdd.md:934, 938-940, 968)
PR27: Before Epic 6: the developer names the reference test machines and chooses how to measure release success (anonymous analytics with a consent prompt; a proxy signal such as players posting clear times; or no measurement). (gdd.md:786, 897, 944, 982)
PR28: Playtests use 3 to 5 first-time players from the primary audience, watched without help. (gdd.md:886)
PR29: A retrospective at the end of each epic records what was learned. (gdd.md:895)
PR30: Scope growth is rejected unless the developer asks for it. (gdd.md:102, 969)
PR31: When the primary audience (35–55, arcade-era players) and the secondary audience conflict, the primary audience wins. (gdd.md:73)
PR32: The Credits-row question is settled once `docs/ASSETS.md` lists every licence. (gdd.md:840)
PR33: Per-asset size budgets are set in the architecture document. (gdd.md:841)
PR34: Originality-check timing: symbols in Epic 4 before they are drawn; story names before any public build or page; final title before any public page. (gdd.md:943, 958-961)
PR35: Get proper legal advice before selling (the GDD is not legal advice). (gdd.md:949)

---

## Part 5: Architecture requirements

### Starter / Scaffold

**Yes, the architecture specifies a scaffold, and assigns it to Epic 0, story 1.** (ga:262-275, 1644-1649)

**Starter template and commands** (ga:264-275):

> "Epic 0, story 1: scaffold from Vite's official minimal template into the existing repository root, add `mise.toml` and the `Makefile`, then reshape everything into the structure set in Project Structure."

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

**First Steps list** (ga:1646): "Epic 0, story 1: scaffold the repository as in Project Initialization: `mise.toml`, the `Makefile`, the Vite `vanilla-ts` template, ESLint, Prettier, Vitest, Playwright, `.gitattributes` for Git LFS, and the DOM-free `src/sim/tsconfig.json`."

**Exact versions / toolchain** (ga:203-216), all pinned exactly:

| Tool | Version | Pinned in |
| --- | --- | --- |
| Node.js | 26 LTS (26.13.x); runs `scripts/*.ts` natively via type stripping | `mise.toml` |
| three | r187 (`0.187.x`), types from `@types/three` at matching version | `package.json` |
| Vite | 8.3.x, **8.3.3 or later** (8.3.0–8.3.2 have known vulnerabilities); Rolldown bundler | `package.json` |
| TypeScript | 6.0.x (not 7.0: typescript-eslint can't run on it) | `package.json` |
| ESLint / typescript-eslint | ESLint 10.x (flat config only); typescript-eslint 8.72.x; "confirm its peer range for ESLint 10 at scaffold" | `package.json` |
| Prettier | 3.x (3.9, or 3.10 once two weeks old); approved 2026-11-13 | `package.json` |
| `@gltf-transform/cli` | 4.5.x, development only; approved 2026-11-13 | `package.json` |
| `@types/node` | matching Node 26; types only; approved 2026-11-13 | `package.json` |
| Vitest | 5.x (needs Vite 6.4+, Node 22.12+) | `package.json` |
| `@playwright/test` | 1.65.x, exact version; browsers installed by `make setup` | `package.json` |

**Version policy** (ga:218-223): exact versions everywhere (tools in `mise.toml`, libraries in `package.json`), lockfile committed; at scaffold take the newest patch at least two weeks old; each three.js upgrade is its own story with the critic loop re-run; ask the developer before adding any dependency beyond this table.

**Local dev rule** (ga:225-260): `mise.toml` at repo root pins every CLI tool (`mise.local.toml` for personal overrides, never committed); `Makefile` is the single entry point, every target runs through `mise exec --` or an activated shell ("Epic 0 decides which, after checking mise's current documentation"); `make help` is the default target; "the exact set is finalised in Epic 0, story 1". Starting targets: `help`, `setup`, `dev`, `test`, `test-watch`, `shots ROUND=n`, `smoke`, `lint`, `format`, `typecheck`, `check`, `levels`, `models`, `build`, `preview`, `clean`, `release` (E6). Services, if ever needed, run in Docker via a committed `docker compose` file with `make services-up` / `make services-down` (ga:260).

**Config files at repo root** (ga:1011-1024):

- `index.html` (game entry); `lookdev.html` (look-dev entry, development only)
- `mise.toml`: "Tool versions: Node, git-lfs, later butler, possibly Tiled"
- `Makefile`; `package.json`; `package-lock.json`
- `tsconfig.json`: "Strict; references src/sim/tsconfig.json (no DOM types)"
- `src/sim/tsconfig.json`: "lib without DOM" (ga:1036)
- `vite.config.ts`: "Includes the Vitest config"; `base: './'`; look-dev entry excluded from the build (ga:609)
- `playwright.config.ts`: screenshot harness runs against the dev server via Playwright's `webServer` (ga:943)
- `eslint.config.js`: "Includes the import boundaries" (flat config)
- `.gitattributes` (Git LFS patterns); `.gitignore`; `CLAUDE.md`; `README.md` ("How to start: `make setup`, `make dev`")

**tsconfig flags named** (ga:1528): `allowImportingTsExtensions`, `verbatimModuleSyntax`, `erasableSyntaxOnly` (relative imports carry `.ts`; `import type`; no enums, namespaces or parameter properties).

**ESLint rules named** (ga:1206-1211, 1514-1531): `no-restricted-imports` per folder (layer boundaries, and `ShaderMaterial` and friends outside `render/materials/`); `@typescript-eslint/consistent-type-imports`; `no-restricted-properties` and `no-restricted-globals` on `src/sim/**` (no `Math.random`, `Date`, `performance`); `@typescript-eslint/no-explicit-any`; `@typescript-eslint/switch-exhaustiveness-check`; `@typescript-eslint/no-floating-promises`; `no-console` everywhere except `core/log.ts`; baseline typescript-eslint `strictTypeChecked`.

**Git LFS** (ga:1213-1218): `.gitattributes` covers `art-src/**`, `*.glb`, `*.blend`, `*.fbx`, `*.obj`, `*.png`, `*.jpg`, `*.webp`, `*.psd`, `*.kra`, `*.wav`, `*.flac`, `*.ogg`, `*.mp3`, `*.m4a`, `*.woff2`, `*.ttf`; code, JSON, `.tmj`, `.tsj` stay in plain git; check GitHub's LFS quota "before Epic 0" / "before the first binary is committed" (ga:1218, 1647).

**Git-ignored generated output** (ga:999-1000, 1006): `public/assets/levels/`, `public/assets/manifest.json`, `shots/`.

**Setup commands once scaffolded** (ga:1632-1642): `git lfs install`, `mise install`, `make setup` (npm ci, Playwright browsers, tool checks), `make dev` (game plus look-dev at `/lookdev.html`), `make check`.

---

### Additional Requirements

#### Toolchain and local development

- AR1: Stack is three.js r187 (`three@0.187.x`, WebGLRenderer, GLSL), TypeScript 6.0.x strict, Vite 8.3.x (8.3.3 or later), Node.js 26 LTS (26.13.x); desktop browsers; HTML5 build on itch.io. (ga:9-10, 26, 192, 207-210) [epic: E0]
- AR2: Dev/test dependencies pinned exactly: ESLint 10.x (flat config only), typescript-eslint 8.72.x (confirm ESLint 10 peer range at scaffold), Prettier 3.x, `@gltf-transform/cli` 4.5.x (dev only), `@types/node` matching Node 26 (types only), `@types/three` matching three, Vitest 5.x, `@playwright/test` 1.65.x, `yaml` (dev only, the DESIGN.md token drift test, approved 2026-11-13). (ga:208, 211-217) [epic: E0]
- AR3: Exact versions everywhere: tools in `mise.toml`, libraries in `package.json`, `package-lock.json` committed; at scaffold take the newest patch at least two weeks old. (ga:218-221, 1016) [epic: E0]
- AR4: Each three.js upgrade is its own story, with the critic loop re-run. (ga:222)
- AR5: No dependency beyond the Toolchain table without asking the developer. (ga:223, 1533)
- AR6: Moving to TypeScript 7.x is its own story, once 7.1 and typescript-eslint support it. (ga:210)
- AR7: `mise.toml` is committed at repo root; its `[tools]` pins every CLI tool at an exact version (Node now; butler added in E6; git-lfs if the registry has it; Tiled if a backend can install it); no global Node; `mise.local.toml` is never committed; mise does not manage npm deps. (ga:229-233, 1013, 1217) [epic: E0]
- AR8: The `Makefile` is the single entry point; every target runs with mise-pinned tools (`mise exec --` or an activated shell, chosen in Epic 0); agents and developer use `make` targets, never raw `npm`/`npx`/`vite`; `make help` is the default target and lists the others. (ga:234-237, 1532) [epic: E0]
- AR9: Starting Makefile targets: `help`; `setup` (`mise install`, `npm ci`, Playwright browsers, plus `tiled --version` check if Tiled isn't in mise); `dev`; `test` (once); `test-watch`; `shots ROUND=n` (saves to `shots/round-n/`); `smoke` (headless Chromium and Firefox); `lint`; `format` (writes); `typecheck` (`tsc --noEmit` on root, then on `src/sim/tsconfig.json`); `check`; `levels`; `models`; `build`; `preview`; `clean`; `release` (E6). Exact set finalised in Epic 0 story 1. (ga:238-258, 503, 1639) [epic: E0]
- AR10: Any service ever needed (e.g. an analytics backend) runs in Docker via a committed `docker compose` file with `make` targets such as `make services-up` / `make services-down`; never installed on the host; v1 needs none. (ga:260, 1610)
- AR11: `README.md` documents how to start (`make setup`, `make dev`). (ga:1024, 1532)
- AR12: Git LFS via `.gitattributes` for `art-src/**`, `*.glb`, `*.blend`, `*.fbx`, `*.obj`, `*.png`, `*.jpg`, `*.webp`, `*.psd`, `*.kra`, `*.wav`, `*.flac`, `*.ogg`, `*.mp3`, `*.m4a`, `*.woff2`, `*.ttf`; code, JSON, `.tmj`, `.tsj` in plain git; GitHub LFS quota checked before Epic 0 / the first binary commit. (ga:1213-1218, 1647) [epic: E0]
- AR13: Tiled 1.12.x pinned in `mise.toml` if a mise backend can install it (checked in Epic 1); otherwise the version is recorded and `make setup` checks `tiled --version`. (ga:503, 1608) [epic: E1]
- AR14: Node runs `scripts/*.ts` natively with no runner dependency; relative imports carry `.ts`; `import type` for types; erasable syntax only (no enums, namespaces, parameter properties); enforced by tsconfig `allowImportingTsExtensions`, `verbatimModuleSyntax`, `erasableSyntaxOnly`. (ga:207, 356, 1528)
- AR15: `tsconfig.json` is strict and references `src/sim/tsconfig.json`, whose `lib` excludes DOM. (ga:1017, 1036)
- AR16: `vite.config.ts` includes the Vitest config. (ga:1018)

#### Project structure and layer boundaries

- AR17: Top-level layout: `art-src/` (reference, hero, enemies, warden, kits, cards, audio; LFS; never loaded by the game), `docs/` (`PROJECT_BRIEF.md`, `STYLE_GUIDE.md` written in E0, `ASSETS.md`), `levels/`, `prototype/` (never built), `public/assets/`, `scripts/`, `shots/`, `src/`, `tests/levels/`, `tests/e2e/`, plus root config files. Approved by the developer 2026-11-13. (ga:958, 962-1025) [epic: E0]
- AR18: `public/assets/` holds `models/`, `kits/`, `backdrops/` (one folder per level), `cards/`, `icons/`, `fonts/`, `audio/` (`music/`, `ambience/`, `sfx/`), `levels/` (generated, git-ignored), `manifest.json` (generated, git-ignored). (ga:987-1000)
- AR19: `src/` top level: `main.ts`, `core/`, `sim/`, `app/`, `platform/`, `input/`, `render/`, `audio/`, `ui/`, `content/`, `debug/`, `lookdev/`, with the files listed in Source Structure. (ga:1029-1096)
- AR20: `core/` imports nothing; no DOM, no three.js. (ga:1032, 1190)
- AR21: `sim/` may import only `core/`; never three.js, DOM types or any other layer; it has its own tsconfig without the DOM lib; runs in Node. (ga:30, 132, 1035-1036, 1191)
- AR22: `content/` may import only `core/`; never runtime layers; data only. (ga:1089, 1192)
- AR23: `platform/` may import `core/`; never three.js, `sim/`, `render/`. (ga:1193)
- AR24: `input/` may import `core/`, `platform/`, types from `sim/`; never three.js, `render/`, `app/`. (ga:1194)
- AR25: `app/` may import `core/`, `sim/`, `content/`, `platform/`, types from `input/`; never three.js, `render/`, `ui/`, `audio/`. (ga:1195)
- AR26: `render/` is the only layer that imports three.js; may import three.js, `core/`, `content/`, types from `sim/` (via `DeepReadonly`), values from `sim/config.ts`; never `app/`, `ui/`, `audio/`, `platform/`. (ga:1068, 1196)
- AR27: `render/materials/` may import three.js, `core/`, `render/palettes/`, `render/lighting/`; nothing outside `render/materials/` may contain GLSL or import `ShaderMaterial`. (ga:1197, 1517)
- AR28: `audio/` may import `core/`, `platform/`, `content/`, types from `sim/`, values from `sim/config.ts`; never three.js, `render/`, `ui/`. (ga:1198)
- AR29: `ui/` may import `core/`, `content/`, the command and read-only state types from `app/`, types from `sim/`, values from `sim/config.ts`; never three.js, `render/`, `audio/`. (ga:1199)
- AR30: `debug/` may import anything; nothing imports `debug/` except `main.ts` behind `import.meta.env.DEV`. (ga:1093, 1200)
- AR31: `lookdev/` may import `render/`, `ui/` (overlay root, styles, components), `content/`, `core/`; never `sim/` or `app/`. (ga:1201)
- AR32: `scripts/` may import Node, `core/`, `sim/level/`, values from `sim/config.ts`; never runtime presentation layers. (ga:1202)
- AR33: Presentation layers and scripts may import values from `sim/config.ts` (constant data) but never mutate the `World`. (ga:1204, 1559)
- AR34: Boundaries enforced by ESLint built-in `no-restricted-imports` per folder in `eslint.config.js`, `consistent-type-imports` (cross-layer type imports are type-only), and the DOM-free `src/sim/tsconfig.json`; `make check` runs all of these. (ga:1206-1211, 1518)
- AR35: `main.ts` is the only file that knows every layer: boot, wiring, frame loop; explicit wiring with dependencies passed as parameters; no singletons, no service locator. (ga:1031, 1390-1409)
- AR36: Input reaches the app through a callback (`createInput({ onAppAction })`), so `input/` never imports `app/`; interface sounds use a `playUiSound` callback passed by `main.ts`, so `ui/` never imports `audio/`. (ga:591, 1395, 1403-1406)
- AR37: Unit tests live next to their code (`controller.test.ts` beside `controller.ts`); level tests in `tests/levels/*.test.ts`; Playwright specs in `tests/e2e/*.spec.ts`. (ga:1134-1137)

#### Simulation core (World, step, determinism)

- AR38: Simulation is plain data in one `World`, updated in place by system functions in a fixed order; no ECS; created by `createWorld(level, params)` (`sim/world.ts`), advanced by `step(world, input)` (`sim/step.ts`). (ga:336, 381, 1038-1039)
- AR39: `WorldParams` = `{ levelId, form: 'beast' | 'changed', spawnAt?: { x: number; y: number } | { checkpointId: string }, isStorySkippable: boolean }`; debug URL params and the jump search use `spawnAt`; replays set `isStorySkippable`. (ga:384)
- AR40: `World` fields: `params`, `level` (compiled, read-only), `step`, `nextId`, `rng`, `player`, `enemies` (union typed by kind), `warden` (or `null`), `platforms`, `pickups`, `checkpoints`, `regions`, `doors`, pools `shots`/`seeds`/`millstones`, `camera`, `story`, `hitStopSteps`, `stats` (`clearSteps`, `respawns`, `hitsTaken`, `embersCollected`, `bellsFound`), `events` (current step's `SimEvent`s). (ga:385-390)
- AR41: `World` is mutated in place (no GC pauses at 60 Hz); only `sim/` mutates it; all other code receives `DeepReadonly<World>` (`core/deepReadonly.ts`) so the type checker enforces "rendering never writes". (ga:30, 391-392, 1033, 1515)
- AR42: Every simulation timer is a whole number of steps; `config.ts` converts GDD seconds to steps once, rounding to nearest; no seconds or milliseconds in `sim/` logic. (ga:393, 1513)
- AR43: System order per step: 0 clear `events` and copy each moving body's position into `prevX`/`prevY`; 1 apply input frame (presses written into player buffers: jump buffer, spit request); 2 story director; 3 hit-stop; 4 platforms move; 5 player (movement, tile collision, being carried, ledge grab); 6 enemies; 7 warden; 8 shots and seeds (move, stop on tiles); 9 combat (stomp before contact, damage, knockback, deaths); 10 pickups, checkpoints, regions, pit rule, exit; 11 camera; 12 statistics. The step that emits `levelCompleted` is the World's last: afterwards `step()` returns at once, so the clear time is final. (ga:396-412)
- AR44: Hit-stop: while `hitStopSteps` > 0, count down and skip steps 4–11; input buffers keep presses and don't count down during hit-stop (a press always registers). (ga:400, 442, 1561)
- AR45: Determinism: no `Date`, `performance.now` or `Math.random` in `sim/`; one seeded RNG in `World` (`world.rng`) for things like millstone landing spots; `sim/math.ts` provides its own `sin`/`cos`, vectors and the seeded RNG; enforced by ESLint `no-restricted-properties` and `no-restricted-globals` on `src/sim/**`. (ga:183, 338, 413-415, 1042, 1514)
- AR46: Determinism test `src/sim/determinism.test.ts`: a recorded input stream run twice on each level produces identical state hashes. (ga:416, 634)
- AR47: Units: positions in tiles, velocities in tiles/s, no suffix; y up; a body's `x` is its centre and `y` its feet. (ga:1167, 1512)
- AR48: No allocation per simulation step (pools) and none per frame in hot render paths. (ga:659)
- AR49: The simulation contains no `try`/`catch`; it only asserts invariants. (ga:724)
- AR50: Collision comes from the tile grid only (`sim/tiles.ts`: solid, one-way, spike); `sim/body.ts` resolves bounding boxes on X then on Y. (ga:134, 1043-1044)
- AR51: Hitboxes favour the player. (ga:141)

#### Game loop and timing

- AR52: Frame loop: `dt = clamp((now - last) / 1000, 0, 0.25)`; accumulate only while the app is Playing; `STEP` = 1/60 s; at most 5 steps per frame; if 5 steps ran, `acc = min(acc, STEP)` (drop backlog); `alpha = acc / STEP`; then `render(world, alpha)`, `audio.update(events)`, `ui.update(world, app)`. (ga:337, 427-440)
- AR53: Each step consumes one `InputFrame` via `input.consumeStep()`; latched presses are delivered once; per-step events are collected per frame. (ga:433-434, 567)
- AR54: Pausing stops simulation steps; rendering and the interface keep running; hit-stop lives inside the simulation. (ga:441-442)
- AR55: Gameplay is identical at 60, 120 and 144 Hz; a slow frame never changes an outcome; rendering interpolates between steps using `prevX`/`prevY`. (ga:116-119, 397, 1340)
- AR56: `frame(now)` schedules `requestAnimationFrame` first, then runs `runFrame(now)` in `try`/`catch`; in DEV it rethrows; in release it logs `log.error('loop', 'Frame failed', err)` and dispatches `{ type: 'showLevelError' }`; the loop never dies. (ga:756-766)
- AR57: Fixed-step loop location: `src/main.ts` (accumulator, step cap, alpha) and `src/app/levelHost.ts` (creates a `World` per level, runs steps, gathers events). (ga:1061, 1102)

#### Configuration

- AR58: All gameplay numbers live only in `sim/config.ts`, exported as `CONFIG` typed `as const` (read-only to the type checker; nothing frozen at runtime); no runtime config files, no remote config. (ga:802, 808, 1037, 1516)
- AR59: `sim/config.ts` is written in GDD units (tiles, seconds); `STEP_HZ = 60`; step counts derived once by `steps(seconds) = Math.round(seconds * STEP_HZ)`; every † number has a comment naming the epic that tunes it; tests import the values and never repeat literal numbers. (ga:808, 821-822)
- AR60: Fixed per-level tables also in `sim/config.ts`: `levelForm` (replay-form rule), challenge-jump caps, story timelines in steps. (ga:809)
- AR61: Movement values in the CONFIG example: `gravity: 40` (tiles/s², proven), `fallGravityMul: 1.35`, `apexGravityMul: 0.55`, `apexSpeedBand: 2.2` (tiles/s), `jumpSpeed: 16.5`, `jumpCutMul: 0.45`, `coyoteSteps: steps(0.10)` (6), `jumpBufferSteps: steps(0.12)` (7), `crouchHurtboxHeight: 0.6` († tune in Epic 1). (ga:825-835) [epic: E1]
- AR62: `CONFIG.feedback` (read by sim, rendering and audio): `hitStopSteps` stomp `steps(0.05)` (3), rowanHurt `steps(0.06)` (4); `trauma` stomp 0.2, shotKill 0.12, rowanHurt 0.35, rowanDied 0.4; `traumaDecayPerSecond: 1.6`; `shakeMaxTiles: 2` (offset = shakeMaxTiles × trauma²); `blinkHz: 9`; `landingSoundMinSpeed: 9` tiles/s; `spitClipSteps: steps(0.2)` and `landClipSteps: steps(0.15)` († tune in Epic 2). (ga:836-845, 1559) [epic: E2]
- AR63: `levelForm: { emberwood: 'beast', 'drowned-mill': 'beast', harrowmere: 'changed' }` (level id = file name). (ga:846)
- AR64: Feel regression unit test derives, with the real controller and `CONFIG`, the full jump height (3.30 tiles), the tap jump (about 0.8) and the air time (about 52 steps), and fails if they drift. (ga:148, 850)
- AR65: Other config homes: look data in `render/palettes/` and `render/lighting/`; audio mix (bus levels, crossfade times, wheel distance curve) in `audio/mix.ts`; UI timings in `core/uiTimings.ts`; story text in `content/storyText.ts`; player settings and defaults in `app/settings.ts`; build constants via `import.meta.env` (`DEV` gates debug tools; no secrets ever). (ga:810-815)

#### Events and commands

- AR66: Exactly two typed synchronous channels: `SimEvent` (sim → render/audio/ui; past tense camelCase; appended to `world.events` during a step, collected per frame) and `AppCommand` (ui and input → app; imperative camelCase, e.g. `startLevel`, `changeSetting`, `togglePause`; handled by `app.dispatch(cmd)`, union in `app/commands.ts`). No global event bus; no string event names outside these unions. (ga:854-859, 1060, 1394)
- AR67: Events are plain data (ids, kinds, positions; no object refs or functions) so they can be recorded and replayed; only `sim/` creates `SimEvent`s; presentation never sends anything back; handlers are exhaustive `switch` statements. (ga:861-865)
- AR68: `sim/events.ts` defines the full `SimEvent` union: `rowanJumped`, `rowanLanded{impactSpeed}`, `shotFired{x,y,dirX,dirY}`, `rowanStomped{enemyId}`, `rowanHurt{source:'enemy'|'enemyShot'|'spikes'|'warden'}`, `rowanFellInPit`, `rowanDied`, `rowanRespawned{checkpointId}`, `ledgeGrabbed`, `ledgeClimbed`, `enemyHit{enemyId}`, `enemyKilled{enemyId,kind,by:'shot'|'stomp'}`, `spitterSwelled{enemyId}`, `seedFired{enemyId}`, `emberCollected{total}`, `heartRestored`, `bellFound{bellId}`, `weaponCollected{weapon:'tripleShot'|'piercingShot'}`, `weaponRunningOut` (3 s left), `weaponExpired`, `checkpointReached{checkpointId}`, `regionEntered{regionId,kind}` (once per entry; again only after Rowan leaves; a respawn or pit return clears it), `arenaEntered`, `wardenWarned{attack}`, `wardenAttacked{attack}`, `wardenHit` (a shot hit the open hub), `wardenShotBlocked{x,y}` (a shot splashed off the body or the shut hub), `wardenHubOpened` (start of a gap), `wardenPhaseChanged{phase:2}`, `wardenDefeated`, `storyStarted{moment}`, `storyCueReached{moment,cue}`, `storyEnded{moment}`, `levelCompleted`. (ga:870-908, 1565)
- AR69: Landing sound plays only when `rowanLanded.impactSpeed` exceeds `CONFIG.feedback.landingSoundMinSpeed`. (ga:874)

#### Entity and state patterns

- AR70: Simulation entities are plain objects with a `kind` discriminant, built by factory functions (e.g. `createWalker(def, id)`) from level definitions at `createWorld`, through the registry `sim/enemies/index.ts`. (ga:1415, 1428-1431)
- AR71: Entity ids are numbers from `world.nextId++`, assigned in level order at load (deterministic). (ga:1169, 1416)
- AR72: Mid-level spawns (shots, seeds, millstones) use fixed-capacity pools allocated in `createWorld`, capacity in `CONFIG`, with an `isActive` flag; never allocated per step; a full pool drops the spawn. (ga:387, 1417, 1433-1438)
- AR73: Every entity has an explicit state machine: a string-literal `state` plus a `stateSteps` counter; all transitions for an entity in one function; no scattered boolean flags; the app uses the same pattern for screens. (ga:1446-1449, 1572)
- AR74: `PlayerState` = `'idle' | 'run' | 'jump' | 'fall' | 'crouch' | 'hang' | 'climb' | 'hurt' | 'dead'`; `nextPlayerState` is the only place transitions are decided; `updatePlayerState` resets `stateSteps` on change. (ga:1455-1469)
- AR75: Rendering maps `state` to an animation clip through one table per actor (e.g. `CLIP_FOR_STATE`) plus one `choose…Clip` function driven by `spitSteps`, `landSteps` and `aim`. For the hero it returns `{ base, overlay }`: spit clips key only the upper body and play over the base clip (only in idle/run/jump/fall/crouch), and land replaces the idle clip briefly. (ga:1448, 1472-1485)
- AR76: View Sync by Entity Id: every drawn entity family uses a `Map<entityId, View>` in `render/actors/`, a `createXView(kind)` factory, `view.update(entity, alpha)`, `view.dispose()`; views are created when missing, updated with interpolated position and state-driven clip, and disposed when their entity is gone (a killed enemy's view first plays its `death` clip to the end); no view keeps a reference to a simulation object between frames. (ga:1320-1350)

#### Gameplay camera

- AR77: The gameplay camera (position, look-ahead, vertical dead zone, re-centring, clamping) is simulation state in `sim/camera.ts`. (ga:340, 446, 1053, 1109)
- AR78: The logical view is a box at least 19 × 10.4 tiles centred on the simulation camera; it defines "on screen" for the enemy attack rule and the spitter's range; the renderer frames at least that box at any aspect ratio; extra width is visual only. Beyond the level's edges the margin shows up to 3 tiles † of the level's dressing, then plain bands; in the warden arena the camera locks to the arena on `arenaEntered` until a respawn or the level's end; after a respawn or a pit return it snaps to Rowan. (ga:96, 447-454, 671-675)

#### Story director

- AR79: `world.story` is `none`, `sealBreak` or `heldBeat` with a start step; the warden reaching 0 HP starts `sealBreak`; Rowan touching Level 3's exit starts `heldBeat`. (ga:452-453, 1054)
- AR80: While a story moment is active: player input ignored except the skip action (`jumpPressed` or `confirmPressed`) when `params.isStorySkippable`; Rowan can't be hurt; at its start, enemy shots, seeds and attacks in progress are removed. (ga:454-457)
- AR81: Timelines are data in `CONFIG.story`, in steps (total plus named cues): `sealBreak` `totalSteps: steps(14)`, cues `sealShatter 2.5`, `wheelStop 3.5`, `millerSink 6`, `rowanChange 8`, `stinger 12` (seconds); `heldBeat` `totalSteps: steps(3)`, no cues; timings † from the narrative design, tuned in Epic 4. (ga:458, 1295-1300) [epic: E4]
- AR82: Cues apply during the timeline; `rowanChange` makes Rowan stage 2 with ledge grab; each cue emits `storyCueReached`; `endStory` applies any unreached cue (when skipped), emits `storyEnded`, then `levelCompleted`. (ga:459-460, 1563)
- AR83: Rendering stages story moments from `story`, the step count and the cue steps in `CONFIG.story` (`render/fx/storyStaging.ts`); rendering keeps no timings of its own. (ga:461, 1288)
- AR84: Story cards (intro, level-line, closing, all-bells) are app states; a separate card scene renders silhouettes of intro, closing and all-bells cards, text in the DOM overlay; the level-line card has no silhouettes (level name and line on the opaque screen ground). (ga:462)
- AR85: Replay-form rule: `levelForm` in `config.ts` sets Rowan's stage and abilities when a level is created; nothing stored. (ga:463)
- AR86: Any new in-level story moment adds a timeline to `CONFIG.story` and a `kind` to `story`, staging in `storyStaging.ts`, and a unit test for its safety, skip behaviour and end state; "Rowan can't be hurt during story moments" has a unit test. (ga:699, 1316-1318)
- AR87: Clear time (`stats.clearSteps`) counts only steps outside story moments; it excludes pauses. (ga:108, 409)

#### Input

- AR88: `input/` turns keyboard events and polled gamepads into one action state; the simulation receives one `InputFrame` per step: `moveX` (-1, 0 or 1), `up`, `down`, `jumpPressed`, `jumpHeld`, `spitPressed`, `spitHeld`, `confirmPressed` (latched from Enter, Space or gamepad south during play; only the story director reads it, as the replay skip) (type in `sim/inputFrame.ts`). (ga:566, 1040)
- AR89: A press is latched until the next step consumes it; a tap shorter than one step is never lost. (ga:567)
- AR90: Stick thresholds: 0.35 sideways, 0.5 up and down. (ga:568)
- AR91: Gamepad reads are wrapped in `try`/`catch` (`platform/gamepad.ts` `readGamepads()`); the first error turns the gamepad off for the session, logs once via `log.warnOnce('input', 'gamepad-off', …)`, and the keyboard keeps working. (ga:569, 738-749)
- AR92: Last-used device: a key press or click sets keyboard; a gamepad button or a stick past the play thresholds sets gamepad (`input/lastDevice.ts`); it goes into `PresentationSettings` and picks control-sign icons and the card advance hint. (ga:570, 1067)
- AR93: App-level actions (pause, mute, menu up/down/left/right, confirm, back) go to the app, never the simulation; menus are gamepad-navigable. (ga:571)
- AR94: Esc pauses during play; in menus and on cards it means Back; Back on the pause menu resumes; Back on the title menu does nothing. (ga:572)
- AR95: Hold-to-repeat: a held menu direction on lists and sliders repeats after 0.4 s at 8 steps per second; values in `core/uiTimings.ts`. (ga:573)
- AR96: Card guard: menu actions are presses, never held state; presses latched before a card appears are dropped; the app ignores all card input, Back included, before the card minimum (about 1.5 s †, in `core/uiTimings.ts`). (ga:574)
- AR97: Bound keys call `preventDefault` while the game has focus so Space and arrows never scroll the itch.io page; verify on the Epic 6 upload. (ga:575) [epic: E6]
- AR98: Every auto-pause trigger releases held keys and directions so Rowan stops. (ga:576)
- AR99: Input frames can be recorded and replayed; the same path feeds the jump search and the development replay tool. (ga:577, 935)

#### App state and session flow

- AR100: Three state layers, each with one owner: app state (`app/` state machine: current screen, current level, first play or replay, settings, save data); level state (`sim/` `World`, camera and story moments included); presentation state (`render/`, `audio/`, `ui/`: interpolation, mixers, particles, shake, audio voices, DOM). (ga:362-368)
- AR101: Session flow is an app-level state machine outside the simulation (`app/app.ts`, `dispatch(cmd)`); the simulation knows nothing about menus. (ga:341, 1059, 1112)
- AR102: App flow: Boot (loading bar) → Device note (phone/tablet; "Try anyway" continues) → Title gate → Title menu → Intro cards (new save) → Level loading (level-line card) → Playing ⇄ Paused → end of level. (ga:372)
- AR103: Epic 3 builds the title gate alone, going straight to the intro cards and Emberwood; the title menu comes in Epic 6 (UX F5). (ga:372) [epic: E3, E6]
- AR104: Level loading shows the level name and line on every load; holds for the reading floor (about 3 s †) and until loading is done, then goes to Playing; on a replay, once loading is done, confirm skips the rest of the floor (UX F10). (ga:373)
- AR105: Paused opens Settings or the confirm dialog (Restart level, Quit), both app states over Paused with the simulation stopped; Back or Cancel returns to Paused; Settings opened from the title menu returns there. (ga:374)
- AR106: Restart recreates the level and fades straight to Playing without the loading card; Quit goes to the level select, or to the title menu before the level select unlocks (UX D9). (ga:374)
- AR107: Pausing works during in-level story moments, the death sequence and the pit fade; the simulation resumes where it stopped (UX M5). (ga:374)
- AR108: End of Levels 1 and 2: Results → next level loading (first play) or Level select (replay); on a replay where the ninth bell is found, the all-bells card plays after the results. (ga:375, 1574)
- AR109: End of Level 3: closing card → all-bells card (if all 9 bells) → Results → Title menu (first play; Continue then opens the level select) or Level select (replay); replays keep the order; the held beat and cards can be skipped. (ga:376)
- AR110: The level select offers the all-bells card again once all 9 bells are found. (ga:377)
- AR111: Auto-pause: tab hidden, window blur, leaving fullscreen during play, or gamepad disconnect / turned off after an error sends Playing → Paused with Resume focused; never resumes by itself; `platform/visibility.ts`, `platform/fullscreen.ts` and `platform/gamepad.ts` report to `main.ts`, which clears held input and dispatches one auto-pause command; outside Playing a trigger only clears held input. (ga:128, 378)
- AR112: Saves happen automatically after each level; leaving mid-level restarts that level. (ga:129)
- AR113: Mouse is for menus only and never required; hover moves focus, click confirms; the cursor hides when play starts and shows when a menu opens (UX D13). (ga:587)

#### Save data and settings

- AR114: Save is versioned JSON in `localStorage` under one key `emberbound.save`, schema `{ version, progress: { unlockedLevel, introSeen, levels: { [levelId]: { bestClearSteps, bellsFound: bellId[] } } }, settings: { musicVolume, effectsVolume, reducedMotion } }`. (ga:348, 467-473)
- AR115: Saves are written at the end of each level and when a setting changes; read at boot, then validated and migrated by `version` (`app/save.ts`). (ga:476, 1062)
- AR116: Bells found are a union across replays; all-bells card unlock is derived from bells found (all 9), not stored. (ga:477-478, 1574)
- AR117: Any storage error switches to an in-memory store for the session; the game keeps running. (ga:479)
- AR118: A corrupt or old save is an expected failure: `loadSave` returns `Result`; the caller falls back to `freshSave()` and logs `log.warn('save', …)`. (ga:721, 751-754)
- AR119: Saves are only accessed through `app/save.ts`; only `platform/storage.ts` reads `localStorage`. (ga:1066, 1113, 1496-1497)
- AR120: Player settings schema and defaults live in `app/settings.ts`; a new save takes `reducedMotion` from `prefers-reduced-motion`, read by `platform/device.ts` and passed in (UX Q5); the fullscreen toggle and the M mute are never saved. (ga:140, 814, 1063)
- AR121: Lasting ids (saved or authored) are kebab-case strings from Tiled object names, scoped by level (e.g. `drowned-mill/bell-2`). (ga:1170)
- AR122: Verify storage behaviour inside itch.io's cross-origin iframe on a private itch.io upload by Epic 6. (ga:480) [epic: E6]

#### Level data and compilation

- AR123: Levels are authored in Tiled 1.12.x as `.tmj` with `.tsj` tilesets under `levels/`: `emberbound.tiled-project` (custom classes: entities, regions, jumps), `tilesets/collision.tsj`, `emberwood.tmj`, `drowned-mill.tmj`, `harrowmere.tmj`, `test-*.tmj`. (ga:343, 484, 979-985)
- AR124: Tiled layer `collision` (tile layer): collision only, from the tileset class: empty, solid, one-way, spike; art never defines collision. (ga:489)
- AR125: Tiled layer `entities` (object layer): `PlayerStart`, enemies, the `Warden`, pickups, embers, bells, checkpoints, the exit, moving and waterwheel platforms, `ControlSign`s, each a typed Tiled class. (ga:490)
- AR126: Tiled layer `regions`: `KillZone` (pit or deep water, triggers the pit rule; falling below the level's bottom edge counts too), `ArenaTrigger` (spans the arena's inside; wakes the warden and locks the camera), `Door` (tiles made solid when the arena is entered), `AudioFade` (fades the music or the ambience bus to the region's target gain: Level 3's music drop-out, Emberwood's hushed glade), `AudioAnchor` (the great wheel). (ga:493)
- AR127: Tiled layer `dressing`: kit props and story props by kit id (the glade, the sacks, the fallen bell); layer `jumps`: marked jumps (from-point, to-area, tier standard or challenge, required ability). (ga:492-493)
- AR128: Tiled classes are PascalCase (`PlayerStart`, `Walker`, `ThornFlyer`, `RootedSpitter`, `Warden`, `Checkpoint`, `Bell`, `Ember`, `WeaponPickup`, `Exit`, `MovingPlatform`, `WaterwheelPlatform`, `ControlSign`, `KillZone`, `ArenaTrigger`, `Door`, `AudioFade`, `AudioAnchor`, `Jump`); custom properties camelCase; layer names exactly `collision`, `entities`, `regions`, `dressing`, `jumps`. (ga:1184)
- AR129: `make levels` (also run by `make build` and `make test`) runs `scripts/compileLevels.ts`, a Node TS script, turning each `.tmj` into `public/assets/levels/<id>.json` in the game's own format. (ga:253, 495, 1002)
- AR130: Compile validation per level: 3 checkpoints and 3 bells, plus 1 checkpoint at the warden's door in a warden level; exactly one `PlayerStart`; either an exit or a warden; checkpoints on safe ground with no enemy within 8 tiles †; challenge-tier jumps within the level's cap; typed entity fields. (ga:496-500, 1562)
- AR131: Kit ground and ledge pieces are picked automatically from the collision grid at compile time by neighbour rules; props are placed by hand in `dressing`. (ga:501)
- AR132: Test levels `levels/test-*.tmj` (e.g. `test-ledge-grab.tmj`, Epic 4's standalone `test-warden-arena.tmj`) compile like the others into `public/assets/levels/`; the release manifest leaves them out, `make build` deletes them from `dist/`, and the budget check fails if one remains; they never appear in the level select; Epic 5 joins the arena to `drowned-mill.tmj`. (ga:502, 985) [epic: E4, E5]
- AR133: At runtime `parseLevel` (`sim/level/parseLevel.ts`) checks only file shape and version, returning `Result`; level rules are validated at build time; runtime format types in `sim/level/levelData.ts`. (ga:723, 1057, 1570)
- AR134: A level's id is its file name in kebab-case, used unchanged everywhere (`emberwood`, `drowned-mill`, `harrowmere`); `content/levels.ts` holds level ids, order and display names. (ga:1092, 1138)
- AR135: Game and tests never depend on Tiled's format; the editor could be swapped by rewriting the compiler. (ga:681)

#### Jump-possibility verification

- AR136: Marked-jump search: for each `jumps` object (`JumpMark`: `id`, `from` point, `to` area, `tier`, required `ability`), a Vitest test loads the compiled level, places Rowan at the from-point with the level's form and abilities, and runs the real simulation over a bounded set of input patterns. (ga:507, 1234)
- AR137: `patterns(mark)` generates bounded patterns, most likely first: run-up steps, direction, jump-press step, hold length, air steering, waiting steps for moving-platform phase, a ledge-grab climb when `ability` is `ledgeGrab`. (ga:508-513, 1235-1242)
- AR138: `tryJump(level, mark, pattern)` creates a `World` with `spawnAt: mark.from` and `CONFIG.levelForm[level.id]`, feeds `InputFrame`s, and passes if Rowan is grounded with feet in `to`, unhurt (not dead, `hitsTaken === 0`), within `JUMP_MAX_STEPS` (defined in the test file); the first success ends the search. (ga:515, 1243, 1246, 1251-1262)
- AR139: Files: `tests/levels/jumpSearch.ts`, `tests/levels/jumps.test.ts`; one test per mark per level, titled `` `${level.id}: jump ${mark.id} is possible` ``. (ga:1251, 1264-1271)
- AR140: There is no test-only code path in the simulation; `spawnAt` is the same `createWorld` option the debug URL parameters use. (ga:1278)
- AR141: Static checks: gap widths, step heights, clear space above take-offs, and one-way ledge spacing against the GDD metrics table, read from `config.ts`. (ga:516)
- AR142: Coverage check: the compile step lists the main path (ground segments from `PlayerStart` to the exit or warden, through every checkpoint); every break, or rise of more than 1 tile, between consecutive segments must have a jump mark, else fail. (ga:517, 1244)
- AR143: Jump verification runs in Node through `make test`, needs no rendering, runs on every level change; marking jumps is part of finishing any level layout. (ga:518, 1276-1277)

#### Asset pipeline

- AR144: Shared assets load at boot; each level's assets load behind its level-line card. `core/loading.ts` defines the `AssetLoader` port (`loadShared`, `loadLevel`, progress counted in files), implemented by `render/assets/loader.ts`, the only code that fetches; the app owns loading state, parses the level, retries a failed load once silently, then shows Retry. Bundles by kind prefix: the shared bundle holds fonts, `icon-` files, every `sfx-` file, Emberwood's music, the hero, the enemies, pickups and markers, and the story cards; each level's bundle holds its compiled level, kit and backdrops, ambience, music (Levels 2 and 3) and the warden. (ga:349, 522-528)
- AR145: Models are `.glb` exported from Blender, compressed (meshopt) and quantized with `@gltf-transform/cli` via `make models` / `scripts/optimizeModels.ts` into `public/assets/`; the loader uses three.js `GLTFLoader` and `MeshoptDecoder`. (ga:254, 283, 524, 1003, 1075)
- AR146: Model conventions: 1 unit = 1 tile; +Y up; characters' origin at the feet (bottom centre), facing +X; kit pieces' origin at the bottom-left of their tile cell; `optimizeModels.ts` checks scale and origin and rejects a model that breaks them. (ga:525)
- AR147: Generated materials are stripped on load and replaced by `render/materials` factories. (ga:526)
- AR148: Textures are few: PNG or WebP (flat palette regions, simple masks); KTX2 only if the budget needs it. (ga:527)
- AR149: Audio file formats are chosen in Epic 3 with the audio tool and must loop without gaps through Web Audio in Chrome, Edge and Firefox. (ga:528) [epic: E3]
- AR150: `scripts/buildManifest.ts` writes `public/assets/manifest.json` from the files in `public/assets/`, with a shared bundle plus one bundle per level; it runs before Vite in `make dev`, `make shots`, `make test` and `make build`; development manifests list the test levels, the release manifest leaves them out; code looks assets up by manifest id through `render/assets/loader.ts`, never by path string. (ga:529, 1000, 1004, 1495, 1504, 1524)
- AR151: Changing levels disposes the previous level's geometries, materials and textures (`render/assets/dispose.ts`). (ga:530, 1075)
- AR152: Per-asset budgets (†, enforced by `make build` via `scripts/checkBudgets.ts`): hero both stages 2 MB; each enemy 0.6 MB; warden 2 MB; each level kit with backdrops 3.5 MB; story cards together 1 MB; pickups and markers (all 6) 0.5 MB; music and ambience 8.5 MB; sound effects 2 MB; code gzipped (JS and CSS bundles and `index.html`) 1 MB; fonts 0.3 MB; level data (compiled levels and `manifest.json`) 0.25 MB; interface icons 0.05 MB; total 30 MB or less (about 29.9 MB planned). (ga:532-546, 1005)
- AR153: Shipped models: `hero-rowan.glb`, `enemy-walker.glb`, `enemy-thorn-flyer.glb`, `enemy-rooted-spitter.glb`, `warden-drowned-miller.glb`, `pickup-ember.glb`, `pickup-bell.glb`, `pickup-triple-shot.glb`, `pickup-piercing-shot.glb`, `marker-checkpoint.glb`, `marker-exit.glb`; kits `kit-emberwood.glb`, `kit-drowned-mill.glb`, `kit-harrowmere.glb`. (ga:989-993)
- AR154: Shipped asset names are kebab-case with kind prefix: `hero-`, `enemy-`, `warden-`, `kit-`, `pickup-`, `marker-`, `music-`, `amb-`, `sfx-`, `card-`, `icon-`; source art in `art-src/` uses the matching kebab-case name. (ga:1139-1155)
- AR155: 13 hero animation clips (snake_case): `idle`, `run`, `jump`, `fall`, `land`, `spit`, `spit_up`, `spit_down`, `crouch`, `hurt`, `death`, `hang`, `climb_up`; enemies: `move`, `idle`, `swell_fire`, `hurt`, `death`; warden: `idle`, `wash_warn`, `wash`, `millstone_warn`, `millstone`, `roll_warn`, `roll`, `hurt`, `phase_change`, `defeat`. (ga:102, 1179-1182)
- AR156: glTF node names are snake_case; hero parts `horn_left`, `horn_right`, `horn_right_broken`, `claw_right`, `hand_right`; kit pieces inside a kit `.glb` named `<kind>_<variant>` (e.g. `ground_top`, `ledge_oneway`, `prop_lantern`, `story_glade_arch`). (ga:1178, 1183)
- AR157: Fonts are self-hosted; no runtime requests to third parties. (ga:590)
- AR158: `docs/ASSETS.md` records every asset, tool, licence and AI flag; generated reference images live in `art-src/reference/` and are logged there. (ga:968, 978)
- AR159: Epic 2 proves the AI-mesh pipeline (Tripo → Blender via MCP → glTF); fallback is a hand-built model; Blender MCP is set up in Epic 2 from its current documentation. (ga:177, 1620, 1626) [epic: E2]

#### Rendering

- AR160: three.js WebGLRenderer with GLSL; `render/materials` is the only module that contains GLSL, uses `ShaderMaterial` or `onBeforeCompile`, or defines post-processing passes; enforced by ESLint `no-restricted-imports` outside it and review for GLSL strings. (ga:335, 552, 665-669, 1517)
- AR161: `render/materials` exports factories for ground, foliage, character, prop, effect, backdrop and card-silhouette materials, plus the outline and grading passes if the style uses them; every other module asks it for materials. (ga:553-554)
- AR162: View camera (`render/viewCamera.ts`): perspective, narrow field of view (about 30° †), framing the play plane (z = 0) so the logical view fits at any aspect ratio, interpolated from the simulation camera; may switch to orthographic with hand-made parallax if the style locked in Epic 0 calls for it. (ga:350, 550, 1071) [epic: E0]
- AR163: Depth layers (`render/stage.ts`): far distance, middle distance, play layer (z = 0: kit, characters, pickups, effects), foreground (never covers the play area). (ga:551, 1070)
- AR164: Palette per level as data with named slots (ground, foliage, hazard, warm, …) in `render/palettes/` (`emberwood.ts`, `drownedMill.ts`, `harrowmere.ts`, `story.ts`); assets carry slot indices; enemy recolours are palette swaps. (ga:555, 1073)
- AR165: Lighting rig per level as data (key, fill, fog, where warm light is allowed) in `render/lighting/` (`emberwood.ts`, `drownedMill.ts`, `harrowmere.ts`). (ga:556, 1074)
- AR166: Hero is one skinned mesh with named parts (horns, right claw and hand); stage 2 toggles parts on the same rig and animations. (ga:557)
- AR167: Repeated kit pieces use `InstancedMesh` with bounding volumes computed so culling works (check instanced-mesh culling in this three.js version). (ga:281, 559)
- AR168: One directional shadow snapped to texel steps, or blob shadows if performance needs them, decided in Epic 0; shadow map budget one, 2048 × 2048 at most †. (ga:560, 656) [epic: E0]
- AR169: Card scene (`render/cards/cardScene.ts`): separate scene, orthographic camera, flat layered silhouette planes, palette and light data per card from `content/cards.ts`; text in the DOM overlay. (ga:561, 1079, 1091, 1118)
- AR170: Look-dev page: second Vite entry `lookdev.html` (`src/lookdev/main.ts`, `assetBrowser.ts`), development only, excluded from the production build, served by `make dev` at `/lookdev.html`; shows any asset under the game's look next to the style swatches. (ga:562, 609, 1095, 1125, 1640) [epic: E0]
- AR171: Shake is computed in rendering from events using `CONFIG.feedback`; a new shake raises trauma to its value if higher, never adds; reduced motion turns it off. (ga:420, 1559)
- AR172: Full-screen flashes (`render/fx/flash.ts`, e.g. the seal-break ember flash staged by `storyStaging.ts`) read `reducedMotion`; with it on each becomes a short fade; hit-stop and the 9 Hz blink stay (UX D17). (ga:139, 421)
- AR173: The 9 Hz blink is derived from the invulnerability timer and the step count. (ga:422)
- AR174: Reduced motion also stops the HUD's last-heart pulse and icon shake. (ga:139)
- AR175: `main.ts` passes rendering, audio and the interface one read-only `PresentationSettings` snapshot per frame: `reducedMotion`, `musicVolume`, `effectsVolume`, `isMuted`, `lastDevice`, `isAudioLocked`, `isFullscreen`, and optional features turned off for the session (storage, gamepad, fullscreen); no presentation layer reads settings, devices or feature status any other way. (ga:423, 1407, 1529)
- AR176: Control signs are scenery (carved waymarkers) drawn by `render/level/controlSigns.ts`, with icons from `public/assets/icons/` picked from the presentation settings. (ga:592, 1122)
- AR177: `render/renderer.ts` owns WebGLRenderer setup, resize and pixel ratio; pixel ratio capped at 1.5 †, dropped to 1.0 if the performance pass needs it. (ga:658, 1070)
- AR178: Any visual change runs the critic loop: `make shots`, compare against the style guide, fix; at most 3 rounds. (ga:1535)
- AR179: `docs/STYLE_GUIDE.md` is written in Epic 0. (ga:977) [epic: E0]

#### Interface (DOM overlay)

- AR180: The interface is a DOM overlay above the canvas in plain TypeScript, no framework: one module per screen plus CSS. Screens: boot loading, HUD, title (gate then menu), loading card, level select, results, settings, pause, card text, error panels (bug; retry for boot and level loads), device note, perf report. (ga:346, 581-582, 1085-1087)
- AR181: Shared components, one file each in `ui/components/`: `menuItem.ts`, `panel.ts`, `scrim.ts`, `slider.ts`, `toggle.ts`, `noticeLine.ts`, `confirmDialog.ts`; screens are built from them (UX M8). (ga:583, 1083-1084)
- AR182: `ui/overlay.ts` is the root: stacks layers in DESIGN.md's Elevation & Depth order, owns the mute indicator (above every scrim, the error panel's included), and sets `--tile`. (ga:584, 1082)
- AR183: `--tile` = on-screen size of one world tile, set only by `ui/overlay.ts` on resize from the logical view's size in `sim/config.ts` and DESIGN.md's formula (including any margin Epic 0's camera frames); CSS never hard-codes it; every overlay size is a multiple of it. (ga:585, 1174, 1526)
- AR184: DESIGN.md tokens become CSS custom properties `--{group}-{name}` (in `ui/styles/base.css`; screens in `screens.css`); colours and type only through the token properties. (ga:585, 1088, 1174, 1526)
- AR185: UI timings (fades, holds, results stagger, menu repeat, card minimum, loading-card reading floor) live only in `core/uiTimings.ts`, in seconds (`…Seconds`), never frames; each value provisional † and tuned in the epic that builds its surface. (ga:586, 812, 1034, 1526)
- AR186: The interface reads app state and `DeepReadonly<World>` each frame, touches the DOM only when a value changes, and sends commands to the app (start, select level, change setting), never to the simulation. (ga:588)
- AR187: Story text comes from `content/storyText.ts` (`STORY_TEXT`), keyed by moment; never hard-coded in screens; English only, kept apart from the art. (ga:142, 589, 813, 1505, 1525)
- AR188: CSS classes are kebab-case, prefixed by the component's name in the UX spines (e.g. `hud-hearts`, `results-stat`); shared components take `ui-` (proposed, e.g. `ui-menu-item`). (ga:1173)
- AR189: Players never see stack traces or technical text. (ga:725)

#### Audio

- AR190: Audio uses the Web Audio API directly with a small mixer, no library; an `AudioContext` is created or resumed on the first key press or click (normally at the title gate). (ga:347, 596, 701-705)
- AR191: Gamepad presses are not user activation: a gate passed with a gamepad leaves audio locked; the game runs silently and the title menu shows the audio notice until the first key press or click (UX A1; verify on the Epic 6 upload). (ga:596) [epic: E6]
- AR192: Buses: master → music, effects, ambience; settings volumes map to bus gains; M toggles master mute. (ga:597)
- AR193: Music: one looping buffer per level; the warden arrangement crossfades in on `wardenPhaseChanged`; stingers play once; at the seal break the music cuts and the stinger plays on `storyCueReached`; on `regionEntered` for an `AudioFade` region its bus (`music` or `ambience`) fades to the region's target gain (Level 3's music to 0, Emberwood's glade ambience lowered), and a respawn outside the region restores the bus. (ga:598-603)
- AR194: Ambience: one looping bed per level; the great wheel's loop gain follows Rowan's distance from the arena anchor (`AudioAnchor`), read from the snapshot; distance curve in `audio/mix.ts`. (ga:604, 811)
- AR195: If creating or resuming the `AudioContext` throws or is rejected, audio stays off for the session, the game runs, and no notice is shown (UX Q7); a context still waiting for a key press or click is locked, not failed. (ga:605)
- AR196: Audio modules: `audio/mixer.ts` (buses), `music.ts`, `sfx.ts`, `ambience.ts`, `mix.ts`; guarded context in `platform/audioContext.ts`. (ga:1066, 1080, 1120)

#### Error handling

- AR197: Three failure classes, each handled one way: Bug (broken invariant) → `invariant()` throws; Optional feature unavailable → wrapped at the feature's edge in `platform/`, first failure turns it off for the session with one warning; Expected failure (asset fetch fails, save corrupt or old) → return `Result<T, E>`, never throw. (ga:715-721)
- AR198: Bug handling: in development fail loudly with the error in the debug overlay; in release the frame loop catches it, logs it, and shows a small "Something went wrong" panel with "Restart level"; the loop keeps running. (ga:719, 379)
- AR199: A request refused only for lack of user activation (fullscreen toggle or audio unlock from a gamepad) is not a failure: the feature stays available and the next key press or click can retry. (ga:720)
- AR200: `core/result.ts`: `type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }`; `core/invariant.ts`: `invariant(cond: unknown, msg: string): asserts cond`, throwing `Invariant failed: ${msg}`. (ga:730-736)
- AR201: An asset fetch failure is retried once silently, then a Retry panel is shown; Retry repeats that load as often as pressed (UX Q8). (ga:379, 721)
- AR202: Gamepad, storage, audio and fullscreen each fail independently; the frame loop never stops because of one of them. (ga:126-127)

#### Logging

- AR203: Logging only through `core/log.ts`; format `[channel] message` plus optional data object; destination the browser console only; no remote logging or telemetry. (ga:771-773, 1523)
- AR204: Log levels: `error` (bug caught by frame loop) and `warn` (feature off, fallback, retry) ship in release; `info` (boot, level loaded, save written) and `debug` do not. (ga:775-782)
- AR205: Log channels are a fixed union: `loop`, `app`, `sim-host`, `render`, `audio`, `input`, `save`, `assets`, `ui`. (ga:786)
- AR206: `warnOnce` prevents a repeated failure flooding the console; no logging in `sim/` (ESLint bans `console`); no logging in per-frame or per-step paths except behind a development flag; ESLint `no-console` everywhere except `core/log.ts`. (ga:787-789, 1523)

#### Debug tooling

- AR207: Development tools sit behind `import.meta.env.DEV` and are stripped from release builds; `debug/` is imported only by `main.ts`. The one release exception is the `?perf=1` recorder. (ga:352, 621, 940-944, 1093)
- AR208: Debug overlay toggled with F1: hitboxes, collision grid, logical-view box, step counter, player state, story state, frame-time graph and percentiles; draw calls and triangles from three.js renderer statistics. (ga:622-625, 661, 932)
- AR209: URL parameters `?level=drowned-mill&checkpoint=cp-2&form=changed` start at any spot by setting `params.spawnAt`, using level ids. In development builds any of `level`, `checkpoint` or `shot` also skips the title gate, the intro and the loading card's reading floor; `reducedMotion=1` sets the snapshot's reduced motion before Epic 6. (ga:626, 933, 1575)
- AR210: Cheats (invulnerable, set hearts, grant ledge grab) call `sim/debugCommands.ts`, the only way `debug/` changes the `World`. (ga:934, 1056, 1567)
- AR211: Input recording to a file and replay from it (`debug/inputRecorder.ts`), to reproduce bugs exactly. (ga:627, 935, 1094)
- AR212: `window.__emberbound` dev handle (`debug/devHandle.ts`): `isReady()`, `getState()`, `gotoSpot(id)`, `pause()`, `stepFrames(n)`, so the Playwright MCP and screenshot harness can drive and inspect the game. (ga:936, 1094)
- AR213: Screenshot mode `?shot=<spotId>` (`debug/screenshotMode.ts`): builds the `World` at the spot, pauses the simulation, freezes animation at a fixed time, seeds particles, and reports ready via `window.__emberbound.isReady()`; spots (`id`, `level`, position, `form`, `animTime`) live in `src/debug/spots.ts` as `SPOTS`, imported by the Playwright spec. (ga:937, 1356-1371)
- AR214: `?perf=1` frame-time recorder ships in all builds: records frame times and level load times over a run, split into segments at each `checkpointReached` and at `arenaEntered`, and shows median and 99th percentile for the level and each segment; `app/perf.ts` records, `ui/screens/perfReport.ts` shows; changes nothing about play. (ga:938, 944, 1064)

#### Testing

- AR215: Simulation rule tests: Vitest, `src/sim/**/*.test.ts` beside the code, in Node; cover every simulation rule, the story-moment safety rule and the feel regression test. (ga:633)
- AR216: Level tests: Vitest in Node under `tests/levels/`: compile validation, marked-jump search, coverage, static metric checks. (ga:635)
- AR217: App and input tests: Vitest in Node, `src/app/*.test.ts` and `src/input/*.test.ts`: save validation and migration, the app state machine (UX states, confirm dialog, auto-pause), the reduced-motion default, input latching, hold-to-repeat and the card guard, with synthetic events. (ga:636)
- AR218: Browser smoke checks: Playwright `tests/e2e/smoke.spec.ts` in headless Chromium and Firefox: boot, title gate, title, level, pause and the restart confirm; no console errors; a gamepad error doesn't stop the frame loop; refused storage falls back. (ga:637)
- AR219: Screenshot harness: Playwright `tests/e2e/shots.spec.ts`, headless Chromium, against the dev server (Playwright `webServer`); `make shots ROUND=n` first runs the look-dev checks in `tests/e2e/lookdev/` (fonts, framing, render budgets) and stops on a failure, then saves `shots/round-<n>/<spotId>.png`; screenshots compared by eye against the style guide, never pixel-diffed; spots added when a level or set piece is built. (ga:638, 943, 1372-1386)
- AR220: No DOM test environment (no jsdom); interface screens are checked through Playwright. (ga:642)
- AR221: `make test` runs the Node layers; `make smoke` and `make shots` run Playwright; `make check` runs lint, `prettier --check`, the type check and `make test`; run `make check` before saying a change works. (ga:252, 643, 1527, 1534)
- AR222: Headless-WebGL screenshots are never used for performance numbers. (ga:180, 287)
- AR223: Performance verified with `?perf=1` on the release build on real hardware; first load measured with browser developer tools on real hardware, network throttled to 50 Mbit/s. (ga:639-640)

#### Performance

- AR224: Frame time: 60 fps sustained; median 16.7 ms or less and 99th percentile 20 ms or less over a full Level 1 playthrough, release build, 2020-era Iris Xe-class laptop at 1080p. (ga:112-115, 651)
- AR225: Starting budgets (†): one simulation step 1 ms or less; draw calls 150 or fewer per frame; triangles on screen 250,000 or fewer; GPU texture memory 256 MB or less; one shadow map at most 2048 × 2048; at most 2 post-processing passes (outline, grading); pixel ratio capped at 1.5; checked on Epic 0's test scene and in Epic 6's performance pass. (ga:647-658) [epic: E0, E6]
- AR226: Loading: 30 MB or less total; first input within 10 s on 50 Mbit/s; level transitions 3 s or less (loading behind the level-line card). (ga:120-123)
- AR227: Measurement: `?perf=1` for frame and load times; debug overlay for draw calls and triangles; browser profilers for spikes. (ga:661)

#### Build and release

- AR228: `vite build` with `base: './'` so every URL is relative; the look-dev entry is excluded; hashed asset names. (ga:209, 609)
- AR229: `make build` runs in order: level compile and validation; type checking; tests (which write the development manifest); the release manifest (`scripts/buildManifest.ts --release`, without test levels); Vite build; removing test levels from `dist/assets/levels/`; budget checks (total 30 MB or less, 1,000 files or fewer, per-asset budgets, no test level left in `dist/`). (ga:255, 610-616)
- AR230: itch.io limits respected: 1,000 files, 500 MB total, 200 MB per file. (ga:124)
- AR231: `make release` uploads `dist/` to itch.io with `butler`, pinned in `mise.toml` in Epic 6. (ga:258, 351, 617) [epic: E6]
- AR232: Before public release, a private itch.io upload verifies iframe behaviour: gamepad, storage, audio, fullscreen; audio unlock after a gamepad-passed gate; fullscreen refused from a gamepad; the Esc that leaves browser fullscreen; iframe focus; page scrolling; the 1280 × 720 embed with itch.io's fullscreen button (UX A1–A3, Q9). (ga:617) [epic: E6]
- AR233: `make preview` serves the production build locally; `make clean` removes build output and caches. (ga:256-257)

#### Platform and browser compatibility

- AR234: Targets: current Chrome, Edge and Firefox; Safari best-effort; keyboard and standard gamepads; landscape, resizable, fullscreen; phones and tablets get a note only (device-note screen with "Try anyway"). (ga:67-70, 372, 1086)
- AR235: Guarded browser features in `platform/`: `gamepad.ts`, `storage.ts`, `audioContext.ts`, `fullscreen.ts`, `visibility.ts`, `device.ts`; each wraps calls in `try`/`catch` and is turned off on failure. (ga:1065-1066)
- AR236: No networking; no runtime requests to third parties. (ga:130, 590)
- AR237: No module reads `localStorage`, `fetch` or a file path directly except its owner in `platform/` or `render/assets/`. (ga:1497)

#### Naming and coding conventions

- AR238: TypeScript files camelCase with one main export per file; no barrel `index.ts` files except `sim/enemies/index.ts` (enemy registry). (ga:1132-1133)
- AR239: Types and interfaces PascalCase; functions and variables camelCase; module constants UPPER_SNAKE (`STEP_HZ`, `CONFIG`); choices as string-literal unions, never TS `enum`. (ga:1161-1164)
- AR240: Step counts in the simulation use the `…Steps` suffix; seconds or milliseconds outside the simulation use `…Seconds` or `…Ms`. (ga:1165-1166)
- AR241: Booleans named `is…`, `has…` or `can…`. (ga:1168, 1530)
- AR242: `any` not without a comment explaining why; `@typescript-eslint/no-explicit-any`; an inline disable needs a reason. (ga:1519)
- AR243: Every `switch` on a union ends with `assertNever` (`core/assertNever.ts`); `@typescript-eslint/switch-exhaustiveness-check`. (ga:865, 1033, 1520)
- AR244: Promises are never left floating; `@typescript-eslint/no-floating-promises`. (ga:1521)
- AR245: Lint baseline: typescript-eslint `strictTypeChecked` plus the listed rules (`make lint`). (ga:1531)
- AR246: Formatting with Prettier and the project config; `make format` writes; `make check` runs `prettier --check`. (ga:1527)
- AR247: Data access: gameplay numbers via `CONFIG` from `sim/config.ts`; story text from `content/storyText.ts`; level data passed into `createWorld()`; assets by manifest id via `render/assets/loader.ts`; saves only through `app/save.ts`. (ga:1490-1496)
- AR248: When a situation isn't covered by the patterns, follow the closest pattern and flag it in the story's notes. (ga:1224)

---

### Modules/Systems the architecture defines

#### Root and tooling

| Module | Path | Responsibility | Cite |
| --- | --- | --- | --- |
| Game entry | `index.html` | Game entry | ga:1011 |
| Look-dev entry | `lookdev.html` | Look-dev page entry, dev only | ga:1012, 562 |
| Makefile | `Makefile` | Single entry point for all commands | ga:234-258, 1014 |
| Tool pins | `mise.toml` | Node, git-lfs, later butler, possibly Tiled | ga:1013 |
| Configs | `tsconfig.json`, `src/sim/tsconfig.json`, `vite.config.ts`, `playwright.config.ts`, `eslint.config.js`, `.gitattributes`, `.gitignore` | Strict TS; DOM-free sim; Vite+Vitest; Playwright; lint + boundaries; LFS | ga:1017-1022 |
| Level compiler | `scripts/compileLevels.ts` | Tiled → game level JSON, validation, main-path listing | ga:495, 517, 1002 |
| Model optimiser | `scripts/optimizeModels.ts` | gltf-transform meshopt and quantization; scale/origin check | ga:525, 1003 |
| Manifest builder | `scripts/buildManifest.ts` | Generates `assets/manifest.json` | ga:615, 1004 |
| Budget checker | `scripts/checkBudgets.ts` | Total size, file count, per-asset budgets | ga:1005 |
| Level sources | `levels/` (`emberbound.tiled-project`, `tilesets/collision.tsj`, `*.tmj`, `test-*.tmj`) | Authored Tiled levels | ga:979-985 |
| Jump search | `tests/levels/jumpSearch.ts`, `tests/levels/jumps.test.ts` | Marked-jump search, coverage, static checks | ga:1009, 1116, 1251-1271 |
| E2E | `tests/e2e/smoke.spec.ts`, `tests/e2e/shots.spec.ts` | Smoke checks; critic-loop screenshots | ga:637-638, 1010 |

#### `src/` modules

| Module | Path | Responsibility | Cite |
| --- | --- | --- | --- |
| Main | `src/main.ts` | Boot, wiring, frame loop; only file that knows every layer; auto-pause dispatch; PresentationSettings per frame | ga:378, 423, 1031, 1399-1409 |
| Result | `src/core/result.ts` | `Result<T, E>` type | ga:730-731, 1033 |
| Invariant | `src/core/invariant.ts` | `invariant()` assertion | ga:733-736, 1033 |
| Log | `src/core/log.ts` | Channelled console logging, `warnOnce` | ga:771-797, 1033 |
| DeepReadonly | `src/core/deepReadonly.ts` | Read-only type for World | ga:1033 |
| assertNever | `src/core/assertNever.ts` | Exhaustive switch helper | ga:1033, 1520 |
| UI timings | `src/core/uiTimings.ts` | All UI fades, holds, repeat, card minimum, reading floor, in seconds | ga:586, 812, 1034 |
| Sim config | `src/sim/config.ts` | Every gameplay number, `CONFIG`, `STEP_HZ`, `steps()`, per-level tables | ga:802-850, 1037 |
| World | `src/sim/world.ts` | `World` type and `createWorld(level, params)` | ga:381-393, 1038 |
| Step | `src/sim/step.ts` | `step(world, input)`: system order | ga:396-409, 1039 |
| InputFrame | `src/sim/inputFrame.ts` | `InputFrame` type | ga:566, 1040 |
| Events | `src/sim/events.ts` | `SimEvent` union | ga:870-908, 1041 |
| Sim math | `src/sim/math.ts` | Vectors, own sin/cos, seeded RNG | ga:415, 1042 |
| Tiles | `src/sim/tiles.ts` | Collision-grid queries: solid, one-way, spike | ga:1043 |
| Body | `src/sim/body.ts` | Bounding boxes; move and resolve on X then Y | ga:1044 |
| Platforms | `src/sim/platforms.ts` | Moving and waterwheel platforms; carrying riders | ga:1045 |
| Player | `src/sim/player/` (`controller.ts`, `ledgeGrab.ts`, `damage.ts`, `respawn.ts`) | Feel table, buffer, coyote, crouch, drop-through, ledge grab, damage, respawn | ga:1046, 1103 |
| Combat | `src/sim/combat/` (`shots.ts`, `stomp.ts`, `hitboxes.ts`, `weapons.ts`) | Shots, aiming, weapons, hitbox rules, stomp, knockback | ga:1047, 1105 |
| Enemies | `src/sim/enemies/` (`walker.ts`, `thornFlyer.ts`, `rootedSpitter.ts`, `seeds.ts`, `index.ts` registry) | Enemies, seeds, on-screen attack rule | ga:1048, 1106 |
| Warden | `src/sim/warden/` (`warden.ts`, `attacks.ts`, `schedule.ts`) | Phases, attack schedule, warnings, millstone targeting, reset | ga:1049, 1107 |
| Pickups | `src/sim/pickups.ts` | Embers, ember meter, bells, weapon pickups | ga:1050 |
| Checkpoints | `src/sim/checkpoints.ts` | Checkpoints, pit rule's last stable ground, exit | ga:1051 |
| Regions | `src/sim/regions.ts` | Region triggers | ga:1052 |
| Camera | `src/sim/camera.ts` | Gameplay camera and logical view | ga:1053, 1109 |
| Story | `src/sim/story.ts` | Story director in level: seal break, held beat, safety, skip | ga:1054, 1287 |
| Stats | `src/sim/stats.ts` | Clear time, respawns, embers | ga:1055 |
| Debug commands | `src/sim/debugCommands.ts` | Dev cheats; only way debug changes World | ga:1056 |
| Level runtime | `src/sim/level/` (`levelData.ts`, `parseLevel.ts`) | Runtime level types; validated load → Result | ga:1057 |
| App | `src/app/app.ts` | App state machine, `dispatch(cmd)`, card sequences | ga:1059, 1110, 1112 |
| Commands | `src/app/commands.ts` | `AppCommand` union | ga:1060 |
| Level host | `src/app/levelHost.ts` | Creates a World per level, runs steps, gathers events | ga:1061 |
| Save | `src/app/save.ts` | Versioned save and migrations | ga:1062 |
| Settings | `src/app/settings.ts` | Settings schema and defaults | ga:1063 |
| Perf | `src/app/perf.ts` | `?perf=1` recorder (ships in release) | ga:1064 |
| Platform | `src/platform/` (`gamepad.ts`, `storage.ts`, `audioContext.ts`, `fullscreen.ts`, `visibility.ts`, `device.ts`) | Guarded browser features | ga:1065-1066 |
| Input | `src/input/` (`keyboard.ts`, `gamepadMapping.ts`, `actions.ts`, `lastDevice.ts`) | Action state, latching, InputFrame, menu actions, device tracking | ga:1067 |
| Renderer | `src/render/renderer.ts` | WebGLRenderer setup, resize, pixel ratio | ga:1070 |
| Stage | `src/render/stage.ts` | Scene and depth layers | ga:1070 |
| View camera | `src/render/viewCamera.ts` | Perspective camera framing logical view; interpolation | ga:1071 |
| Materials | `src/render/materials/` | Only place for GLSL, ShaderMaterial, onBeforeCompile, post passes | ga:1072 |
| Palettes | `src/render/palettes/` (`emberwood.ts`, `drownedMill.ts`, `harrowmere.ts`, `story.ts`) | Palette per level/scene | ga:1073 |
| Lighting | `src/render/lighting/` (`emberwood.ts`, `drownedMill.ts`, `harrowmere.ts`) | Lighting rig per level | ga:1074 |
| Asset loader | `src/render/assets/` (`loader.ts`, `dispose.ts`) | GLTFLoader, MeshoptDecoder, manifest lookup; disposal | ga:1075 |
| Level view | `src/render/level/` (`levelView.ts`, `backdrops.ts`, `dressing.ts`, `controlSigns.ts`) | Kit instancing, backdrops, dressing, control signs | ga:1076 |
| Actors | `src/render/actors/` (`hero.ts`, `enemies.ts`, `warden.ts`, `pickups.ts`) | View sync, stages, clips from sim state | ga:1077 |
| FX | `src/render/fx/` (`particles.ts`, `shake.ts`, `flash.ts`, `storyStaging.ts`) | Particles, shake, flash, story staging | ga:1078 |
| Cards | `src/render/cards/cardScene.ts` | Silhouette card scene | ga:1079 |
| Audio | `src/audio/` (`mixer.ts`, `music.ts`, `sfx.ts`, `ambience.ts`, `mix.ts`) | Buses, music, SFX, ambience, mix levels and curves | ga:1080 |
| Overlay root | `src/ui/overlay.ts` | Layer stacking, `--tile`, mute indicator | ga:1082 |
| UI components | `src/ui/components/` (`menuItem.ts`, `panel.ts`, `scrim.ts`, `slider.ts`, `toggle.ts`, `noticeLine.ts`, `confirmDialog.ts`) | Shared components | ga:1083-1084 |
| UI screens | `src/ui/screens/` (`bootLoading.ts`, `hud.ts`, `title.ts`, `loadingCard.ts`, `levelSelect.ts`, `results.ts`, `settings.ts`, `pause.ts`, `cardText.ts`, `deviceNote.ts`, `levelError.ts`, `perfReport.ts`) | One module per screen | ga:1085-1087 |
| UI styles | `src/ui/styles/` (`base.css`, `screens.css`) | Token custom properties; screen styles | ga:1088 |
| Story text | `src/content/storyText.ts` | Every story line, keyed by moment | ga:1090 |
| Card defs | `src/content/cards.ts` | Story card layers, palette slots, light | ga:1091 |
| Level list | `src/content/levels.ts` | Level ids, order, display names | ga:1092 |
| Debug | `src/debug/` (`overlay.ts`, `urlParams.ts`, `cheats.ts`, `inputRecorder.ts`, `devHandle.ts`, `screenshotMode.ts`, `spots.ts`) | Dev-only tools | ga:1093-1094 |
| Look-dev | `src/lookdev/` (`main.ts`, `assetBrowser.ts`) | Look-dev page | ga:1095 |

#### The 21 core systems (Project Context table; locations from System Location Mapping)

Fixed-step loop and interpolation; player controller; bodies and tile collision; combat and damage; enemies (walker, thorn flyer, rooted spitter, on-screen attack rule); the warden (dormant until entry, 2 phases, scheduler, warnings, millstone targeting, reset on respawn); ledge grab (from Epic 4); hit feedback; camera; input; level data and loading; jump-possibility verification; rendering and look; look-dev page and critic-loop harness; asset pipeline (13 hero animations, within 30 MB); story director; silhouette story cards; audio; interface and session flow; save and progress; clear-time tracking. (ga:84-108, 1098-1126)

---

### Architecture decisions deferred or open

| Item | Status / when | Cite |
| --- | --- | --- |
| Image model for reference art | Open; blocks Epic 0's reference art; log terms in `docs/ASSETS.md` | ga:82, 1649 |
| Audio tools | Open; blocks Epic 3's audio | ga:82, 184 |
| Audio file formats | Chosen in Epic 3 with the audio tool | ga:528 |
| `mise exec --` vs activated shell in Makefile | Epic 0 decides, after checking mise docs | ga:235 |
| Exact Makefile target set | Finalised in Epic 0 story 1; later epics add | ga:238 |
| typescript-eslint peer range for ESLint 10 | Confirm at scaffold | ga:211 |
| Prettier exact version | 3.9, or 3.10 once two weeks old | ga:212 |
| Exact patch versions of all deps | Newest patch ≥ two weeks old at scaffold | ga:221 |
| TypeScript 7.x | Own story once 7.1 and typescript-eslint support it | ga:210 |
| `@gltf-transform/cli` version | "current at Epic 0" (table says 4.5.x) | ga:213, 349 |
| butler version | Chosen and pinned in Epic 6 | ga:351, 617, 1549 |
| Tiled installable via mise | Checked in Epic 1; else recorded and checked by `make setup` | ga:503, 1549, 1608 |
| git-lfs via mise | If the mise registry has it, else system package | ga:1217, 1607 |
| Blender version | Pinned in Epic 2 | ga:1609 |
| Blender MCP install | Epic 2, from its current docs | ga:1620, 1626 |
| Perspective vs orthographic camera | May switch if the style locked in Epic 0 calls for it | ga:550 |
| Directional snapped shadow vs blob shadows | Decided in Epic 0 | ga:560 |
| Outline and grading passes | "if the style uses them" | ga:282, 553 |
| KTX2 textures | Only if the budget needs it | ga:527 |
| `--tile` margin | Depends on whether Epic 0's camera frames a margin | ga:585 |
| `ui-` CSS prefix for shared components | "(proposed)" | ga:1173 |
| Storage in itch.io iframe | Verify on private itch.io upload by Epic 6 | ga:480 |
| `preventDefault` scroll, audio unlock via gamepad, fullscreen, iframe focus, 1280×720 embed | Verify on the Epic 6 upload | ga:575, 596, 617 |
| itch.io iframe behaviours generally | Verify against current itch.io and browser docs | ga:179 |
| Instanced-mesh culling in r187 | Check (prototype bug) | ga:281 |
| Screenshot spot `l3-fallen-bell` coordinates | Set in Epic 5 | ga:1369 |
| Performance budgets (†) | Checked on Epic 0 test scene and Epic 6 perf pass, tuned with developer | ga:647 |
| Asset budgets (†) | Starting values | ga:532 |
| UI timings (†) | Each tuned in the epic that builds its surface | ga:586, 812 |
| `crouchHurtboxHeight` † | Tune in Epic 1 | ga:834 |
| `spitClipSteps`, `landClipSteps` † | Tune in Epic 2 | ga:843-844 |
| Story timelines † | From narrative design, tuned in Epic 4 | ga:1295 |
| Card minimum (~1.5 s †), reading floor (~3 s †), FOV (~30° †), checkpoint enemy distance (8 tiles †), pixel-ratio cap (1.5 †) | Starting guesses | ga:373, 498, 550, 574, 658 |
| Release-success measurement / analytics | Open GDD question; would be a separate consented feature, any backend in Docker | ga:260, 773 |
| Desktop build (Electron, steamworks.js) | Later, not in version one | ga:71 |
| Move to WebGPU/TSL | Later; one-module rewrite of `render/materials` | ga:34, 201, 669 |
| CLAUDE.md update (Tiled no longer open; mise/Makefile/Docker rule) | Follow-up, needs developer approval | ga:43, 1589 |
| GDD Dependencies table (level editor still "not chosen") | Follow-up via `gds-gdd` update or `gds-correct-course` | ga:1590 |
| `_bmad-output/project-context.md` refresh after v1.1 | Follow-up via `gds-generate-project-context` | ga:1591 |
| Context7 MCP authorization | Developer runs `/mcp` interactively | ga:301, 1625, 1648 |
| GitHub LFS quota | Check before Epic 0 / first binary commit | ga:1218, 1647 |

---

## Part 6: UX design requirements


#### A. Design tokens and visual foundations

- UX-DR1: Token pipeline. Every DESIGN.md token is emitted as a CSS custom property named `--{group}-{name}` (e.g. `--colors-surface-scrim`; the 8-digit hex on `surface-scrim` is intentional, 75 % alpha). Components and screen CSS read role tokens only, never raw hex. `ui/` never imports `render/` palettes. `--tile` is not emitted from tokens. (DESIGN.md:110-114, 234)
- UX-DR2: Colour roles. Exactly 16 role tokens, each with its provisional value, role and "never used for" rule: `surface-screen`, `surface-scrim`, `surface-panel`, `surface-focus`, `border-subtle`, `text-primary`, `text-muted`, `focus-ring`, `hud-outline`, `hud-track`, `heart-fill`, `heart-empty`, `ember`, `weapon-timer`, `warden-bar`, `warning`. Role names never change; only values do. (DESIGN.md:12-31, 110, 116-133)
- UX-DR3: Warm-colour rule. `ember` is the only warm value in the overlay. It is used only for the ember meter fill, the ember-to-heart transfer and the full-meter glow. Hearts, bells, timer, warden bar, focus and buttons stay neutral or cool. (DESIGN.md:3, 93, 111, 130, 231)
- UX-DR4: Contrast targets (WCAG 2.x relative luminance; scrim composited over white as the worst case). Text needs ≥ 4.5:1: `text-primary` and `text-muted` on panel, screen and focus; `text-primary` on scrim; HUD text against its `hud-outline` ring; the "New best" tag. Non-text needs ≥ 3:1: `focus-ring` on panel, focus and screen; slider fill on its track; HUD fills on `hud-track`; `heart-empty` on `hud-track`; HUD fills against `hud-outline`. `text-muted` is never used on the scrim (it measures 3.6). (DESIGN.md:124, 135-148; EXPERIENCE.md:292)
- UX-DR5: HUD backing. The HUD has no plate. Every HUD element gets an opaque `hud-outline` ring `{spacing.hud-outline}` wide plus a soft shadow of the same colour with a `{spacing.1}` blur. Every bar sits in an opaque `hud-track`. HUD text gets the ring around each glyph. Checked by eye on critic-loop screenshots at each level's brightest and busiest spot. (DESIGN.md:126-127, 150, 233)
- UX-DR6: Typography roles and tokens. Three roles (Display, UI, Numeric) and 8 tokens with these size formulas:
  - `display-xl`: `tile×0.9`, no floor
  - `display-lg`: max 24 px / `tile×0.5`
  - `display-body`: 16 px / `0.3`
  - `ui-lg`: 16 px / `0.28`
  - `ui-md`: 14 px / `0.22`
  - `ui-sm`: 13 px / `0.18`
  - `numeric-lg`: 18 px / `0.36`
  - `numeric-md`: 14 px / `0.22`
  
  Weights, line heights and letter spacing are as in the frontmatter. Sizes scale with `--tile` and stop at a pixel floor. All faces are `system-ui, sans-serif` until E0. (DESIGN.md:32-40, 152-160, 164; EXPERIENCE.md:299) [epic: E0]
- UX-DR7: Numeric figures and font constraints. Numbers use tabular figures (`font-variant-numeric: tabular-nums`) so times and counts never shift width; if the UI face lacks tabular figures, the numeric role gets its own face. Fonts are self-hosted `.woff2` in `public/assets/fonts/`, under OFL or an equivalent licence recorded in `docs/ASSETS.md`, with all faces and weights together ≤ 0.3 MB, covering Latin plus the story-text punctuation. (DESIGN.md:39-40, 162-163, 235) [epic: E0]
- UX-DR8: Spacing tokens, as fractions of `--tile`:
  - scale: `1` = 0.05, `2` = 0.1, `3` = 0.15, `4` = 0.25, `5` = 0.4, `6` = 0.6
  - `safe-margin` 0.25
  - `hud-icon` 0.34 (about 23 px at 1280×720)
  - `hud-icon-sm` 0.24
  - `hud-bar-length` 1.12
  - `hud-bar-thickness`: max 4 px / 0.09
  - `hud-outline`: max 1.5 px / 0.02
  - `bar-long` 6
  - `focus-ring`: max 2 px / 0.03
  - `menu-item-height`: max 36 px / 0.5
  - `panel-width`: min(90vw, 7 tiles)
  - `text-measure` 11

  (DESIGN.md:45-63)
- UX-DR9: `--tile` at runtime. `ui/overlay.ts` sets `--tile` on the overlay root from the logical-view size in `sim/config.ts`, using `min(100vw/19, 100vh/10.4)`, and recomputes it on resize. It is never hard-coded in CSS. Expected values: about 101 px at 1920×1080 and about 67 px at 1280×720. If the E0 camera adds margin, the value `overlay.ts` reads must include it. Every overlay size is a multiple of `--tile` (D5). (DESIGN.md:46, 169; EXPERIENCE.md:304, 404) [epic: E0]
- UX-DR10: Radii. `rounded.none` (0) on HUD bars, so square ends read as a measure. `rounded.sm` (max 2 px / `tile×0.04`) on panels, menu items, dialogs and the "New best" tag. `rounded.full` on slider thumbs and toggles. (DESIGN.md:41-44, 196)
- UX-DR11: HUD icon set. Heart, bell, triple shot, piercing shot and speaker-off are single-colour silhouettes, readable at `{spacing.hud-icon-sm}`. Triple and piercing differ by outline shape, never by colour alone. If E0 picks the comic style, panel edges and icons may take its ink outline; the tokens stay the same. (DESIGN.md:197-198) [epic: E0]
- UX-DR12: Elevation (stacking order, bottom to top):
  1. canvas (world or card scene; pit and death fades darken the canvas, under the HUD)
  2. HUD layer
  3. `scrim`
  4. `hud-mute-indicator` (owned by the overlay root, above every scrim)
  5. `panel`
  6. `confirm-dialog` (the only surface stacked on a panel, one level deep)
  7. `error-panel` (topmost)

  No drop shadows on panels. The only blurs in the overlay are the HUD outline shadow and the ember waiting glow. (DESIGN.md:180-192)
- UX-DR13: UI timings module. All UI durations live in `core/uiTimings.ts`, in seconds (never frames), read by `input/`, `app/` and `ui/`. Provisional values:
  - `panelFadeSeconds` 0.15
  - `scrimFadeSeconds` 0.2
  - `hudStoryFadeSeconds` 0.4
  - `bellToastIn/Hold/OutSeconds` 0.15 / 2.0 / 0.4
  - `emberTransferSeconds` 0.3
  - `resultsStaggerSeconds` 0.6
  - `wardenBarFadeInSeconds` 0.4
  - `bootFadeSeconds` 0.3
  - `cardTextFadeSeconds` 0.3
  - `advanceHintFadeSeconds` 0.3
  - `loadingCardFadeSeconds` 0.3
  - `restartFadeSeconds` 0.3
  - `heartCrackSeconds` / `heartPopSeconds` 0.15 / 0.15
  - `wardenBarDrainSeconds` 0.4
  - `menuRepeatDelaySeconds` / `menuRepeatIntervalSeconds` 0.4 / 0.125
  - the GDD card minimum (~1.5 s) and loading-card reading floor (~3 s)

  Each value is tuned in the epic that builds its surface. (EXPERIENCE.md:224-244, 406)
- UX-DR14: Motion and cost rules. Screen changes use fades only: no slides, no bounces, no large-area flash faster than 3 per second. Animate only `opacity` and `transform`. The overlay touches the DOM only on change, so it stays inside the 16.7 ms frame. UI animation is timed in seconds, so 60, 120 and 144 Hz look the same. (EXPERIENCE.md:221, 306-307; DESIGN.md:237)
- UX-DR15: Token value lifecycle (F9).
  1. E0's `docs/STYLE_GUIDE.md` records values for the 16 colour roles and the 3 typefaces (licence checked) and re-measures the contrast table.
  2. DESIGN.md is then updated through `gds-ux` Update.
  3. Every later epic reads the tokens. E1's placeholder HUD already gets the E0 values, and the provisional greys survive only in git history.
  4. E3's final HUD judges the values in play, on critic-loop screenshots.

  Rules: roles stay and values change; `ember` stays the only warm value; every contrast target must still hold; values may be copied from the renderer's palette slots, but only into the overlay's own CSS custom properties. (DESIGN.md:12-14, 95, 99-114; EXPERIENCE.md:411) [epic: E0, E1, E3]
- UX-DR16: Judging the look. The overlay is judged on the look-dev page against the style guide, never against a newly generated image. The extent of the card-text band is judged per card on the look-dev page. (DESIGN.md:218, 239)

#### B. Components (22, identical names in both spines) and ownership

- UX-DR17: `hud-hearts`.
  - Anatomy: always three slots, `{spacing.hud-icon}` size, `{spacing.1}` apart. Filled hearts use `heart-fill`. A lost heart is a `heart-empty` outline around a `hud-track` interior, so the maximum always shows.
  - On `rowanHurt` or `rowanFellInPit`, the rightmost filled heart empties with a crack (0.15 s) and an icon shake.
  - On `heartRestored`, the heart pops (0.15 s) after the ember transfer.
  - At one heart left, the last heart pulses by scale (no colour change, ≤ 2 Hz) until healed or respawned.
  - On `rowanRespawned`, all three refill.
  - Reduced motion: crack without shake, no pulse.

  (DESIGN.md:65, 204; EXPERIENCE.md:145, 187, 240, 279-281)
- UX-DR18: `hud-ember-meter`.
  - Anatomy: a bar `{spacing.2}` under the hearts, `hud-bar-length` × `hud-bar-thickness`, square ends. The `ember` fill grows left to right by length, 0–50, from the sim's count, in `hud-track`.
  - Starts empty each level and is kept through checkpoints, pit falls and respawns.
  - Full meter with full hearts: a steady `ember` glow (`{spacing.3}` blur, no pulse; a secondary cue).
  - Restore: drains into the heart in ≤ 0.3 s, then the heart pops.
  - Embers past a full meter change nothing on the HUD.

  (DESIGN.md:66, 205; EXPERIENCE.md:146, 189, 232, 280-282)
- UX-DR19: `hud-weapon-timer`.
  - Anatomy: the weapon icon (`hud-icon-sm`), then a meter-sized bar `{spacing.2}` after it, placed `{spacing.4}` right of the meter and centred on its line. The `weapon-timer` fill drains right to left.
  - Appears on `weaponCollected` with that weapon's icon. The bar reads the sim's remaining time (20 s) and never runs its own clock.
  - A new pickup swaps the icon and refills the bar.
  - On `weaponRunningOut` (3 s left), the bar blinks ≤ 3 Hz, alternating `warning` and empty track, in step with the warning sound. Reduced motion does not change this.
  - Hides on `weaponExpired` and on death; stays through a pit fall.

  (DESIGN.md:67, 206; EXPERIENCE.md:147, 188, 283)
- UX-DR20: `hud-bell-toast`.
  - Anatomy: the bell icon (`hud-icon-sm`), then "Bell n of 3" in `ui-sm` `text-primary` `{spacing.2}` after it. It sits on the hearts row `{spacing.4}` right of the last heart, with a `hud-outline` ring on glyph and text and no plate.
  - On `bellFound`: fades in 0.15 s, holds 2.0 s, fades out 0.4 s, and plays the bell sound.
  - n counts bells found this run, matching the results screen.
  - A second bell during the hold replaces the text and restarts the hold.

  (DESIGN.md:68, 173, 207; EXPERIENCE.md:148, 231, 284)
- UX-DR21: `hud-mute-indicator`. A speaker-off icon (`hud-icon`, `text-primary` with the outline ring), top-right, `{spacing.safe-margin}` in, with no animation.
  - Owned by the overlay root (`overlay.ts`), not by `hud.ts`, and drawn above every scrim, the error panel's included.
  - Shown while `isMuted` on every surface after the gate, the loading card included. It is not shown on cards or in-level story moments, but it is shown on a pause opened during a story moment.
  - The M key toggles mute anywhere; there is no gamepad binding.
  - Mute is not saved: each session starts unmuted.

  (DESIGN.md:69, 174, 187, 208; EXPERIENCE.md:128, 149, 215, 257)
- UX-DR22: `hud-warden-bar`.
  - Anatomy: the label "The Warden" in `ui-sm`, centred `{spacing.2}` above a `bar-long` bar, top-centre. `warden-bar` fill in `hud-track`.
  - A `hud-outline` notch marks 15 of 30 HP (where phase 2 starts) and overhangs the bar by `{spacing.1}` above and below, so it stays visible after the fill crosses it.
  - On `arenaEntered`: fades in full (0.4 s). On `wardenHit`: drops.
  - On `wardenDefeated`: drains to empty (0.4 s) and fades with the HUD.
  - Stays through Rowan's death sequence. Hides on `rowanRespawned` at the door and reappears full on the next `arenaEntered`.

  (DESIGN.md:70, 174, 209; EXPERIENCE.md:114, 150, 234, 241, 254, 285)
- UX-DR23: `menu-item`. A centred text row in `ui-lg` `text-primary`, at least `menu-item-height` tall (this is also the mouse target).
  - States: rest (no fill); focused (`surface-focus` fill plus a `focus-ring` ring `{spacing.focus-ring}` wide). No disabled state exists, and nothing locked or disabled is ever listed.
  - Exactly one item is always focused. Vertical lists wrap. Hold-to-repeat applies.
  - Focus change plays the menu-move sound and activation plays confirm. The focus ring jumps with no tween.

  (DESIGN.md:71, 176, 210; EXPERIENCE.md:151, 278)
- UX-DR24: `panel`. `surface-panel` fill, a `border-subtle` hairline, `rounded.sm`, `{spacing.5}` padding, `panel-width`, centred, one column, no drop shadow. It holds every menu, results and the level select. It fades in and out (0.15 s) and never slides. (DESIGN.md:72, 176, 192, 211; EXPERIENCE.md:152, 228)
- UX-DR25: `scrim`. A full-viewport `surface-scrim` (75 % alpha).
  - It dims the world under pause, settings opened from pause, confirm, results and error panels. After Level 3 it dims the last card scene under results.
  - The HUD stays under it and the mute indicator stays above it.
  - It fades with its panel (`scrimFadeSeconds` 0.2).
  - Muted text is never placed on it.

  (DESIGN.md:73, 119, 186, 212; EXPERIENCE.md:153, 229)
- UX-DR26: `slider` (music and effects volume).
  - Anatomy: label left (`ui-md`); a thin `border-subtle` track with `text-muted` fill; a `text-primary` round thumb; the value right as a number (`numeric-md`).
  - 11 steps, 0–10.
  - Input: left and right (arrows, A/D, d-pad or stick) change the value, with hold-to-repeat. A mouse click or drag on the track sets it.
  - Applies and saves at once.
  - States: rest; focused (ring around the row).

  (DESIGN.md:74, 213; EXPERIENCE.md:154, 213)
- UX-DR27: `toggle` (reduced motion, fullscreen).
  - Anatomy: label left; "On"/"Off" state text right, beside a switch whose knob position shows the state. Track is `border-subtle` when off and `text-muted` when on. The state text always matches.
  - Confirm or click flips it. States: off; on; focused.
  - Reduced motion applies from the next frame and saves.
  - Fullscreen is not saved and mirrors the real browser state, so leaving fullscreen by Esc shows Off. If the request is refused, the toggle snaps back and shows the fullscreen `notice-line` until Settings closes.

  (DESIGN.md:75, 214; EXPERIENCE.md:155, 199)
- UX-DR28: `confirm-dialog`. A smaller panel over the pause panel, one level deep: one prompt line in `ui-lg`, then two stacked `menu-item`s (the action, then Cancel).
  - Opens from Restart level or Quit, in one step.
  - Cancel is focused on open. Back equals Cancel.

  (DESIGN.md:76, 189, 215; EXPERIENCE.md:156, 200)
- UX-DR29: `results-stat`.
  - Anatomy: rows in fixed order: clear time, bells, respawns, embers. Each row has a label left (`ui-md`, `text-muted`) and a value right (`numeric-lg`, `text-primary`). Rows are `{spacing.3}` apart, with `{spacing.5}` before Continue. All values keep one right edge.
  - Values stagger in over ≤ 0.6 s (per row: hidden, then shown). A confirm during the stagger completes it; a confirm afterwards (on Continue) leaves.
  - "New best" tag: `ui-sm`, `surface-panel` text on `text-primary`, `rounded.sm`, placed directly after the "Clear time" label. It shows only on a replay that beats the stored best, never on a first play.
  - Respawns look exactly like every other row and never get a comment or a colour.

  (DESIGN.md:77, 216; EXPERIENCE.md:131, 157, 201, 233)
- UX-DR30: `level-select-row`.
  - Anatomy: name (`ui-lg`), then best time (`numeric-md`, `text-muted`; "–" when there is none), then three bell slots (`hud-icon-sm`, `{spacing.1}` apart). A found bell is filled in `text-primary`; a missing one is an outline in `text-muted`.
  - Layout: `{spacing.4}` inner padding; rows `{spacing.2}` apart. States: rest; focused (as `menu-item`).
  - One row per finished level, plus the next unlocked one. Bell slots show the union across all runs. Confirm starts that level as a replay.
  - Rewatch variant: a label-only "All-bells card" row that plays the all-bells card and then returns to the level select.

  (DESIGN.md:78, 217; EXPERIENCE.md:113, 132, 158)
- UX-DR31: `card-text`.
  - Anatomy: one line per card in `display-body` `text-primary`, wrapped at `text-measure`, always on a `surface-scrim` band over the card art. The band's extent is judged per card.
  - Input:
    - All input, Back included, is ignored before the ~1.5 s minimum, and a press counts only if it began after the card appeared.
    - Then confirm advances one card.
    - Back skips the rest of the sequence where allowed: intro always; closing and all-bells only on replays.
  - Advance hint: after the minimum, the confirm glyph for the last-used device fades in (0.3 s). It sits at the band's lower right, inset `{spacing.2}`, in `text-muted` at `hud-icon-sm`, and never on bare art.
  - States: fading in (0.3 s); shown; advance hint shown.

  (DESIGN.md:79, 178, 218; EXPERIENCE.md:135, 159, 182, 236-237, 244)
- UX-DR32: `loading-card`.
  - Anatomy: `surface-screen` ground; the level name centred in `display-lg`; its line below in `display-body` (wrapped at `text-measure`). Identical on every load, first play or replay (F10).
  - Timing: held for at least the ~3 s reading floor and until loading finishes, then advances by itself. Fades in and out over 0.3 s.
  - On a replay, once loading is done, the advance hint fades in and confirm skips the rest of the reading floor.
  - Pause input is ignored; M works.

  (DESIGN.md:80, 218-219; EXPERIENCE.md:22, 140, 160, 185, 238, 244)
- UX-DR33: `title-gate-prompt`. "Click or press any key" in `ui-md`, under the `display-xl` wordmark, on `surface-screen` until the title backdrop exists; over art it takes the `card-text` band rule.
  - Any key, click or gamepad button passes.
  - A key or click resumes the `AudioContext`, gives the frame keyboard focus and sets the last device.
  - A gamepad button sets the device but cannot unlock audio.
  - States: shown; fading out on input.

  (DESIGN.md:81, 220; EXPERIENCE.md:106, 130, 161)
- UX-DR34: `boot-loading-bar`. On a `surface-screen` ground: the wordmark, then a `bar-long` bar `{spacing.1}` thick, with `text-muted` fill in `hud-track`.
  - It fills with shared-asset load progress. No text, no percentage, no tips, no input.
  - When done, it fades out (0.3 s) to the gate or the device note. Target: first input ≤ 10 s.

  (DESIGN.md:82, 221; EXPERIENCE.md:118, 139, 162, 172, 235)
- UX-DR35: `notice-line`. One static line in `ui-md` `text-muted`, under the menu it belongs to, only on a panel or `surface-screen`. No icon, no colour coding, no dismiss. Four notices:
  - Storage: title menu, whole session.
  - Audio: title menu, until audio unlocks.
  - Fullscreen: settings, until it closes.
  - Gamepad: pause and title menus, from the moment the pad is disabled until the session ends.

  Strings are at EXPERIENCE.md:115. (DESIGN.md:83, 222; EXPERIENCE.md:115, 138, 163)
- UX-DR36: `error-panel`, two variants. Each is a `panel` on a scrim, topmost, with one `ui-lg` line and one focused `menu-item`, and no technical text.
  - Bug variant: "Something went wrong" / "Restart level". Shown by the frame loop in release builds while the loop keeps running; restarts the level.
  - Retry variant: "Couldn't load the level." / "Retry". Shown after one silent retry fails; repeats the load, boot or level, any number of times.

  (DESIGN.md:84, 190, 223; EXPERIENCE.md:117, 137, 164, 173, 196)
- UX-DR37: `device-note`. A full `surface-screen` ground with the wordmark, the note "Best played on desktop with keyboard or gamepad." in `ui-lg`, and "Try anyway" as an underlined text link in `ui-md`.
  - Shown instead of the gate when there is a coarse primary pointer and no fine pointer anywhere, checked with `matchMedia` in `platform/device.ts`.
  - "Try anyway" accepts click, tap, Enter or gamepad south and continues to the gate.
  - States: rest; link focused (ring).

  (DESIGN.md:85, 224; EXPERIENCE.md:116, 136, 165, 174)
- UX-DR38: `control-glyphs`. An icon set in `public/assets/icons/`, `icon-` prefix (e.g. `icon-gamepad-south.*`), monochrome.
  - Keyboard set: a keycap outline with its legend.
  - Gamepad set: position glyphs only, a diamond of four circles with the one to press filled; sticks and d-pad drawn as direction glyphs. No platform letters, colours, shapes or logos.
  - In the DOM: lit `text-primary`, unlit `text-muted`, at `hud-icon-sm`.
  - In the world: colour and light come from `render/`. Signs swap set on the next frame after a device change.
  - Used by `render/level/controlSigns.ts` and `screens/cardText.ts`.

  (DESIGN.md:86, 225, 238; EXPERIENCE.md:141, 166, 269)
- UX-DR39: Component-to-module ownership (paths under `ui/`):
  - `overlay.ts`: mute indicator
  - `screens/hud.ts`: hearts, meter, weapon timer, bell toast, warden bar
  - `screens/title.ts`: the gate prompt (the gate is a new screen inside it) and the title menu
  - `screens/results.ts`: `results-stat`
  - `screens/levelSelect.ts`: `level-select-row`
  - `screens/settings.ts`: rows built from `slider` and `toggle`
  - `screens/pause.ts`: built from shared components
  - `screens/cardText.ts`: `card-text`
  - `screens/deviceNote.ts`: `device-note`
  - `screens/levelError.ts`: both `error-panel` variants, including boot loads
  - new shared module: `menu-item`, `panel`, `scrim`, `slider`, `toggle`, `notice-line`, `confirm-dialog`
  - new boot-loading module: `boot-loading-bar`
  - new loading-card module: `loading-card`

  One plain-TypeScript module per screen plus CSS, no framework. (EXPERIENCE.md:20, 124-141)

#### C. HUD layout and diegetic UI

- UX-DR40: HUD anchors. A top-left cluster: hearts, then the ember meter `{spacing.2}` below, then the weapon timer `{spacing.4}` right of the meter and centred on its line. The bell toast sits on the hearts row. The mute indicator is top-right. The warden bar is top-centre, keeping the arena floor clear for millstone shadows.
  - Every anchor sits `{spacing.safe-margin}` in from the viewport edge and follows the viewport corners.
  - The cluster is at most about 3 × 0.75 tiles with a weapon active.
  - Nothing sits in the middle or bottom of the screen during play; the HUD stays in the top band.

  (DESIGN.md:170-175; EXPERIENCE.md:261, 304) [epic: E1 placeholder HUD, E3 final HUD]
- UX-DR41: HUD visibility. Priority and visibility per element:
  - hearts: critical; all of play, including the death sequence and pit fade
  - meter: critical; all of play
  - warden bar: critical in the arena; from `arenaEntered` to `wardenDefeated`
  - weapon timer: secondary; only while a weapon is active
  - bell toast: transient; about 2 s
  - mute indicator: status

  The `hud.ts` elements are hidden during in-level story moments, cards and loading, and sit under the scrim while paused. The cursor is hidden during play. Absent by design: clock, score, persistent bell counter, minimap, damage vignette, edge tint. (EXPERIENCE.md:186, 248-260; DESIGN.md:232-233)
- UX-DR42: HUD icon legibility check. Hearts are about 23 px at the 1280×720 embed. The E3 critic loop checks heart legibility with the 35–55 audience before `{spacing.hud-icon}` is raised. (DESIGN.md:54) [epic: E3]
- UX-DR43: Diegetic UI is limited to:
  - Control signs on carved waymarkers, in Level 1 only, drawn by `render/`, wordless and clear of the play area.
  - Embers tracing jump arcs.
  - The warden's in-world telegraphs.

  Keyboard signs teach only the arcade set: arrows to move, ↑ aim up, ↓ crouch, Z jump, ↓+Z drop-through, X spit. Gamepad signs use position glyphs, and the spit sign lights the west face button. (EXPERIENCE.md:102, 166, 248, 265)

#### D. Surfaces / screens

- UX-DR44: Boot loading surface. Opens on page load: wordmark plus `boot-loading-bar`, no tips. Leaves to the device note (phone or tablet) or the title gate. An asset fetch failure gets one silent retry, then the retry `error-panel`. (EXPERIENCE.md:30, 118, 172-173; DESIGN.md:221)
- UX-DR45: Device note surface. Replaces the gate on phones and tablets; "Try anyway" leads to the title gate. Touch input is otherwise unsupported in v1. (EXPERIENCE.md:31, 116, 165, 174, 270, 309)
- UX-DR46: Title gate surface. Wordmark plus "Click or press any key". The prompt invites the click that gives the iframe focus. Leaves to the title menu. In E3 a bare gate is built: wordmark, then "Click or press any key", then intro cards, then Emberwood. (EXPERIENCE.md:32, 175, 319, 410) [epic: E3]
- UX-DR47: Title menu surface. Items: Continue · Level select (only once Level 1 is finished) · Settings. Continue is focused by default; Back does nothing. States:
  - First run: Continue and Settings only; Continue plays the intro, then Emberwood.
  - Level 1 finished: Level select appears.
  - Everything finished: Continue opens the level select.
  - Audio locked after a gamepad gate: audio notice.
  - Storage refused: storage notice.
  - Gamepad disabled: gamepad notice.
  - Corrupt or old save: fresh save, no notice.

  (EXPERIENCE.md:33, 107, 176-180, 217, 337, 366) [epic: E6]
- UX-DR48: Intro cards. Five `card-text` cards on the first Continue of a new save, then the Emberwood loading card. Always skippable with Back after the minimum. Card text comes from the story-text module. (EXPERIENCE.md:34, 102, 159, 182, 338, 410) [epic: E3]
- UX-DR49: Loading card surface. Shown on every level load. Entry points: Continue, intro cards, a level-select row, results on a first play, and Retry after a failed level load. Not shown on Restart. Leaves to Playing. Asset failure leads to the retry panel. Esc, P and Start are ignored; auto-pause triggers only clear held inputs; M works. (EXPERIENCE.md:35, 98, 160, 183, 185, 399)
- UX-DR50: Playing surface. World plus HUD, cursor hidden. States:
  - Low health: pulse, no vignette.
  - Weapon running out: blink.
  - Full meter with full hearts: glow, and the next heart lost refills at once.
  - Pit fall: the canvas fades 0.5 s under the HUD, one heart empties, the weapon stays.
  - Death: the HUD stays through the 0.85 s sequence, the weapon timer is removed, respawn refills three hearts, the meter is kept.
  - Release bug: bug error panel over a scrim.

  (EXPERIENCE.md:36, 186-191, 196)
- UX-DR51: In-level story moments. Two cases: the seal break after the warden is defeated (Level 2, leads to results) and the held beat at the Level 3 exit (about 3 s, no text, leads to the closing card). In both:
  - The HUD fades out on `storyStarted` (0.4 s) and stays hidden until the level ends.
  - The mute indicator is hidden.
  - Play input is ignored; jump or confirm skips on replays only.
  - Pause is allowed: the sim stops and resumes where it was.

  (EXPERIENCE.md:37, 149, 192-193, 219, 230, 359, 371)
- UX-DR52: Pause menu surface. Opened by Esc, P or Start, or by auto-pause. Items: Resume · Restart level · Settings · Quit to level select. The last item reads "Quit to title" during a first Level 1 play (before the level select unlocks).
  - Resume is focused. Back resumes.
  - The HUD stays under the scrim.
  - Shows the gamepad notice when the pad has been disabled.
  - Restart and Quit go through the confirm dialog.

  (EXPERIENCE.md:38, 108, 163, 194-197, 217)
- UX-DR53: Settings surface. Rows: Music volume, Effects volume (sliders), Reduced motion, Fullscreen (toggles), Back.
  - Opened from the title menu or pause. Back returns to the opener, with focus restored to the Settings item. From pause the world stays dimmed under the scrim, and Esc is Back.
  - Changes apply and save at once (except fullscreen). The fullscreen notice appears on refusal.
  - Mute is not a settings row.
  - A "Credits" row is added only if an asset licence requires in-game credit (Q10).

  (EXPERIENCE.md:39, 109, 198-199, 217, 367, 418) [epic: E6]
- UX-DR54: Confirm dialog surface. Two variants:
  - Restart: "Restart level? You'll go back to the start." / Restart / Cancel. Restart fades out, then to the level start (`restartFadeSeconds` 0.3) with run stats reset and no loading card.
  - Quit: "Quit this level? You'll start it from the beginning next time." / Quit / Cancel. Quit goes to the level select, or to the title before unlock.

  Cancel or Back returns to pause. (EXPERIENCE.md:40, 72-76, 98, 110-111, 156, 200, 239, 382)
- UX-DR55: Results surface. Shown at the end of every level: 4 × `results-stat` plus Continue, on a panel over a scrim. The scrim dims the world; for Level 3 it dims the last card scene. Two presses are needed (complete the stagger, then continue). Continue leads to:
  - Levels 1–2, first play: the next loading card.
  - Replay: the level select.
  - Ninth bell on a Level 1 or 2 replay: the all-bells card.
  - Level 3, first play: the title menu.

  Level 3 results come after the closing card and, if earned, the all-bells card. (EXPERIENCE.md:41, 112, 201-202, 220, 373-374)
- UX-DR56: Closing card. Shown after the Level 3 held beat. A `card-text` card, skippable only on replays. Leads to the all-bells card (9 bells) or results. With fewer than 9 bells, no all-bells card plays. (EXPERIENCE.md:42, 82-83, 159, 372-373)
- UX-DR57: All-bells card. Three entry points:
  - After the closing card when 9 bells are found (then results).
  - After the results of a Level 1 or 2 replay that found the ninth bell (then the level select).
  - From the level-select rewatch row (Back skips; returns to the level select).

  Skippable on replays and rewatch. (EXPERIENCE.md:43, 84-88, 159, 184, 386)
- UX-DR58: Level select surface.
  - Order: level rows, then the "All-bells card" row (once all 9 bells are found), then Back, each group set apart by `{spacing.5}`.
  - Ground: the title ground (`surface-screen` until the title backdrop exists).
  - Default focus: the level just played when arriving from results; otherwise the next unlocked level; the first row when everything is finished.
  - An unlocked but unfinished level shows time "–" and three outlined bells.
  - Back goes to the title.

  (EXPERIENCE.md:44, 113, 158, 203-204, 387; DESIGN.md:217) [epic: E6]
- UX-DR59: Error panel (bug) surface. Shown on a release-build invariant failure. "Restart level" returns to Playing with the level restarted. (EXPERIENCE.md:45, 90-91, 117, 164, 196)
- UX-DR60: Error panel (retry) surface. Shown when an asset fetch fails after one silent retry. Retry repeats whichever load failed: the level (back to the loading card) or the boot (back to boot loading). Unlimited presses; the line stays the same. (EXPERIENCE.md:46, 92-95, 98, 117, 173)
- UX-DR61: Wordmark. "Emberbound" (working title), centred in the upper third, `display-xl`, on boot, the title gate and the device note. Provisional until the E0 title art; changes after the E6 name check. (DESIGN.md:165, 177) [epic: E0, E6]
- UX-DR62: Depth limit. Nothing is more than two steps from play (Pause → Settings, or Pause → Confirm). Only the confirm dialog stacks on a panel. (EXPERIENCE.md:48; DESIGN.md:189)

#### E. Flows

- UX-DR63: Boot flow. Boot loading, then a phone/tablet check (device note, "Try anyway"), then the title gate, then the title menu. (EXPERIENCE.md:50-56, 336-337)
- UX-DR64: First-play campaign flow.
  1. Continue on a new save plays the intro cards, then the Emberwood loading card, then play, then results, then the next loading card. Level 2 also has the seal break before results.
  2. At the Level 3 exit: the held beat, then the closing card, then the all-bells card if 9 bells, then results.
  3. Then the title menu, where Continue now opens the level select.

  (EXPERIENCE.md:57-89, 98, 332-344, 362-374) [epic: E3 for gate → intro → Emberwood; E6 for title menu, level select, saving]
- UX-DR65: Replay flow.
  1. A level-select row opens the loading card, where confirm skips the reading floor once loading is done.
  2. Play, with story moments skippable by jump or confirm.
  3. Results, with "New best" if the best was beaten.
  4. The level select, focused on the level just played.

  A ninth bell on a Level 1 or 2 replay inserts the all-bells card after results. On a Level 3 replay the closing and all-bells cards are skippable. (EXPERIENCE.md:64, 85-88, 185, 219, 376-389)
- UX-DR66: Rewatch flow. The level-select "All-bells card" row plays the all-bells card (Back skips), then returns to the level select. (EXPERIENCE.md:65, 158, 184)
- UX-DR67: Pause, restart and quit flows.
  - Esc, P or Start opens pause; Resume or Back returns to play.
  - Restart level opens the confirm; Restart fades out, then to the level start, with stats reset and no loading card.
  - Quit opens the confirm; Quit goes to the level select (or the title before unlock), and the level starts from the beginning next time.
  - Cancel returns to pause.

  (EXPERIENCE.md:68-76, 98, 111, 217, 382)
- UX-DR68: Auto-pause flow (D14). Triggers: tab hidden, window blur, fullscreen exited, gamepad disconnected, and a gamepad error (the pad is turned off for the session, the gamepad notice shows, the keyboard keeps working).
  - Held inputs are cleared so Rowan stops.
  - The pause menu opens with Resume focused and never auto-resumes.
  - On loading and story cards nothing runs, and a trigger only clears held inputs.

  (EXPERIENCE.md:183, 194-195, 318-319, 346, 403)
- UX-DR69: Death, respawn and pit-fall HUD flow. Exact HUD behaviour per UX-DR50, plus the warden bar hiding at the door on respawn and returning full on the next `arenaEntered`. (EXPERIENCE.md:150, 190-191, 342, 357)
- UX-DR70: Warden encounter HUD flow. The bar fades in on `arenaEntered`, drops on hits, and phase 2 starts at the notch. On `wardenDefeated` the bar drains and fades, the HUD fades, the seal break plays (no text), then results. (EXPERIENCE.md:78-79, 150, 353-360)
- UX-DR71: Settings flow. From title or pause, Back returns to the opener with focus on the item that opened it. Slider hold-to-repeat behaves as described in the Marta journey. (EXPERIENCE.md:62-63, 70-71, 151, 198, 366-367)
- UX-DR72: Audio unlock and mute flow. A key or click at the gate resumes the `AudioContext`. A gamepad-passed gate means silent play plus the audio notice on the title menu until a key or click. M toggles mute, which is not saved. (EXPERIENCE.md:161, 176, 297, 317, 352)
- UX-DR73: Error and recovery flows. Bug panel: Restart level. Fetch failure: one silent retry, then the retry panel; Retry repeats the boot or level load, any number of times. (EXPERIENCE.md:90-95, 98, 164, 173)
- UX-DR74: The four key journeys work as acceptance scenarios, including their failure paths:
  - Marta finishes Emberwood. Failure path: alt-tab auto-pauses.
  - Tomás beats the warden on a gamepad. Failure path: phase-2 death, the bar hides and returns full.
  - Marta finishes Harrowmere ruins, with a settings detour, reduced motion, the held beat, the closing card, results and the title.
  - Ines finds her ninth bell. Failure path: 2 of 3 bells, no card.

  Numbers in the flows are illustrative. (EXPERIENCE.md:330-389)

#### F. Input and focus

- UX-DR75: Menu input map:
  - Move focus: arrows or WASD; d-pad or left stick (play thresholds); mouse hover.
  - Confirm: Enter or Space; gamepad south; click.
  - Back: Esc or Backspace; gamepad east; the Back row.
  - Slider: left/right or A/D; d-pad or stick; click or drag.
  - Pause in play: Esc or P; Start.
  - Mute: M only.

  Every menu works with keyboard only and with gamepad only. (EXPERIENCE.md:208-215, 266, 297)
- UX-DR76: Back semantics. Back goes up one level. On the pause menu it resumes; on the title menu it does nothing; on screens opened from pause, Esc is Back, not pause. In the confirm dialog Back equals Cancel. (EXPERIENCE.md:156, 200, 217)
- UX-DR77: Focus rules. Default focus is the primary action. Exactly one item is always focused. Vertical lists wrap. Closing a sub-surface (settings, confirm) returns focus to the item that opened it. Mouse hover moves focus. The focus ring jumps with no tween. UI sounds (menu move, confirm, back, pause) go through `playUiSound`. (EXPERIENCE.md:151, 181, 222, 278)
- UX-DR78: Hold-to-repeat. A held direction on a list or slider repeats after 0.4 s, at 8 steps per second. (EXPERIENCE.md:218, 242)
- UX-DR79: Double-press guards. The ~1.5 s card minimum (Back included; presses must begin on the card), the two-press results screen and the Cancel-first confirm. (EXPERIENCE.md:159, 182, 220)
- UX-DR80: Cursor. Hidden when play starts, shown when any menu opens. (EXPERIENCE.md:181, 186, 221)
- UX-DR81: Last-device tracking. A key press or click sets keyboard. A gamepad button, or a stick past the play thresholds, sets gamepad. The last device picks the control-sign glyphs and the card advance hint; menu layout never changes. (EXPERIENCE.md:161, 268)
- UX-DR82: Gamepad.
  - Standard mapping, with Xbox and PlayStation layouts as the browser reports them.
  - If the browser refuses access, a read throws, or permission is refused in the iframe, the pad is off for the session and the keyboard keeps working.
  - One neutral glyph set: no platform detection, letters, colours or trademarks.

  (EXPERIENCE.md:266, 269, 321)
- UX-DR83: Keyboard. Play bindings follow gdd.md:237-248, with alternate key sets as the only flexibility and no remapping in v1. While the game has focus, bound keys call `preventDefault`, so Space and the arrows never scroll the host page. (EXPERIENCE.md:265, 322)
- UX-DR84: Mouse and touch. The mouse is used in menus only and is never required: hover focuses, click confirms, and rows of at least `menu-item-height` are the target. No touch input in v1. (EXPERIENCE.md:267, 270; DESIGN.md:176)
- UX-DR85: Pause input scope. Esc, P and Start pause during play. Pause is allowed during story moments, the death sequence and the pit fade, where the sim stops and resumes where it was. Pause input is ignored on the loading card and story cards. (EXPERIENCE.md:183, 193, 214)

#### G. Accessibility

- UX-DR86: Nothing relies on colour alone.
  - Hearts are counted shapes.
  - Meters read by length.
  - The weapon timer carries an icon, and triple and piercing differ by outline shape.
  - Bell slots are filled or outlined.
  - Toggles show On / Off.

  (EXPERIENCE.md:293; DESIGN.md:197)
- UX-DR87: Every audio cue has a visual twin. The weapon warning pairs with the bar blink; the warden warnings pair with in-world telegraphs. No captions are needed. (EXPERIENCE.md:294)
- UX-DR88: Flash safety. No large-area flash faster than 3 per second. The `warning` colour is never used on large areas. (EXPERIENCE.md:295; DESIGN.md:133, 237)
- UX-DR89: Reduced motion (D17).
  - One setting. Screen shake is turned off.
  - Full-screen flashes (e.g. the seal-break ember flash) become a short fade; the `render/fx` flash reads `reducedMotion`.
  - The last-heart pulse and the heart icon shake are off.
  - Hit-stop and the 9 Hz invulnerability blink stay.
  - A new save takes its default from `prefers-reduced-motion`. The setting applies from the next frame and is saved.

  (EXPERIENCE.md:155, 276-288, 296, 370, 403)
- UX-DR90: No timed UI decisions. Cards and results wait for the player; the loading card auto-advances. Pause is always one press away, and focus loss pauses. (EXPERIENCE.md:298)
- UX-DR91: Text and screen readers. Every text token has a pixel floor; English only. Screen readers are not targeted in v1, but menus are native buttons, so their labels are exposed. (EXPERIENCE.md:299-300; DESIGN.md:164)
- UX-DR92: No blame. Respawns are shown as a plain number, with no comment and no colour. No lives, countdown, game over or score. (EXPERIENCE.md:102, 157, 328, 343)

#### H. Responsive, platform and browser

- UX-DR93: Resize and aspect.
  - `--tile` is recomputed on resize, and the HUD anchors follow the viewport corners inside the safe margin.
  - Wide windows put the HUD over extra backdrop. Narrower windows (4:3) show extra rows above and below.
  - The play box is never smaller than 19 × 10.4 tiles.

  (EXPERIENCE.md:304-305; DESIGN.md:175)
- UX-DR94: Form factor and browsers. Desktop, landscape, resizable and fullscreen. Current Chrome, Edge and Firefox; Safari best-effort. (EXPERIENCE.md:4, 19)
- UX-DR95: itch.io embed. 1280 × 720 with itch.io's own fullscreen button on; `--tile` is about 67 px there and every text floor holds. Verify at the E6 private upload. (EXPERIENCE.md:308) [epic: E6]
- UX-DR96: Fullscreen constraints.
  - Fullscreen needs user activation and the iframe permission. A gamepad toggle may be refused: snap-back plus notice.
  - The Esc that leaves browser fullscreen may not reach the page; P and Start still pause.
  - Leaving fullscreen during play auto-pauses.

  (EXPERIENCE.md:318) [epic: E6 verify]
- UX-DR97: iframe focus. Keys reach the game only once the frame has focus; the gate covers the first focus. A click outside the frame blurs it and auto-pauses; a click back focuses it. (EXPERIENCE.md:319, 346) [epic: E6 verify]
- UX-DR98: Optional features. Gamepad, storage, audio and fullscreen are each wrapped at their edge. The first failure turns that feature off for the session, logs once, and the game keeps running. (EXPERIENCE.md:313)
- UX-DR99: Browser checks on the E6 private itch.io upload:
  - A1: gamepad gate and audio unlock; gamepad fullscreen refusal.
  - A2: Esc leaving fullscreen.
  - A3: iframe focus.
  - Storage partitioning.
  - Gamepad permission in the iframe.
  - Page scrolling.
  - The 1280×720 embed and itch.io's fullscreen button.

  (EXPERIENCE.md:315-322, 413) [epic: E6]

#### I. Strings

- UX-DR100: Strings source.
  - Every functional on-screen string is defined in the Voice and Tone table (EXPERIENCE.md:104-118), per surface.
  - Story voice (card text, loading-card lines) is written in the narrative design document and served from the story-text module.
  - Level names come from `content/levels.ts`: "Emberwood", "The Drowned Mill", "Harrowmere ruins".

  (EXPERIENCE.md:102-118)
- UX-DR101: Voice rules (F4). Plain and functional, sentence case, short. No exclamation marks, no blame, no technical text, no words on control signs. On-screen names use the approved vocabulary (gdd.md:675-682). "Seal" stays off screen in v1, so the HUD label is "The Warden" (DN-1). English only. (EXPERIENCE.md:102, 114, 299)
- UX-DR102: Formats.
  - Clear time: `m:ss.s` in tabular figures.
  - No best time: "–".
  - Bells: "x of 3"; embers: "x of <level total>".
  - Toast: "Bell n of 3".
  - Slider value: an integer 0–10.
  - Toggles: "On" / "Off".
  - Boot shows no text besides the wordmark.

  (EXPERIENCE.md:109, 112-114, 118, 154; DESIGN.md:221)
- UX-DR103: Rejected patterns.
  - A long hint box covering the play area.
  - Text teaching what layout should teach.
  - Damage vignettes.
  - Platform-branded glyphs.
  - Lives, countdown, game over, score.

  Toki is lifted for structure only; nothing is copied. (EXPERIENCE.md:324-328)

#### J. Persistence implied by the UX

- UX-DR104: Saved settings. Music volume, effects volume and reduced motion are saved at once on change. Fullscreen is not saved. Mute is not saved, so each session starts unmuted. A new save's reduced-motion default comes from `prefers-reduced-motion`. (EXPERIENCE.md:149, 154-155, 296, 367, 403)
- UX-DR105: Saved progress the UX reads:
  - Which levels are finished. This drives the level-select unlock, the Continue target, first-play vs replay behaviour, and "Quit to title".
  - Best clear time per level, for the level-select time and the "New best" comparison.
  - The union of found bells per level across all runs, for bell slots and the 9-bell all-bells row and card.
  - New-save state, which plays the intro on the first Continue.

  (EXPERIENCE.md:33-34, 157-158, 177-178, 197, 203-204)
- UX-DR106: Storage failure handling. Storage refused: progress lives in memory for the session, and the storage notice shows on the title menu for the whole session. Corrupt or old save: a fresh save, with no notice. (EXPERIENCE.md:179-180, 320)
- UX-DR107: Session-only state, never persisted: gamepad disabled after an error, audio locked or unlocked, mute, fullscreen. (EXPERIENCE.md:149, 155, 163, 176, 266)

#### K. Notes for architecture (deltas the UX says the architecture must carry; spine says folded into architecture v1.1)

- UX-DR108: Extra auto-pause triggers (window blur, fullscreen exit, gamepad disconnect or disable) beside `platform/visibility.ts`. An audio-locked state after a gamepad-passed gate. The `reducedMotion` default in `app/settings.ts`. The `render/fx` flash reads `reducedMotion`. (EXPERIENCE.md:403)
- UX-DR109: Modules missing from the architecture, which must be added:
  - a shared component module (`menu-item`, `panel`, `scrim`, `slider`, `toggle`, `notice-line`, `confirm-dialog`)
  - boot loading
  - the title gate, inside `title.ts`
  - the loading card

  Also: `overlay.ts` owns the mute indicator, and `levelError.ts` serves boot-load failures. The CSS class rule "prefixed by screen" still needs a prefix for shared components. (EXPERIENCE.md:20, 405)
- UX-DR110: `--tile` is set by `ui/overlay.ts` from `sim/config.ts` (an allowed import). UI timings live in `core/uiTimings.ts`. Device detection lives in `platform/device.ts`. "Loading card" is the architecture's "level-line card" in its "Level loading" state. (EXPERIENCE.md:22, 165, 404, 406)

#### L. Epic-scope notes stated in the spines

- UX-DR111: E0 scope extension (F9). `docs/STYLE_GUIDE.md` records values for the 16 overlay colour roles and the 3 typefaces (licence checked, ≤ 0.3 MB) and re-measures the contrast table, then DESIGN.md is updated via `gds-ux` Update. The card-text placement is fixed on the E0 sample card (intro card 2) and reused on every card. The title backdrop style is set in E0 and built in E6. (EXPERIENCE.md:411, 417; DESIGN.md:103-104, 178) [epic: E0]
- UX-DR112: E3 builds the bare title gate (wordmark, then "Click or press any key", then intro cards, then Emberwood) so playtests have audio and the intro. The title menu, level select, saving and settings stay in E6. (EXPERIENCE.md:410) [epic: E3, E6]

### Mockups

All in `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/mockups/`. Each is a greyscale layout mock using provisional tokens, a 1280 × 720 frame with a `.png` beside it. They are a layout reference only; the final look comes from `STYLE_GUIDE.md` at E0 (EXPERIENCE.md:24; DESIGN.md:95).

| File | Reference for |
| --- | --- |
| `key-hud.html` / `key-hud.png` | The in-play HUD (Playing surface). **Frame A**: Emberwood mid-level with a weapon active (top-left cluster only). **Frame B**: the Drowned Mill warden arena in phase 2, a composite stress state with hearts, meter, weapon-timer warning, bell toast, warden bar and mute indicator all shown. A state strip shows the meter "full and waiting" glow on dark and bright backdrops. The mock also tests HUD backing against bright, busy striped blocks. (EXPERIENCE.md:24, 48, 248, 340, 354; DESIGN.md:171, 205, 209) |
| `key-results.html` / `key-results.png` | The Results surface. **Frame A**: first play, Emberwood, no tag, Continue focused, HUD dimmed under the scrim. **Frame B**: replay with "New best". (EXPERIENCE.md:24, 48, 343, 385; DESIGN.md:216) |
| `key-level-select.html` / `key-level-select.png` | The Level select surface. **Frame A**: everything finished, 8 of 9 bells, first row focused. **Frame B**: after the ninth bell, the "All-bells card" row added between the level rows and Back, focus on Emberwood. (EXPERIENCE.md:24, 48, 380, 387; DESIGN.md:217) |

**Conflict rule:** "The spines win on conflict with any mock" (EXPERIENCE.md:24); "where a mock and the spines disagree, the spines win" (DESIGN.md:95). Known, stated differences:
- `key-results` frame B puts "New best" after the value. Superseded: the tag goes after the "Clear time" label (DESIGN.md:216).
- `key-hud` frame B predates the warden-bar notch overhang (DESIGN.md:209).

**Spine-only surfaces (no mock, F11):** title gate and title menu; intro, closing and all-bells cards; loading card; pause; confirm dialog; settings; device note; error panels; boot loading. `imports/` is empty (EXPERIENCE.md:24).

---

## Part 7: Project brief, retained items

Everything else in the brief is superseded by the GDD or repeated by another source (Appendix A, brief vs GDD). These four add detail no other source carries.

- PB52: Sub-step visual springs or use a stable integrator (squash-and-stretch went unstable at low frame rates). (PROJECT_BRIEF.md:213)
- PB59: Pipeline: (1) reference concept image in the locked style (image model OPEN; decided 2026-11-13: the Gemini app with Nano Banana Pro); (2) front, back, left and right views from the same image model (decided 2026-11-13: from Tripo's own multiview tool, with the Gemini app as the fallback); (3) mesh in Tripo from those views; (4) cleanup in Blender through MCP: fix scale and origin (feet at the origin, 1 unit = 1 tile), reduce polygons, check materials, name parts; (5) rig and animate in Blender: one shared human-shaped skeleton for the hero and human-shaped enemies with a common motion library, creatures get their own; (6) export glTF, assign the game's shared materials and palette, drop the generator's shading, view on the look-dev page, screenshot, compare with the style guide; (7) log the asset, tool and licence in `docs/ASSETS.md`. (PROJECT_BRIEF.md:223-229)
- PB61: Environment art is a kit of reusable pieces snapping to the tile grid (ground chunks, ledges, props, background layers). Art dresses a layout that already plays well. (PROJECT_BRIEF.md:233)
- PB62: Raw generated meshes are fine for background props; the hero and enemies must deform cleanly when animated. (PROJECT_BRIEF.md:235)

---

## Part 8: Explicitly out of scope (GDD)


- Levels 4 to 6 (Bellspire Pass, the Tithe Road, the Hollow Court), wardens 2 to 6, Rowan's stage 3, and the full-game ending sequence (gdd.md:617-619, 905, 922)
- Abilities for the five later seals; none are designed (gdd.md:544, 984)
- Mid-bosses (gdd.md:906)
- Switching between forms; Rowan only moves toward human (gdd.md:85, 907)
- Difficulty settings, score and leaderboards (gdd.md:594, 908)
- Countdown timer, lives, game over (gdd.md:909)
- Dialogue during play; story text beyond intro, level lines, closing card and all-bells card (gdd.md:160-166, 658, 910)
- Shop, stat upgrades, extra hearts, heart pickups, XP, stats, currency spending (gdd.md:543, 558, 587, 911)
- Double jump, dash, wall jump, charged shot, swimming (gdd.md:310, 912)
- More than two weapon pickups (types); non-weapon temporary pickups such as shield, speed, jump boost (gdd.md:913-914)
- Combos and melee attacks (gdd.md:321)
- Touch controls; phone and tablet support (deferred) (gdd.md:261, 807, 915, 923)
- Key remapping (gdd.md:261, 814, 916)
- Cloud saves; mid-level saves (gdd.md:810-811, 917)
- Localisation; English only (gdd.md:817, 918)
- A lasting bell counter on the HUD (gdd.md:590)
- A gamepad mute binding (gdd.md:250)
- A transformation animation for the seal break (gdd.md:436)
- Hurt animations for the 1-HP enemies (gdd.md:825)
- Models of Elin, Maldrek or the village (gdd.md:830)
- Paid Steam desktop build ($5 or less) — deferred, only if the free version finds players (gdd.md:100, 818, 924)
- Tips on the boot loading screen (gdd.md:627)
- Full Safari support (best-effort only) (gdd.md:801)

---

## Part 9: Open questions and dependencies (GDD)


- Art style not locked: all final-art stories after Epic 0 depend on the Epic 0 pick recorded in `docs/STYLE_GUIDE.md`. (gdd.md:708, 935)
- Image model: chosen 2026-11-13, the Gemini app with Nano Banana Pro on the developer's Google AI Pro plan; Tripo's input views come from Tripo's multiview tool; commercial-use terms logged in story 0.4. (gdd.md:936, 970)
- Story-card warm-light exception and card style pending Epic 0 sample card; card-shape source (hand-made vs generated) undecided. (gdd.md:670-671, 719)
- Audio tools not chosen; needed by Epic 3 (Level 1 audio). (gdd.md:777, 939)
- Tripo licence and commercial-use terms to be checked by Epic 2 (story 2.1), on the Pro plan chosen 2026-11-13. (gdd.md:940)
- Tool budgets: set 2026-11-13. Image model: the Google AI Pro plan's included use, at most 5 † attempts per kept image. Tripo: Pro, $20 a month from story 2.1. Nothing paid beyond them without the developer's approval. (gdd.md:122, 942)
- Reference test machines not named; needed before Epic 6 performance stories. (gdd.md:786, 944)
- Release-success measurement undecided (analytics with consent / proxy signal / none); decide before Epic 6. Analytics would add a consent-prompt story. (gdd.md:897, 982)
- Final title not chosen; needed before any public page and for the Epic 6 release ("released under the final title"). (gdd.md:859, 945, 958)
- Originality checks outstanding: story names (before any public build or page), symbols (Epic 4, before drawn), enemy working names and Tobin Weir (before on screen). (gdd.md:366, 402, 943, 960-961)
- Credits row in Settings depends on `docs/ASSETS.md` listing every licence. (gdd.md:840)
- Per-asset size budgets live in the architecture document. (gdd.md:841)
- Level tile lengths depend on the Epic 1 grey-box pace measurement. (gdd.md:608)
- All † numbers are starting guesses tuned with the developer in the named epic; stories should treat them as config values with acceptance tied to developer sign-off. (gdd.md:29)
- Story content (all text, environmental storytelling, seal-break beat timings, per-level story props) is in the narrative design document; interface behaviour and text are in `EXPERIENCE.md`/`DESIGN.md`. Stories touching these must read those documents. (gdd.md:30-31, 439, 672, 827, 829)
- Level editor: Tiled 1.12.x, chosen 2026-11-13 (game-architecture.md, decision 9); needed in Epic 1 for loading levels. (gdd.md:937)
- `epics.md` (same folder) holds the detailed epic scope and draft stories; it was not part of this extraction. (gdd.md:27, 849)
- After version one (not blocking): which levels hold wardens 2 to 6 and the abilities they return; the final fight once Rowan gives up the fire; what Maldrek owes; whether Elin is ever playable. (gdd.md:623, 700, 983-984)
- Assumption Index: none open; the ten first-draft assumptions are decisions in `decision-log.md`. (gdd.md:976)

---

## Appendix A: raw conflict lists from each extraction

Kept for traceability. The triage at the top cites these as gdd#n, ga#n, UX#n, narr#n.

### A.1 GDD (gdd#)


1. **Warden arena vs camera at non-16:9 ratios.** The arena is "one screen, 19 tiles wide" (gdd.md:406). The camera "stops at the level edges" and "always shows at least 19 × 10.4 tiles" (gdd.md:316-317, 806). At 16:9 the 19-tile width is the binding constraint (view ≈ 19 × 10.7), but at wider ratios (e.g. 21:9 ≈ 24.3 × 10.4) the view is wider than the arena, so the camera can't both stop at the edges and fill the screen. Arena camera behaviour (lock, centring, what shows beyond the walls) is not specified.
2. **"On screen" is renderer-dependent.** Enemies attack "only while on screen" and the spitter fires "while on screen" (gdd.md:357, 372). The visible area varies with aspect ratio (gdd.md:806), so enemy behaviour would vary by window shape. It is not stated whether "on screen" means the actual viewport or a fixed reference frame (e.g. the 19 × 10.4 minimum), which matters for a deterministic, Node-testable simulation.
3. **Warden fight length vs damage output.** 30 HP, 0.2 s cooldown (5 hits/s), "can be hit at any time", plus a triple-shot pickup at the door (3 hits per volley) (gdd.md:325, 407, 409). By my arithmetic that is about 6 s of sustained fire, or about 2 s with the triple shot, against a 60–120 s target (gdd.md:413). The target depends entirely on dodging time and † tuning; no damage gating or vulnerability windows are specified.
4. **Warden attack timing details.** "The gap before the next attack starts counts from the end of the previous one" (gdd.md:428): it is unclear whether an attack "starts" at its warning or its hazard, and whether the wheel roll's walk back is part of the attack. Also unspecified: what happens to an in-progress attack when phase 2 triggers at 15 HP (gdd.md:429); whether "at least 2 tiles apart" for millstones is centre-to-centre or edge gap, and how it combines with the targeted piece and the "3-tile gap always clear" (gdd.md:420); whether the arena's one-way ledges block millstones or let Rowan avoid the wheel wash (gdd.md:406, 419-420).
5. **Jump numbers depend on an unstated integrator.** "Full jump peaks at 3.30 tiles … about 52 steps (computed from these numbers)" (gdd.md:292). My 60 Hz simulation of the table's rules reproduces 3.30 tiles and 52 steps only with semi-implicit Euler (velocity updated before position); explicit Euler gives about 3.58 and the midpoint method about 3.44. The tap jump comes out at about 0.84 (gdd.md:294). The GDD doesn't name the integration order, and "jump cut on release 0.45×" doesn't say it applies only while rising (gdd.md:293). Tests asserting these numbers need both fixed (check the architecture doc).
6. **Pit return "last stable ground" is underspecified.** "Never next to a hazard" has no distance, and "last stable ground" doesn't say which point: the last tile stood on, the last position, or the tile's centre (gdd.md:351).
7. **First play vs replay is not defined.** Many rules switch on it: loading-card skip (gdd.md:657), seal-break, held-beat and card skips (gdd.md:438, 660, 669), "New best" never on a first play (gdd.md:644), end-of-level routing (gdd.md:637). Is a restarted or abandoned first attempt still a "first play"? Is a level a replay once it has been finished once?
8. **Bell persistence across abandoned runs.** Saves happen only after each level, and leaving mid-level restarts it (gdd.md:809, 811), but "Bells found add up across replays" (gdd.md:590). It is not stated whether bells found in a run that is quit count. It is implied but not stated that bells already found reappear on replays ("Bell n of 3 … counting this run's bells").
9. **Loading card and story-card advance rules.** On a first play, does the loading card advance automatically after ~3 s † or wait for confirm (gdd.md:657)? Is the intro's "about 60 s at most" a content budget or an auto-advance cap, given cards advance on confirm (gdd.md:656, 669)? "Closing and all-bells cards can be skipped on replays" (gdd.md:669) is unclear for single cards that already advance on confirm after 1.5 s: what does skipping add, and what is the first-play minimum?
10. **Spitter cadence and seed geometry.** "Swells for 0.5 s, then fires … every 2.5 s" (gdd.md:372) doesn't say whether the 2.5 s period includes the swell, or what delay applies when a spitter first comes on screen. The 0.08 shrink rule (gdd.md:341) is written for boxes. The seed is a circle (radius 0.12), and its stated coverage of 0.63–0.87 ignores the shrink.
11. **Moving-platform solidity.** "Land on them from above only" (gdd.md:307) doesn't say whether they are solid from the sides or below, whether they can push or crush Rowan, or whether walkers ride them. Waterwheel-platform radius and speed are unspecified (gdd.md:308), apart from the general peak-speed cap of 5.3 tiles/s (gdd.md:450).
12. **Knockback sources.** Vertical knockback is given only for enemies (9 tiles/s) and spikes (11 tiles/s) (gdd.md:350). Enemy shots, the warden's body, wheel wash, millstones and the wheel roll are unspecified.
13. **Respawn before checkpoint 1.** It is not stated where Rowan respawns if he dies before the first checkpoint (level start is implied) (gdd.md:210, 352).
14. **End of version one routing.** After Level 3's results on a first play, the destination (title or level select) is not stated (gdd.md:629, 638).
15. **Gamepad reconnect.** A disconnect auto-pauses (gdd.md:813). Only a failure disables the pad for the session (gdd.md:260). Reconnect behaviour and the distinction between "fails" and "disconnects" are not defined.
16. **Menu navigation and back bindings.** These are missing from the controls table (gdd.md:240-251), though a "back" sound exists (gdd.md:773). The GDD defers to the UX spines (gdd.md:31).
17. **Settings persistence.** Saving is described for progress "after each level" (gdd.md:809). Whether and when settings (volumes, reduced motion, fullscreen) persist is not stated, though a new save takes its reduced-motion default from the OS (gdd.md:816).
18. **Timers during non-play time.** It is not specified whether the weapon timer runs during pause, hit-stop, the pit fade, the death sequence or story moments (gdd.md:332-335). For clear time, only pauses and story moments are excluded; hit-stop and death sequences are not mentioned (gdd.md:640).
19. **Weapon pickups returning on respawn.** "Every pickup Rowan has taken … goes back in the level" (gdd.md:335). It is unclear whether this includes pickups in sections before the current checkpoint.
20. **Warm-light ranking vs lanterns.** Warm light belongs to the hero, embers and lanterns, yet "Rowan, his shots and the collectables are always the warmest things on screen" (gdd.md:143, 719). It is unclear whether lanterns must be cooler than Rowan. **Resolved 2026-11-14** (`sprint-change-proposal-2026-11-14-style-lock.md`): lanterns stay less saturated than Rowan and the collectables (`docs/STYLE_GUIDE.md`, section 3).
21. **Hero animation list gaps.** The 13-animation list (gdd.md:824) has no crouch-spit, stomp or turn animation, though crouched firing exists (gdd.md:309). Epic 2 delivers "all base animations" (gdd.md:855). Hang and climb-up are "on top of the base set" (gdd.md:532), so Epic 2 is presumably 11 animations, but this isn't stated.
22. **Playtest threshold for 4 testers.** Epic 3's pass is "at least 4 of 5 (or 3 of 3)" (gdd.md:856), while playtests use "3 to 5" players (gdd.md:886). No threshold is given for 4 testers. Epic 4 gives only "4 of 5" (gdd.md:857).
23. **Thorn-flyer amplitude.** "Swings ±0.9 to 1.2 tiles" (gdd.md:371) reads as a per-placement range, but it is not stated whether it is a per-instance parameter or random, nor the path shape (sinusoidal or otherwise).
24. **Walker gravity vs edge turning.** The walker "falls under gravity" but "turns at … ledge edges" (gdd.md:370). When it would ever fall is unclear: on spawn only, or off moving platforms?
25. **Minor input gaps.** It is not stated whether aiming up allows running or works while crouched (gdd.md:225, 243), or what Down + jump does on solid ground (gdd.md:228, 247).
26. **Level-transition measurement.** "Level transitions take 3 s or less" (gdd.md:793) doesn't define the start and end events.
27. **Cross-document: level editor.** The GDD records the level editor as chosen: Tiled 1.12.x, 2026-11-13 (gdd.md:937). The repo's `CLAUDE.md` still lists "the level editor (LDtk or Tiled)" as open. Per `CLAUDE.md`, BMad artifacts win, so `CLAUDE.md` looks stale.
28. **Ember meter reset.** When the meter reaches 50 below full hearts, the heart is restored. That the meter then resets to 0, and what happens to overflow, are implied but not stated (gdd.md:588).

### A.2 Architecture (ga#)


1. **Story skip by "confirm" has no path into the simulation.** The story director says the skip action is "jump or confirm" (ga:455), but `InputFrame` has no confirm field (ga:566), app-level actions including confirm "go to the app, never to the simulation" (ga:571), and the `stepStory` example checks only `input.jumpPressed` (ga:1309).
2. **"Two follow-ups" vs three listed.** The summary says the document is ready "after the two follow-ups" (ga:43); Follow-ups lists three: CLAUDE.md, the GDD Dependencies table, and project-context.md (ga:1589-1591).
3. **Level transition budget vs reading floor.** Requirements say "Level transitions of 3 s or less (loading, behind the level-line card)" (ga:123), but the loading card "holds for the GDD's reading floor (about 3 s †) and until loading is done" on every load (ga:373). It isn't clear whether the 3 s budget measures loading alone or the whole transition, which can't then be under ~3 s.
4. **When and where the manifest is generated.** `make build` generates the manifest after the Vite build (step 5 after step 4, ga:614-615), but the manifest lives at `public/assets/manifest.json` (ga:1000), and Vite copies `public/` as-is. The document doesn't say how the post-build manifest reaches `dist/`, or how `make dev` / `make shots` (dev server) get a manifest when it's "generated at build time" and git-ignored, even though all asset lookups go through manifest ids (ga:1495).
5. **Excluding test levels from the release build.** Test levels compile into `public/assets/levels/` like the others (ga:495, 502), and `public/` is shipped as-is (ga:988), yet they're "left out of the release build". No mechanism is given.
6. **Who loads assets and level data, and how the app finds out.** `app/` can't import `render/` (ga:1195); only `platform/` or `render/assets/` may `fetch` (ga:1497); `parseLevel` is in pure `sim/` (ga:1057). Yet the app state machine must know when loading is done (ga:373), drive the boot loading bar, and show the Retry panel (ga:379). Nothing says who fetches level JSON or how progress, completion and failure reach `app/`.
7. **Title menu before Epic 6.** Epic 3 builds the gate alone and the title menu arrives in Epic 6 (ga:372), but Quit before the level select unlocks goes "to the title menu" (ga:374), the audio-locked notice appears on "the title menu" (ga:596), and the smoke checks include "title" (ga:637). Behaviour in E3–E5 is undefined. The level-select unlock condition is also never stated: it's implied after the Level 3 first play (ga:376), and the save has `unlockedLevel` (ga:471) with undefined semantics.
8. **`params.form` vs the `levelForm` table.** `WorldParams` carries `form` (ga:384) and the debug URL sets `form=changed` (ga:626), but the replay-form rule says `levelForm` "sets Rowan's stage and abilities when a level is created" (ga:463). It doesn't say which wins when they differ.
9. **No allocation per step vs per-step event literals.** "No allocation per simulation step (pools)" (ga:659) conflicts with the event pattern `world.events.push({ type: … })`, which creates a new object per event (ga:911, 1438), and with `world.shots.find((s) => …)`, a closure per call (ga:1435).
10. **`debug/` import rule vs the Playwright spec.** "Nothing imports `debug/`, except `main.ts`" (ga:1200), but `tests/e2e/shots.spec.ts` imports `SPOTS` from `src/debug/spots.ts` (ga:1358). `tests/` isn't in the boundary table.
11. **Feel regression test tolerances are unspecified.** Jump height is exact (3.30 tiles), but the tap jump is "about 0.8" and air time "about 52 steps" (ga:850). Acceptance criteria need a tolerance.
12. **`make test` scope.** The target table says "Run the simulation tests (Vitest), once" (ga:245), but `make test` also runs the level compile (ga:495) and "the Node layers": sim, levels, app, input (ga:643).
13. **gltf-transform version.** The Toolchain table says 4.5.x (ga:213); Decision 15 says "current at Epic 0" (ga:349).
14. **The scaffold step list is incomplete.** Project Initialization step 3 adds only vitest, `@playwright/test`, eslint, typescript-eslint and `@types/three` (ga:272-273). It omits Prettier, `@gltf-transform/cli` and `@types/node`, which are in the table (ga:212-214); Prettier does appear in First Steps (ga:1646). `npm create vite@latest` is unpinned, against the exact-version policy (ga:220, 270).
15. **Which build smoke checks run against.** Smoke checks run in headless Chromium and Firefox (ga:248, 637), but it isn't stated whether they run against the dev server or a production build. It matters because DEV rethrows bugs while release shows the panel (ga:762), and dev tools like `window.__emberbound` exist only in DEV.
16. **Checkpoint id format.** The debug URL uses `checkpoint=cp-2` (ga:626), while lasting authored ids are level-scoped (`drowned-mill/bell-2`, ga:1170). `spawnAt.checkpointId` and the `checkpointReached` / `rowanRespawned` `checkpointId` strings don't specify which form they use.
17. **Where non-sim numbers live.** "Gameplay numbers: only in `sim/config.ts`" (ga:808, 1516), but the stick thresholds 0.35/0.5 (ga:568, used by `input/`), the 8-tile checkpoint validation distance (ga:498, used by `scripts/`), the ~30° FOV (ga:550, render), and `JUMP_MAX_STEPS` ("defined in this file", ga:1256) have no stated home or classification.
18. **RNG and state hash are underspecified.** The seeded RNG's algorithm and seed source (per level? fixed?) aren't given (ga:414), nor is the state-hash function the determinism test compares (ga:416, 634).
19. **Save versioning details.** The initial `version` value, the migration policy (what happens with a version newer than the code), and the type of `unlockedLevel` (index or level id) aren't specified (ga:470-476).
20. **How `ui/` learns the camera margin for `--tile`.** It must include any margin Epic 0's camera frames, "since `ui/` cannot import `render/`" (ga:585), but no data path is given (e.g. a value in `sim/config.ts`).
21. **Loading-card confirm skip vs the card guard.** On a replay, confirm skips the rest of the reading floor once loading is done (ga:373), while the app ignores all card input before the ~1.5 s card minimum (ga:574). It isn't stated whether the guard applies to the loading card.
22. **Skipped cues and the stinger.** When a story moment is skipped, `endStory` "applies any cue not yet reached" (ga:460), but it isn't stated whether a `storyCueReached` is emitted for each skipped cue. Audio's stinger depends on that event (ga:602).
23. **Debug overlay contents differ across sections.** Draw calls and triangles appear in the overlay at ga:661 but not in the lists at ga:622-625 or ga:932.
24. **Missing log channel.** The fixed channel union (ga:786) has no `platform` channel, and it isn't clear which channel fullscreen or storage failures in `platform/` use (storage might use `save`).
25. **`content/cards.ts` references palette slots** (ga:1091), but `content/` may import only `core/` (ga:1192) while palettes live in `render/palettes/`. Where slot names or types are shared isn't stated.
26. **`lookdev/` must not import `sim/`** (ga:1201), but it imports `render/`, which imports `sim/` types and `sim/config.ts` values (ga:1196), so the rule holds only for direct imports.
27. **Key remapping isn't specified anywhere.** The input section covers keyboard and gamepad, latching, thresholds and device tracking, but no remapping, and no default key or button bindings beyond Esc, M, Space and the arrows (ga:566-577, 572, 575, 597). `input/gamepadMapping.ts` exists (ga:1067), but no mapping is given.
28. **CLAUDE.md still lists the level editor as open** while the architecture settles it as Tiled. Recorded as a follow-up (ga:82, 1589); per CLAUDE.md, the BMad artifact wins.
29. **(Inference, not stated in the doc) `core/log.ts` release stripping vs Node scripts.** info/debug must not log in release (ga:781-782), which implies a build-mode check such as `import.meta.env`, but `scripts/` running natively in Node may import `core/` (ga:1202), where `import.meta.env` doesn't exist. No mechanism is given.
30. **(Inference) Root tsconfig "references" the sim tsconfig** (ga:1017), while `make typecheck` runs `tsc --noEmit` on the root and then on the sim tsconfig separately (ga:251). It isn't stated whether the root project includes `src/sim/**`, in which case sim would also be checked with DOM types, or excludes it.

### A.3 UX spines (UX#)


#### Conflicts between or within the spines

1. **Card advance-hint inset.** The DESIGN.md frontmatter sets `card-text.hint-inset: '{spacing.safe-margin}'` (0.25 tile) (DESIGN.md:79). The Components prose says the hint sits "on the scrim band at its lower right, inset `{spacing.2}`" (0.1 tile) (DESIGN.md:218).
2. **`display-xl` has no pixel floor.** It is `calc(var(--tile) * 0.9)` with no `max()` (DESIGN.md:33). But "Every text token has a pixel floor" (EXPERIENCE.md:299), and "Sizes scale with `--tile` and stop at a pixel floor" (DESIGN.md:164).
3. **Stale mock PNG.** `mockups/key-hud.png` frame B still renders the warden label "Warden of the First Seal", while `key-hud.html:400` and both spines say "The Warden" (EXPERIENCE.md:114; DESIGN.md:209; DN-1). The HTML annotation at key-hud.html:360 still says "Label is the approved vocabulary; the given name is not shown". The EXPERIENCE.md journey heading also still reads "Tomás beats the Warden of the First Seal" (EXPERIENCE.md:348), though that is not an on-screen string.
4. **Stacking of the mute indicator and the error panel.** The mute indicator is layer 4, below `panel` (5), `confirm-dialog` (6) and `error-panel` (7, "topmost") (DESIGN.md:187-190). Yet it must be drawn "above every scrim, the error panel's included" (DESIGN.md:187; EXPERIENCE.md:149). It is not stated whether the error panel's own scrim is at layer 3 or 7.
5. **Which surfaces the scrim covers.** The DESIGN.md elevation list gives "pause, settings opened from pause, results and error panels" (DESIGN.md:186). EXPERIENCE.md also includes confirm (EXPERIENCE.md:153). Probably harmless, since confirm stacks on pause.
6. **Scrim and panel fade timing.** The scrim "Fades with its panel" (EXPERIENCE.md:153), but the durations differ: `scrimFadeSeconds` 0.2 against `panelFadeSeconds` 0.15 (EXPERIENCE.md:228-229).
7. **Where notices live.**
   - "Notices are states of the title menu and settings, not surfaces" (EXPERIENCE.md:48), yet the gamepad notice also shows on the pause menu (EXPERIENCE.md:163, 195).
   - Line 163 says the gamepad notice is on "pause and title menus". Line 195 says only the pause menu shows it.
8. **Level-select IA entries are incomplete.** The IA row's "Reached from" (EXPERIENCE.md:44) omits the confirm dialog's Quit and the all-bells card's return, both present in the flowchart (EXPERIENCE.md:75, 88).
9. **Loading-card advance hint has no spec of its own.** DESIGN.md says "the same hint appears on the `loading-card` when a replay can skip" (DESIGN.md:218). But the `loading-card` visual states list only "Shown; fading out" (DESIGN.md:219), its frontmatter has no hint token (DESIGN.md:80), and the hint's placement rule ("on the scrim band") cannot apply, because the loading card has no band.
10. **Bell union vs "three outlined bells".** Level-select bells show "the union across all runs" (EXPERIENCE.md:158), but an unlocked, never-finished level shows "three outlined bells" (EXPERIENCE.md:203). It is not stated whether bells taken in a quit or unfinished run count toward the union.
11. **Module paths still missing in the spine.** EXPERIENCE.md lists "Shared module (new)", "Boot loading (new)" and "Loading card (new)" with no paths, and says the CSS prefix for shared components is not set (EXPERIENCE.md:138-140, 405). Only `.decision-log.md` (DN-3, line 138) records the approved `ui/components/` (one file per shared component), `ui/screens/bootLoading.ts` and `ui/screens/loadingCard.ts`. The architecture v1.1 should be checked as the authority.

#### Too vague for acceptance criteria / unstated

12. **Undefined † marker.** The "†" on "~3 s †" and "~1.5 s †" is never defined in EXPERIENCE.md (EXPERIENCE.md:160, 244). The values are GDD-owned and approximate.
13. **Unstated defaults.**
    - The default music and effects volume (0–10) is not given (EXPERIENCE.md:154).
    - Whether "intro already seen" persists is unstated. The intro plays on the "First Continue on a new save" (EXPERIENCE.md:34), so it is unclear whether a player who quits during the first Emberwood play sees the intro again.
14. **Unspecified input on some surfaces.**
    - Back, Esc, P and Start are not specified on Results (EXPERIENCE.md:157, 201).
    - Back on the loading card is not specified (EXPERIENCE.md:160).
    - It is not stated whether a mouse click advances story cards or the loading card. The mouse is "menus only" (EXPERIENCE.md:267), but the Confirm row maps to click (EXPERIENCE.md:211).
    - The device note lists "click, tap, Enter or gamepad south" with no Space (EXPERIENCE.md:165), while Space is a confirm key (EXPERIENCE.md:211).
15. **Unspecified grounds and layout.**
    - The ground of Settings when opened from the title, and of the title menu, is not given. Whether the title menu shows the wordmark is also open: DESIGN.md:177 names only boot, the gate and the device note.
    - The title backdrop itself is open (EXPERIENCE.md:417).
    - The confirm dialog is a "smaller panel" with no width token (DESIGN.md:215).
    - The order of several simultaneous notices (storage, audio and gamepad on the title menu) is unstated (EXPERIENCE.md:163).
16. **Unspecified durations and edge cases.**
    - The reduced-motion "short fade" replacing full-screen flashes has no duration (EXPERIENCE.md:288).
    - Whether a bell toast fading out is replaced the same way as one holding is not stated (EXPERIENCE.md:148).
    - It is not stated whether hold-to-repeat wraps through the ends of a list (EXPERIENCE.md:151, 218).
    - Whether the results values fade or pop in during the stagger is not stated (DESIGN.md:216).
17. **Unspecified cursor and mute-indicator visibility.**
    - Cursor visibility on cards, the loading card, boot and the gate is unspecified (EXPERIENCE.md:221).
    - Mute-indicator visibility on Level 3 results (over the last card scene) is unclear (EXPERIENCE.md:149).
    - Behaviour when M is pressed before or at the gate is unclear (EXPERIENCE.md:149, 161).
18. **Results HUD differs per level.** "The HUD stays under" the scrim on results (EXPERIENCE.md:153; key-results frame A). But after Level 2's seal break, the HUD "stays hidden until the level ends" (EXPERIENCE.md:192), and Level 3 results sit over a card scene. Each story must state its own case.
19. **Epic mapping gaps.** The spines tie only the HUD (E1 placeholder, E3 final), the bare gate and intro (E3), and title menu, level select, saving, settings and browser checks (E6) to epics. They do not split which `hud-*` elements belong to the E1 placeholder HUD, and they do not assign pause, confirm, results, cards, loading card, device note or boot loading to an epic. Error panels are untagged in the spines; `.decision-log.md` DN-4 (line 139) says E6.
20. **Open outside this UX run** (EXPERIENCE.md:415-419):
    - the title backdrop (E0 style, E6 build)
    - a Credits row in Settings, only if an asset licence requires in-game credit
    - a consent-prompt surface, if release analytics are chosen

### A.4 Narrative design (narr#)


1. **"Tithe" appears in the script despite the note that it doesn't.** The script note says "The words 'Tithe' and 'seal' do not appear in version one's text" (narrative-design.md:860), but intro card 4 reads "said Lord Maldrek, the Tithe-Collector" (narrative-design.md:833). An acceptance check of "no 'Tithe' in story text" fails on card 4. The note probably means the standalone word, but that is a guess.
2. **The intro's 60 s cap can't be enforced as written.** The intro is "60 s at most" (narrative-design.md:156, 604, 792), yet cards are "read at the player's pace" and "advance on confirm" (narrative-design.md:792, 803), with no auto-advance defined. The card count also varies: "up to 5 cards" or "5 or fewer" (narrative-design.md:86, 184, 604) against exactly 5 in the script (narrative-design.md:809, 826).
3. **Which epic freezes the text is unclear.** All lines are "drafts; check them on screen in Epic 5" (narrative-design.md:824), and the 80-character limit is "checked on screen in Epic 5" (narrative-design.md:560). Epic 3, however, requires "the final text" for the intro (narrative-design.md:1051).
4. **Story props versus the play layer.** Story props are "never on the play layer" (narrative-design.md:665, 669), but Rowan must pass under the glade's garland arch (narrative-design.md:680), touch the exit at the fallen fire bell (narrative-design.md:974), and stand at it (narrative-design.md:818). The marked sacks also sit "at the warden's door checkpoint" (narrative-design.md:687). The sacks' location differs too: they "rot in the mill" (narrative-design.md:502) versus "stacked by the millhouse door" (narrative-design.md:687).
5. **Replay and skip rules for the all-bells card are underspecified.** If the ninth bell is found on a Level 1 or 2 replay, the card's first-ever showing falls on a replay. The GDD/UX rule "closing and all-bells only skippable on replays" would then let a player skip a card they have never seen. Level 3 replays repeat the all-bells card every time once earned (narrative-design.md:900). The doc also uses "skip" (for the whole sequence?) and "advance on confirm" (per card) without saying how they differ (narrative-design.md:893, 900).
6. **The intro trigger differs between sections.** One place says "First launch, before Level 1" (narrative-design.md:604); another says "The first Continue on a new save" (narrative-design.md:971). The intro is built in Epic 3 (narrative-design.md:1051), but the title menu with Continue is Epic 6. UX resolves this with a bare Epic 3 title gate that leads to the intro cards and then Emberwood (EXPERIENCE.md:410).
7. **Some audio is undefined or uncommitted.** "Furnace breath" is listed as one of Rowan's sounds (narrative-design.md:589) but called an "idea" (narrative-design.md:1079), and the GDD's SFX list doesn't include it (gdd.md:769). "Silence: Maldrek's presence" (narrative-design.md:759) applies to a character who appears only on cards. No audio is specified for the intro cards or the all-bells card.
8. **Which horn breaks is not specified.** The doc says "one horn" or "a horn" (narrative-design.md:705, 815, 987), while the hand is explicitly the right one.
9. **Fade or cut.** The held beat "fades to the closing card" (narrative-design.md:818), but the closing card "cuts away to Elin" (narrative-design.md:701).
10. **The level name on the loading card is not given.** The doc says both "Harrowmere" and "Harrowmere ruins". UX settles the names as "Emberwood", "The Drowned Mill" and "Harrowmere ruins" (EXPERIENCE.md:113).
11. **Waymarker icons have to swap.** Control signs have "the icon burned into the wood" (narrative-design.md:678), but the GDD requires the icon to match the device last used (gdd.md:266). The burned-in look must still swap at runtime; how is unspecified.
12. **Silence after the seal break has no play to appear in.** "After the seal breaks: silence and still water" (narrative-design.md:505), but play in Level 2 doesn't resume afterwards; the sequence fades to results (narrative-design.md:816, 898). This can only be checked as the end state of the sequence.
13. **Story timings are guesses.** All story timings are marked as guesses: the 1.5 s card minimum, the 3 s loading-card floor, the about 3 s held beat, the seal-break timetable (tuned in Epic 4), and the 80-character limit. Acceptance criteria need config-referenced values or tolerances.
14. **Warm light in Harrowmere.** "Harrowmere has none but Rowan and the embers" (narrative-design.md:726), but weapon pickups are warm (narrative-design.md:951), and the GDD makes all collectables, bells included, the warmest things on screen (gdd.md:719). **Resolved 2026-11-14** (`sprint-change-proposal-2026-11-14-style-lock.md`): the fire family (shots, embers, bells, weapon pickups) is the only warm light in Harrowmere besides Rowan; NR100's "the embers" means that family.
15. **The level-line card's style is not defined.** The doc counts "up to 7 story cards" (narrative-design.md:791) but 10 text moments (narrative-design.md:1040), so the level-line loading card is not a silhouette story card. Its look is left to UX.
16. **Localisation sizing is conditional.** Card text boxes of about 105 characters or a two-line wrap are conditional on future localisation (narrative-design.md:1071). It is unclear whether the version one layout must reserve the space.

### A.5 Project brief vs GDD


The GDD wins in every row. Stories should follow the GDD column.

| # | Brief says | GDD says |
| --- | --- | --- |
| C1 | "themed levels, each ending in a boss" (PROJECT_BRIEF.md:11) | Version one has one warden, at the end of Level 2; Levels 1 and 3 end at an exit (gdd.md:57, 205-207). How wardens 2 to 6 map onto Levels 3 to 6 is open (gdd.md:623). |
| C2 | Embers as currency (PROJECT_BRIEF.md:66) | Embers fill a meter, and 50 embers restore 1 heart; no currency spending and no shop (gdd.md:231, 558, 588, 594) |
| C3 | Touch is optional (PROJECT_BRIEF.md:71); `src/input/` includes touch (PROJECT_BRIEF.md:158) | No touch controls in version one; phones and tablets get a "best played on desktop" note (gdd.md:261, 807, 915) |
| C4 | Score: track time, bells and respawns per level (PROJECT_BRIEF.md:67) | Results also show embers collected out of the level total and a "New best" tag (gdd.md:639-644) |
| C5 | Desktop build for Steam optional, later; possibly sell for a small price (PROJECT_BRIEF.md:11, 18); M6 includes "Optional desktop build" (PROJECT_BRIEF.md:273) | Version one is free on itch.io (donations only). A Steam build ($5 or less) comes only if the free version finds players and is not in version one. Epic 6 ends in an itch.io release. (gdd.md:59, 100, 117, 818, 859, 924) |
| C6 | Ending OPEN, three candidates (PROJECT_BRIEF.md:52) | Decided: candidates 1 and 2 combined; the simple win dropped (gdd.md:694-700) |
| C7 | Level editor OPEN: LDtk or Tiled (PROJECT_BRIEF.md:139) | Tiled 1.12.x, chosen 2026-11-13 (gdd.md:937, citing game-architecture.md decision 9). CLAUDE.md still lists it as open. |
| C8 | Apex gravity 0.55 "when vertical speed is under 2.2" (PROJECT_BRIEF.md:187) | 0.55 with jump held and vertical speed between -2.2 and 2.2 tiles/s; it replaces the fall multiplier (gdd.md:285) |
| C9 | Moves: run, variable jump, ember spit, aim up, aim down in the air, crouch (PROJECT_BRIEF.md:60) | Adds drop-through (down + jump, 0.22 s) and ledge grab from the first seal; crouch shrinks only the hurtbox to 0.6 † (gdd.md:227-229, 518-519) |
| C10 | Fail rule: 3 hearts, checkpoints, respawn at the last checkpoint (PROJECT_BRIEF.md:62) | Adds the pit rule (-1 heart, return to the last stable ground, not a respawn); no game over (gdd.md:209-212, 351) |
| C11 | Weapon pickups: timed, start with triple shot (PROJECT_BRIEF.md:64) | Exactly two: triple shot and piercing shot, 20 s each; no others (gdd.md:232, 327-328, 913) |
| C12 | Story delivery: short intro, one line before each level, no dialogue in play (PROJECT_BRIEF.md:69) | Adds the seal break, the held beat, the closing card and the all-bells card (gdd.md:654-672) |
| C13 | Level 1 teaching order with one checkpoint and no spitter (PROJECT_BRIEF.md:206) | 4 sections with 3 checkpoints; adds the rooted spitter after checkpoint 1; triple shot below the drop-through bridge; exit through the wedding glade (gdd.md:570-581) |
| C14 | Each enemy needs move, attack if any, hurt and death animations (PROJECT_BRIEF.md:231) | Walker and thorn flyer need only move and death (1 HP, no hurt); spitter needs idle, swell and fire, hurt, death (gdd.md:825) |
| C15 | Hero animations: 11 (PROJECT_BRIEF.md:231) | 13: adds hang and climb-up (gdd.md:529-532, 824) |
| C16 | Three visual stages of Rowan (PROJECT_BRIEF.md:94) | Version one shows stages 1 and 2 only; stage 3 comes later (gdd.md:554, 733-738, 905) |
| C17 | Warm light only on the hero, embers and lanterns (PROJECT_BRIEF.md:83) | Same in play; lanterns only in Emberwood; story cards may also warm-light Elin and home, pending Epic 0 (gdd.md:719) |
| C18 | M1: "a grey test level"; exit: every mechanic in section 4 works (PROJECT_BRIEF.md:260-261) | Epic 1: Level 1's layout in grey boxes with every base mechanic; exit also requires the grey-box pace to be measured (gdd.md:854) |
| C19 | M2: "Full pipeline for Rowan, with all animations" (PROJECT_BRIEF.md:263) | Epic 2: Rowan stage 1 with all base animations; stage 2 and ledge grab move to Epic 4 (gdd.md:855, 857) |
| C20 | M3 exit: "a new player finishes level 1 without help" (PROJECT_BRIEF.md:267) | Epic 3 exit: 4 of 5 (or 3 of 3) primary-audience testers finish unaided; a majority want Level 2 and can say who Rowan is and what he wants (gdd.md:856) |
| C21 | M4: one boss plus the seal break; no exit (PROJECT_BRIEF.md:269) | Epic 4 adds Rowan stage 2, ledge grab, the Level 2 tune and warden arrangement, plus a 3-part exit (gdd.md:857) |
| C22 | M5: Levels 2 and 3; no exit (PROJECT_BRIEF.md:271) | Epic 5 adds story cards; exit: a new player finishes version one in 20 to 30 min (gdd.md:858) |
| C23 | M6: menus, saving, settings, perf pass, optional desktop build (PROJECT_BRIEF.md:273) | Epic 6 adds session flow, level select and the itch.io release under the final title; no desktop build (gdd.md:859) |
| C24 | Critic loop step 1: spots listed in `tests/spots.ts` (PROJECT_BRIEF.md:243) | The GDD names no file (gdd.md:865). Outside the GDD: the architecture puts spots in `src/debug/spots.ts` (game-architecture.md:937). |
| C25 | Every jump possible, tested in code, stated for Level 1 (PROJECT_BRIEF.md:208) | Every jump in every level is shown possible by an automated test (gdd.md:443, 882) |

### A.6 Narrative updates applied to the GDD


Source list: narrative-design.md:1090-1104. All 8 items (10 counting the three layout notes separately) are APPLIED. `grep -i illustrated gdd.md` returns nothing.

| # | Narrative update | Status | Where in gdd.md |
| --- | --- | --- | --- |
| 1 | Warden of the First Seal: replace the placeholder with the Drowned Miller | APPLIED | gdd.md:387-402 (concept, look, seal, fate, link, name); gdd.md:941 (dependency marked Done); no warden item left in Open Questions (gdd.md:978-985) |
| 2 | Full-game ending decided | APPLIED | gdd.md:694-700; gdd.md:942 (dependency marked Done) |
| 3 | Story cards: silhouette cards built in-engine, warm-light exception confirmed in Epic 0 | APPLIED | gdd.md:666-671; gdd.md:719; gdd.md:830; gdd.md:935 |
| 4 | Level 3 completion order: held beat, closing card, all-bells card if earned, then results | APPLIED | gdd.md:638 |
| 5 | New story moment: the held beat at Level 3's exit, about 3 s | APPLIED | gdd.md:660; also gdd.md:606, 616 |
| 6a | Level 1's exit runs through the wedding glade | APPLIED | gdd.md:577, 604, 614 |
| 6b | Level 3 starts at the siege line | APPLIED | gdd.md:616 |
| 6c | Level 3's exit is the fallen fire bell, after a short calm stretch | APPLIED | gdd.md:616 (calm walk of about 15 to 25 tiles †), 604 |
| 7 | Bell hints: no lanterns in Levels 2 and 3; ember trails and gaps instead | APPLIED | gdd.md:481-482 |
| 8 | Enemy concept: twisted creatures, the land paying for bargains; no rule changes | APPLIED | gdd.md:365 |

Things the GDD adds beyond the narrative doc (the GDD wins on conflict):

- Story moments are safe: while control is stopped (seal break, held beat), Rowan can't be hurt and attacks already in progress are removed. Simulation rule with its own unit test. (gdd.md:661)
- If Epic 0 refuses the card warm-light exception, the forge glow on cards turns pale and cold. (gdd.md:670)
- Card shape source (by hand or generated) is decided in Epic 0 with the image model and logged in `docs/ASSETS.md`; about 3 to 5 layers per card †. (gdd.md:671)
- Reduced motion turns the seal-break ember flash into a short fade. (gdd.md:815)
- The narrative doc says the seal-break stinger carries Elin's motif (narrative-design.md:988, 1052). The GDD's music section lists the motif only in the level tunes and the closing-card stinger (gdd.md:756). Not a contradiction, but the GDD doesn't repeat it.

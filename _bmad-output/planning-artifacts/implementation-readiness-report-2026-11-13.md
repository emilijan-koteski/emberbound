---
stepsCompleted: [step-01-document-discovery, step-02-gdd-analysis, step-03-epic-coverage-validation, step-04-ux-alignment, step-05-epic-quality-review, step-06-final-assessment]
documentsIncluded:
  gdd:
    - gdds/gdd-emberbound-2026-11-12/gdd.md
    - gdds/gdd-emberbound-2026-11-12/requirements-inventory.md
  architecture:
    - architectures/architecture-emberbound-2026-11-13/game-architecture.md
  epics:
    - gdds/gdd-emberbound-2026-11-12/epics.md
  ux:
    - ux-designs/ux-emberbound-2026-11-13/DESIGN.md
    - ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
    - ux-designs/ux-emberbound-2026-11-13/mockups/
  context:
    - gdds/gdd-emberbound-2026-11-12/decision-log.md
    - briefs/brief-emberbound-2026-11-12/brief.md
    - briefs/brief-emberbound-2026-11-12/addendum.md
    - narratives/narrative-emberbound-2026-11-13/narrative-design.md
    - sprint-change-proposal-2026-11-13.md
    - sprint-change-proposal-2026-11-13-planning-gaps.md
---

# Implementation Readiness Assessment Report

**Date:** 2026-11-13
**Project:** emberbound
**Assessor:** Claude (Opus 5.5) running `gds-check-implementation-readiness`, with five parallel story reviewers for step 5; every Major finding re-checked against the source text

## Document Inventory

Paths are relative to `_bmad-output/planning-artifacts/`. Artifacts live in per-workflow subfolders; discovery searched recursively.

| Type | Files used | Notes |
| --- | --- | --- |
| GDD | `gdds/gdd-emberbound-2026-11-12/gdd.md` (65 KB), `requirements-inventory.md` (251 KB) | `decision-log.md` (25 KB) is context only |
| Architecture | `architectures/architecture-emberbound-2026-11-13/game-architecture.md` (117 KB) | |
| Epics & Stories | `gdds/gdd-emberbound-2026-11-12/epics.md` (489 KB) | Whole document, stored in the GDD folder; analysed in sections |
| UX | `ux-designs/ux-emberbound-2026-11-13/DESIGN.md` (27 KB), `EXPERIENCE.md` (43 KB), `mockups/` | `.working/` excluded; `review-rubric.md` and `validation-report.*` are context |
| Context | brief + addendum, `narrative-design.md`, both 2026-11-13 sprint change proposals | Used to confirm proposals landed and to catch uncovered story beats; not requirement sources |

**Duplicates:** none (no whole + sharded pairs). `.working/key-hud.html` differs from `mockups/key-hud.html` by 28 bytes; treated as a scratch copy and excluded.

**Missing documents:** none.

## GDD Analysis

**Method.** `gdd.md` (986 lines, status final) was read in full, and every rule, number and decision in it was checked against `requirements-inventory.md` Parts 1, 3, 4, 8 and 9. The inventory is the extraction of record (every story in `epics.md` cites its IDs), so this report does not copy its 301 GDD items; a third copy would drift the same way the inventory has (see Extraction fidelity).

### Functional Requirements

217 FRs, inventory Part 1 (`FR1`–`FR217`), each with its `gdd.md` line citation.

| IDs | Group |
| --- | --- |
| FR1–FR6 | Version-one scope, win and loss |
| FR7 | Simulation timing |
| FR8–FR24 | Movement feel table, one-way ledges, drop-through, moving and waterwheel platforms, crouch |
| FR25–FR29 | Camera and screen shake |
| FR30–FR36 | Controls, input, auto-pause, gamepad failure |
| FR37–FR42 | Control signs |
| FR43–FR57 | Ember spit, aim, stomp, thorn rule, weapon pickups |
| FR58–FR72 | Hitboxes, damage, recovery, pit rule, hit feedback |
| FR73–FR81 | Enemy rules and the three enemies |
| FR82–FR101 | The warden of the first seal and the seal break |
| FR102–FR112 | Ledge grab and Rowan's form |
| FR113–FR124 | Embers, bells, economy |
| FR125–FR144 | Checkpoints, pacing, level design rules |
| FR145–FR155 | Level content (Levels 1–3) |
| FR156–FR169 | Story delivery |
| FR170–FR184 | Session flow, menus, results |
| FR185–FR193 | Saving, settings, accessibility |
| FR194–FR195 | HUD and interface set |
| FR196–FR207 | Audio |
| FR208–FR217 | Art and content assets |

**Total FRs: 217**

### Non-Functional Requirements

49 NFRs, inventory Part 3.

| IDs | Group |
| --- | --- |
| NFR1–NFR7 | Performance: 60 fps, reference machine, frame-time pass mark, refresh-rate independence, 30 MB download, 10 s to first input, 3 s level transitions |
| NFR8–NFR16 | Platform: resilience, three.js/WebGL on itch.io, itch.io limits, browsers, input devices, screen, desktop only, English only |
| NFR17–NFR22 | Fairness: 120 s replay cap, checkpoint spacing, respawn targets, warden length, player-favouring hitboxes, intensity curve |
| NFR23–NFR25 | Length: 6–8 min per level, 20–30 min total, story-moment lengths |
| NFR26–NFR34 | Readability and visual rules |
| NFR35–NFR36 | Asset quality |
| NFR37–NFR44 | Originality, legal, licensing, credits |
| NFR45–NFR49 | Playtest success metrics |

**Total NFRs: 49**

### Additional Requirements

- **Process (PR1–PR35, inventory Part 4):** precedence rules, epic order and exit criteria, the critic loop, "every simulation rule has a unit test", jump-possibility tests, tool-choice deadlines, playtest method, retrospectives, scope control.
- **Other sources, traced by the epics alongside the GDD:** NR1–NR117 (narrative), AR1–AR248 (architecture), UX-DR1–UX-DR112 (UX spines), PB1–PB4 (project brief, retained items).
- **Story-level defaults (X-B1–X-B37):** gaps the GDD leaves, each with a default applied by the first story that hits it (e.g. X-B2 first play vs replay, X-B4 pit-return stable ground, X-B6 which timers run when). The developer can veto each at story review.
- **Out of scope (Part 8)** and **open questions (Part 9)** are listed explicitly.
- **Open dependencies with deadlines (gdd.md:933–946):** image model, before Epic 0 starts; tool budgets, by Epic 0; Tripo terms, Epic 2; audio tools, Epic 3; reference test machines and the release-success measure, before Epic 6; final title, before any public page.

### Extraction fidelity

Every requirement-bearing statement in the GDD maps to at least one inventory ID, with one exception: the GDD edits made by `sprint-change-proposal-2026-11-13-planning-gaps.md` (G1, G2). Those edits went into `gdd.md` and directly into stories 4.2–4.5 and 4.15 (proposal §4.5), but the proposal's §4.6 updated only the inventory's X-C status table, so these FR texts still describe the pre-change design:

| ID | Inventory says | GDD now says |
| --- | --- | --- |
| FR27 | The camera stops at the level edges | Also: on windows wider or taller than 19 × 10.4, the margin shows the level's dressing up to 3 tiles † past its edges, then plain bands; in the 19-tile warden arena the camera holds still (gdd.md:316) |
| FR84 | The warden's body is its hurtbox | Shots that hit the body splash off with a clear blocked cue and do no damage (gdd.md:408) |
| *(none)* | Not captured | **Weak point:** the hub, 1 × 1 tile †, is the only hurtbox; it glows open for 1.5 s † at the start of each gap and is shut otherwise; a shot at the shut hub splashes off; reachable with aim-up from the floor or straight shots from the ledges (gdd.md:409) |
| FR85 | 30 HP (unmarked); "can be hit at any time" | 30 HP **†**; damage only on the open hub; HP and window length tuned together in Epic 4 so a first-time fight lands in 60–120 s (gdd.md:410) |
| FR86 | Notch at 15 HP | Notch at half health (gdd.md:411); equivalent while HP is 30 |
| FR90 | The rest at least 2 tiles apart | At least 2 tiles of clear floor between them; a millstone lands on the first surface below it (ledge or floor) and its shadow marks that surface (gdd.md:421) |
| FR91 | Rolls to the far wall, "then walks back" | Rolls back to its side: two passes, each jumped the same way (gdd.md:422) |
| FR93 | Gap counts from the end of the previous attack | From the end of the previous attack's *hazard* (wave leaves, last millstone lands, roll back reaches his side); the hub window opens at the start of each gap (gdd.md:429) |
| FR94 | Phase 2 begins at 15 HP | At half health, once the current attack has ended; never cuts an attack short (gdd.md:430) |

Line citations after `gdd.md:405` are one line off (the weak-point bullet was inserted).

**The same pattern holds in Part 5 (architecture), not audited in full here:** the planning-gaps architecture edits (A1–A10) post-date the AR extraction. `confirmPressed` (A3), `AudioFade` (A9) and the new `wardenShotBlocked` / `wardenHubOpened` events are in `game-architecture.md` but absent from the inventory, and AR126 and AR128 still name the `MusicFade` region.

**Risk.** The inventory's own rule says the source wins, and the affected stories were edited directly. A developer agent that follows a story's FR or AR citation into the inventory would still read the old rule (e.g. "the warden can be hit at any time").

### GDD Completeness Assessment

- **Complete and implementable.** Status is final; every mechanic has numbers; starting guesses are marked † with the epic that tunes them; ownership is split cleanly (narrative owns story content, UX spines own overlay behaviour, architecture owns how); out of scope and open questions are explicit; the ten first-draft assumptions are closed in the decision log.
- **Gaps are handled, not hidden.** About 120 conflicts and gaps found across the documents were triaged: 13 settled by precedence (X-A), 37 story-level defaults (X-B), 11 planning changes (X-C), all resolved or dropped except X-C6, which story 0.14 carries.
- **One open dependency gates the next epic:** the image model is "not chosen" and is needed "before Epic 0 starts" (gdd.md:935). CLAUDE.md forbids picking it silently.
- **Fix needed:** refresh the inventory entries above from the GDD and architecture (doc hygiene, not a design change).

## Epic Coverage Validation

**Method.** `epics.md` keeps an ID-level coverage map (requirement → epic) and, on every story, a `**Requirements:**` line citing the IDs it delivers. A script (kept outside the repo) expanded every ID range in the map, the seven epic `Covers:` lines and all 132 story citation lines, and compared them with the 782 requirement IDs defined in the inventory. Where the script can't judge (the stale warden FRs, umbrella IDs, sound wiring), the story text was read.

### Coverage Statistics

| Family | Defined | In coverage map | Cited by ≥ 1 story | Rule for all stories (by design) | Deliberately not built |
| --- | --- | --- | --- | --- | --- |
| FR (GDD) | 217 | 217 | 216 | 1 (FR6) | 0 |
| NFR (GDD) | 49 | 49 | 48 | 1 (NFR16) | 0 |
| PR (GDD) | 35 | 35 | 27 | 8 | 0 |
| NR (narrative) | 117 | 117 | 111 | 4 | 2 (NR64, NR116) |
| AR (architecture) | 248 | 248 | 237 | 11 (AR238–AR248) | 0 |
| UX-DR (UX spines) | 112 | 112 | 112 | 0 | 0 |
| PB (brief) | 4 | 4 | 4 | 0 | 0 |
| **Total** | **782** | **782 (100%)** | **755** | **25** | **2** |

- **Total GDD FRs:** 217. **Covered:** 217 (216 cited by stories, plus FR6, which is a rule no story builds). **Coverage: 100%.**
- All 37 story-level defaults (X-B1–X-B37) are cited by the story that applies them.
- No story cites an undefined ID; every story has a `Requirements` line; no epic's `Covers:` line names an ID that none of its stories cite.
- Stories per epic: E0 15, E1 28, E2 11, E3 22, E4 15, E5 18, E6 23.

### Coverage Matrix

Generated from the trace: each GDD requirement, the epics the map assigns it to, and the stories that cite it.

<details>
<summary>FR coverage matrix (217 rows)</summary>

| ID | Requirement (inventory text, shortened) | Map epics | Stories citing it | Status |
| --- | --- | --- | --- | --- |
| FR1 | Version one contains exactly three levels, played in order: Level 1 Emberwood, Level 2 the Drow… | 5 | 5.6, 5.18 | ✓ Covered |
| FR2 | Winning a level: Levels 1 and 3 are won by reaching the exit; Level 2 is won by defeating the w… | 1, 4 | 1.14, 1.23, 4.7, 5.4 | ✓ Covered |
| FR3 | Winning version one: finishing Level 3 shows the closing card; if all 9 bells have been found, … | 5 | 5.9 | ✓ Covered |
| FR4 | There is no game over, no lives and no countdown timer; failure resolves only to a pit return o… | 1 | 1.14, 1.23 | ✓ Covered |
| FR5 | A "respawn" is a death that sends Rowan back to a checkpoint; pit returns do not count as respa… | 1 | 1.14, 1.23 | ✓ Covered |
| FR6 | There is one difficulty setting, tuned generous; no difficulty selection exists. | All | — | ✓ Rule for all stories |
| FR7 | The simulation updates 60 times a second (one "step"); one tile is one world unit; all duration… | 1 | 1.1, 1.4 | ✓ Covered |
| FR8 | Run: Rowan moves left/right on the ground and in the air with run speed 7 tiles/s. | 1 | 1.6 | ✓ Covered |
| FR9 | Ground acceleration 70 tiles/s² and deceleration 60 tiles/s²; turn-around boost 1.7×. | 1 | 1.6 | ✓ Covered |
| FR10 | Air acceleration 40 tiles/s² and air deceleration 16 tiles/s². | 1 | 1.6 | ✓ Covered |
| FR11 | Gravity is 40 tiles/s²; while falling it is multiplied by 1.35; max fall speed is 18 tiles/s. | 1 | 1.6 | ✓ Covered |
| FR12 | Apex gravity: in the air with jump held and vertical speed between -2.2 and 2.2 tiles/s, gravit… | 1 | 1.6 | ✓ Covered |
| FR13 | Jump: jump speed 16.5 tiles/s; a full jump peaks at 3.30 tiles with about 0.87 s (about 52 step… | 1 | 1.6 | ✓ Covered |
| FR14 | Variable jump: releasing jump multiplies vertical speed by 0.45 (jump cut); a tap jump reaches … | 1 | 1.6 | ✓ Covered |
| FR15 | Coyote time 0.10 s (6 steps). | 1 | 1.6 | ✓ Covered |
| FR16 | Jump buffer 0.12 s (7 steps): a jump pressed up to 0.12 s before landing fires on landing. | 1 | 1.6 | ✓ Covered |
| FR17 | A jump or spit press always registers, even a tap shorter than one step. | 1 | 1.4, 1.6, 1.12 | ✓ Covered |
| FR18 | Rowan's collision hitbox is 0.72 wide × 0.92 tall. | 1 | 1.6 | ✓ Covered |
| FR19 | One-way ledges: Rowan lands on them only while falling and only if his feet were above the ledg… | 1 | 1.7 | ✓ Covered |
| FR20 | Drop-through: Down + jump on a one-way ledge drops Rowan through it; one-way ledges are ignored… | 1 | 1.7 | ✓ Covered |
| FR21 | Moving platforms: Rowan can land on them from above only; they carry him as they move; jumping … | 1 | 1.7, 5.1 | ✓ Covered |
| FR22 | Waterwheel platforms (Level 2) are moving platforms on a circular path that stay level as they … | 5 | 5.1, 5.10 | ✓ Covered |
| FR23 | Crouch: holding down on the ground stops Rowan in place (he can still turn) and shrinks only hi… | 1 | 1.12, 1.19 | ✓ Covered |
| FR24 | While crouched, Rowan's shots fire from 0.3 tiles high. | 1 | 1.12 | ✓ Covered |
| FR25 | Camera look-ahead is 1.2 tiles in the facing direction, or 2.4 tiles while running. | 1 | 1.8 | ✓ Covered |
| FR26 | In the air the camera holds still vertically until Rowan moves more than 1.8 tiles below or 2.4… | 1 | 1.8 | ✓ Covered |
| FR27 | The camera stops at the level edges. | 1 | 1.8 | ✓ Covered (inventory text stale; stories current) |
| FR28 | The camera always shows at least 19 × 10.4 tiles of play area in landscape; other aspect ratios… | 1 | 1.8 | ✓ Covered |
| FR29 | Screen shake uses a trauma level: a new shake raises trauma to its value if higher (never adds)… | 1 | 1.17 | ✓ Covered |
| FR30 | Keyboard bindings: Move A/D or ←/→; aim up hold W or ↑; crouch / aim down in air hold S or ↓; j… | 1 | 1.4, 1.10 | ✓ Covered |
| FR31 | Gamepad bindings (standard layout): move left stick or d-pad; aim up stick/d-pad up; crouch / a… | 1 | 1.9, 1.10 | ✓ Covered |
| FR32 | Stick thresholds: the stick must be pushed 0.35 of the way sideways and 0.5 of the way up or do… | 1 | 1.9 | ✓ Covered |
| FR33 | Auto-pause: the game pauses when the tab is hidden, the window loses focus, fullscreen is left … | 1 | 1.10 | ✓ Covered |
| FR34 | If the browser refuses gamepad access, the keyboard still works and the game keeps running. | 1 | 1.9 | ✓ Covered |
| FR35 | If the gamepad fails during play, it is turned off for the session and the game pauses as for a… | 1 | 1.9, 1.10 | ✓ Covered |
| FR36 | After a gamepad failure, the pause and title menus show a one-line notice that the gamepad is u… | 6 | 6.7, 6.12 | ✓ Covered |
| FR37 | The first time each action is needed, a small wordless sign in the scenery shows the key or but… | 1, 3 | 1.27, 3.5 | ✓ Covered |
| FR38 | There are about 6 control signs, all in Level 1 (move, jump, spit, aim up, crouch, drop-through… | 1, 3 | 1.27, 3.5 | ✓ Covered |
| FR39 | A sign's icon matches the device the player last used (keyboard or gamepad). | 1, 3 | 1.27, 3.5 | ✓ Covered |
| FR40 | Keyboard signs show only one key set: arrow keys, Z to jump, X to spit; other bound keys are ne… | 1, 3 | 1.27, 3.5 | ✓ Covered |
| FR41 | Gamepad signs show button positions, never platform letters, colours or logos; the spit sign sh… | 1, 3 | 1.27, 3.5 | ✓ Covered |
| FR42 | Control signs never cover the play area. | 1, 3 | 1.27, 3.5, 3.20 | ✓ Covered |
| FR43 | Rowan has exactly one attack, the ember spit, plus the stomp; no combos and no melee. | 1 | 1.12 | ✓ Covered |
| FR44 | Ember spit: 1 damage, 15 tiles/s for 0.55 s (range 8.25 tiles), 0.2 s cooldown; holding the but… | 1 | 1.12 | ✓ Covered |
| FR45 | Ember shots fly straight without gravity, stop on solid tiles, and pass through one-way ledges … | 1 | 1.12 | ✓ Covered |
| FR46 | Shots leave Rowan 0.42 tiles in front of him at height 0.48 (0.7 when aiming up; 0.3 when aimin… | 1 | 1.12 | ✓ Covered |
| FR47 | Aim: holding up aims 45° upward; holding down in the air aims 45° downward. | 1 | 1.12 | ✓ Covered |
| FR48 | Stomp: landing on an enemy without thorns or spikes kills it and bounces Rowan at 11 tiles/s, o… | 1 | 1.16 | ✓ Covered |
| FR49 | A stomp counts while Rowan is falling, with a forgiveness of 0.35 tiles below the enemy's top; … | 1 | 1.16 | ✓ Covered |
| FR50 | Thorn rule: an enemy with visible thorns or spikes cannot be stomped, and touching it from abov… | 1 | 1.16, 1.18 | ✓ Covered |
| FR51 | Triple shot pickup: fires 3 shots spread ±9° (±0.16 rad) around the aim; speed, range and coold… | 1 | 1.21 | ✓ Covered |
| FR52 | Piercing shot pickup: 15 tiles/s for 1.1 s † (about 16.5 tiles, double range); passes through e… | 5 | 5.2, 5.12 | ✓ Covered |
| FR53 | Picking up a weapon replaces the current one and starts its timer from 20 s. | 1 | 1.21, 5.2 | ✓ Covered |
| FR54 | A HUD bar shows the weapon time left, and a warning sound plays at 3 s left †. | 1, 3 | 1.21, 1.22, 3.17, 3.19 | ✓ Covered |
| FR55 | Rowan keeps a weapon pickup through a pit fall and loses it on death. | 1 | 1.21, 5.2 | ✓ Covered |
| FR56 | Every weapon pickup Rowan has taken (used up or lost) goes back in the level when he respawns a… | 1 | 1.21, 5.2 | ✓ Covered |
| FR57 | Each level has 1 or 2 weapon pickups, placed before combat-heavy stretches and before the warde… | 3, 5 | 3.1, 5.3, 5.4, 5.5 | ✓ Covered |
| FR58 | When an enemy, enemy shot or the warden touches Rowan, both boxes shrink by 0.08 tiles on each … | 1 | 1.16 | ✓ Covered |
| FR59 | When Rowan's shot is tested against an enemy, the enemy box grows by 0.12 tiles on each side. | 1 | 1.16 | ✓ Covered |
| FR60 | Spikes are not solid and hurt only when Rowan's feet are in the bottom 0.45 of the spike tile, … | 1 | 1.13 | ✓ Covered |
| FR61 | Hearts: Rowan has 3 hearts; every hit costs 1; there are no heart pickups and no extra hearts. | 1 | 1.13 | ✓ Covered |
| FR62 | Being hit by an enemy, enemy shot, the warden or spikes: -1 heart; knockback 6 tiles/s horizont… | 1 | 1.13, 1.16 | ✓ Covered |
| FR63 | After a hit, Rowan has 1.3 s (78 steps) of invulnerability, shown by a 9 Hz blink. | 1 | 1.13, 1.17 | ✓ Covered |
| FR64 | Pit rule: falling into a pit (or into deep water in the Drowned Mill) costs 1 heart; the screen… | 1 | 1.14, 5.1 | ✓ Covered |
| FR65 | Stable ground for pit returns means solid ground or a one-way ledge, never a moving platform an… | 1 | 1.14, 5.1 | ✓ Covered |
| FR66 | At 0 hearts: a 0.85 s death sequence, then respawn at the last checkpoint with 3 hearts and 1.0… | 1 | 1.14 | ✓ Covered |
| FR67 | On death/respawn, killed enemies stay dead (enemies never respawn when Rowan dies), and collect… | 1 | 1.14, 1.16, 1.20 | ✓ Covered |
| FR68 | Stomp feedback: hit-stop 0.05 s (3 steps), shake trauma 0.2, bounce. | 1 | 1.17 | ✓ Covered |
| FR69 | Kill with a shot: no hit-stop, shake trauma 0.12, burst effect. | 1 | 1.17 | ✓ Covered |
| FR70 | Rowan hurt: hit-stop 0.06 s (4 steps), shake trauma 0.35, knockback and blink. | 1 | 1.17 | ✓ Covered |
| FR71 | Rowan dies: no hit-stop, shake trauma 0.4, fade. | 1 | 1.17 | ✓ Covered |
| FR72 | An enemy that survives a hit flashes. | 1 | 1.17, 1.19 | ✓ Covered |
| FR73 | Every enemy's contact damage is 1 heart. | 1, 3 | 1.16, 1.18, 3.7 | ✓ Covered |
| FR74 | Enemies attack only while on screen, so Rowan is never hit from off-screen. | 1, 3 | 1.19, 3.7 | ✓ Covered |
| FR75 | Enemies do not hurt each other. | 1, 3 | 1.16, 3.7 | ✓ Covered |
| FR76 | Version one has exactly three enemy types; Levels 2 and 3 reuse them recoloured by each level's… | 1, 3 | 1.16, 3.7 | ✓ Covered |
| FR77 | Walker ("grub"): 1 HP; patrols at 1.6 tiles/s and falls under gravity; turns at walls and at le… | 1, 3 | 1.16, 3.7 | ✓ Covered |
| FR78 | Thorn flyer ("burr-wing"): 1 HP; follows a fixed path through walls, swinging ±0.9 to 1.2 tiles… | 1, 3 | 1.18, 3.8 | ✓ Covered |
| FR79 | Rooted spitter ("pod"): 2 HP; stationary; faces Rowan; not stompable (thorned crown); hitbox 0.… | 1, 3 | 1.19, 3.9 | ✓ Covered |
| FR80 | Spitter attack: swells for 0.5 s, then fires a seed at 5 tiles/s every 2.5 s, only while on scr… | 1, 3 | 1.19, 3.9 | ✓ Covered |
| FR81 | Spitter seed: radius 0.12 tiles, centre travelling 0.75 tiles above the spitter's ground † (cov… | 1, 3 | 1.19, 3.9 | ✓ Covered |
| FR82 | Warden arena: one screen, 19 tiles wide, flat floor, two one-way ledges 3 tiles up †. | 4 | 4.2 | ✓ Covered |
| FR83 | A checkpoint sits at the arena door with a triple shot pickup just before it; the warden stays … | 4 | 4.2 | ✓ Covered |
| FR84 | Warden body is 3 × 4 tiles †, stands at the arena's right side, and its body is its hurtbox. | 4 | 4.2 | ✓ Covered (inventory text stale; stories current) |
| FR85 | Warden health is 30 HP; each ember hit does 1 damage; a triple shot can land 3 hits; the warden… | 4 | 4.2 | ✓ Covered (inventory text stale; stories current) |
| FR86 | Warden health bar: a HUD bar labelled "The Warden" appears when the door shuts, drops with each… | 4 | 4.5 | ✓ Covered (inventory text stale; stories current) |
| FR87 | The warden cannot be stomped (spikes: iron cog teeth); touching its body costs 1 heart. | 4 | 4.2 | ✓ Covered |
| FR88 | The warden returns to full health when Rowan respawns at the door checkpoint. | 4 | 4.2 | ✓ Covered |
| FR89 | Wheel wash (phases 1 and 2): warning = the wheel spins up and glows for 0.8 s; a wave of water … | 4 | 4.3 | ✓ Covered |
| FR90 | Millstone fall (phases 1 and 2): shadows mark the floor 0.8 s before impact; pieces are 1 tile … | 4 | 4.3, 4.4 | ✓ Covered (inventory text stale; stories current) |
| FR91 | Wheel roll (phase 2 only): warning = rears back and vents steam for 0.6 s; the warden curls int… | 4 | 4.4 | ✓ Covered (inventory text stale; stories current) |
| FR92 | Attack order: phase 1 alternates wheel wash and millstone fall; phase 2 cycles wheel wash, mill… | 4 | 4.3, 4.4 | ✓ Covered |
| FR93 | Attacks never overlap; the gap before the next attack counts from the end of the previous one: … | 4 | 4.3, 4.4 | ✓ Covered (inventory text stale; stories current) |
| FR94 | Phase 2 begins at 15 HP: the warden flinches and the music shifts. | 4 | 4.4 | ✓ Covered (inventory text stale; stories current) |
| FR95 | Every attack warning is at least 0.6 s, and each attack has its own warning sound. | 4 | 4.3 | ✓ Covered |
| FR96 | Seal-break sequence: after the warden falls, an in-engine sequence of 15 s or less † plays with… | 4 | 4.7, 4.12 | ✓ Covered |
| FR97 | Seal-break content: the seal at the wheel's hub shatters, the great wheel grinds to a stop, the… | 4 | 4.12 | ✓ Covered |
| FR98 | The seal-break sequence can be skipped on replays only. | 4 | 4.7 | ✓ Covered |
| FR99 | After the seal break: the results screen, then the Level 3 story line (loading card). | 5 | 5.6 | ✓ Covered |
| FR100 | Warden look: a hunched miller fused with the great waterwheel rising from his back like a shell… | 4 | 4.11 | ✓ Covered |
| FR101 | Grain sacks marked with Harrowmere's mark sit at the door checkpoint; the warden's link to Rowa… | 5 | 5.11 | ✓ Covered |
| FR102 | Ledge grab is unlocked by the first seal (end of Level 2) and is available only from then on. | 4 | 4.6 | ✓ Covered |
| FR103 | Ledge-grab hand point is the top of Rowan's hitbox, 0.92 tiles above his feet †. | 4 | 4.6 | ✓ Covered |
| FR104 | Rowan catches a ledge when all hold: he is in the air (falling or at the top of a jump); he is … | 4 | 4.6 | ✓ Covered |
| FR105 | One-way ledges, moving platforms and hazard tiles are not grabbable. | 4 | 4.6 | ✓ Covered |
| FR106 | While hanging, Rowan does not fall and cannot shoot. | 4 | 4.6 | ✓ Covered |
| FR107 | While hanging, Up or jump climbs onto the ledge, taking 0.35 s †. | 4 | 4.6 | ✓ Covered |
| FR108 | While hanging, Down lets go, and Rowan cannot grab again for 0.25 s †. | 4 | 4.6 | ✓ Covered |
| FR109 | A hit knocks Rowan off a ledge. | 4 | 4.6 | ✓ Covered |
| FR110 | Ledge-grab reach: a ledge top up to 4 tiles above the take-off ground †. | 4 | 4.6 | ✓ Covered |
| FR111 | Replay form rule: a replay uses the form and abilities Rowan had on first arrival in that level… | 4, 6 | 4.6, 6.9 | ✓ Covered |
| FR112 | Rowan's body: stage 1 (full beast) in Levels 1 and 2; stage 2 (one horn broken, a human hand) i… | 2, 4 | 2.9, 4.8 | ✓ Covered |
| FR113 | Each level places about 100 to 150 embers †. | 1 | 1.20, 1.26 | ✓ Covered |
| FR114 | Collecting embers fills the ember meter; 50 embers restore 1 heart. | 1 | 1.20 | ✓ Covered |
| FR115 | The ember meter starts at 0 in each level and carries across checkpoints and respawns. | 1 | 1.20 | ✓ Covered |
| FR116 | At full hearts, a full meter waits and refills the next heart lost; embers collected past a ful… | 1 | 1.20 | ✓ Covered |
| FR117 | Collected embers stay collected, so each ember heals at most once (at most 2 or 3 heals per lev… | 1 | 1.20 | ✓ Covered |
| FR118 | Ember placement: about 60% trace intended jump arcs and paths, 25% reward detours, 15% sit in c… | 3, 5 | 3.1, 5.3, 5.5 | ✓ Covered |
| FR119 | Each level hides 3 bells (9 in version one). | 1 | 1.20, 1.26 | ✓ Covered |
| FR120 | Collecting a bell briefly shows "Bell n of 3" on the HUD, counting this run's bells as the resu… | 3 | 3.18 | ✓ Covered |
| FR121 | Bells found add up across replays (per level, persisted); finding all 9 unlocks the all-bells s… | 6 | 6.3, 6.8 | ✓ Covered |
| FR122 | Every bell is reachable with the abilities Rowan has on first arrival in that level (the same a… | 3, 5 | 3.1, 5.3, 5.5 | ✓ Covered |
| FR123 | Every bell has at least one visual hint: an ember trail leading off the path, a lantern (Emberw… | 3, 5 | 3.1, 3.20, 5.3, 5.5, 5.11, 5.14 | ✓ Covered |
| FR124 | No bell sits behind a gamble on a pit. Suggested hiding spots: behind foreground scenery, above… | 3, 5 | 3.1, 5.3, 5.5 | ✓ Covered |
| FR125 | Each level has 3 checkpoints, plus one at the warden's door in Level 2. | 1 | 1.14, 1.26 | ✓ Covered |
| FR126 | Each checkpoint sits on safe ground, with no active enemy within 8 tiles † and a safe run-up to… | 1 | 1.25, 1.26 | ✓ Covered |
| FR127 | Touching a checkpoint sets the respawn point and does not heal. | 1 | 1.14 | ✓ Covered |
| FR128 | Each section ends in a calm spot at a checkpoint; the hardest section of a level is the last on… | 3, 5 | 3.1, 5.3, 5.5 | ✓ Covered |
| FR129 | Gaps at equal height: standard up to 4 tiles; challenge tier 5 tiles †. | 1 | 1.25 | ✓ Covered |
| FR130 | Step-ups: 1 tile (short hold); up to 3 tiles (full jump) †. | 1 | 1.25 | ✓ Covered |
| FR131 | At least 5 tiles of clear space above a full-jump take-off, unless a ceiling is intended †. | 1 | 1.25 | ✓ Covered |
| FR132 | Moving platforms are at least 3 tiles wide with peak speed 5.3 tiles/s or less †. | 1 | 1.7, 1.25, 5.1 | ✓ Covered |
| FR133 | Vertical spacing of one-way ledges is 3 tiles or less †. | 1 | 1.25 | ✓ Covered |
| FR134 | Challenge-tier jumps appear only close to a checkpoint and are capped per level: Level 1 none, … | 1, 5 | 1.25, 5.3, 5.5 | ✓ Covered |
| FR135 | Most enemies on screen at once: Level 1 2, Level 2 3, Level 3 4 †. | 1, 5 | 1.25, 5.3, 5.5 | ✓ Covered |
| FR136 | Teaching pattern for every new element (including Level 2's waterwheel platforms and the warden… | 1, 3, 5 | 1.26, 3.1, 5.3, 5.5 | ✓ Covered |
| FR137 | One new player tool per level: Level 1 the base moves and the triple shot; Level 2 the piercing… | 1, 3, 5 | 1.26, 3.1, 5.3, 5.5 | ✓ Covered |
| FR138 | Each enemy is visible for at least 1 s before Rowan can reach it at full run speed. | 1, 3, 5 | 1.26, 3.1, 5.3, 5.5 | ✓ Covered |
| FR139 | No enemy sits on the landing spot of a jump the player cannot see. | 1, 3, 5 | 1.26, 3.1, 5.3, 5.5 | ✓ Covered |
| FR140 | Spitters stand where the player can choose to crouch, jump or shoot. | 1, 3, 5 | 1.26, 3.1, 5.3, 5.5 | ✓ Covered |
| FR141 | Inside a level, progress is linear, left to right with vertical variation; nothing locks off an… | 1, 5 | 1.26, 5.3, 5.5 | ✓ Covered |
| FR142 | Finishing level N unlocks level N+1. | 5, 6 | 5.6, 6.3 | ✓ Covered |
| FR143 | Standard levels (1 and 3) are side-scrolling, linear, 18 to 24 tiles tall †, with 3 checkpoints… | 1, 3, 5 | 1.26, 3.1, 3.4, 5.5, 5.14 | ✓ Covered |
| FR144 | Level 2 is a standard level whose exit is the one-screen warden arena, with a checkpoint at the… | 5 | 5.4 | ✓ Covered |
| FR145 | Level 1 Emberwood: Rowan's home forest at dusk (old trees, mossy rock, wooden ledges, lanterns … | 1, 3 | 1.26, 3.2 | ✓ Covered |
| FR146 | Level 1, start to checkpoint 1: run on flat ground; small step; tall step needing a held jump; … | 1, 3 | 1.26, 3.1 | ✓ Covered |
| FR147 | Level 1, checkpoint 1 to 2: rooted spitter on flat ground (duck, jump or shoot); moving platfor… | 1, 3 | 1.26, 3.1 | ✓ Covered |
| FR148 | Level 1, checkpoint 2 to 3: spikes on a cliff top; a bridge that must be dropped through; tripl… | 1, 3 | 1.26, 3.1 | ✓ Covered |
| FR149 | Level 1, checkpoint 3 to exit: mixed enemies, using the triple shot; a calm exit through the em… | 1, 3 | 1.26, 3.1, 3.4 | ✓ Covered |
| FR150 | Level 1: embers trace jump arcs from the first gap onward; the first ember heal becomes possibl… | 1, 3 | 1.26, 3.1 | ✓ Covered |
| FR151 | Level 1 intensity is low, rising to medium in the last section. | 1, 3 | 1.26, 3.1 | ✓ Covered |
| FR152 | Level 2 the Drowned Mill: marsh and waterwheels (fog, black water, turning wheels); deep water … | 5 | 5.3, 5.10 | ✓ Covered |
| FR153 | Level 3 Harrowmere ruins: the town Rowan burned, starting at the old siege line outside the wal… | 5 | 5.5, 5.13 | ✓ Covered |
| FR154 | Level 3 teaches ledge grab through layout alone (no sign); ledge-grab climbs are the only gated… | 5 | 5.5 | ✓ Covered |
| FR155 | Level 3 ends with a last mixed-enemy stretch, then a short calm walk (about 15 to 25 tiles †) t… | 5 | 5.5 | ✓ Covered |
| FR156 | Story text on screen is limited to the intro, one line before each level, the closing card and … | All | 3.12 | ✓ Covered |
| FR157 | Intro: 5 cards, one line each, about 60 s at most, skippable. | 3 | 3.14 | ✓ Covered |
| FR158 | The intro plays once, on the first Continue of a new save. | 6 | 6.7 | ✓ Covered |
| FR159 | Loading card: on every level load (first play or replay) the level's name and its one story lin… | 3, 5, 6 | 3.12, 5.6, 6.9 | ✓ Covered |
| FR160 | Held beat: at Level 3's exit, control stops for about 3 s † while Rowan stands at the fallen fi… | 5 | 5.7 | ✓ Covered |
| FR161 | Story moments are safe: while control is stopped (seal break, held beat), Rowan cannot be hurt … | 4 | 4.7, 5.7 | ✓ Covered |
| FR162 | The closing card delivers (1) Rowan facing Harrowmere, his first payment for what he did, and (… | 5 | 5.8 | ✓ Covered |
| FR163 | The all-bells card (a memory of Elin the bell-maker) appears if all 9 bells are found. | 5 | 5.8, 5.9 | ✓ Covered |
| FR164 | Story cards (intro, closing, all-bells) are layered paper-cut silhouettes built in the engine f… | 0, 3, 5 | 0.13, 3.13, 5.8 | ✓ Covered |
| FR165 | Story-card text is drawn over the art, never baked into it. | 0, 3, 5 | 0.13, 3.13, 5.8 | ✓ Covered |
| FR166 | Story cards advance on confirm only after a minimum of about 1.5 s †; the closing and all-bells… | 0, 3, 5 | 0.13, 3.14, 5.9 | ✓ Covered |
| FR167 | On story cards only, warm light may also mark Elin and home (exception pending Epic 0); if refu… | 0 | 0.5, 0.13, 5.8 | ✓ Covered |
| FR168 | Story text is exactly the version-one text in the narrative design document: 141 words over 5 i… | 3, 5 | 3.12, 3.13, 5.6, 5.8 | ✓ Covered |
| FR169 | On-screen story terms use only the approved terms: Cindersworn, the Tithe, the Ember Below, Lor… | 3, 5 | 3.13, 5.8 | ✓ Covered |
| FR170 | Boot: a loading screen (wordmark and progress bar, no tips) shows while shared assets load. | 6 | 6.5 | ✓ Covered |
| FR171 | After boot loading, a "Click or press any key" gate appears; its key press or click starts soun… | 3 | 3.11 | ✓ Covered |
| FR172 | Title screen offers Continue, Level select and Settings; the Level select entry appears only af… | 6 | 6.7, 6.8 | ✓ Covered |
| FR173 | Continue starts the next unfinished level, or opens the level select once everything is finishe… | 6 | 6.7, 6.8 | ✓ Covered |
| FR174 | Level select lists the finished levels plus the next unlocked one, each with best clear time an… | 6 | 6.8 | ✓ Covered |
| FR175 | The all-bells card can be watched again from the level select. | 6 | 6.8 | ✓ Covered |
| FR176 | Pause menu: Resume, Restart level, Settings, Quit to level select; until the level select unloc… | 6 | 6.12 | ✓ Covered |
| FR177 | Restart level and Quit each ask for one confirmation, with Cancel as the default. | 6 | 6.12 | ✓ Covered |
| FR178 | Leaving a level mid-play restarts that level (no mid-level save). | 6 | 6.3, 6.12 | ✓ Covered |
| FR179 | End of Levels 1 and 2: the results, then on a first play the next level's loading card; on a re… | 5, 6 | 5.6, 6.10 | ✓ Covered |
| FR180 | End of Level 3: the held beat, the closing card, the all-bells card if earned, then the results… | 5 | 5.9 | ✓ Covered |
| FR181 | Results screen after each level shows: clear time in m:ss.s excluding pauses and story moments;… | 1, 6 | 1.23, 6.11 | ✓ Covered |
| FR182 | The results screen tags the clear time "New best" when a replay beats the level's best; never o… | 6 | 6.11 | ✓ Covered |
| FR183 | All-bells card timing: it plays after the closing card if all 9 bells have been found by then; … | 5, 6 | 5.9, 6.10 | ✓ Covered |
| FR184 | On phones and tablets, a "best played on desktop with keyboard or gamepad" note shows instead o… | 6 | 6.6 | ✓ Covered |
| FR185 | Progress is stored in the browser on that device and saves automatically after each level. | 6 | 6.2, 6.3 | ✓ Covered |
| FR186 | There are no cloud saves; clearing browser data clears progress. | 6 | 6.2 | ✓ Covered |
| FR187 | If the browser refuses storage, progress is kept in memory for the session and the title screen… | 6 | 6.2, 6.7 | ✓ Covered |
| FR188 | Settings contain music volume, effects volume, reduced motion and fullscreen; no key remapping. | 6 | 6.13 | ✓ Covered |
| FR189 | Mute is toggled by the M key only (not a settings row); a speaker-off icon shows while sound is… | 3 | 3.10 | ✓ Covered |
| FR190 | Reduced motion turns screen shake off, turns full-screen flashes (such as the seal-break ember … | 4, 6 | 4.12, 6.1, 6.13 | ✓ Covered |
| FR191 | A new save takes its reduced-motion default from the browser's `prefers-reduced-motion` setting. | 6 | 6.1 | ✓ Covered |
| FR192 | A Credits row joins Settings only if an asset's licence requires credit inside the game. | 6 | 6.17, 6.20 | ✓ Covered |
| FR193 | The game supports window resizing and fullscreen, in landscape. | 1, 6 | 1.8, 1.11, 6.13 | ✓ Covered |
| FR194 | The HUD shows hearts, the ember meter, the weapon timer, the bell toast, the warden health bar … | 1, 3, 4 | 1.22, 3.19, 4.5 | ✓ Covered |
| FR195 | The interface set comprises: HUD, boot loading screen, title gate, title, loading card, pause, … | 1, 3, 6 | 1.11, 1.22, 1.23, 3.11, 3.12, 3.13 | ✓ Covered |
| FR196 | One short, hummable tune per level: an arcade-era melody on modern instruments. | 3, 4, 5 | 3.15, 4.13, 5.16 | ✓ Covered |
| FR197 | The warden fight uses a more intense arrangement of the Level 2 tune, shifting when phase 2 sta… | 4 | 4.13 | ✓ Covered |
| FR198 | The title screen reuses the Level 1 tune. | 3 | 3.15 | ✓ Covered |
| FR199 | Short stingers mark the end of a level, the seal break and the closing card. | 3, 4, 5 | 3.15, 4.13, 5.16 | ✓ Covered |
| FR200 | Elin's motif (a bell-like phrase of 3 or 4 notes) runs through every level tune and the closing… | 3, 4, 5 | 3.15, 3.18, 4.13, 5.16 | ✓ Covered |
| FR201 | In Level 3 the music fades out on the last calm stretch before the fallen bell, leaving only wi… | 5 | 5.16 | ✓ Covered |
| FR202 | One ambience bed per level under the music: Emberwood (dusk forest, wind in the leaves, creakin… | 3, 5 | 3.15, 5.15, 5.16 | ✓ Covered |
| FR203 | Hero sounds: ember spit (the signature sound, recognisable on its own), jump, landing (only on … | 3, 4 | 3.16, 4.14 | ✓ Covered |
| FR204 | Enemy sounds: hit, death, spitter swell, spitter seed. | 3, 4 | 3.16 | ✓ Covered |
| FR205 | Warden sounds: one distinct warning sound per attack, phase change, defeat. | 4 | 4.14 | ✓ Covered |
| FR206 | World sounds: ember pickup, heart restored, bell (a clear bell tone tied to Elin), checkpoint, … | 3, 4 | 3.17, 3.18, 4.14 | ✓ Covered |
| FR207 | Interface sounds: menu move, confirm, back, pause. About 30 sound effects in total. | 3, 4 | 3.17 | ✓ Covered |
| FR208 | Rendering composition: 3D characters on a 2D play plane in front of layered backdrops (foregrou… | 0, 3 | 0.10, 0.12, 3.3 | ✓ Covered |
| FR209 | Lanterns appear only in Emberwood. | 3 | 3.3 | ✓ Covered |
| FR210 | Rowan's cursed-form design: a horned ember-beast, clearly not an ape; upright, two legs and two… | 0, 2 | 0.4, 0.5, 2.2, 2.3, 2.7, 2.11 | ✓ Covered |
| FR211 | Hero model: 1 rig with 2 visual stages; 13 animations (idle, run, jump, fall, land, spit, spit … | 2, 4 | 2.4, 2.5, 2.8, 2.10, 2.11, 4.8, 4.9 | ✓ Covered |
| FR212 | Enemy animations: walker move, death; thorn flyer move, death (no hurt animation, 1 HP); spitte… | 3 | 3.7, 3.8, 3.9 | ✓ Covered |
| FR213 | Warden animations: idle, three attacks with their warnings, the roll curl, hurt, phase change, … | 4 | 4.11 | ✓ Covered |
| FR214 | Environment kits: 3 (one per level), snapping to the tile grid: ground pieces, solid ledges, on… | 3, 5 | 3.2, 3.3, 3.4, 5.10, 5.11, 5.13, 5.14 | ✓ Covered |
| FR215 | Pickups and markers: 6 (ember, bell, triple shot, piercing shot, checkpoint, exit). | 3, 5 | 3.4, 3.6, 5.12 | ✓ Covered |
| FR216 | Story art: 7 cards (intro 5, closing card, all-bells card). | 0, 3, 5 | 0.13, 3.13, 5.8 | ✓ Covered |
| FR217 | Music and ambience assets: 3 tunes, a warden arrangement, stingers, 3 ambience beds and the gre… | 3, 4, 5 | 3.15, 4.13, 4.14, 5.15, 5.16 | ✓ Covered |

</details>

<details>
<summary>NFR coverage matrix (49 rows)</summary>

| ID | Requirement (inventory text, shortened) | Map epics | Stories citing it | Status |
| --- | --- | --- | --- | --- |
| NFR1 | 60 fps sustained in current Chrome, Edge and Firefox. | 0, 6 | 0.12, 6.19 | ✓ Covered |
| NFR2 | Reference machine: a 2020-era laptop with integrated graphics (Intel Iris Xe class) at 1080p; t… | 0, 6 | 0.12, 6.19 | ✓ Covered |
| NFR3 | Pass mark: median frame time ≤16.7 ms and 99th percentile ≤20 ms over a full Level 1 playthroug… | 0, 6 | 0.12, 6.19 | ✓ Covered |
| NFR4 | Refresh-rate independence: gameplay behaves the same on 60, 120 and 144 Hz displays, and a slow… | 1 | 1.4, 1.28 | ✓ Covered |
| NFR5 | Total download is 30 MB or less; per-asset size budgets (set in the architecture document) sit … | 0, 6 | 0.2, 6.19, 6.21 | ✓ Covered |
| NFR6 | From page open to first input in 10 s or less on a 50 Mbit/s connection. | 6 | 6.19, 6.22 | ✓ Covered |
| NFR7 | Level transitions take 3 s or less (applies to loading, not to loading-card reading time). | 6 | 6.19 | ✓ Covered |
| NFR8 | Resilience: if an optional browser feature (gamepad, storage, audio, fullscreen) fails or is re… | 1, 6 | 1.9, 1.10, 6.2, 6.13, 6.14, 6.16, 6.22 | ✓ Covered |
| NFR9 | Engine and platform: three.js on WebGL in a desktop browser, hosted as an HTML5 game on itch.io… | 0, 6 | 0.1, 6.20, 6.23 | ✓ Covered |
| NFR10 | Build must fit itch.io limits: at most 1,000 files, 500 MB total, 200 MB per file. | 0, 6 | 0.2, 6.21 | ✓ Covered |
| NFR11 | Version one is free to play in the browser on itch.io (donations only). | 0, 6 | 6.20, 6.23 | ✓ Covered |
| NFR12 | Supported browsers: current Chrome, Edge and Firefox; Safari is best-effort. | 6 | 6.16, 6.22 | ✓ Covered |
| NFR13 | Input devices: keyboard; standard gamepads (Xbox and PlayStation layouts as the browser reports… | 1 | 1.4, 1.9, 1.28 | ✓ Covered |
| NFR14 | Screen: landscape; 16:9 is the main target; other aspect ratios never show less than 19 × 10.4 … | 0, 1 | 0.10, 1.8 | ✓ Covered |
| NFR15 | Desktop only: phones and tablets are not supported in version one. | 6 | 6.6 | ✓ Covered |
| NFR16 | Language: English only. | All | — | ✓ Rule for all stories |
| NFR17 | Pillar 2 decision test: no single failure costs more than about 120 s of replay. | 1, 3, 5 | 1.26, 1.28, 3.1, 3.21, 5.3, 5.5, 5.18 | ✓ Covered |
| NFR18 | Checkpoint spacing: one every 60 to 120 s of first-play time (each section 60 to 120 s). | 1, 3, 5 | 1.26, 1.28, 3.1, 3.21, 5.3, 5.5, 5.18 | ✓ Covered |
| NFR19 | First-play respawn targets †: Level 1 5 or fewer; Level 2 8 or fewer, warden included; Level 3 … | 1, 3, 5 | 1.26, 1.28, 3.21, 5.3, 5.5, 5.18 | ✓ Covered |
| NFR20 | Warden fight target length: 60 to 120 s for a first-time player; a fight of 120 s or less stays… | 4 | 4.4, 4.15 | ✓ Covered |
| NFR21 | Hitboxes favour the player (the shrink/grow rules in FR58–FR60 are the implementation). | 1 | 1.13, 1.16 | ✓ Covered |
| NFR22 | Intensity rises across version one with a peak at the warden. | 5 | 5.3, 5.5, 5.18 | ✓ Covered |
| NFR23 | Each level takes 6 to 8 minutes on a first play (Level 2 plus 1 to 2 minutes of warden fight); … | 1, 3, 5 | 1.28, 3.1, 3.21, 5.3, 5.5, 5.18 | ✓ Covered |
| NFR24 | Version one totals about 20 to 26 minutes of play plus story moments, inside a 20 to 30 minute … | 5 | 5.18 | ✓ Covered |
| NFR25 | Intro is about 60 s at most; seal break 15 s or less †; held beat about 3 s †. | 3, 4, 5 | 3.14, 4.7, 5.7 | ✓ Covered |
| NFR26 | Pillar 1 decision test: if a player needs a hint box to get past a spot, the spot is wrong; lay… | 3, 5 | 3.1, 3.20, 3.22, 5.5, 5.13, 5.17 | ✓ Covered |
| NFR27 | The hero, enemies, hazards and pickups can each be told apart from the background at a glance. | 0, 5 | 0.12, 0.15, 1.5, 1.28, 2.11, 3.2, 3.20, 4.5, 4.9, 4.10, 4.11, 4.12, 4.15, 5.10, 5.13, 5.17 | ✓ Covered |
| NFR28 | Warm light belongs only to the hero, embers and lanterns; Rowan, his shots and the collectables… | 0, 3, 5 | 0.5, 0.7, 0.12, 0.15, 3.3, 3.6, 3.20, 4.8, 4.10, 4.11, 4.12, 5.10, 5.13, 5.17 | ✓ Covered |
| NFR29 | Pits read as dark. | 3, 5 | 3.3, 3.20, 5.10, 5.13, 5.17 | ✓ Covered |
| NFR30 | Hazards contrast with the ground around them. | 3, 5 | 3.2, 3.20, 4.10, 5.10, 5.13, 5.17 | ✓ Covered |
| NFR31 | Wherever a level teaches aiming, the line of sight is clear. | 3, 5 | 3.20, 5.10, 5.13, 5.17 | ✓ Covered |
| NFR32 | Collectable embers look clearly different from Rowan's ember shots in both shape and motion. | 3 | 3.6, 3.20 | ✓ Covered |
| NFR33 | Every asset takes the game's own look (its materials, its per-level palette, its per-level ligh… | 0 | 0.5, 0.9, 2.7 | ✓ Covered |
| NFR34 | The setting's tone is dark fantasy whichever art style wins. | 0 | 0.4, 0.5 | ✓ Covered |
| NFR35 | The hero and the enemies must deform cleanly when animated; raw generated meshes are acceptable… | 2, 3, 4 | 2.3, 2.4, 2.5, 2.8, 2.10, 2.11, 3.7, 3.8, 3.9, 4.8, 4.9, 4.11 | ✓ Covered |
| NFR36 | Art never defines collision; environment kits snap to the tile grid. | 1, 3 | 1.2, 1.26, 2.9, 3.2, 3.4 | ✓ Covered |
| NFR37 | Nothing is taken from Toki or any other game named in the GDD: no names, characters, levels, sc… | All | 4.1 | ✓ Covered |
| NFR38 | Nothing Dungeons & Dragons invented is used: no settings, named characters, signature monsters,… | All | 4.1 | ✓ Covered |
| NFR39 | Story names are checked for originality and trademarks before any public build or page: Rowan A… | 6 | 6.17 | ✓ Covered |
| NFR40 | Story symbols (Harrowmere's mark, the Tithe's sign) are checked before they are drawn, in Epic … | 4 | 4.1 | ✓ Covered |
| NFR41 | Enemy names ("grub", "burr-wing", "pod") are internal working names, checked for originality be… | 6 | 6.17 | ✓ Covered |
| NFR42 | The final title is checked against existing games and trademarks before any public page; "Ember… | 6 | 6.17 | ✓ Covered |
| NFR43 | The licence and commercial-use terms of every tool and asset (Tripo, image model, audio tools i… | All | 1.27, 2.1, 4.1 | ✓ Covered |
| NFR44 | Credits go on the itch.io page (plus an in-game Credits row only if a licence requires it). | 6 | 6.20 | ✓ Covered |
| NFR45 | Epic 3 (MVP) pass: at least 4 of 5 (or 3 of 3) first-time testers from the primary audience fin… | 3 | 3.21, 3.22 | ✓ Covered |
| NFR46 | Epic 4 pass: a full warden fight can be won without taking damage; at least 4 of 5 first-time t… | 4 | 4.3, 4.4, 4.15 | ✓ Covered |
| NFR47 | Understood in seconds: no player is stuck for more than 60 s at one spot without understanding … | 3, 4, 5 | 3.21, 4.15, 5.18 | ✓ Covered |
| NFR48 | Modern mercy: first-play respawns stay within the Difficulty Curve targets; no player quits fro… | 3, 4, 5 | 3.21, 4.15, 5.18 | ✓ Covered |
| NFR49 | The curse shows on the body: after Level 1, players can say who Rowan is and what he wants; aft… | 3, 4, 5 | 3.21, 4.8, 4.15, 5.18 | ✓ Covered |

</details>

### Missing Requirements

**No critical or high-priority gaps.** Every GDD FR and NFR has a traceable path to at least one story. Findings, all low severity:

1. **Stale FR texts, current stories (from GDD Analysis).** FR27, FR84–FR86, FR90, FR91, FR93 and FR94 describe the pre-G1/G2 design, but the stories that build them (1.8, 3.2, 3.3, 4.2–4.5, 4.10, 4.11, 4.14, 4.15, 5.10, 5.13) carry the current rules: hub-only hurtbox, `wardenShotBlocked` / `wardenHubOpened`, roll back, gaps timed from the end of the hazard, phase 2 after the current attack, HP † tuned with the window, the 3-tile margin and plain bands. Coverage holds; the inventory needs refreshing so citations lead to the right text.
2. **Coverage-map tags with no citing story in that epic (21 pairs).** Most are umbrella IDs tagged "1, 3, 6" or "1, 6" whose Epic 6 stories cite the specific component IDs instead: AR180–AR186, AR188–AR189 (DOM overlay), FR195 (interface set), UX-DR39 (module ownership), UX-DR100–UX-DR103 (strings), UX-DR108–UX-DR110 (architecture notes). The work is in Epic 6 (stories 6.4–6.14 build those surfaces); only the citation is missing. Three are map typos: **FR204** (enemy sounds) and **FR207** (interface sounds) are tagged Epic 4 but built in 3.16 and 3.17, with Epic 6's menus inheriting interface sounds through the shared `playUiSound` focus model (stories 1.11, 6.4); **NFR11** (free on itch.io) is tagged Epic 0 but delivered in 6.20 and 6.23.
3. **"All" rules not written where agents load them.** The map says the 25 "All" IDs reach every story through CLAUDE.md and `project-context.md`. Most do (naming and barrel rules, originality, licences, retrospectives). Four don't appear in either file: FR6 (one difficulty), NFR16 (English only), PR30 (reject scope growth unless the developer asks) and AR248 (follow the closest pattern and flag it in the story's notes). The first two are absences no story would build; PR30 and AR248 are behavioural norms that a developer agent should see.
4. **NR64 and NR116** (stage 3, full-game ending) are mapped "—" as later-version items (inventory Part 8). Correct; not gaps.

## UX Alignment Assessment

### UX Document Status

**Found.** `ux-designs/ux-emberbound-2026-11-13/`: `EXPERIENCE.md` (behaviour, flows, strings; status final) and `DESIGN.md` (overlay look; status final, values provisional by design), with three greyscale layout mocks. The spines are the authority on menu and HUD behaviour (GDD PR4). Both were read in full; the architecture's State Management, Gameplay Camera, Story Director, Data Persistence, Asset Management, Input, User Interface, Audio, Performance Budget and Error Handling sections were read against them.

### UX ↔ GDD

- **Aligned.** Every UX decision the spines asked the GDD to carry (warden bar, bell toast, mute indicator, boot screen, title gate, "Quit to title", restart and quit confirms, mute as M only, reduced-motion scope and default, extra auto-pause triggers, storage and gamepad notices, arcade key set on signs, "New best", device note, loading card on every load, credits rule) is in `gdd.md` (lines 626–649, 776, 808–817, 841).
- **Journeys match the GDD's session flow.** The four key flows (Emberwood first play, the warden on a gamepad, the Harrowmere ending, the ninth bell on a replay) follow the GDD's end-of-level order, all-bells timing, replay-form rule, pickup return on respawn and results contents.
- **UX-only content** (hold-to-repeat, UI timings, notice and error strings, the audio-locked notice) is UX-owned under PR4; no GDD change is needed.

### UX ↔ Architecture

- **Supported.** Every surface in the UX information architecture is an app state or overlay screen in the architecture; the seven shared components live in `ui/components/`; `ui/overlay.ts` owns the layer order, the mute indicator and `--tile`; UI timings live in `core/uiTimings.ts`; `PresentationSettings` carries `reducedMotion`, volumes, mute, last device and feature status (`isAudioLocked`, `isFullscreen`, features off) for the notices; the save schema persists exactly what the UX says persists (volumes, reduced motion; not mute, not fullscreen).
- **Planning-gaps changes fit the spines.** A1 (`core/loading.ts` port, app-owned loading state, one silent retry then Retry) gives the boot bar, the loading card and the Retry panel the owner the UX assumed. A3 (`confirmPressed`) implements EXPERIENCE's "jump or confirm, replays only" skip. A4 (margin dressing, then plain bands) matches "wide windows put the HUD over extra backdrop".
- **Performance needs are covered.** The overlay animates only opacity and transform and touches the DOM only on change (both documents); first input in 10 s and the 16.7 ms frame are architecture budgets with Epic 6 checks.
- **Browser constraints** (gamepad gate leaves audio locked, fullscreen refused without activation, Esc leaving fullscreen, iframe focus, storage partitioning, page scrolling, the 1280 × 720 embed) are all routed to the Epic 6 private-upload checks in both documents.
- **The UX validation report's findings are resolved in the final spines:** the High one (no owner for the Epic 0 overlay values) by F9 and story 0.14; the Mediums by the UI timings table (M2), pause during story moments (M5), the mute indicator's owner (M6), the module map (M8) and the Harrowmere and ninth-bell journeys, which reach Settings, the confirm dialog and the Level 3 ending.

### Alignment Issues

| # | Issue | Severity | Owner |
| --- | --- | --- | --- |
| U1 | `EXPERIENCE.md` `hud-warden-bar` says "the notch marks 15 of 30 HP". After G2 the GDD says half health, with 30 HP a starting guess (†) retuned in story 4.15. `DESIGN.md` ("at the half mark") and story 4.5 are already current. | Low | Story 0.14's `gds-ux` Update |
| U2 | G2 added two cue pairs (hub-open sound with the hub glow; blocked splash sound with the splash). They follow EXPERIENCE's "audio has a visual twin" rule and story 4.14 builds them, but the spine's Accessibility Floor lists only the weapon warning and the warden warnings. | Low | Story 0.14 (optional mention) |
| U3 | The spines cite `gdd.md` by line, and the GDD has grown since: citations now point about 10 lines early (e.g. the loading-card floor is cited as gdd.md:647, now at line 658). | Low | Story 0.14 |
| U4 | Known spine inconsistencies (X-C6): advance-hint inset (`safe-margin` in the frontmatter, `spacing.2` in the Components table), `display-xl` without a pixel floor, mute indicator vs error-panel stacking order, scrim and panel fade durations (0.2 vs 0.15 s while DESIGN says the scrim "fades with its panel"), no visual spec for the loading card's replay hint, plus the title menu's wordmark and the Retry panel's boot-failure line. | Low, owned | Story 0.14, inside Epic 0's exit criterion |

### Warnings

- **Overlay values are placeholders until Epic 0 closes** (DESIGN.md D1, F9): every colour, typeface and size is a grey stand-in. This is deliberate; story 0.3 emits the tokens with a drift test and story 0.14 replaces the values, and Epic 0 cannot exit until DESIGN.md carries them with every contrast target met. Epic 1's placeholder HUD therefore depends on 0.14 being done, which the epic order already guarantees.
- **No architectural gaps for UX were found.**

## Epic Quality Review

**Method.** A script checked all 132 stories for structure, size and every reference to a later story or epic (157 references in 72 stories). Five independent reviewers then read the stories in full (E0; E1; E2–E3; E4–E5; E6), classified each reference, and reviewed sizing, acceptance criteria, data timing and contradictions with the sources. Every Major finding that changes behaviour or a settled document was re-checked against the text before it went into this report (0.2 budget groups, 0.6 swatches, 1.11 smoke check, 1.23 results freeze, 3.7 size, 3.13 card 5, `regionEntered`, 4.2 arena camera, 5.2 piercing shot, 6.10 journey walk). Line numbers are `epics.md` lines.

### Epic Structure

| Epic | Player / user value | Independent of later epics | Exit criteria verifiable |
| --- | --- | --- | --- |
| 0 Reference and style lock | **Developer-facing technical milestone.** By BMad's standard this is a technical epic. It is required by CLAUDE.md ("nothing visual is built before the style reference exists") and ends in something the developer opens and judges, so it is an accepted deviation, not a defect. | Pass. External blockers only: the image model (not chosen) and tool budgets. | Yes (0.15 sign-off; token and contrast tests) |
| 1 Grey-box core | Yes: grey-box Level 1 playable start to finish | Pass | Yes (1.28 turns the exit into checks) |
| 2 Hero | Borderline: mostly a pipeline proof, though Rowan visibly replaces the capsule | Pass | Yes (2.11) |
| 3 Level 1 vertical slice (MVP) | Yes: gate → intro → Emberwood → results, with nothing from Epics 4–6 | Pass | Yes (3.21 tally, 3.22 approval) |
| 4 First warden | Yes, through a dev URL until Epic 5 joins the arena to Level 2 | Pass | Yes (recorded no-damage run replayed in Vitest, 4.15) |
| 5 Levels 2 and 3 | Yes: version one plays start to finish without Epic 6 (first play vs replay from in-memory progress) | Pass | Yes (5.18) |
| 6 Wrap and release | Yes | Pass | Yes (6.19, 6.22, 6.23) |

### Dependency Analysis

**References to later stories or epics (157 scanned):** 78 pointers (a later story replaces or extends something this story finishes on its own), 77 scope notes, 2 dependencies. The reviewers found 4 more dependencies the scan missed. **None crosses an epic boundary**; all six are inside an epic and are fixed by moving one acceptance criterion.

| # | Story | Needs | Fix |
| --- | --- | --- | --- |
| D1 | 1.2 (l.1310, 1314) | The manifest script and its `--release` flag, specified in 1.3 | Move the manifest clauses to 1.3 |
| D2 | 1.11 (l.1746–1747) | A playable level in the production build. The startup level is `test-movement` (1.3, l.1359), which the release build strips (1.2); the first shipped level is Emberwood in 1.26 | Run 1.11's pause and gamepad-failure checks against the dev server; add the production-build run to 1.26 |
| D3 | 1.17 (l.2022) | An enemy that survives a hit (first in 1.19, the 2-HP spitter) | Move the flash check to 1.19 (1.19 l.2099 already covers it), or add a test-only spot |
| D4 | 1.21 (l.2187) | Something visible or audible for the weapon-warning sign-off (blink in 1.22, sound in Epic 3) | Move the sign-off to 1.22; keep the emission test in 1.21 |
| D5 | 4.10 (l.4576) | The hub glow that 4.11 builds into the model | Move the hub open/shut check into 4.11, or swap the order |
| D6 | 6.10 (l.6138) | The full Ines journey, whose step 3 needs 6.12 (restart confirm) and step 6 needs 6.11 (stagger, "New best") | Limit the walk to its own steps, as 6.9 does; the full walk is in 6.16 |

### Special Checks

- **Starter template:** the architecture specifies a scaffold; story 0.1 performs it (pinned `create-vite`, mise, Makefile front door, layer-boundary lint, log module, LFS, README). Pass.
- **Greenfield setup:** dev environment and build pipeline come first (0.1 toolchain; 0.2 budget checks in `make build`). Pass.
- **Data creation timing:** clean. World fields, config keys and save fields arrive with the story that first needs them. One accepted exception: 1.1 declares the architecture's full `SimEvent` union (AR68) upfront, because the architecture mandates it.
- **Story structure:** all 132 stories have As a / I want / So that, a Requirements line and matched Given/When/Then. Median 43 lines, at most 8 Given blocks. 83 player stories, 48 developer stories, 1 device-note story.

### 🔴 Critical Violations

**None.** No technical epic is without justification, no dependency crosses an epic, and no story is impossible to complete. (The E2–E3 reviewer rated the per-enemy model stories Critical as "epic-sized"; this report rates them Major, Q8, because the pipeline is proven by then and each enemy has 2 to 4 clips.)

### 🟠 Major Issues

| # | Where | Issue | Fix | Fix before |
| --- | --- | --- | --- | --- |
| Q1 | 0.2 (l.654–656); 1.3, 1.26, 1.27, 3.5 | **The budget check fails the build on files it has no group for.** "A shipped asset that fits no group fails the build", but the groups cover only kind prefixes plus "JavaScript and CSS bundles as code": `index.html`, level JSON, `manifest.json` and `icon-*` files fit none. 0.2's own "code-only build passes" AC fails on `index.html`; `make build` fails from 1.3 on. | Add groups or exemptions (HTML, level data and manifest, icons) with tests; the developer sets their budgets inside the 30 MB total | Epic 0 (0.2) |
| Q2 | 4.2 (l.4160–4161); architecture l.450 (A4/G1); GDD l.316 | **The arena camera can't "hold still" by the stated mechanism.** The camera clamps only at level edges, and the arena's door side opens onto the rest of the level (start, pickup and checkpoint come first). With look-ahead, Rowan near the door pulls the warden out of view; 4.2's own "camera doesn't move" test can't pass. | Add an explicit arena camera clamp in `sim/camera.ts` from `arenaEntered` until respawn or level end, with tests; record it in the architecture | Epic 4, via `gds-correct-course` |
| Q3 | 4.2 (l.4145–4150), 4.4 (l.4254–4260) | **Warden rules left open after G2.** (a) Which wins when a shot overlaps the body and the open hub (the hub sits inside the body), and where the hub sits on it. (b) Nothing proves the open hub can be hit from the floor and from each ledge. (c) Damage lands only while the hub is open, which is only in a gap, so health always crosses half during a gap. What happens to the rest of that gap and window is undefined, and 4.4's "crossing while an attack runs" test can only be reached by forcing state. | State hub-over-body precedence; add a reachability search test; define the phase-1 → phase-2 sequence (e.g. flinch, full phase-2 gap with a new window, then the wheel wash) | Epic 4 |
| Q4 | 5.2 (l.4931) | **The piercing shot contradicts the hub rule:** "hits the warden once per shot". | The piercing shot follows 4.2's rule: 1 damage on the open hub only; on the body or shut hub it splashes off (`wardenShotBlocked`). Unit-test each case | Epic 5 |
| Q5 | 1.23 (l.2248) with 1.4 (l.1399) | **Clear time is not final when results start.** Events reach the app only after the frame's steps (up to 5 per frame), so up to 4 more steps run after `levelCompleted`: `clearSteps` keeps counting and Rowan can still be hurt. The outcome depends on frame timing (against NFR4). | Freeze the World on the step `levelCompleted` fires; test with a 5-step frame | Epic 1 |
| Q6 | 1.6 (l.1512), X-B1 | **The tap-jump feel test has no defined input.** The reviewer computed (not ran) that a tap shorter than one step peaks at about 0.63 tiles, outside the 0.75–0.90 range, while one held step gives about 0.84. An agent could retune a proven number to pass. | Define the tap as held for exactly one step; state the expected result for a sub-step tap | Epic 1 |
| Q7 | Several | **Things used but never built:** `regionEntered` emission (used in 3.15 and 5.16; a simulation rule with no story or test); enemy clip tables (3.7–3.9; Epic 2 builds only the hero's); the warden-level compile validation (4.2 uses it, and Epic 1's validation rejects a level without an exit, so 5.4's compile fails); the `AudioAnchor` Tiled class (4.14); the kit-origin rule in `optimizeModels.ts` (3.2 says "still rejects", but 2.6 checks only characters). | Give each an owning story with ACs and tests (mirror 2.9 for clip tables) | The epic that first uses each |
| Q8 | 0.1, 2.4, 3.2, 3.7–3.9, 4.2, 4.3, 4.7, 6.18 | **Oversized stories.** 3.7–3.9 each run one enemy through the whole pipeline Epic 2 spread over 11 stories, with several approval gates. 3.2 bundles kit art, a new origin rule, dressing, margin, instancing, budgets and a critic loop. 4.2 and 4.3 (with Q2–Q3 added) are each more than one session. 4.7 carries the `confirmPressed` input plumbing. 0.1 spans a dozen deliverables. 6.18 bundles a trivial title swap with an open-ended backdrop. 2.4's fallback branch turns a rig story into a model rebuild. | Split as the reviewers propose: 3.7–3.9 into model then rig and clips; 3.2 into kit and export then dressing; 4.2 into arena and camera then body and hub; 4.3 into scheduler and wave then millstones; `confirmPressed` into its own story; 0.1 into 2–3; 6.18 into title then backdrop; 2.4 fallback re-runs 2.3 | At story creation |
| Q9 | 0.4, 2.2, 3.7–3.9, 3.15–3.18, 3.22, 4.15 | **No stop rule where money or scarce people are involved.** Image regeneration "within the tool budget" with no stop when it runs out (0.4) or no cap (2.2). No route if Tripo's terms were refused, and no concept approval before spending credits on enemies (3.7–3.9). No stop if the audio terms forbid commercial use, and **no story where the audio tools are chosen** (GDD: "Audio tools, Epic 3, not chosen"). The playtest re-test loop is uncapped (3.22), and tester recruiting is unplanned (4.15). | Add "stop, report spend and failing rules, developer decides" ACs; add an audio-tool decision before 3.15; cap re-tests at one, then `gds-correct-course` | The epic concerned |
| Q10 | 3.15 (l.3722), 3.13–3.14 | **Asset bundles are unassigned.** The architecture loads each level's assets behind its loading card, but Emberwood's music plays from the gate through the intro, and the card shapes are needed before any level loads. No story says which bundle music, effects, cards, enemies or pickups go in. | State shared vs level bundle per asset kind | Epic 3 |
| Q11 | 3.13 (l.3624–3625); narrative design | **Story content contradicts itself:** card 5 shows "Maldrek and Elin receding down a path", but the next AC says "Elin only on cards 3 and 4". The reviewer reports the narrative itself disagrees (narrative-design.md:834 vs :1051). | Settle through the narrative workflow or `gds-correct-course` | Epic 3 |
| Q12 | 0.6, 0.8, 0.10, 0.12, 1.22, 3.11, 3.14, 6.19 | **Checks without a way to run them.** Look-dev Playwright checks have no `make` target and never re-run. The gate (3.11) and intro (3.14) break Epic 1's Playwright specs and the debug URLs, with no dev bypass. 1.22's reduced-motion HUD check has no DOM test environment and no way to set `reducedMotion` before Epic 6. 6.19's "hold 60 fps" has no pass mark per stretch and no way to measure the warden fight alone. | Name a look-dev check target; add a dev-only gate/intro bypass for debug URLs; make HUD animation decisions a pure, Vitest-tested function; give 6.19 numbers and a segment split in `?perf=1` | The epic concerned |
| Q13 | 1.14 (l.1857), 1.1/1.18, 1.25 | **Rules left open in the grey-box core.** On respawn and pit return: does the camera snap or glide; are shots and seeds in flight cleared; what if no stable ground has been recorded yet ("nothing else is reset" also contradicts 1.21's weapon return). "Same seed in Node and the browser" has no browser check. Whether 1.25's metric and coverage checks apply to `test-*` levels (`test-movement` has 5-tile gaps). | Decide and state each, with tests | Epic 1 |
| Q14 | 0.6 (l.834) | After 0.5, swatches are compared with `docs/STYLE_GUIDE.md`, but the tokens must still equal DESIGN.md's placeholder greys (0.3's drift test) until 0.14. Every swatch "mismatches", and the obvious fix breaks 0.3. | Say differences from the style guide are expected until 0.14, as 0.8 does for fonts | Epic 0 |
| Q15 | 6.17, 6.18, 6.21 | The in-game credits decision (6.17) comes before 6.18 adds backdrop assets and 6.21 adds butler, neither of which checks for a credit requirement. 6.21 also has no path for a failed butler push and doesn't say the developer, not the agent, supplies the key. | Re-check licences in 6.18 and 6.21; add the push-failure path and the developer's key step | Epic 6 |

### 🟡 Minor Concerns

- **Epic 0:** 0.3's contrast-check input interface is unspecified, and DESIGN.md's `note` attribute would be emitted as a CSS property. The texture-memory estimate method is undefined (0.6), though 0.12 gates on 256 MB. Render budgets are used in 0.6 and 0.11 before 0.12 creates the table. "Warm family" slot checks (0.7, 0.9) are not testable as written. 0.8's "no fallback glyph, checked by eye" could be automated. 0.10 tests only width-limited window sizes. 0.12's "sustained stretch" has no duration. The LFS quota check should be unconditional in 0.1. Epic 1's header expects "the HUD icon set" from Epic 0, which only records the icon style. X-B36's `make test` scope doesn't match 0.1's Vitest scope.
- **Epic 1:** 1.2's piece kinds and neighbour rules are undefined and untested. "Epic 0's hazard material" doesn't exist (0.9 has no hazard material). Hit-stop on simultaneous events should take the larger value, and death "adds trauma" contradicts "never adds" (1.17). 1.10 "nothing else resumes play" conflicts with 1.11. The debug overlay list omits platforms, checkpoints and the exit (1.15). Camera clamping for levels smaller than the view is undefined (1.8). Spit presses during cooldown: buffered or dropped (1.12)? Spitter edge cases are missing: Rowan leaving range mid-swell, a full seed pool (1.19). Pickup box sizes have no sign-off (1.20). 1.15 should split out the input recorder.
- **Epics 2–3:** clip-step `CONFIG` keys are used before any story adds them (2.5, 2.8). 3.12 says "new module" for `content/storyText.ts`, which 0.13 already created. 3.3 re-adds spots from 1.26. The Epic 3 exit says "4 of 5 (or 3 of 3)" while 3.21 and 3.22 add X-B31's "3 of 4". Enemy visibility and the glade's safety could be automated (3.1, 3.4). The spit-volley sound needs a unit test (3.16). No story owns the final look of shots, seeds and kill bursts. 3.19 needs debug commands for the meter and weapon time. Icons have no budget group (see Q1).
- **Epics 4–5:** the no-damage recording breaks when the RNG seed or spawn changes; re-record after 4.15 tuning and after 5.4. `rowanChange` and new cues move off the architecture's timetable (4.7) and need recording there. 4.10 says "no Drowned Mill look data yet", but 0.7 made it. The "grant ledge grab" cheat promised in 1.15 is never built. "Ready for the crack and shatter" (4.11) and "room left for Epic 5" (4.10) can't be checked. Regrab during knockback is unspecified (4.6). 5.18 has no timer for "story counted, pauses excluded". 5.14's comparison with intro card 1 has no pass criterion. 4.6 and 5.6 re-specify built behaviour; mark them "verify unchanged".
- **Epic 6:** cross-field save consistency isn't validated (6.2). The recorder buffer has no capacity rule (6.15). Smoke checks don't re-run after 6.16. Seeded saves on the production build have no mechanism (6.16), and the Tomás journey needs a gamepad `Depends on`. Trademark searches don't say who searches (6.17). P/Start and auto-pause inside Settings over pause are unspecified (6.12, 6.13). 6.9 and 6.14 restate built behaviour. **Guess, untested:** itch.io may serve HTML5 games from a shared origin, so `emberbound.save` could collide with another game's key; check in 6.22, since renaming is free before release.

### Open Developer Decisions

These are choices the stories leave to Emilijan beyond † tuning. None is a defect, but several block a specific story.

| When | Decision |
| --- | --- |
| **Before Epic 0** | **Image model** and its commercial terms (blocks 0.4; CLAUDE.md forbids choosing it silently). **Tool budgets** (0.4, 2.1). Budget groups and values for HTML, level data, manifest and icons (Q1). |
| **Epic 0** | The style; hero concept changes; 16 overlay colours and 3 typefaces; perspective or orthographic camera and its margin; shadows (directional or blob); card-shape source and the cards' warm-light exception; the X-C6 items in 0.14. |
| **Before Epic 1** | **Who writes the `.tmj` levels**: the agent writing Tiled JSON by hand, or Emilijan in Tiled. This matters most for Emberwood (1.26) and its jump marks. Also the piece-kind set; tap-jump input definition (Q6); respawn camera and projectile reset (Q13); spit buffering during cooldown; hit-stop on simultaneous events. |
| **Epic 2** | Which Blender MCP server and Blender version; the bone naming convention; the palette-slot convention in glTF. |
| **Before Epic 3** | **Audio tools and formats** (blocks 3.15–3.18); asset bundle placement (Q10); a dev bypass of gate and intro (Q12); Elin on card 5 (Q11); backdrop method; playtest recruiting and re-test policy. |
| **Before Epic 4** | Arena camera lock (Q2); hub precedence and position; phase-2 handover (Q3); how dodge tests vary the seed without a test-only path in the simulation; who makes the crack and shatter assets. |
| **Epic 5** | Piercing shot against the warden (Q4); held-beat trigger location. |
| **Before Epic 6** | Reference test machines; release-success measurement (both due "before Epic 6" in the GDD); final title candidates; itch.io account and butler key. |

### Best-Practices Checklist

| Check | E0 | E1 | E2 | E3 | E4 | E5 | E6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Delivers player/user value | Developer (accepted) | ✓ | Borderline | ✓ | ✓ | ✓ | ✓ |
| Functions independently of later epics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Stories appropriately sized | 0.1 large | 1.14, 1.15 borderline | 2.4 fallback | 3.2, 3.7–3.9 large | 4.2, 4.3, 4.7 large | ✓ | 6.18 |
| No forward dependencies | ✓ | 4 small (D1–D4) | ✓ | ✓ | 1 small (D5) | ✓ | 1 small (D6) |
| Data structures created when needed | ✓ | ✓ (AR68 accepted) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Clear acceptance criteria | Mostly (Q1, Q12, Q14) | Mostly (Q5, Q6, Q13) | ✓ | Mostly (Q7, Q9–Q11) | Mostly (Q2, Q3) | Q4 | Mostly (Q15) |
| Traceability to requirements | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Summary and Recommendations

### Overall Readiness Status

**NEEDS WORK.** Planning is unusually complete. Every one of the 782 requirements traces to a story, the UX spines and the architecture agree, no epic depends on a later one, and there are no critical violations. **Epic 0 can start once two external decisions are made and three Epic 0 stories are corrected.** The 15 major issues are real but bounded: most are wording or a missing acceptance criterion, and four need a settled document changed (arena camera, warden hub rules, piercing shot, intro card 5). No code exists yet, so fixing them now costs least.

### Critical Issues Requiring Immediate Action

There are no critical violations. These block Epic 0 itself:

1. **Choose the image model** and log its commercial terms in `docs/ASSETS.md`. The GDD says "before Epic 0 starts"; story 0.4 can't run without it, and CLAUDE.md says not to choose it silently.
2. **Set the tool budgets** (0.4's regeneration limit, 2.1's Tripo plan).
3. **Fix story 0.2's budget groups (Q1).** As written, `make build` fails on `index.html` in 0.2 itself and on level data, the manifest and icons from 1.3 on.
4. **Fix stories 0.4 and 0.6 (Q9, Q14):** add a stop rule when the image budget runs out, and say that look-dev swatches are expected to differ from the style guide until 0.14.

### Recommended Next Steps

1. **Make the Epic 0 decisions above:** image model, tool budgets, and budget groups and values for HTML, level data, manifest and icons.
2. **Run one `gds-correct-course` pass now** for everything that changes a settled document or more than one story:
   - **Architecture, GDD, stories 4.2 and 4.4:** an explicit arena camera clamp (Q2); hub-over-body precedence, a hub reachability test and the phase-1 → phase-2 sequence (Q3).
   - **Story 5.2:** the piercing shot follows the hub rule (Q4).
   - **Narrative design and story 3.13:** whether Elin appears on intro card 5 (Q11).
   - **Architecture (asset management):** shared vs level bundle per asset kind (Q10); budget groups (Q1).
   - **`epics.md`:** owning stories for `regionEntered`, enemy clip tables, warden-level validation, `AudioAnchor` and the kit-origin rule (Q7); the six dependency moves D1–D6; the results freeze (Q5); the tap-jump input (Q6); respawn resets and test-level scope (Q13); stop rules, an audio-tool decision before 3.15 and a capped re-test (Q9); the look-dev check target, a dev bypass of gate and intro, and HUD animation as a pure function (Q12); credits and butler (Q15).
   - **`requirements-inventory.md`:** refresh FR27, FR84–FR86, FR90, FR91, FR93, FR94 and add the hub weak point; refresh the AR items behind A1–A10 (`confirmPressed`, `AudioFade`, the warden events); fix the FR204, FR207 and NFR11 map tags.
   - **`project-context.md`:** add PR30 (reject scope growth unless the developer asks) and AR248 (follow the closest pattern and flag it in the story's notes).
3. **Leave story splits and minor items to `gds-create-story`,** story by story: 0.1, 2.4's fallback, 3.2, 3.7–3.9, 4.2, 4.3, 4.7's `confirmPressed` and 6.18 (Q8), plus the Minor list. They don't change any other document.
4. **Fold U1–U4 (UX spine drift) into story 0.14's `gds-ux` Update,** which already owns X-C6.
5. **Before Epic 1, decide who writes the Tiled levels:** the agent writing `.tmj` JSON, or the developer in Tiled. It shapes 1.2, 1.26 and every level story after.
6. **Then run `gds-sprint-planning`** to generate `sprint-status.yaml`, and `gds-create-story` for story 0.1.

### Final Note

This assessment found **no critical issues and 15 major issues, plus 6 small within-epic dependencies, 8 low-severity documentation issues** (inventory drift, coverage-map tags, rules not in `project-context.md`, UX spine drift) **and about 45 minor items**, across four categories: traceability, UX alignment, epic structure and dependencies, and story quality. Fix the Epic 0 blockers before implementation starts, and the rest before the epic that needs each one. The findings can also be accepted as-is: the reviewers judged every epic independent and every exit criterion verifiable, so going ahead with story-time fixes is a defensible choice, at the cost of reopening settled documents mid-epic.

**Follow-up (2026-11-13):** the items in Recommended Next Steps 2 were applied through `sprint-change-proposal-2026-11-13-readiness.md` (approved). Two corrections to this report: the FR204, FR207 and NFR11 coverage-map "typos" are grouped ranges and need no change; D2 was resolved by a placeholder `emberwood.tmj` from story 1.3 instead. Still open before Epic 0: the image model and the tool budgets.

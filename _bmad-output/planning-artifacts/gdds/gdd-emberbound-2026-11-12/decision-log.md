# Decision log: Emberbound GDD

Canonical record of decisions, changes and version transitions made while writing the GDD. Newest entries at the bottom.

## 2026-11-12

- **Intent: create.** Started with `gds-gdd`. No earlier GDD existed. Workspace: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/`.
- **Inputs:** the final game brief (`briefs/brief-emberbound-2026-11-12/brief.md`), its `addendum.md` and decision log, and the planning doc `docs/PROJECT_BRIEF.md` (design defaults, tuning numbers, milestones M0 to M6, asset pipeline).
- **Carried in as settled (from the brief):** vision, core fantasy, primary audience (35 to 55, grew up on arcade and console platformers) winning over the secondary, the three pillars, the three-tier core loop, MVP (Level 1 with final art), version one (Levels 1 to 3, one warden, 20 to 30 min, free in the browser on itch.io), audio direction, the rule that warm light belongs only to the hero, embers and lanterns.
- **Carried in as settled (from the planning doc):** the prototype tuning numbers. Not to be retuned without the developer.
- **Game type proposed: Action Platformer** (high complexity). Signals: side-scroller, variable jump, ranged attack, stage-and-boss structure. Metroidvania considered and rejected: linear levels, no interconnected world or ability gating. Pending the developer's confirmation.
- **No narrative flag** on the action-platformer genre guide; `needs_narrative` not set.
- **Game type confirmed: Action Platformer.** The action-platformer genre guide fills the type-specific section. Required for this genre: movement feel table, combat specs, level gating, checkpoint cadence, difficulty curve.
- **Working mode: Express.** Remaining gaps go to the developer as one batch with a recommended default for each; then the full draft.
- **Prototype extraction** (`prototype/sprout-demo.html`, by a subagent; facts, not decisions):
  - Two enemy types: a stompable walker (1 HP, 1.6 t/s) and a thorny flyer (1 HP, shots only).
  - Contact costs 1 heart. Knockback 6 / 9 (11 from spikes), 0.28 s with no control, hit-stop 0.06 s.
  - A pit kills instantly. At 0 hearts the hero respawns at the last checkpoint with 3 hearts. No lives, no game over.
  - Killed enemies stay dead; pickups go back on respawn. Checkpoints do not heal.
  - Triple shot: ±0.16 rad spread, 20 s.
  - Crouch only lowers the shot origin; drop-through is down + jump.
  - Level: 146 × 18 tiles, 2 checkpoints, all 15 teaching beats in order.
  - Camera shows at least 19 × 10.4 tiles. Holding spit auto-fires at the cooldown rate.
  - Touch controls exist in the prototype.
- **Batch answers: "all recommended".** Accepted as decisions:
  1. **Warden placement:** end of Level 2 (the Drowned Mill). The first seal breaks there, and Level 3 is played in Rowan's changed form with the new ability. M4 builds the warden in a standalone arena; M5 builds Level 2 up to the arena door. Level 3 ends version one without a boss: a final mixed-enemy stretch through Harrowmere, then a closing story card. Resolves the brief's open question on where the warden sits.
  2. **Fail rule:** the prototype's rule, with one change.
     - Kept: 1 heart per hit, knockback, 1.3 s invulnerability. At 0 hearts, respawn at the last checkpoint with 3 hearts. No lives, no game over. Killed enemies stay dead; pickups go back.
     - Changed: a pit costs 1 heart and returns Rowan to the last solid ground, instead of killing him outright.
  3. **Embers heal:**
     - Every 50 embers restore 1 heart. At full hearts the meter stays full and refills the next heart lost.
     - Embers also trace jump arcs.
     - About 100 to 150 per level. No shop; checkpoints do not heal.
  4. **Third Level 1 enemy: rooted spitter.** Stationary, 2 HP, thorned (no stomp). Swells for 0.5 s, then fires a slow seed (5 tiles/s) at chest height every 2.5 s. Crouching ducks it.
  5. **Warden structure:**
     - One-screen arena (19 tiles) with a checkpoint at the door.
     - 30 HP; each ember hit does 1.
     - 2 phases: phase 2 at 15 HP, faster and with one new attack.
     - 3 attacks, each warned at least 0.6 s ahead and dodged with existing moves: a ground sweep (jump), falling debris marked by shadows (walk away), a charge (jump over).
     - Target 60 to 120 s. The warden concept is drafted for the developer to rework.
  6. **First seal ability: ledge grab.** The first change is a human hand, and the hand can grip. Adds 2 hero animations (hang, climb). Level 3 is built around it. Double jump and charged shot rejected.
  7. **Weapon pickups (version one):**
     - Triple shot, introduced in Level 1: 3 shots spread ±9°, 20 s.
     - Piercing shot, introduced in Level 2: double range, passes through enemies, 20 s.
     - A new pickup replaces the current one. Pickups are lost on death; a timer bar shows on the HUD.
  8. **Stomp kept.** An enemy with thorns or spikes cannot be stomped; anything else can.
  9. **Crouch:**
     - Holds Rowan in place. Hurtbox 0.92 to 0.6 tiles tall (new number, a guess, tune in M1). Shot origin 0.3.
     - Down + jump drops through one-way ledges.
     - Changes the prototype, where Rowan could run while crouched and the hurtbox did not shrink.
  10. **Bells:** 3 per level, counted on the results screen and the level select. All 9 in version one unlock one extra story card at the end (a memory of Elin).
  11. **Touch controls:** not in version one. Phones show a "play on desktop" note.
  12. **Ending:** deferred. Settle it with `gds-create-narrative` before M5 writes the Level 3 closing card. The GDD records the constraint (Elin takes part) and the three candidates.
- **Defaults accepted:**
  - **Level length:** 6 to 8 min per level on a first play, 3 checkpoints per level plus one at the warden door. Level 1 about 2.5× the prototype's 146 tiles (estimate).
  - **Saving:** auto-save after each level. The level select shows cleared levels with best time and bells. Leaving mid-level restarts that level.
  - **Results screen:** clear time, bells n/3, respawns, embers. No score.
  - **Settings (M6):** music volume, effects volume, reduced motion (shake off), fullscreen. No key remapping in version one.
  - **Prototype feel extras:** hit-stop 0.05 s on a stomp and 0.06 s when hurt; knockback 6 / 9; 0.28 s control lock.
  - **Performance (guessed targets; reference hardware to be named by the developer):**
    - 60 fps sustained in Chrome, Edge and Firefox on a 2020-era laptop with integrated graphics at 1080p. Safari best-effort.
    - Download ≤ 30 MB; playable within 10 s on 50 Mbit/s.
- **Drafting the full GDD** (Express).
- **Full draft written:** `gdd.md` (all template sections plus a Story Delivery section) and `epics.md` (Epics 0 to 6 from milestones M0 to M6, with draft stories and a coverage check).
  - Convention: numbers marked † are starting guesses to be tuned in the named epic. Unmarked numbers come from the prototype or from decisions in this log.
  - Ten `[ASSUMPTION]` tags and two `[NOTE FOR DESIGNER]` callouts are indexed at the end of `gdd.md`.
- **Finalize step 1, decision log audit:** every batch decision and accepted default is captured in `gdd.md` or `epics.md`. One gap found and fixed: the settings list was missing from Technical Specifications and is now added.
- **Finalize steps 2 and 3 started:** two reconciliation reviewers (game brief, planning doc) and one discipline validator, run in parallel.
- **Finalize steps 2 and 3, reviews returned:**
  - **Game brief reconciliation:** 8 gaps (Epic 3 exit lost "wants Level 2" and the Rowan check; player-feel targets, vision statement, elevator pitch, first-two-minutes claim, risks section, USP comparisons, reference "leave" items, market and budget). Risk 2 contradicted: the image model is listed as an Epic 0 story but must be chosen before Epic 0.
  - **Planning doc reconciliation:** 8 gaps (Rowan's goal, backstory, legal constraints, Levels 4 to 6 and the warden-to-level mapping, the hero's small-figure readability, critic loop steps, enemy deform check, reference prompts). All 16 tuning numbers and all 15 Level 1 beats intact.
  - **Discipline validator:** 24 findings. Among them: arena ledges at 4 tiles are unreachable (jump peaks at 3.30); the stomp synergy claim is false; "1-tile step with a tap" is impossible; the Level 2 tune is needed in Epic 4 but made in Epic 5; the performance pass mark allowed 50 fps; control prompts undefined; warden attack order and sizes undefined; Rowan's form on replays contradicts pillar 3; session flow undefined.
  - **Prototype facts re-checked** in the source: shake is a trauma level (offset 2 × trauma² tiles, decays 1.6/s); the invulnerability blink is 9 Hz; the apex multiplier replaces the fall multiplier.
- **Autofixes queued; 7 design questions plus the assumption list put to the developer** (Finalize step 4 folded into the same batch).

## 2026-11-13

- **Review batch answers: "all recommended".** Accepted as decisions:
  1. **Control prompts:** the first time each action is needed, a small sign in the scenery shows the key or button icon for the device last used, with no words. About 6 in Level 1, none after. They never cover the play area. As icons, not text, they are exempt from the text rules of pillars 1 and 3.
  2. **Warden details:**
     - **Order:** phase 1 alternates wheel wash and millstone fall; phase 2 cycles wash, millstones, roll.
     - **No overlap:** the gap between attacks (2.5 s, or 1.8 s in phase 2) counts from the end of the previous attack.
     - **Millstones:** one targets Rowan's position when the warning starts; the rest are at least 2 tiles apart, always leaving a 3-tile clear gap.
     - **Size and roll:** warden 3 × 4 tiles † at the arena's right side, with its body as the hurtbox. The roll curls it into a 2 × 1.5 wheel that rolls to the far wall, then it walks back.
     - **Pickup before the door:** triple shot.
  3. **Playtest pass marks:**
     - Epic 3: at least 4 of 5 testers (or 3 of 3) finish Level 1 without help, and a majority both want to play Level 2 and can say who Rowan is and what he wants.
     - Epic 4: at least 4 of 5 testers win within 5 attempts.
  4. **Replay form:** a replay uses the form and abilities Rowan had on first arrival in that level. Levels 1 and 2: full beast, no ledge grab. Level 3: changed, with ledge grab. This reverses the draft's "ledge grab permanent on replays", which contradicted pillar 3.
  5. **Session flow:**
     - The title screen offers Continue (the next unfinished level, or the level select when everything is finished) and Level select.
     - The level select lists finished levels plus the next unlocked one.
     - A ninth bell found on a replay plays the all-bells card after that level's results; the card can be watched again from the level select.
  6. **Difficulty caps (†):** most enemies on screen at once 2 / 3 / 4 for Levels 1 / 2 / 3; challenge-tier jumps 0% / up to 10% / up to 20%.
  7. **Version one's closing card** must deliver Rowan facing Harrowmere (his first payment for what he did) and a sign that Elin is acting on her own. Content is written in `gds-create-narrative`.
  8. **All ten draft assumptions confirmed:** 3 enemy types reused with the level palette; warden returns to full HP on respawn; seal break skippable only on replays; bells reachable with first-arrival abilities; waterwheel platforms on a circular path that stay level; intro of 5 or fewer cards, 60 s at most, skippable; warden music from the Level 2 tune and title music from the Level 1 tune; a 2020-era laptop with integrated graphics as the reference machine, with actual machines named before Epic 6; the proposed exit criteria for Epics 4 to 6; English only.
- **Autofixes applied** (validator and reconciliation findings):
  - **Reachability:** arena ledges from 4 to 3 tiles; stomp synergy claim removed; a 1-tile step needs a short hold; ledge grab hand point at the top of the hitbox, reach 4 tiles or less †, verified in Epic 4.
  - **Epics:** the Level 2 tune moves to Epic 4. Epic 1 gains spikes and hit feedback; Epic 0 points at the reference prompts.
  - **Targets and numbers:** performance pass mark is median 16.7 ms and 99th percentile 20 ms or less. Level length becomes a time target, set from the pace measured in Epic 1. Step counts added; shake, blink (9 Hz) and apex rule corrected from the prototype source.
  - **Rule gaps closed:** stomp beats contact; crouch shrinks the hurtbox only; enemy shots get the 0.08 shrink, seed radius 0.12; pit returns are not respawns; a pickup survives a pit fall; expired pickups return only on a checkpoint respawn; the warden stays dormant until Rowan enters.
  - **Restored from the inputs:**
    - From the brief: vision statement, elevator pitch, player-feel targets, dark-fantasy tone, the first-two-minutes claim, the Risks section, USP comparisons and the qualified USPs 3 and 4, form switching in Out of Scope, market and budget.
    - From the planning doc: Rowan's goal, the backstory, legal constraints, Levels 4 to 6 with the warden mapping as an open question, the small-figure hero rule and stage 3, the critic loop definition, the enemy deform check with fallback.
    - The image-model choice moves before Epic 0.
  - **Consistency:** terminology, the asset list, and implementation detail trimmed from `epics.md`.
- **Dropped from the draft:** "Level 1's first 30 s cannot cost a heart". It conflicted with the prototype's early gap over a pit. The teaching pattern (introduce where failure is cheap) covers the intent.
- **Finalize step 4, open items:** all ten `[ASSUMPTION]` tags resolved (confirmed). Two `[NOTE FOR DESIGNER]` callouts remain, neither blocks architecture:
  - warden name, look and story: due before Epic 4 art
  - release-success measurement: due before Epic 6

  Deferred, and recorded under Open Questions and Dependencies in `gdd.md`:
  - the ending (before Epic 5)
  - the mapping of wardens 2 to 6 to levels (after version one)
  - the image model (before Epic 0)
  - art style and hero sign-off (Epic 0, Epic 2)
  - level editor (Epic 1)
  - audio tools (Epic 3)
  - tool budgets (Epic 0)
  - Tripo terms (Epic 2)
  - reference machines (Epic 6)
  - final title (before any public page)
- **Finalize step 5, polish:** no `doc_standards` are configured, so no polish subagents ran. Both files were fully rewritten after the review, with consistent terminology and no stale terms.
- **Finalize step 6, narrative:** the action-platformer guide carries no narrative flag, so `needs_narrative` was not set. `gds-create-narrative` is still needed later: the warden concept before Epic 4 art, and the ending and closing card before Epic 5. It is not the immediate next step.
- **Finalize step 7, external handoffs:** none configured.
- **Status: final.** `gdd.md` and `epics.md` are final for handoff to `gds-game-architecture`.

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

### Update from narrative design (2026-11-13)

- **Intent: update.** Change signal: the narrative design document, `narratives/narrative-emberbound-2026-11-13/narrative-design.md` (complete, moderate complexity), section "Production Planning, Updates the GDD needs".
- **Conflict check:** no pillar, core-loop or tuned-number change, so this is a targeted update, not a rewrite. Four changes alter stated decisions:
  - story cards are no longer "illustrated"
  - Level 3 shows its cards before its results (amends 2026-11-13 item 5, session flow)
  - Level 3 ends with a calm walk to the fallen bell (amends 2026-11-12 decision 1)
  - lantern bell hints only in Emberwood (narrows the Secrets rule)
- **Working mode: Express.** Developer approved all 8 listed changes plus 5 follow-on edits:
  - E1: level lines on the loading card
  - E2: a pointer to the narrative document
  - E3: originality checks for story names and symbols
  - E4: `epics.md` updates for Epics 3 to 5
  - E5: Epic 0 confirms the card style and the cards' warm-light exception
- **Applied to `gdd.md`:**
  1. **Warden:** the placeholder concept and its `[NOTE FOR DESIGNER]` are replaced by the Drowned Miller: who he is, his look, the seal at the wheel's hub, his release, and the unstated link to Rowan. The seal-break bullets gain the wheel stopping, the Miller sinking and the ember flash, and point to the staging in the narrative document. Dependencies row marked done; Open Questions row removed.
  2. **Full-game ending:** decided (candidates 1 and 2 combined). Dependencies row marked done; Open Questions row removed. A new Open Questions row holds the full-game details left open: the final fight without fire, what Maldrek owes, whether Elin is ever playable.
  3. **Story cards:**
     - "illustrated" becomes layered silhouettes built in the engine, with text drawn over the art.
     - The cards-only warm-light exception is pending Epic 0, noted in Story Delivery, the art rules and the Dependencies style-lock row.
     - The Story art asset row notes that no models of Elin, Maldrek or the village are needed.
  4. **Level 3 end order:** held beat, closing card, all-bells card if earned, then results. Added to the results-screen bullet in Session flow.
  5. **Held beat:** added to the Story Delivery rules and the Story moment level type.
  6. **Layouts:**
     - Level 1: a calm exit through the wedding glade (teaching-order table and Level Progression).
     - Level 3: starts at the siege line, and its end gains a calm walk to the fallen fire bell (Level Progression).
  7. **Bell hints:** lanterns only in Emberwood; "gap in the foliage" becomes "gap in foliage or rubble". Bells are Elin's wedding bells in the story.
  8. **Enemy concept:** twisted creatures, the land paying for bargains. Story reason only; no rule change.
  - **E1:** level lines shown on the loading card.
  - **E2:** "How to Read" points to the narrative document. Story Delivery records that the text is written (141 words). The environment kits row points to the story props.
  - **E3:** the originality checks for story names and symbols, added to Originality and Legal Constraints and to Dependencies.
  - Frontmatter `inputs` gains the narrative document.
- **Applied to `epics.md`:**
  - **E5, Epic 0:** the style guide records the story-card style and the warm-light exception (scope and story 3).
  - **E4, Epic 3:**
    - Emberwood story props: glade, waymarkers, foundry chimney.
    - Elin's motif in the Level 1 tune and the bell pickup.
    - The story bullet: the text is final; placeholder silhouettes are acceptable, placeholder text is not.
    - Story 9 updated.
  - **E4, Epic 4:**
    - The warden is the Drowned Miller, with the seal at the hub and the two decals.
    - Originality checks before drawing.
    - The seal-break staging order.
    - The motif in the Level 2 tune and the stinger.
    - Depends-on and story 1 updated.
  - **E4, Epic 5:**
    - Drowned Mill story props.
    - Harrowmere's siege-line start and fallen-bell exit.
    - No lantern hints in Levels 2 and 3.
    - Level 3's music drop-out.
    - The held beat and the end order.
    - Card text final.
    - Depends-on and story 9 updated.
  - **Coverage table:** four rows added.
- **Finalize, step 2: input reconciliation** (a subagent compared the narrative document with `gdd.md` and `epics.md`). No stale statements remained. Fixed:
  - ambience and Elin's motif added to Audio and Music, the asset table and Epics 3 and 5
  - stingers assigned to epics
  - all-bells order on a Level 3 replay
  - intro trigger: once, on the first Continue of a new save
  - "lanterns (Emberwood only)" in the kits row
  - story-name checks added to Epic 6
  - card build rules: a minimum display of about 1.5 s †, the closing and all-bells cards skippable on replays, text drawn over the art
  - a reading time of about 3 s † on the level-line card; loading happens behind it, and the 3 s transition limit applies to loading
  - Epic 5 props: the marked gate, household props, decorative wheels, the millhouse
  - cards use "the game's palettes", not "the level palettes"
  - exit markers sit at the arch and the fallen bell
  - Level 3 order noted in the core loop
  - "the open rows under Dependencies"
  - the narrative document's own held-beat and closing-card contradiction
- **Finalize, step 3: discipline pass** (validator subagent with the checklist and the action-platformer guide). No blockers. Autofixed:
  - the ending's reference to "the first two candidates"
  - "Words used on screen" renamed "Terms approved for on-screen use"
  - "Harrowmere's mark" used everywhere, in the narrative document too
  - the seal-break wording no longer describes how it is built
  - "5 cards" and "7 cards" replace the old maximums
  - bells "left along the road as a trail"
  - Backstory marked as a summary
  - `epics.md` says "story text", not "story text module", and "far-distance layer"
  - the Miller's given name is checked only if it appears on screen, so it is out of Epic 4
  - a guessed length for Level 3's calm walk: 15 to 25 tiles †
  - Session flow gains an explicit end-of-level order
- **Developer decisions on the judgment calls:**
  - **Story moments are safe:** Rowan can't be hurt during the seal break or the held beat, and attacks in progress are removed. A new simulation rule with a unit test (GDD Story Delivery; Epics 4 and 5).
  - **Card shape source:** decided in Epic 0 together with the image model, logged in `docs/ASSETS.md`; about 3 to 5 layers per card †.
  - **Epic 0 renders a sample story card** (intro card 2) on the look-dev page. It sets the palette for story scenes outside levels; if the warm-light exception is refused, the forge glow turns pale and cold.
  - **Story comprehension in the Epic 4 and 5 playtests: left as is.** Only Epic 3 checks comprehension. The Success Metrics measures stay, but they gate nothing.
  - **Not adopted:** checking story names before Epic 3's playtest. The playtest is private, and names appear only in text, which is cheap to change. The check stays before any public build.
- **Finalize, step 4: open items.**
  - No `[ASSUMPTION]` tags.
  - One `[NOTE FOR DESIGNER]` remains: release-success measurement, before Epic 6.
  - Open Questions: release measurement (before Epic 6); the full-game details left open by narrative design (after version one); the open rows under Dependencies.
  - Nothing blocks architecture.
- **Finalize, steps 5 to 7:** no `doc_standards` and no external handoffs are configured. The narrative is already done.
- **Status: final.** `gdd.md` and `epics.md` are updated from narrative design and ready for `gds-game-architecture`.

### Update from UX design (2026-11-13)

- **Intent: update, through `gds-correct-course`.** Change signal: the UX spines, `ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md` and `DESIGN.md` (final), section "Open Questions & Notes for GDD".
- **Conflict check:** no pillar, core-loop or tuned-number change. Two GDD contradictions resolved: settings vs mute (gdd.md:765 against 803: mute is the M key only, D10) and the level line on replays (gdd.md:628 against 647: every load shows the name and line; replays can skip the reading floor, F10).
- **Added:** a pointer to the UX spines as the authority on menu and HUD behaviour; the warden health bar (F1); the bell toast (F2); the mute icon (D7); the boot screen and title gate (D8); the pause menu with "Quit to title" before unlock and the restart and quit confirms (D9); the "New best" tag (D11); auto-pause on blur, fullscreen exit and gamepad loss (D14); the storage notice (D15); "Try anyway" on the phone and tablet note (D16); the wider reduced-motion scope (D17) and its browser default (Q5); the gamepad-unavailable notice (Q7); the credits rule (Q10); the control signs' arcade key set and position glyphs (F6, F3); the interface asset list.

### Update from story creation (2026-11-13)

- **Intent: update, through `gds-correct-course`.** Change signal: the gaps found while `gds-create-epics-and-stories` wrote the stories (`requirements-inventory.md`, triage X-C4 and X-C5). Proposal: `sprint-change-proposal-2026-11-13-planning-gaps.md`, approved 2026-11-13.
- **Tuned-number change, with the developer:** the warden's 30 HP becomes † (it changes only with the developer, who approved it here), tuned in Epic 4 together with the hub window.
- **Developer decisions:**
  - **Warden damage: hub weak point plus windows.** The seal at the wheel's hub (1 × 1 tile †) is the only hurtbox and glows open for 1.5 s † at the start of each gap; body hits splash off. Chosen over raising HP or shortening the 60 to 120 s target, because 30 HP hittable at any time ends the fight in about 5 to 15 s, and a weak point fits the story (the seal is the hub) and pillar 2.
  - **Wheel roll: rolls back** to the warden's side instead of walking back, which Rowan couldn't dodge (3 × 4 body †, 3.30-tile jump, ledges 3 tiles up).
- **Settled without a design choice:** the gap counts from the end of each attack's hazard; phase 2 waits for the current attack to end; millstones keep 2 tiles of clear floor between them and land on the first surface below; on windows wider or taller than 19 × 10.4, the margin shows up to 3 tiles † of level dressing, then plain bands, and the camera holds still in the 19-tile arena.

### Update from the readiness check (2026-11-13)

- **Intent: update, through `gds-correct-course`.** Change signal: `implementation-readiness-report-2026-11-13.md` (NEEDS WORK). Proposal: `sprint-change-proposal-2026-11-13-readiness.md`.
- **Developer decisions:**
  - **Phase 2 starts mid-gap.** Damage lands only while the hub is open, so health reaches half during a gap. The hub shuts at once, the warden flinches (†) and the music shifts, then a full phase-2 gap with its hub window, then a wheel wash. Chosen over letting the current window run out, because it gives the phase change a clear beat and keeps "the window opens at the start of each gap" true.
  - **Elin stays on intro card 5**, receding with Maldrek (narrative design).
  - **Two small budget groups:** level data and manifest 0.25 MB †, interface icons 0.05 MB †; planned total about 29.9 MB (architecture).
- **Settled without a design choice:**
  - The arena camera locks to the arena on entry and holds until a respawn or the level's end. The earlier "holds still in the 19-tile arena" relied on the level edge, which bounds only the far wall.
  - "Phase 2 waits for the current attack to end" could never apply: health drops only during gaps.
  - The hub sits at the top of the body's front face and takes the hit when a shot also touches the body.
  - The piercing shot follows the hub rule against the warden.
  - After a respawn or a pit return the camera snaps to Rowan during the fade, and shots and seeds in flight are cleared.
  - The audio tools and formats are chosen at the start of story 3.15.

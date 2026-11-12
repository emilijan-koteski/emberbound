---
title: "Emberbound (working title) - Development Epics"
gdd: gdd.md
created: 2026-11-12
updated: 2026-11-13
---

# Emberbound: development epics

**What this file is:**

- The detailed breakdown behind the epic table in `gdd.md`.
- Each epic comes from one milestone (M0 to M6) in `docs/PROJECT_BRIEF.md`, the planning doc. Its exit criteria become the epic's acceptance criteria.
- The stories are draft, high-level stories. `gds-create-epics-and-stories` turns them into full stories after the architecture exists.
- How each system is built belongs to the architecture document. This file says what each epic delivers.

**Rules for every epic:**

- An epic starts only when the previous epic's exit criteria are met and the developer approves.
- Every simulation rule gets a unit test.
- After any visual change, the critic loop defined in `gdd.md` (Development Epics) runs.
- Every asset and tool is logged in `docs/ASSETS.md`, including whether the asset is AI-generated.

---

## Epic 0: Reference and style lock (M0)

**Goal.** Choose the look once, from generated references, then define it in the game so every later asset inherits it.

**In scope:**

- Repository scaffold with the settled stack: TypeScript (strict), Vite, Vitest and Playwright.
- **Reference art:** the hero design sheet and Emberwood key art, in each candidate style (dark fantasy, comic, mix). Use the reference prompts in `docs/PROJECT_BRIEF.md` §5. The key art keeps:
  - the hero small in the lower third
  - a clear walkable ground line, a gap and a raised platform
  - layered depth
- The developer picks a style. `docs/STYLE_GUIDE.md` records:
  - palette with hex values
  - shading rule
  - outline rule
  - lighting rule
  - what warm light is reserved for
  - the reference images
- The game's own look, applied to everything: materials for ground, foliage, characters, props and effects; a palette per level; lighting per level; and outlines and colour grading if the style uses them.
- A look-dev page that shows any asset under the game's look, next to the style-guide swatches.
- A test scene built from simple shapes that reproduces the chosen look.

**Out of scope:** gameplay, the hero model, level layout.

**Depends on:** the image model chosen, and its terms logged, before this epic starts; tool budgets.

**Playable deliverable:** the look-dev page and the test scene, running in the browser.

**Exit criteria:** the developer approves the look as rendered in the engine, not only the images.

**Draft stories:**

1. Scaffold the repository and test tooling.
2. Generate the hero and Emberwood references in each candidate style.
3. Run the style review with the developer and write `docs/STYLE_GUIDE.md`.
4. Build the palette and the shared materials.
5. Build the per-level lighting, plus outlines and grading if the style uses them.
6. Build the look-dev page.
7. Build the test scene and run the critic loop.

---

## Epic 1: Grey-box core (M1)

**Goal.** Make every base mechanic in the GDD work and feel right with no art, so that art later dresses a game that already plays well.

**In scope:**

- **Timing:** gameplay behaves the same at any display refresh rate, and a slow frame never changes an outcome.
- **Movement:** the full movement feel table. Solid tiles, one-way ledges, drop-through, moving platforms. Crouch with the 0.6-tile hurtbox †.
- **Input:** keyboard and gamepad map to the same actions. Short taps always register. Jump buffer and coyote time. Auto-pause on a hidden tab. Optional browser features fail safely.
- **Camera:** look-ahead, the vertical dead zone in the air, re-centring on landing, clamping to level bounds.
- **Combat:**
  - ember spit with aiming, hold-to-fire and the hitbox rules
  - stomp with the thorn rule, where a stomp beats contact
  - spikes
  - hearts, knockback, invulnerability
  - the pit rule (return to the last stable ground)
  - death and respawn at a checkpoint
  - hit feedback: hit-stop, shake as a trauma level, the 9 Hz blink, the enemy flash
- **Enemies:** behaviour for the walker, the thorn flyer and the rooted spitter (seed, swell warning, ducking), including the on-screen-only attack rule.
- **Pickups:** embers and the ember meter, bells, the triple shot pickup with its timer and pickup rules.
- **Level:** loading levels from the chosen level editor. Level 1 in grey boxes, with 4 sections, 3 checkpoints and the control signs, plus automated tests that every jump is possible.
- **Pace:** measure first-play pace on the grey box, to set level length in tiles.
- **Interface:** a placeholder HUD (hearts, ember meter, weapon timer) and a basic results screen.
- **Screenshots:** a screenshot harness for a fixed list of camera spots.

**Out of scope:** final art, audio, the piercing shot, ledge grab, the warden, menus and saving.

**Depends on:** Epic 0 (the scaffold); the level editor choice (LDtk or Tiled).

**Playable deliverable:** grey-box Level 1, start to finish, in the browser.

**Exit criteria:** every mechanic works in tests and feels right to the developer in the browser, and the grey-box pace is measured.

**Draft stories:**

1. Make gameplay independent of the frame rate.
2. Build the movement controller to the feel table.
3. Add solid tiles, one-way ledges, drop-through and moving platforms.
4. Map keyboard and gamepad input to the game's actions, with safe failure for optional features.
5. Build the camera.
6. Add the ember spit, aiming and the shot hitbox rules.
7. Add stomp and the thorn rule.
8. Add spikes, hearts, damage, knockback and invulnerability.
9. Add the pit rule, death and checkpoint respawn.
10. Add hit feedback: hit-stop, shake, blink and flash.
11. Add walker behaviour.
12. Add thorn flyer behaviour.
13. Add rooted spitter behaviour, including the seed and crouch interaction.
14. Add embers and the ember meter.
15. Add bells and the per-level tally.
16. Add the triple shot pickup and the pickup rules.
17. Load levels from the level editor.
18. Lay out grey-box Level 1 with its control signs and jump-possibility tests.
19. Measure the grey-box pace and set the level-length target in tiles.
20. Add the placeholder HUD and results screen.
21. Build the screenshot harness.

---

## Epic 2: Hero (M2)

**Goal.** Prove the asset pipeline on Rowan alone before building any level art.

**In scope:**

- **The asset pipeline** from `docs/PROJECT_BRIEF.md` §7, run for Rowan in stage 1:
  1. reference image
  2. four views
  3. Tripo mesh
  4. clean-up in Blender
  5. rig
  6. animate
  7. export
  8. the game's own look
- **The 11 base animations:** idle, run, jump, fall, land, spit, spit aiming up, spit aiming down, crouch, hurt, death.
- **Animation follows play:** Rowan's animation matches what he is doing in every gameplay state.
- Rowan replaces the grey box in the Epic 1 level.
- **The fallback:** if the generated mesh won't deform cleanly, build a simpler model by hand.

**Out of scope:** stage 2, the hang and climb animations (Epic 4), enemy models.

**Depends on:** Epic 1; Tripo's terms logged; hero concept signed off in Epic 0.

**Playable deliverable:** Rowan playing grey-box Level 1.

**Exit criteria:** Rowan matches the concept in the critic loop and animates cleanly in every state.

**Draft stories:**

1. Make the four reference views and the Tripo mesh.
2. Clean the mesh up in Blender.
3. Rig Rowan.
4. Animate the 11 base animations.
5. Export Rowan, apply the game's look, and check him on the look-dev page.
6. Match Rowan's animation to his gameplay state.
7. Run the critic loop and get sign-off.

---

## Epic 3: Level 1 vertical slice, the MVP (M3)

**Goal.** Make Emberwood fully playable with final art, and prove the MVP hypothesis: a new player from the primary audience finishes it without help and wants to play Level 2.

**In scope:**

- **The final Level 1 layout,** built from the grey box:
  - the teaching order and control signs from the GDD
  - 3 checkpoints, 3 bells, 100 to 150 embers †, a triple shot pickup
  - a length that gives 6 to 8 minutes of first play
- **The Emberwood art kit:** ground pieces, ledges, one-way ledges, moving platform, spikes, props, lanterns, 3 or 4 backdrop layers.
- **Enemy models and animations** for the walker, the thorn flyer and the rooted spitter, each checked for clean deformation, with a hand-built fallback.
- **Pickup and marker art:** ember, bell, triple shot, checkpoint, exit. Collectable embers must look different from Rowan's shots.
- **Control-sign icons** for keyboard and gamepad.
- **The final HUD:** hearts, ember meter, weapon timer.
- **Audio:**
  - the Level 1 tune
  - the hero, enemy, world and interface sounds used in Level 1
  - the mute key
- **Story:** the intro cards and Level 1's story line. The intro may use placeholders until narrative design is done.
- **Readability checks:** pits read as dark, hazards contrast, aiming spots have clear lines of sight, control signs stay clear of the play area.
- **A playtest** with 3 to 5 first-time players from the primary audience, which also checks whether they can say who Rowan is and what he wants, and whether they want to play Level 2.

**Out of scope:** menus beyond what's needed to start and finish a level, saving, other levels.

**Depends on:** Epic 2; audio tools chosen and their terms logged.

**Playable deliverable:** Emberwood start to finish, with final art and audio.

**Exit criteria:**

- At least 4 of 5 (or 3 of 3) first-time testers from the primary audience finish Level 1 without help.
- A majority want to play Level 2 and can say who Rowan is and what he wants.
- The developer approves the look.

**Draft stories:**

1. Finalise the Level 1 layout, length and placements.
2. Build the Emberwood environment kit.
3. Build the walker model and animations.
4. Build the thorn flyer model and animations.
5. Build the rooted spitter model and animations.
6. Make the pickup, marker and control-sign art.
7. Build the final HUD.
8. Add the Level 1 tune and sound effects.
9. Add the intro and the Level 1 story line.
10. Run the critic loop on the Level 1 camera spots.
11. Run the playtest and fix what it finds.

---

## Epic 4: First warden (M4)

**Goal.** Build the Warden of the First Seal and the seal-break moment that pays off pillar 3.

**In scope:**

- The warden's concept, name and look, reworked through narrative design.
- **The warden's behaviour, as specified in the GDD:**
  - 30 HP
  - 2 phases with a set attack order
  - three attacks that never overlap: wheel wash, millstone fall, wheel roll
  - warnings of at least 0.6 s, each with its own sound
  - dormant until Rowan enters the arena
  - a full reset when Rowan respawns
- The arena: one screen, ledges 3 tiles up †, a checkpoint at the door, a triple shot pickup before it.
- The warden's model and animations, and the arena art. The arena art is built standalone and joined to Level 2 in Epic 5.
- The seal-break moment: in the engine, 15 s or less †, no text, skippable on replays only.
- **Rowan stage 2:** one horn broken and a human hand, on the same rig.
- **Ledge grab:** simulation, tests including a reach of 4 tiles or less †, and the hang and climb-up animations.
- **Audio:** the Level 2 tune and its warden arrangement, and the warden sounds.

**Out of scope:** the Level 2 layout, the piercing shot.

**Depends on:** Epic 3; the warden concept from narrative design.

**Playable deliverable:** the warden fight in its arena, ending in the seal-break moment. Rowan stage 2 can try out ledge grab in a test room.

**Exit criteria:**

- A full fight can be won without taking damage, which proves every attack can be dodged.
- At least 4 of 5 first-time testers win within 5 attempts.
- Ledge grab passes its tests and feels right to the developer.

**Draft stories:**

1. Finalise the warden concept (narrative design).
2. Build the warden's behaviour and attack order, with tests.
3. Build the arena layout and the door checkpoint.
4. Build the warden model and animations.
5. Build the seal-break moment.
6. Build Rowan stage 2.
7. Add ledge grab: simulation and reach tests.
8. Animate hang and climb-up.
9. Add the Level 2 tune, its warden arrangement and the warden sounds.
10. Playtest the warden.

---

## Epic 5: Levels 2 and 3 (M5)

**Goal.** Complete version one's content by reusing the proven pipeline.

**In scope:**

- **Level 2, the Drowned Mill:**
  - grey box, then final layout
  - the Drowned Mill art kit
  - waterwheel platforms that move on a circular path and stay level
  - deep water that works like a pit
  - the piercing shot pickup
  - the level leads into the Epic 4 arena
- **Level 3, Harrowmere ruins:**
  - grey box, then final layout, built around ledge grab
  - the Harrowmere art kit
  - a final stretch of mixed enemies
- Both levels follow the GDD's difficulty caps and the 6 to 8 minute target.
- The three enemies in each level's palette.
- The Level 3 tune.
- **Story:**
  - the story lines for Levels 2 and 3
  - the closing card, which must show Rowan facing Harrowmere and a sign that Elin is acting on her own
  - the all-bells card
- **A full playthrough test** of version one.

**Out of scope:** new enemy types, Levels 4 to 6.

**Depends on:** Epic 4; the ending decided through `gds-create-narrative`.

**Playable deliverable:** version one from start to finish.

**Exit criteria:** a new player finishes version one in 20 to 30 minutes.

**Draft stories:**

1. Grey-box Level 2 and add its jump tests.
2. Add waterwheel platforms and deep water.
3. Add the piercing shot.
4. Build the Drowned Mill kit and dress Level 2.
5. Connect Level 2 to the warden arena.
6. Grey-box Level 3 around ledge grab and add its jump tests.
7. Build the Harrowmere kit and dress Level 3.
8. Add the Level 3 tune.
9. Add the story lines, the closing card and the all-bells card.
10. Playtest the full version one.

---

## Epic 6: Wrap and release (M6)

**Goal.** Make version one releasable and release it.

**In scope:**

- **Session flow:**
  - Title screen: Continue, Level select, Settings.
  - Pause menu: resume, restart level, settings, quit to level select.
  - Level select: finished levels plus the next unlocked one, with best time and bells found. Replays follow the replay-form rule (the form and abilities Rowan had on first arrival).
  - The all-bells card when the ninth bell is found on a replay, and watching it again from the level select.
  - The final results screen.
- **Saving:** automatic after each level, stored in the browser, with safe failure if storage is refused.
- **Settings:** music volume, effects volume, reduced motion, fullscreen.
- **A note for phone and tablet visitors.**
- **A performance pass** on the reference machines: median frame time 16.7 ms or less, and 99th percentile 20 ms or less.
- **The release:**
  - the final title, checked against existing games and trademarks
  - the itch.io page
  - an HTML5 build within itch.io's limits
  - asset credits from `docs/ASSETS.md`
- **A decision on release-success measurement** (the note in the GDD).

**Out of scope:** the desktop and Steam build, touch controls.

**Depends on:** Epic 5; the final title; the reference machines named.

**Playable deliverable:** version one live on itch.io.

**Exit criteria:** performance targets met on the reference machines, and the game released on itch.io under the final title.

**Draft stories:**

1. Build the title screen with Continue, and the pause menu.
2. Build the level select, the replay-form rule and the save system.
3. Build the settings screen.
4. Add the phone and tablet note.
5. Run the performance pass on real hardware.
6. Choose and check the title, and build the itch.io page.
7. Package the release build and check it against itch.io's limits.
8. Release.

---

## Coverage check: every GDD mechanic lands in an epic

| Mechanic or feature | Epic |
| --- | --- |
| Run, jump, aim, ember spit, stomp, crouch, drop-through | 1 |
| Spikes, hearts, knockback, invulnerability, pit rule, death and respawn, checkpoints | 1 |
| Hit feedback (hit-stop, shake, blink, flash) | 1 |
| Walker, thorn flyer, rooted spitter (behaviour) | 1 |
| Walker, thorn flyer, rooted spitter (art) | 3 |
| Embers and ember meter, bells, triple shot, pickup rules | 1 |
| Control signs | 1 (placement), 3 (art) |
| Piercing shot | 5 |
| Ledge grab | 4 |
| Warden and seal-break moment | 4 |
| Rowan stages 1 and 2 | 2, 4 |
| Waterwheel platforms, deep water | 5 |
| Results screen | 1 (basic), 6 (final) |
| Title, Continue, pause, level select, replay-form rule, saving, settings | 6 |
| Intro, level story lines, closing card, all-bells card | 3, 5 (all-bells on replay: 6) |
| Music | 3 (Level 1), 4 (Level 2 and warden), 5 (Level 3) |
| Sound effects | 3, 4 |
| Performance targets | 6 |

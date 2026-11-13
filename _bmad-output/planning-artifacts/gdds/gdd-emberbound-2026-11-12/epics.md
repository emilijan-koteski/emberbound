---
title: "Emberbound (working title) - Development Epics"
gdd: gdd.md
ux:
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
created: 2026-11-12
updated: 2026-11-13
---

# Emberbound: development epics

**What this file is:**

- The detailed breakdown behind the epic table in `gdd.md`.
- Each epic comes from one milestone (M0 to M6) in `docs/PROJECT_BRIEF.md`, the planning doc. Its exit criteria become the epic's acceptance criteria.
- The stories are draft, high-level stories. `gds-create-epics-and-stories` turns them into full stories after the architecture exists.
- How each system is built belongs to the architecture document. This file says what each epic delivers.
- How the overlay (HUD, menus, cards, notices) looks and behaves belongs to the UX spines in `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/`: `DESIGN.md` for tokens and components, `EXPERIENCE.md` for surfaces, flows, states and on-screen strings. Story creation pulls both for every epic that builds an overlay surface. D-, F-, A-, Q- and M-numbers in this file refer to that folder's `.decision-log.md`.

**Rules for every epic:**

- An epic starts only when the previous epic's exit criteria are met and the developer approves.
- Every simulation rule gets a unit test.
- After any visual change, the critic loop defined in `gdd.md` (Development Epics) runs.
- Every asset and tool is logged in `docs/ASSETS.md`, including whether the asset is AI-generated.
- Overlay surfaces read the DESIGN.md tokens, never raw values, and follow EXPERIENCE.md for behaviour and strings. EXPERIENCE.md's provisional UI timings are tuned in the epic that builds each surface (M2).

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
  - the story-card style: layered paper-cut silhouettes built in the engine, and whether cards may also use warm light for Elin and home (see the narrative design document, Narrative Delivery)
  - values for the 16 overlay colour roles in DESIGN.md (Colors), with `ember` still the only warm one
  - the 3 overlay typefaces (display, UI, numeric): self-hosted `.woff2`, licence checked and recorded in `docs/ASSETS.md`, all faces and weights together 0.3 MB or less
  - the DESIGN.md contrast table, re-measured on those values, with every target still met
- DESIGN.md then takes the overlay colours and typefaces through `gds-ux` Update, before this epic closes, so Epic 1 builds on them (F9).
- The game's own look, applied to everything: materials for ground, foliage, characters, props and effects; a palette per level; lighting per level; and outlines and colour grading if the style uses them.
- A look-dev page that shows any asset under the game's look, next to the style-guide swatches. It also shows the overlay colour roles and typefaces, since the overlay is judged there too (DESIGN.md).
- **A sample story card** on the look-dev page: intro card 2, the glowing crack.
  - It confirms the silhouette style and the cards' warm-light exception. If the exception is refused, the forge glow on cards turns pale and cold.
  - It sets the palette for story scenes outside the levels: the village and the hollow chamber.
  - It settles where the card shapes come from (made by hand or generated), logged in `docs/ASSETS.md`.
  - It fixes where card text sits, reused on every later card: one line on a scrim band over the card art, with the advance hint at the band's lower right (DESIGN.md, `card-text`).
- A test scene built from simple shapes that reproduces the chosen look.

**Out of scope:** gameplay, the hero model, level layout.

**Depends on:** the image model chosen, and its terms logged, before this epic starts; tool budgets.

**Playable deliverable:** the look-dev page and the test scene, running in the browser.

**Exit criteria:** the developer approves the look as rendered in the engine, not only the images, and DESIGN.md carries the style guide's overlay colours and typefaces, with every contrast target met.

**Draft stories:**

1. Scaffold the repository and test tooling.
2. Generate the hero and Emberwood references in each candidate style.
3. Run the style review with the developer and write `docs/STYLE_GUIDE.md`, including the story-card style, the overlay colours and typefaces, and the re-measured contrast table.
4. Build the palette and the shared materials.
5. Build the per-level lighting, plus outlines and grading if the style uses them.
6. Build the look-dev page.
7. Build the test scene and run the critic loop.
8. Build the sample story card and confirm the card style and where card text sits.
9. Update DESIGN.md with the overlay colours and typefaces through `gds-ux` Update.

---

## Epic 1: Grey-box core (M1)

**Goal.** Make every base mechanic in the GDD work and feel right with no art, so that art later dresses a game that already plays well.

**In scope:**

- **Timing:** gameplay behaves the same at any display refresh rate, and a slow frame never changes an outcome.
- **Movement:** the full movement feel table. Solid tiles, one-way ledges, drop-through, moving platforms. Crouch with the 0.6-tile hurtbox †.
- **Input:**
  - keyboard and gamepad map to the same actions, the menu actions included: move focus, confirm, back (D13)
  - short taps always register; jump buffer and coyote time
  - the last-used device is tracked, for the control-sign glyphs and the card advance hint
  - bound keys never scroll the host page
  - pause on Esc, P or Start
  - auto-pause when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or is turned off after an error (D14, Q7); held inputs are cleared so Rowan stops, and play never resumes by itself
  - pausing during the death sequence or the pit fade stops the simulation, which resumes where it was (M5)
  - optional browser features fail safely
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
  - Both read the DESIGN.md tokens and components, which already carry the Epic 0 values (F9), and scale with `--tile`, which `ui/overlay.ts` sets from the logical view in `sim/config.ts` (M3).
  - The HUD is the top-left cluster, with the states and timings in EXPERIENCE.md (Component Patterns).
- **Screenshots:** a screenshot harness for a fixed list of camera spots.

**Out of scope:** final art, audio, the piercing shot, ledge grab, the warden, menus and saving.

**Depends on:** Epic 0 (the scaffold, and the overlay colours and typefaces in DESIGN.md); Tiled 1.12.x, the level editor settled in the architecture (game-architecture.md:338).

**Playable deliverable:** grey-box Level 1, start to finish, in the browser.

**Exit criteria:** every mechanic works in tests and feels right to the developer in the browser, and the grey-box pace is measured.

**Draft stories:**

1. Make gameplay independent of the frame rate.
2. Build the movement controller to the feel table.
3. Add solid tiles, one-way ledges, drop-through and moving platforms.
4. Map keyboard and gamepad input to the game's actions and the menu actions, with last-device tracking, pause and the auto-pause triggers, and safe failure for optional features.
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
20. Add the placeholder HUD and results screen, built from the DESIGN.md tokens and components on the `--tile` unit.
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
- **Emberwood story props** (narrative design document, Environmental Storytelling):
  - the empty wedding glade with benches and a garland arch, the level's exit
  - carved woodsman's waymarkers that carry the control signs
  - the cold chimney of Elin's foundry in the far-distance layer
- **Enemy models and animations** for the walker, the thorn flyer and the rooted spitter, each checked for clean deformation, with a hand-built fallback.
- **Pickup and marker art:** ember, bell, triple shot, checkpoint, exit. Collectable embers must look different from Rowan's shots.
- **Control-sign icons** for keyboard and gamepad. The signs show the last-used device's set and swap on the next frame after a change.
  - keyboard: the arcade set only, arrows to move, ↑ aim up, ↓ crouch, Z jump, ↓ + Z drop-through, X spit (F6)
  - gamepad: one neutral set of position glyphs, with no platform letters, colours or logos; the spit sign lights the west face button (F3, F6)
- **The final HUD:** hearts, ember meter, weapon timer, the bell toast ("Bell n of 3" for about 2 s, F2) and the mute indicator (a speaker-off icon top-right while muted, D7).
  - It is judged in play with the Epic 0 values, on the critic-loop screenshots at Emberwood's brightest and busiest spots (F9).
  - Heart legibility at the 1280 × 720 embed (hearts about 23 px) is checked with the primary audience before the icon size is raised.
- **Audio:**
  - the Level 1 tune, carrying Elin's bell motif, which the bell pickup sound also plays
  - the end-of-level stinger and the Emberwood ambience
  - the hero, enemy, world and interface sounds used in Level 1
  - the mute key
- **The bare title gate** (F5): the wordmark, then "Click or press any key", then the intro cards, then Emberwood's loading card. Any key, click or gamepad button passes it. A key or click starts the audio and gives the frame keyboard focus; a gamepad button can't start the audio (D8, A1). It exists so the playtest has audio and the intro; the title menu, level select, saving and settings stay in Epic 6.
- **Story:**
  - The story text, the 5 intro cards, and Level 1's loading card, which shows the level name and its line (F10).
  - Card input (D12): all input, Back included, is ignored for the minimum of about 1.5 s †, and a press counts only if it began after the card appeared. Then the confirm glyph for the last-used device fades in, confirm advances one card, and Back skips the rest of the intro.
  - The text is final (narrative design document, Narrative Delivery).
  - The cards are layered silhouettes built in the engine. Placeholder silhouettes are acceptable for the playtest; placeholder text is not, because the playtest checks whether players can say who Rowan is and what he wants.
- **Readability checks:** pits read as dark, hazards contrast, aiming spots have clear lines of sight, control signs stay clear of the play area.
- **A playtest** with 3 to 5 first-time players from the primary audience, which also checks whether they can say who Rowan is and what he wants, and whether they want to play Level 2.

**Out of scope:** menus beyond the bare title gate and what's needed to start and finish a level (the title menu, pause menu, level select and settings are Epic 6), saving, other levels.

**Depends on:** Epic 2; audio tools chosen and their terms logged.

**Playable deliverable:** Emberwood start to finish, from the title gate and the intro, with final art and audio.

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
6. Make the pickup, marker and control-sign art, with the arcade key set and the position glyphs.
7. Build the final HUD, with the bell toast and the mute indicator.
8. Add the Level 1 tune and sound effects.
9. Build the bare title gate, then add the story text, the intro silhouette cards with their input rules, and the Level 1 loading card.
10. Run the critic loop on the Level 1 camera spots.
11. Run the playtest and fix what it finds.

---

## Epic 4: First warden (M4)

**Goal.** Build the Warden of the First Seal and the seal-break moment that pays off pillar 3.

**In scope:**

- **The warden is the Drowned Miller.** The concept is settled in narrative design. This epic builds his look, with the seal at the wheel's hub, plus decals for Harrowmere's mark and the Tithe's sign. Both symbols are checked for originality before they are drawn.
- **The warden's behaviour, as specified in the GDD:**
  - 30 HP
  - 2 phases with a set attack order
  - three attacks that never overlap: wheel wash, millstone fall, wheel roll
  - warnings of at least 0.6 s, each with its own sound
  - dormant until Rowan enters the arena
  - a full reset when Rowan respawns
- **The warden bar** on the HUD (F1): "The Warden" over a bar at the top centre, clear of the arena floor where the millstone shadows warn.
  - It fades in when the door shuts, drops with each hit, and has a notch at 15 of 30 HP, where phase 2 starts.
  - It stays through Rowan's death sequence, hides when he respawns at the door, and returns full when he enters again.
  - On the final hit it drains to empty and fades with the rest of the HUD.
- The arena: one screen, ledges 3 tiles up †, a checkpoint at the door, a triple shot pickup before it.
- The warden's model and animations, and the arena art. The arena art is built standalone and joined to Level 2 in Epic 5.
- The seal-break moment: in the engine, 15 s or less †, no text, skippable on replays only. It follows the staging in the narrative design document (Gameplay Integration):
  1. the seal shatters
  2. the wheel stops
  3. the Miller sinks, at rest
  4. Rowan changes under a flash of embers

  Rowan can't be hurt during it, and attacks already in flight are removed; this has a unit test. The HUD fades out as it starts and stays hidden until the results. Pausing during it stops the simulation, which resumes where it was (M5). With reduced motion, the ember flash becomes a short fade (D17).
- **Rowan stage 2:** one horn broken and a human hand, on the same rig.
- **Ledge grab:** simulation, tests including a reach of 4 tiles or less †, and the hang and climb-up animations.
- **Audio:** the Level 2 tune and its warden arrangement, the warden sounds, and the seal-break stinger. The tune and the stinger carry Elin's motif.

**Out of scope:** the Level 2 layout, the piercing shot.

**Depends on:** Epic 3. The warden concept from narrative design is done.

**Playable deliverable:** the warden fight in its arena, ending in the seal-break moment. Rowan stage 2 can try out ledge grab in a test room.

**Exit criteria:**

- A full fight can be won without taking damage, which proves every attack can be dodged.
- At least 4 of 5 first-time testers win within 5 attempts.
- Ledge grab passes its tests and feels right to the developer.

**Draft stories:**

1. Check the two symbols for originality.
2. Build the warden's behaviour and attack order, with tests, and the warden bar.
3. Build the arena layout and the door checkpoint.
4. Build the warden model and animations.
5. Build the seal-break moment, with the HUD fade-out.
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
  - story props: drowned carts and fences, decorative waterwheels, the millhouse, and grain sacks marked with Harrowmere's mark at the warden's door checkpoint
- **Level 3, Harrowmere ruins:**
  - grey box, then final layout, built around ledge grab
  - the Harrowmere art kit
  - the level starts at the old siege line outside the walls: a rotted siege camp and a scorched circle
  - the burned gate with Harrowmere's mark, which pairs with the mill's sacks; household props left in the streets
  - a final stretch of mixed enemies, then a short calm walk to the exit, the town's fallen fire bell below its collapsed tower
- Both levels follow the GDD's difficulty caps and the 6 to 8 minute target.
- Bell hints in Levels 2 and 3 use ember trails and gaps, not lanterns.
- The three enemies in each level's palette.
- **Audio:**
  - the Level 3 tune, which fades to wind in the last calm stretch
  - the Drowned Mill and Harrowmere ambiences, with the great wheel growing louder near the arena
  - the closing-card stinger, carrying Elin's motif
- **Story:**
  - the story lines for Levels 2 and 3, on their loading cards
  - the held beat at the fallen bell: about 3 s †, no text, skippable on replays only. Rowan can't be hurt during it. The HUD fades out and stays hidden until the level ends; pausing during it stops the simulation, which resumes where it was (M5).
  - the closing card and the all-bells card. Their text is final (narrative design document); the cards are silhouettes built in the engine. They follow the card input rules from Epic 3, but Back skips them on replays only (D12).
  - Level 3's end order: the held beat, the closing card, the all-bells card if earned, then the results, over the last card scene dimmed by the scrim. After the results of a first play, the game returns to the title (the title menu is built in Epic 6).
- **A full playthrough test** of version one.

**Out of scope:** new enemy types, Levels 4 to 6.

**Depends on:** Epic 4. The ending is decided (narrative design, 2026-11-13).

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
8. Add the Level 3 tune, the two ambiences and the closing-card stinger.
9. Add the story lines, the held beat, the closing card and the all-bells card, in Level 3's end order, ending on the results over the dimmed last card scene.
10. Playtest the full version one.

---

## Epic 6: Wrap and release (M6)

**Goal.** Make version one releasable and release it.

**In scope:**

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
  - Error panels (DN-4): the bug panel ("Something went wrong" with "Restart level") and the Retry panel for boot and level loads, built from the shared components, with no technical text.
- **Saving:** automatic after each level, stored in the browser, with safe failure if storage is refused: progress lives in memory for the session, and the storage notice shows (D15).
- **Settings:** music volume, effects volume, reduced motion, fullscreen. Mute stays on the M key, not a settings row (D10).
  - Changes apply and save at once. Back returns to the title or the pause menu, whichever opened Settings.
  - Reduced motion takes its default for a new save from the browser's `prefers-reduced-motion` (Q5). It turns screen shake off, turns full-screen flashes into a short fade, and stops the last-heart pulse and the HUD icon shake; hit-stop and the 9 Hz blink stay (D17).
  - Fullscreen isn't saved, and the toggle shows the real state. If the browser refuses, the toggle snaps back and "Fullscreen isn't available here." shows until Settings closes (D10).
- **A note for phone and tablet visitors,** shown instead of the title gate when the primary pointer is coarse and there is no fine pointer (Q3). "Try anyway" continues to the gate, for tablets with a keyboard (D16).
- **A performance pass** on the reference machines: median frame time 16.7 ms or less, and 99th percentile 20 ms or less.
- **The release:**
  - the final title, checked against existing games and trademarks
  - the story names in the GDD's originality list, checked the same way
  - the itch.io page
  - an HTML5 build within itch.io's limits
  - asset credits from `docs/ASSETS.md`, on the itch.io page; a "Credits" row joins Settings if an asset licence requires in-game credit (Q10)
  - browser checks on a private itch.io upload, before the public release: a gamepad passing the title gate, the audio unlock that follows, and fullscreen refused from a gamepad (A1); the Esc that leaves fullscreen (A2); iframe focus (A3); storage partitioning; gamepad permission in the iframe; bound keys not scrolling the page; the 1280 × 720 embed with itch.io's fullscreen button (Q9)
- **A decision on release-success measurement** (the note in the GDD).

**Out of scope:** the desktop and Steam build, touch controls, screen-reader support beyond native menu buttons (Q6).

**Depends on:** Epic 5; the final title; the reference machines named.

**Playable deliverable:** version one live on itch.io.

**Exit criteria:** performance targets met on the reference machines, the browser checks on the private itch.io upload behave as EXPERIENCE.md specifies, and the game released on itch.io under the final title.

**Draft stories:**

1. Build the boot loading screen, the title screen with Continue and its notices, and the pause menu with its confirms.
2. Build the level select with its all-bells row, the final results screen, the replay-form rule, the replay loading-card skip and the save system.
3. Build the settings screen, with the reduced-motion default.
4. Add the phone and tablet note, with "Try anyway".
5. Run the performance pass on real hardware.
6. Choose and check the title, check the story names, and build the itch.io page.
7. Package the release build, check it against itch.io's limits, and run the browser checks on a private upload.
8. Release.

---

## Coverage check: every GDD mechanic and UX surface lands in an epic

| Mechanic or feature | Epic |
| --- | --- |
| Run, jump, aim, ember spit, stomp, crouch, drop-through | 1 |
| Spikes, hearts, knockback, invulnerability, pit rule, death and respawn, checkpoints | 1 |
| Hit feedback (hit-stop, shake, blink, flash) | 1 |
| Walker, thorn flyer, rooted spitter (behaviour) | 1 |
| Walker, thorn flyer, rooted spitter (art) | 3 |
| Embers and ember meter, bells, triple shot, pickup rules | 1 |
| Control signs | 1 (placement), 3 (art: arcade key set, position glyphs) |
| Piercing shot | 5 |
| Ledge grab | 4 |
| Warden and seal-break moment | 4 |
| Rowan stages 1 and 2 | 2, 4 |
| Waterwheel platforms, deep water | 5 |
| Results screen | 1 (basic), 6 (final: stagger, "New best") |
| Title menu, Continue, pause menu with its confirms, level select with its all-bells row, replay-form rule, saving, settings | 6 |
| Intro, level story lines, closing card, all-bells card | 3, 5 (all-bells on replay: 6) |
| Story-card style (silhouettes, warm-light exception) | 0 (style), 3 and 5 (cards) |
| Held beat and Level 3's end order | 5 |
| Story props per level | 3 (Emberwood), 4 (seal and decals), 5 (Drowned Mill, Harrowmere) |
| Originality checks of story names and symbols | 4 (symbols), 6 (names, before release) |
| Music and stingers | 3 (Level 1, end-of-level stinger), 4 (Level 2, warden, seal-break stinger), 5 (Level 3, closing-card stinger) |
| Ambience | 3 (Emberwood), 5 (Drowned Mill, Harrowmere) |
| Sound effects | 3, 4 |
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
| Error panels: bug; retry for boot and level loads | 6 |

# GDD + epics extraction for UX (Emberbound)

Sources: `gdds/gdd-emberbound-2026-11-12/gdd.md` (971 lines, status final, updated 2026-11-13) and `epics.md` (414 lines). Citations are file:line. † in the sources marks a starting guess to be tuned (gdd.md:27).

## 1. Game identity

- Summary: short 2.5D side-scrolling action platformer for the desktop browser, dark-fantasy land ruled by "the Tithe, a bargain with the Ember Below" (gdd.md:36). Rowan Ashby, a Cindersworn fire-caster who burned Harrowmere, is turned into "a horned ember-beast who can spit embers" when Lord Maldrek takes his bride-to-be Elin (gdd.md:40-41). He beats wardens holding six seals; "Each broken seal makes Rowan visibly more human and gives back one ability" (gdd.md:42-43).
- Title is a working title: "Emberbound (working title)" (gdd.md:2); "Emberbound" is used by at least six other games, final title needed before any public page (gdd.md:931, 958).
- Elevator pitch: "a cursed fire-caster spits embers through dark-fantasy levels to break the bargain that took his bride. It is a short, forgiving 2.5D platformer in the spirit of the arcade classics, free in the browser." (gdd.md:45)
- Vision: "the arcade platformer you remember, made fair, with a story about paying for what you did." (gdd.md:47). Core fantasy: "you are the monster in this story, and every warden you beat burns a little of the monster away." (gdd.md:49)
- Pillars (verbatim names): 1 "Understood in seconds." 2 "Arcade heart, modern mercy." 3 "The curse shows on the body." (gdd.md:130, 142, 154)
- Genre: Action Platformer, 2.5D side-scroller, stage-and-boss structure (gdd.md:20); structural inspiration Toki 1989, minus its punishment (gdd.md:103).
- Tone/mood words: "dark fantasy" (gdd.md:36, 698); "forgiving" (gdd.md:45); "made fair" (gdd.md:47); "snap of running, jumping and spitting fire" in first minutes; "a small, earned sense of redemption" by the end (gdd.md:60-61); Rowan "Determined, not monstrous" (gdd.md:722); USP 1 "Execution is the edge. Feel, readability and polish" (gdd.md:74).
- Stakes/distribution: free in the browser on itch.io (gdd.md:56); HTML5 game on itch.io, "Free to play; donations only" (gdd.md:788-790). Possible Steam desktop build later, $5 or less, only if the free version finds players (gdd.md:97, 805, 910). Hobby/learning project: goals in order are learn, enjoy, finish small and polished, possibly sell (gdd.md:94-97).
- Version one: 3 levels, 1 warden at end of Level 2, 20 to 30 minutes (gdd.md:53-55).
- Audience: primary "players aged roughly 35 to 55 who grew up on arcade and console platformers", play "in one evening session on a desktop computer", "want to understand the game without a manual, finish it, and not be punished for being out of practice" (gdd.md:66-68). Secondary: younger fans of Celeste/Hollow Knight, "tight controls and a hand-made look" (gdd.md:69). Primary group wins conflicts, e.g. one generous difficulty (gdd.md:70).

## 2. Platform & form factor

- Desktop web browser, keyboard and gamepad (gdd.md:5, 21). three.js on WebGL (gdd.md:788).
- Browsers: current Chrome, Edge, Firefox; Safari best-effort (gdd.md:791).
- Phones/tablets not supported in v1; "They show a 'best played on desktop with keyboard or gamepad' note." (gdd.md:797; epics.md:357). Touch controls out of scope / deferred (gdd.md:901, 909).
- Screen: "Landscape, with window resizing and fullscreen." 16:9 main target; other aspect ratios show more or less backdrop, "never less than 19 × 10.4 tiles of play area" (gdd.md:794-796, 311).
- Reference machine: 2020-era laptop, Intel Iris Xe class, 1080p; 60 fps sustained (gdd.md:775-777). Same gameplay at 60/120/144 Hz (gdd.md:779).
- Loading: total download ≤30 MB; page open to first input ≤10 s on 50 Mbit/s; level transitions ≤3 s (gdd.md:781-783).
- Resilience: if gamepad, storage, audio or fullscreen "fails or is refused, that feature turns off and the game keeps running" (gdd.md:784).
- Session context: one evening session (gdd.md:67); 20 to 30 min total (gdd.md:55); "Leaving mid-level restarts that level" (gdd.md:801).

## 3. Input

- Bindings (gdd.md:237-248): Move A/D or ←/→ | left stick or d-pad. Aim up: hold W or ↑ | stick/d-pad up. Crouch / aim down in air: hold S or ↓ | stick/d-pad down. Jump: Space, Z or K | south face (A / Cross). Spit (hold to keep firing): J or X | west face (X / Square) or east (B / Circle). Drop-through: Down + jump (both). Ledge climb / let go: Up or jump / down (both). Pause: Esc or P | Start. Mute: M | None. Confirm in menus: Enter or Space | south face button.
- Back/cancel in menus: Not stated (though an interface "back" sound exists, gdd.md:763). Menu navigation keys/stick: Not stated.
- Gamepads: "standard gamepads (Xbox and PlayStation layouts as the browser reports them)" (gdd.md:792).
- Input rules: a jump or spit press always registers even if shorter than one step; jump buffer 0.12 s; stick thresholds 0.35 sideways, 0.5 up/down; auto-pause when tab hidden; if browser refuses gamepad, keyboard still works (gdd.md:252-256). Coyote time 0.10 s, jump buffer 0.12 s (gdd.md:289-290).
- Remapping: "Key remapping is not in version one. Touch controls are not in version one." (gdd.md:257, 803, 902)
- Teaching controls: "a small sign in the scenery shows the key or button icon for that action, with no words"; "The icon matches the device the player last used, keyboard or gamepad"; ~6 signs, all in Level 1 (move, jump, spit, aim up, crouch, drop-through), none after Level 1; "The signs never cover the play area"; ledge grab gets no sign (gdd.md:261-265). Signs are carried by "carved woodsman's waymarkers" (epics.md:186).

## 4. Core loop & session structure

- Moment loop: read screen, run/jump/spit/stomp, enemy dies "with hit-stop and a burst", embers show the way and fill the ember meter (gdd.md:175-179). Section = 60-120 s checkpoint to checkpoint, ends in a calm spot (gdd.md:181-187). Level = 6-8 min (gdd.md:189, 601).
- Levels: 1 Emberwood, 2 The Drowned Mill (ends in warden), 3 Harrowmere ruins (gdd.md:606-609). Linear left to right inside a level; finishing level N unlocks N+1 (gdd.md:497-498).
- Lives/continues: "No game over." 0 hearts = death, respawn at last checkpoint with 3 hearts (gdd.md:206-207). Lives, countdown, game over out of scope (gdd.md:895).
- Pit: costs 1 heart, return to last stable ground after a 0.5 s † fade; not a respawn (gdd.md:208, 345). Death: 0.85 s sequence, respawn with 1.0 s invulnerability; killed enemies stay dead, embers/bells stay collected (gdd.md:346).
- Respawns "are shown on the results screen but never punished" (gdd.md:209).
- Checkpoints: 3 per level plus one at warden's door; touching one "sets the respawn point but does not heal" (gdd.md:231, 486-488). Pickups taken go back in the level on respawn (gdd.md:329).
- Save: "Progress is stored in the browser on that device and saves automatically after each level"; no cloud saves; clearing browser data clears progress (gdd.md:799-800). Safe failure if storage refused (epics.md:355).
- Level select: "appears after Level 1 is finished"; "Lists the finished levels plus the next unlocked one, each with best clear time and bells found"; any listed level can be replayed (gdd.md:622-625).
- Replay rule: replay uses the form and abilities Rowan had on first arrival (L1-2 full beast, no ledge grab; L3 changed, with ledge grab) (gdd.md:526-530).
- Why replay: "hidden bells, best clear times, and the all-bells story card, all reachable from the level select" (gdd.md:198).
- Completion: finish Level 3 shows the closing card; all 9 bells adds the all-bells card (gdd.md:205). Full end-of-level order in §6.

## 5. Names and content (for mocks)

- Hero: Rowan Ashby, a Cindersworn fire-caster (gdd.md:40). Look: horned ember-beast, "two bone horns sweeping back", "a furnace glow in the chest", "ember-bright eyes", "Charcoal skin with glowing seams, and a torn red woodsman's scarf" (gdd.md:715-721). Stages: 1 full beast; 2 one horn broken and a human hand; 3 mostly human (v1 shows 1 and 2) (gdd.md:723-728).
- Others: Elin (bride-to-be, bell-maker) (gdd.md:41, 668); Lord Maldrek, the Tithe-Collector (gdd.md:41).
- Approved on-screen terms: Cindersworn; The Tithe; The Ember Below; Lord Maldrek, the Tithe-Collector; Emberfire (the magic); Wardens of the six seals (gdd.md:675-682).
- Levels v1: Emberwood; The Drowned Mill; Harrowmere ruins / "the ruins of Harrowmere" (gdd.md:53, 607-609). Later (not v1): Bellspire Pass, The Tithe Road, The Hollow Court (gdd.md:610-612).
- Boss: The Warden of the First Seal, concept "the Drowned Miller" (working title); given name placeholder Tobin Weir needs originality check before on-screen use (gdd.md:381-396). Attacks: Wheel wash, Millstone fall, Wheel roll (gdd.md:412-414). Warden HP 30, phase 2 at 15 HP (gdd.md:403, 422).
- Enemies (internal working names, "Check them for originality before any appears on screen"): Walker ("grub"), Thorn flyer ("burr-wing"), Rooted spitter ("pod") (gdd.md:360-366).
- Moves: run, jump, ember spit, aim, stomp, crouch, drop-through, ledge grab (unlocked by first seal) (gdd.md:219-226, 511-512).
- Pickups/collectibles: hearts (3), embers (fill the ember meter; 50 restore 1 heart), weapon pickups triple shot and piercing shot (20 s each), bells (3 per level, 9 total) (gdd.md:227-230). Markers: checkpoint, exit (gdd.md:815).
- Story props: wedding glade garland arch (L1 exit), fallen fire bell (L3 exit), grain sacks with Harrowmere's mark, siege camp (gdd.md:597, 814); cold chimney of Elin's foundry (epics.md:187). Symbols: Harrowmere's mark, the Tithe's sign (gdd.md:947).
- Story cards: intro (5), closing card, all-bells card (gdd.md:817); sample card is "intro card 2, the glowing crack" (epics.md:47).
- Name check required before any public build for all story names (gdd.md:946).

## 6. Screens & menus

- Title screen: "Continue, Level select, Settings." "Continue starts the next unfinished level, or opens the level select once everything is finished." (gdd.md:620-621; epics.md:350). Reuses the Level 1 tune (gdd.md:744).
- Intro: "plays once, on the first Continue of a new save. Skippable." (gdd.md:626); "5 cards, one line each, about 60 s at most" (gdd.md:646).
- Level select: see §4 (gdd.md:623-625; epics.md:352). All-bells card "can be watched again from the level select" (gdd.md:638).
- Loading card: "One line of text before each level, shown on the level's loading card for at least about 3 s † of reading time. Loading happens behind the card; the 3 s transition limit applies to loading, not to reading." (gdd.md:647)
- Pause menu: "resume, restart level, settings, quit to level select" (epics.md:351). GDD lists "pause" only as an interface asset (gdd.md:816). Auto-pause on hidden tab (gdd.md:802).
- Settings: "music volume, effects volume, reduced motion (turns screen shake off), fullscreen. There is no key remapping in version one." (gdd.md:803; epics.md:356). See §15 for the mute discrepancy.
- Results screen, after each level: "clear time in m:ss.s, not counting pauses or story moments"; "bells found in this run, out of 3"; "respawns"; "embers collected, out of the level total" (gdd.md:630-634).
- End-of-level order: L1 and L2: results, then on a first play the next level's line on its loading card; in L2 the seal break comes before results. L3: "the held beat, the closing card, the all-bells card if earned, then the results. Clear time and respawns arrive after the story lands" (gdd.md:627-629).
- All-bells card: after closing card if all 9 found; if the ninth is found on an L1/L2 replay it plays after that level's results (gdd.md:635-638).
- Story cards: "layered paper-cut silhouettes, built in the engine"; "Card text is drawn over the art, never baked into it"; "Cards advance on confirm, after a minimum of about 1.5 s † so a double press can't skip one. The closing and all-bells cards can be skipped on replays." (gdd.md:657-659)
- Seal-break moment: in-engine, ≤15 s †, no text, skippable on replays only (gdd.md:427-431). Held beat at fallen bell: control stops ~3 s †, no text, skippable on replays only (gdd.md:650).
- Phone/tablet note: see §2 (gdd.md:797).
- Game over: none (gdd.md:206). Tutorial/onboarding: wordless in-world signs only (gdd.md:261-265); "Layout teaches; text does not." (gdd.md:133).
- Credits: no credits screen stated. Release includes "asset credits from `docs/ASSETS.md`" (epics.md:364); location (in-game vs itch page) Not stated.
- Interface asset set: "HUD (hearts, ember meter, weapon timer), title, pause, level select, results, settings, story cards, control signs (keyboard and gamepad icons for about 6 actions)" (gdd.md:816).

## 7. HUD

- Elements: hearts, ember meter, weapon timer (gdd.md:816; epics.md:96, 191).
- Hearts: 3; every hit costs 1; no heart pickups, no extra hearts (gdd.md:227, 580).
- Ember meter: starts at 0 each level, carries across checkpoints and respawns; 50 embers restore 1 heart; "At full hearts, a full meter waits and refills the next heart lost. Embers past a full meter only count toward the total." (gdd.md:581)
- Weapon timer: "A HUD bar shows the time left, and a warning sound plays at 3 s left †." (gdd.md:327). 20 s per pickup; new pickup replaces current and restarts at 20 s (gdd.md:326).
- Not stated: HUD placement/layout; boss health bar for the warden; on-screen bell counter; on-screen clear timer (no countdown, gdd.md:895); score (none: "There is no shop and no score", gdd.md:587).
- Text policy: "HUD, menus, results and control icons are not story text." (gdd.md:163)

## 8. Game feel & feedback

- Hit feedback table (gdd.md:370-375): Stomp: hit-stop 0.05 s, shake 0.2, bounce. Kill with a shot: no hit-stop, shake 0.12, burst. Rowan hurt: hit-stop 0.06 s, shake 0.35, knockback, blink. Rowan dies: no hit-stop, shake 0.4, fade.
- Shake is a trauma level, max 2 × trauma² tiles, decays 1.6/s; "Shake is off when reduced motion is set." (gdd.md:377). "An enemy that survives a hit flashes." (gdd.md:378)
- Hurt: -1 heart, knockback, 0.28 s no horizontal control, "1.3 s (78 steps) of invulnerability, shown by a 9 Hz blink" (gdd.md:344).
- Pit/deep water: screen fades 0.5 s †, then return to stable ground (gdd.md:345). Death: 0.85 s sequence (gdd.md:346).
- Camera: look-ahead 1.2 tiles facing, 2.4 running; vertical hold in air until 1.8 below / 2.4 above; re-centres on landing; stops at level edges (gdd.md:308-311).
- Telegraphs: spitter swells 0.5 s before firing (gdd.md:366). Warden: wheel spins up and glows 0.8 s; floor shadows 0.8 s before millstones; rears back and vents steam 0.6 s; warnings ≥0.6 s, "each attack has its own warning sound" (gdd.md:412-423). Phase 2: "the warden flinches and the music shifts" (gdd.md:422).
- Seal break: "A flash of embers from his chest covers the change" (gdd.md:429).
- Wayfinding: embers trace jump arcs (gdd.md:137, 573). Story moments are safe: no damage while control stops (gdd.md:651).
- Haptics/rumble: Not stated.

## 9. Art & visual direction relevant to UI

- Style "Not locked yet"; chosen in Epic 0 from generated references, recorded in `docs/STYLE_GUIDE.md`; tone is dark fantasy whichever wins (gdd.md:698).
- Candidates (gdd.md:702-704): Stylised dark fantasy ("cold teal and plum palette, fog, and a pale glow behind trees. Simple flat shapes with soft gradients"); Comic illustration ("Flat colours, banded shading, dark ink outlines, one dominant colour per level"); Mix.
- Fixed rules: 3D characters on a 2D play plane before layered backdrops (foreground, play layer, middle, far); "Warm light belongs only to the hero, embers and lanterns"; hero/enemies/hazards/pickups distinguishable at a glance; "The look comes from the game, not from the image generator" (gdd.md:708-711).
- Level looks: Emberwood dusk forest lit by lanterns; Drowned Mill fog, black water, turning wheels; Harrowmere charred ruins, cold and grey (gdd.md:734-736).
- Readability: pits read as dark; hazards contrast; collectable embers differ from ember shots "in both shape and motion"; control signs never cover the play area (gdd.md:503-507).
- Story cards: palette silhouettes, renderer owns style; warm light for Elin/home on cards only, pending Epic 0, else "the forge glow on cards turns pale and cold" (gdd.md:657-660).
- Epic 0 style guide records palette hex, shading, outline, lighting rules, warm-light reservation, references, story-card style (epics.md:37-44); look-dev page shows assets next to style-guide swatches (epics.md:46).
- Critic loop after every visual change, max three rounds (gdd.md:849-857).
- Diegetic vs overlay: control signs are in-world scenery (gdd.md:261); HUD is overlay. INFERENCE: no other diegetic UI is described.
- Fonts / typography: Not stated.

## 10. Audio

- Music: one hummable tune per level; warden uses a more intense L2 arrangement shifting at phase 2; title screen reuses L1 tune; "Short stingers mark the end of a level, the seal break and the closing card"; Elin's 3-4 note bell motif in every tune, and "The bell pickup sound plays its first notes" (gdd.md:742-746). L3 music fades to wind before the fallen bell (gdd.md:747).
- Interface SFX: "Menu move, confirm, back, pause" (gdd.md:763). World SFX incl. checkpoint, heart restored, weapon running out (3 s left) (gdd.md:762).
- Ember spit is the signature sound (gdd.md:379, 759).
- Settings: "music volume, effects volume, and mute (M)" (gdd.md:765).
- Audio tool not chosen (gdd.md:767, 925).

## 11. Accessibility

- Difficulty: one setting, "tuned generous"; difficulty settings out of scope (gdd.md:555, 894).
- Reduced motion setting turns screen shake off (gdd.md:377, 803). Nothing else is listed as affected by it.
- Remapping: not in v1 (gdd.md:257).
- Forgiveness: hitboxes favour the player (gdd.md:331-338); ≤120 s replay per failure (gdd.md:145); enemies attack only on screen (gdd.md:351).
- Paired audio + visual warnings for warden attacks (gdd.md:412-423).
- Not stated: colour-blind modes, subtitles/captions (no dialogue, gdd.md:648), text size, photosensitivity/flash limits (note the 9 Hz blink, gdd.md:344), hold-vs-toggle options, assist modes.

## 12. Text, voice & localization

- English only; localisation out of scope (gdd.md:804, 904).
- Story text limited to intro, one line before each level, closing card, all-bells card (gdd.md:157-161); 141 words total, written in the narrative design doc, not in the GDD (gdd.md:662). No dialogue during play (gdd.md:648). No voice acting mentioned: Not stated.
- On-screen microcopy in sources: "Continue, Level select, Settings" (gdd.md:620); "resume, restart level, settings, quit to level select" (epics.md:351); phone note "best played on desktop with keyboard or gamepad" (gdd.md:797); results labels clear time / bells / respawns / embers (gdd.md:631-634).
- Closing card points to Elin: "far below, Elin is making a bell of her own" (gdd.md:689). Bargain line (backstory): *I will pay with what I hold dearest when the debt is called.* (gdd.md:667)
- Fonts: Not stated.

## 13. Player personas / journeys

- Named personas or named player journeys: Not stated.
- Audience segments only (§1, gdd.md:66-70). Playtests: "3 to 5 first-time players from the primary audience, watched without help" (gdd.md:872).
- Measures: "No player is stuck for more than 60 s at one spot without understanding what to do. No player asks what a button does after the first 2 minutes." (gdd.md:877); "No player quits from frustration." (gdd.md:878); after the seal break "players mention the change in Rowan without being prompted" (gdd.md:879).

## 14. Epics & milestones touching UI/UX

- Epic 0 (M0) Reference and style lock: style guide, palette, look-dev page, sample story card (intro card 2) (epics.md:37-51). Exit: developer approves the look as rendered in the engine (epics.md:59).
- Epic 1 (M1) Grey-box core: input mapping, auto-pause, safe failure (epics.md:82); camera (epics.md:83); hit feedback (epics.md:91); control-sign placement (epics.md:94); "a placeholder HUD (hearts, ember meter, weapon timer) and a basic results screen" (epics.md:96); screenshot harness (epics.md:97). Out: menus and saving (epics.md:99).
- Epic 2 (M2) Hero: no UI.
- Epic 3 (M3, MVP): control-sign icons for keyboard and gamepad; final HUD; interface sounds and mute key; 5 intro cards and Level 1 loading-card line, final text (placeholder silhouettes OK, placeholder text not) (epics.md:190-200). Out: "menus beyond what's needed to start and finish a level, saving" (epics.md:204). Exit: ≥4 of 5 (or 3 of 3) testers finish L1 without help; majority want L2 and can say who Rowan is and what he wants; developer approves look (epics.md:212-214).
- Epic 4 (M4) First warden: seal-break moment (epics.md:248-254); warden warning sounds (epics.md:243). Exit: fight winnable without damage; ≥4 of 5 testers win within 5 attempts (epics.md:267-268).
- Epic 5 (M5): L2 and L3 loading-card lines, held beat, closing and all-bells cards, L3 end order (epics.md:313-317). Exit: new player finishes v1 in 20-30 min (epics.md:326).
- Epic 6 (M6) Wrap and release: title, pause menu, level select, all-bells on replay, final results screen, saving, settings, phone/tablet note, asset credits, itch.io page, release-success measurement decision (epics.md:349-365). Exit: performance targets met and released on itch.io under final title (epics.md:373).
- Coverage: results screen 1 (basic) / 6 (final); title, Continue, pause, level select, saving, settings 6; story cards 3 and 5, all-bells on replay 6 (epics.md:404-407).

## 15. Open questions, TBDs, conflicts affecting UX

- Settings lists differ: gdd.md:765 "music volume, effects volume, and mute (M)" vs gdd.md:803 and epics.md:356 "music volume, effects volume, reduced motion, fullscreen". Whether mute is a settings item or only the M key is unclear.
- Mute has no gamepad binding (gdd.md:247).
- Pause menu contents appear only in epics.md:351, not in the GDD.
- "Quit to level select" (epics.md:351) vs level select appearing only after Level 1 is finished (gdd.md:622): what quit does during a first Level 1 play is Not stated.
- Loading-card line on replays: gdd.md:628 says "on a first play"; gdd.md:647 says before each level. Replay loading-card content Not stated.
- Hit-stop on kills: loop text "An enemy dies, with hit-stop and a burst" (gdd.md:177) vs table "Kill with a shot | None" hit-stop (gdd.md:373).
- Boss health bar, bell counter, HUD placement, timer on HUD: Not stated (§7).
- Menu back/cancel binding and menu navigation input: Not stated, though a "back" sound exists (gdd.md:763).
- Skip input for intro/cards/seal break/held beat: Not stated (confirm advances cards, gdd.md:659).
- Results screen showing "best" or new-record times: Not stated (best clear time appears on level select, gdd.md:624).
- Intro rewatch: Not stated (only the all-bells card is rewatchable, gdd.md:638).
- Epic 3 needs intro cards (epics.md:198) but title/Continue/saving are Epic 6. How the intro is triggered in Epic 3 is Not stated.
- Art style not locked until Epic 0 (gdd.md:698); story-card warm-light exception pending (gdd.md:660); fonts Not stated.
- Final game title not chosen (gdd.md:931); enemy names and the warden's given name not cleared for on-screen use (gdd.md:360, 396); story names need checks (gdd.md:946).
- Release-success measurement undecided before Epic 6; one option is "anonymous analytics with a consent prompt" (gdd.md:883, 968).
- Credits placement (in-game vs itch page) Not stated (epics.md:364).
- Phone/tablet detection method for the note: Not stated (gdd.md:797).
- Tuned † values touching UI: weapon warning at 3 s left (gdd.md:327), pit fade 0.5 s (gdd.md:345), card minimum ~1.5 s (gdd.md:659), loading-card reading ~3 s (gdd.md:647), held beat ~3 s (gdd.md:650), seal break ≤15 s (gdd.md:427).

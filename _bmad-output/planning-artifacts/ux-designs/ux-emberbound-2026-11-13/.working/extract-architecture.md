# Extract: architecture + project brief (UX-relevant facts)

Sources: `game-architecture.md` (v1.0, status complete, 2026-11-13, 1622 lines) and `docs/PROJECT_BRIEF.md` (300 lines), both read in full. The brief yields to BMad artifacts on conflict and is "not kept in sync after that" (PROJECT_BRIEF.md:5). † = "a starting guess, tuned with the developer in the epic named" (game-architecture.md:47).

## 1. Platform & runtime

- Desktop web browsers, HTML5 build on itch.io (game-architecture.md:10, 24); "current Chrome, Edge and Firefox; Safari best-effort" (game-architecture.md:63). Free on itch.io, v1 20 to 30 min (game-architecture.md:57).
- "Landscape, resizable, fullscreen. Phones and tablets get a note only." (game-architecture.md:66). Screen `deviceNote.ts` is "the note for phone and tablet visitors" (game-architecture.md:568, 1063); `platform/device.ts` exists (game-architecture.md:1045). Note wording: Not stated.
- Devices: "Keyboard and standard gamepads" (game-architecture.md:65). Desktop build (Electron, steamworks.js) later, not v1 (game-architecture.md:67; PROJECT_BRIEF.md:11, 143).
- Aspect ratio: logical view "at least 19 × 10.4 tiles"; the renderer "frames at least that box at any aspect ratio. Extra width on wide screens is visual only" (game-architecture.md:438-439; also 92, 335); "Wide screens show extra backdrop only" (game-architecture.md:656).
- Camera: perspective, narrow FOV "about 30° †"; may switch to orthographic with hand-made parallax if the Epic 0 style calls for it (game-architecture.md:541).
- Canvas: `render/renderer.ts` = "WebGLRenderer setup, resize, pixel ratio" (game-architecture.md:1048). Letterboxing/pillarboxing, reference resolution, min window size: Not stated.
- Pixel ratio: "Capped at 1.5 †; dropped to 1.0 if the pass needs it" (game-architecture.md:639).
- Fullscreen: supported (game-architecture.md:66); guarded in `platform/fullscreen.ts`, can be denied, fails independently (game-architecture.md:121-123, 701, 1045); itch.io iframe needs "permission for fullscreen" (game-architecture.md:174); checked on a private itch.io upload before release (game-architecture.md:598). How the player enters fullscreen (button/key): Not stated.
- Frame rate: 60 fps sustained; median ≤16.7 ms, p99 ≤20 ms over a full Level 1 run, 2020-era Iris Xe-class laptop at 1080p (game-architecture.md:108-111, 632).
- Refresh independence: identical at 60/120/144 Hz; fixed 60 Hz step, interpolated render; dt clamped to [0, 0.25] s; ≤5 steps per frame, backlog dropped (game-architecture.md:112-115, 332, 420-431).
- Loading: ≤30 MB total; "First input within 10 s on a 50 Mbit/s connection"; level transitions ≤3 s "(loading, behind the level-line card)" (game-architecture.md:117-119). Shared assets at boot, per-level assets behind the level-line card (game-architecture.md:513). Boot loading/progress screen: Not stated (only listed as a decision topic "loading and progress", game-architecture.md:311).
- Budgets (†): sim step ≤1 ms; ≤150 draw calls; ≤250k triangles; ≤256 MB GPU textures; one shadow map ≤2048²; "2 at most: outline and grading" post passes; no per-step allocation (game-architecture.md:633-640). Fonts 0.3 MB; story cards 1 MB total; code 1 MB gz (game-architecture.md:531, 535-536).
- itch.io: 1,000 files, 500 MB, 200 MB/file (game-architecture.md:120); relative URLs `base: './'` (game-architecture.md:590).
- Perf only on real hardware; headless frame rates "mean nothing" (PROJECT_BRIEF.md:251; game-architecture.md:175, 282).

## 2. UI technology

- Decision 12: "DOM overlay in plain TypeScript, no framework", rationale "Crisp text, no dependency" (game-architecture.md:341; also 34). ADR-7: "more code of our own, but no third-party update churn" (game-architecture.md:682-686).
- "The DOM overlay sits above the canvas: plain TypeScript modules, one per screen, plus CSS." Screens: "HUD, title, level select, results, settings, pause, card text, and the note for phone and tablet visitors" (game-architecture.md:567-568).
- Files: `src/ui/overlay.ts`; `ui/screens/` hud, title, levelSelect, results, settings, pause, cardText, deviceNote, levelError, perfReport; `ui/styles/` base.css, screens.css (game-architecture.md:1060-1064). Brief: `ui/` = "HUD and menus" (PROJECT_BRIEF.md:159).
- State reading: UI "reads the app state and `DeepReadonly<World>` each frame and only touches the DOM when a value changes"; sends commands (start, select level, change setting) to the app, "never to the simulation" (game-architecture.md:569). Loop calls `ui.update(world, app)` every frame (game-architecture.md:428).
- `PresentationSettings` snapshot passed per frame by `main.ts`: `reducedMotion`, `musicVolume`, `effectsVolume`, `isMuted`, `lastDevice`; "No presentation layer reads settings or devices any other way" (game-architecture.md:414, 1503).
- Wiring: `createUi(overlayEl, { dispatch: app.dispatch, playUiSound: audio.playUi })` (game-architecture.md:1381). UI sounds (menu move, confirm, back, pause) via callback "so `ui/` never imports `audio/`" (game-architecture.md:572).
- Boundary: `ui/` may import `core/`, `content/`, app command + read-only state types, `sim/` types, `sim/config.ts` values; must not import three.js, `render/`, `audio/` (game-architecture.md:1174).
- Fonts "self-hosted: no runtime requests to third parties" (game-architecture.md:571); `public/assets/fonts/` (game-architecture.md:977); `.woff2`/`.ttf` in Git LFS (game-architecture.md:1190). Typeface: Not stated.
- Text: story text from "one typed module keyed by moment", never hard-coded in screens (game-architecture.md:570, 793, 1500); `content/levels.ts` = "Level ids, order, display names" (game-architecture.md:1068). English only (game-architecture.md:137).
- Story cards: separate card scene, orthographic camera, flat silhouette planes, palette + light per card; "The text is in the DOM overlay" (game-architecture.md:100, 453, 552, 1094).
- Control signs "are scenery, not interface": carved waymarkers drawn by `render/level/controlSigns.ts`, icons from `public/assets/icons/` picked by last-used device (game-architecture.md:561, 573, 976, 1098); icon naming e.g. `icon-gamepad-south.*` (game-architecture.md:1129); placed as Tiled `ControlSign` entities (game-architecture.md:481).
- CSS classes kebab-case prefixed by screen: `hud-hearts`, `results-time` (game-architecture.md:1149).
- Error UI: release bug → small "Something went wrong" panel with "Restart level" (game-architecture.md:700, 745); asset fetch fails → retry once, then "a Retry panel" (game-architecture.md:702); "Players never see stack traces or technical text." (game-architecture.md:706).
- `?perf=1` report screen `ui/screens/perfReport.ts` ships in release (game-architecture.md:918, 924).
- HUD element list/layout: Not stated (only the `hud-hearts` example). Data available to it: `World.stats` (`clearSteps`, `respawns`, `hitsTaken`, `embersCollected`, `bellsFound`), ember meter, weapon pickups (game-architecture.md:382, 1029). Whether DOM UI uses palette-module data: Not stated.

## 3. Game/screen state machine

- Decision 7: "An app-level state machine outside the simulation"; "The simulation knows nothing about menus" (game-architecture.md:336). Owner `src/app/app.ts`: "Title, intro, loading, playing, pause, results, level select" (game-architecture.md:1038, 1088).
- Layers: App state (screen, level, first play or replay, settings, save) / Level state (`sim/` World incl. camera, story moments) / Presentation state (interpolation, mixers, particles, shake, voices, DOM) (game-architecture.md:357-363).
- "Boot → Title → (Intro cards, on a new save) → Level loading (level-line card) → Playing ⇄ Paused → end of level." (game-architecture.md:367). Title has "Continue" (game-architecture.md:102).
- End L1/L2: Results → next level loading (first play) or Level select (replay); replay that finds the 9th bell plays the all-bells card after results (game-architecture.md:368).
- End L3: closing card → all-bells card (if 9 bells) → Results; replays keep the order; "the held beat and the cards can be skipped" (game-architecture.md:369). Level select re-offers the all-bells card once 9 bells found (game-architecture.md:370).
- In-level story moments `sealBreak`, `heldBeat` are sim state; cards (intro, level-line, closing, all-bells) are app states (game-architecture.md:337, 443, 453, 676-680).
- During a moment: input ignored except skip ("jump or confirm") when `isStorySkippable` (replays); Rowan can't be hurt; enemy shots/attacks removed; ends `storyEnded` then `levelCompleted` (game-architecture.md:445-451). Seal break 14 s, held beat 3 s (†, Epic 4) (game-architecture.md:1270-1274).
- Commands: `AppCommand` union, imperative names e.g. `startLevel`, `changeSetting`, `togglePause`, `showLevelError` (game-architecture.md:745, 839). Screens use string-literal `state` + `stateSteps` pattern (game-architecture.md:1424).
- Death/respawn is in-sim: player `dead` state, `rowanDied`, `rowanRespawned{checkpointId}` (game-architecture.md:859-860, 1430). Game-over screen / app-level death state: Not stated. Brief fail rule: "3 hearts, checkpoints, respawn at last checkpoint" (PROJECT_BRIEF.md:62).
- "Leaving mid-level restarts that level." (game-architecture.md:125). Pause-menu options: Not stated. Results-screen contents: Not stated (brief: "Track time, bells and respawns per level", PROJECT_BRIEF.md:67).
- Brief story delivery: "Short intro, one line of text before each level, no dialogue during play" (PROJECT_BRIEF.md:69). Replay-form rule `levelForm`: L1/L2 beast, L3 changed (game-architecture.md:454, 826).

## 4. Input architecture

- Decision 11: action state per step, latched presses, device tracking, guarded gamepad (game-architecture.md:340).
- Keyboard events + polled gamepads → one action state; sim gets one `InputFrame` per step: `moveX` (-1/0/1), `up`, `down`, `jumpPressed`, `jumpHeld`, `spitPressed`, `spitHeld` (game-architecture.md:557).
- Latched until next step consumes it (game-architecture.md:558; PROJECT_BRIEF.md:177); presses go into buffers that hit-stop doesn't count down: "a press always registers" (game-architecture.md:390-391).
- Stick thresholds 0.35 sideways, 0.5 up/down (game-architecture.md:559).
- Gamepad reads in try/catch; first error disables gamepad for the session, logs once, keyboard keeps working (game-architecture.md:560, 719-730; PROJECT_BRIEF.md:219).
- Last-used device (keyboard or gamepad) → `PresentationSettings`, picks control-sign icons (game-architecture.md:561; `input/lastDevice.ts` 1046).
- App-level actions "pause, mute, and menu up, down, confirm and back" go to the app, never the sim; "Menus can be navigated with a gamepad." (game-architecture.md:562). Via `onAppAction` callback; `input/` never imports `app/` (game-architecture.md:1370, 1378).
- Stated keys: "M toggles the master mute" (game-architecture.md:578); F1 debug overlay, dev only (game-architecture.md:603, 912). Move/jump/spit/pause/confirm keys and gamepad buttons: Not stated.
- Files: `keyboard.ts`, `gamepadMapping.ts`, `actions.ts` (latching, InputFrame, menu actions), `lastDevice.ts` (game-architecture.md:1046). Input recording/replay (game-architecture.md:563, 608). Latching tested with synthetic events in Vitest (game-architecture.md:617).
- Remapping, key repeat, `preventDefault`, blur-time input clearing, gamepad hot-plug, rumble: Not stated.
- Touch: absent from arch; brief "Touch is optional", `input/` "keyboard, gamepad, touch", touch controls OPEN (PROJECT_BRIEF.md:71, 157, 295).
- Moves: "Run, variable-height jump, ember spit, aim up, aim down in the air, crouch" (PROJECT_BRIEF.md:60); aim 45° (PROJECT_BRIEF.md:199); arch adds drop-through and ledge grab from Epic 4 (game-architecture.md:85, 90).

## 5. Pause, focus and visibility

- "Auto-pause when the tab is hidden" (game-architecture.md:124); "A hidden tab sends Playing to Paused" (game-architecture.md:371); `platform/visibility.ts` (game-architecture.md:1045).
- Accumulator grows only "if app is Playing" (game-architecture.md:421); "Pausing stops the simulation steps; rendering and the interface keep running." (game-architecture.md:432).
- Clear time excludes pauses and story moments (game-architecture.md:104, 402). Hit-stop lives in the sim, skips steps 4 to 11 (game-architecture.md:391, 433).
- Resume behaviour on tab return, window blur (visible but unfocused), pausing during cards/story moments, pause on gamepad disconnect: Not stated.
- Dev handle `pause()`, `stepFrames(n)` (game-architecture.md:916).

## 6. Save & settings persistence

- Decision 14: versioned JSON in `localStorage`, in-memory fallback (game-architecture.md:343); one key `emberbound.save` (game-architecture.md:458).
- Schema: `{ version, progress: { unlockedLevel, introSeen, levels: { [levelId]: { bestClearSteps, bellsFound: bellId[] } } }, settings: { musicVolume, effectsVolume, reducedMotion } }` (game-architecture.md:460-465).
- Written at level end and on any setting change; read at boot, validated, migrated by `version` (game-architecture.md:467). Brief: "Auto-save at the end of each level; level select" (PROJECT_BRIEF.md:68). No mid-level save (game-architecture.md:125).
- Bells: union across replays; all-bells unlock derived from 9 bells, not stored (game-architecture.md:468-469).
- Storage error → in-memory store for the session (game-architecture.md:470); corrupt/old save → fresh save (game-architecture.md:702, 733-735); itch.io iframe storage may be partitioned or blocked, verify by Epic 6 (game-architecture.md:471).
- Settings defaults in `app/settings.ts` (game-architecture.md:794). `isMuted` is in `PresentationSettings` (game-architecture.md:414) but not in the save schema (game-architecture.md:464).
- Respawns, hits, embers live in `World.stats` per run (game-architecture.md:382); not in the save schema. Save slots, profiles, reset/delete progress: Not stated.

## 7. Audio

- Decision 13: Web Audio API directly, small mixer with buses, no library (game-architecture.md:342).
- `AudioContext` "created or resumed on the first user input on the title screen (browser autoplay rules)" (game-architecture.md:577).
- Buses: master, then music, effects, ambience; "The settings volumes map to the bus gains, and M toggles the master mute." (game-architecture.md:578). Settings expose only music + effects volumes (game-architecture.md:464, 794). Ambience volume setting, UI-sound bus: Not stated.
- Music: one loop per level; warden arrangement crossfades on `wardenPhaseChanged`; stingers once; seal break cuts music + stinger on `storyCueReached`; L3 fades out on `regionEntered` (`MusicFade`) (game-architecture.md:579-584). Ambience: one bed per level; great-wheel gain by distance (game-architecture.md:585).
- UI sounds: menu move, confirm, back, pause (game-architecture.md:572). Landing sound only above 9 tiles/s (game-architecture.md:822, 854).
- Failure: "audio stays off and the game runs" (game-architecture.md:586). A player-facing notice: Not stated.
- Formats chosen in Epic 3 with the tool; must loop gaplessly in Chrome/Edge/Firefox (game-architecture.md:519). Budget: music+ambience 8.5 MB, SFX 2 MB (game-architecture.md:533-534). Mix data `audio/mix.ts` (game-architecture.md:792).
- Audio tools OPEN (PROJECT_BRIEF.md:138, 237; game-architecture.md:78); "Blocks Epic 3's audio" (game-architecture.md:179).

## 8. Rendering & visual rules relevant to UI

- Art direction "Not decided"; "locked in milestone 0 from generated reference images" (PROJECT_BRIEF.md:79). Candidates: stylised dark fantasy (teal/plum, fog, "Warm light only on the hero, embers and lanterns") and comic illustration (flat colours, banded shading, ink outlines, "one dominant colour per level"); may combine (PROJECT_BRIEF.md:83-86).
- `docs/STYLE_GUIDE.md`: "palette with hex values, shading rule, outline rule, lighting rule, what warm colour is reserved for, and the reference images" (PROJECT_BRIEF.md:108); written in Epic 0 (game-architecture.md:957).
- "The renderer owns the style" (PROJECT_BRIEF.md:110-121; game-architecture.md:31-33): shared materials ground, foliage, character, prop, effect (PROJECT_BRIEF.md:114), arch adds backdrop and card-silhouette factories (game-architecture.md:544); only `render/materials` holds GLSL/ShaderMaterial/post passes (game-architecture.md:330, 543, 1492).
- Palette module: per level, named slots "(ground, foliage, hazard, warm, and so on)"; enemy recolours are palette swaps (game-architecture.md:546); `render/palettes/story.ts` for "scenes outside levels" (game-architecture.md:1052).
- Lighting rig per level: "key, fill, fog, and where warm light is allowed" (game-architecture.md:547; PROJECT_BRIEF.md:116).
- Passes: "edge outlines if the style has them, then colour grading and vignette" (PROJECT_BRIEF.md:117); max 2 (game-architecture.md:638).
- Look-dev page: any asset under game shaders/lighting "next to the style guide swatches" (PROJECT_BRIEF.md:119); `lookdev.html`, dev only, excluded from build (game-architecture.md:553, 590, 992).
- Depth layers: far, middle, play (z = 0), foreground "which never covers the play area (GDD)" (game-architecture.md:542).
- Camera (sim-owned): look-ahead in facing direction, vertical dead zone while airborne, re-centre on landing, clamp to bounds (PROJECT_BRIEF.md:178; game-architecture.md:437); rendering interpolates it (game-architecture.md:541).
- Shadows: one directional, texel-snapped, or blob; decided in Epic 0 (game-architecture.md:551; PROJECT_BRIEF.md:179).
- Story staging `render/fx/storyStaging.ts` stages camera, effects, model swap; "rendering keeps no timings of its own" (game-architecture.md:452, 1263).
- Critic loop: screenshots at fixed spots, compare with reference + style guide, top three problems, fix, "at most three rounds", then before/after to developer (PROJECT_BRIEF.md:241-247); "can the hero, enemies, hazards and pickups be told apart from the background at a glance?" (PROJECT_BRIEF.md:249). Arch: `make shots ROUND=n` → `shots/round-n/`, compared "by eye ..., never pixel-diffed" (game-architecture.md:242, 1359-1361, 1509).
- Screen transitions, fades, hurt vignette, other screen-space UI effects: Not stated.

## 9. Game feel hooks

- Hit feedback: "hit-stop, trauma-based shake, blink, flash, reduced motion" (game-architecture.md:91); hit-stop deterministic in sim, shake visual-only (game-architecture.md:166, 1087).
- `CONFIG.feedback` (game-architecture.md:816-825): hit-stop stomp 3 steps (0.05 s), rowanHurt 4 (0.06 s); trauma stomp 0.2, shotKill 0.12, rowanHurt 0.35, rowanDied 0.4; decay 1.6/s; `shakeMaxTiles` 2, "offset = shakeMaxTiles × trauma²"; blink 9 Hz; spit clip 0.2 s †, land clip 0.15 s †.
- Shake computed in rendering from events; "A new shake raises trauma to its value if that is higher, and never adds"; reduced motion turns it off (game-architecture.md:412). Blink derived from invulnerability timer + step count (game-architecture.md:413); invulnerability 1.3 s (PROJECT_BRIEF.md:200).
- FX modules: `render/fx/` particles, shake, flash, storyStaging (game-architecture.md:1057).
- Event channel: typed `SimEvent` union, past-tense camelCase, collected per frame for audio, render effects and UI; "No global event bus and no string event names outside these unions"; exhaustive switches (game-architecture.md:410, 834-845).
- `SimEvent` list (game-architecture.md:851-888):
  - Rowan: `rowanJumped`, `rowanLanded{impactSpeed}`, `shotFired{x,y,dirX,dirY}`, `rowanStomped{enemyId}`, `rowanHurt{source: enemy|enemyShot|spikes|warden}`, `rowanFellInPit`, `rowanDied`, `rowanRespawned{checkpointId}`, `ledgeGrabbed`, `ledgeClimbed`.
  - Enemies: `enemyHit{enemyId}` ("survived: flash"), `enemyKilled{enemyId,kind,by: shot|stomp}`, `spitterSwelled`, `seedFired`.
  - Progress: `emberCollected{total}`, `heartRestored`, `bellFound{bellId}`, `weaponCollected{tripleShot|piercingShot}`, `weaponRunningOut` ("3 s left"), `weaponExpired`, `checkpointReached{checkpointId}`, `regionEntered{regionId,kind}`.
  - Warden: `arenaEntered` ("door shut, warden awake"), `wardenWarned{attack}`, `wardenAttacked{attack}`, `wardenHit`, `wardenPhaseChanged{phase: 2}`, `wardenDefeated`.
  - Story/level: `storyStarted`, `storyCueReached{moment,cue}`, `storyEnded`, `levelCompleted`.
- Seal-break cues: sealShatter 2.5 s, wheelStop 3.5, millerSink 6, rowanChange 8, stinger 12, total 14 (†) (game-architecture.md:1270-1273).
- Spit/land overlay clips briefly override the base clip (game-architecture.md:1423, 1452-1460). Brief: squash-and-stretch spring went unstable at low fps; "Sub-step visual springs or use a stable integrator" (PROJECT_BRIEF.md:213). Rumble: Not stated.

## 10. Config & tuning

- Gameplay numbers only in `sim/config.ts`, GDD units, steps derived once, every † names its tuning epic, tests import values (game-architecture.md:385, 789). Typed `as const`, no runtime or remote config (game-architecture.md:783).
- Presentation may import `sim/config.ts` values, never mutate World (game-architecture.md:1179); render and audio read `CONFIG.feedback` (game-architecture.md:816).
- Other homes: `render/palettes/`, `render/lighting/`; `audio/mix.ts`; `content/storyText.ts`; player settings + defaults `app/settings.ts`; `import.meta.env` (game-architecture.md:791-795).
- Outside sim, time names end `…Seconds`/`…Ms` (e.g. `fadeSeconds`) (game-architecture.md:1142). UI timings (menu transitions, card hold times, results pacing): Not stated.
- Brief numbers incl. hearts 3, 1.3 s invulnerability, shot cooldown 0.2 s (PROJECT_BRIEF.md:181-200); "Retune only with the developer." (PROJECT_BRIEF.md:202). Feel regression test: full jump 3.30 tiles, tap ~0.8, air ~52 steps (game-architecture.md:830).

## 11. Accessibility

- "Reduced motion turns shake off. Hitboxes favour the player. English only, with story text kept apart from the art." (game-architecture.md:134-137; 412). `reducedMotion` saved and in `PresentationSettings` (game-architecture.md:414, 464, 794). Effect on flash, blink, hit-stop or camera: Not stated.
- Gamepad menu navigation (game-architecture.md:562); icons follow last-used device (game-architecture.md:561).
- Brief: no timer (PROJECT_BRIEF.md:63); difficulty "One setting, tuned generous" (PROJECT_BRIEF.md:70); "Pits must read as dark." "Hazards need contrast against their surroundings." "Keep hints clear of gameplay." (PROJECT_BRIEF.md:216-218).
- Remapping, colour-blind support, captions, text scaling, screen reader/ARIA, flash limits, hold/toggle options, visual cues when audio is off: Not stated.

## 12. Testing

- Decision 20: Vitest in Node for sim, levels, app logic; Playwright for smoke + screenshots (game-architecture.md:349).
- Vitest `src/app/*.test.ts`, `src/input/*.test.ts`: save validation/migration, app state machine, input latching (game-architecture.md:617).
- Smoke `tests/e2e/smoke.spec.ts`, headless Chromium + Firefox: "Boot, title, level, pause; no console errors; a gamepad error doesn't stop the frame loop; refused storage falls back" (game-architecture.md:618).
- "No DOM test environment is added (no jsdom): interface screens are checked through Playwright." (game-architecture.md:623).
- Dev handle `window.__emberbound`: `isReady()`, `getState()`, `gotoSpot(id)`, `pause()`, `stepFrames(n)` (game-architecture.md:916).
- Screenshot mode `?shot=<spotId>`: sim at stored spot, animations frozen, particles seeded (game-architecture.md:917, 1333-1335). Spots in `src/debug/spots.ts`; examples all in-level (`l1-start`, `l1-glade`, `l3-fallen-bell`) (game-architecture.md:1341-1344). Menu/HUD spots, and whether the HUD shows in shot mode: Not stated.
- Software WebGL in headless; screenshots never for perf (game-architecture.md:175, 282, 1361). First-load test: release build, throttled 50 Mbit/s (game-architecture.md:621).

## 13. Milestones M0 to M6 (PROJECT_BRIEF)

- Each becomes an epic; exit criteria → acceptance criteria; "Stop at the end of each and wait for the developer's approval." (PROJECT_BRIEF.md:255).
- M0 Reference and style lock: scaffold, key art per candidate, developer picks, STYLE_GUIDE.md, shared shaders, palette, lighting rig, look-dev page, test scene. Exit: "developer approves the look as rendered in the engine, not only the images." (PROJECT_BRIEF.md:257-258).
- M1 Grey-box core: sim + tests, input, camera, level loader, grey level, screenshot harness, "No art." Exit: every §4 mechanic works in tests "and feels right to the developer in the browser" (PROJECT_BRIEF.md:260-261).
- M2 Hero: full pipeline, all animations. Exit: matches concept in critic loop, animates cleanly (PROJECT_BRIEF.md:263-264).
- M3 Level 1 vertical slice: "Layout, art kit, three enemy types, pickups, checkpoints, HUD, audio." Exit: "a new player finishes level 1 without help; developer approves the look." (PROJECT_BRIEF.md:266-267).
- M4 First warden + seal-break moment (PROJECT_BRIEF.md:269). M5 Levels 2 and 3 (PROJECT_BRIEF.md:271). M6 Wrap: "Menus, saving, settings, performance pass on real devices. Optional desktop build." (PROJECT_BRIEF.md:273). M4 to M6 exit criteria: Not stated.
- Arch epic notes: Epic 0 camera/shadow style choices, perf budgets on test scene (game-architecture.md:541, 551, 628); Epic 2 clip timings (game-architecture.md:823-824); Epic 3 audio (game-architecture.md:179, 519); Epic 4 ledge grab, story timings (game-architecture.md:90, 1270); Epic 6 butler release, itch.io iframe checks, perf pass (game-architecture.md:253, 471, 598, 628). Which epic builds title/pause/settings screens: Not stated in arch (epic list lives in the GDD `epics.md`, game-architecture.md:14, not read here).

## 14. Hard rules from PROJECT_BRIEF constraining UI/visual work

- "Items marked **OPEN** are the developer's to decide ... Do not decide them silently." (PROJECT_BRIEF.md:7)
- "Small and finished beats large and empty. Reject scope growth unless the developer asks for it." (PROJECT_BRIEF.md:20)
- Vocabulary "(use these on screen)": Cindersworn, The Tithe, The Ember Below, Lord Maldrek the Tithe-Collector, Emberfire, Wardens of the six seals (PROJECT_BRIEF.md:30-39).
- "Timer: None. Show clear time at the end." "No arcade score. Track time, bells and respawns per level." (PROJECT_BRIEF.md:63, 67)
- Toki "reference only, do not copy content" (PROJECT_BRIEF.md:73); "Keep every name, character, level, piece of art and sound original." (PROJECT_BRIEF.md:279); avoid anything D&D invented (PROJECT_BRIEF.md:280); "The art style of another game is not protected; its characters and scenes are." (PROJECT_BRIEF.md:281)
- Generated images "are used once, in milestone 0, to choose a direction. From then on the look is defined in code" (PROJECT_BRIEF.md:112); "No asset ships its own lighting model." (PROJECT_BRIEF.md:114); "The reference for 'does this look right' is the look-dev page and the style guide, not a fresh generated image." (PROJECT_BRIEF.md:121)
- "Design the layout in grey boxes first." (PROJECT_BRIEF.md:208); "Art dresses a layout that already plays well." (PROJECT_BRIEF.md:233)
- Prototype lessons (PROJECT_BRIEF.md:212-219): clamp frame time to zero or above; stable visual springs; check aim sight lines; "Pits must read as dark."; "Hazards need contrast against their surroundings."; "A long hint box covered the play area on phones. Keep hints clear of gameplay."; "Wrap optional browser features (gamepad, storage, audio, fullscreen) in try/catch ... One failing optional feature must never stop the frame loop."
- Critic loop "After any visual change", max three rounds (PROJECT_BRIEF.md:241-247).
- Log asset, tool and licence in `docs/ASSETS.md` (PROJECT_BRIEF.md:229, 237); "Tool terms differ on commercial use of generated images, models and audio. Check each." (PROJECT_BRIEF.md:282). Arch: ASSETS.md holds "Every asset, tool, licence and AI flag" (game-architecture.md:958).

## 15. Open questions, TBDs and conflicts affecting UX

- Image model OPEN (PROJECT_BRIEF.md:137, 297); "blocks Epic 0's reference art" (game-architecture.md:1622).
- Audio tools OPEN (PROJECT_BRIEF.md:138); blocks Epic 3 audio and formats (game-architecture.md:179, 519).
- Level editor: OPEN in brief (PROJECT_BRIEF.md:139, 298); settled as Tiled 1.12.x by the developer 2026-11-13 (game-architecture.md:338, 658-662); CLAUDE.md and the GDD Dependencies table still list it open (game-architecture.md:1563-1564).
- Art style unresolved (PROJECT_BRIEF.md:79, 288); arch defers to it on perspective vs orthographic (game-architecture.md:541), outline/grading "if the style uses them" (game-architecture.md:277, 544), shadow type (game-architecture.md:551).
- Conflict, touch/mobile: brief "Touch is optional", touch in `input/`, touch OPEN (PROJECT_BRIEF.md:71, 157, 295) vs arch "Phones and tablets get a note only", keyboard + standard gamepads (game-architecture.md:65-66).
- Conflict, embers: brief "Embers as currency" (PROJECT_BRIEF.md:66) vs arch "the ember meter" and "Embers and healing", `heartRestored` event (game-architecture.md:870, 1029, 1084).
- Conflict, spots file: brief `tests/spots.ts` (PROJECT_BRIEF.md:243) vs arch `src/debug/spots.ts` (game-architecture.md:1070, 1333).
- Brief-OPEN items the arch already implements: checkpoints and respawn, with a "set hearts" dev cheat (PROJECT_BRIEF.md:292; game-architecture.md:87, 94, 914); weapons `tripleShot`, `piercingShot` (PROJECT_BRIEF.md:293; game-architecture.md:872); ledge grab as an ability (PROJECT_BRIEF.md:294; game-architecture.md:90); stomp kept (PROJECT_BRIEF.md:291; game-architecture.md:398); ending structure with closing card, held beat, all-bells card (PROJECT_BRIEF.md:52, 290; game-architecture.md:369).
- Final title OPEN, "working title" (PROJECT_BRIEF.md:3, 300; game-architecture.md:3); tool budgets OPEN (PROJECT_BRIEF.md:299).
- itch.io iframe behaviour (gamepad, storage, autoplay, fullscreen) unverified until a private upload (game-architecture.md:174, 471, 598). Perf, pixel-ratio and asset budgets are † (game-architecture.md:523, 628-639).
- Release-success measurement is an open GDD question; would be "a separate, consented feature" (game-architecture.md:754).
- Not stated in either doc: HUD contents and layout; key and button bindings; remapping; pause-menu and settings-screen contents beyond two volumes, reduced motion and mute; fullscreen control; boot/loading screen; death or game-over screen; results and level-select layouts; device-note wording; typeface; whether the DOM UI draws on the palette module.

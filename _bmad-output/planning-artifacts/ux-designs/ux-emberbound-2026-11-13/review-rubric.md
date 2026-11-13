# Spine Pair Review — Emberbound

## Overall verdict

The pair works as a contract. Every `{token}` reference resolves. All 16 colours carry a provisional hex, a role and a "never used for" rule, and the contrast table recomputes correctly. The 22 component names are identical across the DESIGN frontmatter, DESIGN.Components and EXPERIENCE.Component Patterns, and 44 of 47 spot-checked citations are exact. One gap has high downstream impact. The D1 deferral has a clean replacement rule, but no owner: Epic 0's style-guide scope does not include overlay colours or typefaces, and the spine's "replace at Epic 0" conflicts with its own "Epic 1 grey-box HUD". The medium gaps are: no UI timing values, pause and visibility behaviour outside plain play, the mute indicator's visibility, a component-to-architecture-module mapping that is claimed but missing, and journeys that never reach Settings, the confirm dialog or the Level 3 ending.

## 1. Flow coverage — adequate

What I checked: the sources name no player journeys (GDD extract §13; the log's D20 says the facilitator drafted them), so I checked the three drafted flows against the IA surfaces and the Epic 6 session-flow requirements (epics.md:349-356). Marta, Tomás and Ines each have a named protagonist, numbered steps and a bold climax. Marta and Tomás have failure paths. The steps agree with the IA, the Mermaid chart and the State Patterns (I checked respawn, replay form, the order of results and the all-bells card, and the audio-locked gate).

### Findings

- **medium** No journey lands on Settings, the confirm dialog, the device note, either error panel, or the Level 3 first-play ending (held beat → closing card → all-bells card if earned → results → title menu, after which Continue opens the level select). The Level 3 ending is the most order-sensitive sequence in the game and the only results → title path. Settings carries the one accessibility toggle with a non-obvious scope (D17). The surface-closure rule asks that every surface has a journey that lands on it (EXPERIENCE.md Key Flows, lines 283-326). *Fix:* add a fourth flow, for example Marta's second evening ending at the fallen bell in Harrowmere: held beat, closing card, results arriving after the story, back to the title. Fold Pause → Settings → Reduced motion and a Restart confirm into an existing flow or a short fifth one.
- **low** Ines's flow has no failure path (EXPERIENCE.md:315-326). *Fix:* add one line, for example she reaches the arch without the bell: "Bells 2 of 3", no card, back to the level select with focus on Emberwood.

## 2. Token completeness — adequate

What I checked: I extracted 45 `{path}` references (43 in DESIGN.md, 2 in EXPERIENCE.md) and resolved them against the frontmatter: all resolve. All 16 colours have hex. Type tokens all have family, size, weight and line height. I recomputed all seven contrast rows using WCAG 2.x relative luminance, compositing the scrim over white (#4A4B4D), and every stated ratio matches to rounding. I also judged the D1 deferral mechanics: roles, the replacement rule and the contrast targets.

### Findings

- **high** The D1 replacement has a rule but no owner, and its timeline contradicts itself. DESIGN.md:12-15 and :100 say "replace from STYLE_GUIDE.md at Epic 0", yet the same comment calls the values "a placeholder for the Epic 1 grey-box HUD", and :96 says the Epic 1 HUD "should look like a grey box". Epic 0 comes before Epic 1, so the two statements cannot both hold. Epic 0's STYLE_GUIDE.md scope (epics.md:37-44) lists palette, shading, outline, lighting, warm light, references and card style, but no overlay colour roles, no UI typefaces and no font licence or budget check. EXPERIENCE.md Notes for epics (:336) only carries F5. As written, no story will pick the three faces or re-measure the contrast table, and Epic 3's "final HUD" (epics.md:191) has no trigger to swap values. *Fix:* in DESIGN.md Colors, state the lifecycle once. Epic 0 picks values for these 16 roles and the three faces (OFL, ≤ 0.3 MB) and records the re-measured ratios in STYLE_GUIDE.md. DESIGN.md frontmatter is then updated through `gds-ux` Update at Epic 0's exit. The Epic 1 grey box may keep the greys. Epic 3's final HUD must use the replaced values. Add a [NOTE FOR EPICS] to extend Epic 0's STYLE_GUIDE list through `gds-correct-course`.
- **medium** No overlay timing values exist. Seven DESIGN component state lists include fading states. The HUD fades on `storyStarted`, the toast fades, the advance hint fades in, and screens change "by fades only" (EXPERIENCE.md:196). None of these has a duration. Each UI story will invent its own. *Fix:* add a provisional UI timing table, named `…Seconds` per game-architecture.md:1142 (for example `screenFadeSeconds`, `panelFadeSeconds`, `hudFadeSeconds`, `toastFadeSeconds`, `hintFadeSeconds`), in EXPERIENCE.md Interaction Primitives, naming the `ui/` module that owns them.
- **medium** `{spacing.tile}` hard-codes the logical view into CSS: `min(100vw / 19, 100vh / 10.4)` (DESIGN.md:47, :157). This duplicates the simulation's logical-view constants and the renderer's framing. DESIGN admits the Epic 0 camera may add margin, but `ui/` cannot import `render/` (DESIGN.md:105), so there is no route for the corrected value. *Fix:* have `ui/overlay.ts` set `--tile` from the logical-view values in `sim/config.ts` (an allowed import, game-architecture.md:1174) or from a framing value passed in app state, and add this to the Notes for architecture.
- **medium** HUD text and unbanded card text sit over art with no numeric target, and they contradict DESIGN's own Do's row. `hud-bell-toast`, the `hud-warden-bar` label and `card-text` where no band is used are `text-primary` straight over the world or card art (DESIGN.md:189, 191, 200). The Do's row says text belongs "on a panel, the screen ground or a scrim band" (DESIGN.md:218), and the HUD backing is "checked by eye" (DESIGN.md:138). *Fix:* add the HUD-text exception to the Do's row and a contrast row: `text-primary` against its `hud-outline` ring ≥ 3:1 (16.2 provisional), plus card text without a band allowed only where the look-dev page judgment passes.
- **low** The contrast table omits four load-bearing pairs, all of which pass. The "New best" tag (`surface-panel` on `text-primary`) is 14.9. `focus-ring` on `surface-screen` (device-note link) is 9.8. The slider fill (`text-muted` on `border-subtle`) is 4.5. `text-primary` against `hud-outline` is 16.2 (DESIGN.md:128-136). *Fix:* add these rows so Epic 0 re-measures them.
- **low** The HUD "soft shadow" (DESIGN.md:138) and the ember meter's full-meter glow (DESIGN.md:187) have no size or opacity. *Fix:* give each a value in tile units, either as a token or in the prose.
- **low** The rule for turning tokens into CSS custom properties is not stated; only `--tile` is named. `surface-scrim` uses 8-digit hex (`#0E0F11BF`), which some DESIGN.md tooling may not accept (DESIGN.md:18, :105). *Fix:* add one line, for example "tokens emit as `--{group}-{name}`; 8-digit hex is intentional", or split the scrim into a colour plus an opacity.

## 3. Component coverage — strong

What I checked: all 22 components appear with identical names, in the same order, in the DESIGN frontmatter, DESIGN.Components (anatomy plus visual states) and EXPERIENCE.Component Patterns (behaviour tied to `SimEvent`s and the `AppCommand` flow). Every row has real rules. Sub-elements map to a parent: weapon icon → `hud-weapon-timer`, "New best" tag → `results-stat`, rewatch row → `level-select-row`, Back and Continue rows → `menu-item`.

### Findings

- **low** Two visual specs are under-placed. The card advance hint's position ("lower right") lives only in EXPERIENCE.md:137; DESIGN `card-text` gives it no size, opacity or inset. The wordmark is used by four components with only a type token and no placement (DESIGN.md:202-206). *Fix:* move the hint's placement into DESIGN `card-text`, and add one line on wordmark placement and size.
- **low** In `device-note`, "Try anyway" lists click, tap and Enter but not the gamepad south button (EXPERIENCE.md:143). This breaks D19 "completable gamepad-only, all menus included". *Fix:* add south.

## 4. State coverage — adequate

What I checked: I walked all 17 IA rows for cold load, focus, error, offline or refused features, first play versus replay, and empty states. Boot, title menu, playing, results, level select and settings are thorough: storage refused, corrupt save, audio locked, gamepad error, fullscreen refused and an unlocked level never finished are all covered.

### Findings

- **medium** Pause and auto-pause are unspecified outside plain play: during an in-level story moment (14 s seal break, held beat), the 0.85 s death sequence, the pit fade, and while the loading card auto-advances. The State Patterns say story-moment "input ignored" (EXPERIENCE.md:169), but do Esc, P and Start count as input? D14 auto-pause applies to Playing, which includes story moments, so a hidden tab during the seal break would put the pause menu over a story moment with no HUD. A hidden tab during the loading card lets the level start unseen. *Fix:* add State Patterns rows for each case, for example "Esc / P / Start ignored during story moments, auto-pause still applies and Resume continues the moment" and "loading card holds until visible".
- **medium** The `hud-mute-indicator` visibility contradicts the HUD rules. Component Patterns say "every surface after the gate except where story owns the screen (cards, in-level moments)" (EXPERIENCE.md:127). HUD & Diegetic UI says the HUD is "hidden during in-level story moments, cards and loading" (EXPERIENCE.md:212). The loading card "takes no input except M" (EXPERIENCE.md:138), so M can be pressed while the indicator may be hidden. It is also not stated whether the indicator draws above or under the pause scrim, or whether `hud.ts` or the overlay owns it. The log's D7 only says "top-right while M-mute is on". *Fix:* state its surfaces (menus, loading card, play; not cards or in-level moments), say it draws above the scrim, and move ownership to the overlay, not the HUD.
- **low** Focus on return is unspecified: Settings Back → pause or title, Confirm Cancel → pause. "Default on the primary action" would put focus on Resume or Continue rather than the item that opened the sub-surface. *Fix:* state "focus returns to the item that opened it".
- **low** The card-input guard is ambiguous. "Presses before the ~1.5 s minimum are ignored" is followed by "Back skips the rest" (EXPERIENCE.md:137, :195), and it is unclear whether Back is gated too, or whether a press held from play carries into a card or the results screen. Gamepad east is both spit and Back (gdd.md:244), so spit-mashing at a Level 3 replay's closing card could skip both cards. *Fix:* "All card input, Back included, is ignored before the minimum; a press must begin after the screen appears."
- **low** Hold-to-repeat in menus is unspecified: a held arrow or stick on a list or on a volume slider. *Fix:* one line, either repeat after a delay or no repeat.
- **low** The results background after Level 3 is undefined. Results follow the closing and all-bells cards, not the world, yet DESIGN Elevation puts the results scrim "over the world" (DESIGN.md:169). *Fix:* name the ground for that case, for example the last card scene dimmed, or `surface-screen`.

## 5. Visual reference coverage — thin

What I checked: `imports/` is empty, and there are no `mockups/` or `wireframes/`. EXPERIENCE.md:23 says so and states "spines win on conflict" once. The F8 key-screen mocks (in-play HUD, results, level select) are in progress and not yet linked; their absence is expected and not counted as critical.

### Findings

- **medium** There is no visual reference for any surface. HUD geometry is prose only: the cluster is "at most about 3 × 0.75 tiles", the toast sits "to the right of the hearts", and the warden bar sits top-centre with its label above (DESIGN.md:159). *Fix:* when the F8 mocks are promoted, link them inline at DESIGN.md Layout & Spacing (HUD anchors), DESIGN.md Components (`results-stat`, `level-select-row`) and the EXPERIENCE.md IA, each naming what it illustrates.
- **low** F8 settled that pause and confirm stay spine-only, but the spines do not list which surfaces are intentionally spine-only (pause, confirm, settings, title, cards, device note, errors, boot). *Fix:* add one line under EXPERIENCE.md Foundation › Visual references.

## 6. Bloat & overspecification — adequate

What I checked: both files are mostly tables, and almost every row is load-bearing for a story. Pixel values appear only as worked examples of `--tile`. DESIGN prose carries editorial voice; EXPERIENCE prose stays functional.

### Findings

- **low** Foundation's "UI system (inherited)" (EXPERIENCE.md:20) restates architecture internals: the read-only `World`, `AppCommand`, `playUiSound` and `PresentationSettings`. *Fix:* keep the citation and the behavioural delta only.
- **low** "Open Questions & Notes for GDD" (EXPERIENCE.md:328-346, 19 lines) duplicates the log's [NOTE FOR GDD / ARCHITECTURE / EPICS] lists. *Fix:* keep only what a spine consumer must act on (the open assumption and the Epic 6 browser checks), and leave the cross-artifact backlog in `.decision-log.md`.

## 7. Inheritance discipline — adequate

What I checked: the `sources` paths resolve (four upstream files plus DESIGN.md as peer). I spot-checked 47 line citations across gdd.md, epics.md, game-architecture.md and PROJECT_BRIEF.md: 44 are exact, 2 are off by a line and 1 overclaims. These names are verbatim: level names (gdd.md:607-609), the approved vocabulary (gdd.md:675-682), pillar 1 (gdd.md:130), all 12 `SimEvent` names used (game-architecture.md:851-888), `PresentationSettings`, `AppCommand` and `playUiSound`. EXPERIENCE token references resolve to DESIGN tokens by name. Nothing in the spines contradicts `.decision-log.md`.

### Findings

- **medium** The claim that component names "match the screen-prefixed CSS class names" (EXPERIENCE.md:21, citing game-architecture.md:1149) is false for 12 of 22 components: `menu-item`, `panel`, `scrim`, `slider`, `toggle`, `confirm-dialog`, `notice-line`, `control-glyphs`, `card-text`, `loading-card`, `boot-loading-bar` and `error-panel`. The architecture's screen list (game-architecture.md:1062-1063) has no module for boot loading, the loading card, the confirm dialog or shared widgets. `error-panel` maps to `levelError.ts`, but the retry panel also serves boot loads. None of this is in the Notes for architecture (EXPERIENCE.md:334). *Fix:* add a "module / class prefix" column to Component Patterns, or declare shared widgets exempt (for example a `ui-` prefix). Add a [NOTE FOR ARCHITECTURE] for the new screen modules: boot, loading card and confirm.
- **low** Citation drift. DESIGN.md:150 (and log D3) cite game-architecture.md:531 for the 0.3 MB font budget, but :531 is the story-card budget; fonts are at :536. EXPERIENCE.md:334 cites game-architecture.md:134, a section heading; the content is at :135. *Fix:* correct the line numbers.
- **low** Term drift. The spines say "loading card", following the GDD (gdd.md:647). The architecture calls the same thing the "level-line card" and the "Level loading" state (game-architecture.md:367, 453, 513). *Fix:* add a one-line alias in EXPERIENCE.md Foundation so story writers map `loading-card` to the architecture's state.
- **low** The IA table, the Mermaid chart and the prose disagree in two places. The chart lacks the IA's "Continue when everything is finished → Level select" edge (EXPERIENCE.md:43 vs :58-59). `errRetry` returns only to `loading` (:92), although the IA and :95 say it retries the boot load too. The IA "Loading card" row (:34) also omits Intro cards and Retry as entry points. *Fix:* add `titleMenu -->|"Continue, all finished"| levelSelect` and `errRetry -->|"Retry, boot"| boot`, and extend the IA row.
- **low** The one open [ASSUMPTION] (replay loading card shows the name only; log, last line) is presented as settled fact in Ines step 2 (EXPERIENCE.md:320) and is built into the `loading-card` row (:138). *Fix:* resolve it with the developer before setting `status: final`, or mark Ines step 2 as an assumption.
- **low** Some decisions in the spines are not in the log. They are invented, though none contradicts it:
  - Back resumes from the pause menu and does nothing on the title menu (EXPERIENCE.md:193).
  - Esc means Back on screens opened from pause (EXPERIENCE.md:193).
  - The mute indicator's visibility scope (EXPERIENCE.md:127).
  - The gamepad notice also appears on the title menu (EXPERIENCE.md:141; Q7 says pause).
  - Fullscreen is not saved and mirrors the real state (EXPERIENCE.md:133).
  - The advance hint sits at the lower right (EXPERIENCE.md:137).
  - The overlay stacking order, with the error panel topmost (DESIGN.md:165-172).
  - Card-text placement is fixed on the sample card (DESIGN.md:161).
  - The comic-style ink-outline rule (DESIGN.md:180).
  - A stick past the play thresholds sets the last device (EXPERIENCE.md:221).
  - "Animate only opacity and transform" (EXPERIENCE.md:260).

  *Fix:* log them at the next Update.

## 8. Shape fit — strong

What I checked: DESIGN.md has all eight canonical sections in locked order. EXPERIENCE.md has all eight required defaults. The game-specific sections HUD & Diegetic UI, Input Schemes, Game Feel & Juice and Responsive & Platform are present because the content triggers them. Inspiration & Anti-patterns is present, as required by the Toki, Celeste and Hollow Knight references and the rejected patterns. Two sections are invented: Browser Constraints earns its place, because the browser and iframe are the platform. Open Questions & Notes for GDD only partly earns its place (see 6). Section order matches the game and mobile examples.

### Findings

- No findings beyond 6.2.

## Mechanical notes

- **Token references:** 45 in total (DESIGN 43, EXPERIENCE 2), all resolved. `spacing.2` and `spacing.3` are defined but never referenced; the prose range "`{spacing.1}` to `{spacing.6}`" covers them.
- **Colours:** 16 tokens, all hex. `surface-scrim` is 8-digit hex. Contrast rows recomputed: 14.9/16.2/11.5, 7.2/7.9/5.6, 7.4 (3.6 muted), 9.0/7.0, 12.3/6.2/9.7/7.2/15.4, 4.9, 6.1 to 19.2. All match.
- **Component names:** 22, identical and in the same order in DESIGN frontmatter, DESIGN.Components and EXPERIENCE.Component Patterns. No other kebab-case component names appear in either file.
- **Mermaid** (EXPERIENCE.md:49-93): valid `flowchart TD`. Every label is quoted, `-->|"…"|` and `-.->|"…"|` edges are valid, the rhombus `{"…"}` is valid, and no id is a reserved word (`end`, `graph`, `subgraph`, `style`, `class`, `click`). Two edge gaps against the IA are listed in 7.
- **IA, Mermaid and State Patterns:** they agree except for the two edges above and the IA "Loading card" entry points. Every IA surface has at least one State Patterns row, either its own or shared ("Every menu", "Cards").
- **Citations:** 47 checked. 44 are exact. 2 are off by a line (fonts :531→:536; :134→:135). 1 overclaims (:1149, class-name match).
- **Frontmatter:** both files are `status: draft` and `updated: 2026-11-13`. `sources` paths resolve. DESIGN.md adds `status`, `created`, `updated` and `sources` beyond the spec's keys, which is tolerated.
- **Decision log:** no contradictions. The invented decisions are listed in 7. One [ASSUMPTION] is still open (the replay loading card).
- **Visual references:** `imports/` is empty, and there is no `mockups/` or `wireframes/`. "Spines win on conflict" is stated once, at EXPERIENCE.md:23.

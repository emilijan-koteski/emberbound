# Validation Report — Emberbound

- **DESIGN.md:** `/mnt/data/Projects/personal/emberbound/_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md`
- **EXPERIENCE.md:** `/mnt/data/Projects/personal/emberbound/_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md`
- **Run at:** 2026-11-13

## Overall verdict

The pair works as a contract. Every `{token}` reference resolves. All 16 colours carry a provisional hex, a role and a "never used for" rule, and the contrast table recomputes correctly. The 22 component names are identical across the DESIGN frontmatter, DESIGN.Components and EXPERIENCE.Component Patterns, and 44 of 47 spot-checked citations are exact.

One gap has high downstream impact. The D1 deferral has a clean replacement rule, but no owner: Epic 0's style-guide scope does not include overlay colours or typefaces, and the spine's "replace at Epic 0" conflicts with its own "Epic 1 grey-box HUD". The medium gaps are: no UI timing values, pause and visibility behaviour outside plain play, the mute indicator's visibility, a component-to-architecture-module mapping that is claimed but missing, and journeys that never reach Settings, the confirm dialog or the Level 3 ending. Only the rubric walker ran (F7), so this synthesis is that lens alone.

## Category verdicts

- Flow coverage — adequate
- Token completeness — adequate
- Component coverage — strong
- State coverage — adequate
- Visual reference coverage — thin
- Bloat & overspecification — adequate
- Inheritance discipline — adequate
- Shape fit — strong

## Findings by severity

### Critical (0)

None.

### High (1)

**[Token completeness]** — D1 replacement has no owner and a contradictory timeline (§ DESIGN.md:12-15, 96, 100; epics.md:37-44; EXPERIENCE.md:336)  
DESIGN says "replace from STYLE_GUIDE.md at Epic 0" but also calls the values "a placeholder for the Epic 1 grey-box HUD". Epic 0 comes before Epic 1, so both cannot hold. Epic 0's STYLE_GUIDE scope has no overlay colour roles, UI typefaces or font licence and budget check, and Notes for epics carries only F5. As written, no story picks the three faces or re-measures the contrast table, and Epic 3's "final HUD" (epics.md:191) has no trigger to swap values.  
Fix: State the lifecycle once in DESIGN.md Colors. Epic 0 picks values for the 16 roles and the 3 faces (OFL, ≤ 0.3 MB) and records the re-measured ratios. DESIGN.md is updated through `gds-ux` Update at Epic 0 exit. The Epic 1 grey box may stay grey. Epic 3's final HUD must use the new values. Add a [NOTE FOR EPICS] to extend Epic 0's STYLE_GUIDE list through `gds-correct-course`.

### Medium (8)

**[Flow coverage]** — Five surfaces and the Level 3 ending have no journey (§ EXPERIENCE.md Key Flows, 283-326)  
No flow lands on Settings, the confirm dialog, the device note, either error panel, or the Level 3 first-play ending (held beat → closing card → all-bells card if earned → results → title, after which Continue opens the level select). That ending is the most order-sensitive sequence and the only results → title path. Settings carries the reduced-motion toggle, whose scope is non-obvious (D17).  
Fix: Add a fourth flow ending at the fallen bell in Harrowmere. Fold Pause → Settings → Reduced motion and a Restart confirm into an existing flow or a short fifth one.

**[Token completeness]** — No overlay timing values (§ DESIGN.md Components; EXPERIENCE.md:196)  
Seven DESIGN component state lists include fading states. The HUD fades on `storyStarted`, the toast and advance hint fade, and screens change "by fades only". None of these has a duration, so each UI story will invent its own.  
Fix: Add a provisional UI timing table named `…Seconds` (game-architecture.md:1142), for example `screenFadeSeconds`, `panelFadeSeconds`, `hudFadeSeconds`, `toastFadeSeconds`, `hintFadeSeconds`, and name the `ui/` module that owns it.

**[Token completeness]** — `{spacing.tile}` duplicates the logical view in CSS (§ DESIGN.md:47, 105, 157)  
`min(100vw / 19, 100vh / 10.4)` hard-codes the simulation's logical-view constants and the renderer's framing. DESIGN admits the Epic 0 camera may add margin, but `ui/` cannot import `render/`, so the corrected value has no route into the overlay.  
Fix: Have `ui/overlay.ts` set `--tile` from the logical-view values in `sim/config.ts` (an allowed import, game-architecture.md:1174) or from a framing value in app state. Add this to the Notes for architecture.

**[Token completeness]** — Text over art has no target and contradicts the Do's row (§ DESIGN.md:138, 189, 191, 200, 218)  
`hud-bell-toast`, the `hud-warden-bar` label and unbanded `card-text` are `text-primary` straight over art, while the Do's row says text belongs on a panel, the screen ground or a scrim band. The HUD backing is checked "by eye" only.  
Fix: Add the HUD-text exception to the Do's row and a contrast row: `text-primary` vs its `hud-outline` ring ≥ 3:1 (16.2 provisional). Allow unbanded card text only where the look-dev page judgment passes.

**[State coverage]** — Pause and auto-pause outside plain play unspecified (§ EXPERIENCE.md:169-170)  
Not covered: the seal break (14 s) and held beat, the 0.85 s death sequence, the pit fade, and the auto-advancing loading card. "Input ignored" during story moments leaves Esc, P and Start ambiguous. A hidden tab during the seal break would put the pause menu over a story moment with no HUD; a hidden tab during the loading card lets the level start unseen.  
Fix: Add State Patterns rows, for example "Esc / P / Start ignored during story moments; auto-pause still applies; Resume continues the moment" and "loading card holds until visible".

**[State coverage]** — Mute indicator visibility contradicts the HUD rules (§ EXPERIENCE.md:127, 138, 212)  
Component Patterns: shown "on every surface after the gate except cards and in-level moments". HUD & Diegetic UI: the HUD is hidden during cards and loading. The loading card accepts M, so feedback may be missing there. Whether it sits above or under the scrim, and which module owns it, is not stated. The log's D7 only says "top-right while M-mute is on".  
Fix: List its surfaces (menus, loading card, play; not cards or in-level moments), say it draws above the scrim, and give it to the overlay, not the HUD.

**[Visual reference coverage]** — No visual reference for any surface (§ EXPERIENCE.md:23; DESIGN.md:159)  
HUD geometry (cluster size, toast offset, warden bar and label) is prose only. The F8 mocks are pending and their absence is not critical.  
Fix: When the F8 mocks are promoted, link them inline at DESIGN Layout & Spacing (HUD anchors), DESIGN Components (`results-stat`, `level-select-row`) and the EXPERIENCE IA, each naming what it illustrates.

**[Inheritance discipline]** — Component names do not match architecture modules or class prefixes (§ EXPERIENCE.md:21, 334; game-architecture.md:1062-1063, 1149)  
The claimed match with "screen-prefixed CSS class names" is false for 12 of 22 components. The architecture has no screen module for boot loading, the loading card, the confirm dialog or shared widgets. `error-panel` maps to `levelError.ts`, but the retry panel also serves boot. None of this is in the Notes for architecture.  
Fix: Add a "module / class prefix" column, or exempt shared widgets (for example a `ui-` prefix). Add a [NOTE FOR ARCHITECTURE] for the boot, loading-card and confirm modules.

### Low (18)

**[Flow coverage]** — Ines's flow has no failure path (§ EXPERIENCE.md:315-326)  
The replay journey has no branch for missing the bell.  
Fix: Add one line: she reaches the arch without it, results read "Bells 2 of 3", no card plays, and she is back at the level select.

**[Token completeness]** — Contrast table omits four passing load-bearing pairs (§ DESIGN.md:128-136)  
Missing rows: the "New best" tag (`surface-panel` on `text-primary`, 14.9), `focus-ring` on `surface-screen` (9.8), the slider fill `text-muted` on `border-subtle` (4.5), and `text-primary` vs `hud-outline` (16.2).  
Fix: Add these rows so Epic 0 re-measures them.

**[Token completeness]** — HUD shadow and ember glow have no values (§ DESIGN.md:138, 187)  
The "soft shadow" and the full-meter glow have no size or opacity.  
Fix: Give each a value in tile units, either as a token or in the prose.

**[Token completeness]** — No token-to-CSS naming rule; 8-digit hex scrim (§ DESIGN.md:18, 105)  
Only `--tile` is named. `surface-scrim` is `#0E0F11BF`, which some DESIGN.md tooling may reject.  
Fix: Add one line, for example "tokens emit as `--{group}-{name}`; 8-digit hex is intentional", or split the scrim into a colour plus an opacity.

**[Component coverage]** — Advance hint and wordmark under-placed (§ EXPERIENCE.md:137; DESIGN.md:202-206)  
The advance hint's position ("lower right") lives only in EXPERIENCE, with no size or opacity in DESIGN `card-text`. The wordmark is used by four components with only a type token.  
Fix: Move the hint placement into DESIGN `card-text`, and add one line on wordmark placement and size.

**[Component coverage]** — Device note "Try anyway" not reachable by gamepad (§ EXPERIENCE.md:143)  
Lists click, tap and Enter only. This breaks D19: completable gamepad-only, all menus included.  
Fix: Add the south button.

**[State coverage]** — Focus on return unspecified (§ EXPERIENCE.md:159, 174, 176)  
After Settings Back or Confirm Cancel, "default on the primary action" lands on Resume or Continue rather than the opener.  
Fix: State "focus returns to the item that opened it".

**[State coverage]** — Card-input guard ambiguous for Back and carried presses (§ EXPERIENCE.md:137, 195; gdd.md:244)  
It is unclear whether Back is gated by the ~1.5 s minimum, or whether a press held from play counts. Gamepad east is both spit and Back, so spit-mashing at a Level 3 replay's closing card could skip both cards.  
Fix: "All card input, Back included, is ignored before the minimum; a press must begin after the screen appears."

**[State coverage]** — Menu hold-to-repeat unspecified (§ EXPERIENCE.md Interaction Primitives)  
Behaviour of a held arrow or stick on lists and volume sliders is not stated.  
Fix: One line: either repeat after a delay or no repeat.

**[State coverage]** — Results background after Level 3 undefined (§ DESIGN.md:169)  
Level 3 results follow cards, not the world, yet the results scrim is "over the world".  
Fix: Name the ground for this case, for example the last card scene dimmed, or `surface-screen`.

**[Visual reference coverage]** — Spine-only surfaces not listed (§ EXPERIENCE.md:23)  
F8 kept pause and confirm spine-only, but the spines do not record which surfaces are intentionally unmocked.  
Fix: Add one line under Foundation › Visual references.

**[Bloat & overspecification]** — Foundation restates architecture internals (§ EXPERIENCE.md:20)  
Restates the read-only `World`, `AppCommand`, `playUiSound` and `PresentationSettings`.  
Fix: Keep the citation and the behavioural delta only.

**[Bloat & overspecification]** — Open Questions section duplicates the log (§ EXPERIENCE.md:328-346)  
Nineteen lines repeat the log's cross-artifact NOTE lists.  
Fix: Keep only what a consumer must act on (the open assumption and the Epic 6 browser checks); leave the backlog in `.decision-log.md`.

**[Inheritance discipline]** — Citation drift (§ DESIGN.md:150; EXPERIENCE.md:334)  
game-architecture.md:531 is the story-card budget; fonts are at :536 (the same error is in log D3). :134 is a heading; the content is at :135.  
Fix: Correct the line numbers.

**[Inheritance discipline]** — "Loading card" vs "level-line card" (§ EXPERIENCE.md Foundation)  
The architecture names the same thing the "level-line card" and the "Level loading" state (game-architecture.md:367, 453, 513).  
Fix: Add a one-line alias.

**[Inheritance discipline]** — IA, Mermaid and prose disagree on two edges (§ EXPERIENCE.md:34, 43, 58-59, 92, 95)  
The chart lacks "Continue when everything is finished → Level select". `errRetry` only returns to `loading`, though the boot load is also retried. The IA "Loading card" row omits Intro cards and Retry.  
Fix: Add `titleMenu -->|"Continue, all finished"| levelSelect` and `errRetry -->|"Retry, boot"| boot`, and extend the IA row.

**[Inheritance discipline]** — Open [ASSUMPTION] presented as fact (§ EXPERIENCE.md:138, 320)  
The replay loading card showing the name only is still open in the log, yet Ines step 2 states it as settled.  
Fix: Resolve it before `status: final`, or mark the step as an assumption.

**[Inheritance discipline]** — Decisions in the spines not in the log (§ EXPERIENCE.md:127, 133, 137, 141, 193, 221, 260; DESIGN.md:161, 165-172, 180)  
Back resumes from pause and does nothing on the title menu. Esc means Back on screens opened from pause. The mute indicator's scope. The gamepad notice also on the title menu. Fullscreen not saved. The hint at the lower right. The stacking order. Card-text placement on the sample card. The comic ink-outline rule. A stick sets the last device. "Animate only opacity and transform". None contradicts the log.  
Fix: Log them at the next Update.

## Mechanical notes

- Token references: 45 (DESIGN 43, EXPERIENCE 2), all resolved. `spacing.2` and `spacing.3` are unreferenced, but the prose range "`{spacing.1}` to `{spacing.6}`" covers them.
- Colours: 16, all hex. Contrast rows recomputed (WCAG 2.x); all match the stated ratios to rounding.
- Component names: 22, identical and in the same order in DESIGN frontmatter, DESIGN.Components and EXPERIENCE.Component Patterns.
- Mermaid (EXPERIENCE.md:49-93): valid `flowchart TD`. Labels are quoted, `-->|"…"|` and `-.->|"…"|` edges are valid, and no reserved-word ids are used. Two edge gaps against the IA are listed under Inheritance.
- IA, Mermaid and State Patterns otherwise agree. Every IA surface has a State Patterns row, its own or shared.
- Citations: 47 checked; 44 exact, 2 off by a line, 1 overclaim.
- Frontmatter: both files are `status: draft` and `updated: 2026-11-13`; `sources` resolve.
- Decision log: no contradictions. One [ASSUMPTION] is open (the replay loading card).
- Visual references: `imports/` is empty, and there is no `mockups/` or `wireframes/`. "Spines win on conflict" is stated once (EXPERIENCE.md:23).

## Reviewer files

- `review-rubric.md`

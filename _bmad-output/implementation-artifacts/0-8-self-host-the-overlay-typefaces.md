---
baseline_commit: 1ddab1d02eb7abb4c8520151bee5c36cd917c245
---

# Story 0.8: Self-host the overlay typefaces

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the overlay typefaces self-hosted, licensed and within their budget,
so that every overlay surface from Epic 1 on can use the chosen faces with no request to another server and no surprise in the download.

**Requirements:** AR152 (fonts budget), AR157, UX-DR6 (the faces), UX-DR7, UX-DR61
**Epic:** 0, Reference and style lock. Stories 0.1 to 0.7 are done (0.7 is commit `1ddab1d`). This story ships four font files and two licence files, declares them in `base.css`, and adds one look-dev view with its checks. It does **not** change any typography token: DESIGN.md and the tokens keep `system-ui` until story 0.14 (`gds-ux` Update).

## Acceptance Criteria

The epic's ACs, made exact. Where this story reads the epic differently, the decision is in Dev Notes › Decisions (D1–D12), and the developer can veto it at review.

### The files

1. **Given** the faces in `docs/STYLE_GUIDE.md` › Typefaces (two faces for three roles), **then** `public/assets/fonts/` holds exactly these files, byte-identical to their sources (SHA-256 below):

   | Shipped file | Source | Bytes | SHA-256 |
   | --- | --- | --- | --- |
   | `alegreya-latin-400-normal.woff2` | npm `@fontsource/alegreya@5.3.0`, `package/files/alegreya-latin-400-normal.woff2` | 22,884 | `7cbcf38a5ef682a8b9e2ef4a330b31a08b33bf1ae08e338267c0d1292479c68a` |
   | `alegreya-latin-600-normal.woff2` | same package, `…-600-normal.woff2` | 24,448 | `613096d65a0b482ba1576510fcbed26db985c67aaa76d76b233321e75d1ff1ba` |
   | `alegreya-latin-700-normal.woff2` | same package, `…-700-normal.woff2` | 24,352 | `1c582501cee54f7137a80732266cbd3f0e9ef1f0e85d093228fb4f4db852df4e` |
   | `source-sans-3-vf-upright.woff2` | Adobe release 3.052R, `WOFF2-source-sans-3.052R.zip` › `WOFF2/VF/SourceSans3VF-Upright.ttf.woff2`, renamed only (D1) | 170,188 | `5f16566f7a40d39b339ad26be151fa5a1ab1f0c2574c7a2e619765584a1acbd8` |
   | `OFL-alegreya.txt` | `https://raw.githubusercontent.com/huertatipografica/Alegreya/2268f9e49bd8b13e095f76dd941792fa72d2d379/OFL.txt` | 4,395 | `f6f60d5d4cf4f4b1fc4e41353c897a2f5a16e6396c0cd8fa8bdfd2f4586a9a68` |
   | `OFL-source-sans-3.txt` | `https://raw.githubusercontent.com/adobe-fonts/source-sans/3.052R/LICENSE.md` | 4,579 | `89ad2c4f66dd29127527493e729c31e731f111cf10faf5774c3db9275ed0c22c` |
   | **Total** | | **250,846** | within 300,000 (0.3 MB) |

   Sizes and hashes were measured at story creation (2026-11-14) on files fetched from those URLs. If a hash differs on download, stop and report; don't ship a different file.
2. Only the weights the typography tokens use are shipped: Alegreya 400, 600, 700 (display-body, display-lg, display-xl) as static files; Source Sans 3 as Adobe's one unmodified variable file covering 400, 500, 600 (ui-*, numeric-*). Its Reserved Font Name rules out a subset (style guide).
3. The `.woff2` files are stored in Git LFS (the existing `*.[wW][oO][fF][fF]2` rule in `.gitattributes`); the two `.txt` files stay in plain git. No `.gitattributes` change.
4. `make build`'s budget sheet shows the **Fonts** row at 250,846 bytes, within its 0.300 MB budget (`scripts/checkBudgets.ts` already classifies `assets/fonts/**`, licence files included). No change to `checkBudgets.ts`.
5. The files fit, so no subsetting is proposed. (Had they not, subsetting to Latin plus the story text's punctuation would have gone to the developer first, with any tool it needs; no tool is added without his approval.)

### The log

6. **Given** the font files, **then** `docs/ASSETS.md` › Assets has one row per `.woff2` (file, source as the "Tool", licence, AI-generated **no**, Prompt "—", Attempts "—", date), and a **Fonts** note under the table with: each face's designer, version, source URL and package or release, the SHA-256 of each shipped file, the licence (SIL OFL 1.1; Source Sans 3 with Reserved Font Name "Source"), and where its licence file ships.
7. The note says the OFL asks for **no credit inside the game**; it asks that the copyright notice and licence travel with the font, which the two shipped `.txt` files do. It still **flags both faces for the Credits question in Epic 6** (story 6.17, credit requirements), as the style guide asks.

### The `@font-face` rules

8. **Given** `src/ui/styles/base.css`, **then** it declares four `@font-face` rules before the `.ui-overlay` rule: family `'Alegreya'` at weights 400, 600, 700, and family `'Source Sans 3'` at `font-weight: 200 900`, each `font-style: normal`, `font-display: block` (D2), `src: url('/assets/fonts/<file>') format('woff2')` (D3). No `unicode-range` (D4).
9. Every typography token in `base.css` and DESIGN.md is unchanged (`system-ui, sans-serif`); `make test`'s token drift test passes untouched (it already ignores `@font-face`, `scripts/designTokens.test.ts:289`). No new custom property.

### No other host

10. **Given** the look-dev page, **when** any view loads, **then** a Playwright check in `tests/e2e/lookdev/fonts.spec.ts` finds every request (`page.on('request')`) going to the dev server's own host; only `data:` and `blob:` URLs are also allowed (readiness proposal 2026-11-13, Q12).
11. **When** the type view loads, **then** the same check finds each of the four `.woff2` files requested from `/assets/fonts/` with status 200, and `document.fonts` holds exactly four faces from `base.css` (3 × Alegreya, 1 × Source Sans 3), each with `status === 'loaded'`. This keeps check 10 from passing vacuously.

### The type view

12. **Given** the look-dev type view (`?view=type`, `src/lookdev/typeView.ts`, listed in `LOOKDEV_VIEWS` after `palettes`), **then** it draws inside the overlay root (`createOverlay`), so sizes come from the typography token properties and `--tile`. Only `font-family` is set to the face's name directly (D5).
13. Each face shows in each weight it ships for: Alegreya 400, 600, 700; Source Sans 3 400, 500, 600 (D6). Each sample row sits at the size, weight, line height and letter spacing of the token(s) that use that face and weight, one row per token (8 rows), with a label giving the token, the face by name, the computed size in px and the weight. The face's status shows beside its name ("loaded" or "not loaded", from `document.fonts.check`).
14. The wordmark **"Emberbound"** (working title) shows in `display-xl`'s size, weight 700, `0.02em` letter spacing and `text-primary`, in Alegreya (style guide › Wordmark; UX-DR61). A comment notes it changes after the Epic 6 name check.
15. **Every character the version-one story text uses** shows in Alegreya, at `display-lg` and at `display-body`, as one sorted line of unique characters. The set is computed, never typed: from the "Line" column of every table in the narrative design's **Story Text Script (version one)** section, up to "**Script notes:**" (D7). Today that is 10 lines; the set includes `“` (U+201C), `”` (U+201D) and the straight apostrophe.
16. The view says plainly, in page text, that the typography tokens still name `system-ui` until story 0.14, and shows each face beside the tokens it will serve (Alegreya: display-xl, display-lg, display-body; Source Sans 3: ui-lg, ui-md, ui-sm, numeric-lg, numeric-md).
17. **Glyph check** (beyond "by eye", D8): `fonts.spec.ts` asks Chromium which fonts rendered the character-set rows (CDP `CSS.getPlatformFontsForNode`) and finds Alegreya only, with no fallback font. A control node with `Ж` (not in the Latin subset), injected by the test, must report a non-Alegreya font, so the check can fail. The same is checked for the Source Sans 3 rows.
18. Spots `lookdev-type-1080` (1920 × 1080) and `lookdev-type-720` (1280 × 720) in `spots.ts`. At both sizes the overlay root doesn't overflow (`scrollHeight - clientHeight` and `scrollWidth - clientWidth` both 0), as `lookdev.spec.ts` checks the overlay view.

### Tabular figures

19. **Given** the numeric role, **when** `0:00.0` and `1:11.1` are set in Source Sans 3 with `font-variant-numeric: tabular-nums` at `numeric-lg` (600) and at `numeric-md` (500) on the type view, **then** `fonts.spec.ts` measures each pair (`getBoundingClientRect().width`) equal to within 0.01 px, after checking the face is loaded (readiness proposal 2026-11-13, Q12; UX-DR7).

### The critic loop

20. **Given** the type view at 1920 × 1080 and 1280 × 720, **when** the critic loop runs (`make shots ROUND=n`, at most 3 rounds), **then** each shot is opened and looked at before it is described; the faces are compared with the style guide (never with a generated image) and checked for legibility at both sizes; the three biggest problems are written down, most important first, and fixed.
21. The developer sees the before and after shots and signs off.

### Done means checked

22. `make check`, `make build`, `make smoke` and `make shots ROUND=<n>` pass. The game's `index.html` graph still imports no `base.css` (Epic 1 does), so the build's code is unchanged; `dist/assets/fonts/` holds the six files.

## Tasks / Subtasks

- [x] **T0: Baseline** (AC: all)
  - [x] `git status` is clean apart from this story file and `sprint-status.yaml` (story 0.7 is committed as `1ddab1d`). If not, stop and ask.
  - [x] Set `baseline_commit` in this file's frontmatter to `git rev-parse HEAD`.
  - [x] `git lfs env` works and `git check-attr filter -- public/assets/fonts/x.woff2` prints `lfs`.
- [x] **T1: Fetch and place the files** (AC: 1, 2, 3)
  - [x] Download into the scratchpad, never into the project: `npm pack @fontsource/alegreya@5.3.0` (or `curl` its tarball) and the Adobe `WOFF2-source-sans-3.052R.zip`; the two licence URLs with `curl`. **Never `npm install`**: no dependency is added (D12).
  - [x] `sha256sum` each file against AC1. Copy into `public/assets/fonts/` under the shipped names (create `public/assets/fonts/`; the architecture names it, so it is not a structure change).
- [x] **T2: `@font-face` in `base.css`** (AC: 8, 9)
  - [x] Four rules (sketch in Dev Notes), Prettier's form. Extend the header comment: the faces are declared here; the tokens name them only after story 0.14.
- [x] **T3: Story-text characters helper** (AC: 15) (D7)
  - [x] `src/lookdev/storyCharacters.ts`: pure, **no imports** (the Playwright spec imports it in Node, as it does `spots.ts`). `readStoryLines(markdown: string): string[]` and `uniqueCharacters(lines: readonly string[]): string` (sorted by code unit, spaces kept once).
  - [x] `src/lookdev/storyCharacters.test.ts`, test-first (Tests 1–4).
- [x] **T4: The type view** (AC: 12–16, 18, 19)
  - [x] `src/lookdev/typeView.ts` (`mountTypeView`), `lookdev.css` rules prefixed `lookdev-typeface-` (D9 of this story; avoid `lookdev-type-`, which the overlay view uses).
  - [x] Add `{ id: 'type', label: 'Type', mount: mountTypeView }` to `LOOKDEV_VIEWS` after `palettes`; add both spots to `LOOKDEV_SPOTS`.
  - [x] Data attributes for the checks: `data-typeface-row="<token>"`, `data-typeface-charset="<token>"`, `data-typeface-numeric="<token>"` with children `data-numeric-sample="0:00.0|1:11.1"`, `data-typeface-wordmark`.
- [x] **T5: `tests/e2e/lookdev/fonts.spec.ts`** (AC: 10, 11, 17, 18, 19) (Tests 5–10)
- [x] **T6: `docs/ASSETS.md`** (AC: 6, 7), and in `docs/STYLE_GUIDE.md` › Typefaces add one clause to the Source Sans 3 file cell: "shipped as `source-sans-3-vf-upright.woff2`, renamed only" (D1).
- [x] **T7: README**: in "The look-dev page and the critic loop", add the type view to what the page shows (one clause).
- [x] **T8: Throwaway checks** F1–F5 (Dev Notes), each recorded in the Debug Log, then reverted (`cmp` against a scratchpad copy).
- [x] **T9: `make check`, `make build`, `make smoke`** pass. Record the budget sheet's Fonts row and the file count (8 files: the 2 from before plus 6).
- [x] **T10: Critic loop** (AC: 20, 21)
  - [x] `ls shots/` first: rounds 1–9 exist, so start at 10 or the next free number. At most 3 rounds.
  - [x] Open both type shots each round; also glance at the other spots (nothing else should change: the overlay view still shows `system-ui`).
  - [x] Send the developer the first and last round's type shots (SendUserFile) and get his sign-off (AskUserQuestion).
- [x] **T11: Close**: Dev Agent Record, File List, Change Log; status `review`. Commit only when the developer asks (one commit, straight on master: `Self-host the overlay typefaces: story 0.8, reviewed and done`).

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). Twelve findings were dismissed:
- **A readiness race in the type view:** `frame()` updates the status in the same frame, before `main.ts` sets ready (Edge Case Hunter traced it), and the look-dev folder passed 69 of 69 runs.
- **The tabular check proves only the CSS:** by design. The numeric components apply `tabular-nums` (DESIGN.md's `note`), and F5 showed the measurement fails without it.
- **The fit check could be vacuous:** it isn't. The overlay root is `position: absolute; inset: 0; overflow: hidden`, a box exactly the window's size.
- **The characters are compared through the same parser on both sides:** the parser's unit tests pin the real document (10 lines, the first line, the curly quotes).
- **The URL rewrite is untested (Blind Hunter):** throwaway check F1 proved it on a real build. The forward check is the "Defer → 1.11" item below.
- **Labels show the requested face, not the one used:** the glyph check covers the face actually used.
- **The unit test is tied to the document's content:** intended, as a guard on the parser.
- **CDP sessions aren't detached:** harmless; each page closes.
- **Combining sequences split by `for…of`:** the story text has none; the entity check below catches the likely way one would arrive.
- **The face status uses `FontFace.status`, not `document.fonts.check` (AC13):** stronger, since `check()` passes for an undeclared face (see the patch below).
- **Raw `letter-spacing` and the second `.ui-overlay` rule:** recorded and approved by the developer during the critic loop.
- **The Dev Notes table says `overlayView.ts` is "not touched":** that is the plan as written; the Dev Agent Record records the change.

- [x] [Review][Decision] The Source Sans 3 licence file has CRLF line endings, and git will convert them on commit. Adobe's `LICENSE.md` ships with CRLF (93 CRs). `.gitattributes` (`* text=auto eol=lf`) stores it with LF, so a clone gets 4,486 bytes with SHA-256 `db472802…`, not AC1's 4,579 bytes and `89ad2c4f…`, and the fonts total becomes 250,753. Options: (a) add `public/assets/fonts/*.txt -text` to `.gitattributes`, so the shipped licence stays byte-identical to Adobe's (AC3 said "no `.gitattributes` change", written before this was known); (b) normalise it to LF and re-pin its size, hash and the total in `docs/ASSETS.md` and this story, saying so. **Resolved 2026-11-14: (a), by the developer.** `.gitattributes` now has `public/assets/fonts/*.txt -text`, and the filtered and raw blobs are identical (`88c07f7…`).
- [x] [Review][Patch] The weight check accepts the wrong Alegreya file: `isFace` matches any `Alegreya-` PostScript name, so a 600 row drawn by the 400 file (synthetic bold) or the 700 file passes. Match each display token's weight to its PostScript name (`-Regular`, `-SemiBold`, `-Bold`) [tests/e2e/lookdev/fonts.spec.ts]
- [x] [Review][Patch] `document.fonts.check(...)` in the tabular test passes for an undeclared family. Assert the Source Sans 3 `FontFace` entry's `status` instead [tests/e2e/lookdev/fonts.spec.ts]
- [x] [Review][Patch] The no-other-host test doesn't collect page errors per view, as Test 5 asks [tests/e2e/lookdev/fonts.spec.ts]
- [x] [Review][Patch] `SPOT_SIZES` repeats `spots.ts`; derive the fit-check sizes from `LOOKDEV_SPOTS` for the `type` view [tests/e2e/lookdev/fonts.spec.ts]
- [x] [Review][Patch] The control characters need an installed font with Cyrillic and Hebrew glyphs; say so in the test, so a bare CI image's failure reads correctly [tests/e2e/lookdev/fonts.spec.ts]
- [x] [Review][Patch] Parser hardening: separator rows with 1+ dashes (GFM), split only on unescaped pipes, throw on a row shorter than its header, and throw on an HTML entity or tag in a Line cell (it would hide or invent glyphs). Each gets a unit test [src/lookdev/storyCharacters.ts]
- [x] [Review][Patch] A face whose load failed shows "not loaded" and `frame()` polls forever. Show "failed" and stop polling when every face has settled [src/lookdev/typeView.ts]
- [x] [Review][Patch] The character rows' `letter-spacing` aid is silently lost if story 0.14 gives `display-lg` or `display-body` a letter-spacing token (the inline token beats the class). Set it inline after `applyToken` [src/lookdev/typeView.ts, src/lookdev/lookdev.css]
- [x] [Review][Patch] The `font-display: block` comment overstates: after the block period (about 3 s), or on a failed load, the fallback face does show [src/ui/styles/base.css]
- [x] [Review][Patch] D5's comments should say this is the second exception to "tokens only inside `.ui-overlay`" (the first is the bar padding, 0.6 D12) [src/lookdev/typeView.ts, src/lookdev/lookdev.css]
- [x] [Review][Defer → 1.11] When the game first imports `base.css` (story 1.11, the first overlay screen), `make smoke` should check that the four faces load with status 200 from the preview build in Chromium and Firefox (F1 proved the URLs by hand, once) [src/ui/styles/base.css]
- [x] [Review][Defer → 1.11] `text-rendering: geometricPrecision` was judged only in Chromium on Linux; story 1.11's overlay critic shots and smoke check cover Firefox [src/ui/styles/base.css]

## Dev Notes

### Current state of the files this story touches

| File | Today | This story | Keep |
| --- | --- | --- | --- |
| `public/` | **Does not exist** | Creates `public/assets/fonts/` with 6 files | — |
| `src/ui/styles/base.css` | Header comment, then one `.ui-overlay` rule with every DESIGN.md token; typography families are `system-ui, sans-serif` | Adds 4 `@font-face` rules above `.ui-overlay`; extends the header comment | Every token, value and the selector, byte for byte |
| `src/lookdev/assetBrowser.ts` | `LOOKDEV_VIEWS`: overlay, renderer, palettes; header comment already says "type (0.8)" | Adds `type` | List shape, `findView`, navigation |
| `src/lookdev/spots.ts` | 4 spots, pure data, no imports | Adds `lookdev-type-1080`, `lookdev-type-720` | No imports in the file |
| `src/lookdev/lookdev.css` | Chrome rules and overlay-view rules (`lookdev-type-*` belongs to the **overlay view's** typography samples) | Adds `lookdev-typeface-*` rules | Everything else |
| `src/lookdev/overlayView.ts` | Reads the token rule from the loaded sheets; shows the tokens in `system-ui` | **Not touched.** `findTokenRule` matches `CSSStyleRule` only, so `@font-face` rules (`CSSFontFaceRule`) are skipped | All of it |
| `src/lookdev/main.ts` | Ready flag waits one frame, `document.fonts.ready`, one more frame | **Not touched**: this already waits for the type view's font loads | All of it |
| `scripts/checkBudgets.ts` | `assets/fonts/**` → Fonts budget, 0.3 MB | **Not touched** | All of it |
| `docs/ASSETS.md` | Tools: Gemini; Assets: six reference images | Four font rows and a Fonts note | Everything else |
| `docs/STYLE_GUIDE.md` | Typefaces table names Adobe's file name | One clause on the shipped name (D1) | Everything else |
| `README.md` | Look-dev section lists renderer, overlay, palettes | One clause for the type view | Everything else |
| `src/main.ts`, `index.html` | The game imports no CSS yet | **Not touched** (Epic 1 imports `base.css`) | — |

`tests/e2e/lookdev/lookdev.spec.ts` already checks that every view opens with no error and has a spot, so the new view is covered there with no edit.

### Decisions (the developer can veto any at review)

- **D1 — Kebab-case shipped name for Source Sans 3.** The architecture's rule is "shipped assets: kebab-case". Adobe's `SourceSans3VF-Upright.ttf.woff2` ships as `source-sans-3-vf-upright.woff2` with identical bytes (SHA-256 in AC1). Renaming the file changes no part of the font, so it is not a Modified Version under the OFL and the Reserved Font Name isn't touched. *That is my reading of the OFL, not legal advice.* Alegreya keeps Fontsource's names, which are already kebab-case. The licence files keep the style guide's names (`OFL-…`).
- **D2 — `font-display: block`.** A game screen should never flash a fallback face. On a local or itch.io load the files arrive in milliseconds, and after the block period (about 3 s) the browser falls back anyway. The look-dev ready flag already waits for `document.fonts.ready`.
- **D3 — The one asset referenced by path.** The rule is "shipped assets by manifest id, never by path", but CSS can't read the manifest. `@font-face` uses the root-absolute public path `/assets/fonts/<file>`, which Vite's docs require for `public/` files and which Vite rewrites to a relative URL under `base: './'` at build time (Vite 8.3 docs, "Public Base Path"; *untested here*, so F1 proves it). Flagged under AR248 (closest pattern). Never a relative path into `public/`: Vite would hash the file into `dist/assets/`, where the budget check finds no group for it.
- **D4 — No `unicode-range`.** One Latin subset per face; a range adds nothing but a way to skip glyphs silently.
- **D5 — The type view sits in the overlay root, with one exception.** Sizes, weights, line heights and letter spacing come from the `--typography-*` properties (so they follow `--tile`), and colours from `--colors-*`. Only `font-family` is set to the face name, because the tokens still say `system-ui` (the epic's own AC). Comment it as the second exception to "tokens only inside `.ui-overlay`" (the first is the bar padding, 0.6 D12), ending at story 0.14.
- **D6 — "Each weight it ships in" means the token weights.** The variable file covers 200–900; the view shows the three the tokens use (400, 500, 600). The rest are never used.
- **D7 — The story characters come from the narrative design, parsed.** `content/storyText.ts` doesn't exist yet (story 0.13 creates it with one line; Epic 3 adds the rest), and story text is never typed into code. `typeView.ts` imports `narrative-design.md?raw` (path below), as `palettesView.ts` imports the style guide (0.7 D8); `fonts.spec.ts` reads it with `node:fs`. Both call `readStoryLines`. When `storyText.ts` holds every version-one line (Epic 3), the view may switch to it; note that in the completion notes, not here.
- **D8 — An automated glyph check, beyond "by eye".** Chromium's DevTools protocol reports which fonts rendered a node (`CSS.getPlatformFontsForNode`: `familyName`, `isCustomFont`, `glyphCount`). The look-dev checks run in Chromium only, so this is reliable there. The by-eye check in the critic loop still happens. **Unverified:** the exact `familyName` string for a web font (expected `Alegreya`, `isCustomFont: true`); check on the first run. If the CDP call doesn't behave, fall back to comparing widths of each character under two different fallback stacks, and say so in the Debug Log.
- **D9 — The check covers every view**, not only the type view: it costs one loop over `LOOKDEV_VIEWS`' links and catches a later view that pulls something from outside.
- **D10 — Same host, not same origin.** Vite's HMR client opens a WebSocket on the same host (`ws:`); Playwright's `request` event doesn't include WebSockets, but compare `URL.host` with the base URL's host anyway, and allow only `http:`/`https:` on that host plus `data:` and `blob:`.
- **D11 — Licence sources pinned.** Alegreya's `OFL.txt` at commit `2268f9e…` (last change 2017-09-07); Adobe's `LICENSE.md` at tag `3.052R`. The style guide already names both files and their purpose.
- **D12 — No dependency.** Fontsource is used only as a download source (its npm tarball), never installed. The `.woff2` files are committed through LFS.

### `@font-face` sketch

```css
@font-face {
  font-family: 'Alegreya';
  src: url('/assets/fonts/alegreya-latin-400-normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
/* … 600 and 700, same shape … */
@font-face {
  font-family: 'Source Sans 3';
  src: url('/assets/fonts/source-sans-3-vf-upright.woff2') format('woff2');
  font-weight: 200 900;
  font-style: normal;
  font-display: block;
}
```

Plain `format('woff2')` works for a variable file in current Chromium and Firefox; `tech(variations)` isn't needed.

### Type view sketch (shape, not final code)

- `FACES`: `{ family: 'Alegreya', role: 'Display', tokens: ['display-xl', 'display-lg', 'display-body'] }`, `{ family: 'Source Sans 3', role: 'UI and numeric', tokens: ['ui-lg', 'ui-md', 'ui-sm', 'numeric-lg', 'numeric-md'] }`. The weight of each row comes from the token's `--typography-<token>-font-weight`, read at runtime, so rows can't disagree with `base.css`. A test asserts the shown weights are Alegreya {400, 600, 700} and Source Sans 3 {400, 500, 600}.
- Sections, top to bottom: the note (AC16); the wordmark (AC14); per face: name, role, status, then one row per token with a sample (`Sphinx of black quartz, judge my vow.` for display and UI rows, as the overlay view does; the numeric pair for numeric rows); the character set in Alegreya at `display-lg` and `display-body` (AC15).
- Layout must fit 1280 × 720 with no overflow (AC18): two columns (Alegreya left, Source Sans 3 right) under a full-width wordmark is the starting guess. At 720 `--tile` is about 67 px, so `display-xl` is about 60 px and `display-lg` hits its 24 px floor at `--tile` below 48 px only; check the shot.
- Labels: `getComputedStyle(sample)` for size and family, as `overlayView.ts` does; refresh on `resize` and once `document.fonts.ready` resolves (for the status).
- `frame()` is a no-op; `dispose()` removes the resize listener and the overlay.
- Path for D7: `import narrative from '../../_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md?raw';` (the dev server serves files under the project root; 0.7 confirmed `?raw` outside `src/` in both Vite and Vitest).

### `readStoryLines` rules

Find the heading line `### Story Text Script (version one)`; stop at the line `**Script notes:**`. Within that, a table row is a line starting with `|`. A row followed by a separator row (`| --- | …`) is a header: remember the index of its cell `Line`. Separator rows are skipped. Every other row's cell at that index is a line. Cells are split on `|` and trimmed. Throw an `Error` naming the problem if the heading or the end marker is missing, a header has no `Line` cell, or no line is found. Today this yields 10 lines (5 intro cards, 3 level lines, the closing card, the all-bells card) and a unique set of 46 characters: the space, `'` `,` `-` `.`, the capitals `BCEFHILMRST`, the lower case `abcdefghiklmnoprstuvwy`, and `“` `”` (measured at story creation; test 1 asserts the curly quotes, not the whole set, so a text edit doesn't break it).

### Tests

**Vitest, Node** (`make test`): `src/lookdev/storyCharacters.test.ts`

1. The real narrative (imported `?raw`): 10 lines; the first is card 1's line; the set contains `“` and `”`.
2. A small synthetic section with two tables (one with `Line` in column 2, one in column 1) returns the lines in order and ignores the other columns and the notes after `**Script notes:**`.
3. Missing heading, missing `Line` header, or no rows: each throws with a message naming it.
4. `uniqueCharacters` returns each character once, sorted by code unit.

**Playwright, Chromium, dev server** (`make shots` runs it first): `tests/e2e/lookdev/fonts.spec.ts`. Use `expectLookdevReady` and the page-error helpers, as the other look-dev specs do.

5. Every view (from the bar's `[data-lookdev-view]` links): no page error, and every request's URL is `data:`/`blob:` or `http(s)` on the base URL's host (AC10).
6. The type view: the four `.woff2` responses come from `/assets/fonts/` with status 200; `document.fonts` has 4 faces, all `loaded`, families and weights as AC11 (iterate the `FontFaceSet`; a variable face reports its weight as `"200 900"`).
7. Glyph check (AC17) through `page.context().newCDPSession(page)`: `DOM.enable`, `CSS.enable`, `DOM.getDocument`, `DOM.querySelectorAll` on `[data-typeface-charset]`, then `CSS.getPlatformFontsForNode` on each **text node's parent element**: exactly one font, Alegreya, custom. Then inject a control `<span>` with `Ж` in Alegreya: it must report a second, non-custom font. Same for the Source Sans 3 rows.
8. The character set shown on the page equals `uniqueCharacters(readStoryLines(<narrative read with node:fs>))`: the page is compared with the source document, never with itself (0.6 review pattern).
9. Tabular figures (AC19): for `numeric-lg` and `numeric-md`, the two samples' widths differ by less than 0.01 px, after `document.fonts.check('600 16px "Source Sans 3"')` (and `500`) is true.
10. At 1920 × 1080 and 1280 × 720 the overlay root of the type view doesn't overflow (AC18). Never check `html` (it is `overflow: hidden`; the check could never fail).

### Throwaway checks (make the change, run, record the output, revert; `cmp` against a scratchpad copy)

| # | Change | Run | Expected |
| --- | --- | --- | --- |
| F1 | `src/main.ts` imports `./ui/styles/base.css` | `make build`, then read `dist/assets/*.css` | the `@font-face` URLs are relative (no leading `/`) and point at `assets/fonts/…` from the CSS file's folder. If they stay absolute, **stop and report**: Epic 1's game build would break on itch.io (D3) |
| F2 | Add a 60,000-byte file `public/assets/fonts/zz-pad.woff2` (random bytes; never committed) | `make build` | fails: "Fonts: … is over its 0.300 MB budget" |
| F3 | Point one `@font-face` at a missing file | `make shots ROUND=<scratch>` or the spec alone through `make shots` | `fonts.spec.ts` fails (failed request / face not loaded); a round is never created for a failed run |
| F4 | Put `url('https://example.invalid/x.woff2')` before the local URL in one `src` | same | the host check fails, naming the URL |
| F5 | In a scratch spec, measure `0:00.0` and `1:11.1` in Alegreya with `proportional-nums` | Playwright via `make shots`'s config | the widths differ, so the tabular check can fail |

For F3–F5 a failing `make shots` creates no round folder (the Makefile renames the partial folder only on success), so round numbers stay free.

### What the critic loop judges here

The faces against the style guide's choice and intent (§ Typefaces, § Wordmark): Alegreya for the wordmark, level names and card lines only; Source Sans 3 for everything else. At both sizes: is every row legible, especially `ui-sm` (13 px floor) and `numeric-md` at 720; does the wordmark read as a title with no glow and no warm colour; do the curly quotes look right in Alegreya; do the numeric pairs line up by eye; does the page fit with no clipping. Problems with the *choice* of faces are not fixed here: they go to the developer and the style guide changes first. Nothing else on the page should change; the overlay view keeps showing `system-ui` until story 0.14.

### Previous story intelligence (0.7)

- Patterns that worked: a DOM-only look-dev view (`mount` returns a no-op `frame`); source documents read through `?raw` in the view and through `node:fs` + a parser in the spec; data attributes for every value a check reads; the page compared with the source document, never with itself.
- Review lessons: assert counts outright (rows, faces), not only through a loop that could run zero times; exact arithmetic at boundaries; `replaceAll` where all occurrences are meant; scroll checks on the view's own root, never `html`.
- `core/` imports nothing, tests included (a 0.7 test had to move for this). The helper here lives in `lookdev/`, which may import `core/`, `render/`, `ui/`, `content/`; it needs nothing.
- Lint lessons (0.6): use type guards rather than `instanceof` on `any`-typed generics; `.at(0)` rather than `[0]?.`; wrap methods passed as values. Prettier formats new files; run `make format` only on what you changed, or Prettier on the new files.
- One Playwright run outside `make` loses `GPU=nvidia` and skips the GTX 1650 check; record only `make shots` runs.
- `make shots` refuses an existing round; rounds 1–9 exist.
- The developer signs off on shots sent with SendUserFile, then AskUserQuestion.
- Git: one commit per story, straight on master, only when he asks.

### Latest technical notes

- **Vite 8.3** (docs read 2026-11-14, `/vitejs/vite` v8.3.5): `public/` files are served at `/` in dev and copied unchanged to `dist/`; reference them by root-absolute path. "CSS `url()` references … are automatically adjusted to respect [base]" and a relative base makes "all generated URLs … relative to each file". F1 confirms it on this project.
- **WOFF2 variable fonts:** `font-weight: 200 900` in `@font-face` declares the range; `format('woff2')` is enough.
- **`document.fonts`** is a `FontFaceSet` (iterable); each `FontFace` has `family` (quoted or not depending on the browser; normalise by stripping quotes), `weight`, `style`, `status`.
- **CDP** `CSS.getPlatformFontsForNode({ nodeId })` returns `fonts: [{ familyName, postScriptName, isCustomFont, glyphCount }]`; it needs `DOM.enable` and `CSS.enable` first, and a `nodeId` from `DOM.getDocument` + `DOM.querySelector(All)`. Chromium only (D8).
- No three.js API is used.

### Project structure notes

- New: `public/assets/fonts/` (6 files), `src/lookdev/typeView.ts`, `src/lookdev/storyCharacters.ts`, `src/lookdev/storyCharacters.test.ts`, `tests/e2e/lookdev/fonts.spec.ts`.
- Changed: `src/ui/styles/base.css`, `src/lookdev/assetBrowser.ts`, `src/lookdev/spots.ts`, `src/lookdev/lookdev.css`, `docs/ASSETS.md`, `docs/STYLE_GUIDE.md` (one clause), `README.md`.
- `public/assets/fonts/` is named by the architecture (Source Structure), so creating it is not a folder-structure change. No other new folder. No new dependency. `eslint.config.js` needs no change; if a file seems to need one, stop and ask.

### Project context rules

- TypeScript strict; relative imports carry `.ts`; `import type` for types; no enums; string-literal unions; booleans `is…`/`has…`/`can…`. One main export per file (`storyCharacters.ts` exports two small functions that belong together, like `designTokens.ts`; fine).
- `lookdev/` is development only and never built; the game's graph must not import it (the smoke check enforces this).
- Inside `.ui-overlay`, token properties only (D5 is the stated exception); page chrome may use raw neutral values.
- Log only through `core/log.ts` (`ui` channel).
- Never add a dependency or tool without asking. Never hard-code story text (D7 parses it).
- Run commands through `make`; `make check` before saying a change works.
- Every browser test runs WebGL on the GTX 1650 (`GPU=nvidia`, the Makefile default); look at every screenshot before describing it.
- Log every asset with its licence and AI flag in `docs/ASSETS.md`.

### References

- Epic and story: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md`, Epic 0, Story 0.8 (and 0.13 for `storyText.ts`, 0.14 for the token update, 6.17 for credits).
- Requirements: `requirements-inventory.md`: AR152, AR157, UX-DR6, UX-DR7, UX-DR61, AR219 (look-dev checks before shots), AR248.
- `docs/STYLE_GUIDE.md` › Typefaces (files, sizes, licences, coverage, fallbacks, use), › Wordmark.
- DESIGN.md (`_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md`) frontmatter `typography:` (lines 32–40).
- Narrative design › Story Text Script (version one) (`narrative-design.md:822`).
- Architecture `game-architecture.md`: Asset Management (budgets; fonts in the shared bundle), User Interface ("Fonts are self-hosted"), Source Structure (`public/assets/fonts/`), Naming Conventions (kebab-case shipped assets), Testing (look-dev checks: fonts).
- Code: `src/ui/styles/base.css`, `scripts/designTokens.ts` (`parseCustomProperties`), `scripts/checkBudgets.ts` (`classifyFile`), `src/lookdev/{main,assetBrowser,spots,overlayView,palettesView}.ts`, `tests/e2e/lookdev/{lookdev,palettes}.spec.ts`, `tests/e2e/{lookdevReady,pageErrors}.ts`.
- Previous story: `_bmad-output/implementation-artifacts/0-7-put-the-level-palettes-and-lighting-rigs-in-data.md`.

### For later stories (not this one)

- **Story 1.3 (asset loader):** fonts are in the shared bundle, but fetching a `.woff2` doesn't register a face. The loader should make the `@font-face` faces load (for example `document.fonts.load(...)` for each face and weight) rather than fetch the files a second time.
- **Story 0.14:** the token families become `'Alegreya', Georgia, serif` and `'Source Sans 3', system-ui, sans-serif` (style guide › Fallbacks); then the type view's D5 exception can read the families from the tokens.
- **Story 0.13 / Epic 3:** the story lines use a straight apostrophe in "lord's" while the quotes are curly; whether to use `’` is a text decision for whoever writes `storyText.ts`. Both are in Alegreya's subset.

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code.

### Debug Log References

- **T0:** the tree was clean apart from this file and `sprint-status.yaml`; `baseline_commit` is `1ddab1d` (story 0.7). `git lfs env` works, and `git check-attr` gives `filter: lfs` for the four `.woff2` files and `unspecified` for the two `.txt` files.
- **T1:** all six files were fetched into the scratchpad and matched AC1's SHA-256 values (`sha256sum -c`), then copied. Total 250,846 bytes. Nothing was installed.
- **T3, red then green:** `storyCharacters.test.ts` failed first (no module), then passed: 241 → 249 tests.
- **Correction to Dev Notes (`readStoryLines` rules):** the story-text set is **40** characters, not 46. Counted again: the space, 4 marks, 11 capitals, 22 lower case and 2 curly quotes. The view's computed count agrees. Test 1 never asserted the count, so nothing else changes.
- **D8, the unverified item, now checked:** Chromium reports a font by the names inside its file, not by the `@font-face` family. The static Alegreya files come back as "Alegreya", "Alegreya SemiBold" and so on (PostScript `Alegreya-Regular`, `Alegreya-SemiBold`, `Alegreya-Bold`); the variable Source Sans 3 as "SourceSans3VF" (PostScript `SourceSans3VF-ExtraLight`, its default instance). The spec therefore matches a face by its PostScript prefix, and only as a web font (`isCustomFont`). The control characters fell back to Liberation Serif (`isCustomFont: false`), so the check can fail.
- **Spec timing:** the control test first got an empty font list for a span injected just before the CDP query. Waiting two animation frames after injecting fixed it; that test then passed 3 of 3, and the whole look-dev folder 69 of 69 (`--repeat-each=3`).
- **Direct Playwright runs while writing the spec:** they used the Makefile's environment by hand (`GPU=nvidia E2E_TARGET=dev SHOTS_PORT=5174`), so the GTX 1650 check ran. Every recorded result below comes from a `make` target.
- **Lint lessons hit again:** spreading a string (`no-misused-spread`; `Array.from` used instead), and optional chains on index access without `noUncheckedIndexedAccess` (`.at()` used instead).
- **Throwaway checks** (each change reverted; `cmp` confirmed `src/main.ts` and `base.css` byte-identical to their scratchpad copies, and the scratch specs were deleted):
  - **F1:** `src/main.ts` imported `./ui/styles/base.css`, then `make build`. The built CSS has `url(../assets/fonts/<file>.woff2)` for all four faces, relative to `dist/assets/`. Served by `make preview`, those URLs return 200 `font/woff2` (22,884 and 170,188 bytes checked). So Vite rewrites the root-absolute public URLs under `base: './'`, and Epic 1's game build will find the fonts on itch.io. Budget sheet in that build: Fonts 250,846 bytes; 9 files.
  - **F2:** a 60,000-byte `public/assets/fonts/zz-pad.woff2` made `make build` fail: "Fonts: 0.311 MB (310,846 bytes) is over its 0.300 MB budget (300,000 bytes)".
  - **F3:** pointing the 600 face at a missing file failed three checks: the failed request (Vite's SPA fallback), and two glyph checks, where Liberation Serif Bold stood in for Alegreya 600.
  - **F4:** `url('https://example.invalid/x.woff2')` first in one `src` failed the host check ("type: requests to another host", naming the URL) and the page-error check (`ERR_NAME_NOT_RESOLVED`).
  - **F5:** in a scratch spec, `0:00.0` and `1:11.1` at 36 px, weight 600, measured 91 and 71 px in Alegreya with `proportional-nums`, 90 and 90 in Source Sans 3 with `tabular-nums`, and 98 and 73 in Source Sans 3 with `proportional-nums`. The width check can fail, and the `tabular-nums` the numeric components apply matters even though Source Sans 3's default digits are tabular.
- **T9, final runs** (after the critic loop's last edits):
  - `make check`: exit 0, with 10 test files and 249 tests.
  - `make smoke`: exit 0, with 3 passed and 1 skipped (by design: the `dist/` check runs once, in Chromium).
  - Budget sheet: **Fonts 0.251 / 0.300 MB (250,846 bytes)**; download total 251,724 bytes; **8 files** (`index.html`, one JS bundle and the six font files). The code is still 878 bytes, as after story 0.7, since the game imports no CSS yet. `dist/assets/fonts/` holds the six files.
- **T10, critic round 10** (`shots/round-10/`): 23 look-dev checks passed, then 6 shots. Both type shots were opened, and the other four glanced at (unchanged from round 9; the overlay view shows `system-ui`). Every face loaded; the wordmark is Alegreya 700 at 90.9 px and 60.6 px (`display-xl`); every row is legible at both sizes; nothing is clipped; the numeric pairs end at the same x. The three biggest problems:
  1. The story characters can't be checked one glyph at a time: the four marks and the curly quotes touch their neighbours, and the space doesn't show. **Fix:** `letter-spacing: 0.3em` on the two character rows, as a judging aid (face, size and weight stay the token's), and the heading says the space is included.
  2. The curly quotes are only seen on their own, never against letters. **Fix:** the long sample is now `“Sphinx of black quartz,” judge my vow. 0123456789`, so every `display-body` and UI row shows them in context.
  3. The character rows are labelled with the token name only. **Fix:** the same computed label as every other row (token, face, weight, px).
- **T10, critic round 11** (`shots/round-11/`, opened): all three are fixed. One problem remained: at 720, `ui-sm` (Source Sans 3, 500, 13 px, 0.02em) had uneven gaps inside words ("quart z", "jud ge", "vo w"), while `system-ui` at the same token was even.
  - A scratch probe (screenshot enlarged 4× with no smoothing) showed the gaps with or without the letter spacing, gone with `text-rendering: geometricPrecision`, and in system-ui only at a smaller scale.
  - **Cause, a guess the probe supports:** Chromium on Linux snaps the hinted TrueType variable font's glyphs to whole pixels at small sizes.
  - **Fix:** `text-rendering: geometricPrecision` in a second `.ui-overlay` rule in `base.css`, so the game's overlay gets it too, not only the look-dev page.
  - The first run of round 12 then **stopped at a look-dev check** (no shot was taken): `overlayView.ts` took the first `.ui-overlay` rule, which now declared no token. **Fix:** `findTokenRule` takes the `.ui-overlay` rule that declares custom properties, so rule order no longer matters.
- **T10, critic round 12** (`shots/round-12/`, opened): `ui-sm` is evenly spaced at both sizes, every other row is unchanged, and the overlay view renders its tokens as before. Three rounds (10–12), the limit; the loop stopped.
- **Code review fixes (2026-11-14),** after the developer chose (a) for the licence file and to apply every patch:
  - `.gitattributes`: `public/assets/fonts/*.txt -text`. `git hash-object` with and without filters now give the same blob for the CRLF licence, so AC1's 4,579 bytes and SHA-256 hold in every clone.
  - Parser, test-first: 4 new unit tests failed, then passed. They cover one-dash and colon separator rows, escaped pipes, a row shorter than its header, and an HTML entity or tag in a line.
  - `fonts.spec.ts`:
    - each display row and the wordmark must come from its own weight's file (PostScript `Alegreya-Regular`, `-SemiBold`, `-Bold`). A throwaway that pointed the 600 face at the 700 file failed with "display-lg: Alegreya-SemiBold expected, Alegreya-Bold received";
    - the tabular test checks Source Sans 3's `FontFace.status`, not `document.fonts.check()`;
    - every view's page errors are checked;
    - the spot sizes come from `spots.ts`;
    - the control-font requirement is commented.
  - `typeView.ts`: a failed face shows "…, n failed" and polling stops once every face has settled. The status now reads "3 of 3 faces loaded". The characters' letter spacing is set inline after the token, so a token can't override it. D5's comments name it the second exception.
  - `base.css`: the `font-display` comment says the fallback does show after the block period or on a failed load.
  - Final runs: `make check` exits 0 with 253 tests; `make smoke` exits 0; `make shots ROUND=13` passed 23 checks and took 6 shots. The type shot at 720 was looked at: the same as round 12 but for the status text.
- **Sign-off:** round 10 and round 12 type shots at both sizes were sent (SendUserFile). The developer signed off on the view and on the `geometricPrecision` fix (AskUserQuestion, 2026-11-14).

### Completion Notes List

- **Files (AC1–AC5):** six files in `public/assets/fonts/`, byte-identical to their pinned sources: Alegreya 400, 600 and 700 (Fontsource Latin subset, static), Source Sans 3's unmodified variable file (renamed only, D1), and the two OFL texts. 250,846 bytes, within the 0.3 MB fonts budget, which `make build` already enforces (F2). The `.woff2` files are in Git LFS through the existing rule. No subsetting was needed; no dependency or tool was added.
- **`@font-face` (AC8–AC9):** four rules in `base.css`, before the tokens: root-absolute public URLs (D3, proved relative after the build by F1), `font-display: block` (D2), no `unicode-range` (D4). Every typography token is unchanged (`system-ui`), and the token drift test passes untouched.
- **Log (AC6–AC7):** `docs/ASSETS.md` has four asset rows and a Fonts note: sources, versions, SHA-256 values, licences, "not AI-generated", no in-game credit required by the OFL, and both faces flagged for Epic 6's Credits question (story 6.17). `docs/STYLE_GUIDE.md` gains one clause: the Source Sans 3 file's shipped name.
- **Type view (AC12–AC16, AC18):** `src/lookdev/typeView.ts`, listed as `type`, with spots `lookdev-type-1080` and `lookdev-type-720`. It sits inside the overlay root (token sizes, `--tile`), with `font-family` set by name as the one exception until story 0.14 (D5). It shows the note, the wordmark, each face's status and the tokens it serves, one row per token, the story characters at `display-lg` and `display-body`, and the numeric pairs.
- **Story characters (D7):** `src/lookdev/storyCharacters.ts` parses the narrative design's Story Text Script (10 lines, 40 characters) for both the view (`?raw`) and the spec (`node:fs`). 8 unit tests.
- **Checks (AC10–AC11, AC17–AC19):** `tests/e2e/lookdev/fonts.spec.ts`, 8 checks, all run first by `make shots`:
  - no request to any host but the dev server, on every view;
  - the four files requested with 200 `font/woff2`, and four loaded faces;
  - every sample, the wordmark and the story characters drawn by their own face with no fallback (Chromium DevTools protocol), with a control character proving the check can fail;
  - the page's characters equal the narrative design's;
  - tabular pairs equal to within 0.01 px;
  - no overflow at 1920 × 1080 or 1280 × 720, with the wordmark at `display-xl`'s size.
- **Beyond the story's text, from the critic loop:**
  - spacing between the story characters, curly quotes in the samples, and full labels on the character rows (all in the look-dev page);
  - **`text-rendering: geometricPrecision` on the overlay root in `base.css`**, which reaches the game's overlay too (approved by the developer);
  - `overlayView.ts`'s `findTokenRule` now picks the `.ui-overlay` rule that declares tokens, needed once a second `.ui-overlay` rule existed.
  - New pattern, flagged under AR248: a second, token-free `.ui-overlay` rule in `base.css` for overlay-wide rendering settings. Story 1.11 (overlay root and layers) may want to move it into `ui/overlay.ts` or `screens.css`.
- **For later stories:**
  - **Story 1.3:** fonts are in the shared bundle, but fetching a `.woff2` doesn't register a face; the loader should load the faces through `document.fonts.load(...)` rather than fetch the files a second time.
  - **Story 0.14:** the token families become `'Alegreya', Georgia, serif` and `'Source Sans 3', system-ui, sans-serif`; the type view's `font-family` exception can then read them from the tokens.
  - **Epic 3:** when `content/storyText.ts` holds every version-one line, the type view and the spec may read the characters from it. The narrative's lines use a straight apostrophe in "lord's" next to curly quotes; that is a text decision.
  - **Unverified:** whether headed Chromium on the developer's desktop showed the 13 px gaps without the fix. The probe and every shot are headless.

### File List

- `public/assets/fonts/alegreya-latin-400-normal.woff2` (new, Git LFS)
- `public/assets/fonts/alegreya-latin-600-normal.woff2` (new, Git LFS)
- `public/assets/fonts/alegreya-latin-700-normal.woff2` (new, Git LFS)
- `public/assets/fonts/source-sans-3-vf-upright.woff2` (new, Git LFS)
- `public/assets/fonts/OFL-alegreya.txt` (new)
- `public/assets/fonts/OFL-source-sans-3.txt` (new)
- `src/lookdev/storyCharacters.ts` (new)
- `src/lookdev/storyCharacters.test.ts` (new)
- `src/lookdev/typeView.ts` (new)
- `tests/e2e/lookdev/fonts.spec.ts` (new)
- `src/ui/styles/base.css` (modified: four `@font-face` rules, the `text-rendering` rule, the header comment)
- `.gitattributes` (modified at code review: font licences ship byte for byte, `-text`)
- `src/lookdev/assetBrowser.ts` (modified: the type view)
- `src/lookdev/spots.ts` (modified: `lookdev-type-1080`, `lookdev-type-720`)
- `src/lookdev/lookdev.css` (modified: `lookdev-typeface-*` rules)
- `src/lookdev/overlayView.ts` (modified: `findTokenRule` picks the rule that declares tokens)
- `docs/ASSETS.md` (modified: four font rows and the Fonts note)
- `docs/STYLE_GUIDE.md` (modified: one clause, the shipped name of the Source Sans 3 file)
- `README.md` (modified: the look-dev page shows the typefaces)
- `_bmad-output/implementation-artifacts/0-8-self-host-the-overlay-typefaces.md` (this story)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

## Change Log

- 2026-11-14: Story created (ready-for-dev).
- 2026-11-14: Story implemented.
  - Added: the two overlay typefaces, self-hosted (four `.woff2` files and two licences, 250,846 bytes), their `@font-face` rules, the look-dev type view, the story-characters parser and the fonts checks; the font rows and Fonts note in `docs/ASSETS.md`.
  - Tests: 8 new unit tests (249 in all) and 8 new look-dev checks (23 in all). Five throwaway checks behaved as specified, F1 proving the font URLs survive the build.
  - Three critic rounds (10–12) fixed 4 problems, one of them overlay-wide (`text-rendering: geometricPrecision`), and the developer signed off. Status set to review.
- 2026-11-14: Code review.
  - 1 decision resolved: (a), the licence file kept byte-identical through `.gitattributes`.
  - 10 patches applied. 2 items are assigned to story 1.11: the font smoke check on the preview build, and checking `geometricPrecision` in Firefox. 12 findings dismissed.
  - 253 tests and 23 look-dev checks pass. Status set to done.

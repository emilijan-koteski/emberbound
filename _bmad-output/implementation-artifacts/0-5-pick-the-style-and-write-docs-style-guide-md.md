---
baseline_commit: bbff32c137b553178d7cdd42435e76f2b92bfdd9
---

# Story 0.5: Pick the style and write `docs/STYLE_GUIDE.md`

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to pick one style from the references, have it written down as rules, palettes and overlay values, and sign off on Rowan's concept,
so that every later material, asset and screen is built and judged against one written look, not against a new generated image.

**Requirements:** FR167 (recorded as open), FR210 (concept sign-off), NR14, NR15 (recorded as open), NR100–NR104, NFR27, NFR28, NFR29, NFR33, NFR34, NFR37, NFR38, PR22, PR24, AR179, UX-DR2, UX-DR3, UX-DR4, UX-DR6, UX-DR7, UX-DR11, UX-DR15, UX-DR61, UX-DR111
**Epic:** 0, Reference and style lock. Stories 0.1 to 0.4 are done. This story writes the document that stories 0.6 to 0.15 build from.

## What kind of story this is

**Not a code story.** No file under `src/`, `scripts/`, `tests/` or `public/` changes. It is a loop between the agent and the developer, like story 0.4:

1. The agent shows the six references side by side, with a short comparison. ⏸ The developer picks a style and gives his reasons.
2. The agent checks the hero sheet in that style against FR210. ⏸ The developer signs off on the concept, or asks for changes. If he asks for a new sheet, he runs it in the Gemini app; the agent looks at it and logs it.
3. The agent drafts the look: level palettes, shading, outline, grading, lighting, camera, warm-light rule, cards, overlay colours, typefaces, HUD icons, wordmark, title backdrop.
4. The agent runs `make contrast COLORS=docs/STYLE_GUIDE.md` and fixes any value that misses.
5. ⏸ The developer reviews the full draft, with the list of decisions made for him, and approves it.

**Stop and wait at each ⏸.** Ask the real forks with AskUserQuestion, the recommended option first, 1 to 4 questions at a time. Draft everything else from the references and the planning documents, and list it as "decisions made for you" so he can veto it. He prefers that to open questions.

**Never describe an image you haven't opened** with the Read tool in this session (CLAUDE.md, Visual work). That includes sampled colours: look at the crop you sampled.

## Acceptance Criteria

The epic's ACs, made exact. Where this story reads the epic differently, the reason is in Dev Notes › Decisions (D1–D12). The developer can veto any of them at review.

### The pick

- **AC1.** The developer sees the six references side by side: the three hero sheets in one row, the three key arts in another (a `montage` contact sheet, looked at before it is sent, then sent with SendUserFile). With it goes a short comparison per style: what reads well at small size, what will cost in the engine (an outline pass, a grading pass), and how each fits the fixed rules (warm light, readability, dark pits).
- **AC2.** He picks one style: stylised dark fantasy, comic illustration or the mix. `docs/STYLE_GUIDE.md` records the choice, his reasons in his words, the date, and the reference images it was made from, by path (`art-src/reference/…jpeg`). It says the setting's tone stays dark fantasy (NFR34).
- **AC3.** The two styles not chosen stay in `art-src/reference/` as the record of the comparison. Nothing is deleted.

### The look

- **AC4.** The guide gives a palette for each level, **Emberwood, the Drowned Mill and Harrowmere**, as named slots with a `#RRGGBB` value each (D3, D4). Every level has every slot. The slot names are the ones story 0.7 turns into the `core/` string-literal union (X-B34), so they are lower camelCase identifiers.
- **AC5.** The slots cover, at least: the four depth layers (far, middle, the play layer's ground and ledges, the foreground); fog; pits and deep water (dark); hazards (spikes, thorns); Rowan (skin, seams and glow, eyes, scarf, trousers, horns); his shot; the collectables (ember, bell); the weapon pickups (in Rowan's warm family, NR103); the checkpoint and the exit; each enemy (walker, thorn flyer, rooted spitter, at least a body and an accent each, so a recolour is a palette swap, NR104); and the lanterns.
- **AC6.** Emberwood's values come from the chosen key art, sampled from it (Dev Notes › Sampling colours) and then adjusted where a rule needs it. The Drowned Mill and Harrowmere have no key art: their values are derived from Emberwood under the warmth and level-look rules (D5), and marked as derived, to be judged on the test scene in story 0.12.
- **AC7.** The guide states these rules, each one short and testable by eye or by a story-0.7 unit test:
  - the **shading rule**: how surfaces are shaded (for example flat with soft gradients, or banded in N hard-edged tones), what carries texture, and that generated textures are stripped or flattened to palette regions
  - the **outline rule**: outlines used or not; if used, drawn by one edge-outline pass over the whole frame, never baked into textures (AR161), with colour and width stated
  - the **colour-grading rule**: used or not, and what it does (for example a cool lift in the shadows, a vignette)
  - the **lighting rule**, per level: the key light (colour, direction, relative strength), the fill, the fog (colour, near or far feel); plus the list of what may carry warm light in that level
  - the **camera**: keep the perspective camera with a narrow field of view (AR162), or call for an orthographic one with hand-made parallax, with the reason
  - **shadows**: left to story 0.11, which picks between one snapped directional shadow and blob shadows (AR168). The guide holds the slot for that decision.
  - **post-processing**: at most 2 passes in all † (outline and grading); the guide states which of the two this style uses
- **AC8.** The guide states the **warm-light rule**, all of it:
  - warm light belongs only to Rowan, the embers and the lanterns; Rowan, his shots and the collectables are always the warmest things on screen (NFR28)
  - lanterns appear only in Emberwood (NR101)
  - warmth fades across version one: most in Emberwood (the lanterns, home), almost none in the Drowned Mill, none in Harrowmere but Rowan and the embers (NR100); Rowan's glow dims at the seal break, so in Harrowmere the warmest thing is a dimmer Rowan
  - pits and deep water read as dark, and story lighting never overrides that (NR102, NFR29)
  - weapon pickups look warm, part of Rowan's palette (NR103)
  - enemies recolour per level by palette swap, with no rule change (NR104)
  - the hero, enemies, hazards and pickups can each be told from the background at a glance (NFR27)
  - a working definition of "warm", so a value can be checked (D6)
- **AC9.** The guide states that every asset takes the game's own materials, palette and lighting, and is judged on the look-dev page against this guide, never against a new generated image (NFR33, PR23). It names no other game, studio or artist as a reference (D11).

### Rowan's concept

- **AC10.** The agent checks the chosen style's hero sheet against FR210, point by point, and lists what passes and what doesn't. Known from story 0.4's review, and visible on every sheet: one horn curls up and outward instead of sweeping back, and the two are asymmetric; he is about 3.7 to 4.2 heads tall, not about 3; the arms are heavy, with the hands at mid-thigh.
- **AC11.** The developer signs off on the concept. The guide's **Rowan** section is the concept Epic 2 models from. It records:
  - FR210's design, point by point
  - the additions he made in story 0.4: worn, dark woodsman's trousers, torn at the knees and shins, with a belt; bare clawed feet
  - every change he asks for now (for example: both horns sweep back, symmetric; about 3 heads tall; shorter arms), written as the rule Epic 2 follows, with "the sheet shows X; model Y" where the sheet and the concept differ
  - stage 2 as the GDD and narrative design give it (one horn broken, the human right hand, a dimmer chest glow), for Epic 4; stage 2 is not drawn in this story
- **AC12.** If he asks for a new sheet, the agent writes the prompt or edit message, adapted from story 0.4's P1 to P3 (in `docs/ASSETS.md` › Prompts), and runs the same originality grep on it (story 0.4, AC5). He runs it in the Gemini app. The agent opens the result, checks it against the rules, and keeps it or asks for one more try, within 5 † attempts for that image (the tool budget, tools decision 2026-11-13). A kept sheet goes to `art-src/reference/` (Git LFS) under a kebab-case name, for example `hero-concept-<style>.jpeg`, and gets an Assets row and a Prompts entry in `docs/ASSETS.md`, as AI-generated. If the budget runs out first, stop, report the spend, and let him decide.

### Story cards

- **AC13.** The guide records the card style: layered paper-cut silhouettes built in the engine from flat layers in the game's palettes, about 3 to 5 layers per card †, text drawn over the art in the DOM overlay and never baked in (NR14, FR164, FR165), fitted to the chosen style (for example whether card layers take the ink outline).
- **AC14.** It marks two things **open, decided on story 0.13's sample card**: the cards' warm-light exception, Elin and home (FR167, NR15; if refused, the forge glow on cards turns pale and cold), and where the card shapes come from (made by hand or generated, PR25). It also marks the story palettes (the village, the hollow chamber) as added by story 0.13.

### The overlay

- **AC15.** The guide gives a value for each of DESIGN.md's **16 colour roles**, role names unchanged, as a `colors:` map in the guide's YAML frontmatter (D2). `ember` is the only warm value; hearts, bells, timer, warden bar and focus stay neutral or cool (UX-DR3). Values may be copied from palette slots (UX-DR15). The body repeats them in a table with a one-line reason per role.
- **AC16.** `make contrast COLORS=docs/STYLE_GUIDE.md` exits 0: every text pair is at least 4.5:1 and every non-text pair at least 3:1 (UX-DR4). The guide holds the re-measured contrast table, in DESIGN.md's layout, with the measured ratios. A value that misses is changed before the guide goes to the developer for approval. The command and its last output are recorded in the Dev Agent Record.
- **AC17.** The guide names **three typefaces**, one per role (display, UI, numeric), or two if the UI face has tabular figures and also serves the numeric role (UX-DR7). For each:
  - the family, its foundry or source page, and the weights the typography tokens use (Dev Notes › Weights the tokens use)
  - its licence, read from the licence file or page on the day, and that it allows self-hosting and commercial use (OFL or equivalent); the URL and date
  - Latin coverage plus the story text's punctuation (Dev Notes › Characters the story text uses)
  - tabular figures for the numeric role, or a separate numeric face
- **AC18.** All the faces, in the weights the tokens use, come to **0.3 MB or less as `.woff2`** together (AR152, UX-DR7). The size is measured, not guessed: the agent downloads the files from the source page into the scratchpad, adds up their sizes, and records the figure and the file list. Nothing is added to `public/`; story 0.8 ships the files and logs them in `docs/ASSETS.md`. If the faces don't fit, the agent proposes subsetting (story 0.8 owns it, with any tool approved by the developer) or a lighter face, and the developer decides.
- **AC19.** The guide records the **HUD icon style**: single-colour silhouettes readable at `hud-icon-sm`, the triple and piercing shot differing by outline shape, never by colour alone; with the comic style or the mix, panel edges and icons may take its ink outline, tokens unchanged (UX-DR11).
- **AC20.** It records the **wordmark**: "Emberbound" (working title) in `display-xl` in the display face (UX-DR61), with the weight and any letter-spacing the guide wants.
- **AC21.** It records the **title backdrop's style**, which Epic 6 builds (UX-DR111): what it shows, in which palette, and that it is built in the engine from the game's materials, not a generated image.

### Review and close

- **AC22.** The developer reviews the full draft. The agent gives him, in the message, a table of every decision made for him (palette values derived rather than sampled, slot names, the warm definition, the faces, the camera, and so on) so he can veto them. He approves the guide; his approval and the date are recorded in the guide's header.
- **AC23.** Nothing is rendered in the engine, so no critic loop runs. `make check` passes (no code changed, so it should pass unchanged).

## Tasks / Subtasks

- [x] **T0. Start clean** (Dev Notes › Repository state)
  - [x] Check `git status`. Story 0.4's files are staged and not committed. If they still are, ask the developer to commit 0.4 first (on master, per the project rule), so this story's diff holds only its own files. Don't commit for him.
- [x] **T1. The comparison** (AC1–AC3)
  - [x] Build the contact sheet (Dev Notes › Contact sheet), open it, then send it with SendUserFile.
  - [x] Write the comparison per style (Dev Notes › What the references show).
  - [x] ⏸ AskUserQuestion: the style. Then ask for his reasons in a sentence or two, if the answer didn't give them.
- [x] **T2. Rowan's concept** (AC10–AC12)
  - [x] Open the chosen hero sheet at full size and check it against FR210 point by point.
  - [x] ⏸ AskUserQuestion: sign off as drawn with the listed corrections written into the guide (recommended), or ask for a new sheet. Offer the known corrections (horns, height, arms) as the default.
  - [x] (Not needed: he signed off as drawn, no new sheet.) If a new sheet is wanted: write the edit message, run the originality grep, hand it to him, open each result, keep or retry within 5 † attempts, copy the kept file with `cp -p`, log it in `docs/ASSETS.md` (Assets row and Prompts entry).
- [x] **T3. Palettes** (AC4–AC6)
  - [x] Fix the slot list (Dev Notes › Palette slots).
  - [x] Sample Emberwood from the chosen key art (Dev Notes › Sampling colours); look at every crop you sample.
  - [x] Derive the Drowned Mill and Harrowmere (D5), and mark them derived.
  - [x] Put all three in the frontmatter `palettes:` map and in body tables with swatch-friendly hex.
- [x] **T4. The rules** (AC7–AC9)
  - [x] Shading, outline, grading, lighting per level, camera, shadows (slot for 0.11), passes.
  - [x] The warm-light rule in full, with the warm definition (D6).
  - [x] The judging rule (look-dev page, never a new image); no other game named.
  - [x] ⏸ Ask only the real forks: the camera (perspective recommended), and outlines or grading if the style leaves them in doubt.
- [x] **T5. Cards** (AC13, AC14)
- [x] **T6. Overlay colours and contrast** (AC15, AC16)
  - [x] Choose the 16 values (Dev Notes › Overlay colours).
  - [x] `make contrast COLORS=docs/STYLE_GUIDE.md`; fix and re-run until it exits 0; record the output.
- [x] **T7. Typefaces** (AC17, AC18)
  - [x] Shortlist 2 or 3 candidates per role that fit the style; check each licence on its own page on the day.
  - [x] ⏸ AskUserQuestion: the faces, with a one-line sample description and the measured size per option.
  - [x] Download the chosen `.woff2` files to the scratchpad, measure, record. Nothing goes in `public/`.
  - [x] Check coverage of the story text's characters (Dev Notes › Characters the story text uses).
- [x] **T8. HUD icons, wordmark, title backdrop** (AC19–AC21)
- [x] **T9. Review** (AC22, AC23)
  - [x] Re-read the guide against every AC; run `make contrast COLORS=docs/STYLE_GUIDE.md` and `make check`.
  - [x] ⏸ Send the draft with the decisions table. Apply his vetoes. Record his approval in the header.
  - [x] FR210 in the GDD still lists only the scarf. Ask him whether to run `gds-correct-course` now to add the trousers, belt, bare feet and any concept change to FR210, or to leave the guide as the concept Epic 2 reads (the epic's AC makes the guide that source). Do what he picks; don't edit the GDD outside that workflow.
  - [x] Fill in the Dev Agent Record and set the status to review.

### Review Findings

Code review on 2026-11-14 with three layers: Blind Hunter, Edge Case Hunter and Acceptance Auditor. None failed. Result: 2 decisions, 11 patches, 0 deferred, 3 dismissed.

**Resolved by the developer:** decision 1, option 1: the warmest is a group, Rowan and his fire family (applied as a patch). Decision 2, option 2: keep `#CFC6B6`; the guide notes the margin and leaves the read against `heroHorn` to story 0.12. He then chose to apply every patch. All 12 are applied and recorded in `sprint-change-proposal-2026-11-14-style-lock.md`, section 7.

- [x] [Review][Decision] "Rowan is the single warmest thing" can't hold beside the fire family — The guide's section 3 and epics 5.13 (also 2860, 3034, 4670, 4759) call Rowan, or a dimmer stage-2 Rowan, *the* warmest thing on screen. But `shot` (100 % saturation) and `ember` (90 %) out-rank `heroSeam` (86 %), and only Rowan's glow dims. NFR28 and story 4.8 name a group ("Rowan, his shots and the collectables"). Either the rule becomes a group, or the fire-family values change so that Rowan stays on top.
- [x] [Review][Decision] The hazard colour sits close to Rowan's horns and to the warm boundary — Emberwood `hazard` and `flyerAccent` `#CFC6B6` are hue 38°, saturation 20.7 %: 4.3 points under the warm line, and near `heroHorn` `#C4B198`. That threatens NFR27 (hazards told apart at a glance) and makes check 1 fragile under tuning.
- [x] [Review][Patch] Warm lists the correct-course missed: story 0.7's AC, story 0.12's AC, story 5.17, GDD Harrowmere look, NR100 and its narrative source; story 4.10 dropped the pickups with a self-contradicting rationale; three different names for the pickups [epics.md:865,1040,5685,4637,5403,5516; gdd.md:749; narrative-design.md:726; requirements-inventory.md:576]
- [x] [Review][Patch] The guide lacks the fire-family definition the planning docs point to; the point-light line is ambiguous; the warm endpoints aren't stated as inclusive; saturation ranks only the lantern check; the lantern margin has no rule [docs/STYLE_GUIDE.md:220,226-245]
- [x] [Review][Patch] "pit and water are the darkest values" contradicts check 4 [docs/STYLE_GUIDE.md:230]
- [x] [Review][Patch] Section 6's "FR210 says" table is stale now that FR210 changed; pointed ears are listed as an addition, though they were on the sheet [docs/STYLE_GUIDE.md:319-331]
- [x] [Review][Patch] The shading rule doesn't say how the lit and mid tones are made, or what carries texture [docs/STYLE_GUIDE.md: section 2, Shading]
- [x] [Review][Patch] Story palettes need slots (home, forge) that the 36-slot union lacks; the guide doesn't say whether `story.ts` has its own list [docs/STYLE_GUIDE.md: sections 5, 8]
- [x] [Review][Patch] Fonts: Alegreya isn't pinned (`@latest`); Source Sans 3's licence is cited from Google's copy, not Adobe's release; two `OFL.txt` files would collide in one folder [docs/STYLE_GUIDE.md: section 9, Typefaces]
- [x] [Review][Patch] Stories 0.8 and 0.14, and the epic's 0.5 AC, still say "three typefaces" and "only the weights the tokens use", which conflicts with two faces and Adobe's variable file [epics.md:784,880,887,889,1120]
- [x] [Review][Patch] The GDD hero edit added a line, so every later `gdd.md:` citation in the inventory is off by one; the edited rows switched to section-style citations [gdd.md:725-740; requirements-inventory.md:424,656]
- [x] [Review][Patch] The proposal's edit counts don't reconcile ("15 edits in 5 files" against "22 replacements across 4 files") [sprint-change-proposal-2026-11-14-style-lock.md: sections 3, 6]
- [x] [Review][Patch] The story record says "should" for changes it applied; the Dev Notes' bell, `heroSeam` and slot-count guidance were superseded without a note [this file: Completion Notes]

Dismissed:

1. The GDD calls the concept sign-off done while the story is in review. The developer did sign off; the story's review state doesn't undo that.
2. The Dev Notes' list of contrast pairs has 24, against the check's 25. The check reads its pairs from code, and the guide's table has all 25.
3. The wordmark on the title menu was "not decided". It was decided on 2026-11-13, in story 0.14's AC.

## Dev Notes

### Scope

- **In:** `docs/STYLE_GUIDE.md` (new); `docs/ASSETS.md` only if a new hero sheet is made; a new `art-src/reference/hero-concept-<style>.jpeg` only then; this story file; `sprint-status.yaml`.
- **Out, and owned elsewhere:**
  - palette and rig modules, the slot union: story 0.7
  - shipping the fonts, their ASSETS rows, `@font-face`: story 0.8
  - materials: 0.9; camera code and framing margin: 0.10; shadows, outline and grading passes: 0.11; test scene: 0.12
  - the sample card, the cards' warm-light exception, the card-shape source, the story palettes: 0.13
  - DESIGN.md's values: story 0.14, through `gds-ux` Update. **Don't edit DESIGN.md or `src/ui/styles/base.css` here.** The token drift test (story 0.3) would fail if `base.css` changed without DESIGN.md.
  - the HUD icons themselves: Epic 1 (placeholder) and Epic 3 (final); the title backdrop: Epic 6

### Repository state

- HEAD is `e6c2c20` (story 0.3). Story 0.4's changes are **staged, not committed**: `.gitattributes`, `.gitignore`, `docs/ASSETS.md`, the six `art-src/reference/*.jpeg` (Git LFS), its story file and `sprint-status.yaml`. T0 asks for that commit first.
- `.staging/` (ignored) holds staging copies of the six images. A new sheet can be staged there too.
- `make contrast` exists (story 0.3). `scripts/checkContrast.ts` › `readColors()` reads a Markdown file's frontmatter when the path ends in `.md`.
- Prettier ignores `*.md`, so the guide's layout isn't checked by `make check`. Keep it tidy by hand.

### What the references show (looked at 2026-11-14, contact sheet)

Re-open them yourself before describing them to the developer; this is only a head start.

- **One design, three treatments.** All three Rowans share the same design, because P2 and P3 attached P1: horns, red scarf, chest furnace, ember eyes, glowing seams, belted torn trousers, bare clawed feet.
- **Dark fantasy:** teal-green skin shading, soft gradients, no ink lines. The key art is cool teal with plum in the trees and a pale cold glow behind them; foliage silhouettes frame it. The figure reads less crisply at small size than the other two.
- **Comic:** near-black skin, heavy ink, flat fills. The key art is dominated by moss green, with black foreground framing and the darkest pit of the three, so pits read as dark most clearly here. Rowan stands out by his glow.
- **Mix:** ink lines with teal and plum banded shading. The key art is cold blue-teal with fog; the gap is misty rather than black, which needs care for the dark-pit rule (NFR29). The second boardwalk and root clutter on the left were noted in 0.4.
- **Engine cost:** comic and mix need the edge-outline pass (one of the two post-processing passes †). Dark fantasy doesn't, but leans on fog and soft gradients. Any of the three fits the budgets on paper; story 0.12 measures.
- **On every sheet:** one horn curls up and outward (not swept back) and the two don't match; the figure is about 3.7 to 4.2 heads tall; arms heavy, hands at mid-thigh. All three key arts show Rowan facing the viewer, not side-on: the model is posed by Epic 2's rig, so this needs no fix.

### Contact sheet

```sh
cd art-src/reference
magick montage -label '%t' \
  hero-sheet-dark-fantasy.jpeg hero-sheet-comic.jpeg hero-sheet-mix.jpeg \
  emberwood-key-art-dark-fantasy.jpeg emberwood-key-art-comic.jpeg emberwood-key-art-mix.jpeg \
  -tile 3x2 -geometry 900x620+16+16 -background '#1a1d22' -fill white -pointsize 18 \
  <scratchpad>/0-5-contact-sheet.jpg
```

ImageMagick 7.1.2 is installed (`magick`); plain `montage` also works, as in 0.4. The file goes to the scratchpad, not the repository.

### Palette slots

Proposed list; adjust to the chosen style and record the final list as a decision. One name per line in the frontmatter, the same names in every level.

| Group | Slots |
| --- | --- |
| Depth layers | `skyFar`, `ridgeFar`, `treeMid`, `fog`, `groundTop`, `groundSide`, `ledgeWood`, `foliage`, `foregroundDark` |
| Danger | `pit` (pits and deep water, dark), `water` (surface, Drowned Mill; present in every palette), `hazard` (spikes, thorns) |
| Rowan | `heroSkin`, `heroSeam` (seams, chest, eyes: the warmest), `heroScarf`, `heroCloth`, `heroHorn` |
| Fire family | `shot`, `ember`, `pickupWarm` (triple and piercing shot) |
| Collectables and markers | `bell`, `checkpoint`, `exit` |
| Enemies | `walkerBody`, `walkerAccent`, `flyerBody`, `flyerAccent`, `spitterBody`, `spitterAccent`, `seed` |
| Lights | `lantern` (Emberwood's lantern glow; in the other levels set to an unlit, cold value, since no lantern appears there) |

- Every palette must give every slot (story 0.7's type check). That is why `lantern` and `water` exist everywhere.
- Rowan's slots and the fire family are the same in all three levels (his palette doesn't change with the place), except where the guide says the seal break dims `heroSeam` in Harrowmere; if so, say whether that is a separate slot value or a lighting change. Recommend: the same slots, dimmed by the stage-2 material, so the palette stays per level.
- `bell` is neutral or cool (it is Elin's sign, not fire; the overlay rule keeps bells neutral too).
- Keep the list under about 32 slots; it is a palette, not a texture.

### Sampling colours

Sample from the chosen key art and hero sheet, then judge by eye:

```sh
# average colour of a region: WxH+X+Y in the source image's pixels
magick art-src/reference/emberwood-key-art-<style>.jpeg -crop 120x80+1400+300 +repage -scale 1x1\! -format '%[hex:p{0,0}]\n' info:
# the dominant colours of a whole image, for a first look
magick art-src/reference/emberwood-key-art-<style>.jpeg -resize 400x -colors 16 -unique-colors txt: | tail -n +2
```

- Key arts are 2752×1536; hero sheets 1792×2400.
- Crop the region to the scratchpad and **open it** before trusting its number (`-crop … +repage <scratchpad>/s.png`). JPEG noise and glow halos skew averages; sample flat areas.
- Rowan's glow in the image is a light, not a surface colour. `heroSeam` is the surface value; the glow intensity is the material's job (0.9).
- Record the crop rectangle beside each sampled slot, so the numbers can be re-checked.

### Deriving the other two levels (D5)

No key art exists for the Drowned Mill or Harrowmere, and making them is out of scope (one generated image per level would be scope growth, GDD PR30). Derive them:

- **The Drowned Mill:** fog over marsh, black water, turning wheels (GDD, Level looks; narrative design). Cooler and greyer than Emberwood, with more fog; `pit` and `water` darkest; almost no warm light (no lanterns: `lantern` unlit).
- **Harrowmere:** charred ruins, cold and grey ash; the coldest place in the game. Low saturation, blue-grey; nothing warm but Rowan and the embers.
- Enemies take each level's own colours (NR104): change their body and accent hue per level, keep their value contrast against the ground.
- In the comic style, each level has one dominant colour (GDD's candidate description): state it per level.
- Mark both as "derived, judged on the test scene in 0.12".

### Warm (D6)

A working definition, so story 0.7's tests and the overlay check have something to test: **a colour is warm when its HSL hue is from 330° through 360° to 70° and its saturation is at least 25 %.** This is a guess, not from any document; state it as a decision. Apply it to: the overlay (only `ember` may be warm), and the lighting rigs' warm lists (0.7). The red scarf is a warm *colour*, not a light, so `heroScarf` may be warm; the rule is about light and about what is warmest on screen.

### Overlay colours

- DESIGN.md's provisional values and contrast table are the starting point (it's in `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md`, Colors). Keep each role's job: dark grounds, light text, a cool focus ring.
- Tint the neutrals toward the chosen palette (for example the greys pick up its teal or slate), so the overlay belongs to the game. Keep `surface-scrim` at 75 % alpha (`BF`) unless a reason is written down.
- `ember` may be copied from the `ember` palette slot (UX-DR15); it must stay at least 3:1 on `hud-track` and against `hud-outline`.
- `heart-fill`, `weapon-timer`, `warden-bar`, `focus-ring` must fail the warm test (D6).
- `text-muted` on the scrim is never used (it measures about 3.6 on the provisional values), so it isn't a target; don't add it.
- The `colors:` map must hold **exactly** the 16 roles: `readColors()` fails on a missing role, an extra key, an unquoted `#` (YAML comment) or a non-hex value. Quote every value: `ember: '#E8902E'`.
- Pairs the check measures (`scripts/checkContrast.ts`): text ≥ 4.5 — `text-primary` and `text-muted` on panel, screen and focus; `text-primary` on the scrim over white; `text-primary` against `hud-outline`; `surface-panel` on `text-primary` (the "New best" tag). Non-text ≥ 3 — `focus-ring` on panel, focus, screen; `text-muted` on `border-subtle`; `heart-fill`, `ember`, `weapon-timer`, `warden-bar`, `warning` on `hud-track` and against `hud-outline`; `heart-empty` on `hud-track`.

### Weights the tokens use

From DESIGN.md's typography tokens (sizes are DESIGN.md's; this story only names faces):

| Role | Tokens and weights |
| --- | --- |
| Display | `display-xl` 700, `display-lg` 600, `display-body` 400 |
| UI | `ui-lg` 500, `ui-md` 400, `ui-sm` 500 |
| Numeric | `numeric-lg` 600, `numeric-md` 500, tabular figures |

So, as static files: display 400, 600, 700; UI 400, 500; numeric 500, 600. Up to 7 static `.woff2` files, or fewer with variable fonts (one file covers a weight range, often larger than one static weight but smaller than three). The guide may propose a weight change (for example display 400 and 700 only) to fit the budget; if so, list it for story 0.14's DESIGN.md update and as a decision.

- A Latin-subset static weight is typically about 15 to 40 KB as `.woff2`; that is a rough guide, not a measurement. AC18 needs the measured sum.
- Google Fonts serves OFL families; its CSS API serves subsets per Unicode range. Download the full Latin files from the family's source (its GitHub repository or the Google Fonts download), and check what the files cover. Don't assume the CSS API's split files are what 0.8 will ship.
- Read the licence on the day (OFL text or the foundry's page). A licence that asks for a credit inside the game is flagged for Epic 6's Credits.
- The display face carries the dark-fantasy tone (wordmark, level names, card lines); it must stay legible at `display-body`'s 16 px floor, so avoid a blackletter or a thin decorative face for it. UI and numeric faces: plain, sturdy, legible at 13 px.

### Characters the story text uses

The story text is in the narrative design, Story Text Script (`_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md`). Extract its characters rather than guessing:

```sh
sed -n '/Story Text Script/,/^## /p' <narrative-design.md> | grep -o . | sort -u | tr -d '\n'
```

Check the script section's real heading first; the command is a sketch. The text uses curly quotes (“ ” ’) at least, for example card 2's line. Every character must be in the display face (story 0.8 checks it by eye).

### Lighting rule

Per level, give colours and relative strengths in words or rough ratios; exact intensities are tuning numbers that story 0.7 puts in data and story 0.12 judges. For example: Emberwood key light cool moonlit teal from upper left, fill a dim plum, fog teal-grey from the middle distance back; warm list: Rowan, his shots, embers, collectables, lanterns. Harrowmere: grey key, near-neutral fill, ash-grey fog; warm list: Rowan, his shots, embers, collectables.

### Decisions made in this story (the developer can veto them at review)

| # | Decision | Why |
| --- | --- | --- |
| D1 | The agent drafts every value and rule; only the style, the concept sign-off, the faces, the camera and the final approval are asked. | The developer's stated preference: recommendations drafted, real forks asked, decisions listed. |
| D2 | The guide's YAML frontmatter holds `colors:` (exactly the 16 roles) and `palettes:` (one map per level). | `make contrast COLORS=docs/STYLE_GUIDE.md` reads `colors:` directly (story 0.3 built it for this). A `palettes:` map lets story 0.7 test its modules against the guide, as story 0.3 tests `base.css` against DESIGN.md. `colors:` may hold nothing else, so palettes sit beside it. |
| D3 | Hex values are `#RRGGBB`, uppercase, quoted. Slot names are lower camelCase. | Matches DESIGN.md's style and TypeScript identifiers for 0.7's union. |
| D4 | One slot list for every level, every slot always present. | 0.7's type check fails on a missing slot; recolours need the same names. |
| D5 | The Drowned Mill and Harrowmere palettes are derived, not generated. | No key art exists for them; generating more is scope growth. 0.12's test scene judges them. |
| D6 | "Warm" means HSL hue 330°–70° with saturation ≥ 25 %. | No document defines it; tests and the overlay rule need one. A guess. |
| D7 | Rowan's palette is the same in every level; stage 2's dimmer glow is a material change. | His look is about him, not the place; it keeps the palette per level. |
| D8 | The `lantern` slot exists in every palette, unlit outside Emberwood. | D4; NR101 is kept by the rig's warm list, not by a missing slot. |
| D9 | The concept sign-off writes corrections into the guide rather than regenerating by default. | The model is built in Tripo from new views in story 2.2 anyway; a written rule costs nothing. A new sheet stays available. |
| D10 | Fonts are measured in the scratchpad here and shipped in 0.8. | The epic puts shipping in 0.8; the budget must be known now. |
| D11 | The guide names no other game, studio or artist, even as a mood reference. | CLAUDE.md's hard limits, as story 0.4 read them; the GDD's mood references stay in the GDD. |
| D12 | DESIGN.md and `base.css` stay untouched; story 0.14 applies the values. | The epic's order; the drift test would fail otherwise. |

### Guide layout

A suggested order, so 0.7 to 0.15 find things fast:

1. Header: status, approved by and date, sources (the references by path)
2. The choice and the reasons
3. Rules: shading, outline, grading, lighting (per level), camera, shadows (open, 0.11), passes
4. Warm light (the full rule and the definition)
5. Palettes: a table per level (slot, hex, sampled or derived, crop or note)
6. Rowan (the signed-off concept, stage 2 note)
7. Enemies (recolour rule, per-level hue notes)
8. Story cards (style; open: the exception, the shape source, the story palettes)
9. Overlay: colours (table with reasons), contrast table, typefaces, HUD icons, wordmark, title backdrop
10. How assets are judged
11. Open items and the stories that close them (0.11, 0.13, 0.14)

### Previous story intelligence (0.4)

- The images are JPEG (`.jpeg`), not PNG. Cite them by their real names.
- The Gemini app honoured 16:9 for the key arts even with a 3:4 image attached; one-chat-per-image and edit-before-regenerate worked; spend so far is 7 of 30 attempts across six images (5 † per image).
- No visible watermark appeared, although the setting is on.
- The developer adds design details when he sees an image (the trousers). Expect the same at the concept sign-off, and write what he says into the guide in his terms.
- 0.4's open items routed here: fix the horns, height and arms at the concept sign-off; FR210 should list the trousers once the concept is signed off (T9 asks how).
- The originality grep (story 0.4, AC5) is the pattern for any new prompt: `grep -n -i -E 'toki|hollow knight|mandragora|prince of persia|lost crown|dungeons|d&d|ghibli|disney|pixar|arcane|mignola'` must find nothing. Run it on the guide too, since D11 applies.

### Git intelligence

- Recent commits are one per story, on master, titled "<what>: story 0.N, reviewed and done". Commits happen when the developer asks.
- Stories 0.1 to 0.3 built the toolchain, the budget check and the tokens with their contrast check. 0.3's `scripts/checkContrast.ts` is the tool this story reuses; don't write another.

### Latest technical information

- No library or API is used in this story. The only tools are ImageMagick 7.1.2 (system, already used in 0.4), `make contrast`, and the Gemini app if a new sheet is made.
- Font licences and file sizes must be read on the day (AC17, AC18); nothing here is from a check made today.

### Project Structure Notes

- `docs/STYLE_GUIDE.md` is where the architecture's tree puts it ("Written in Epic 0"). `docs/` is the folder BMad agents scan.
- No conflict with the structure. No new folder.

### Project Context Rules

- No dependency, folder or tuned number changes without asking. A font is an asset, not a dependency, but downloading one to `public/` is 0.8's job.
- Never hard-code values outside their homes: the guide is the source; 0.7 and 0.14 copy from it.
- Legal: nothing from Toki or any other game, nothing invented by D&D; log every asset, its tool, licence and AI flag in `docs/ASSETS.md`.
- Visual work: look at every image before describing it; the renderer owns the style; nothing is judged against a newly generated image after this story.
- Run project commands through `make`.

### References

- Epic 0 and story 0.5: `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md` (Epic 0, Story 0.5; stories 0.6 to 0.15 for what reads the guide)
- Requirements: `…/gdd-emberbound-2026-11-12/requirements-inventory.md` (FR164–FR167, FR208–FR210, NR14–NR15, NR100–NR104, NFR27–NFR29, NFR33–NFR38, PR22–PR25, AR160–AR170, AR179, UX-DR1–UX-DR16, UX-DR61, UX-DR111)
- GDD, Art and Audio Direction › Art Style: `…/gdd-emberbound-2026-11-12/gdd.md`
- Narrative design, Color and Lighting, Visual Symbolism, Story Text Script, story cards: `…/narratives/narrative-emberbound-2026-11-13/narrative-design.md`
- Architecture, Rendering (camera, materials, palette module, lighting rig, card scene), Asset budgets: `…/architectures/architecture-emberbound-2026-11-13/game-architecture.md`
- DESIGN.md, Colors, Typography, Shapes: `…/ux-designs/ux-emberbound-2026-11-13/DESIGN.md`
- Brief §5, Art direction and "The renderer owns the style": `docs/PROJECT_BRIEF.md`
- Story 0.4 (images, prompts, generation log): `_bmad-output/implementation-artifacts/0-4-generate-the-hero-and-emberwood-references-in-each-candidate-style.md`; `docs/ASSETS.md`
- The contrast tool: `scripts/checkContrast.ts`, `make contrast`

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code.

### The developer's decisions (AskUserQuestion, 2026-11-14)

| Fork | His answer |
| --- | --- |
| Style | **The mix** (recommended). Reason, in the guide: "The ink keeps Rowan and the hazards readable at a glance, and the cold palette carries the cold-world, warm-hero mood." |
| Concept sign-off | **Sign off as drawn**, against the recommendation to write corrections; "i like it as is" to the corrections list. So about 4 heads tall, the mismatched horns and the heavy arms stay, and the guide's Rowan section lists them so Epic 2 models them. |
| Pointed ears | **Keep** (not asked for in FR210; on every sheet). |
| Camera | **Perspective** (recommended). |
| Grading | **No grading pass** (recommended). The outline pass is the only post-processing pass. |
| Bell colour | **Warm brass** (recommended). Resolves a conflict between NFR28 ("the collectables" warmest) and NR15 (in-play warm light reserved for Rowan, embers and lanterns): bells join the fire family. The HUD bell icon stays neutral per DESIGN.md. |
| Display face | **Alegreya** (recommended). |
| UI and numeric face | **Source Sans 3** (recommended). |
| The guide | **Approved as is**, with the 13 decisions below. |
| FR210 in the GDD | **Run `gds-correct-course` right after this story** (recommended), to bring FR210 in line with the signed-off concept. |

### Decisions made for him (listed at review; none vetoed)

1. 36 slots, the same in every level. `skyGlow`, `bark` and `ink` were added to the story's proposed list; `lantern` and `water` exist everywhere. That is a few more than the Dev Notes' "about 32".
2. Shading: 3 hard bands †, the shadow band tinted by the level's fill; glowing parts unshaded; no specular highlights.
3. Outlines: one full-frame pass in the `ink` slot, about 2 px at 1080 lines †; no lines on the far layer.
4. "Warm" means HSL hue 330°–70° with saturation ≥ 25 % (a guess, D6). Lanterns are kept less saturated than the fire family.
5. Lighting per level in words and slot colours; intensities are left to 0.7 and 0.12.
6. The Drowned Mill and Harrowmere palettes are derived. Harrowmere's enemies were moved to colder, more saturated violets after the swatch preview showed `walkerBody` `#5A5F70` too close to `groundTop` `#4D5258`. The Drowned Mill's `spitterBody` moved from `#3D5A3A` to `#2F6A47`, away from its foliage.
7. The enemy colour families per level; the thorn flyer's accent equals `hazard`.
8. Hazards are pale bone, the checkpoint cold teal, the exit pale cold white.
9. The overlay neutrals are tinted slate teal; `ember` is copied from the palette.
10. Source Sans 3 ships as Adobe's unmodified variable file (Reserved Font Name "Source"); the OFL text ships with the fonts; fallbacks are Georgia and system-ui.
11. Cards: flat paper-cut layers with no outline pass; the front layer is near ink.
12. HUD icons: the `hud-outline` ring is the ink line; panels keep their hairline; the triple shot is a three-pronged spread, the piercing shot one long spike.
13. The title backdrop: Emberwood's forest edge at dusk, with the foundry chimney, rendered in the engine.

### Debug Log References

- **T0:** story 0.4 was already committed (`bbff32c`) when the story started. `baseline_commit` is set to it.
- **Contact sheet:** `magick montage`, 3×2, `-geometry 900x620+16+16`, saved to the scratchpad as `0-5-contact-sheet.jpg` (2796×1350). Looked at, then sent. A second image of Rowan cropped at native size from each key art (`0-5-hero-crops.png`) was looked at and sent with it. Neither is committed.
- **What the crops showed:** the comic Rowan reads best at play size; the mix reads well by ink, but his teal and plum shading sits close to the ground's colours; the dark-fantasy Rowan's edges blur into the teal ground.
- **Hero check (mix sheet, at 1000 px width):** head about 280 px (scalp to chin), figure about 1,110 px (scalp to soles), so about 4.0 heads. One horn hooks up, the other sweeps out and back. Pointed ears. Hands at mid-thigh. Skin reads slate, with teal and plum bands.
- **Sampling:** two passes of region averages, each crop looked at in a labelled sheet. The first pass hit edges and ink on 6 of 14 regions and was redone from a 50 px grid of the ledge, trunk and mid-tree areas. Bark, horn, scarf, ink, the lantern glow and the hero's skin, seams and glow come from ImageMagick quantise clusters (4 to 14 colours) of their regions. Every slot's source is in the guide's table.
- **Warm and dark checks** (a stdlib Python script in the scratchpad, `tools/guidecheck.py`, reading the guide's frontmatter): 36 slots in each of the three palettes, the same names; no warm slot outside Rowan, the fire family and Emberwood's lantern; Emberwood's lantern at 66 % saturation, below all six fire and glow slots (71–100 %); `pit` the darkest slot in every palette; `water` darker than everything but `pit`, `foregroundDark` and `ink`; all 36 body-table rows match the frontmatter.
- **Readability mock:** flat colour boxes with ink edges on each level's ground (`palettes-mock.png`, scratchpad), looked at and sent. Pits read black; the warm items stand out; enemies separate from the ground. It has no lighting, fog or shading bands, so it is a sanity check, not a judgement; story 0.12 judges.
- **Font research:**
  - Fontsource API metadata, fetched 2026-11-14. Alegreya v41, Grenze v18, Spectral v15, Alegreya Sans v28, Source Sans 3 v20, Fira Sans v18 and IBM Plex Sans v23 are all OFL-1.1. Alegreya Sans has no 600 weight, so it was dropped for the numeric role.
  - Latin `.woff2` files for the token weights were downloaded from jsDelivr into `scratchpad/fonts-dl/` (its own folder) and measured. Display, 400/600/700: Alegreya 71,684 B, Grenze 45,660 B, Spectral 67,668 B. UI and numeric, 400/500/600: Source Sans 3 47,016 B, Fira Sans 72,772 B, IBM Plex Sans 71,024 B.
  - fontTools 4.60.1 with brotli, run through `uv run --no-project` as a scratch tool and not added to the project, checked every file. All cover the required characters. Alegreya, Grenze, Spectral and Fira have `tnum`. IBM Plex and Source Sans 3 have equal-width default digits.
  - The samples were rendered with ImageMagick from TTF conversions, looked at, and sent.
- **Source Sans 3's Reserved Font Name:** the OFL text in `google/fonts` reads "with Reserved Font Name 'Source'". Adobe's unmodified release files (3.052R) were measured. Static Regular, Medium and Semibold come to 327,376 B, over budget alone. The variable `SourceSans3VF-Upright.ttf.woff2` is 170,188 B (`wght` 200–900), with full coverage and tabular default digits. With Alegreya's Latin statics, 241,872 B ≤ 300,000.
- **Characters:** extracted from the Story Text Script's lines and EXPERIENCE.md's on-screen strings. Beyond letters, digits and space, they are `. , ? : - ' ’ “ ” –`. The `–` (en dash) is the level select's "no best time".
- **`make contrast`**, last run on the approved guide:

  ```text
  $ make contrast COLORS=docs/STYLE_GUIDE.md
  [ui]   PASS  14.68:1 ≥ 4.5  text-primary on surface-panel
  … (25 pairs, every one PASS; the full table is in the guide, section 9)
  [ui]   info   3.86:1        text-muted on surface-scrim (a "never" rule, DESIGN.md Colors: not a target)
  [ui] 25 of 25 targets met
  [ui] Contrast OK: 25 pairs, every target met (docs/STYLE_GUIDE.md)
  ```

- **Originality grep** (story 0.4's AC5 pattern) on `docs/STYLE_GUIDE.md`: no match (exit 1).
- **markdownlint (IDE):** MD025 flagged two H1s because the frontmatter had a `title:` key. The key was removed.
- **`make check`:** exit 0. Lint, Prettier, both type checks, and Vitest with 4 files and 164 tests, unchanged, since no code changed.

### Completion Notes List

- **AC1–AC3:** the contact sheet and the hero crops were sent with a per-style comparison. He picked the mix; the reason, the date and the reference paths are in the guide, section 1. Nothing was deleted.
- **AC4–AC6:** 36 named slots × 3 levels, in the frontmatter `palettes:` map and the section 5 table. Emberwood was sampled, with the crops recorded. The Drowned Mill and Harrowmere are marked derived, to be judged in 0.12.
- **AC7–AC9:** shading, outlines (used, `ink`, about 2 px †), grading (none), lighting per level, camera (perspective), shadows (left to 0.11), passes (1 of 2), the full warm-light rule with a definition and four testable checks, and the judging rule. No other game is named.
- **AC10–AC12:** FR210 was checked point by point. He signed off as drawn, so no new sheet was made, no generation spent and `docs/ASSETS.md` is unchanged. The departures from FR210's wording are listed in the guide, section 6.
- **AC13–AC14:** the card style is fitted to the mix. The warm-light exception, the shape source and the story palettes are marked open for 0.13.
- **AC15–AC16:** the 16 roles are in the frontmatter `colors:` map and a table with reasons. `ember` is the only warm value. `make contrast COLORS=docs/STYLE_GUIDE.md` passes 25 of 25, and the re-measured table is in the guide. DESIGN.md and `base.css` are untouched (story 0.14).
- **AC17–AC18:** two faces cover the three roles. Alegreya is OFL with no Reserved Font Name. Source Sans 3 is OFL with Reserved Font Name "Source", so Adobe's unmodified variable file is the one to ship. Licences were read on the day, with URLs. Coverage and tabular digits were checked. The measured total is 241,872 B. Nothing was added to `public/`.
- **AC19–AC21:** the HUD icon style, the wordmark (Alegreya 700, `display-xl`, no glow) and the title backdrop style (an Emberwood dusk scene in the engine).
- **AC22:** the draft was sent with the 13 decisions. He approved it as is, and the header records the approval and the date.
- **AC23:** nothing was rendered in the engine, so no critic loop ran. `make check` passes.
- **Planning text corrected** through `gds-correct-course`, run right after this story and applied 2026-11-14 (`sprint-change-proposal-2026-11-14-style-lock.md`, approved), then amended at code review (its section 7):
  - FR210, NR56, the GDD hero block, the narrative's Rowan and story 2.2's AC now match the signed-off concept.
  - NR15, NR100, NFR28 and every in-play warm list in `epics.md` now name Rowan's fire family (shots, embers, bells, weapon pickups), and "the warmest" is that group.
- **Superseded Dev Notes:** the Dev Notes were written before the developer's decisions. Their "`bell` is neutral or cool", "`heroSeam` … the warmest" and "keep the list under about 32 slots" are replaced by the approved guide: warm brass bells, `heroGlow` for the chest and eyes, and 36 slots.
- **For later stories, recorded in the guide:**
  - 0.7 tests the four palette checks and gets slot names from the frontmatter.
  - 0.8 ships Alegreya's Latin statics, Adobe's variable Source Sans 3 and both `OFL.txt` files.
  - 0.14 copies the colours, the faces and the fallbacks.

### File List

- `docs/STYLE_GUIDE.md` (new)
- `_bmad-output/implementation-artifacts/0-5-pick-the-style-and-write-docs-style-guide-md.md` (this story)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)
- Changed by the `gds-correct-course` run that followed, through its own approved proposal, not by this story's tasks:
  - `_bmad-output/planning-artifacts/sprint-change-proposal-2026-11-14-style-lock.md` (new)
  - `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md`
  - `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/decision-log.md`
  - `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md`
  - `_bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md`
  - `_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md`

## Change Log

- 2026-11-14: Story created (ready-for-dev).
- 2026-11-14: Story implemented. The developer picked the mix, signed off Rowan as drawn, and chose a perspective camera, no grading, warm brass bells, Alegreya and Source Sans 3. `docs/STYLE_GUIDE.md` was written and approved, and contrast passes 25 of 25. Status set to review.
- 2026-11-14: `gds-correct-course` brought FR210, NR15, NR56, NFR28 and 8 epic ACs in line with the signed-off concept and the bell decision (`sprint-change-proposal-2026-11-14-style-lock.md`, approved and applied).
- 2026-11-14: Code review: 2 decisions resolved (the warmest is a group; the hazard colour is kept), 12 patches applied to the guide, the planning documents and the proposal, 0 deferred, 3 dismissed. Status set to done.

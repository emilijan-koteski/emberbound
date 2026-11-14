---
baseline_commit: e6c2c20
---

# Story 0.4: Generate the hero and Emberwood references in each candidate style

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a hero design sheet and Emberwood key art in each candidate style,
so that I choose the game's look from images of my own hero and first level, not from placeholder scenes.

**Requirements:** FR210 (concept), NFR34, NFR37, NFR38, PR22, PR26 (image model and tool budgets), AR158
**Epic:** 0, Reference and style lock. Stories 0.1 to 0.3 are done. This is the first story that touches art. It also commits the repository's first Git LFS files.

## What kind of story this is

**Not a code story.** It is a loop between the agent and the developer:

1. The agent checks Google's terms and writes `docs/ASSETS.md`.
2. The agent writes the prompts.
3. The developer runs each prompt in the Gemini app (gemini.google.com) and saves the image to a staging folder.
4. The agent opens each image, checks it against the rules, and keeps it or asks for a regeneration.
5. The agent copies the kept images into `art-src/reference/` and logs them.

The agent cannot run the Gemini app: there is no API key and no API spend (GDD Dependencies, tool budgets). Every generation is the developer's step. **Stop and wait for the developer** at each hand-off marked ⏸ below. Don't guess what an image shows. Open it with the Read tool first (CLAUDE.md, Visual work).

## Acceptance Criteria

These are the epic's ACs, made exact. Where this story reads the epic differently, the decision is in Dev Notes › Decisions (D1–D11). The developer can veto any of them at review.

### Terms first

- **AC1.** Before any prompt is run, `docs/ASSETS.md` exists with three parts:
  - a **Tools** table: tool, version or plan, licence and commercial-use terms, date checked
  - an **Assets** table: file, tool, licence, AI-generated (yes or no), prompt, date
  - a **Prompts** section that the asset rows cite by ID (D8)
- **AC2.** The image model's Tools row is filled in from Google's official pages (see Terms check). It records:
  - the plan (Google AI Pro, student offer) and the date the offer ends, read by the developer from his own subscription page
  - who owns the generated images, and whether they may be used commercially
  - whether prompts and uploads may be read by human reviewers or used for training, and which Keep Activity setting the developer chose
  - the visible watermark: whether the Media Watermark setting is offered on his account, and which way he set it; plus the invisible SynthID mark and the Content Credentials, which can't be turned off
  - the date checked, and each page's address
- **AC3.** If the terms don't allow commercial use of the images, or the tool budget isn't set in the GDD, stop. Report what was found and let the developer decide. The budget is set: GDD Dependencies, "Tool budgets", 2026-11-13.

### Prompts and images

- **AC4.** Six prompts, P1 to P6, adapted from `docs/PROJECT_BRIEF.md` §5 for Nano Banana Pro in the Gemini app (see Prompts). Each prompt is recorded in full in the Prompts section of `docs/ASSETS.md`, along with any follow-up edit messages:
  - one hero sheet per style
  - one Emberwood key art per style
  - the three styles: stylised dark fantasy, comic illustration, and the mix
- **AC5.** The prompts name no other game, studio, artist or franchise. Before the prompts go to the developer, a case-insensitive grep of the prompt text finds none of these: Toki, Hollow Knight, Mandragora, Prince of Persia, Lost Crown, Dungeons, D&D, Ghibli, Disney, Pixar, Arcane, Mignola. Record the command and its output.
- **AC6.** Each kept **hero sheet** shows:
  - one full-body figure in a neutral standing pose, on a plain light background
  - Rowan's cursed form: a horned ember-beast that is clearly not an ape; upright, two legs and two arms, about 3 heads tall; two bone horns sweeping back; a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; a torn red woodsman's scarf
  - a determined look, not a monstrous one
  - the style's traits (Style blocks)
- **AC7.** Each kept **key art** shows:
  - a side-on 2.5D platformer view of Emberwood at dusk
  - the hero small, in the lower third
  - a clear walkable ground line, one gap and one raised platform
  - hanging lanterns and drifting embers
  - layered depth: dark foreground plants, the play area, misty trees, distant ridges
  - the style's traits
- **AC8.** In every kept image:
  - there is no text, lettering, labels or interface (D10 covers the watermark)
  - warm light comes only from the hero, the embers and the lanterns; the red scarf is a warm colour, not a light, so it is allowed
  - the tone is dark fantasy, whichever style

### Looking, regenerating, stopping

- **AC9.** The agent opens every image the developer saves, before describing or keeping it. It writes one row per attempt in the Generation Log (Dev Agent Record): the image, the attempt number, the AC6 to AC8 rules it fails, and the verdict (keep, regenerate, or edit with a message).
- **AC10.** An image that fails a rule is regenerated or edited. **Every generation or edit counts toward that image's budget: at most 5 †, the first attempt included.**
- **AC11.** If an image reaches 5 attempts without meeting every rule, stop that image. Report the spend (attempts per image and in total) and the rules each image still fails. The developer decides: keep it as it is, give it more attempts, or change the rule. Readiness proposal 2026-11-13, Q9; tools decision 2026-11-13, T1.
- **AC12.** No image takes a name, character or layout from Toki or any other game, or anything Dungeons & Dragons invented (NFR37, NFR38). If an image clearly echoes a known character, the agent says so and it counts as a failed rule.

### Committing

- **AC13.** Before the first LFS file is staged, the developer checks his own GitHub billing page for the LFS storage and bandwidth quota. The agent records the figures and the date. This was carried over from story 0.1's AC29.
- **AC14.** `git lfs version` works from VS Code's built-in git environment, or the developer commits from a mise-activated shell. Record which one. This is story 0.1's open PATH caveat.
- **AC15.** The six kept images go into `art-src/reference/`:
  - named exactly as in File Names, keeping the extension the Gemini app gave them
  - not re-encoded, resized or cropped (D7)
- **AC16.** `git check-attr filter -- art-src/reference/<file>` reports `lfs` for each file. After `git add`, `git lfs status` lists them as LFS objects, not as Git blobs. Record both outputs.
- **AC17.** Each kept image has one row in the Assets table:
  - AI-generated: yes
  - tool: Gemini app, Nano Banana Pro
  - its prompt ID (and edit messages, if any)
  - the date generated
  - licence: the Tools row's terms
  - attempts used
- **AC18.** Images that weren't kept are not committed. Their attempts appear only in the Generation Log (D6).

### The comparison

- **AC19.** The developer sees the six kept images side by side, in two rows:
  - the three hero sheets on top, the three key arts below
  - each labelled with its style
  - the tool budget spent so far: attempts per image and in total, against the 30-attempt ceiling (6 images × 5)

  The agent makes a contact sheet with the system ImageMagick (`montage`) in the session scratchpad (D9), looks at it, and sends it to the developer.
- **AC20.** Nothing is rendered in the engine, so no critic loop runs. `make check` still passes, since no code changes. Run it and record the result.

## Tasks / Subtasks

- [x] **T1. Check Google's terms and write `docs/ASSETS.md`** (AC 1–3)
  - [x] Fetch each official page under Terms check and note the facts AC2 needs, each with its URL. Quote Google's own wording on ownership and commercial use.
  - [x] ⏸ Ask the developer for the four facts only his account shows (one AskUserQuestion round, or one message):
    - the student offer's end date
    - whether he signs in to Gemini with a personal or a school account; the Media Watermark toggle doesn't exist on school accounts
    - his Keep Activity choice
    - his Media Watermark choice
  - [x] Write `docs/ASSETS.md` (see `docs/ASSETS.md` shape). Fill in the Gemini row.
  - [x] If commercial use is not allowed: stop (AC3).
- [x] **T2. Write the prompts** (AC 4, 5)
  - [x] Build P1 to P6 from Prompts and Style blocks. Re-read Google's current Nano Banana Pro prompting guidance first (see Latest technical information) and adjust the wording if it says otherwise. Record any change.
  - [x] Run the AC5 grep and record it.
  - [x] Add P1 to P6 to the Prompts section of `docs/ASSETS.md`.
  - [x] ⏸ Give the developer the run order (Run order), the staging folder (D5), and the prompts as copy-ready blocks.
- [x] **T3. Generate, look, keep or regenerate** (AC 6–12)
  - [x] For each image the developer saves:
    - open it with Read
    - check it against the AC6 to AC8 checklist (Checking an image)
    - write the Generation Log row
    - give a verdict
  - [x] For a regeneration, prefer an edit message in the same chat that names only the failing rule (D2), for example "Same image, but remove the text label at the top". Record the message under that prompt ID.
  - [x] Keep the attempt count per image. At 5 attempts: stop (AC11).
  - [x] Keep the run order (Run order), since later prompts attach earlier kept images.
- [x] **T4. Commit preparation** (AC 13–18)
  - [x] ⏸ The developer checks the GitHub LFS quota on his billing page. Record it.
  - [x] Check `git lfs version` from VS Code's git, or agree to commit from the terminal. Record which.
  - [x] Copy the six kept files from staging to `art-src/reference/` under the names in File Names. Don't create any other folder.
  - [x] Run `git check-attr` and `git add`, then `git lfs status`. Record the outputs.
  - [x] Add the six Assets rows.
- [x] **T5. Contact sheet and spend** (AC 19)
  - [x] Build the contact sheet with `montage` (see Contact sheet). Open it to check the labels and the order, then send it to the developer with SendUserFile, along with the spend table.
- [x] **T6. Close** (AC 20)
  - [x] Run `make check` and record the result.
  - [x] Fill in the Dev Agent Record: the terms facts, the Generation Log, the spend, the LFS quota, the AC14 route, and any decision changed.
  - [x] Set Status to `review`. Committing follows the project's rule: on master, when the developer asks.

### Review Findings

Code review, 2026-11-14 (Blind Hunter, Edge Case Hunter, Acceptance Auditor). The auditor found no blocking AC violation. It confirmed the byte copies, dimensions, byte total, LFS pointers and OIDs, `.gitignore:40`, the attempt counts, and a C2PA block in the files.

Four findings dismissed:
- Rowan faces the viewer in the key arts: AC7 asks for a side-on view of the level, and it is disclosed.
- His head sits above the lower-third line: his feet are in it, and it is disclosed.
- Only the images are staged: the commit stages every story file explicitly.
- `_bmad-output/**` images bypass LFS: that is deliberate, from story 0.1's review.

- [x] [Review][Decision] P6 key art: a second raised boardwalk and a cluttered ground line on the left — AC7 says "a clear walkable ground line" and "one raised platform". The log calls both borderline. One edit (attempt 2 of 5) could remove the left boardwalk and flatten the ledge, or the image can be kept as it is for the style comparison. **Resolved 2026-11-14: keep as is.** It is a style comparison, not a layout one. Both points are recorded as accepted deviations.
- [x] [Review][Decision] P1 hero: the horns don't sweep back, he's about 3.7 to 4.2 heads tall, and his arms are still heavy — the auditor reads the horns as up-and-out and asymmetric, against AC6 and the log's "pass", and measures about 4.2 heads by eye. P2 and P3 inherit all of it, and the key arts inherit P2 and P3. Re-doing P1 means re-running everything after it. The alternative is to keep it and fix the concept in story 0.5, which already allows a new sheet within budget at sign-off. **Resolved 2026-11-14: keep, and fix in story 0.5.** The horns sweeping back, about 3 heads and lighter arms go into 0.5's concept sign-off. The log corrects the horns to borderline.
- [x] [Review][Decision] The `/gitignore/` staging folder: its name and how long the rule stays — the name is easily confused with `.gitignore`. It also reverses D5 ("no new folder or `.gitignore` change"), which isn't recorded as a changed decision. The choices are to keep the rule permanently for later image stories (0.5, 2.2, 3.x), rename it to `/.staging/`, or remove the folder and the rule after story 0.5. **Resolved 2026-11-14: rename to `/.staging/`** and keep it for later image stories. D5 is recorded as changed.
- [x] [Review][Patch] The Completion Notes and the `.gitignore` comment say rejects stay in `gitignore/`; the only reject, `p1-a1.jpeg`, is gone, and the folder holds only kept copies [story Completion Notes; .gitignore:38-39]
- [x] [Review][Patch] The ASSETS.md Tools row says "the visible watermark is on"; only the setting is on, and no image has a mark. Also state that the toggle was offered on the account [docs/ASSETS.md:11]
- [x] [Review][Patch] Ownership is overstated: "you retain any intellectual property rights that you have" doesn't mean the developer owns protectable rights. Add that the copyright status of AI output is uncertain and nothing grants exclusivity [docs/ASSETS.md, Tool notes]
- [x] [Review][Patch] The commercial-use conclusion didn't check the Google AI Pro, student-offer and Gemini Apps terms. Fetch them and record the result [docs/ASSETS.md, Tool notes]
- [x] [Review][Patch] The ToS ban on using output "to develop machine learning models" may cover uploading the concept to Tripo. Flag it in ASSETS.md for story 2.1 to settle against Tripo's terms [docs/ASSETS.md, Tool notes]
- [x] [Review][Patch] "Store pages disclose it when asked" is narrower than the ToS. Say AI use is disclosed wherever a store or page requires it, and the work is never presented as human-made [docs/ASSETS.md, Restrictions]
- [x] [Review][Patch] The $19.99 price is under a *(developer)* bullet, but it comes from the tools decision and wasn't re-verified. Label its source [docs/ASSETS.md, Plan]
- [x] [Review][Patch] "SynthID and Content Credentials stay intact" is asserted, not checked. Record the C2PA evidence (`urn:c2pa` in the files) and say SynthID wasn't verified (Google's upload check is the developer's optional step) [docs/ASSETS.md, Assets note; D7]
- [x] [Review][Patch] ASSETS.md says only `public/assets/` ships; Vite ships all of `public/` [docs/ASSETS.md:3]
- [x] [Review][Patch] The AC5 grep was recorded only on the pre-trousers scratch file, without the P1 edit message. Re-run it on the final ASSETS.md Prompts section and record the raw output [story, Terms Check › AC5 grep]
- [x] [Review][Patch] Two prompt changes are missing from the list: "seen side-on" in P4 to P6, and the "Style:" prefix [story, Prompt changes]
- [x] [Review][Patch] The AC16 and AC13 outputs are paraphrased. Paste the raw `git check-attr` and `git lfs status` output [story, Debug Log]
- [x] [Review][Patch] The Generation Log file sizes are MiB labelled "MB", while the total is decimal. Use decimal MB throughout [story, Generation Log]
- [x] [Review][Patch] The P1 attempt 2 row lists the horns as a pass and the height as 3.7 heads. Mark the horns borderline and the height as "about 3.7 to 4.2 by eye" (follows decision 2) [story, Generation Log]
- [x] [Review][Patch] The prompting-guidance sources have no URLs. Add the blog.google, Google Cloud, DeepMind and Gemini API links [story, Prompt changes]
- [x] [Review][Patch] The contact sheet's labels carry attempt counts, and its geometry is 900x620, not 640x480. Disclose both as deviations from the Dev Notes [story, Debug Log]
- [x] [Review][Patch] The AC14 route was inferred from a VS Code helper process's PATH. Say so, and confirm it at the first push, when the LFS pre-push hook runs [story, LFS Quota and Route]
- [x] [Review][Patch] Stale `.png` text: the File Names `<ext>` note and the "six reference PNGs" line. Correct both to `.jpeg` so stories 0.5 and 2.2 can't copy wrong paths [story, Dev Notes › File names, Previous story intelligence]
- [x] [Review][Patch] `last_updated` moves from 15:30 to 14:20: HEAD's 15:30 was ahead of the real clock. Note it in the Debug Log so it isn't read as a lost merge [sprint-status.yaml:2,44]
- [x] [Review][Patch] `.gitattributes` doesn't route `*.avif`, `*.gif`, `*.tif`/`*.tiff` or `*.jfif` to LFS outside `art-src/`. Add them now, while no such file exists, rather than deferring (pre-existing, from story 0.1) [.gitattributes]
- [x] [Review][Patch] Remove the unused empty `~/Downloads/emberbound-0-4/` the agent created [outside the repo]

## Dev Notes

### Scope

- **In:**
  - `docs/ASSETS.md` (new)
  - six image files in `art-src/reference/` (new folder, already in the architecture's tree)
  - this story file
  - `sprint-status.yaml`
- **Out:**
  - picking the style, and `docs/STYLE_GUIDE.md` (story 0.5)
  - the four turnaround views (story 2.2, with Tripo's multiview tool)
  - any code, Makefile target or dependency
  - Tripo, Blender and font rows in `docs/ASSETS.md` (stories 2.1 and 0.8 add them)
  - cropping the watermark, which happens only to the concept that goes to Tripo (story 2.2; tools decision T7)
- **No new dependency.** ImageMagick is a system tool used once in the scratchpad. It is not added to the project. If `montage` fails, fall back to a throwaway HTML page in the scratchpad, screenshotted with Playwright MCP.

### Current repository state

- `docs/` holds only `PROJECT_BRIEF.md`. `art-src/` doesn't exist yet.
- `.gitattributes` already routes `art-src/**` and every image extension, in any letter case, to LFS. Planning images under `_bmad-output/**` are excepted (story 0.1's review). **Don't edit `.gitattributes`.**
- `git lfs install` ran on 2026-11-14. git-lfs 3.8.1 comes from mise's shims and resolves inside the repository (story 0.1, Debug Log T10).
- `.prettierignore` ignores `*.md`, so Prettier never touches `docs/ASSETS.md`, and `make check` can't fail on its tables.
- `scripts/checkBudgets.ts` measures `dist/` only. `art-src/` never ships, so nothing here touches the budgets.
- The working tree is clean at `e6c2c20`.

### Terms check (T1)

Fetch these with WebFetch and quote what each one says. Don't fill a fact from memory or from a third-party guide. If a page has moved, find Google's current one and record the new URL.

| Fact | Official page to read |
| --- | --- |
| Ownership and commercial use of generated content | Google Terms of Service, <https://policies.google.com/terms>, effective 30 July 2026 per the tools proposal. It says "Google won't claim ownership over that content". Also the Generative AI Additional Terms, <https://policies.google.com/terms/generative-ai>, and the Generative AI Prohibited Use Policy linked from it. Note the rules on not using output to train models and not passing it off as human-made. |
| Human review and training, Keep Activity | Gemini Apps Privacy Hub, <https://support.google.com/gemini/answer/13594961>. Checked while this story was written (2026-11-14): with Keep Activity on (the default for adults), chats help train Google's models and human reviewers may read them; reviewed chats are kept for up to 3 years. With it off, or in a temporary chat, chats aren't used for training but are kept for 72 hours. |
| Visible watermark | "Manage watermark settings in Gemini Apps", <https://support.google.com/gemini/answer/17405358>. Checked 2026-11-14: a **Media Watermark** setting (Settings › Media Watermark on the web) turns the visible mark on newly generated images on or off. It is missing in India, South Korea and Vietnam unless the account has AI Ultra, and missing on **work or school accounts**. SynthID and Content Credentials stay in every case. |
| SynthID and verification | "Verify AI-generated images, videos, and audio", <https://support.google.com/gemini/answer/16722517> |
| Plan and student offer | The developer's own Google One / AI Pro subscription page gives the end date. Also Google One's AI Pro help, <https://support.google.com/googleone/answer/14534406>. Per the tools proposal: free for a year, then $19.99 a month unless cancelled. Renewing is his call (T5). |

Record each fact as **verified on Google's page** or **told by the developer**. The memory note behind the tools decision marked the watermark claim unverified; this check replaces it.

### `docs/ASSETS.md` shape

Plain Markdown. Prettier ignores it. Keep the tables narrow, and put long text in the Prompts section and the notes.

```markdown
# Assets and tools

Every asset tool and every asset the project uses, with its licence and commercial-use terms, and whether the asset is AI-generated. Store submission forms may ask for this. `art-src/` never ships; `public/assets/` does.

## Tools

| Tool | Version or plan | Licence and commercial-use terms | Date checked |
| --- | --- | --- | --- |
| Gemini app, Nano Banana Pro (image model) | Google AI Pro, student offer, ends YYYY-MM-DD | <short summary; details under Tool notes> | 2026-11-.. |

### Tool notes

#### Gemini app, Nano Banana Pro

- Ownership: … (quote, URL)
- Commercial use: … (URL)
- Human review and training: … Keep Activity: on or off, chosen by the developer on …
- Watermark: visible mark …; SynthID and Content Credentials always present …
- Restrictions that matter here: no training other models on output; don't present it as human-made …
- Pages: …

## Assets

| File | Tool | Licence | AI-generated | Prompt | Attempts | Date |
| --- | --- | --- | --- | --- | --- | --- |
| `art-src/reference/hero-sheet-dark-fantasy.jpeg` | Gemini app, Nano Banana Pro | See Tools | yes | P1 | 2 | 2026-11-.. |

## Prompts

### P1: hero sheet, stylised dark fantasy

> full prompt text

Edits: "…" (attempt 2)
```

### Prompts (T2)

**What adapting means here:** the brief's two prompts, reworded for Nano Banana Pro, with four changes:

- one figure, not a "design sheet": that wording invites labels and turnarounds (D1)
- reference images attached for consistency (D2)
- an aspect ratio (D3)
- one style block per candidate, with no game names

Nano Banana Pro takes descriptive sentences better than keyword lists. That is Google's guidance, but re-check it in T2.

**Hero (P1 dark fantasy, P2 comic, P3 mix):**

> A single full-body concept illustration of an original character, standing in a neutral pose and facing the viewer, on a plain light grey background. He is a small cursed warrior turned into a horned ember-beast, clearly not an ape: upright on two legs, with two arms and a human-shaped body about three heads tall. His skin is charcoal black, cracked with glowing orange seams. Two bone horns sweep back from his brow. A furnace glow burns in the middle of his chest, and his eyes are ember-bright. A torn red woodsman's scarf hangs around his neck, the last trace of the man he was. His expression is determined, not monstrous. {STYLE}. Only this one figure: no extra views, no turnaround, no labels, no text, no lettering, no logo. Portrait format, 3:4.

For P2 and P3, start with: *"Redraw the character in the attached image as the same design (same horns, scarf, proportions and glowing seams), in a new style."* Then use the prompt above with P2's or P3's style block, and attach the kept P1 image.

**Key art (P4 dark fantasy, P5 comic, P6 mix):** attach the kept hero sheet in the same style.

> A side-on view of a 2.5D side-scrolling platformer level, like one gameplay frame with every interface element removed. An old forest at dusk: mossy rock, gnarled trees, wooden ledges, hanging lanterns that cast small pools of warm light, and glowing embers drifting through the air. A clear, flat, walkable ground line runs across the lower part of the frame, broken by one gap, with one raised wooden platform above the ground. The character from the attached image stands small on the ground line, in the lower third of the frame. Layered depth, from front to back: dark silhouetted foreground plants at the edges of the frame, the play area, misty trees in the middle distance, and distant ridges. Warm light comes only from the character, the embers and the lanterns; everything else is cool and dim. The mood is dark fantasy. {STYLE}. No interface, no HUD, no text, no lettering, no logo. Landscape format, 16:9.

### Style blocks

These come from GDD Art Style. The game names there are mood references only and never go into a prompt.

| Style | `{STYLE}` |
| --- | --- |
| Stylised dark fantasy (P1, P4) | Stylised dark fantasy illustration: simple, bold, flat shapes with soft gradients, no ink outlines, a cold palette of deep teal and plum, soft fog, and a pale cold glow behind the trees |
| Comic illustration (P2, P5) | Comic-book illustration: flat colours, banded shading in two or three hard-edged tones, bold dark ink outlines of varying weight, and one dominant colour for the whole scene, a deep moss green (D4) |
| Mix (P3, P6) | Comic-book shading and outlines (flat colours, banded hard-edged shading, bold dark ink outlines) with a dark-fantasy palette of cold deep teal and plum, soft fog, and a pale cold glow behind the trees |

On the hero sheet, "behind the trees" doesn't apply: drop that clause from P1 and P3, and keep the palette.

### Run order (D2)

1. P1, the dark-fantasy hero, from text alone. Keep it before going on.
2. P2 and P3, the comic and mix heroes, each with the kept P1 attached.
3. P4 to P6, each key art, with its own style's kept hero attached.

Use one new chat per prompt. That keeps a failed image's context from carrying over, and makes the count per image easy to keep. Edits for that image happen in the same chat.

### Checking an image (T3)

After opening an image, tick each rule. Copy the list into the Generation Log row as pass or fail.

- **Hero:**
  - one figure, full body, feet visible
  - neutral standing pose
  - plain light background
  - not ape-like: upright, a human-shaped skeleton, about 3 heads tall (head height × 3 ≈ body height; judge by eye and say "about")
  - two horns that sweep back
  - a chest glow
  - ember eyes
  - charcoal skin with glowing seams
  - a torn red scarf
  - determined, not monstrous
  - the style's traits
  - no text or labels
  - the same design as P1 (for P2 and P3)
- **Key art:**
  - side-on view
  - dusk
  - the hero small and in the lower third
  - a continuous ground line
  - exactly one clear gap
  - one raised platform
  - hanging lanterns
  - drifting embers
  - all four depth layers
  - warm light only from the hero, embers and lanterns (no warm sky, no warm fires elsewhere)
  - the style's traits
  - no text or interface
  - the hero matches the same-style sheet
- **All images:**
  - dark-fantasy tone
  - nothing recognisably taken from another game or from Dungeons & Dragons
  - the visible watermark doesn't count as a text failure (D10)

Be strict but fair. "About 3 heads tall" and "small" are judged by eye. A borderline call is noted and kept. Don't spend an attempt on it.

### File names (AC15)

The style slugs are `dark-fantasy`, `comic` and `mix`.

| Prompt | File |
| --- | --- |
| P1 | `art-src/reference/hero-sheet-dark-fantasy.<ext>` |
| P2 | `art-src/reference/hero-sheet-comic.<ext>` |
| P3 | `art-src/reference/hero-sheet-mix.<ext>` |
| P4 | `art-src/reference/emberwood-key-art-dark-fantasy.<ext>` |
| P5 | `art-src/reference/emberwood-key-art-comic.<ext>` |
| P6 | `art-src/reference/emberwood-key-art-mix.<ext>` |

`<ext>` is `.jpeg`: the Gemini app downloads JPEG (verified 2026-11-14). Story 0.5 cites these paths.

### Contact sheet (T5)

```sh
cd <staging or art-src/reference>
montage -label '%t' \
  hero-sheet-dark-fantasy.* hero-sheet-comic.* hero-sheet-mix.* \
  emberwood-key-art-dark-fantasy.* emberwood-key-art-comic.* emberwood-key-art-mix.* \
  -tile 3x2 -geometry 640x480+12+12 -background '#1a1d22' -fill white -pointsize 18 \
  <scratchpad>/0-4-contact-sheet.png
```

- `-geometry 640x480` fits each image inside the cell and keeps its aspect ratio.
- Check the flags against `montage -help` on this machine.
- Look at the result before sending it.
- The spend table goes in the message, not in the image.
- Nothing is committed.

### Decisions made in this story (the developer can veto them at review)

| # | Decision | Why |
| --- | --- | --- |
| D1 | **The hero prompt asks for one figure, with no labels and no extra views.** It does not ask for a "design sheet". | Image models read "character design sheet" as a turnaround with labels, which breaks AC8 (no text) and wastes attempts. The views come later, in story 2.2, from Tripo's multiview tool. The AC's "hero design sheet" names the deliverable, not the prompt wording. |
| D2 | **Run order: P1 first; P2 and P3 attach P1; each key art attaches its own style's hero. A failing image is fixed with an edit message before a full regeneration.** | The comparison in story 0.5 should be about style, not about three different Rowans. Nano Banana Pro keeps a character consistent across a reference image (the tools decision's reason for choosing it). Edits fix one rule without losing what already passed. Each edit still counts toward the 5. |
| D3 | **Aspect ratios: the hero 3:4 portrait, the key art 16:9.** | 16:9 is the game's main screen target (NFR14). The logical view, 19 × 10.4 tiles, is close to it. A portrait fits a standing figure. Whether the Gemini app honours a ratio written in the prompt is unverified. If it doesn't, note it and accept its default. |
| D4 | **The comic candidate's one dominant colour for Emberwood is deep moss green.** | The GDD gives the comic style "one dominant colour per level" but no colour. Moss green fits a forest at dusk, and keeps it apart from the dark-fantasy teal and plum, so the two candidates actually differ. It's a guess; the developer may name another before P2 runs. |
| D5 | **Staging folder: `~/Downloads/emberbound-0-4/`**, outside the repository, unless the developer names another. | Rejected images never go near git. No new folder or `.gitignore` change is needed (CLAUDE.md: ask before changing the folder structure). The Read tool opens absolute paths. |
| D6 | **Rejected images aren't committed or kept.** Only their Generation Log rows remain. | `art-src/reference/` holds the references the style is chosen from. Rejects would cost LFS quota and confuse story 0.5. The log keeps the spend auditable. |
| D7 | **Kept files are committed exactly as downloaded:** no re-encoding, resizing, cropping or stripped metadata. | They're source art and never ship. Re-encoding could strip the Content Credentials that record them as AI-generated. The watermark is cropped only from the concept that goes to Tripo (T7, story 2.2). |
| D8 | **Prompts live in full in a Prompts section of `docs/ASSETS.md`.** Asset rows cite them by ID. | AC17 asks for the prompt in the log, and a 120-word prompt in a table cell is unreadable. Story 0.5's "new sheet if he asks for one" adds P7 and so on in the same place. |
| D9 | **The side-by-side view is a scratchpad contact sheet made with the system ImageMagick.** It isn't committed. | It needs no dependency and no code. The look-dev page doesn't exist until story 0.6. Story 0.5 can rebuild the sheet from the same command. |
| D10 | **The visible watermark is not a "text" failure.** Its setting is the developer's choice; if the toggle exists, the recommendation is off. | The tools decision (T7) already allows the mark on references, which never ship. Turning it off, where allowed, keeps the images clean for the comparison and for story 2.2's concept. |
| D11 | **Keep Activity and temporary chats are the developer's choice.** The agent only records it. | It's a privacy setting on his account. Nothing confidential goes into these prompts, but uploads may be human-reviewed while it's on. Temporary chats lose history, which matters for edits in the same chat. |

### Planning text to correct later

Record these in the Dev Agent Record for the Epic 0 retrospective or `gds-correct-course`. Don't edit the planning files here.

- The epic says "hero design sheet", but the AC asks for a single full-body figure (D1). Story 0.5 and story 2.2 say "sheet" too. The name can stay; the wording means one figure.
- The tools proposal and the memory note call the visible watermark unconfirmed. Google's own page now confirms it, and offers a setting for it (Terms check).

### Previous story intelligence (0.1–0.3)

- **The carried-over LFS check (0.1 AC29):** the developer confirms the quota on his GitHub billing page before the first LFS commit. 0.1 recorded the documented figures, checked 2026-11-13: GitHub Free and Pro include 10 GiB of storage and 10 GiB of bandwidth a month; going over without a payment method blocks LFS. Six reference JPEGs, about 2 MB each (12.5 MB in all, measured), are far below that.
- **The PATH caveat (0.1):** git-lfs resolves through mise's shims. VS Code's built-in git hasn't been checked. If it can't find git-lfs, the pre-push hook fails with "git-lfs was not found on your path".
- **Planning images stay in plain git** (`_bmad-output/** !filter`). Never move them.
- **Review lessons:**
  - The Dev Agent Record must match what happened.
  - Disclose every deviation from an AC's wording.
  - Run the final checks on the real repository.
  - Count honestly. Here that means attempts, not tests.
- **Review findings** are fixed now, mapped to a planned story, or dropped. Never deferred.

### Git intelligence

The last three commits are stories 0.1 to 0.3, all code and config. No binary has been committed since `.gitattributes` gained LFS, so this story's commit is the first real test of the LFS route. Commit on master, and only when the developer asks.

### Latest technical information (checked 2026-11-14)

- **Nano Banana Pro** is Gemini 3 Pro Image ([blog.google](https://blog.google/innovation-and-ai/products/nano-banana-pro/), [AI Studio](https://aistudio.google.com/models/gemini-3-pro-image)). In the Gemini app it is reached through image creation on a paid plan. The exact menu path changes often: let the developer find it and don't script UI steps.
- **Watermarks:** every image carries SynthID and Content Credentials (C2PA). The visible sparkle depends on the Media Watermark setting, described above. Google's launch post (Nov 2025) said the AI Pro tier would keep the visible mark. The newer help page lets eligible accounts turn it off. Trust the help page.
- **Privacy:** see Terms check. Re-read both pages in T1, since they change.
- **Unverified:**
  - whether a ratio written in the prompt is honoured (D3)
  - the download format and resolution
  - whether the student offer counts as a "school account" for the watermark setting; it's probably his personal account with a student discount, but ask

### Project Structure Notes

- `art-src/reference/` and `docs/ASSETS.md` are both in the architecture's Project Structure ("Generated reference images and concepts (AI-generated, logged in docs/ASSETS.md)"). No other path is created.
- Source-art names are kebab-case (architecture, naming). These references have no shipped counterpart, so the subject and the style make up the name, as the AC asks.

### Project Context Rules

- CLAUDE.md, Hard limits: no names, characters, layouts or art from Toki or any other game; nothing invented by Dungeons & Dragons; every tool's licence is checked and logged in `docs/ASSETS.md`; every AI-generated asset is recorded there; never commit secrets. There are none here, so no Gemini API key exists or is needed.
- CLAUDE.md, Visual work: look at an image before placing or describing it, and never claim to have checked an image you didn't open. Generated images choose the direction once; the renderer owns the style afterwards (story 0.5 on).
- CLAUDE.md, How to work: say when something is a guess or untested. Ask before adding a dependency or changing the folder structure (D5, D9 avoid both).
- GDD tool budget: the plan's included use only. No top-up, API spend, plan upgrade or other paid tool without the developer (T4).
- Memory: commit straight to master, and push only when asked.

### References

- Epic and ACs: [Source: _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md#Story 0.4]
- Requirements: [Source: requirements-inventory.md — FR210, NFR34, NFR37, NFR38, PR22, PR26, AR158]
- Original prompts and hero brief: [Source: docs/PROJECT_BRIEF.md#5. Art direction]
- Style candidates, fixed rules, hero: [Source: gdd.md#Art Style]
- Tool budget and image model: [Source: gdd.md#Dependencies]
- Tools decision T1–T8: [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-11-13-tools.md]
- Stop rule Q9: [Source: implementation-readiness-report-2026-11-13.md]
- `art-src/reference/`, `docs/ASSETS.md`: [Source: game-architecture.md, Project Structure, lines 983–994; Asset log, line 1676]
- LFS carry-over: [Source: _bmad-output/implementation-artifacts/0-1-scaffold-the-repository-toolchain-and-code-rules.md, Review Findings and Debug Log T10]

## Dev Agent Record

### Agent Model Used

Claude Opus 5.5 (`claude-opus-5-5`), through Claude Code.

### Terms Check

Checked 2026-11-14 with WebFetch on Google's own pages. Full quotes and URLs are in `docs/ASSETS.md` › Tool notes.

- **Ownership:** verified on Google's page. The Terms of Service (effective 30 July 2026) say "Google won't claim ownership over that content."
- **Commercial use:** verified on Google's page. No restriction on the user's generated content. The Generative AI Additional Terms (9 August 2023) "no longer apply" except to business partners. **AC3 doesn't trigger.**
- **Restrictions:** verified on Google's pages.
  - Terms of Service: no using AI output to develop ML models, and no misleading others into thinking AI content is human-made.
  - Prohibited Use Policy (17 December 2024), item 4.5: no misrepresenting provenance "in order to deceive".
- **Human review and training:** verified on Google's page (Privacy Hub, updated 26 October 2026).
  - The fetched text didn't state the default; the earlier search snippet said "on by default" for adults.
- **Watermarks:** verified on Google's page.
  - The Media Watermark setting exists. Only India, South Korea and Vietnam are named as needing AI Ultra for it.
  - **Correction to the story's Dev Notes:** the fetched page does not mention work or school accounts. That claim came from a search-result snippet only. Recorded as unconfirmed.
  - SynthID and C2PA are always present.
- **The developer's answers** (AskUserQuestion, 2026-11-14):
  - Personal account.
  - Offer end: "about 12 months from sign-up", exact date not checked. He chose this over looking it up; the AC asks for the end date, so this is a weaker answer, disclosed here.
  - Keep Activity **on**.
  - Media Watermark **on**.

### Prompt changes from the story draft (T2)

These follow Google's prompting guidance, checked 2026-11-14:

- The Nano Banana Pro tips on blog.google (<https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/>) say to "clearly define the role of each" uploaded image and to define the canvas and aspect ratio.
- The Google Cloud guide (<https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana>) gives the formula "[Reference images] + [Relationship instruction] + [New scenario]" and says to be explicit about what to keep the same.
- The DeepMind guide (<https://deepmind.google/models/gemini-image/prompt-guide/>) says to "assign a distinct name to each character".
- The Gemini API docs (<https://ai.google.dev/gemini-api/docs/image-generation>) say output defaults to the input image's size.

The changes:

1. The character is named **Rowan** in every prompt (DeepMind: distinct names help consistency). It's the project's own name, so it doesn't break AC5.
2. P2 and P3 open by giving the attached image a role, "Use it only for Rowan's design", and list what to keep. They also repeat the full description.
3. P4 to P6 start with "A cinematic 16:9 widescreen image" and say the attached image is "not for the format, background or pose". The Gemini API docs say output follows the input image's size by default, so a 3:4 reference could pull the key art to 3:4. That's unverified for the app. If it happens, it costs an attempt, and the fix is an edit asking for 16:9.
4. On the hero sheets, the style blocks drop fog and the glow behind trees, which have no place on a plain background. "Teal and plum in the shadows" keeps the palette. The hero sheets drop "one dominant colour", which is a level rule.
5. P5 attaches the kept P2 and P6 the kept P3 (same-style hero), as Run order says. P4 attaches P1.
6. P4 to P6 add "seen side-on" to Rowan's placement, and every style block is prefixed with "Style:". Neither was in the draft. The model ignored "seen side-on" in all three key arts (Generation Log).
7. After P1 was kept with trousers (the developer's addition), P2 and P3 add the trousers to their keep list and their description before they are run. The AC5 grep still applies: the added words name nothing.

**AC5 grep**, run on the final prompt text before it went to the developer:

```text
$ grep -n -i -E 'toki|hollow knight|mandragora|prince of persia|lost crown|dungeons|d&d|ghibli|disney|pixar|arcane|mignola' prompts.md
grep exit: 1        (no matches; 6 prompt blocks in the file)
```

### Generation Log

| Image | Attempt | Prompt or edit | Rules failed | Verdict |
| --- | --- | --- | --- | --- |
| P1 hero, dark fantasy | 1 (`p1-a1.jpeg`, 1792×2400 JPEG, 1.9 MB; file since deleted) | P1 | **About 3 heads tall: fails.** Head (scalp to chin, about 270 px at display scale) against the figure's height (scalp to soles, about 1,500 px) gives about 5.6 heads. **Not ape-like: borderline.** Hulking, massive shoulders, hands hanging to mid-thigh; reads as a brute, not a "small cursed warrior". **Horns sweep back: borderline.** They curve up and outward. Passes: one full-body figure with feet visible, neutral pose, plain light grey background, chest furnace glow, ember eyes, charcoal skin with glowing seams, torn red scarf, determined (grim), style traits (flat shapes, soft gradients, no outlines, teal and plum shadows), no text, no visible watermark in either bottom corner (cropped and checked), nothing recognisable from another game. | Edit in the same chat (attempt 2). The developer added trousers to the edit: worn, dark woodsman's trousers. That is a design addition beyond FR210, which names only the scarf as clothing; story 0.5 records it in the concept sign-off. |
| P1 hero, dark fantasy | 2 (`p1-a2.jpeg`, 1792×2400 JPEG, 1.99 MB) | P1 edit, attempt 2 (with trousers) | **About 3 heads tall: borderline pass.** Head (scalp to chin) about 445 px against a height of about 1,660 px gives about 3.7 heads, down from 5.6. The code review's auditor measured about 4.2 by eye, so call it about 3.7 to 4.2. **Not ape-like: borderline pass.** The build is compact now, but the arms are still heavy and the hands hang to mid-thigh. **Horns sweep back: borderline** (corrected at code review). They still rise up and outward and are a little asymmetric; the edit didn't fix this. Story 0.5's concept sign-off fixes the horns, the height and the arms (review decision, 2026-11-14). Passes: trousers (worn, cool-toned, torn at the knees and shins, belted), bare clawed feet, one full-body figure, neutral pose, plain light grey background, chest glow, ember eyes, glowing seams, torn red scarf, determined expression, style traits, no text, no visible watermark (both bottom corners checked), nothing recognisable from another game. | **Keep.** The borderline calls are noted, not spent on (Dev Notes, Checking an image). 2 of 5 attempts used. |
| P2 hero, comic | 1 (`p2-a1.jpeg`, 1792×2400 JPEG, 1.72 MB) | P2, with `p1-a2.jpeg` attached | **Banded shading: borderline pass.** The skin is near-black, so its bands are only two close tones; the trousers are mostly flat with ink hatching. Passes: the same design as P1 (horns, scarf, trousers, belt, bare clawed feet, proportions about 3.7 heads, as P1), bold dark ink outlines of varying weight, flat colours, one figure, neutral pose, plain light grey background, chest glow, ember eyes, glowing seams, determined expression, no text, no visible watermark (both bottom corners checked), nothing recognisable from another game. | **Keep.** 1 of 5 attempts used. |
| P3 hero, mix | 1 (`p3-a1.jpeg`, 1792×2400 JPEG, 1.81 MB) | P3, with `p1-a2.jpeg` attached | None. Passes: bold dark ink outlines with hatching, banded hard-edged shading in clearly separate teal and plum bands (much plainer than P2's), a cold dark-fantasy palette, the same design as P1 (horns, scarf, trousers, belt, bare clawed feet, proportions), one figure, neutral pose, plain light grey background, chest glow, ember eyes, glowing seams, determined expression, no text, no visible watermark (both bottom corners checked), nothing recognisable from another game. Clearly distinct from both P1 and P2. | **Keep.** 1 of 5 attempts used. |
| P4 key art, dark fantasy | 1 (`p4-a1.jpeg`, 2752×1536 JPEG, about 1.79:1, so 16:9 was honoured, 2.15 MB) | P4, with `p1-a2.jpeg` attached | **Hero in the lower third: borderline pass.** His feet are in the lower third and his head sits just above its line. He is about 13 % of the frame's height (about 207 of 1,536 px), which is small. **Hero seen side-on: borderline.** He faces the viewer; it doesn't affect any AC6 to AC8 rule, since the AC asks for a side-on *view* of the level, which it is. Passes: side-on platformer view; dusk (cool teal light); a continuous stone ground line on the left; exactly one clear gap; one raised mossy wooden platform; three hanging lanterns; drifting embers; all four depth layers (silhouetted foreground plants at the edges, the play area, misty trees, distant plum ridges); warm light only from the lanterns, the embers and Rowan's seams, chest and eyes, with a cool glow behind the trees; flat shapes, soft gradients, no ink outlines, teal and plum; Rowan matches the sheet (horns, red scarf, chest glow, belted trousers; a close crop was checked); no text, interface or visible watermark (both bottom corners checked); nothing recognisable from another game. | **Keep.** 1 of 5 attempts used. |
| P5 key art, comic | 1 (`p5-a1.jpeg`, 2752×1536 JPEG, 2.41 MB) | P5, with `p2-a1.jpeg` attached | **Hero in the lower third: borderline pass,** as in P4. His feet are on the ground line in the lower third, his head just above it, and he is about 17 % of the frame's height. **Hero faces the viewer,** as in P4; the level view is side-on. Passes: dusk (dim green-grey light); a continuous mossy stone ground line; exactly one clear gap (a dark pit); one raised wooden platform; three hanging lanterns; drifting embers; all four depth layers (black foreground foliage at the edges, the play area, misty trees, distant grey-green ridges); warm light only from the lanterns, the embers and Rowan; bold dark ink outlines, flat colours, banded shading, one dominant moss green; Rowan matches the comic sheet (horns, scarf, belted torn trousers, bare feet; a close crop was checked); no text, interface or visible watermark (both bottom corners checked); nothing recognisable from another game. | **Keep.** 1 of 5 attempts used. |
| P6 key art, mix | 1 (`p6-a1.jpeg`, 2752×1536 JPEG, 2.47 MB) | P6, with `p3-a1.jpeg` attached | **Clear ground line: borderline pass.** A flat mossy ledge runs from about a quarter of the width to the gap; left of it the ground is a tangle of roots and rocks. **One raised platform: borderline pass.** The main raised platform is a wooden scaffold with stairs, but a second, lower boardwalk shows at the left edge. **Distant ridges: borderline pass.** They are faint pale shapes behind the misty trees (a crop was checked). **Hero in the lower third: borderline pass,** as in P4 and P5 (about 13 % of the frame's height, feet in the lower third). Passes: side-on view; dusk; exactly one gap (misty, brambles below); four hanging lanterns; drifting embers; foreground silhouettes and misty trees; warm light only from the lanterns, the embers and Rowan, with a pale cold glow behind the trees; ink outlines, banded hard-edged shading, teal and plum, fog; Rowan matches the mix sheet (a close crop was checked); no text, interface or visible watermark (both bottom corners checked); nothing recognisable from another game. | **Keep.** The borderline calls are noted, not spent on. 1 of 5 attempts used. |

### Spend

| Image | Attempts | Budget |
| --- | --- | --- |
| P1 hero, dark fantasy | 2 (1 generation, 1 edit) | 5 |
| P2 hero, comic | 1 | 5 |
| P3 hero, mix | 1 | 5 |
| P4 key art, dark fantasy | 1 | 5 |
| P5 key art, comic | 1 | 5 |
| P6 key art, mix | 1 | 5 |
| **Total** | **7** | **30** |

- All of it was the Google AI Pro plan's included use. No top-up, API spend or plan change.
- AC11's stop rule never triggered.

### LFS Quota and Route

- **AC13, the quota** (carried over from story 0.1's AC29): the developer checked his GitHub billing page on 2026-11-14, before the first LFS file was staged.
  - Git LFS: 10 GiB of storage and 10 GiB of bandwidth a month, with about 0 used.
  - The six images add 12.5 MB (12,542,923 bytes).
- **AC14, the route:** VS Code's built-in git finds git-lfs.
  - The VS Code process's environment, read from `/proc/<pid>/environ`, has `~/.local/share/mise/shims` on its PATH.
  - With exactly that PATH (`env -i HOME=$HOME PATH=<VS Code PATH>`), `git lfs version` in the repository gives `git-lfs/3.8.1`, and `command -v git-lfs` gives `/home/emilijan/.local/share/mise/shims/git-lfs`.
  - So committing from VS Code or from a mise-activated terminal both work.
  - **Inferred, not tested:** the PATH was read from a VS Code helper process (the Copilot runtime), not from the git extension itself. Both inherit the same window environment, but no git command has run from VS Code yet. The first push confirms it, since that is when the LFS pre-push hook runs.

### Debug Log References

- **Staging folder:** the developer used `gitignore/` inside the repository instead of D5's `~/Downloads/emberbound-0-4/`. That folder wasn't ignored (`git check-ignore` exit 1). The developer approved ignoring it (AskUserQuestion, 2026-11-14), and `.gitignore` gained `/gitignore/`. **D5 is changed:** the staging folder lives inside the repository and is ignored.
  - At code review the developer chose to rename it. It is now `/.staging/`: `git check-ignore -v .staging/p1-a2.jpeg` gives `.gitignore:40:/.staging/`.
  - The developer deleted the one reject, `p1-a1.jpeg`, before the review. The folder holds only staging copies of the six kept images.
  - The empty `~/Downloads/emberbound-0-4/` the agent created was removed at code review.
- **Format:** the Gemini app downloads JPEG (`.jpeg`), not PNG as the story guessed.
  - Hero sheets: 1792×2400 (3:4).
  - Key arts: 2752×1536 (about 1.79:1, so 16:9 was honoured even with a 3:4 image attached; D3's open question is answered).
- **Watermark:** no visible watermark appeared on any image, although the developer set Media Watermark on. Both bottom corners of every image were cropped at full resolution and looked at. Why is unknown: perhaps the setting doesn't affect downloads, or the account doesn't qualify.
- **Copies:** the kept files were copied with `cp -p`, and `cmp` confirmed each copy is byte-identical to its staging file (D7: no re-encoding).
- **AC16:** `git check-attr filter diff merge` reports `lfs` for all three attributes on all six files. After `git add art-src/reference/*.jpeg`, `git lfs status` lists all six under "Objects to be committed" as `(LFS: <oid>)`, and `git cat-file -p :art-src/reference/hero-sheet-mix.jpeg` is a pointer (`version https://git-lfs.github.com/spec/v1`, `oid sha256:5b1279…`, `size 1806898`).
- **Contact sheet:** `montage` (system ImageMagick), 3×2. Two deviations from the Dev Notes: the cells are `-geometry 900x620+16+16`, not `640x480`, for legibility, and the labels carry the attempt count, which the Dev Notes said goes only in the message. Saved to `/tmp/claude-1000/-mnt-data-Projects-personal-emberbound/16c39009-74e0-491e-89db-6b8f773cd890/scratchpad/0-4-contact-sheet.jpg` (2796×1366). Looked at, then sent with SendUserFile. Not committed (D9).
- **`make check`** on the real repository after all changes: exit 0. ESLint clean, Prettier clean, both type checks clean, Vitest 4 files and 164 tests passed. No code changed, so the counts are unchanged.

### Completion Notes List

- **AC1–AC3:** `docs/ASSETS.md` written with the Tools, Assets and Prompts sections and the Gemini row, from Google's pages fetched 2026-11-14 (Terms Check above).
  - Commercial use is allowed, so the stop rule didn't trigger.
  - **Deviation:** the student offer's end date is recorded as "about 12 months from sign-up, exact date not checked", by the developer's choice, not as a date.
- **AC4, AC5:** P1–P6 adapted to Google's prompting guidance (Prompt changes above). The originality grep found nothing, both before the first run and after the trousers were added.
- **AC6–AC12:** all six images were opened and checked rule by rule (Generation Log).
  - One regeneration: P1 attempt 1 was about 5.6 heads tall and brutish. It was fixed by an edit, to which the developer added trousers.
  - Every borderline call is written down, not spent on: P1 height about 3.7 heads, heavy arms; P2 faint banding; P4 to P6 hero position and facing; P6 ground clutter, a second boardwalk, faint ridges.
  - No image takes anything from another game.
- **Design addition:** at the developer's request, Rowan wears worn, dark woodsman's trousers with a belt, and has bare clawed feet. FR210 names only the scarf as clothing, so story 0.5 should write this into the signed-off concept that Epic 2 models from.
- **AC13–AC18:** the quota was confirmed and the VS Code route checked. The six images are staged as LFS pointers under the story's names, with `.jpeg` as downloaded. The six Assets rows are written. The developer deleted the one reject (`p1-a1.jpeg`). The ignored staging folder, now `.staging/`, holds only copies of the kept images.
  - **Not committed:** commits happen when the developer asks (project rule: on master).
- **AC19:** contact sheet sent, with the spend (7 of 30).
- **AC20:** nothing rendered in the engine, so no critic loop ran. `make check` passes.
- **Planning text to correct later** (Epic 0 retrospective or `gds-correct-course`):
  - The story's guess of `.png` should read `.jpeg` for Gemini downloads, in stories 0.5 and 2.2 if they cite file names.
  - The work-or-school-account claim about the watermark setting is unconfirmed.
  - "Hero design sheet" in the epic means one figure (D1).
  - FR210 should list the trousers once story 0.5 signs off the concept.

### File List

- `docs/ASSETS.md` (new)
- `art-src/reference/hero-sheet-dark-fantasy.jpeg` (new, LFS)
- `art-src/reference/hero-sheet-comic.jpeg` (new, LFS)
- `art-src/reference/hero-sheet-mix.jpeg` (new, LFS)
- `art-src/reference/emberwood-key-art-dark-fantasy.jpeg` (new, LFS)
- `art-src/reference/emberwood-key-art-comic.jpeg` (new, LFS)
- `art-src/reference/emberwood-key-art-mix.jpeg` (new, LFS)
- `.gitignore` (modified: `/.staging/` staging folder)
- `.gitattributes` (modified at code review: AVIF, GIF, TIFF and JFIF go to LFS)
- `_bmad-output/implementation-artifacts/0-4-generate-the-hero-and-emberwood-references-in-each-candidate-style.md` (this story)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

### Code review fixes (2026-11-14)

Applied after the code review (Tasks / Subtasks › Review Findings). Three decisions resolved, 20 patches applied, 4 findings dismissed, none deferred.

- **Decisions:**
  - P6 kept as it is.
  - P1 kept; the horns, height and arms are fixed at story 0.5's concept sign-off.
  - The staging folder renamed `gitignore/` to `.staging/`. D5 is recorded as changed under Debug Log › Staging folder.
- **`docs/ASSETS.md`:**
  - All of `public/` ships.
  - The Tools row now says the watermark *setting* is on, with no mark seen, and that the toggle was offered.
  - Added a caveat that AI output may not be copyrightable and nothing grants exclusivity.
  - Added the student-offer terms. Google's AI plans page says "Individual use only"; neither page addresses commercial use; reading it as "not shared" is a guess; the offer terms page didn't load.
  - The $19.99 is labelled as unverified.
  - The disclosure duty is widened to "wherever a store or page requires it".
  - The Tripo training-clause question is flagged for story 2.1.
  - The C2PA evidence is recorded, with SynthID not verified.
- **`.gitattributes`:** `*.avif`, `*.gif`, `*.tif`, `*.tiff` and `*.jfif` (any letter case) now go to LFS. No tracked file has these extensions. `_bmad-output/**` keeps its deliberate plain-git override.

  ```text
  $ git check-attr filter -- public/assets/x.avif public/assets/x.GIF public/assets/x.tif public/assets/x.tiff public/assets/x.jfif _bmad-output/x.gif src/main.ts
  public/assets/x.avif: filter: lfs
  public/assets/x.GIF: filter: lfs
  public/assets/x.tif: filter: lfs
  public/assets/x.tiff: filter: lfs
  public/assets/x.jfif: filter: lfs
  _bmad-output/x.gif: filter: unspecified
  src/main.ts: filter: unspecified
  ```

- **AC5, re-run on the final text:** the Prompts section of `docs/ASSETS.md`, extracted to a scratch file, holds 7 prompt blocks (P1 to P6 plus the P1 edit).

  ```text
  $ grep -n -i -E 'toki|hollow knight|mandragora|prince of persia|lost crown|dungeons|d&d|ghibli|disney|pixar|arcane|mignola' final-prompts.md
  grep exit: 1
  ```

- **AC16, raw output:**

  ```text
  $ git check-attr filter diff merge -- art-src/reference/*.jpeg
  (all 6 files) filter: lfs / diff: lfs / merge: lfs   (18 lines, each reading lfs)
  $ git lfs status
  Objects to be committed:
  	art-src/reference/emberwood-key-art-comic.jpeg (LFS: ad91a2f)
  	art-src/reference/emberwood-key-art-dark-fantasy.jpeg (LFS: 48b9258)
  	art-src/reference/emberwood-key-art-mix.jpeg (LFS: fdcbd56)
  	art-src/reference/hero-sheet-comic.jpeg (LFS: 19c2ca7)
  	art-src/reference/hero-sheet-dark-fantasy.jpeg (LFS: 46ee974)
  	art-src/reference/hero-sheet-mix.jpeg (LFS: 5b12799)
  ```

- **AC13:** the developer read the quota from the billing page and reported "10 GiB / 10 GiB, ~0 used" through AskUserQuestion. That answer is what's recorded; there's no screenshot.
- **C2PA:** `strings <file> | grep -c urn:c2pa` gives 98, 61, 98, 61, 28 and 61 matches across the six files (key art comic, dark fantasy, mix; hero comic, dark fantasy, mix).
- **Units:** the Generation Log sizes are now decimal MB, matching the 12.5 MB total.
- **`sprint-status.yaml` `last_updated`:** it moved from 15:30 to 14:20. HEAD's 15:30 was ahead of the real clock (story 0.3's commit was at 13:28). The new value is the true time, not a lost merge.
- **Stale `.png` text** in the Dev Notes is corrected to `.jpeg`. **The prompt-guidance sources** now have URLs. **The contact-sheet deviations** are disclosed. **The AC14 route** is marked inferred, to be confirmed at the first push.

## Change Log

- 2026-11-14: Story implemented. Gemini terms logged in `docs/ASSETS.md`; six reference images generated (7 of 30 attempts), checked, kept and staged in Git LFS; `/gitignore/` staging folder ignored; status set to review.
- 2026-11-14: Code review: 3 decisions resolved (P6 kept; P1 kept, fixed in story 0.5; staging folder renamed to `.staging/`), 20 patches applied, 4 dismissed, none deferred. Status set to done.

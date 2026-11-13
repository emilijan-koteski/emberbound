---
title: 'Sprint Change Proposal — tool choices before Epic 0'
project: emberbound
date: 2026-11-13
status: approved
mode: batch
trigger: 'Developer decisions on the image model, the Tripo plan and the tool budgets, the two items implementation-readiness-report-2026-11-13.md left open before Epic 0'
scope: minor
artifacts:
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/decision-log.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md
  - _bmad-output/project-context.md
  - CLAUDE.md
---

# Sprint Change Proposal — Emberbound — tool choices (2026-11-13)

Paths are relative to the project root.

## 1. Issue Summary

The readiness check (`implementation-readiness-report-2026-11-13.md`) and its correct-course pass (`sprint-change-proposal-2026-11-13-readiness.md`, approved and applied) left two items open before Epic 0: **the image model** (it blocks story 0.4, and CLAUDE.md forbids choosing it silently) and **the tool budgets** (0.4's regeneration limit, 2.1's Tripo plan).

On 2026-11-13 the developer made both choices:

- **Image model:** the Gemini app with Nano Banana Pro, on his Google AI Pro plan (student offer).
- **Tripo:** the Pro plan, $20 a month.
- **The four views Tripo builds from:** Tripo's own multiview tool, from the signed-off concept, with the Gemini app as the fallback.

Discussing the choices also exposed a gap: no document says who operates the image model and Tripo. The agent can't generate images. Tripo's web credits probably don't pay for its API, so on the Pro plan the developer runs both web apps by hand.

Category: a new decision from the stakeholder, found before any code exists.

**Evidence (checked 2026-11-13):**

- **Google:** Google's Terms of Service (effective 30 July 2026) say "Google won't claim ownership over that content" for generated content and don't limit outputs to non-commercial use. They forbid using AI output to train models, or passing it off as human-made.
- **Student offer:** Google AI Pro free for a year, then $19.99 a month unless cancelled. Per third-party guides, Pro-tier images carry a visible sparkle watermark (unverified against Google's own pages).
- **Tripo Pro:** $20 a month, 3,000 credits a month. Multi-view input, private models and commercial-use rights are Pro features.
- **Tripo credits, as quoted in search results:** Tripo's credits page couldn't be opened directly (HTTP 403). Studio costs run about 15 to 100 credits per generation and 20 per rig. Tripo's API is billed separately per a third-party guide, at 20 to 30 credits ($0.20 to $0.30) per multi-view generation.
- **Tripo's multiview tool:** turns one image into front, left, back and right views; it appears in Tripo's API, its ComfyUI node and its MCP tools.
- **Story 0.4 still checks** Google's official pages, and **story 2.1** Tripo's, before any use.

**Not in this proposal:**

- **Q1, Q9 and Q14 are already applied.** They were listed for this pass, but the readiness proposal had already applied them: story 0.2's budget groups, the stop rules in 0.4, 2.2 and 3.7–3.9, and story 0.6's swatch note. This proposal only adapts 0.4's and 2.2's stop rules to the chosen plans.
- **`docs/PROJECT_BRIEF.md` is not edited.** It says it isn't kept in sync once BMad artifacts exist.
- **The game brief in `briefs/` is not edited.** The GDD supersedes it.

## 2. Impact Analysis

- **Epics:** all seven keep their scope, order and exit criteria. Epic 0's dependency on the image model and the tool budgets is now met. Epic 2's scope gains a line on who runs the generators, and its pipeline step 2 changes where the views come from.
- **Stories:** none added, removed or renumbered. Three change: 0.4, 2.1 and 2.2. Stories 3.7–3.9, 4.8–4.11 and 5.x already say "the image model the developer chose" and "the route Epic 2 recorded", which stay true, so they don't change.
- **Artifacts:**
  - GDD: the budget line, three Dependencies rows and one Risks row.
  - GDD decision log.
  - Architecture v1.4: Settled stack and First Steps.
  - Requirements inventory: PB59 and Part 9.
  - `project-context.md`: one rule.
  - CLAUDE.md: the stack table and the "still open" line.
  - UX spines: no change.
- **Technical:** nothing is built yet; no code changes and nothing to roll back. No dependency is added; both generators are web apps outside the build.
- **Tuned numbers:** none change. One new † starting value: at most 5 generations or edits per kept image.
- **MVP:** unaffected.

**Checklist status:**
- 1.1–1.3 done. There's no trigger story; the trigger is the developer's decisions, with the evidence above.
- 2.1–2.5 done. No epic is invalidated, added or reordered.
- 3.1 done (GDD); 3.2 done (two architecture lines); 3.3 N/A (no UX impact); 3.4 done (CLAUDE.md, `project-context.md`).
- 4.1 viable; 4.2 and 4.3 N/A.
- 6.4 N/A, because `sprint-status.yaml` doesn't exist yet.

## 3. Recommended Approach

**Direct adjustment** (checklist 4.1: viable, low effort, low risk). Rollback doesn't apply (nothing built). No MVP review is needed (scope unchanged).

**Developer decisions (2026-11-13):**

1. **Image model:** the Gemini app with Nano Banana Pro, on his Google AI Pro plan (student offer). Google Flow, a video tool, is not used.
2. **Tripo:** the Pro plan, $20 a month.
3. **The four views:** from Tripo's own multiview tool, with the Gemini app as the fallback.
4. **Batch review,** as in the earlier passes.

**Decisions made for the developer (veto any):**

| # | Decision | Why |
| --- | --- | --- |
| T1 | At most **5 † generations or edits per kept image** (and per fallback view), then stop, report and ask | A flat-rate plan never runs out of money, so 0.4's stop rule needs a count to trigger on |
| T2 | Tripo is taken **monthly, at the start of story 2.1**, not now | Epics 0 and 1 don't use it; monthly billing lets him pause between asset bursts |
| T3 | **The developer runs both web apps by hand**; the API, MCP server and CLI stay off unless he approves them and their spend | Pro's web credits probably don't cover the API (unverified); keys stay out of the repo |
| T4 | **No top-up credits, API spend, plan upgrade or other paid tool** without his approval | Keeps the budget a ceiling, not a target |
| T5 | Renewing Google AI Pro after the student offer is **his call when it comes**; the end date goes in `docs/ASSETS.md` | Images already made stay his; renewal needn't be decided now |
| T6 | The `docs/ASSETS.md` rows record extra facts. **Google:** when the offer ends, the training and human-review setting, any watermark. **Tripo:** whether its image tools are covered, whether credits pay for the API, whether rights survive cancelling | Each one changes what can be shipped or what it costs |
| T7 | Any **visible watermark stays on the references** (they never ship) and is **cropped out of the concept before it goes to Tripo** | It would otherwise end up in the views or the mesh |
| T8 | If Tripo is refused in 2.1, **the views for the hand-built model come from the Gemini app** | Tripo's multiview tool is ruled out with Tripo |
| T9 | The GDD risk "no image model chosen" is **replaced by "generated views disagree"** | The old risk is closed; the new one is the real remaining risk |
| T10 | **CLAUDE.md and `project-context.md` change too** | Agents read them first; both still said the image model was open, or said nothing about who runs the generators |

## 4. Detailed Change Proposals

**34 edits across 7 documents.** Every OLD text below was checked by script to occur exactly once in its file, and no two edits overlap. A dry run applied all 34 to copies of the files. New text is tagged "(tools decision 2026-11-13)" where a reader of that document needs the source.

| Document | Edits |
| --- | --- |
| `gdd.md` | 5 |
| `decision-log.md` | 1 |
| `epics.md` | 16 |
| `game-architecture.md` | 4 |
| `requirements-inventory.md` | 4 |
| `project-context.md` | 2 |
| `CLAUDE.md` | 2 |

### 4.1 GDD (`gdd.md`)

**G1** (line 122) — Budget line: amounts now set

OLD:

> - The budget is tool subscriptions only; amounts are not set yet.

NEW:

> - The budget is tool subscriptions only: the image model on the developer's Google AI Pro plan (student offer, no extra cost while it lasts), and Tripo Pro at $20 a month from Epic 2. Dependencies has the details (tools decision 2026-11-13).

**G2** (line 936) — Dependencies: image model chosen

OLD:

> | Image model for reference art and Tripo's input views | Before Epic 0 starts | Not chosen. Check commercial-use terms and log them in `docs/ASSETS.md`. |

NEW:

> | Image model for reference art and concepts | Before Epic 0 starts | Chosen 2026-11-13: the Gemini app with Nano Banana Pro, on the developer's Google AI Pro plan (student offer). Story 0.4 logs its terms in `docs/ASSETS.md` before the first image. Tripo's input views come from Tripo's own multiview tool, with the Gemini app as the fallback (story 2.2). |

**G3** (line 940) — Dependencies: Tripo plan chosen

OLD:

> | Tripo licence and commercial-use terms | Epic 2 | Log in `docs/ASSETS.md` |

NEW:

> | Tripo licence and commercial-use terms | Epic 2 | Plan chosen 2026-11-13: Pro, $20 a month, 3,000 credits a month, taken monthly from story 2.1. Story 2.1 logs its terms in `docs/ASSETS.md` before any upload. |

**G4** (line 942) — Dependencies: tool budgets set

OLD:

> | Tool budgets | Epic 0 | Tool subscriptions only; amounts not set |

NEW:

> | Tool budgets | Epic 0 | Set 2026-11-13. **Image model:** the Google AI Pro plan's included use, at no extra cost during the student offer; renewing at its end is the developer's call; at most 5 † generations or edits per kept image, then stop and ask. **Tripo:** Pro, $20 a month, from story 2.1; the month's 3,000 credits are the limit. **Both:** no top-up credits, API spend, plan upgrade or other paid tool without the developer's approval. **Audio tools:** set with their choice in story 3.15. |

**G5** (line 970) — Risks: the image-model risk is closed; the view-consistency risk replaces it

OLD:

> | No image model chosen. Epic 0's style lock and Tripo's input views both depend on it. | Choose it before Epic 0 starts. |

NEW:

> | Generated views disagree with each other (horn shape, scarf side, proportions) and warp Tripo's mesh. | Make the views with Tripo's own multiview tool from the signed-off concept, and have the developer approve them before mesh credits are spent. The Gemini app is the fallback (tools decision 2026-11-13). |

### 4.2 GDD decision log (`decision-log.md`)

**DL1** (line 251) — New section: Update from tool choices

OLD:

>   - The audio tools and formats are chosen at the start of story 3.15.

NEW:

>   - The audio tools and formats are chosen at the start of story 3.15.
>
> ### Update from tool choices (2026-11-13)
>
> - **Intent: update, through `gds-correct-course`.** Change signal: the developer's tool choices, the two items the readiness check left open before Epic 0. Proposal: `sprint-change-proposal-2026-11-13-tools.md`.
> - **Developer decisions:**
>   - **Image model: the Gemini app with Nano Banana Pro,** on his Google AI Pro plan (student offer). Recommended over ChatGPT, Midjourney and the Gemini API: no extra cost, and strong at keeping one character consistent across edits. Google's Terms of Service (effective 30 July 2026) claim no ownership of generated content and don't limit it to non-commercial use. Google Flow, a video tool, is not used.
>   - **Tripo: the Pro plan, $20 a month,** taken monthly from story 2.1, not before. Pro is the lowest plan with multi-view input, private models and commercial-use rights.
>   - **The four views come from Tripo's own multiview tool,** made from the signed-off concept, with the Gemini app as the fallback. Views made one at a time can disagree and warp the mesh.
>   - **The developer runs both web apps by hand** and saves the files in `art-src/`; the agent writes the prompts, checks each result and logs it. Tripo's web credits probably don't pay for its API (unverified), so the API, its MCP server and its CLI stay off unless he approves them.
> - **Settled without a design choice:** at most 5 † image generations or edits per kept image, then stop and ask, since a flat-rate plan never runs out of money; a visible watermark the plan adds stays on the references, which never ship, and is cropped out of the concept before it goes to Tripo.

### 4.3 Epics and stories (`epics.md`)

**E1** (line 484) — Epic list, Epic 0: dependency met

OLD:

> UX-DR111; X-C6.
> **Depends on:** the image model chosen and its terms logged; tool budgets.

NEW:

> UX-DR111; X-C6.
> **Depends on:** the image model, chosen 2026-11-13 (the Gemini app with Nano Banana Pro, on the developer's Google AI Pro plan), with its terms logged in story 0.4 before the first image; the tool budgets in the GDD's Dependencies table (tools decision 2026-11-13).

**E2** (line 530) — Epic 0 scope: who makes the reference art

OLD:

> - **Reference art:** the hero design sheet and Emberwood key art, in each candidate style (dark fantasy, comic, mix), from the reference prompts in `docs/PROJECT_BRIEF.md` §5. The key art keeps:

NEW:

> - **Reference art:** the hero design sheet and Emberwood key art, in each candidate style (dark fantasy, comic, mix), from the reference prompts in `docs/PROJECT_BRIEF.md` §5. The agent adapts the prompts; the developer runs them in the Gemini app and saves the images; the agent looks at each one and logs it (tools decision 2026-11-13). The key art keeps:

**E3** (line 558) — Epic 0 section: dependency met

OLD:

> (Epic 6).
>
> **Depends on:** the image model chosen and its terms logged; tool budgets.

NEW:

> (Epic 6).
>
> **Depends on:** the image model, chosen 2026-11-13 (the Gemini app with Nano Banana Pro, on the developer's Google AI Pro plan), with its terms logged in story 0.4 before the first image; the tool budgets in the GDD's Dependencies table (tools decision 2026-11-13).

**E4** (line 715) — Story 0.4: Depends on names the choice

OLD:

> **Depends on:** the image model the developer chose, with its terms, commercial use included, logged in `docs/ASSETS.md`; the tool budget the developer set for it

NEW:

> **Depends on:** the image model the developer chose (the Gemini app with Nano Banana Pro, on his Google AI Pro plan; tools decision 2026-11-13), with its terms, commercial use included, logged in `docs/ASSETS.md`; the tool budget in the GDD's Dependencies table

**E5** (line 721) — Story 0.4: what the image model's row records

OLD:

> and the image model's row is filled in
>

NEW:

> and the image model's row is filled in
> **And** that row records, from Google's official pages: the plan and when the student offer ends; who owns the images and whether they may be used commercially; whether prompts and uploads may be read by people or used for training, and the activity setting the developer chose; any visible watermark the plan adds; the date checked; and the page addresses (tools decision 2026-11-13)
>

**E6** (line 724) — Story 0.4: who runs the prompts

OLD:

> **Given** the reference prompts in `docs/PROJECT_BRIEF.md` §5, adapted to the chosen model
> **When** the references are generated

NEW:

> **Given** the reference prompts in `docs/PROJECT_BRIEF.md` §5, adapted to the chosen model by the agent
> **When** the developer runs them in the Gemini app and saves the results where the agent can open them (tools decision 2026-11-13)

**E7** (line 734) — Story 0.4: when a flat-rate budget runs out

OLD:

> and the rules each image still fails, and the developer decides (readiness proposal 2026-11-13, Q9)

NEW:

> and the rules each image still fails, and the developer decides (readiness proposal 2026-11-13, Q9); on the flat-rate plan, the budget for an image runs out after 5 † generations or edits (tools decision 2026-11-13)

**E8** (line 2540) — Epic 2 scope: who runs the generators

OLD:

> the Blender MCP set up from its current documentation (AR159).
> - **The asset pipeline**

NEW:

> the Blender MCP set up from its current documentation (AR159).
> - **Who runs the generators** (tools decision 2026-11-13): on the Tripo Pro plan, the developer runs Tripo in its web app, and the Gemini app for any fallback views, and saves each file in `art-src/`. The agent prepares the prompts and inputs, checks every result and logs it. Driving Tripo through its API, its MCP server or its CLI needs the developer's approval, its spend in the budget and its terms logged first.
> - **The asset pipeline**

**E9** (line 2543) — Epic 2 pipeline step 2: where the views come from

OLD:

>   2. four views (front, back, left, right) from the image model the developer chose

NEW:

>   2. four views (front, back, left, right) made from that concept with Tripo's own multiview tool, or in the Gemini app if Tripo's views don't agree (tools decision 2026-11-13)

**E10** (line 2564) — Epic 2 Depends on: the Tripo plan

OLD:

> - The image model the developer chose, with its terms logged in `docs/ASSETS.md`.
> - A Tripo plan within the tool budgets set in Epic 0, with Tripo's terms logged (Story 2.1) before any mesh is generated.

NEW:

> - The image model the developer chose (the Gemini app), with its terms logged in `docs/ASSETS.md`.
> - The Tripo Pro plan ($20 a month, 3,000 credits a month), taken monthly from Story 2.1, with Tripo's terms logged (Story 2.1) before any image is uploaded or mesh generated (tools decision 2026-11-13).

**E11** (line 2578) — Story 2.1: Depends on the Pro plan

OLD:

> **Depends on:** a Tripo plan within the tool budgets set in Epic 0.

NEW:

> **Depends on:** the Tripo Pro plan in the GDD's tool budgets ($20 a month), which the developer takes, billed monthly, at the start of this story (tools decision 2026-11-13).

**E12** (line 2585) — Story 2.1: the Tripo entry covers its image tools, API credits and rights after cancelling

OLD:

> **And** the entry exists before any image is uploaded to Tripo (PR26).

NEW:

> **And** the entry exists before any image is uploaded to Tripo (PR26)
> **And** it also records whether the terms cover the images Tripo's own image tools make (the four views come from its multiview tool), whether the plan's credits pay for API, MCP or CLI use or only for the web app, and whether the commercial rights to outputs made on the plan survive cancelling it (tools decision 2026-11-13).

**E13** (line 2589) — Story 2.1: if Tripo is refused, the views come from the Gemini app

OLD:

> and the epic continues on the hand-built route: a simpler model built in Blender from the reference views

NEW:

> and the epic continues on the hand-built route: a simpler model built in Blender from the reference views, which are then made in the Gemini app, since Tripo's multiview tool is ruled out too (tools decision 2026-11-13)

**E14** (line 2614) — Story 2.2: Depends on

OLD:

> **Depends on:** the image model the developer chose before Epic 0, with its terms logged in `docs/ASSETS.md`.

NEW:

> **Depends on:** Tripo's terms logged and the Pro plan taken (Story 2.1); the Gemini app, with its terms logged in `docs/ASSETS.md` (Story 0.4), for fallback views (tools decision 2026-11-13).

**E15** (line 2619) — Story 2.2: the views come from Tripo's multiview tool

OLD:

> **When** the four views are generated from it with the image model the developer chose, using the brief's view prompt (the same character and outfit, arms slightly away from the body, a plain background)
> **Then** the front, back, left and right views are saved in `art-src/hero/` under kebab-case names (AR154)
> **And** each is logged in `docs/ASSETS.md` as AI-generated, with the tool, the prompt and the date (AR158).

NEW:

> **When** the developer makes the four views from it in Tripo's web app with Tripo's multiview tool, uploading the concept with any visible watermark cropped out, and choosing the options from Tripo's current documentation (tools decision 2026-11-13)
> **Then** the front, back, left and right views are saved in `art-src/hero/` under kebab-case names (AR154)
> **And** each is logged in `docs/ASSETS.md` as AI-generated, with the tool, the prompt or settings, and the date (AR158).

**E16** (line 2626) — Story 2.2: the Gemini fallback and the budget reference

OLD:

> are regenerated until the set agrees, within the tool budget set in Epic 0, and the developer approves the set
>

NEW:

> are regenerated until the set agrees, within the tool budget in the GDD's Dependencies table, and the developer approves the set
> **And** if Tripo's views still disagree after the regenerations the developer allows, the views are made in the Gemini app instead, from the concept with the brief's view prompt (the same character and outfit, arms slightly away from the body, a plain background), at most 5 † attempts per kept view (tools decision 2026-11-13)
>

### 4.4 Architecture (`game-architecture.md`)

**A1** (line 6) — Version bump

OLD:

> version: '1.3'

NEW:

> version: '1.4'

**A2** (line 82) — Settled stack: image model chosen

OLD:

> - Open when this document started: the level editor, the audio tools, the image model. The level editor is now settled as Tiled (Architectural Decisions); the other two remain open.

NEW:

> - Open when this document started: the level editor, the audio tools, the image model. The level editor is now settled as Tiled (Architectural Decisions). The image model is the Gemini app with Nano Banana Pro, and Tripo makes its own input views (2026-11-13); both are web apps the developer runs, outside the build. The audio tools are chosen in story 3.15.

**A3** (line 1608) — Version note v1.4

OLD:

> and the look-dev checks run by `make shots` (Testing Strategy).

NEW:

> and the look-dev checks run by `make shots` (Testing Strategy).
>
> **v1.4 (2026-11-13):** the sprint change proposal `sprint-change-proposal-2026-11-13-tools.md` recorded the tool choices: the image model and Tripo's input views (Settled stack, First Steps).

**A4** (line 1674) — First Steps: the image model is chosen; its terms are logged in story 0.4

OLD:

> 4. **Choose the image model** and log its terms in `docs/ASSETS.md`. It blocks Epic 0's reference art (GDD Dependencies).

NEW:

> 4. **Log the image model's terms** in `docs/ASSETS.md` (the Gemini app with Nano Banana Pro, chosen 2026-11-13). Story 0.4 does this before the first image.

### 4.5 Requirements inventory (`requirements-inventory.md`)

**R1** (line 1818) — PB59: annotate the decided image model and views

OLD:

> (image model OPEN); (2) front, back, left and right views from the same image model;

NEW:

> (image model OPEN; decided 2026-11-13: the Gemini app with Nano Banana Pro); (2) front, back, left and right views from the same image model (decided 2026-11-13: from Tripo's own multiview tool, with the Gemini app as the fallback);

**R2** (line 1857) — Part 9: image model decided

OLD:

> - Image model for reference art and Tripo input views not chosen; needed before Epic 0 starts; commercial-use terms to be logged. (gdd.md:934, 968)

NEW:

> - Image model: chosen 2026-11-13, the Gemini app with Nano Banana Pro on the developer's Google AI Pro plan; Tripo's input views come from Tripo's multiview tool; commercial-use terms logged in story 0.4. (gdd.md:936, 970)

**R3** (line 1860) — Part 9: Tripo plan chosen

OLD:

> - Tripo licence and commercial-use terms to be checked by Epic 2. (gdd.md:938)

NEW:

> - Tripo licence and commercial-use terms to be checked by Epic 2 (story 2.1), on the Pro plan chosen 2026-11-13. (gdd.md:940)

**R4** (line 1861) — Part 9: tool budgets set

OLD:

> - Tool budgets not set; needed by Epic 0. (gdd.md:122, 940)

NEW:

> - Tool budgets: set 2026-11-13. Image model: the Google AI Pro plan's included use, at most 5 † attempts per kept image. Tripo: Pro, $20 a month from story 2.1. Nothing paid beyond them without the developer's approval. (gdd.md:121, 942)

### 4.6 Project context (`project-context.md`)

**P1** (line 8) — Rule count

OLD:

> rule_count: 129

NEW:

> rule_count: 130

**P2** (line 37) — Outside npm: the generators are web apps the developer runs

OLD:

>   - Blender, version pinned in Epic 2.
>   - git-lfs.
>

NEW:

>   - Blender, version pinned in Epic 2.
>   - git-lfs.
>   - Web apps the developer runs by hand, outside the build: the Gemini app (Nano Banana Pro) for reference art and concepts, and Tripo (Pro plan) for the four views and the meshes. Agents write the prompts and check the results; they never call these services or handle their keys unless the developer approves it.
>

### 4.7 Project instructions (`CLAUDE.md`)

**C1** (line 15) — Settled stack: image model and Tripo rows

OLD:

> | 3D meshes | Tripo, from reference images |

NEW:

> | Reference art and concepts | The Gemini app with Nano Banana Pro, on the developer's Google AI Pro plan |
> | 3D meshes | Tripo (Pro plan), from four views made by its own multiview tool |

**C2** (line 23) — Still open: only the audio tools

OLD:

> Still open: the image model for reference art and the audio tools. Do not pick these silently.

NEW:

> Still open: the audio tools, chosen at the start of story 3.15. Do not pick them silently.


## 5. Implementation Handoff

- **Scope:** minor. Planning documents and two agent-instruction files only; no code exists.
- **Who:** the facilitating agent applies Section 4 in this session after approval. It applies them by script from the same validated edit set, so the text applied is the text approved.
- **Success criteria:**
  - every edit in Section 4 applied word for word (the script refuses to apply unless every OLD text matches exactly once)
  - `git diff --stat` touches only the seven documents listed, plus this proposal
  - no story's requirement IDs change, so traceability is unaffected
- **Next:**
  1. Commit.
  2. `gds-sprint-planning` generates `sprint-status.yaml`.
  3. `gds-create-story` for story 0.1.
  4. Before Epic 1: decide who writes the Tiled levels (readiness report, Recommended Next Steps 5).

## 6. Approval and application

- **Approved** by the developer on 2026-11-13 and applied the same day, by script, from the edit set rendered in Section 4.
- **Verified:** all 34 edits applied; every NEW text occurs exactly once in its file; no stale wording remains ("tool budgets set in Epic 0", "image model chosen and its terms logged", "No image model chosen", "amounts not set", "Still open: the image model"); `git diff --stat` touches only the seven listed documents, plus this proposal.
- **Changed while applying:** none.

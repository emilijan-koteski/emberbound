---
title: 'Sprint Change Proposal — tests and development on the GTX 1650'
project: emberbound
date: 2026-11-14
status: approved
mode: batch
trigger: 'The developer decided on 2026-11-14, during story 0.6, that every test and development run uses the laptop NVIDIA GTX 1650 for WebGL; the planning documents still say headless WebGL renders in software'
scope: minor
artifacts:
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md
  - _bmad-output/implementation-artifacts/0-6-build-the-look-dev-page-and-the-screenshot-harness.md
  - _bmad-output/project-context.md
  - CLAUDE.md
---

# Sprint Change Proposal — Emberbound — tests and development on the GTX 1650 (2026-11-14)

Paths are relative to the project root.

## 1. Issue Summary

**The trigger.** During story 0.6 (the look-dev page and the screenshot harness), a 32 px strip appeared along the bottom of a headless shot. A check in real browsers showed it is an artifact of headless Chromium's software renderer, SwiftShader, and that GPU browsers paint correctly. The developer then decided:

- **Every test and development run uses the laptop's NVIDIA GTX 1650 for WebGL.** Never the integrated Intel UHD 630, and never software.
- **The local browser is Chromium** (`/usr/bin/chromium`), not Chrome.
- **Scope** (answered in this workflow): the rule covers tests and development. Epic 6's binding performance pass still measures on the GDD's reference machines (an Iris Xe-class laptop), because that is who the game targets.

**What is already built** (story 0.6, after its code review; done, not yet committed):

- The Makefile exports `GPU ?= nvidia`. With it, `playwright.config.ts` launches every browser with NVIDIA PRIME render offload (`__NV_PRIME_RENDER_OFFLOAD=1`, `__VK_LAYER_NV_optimus=NVIDIA_only`, `__GLX_VENDOR_LIBRARY_NAME=nvidia`), and Chromium with `--use-angle=gl --ignore-gpu-blocklist`.
- A look-dev check fails unless WebGL reports the GTX 1650. It skips with `GPU=default`, which is for a machine without that card.
- The look-dev renderer view shows the GPU in use.
- The README documents the development command: `prime-run chromium --ozone-platform=x11 --use-angle=gl --ignore-gpu-blocklist <url>`.

**Evidence** (story 0.6, Debug Log):

- Headless Chromium with the settings reports "ANGLE (NVIDIA Corporation, NVIDIA GeForce GTX 1650/PCIe/SSE2, OpenGL ES 3.2)".
- With the offload switched off as a throwaway, the check fails and names SwiftShader.
- `make shots`: 11 look-dev checks and 3 shots pass. `make smoke` passes, with Firefox on the offload too. `make check` passes with 183 tests.

**The problem.** Five places in the planning documents state or rely on "headless WebGL renders in software", which is no longer true on this machine. The GPU rule itself is in no planning document, so a later story could drop it.

## 2. Impact Analysis

- **Epics:** no epic changes scope, order or exit criteria.
  - Story 0.6 (done): one acceptance criterion's reason.
  - Story 0.12: its early frame-time reading names the GPU and is marked optimistic.
  - Epic 6's performance pass is unchanged.
- **Stories:** stories 0.8, 0.10, 0.12 and later add look-dev checks and shots, which now run on the GTX 1650 automatically. Nothing for them to do.
- **GDD:** no change. "Capture screenshots … with the game running headless" (gdd.md:867) and "frame rates from headless screenshot runs don't count" (gdd.md:790) both stay true. The reference machine (gdd.md:788) is unchanged, by the scope decision.
- **Narrative and UX:** no change.
- **Architecture:** four statements are corrected, and the GPU rule is recorded in Testing Strategy, the Toolchain table and the Playwright MCP rows.
  - **Line numbers:** the requirements inventory and the UX spines cite the architecture by line number (up to `ga:1646`), so every edit is made **in place** and no line count changes.
  - The v1.5 note goes on the same line as v1.4, and the frontmatter's version changes in place.
- **Requirements inventory:** no change. AR222 ("Headless-WebGL screenshots are never used for performance numbers") still holds, and its citations stay valid because no line moves.
- **`project-context.md` and CLAUDE.md:** each gains the rule, so every agent and session follows it.
- **`docs/PROJECT_BRIEF.md`:** left as written. Its line "Software rendering in a headless browser is slow" (line 251) is the original brief, and the BMad artifacts win over it on conflict (CLAUDE.md).
- **Technical:** none beyond what story 0.6 already built.

## 3. Recommended Approach

**Direct adjustment:** text edits only, in five files, with no code change.

- **Effort:** minutes.
- **Risk:** low, since the edits are line-neutral in the architecture.
- **Timeline:** no impact.
- **Trade-off (noted):** a machine without a GTX 1650 has to run with `GPU=default`. The look-dev check then skips, and that machine's results come from whatever GPU it has. Today the project has one machine, so this is acceptable.

## 4. Detailed Change Proposals

### 4.1 Architecture (`game-architecture.md`), all in place

**A1 — frontmatter (line 6).** OLD: `version: '1.4'` → NEW: `version: '1.5'`

**A2 — Technical Risks (line 180).**

OLD:

> | Headless WebGL in Playwright renders in software | Slow, and possibly different from a GPU. Screenshots are only for the critic loop, never for performance. |

NEW:

> | Headless browser runs are not real frames | Tests run headless. On the developer's laptop every browser test runs WebGL on the NVIDIA GTX 1650 (Testing Strategy). Without a usable GPU, WebGL falls back to software (SwiftShader), which is slow and can composite differently: story 0.6 saw a 32 px unpainted strip under a full-width bar. Screenshots are only for the critic loop, never for performance. |

Rationale: the risk was the premise. It is now the fallback case, kept with the evidence.

**A3 — Toolchain (line 288).**

OLD:

> | Screenshot and browser tests | Playwright 1.65 | Headless; WebGL renders in software, so no performance numbers from it. |

NEW:

> | Screenshot and browser tests | Playwright 1.65 | Headless, with WebGL on the developer's NVIDIA GTX 1650 (Testing Strategy); no performance numbers from it. |

**A4 — Development Tools (MCP), Playwright MCP (line 300), and the second Playwright MCP row (line 1646).**

OLD (line 300; line 1646 differs only in its last cell, "Already configured in the Claude Code environment"):

> | Playwright MCP | Drive the game in a real browser: the critic loop, run checks, screenshots | Already available in the Claude Code environment |

NEW (each row keeps its own last cell):

> | Playwright MCP | Drive the game in a real browser (Chromium on the GTX 1650; Testing Strategy): the critic loop, run checks, screenshots | Already available in the Claude Code environment |

**A5 — Testing Strategy (line 657),** one sentence appended to the existing bullet.

OLD:

> - `make test` runs the Node layers. `make smoke` and `make shots` run Playwright. `make check` runs lint, the format check, the type check and `make test`.

NEW:

> - `make test` runs the Node layers. `make smoke` and `make shots` run Playwright. `make check` runs lint, the format check, the type check and `make test`. **Every browser test runs WebGL on the developer's NVIDIA GTX 1650,** never the integrated Intel UHD 630 or software (the developer's decision, 2026-11-14; `sprint-change-proposal-2026-11-14-gpu.md`). `GPU=nvidia`, the Makefile's default, makes `playwright.config.ts` launch the browsers with NVIDIA PRIME render offload and Chromium with ANGLE's GL path (`--use-angle=gl --ignore-gpu-blocklist`). A look-dev check fails if WebGL isn't on the GTX 1650, and `GPU=default` turns it off on a machine without that card. Development uses the same card, in Chromium, the local browser: `prime-run chromium --ozone-platform=x11 --use-angle=gl --ignore-gpu-blocklist`. This is a development rule: the binding performance pass still measures on the reference machines (Performance Budget).

**A6 — Deterministic Screenshot Spots, Usage (line 1402).**

OLD:

> - Screenshots are compared by eye against the style guide, never pixel-diffed. Software WebGL output differs from GPU output.

NEW:

> - Screenshots are compared by eye against the style guide, never pixel-diffed: output differs between GPUs, drivers and the software fallback, and only the look is judged.

**A7 — version history (line 1610),** v1.5 appended on the same line, so later line numbers don't move.

OLD:

> **v1.4 (2026-11-13):** the sprint change proposal `sprint-change-proposal-2026-11-13-tools.md` recorded the tool choices: the image model and Tripo's input views (Settled stack, First Steps).

NEW:

> **v1.4 (2026-11-13):** the sprint change proposal `sprint-change-proposal-2026-11-13-tools.md` recorded the tool choices: the image model and Tripo's input views (Settled stack, First Steps). **v1.5 (2026-11-14):** the sprint change proposal `sprint-change-proposal-2026-11-14-gpu.md` recorded that tests and development run WebGL on the GTX 1650, in Chromium (Technical Risks, Toolchain, Development Tools, Testing Strategy, Deterministic Screenshot Spots); it was appended to this line so no cited line number moves.

### 4.2 Epics (`epics.md`)

**E1 — Story 0.6, harness AC (line 833).**

OLD:

> **And** shots are never pixel-diffed, and no performance number is ever taken from them, since headless WebGL renders in software

NEW:

> **And** shots are never pixel-diffed, and no performance number is ever taken from them: they are judged by eye, and headless runs aren't real frames, even with WebGL on the developer's GTX 1650 (sprint change proposal 2026-11-14, GPU)

**E2 — Story 0.12, frame-time reading (lines 1047 and 1050).**

OLD (1047):

> **Given** the test scene on the developer's own machine, in a real browser

NEW (1047):

> **Given** the test scene on the developer's own machine, in Chromium on its GTX 1650 (sprint change proposal 2026-11-14, GPU)

OLD (1050):

> **And** the result is recorded with the machine's name as an early check only: it is the development build, and the binding measurement is Epic 6's, with `?perf=1` on the release build and the named reference machines

NEW (1050):

> **And** the result is recorded with the machine's name and GPU as an early check only: it is the development build on a discrete GPU, so it is optimistic against the Iris Xe-class reference, and the binding measurement is Epic 6's, with `?perf=1` on the release build and the named reference machines

### 4.3 Story 0.6 file

**S1 — AC17.**

OLD (the reason):

> …since headless WebGL renders in software (SwiftShader; probed 2026-11-14 on Playwright 1.65.0's Chromium 158).

NEW:

> …they are judged by eye, and headless runs aren't real frames, even with WebGL on the developer's GTX 1650 (sprint change proposal 2026-11-14, GPU; without the GPU settings, Playwright 1.65.0's headless Chromium 158 falls back to SwiftShader).

**S2 — Dev Notes › References (Playwright line).**

OLD:

> …headless Chromium 158 gives WebGL2 through SwiftShader with no extra flags (probed 2026-11-14).

NEW:

> …headless Chromium 158 gives WebGL2 through SwiftShader with no extra flags (probed 2026-11-14); with `GPU=nvidia` it runs on the GTX 1650 (sprint change proposal 2026-11-14, GPU).

**S3 — Change Log:** one line recording this proposal.

### 4.4 Project context (`_bmad-output/project-context.md`, line 30)

OLD:

> - **Playwright 1.65.x**: smoke checks in Chromium and Firefox, and critic-loop screenshots against the dev server.

NEW:

> - **Playwright 1.65.x**: smoke checks in Chromium and Firefox, and critic-loop screenshots against the dev server. **Every browser test runs WebGL on the NVIDIA GTX 1650** (`GPU=nvidia`, the Makefile's default; README, "The GPU"). Keep it so, and check the WebGL renderer string before claiming that a render ran on the GPU.

### 4.5 Project instructions (`CLAUDE.md`, Visual work), one bullet added

NEW (after "Look at an image before placing it or describing it. …"):

> - Every test and development run uses the laptop's NVIDIA GTX 1650 for WebGL, never the Intel GPU or software rendering. The local browser is Chromium, not Chrome. How is in README, "The GPU". The binding performance pass in Epic 6 still uses the reference machines.

## 5. Implementation Handoff

- **Scope:** minor. The Developer agent (this session) applies section 4 after approval.
- **Success criteria:**
  - Every edit in section 4 is applied word for word.
  - `game-architecture.md` keeps 1,676 lines.
  - A search of the planning documents (`_bmad-output/planning-artifacts/`, excluding sprint change proposals) finds no remaining claim that headless WebGL renders in software.
  - `make check` passes. No code changes.
- **Then:** commit story 0.6 together with this proposal's edits, on master, when the developer asks.

## 6. Approval and application

- **Approved** by the developer on 2026-11-14 ("yes"), in batch mode. The one fork, the rule's scope, was answered before drafting: tests and development, with Epic 6's reference machines unchanged.
- **Applied** on 2026-11-14 by the Developer agent in the same session, word for word: A1–A7, E1–E2, S1–S3, 4.4 and 4.5.
- **Verified:**
  - `game-architecture.md` still has 1,676 lines, and the cited rows stay put (`ga:1646` is still the Playwright MCP row; `ga:1174` is unchanged).
  - No planning document still claims software rendering. The only hit left is the UX workflow's historical scratch extract (`ux-designs/…/.working/extract-architecture.md`), which isn't a source of rules.
  - `make check` passes (183 tests).

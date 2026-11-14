---
project: emberbound
date: 2026-11-14
status: approved
mode: batch
trigger: 'Story 0.5 (docs/STYLE_GUIDE.md, approved 2026-11-14): the developer signed off Rowan as drawn on hero-sheet-mix.jpeg, which departs from FR210''s wording, and decided bells are warm brass, part of the fire family'
scope: minor
artifacts:
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/decision-log.md
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/requirements-inventory.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md
---

# Sprint Change Proposal — Emberbound — style lock (2026-11-14)

Paths are relative to the project root.

## 1. Issue Summary

Story 0.5 locked the style and wrote `docs/STYLE_GUIDE.md`, approved by the developer on 2026-11-14. Two of his decisions leave the planning text behind:

1. **Rowan's concept, signed off as drawn** on `art-src/reference/hero-sheet-mix.jpeg`. The sheet departs from FR210's wording in three ways:
   - about 4 heads tall, not about 3
   - two horns that don't match: his left (viewer's right) sweeps out and back; his right (viewer's left) curls up into a hook. FR210 says "two bone horns sweeping back".
   - heavy arms, the hands at mid-thigh

   It also has details FR210 doesn't name: pointed ears (kept on 2026-11-14), and worn, dark woodsman's trousers with a belt and bare clawed feet (the developer's addition in story 0.4). The guide's section 6 records all of this as the concept Epic 2 models from.
2. **Bells are warm brass, part of Rowan's fire family.** The planning text disagreed with itself here:
   - NFR28 and GDD Art Style say "Rowan, his shots and **the collectables** are always the warmest things on screen", and bells are collectables.
   - NR15 and several later ACs reserve in-play warm light for "Rowan, the embers and the lanterns", which leaves bells out.

   The inventory already listed the clash as gaps 14 and 20 without resolving it. The developer picked warm brass (style guide, section 3).

**Evidence:** `docs/STYLE_GUIDE.md`, sections 3 and 6; story 0.5's Dev Agent Record (the developer's decisions table).

**Why now:** the riskiest stale line is story 2.2's acceptance criterion. It checks Tripo's four views for "about 3 heads tall" and "two bone horns sweeping back", so it would reject views that match the approved concept. Several Epic 3 to 5 ACs would likewise check lighting against a warm list without bells.

## 2. Impact Analysis

### Epics

- **Epic 0:** in progress, still completes as planned. Story 0.13's AC repeats the old in-play warm list.
- **Epic 2:** story 2.2's AC must check the views against the signed-off concept.
- **Epics 3, 4 and 5:** six lighting and readability ACs (stories 3.3, 3.20, 4.8, 4.10, 5.10, 5.13) name the in-play warm list. Each gains the bells, and the pickups where they were missing.
- No epic is added, removed or reordered. No scope changes.

### Artifacts

| Artifact | Change |
| --- | --- |
| GDD (`gdd.md`) | Art Style: the warm-light bullet names the fire family; the Hero block takes the signed-off concept. |
| GDD decision log | A new entry records both decisions. |
| Narrative design | Rowan's description; the card warm-light exception's in-play list; the Atmosphere line. |
| Requirements inventory | FR210, NR15, NR56, NFR28; gaps 14 and 20 marked resolved; a refresh note. |
| Epics (`epics.md`) | 8 ACs, in stories 0.13, 2.2, 3.3, 3.20, 4.8, 4.10, 5.10 and 5.13. |
| Architecture | None. It states no hero proportions, and the lighting rigs already carry "where warm light is allowed" as data. |
| UX (DESIGN.md, EXPERIENCE.md) | None. The HUD's bell icon stays neutral; DESIGN.md's warm rule is about the overlay, not the world. |
| `project-context.md`, `CLAUDE.md` | None. |

### Left unchanged on purpose

- `docs/PROJECT_BRIEF.md` ("roughly 3 heads tall", "horns that sweep back"). The BMad artifacts win over the brief (CLAUDE.md), and its hero brief is the historical input.
- Story 0.4's file, its AC in `epics.md` (line 728), and the prompts in `docs/ASSETS.md`. They are records of done work and stay as written.
- Story 0.5's AC in `epics.md` (line 768). The story is in review, and the guide it produced carries the resolution.
- `_bmad-output/planning-artifacts/ux-designs/…/.working/` extracts. They are working files.

**Technical impact:** none. No code reads these texts. Story 0.7's palette tests read the guide.

## 3. Recommended Approach

**Direct adjustment.** Edit the texts to match the approved guide, and point the concept at `docs/STYLE_GUIDE.md`, section 6, so the next change to the concept is made in one place.

- Rollback isn't viable: the concept is approved and nothing was built.
- No MVP review is needed: the scope doesn't change.

**Effort:** low. There are 15 numbered edits, E1 to E15, in 5 files. Some edits change several places (E2 three, E12 two, E15 six), so applying them took 22 text replacements in 4 files, the 2 `updated:` dates included, plus 2 insertions (E3 in the decision log, E7 in the inventory). **Risk:** low. **Timeline:** none.

**Decisions made for the developer** (veto any):

1. FR210 and NR56 state the concept briefly and name `docs/STYLE_GUIDE.md`, section 6, as its source. The full rows don't move into every document.
2. The bell decision is written as a definition: "the embers" in the warm rule means Rowan's fire family, which is his shots, the collectables (embers and bells) and the weapon pickups. The rule's short form ("the hero, embers and lanterns") then stays true everywhere it is quoted.
3. GDD Art Style records that lanterns stay less saturated than Rowan and the collectables. This settles gap 20 the way the guide measured it.
4. Story 2.2 checks that each horn is on the same side as on the concept. The two horns differ, so a mirrored view would look right on its own and still be wrong.
5. The GDD's pillar line (gdd.md:143, "warm light reserved for the hero, embers and lanterns") stays as it is. It is a summary, and decision 2's definition covers it.

## 4. Detailed Change Proposals

### 4.1 GDD (`gdd.md`)

#### E1. Art and Audio Direction › Art Style › Fixed rules, the warm-light bullet

OLD:

> - **Warm light belongs only to the hero, embers and lanterns.** Rowan, his shots and the collectables are always the warmest things on screen. Lanterns appear only in Emberwood. The story cards may be an exception, pending Epic 0 (see Story Delivery).

NEW:

> - **Warm light belongs only to the hero, embers and lanterns.** "The embers" means Rowan's whole fire family: his shots, the collectables (embers and bells, which are warm brass) and the weapon pickups. Rowan, his shots and the collectables are always the warmest things on screen; lanterns stay less saturated than all of them. Lanterns appear only in Emberwood. The story cards may be an exception, pending Epic 0 (see Story Delivery). The values are in `docs/STYLE_GUIDE.md`, section 3.

Rationale: resolves the bell clash (decision 2) and the lantern ranking (decision 3).

#### E2. Art Style › Hero: Rowan in cursed form

OLD:

> **Hero: Rowan in cursed form:**
>
> - A horned ember-beast, clearly not an ape.
> - Upright, with two legs and two arms, about 3 heads tall, with a human-shaped skeleton.
> - Readable as a small figure on screen. The features were chosen for that:
>   - two bone horns sweeping back
>   - a furnace glow in the chest
>   - ember-bright eyes
> - Charcoal skin with glowing seams, and a torn red woodsman's scarf as his human trace.
> - Determined, not monstrous.
> - Three stages: (unchanged)
>
> Design sign-off happens in Epic 0 (concept) and Epic 2 (model).

NEW:

> **Hero: Rowan in cursed form.** The concept was signed off on 2026-11-14, as drawn on `art-src/reference/hero-sheet-mix.jpeg`. `docs/STYLE_GUIDE.md`, section 6, is the concept Epic 2 models from.
>
> - A horned ember-beast, clearly not an ape, with pointed ears.
> - Upright, with two legs and two arms, about 4 heads tall, with a human-shaped skeleton. Heavy arms, the hands at mid-thigh.
> - Readable as a small figure on screen. The features were chosen for that:
>   - two bone horns that don't match: his left sweeps out and back, his right curls up into a hook
>   - a furnace glow in the chest
>   - ember-bright eyes
> - Charcoal skin with glowing seams, and a torn red woodsman's scarf as his human trace.
> - Worn, dark woodsman's trousers, torn at the knees and shins, with a belt; bare clawed feet.
> - Determined, not monstrous.
> - Three stages: (unchanged)
>
> Design sign-off happens in Epic 0 (concept, done 2026-11-14) and Epic 2 (model).

Also set the frontmatter `updated:` to 2026-11-14.

### 4.2 GDD decision log (`decision-log.md`)

#### E3. Append

> ### Update from the style lock (2026-11-14)
>
> - **Intent: update, through `gds-correct-course`.** Change signal: story 0.5, `docs/STYLE_GUIDE.md` approved 2026-11-14. Proposal: `sprint-change-proposal-2026-11-14-style-lock.md`.
> - **Developer decisions:**
>   - **Style: the mix.** Comic shading and ink outlines with the dark-fantasy palette. The guide records the rest of the look.
>   - **Rowan's concept is signed off as drawn** on `hero-sheet-mix.jpeg`: about 4 heads tall, two mismatched horns, heavy arms, pointed ears, belted torn trousers, bare clawed feet. The recommendation was to write corrections (3 heads, horns sweeping back, lighter arms); he kept the sheet.
>   - **Bells are warm brass, part of Rowan's fire family,** so the collectables really are among the warmest things on screen (NFR28). This resolves the clash with NR15's in-play list.
> - **Settled without a design choice:** "the embers" in the warm-light rule means the fire family (shots, embers, bells, weapon pickups); lanterns stay less saturated than all of it.

### 4.3 Narrative design (`narrative-design.md`)

#### E4. Characters › Rowan Ashby › Description

OLD:

> **Description:** A former Cindersworn fire-caster in his mid-thirties, cursed into a horned ember-beast. About 3 heads tall. Charcoal skin with glowing seams, two bone horns sweeping back, a furnace glow in his chest, ember-bright eyes. A torn red woodsman's scarf is his human trace. Determined, not monstrous.

NEW:

> **Description:** A former Cindersworn fire-caster in his mid-thirties, cursed into a horned ember-beast. About 4 heads tall, with pointed ears. Charcoal skin with glowing seams, two mismatched bone horns (one sweeps out and back, the other curls up into a hook), a furnace glow in his chest, ember-bright eyes. A torn red woodsman's scarf is his human trace; he still wears his worn, belted woodsman's trousers, and his feet are bare and clawed. Determined, not monstrous. The signed-off concept is `docs/STYLE_GUIDE.md`, section 6.

#### E5. Cutscenes › Style, the card warm-light exception

OLD:

> - **Card warm-light exception:** on cards, warm light also marks Elin and home. In play it stays reserved for Rowan, embers and lanterns. Confirm in Epic 0.

NEW:

> - **Card warm-light exception:** on cards, warm light also marks Elin and home. In play it stays reserved for Rowan and his fire (his shots, the embers, the bells and the weapon pickups) and the lanterns (`docs/STYLE_GUIDE.md`, section 3). Confirm in Epic 0.

#### E6. Tone and Atmosphere › Atmosphere, the visual line

OLD:

> - **Visual: a cold world, a warm hero.** The GDD's rule that warm light belongs only to Rowan, embers and lanterns carries the theme.

NEW:

> - **Visual: a cold world, a warm hero.** The GDD's rule that warm light belongs only to Rowan, his fire's family (the embers, the bells, the pickups) and the lanterns carries the theme.

The rest of the bullet is unchanged.

### 4.4 Requirements inventory (`requirements-inventory.md`)

#### E7. "What this file is", after the 2026-11-13 refresh bullet, add

> - Refreshed 2026-11-14 by `sprint-change-proposal-2026-11-14-style-lock.md`: FR210, NR15, NR56 and NFR28 now match the signed-off concept and the bell decision; gaps 14 and 20 are resolved.

#### E8. FR210

OLD:

> FR210: Rowan's cursed-form design: a horned ember-beast, clearly not an ape; upright, two legs and two arms, about 3 heads tall, human-shaped skeleton; two bone horns sweeping back; a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; a torn red woodsman's scarf; determined, not monstrous; readable as a small figure on screen. (gdd.md:725-731) [epic: E0 concept, E2 model]

NEW:

> FR210: Rowan's cursed-form design, as signed off on 2026-11-14 (`docs/STYLE_GUIDE.md`, section 6): a horned ember-beast, clearly not an ape, with pointed ears; upright, two legs and two arms, about 4 heads tall, human-shaped skeleton, heavy arms; two mismatched bone horns (his left sweeps out and back, his right curls up into a hook); a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; a torn red woodsman's scarf; worn, belted woodsman's trousers; bare clawed feet; determined, not monstrous; readable as a small figure on screen. (gdd.md, Hero) [epic: E0 concept, E2 model]

#### E9. NR15

OLD:

> - NR15: Card warm-light exception: on cards, warm light also marks Elin and home. In play, warm light stays reserved for Rowan, embers and lanterns. Epic 0 confirms the exception and records it in `docs/STYLE_GUIDE.md`. (narrative-design.md:797, 1050) [epic: E0]

NEW:

> - NR15: Card warm-light exception: on cards, warm light also marks Elin and home. In play, warm light stays reserved for Rowan and his fire (his shots, the embers, the bells and the weapon pickups) and the lanterns. Epic 0 confirms the exception and records it in `docs/STYLE_GUIDE.md`. (narrative-design.md:797, 1050) [epic: E0]

#### E10. NR56

OLD:

> - NR56: Rowan in cursed form: about 3 heads tall, charcoal skin with glowing seams, two bone horns sweeping back, a furnace glow in his chest, ember-bright eyes, a torn red woodsman's scarf. Determined, not monstrous. (narrative-design.md:208)

NEW:

> - NR56: Rowan in cursed form: about 4 heads tall, pointed ears, charcoal skin with glowing seams, two mismatched bone horns, a furnace glow in his chest, ember-bright eyes, a torn red woodsman's scarf, worn belted trousers, bare clawed feet. Determined, not monstrous. The signed-off concept is `docs/STYLE_GUIDE.md`, section 6. (narrative-design.md:208)

#### E11. NFR28

OLD:

> NFR28: Warm light belongs only to the hero, embers and lanterns; Rowan, his shots and the collectables are always the warmest things on screen (story cards may be an exception pending Epic 0); Harrowmere has no warm light other than Rowan's. (gdd.md:143, 719, 746)

NEW:

> NFR28: Warm light belongs only to the hero, embers and lanterns, where "the embers" means Rowan's fire family: his shots, the collectables (embers and bells) and the weapon pickups. Rowan, his shots and the collectables are always the warmest things on screen, and lanterns stay less saturated than all of them (story cards may be an exception pending Epic 0). Harrowmere has no warm light other than Rowan's and his fire family's. (gdd.md:143, Art Style; `docs/STYLE_GUIDE.md`, section 3)

#### E12. Gaps 14 (narrative) and 20 (GDD): append a resolution to each item

> **Resolved 2026-11-14** (`sprint-change-proposal-2026-11-14-style-lock.md`): …

- Gap 14: "… the fire family (shots, embers, bells, weapon pickups) is the only warm light in Harrowmere besides Rowan; NR100's 'the embers' means that family."
- Gap 20: "… lanterns stay less saturated than Rowan and the collectables (`docs/STYLE_GUIDE.md`, section 3)."

### 4.5 Epics and stories (`epics.md`)

The frontmatter `updated:` becomes 2026-11-14.

#### E13. Story 0.13, the warm-light AC

OLD: `**And** in play, warm light stays reserved for Rowan, the embers and the lanterns either way`
NEW: `**And** in play, warm light stays reserved for Rowan and his fire (his shots, the embers, the bells and the weapon pickups) and the lanterns either way (docs/STYLE_GUIDE.md, section 3)`

#### E14. Story 2.2, the views AC

OLD:

> **Then** all four show every feature of the design: a horned ember-beast, clearly not an ape; upright, with two legs and two arms, about 3 heads tall, on a human-shaped skeleton; two bone horns sweeping back; a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; the torn red woodsman's scarf; determined, not monstrous (FR210, NR56, NR58)

NEW:

> **Then** all four show every feature of the concept signed off in `docs/STYLE_GUIDE.md`, section 6: a horned ember-beast, clearly not an ape, with pointed ears; upright, with two legs and two arms, about 4 heads tall, on a human-shaped skeleton, with heavy arms; two mismatched bone horns, each on the same side as on the concept (his left sweeps out and back, his right curls up into a hook); a furnace glow in the chest; ember-bright eyes; charcoal skin with glowing seams; the torn red woodsman's scarf; worn, belted woodsman's trousers; bare clawed feet; determined, not monstrous (FR210, NR56, NR58)

Rationale: the old wording would reject views that match the approved concept (decision 4 adds the horn-side check).

**E15. The in-play warm lists in Epics 3 to 5** (one phrase each):

| Story | OLD | NEW |
| --- | --- | --- |
| 3.3 | warm light comes only from Rowan, his shots, the embers and the lanterns | warm light comes only from Rowan, his shots, the collectables (embers and bells), the weapon pickups and the lanterns |
| 3.20 | warm light comes only from Rowan, his shots, the embers and the lanterns | warm light comes only from Rowan, his shots, the collectables (embers and bells), the weapon pickups and the lanterns |
| 4.8 | while Rowan, his shots and the embers stay the warmest things on screen | while Rowan, his shots and the collectables stay the warmest things on screen |
| 4.10 | with warm light allowed only on Rowan, his shots and the embers | with warm light allowed only on Rowan, his shots, the embers and the bells |
| 5.10 | Rowan, his shots, the embers and the pickups are the warmest things on screen | Rowan, his shots, the embers, the bells and the pickups are the warmest things on screen |
| 5.13 | no warm light but Rowan's, his shots', the embers' and the warm pickups' | no warm light but Rowan's, his shots', the embers', the bells' and the warm pickups' |

Story 4.10 is the warden arena, which has no pickups, so only the bells are added there. Bells sit in the levels; whether the arena has one is the level's business, and listing bells keeps the rig's allowed list the same as the level's.

## 5. Implementation Handoff

- **Scope: minor.** These are text edits for the Developer agent in this session, applied right after approval. No backlog change.
- **Success criteria:**
  - Each OLD text above is found exactly once and replaced.
  - A search of the five artifacts for "about 3 heads" and "horns sweeping back" finds nothing outside the places listed as unchanged on purpose.
  - Every in-play warm list in `epics.md` includes the bells.
  - `make check` still passes.
- **Next:** story 0.5 stays in review for `gds-code-review`. Story 0.6 can be created after that.

## 6. Approval and application

- **Approved** by the developer on 2026-11-14, in batch mode, with no vetoes.
- **Applied** the same day by a script that replaced each OLD text only if it occurred exactly once: 22 replacements across 4 files (E1, E2, E4–E6, E8–E15, and the two `updated:` dates), all found once. Then the two insertions: the inventory refresh bullet (E7) and the decision-log entry (E3).
- **Success criteria:**
  - Outside the places left unchanged on purpose, "about 3 heads" and "horns sweeping back" no longer appear. The search still finds story 0.4's AC (`epics.md:728`) and the decision log's quote of the recommendation that was declined.
  - Every in-play warm list in `epics.md` names the bells (stories 0.13, 3.3, 3.20, 4.10, 5.10 and 5.13; story 4.8 says "the collectables").
  - `make check` exits 0.

## 7. Amendment from the code review (2026-11-14)

The code review of story 0.5 found places this proposal missed, and one fork. The developer chose to apply every patch. Decision 1 makes "the warmest" a group: "Rowan and his fire family are the warmest things on screen". Decision 2 keeps the hazard colour as approved. Applied as 22 more replacements, each found exactly once:

- **Missed warm lists, now naming the fire family:**
  - `epics.md`, story 0.7 (unit-test AC), story 0.12 (Harrowmere test scene) and story 5.17
  - `gdd.md`, the Harrowmere level look
  - NR100 in `requirements-inventory.md`, and its source line in `narrative-design.md`
- **Story 4.10** now lists the weapon pickups too, so the Drowned Mill rig's allowed list is the same as the level's. This replaces E15's note about 4.10, which wrongly left them out.
- **"The pickups" and "the warm pickups"** in stories 5.10 and 5.13 now read "the weapon pickups".
- **Decision 1:** stories 2.7, 2.10, 4.10 and 4.12 (critic-loop ACs) and 5.13 now read "Rowan, with his fire family, is the warmest…", or "Rowan and his fire family are the warmest things on screen".
- **Fonts:** story 0.5's epic AC, story 0.8 (three lines) and story 0.14 now allow two faces for the three roles. Story 0.8 also allows one unmodified variable file, for Source Sans 3's Reserved Font Name.
- **GDD line numbers:** E2's trousers bullet is folded into the scarf bullet, so `gdd.md` has its original line count and every inventory citation to it is right again. FR210 and NFR28 take back their line citations: `gdd.md:725-731` and `gdd.md:143, 719, 746`.
- **The inventory's refresh bullet** now lists NR100.
- **The style guide:** section 3 now defines the fire family, makes the warmest a group, gives the warm ends as inclusive, and states the lantern margin rule. The shading tones and the story palettes' own slot list are now spelled out. Section 6's table is relabelled as FR210's old wording. The fonts are pinned to `@fontsource/alegreya@5.3.0` (byte-identical files) and Adobe's licence at 3.052R, with distinct licence file names.

`make check` and `make contrast COLORS=docs/STYLE_GUIDE.md` pass after the amendment.


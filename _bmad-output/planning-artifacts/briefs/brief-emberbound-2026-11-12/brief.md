---
title: "Game Brief: Emberbound"
status: final
created: 2026-11-12
updated: 2026-11-12
inputs:
  - docs/PROJECT_BRIEF.md
  - addendum.md
---

# Game Brief: Emberbound (working title)

Detailed design defaults, tuning numbers, the milestones (M0 to M6) and the asset pipeline stay in the planning doc, `docs/PROJECT_BRIEF.md`. Research and sources are in `addendum.md`.

## Executive Summary

Emberbound is a short 2.5D side-scrolling action platformer for the desktop browser. Rowan Ashby once burned a town using fire from a bargain with a dark power. Years later the debt is called in: his bride-to-be, Elin, is taken as payment, and Rowan is turned into a horned ember-beast. The player runs, jumps and spits embers through themed levels to reach the wardens, the bosses who hold the six seals of the bargain. Every broken seal makes Rowan a little more human.

It is made for players who grew up on arcade and console platformers and want that kind of game again without its cruelty. It can be understood in seconds and finished in one evening, with hearts and checkpoints instead of one-hit deaths and a countdown. Version one is three levels and one boss, 20 to 30 minutes long, free to play in the browser.

The project exists first to learn game development by finishing something small and polished. Selling it is a possibility, not the goal.

## Vision

- **Core fantasy:** you are the monster in this story, and every warden you beat burns a little of the monster away.
- **Elevator pitch:** a cursed fire-caster spits embers through dark-fantasy levels to break the bargain that took his bride. It is a short, forgiving 2.5D platformer in the spirit of the arcade classics, free in the browser.
- **Vision statement:** the arcade platformer you remember, made fair, with a story about paying for what you did.
- **What players should feel:** in the first minutes, the snap of running, jumping and spitting fire. By the end, a small, earned sense of redemption. Rowan pays for what he did, and Elin is part of how it ends.

## Target Players & Market

- **Primary audience:** players aged roughly 35 to 55 who grew up on arcade and console platformers. They play in a single evening session on a desktop computer. They want to understand the game without a manual, finish it, and not be punished for being out of practice.
- **Secondary audience:** younger fans of modern platformers (Celeste, Hollow Knight). For them, the game offers tight controls and a hand-made look. When the two audiences want different things, the primary one wins. For example, there is one difficulty setting, tuned to be generous.
- **Market reality:** short paid platformers do well only when the price matches the length, Steam refunds any game played for under 2 hours, and most small indie games earn little on Steam or on browser portals. Examples and figures are in `addendum.md`.

## Core Fundamentals

- **Genre:** 2.5D side-scrolling action platformer: 3D models on a 2D play plane, in a stage-and-boss structure.
- **Core loop:**
  - *Moment to moment:* run, jump, spit embers at enemies, avoid hazards.
  - *Per section:* clear a stretch, pick up embers and hidden bells, reach the next checkpoint.
  - *Per level:* reach the end and face a warden where there is one. When a seal breaks, Rowan visibly changes and gains an ability, and a line of story introduces the next level.
- **Pillars:**
  1. **Understood in seconds.** One attack, a handful of moves, and enemies and hazards that stand out from the background. Level layout teaches; text does not. If a player needs a hint box to proceed, the level is wrong.
  2. **Arcade heart, modern mercy.** Toki's pace and structure (stages, bosses, timed weapon pickups) without its punishment. Hearts, checkpoints and auto-save replace one-hit deaths, a countdown and no saves.
  3. **The curse shows on the body.** The story reaches the player through what they see and do: Rowan's form, the places he passes through, the moment a seal breaks. Each broken seal is a visible change and a new ability.
- **Primary mechanics:** these are defaults from the planning doc, each to be settled in the GDD.
  - Moves: run, variable-height jump, ember spit (aim up, and aim down in the air), crouch, and a stomp that works on some enemies.
  - Pickups: timed weapon pickups, starting with a triple shot.
  - Embers as currency, and three hidden bells per level.
  - Three hearts and checkpoints.
  - No arcade score; clear time, bells and respawns are tracked per level.
- **What holds the first two minutes:** how the movement feels. The tuning numbers were proven in the prototype (`prototype/sprout-demo.html`).

## References & Differentiation

| Game | Take | Leave |
| --- | --- | --- |
| Toki (1989 arcade; 2018 remake) | Stage-and-boss structure, a spit attack, timed weapon pickups, short length | One-hit deaths, countdown, no saves; all names, characters, levels, art and sound; the remake's full price for a short game |
| Wonder Boy: The Dragon's Trap (2017) | A curse that changes the hero's body as bosses fall | Switching between forms as a system. Rowan only moves toward human. |
| Bloodstained: Curse of the Moon (2018), The Dark Queen of Mortholme (2025) | Proof that short, focused, cheap games can be loved | — |
| Hollow Knight, Mandragora, Prince of Persia: The Lost Crown, Toki (2018) | Art references only: restraint, mood, shapes, comic finish | Their characters and scenes |

**Differentiators:**

- **The honest edge is execution:** feel, readability and polish, not a new mechanic.
- **Rowan caused his own curse.** He burned Harrowmere, and version one ends with him walking through its ruins. Cuphead's debt comes from a lost bet, and The Dragon's Trap's curse is put on the hero by a dragon. Here the curse is the bill for a choice he made.
- **Elin acts in the ending.** She is not a prize waiting at the finish.
- **Nothing to install.** It plays free in a browser tab, which matters for an audience that will not install something to try it.

## Scope & MVP

- **Platform:** desktop browser first, with keyboard and gamepad. Touch controls are not decided yet.
- **Team:**
  - One developer: an intermediate full-stack developer (Go, Java, React/TypeScript) who is new to game development.
  - The work is done with Claude models through Claude Code and the BMad workflows.
  - About 8 to 10 hours a week, with no fixed deadline.
- **Budget:** tool subscriptions only. Amounts are not set yet.
- **Settled stack:** three.js, TypeScript and Vite; Vitest and Playwright for tests; Tripo for meshes; Blender through MCP for cleanup, rigging and animation.
- **MVP, the proof:**
  - **What:** Level 1 (Emberwood) playable from start to finish with final art. That means the hero, three enemy types, pickups, checkpoints, the HUD and audio.
  - **Hypothesis:** a new player in the primary audience finishes it without help and wants Level 2.
- **Version one, the release:**
  - Levels 1 to 3 and one warden, 20 to 30 minutes.
  - Free in the browser on itch.io, where browser games can only take donations.
  - Success is measured by how many players finish it and what the developer learns, not by revenue.
- **Not in version one:**
  - Levels 4 to 6 and more wardens.
  - Difficulty settings, score and leaderboards.
  - The Steam build. A paid desktop build on Steam ($5 or less) comes only if the free version finds players.

## Content & Direction

- **World:** a dark-fantasy land ruled by the Tithe, a bargain with the Ember Below. The Tithe's enforcer is Lord Maldrek, the Tithe-Collector. Version one's places:
  - Emberwood, the home forest.
  - The Drowned Mill, marsh and waterwheels.
  - The ruins of Harrowmere, the town Rowan burned.
- **Narrative approach:** a short intro, one line of text before each level, and no dialogue during play. The story is carried by what the player sees. The ending is not chosen yet, but Elin must take part in it.
- **Content breadth (version one):**
  - At least 3 enemy types. Levels, warden and length are as in Scope & MVP.
  - Replay comes from hidden bells and clear times.
  - Rowan has three visual stages planned, from full beast to mostly human. Version one shows the first change.
- **Art direction:**
  - 3D characters on a 2D play plane, in front of layered backdrops.
  - The style is not chosen yet: stylised dark fantasy (cold teal and plum, fog) or comic illustration (flat colour, ink outlines), or a mix of the two.
  - Fixed rule: warm light belongs only to the hero, embers and lanterns.
  - The renderer owns the style, through shared shaders, a palette module and a lighting rig per level.
- **Audio direction:**
  - One short, hummable tune per level that recalls the arcade era but uses modern instruments.
  - Punchy effects, with the ember spit as the signature sound.
  - Audio tools are not chosen yet.

## Risks & Open Questions

### Risks

1. **Turning AI-generated models into a cleanly animated hero.**
   - Risk: the chain from reference image to Tripo mesh to Blender rig to animation is new to the developer. The hero must deform cleanly and match the style.
   - Mitigation: prove the pipeline on Rowan alone (milestone M2) before building any level art. Keep a simpler hand-built model as the fallback.
2. **No image model chosen.**
   - Risk: style lock (milestone M0) and Tripo's input views both depend on generated reference images.
   - Mitigation: choose an image model before M0 starts.
3. **Time and scope.**
   - Risk: at 8 to 10 hours a week, every extra feature delays the finish.
   - Mitigation: the MVP is Level 1; reject scope growth unless the developer asks for it.
4. **The story hook depends on visuals.**
   - Risk: if players don't read the story from Rowan's changes and the places he passes through, it doesn't land.
   - Mitigation: in the Level 1 playtest, check whether players can say who Rowan is and what he wants.
5. **Name and likeness.**
   - Risk: "Emberbound" is already used by at least six games, including one on Steam, and the overall premise resembles Toki's outline.
   - Mitigation: pick a new title before any public page goes up (see Open questions). Because of the Toki resemblance, every name and asset stays original.

### Open questions for the GDD

- **Where version one's single warden sits.** The planning doc's level table breaks the first seal in Level 2, but its milestones build the first warden before Levels 2 and 3.
- The ending (three candidates, all with Elin taking part).
- Stomp, the fail rule, the weapon pickup list, the permanent ability per seal, and touch controls.
- Art style and hero design sign-off.
- Image model, audio tools, level editor (LDtk or Tiled), and tool budgets.
- Final title.

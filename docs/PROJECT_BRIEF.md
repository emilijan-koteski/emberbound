# Emberbound: project brief

Working title. Check it against existing games and trademarks before committing.

This brief carries everything decided in the first planning session, held before BMad was set up. It is the starting input for the BMad Game Dev Studio flow: the game brief (`gds-create-game-brief`) and the Game Design Document (`gds-gdd`) are built from it. Once those exist in `_bmad-output/planning-artifacts/`, they win over this file on any conflict. This file is not kept in sync after that.

Items marked **OPEN** are the developer's to decide, normally while writing the GDD. Do not decide them silently.

## 1. The game in one paragraph

A 2.5D side-scrolling platformer. A cursed hero runs, jumps and spits embers through themed levels, each ending in a boss, to rescue the woman he loves and break his curse. It is inspired by the structure of the 1989 arcade game Toki, with modern fail rules, saving and character growth. First version: 3 levels and 1 boss, 20 to 30 minutes long, playable in a browser. A desktop build for Steam is optional and comes later.

## 2. Goals, in priority order

1. Learn game development by hitting real problems.
2. Enjoy the process.
3. Finish something small and polished.
4. Possibly sell it for a small price.

Small and finished beats large and empty. Reject scope growth unless the developer asks for it.

## 3. Story

Ten years ago Rowan Ashby was a hired fire-caster, one of the Cindersworn. On a lord's order he burned the granary town of Harrowmere to end a siege. The fire came from a bargain with the Ember Below, sealed with one line: *I will pay with what I hold dearest when the debt is called.* He had nothing dear then.

He left that life, hid his past and fell in love with Elin, a bell-maker. On the night before their wedding the Tithe-Collector, Lord Maldrek, comes to claim the debt and takes Elin. Rowan reaches for the old fire to stop him and the bargain claims him too: horns, cinder skin, a furnace in his chest. The curse leaves one gift: he can spit embers.

Six seals bind the bargain, each held by one of Maldrek's wardens, who were once debtors like Rowan. Each broken seal loosens the curse.

### Vocabulary (use these on screen)

| Idea | Term |
| --- | --- |
| Fire-caster bound by a bargain | Cindersworn |
| The bargain | The Tithe |
| The power he bargained with | The Ember Below |
| Its enforcer, the main villain | Lord Maldrek, the Tithe-Collector |
| The magic | Emberfire |
| Bosses | Wardens of the six seals |

### Levels

| # | Place | Beat |
| --- | --- | --- |
| 1 | Emberwood | Home forest. Rowan learns his new body. |
| 2 | The Drowned Mill | Marsh and waterwheels. First seal breaks. |
| 3 | Harrowmere ruins | The town he burned. End of version one. |
| 4 | Bellspire Pass | Ice and wind. Later. |
| 5 | The Tithe Road | The way down. Later. |
| 6 | The Hollow Court | Maldrek, then the pact. Later. |

**OPEN: ending.** Three candidates: Rowan gives up the fire and Elin's bell breaks the last seal; Elin learns the truth and chooses; or a simple win. Elin should take part in the ending, not only wait.

## 4. Design decisions

Suggested defaults from planning. Each is **OPEN** until the developer confirms.

| Area | Default |
| --- | --- |
| Moves | Run, variable-height jump, ember spit, aim up, aim down in the air, crouch |
| Stomp | Works on some enemies, not on spiky ones |
| Fail rule | 3 hearts, checkpoints, respawn at last checkpoint |
| Timer | None. Show clear time at the end. |
| Weapon pickups | Timed, as in Toki. Start with triple shot. |
| Growth | One permanent ability and a more human look per broken seal |
| Collectables | Embers as currency; 3 hidden bells per level |
| Score | No arcade score. Track time, bells and respawns per level. |
| Saving | Auto-save at the end of each level; level select |
| Story delivery | Short intro, one line of text before each level, no dialogue during play |
| Difficulty | One setting, tuned generous |
| Input | Keyboard and gamepad. Touch is optional. |

### What Toki did (reference only, do not copy content)

Six stages with a boss each and mid-bosses in most. About 20 minutes long. One hit kills. Countdown timer. No saves. Temporary weapon pickups: three-way, wave, charge, fire. Other temporary pickups: shield helmet, speed and jump shoes, clocks, bonus fruit. No permanent growth. The remake (2018) is hand-drawn 2D in a comic style.

## 5. Art direction

**Not decided.** The planning session produced style tests on a placeholder scene, and the developer could not judge style from placeholder content. The style is locked in milestone 0 from generated reference images.

### Candidates the developer leaned toward

- **Stylised dark fantasy.** Cold palette of teal and plum, fog, a pale glow behind trees. Warm light only on the hero, embers and lanterns. Simple flat shapes with soft gradients. Mood of Mandragora, shapes of Prince of Persia: The Lost Crown, restraint of Hollow Knight.
- **Comic illustration.** Flat colours, banded shading, dark ink outlines, one dominant colour per level, painted 2D backdrops behind 3D play. Feel of the 2018 Toki remake.

These can combine: comic shading and outlines with the dark fantasy palette.

### Hero design brief

- Rowan in cursed form: a horned ember-beast, clearly not an ape.
- Two legs, two arms, upright, roughly 3 heads tall. A human-shaped skeleton keeps auto-rigging workable.
- Readable as a small figure: two horns that sweep back, a glowing chest, ember eyes.
- Charcoal skin with glowing seams. A scrap of his old woodsman's scarf or cloak as the human trace.
- Three visual stages, more human at each: full beast, one horn broken and a human hand, mostly human with embers fading.

### Reference prompts (adapt to the image model in use)

Hero, per style candidate:

> Character design sheet, full body, neutral standing pose, plain light background. A small cursed warrior turned into a horned ember-beast: upright, two legs, two arms, about three heads tall. Charcoal skin with glowing orange seams, two bone horns sweeping back, a furnace glow in the chest, ember-bright eyes, a torn red woodsman's scarf. Determined, not monstrous. [STYLE: stylised dark fantasy, simple bold shapes, soft gradients | comic illustration, flat colours, dark ink outlines, banded shading]. No text.

Then, from the chosen image: front, back, left and right views, same character and outfit, arms slightly away from the body, plain background.

Level key art:

> Side-on view of a 2.5D platformer level, hero small in the lower third. The Emberwood at dusk: old forest, mossy rock, wooden ledges, hanging lanterns, embers drifting. Clear walkable ground line, a gap, one raised platform. Layered depth: dark foreground plants, play area, misty trees, distant ridges. [STYLE as above]. No interface, no text.

Generate each in every candidate style. The developer picks. Then write `docs/STYLE_GUIDE.md`: palette with hex values, shading rule, outline rule, lighting rule, what warm colour is reserved for, and the reference images.

### The renderer owns the style

Generated images differ every time, so they cannot be what keeps the game consistent. They are used once, in milestone 0, to choose a direction. From then on the look is defined in code and applied to everything by the renderer (three.js on WebGL):

- **One shared shader set.** A small number of materials (ground, foliage, character, prop, effect) implement the shading rule from the style guide. Every asset uses them. No asset ships its own lighting model.
- **Palette as data.** Colours come from a palette module, per level. Assets carry flat colour regions or simple masks, and the shader maps them to the palette.
- **One lighting rig per level,** defined in code: key light, fill, fog, and what warm light is reserved for.
- **Outlines and grading as render passes,** not baked into textures: edge outlines if the style has them, then colour grading and vignette.
- **Generated textures are stripped or flattened** on import where the style calls for flat colour, so a model from any generator ends up looking like part of the same game.
- **A look-dev page.** A separate page in the project shows any asset under the game's shaders and lighting, next to the style guide swatches. Every new asset is judged there, in the engine, before it goes into a level.

The reference for "does this look right" is the look-dev page and the style guide, not a fresh generated image.

## 6. Technical plan

### Stack

Settled:

- **three.js, TypeScript, Vite** for the game. Check current versions and documentation at setup.
- **Vitest** for simulation tests. **Playwright** for screenshot checks.
- **Tripo** turns reference images into 3D meshes.
- **Blender**, driven through Blender MCP, for cleanup, rigging, animation and glTF export.
- **Claude models**, through Claude Code and the BMad workflows, for planning, code, review and driving Blender.

Still open:

- Image model for reference art and the multi-view images Tripo works from (milestone 0, asset pipeline steps 1 and 2). Claude models do not generate images. **OPEN**
- Audio tools for effects and music. **OPEN**
- Level editor: LDtk or Tiled, exported as JSON. **OPEN**

Later:

- Desktop build with Electron; Steam features through steamworks.js.

### Structure

```text
src/
  sim/        pure game rules: no three.js, runs in Node
    config.ts     all tuning numbers
    body.ts       bodies and tile collision
    player.ts     controller
    enemies/      one file per enemy type
    level.ts      tile map, entities, loader
    world.ts      step(dt) that advances everything
  render/     three.js: scene, camera, models, effects
  input/      keyboard, gamepad, touch -> one action state
  audio/
  ui/         HUD and menus
  main.ts     fixed-step loop
tests/        sim unit tests, screenshot checks
docs/         this brief, STYLE_GUIDE.md, ASSETS.md
assets/       models, textures, audio, levels
prototype/    the Sprout prototype (reference only, not built)
_bmad/        BMad Method install
_bmad-output/ BMad planning and implementation artifacts
```

### Core rules, proven in the prototype

The prototype is `prototype/sprout-demo.html`: a single page on three.js r128 with placeholder art.

- Fixed 60 Hz step with an accumulator; render interpolates between steps. Cap steps per frame.
- Bodies: x is the centre, y is the feet. Move on X and resolve, then on Y and resolve, against the tile grid.
- One-way ledges: collide only when moving down and the feet were above the ledge top on the previous step.
- Moving platforms: land from above only; carry the rider by the platform's movement; keep the platform's speed when jumping off.
- Input: latch jump and spit presses so a tap shorter than one step is not lost.
- Camera: follow with look-ahead in the facing direction, a vertical dead zone while airborne, re-centre on landing, clamp to level bounds.
- Shadows: snap the shadow camera to texel steps while it follows, or edges crawl.

### Starting numbers (units are tiles and seconds)

| Value | Number |
| --- | --- |
| Gravity | 40 |
| Fall gravity multiplier | 1.35 |
| Apex gravity multiplier while holding jump | 0.55, when vertical speed is under 2.2 |
| Max fall speed | 18 |
| Run speed | 7 |
| Ground acceleration / deceleration | 70 / 60 |
| Turn-around boost | 1.7x |
| Air acceleration / deceleration | 40 / 16 |
| Jump speed | 16.5 (full jump about 3.3 tiles, tap about 0.8) |
| Jump cut on release | 0.45x |
| Coyote time / jump buffer | 0.10 s / 0.12 s |
| Stomp bounce / with jump held | 11 / 15.5 |
| Hero hitbox | 0.72 wide, 0.92 tall |
| Ember shot | speed 15, life 0.55 s, cooldown 0.2 s |
| Aim up, aim down | 45 degrees |
| Hearts | 3; 1.3 s of invulnerability after a hit |

These felt right in the prototype. Retune only with the developer.

### Level 1 teaching order (from the prototype)

Walk, small step, tall step that needs a held jump, gap, stompable walkers, a low spiky flyer to shoot, a high flyer that needs aim-up, checkpoint, moving platform over a pit, one-way ledges to climb, spikes on a cliff top, a bridge that must be dropped through, power-up, mixed enemies, exit.

Design the layout in grey boxes first. Every jump must be possible with the numbers above; test this in code.

### Bugs the prototype hit (do not repeat)

- The first animation frame after a slow load had a negative time step and broke animation. Clamp frame time to zero or above.
- A squash-and-stretch spring went unstable at low frame rates. Sub-step visual springs or use a stable integrator.
- Shots from the "aim up" sign hit a solid ledge instead of the enemy. Check sight lines wherever a level teaches aiming.
- Instanced meshes vanished off-screen in an old three.js because culling used the base shape. Verify culling for instanced meshes in the version in use.
- A pit looked like a floor because its back wall was lit. Pits must read as dark.
- Hazards blended into the ground. Hazards need contrast against their surroundings.
- A long hint box covered the play area on phones. Keep hints clear of gameplay.
- Reading gamepads threw a security error inside an embedded preview, on every frame, so nothing rendered. Wrap optional browser features (gamepad, storage, audio, fullscreen) in try/catch and switch the feature off after a refusal. One failing optional feature must never stop the frame loop.

## 7. Asset pipeline

1. **Reference.** Concept image in the locked style (image model **OPEN**).
2. **Views.** Front, back, left and right views of the same subject from the same image model.
3. **Mesh.** Tripo, from the views in step 2.
4. **Cleanup in Blender through MCP.** Fix scale and origin (feet at the origin, 1 unit = 1 tile), reduce polygons, check materials, name parts.
5. **Rig and animate in Blender.** One shared human-shaped skeleton for the hero and human-shaped enemies, with a common motion library. Creatures get their own.
6. **Export** glTF. Assign the game's shared materials and palette; do not keep the generator's own shading. View it on the look-dev page, screenshot, and compare with the style guide.
7. **Log** the asset, tool and licence in `docs/ASSETS.md`.

Hero animations needed: idle, run, jump, fall, land, spit, spit aiming up, spit aiming down, crouch, hurt, death. Each enemy: move, attack if any, hurt, death.

Environment art is a kit of reusable pieces that snap to the tile grid: ground chunks, ledges, props, background layers. Art dresses a layout that already plays well.

Raw generated meshes are fine for background props. Check the hero and enemies closely: they must deform cleanly when animated.

Audio: generated effects and music are acceptable; the tool is **OPEN**. Same licence logging.

## 8. The critic loop

After any visual change:

1. Run the game headless and capture screenshots at fixed spots (a list in `tests/spots.ts`).
2. Look at each screenshot next to the reference image and the style guide.
3. Write the three biggest differences or problems, most important first.
4. Fix them.
5. Repeat, at most three rounds. Then show the developer before and after.

Also check on every round: can the hero, enemies, hazards and pickups be told apart from the background at a glance?

Software rendering in a headless browser is slow. Frame-rate numbers from it mean nothing; measure performance on real hardware.

## 9. Milestones

In the BMad flow each milestone becomes an epic (`gds-create-epics-and-stories`), and its exit criteria become the epic's acceptance criteria. Stop at the end of each and wait for the developer's approval.

**M0. Reference and style lock.** Repository scaffold. Hero and Emberwood key art in each candidate style. Developer picks. `docs/STYLE_GUIDE.md` written. Then build the shared shaders, palette, lighting rig and look-dev page, and reproduce the chosen look in the engine on a small test scene made of simple shapes.
*Exit:* developer approves the look as rendered in the engine, not only the images.

**M1. Grey-box core.** Simulation with tests, input, camera, level loader, a grey test level, screenshot harness. No art.
*Exit:* every mechanic in section 4 works in tests and feels right to the developer in the browser.

**M2. Hero.** Full pipeline for Rowan, with all animations, in the game.
*Exit:* hero matches the concept in the critic loop and animates cleanly in every state.

**M3. Level 1 vertical slice.** Layout, art kit, three enemy types, pickups, checkpoints, HUD, audio.
*Exit:* a new player finishes level 1 without help; developer approves the look.

**M4. First warden.** One boss with a clear pattern, plus the seal-break moment.

**M5. Levels 2 and 3.** Reuse the pipeline. Version one ends at Harrowmere.

**M6. Wrap.** Menus, saving, settings, performance pass on real devices. Optional desktop build.

## 10. Legal notes

Not legal advice. Get proper advice before selling.

- A cursed hero, a kidnapped partner and a spit attack are common tropes, but together they resemble Toki's outline. Keep every name, character, level, piece of art and sound original. The bargain as the cause of the curse, the horned ember-beast and Elin's active role are what set this story apart.
- A warlock-style bargain with a dark power is far older than Dungeons & Dragons and needs no licence. Avoid anything that game invented.
- The art style of another game is not protected; its characters and scenes are.
- Tool terms differ on commercial use of generated images, models and audio. Check each.

## 11. Open decisions

Settle these while writing the GDD (`gds-gdd`) and record the answers there.

- [ ] Art style
- [ ] Hero design sign-off
- [ ] Ending
- [ ] Stomp: keep or drop
- [ ] Fail rule: hearts and checkpoints, or closer to the arcade
- [ ] Weapon pickup list
- [ ] Permanent abilities per seal
- [ ] Touch controls: yes or no
- [x] Engine and 3D tools: three.js, Tripo, Blender through MCP, Claude models for development
- [ ] Image model and audio tools
- [ ] Level editor: LDtk or Tiled
- [ ] Tool budgets
- [ ] Final title

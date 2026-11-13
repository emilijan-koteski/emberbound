---
title: "Emberbound (working title) - Game Design Document"
game_type: action-platformer
platforms:
  - desktop web browser (keyboard, gamepad)
status: final
created: 2026-11-12
updated: 2026-11-13
inputs:
  - _bmad-output/planning-artifacts/briefs/brief-emberbound-2026-11-12/brief.md
  - _bmad-output/planning-artifacts/briefs/brief-emberbound-2026-11-12/addendum.md
  - docs/PROJECT_BRIEF.md
  - prototype/sprout-demo.html
  - _bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md
---

# Emberbound (working title) - Game Design Document

**Author:** Emilijan
**Game Type:** Action Platformer (2.5D side-scroller, stage-and-boss structure)
**Target Platform(s):** Desktop web browser, keyboard and gamepad

## How to Read This Document

- **Source of truth.** This GDD supersedes the design defaults in `docs/PROJECT_BRIEF.md` (the planning doc). Vision, audience and scope come from the game brief. Decisions and their reasons are in `decision-log.md`; the detailed epic breakdown is in `epics.md`.
- **Units and timing.** Numbers are in tiles and seconds. One tile is one world unit. The game updates 60 times a second, and each update is one "step".
- **Status of numbers.** Unmarked numbers were proven in the Sprout prototype (`prototype/sprout-demo.html`) or decided by the developer. Numbers marked † are starting guesses, tuned with the developer in the epic named. No proven number changes without the developer.
- **Narrative.** The story content lives in the narrative design document (`_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md`): characters, world, every line of story text, environmental storytelling and the seal-break staging. This GDD keeps the rules and decisions that affect play and production.
- **Interface.** The HUD, menus and screens are specified in the UX spines in `_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/`: `EXPERIENCE.md` for behaviour, flows and interface text, `DESIGN.md` for the overlay's look. They are the authority on menu and HUD behaviour. This GDD names only what affects play and production.

---

## Executive Summary

### Core Concept

Emberbound is a short 2.5D side-scrolling action platformer for the desktop browser, set in a dark-fantasy land ruled by the Tithe, a bargain with the Ember Below.

**Premise.**

- Ten years ago Rowan Ashby, a Cindersworn fire-caster, burned the town of Harrowmere with fire from that bargain.
- Now the debt is called. Lord Maldrek, the Tithe-Collector, takes Rowan's bride-to-be Elin, and the bargain turns Rowan into a horned ember-beast who can spit embers.
- Rowan fights to rescue Elin and break his curse. He runs, jumps and spits embers through themed levels to reach the wardens, the bosses who hold the six seals of the bargain.
- Each broken seal makes Rowan visibly more human and gives back one ability.

**Elevator pitch:** a cursed fire-caster spits embers through dark-fantasy levels to break the bargain that took his bride. It is a short, forgiving 2.5D platformer in the spirit of the arcade classics, free in the browser.

**Vision statement:** the arcade platformer you remember, made fair, with a story about paying for what you did.

**Core fantasy:** you are the monster in this story, and every warden you beat burns a little of the monster away.

**Version one:**

- three levels: Emberwood, the Drowned Mill, the ruins of Harrowmere
- one warden, at the end of Level 2
- 20 to 30 minutes long
- free in the browser on itch.io

### What Players Should Feel

- **In the first minutes:** the snap of running, jumping and spitting fire. Movement feel is what holds the first two minutes, so it has to be right before anything else is built.
- **By the end:** a small, earned sense of redemption. Rowan pays for what he did, and Elin is part of how it ends.
- **Version one** ends on the first payment, Rowan walking through the town he burned, and on a sign that Elin is acting on her own.

### Target Audience

- **Primary:** players aged roughly 35 to 55 who grew up on arcade and console platformers.
  - They play in one evening session on a desktop computer.
  - They want to understand the game without a manual, finish it, and not be punished for being out of practice.
- **Secondary:** younger fans of modern platformers such as Celeste and Hollow Knight, who come for tight controls and a hand-made look.
- **Conflicts:** when the two groups want different things, the primary group wins. For example, there is one difficulty setting, tuned to be generous.

### Unique Selling Points (USPs)

1. **Execution is the edge.** Feel, readability and polish set the game apart, not a new mechanic.
2. **Rowan caused his own curse.**
   - In Cuphead, the debt comes from a lost bet.
   - In Wonder Boy: The Dragon's Trap, a dragon puts the curse on the hero.
   - Here the curse is the bill for a choice Rowan made. Version one ends with him walking through the ruins of the town he burned.
3. **The change goes one way, and the ability grows from it.**
   - As in The Dragon's Trap, beating bosses changes the hero's body.
   - Unlike it, Rowan never switches between forms. He only moves toward human.
   - Each ability comes from that change: in version one his claw becomes a human hand, and the hand can grip ledges.
4. **Elin acts in the ending.** She is not a prize waiting at the finish. This pays off in the full game; version one sets it up, and its closing card shows her acting on her own.
5. **Nothing to install.** The game plays free in a browser tab, which matters for an audience that will not install something just to try it.

---

## Goals and Context

### Project Goals

In priority order:

1. Learn game development by hitting real problems.
2. Enjoy the process.
3. Finish something small and polished.
4. Possibly sell a desktop build on Steam later, for $5 or less, but only if the free version finds players.

Small and finished beats large and empty. Scope growth is rejected unless the developer asks for it.

### Background and Rationale

**Structural inspiration.** The structure follows the 1989 arcade game Toki: short stages, a boss per stage, timed weapon pickups, and a run of about 20 minutes. Emberbound drops Toki's punishment: one-hit deaths, a countdown timer and no saves.

**Originality.** Nothing is taken from Toki or from any other game named in this document: no names, characters, levels, scenes, art or sound. Art styles are only a reference.

**Market.**

- Short paid platformers do well only when the price matches the length. The Toki remake at $19.99 was criticised as too short. The Dark Queen of Mortholme, 20 to 40 minutes at €4.99, reviewed well.
- Steam refunds any game played for under 2 hours.
- Most small indie games earn little on Steam or on browser portals. The estimated median 2025 indie Steam release made $347.
- itch.io browser games can take donations only.

Version one is therefore free in the browser. Figures and sources are in the brief's `addendum.md`.

**Team, budget and prototype.**

- One developer, working through Claude Code and the BMad workflows, about 8 to 10 hours a week with no fixed deadline.
- The budget is tool subscriptions only; amounts are not set yet.
- The Sprout prototype proved the movement and camera numbers used throughout this document.

---

## Core Gameplay

### Game Pillars

Every mechanic, level and asset answers to these three pillars. Each pillar has a decision test.

1. **Understood in seconds.**
   - One attack and a handful of moves.
   - Enemies, hazards and pickups stand out from the background.
   - Layout teaches; text does not.
   - *Decision test:* if a player needs a hint box to get past a spot, the spot is wrong.
   - *Steers:*
     - the thorn rule for stomping
     - embers that trace jump arcs
     - one new player tool per level
     - wordless control signs
     - warm light reserved for the hero, embers and lanterns

2. **Arcade heart, modern mercy.**
   - Toki's pace and structure, without its punishment.
   - Hearts, checkpoints and auto-save replace one-hit deaths, the countdown and the lack of saves.
   - *Decision test:* no single failure costs more than about 120 s of replay.
   - *Steers:*
     - the fail rule and the pit rule
     - embers that heal
     - checkpoint spacing
     - ledge grab
     - hitboxes that favour the player
     - a single generous difficulty

3. **The curse shows on the body.**
   - The story reaches the player through what they see and do: Rowan's form, the places he passes through, the moment a seal breaks.
   - Each broken seal is a visible change plus an ability that comes from that change.
   - *Decision test:* a story beat during play is shown, never written. Story text on screen is limited to:
     - the intro
     - one line before each level
     - the closing card
     - the all-bells card

     HUD, menus, results and control icons are not story text.
   - *Steers:*
     - the seal-break moment
     - ledge grab as the hand's ability
     - Rowan's form on replays
     - level themes
     - Harrowmere as the final level of version one

### Core Gameplay Loop

**Moment to moment (seconds).** Serves pillars 1 and 2. Movement feel carries this loop, and it is what holds the first two minutes.

1. Read the screen.
2. Run, jump, spit or stomp.
3. An enemy dies in a burst (a stomp also gets a short hit-stop), or a hazard is cleared.
4. Embers along the path show the way forward and fill the ember meter.
5. Repeat on the next obstacle.

**Per section (60 to 120 s, from one checkpoint to the next).** Serves pillar 2.

1. Clear the stretch.
2. Collect embers, and look for the hidden bell.
3. Reach the next checkpoint, which sets a new respawn point.

The section ends in a calm spot before the next one builds tension.

**Per level (6 to 8 minutes).**

1. Reach the exit, or beat the warden at the end of Level 2.
2. The results screen shows clear time, bells out of 3, respawns and embers. In Level 3 the closing story comes first; see Session flow.
3. The game auto-saves.
4. One line of story introduces the next level.

When the first seal breaks, Rowan changes and gains ledge grab. This serves pillar 3.

**Why play again:** hidden bells, best clear times, and the all-bells story card, all reachable from the level select.

### Win/Loss Conditions

- **Win a level:**
  - Levels 1 and 3: reach the exit.
  - Level 2: defeat the warden.
- **Win version one:** finish Level 3, which shows the closing card. If all 9 bells have been found, the all-bells card follows.
- **No game over.**
  - At 0 hearts, Rowan dies and respawns at the last checkpoint with 3 hearts.
  - Falling into a pit costs 1 heart and returns Rowan to the last stable ground. If that was his last heart, he dies and respawns as above.
- **Respawns.** A respawn is a death that sends Rowan back to a checkpoint; pit returns don't count. Respawns are shown on the results screen but never punished.

---

## Game Mechanics

### Primary Mechanics

| Mechanic | What the player can do | Key numbers | Serves |
| --- | --- | --- | --- |
| Run | Move left and right on the ground and in the air | Speed 7 tiles/s | Loop |
| Jump | Variable-height jump; release early for a short hop | Full jump 3.3 tiles; tap about 0.8 tiles | Pillar 1, loop |
| Ember spit | Rowan's one attack. Holding the button fires repeatedly. | 1 damage, 15 tiles/s, 8.25-tile range, 0.2 s cooldown | Pillar 1, loop |
| Aim | Hold up to aim 45° upward. Hold down in the air to aim 45° downward. | 45° | Pillar 1 |
| Stomp | Land on an enemy without thorns to kill it and bounce | Bounce 11, or 15.5 with jump held | Pillar 1 |
| Crouch | Hold down on the ground to stop and duck | Hurtbox height 0.6 † instead of 0.92 | Loop (counters the spitter) |
| Drop-through | Down + jump on a one-way ledge drops through it | Ledges ignored for 0.22 s | Loop (vertical routes) |
| Ledge grab | From the first seal on: catch a ledge corner, then climb or drop | See Player Abilities and Unlocks | Pillars 2 and 3 |
| Hearts | 3 hearts; every hit costs 1 | 1.3 s of invulnerability after a hit | Pillar 2 |
| Embers | Collectables that fill the ember meter | 50 embers restore 1 heart | Pillars 1 and 2 |
| Weapon pickups | Timed upgrades to the ember spit | Triple shot and piercing shot, 20 s each | Pillar 2 (arcade heart), loop |
| Bells | 3 hidden in each level | All 9 unlock an extra story card | Replay, pillar 3 |
| Checkpoints | Set the respawn point | 3 per level, plus one at the warden's door | Pillar 2 |

Full rules and numbers are in the Action Platformer Specific Elements section and in Progression and Balance.

### Controls and Input

| Action | Keyboard | Gamepad (standard layout) |
| --- | --- | --- |
| Move | A / D, or ← / → | Left stick or d-pad |
| Aim up | Hold W or ↑ | Stick or d-pad up |
| Crouch; aim down in the air | Hold S or ↓ | Stick or d-pad down |
| Jump | Space, Z or K | South face button (A / Cross) |
| Spit (hold to keep firing) | J or X | West face button (X / Square), or east (B / Circle) |
| Drop through a one-way ledge | Down + jump | Down + jump |
| Ledge: climb / let go | Up or jump / down | Up or jump / down |
| Pause | Esc or P | Start |
| Mute | M | None |
| Confirm in menus | Enter or Space | South face button |

**Input rules:**

- A jump or spit press always registers, even a tap shorter than one step.
- A jump pressed up to 0.12 s before landing still fires on landing.
- The stick needs to be pushed 0.35 of the way sideways and 0.5 of the way up or down to count.
- The game pauses automatically when the browser tab is hidden, and in the other cases listed under Platform-Specific Details. Held inputs are cleared, so Rowan stops.
- If the browser refuses gamepad access, the keyboard still works and the game keeps running.
- If the gamepad fails during play, it turns off for the session and the game pauses, as it does for a disconnect. The pause and title menus then show a one-line notice that the gamepad is unavailable and the keyboard still works.
- Key remapping is not in version one. Touch controls are not in version one.

**Teaching the controls:**

- The first time each action is needed, a small sign in the scenery shows the key or button icon for that action, with no words.
- The icon matches the device the player last used, keyboard or gamepad.
- Keyboard signs teach one key set only: the arrow keys, Z to jump and X to spit. The other keys in the table work but are never shown.
- Gamepad signs show button positions, never platform letters, colours or logos. The spit sign shows the west face button.
- There are about 6 signs, all in Level 1: move, jump, spit, aim up, crouch, and drop-through. There are none after Level 1.
- The signs never cover the play area.
- Ledge grab gets no sign; Level 3's layout teaches it.

---

## Action Platformer Specific Elements

### Movement System

**Movement feel table.** Proven in the prototype; retune only with the developer.

| Parameter | Value | Steps at 60 Hz |
| --- | --- | --- |
| Gravity | 40 tiles/s² | None |
| Fall gravity multiplier | 1.35 while falling | None |
| Apex gravity multiplier | 0.55, in the air with jump held and vertical speed between -2.2 and 2.2 tiles/s. It replaces the fall multiplier. | None |
| Max fall speed | 18 tiles/s | None |
| Run speed | 7 tiles/s | None |
| Ground acceleration / deceleration | 70 / 60 tiles/s² | None |
| Turn-around boost | 1.7× | None |
| Air acceleration / deceleration | 40 / 16 tiles/s² | None |
| Jump speed | 16.5 tiles/s | None |
| Full jump | Peaks at 3.30 tiles, about 0.87 s in the air on flat ground (computed from these numbers) | About 52 |
| Tap jump | About 0.8 tiles | None |
| Jump cut on release | 0.45× vertical speed | None |
| Coyote time | 0.10 s | 6 |
| Jump buffer | 0.12 s | 7 |
| Stomp bounce | 11 tiles/s, or 15.5 with jump held | None |
| Hero hitbox | 0.72 wide × 0.92 tall | None |
| Crouched hurtbox | 0.72 wide × 0.6 tall † | None |
| Drop-through window | 0.22 s | 13 |

Durations convert to whole steps by rounding to the nearest step.

**Movement rules:**

- **One-way ledges.** Rowan lands on them only while falling, and only if his feet were above the ledge top a moment earlier. He can jump up through them from below. Ember shots pass through them.
- **Moving platforms.** Rowan can land on them from above only. They carry him as they move, and jumping off keeps the platform's speed. Down + jump on a moving platform is a normal jump, not a drop-through.
- **Waterwheel platforms** (Level 2) are moving platforms on a circular path. They stay level as they turn.
- **Crouch.** Rowan stops in place but can still turn. Only his hurtbox shrinks, to 0.6 tiles; the body that collides with the level stays 0.92 tall, so he can't crawl under gaps. His shots fire from 0.3 tiles high.
- **Not in version one:** double jump, dash, wall jump, swimming.

**Camera:**

- Looks ahead 1.2 tiles in the facing direction, or 2.4 tiles while running.
- In the air, the camera holds still vertically until Rowan moves more than 1.8 tiles below or 2.4 tiles above the framing point. It re-centres when he lands.
- Stops at the level edges.
- Always shows at least 19 × 10.4 tiles in landscape.

### Combat System

**Attacks.** Rowan has one attack, the ember spit, plus the stomp. There are no combos and no melee attack.

| Attack | Rule |
| --- | --- |
| Ember spit | 1 damage. Range 8.25 tiles (15 tiles/s for 0.55 s). 0.2 s cooldown; holding the button fires at that rate. Shots fly straight, without gravity. They stop on solid tiles and pass through one-way ledges and platforms. They leave Rowan 0.42 tiles in front of him, at height 0.48 (0.7 aiming up, 0.3 aiming down or crouched). |
| Stomp | Kills any enemy without thorns or spikes. Counts while Rowan is falling, with a forgiveness of 0.35 tiles below the enemy's top. If a stomp and a contact hit happen in the same step, the stomp wins. |
| Triple shot (pickup) | 3 shots spread ±9° (±0.16 rad) around the aim. Speed, range and cooldown unchanged. 20 s. |
| Piercing shot (pickup) | Double range: 15 tiles/s for 1.1 s †, about 16.5 tiles. Passes through enemies; still stops on solid tiles. 20 s. |

**Pickup rules:**

- Picking up a weapon replaces the current one and starts its timer from 20 s.
- A HUD bar shows the time left, and a warning sound plays at 3 s left †.
- Rowan keeps the pickup through a pit fall and loses it on death.
- Every pickup Rowan has taken, whether used up or lost, goes back in the level when he respawns at a checkpoint.

**Hitbox conventions: hitboxes favour the player.**

| Check | Rule |
| --- | --- |
| An enemy, enemy shot or the warden touches Rowan | Both boxes shrink by 0.08 tiles on each side before the test |
| Rowan's shot hits an enemy | The enemy box grows by 0.12 tiles on each side |
| Spikes | Hurt only when Rowan's feet are in the bottom 0.45 of the spike tile, with the tile narrowed by 0.12 on each side. Spikes are not solid. |
| Thorn rule | An enemy with visible thorns or spikes cannot be stomped; touching it from above hurts. Anything else can be stomped. |

**Damage and recovery:**

| Event | Result |
| --- | --- |
| Hit by an enemy, an enemy shot, the warden or spikes | -1 heart. Knockback 6 tiles/s horizontally, away from the source; 9 tiles/s up from an enemy, 11 from spikes. No horizontal control for 0.28 s (17 steps). 1.3 s (78 steps) of invulnerability, shown by a 9 Hz blink. Hit-stop 0.06 s (4 steps). |
| Falls into a pit, or into deep water in the Drowned Mill | -1 heart. The screen fades for 0.5 s †, then Rowan returns to the last stable ground with 1.3 s of invulnerability. Stable ground means solid ground or a one-way ledge, never a moving platform and never next to a hazard. If it was the last heart, he dies. A pit return is not a respawn. |
| 0 hearts | Death sequence of 0.85 s, then respawn at the last checkpoint with 3 hearts and 1.0 s of invulnerability. Killed enemies stay dead. Collected embers and bells stay collected. |

**Enemy rules:**

- Every enemy's contact damage is 1 heart.
- Enemies attack only while on screen, so Rowan is never hit from off-screen.
- Enemies do not respawn when Rowan dies.
- Enemies do not hurt each other.
- Only an enemy with thorns or spikes has stomp immunity.

**Enemy roster (version one).**

- There are three enemy types in total. Levels 2 and 3 reuse them, coloured by each level's palette and arranged in harder combinations. The warden is the only new enemy after Level 1.
- In the story, enemies are creatures twisted by a bargain made or paid nearby: the land pays too. That is why each level recolours them. No rule changes.
- The names are internal working names. Check them for originality before any appears on screen.

| Enemy | First seen | HP | Movement | Attack | Stomp | Hitbox |
| --- | --- | --- | --- | --- | --- | --- |
| Walker ("grub") | Level 1 | 1 | Patrols at 1.6 tiles/s and falls under gravity. Turns at walls and at ledge edges. | Contact only | Yes | 0.84 × 0.62 |
| Thorn flyer ("burr-wing") | Level 1 | 1 | Follows a fixed path through walls: swings ±0.9 to 1.2 tiles horizontally every 7 s and bobs ±0.22 tiles every 2.7 s | Contact only | No (thorns) | 0.74 × 0.74 |
| Rooted spitter ("pod") | Level 1 | 2 | Stationary; faces Rowan | Swells for 0.5 s, then fires a seed at 5 tiles/s every 2.5 s, while on screen and with Rowan within 10 tiles horizontally †. The seed has a 0.12-tile radius and its centre travels 0.75 tiles above the spitter's ground †, so it covers 0.63 to 0.87: it hits a standing Rowan and passes over a crouching one. It lasts 2 s † and is destroyed by solid tiles or an ember shot. | No (thorned crown) | 0.8 × 1.0 † |

**Hit feedback.**

| Event | Hit-stop | Shake (trauma) | Other |
| --- | --- | --- | --- |
| Stomp | 0.05 s (3 steps) | 0.2 | Bounce |
| Kill with a shot | None | 0.12 | Burst |
| Rowan hurt | 0.06 s (4 steps) | 0.35 | Knockback, blink |
| Rowan dies | None | 0.4 | Fade |

- **Shake** is a trauma level. A new shake raises trauma to its value if it is higher, and never adds to it. The screen moves by up to 2 × trauma² tiles, and trauma falls by 1.6 per second. Shake is off when reduced motion is set.
- An enemy that survives a hit flashes.
- The ember spit has the signature sound.

#### The Warden of the First Seal (Level 2 boss)

*Concept: the Drowned Miller.* Settled in narrative design on 2026-11-13; the full description is in the narrative design document.

- **Who:**
  - Harrowmere's miller. When Rowan burned the town, the grain stopped and the mill was ruined.
  - He bargained that his wheel would never stop. The river rose and drowned the valley, and the mill he loved took him in.
  - Maldrek bound him to hold the first seal.
- **Look:**
  - A hunched miller fused with the great waterwheel, which rises from his back like a shell.
  - Iron cog teeth along his back and shoulders are the spikes that make him unstompable.
  - Water pours from him: pale and cold, with no warm light. His face is tired, not cruel.
- **The seal** is the hub of the great wheel, marked with the Tithe's sign.
- **Fate:** released, not killed. When the seal breaks, the wheel stops for the first time in ten years and he sinks, at rest.
- **The link to Rowan** (his fire caused the ruin) is never stated. Grain sacks marked with Harrowmere's mark, at the door checkpoint, show it to players who look.
- **Name:** "the Drowned Miller" is the working title. His given name (placeholder: Tobin Weir) needs an originality check before it appears on screen.

*Arena and rules:*

- **Arena:** one screen, 19 tiles wide, with a flat floor and two one-way ledges 3 tiles up †.
- **Door:** a checkpoint sits at the door, with a triple shot pickup just before it. The warden stays dormant until Rowan enters the arena, so the checkpoint is safe. The door shuts behind him.
- **Body:** the warden is 3 × 4 tiles † and stands at the arena's right side. Its body is its hurtbox.
- **Health:** 30 HP. Each ember hit does 1 damage, a triple shot can land 3 hits, and the warden can be hit at any time.
- **Health bar:** a HUD bar labelled "The Warden" appears when the door shuts and drops with each hit. A notch at 15 HP marks where phase 2 starts. It empties and fades when the warden falls.
- **Stomp:** the warden has spikes, so it cannot be stomped. Touching its body costs 1 heart.
- **On respawn:** the warden returns to full health when Rowan respawns at the door. A fight of 120 s or less stays within pillar 2's replay limit.
- **Target length:** 60 to 120 s for a first-time player.

*Attacks:*

| Attack | Phase | Warning | Dodge | Numbers † |
| --- | --- | --- | --- | --- |
| Wheel wash: a wave of water sweeps along the floor | 1 and 2 | The wheel spins up and glows, 0.8 s | Jump over it | 1 tile tall, 8 tiles/s across the arena |
| Millstone fall: debris drops from above | 1 and 2 | Shadows mark the floor 0.8 s before impact | Walk out of the marked spots | 1 tile wide each; 3 pieces in phase 1, 5 in phase 2. One lands where Rowan stands when the warning starts, and the rest are at least 2 tiles apart. A 3-tile gap is always left clear. |
| Wheel roll: the warden curls into a wheel and rolls across the arena | 2 only | Rears back and vents steam, 0.6 s | Jump over it | A 2 × 1.5 wheel at 12 tiles/s. It rolls to the far wall, then walks back to its side. |

*Pacing:*

- **Order:**
  - Phase 1 alternates wheel wash and millstone fall.
  - Phase 2 cycles wheel wash, millstone fall, wheel roll.
- **No overlap.** Attacks never run at the same time. The gap before the next attack starts counts from the end of the previous one: 2.5 s † in phase 1, 1.8 s † in phase 2.
- **Phase 2** begins at 15 HP: the warden flinches and the music shifts.
- **Warnings** are never shorter than 0.6 s, and each attack has its own warning sound.

*Seal-break moment:*

- After the warden falls, an in-engine sequence of 15 s or less † plays, with no text.
- The seal at the wheel's hub shatters and the great wheel grinds to a stop. The water stills, and the Miller sinks, at rest.
- One of Rowan's horns breaks, his right claw becomes a human hand, and the ember glow in his chest dims slightly. A flash of embers from his chest covers the change, so no transformation animation is needed.
- The results screen follows, then the Level 3 story line.
- The sequence can be skipped on replays only.
- Beat-by-beat staging, with timings †, is in the narrative design document (Gameplay Integration).

### Level Design Patterns

**Platforming metrics.** These come from the movement feel table, are marked †, and are verified in Epic 1 (in Epic 4 for ledge grab). Every jump in every level is checked as possible by an automated test.

| Element | Standard | Challenge |
| --- | --- | --- |
| Gap at equal height | up to 4 tiles | 5 tiles |
| Step up | 1 tile (short hold); up to 3 tiles (full jump) | None |
| Clear space above a full-jump take-off | at least 5 tiles, unless a ceiling is intended | None |
| Moving platform | at least 3 tiles wide, peak speed 5.3 tiles/s or less | None |
| Vertical spacing of one-way ledges | 3 tiles or less | None |
| Ledge-grab climb (Level 3) | ledge top up to 4 tiles above the take-off ground | None |

A challenge-tier jump is only allowed close to a checkpoint. Each level's share of challenge jumps is capped in Difficulty Curve.

**Teaching pattern.** Each new element follows four steps:

1. Introduce it where failure is cheap (no pit underneath).
2. Let the player practise it once safely.
3. Combine it with something already known.
4. Test it before the next checkpoint.

There is one new player tool per level:

- Level 1: the base moves and the triple shot
- Level 2: the piercing shot
- Level 3: ledge grab

Level features, such as Level 2's waterwheel platforms and the warden, follow the same teaching pattern.

**Combat spaces:**

- Each enemy is visible for at least 1 s before Rowan can reach it at full run speed.
- No enemy sits on the landing spot of a jump the player can't see.
- Spitters stand where the player can choose to crouch, jump or shoot.

**Secrets (bells):**

- Three per level.
- Each is reachable with the abilities Rowan has on first arrival, which are also the abilities he has on replays.
- Each has at least one visual hint: an ember trail leading off the path, a lantern, or a gap in foliage or rubble.
- Lanterns appear only in Emberwood, where people hung them for the wedding. Levels 2 and 3 use ember trails and gaps.
- In the story, the bells are Elin's wedding bells, left along the road as a trail while Maldrek carried her off.
- Good hiding spots:
  - behind foreground scenery
  - above the usual camera view
  - under a drop-through bridge
  - at the end of an optional detour
- No bell sits behind a gamble on a pit.

**Checkpoint cadence:**

- One every 60 to 120 s of first-play time: 3 per level, plus one at the warden's door.
- Each sits on safe ground, with no active enemy within 8 tiles †, and with a safe run-up to whatever comes next.
- Touching a checkpoint sets the respawn point but does not heal.

**Pacing.**

- Each section ends in a calm spot at a checkpoint.
- The hardest section of a level is the last one before the exit or the warden.

**Level gating:**

- Inside a level, progress is linear, left to right with vertical variation. Nothing locks off an area except Level 3's ledge-grab climbs, and Rowan always has ledge grab in Level 3.
- Between levels, finishing level N unlocks level N+1.
- The exit of Level 2 is the warden's arena.

**Readability rules (lessons from the prototype):**

- Pits read as dark.
- Hazards contrast with the ground around them.
- Wherever a level teaches aiming, the line of sight is clear.
- Collectable embers look clearly different from Rowan's ember shots in both shape and motion.
- Control signs never cover the play area.

### Player Abilities and Unlocks

- **From the start:** run, variable jump, ember spit (aim up, and aim down in the air), stomp, crouch, drop-through.
- **Unlocked in version one: ledge grab**, from the first seal at the end of Level 2.
  - **Hand point:** the top of Rowan's hitbox, 0.92 tiles above his feet †.
  - **Grab:** Rowan catches a ledge when:
    - he is in the air, falling or at the top of a jump
    - he is holding toward the wall
    - his hand point comes within 0.3 tiles below the corner of a solid tile †
    - the tile above that corner is empty, with at least 1 tile of headroom
  - **Not grabbable:** one-way ledges, moving platforms and hazard tiles.
  - **While hanging:** Rowan doesn't fall and can't shoot.
    - Up or jump climbs onto the ledge, taking 0.35 s †.
    - Down lets go. He can't grab again for 0.25 s †.
    - A hit knocks him off.
  - **Reach:** a ledge top up to 4 tiles above the take-off ground †, verified in Epic 4.
  - **Animation cost:** hang and climb-up, on top of the base set.
- **Form and abilities on replays.** A replay uses the form and abilities Rowan had on first arrival in that level:
  - Levels 1 and 2: full beast, no ledge grab.
  - Level 3: changed, with ledge grab.

  The ability always matches the body the player sees.
- **Temporary:** triple shot and piercing shot, 20 s each.
- **Synergies:**
  - The triple shot covers high flyers without aiming.
  - The piercing shot clears lines of flyers.
  - A stomp bounce with jump held gives a full-height jump from an enemy's back, which opens routes that start from an enemy.
- **Upgrade paths:** none. Version one has no stat upgrades, no extra hearts and no shop.
- **Later versions:** one ability per remaining seal (five more). None are designed yet.

---

## Progression and Balance

### Player Progression

| Track | Version one |
| --- | --- |
| Body | Stage 1, full beast: Levels 1 and 2. Stage 2, one horn broken and a human hand: after the first seal, in Level 3. Stage 3, mostly human with the embers fading, comes after version one. |
| Ability | Ledge grab, from the first seal |
| Skill | The player learns the moves through each level's teaching order. This is the main progression. |
| Unlocks | Levels in the level select; the all-bells story card |
| Not used | Experience points, stats, upgrades, currency spending |

### Difficulty Curve

There is one difficulty setting, tuned generous. Intensity rises across version one, with a peak at the warden.

| Level | Role | Intensity | Most enemies on screen at once † | Challenge-tier jumps † | First-play respawns † |
| --- | --- | --- | --- | --- | --- |
| 1 Emberwood | Teach every base move and enemy | Low, rising to medium in the last section | 2 | None | 5 or fewer |
| 2 Drowned Mill | Combine; waterwheel platforms; first warden | Medium, peaking at the warden | 3 | Up to 10% | 8 or fewer, warden included |
| 3 Harrowmere | Ledge-grab platforming; mixed enemies; quiet ending | Medium-high, the hardest platforming in version one | 4 | Up to 20% | 8 or fewer |

**Level 1 teaching order.** This extends the prototype, which ran all 15 of the planning doc's beats in this order.

| Section | Beats |
| --- | --- |
| Start to checkpoint 1 | Run on flat ground; small step; tall step that needs a held jump; gap; stompable walkers; low thorn flyer to shoot; high flyer that needs aim-up |
| Checkpoint 1 to 2 | Rooted spitter on flat ground (duck, jump or shoot); moving platform over a pit; one-way ledges to climb |
| Checkpoint 2 to 3 | Spikes on a cliff top; a bridge that must be dropped through; triple shot below it |
| Checkpoint 3 to exit | Mixed enemies, using the triple shot; a calm exit through the empty wedding glade, under its garland arch |

- Control signs appear at the first use of each action.
- Embers trace jump arcs from the first gap onward, and the first ember heal becomes possible by mid-level.
- Bells are spread across sections 2 to 4.

### Economy and Resources

| Resource | Source | Use | Rules |
| --- | --- | --- | --- |
| Hearts | 3 at level start and at every respawn | Absorb hits | No heart pickups and no extra hearts |
| Embers | Placed in the level, about 100 to 150 per level † | Fill the ember meter; 50 embers restore 1 heart | The meter starts at 0 in each level and carries across checkpoints and respawns. At full hearts, a full meter waits and refills the next heart lost. Embers past a full meter only count toward the total. Collected embers stay collected, so each ember heals at most once and there are at most 2 or 3 heals per level. |
| Weapon pickups | 1 or 2 per level, placed before combat-heavy stretches and before the warden | 20 s upgrade to the spit | See Pickup rules in Combat System |
| Bells | 3 hidden per level, 9 in version one | Replay goal; all 9 unlock a story card | Bells found add up across replays. A pickup briefly shows "Bell n of 3" on the HUD, counting this run's bells as the results screen does. There is no lasting bell counter. |

**Ember placement:** about 60% trace intended jump arcs and paths, 25% reward detours, and 15% sit in clusters after hard stretches †.

There is no shop and no score.

---

## Level Design Framework

### Level Types

| Type | Used in | Shape |
| --- | --- | --- |
| Standard level | Levels 1 and 3 | Side-scrolling and linear, left to right, 18 to 24 tiles tall †. 3 checkpoints, 3 bells, an exit marker. In Levels 1 and 3 the marker sits at a story prop: the wedding glade's arch, and the fallen fire bell. |
| Level with warden | Level 2 | A standard level whose exit leads into the one-screen warden arena, with a checkpoint at the door |
| Story moment | Between levels, after the warden, and at Level 3's exit | Intro, one line before each level, the seal-break moment, the held beat at the fallen bell, the closing card, the all-bells card |

**Level length** is a time target: 6 to 8 minutes on a first play. The tile length comes from the pace measured on grey-box Level 1 in Epic 1. The prototype's 146 tiles are the starting point.

### Level Progression

| # | Level | Place and look | New element | Ends with | First-play target |
| --- | --- | --- | --- | --- | --- |
| 1 | Emberwood | Rowan's home forest at dusk: old trees, mossy rock, wooden ledges, lanterns hung for his wedding. He learns his new body. | Base moves, 3 enemies, triple shot, ember meter | Exit under the wedding glade's arch | 6 to 8 min |
| 2 | The Drowned Mill | Marsh and waterwheels. Deep water works like a pit. | Piercing shot; waterwheel platforms | The first warden, then the seal-break moment | 6 to 8 min, plus 1 to 2 min of warden fight |
| 3 | Harrowmere ruins | The town Rowan burned ten years ago. It starts at the old siege line outside the walls, then charred walls, fallen beams, empty streets. | Ledge grab | A last mixed-enemy stretch, then a short calm walk (about 15 to 25 tiles †) to the town's fallen fire bell, the held beat and the closing card. Version one ends here. | 6 to 8 min |
| 4 | Bellspire Pass | Ice and wind | Later | Not in version one | None |
| 5 | The Tithe Road | The way down | Later | Not in version one | None |
| 6 | The Hollow Court | Maldrek, then the pact | Later | Not in version one | None |

**Total time:** about 20 to 26 minutes of play plus story moments, inside the 20 to 30 minute target.

Six seals are held by six wardens. How wardens 2 to 6 map onto Levels 3 to 6 is open; see Open Questions.

**Session flow:**

- **Boot:** a loading screen (the wordmark and a progress bar, no tips) while shared assets load, then a "Click or press any key" gate. The gate's key press or click starts sound and gives the game keyboard focus inside the itch.io page.
- **Title screen:** Continue, Level select, Settings.
  - Continue starts the next unfinished level, or opens the level select once everything is finished.
  - The level select appears after Level 1 is finished.
- **Level select:**
  - Lists the finished levels plus the next unlocked one, each with best clear time and bells found.
  - Any listed level can be played. Replays follow the replay-form rule.
- **Intro:** plays once, on the first Continue of a new save. Skippable.
- **Pause menu:** Resume, Restart level, Settings, Quit to level select. Until the level select unlocks, the last item reads "Quit to title". Restart level and Quit each ask for one confirmation, with Cancel as the default, because leaving mid-level restarts the level.
- **Order at the end of a level:**
  - Levels 1 and 2: the results, then, on a first play, the next level's loading card; a replay returns to the level select. In Level 2 the seal break comes before the results.
  - Level 3: the held beat, the closing card, the all-bells card if earned, then the results. Clear time and respawns arrive after the story lands, not between the bell and the card.
- **Results screen**, after each level:
  - clear time in m:ss.s, not counting pauses or story moments
  - bells found in this run, out of 3
  - respawns
  - embers collected, out of the level total
  - a "New best" tag on the clear time when a replay beats the level's best; never on a first play
- **All-bells card:**
  - Plays after the closing card if all 9 bells have been found by then.
  - If the ninth bell is found on a Level 1 or 2 replay, the card plays after that level's results. On a Level 3 replay it follows the closing card, as above.
  - It can be watched again from the level select.

---

## Story Delivery

**Rules:**

- A short intro: 5 cards, one line each, about 60 s at most, skippable. It plays once, on the first Continue of a new save.
- One line of text before each level, shown with the level's name on its loading card on every load, first play or replay, for at least about 3 s † of reading time. On a replay, confirm skips the rest of the reading time once loading is done. Loading happens behind the card; the 3 s transition limit applies to loading, not to reading.
- No dialogue during play.
- The seal break is shown in the engine without text.
- **The held beat:** at Level 3's exit, the fallen fire bell, control stops for about 3 s † while Rowan stands at the bell. Then the closing card. No text; skippable on replays only.
- **Story moments are safe.** While control is stopped (the seal break, the held beat), Rowan can't be hurt, and enemy attacks already in progress are removed. This is a simulation rule with its own unit test.
- The closing card after Level 3 must deliver two things:
  1. Rowan facing Harrowmere, his first payment for what he did.
  2. A sign that Elin is acting on her own, not waiting.
- The all-bells card, a memory of Elin the bell-maker, appears if all 9 bells are found.
- **Story cards** (intro, closing, all-bells):
  - They are layered paper-cut silhouettes, built in the engine from flat layers in the game's palettes, so the renderer owns their style.
  - Card text is drawn over the art, never baked into it, so the text can change without redrawing.
  - Cards advance on confirm, after a minimum of about 1.5 s † so a double press can't skip one. The closing and all-bells cards can be skipped on replays.
  - On cards only, warm light may also mark Elin and home. Epic 0 confirms this exception, and the card style, on a sample card rendered in the engine. If the exception is refused, the forge glow on cards turns pale and cold.
  - Where the shapes come from (made by hand or generated) is decided in Epic 0, together with the image model, and logged in `docs/ASSETS.md`. About 3 to 5 layers per card †.
- **The text is written.** All of version one's story text and its voice rules are in the narrative design document (Narrative Delivery): 141 words over 5 intro cards, 3 level lines, the closing card and the all-bells card.

**Backstory (summary; the full version is in the narrative design document):**

- Ten years ago Rowan Ashby was a hired fire-caster, one of the Cindersworn. On a lord's order he burned the granary town of Harrowmere to end a siege.
- The fire came from a bargain with the Ember Below, sealed with one line: *I will pay with what I hold dearest when the debt is called.* He had nothing dear then.
- He left that life, hid his past, and fell in love with Elin, a bell-maker.
- On the night before their wedding, the Tithe-Collector, Lord Maldrek, comes to claim the debt and takes Elin.
- Rowan reaches for the old fire to stop him, and the bargain claims him too: horns, cinder skin, a furnace in his chest. The curse leaves one gift: he can spit embers.
- Six seals bind the bargain. Each is held by one of Maldrek's wardens, who were once debtors like Rowan. Each broken seal loosens the curse.

**Terms approved for on-screen use:**

| Idea | Term |
| --- | --- |
| A fire-caster bound by a bargain | Cindersworn |
| The bargain | The Tithe |
| The power Rowan bargained with | The Ember Below |
| The bargain's enforcer, the main villain | Lord Maldrek, the Tithe-Collector |
| The magic | Emberfire |
| The bosses | Wardens of the six seals |

**Full-game ending (not in version one):** decided in narrative design on 2026-11-13. It combines two of the three earlier candidates, "Rowan gives up the fire" and "Elin learns the truth and chooses". The third, a simple win, was dropped because Elin must take part.

- Elin learns that Rowan burned Harrowmere, and rings the bell that breaks the last seal anyway, by her own choice. The Tithe has no hold on her, because she never bargained.
- Rowan gives up the fire as his payment, and becomes human.
- Whether Elin stays with him is her choice; the player never makes it for her. There is one ending, with no branches.
- Version one's closing card points toward it: far below, Elin is making a bell of her own.
- Open for after version one: giving up the fire removes Rowan's only attack, so the final fight needs another way to play.

---

## Art and Audio Direction

### Art Style

**Not locked yet.** In Epic 0, generated reference images in each candidate style are compared, the developer picks one, and the choice is recorded in `docs/STYLE_GUIDE.md`. The setting's tone is dark fantasy whichever style wins.

| Candidate | Look |
| --- | --- |
| Stylised dark fantasy | A cold teal and plum palette, fog, and a pale glow behind trees. Simple flat shapes with soft gradients. Mood of Mandragora, shapes of Prince of Persia: The Lost Crown, restraint of Hollow Knight. |
| Comic illustration | Flat colours, banded shading, dark ink outlines, one dominant colour per level, and painted backdrops behind 3D play. Feel of the 2018 Toki remake. |
| Mix | Comic shading and outlines with the dark-fantasy palette |

**Fixed rules, whatever the style:**

- 3D characters on a 2D play plane, in front of layered backdrops: foreground, play layer, middle distance, far distance.
- **Warm light belongs only to the hero, embers and lanterns.** Rowan, his shots and the collectables are always the warmest things on screen. Lanterns appear only in Emberwood. The story cards may be an exception, pending Epic 0 (see Story Delivery).
- The hero, enemies, hazards and pickups can each be told apart from the background at a glance.
- The look comes from the game, not from the image generator. Every asset takes the game's own look (its materials, its palette per level, its lighting per level) and is judged in the engine against the style guide, not against a newly generated image. The architecture document defines how.

**Hero: Rowan in cursed form:**

- A horned ember-beast, clearly not an ape.
- Upright, with two legs and two arms, about 3 heads tall, with a human-shaped skeleton.
- Readable as a small figure on screen. The features were chosen for that:
  - two bone horns sweeping back
  - a furnace glow in the chest
  - ember-bright eyes
- Charcoal skin with glowing seams, and a torn red woodsman's scarf as his human trace.
- Determined, not monstrous.
- Three stages:
  1. full beast
  2. one horn broken and a human hand
  3. mostly human, with the embers fading

  Version one shows stages 1 and 2.

Design sign-off happens in Epic 0 (concept) and Epic 2 (model).

**Level looks:**

- Emberwood: dusk forest lit by lanterns.
- The Drowned Mill: fog over a marsh, black water and turning wheels.
- Harrowmere: charred ruins, cold and grey. The fire is long dead, so warm light is still reserved for Rowan.

### Audio and Music

**Music:**

- One short, hummable tune per level: an arcade-era melody played on modern instruments.
- The warden fight uses a more intense arrangement of the Level 2 tune, shifting when phase 2 starts.
- The title screen reuses the Level 1 tune.
- Short stingers mark the end of a level, the seal break and the closing card.
- **Elin's motif:** a bell-like phrase of 3 or 4 notes runs through every level tune and the closing-card stinger. The bell pickup sound plays its first notes, so players link the bell, the music and Elin without words.
- In Level 3 the music fades out on the last calm stretch before the fallen bell, leaving only wind until the closing-card stinger.

**Ambience:** one bed per level, under the music.

- Emberwood: dusk forest, wind in the leaves, creaking lanterns.
- The Drowned Mill: lapping water and creaking wheels. The great wheel's rush grows louder as Rowan nears the arena.
- Harrowmere: wind, settling ash and timber creak. No birds and no water.

**Sound effects:**

| Group | Sounds |
| --- | --- |
| Hero | Ember spit (the signature sound, recognisable on its own), jump, landing (only on impacts faster than 9 tiles/s), stomp, hurt, death, falling into a pit, ledge grab, climb |
| Enemies | Hit, death, spitter swell, spitter seed |
| Warden | One distinct warning sound per attack, phase change, defeat |
| World | Ember pickup, heart restored, bell (a clear bell tone, tied to Elin), checkpoint, weapon pickup, weapon running out (3 s left), seal break |
| Interface | Menu move, confirm, back, pause |

**Settings:** music volume and effects volume. Mute is the M key only, not a settings row; a speaker-off icon shows while sound is muted.

**Tools:** generated effects and music are acceptable. The audio tool is not chosen yet. Every audio asset is logged in `docs/ASSETS.md` with its tool and licence.

---

## Technical Specifications

### Performance Requirements

- **Frame rate:** 60 fps sustained in current Chrome, Edge and Firefox.
  - Reference machine: a 2020-era laptop with integrated graphics (Intel Iris Xe class) at 1080p. The developer names the actual test machines before Epic 6.
  - Pass mark: median frame time 16.7 ms or less, and 99th percentile 20 ms or less, over a full Level 1 playthrough.
  - Measured on real hardware. Frame rates from headless screenshot runs don't count.
- **Same game at any refresh rate.** Gameplay behaves the same on 60, 120 and 144 Hz displays, and a slow frame never changes the outcome of a jump.
- **Loading:**
  - Total download 30 MB or less.
  - From page open to first input in 10 s or less on a 50 Mbit/s connection.
  - Level transitions take 3 s or less.
- **Resilience.** If an optional browser feature (gamepad, storage, audio, fullscreen) fails or is refused, that feature turns off and the game keeps running.

### Platform-Specific Details

- **Engine and platform:** three.js on WebGL in a desktop browser, hosted as an HTML5 game on itch.io.
  - itch.io limits: 1,000 files, 500 MB total, 200 MB per file.
  - Free to play; donations only.
- **Supported browsers:** current Chrome, Edge and Firefox. Safari is best-effort.
- **Input:** keyboard; standard gamepads (Xbox and PlayStation layouts as the browser reports them).
- **Screen:**
  - Landscape, with window resizing and fullscreen.
  - 16:9 is the main target.
  - Other aspect ratios show more or less backdrop, never less than 19 × 10.4 tiles of play area.
- **Phones and tablets:** not supported in version one. They show a "best played on desktop with keyboard or gamepad" note instead of the title, with a "Try anyway" link for tablets with a keyboard.
- **Saves:**
  - Progress is stored in the browser on that device and saves automatically after each level.
  - Clearing browser data clears progress. There are no cloud saves.
  - Leaving mid-level restarts that level.
  - If the browser refuses storage, progress is kept in memory for the session, and the title screen says in one line that it won't be saved.
- **Auto-pause** when the tab is hidden, the window loses focus, fullscreen is left during play, or the gamepad disconnects or fails. The game never resumes by itself.
- **Settings:** music volume, effects volume, reduced motion, fullscreen. Mute is the M key only. There is no key remapping in version one.
  - **Reduced motion** turns screen shake off and turns full-screen flashes, such as the seal-break ember flash, into a short fade. It also stops the HUD's last-heart pulse and icon shake. Hit-stop and the invulnerability blink stay, because they carry timing and readability.
  - A new save takes its reduced-motion default from the browser's `prefers-reduced-motion` setting.
- **Language:** English only.
- **Later, not in version one:** a desktop build for Steam.

### Asset Requirements

| Asset | Version one count | Notes |
| --- | --- | --- |
| Hero model | 1 rig, 2 visual stages | Animations: idle, run, jump, fall, land, spit, spit aiming up, spit aiming down, crouch, hurt, death, hang, climb-up (13). Stage 2 reuses the rig and the animations. |
| Enemies | 3 | Walker: move, death. Thorn flyer: move, death. Both have 1 HP, so they need no hurt animation. Spitter: idle, swell and fire, hurt, death. |
| Warden | 1 | Idle, three attacks with their warnings, the roll curl, hurt, phase change, defeat |
| Environment kits | 3 (one per level) | Snap to the tile grid: ground pieces, solid ledges, one-way ledges, moving platforms (waterwheel platforms in Level 2), spikes, props, lanterns (Emberwood only), 3 or 4 backdrop layers. Story props per level are listed in the narrative design document (Environmental Storytelling), for example the wedding glade, the marked grain sacks, the siege camp and the fallen fire bell. |
| Pickups and markers | 6 | Ember, bell, triple shot, piercing shot, checkpoint, exit |
| Interface | 1 set | HUD (hearts, ember meter, weapon timer, bell toast, warden health bar, mute icon), boot loading screen, title gate, title, loading card, pause, confirm dialog, level select, results, settings, phone and tablet note, one-line notices, error panels, story cards, control signs (keyboard and gamepad icons for about 6 actions). Specified in the UX spines. |
| Story art | 7 cards | Intro (5), closing card, all-bells card. Layered silhouettes built in the engine, so no models of Elin, Maldrek or the village are needed. |
| Music and ambience | 3 tunes, a warden arrangement, stingers, 3 ambience beds and the great wheel's loop | See Audio and Music |
| Sound effects | About 30 | See Audio and Music |

**Asset rules:**

- Art dresses a layout that already plays well in grey boxes.
- Art never defines collision.
- The hero and the enemies must deform cleanly when animated. Raw generated meshes are fine only for background props. A character mesh that won't deform cleanly is replaced with a simpler model built by hand.
- Every asset, its tool and its licence are logged in `docs/ASSETS.md`, including whether it was made with AI.
- Credits go on the itch.io page. If an asset's licence requires credit inside the game, a Credits row joins Settings. This is settled once `docs/ASSETS.md` lists every licence.
- Per-asset size budgets are set in the architecture document, within the 30 MB total.

---

## Development Epics

### Epic Structure

Each milestone in the planning doc becomes an epic. An epic starts only after the previous epic's exit criteria are met and the developer approves. Details, scope and draft stories are in `epics.md`.

| Epic | Name | Playable deliverable | Exit criteria |
| --- | --- | --- | --- |
| 0 | Reference and style lock | The chosen look reproduced in the engine on a test scene of simple shapes, shown on the look-dev page | The developer approves the look as rendered in the engine, not only the images |
| 1 | Grey-box core | Level 1's layout in grey boxes with every base mechanic: moves, the three enemies, spikes, hearts, the pit rule, checkpoints, embers, bells, triple shot, hit feedback, control signs, camera, input | Every mechanic works in tests and feels right to the developer in the browser; the grey-box pace is measured |
| 2 | Hero | Rowan (stage 1) with all base animations, playing the grey level | Rowan matches the concept in the critic loop and animates cleanly in every state |
| 3 | Level 1 vertical slice (MVP) | Emberwood start to finish with final art, HUD and audio | At least 4 of 5 (or 3 of 3) first-time testers from the primary audience finish Level 1 without help. A majority want to play Level 2 and can say who Rowan is and what he wants. The developer approves the look. |
| 4 | First warden | The warden in its arena, the seal-break moment, Rowan stage 2, ledge grab, the Level 2 tune and its warden arrangement | A full fight can be won without taking damage, which proves every attack can be dodged. At least 4 of 5 first-time testers win within 5 attempts. Ledge grab passes its tests and feels right to the developer. |
| 5 | Levels 2 and 3 | Version one complete: Level 2 into the warden, Level 3, story cards | A new player finishes version one in 20 to 30 minutes |
| 6 | Wrap and release | Menus, session flow, saving, level select, settings, performance pass, itch.io release | Performance targets met on the reference machines; released on itch.io under the final title |

**Order:** 0 → 1 → 2 → 3 → 4 → 5 → 6. Epic 3 is the MVP. Version one ships at the end of Epic 6.

**The critic loop**, used after every visual change and in every exit criterion that mentions it:

1. Capture screenshots at a fixed list of camera spots, with the game running headless.
2. Compare each screenshot with the reference image and the style guide.
3. Write down the three biggest problems, most important first.
4. Fix them.
5. Repeat, for at most three rounds, then show the developer before and after.

Every round also checks that the hero, enemies, hazards and pickups stand out from the background at a glance.

---

## Success Metrics

### Technical Metrics

- The performance targets in Technical Specifications are met on the reference machines.
- An optional browser feature failing never stops the game.
- Every simulation rule has a unit test.
- Every jump in every level is shown to be possible with the tuning numbers by an automated test.

### Gameplay Metrics

Playtests use 3 to 5 first-time players from the primary audience, watched without help.

| Pillar or goal | Measure |
| --- | --- |
| MVP hypothesis | Epic 3's exit criteria |
| Understood in seconds | No player is stuck for more than 60 s at one spot without understanding what to do. No player asks what a button does after the first 2 minutes. |
| Modern mercy | First-play respawns stay within the targets in Difficulty Curve. No player quits from frustration. |
| The curse shows on the body | After Level 1, players can say who Rowan is and what he wants. After the seal break, players mention the change in Rowan without being prompted. |
| Version one | A first playthrough takes 20 to 30 minutes |
| Learning (project goal 1) | A retrospective at the end of each epic records what was learned |

[NOTE FOR DESIGNER: the brief measures release success by how many players finish. itch.io reports plays but not completions. Before Epic 6, choose one of three: anonymous analytics with a consent prompt; a proxy signal, such as players posting clear times; or no measurement.]

---

## Out of Scope

**Cut from version one:**

- Levels 4 to 6, wardens 2 to 6, Rowan's stage 3, and the full-game ending sequence
- Mid-bosses
- Switching between forms. Rowan only moves toward human.
- Difficulty settings, score and leaderboards
- A countdown timer, lives, game over
- Dialogue during play
- A shop, stat upgrades, extra hearts
- Double jump, dash, wall jump, charged shot, swimming
- More than two weapon pickups
- Non-weapon temporary pickups (shield, speed, jump boost)
- Touch controls and support for phones and tablets
- Key remapping
- Cloud saves
- Localisation; the game is English only

**Deferred until after version one:**

- Levels 4 to 6 and the ending
- Touch controls
- A paid desktop build on Steam ($5 or less), only if the free version finds players

---

## Assumptions and Dependencies

### Dependencies

| Dependency | Needed by | Notes |
| --- | --- | --- |
| Image model for reference art and Tripo's input views | Before Epic 0 starts | Not chosen. Check commercial-use terms and log them in `docs/ASSETS.md`. |
| Art style lock and `docs/STYLE_GUIDE.md` | End of Epic 0 | Chosen from generated references, then reproduced in the engine. Also confirms the silhouette story-card style on a sample card, the cards' warm-light exception, and where the card shapes come from. |
| Hero design sign-off | Epic 0 (concept), Epic 2 (model) | None |
| Level editor | Epic 1, for loading levels | Tiled 1.12.x, chosen 2026-11-13 (game-architecture.md, decision 9) |
| Tripo licence and commercial-use terms | Epic 2 | Log in `docs/ASSETS.md` |
| Audio tools | Epic 3 | Not chosen. Check licence terms. |
| Tool budgets | Epic 0 | Tool subscriptions only; amounts not set |
| Warden name, look and story | Epic 4 art | Done: the Drowned Miller (narrative design, 2026-11-13). His placeholder given name needs an originality check only if it ever appears on screen. |
| Ending decided (`gds-create-narrative`) | Epic 5 (closing card) | Done (narrative design, 2026-11-13). The closing card text is written. |
| Originality check of story names and symbols | Symbols: Epic 4. Names: before any public build or page. | See Originality and Legal Constraints |
| Reference test machines | Epic 6 | See Performance Requirements |
| Final title | Before any public page | "Emberbound" is used by at least six other games. Check trademarks too. |

### Originality and Legal Constraints

This is not legal advice. Get proper advice before selling.

- Every name, character, level, piece of art and sound is original. Nothing comes from Toki or from any game named in this document. Another game's art style is not protected; its characters and scenes are.
- A bargain with a dark power is far older than Dungeons & Dragons and needs no licence, but nothing that Dungeons & Dragons invented is used: no settings, named characters, signature monsters, spell or feature names, or rules text.
- What sets the story apart from Toki's outline:
  - the bargain as the cause of the curse
  - the horned ember-beast
  - Elin's active role
- The licence and commercial-use terms of every tool and asset are checked and logged in `docs/ASSETS.md`, along with which assets are AI-generated.
- The final title is checked against existing games and trademarks before any public page goes up.
- Story names and symbols are checked the same way:
  - **Names:** Rowan Ashby, Elin, Lord Maldrek, Harrowmere, Emberwood, Cindersworn, the Tithe, the Ember Below, Emberfire, the Drowned Mill, the Drowned Miller, Bellspire Pass, the Tithe Road, the Hollow Court, and Tobin Weir (the Miller's placeholder given name, only if it ever appears on screen). Check before any public build or page.
  - **Symbols:** Harrowmere's mark and the Tithe's sign. Check before they are drawn, in Epic 4.

### Risks

| Risk | Mitigation |
| --- | --- |
| Turning AI-generated models into cleanly animated characters. The chain from image to Tripo mesh to Blender rig to animation is new to the developer. | Prove the pipeline on Rowan alone in Epic 2, before any level art. Use a simpler hand-built model as the fallback, for the hero and for enemies. |
| No image model chosen. Epic 0's style lock and Tripo's input views both depend on it. | Choose it before Epic 0 starts. |
| Time and scope. At 8 to 10 hours a week, every extra feature delays the finish. | The MVP is Level 1. Reject scope growth unless the developer asks for it. |
| The story hook depends on visuals. If players don't read the story from Rowan's changes and the places he passes through, it doesn't land. | Epic 3's exit criteria check that players can say who Rowan is and what he wants. |
| Version one runs short of 20 minutes. | Level length is a time target, set from the pace measured in Epic 1 and checked in Epic 5's exit criteria. |
| Name and likeness. "Emberbound" is taken, and the premise resembles Toki's outline. | Pick a new title before any public page. Keep every name and asset original. |

### Assumption Index

None open. The ten assumptions in the first draft were confirmed by the developer on 2026-11-13 and are now decisions (see `decision-log.md`).

### Open Questions

| Question | Decide by |
| --- | --- |
| How to measure release success (the note in Success Metrics) | Before Epic 6 |
| Full-game details left open by narrative design: the final fight once Rowan gives up the fire, what Maldrek owes, whether Elin is ever playable | After version one |
| Which levels hold wardens 2 to 6, and the ability each later seal returns | After version one |
| The open rows under Dependencies | As listed there |

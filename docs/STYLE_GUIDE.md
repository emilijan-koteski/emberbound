---
status: approved
approved: 2026-11-14, by the developer (story 0.5)
created: 2026-11-14
story: _bmad-output/implementation-artifacts/0-5-pick-the-style-and-write-docs-style-guide-md.md
# The 16 overlay colour roles from DESIGN.md (role names unchanged). `make contrast COLORS=docs/STYLE_GUIDE.md`
# checks them. This map holds exactly the 16 roles and nothing else; story 0.14 copies them into DESIGN.md.
colors:
  surface-screen: '#0B1012'
  surface-scrim: '#0B1012BF'
  surface-panel: '#141C1F'
  surface-focus: '#25323A'
  border-subtle: '#35454D'
  text-primary: '#E6EEF0'
  text-muted: '#9FB0B6'
  focus-ring: '#9CCBD2'
  hud-outline: '#0B1012'
  hud-track: '#1E282C'
  heart-fill: '#E4ECEE'
  heart-empty: '#84959B'
  ember: '#F59A3C'
  weapon-timer: '#C2D3DA'
  warden-bar: '#A3B6C0'
  warning: '#FFFFFF'
# The level palettes: the same slots in every level. Story 0.7 copies them into src/render/palettes/.
palettes:
  emberwood:
    skyFar: '#254049'
    skyGlow: '#B0E1E5'
    ridgeFar: '#5C7882'
    treeMid: '#28444D'
    bark: '#4A3A42'
    fog: '#3F5761'
    groundTop: '#335950'
    groundSide: '#2D454F'
    ledgeWood: '#373D3E'
    foliage: '#2E4F49'
    foregroundDark: '#080B0D'
    ink: '#1C1419'
    pit: '#06090B'
    water: '#142229'
    hazard: '#CFC6B6'
    heroSkin: '#545553'
    heroSeam: '#ED5E13'
    heroGlow: '#F6B025'
    heroScarf: '#8B332C'
    heroCloth: '#34393A'
    heroLeather: '#4C3F3F'
    heroHorn: '#C4B198'
    shot: '#FF8F2E'
    ember: '#F59A3C'
    pickupWarm: '#E8742A'
    bell: '#E8C27A'
    checkpoint: '#9ED6D4'
    exit: '#DCE8EA'
    walkerBody: '#5B3A5E'
    walkerAccent: '#A7D47A'
    flyerBody: '#3E2F55'
    flyerAccent: '#CFC6B6'
    spitterBody: '#4A5B2E'
    spitterAccent: '#9EE07A'
    seed: '#C2F07A'
    lantern: '#E0A86A'
  drownedMill:
    skyFar: '#2A3638'
    skyGlow: '#A9BFC0'
    ridgeFar: '#5E6D6E'
    treeMid: '#2F3D3E'
    bark: '#3A3638'
    fog: '#56686A'
    groundTop: '#3A4A40'
    groundSide: '#2B3533'
    ledgeWood: '#3A3F3C'
    foliage: '#34443A'
    foregroundDark: '#090C0C'
    ink: '#151719'
    pit: '#050708'
    water: '#0B1416'
    hazard: '#BDB8AC'
    heroSkin: '#545553'
    heroSeam: '#ED5E13'
    heroGlow: '#F6B025'
    heroScarf: '#8B332C'
    heroCloth: '#34393A'
    heroLeather: '#4C3F3F'
    heroHorn: '#C4B198'
    shot: '#FF8F2E'
    ember: '#F59A3C'
    pickupWarm: '#E8742A'
    bell: '#E8C27A'
    checkpoint: '#9ED6D4'
    exit: '#DCE8EA'
    walkerBody: '#35606A'
    walkerAccent: '#C7E3D0'
    flyerBody: '#2B4560'
    flyerAccent: '#BDB8AC'
    spitterBody: '#2F6A47'
    spitterAccent: '#A9D9A0'
    seed: '#CBE6A8'
    lantern: '#3C4446'
  harrowmere:
    skyFar: '#2B2F36'
    skyGlow: '#A7AFB8'
    ridgeFar: '#5C626B'
    treeMid: '#353A42'
    bark: '#2C2A2D'
    fog: '#6B727A'
    groundTop: '#4D5258'
    groundSide: '#2E3237'
    ledgeWood: '#2A2A2C'
    foliage: '#3D433F'
    foregroundDark: '#0A0B0D'
    ink: '#121317'
    pit: '#050608'
    water: '#0C1014'
    hazard: '#C8CCD0'
    heroSkin: '#545553'
    heroSeam: '#ED5E13'
    heroGlow: '#F6B025'
    heroScarf: '#8B332C'
    heroCloth: '#34393A'
    heroLeather: '#4C3F3F'
    heroHorn: '#C4B198'
    shot: '#FF8F2E'
    ember: '#F59A3C'
    pickupWarm: '#E8742A'
    bell: '#E8C27A'
    checkpoint: '#9ED6D4'
    exit: '#DCE8EA'
    walkerBody: '#6A6390'
    walkerAccent: '#B7C4E8'
    flyerBody: '#4B4570'
    flyerAccent: '#C8CCD0'
    spitterBody: '#3E6E62'
    spitterAccent: '#A9D6C4'
    seed: '#D3DCE8'
    lantern: '#35383D'
---

# Emberbound style guide

**Status:** approved by the developer on 2026-11-14 (story 0.5), with the 13 decisions listed in the story's Dev Agent Record.
**Written:** 2026-11-14, story 0.5.
**Sources:** the six references in `art-src/reference/`, the GDD (Art and Audio Direction), the narrative design (Color and Lighting, Visual Symbolism), the architecture (Rendering), DESIGN.md (Colors, Typography, Shapes).

This is the written look of the game. Every material, asset, card and screen is built from it and judged against it on the look-dev page. A newly generated image is never the reference.

Where a value or rule here is a starting guess to tune with the developer, it carries †.

## 1. The choice

**Style: the mix.** Comic shading and ink outlines, with the dark-fantasy palette: cold teal and plum, fog, and a pale cold glow behind the trees. Chosen by the developer on 2026-11-14.

**His reason:** "The ink keeps Rowan and the hazards readable at a glance, and the cold palette carries the cold-world, warm-hero mood."

**The references it was chosen from:**

| Image | Role |
| --- | --- |
| `art-src/reference/hero-sheet-mix.jpeg` | **The chosen hero sheet.** Rowan's signed-off concept (section 6). |
| `art-src/reference/emberwood-key-art-mix.jpeg` | **The chosen key art.** Emberwood's palette is sampled from it (section 5). |
| `art-src/reference/hero-sheet-dark-fantasy.jpeg`, `hero-sheet-comic.jpeg` | Not chosen; kept as the record of the comparison. |
| `art-src/reference/emberwood-key-art-dark-fantasy.jpeg`, `emberwood-key-art-comic.jpeg` | Not chosen; kept as the record of the comparison. |

**Tone:** dark fantasy. A cold world with one warm light moving through it: Rowan and his fire.

## 2. Rules

### Shading

- **Banded and hard-edged.** Every lit surface takes 3 tones †: lit, mid and shadow. The steps between them are hard, with no soft gradient across a surface.
- **How the tones are made:** mid is the surface's palette slot as it is. Lit is the slot lifted toward the key light's colour (cold teal-white in Emberwood). Shadow is the slot pulled toward the fill colour: plum in Emberwood, teal-grey in the Drowned Mill, blue-grey in Harrowmere (section 2, Lighting). That is where the hero sheet's teal (lit) and plum (shadow) bands come from. How far each tone moves is a material setting †, in `SHADING` (`src/render/materials/shading.ts`): the rig's lights decide **which** tone a surface takes, and the settings decide **what** each tone looks like. The key alone decides which surfaces are lit, so a surface lit only by the fill never takes the key's colour. The key and the fill together decide which fall into shadow: facing away from the key pulls a surface toward shadow, and the fill lifts surfaces near the shadow line back into mid (a surface turned fully away from the key stays in shadow even where the fill reaches it). Lit is lighter than mid and shadow darker, by at least a minimum step † (lit by less only where a colour channel is already near full), so a slot paler than the key or darker than the fill keeps its tones in order. `pit` and `water` take only their mid tone.
- **Nothing carries texture** except the slot regions and simple masks below.
- **Base colours are flat palette regions.** An asset carries slot regions or simple masks; the material maps them to the level's palette. No baked lighting, no photographic texture.
- **Generated textures are stripped or flattened** to slot regions on import, so a model from any tool looks like part of the same game.
- **Glowing parts are unshaded:** Rowan's seams, chest and eyes, his shots, embers, the bell's glint, lantern glass. They draw at full brightness in their slot colour and ignore the bands.
- **No specular highlights, no rim light on surfaces.** The back light from the sky glow is read through the fog and the silhouettes, not through shine.
- **Fog applies to everything by depth,** glowing parts included, so far lanterns dim into the mist.

### Outlines

- **Used.** Ink outlines are part of the style.
- **Drawn by one edge-outline pass over the whole frame** (depth and normal edges), never baked into textures (AR161). Story 0.11 builds it in `src/render/materials/`.
- **Colour:** the level palette's `ink` slot.
- **Width:** about 2 px at 1080 lines †, scaled with the render height so a 720-line window doesn't thicken them.
- **Where:** the foreground, the play layer and the middle distance take lines. The far distance takes none, and lines fade with fog, as in the key art, where the distant trees are soft silhouettes.
- **Glowing parts take lines like any other surface**, so an ember or a shot stays a crisp shape.

### Colour grading

- **None.** There is no grading pass and no vignette pass. The palette, the fog and the dark foreground silhouettes framing the screen make the mood. Colours on screen stay the guide's values, so judging on the look-dev page is direct.
- The foreground framing never covers the play area (AR163).

### Post-processing

- **One pass: the outline.** The budget is 2 passes at most † (architecture, performance budgets), so one stays free.

### Camera

- **Perspective,** with a narrow field of view, about 30° † (AR162). The depth layers get their parallax from the camera; 3D characters keep a little depth. Decided by the developer on 2026-11-14.
- The framing and its margin are locked in story 0.10.

### Shadows

- **Open, decided in story 0.11:** one directional shadow snapped to texel steps, or blob shadows (AR168). Story 0.11 writes the decision here.
- Whatever is chosen, a shadow never lightens a pit.

### Lighting, per level

Colours are palette slots or close to them. Strengths are relative; exact intensities are tuning numbers that story 0.7 puts in data and story 0.12 judges on the test scene.

| | Emberwood | The Drowned Mill | Harrowmere |
| --- | --- | --- | --- |
| **Look** | Dusk forest lit by lanterns | Fog over a marsh, black water, turning wheels | Charred ruins, cold grey ash |
| **Key light** | Cold moonlit teal-white (`skyGlow`), from the upper right and behind; medium | Pale grey-green (`skyGlow`), from overhead, overcast; low | Ash blue-grey (`skyGlow`), from the high left, flat; low to medium |
| **Fill** | Dim plum (`bark`), from the lower left; low | Cold teal-grey (`treeMid`); low | Near-neutral blue-grey (`treeMid`); low |
| **Fog** | Teal (`fog`), from the middle distance back, thickest over pits and the far layer | Grey-teal (`fog`), the densest of the three, starting nearer; a low ground fog over water | Ash grey (`fog`), a medium haze |
| **Warm light allowed** | Rowan, his shots, embers, bells, weapon pickups, **lanterns** | Rowan, his shots, embers, bells, weapon pickups | Rowan, his shots, embers, bells, weapon pickups |
| **Lanterns** | Yes: small warm point lights (`lantern`), short reach †, lighting only the ledge or trunk they hang from | None | None |

- Rowan and his fire family (section 3) may carry a small warm point light, reaching about 1 to 2 tiles †. **Decided by the developer on 2026-11-14 (story 0.9):** Rowan and his shots carry a real warm light; embers, bells and weapon pickups glow but light nothing. Each light has a hard edge at its reach and lights only the surfaces that face it (`src/render/lighting/fireLights.ts`). **Rowan's own light doesn't light Rowan** (decided on the look-dev page, 2026-11-14): a light at his skin paints a hard stripe on him. Story 2.7 applies it to his model and picks how; lanterns may still warm him.
- No warm light ever reaches into a pit.

## 3. Warm light

- **Warm light belongs only to Rowan, the embers and the lanterns.** In that rule, and wherever the planning documents say "the embers" in a warm list, it means **Rowan's fire family: his shots, the collectables (embers and bells) and the weapon pickups.**
- **Rowan and his fire family are the warmest things on screen,** as a group (NFR28; the developer's decision at code review, 2026-11-14). Nothing outside the family is as warm. There is no required order inside the family: a shot may be more saturated than Rowan's seams.
- **The collectables are the embers and the bells.** Bells are warm brass, part of the fire family, as the developer decided on 2026-11-14: NFR28 names collectables among the warmest things on screen, so NR15's in-play list ("Rowan, embers and lanterns") is read to include them. The HUD's bell icon stays neutral (DESIGN.md).
- **Weapon pickups look warm,** part of Rowan's palette (NR103).
- **Lanterns appear only in Emberwood** (NR101). They are warm, but less saturated than Rowan's glow, his shots and the collectables, so he stays the warmest thing on screen.
- **Warmth fades across version one** (NR100): most in Emberwood (the lanterns, home); almost none in the Drowned Mill; none in Harrowmere but Rowan and his fire family, the coldest place in the game. Rowan's own glow dims at the seal break; in Harrowmere he and his fire family are still the warmest things on screen.
- **Pits and deep water read as dark** (NR102, NFR29). `pit` is the darkest slot in every palette and `water` is among the darkest (check 4 states it exactly), and story lighting never overrides that.
- **Enemies recolour per level by palette swap,** with no rule change (NR104). They are never warm.
- **The hero, enemies, hazards and pickups can each be told from the background at a glance** (NFR27). Every critic-loop round checks it.

**What counts as warm** (a working definition, so tests have one): a colour is warm when its HSL hue is from 330° through 360° to 70° and its saturation is at least 25 %. Both ends are inclusive, and the values are computed from the hex without rounding.

**What the numbers do and don't rank:** HSL saturation is used only for the lantern check below. How warm things look on screen also depends on light, glow strength and fog, so "the warmest things on screen" is judged by eye on critic-loop screenshots, not by a palette test.

**Checks on the palettes** (story 0.7 can test these):

1. Outside Rowan's slots (`hero…`), the fire family (`shot`, `ember`, `pickupWarm`, `bell`) and Emberwood's `lantern`, no slot is warm. Rowan's `heroScarf` and `heroHorn` are warm colours on surfaces, not lights.
2. Emberwood's `lantern` is less saturated than each of `heroSeam`, `heroGlow`, `shot`, `ember`, `pickupWarm` and `bell`.
3. In the Drowned Mill and Harrowmere, `lantern` is not warm (no lantern appears there; the slot exists so every palette has every slot).
4. `pit` is the darkest slot in each palette (relative luminance), and `water` is darker than every slot but `pit`, `foregroundDark` and `ink`.

Measured on the values below, 2026-11-14: all four pass. Lantern saturation is 65.6 %, against 70.5 % (`bell`) to 100 % for the six fire-family and glow slots. The margin is under 5 points: if tuning closes it, the lantern gives way, never the fire family.

**Near the warm line:** Emberwood's `hazard` and `flyerAccent` (`#CFC6B6`, hue 38°, saturation 20.7 %) sit 4.3 points under it; the developer kept the value at code review (2026-11-14). Story 0.12 judges whether the spikes read apart from Rowan's horns (`heroHorn` `#C4B198`), and any tuning keeps them under 25 %.

## 4. How assets are judged

- Every asset takes the game's own materials, its level's palette and its level's lighting (NFR33). No asset ships its own lighting model or colours.
- Every asset is judged **on the look-dev page, in the engine, against this guide** (PR23). Never against a newly generated image.
- The references above chose the direction once. After this guide, they are evidence of the choice, not the standard.
- This guide names no other game, studio or artist as a reference.

## 5. Palettes

The same 36 slots in every level, so a level swap and an enemy recolour are data changes only. These are the **level** palettes; the story palettes for scenes outside the levels have their own slot list (section 8), and the checks in section 3 apply to the level palettes only. The values are also in this file's frontmatter (`palettes:`), which story 0.7 copies into `src/render/palettes/`.

**Emberwood** was sampled from `emberwood-key-art-mix.jpeg` (2752 × 1536) and `hero-sheet-mix.jpeg` (1792 × 2400) with ImageMagick: the average of a flat region (crop `W×H+X+Y` in the image's pixels), or a cluster from a 4- to 14-colour quantise of a region. "Chosen" means the slot isn't in the key art (enemies, pickups, markers) or a rule changed the sampled value.

**The Drowned Mill and Harrowmere are derived** from Emberwood under the level looks and the warmth rule; no key art exists for them. They are judged on the test scene in story 0.12.

| Slot | Used for | Emberwood | Source (Emberwood) | Drowned Mill | Harrowmere |
| --- | --- | --- | --- | --- | --- |
| `skyFar` | Sky, the far layer's ground colour | `#254049` | key art, `80x80+2120+120` | `#2A3638` | `#2B2F36` |
| `skyGlow` | The pale cold glow behind the trees; the key light's colour | `#B0E1E5` | key art, `100x100+1800+550` | `#A9BFC0` | `#A7AFB8` |
| `ridgeFar` | Distant ridges and far trees | `#5C7882` | key art, `40x120+2310+360` | `#5E6D6E` | `#5C626B` |
| `treeMid` | Middle-distance trees, ruins, wheels | `#28444D` | key art, `40x120+2160+410` | `#2F3D3E` | `#353A42` |
| `bark` | Trunks and roots on the play layer; Emberwood's fill | `#4A3A42` | chosen: the key art's plum bark, between its highlight `#847A78` and shadow `#1E1C21` clusters | `#3A3638` | `#2C2A2D` |
| `fog` | Fog colour | `#3F5761` | key art, `120x80+1700+1320` | `#56686A` | `#6B727A` |
| `groundTop` | The walkable top of ground and ledges (moss, grass, ash) | `#335950` | key art, `80x30+1560+1100` | `#3A4A40` | `#4D5258` |
| `groundSide` | Rock faces under the top | `#2D454F` | key art, `80x40+1560+1005` | `#2B3533` | `#2E3237` |
| `ledgeWood` | Wooden ledges, platforms, scaffolds | `#373D3E` | key art, `200x8+900+537` | `#3A3F3C` | `#2A2A2C` |
| `foliage` | Play-layer plants and moss | `#2E4F49` | key art, `120x35+1460+1122` | `#34443A` | `#3D433F` |
| `foregroundDark` | Foreground silhouettes framing the screen | `#080B0D` | key art, `120x120+260+1300` | `#090C0C` | `#0A0B0D` |
| `ink` | The outline pass's colour | `#1C1419` | hero sheet, darkest cluster | `#151719` | `#121317` |
| `pit` | Pits; the darkest value | `#06090B` | key art, `160x80+1420+1210` | `#050708` | `#050608` |
| `water` | Deep water (the Drowned Mill); dark everywhere | `#142229` | chosen (no water in Emberwood) | `#0B1416` | `#0C1014` |
| `hazard` | Spikes; thorns | `#CFC6B6` | chosen: pale bone, cold enough to fail the warm test | `#BDB8AC` | `#C8CCD0` |
| `heroSkin` | Rowan's skin | `#545553` | hero sheet, cluster | same | same |
| `heroSeam` | Rowan's glowing seams | `#ED5E13` | hero sheet, cluster | same | same |
| `heroGlow` | Rowan's chest furnace core and eyes | `#F6B025` | hero sheet, cluster | same | same |
| `heroScarf` | The red scarf | `#8B332C` | hero sheet, cluster; flat crop `10x10+1050+1050` agrees | same | same |
| `heroCloth` | Trousers | `#34393A` | hero sheet, `80x100+700+1560` | same | same |
| `heroLeather` | Belt | `#4C3F3F` | hero sheet, cluster | same | same |
| `heroHorn` | Horns, claws | `#C4B198` | hero sheet, horn region cluster | same | same |
| `shot` | Ember spit in flight | `#FF8F2E` | chosen: hotter than the seams, in Rowan's family | same | same |
| `ember` | Ember collectable; the overlay's `ember` | `#F59A3C` | chosen, between the seams and the glow | same | same |
| `pickupWarm` | Triple and piercing shot pickups | `#E8742A` | chosen, Rowan's family (NR103) | same | same |
| `bell` | Bell collectable: warm brass | `#E8C27A` | chosen (section 3) | same | same |
| `checkpoint` | Checkpoint marker | `#9ED6D4` | chosen: cold teal, never warm | same | same |
| `exit` | Exit marker | `#DCE8EA` | chosen: pale cold white | same | same |
| `walkerBody` | Walker body | `#5B3A5E` | chosen: plum-violet | `#35606A` | `#6A6390` |
| `walkerAccent` | Walker accent | `#A7D47A` | chosen: sickly green | `#C7E3D0` | `#B7C4E8` |
| `flyerBody` | Thorn flyer body | `#3E2F55` | chosen: deep violet | `#2B4560` | `#4B4570` |
| `flyerAccent` | Thorn flyer thorns | `#CFC6B6` | chosen: the `hazard` value, since thorns hurt | `#BDB8AC` | `#C8CCD0` |
| `spitterBody` | Rooted spitter body | `#4A5B2E` | chosen: dark olive | `#2F6A47` | `#3E6E62` |
| `spitterAccent` | Rooted spitter accent | `#9EE07A` | chosen | `#A9D9A0` | `#A9D6C4` |
| `seed` | Spitter seeds | `#C2F07A` | chosen | `#CBE6A8` | `#D3DCE8` |
| `lantern` | Lantern glass and light | `#E0A86A` | key art, lantern glow cluster `#F5A95B`, desaturated so Rowan stays warmest | `#3C4446` (unlit) | `#35383D` (unlit) |

**Per level, in one line each:**

- **Emberwood:** cold teal and plum, with lantern warmth. Its one dominant colour is teal.
- **The Drowned Mill:** greyer and greener, more fog, black water. Its one dominant colour is grey-teal.
- **Harrowmere:** ash blue-grey, low saturation, the coldest. Its one dominant colour is ash grey.

## 6. Rowan

**Signed off by the developer on 2026-11-14, as drawn**, from `art-src/reference/hero-sheet-mix.jpeg`. That sheet is the concept Epic 2 models from: model what it shows.

**The design (FR210, as the sheet shows it):**

- A horned ember-beast, clearly not an ape: a human face, upright, two legs and two arms, a human-shaped skeleton.
- Two bone horns (`heroHorn`).
- A furnace glow in the chest (`heroGlow`, `heroSeam`) and ember-bright eyes (`heroGlow`).
- Slate charcoal skin (`heroSkin`) with glowing seams (`heroSeam`). The teal and plum on his skin are the shading bands, not his colour.
- A torn red woodsman's scarf (`heroScarf`), his human trace.
- Determined, not monstrous: a scowl.
- Readable as a small figure on screen.

**Additions the developer made (story 0.4):**

- Worn, dark woodsman's trousers, torn at the knees and shins (`heroCloth`), with a belt (`heroLeather`).
- Bare clawed feet.

**On the sheet, not asked for, kept by the developer on 2026-11-14:** pointed ears.

**Where the sheet differs from the original wording, kept as drawn** (so Epic 2 doesn't "fix" them). FR210 was updated to match on 2026-11-14 (`sprint-change-proposal-2026-11-14-style-lock.md`); the left column is the wording before that:

| FR210 said, before 2026-11-14 | The sheet shows, and the model follows |
| --- | --- |
| About 3 heads tall | About 4 heads tall (measured on the sheet, scalp to soles: about 1,110 px for a 280 px head at 1000 px width) |
| Two bone horns sweeping back | Two horns that don't match: his left (viewer's right) sweeps out and back; his right (viewer's left) curls up into a hook |
| Not stated | Heavy arms, the hands reaching mid-thigh |

**Stage 2** (Epic 4; not drawn here): one horn broken, the human right hand, a dimmer chest glow. Which horn breaks is decided in Epic 4. The palette doesn't change; the dimmer glow is a material change.

## 7. Enemies

- Twisted creatures: the land paying for bargains. Each place twists them in its own colours (NR104).
- **Emberwood:** plum and violet bodies with sickly green accents.
- **The Drowned Mill:** drowned blue-teal bodies with pale weed-green accents.
- **Harrowmere:** ash-violet bodies with icy blue accents.
- The thorn flyer's thorns always take the level's `hazard` value: thorns hurt, so they look like spikes.
- Never warm. Each body is chosen to stand apart from its level's ground and foliage; story 0.12's test scene judges it.

## 8. Story cards

- **Layered paper-cut silhouettes,** built in the engine (`render/cards/cardScene.ts`, an orthographic camera) from flat layers in the game's palettes, about 3 to 5 layers per card † (NR14, FR164).
- **Fitted to the mix:** each layer is one flat fill with clean cut edges. The front layer is the darkest, near the level's `ink`; the back layers step lighter and foggier, so depth comes from value and fog, as in the levels. The card scene takes no outline pass: its front layer already reads as ink.
- **Text** is drawn over the art in the DOM overlay, never baked in (FR165): one line on a `surface-scrim` band (DESIGN.md, `card-text`).
- **Open, decided on story 0.13's sample card (intro card 2):**
  - **The cards' warm-light exception** (FR167, NR15): whether warm light on cards may also mark Elin and home. If refused, the forge glow on cards turns pale and cold. In play, warm light stays as section 3 says, either way.
  - **Where the card shapes come from:** made by hand or generated (PR25), logged in `docs/ASSETS.md`.
  - **The story palettes** for scenes outside the levels, the village and the hollow chamber (`render/palettes/story.ts`): story 0.13 adds them here, with **their own slot list** (home, forge and so on), separate from the 36 level slots, so a warm `home` or `forge` slot never has to exist in a level palette.

## 9. The overlay

The overlay (HUD, menus, cards' text, notices) stays quiet, neutral and cool, so it never competes with the play area for warmth. DESIGN.md keeps its role names and takes these values in story 0.14, through `gds-ux` Update.

### Colours

The neutrals are DESIGN.md's greys tinted toward the levels' slate teal (hue about 190° to 200°). `ember` is copied from the `ember` palette slot and is the only warm value (UX-DR3).

| Role | Value | Reason |
| --- | --- | --- |
| `surface-screen` | `#0B1012` | Near-black slate teal: the opaque ground |
| `surface-scrim` | `#0B1012BF` | The same at 75 %, as DESIGN.md intends |
| `surface-panel` | `#141C1F` | One step up from the screen |
| `surface-focus` | `#25323A` | The focused row, cool |
| `border-subtle` | `#35454D` | Hairline and tracks |
| `text-primary` | `#E6EEF0` | Cool white |
| `text-muted` | `#9FB0B6` | Cool grey, readable on panels |
| `focus-ring` | `#9CCBD2` | Pale cold teal, close to `checkpoint`; never warm |
| `hud-outline` | `#0B1012` | The ring and its shadow: the overlay's ink |
| `hud-track` | `#1E282C` | The empty part of bars |
| `heart-fill` | `#E4ECEE` | Pale cool white; never warm |
| `heart-empty` | `#84959B` | Lost heart stroke |
| `ember` | `#F59A3C` | The `ember` palette slot; the only warm value |
| `weapon-timer` | `#C2D3DA` | Pale cool grey-blue |
| `warden-bar` | `#A3B6C0` | Cold steel |
| `warning` | `#FFFFFF` | The blink, unchanged |

Warm check (section 3's definition), 2026-11-14: only `ember` is warm (hue 30°, saturation 90 %); every other role has a hue of 188° to 203°, or no saturation.

### Contrast, re-measured

Measured with `make contrast COLORS=docs/STYLE_GUIDE.md` (story 0.3's check: WCAG 2.x relative luminance; the scrim composited over white as the worst case) on 2026-11-14. Every target is met.

| Pair | Target | Measured |
| --- | --- | --- |
| `text-primary` on `surface-panel` / `surface-screen` / `surface-focus` | ≥ 4.5:1 | 14.68 / 16.27 / 11.18 |
| `text-muted` on `surface-panel` / `surface-screen` / `surface-focus` | ≥ 4.5:1 | 7.69 / 8.53 / 5.86 |
| `text-primary` on `surface-scrim` over white | ≥ 4.5:1 | 7.37 (`text-muted` measures 3.86, hence its "never" rule) |
| HUD text (`text-primary`) against its `hud-outline` ring | ≥ 4.5:1 | 16.27 |
| "New best" tag: `surface-panel` on `text-primary` | ≥ 4.5:1 | 14.68 |
| `focus-ring` against `surface-panel` / `surface-focus` / `surface-screen` | ≥ 3:1 | 9.77 / 7.44 / 10.83 |
| Slider fill: `text-muted` on `border-subtle` | ≥ 3:1 | 4.43 |
| HUD fills on `hud-track`: heart-fill, ember, weapon-timer, warden-bar, warning | ≥ 3:1 | 12.56 / 6.85 / 9.76 / 7.17 / 15.05 |
| `heart-empty` on `hud-track` | ≥ 3:1 | 4.84 |
| HUD fills against `hud-outline`: heart-fill, ember, weapon-timer, warden-bar, warning, heart-empty | ≥ 3:1 | 15.98 / 8.72 / 12.41 / 9.12 / 19.14 / 6.15 |

### Typefaces

Two faces cover the three roles: Source Sans 3's digits are tabular by default, so it serves both UI and numeric (UX-DR7). Chosen by the developer on 2026-11-14.

| Role | Face | Tokens and weights | File to ship (story 0.8) | Size |
| --- | --- | --- | --- | --- |
| Display | **Alegreya** (Juan Pablo del Peral, Huerta Tipográfica), version 2.009 | `display-xl` 700, `display-lg` 600, `display-body` 400 | The Latin subset, static: `latin-400-normal`, `latin-600-normal`, `latin-700-normal` `.woff2`, from the npm package `@fontsource/alegreya@5.3.0`, `files/alegreya-latin-{400,600,700}-normal.woff2` (byte-identical to Fontsource's CDN files measured first) | 22,884 + 24,448 + 24,352 = 71,684 bytes |
| UI and numeric | **Source Sans 3** (Paul D. Hunt, Adobe), release 3.052R | `ui-lg` 500, `ui-md` 400, `ui-sm` 500, `numeric-lg` 600, `numeric-md` 500 | Adobe's unmodified variable file `SourceSans3VF-Upright.ttf.woff2` (`wght` 200 to 900), from the `adobe-fonts/source-sans` release; shipped as `source-sans-3-vf-upright.woff2`, renamed only | 170,188 bytes |
| **Total** | | | | **241,872 bytes (0.24 MB), within 0.3 MB** |

**Licences**, read on 2026-11-14:

- Alegreya: <https://raw.githubusercontent.com/google/fonts/main/ofl/alegreya/OFL.txt>; source <https://github.com/huertatipografica/Alegreya>; files <https://fontsource.org/fonts/alegreya> (Fontsource lists OFL-1.1).
- Source Sans 3: the licence that ships is Adobe's own, at the release tag: <https://raw.githubusercontent.com/adobe-fonts/source-sans/3.052R/LICENSE.md> ("Copyright 2010-2022 Adobe, with Reserved Font Name 'Source'", SIL OFL 1.1). Files: <https://github.com/adobe-fonts/source-sans/releases> (release 3.052R, 4 April 2023); the font's name table reads "© 2023 Adobe, with Reserved Font Name 'Source'". Google's copy (<https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/OFL.txt>, "2010-2020") has the same terms.

What they say:

- **Alegreya:** SIL Open Font License 1.1, "Copyright 2011 The Alegreya Project Authors". No Reserved Font Name, so a subset may keep the name. Self-hosting, embedding and commercial use are allowed; the font may not be sold by itself.
- **Source Sans 3:** SIL Open Font License 1.1, "Copyright 2010-2020 Adobe, with Reserved Font Name 'Source'". Self-hosting, embedding and commercial use are allowed. **Because "Source" is reserved, a subset or other modified file may not be called Source Sans.** That is why the file to ship is Adobe's own, unmodified. Fontsource's Latin subset (47 KB for three weights) is not used: whether its name is allowed is unclear.
- **Both:** the OFL asks that the copyright notice and the licence travel with the font. Story 0.8 ships both licences beside the files in `public/assets/fonts/` under distinct names, `OFL-alegreya.txt` (from the Alegreya repository) and `OFL-source-sans-3.txt` (Adobe's `LICENSE.md` at 3.052R), since one flat folder can't hold two `OFL.txt` files. They count toward the fonts budget, about 4.4 KB each and flags it for Epic 6's credits.

**Coverage**, checked with fontTools 4.60.1 (a scratch tool, not a project dependency) on the files above: every character the version-one text uses is present. That is A to Z, a to z, 0 to 9, space and `. , ? : - ' ’ “ ” –`, taken from the narrative design's Story Text Script and EXPERIENCE.md's strings. Digits: Alegreya has `tnum`; Source Sans 3's default digits are all one width, so `tabular-nums` changes nothing and times never shift.

**Fallbacks for DESIGN.md (story 0.14):** Alegreya, then `Georgia, serif`; Source Sans 3, then `system-ui, sans-serif`. The typography tokens' weights don't change.

**Use:** the display face is for the wordmark, level names and card lines only. Every menu, label, notice and number is in Source Sans 3.

### HUD icons

- Single-colour silhouettes readable at `hud-icon-sm`: heart, bell, triple shot, piercing shot, speaker-off (UX-DR11).
- **The ink outline in the overlay is the `hud-outline` ring.** Icons take no separate ink stroke of their own; the ring DESIGN.md already puts around every HUD element is the mix's ink line.
- **The triple and piercing shot differ by outline shape, never by colour alone:** the triple shot is a three-pronged spread; the piercing shot is one long, narrow spike.
- **Panels keep DESIGN.md's `border-subtle` hairline,** with no ink edge, so the menus stay quiet.
- Shapes are drawn with the mix's cut: flat fills, a little hand-made unevenness at the edges, no gradients.

### Wordmark

- **"Emberbound"** (working title) in `display-xl`, **Alegreya 700**, letter-spacing `0.02em` (the token's), in `text-primary` (UX-DR61).
- No glow and no ember colour: warm stays for embers.
- Centred in the upper third, on boot, the title gate and the device note; also on the title menu (story 0.14 adds it to DESIGN.md). It changes after the Epic 6 name check.

### Title backdrop (built in Epic 6)

- **An Emberwood dusk scene in the engine,** built from the Emberwood kit and backdrops with the Emberwood palette, its lighting rig and the outline pass. Never a generated image.
- **What it shows:** the forest edge below the village at dusk, where Level 1 begins: misty trees, a far ridge, the cold foundry chimney in the far layer, a few lanterns and drifting embers. Whether Rowan stands in it is decided in Epic 6.
- **Composed for the wordmark:** the upper third stays dark and quiet (fog and sky) so the wordmark reads. Text over the art follows the `card-text` band rule (DESIGN.md, `title-gate-prompt`).
- **Motion:** a still camera; embers drift and lanterns sway slightly. With reduced motion, embers still drift slowly and nothing else moves †.

## 10. Open items and who closes them

| Item | Closed by |
| --- | --- |
| Shadows: snapped directional or blob | Story 0.11 |
| The outline pass's exact width and edge thresholds | Story 0.11 |
| The camera's field of view and framing margin | Story 0.10 |
| The cards' warm-light exception; the card-shape source; the story palettes | Story 0.13 |
| DESIGN.md takes the overlay colours, faces and fallbacks | Story 0.14 |
| The derived palettes, the enemy colours and the warmth fall-off, judged in the engine | Story 0.12 |
| Which horn breaks at stage 2 | Epic 4 |
| Whether Rowan appears on the title backdrop | Epic 6 |

---
name: Emberbound
description: 'Visual identity of the DOM overlay (HUD, menus, cards, notices) for Emberbound (working title), a 2.5D dark-fantasy platformer for the desktop browser. Quiet, neutral chrome; warm colour only for embers.'
status: final
created: 2026-11-13
updated: 2026-11-13
sources:
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/gdd.md
  - _bmad-output/planning-artifacts/gdds/gdd-emberbound-2026-11-12/epics.md
  - _bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md
  - docs/PROJECT_BRIEF.md
# [PROVISIONAL] Every colour value, every fontFamily and every size below is a grey placeholder (D1).
# When and how they are replaced is stated once, in the Colors section (Value lifecycle, F9). Token
# names (roles) never change, `ember` stays the only warm value (D2), and every contrast target holds.
colors:
  surface-screen: '#0E0F11'
  surface-scrim: '#0E0F11BF'
  surface-panel: '#18191C'
  surface-focus: '#2B2E33'
  border-subtle: '#3A3D43'
  text-primary: '#ECECEC'
  text-muted: '#A3A6AB'
  focus-ring: '#AEBBC9'
  hud-outline: '#0E0F11'
  hud-track: '#232529'
  heart-fill: '#E6E6E6'
  heart-empty: '#8E9196'
  ember: '#E8902E'
  weapon-timer: '#C8CED6'
  warden-bar: '#A9B3BD'
  warning: '#FFFFFF'
typography:
  display-xl: { fontFamily: 'system-ui, sans-serif', fontSize: 'calc(var(--tile) * 0.9)', fontWeight: '700', lineHeight: '1.1', letterSpacing: '0.02em' }
  display-lg: { fontFamily: 'system-ui, sans-serif', fontSize: 'max(24px, calc(var(--tile) * 0.5))', fontWeight: '600', lineHeight: '1.2' }
  display-body: { fontFamily: 'system-ui, sans-serif', fontSize: 'max(16px, calc(var(--tile) * 0.3))', fontWeight: '400', lineHeight: '1.4' }
  ui-lg: { fontFamily: 'system-ui, sans-serif', fontSize: 'max(16px, calc(var(--tile) * 0.28))', fontWeight: '500', lineHeight: '1.3' }
  ui-md: { fontFamily: 'system-ui, sans-serif', fontSize: 'max(14px, calc(var(--tile) * 0.22))', fontWeight: '400', lineHeight: '1.35' }
  ui-sm: { fontFamily: 'system-ui, sans-serif', fontSize: 'max(13px, calc(var(--tile) * 0.18))', fontWeight: '500', lineHeight: '1.3', letterSpacing: '0.02em' }
  numeric-lg: { fontFamily: 'system-ui, sans-serif', fontSize: 'max(18px, calc(var(--tile) * 0.36))', fontWeight: '600', lineHeight: '1.2', note: 'tabular figures (font-variant-numeric: tabular-nums)' }
  numeric-md: { fontFamily: 'system-ui, sans-serif', fontSize: 'max(14px, calc(var(--tile) * 0.22))', fontWeight: '500', lineHeight: '1.3', note: 'tabular figures (font-variant-numeric: tabular-nums)' }
rounded:
  none: '0'
  sm: 'max(2px, calc(var(--tile) * 0.04))'
  full: 9999px
spacing:
  tile: 'min(100vw / 19, 100vh / 10.4)'  # formula only: ui/overlay.ts sets --tile at runtime from the logical view in sim/config.ts (M3); never hard-coded in CSS
  '1': 'calc(var(--tile) * 0.05)'
  '2': 'calc(var(--tile) * 0.1)'
  '3': 'calc(var(--tile) * 0.15)'
  '4': 'calc(var(--tile) * 0.25)'
  '5': 'calc(var(--tile) * 0.4)'
  '6': 'calc(var(--tile) * 0.6)'
  safe-margin: 'calc(var(--tile) * 0.25)'
  hud-icon: 'calc(var(--tile) * 0.34)'  # about 23 px at the 1280 × 720 embed; Epic 3 critic loop checks heart legibility with the 35–55 audience before raising it
  hud-icon-sm: 'calc(var(--tile) * 0.24)'
  hud-bar-length: 'calc(var(--tile) * 1.12)'
  hud-bar-thickness: 'max(4px, calc(var(--tile) * 0.09))'
  hud-outline: 'max(1.5px, calc(var(--tile) * 0.02))'
  bar-long: 'calc(var(--tile) * 6)'
  focus-ring: 'max(2px, calc(var(--tile) * 0.03))'
  menu-item-height: 'max(36px, calc(var(--tile) * 0.5))'
  panel-width: 'min(90vw, calc(var(--tile) * 7))'
  text-measure: 'calc(var(--tile) * 11)'
components:
  hud-hearts: { fill: '{colors.heart-fill}', empty-stroke: '{colors.heart-empty}', empty-interior: '{colors.hud-track}', outline: '{colors.hud-outline}', outline-width: '{spacing.hud-outline}', size: '{spacing.hud-icon}', gap: '{spacing.1}' }
  hud-ember-meter: { fill: '{colors.ember}', track: '{colors.hud-track}', outline: '{colors.hud-outline}', length: '{spacing.hud-bar-length}', thickness: '{spacing.hud-bar-thickness}', rounded: '{rounded.none}', gap-above: '{spacing.2}', glow: '{colors.ember}', glow-blur: '{spacing.3}' }
  hud-weapon-timer: { fill: '{colors.weapon-timer}', blink: '{colors.warning}', track: '{colors.hud-track}', outline: '{colors.hud-outline}', icon-size: '{spacing.hud-icon-sm}', length: '{spacing.hud-bar-length}', thickness: '{spacing.hud-bar-thickness}', rounded: '{rounded.none}', offset: '{spacing.4}', icon-gap: '{spacing.2}' }
  hud-bell-toast: { text: '{colors.text-primary}', type: '{typography.ui-sm}', icon-size: '{spacing.hud-icon-sm}', outline: '{colors.hud-outline}', offset: '{spacing.4}', icon-gap: '{spacing.2}' }
  hud-mute-indicator: { icon: '{colors.text-primary}', outline: '{colors.hud-outline}', size: '{spacing.hud-icon}', inset: '{spacing.safe-margin}' }
  hud-warden-bar: { fill: '{colors.warden-bar}', track: '{colors.hud-track}', notch: '{colors.hud-outline}', notch-overhang: '{spacing.1}', outline: '{colors.hud-outline}', label: '{colors.text-primary}', label-type: '{typography.ui-sm}', label-gap: '{spacing.2}', length: '{spacing.bar-long}', thickness: '{spacing.hud-bar-thickness}', rounded: '{rounded.none}' }
  menu-item: { text: '{colors.text-primary}', type: '{typography.ui-lg}', height: '{spacing.menu-item-height}', focus-fill: '{colors.surface-focus}', focus-ring: '{colors.focus-ring}', focus-ring-width: '{spacing.focus-ring}', rounded: '{rounded.sm}' }
  panel: { fill: '{colors.surface-panel}', border: '{colors.border-subtle}', width: '{spacing.panel-width}', padding: '{spacing.5}', rounded: '{rounded.sm}' }
  scrim: { fill: '{colors.surface-scrim}' }
  slider: { label-type: '{typography.ui-md}', track: '{colors.border-subtle}', fill: '{colors.text-muted}', thumb: '{colors.text-primary}', value-type: '{typography.numeric-md}', thumb-rounded: '{rounded.full}' }
  toggle: { label-type: '{typography.ui-md}', state-text: '{colors.text-primary}', track-off: '{colors.border-subtle}', track-on: '{colors.text-muted}', knob: '{colors.text-primary}', rounded: '{rounded.full}' }
  confirm-dialog: { fill: '{colors.surface-panel}', border: '{colors.border-subtle}', prompt-type: '{typography.ui-lg}', text: '{colors.text-primary}', padding: '{spacing.5}', rounded: '{rounded.sm}' }
  results-stat: { label: '{colors.text-muted}', label-type: '{typography.ui-md}', value: '{colors.text-primary}', value-type: '{typography.numeric-lg}', tag-fill: '{colors.text-primary}', tag-text: '{colors.surface-panel}', tag-type: '{typography.ui-sm}', tag-rounded: '{rounded.sm}', row-gap: '{spacing.3}', action-gap: '{spacing.5}' }
  level-select-row: { name-type: '{typography.ui-lg}', time: '{colors.text-muted}', time-type: '{typography.numeric-md}', bell-found: '{colors.text-primary}', bell-missing: '{colors.text-muted}', bell-size: '{spacing.hud-icon-sm}', bell-gap: '{spacing.1}', padding-inline: '{spacing.4}', row-gap: '{spacing.2}', group-gap: '{spacing.5}', focus-fill: '{colors.surface-focus}', focus-ring: '{colors.focus-ring}' }
  card-text: { text: '{colors.text-primary}', type: '{typography.display-body}', band: '{colors.surface-scrim}', measure: '{spacing.text-measure}', hint: '{colors.text-muted}', hint-size: '{spacing.hud-icon-sm}', hint-inset: '{spacing.safe-margin}' }
  loading-card: { ground: '{colors.surface-screen}', text: '{colors.text-primary}', name-type: '{typography.display-lg}', line-type: '{typography.display-body}', measure: '{spacing.text-measure}' }
  title-gate-prompt: { text: '{colors.text-primary}', type: '{typography.ui-md}', wordmark-type: '{typography.display-xl}' }
  boot-loading-bar: { ground: '{colors.surface-screen}', wordmark-type: '{typography.display-xl}', track: '{colors.hud-track}', fill: '{colors.text-muted}', length: '{spacing.bar-long}', thickness: '{spacing.1}' }
  notice-line: { text: '{colors.text-muted}', type: '{typography.ui-md}' }
  error-panel: { fill: '{colors.surface-panel}', border: '{colors.border-subtle}', text: '{colors.text-primary}', type: '{typography.ui-lg}', rounded: '{rounded.sm}' }
  device-note: { ground: '{colors.surface-screen}', text: '{colors.text-primary}', type: '{typography.ui-lg}', link-type: '{typography.ui-md}', wordmark-type: '{typography.display-xl}' }
  control-glyphs: { lit: '{colors.text-primary}', unlit: '{colors.text-muted}', dom-size: '{spacing.hud-icon-sm}' }
---

# DESIGN.md — Emberbound

## Brand & Style

Dark fantasy, hand-made, understood in seconds (pillar 1, gdd.md:130). The world carries the mood: a dusk forest hung with lanterns, fog over black water, cold grey ruins, and one warm light moving through them, Rowan and his embers. The overlay stays out of its way. It is quiet, neutral and cool, small at the edges of the screen, and never competes with the play area for warmth or attention. Every HUD element is a counted shape or a length, so it reads at a glance without reading.

The style itself is not chosen here. Final colours and faces come from `docs/STYLE_GUIDE.md` at Epic 0 and reach this file through `gds-ux` Update (Colors › Value lifecycle, F9; the renderer owns the style, CLAUDE.md). Until then the values are greys on purpose, so the spines and mocks can be built and contrast-checked without guessing at the final look. Behaviour lives in `EXPERIENCE.md`; D-, F-, A-, Q- and M-numbers refer to `.decision-log.md` in this folder. Layout mocks live in `mockups/`; where a mock and the spines disagree, the spines win.

## Colors

**[PROVISIONAL].** The hex values are neutral greys plus one warm value, chosen so the placeholder HUD can be built and contrast-checked.

**Value lifecycle (F9):**

1. Epic 0: `docs/STYLE_GUIDE.md` records values for the 16 roles below and the 3 typefaces (licence checked, Typography), and re-measures the contrast table.
2. This file is then updated through `gds-ux` Update.
3. Every later epic reads the tokens, so Epic 1's placeholder HUD already gets the Epic 0 values (Epic 0 closes before Epic 1 starts); the provisional greys survive only in git history.
4. Epic 3's final HUD (epics.md › Epic 3 › final HUD) is where the values are judged in play, on the critic-loop screenshots.

**Rules for the Epic 0 values:**

1. Roles stay, values change. Components and CSS read role tokens, never raw hex.
2. `ember` stays the only warm colour in the overlay (D2, extending gdd.md:709). Hearts, bells, timer, warden bar and focus stay neutral or cool.
3. Every target in the contrast table must still hold.
4. Values may be copied from the renderer's palette slots, but the overlay keeps its own CSS custom properties: `ui/` may not import `render/` (game-architecture.md:1174).
5. Tokens become CSS custom properties named `--{group}-{name}`, for example `--colors-surface-scrim`. The 8-digit hex on `surface-scrim` is intentional (75 % alpha). `--tile` is not emitted from tokens; `overlay.ts` sets it (Layout & Spacing).

| Token | Provisional | Role | Never used for |
| --- | --- | --- | --- |
| `surface-screen` | `#0E0F11` | Opaque ground: boot, device note, loading card | Over the play area |
| `surface-scrim` | `#0E0F11BF` (75 %) | Dims the world under menus; band behind card text | Carrying muted text |
| `surface-panel` | `#18191C` | Menus, dialogs, results, level select, error panels | HUD |
| `surface-focus` | `#2B2E33` | Fill of the focused row | Anything not focused |
| `border-subtle` | `#3A3D43` | Panel hairline, slider track, toggle off-track | Text |
| `text-primary` | `#ECECEC` | Labels, values, menu items, card text, HUD text | — |
| `text-muted` | `#A3A6AB` | Secondary labels, best times, notices, missing bells | Text on the scrim or over art |
| `focus-ring` | `#AEBBC9` | Focus indicator (cool, D2) | Decoration |
| `hud-outline` | `#0E0F11` | Ring and soft shadow on every HUD element; warden-bar notch | Fills |
| `hud-track` | `#232529` | Empty part of HUD bars; interior of lost hearts | Panels |
| `heart-fill` | `#E6E6E6` | Filled heart | Anything warm |
| `heart-empty` | `#8E9196` | Stroke of a lost heart | Fills |
| `ember` | `#E8902E` | Ember meter fill, ember-to-heart transfer, full-meter glow | Anything that is not an ember |
| `weapon-timer` | `#C8CED6` | Weapon timer fill | Warnings |
| `warden-bar` | `#A9B3BD` | Warden health fill | Rowan's state |
| `warning` | `#FFFFFF` | Weapon-timer blink state | Large areas |

**Contrast targets.** Ratios are WCAG 2.x relative luminance, measured on the provisional values; the scrim is composited over a white backdrop as the worst case.

| Pair | Target | Provisional |
| --- | --- | --- |
| `text-primary` on `surface-panel` / `surface-screen` / `surface-focus` | ≥ 4.5:1 | 14.9 / 16.2 / 11.5 |
| `text-muted` on `surface-panel` / `surface-screen` / `surface-focus` | ≥ 4.5:1 | 7.2 / 7.9 / 5.6 |
| `text-primary` on `surface-scrim` over white | ≥ 4.5:1 | 7.4 (`text-muted` fails at 3.6, hence its rule) |
| HUD text (`text-primary`) against its `hud-outline` ring | ≥ 4.5:1 | 16.2 |
| "New best" tag: `surface-panel` on `text-primary` | ≥ 4.5:1 | 14.9 |
| `focus-ring` against `surface-panel` / `surface-focus` / `surface-screen` | ≥ 3:1 | 9.0 / 7.0 / 9.8 |
| Slider fill: `text-muted` on `border-subtle` | ≥ 3:1 | 4.5 |
| HUD fills on `hud-track`: heart-fill, ember, weapon-timer, warden-bar, warning | ≥ 3:1 | 12.3 / 6.2 / 9.7 / 7.2 / 15.4 |
| `heart-empty` on `hud-track` | ≥ 3:1 | 4.9 |
| HUD fills against `hud-outline` | ≥ 3:1 | 6.1 to 19.2 |

**HUD backing treatment.** No plate behind the HUD: a plate would cover play. Every HUD element instead gets an opaque `hud-outline` ring `{spacing.hud-outline}` wide plus a soft shadow of the same colour with a `{spacing.1}` blur, and every bar sits in an opaque `hud-track`. HUD text takes the same ring around each glyph. The light fill separates the element from dark backdrops; the dark ring separates it from bright ones. Checked by eye on the critic-loop screenshots at each level's brightest and busiest spot.

## Typography

Three roles (D3). All tokens use `system-ui, sans-serif` until Epic 0 picks the faces; sizes are provisional too.

| Role | Tokens | Used by |
| --- | --- | --- |
| Display | `display-xl`, `display-lg`, `display-body` | Title wordmark; level name on the loading card; card text and the loading-card line |
| UI | `ui-lg`, `ui-md`, `ui-sm` | Menu items, labels, notices, toast, warden label |
| Numeric | `numeric-lg`, `numeric-md` | Clear time, counts, best times, slider values |

- Constraints for the Epic 0 choice (D3): self-hosted `.woff2` in `public/assets/fonts/`, OFL or an equivalent licence recorded in `docs/ASSETS.md`, all faces and weights together ≤ 0.3 MB (game-architecture.md:536, 571). English only, so Latin plus the punctuation the story text uses.
- Numeric uses tabular figures so times and counts never shift width. If the chosen UI face has no tabular figures, the numeric role gets its own face within the same budget.
- Sizes scale with `--tile` and stop at a pixel floor, so text stays legible in a small embed.
- The wordmark "Emberbound" is a working title (gdd.md:2); it changes after the Epic 6 name check.

## Layout & Spacing

- **The tile unit.** `--tile` is the on-screen size of one world tile when the renderer frames the 19 × 10.4-tile play box (game-architecture.md:438-439). `ui/overlay.ts` sets it on the overlay root at runtime from the logical-view size in `sim/config.ts`, a value `ui/` may import (game-architecture.md:1174), using the formula in `{spacing.tile}`; CSS never hard-codes it (M3). Every overlay size is a multiple of it, so the HUD keeps the same proportion to the world at any window size (D5). About 101 px at 1920 × 1080 and 67 px at 1280 × 720. This assumes the renderer fits the box exactly on the limiting axis; if the Epic 0 camera adds margin, the value `overlay.ts` reads must include it, since `ui/` cannot import `render/`.
- **Safe margin.** Every anchored element sits `{spacing.safe-margin}` in from the viewport edge.
- **HUD anchors** ([mockups/key-hud.html](mockups/key-hud.html)):
  - Top-left cluster (D4): hearts `{spacing.1}` apart; ember meter `{spacing.2}` below them; weapon timer `{spacing.4}` right of the meter and centred on its line, its icon `{spacing.2}` before its bar.
  - Bell toast on the hearts row, `{spacing.4}` right of the last heart, icon `{spacing.2}` before the text.
  - Mute indicator top-right (D7). Warden bar top-centre, its label centred `{spacing.2}` above the bar.
  - Anchors follow the viewport, so on wide screens the HUD sits over the extra backdrop. The cluster is at most about 3 × 0.75 tiles with a weapon active; nothing sits in the middle or bottom of the screen during play.
- **Menus.** One centred column inside a `panel` of `{spacing.panel-width}`. Scale `{spacing.1}` to `{spacing.6}`; rows are `{spacing.menu-item-height}` tall at least, which also serves as the mouse target.
- **Wordmark.** Centred, in the upper third of the screen, `{typography.display-xl}`, on boot, the title gate and the device note. Provisional until the Epic 0 title art.
- **Text measure.** Card text and loading-card lines wrap at `{spacing.text-measure}`. Card-text placement is fixed on the Epic 0 sample card (intro card 2, epics.md › Epic 0 › sample story card) and reused on every card.

## Elevation & Depth

Depth is tone and order, not shadow. Bottom to top:

1. Canvas: the world or the card scene. Pit and death fades darken the canvas, under the HUD.
2. HUD layer.
3. `scrim`: over the world for pause, settings opened from pause, results and error panels. After Level 3 the results scrim dims the last card scene instead.
4. `hud-mute-indicator`: drawn by the overlay root above every scrim, the error panel's included, not in the HUD layer (M6). It sits top-right, clear of every centred panel.
5. `panel`.
6. `confirm-dialog`: the only surface that stacks on a panel, one level deep.
7. `error-panel`: topmost.

Panels separate from the scrim by tone (`surface-panel` against a dimmed world) and a `border-subtle` hairline. No drop shadows on panels; the HUD's outline shadow and the ember meter's waiting glow are the only blurs in the overlay.

## Shapes

- `{rounded.sm}` on panels, menu items, dialogs and the "New best" tag. `{rounded.full}` on slider thumbs and toggles. `{rounded.none}` on HUD bars: square ends make length read as a measure.
- HUD icons (heart, bell, triple shot, piercing shot, speaker-off) are single-colour silhouettes, readable at `{spacing.hud-icon-sm}`. Triple and piercing differ by outline shape, never by colour alone (D18).
- If Epic 0 picks the comic style, panel edges and icons may take its ink outline. The tokens above stay; only values change.

## Components

| Component | Anatomy and tokens | Visual states |
| --- | --- | --- |
| `hud-hearts` | Three hearts in a row, `{spacing.hud-icon}`, `{spacing.1}` apart. Filled: `{colors.heart-fill}`. Lost: same outline drawn in `{colors.heart-empty}` around a `{colors.hud-track}` interior, so the maximum always shows. | Full; lost; cracking (hit); popping (restored); last heart pulsing by scale, no colour change. |
| `hud-ember-meter` | Bar `{spacing.2}` under the hearts, `{spacing.hud-bar-length}` by `{spacing.hud-bar-thickness}`, as long as the heart row. `{colors.ember}` fill grows left to right, 0 to 50, in `{colors.hud-track}`. The only warm element in the overlay. | Filling; full and waiting (steady `{colors.ember}` glow, `{spacing.3}` blur, no pulse; a secondary cue, since length carries the signal, so a faint glow on bright backdrops is acceptable; state strip in [key-hud](mockups/key-hud.html)); transfer (fill drains toward the restored heart). |
| `hud-weapon-timer` | Weapon icon (`{spacing.hud-icon-sm}`) and, `{spacing.2}` after it, a bar the meter's size; placed `{spacing.4}` right of the ember meter, centred on its line. `{colors.weapon-timer}` fill drains right to left. | Active; warning (fill alternates `{colors.warning}` and empty track); absent. |
| `hud-bell-toast` | Bell icon `{spacing.hud-icon-sm}` and, `{spacing.2}` after it, "Bell 2 of 3" in `{typography.ui-sm}` `{colors.text-primary}`; on the hearts row, `{spacing.4}` right of the last heart. `{colors.hud-outline}` ring on glyph and text, no plate. | Fading in; holding; fading out. |
| `hud-mute-indicator` | Speaker-off icon, `{spacing.hud-icon}`, `{colors.text-primary}` with outline ring, top-right, `{spacing.safe-margin}` in. Owned by the overlay root and drawn above the scrim (M6). | Shown; hidden. No animation. |
| `hud-warden-bar` | Label "The Warden" in `{typography.ui-sm}`, centred `{spacing.2}` above a `{spacing.bar-long}` bar, `{spacing.hud-bar-thickness}` thick. `{colors.warden-bar}` fill in `{colors.hud-track}`. A `{colors.hud-outline}` notch at the half mark overhangs the bar by `{spacing.1}` above and below, with the `hud-outline` ring, so it stays visible after the fill crosses it. [key-hud](mockups/key-hud.html) frame B predates the overhang. | Fading in; full; draining; empty and fading out. |
| `menu-item` | Centred text row, `{typography.ui-lg}`, `{colors.text-primary}`, at least `{spacing.menu-item-height}` tall. | Rest: no fill. Focused: `{colors.surface-focus}` fill and a `{spacing.focus-ring}` ring in `{colors.focus-ring}`. No disabled state exists. |
| `panel` | `{colors.surface-panel}`, `border-subtle` hairline, `{rounded.sm}`, `{spacing.5}` padding, centred. | Fading in; shown; fading out. |
| `scrim` | Full viewport `{colors.surface-scrim}`. | Fading in; shown; fading out. |
| `slider` | Label left in `{typography.ui-md}`; thin `{colors.border-subtle}` track with `{colors.text-muted}` fill; `{colors.text-primary}` thumb; value right in `{typography.numeric-md}`. | Rest; focused (ring around the row). |
| `toggle` | Label left; state text ("On" / "Off") right, beside a switch whose knob position shows the state. Track `{colors.border-subtle}` off, `{colors.text-muted}` on. | Off; on; focused (ring around the row). |
| `confirm-dialog` | Smaller panel over the pause panel: one prompt line in `{typography.ui-lg}`, then two stacked `menu-item`s (action, Cancel). | Shown with Cancel focused. |
| `results-stat` | Label left in `{typography.ui-md}` `{colors.text-muted}`; value right in `{typography.numeric-lg}` `{colors.text-primary}`; rows `{spacing.3}` apart, `{spacing.5}` before Continue. "New best" tag directly after the "Clear time" label, so all values keep one right edge: `{typography.ui-sm}`, `{colors.surface-panel}` text on `{colors.text-primary}`. Respawns look exactly like every other row. [key-results](mockups/key-results.html); its frame B puts the tag after the value, superseded. | Hidden (before its stagger slot); shown. |
| `level-select-row` | Name in `{typography.ui-lg}`, then best time in `{typography.numeric-md}` `{colors.text-muted}`, then three bell slots `{spacing.hud-icon-sm}`, `{spacing.1}` apart: found = filled bell in `{colors.text-primary}`, not found = outline bell in `{colors.text-muted}`. `{spacing.4}` inner padding; rows `{spacing.2}` apart. Panel order: level rows, the rewatch variant ("All-bells card", label only), then Back, each group set apart by `{spacing.5}`. Ground: the title ground (`{colors.surface-screen}` until the title backdrop exists). [key-level-select](mockups/key-level-select.html). | Rest; focused (as `menu-item`). |
| `card-text` | One line, `{typography.display-body}`, `{colors.text-primary}`, wrapped at `{spacing.text-measure}`, on a `{colors.surface-scrim}` band over the card art; the band's extent is judged per card on the look-dev page. Advance hint: the confirm glyph from `control-glyphs`, `{spacing.hud-icon-sm}`, `{colors.text-muted}`, on the scrim band at its lower right, inset `{spacing.2}`; it never sits on bare art. The same hint appears on the `loading-card` when a replay can skip. | Fading in; shown; advance hint shown. |
| `loading-card` | `{colors.surface-screen}` ground; level name centred in `{typography.display-lg}`; its line below in `{typography.display-body}`. Same on every load, first play or replay (F10). | Shown; fading out. |
| `title-gate-prompt` | "Click or press any key" in `{typography.ui-md}` under the wordmark (`{typography.display-xl}`), on `{colors.surface-screen}` until the title backdrop exists; over art it takes the `card-text` band rule. | Shown; fading out on input. |
| `boot-loading-bar` | `{colors.surface-screen}` ground; wordmark; below it a `{spacing.bar-long}` bar, `{spacing.1}` thick, `{colors.text-muted}` fill in `{colors.hud-track}`. No text, no percentage, no tips. | Filling; fading out. |
| `notice-line` | One line in `{typography.ui-md}` `{colors.text-muted}` under the menu it belongs to, only on a panel or `{colors.surface-screen}`. No icon, no colour coding. | Shown; hidden. |
| `error-panel` | `panel` on a scrim with one line in `{typography.ui-lg}` and one focused `menu-item`. Two variants: bug, retry. | Shown. |
| `device-note` | Full `{colors.surface-screen}`; wordmark; note in `{typography.ui-lg}`; "Try anyway" as an underlined text link in `{typography.ui-md}`. | Rest; link focused (ring). |
| `control-glyphs` | Icon set in `public/assets/icons/`, `icon-` prefix (`icon-gamepad-south.*`, game-architecture.md:1129). Keyboard: a keycap outline with its legend. Gamepad: position glyphs (F3), a diamond of four circles with the one to press filled and the rest outlined; sticks and d-pad as a direction glyph. Monochrome, no platform letters, colours, shapes or logos. In the world, the sign's colour and light come from `render/`; in the DOM, lit `{colors.text-primary}`, unlit `{colors.text-muted}` at `{spacing.hud-icon-sm}`. | Keyboard set; gamepad set. |

## Do's and Don'ts

| Do | Don't |
| --- | --- |
| Keep the chrome neutral or cool; `ember` only for embers | Warm accents on focus, hearts, bells or buttons |
| Count with shapes and measure with length | Persistent numbers, a clock or a score on the HUD |
| Ring every HUD element with `hud-outline` | Plates, vignettes or edge tints over the play area (D6) |
| Read every colour from a role token | Raw hex in screen CSS; importing render palettes into `ui/` |
| Tabular figures for every number | Proportional digits that jitter as values change |
| Text on a panel, the screen ground or a scrim band. Over art, only HUD text (bell toast, warden label) with the `hud-outline` ring, and card text on the scrim band | Muted text on the scrim; any other text straight over art |
| Fades between screens | Slides, bounces, large-area flashes faster than 3 per second |
| Neutral position glyphs | Platform letters, button colours or logos |
| Judge the overlay on the look-dev page against the style guide | Judging it against a newly generated image |

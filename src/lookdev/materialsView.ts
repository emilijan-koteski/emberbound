// The materials view (story 0.9, AC14–AC18): every factory on a box, a sphere, a plane and a capsule,
// one row per factory, under the picked level's palette and rig; the recolour strip, the fog sample
// and the warm samples; beside the rows, each slot's tones, the chosen key art, the rig, a level
// picker that switches in place, and the renderer statistics.
//
// Page chrome (lookdev.css), not the overlay. lookdev/ may not import three.js, so the 3D scene is
// built in render/lookdevScenes.ts and the page places its labels from the scene's layout().
import keyArtUrl from '../../art-src/reference/emberwood-key-art-mix.jpeg?url';
import type { LevelPaletteSlot } from '../core/paletteSlots.ts';
import { createMaterialsLookdevScene, MATERIALS_ROWS } from '../render/lookdevScenes.ts';
import type { MaterialsLayout, MaterialsRow } from '../render/lookdevScenes.ts';
import { slotToneHexes } from '../render/materials/tones.ts';
import { createRenderer } from '../render/renderer.ts';
import type { LookdevMountOptions, LookdevViewHandle } from './assetBrowser.ts';
import { LEVEL_LOOKS, levelLookOrThrow } from './levelLooks.ts';
import type { LevelLook } from './levelLooks.ts';
import { buildLevelPicker, replaceLevelInUrl } from './levelPicker.ts';
import { buildStatsPanel } from './rendererView.ts';

/** Refresh the statistics every this many frames, as the renderer view does. */
const STATS_EVERY_FRAMES = 15;
const DEFAULT_LEVEL = 'emberwood';
const TONES = ['lit', 'mid', 'shadow'] as const;

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function chip(hex: string): HTMLElement {
  const node = element('span', 'lookdev-materials-chip');
  node.style.backgroundColor = hex;
  return node;
}

/** One tone: a chip and its hex, marked for the look-dev check. */
function swatch(
  level: LevelLook,
  slot: LevelPaletteSlot,
  tone: (typeof TONES)[number],
  hex: string,
  caption: string,
): HTMLElement {
  const node = element('span', 'lookdev-materials-swatch');
  node.dataset.slot = slot;
  node.dataset.tone = tone;
  node.dataset.level = level.id;
  node.title = `${level.label}: ${slot} ${tone}`;
  const text = caption === '' ? hex : `${caption} ${hex}`;
  node.append(chip(hex), element('span', 'lookdev-materials-hex', text));
  return node;
}

/** A row's label and swatches: banded slots show lit, mid and shadow; flat ones only mid. */
function buildRowLabel(row: MaterialsRow, level: LevelLook): HTMLElement {
  const block = element('div', 'lookdev-materials-row');
  if (row.isFactory) block.dataset.factory = row.kind;
  else block.dataset.strip = row.kind;
  const flatNote = row.slots.every((each) => !each.isBanded) ? ' · flat' : '';
  block.append(element('p', 'lookdev-materials-row-title', `${row.label}${flatNote}`));
  for (const { slot, isBanded } of row.slots) {
    const line = element('p', 'lookdev-materials-slot-line');
    line.append(element('span', 'lookdev-materials-slot', slot));
    if (row.kind === 'recolour') {
      // The strip shows every level, so its swatches do too: each level's mid, in the strip's order.
      for (const each of LEVEL_LOOKS) {
        const hexes = slotToneHexes(each.palette, each.rig, slot);
        line.append(swatch(each, slot, 'mid', hexes.mid, ''));
      }
    } else {
      const hexes = slotToneHexes(level.palette, level.rig, slot);
      for (const tone of isBanded ? TONES : (['mid'] as const)) {
        line.append(swatch(level, slot, tone, hexes[tone], tone));
      }
    }
    block.append(line);
  }
  return block;
}

function rigLine(
  name: string,
  level: LevelLook,
  slot: LevelPaletteSlot,
  detail: string,
): HTMLElement {
  const line = element('p', 'lookdev-materials-rig-line');
  line.append(
    element('span', 'lookdev-materials-rig-name', name),
    chip(level.palette[slot]),
    element('span', 'lookdev-materials-hex', `${slot} ${level.palette[slot]}`),
    element('span', 'lookdev-materials-rig-detail', detail),
  );
  return line;
}

function buildRig(level: LevelLook): HTMLElement {
  const { rig } = level;
  const panel = element('section', 'lookdev-materials-rig');
  panel.append(element('h2', 'lookdev-materials-heading', `${level.label} rig`));
  panel.append(
    rigLine('Key', level, rig.key.color, `intensity ${String(rig.key.intensity)}`),
    rigLine('Fill', level, rig.fill.color, `intensity ${String(rig.fill.intensity)}`),
    rigLine(
      'Fog',
      level,
      rig.fog.color,
      `depth ${String(rig.fog.startDepth)}–${String(rig.fog.fullDepth)} · max ${String(rig.fog.maxAmount)}`,
    ),
  );
  if (rig.groundFog !== null) {
    panel.append(
      rigLine(
        'Low fog',
        level,
        rig.groundFog.color,
        `height ${String(rig.groundFog.heightTiles)} · max ${String(rig.groundFog.maxAmount)}`,
      ),
    );
  }
  return panel;
}

/** Decodes the key art; a clone without `git lfs pull` holds a pointer file, which can't decode. */
function loadKeyArt(image: HTMLImageElement): Promise<void> {
  image.src = keyArtUrl;
  return image.decode().catch((error: unknown) => {
    throw new Error(
      `the key art ${keyArtUrl} did not decode (a Git LFS pointer? run git lfs pull): ${String(error)}`,
    );
  });
}

export function mountMaterialsView(
  host: HTMLElement,
  options: LookdevMountOptions,
): LookdevViewHandle {
  let level = levelLookOrThrow(options.level ?? DEFAULT_LEVEL);

  const root = element('div', 'lookdev-materials');
  const labels = element('div', 'lookdev-materials-labels');
  const canvasHost = element('div', 'lookdev-materials-canvas');
  const captions = element('div', 'lookdev-materials-captions');
  const side = element('aside', 'lookdev-materials-side');
  root.append(labels, canvasHost, side);
  host.append(root);

  const renderer = createRenderer(canvasHost);
  canvasHost.append(captions);
  const view = createMaterialsLookdevScene({ levels: LEVEL_LOOKS, levelId: level.id });

  // The side panel: key art, picker, rig, warm samples, statistics.
  const art = element('figure', 'lookdev-materials-art');
  const image = element('img', 'lookdev-materials-art-image');
  image.alt = 'The chosen Emberwood key art';
  art.append(
    image,
    element(
      'figcaption',
      'lookdev-materials-note',
      'The chosen key art: Emberwood, the only key art (docs/STYLE_GUIDE.md §1).',
    ),
  );
  const ready = loadKeyArt(image);

  const picker = buildLevelPicker(LEVEL_LOOKS, (id) => {
    switchTo(id);
  });
  const rigHost = element('div', 'lookdev-materials-rig-host');
  const warmTags = element('p', 'lookdev-materials-warm');
  const stats = buildStatsPanel(view.label, renderer.gpuName());
  side.append(
    element('h1', 'lookdev-materials-title', 'Materials'),
    picker.element,
    art,
    rigHost,
    warmTags,
    stats.panel,
  );

  let layout: MaterialsLayout | null = null;

  function placeLabels(): void {
    const { width, height } = renderer.size();
    if (width <= 0 || height <= 0) return;
    layout = view.layout(width, height);
    const blocks = Array.from(labels.children) as HTMLElement[];
    layout.rows.forEach((row, i) => {
      const block = blocks.at(i);
      if (block !== undefined) block.style.top = `${String(row.yPx)}px`;
    });
    captions.replaceChildren(
      ...layout.captions.map((each) => {
        const node = element('span', 'lookdev-materials-caption', each.text);
        node.style.left = `${String(each.xPx)}px`;
        node.style.top = `${String(each.yPx)}px`;
        return node;
      }),
    );
    // The probe in page pixels, for the look-dev check (P4).
    const box = canvasHost.getBoundingClientRect();
    root.dataset.probeX = String(Math.round(box.left + layout.probe.xPx));
    root.dataset.probeY = String(Math.round(box.top + layout.probe.yPx));
    root.dataset.probeSlot = layout.probe.slot;
  }

  /** Everything that depends on the level, rebuilt on a switch. */
  function showLevel(): void {
    root.dataset.level = level.id;
    // The warm point lights the shader draws now, read from the scene (the look-dev check, P6).
    root.dataset.warmLights = String(view.warmLightCount());
    labels.replaceChildren(...MATERIALS_ROWS.map((row) => buildRowLabel(row, level)));
    rigHost.replaceChildren(buildRig(level));
    warmTags.replaceChildren(
      element('span', 'lookdev-materials-rig-name', 'Warm samples'),
      ...view.warmSamples().map((sample) => {
        const tag = element('span', 'lookdev-materials-tag', sample);
        tag.dataset.warmSample = sample;
        return tag;
      }),
    );
    picker.setCurrent(level.id);
    placeLabels();
  }

  function switchTo(id: string): void {
    level = levelLookOrThrow(id);
    view.setLevel(id);
    replaceLevelInUrl(id);
    showLevel();
  }

  const fit = (width: number, height: number): void => {
    view.setAspect(width / height);
    placeLabels();
  };
  const { width, height } = renderer.size();
  view.setAspect(width / height);
  const stopFitting = renderer.onResize(fit);
  showLevel();

  let frameCount = 0;
  return {
    ready,
    frame(timeSeconds) {
      view.update(timeSeconds);
      renderer.render(view.scene, view.camera);
      if (frameCount % STATS_EVERY_FRAMES === 0) stats.show(renderer.readStats(view.scene));
      frameCount += 1;
    },
    dispose() {
      stopFitting();
      view.dispose();
      renderer.dispose();
      root.remove();
    },
  };
}

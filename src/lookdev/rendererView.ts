// The renderer view: the WebGLRenderer on an empty scene, with three.js's statistics (AC4, AC5).
// Later stories fill the scene; story 0.11 adds the shadow-map size and the pass count.
import { createEmptyLookdevScene } from '../render/lookdevScenes.ts';
import { createRenderer } from '../render/renderer.ts';
import type { RendererStats } from '../render/renderer.ts';
import type { LookdevViewHandle } from './assetBrowser.ts';

/** Bytes per MB, as in the budget check (story 0.2). */
const BYTES_PER_MB = 1_000_000;
/** Refresh the panel every this many frames: the texture estimate walks the whole scene. */
const STATS_EVERY_FRAMES = 15;

type StatKey = keyof RendererStats;

const STAT_ROWS: readonly { key: StatKey; label: string; format: (value: number) => string }[] = [
  { key: 'drawCalls', label: 'Draw calls', format: String },
  { key: 'triangles', label: 'Triangles', format: String },
  { key: 'geometries', label: 'Geometries', format: String },
  { key: 'textures', label: 'Textures', format: String },
  { key: 'programs', label: 'Shader programs', format: String },
  {
    key: 'textureBytesEstimate',
    label: 'Texture memory (estimate)',
    format: (bytes) => `${(bytes / BYTES_PER_MB).toFixed(2)} MB`,
  },
  { key: 'pixelRatio', label: 'Pixel ratio', format: (ratio) => ratio.toFixed(2) },
];

/** The statistics panel: scene label, GPU, and three.js's counts. The materials view reuses it. */
export function buildStatsPanel(
  sceneLabel: string,
  gpuName: string,
): {
  panel: HTMLElement;
  show(stats: RendererStats): void;
} {
  const panel = document.createElement('div');
  panel.className = 'lookdev-stats';
  const title = document.createElement('p');
  title.className = 'lookdev-stats-scene';
  title.textContent = `Scene: ${sceneLabel}`;
  // The GPU in use, so a run on the wrong one is visible at a glance (the GTX 1650 rule).
  const gpu = document.createElement('p');
  gpu.className = 'lookdev-stats-gpu';
  gpu.textContent = `GPU: ${gpuName}`;
  const list = document.createElement('dl');
  panel.append(title, gpu, list);
  const cells = new Map<StatKey, HTMLElement>();
  for (const row of STAT_ROWS) {
    const term = document.createElement('dt');
    term.textContent = row.label;
    const value = document.createElement('dd');
    value.dataset.lookdevStat = row.key;
    list.append(term, value);
    cells.set(row.key, value);
  }
  return {
    panel,
    show(stats) {
      for (const row of STAT_ROWS) {
        const cell = cells.get(row.key);
        const text = row.format(stats[row.key]);
        // Touch the DOM only when a value changes.
        if (cell !== undefined && cell.textContent !== text) cell.textContent = text;
      }
    },
  };
}

export function mountRendererView(host: HTMLElement): LookdevViewHandle {
  const canvasHost = document.createElement('div');
  canvasHost.className = 'lookdev-canvas-host';
  host.append(canvasHost);

  const renderer = createRenderer(canvasHost);
  const view = createEmptyLookdevScene();
  const fitCamera = (width: number, height: number): void => {
    view.setAspect(width / height);
  };
  const { width, height } = renderer.size();
  fitCamera(width, height);
  const stopFitting = renderer.onResize(fitCamera);

  const stats = buildStatsPanel(view.label, renderer.gpuName());
  host.append(stats.panel);
  let frameCount = 0;

  return {
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
      stats.panel.remove();
      canvasHost.remove();
    },
  };
}

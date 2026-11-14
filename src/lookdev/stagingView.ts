// The staging view (story 0.10, AC12–AC15): the stage's four depth layers in placeholder shapes from
// the backdrop material, the view camera framing the logical view, its box outlined, and the camera
// panning so the layers' parallax shows. A spot fixes the pan; otherwise the camera sweeps.
//
// The canvas fills the whole window, as the game's does, so the on-screen tile matches the overlay's
// --tile, which ui/overlay.ts computes from the window. The view mounts an empty overlay root for
// that reason only: the staging check reads --tile from it and measures the ruler against it.
//
// Page chrome (lookdev.css, `lookdev-staging-*`): the box outline, its caption and the side panel.
// A spot hides the side panel, so a shot shows the framing and nothing over it. lookdev/ may not
// import three.js, so the scene is built in render/lookdevScenes.ts and the page places the outline
// from the scene's layout().
import { createStagingLookdevScene } from '../render/lookdevScenes.ts';
import type { PixelRect, StagingLayout } from '../render/lookdevScenes.ts';
import { createRenderer } from '../render/renderer.ts';
import { createOverlay } from '../ui/overlay.ts';
import type { LookdevMountOptions, LookdevViewHandle } from './assetBrowser.ts';
import { LEVEL_LOOKS, levelLookOrThrow } from './levelLooks.ts';
import { buildLevelPicker, replaceLevelInUrl } from './levelPicker.ts';
import { buildStatsPanel } from './rendererView.ts';

/** Refresh the statistics every this many frames, as the renderer view does. */
const STATS_EVERY_FRAMES = 15;
const DEFAULT_LEVEL = 'emberwood';
/** Decimals for the numbers the page shows and the data attributes the check reads. */
const SHOWN_DECIMALS = 2;
/** Pixels kept between the measured ruler row and the box outline (2 px wide, lookdev.css). */
const OUTLINE_CLEARANCE_PX = 4;

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

const shown = (value: number): string => value.toFixed(SHOWN_DECIMALS);

/** A rectangle moved from canvas pixels to page pixels, rounded for the data attributes. */
function onPage(rect: PixelRect, offsetX: number, offsetY: number): PixelRect {
  const round = (value: number): number => Number(value.toFixed(SHOWN_DECIMALS));
  return {
    left: round(rect.left + offsetX),
    top: round(rect.top + offsetY),
    right: round(rect.right + offsetX),
    bottom: round(rect.bottom + offsetY),
  };
}

export function mountStagingView(
  host: HTMLElement,
  options: LookdevMountOptions,
): LookdevViewHandle {
  let level = levelLookOrThrow(options.level ?? DEFAULT_LEVEL);

  const root = element('div', 'lookdev-staging');
  const canvasHost = element('div', 'lookdev-staging-canvas');
  const box = element('div', 'lookdev-staging-box');
  const boxCaption = element('span', 'lookdev-staging-box-caption');
  box.append(boxCaption);
  const side = element('aside', 'lookdev-staging-side');
  root.append(canvasHost, box, side);
  host.append(root);

  const renderer = createRenderer(canvasHost);
  const view = createStagingLookdevScene({ levels: LEVEL_LOOKS, levelId: level.id });
  view.setPan(options.panTiles ?? null);

  // The overlay root, so --tile is set by ui/overlay.ts on this page as in the game. It stays empty.
  const overlay = createOverlay(host);
  overlay.root.classList.add('lookdev-staging-overlay');

  const picker = buildLevelPicker(LEVEL_LOOKS, (id) => {
    switchTo(id);
  });
  const framingText = element('p', 'lookdev-staging-framing');
  const stats = buildStatsPanel(view.label, renderer.gpuName());
  side.append(
    element('h1', 'lookdev-staging-title', 'Staging'),
    picker.element,
    framingText,
    element(
      'p',
      'lookdev-staging-note',
      'Layers far to near: ridge, trunks, the ground with its tile ruler, foreground plants. The dashed box is the logical view.',
    ),
    stats.panel,
  );

  // The canvas's place on the page, read on a resize only, so a frame never forces a layout.
  let canvasBox = canvasHost.getBoundingClientRect();
  let lastLayoutKey = '';

  /**
   * Places the outline and writes the data attributes, when the size, the level or the pan has
   * changed. While the camera sweeps, frame() calls it only every STATS_EVERY_FRAMES frames: the box
   * doesn't move with the pan, only the caption, the pan and the foreground's data do.
   */
  function placeOutline(): void {
    const { width, height } = renderer.size();
    if (width <= 0 || height <= 0) return;
    const key = `${String(width)}x${String(height)}|${level.id}|${shown(view.panTiles)}`;
    if (key === lastLayoutKey) return;
    lastLayoutKey = key;
    const layout: StagingLayout = view.layout(width, height);
    const boxRect = onPage(layout.box, canvasBox.left, canvasBox.top);
    const foreground = layout.foreground.map((rect) => onPage(rect, canvasBox.left, canvasBox.top));
    const { framing } = layout;

    box.style.left = `${String(boxRect.left - canvasBox.left)}px`;
    box.style.top = `${String(boxRect.top - canvasBox.top)}px`;
    box.style.width = `${String(boxRect.right - boxRect.left)}px`;
    box.style.height = `${String(boxRect.bottom - boxRect.top)}px`;
    boxCaption.textContent =
      `Logical view ${String(layout.boxTiles.width)} × ${String(layout.boxTiles.height)} tiles · ` +
      `pan ${shown(framing.panTiles)} tiles · tile ${shown(framing.tilePx)} px`;
    framingText.textContent =
      `Camera ${shown(framing.distance)} tiles from the play plane · ` +
      `visible ${shown(framing.visibleWidth)} × ${shown(framing.visibleHeight)} tiles · ` +
      `aspect ${framing.aspect.toFixed(3)} · tile ${shown(framing.tilePx)} px · ` +
      `pan ${shown(framing.panTiles)}`;

    // For the staging check (S2–S7), in page pixels.
    root.dataset.boxLeft = String(boxRect.left);
    root.dataset.boxTop = String(boxRect.top);
    root.dataset.boxRight = String(boxRect.right);
    root.dataset.boxBottom = String(boxRect.bottom);
    root.dataset.foreground = JSON.stringify(foreground);
    root.dataset.rulerY = String(Math.round(canvasBox.top + layout.ruler.yPx));
    // The row the check measures: on screen, and inside the outline, so its border isn't counted.
    root.dataset.rulerX0 = String(
      Math.ceil(Math.max(canvasBox.left, boxRect.left) + OUTLINE_CLEARANCE_PX),
    );
    root.dataset.rulerX1 = String(
      Math.floor(Math.min(canvasBox.left + width, boxRect.right) - OUTLINE_CLEARANCE_PX) - 1,
    );
    root.dataset.rulerSlots = layout.ruler.slots.join(' ');
    root.dataset.tilePx = shown(framing.tilePx);
    root.dataset.pan = shown(framing.panTiles);
  }

  function showLevel(): void {
    root.dataset.level = level.id;
    picker.setCurrent(level.id);
    placeOutline();
  }

  function switchTo(id: string): void {
    level = levelLookOrThrow(id);
    view.setLevel(id);
    replaceLevelInUrl(id);
    showLevel();
  }

  const fit = (fitWidth: number, fitHeight: number): void => {
    view.setAspect(fitWidth / fitHeight);
    canvasBox = canvasHost.getBoundingClientRect();
    placeOutline();
  };
  const { width, height } = renderer.size();
  view.setAspect(width / height);
  const stopFitting = renderer.onResize(fit);
  showLevel();

  let frameCount = 0;
  return {
    frame(timeSeconds) {
      view.update(timeSeconds);
      if (options.panTiles !== undefined || frameCount % STATS_EVERY_FRAMES === 0) placeOutline();
      renderer.render(view.scene, view.camera);
      if (frameCount % STATS_EVERY_FRAMES === 0) stats.show(renderer.readStats(view.scene));
      frameCount += 1;
    },
    dispose() {
      stopFitting();
      overlay.dispose();
      view.dispose();
      renderer.dispose();
      root.remove();
    },
  };
}

// The look-dev page's views, in one list, and the navigation built from it (AR170). Each later
// story adds its view here: palettes (0.7), type (0.8), materials (0.9), staging (0.10), the test
// scene (0.12), the sample card (0.13). Every view needs at least one spot in spots.ts; the
// look-dev check fails otherwise.
import { mountMaterialsView } from './materialsView.ts';
import { mountOverlayView } from './overlayView.ts';
import { mountPalettesView } from './palettesView.ts';
import { mountRendererView } from './rendererView.ts';
import { mountStagingView } from './stagingView.ts';
import { mountTypeView } from './typeView.ts';
import type { LookdevSpot } from './spots.ts';

export interface LookdevViewHandle {
  /** Draws one frame at `timeSeconds` (frozen when a spot is open). */
  frame(timeSeconds: number): void;
  /**
   * Settles when the view's own assets are ready to be seen (an image decoded, for example). main.ts
   * waits for it, after the fonts, before it reports ready; a rejection ends in the error state.
   */
  readonly ready?: Promise<void>;
  dispose(): void;
}

/** What a view is mounted with. */
export interface LookdevMountOptions {
  /** The open spot, if any. */
  readonly spot: LookdevSpot | undefined;
  /**
   * The level asked for: the spot's `level`, else `?level=`; undefined if neither. Views that show a
   * level resolve it (and throw on an unknown id); the others ignore it.
   */
  readonly level: string | undefined;
  /**
   * The camera's centre x, in tiles, from the spot only (story 0.10); undefined without a spot, and a
   * panning view then sweeps. Views that don't pan ignore it.
   */
  readonly panTiles: number | undefined;
}

export interface LookdevView {
  readonly id: string;
  readonly label: string;
  /** Throws if the view can't start (for example, no WebGL); the page shows the message. */
  mount(host: HTMLElement, options: LookdevMountOptions): LookdevViewHandle;
}

export const LOOKDEV_VIEWS: readonly LookdevView[] = [
  { id: 'overlay', label: 'Overlay', mount: mountOverlayView },
  { id: 'renderer', label: 'Renderer', mount: mountRendererView },
  { id: 'palettes', label: 'Palettes', mount: mountPalettesView },
  { id: 'type', label: 'Type', mount: mountTypeView },
  { id: 'materials', label: 'Materials', mount: mountMaterialsView },
  { id: 'staging', label: 'Staging', mount: mountStagingView },
];

export function findView(id: string): LookdevView | undefined {
  return LOOKDEV_VIEWS.find((view) => view.id === id);
}

/** The bar across the top: the page name and a link per view. Spots show no bar (main.ts). */
export function buildNavigation(currentViewId: string): HTMLElement {
  const bar = document.createElement('nav');
  bar.className = 'lookdev-bar';

  const title = document.createElement('strong');
  title.textContent = 'Emberbound look-dev';
  bar.append(title);

  for (const view of LOOKDEV_VIEWS) {
    const link = document.createElement('a');
    link.href = `?view=${encodeURIComponent(view.id)}`;
    link.textContent = view.label;
    link.dataset.lookdevView = view.id;
    if (view.id === currentViewId) link.setAttribute('aria-current', 'page');
    bar.append(link);
  }

  return bar;
}

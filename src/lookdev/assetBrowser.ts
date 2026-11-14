// The look-dev page's views, in one list, and the navigation built from it (AR170). Each later
// story adds its view here: palettes (0.7), type (0.8), materials (0.9), staging (0.10), the test
// scene (0.12), the sample card (0.13). Every view needs at least one spot in spots.ts; the
// look-dev check fails otherwise.
import { mountOverlayView } from './overlayView.ts';
import { mountPalettesView } from './palettesView.ts';
import { mountRendererView } from './rendererView.ts';
import type { LookdevSpot } from './spots.ts';

export interface LookdevViewHandle {
  /** Draws one frame at `timeSeconds` (frozen when a spot is open). */
  frame(timeSeconds: number): void;
  dispose(): void;
}

/** What a view is mounted with: the open spot, if any. Story 0.10 adds camera presets here. */
export interface LookdevMountOptions {
  readonly spot: LookdevSpot | undefined;
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

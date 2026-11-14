// The overlay root (architecture, User Interface; AR182, AR183). This story builds the root and
// --tile only; story 1.11 adds the layer stacking, and Epic 3 the mute indicator.
//
// --tile is the on-screen size of one world tile, set only here, on the root, on creation and on
// every resize (UX-DR9; DESIGN.md, Layout & Spacing). base.css declares every token on the
// root's class, `.ui-overlay`, because a token that uses var(--tile) resolves where it is
// declared; anything that reads the tokens must sit inside the root.
import { CONFIG } from '../sim/config.ts';

/** The logical view in tiles, with the margin the view camera frames on each side (X-B35). */
export interface ViewSize {
  readonly width: number;
  readonly height: number;
  readonly margin: number;
}

export interface Overlay {
  readonly root: HTMLDivElement;
  dispose(): void;
}

/**
 * DESIGN.md's `min(100vw / 19, 100vh / 10.4)`, generalised to a margin of `view.margin` tiles on
 * every side of the logical view. Pure, so Node tests and Playwright specs can call it.
 */
export function computeTilePx(
  viewportWidth: number,
  viewportHeight: number,
  view: ViewSize,
): number {
  const framedWidth = view.width + 2 * view.margin;
  const framedHeight = view.height + 2 * view.margin;
  return Math.min(viewportWidth / framedWidth, viewportHeight / framedHeight);
}

/**
 * Appends the overlay root to `host` and keeps its --tile in step with the window.
 * innerWidth and innerHeight match 100vw and 100vh (both include a scrollbar).
 */
export function createOverlay(host: HTMLElement): Overlay {
  const root = document.createElement('div');
  root.className = 'ui-overlay';

  function updateTile(): void {
    const tilePx = computeTilePx(window.innerWidth, window.innerHeight, CONFIG.view);
    root.style.setProperty('--tile', `${String(tilePx)}px`);
  }

  updateTile();
  host.append(root);
  window.addEventListener('resize', updateTile);

  return {
    root,
    dispose() {
      window.removeEventListener('resize', updateTile);
      root.remove();
    },
  };
}

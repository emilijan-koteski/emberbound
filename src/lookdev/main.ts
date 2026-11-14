// The look-dev page (development only; AR170). `make dev` serves it at /lookdev.html; `make build`
// never includes it, since nothing in index.html's graph imports it (story 0.6, AC3), and ESLint
// bans importing lookdev/ from the game's entry.
//
// URL: ?view=<id> opens a view (default: the first, also for an empty value); ?spot=<id> opens a
// spot's view with its animation time frozen (D3); ?level=<id> asks a view that shows a level for
// that level (a spot's own `level` wins; story 0.9). A spot's `panTiles` fixes a panning view's camera
// (story 0.10); there is no URL parameter for it.
//
// <html data-lookdev-ready> is "false" while the view starts, "true" once it has drawn a frame,
// laid out, every font in use has loaded and the view's own `ready` has settled, and "error" if
// anything failed (an unknown view or
// spot, a view that can't mount, a frame that throws). The error is shown on the page and logged,
// so the screenshot harness and the look-dev checks fail at once with the message.
import '../ui/styles/base.css';
import './lookdev.css';
import { log } from '../core/log.ts';
import { buildNavigation, findView, LOOKDEV_VIEWS } from './assetBrowser.ts';
import type { LookdevViewHandle } from './assetBrowser.ts';
import type { LookdevSpot } from './spots.ts';
import { LOOKDEV_SPOTS } from './spots.ts';

log.setLevel('debug');

const html = document.documentElement;
html.dataset.lookdevReady = 'false';

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Shows the message in the page chrome (outside the overlay root) and ends in the error state. */
function fail(main: HTMLElement, message: string, error?: unknown): void {
  const paragraph = document.createElement('p');
  paragraph.className = 'lookdev-error';
  paragraph.textContent = message;
  main.append(paragraph);
  log.error('ui', `Look-dev: ${message}`, error);
  html.dataset.lookdevReady = 'error';
}

async function markReadyAfterFonts(viewReady: Promise<void>): Promise<void> {
  // One frame for layout and text shaping, which is when web-font loads start; then wait for
  // them, and for the view's own assets; then one more frame so they are painted. Each wait names
  // its own cause if it fails.
  await nextFrame();
  try {
    await document.fonts.ready;
  } catch (error) {
    throw new Error(`the fonts did not load: ${describe(error)}`);
  }
  try {
    await viewReady;
  } catch (error) {
    throw new Error(`the view's assets did not load: ${describe(error)}`);
  }
  await nextFrame();
  if (html.dataset.lookdevReady === 'false') html.dataset.lookdevReady = 'true';
}

function start(): void {
  const params = new URLSearchParams(window.location.search);
  const spotId = params.get('spot');
  let spot: LookdevSpot | undefined;
  if (spotId !== null) spot = LOOKDEV_SPOTS.find((candidate) => candidate.id === spotId);
  const requestedView = params.get('view');
  const viewId =
    spot?.view ??
    (requestedView !== null && requestedView !== '' ? requestedView : LOOKDEV_VIEWS.at(0)?.id) ??
    '';

  const main = document.createElement('main');
  main.className = 'lookdev-main';
  document.body.append(main);
  // A spot (the screenshot harness) shows no bar: the shot is the game's full window and nothing
  // else. Also, in headless Chromium (SwiftShader) a full-width bar over the canvas left the
  // canvas's bottom 32 px unpainted in shots; GPU browsers paint it correctly (code review,
  // 2026-11-14: checked in headed Chromium and Firefox on the Intel UHD 630).
  if (spotId === null) document.body.append(buildNavigation(viewId));
  else html.dataset.lookdevSpot = spotId;

  if (spotId !== null && spot === undefined) {
    fail(main, `Unknown spot "${spotId}"`);
    return;
  }
  const view = findView(viewId);
  if (view === undefined) {
    fail(main, `Unknown view "${viewId}"`);
    return;
  }

  // A spot is fixed by its own data: its level (or none), never the URL's (code review, 2026-11-14).
  const levelParam = params.get('level');
  const level =
    spot !== undefined
      ? spot.level
      : levelParam !== null && levelParam !== ''
        ? levelParam
        : undefined;

  let handle: LookdevViewHandle;
  try {
    // The pan comes only from a spot (story 0.10): without one, a panning view sweeps.
    handle = view.mount(main, { spot, level, panTiles: spot?.panTiles });
  } catch (error) {
    fail(main, `The "${view.id}" view could not start: ${describe(error)}`, error);
    return;
  }

  // Observed now, so a rejection before the first frame is never an unhandled one; it is reported
  // when the ready signal reaches it.
  const viewReady = handle.ready ?? Promise.resolve();
  viewReady.catch(() => undefined);

  const startMs = performance.now();
  let hasDrawn = false;

  const tick = (nowMs: number): void => {
    const timeSeconds = spot === undefined ? (nowMs - startMs) / 1000 : spot.animTimeSeconds;
    try {
      handle.frame(timeSeconds);
    } catch (error) {
      // Stop the loop: a frame that throws once throws every frame.
      fail(main, `The "${view.id}" view failed to draw: ${describe(error)}`, error);
      return;
    }
    if (!hasDrawn) {
      hasDrawn = true;
      markReadyAfterFonts(viewReady).catch((error: unknown) => {
        fail(main, `The "${view.id}" view did not get ready: ${describe(error)}`, error);
      });
    }
    requestAnimationFrame(tick);
  };
  // Views are switched by navigating (the bar's links reload the page), so the handle lives as
  // long as the page; dispose() is there for a later in-page switcher.
  requestAnimationFrame(tick);
}

start();

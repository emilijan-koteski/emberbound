// The look-dev page (development only; AR170). `make dev` serves it at /lookdev.html; `make build`
// never includes it, since nothing in index.html's graph imports it (story 0.6, AC3), and ESLint
// bans importing lookdev/ from the game's entry.
//
// URL: ?view=<id> opens a view (default: the first, also for an empty value); ?spot=<id> opens a
// spot's view with its animation time frozen (D3).
//
// <html data-lookdev-ready> is "false" while the view starts, "true" once it has drawn a frame,
// laid out, and every font in use has loaded, and "error" if anything failed (an unknown view or
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

async function markReadyAfterFonts(): Promise<void> {
  // One frame for layout and text shaping, which is when web-font loads start; then wait for
  // them; then one more frame so the loaded faces are painted.
  await nextFrame();
  await document.fonts.ready;
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

  let handle: LookdevViewHandle;
  try {
    handle = view.mount(main, { spot });
  } catch (error) {
    fail(main, `The "${view.id}" view could not start: ${describe(error)}`, error);
    return;
  }

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
      markReadyAfterFonts().catch((error: unknown) => {
        fail(main, `The ready signal failed: ${describe(error)}`, error);
      });
    }
    requestAnimationFrame(tick);
  };
  // Views are switched by navigating (the bar's links reload the page), so the handle lives as
  // long as the page; dispose() is there for a later in-page switcher.
  requestAnimationFrame(tick);
}

start();

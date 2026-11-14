// The level picker the look-dev views share (story 0.9, D13; shared since story 0.10): one button per
// level, the current one marked `aria-pressed`, and the URL's `level` kept in step with
// history.replaceState, so a reload opens the same level. Page chrome (lookdev.css,
// `lookdev-level-*`). The look-dev checks find the buttons by `data-level-button`.
import type { LevelLook } from './levelLooks.ts';

export interface LevelPicker {
  readonly element: HTMLElement;
  /** Marks `id` as the current level (it doesn't call `onPick`). */
  setCurrent(id: string): void;
}

/** Builds the picker; a click calls `onPick` with the level's id. */
export function buildLevelPicker(
  levels: readonly LevelLook[],
  onPick: (id: string) => void,
): LevelPicker {
  const element = document.createElement('nav');
  element.className = 'lookdev-level-picker';
  const buttons = levels.map((level) => {
    const button = document.createElement('button');
    button.className = 'lookdev-level-button';
    button.type = 'button';
    button.textContent = level.label;
    button.dataset.levelButton = level.id;
    button.addEventListener('click', () => {
      onPick(level.id);
    });
    element.append(button);
    return button;
  });
  return {
    element,
    setCurrent(id) {
      for (const button of buttons) {
        button.setAttribute('aria-pressed', String(button.dataset.levelButton === id));
      }
    },
  };
}

/** Puts `level=<id>` in the page's URL without a reload or a new history entry. */
export function replaceLevelInUrl(id: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('level', id);
  window.history.replaceState(null, '', url);
}

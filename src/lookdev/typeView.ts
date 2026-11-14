// The type view: the two overlay typefaces, self-hosted (story 0.8, AC12–AC19). Each face in each
// weight the typography tokens use, one row per token at that token's size; the wordmark; every
// character the version-one story text uses, in the display face; and the numeric pair for the
// tabular-figures check.
//
// It draws inside the overlay root, so sizes, weights, line heights and letter spacing come from the
// --typography-* properties and follow --tile. This is the second exception to "tokens only inside
// .ui-overlay" (the first is the bar padding, story 0.6 D12; this one is story 0.8 D5): font-family
// is set to the face's name, because the tokens still say system-ui until story 0.14 updates
// DESIGN.md. Then this view can read the families from the tokens instead.
//
// The story characters are parsed from the narrative design itself (D7), through Vite's ?raw import;
// the look-dev page is development only, so the document never reaches the game.
import narrative from '../../_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md?raw';
import { createOverlay } from '../ui/overlay.ts';
import type { LookdevViewHandle } from './assetBrowser.ts';
import { readStoryLines, uniqueCharacters } from './storyCharacters.ts';

interface Face {
  /** The @font-face family in base.css, and the name docs/STYLE_GUIDE.md gives it. */
  readonly family: string;
  readonly role: string;
  /** The typography tokens this face serves (docs/STYLE_GUIDE.md, Typefaces). */
  readonly tokens: readonly string[];
}

/** The display face: the wordmark, level names and card lines only (style guide, Use). */
const DISPLAY_FACE: Face = {
  family: 'Alegreya',
  role: 'Display',
  tokens: ['display-xl', 'display-lg', 'display-body'],
};
/** Every menu, label, notice and number. Its default digits are tabular (UX-DR7). */
const UI_FACE: Face = {
  family: 'Source Sans 3',
  role: 'UI and numeric',
  tokens: ['ui-lg', 'ui-md', 'ui-sm', 'numeric-lg', 'numeric-md'],
};

/** Space between the story characters, so each small mark can be checked on its own (round 10). */
const CHARSET_LETTER_SPACING = '0.3em';
/** The sizes the story characters show at: a level name's, and a card line's. */
const CHARSET_TOKENS = ['display-lg', 'display-body'] as const;

// The working title (UX-DR61; docs/STYLE_GUIDE.md, Wordmark). It changes after the Epic 6 name check.
const WORDMARK = 'Emberbound';
/**
 * Look-dev sample lines, as the overlay view uses: no story text and no on-screen strings. The long
 * one carries curly quotes, so they are seen against letters, as in every card line with speech.
 */
const SAMPLE_SHORT = 'Sphinx of black quartz';
const SAMPLE_LONG = '“Sphinx of black quartz,” judge my vow. 0123456789';
/** The readiness check's pair (Q12): equal widths mean tabular figures. */
const NUMERIC_SAMPLES = ['0:00.0', '1:11.1'] as const;

/** The token attributes a sample takes, as CSS property names. font-family is set apart (D5). */
const TOKEN_ATTRIBUTES = ['font-size', 'font-weight', 'line-height', 'letter-spacing'] as const;

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

function isNumericToken(token: string): boolean {
  return token.startsWith('numeric-');
}

/**
 * Styles a sample as `token`, in `family`: each token property base.css declares, read on the
 * overlay root so a property the token lacks (most have no letter-spacing) is left unset.
 */
function applyToken(sample: HTMLElement, root: HTMLElement, token: string, family: string): void {
  const computed = getComputedStyle(root);
  for (const attribute of TOKEN_ATTRIBUTES) {
    const property = `--typography-${token}-${attribute}`;
    if (computed.getPropertyValue(property).trim() === '') continue;
    sample.style.setProperty(attribute, `var(${property})`);
  }
  sample.style.fontFamily = `'${family}'`;
}

/** How many of the family's @font-face faces have loaded, or failed, from document.fonts. */
function faceStatus(family: string): { loaded: number; failed: number; total: number } {
  let loaded = 0;
  let failed = 0;
  let total = 0;
  for (const face of document.fonts) {
    // Browsers report the family quoted or not; compare without quotes.
    if (face.family.replaceAll(/["']/g, '') !== family) continue;
    total += 1;
    if (face.status === 'loaded') loaded += 1;
    else if (face.status === 'error') failed += 1;
  }
  return { loaded, failed, total };
}

interface Row {
  readonly label: HTMLElement;
  readonly sample: HTMLElement;
  readonly token: string;
}

function buildFace(root: HTMLElement, face: Face, rows: Row[]): HTMLElement {
  const section = element('section', 'lookdev-typeface-face');
  section.dataset.typefaceFace = face.family;

  const heading = element('h2', 'lookdev-typeface-heading');
  heading.append(
    element('span', 'lookdev-typeface-name', face.family),
    element('span', 'lookdev-typeface-role', ` · ${face.role} · `),
  );
  const status = element('span', 'lookdev-typeface-status');
  status.dataset.typefaceStatus = face.family;
  heading.append(status);
  section.append(heading);
  section.append(element('p', 'lookdev-typeface-tokens', `Serves ${face.tokens.join(', ')}`));

  for (const token of face.tokens) {
    const row = element('div', 'lookdev-typeface-row');
    row.dataset.typefaceRow = token;
    const label = element('div', 'lookdev-typeface-label');
    row.append(label);

    if (isNumericToken(token)) {
      // The pair, each on its own line at its own width, so the check measures each one.
      const pair = element('div', 'lookdev-typeface-numeric');
      pair.dataset.typefaceNumeric = token;
      for (const text of NUMERIC_SAMPLES) {
        const sample = element('span', 'lookdev-typeface-sample lookdev-typeface-figures', text);
        sample.dataset.numericSample = text;
        sample.dataset.typefaceSample = token;
        applyToken(sample, root, token, face.family);
        pair.append(sample);
      }
      row.append(pair);
      const first = pair.firstElementChild;
      if (first instanceof HTMLElement) rows.push({ label, sample: first, token });
    } else {
      const text = token === 'display-xl' || token === 'display-lg' ? SAMPLE_SHORT : SAMPLE_LONG;
      const sample = element('div', 'lookdev-typeface-sample', text);
      sample.dataset.typefaceSample = token;
      applyToken(sample, root, token, face.family);
      row.append(sample);
      rows.push({ label, sample, token });
    }
    section.append(row);
  }
  return section;
}

/** Characters, not UTF-16 code units: the story text could hold one outside the BMP. */
function countCharacters(text: string): number {
  return Array.from(text).length;
}

function buildCharset(
  root: HTMLElement,
  characters: string,
  lineCount: number,
  rows: Row[],
): HTMLElement {
  const section = element('section', 'lookdev-typeface-charset');
  const spaceNote = characters.includes(' ') ? ', the space included' : '';
  section.append(
    element(
      'h2',
      'lookdev-typeface-heading',
      `Story text characters · ${String(countCharacters(characters))} from ${String(lineCount)} lines${spaceNote} · spaced apart for checking`,
    ),
  );
  for (const token of CHARSET_TOKENS) {
    const row = element('div', 'lookdev-typeface-row');
    const label = element('div', 'lookdev-typeface-label');
    const sample = element('div', 'lookdev-typeface-sample lookdev-typeface-chars', characters);
    sample.dataset.typefaceCharset = token;
    applyToken(sample, root, token, DISPLAY_FACE.family);
    // A judging aid, set after the token so a letter-spacing token (story 0.14) can't override it.
    sample.style.letterSpacing = CHARSET_LETTER_SPACING;
    row.append(label, sample);
    section.append(row);
    rows.push({ label, sample, token });
  }
  return section;
}

export function mountTypeView(host: HTMLElement): LookdevViewHandle {
  const overlay = createOverlay(host);
  const { root } = overlay;
  root.classList.add('lookdev-typeface');

  let characters: string;
  let lineCount: number;
  try {
    const lines = readStoryLines(narrative);
    characters = uniqueCharacters(lines);
    lineCount = lines.length;
  } catch (error) {
    overlay.dispose();
    // main.ts shows the message in the page chrome, outside the overlay root.
    throw new Error(
      `can't read the story text from the narrative design: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const header = element('header', 'lookdev-typeface-header');
  header.append(
    element(
      'p',
      'lookdev-typeface-note',
      'The typography tokens still name system-ui until story 0.14 updates DESIGN.md. Each face is shown here by name, at the sizes of the tokens it will serve.',
    ),
  );
  const wordmark = element('div', 'lookdev-typeface-wordmark', WORDMARK);
  wordmark.dataset.typefaceWordmark = '';
  applyToken(wordmark, root, 'display-xl', DISPLAY_FACE.family);
  header.append(wordmark);

  const rows: Row[] = [];
  const left = element('div', 'lookdev-typeface-column');
  left.append(buildFace(root, DISPLAY_FACE, rows), buildCharset(root, characters, lineCount, rows));
  const right = element('div', 'lookdev-typeface-column');
  right.append(buildFace(root, UI_FACE, rows));
  root.append(header, left, right);

  const statuses = Array.from(root.querySelectorAll<HTMLElement>('[data-typeface-status]'));

  function refreshLabels(): void {
    for (const { label, sample, token } of rows) {
      const style = getComputedStyle(sample);
      const family = style.fontFamily.replaceAll(/["']/g, '');
      const sizePx = Number.parseFloat(style.fontSize).toFixed(1);
      const text = `${token} · ${family} ${style.fontWeight} · ${sizePx} px`;
      if (label.textContent !== text) label.textContent = text;
    }
  }

  /** Updates each face's status; true once every declared face has settled (loaded or failed). */
  function refreshStatuses(): boolean {
    let isAllSettled = true;
    for (const status of statuses) {
      const { loaded, failed, total } = faceStatus(status.dataset.typefaceStatus ?? '');
      if (loaded + failed < total) isAllSettled = false;
      const failedNote = failed > 0 ? `, ${String(failed)} failed` : '';
      const text =
        total === 0
          ? 'not declared'
          : `${String(loaded)} of ${String(total)} faces loaded${failedNote}`;
      if (status.textContent !== text) status.textContent = text;
    }
    return isAllSettled;
  }

  // overlay.ts's resize listener runs first (it was added first), so --tile is already updated.
  const onResize = (): void => {
    refreshLabels();
  };
  refreshLabels();
  refreshStatuses();
  window.addEventListener('resize', onResize);
  // The faces start loading at the first layout, after mount, so document.fonts.ready can't be
  // awaited here (it may still be the promise from before any load). frame() polls instead, until
  // every face has loaded or failed; main.ts marks the page ready one frame after the loads finish,
  // so the shot shows the final status.
  let isAllSettled = false;

  return {
    frame() {
      if (!isAllSettled) isAllSettled = refreshStatuses();
    },
    dispose() {
      window.removeEventListener('resize', onResize);
      overlay.dispose();
    },
  };
}

// The overlay view: DESIGN.md's colour roles as swatches and its typography tokens as samples,
// drawn inside the overlay root through the token properties (AC7–AC9; UX-DR16).
//
// Both lists are read at runtime from base.css's `.ui-overlay` rule (story 0.6, D9), so when story
// 0.14 changes DESIGN.md and base.css, this view follows. One exception, accepted at code review
// (2026-11-14): the sample line is picked by token name (isNumericToken, sampleText). The
// `numeric-` prefix mirrors DESIGN.md's tabular-figures note on those tokens, which base.css
// doesn't emit; a renamed token only changes which sample line it shows.
import { log } from '../core/log.ts';
import { createOverlay } from '../ui/overlay.ts';
import type { LookdevViewHandle } from './assetBrowser.ts';

const TOKEN_SELECTOR = '.ui-overlay';
const COLOR_PREFIX = '--colors-';
const TYPOGRAPHY_PREFIX = '--typography-';
/** The attributes base.css emits for a typography token, as CSS property names. */
const TYPOGRAPHY_ATTRIBUTES = [
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
] as const;
type TypographyAttribute = (typeof TYPOGRAPHY_ATTRIBUTES)[number];

/** Look-dev sample lines: no story text and no on-screen strings, so neither is duplicated. */
const SAMPLE_SHORT = 'Sphinx of black quartz';
const SAMPLE_LONG = 'Sphinx of black quartz, judge my vow. 0123456789';
// Two lines, spaces kept (white-space: pre), so tabular figures line up in columns by eye.
const SAMPLE_NUMERIC = '0:00.0   12 / 30\n1:11.1   19 / 30';

interface TypographyToken {
  readonly name: string;
  readonly attributes: ReadonlyMap<TypographyAttribute, string>;
}

/** The `.ui-overlay` rule from base.css, or undefined if no loaded sheet has it. */
function findTokenRule(): CSSStyleRule | undefined {
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // A cross-origin sheet can't be read; base.css is never one.
    }
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule && rule.selectorText === TOKEN_SELECTOR) return rule;
    }
  }
  return undefined;
}

function splitTypographyName(property: string): [string, TypographyAttribute] | undefined {
  const rest = property.slice(TYPOGRAPHY_PREFIX.length);
  for (const attribute of TYPOGRAPHY_ATTRIBUTES) {
    if (rest.endsWith(`-${attribute}`)) return [rest.slice(0, -(attribute.length + 1)), attribute];
  }
  return undefined;
}

function readTypographyTokens(properties: readonly string[]): TypographyToken[] {
  const tokens = new Map<string, Map<TypographyAttribute, string>>();
  for (const property of properties) {
    if (!property.startsWith(TYPOGRAPHY_PREFIX)) continue;
    const parts = splitTypographyName(property);
    if (parts === undefined) {
      log.warn('ui', `Look-dev: unknown typography attribute in ${property}`);
      continue;
    }
    const [name, attribute] = parts;
    const attributes = tokens.get(name) ?? new Map<TypographyAttribute, string>();
    attributes.set(attribute, property);
    tokens.set(name, attributes);
  }
  return Array.from(tokens, ([name, attributes]) => ({ name, attributes }));
}

function isNumericToken(name: string): boolean {
  return name.startsWith('numeric-');
}

function sampleText(name: string): string {
  if (isNumericToken(name)) return SAMPLE_NUMERIC;
  if (name === 'display-xl' || name === 'display-lg') return SAMPLE_SHORT;
  return SAMPLE_LONG;
}

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

function buildSwatches(root: HTMLElement, colorProperties: readonly string[]): HTMLElement {
  const section = element('section', 'lookdev-swatches');
  section.append(
    element('h2', 'lookdev-heading', `Colour roles (${String(colorProperties.length)})`),
  );
  const grid = element('div', 'lookdev-swatch-grid');
  const computed = getComputedStyle(root);
  for (const property of colorProperties) {
    const role = property.slice(COLOR_PREFIX.length);
    const swatch = element('figure', 'lookdev-swatch');
    swatch.dataset.lookdevSwatch = role;
    // The chip's backing is half light, half dark, so a colour with alpha (the scrim) shows it.
    const chip = element('div', 'lookdev-swatch-chip');
    const fill = element('div', 'lookdev-swatch-fill');
    fill.style.background = `var(${property})`;
    chip.append(fill);
    const caption = element('figcaption', 'lookdev-swatch-caption');
    const value = element(
      'span',
      'lookdev-swatch-value',
      computed.getPropertyValue(property).trim(),
    );
    value.dataset.lookdevSwatchValue = role;
    caption.append(element('span', 'lookdev-swatch-name', role), value);
    swatch.append(chip, caption);
    grid.append(swatch);
  }
  section.append(grid);
  return section;
}

function buildTypeSamples(tokens: readonly TypographyToken[]): {
  section: HTMLElement;
  refreshLabels(): void;
} {
  const section = element('section', 'lookdev-type');
  section.append(element('h2', 'lookdev-heading', `Typography (${String(tokens.length)})`));
  const rows: { label: HTMLElement; sample: HTMLElement; name: string }[] = [];
  for (const token of tokens) {
    const row = element('div', 'lookdev-type-row');
    row.dataset.lookdevType = token.name;
    const label = element('div', 'lookdev-type-label');
    const sample = element('div', 'lookdev-type-sample', sampleText(token.name));
    if (isNumericToken(token.name)) sample.classList.add('lookdev-type-sample-numeric');
    for (const [attribute, property] of token.attributes) {
      sample.style.setProperty(attribute, `var(${property})`);
    }
    row.append(label, sample);
    section.append(row);
    rows.push({ label, sample, name: token.name });
  }
  return {
    section,
    refreshLabels() {
      for (const { label, sample, name } of rows) {
        const style = getComputedStyle(sample);
        const sizePx = Number.parseFloat(style.fontSize);
        // The family each token asks for, so the page shows which face is in use.
        const text = `${name} · ${sizePx.toFixed(1)} px · ${style.fontWeight} · ${style.fontFamily}`;
        if (label.textContent !== text) label.textContent = text;
      }
    },
  };
}

export function mountOverlayView(host: HTMLElement): LookdevViewHandle {
  const overlay = createOverlay(host);
  const rule = findTokenRule();
  if (rule === undefined) {
    overlay.dispose();
    // main.ts shows the message in the page chrome, outside the overlay root.
    throw new Error(`no ${TOKEN_SELECTOR} rule in the loaded style sheets: is base.css loaded?`);
  }

  const properties = Array.from(rule.style).filter((name) => name.startsWith('--'));
  const swatches = buildSwatches(
    overlay.root,
    properties.filter((name) => name.startsWith(COLOR_PREFIX)),
  );
  const type = buildTypeSamples(readTypographyTokens(properties));
  overlay.root.append(swatches, type.section);

  // overlay.ts's resize listener runs first (it was added first), so --tile is already updated.
  const onResize = (): void => {
    type.refreshLabels();
  };
  type.refreshLabels();
  window.addEventListener('resize', onResize);

  return {
    frame() {
      // Static: nothing animates in this view.
    },
    dispose() {
      window.removeEventListener('resize', onResize);
      overlay.dispose();
    },
  };
}

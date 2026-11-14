// DESIGN.md's tokens as CSS custom properties (DESIGN.md, Colors rule 5; architecture, Naming
// Conventions: `--{group}-{name}`). Reads DESIGN.md's frontmatter, lists the properties
// src/ui/styles/base.css must declare, and compares the two. Used by the drift test
// (designTokens.test.ts) and by scripts/checkContrast.ts.
//
// base.css is written by hand (story 0.3, D1). DESIGN.md changes only through `gds-ux` Update;
// base.css follows it, and the drift test fails until it does.
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import { parse } from 'yaml';

export const DESIGN_MD_PATH = fileURLToPath(
  new URL(
    '../_bmad-output/planning-artifacts/ux-designs/ux-emberbound-2026-11-13/DESIGN.md',
    import.meta.url,
  ),
);
export const BASE_CSS_PATH = fileURLToPath(new URL('../src/ui/styles/base.css', import.meta.url));

/**
 * The rule that declares every token: the overlay root, where ui/overlay.ts sets --tile. A token
 * that uses var(--tile) is resolved on the element that declares it, so on :root it would be
 * invalid (story 0.3, D2; checked in Chromium and Firefox).
 */
export const TOKEN_SELECTOR = '.ui-overlay';

/** The frontmatter groups that become custom properties; `components` is not emitted. */
export const TOKEN_GROUPS = ['colors', 'typography', 'rounded', 'spacing'] as const;
export type TokenGroup = (typeof TOKEN_GROUPS)[number];

/** `spacing.tile` is DESIGN.md's formula for --tile, which only ui/overlay.ts sets (UX M3). */
export const SKIPPED_SPACING = 'tile';
/** Prose about tabular figures, not a CSS value (story 0.3, D3). */
export const SKIPPED_TYPOGRAPHY_ATTRIBUTE = 'note';

const TILE_PROPERTY = '--tile';

type FlatGroup = Readonly<Record<string, string>>;

export interface TokenGroups {
  readonly colors: FlatGroup;
  /** Token name → attribute (camelCase, as in DESIGN.md) → value. */
  readonly typography: Readonly<Record<string, FlatGroup>>;
  readonly rounded: FlatGroup;
  readonly spacing: FlatGroup;
}

export interface CustomProperty {
  readonly name: string;
  readonly value: string;
  /** The selector of the rule that declares it, whitespace collapsed. */
  readonly selector: string;
}

/** The YAML between a leading `---` line and the next `---` line. */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** A UTF-8 byte-order mark, which some editors write at the start of a file. */
const BOM = '\uFEFF';

/**
 * Parses YAML with the failsafe schema: every scalar stays the text written in the file, so
 * `1.10` stays `1.10` and `0700` stays `0700` instead of becoming numbers, and an empty value is
 * an empty string. A leading byte-order mark is ignored.
 */
export function parseYaml(text: string): unknown {
  // yaml's parse() returns any; keep it unknown and let the caller narrow it.
  const data: unknown = parse(text.startsWith(BOM) ? text.slice(BOM.length) : text, {
    schema: 'failsafe',
  });
  return data;
}

/** Parses the frontmatter block at the top of a Markdown file. Throws if there is none. */
export function readFrontmatter(markdown: string): unknown {
  const text = markdown.startsWith(BOM) ? markdown.slice(BOM.length) : markdown;
  const match = FRONTMATTER.exec(text);
  if (match === null) throw new Error('No frontmatter: the file must start with a --- block');
  return parseYaml(match[1]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * A token value as text. The failsafe schema already yields strings; numbers and booleans can
 * only come from a caller that built the object itself.
 */
function scalar(value: unknown, path: string): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  throw new Error(`${path}: expected a text value`);
}

function group(frontmatter: Record<string, unknown>, name: string): Record<string, unknown> {
  const value = frontmatter[name];
  if (!isRecord(value)) throw new Error(`${name}: missing from the frontmatter, or not a map`);
  return value;
}

function flatGroup(entries: Record<string, unknown>, path: string): FlatGroup {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(entries)) result[key] = scalar(value, `${path}.${key}`);
  return result;
}

/** Narrows parsed frontmatter to the token groups, naming the path of anything malformed. */
export function readTokenGroups(frontmatter: unknown): TokenGroups {
  if (!isRecord(frontmatter)) throw new Error('DESIGN.md frontmatter: expected a map');
  const typography: Record<string, FlatGroup> = {};
  for (const [token, attributes] of Object.entries(group(frontmatter, 'typography'))) {
    if (!isRecord(attributes)) throw new Error(`typography.${token}: expected a map of attributes`);
    typography[token] = flatGroup(attributes, `typography.${token}`);
  }
  return {
    colors: flatGroup(group(frontmatter, 'colors'), 'colors'),
    typography,
    rounded: flatGroup(group(frontmatter, 'rounded'), 'rounded'),
    spacing: flatGroup(group(frontmatter, 'spacing'), 'spacing'),
  };
}

/** `fontFamily` → `font-family`. */
function kebab(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** A token or role name: lowercase kebab-case, as DESIGN.md writes them (`surface-scrim`, `1`). */
const TOKEN_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** A typography attribute: camelCase, as DESIGN.md writes them (`fontFamily`). */
const ATTRIBUTE_NAME = /^[a-z][a-zA-Z0-9]*$/;

function checkName(name: string, pattern: RegExp, path: string, shape: string): void {
  if (!pattern.test(name)) {
    throw new Error(`${path}: "${name}" can't become a CSS custom property name (${shape})`);
  }
}

/**
 * Every custom property base.css must declare, name → DESIGN.md's value: `--{group}-{name}`,
 * typography one property per attribute (`--typography-{token}-{attribute}`), minus
 * spacing.tile and the typography note. Throws, naming the key, on a name that isn't a CSS
 * identifier in DESIGN.md's style, or on two keys that map to the same property.
 */
export function expectedProperties(groups: TokenGroups): Map<string, string> {
  const properties = new Map<string, string>();
  const sources = new Map<string, string>();
  const add = (property: string, value: string, path: string): void => {
    const earlier = sources.get(property);
    if (earlier !== undefined) throw new Error(`${path} and ${earlier} both become ${property}`);
    sources.set(property, path);
    properties.set(property, value);
  };
  const addFlat = (group: 'colors' | 'rounded' | 'spacing', entries: FlatGroup): void => {
    for (const [name, value] of Object.entries(entries)) {
      if (group === 'spacing' && name === SKIPPED_SPACING) continue;
      checkName(name, TOKEN_NAME, `${group}.${name}`, 'lowercase kebab-case');
      add(`--${group}-${name}`, value, `${group}.${name}`);
    }
  };

  addFlat('colors', groups.colors);
  for (const [token, attributes] of Object.entries(groups.typography)) {
    checkName(token, TOKEN_NAME, `typography.${token}`, 'lowercase kebab-case');
    for (const [attribute, value] of Object.entries(attributes)) {
      if (attribute === SKIPPED_TYPOGRAPHY_ATTRIBUTE) continue;
      const path = `typography.${token}.${attribute}`;
      checkName(attribute, ATTRIBUTE_NAME, path, 'camelCase');
      add(`--typography-${token}-${kebab(attribute)}`, value, path);
    }
  }
  addFlat('rounded', groups.rounded);
  addFlat('spacing', groups.spacing);
  return properties;
}

function collapse(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Every custom property declared in a stylesheet, with its selector. A small scan, not a CSS
 * parser: comments are stripped, then braces are tracked by depth. A nested rule's selector
 * includes its enclosing at-rules (`@media (…) .ui-overlay`), so a token declared only inside
 * `@media` or `@supports` never counts as a plain `.ui-overlay` declaration. A statement at-rule
 * such as `@layer x;` or `@import …;` is skipped. Unbalanced braces throw.
 * Token values hold parentheses and commas, never `;`, `{` or `}`.
 */
export function parseCustomProperties(css: string): CustomProperty[] {
  const properties: CustomProperty[] = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors: string[] = [];
  let start = 0;

  const declaration = (end: number): void => {
    if (selectors.length === 0) return; // a statement at-rule, outside every block
    const match = /^\s*(--[\w-]+)\s*:([\s\S]*)$/.exec(text.slice(start, end));
    if (match !== null) {
      properties.push({ name: match[1], value: match[2].trim(), selector: selectors.join(' ') });
    }
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '{') {
      selectors.push(collapse(text.slice(start, i)));
      start = i + 1;
    } else if (char === '}') {
      if (selectors.length === 0) throw new Error('Unbalanced braces: a } closes nothing');
      declaration(i);
      selectors.pop();
      start = i + 1;
    } else if (char === ';') {
      declaration(i);
      start = i + 1;
    }
  }
  if (selectors.length > 0)
    throw new Error(`Unbalanced braces: "${selectors.join(' ')}" is never closed`);
  return properties;
}

/** The project's Prettier options for CSS, read from its config as `prettier --check` reads them. */
async function prettierOptions(): Promise<Record<string, unknown>> {
  const config = await resolveConfig(BASE_CSS_PATH);
  return { ...config, parser: 'css' };
}

/** The expected properties as one `TOKEN_SELECTOR` rule, written the way Prettier prints it. */
async function formatExpected(expected: ReadonlyMap<string, string>): Promise<Map<string, string>> {
  const body = [...expected].map(([name, value]) => `  ${name}: ${value};`).join('\n');
  const css = await format(`${TOKEN_SELECTOR} {\n${body}\n}\n`, await prettierOptions());
  return new Map(parseCustomProperties(css).map((property) => [property.name, property.value]));
}

/**
 * The drift check: formats DESIGN.md's expected values and base.css with the project's Prettier
 * config, then compares them exactly. `make check` keeps base.css in Prettier's form, which
 * rewrites values (`#0E0F11BF` to `#0e0f11bf`, `"A B"` to `'A B'`, `1.30` to `1.3`), so a
 * DESIGN.md value written either way matches (story 0.3 code review, 2026-11-14).
 */
export async function checkBaseCss(
  expected: ReadonlyMap<string, string>,
  css: string,
): Promise<string[]> {
  const formattedCss = await format(css, await prettierOptions());
  return compareTokens(await formatExpected(expected), formattedCss);
}

function isTokenProperty(name: string): boolean {
  return TOKEN_GROUPS.some((tokenGroup) => name.startsWith(`--${tokenGroup}-`));
}

function byCodeUnit(a: string, b: string): number {
  if (a < b) return -1;
  return a > b ? 1 : 0;
}

/**
 * Compares a stylesheet with the expected properties, value for value, exactly (after trimming).
 * checkBaseCss formats both sides first. Returns one message per problem, sorted, each naming
 * the property: missing, a different value, not a DESIGN.md token, declared twice, declared
 * outside TOKEN_SELECTOR, or --tile declared at all. Empty when the stylesheet matches.
 */
export function compareTokens(expected: ReadonlyMap<string, string>, css: string): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const { name, value, selector } of parseCustomProperties(css)) {
    if (name === TILE_PROPERTY) {
      problems.push(`${TILE_PROPERTY}: must not be declared in base.css; ui/overlay.ts sets it`);
      continue;
    }
    if (!isTokenProperty(name)) continue;
    if (seen.has(name)) {
      problems.push(`${name}: declared twice`);
      continue;
    }
    seen.add(name);
    const designValue = expected.get(name);
    if (designValue === undefined) {
      problems.push(`${name}: not a DESIGN.md token`);
      continue;
    }
    if (selector !== TOKEN_SELECTOR) {
      problems.push(`${name}: declared in "${selector}", not in "${TOKEN_SELECTOR}"`);
    }
    if (value !== designValue.trim()) {
      problems.push(`${name}: base.css has "${value}", DESIGN.md has "${designValue}"`);
    }
  }
  for (const name of expected.keys()) {
    if (!seen.has(name)) problems.push(`${name}: missing from base.css`);
  }
  return problems.sort(byCodeUnit);
}

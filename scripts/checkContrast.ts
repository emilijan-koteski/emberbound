// The contrast check over DESIGN.md's 16 overlay colour roles (DESIGN.md, Colors › Contrast
// targets; UX-DR4). WCAG 2.x contrast from relative luminance. A background with alpha is
// composited over white first, the worst case DESIGN.md states; a foreground with alpha is then
// composited over that background, as it would render.
//
// `make test` runs it on DESIGN.md's colours (checkContrast.test.ts), so a value that misses a
// target fails `make check`. `make contrast COLORS=<file>` runs it on a proposed set before
// DESIGN.md changes: a YAML file with a top-level `colors:` map, or a Markdown file whose
// frontmatter has one (story 0.5 re-measures the style guide's values this way).
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { log } from '../src/core/log.ts';
import { DESIGN_MD_PATH, parseYaml, readFrontmatter } from './designTokens.ts';

/** WCAG 2.x success criterion 1.4.3 (AA), normal text. */
export const TEXT_MIN_RATIO = 4.5;
/** WCAG 2.x success criterion 1.4.11, non-text contrast. */
export const NON_TEXT_MIN_RATIO = 3;

/**
 * WCAG 2.x relative luminance and contrast ratio (https://www.w3.org/TR/WCAG22/#dfn-relative-luminance,
 * #dfn-contrast-ratio). The spec's constants, not tuning numbers.
 */
const WCAG = {
  linearBelow: 0.04045,
  linearDivisor: 12.92,
  gammaOffset: 0.055,
  gammaDivisor: 1.055,
  gamma: 2.4,
  redWeight: 0.2126,
  greenWeight: 0.7152,
  blueWeight: 0.0722,
  flare: 0.05,
} as const;

/** 8-bit channel maximum; also white, the backdrop alpha is composited over. */
const CHANNEL_MAX = 255;

/** DESIGN.md's colour roles (UX-DR2). Role names never change; only values do. */
export const COLOR_ROLES = [
  'surface-screen',
  'surface-scrim',
  'surface-panel',
  'surface-focus',
  'border-subtle',
  'text-primary',
  'text-muted',
  'focus-ring',
  'hud-outline',
  'hud-track',
  'heart-fill',
  'heart-empty',
  'ember',
  'weapon-timer',
  'warden-bar',
  'warning',
] as const;
export type ColorRole = (typeof COLOR_ROLES)[number];
export type Colors = Readonly<Record<ColorRole, string>>;

export interface Rgba {
  /** Channels 0 to 255; fractional after compositing. */
  readonly r: number;
  readonly g: number;
  readonly b: number;
  /** 0 (transparent) to 1 (opaque). */
  readonly a: number;
}

export interface ContrastPair {
  readonly fg: ColorRole;
  readonly bg: ColorRole;
  readonly kind: 'text' | 'non-text';
  /** As the report prints it, e.g. 'Slider fill: text-muted on border-subtle'. */
  readonly label: string;
}

export interface ContrastRow {
  readonly pair: ContrastPair;
  readonly ratio: number;
  /** The minimum ratio, or null for a "never" pair, which is reported but not a target. */
  readonly target: number | null;
  /** False only when the ratio is under its target; true for a "never" pair. */
  readonly passes: boolean;
}

export interface ContrastResult {
  readonly rows: readonly ContrastRow[];
  readonly never: readonly ContrastRow[];
  /** One line per missed target. */
  readonly failures: readonly string[];
}

function pair(
  fg: ColorRole,
  bg: ColorRole,
  kind: ContrastPair['kind'],
  name?: string,
): ContrastPair {
  const label = name === undefined ? `${fg} on ${bg}` : `${name}: ${fg} on ${bg}`;
  return { fg, bg, kind, label };
}

const HUD_FILLS = ['heart-fill', 'ember', 'weapon-timer', 'warden-bar', 'warning'] as const;

/** DESIGN.md's contrast table, in its order: 9 text pairs, then 16 non-text pairs. */
export const PAIRS: readonly ContrastPair[] = [
  pair('text-primary', 'surface-panel', 'text'),
  pair('text-primary', 'surface-screen', 'text'),
  pair('text-primary', 'surface-focus', 'text'),
  pair('text-muted', 'surface-panel', 'text'),
  pair('text-muted', 'surface-screen', 'text'),
  pair('text-muted', 'surface-focus', 'text'),
  pair('text-primary', 'surface-scrim', 'text'),
  pair('text-primary', 'hud-outline', 'text', 'HUD text'),
  pair('surface-panel', 'text-primary', 'text', '"New best" tag'),
  pair('focus-ring', 'surface-panel', 'non-text'),
  pair('focus-ring', 'surface-focus', 'non-text'),
  pair('focus-ring', 'surface-screen', 'non-text'),
  pair('text-muted', 'border-subtle', 'non-text', 'Slider fill'),
  ...HUD_FILLS.map((fill) => pair(fill, 'hud-track', 'non-text')),
  pair('heart-empty', 'hud-track', 'non-text'),
  ...HUD_FILLS.map((fill) => pair(fill, 'hud-outline', 'non-text')),
  // The lost heart's stroke sits in the ring too; DESIGN.md's "6.1 to 19.2" includes it (story 0.3, D7).
  pair('heart-empty', 'hud-outline', 'non-text'),
];

/** Measured and reported, never asserted: DESIGN.md forbids muted text on the scrim (D8). */
export const NEVER_PAIRS: readonly ContrastPair[] = [pair('text-muted', 'surface-scrim', 'text')];

const HEX = /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** `#RRGGBB` or `#RRGGBBAA`, either case; anything else is null. */
export function parseHex(hex: string): Rgba | null {
  if (!HEX.test(hex)) return null;
  const channel = (start: number): number => parseInt(hex.slice(start, start + 2), 16);
  return {
    r: channel(1),
    g: channel(3),
    b: channel(5),
    a: hex.length === 9 ? channel(7) / CHANNEL_MAX : 1,
  };
}

const WHITE: Rgba = { r: CHANNEL_MAX, g: CHANNEL_MAX, b: CHANNEL_MAX, a: 1 };

/**
 * Composites a colour over an opaque backdrop, per channel in gamma-encoded sRGB and without
 * rounding to 8 bits (D6), as browsers blend.
 */
function over(color: Rgba, backdrop: Rgba): Rgba {
  const mix = (c: number, b: number): number => color.a * c + (1 - color.a) * b;
  return {
    r: mix(color.r, backdrop.r),
    g: mix(color.g, backdrop.g),
    b: mix(color.b, backdrop.b),
    a: 1,
  };
}

function linear(channel: number): number {
  const s = channel / CHANNEL_MAX;
  return s <= WCAG.linearBelow
    ? s / WCAG.linearDivisor
    : ((s + WCAG.gammaOffset) / WCAG.gammaDivisor) ** WCAG.gamma;
}

/** WCAG relative luminance of an opaque colour, 0 (black) to 1 (white). */
export function relativeLuminance(rgb: Pick<Rgba, 'r' | 'g' | 'b'>): number {
  return (
    WCAG.redWeight * linear(rgb.r) +
    WCAG.greenWeight * linear(rgb.g) +
    WCAG.blueWeight * linear(rgb.b)
  );
}

function colour(hex: string): Rgba {
  const color = parseHex(hex);
  if (color === null) throw new Error(`Not a #RRGGBB or #RRGGBBAA colour: "${hex}"`);
  return color;
}

/**
 * WCAG contrast ratio, 1 to 21. A background with alpha (today only surface-scrim) is composited
 * over white, DESIGN.md's worst case; a foreground with alpha is composited over that background
 * (story 0.3 code review: over white it would look far lighter than it renders on a dark panel).
 * For opaque colours the order doesn't matter.
 */
export function contrastRatio(fg: string, bg: string): number {
  const background = over(colour(bg), WHITE);
  const a = relativeLuminance(over(colour(fg), background));
  const b = relativeLuminance(background);
  return (Math.max(a, b) + WCAG.flare) / (Math.min(a, b) + WCAG.flare);
}

/**
 * A ratio to 2 decimals, truncated rather than rounded, so a ratio just under its target never
 * prints as the target itself (4.4996 prints 4.49, not 4.50).
 */
export function formatRatio(ratio: number): string {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`;
}

/** Measures every pair. Ratios are compared unrounded, so 4.49 misses 4.5. */
export function checkContrast(colors: Colors): ContrastResult {
  const rows = PAIRS.map((p): ContrastRow => {
    const ratio = contrastRatio(colors[p.fg], colors[p.bg]);
    const target = p.kind === 'text' ? TEXT_MIN_RATIO : NON_TEXT_MIN_RATIO;
    return { pair: p, ratio, target, passes: ratio >= target };
  });
  const never = NEVER_PAIRS.map((p): ContrastRow => ({
    pair: p,
    ratio: contrastRatio(colors[p.fg], colors[p.bg]),
    target: null,
    passes: true,
  }));
  const failures = rows
    .filter((row) => !row.passes)
    .map(
      (row) => `FAIL ${row.pair.label}: ${formatRatio(row.ratio)} is under ${String(row.target)}:1`,
    );
  return { rows, never, failures };
}

/** The report: a header, one line per pair, the "never" pairs, then how many targets were met. */
export function formatContrastReport(result: ContrastResult): string[] {
  const lines = [
    'Contrast (WCAG 2.x; a background with alpha over white, a foreground with alpha over its background):',
  ];
  for (const row of result.rows) {
    const status = row.passes ? 'PASS' : 'FAIL';
    const target = `≥ ${String(row.target)}`.padEnd(5);
    lines.push(`  ${status}  ${formatRatio(row.ratio).padStart(7)} ${target}  ${row.pair.label}`);
  }
  for (const row of result.never) {
    lines.push(
      `  info  ${formatRatio(row.ratio).padStart(7)}        ${row.pair.label} (a "never" rule, DESIGN.md Colors: not a target)`,
    );
  }
  const met = result.rows.filter((row) => row.passes).length;
  lines.push(`${String(met)} of ${String(result.rows.length)} targets met`);
  return lines;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const ROLE_SET: ReadonlySet<string> = new Set(COLOR_ROLES);

const MARKDOWN = /\.(?:md|markdown)$/i;

/** How a non-hex value reads in an error message. */
function describe(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`;
  if (Array.isArray(value)) return 'a list';
  return isRecord(value) ? 'a map' : 'not text';
}

/**
 * Reads the `colors:` map from a YAML file, or from a Markdown file's frontmatter (a path ending
 * in `.md` or `.markdown`, any case). It must hold exactly the 16 roles, each `#RRGGBB` or
 * `#RRGGBBAA`. Throws one error, starting with the path, listing every problem by role.
 */
export function readColors(path: string): Colors {
  let data: unknown;
  try {
    const text = readFileSync(path, 'utf8');
    data = MARKDOWN.test(path) ? readFrontmatter(text) : parseYaml(text);
  } catch (error) {
    throw new Error(`${path}: ${error instanceof Error ? error.message : 'could not be read'}`);
  }
  if (!isRecord(data) || !isRecord(data.colors))
    throw new Error(`${path}: no top-level colors map`);
  const colors = data.colors;

  const problems: string[] = [];
  for (const role of COLOR_ROLES) {
    const value = colors[role];
    if (value === undefined) problems.push(`colors.${role} is missing`);
    else if (value === '') {
      // Under the failsafe schema an unquoted `#E8902E` is a comment, which leaves the value empty.
      problems.push(
        `colors.${role} is empty: in YAML an unquoted # starts a comment, so quote hex values ('#E8902E')`,
      );
    } else if (typeof value !== 'string' || parseHex(value) === null) {
      problems.push(`colors.${role} is not a #RRGGBB or #RRGGBBAA colour: ${describe(value)}`);
    }
  }
  for (const key of Object.keys(colors)) {
    if (!ROLE_SET.has(key)) problems.push(`colors.${key} is not a DESIGN.md colour role`);
  }
  if (problems.length > 0) throw new Error(`${path}:\n  ${problems.join('\n  ')}`);

  // Every role is present and a string, checked above.
  return Object.fromEntries(COLOR_ROLES.map((role) => [role, colors[role]])) as Colors;
}

function main(argv: readonly string[]): number {
  if (argv.length > 3) {
    log.error('ui', 'Usage: node scripts/checkContrast.ts [colours-file]  (one file at most)');
    return 1;
  }
  const path = argv.at(2) ?? DESIGN_MD_PATH;
  let colors: Colors;
  try {
    colors = readColors(path);
  } catch (error) {
    log.error('ui', error instanceof Error ? error.message : `${path}: could not read the colours`);
    return 1;
  }

  const result = checkContrast(colors);
  for (const line of formatContrastReport(result)) log.info('ui', line);
  if (result.failures.length > 0) {
    for (const failure of result.failures) log.error('ui', failure);
    return 1;
  }
  log.info(
    'ui',
    `Contrast OK: ${String(result.rows.length)} pairs, every target met (${relative(process.cwd(), path)})`,
  );
  return 0;
}

// Only when Node runs this file, never when a test imports it. process.exitCode, not
// process.exit(), so the output is flushed first.
if (import.meta.main) process.exitCode = main(process.argv);

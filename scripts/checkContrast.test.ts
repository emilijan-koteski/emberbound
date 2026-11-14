import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import {
  COLOR_ROLES,
  NEVER_PAIRS,
  NON_TEXT_MIN_RATIO,
  PAIRS,
  TEXT_MIN_RATIO,
  checkContrast,
  contrastRatio,
  formatContrastReport,
  formatRatio,
  parseHex,
  readColors,
  relativeLuminance,
} from './checkContrast.ts';
import { DESIGN_MD_PATH } from './designTokens.ts';
import type { SpawnSyncReturns } from 'node:child_process';
import type { ColorRole, Colors, ContrastRow } from './checkContrast.ts';

/**
 * A FROZEN copy of DESIGN.md's provisional colours (2026-11-13). Story 0.14 replaces DESIGN.md's
 * values; these stay, so the maths keeps being tested against DESIGN.md's published table.
 * The live DESIGN.md values are checked separately, below.
 */
const PROVISIONAL: Colors = {
  'surface-screen': '#0E0F11',
  'surface-scrim': '#0E0F11BF',
  'surface-panel': '#18191C',
  'surface-focus': '#2B2E33',
  'border-subtle': '#3A3D43',
  'text-primary': '#ECECEC',
  'text-muted': '#A3A6AB',
  'focus-ring': '#AEBBC9',
  'hud-outline': '#0E0F11',
  'hud-track': '#232529',
  'heart-fill': '#E6E6E6',
  'heart-empty': '#8E9196',
  ember: '#E8902E',
  'weapon-timer': '#C8CED6',
  'warden-bar': '#A9B3BD',
  warning: '#FFFFFF',
};

/** DESIGN.md's contrast table (Colors, Contrast targets), measured on the provisional values. */
const DESIGN_TABLE: readonly (readonly [ColorRole, ColorRole, number])[] = [
  ['text-primary', 'surface-panel', 14.9],
  ['text-primary', 'surface-screen', 16.2],
  ['text-primary', 'surface-focus', 11.5],
  ['text-muted', 'surface-panel', 7.2],
  ['text-muted', 'surface-screen', 7.9],
  ['text-muted', 'surface-focus', 5.6],
  ['text-primary', 'surface-scrim', 7.4],
  ['text-muted', 'surface-scrim', 3.6],
  ['text-primary', 'hud-outline', 16.2],
  ['surface-panel', 'text-primary', 14.9],
  ['focus-ring', 'surface-panel', 9.0],
  ['focus-ring', 'surface-focus', 7.0],
  ['focus-ring', 'surface-screen', 9.8],
  ['text-muted', 'border-subtle', 4.5],
  ['heart-fill', 'hud-track', 12.3],
  ['ember', 'hud-track', 6.2],
  ['weapon-timer', 'hud-track', 9.7],
  ['warden-bar', 'hud-track', 7.2],
  ['warning', 'hud-track', 15.4],
  ['heart-empty', 'hud-track', 4.9],
];
/** DESIGN.md's "HUD fills against hud-outline: 6.1 to 19.2" (heart-empty is the 6.1, D7). */
const OUTLINE_RANGE = { lowest: 6.1, highest: 19.2 } as const;
const TOLERANCE = 0.1;

/** The colours with one role left out, as a proposal file missing that role would hold. */
function without(colors: Colors, role: ColorRole): Record<string, string> {
  return Object.fromEntries(Object.entries(colors).filter(([key]) => key !== role));
}

function rowFor(rows: readonly ContrastRow[], fg: ColorRole, bg: ColorRole): ContrastRow {
  const row = rows.find((r) => r.pair.fg === fg && r.pair.bg === bg);
  if (row === undefined) throw new Error(`no row for ${fg} on ${bg}`);
  return row;
}

/** A grey (#gggggg) whose contrast against white lies in [target − 0.05, target). */
function greyJustUnder(target: number): string {
  for (let g = 0; g <= 255; g++) {
    const hex = `#${g.toString(16).padStart(2, '0').repeat(3)}`;
    const ratio = contrastRatio(hex, '#FFFFFF');
    if (ratio < target && ratio >= target - 0.05) return hex;
  }
  throw new Error(`no grey just under ${target.toFixed(2)}:1 on white`);
}

describe('contrastRatio against DESIGN.md (frozen provisional values)', () => {
  const result = checkContrast(PROVISIONAL);
  const allRows = [...result.rows, ...result.never];

  it.each(DESIGN_TABLE)('%s on %s measures %s, within 0.1', (fg, bg, published) => {
    expect(Math.abs(rowFor(allRows, fg, bg).ratio - published)).toBeLessThanOrEqual(TOLERANCE);
  });

  it('reproduces the hud-outline range, heart-empty included', () => {
    const outline = result.rows.filter(
      (r) => r.pair.bg === 'hud-outline' && r.pair.fg !== 'text-primary',
    );
    expect(outline.map((r) => r.pair.fg).sort()).toEqual(
      ['heart-fill', 'ember', 'weapon-timer', 'warden-bar', 'warning', 'heart-empty'].sort(),
    );
    const ratios = outline.map((r) => r.ratio);
    expect(Math.abs(Math.min(...ratios) - OUTLINE_RANGE.lowest)).toBeLessThanOrEqual(TOLERANCE);
    expect(Math.abs(Math.max(...ratios) - OUTLINE_RANGE.highest)).toBeLessThanOrEqual(TOLERANCE);
  });

  it('meets every target, and reports text-muted on the scrim without failing it', () => {
    expect(result.failures).toEqual([]);
    const never = rowFor(result.never, 'text-muted', 'surface-scrim');
    expect(never.ratio).toBeLessThan(TEXT_MIN_RATIO);
    expect(never.target).toBeNull();
  });
});

describe('the live DESIGN.md colours', () => {
  it('meet every contrast target', () => {
    expect(checkContrast(readColors(DESIGN_MD_PATH)).failures).toEqual([]);
  });
});

describe('the WCAG maths', () => {
  it('gives 21 for black on white, 1 for a colour on itself, either way round', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 10);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 10);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
    expect(contrastRatio('#E8902E', '#232529')).toBe(contrastRatio('#232529', '#E8902E'));
  });

  it('gives luminance 0 for black and 1 for white', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 10);
  });
});

describe('alpha', () => {
  it('treats full alpha as opaque and zero alpha as white', () => {
    expect(contrastRatio('#000000FF', '#FFFFFF')).toBe(contrastRatio('#000000', '#FFFFFF'));
    expect(contrastRatio('#00000000', '#FFFFFF')).toBe(1);
  });

  it('composites a foreground with alpha over its background, not over white', () => {
    // White at 25 % on the panel renders about #525355: 2.28:1, not 17.58:1 as over white.
    const ratio = contrastRatio('#FFFFFF40', PROVISIONAL['surface-panel']);
    expect(Math.abs(ratio - contrastRatio('#525355', PROVISIONAL['surface-panel']))).toBeLessThan(
      0.05,
    );
    expect(ratio).toBeLessThan(NON_TEXT_MIN_RATIO);
  });

  it('composites a foreground with alpha over a background that has alpha too', () => {
    // The scrim over white is about #4a4b4d; a half-black foreground over that is about #252526.
    expect(
      Math.abs(contrastRatio('#00000080', '#0E0F11BF') - contrastRatio('#252526', '#4a4b4d')),
    ).toBeLessThan(0.05);
  });

  it('composites the scrim over white to about #4a4b4d', () => {
    // The scrim is always a background. Against a black foreground the ratio is
    // (L + 0.05) / 0.05, so luminance is 0.05 × (ratio − 1).
    const luminanceOf = (hex: string): number => 0.05 * (contrastRatio('#000000', hex) - 1);
    const composite = luminanceOf(PROVISIONAL['surface-scrim']);
    const expected = relativeLuminance({ r: 0x4a, g: 0x4b, b: 0x4d });
    expect(Math.abs(composite - expected)).toBeLessThan(0.001);
  });
});

describe('thresholds', () => {
  it('fails a text pair just under the text target: no rounding up', () => {
    const grey = greyJustUnder(TEXT_MIN_RATIO);
    const result = checkContrast({
      ...PROVISIONAL,
      'surface-panel': '#FFFFFF',
      'text-primary': grey,
    });
    const row = rowFor(result.rows, 'text-primary', 'surface-panel');
    expect(row.ratio).toBeGreaterThanOrEqual(TEXT_MIN_RATIO - 0.05);
    expect(row.passes).toBe(false);
    expect(result.failures.some((f) => f.includes('text-primary on surface-panel'))).toBe(true);
  });

  it('fails a non-text pair just under the non-text target', () => {
    const grey = greyJustUnder(NON_TEXT_MIN_RATIO);
    const result = checkContrast({
      ...PROVISIONAL,
      'surface-panel': '#FFFFFF',
      'focus-ring': grey,
    });
    const row = rowFor(result.rows, 'focus-ring', 'surface-panel');
    expect(row.target).toBe(NON_TEXT_MIN_RATIO);
    expect(row.passes).toBe(false);
  });
});

describe('the pair table', () => {
  it('holds 9 text pairs at the text target and 16 non-text pairs at the non-text target', () => {
    expect(PAIRS.filter((p) => p.kind === 'text')).toHaveLength(9);
    expect(PAIRS.filter((p) => p.kind === 'non-text')).toHaveLength(16);
    const result = checkContrast(PROVISIONAL);
    for (const row of result.rows) {
      expect(row.target).toBe(row.pair.kind === 'text' ? TEXT_MIN_RATIO : NON_TEXT_MIN_RATIO);
    }
  });

  it('has no pair twice', () => {
    const keys = [...PAIRS, ...NEVER_PAIRS].map((p) => `${p.fg}|${p.bg}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('checks every colour role somewhere', () => {
    const used = new Set([...PAIRS, ...NEVER_PAIRS].flatMap((p) => [p.fg, p.bg]));
    expect(COLOR_ROLES.filter((role) => !used.has(role))).toEqual([]);
  });

  it('keeps text-muted on the scrim as the only "never" pair', () => {
    expect(NEVER_PAIRS.map((p) => `${p.fg} on ${p.bg}`)).toEqual(['text-muted on surface-scrim']);
  });
});

describe('a failing proposal', () => {
  it('fails exactly the pairs the darker text-muted breaks, naming each with its ratio', () => {
    const result = checkContrast({ ...PROVISIONAL, 'text-muted': '#6B6E73' });
    const failed = result.rows.filter((r) => !r.passes).map((r) => `${r.pair.fg} on ${r.pair.bg}`);
    expect(failed.sort()).toEqual(
      [
        'text-muted on surface-panel',
        'text-muted on surface-screen',
        'text-muted on surface-focus',
        'text-muted on border-subtle',
      ].sort(),
    );
    expect(result.failures).toHaveLength(failed.length);
    for (const failure of result.failures) expect(failure).toMatch(/text-muted on .+: \d+\.\d\d:1/);
  });
});

describe('formatContrastReport', () => {
  it('has one line per pair, the never pair, and a summary', () => {
    const result = checkContrast(PROVISIONAL);
    const lines = formatContrastReport(result);
    expect(lines.filter((l) => /\bPASS\b|\bFAIL\b/.test(l))).toHaveLength(PAIRS.length);
    expect(lines.filter((l) => l.includes('info'))).toHaveLength(NEVER_PAIRS.length);
    const panel = rowFor(result.rows, 'text-primary', 'surface-panel');
    expect(lines.some((l) => l.includes(formatRatio(panel.ratio)))).toBe(true);
  });

  it('marks a failing pair FAIL', () => {
    const lines = formatContrastReport(checkContrast({ ...PROVISIONAL, 'text-muted': '#6B6E73' }));
    expect(lines.filter((l) => l.includes('FAIL'))).toHaveLength(4);
  });
});

describe('formatRatio', () => {
  it('truncates to 2 decimals, so a ratio just under a target never prints as the target', () => {
    expect(formatRatio(TEXT_MIN_RATIO - 0.0004)).toBe('4.49:1');
    expect(formatRatio(TEXT_MIN_RATIO)).toBe('4.50:1');
    expect(formatRatio(14.8797)).toBe('14.87:1');
  });
});

describe('parseHex', () => {
  it('accepts #RRGGBB and #RRGGBBAA in either case', () => {
    expect(parseHex('#abcdef')).toEqual({ r: 0xab, g: 0xcd, b: 0xef, a: 1 });
    expect(parseHex('#ABCDEF80')).toEqual({ r: 0xab, g: 0xcd, b: 0xef, a: 0x80 / 255 });
  });

  it.each(['#abc', 'abcdef', 'orange', '#abcdefg', '#abcdef8', ' #abcdef', ''])(
    'rejects %j',
    (value) => {
      expect(parseHex(value)).toBeNull();
    },
  );
});

describe('readColors', () => {
  const roots: string[] = [];
  afterEach(() => {
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  });

  function colorsYaml(colors: Record<string, string>): string {
    return `colors:\n${Object.entries(colors)
      .map(([role, value]) => `  ${role}: '${value}'`)
      .join('\n')}\n`;
  }

  function write(name: string, content: string): string {
    const root = mkdtempSync(join(tmpdir(), 'contrast-'));
    roots.push(root);
    const path = join(root, name);
    writeFileSync(path, content);
    return path;
  }

  it('reads a YAML file with a colors map', () => {
    expect(readColors(write('proposal.yaml', colorsYaml(PROVISIONAL)))).toEqual(PROVISIONAL);
  });

  it('reads the frontmatter of a Markdown file', () => {
    const md = `---\nname: Proposal\n${colorsYaml(PROVISIONAL)}---\n\n# Body\n`;
    expect(readColors(write('STYLE.md', md))).toEqual(PROVISIONAL);
  });

  it('throws, naming the role, on a missing role, an extra role or a bad value', () => {
    const withoutEmber = without(PROVISIONAL, 'ember');
    expect(() => readColors(write('a.yaml', colorsYaml(withoutEmber)))).toThrow(/ember/);
    expect(() =>
      readColors(write('b.yaml', colorsYaml({ ...PROVISIONAL, glow: '#fff000' }))),
    ).toThrow(/glow/);
    expect(() =>
      readColors(write('c.yaml', colorsYaml({ ...PROVISIONAL, ember: 'orange' }))),
    ).toThrow(/ember/);
  });

  it('explains an unquoted hex, which YAML reads as a comment', () => {
    const unquoted = colorsYaml(PROVISIONAL).replace("ember: '#E8902E'", 'ember: #E8902E');
    expect(() => readColors(write('e.yaml', unquoted))).toThrow(/colors\.ember is empty.*quote/);
  });

  it('describes a non-text value as a map or a list', () => {
    const asMap = colorsYaml(PROVISIONAL).replace("ember: '#E8902E'", 'ember: { r: 1 }');
    expect(() => readColors(write('f.yaml', asMap))).toThrow(/colors\.ember .*: a map/);
  });

  it('reads Markdown by extension in any case, and .markdown, and ignores a byte-order mark', () => {
    const md = `\uFEFF---\n${colorsYaml(PROVISIONAL)}---\n`;
    expect(readColors(write('STYLE.MD', md))).toEqual(PROVISIONAL);
    expect(readColors(write('style.markdown', md))).toEqual(PROVISIONAL);
    expect(readColors(write('bom.yaml', `\uFEFF${colorsYaml(PROVISIONAL)}`))).toEqual(PROVISIONAL);
  });

  it('names the file when a Markdown file has no frontmatter', () => {
    const path = write('empty.md', '# No frontmatter\n');
    expect(() => readColors(path)).toThrow(`${path}: No frontmatter`);
  });

  it('throws when there is no colors map', () => {
    expect(() => readColors(write('d.yaml', 'palette: {}\n'))).toThrow(/colors/);
  });
});

describe('the command line, run as make contrast runs it', () => {
  // A real `node scripts/checkContrast.ts [file]` subprocess: exit codes, the import.meta.main
  // guard, and imports that Node can run natively (Vitest transforms TypeScript; Node only strips).
  const roots: string[] = [];
  afterEach(() => {
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  });

  function proposal(colors: Record<string, string>): string {
    const root = mkdtempSync(join(tmpdir(), 'contrast-cli-'));
    roots.push(root);
    const path = join(root, 'proposal.yaml');
    writeFileSync(
      path,
      `colors:\n${Object.entries(colors)
        .map(([role, value]) => `  ${role}: '${value}'`)
        .join('\n')}\n`,
    );
    return path;
  }

  // Absolute paths and an explicit cwd, so the tests pass from any working directory.
  const script = fileURLToPath(new URL('./checkContrast.ts', import.meta.url));
  const repoRoot = fileURLToPath(new URL('..', import.meta.url));

  function run(...args: string[]): SpawnSyncReturns<string> {
    return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', cwd: repoRoot });
  }

  it('exits 0 on DESIGN.md by default', () => {
    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Contrast OK');
  });

  it('exits 1 and names the pair on a failing proposal', () => {
    const result = run(proposal({ ...PROVISIONAL, 'text-muted': '#6B6E73' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('text-muted on surface-focus');
  });

  it('exits 1 and names the role when one is missing', () => {
    const withoutWarning = without(PROVISIONAL, 'warning');
    const result = run(proposal(withoutWarning));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('warning');
  });

  it('exits 1 on more than one file, rather than ignoring the rest', () => {
    const file = proposal(PROVISIONAL);
    const result = run(file, file);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('one file at most');
  });

  it('exits 1 on a file that does not exist', () => {
    const result = run(join(tmpdir(), 'no-such-proposal.yaml'));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('no-such-proposal.yaml');
  });
});

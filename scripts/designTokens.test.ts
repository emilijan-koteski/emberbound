import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  BASE_CSS_PATH,
  DESIGN_MD_PATH,
  SKIPPED_SPACING,
  SKIPPED_TYPOGRAPHY_ATTRIBUTE,
  TOKEN_SELECTOR,
  checkBaseCss,
  compareTokens,
  expectedProperties,
  parseCustomProperties,
  readFrontmatter,
  readTokenGroups,
} from './designTokens.ts';

const designMd = readFileSync(DESIGN_MD_PATH, 'utf8');
const designGroups = readTokenGroups(readFrontmatter(designMd));

/** A one-rule stylesheet on the token selector. */
function rule(body: string, selector: string = TOKEN_SELECTOR): string {
  return `${selector} {\n${body}\n}\n`;
}

function props(entries: Record<string, string>): Map<string, string> {
  return new Map(Object.entries(entries));
}

describe('base.css against DESIGN.md (the drift test)', () => {
  it('declares every DESIGN.md token with its value, and nothing else', async () => {
    const problems = await checkBaseCss(
      expectedProperties(designGroups),
      readFileSync(BASE_CSS_PATH, 'utf8'),
    );
    // toEqual([]) prints every message on failure, so each drifted token is named.
    expect(problems).toEqual([]);
  });
});

describe('expectedProperties on DESIGN.md', () => {
  const expected = expectedProperties(designGroups);

  it('has one property per colour, typography attribute, radius and spacing entry, minus the skipped ones', () => {
    // Counted from the frontmatter, never a fixed number, so a DESIGN.md update can't break it.
    const typographyAttributes = Object.values(designGroups.typography)
      .flatMap((attributes) => Object.keys(attributes))
      .filter((attribute) => attribute !== SKIPPED_TYPOGRAPHY_ATTRIBUTE).length;
    const spacing = Object.keys(designGroups.spacing).filter(
      (name) => name !== SKIPPED_SPACING,
    ).length;
    expect(expected.size).toBe(
      Object.keys(designGroups.colors).length +
        typographyAttributes +
        Object.keys(designGroups.rounded).length +
        spacing,
    );
  });

  it('names properties --{group}-{name}, typography per attribute in kebab-case', () => {
    expect(expected.get('--colors-surface-scrim')).toBe(designGroups.colors['surface-scrim']);
    expect(expected.has('--typography-display-body-font-size')).toBe(true);
    expect(expected.has('--typography-ui-sm-letter-spacing')).toBe(true);
    expect(expected.has('--spacing-safe-margin')).toBe(true);
    expect(expected.has('--rounded-full')).toBe(true);
  });

  it('skips spacing.tile, the typography note and the components', () => {
    expect(expected.has('--spacing-tile')).toBe(false);
    expect(expected.has('--typography-numeric-lg-note')).toBe(false);
    expect([...expected.keys()].filter((name) => name.startsWith('--components-'))).toEqual([]);
  });
});

describe('readTokenGroups and expectedProperties on fixtures', () => {
  const minimal = {
    colors: { ink: '#000000' },
    typography: { t: { fontFamily: 'a', lineHeight: '1', note: 'prose' } },
    rounded: { none: '0' },
    spacing: { tile: 'formula', '1': 'calc(var(--tile) * 0.05)' },
  };

  it('turns camelCase typography attributes into kebab-case and skips only the note', () => {
    expect(expectedProperties(readTokenGroups(minimal))).toEqual(
      props({
        '--colors-ink': '#000000',
        '--typography-t-font-family': 'a',
        '--typography-t-line-height': '1',
        '--rounded-none': '0',
        '--spacing-1': 'calc(var(--tile) * 0.05)',
      }),
    );
  });

  it('turns a number scalar into a string', () => {
    expect(
      expectedProperties(readTokenGroups({ ...minimal, rounded: { none: 0 } })).get(
        '--rounded-none',
      ),
    ).toBe('0');
  });

  it('throws, naming the group, when a group is missing', () => {
    const withoutColors = Object.fromEntries(
      Object.entries(minimal).filter(([key]) => key !== 'colors'),
    );
    expect(() => readTokenGroups(withoutColors)).toThrow(/colors/);
  });

  it('throws, naming the path, when a value is a map', () => {
    expect(() => readTokenGroups({ ...minimal, colors: { ink: { r: 0 } } })).toThrow(/colors\.ink/);
    expect(() =>
      readTokenGroups({ ...minimal, typography: { t: { fontSize: { min: '1px' } } } }),
    ).toThrow(/typography\.t\.fontSize/);
  });

  it('throws, naming the key, on a name that is not a CSS identifier', () => {
    expect(() =>
      expectedProperties(readTokenGroups({ ...minimal, colors: { 'text primary': '#000000' } })),
    ).toThrow(/colors\.text primary/);
    expect(() =>
      expectedProperties(readTokenGroups({ ...minimal, colors: { 'a.b': '#000000' } })),
    ).toThrow(/colors\.a\.b/);
    expect(() =>
      expectedProperties(
        readTokenGroups({ ...minimal, typography: { t: { 'font-size': '1px' } } }),
      ),
    ).toThrow(/typography\.t\.font-size/);
  });

  it('throws when two keys become the same property', () => {
    const colliding = {
      ...minimal,
      typography: { display: { xlFontSize: 'a' }, 'display-xl': { fontSize: 'b' } },
    };
    expect(() => expectedProperties(readTokenGroups(colliding))).toThrow(
      /--typography-display-xl-font-size/,
    );
  });

  it('throws when the frontmatter is not a map', () => {
    expect(() => readTokenGroups('colors')).toThrow(/frontmatter/);
    expect(() => readTokenGroups(null)).toThrow(/frontmatter/);
  });
});

describe('readFrontmatter', () => {
  it('parses the block between the first two --- lines', () => {
    expect(readFrontmatter('---\nname: x\nlist: [1, 2]\n---\n\n# Body\n')).toEqual({
      name: 'x',
      list: ['1', '2'],
    });
  });

  it('accepts CRLF line endings', () => {
    expect(readFrontmatter('---\r\nname: x\r\n---\r\nbody')).toEqual({ name: 'x' });
  });

  it('ignores a UTF-8 byte-order mark', () => {
    expect(readFrontmatter('\uFEFF---\nname: x\n---\n')).toEqual({ name: 'x' });
  });

  it('keeps every value as the text written, never a number', () => {
    expect(readFrontmatter("---\na: 1.10\nb: 0700\nc: 9999px\nd: '#E8902E'\n---\n")).toEqual({
      a: '1.10',
      b: '0700',
      c: '9999px',
      d: '#E8902E',
    });
  });

  it('throws on text without a frontmatter block', () => {
    expect(() => readFrontmatter('# Just a heading\n')).toThrow(/frontmatter/);
    expect(() => readFrontmatter('text\n---\nname: x\n---\n')).toThrow(/frontmatter/);
  });
});

describe('compareTokens (exact, after trimming)', () => {
  const expected = props({ '--colors-ink': '#0e0f11bf', '--rounded-sm': '2px' });

  it('passes a stylesheet that matches', () => {
    expect(
      compareTokens(expected, rule('  --colors-ink: #0e0f11bf;\n  --rounded-sm: 2px;')),
    ).toEqual([]);
  });

  it('names a missing token', () => {
    expect(compareTokens(expected, rule('  --colors-ink: #0e0f11bf;'))).toEqual([
      '--rounded-sm: missing from base.css',
    ]);
  });

  it('names a different value and quotes both', () => {
    expect(
      compareTokens(expected, rule('  --colors-ink: #0e0f11bf;\n  --rounded-sm: 3px;')),
    ).toEqual(['--rounded-sm: base.css has "3px", DESIGN.md has "2px"']);
  });

  it('names a token property DESIGN.md does not have, in every token group', () => {
    const css = rule(
      [
        '  --colors-ink: #0e0f11bf;',
        '  --rounded-sm: 2px;',
        '  --colors-extra: #fff;',
        '  --typography-x-font-size: 1px;',
        '  --rounded-x: 0;',
        '  --spacing-x: 0;',
      ].join('\n'),
    );
    expect(compareTokens(expected, css)).toEqual([
      '--colors-extra: not a DESIGN.md token',
      '--rounded-x: not a DESIGN.md token',
      '--spacing-x: not a DESIGN.md token',
      '--typography-x-font-size: not a DESIGN.md token',
    ]);
  });

  it('names a token declared twice', () => {
    const css = rule('  --colors-ink: #0e0f11bf;\n  --rounded-sm: 2px;\n  --rounded-sm: 2px;');
    expect(compareTokens(expected, css)).toEqual(['--rounded-sm: declared twice']);
  });

  it('names a token declared outside the token selector', () => {
    const css = rule('  --colors-ink: #0e0f11bf;') + rule('  --rounded-sm: 2px;', ':root');
    expect(compareTokens(expected, css)).toEqual([
      `--rounded-sm: declared in ":root", not in "${TOKEN_SELECTOR}"`,
    ]);
  });

  it('fails a --tile declaration anywhere', () => {
    const css = rule('  --colors-ink: #0e0f11bf;\n  --rounded-sm: 2px;\n  --tile: 67px;');
    expect(compareTokens(expected, css)).toEqual([
      '--tile: must not be declared in base.css; ui/overlay.ts sets it',
    ]);
    expect(compareTokens(expected, css + rule('  --tile: 1px;', 'body'))).toHaveLength(2);
  });

  it('ignores custom properties outside the token groups', () => {
    const css = rule('  --colors-ink: #0e0f11bf;\n  --rounded-sm: 2px;\n  --font-display: Serif;');
    expect(compareTokens(expected, css)).toEqual([]);
  });
});

describe('checkBaseCss (both sides formatted with Prettier)', () => {
  it('matches values Prettier rewrites: hex case, quotes, zeros and spacing', async () => {
    const expected = props({
      '--colors-ink': '#0E0F11BF',
      '--typography-t-font-family': '"Ember Sans", system-ui',
      '--typography-t-line-height': '1.30',
      '--typography-t-letter-spacing': '.02em',
      '--spacing-1': 'calc(var(--tile)*0.05)',
    });
    const css = rule(
      [
        '  --colors-ink: #0e0f11bf;',
        "  --typography-t-font-family: 'Ember Sans', system-ui;",
        '  --typography-t-line-height: 1.3;',
        '  --typography-t-letter-spacing: 0.02em;',
        '  --spacing-1: calc(var(--tile)   *\n    0.05);',
      ].join('\n'),
    );
    expect(await checkBaseCss(expected, css)).toEqual([]);
  });

  it('still tells 0 from 0px, and 700 from bold', async () => {
    const expected = props({ '--rounded-none': '0', '--typography-t-font-weight': '700' });
    const css = rule('  --rounded-none: 0px;\n  --typography-t-font-weight: bold;');
    expect(await checkBaseCss(expected, css)).toEqual([
      '--rounded-none: base.css has "0px", DESIGN.md has "0"',
      '--typography-t-font-weight: base.css has "bold", DESIGN.md has "700"',
    ]);
  });
});

describe('parseCustomProperties', () => {
  it('reads each declaration with its rule selector, and skips comments', () => {
    const css = [
      '/* header: --colors-fake: #000; */',
      `${TOKEN_SELECTOR} {`,
      '  /* colors */',
      '  --colors-ink: #000; /* trailing note */',
      '  /* --colors-commented: #fff; */',
      '}',
    ].join('\n');
    expect(parseCustomProperties(css)).toEqual([
      { name: '--colors-ink', value: '#000', selector: TOKEN_SELECTOR },
    ]);
  });

  it('accepts other rules, such as a later @font-face, and ordinary declarations', () => {
    const css = [
      '@font-face {',
      '  font-family: Display;',
      "  src: url('./fonts/display.woff2') format('woff2');",
      '}',
      `${TOKEN_SELECTOR} {`,
      '  --colors-ink: #000;',
      '  color: var(--colors-ink);',
      '}',
    ].join('\n');
    expect(parseCustomProperties(css)).toEqual([
      { name: '--colors-ink', value: '#000', selector: TOKEN_SELECTOR },
    ]);
  });

  it('keeps parentheses and commas inside a value', () => {
    const css = rule('  --typography-t-font-size: max(16px, calc(var(--tile) * 0.3));');
    expect(parseCustomProperties(css)).toEqual([
      {
        name: '--typography-t-font-size',
        value: 'max(16px, calc(var(--tile) * 0.3))',
        selector: TOKEN_SELECTOR,
      },
    ]);
  });

  it('keeps the enclosing at-rule in a nested selector, so a token inside @media is misplaced', () => {
    const css = '@media (min-width: 1px) {\n  .ui-overlay {\n    --colors-ink: #000;\n  }\n}\n';
    expect(parseCustomProperties(css)).toEqual([
      { name: '--colors-ink', value: '#000', selector: '@media (min-width: 1px) .ui-overlay' },
    ]);
    expect(compareTokens(props({ '--colors-ink': '#000' }), css)).toEqual([
      `--colors-ink: declared in "@media (min-width: 1px) .ui-overlay", not in "${TOKEN_SELECTOR}"`,
    ]);
  });

  it('skips statement at-rules before a rule', () => {
    const css =
      '@charset "utf-8";\n@layer tokens;\n@import url(a.css);\n' + rule('  --colors-ink: #000;');
    expect(parseCustomProperties(css)).toEqual([
      { name: '--colors-ink', value: '#000', selector: TOKEN_SELECTOR },
    ]);
  });

  it('reads a last declaration without a semicolon', () => {
    expect(parseCustomProperties(`${TOKEN_SELECTOR} { --colors-ink: #000 }`)).toEqual([
      { name: '--colors-ink', value: '#000', selector: TOKEN_SELECTOR },
    ]);
  });

  it('throws on unbalanced braces', () => {
    expect(() => parseCustomProperties(rule('  --colors-ink: #000;') + '}')).toThrow(/Unbalanced/);
    expect(() => parseCustomProperties(`${TOKEN_SELECTOR} {\n  --colors-ink: #000;\n`)).toThrow(
      /never closed/,
    );
  });
});

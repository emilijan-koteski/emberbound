// The shader boundary as text (story 0.9, AC4–AC5; AR160): GLSL only in render/materials/, and no
// colour literal in its code. ESLint covers the imports and onBeforeCompile; this covers what an
// import ban can't see, such as GLSL pasted into a string. Files are read through Vite's raw glob,
// not node:fs, since render/ may not use Node built-ins, tests included (story 0.7, D7).
import { describe, expect, it } from 'vitest';

const SOURCES = import.meta.glob<string>('/src/**/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const SHADER_FILES = import.meta.glob<string>('/src/**/*.{glsl,vert,frag}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const MATERIALS = '/src/render/materials/';

/** Text that only shader code contains. */
const GLSL_MARKERS: readonly RegExp[] = [
  /\bgl_(?:FragColor|Position|FrontFacing|FragCoord|PointSize)\b/,
  /#include\s*</,
  /\bvoid\s+main\s*\(/,
  /\bprecision\s+(?:lowp|mediump|highp)\b/,
  /\b(?:uniform|varying|attribute)\s+(?:(?:lowp|mediump|highp)\s+)?(?:float|u?int|bool|[iu]?vec[234]|mat[234](?:x[234])?|[iu]?sampler\w+)\b/,
  /\bout\s+(?:(?:lowp|mediump|highp)\s+)?vec4\b/,
  /\blayout\s*\(\s*(?:location|std140|binding)\b/,
  /\/\*\s*glsl\s*\*\//i,
];

/**
 * A colour written as a literal: #RGB, #RGBA, #RRGGBB or #RRGGBBAA as a whole token (not a private
 * field such as `this.#add`), 0xRRGGBB(AA), or a Color constructor or setter given a number or a
 * string rather than a palette slot.
 */
const COLOUR_LITERAL =
  /(?<![\w#.])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?!\w)|\b0x[0-9a-f]{6}(?:[0-9a-f]{2})?\b|\b(?:new\s+Color|\.set(?:RGB|Hex|HSL|Style))\s*\(\s*['"\d.-]/i;

function glslIn(source: string): string | null {
  for (const marker of GLSL_MARKERS) {
    const match = marker.exec(source);
    if (match !== null) return match[0];
  }
  return null;
}

/**
 * Drops block and line comments, so a hex value in a comment isn't counted as code. A line comment
 * starts a line or follows a space, so the `//` of a URL inside a string is kept.
 */
function withoutComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/[^\n]*/g, '$1');
}

function isTest(path: string): boolean {
  return path.endsWith('.test.ts');
}

describe('the shader boundary', () => {
  const paths = Object.keys(SOURCES);

  it('reads the whole of src/ (the search can’t pass by finding nothing)', () => {
    expect(paths.length).toBeGreaterThan(30);
    expect(paths.some((path) => path.startsWith(MATERIALS))).toBe(true);
  });

  it('finds no GLSL outside render/materials/', () => {
    const offenders = paths
      .filter((path) => !path.startsWith(MATERIALS))
      .map((path) => ({ path, glsl: glslIn(SOURCES[path] ?? '') }))
      .filter((found) => found.glsl !== null);
    expect(offenders).toEqual([]);
  });

  it('finds GLSL inside render/materials/ (a control: the markers match real shader code)', () => {
    const found = paths
      .filter((path) => path.startsWith(MATERIALS) && !isTest(path))
      .filter((path) => glslIn(SOURCES[path] ?? '') !== null);
    expect(found).toContain(`${MATERIALS}lookShader.ts`);
  });

  it('finds no separate shader files anywhere in src/', () => {
    expect(Object.keys(SHADER_FILES)).toEqual([]);
  });
});

describe('colours in render/materials/', () => {
  it('are never written as literals: they come from palette slots', () => {
    const offenders = Object.entries(SOURCES)
      .filter(([path]) => path.startsWith(MATERIALS) && !isTest(path))
      .map(([path, source]) => ({ path, literal: COLOUR_LITERAL.exec(withoutComments(source)) }))
      .filter((found) => found.literal !== null)
      .map((found) => `${found.path}: ${found.literal?.[0] ?? ''}`);
    expect(offenders).toEqual([]);
  });

  it('would be caught (a control)', () => {
    expect(COLOUR_LITERAL.exec(withoutComments("const tint = '#FF8F2E';"))?.[0]).toBe('#FF8F2E');
    expect(COLOUR_LITERAL.exec(withoutComments('color.setHex(0xff8f2e);'))).not.toBeNull();
    expect(COLOUR_LITERAL.exec('const mask = 0xff8f2e;')?.[0]).toBe('0xff8f2e');
    expect(COLOUR_LITERAL.exec(withoutComments("fill: '#abc',"))?.[0]).toBe('#abc');
    // GLSL directives whose first letters are hex digits are not colours.
    expect(COLOUR_LITERAL.exec('#define LOOK_FLAT\n#endif')).toBeNull();
    // A hex value in a comment is not code.
    expect(COLOUR_LITERAL.exec(withoutComments('// skyGlow is #B0E1E5\n/* #FFF */'))).toBeNull();
    // Forms the first version missed (code review, 2026-11-14).
    expect(COLOUR_LITERAL.exec("fill: '#FF8F2EAA',")?.[0]).toBe('#FF8F2EAA');
    expect(COLOUR_LITERAL.exec("fill: '#abcd',")?.[0]).toBe('#abcd');
    expect(COLOUR_LITERAL.exec('const c = 0xff8f2eaa;')?.[0]).toBe('0xff8f2eaa');
    expect(COLOUR_LITERAL.exec("new Color('red')")).not.toBeNull();
    expect(COLOUR_LITERAL.exec('new Color(1, 0, 0)')).not.toBeNull();
    expect(COLOUR_LITERAL.exec('color.setRGB(1, 0.5, 0)')).not.toBeNull();
    expect(COLOUR_LITERAL.exec('color.setHex(16742190)')).not.toBeNull();
    // A palette slot is not a literal, and neither is a private field.
    expect(
      COLOUR_LITERAL.exec('new Color(palette[slot]); tones.mid.set(palette[slot]);'),
    ).toBeNull();
    expect(COLOUR_LITERAL.exec('this.#add = 1;')).toBeNull();
    // A URL's // inside a string doesn't hide the code after it.
    const url = "const u = 'http://x'; const c = '#FF0000';";
    expect(COLOUR_LITERAL.exec(withoutComments(url))?.[0]).toBe('#FF0000');
  });

  it('GLSL markers catch the forms the first version missed (a control)', () => {
    for (const glsl of [
      'uniform highp float uKey;',
      'uniform samplerCube uSky;',
      'uniform usampler2D uIds;',
      'uniform mat2x3 uM;',
      'out vec4 fragColor;',
      'layout(location = 0) out vec4 c;',
    ]) {
      expect(glslIn(glsl), glsl).not.toBeNull();
    }
    // TypeScript that only looks a little like GLSL.
    expect(glslIn('view.layout(widthPx, heightPx); const outVec = 4;')).toBeNull();
  });
});

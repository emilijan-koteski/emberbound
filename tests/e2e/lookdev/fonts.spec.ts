import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import type { CDPSession, Page } from '@playwright/test';
import { LOOKDEV_SPOTS } from '../../../src/lookdev/spots.ts';
import { readStoryLines, uniqueCharacters } from '../../../src/lookdev/storyCharacters.ts';
import { computeTilePx } from '../../../src/ui/overlay.ts';
import { CONFIG } from '../../../src/sim/config.ts';
import { expectLookdevReady } from '../lookdevReady.ts';
import { collectPageErrors, expectNoPageErrors } from '../pageErrors.ts';

// The overlay typefaces' checks (story 0.8, AC10–AC19; readiness proposal 2026-11-13, Q12). `make
// shots` runs every spec in this folder against the dev server before it takes a shot. The page is
// compared with the files and documents read here in Node, never with itself.

const NARRATIVE_PATH = fileURLToPath(
  new URL(
    '../../../_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md',
    import.meta.url,
  ),
);
const storyCharacters = uniqueCharacters(readStoryLines(readFileSync(NARRATIVE_PATH, 'utf8')));

/** The files base.css's @font-face rules point at, in public/assets/fonts/ (AC1). */
const FONT_FILES = [
  'alegreya-latin-400-normal.woff2',
  'alegreya-latin-600-normal.woff2',
  'alegreya-latin-700-normal.woff2',
  'source-sans-3-vf-upright.woff2',
];
const FONTS_PATH = '/assets/fonts/';
const DISPLAY = 'Alegreya';
const UI = 'Source Sans 3';
/** The faces base.css declares (AC8); a variable face reports its weight range. */
const EXPECTED_FACES = [
  { family: DISPLAY, weight: '400' },
  { family: DISPLAY, weight: '600' },
  { family: DISPLAY, weight: '700' },
  { family: UI, weight: '200 900' },
];
/** The weights each face shows in, one per token weight (D6). */
const EXPECTED_WEIGHTS: Readonly<Record<string, readonly string[]>> = {
  [DISPLAY]: ['400', '600', '700'],
  [UI]: ['400', '500', '600'],
};
/** The type view's spot sizes, from spots.ts, so a spot added there is checked here too. */
const SPOT_SIZES = LOOKDEV_SPOTS.filter((spot) => spot.view === 'type').map(
  ({ width, height }) => ({
    width,
    height,
  }),
);
/** Each display token's weight, as the static Alegreya file that must draw it names itself. */
const DISPLAY_POSTSCRIPT: ReadonlyMap<string, string> = new Map([
  ['display-xl', 'Alegreya-Bold'],
  ['display-lg', 'Alegreya-SemiBold'],
  ['display-body', 'Alegreya-Regular'],
]);
/** Sub-pixel layout gives the same advance the same width; a difference means proportional digits. */
const TABULAR_TOLERANCE_PX = 0.01;
const SIZE_TOLERANCE_PX = 0.5;
/**
 * Characters outside each face's coverage, so the glyph check is shown able to fail. The test needs
 * an installed font that has them (DejaVu or Noto here): on a bare CI image with none, Chromium
 * draws .notdef from the face itself and this control fails, though the glyph check is sound.
 */
const CONTROL_CHARACTERS: Readonly<Record<string, string>> = {
  [DISPLAY]: 'Ж', // Cyrillic: not in Alegreya's Latin subset.
  [UI]: 'א', // Hebrew: not in Source Sans 3.
};

function unquote(family: string): string {
  return family.replaceAll(/["']/g, '').trim();
}

async function openType(page: Page): Promise<void> {
  await page.goto('/lookdev.html?view=type');
  await expectLookdevReady(page);
}

interface PlatformFont {
  readonly familyName: string;
  readonly postScriptName: string;
  readonly isCustomFont: boolean;
  readonly glyphCount: number;
}

/**
 * The fonts Chromium used for the text directly inside each element matching `selector`, keyed by
 * the element's index (D8). CDP's CSS.getPlatformFontsForNode reports a node's child text nodes.
 */
async function platformFonts(cdp: CDPSession, selector: string): Promise<PlatformFont[][]> {
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector });
  const result: PlatformFont[][] = [];
  for (const nodeId of nodeIds) {
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    result.push(fonts);
  }
  return result;
}

async function openCdp(page: Page): Promise<CDPSession> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  return cdp;
}

/**
 * Chromium reports each font by the names inside the file, not by the @font-face family: the static
 * Alegreya files as "Alegreya SemiBold" (PostScript "Alegreya-SemiBold") and so on, the variable
 * Source Sans 3 as "SourceSans3VF" (PostScript "SourceSans3VF-ExtraLight", its default instance).
 * Checked 2026-11-14 in Chromium on the GTX 1650. A face is matched by its PostScript prefix, and
 * only as a web font (isCustomFont), so an installed copy of the same face never counts.
 */
const POSTSCRIPT_PREFIX: Readonly<Record<string, string>> = {
  [DISPLAY]: 'Alegreya-',
  [UI]: 'SourceSans3VF-',
};

function isFace(font: PlatformFont, family: string): boolean {
  const prefix = POSTSCRIPT_PREFIX[family] ?? family;
  return font.isCustomFont && font.postScriptName.startsWith(prefix);
}

/** True when every glyph came from the named web font and nothing fell back. */
function isOnlyFace(fonts: readonly PlatformFont[], family: string): boolean {
  return fonts.length > 0 && fonts.every((font) => isFace(font, family));
}

test('every view requests nothing from any host but the dev server', async ({
  page,
  context,
  baseURL,
}) => {
  const host = new URL(baseURL ?? '').host;
  await page.goto('/lookdev.html');
  const viewIds = await page
    .locator('[data-lookdev-view]')
    .evaluateAll((links) => links.map((link) => (link as HTMLElement).dataset.lookdevView ?? ''));
  expect(viewIds).toContain('type');

  for (const viewId of viewIds) {
    // A fresh page per view, so each view's requests and errors are its own (Test 5).
    const viewPage = await context.newPage();
    const errors = collectPageErrors(viewPage);
    const urls: string[] = [];
    viewPage.on('request', (request) => {
      urls.push(request.url());
    });
    await viewPage.goto(`/lookdev.html?view=${viewId}`);
    await expectLookdevReady(viewPage);
    expect(urls.length, viewId).toBeGreaterThan(0);
    const elsewhere = urls.filter((url) => {
      const parsed = new URL(url);
      if (parsed.protocol === 'data:' || parsed.protocol === 'blob:') return false;
      return !(['http:', 'https:'].includes(parsed.protocol) && parsed.host === host);
    });
    expect(elsewhere, `${viewId}: requests to another host`).toEqual([]);
    expectNoPageErrors(errors);
    await viewPage.close();
  }
});

test('the type view loads the four faces from the game’s own files', async ({ page }) => {
  const errors = collectPageErrors(page);
  const fontResponses: { name: string; status: number; type: string }[] = [];
  page.on('response', (response) => {
    const { pathname } = new URL(response.url());
    if (!pathname.startsWith(FONTS_PATH)) return;
    fontResponses.push({
      name: pathname.slice(FONTS_PATH.length),
      status: response.status(),
      type: response.headers()['content-type'] ?? '',
    });
  });
  await openType(page);
  expectNoPageErrors(errors);

  expect(fontResponses.map((response) => response.name).sort()).toEqual(FONT_FILES);
  for (const response of fontResponses) {
    expect(response.status, response.name).toBe(200);
    expect(response.type, response.name).toBe('font/woff2');
  }

  const faces = await page.evaluate(() =>
    Array.from(document.fonts, (face) => ({
      family: face.family,
      weight: face.weight,
      style: face.style,
      status: face.status,
    })),
  );
  expect(faces).toHaveLength(EXPECTED_FACES.length);
  const shown = faces
    .map((face) => ({ ...face, family: unquote(face.family) }))
    .sort((a, b) => `${a.family} ${a.weight}`.localeCompare(`${b.family} ${b.weight}`, 'en'));
  expect(shown).toEqual(
    EXPECTED_FACES.map((face) => ({ ...face, style: 'normal', status: 'loaded' })),
  );
});

test('every sample renders in its own face, with no fallback glyph', async ({ page }) => {
  await openType(page);
  const cdp = await openCdp(page);

  const samples = await page.locator('[data-typeface-sample]').evaluateAll((nodes) =>
    nodes.map((node) => ({
      token: (node as HTMLElement).dataset.typefaceSample ?? '',
      weight: getComputedStyle(node).fontWeight,
    })),
  );
  // 3 display rows, 3 UI rows and 2 numeric rows of two samples each.
  expect(samples).toHaveLength(10);
  const fonts = await platformFonts(cdp, '[data-typeface-sample]');
  expect(fonts).toHaveLength(samples.length);
  const weights = new Map<string, Set<string>>();
  samples.forEach((sample, index) => {
    const family = sample.token.startsWith('display-') ? DISPLAY : UI;
    const used = fonts.at(index) ?? [];
    expect(isOnlyFace(used, family), `${sample.token}: ${JSON.stringify(used)}`).toBe(true);
    // A display row must come from its own weight's file, never another weight's, synthesised.
    const postScript = DISPLAY_POSTSCRIPT.get(sample.token);
    if (postScript !== undefined) {
      expect(
        used.map((font) => font.postScriptName),
        sample.token,
      ).toEqual([postScript]);
    }
    weights.set(family, (weights.get(family) ?? new Set<string>()).add(sample.weight));
  });
  for (const [family, expected] of Object.entries(EXPECTED_WEIGHTS)) {
    expect([...(weights.get(family) ?? [])].sort(), family).toEqual(expected);
  }

  const wordmarkFonts = await platformFonts(cdp, '[data-typeface-wordmark]');
  expect(wordmarkFonts).toHaveLength(1);
  const wordmarkUsed = wordmarkFonts.at(0) ?? [];
  expect(wordmarkUsed.map((font) => font.postScriptName)).toEqual([
    DISPLAY_POSTSCRIPT.get('display-xl'),
  ]);
  expect(isOnlyFace(wordmarkUsed, DISPLAY), JSON.stringify(wordmarkFonts)).toBe(true);
});

test('every story-text character renders in the display face', async ({ page }) => {
  await openType(page);

  // The page shows the narrative design's characters, read here from the file itself.
  const shown = await page.locator('[data-typeface-charset]').allTextContents();
  expect(shown).toEqual([storyCharacters, storyCharacters]);
  expect(storyCharacters).toContain('“');
  expect(storyCharacters).toContain('”');

  const cdp = await openCdp(page);
  const fonts = await platformFonts(cdp, '[data-typeface-charset]');
  expect(fonts).toHaveLength(2);
  for (const used of fonts) expect(isOnlyFace(used, DISPLAY), JSON.stringify(used)).toBe(true);
});

test('the glyph check reports a fallback for a character a face lacks', async ({ page }) => {
  await openType(page);
  await page.evaluate((controls) => {
    const root = document.querySelector('.ui-overlay');
    for (const [family, character] of Object.entries(controls)) {
      const span = document.createElement('span');
      span.dataset.glyphControl = family;
      span.style.fontFamily = `'${family}'`;
      span.textContent = `A${character}`;
      root?.append(span);
    }
  }, CONTROL_CHARACTERS);
  // Two frames, so the injected text is laid out and shaped before Chromium is asked about it.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      }),
  );
  const cdp = await openCdp(page);
  for (const family of Object.keys(CONTROL_CHARACTERS)) {
    const found = await platformFonts(cdp, `[data-glyph-control="${family}"]`);
    expect(found, family).toHaveLength(1);
    const used = found.at(0) ?? [];
    expect(isOnlyFace(used, family), JSON.stringify(used)).toBe(false);
    // The face still drew the "A"; something else drew the control character.
    expect(
      used.some((font) => isFace(font, family)),
      `${family}: ${JSON.stringify(used)}`,
    ).toBe(true);
    expect(
      used.some((font) => !isFace(font, family)),
      `${family}: ${JSON.stringify(used)}`,
    ).toBe(true);
  }
});

test('the numeric role sets 0:00.0 and 1:11.1 at the same width', async ({ page }) => {
  await openType(page);
  // The face's own status: document.fonts.check() would pass for a family no rule declares.
  const statuses = await page.evaluate(
    (family) =>
      Array.from(document.fonts)
        .filter((face) => face.family.replaceAll(/["']/g, '') === family)
        .map((face) => face.status),
    UI,
  );
  expect(statuses).toEqual(['loaded']);

  const pairs = await page.locator('[data-typeface-numeric]').evaluateAll((rows) =>
    rows.map((row) => ({
      token: (row as HTMLElement).dataset.typefaceNumeric ?? '',
      widths: Array.from(row.querySelectorAll<HTMLElement>('[data-numeric-sample]'), (sample) => ({
        text: sample.dataset.numericSample ?? '',
        width: sample.getBoundingClientRect().width,
        variant: getComputedStyle(sample).fontVariantNumeric,
      })),
    })),
  );
  expect(pairs.map((pair) => pair.token)).toEqual(['numeric-lg', 'numeric-md']);
  for (const { token, widths } of pairs) {
    expect(
      widths.map((sample) => sample.text),
      token,
    ).toEqual(['0:00.0', '1:11.1']);
    for (const sample of widths) expect(sample.variant, token).toBe('tabular-nums');
    const firstPx = widths.at(0)?.width ?? 0;
    const secondPx = widths.at(1)?.width ?? 0;
    expect(firstPx, token).toBeGreaterThan(0);
    expect(Math.abs(firstPx - secondPx), token).toBeLessThan(TABULAR_TOLERANCE_PX);
  }
});

for (const size of SPOT_SIZES) {
  test(`the type view fits ${String(size.width)} × ${String(size.height)}, with the wordmark at display-xl`, async ({
    page,
  }) => {
    await page.setViewportSize(size);
    await openType(page);
    const overflow = await page.locator('.ui-overlay').evaluate((root) => ({
      height: root.scrollHeight - root.clientHeight,
      width: root.scrollWidth - root.clientWidth,
    }));
    expect(overflow).toEqual({ height: 0, width: 0 });

    const wordmark = await page.locator('[data-typeface-wordmark]').evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        text: node.textContent,
        family: style.fontFamily,
        weight: style.fontWeight,
        sizePx: Number.parseFloat(style.fontSize),
      };
    });
    expect(wordmark.text).toBe('Emberbound');
    expect(unquote(wordmark.family)).toBe(DISPLAY);
    expect(wordmark.weight).toBe('700');
    // display-xl is tile × 0.9 with no floor (DESIGN.md).
    const expectedPx = computeTilePx(size.width, size.height, CONFIG.view) * 0.9;
    expect(Math.abs(wordmark.sizePx - expectedPx)).toBeLessThan(SIZE_TOLERANCE_PX);
  });
}

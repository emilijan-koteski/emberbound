import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFrontmatter } from '../../../scripts/designTokens.ts';
import { expectLookdevReady } from '../lookdevReady.ts';
import { collectPageErrors, expectNoPageErrors } from '../pageErrors.ts';

// The palettes view's checks (story 0.7, AC18). The page is compared with docs/STYLE_GUIDE.md read
// here in Node, never with itself: a module that drifts from the guide, or a view that shows the
// wrong value, fails.

const STYLE_GUIDE_PATH = fileURLToPath(new URL('../../../docs/STYLE_GUIDE.md', import.meta.url));
const SPOT_SIZE = { width: 1920, height: 1080 } as const;

/** The level ids the view uses, and each one's key under the style guide's `palettes:`. */
const LEVELS = [
  { id: 'emberwood', guideKey: 'emberwood' },
  { id: 'drowned-mill', guideKey: 'drownedMill' },
  { id: 'harrowmere', guideKey: 'harrowmere' },
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function guidePalettes(): Map<string, Map<string, string>> {
  const frontmatter = readFrontmatter(readFileSync(STYLE_GUIDE_PATH, 'utf8'));
  if (!isRecord(frontmatter) || !isRecord(frontmatter.palettes)) {
    throw new Error('docs/STYLE_GUIDE.md has no palettes: map');
  }
  const palettes = new Map<string, Map<string, string>>();
  for (const [key, value] of Object.entries(frontmatter.palettes)) {
    if (!isRecord(value)) throw new Error(`palettes.${key} is not a map`);
    palettes.set(key, new Map(Object.entries(value).map(([slot, hex]) => [slot, String(hex)])));
  }
  return palettes;
}

const guide = guidePalettes();

async function openPalettes(page: Page): Promise<void> {
  await page.setViewportSize(SPOT_SIZE);
  await page.goto('/lookdev.html?view=palettes');
  await expectLookdevReady(page);
}

test('the palettes view opens with no error', async ({ page }) => {
  const errors = collectPageErrors(page);
  await openPalettes(page);
  expectNoPageErrors(errors);
});

test("the palettes view shows the style guide's slots and values for every level", async ({
  page,
}) => {
  await openPalettes(page);
  const rows = await page.locator('tr[data-slot]').evaluateAll((trs) =>
    trs.map((tr) => ({
      slot: (tr as HTMLElement).dataset.slot ?? '',
      cells: Array.from(tr.querySelectorAll<HTMLElement>('td[data-level]')).map((td) => ({
        level: td.dataset.level ?? '',
        module: td.querySelector('[data-source="module"]')?.textContent ?? '',
        guide: td.querySelector('[data-source="guide"]')?.textContent ?? '',
        isMismatch: td.dataset.mismatch === 'true',
      })),
    })),
  );

  // 36 slot rows, each with one cell per level, stated outright (not only through the guide).
  expect(rows).toHaveLength(36);
  for (const row of rows) {
    expect(
      row.cells.map((cell) => cell.level),
      row.slot,
    ).toEqual(LEVELS.map((level) => level.id));
  }

  for (const level of LEVELS) {
    const palette = guide.get(level.guideKey);
    if (palette === undefined)
      throw new Error(`docs/STYLE_GUIDE.md has no palettes.${level.guideKey}`);
    expect(
      rows.map((row) => row.slot),
      'the slots, in the style guide’s order',
    ).toEqual([...palette.keys()]);

    for (const row of rows) {
      const cell = row.cells.find((each) => each.level === level.id);
      const expected = (palette.get(row.slot) ?? '').toUpperCase();
      expect(cell?.module.toUpperCase(), `${level.id}.${row.slot}: module`).toBe(expected);
      expect(cell?.guide.toUpperCase(), `${level.id}.${row.slot}: style guide`).toBe(expected);
      expect(cell?.isMismatch, `${level.id}.${row.slot}: marked as differing`).toBe(false);
    }
  }
  await expect(page.locator('[data-mismatch]')).toHaveCount(0);
});

test('each rig shows its key, fill and fog, and only Emberwood allows lanterns', async ({
  page,
}) => {
  await openPalettes(page);
  for (const level of LEVELS) {
    const rig = page.locator(`[data-rig="${level.id}"]`);
    await expect(rig).toHaveCount(1);
    for (const part of ['key', 'fill', 'fog', 'ground-fog', 'lanterns', 'warm-light']) {
      await expect(rig.locator(`[data-rig-part="${part}"]`), `${level.id}: ${part}`).toHaveCount(1);
    }
    const lanterns = page.locator(`[data-rig-warm="${level.id}"] [data-carrier="lantern"]`);
    await expect(lanterns).toHaveCount(level.id === 'emberwood' ? 1 : 0);
    for (const carrier of ['rowan', 'shot', 'ember', 'bell', 'weaponPickup']) {
      await expect(
        page.locator(`[data-rig-warm="${level.id}"] [data-carrier="${carrier}"]`),
        `${level.id}: ${carrier}`,
      ).toHaveCount(1);
    }
  }
});

test('the palettes view fits 1920 × 1080 with no scrolling', async ({ page }) => {
  await openPalettes(page);
  // The page itself can't scroll (html and body hide overflow), so measure the view's own root,
  // which scrolls (overflow: auto) if anything doesn't fit.
  const overflow = await page.locator('.lookdev-palettes').evaluate((root) => ({
    height: root.scrollHeight - root.clientHeight,
    width: root.scrollWidth - root.clientWidth,
  }));
  expect(overflow).toEqual({ height: 0, width: 0 });
});

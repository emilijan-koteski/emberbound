import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readFrontmatter } from '../../scripts/designTokens.ts';

// The style guide's level palettes, read in Node from docs/STYLE_GUIDE.md's frontmatter, so the
// look-dev checks compare the screen with the guide, never with the page itself (stories 0.9 and
// 0.10). Not a test file: Playwright's default testMatch skips it.

const STYLE_GUIDE_PATH = fileURLToPath(new URL('../../docs/STYLE_GUIDE.md', import.meta.url));

/** The level ids the views use, and each one's key under the style guide's `palettes:`. */
export const GUIDE_LEVELS = [
  { id: 'emberwood', guideKey: 'emberwood', hasLanterns: true },
  { id: 'drowned-mill', guideKey: 'drownedMill', hasLanterns: false },
  { id: 'harrowmere', guideKey: 'harrowmere', hasLanterns: false },
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readPalettes(): Map<string, Map<string, string>> {
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

const palettes = readPalettes();

/** The style guide's hex value for a slot in a level, by the level's id. */
export function guideHex(levelId: string, slot: string): string {
  const level = GUIDE_LEVELS.find((each) => each.id === levelId);
  const hex = level === undefined ? undefined : palettes.get(level.guideKey)?.get(slot);
  if (hex === undefined) throw new Error(`The style guide has no ${slot} for ${levelId}`);
  return hex;
}

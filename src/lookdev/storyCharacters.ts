// The characters the version-one story text uses, read from the narrative design's Story Text
// Script (story 0.8, D7). The look-dev type view shows them in the display face, and
// tests/e2e/lookdev/fonts.spec.ts checks that face renders every one with no fallback.
//
// Story text is never typed into code: content/storyText.ts doesn't hold every line yet (story 0.13
// starts it, Epic 3 fills it), so the lines come from the document. The spec imports this file in
// Node, so it stays pure, with no imports.

const SECTION_HEADING = '### Story Text Script (version one)';
const SECTION_END = '**Script notes:**';
const LINE_COLUMN = 'Line';
/** A GFM delimiter row: cells of one or more dashes, each with optional alignment colons. */
const SEPARATOR_ROW = /^\|?(\s*:?-+:?\s*\|)+\s*(:?-+:?\s*)?$/;
/** An HTML entity or tag: shown as one glyph or none, so its characters would mislead the check. */
const HTML_MARKUP = /&[#a-z0-9]+;|<\/?[a-z][^>]*>/i;

/** A row's cells, split on unescaped pipes; an escaped pipe (`\\|`) stays in its cell as `|`. */
function cells(row: string): string[] {
  const inner = row
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '');
  return inner.split(/(?<!\\)\|/).map((cell) => cell.replaceAll('\\|', '|').trim());
}

/**
 * Every story line in the Story Text Script section, in order: from each table, the cell under its
 * "Line" header. The section runs from its heading to the "Script notes" line. Throws, naming the
 * problem, if the section or its end is missing, a table has no "Line" column, a row has no cell
 * under it, a line holds HTML, or no line is found.
 */
export function readStoryLines(markdown: string): string[] {
  const rows = markdown.split(/\r?\n/);
  const start = rows.findIndex((row) => row.trim() === SECTION_HEADING);
  if (start === -1) throw new Error(`no "${SECTION_HEADING}" heading`);
  const end = rows.findIndex((row, index) => index > start && row.trim() === SECTION_END);
  if (end === -1) throw new Error(`the Story Text Script section has no "${SECTION_END}" line`);

  const lines: string[] = [];
  let lineColumn: number | undefined;
  for (let index = start + 1; index < end; index += 1) {
    const row = rows[index]?.trim() ?? '';
    if (!row.startsWith('|')) {
      lineColumn = undefined; // A table ends at the first row that isn't one.
      continue;
    }
    if (SEPARATOR_ROW.test(row)) continue;
    const next = rows[index + 1]?.trim() ?? '';
    if (SEPARATOR_ROW.test(next)) {
      const header = cells(row);
      const column = header.indexOf(LINE_COLUMN);
      if (column === -1) {
        throw new Error(`a Story Text Script table has no "${LINE_COLUMN}" column: ${row}`);
      }
      lineColumn = column;
      continue;
    }
    if (lineColumn === undefined) continue;
    const line = cells(row).at(lineColumn);
    if (line === undefined)
      throw new Error(`a Story Text Script row has no "${LINE_COLUMN}" cell: ${row}`);
    if (HTML_MARKUP.test(line)) {
      throw new Error(
        `a story line holds HTML (an entity or tag), so its glyphs can't be read: ${line}`,
      );
    }
    if (line !== '') lines.push(line);
  }
  if (lines.length === 0) throw new Error('the Story Text Script section has no story line');
  return lines;
}

/** Each character of the lines once, sorted by code unit (the same on every machine). */
export function uniqueCharacters(lines: readonly string[]): string {
  const characters = new Set<string>();
  for (const line of lines) for (const character of line) characters.add(character);
  return [...characters].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join('');
}

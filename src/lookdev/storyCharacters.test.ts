import { describe, expect, it } from 'vitest';
import narrative from '../../_bmad-output/planning-artifacts/narratives/narrative-emberbound-2026-11-13/narrative-design.md?raw';
import { readStoryLines, uniqueCharacters } from './storyCharacters.ts';

/** A small Story Text Script section in the narrative design's shape, with text around it. */
function section(body: string): string {
  return [
    '### Something before',
    '',
    '| Card | Line |',
    '| --- | --- |',
    '| 0 | Not in the section. |',
    '',
    '### Story Text Script (version one)',
    '',
    body,
    '',
    '**Script notes:**',
    '',
    '| Note | Line |',
    '| --- | --- |',
    '| x | Not a story line either. |',
  ].join('\n');
}

describe('readStoryLines', () => {
  it("reads the narrative design's version-one lines", () => {
    const lines = readStoryLines(narrative);
    // 5 intro cards, 3 level lines, the closing card, the all-bells card.
    expect(lines).toHaveLength(10);
    expect(lines.at(0)).toBe(
      "Ten years ago, for a lord's coin, Rowan the Cindersworn burned Harrowmere.",
    );
    const characters = uniqueCharacters(lines);
    expect(characters).toContain('“');
    expect(characters).toContain('”');
  });

  it('takes the Line column wherever it sits, from every table, in order', () => {
    const markdown = section(
      [
        '**Intro**',
        '',
        '| Card | Line | Image |',
        '| --- | --- | --- |',
        '| 1 | First line. | A picture. |',
        '| 2 | Second line. | Another. |',
        '',
        '**Closing card**',
        '',
        '| Line | Image |',
        '| --- | --- |',
        '| Third line. | A third picture. |',
      ].join('\n'),
    );
    expect(readStoryLines(markdown)).toEqual(['First line.', 'Second line.', 'Third line.']);
  });

  it('throws when the section is missing', () => {
    expect(() => readStoryLines('# Nothing here\n')).toThrow(/Story Text Script/);
  });

  it('throws when the end marker is missing', () => {
    const markdown = '### Story Text Script (version one)\n\n| Line |\n| --- |\n| A. |\n';
    expect(() => readStoryLines(markdown)).toThrow(/Script notes/);
  });

  it('throws when a table has no Line column', () => {
    const markdown = section('| Card | Text |\n| --- | --- |\n| 1 | A line. |');
    expect(() => readStoryLines(markdown)).toThrow(/no "Line" column/);
  });

  it('throws when the section holds no line', () => {
    expect(() => readStoryLines(section('No tables at all.'))).toThrow(/no story line/);
  });

  it('accepts separator rows with one dash and alignment colons, as GFM does', () => {
    const markdown = section('| Card | Line |\n|:-|-:|\n| 1 | A line. |');
    expect(readStoryLines(markdown)).toEqual(['A line.']);
  });

  it('keeps an escaped pipe inside a cell, unescaped', () => {
    const markdown = section('| Card | Line |\n| --- | --- |\n| 1 \\| 2 | Either \\| or. |');
    expect(readStoryLines(markdown)).toEqual(['Either | or.']);
  });

  it('throws on a row shorter than its header', () => {
    const markdown = section('| Card | Image | Line |\n| --- | --- | --- |\n| 1 | A picture. |');
    expect(() => readStoryLines(markdown)).toThrow(/no "Line" cell/);
  });

  it('throws on an HTML entity or tag in a line, which would hide or invent glyphs', () => {
    for (const line of ['He said &rsquo;no&rsquo;.', 'One<br>two.']) {
      const markdown = section(`| Line |\n| --- |\n| ${line} |`);
      expect(() => readStoryLines(markdown), line).toThrow(/HTML/);
    }
  });
});

describe('uniqueCharacters', () => {
  it('returns each character once, sorted by code unit, the space included', () => {
    expect(uniqueCharacters(['ba a', '“ab”'])).toBe(' ab“”');
  });

  it('returns an empty string for no lines', () => {
    expect(uniqueCharacters([])).toBe('');
  });
});

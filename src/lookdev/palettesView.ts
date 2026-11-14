// The palettes view: each level's palette slots as labelled swatches, the module's hex value beside
// the style guide's, and each lighting rig's key, fill, fog, lanterns and warm list (story 0.7,
// AC15–AC17). DOM only, no renderer: this is page chrome (lookdev.css), not the overlay.
//
// The style guide's values are read from docs/STYLE_GUIDE.md itself (Vite's ?raw import, parsed with
// yaml; D8), not from the modules, so a module that drifts from the guide shows as a marked row. The
// look-dev page is development only, so neither the file nor yaml reaches the game.
import { parse } from 'yaml';
import styleGuideSource from '../../docs/STYLE_GUIDE.md?raw';
import { LEVEL_PALETTE_SLOTS } from '../core/paletteSlots.ts';
import type { LevelPalette, LevelPaletteSlot } from '../core/paletteSlots.ts';
import { DROWNED_MILL_RIG } from '../render/lighting/drownedMill.ts';
import { EMBERWOOD_RIG } from '../render/lighting/emberwood.ts';
import { HARROWMERE_RIG } from '../render/lighting/harrowmere.ts';
import type { Direction, LightingRig, RigLight } from '../render/lighting/lightingRig.ts';
import { DROWNED_MILL_PALETTE } from '../render/palettes/drownedMill.ts';
import { EMBERWOOD_PALETTE } from '../render/palettes/emberwood.ts';
import { HARROWMERE_PALETTE } from '../render/palettes/harrowmere.ts';
import { isWarm } from '../render/palettes/warmth.ts';
import type { LookdevViewHandle } from './assetBrowser.ts';

interface LevelLook {
  /** The level id (kebab-case, the level-id rule). */
  readonly id: string;
  readonly label: string;
  /** The level's key under the style guide's `palettes:` (camelCase there). */
  readonly guideKey: string;
  readonly palette: LevelPalette;
  readonly rig: LightingRig;
}

const LEVELS: readonly LevelLook[] = [
  {
    id: 'emberwood',
    label: 'Emberwood',
    guideKey: 'emberwood',
    palette: EMBERWOOD_PALETTE,
    rig: EMBERWOOD_RIG,
  },
  {
    id: 'drowned-mill',
    label: 'The Drowned Mill',
    guideKey: 'drownedMill',
    palette: DROWNED_MILL_PALETTE,
    rig: DROWNED_MILL_RIG,
  },
  {
    id: 'harrowmere',
    label: 'Harrowmere',
    guideKey: 'harrowmere',
    palette: HARROWMERE_PALETTE,
    rig: HARROWMERE_RIG,
  },
];

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const BOM = '\uFEFF';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The style guide's palettes, as written (failsafe schema keeps every value as text). */
function readGuidePalettes(): Map<string, ReadonlyMap<string, string>> {
  const text = styleGuideSource.startsWith(BOM)
    ? styleGuideSource.slice(BOM.length)
    : styleGuideSource;
  const match = FRONTMATTER.exec(text);
  if (match === null) throw new Error('docs/STYLE_GUIDE.md has no frontmatter');
  const frontmatter: unknown = parse(match[1], { schema: 'failsafe' });
  if (!isRecord(frontmatter) || !isRecord(frontmatter.palettes)) {
    throw new Error('docs/STYLE_GUIDE.md frontmatter has no palettes: map');
  }
  const palettes = new Map<string, ReadonlyMap<string, string>>();
  for (const [key, value] of Object.entries(frontmatter.palettes)) {
    if (!isRecord(value)) continue;
    const slots = new Map<string, string>();
    for (const [slot, hex] of Object.entries(value)) {
      if (typeof hex === 'string') slots.set(slot, hex);
    }
    palettes.set(key, slots);
  }
  return palettes;
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function chip(hex: string): HTMLElement {
  const node = element('span', 'lookdev-palettes-chip');
  node.style.backgroundColor = hex;
  return node;
}

function sameHex(a: string | undefined, b: string): boolean {
  return a !== undefined && a.toUpperCase() === b.toUpperCase();
}

/**
 * Where each group of slots starts, in slot order (the groups paletteSlots.ts comments). A judging
 * aid only: a slot added later falls into the group above it.
 */
const GROUP_STARTS: ReadonlyMap<LevelPaletteSlot, string> = new Map<LevelPaletteSlot, string>([
  ['skyFar', 'World'],
  ['heroSkin', 'Rowan'],
  ['shot', 'Fire family and markers'],
  ['walkerBody', 'Enemies'],
  ['lantern', 'Lanterns'],
]);

interface SlotGroup {
  readonly label: string;
  readonly slots: readonly LevelPaletteSlot[];
  /** True when every slot in the group has the same value in every level. */
  readonly isSameEverywhere: boolean;
}

function isSameInEveryLevel(slot: LevelPaletteSlot): boolean {
  return new Set(LEVELS.map((level) => level.palette[slot].toUpperCase())).size === 1;
}

function slotGroups(): SlotGroup[] {
  const groups: { label: string; slots: LevelPaletteSlot[] }[] = [];
  for (const slot of LEVEL_PALETTE_SLOTS) {
    const label = GROUP_STARTS.get(slot);
    const current = groups.at(-1);
    if (label !== undefined || current === undefined) {
      groups.push({ label: label ?? 'Other', slots: [slot] });
    } else {
      current.slots.push(slot);
    }
  }
  return groups.map((group) => ({
    ...group,
    isSameEverywhere: group.slots.every(isSameInEveryLevel),
  }));
}

function buildTable(
  guide: ReadonlyMap<string, ReadonlyMap<string, string>>,
  groups: readonly SlotGroup[],
): HTMLTableElement {
  const table = element('table', 'lookdev-palettes-table');
  const head = table.createTHead().insertRow();
  head.append(element('th', 'lookdev-palettes-slot', 'Slot'));
  for (const level of LEVELS) {
    const cell = element('th', 'lookdev-palettes-level', level.label);
    cell.title = 'chip and module value · style guide value';
    head.append(cell);
  }

  const body = table.createTBody();
  for (const group of groups) {
    const groupRow = body.insertRow();
    groupRow.className = 'lookdev-palettes-group';
    const groupCell = element(
      'th',
      'lookdev-palettes-group-label',
      group.isSameEverywhere ? `${group.label} · the same in every level` : group.label,
    );
    groupCell.colSpan = LEVELS.length + 1;
    groupRow.append(groupCell);
    for (const slot of group.slots) appendSlotRow(body, guide, slot);
  }
  return table;
}

function appendSlotRow(
  body: HTMLTableSectionElement,
  guide: ReadonlyMap<string, ReadonlyMap<string, string>>,
  slot: LevelPaletteSlot,
): void {
  const row = body.insertRow();
  row.dataset.slot = slot;
  row.append(element('th', 'lookdev-palettes-slot', slot));
  for (const level of LEVELS) {
    const moduleHex = level.palette[slot];
    const guideHex = guide.get(level.guideKey)?.get(slot);
    const isMismatch = !sameHex(guideHex, moduleHex);

    const cell = element('td', 'lookdev-palettes-cell');
    cell.dataset.level = level.id;
    if (isMismatch) cell.dataset.mismatch = 'true';
    // The flex layout sits on an inner box: a flex <td> would stop being a table cell.
    const inner = element('div', 'lookdev-palettes-cell-inner');
    inner.append(chip(moduleHex));
    const moduleValue = element('span', 'lookdev-palettes-hex', moduleHex);
    moduleValue.dataset.source = 'module';
    const guideValue = element(
      'span',
      'lookdev-palettes-hex lookdev-palettes-guide',
      guideHex ?? 'missing',
    );
    guideValue.dataset.source = 'guide';
    inner.append(moduleValue, guideValue);
    if (isMismatch) {
      // A second chip in the guide's colour, so the difference can be seen as well as read.
      if (guideHex !== undefined) inner.append(chip(guideHex));
      inner.append(element('span', 'lookdev-palettes-flag', '≠ guide'));
    }
    if (isWarm(moduleHex)) {
      const tag = element('span', 'lookdev-palettes-warm', 'warm');
      tag.dataset.warm = 'true';
      inner.append(tag);
    }
    cell.append(inner);
    row.append(cell);
  }
}

/**
 * The levels side by side: one row of large chips per level, for the slots that differ between
 * levels, grouped as in the table. For judging the warmth falling from Emberwood to Harrowmere, each
 * level's one dominant colour, dark pits and water against the ground, and the enemy bodies against
 * ground and foliage (AC14; story 0.12 judges these bindingly on the test scene).
 */
function buildStrips(groups: readonly SlotGroup[]): HTMLElement {
  const section = element('section', 'lookdev-palettes-strips');
  section.append(element('h1', 'lookdev-palettes-title', 'The levels side by side'));
  section.append(
    element(
      'p',
      'lookdev-palettes-note',
      'Only the slots that differ between levels, in slot order.',
    ),
  );
  const varying = groups
    .map((group) => ({
      label: group.label,
      slots: group.slots.filter((slot) => !isSameInEveryLevel(slot)),
    }))
    .filter((group) => group.slots.length > 0);

  const grid = element('div', 'lookdev-palettes-strip-grid');
  // A label column, then one column per group, however many groups vary.
  grid.style.gridTemplateColumns = `auto repeat(${String(varying.length)}, max-content)`;
  grid.append(element('span', 'lookdev-palettes-strip-level'));
  for (const group of varying) {
    grid.append(element('span', 'lookdev-palettes-strip-group', group.label));
  }
  for (const level of LEVELS) {
    grid.append(element('span', 'lookdev-palettes-strip-level', level.label));
    for (const group of varying) {
      const strip = element('span', 'lookdev-palettes-strip');
      strip.dataset.strip = level.id;
      for (const slot of group.slots) {
        const swatch = element('span', 'lookdev-palettes-strip-chip');
        swatch.style.backgroundColor = level.palette[slot];
        swatch.title = `${slot} ${level.palette[slot]}`;
        swatch.dataset.slot = slot;
        strip.append(swatch);
      }
      grid.append(strip);
    }
  }
  // The slot names under the chips, so a shot (which can't hover) says which chip is which.
  grid.append(element('span', 'lookdev-palettes-strip-level'));
  for (const group of varying) {
    const names = element('span', 'lookdev-palettes-strip');
    for (const slot of group.slots)
      names.append(element('span', 'lookdev-palettes-strip-name', slot));
    grid.append(names);
  }
  section.append(grid);
  return section;
}

function formatNumber(value: number): string {
  // A real minus sign, so negative axes read at a glance.
  return String(value).replaceAll('-', '−');
}

/** A length in tiles, singular for exactly one. */
function formatTiles(value: number): string {
  return `${formatNumber(value)} ${value === 1 ? 'tile' : 'tiles'}`;
}

function formatDirection(direction: Direction): string {
  return `(${formatNumber(direction.x)}, ${formatNumber(direction.y)}, ${formatNumber(direction.z)})`;
}

function colorCell(palette: LevelPalette, slot: LevelPaletteSlot): HTMLElement {
  const cell = element('span', 'lookdev-palettes-rig-color');
  cell.append(
    chip(palette[slot]),
    element('span', 'lookdev-palettes-hex', `${slot} ${palette[slot]}`),
  );
  return cell;
}

function rigRow(name: string, ...content: (Node | string)[]): HTMLElement {
  const row = element('div', 'lookdev-palettes-rig-row');
  row.dataset.rigPart = name.toLowerCase().replaceAll(' ', '-');
  row.append(element('span', 'lookdev-palettes-rig-name', name), ...content);
  return row;
}

function lightRow(name: string, palette: LevelPalette, light: RigLight): HTMLElement {
  return rigRow(
    name,
    colorCell(palette, light.color),
    element(
      'span',
      'lookdev-palettes-rig-detail',
      `from ${formatDirection(light.from)} · intensity ${formatNumber(light.intensity)}`,
    ),
  );
}

function buildRig(level: LevelLook): HTMLElement {
  const { rig, palette } = level;
  const panel = element('section', 'lookdev-palettes-rig');
  panel.dataset.rig = level.id;
  panel.append(element('h2', 'lookdev-palettes-rig-title', `${level.label} rig`));
  panel.append(lightRow('Key', palette, rig.key), lightRow('Fill', palette, rig.fill));
  panel.append(
    rigRow(
      'Fog',
      colorCell(palette, rig.fog.color),
      element(
        'span',
        'lookdev-palettes-rig-detail',
        `depth ${formatNumber(rig.fog.startDepth)} to ${formatTiles(rig.fog.fullDepth)} · max ${formatNumber(rig.fog.maxAmount)}`,
      ),
    ),
  );
  panel.append(
    rig.groundFog === null
      ? rigRow('Ground fog', element('span', 'lookdev-palettes-rig-detail', 'none'))
      : rigRow(
          'Ground fog',
          colorCell(palette, rig.groundFog.color),
          element(
            'span',
            'lookdev-palettes-rig-detail',
            `height ${formatTiles(rig.groundFog.heightTiles)} · max ${formatNumber(rig.groundFog.maxAmount)}`,
          ),
        ),
  );
  panel.append(
    rig.lanterns === null
      ? rigRow('Lanterns', element('span', 'lookdev-palettes-rig-detail', 'none'))
      : rigRow(
          'Lanterns',
          colorCell(palette, rig.lanterns.color),
          element(
            'span',
            'lookdev-palettes-rig-detail',
            `reach ${formatTiles(rig.lanterns.reachTiles)} · intensity ${formatNumber(rig.lanterns.intensity)}`,
          ),
        ),
  );
  const warmList = element('span', 'lookdev-palettes-rig-warm');
  warmList.dataset.rigWarm = level.id;
  for (const carrier of rig.warmLight) {
    const tag = element('span', 'lookdev-palettes-carrier', carrier);
    tag.dataset.carrier = carrier;
    warmList.append(tag);
  }
  panel.append(rigRow('Warm light', warmList));
  return panel;
}

export function mountPalettesView(host: HTMLElement): LookdevViewHandle {
  const guide = readGuidePalettes();
  const groups = slotGroups();
  const root = element('div', 'lookdev-palettes');
  const tableColumn = element('div', 'lookdev-palettes-column');
  tableColumn.append(
    element('h1', 'lookdev-palettes-title', 'Level palettes'),
    element(
      'p',
      'lookdev-palettes-note',
      'Each cell: the module’s value (chip and hex), then docs/STYLE_GUIDE.md’s. “warm” is the style guide’s definition (section 3).',
    ),
    buildTable(guide, groups),
  );
  const rigColumn = element('div', 'lookdev-palettes-column lookdev-palettes-rigs');
  rigColumn.append(element('h1', 'lookdev-palettes-title', 'Lighting rigs'));
  for (const level of LEVELS) rigColumn.append(buildRig(level));
  rigColumn.append(buildStrips(groups));
  root.append(tableColumn, rigColumn);
  host.append(root);

  return {
    frame() {
      // Static: nothing to draw per frame. The page's frame loop still runs for the ready flag.
    },
    dispose() {
      root.remove();
    },
  };
}

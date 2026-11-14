// The download and asset budget check: the last step of `make build`, run over dist/.
// Usage: node scripts/checkBudgets.ts <dist-folder>
//
// It fails the build when the download total, itch.io's file limits or a per-asset budget is
// broken (architecture: Asset Management, Build and Release). The numbers live only here, in
// LIMITS and BUDGETS; the tests read them from this file.
//
// The checking logic (classifyFile, checkBudgets, formatReport) is pure, so Vitest covers it
// without a build. collectFiles is the only part that touches the file system.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { log } from '../src/core/log.ts';

/** 1 MB = 1,000,000 bytes, the stricter reading (story 0.2, decision D1). */
const MB = 1_000_000;

export const LIMITS = {
  /** NFR5: the download total. Code counts gzipped, everything else raw (story 0.2, D2). */
  downloadBytes: 30 * MB,
  /** itch.io's limits, all on raw bytes (NFR10, AR230). */
  maxFiles: 1_000,
  maxFileBytes: 200 * MB,
  maxRawTotalBytes: 500 * MB,
} as const;

export type BudgetId =
  | 'hero'
  | 'enemy'
  | 'warden'
  | 'kit'
  | 'cards'
  | 'pickupsMarkers'
  | 'musicAmbience'
  | 'sfx'
  | 'code'
  | 'fonts'
  | 'levelData'
  | 'icons';

export interface Budget {
  readonly label: string;
  readonly bytes: number;
  /** A per-item budget applies to each enemy, or each level, on its own. */
  readonly isPerItem: boolean;
}

/**
 * Starting values (†), tuned only with the developer (architecture, Asset Management; readiness
 * proposal 2026-11-13, Q1). About 29.9 MB planned in all. The order is the report's order.
 */
export const BUDGETS: Readonly<Record<BudgetId, Budget>> = {
  hero: { label: 'Hero, both stages', bytes: 2 * MB, isPerItem: false },
  enemy: { label: 'Each enemy', bytes: 0.6 * MB, isPerItem: true },
  warden: { label: 'The warden', bytes: 2 * MB, isPerItem: false },
  kit: { label: 'Each level kit with its backdrops', bytes: 3.5 * MB, isPerItem: true },
  cards: { label: 'Story cards', bytes: 1 * MB, isPerItem: false },
  pickupsMarkers: { label: 'Pickups and markers', bytes: 0.5 * MB, isPerItem: false },
  musicAmbience: { label: 'Music and ambience', bytes: 8.5 * MB, isPerItem: false },
  sfx: { label: 'Sound effects', bytes: 2 * MB, isPerItem: false },
  code: { label: 'Code, gzipped', bytes: 1 * MB, isPerItem: false },
  fonts: { label: 'Fonts', bytes: 0.3 * MB, isPerItem: false },
  levelData: { label: 'Level data and manifest', bytes: 0.25 * MB, isPerItem: false },
  icons: { label: 'Interface icons', bytes: 0.05 * MB, isPerItem: false },
};

/** Shipped asset names carry a kind prefix (architecture, Naming Conventions; AR154). */
const PREFIXES: readonly { readonly prefix: string; readonly budget: BudgetId }[] = [
  { prefix: 'hero-', budget: 'hero' },
  { prefix: 'enemy-', budget: 'enemy' },
  { prefix: 'warden-', budget: 'warden' },
  { prefix: 'kit-', budget: 'kit' },
  { prefix: 'card-', budget: 'cards' },
  { prefix: 'pickup-', budget: 'pickupsMarkers' },
  { prefix: 'marker-', budget: 'pickupsMarkers' },
  { prefix: 'music-', budget: 'musicAmbience' },
  { prefix: 'amb-', budget: 'musicAmbience' },
  { prefix: 'sfx-', budget: 'sfx' },
  { prefix: 'icon-', budget: 'icons' },
];

/** A file in dist/, its path relative to dist/ with `/` separators. */
export interface BuiltFile {
  readonly path: string;
  readonly bytes: number;
  /** Required for code files, which are measured gzipped. */
  readonly gzipBytes?: number;
}

/** The budget a file counts against; `item` names the enemy or level of a per-item budget. */
export interface FileGroup {
  readonly budget: BudgetId;
  readonly item?: string;
}

// Vite writes its bundles straight into dist/assets/ (build.assetsDir) and copies public/ to the
// root of dist/ unchanged, so public/assets/models/hero-rowan.glb ships as
// assets/models/hero-rowan.glb, next to the bundles.
const CODE_BUNDLE = /^assets\/[^/]+\.(js|css)$/;
const LEVEL_FILE = /^assets\/levels\/[^/]+\.json$/;
const BACKDROP = /^assets\/backdrops\/([^/]+)\/./;

/**
 * Assigns a dist/ path to its budget group, or null when it fits none. The first matching rule
 * wins (story 0.2, File Grouping). Names are case-sensitive: asset names are kebab-case.
 */
export function classifyFile(path: string): FileGroup | null {
  if (path === 'index.html' || CODE_BUNDLE.test(path)) return { budget: 'code' };
  if (path === 'assets/manifest.json' || LEVEL_FILE.test(path)) return { budget: 'levelData' };
  if (path.startsWith('assets/fonts/')) return { budget: 'fonts' };
  const backdrop = BACKDROP.exec(path);
  if (backdrop?.[1] !== undefined) return { budget: 'kit', item: backdrop[1] };
  if (!path.startsWith('assets/')) return null;

  const name = path.slice(path.lastIndexOf('/') + 1);
  const stem = name.split('.')[0] ?? '';
  for (const { prefix, budget } of PREFIXES) {
    if (!stem.startsWith(prefix)) continue;
    if (!BUDGETS[budget].isPerItem) return { budget };
    const item = stem.slice(prefix.length);
    return item === '' ? null : { budget, item };
  }
  return null;
}

/** One line of the budget sheet: a budget, or one item of a per-item budget. */
export interface BudgetRow {
  readonly budget: BudgetId;
  readonly item?: string;
  readonly bytes: number;
  readonly isOver: boolean;
}

export interface BudgetResult {
  /** Every budget in BUDGETS order; a per-item budget has one row per item found, or none. */
  readonly rows: readonly BudgetRow[];
  /** Paths that fit no budget group. */
  readonly unassigned: readonly string[];
  readonly fileCount: number;
  readonly rawBytes: number;
  /** Code gzipped plus everything else raw (D2). */
  readonly downloadBytes: number;
  /** One line per broken limit, every one of them, not just the first. */
  readonly failures: readonly string[];
}

const toMb = (bytes: number): string => (bytes / MB).toFixed(3);
const count = (n: number): string => n.toLocaleString('en-US');
const sized = (bytes: number): string => `${toMb(bytes)} MB (${count(bytes)} bytes)`;

/** Code-unit order, the same on every machine (localeCompare depends on the locale). */
const byCodeUnit = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Maps each per-item key to the item it counts against: the shortest other key it extends with
 * a dash, so `walker-mask` (from enemy-walker-mask.webp) counts against `walker`. A key that
 * extends no other key is its own item (story 0.2 review, developer's decision 2026-11-14).
 */
function resolveItems(keys: readonly string[]): Map<string, string> {
  const shortestFirst = [...keys].sort((a, b) => a.length - b.length || byCodeUnit(a, b));
  const resolved = new Map<string, string>();
  for (const key of shortestFirst) {
    const base = shortestFirst.find((other) => key.startsWith(`${other}-`));
    resolved.set(key, base === undefined ? key : (resolved.get(base) ?? base));
  }
  return resolved;
}

function rowLabel(row: BudgetRow): string {
  const { label } = BUDGETS[row.budget];
  return row.item === undefined ? label : `${label}: ${row.item}`;
}

/** Checks the built files against LIMITS and BUDGETS. Pure: no file system, no logging. */
export function checkBudgets(files: readonly BuiltFile[]): BudgetResult {
  const sums = new Map<BudgetId, Map<string, number>>();
  const kitFileKeys = new Set<string>();
  const backdropKeys = new Set<string>();
  const unassigned: string[] = [];
  const failures: string[] = [];
  let rawBytes = 0;
  let downloadBytes = 0;

  for (const builtFile of files) {
    rawBytes += builtFile.bytes;
    if (builtFile.bytes > LIMITS.maxFileBytes) {
      failures.push(
        `${builtFile.path}: ${sized(builtFile.bytes)} is over itch.io's per-file limit of ${sized(LIMITS.maxFileBytes)}`,
      );
    }

    const group = classifyFile(builtFile.path);
    let measured = builtFile.bytes;
    if (group?.budget === 'code') {
      if (builtFile.gzipBytes === undefined) {
        throw new Error(`${builtFile.path} is code but was measured without its gzipped size`);
      }
      measured = builtFile.gzipBytes;
    }
    downloadBytes += measured;

    if (group === null) {
      unassigned.push(builtFile.path);
      continue;
    }
    const items = sums.get(group.budget) ?? new Map<string, number>();
    const item = group.item ?? '';
    items.set(item, (items.get(item) ?? 0) + measured);
    sums.set(group.budget, items);
    if (group.budget === 'kit') {
      (BACKDROP.test(builtFile.path) ? backdropKeys : kitFileKeys).add(item);
    }
  }

  const rows: BudgetRow[] = [];
  for (const [budget, { bytes: budgetBytes, isPerItem }] of Object.entries(BUDGETS) as [
    BudgetId,
    Budget,
  ][]) {
    const items = sums.get(budget);
    if (isPerItem) {
      const keys = [...(items?.keys() ?? [])];
      const resolved = resolveItems(keys);
      const merged = new Map<string, number>();
      for (const key of keys) {
        const item = resolved.get(key) ?? key;
        merged.set(item, (merged.get(item) ?? 0) + (items?.get(key) ?? 0));
      }
      for (const [item, bytes] of [...merged].sort(([a], [b]) => byCodeUnit(a, b))) {
        rows.push({ budget, item, bytes, isOver: bytes > budgetBytes });
      }
      if (budget === 'kit') {
        // A backdrop folder must belong to a level kit, or a typo or a case change in its name
        // would give the backdrops a budget of their own.
        const kitItems = new Set([...kitFileKeys].map((key) => resolved.get(key) ?? key));
        for (const key of [...backdropKeys].sort(byCodeUnit)) {
          if (kitItems.has(resolved.get(key) ?? key)) continue;
          failures.push(
            `assets/backdrops/${key}/ has no matching kit-${key} file: backdrops count against their level's kit`,
          );
        }
      }
    } else {
      const bytes = items?.get('') ?? 0;
      rows.push({ budget, bytes, isOver: bytes > budgetBytes });
    }
  }

  for (const row of rows) {
    if (!row.isOver) continue;
    const budgetBytes = BUDGETS[row.budget].bytes;
    failures.push(
      `${rowLabel(row)}: ${sized(row.bytes)} is over its ${toMb(budgetBytes)} MB budget (${count(budgetBytes)} bytes)`,
    );
  }
  for (const path of unassigned) {
    const name = path.slice(path.lastIndexOf('/') + 1);
    failures.push(
      name.startsWith('.')
        ? `${path} is a dotfile copied from public/: remove it, since no budget group takes dotfiles`
        : `${path} fits no budget group (see the kind prefixes in the architecture, Naming Conventions)`,
    );
  }
  if (files.length > LIMITS.maxFiles) {
    failures.push(
      `${count(files.length)} files is over itch.io's limit of ${count(LIMITS.maxFiles)} files`,
    );
  }
  if (rawBytes > LIMITS.maxRawTotalBytes) {
    failures.push(
      `Raw total ${sized(rawBytes)} is over itch.io's limit of ${sized(LIMITS.maxRawTotalBytes)}`,
    );
  }
  if (downloadBytes > LIMITS.downloadBytes) {
    failures.push(
      `Download total ${sized(downloadBytes)} is over the ${toMb(LIMITS.downloadBytes)} MB budget (${count(LIMITS.downloadBytes)} bytes)`,
    );
  }

  return { rows, unassigned, fileCount: files.length, rawBytes, downloadBytes, failures };
}

const LABEL_WIDTH = 46;

/** The budget sheet: every budget row, then the download total and the file count. */
export function formatReport(result: BudgetResult): string[] {
  const line = (label: string, value: string): string => `  ${label.padEnd(LABEL_WIDTH)} ${value}`;
  // The exact byte count, so a small file (today's code bundle) doesn't read as "0.001 MB".
  const exact = (bytes: number): string => (bytes > 0 ? `  (${count(bytes)} bytes)` : '');
  const lines = ['Budgets (1 MB = 1,000,000 bytes; code gzipped):'];
  for (const [budget, { label, bytes: budgetBytes, isPerItem }] of Object.entries(BUDGETS) as [
    BudgetId,
    Budget,
  ][]) {
    const rows = result.rows.filter((row) => row.budget === budget);
    if (isPerItem && rows.length === 0) {
      lines.push(line(label, `none yet (${toMb(budgetBytes)} MB each)`));
      continue;
    }
    for (const row of rows) {
      const over = row.isOver ? '  OVER' : '';
      lines.push(
        line(
          rowLabel(row),
          `${toMb(row.bytes)} / ${toMb(budgetBytes)} MB${exact(row.bytes)}${over}`,
        ),
      );
    }
  }
  const totalOver = result.downloadBytes > LIMITS.downloadBytes ? '  OVER' : '';
  lines.push(
    line(
      'Download total',
      `${toMb(result.downloadBytes)} / ${toMb(LIMITS.downloadBytes)} MB${exact(result.downloadBytes)}${totalOver}`,
    ),
  );
  const filesOver = result.fileCount > LIMITS.maxFiles ? '  OVER' : '';
  lines.push(line('Files', `${count(result.fileCount)} / ${count(LIMITS.maxFiles)}${filesOver}`));
  return lines;
}

/** Walks a build folder and measures every file; code files are also gzipped (zlib default level, D3). */
export function collectFiles(distDir: string): BuiltFile[] {
  const files: BuiltFile[] = [];
  for (const entry of readdirSync(distDir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const full = join(entry.parentPath, entry.name);
    const path = relative(distDir, full).split(sep).join('/');
    const { size } = statSync(full);
    if (classifyFile(path)?.budget === 'code') {
      files.push({ path, bytes: size, gzipBytes: gzipSync(readFileSync(full)).length });
    } else {
      files.push({ path, bytes: size });
    }
  }
  return files.sort((a, b) => byCodeUnit(a.path, b.path));
}

function main(argv: readonly string[]): number {
  const distDir = argv.at(2);
  if (distDir === undefined) {
    log.error('assets', 'Usage: node scripts/checkBudgets.ts <dist-folder>');
    return 1;
  }
  // A folder without index.html is no build: an empty or wrong folder must not pass.
  if (!existsSync(join(distDir, 'index.html'))) {
    log.error('assets', `${distDir}/ has no build: run 'make build'`);
    return 1;
  }

  const result = checkBudgets(collectFiles(distDir));
  for (const reportLine of formatReport(result)) log.info('assets', reportLine);
  if (result.failures.length > 0) {
    for (const failure of result.failures) log.error('assets', failure);
    return 1;
  }
  log.info(
    'assets',
    `Budgets OK: ${toMb(result.downloadBytes)} of ${toMb(LIMITS.downloadBytes)} MB, ${count(result.fileCount)} files`,
  );
  return 0;
}

// Only when Node runs this file, never when a test imports it. process.exitCode, not
// process.exit(), so the output is flushed first.
if (import.meta.main) process.exitCode = main(process.argv);

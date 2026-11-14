import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import {
  BUDGETS,
  LIMITS,
  checkBudgets,
  classifyFile,
  collectFiles,
  formatReport,
} from './checkBudgets.ts';
import type { SpawnSyncReturns } from 'node:child_process';
import type { BuiltFile, FileGroup } from './checkBudgets.ts';

const SCRIPT = fileURLToPath(new URL('./checkBudgets.ts', import.meta.url));
const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

// Every number comes from BUDGETS and LIMITS; the tests never repeat the table (AC 10).

function file(path: string, bytes: number, gzipBytes?: number): BuiltFile {
  return gzipBytes === undefined ? { path, bytes } : { path, bytes, gzipBytes };
}

/** The current code-only build: `index.html` and one bundle, both tiny. */
const CODE_ONLY: readonly BuiltFile[] = [
  file('index.html', 360, 250),
  file('assets/index-AbC123.js', 1169, 593),
];

describe('classifyFile', () => {
  const cases: [string, FileGroup | null][] = [
    // 1-2: code
    ['index.html', { budget: 'code' }],
    ['assets/index-AbC123.js', { budget: 'code' }],
    ['assets/index-AbC123.css', { budget: 'code' }],
    // 3-4: level data and manifest
    ['assets/manifest.json', { budget: 'levelData' }],
    ['assets/levels/emberwood.json', { budget: 'levelData' }],
    ['assets/levels/drowned-mill.json', { budget: 'levelData' }],
    // 5: fonts, by folder, before any prefix rule
    ['assets/fonts/display-regular.woff2', { budget: 'fonts' }],
    ['assets/fonts/icon-x.woff2', { budget: 'fonts' }],
    // 6: backdrops join their level's kit
    ['assets/backdrops/drowned-mill/far.webp', { budget: 'kit', item: 'drowned-mill' }],
    // 7: kind prefixes
    ['assets/models/hero-rowan.glb', { budget: 'hero' }],
    ['assets/models/enemy-thorn-flyer.glb', { budget: 'enemy', item: 'thorn-flyer' }],
    ['assets/models/warden-drowned-miller.glb', { budget: 'warden' }],
    ['assets/kits/kit-drowned-mill.glb', { budget: 'kit', item: 'drowned-mill' }],
    ['assets/cards/card-intro-2-crack.webp', { budget: 'cards' }],
    ['assets/models/pickup-triple-shot.glb', { budget: 'pickupsMarkers' }],
    ['assets/models/marker-checkpoint.glb', { budget: 'pickupsMarkers' }],
    ['assets/audio/music/music-drowned-mill.ogg', { budget: 'musicAmbience' }],
    ['assets/audio/ambience/amb-harrowmere.ogg', { budget: 'musicAmbience' }],
    ['assets/audio/sfx/sfx-ember-spit.ogg', { budget: 'sfx' }],
    ['assets/icons/icon-gamepad-south.svg', { budget: 'icons' }],
    // 8: fits no group
    ['assets/models/rowan.glb', null],
    ['lookdev.html', null],
    ['hero-rowan.glb', null], // prefixes count only under assets/
    ['assets/sub/x.js', null], // code is only directly in assets/
    ['assets/font-AbC123.woff2', null], // a font Vite hashed into assets/
    ['assets/index-AbC123.js.map', null],
    ['assets/models/Hero-Rowan.glb', null], // names are case-sensitive
    ['assets/levels/notes.txt', null],
    ['assets/models/enemy-.glb', null], // no enemy name
  ];

  it.each(cases)('%s', (path, expected) => {
    expect(classifyFile(path)).toEqual(expected);
  });

  it('puts index.html in code', () => {
    expect(classifyFile('index.html')?.budget).toBe('code');
  });

  it('puts a level JSON and the manifest in level data and manifest', () => {
    expect(classifyFile('assets/levels/emberwood.json')?.budget).toBe('levelData');
    expect(classifyFile('assets/manifest.json')?.budget).toBe('levelData');
  });

  it('puts an icon- file in interface icons', () => {
    expect(classifyFile('assets/icons/icon-keyboard-z.svg')?.budget).toBe('icons');
  });
});

describe('checkBudgets', () => {
  it('passes the current code-only build', () => {
    const result = checkBudgets(CODE_ONLY);
    expect(result.failures).toEqual([]);
    expect(result.fileCount).toBe(2);
  });

  it('passes a group exactly at its budget', () => {
    const result = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/hero-rowan.glb', BUDGETS.hero.bytes),
    ]);
    expect(result.failures).toEqual([]);
  });

  it('fails a group one byte over its budget, naming the group, its size and its budget', () => {
    const over = BUDGETS.hero.bytes + 1;
    const result = checkBudgets([...CODE_ONLY, file('assets/models/hero-rowan.glb', over)]);
    expect(result.failures).toHaveLength(1);
    const [failure] = result.failures;
    expect(failure).toContain(BUDGETS.hero.label);
    expect(failure).toContain(over.toLocaleString('en-US'));
    expect(failure).toContain(BUDGETS.hero.bytes.toLocaleString('en-US'));
  });

  it(`passes ${String(LIMITS.maxFiles)} files and fails one more`, () => {
    const files = (count: number): BuiltFile[] =>
      Array.from({ length: count }, (_, i) => file(`assets/icons/icon-${String(i)}.svg`, 1));
    expect(checkBudgets(files(LIMITS.maxFiles)).failures).toEqual([]);
    const result = checkBudgets(files(LIMITS.maxFiles + 1));
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain((LIMITS.maxFiles + 1).toLocaleString('en-US'));
  });

  it('fails a file that fits no group, listing its path', () => {
    const result = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/rowan.glb', 1),
      file('lookdev.html', 1),
      file('assets/sub/x.js', 1),
    ]);
    expect(result.unassigned).toEqual([
      'assets/models/rowan.glb',
      'lookdev.html',
      'assets/sub/x.js',
    ]);
    expect(result.failures).toHaveLength(3);
    expect(result.failures[0]).toContain('assets/models/rowan.glb');
    expect(result.failures[1]).toContain('lookdev.html');
    expect(result.failures[2]).toContain('assets/sub/x.js');
  });

  it('measures code gzipped', () => {
    const underGzipped = checkBudgets([
      file('index.html', BUDGETS.code.bytes + 1, BUDGETS.code.bytes - 1),
    ]);
    expect(underGzipped.failures).toEqual([]);

    const overGzipped = checkBudgets([file('index.html', 1, BUDGETS.code.bytes + 1)]);
    expect(overGzipped.failures).toHaveLength(1);
    expect(overGzipped.failures[0]).toContain(BUDGETS.code.label);
  });

  it('counts index.html, JavaScript and CSS bundles together as code', () => {
    const third = Math.floor(BUDGETS.code.bytes / 3);
    const result = checkBudgets([
      file('index.html', third, third),
      file('assets/index-AbC123.js', third, third),
      file(
        'assets/index-AbC123.css',
        BUDGETS.code.bytes - 2 * third + 1,
        BUDGETS.code.bytes - 2 * third + 1,
      ),
    ]);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain(BUDGETS.code.label);
  });

  it('throws when a code file comes without its gzipped size (a caller bug)', () => {
    expect(() => checkBudgets([file('index.html', 1)])).toThrow(/index\.html/);
  });

  it('sums the level data and the manifest into one group', () => {
    const half = BUDGETS.levelData.bytes / 2;
    const atBudget = checkBudgets([
      ...CODE_ONLY,
      file('assets/levels/emberwood.json', half),
      file('assets/manifest.json', BUDGETS.levelData.bytes - half),
    ]);
    expect(atBudget.failures).toEqual([]);

    const over = checkBudgets([
      ...CODE_ONLY,
      file('assets/levels/emberwood.json', half),
      file('assets/manifest.json', BUDGETS.levelData.bytes - half + 1),
    ]);
    expect(over.failures).toHaveLength(1);
    expect(over.failures[0]).toContain(BUDGETS.levelData.label);
  });

  it('counts icon- files against the interface icons budget', () => {
    const result = checkBudgets([
      ...CODE_ONLY,
      file('assets/icons/icon-gamepad-south.svg', BUDGETS.icons.bytes + 1),
    ]);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain(BUDGETS.icons.label);
  });

  it('checks each enemy against its own budget, naming the enemy', () => {
    const atBudget = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/enemy-walker.glb', BUDGETS.enemy.bytes),
      file('assets/models/enemy-thorn-flyer.glb', BUDGETS.enemy.bytes),
    ]);
    expect(atBudget.failures).toEqual([]);

    const over = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/enemy-walker.glb', BUDGETS.enemy.bytes),
      file('assets/models/enemy-thorn-flyer.glb', BUDGETS.enemy.bytes + 1),
    ]);
    expect(over.failures).toHaveLength(1);
    expect(over.failures[0]).toContain(BUDGETS.enemy.label);
    expect(over.failures[0]).toContain('thorn-flyer');
  });

  it('merges a suffixed file name into the existing shorter item', () => {
    const half = BUDGETS.enemy.bytes / 2;
    const atBudget = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/enemy-walker.glb', half),
      file('assets/models/enemy-walker-mask.webp', BUDGETS.enemy.bytes - half),
    ]);
    expect(atBudget.failures).toEqual([]);
    expect(atBudget.rows.filter((row) => row.budget === 'enemy').map((row) => row.item)).toEqual([
      'walker',
    ]);

    const over = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/enemy-walker.glb', half),
      file('assets/models/enemy-walker-mask.webp', half),
      file('assets/models/enemy-walker-mask-2.webp', 1),
    ]);
    expect(over.failures).toHaveLength(1);
    expect(over.failures[0]).toContain(`${BUDGETS.enemy.label}: walker`);

    const kit = checkBudgets([
      ...CODE_ONLY,
      file('assets/kits/kit-emberwood.glb', BUDGETS.kit.bytes),
      file('assets/kits/kit-emberwood-props.glb', 1),
    ]);
    expect(kit.failures).toHaveLength(1);
    expect(kit.failures[0]).toContain('emberwood');
  });

  it('keeps a suffixed name as its own item when no shorter item exists', () => {
    const result = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/enemy-walker-mask.webp', 1),
      file('assets/models/enemy-thorn-flyer.glb', 1),
    ]);
    expect(result.failures).toEqual([]);
    expect(result.rows.filter((row) => row.budget === 'enemy').map((row) => row.item)).toEqual([
      'thorn-flyer',
      'walker-mask',
    ]);
  });

  it('fails a backdrop folder with no matching kit file', () => {
    const result = checkBudgets([
      ...CODE_ONLY,
      file('assets/kits/kit-emberwood.glb', 1),
      file('assets/backdrops/Emberwood/far.webp', 1),
    ]);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain('assets/backdrops/Emberwood/');
    expect(result.failures[0]).toContain('kit-Emberwood');
  });

  it('names a dotfile copied from public/ in its failure', () => {
    const result = checkBudgets([...CODE_ONLY, file('assets/levels/.gitkeep', 0)]);
    expect(result.unassigned).toEqual(['assets/levels/.gitkeep']);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain('dotfile');
  });

  it('sorts rows by code unit, not by locale', () => {
    const result = checkBudgets([
      ...CODE_ONLY,
      file('assets/models/enemy-b.glb', 1),
      file('assets/models/enemy-B.glb', 1),
      file('assets/models/enemy-a.glb', 1),
    ]);
    expect(result.rows.filter((row) => row.budget === 'enemy').map((row) => row.item)).toEqual([
      'B',
      'a',
      'b',
    ]);
  });

  it("sums a level's kit with its backdrops", () => {
    const half = BUDGETS.kit.bytes / 2;
    const atBudget = checkBudgets([
      ...CODE_ONLY,
      file('assets/kits/kit-emberwood.glb', half),
      file('assets/backdrops/emberwood/far.webp', BUDGETS.kit.bytes - half),
      file('assets/kits/kit-harrowmere.glb', BUDGETS.kit.bytes),
    ]);
    expect(atBudget.failures).toEqual([]);

    const over = checkBudgets([
      ...CODE_ONLY,
      file('assets/kits/kit-emberwood.glb', half),
      file('assets/backdrops/emberwood/far.webp', BUDGETS.kit.bytes - half + 1),
    ]);
    expect(over.failures).toHaveLength(1);
    expect(over.failures[0]).toContain('emberwood');
  });

  it('fails a download total over the limit even when every group is within budget', () => {
    const kitCount = Math.floor(LIMITS.downloadBytes / BUDGETS.kit.bytes) + 1;
    const kits = Array.from({ length: kitCount }, (_, i) =>
      file(`assets/kits/kit-level-${String(i)}.glb`, BUDGETS.kit.bytes),
    );
    const result = checkBudgets(kits);
    expect(result.downloadBytes).toBeGreaterThan(LIMITS.downloadBytes);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain('Download total');
  });

  it('counts code at its gzipped size in the download total, everything else raw', () => {
    const result = checkBudgets([
      file('index.html', 1000, 400),
      file('assets/index-AbC123.js', 5000, 2000),
      file('assets/models/hero-rowan.glb', 7000),
    ]);
    expect(result.downloadBytes).toBe(400 + 2000 + 7000);
    expect(result.rawBytes).toBe(1000 + 5000 + 7000);
  });

  it("fails a file over itch.io's per-file limit", () => {
    const result = checkBudgets([file('assets/models/hero-rowan.glb', LIMITS.maxFileBytes + 1)]);
    expect(
      result.failures.some(
        (f) => f.includes('assets/models/hero-rowan.glb') && f.includes('per-file'),
      ),
    ).toBe(true);
  });

  it("fails a raw total over itch.io's limit", () => {
    const count = Math.floor(LIMITS.maxRawTotalBytes / LIMITS.maxFileBytes) + 1;
    const files = Array.from({ length: count }, (_, i) =>
      file(`assets/models/hero-${String(i)}.glb`, LIMITS.maxFileBytes),
    );
    const result = checkBudgets(files);
    expect(result.rawBytes).toBeGreaterThan(LIMITS.maxRawTotalBytes);
    expect(result.failures.some((f) => f.startsWith('Raw total'))).toBe(true);
    expect(result.failures.some((f) => f.includes('per-file'))).toBe(false);
  });
});

describe('formatReport', () => {
  it('lists every budget row, "none yet" for empty per-item budgets, and the totals', () => {
    const lines = formatReport(checkBudgets(CODE_ONLY));
    for (const budget of Object.values(BUDGETS)) {
      expect(lines.filter((line) => line.includes(budget.label))).toHaveLength(1);
    }
    expect(lines.filter((line) => line.includes('none yet'))).toHaveLength(2);
    expect(lines.some((line) => line.includes('Download total'))).toBe(true);
    expect(lines.some((line) => line.includes('Files'))).toBe(true);
  });

  it('lists each per-item group and marks a row over budget', () => {
    const lines = formatReport(
      checkBudgets([
        ...CODE_ONLY,
        file('assets/models/enemy-walker.glb', 1),
        file('assets/models/enemy-thorn-flyer.glb', BUDGETS.enemy.bytes + 1),
      ]),
    );
    const enemyLines = lines.filter((line) => line.includes(BUDGETS.enemy.label));
    expect(enemyLines).toHaveLength(2);
    expect(enemyLines.find((line) => line.includes('thorn-flyer'))).toContain('OVER');
    expect(enemyLines.find((line) => line.includes('walker'))).not.toContain('OVER');
  });
});

describe('limit messages', () => {
  it('give the limit in MB and in bytes', () => {
    const bigFile = checkBudgets([file('assets/models/hero-rowan.glb', LIMITS.maxFileBytes + 1)]);
    expect(bigFile.failures.find((f) => f.includes('per-file'))).toContain(
      LIMITS.maxFileBytes.toLocaleString('en-US'),
    );

    const count = Math.floor(LIMITS.maxRawTotalBytes / LIMITS.maxFileBytes) + 1;
    const rawTotal = checkBudgets(
      Array.from({ length: count }, (_, i) =>
        file(`assets/models/hero-${String(i)}.glb`, LIMITS.maxFileBytes),
      ),
    );
    expect(rawTotal.failures.find((f) => f.startsWith('Raw total'))).toContain(
      LIMITS.maxRawTotalBytes.toLocaleString('en-US'),
    );
  });
});

describe('the command line, run as make build runs it', () => {
  // A real `node scripts/checkBudgets.ts <folder>` subprocess: it proves the exit codes, the
  // import.meta.main guard, and that the script's imports still run natively in Node (Vitest
  // transforms TypeScript, so only a subprocess catches syntax Node can't strip).
  const roots: string[] = [];

  afterEach(() => {
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  });

  function build(files: Record<string, string>): string {
    const root = mkdtempSync(join(tmpdir(), 'budgets-cli-'));
    roots.push(root);
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    }
    return root;
  }

  function run(...args: string[]): SpawnSyncReturns<string> {
    // Absolute paths and an explicit cwd, so the tests pass from any working directory.
    return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: REPO_ROOT });
  }

  it('exits 0 and reports on a passing build', () => {
    const result = run(build({ 'index.html': '<!doctype html>', 'assets/index-x.js': 'x' }));
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Budgets OK');
  });

  it('exits 1 and names the file on a failing build', () => {
    const result = run(build({ 'index.html': '<!doctype html>', 'assets/zz.dat': 'x' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('assets/zz.dat');
  });

  it('exits 1 on a folder without index.html, or no folder at all', () => {
    const empty = run(build({}));
    expect(empty.status).toBe(1);
    expect(empty.stderr).toContain('has no build');
    expect(run().status).toBe(1);
  });
});

describe('collectFiles', () => {
  let root: string | undefined;

  afterEach(() => {
    if (root !== undefined) rmSync(root, { recursive: true, force: true });
    root = undefined;
  });

  function put(path: string, content: string): void {
    if (root === undefined) throw new Error('no temporary folder');
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }

  it('walks the folder, measures every file and gzips only the code', () => {
    root = mkdtempSync(join(tmpdir(), 'budgets-'));
    const js = 'console.log("ember");\n'.repeat(200);
    const glb = 'not really a model';
    const html = '<!doctype html><title>x</title>';
    put('index.html', html);
    put('assets/index-x.js', js);
    put('assets/models/hero-x.glb', glb);

    const files = collectFiles(root);
    const byPath = new Map(files.map((f) => [f.path, f]));
    expect([...byPath.keys()].sort()).toEqual([
      'assets/index-x.js',
      'assets/models/hero-x.glb',
      'index.html',
    ]);

    const jsFile = byPath.get('assets/index-x.js');
    expect(jsFile?.bytes).toBe(Buffer.byteLength(js));
    expect(jsFile?.gzipBytes).toBeLessThan(Buffer.byteLength(js));
    expect(byPath.get('index.html')?.bytes).toBe(Buffer.byteLength(html));
    expect(byPath.get('index.html')?.gzipBytes).toBeTypeOf('number');

    const glbFile = byPath.get('assets/models/hero-x.glb');
    expect(glbFile?.bytes).toBe(Buffer.byteLength(glb));
    expect(glbFile?.gzipBytes).toBeUndefined();
  });
});

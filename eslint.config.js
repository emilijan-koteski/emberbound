// ESLint flat config: typescript-eslint strictTypeChecked, plus the layer boundaries from the
// architecture (Project Structure, Architectural Boundaries). `make lint` runs it.
//
// Flat config replaces a rule's options instead of merging them, so every source file matches
// exactly one entry in LAYERS, and that entry carries the layer's complete restriction lists.
import { builtinModules } from 'node:module';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const BOUNDARIES = 'see the architecture, Project Structure > Architectural Boundaries';

/**
 * Matches an import that passes through folder `name`, e.g. `../render/stage.ts`, or names the
 * folder itself, e.g. `../render` (its index file).
 */
const seg = (name) => `(^|/)${name}(/|$)`;

/** Matches a relative import that climbs out of the importing file's folder, `./` prefixes included. */
const UP = '^(\\./)*\\.\\./';

const three = {
  // three.js only in render/ (and debug/, main.ts, tests).
  whole: { regex: '^three(/|$)', message: 'three.js is imported only in render/' },
  // Shader code only in render/materials/ (architecture Decision 1: WebGLRenderer with GLSL).
  shaderNames: {
    name: 'three',
    importNames: ['ShaderMaterial', 'RawShaderMaterial'],
    message:
      'ShaderMaterial and RawShaderMaterial only in render/materials/. Outside it, import three.js by name, not as a namespace.',
  },
  shaderPaths: [
    {
      regex: '^three/(addons|examples/jsm)/postprocessing/',
      message: 'Post-processing passes live only in render/materials/',
    },
    {
      regex: '^three/addons$',
      message:
        'The three/addons barrel re-exports the post-processing passes; import add-ons by their deep path',
    },
    {
      regex: '^three/(webgpu|tsl|src)(/|$)',
      message:
        'The renderer is WebGLRenderer with GLSL: no WebGPU, no TSL, no deep three/src imports',
    },
  ],
};

// Node built-ins, with or without the `node:` prefix. The root tsconfig carries Node types for
// scripts/ and tests/, so only lint keeps them out of browser code.
const NODE_BUILTINS = {
  regex: `^(node:.*|(${builtinModules.filter((m) => !m.startsWith('node:')).join('|')})(/.*)?)$`,
  message: 'browser code: no Node built-in modules',
};
const NODE_GLOBALS = [
  'process',
  'Buffer',
  'global',
  'require',
  '__dirname',
  '__filename',
  'setImmediate',
];

// The look-dev page's 3D builders live in render/ (lookdev/ may not import three.js) but are
// development only: nothing in the game's graph may import them (story 0.6 code review).
const LOOKDEV_SCENES = {
  regex: '(^|/)lookdevScenes(\\.ts)?$',
  message: 'render/lookdevScenes.ts is for the look-dev page only (development only)',
};

const SIM_VALUES_EXCEPT_CONFIG = {
  regex: '(^|/)sim(/(?!config\\.ts$)|$)',
  allowTypeImports: true,
  message: 'Only types from sim/, and values from sim/config.ts',
};

/**
 * One entry per layer. `bans`: folder segments this layer may not import. `typesOnly`:
 * folders it may import types from but not values. `banThree`: no three.js at all;
 * otherwise only the shader bans apply. `extra`: additional import patterns.
 */
const LAYERS = [
  {
    name: 'core/',
    files: ['src/core/**/*.ts'],
    banThree: true,
    noDynamicImport: true,
    extra: [{ regex: UP, message: 'core/ imports nothing outside itself' }],
  },
  {
    name: 'sim/',
    files: ['src/sim/**/*.ts'],
    banThree: true,
    bans: [
      'app',
      'render',
      'ui',
      'audio',
      'input',
      'platform',
      'content',
      'debug',
      'lookdev',
      'scripts',
    ],
    sim: true,
    noDynamicImport: true,
  },
  {
    name: 'content/',
    files: ['src/content/**/*.ts'],
    banThree: true,
    bans: ['sim', 'app', 'render', 'ui', 'audio', 'input', 'platform', 'debug', 'lookdev'],
    noDynamicImport: true,
  },
  {
    name: 'platform/',
    files: ['src/platform/**/*.ts'],
    banThree: true,
    bans: ['sim', 'render', 'app', 'ui', 'audio', 'input', 'content', 'debug', 'lookdev'],
  },
  {
    name: 'input/',
    files: ['src/input/**/*.ts'],
    banThree: true,
    bans: ['app', 'render', 'ui', 'audio', 'content', 'debug', 'lookdev'],
    typesOnly: ['sim'],
  },
  {
    name: 'app/',
    files: ['src/app/**/*.ts'],
    banThree: true,
    bans: ['render', 'ui', 'audio', 'debug', 'lookdev'],
    typesOnly: ['input'],
  },
  {
    name: 'render/',
    files: ['src/render/**/*.ts'],
    ignores: ['src/render/materials/**'],
    bans: ['app', 'ui', 'audio', 'platform', 'input', 'debug', 'lookdev'],
    extra: [SIM_VALUES_EXCEPT_CONFIG, LOOKDEV_SCENES],
  },
  {
    name: 'render/materials/',
    files: ['src/render/materials/**/*.ts'],
    shaderAllowed: true,
    bans: ['sim', 'app', 'ui', 'audio', 'platform', 'input', 'content', 'debug', 'lookdev'],
    extra: [
      {
        // materials/ is flat (architecture, Directory Structure): `../x` is a render/ sibling.
        regex: '^(\\./)*\\.\\./(?!(palettes|lighting)(/|$)|\\.\\./)',
        message: 'render/materials/ takes only render/palettes/ and render/lighting/ from render/',
      },
      {
        // The same rule for a path that leaves render/ and comes back, e.g. `../../render/stage.ts`.
        regex: '(^|/)render/(?!(palettes|lighting|materials)(/|$))',
        message: 'render/materials/ takes only render/palettes/ and render/lighting/ from render/',
      },
    ],
  },
  {
    name: 'audio/',
    files: ['src/audio/**/*.ts'],
    banThree: true,
    bans: ['render', 'ui', 'app', 'input', 'debug', 'lookdev'],
    extra: [SIM_VALUES_EXCEPT_CONFIG],
  },
  {
    name: 'ui/',
    files: ['src/ui/**/*.ts'],
    banThree: true,
    bans: ['render', 'audio', 'platform', 'input', 'debug', 'lookdev'],
    typesOnly: ['app'],
    extra: [SIM_VALUES_EXCEPT_CONFIG],
  },
  { name: 'debug/', files: ['src/debug/**/*.ts'] },
  {
    name: 'lookdev/',
    files: ['src/lookdev/**/*.ts'],
    banThree: true,
    bans: ['sim', 'app', 'audio', 'platform', 'input', 'debug'],
  },
  // The game's entry: the look-dev page is development only and never part of the game's graph.
  { name: 'main.ts', files: ['src/main.ts'], bans: ['lookdev'], extra: [LOOKDEV_SCENES] },
  {
    name: 'scripts/',
    files: ['scripts/**/*.ts'],
    banThree: true,
    node: true,
    extra: [
      {
        regex: '(^|/)src/(render|ui|audio|app|input|platform|content|debug|lookdev)(/|$)',
        message: 'scripts/ may import core/, sim/level/ and values from sim/config.ts only',
      },
      {
        regex: '(^|/)sim(/(?!level/|config\\.ts$)|$)',
        message: 'scripts/ may import sim/level/ and values from sim/config.ts only',
      },
    ],
  },
  { name: 'tests/', files: ['tests/**/*.ts'], node: true },
];

// Any src/ file no layer above claims (a new folder, or a file at the src/ root other than
// main.ts) still gets the defaults: the shader bans and no Node globals. Give it a layer entry
// when the folder becomes part of the architecture.
LAYERS.push({
  name: 'src/ (no layer)',
  files: ['src/**/*.ts'],
  ignores: LAYERS.flatMap((layer) => layer.files).filter((glob) => glob.startsWith('src/')),
});

function layerConfig(layer) {
  const message = (text) => `${layer.name}: ${text} (${BOUNDARIES})`;
  const patterns = [];
  const paths = [];
  if (layer.banThree) {
    patterns.push({ ...three.whole, message: message(three.whole.message) });
  } else if (!layer.shaderAllowed) {
    paths.push({ ...three.shaderNames, message: message(three.shaderNames.message) });
    for (const p of three.shaderPaths) patterns.push({ ...p, message: message(p.message) });
  }
  for (const folder of layer.bans ?? []) {
    patterns.push({ regex: seg(folder), message: message(`may not import ${folder}/`) });
  }
  for (const folder of layer.typesOnly ?? []) {
    patterns.push({
      regex: seg(folder),
      allowTypeImports: true,
      message: message(`only type imports from ${folder}/`),
    });
  }
  for (const p of layer.extra ?? []) patterns.push({ ...p, message: message(p.message) });
  if (!layer.node) patterns.push({ ...NODE_BUILTINS, message: message(NODE_BUILTINS.message) });

  const rules = {};
  if (paths.length > 0 || patterns.length > 0) {
    rules['no-restricted-imports'] = ['error', { paths, patterns }];
  }
  if (layer.noDynamicImport) {
    // no-restricted-imports sees only static imports; a dynamic import() would bypass every ban.
    rules['no-restricted-syntax'] = [
      'error',
      { selector: 'ImportExpression', message: message('no dynamic import()') },
      { selector: 'TSImportType', message: message("no import('…') type queries") },
    ];
  }
  if (layer.sim) {
    const deterministic = 'sim/ is deterministic: use sim/math.ts and world.rng';
    rules['no-restricted-properties'] = [
      'error',
      { object: 'Math', property: 'random', message: message(deterministic) },
      { object: 'Math', property: 'sin', message: message(deterministic) },
      { object: 'Math', property: 'cos', message: message(deterministic) },
    ];
    rules['no-restricted-globals'] = [
      'error',
      { name: 'Date', message: message('no clock time in sim/; time is counted in steps') },
      { name: 'performance', message: message('no clock time in sim/; time is counted in steps') },
      ...NODE_GLOBALS.map((name) => ({
        name,
        message: message('sim/ runs in the browser too: no Node globals'),
      })),
    ];
  } else if (!layer.node) {
    rules['no-restricted-globals'] = [
      'error',
      ...NODE_GLOBALS.map((name) => ({ name, message: message('browser code: no Node globals') })),
    ];
  }
  return {
    name: `emberbound/layer/${layer.name}`,
    files: layer.files,
    ignores: layer.ignores ?? [],
    rules,
  };
}

export default defineConfig([
  globalIgnores([
    '_bmad/',
    '_bmad-output/',
    '.claude/',
    'prototype/',
    'node_modules/',
    'dist/',
    'coverage/',
    '.vitest/',
    'test-results/',
    'playwright-report/',
    'blob-report/',
    'shots/',
    'public/',
  ]),
  tseslint.configs.strictTypeChecked,
  {
    name: 'emberbound/project',
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-console': 'error',
    },
  },
  { name: 'emberbound/log', files: ['src/core/log.ts'], rules: { 'no-console': 'off' } },
  ...LAYERS.map(layerConfig),
  // This config file is the only JavaScript; it belongs to no tsconfig, so lint it untyped.
  { files: ['**/*.js'], extends: [tseslint.configs.disableTypeChecked] },
]);

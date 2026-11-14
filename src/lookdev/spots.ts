// The look-dev spots: fixed views, window sizes, cameras and animation times for the critic loop
// (story 0.6; architecture, Deterministic Screenshot Spots). tests/e2e/shots.spec.ts imports this
// list in Node, so it stays pure data with no imports. Epic 1 adds gameplay spots through
// src/debug/spots.ts and ?shot=<spotId>.

export interface LookdevSpot {
  /** Kebab-case; the screenshot's file name. */
  readonly id: string;
  /** A view id from LOOKDEV_VIEWS in assetBrowser.ts. */
  readonly view: string;
  /** Window size in CSS pixels. */
  readonly width: number;
  readonly height: number;
  /** Animation time, frozen for every frame of the spot. Each view's camera is its fixed default. */
  readonly animTimeSeconds: number;
  /** A level id, for views that show a level (story 0.9); the view checks it. */
  readonly level?: string;
}

export const LOOKDEV_SPOTS: readonly LookdevSpot[] = [
  { id: 'lookdev-overlay-1080', view: 'overlay', width: 1920, height: 1080, animTimeSeconds: 0 },
  { id: 'lookdev-overlay-720', view: 'overlay', width: 1280, height: 720, animTimeSeconds: 0 },
  { id: 'lookdev-renderer-1080', view: 'renderer', width: 1920, height: 1080, animTimeSeconds: 0 },
  { id: 'lookdev-palettes-1080', view: 'palettes', width: 1920, height: 1080, animTimeSeconds: 0 },
  { id: 'lookdev-type-1080', view: 'type', width: 1920, height: 1080, animTimeSeconds: 0 },
  { id: 'lookdev-type-720', view: 'type', width: 1280, height: 720, animTimeSeconds: 0 },
  {
    id: 'lookdev-materials-emberwood-1080',
    view: 'materials',
    width: 1920,
    height: 1080,
    animTimeSeconds: 0,
    level: 'emberwood',
  },
  {
    id: 'lookdev-materials-drowned-mill-1080',
    view: 'materials',
    width: 1920,
    height: 1080,
    animTimeSeconds: 0,
    level: 'drowned-mill',
  },
  {
    id: 'lookdev-materials-harrowmere-1080',
    view: 'materials',
    width: 1920,
    height: 1080,
    animTimeSeconds: 0,
    level: 'harrowmere',
  },
];

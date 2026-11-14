// Every gameplay number lives here, and only here (CLAUDE.md). Fields arrive with the
// stories that need them: CONFIG.view in story 0.6, the rest in Epic 1.
// Presentation layers and scripts may import these values; nothing mutates them (AR33).
export const CONFIG = {
  view: {
    width: 19, // tiles: the logical view, at least 19 × 10.4 tiles (AR77)
    height: 10.4, // tiles
    // tiles per side around the logical view that the view camera also frames; † until
    // story 0.10 locks the framing (default X-B35). ui/overlay.ts reads it for --tile.
    margin: 0,
  },
} as const;

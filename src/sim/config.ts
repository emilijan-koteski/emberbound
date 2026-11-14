// Every gameplay number lives here, and only here (CLAUDE.md). Fields arrive with the
// stories that need them: CONFIG.view in story 0.6, the rest in Epic 1.
// Presentation layers and scripts may import these values; nothing mutates them (AR33).
export const CONFIG = {
  view: {
    width: 19, // tiles: the logical view, at least 19 × 10.4 tiles (AR77)
    height: 10.4, // tiles
    // tiles per side around the logical view that the view camera also frames (default X-B35).
    // ui/overlay.ts reads it for --tile, render/viewCamera.ts for the framing. Locked by the
    // developer at story 0.10's sign-off (2026-11-14): 0, so --tile stays DESIGN.md's.
    margin: 0,
    // degrees, vertical (as three's PerspectiveCamera.fov): the view camera's field of view
    // (AR162, "about 30°"). Not a gameplay number: it had no stated home (ga#17), so it sits
    // beside the margin, the epic's reading. Locked by the developer at story 0.10's sign-off
    // (2026-11-14).
    fovDeg: 30,
  },
} as const;

# Emberbound

A small 2.5D side-scrolling platformer for the desktop browser, built with three.js and TypeScript. (Working title.)

## Prerequisites

- **mise**, which installs every pinned tool. On Arch-based systems: `pacman -S mise`. Elsewhere, use mise's installer (<https://mise.jdx.dev/getting-started.html>).
- **git**.
- **Docker**, only if a service is ever needed. Version one needs none.

Node.js and git-lfs come from `mise.toml`. Never use a globally installed Node.

## Getting started

```bash
git clone https://github.com/emilijan-koteski/emberbound.git
cd emberbound
mise trust          # only if mise asks
mise install        # Node and git-lfs, at the versions in mise.toml
git lfs install     # once per machine, after mise has installed git-lfs
make setup          # npm ci, plus Playwright's Chromium and Firefox
make dev            # the dev server
make check          # lint, format check, type check, tests
```

On a clone made before git-lfs was installed, run `git lfs pull` too.

`make help` lists every target. Always run the project through `make`, not raw `npm`, `npx` or `vite` commands.

`make dev` serves on port 5173 and fails if the port is busy; pick another with `make dev DEV_PORT=5000`.

Playwright doesn't officially support Arch-based systems. It warns about that and uses its Ubuntu builds. If a browser fails to start for a missing system library, install that library with the system package manager. `make setup` never uses `--with-deps`, which calls `apt-get`.

## The look-dev page and the critic loop

- **Look-dev page:** run `make dev`, then open <http://localhost:5173/lookdev.html>. It shows the game's look in the engine: the renderer with its statistics, the overlay's colour roles and type, each level's palette and lighting rig beside the style guide's values, the two overlay typefaces, self-hosted from `public/assets/fonts/`, in every weight the tokens use, and every shared material (`src/render/materials/`) on simple shapes under any level's palette and rig, beside the chosen key art. Every asset and screen is judged there against `docs/STYLE_GUIDE.md`. It is development only: `make build` leaves it out.
- **Screenshots:** `make shots ROUND=n` (n a whole number, no leading zero) first runs the look-dev checks in `tests/e2e/lookdev/`, then captures every look-dev spot (listed in `src/lookdev/spots.ts`) as `shots/round-<n>/<spotId>.png`, in headless Chromium against its own dev server on port 5174 (`SHOTS_PORT`). A spot shows the full window with no look-dev bar. A failing check stops it before any shot is taken; a round that already exists is refused; a run that fails part-way leaves only `shots/round-<n>.partial/`, and the number stays free.
- Shots are compared by eye, never pixel-diffed, and never used for performance numbers: headless timings aren't a real frame. `shots/` is git-ignored, and `make clean` keeps it.

### The GPU: always the GTX 1650

This laptop has two GPUs, an Intel UHD 630 and an NVIDIA GTX 1650, and the game is developed and tested on the GTX 1650 only.

- **Tests:** `GPU=nvidia` is the Makefile's default. `playwright.config.ts` then runs every browser with NVIDIA PRIME render offload, and Chromium with `--use-angle=gl --ignore-gpu-blocklist`. The look-dev checks fail if WebGL isn't on the GTX 1650. On a machine without that card, add `GPU=default` (for example `make shots ROUND=n GPU=default`).
- **Development:** the browser here is Chromium (`/usr/bin/chromium`), not Chrome. Open the game or the look-dev page on the GTX 1650 with:

  ```bash
  prime-run chromium --ozone-platform=x11 --use-angle=gl --ignore-gpu-blocklist http://localhost:5173/lookdev.html
  ```

  `prime-run` sets the offload variables. Chromium needs the X11 platform and ANGLE's GL path to honour them: on its default Wayland path it stays on the Intel GPU. For Firefox, `prime-run firefox` is enough.
- **Checking:** the look-dev renderer view shows `GPU: …` above its statistics. It should name the GTX 1650 (Firefox shows only a class, "NVIDIA …, or similar").

## Version policy

- **Exact pins everywhere.** Tools are pinned in `mise.toml`. Libraries are pinned in `package.json`, with `package-lock.json` committed. `.npmrc` sets `save-exact`.
- **Take the newest patch that is at least two weeks old.** There are two exceptions, and each is written down with its reason: in a comment next to the pin in `mise.toml`, or, for `package.json` (which can't hold comments), in the story that pinned it.
  - a security fix may be younger;
  - so may a release of a version line the architecture names when that line has no release two weeks old yet.
- **Upgrades get their own story.** A three.js upgrade is a story of its own, with the critic loop re-run, because a new revision can change APIs and looks. So is the move to TypeScript 7.
- **No new dependency without the developer's approval.**
- **Services run in Docker.** Any service the project needs runs through a committed `docker compose` file, started and stopped with `make` targets. Version one needs none.

## Where the rules live

- `CLAUDE.md`: standing rules for every session.
- `_bmad-output/project-context.md`: implementation rules for AI agents.
- `_bmad-output/planning-artifacts/architectures/architecture-emberbound-2026-11-13/game-architecture.md`: the architecture, including layers and boundaries, the toolchain and the build.
- `docs/PROJECT_BRIEF.md`: the original brief.

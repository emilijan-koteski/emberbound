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

Playwright doesn't officially support Arch-based systems. It warns about that and uses its Ubuntu builds. If a browser fails to start for a missing system library, install that library with the system package manager. `make setup` never uses `--with-deps`, which calls `apt-get`.

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

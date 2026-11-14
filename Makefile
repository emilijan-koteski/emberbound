# Emberbound: the single entry point for setting up, developing, testing and building.
# Run `make` (or `make help`) to list the targets.
#
# Tools: every recipe runs through $(MISE), so the versions pinned in mise.toml are used,
#   never whatever happens to be on PATH (the machine's global Node, for example).
#   Chosen 2026-11-13, after reading https://mise.jdx.dev/cli/exec.html: mise documents
#   `mise exec` for scripts and CI. It works from any shell (fish, bash, VS Code tasks)
#   without `mise activate`, and installs a missing pinned tool instead of falling back
#   to a global one. The rejected options were an activated shell (depends on the
#   caller) and a PATH built from `mise bin-paths` (breaks before the tools are installed).
#   Local binaries are called by path ($(BIN)/...), so a missing install fails loudly
#   instead of npx downloading something unpinned.
#
# Targets added by later stories:
#   levels    Epic 1 (Tiled compile and validation), plus the Tiled check in `setup`
#   models    Epic 2 (gltf-transform compression of Blender exports)
#   release   Epic 6 (butler upload to itch.io)
#
# Playwright's webServer (playwright.config.ts) starts the preview through `make preview` and
# the dev server through `make dev`, so both commands are defined only here.

SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help
MAKEFLAGS += --no-print-directory

MISE := mise exec --
BIN := node_modules/.bin
# Exported so playwright.config.ts serves and tests the same port, e.g. `make smoke PREVIEW_PORT=5000`.
PREVIEW_PORT ?= 4173
export PREVIEW_PORT
# `make dev` fails on a busy port instead of moving to another (story 0.6, D2): `make dev DEV_PORT=5000`.
DEV_PORT ?= 5173
export DEV_PORT
# The screenshot harness starts its own dev server here and never reuses one (story 0.6, D2).
SHOTS_PORT ?= 5174
export SHOTS_PORT
# Every browser test runs WebGL on the NVIDIA GTX 1650 (the developer's rule, 2026-11-14):
# playwright.config.ts applies PRIME render offload when GPU=nvidia. On a machine without that
# card, run with GPU=default. The look-dev checks fail if GPU=nvidia and the card isn't in use.
GPU ?= nvidia
export GPU

.PHONY: help setup dev test test-watch smoke shots lint format typecheck check contrast build preview clean

help: ## List the targets
	@echo "Emberbound make targets:"
	@grep -E '^[a-zA-Z_-]+:.*## ' $(firstword $(MAKEFILE_LIST)) | \
		awk 'BEGIN {FS = ":.*## "} {printf "  %-11s %s\n", $$1, $$2}'

setup: ## Install the pinned tools, the npm packages and Playwright's browsers
	mise install
	$(MISE) npm ci
	$(MISE) $(BIN)/playwright install chromium firefox

dev: ## Start the Vite dev server (localhost only): the game, and the look-dev page at /lookdev.html
	$(MISE) $(BIN)/vite --port $(DEV_PORT) --strictPort

test: ## Run the Node test layers once (Vitest)
	$(MISE) $(BIN)/vitest run

test-watch: ## Run the Node test layers in watch mode
	$(MISE) $(BIN)/vitest

smoke: build ## Build, then run the browser smoke check in headless Chromium and Firefox
	E2E_TARGET=preview $(MISE) $(BIN)/playwright test tests/e2e/smoke.spec.ts

# The critic loop's screenshots (story 0.6; architecture, Deterministic Screenshot Spots). The
# look-dev checks in tests/e2e/lookdev/ run first, against the dev server, and a failure stops the
# run before any shot is taken. Shots land in shots/round-<n>/ (git-ignored; `make clean` keeps
# them). ROUND counts only when given on the command line, like COLORS below; it is a whole number
# with no leading zero, so one round has one folder. A round that already exists is refused, so the
# "before" shots are never overwritten. The spec writes into shots/round-<n>.partial/, renamed only
# when every spot succeeds, so a failed run leaves no half round and keeps its number free.
SHOTS_ROUND := $(if $(filter command line,$(origin ROUND)),$(ROUND))
shots: ## Run the look-dev checks, then save the critic-loop screenshots: make shots ROUND=n
	@[[ "$(SHOTS_ROUND)" =~ ^(0|[1-9][0-9]*)$$ ]] || { echo "usage: make shots ROUND=n (n a whole number, no leading zero)" >&2; exit 2; }
	@[[ ! -e "shots/round-$(SHOTS_ROUND)" ]] || { echo "shots/round-$(SHOTS_ROUND) exists: use a new round number" >&2; exit 2; }
	E2E_TARGET=dev $(MISE) $(BIN)/playwright test tests/e2e/lookdev/
	rm -rf "shots/round-$(SHOTS_ROUND).partial"
	E2E_TARGET=dev ROUND=$(SHOTS_ROUND) $(MISE) $(BIN)/playwright test tests/e2e/shots.spec.ts
	mv "shots/round-$(SHOTS_ROUND).partial" "shots/round-$(SHOTS_ROUND)"

lint: ## Lint with ESLint, layer boundaries included
	$(MISE) $(BIN)/eslint .

format: ## Format code and config with Prettier (writes changes)
	$(MISE) $(BIN)/prettier --write .

typecheck: ## Type-check the root project, then the DOM-free simulation project
	$(MISE) $(BIN)/tsc --noEmit -p tsconfig.json
	$(MISE) $(BIN)/tsc --noEmit -p src/sim/tsconfig.json

check: ## Lint, format check, type check and tests: run before saying a change works
	$(MAKE) lint
	$(MISE) $(BIN)/prettier --check .
	$(MAKE) typecheck
	$(MAKE) test

# Proposed colours: a YAML file with a top-level colors: map (all 16 roles), or a Markdown file
# whose frontmatter has one. Story 0.5 re-measures the style guide's values with it. With no
# COLORS, it checks DESIGN.md's own colours, as `make test` does.
# COLORS counts only when given on the command line: a COLORS variable exported by the shell is
# ignored, so a bare `make contrast` always checks DESIGN.md. Quoted, so a path may hold spaces.
CONTRAST_FILE := $(if $(filter command line,$(origin COLORS)),$(COLORS))
contrast: ## Check DESIGN.md's contrast targets, or a proposed set: make contrast COLORS=file.yaml
	$(MISE) node scripts/checkContrast.ts $(if $(CONTRAST_FILE),"$(CONTRAST_FILE)")

# make build, in the architecture's order (Build and Release). Epic 1 fills in the gaps:
#   story 1.2: the level compile, before the type check
#   story 1.3: the release manifest, before vite build (Vite copies it into dist/)
#   story 1.2: removing test levels from dist/assets/levels/, before the budget check
# Lint runs first so a release can't ship a layer violation (story 0.1 review).
build: ## Lint, type check, test, build into dist/, then check the download budgets
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) test
	$(MISE) $(BIN)/vite build
	$(MISE) node scripts/checkBudgets.ts dist

preview: ## Serve the production build in dist/ on PREVIEW_PORT (default 4173)
	@test -f dist/index.html || { echo "dist/ has no build: run 'make build' first" >&2; exit 1; }
	$(MISE) $(BIN)/vite preview --port $(PREVIEW_PORT) --strictPort

clean: ## Remove build output and tool caches (keeps node_modules/ and shots/)
	rm -rf dist .vitest test-results playwright-report blob-report coverage \
		node_modules/.vite node_modules/.cache node_modules/.tmp

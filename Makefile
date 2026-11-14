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
#   shots     story 0.6 (critic-loop screenshot harness)
#   levels    Epic 1 (Tiled compile and validation), plus the Tiled check in `setup`
#   models    Epic 2 (gltf-transform compression of Blender exports)
#   release   Epic 6 (butler upload to itch.io)
#
# Playwright's webServer (playwright.config.ts) starts the preview through `make preview`,
# so the preview command is defined only here.

SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help
MAKEFLAGS += --no-print-directory

MISE := mise exec --
BIN := node_modules/.bin
# Exported so playwright.config.ts serves and tests the same port, e.g. `make smoke PREVIEW_PORT=5000`.
PREVIEW_PORT ?= 4173
export PREVIEW_PORT

.PHONY: help setup dev test test-watch smoke lint format typecheck check build preview clean

help: ## List the targets
	@echo "Emberbound make targets:"
	@grep -E '^[a-zA-Z_-]+:.*## ' $(firstword $(MAKEFILE_LIST)) | \
		awk 'BEGIN {FS = ":.*## "} {printf "  %-11s %s\n", $$1, $$2}'

setup: ## Install the pinned tools, the npm packages and Playwright's browsers
	mise install
	$(MISE) npm ci
	$(MISE) $(BIN)/playwright install chromium firefox

dev: ## Start the Vite dev server (localhost only)
	$(MISE) $(BIN)/vite

test: ## Run the Node test layers once (Vitest)
	$(MISE) $(BIN)/vitest run

test-watch: ## Run the Node test layers in watch mode
	$(MISE) $(BIN)/vitest

smoke: build ## Build, then run the browser smoke check in headless Chromium and Firefox
	$(MISE) $(BIN)/playwright test tests/e2e/smoke.spec.ts

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

build: ## Lint, type check, test, then build the release into dist/
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) test
	$(MISE) $(BIN)/vite build

preview: ## Serve the production build in dist/ on PREVIEW_PORT (default 4173)
	@test -f dist/index.html || { echo "dist/ has no build: run 'make build' first" >&2; exit 1; }
	$(MISE) $(BIN)/vite preview --port $(PREVIEW_PORT) --strictPort

clean: ## Remove build output and tool caches (keeps node_modules/ and shots/)
	rm -rf dist .vitest test-results playwright-report blob-report coverage \
		node_modules/.vite node_modules/.cache node_modules/.tmp

# Emberbound: project instructions

Standing rules for every session. The design, the order of work and the lessons from the prototype are in `docs/PROJECT_BRIEF.md`; read it before any work.

## What this is

A small 2.5D side-scrolling platformer for the browser. One developer, working through Claude Code with the BMad Method. He is an intermediate full-stack developer (Go, Java, React/TypeScript) and new to game development. Learning matters as much as shipping.

## Settled stack

| Job | Tool |
| --- | --- |
| Game and renderer | three.js on WebGL, TypeScript (strict), Vite |
| Tests | Vitest for the simulation, Playwright for screenshot checks |
| 3D meshes | Tripo, from reference images |
| Cleanup, rigging, animation, glTF export | Blender, driven through Blender MCP |
| Planning, code, review | Claude models, through Claude Code and the BMad workflows |
| Level editor | Tiled 1.12.x; levels compiled into the game's own format |
| Lint and format | ESLint with typescript-eslint; Prettier |
| Local tools | mise pins tool versions; a Makefile is the single entry point; any service runs in Docker |
| Binary assets | Git LFS |

Still open: the image model for reference art and the audio tools. Do not pick these silently.

## How to work

- The BMad Method drives this project. Planning and implementation go through its workflows: the `gds-*` (Game Dev Studio) and `bmad-*` skills in `.claude/skills/`. Run `bmad-help` to find the next step.
- Once a BMad artifact exists in `_bmad-output/`, it wins over `docs/PROJECT_BRIEF.md` on any conflict. Change a settled artifact through its own workflow or `gds-correct-course`, not by working around it.
- The brief's milestones (M0 to M6) become epics. Do not start an epic before the previous one's exit criteria are met and the developer has approved it.
- Ask before adding a dependency, changing the folder structure or changing a tuned gameplay number.
- Keep answers direct and technical. Skip basics. Mention trade-offs briefly.
- When something is a guess, say so. When something is untested, say so.
- Before using a three.js, Vite, Blender or Tripo API, check its current documentation. Do not rely on memory for version-specific details.
- Run project commands through `make` targets (`make help` lists them), not raw npm, npx or vite commands.

## Where things live

| Path | Holds |
| --- | --- |
| `docs/` | Project knowledge that BMad agents scan: `PROJECT_BRIEF.md`, later `STYLE_GUIDE.md` and `ASSETS.md` |
| `_bmad-output/planning-artifacts/` | Game brief, GDD, architecture, epics and stories |
| `_bmad-output/implementation-artifacts/` | Sprint status and story files |
| `_bmad/` | BMad install, managed by its installer. Overrides go in `_bmad/custom/` |
| `prototype/sprout-demo.html` | The Sprout prototype the tuning numbers came from. Reference only, not part of the build |
| `src/` | Game code; layers and boundaries are in the architecture document |
| `levels/` | Tiled level sources |
| `public/assets/` | Shipped runtime assets |
| `art-src/` | Source art, in Git LFS; never loaded by the game |
| `scripts/` | Node TypeScript tools run by the Makefile |

## Code rules

- TypeScript, strict mode. No `any` without a comment explaining why.
- The simulation (physics, collision, enemies, rules) is pure code with no three.js imports. It must run in Node for tests.
- Rendering reads simulation state and never writes it.
- Fixed 60 Hz simulation step; rendering interpolates. Clamp frame time to a non-negative value.
- Collision uses the tile grid. Art never defines collision.
- Gameplay numbers live in one config module. No magic numbers in logic.
- Every simulation rule gets a unit test. Run the tests before saying a change works.

## Visual work

- Nothing visual is built before the style reference exists (milestone 0).
- The renderer owns the style. Generated images choose the direction once; after that the look comes from the shared shaders, the palette module and the per-level lighting rig. Every asset uses them, and is judged on the look-dev page, not against a newly generated image.
- After any visual change, run the critic loop from the brief: screenshot fixed spots, compare with the reference and style guide, list the top three problems, fix, repeat. Stop after three rounds and report.
- Look at an image before placing it or describing it. Never claim to have checked a render you did not see.

## Hard limits

- Do not copy names, characters, level layouts, art or music from Toki or any other game.
- Do not use anything Dungeons & Dragons invented: settings, named characters, signature monsters, spell or feature names, rules text.
- Check the licence and commercial-use terms of every asset tool and asset before use, Tripo included. Record them in `docs/ASSETS.md`.
- Record which assets are AI-generated in `docs/ASSETS.md`; store submission forms may ask.
- Never commit secrets or API keys.

## Useful links

- Claude Code documentation: <https://docs.claude.com/en/docs/claude-code/overview>
- BMad Method documentation: <https://docs.bmad-method.org/>
- BMad Game Dev Studio documentation: <https://game-dev-studio-docs.bmad-method.org/>

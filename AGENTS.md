# Antigravity Plugins Hub Guidelines

Declarative repository for managing, authoring, and cataloging Antigravity agent plugin bundles.

## Architecture

- `plugins/` — Active, isolated plugin packages (e.g., `plugins/agents-md-improver/`).
- `templates/default-bundle/` — Canonical blueprint for scaffolding new plugins.
- `docs/` — Curated specifications and runtime research notes.

## Commands & Workflows

| Action | Command |
| :--- | :--- |
| **Scaffold new plugin** | `cp -r templates/default-bundle plugins/<plugin-id>` |
| **Test symlink (Global)** | `ln -sfn $(pwd)/plugins/<id> ~/.gemini/config/plugins/<id>` |
| **Test symlink (Workspace)** | `mkdir -p .agents/plugins && ln -sfn $(pwd)/plugins/<id> .agents/plugins/<id>` |
| **CLI install** | `agy plugin install ./plugins/<id>` |
| **List active plugins** | `agy plugin list` |

## Plugin Authoring Invariants

1. **Manifest (`plugin.json`)**: Parsed as JSONC. Always include `$schema`. Valid fields: `name`, `displayName`, `description`, `version`, `logo`, `suggestedPrompts` (max 3), `disabled`. `author` and `homepage` are ignored.
2. **Subagents (`agents/*.md`)**: Require valid YAML frontmatter (`name`, `description`, `tools`, `subagent`, `mainAgent`, `commandExecutionPolicy`). Misspelled tool names in `tools` cause agent dispatch hangs.
3. **Behavioral Rules**: Two distinct file types with opposite frontmatter rules.
   - `AGENTS.md` / `GEMINI.md`: **never** YAML frontmatter. Whole file is plain Markdown, always active for its directory scope.
   - `rules/*.md`: frontmatter is **mandatory** and must declare a valid `trigger` (`always_on`, `model_decision`, `glob`, or `manual`). A rule file that omits frontmatter, or uses an unrecognized value (camelCase like `alwaysOn`), is **silently discarded** with no error.
   - Never name a rule file `rules/AGENTS.md` — that conflates the two types. Use `rules/<rule-name>.md`.
4. **MCP Tool Servers (`mcp_config.json`)**: Always prefix server names with `<plugin-id>_` to prevent collisions in the global flattened tool registry.
5. **Human README**: Any `README.md` inside a plugin directory is ignored by the agent during prompt assembly; put agent rules in `rules/<rule-name>.md`.

## Gotchas

- **Identifier Mismatch (`dir` vs `name`)**: All runtime lifecycle operations (`enable`, `disable`, `uninstall`, `customization://<dir>`) key on the directory name (`dir`), not the manifest `name`.
- **Live State vs Restart**: Enabling or disabling a plugin applies live without restart; only introducing brand new plugin directories requires an IDE/session restart.
- **CLI Install Target**: `agy plugin install <path>` stages into the **shared global config folder** (`~/.gemini/config/plugins/`), not a CLI-only location. Official docs claim `~/.gemini/antigravity-cli/plugins/`; **observed behaviour contradicts this** — treat the docs as wrong here.
- **Rules Silently Discarded**: A `rules/*.md` file with no frontmatter, or an invalid `trigger` value, is dropped **with no warning**. No error appears — the rule simply never activates.

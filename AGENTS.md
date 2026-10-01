# Antigravity Plugins Hub Guidelines

Declarative repository for managing, authoring, and cataloging Antigravity agent plugin bundles.

## Architecture

- `catalog.json` — Global plugin registry and version index.
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
3. **Behavioral Rules (`rules/AGENTS.md`)**: Must be raw Markdown. **Do NOT add YAML frontmatter** to `rules/AGENTS.md`.
4. **MCP Tool Servers (`mcp_config.json`)**: Always prefix server names with `<plugin-id>_` to prevent collisions in the global flattened tool registry.
5. **Human README**: Any `README.md` inside a plugin directory is ignored by the agent during prompt assembly; put agent rules in `rules/AGENTS.md`.

## Gotchas

- **Identifier Mismatch (`dir` vs `name`)**: All runtime lifecycle operations (`enable`, `disable`, `uninstall`, `customization://<dir>`) key on the directory name (`dir`), not the manifest `name`.
- **Live State vs Restart**: Enabling or disabling a plugin applies live without restart; only introducing brand new plugin directories requires an IDE/session restart.
- **Catalog Sync**: Whenever a new plugin is added to `plugins/`, remember to register it in `catalog.json`.

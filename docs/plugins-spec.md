# Antigravity Plugins Specification

This specification documents the plugin bundle architecture, directory layout, manifest schema, and IDE integration for Google Antigravity.

---

## 1. Bundle Directory Layout

An Antigravity plugin is an isolated directory containing declarative agent configuration assets.

```text
<plugin-id>/
├── plugin.json                    # Required manifest (parsed as JSONC)
├── README.md                      # Human-readable documentation (ignored by agent)
├── mcp_config.json                # Optional declarative MCP server definitions
├── hooks.json                     # Optional tool execution event hooks
├── assets/
│   └── logo.svg                   # Optional square icon (>=128x128)
├── skills/<skill-name>/SKILL.md   # Agent skills (instructions with YAML frontmatter)
├── agents/<agent-name>.md         # Custom subagents (YAML frontmatter + persona prompt)
├── rules/<rule-name>.md           # Behavioral rules (YAML frontmatter required)
└── sidecars/<sidecar>/sidecar.json# Native background daemon processes
```

---

## 2. Manifest Schema (`plugin.json`)

The manifest is located at the root of the plugin directory and is parsed as **JSONC** (allowing comments and trailing commas).

```jsonc
{
  "$schema": "https://antigravity.google/schemas/v1/plugin.json",
  "name": "example-plugin",
  "displayName": "Example Plugin",
  "description": "Comprehensive description of capabilities for marketplace matching.",
  "version": "1.0.0",
  "logo": "assets/logo.svg",
  "suggestedPrompts": [
    "Run security scan",
    "Inspect bundle configuration",
    "Review active dependencies"
  ],
  "disabled": false
}
```

### Manifest Fields

* **`$schema`** (`string`): Points to `https://antigravity.google/schemas/v1/plugin.json`.
* **`name`** (`string`, optional): Lowercase kebab-case identifier (`^[a-zA-Z0-9-_]+$`). Defaults to directory name if omitted. If two plugins share a name, the first discovered wins and the other is dropped **silently**.
* **`displayName`** (`string`, optional): Human-readable title displayed in the IDE and command palette.
* **`description`** (`string`, recommended): 1-2 sentence description indexed by search.
* **`version`** (`string`, optional): SemVer string.
* **`logo`** (`string`, optional): Relative path to a square image (`>=128x128`, `.svg`, `.png`, `.jpg`, `.webp`). URLs and absolute paths are rejected silently.
* **`suggestedPrompts`** (`string[]`, optional): Up to 3 prompt chips displayed in UI cards. Empty strings are skipped; items beyond 3 are ignored.
* **`disabled`** (`boolean`, optional): When `true`, ships the plugin in an inactive state.
* **Ignored Fields:** `author` and `homepage` are silently discarded by the loader.

---

## 3. Runtime Lifecycle & Discovery

* **Install Identifier (`dir`):** All runtime mutations (`JetboxWriteState`, `DeletePlugin`, enabling/disabling, deep-linking) are keyed on the **install directory name (`dir`)**, not `name`.
* **Live Enable/Disable:** Toggling a plugin's state takes effect immediately without a restart.
* **Directory Discovery:** Creating or symlinking a brand new plugin directory requires an application or session restart.
* **Uninstall Persistence:** Uninstalling does not clear the enablement entry in `config.json`. If a disabled plugin is deleted and reinstalled into the same directory, it will remain disabled unless re-enabled prior to deletion.
* **IDE Deep-Linking:** Navigate directly to a plugin settings card using:
  ```markdown
  [Manage Plugin](customization://<dir>)
  ```

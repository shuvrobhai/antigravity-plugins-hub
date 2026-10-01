# Antigravity Plugins Hub

A centralized management and authoring repository for declarative Google Antigravity agent plugin bundles.

This hub houses agent configuration assets—including custom subagents, reusable skills, behavioral guidelines, declarative Model Context Protocol (MCP) server definitions, lifecycle hooks, and background sidecars. It requires zero build, compile, or lint pipelines. Curated raw Markdown mirrors of official upstream documentation and runtime verification reports are maintained under `docs/` to provide a local Single Source of Truth (SSOT).

---

## Repository Structure

```text
antigravity-hub/
├── README.md                    # Project overview and authoring guide
├── catalog.json                 # Global plugin registry and version index
│
├── docs/                        # Curated raw Markdown official documentation & research mirrors
│   ├── research-notes.md        # Comprehensive web & runtime engine verification report
│   ├── plugins-spec.md          # Official plugin layout & plugin.json schema
│   ├── subagents-spec.md        # Custom subagents, YAML frontmatter, and lifecycles
│   ├── builtin-plugin-skill.md  # Antigravity CLI builtin reference & symlink guidelines
│   └── marketplace-guide.md     # Discovery, installation, and cross-surface sync
│
├── templates/
│   └── default-bundle/          # Canonical blueprint for scaffolding new plugins
│       ├── plugin.json          # Validated plugin manifest (parsed as JSONC)
│       ├── README.md            # Human documentation (never loaded into agent context)
│       ├── mcp_config.json      # Declarative MCP server configs
│       ├── hooks.json           # Pre/post tool execution hooks
│       ├── assets/
│       │   └── logo.svg         # Square icon asset (>=128x128, transparent)
│       ├── skills/
│       │   └── example-skill/
│       │       └── SKILL.md     # Agent skill definitions and directives
│       ├── agents/
│       │   └── reviewer.md      # Subagent definition with valid YAML frontmatter
│       └── rules/
│           └── AGENTS.md        # Behavioral constraints (plain Markdown, no frontmatter)
│
└── plugins/                     # Active, isolated plugin packages
    └── <plugin-id>/
```

---

## Core Specifications

### 1. Plugin Manifest (`plugin.json`)

Every plugin package requires a `plugin.json` at its root. 

* **JSONC Parser:** Manifests are parsed as **JSONC** (JSON with Comments). Single-line comments (`//`), block comments (`/* */`), and trailing commas are fully supported.
* **Strict Validation:** Antigravity validates manifests against schema URI `https://antigravity.google/schemas/v1/plugin.json`. Unknown top-level fields (such as `author` or `homepage`) are silently discarded by the loader.
* **Global Collision Rule:** Plugin `name` values share a single global namespace. If two plugins claim the same `name`, the first discovered wins and the other is dropped **silently**.

```jsonc
{
  "$schema": "https://antigravity.google/schemas/v1/plugin.json",
  "name": "code-auditor",
  "displayName": "Code Auditor Agent",
  "description": "Static analysis and security audit bundle.",
  "version": "1.0.0",
  "logo": "assets/logo.svg",
  // Up to 3 starter prompts recommended for card layouts
  "suggestedPrompts": [
    "Run security scan on current diff",
    "Inspect dependency vulnerabilities",
    "Audit architecture layering"
  ]
}
```

#### Manifest Field Reference

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | *(Optional)* Lowercase kebab-case identifier (`^[a-zA-Z0-9-_]+$`). Defaults to install directory name if omitted. |
| `displayName` | `string` | *(Optional)* Human-readable presentation title shown in UI headers and slash command menus. |
| `description` | `string` | *(Recommended)* 1-2 sentence description matching Marketplace search queries. |
| `version` | `string` | *(Optional)* Semantic version string (e.g. `1.0.0`). |
| `logo` | `string` | *(Optional)* Relative path to square asset (`>=128x128`, `.svg`, `.png`, `.jpg`, `.webp`) with transparent background. URLs or absolute paths are silently rejected. |
| `suggestedPrompts`| `string[]` | *(Optional)* Up to 3 starter prompt chips. Empty strings are skipped; items beyond 3 are ignored. |
| `disabled` | `boolean` | *(Optional)* When `true`, ships the plugin in an inactive state. |

---

### 2. Custom Subagents (`agents/*.md`)

Subagents run concurrently in the background and require valid YAML frontmatter.

```markdown
---
name: code-auditor
description: Specialized subagent for security audits, static analysis, and code quality reviews.
tools:
  - view_file
  - grep_search
  - run_command
subagent: true
mainAgent: false
model: pro
commandExecutionPolicy: sandbox
skills:
  - skills/security-checklist
---

# System Prompt
You are an expert security auditor and code reviewer. Inspect source code for vulnerabilities and anti-patterns.
```

#### Frontmatter Reference

| Field | Type | Default | Notes |
| :--- | :--- | :--- | :--- |
| `name` | `string` | *(Required)* | Unique subagent identifier. |
| `description` | `string` | *(Required)* | Read by the planner to determine task delegation. |
| `tools` | `string[]` | `[]` | Allowed runtime tool names (e.g., `view_file`, `replace_file_content`, `grep_search`, `run_command`). |
| `subagent` | `boolean` | `true` | Enables invocation via `invoke_subagent`. |
| `mainAgent` | `boolean` | `true` | Allows selection as primary chat agent in GUI/CLI. |
| `model` | `string` | `inherit` | Options: `inherit`, `flash`, `pro`. |
| `commandExecutionPolicy` | `string` | `sandbox` | Options: `off`, `auto`, `eager`, `sandbox`. |
| `skills` / `plugins` | `string[]` | `[]` | Paths to dependent skills or bundled plugins. |

> **Critical Gotchas:**
> 1. Misspelling tool names in the `tools` array causes the background subagent process to hang. Ensure exact runtime tool names are used.
> 2. Antigravity supports **Execution Symmetry**: an agent can have both `mainAgent: true` and `subagent: true`.

---

### 3. Behavioral Rules (`rules/AGENTS.md`)

* Behavioral constraints and coding style guidelines must be placed in `rules/AGENTS.md`.
* **No YAML Frontmatter:** Rules files must be written in raw Markdown. Adding YAML frontmatter headers to `AGENTS.md` breaks parsing.
* **Persistent Scope:** Rules inside an enabled plugin are automatically treated as `always_on`.

---

### 4. Model Context Protocol (`mcp_config.json`)

To connect plugins to external Model Context Protocol servers, declare them inside `mcp_config.json` at the plugin root.

```json
{
  "mcpServers": {
    "code-auditor_git_helper": {
      "command": "node",
      "args": ["servers/git_helper.js"],
      "env": {}
    }
  }
}
```

* **Global Namespace Collisions:** MCP server names are flattened across the user's configuration, workspace, and all active plugins. Always prefix server identifiers with your plugin ID (e.g., `"code-auditor_git_helper"`).
* **Lifecycle Coupling:** Moving an MCP server into a plugin couples its availability directly to the plugin's enabled status.

---

### 5. Lifecycle Hooks (`hooks.json`) & Sidecars (`sidecars/`)

* **Hooks (`hooks.json`):** Allows declarative event intercepts before and after tool calls (e.g., pre-tool validation or audit logging).
* **Sidecars (`sidecars/<name>/sidecar.json`):** Long-running background daemon processes bundled directly with the plugin.
* **Plugin README (`README.md`):** Any `README.md` placed inside a plugin folder is strictly user-facing. The agent **never reads** or indexes plugin READMEs into prompt context.

---

## Lifecycle, Runtime Mechanics & Identifiers

### The Install Identifier (`dir` vs. `name`)
* **Core Rule:** All runtime engine mutations (enabling, disabling, uninstalling, deep-links) are keyed on the **install directory name (`dir`)**, **never** on the manifest `name`.
* **Marketplace Hashes:** Plugins installed from the official Marketplace are placed in folders named after a signed 64-bit hash (e.g. `-1870732469773246571`). Using `name` where `dir` is expected causes silent failures or invalid paths.

### Reload & Restart Dynamics
* **Live Toggles:** Enabling or disabling a plugin takes effect **live without an IDE or session restart**.
* **Directory Discovery:** Introducing a brand new plugin directory on disk (or creating a new symlink) requires an application or session restart to be discovered.
* **Uninstall Gotcha:** Uninstalling leaves the enablement record behind in `config.json`. If a disabled plugin is deleted and later reinstalled under the same directory name, it remains disabled unless explicitly re-enabled first.

### In-App Deep-Linking
* To create a clickable link in agent output that navigates directly to a plugin's settings card in the Antigravity IDE, use the protocol:
  ```markdown
  [Open Plugin Settings](customization://<dir>)
  ```
  *(Note: `plugin://` and `plugins://` are unsupported and render as dead text).*

---

## Authoring & Development Workflow

### Step 1: Scaffold a New Bundle
Copy the canonical blueprint template into `plugins/<plugin-id>`:

```bash
cp -r templates/default-bundle plugins/my-plugin
```

### Step 2: Configure Manifest and Components
1. Update `plugins/my-plugin/plugin.json` with a unique identifier.
2. Configure agent personas in `agents/*.md` and skills in `skills/<skill-name>/SKILL.md`.
3. Add behavioral instructions in `rules/AGENTS.md`.
4. (Optional) Define tool integrations in `mcp_config.json`, hooks in `hooks.json`, or a square logo in `assets/logo.svg`.

### Step 3: Local Activation and Testing
Link the local bundle directly into your Antigravity configuration directory:

```bash
# Workspace level
mkdir -p .agents/plugins
ln -sfn $(pwd)/plugins/my-plugin .agents/plugins/my-plugin

# Or global level
ln -sfn $(pwd)/plugins/my-plugin ~/.gemini/config/plugins/my-plugin
```

Alternatively, install using the CLI or slash command:

```bash
agy plugin install ./plugins/my-plugin
```

> **Note:** A newly created or symlinked plugin directory requires an application or session restart for initial discovery. Subsequent enable/disable toggles apply live immediately.

### Step 4: Register in `catalog.json`
Add an entry for the plugin to the central catalog:

```json
{
  "id": "my-plugin",
  "name": "my-plugin",
  "version": "1.0.0",
  "path": "plugins/my-plugin",
  "skills": ["example-skill"],
  "agents": ["reviewer"]
}
```

---

## Documentation & Research Mirrors (`docs/`)

Offline reference specifications and research logs are preserved under `docs/`:

* [`docs/research-notes.md`](docs/research-notes.md) — Comprehensive web & runtime engine verification report.
* [`docs/plugins-spec.md`](docs/plugins-spec.md) — Directory layout, manifest fields, lifecycle hooks, and IDE integration.
* [`docs/subagents-spec.md`](docs/subagents-spec.md) — Subagent concurrency model, workspace isolation, YAML schema, and permission bubbling.
* [`docs/builtin-plugin-skill.md`](docs/builtin-plugin-skill.md) — Builtin plugin skill specifications, symlink workflows, and language server RPCs.
* [`docs/marketplace-guide.md`](docs/marketplace-guide.md) — Package discovery, cross-surface synchronization, and distribution paths.
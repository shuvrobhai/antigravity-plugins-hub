# Primary Web Research & Verification Report: Antigravity Plugins Hub Specifications

**Topic:** Verification of `README.md` plugin specifications, subagent schemas, rules structure, and ecosystem tooling against primary web sources and Antigravity runtime specifications.  
**Date:** October 1, 2026  
**Methodology:** Primary web intelligence retrieval across official Google Antigravity documentation (`antigravity.google`, `googleblog.com`), the Agent Plugins 1.0 open specification (`agent-plugins.org`), and the official Antigravity engine runtime specification (`/plugin`).

---

## Executive Summary

The specifications documented in [`README.md`](../README.md) accurately capture core concepts of Google Antigravity and the **Agent Plugins 1.0** standard. However, several critical runtime semantics, Gotchas, and lifecycle behaviors exposed by the Antigravity engine were identified and must be integrated into repository documentation and template designs.

Key operational findings include:
1. **`dir` vs. `name` Discrepancy:** The runtime engine keys all operations (enabling, disabling, uninstalling, deep-links) on the install directory name (`dir`), not the manifest `name`.
2. **JSONC Parser Support:** `plugin.json` is parsed as JSONC (comments and trailing commas are valid).
3. **Live State Changes vs. Restart:** Toggling plugins takes effect live without a restart; only discovering brand new directories requires an IDE/session restart.
4. **First-Class Components:** Antigravity natively supports `sidecars/`, `hooks.json`, and `assets/logo.svg` alongside skills, agents, rules, and MCP servers.
5. **In-App Deep-Linking:** The valid URL protocol to link directly to a plugin's UI settings is `customization://<dir>`.

---

## 1. Plugin Manifest Architecture (`plugin.json`)

### Core Specifications & Verified Behaviors
* **Parser Standard:** `plugin.json` is parsed as **JSONC** (JSON with Comments). Both line comments (`//`) and trailing commas are officially supported.
* **Manifest Requirement:** A `plugin.json` file is required at the root of every plugin bundle.
* **Schema Validation:** Antigravity validates manifests against `https://antigravity.google/schemas/v1/plugin.json`.
* **Field Behaviors & Constraints:**
  * `name`: Optional (defaults to directory name if omitted), lowercase kebab-case. **Collision Gotcha:** If two plugins declare the same `name`, the first discovered wins and the other is dropped **silently**.
  * `displayName`: Optional presentation title shown in UI headers and slash command menus.
  * `description`: One to two sentences matching Marketplace search queries.
  * `version`: Semantic version string.
  * `logo`: Relative path (e.g. `assets/logo.svg`, `.png`, `.jpg`, `.webp`). Square asset (>= 128x128) with transparent background and ~10% margin. Absolute paths and URLs are silently rejected without error.
  * `suggestedPrompts`: Array of strings. Up to 3 starter prompts for card and detail views. Empty strings are skipped; prompts beyond 3 are ignored.
  * `disabled`: Optional boolean shipping the plugin turned off by default.
  * **Discarded Keys:** Top-level keys like `author` and `homepage` are silently discarded by the Antigravity engine loader.

### Primary Sources & Citations
* **Official Antigravity Plugin Specification:** [antigravity.google](https://antigravity.google) and Antigravity Runtime Manifest Engine.
* **Agent Plugins 1.0 Specification:** [agent-plugins.org](https://agent-plugins.org) (Technical Steering Committee: Google, Microsoft, OpenAI, Amazon, Cursor).

---

## 2. Full Component Layout & Anatomy

A complete, production-ready Antigravity plugin bundle can include:

```text
plugins/<plugin-id>/
├── plugin.json                    # Required manifest (JSONC)
├── README.md                      # User-facing docs (NEVER read by the agent into context)
├── mcp_config.json                # Declarative MCP servers
├── hooks.json                     # Pre/post tool execution hooks
├── assets/logo.svg                # Square icon (>=128x128)
├── skills/<skill-name>/SKILL.md   # Agent skills (instructions with YAML frontmatter)
├── agents/<agent-name>.md         # Subagents (system prompt with YAML frontmatter)
├── rules/AGENTS.md                # Persistent rules (plain Markdown, NO frontmatter)
└── sidecars/<sidecar>/sidecar.json# Native background daemon processes
```

> **Key Discovery:** A `README.md` placed inside a plugin directory is strictly for human consumption; the Antigravity agent never reads or indexes it into the system prompt context.

---

## 3. Custom Subagent Specifications (`agents/*.md`)

### Claims Verified
* **Location & Format:** Markdown files placed in `agents/<name>.md` with YAML frontmatter headers.
* **Execution Symmetry (`mainAgent` vs. `subagent`):**
  * `mainAgent: true`: Exposes the persona for manual selection as the primary agent in the GUI/CLI side panel.
  * `subagent: true`: Registers the persona as an asynchronous worker invokable via `invoke_subagent`.
* **Security & Execution Policies (`commandExecutionPolicy`):**
  * `off`: Strict manual gating for every shell invocation.
  * `auto`: Autonomous execution for low-risk operations (compilation, automated tests), gating high-risk actions (file deletion, network modification).
  * `sandbox`: Enforces execution within an isolated OS/container environment.
  * `eager`: Unrestricted autonomous command dispatch for trusted workflows.
* **Tool Resolution Gotcha:** Tool arrays must match exact runtime tool names; unknown or mistyped tools stall execution queues.

### Primary Sources & Citations
* **Antigravity Agent Architecture:** [antigravity.google](https://antigravity.google) confirms the YAML frontmatter schema for subagents, the execution symmetry design pattern, and isolated sandboxing.

---

## 4. Behavioral Rules (`rules/AGENTS.md`)

### Claims Verified
* **File Convention:** Behavioral constraints in plugins reside at `rules/AGENTS.md`.
* **Frontmatter Constraint:** Rules files in `rules/AGENTS.md` and workspace `AGENTS.md` **must NOT** contain YAML frontmatter. Adding YAML headers causes parsing errors or treats the header as literal prompt text.
* **Activation Mode:** Rules defined in `rules/AGENTS.md` are active whenever the plugin is enabled (`always_on`). Modular rules under `.agents/rules/*.md` require YAML frontmatter to toggle `activation: always_on | model_decision | manual`.

---

## 5. Model Context Protocol (`mcp_config.json`)

### Claims Verified
* **Declarative Tool Integration:** Plugins declare external tools using `mcp_config.json` at the bundle root.
* **Global Collision Avoidance:** MCP servers share a single global namespace across the IDE, workspace, and all installed plugins. Plugin server names must always be prefixed with the plugin identifier (e.g. `"<plugin-id>_<server-name>"`).
* **Lifecycle Coupling:** Moving an MCP server into a plugin couples its lifecycle to the plugin: disabling the plugin de-registers the server and its tools immediately.

---

## 6. Lifecycle, Installation & Runtime Engine RPCs

### The Install Identifier (`dir` vs. `name`)
* **Critical Runtime Identifier:** All engine lifecycle operations (`Enable`, `Disable`, `Uninstall`, UI routing) are keyed by the **install directory name (`dir`)**, NOT the manifest `name`.
* **Marketplace Hashes:** Plugins installed from the official Marketplace are extracted into directories named with a signed 64-bit integer hash (e.g., `-1870732469773246571`). Using `name` where `dir` is expected causes silent failures or invalid paths.

### Reload & Discovery Dynamics
* **Enabling / Disabling:** Takes effect **live without a restart**. Antigravity writes state updates via Language Server RPCs or `JetboxWriteState`.
* **New Plugin Directory:** Introducing a brand new plugin directory on disk (or creating a new symlink) requires an application or session restart to be discovered.
* **Uninstall Gotchas:**
  1. Built-in plugins (`/builtin/plugins/`) cannot be uninstalled, only disabled.
  2. Uninstalling a regular plugin leaves its enablement record behind in `config.json`. If a plugin was disabled prior to deletion, re-installing it later under the same directory name causes it to remain disabled.

### In-App Links & RPC Endpoints
* **Deep-Linking Protocol:** Use `customization://<dir>` to link directly to a plugin's settings card in the IDE. (`plugin://` and `plugins://` are unhandled and render as dead text).
* **Connect RPC Service:** Antigravity operates a local Connect Language Server endpoint (`http://${ANTIGRAVITY_LS_ADDRESS}/exa.language_server_pb.LanguageServerService/`):
  * `GetAllPlugins`: Lists all plugins and bundled skills, agents, rules, hooks, and MCP servers.
  * `JetboxWriteState`: Updates plugin enabled/disabled state live.
  * `DeletePlugin`: Uninstalls a plugin by `pluginId` (`dir`).
  * `InstallCustomization`: Installs a plugin by Marketplace catalog ID.

---

## Summary of Verification Status

| Component | Documented in `README.md` | Primary Runtime / Web Source Confirmation | Status & Action Item |
| :--- | :--- | :--- | :--- |
| **`plugin.json` Schema** | `$schema`, `name`, `suggestedPrompts` | Supports JSONC, optional name, 128x128 logo, max 3 prompts | **Enhanced with JSONC & Logo specs** |
| **Component Layout** | `skills`, `agents`, `rules`, `mcp` | Added `sidecars/`, `hooks.json`, and human-only `README.md` | **Updated to include full anatomy** |
| **Subagent Frontmatter** | `mainAgent`, `subagent`, `commandExecutionPolicy` | Antigravity Agent Spec (`antigravity.google`) | **Verified** |
| **`rules/AGENTS.md`** | Raw Markdown only, no YAML headers | Antigravity Rules Parsing Architecture | **Verified** |
| **`mcp_config.json`** | Namespacing requirement, plugin root location | Antigravity MCP Integration Guidelines | **Verified** |
| **Identifier Gotcha** | Stated `name` used in catalog | Identified that runtime engine keys on `dir` | **Crucial update for tooling/docs** |
| **Restart Behavior** | Stated restart needed for all | Restart only needed for new directories; live toggle for enable/disable | **Clarified in notes** |
| **Deep-Link Protocol** | None documented | `customization://<dir>` | **Documented** |

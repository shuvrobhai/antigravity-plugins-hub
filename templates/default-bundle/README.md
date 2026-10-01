# Example Plugin

A canonical starter plugin bundle for Google Antigravity.

> **Note on Plugin READMEs:** This document is strictly for human developers reading the repository. The Antigravity agent **never reads** or loads plugin `README.md` files into context. Behavioral instructions must be placed in `rules/AGENTS.md` or `skills/*/SKILL.md`.

## Contents
* `plugin.json` — Manifest metadata (parsed as JSONC).
* `skills/` — On-demand reusable skills.
* `agents/` — Custom background subagent personas.
* `rules/AGENTS.md` — Always-on behavioral rules (raw Markdown without YAML frontmatter).
* `mcp_config.json` — Namespaced MCP tool server declarations.
* `hooks.json` — Event hooks for tool execution.
* `assets/logo.svg` — 128x128 square plugin icon.

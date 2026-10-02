# Example Plugin

A canonical starter plugin bundle for Google Antigravity.

> **Note on Plugin READMEs:** This document is strictly for human developers reading the repository. The Antigravity agent **never reads** or loads plugin `README.md` files into context. Behavioral instructions must be placed in `rules/<rule-name>.md` or `skills/*/SKILL.md`.

## Contents
* `plugin.json` — Manifest metadata (parsed as JSONC).
* `skills/` — On-demand reusable skills.
* `agents/` — Custom background subagent personas.
* `rules/example-rule.md` — Behavioral rules. **YAML frontmatter with a valid `trigger` is mandatory.**

> **Why the rule frontmatter matters:** every `.md` file inside `rules/` must declare a `trigger` — one of `always_on`, `model_decision`, `glob`, or `manual`. A rule file that omits frontmatter, or uses an unrecognized value (such as camelCase `alwaysOn`), is **silently discarded** with no error. `globs` is required when `trigger: glob`; `description` is required when `trigger: model_decision`. Do **not** name a rule file `AGENTS.md` — that type takes no frontmatter and is always active for its directory scope.
* `mcp_config.json` — Namespaced MCP tool server declarations.
* `hooks.json` — Event hooks for tool execution.
* `assets/logo.svg` — 128x128 square plugin icon.

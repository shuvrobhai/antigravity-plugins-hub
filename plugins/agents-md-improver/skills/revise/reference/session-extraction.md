# Session Learning Extraction Guidelines

Specifies how the `revise` skill gathers evidence from a work session for capture into `AGENTS.md`.

> **Shared rules live in one place.** For what to add, what to avoid, the diff proposal format, and the pre-flight validation checklist, see [`update-guidelines.md`](../../audit/reference/update-guidelines.md) — the single canonical copy. Do not restate that content here.

---

## Core Principle

> **Only add information that will genuinely help future Antigravity sessions. The context window is precious — every line must earn its place.**

---

## Multi-Signal Evidence Collection

Collect evidence across three distinct layers during the session:

1. **Execution & Error Signals**
   - Filter `transcript.jsonl` for steps with `step.status == "ERROR"`.
   - Identify commands that failed due to missing flags, wrong package managers, or sandbox errors.
2. **User Directives & Corrections**
   - Look for pivot phrases: *"Actually..."*, *"Don't use X, use Y"*, *"Prefer <pattern>"*.
3. **Workspace Modifications**
   - Git repos: inspect `git status` and `git diff` for new dependencies or config keys.
   - Non-Git projects: inspect `write_file` and `replace_file_content` events in the session.

---

## Routing

Learnings are routed by scope (see Step 2 of [`SKILL.md`](../SKILL.md)):

- Root `AGENTS.md` for project-wide context.
- Nearest child `AGENTS.md` for package-specific learnings in a monorepo.
- `.agents/rules/*.md` if the learning is a durable **constraint** rather than project context — use the rule template in [`templates.md`](../../audit/reference/templates.md).

# Antigravity Subagents Specification

This specification documents the subagent execution model, YAML frontmatter configuration, permission policies, and tooling for Google Antigravity.

---

## 1. Concurrency & Execution Model

Subagents are independent agent sessions spawned by the main planner or directly selected by the user.

* **Execution Symmetry:** The engine allows an agent to be defined symmetrically:
  * `mainAgent: true`: Appears in the agent switcher as a primary conversation persona.
  * `subagent: true`: Allows asynchronous background invocation via `invoke_subagent`.
* **Workspace Isolation:** Subagents run with isolated context windows, preventing tool bloat and context contamination in the primary conversation thread.

---

## 2. YAML Frontmatter Schema (`agents/*.md`)

Every subagent file is a Markdown document with YAML frontmatter at the top:

```markdown
---
name: code-auditor
description: Specialized subagent for static analysis, security scans, and code hygiene reviews.
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

You are an expert security auditor. Analyze repository files, identify vulnerabilities, and provide structured, actionable remediation steps.
```

### Configuration Fields

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | *(Required)* | Unique identifier matching `^[a-zA-Z0-9-_]+$`. |
| `description` | `string` | *(Required)* | Summary utilized by the planner to delegate tasks. |
| `tools` | `string[]` | `[]` | Allowed runtime tool names (`view_file`, `replace_file_content`, `grep_search`, `run_command`). |
| `subagent` | `boolean` | `true` | When `true`, enables invocation via `invoke_subagent`. |
| `mainAgent` | `boolean` | `true` | When `true`, enables selection as primary chat persona. |
| `model` | `string` | `inherit` | Model selection: `inherit`, `flash`, or `pro`. |
| `commandExecutionPolicy` | `string` | `sandbox` | Execution policy: `off`, `auto`, `eager`, or `sandbox`. |
| `skills` / `plugins` | `string[]` | `[]` | Relative paths to bundled skills or prerequisite plugins. |

---

## 3. Command Execution Policies

The `commandExecutionPolicy` governs how `run_command` calls are executed:

* **`off`**: Autonomous command execution is prohibited; every command requires manual confirmation.
* **`auto`**: Low-risk operations (such as test suites, linters, and compilers) run autonomously. High-risk operations (file deletion, network modification) are gated behind approval prompts.
* **`sandbox`**: Commands run in an isolated environment, protecting the host system from uncontained side effects. Recommended for automated review and test-runner subagents.
* **`eager`**: Permits immediate autonomous execution for trusted workflows.

> **Tool Resolution Gotcha:** Misspelled tool names in the `tools` list cause subagent background processes to stall. Always ensure exact runtime names.

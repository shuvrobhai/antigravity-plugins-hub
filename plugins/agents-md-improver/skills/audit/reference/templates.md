# `AGENTS.md` Templates

## Key Principles

- **Concise**: Dense, human-readable content; one line per concept when possible.
- **Actionable**: Commands should be copy-paste ready with exact flags.
- **Project-specific**: Document patterns unique to this project, not generic advice models already know.
- **Current**: All info must reflect the actual live codebase state.

---

## Recommended Sections

Use only the sections relevant to the project. Not all sections are needed.

### Commands
Document the essential commands for working with the project.

```markdown
## Commands

| Command | Description |
| :--- | :--- |
| `<install command>` | Install dependencies |
| `<dev command>` | Start development server |
| `<build command>` | Production build |
| `<test command>` | Run tests |
| `<lint command>` | Lint/format code |
```

### Architecture
Describe the project structure so Antigravity agents understand where things live.

```markdown
## Architecture

- `<directory>/` — <purpose of directory>
- `<directory>/` — <purpose of directory>
- `<subsystem>/` — <functional role>
```

### Key Files
List important entrypoints and config files that agents should know about.

```markdown
## Key Files

- `<path>` — <purpose>
- `<path>` — <purpose>
```

### Code Style
Document project-specific coding conventions and design patterns.

```markdown
## Code Style

- <convention>
- <convention>
- <preference over alternative>
```

### Environment
Document required environment variables and local setup dependencies.

```markdown
## Environment

Required:
- `<VAR_NAME>` — <purpose>
- `<VAR_NAME>` — <purpose>

Setup:
- <setup step>
```

### Testing
Document testing approach, flags, and patterns.

```markdown
## Testing

- `<test command>` — <what it tests>
- <testing convention or pattern>
```

### Gotchas
Document non-obvious patterns, quirks, and warnings.

```markdown
## Gotchas

- <non-obvious thing that causes issues>
- <ordering dependency or prerequisite>
- <common mistake to avoid>
```

### Workflow
Document development workflow patterns.

```markdown
## Workflow

- <when to do X>
- <preferred approach for Y>
```

---

## Template: Project Root (Minimal)

Ideal for single libraries, utility packages, and microservices (< 50 lines).

```markdown
# <Project Name>

<One-line description>

## Commands

| Command | Description |
| :--- | :--- |
| `<command>` | <description> |

## Architecture

- `src/` — <description>
- `tests/` — <description>

## Gotchas

- <critical trap or warning>
```

---

## Template: Project Root (Comprehensive)

Ideal for full-stack applications and multi-faceted repositories.

```markdown
# <Project Name>

<One-line description>

## Commands

| Command | Description |
| :--- | :--- |
| `<install command>` | Install dependencies |
| `<dev command>` | Start local dev server |
| `<test command>` | Run test suite |
| `<build command>` | Build artifact |

## Architecture

- `src/` — Primary application code
- `config/` — Configuration schemas
- `scripts/` — Automation scripts

## Key Files

- `<entrypoint>` — Application root entrypoint
- `<config_file>` — Primary configuration file

## Code Style

- <naming convention>
- <architectural rule>

## Environment

Required:
- `<VAR_NAME>` — <purpose>

## Testing

- `<test command>` — <test execution pattern>

## Gotchas

- <gotcha / failure mode to avoid>
- <prerequisite or ordering dependency>
```

---

## Template: Package/Module

For packages within a monorepo or distinct modules.

```markdown
# <Package Name>

<Purpose of this package>

## Usage

```typescript
// <import / usage example>
```

## Key Exports

- `<export>` — <purpose>

## Dependencies

- `<dependency>` — <why needed>

## Notes

- <important note or package boundary constraint>
```

---

## Template: Monorepo Root

For multi-package repositories (Nx, Turborepo, pnpm workspaces, Cargo workspaces).

```markdown
# <Monorepo Name>

<Description>

## Packages

| Package | Description | Path |
| :--- | :--- | :--- |
| `<name>` | <purpose> | `<path>` |

## Commands

| Command | Description |
| :--- | :--- |
| `<command>` | <description> |

## Cross-Package Patterns

- <shared pattern>
- <generation / sync pattern>
- Never cross-import internal files directly across package boundaries.
```
---

## Template: Modular Rule (`.agents/rules/<rule-name>.md`)

Offload target for domain-specific content extracted from `AGENTS.md`. Rules load **independently** of `AGENTS.md` and may activate conditionally.

> **Frontmatter is mandatory.** A file inside `rules/` that omits frontmatter, or uses an unrecognized `trigger` (such as camelCase `alwaysOn`), is **silently discarded** — no error is raised.

```markdown
---
trigger: always_on
description: <one line describing when this rule applies>
---

# <Rule Name>

- <constraint or invariant>
- <constraint or invariant>
```

### Choosing a `trigger`

| `trigger` | Use when | Also required |
| :--- | :--- | :--- |
| `always_on` | Constraint applies to every task | — |
| `model_decision` | Agent decides relevance from `description` | `description` |
| `glob` | Only relevant to certain file types | `globs` |
| `manual` | Only when explicitly invoked | — |

### Conditional rule example

```markdown
---
trigger: glob
globs: "*.ts, *.tsx"
description: TypeScript conventions for this project
---

# TypeScript Conventions

- No `any`; use `unknown` and narrow before use.
- Prefer `type` for unions, `interface` for extensible objects.
```

### Offloading from `AGENTS.md`

When `AGENTS.md` grows past ~150–200 lines, move cohesive, domain-specific sections here and leave a one-line summary behind.

- One rule per file, named for its topic (`typescript.md`, `testing.md`, `deploy.md`).
- Keep project-wide invariants in `AGENTS.md`; put domain detail in rules.
- Nested paths (`.agents/rules/frontend/react.md`) are **ignored** unless registered in `.agents/rules.json`.
- 24 KB per-file ceiling; 20,000-token aggregate budget across global and `always_on` rules.
- Do **not** name a rule file `AGENTS.md` — that type takes no frontmatter and is always active.

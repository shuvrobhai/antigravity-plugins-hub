# Quality Criteria for `AGENTS.md`

This document defines the evaluation rubric and scoring system used by `agents-md-improver` to audit an existing `AGENTS.md` file against the codebase.

---

## Quick Assessment Checklist

| Criterion | Weight | Points | Check |
| :--- | :--- | :--- | :--- |
| **Commands/workflows documented** | High | 20 | Are build/test/deploy commands present? |
| **Architecture clarity** | High | 20 | Can Antigravity Agent understand the codebase structure? |
| **Non-obvious patterns** | Medium | 10 | Are gotchas and quirks documented? |
| **Conciseness** | Medium | 10 | No verbose explanations or obvious info? |
| **Currency** | High | 20 | Does it reflect current codebase state? |
| **Actionability** | High | 20 | Are instructions executable, not vague? |

---

## Quality Scores

- **A (90–100)**: Comprehensive, current, actionable
- **B (70–89)**: Good coverage, minor gaps
- **C (50–69)**: Basic info, missing key sections
- **D (30–49)**: Sparse or outdated
- **F (0–29)**: Missing or severely outdated

---

## Detailed Rubrics & Scoring Guidance

### 1. Commands & Workflows Documented (High — 20 Points)
* **20 pts**: Standard development lifecycle commands are fully documented (install, test single file, test suite, lint, build, run).
* **10–15 pts**: Main commands present, but test flags or prerequisite environment steps are missing.
* **0–5 pts**: Minimal or no commands provided, forcing agents into manual discovery loops.

### 2. Architecture Clarity (High — 20 Points)
* **20 pts**: Core directory structure, key entrypoints, and subsystem boundaries are clearly explained so an agent understands where code lives.
* **10–15 pts**: Generic directory list without functional roles or missing key submodules.
* **0–5 pts**: Missing architecture section or inaccurate mental model.

### 3. Non-Obvious Patterns & Gotchas (Medium — 10 Points)
* **10 pts**: Documents workspace quirks, sandbox boundaries, tricky environment configurations, and known traps that cause agent failures.
* **5 pts**: Brief mention of warnings, but lacks actionable resolution steps.
* **0 pts**: No gotchas or anti-patterns documented.

### 4. Conciseness & Signal-to-Noise (Medium — 10 Points)
* **10 pts**: Zero boilerplate fluff, no generic programming lectures, imperative style, strictly under ~150-200 lines (< 24 KB hard limit). Does not duplicate instructions already declared in `.agents/rules/`. Oversized domain walkthroughs are recommended for offloading to `.agents/rules/`.
* **5 pts**: Some verbose explanations, slight token bloat, or redundant overlap with 1-2 existing rules in `.agents/rules/`.
* **0 pts**: Overwhelming wall of text (>300 lines or exceeding the 24 KB truncation ceiling), heavily duplicating existing `.agents/rules/`, or inlining giant procedural tutorials.

### 5. Currency & Freshness (High — 20 Points)
* **20 pts**: 100% aligned with active codebase. All paths, package scripts, dependencies, and toolchains exist and match live manifests.
* **10–15 pts**: Minor drift (e.g. 1-2 renamed scripts or slightly outdated dependency references).
* **0–5 pts**: Significant architectural drift, ghost directories, or deprecated toolchain instructions.

### 6. Actionability (High — 20 Points)
* **20 pts**: Instructions are deterministic, copy-pasteable, and concrete. No vague advice like "write tests well".
* **10–15 pts**: Mostly actionable, but some commands require guessing arguments or flags.
* **0–5 pts**: Highly abstract or subjective guidelines without concrete syntax.

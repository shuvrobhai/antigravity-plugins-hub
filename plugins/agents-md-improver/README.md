# `agents-md-improver` Plugin

Tools to maintain and improve the `AGENTS.md` file, audit quality, capture session learning, and keep project memory current.

---

## Overview

The `agents-md-improver` plugin provides two complementary tools for different stages of the development lifecycle:

| Tool | Type | Purpose | Primary Triggers & "Use When" |
| :--- | :--- | :--- | :--- |
| **`audit`** | Skill (`skills/audit/`) | Audits `AGENTS.md` files against the current codebase state to prevent drift and ensure accuracy. | `/agents-md-improver:audit`, "Audit my agents.md file", "Check if my agents.md is up to date", triggered by codebase changes, used for periodic maintenance. |
| **`revise`** | Skill (`skills/revise/`) | Captures learning and tacit context from the current session into `AGENTS.md`. | `/agents-md-improver:revise`, "Revise agents.md", "Capture session learnings", triggered at the end of a session, use when "session revealed missing context". |

---

## Directory Structure

```text
plugins/agents-md-improver/
├── plugin.json                              # Official plugin manifest
├── README.md                                # Plugin documentation
├── docs/                                    # Design specifications and documentation
│   └── revise-spec.md                       # Specification for session reflection
└── skills/
    ├── audit/                               # Codebase alignment & audit skill
    │   ├── SKILL.md                         # Main operational instructions
    │   └── reference/
    │       ├── quality-criteria.md          # 5-pillar rubric for AGENTS.md quality
    │       ├── templates.md                 # Canonical modular AGENTS.md templates
    │       └── update-guidelines.md         # Drift remediation & surgical editing rules
    └── revise/                              # Session reflection & learning capture skill
        ├── SKILL.md                         # Main operational instructions
        └── reference/
            └── session-extraction.md        # Taxonomy for extracting tacit knowledge
```

---

## Tools Detailed Breakdown

### 1. `audit` (Codebase Alignment & Audit)

- **Role**: Periodic maintenance and alignment checker (`/agents-md-improver:audit`).
- **When to Use**:
  - After significant refactors, new dependencies, or directory restructurings.
  - When setting up or refreshing an existing repository's `AGENTS.md`.
  - When verifying that build, test, and run commands documented in `AGENTS.md` actually work.
- **Workflow**:
  1. Inspects repository structure, entrypoints, and package manifests (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, etc.).
  2. Compares active reality against claims in `AGENTS.md`.
  3. Evaluates quality against the 6-criterion Quick Assessment Checklist (`reference/quality-criteria.md`).
  4. Generates a structured audit report with a 100-point Scorecard (Grades A–F) and proposed surgical diffs using `reference/update-guidelines.md`.

#### Quality Score Scale
- **A (90–100)**: Comprehensive, current, actionable
- **B (70–89)**: Good coverage, minor gaps
- **C (50–69)**: Basic info, missing key sections
- **D (30–49)**: Sparse or outdated
- **F (0–29)**: Missing or severely outdated

### 2. `revise` (Session Learning Capture)

- **Role**: Post-session reflection and tacit knowledge capture (`/agents-md-improver:revise`).
- **When to Use**:
  - At the conclusion of a work session where edge cases, gotchas, or setup quirks were encountered.
  - Whenever a session revealed missing context that caused the agent to stumble or make incorrect assumptions.
  - When the user explicitly corrects a pattern or specifies project-specific preferences.
- **Workflow**:
  1. Reviews the current session trajectory, tool errors, and user corrections.
  2. Categorizes learnings using `reference/session-extraction.md` (Gotchas, Domain Quirks, Command Corrections, Behavioral Preferences).
  3. Formulates concise, durable additions that prevent future agents from repeating past mistakes.
  4. Presents proposed updates for user approval before appending/updating `AGENTS.md`.

---

## Installation & Discovery

### Local Workspace Installation
To use this plugin directly in an Antigravity workspace, clone or link this folder into your workspace plugins directory:
```bash
mkdir -p .agents/plugins
ln -s /path/to/plugins/agents-md-improver .agents/plugins/agents-md-improver
```

Antigravity automatically discovers the plugin manifest (`plugin.json`) and registers the bundled skills under `/<skill-name>`.

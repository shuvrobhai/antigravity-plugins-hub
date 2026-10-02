# revise

Review this session for learnings about working with Antigravity in this codebase. Update `AGENTS.md` with context that would help future Antigravity sessions be more effective.

## Step 1: Reflect

What context was missing that would have helped Antigravity work more effectively?
- **Bash commands** that were used or discovered (including flags and prerequisite services)
- **Code style & architectural patterns** followed
- **Testing approaches** that worked
- **Environment/configuration quirks**
- **Warnings or gotchas** encountered (sandbox errors, permissions, traps)

### Signal Sources
- **Transcript & execution log**: Tool errors (`status == "ERROR"`), command retries.
- **User corrections**: Pivot prompts (*"don't use"*, *"actually"*, *"use X instead"*).
- **Workspace modifications**: `git diff` if available, or session `write_file`/`replace_file_content` events if in a non-git project.

## Step 2: Find AGENTS.md Files & Existing Rules

Decide where each addition belongs using hierarchical routing, and scan `.agents/rules/*.md` to avoid duplicating existing rules:
- **Root `AGENTS.md`**: Default for project-wide conventions, root toolchains, and top-level gotchas.
- **Sub-package `AGENTS.md`**: Route package-specific learnings to the closest child file in monorepos (e.g. `packages/api/AGENTS.md`).
- **Scan `.agents/rules/`**: Ensure the new learning doesn't duplicate a rule already defined in the rules folder.
- **Scaffold Fallback**: If no `AGENTS.md` exists anywhere in the repository, offer to create a minimal root `AGENTS.md` first.

## Step 3: Draft Additions

**Keep it concise** — one line per concept. `AGENTS.md` is part of the prompt, so brevity matters.

- **Format**: `<command or pattern>` - `<brief description>`
- **Placement**:
  - Commands & flags → `## Key Commands`
  - Traps & failure modes → `## Known Gotchas & Constraints`
  - Code style & conventions → `## Conventions & Style`
- **Deduplication**: If an existing bullet touches the same topic, sharpen that line rather than appending duplicates.
- **Avoid**:
  - Verbose narrative explanations
  - Obvious general programming information
  - One-off fixes unlikely to recur
  - Secrets and credentials

## Step 4: Show Proposed Changes

Present itemized candidates for clear review:

```markdown
### Candidate 1: ./AGENTS.md

**Target Section:** `## Key Commands`
**Why:** [one-line reason citing session evidence]

\`\`\`diff
+ [the addition - keep it brief]
\`\`\`
```

## Step 5: Apply with Approval

Ask the user to approve the proposed changes:
- Support approving all items or cherry-picking specific numbers (e.g. *"Apply #1, skip #2"*).
- Only edit files and lines explicitly approved by the user.
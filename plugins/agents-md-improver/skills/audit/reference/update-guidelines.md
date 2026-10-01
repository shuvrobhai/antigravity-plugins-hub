# `AGENTS.md` Update Guidelines

This reference defines the core principles, addition criteria, diff formatting, and pre-flight validation checklist for proposing and applying changes to an `AGENTS.md` file.

---

## Core Principle

> **Only add information that will genuinely help future Antigravity sessions. The context window is precious — every line must earn its place.**

---

## What TO Add

### 1. Rules, Commands, Workflows & Dependencies Discovered
```markdown
## Build

- `npm run build:prod` — Full production build with optimization
- `npm run build:dev` — Fast dev build (no minification)
```
*Why this helps: Saves future sessions from discovering build pipelines and flags again.*

### 2. Gotchas and Non-Obvious Patterns
```markdown
## Gotchas

- Tests must run sequentially (`--runInBand`) due to shared DB state.
- `yarn.lock` is authoritative; delete `node_modules` if dependency versions mismatch.
```
*Why this helps: Prevents repeating painful debugging sessions.*

### 3. Package Relationships
```markdown
## Dependencies

- The `auth` module depends on `crypto` being initialized first.
- Import order matters in `src/bootstrap.ts`.
```
*Why this helps: Documents architectural dependencies that are not immediately obvious from code.*

### 4. Testing Approaches That Worked
```markdown
## Testing

- For API endpoints: Use `supertest` with the test helper in `tests/setup.ts`.
- Mocking: Factory functions in `tests/factories/` (avoid inline mocks).
```
*Why this helps: Establishes proven patterns that avoid flakiness.*

### 5. Configuration Quirks
```markdown
## Config

- `NEXT_PUBLIC_*` vars must be set at build time, not runtime.
- Redis connection requires `?family=0` suffix for IPv6 support.
```
*Why this helps: Documents environment-specific knowledge that causes runtime crashes.*

---

## What NOT to Add

### 1. Obvious Code Info
- **Bad**: *The `UserService` class handles user operations.*
- **Why**: The class name and imports already tell us this. Omit obvious self-documenting facts.

### 2. Generic Best Practices
- **Bad**: *Always write tests for new features. Use meaningful variable names.*
- **Why**: Universal advice that models already know. Only document project-specific rules.

### 3. One-Off Fixes
- **Bad**: *We fixed a bug in commit abc123 where the login button didn't work.*
- **Why**: Won't recur; clutters the context window.

### 4. Verbose Explanations
- **Bad**:
  > The authentication system uses JWT tokens. JWT (JSON Web Tokens) are an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. In our implementation, we use the HS256 algorithm which...
- **Good**:
  > `Auth: JWT with HS256, tokens in Authorization: Bearer <token> header.`

### 5. Sensitive Credentials & Secrets
- **Bad**: *`REDIS_PASSWORD=prod_secret_123`*
- **Good**: *`REDIS_PASSWORD` must be set in `.env.local` before starting services.*

---

## Diff Format for Updates

For each suggested change:

### 1. Identify File & Section
```text
File: ./AGENTS.md
Section: Commands (new section after ## Architecture)
```

### 2. Show the Unified Diff
```diff
 ## Architecture
  ...

+## Commands
+
+| Command | Purpose |
+| :--- | :--- |
+| `npm run dev` | Dev server with HMR |
+| `npm run build` | Production build |
+| `npm test` | Run test suite |
```

### 3. Explain Why
> **Why this helps**: The build commands weren't documented, causing confusion about how to run the project. This saves future sessions from needing to inspect package.json.

*Note: If an instruction already touches this topic, sharpen the existing line via diff instead of appending duplicates.*

---

## Validation Checklist

Before finalizing an update, verify:

- [ ] **Project-Specific**: Each addition addresses a quirk, command, or rule unique to this project.
- [ ] **No Generic Advice**: Free of universal programming fluff or self-evident code descriptions.
- [ ] **Tested & Verified**: Commands and flags are verified against actual scripts/manifests.
- [ ] **Portable Paths**: File paths are accurate relative paths (no machine-specific absolute paths).
- [ ] **Genuinely Useful**: A new Antigravity session would stumble or fail without this line.
- [ ] **Maximum Density**: Phrased as concisely as possible (one line per concept).
- [ ] **Zero Secrets**: Contains no tokens, passwords, or private keys.

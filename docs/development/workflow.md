# Development Workflow

## 1. Define the Task

Create one GitHub issue containing:

- a concrete goal;
- observable acceptance criteria;
- explicit out-of-scope items;
- relevant implementation notes.

The issue is the task contract. Do not infer additional product scope.

## 2. Create a Branch

Start from current `main` and use one of:

```text
agent/<issue>-<slug>
feature/<issue>-<slug>
fix/<issue>-<slug>
```

Use `agent/` when a coding agent owns the implementation. A branch contains exactly one issue's work.

## 3. Implement Within Repository Boundaries

Read `AGENTS.md`, the issue, and relevant documentation before editing. Keep routing and composition in `src/app`; keep feature behavior inside the owning feature module. Preserve unrelated work.

## 4. Verify Locally

Run the required local completion gate and report its result accurately:

```bash
pnpm check
```

An environment limitation must be recorded; it is not equivalent to a passing check.

## 5. Commit

Use a scoped Conventional Commit, for example:

```text
docs: establish project foundation
feat: add persistent dark mode
fix: handle missing theme preference
ci: add pull request quality gates
```

Do not mix unrelated cleanup into the commit.

## 6. Open a Pull Request

Create exactly one pull request with:

```md
## Issue

Closes #<issue>

## Changes

- concise change summary

## Verification

- [x] checks that passed
- [ ] checks that could not pass, with the exact reason

## Risks

Known risks or `None known`.
```

Include screenshots for meaningful visual changes and document new configuration or migration steps.

## 7. Review and Merge

The agent does not merge its own pull request. Required CI and review gates must pass. Direct pushes and force pushes to `main` are forbidden.

## 8. Deploy

After later Phase 1 steps are implemented, merging to `main` triggers DEV deployment and a smoke test. PROD requires explicit human approval and cannot be approved by the coding agent.

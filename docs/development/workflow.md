# Development Workflow

## 1. Define the Task

Create one GitHub issue containing:

- a concrete goal;
- observable acceptance criteria;
- explicit out-of-scope items;
- relevant implementation notes.

The issue is the task contract. Do not infer additional product scope.

Use the structured feature or bug form. Blank issues are disabled for contributors, and security-sensitive details must not be posted publicly. See [`github-governance.md`](github-governance.md) for the complete repository policy.

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

GitHub Actions independently runs the same command in the stable `quality` job for pull requests targeting `main` and pushes to `main`. The parallel `security` job scans Git history for secrets and fails on high- or critical-severity dependency advisories. Local output helps the author iterate, but only the GitHub-hosted results satisfy the required repository status checks.

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

Keep every section of `.github/pull_request_template.md`. The template is the handoff record between implementation, review, and later CI enforcement.

## 7. Review and Merge

The agent does not merge its own pull request. Required CI and review gates must pass. The `protect-main` repository ruleset requires the pull-request path, successful `quality` and `security` status checks against current `main`, and resolved review threads; it also blocks force pushes and deletion.

## 8. Deploy

After a merge, successful `quality` and `security` verification of the resulting `main` commit triggers the DEV workflow. It deploys that exact commit to Cloudflare Workers Static Assets and runs the smoke test against the URL returned by Wrangler. See [`deployment.md`](deployment.md) for configuration and operations.

PROD requires explicit human approval and cannot be approved by the coding agent.

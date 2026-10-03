# Worker Pre-PR Verification

This runbook defines the verification a coding worker must perform before opening a pull request.

It was introduced after the first Phase 3 unattended coding run (Issue #56 / PR #57) exposed locally detectable formatting, browser-regression, and test-isolation failures.

## Required sequence

Start from the task branch with the intended changes present.

```bash
pnpm install --frozen-lockfile
pnpm format
pnpm check:pr
```

`pnpm check:pr` runs two gates in order:

1. `pnpm check` — formatting, ESLint, TypeScript, Vitest/Node tests, and production build.
2. The complete Playwright regression suite against a local Next.js server.

For a user-facing change, the browser suite is part of pre-PR verification, not an optional follow-up.

If Playwright browsers are not installed in the execution environment, install Chromium first:

```bash
pnpm exec playwright install chromium
```

On Linux runners that also lack browser system libraries, the environment may require:

```bash
pnpm exec playwright install --with-deps chromium
```

## Formatting authority

Formatting is verified only by the repository-installed Prettier version. Run it through pnpm so the version pinned by the repository is used:

```bash
pnpm format
pnpm format:check
```

Manually rewrapping lines or trying to reproduce expected Prettier output by inspection does not count as formatting verification. If Prettier cannot run in the current environment, record `pnpm format` / `pnpm format:check` as not executed and let the GitHub `quality` gate provide the authoritative result.

## Environment limitations

A worker must not report a check as passed when it could not run.

If the execution environment prevents one of the commands from running:

- record the exact command that could not run;
- record the concrete environment error;
- run every remaining executable check;
- state the limitation in the pull request verification section;
- wait for the corresponding GitHub CI gate before describing the change as verified.

Do not remove, skip, or weaken a test to work around an environment limitation.

## Test isolation

Testing Library cleanup is configured centrally in `src/test/setup.ts`. Feature tests should not add their own routine `afterEach(cleanup)` unless they have a specific additional cleanup requirement.

This prevents rendered DOM from leaking between Vitest cases and keeps isolation consistent across features.

## Security findings

Dependency-audit findings remain visible through the CI security job. General dependency remediation belongs in a separate reviewed security/dependency task unless the feature itself introduced the vulnerable dependency.

Secret-scan failures are not advisory implementation noise. They must be investigated immediately; never expose or commit credentials.

## Pull request readiness

Creating the pull request and declaring it ready for human review are separate concepts.

A worker may open a PR when a local environment limitation makes GitHub CI necessary, but the PR description must say exactly what was not run. The change is ready for human review only after the required `quality` and `browser` checks are green and any security warning has been surfaced for review.

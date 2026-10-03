<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Purpose

This repository is the Phase 1 learning project for agentic software delivery. A coding agent may implement scoped tasks, but independent checks and human-controlled production approval remain the trust boundaries.

The binding principle is:

> The agent creates changes. The pipeline verifies them.

Read the linked GitHub issue and this file before changing code. Implement only the issue scope and preserve unrelated user changes.

## Architecture

- The application is a modular monolith built with Next.js App Router and strict TypeScript.
- `src/app` owns routes, layouts, global styles, and page composition. Keep business logic out of it.
- `src/features/<feature>` owns feature-specific components, services, tests, and its public `index.ts` API.
- `src/components/ui` is reserved for generic UI primitives; `src/components/layout` is reserved for shared layout components.
- `src/lib` contains only genuinely shared technical helpers.
- Feature modules must not import another feature's internal files. Import from that feature's public `index.ts` instead.
- Do not add architectural layers, services, or infrastructure without a concrete use case.
- Apply SOLID principles where they improve a real change: give modules clear responsibilities and keep dependencies explicit, but introduce an interface or layer only when it solves a current problem. Prefer the smallest design that satisfies the acceptance criteria.

See `docs/architecture/phase-1.md` and `docs/architecture/decisions/ADR-001-modular-monolith.md`.

## Repository Structure

```text
src/app/                 Next.js routes and composition
src/features/            Feature-owned UI and logic
src/components/          Shared UI and layout components, when needed
src/lib/                 Shared technical helpers, when needed
docs/architecture/       Architecture and ADRs
docs/development/        Local setup and delivery workflow
tests/                   System, smoke, and later E2E tests
```

Create a directory only when it contains a real file with an immediate purpose. Do not add placeholder folders.

## Coding Rules

- Use TypeScript and keep strict mode enabled.
- Prefer small, explicit modules and readable names over premature abstractions.
- Keep feature-specific styles and components inside their feature.
- Use the `@/*` alias for imports across top-level source areas.
- Use Prettier as the formatting authority and run `pnpm format` after editing supported files. Manual attempts to imitate expected Prettier output are not a formatting check; the repository-installed Prettier version must actually run.
- Add a dependency only when the issue requires it and document why in the pull request.
- Consult the bundled Next.js documentation required by the generated rules above before changing framework-specific behavior.
- Match the installed framework and library versions, the lockfile, and established repository patterns. For a new or uncertain API, verify the relevant version's official documentation; do not assume a remembered API is current.
- Keep the static-export deployment constraint (`output: "export"`) in mind. Check whether a proposed Next.js feature requires a runtime server before using it; record a consequential architecture change as an ADR.
- Prefer native browser features and platform APIs when they solve the task clearly. Add a maintained, compatible dependency only for a concrete need; inspect its official documentation, release and maintenance status, license, and security implications. Record the choice and alternatives in the PR.
- Do not upgrade unrelated packages or GitHub Actions during feature work. Make required compatibility updates explicit and keep the lockfile in sync. Handle general version and security updates in separate reviewed PRs.
- Handle expected failures and boundary inputs explicitly. Validate untrusted data at its entry point; do not silence type errors with `any`, broad casts, or disabled lint rules without a narrow, documented reason.
- Use semantic HTML and native controls first. For changed interactions, check keyboard access, visible focus, accessible names, and relevant contrast; avoid unnecessary ARIA when a native element already provides the behavior.

## Testing Rules

- Put feature tests close to the feature under `src/features/<feature>/tests`.
- Put deployed-system and smoke tests under `tests/`.
- Test observable behavior rather than implementation details.
- Cover the changed behavior and meaningful failure or edge cases at the lowest useful level; add an integration or browser test when integration or browser behavior itself matters. Avoid tests that only restate the implementation.
- Every change to a user-facing workflow must add or update automated tests that exercise its observable behavior. Maintain browser regression coverage for the app's critical user journeys (currently page load, primary links, static assets, and persistent theme across reloads). When adding a route or critical interaction, extend that browser coverage in the same PR; do not rely solely on jsdom for navigation, asset loading, browser storage, or hydration.
- Dependency or GitHub Actions updates must pass the existing quality, security, and browser jobs. If an update affects an untested critical user journey, add its regression test before treating the update as verified. Inspect release notes and migration guidance for major updates, and keep major updates under human review.
- A failed or missing required browser job is a failed verification, even when other checks pass. The `main` ruleset must require `browser` alongside `quality`; the `security` job remains visible and must be reviewed, but dependency-audit findings are advisory unless repository policy is tightened again. Do not work around a failure by removing a test or bypassing the rule.
- Add a regression test for a bug fix when technically meaningful.
- Never weaken, skip, or delete a failing test merely to make a check pass.
- Vitest uses jsdom and the shared setup in `src/test/setup.ts`.
- The test command must fail when no tests are discovered.

## Commands

Use pnpm and the pinned Node.js version from `.nvmrc`.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:smoke:dev
DEV_URL=https://example.workers.dev pnpm test:e2e:preview
pnpm build
pnpm check
```

`pnpm check` is the base local completion gate. It runs formatting, linting, type checking, tests, and the production build in sequence. CI runs the same command in the stable `quality` job; do not duplicate or weaken these checks in workflow-only commands. For any user-facing workflow change, `pnpm check:pr` is the required pre-PR gate and additionally runs the full Playwright regression suite against a local Next.js server. The separate `security` job owns dependency auditing and secret scanning because those checks require registry or GitHub context.

`pnpm test:smoke:dev` targets a deployed application and requires `DEV_URL`; it is not part of the local `pnpm check` sequence.
`pnpm test:e2e:preview` runs Playwright against `DEV_URL`. `pnpm check:pr` sets `PLAYWRIGHT_LOCAL_SERVER=1` and `DEV_URL=http://127.0.0.1:3000` automatically for the local browser regression suite.

## Git Rules

- Start from an up-to-date `main` branch.
- Use exactly one short-lived branch per issue: `agent/<issue>-<slug>`, `feature/<issue>-<slug>`, or `fix/<issue>-<slug>`.
- Use Conventional Commits such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, or `ci:`.
- Keep commits scoped and do not mix unrelated cleanup into a task.
- Never push directly to `main`.

## Pre-PR Verification

Before opening a pull request, run `pnpm format` and then all locally executable verification required by the change.

- For user-facing workflow changes, run `pnpm check:pr`.
- For non-user-facing changes, run at least `pnpm check` plus any task-specific checks.
- Do not open a PR with a locally reproducible formatting, unit-test, browser-test, typecheck, lint, or build failure.
- If the execution environment prevents a required check from running, run every remaining executable check and record the exact command and environment error in the PR. Never describe an unrun check as passed. If `pnpm format` or `pnpm format:check` cannot run, explicitly record formatting as unverified instead of manually approximating Prettier output.
- A PR that depends on GitHub CI because of an environment limitation is not ready for human review until the required `quality` and `browser` gates are green.
- Follow `docs/development/worker-pre-pr-verification.md` for the exact sequence and fallback behavior.

## Pull Request Rules

- Create exactly one pull request for each issue.
- Include `Closes #<issue>` in the pull request body.
- Summarize changes, verification, known risks, and configuration or migration notes.
- Explain non-obvious tradeoffs, runtime or compatibility constraints, and why a new dependency or abstraction is needed. State when none apply.
- Include screenshots when a visible UI change benefits from them.
- Do not merge your own pull request or bypass required reviews and checks.

## Security Rules

- Never commit, print, or expose credentials, tokens, private keys, or sensitive user data.
- Commit only safe names and placeholders to `.env.example`; real local values belong in `.env.local`.
- Keep development and production secrets separate.
- Treat every `NEXT_PUBLIC_*` value as publicly visible browser data.
- Use least-privilege permissions for integrations and workflows.
- Review new dependencies for necessity and security impact.

## Forbidden Actions

- Do not push directly to `main` or force-push protected branches.
- Do not bypass CI, disable checks, or weaken TypeScript strict mode.
- Do not deploy directly to production or approve a production deployment.
- Do not implement functionality outside the issue, even if it seems useful.
- Do not introduce a database, queue, microservice, agent orchestrator, MCP server, or new architectural layer without an approved requirement.
- Do not overwrite or remove changes that belong to another task or the user.
- Do not hide failures or claim a check passed when it did not run successfully.

## Definition of Done

A task is complete only when:

- the issue and acceptance criteria are satisfied within scope;
- relevant tests are added or updated when the configured test tooling supports them;
- all currently available local checks pass, with environment limitations reported precisely;
- no secrets or sensitive data are committed;
- new dependencies, migrations, and risks are documented;
- the task branch and commits follow repository conventions;
- one pull request references the issue and records verification;
- required CI and review gates pass.

Production deployment is not part of a coding agent's Definition of Done.

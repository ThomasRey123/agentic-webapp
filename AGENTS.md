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
- Use Prettier as the formatting authority and run `pnpm format` after editing supported files.
- Add a dependency only when the issue requires it and document why in the pull request.
- Consult the bundled Next.js documentation required by the generated rules above before changing framework-specific behavior.

## Testing Rules

- Put feature tests close to the feature under `src/features/<feature>/tests`.
- Put deployed-system and smoke tests under `tests/`.
- Test observable behavior rather than implementation details.
- Add a regression test for a bug fix when technically meaningful.
- Never weaken, skip, or delete a failing test merely to make a check pass.
- Vitest uses jsdom and the shared setup in `src/test/setup.ts`.
- The temporary `--passWithNoTests` flag exists only until Phase 1 step 4 adds the first meaningful tests; do not use it to hide deleted tests afterward.

## Commands

Use pnpm and the pinned Node.js version from `.nvmrc`.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm check` becomes the required completion command when it is introduced in Phase 1 step 4. CI must call the same package scripts used locally.

## Git Rules

- Start from an up-to-date `main` branch.
- Use exactly one short-lived branch per issue: `agent/<issue>-<slug>`, `feature/<issue>-<slug>`, or `fix/<issue>-<slug>`.
- Use Conventional Commits such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, or `ci:`.
- Keep commits scoped and do not mix unrelated cleanup into a task.
- Never push directly to `main`.

## Pull Request Rules

- Create exactly one pull request for each issue.
- Include `Closes #<issue>` in the pull request body.
- Summarize changes, verification, known risks, and configuration or migration notes.
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

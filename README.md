# Agentic Web App

A small learning project for building and validating an agentic software-delivery workflow. Coding agents can implement scoped GitHub issues, while pull requests, automated quality gates, and human-controlled production approval provide independent control.

> The agent creates changes. The pipeline verifies them.

## Current Status

Phase 1 is in progress. The repository, modular structure, structured GitHub contribution workflow, automated tests, unified local quality gate, and independent CI are established. Verified `main` commits deploy automatically to the Cloudflare Workers Static Assets DEV target once its GitHub environment is configured.

## Technology

- Next.js 16 with App Router
- React 19
- TypeScript in strict mode
- pnpm
- GitHub Issues and pull requests
- GitHub Actions for independent CI verification
- Cloudflare Workers Static Assets for DEV hosting

## Prerequisites

- Git
- Node.js `24.19.0` as pinned in `.nvmrc`
- pnpm `11.19.0` as pinned in `package.json`

## Local Setup

```bash
git clone https://github.com/ThomasRey123/agentic-webapp.git
cd agentic-webapp
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

More detail is available in [`docs/development/local-setup.md`](docs/development/local-setup.md).

## Available Commands

| Command               | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `pnpm dev`            | Start the local development server              |
| `pnpm format`         | Format supported repository files with Prettier |
| `pnpm format:check`   | Check formatting without changing files         |
| `pnpm lint`           | Run ESLint                                      |
| `pnpm typecheck`      | Run strict TypeScript without emitting files    |
| `pnpm test`           | Run the Vitest suite once                       |
| `pnpm test:watch`     | Run Vitest in watch mode                        |
| `pnpm test:smoke:dev` | Smoke test the URL in `DEV_URL`                 |
| `pnpm build`          | Create a production build                       |
| `pnpm check`          | Run every required local quality gate           |
| `pnpm start`          | Serve a completed production build              |

Run `pnpm check` before completing a task. It executes formatting, linting, type checking, tests, and the production build in sequence.

GitHub Actions runs the same command in the required `quality` job for pull requests targeting `main` and for pushes to `main`. A separate required `security` job audits dependencies and scans Git history for secrets.

After CI succeeds for a `main` commit, `Deploy DEV` exports the application, deploys it to Cloudflare, and smoke tests the returned deployment URL. See [`docs/development/deployment.md`](docs/development/deployment.md) for the required GitHub environment and Cloudflare setup.

## Architecture

The application is a modular monolith:

```text
src/app
  -> composes routes from feature APIs
src/features/<feature>
  -> owns feature-specific components, logic, styles, and tests
src/components
  -> contains shared UI or layout components when needed
src/lib
  -> contains genuinely shared technical helpers when needed
```

Only directories with an immediate purpose are created. See [`docs/architecture/phase-1.md`](docs/architecture/phase-1.md) and [`ADR-001`](docs/architecture/decisions/ADR-001-modular-monolith.md).

## Development Workflow

1. Define the goal, acceptance criteria, and out-of-scope items in a GitHub issue.
2. Create one short-lived branch such as `agent/42-dark-mode`.
3. Implement only the agreed scope and run the available checks.
4. Commit using Conventional Commits.
5. Open one pull request containing `Closes #42`, verification, and risks.
6. Merge only after the required checks and review pass.

Read [`AGENTS.md`](AGENTS.md) before agent-assisted work and [`docs/development/workflow.md`](docs/development/workflow.md) for the complete process.

## Configuration and Secrets

`.env.example` contains only safe configuration names and examples. Put real local values in `.env.local`, which is ignored by Git. Never commit credentials or production configuration.

## Documentation

- [`docs/architecture/phase-1.md`](docs/architecture/phase-1.md): Phase 1 boundaries and component responsibilities
- [`docs/architecture/decisions/ADR-001-modular-monolith.md`](docs/architecture/decisions/ADR-001-modular-monolith.md): architecture decision record
- [`docs/architecture/decisions/ADR-002-cloudflare-workers-static-assets.md`](docs/architecture/decisions/ADR-002-cloudflare-workers-static-assets.md): DEV hosting decision
- [`docs/development/local-setup.md`](docs/development/local-setup.md): local installation and troubleshooting
- [`docs/development/workflow.md`](docs/development/workflow.md): issue-to-PR workflow
- [`docs/development/github-governance.md`](docs/development/github-governance.md): issue templates, pull-request contract, and branch protection
- [`docs/development/deployment.md`](docs/development/deployment.md): DEV deployment configuration and operation

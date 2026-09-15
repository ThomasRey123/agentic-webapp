# Agentic Web App

A small learning project for building and validating an agentic software-delivery workflow. Coding agents can implement scoped GitHub issues, while pull requests, automated quality gates, and human-controlled production approval provide independent control.

> The agent creates changes. The pipeline verifies them.

## Current Status

Phase 1 is in progress. The repository and minimal Next.js application are initialized, and the project structure and operating documentation are being established. Code-quality tooling, CI, and deployment follow in later Phase 1 steps.

## Technology

- Next.js 16 with App Router
- React 19
- TypeScript in strict mode
- pnpm
- GitHub Issues and pull requests
- GitHub Actions in a later Phase 1 step

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

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm lint` | Run ESLint |
| `pnpm exec tsc --noEmit` | Run the current TypeScript check |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve a completed production build |

Formatting, Vitest, and the unified `pnpm check` command are intentionally introduced in Phase 1 steps 3 and 4.

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
- [`docs/development/local-setup.md`](docs/development/local-setup.md): local installation and troubleshooting
- [`docs/development/workflow.md`](docs/development/workflow.md): issue-to-PR workflow

# Agentic Web App

A small learning project for building and validating an agentic software-delivery workflow. Coding agents can implement scoped GitHub issues, while pull requests, automated quality gates, and human-controlled production approval provide independent control.

> The agent creates changes. The pipeline verifies them.

## Current Status

The Phase 2 ChatGPT-to-DEV milestone is operational. A coding task can turn a request into a scoped branch, pull request, independent CI run, and isolated DEV preview. The owner tests the preview before merging; the verified `main` commit then deploys to stable DEV.

Every successfully verified `main` commit is deployed to Cloudflare Workers Static Assets and checked by a remote smoke test. The public environment is available at [agentic-webapp-dev.tr-config-place.workers.dev](https://agentic-webapp-dev.tr-config-place.workers.dev).

The persistent theme toggle completed this workflow through a PR preview, human verification, merge, and stable DEV deployment. The second small UI delivery (FAQ, issue #86 / PR #87) also passed local checks and independent CI; see the dated [delivery review](docs/development/delivery-review.md) for deployment evidence and observation limits. Production deployment remains deferred.

| Milestone                                    | Status   |
| -------------------------------------------- | -------- |
| Repository and modular application structure | Complete |
| Local quality gate                           | Complete |
| GitHub governance and protected `main`       | Complete |
| Independent CI and security checks           | Complete |
| Automatic DEV deployment and smoke test      | Complete |
| ChatGPT task to PR DEV preview               | Complete |
| Feature proof of concept: persistent theme   | Complete |
| Production deployment and approval           | Deferred |

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
- Node.js `24.21.0` as pinned in `.nvmrc`
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

GitHub Actions runs the same command in the required `quality` job for pull requests targeting `main` and for pushes to `main`. The required `browser` job covers existing journeys, including the FAQ, and `secret-scan` scans Git history for secrets. The separate `security` job reports advisory dependency findings; a green job can still contain findings tracked for remediation.

After CI succeeds for a `main` commit, `Deploy DEV` exports the application, deploys it to Cloudflare, and smoke tests the returned deployment URL. See [`docs/development/deployment.md`](docs/development/deployment.md) for the required GitHub environment and Cloudflare setup.

The current delivery checkpoint is documented in [`docs/development/delivery-review.md`](docs/development/delivery-review.md). [`PROJECT_STATE_V9.md`](PROJECT_STATE_V9.md) is a historical snapshot.

Follow-up work is tracked in [`docs/development/next-steps.md`](docs/development/next-steps.md). The next major initiative is [Spec Driven Development, epic #90](https://github.com/ThomasRey123/agentic-webapp/issues/90): its [researched roadmap](docs/development/spec-driven-development-roadmap.md) proposes incremental adoption and a small pilot. The roadmap does not yet activate new workflow rules or install a tool.

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

1. Describe the feature in ChatGPT Work/Codex. The worker creates one scoped GitHub issue as the task contract.
2. Create one short-lived branch such as `agent/42-dark-mode`.
3. Implement only the agreed scope; run `pnpm format` and `pnpm check:pr` for user-facing changes before opening the PR.
4. Commit using Conventional Commits.
5. Open one pull request containing `Closes #42`, verification, and risks.
6. Test the automatically deployed PR preview after successful CI.
7. Merge only after the required checks and review pass; stable DEV then deploys automatically.

Read [`AGENTS.md`](AGENTS.md) before agent-assisted work and [`docs/development/workflow.md`](docs/development/workflow.md) for the complete process.

## Configuration and Secrets

Dependabot checks npm (including the pnpm lockfile) and GitHub Actions every Monday. Minor and patch updates are grouped per ecosystem, while major updates remain individually reviewable. Do not automatically merge its PRs. In the repository's **Settings → Advanced Security**, check that **Dependabot alerts** and **Dependabot security updates** are enabled: the settings are separate from `.github/dependabot.yml` and cannot be enabled by this PR alone. Verify each Dependabot PR passes `quality`, `browser` and `secret-scan`, and review the advisory `security` results before merging it. If GitHub withholds preview deployment secrets from a Dependabot PR, review CI and the dependency change, then merge under the existing human approval rules; the merged commit deploys to stable DEV. Do not weaken the secret boundary to force a preview.

The `browser` CI job verifies page/link, FAQ and theme behavior locally. The trusted preview workflow runs its main-branch theme test against deployed PR previews and uploads Playwright traces when the test fails. Run it manually against an approved URL using `DEV_URL=https://... pnpm test:e2e:preview` after `pnpm exec playwright install chromium`.

`.env.example` contains only safe configuration names and examples. Put real local values in `.env.local`, which is ignored by Git. Never commit credentials or production configuration.

## Documentation

- [`docs/architecture/phase-1.md`](docs/architecture/phase-1.md): Phase 1 boundaries and component responsibilities
- [`docs/architecture/phase-2.md`](docs/architecture/phase-2.md): autonomous ChatGPT-to-DEV design and safety boundaries
- [`docs/development/chat-to-dev.md`](docs/development/chat-to-dev.md): starting a feature from ChatGPT and testing its PR preview
- [`docs/architecture/decisions/ADR-001-modular-monolith.md`](docs/architecture/decisions/ADR-001-modular-monolith.md): architecture decision record
- [`docs/architecture/decisions/ADR-002-cloudflare-workers-static-assets.md`](docs/architecture/decisions/ADR-002-cloudflare-workers-static-assets.md): DEV hosting decision
- [`docs/development/local-setup.md`](docs/development/local-setup.md): local installation and troubleshooting
- [`docs/development/workflow.md`](docs/development/workflow.md): issue-to-PR workflow
- [`docs/development/github-governance.md`](docs/development/github-governance.md): issue templates, pull-request contract, and branch protection
- [`docs/development/deployment.md`](docs/development/deployment.md): DEV deployment configuration and operation
- [`docs/development/delivery-review.md`](docs/development/delivery-review.md): current delivery evidence, permission inventory and review limits
- [`PROJECT_STATE_V9.md`](PROJECT_STATE_V9.md): historical project state and worker handoff

Node follows the latest supported LTS release through reviewed updates. See
[`Node update policy`](docs/development/node-updates.md) for manual updates and verification.

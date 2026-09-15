# Phase 1 Architecture

## Purpose

Phase 1 proves a complete, controlled agentic delivery path for one small web application:

```text
GitHub issue -> coding agent -> task branch -> pull request -> CI
             -> main -> DEV -> smoke test -> manual approval -> PROD
```

The coding agent is replaceable. GitHub, reproducible checks, and deployment controls form the stable system boundary.

## Application Boundary

The application is a modular monolith in one repository and one deployable unit.

```text
Browser
  -> Next.js route in src/app
  -> public feature API in src/features/<feature>/index.ts
  -> feature-owned components and logic
  -> optional infrastructure integration when a real feature requires it
```

### Responsibilities

| Area                    | Owns                                               | Must not own                     |
| ----------------------- | -------------------------------------------------- | -------------------------------- |
| `src/app`               | Routes, layouts, global styles, page composition   | Business logic                   |
| `src/features/*`        | Feature-specific UI, behavior, services, and tests | Generic cross-project primitives |
| `src/components/ui`     | Reusable UI primitives when needed                 | Feature knowledge                |
| `src/components/layout` | Shared application layout when needed              | Feature behavior                 |
| `src/lib`               | Shared technical helpers when needed               | A catch-all for unrelated logic  |
| `tests`                 | Deployed-system, smoke, and later E2E tests        | Feature unit tests               |

Feature internals are private. Other areas import a feature through its `index.ts` public API.

## Delivery Boundary

| Component      | Responsibility                          | Trust limitation                   |
| -------------- | --------------------------------------- | ---------------------------------- |
| Issue          | Goal, acceptance criteria, scope        | Does not approve technical quality |
| Coding agent   | Implementation, tests, local checks, PR | Cannot merge or approve PROD       |
| Pull request   | Review and audit point                  | Does not replace automated checks  |
| CI             | Reproducible quality and security gates | Does not invent requirements       |
| DEV            | Integrated `main` deployment            | Cannot authorize PROD              |
| Human approval | Explicit production decision            | Cannot bypass failed gates         |

## Environments

- **LOCAL:** manual development with `.env.local`.
- **DEV:** automatic deployment of a verified `main` commit as a static Next.js export on Cloudflare Workers Static Assets.
- **PROD:** the same verified commit after explicit human approval.

Cloudflare is isolated behind the deployment workflow and `wrangler.jsonc`. The application remains a provider-independent static export; see [`ADR-002`](decisions/ADR-002-cloudflare-workers-static-assets.md). Revisit that decision if an accepted feature requires server-side Next.js behavior.

## Deferred Capabilities

Phase 1 does not include a database, microservices, queues, Kubernetes, Terraform, a custom agent orchestrator, an MCP server, RAG, autonomous production approval, or a dedicated voice-input system.

## Evolution Rule

Add a new layer or external system only when an accepted requirement cannot be implemented clearly within the current boundaries. Record consequential decisions as ADRs under `docs/architecture/decisions`.

# ADR-001: Use a Modular Monolith

- **Status:** Accepted
- **Date:** 2026-09-15
- **Decision owners:** Project maintainers

## Context

The project must demonstrate agentic development, independent quality gates, and controlled deployment without making application architecture the primary source of complexity. It currently has one small web application, no database, and no requirement for independently deployed services.

Coding agents also benefit from clear ownership boundaries: a task should map to a small, predictable part of the repository without requiring a distributed-system model.

## Decision

Build Phase 1 as a modular monolith in one GitHub repository and one deployable Next.js application.

- Routes and page composition live in `src/app`.
- Each business capability lives under `src/features/<feature>`.
- A feature exposes cross-boundary imports through its `index.ts`.
- Shared components and technical helpers are introduced only after a real reuse case exists.
- No service boundary, persistence abstraction, or infrastructure layer is created speculatively.

## Consequences

### Positive

- The application is easy to run, inspect, test, and deploy.
- Feature ownership gives humans and agents a predictable search boundary.
- One repository keeps changes and delivery history traceable.
- CI and deployment can evolve without distributed-system overhead.

### Negative

- Module boundaries rely on repository conventions rather than network isolation.
- A careless shared layer could become a catch-all as the codebase grows.
- Independent feature deployment is not supported.

### Mitigations

- Keep `AGENTS.md` and architecture documentation binding and current.
- Import features through their public `index.ts` API.
- Add automated boundary enforcement only if convention alone becomes insufficient.
- Revisit this decision when concrete scaling, ownership, reliability, or deployment requirements justify it.

## Alternatives Considered

### Microservices

Rejected for Phase 1 because they add deployment, networking, observability, and data-consistency complexity without a current requirement.

### Multi-package Monorepo

Rejected for Phase 1 because there is only one deployable application and no reusable package boundary yet.

### Layer-heavy Clean Architecture

Rejected as a default because repositories, gateways, use cases, and entities would be placeholders until a real domain requires them.

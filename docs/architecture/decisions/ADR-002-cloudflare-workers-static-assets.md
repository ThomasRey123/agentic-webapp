# ADR-002: Use Cloudflare Workers Static Assets for Phase 1

## Status

Accepted

## Context

Phase 1 needs one free or low-cost DEV target that can receive a verified `main` commit automatically. The current application has no runtime API, database, request-dependent rendering, server actions, or authentication. Next.js can therefore build the entire deployable unit ahead of time.

Adding a server-side Next.js adapter now would introduce runtime and provider complexity without serving an accepted requirement. The deployment boundary must remain replaceable if later features need server-side behavior.

## Decision

- Next.js uses `output: "export"` and produces the deployable site in `out/`.
- Images are emitted without the Next.js runtime image optimizer.
- Cloudflare Workers Static Assets serves the exported files as the `agentic-webapp-dev` Worker.
- GitHub Actions deploys only after the `CI` workflow succeeds for `main`.
- The deployment job uses the GitHub `development` environment and deploys the exact commit SHA verified by CI.
- A smoke test requests the deployment URL returned by Wrangler and requires a successful HTML response.

## Consequences

- DEV does not require a continuously running Node.js server.
- Runtime-only Next.js features are unavailable while static export is enabled.
- Cloudflare credentials stay outside the repository in the GitHub `development` environment.
- The application can move to a Cloudflare Next.js adapter or another hosting provider later, but that change requires a new accepted requirement and ADR.

## Revisit When

Reassess this decision before introducing request-time rendering, cookies, server actions, runtime route handlers, authentication callbacks, or any other feature unsupported by Next.js static export.

# Local Setup

## Prerequisites

- Git
- Node.js `24.19.0`
- pnpm `11.19.0`

The versions are pinned in `.nvmrc` and the `packageManager` field in `package.json`.

## Install

```bash
git clone https://github.com/ThomasRey123/agentic-webapp.git
cd agentic-webapp
nvm use
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
```

If `nvm` is not installed, use another Node version manager but match `.nvmrc`.

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current Checks

```bash
pnpm check
```

The unified command runs these checks in order:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm check` is the required local completion gate. Run an individual command when diagnosing a failure, but do not treat that as a replacement for the full sequence.

## Environment Configuration

`.env.example` documents safe keys and example values. Copy it to `.env.local` for local overrides.

- Never put real secrets in `.env.example`.
- Never commit `.env.local`.
- Values prefixed with `NEXT_PUBLIC_` are visible in browser code.
- Development and production secrets must remain separate.

## Known Sandbox Limitation

In the current managed development sandbox, Next.js processes can fail while reading process resident memory with `ENOENT: uv_resident_set_memory`. This affects `next build` before application-code diagnostics and can also terminate `next dev` after startup. ESLint and TypeScript checks succeed, and the build error also occurs through the webpack path. Treat this as an environment-specific limitation, not a successful runtime or build check. The future GitHub Actions workflow must run the production build independently in a normal hosted runner.

# Deployment

## DEV Architecture

The Phase 1 DEV target is a Cloudflare Worker named `agentic-webapp-dev` that serves the static Next.js export from `out/`.

`.github/workflows/deploy-dev.yml` runs automatically after the `CI` workflow completes successfully for `main`.

The automatic path checks out `github.event.workflow_run.head_sha`. This keeps deployment tied to the exact commit independently verified by CI rather than whatever commit happens to be latest when the job starts.

DEV is live at [agentic-webapp-dev.tr-config-place.workers.dev](https://agentic-webapp-dev.tr-config-place.workers.dev). The first successful deployment and remote smoke test completed on September 15, 2026.

## One-Time Owner Setup

### 1. Prepare Cloudflare

Use a Cloudflare account with a configured `workers.dev` subdomain. Create a custom API token scoped to only the intended account with:

```text
Developer Platform -> Workers Scripts (Legacy) -> Edit
```

Cloudflare's API documentation calls the corresponding accepted permission `Workers Scripts Write`. The modern `Workers -> Editor` role alone does not authorize the Workers Static Assets upload-session endpoint used by this deployment. See the [Cloudflare assets upload API](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/assets/subresources/upload/methods/create/).

Do not use a global API key and do not put either value in the repository.

### 2. Configure GitHub

In the repository settings, create an environment named `development`. Add these environment secrets:

| Secret                  | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Scoped credential for Workers deployment     |
| `CLOUDFLARE_ACCOUNT_ID` | Target Cloudflare account for the DEV Worker |

The environment must not require a deployment approval: verified `main` commits deploy to DEV automatically. Production credentials must never be reused here.

Production deployment and the `production` GitHub environment are intentionally deferred. They must use separate credentials when implemented later.

## Deployment Flow

1. A pull request passes `quality` and `security` and is merged.
2. The `CI` workflow verifies the resulting `main` commit.
3. `Deploy DEV` checks out that verified commit.
4. Next.js creates a static export in `out/`.
5. Wrangler deploys `out/` using `wrangler.jsonc`.
6. Wrangler returns the deployment URL.
7. `pnpm test:smoke:dev` retries the URL and requires HTTP success plus an HTML document.

Any failed build, deployment, missing credential, empty deployment URL, non-success response, or non-HTML response fails the deployment job.

## Manual Retry

Open the failed `Deploy DEV` workflow run in GitHub Actions and choose **Re-run jobs**. Re-running the existing job retains the verified commit SHA and uses the same `development` environment, build, deployment, and smoke-test steps.

## Local Smoke Test

The smoke test accepts its target through `DEV_URL`:

```bash
DEV_URL=https://example.workers.dev pnpm test:smoke:dev
```

`localhost` may use HTTP for local verification. Any other target must use HTTPS.

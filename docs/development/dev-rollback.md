# DEV rollback and isolated rehearsal

## Isolated rehearsal

Run **Actions → Rehearse isolated DEV
rollback → Run workflow** from `main`. It uses the existing `development`
Cloudflare credentials and the frozen-installed Wrangler version.

The workflow creates a run-specific static-assets Worker, verifies its baseline,
deploys a different marker, verifies that candidate, rolls back to the recorded
baseline version and verifies restored content. It then deletes only its own
probe. It refuses to overwrite an existing Worker or target stable DEV/PROD.
The result and version IDs are recorded in the job summary.

This checks the Cloudflare version/asset restoration mechanism. It does not
prove that a specific historical app release works after restoration. The isolated rehearsal succeeded on 11 October 2026 in [run 38141174993](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38141174993): two asset versions were checked, baseline content was restored and the probe was deleted. This is not a live rollback of stable DEV.
The workflow cannot be dispatched from a feature branch; no Cloudflare secrets
are exposed to the coding environment. If cancellation or runner loss interrupts
cleanup, inspect and remove the named `agentic-webapp-rollback-<run>-<attempt>`
Worker manually after confirming its identity.

## Restore stable DEV when needed

1. Identify the successful DEV deployment and its Git commit. In Cloudflare,
   locate the corresponding Worker version for `agentic-webapp-dev`; record the
   current version as a recovery point before making changes.
2. Coordinate with the owner so a concurrent automatic DEV deployment cannot
   overwrite the restore. Use the authenticated Cloudflare dashboard or an
   authorized trusted-main workflow with the development credentials.
3. Select the verified earlier version in **Workers & Pages → agentic-webapp-dev
   → Deployments → Rollback**, or use `pnpm exec wrangler rollback <version-id>
--name agentic-webapp-dev --yes --message <reason>` from the repository.
4. Run `DEV_URL=https://agentic-webapp-dev.tr-config-place.workers.dev
pnpm test:smoke:dev`, then `DEV_URL=... pnpm test:e2e:preview` with Chromium
   installed. Confirm the expected restored feature behavior and version.
5. Record the reason, source/target version IDs, commit and test results in the
   incident issue. Prepare the code correction through a reviewed PR before
   resuming normal deployment.

Cloudflare rollback restores Worker code/assets, not external data or changed
bindings. The current app is a static export with no database; reassess this
procedure when architecture changes. PROD requires a separate approved process.

Reference: https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/

# Start a feature from ChatGPT

Open a ChatGPT Work/Codex coding task with access to `ThomasRey123/agentic-webapp`. State the desired visible behavior and any constraints. A coding task keeps working after you leave the page; you do not need to start a second agent or create a GitHub issue yourself.

## New behavior: two bounded tasks

First ask for a specification, for example:

> In `ThomasRey123/agentic-webapp`, specify <small useful feature> before coding it. Read AGENTS.md and the SDD working contract, create one spec issue/branch, and draft `docs/specs/<feature>/spec.md` from the template. Define requirement IDs, concrete scenarios, scope/non-goals, relevant constraints and planned verification. Resolve scope/acceptance questions, run applicable checks, and open a spec-only PR explicitly requesting my behavioral approval. No feature implementation and no self-merge.

Review the proposal's behavior and merge it as approval. Then use a separate task:

> Implement the approved specification at <spec path>, approved in <spec-only PR URL> at full merge SHA <SHA>. Verify that revision agrees with current main. Create a separate implementation issue/branch/PR, derive a short plan/tasks and map acceptance IDs to meaningful tests. Run `pnpm format` and `pnpm check:pr`, follow CI and the current-commit preview checks, and report actual results and blockers. Do not expand behavior without a revised spec approval; do not merge or deploy PROD.

No CLI is needed. A roadmap merge or agent-edited status is not spec approval.
For behavior-restoring fixes, routine updates or editorial/process maintenance,
use the [short route](spec-driven-development.md): unchanged behavior, affected
spec or legacy evidence, verification and exclusions in the issue/PR.

The worker should remain on this task until the preview passes. A submitted message in an ordinary chat does not by itself set up a recurring watcher or webhook. If the coding task ends before an external CI/deployment finishes, schedule a follow-up in the same chat to check that PR and notify you; otherwise the user would have to return and restart the wait manually.

## One-time setup and verification

1. Merge the Phase 2 infrastructure PR through the existing ruleset. This activates `.github/workflows/deploy-preview.yml` on `main`.
2. Confirm that the GitHub `development` environment has the existing Cloudflare token and account ID and permits unattended DEV deployments. The account token must allow creating a second Worker. Keep PROD credentials separate.
3. Submit a small spec request, review and merge its spec-only PR, then request implementation against that approved revision. The worker creates the separate scoped issues and PRs; you supply the feature goal and approvals.
4. Watch the PR's `CI` run. The required `quality`, `browser` and `secret-scan` jobs must pass; inspect advisory `security` warnings separately. `Deploy PR preview` should then deploy an isolated Worker and complete its smoke test. Open the current-commit URL in the PR deployment section and test the feature yourself.
5. When satisfied, review and merge the PR using the protected `main` path. The existing `Deploy DEV` workflow then publishes it to the stable DEV URL. Production remains manual.

If you need the **stable** DEV URL to change before review, that would require an autonomous merge and change the current review boundary. The first milestone uses a PR-specific DEV preview so you can test first and retain control over `main`.

## Operational limits

- A Worker needs GitHub write permission to create a branch and PR. A connection that can only read the repository cannot finish this flow.
- The first preview can run only after the infrastructure PR is merged to `main`.
- Same-repository PRs get previews. Fork PRs do not receive the Cloudflare environment credentials or a deployment.
- A new PR commit produces a new CI run; the preview workflow checks that it still matches the PR head before deployment.
- ChatGPT tasks and GitHub Actions can fail or reach usage limits. The worker reports the failure and the last completed step rather than claiming DEV is ready.

## Verified second UI delivery and cloud access

The FAQ task (issue #86 / PR #87) passed PR CI and deployed preview checks and was merged by the owner. [delivery-review.md](delivery-review.md) separates independent pipeline evidence from the author's local-check record and the owner's observation of whether the chat needed steering.

For direct worker preview tests, use the published cloud configuration with `*.tr-config-place.workers.dev` in its custom network allowlist. Read the successful deployment URL for the current PR SHA rather than constructing a stale URL. A proxy 403 is an environment-access failure; do not report it as a failed application test. A saved configuration draft must be reviewed, saved and published before new tasks can use it. With Chromium installed, `DEV_URL=<verified-url> pnpm test:e2e:preview` runs against that remote target; leave `PLAYWRIGHT_LOCAL_SERVER` unset.

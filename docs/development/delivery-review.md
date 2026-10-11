# Delivery permissions and second UI delivery review

## Scope and evidence — 11 October 2026

The review inspected all six delivery workflows, their cleanup/deployment scripts,
and the live GitHub settings at main commit
`af2ac89531fa1dfa1104b9cb781eda7a7b70c8d2`. Issue #88 records the review scope.
Action references are pinned to full commit SHAs; every checkout disables
persisted credentials. No workflow uses `write-all` or inline execution of a PR
title, body or branch name. Dependencies are installed with a frozen lockfile.

## Trust and permission inventory

| Workflow/job                | GitHub token permissions                                                                | Executable code and credential boundary                                                                                                                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI, all jobs                | `contents: read`                                                                        | PR/main code runs without Cloudflare credentials. Same-repository PR quality builds upload `preview-assets`; browser and secret-scan must also succeed.                                                                |
| Deploy PR preview           | `contents: read`, `actions: read`, `pull-requests: read`; job-only `deployments: write` | Successful same-repository PR CI only. Checkout and tools from main; assets from the exact CI run. Open-PR/head SHA checks before deployment and status publication. Cloudflare secrets go to Wrangler only.           |
| Deploy DEV                  | `contents: read`                                                                        | Checkout the verified main SHA and build trusted merged code. This review adds explicit push-event and source-repository checks before the credentialed job. Cloudflare secrets go to Wrangler only.                   |
| Resolve merged PR           | `contents: read`, `pull-requests: read`                                                 | Verified main cleanup script; no Cloudflare credentials.                                                                                                                                                               |
| Cleanup merged PR           | `contents: write`, `pull-requests: read`                                                | Verified main script after successful DEV smoke test. Write access is needed only to delete an unchanged eligible merged branch. Cloudflare credentials are limited to the cleanup step.                               |
| Cleanup closed preview      | `contents: read`, `pull-requests: read`                                                 | `pull_request_target` handles closed, unmerged, same-repository PRs only; checks out main, never the PR head. Rechecks current PR state; deletes only its numbered preview, not the branch.                            |
| Reconcile PR resources      | job-only `contents: write`, `pull-requests: read`                                       | Successful same-repository main DEV run only. Verified main script inventories and rechecks closed PRs, numbered Workers and unchanged merged branches. Excludes stable DEV and other Workers.                         |
| Isolated rollback rehearsal | `contents: read`                                                                        | Manual main-only dispatch. Run-specific probe Worker must be absent; baseline/candidate content and restored baseline are checked, then the probe is deleted. Cloudflare credentials exist only in the rehearsal step. |

`workflow_run` and `pull_request_target` can receive privileged tokens. Their
event filters alone are not a trust guarantee. Preserve explicit source checks,
trusted checkouts and current-state rechecks when modifying these workflows.
The preview artifact is untrusted static site content; it is never executed as a
deployment script. Browser checks do load that site in Chromium, but Cloudflare
secrets are not provided to the browser-test process. PR installation lifecycle
scripts run in CI, not in the privileged preview job's trusted installation.

The DEV guard previously checked CI success and a branch named main. It now
also requires a push event originating in this repository, so successful PR/fork
CI cannot authorize a credentialed DEV build simply by sharing that branch name.
This is preventive hardening; the review found no evidence of credential exposure.

## Live repository settings and limits

- Active `protect-main` ruleset 23471361 targets the default branch, has no bypass
  actors, requires PRs, resolved conversations and up-to-date branches, and blocks
  deletion and force pushes. Required Actions checks are `quality`, `browser` and
  `secret-scan` (integration 15368). Required approvals remain zero for this
  single-owner project; AGENTS.md still prohibits agent merges.
- The `development` environment permits only the branch `main`. Its API response
  contains a branch policy and no required-reviewer gate, consistent with
  unattended DEV delivery. Preview workflows run from main while deploying a
  separate PR asset commit. Generated `pr-*` deployment-status environments
  are not where the workflows request Cloudflare secrets.
- The GitHub integration cannot list development secret metadata (HTTP 403).
  Successful DEV/preview/rehearsal runs demonstrate usable bindings, not their
  precise Cloudflare permissions or account scope. Those require an owner review
  in Cloudflare. Keep account-scoped development credentials separate from PROD;
  do not copy them into Codex. No secret values were inspected or changed.
- This review did not rotate tokens, change live protection settings, test an
  adversarial remote deployment, or perform a production deployment. Account-level
  Workers edit permissions remain a wider boundary than the scripts' Worker-name
  restrictions; review that residual scope with the owner when adding environments.

## Second small UI delivery

Issue #86 and PR #87 delivered a native three-question FAQ with mouse/keyboard,
focus, light/dark theme and existing link/theme regression coverage. The PR
documents a successful local `pnpm format` and `pnpm check:pr`: 10 Vitest tests,
15 Node script tests and four Playwright tests. That local result is the author's
record; this review independently inspected the diff and GitHub results.

- [PR-head CI 38143055031](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38143055031)
  passed for `dd8e78a2da91caaff5a2859041d0053096832d4b`.
- [Preview 38143141238](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38143141238)
  passed deployed smoke and theme browser checks. Deployment 6996196921 was
  tied to that exact PR head. New FAQ browser tests ran locally and in PR CI;
  the credentialed preview job runs trusted-main theme coverage, not new PR tests.
- The owner merged PR #87 to `af2ac89531fa1dfa1104b9cb781eda7a7b70c8d2`.
  [Main CI 38143852163](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38143852163)
  passed. [DEV run 38143927745](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38143927745)
  passed deployment, smoke and merged-PR cleanup; subsequent
  [reconciliation 38144005795](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38144005795)
  also succeeded for that merge commit.
- The other worker reported proxy HTTP 403 for direct preview access. The shared
  cloud configuration now includes `*.tr-config-place.workers.dev`; this review's
  subsequent request to the FAQ preview returned HTTP 200. A published version
  must be selected by future tasks; unrelated running workers are not migrated.
- Another worker chat's steering history is not available to this review. The
  technical delivery is independently evidenced, but an uninterrupted,
  one-prompt session remains an owner observation rather than an API-proven fact.

The known high-severity braces development-dependency advisory remains tracked
in issue #82. A green advisory-reporting security job does not mean zero findings.

## Ongoing review

Repeat this inventory after trigger/permission/checkout/artifact changes and
major Actions updates. Confirm the current ruleset and environment branch policy,
review Cloudflare token scope in its owning account, and inspect one successful
same-repository preview plus main DEV delivery. Test hostile/obsolete identities
with the existing script fixtures; do not grant secrets to forks to obtain a test.

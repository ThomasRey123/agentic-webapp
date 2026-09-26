# Start a feature from ChatGPT

Open a ChatGPT Work/Codex coding task with access to `ThomasRey123/agentic-webapp`. State the desired visible behavior and any constraints. A coding task keeps working after you leave the page; you do not need to start a second agent or create a GitHub issue yourself.

Example:

> In `ThomasRey123/agentic-webapp`, add a persistent dark mode toggle in the header. Analyze `AGENTS.md` and the current code, create an issue if useful, implement it on an `agent/<issue>-<slug>` branch, add behavior tests, run `pnpm check`, open one PR, follow CI, fix failures, and wait for the PR preview deployment and smoke test. Send me the PR, CI, and working preview URL once ready. Do not merge to `main` or deploy to PROD. Ask only for a decision you cannot infer responsibly.

The worker should remain on this task until the preview passes. A submitted message in an ordinary chat does not by itself set up a recurring watcher or webhook. If the coding task ends before an external CI/deployment finishes, schedule a follow-up in the same chat to check that PR and notify you; otherwise the user would have to return and restart the wait manually.

## One-time setup and verification

1. Merge the Phase 2 infrastructure PR through the existing ruleset. This activates `.github/workflows/deploy-preview.yml` on `main`.
2. Confirm that the GitHub `development` environment has the existing Cloudflare token and account ID and permits unattended DEV deployments. The account token must allow creating a second Worker. Keep PROD credentials separate.
3. Submit a small feature request in ChatGPT Work/Codex. The worker creates any issue and the PR; you only supply the feature description.
4. Watch the PR's `CI` run. Both `quality` and `security` must pass. `Deploy PR preview` should then deploy an isolated Worker and complete its smoke test. Open the URL in that workflow's summary and test the feature yourself.
5. When satisfied, review and merge the PR using the protected `main` path. The existing `Deploy DEV` workflow then publishes it to the stable DEV URL. Production remains manual.

If you need the **stable** DEV URL to change before review, that would require an autonomous merge and change the current review boundary. The first milestone uses a PR-specific DEV preview so you can test first and retain control over `main`.

## Operational limits

- A Worker needs GitHub write permission to create a branch and PR. A connection that can only read the repository cannot finish this flow.
- The first preview can run only after the infrastructure PR is merged to `main`.
- Same-repository PRs get previews. Fork PRs do not receive the Cloudflare environment credentials or a deployment.
- A new PR commit produces a new CI run; the preview workflow checks that it still matches the PR head before deployment.
- ChatGPT tasks and GitHub Actions can fail or reach usage limits. The worker reports the failure and the last completed step rather than claiming DEV is ready.

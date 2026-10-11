# Commit-specific PR preview status

Successful PR CI triggers the trusted-main
preview deployment workflow. Its deployment job creates a non-production,
transient GitHub Deployment for the exact verified SHA and environment
`pr-<number>`. The PR deployment section exposes the preview URL once both the
remote smoke test and theme browser test pass.

Failures publish a failed deployment status with the workflow log link. A result
for a closed PR or superseded commit is marked inactive when the job finishes;
success statuses automatically retire older successful deployments for the same
PR environment. Every deployment remains tied to its SHA: a link from an earlier
commit must not be treated as verification of new code that is still in CI.
Cancellation can leave an in-progress deployment; inspect its workflow status
rather than treating it as ready.

Only the deployment job gains `deployments: write`. It retains same-repository,
open-PR and exact-head checks before publishing. The credentialed workflow
continues to check out trusted `main` and download the exact CI artifact; it never
executes scripts from the PR branch. URLs are restricted to that PR's isolated
Workers hostname. No write access to PR comments is needed.

The flow was verified live after PR #85 merged: Dependabot PR #78 and the FAQ
PR #87 both produced exact-commit success deployments with smoke/theme browser
checks. See [delivery-review.md](delivery-review.md) for the FAQ run and deployment
IDs. Failure and superseded-identity paths have automated script coverage; no
intentional failing remote deployment was performed. Closed PR Worker cleanup is
automatic; a historical deployment link can point to a removed Worker after merge.

# Phase 2: ChatGPT to DEV

## Objective

The owner writes a feature request in a ChatGPT Work/Codex task. One worker handles repository analysis, optional issue creation, implementation, local checks, one pull request, CI follow-up, and a DEV preview. The owner returns to a URL for hands-on verification. No additional agent service is required for the first milestone.

## Boundaries

```text
ChatGPT task -> agent/<issue>-<slug> -> PR -> CI quality + security
                                               -> verified static export -> PR preview Worker
human review -> merge to protected main -> main CI -> existing DEV Worker
human approval -> future PROD process (not implemented)
```

The ChatGPT task is the one-time trigger. A normal completed chat response is not a persistent daemon: the worker must continue the task through CI and preview verification before declaring it done. If a task cannot stay active through an external wait, a scheduled follow-up in that same chat can check the PR and report the outcome. The scheduled follow-up does not start coding tasks from arbitrary new chat messages.

GitHub remains the audit log. The worker creates an issue when the request needs a durable task contract, then uses one scoped branch and PR. It reports links and the DEV preview URL in the ChatGPT task. Branch protection on `main` remains unchanged.

## Preview delivery

CI builds and tests each PR without Cloudflare credentials. For same-repository PRs it uploads `out/` only after the `quality` job succeeds. `security` must also succeed before the `CI` workflow can conclude successfully.

The separate `Deploy PR preview` workflow is triggered by successful CI. It lives on `main`, checks that the PR is still open and still points to the verified commit, downloads the export from that exact CI run, and deploys it to `agentic-webapp-pr-<number>`. The credentialed job checks out deployment configuration from `main`; it does not check out, build, install packages from, or run scripts from the PR branch. It validates that the artifact contains an entry page and no symlinks, then smoke-tests the returned deployment URL. A new commit cancels an older preview run for the same PR.

The preview is a separate Cloudflare Worker and cannot overwrite `agentic-webapp-dev`. It is publicly accessible at its Workers URL. Do not put secrets or private customer data in preview assets. The CI artifact itself is untrusted site content; tests and scanners are checks, not proof that all site content is safe.

The existing `Deploy DEV` workflow continues to deploy verified `main` commits only. A preview is not a merge or a PROD deployment. Closed PR preview Workers are not automatically removed in this first version; owners should periodically remove unused Workers and artifacts expire after seven days.

## Permissions and setup

- Connect the GitHub repository to the ChatGPT coding surface with repository read and write access for branches and PRs. Scope the connection to this repository where possible. The ChatGPT worker must not receive Cloudflare secrets.
- The existing GitHub `development` environment holds `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Its token needs Workers deployment access to this account. No new secret is committed.
- The preview workflow requests GitHub `contents: read`, `actions: read`, and `pull-requests: read`. It uses the environment token only in the deployment job. CI itself has `contents: read`.
- The `protect-main` ruleset requires PRs, successful `quality` and `security`, resolved review threads, and blocks deletion and force pushes. It requires zero approving reviews at present; the worker still leaves merging to the owner.
- This workflow must first be merged to `main` using the existing review path. GitHub executes a `workflow_run` handler from the default branch, so the bootstrap PR cannot deploy itself with the new handler.

## Failure and status

The GitHub PR and Actions runs show quality, security, preview deployment, and smoke-test status. A failed check leaves the preview unchanged and requires the worker to fix the branch and wait for a new green run. The worker must provide the exact failing step and avoid reporting DEV as ready until the smoke test passes. If Cloudflare credentials are missing or the account cannot create a separate Worker, the workflow fails visibly in GitHub; the owner configures access once, then reruns the failed deployment. PROD remains a separate, human-approved future phase.

See [chat-to-dev.md](../development/chat-to-dev.md) for the user-facing request and first end-to-end test.

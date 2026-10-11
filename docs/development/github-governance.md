# GitHub Governance

## Task Contract

Every implementation starts with exactly one structured GitHub issue. Use the feature form for planned behavior and delivery-system changes, and the bug form for reproducible defects. The issue defines the goal, observable acceptance criteria, and explicit out-of-scope items.

Blank issues are disabled for contributors. Repository maintainers may still see GitHub's maintainer-only blank-issue option. Security-sensitive details must never be posted in a public issue.

## Specification approval

Follow the [SDD working contract](spec-driven-development.md). A spec-only PR
requests owner approval of new/changed intended behavior. Its human merge closes
only the spec issue. A separate implementation issue and PR reference the spec
path, owner approval PR and full actual merge SHA. Each step has one issue,
branch and PR; merging a roadmap or mixed code/spec PR is not spec-only approval.

Draft/Approved/Implemented are evidence-derived states. Neither a label set by an
agent nor the zero-review ruleset setting proves approval. Approval is a working
contract checked by the agent and owner, not a new automated GitHub policy gate.
Final implementation delivery evidence goes in the existing issue/PR after
successful main CI and DEV checks. Maintenance records unchanged behavior and
suitable verification without requiring empty spec files.

## Branch and Pull Request Contract

Create one short-lived branch from current `main` for each issue:

```text
agent/<issue>-<slug>
feature/<issue>-<slug>
fix/<issue>-<slug>
```

Open exactly one pull request and retain the template sections. `Closes #<issue>` provides traceability from requirement to implementation. Record every check accurately; an environment limitation is not a successful check.

After a merged PR reaches a successful stable DEV deployment and smoke test, the cleanup job removes its branch only if the current branch still points at the PR head commit. GitHub's repository-wide automatic branch deletion setting is not required for this project. A PR closed without a merge retains its branch; only its preview Worker is removed.

## Current `main` Ruleset

The repository owner configures a repository ruleset named `protect-main` with these settings:

| Setting                               | Value                                                      |
| ------------------------------------- | ---------------------------------------------------------- |
| Enforcement status                    | Active                                                     |
| Target                                | Default branch (`main`)                                    |
| Bypass list                           | Empty                                                      |
| Restrict deletions                    | Enabled                                                    |
| Block force pushes                    | Enabled (`Non-fast-forward updates` restricted)            |
| Require a pull request before merging | Enabled                                                    |
| Required approvals                    | 0                                                          |
| Require conversation resolution       | Enabled                                                    |
| Required status checks                | `quality`, `browser` and `secret-scan` from GitHub Actions |
| Require branch to be up to date       | Enabled                                                    |

Zero required approvals is intentional for this single-owner learning repository: changes must still pass through a visible pull request, but the owner is not blocked waiting for a second collaborator. Agents remain forbidden from merging their own pull requests by `AGENTS.md`.

The required status checks are the stable `quality`, `browser` and `secret-scan` jobs from `.github/workflows/ci.yml`. `quality` runs `pnpm check`; `browser` runs the Playwright regression suite; `secret-scan` scans full Git history with Gitleaks. The separate `security` audit job reports high-severity findings as advisory warnings that still require triage. It is not a required ruleset check.

The live ruleset was verified on 11 October 2026. See [delivery-review.md](delivery-review.md) for the permission inventory and the development environment's main-only branch policy.

## Verification

Anyone with repository read access can inspect active rulesets under **Settings → Rules → Rulesets**. Confirm that `protect-main` is active and targets `main` before considering the governance setup complete.

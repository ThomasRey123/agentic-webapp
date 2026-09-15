# GitHub Governance

## Task Contract

Every implementation starts with exactly one structured GitHub issue. Use the feature form for planned behavior and delivery-system changes, and the bug form for reproducible defects. The issue defines the goal, observable acceptance criteria, and explicit out-of-scope items.

Blank issues are disabled for contributors. Repository maintainers may still see GitHub's maintainer-only blank-issue option. Security-sensitive details must never be posted in a public issue.

## Branch and Pull Request Contract

Create one short-lived branch from current `main` for each issue:

```text
agent/<issue>-<slug>
feature/<issue>-<slug>
fix/<issue>-<slug>
```

Open exactly one pull request and retain the template sections. `Closes #<issue>` provides traceability from requirement to implementation. Record every check accurately; an environment limitation is not a successful check.

## Initial `main` Ruleset

The repository owner configures a repository ruleset named `protect-main` with these settings:

| Setting                               | Value                                           |
| ------------------------------------- | ----------------------------------------------- |
| Enforcement status                    | Active                                          |
| Target                                | Default branch (`main`)                         |
| Bypass list                           | Empty                                           |
| Restrict deletions                    | Enabled                                         |
| Block force pushes                    | Enabled (`Non-fast-forward updates` restricted) |
| Require a pull request before merging | Enabled                                         |
| Required approvals                    | 0                                               |
| Require conversation resolution       | Enabled                                         |
| Required status checks                | Deferred to Phase 1 step 6                      |

Zero required approvals is intentional for this single-owner learning repository: changes must still pass through a visible pull request, but the owner is not blocked waiting for a second collaborator. Agents remain forbidden from merging their own pull requests by `AGENTS.md`.

Do not add a required status-check name before its GitHub Actions job has run successfully in the repository. Step 6 introduces the CI workflow and then adds its stable job name to this ruleset.

## Verification

Anyone with repository read access can inspect active rulesets under **Settings → Rules → Rulesets**. Confirm that `protect-main` is active and targets `main` before considering the governance setup complete.

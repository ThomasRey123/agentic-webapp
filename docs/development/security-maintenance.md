# Security and dependency maintenance

## Merge and deployment gates

`quality`, `browser` and `secret-scan` must pass before merge. The `secret-scan`
job runs Gitleaks against full history and fails on findings. The separate
`security` job reports the dependency audit; audit findings remain advisory and
require explicit triage. A green audit-reporting job is not proof of zero findings.
All CI jobs must succeed for preview and DEV deployment workflows to run.

After PR #84 was merged, the owner added `secret-scan` to `protect-main`.
The active ruleset was verified to require quality, browser and secret-scan,
with the remaining protection rules preserved. Workflow configuration alone
does not change repository settings.

## Audit remediation on 11 October 2026

The starting lockfile reported seven high and two moderate advisories:

| Package                | Remediation                                       | Dependency path                  |
| ---------------------- | ------------------------------------------------- | -------------------------------- |
| brace-expansion 1.1.18 | Lockfile refresh to 1.1.21                        | ESLint/minimatch                 |
| source-map-js 1.2.1    | Lockfile refresh to 1.2.2                         | Build/test dependencies          |
| brace-expansion 5.0.9  | Narrow override to 5.0.12                         | TypeScript ESLint/minimatch      |
| braces 3.0.3           | Unresolved: advertised fix 3.0.4 is not published | Next ESLint/fast-glob/micromatch |
| sharp 0.35.4           | Narrow override to 0.35.5                         | Wrangler/Miniflare               |

The braces advisory remains tracked: the registry latest is 3.0.3, and an
installation attempt for 3.0.4 returned no matching version. Do not hide this
finding or fabricate a patched release. Review the upstream fix when published.
This path handles lint file patterns; the static browser app does not execute it.

Overrides apply only to the old exact versions, preserving other versions and
avoiding a broad dependency upgrade. Remove each override when the upstream
parent accepts the patched version. Dependency audit data changes over time;
rerun `pnpm audit --audit-level high` rather than relying on this snapshot.
The static export does not ship Node tooling to the browser, but build and
deployment dependencies still run in environments with repository access.

Deploy workflows resolve Wrangler from the frozen-installed package rather than
maintaining an independent version string. Keep this source of truth when
reviewing a Wrangler update.

## Open update proposals

PRs #78 (setup-node/download-artifact), #79 (upload-artifact major) and #80
(application/test tooling) passed their existing CI jobs at inspection time.
Review release notes and preview behavior before human merge. Upload-artifact 7
adds opt-in direct uploads and ESM; current zipped-directory uploads remain the
intended mode. A passing security job may still contain advisory audit findings.
These PRs are not merged automatically. Refresh their branches after this change
and recheck CI, especially the lockfile overrides and deployment tool version.

Review `.github/workflows` changes with particular care: credentialed
`workflow_run` jobs must not check out or execute untrusted PR code. Preserve
SHA-pinned actions, minimal permissions and commit-specific artifact selection.

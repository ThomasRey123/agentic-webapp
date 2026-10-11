# Node.js update policy

Use the latest supported Node.js LTS release. The exact tested version in `.nvmrc`
is a reproducibility checkpoint, not a permanent commitment to a particular major.
CI and deployment already read this file. Keep `package.json` engines and
`@types/node` on the same major as the runtime.

`renovate.json` enables only Node runtime and Node type updates. Renovate's `node`
versioning treats a new runtime major as stable when it reaches LTS. Applying
that versioning to `@types/node` also excludes type majors for Current releases.
Runtime and type updates share a weekly PR group; automatic merging is disabled.
Dependabot continues to maintain other npm packages and GitHub Actions, and
ignores `@types/node` to avoid competing PRs.

## Activate automation

An owner must install or enable the Renovate GitHub App for this repository and
complete its onboarding. Committing configuration alone does not activate the
service. No Renovate credential belongs in the repository or cloud setup.
Review the first proposed update to confirm that runtime, engine range and types
remain aligned. If a bot proposes only a subset, complete the same PR before merge.

## Validate and adopt an update

1. Read the official Node release notes and any migration requirements.
2. Use `nvm install` and `nvm use` from the repository directory, or install the
   `.nvmrc` version with another version manager. Refresh the cloud environment's
   Node installation when this version changes.
3. Run `pnpm install --frozen-lockfile`, `pnpm format` and `pnpm check:pr`.
4. Run `pnpm audit --audit-level high` and review the advisory findings. GitHub
   must also run the required quality/browser gates and security secret scan.
5. Review the PR preview, merge through the normal human review process, and
   verify stable DEV deployment and its smoke test. Do not deploy to PROD.

Historical `PROJECT_STATE_V*.md` files describe earlier decisions. This policy
supersedes their advice to retain Node 24 or defer Node types indefinitely.

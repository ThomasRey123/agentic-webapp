# Node.js update policy

Use the latest supported Node.js LTS release. The exact tested version in `.nvmrc`
is a reproducibility checkpoint, not a permanent commitment to a particular major.
CI and deployment already read this file. Keep `package.json` engines and
`@types/node` on the same major as the runtime.

Node runtime and type updates are performed manually in a single reviewed PR.
Check for a new supported LTS release monthly and promptly after a relevant
security advisory. Dependabot continues its weekly checks for other npm packages
and GitHub Actions; it ignores `@types/node` so types cannot advance independently
of the runtime. No additional update bot is required.

## Prepare an update

1. Check the [official Node.js releases](https://nodejs.org/en/about/previous-releases)
   and select the latest supported LTS release, including its release notes.
2. Create an issue and a short-lived branch from current `main`.
3. Update `.nvmrc` to the selected exact version and `package.json` engines to
   require that version within its major (for example, `>=24.21.0 <25`).
4. Install and activate that runtime, then run `pnpm add -D @types/node@^<major>`
   with the chosen major substituted. This updates the type dependency and lockfile.
   Runtime and type patch versions need not match; their majors must match.
5. Update any version examples in the setup documentation and prepare the cloud
   runtime using the saved install script.

Existing Dependabot PRs for `@types/node` are not automatically closed by the
ignore rule. Review them separately and close superseded proposals deliberately.

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

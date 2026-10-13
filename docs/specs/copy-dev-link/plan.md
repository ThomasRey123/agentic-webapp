# Implementation plan: Selectable DEV address after copy errors

**Implementation issue:** [#111](https://github.com/ThomasRey123/agentic-webapp/issues/111)
**Approved specification:** `docs/specs/copy-dev-link/spec.md`
**Owner approval:** [#110](https://github.com/ThomasRey123/agentic-webapp/pull/110), merge `9c747eb2ed3169255fa28073de6fb93d8c11051b`.

Read the immutable owner-merged revision and verified equality with current main.
Change FR-003 recovery and FR-004/FR-005 coverage; preserve FR-001/002/006.

## Approach

Keep the existing four-state copy interaction. Render a native read-only textarea
only in error, labeled "Stable DEV address", outside the polite atomic status
region. Native selection and browser copy commands require no extra clipboard
API, deprecated fallback, permission changes or confirmation claim. Deriving
visibility from the existing status removes it immediately on retry and reload;
theme changes preserve state. Do not move focus automatically.

Use existing theme colors, a solid textarea background and visible keyboard
focus. Allow wrapping at mobile widths while retaining the exact full value.
No dependencies, architecture changes, migrations or runtime server.

## Verification

Extend existing component cases for all error modes and lifecycle. Extend browser
retry/theme/reload, missing/denied and mobile cases; add actual keyboard/mouse
selection and native copy with isolated harness readback. Application code neither
reads clipboard nor changes permissions. Existing real app-write, home, links,
FAQ, theme, no-JS, assets and static export checks stay intact.

Extend the eight WCAG 2/2.1 A/AA audits to include the recovery address, reachable
focus and both themes. Exclude no rules. Inspect actual JSON results and preserve
incomplete gradient contrast findings. Capture and inspect new 390px screenshots
and contrast evidence for error recovery in both themes; old evidence is historical.
Audible screen-reader output remains optional and not tested.

Run frozen install, `pnpm format`, `pnpm check:pr` and advisory audit. Inspect
exact-head quality/browser/secret-scan and preview deployment; run the full suite
against that preview with active TLS and authorized environment CA/NSS setup.
Owner implementation merge and subsequent successful main CI/DEV are separate
pending delivery evidence, recorded in the existing issue/PR after they exist.

## Historical plan

The previously delivered #103/#104 audit implementation followed approval #102
(`6ddf92ca36d183cca0634237b2800689911172af`); its results and original #97/#98
history remain in tasks. This follow-up does not rerun or relabel old acceptance.

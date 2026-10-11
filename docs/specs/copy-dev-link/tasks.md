# Tasks: Copy the stable DEV link

## Original delivery evidence (approval #96)

**Implementation issue:** [#97](https://github.com/ThomasRey123/agentic-webapp/issues/97)
**Specification baseline:** `docs/specs/copy-dev-link/spec.md`, owner approval
[#96](https://github.com/ThomasRey123/agentic-webapp/pull/96), merge
`a4a06bd880135436f5b2856a361c1c59b191d10d`.

- [x] Read immutable approved spec; confirm alignment with main.
- [x] Derive plan and requirement/test mapping without changing behavior.
- [x] Implement bounded clipboard action and feedback, FR-001–FR-006.
- [x] Run `pnpm format` and `pnpm check:pr`; 31 unit/script and 11 browser tests passed, static export succeeded.
- [x] Original implementation PR #98 passed CI and preview; owner merged it.
- [x] Inspect static-export mobile screenshots and contrast in both themes.
- [ ] Original real screen-reader announcement check was not performed; #102 makes it optional.
- [x] Original owner merge #98: `1e74554f674cdc8dc9bcf6ebc51cd4bf800bb7b6`; main CI run 38150461246 and DEV run 38150541965 succeeded.

## Requirement evidence

| Requirement | Locatable checks                                                                                                                             | Result                                                                 |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| FR-001      | `src/features/home/tests/copy-dev-link.test.tsx`: idle/exact URL; `tests/e2e/copy-dev-link.spec.ts`: real clipboard case, pending/retry case | Passed: final `pnpm check:pr`                                          |
| FR-002      | Unit idle/pending/completion case; browser pending/retry case, including overlap and usable FAQ/theme/links                                  | Passed: final `pnpm check:pr`                                          |
| FR-003      | Unit rejected/missing/writeText absent/synchronous failure cases; browser missing and denied cases                                           | Passed: final `pnpm check:pr`                                          |
| FR-004      | Unit two retry transitions; browser pending/retry/reload case                                                                                | Passed: final `pnpm check:pr`                                          |
| FR-005      | Browser keyboard/focus/pending case and light/dark mobile cases; manual contrast/visual inspection and real screen-reader announcement check | Browser passed; visual/contrast passed; real screen-reader check unrun |
| FR-006      | Existing home/FAQ/theme browser suites; browser pending/theme and no-JavaScript cases; `pnpm check:pr` static export                         | Passed: regressions, no-JS browser and static export                   |

Final gate: `pnpm format` and `pnpm check:pr` passed, including formatting,
lint/typecheck, 16 Vitest + 15 Node tests, static build and all 11 Chromium cases.

Initial gate: format/lint/typecheck, 16 Vitest + 15 Node tests and static build
passed. Browser could not launch because Playwright 1.64.0 needs Chromium 1248,
while the restored environment only contained 1243. Install matching Chromium
using the existing environment setup, then rerun required gate; do not count this
failed run as browser evidence. A subsequent mobile regression exposed
column wrapping caused by a percentage flex-basis on the status. Changing the
mobile status basis to auto fixed the clipping; both mobile cases and the final
full gate passed. An intermediate gate encountered the inspection server still
using port 3000; stopped that owned process and reran the full gate successfully.

The original approval required a real screen-reader check; the owner confirmed
it was not performed. Approval #102 supersedes that requirement: the check is
optional, while actual audible announcements remain **not tested**. Historical
automated and visual results do not retroactively prove audible output.

## Manual visual and contrast evidence

Inspected the actual production static export at 390px: both themes show all
three controls, complete manual recovery text and visible keyboard focus, without
clipping. Screenshots: [light](evidence/mobile-light.png),
[dark](evidence/mobile-dark.png). These show error feedback, the longest message.
Computed theme colors with a conservative maximum radial-overlay background give
status contrast at least 4.69:1 light and 6.52:1 dark. Control text exceeds 4.5:1;
border/focus exceed 3:1 (including hover). Screenshot inspection is visual
evidence, not proof of screen-reader announcements.

Pilot observations: no scope changes or additional owner steering during
implementation. Existing browser cache required refresh; tests discovered and
prevented a mobile feedback layout regression. Original delivery evidence is recorded above. Audible output remains untested.

## Automated acceptance revision (approval #102)

**Implementation issue:** [#103](https://github.com/ThomasRey123/agentic-webapp/issues/103)
**Approved specification:** `docs/specs/copy-dev-link/spec.md`, #102 merge
`6ddf92ca36d183cca0634237b2800689911172af`.

- [x] Read immutable approved spec and implementation issue; confirm main alignment.
- [x] Add development-only axe engine and scoped audit matrix, without application changes.
- [x] Record JSON evidence in the existing browser CI job, without adding gates or permissions.
- [x] Format, frozen install and `pnpm check:pr` passed: 16 Vitest + 15 Node tests, static export, 19 Chromium cases; advisory audit reviewed.
- [ ] Verify independent CI and exact-head deployed preview.
- [x] Scoped stable-DEV audits: all eight cases passed with active TLS checks; full stable suite awaits separate PR #100.
- [ ] Owner merges this implementation; append actual merge/main CI/DEV evidence.

FR-005 maps to all eight cases in `tests/e2e/copy-dev-link-accessibility.spec.ts`:
light/dark × idle/pending/success/error. Each checks native keyboard access,
visible retained focus, accessible button name, computed polite/atomic status,
and all applicable WCAG 2.1 A/AA axe rules in Project links. No rule exclusions.
Full JSON results record engine version, tags, scope, violations and incomplete
checks; incomplete means unverified, not passed. Other requirement mappings and
manual visual/contrast evidence above remain applicable.

Audit results (axe-core/adapter 4.13.0, Playwright 1.64.0):

| Theme | State   | Detected violations | Incomplete rules |
| ----- | ------- | ------------------- | ---------------- |
| light | idle    | 0                   | none             |
| light | pending | 0                   | color-contrast   |
| light | success | 0                   | color-contrast   |
| light | error   | 0                   | color-contrast   |
| dark  | idle    | 0                   | none             |
| dark  | pending | 0                   | color-contrast   |
| dark  | success | 0                   | color-contrast   |
| dark  | error   | 0                   | color-contrast   |

Local and stable-DEV matrices agree. Enabled tags: `wcag2a`, `wcag2aa`,
`wcag21a`, `wcag21aa`; scope: `nav[aria-label="Project links"]`.
The six incomplete checks concern status text over the page's background gradient
(`bgGradient`): axe cannot determine the background. These automated contrast
results remain **unverified**. Original visual inspection and conservative
computed contrast above provide supplementary evidence; they do not turn an
incomplete engine result into a pass. No rule was disabled or excluded.
Full reports: `test-results/**/copy-accessibility-*.json`, uploaded in CI as
`copy-accessibility-evidence` (seven-day retention), with all rule/node details.

Security audit reports the existing high-severity braces advisory
`GHSA-vfj7-8cjw-p6xm`, tracked separately in #82; no new advisories were found.
Actual audible announcements: **not tested; optional**. Acceptance evidence changes do not satisfy epic #90's
separate planned later user-visible behavior change.

# Tasks: Copy the stable DEV link

**Implementation issue:** [#97](https://github.com/ThomasRey123/agentic-webapp/issues/97)
**Specification baseline:** `docs/specs/copy-dev-link/spec.md`, owner approval
[#96](https://github.com/ThomasRey123/agentic-webapp/pull/96), merge
`a4a06bd880135436f5b2856a361c1c59b191d10d`.

- [x] Read immutable approved spec; confirm alignment with main.
- [x] Derive plan and requirement/test mapping without changing behavior.
- [x] Implement bounded clipboard action and feedback, FR-001–FR-006.
- [x] Run `pnpm format` and `pnpm check:pr`; 31 unit/script and 11 browser tests passed, static export succeeded.
- [ ] Open the one implementation PR; confirm independent CI and exact-commit preview.
- [x] Inspect static-export mobile screenshots and contrast in both themes.
- [ ] Complete required real screen-reader announcement check.
- [ ] Owner merges; append actual merge/CI/DEV evidence to issue #97 or PR.

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

Manual screen-reader verification is required by the approved spec. DOM status
semantics and keyboard tests do not prove actual audible announcements. Until
that check passes, full acceptance remains blocked even with green CI. Review
steps: use a real screen reader on the current-commit preview, activate the copy
button with Enter/Space, confirm polite feedback without focus movement; test
successful and unavailable/denied clipboard outcomes. No delivery is claimed
before human merge and successful exact-commit main CI/DEV smoke.

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
prevented a mobile feedback layout regression. Real screen-reader review effort
and post-merge delivery remain to be recorded in issue #97/PR.

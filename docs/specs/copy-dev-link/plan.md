# Implementation plan: Automated copy-link accessibility evidence

**Implementation issue:** [#103](https://github.com/ThomasRey123/agentic-webapp/issues/103)
**Approved specification:** `docs/specs/copy-dev-link/spec.md`
**Owner approval:** [#102](https://github.com/ThomasRey123/agentic-webapp/pull/102), merge `6ddf92ca36d183cca0634237b2800689911172af`.

The immutable approval matches main. FR-005 changes the acceptance evidence;
FR-001–FR-004 and FR-006 and application behavior remain unchanged. Original
implementation #97/#98 followed approval #96 (`a4a06bd880135436f5b2856a361c1c59b191d10d`).

## Approach and affected modules

Add a Playwright audit file covering Project links in light/dark themes and
idle/pending/success/error states. Control only the isolated browser clipboard
to hold pending or resolve/reject deterministically. Exercise keyboard activation,
visible focus and retention; inspect Chromium's computed accessibility tree for
polite/atomic status semantics. Keep existing functional and mobile regressions.

Use development-only `@axe-core/playwright` 4.13.0 (MPL-2.0), the maintained
Deque adapter for axe-core 4.13.0. Its documented include/withTags/analyze API and
Playwright peer requirement (>=1.0.0) fit installed Playwright 1.64.0. This engine
provides rule evaluation that hand-written DOM assertions cannot supply. A hosted
scanner would add an unnecessary service; hand assertions remain useful for
interaction behavior. No runtime bundle dependency, backend or migration.

## Verification and evidence

Scope axe to `nav[aria-label="Project links"]`, with WCAG 2 A/AA and 2.1 A/AA
tags; exclude no rules. Fail on detected violations. Persist full engine results,
version, tags, scope, state/theme and incomplete results as eight JSON reports.
Upload those reports from the existing browser CI job, including successful runs;
retain seven days, with unchanged permissions and required gates.

Incomplete checks remain explicitly unverified and require review. Neither axe
nor computed browser semantics proves an audible screen-reader announcement.
The actual reader check was not performed and is now optional under #102.
Retain original visual/contrast evidence and report its limits.

Run `pnpm format`, frozen dependency installation, `pnpm check:pr`, advisory
security audit, independent CI and exact-head preview checks. Run scoped audits
against stable DEV with existing authorized NSS access and active TLS checks.
PR #100 separately fixed the stable-DEV no-JS harness and is owner-merged.
After owner merge of #104, the complete 19-case suite passed on stable DEV;
see tasks and the worker handoff for actual delivery evidence. Do not duplicate
the harness repair.

## Risks and recovery

Automated rules cover only applicable checks in the selected region, not whole
site WCAG conformance or assistive-technology compatibility. Review incomplete
results explicitly. Browser-specific computed semantics use Chromium CDP,
matching the existing configured browser project. No application changes, extra
CI gates, new credentials, permissions or ADR. Reverting this test-only change
restores previous verification; owner-controlled merge remains required.

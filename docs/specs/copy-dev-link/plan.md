# Implementation plan: Copy the stable DEV link

**Implementation issue:** [#97](https://github.com/ThomasRey123/agentic-webapp/issues/97)
**Approved specification:** `docs/specs/copy-dev-link/spec.md`
**Owner approval:** [#96](https://github.com/ThomasRey123/agentic-webapp/pull/96), merge `a4a06bd880135436f5b2856a361c1c59b191d10d`.

The immutable specification matches current main; FR-001–FR-006 remain unchanged.

## Approach and affected modules

Keep HomePage a Server Component and add one feature-owned `CopyDevLink` Client
Component. Share the stable URL constant with the existing link. Invoke native
Clipboard.writeText only from the activation handler. Local state represents
idle/pending/success/error; a synchronous ref prevents overlapping writes.

## Decisions and constraints

Use a native button, a persistent polite `role=status` region and explicit text
for feedback. `aria-disabled` plus the synchronous handler guard prevents overlap
without removing keyboard focus. Feedback has no timer or persistence. Catch
rejection/unavailability and describe the existing manual route. Native clipboard
policy stays authoritative: no permission requests, reads or deprecated fallback
in application code. Tests can control their isolated browser clipboard.

Use existing theme variables, a contrasting control border and visible focus.
No dependencies, backend, migration, deployment changes or ADR needed; browser
API access occurs after activation, preserving static export. Installed Next.js
16.4.0 `use-client` documentation was consulted.

## Verification strategy

Unit tests cover pending truth, exact address, overlap, rejection/unavailability
and both retry transitions. Chromium exercises a real clipboard write/readback,
keyboard/focus, deferred outcomes, other controls, theme/reload, mobile themes and
no-JavaScript links. Existing home/FAQ/theme regressions remain required.
Run `pnpm format` and `pnpm check:pr`; independently verify CI and PR preview.

Inspect mobile light/dark screenshots and computed contrast. A real screen-reader
announcement check remains a required manual acceptance item; automated status
semantics do not prove audible announcement. Record results in tasks and PR.

## Risks, migration and recovery

Browser policy can deny Clipboard API access; the defined manual route handles
this without making the page fail. No application permissions are requested.
Owner review must include manual announcement verification. No data migration;
reverting this scoped implementation restores the existing links-only behavior.

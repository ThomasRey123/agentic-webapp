# Specification: Copy the stable DEV link

**Specification revision issue:** [#109](https://github.com/ThomasRey123/agentic-webapp/issues/109).
**Original specification issue:** [#95](https://github.com/ThomasRey123/agentic-webapp/issues/95).
**Parent initiative:** [SDD pilot, epic #90](https://github.com/ThomasRey123/agentic-webapp/issues/90).
**Review purpose:** Behavioral proposal for owner approval: show a selectable stable DEV address after a copy error. No implementation or delivery claim.
**Previous approved revision:** This path at owner-merged [PR #102](https://github.com/ThomasRey123/agentic-webapp/pull/102), merge `6ddf92ca36d183cca0634237b2800689911172af`.
**Existing delivery:** Application [PR #98](https://github.com/ThomasRey123/agentic-webapp/pull/98), test repair #100 and automated acceptance #104; see [worker handoff](../../development/worker-handoff.md) for actual delivery evidence and limitations.

Approval follows the [SDD working contract](../../development/spec-driven-development.md).
This proposal contains no future approval/implementation SHA. After owner merge
of its spec-only PR, a separate implementation issue/PR must reference that PR,
actual full merge SHA and this path. Until then, #102 remains the approved
baseline. Existing evidence is historical; verification of this new behavior
is planned, not passed. Plan/tasks still describe the delivered pilot and will
be revised separately during approved implementation.

## Goal and users

Help the project owner or a reviewer share the stable DEV application address
without opening a new tab or copying from the address bar. The action must
report whether copying succeeded and offer understandable recovery when the
browser cannot write to the clipboard.

## Scope and non-goals

In scope: one copy action next to the home page's existing project links,
visible feedback with accessible status semantics, failure handling, repeat use and a selectable address for manual recovery on the same page. The
action copies exactly this existing stable address, including its trailing slash:

`https://agentic-webapp-dev.tr-config-place.workers.dev/`

Out of scope: copying the current PR preview URL or current page URL; social
sharing services; clipboard reads; automatic copying; permission changes;
analytics; persistent copy state; backend, application-runtime dependency or deployment changes.
The feature does not claim that stable DEV contains the code of an unmerged PR.
Verification may add development-only audit tooling; it must not add clipboard
permissions, a runtime dependency in the application bundle or an external service.
A real screen-reader session remains optional under the approved #102 acceptance policy.
Actual audible output remains explicitly unverified unless such a session is recorded.

## Current and proposed behavior

The home page has "View repository" and "Open stable DEV" links, a persistent
theme toggle, native FAQ disclosures and the existing Cloud-Test interaction.
The deployed implementation already has a "Copy DEV link" action alongside
those links. This revision changes FR-003 recovery and its FR-004/FR-005 acceptance coverage.
This proposal changes error recovery: after a failed or unavailable clipboard
write, show the exact stable DEV address on the same page so the user can select
and manually copy it. The existing "Open stable DEV" link remains usable.

The copy interaction has idle, pending, success and error outcomes. Feedback
reflects the current attempt; it is not persisted across reloads and does not
disappear on an arbitrary timer. Changing the theme does not reset the current
feedback. Exact feedback wording may vary while preserving the meaning below;
the action's accessible name and the copied URL are fixed.

## Requirements and scenarios

### FR-001 — Copy the exact stable address on explicit activation

The action is named "Copy DEV link" and writes only the specified stable URL
to the browser clipboard when the user activates it. It neither navigates nor
opens a tab, and never initiates copying on page load or theme changes.

- Given a clipboard-capable browser and the home page, when the user activates
  "Copy DEV link", then a successful write places the exact specified URL in
  the clipboard and the current page URL stays unchanged.
- Given the same home page served as a PR preview, when the action succeeds,
  then it copies stable DEV, not the preview hostname or current page URL.
- Given page load/reload or a theme change without activation, then no copy
  request is initiated by this feature.

### FR-002 — Show truthful pending and success feedback

Initially no success/error claim is shown. While a write is unresolved, the
page communicates that copying is in progress and prevents additional copy
attempts from overlapping. Other page controls remain usable. Success is
reported only after the browser confirms the write completed successfully.

- Given an idle action, when a write starts and remains unresolved, then pending
  feedback is visible, no success is claimed, and repeated activation does not
  start another write.
- Given a pending write, when it completes successfully, then success feedback
  confirms the DEV link was copied and a later attempt is possible.
- Given a pending write, then the user can still use the existing links, FAQ
  and theme toggle; this feature does not block the entire page.

### FR-003 — Show the selectable stable address after a clipboard error

If writing is rejected, unsupported or unavailable in the browsing context,
show an understandable error, never success. Display the exact stable URL above,
including its trailing slash, as selectable text with the accessible name
"Stable DEV address". Explain that the user can select and manually copy this
address or use "Open stable DEV". Keyboard users can reach the address, select
its complete value and invoke the browser/platform's normal copy command;
mouse users can select the complete address too. Manual selection/copy does not
trigger another application clipboard write, navigate or claim confirmed success.
Do not silently use deprecated copy mechanisms, change permissions, navigate
automatically or expose raw exception details. The application never reads the
user's clipboard. Do not add an extra automatic fallback or a second copy button.

- Given a browser denies/rejects the write, when the attempt ends, then the
  page reports failure, displays the exact selectable stable address and explains
  both manual recovery routes without an uncaught error.
- Given clipboard writing is absent or unavailable, when the action is activated,
  then the same error, address and recovery guidance appear.
- Given either failure outcome, then existing controls remain usable and no
  success message from an earlier attempt remains.
- Given the error address, when a user reaches it with the keyboard and selects
  its full value, or selects it with a mouse, then the browser's normal manual
  copy operation can copy the exact URL. The application retains error feedback
  and does not claim it verified the manual copy.
- Given a PR preview, then the error address is stable DEV, never the preview URL.

### FR-004 — Allow repeat attempts with current feedback

After success or failure, a new explicit activation can try again. Starting a
new attempt replaces earlier success/error feedback with pending feedback;
the settled outcome of that attempt determines the message. Settled feedback
remains until another attempt or page reload. The recovery address is visible
only in the error state: a new attempt removes it immediately, including while
pending; success and idle do not show it. Theme changes preserve error feedback
and the address. Reload starts idle without the address.

- Given a failed attempt, when the user retries and the browser now accepts
  the write, then failure is replaced by pending and then success feedback.
- Given a successful attempt, when a later write fails, then old success is
  replaced by pending and then failure feedback.
- Given settled feedback, when the page reloads, then the action starts idle
  and does not automatically write again.

### FR-005 — Support accessible operation in both themes

The action is a native button with the accessible name "Copy DEV link". It is
reachable in the normal tab order, operable with Enter and Space, and has visible
keyboard focus. Feedback is available visually and exposed through a polite,
atomic status region for assistive technology. The interaction does not
programmatically move focus.
Text/status/control contrast remains appropriate in both existing themes; color
alone does not convey success or failure.

- Given keyboard navigation, when the user tabs to the action, then focus is
  visible; Enter or Space initiates the same copying behavior as a click.
- Given pending, success or failure feedback, then the message is available to
  assistive technology through polite, atomic status semantics without requiring
  the user to move focus to read it.
- Given light or dark theme, then the action and feedback are readable; at a
  390px-wide viewport they cause no horizontal page overflow or clipped message.
  The complete recovery address remains selectable/copyable in both themes;
  keyboard focus on it is visible. Error appearance does not move focus from
  the copy button automatically.
- Given light or dark theme and idle, pending, success or error state, then an
  automated accessibility audit of the copy control/status and surrounding
  "Project links" region reports no detected violations of its applicable WCAG
  2.1 level A/AA rules. Each state must actually be exercised; an idle-only scan
  is insufficient. The error audit includes the new recovery address and guidance. Detected violations fail verification and cannot be hidden
  through silent rule exclusions.
- Given automated checks pass, then the evidence states their scope/tool and
  keeps actual audible screen-reader output "not tested" unless a real session
  occurred. A manual screen-reader session is optional and is not an acceptance
  blocker under this revision. Automated results do not certify complete WCAG
  conformance or actual screen-reader/browser interoperability.

### FR-006 — Preserve existing behavior and static delivery

Keep the existing links/destinations, theme persistence, FAQ operation and
Cloud-Test behavior. The feature remains compatible with the existing static
export and requires no server or external service. With JavaScript disabled,
the existing links remain usable and the feature does not claim copying worked.
Clipboard-denied/unsupported cases must not break page rendering.

- Given the new action, when existing link, FAQ, theme/reload and Cloud-Test
  journeys run, then their current behavior remains intact.
- Given the page with JavaScript disabled, then "Open stable DEV" and the
  repository link remain usable and no copy-success claim appears.
- Given theme changes during or after an attempt, then feedback still represents
  that attempt; theme persistence across reload continues to work.

## Constraints

- Accessibility: native controls, visible focus, keyboard activation, readable
  feedback and polite, atomic status semantics. Do not require success/error colors
  to understand the outcome; avoid unexpected focus movement.
- Security/privacy: copy only the fixed public HTTPS address in response to an
  explicit user action; no clipboard reads, telemetry, credentials, permission
  changes or sensitive data. Browser policy remains authoritative.
- Compatibility: preserve existing home journeys and static export. The normal
  HTTPS DEV/preview environment can support copying, but rejection/unavailability
  are expected outcomes, not deployment failures. No legacy copy fallback.
- Performance: no backend/network request is needed for this interaction. No
  fixed success timeout is promised while browser permission is unresolved;
  pending state must remain truthful and leave the rest of the page usable.

## Assumptions and open questions

- On 13 October 2026 the owner selected showing the DEV address after a copy
  error as the small visible follow-up for epic #90. The spec-only merge approves
  the exact contract before implementation.
- The URL and English accessible names follow the existing project links.
- Manual copy uses browser/platform selection and copy commands; it cannot be
  confirmed by the application and does not replace an explicit retry.
- Untimed feedback, current Chromium coverage and optional real screen-reader
  sessions remain unchanged. No localization or cross-browser expansion.
- Open scope/acceptance questions: none. A different recovery lifecycle or
  added interaction requires revising this proposal before owner approval.

## Acceptance and planned verification

Existing pilot evidence remains historical. The separate implementation issue/PR
must map every row to actual test paths/cases and results, distinguishing retained
evidence from newly executed checks. All checks for the recovery address below
are planned and have not run. Run `pnpm format` and `pnpm check:pr` for implementation,
then inspect exact-commit CI/preview and post-merge main CI/stable DEV evidence.

| Requirement ID | Acceptance scenario                                                             | Planned check and expected outcome                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001         | Exact URL, explicit action, no navigation; same stable target on a preview      | Chromium test with permitted clipboard writes and exact clipboard readback performed by the test harness; component test verifies fixed target and no write on load/theme changes                                                                                                                                                                                                                               |
| FR-002         | Pending does not claim success or permit overlapping attempts                   | Component test with a controlled unresolved write; settle it to success; browser check confirms other controls remain usable                                                                                                                                                                                                                                                                                    |
| FR-003         | Rejected/missing writes display exact selectable stable URL and manual guidance | Component and browser cases simulate rejection and unavailable capability; exact address on stable DEV and preview, truthful error/manual guidance, no stale success or uncaught exception; browser keyboard/mouse selection and normal manual-copy readback in isolated test clipboard; app initiates no extra write or navigation and retains error                                                           |
| FR-004         | Failure→success, success→failure, error theme persistence and reload reset      | Controlled attempt-sequence tests plus browser reload check; address appears only in error, disappears on retry/pending/success/reload, remains through theme changes; reload does not copy                                                                                                                                                                                                                     |
| FR-005         | Mouse/Enter/Space, focus/status semantics, themes/mobile                        | Browser checks for tab order, keyboard activation, retained focus, reachable named recovery address with visible focus and polite/atomic status semantics; automated WCAG 2.1 A/AA audit of Project links in both themes/all four states; manual visual/contrast/mobile verification of the new recovery address in both themes; real screen-reader output explicitly not tested unless optional session exists |
| FR-006         | Existing journeys, no-JS links and static build                                 | Existing home/FAQ/theme regression suite extended as needed; no-JS browser check for usable links/no success; required production export succeeds                                                                                                                                                                                                                                                               |

Browser test harnesses may read their isolated test clipboard to verify output;
this does not permit clipboard reads in the application. Tests of mocked error
cases do not replace the real-browser success case. Automated audit results and
DOM assertions do not prove audible announcements; record real screen-reader
output as "not tested" and optional. Record tool/version, enabled rule scope,
theme/state matrix and detected violations; review-needed/incomplete audit
findings remain explicitly unverified, not automatic pass claims. They do not
silently restore a mandatory manual screen-reader session. Existing visual
inspection cannot be claimed from DOM assertions alone. Unrun required automated
checks or detected violations remain blockers to revised acceptance even when
unrelated CI checks pass. Spec approval alone does not execute the audit.

## Change and decision notes

Original #95/#96 introduced FR-001–FR-006. Revision #101/#102 changed FR-005
acceptance to automated keyboard/focus/status checks and scoped accessibility
audits; audible screen-reader output remains optional and not tested.

Revision #109 changes FR-003 to offer same-page manual recovery. FR-004 gains
explicit recovery-address lifecycle scenarios; FR-005 extends existing keyboard,
mobile, visual and audit coverage to that address. FR-001, FR-002 and FR-006 remain
unchanged. No IDs are added, retired or reused. The original external manual route
remains available, and manual copying never masquerades as a verified app success.

Historical eight axe audits detected no violations, but six status contrast
checks were automatically incomplete due to gradients. Keep those limitations
and supplementary manual evidence explicit. Generate and inspect new evidence
for changed content; do not treat old visual evidence or incomplete axe findings
as a pass for the new recovery address. No whole-site WCAG certification or audible
interoperability claim is introduced.

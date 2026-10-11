# Specification: Copy the stable DEV link

**Specification revision issue:** [#101](https://github.com/ThomasRey123/agentic-webapp/issues/101).
**Original specification issue:** [#95](https://github.com/ThomasRey123/agentic-webapp/issues/95).
**Parent initiative:** [SDD pilot, epic #90](https://github.com/ThomasRey123/agentic-webapp/issues/90).
**Review purpose:** Proposed FR-005 acceptance revision for owner approval; not evidence that the new automated audit has run.
**Previous approved revision:** This path at owner-merged [PR #96](https://github.com/ThomasRey123/agentic-webapp/pull/96), merge `a4a06bd880135436f5b2856a361c1c59b191d10d`.
**Existing delivery:** [PR #98](https://github.com/ThomasRey123/agentic-webapp/pull/98), merge `1e74554f674cdc8dc9bcf6ebc51cd4bf800bb7b6`; recorded manual screen-reader test is unrun.

Approval follows the [SDD working contract](../../development/spec-driven-development.md).
This revision contains no future approval/implementation SHA. After owner merge
of its spec-only PR, a separate implementation issue/PR will reference that PR,
actual full merge SHA and this path. Until then, the previous approved acceptance
contract remains the baseline. Existing test/delivery evidence stays historical;
new automated accessibility audits below are planned, not passed.

## Goal and users

Help the project owner or a reviewer share the stable DEV application address
without opening a new tab or copying from the address bar. The action must
report whether copying succeeded and offer understandable recovery when the
browser cannot write to the clipboard.

## Scope and non-goals

In scope: one copy action next to the home page's existing project links,
visible feedback with accessible status semantics, failure handling and repeat use. The
action copies exactly this existing stable address, including its trailing slash:

`https://agentic-webapp-dev.tr-config-place.workers.dev/`

Out of scope: copying the current PR preview URL or current page URL; social
sharing services; clipboard reads; automatic copying; permission changes;
analytics; persistent copy state; backend, application-runtime dependency or deployment changes.
The feature does not claim that stable DEV contains the code of an unmerged PR.
Verification may add development-only audit tooling; it must not add clipboard
permissions, a runtime dependency in the application bundle or an external service.
A real screen-reader session is optional under this proposed acceptance revision.
Actual audible output remains explicitly unverified unless such a session is recorded.

## Current and proposed behavior

The home page has "View repository" and "Open stable DEV" links, a persistent
theme toggle, native FAQ disclosures and the existing Cloud-Test interaction.
The deployed implementation already has a "Copy DEV link" action alongside
those links. This revision changes FR-005 verification, preserving its interaction.
It stays on the page; the existing "Open stable DEV" link remains an independent
way to visit the destination and manually copy its address.

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

### FR-003 — Handle rejected and unavailable clipboard writes

If writing is rejected, unsupported or unavailable in the browsing context,
show an understandable error, never success. Explain that the user can use
"Open stable DEV" and copy the address manually. Do not silently use deprecated
copy mechanisms, change permissions, navigate automatically or expose raw
exception details. This feature does not read the user's existing clipboard.

- Given a browser denies/rejects the write, when the attempt ends, then the
  page reports failure and points to the existing manual route.
- Given clipboard writing is absent or unavailable, when the action is
  activated, then the same manual route is explained without an uncaught error.
- Given either failure outcome, then existing controls remain usable and no
  success message from an earlier attempt remains.

### FR-004 — Allow repeat attempts with current feedback

After success or failure, a new explicit activation can try again. Starting a
new attempt replaces earlier success/error feedback with pending feedback;
the settled outcome of that attempt determines the message. Settled feedback
remains until another attempt or page reload. Reload starts idle.

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
  390px-wide viewport they cause no horizontal overflow or clipped message.
- Given light or dark theme and idle, pending, success or error state, then an
  automated accessibility audit of the copy control/status and surrounding
  "Project links" region reports no detected violations of its applicable WCAG
  2.1 level A/AA rules. Each state must actually be exercised; an idle-only scan
  is insufficient. Detected violations fail verification and cannot be hidden
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

- The owner requested replacing mandatory manual screen-reader verification
  with automated checks. This request scopes the proposal; the spec-only merge
  records approval of the exact revised contract before implementation.
- The public stable URL and English action label follow the existing project
  links. No broader localization change is included.
- Persistent feedback without timed dismissal is the proposed small-pilot
  default. Theme changes preserve it; reload resets it.
- Target automated browser remains the repository's current Chromium setup;
  other browsers receive the defined unsupported/rejected handling.
- Open scope/acceptance questions: none remaining in this proposal. The stated
  defaults are explicit owner-review choices; changes to them revise this spec.

## Acceptance and planned verification

Copy-specific tests and delivery evidence already exist in #97/#98, including
keyboard/focus checks and manual visual/contrast inspection. The proposed audit
coverage is new and has not been implemented or run. The separate implementation
issue/PR must map every row to actual test paths/cases and results, distinguishing
retained evidence from newly executed checks. PR #100 separately repairs the
existing no-JavaScript test harness; this revision does not substitute for it.

| Requirement ID | Acceptance scenario                                                        | Planned check and expected outcome                                                                                                                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001         | Exact URL, explicit action, no navigation; same stable target on a preview | Chromium test with permitted clipboard writes and exact clipboard readback performed by the test harness; component test verifies fixed target and no write on load/theme changes                                                                                                                             |
| FR-002         | Pending does not claim success or permit overlapping attempts              | Component test with a controlled unresolved write; settle it to success; browser check confirms other controls remain usable                                                                                                                                                                                  |
| FR-003         | Rejected or missing write capability gives truthful manual recovery        | Component and browser cases simulate rejection and unavailable capability; visible error/manual guidance, no stale success or uncaught exception                                                                                                                                                              |
| FR-004         | Failure→success, success→failure and reload reset                          | Controlled attempt-sequence tests plus browser reload check; only current outcome appears and reload does not copy                                                                                                                                                                                            |
| FR-005         | Mouse/Enter/Space, focus/status semantics, themes/mobile                   | Browser checks for tab order, keyboard activation, retained focus and polite/atomic status semantics; automated WCAG 2.1 A/AA audit of Project links in both themes/all four states; visual contrast/mobile evidence retained; real screen-reader output explicitly not tested unless optional session exists |
| FR-006         | Existing journeys, no-JS links and static build                            | Existing home/FAQ/theme regression suite extended as needed; no-JS browser check for usable links/no success; required production export succeeds                                                                                                                                                             |

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

Original #95/#96: FR-001–FR-006 introduced the fixed stable target, existing
manual recovery route and untimed feedback.

Revision #101: FR-005 acceptance changes at the owner's request. Replace the
mandatory manual real screen-reader check with automated keyboard/focus/status
verification and a scoped audit in both themes/all four states. Clarify status
semantics without claiming audible interoperability. FR-001–FR-004 and FR-006
remain unchanged; no IDs are added, retired or reused, and no interaction/theme
behavior changes. Preserve the original "not performed" screen-reader history;
do not retrospectively mark it passed or certify accessibility.

The follow-up implementation chooses compatible development-only audit tooling
and records real results after this revision is owner-merged. Current #98 evidence
does not prove the new audit passed. This acceptance-policy revision documents
spec maintenance; it does not count as the epic's planned later user-visible
behavior change. No global SDD contract or other feature's manual criteria change.

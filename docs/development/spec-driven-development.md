# Spec Driven Development working contract

This is the operating contract for epic #90. The [roadmap](spec-driven-development-roadmap.md)
records research and rollout rationale. AGENTS.md and the existing ADRs remain
the project rules; this contract does not create a second constitution.

## Choose the task route

| Route          | When to use it                                                                                                    | Before implementation                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Specification  | New or changed intended application/delivery behavior                                                             | One scoped spec issue and spec-only PR; resolve acceptance/scope questions; owner merges the spec as explicit approval                               |
| Implementation | Deliver an approved specification                                                                                 | Separate issue referencing spec path, approval PR and full approval merge SHA; scope must match that revision                                        |
| Maintenance    | Restore agreed behavior, routine updates, editorial/process maintenance with no new application/delivery behavior | State why no behavior contract changes, reference an existing spec if applicable, define observable verification and out-of-scope items in the issue |

Process adoption such as templates/documentation can use maintenance. A new
credential boundary, changed deployment behavior or new user interaction needs
the specification route. Do not relabel behavior changes to avoid approval.
Dependabot PRs retain their existing generated task record and reviewed update
path; do not require a speculative feature spec for a routine package update.
If an update changes intended behavior, establish and approve that change first.

Legacy features do not need bulk backfilling. A fix in an area without a spec
can use reproduction, evidence of established behavior and a regression test.
If expected behavior is undecided, resolve it through a spec rather than invent
it. Issue #82 remains dependency maintenance, not a request for a product spec.

## Specification artifacts

Create `docs/specs/<feature>/spec.md` only for the area being changed, starting
from [the spec template](../specs/templates/spec.md). Describe outcomes rather
than CSS/component choices. Give requirements stable IDs within that feature,
concrete Given/When/Then scenarios and meaningful edge/failure cases. Separate
assumptions from unanswered questions; unresolved scope/acceptance questions
block approval. Fill relevant accessibility, security, compatibility and
performance constraints, or explain why a section is not applicable.

After approval, [plan.md](../specs/templates/plan.md) records technical choices
and [tasks.md](../specs/templates/tasks.md) records the small work breakdown in
the feature directory. Keep them short; add separate contracts/data models only
when needed. They may evolve within the approved scope without another human
decision. Consequential architectural changes still require an ADR.

No SDD CLI, new test runtime or CI spec gate is introduced. Markdown, GitHub,
Vitest and Playwright are the initial tools.

## Approval and lifecycle evidence

| State       | Required evidence                                                                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft       | Proposal not yet approved, or behavior revised since its previous approval; no authority to implement the revised behavior                                            |
| Approved    | Owner merged a spec-only PR explicitly presented as the behavioral approval; issue/implementation PR reference that PR, full merge SHA and spec path                  |
| Implemented | Implementation was human-merged and the exact merge commit passed CI and stable DEV smoke checks; record run links and any required feature/manual acceptance results |

The state is derived from evidence, not an author-edited status label. A merge
of a general roadmap or a mixed code/spec PR does not substitute for the
spec-only behavioral approval. The current GitHub ruleset's zero required
approving reviews does not enforce this contract automatically. Agents must
verify the approval evidence and leave merges to the owner.

The spec proposal contains its spec issue and review purpose. It does not
contain its own future merge SHA. After merge, the agent records the approval
PR and its actual full merge SHA in the separate implementation issue/PR; use
that immutable Git revision when reading the spec. Confirm its path/content
still matches current main before implementing. If main carries a newer
approved revision for that feature, use that revision; if the changed behavior
has no approval, restore/obtain alignment before implementation.

A spec-only PR closes only its specification issue. It includes no application
implementation and retains the ordinary CI gates. Technical spikes must be
separately scoped and must not be reported as approved feature delivery.
An implementation PR closes only its implementation issue. The parent epic
remains open until its own completion criteria are met.

After implementation merge, put the final commit/run evidence in the existing
implementation issue or PR record. This avoids a circular demand to commit an
unknown future delivery SHA into the code being delivered or create a second
PR for the same issue. Report an implementation as pending while its DEV checks
are still running. Spec approval never means the feature is already deployed.

## Verification and completion

Every acceptance requirement maps to a scenario and an appropriate planned
check. The implementation PR identifies requirement IDs, actual test cases,
commands and results. Use full paths plus test names or run links so another
reviewer can locate the evidence. An ID in a test title does not prove coverage.
Manually checked outcomes are labeled manual; blocked/unrun checks stay visible.

For new user-facing behavior, run `pnpm format` and `pnpm check:pr` before
opening the implementation PR. For documentation/process-only work, run
`pnpm format`, `pnpm check` and relevant template/link validation. Keep required
`quality`, `browser` and `secret-scan` and advisory audit triage intact. Spec,
code and tests must agree; an AI consistency review is advisory, not approval.

The owner tests the current-commit PR preview and reviews the change. After
human merge, verified main CI triggers stable DEV and smoke checking. Distinguish
PR CI, deployed smoke/theme coverage and any additional feature-specific remote
or manual checks; none may be claimed from an unrun test.

## Changes after approval

Behavior changes first revise the living spec in a new spec issue/PR, preserving
existing IDs and marking added/changed/removed requirements. Keep removed IDs
as a short retirement note; do not reuse them for unrelated meanings. Resolve
new acceptance questions and obtain owner approval before implementing those
changes in a separate issue/PR. Git preserves older revisions and decisions.

Implementation discoveries that only change internal design update plan/tasks
and tests within scope. A discovery that changes the intended outcome requires
spec revision; continue independent authorized work while that decision is
pending. Do not rewrite expected results merely to match faulty code.

For maintenance, the issue and PR need a short explanation of unchanged
behavior, affected area/spec (or legacy evidence), verification and exclusions.
No empty spec/plan/tasks files are required. A behavior-restoring UI fix still
requires the existing browser gate and meaningful regression coverage.

## First pilot

The owner chooses a small new useful feature next. Create its spec issue/PR,
obtain approval, then create its implementation issue/PR. Record unresolved
questions, rework, required steering and review effort. Follow with one small
spec-first behavior change before evaluating optional automation. No pilot is
chosen or implemented by the working-contract change itself.

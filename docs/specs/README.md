# Feature specifications

Use the [SDD working contract](../development/spec-driven-development.md) for
new/changed intended behavior. This directory contains templates now; create
feature directories only for real scoped work. Existing features need no bulk
backfill.

- [spec.md template](templates/spec.md): behavior, requirements, examples and planned verification; submit separately for owner approval.
- [plan.md template](templates/plan.md): technical decisions derived from the approved revision.
- [tasks.md template](templates/tasks.md): implementation checklist and requirement/test mapping.

Approval and delivery states are derived from GitHub evidence, not from copied
template text. Keep the approval merge SHA in the implementation issue/PR,
not in the spec revision that is awaiting that merge.

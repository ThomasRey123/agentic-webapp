# Feature specifications

Use the [SDD working contract](../development/spec-driven-development.md) for
new/changed intended behavior. This directory contains templates and the delivered copy-link pilot; create
feature directories only for real scoped work. Existing features need no bulk
backfill.

- [spec.md template](templates/spec.md): behavior, requirements, examples and planned verification; submit separately for owner approval.
- [plan.md template](templates/plan.md): technical decisions derived from the approved revision.
- [tasks.md template](templates/tasks.md): implementation checklist and requirement/test mapping.

Approval and delivery states are derived from GitHub evidence, not from copied
template text. Keep the approval merge SHA in the implementation issue/PR,
not in the spec revision that is awaiting that merge.

## Feature proposals and contracts

- [Copy the stable DEV link](copy-dev-link/spec.md): original approval #96
  (`a4a06bd880135436f5b2856a361c1c59b191d10d`), revised FR-005 approval #102
  (`6ddf92ca36d183cca0634237b2800689911172af`). Application #98, harness repair
  #100 and automated acceptance #104 are owner-merged. Latest delivery #104:
  `c5755b0a4177cedc9e46253d50312bcbec3a34a2`, main CI/DEV successful; 19/19
  deployed browser cases passed. [Plan](copy-dev-link/plan.md) and
  [tasks/evidence](copy-dev-link/tasks.md) record scoped audit limits, six
  incomplete contrast checks and optional untested real-reader output.
  Next: a separately approved visible behavior change; see
  [worker handoff](../development/worker-handoff.md). Spec approval and delivery
  remain separate states even though both are evidenced for this pilot.

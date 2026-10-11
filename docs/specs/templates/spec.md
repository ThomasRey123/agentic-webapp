# Specification: <feature>

**Specification issue:** <issue link>
**Review purpose:** Behavioral proposal for owner approval; not delivery evidence.
**Related existing specification:** <path/revision, or none>

Copy to `docs/specs/<feature>/spec.md` and replace placeholders. See the
[working contract](../../development/spec-driven-development.md). Approval and
delivery evidence will be recorded in the separate implementation issue/PR;
do not insert a made-up future merge SHA or self-approve this proposal.

## Goal and users

<Who needs this change and what observable outcome helps them?>

## Scope and non-goals

- In scope: <bounded behavior>
- Out of scope: <explicit exclusions>

## Current and proposed behavior

<Describe the relevant current behavior and what changes. No full app inventory.>

## Requirements and scenarios

### FR-001 — <observable requirement>

The system must <specific observable result>.

- Given <starting condition>, when <action/event>, then <observable result>.
- Given <relevant edge/failure condition>, when <action/event>, then <expected handling>.

<Add only needed requirements. IDs are stable within this feature; note IDs
that are retired instead of assigning them to different behavior. For a revision,
identify which requirements are added, changed, unchanged or retired.>

## Constraints

- Accessibility: <keyboard, focus, names and other relevant requirements>
- Security/privacy: <untrusted inputs, sensitive data and relevant boundaries>
- Compatibility: <existing journeys and static-export constraints>
- Performance: <a measurable requirement and test basis, or why not applicable>

## Assumptions and open questions

- Assumptions: <reasonable defaults and their basis>
- Open questions: <scope/acceptance decisions requiring resolution, or explicitly none>

Resolve scope/acceptance questions before seeking approval. Record their answers
in the relevant requirements; do not leave contradictory temporary notes.

## Acceptance and planned verification

| Requirement ID | Acceptance scenario | Planned check and expected outcome                            |
| -------------- | ------------------- | ------------------------------------------------------------- |
| FR-001         | <scenario above>    | <unit/browser/manual check that observes the required result> |

Cover every acceptance requirement. A planned test is not a passed test. Mark
manual checks explicitly; implementation evidence later names actual test
cases/commands/run links and reports failed, blocked or unrun checks honestly.

## Change and decision notes

<Brief rationale for significant scope choices, previous spec approval references
and added/changed/retired requirements; write none when not applicable.>

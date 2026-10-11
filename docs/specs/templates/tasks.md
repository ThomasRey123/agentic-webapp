# Tasks: <feature>

**Implementation issue:** <issue link>
**Specification baseline:** <spec path, owner approval PR and full merge SHA>

Derive a small checklist from the approved specification and technical plan.
Update it within scope as implementation progresses. Do not check an item as
done unless its evidence exists; behavior changes return to spec approval.

- [ ] Map acceptance requirements to meaningful tests and existing regressions.
- [ ] Implement <bounded task and covered requirement IDs>.
- [ ] Run `pnpm format` and the applicable local gate; record exact results.
- [ ] Open the one implementation PR with requirement/test traceability and risks.
- [ ] Confirm independent CI and the current-commit preview; leave merge to owner.

## Requirement evidence

| Requirement ID | Actual test path/name or explicit manual check | Result and evidence                                                |
| -------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| <FR-001>       | <locatable check>                              | <pending / passed / failed / blocked / unrun; command or run link> |

After human merge, append final merge/CI/DEV evidence to the existing issue/PR
record. Do not claim final DEV success in this pre-merge checklist. The
implementation lifecycle is complete only when that required delivery evidence
and applicable acceptance checks exist.

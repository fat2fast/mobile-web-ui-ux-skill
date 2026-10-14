# Mobile UX decision record

Use one short record per consequential UX choice. Read the applicable [playbook](../SKILL.md) and distinguish the quality of a proposed decision from a verified implementation result.

| Field | Required content |
| --- | --- |
| Evidence | Observed symptom with artifact and `PASS`/`FAIL`, or `INFERRED`/`NOT RUN` with source and limit |
| Mobile task | User goal, route, context, and constraints |
| Candidates | At least two feasible patterns, including status quo when appropriate |
| Selected | Pattern and task-based reason |
| Rejected | Alternative and concrete reason it fits less well here |
| Preserved | Routes/Back/deep links, permissions, domain data, actions, desktop, keyboard/focus/zoom as relevant |
| Verify | Steps, browser/device/viewport, expected observable result, and evidence status |

Do not ask a non-designer to choose pattern terminology when the task and repository provide enough context. Ask only for a missing business priority, irreversible or high-risk decision, or contradictory repository evidence. Name uncertainty and select a reversible option when safe. Multiple choices can be valid; explain trade-offs rather than scoring a keyword.

`PASS` means a check ran and met its assertion. `INFERRED` means reasoned from source or design review. `NOT RUN` means the behavior was not checked. A good decision record is not evidence that the proposed UI was implemented or improved. The [evidence template](../evals/evidence-template.md) records executed checks.

# Report Template

Write a concise, readable report after audit/change/verification.

```markdown
## Mobile UX summary
- Main user task(s): ...
- Observed problem(s): ...
- Context / assumption(s): ...

## Decisions
Use the [decision contract](decision-contract.md) for each consequential choice: Evidence (`PASS`/`FAIL`/`INFERRED`/`NOT RUN`), Mobile task, Candidates, Selected + why, Rejected + why, Preserved, Verify. Summarize a few choices here without dropping rejected alternatives or preservation.

## Changes (omit for audit-only)
- `path/to/file` — ...

## Verification
- PASS — ... (tool/device and viewport)
- FAIL — ...
- NOT RUN — ... (reason and suggested manual check)

## Remaining risks / next steps
- ...
```

Never mark a check PASS unless actually executed or directly observed. Avoid unexplained terminology and fabricated before/after gains.

For recommendation or audit-only requests, keep the response to the decision, one viable alternative, preserved behavior and verification steps. Include implementation code only when requested or necessary to explain the decision; label untested examples as examples.

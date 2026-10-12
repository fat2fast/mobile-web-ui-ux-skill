# Report Template

Write a concise, readable report after audit/change/verification.

```markdown
## Mobile UX summary
- Main user task(s): ...
- Observed problem(s): ...
- Context / assumption(s): ...

## Decisions
| Issue | Mobile UX improvement | Why it fits | Preserved behavior |
|---|---|---|---|
| ... | ... | ... | ... |

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

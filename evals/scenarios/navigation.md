# Scenario C — Responsive Menu vs Usable Navigation

Status: source-owned contract authored before implementation; execution pending.

## Outcome and constraints

Overview → Tasks → task detail → edit/save → browser Back returns to the prior task list and its search context. Preserve direct URLs, active location, all permitted destinations and desktop sidebar. Baseline hides every mobile destination in a long menu with weak visual active state. Candidate exposes Overview and Tasks, groups occasional destinations under More destinations. Their frequency is an evaluation assumption, not measured user research. No twelve-icon bottom bar.

## Frozen local evaluation contract

Twelve registry routes: `/overview`, `/tasks`, `/projects`, `/inbox`, `/calendar`, `/documents`, `/reports`, `/team`, `/time`, `/billing`, `/settings`, `/admin`. Each has a named usable landing, purpose and Tasks link. Billing and Administration require editor; other destinations allow both viewer and editor. `?role=viewer|editor` selects local evaluation capability, default editor. This is not production authentication or server authorization. Direct restricted routes and edit routes render Access restricted, never the editor form; hiding links alone is insufficient.

Task records: TASK-01, “Warehouse handover checklist — distinguishing suffix North”, Open; TASK-02, “Procurement review — distinguishing suffix South”, In progress. Detail `/tasks/TASK-01`; editor `/tasks/TASK-01/edit`. Status accepts Open, In progress, Done. Save requires nonblank title, preserves exact entered text and updates actual in-memory title/status. Cancel discards draft. Save entered from detail uses browser history Back to the detail; direct edit load replaces the edit URL with detail. Subsequent browser Back returns to the prior list/search and overview. Search is case insensitive across ID/title and lives in `/tasks?q=...`. No invented eligibility, backend, stock, loading or roles beyond this contract.

Role query survives links/history. Refresh/deep links load the requested route, reset data to the two original records and reapply the role guard. No persistence after reload. Unknown IDs/routes render Not found with Tasks recovery. Navigation route changes focus the primary heading. Mobile menu is a modal dialog: Escape/close/backdrop closes it and returns focus; desktop resize closes it. Candidate active link has aria-current=page and visible emphasis; task detail/edit belong to Tasks.

## Validation and evidence

Required widths 320/390/1280: workflow/save/Back, exact values, list context, secondary destination, editor/viewer direct guard, deep-link refresh, active state, keyboard menu and focus return, desktop sidebar and no document overflow. Pair shares data/app source byte-for-byte, separate navigation components and mobile styles. Ports baseline4185/candidate4186, strict. No production security, real-device or skill superiority claim.

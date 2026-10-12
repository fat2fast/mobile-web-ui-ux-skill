# Decision Playbook: Mobile Tables & Dense Data

## Trigger

Users struggle to read important records or operate row actions on a phone; a data table creates overflow or tiny text.

## Diagnose

- Is the table for quick scanning, record selection, side-by-side comparison, or bulk manipulation?
- Which fields are essential to identify a record? Which fields are mandatory for the task?
- Can users sort, filter, select multiple rows or export? These capabilities must not silently disappear.
- Are identifiers/currency/statuses meaningful when truncated?

## Choose a pattern

| Conditions | Candidate | Reject when |
| --- | --- | --- |
| Scan individual entities, few priority fields | Record list/cards with detail disclosure | Side-by-side comparison or dense bulk editing is central |
| Tabular comparison is essential | Focused horizontal scrolling + sticky identifiers if justified | Scrolling hides the row context and actions |
| Many columns, limited primary mobile fields | Priority columns + accessible details view | Hidden fields cannot be retrieved |
| Filter-heavy workflow | Compact filter UI with visible active filters and reset | Filter state becomes invisible or hard to edit |
| Bulk operations matter | Mobile selection mode with persistent clear affordances | Accidental selections or actions cannot be reversed |

## Guardrails

- Preserve access to all essential fields, sorting/filtering and permitted actions.
- Ensure data label/value association remains clear to assistive technology.
- Preserve accessible semantics or add an accessible equivalent when switching table markup to cards.
- Keep money, dates and identifiers readable and correctly formatted.
- Do not hide columns solely based on breakpoints without user-task reasoning.

## Example decision

**Before:** Eight-column orders table at 390px with a barely visible action button.

**Option:** Mobile order list displays order number, status, customer and total, with an obvious details/action entry. Desktop retains the table. Verify filters, record actions and full data remain reachable.

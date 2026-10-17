# Content hierarchy cases

All proposals follow the [decision contract](../../references/decision-contract.md); no improved UI is claimed.

## CONTENT-01 — Long order identifier
- **Evidence:** `INFERRED` scenario: an ID differs only at its suffix.
- **Mobile task:** identify the exact order and copy its ID.
- **Candidates:** wrapping full ID with copy control; ellipsis with full ID in detail.
- **Selected:** wrapping full ID in detail and visible distinguishing suffix in list.
- **Rejected:** ellipsis-only list hides the differentiator and risks wrong action.
- **Preserved:** full ID, accessible name, copy and detail route/Back.
- **Verify:** `NOT RUN`; at 320px and 200% zoom read/copy ID with keyboard and touch.

## CONTENT-02 — Longer locale labels
- **Evidence:** `INFERRED` translated action/field labels can exceed English length.
- **Mobile task:** read filters and submit without guessing.
- **Candidates:** flexible wrapping controls; abbreviations with explanation.
- **Selected:** wrapping labels and reflowing control groups.
- **Rejected:** abbreviation only because meaning is not clear without extra interaction.
- **Preserved:** complete label, filter value, status, focus and desktop locale.
- **Verify:** `NOT RUN`; use long locale strings at 320px, 200% zoom, keyboard traversal.

## CONTENT-03 — Zoomed order details
- **Evidence:** `INFERRED` eight fields may extend beyond one viewport; no zoom run yet.
- **Mobile task:** read amount/status and secondary details at high zoom.
- **Candidates:** summary plus labeled expandable details; fixed context header plus full list.
- **Selected:** summary and expandable optional details if each section has a clear label and keyboard toggle.
- **Rejected:** fixed header because it consumes scarce zoomed viewport height and can cover content.
- **Preserved:** mandatory status/total immediately available, every secondary field on expansion, action and Back.
- **Verify:** `NOT RUN`; at 200%/400% zoom open every section, inspect reflow and focus.

## IMAGE-2 — Notification triage (Visual Reference 2)

- **Evidence:** `INFERRED` visual observation from Case 2: repeated tall notification cards with unread dot, type badges, repetitive body copy, and an ambiguous checkmark icon button. Backend side effects and permissions are unknown.
- **Mobile task:** Rapidly scan notifications on mobile, distinguish unread from read items, and mark an item as handled or open its details.
- **Candidates:** Compact vertical notification feed with explicit action labels; tall individual cards with icon-only buttons (current visual pattern).
- **Selected:** Compact vertical notification feed with clear unread marker, concise title, timestamp, and explicit action semantics (`Mark as read` or `Review`).
- **Rejected:** Tall cards with ambiguous standalone checkmark button, because checkmark icon meaning (mark read vs approve vs accept) is visually ambiguous and prone to misclicks.
- **Preserved:** Read/unread state, notification body, timestamps, link targets, and desktop view. All notification dismissal side effects remain inferred.
- **Verify:** `NOT RUN`; requires real notification backend. Check at 320px/390px for unread indicator clarity and accessible button labels.

## CONTENT-04 — Frequent record triage

- **Evidence/source:** `INFERRED` example grounded in the [order task contract](../../docs/mobile-task-acceptance.md) and [data cases](data-display-cases.md); priorities must be checked against actual handlers/data.
- **Mobile task:** scan a queue, identify an order from existing ID/status/total and use its existing action.
- **Candidates:** compact labeled list with optional details; spaced cards retaining the same data and actions.
- **Acceptable selection:** compact list when scan frequency and repeated metadata dominate; a card can pass when richer per-record context justifies space. Map required ID/status/total → existing action → customer/date → optional details → critical status, without inventing eligibility.
- **Counterexample:** tall repetitive cards that bury the action, or removing exact amount/unit/identity to fit the screen. Reject a table only when this task requires individual-record action without sideways scrolling, not by width alone.
- **Preserved:** handler eligibility for all existing statuses, exact data, accessible labels, details/Back and desktop table.
- **Verify:** `NOT RUN` for this new decision case; inspect source ownership, then check 320/390px scan/action, long labels, independent 200% text resize and desktop. Historical fixture checks are not a replay of this rule revision.

## CONTENT-05 — Aligned attribute comparison

- **Evidence/source:** `INFERRED` [comparison scenario](../../docs/comparison-scenario.md), opposite task to CONTENT-04.
- **Mobile task:** compare exact prices/units/specifications across products in a shared row context.
- **Candidates:** semantic comparison matrix with contained scrolling; repeated labeled product cards.
- **Acceptable selection:** aligned matrix when cross-column relationships carry meaning. Map required attributes/price/unit → existing compare control → product context → optional specs → availability, using only fields that exist. Keep row identity and header associations reachable.
- **Counterexample:** reusing the triage list for every product or dropping units to eliminate horizontal scrolling. Cards remain viable for browsing, but lose convenient alignment for this task.
- **Preserved:** exact monetary precision, currency, units, availability, selected products, controls, keyboard and desktop.
- **Verify:** `NOT RUN` for this new decision case; inspect full values/headers at narrow widths, keyboard scroll, 200% text resize and effective-320 reflow separately. The two-dimensional exception does not exempt unreadable cell text.

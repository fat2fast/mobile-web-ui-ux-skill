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

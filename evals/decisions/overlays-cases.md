# Overlay cases

Proposals follow the [decision contract](../../references/decision-contract.md).

## OVER-01 — Brief confirmation
- **Evidence:** `INFERRED` scenario; no delete action in fixture.
- **Mobile task:** confirm a consequential action on one named order.
- **Candidates:** small modal dialog; full-page review.
- **Selected:** modal with order ID, Confirm and Cancel for a brief decision.
- **Rejected:** full page adds route/history overhead for a two-choice prompt.
- **Preserved:** authorization, action meaning, Escape/Cancel, focus entry/return, background lock and desktop.
- **Verify:** `NOT RUN`; open, Tab through controls, Escape, reopen/confirm and check focus return on 390px.

## OVER-02 — Medium filter controls
- **Evidence:** `INFERRED` filter-heavy mobile dashboard scenario.
- **Mobile task:** adjust multiple filters, apply or clear them.
- **Candidates:** drawer with visible Filter button; full page with route.
- **Selected:** drawer while filter count is small and applying returns to results.
- **Rejected:** full page can add navigation cost; choose it instead if filters become long or need deep links. A visible Filter button is an alternative to any edge-swipe gesture.
- **Preserved:** filter state, apply/reset, visible active filters, Close/Cancel/Back, focus return and desktop.
- **Verify:** `NOT RUN`; touch and keyboard open, change, cancel, apply, scroll lock and focus at 390px.

## OVER-03 — Long form
- **Evidence:** `PASS` baseline form has eight fields and server recovery; keyboard interaction `NOT RUN` ([result](../results/form-baseline.md)).
- **Mobile task:** complete and correct a long request form.
- **Candidates:** full page with URL; tall bottom sheet with scroll and keyboard handling.
- **Selected:** full page because it offers room, Back/deep link and predictable keyboard scroll.
- **Rejected:** bottom sheet because nested scrolling and keyboard shrink its working area for eight fields.
- **Preserved:** all values, validation, server response, focus, Cancel/Back, zoom and desktop.
- **Verify:** `NOT RUN` proposal; replay invalid/valid requests and physical keyboard, then Back and direct URL.

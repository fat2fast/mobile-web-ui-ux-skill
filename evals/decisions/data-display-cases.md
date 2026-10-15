# Data display decision cases

Records follow the [decision contract](../../references/decision-contract.md). Chosen patterns are proposals, not implementation results.

## DATA-01 — Find one order

- **Evidence:** `FAIL` 1080px table in 390px viewport; `PASS` existing search, detail, action and Back in [baseline](../results/order-dashboard-baseline.md).
- **Mobile task:** locate order `ORD-1001`, inspect status/total and act.
- **Candidates:** labeled record list with detail; horizontal table; unlabeled cards.
- **Selected:** mobile list with identity, status, customer and total visible; detail exposes date/items/channel/city and action. Desktop retains table.
- **Rejected:** unchanged horizontal table because row context and action require long scrolling for this scan task.
- **Preserved:** ID, all fields and units, sort/filter/reset/export, selection/bulk follow-up, row action, route/Back and desktop table.
- **Verify:** `PASS` baseline behavior at 390px; `NOT RUN` proposed list, bulk selection and accessibility. Check each field/action and keyboard labels after implementation.

## DATA-02 — Compare prices

- **Evidence:** `INFERRED` scenario: users compare feature values across several product columns; no runnable fixture.
- **Mobile task:** compare price, limits and warranty side by side.
- **Candidates:** horizontally scrollable comparison table with persistent row labels; independent cards; one-product detail.
- **Selected:** table because alignment across products is the task; provide scroll cue and row/column identity.
- **Rejected:** cards because repeated feature labels force memory-based comparison and can hide missing values.
- **Preserved:** every product/feature, units, sorting/filtering if available, links, semantics and desktop table; bulk action `N/A`.
- **Verify:** `NOT RUN`; test scroll at 320/390px, keyboard navigation, zoom and screen reader cell association.

## DATA-03 — Bulk order selection

- **Evidence:** `INFERRED` scenario: operators select many rows for a permitted bulk action.
- **Mobile task:** filter, select across pages, inspect count, apply action safely.
- **Candidates:** compact table with selection controls and persistent count; selectable record list with the same count, sort/filter and review step.
- **Selected:** compact table with selection controls because this scenario requires scanning several status/total columns while selecting many records.
- **Rejected:** fully selectable list because repeated labeled values increase scan cost for cross-row comparison here; it remains viable if observation shows individual-record scanning dominates. A list without selection is invalid because it loses the bulk task, not merely a weaker pattern choice.
- **Preserved:** record ID, status and mandatory fields, sort/filter/export, selection across pages, permissions, bulk/row actions, semantics and desktop. In the dashboard fixture, `Follow-up` has no status eligibility restriction: selecting `Delivered` must still work. Any extra restriction or action needs a source-backed product rule.
- **Verify:** `NOT RUN`; select, change filter/page, review count, cancel and act using keyboard/touch. Assert no accidental action.

## IMAGE-1 — Document profile list (Visual Reference 1)

- **Evidence:** `INFERRED` visual observation from Case 1: top action area, missing document chips, multi-column key/value cards with Preview and Download. No production source or runtime behavior is available.
- **Mobile task:** Scan list of uploaded profile documents, identify missing mandatory items, and preview or download a document on mobile.
- **Candidates:** Dense vertical record list with prominent title and status plus detail route; multi-column key/value cards (current visual pattern).
- **Selected:** Dense vertical record list with document title prominent, status second, one concise metadata line, and direct Preview/Download actions. Missing document summary kept as priority callout above list.
- **Rejected:** Large multi-column cards because empty date labels consume excessive space and push records off-screen on phones.
- **Preserved:** Document titles, dates, file metadata, Preview/Download handlers, search/filter controls, and desktop layout. All backend rules and permissions remain inferred.
- **Verify:** `NOT RUN`; requires real document API and file viewer. Check at 320px/390px for title legibility and direct download touch target.
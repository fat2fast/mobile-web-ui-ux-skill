# Navigation decision cases

Records follow the [decision contract](../../references/decision-contract.md). These are decision reviews (`INFERRED`) unless an explicit browser observation is cited; they do not claim a redesigned UI passed.

## NAV-01 — Dense admin dashboard

- **Evidence:** `FAIL` baseline 390px sidebar uses 100px and table is hard to scan ([observation](../results/order-dashboard-baseline.md)); task switching frequency is `INFERRED`.
- **Mobile task:** find order, open detail, follow up, Back in `/orders`.
- **Candidates:** compact grouped menu with visible Orders entry; bottom navigation; retain narrow sidebar.
- **Selected:** compact menu plus visible Orders entry, because report/settings are secondary and sidebar consumes scarce width.
- **Rejected:** bottom navigation because three visible fixture routes do not establish three equally frequent peer tasks; it would compete with form-like bottom actions in a larger admin app.
- **Preserved:** `/orders`, `/orders/:id`, browser Back, deep link, all existing destinations, desktop sidebar, real app permissions if present.
- **Verify:** `PASS` baseline detail and Back in Chromium at 390px; `NOT RUN` candidate implementation, active state and real permission roles. Open detail directly and replay Back before release.

## NAV-02 — Ecommerce browsing

- **Evidence:** `INFERRED` scenario: catalog, search, cart and account are stable peer destinations used repeatedly; no fixture exists.
- **Mobile task:** browse catalog, inspect product and return, then open cart.
- **Candidates:** bottom navigation with links; grouped menu; local product tabs.
- **Selected:** bottom navigation for high-frequency peers if usage confirms them; product detail remains a route with explicit Back.
- **Rejected:** local tabs for unrelated global destinations; they imply one section and can obscure URL semantics.
- **Preserved:** product/cart deep links, Back, cart state, access-controlled account content and desktop header.
- **Verify:** `NOT RUN`; test direct product URL, Back, selected state, keyboard traversal and cart persistence in a real app.

## NAV-03 — Frequent order triage

- **Evidence:** `INFERRED` scenario: operators repeatedly alternate queue, assigned and completed views inside Orders.
- **Mobile task:** switch queue views without losing filters or selection.
- **Candidates:** local tabs within Orders; bottom navigation; nested drawer.
- **Selected:** local tabs for three sibling views; expose active state and stable URLs/query state.
- **Rejected:** bottom navigation because queue views are local, and global destinations would lose their hierarchy.
- **Preserved:** Back, direct filtered URL, permissions on assigned work, filters, selection policy and desktop navigation.
- **Verify:** `NOT RUN`; replay tab → detail → Back and deep link per role; assert filter state and focus.

## IMAGE-3 — Enterprise drawer navigation (Visual Reference 3)

- **Evidence:** `INFERRED` visual observation from Case 3: multi-level navigation drawer with numerous expanded sections and vertical gaps. Route structure and auth permissions are unknown.
- **Mobile task:** Navigate to target workspace sections on mobile and easily dismiss the menu.
- **Candidates:** Collapsible mobile drawer with progressive disclosure; universal bottom navigation bar.
- **Selected:** Collapsible mobile drawer with clear close affordance, focus management, and progressive disclosure for deep hierarchies.
- **Rejected:** Bottom navigation bar because 8+ multi-level enterprise sections cannot fit in 4-5 bottom tabs without omitting essential routes.
- **Preserved:** All navigation destinations, route hierarchy, escape/close handlers, and desktop sidebar.
- **Verify:** `NOT RUN`; requires full routing application. Test drawer open, dismiss, keyboard focus trap, and touch scrolling at 320px/390px.
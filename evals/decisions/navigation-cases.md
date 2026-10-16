# Navigation decision cases

Records follow the [decision contract](../../references/decision-contract.md). These are decision reviews (`INFERRED`) unless an explicit browser observation is cited; they do not claim a redesigned UI passed.

**Task-first local run provenance:** `local-20261016-release`, base SHA `b70877d54ba895d1864d284fb3a3affb34e63a2a`, dirty working tree. The executed 34-spec JSON is at `plans/mobile-web-ui-ux-next-implementation-2026-10-16/reports/local-task-ux-release-run/test-results.json`; scope and limits are in [task UX evidence](../../tests/reports/task-ux-evidence.md). This is not clean-commit CI evidence.

## NAV-01 — Dense admin dashboard

- **Evidence:** `FAIL` baseline 390px sidebar uses 100px and table is hard to scan ([observation](../results/order-dashboard-baseline.md)); task switching frequency is `INFERRED`.
- **Mobile task:** find order, open detail, follow up, Back in `/orders`.
- **Candidates:** compact grouped menu with visible Orders entry; bottom navigation; retain narrow sidebar.
- **Selected:** compact menu plus visible Orders entry, because report/settings are secondary and sidebar consumes scarce width.
- **Rejected:** bottom navigation because three visible fixture routes do not establish three equally frequent peer tasks; it would compete with form-like bottom actions in a larger admin app.
- **Preserved:** `/orders`, `/orders/:id`, browser Back, deep link, all existing destinations, desktop sidebar, real app permissions if present.
- **Verify:** `PASS` task-first Chromium checks in `tests/task-ux/order.spec.cjs` at 320–1023px cover route access, Escape, backdrop, focus return, resizing and Back. Physical touch, real permission roles and human discoverability remain `NOT RUN`.

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
## NAV-04 — Tablet boundary and preserved desktop sidebar

- **Evidence:** `PASS` local task-first order checks exercise menu routes at 600/601/767/768/1023px, resize from 390 to 1280px and desktop navigation. Choosing 1024px as the best breakpoint is `INFERRED`; retained-sidebar usability near the boundary was not compared.
- **Mobile task:** keep the order list wide enough for actions while retaining route access through tablet widths.
- **Candidates:** keep a persistent sidebar; use a compact header and dismissible menu below the width where content becomes cramped.
- **Selected:** header/menu below 1024px in this fixture as a reversible choice; measure the real content/task at the boundary before transferring that cutoff.
- **Rejected:** retaining the 80px sidebar at 320px because it reduced card space. A spacious tablet or desktop product may keep a sidebar.
- **Preserved:** Orders/Reports/Settings URLs, direct detail and Back, ten-column desktop table.
- **Verify:** `PASS` local automated menu/overflow and resize checks in the run above; `NOT RUN` comparative sidebar usability near 1024px, physical tablet, zoom and translated labels.

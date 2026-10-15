# Scenario A — Dense Order Dashboard

**Status:** Runnable baseline at [order dashboard](../fixtures/order-dashboard/README.md). Task-first implementation under development. Historical retrofit tests at [tests/261015-retrofit/](../../tests/261015-retrofit/).

## 1. Scenario Metadata & Actor Contract

- **Actor:** Operations triage specialist managing incoming and in-flight customer orders on mobile.
- **Goal:** Locate an order quickly, inspect its status and total, and trigger the appropriate follow-up action or view full order details without horizontal panning.
- **Starting Route:** \/orders\ (with direct deep-link fallback to \/orders/:id\).
- **Target Mobile Viewports:** 320 CSS px (compact mobile, e.g. iPhone SE) and 390 CSS px (standard mobile).
- **Primary Mobile Task Requirement:** Order identity (\id\), status badge (\status\), total amount (\	otal\), and the primary record follow-up action must be fully visible and operable at 320px and 390px widths with **zero horizontal scrolling required** (\scrollWidth <= clientWidth\ on primary action container).

---

## 2. Priority Data & Functional Actions

### High-Priority Mobile Surface (Visible immediately on card/row)
- **Identity:** Order ID (e.g. \ORD-1001\) formatted as an accessible navigation link to detail.
- **Customer:** Customer name (e.g. \Lan Nguyen\).
- **Status:** Status badge with distinct text/styling (\Pending\, \Shipped\, \Delivered\).
- **Total:** Order amount (e.g. $125.00\).
- **Record Action:** Follow-up button triggering instant feedback confirmation.
- **Selection Affordance:** Explicit checkbox for multi-record selection.

### Secondary Details (Reachable via detail route \/orders/:id\)
- Order date, item count, sales channel (\Web\, \Partner\), city (\Hanoi\, \Da Nang\, \HCMC\, \Hue\).
- Full key/value definition list with 'Back to orders' navigation.

---

## 3. Preserved Invariants (Inherited from Fixture Code)

Every capability in \vals/fixtures/order-dashboard/src/main.jsx\ must remain fully functional:
1. **Search:** Text input filtering both Order ID and Customer name simultaneously (e.g. \ORD-1001\ or \Minh\).
2. **Status Filter:** Select dropdown with options: \All\, \Pending\, \Shipped\, \Delivered\.
3. **Sort Order:** Select dropdown supporting sort by ID, Customer name, and Date.
4. **Reset Filters:** Button resetting search query to \''\ and filter to \All\.
5. **CSV Export:** 'Export visible' downloads \orders.csv\ matching exactly the currently filtered records.
6. **Selection Persistence:** Multi-selection persists across filter changes; bulk button displays active count: \Follow-up selected (N)\.
7. **Action Eligibility:** Delivered orders (\ORD-1004\) retain follow-up capability exactly as coded in fixture.
8. **Navigation & Deep Linking:** Direct URL access to \/orders/ORD-1001\ with functional fallback to \/orders\; browser Back/Forward restores previous view state.
9. **Desktop Table Preservation:** On viewport widths >= 1024px, the full multi-column table layout with 10 columns (Select, ID, Customer, Status, Total, Date, Items, Channel, City, Action) remains rendered and intact.

---

## 4. Alternative Patterns Considered

- **Pattern 1: Horizontally scrolling table with pinned columns:**
  - *Evaluation:* Retains 1:1 tabular DOM structure, but requires horizontal panning to reach actions and secondary fields on small screens. High friction for single-record triage.
- **Pattern 2: Task-first mobile record list / cards (Selected for Mobile):**
  - *Evaluation:* Adapts record presentation vertically for screens < 768px. Identity, status, total, and action are in immediate view without sideways scroll. Full metadata remains one tap away in detail view. On desktop, switches back to full table.

---

## 5. Verification & Acceptance Checks

- **Mobile Viewport 320px & 390px:**
  - Search order: locate \ORD-1001\ and assert zero horizontal overflow on card container.
  - Action trigger: click row follow-up button, assert status announcement \Follow-up recorded for ORD-1001\.
  - Detail journey: click order ID, route updates to \/orders/ORD-1001\, click 'Back to orders', route returns to \/orders\.
  - Filter & Export: filter by \Shipped\, export CSV, verify CSV content matches filtered row.
  - Bulk follow-up: select 3 items, filter to \Pending\, verify selection count persists \(3)\, trigger bulk action.
- **Desktop Viewport 1280px:**
  - Verify \	able\, \	head\, \	body\, and all 10 column headers render normally.

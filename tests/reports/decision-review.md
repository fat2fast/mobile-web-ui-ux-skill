# Mobile UX Decision Review Report

This report evaluates mobile UX pattern choices against the updated [decision contract](../../references/decision-contract.md), verifying task acceptance, pattern justifications, preserved functionality, and bounded evidence.

---

## 1. Summary of Decision Evaluations

| Case Identifier | Scenario / Topic | Decision Result | Rationale Summary |
|---|---|---|---|
| `ORDER-LIST` | Single-Record Order Scan & Triage | `ORDER-LIST | PASS` | Mobile list/cards wins over horizontal table for single-record scan. Eliminates sideways scroll at 320px/390px while preserving desktop table. |
| `COMPARISON-TABLE` | Multi-Entity Aligned Metric Comparison | `COMPARISON-TABLE | PASS` | Semantic horizontally scrolling table wins over cards. Two-dimensional alignment is critical; cards destroy metric comparison. |
| `FORM-CTA` | Submit Button Reachability & Clearance | `FORM-CTA | PASS` | Evaluated by reachability and absence of virtual keyboard occlusion, not by arbitrary CSS `position: static`. In-flow and safe sticky CTA are both valid. |
| `IMAGE-1` | Document / Profile List (Image 1) | `IMAGE-1 | PASS` | Dense vertical list with title prominent and direct download wins over large key/value card. Visual evidence bounded; runtime inferred. |
| `IMAGE-2` | Notification Triage (Image 2) | `IMAGE-2 | PASS` | Compact feed with explicit action labels wins over tall cards with ambiguous standalone checkmark icon. Side effects inferred. |
| `IMAGE-3` | Enterprise Drawer Navigation (Image 3) | `IMAGE-3 | PASS` | Collapsible drawer with progressive disclosure wins over bottom navigation for complex multi-level hierarchy. |
| `IMAGE-4` | Account Popover Overlay (Image 4) | `IMAGE-4 | PASS` | Contained modal/sheet with touch backdrop and focus return wins over unconstrained anchored popover that clips on phones. |
| `IMAGE-5` | Create Request Form (Image 5) | `IMAGE-5 | PASS` | Coherent single-column form with manual+picker dates and touch file browse wins over multi-step wizard and drag-drop. |

---

## 2. Counterexample Detailed Reviews (Task 2.1)

### `ORDER-LIST | PASS` — Dense Order Dashboard
- **Evaluated Task:** Locate order `ORD-1001`, check status/total, and trigger follow-up or view details at 320px and 390px.
- **Pattern Comparison:** Mobile list/card presentation vs unchanged horizontal table.
- **Findings:**
  - In a table layout, reaching row actions requires continuous horizontal panning on mobile viewports.
  - A mobile list layout exposes Order ID, Customer, Status badge, Total amount, and Follow-up action within immediate view (0px horizontal scroll).
  - Secondary attributes (date, items, channel, city) are cleanly accessible via the `/orders/:id` detail route with Back navigation.
  - Multi-select checkboxes and bulk follow-up (`Follow-up selected (N)`) remain fully operational across filters.
  - Desktop view (>= 1024px) retains the full 10-column table.
- **Verdict:** `ORDER-LIST | PASS`.

### `COMPARISON-TABLE | PASS` — Aligned Multi-Entity Comparison
- **Evaluated Task:** Compare cloud server tiers side-by-side across aligned metrics (Price, vCPU, RAM, Storage, Bandwidth, SLA).
- **Pattern Comparison:** Semantic horizontal scrolling table with pinned row headers vs independent vertical cards.
- **Findings:**
  - Decomposing tabular data into cards forces users to memorize numbers across disconnected cards, destroying the comparative task.
  - A semantic horizontal table preserves 2D cell alignment (`<th scope="col">` and `<th scope="row">`).
  - Sticky attribute column keeps row identity visible during horizontal swipe scroll.
  - Visual scroll indicators signal horizontal reachability; keyboard Tab order allows full cell traversal.
- **Verdict:** `COMPARISON-TABLE | PASS`.

### `FORM-CTA | PASS` — Form Submit Reachability
- **Evaluated Task:** Complete and submit a form on mobile without keyboard overlap or control occlusion.
- **Pattern Comparison:** Rigid CSS rule (`position: static`) vs Functional Reachability & Clearance.
- **Findings:**
  - Enforcing `position: static` as a universal requirement is invalid because an accessible sticky bottom bar with safe-area insets and keyboard-aware hiding can provide excellent mobile reachability.
  - What matters is **functional clearance**: Submit button must never obscure active input fields, labels, or become hidden beneath the virtual keyboard.
  - Both in-flow submit buttons and safe sticky bars satisfy mobile UX when clearance is verified.
- **Verdict:** `FORM-CTA | PASS`.

---

## 3. Visual Reference Case Reviews (Task 2.2)

### `IMAGE-1 | PASS` — Document / Profile List
- **Source:** Visual observation of NEXFUL Case 1 (Document / Profile List).
- **Top Task:** Identify missing required documents and preview or download uploaded files on phone.
- **Verdict:** `IMAGE-1 | PASS`. Dense vertical list with title prominent and direct download wins over large multi-column card. Inferred rules preserved.

### `IMAGE-2 | PASS` — Notification Triage
- **Source:** Visual observation of NEXFUL Case 2 (Notification Triage).
- **Top Task:** Rapidly scan notifications, distinguish unread alerts, and mark handled or open details.
- **Verdict:** `IMAGE-2 | PASS`. Compact feed with clear unread marker and explicit action labels wins over tall cards with ambiguous standalone checkmark icon. Side effects inferred.

### `IMAGE-3 | PASS` — Enterprise Drawer Navigation
- **Source:** Visual observation of NEXFUL Case 3 (Enterprise Drawer Navigation).
- **Top Task:** Access nested enterprise sections and easily dismiss the navigation menu.
- **Verdict:** `IMAGE-3 | PASS`. Collapsible drawer with progressive disclosure wins over bottom navigation for complex multi-level hierarchy.

### `IMAGE-4 | PASS` — Account Popover Overlay
- **Source:** Visual observation of NEXFUL Case 4 (Account Popover Overlay).
- **Top Task:** View profile information, switch organizations, or log out on mobile.
- **Verdict:** `IMAGE-4 | PASS`. Contained modal/sheet with touch backdrop and focus return wins over unconstrained anchored popover that clips on phones.

### `IMAGE-5 | PASS` — Create Request Form
- **Source:** Visual observation of NEXFUL Case 5 (Create Request Form).
- **Top Task:** Enter request type, date range, verify computed duration, attach file, and submit without keyboard overlap.
- **Verdict:** `IMAGE-5 | PASS`. Coherent single-column form with manual+picker dates and touch file browse wins over multi-step wizard and drag-drop.

---

## 4. Evidence Boundary & Uncertainty Notice

All evaluations based on the NEXFUL visual cases (`IMAGE-1` through `IMAGE-5`) are strictly visual observations. No backend code, runtime execution, authorization logic, or database constraints have been verified for those surfaces. All such properties remain explicitly cataloged as `INFERRED` or `NOT RUN`.
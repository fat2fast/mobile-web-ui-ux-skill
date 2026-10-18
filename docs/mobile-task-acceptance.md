# Mobile Task Acceptance & Assertion Provenance

## Purpose & Scope

This document defines the acceptance contract for mobile UX improvements in the Mobile Web UI/UX Skill. It separates:
1. **Business and accessibility invariants** (must be preserved across all layouts and screen sizes),
2. **Task-oriented user acceptance** (observable completion of user goals without interface friction like horizontal scrolling on primary actions), and
3. **Pattern-only checks** (implementation-specific assertions that must never be enforced universally).

This contract freezes historical test provenance and governs successor test harnesses for the runnable journeys below. They extend the original Dashboard/Navigation/Form scope; the [original navigation scenario](../evals/scenarios/navigation.md) still needs dedicated executable coverage:
- Dense order management: [evals/scenarios/dashboard.md](../evals/scenarios/dashboard.md)
- Aligned comparison: [docs/comparison-scenario.md](comparison-scenario.md)
- Contextual request/date-range form: [docs/request-form-scenario.md](request-form-scenario.md)

---

## 1. Provenance & Historical Baseline Freeze

The earlier retrofit assertions under `tests/261015-retrofit/` represent historical evidence:
- **Dashboard check script:** `tests/261015-retrofit/dashboard-browser-check.cjs` (artifacts in `tests/261015-retrofit/baseline/` and `tests/261015-retrofit/after/`).
- **Form check script:** `tests/261015-retrofit/form-browser-check.cjs` (artifacts in `tests/261015-retrofit/form-baseline/` and `tests/261015-retrofit/form-after/`).

### Provenance Rules
- **No relabeling:** Historical JSON outputs (`results.json`, `orders-shipped.csv`, `dashboard-a11y.json`, `form-a11y.json`) and PNG screenshots in `tests/261015-retrofit/` remain immutable archives. They will **not** be relabeled or claimed as evidence for new tasks.
- **Dedicated runner & output paths:** Current task journeys run from `tests/task-ux/`. CI writes build manifests, Playwright JSON and screenshots to a fresh runner-temp directory, then uploads them as the `task-ux-evidence` artifact. Checked-in `tests/task-ux/artifacts/` files are historical and are not accepted by the current verifier.
- **Timing distinction:** Execution duration measured in headless automation (`agent-browser` or Playwright) measures automation latency, **never** human task time. Human usability claims require human evaluation or physical device checks, which remain `NOT RUN` until performed.

---

## 2. Inventory of Historical Assertions

Every `record(...)` assertion from both historical test scripts is cataloged below and classified into one of three tiers:
- **`invariant`**: Must be satisfied by any compliant solution regardless of visual layout or viewport width.
- **`task`**: High-level user goal that must succeed on mobile viewports (e.g. at 320px and 390px).
- **`pattern-only`**: Structural check tied to a specific HTML/CSS pattern; invalid as a universal criterion.

### A. Dashboard Assertions (`tests/261015-retrofit/dashboard-browser-check.cjs`)

| Assertion Name | Script Phase | Classification | Rationale & Successor Check |
|---|---|---|---|
| `search order` | baseline & after | `invariant` / `task` | Verifies search filtering logic (`ORD-1001`). Successor: Query accessible search field and check visible record identity. |
| `detail route` | baseline & after | `invariant` | Route navigation to `/orders/ORD-1001` must occur on selecting order. Successor: `page.url()` matches detail path. |
| `detail status` | baseline & after | `invariant` | Detail view must display the order status (`Pending`). Successor: Accessible role/text check in detail view. |
| `detail follow-up` | baseline & after | `invariant` | Clicking follow-up in detail must update feedback status message. Successor: Accessible status announcement check. |
| `browser Back` | baseline & after | `invariant` | Browser back button returns to `/orders` route. Successor: `page.goBack()` verifies URL restored. |
| `status filter` | baseline & after | `invariant` | Filtering by `Shipped` displays only matching order (`ORD-1002`). Successor: Visible record set check. |
| `CSV visible rows` | baseline & after | `invariant` | Export CSV exports exactly currently filtered records. Successor: Downloaded file content verification. |
| `reset filters` | baseline & after | `invariant` | Resetting filters restores full list of 4 orders. Successor: Visible record list count check. |
| `customer sort` | baseline & after | `invariant` | Sorting by Customer reorders records alphabetically. Successor: Order list sequence check. |
| `status and total visible at 390px` | after only | `task` | Critical order metadata (status, total) must be visible in viewport without scrolling. Successor: Viewport boundary check for primary fields. |
| `selection and ID pinned at ${width}px maximum scroll` | after only | `pattern-only` | **`table-pinning`** check requiring specific sticky CSS columns (`.order-table`, `cells[0]`, `cells[1]`) on a scrolling table. When a mobile list or card layout is chosen, table DOM does not exist. Successor: On table pattern only, check sticky header/ID; for list patterns, check persistent selection bar. |
| `row follow-up ORD-1001` | baseline & after | `invariant` / `task` | Direct row action triggers follow-up for specific record. Successor: Accessible action button in list/row. |
| `row follow-up ORD-1002` | baseline & after | `invariant` / `task` | Direct row action triggers follow-up for specific record. Successor: Accessible action button in list/row. |
| `row follow-up ORD-1004` | baseline & after | `invariant` / `task` | Direct row action triggers follow-up for Delivered order. Successor: Action availability matches permissions. |
| `selection retained through filter` | baseline & after | `invariant` | Selected items survive filter change; bulk action button shows selected count `(3)`. Successor: Verify persistent selection state across filters. |
| `mixed status bulk follow-up` | baseline & after | `invariant` | Bulk action triggers follow-up across multiple selected records. Successor: Status text confirms all selected IDs. |
| `direct detail Back fallback` | baseline & after | `invariant` | Opening detail URL directly and clicking 'Back to orders' falls back to `/orders`. Successor: Navigation fallback verification. |

### B. Form Assertions (`tests/261015-retrofit/form-browser-check.cjs`)

| Assertion Name | Script Phase | Classification | Rationale & Successor Check |
|---|---|---|---|
| `server rejection shown` | baseline & after | `invariant` | 422 server validation message displayed to user. Successor: Error container presence and text. |
| `values retained after rejection` | baseline & after | `invariant` | Valid inputs (`fullName`, `notes`) are preserved upon rejection. Successor: Field `.inputValue()` checks. |
| `rejection HTTP status` | baseline & after | `invariant` | Network request returns status 422. Successor: Playwright response status assertion. |
| `successful resubmission` | baseline & after | `invariant` / `task` | Correcting input and resubmitting completes submission (shows confirmation). Successor: Confirmation text presence. |
| `resubmission HTTP statuses` | baseline & after | `invariant` | Request history records 422 followed by 200. Successor: Network monitor assertion. |
| `empty required field rejected` | baseline & after | `invariant` | Submitting empty form triggers client/server required validation. Successor: Error message accessibility association. |
| `missing field HTTP status` | baseline & after | `invariant` | Missing field submission triggers 422. Successor: Response status check. |
| `focus reaches missing field` | after only | `invariant` / `task` | Focus shifts to first invalid input (`fullName`). Successor: `document.activeElement` equals first invalid field. |
| `submit stays in document flow` | after only | `pattern-only` | Checks that submit button parent has **`position: static`**. While intended to prevent keyboard obstruction, an accessible sticky footer with safe-area and keyboard handling is also valid. Enforcing `position: static` is pattern-only. Successor: Test that submit button does not obscure focused inputs during virtual keyboard emulation. |
| `invalid email inline error` | after only | `invariant` | Inline validation error specifically for invalid email. Successor: Associated `aria-describedby` error text. |
| `invalid email focus` | after only | `invariant` / `task` | Focus shifts to invalid email input. Successor: `document.activeElement` check. |
| `other values retained after email error` | after only | `invariant` | Non-erroneous fields preserve user input. Successor: Form values preserved. |
| `invalid email HTTP status` | after only | `invariant` | Invalid email triggers 422 response. Successor: Response status 422. |
| `corrected email resubmits` | after only | `invariant` / `task` | User corrects email and successfully resubmits. Successor: 200 response and confirmation. |

---

## Current evidence gate policy

Full task-suite evidence must have zero skipped tests, including baseline and desktop
checks. The verifier also requires named task outcomes, including comparison desktop
preservation and metadata-only attachment rejection in both request-form APIs.
This policy does not pin a test count. A focused test run is diagnostic evidence,
not a complete suite result. See [verifier](../tests/task-ux/verify-evidence.py)
and [rejection probes](../tests/task-ux/check-evidence-rejections.py).

## 3. Task Acceptance Metrics: Before & After

To evaluate mobile UX improvements objectively without distorting automation runtime as human speed:

| Metric | Target / Criterion | Measurement Method |
|---|---|---|
| **Primary Task Horizontal Scroll** | **0px sideways scroll required** at 320px & 390px viewports to find record, view status, and invoke primary action. | Evaluate `element.scrollWidth > element.clientWidth` and horizontal scroll offset on primary action containers. |
| **Action Reachability** | Primary action and record status visible within first viewport or natural vertical scroll. | Check bounding box intersection with viewport. |
| **Desktop Preservation** | Full multi-column table layout and functionality preserved at >= 1024px. | Viewport 1280px checks for `table` element and multi-column headers. |
| **Form Error Recovery** | All valid entries preserved; focus placed on first error; clear inline feedback. | Form state evaluation post-validation failure. |
| **Headless Viewport Clearance** | Focused input and Submit have no geometric overlap in reduced-height Chromium simulation. | Bounding boxes and hit testing at 320–430px. Physical virtual keyboard remains `NOT RUN`. |
| **Automation Duration** | Reported as test environment latency only, **not** human completion time. | Playwright step timer (labeled as automation script execution duration). |

---

## 4. Visual Case Boundaries & Inferred Behaviors

The 5 visual references from the mobile UI observations provide real-world mobile UI observations:
1. **Document / Profile List:** Observations of key/value card layout, filter stacking, and download actions. Runtime behavior is **INFERRED**.
2. **Notification Triage:** Observations of unread state chips, checkmark actions, and repetitive card layouts. Checkmark side-effects and dismiss behaviors are **INFERRED**.
3. **Drawer / Navigation Menu:** Observations of multi-section drawer hierarchy and account popover. Routing semantics are **INFERRED**.
4. **Account Menu:** Observations of user profile actions. Permissions and profile edit flows are **INFERRED**.
5. **Create Request Form:** Observations of date inputs, computed days, attachment box, and submit CTA. Server validation rules are **INFERRED**.

### Decision on Notification Fixture
Notification triage presents important mobile patterns (dense list, unread markers, clear action semantics). However, without real backend domain semantics, synthesizing a 4th standalone fixture would duplicate the dense-list principles already covered by the Order Dashboard and Comparison Table. Therefore:
- The visual notification triage case is captured in decision guidance (`evals/decisions/content-cases.md`) with explicit `INFERRED` tags.
- The Orders, Comparison Table and Request Form journeys exercise specified list-triage, aligned-comparison and contextual-form interactions in the [task browser suite](../tests/task-ux/). Coverage and unverified device/human behavior are bounded by the [recorded evidence](../tests/reports/task-ux-evidence.md).
- If subsequent evidence proves an unaddressed behavioral gap, a notification fixture will be formally specified and implemented with matching CI.

---

## 5. Scenario Contract Links

The existing three executable scenario contracts are listed below; the catalog contract follows in the next section:
- [evals/scenarios/dashboard.md](../evals/scenarios/dashboard.md): Dense order dashboard (list-first on mobile, table on desktop, 320/390px zero sideways scroll).
- [docs/comparison-scenario.md](comparison-scenario.md): Multi-entity comparison table (semantic horizontal scroll, pinned headers, keyboard navigation).
- [docs/request-form-scenario.md](request-form-scenario.md): Contextual date-range and request form (manual date input, derived days, upload affordance, error focus).

## Catalog evaluation contract

The [catalog scenario](../evals/scenarios/catalog.md) owns exact product data and browse/filter/sort/compare/reset semantics. Both fixture and candidate retain all six products, exact minor-unit currency values, Wh/kg, availability and uncapped comparison selection. Mobile browse and aligned comparison have distinct layouts; desktop table/actions remain available. In-memory evaluation data does not imply checkout, real inventory or an external product rule. Execution status is owned by the task evidence report.

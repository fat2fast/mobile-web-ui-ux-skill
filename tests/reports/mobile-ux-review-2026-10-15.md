# Review: mobile-web-ui-ux-skill — Functional correctness vs actual mobile UX

**Date:** 2026-10-15  
**Sources:** user-provided `261015-improve.zip`, 5 UI screenshots, mobile UX design references.  
**GitHub `main` last checked:** `ac6c6a6ca7d7` (PR #2); the ZIP contains newer test reports/artifacts, but not the complete source diff of the improved fixtures. No production source code was provided. Do not mistake the uploaded artifacts for validated changes on `main`.

## Executive finding

**Result: partial / not yet meeting the product goal.** The tests support improved mobile fit, preservation of basic business behavior and inline error recovery. They do **not** establish task-first, phone-optimized list and form journeys. The dashboard's after screenshot keeps a horizontally scrolling HTML table, though the primary scenario is searching/opening one order. The form's after screenshot stays a long stack of conventional fields, with Submit moved from fixed to in-flow; recovery improved but contextual input design/keyboard behavior is untested.

## Evidence actually supported by the attached ZIP

- `261015-improve/reports/regression-261015-tier-a.md`: 4 frozen prompts plus 2 advice counterexamples reviewed successfully; a separate form-code sample was checked with Node. UX behavior of these proposed solutions was NOT RUN.
- `261015-improve/reports/retrofit-261015-browser-evidence.md`: baseline and after tested in managed headless Chromium at 320/375/390/430/1280 CSS px; dashboard 14 baseline and 20 after functional assertions; form 7 baseline and 14 after assertions. These are counts of executed assertions, not usability scores.
- `tests/261015-retrofit/after/dashboard-390.png`: first viewport shows Select, ID, Status and Total; table remains horizontally scrollable and Follow-up is outside the immediate row view. All fields remain available through horizontal scrolling. The source screenshot does not establish effective task improvement.
- `tests/261015-retrofit/form-after/form-390.png`: labels and input flow are visible; screenshot and JSON show a static submit after the fields, server error + recovery and required-field focus; no test of mobile keyboard, real-device interactions, complex field selection or task effort.
- `tests/261015-retrofit/after/dashboard-a11y.json` and `form-after/form-a11y.json`: axe automated run reported zero detected violations; this is not exhaustive accessibility conformance.
- `261015-improve/reports/provenance-261015-data-transcripts.md`: DATA-02 transcript duplicate prefix is an archival ambiguity and does not prove the user reused conversations.

## Root cause in the evaluation contract

`tests/261015-retrofit/dashboard-browser-check.cjs` hardcodes `tbody tr`, `row.cells[2]`, `row.cells[3]`, `tbody tr td:nth-child(2) button`, `td:last-child button`, `.order-table` and the requirement for pinned selection/ID columns. An agent can preserve all tasks with a different, better mobile list implementation and nevertheless fail these checks. The tests bake the current table structure into the contract. They also test fields/sort/export/business semantics appropriately, but mix those checks with implementation-specific DOM layout.

`tests/261015-retrofit/form-browser-check.cjs` explicitly checks `submitPosition === 'static'`, which verifies this particular repair but excludes a potentially valid accessible sticky CTA that handles keyboard/safe-area correctly. This must not become a universal mobile UX rule.

**Required split:** (A) business and accessibility invariants; (B) task-oriented UX acceptance; (C) optional implementation-specific checks for the chosen pattern. The agent should choose the pattern based on the task before the reviewer enforces any component structure.

## screenshot observations (visual only; not verified code/runtime)

### Documents / Profile list

- Current: a top action area, missing document pills, search/filter/sort controls, and a single large two-column key/value card with Preview and Download.
- Friction: document title competes with a generic `Loại hồ sơ` label; list cards consume space showing empty date values; search/filter/sort controls stack into multiple toolbars; list count and active filters are not evident. A large card is not automatically a task-first mobile list.
- Recommend: (1) keep missing required documents as actionable priority above the archive; (2) show existing records as vertical items with title prominent, status second, one useful metadata line, clear open/preview action; (3) keep download as an explicit reachable action; (4) open full metadata/details progressively without dropping data; (5) compact search/filter, show active chips, sort only when relevant; (6) preserve existing pagination, role rights and original document semantics.

### Drawer / account menu

- Current: many expanded sections, large gaps, account popover obscuring the screen.
- Recommend: prioritize frequent navigation; collapse or progressively disclose less-used groups; keep close/back behavior and focus; group account preferences separately. A drawer is valid but must be easier to scan and dismiss. Do not automatically prescribe bottom nav for an enterprise app with many sections.

### Create Request form

- Current: correct single-column structure but date inputs lack clear hint/selection affordance in screenshot; `Số ngày` is separated and unclear; upload affordance emphasizes drag and drop; submission is far below the fold.
- Recommend: clarify type, date range, computed days, reason and attachment as one task; provide suitable accessible date controls with locale/format and keyboard/manual alternative; validate ranges/constraints according to existing business rules; present file picker/camera as appropriate on mobile, not drag-drop as the primary cue; show errors next to fields with focus/recovery and values retained. Do not force a wizard on a short form or a sticky footer without testing phone keyboard.

### Notifications

- Current: repeated tall cards with unread and type chips, a checkmark button whose purpose is ambiguous visually, and repetitive body copy.
- Recommend: group if relevant by time/importance, reduce repetition into scan-friendly list item title + concise description + timestamp; preserve unread marker and clear action semantics; use explicit accessible label for mark-as-read vs approval, retain filters/search when appropriate.

## UX pattern decision matrix

| Primary mobile task | Candidate | When it tends to fit | What must survive |
| --- | --- | --- | --- |
| Find one record, check status and open/action | Task-first record list or compact cards + detail | Individual-record scanning dominates | Search/filter/sort/export, all fields via detail, action rights, route/Back, bulk selection if supported |
| Compare multiple entities on aligned metrics | Semantic horizontal comparison table with scroll clues/headers | Two-dimensional alignment is essential | Every row/column, labels, numeric units, keyboard, zoom |
| Select many records while scanning fields | Compact selectable list or table with explicit selection mode | Bulk work and comparisons dominate | Persistent counts/selection across filters/pages, action eligibility only from existing rules |
| Respond to alerts / notifications | Dense vertical feed/list with readable state and action | Quick triage of recent items | Full details, read state, original side effects |
| Enter short coherent form | One-column form, contextual fields and in-flow submit unless proven otherwise | Few fields/one goal | Existing validation, server state, paste, keyboard, Back, values, focus |
| Long multi-stage form | Conditional steps with progress and recoverable state | Distinct meaningful stages | Input retention, backtracking, server errors, desktop behavior |

## Suggested mobile list layout (illustrative, not a required component)

```text
Hồ sơ của tôi                               (?)
Còn 3 giấy tờ cần bổ sung          [Bổ sung]
[CCCD] [Sơ yếu lý lịch] [Giấy khám sức khỏe]

Hồ sơ đã nộp (N)
[ Tìm theo tên hồ sơ ............. ] [Lọc]
[Trạng thái: Đã duyệt ×]               Sắp xếp

Cam kết bảo mật listing / IP
[Đã duyệt]    Ngày cấp: chưa có (if needed)
[Xem trước]               [Tải file]
───────────────────────────────────────
...record 2
```

These status/filter examples are conditional on real product data and business semantics. Do not merge the “missing documents” summary with the archive list without source evidence. Keep every actual action and mandatory datum reachable.

## Suggested mobile form (illustrative)

```text
Tạo phiếu
Loại phiếu *
[ Chọn loại phiếu                      ▾ ]
Thời gian áp dụng
Từ ngày *    [dd/mm/yyyy] [Chọn ngày]
Đến ngày *  [dd/mm/yyyy] [Chọn ngày]
Số ngày: — (calculated per current product rule)
Lý do *
[ Nhập lý do...                       ]
Đính kèm
[Chọn tệp] [Chụp ảnh, if existing supported]
[Hủy]                         [Tạo phiếu]
```

This is not a prescription to alter business logic, add conditional rules or change the request type. Preserve the product's existing validation and calculation rules. Test with on-screen keyboard and errors.

## Task plan, recommended for the next PRs

### P0: Task-first UX acceptance, not only responsiveness

- **UX-01**: Define top mobile task for each fixture and screenshot: actor, user goal, most-needed fields, task success, accessibility and business constraints. Include at least one deliberately wrong pattern for contrast.
- **UX-02**: Separate semantic functional assertions from table DOM selectors (`tbody`, `row.cells`, sticky table tests). Accept record list OR table when it passes the same user tasks. Retain table-only assertions solely for a selected comparison-table pattern.
- **UX-03**: Extend `references/decisions/data-display.md` and `decision-contract.md` to require rationale: why list, compact card, table, detail page, or selection mode; prioritize task completion over minimum CSS changes. Do not universally enforce cards.

### P1: Implement meaningful list and form scenarios

- **UX-04**: Rebuild a copy of the dashboard fixture for the 'find one order' scenario as a mobile-first record list with status + primary action visible without sideways scroll at 320/390px. Preserve desktop table, selection/bulk Follow-up on Delivered, search/filter/sort/CSV, detail/Back. Save screenshots and task outcome before/after.
- **UX-05**: Test second scenario where a semantic horizontally scrolling table is the *right* choice (product comparison), to avoid overfitting rules to card UIs.
- **UX-06**: Implement contextual form experience on a matching request-type/date-range fixture, not just moving Submit. Test date input affordance/manual input, range errors, derived field, file selection, focus and keyboard, preserving backend validation.
- **UX-07**: Add one notifications/record-list fixture for triage and state actions only if needed after the first two demonstrate coverage gaps.

### P1: UX verification and CI

- **UX-08**: E2E journeys by user-visible roles/labels/routes rather than DOM tag shape. Measure observable horizontal scroll needed for the key task, whether status/actions are discoverable and reachable, preservation across back/filter, errors/focus, and no loss of functionality. If no human study, describe as automated task checks, not proof of perceived user delight.
- **UX-09**: Keep deterministic Python tests + `npm ci && npm run build` in GitHub Actions; add smoke Playwright tests for implemented journeys once stable. A build passing or axe showing zero detected violations is necessary but not sufficient.
- **UX-10**: Real-phone verification for keyboard/scroll/focus and a manual task walk-through; retain `NOT RUN` if unavailable.

## Release gate

Claim 'functional mobile retrofit tested' after task + invariants + desktop checks have run. Claim 'mobile UX improvement demonstrated' only when before/after task-specific measures and/or suitable human task evaluation support that statement. Do not claim broad skill superiority from one fixture, Tier A regression, structural CI or axe alone.

## Reference patterns (external)

- [Material Web — Lists](https://material-web.dev/components/list/): vertical list with primary and supporting text and trailing action.
- [NN/g — Mobile Tables](https://www.nngroup.com/articles/mobile-tables/): scrolling tables remain suitable for true comparisons, with headers and scroll cues.
- [Baymard — Applied Filters Overview](https://baymard.com/research-articles/how-to-design-applied-filters): keep selected filters visible/removable in results.
- [GOV.UK — Ask users for dates](https://design-system.service.gov.uk/patterns/dates/): date input varies by task; allow text entry when calendar offered.
- [GOV.UK — File Upload](https://design-system.service.gov.uk/components/file-upload/): clear file selection, error/recovery guidance and optional drag-drop enhancement.
- [W3C — WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): two-dimensional tables have a qualified exception; it does not apply to arbitrary page UI.

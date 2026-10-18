# P03 — Mobile UX Implementation Workflow

> Biến quyết định UX thành patch an toàn trên website có sẵn, không tự thay business logic hay desktop UI.

**Đối chiếu hiện trạng:** 17/10/2026, base HEAD `4ad759f`. Checklist và trạng thái từng task bên dưới phản ánh source và bằng chứng được dẫn trực tiếp tại từng task. Đây là hồ sơ tiến độ có thể cập nhật; Git lưu lịch sử kế hoạch ban đầu.

## Kết quả cần đạt

Ít nhất một fixture được cải thiện đầy đủ luồng tác vụ và có thể chạy lại từ baseline sạch.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. `[x]` chỉ xác nhận đúng tiêu chí và phạm vi bằng chứng ghi tại task; `[ ]` là chưa đạt hoặc chưa đủ bằng chứng. Task có thể còn **MỘT PHẦN** dù DoD trên fixture đã đạt, khi đầu ra hướng dẫn hoặc coverage dự kiến vẫn thiếu. Không suy ra phase hoàn tất từ việc file đã tồn tại.

### P03-01 — Thực thi cải thiện đầu tiên trên fixture Dashboard

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trên dashboard fixture · **Phụ thuộc:** P02-00, P02-02, P02-09.
- **Bằng chứng / còn thiếu:** [Retrofit implementation](../../evals/implementations/261015-retrofit/order-dashboard/), [historical evidence](../../tests/reports/retrofit-261015-browser-evidence.md) và [task-first order suite](../../tests/task-ux/order.spec.cjs) có journey, preservation, build/desktop checks.
- **Các bước thực hiện:**
  1. Tạo nhánh/copy từ baseline order-dashboard đã cố định.
  2. Cho agent dùng skill đọc repo, đưa decision record và sửa mobile view trong phạm vi component.
  3. Giữ nguyên mock data, search/filter, details, permission assumptions và desktop table; ghi diff và report.
- **Đầu ra/file dự kiến:**
  - `evals/results/order-dashboard-with-skill.md`
  - Patch trong fixture/nhánh riêng
- **Definition of Done (DoD):**
  - [x] Luồng tìm đơn → xem trạng thái → hành động → Back chạy được.
  - [x] Không mất data/action, build pass và desktop không hỏng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-02 — Cơ chế tìm đúng component cần sửa

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P01-04.
- **Bằng chứng / còn thiếu:** [Discovery](../../references/project-discovery.md) và [workflow](../../references/agent-workflow.md) đã có scope guardrails; chưa có component-mapping guide/trace shared usages và evidence report đáp ứng trọn task. Không tính chỉ có fixture code là đã giao guide.
- **Các bước thực hiện:**
  1. Thêm checklist truy vết route → page → component → styles → shared dependencies.
  2. Yêu cầu agent kiểm tra các usages của component dùng chung trước khi chỉnh.
  3. Tránh replace toàn bộ layout hoặc thêm library mới cho thay đổi nhỏ.
- **Đầu ra/file dự kiến:**
  - `references/implementation/component-mapping.md`
- **Definition of Done (DoD):**
  - [ ] Report liệt kê file và lý do cần sửa.
  - [ ] Không thay file không liên quan tới task.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-03 — Small-patch & reversible change strategy

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P03-02.
- **Bằng chứng / còn thiếu:** [SKILL constraints](../../SKILL.md), [workflow](../../references/agent-workflow.md) và [comparison baseline/copy](../../scripts/create-comparison-project.py) hỗ trợ scoped changes/preservation. Chưa có safe-retrofit guide với rollback được kiểm chứng; không dùng khả năng git revert chung để đánh dấu patch dễ review/rollback đã đạt.
- **Các bước thực hiện:**
  1. Định nghĩa trình tự audit → plan → scoped code change → build → UI check → report.
  2. Ưu tiên sửa riêng mobile styles/state, dùng tokens và components đang có.
  3. Định nghĩa rollback khi thay đổi phá shared component, missing functionality hoặc performance.
- **Đầu ra/file dự kiến:**
  - `references/implementation/safe-retrofit.md`
- **Definition of Done (DoD):**
  - [ ] Patch dễ review, có cách hoàn tác.
  - [x] Không đổi API/route/auth nếu chưa được cho phép.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-04 — Bảo toàn desktop và responsive breakpoints

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trên tested fixtures · **Phụ thuộc:** P03-01.
- **Bằng chứng / còn thiếu:** [Order/comparison tests](../../tests/task-ux/) và [retrofit evidence](../../tests/reports/retrofit-261015-browser-evidence.md) có desktop và overflow/breakpoint checks. Responsive-preservation guide riêng trong đầu ra dự kiến chưa có; phạm vi đạt là fixtures đã test.
- **Các bước thực hiện:**
  1. Kiểm tra breakpoint hiện có trước khi thêm CSS mới, tránh cascade conflict.
  2. Giữ current desktop navigation, typography và layout theo diff được phê duyệt.
  3. Ghi hành vi tablet/landscape khi cần.
- **Đầu ra/file dự kiến:**
  - `references/implementation/responsive-preservation.md`
  - Desktop before/after snapshots
- **Definition of Done (DoD):**
  - [x] Desktop workflow còn truy cập đủ; không regression chức năng.
  - [x] Không giới thiệu fixed widths gây overflow mới.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-05 — Implementation guide cho bảng dữ liệu

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-02, P03-02.
- **Bằng chứng / còn thiếu:** [Data playbook](../../references/decisions/data-display.md) và [order/comparison implementations](../../evals/implementations/task-first/) đáp ứng DoD chức năng/conditional patterns trong [browser evidence](../../tests/reports/task-ux-evidence.md). React implementation guide riêng chưa có; tick DoD không coi đầu ra guide đã giao.
- **Các bước thực hiện:**
  1. Bổ sung ví dụ table/list/details trên React + Tailwind, giữ event handlers và data selection.
  2. Đảm bảo sort/filter/row actions và aria semantics không mất khi đổi presentation.
  3. Dùng fixture order-dashboard để kiểm chứng.
- **Đầu ra/file dự kiến:**
  - `references/implementation/data-display-react.md`
- **Definition of Done (DoD):**
  - [x] Không mất dữ liệu / hành động cốt lõi.
  - [x] Mỗi pattern có trường hợp nên/không nên dùng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-06 — Implementation guide cho navigation

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-01, P03-02.
- **Bằng chứng / còn thiếu:** [Navigation playbook](../../references/decisions/navigation.md) và [order suite](../../tests/task-ux/order.spec.cjs) kiểm tra Back/direct detail/focus. Chưa có navigation-react guide, full navigation scenario hoặc actual auth test.
- **Các bước thực hiện:**
  1. Đưa ví dụ grouped menu, top tabs, contextual nav và active-state theo routing thực tế.
  2. Giữ deep-link, browser Back, focus restoration và permissions.
  3. Tránh duplicate navigation gây rối và sticky bars chồng lên content.
- **Đầu ra/file dự kiến:**
  - `references/implementation/navigation-react.md`
- **Definition of Done (DoD):**
  - [x] Deep links và browser history chạy đúng.
  - [ ] Không làm lộ route bị chặn quyền.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-07 — Implementation guide cho form & mobile keyboard

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-03, P03-02.
- **Bằng chứng / còn thiếu:** [Forms guidance](../../references/decisions/forms.md), [request suite](../../tests/task-ux/request-form.spec.cjs) và [retrofit evidence](../../tests/reports/retrofit-261015-browser-evidence.md) có correction/resubmit. Chưa có forms-react guide hoặc kiểm tra đầy đủ paste/zoom/device keyboard.
- **Các bước thực hiện:**
  1. Ví dụ labels, input types, autocomplete, error association, submit states.
  2. Định nghĩa xử lý sticky form actions khi keyboard hiển thị; tránh hack platform thiếu hỗ trợ.
  3. Giữ dữ liệu/form validation/submission nguyên vẹn.
- **Đầu ra/file dự kiến:**
  - `references/implementation/forms-react.md`
- **Definition of Done (DoD):**
  - [x] Có thể sửa lỗi và submit lại thành công.
  - [ ] Không chặn paste/zoom/focus.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-08 — Chế độ Build Mobile View cho trang mới

- **Ưu tiên:** `P1` · **Trạng thái:** CHƯA KIỂM CHỨNG · **Phụ thuộc:** P03-03, P02-09.
- **Bằng chứng / còn thiếu:** [SKILL](../../SKILL.md) định nghĩa Build Mobile View nhưng chưa có new-feature/new-page example cùng verification; retrofit hiện có không chứng minh mode này.
- **Các bước thực hiện:**
  1. Tạo luồng bổ sung mobile view của feature mới trong existing web app, không tạo visual design system mới.
  2. Reuse tokens, shared components và established page structure.
  3. Kiểm thử khi trang chưa có responsive version nhưng có desktop design.
- **Đầu ra/file dự kiến:**
  - `references/implementation/build-mobile-view.md`
  - One small new-page example
- **Definition of Done (DoD):**
  - [ ] Trang mới phù hợp UI hiện tại và mobile task.
  - [ ] Không tạo native-only UX giả định.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-09 — Kiểm thử build và thay đổi có kiểm soát

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD bằng chứng trên fixtures · **Phụ thuộc:** P03-01, P03-03.
- **Bằng chứng / còn thiếu:** [Task evidence](../../tests/reports/task-ux-evidence.md) và [workflow](../../.github/workflows/validate.yml) có build/test, giới hạn và NOT RUN. Change-checklist/implementation-verification filename dự kiến chưa có; owners hiện là workflow/report template và evidence reports.
- **Các bước thực hiện:**
  1. Chạy lint/typecheck/build/test sẵn có trong fixture hoặc target project khi môi trường cho phép.
  2. Ghi rõ tests PASS/FAIL/NOT RUN và tác động dependencies.
  3. Bổ sung integration checklist và không tự động push/commit/project-wide rewrite.
- **Đầu ra/file dự kiến:**
  - `references/implementation/change-checklist.md`
  - `evals/results/implementation-verification.md`
- **Definition of Done (DoD):**
  - [x] Có bằng chứng build/test.
  - [x] Không báo thành công nếu tests chưa chạy.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [x] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp (xem trạng thái/bằng chứng từng task).

Phase chưa đóng: các task bắt buộc hoặc bằng chứng toàn phạm vi còn mở; không đánh dấu các exit gate còn lại chỉ dựa vào structural/browser PASS.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

## Audit-driven workflow addition — 2026-10-17

The runtime [safe patch checkpoint](../../references/agent-workflow.md#safe-patch-checkpoint) now traces component/state/handler/token/shared consumers and desktop guards; [business archetypes](../../references/business-task-archetypes.md) load conditionally. The [catalog contract](../../evals/scenarios/catalog.md) adds a deliberate local evaluation app. Guidance/case review is distinct from executed fixture correctness and fresh agent replay; no broad phase completion or industry-effectiveness claim follows.

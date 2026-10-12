# P03 — Mobile UX Implementation Workflow

> Biến quyết định UX thành patch an toàn trên website có sẵn, không tự thay business logic hay desktop UI.

**Mốc kiểm tra:** branch `main`, commit `62505f6f161b` (12/10/2026). Trạng thái trong tài liệu là đánh giá lúc lập kế hoạch, không tự động đồng bộ với repo; kiểm tra lại trước khi triển khai. `SKILL.md`, README, docs, 3 playbook, scenario specs và CI cấu trúc đã tồn tại; runnable fixtures, UX e2e và A/B chưa có.

## Kết quả cần đạt

Ít nhất một fixture được cải thiện đầy đủ luồng tác vụ và có thể chạy lại từ baseline sạch.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. Dấu **Đã có bản nháp** chỉ xác nhận đã có tài liệu, **không** đồng nghĩa có UX validation.

### P03-01 — Thực thi cải thiện đầu tiên trên fixture Dashboard

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-00, P02-02, P02-09.
- **Các bước thực hiện:**
  1. Tạo nhánh/copy từ baseline order-dashboard đã cố định.
  2. Cho agent dùng skill đọc repo, đưa decision record và sửa mobile view trong phạm vi component.
  3. Giữ nguyên mock data, search/filter, details, permission assumptions và desktop table; ghi diff và report.
- **Đầu ra/file dự kiến:**
  - `evals/results/order-dashboard-with-skill.md`
  - Patch trong fixture/nhánh riêng
- **Definition of Done (DoD):**
  - [ ] Luồng tìm đơn → xem trạng thái → hành động → Back chạy được.
  - [ ] Không mất data/action, build pass và desktop không hỏng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-02 — Cơ chế tìm đúng component cần sửa

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có project discovery nền · **Phụ thuộc:** P01-04.
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

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có guardrail nền · **Phụ thuộc:** P03-02.
- **Các bước thực hiện:**
  1. Định nghĩa trình tự audit → plan → scoped code change → build → UI check → report.
  2. Ưu tiên sửa riêng mobile styles/state, dùng tokens và components đang có.
  3. Định nghĩa rollback khi thay đổi phá shared component, missing functionality hoặc performance.
- **Đầu ra/file dự kiến:**
  - `references/implementation/safe-retrofit.md`
- **Definition of Done (DoD):**
  - [ ] Patch dễ review, có cách hoàn tác.
  - [ ] Không đổi API/route/auth nếu chưa được cho phép.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-04 — Bảo toàn desktop và responsive breakpoints

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa thực nghiệm · **Phụ thuộc:** P03-01.
- **Các bước thực hiện:**
  1. Kiểm tra breakpoint hiện có trước khi thêm CSS mới, tránh cascade conflict.
  2. Giữ current desktop navigation, typography và layout theo diff được phê duyệt.
  3. Ghi hành vi tablet/landscape khi cần.
- **Đầu ra/file dự kiến:**
  - `references/implementation/responsive-preservation.md`
  - Desktop before/after snapshots
- **Definition of Done (DoD):**
  - [ ] Desktop workflow còn truy cập đủ; không regression chức năng.
  - [ ] Không giới thiệu fixed widths gây overflow mới.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-05 — Implementation guide cho bảng dữ liệu

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-02, P03-02.
- **Các bước thực hiện:**
  1. Bổ sung ví dụ table/list/details trên React + Tailwind, giữ event handlers và data selection.
  2. Đảm bảo sort/filter/row actions và aria semantics không mất khi đổi presentation.
  3. Dùng fixture order-dashboard để kiểm chứng.
- **Đầu ra/file dự kiến:**
  - `references/implementation/data-display-react.md`
- **Definition of Done (DoD):**
  - [ ] Không mất dữ liệu / hành động cốt lõi.
  - [ ] Mỗi pattern có trường hợp nên/không nên dùng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-06 — Implementation guide cho navigation

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-01, P03-02.
- **Các bước thực hiện:**
  1. Đưa ví dụ grouped menu, top tabs, contextual nav và active-state theo routing thực tế.
  2. Giữ deep-link, browser Back, focus restoration và permissions.
  3. Tránh duplicate navigation gây rối và sticky bars chồng lên content.
- **Đầu ra/file dự kiến:**
  - `references/implementation/navigation-react.md`
- **Definition of Done (DoD):**
  - [ ] Deep links và browser history chạy đúng.
  - [ ] Không làm lộ route bị chặn quyền.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-07 — Implementation guide cho form & mobile keyboard

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-03, P03-02.
- **Các bước thực hiện:**
  1. Ví dụ labels, input types, autocomplete, error association, submit states.
  2. Định nghĩa xử lý sticky form actions khi keyboard hiển thị; tránh hack platform thiếu hỗ trợ.
  3. Giữ dữ liệu/form validation/submission nguyên vẹn.
- **Đầu ra/file dự kiến:**
  - `references/implementation/forms-react.md`
- **Definition of Done (DoD):**
  - [ ] Có thể sửa lỗi và submit lại thành công.
  - [ ] Không chặn paste/zoom/focus.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P03-08 — Chế độ Build Mobile View cho trang mới

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Có workflow nền · **Phụ thuộc:** P03-03, P02-09.
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

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P03-01, P03-03.
- **Các bước thực hiện:**
  1. Chạy lint/typecheck/build/test sẵn có trong fixture hoặc target project khi môi trường cho phép.
  2. Ghi rõ tests PASS/FAIL/NOT RUN và tác động dependencies.
  3. Bổ sung integration checklist và không tự động push/commit/project-wide rewrite.
- **Đầu ra/file dự kiến:**
  - `references/implementation/change-checklist.md`
  - `evals/results/implementation-verification.md`
- **Definition of Done (DoD):**
  - [ ] Có bằng chứng build/test.
  - [ ] Không báo thành công nếu tests chưa chạy.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [ ] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

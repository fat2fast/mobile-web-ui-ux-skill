# P02 — Mobile UX Decision Intelligence

> Dạy AI tự chọn pattern UX mobile web dựa vào tác vụ và bối cảnh, không bắt vibe coder phải là designer.

**Mốc kiểm tra:** branch `main`, commit `62505f6f161b` (12/10/2026). Trạng thái trong tài liệu là đánh giá lúc lập kế hoạch, không tự động đồng bộ với repo; kiểm tra lại trước khi triển khai. `SKILL.md`, README, docs, 3 playbook, scenario specs và CI cấu trúc đã tồn tại; runnable fixtures, UX e2e và A/B chưa có.

## Kết quả cần đạt

Có fixture baseline đầu tiên + các playbook giải thích được điều kiện, trade-offs, anti-patterns và có evaluation cases.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. Dấu **Đã có bản nháp** chỉ xác nhận đã có tài liệu, **không** đồng nghĩa có UX validation.

### P02-00 — Dựng runnable baseline đầu tiên — Order Dashboard

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · START HERE · **Phụ thuộc:** P00-03, P00-04.
- **Các bước thực hiện:**
  1. Tạo fixture React + Tailwind độc lập dưới `evals/fixtures/order-dashboard/` (không phụ thuộc runtime skill).
  2. Mô phỏng bảng đơn hàng ~8 cột, sidebar, search/filter, details, row action, dữ liệu mock ổn định; cố tình để UX mobile bất tiện nhưng responsive không vỡ nghiêm trọng.
  3. Ghi rõ lỗi được cài chủ đích và tác vụ: tìm đơn → xem trạng thái → mở chi tiết → hành động → Back.
  4. Tạo script start/build và baseline evidence; không chỉnh UI tốt lên trong bản baseline.
- **Đầu ra/file dự kiến:**
  - `evals/fixtures/order-dashboard/`
  - `evals/fixtures/order-dashboard/README.md`
  - `evals/results/order-dashboard-baseline.md`
- **Definition of Done (DoD):**
  - [ ] Fixture chạy offline với mock data; có hướng dẫn tái hiện.
  - [ ] Lỗi UX có thể quan sát trên 390px và desktop baseline vẫn hợp lệ.
  - [ ] Không giả mạo kết quả benchmark skill.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-01 — Navigation decision playbook

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có bản nháp · **Phụ thuộc:** P02-00.
- **Các bước thực hiện:**
  1. Mở rộng `references/decisions/navigation.md` thành conditions → alternatives → reject when.
  2. Bao quát bottom nav, grouped drawer/menu, local tabs, contextual action, breadcrumb/back và deep-link.
  3. Thử với 3 tình huống: dashboard nhiều tuyến, web bán hàng, web tác vụ tần suất cao; xác định khi nào KHÔNG dùng bottom bar.
- **Đầu ra/file dự kiến:**
  - `references/decisions/navigation.md`
  - `evals/decisions/navigation-cases.md`
- **Definition of Done (DoD):**
  - [ ] Mỗi quyết định có lý do, phương án loại, quy tắc preservation.
  - [ ] Bảo toàn browser Back, routes và phân quyền.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-02 — Data display & table decision playbook

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có bản nháp · **Phụ thuộc:** P02-00.
- **Các bước thực hiện:**
  1. Mở rộng `data-display.md` cho mục tiêu scan, compare, filter, bulk-edit, dense data.
  2. Đưa rule chuyển table → cards/list chỉ khi phù hợp, giữ horizontal table khi cần so sánh; đảm bảo tất cả field/actions vẫn tới được.
  3. Kiểm tra fixture order-dashboard và 2 phản ví dụ (bảng so sánh giá, bảng bulk select).
- **Đầu ra/file dự kiến:**
  - `references/decisions/data-display.md`
  - `evals/decisions/data-display-cases.md`
- **Definition of Done (DoD):**
  - [ ] Không biến mọi table thành card một cách mặc định.
  - [ ] Không mất sort/filter/bulk actions/record identity hay data semantics.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-03 — Mobile forms decision playbook

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có bản nháp · **Phụ thuộc:** P00-03.
- **Các bước thực hiện:**
  1. Bổ sung rule loại bàn phím, autocomplete, inputmode, labels, error association, submit/keyboard overlap.
  2. Phân biệt form ngắn và multi-step form dài; quy tắc không bắt nhập lại khi validation fail.
  3. Thử ở form có lỗi server và bàn phím ảo giả lập; ghi những kiểm thử cần máy thật.
- **Đầu ra/file dự kiến:**
  - `references/decisions/forms.md`
  - `evals/decisions/forms-cases.md`
- **Definition of Done (DoD):**
  - [ ] Không xóa validation, không chặn paste/zoom.
  - [ ] Keyboard không che trường cần sửa hoặc tác vụ quan trọng trong môi trường được kiểm thử.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-04 — Action hierarchy & sticky CTA

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-01.
- **Các bước thực hiện:**
  1. Phân loại primary/secondary/destructive actions theo tần suất và hậu quả.
  2. Chọn inline/sticky/contextual menu dựa trên trạng thái màn hình và cạnh tranh không gian với keyboard/footer.
  3. Bổ sung chống thao tác nhầm, trạng thái loading, confirmation và khả năng undo khi hợp lý.
- **Đầu ra/file dự kiến:**
  - `references/decisions/actions.md`
  - `evals/decisions/actions-cases.md`
- **Definition of Done (DoD):**
  - [ ] Primary action tìm thấy được, không che content.
  - [ ] Không giảm an toàn của destructive operations.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-05 — Mobile content hierarchy & progressive disclosure

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-02.
- **Các bước thực hiện:**
  1. Định nghĩa cách xếp ưu tiên thông tin theo tác vụ, không đơn thuần ẩn mọi nội dung thứ cấp.
  2. Mô tả patterns accordion/details, summary/detail, sticky context header, long text và localization.
  3. Đưa kịch bản có nội dung dài, zoom lớn, tên sản phẩm và ID dài.
- **Đầu ra/file dự kiến:**
  - `references/decisions/content-hierarchy.md`
  - `evals/decisions/content-cases.md`
- **Definition of Done (DoD):**
  - [ ] Thông tin bắt buộc luôn có đường truy cập.
  - [ ] Màn hình nhỏ và phóng to không cắt mất nội dung quan trọng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-06 — Dialog, drawer, bottom sheet & overlays

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-01, P02-04.
- **Các bước thực hiện:**
  1. Quy định khi chọn dialog/modal/drawer/bottom sheet/full page dựa trên độ phức tạp và nội dung.
  2. Ghi rõ focus trap, close/escape, scroll lock, keyboard, safe-area và z-index.
  3. Có phản ví dụ khi bottom sheet khiến form dài khó dùng.
- **Đầu ra/file dự kiến:**
  - `references/decisions/overlays.md`
  - `evals/decisions/overlays-cases.md`
- **Definition of Done (DoD):**
  - [ ] Không mất focus hoặc mắc kẹt trong overlay.
  - [ ] Close/cancel/back luôn rõ và hoạt động.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-07 — Touch interactions & discoverability

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-01, P02-04.
- **Các bước thực hiện:**
  1. Xây quy tắc vùng chạm, spacing, tap feedback, gestures và scroll conflicts phù hợp web.
  2. Không coi swipe/long-press là cách duy nhất làm tác vụ quan trọng.
  3. Đưa kiểm tra tương tác không phụ thuộc hover, phù hợp cả bàn phím và touch.
- **Đầu ra/file dự kiến:**
  - `references/decisions/touch-interactions.md`
- **Definition of Done (DoD):**
  - [ ] Có phương án thao tác hiển thị được, không dựa gesture-only.
  - [ ] Phân biệt khuyến nghị kích thước thao tác và chuẩn WCAG hiện hành.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-08 — Mobile accessibility rules

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có principles cơ bản · **Phụ thuộc:** P02-01, P02-02, P02-03.
- **Các bước thực hiện:**
  1. Ghi checklist WCAG web cho controls/labels/focus/contrast/zoom/text reflow phù hợp mobile.
  2. Kiểm tra semantic HTML và cách công bố trạng thái loading, error, expanded.
  3. Nguồn và phiên bản tiêu chuẩn được ghi rõ; tách web CSS px khỏi kích thước pt/dp native.
- **Đầu ra/file dự kiến:**
  - `references/decisions/accessibility.md`
  - `evals/accessibility-checklist.md`
- **Definition of Done (DoD):**
  - [ ] Những claim WCAG có nguồn chuẩn và mức tương ứng.
  - [ ] Không hy sinh accessibility để làm UI 'gọn'.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-09 — Chuẩn hóa Mobile UX decision contract

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có decision record sơ bộ · **Phụ thuộc:** P02-01, P02-02, P02-03.
- **Các bước thực hiện:**
  1. Thiết kế output ngắn gọn: observation/evidence, mobile task, candidate patterns, selected, rejected, preserved, verify.
  2. Thêm quy tắc chỉ hỏi user khi thiếu quyết định nghiệp vụ cốt lõi hoặc rủi ro cao; còn lại AI phải tự chọn.
  3. Sửa `SKILL.md` chỉ để tham chiếu playbook/contract, không nhét cả kho quy tắc vào file chính.
- **Đầu ra/file dự kiến:**
  - `references/decision-contract.md`
  - `SKILL.md`
- **Definition of Done (DoD):**
  - [ ] Một prompt phổ thông tạo quyết định giải thích được.
  - [ ] Không phát sinh câu hỏi kiểu 'bạn muốn bottom sheet hay drawer?' nếu đủ bối cảnh.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-10 — Đánh giá chất lượng UX decision có đối chứng

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-00, P02-09.
- **Các bước thực hiện:**
  1. Tạo ít nhất 3 test cases cho từng playbook P0, gồm tình huống không nên áp dụng pattern phổ biến.
  2. Dùng cùng baseline/prompts khi chạy không skill và có skill.
  3. Reviewer kiểm tra sự phù hợp của quyết định; lưu false choices để cải tiến rule.
- **Đầu ra/file dự kiến:**
  - `evals/results/decision-evaluation.md`
  - `evals/decisions/`
- **Definition of Done (DoD):**
  - [ ] Có trường hợp so sánh đã chạy và được lưu; chưa chạy thì ghi NOT RUN.
  - [ ] Mỗi sửa rule liên kết tới test case gây lỗi.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [ ] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

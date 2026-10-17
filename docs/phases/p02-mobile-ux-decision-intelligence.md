# P02 — Mobile UX Decision Intelligence

> Dạy AI tự chọn pattern UX mobile web dựa vào tác vụ và bối cảnh, không bắt vibe coder phải là designer.

**Đối chiếu hiện trạng:** 17/10/2026, base HEAD `4ad759f`. Checklist và trạng thái từng task bên dưới phản ánh source và bằng chứng được dẫn trực tiếp tại từng task. Đây là hồ sơ tiến độ có thể cập nhật; Git lưu lịch sử kế hoạch ban đầu.

## Kết quả cần đạt

Có fixture baseline đầu tiên + các playbook giải thích được điều kiện, trade-offs, anti-patterns và có evaluation cases.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. `[x]` chỉ xác nhận đúng tiêu chí và phạm vi bằng chứng ghi tại task; `[ ]` là chưa đạt hoặc chưa đủ bằng chứng. Task có thể còn **MỘT PHẦN** dù DoD trên fixture đã đạt, khi đầu ra hướng dẫn hoặc coverage dự kiến vẫn thiếu. Không suy ra phase hoàn tất từ việc file đã tồn tại.

### P02-00 — Dựng runnable baseline đầu tiên — Order Dashboard

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trên fixture · **Phụ thuộc:** P00-03, P00-04.
- **Bằng chứng / còn thiếu:** [Baseline](../../evals/fixtures/order-dashboard/README.md), [baseline evidence](../../evals/results/order-dashboard-baseline.md) và [order suite](../../tests/task-ux/order.spec.cjs) chứng minh runnable app, lỗi sideways-scroll và desktop invariants. Kết quả build/browser được ghi tại [task evidence](../../tests/reports/task-ux-evidence.md); không gọi đó là skill benchmark.
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
  - [x] Fixture chạy offline với mock data; có hướng dẫn tái hiện.
  - [x] Lỗi UX có thể quan sát trên 390px và desktop baseline vẫn hợp lệ.
  - [x] Không giả mạo kết quả benchmark skill.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-01 — Navigation decision playbook

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-00.
- **Bằng chứng / còn thiếu:** [Playbook](../../references/decisions/navigation.md) và [cases](../../evals/decisions/navigation-cases.md) có alternatives/rejection/preservation. Drawer/Back có [order checks](../../tests/task-ux/order.spec.cjs); chưa có đủ navigation scenario hoặc actual authorization để xác nhận preservation toàn task.
- **Các bước thực hiện:**
  1. Mở rộng `references/decisions/navigation.md` thành conditions → alternatives → reject when.
  2. Bao quát bottom nav, grouped drawer/menu, local tabs, contextual action, breadcrumb/back và deep-link.
  3. Thử với 3 tình huống: dashboard nhiều tuyến, web bán hàng, web tác vụ tần suất cao; xác định khi nào KHÔNG dùng bottom bar.
- **Đầu ra/file dự kiến:**
  - `references/decisions/navigation.md`
  - `evals/decisions/navigation-cases.md`
- **Definition of Done (DoD):**
  - [x] Mỗi quyết định có lý do, phương án loại, quy tắc preservation.
  - [ ] Bảo toàn browser Back, routes và phân quyền.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-02 — Data display & table decision playbook

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trên order/comparison fixtures · **Phụ thuộc:** P02-00.
- **Bằng chứng / còn thiếu:** [Data playbook](../../references/decisions/data-display.md), [order suite](../../tests/task-ux/order.spec.cjs) và [comparison suite](../../tests/task-ux/comparison.spec.cjs) giữ comparison alignment và order handlers. Câu status/action trong [SKILL](../../SKILL.md) còn áp quá rộng cho individual-record tasks; cần giới hạn vào các trường/action có trong sản phẩm.
- **Các bước thực hiện:**
  1. Mở rộng `data-display.md` cho mục tiêu scan, compare, filter, bulk-edit, dense data.
  2. Đưa rule chuyển table → cards/list chỉ khi phù hợp, giữ horizontal table khi cần so sánh; đảm bảo tất cả field/actions vẫn tới được.
  3. Kiểm tra fixture order-dashboard và 2 phản ví dụ (bảng so sánh giá, bảng bulk select).
- **Đầu ra/file dự kiến:**
  - `references/decisions/data-display.md`
  - `evals/decisions/data-display-cases.md`
- **Definition of Done (DoD):**
  - [x] Không biến mọi table thành card một cách mặc định.
  - [x] Không mất sort/filter/bulk actions/record identity hay data semantics.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-03 — Mobile forms decision playbook

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trong headless scope · **Phụ thuộc:** P00-03.
- **Bằng chứng / còn thiếu:** [Forms playbook](../../references/decisions/forms.md), [retrofit evidence](../../tests/reports/retrofit-261015-browser-evidence.md) và [request suite](../../tests/task-ux/request-form.spec.cjs) có validation/recovery/focus và reduced-height clearance. Không gọi giảm chiều cao viewport là virtual keyboard; physical keyboard NOT RUN.
- **Các bước thực hiện:**
  1. Bổ sung rule loại bàn phím, autocomplete, inputmode, labels, error association, submit/keyboard overlap.
  2. Phân biệt form ngắn và multi-step form dài; quy tắc không bắt nhập lại khi validation fail.
  3. Thử ở form có lỗi server và bàn phím ảo giả lập; ghi những kiểm thử cần máy thật.
- **Đầu ra/file dự kiến:**
  - `references/decisions/forms.md`
  - `evals/decisions/forms-cases.md`
- **Definition of Done (DoD):**
  - [x] Không xóa validation, không chặn paste/zoom.
  - [x] Keyboard không che trường cần sửa hoặc tác vụ quan trọng trong môi trường được kiểm thử.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-04 — Action hierarchy & sticky CTA

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-01.
- **Bằng chứng / còn thiếu:** [Actions guidance](../../references/decisions/actions.md), [cases](../../evals/decisions/actions-cases.md) và [order/form checks](../../tests/reports/task-ux-evidence.md) bao phủ primary action. Destructive operations chưa có executable safety replay.
- **Các bước thực hiện:**
  1. Phân loại primary/secondary/destructive actions theo tần suất và hậu quả.
  2. Chọn inline/sticky/contextual menu dựa trên trạng thái màn hình và cạnh tranh không gian với keyboard/footer.
  3. Bổ sung chống thao tác nhầm, trạng thái loading, confirmation và khả năng undo khi hợp lý.
- **Đầu ra/file dự kiến:**
  - `references/decisions/actions.md`
  - `evals/decisions/actions-cases.md`
- **Definition of Done (DoD):**
  - [x] Primary action tìm thấy được, không che content.
  - [ ] Không giảm an toàn của destructive operations.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-05 — Mobile content hierarchy & progressive disclosure

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-02.
- **Bằng chứng / còn thiếu:** [Content guidance](../../references/decisions/content-hierarchy.md) và [order checks](../../tests/task-ux/order.spec.cjs) giữ detail route/long labels. Zoom/text resize và localized content chưa có kết quả đầy đủ.
- **Các bước thực hiện:**
  1. Định nghĩa cách xếp ưu tiên thông tin theo tác vụ, không đơn thuần ẩn mọi nội dung thứ cấp.
  2. Mô tả patterns accordion/details, summary/detail, sticky context header, long text và localization.
  3. Đưa kịch bản có nội dung dài, zoom lớn, tên sản phẩm và ID dài.
- **Đầu ra/file dự kiến:**
  - `references/decisions/content-hierarchy.md`
  - `evals/decisions/content-cases.md`
- **Definition of Done (DoD):**
  - [x] Thông tin bắt buộc luôn có đường truy cập.
  - [ ] Màn hình nhỏ và phóng to không cắt mất nội dung quan trọng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-06 — Dialog, drawer, bottom sheet & overlays

- **Ưu tiên:** `P1` · **Trạng thái:** ĐẠT DoD trên order drawer · **Phụ thuộc:** P02-01, P02-04.
- **Bằng chứng / còn thiếu:** [Overlay guidance](../../references/decisions/overlays.md) và [order drawer checks](../../tests/task-ux/order.spec.cjs) kiểm tra close/Escape/backdrop/focus return. [Overlay cases](../../evals/decisions/overlays-cases.md) ngoài fixture vẫn INFERRED/NOT RUN; không suy rộng sang mọi modal/sheet.
- **Các bước thực hiện:**
  1. Quy định khi chọn dialog/modal/drawer/bottom sheet/full page dựa trên độ phức tạp và nội dung.
  2. Ghi rõ focus trap, close/escape, scroll lock, keyboard, safe-area và z-index.
  3. Có phản ví dụ khi bottom sheet khiến form dài khó dùng.
- **Đầu ra/file dự kiến:**
  - `references/decisions/overlays.md`
  - `evals/decisions/overlays-cases.md`
- **Definition of Done (DoD):**
  - [x] Không mất focus hoặc mắc kẹt trong overlay.
  - [x] Close/cancel/back luôn rõ và hoạt động.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-07 — Touch interactions & discoverability

- **Ưu tiên:** `P1` · **Trạng thái:** ĐẠT DoD hướng dẫn · **Phụ thuộc:** P02-01, P02-04.
- **Bằng chứng / còn thiếu:** [Touch guidance](../../references/decisions/touch-interactions.md) yêu cầu visible alternatives và phân biệt AA/AAA/project target; [order suite](../../tests/task-ux/order.spec.cjs) đo hit regions/focus. Physical touch/scroll conflicts chưa được kiểm tra.
- **Các bước thực hiện:**
  1. Xây quy tắc vùng chạm, spacing, tap feedback, gestures và scroll conflicts phù hợp web.
  2. Không coi swipe/long-press là cách duy nhất làm tác vụ quan trọng.
  3. Đưa kiểm tra tương tác không phụ thuộc hover, phù hợp cả bàn phím và touch.
- **Đầu ra/file dự kiến:**
  - `references/decisions/touch-interactions.md`
- **Definition of Done (DoD):**
  - [x] Có phương án thao tác hiển thị được, không dựa gesture-only.
  - [x] Phân biệt khuyến nghị kích thước thao tác và chuẩn WCAG hiện hành.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-08 — Mobile accessibility rules

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-01, P02-02, P02-03.
- **Bằng chứng / còn thiếu:** [Accessibility rules](../../references/decisions/accessibility.md) và [checklist](../../references/accessibility-checklist.md) gắn nguồn/mức tiêu chuẩn. Automated fixture checks không đủ xác nhận toàn bộ zoom/screen-reader accessibility; [A11Y-03](../../evals/decisions/accessibility-cases.md) còn so modal hợp lệ với overlay thiếu focus management, chưa có hai phương án khả thi.
- **Các bước thực hiện:**
  1. Ghi checklist WCAG web cho controls/labels/focus/contrast/zoom/text reflow phù hợp mobile.
  2. Kiểm tra semantic HTML và cách công bố trạng thái loading, error, expanded.
  3. Nguồn và phiên bản tiêu chuẩn được ghi rõ; tách web CSS px khỏi kích thước pt/dp native.
- **Đầu ra/file dự kiến:**
  - `references/decisions/accessibility.md`
  - `evals/accessibility-checklist.md`
- **Definition of Done (DoD):**
  - [x] Những claim WCAG có nguồn chuẩn và mức tương ứng.
  - [ ] Không hy sinh accessibility để làm UI 'gọn'.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-09 — Chuẩn hóa Mobile UX decision contract

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trong targeted Tier A · **Phụ thuộc:** P02-01, P02-02, P02-03.
- **Bằng chứng / còn thiếu:** [Contract](../../references/decision-contract.md) được [SKILL](../../SKILL.md) tham chiếu; [Tier A replay](../../tests/reports/regression-261015-tier-a.md) có prompt phổ thông và quyết định/counterexample, không bắt user chọn thuật ngữ. Không suy rộng thành hiệu quả trên mọi prompt.
- **Các bước thực hiện:**
  1. Thiết kế output ngắn gọn: observation/evidence, mobile task, candidate patterns, selected, rejected, preserved, verify.
  2. Thêm quy tắc chỉ hỏi user khi thiếu quyết định nghiệp vụ cốt lõi hoặc rủi ro cao; còn lại AI phải tự chọn.
  3. Sửa `SKILL.md` chỉ để tham chiếu playbook/contract, không nhét cả kho quy tắc vào file chính.
- **Đầu ra/file dự kiến:**
  - `references/decision-contract.md`
  - `SKILL.md`
- **Definition of Done (DoD):**
  - [x] Một prompt phổ thông tạo quyết định giải thích được.
  - [x] Không phát sinh câu hỏi kiểu 'bạn muốn bottom sheet hay drawer?' nếu đủ bối cảnh.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P02-10 — Đánh giá chất lượng UX decision có đối chứng

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN; Tier B NOT RUN · **Phụ thuộc:** P02-00, P02-09.
- **Bằng chứng / còn thiếu:** [Cases](../../evals/decisions/) và [exploratory pair](../../evals/results/decision-evaluation.md) đã lưu, nhưng chưa có controlled pair hợp protocol. [Tier A](../../tests/reports/regression-261015-tier-a.md) không sửa rule vì không tái hiện lỗi; chưa có chu trình rule-repair/replay để xác nhận DoD thứ hai.
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
- [x] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp (xem trạng thái/bằng chứng từng task).

Phase chưa đóng: các task bắt buộc hoặc bằng chứng toàn phạm vi còn mở; không đánh dấu các exit gate còn lại chỉ dựa vào structural/browser PASS.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

## Visual foundation update — 2026-10-17

Runtime 0.2.0 adds source-owned discovery, a compact Information Priority Map, conditional hierarchy/density guidance and semantic-color/contrast correction within the existing accessibility/content playbooks. New [accessibility cases](../../evals/decisions/accessibility-cases.md) and [conflicting hierarchy cases](../../evals/decisions/content-cases.md) are reasoned examples, not executed consumer results. The [replay rubric](../../evals/visual-replay-protocol.md) is frozen before new fixtures.

Rendered contrast, broader state coverage and fresh-session implementation replay remain NOT RUN for this revision until their owning execution gates complete. Existing partial DoD and historical results above retain their original limits; this guidance update does not close P02.

# P04 — Verification, Regression & Skill Evaluation

> Đo những thay đổi UX bằng tác vụ và bằng chứng trước/sau; kiểm tra cả tác động phụ lên desktop.

**Mốc kiểm tra:** branch `main`, commit `62505f6f161b` (12/10/2026). Trạng thái trong tài liệu là đánh giá lúc lập kế hoạch, không tự động đồng bộ với repo; kiểm tra lại trước khi triển khai. `SKILL.md`, README, docs, 3 playbook, scenario specs và CI cấu trúc đã tồn tại; runnable fixtures, UX e2e và A/B chưa có.

## Kết quả cần đạt

Ba scenario Dashboard/Navigation/Form có executable checks và report lặp lại được; MVP release gate không chỉ dựa CI cấu trúc.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. Dấu **Đã có bản nháp** chỉ xác nhận đã có tài liệu, **không** đồng nghĩa có UX validation.

### P04-01 — Tạo Playwright test harness

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P02-00.
- **Các bước thực hiện:**
  1. Cài test dependencies chỉ trong fixture/evals workspace, tránh bắt user cài cho skill runtime.
  2. Cấu hình browser/device emulation, base URL, mock data ổn định và artifacts directory.
  3. Thêm script chạy local/CI có hướng dẫn rõ.
- **Đầu ra/file dự kiến:**
  - `evals/playwright.config.*`
  - `evals/tests/`
  - Hướng dẫn runner
- **Definition of Done (DoD):**
  - [ ] Smoke test mở fixture thành công và lưu report.
  - [ ] Không tuyên bố emulation bằng kiểm thử iPhone/Android thực.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-02 — Chụp baseline và ghi bằng chứng reproducible

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P04-01.
- **Các bước thực hiện:**
  1. Chốt baseline commit/hash của fixture cho từng scenario.
  2. Lưu screenshots cùng viewport/device/browser info, trạng thái mock data, test steps.
  3. Ghi file naming và retention policy tránh ảnh có dữ liệu nhạy cảm.
- **Đầu ra/file dự kiến:**
  - `evals/results/baselines/`
  - `evals/evidence-template.md`
- **Definition of Done (DoD):**
  - [ ] Ảnh/log có thể tái tạo từ baseline cố định.
  - [ ] Không lưu secret, PII hay screenshot private project.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-03 — Kiểm tra layout trên nhiều viewport

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P04-01.
- **Các bước thực hiện:**
  1. Chạy width 320, 375, 390, 430 CSS px và một tablet/desktop representative.
  2. Kiểm tra unwanted document overflow, clipping, text reflow, tap target bị che, fixed/sticky overlap.
  3. Không đánh đồng phép đo width pass với kết luận UX tốt.
- **Đầu ra/file dự kiến:**
  - `evals/tests/responsive.spec.*`
- **Definition of Done (DoD):**
  - [ ] Kết quả có viewport/route/ảnh khi fail.
  - [ ] Khả năng đọc và tương tác không mất do breakpoint.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-04 — End-to-end task: Dashboard

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P03-01, P04-01.
- **Các bước thực hiện:**
  1. Test tìm order → xem status → mở details → action → Back.
  2. Đảm bảo mock permissions/actions giữ nguyên.
  3. Lưu before/after behavior, fail reproduction và desktop comparisons.
- **Đầu ra/file dự kiến:**
  - `evals/tests/dashboard.spec.*`
  - `evals/results/dashboard.md`
- **Definition of Done (DoD):**
  - [ ] Task hoàn thành trên mobile test viewport.
  - [ ] Không đánh tráo success bằng cách bỏ bước/ẩn action.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-05 — End-to-end task: Navigation

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P04-01, P02-01.
- **Các bước thực hiện:**
  1. Dựng fixture/navigation path từ scenario C nếu chưa có.
  2. Test menu discovery, active state, page transitions, deep-link và browser Back.
  3. Kiểm tra user có thể truy cập secondary destinations và keyboard navigation.
- **Đầu ra/file dự kiến:**
  - `evals/fixtures/navigation/`
  - `evals/tests/navigation.spec.*`
- **Definition of Done (DoD):**
  - [ ] Task hoạt động đúng và Back không bị phá.
  - [ ] Không lộ mục không được phép truy cập.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-06 — End-to-end task: Forms

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P04-01, P02-03.
- **Các bước thực hiện:**
  1. Dựng fixture form scenario B có client/server error simulation nếu chưa có.
  2. Test nhập dữ liệu, validation, sửa lỗi, submit và input persistence.
  3. Kiểm tra keyboard/focus bằng emulation và ghi rõ hạng mục cần device thật.
- **Đầu ra/file dự kiến:**
  - `evals/fixtures/form/`
  - `evals/tests/form.spec.*`
- **Definition of Done (DoD):**
  - [ ] Form submit được sau khi sửa lỗi; data không mất.
  - [ ] Không có controls thiết yếu bị che trong test environment.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-07 — Accessibility & long-content regression

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P04-03.
- **Các bước thực hiện:**
  1. Kiểm tra semantics, labels, focus order, focus visibility, keyboard-only paths.
  2. Bổ sung zoom/text scaling, localized long labels, reduced-motion, non-gesture alternatives.
  3. Có thể tích hợp automated accessibility checker nhưng không coi đó là chứng nhận WCAG hoàn chỉnh.
- **Đầu ra/file dự kiến:**
  - `evals/tests/accessibility.spec.*`
  - `evals/accessibility-checklist.md`
- **Definition of Done (DoD):**
  - [ ] Không có failure nghiêm trọng trong các luồng P0.
  - [ ] Các manual checks cần thiết được liệt kê minh bạch.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-08 — Desktop + shared component regression

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P03-04, P04-01.
- **Các bước thực hiện:**
  1. Chụp baseline desktop trước mỗi patch quan trọng.
  2. So sánh navigation, table, forms và thao tác desktop cốt lõi.
  3. Điều tra mọi thay đổi khác biệt không thuộc phạm vi mobile.
- **Đầu ra/file dự kiến:**
  - `evals/tests/desktop-regression.spec.*`
  - Regression report
- **Definition of Done (DoD):**
  - [ ] Không có lỗi blocking hoặc thay đổi nghiệp vụ.
  - [ ] Các visual diffs được review chứ không chỉ dựa pixel delta.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-09 — Controlled comparison: with vs without skill

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P00-05, P04-04, P04-05, P04-06.
- **Các bước thực hiện:**
  1. Chạy cùng model/prompt/baseline/tool permissions trên nhánh riêng có/không skill.
  2. Thu thập task completion, integrity, accessibility, regressions và human review.
  3. Ghi rõ các yếu tố nhiễu và giới hạn mẫu; không suy rộng từ một lần chạy.
- **Đầu ra/file dự kiến:**
  - `evals/results/skill-comparison.md`
- **Definition of Done (DoD):**
  - [ ] Có kết quả thật cho cả 2 điều kiện.
  - [ ] Tác động do skill không bị đánh đồng với khác biệt prompt hoặc source.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-10 — Release gate: Verified MVP

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P04-04 → P04-09.
- **Các bước thực hiện:**
  1. Tổng hợp evidence, known limitations và failures còn mở cho cả 3 scenario.
  2. Xác nhận high-severity P0 test không fail hoặc ghi rõ blocker trước khi release.
  3. Chỉnh README 'project status' phản ánh đúng kết quả test.
- **Đầu ra/file dự kiến:**
  - `evals/results/release-readiness.md`
  - Release notes
- **Definition of Done (DoD):**
  - [ ] Có bảng PASS/FAIL/NOT RUN theo scenario, commit và môi trường.
  - [ ] Không gắn nhãn verified MVP khi chỉ có structural CI.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [ ] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

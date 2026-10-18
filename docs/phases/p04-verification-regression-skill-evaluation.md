# P04 — Verification, Regression & Skill Evaluation

> Đo những thay đổi UX bằng tác vụ và bằng chứng trước/sau; kiểm tra cả tác động phụ lên desktop.

**Đối chiếu hiện trạng:** 17/10/2026, base HEAD `4ad759f`. Checklist và trạng thái từng task bên dưới phản ánh source và bằng chứng được dẫn trực tiếp tại từng task. Đây là hồ sơ tiến độ có thể cập nhật; Git lưu lịch sử kế hoạch ban đầu.

## Kết quả cần đạt

Ba scenario Dashboard/Navigation/Form có executable checks và report lặp lại được; MVP release gate không chỉ dựa CI cấu trúc.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. `[x]` chỉ xác nhận đúng tiêu chí và phạm vi bằng chứng ghi tại task; `[ ]` là chưa đạt hoặc chưa đủ bằng chứng. Task có thể còn **MỘT PHẦN** dù DoD trên fixture đã đạt, khi đầu ra hướng dẫn hoặc coverage dự kiến vẫn thiếu. Không suy ra phase hoàn tất từ việc file đã tồn tại.

### P04-01 — Tạo Playwright test harness

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD headless harness · **Phụ thuộc:** P02-00.
- **Bằng chứng / còn thiếu:** [Playwright config](../../tests/task-ux/playwright.config.cjs), [package](../../tests/task-ux/package.json), [CI](../../.github/workflows/validate.yml) và [executed task evidence](../../tests/reports/task-ux-evidence.md). Harness thực tế nằm ở tests/task-ux, không phải các path evals dự kiến.
- **Các bước thực hiện:**
  1. Cài test dependencies chỉ trong fixture/evals workspace, tránh bắt user cài cho skill runtime.
  2. Cấu hình browser/device emulation, base URL, mock data ổn định và artifacts directory.
  3. Thêm script chạy local/CI có hướng dẫn rõ.
- **Đầu ra/file dự kiến:**
  - `evals/playwright.config.*`
  - `evals/tests/`
  - Hướng dẫn runner
- **Definition of Done (DoD):**
  - [x] Smoke test mở fixture thành công và lưu report.
  - [x] Không tuyên bố emulation bằng kiểm thử iPhone/Android thực.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-02 — Chụp baseline và ghi bằng chứng reproducible

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P04-01.
- **Bằng chứng / còn thiếu:** [Baseline commit/hash và screenshots](../../tests/reports/retrofit-261015-browser-evidence.md) đã có cho dashboard/form; navigation baseline chưa có. [Archive redactor](../../scripts/archive-comparison-case.py) mới bao phủ dạng home Linux và exact project/source paths, chưa đủ các dạng Windows/WSL, nên chưa đóng privacy/retention DoD toàn task.
- **Các bước thực hiện:**
  1. Chốt baseline commit/hash của fixture cho từng scenario.
  2. Lưu screenshots cùng viewport/device/browser info, trạng thái mock data, test steps.
  3. Ghi file naming và retention policy tránh ảnh có dữ liệu nhạy cảm.
- **Đầu ra/file dự kiến:**
  - `evals/results/baselines/`
  - `evals/evidence-template.md`
- **Definition of Done (DoD):**
  - [x] Ảnh/log có thể tái tạo từ baseline cố định.
  - [ ] Không lưu secret, PII hay screenshot private project.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-03 — Kiểm tra layout trên nhiều viewport

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P04-01.
- **Bằng chứng / còn thiếu:** [Historical viewport observations](../../tests/reports/retrofit-261015-browser-evidence.md) và [current tests](../../tests/task-ux/) ghi viewport/route, có screenshots theo cấu hình. Chưa đủ zoom/text resize, tất cả breakpoint/scenario và navigation để xác nhận DoD readability/interaction toàn task.
- **Các bước thực hiện:**
  1. Chạy width 320, 375, 390, 430 CSS px và một tablet/desktop representative.
  2. Kiểm tra unwanted document overflow, clipping, text reflow, tap target bị che, fixed/sticky overlap.
  3. Không đánh đồng phép đo width pass với kết luận UX tốt.
- **Đầu ra/file dự kiến:**
  - `evals/tests/responsive.spec.*`
- **Definition of Done (DoD):**
  - [x] Kết quả có viewport/route/ảnh khi fail.
  - [ ] Khả năng đọc và tương tác không mất do breakpoint.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-04 — End-to-end task: Dashboard

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trên dashboard fixture · **Phụ thuộc:** P03-01, P04-01.
- **Bằng chứng / còn thiếu:** [Order suite](../../tests/task-ux/order.spec.cjs) kiểm tra task, actions including Delivered, hidden selection và desktop. [Task evidence](../../tests/reports/task-ux-evidence.md) ghi kết quả suite; không thay task bằng việc ẩn action.
- **Các bước thực hiện:**
  1. Test tìm order → xem status → mở details → action → Back.
  2. Đảm bảo mock permissions/actions giữ nguyên.
  3. Lưu before/after behavior, fail reproduction và desktop comparisons.
- **Đầu ra/file dự kiến:**
  - `evals/tests/dashboard.spec.*`
  - `evals/results/dashboard.md`
- **Definition of Done (DoD):**
  - [x] Task hoàn thành trên mobile test viewport.
  - [x] Không đánh tráo success bằng cách bỏ bước/ẩn action.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-05 — End-to-end task: Navigation

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P04-01, P02-01.
- **Bằng chứng / còn thiếu:** [Original navigation scenario](../../evals/scenarios/navigation.md) có baseline/candidate và [navigation suite](../../tests/task-ux/navigation.spec.cjs) kiểm edit/save/Cancel/Back, secondary destinations, direct routes, local viewer guards, keyboard/dismissal/resize và modified links. Sáu focused checks đã chạy đạt; local role fixture không phải production authorization.
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

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD trong headless scope · **Phụ thuộc:** P04-01, P02-03.
- **Bằng chứng / còn thiếu:** [Mobile-form retrofit checks](../../tests/261015-retrofit/form-browser-check.cjs) và [request suite](../../tests/task-ux/request-form.spec.cjs) chứng minh retention/recovery/focus/clearance; [evidence limits](../../tests/reports/task-ux-evidence.md) giữ physical keyboard NOT RUN. Thực tế fixture là mobile-form/request-form thay path form dự kiến.
- **Các bước thực hiện:**
  1. Dựng fixture form scenario B có client/server error simulation nếu chưa có.
  2. Test nhập dữ liệu, validation, sửa lỗi, submit và input persistence.
  3. Kiểm tra keyboard/focus bằng emulation và ghi rõ hạng mục cần device thật.
- **Đầu ra/file dự kiến:**
  - `evals/fixtures/form/`
  - `evals/tests/form.spec.*`
- **Definition of Done (DoD):**
  - [x] Form submit được sau khi sửa lỗi; data không mất.
  - [x] Không có controls thiết yếu bị che trong test environment.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-07 — Accessibility & long-content regression

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P04-03.
- **Bằng chứng / còn thiếu:** [Order/request focus checks](../../tests/task-ux/) và [axe retrofit record](../../tests/reports/retrofit-261015-browser-evidence.md) có phạm vi hạn chế. [Manual limits](../../tests/reports/task-ux-evidence.md) liệt kê screen reader/zoom; chưa đủ mọi luồng P0 để đóng DoD không có failure nghiêm trọng.
- **Các bước thực hiện:**
  1. Kiểm tra semantics, labels, focus order, focus visibility, keyboard-only paths.
  2. Bổ sung zoom/text scaling, localized long labels, reduced-motion, non-gesture alternatives.
  3. Có thể tích hợp automated accessibility checker nhưng không coi đó là chứng nhận WCAG hoàn chỉnh.
- **Đầu ra/file dự kiến:**
  - `evals/tests/accessibility.spec.*`
  - `evals/accessibility-checklist.md`
- **Definition of Done (DoD):**
  - [ ] Không có failure nghiêm trọng trong các luồng P0.
  - [x] Các manual checks cần thiết được liệt kê minh bạch.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P04-08 — Desktop + shared component regression

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P03-04, P04-01.
- **Bằng chứng / còn thiếu:** [Browser suite](../../tests/task-ux/) có desktop order/comparison và [retrofit report](../../tests/reports/retrofit-261015-browser-evidence.md) có trước/sau; chưa có visual-diff review đầy đủ cho mọi patch/shared component và navigation. Không biến functional PASS thành visual approval.
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

- **Ưu tiên:** `P1` · **Trạng thái:** NOT RUN theo Tier B · **Phụ thuộc:** P00-05, P04-04, P04-05, P04-06.
- **Bằng chứng / còn thiếu:** [Protocol](../../evals/comparison-protocol.md) và [evaluation record](../../evals/results/decision-evaluation.md) ghi rõ exploratory pairs không đủ controls/isolation; chưa có hai điều kiện hợp chuẩn và independent review cho controlled claim.
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

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN; chưa đạt Verified MVP · **Phụ thuộc:** P04-04 → P04-09.
- **Bằng chứng / còn thiếu:** [Task evidence](../../tests/reports/task-ux-evidence.md) và [README status](../../README.md) giới hạn useful alpha. Chưa có đủ Dashboard/Navigation/Form evidence; Tier B và device/human checks còn mở. Không đóng release gate chỉ vì CI xanh.
- **Các bước thực hiện:**
  1. Tổng hợp evidence, known limitations và failures còn mở cho cả 3 scenario.
  2. Xác nhận high-severity P0 test không fail hoặc ghi rõ blocker trước khi release.
  3. Chỉnh README 'project status' phản ánh đúng kết quả test.
- **Đầu ra/file dự kiến:**
  - `evals/results/release-readiness.md`
  - Release notes
- **Definition of Done (DoD):**
  - [ ] Có bảng PASS/FAIL/NOT RUN theo scenario, commit và môi trường.
  - [x] Không gắn nhãn verified MVP khi chỉ có structural CI.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [x] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp (xem trạng thái/bằng chứng từng task).

Phase chưa đóng: các task bắt buộc hoặc bằng chứng toàn phạm vi còn mở; không đánh dấu các exit gate còn lại chỉ dựa vào structural/browser PASS.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

## Current bounded implementation — 2026-10-18

The [original navigation contract](../../evals/scenarios/navigation.md) has a baseline/candidate pair and [six focused behavioral/accessibility tests](../../tests/task-ux/navigation.spec.cjs), executed locally with zero unexpected/skipped results. The local viewer/editor fixture is not production authentication. Current-run provenance is checked by the [evidence verifier](../../tests/task-ux/verify-evidence.py); focused results alone do not establish a clean full-suite run.

The [visual suite](../../tests/task-ux/visual-states.spec.cjs) defines25 normal width/journey combinations and18 real risk-state references, plus five explicitly labeled resize proxies, an expected-negative action probe and desktop scrolling/long-content assertions. [Baseline registry](../../tests/task-ux/visual-baselines.json) contains43 independently reviewed revised references. The [font harness](../../tests/task-ux/visual-fonts.cjs) pins regular/bold bytes and checks rendered text faces. Original references remain intact; revised paths record a deliberate native-to-webfont environment change and two mobile readability repairs. Ordinary non-update visual/contrast/accessibility verification passed62 checks. Exact captured image bytes must match approved references; bounded capture attempts are retained. This is not a general UX or pixel-preservation claim across environments.

Actual headed400% browser zoom and200% text-only review are NOT RUN while the browser capability is unavailable. These pending checks, human/device limits and Tier B remain open; no Verified MVP claim follows from fixture coverage. Earlier task sections are historical gaps until their required full evidence is reconciled.

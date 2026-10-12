# P00 — Product Scope & Evaluation Design

> Xác định rõ người dùng không chuyên UI/UX, giới hạn sản phẩm và cách đánh giá một cải thiện mobile UX có thật.

**Mốc kiểm tra:** branch `main`, commit `62505f6f161b` (12/10/2026). Trạng thái trong tài liệu là đánh giá lúc lập kế hoạch, không tự động đồng bộ với repo; kiểm tra lại trước khi triển khai. `SKILL.md`, README, docs, 3 playbook, scenario specs và CI cấu trúc đã tồn tại; runnable fixtures, UX e2e và A/B chưa có.

## Kết quả cần đạt

Tài liệu phạm vi + bộ kịch bản đánh giá chuẩn hóa; chưa coi scenario mô tả là fixture chạy được.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. Dấu **Đã có bản nháp** chỉ xác nhận đã có tài liệu, **không** đồng nghĩa có UX validation.

### P00-01 — Chốt persona và job-to-be-done

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Đã có bản nháp · **Phụ thuộc:** —.
- **Các bước thực hiện:**
  1. Đối chiếu `docs/product-scope.md` với mục tiêu: vibe coder có web responsive nhưng UX mobile chưa tốt.
  2. Mô tả ít nhất 2 persona (vibe coder, developer không chuyên UX) và nhu cầu khác biệt.
  3. Viết 3 prompt tự nhiên của người dùng; tránh jargon như 'bottom sheet' hoặc 'IA'.
- **Đầu ra/file dự kiến:**
  - `docs/product-scope.md` cập nhật
  - `evals/prompts/non-designer-prompts.md`
- **Definition of Done (DoD):**
  - [ ] Persona nêu rõ nguồn vào, khó khăn và đầu ra mong đợi.
  - [ ] Prompt không yêu cầu người dùng chỉ định pattern UX.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P00-02 — Khóa MVP boundary và operating modes

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Đã có bản nháp · **Phụ thuộc:** P00-01.
- **Các bước thực hiện:**
  1. Đối chiếu `docs/mvp-scope.md`, `docs/constraints.md` và `SKILL.md` để phát hiện mâu thuẫn.
  2. Giữ 4 mode: Improve, Build Mobile View, Audit Only, Verify; phân biệt khi nào được sửa code.
  3. Ghi rõ ngoài phạm vi: native app, redesign thương hiệu, PWA deep diagnostics, CLI và rule search giai đoạn đầu.
- **Đầu ra/file dự kiến:**
  - `docs/mvp-scope.md`
  - `docs/constraints.md`
- **Definition of Done (DoD):**
  - [ ] Các mode thống nhất giữa docs và SKILL.md.
  - [ ] Audit/Verify không được tự ý thay đổi code.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P00-03 — Chuẩn hóa 3 scenario trước khi dựng fixture

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có scenario mô tả · **Phụ thuộc:** P00-01, P00-02.
- **Các bước thực hiện:**
  1. Rà soát `evals/scenarios/dashboard.md`, `navigation.md`, `form.md`.
  2. Mỗi scenario xác định tác vụ, trạng thái khởi đầu, dữ liệu mẫu, hành vi lỗi, expected behavior và các chức năng bắt buộc giữ.
  3. Phân biệt 'mô tả tình huống' với 'runnable fixture'; ghi mã scenario A/B/C cố định.
- **Đầu ra/file dự kiến:**
  - `evals/scenarios/*.md` chi tiết hơn
  - `evals/scenarios/README.md`
- **Definition of Done (DoD):**
  - [ ] Mỗi scenario có bước tái hiện, điểm kết thúc và failure criteria.
  - [ ] Chưa đánh dấu đã test nếu fixture chưa có.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P00-04 — Xây evaluation contract trước/sau

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có tiêu chí nền · **Phụ thuộc:** P00-03.
- **Các bước thực hiện:**
  1. Chuẩn hóa PASS / FAIL / NOT RUN / INFERRED trong `evals/evaluation-criteria.md`.
  2. Chọn chỉ số quan sát được: hoàn thành tác vụ, lỗi, số bước, discoverability, accessibility, desktop regressions.
  3. Định nghĩa cách ghi bằng chứng (URL/commit, thiết bị, viewport, screenshot, log, bước tái hiện).
- **Đầu ra/file dự kiến:**
  - `evals/evaluation-criteria.md`
  - `evals/evidence-template.md`
- **Definition of Done (DoD):**
  - [ ] Không dùng UX score do AI tự suy diễn.
  - [ ] Mỗi PASS đòi bằng chứng đã chạy hoặc quan sát trực tiếp.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P00-05 — Thiết lập benchmark so sánh agent có/không skill

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P00-04.
- **Các bước thực hiện:**
  1. Định nghĩa hai điều kiện thử nghiệm, cùng model, tool access, prompt và baseline code.
  2. Yêu cầu 2 workspace/branch độc lập; reset trạng thái giữa các lần thử.
  3. Nêu cách hạn chế nhiễu do randomness và cách báo cáo khi chỉ chạy được 1 lần.
- **Đầu ra/file dự kiến:**
  - `evals/comparison-protocol.md`
- **Definition of Done (DoD):**
  - [ ] Có quy trình lặp lại và phân biệt khác biệt do skill với khác biệt do môi trường.
  - [ ] Không khẳng định skill tốt hơn nếu chưa có kết quả.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P00-06 — Thiết lập quality gates và traceability

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P00-02, P00-04.
- **Các bước thực hiện:**
  1. Định nghĩa gate Foundation, Useful Alpha, Verified MVP, PWA Extended và Distribution.
  2. Mỗi gate gắn với artefact/đầu ra kiểm chứng cụ thể.
  3. Ghi mapping task → tài liệu → scenario → evidence để tránh chỉ tích ô theo cảm tính.
- **Đầu ra/file dự kiến:**
  - `docs/release-gates.md`
  - `docs/task-traceability.md`
- **Definition of Done (DoD):**
  - [ ] Các gate đo bằng kết quả có thể kiểm tra, không theo số trang tài liệu.
  - [ ] Mỗi task có một người review xác nhận tiêu chí xong khi áp dụng team workflow.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [ ] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

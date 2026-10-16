# P01 — Agent Skill Foundation

> Củng cố skill hợp chuẩn, dễ kích hoạt đúng yêu cầu và hoạt động nhất quán trong project có sẵn.

**Đối chiếu hiện trạng:** 17/10/2026, base HEAD `4ad759f`. Checklist và trạng thái từng task bên dưới phản ánh source/evidence đã đọc, gồm [review và lượt kiểm tra gần nhất](../../plans/reports/review-261017-0428-skill-codebase.md). Đây là hồ sơ tiến độ có thể cập nhật; Git lưu lịch sử kế hoạch ban đầu.

## Kết quả cần đạt

Metadata / docs / CI đạt; thêm test kích hoạt thực tế và mode routing trước khi tuyên bố foundation hoàn thiện.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. `[x]` chỉ xác nhận đúng tiêu chí và phạm vi bằng chứng ghi tại task; `[ ]` là chưa đạt hoặc chưa đủ bằng chứng. Task có thể còn **MỘT PHẦN** dù DoD trên fixture đã đạt, khi đầu ra hướng dẫn hoặc coverage dự kiến vẫn thiếu. Không suy ra phase hoàn tất từ việc file đã tồn tại.

### P01-01 — Kiểm thử trigger và non-trigger

- **Ưu tiên:** `P0` · **Trạng thái:** CHƯA KIỂM CHỨNG · **Phụ thuộc:** P00-01.
- **Bằng chứng / còn thiếu:** [SKILL](../../SKILL.md) có trigger/non-trigger nhưng chưa có bộ activation test EN/VI với false-positive/negative và provenance. Các decision replay không chứng minh auto-discovery.
- **Các bước thực hiện:**
  1. Tập hợp 12–20 prompt tiếng Anh/Việt về improve responsive, audit mobile, build mobile view, PWA và negative triggers.
  2. Kiểm tra skill được kích hoạt khi phù hợp, không kích hoạt cho native app, logo hoặc backend-only.
  3. Ghi false positive/false negative và sửa `description` nếu cần.
- **Đầu ra/file dự kiến:**
  - `evals/prompts/skill-activation.md`
  - `SKILL.md` (nếu cần)
- **Definition of Done (DoD):**
  - [ ] Các prompt cốt lõi được agent nhận đúng trong môi trường được thử.
  - [ ] Không thay đổi trigger chỉ để khớp một ví dụ duy nhất.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-02 — Kiểm tra metadata Agent Skills

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P00-02.
- **Bằng chứng / còn thiếu:** [Validator](../../scripts/validate_skill.py) kiểm tra bằng regex; chưa có YAML semantic validation hoặc negative tests metadata. Structural PASS không đủ hai DoD này.
- **Các bước thực hiện:**
  1. Kiểm tra frontmatter `name`, `description`, `license`, `metadata.version` theo spec đang áp dụng.
  2. Đối chiếu `name: mobile-web-ui-ux-skill` với tên folder ở đường cài agent.
  3. Kiểm tra `scripts/validate_skill.py` không chỉ pass vì regex chấp nhận YAML sai ngữ nghĩa.
- **Đầu ra/file dự kiến:**
  - `SKILL.md`
  - `scripts/validate_skill.py`
  - Test validator
- **Definition of Done (DoD):**
  - [ ] Metadata parse được bằng parser YAML phù hợp hoặc kiểm chứng spec chính xác.
  - [ ] CI pass và test lỗi metadata bị validator từ chối.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-03 — Rà soát mode routing và quyền chỉnh sửa

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P01-01.
- **Bằng chứng / còn thiếu:** [Operating modes](../../SKILL.md) đã ánh xạ quyền và output bằng mô tả, có mặc định audit/review không sửa code; chưa có bảng mode/quyền/output đúng đầu ra dự kiến và chưa có replay từng mode.
- **Các bước thực hiện:**
  1. Định nghĩa câu lệnh tự nhiên ánh xạ Improve/Build/Audit/Verify.
  2. Kiểm tra Audit/Verify tuyệt đối không sửa source; Improve chỉ sửa phạm vi được yêu cầu.
  3. Quy định khi cần hỏi vì ảnh hưởng nghiệp vụ/phân quyền/navigational semantics.
- **Đầu ra/file dự kiến:**
  - `references/agent-workflow.md`
  - `SKILL.md`
- **Definition of Done (DoD):**
  - [ ] Có bảng mode → quyền đọc/ghi → output.
  - [x] Trường hợp mơ hồ có hành vi mặc định an toàn.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-04 — Hoàn thiện project discovery

- **Ưu tiên:** `P0` · **Trạng thái:** ĐẠT DoD hướng dẫn · **Phụ thuộc:** P01-03.
- **Bằng chứng / còn thiếu:** [Project discovery](../../references/project-discovery.md), [decision contract](../../references/decision-contract.md) và [report template](../../references/report-template.md) phân biệt code/browser/inference và bắt đầu bằng đọc stack từ repo. Không xem đây là benchmark discovery nhiều framework.
- **Các bước thực hiện:**
  1. Kiểm tra cách agent đọc routes/components/styles/tokens/tests mà không quét mọi file.
  2. Ghi cách xác định tối đa 3 tác vụ mobile và gắn nhãn INFERRED nếu không có analytics.
  3. Bổ sung safe guards cho secrets, credentials, ảnh/screenshot người dùng.
- **Đầu ra/file dự kiến:**
  - `references/project-discovery.md`
- **Definition of Done (DoD):**
  - [x] Report phân biệt chứng cứ code, browser, suy đoán.
  - [x] Không cần biết framework của người dùng trước khi đọc repo.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-05 — Chuẩn hóa decision record và report dễ hiểu

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P01-03, P01-04.
- **Bằng chứng / còn thiếu:** [Report template](../../references/report-template.md) và [sample](../../examples/sample-report.md) đã có format và giới hạn PASS; chưa có kiểm tra khả năng hiểu với người không chuyên UX.
- **Các bước thực hiện:**
  1. Thống nhất format Problem / Evidence / Task / Choice / Rejected option / Preserve / Verification.
  2. Giảm thuật ngữ chuyên môn trong phần trả cho vibe coder, nhưng giữ chi tiết trong report kỹ thuật.
  3. Dùng ví dụ có lý do rõ tại sao không chọn bottom nav/cards.
- **Đầu ra/file dự kiến:**
  - `references/report-template.md`
  - `examples/sample-report.md`
- **Definition of Done (DoD):**
  - [ ] Người không học UX có thể hiểu thay đổi và rủi ro còn lại.
  - [x] Không tuyên bố PASS khi không test.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-06 — Kiểm tra packaging thủ công và hướng dẫn cài

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P01-02.
- **Bằng chứng / còn thiếu:** [README](../../README.md) có cài thủ công, giới hạn đường dẫn theo agent; [generator tests](../../scripts/tests/test_create_comparison_project.py) kiểm tra bản copy runtime. Chưa có clean-install/invocation smoke trên agent để đánh dấu cách cài đã tái lập.
- **Các bước thực hiện:**
  1. Dùng bản clone sạch để xác nhận file references tải được từ đường dẫn tương đối.
  2. Viết hướng dẫn cài thủ công cho Agent Skills-compatible agents; chỉ mô tả agent đã thử thật.
  3. Thử skill invocation khi đặt trong thư mục `.agents/skills/` nếu agent hỗ trợ.
- **Đầu ra/file dự kiến:**
  - `README.md` / `README.vi.md`
  - `evals/installation-smoke.md`
- **Definition of Done (DoD):**
  - [ ] Cách cài được tái lập trên ít nhất 1 agent.
  - [x] Không ghi hỗ trợ chính thức cho nền tảng chưa kiểm thử.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-07 — Gia cố validator và CI smoke checks

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P01-02, P01-05.
- **Bằng chứng / còn thiếu:** [Workflow](../../.github/workflows/validate.yml) chạy structure/unit/build/browser; [evidence](../../tests/reports/task-ux-evidence.md) ghi một lượt CI committed-source. Chưa xác nhận CI cho HEAD hiện tại và chưa có negative tests riêng cho validator metadata/link/missing-file.
- **Các bước thực hiện:**
  1. Bổ sung test các local links, frontmatter, missing files và file path references.
  2. Đặt CI chạy mọi pull request; test cả trường hợp cố tình sai.
  3. Không nhầm structural validator với UX verification.
- **Đầu ra/file dự kiến:**
  - `scripts/validate_skill.py`
  - `.github/workflows/validate.yml`
  - `scripts/tests/` (nếu cần)
- **Definition of Done (DoD):**
  - [ ] CI xanh trên branch chính.
  - [ ] Ít nhất một test lỗi chủ ý cho thấy CI fail đúng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [x] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp (xem trạng thái/bằng chứng từng task).

Phase chưa đóng: các task bắt buộc hoặc bằng chứng toàn phạm vi còn mở; không đánh dấu các exit gate còn lại chỉ dựa vào structural/browser PASS.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

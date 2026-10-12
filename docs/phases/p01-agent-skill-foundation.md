# P01 — Agent Skill Foundation

> Củng cố skill hợp chuẩn, dễ kích hoạt đúng yêu cầu và hoạt động nhất quán trong project có sẵn.

**Mốc kiểm tra:** branch `main`, commit `62505f6f161b` (12/10/2026). Trạng thái trong tài liệu là đánh giá lúc lập kế hoạch, không tự động đồng bộ với repo; kiểm tra lại trước khi triển khai. `SKILL.md`, README, docs, 3 playbook, scenario specs và CI cấu trúc đã tồn tại; runnable fixtures, UX e2e và A/B chưa có.

## Kết quả cần đạt

Metadata / docs / CI đạt; thêm test kích hoạt thực tế và mode routing trước khi tuyên bố foundation hoàn thiện.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. Dấu **Đã có bản nháp** chỉ xác nhận đã có tài liệu, **không** đồng nghĩa có UX validation.

### P01-01 — Kiểm thử trigger và non-trigger

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa có test hành vi · **Phụ thuộc:** P00-01.
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

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** CI cấu trúc đã pass · **Phụ thuộc:** P00-02.
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

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có hướng dẫn nền · **Phụ thuộc:** P01-01.
- **Các bước thực hiện:**
  1. Định nghĩa câu lệnh tự nhiên ánh xạ Improve/Build/Audit/Verify.
  2. Kiểm tra Audit/Verify tuyệt đối không sửa source; Improve chỉ sửa phạm vi được yêu cầu.
  3. Quy định khi cần hỏi vì ảnh hưởng nghiệp vụ/phân quyền/navigational semantics.
- **Đầu ra/file dự kiến:**
  - `references/agent-workflow.md`
  - `SKILL.md`
- **Definition of Done (DoD):**
  - [ ] Có bảng mode → quyền đọc/ghi → output.
  - [ ] Trường hợp mơ hồ có hành vi mặc định an toàn.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-04 — Hoàn thiện project discovery

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Có bản nháp · **Phụ thuộc:** P01-03.
- **Các bước thực hiện:**
  1. Kiểm tra cách agent đọc routes/components/styles/tokens/tests mà không quét mọi file.
  2. Ghi cách xác định tối đa 3 tác vụ mobile và gắn nhãn INFERRED nếu không có analytics.
  3. Bổ sung safe guards cho secrets, credentials, ảnh/screenshot người dùng.
- **Đầu ra/file dự kiến:**
  - `references/project-discovery.md`
- **Definition of Done (DoD):**
  - [ ] Report phân biệt chứng cứ code, browser, suy đoán.
  - [ ] Không cần biết framework của người dùng trước khi đọc repo.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-05 — Chuẩn hóa decision record và report dễ hiểu

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Có template nền · **Phụ thuộc:** P01-03, P01-04.
- **Các bước thực hiện:**
  1. Thống nhất format Problem / Evidence / Task / Choice / Rejected option / Preserve / Verification.
  2. Giảm thuật ngữ chuyên môn trong phần trả cho vibe coder, nhưng giữ chi tiết trong report kỹ thuật.
  3. Dùng ví dụ có lý do rõ tại sao không chọn bottom nav/cards.
- **Đầu ra/file dự kiến:**
  - `references/report-template.md`
  - `examples/sample-report.md`
- **Definition of Done (DoD):**
  - [ ] Người không học UX có thể hiểu thay đổi và rủi ro còn lại.
  - [ ] Không tuyên bố PASS khi không test.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-06 — Kiểm tra packaging thủ công và hướng dẫn cài

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** README có hướng dẫn cơ bản · **Phụ thuộc:** P01-02.
- **Các bước thực hiện:**
  1. Dùng bản clone sạch để xác nhận file references tải được từ đường dẫn tương đối.
  2. Viết hướng dẫn cài thủ công cho Agent Skills-compatible agents; chỉ mô tả agent đã thử thật.
  3. Thử skill invocation khi đặt trong thư mục `.agents/skills/` nếu agent hỗ trợ.
- **Đầu ra/file dự kiến:**
  - `README.md` / `README.vi.md`
  - `evals/installation-smoke.md`
- **Definition of Done (DoD):**
  - [ ] Cách cài được tái lập trên ít nhất 1 agent.
  - [ ] Không ghi hỗ trợ chính thức cho nền tảng chưa kiểm thử.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P01-07 — Gia cố validator và CI smoke checks

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Đã pass structural CI · **Phụ thuộc:** P01-02, P01-05.
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
- [ ] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

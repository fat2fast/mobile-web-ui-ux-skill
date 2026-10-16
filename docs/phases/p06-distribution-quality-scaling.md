# P06 — Distribution, Quality & Scaling

> Phân phối skill tin cậy, dễ tìm, dễ cài và mở rộng dữ liệu chỉ khi đã chứng minh giá trị UX.

**Đối chiếu hiện trạng:** 17/10/2026, base HEAD `4ad759f`. Checklist và trạng thái từng task bên dưới phản ánh source/evidence đã đọc, gồm [review và lượt kiểm tra gần nhất](../../plans/reports/review-261017-0428-skill-codebase.md). Đây là hồ sơ tiến độ có thể cập nhật; Git lưu lịch sử kế hoạch ban đầu.

## Kết quả cần đạt

Docs/packaging/release nhất quán, CI hữu ích, không tăng phức tạp không cần thiết.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. `[x]` chỉ xác nhận đúng tiêu chí và phạm vi bằng chứng ghi tại task; `[ ]` là chưa đạt hoặc chưa đủ bằng chứng. Task có thể còn **MỘT PHẦN** dù DoD trên fixture đã đạt, khi đầu ra hướng dẫn hoặc coverage dự kiến vẫn thiếu. Không suy ra phase hoàn tất từ việc file đã tồn tại.

### P06-01 — Định nghĩa rule format & provenance

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P02-10.
- **Bằng chứng / còn thiếu:** [Playbooks](../../references/decisions/) và [cases](../../evals/decisions/) có conditions/reject/evidence, nhưng chưa có structured rule schema/validator; chưa có license/provenance audit đủ để đóng DoD.
- **Các bước thực hiện:**
  1. Nếu số rule tăng, chuẩn hóa ID/category/applicability/anti-pattern/evidence/updated-at ở YAML/JSON/CSV.
  2. Giữ riêng design decision, browser compatibility và stack implementation.
  3. Viết data validator (duplicate IDs, broken links, conflict/cross-reference).
- **Đầu ra/file dự kiến:**
  - `references/rules/schema.md` hoặc `data/rules/`
  - Rule validation tests
- **Definition of Done (DoD):**
  - [ ] Mỗi rule có điều kiện/contraindication rõ.
  - [ ] Không sao chép nội dung bên thứ ba thiếu giấy phép/ghi nhận.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P06-02 — Đánh giá có cần search/retrieval engine

- **Ưu tiên:** `P2` · **Trạng thái:** CHƯA ĐO; hiện tiếp tục direct references · **Phụ thuộc:** P06-01.
- **Bằng chứng / còn thiếu:** [SKILL](../../SKILL.md) hoạt động qua relative references và không phụ thuộc search CLI; [roadmap](../roadmap.md) chưa yêu cầu xây engine. Chưa có retrieval measurements/build-vs-defer experiment; không gọi quyết định tạm thời là evidence-based benchmark.
- **Các bước thực hiện:**
  1. Đo độ dài context và độ chính xác tìm đúng playbook khi catalogue mở rộng.
  2. So sánh direct references/progressive disclosure với search CLI trên benchmark queries.
  3. Chỉ xây search/index khi lợi ích đã rõ.
- **Đầu ra/file dự kiến:**
  - `docs/retrieval-decision.md`
- **Definition of Done (DoD):**
  - [ ] Có quyết định evidence-based build/defer.
  - [x] Nếu defer, skill vẫn hoạt động độc lập không có CLI.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P06-03 — Agent packaging & compatibility

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P01-06, P04-10.
- **Bằng chứng / còn thiếu:** [README](../../README.md) ghi đường dẫn tùy agent; [generator tests](../../scripts/tests/test_create_comparison_project.py) có runtime-copy checks. Chưa có installation/activation smoke cho agent được công bố hỗ trợ.
- **Các bước thực hiện:**
  1. Ưu tiên 1–2 agent được thử (ví dụ Codex/Claude/Cursor nếu môi trường hỗ trợ) rồi mới thêm nền tảng.
  2. Kiểm tra path, trigger, reference loading, script invocation và permission model.
  3. Tài liệu cách cài theo agent, tránh tuyên bố hỗ trợ không kiểm chứng.
- **Đầu ra/file dự kiến:**
  - `docs/installation/`
  - `evals/installation-smoke.md`
- **Definition of Done (DoD):**
  - [ ] Có smoke test chứng minh cài và gọi skill được cho agent được liệt kê.
  - [x] Không ép tất cả agent dùng một directory convention.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P06-04 — Stack-specific implementation references

- **Ưu tiên:** `P2` · **Trạng thái:** CHƯA TRIỂN KHAI · **Phụ thuộc:** P03-09.
- **Bằng chứng / còn thiếu:** [Task-first React fixtures](../../evals/implementations/task-first/) không thay thế stack implementation guides; chưa có stack guide và proof sử dụng thật theo task.
- **Các bước thực hiện:**
  1. Chốt pattern framework-agnostic trước; chỉ thêm React/Next/Tailwind guide chuyên sâu sau khi có use cases.
  2. Mở rộng Vue/Svelte khi có contributions và test fixtures tương ứng.
  3. Tránh duy trì bảng stack khổng lồ như general-purpose UI library.
- **Đầu ra/file dự kiến:**
  - `references/implementation/stacks/` (nếu cần)
- **Definition of Done (DoD):**
  - [ ] Mỗi stack guide có code/example và kiểm tra sử dụng thật.
  - [ ] Không fork design system của dự án người dùng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P06-05 — CI gồm metadata, content, lint và eval smoke

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P04-10, P06-01.
- **Bằng chứng / còn thiếu:** [CI](../../.github/workflows/validate.yml) có structure/unit/build/browser và artifacts, không deploy/publish. Chưa có negative tests metadata/rule consistency, branch-required-check evidence hoặc tách browser/device schedule như kế hoạch. [Verifier gaps](../../plans/reports/review-261017-0428-skill-codebase.md) vẫn mở.
- **Các bước thực hiện:**
  1. Gắn required checks: skill metadata, links, rules consistency, fixture build và test smoke.
  2. Tách quick checks trên PR khỏi browser matrix/test device chạy theo lịch hoặc release.
  3. Báo failure kèm log ngắn, artifact dễ xem.
- **Đầu ra/file dự kiến:**
  - `.github/workflows/`
  - CI documentation
- **Definition of Done (DoD):**
  - [ ] CI báo fail đúng khi skill contract bị lỗi.
  - [x] CI không có các bước ngầm phát hành/deploy.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P06-06 — Docs EN/VI, examples và SEO discoverability

- **Ưu tiên:** `P1` · **Trạng thái:** ĐẠT DoD về claims/link nội bộ; rollout một phần · **Phụ thuộc:** P04-10.
- **Bằng chứng / còn thiếu:** [README EN](../../README.md), [README VI](../../README.vi.md) và [validator](../../scripts/validate_skill.py) đã đối chiếu claims và link nội bộ. Installation behavior chưa smoke; FAQ/GitHub topics chưa được xác nhận. Tick thứ hai chỉ xác nhận đường dẫn/hướng dẫn hiện có truy cập được, không xác nhận runtime install thành công.
- **Các bước thực hiện:**
  1. Đồng bộ README.md và README.vi.md về capability đã thực sự test.
  2. Thêm quickstart 1 prompt, before/after có evidence và FAQ cho vibe coder.
  3. Đặt GitHub topics liên quan mobile-web, mobile-ux, ui-ux, pwa, agent-skills mà không tạo quan hệ giả với repo khác.
- **Đầu ra/file dự kiến:**
  - `README.md`, `README.vi.md`
  - `examples/`
  - GitHub repository topics
- **Definition of Done (DoD):**
  - [x] Không quảng cáo PWA full support khi chỉ có roadmap.
  - [x] Các đường dẫn tài liệu/cách cài hoạt động.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P06-07 — Release, versioning & license compliance

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P06-05, P06-06.
- **Bằng chứng / còn thiếu:** [SKILL version](../../SKILL.md) và [MIT license](../../LICENSE) hiện có; chưa có release-process/tag evidence hay third-party license audit đầy đủ. Không tạo/tag release trong lượt docs này.
- **Các bước thực hiện:**
  1. Chọn SemVer và các mốc scaffold/alpha/verified MVP để release notes không gây hiểu nhầm.
  2. Rà soát third-party examples/assets, copyright và LICENSE notices; không copy code không ghi nguồn.
  3. Tag release khi quality gates có bằng chứng, kèm known limitations.
- **Đầu ra/file dự kiến:**
  - `CHANGELOG.md`
  - `docs/release-process.md`
  - Release tag/notes
- **Definition of Done (DoD):**
  - [ ] Một bản release có đúng feature/test coverage mô tả.
  - [ ] Mọi bên thứ ba cần attribution đều được ghi nhận.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P06-08 — Issue triage, contribution và feedback loop

- **Ưu tiên:** `P2` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P06-06.
- **Bằng chứng / còn thiếu:** [Contributing guide](../../CONTRIBUTING.md) cho phép thêm scenario/rule, yêu cầu attribution và cấm private data. Chưa có issue templates/maintainer triage rubric như các đầu ra dự kiến.
- **Các bước thực hiện:**
  1. Tạo issue templates cho mobile UX scenario, decision-rule proposal và bug report.
  2. Yêu cầu feedback kèm affected user task, reproduction, observed pattern, browser/viewport và expected behavior.
  3. Ưu tiên cải thiện theo lỗi tái hiện được, không chạy theo style trends.
- **Đầu ra/file dự kiến:**
  - `.github/ISSUE_TEMPLATE/`
  - `CONTRIBUTING.md`
  - Maintainer triage rubric
- **Definition of Done (DoD):**
  - [x] Contributor có thể thêm scenario/rule mà không cần viết engine mới.
  - [x] Không yêu cầu người dùng tải dữ liệu riêng tư lên issue công khai.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [x] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp (xem trạng thái/bằng chứng từng task).

Phase chưa đóng: các task bắt buộc hoặc bằng chứng toàn phạm vi còn mở; không đánh dấu các exit gate còn lại chỉ dựa vào structural/browser PASS.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

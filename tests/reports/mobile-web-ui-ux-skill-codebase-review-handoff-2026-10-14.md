# Báo cáo bàn giao: Independent Codebase Audit — mobile-web-ui-ux-skill

**Ngày lập:** 14/10/2026  
**Repository:** https://github.com/fat2fast/mobile-web-ui-ux-skill  
**Branch và phiên bản được đối chiếu:** `main` — `d204d5e63ff6`  
**Báo cáo đối chứng:** https://github.com/fat2fast/mobile-web-ui-ux-skill/blob/main/tests/reports/261014-mobile-ux-skill-comparison-review.md  
**Loại yêu cầu:** AUDIT / REVIEW ONLY — **không chỉnh sửa code, tài liệu, tests hoặc GitHub settings**.

> **Yêu cầu dành cho AI reviewer:** Hãy review độc lập codebase thực tế, kiểm chứng hoặc bác bỏ các nhận định dưới đây bằng source và test. Đừng coi báo cáo này là ground truth hoặc triển khai giải pháp đề xuất khi chưa xác minh. Kết thúc bằng báo cáo ưu tiên lỗi và kế hoạch triển khai, không tạo commit/PR.

## 1. Mục tiêu và phạm vi sản phẩm

`mobile-web-ui-ux-skill` là một Agent Skill giúp AI coding agents cải thiện **trải nghiệm UI/UX trên mobile web** cho những website, responsive web app hoặc PWA đã tồn tại. Đối tượng chính là vibe coders và developers không chuyên UI/UX. Skill cần tự nhận diện vấn đề, chọn mobile UX pattern phù hợp, triển khai thay đổi có phạm vi và xác minh kết quả. Không được đồng nhất responsive layout với mobile usability, không bắt người dùng tự chọn pattern và không phá vỡ desktop UX, dữ liệu, authorization, routes hoặc business logic.

Các mode: `Improve` (mặc định), `Build mobile view`, `Audit only`, `Verify`. Tập trung review **chất lượng và an toàn của quyết định UX**, tính nhất quán của runtime instructions, chất lượng evaluator và khả năng kiểm chứng, không đề xuất mở rộng features khi nền tảng chưa đạt.

## 2. Tình trạng xác minh được tới commit trên

- `SKILL.md` hiện ghi version `0.1.1`, workflow Discover → Diagnose → Decide → Implement → Verify → Report.
- Có **8 decision playbooks**: navigation, data display, forms, actions, content hierarchy, overlays, touch interactions, accessibility; có `references/decision-contract.md`.
- Có **2 runnable baseline fixtures**: `evals/fixtures/order-dashboard/` và `evals/fixtures/mobile-form/`. Hai fixture cố ý còn vấn đề UX; baseline chạy được **không đồng nghĩa đã cải thiện UX**.
- Có bộ 12 comparison prompts, reviewer decision cases, script tạo workspace `scripts/create-comparison-project.py`, test cho script, và 6 cặp output lịch sử trong `tests/no-skill/` và `tests/with-skill/`.
- Báo cáo đối chứng 14/10 kết luận **6/6 cặp chưa đạt đầy đủ comparison protocol** (`NOT RUN` theo nghĩa chính thức). Chúng là exploratory reviews về **lời khuyên AI**, không phải đo lường chất lượng UI sau khi sửa.
- Source hiện tại đã cập nhật guardrails sau các lượt output lịch sử. **Chưa thấy kết quả replay độc lập sau thay đổi xác nhận những lỗi lịch sử đã được khắc phục**.
- GitHub Actions mới nhất thành công, nhưng `.github/workflows/validate.yml` hiện chỉ chạy `python scripts/validate_skill.py` — không xác nhận comparison unit tests, fixture builds hoặc browser UX.

## 3. Các vấn đề / giả thuyết cần AI reviewer điều tra

### R-01 — P0 / Release blocker: giữ nguyên business rules và input validity

**Lỗi lịch sử có bằng chứng:**
- `tests/with-skill/data-03/response.txt`: đề xuất tự loại đơn trạng thái `Delivered` khỏi bulk `Follow-up`; trái với `evals/fixtures/order-dashboard/src/main.jsx`, nơi follow-up không hạn chế theo trạng thái.
- `tests/with-skill/form-01/response.txt`: `validateEmailField()` trả `false` khi chỉ có gợi ý sửa domain email, khiến địa chỉ đúng cú pháp không thể submit nếu từ chối gợi ý.

**Thay đổi source mới:** `references/decision-contract.md`, `references/decisions/forms.md`, `SKILL.md` đã bổ sung yêu cầu trace permission, eligibility, validation, transformation tới source hiện có; typo suggestions phải tùy chọn.

**Reviewer phải kiểm tra:** Guardrail đã đủ mạnh và rõ ở mọi mode/playbook chưa? Có điều khoản mâu thuẫn dẫn tới tự thêm eligibility, permission, validation hoặc action không? Các case `evals/decisions/data-display-cases.md`, `forms-cases.md` có phản ví dụ bảo vệ hành vi hiện có chưa? Thiết kế replay tối thiểu `DATA-03`, `FORM-01` và counterexamples; không được coi sửa guideline là bug đã đóng.

### R-02 — P0 / Release blocker: truthfulness và evidence labeling

**Lỗi lịch sử:** `DATA-02` nói “Verified” dù browser `NOT RUN`; `A11Y-01` khẳng định đạt WCAG AA từ mô tả “generous spacing” chưa đo; `DATA-03` tuyên bố đạt contrast chưa đo.

**Thay đổi source mới:** `references/decision-contract.md`, `references/verification-criteria.md`, `references/decisions/accessibility.md`, `references/accessibility-checklist.md`, `SKILL.md` phân biệt `PASS`, `FAIL`, `INFERRED`, `NOT RUN`.

**Reviewer phải kiểm tra:** Tất cả khẳng định thực nghiệm trong output có gắn status và artifact tương ứng không? Tách kiểm tra source, browser, device thật, accessibility và regression có rõ không? Có loophole cho phép nói “conforms/passes/verified” ở thân bài nhưng bảng cuối ghi `NOT RUN` không? Cần replay `DATA-02`, `A11Y-01` và một phản ví dụ về reflow/target spacing; đánh giá tiêu chí WCAG theo chuẩn chứ không áp dụng ngưỡng máy móc.

### R-03 — P0 / Test validity: cô lập từng lượt comparison

**Đã xác minh từ source:** `scripts/create-comparison-project.py` tạo 2 project tách biệt cho `no-skill` và `with-skill`, nhưng mỗi project chứa **cả 12 thư mục case**. `run-info` lịch sử của `DATA-02/no-skill` ghi có đọc `data-01/run-info.txt`. Chạy song song ở hai workspace độc lập **không tự nó là lỗi**; rủi ro chính là truy cập chéo giữa case hoặc ambient instructions.

**Reviewer phải kiểm tra:**
1. Có cần thay generator thành `--case <id>` để tạo **một case / một workspace / một condition** không? Nếu không, chứng minh cơ chế cách ly tương đương.
2. Kiểm tra `AGENTS.md` toàn cục, system/IDE-installed skills, context reuse, case outputs trước đó, và liệu no-skill có vô tình nhận hướng dẫn tương đương skill không.
3. Đảm bảo cùng prompt/fixture/commit/tool inventory/model settings/budget; hash and manifest phải có ý nghĩa và nhất quán.
4. Rà soát `scripts/tests/test_create_comparison_project.py`: hiện kiểm tra cấu trúc và hashes, **chưa tự chứng minh** run-time agent isolation hay điều kiện replay.
5. Không cho agent generator đọc reviewer cases/rubrics, báo cáo tổng kết, raw output của condition kia hay case khác trước khi kết thúc lượt chạy.

### R-04 — P1 / CI and automated quality gates

**Đã xác minh:** `.github/workflows/validate.yml` chỉ chạy validator cấu trúc; CI mới nhất `success` không đồng nghĩa các fixture builds và comparison tests đạt.

**Reviewer phải kiểm tra:** chất lượng `scripts/validate_skill.py` (frontmatter/relative links/validation limitations), unit tests của generator, dependency/lockfile reproducibility, khả năng chạy `npm ci` + `npm run build` cho từng fixture, và tình trạng thiếu automated browser regression. Đề xuất thứ tự tăng coverage tối thiểu, không triển khai nếu chỉ được yêu cầu audit.

### R-05 — P1 / Runtime-vs-reviewer document boundary

**Đã xác minh từ source mới:** comparison generator đưa `SKILL.md` và `references/` vào package `with-skill`, không đưa `evals/decisions/` hoặc reviewer-only material. `SKILL.md` tham chiếu `references/verification-criteria.md` thay vì đường dẫn reviewer `evals/evaluation-criteria.md`.

**Reviewer phải kiểm tra:** đọc tất cả link từ `SKILL.md` và các `references/` đã đóng gói, kiểm tra không tham chiếu tài liệu bị thiếu hoặc reviewer đáp án; bảo đảm `no-skill` không bị nhiễm. Tách biệt **dữ liệu thực thi của skill** và **rubric đánh giá**. Nếu dùng `SKILL.md` trong repository trực tiếp thay vì package chuẩn, đánh giá riêng nguy cơ agent tìm thấy `evals/`.

### R-06 — P1 / Skill activation and UX decision quality

Review metadata/trigger và các mode `Improve`, `Build`, `Audit only`, `Verify`; progressive disclosure; cách chọn playbook theo nhiệm vụ; việc đòi ít nhất một phương án khả thi bị loại; xử lý uncertainty; kỹ thuật bảo toàn navigation/browser Back/deep links, bảng nhiều chiều, form, focus và accessibility. Kiểm tra phản ví dụ “bottom nav cho mọi app”, “card hóa mọi bảng”, “form dài bắt buộc wizard”, “mọi target <24px đều fail WCAG AA”. Phải kiểm tra trên các ngữ cảnh trái nhau, không chỉ đọc guideline.

### R-07 — P1 / Hiệu quả thật sau implementation

Hai fixtures hiện là baseline. `evals/results/order-dashboard-baseline.md` có bằng chứng Chromium 390px về bảng 1080px; `evals/results/form-baseline.md` có HTTP 422 → sửa → HTTP 200. Đây **không phải kết quả with-skill retrofit**. Reviewer cần xác minh có before/after artifacts thực tế chưa, kết quả so sánh browser/keyboard/zoom/screen reader/desktop regression có bị gắn nhãn quá mức hay không. Đề xuất minimum end-to-end acceptance gates trước khi tuyên bố mobile UX đã cải thiện.

### R-08 — P2 / Documentation, scope and maintenance

Kiểm tra `README.md` và `README.vi.md` đồng bộ, trạng thái release/claims, `docs/mvp-scope.md` so với `SKILL.md` (version/maturity), `docs/roadmap.md` và `docs/phases/`. Đảm bảo README không tuyên bố skill đã được thử nghiệm/triển khai tốt nếu mới có exploratory text review. Kiểm tra license/third-party attribution nếu có nội dung sao chép; không ưu tiên cosmetic changes trước các P0/P1.

## 4. Danh sách file trọng tâm (đọc theo thứ tự)

1. `tests/reports/261014-mobile-ux-skill-comparison-review.md` — các lỗi và giới hạn của thử nghiệm.
2. `SKILL.md`; `references/agent-workflow.md`; `references/decision-contract.md`; `references/report-template.md`.
3. `references/decisions/*.md`; `references/verification-criteria.md`; `references/accessibility-checklist.md`.
4. `evals/comparison-protocol.md`; `evals/comparison-prompts.md`; `evals/decisions/*.md`.
5. `scripts/create-comparison-project.py`; `scripts/tests/test_create_comparison_project.py`; `scripts/validate_skill.py`; `.github/workflows/validate.yml`; `Makefile`.
6. `evals/fixtures/order-dashboard/` và `evals/fixtures/mobile-form/` (source, package scripts, server); `evals/results/`.
7. 6 cặp `tests/no-skill/*/response.txt`, `tests/with-skill/*/response.txt`, `run-info.txt`, `manifest.json` — xem **đây là output lịch sử trước khi sửa rule**, không đại diện mặc định cho source mới.
8. `README.md`, `README.vi.md`, `docs/mvp-scope.md`, `docs/roadmap.md`, `docs/phases/`.

## 5. Quy trình review bắt buộc

1. Xác nhận SHA `main` và thay đổi sau `d204d5e63ff6` nếu có; ghi rõ phiên bản đang đánh giá.
2. Kiểm tra độc lập từng nhận định R-01–R-08, không chấp nhận suy đoán trong báo cáo này như sự thật.
3. Với mỗi vấn đề nêu **severity**, trạng thái `CONFIRMED / PARTIAL / NOT REPRODUCED / NEEDS TEST`, file + dòng + bằng chứng, mức độ ảnh hưởng, root cause và hành động cụ thể. Phân biệt **lỗi source hiện tại** với **lỗi output lịch sử** và **lỗ hổng phương pháp kiểm thử**.
4. Review code, docs, tests, evaluator và CI; ưu tiên read-only checks. Không `npm install`, không sửa file, không tự mở PR/commit/push, không thao tác settings hay xóa run history. Nếu cần môi trường test có cài dependency, đề nghị kế hoạch trước và chờ phê duyệt.
5. Đề xuất regression tests và **release gates đo được** cho từng P0/P1. Với recommendation ảnh hưởng nghiệp vụ, viện dẫn handler/business source cụ thể; nếu không có, đánh dấu `NEEDS CONFIRMATION`.
6. Không tự đưa ra tỷ lệ thắng A/B, điểm UX, tốc độ cải thiện hoặc khẳng định causal improvement dựa trên 6 output chưa đạt protocol.

## 6. Format đầu ra yêu cầu AI reviewer

### A. Executive summary
- Codebase hiện có đủ vững để bước sang P03/P04 hay phải khắc phục P0 trước?
- Điểm tốt cần giữ nguyên; các release blockers.

### B. Findings table

| ID | Severity | Status | Source / lines | Evidence | Impact | Recommended change | Required regression |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... | ... | ... | ... |

### C. Confirmed / Unconfirmed
- **Confirmed by source**; **confirmed by executed check**; **historical only**; **not yet verified** — phân loại tách biệt.

### D. Prioritized action plan
- **Must fix before any new feature**, **must fix before MVP release**, **can defer**.
- Các task nhỏ (có IDs) với dependencies, files, DoD. Không tăng scope khi chưa cần thiết.

### E. Minimal validation and replay plan
- Dataset/case, isolation, runtime controls, expected assertions, evidence artifacts; các tests phải chạy trước khi công bố bug fixed.

### F. Final recommendation
- Một trong: `GO for focused implementation` / `GO with blocking fixes first` / `NO-GO pending reproducible tests`.
- Lý do, rủi ro chưa được giải quyết, **không tự sửa code**.

## 7. Điều kiện hoàn tất review

- Mọi P0/P1 được gắn evidence hoặc thừa nhận chưa có bằng chứng.
- Không gọi lịch sử `tests/with-skill/*` là output đã được chạy lại bằng phiên bản mới.
- Không nhầm structural CI success với mobile UX success.
- Có danh sách bước sửa tối thiểu, regression tests và release gates; tránh refactor lớn nếu không bắt buộc.
- Không có file, commit, PR hoặc cài đặt repository bị thay đổi trong quá trình review.

**Lưu ý về nguồn:** Báo cáo này tổng hợp từ codebase `main` và review 14/10, đồng thời chứa *giả thuyết audit* để kiểm chứng; đây không phải chứng nhận mức độ hoàn thiện của skill.

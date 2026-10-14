# Review đối chứng output mobile UX — 14/10/2026

## Phạm vi và kết luận

Đã đọc 6 cặp `response.txt` trong `tests/v.0.1.0/no-skill` và `tests/v.0.1.0/with-skill`, đối chiếu với [12 prompt đã đóng băng](../../evals/comparison-prompts.md), [case kỳ vọng](../../evals/decisions/) và [protocol](../../evals/comparison-protocol.md). Cả 6 cặp dùng cùng văn bản prompt, cùng hash fixture và cùng commit nguồn theo `manifest.json`; `run-info.txt` ghi cùng nhãn model **Gemini 3.8 Flash (High)** ở hầu hết lượt, nhưng không ghim được build model. Đây là **một output cho mỗi điều kiện của mỗi prompt**, không phải phép đo UX trên giao diện đã triển khai.

**Kết luận khám phá:** output có skill thường giải thích rõ hơn vì sao chọn/bỏ một pattern, liệt kê hợp đồng cần giữ và gắn `NOT RUN` cho kiểm tra chưa làm. Hai bên đều có lỗi đáng kể; đặc biệt output có skill tại `FORM-01` chứa mã chặn một địa chỉ email hợp lệ chỉ vì gợi ý sửa miền, còn `DATA-03` tự loại đơn `Delivered` khỏi follow-up trái fixture. Không thể kết luận skill tạo ra cải thiện nhân quả hay tính tỉ lệ thắng từ các lượt này.

**Trạng thái so sánh chính thức: `NOT RUN` cho cả 6 cặp.** Hai điều kiện chạy trên hai project riêng (`/home/user/work/no-skill` và `/home/user/work/with-skill`), nên thời gian chạy trùng nhau **không phải lỗi**. Trạng thái này chỉ còn do nhật ký chưa xác nhận đầy đủ công cụ, budget/model và phạm vi tài liệu được nạp theo [protocol](../../evals/comparison-protocol.md). Các nhãn `PASS`/`FAIL` dưới đây chỉ chấm **nội dung câu trả lời** theo bốn tiêu chí rubric, không xác nhận sản phẩm chạy tốt.

## Đối chiếu từng prompt

Rubric: **Tác vụ** = khớp việc người dùng cần làm; **Phương án bỏ** = nêu một phương án khả thi bị loại và lý do theo tác vụ; **Bảo toàn** = giữ dữ liệu, hành vi, route, desktop và accessibility liên quan; **Kiểm chứng** = nói đúng điều đã quan sát và chưa chạy. `PASS` ở mục bảo toàn chỉ có nghĩa **đề xuất nói đúng các bất biến**; triển khai thực tế vẫn `NOT RUN`.

### NAV-01 — dashboard đơn hàng ở 390px, prompt 1

| Tiêu chí | Không skill | Có skill |
|---|---|---|
| Tác vụ | **PASS** — drawer, card, tìm đơn, chi tiết và Back [§2](../v.0.1.0/no-skill/nav-01/response.txt#L22). | **PASS** — cùng luồng, kiểm tra cụ thể [§Decisions](../v.0.1.0/with-skill/nav-01/response.txt#L22). |
| Phương án bỏ | **FAIL** — chọn drawer/card nhưng không so với bottom nav hoặc bảng cố định như phương án khả thi [L55–77](../v.0.1.0/no-skill/nav-01/response.txt#L55). | **PASS** — bác bottom nav vì cạnh tranh chỗ với bulk action và bác bảng cột cố định theo bề rộng còn lại [L30–47](../v.0.1.0/with-skill/nav-01/response.txt#L30). |
| Bảo toàn | **PASS** ở mức đề xuất — bảng liệt kê search, sort, CSV, follow-up, deep link, desktop [L102–117](../v.0.1.0/no-skill/nav-01/response.txt#L102). | **PASS** ở mức đề xuất — nêu route/Back và các chức năng hiện có [L61–76](../v.0.1.0/with-skill/nav-01/response.txt#L61). |
| Kiểm chứng | **FAIL** — mở đầu khẳng định baseline “fails critical user journeys” dù chỉ xem source; checklist dùng “Verify” nhưng không chốt trạng thái thực thi [L3–5](../v.0.1.0/no-skill/nav-01/response.txt#L3), [L121–129](../v.0.1.0/no-skill/nav-01/response.txt#L121). | **FAIL** — có gắn `INFERRED`/`NOT RUN` [L28–34](../v.0.1.0/with-skill/nav-01/response.txt#L28), nhưng vẫn khẳng định nhấn nhầm khi cuộn và filter chiếm “200px+” mà không đo [L46](../v.0.1.0/with-skill/nav-01/response.txt#L46), [L74](../v.0.1.0/with-skill/nav-01/response.txt#L74). |

**Nhận xét:** khác biệt chính là lý do chọn drawer thay bottom nav và việc nêu rõ bước chưa chạy. Cả hai cùng chọn card cho tác vụ tìm một đơn. Lý do bỏ phương án có skill vẫn chứa hệ quả chưa quan sát, nên cần viết dưới dạng rủi ro cần thử.

### DATA-01 — tìm một đơn trong dashboard, prompt 4

| Tiêu chí | Không skill | Có skill |
|---|---|---|
| Tác vụ | **PASS** — ID, trạng thái, tổng tiền đặt lên card [L21–43](../v.0.1.0/no-skill/data-01/response.txt#L21). | **PASS** — cùng ưu tiên, giữ link chi tiết [L10–30](../v.0.1.0/with-skill/data-01/response.txt#L10). |
| Phương án bỏ | **FAIL** — chỉ phê bình bảng rộng; không so với biến thể bảng cuộn có cột cố định hay phương án khả thi khác [L7–13](../v.0.1.0/no-skill/data-01/response.txt#L7). | **PASS** — nêu bảng cuộn/cột cố định và accordion, lý do về không gian và URL chi tiết [L45–55](../v.0.1.0/with-skill/data-01/response.txt#L45). |
| Bảo toàn | **FAIL** — đề xuất thêm lọc Channel/City/Date và sort Total không có trong fixture; nói bulk follow-up “updates the status”, đổi nghĩa hành động hiện tại [L58–86](../v.0.1.0/no-skill/data-01/response.txt#L58), đối chiếu [fixture](../../evals/fixtures/order-dashboard/src/main.jsx#L25). | **PASS** ở mức đề xuất — giữ search/status/reset, ba sort hiện có, CSV, follow-up, route/Back và desktop [L56–67](../v.0.1.0/with-skill/data-01/response.txt#L56). |
| Kiểm chứng | **FAIL** — nói nút hiện tại vi phạm target 44px và gây nhấn nhầm khi chưa đo; không ghi rõ giao diện đề xuất chưa chạy [L8–10](../v.0.1.0/no-skill/data-01/response.txt#L8), [L151–154](../v.0.1.0/no-skill/data-01/response.txt#L151). | **PASS** — phân tích source là `INFERRED`, checklist proposal ghi `NOT RUN` [L45–68](../v.0.1.0/with-skill/data-01/response.txt#L45). |

**Nhận xét:** cặp này gần ví dụ người dùng cung cấp. Lợi ích thấy được là kỷ luật quyết định và giữ đúng hợp đồng hiện hữu; chưa chứng minh card triển khai tốt.

### DATA-02 — so sánh nhiều sản phẩm, prompt 5

| Tiêu chí | Không skill | Có skill |
|---|---|---|
| Tác vụ | **PASS** — cặp hai sản phẩm và switcher vẫn cho so sánh lần lượt, nhưng tăng thao tác khi có nhiều sản phẩm [L18–38](../v.0.1.0/no-skill/data-02/response.txt#L18). | **PASS** — bảng cuộn giữ giá trị cùng hàng/cột để so sánh nhiều sản phẩm [L14–23](../v.0.1.0/with-skill/data-02/response.txt#L14). |
| Phương án bỏ | **FAIL** — mô tả carousel như phương án khác nhưng không nói vì sao kém hơn trong ca này [L38–49](../v.0.1.0/no-skill/data-02/response.txt#L38). | **PASS** — so sánh card, cột nhãn cố định và chế độ chỉ hai sản phẩm theo chi phí ghi nhớ/không gian [L20–22](../v.0.1.0/with-skill/data-02/response.txt#L20). |
| Bảo toàn | **PASS** ở mức đề xuất — mọi giá trị, giới hạn, bảo hành có đường truy cập [L77–94](../v.0.1.0/no-skill/data-02/response.txt#L77). | **PASS** ở mức đề xuất — giữ điều kiện giá, warranty, semantic table và action [L23](../v.0.1.0/with-skill/data-02/response.txt#L23); cấu trúc `<table>` kết hợp “feature strips” vẫn phải thử với screen reader. |
| Kiểm chứng | **FAIL** — không gắn trạng thái `NOT RUN`; khẳng định nghiên cứu nhận thức và các con số thiết kế không dẫn bằng chứng [L18–20](../v.0.1.0/no-skill/data-02/response.txt#L18). | **FAIL** — ghi “Verified against reflow ...” [L24](../v.0.1.0/with-skill/data-02/response.txt#L24) nhưng bảng sau nói browser `NOT RUN` [L120–130](../v.0.1.0/with-skill/data-02/response.txt#L120). |

**Nhận xét:** skill giúp giải thích vì sao giữ căn hàng khi so sánh nhiều sản phẩm, nhưng không ngăn được câu khẳng định đã kiểm chứng sai. [WCAG 1.4.10](https://www.w3.org/WAI/WCAG21/Understanding/reflow) cho phép ngoại lệ cho bảng dữ liệu hai chiều; từng ô và phần trang khác vẫn phải kiểm tra reflow.

### DATA-03 — chọn nhiều đơn và bulk action, prompt 6

| Tiêu chí | Không skill | Có skill |
|---|---|---|
| Tác vụ | **PASS** — chọn, so trạng thái/tổng tiền, lọc và review trước hành động [L16–70](../v.0.1.0/no-skill/data-03/response.txt#L16). | **PASS** — card có ID/status/total và thanh bulk [L19–66](../v.0.1.0/with-skill/data-03/response.txt#L19). |
| Phương án bỏ | **FAIL** — liệt kê drawer/bottom tab và biện pháp an toàn nhưng không so sánh phương án data display khả thi theo tác vụ [L18–30](../v.0.1.0/no-skill/data-03/response.txt#L18). | **PASS** — giải thích vì sao card hơn bảng cuộn/cột cố định trong bố cục hiện tại [L22–32](../v.0.1.0/with-skill/data-03/response.txt#L22). |
| Bảo toàn | **FAIL** — tự thêm Mark Shipped, Cancel, Refund, ngưỡng 50 đơn và $1,000; không phải quyền/hành động đã biết [L76–115](../v.0.1.0/no-skill/data-03/response.txt#L76). | **FAIL** — ví dụ `Delivered` bị bỏ qua khỏi follow-up [L123–145](../v.0.1.0/with-skill/data-03/response.txt#L123), trong khi fixture cho follow-up mọi đơn [main.jsx:26,32](../../evals/fixtures/order-dashboard/src/main.jsx#L26). Bổ sung permission matrix chưa có nguồn. |
| Kiểm chứng | **FAIL** — mô tả bảng hiện tại “fails”, checkbox gây nhấn nhầm và các rủi ro runtime như đã thấy, dù run-info chỉ ghi build lỗi thiếu Vite [L3–12](../v.0.1.0/no-skill/data-03/response.txt#L3), [run-info](../v.0.1.0/no-skill/data-03/run-info.txt). | **FAIL** — dù gắn `INFERRED`/`NOT RUN` cho luồng chung [L160–168](../v.0.1.0/with-skill/data-03/response.txt#L160), lại khẳng định màu sắc “satisfying WCAG” chưa có phép đo [L104](../v.0.1.0/with-skill/data-03/response.txt#L104). |

**Nhận xét:** đây là lỗi skill quan trọng nhất về hợp đồng nghiệp vụ. Đề xuất an toàn có ích khi là *giả thuyết kiểm tra với product owner*, nhưng không được biến ví dụ quyền/trạng thái thành rule áp dụng. Build lỗi `vite: not found` là vấn đề chuẩn bị môi trường, không phải bằng chứng UX của điều kiện không skill.

### FORM-01 — contact form ba trường, prompt 7

| Tiêu chí | Không skill | Có skill |
|---|---|---|
| Tác vụ | **PASS** — form một cột, email inline error, giữ dữ liệu [L19–55](../v.0.1.0/no-skill/form-01/response.txt#L19), [L126–131](../v.0.1.0/no-skill/form-01/response.txt#L126). | **PASS** — cùng luồng và recovery [L12–73](../v.0.1.0/with-skill/form-01/response.txt#L12). |
| Phương án bỏ | **FAIL** — không so rõ wizard/sticky CTA với form ngắn, dù đưa nhiều kỹ thuật phụ [L60–95](../v.0.1.0/no-skill/form-01/response.txt#L60). | **PASS** — so bố cục, thời điểm validation, sticky CTA với in-flow submit [L38–73](../v.0.1.0/with-skill/form-01/response.txt#L38). |
| Bảo toàn | **FAIL** — đề nghị lower-case toàn bộ email dù chính output nhận local part có thể phân biệt chữ hoa [L62–65](../v.0.1.0/no-skill/form-01/response.txt#L62); mã mẫu còn `preventDefault()` mọi lần và để việc gửi ở comment `fetch...` [L547–572](../v.0.1.0/no-skill/form-01/response.txt#L547). | **FAIL** — mã mẫu `validateEmailField()` trả `false` hễ có gợi ý domain [L415–420](../v.0.1.0/with-skill/form-01/response.txt#L415), submit bị chặn [L454–464](../v.0.1.0/with-skill/form-01/response.txt#L454). Người dùng không thể giữ một địa chỉ đúng cú pháp với domain bị hệ thống đoán là lỗi. |
| Kiểm chứng | **FAIL** — checklist cuối dùng `[x]` cho cả kết quả về viewport/focus dù không chạy trên form này [L577–586](../v.0.1.0/no-skill/form-01/response.txt#L577). | **PASS** — các kiểm tra thiết bị/focus đều `NOT RUN` [L473–486](../v.0.1.0/with-skill/form-01/response.txt#L473). |

**Nhận xét:** lỗi chặn email hợp lệ nặng hơn lợi ích về cấu trúc giải thích. Hai output dài 493–586 dòng cho yêu cầu tư vấn một form ngắn, dễ che mất quyết định chính. Scenario không có fixture form tương ứng; code minh họa chưa được thực thi.

### A11Y-01 — target 20×20 px cách xa nhau, prompt 10

| Tiêu chí | Không skill | Có skill |
|---|---|---|
| Tác vụ | **PASS** — bác mệnh đề “mọi target <24px đều fail AA”, nêu ngoại lệ khoảng cách [L3–33](../v.0.1.0/no-skill/a11y-01/response.txt#L3). | **PASS** — cùng kết luận và thêm khác biệt giữa đạt chuẩn và dễ chạm [L9–35](../v.0.1.0/with-skill/a11y-01/response.txt#L9). |
| Phương án bỏ | **PASS** — bác tăng hit area như điều kiện bắt buộc, cho phép đo ngoại lệ [L35–52](../v.0.1.0/no-skill/a11y-01/response.txt#L35). | **PASS** — phân biệt tăng target như khuyến nghị UX với yêu cầu AA [L31–45](../v.0.1.0/with-skill/a11y-01/response.txt#L31). |
| Bảo toàn | **PASS** ở mức đề xuất — kiểm tra hit area, focus và không đổi chức năng [L49–70](../v.0.1.0/no-skill/a11y-01/response.txt#L49). | **PASS** ở mức đề xuất — kiểm tra keyboard, tên control, trạng thái, pointer [L63–86](../v.0.1.0/with-skill/a11y-01/response.txt#L63). |
| Kiểm chứng | **FAIL** — suy “generous spacing” *vượt 4px* và kết luận đạt AA trước khi đo [L25–33](../v.0.1.0/no-skill/a11y-01/response.txt#L25). | **FAIL** — cũng tuyên bố “fully satisfy ... conform” chỉ từ mô tả định tính [L20–31](../v.0.1.0/with-skill/a11y-01/response.txt#L20). |

**Nhận xét:** cả hai nêu đúng nguyên tắc [WCAG 2.2 SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): target nhỏ có thể đạt AA theo ngoại lệ khoảng cách. Nhưng “generous” không cung cấp hình học thực của tất cả target lân cận; trạng thái phù hợp là **chưa xác minh**, cần đo bounding box/circle ở các viewport và khi wrap.

## Phát hiện để cải tiến skill

1. **Ưu tiên cao — khóa hợp đồng hiện có trước khi đề xuất guardrail.** [SKILL.md §Constraints](../../SKILL.md#L38) đã cấm đổi business behavior, nhưng `DATA-03` vẫn tự loại `Delivered` và `FORM-01` chặn email đúng cú pháp. Bổ sung một câu kiểm tra thực dụng vào [decision contract](../../references/decision-contract.md): mỗi permission, eligibility, validation và transform đầu vào trong đề xuất phải trỏ tới nguồn đang có; nếu chưa biết, ghi `cần xác nhận` và giữ hành vi hiện tại. Với form, gợi ý sửa typo chỉ được là tùy chọn, không được làm fail syntax hợp lệ. Sau sửa rule, chạy lại `DATA-03`, `FORM-01` và một phản ví dụ gần kề trước khi gọi là đã khắc phục.
2. **Ưu tiên cao — nhãn kiểm chứng phải nhất quán đến từng câu.** `DATA-02` viết “Verified” rồi `NOT RUN`, `A11Y-01` kết luận đạt AA từ khoảng cách chưa đo, `DATA-03` khẳng định contrast đạt chuẩn chưa đo. Mở rộng [accessibility guidance](../../references/decisions/accessibility.md) và [decision contract](../../references/decision-contract.md): `PASS` chỉ cho phép đo/quan sát đã chạy với artifact; heuristic/source là `INFERRED`; proposal chưa chạy là `NOT RUN`; một bảng `NOT RUN` không cứu được câu “verified/conforms” ở đoạn khác. Thử lại `DATA-02` và `A11Y-01` cùng prompt reflow counterexample.
3. **Ưu tiên vừa — giữ phản hồi tư vấn theo quyết định cốt lõi.** [SKILL.md §Report](../../SKILL.md#L91) yêu cầu báo cáo ngắn, nhưng `FORM-01` có 493 dòng và mã mẫu chưa test. Với mode advice/audit, trả lời mặc định bằng chọn lựa, lý do, bất biến và bước thử; chỉ xuất code khi người dùng yêu cầu. Điều này giảm khả năng mã minh họa chứa bug được sao chép nguyên vào sản phẩm.
4. **Ưu tiên vừa — làm sạch đường dẫn tài liệu của bài eval.** `SKILL.md` dẫn trực tiếp tới `evals/evaluation-criteria.md`, còn [protocol](../../evals/comparison-protocol.md) chỉ cho generator nạp `SKILL.md` và `references/` cần thiết. Cần quyết định trước replay: chuyển checklist vận hành trung tính sang `references/`, tách rubric reviewer khỏi package generator; hoặc sửa protocol để công khai những file eval được phép đọc. Không sửa chuẩn sau khi đã xem kết quả.

Đây là khuyến nghị **chưa áp dụng vào skill** theo phạm vi `--advice`/review-only. Không nên sửa theo nhãn PASS/FAIL đơn lẻ mà phải kiểm tra case phản ví dụ và hành vi fixture.

## Giới hạn đối chứng và cách chạy lại

- **Hai project độc lập:** `run-info.txt` ghi no-skill ở `/home/user/work/no-skill` và with-skill ở `/home/user/work/with-skill`; chạy song song là hợp lệ theo làm rõ của người thực hiện và [protocol đã sửa](../../evals/comparison-protocol.md). Đây là làm rõ sau lượt chạy, không dùng thứ tự hoặc timestamp chồng lấn làm bằng chứng nhiễm chéo. Vẫn cần xác minh nội dung ambient instructions và file được đọc để đánh giá cách ly ngữ cảnh.
- **Bộ file được đọc:** 5 lượt có skill (`NAV-01`, `DATA-02`, `DATA-03`, `FORM-01`, `A11Y-01`) ghi đã đọc `evals/evaluation-criteria.md`; một số còn đọc checklist/evidence. File này không phải `comparison-protocol.md` hoặc case đáp án, nên chưa chứng minh lộ đáp án, nhưng vượt tập `SKILL.md` + `references/` được protocol cho phép. `DATA-02` không skill còn đọc run-info của `DATA-01`, nên cách ly giữa case cũng chưa rõ.
- **Công cụ/budget/model:** manifest khớp prompt/fixture/commit, nhưng vài danh sách công cụ ở điều kiện có skill thiếu `search_web` so với no-skill; budget thời gian/token ghi “unknown/none” chứ không phải giới hạn giống nhau được thiết lập; build model/seed/temperature không có hồ sơ đủ để xác nhận. `A11Y-01` có skill chỉ ghi “Gemini 3.8 Flash” mà không ghi “High”.
- **Không có UX triển khai để đo:** prompt yêu cầu đề xuất; fixture ứng với `DATA-02`, `FORM-01`, `A11Y-01` không chứa trang tương ứng. Browser/device, keyboard, screen reader và regression của proposal đều `NOT RUN`. Đánh giá này là một reviewer đọc output; chưa có replay độc lập hoặc thứ tự đảo ngược.

**Replay tối thiểu:** đóng băng prompt/fixture và model settings/budget; tạo snapshot sạch riêng cho *từng case và điều kiện*, kiểm tra ambient instructions và tool inventory, cấm đọc response/run-info cũ và rubric reviewer. Hai điều kiện có thể chạy song song trên project/context độc lập; lưu raw response bất biến rồi nhờ reviewer khác chấm bốn tiêu chí. Lặp lại các lượt độc lập khi có tài nguyên, và thử các phản ví dụ gần `DATA-03`, `FORM-01`, `A11Y-01` trước khi kết luận skill sửa được lỗi.

## Câu hỏi chưa giải quyết

- Backend/build cụ thể của Gemini 3.8 Flash (High), seed/temperature và token budget có thể truy xuất từ transcript gốc hay không?
- Ambient `AGENTS.md` ở hai workspace có nội dung tương đương và loại hết skill/rubric ở điều kiện no-skill hay không?
- Checklist `evals/evaluation-criteria.md` có được chủ đích coi là tài liệu runtime của skill không? Cần chốt phạm vi trước replay.

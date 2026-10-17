# Mobile Web UI/UX Skill

**Cải thiện UI/UX web trên mobile — không chỉ dừng ở responsive layout.**

AI skill giúp vibe coder, lập trình viên và người xây dựng sản phẩm biến website responsive hiện có thành trải nghiệm mobile trực quan, thân thiện với cảm ứng **mà không đòi hỏi chuyên môn thiết kế UI/UX**.

[English](README.md) · [Hướng dẫn skill](SKILL.md) · [Hướng dẫn cài đặt](docs/installation/README.vi.md) · [Runbook pilot](docs/installation/real-project-pilot.md) · [Phạm vi MVP](docs/mvp-scope.md) · [Lộ trình phát triển](docs/roadmap.md)

## Lý do tồn tại của skill

Một website có thể co giãn tốt (responsive) nhưng vẫn rất khó chịu khi dùng trên điện thoại. Sidebar desktop biến thành menu dài khó bấm, bảng dữ liệu khó đọc, form nhập liệu bị bàn phím ảo che khuất, và các nút bấm quan trọng thường bị đặt lệch khỏi tầm với ngón tay cái.

Skill này tập trung vào **cách người dùng thao tác thực tế trên điện thoại**, chứ không chỉ kiểm tra xem layout có vừa màn hình hay không. AI agent sẽ hiểu ngữ cảnh sản phẩm, lựa chọn UX pattern phù hợp cho mobile và cải thiện trải nghiệm mà không bắt người dùng phải đưa ra các quyết định thiết kế chuyên sâu.

## Những gì skill giúp bạn làm

- **Hiểu sản phẩm hiện có:** xác định các tác vụ mobile quan trọng nhất, các màn hình, component và ràng buộc kỹ thuật.
- **Cải thiện trải nghiệm mobile:** ưu tiên điều hướng (navigation), hiển thị dữ liệu, form nhập liệu, tương tác cảm ứng và thứ bậc nội dung.
- **Đưa ra quyết định thiết kế phù hợp ngữ cảnh:** lựa chọn pattern dựa trên tác vụ người dùng thay vì áp dụng máy móc bottom navigation, card hay bottom sheet.
- **Tương thích với code hiện tại:** tái sử dụng component và design token sẵn có; giữ nguyên nhận diện thương hiệu, trải nghiệm desktop, routing, phân quyền và logic nghiệp vụ.
- **Kiểm chứng thay đổi:** kiểm tra trên các viewport điện thoại tiêu biểu và luồng tương tác thực tế khi có công cụ test; phân biệt rõ kết quả đã kiểm chứng và giả định chưa kiểm tra.

Skill hỗ trợ tốt website mobile và ứng dụng web responsive. Skill có thể định hướng thiết kế mobile view trong các dự án PWA, trong khi các phép kiểm chuyên sâu cho từng trình duyệt hoặc PWA đã cài đặt sẽ được bổ sung ở các giai đoạn sau.

## Đối tượng sử dụng

- **Vibe coder** muốn AI coding agent tự đưa ra quyết định mobile UX hợp lý.
- **Lập trình viên** nắm vững responsive layout nhưng không chuyên về thiết kế tương tác mobile.
- **Indie maker và nhóm phát triển sản phẩm** cần tối ưu trải nghiệm mobile mà không phải đập đi xây lại toàn bộ website.

## Cách thức hoạt động

1. **Khám phá (Discover):** tìm hiểu dự án hiện có và các tác vụ mobile quan trọng nhất.
2. **Chẩn đoán (Diagnose):** phát hiện các vấn đề trải nghiệm vượt ra ngoài lỗi layout hay tràn khung (overflow).
3. **Quyết định (Decide):** chọn pattern mobile UX phù hợp với ngữ cảnh thực tế của sản phẩm.
4. **Cải thiện (Improve):** chỉnh sửa phần code tối thiểu cần thiết trong implementation hiện có.
5. **Kiểm chứng (Verify):** kiểm tra tương tác trên mobile, rà soát hồi quy trên desktop và báo cáo rõ phạm vi đã kiểm chứng.

### Các chế độ hoạt động

| Chế độ | Mục đích |
| --- | --- |
| **Improve** (mặc định) | Cải thiện trải nghiệm mobile của website responsive hiện có. |
| **Build mobile view** | Thiết kế mobile view cho tính năng mới trong dự án web hiện có. |
| **Audit only** | Phân tích, ưu tiên vấn đề mà không sửa code. |
| **Verify** | Kiểm tra tương tác mobile và lỗi phát sinh mà không chỉnh sửa code. |

## Bắt đầu sử dụng

Dự án tuân theo [Agent Skills specification](https://agentskills.io/specification). AI agent tương thích cần truy cập được thư mục `mobile-web-ui-ux-skill` và file `SKILL.md`.

### 1. Cài đặt, kiểm tra phiên bản và cập nhật trong dự án hiện hữu (Khuyến nghị)

Để cài đặt hoặc quản lý bản sao project-local độc lập của skill trong dự án web đang chạy mà không làm thay đổi mã nguồn, dependencies hay cấu hình ứng dụng, hãy dùng bộ cài đặt an toàn:

```bash
# Kiểm tra trước (dry-run, không ghi file)
make install-dry-run DEST=/duong/dan/du-an

# Cài đặt thực tế
make install DEST=/duong/dan/du-an

# Kiểm tra phiên bản đã cài so với bản nguồn
make check-version DEST=/duong/dan/du-an

# Cập nhật an toàn (tự động sao lưu và rollback nếu lỗi)
make update DEST=/duong/dan/du-an
```

Bộ cài đặt sẽ đặt `SKILL.md`, `references/**` và `LICENSE` tại `<project>/.agents/skills/mobile-web-ui-ux-skill/`. Cả OpenAI Codex và Google Antigravity đều hỗ trợ nhận diện vị trí này tại thư mục gốc workspace. Xem chi tiết tại [Hướng dẫn cài đặt](docs/installation/README.vi.md) và [Runbook pilot dự án thật](docs/installation/real-project-pilot.md) để biết thêm về quy trình kích hoạt, cập nhật, rollback và xử lý sự cố. Nếu agent không tự phát hiện skill, có thể yêu cầu agent đọc trực tiếp file `SKILL.md` đã cài.

### 2. Tạo hai project để đối chứng

Trong WSL, tạo hai bản sao độc lập của cùng một fixture vào thư mục đích đã tồn tại (nằm ngoài repository này):

```bash
# Xem hướng dẫn chi tiết các tùy chọn
make help

# Tạo cả 2 project cùng lúc (khuyến nghị)
make both DEST=~/work/mobile-ux-test

# Hoặc tạo từng project riêng
make no-skill DEST=~/work/mobile-ux-test
make with-skill DEST=~/work/mobile-ux-test
```

Mặc định dùng `order-dashboard`; thêm `FIXTURE=mobile-form` nếu muốn thử form. Lưu ý: Thư mục cha `DEST` phải tồn tại trước (nếu chưa có, tạo bằng `mkdir -p <DEST>`). Project thứ hai có skill tại `.agents/skills/mobile-web-ui-ux-skill/`, gồm các tài liệu runtime cần thiết. Project thứ nhất không có skill cấp project. Hai project không chứa `node_modules` và `dist`; chạy `npm ci` trong từng project trước khi khởi động. Lệnh không ghi đè project đã có; dùng `DEST` mới cho lượt khác, và giữ case đáp án cùng kết quả đánh giá bên ngoài hai project.

Mỗi bản sao có `AGENTS.md` ghi nhận giống nhau và các thư mục case theo `evals/comparison-prompts.md`. Với hồi quy **Tier A** chỉ dùng skill, hãy mở conversation riêng cho mỗi case, không đưa đáp án cũ hoặc tài liệu reviewer vào ngữ cảnh, và ghi nhận khả năng agent đã đọc file case khác. Có thể dùng chung workspace fixture; điều đó tự nó không chứng minh cách ly hay nhiễm ngữ cảnh. Muốn công bố skill tốt hơn điều kiện không dùng skill theo **Tier B**, cần kiểm soát hai điều kiện tương ứng và chứng minh ranh giới truy cập theo [protocol](evals/comparison-protocol.md). Giữ output lịch sử trong [`tests/v.0.1.0/`](tests/v.0.1.0/) và [`tests/v0.1.1/`](tests/v0.1.1/); [kết quả Tier A mới](tests/261015-tier-a/) được lưu riêng. Ghi hash prompt, snapshot nguồn, mã định vị session nếu có và phép kiểm thực sự chạy. Metadata agent tự ghi không thay thế transcript độc lập; trường runtime không quan sát được ghi `unknown`.

## Ví dụ yêu cầu

**Cải thiện website responsive hiện có**

> Hãy cải thiện UI/UX trên mobile của website hiện tại. Tự xác định các tác vụ mobile quan trọng, chọn UX pattern phù hợp, triển khai thay đổi cần thiết và giữ nguyên trải nghiệm desktop cùng business logic.

**Chỉ đánh giá, không sửa code**

> Hãy audit trang dashboard này trên mobile, chỉ ra các vấn đề khiến người dùng khó hoàn thành tác vụ, sắp xếp mức ưu tiên và đề xuất hướng sửa. Không thay đổi code.

**Xây mobile view cho tính năng mới**

> Hãy xây mobile view cho tính năng mới trong web app hiện tại. Tái sử dụng design system và component có sẵn. Tự lựa chọn cách tương tác phù hợp và giải thích các quyết định quan trọng.

## Cấu trúc repository

```
SKILL.md                     Hướng dẫn và workflow cho AI agent
README.md / README.vi.md     Tài liệu dự án
docs/                        Product scope, MVP scope, roadmap
docs/installation/           Hướng dẫn cài đặt và runbook pilot dự án thật
references/                  Hướng dẫn runtime, tiêu chí kiểm chứng và mẫu bằng chứng
references/decisions/        Tám playbook chọn UX theo tác vụ
evals/fixtures/              Baseline chạy được để đánh giá mobile UX
evals/implementations/       Retrofit lịch sử và triển khai theo tác vụ
tests/task-ux/              Bộ test browser và công cụ kiểm chứng hiện hành
evals/scenarios/             Các kịch bản đánh giá mobile UX
evals/decisions/             Decision cases và phản ví dụ
evals/evaluation-criteria.md Điểm vào cho reviewer đến tiêu chí kiểm chứng chung
examples/                    Báo cáo UX mẫu
scripts/install-skill.py     Bộ cài đặt và cập nhật skill an toàn vào dự án
scripts/validate_skill.py    Kiểm tra cấu trúc và liên kết Markdown
.github/workflows/           Kiểm tra tự động bằng CI
tests/261015-retrofit/        Kiểm tra browser trước/sau và ảnh chụp
```

## Kiểm tra cấu trúc

CI ghi manifest build, kết quả Playwright và ảnh vào thư mục tạm của cùng lượt chạy; verifier kiểm tra SHA/run ID và các test bắt buộc. Artifact `task-ux-evidence` chứa bằng chứng của lượt CI đó. Các file JSON cũ trong `tests/task-ux/artifacts/` chỉ là lịch sử; xem [bằng chứng task UX](tests/reports/task-ux-evidence.md) để biết phạm vi đã kiểm tra.

Yêu cầu Python 3.9+ (chỉ sử dụng thư viện chuẩn):

```
python3 scripts/validate_skill.py
```

Lệnh này kiểm tra cấu trúc skill, metadata và liên kết nội bộ; nó không đánh giá chất lượng sử dụng. CI còn chạy unit test tooling, build fixture và implementation, rồi chạy [bộ test browser theo tác vụ](tests/task-ux/). [Workflow](.github/workflows/validate.yml) quản lý tập job và project hiện hành. [Các phép kiểm retrofit cũ](tests/261015-retrofit/) là bằng chứng lịch sử. Hành vi trên thiết bị thật chưa được kiểm chứng.

## Trạng thái phát triển

**Useful alpha với các tác vụ mobile đã kiểm chứng trên fixture.** Bên cạnh retrofit dashboard/form lịch sử, repo có triển khai theo tác vụ cho orders, bảng so sánh và form yêu cầu theo ngữ cảnh. Xem [hợp đồng nghiệm thu](docs/mobile-task-acceptance.md), [bộ test browser](tests/task-ux/) và [bằng chứng đã ghi](tests/reports/task-ux-evidence.md) để biết phạm vi và giới hạn. [Hồi quy Tier A mới với skill](tests/reports/regression-261015-tier-a.md) đạt bốn case tư vấn và hai phản ví dụ; biến thể yêu cầu code form có phép kiểm riêng. [Kiểm tra Chromium trước/sau](tests/reports/retrofit-261015-browser-evidence.md) chạy các tác vụ dashboard và form ở kích thước điện thoại và desktop, có ảnh chụp và giới hạn rõ ràng. Sáu cặp output thăm dò cũ vẫn [được lưu](tests/reports/261014-mobile-ux-skill-comparison-review.md). Đối chứng skill Tier B vẫn `NOT RUN`; các kết quả trên fixture chưa chứng minh mức tăng khả năng sử dụng nói chung hay hành vi trên điện thoại thật.

Các bước tiếp theo gồm kiểm thử chạy được cho [kịch bản navigation ban đầu](evals/scenarios/navigation.md), kiểm tra tập trung trên điện thoại thật và công nghệ hỗ trợ, rồi đối chứng Tier B có kiểm soát. Các tác vụ comparison/request-form mới không thay thế cam kết navigation đó. Hướng dẫn browser/PWA chuyên sâu đi sau các khoảng trống bằng chứng này. Xem [MVP scope](docs/mvp-scope.md), [kết quả decision](evals/results/decision-evaluation.md) và [roadmap](docs/roadmap.md).

## Đóng góp

Hoan nghênh các đóng góp về tình huống mobile UX thực tế, quy tắc lựa chọn UX pattern và kịch bản đánh giá. Xem [CONTRIBUTING.md](CONTRIBUTING.md).

## Giấy phép

Dự án được phát hành theo [MIT License](LICENSE).

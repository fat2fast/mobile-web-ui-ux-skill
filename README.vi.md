# Mobile Web UI/UX Skill

**Cải thiện trải nghiệm UI/UX trên mobile web — không chỉ dừng ở responsive layout.**

AI skill giúp người vibe coding, lập trình viên và người phát triển sản phẩm biến website responsive hiện có thành **trải nghiệm mobile trực quan, dễ thao tác, thân thiện với cảm ứng** mà **không cần kiến thức chuyên sâu về thiết kế UI/UX**.

[English](README.md) · [Hướng dẫn skill](SKILL.md) · [Phạm vi MVP](docs/mvp-scope.md) · [Roadmap](docs/roadmap.md)

## Vì sao cần skill này?

Một website có thể hiển thị vừa màn hình điện thoại nhưng vẫn khó sử dụng. Sidebar từ desktop trở thành menu nhiều tầng, bảng dữ liệu khó đọc, form bất tiện khi bàn phím ảo xuất hiện và các thao tác quan trọng không dễ tìm thấy.

Skill tập trung vào **cách người dùng thực sự sử dụng website trên điện thoại**, thay vì chỉ kiểm tra giao diện có co giãn theo màn hình hay không. AI coding agent sẽ phân tích sản phẩm, chọn UX pattern phù hợp và cải thiện trải nghiệm mà không bắt người dùng phải tự đưa ra những quyết định chuyên môn về thiết kế.

## Skill giúp bạn làm gì?

- **Hiểu sản phẩm hiện có:** nhận diện tác vụ chính trên mobile, màn hình, component và các ràng buộc của dự án.
- **Cải thiện khả năng sử dụng:** ưu tiên điều hướng, trình bày dữ liệu, form, tương tác cảm ứng và thứ tự thông tin.
- **Tự quyết định UX theo ngữ cảnh:** không áp dụng máy móc bottom navigation, card hoặc bottom sheet cho mọi website.
- **Tận dụng code hiện tại:** tái sử dụng component và design tokens, giữ nhận diện, desktop UX, routes, phân quyền và business logic.
- **Kiểm chứng thay đổi:** kiểm tra các kích thước mobile và luồng thao tác khi có công cụ; nêu rõ kết quả đã kiểm tra và những giả định chưa được xác minh.

Skill hướng tới mobile websites và responsive web apps. Skill cũng có thể hỗ trợ xây mobile view trong dự án PWA; các kiểm tra chuyên sâu theo trình duyệt và PWA đã cài đặt sẽ được bổ sung ở những giai đoạn sau.

## Ai nên sử dụng?

- **Người vibe coding:** muốn AI coding agent tự đưa ra quyết định mobile UX hợp lý.
- **Lập trình viên:** đã biết xây responsive UI nhưng chưa chuyên về thiết kế tương tác trên điện thoại.
- **Indie makers và nhóm sản phẩm:** muốn nâng cấp trải nghiệm mobile mà không phải thiết kế lại toàn bộ website.

## Cách skill hoạt động

1. **Discover:** tìm hiểu dự án và các tác vụ mobile quan trọng.
2. **Diagnose:** phát hiện vấn đề sử dụng, không chỉ lỗi bố cục hoặc CSS.
3. **Decide:** chọn UX pattern dựa trên ngữ cảnh sản phẩm.
4. **Improve:** cải thiện những phần code cần thiết với phạm vi thay đổi nhỏ.
5. **Verify:** kiểm tra trải nghiệm mobile và tránh ảnh hưởng desktop; báo cáo rõ phần đã/chưa kiểm chứng.

### Các chế độ sử dụng

| Chế độ | Mục đích |
| --- | --- |
| **Improve** (mặc định) | Cải thiện trải nghiệm mobile của website responsive hiện có. |
| **Build mobile view** | Thiết kế mobile view cho tính năng mới trong dự án web hiện có. |
| **Audit only** | Phân tích, ưu tiên vấn đề mà không sửa code. |
| **Verify** | Kiểm tra tương tác mobile và lỗi phát sinh mà không chỉnh sửa code. |

## Bắt đầu sử dụng

Dự án tuân theo [Agent Skills specification](https://agentskills.io/specification). AI agent tương thích cần truy cập được thư mục `mobile-web-ui-ux-skill` và file `SKILL.md`.

1. Tải hoặc clone repository.
2. Đặt toàn bộ thư mục `mobile-web-ui-ux-skill` vào vị trí chứa skills mà agent hỗ trợ (ví dụ `.agents/skills/mobile-web-ui-ux-skill/` nếu tương thích).
3. Mở dự án web hiện có và yêu cầu AI coding agent cải thiện trải nghiệm mobile.

Mỗi agent có thể quy định vị trí cài đặt khác nhau. Hãy tham khảo tài liệu của agent đang sử dụng. Nếu agent không tự phát hiện skill, có thể yêu cầu đọc file `SKILL.md` của repository này.

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
references/                  Quy trình phân tích và nguyên tắc mobile UX
references/decisions/        Playbook cho navigation, dữ liệu và form
evals/scenarios/             Các kịch bản đánh giá mobile UX
evals/evaluation-criteria.md Tiêu chí đánh giá
examples/                    Báo cáo UX mẫu
scripts/validate_skill.py    Kiểm tra cấu trúc và liên kết Markdown
.github/workflows/           Kiểm tra tự động bằng CI
```

## Kiểm tra cấu trúc

Yêu cầu Python 3.9+ (chỉ sử dụng thư viện chuẩn):

```
python scripts/validate_skill.py
```

Lệnh này kiểm tra cấu trúc skill, metadata và các liên kết nội bộ. **Nó không đánh giá chất lượng sử dụng và cũng không chứng minh UX đã được cải thiện.** Việc kiểm chứng thực tế cần ứng dụng mẫu có thể chạy, interaction tests và/hoặc kiểm thử trên thiết bị.

## Trạng thái phát triển

**v0.1 — bản khởi tạo.** Hiện repository có workflow cốt lõi, ba playbook ban đầu (navigation, data display, forms), các kịch bản đánh giá và công cụ kiểm tra cấu trúc. Đây **chưa phải hệ thống tự động tối ưu mobile UX đã được kiểm thử đầy đủ**.

Các bước tiếp theo gồm nâng chất lượng decision playbooks, thử nghiệm trên web app thực tế, bổ sung kiểm thử tương tác mobile có thể lặp lại và mở rộng kiến thức chuyên sâu cho browser/PWA. Xem [MVP scope](docs/mvp-scope.md) và [roadmap](docs/roadmap.md).

## Đóng góp

Hoan nghênh các đóng góp về tình huống mobile UX thực tế, quy tắc lựa chọn UX pattern và kịch bản đánh giá. Xem [CONTRIBUTING.md](CONTRIBUTING.md).

## Giấy phép

Dự án được phát hành theo [MIT License](LICENSE).
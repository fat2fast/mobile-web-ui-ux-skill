# Hướng dẫn cài đặt Skill vào dự án hiện hữu

[English](README.md) · [Runbook pilot dự án thật](real-project-pilot.md) · [Hướng dẫn skill](../../SKILL.md) · [README chính](../../README.vi.md)

Tài liệu này hướng dẫn cách cài đặt, kiểm tra phiên bản, cập nhật và rollback bản sao project-local độc lập của `mobile-web-ui-ux-skill` trong một dự án web đang vận hành mà không làm thay đổi mã nguồn, dependencies hay cấu hình ứng dụng.

## Điều kiện tiên quyết

- **Python 3.9+** (chỉ sử dụng standard library, không yêu cầu cài thêm thư viện Python).
- Thư mục dự án web đích đã tồn tại.
- **Môi trường WSL:** Khi chạy trên Windows Subsystem for Linux (WSL), hãy chạy lệnh trong shell interactive WSL `bash` bằng `python3` và đảm bảo đường dẫn nằm trên cùng hệ thống tệp với dự án và agent runtime.

## Các bước cài đặt

Bộ cài đặt chỉ sao chép các tệp hướng dẫn runtime, references và license (`SKILL.md`, `references/**`, `LICENSE`) vào `<project>/.agents/skills/mobile-web-ui-ux-skill`. Bộ cài kiểm tra độc quyền thư mục đích, từ chối ghi đè, symlink hoặc đè lên source repository.

### Bước 1: Dry-Run (Kiểm tra trước khi ghi)

Trước khi ghi bất kỳ tệp nào, hãy chạy dry-run để kiểm tra tính hợp lệ của đường dẫn và tính khép kín của payload:

```bash
python3 scripts/install-skill.py --project "/duong/dan/toi/du-an" --dry-run
```

Hoặc qua Make:

```bash
make install-dry-run DEST="/duong/dan/toi/du-an"
```

Đầu ra mong đợi:
```text
[dry-run] Validated mobile-web-ui-ux-skill v0.1.1 -> /duong/dan/toi/du-an/.agents/skills/mobile-web-ui-ux-skill
```

### Bước 2: Cài đặt thực tế

Thực hiện cài đặt:

```bash
python3 scripts/install-skill.py --project "/duong/dan/toi/du-an"
```

Hoặc qua Make:

```bash
make install DEST="/duong/dan/toi/du-an"
```

Đầu ra mong đợi:
```text
Installed mobile-web-ui-ux-skill v0.1.1 to /duong/dan/toi/du-an/.agents/skills/mobile-web-ui-ux-skill
```

## Kiểm tra phiên bản và Cập nhật (Self-Update)

### Kiểm tra phiên bản skill

Để hiển thị phiên bản hiện tại của mã nguồn skill:
```bash
python3 scripts/install-skill.py --version
# Hoặc qua Make:
make version
```

Để so sánh phiên bản skill đã cài trong dự án với phiên bản nguồn mới nhất:
```bash
python3 scripts/install-skill.py --project "/duong/dan/toi/du-an" --check-version
# Hoặc qua Make:
make check-version DEST="/duong/dan/toi/du-an"
```

Kết quả khi đã ở bản mới nhất:
```text
Target project: /duong/dan/toi/du-an
Installed version: v0.1.1
Available source version: v0.1.1
Status: UP_TO_DATE (Installed skill is up to date with source)
```

Kết quả khi có bản cập nhật mới:
```text
Target project: /duong/dan/toi/du-an
Installed version: v0.1.0
Available source version: v0.1.1
Status: UPDATE_AVAILABLE (Run with --update to update safely)
```

### Cập nhật an toàn với Backup & Rollback tự động

Khi cần cập nhật bản cài đặt trong dự án lên phiên bản mới nhất từ source repo:

```bash
# Xem trước nội dung cập nhật (dry-run, không ghi file):
make update-dry-run DEST="/duong/dan/toi/du-an"
# Hoặc trực tiếp qua Python:
python3 scripts/install-skill.py --project "/duong/dan/toi/du-an" --update --dry-run

# Thực hiện cập nhật an toàn:
make update DEST="/duong/dan/toi/du-an"
# Hoặc trực tiếp qua Python:
python3 scripts/install-skill.py --project "/duong/dan/toi/du-an" --update
```

**Cơ chế bảo đảm an toàn của Backup & Rollback:**
1. **Tự động sao lưu trước khi cập nhật:** Trước khi chạm vào thư mục skill, bộ cài tạo một bản backup nguyên trạng tại `<project>/.agents/skills/.mobile-web-ui-ux-skill.bak`.
2. **Tự động Rollback khi gặp lỗi I/O hoặc ngắt tiến trình (SIGINT):** Nếu quá trình copy tệp gặp lỗi I/O hoặc người dùng bấm Ctrl+C (SIGINT), bộ cài bắt sự kiện và lập tức kích hoạt tự động rollback, khôi phục thư mục về nguyên trạng bản sao lưu.
3. **Rollback thủ công khi cần:** Trường hợp tiến trình bị tắt cưỡng bức ngoài tầm kiểm soát của Python (như `SIGKILL` hoặc mất nguồn đột ngột), bản sao lưu `.bak` vẫn được bảo toàn nguyên vẹn và bạn luôn có thể khôi phục thủ công bằng lệnh:
   ```bash
   make rollback DEST="/duong/dan/toi/du-an"
   # Hoặc trực tiếp qua Python:
   python3 scripts/install-skill.py --project "/duong/dan/toi/du-an" --rollback
   ```

## Kích hoạt trong Agent Runtime

Cả OpenAI Codex và Google Antigravity đều hỗ trợ nhận diện thư mục chung `.agents/skills` tại thư mục gốc workspace của dự án.

| Agent Runtime | Cơ chế nhận diện | Cách gọi / kích hoạt | Lưu ý |
|---|---|---|---|
| **OpenAI Codex** | Thư mục `.agents/skills` trong workspace | Gọi lệnh slash (ví dụ `/mobile-web-ui-ux-skill`) hoặc prompt chứa tên skill | Reload/khởi động lại session nếu skill được thêm khi session đang mở |
| **Google Antigravity** | Thư mục `.agents/skills` trong workspace | Prompt tự nhiên nhắc đến tên skill hoặc kích hoạt qua UI active skills | Trong Antigravity IDE, kiểm tra danh sách Customizations active skills; App/CLI hỗ trợ lệnh slash |

> [!NOTE]
> Khả năng được ghi trong tài liệu khác với kết quả chạy thực tế đã quan sát. Việc agent đọc thủ công `SKILL.md` chỉ là giải pháp dự phòng khẩn cấp, không chứng minh agent tự động phát hiện (discovery) skill.

## Gỡ bỏ skill

Để gỡ bỏ skill đã cài:
- Chỉ xóa đúng thư mục đã xác thực: `<project>/.agents/skills/mobile-web-ui-ux-skill` (và bản backup `.mobile-web-ui-ux-skill.bak` nếu có).
- Không chỉnh sửa hay xóa các skills khác nằm trong `<project>/.agents/skills/`.

## Xử lý sự cố thường gặp

- **Đích đã tồn tại (`exit 2`):** Khi dùng lệnh cài mới `install`, bộ cài từ chối ghi đè lên thư mục đã có. Hãy dùng lệnh `update` để cập nhật an toàn có backup, hoặc xóa thư mục cũ nếu muốn cài mới tinh.
- **Xung đột skill toàn cục trùng tên:** Nếu có skill global trùng tên, hãy kiểm tra danh mục active customizations của runtime để đảm bảo bản project-local được ưu tiên.
- **Gốc monorepo:** Luôn truyền đúng thư mục gốc của workspace nơi coding agent được mở, để agent tìm thấy `.agents/skills/` tại root đang làm việc.

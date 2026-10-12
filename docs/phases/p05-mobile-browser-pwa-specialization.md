# P05 — Mobile Browser & PWA Specialization

> Giải quyết các vấn đề đặc thù mobile browser và PWA mà responsive layout không bao phủ.

**Mốc kiểm tra:** branch `main`, commit `62505f6f161b` (12/10/2026). Trạng thái trong tài liệu là đánh giá lúc lập kế hoạch, không tự động đồng bộ với repo; kiểm tra lại trước khi triển khai. `SKILL.md`, README, docs, 3 playbook, scenario specs và CI cấu trúc đã tồn tại; runnable fixtures, UX e2e và A/B chưa có.

## Kết quả cần đạt

Có playbooks browser/PWA cùng ma trận kiểm thử; không bắt buộc mọi website phải biến thành PWA.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. Dấu **Đã có bản nháp** chỉ xác nhận đã có tài liệu, **không** đồng nghĩa có UX validation.

### P05-01 — Browser support & capability matrix

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P04-10.
- **Các bước thực hiện:**
  1. Định nghĩa target là Safari iOS và Chrome Android theo phiên bản/thiết bị được thử thực tế.
  2. Tra nguồn chính thức/compat data cho API như visualViewport, viewport units, display-mode và permissions.
  3. Phân biệt MUST/SHOULD/OPTIONAL và fallback; ghi ngày kiểm chứng support.
- **Đầu ra/file dự kiến:**
  - `references/pwa/browser-compatibility.md`
  - `evals/browser-matrix.md`
- **Definition of Done (DoD):**
  - [ ] Không tuyên bố feature có trên mọi browser.
  - [ ] Các browser-dependent rule có fallback.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P05-02 — Viewport, browser chrome và safe-area

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P05-01.
- **Các bước thực hiện:**
  1. Viết guidance `svh/lvh/dvh`, scroll containers, fixed headers/footers, safe-area insets.
  2. Có ví dụ nội dung bị địa chỉ browser/cử chỉ hệ thống che và cách xử lý.
  3. Kiểm tra tab mode và standalone mode riêng khi có điều kiện.
- **Đầu ra/file dự kiến:**
  - `references/pwa/viewport-safe-area.md`
  - Scenario + test cases
- **Definition of Done (DoD):**
  - [ ] Không overlap primary action với nội dung/gesture area.
  - [ ] Fallback hợp lý trên browser thiếu tính năng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P05-03 — Virtual keyboard, focus và mobile forms

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P05-01, P02-03.
- **Các bước thực hiện:**
  1. Mô tả hành vi visual viewport khi keyboard mở và ảnh hưởng sticky CTA.
  2. Hướng dẫn kiểm soát focus/scroll/caret/error và tránh autofocus gây bật keyboard bất ngờ.
  3. Không biến VirtualKeyboard API thành hard dependency khi support giới hạn.
- **Đầu ra/file dự kiến:**
  - `references/pwa/keyboard-focus.md`
  - `evals/tests/keyboard-manual.md`
- **Definition of Done (DoD):**
  - [ ] Focused field và submit path tiếp cận được trên thiết bị đã thử.
  - [ ] Có hướng dẫn manual test iOS/Android thật.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P05-04 — Installed PWA / standalone experience

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P05-01, P05-02.
- **Các bước thực hiện:**
  1. Audit manifest/start_url/scope/display/icon theo yêu cầu từng nền tảng nhưng không auto-enable PWA.
  2. Kiểm tra UX khi mở từ homescreen, không có browser UI truyền thống.
  3. Đề xuất in-app back/navigation khi có rủi ro bế tắc nhưng vẫn bảo toàn links/deep links.
- **Đầu ra/file dự kiến:**
  - `references/pwa/standalone.md`
  - PWA test case
- **Definition of Done (DoD):**
  - [ ] Standalone navigation không tạo dead end.
  - [ ] Không giả định manifest đủ đảm bảo cài đặt trên mọi nền tảng.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P05-05 — Back, deep linking, routing & restoration

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P05-04.
- **Các bước thực hiện:**
  1. Test URL state, Back, reload, direct link, scroll/focus restoration trong tab/standalone.
  2. Ghi anti-pattern redirect không thể Back và mất state khi chuyển màn hình.
  3. Không thay đổi router/runtime behavior ngoài phạm vi UX fix.
- **Đầu ra/file dự kiến:**
  - `references/pwa/navigation-history.md`
- **Definition of Done (DoD):**
  - [ ] Tác vụ Back/deep-link rõ ràng ở từng context.
  - [ ] Không làm mất route/access control.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P05-06 — Offline, loading, retry & service worker updates

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P05-04.
- **Các bước thực hiện:**
  1. Phân loại sản phẩm cần offline fallback nào thay vì auto cache mọi API/data.
  2. Định nghĩa message offline, retry, stale content, update available và data sync conflict khi áp dụng.
  3. Bổ sung guardrail cho private/authenticated data, cache invalidation và release updates.
- **Đầu ra/file dự kiến:**
  - `references/pwa/offline-update.md`
  - Scenario network states
- **Definition of Done (DoD):**
  - [ ] Không cache dữ liệu nhạy cảm sai phạm vi.
  - [ ] Người dùng có phản hồi rõ khi offline/error/update.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P05-07 — PWA install / permission UX

- **Ưu tiên:** `P1` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P05-01, P05-04.
- **Các bước thực hiện:**
  1. Chỉ xuất hiện install prompt khi platform và user intent phù hợp.
  2. Ghi khác biệt iOS/Android, không dùng tutorial lỗi thời cho mọi browser.
  3. Push/notifications/permissions chỉ được gợi ý theo giá trị thật và quyền user.
- **Đầu ra/file dự kiến:**
  - `references/pwa/install-permissions.md`
- **Definition of Done (DoD):**
  - [ ] Không có permission prompt gây bất ngờ.
  - [ ] Có fallback nếu không hỗ trợ install prompt.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

### P05-08 — Real device smoke tests & limitations

- **Ưu tiên:** `P0` · **Trạng thái ban đầu:** Chưa làm · **Phụ thuộc:** P05-02 → P05-07.
- **Các bước thực hiện:**
  1. Chạy tối thiểu một iOS Safari và một Android Chrome khi có thiết bị; nếu không có, ghi NOT RUN.
  2. Test keyboard, address bar, safe-area, orientation, network transitions và standalone.
  3. Đính kèm OS/browser version, screenshot/video và bug reproduction.
- **Đầu ra/file dự kiến:**
  - `evals/results/pwa-device-matrix.md`
- **Definition of Done (DoD):**
  - [ ] Không gọi emulator là physical device.
  - [ ] Các lỗi còn mở được liệt kê theo impact và browser.
- **Không được coi là hoàn thành nếu:** kết quả chỉ là đề xuất chưa được kiểm chứng ở mức mà task yêu cầu.

## Phase exit checklist

- [ ] Tất cả task P0 của phase có bằng chứng và reviewer có thể tái hiện.
- [ ] Mọi thay đổi source giữ nguyên hành vi/nghiệp vụ và desktop ngoài phạm vi đã thống nhất.
- [ ] Documentation, SKILL.md và automated checks (nếu liên quan) được cập nhật nhất quán.
- [ ] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

# P05 — Mobile Browser & PWA Specialization

> Giải quyết các vấn đề đặc thù mobile browser và PWA mà responsive layout không bao phủ.

**Đối chiếu hiện trạng:** 17/10/2026, base HEAD `4ad759f`. Mô tả bằng chứng gốc dưới từng task là baseline lịch sử; trạng thái hiện tại đối chiếu ở bảng bên dưới. Đây là hồ sơ tiến độ có thể cập nhật; Git lưu lịch sử kế hoạch ban đầu.

## Đối chiếu hiện tại

Các playbook đã được kết nối có điều kiện từ [SKILL.md](../../SKILL.md); [fixture và kiểm thử PWA](../../tests/task-ux/pwa-browser.spec.cjs) cung cấp bằng chứng Chromium có giới hạn. [Plan thực thi](../../plans/261028-0927-mobile-browser-pwa-specialization/plan.md) ghi head PR, kết quả CI và các tiêu chí chưa hoàn thành. Không suy ra kết quả thiết bị thật từ mô phỏng.

| Task | Trạng thái hiện tại | Bằng chứng / giới hạn |
| --- | --- | --- |
| P05-01 | Một phần | [Capability guide](../../references/pwa/browser-capabilities.md); chưa xác lập policy phiên bản thiết bị đích. |
| P05-02 | Một phần | [Viewport guidance](../../references/pwa/viewport-safe-area.md) và Chromium; safe area thực tế NOT RUN. |
| P05-03 | Một phần | [Keyboard guidance](../../references/pwa/keyboard-focus.md), [manual replay](../../evals/tests/pwa-device-manual.md); bàn phím OS NOT RUN. |
| P05-04 | Một phần | [Manifest guide](../../references/pwa/manifest-standalone.md), standalone mô phỏng; cài đặt thực tế NOT RUN. |
| P05-05 | Một phần | [Navigation guide](../../references/pwa/navigation-history.md), Back/Forward và draft fixture; device/access thực tế NOT RUN. |
| P05-06 | Một phần | [Offline/cache](../../references/pwa/offline-cache-security.md), [updates](../../references/pwa/sw-updates-recovery.md), synthetic worker tests; phạm vi CI mới và rollback còn phải đối chiếu. |
| P05-07 | Một phần | [Install](../../references/pwa/install-prompts.md), [push](../../references/pwa/push-permissions.md) và mô phỏng permission; OS prompt và delivery NOT RUN. |
| P05-08 | NOT RUN | [Manual matrix](../../evals/tests/pwa-device-manual.md) đã chuẩn bị; chưa chạy thiết bị vật lý. |

## Kết quả cần đạt

Có playbooks browser/PWA cùng ma trận kiểm thử; không bắt buộc mọi website phải biến thành PWA.

## Task breakdown

Mỗi task nên làm thành một issue/PR nhỏ. `[x]` chỉ xác nhận đúng tiêu chí và phạm vi bằng chứng ghi tại task; `[ ]` là chưa đạt hoặc chưa đủ bằng chứng. Task có thể còn **MỘT PHẦN** dù DoD trên fixture đã đạt, khi đầu ra hướng dẫn hoặc coverage dự kiến vẫn thiếu. Không suy ra phase hoàn tất từ việc file đã tồn tại.

### P05-01 — Browser support & capability matrix

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P04-10.
- **Baseline 17/10 — bằng chứng / còn thiếu:** [MVP exclusions](../mvp-scope.md) và [verification limits](../../tests/reports/task-ux-evidence.md) chưa cung cấp browser support/capability matrix; không lấy Chromium emulation làm Safari iOS/Chrome Android coverage.
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

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P05-01.
- **Baseline 17/10 — bằng chứng / còn thiếu:** [Verification guidance](../../references/verification-criteria.md) nhắc safe-area/viewport nhưng chưa có browser-specific guide, fallback và tab/standalone evidence.
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

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN; device validation NOT RUN · **Phụ thuộc:** P05-01, P02-03.
- **Baseline 17/10 — bằng chứng / còn thiếu:** [Forms guidance](../../references/decisions/forms.md) và [headless clearance tests](../../tests/task-ux/request-form.spec.cjs) là nền tảng; chưa có keyboard-focus guide/manual device procedure và kết quả iOS/Android thật.
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

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P05-01, P05-02.
- **Baseline 17/10 — bằng chứng / còn thiếu:** [SKILL](../../SKILL.md) chỉ yêu cầu phân biệt tab/standalone; chưa có standalone implementation/scenario hoặc homescreen test.
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

- **Ưu tiên:** `P0` · **Trạng thái:** MỘT PHẦN trong browser tab · **Phụ thuộc:** P05-04.
- **Baseline 17/10 — bằng chứng / còn thiếu:** [Order history checks](../../tests/task-ux/order.spec.cjs) có Back/deep link; chưa có tab/standalone restoration và access-control evidence đủ cho PWA task.
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

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P05-04.
- **Baseline 17/10 — bằng chứng / còn thiếu:** [MVP scope](../mvp-scope.md) loại full offline/service-worker diagnostics; form network-error test không thay thế offline/update/cache contract.
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

- **Ưu tiên:** `P1` · **Trạng thái:** MỘT PHẦN · **Phụ thuộc:** P05-01, P05-04.
- **Baseline 17/10 — bằng chứng / còn thiếu:** Chưa có install-permissions guide hoặc permission/install scenario. [Scope](../mvp-scope.md) không tuyên bố PWA installation support.
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

- **Ưu tiên:** `P0` · **Trạng thái:** NOT RUN · **Phụ thuộc:** P05-02 → P05-07.
- **Baseline 17/10 — bằng chứng / còn thiếu:** [Recorded limits](../../tests/reports/task-ux-evidence.md) ghi rõ không có physical device, touch, keyboard, standalone tests. Chưa có device matrix hoặc browser-specific bug inventory; không tick task chỉ vì đã ghi emulator khác physical device.
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
- [x] Các điểm chưa test ghi rõ `NOT RUN`, rủi ro còn lại và task kế tiếp (xem trạng thái/bằng chứng từng task).

Phase chưa đóng: các task bắt buộc hoặc bằng chứng toàn phạm vi còn mở; không đánh dấu các exit gate còn lại chỉ dựa vào structural/browser PASS.

## Handoff cho phase tiếp theo

Ghi lại link PR/commit, baseline fixture version, kết quả thử nghiệm và blockers trong `evals/results/` hoặc issue tương ứng. Không dựa chỉ vào tick checklist.

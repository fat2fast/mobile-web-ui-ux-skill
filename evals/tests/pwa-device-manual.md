# PWA physical-device replay

All rows are **NOT RUN**. Before execution record source revision, date, device, OS, browser/version, display mode, network and artifacts. Use only synthetic accounts and obtain permission before testing actual notification delivery.

| Device and mode | Orientation / chrome / safe area | Form keyboard / focus / zoom | Back / deep link | Offline / reconnect / update | Install / permission / delivery |
| --- | --- | --- | --- | --- | --- |
| iOS Safari tab | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| iOS Home Screen | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Android Chrome tab | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Android installed | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |

Replay overview → detail → Back and deep-link reload; verify correct role access and focus. Rotate with browser chrome expanded and collapsed, focus the final field, reach submit and recover validation without losing input. With an unsaved draft, disconnect, retry, reconnect and inspect a waiting worker update without forcing a reload. Test install and permission only on explicit user action; separately record subscription and actual delivery if available. Check account switch with synthetic data and no private offline content. Record observations, failures and environment limitations separately; emulation does not close these rows.

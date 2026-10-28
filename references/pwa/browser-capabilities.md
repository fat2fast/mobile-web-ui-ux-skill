# Browser capability decisions

Source review: 2026-10-28. Record browser, OS/version, tab or installed mode, actor and task; feature detection is not evidence of task success. Unknown and in-app browsers must retain ordinary web navigation.

| Capability | Context and detection | Fallback and evidence |
| --- | --- | --- |
| Manifest / display mode | Inspect served manifest, launch and scope. `matchMedia('(display-mode: standalone)')` reports current mode, not installation. | Keep the ordinary URL usable; installed-mode device test NOT RUN until observed. |
| Installation | `beforeinstallprompt` is limited and may never fire, including on iOS Safari. | Optional browser-specific instructions; never block the task. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event). |
| Service worker | Secure context; probe `serviceWorker` and inspect registration and scope. | Network website and explicit offline failure. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). |
| Notification and push | Probe `Notification`, permission and `PushManager` separately. iOS Home Screen push has prerequisites and requires a gesture. | In-app or email where available; denial remains usable. [WebKit](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/). |
| Visual viewport / keyboard | `visualViewport` is optional; VirtualKeyboard API is limited. | Natural scroll and focus; device keyboard remains NOT RUN. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport). |
| Safe area / viewport units | Test CSS support and actual chrome/orientation; inset values may be zero. | Normal flow and padding fallback. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/env). |

Check each row against supported iOS Safari tab/Home Screen, Android Chrome tab/installed, desktop and in-app browser versions rather than assuming parity. Responsive sites do not require a manifest or worker. Capability presence does not prove install, permission or delivery.

| Target context | Practical decision and uncertainty |
| --- | --- |
| iOS Safari tab | Do not depend on `beforeinstallprompt`; offer browser instructions only when useful. Web Push described by WebKit requires a Home Screen web app, not this tab. |
| iOS/iPadOS Home Screen | WebKit documents Web Push for Home Screen web apps starting with iOS/iPadOS 16.4, with a direct user gesture. Actual OS version, setup and delivery remain unverified. |
| Android Chrome tab | The install event is conditional, not guaranteed; test the event and preserve tab workflow. Verify worker, keyboard and insets on the target version. |
| Android installed | Check actual display mode, launch scope, history and worker control independently; installed appearance does not prove push or offline functionality. |
| Desktop browser | Manifest, install, worker and notification behavior vary by browser/version; retain keyboard navigation and desktop regression checks. |
| Unknown or in-app browser | Treat install, push, worker and viewport capabilities as unknown until detected and observed; provide normal web navigation and a nonblocking fallback. |

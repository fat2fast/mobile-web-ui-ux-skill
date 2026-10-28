# Browser and device evidence matrix

Record date, OS, browser/version, viewport, tab or installed mode, role/task, result, observation and artifact. PASS/FAIL require the stated check; INFERRED is a conclusion beyond the observation; NOT RUN means no execution. An executed emulated DOM assertion can PASS for that assertion without proving device behavior. Do not promote headless results to device results.

| Context | Manifest/scope | Chrome/safe area | Keyboard/focus | Install/push | Offline/update |
| --- | --- | --- | --- | --- | --- |
| Chromium automated tab | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| iOS Safari tab | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| iOS Home Screen | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Android Chrome tab | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Android installed | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Desktop browser | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |
| Unknown / in-app browser | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN |

Use 320/375/390/430/1280 CSS px, long labels, overlay and orientation. Compare fixed CTA and safe-area overlap with a scrollable alternative. Check supported target versions against dated [capabilities](../references/pwa/browser-capabilities.md); no compatibility claim follows from this unexecuted matrix.

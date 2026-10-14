# Mobile form baseline evidence

Record format: [evidence template](../evidence-template.md).

- **Fixture version:** `UNCOMMITTED` (2026-10-14). Full source/API/lock manifest SHA-256 `70b10c896af975fe78be2f681e3d659ca39aeb8dd0aaf1f5a5079776d1e5e189`, computed in fixture directory with `sha256sum package.json package-lock.json vite.config.js index.html server.js src/main.jsx src/style.css | sha256sum`. `src/main.jsx` alone is `514cbda68c4cb9000d39b55751d93c00b34ca0212f0bd52568489824811ad621`.
- **Task:** submit eight fields, recover from a server rejection, resubmit successfully.
- **Environment:** Chromium 153.0.8010.12 headless, Playwright 1.56.1, WSL Ubuntu; browser interaction at 1280×800 and 390×844 CSS px. Local API at 127.0.0.1:4175.
- **Steps:** start API and Vite per [README](../fixtures/mobile-form/README.md); fill required fields, set Reference code `REJECT`, submit; change it to `OK`, resubmit.
- **PASS:** browser observed POST `/api/submit` return HTTP 422, displayed `Reference code was rejected by server`, and retained Full name `Test User`; after correction it observed HTTP 200 and receipt `LOCAL-001` at 390×844. A direct POST also returned HTTP 422 with the same error. See [browser check output](./baseline-browser-check.txt).
- **PASS (geometry observation):** [390px screenshot](./mobile-form-390.png) shows the fixed submit bar at the viewport bottom while the Notes field is below the fold.
- **INFERRED:** the bar may compete with scrolling or a phone keyboard; overlap has not been reproduced on a physical device.
- **PASS:** `npm ci`, `npm audit` (0 vulnerabilities), `npm run build`; structural validator.
- **NOT RUN:** physical keyboard overlap, screen reader, desktop regression screenshot, real server persistence. Browser resize only simulates viewport geometry.
- **Boundary:** baseline observations do not establish skill decision quality or improved UX.

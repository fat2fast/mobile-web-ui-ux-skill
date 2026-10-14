# Order dashboard baseline evidence

Record format: [evidence template](../evidence-template.md).

- **Fixture version:** current source/lock manifest SHA-256 `e7be97843c54aafd962a0318e30164d311cedc7f1bd9531e85e1f872d28b4154` (2026-10-14), computed in fixture directory with `sha256sum package.json package-lock.json vite.config.js index.html src/main.jsx src/style.css | sha256sum`. `src/main.jsx` alone is `5c92bf9befa72c07b686741328428c17af9ea404be8f2b32a959951d0877c10c`.
- **Task:** search `ORD-1001` → read Pending → open detail → Record follow-up → browser Back.
- **Environment:** Chromium 153.0.8010.12 headless, Playwright 1.56.1, WSL Ubuntu; 390×844 CSS px and 1280×800 CSS px. No physical keyboard/device.
- **Steps:** start port 4173 per [README](../fixtures/order-dashboard/README.md); open `/orders`; search `ORD-1001`; open row ID; record follow-up; browser Back; resize to desktop.
- **PASS:** at both 390×844 and 1280×800, search yielded one row with Pending; detail URL `/orders/ORD-1001` showed Pending; action status read `Follow-up recorded for ORD-1001`; Back returned `/orders`. See [persisted browser check output](./baseline-browser-check.txt).
- **PASS:** valid direct `/orders/ORD-1001` returned via the visible Back button to `/orders`; malformed client route `/orders/%` showed not-found state without a page error (Chromium at 390×844). Build passed again. Direct HTTP request for malformed `/orders/%` was rejected by Vite before React loaded; the client-route check does not cover that server behavior.
- **FAIL (intentional mobile obstacle):** table measured 1080 CSS px in 390 CSS px viewport. [390px screenshot](./order-dashboard-390.png) shows sidebar taking 100px and only the first columns of the table; row action and status require horizontal navigation.
- **PASS:** `npm ci`, `npm audit` (0 vulnerabilities), `npm run build`; structural validator. Browser interaction assertions were rerun on 2026-10-14 and output saved in [log](./baseline-browser-check.txt).
- **NOT RUN:** physical phone, touch, screen reader, 200% zoom, real authorization model. Follow-up is local non-persistent demo behavior, not an external service.
- **Boundary:** baseline observations do not establish skill decision quality or improved UX.

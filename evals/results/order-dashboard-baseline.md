# Order dashboard baseline evidence

Record format: [evidence template](../evidence-template.md).

- **Fixture version:** `UNCOMMITTED` (2026-10-14). Full source/lock manifest SHA-256 `98aca2cbae23f8ac7dbf0da2822383c007b3cbee07fb7310976aeacad2402a0d`, computed in fixture directory with `sha256sum package.json package-lock.json vite.config.js index.html src/main.jsx src/style.css | sha256sum`. `src/main.jsx` alone is `2554e365f4536f9498de1828d51a096d0e10e50694e14501e8227cf7d095fb50`.
- **Task:** search `ORD-1001` → read Pending → open detail → Record follow-up → browser Back.
- **Environment:** Chromium 153.0.8010.12 headless, Playwright 1.56.1, WSL Ubuntu; 390×844 CSS px and 1280×800 CSS px. No physical keyboard/device.
- **Steps:** start port 4173 per [README](../fixtures/order-dashboard/README.md); open `/orders`; search `ORD-1001`; open row ID; record follow-up; browser Back; resize to desktop.
- **PASS:** at both 390×844 and 1280×800, search yielded one row with Pending; detail URL `/orders/ORD-1001` showed Pending; action status read `Follow-up recorded for ORD-1001`; Back returned `/orders`. Desktop full task replay passed on 2026-10-14.
- **PASS:** after a deep-link Back fix, direct `/orders/ORD-1001` with another previous browser entry returned via the visible Back button to `/orders`; normal in-app detail navigation also returned to `/orders` (Chromium at 390×844). Build passed again.
- **FAIL (intentional mobile obstacle):** table measured 1080 CSS px in 390 CSS px viewport. [390px screenshot](./order-dashboard-390.png) shows sidebar taking 100px and only the first columns of the table; row action and status require horizontal navigation.
- **PASS:** `npm ci`, `npm audit` (0 vulnerabilities), `npm run build`; structural validator. Browser check output captured in session on 2026-10-14.
- **NOT RUN:** physical phone, touch, screen reader, 200% zoom, real authorization model. Follow-up is local non-persistent demo behavior, not an external service.
- **Boundary:** baseline observations do not establish skill decision quality or improved UX.

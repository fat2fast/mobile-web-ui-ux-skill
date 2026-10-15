# Order dashboard fixture

Deterministic four-order demo for finding an order, checking status, opening details, recording a follow-up, then using Back. All data and actions stay local; a follow-up shows a local status message and does not persist. No authentication or real permissions are modeled.

The original mobile baseline had a narrow sidebar and a wide table that lost record context while scrolling. The current fixture has top navigation and full-width controls on mobile, with Select and ID pinned beside Status and Total in the table. The ten-column data and local actions remain available. See the [before/after browser evidence](../../../../tests/reports/retrofit-261015-browser-evidence.md) and [browser check](../../../../tests/261015-retrofit/dashboard-browser-check.cjs). The original baseline is in commit `61d178df8542181df903a50511d4178604b8668f`.

Run `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 4173`. Open `http://127.0.0.1:4173/orders`. `npm run build` checks production compilation. After dependency installation the fixture has no runtime CDN or API requirement. Stop the foreground server with Ctrl-C. Use a new browser session or reload `/orders` to reset local state. Deep links to `/orders/ORD-1001` work through Vite fallback.

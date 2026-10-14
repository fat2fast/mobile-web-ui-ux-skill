# Order dashboard baseline

Deterministic four-order demo for finding an order, checking status, opening details, recording a follow-up, then using Back. All data and actions stay local; a follow-up shows a local status message and does not persist. No authentication or real permissions are modeled.

The mobile baseline intentionally retains a narrow sidebar, wide ten-column table, distant row actions, and horizontal scrolling that loses record context. Desktop has the same working controls. This is a baseline, not an improved design.

Run `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 4173`. Open `http://127.0.0.1:4173/orders`. `npm run build` checks production compilation. After dependency installation the fixture has no runtime CDN or API requirement. Stop the foreground server with Ctrl-C. Use a new browser session or reload `/orders` to reset local state. Deep links to `/orders/ORD-1001` work through Vite fallback.

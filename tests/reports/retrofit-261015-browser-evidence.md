# First mobile retrofit browser evidence — 2026-10-15

Source baseline: `61d178df8542181df903a50511d4178604b8668f`. The dashboard baseline source hashes were `main.jsx` `5c92bf9b…` and `style.css` `7edba43a…`; form baseline hashes were `main.jsx` `514cbda6…` and `style.css` `28bb1de5…`. Baseline screenshots and JSON results were captured before editing either fixture. Full hashes are available from `git show` at the baseline commit and the current file hashes from the working tree.

Environment: WSL Ubuntu-24.04, agent-browser managed Headless Chromium 154.0.0.0, viewport heights 844 CSS px, widths 320/375/390/430/1280 CSS px. Dashboard ran on `127.0.0.1:4173`; form and real local API ran on `4174` and `4175`. These are desktop browser viewport simulations, not physical phones or a virtual keyboard.

## Dashboard

The baseline at 390px reserved 100px for the sidebar and displayed only Select, ID, and part of Customer from a 1080px table. At 320px, the page itself overflowed horizontally. The after UI places navigation across the top, makes controls full width, moves Status and Total beside ID, and keeps selection and ID visible while the table scrolls. At 390px, Select, ID, Status, and Total fit in the first view; at 320px, Status fits and Total requires some horizontal scroll. The page itself no longer overflows at 320px. All other fields and row actions remain available in the scrollable table.

The [reproducible browser check](../261015-retrofit/dashboard-browser-check.cjs) passed **14 baseline assertions** and **20 after assertions**, with five viewport observations in each run. Executed checks cover search, status filter, reset, customer sort after retrofit, CSV contents for visible Shipped orders, detail and browser Back, direct detail Back fallback, row Follow-up on Pending/Shipped/Delivered, mixed status bulk Follow-up including selected orders hidden by a filter, and pinned selection/ID geometry at maximum table scroll on all four phone widths. [Baseline results](../261015-retrofit/baseline/results.json), [after results](../261015-retrofit/after/results.json), and screenshots in those folders contain the raw observations. `npm run build` passed after the final dashboard change.

## Form

The baseline's fixed Submit bar covered the bottom of the 390px viewport while Notes continued below it. The after UI puts Submit after Notes in normal document flow, exposes which six fields the real API requires, uses a textarea for Notes, and places server validation errors by the affected field with focus there. The API and submitted data shape are unchanged.

The [form browser check](../261015-retrofit/form-browser-check.cjs) passed **7 baseline assertions** and **14 after assertions**, with five viewport observations each. Executed checks saw HTTP 422 for `REJECT`, retained entered Name and Notes, then HTTP 200 and `LOCAL-001` after changing the reference to `OK`. A blank form still reached the API, returned HTTP 422, displayed the required-field error, and focused Full name after the retrofit. A separate invalid-email submission received HTTP 422, showed an inline error and focused Email; the other values remained, and a corrected email submitted successfully with HTTP 200. [Baseline results](../261015-retrofit/form-baseline/results.json), [after results](../261015-retrofit/form-after/results.json), and screenshots include a full-height after image at 390px. `npm run build` passed after the form change.

Automated axe checks at the current 390px pages reported zero violations and zero incomplete checks for the [dashboard](../261015-retrofit/after/dashboard-a11y.json) and [form](../261015-retrofit/form-after/form-a11y.json). This does not establish full WCAG conformance.

NOT RUN: physical phone keyboard and touch behavior, screen-reader task flow, 200% zoom, production authentication or persistence, and repeated trials. The form's local API returns a demo receipt and saves no data. No controlled A/B skill comparison or measured task-time benefit is claimed.

Unresolved questions: whether an in-flow Submit button remains sufficiently discoverable during long real-world form entry with an on-screen keyboard requires a device check.

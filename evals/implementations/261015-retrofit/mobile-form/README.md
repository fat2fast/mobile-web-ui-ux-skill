# Mobile form fixture

Eight-field request form backed by a local API. The API validates required fields and email; `REJECT` in Reference code returns HTTP 422, and any other valid reference returns receipt `LOCAL-001`. The current form marks required fields, shows server errors beside the affected input, focuses that input, retains entered values, and puts Submit after the fields in normal document flow. See the [before/after browser evidence](../../../../tests/reports/retrofit-261015-browser-evidence.md) and [browser check](../../../../tests/261015-retrofit/form-browser-check.cjs). The original fixed-bar baseline is in commit `61d178df8542181df903a50511d4178604b8668f`.

Run `npm ci`, then `npm run api` in one foreground shell and `npm run dev -- --host 127.0.0.1 --port 4174` in another. Open `http://127.0.0.1:4174/`. Port 4175 serves only the API. Build with `npm run build`. No CDN or external API is needed after installation. Stop both shells with Ctrl-C. Reload to reset values. The API has no persistence.

For an error, fill required fields and set Reference code to `REJECT`; inspect POST `/api/submit` and HTTP 422. Change Reference code to `OK` and resubmit for HTTP 200. Narrow viewport resize only simulates layout; it does not prove behavior with a physical phone keyboard.

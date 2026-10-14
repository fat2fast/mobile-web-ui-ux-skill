# Mobile form baseline

Eight-field request form with intentionally awkward mobile behavior: a fixed submit bar, little keyboard clearance, and a form-level server error far from the field. Values remain after an error. The local API validates required fields and email; `REJECT` in Reference code returns HTTP 422, and any other valid reference returns receipt `LOCAL-001`. This is a baseline, not an improved form.

Run `npm ci`, then `npm run api` in one foreground shell and `npm run dev -- --host 127.0.0.1 --port 4174` in another. Open `http://127.0.0.1:4174/`. Port 4175 serves only the API. Build with `npm run build`. No CDN or external API is needed after installation. Stop both shells with Ctrl-C. Reload to reset values. The API has no persistence.

For an error, fill required fields and set Reference code to `REJECT`; inspect POST `/api/submit` and HTTP 422. Change Reference code to `OK` and resubmit for HTTP 200. Narrow viewport resize only simulates layout; it does not prove behavior with a physical phone keyboard.

# Form decision cases

Records follow the [decision contract](../../references/decision-contract.md). Phone keyboard observations require a real device.

**Task-first local run provenance:** `local-20261016-release`, base SHA `b70877d54ba895d1864d284fb3a3affb34e63a2a`, dirty working tree. The executed 34-spec JSON remains in the local, ignored plan report directory. The durable [task UX evidence](../../tests/reports/task-ux-evidence.md) links the clean-commit CI run and records scope and limits; the local SHA alone is not clean-commit evidence.

## FORM-01 — Short contact form

- **Evidence:** `INFERRED` scenario: name, email and message are one coherent task; no fixture.
- **Mobile task:** send a brief message and correct an invalid email.
- **Candidates:** one in-flow form; multi-step wizard; sticky submit.
- **Selected:** one column with visible labels, email type/autocomplete, inline associated error and in-flow submit.
- **Rejected:** multi-step wizard adds navigation and state risk to three fields; sticky CTA offers little benefit.
- **Preserved:** values after failure, existing validation, paste, zoom, focus, server response and desktop path. Domain typo suggestions, if offered, are optional; an address accepted by existing validation must remain submittable without accepting a suggestion or changing the local part's case.
- **Verify:** `NOT RUN`; submit bad/valid email, decline an optional domain suggestion for a syntactically valid address, inspect response, focus/error association and retained text at 390px and with phone keyboard.

## FORM-02 — Long checkout

- **Evidence:** `INFERRED` scenario: address, delivery and payment are distinct phases; no fixture.
- **Mobile task:** complete checkout, return to edit delivery without losing payment-safe state.
- **Candidates:** meaningful steps; one long form; bottom sheet.
- **Selected:** steps only when existing flow has recoverable state and validation per phase; label progress and Back.
- **Rejected:** bottom sheet cannot comfortably host a long multi-stage flow and keyboard; one long form remains valid if grouping is weak.
- **Preserved:** entered values, server validation, payment permissions, history, paste, keyboard/focus/zoom and desktop checkout.
- **Verify:** `NOT RUN`; traverse steps, trigger server rejection, Back/forward, correct field, submit valid and test physical keyboard.

## FORM-03 — Local server rejection

- **Evidence:** `PASS` local API returned HTTP 422 for `REJECT`, browser retained name and successful resubmit returned receipt ([baseline](../results/form-baseline.md)); keyboard overlap `NOT RUN`.
- **Mobile task:** complete eight fields, fix rejected reference and submit.
- **Candidates:** in-flow submit with field-associated error; fixed bar and form-level error; multi-step form.
- **Selected:** in-flow CTA plus error summary that links/focuses rejected Reference code and keeps all values.
- **Rejected:** current fixed bar competes for vertical space; multi-step flow is unnecessary without evidence of distinct phases.
- **Preserved:** eight values, local server error/success responses, required/email validation, paste, zoom, keyboard/focus and desktop behavior.
- **Verify:** `PASS` baseline invalid/valid response and retained name; `NOT RUN` proposed UI and physical keyboard. Replay `REJECT` then `OK` at 390px and on device.

**Plain-language prompt review (`INFERRED`):** “My order page is awkward on my phone” routes to DATA-01 and NAV-01 records; “my form loses me when an error happens” routes to FORM-03. Both records choose and reject a pattern without asking the user to name UI components. This is text review, not a separate agent execution.

## IMAGE-5 — Create Request Form (Visual Reference 5)

- **Evidence:** `INFERRED` visual observation from Case 5: single-column request form with date inputs, computed days (`Số ngày`), drag-and-drop file upload zone, and submit CTA far below the fold. Backend rules and file size limits are unknown.
- **Mobile task:** Select request type, choose valid date range, verify calculated duration, attach file, and submit on phone without keyboard occlusion.
- **Candidates:** Coherent single-column form with manual+picker dates, mobile file browse button, and verified-clearance submit; multi-step wizard with drag-and-drop.
- **Selected:** Coherent single-column form with accessible date controls, manual date typing (`YYYY-MM-DD`), reactive day calculation, mobile touch file picker, and reachable submit CTA.
- **Rejected:** Multi-step wizard because splitting a short form adds navigation friction; drag-and-drop upload cue because it is non-standard for phone touch interactions.
- **Preserved:** All request parameters, calculated days logic, file attachment handlers, error recovery, and desktop layout. Validation specifics remain inferred.
- **Verify:** `NOT RUN`; requires full request endpoint. Verify manual typing, derived day calculation, file selection, and keyboard clearance at 320px/390px.
## FORM-04 — Request with exact dates and optional calendar choice

- **Evidence:** `PASS` task-first Chromium checks in `tests/task-ux/request-form.spec.cjs` for manual ISO text, native date input value synchronization, inclusive days, server 422/200 and actual multipart bytes. Calendar-popup selection and physical keyboard are `NOT RUN`.
- **Mobile task:** enter known dates or choose from a calendar, correct a rejected reason and retain an attachment.
- **Candidates:** manual-only date fields; native date input only; paired text and native date controls sharing one value.
- **Selected:** paired controls for this fixture's explicit dual-entry requirement, with field errors associated to both.
- **Rejected:** picker-only loses required manual typing; manual-only loses the fixture's explicit picker invocation path. A custom modal adds complexity without evidence.
- **Preserved:** 2026–2027 and 5 MB fixture rules, server authority, request ID, binary upload, retained values/file after rejection, error focus/association and desktop form behavior.
- **Verify:** `PASS` local headless state and server checks in the run above; `NOT RUN` native calendar-popup choice, unsupported-picker platform and physical keyboard.

## FORM-05 — Exact-date entry where a picker slows the task

- **Evidence:** `INFERRED` scenario: operators paste known ISO dates from a work order; no runnable fixture or human timing.
- **Mobile task:** enter an exact date quickly and correct a typo.
- **Candidates:** text entry with format hint; native picker; paired controls.
- **Selected:** manual entry when source validation accepts it and observation shows copy/paste dominates.
- **Rejected:** a required picker that forces month-by-month navigation to a known date; paired controls are optional if evidence later supports them.
- **Preserved:** paste, partial typing, existing date validation and server feedback.
- **Verify:** `NOT RUN`; test paste, malformed/partial input, screen-reader name, keyboard and server correction with representative users.

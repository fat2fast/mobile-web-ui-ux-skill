# Scenario D — Contextual Date-Range & Request Form

## 1. Context & Fixture Ownership Notice

This scenario specifies a contextual mobile request form featuring structured inputs: request type, date range with derived duration, file attachment, and client/server validation.

> **CRITICAL PROVENANCE NOTICE:**
> All validation criteria, date rules, calculated days, file constraints, and server response codes in this scenario are **synthetic fixture-owned specifications**. They are designed for objective testability and do **NOT** represent actual enterprise business rules, permissions, or backend behavior.

---

## 2. Actor Contract & Task

- **Actor:** Team member submitting a time-off or equipment request from a mobile browser.
- **Goal:** Select request type, specify valid date range, verify calculated duration, attach supporting documentation with verified server receipt, handle any validation errors gracefully, and achieve verified submission.
- **Starting Route:** `/`
- **Target Mobile Viewports:** 320 CSS px and 390 CSS px.
- **Success Criteria:**
  - Date inputs support both manual typing and native/custom picker invocation.
  - Calculated days updates reactively and explains its inclusive calculation.
  - File picker is the primary mobile affordance; actual file payload is delivered and verified by the server.
  - On validation error, valid fields remain populated, focus shifts to the first invalid error, and inline accessible feedback is announced (`aria-describedby` and `aria-invalid`).
  - Submit button remains reachable without obscuring input fields or the virtual keyboard.

---

## 3. Fixture-Owned Business & Validation Rules

1. **Request Type:** Select control with options:
   - `Annual Leave` (default)
   - `Equipment Request`
   - `Travel Authorization`
   - Required: if missing, server returns 422 with `field: "requestType"` and `error: "Request type is required"`.
2. **Date Range & Derived Days Calculation:**
   - `startDate`: string in strict `YYYY-MM-DD` format.
   - `endDate`: string in strict `YYYY-MM-DD` format.
   - **Allowed Bounds:** Dates must fall within the range `2026-01-01` to `2027-12-31`. If outside, server returns 422 with `error: "Start/End date must be between 2026-01-01 and 2027-12-31"`.
   - **Calendar Validity:** Dates must represent real calendar dates (e.g. `2026-02-31` is rejected as invalid calendar date).
   - **Range rule:** `endDate` must not precede `startDate`. If `endDate < startDate`, an inline error `End date cannot be earlier than start date` is displayed, and days displays `0` or an alert. Server returns 422 with `field: "endDate"`.
   - **Inclusive day count formula:** If both dates are valid, `computedDays = Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1`.
   - **Manual entry requirement:** Standard keyboard typing into date fields must be supported without forced modal lockouts.
3. **Reason / Justification:**
   - Multi-line textarea. Required.
   - Simulated rejection trigger: If text equals `REJECT`, the server responds with 422: `{"error": "Request reason rejected by business policy", "field": "reason"}`.
4. **Attachment & File Delivery:**
   - Transmitted via `multipart/form-data` (or JSON payload with binary content).
   - Maximum file size: 5 MB (5,242,880 bytes).
   - Allowed formats: `.pdf`, `.png`, `.jpg`, `.jpeg`. If unsupported format is uploaded, server returns 422 with `field: "file"` and `error: "Unsupported file type. Allowed formats: PDF, PNG, JPG"`.
   - Server verifies actual receipt of the file payload (checking byte length and extension).
5. **Server API Contract (`POST /api/request`):**
   - 422 Unprocessable Entity if required fields missing, invalid date order, out of bounds date, invalid file type/size, or `reason === 'REJECT'`. Response format: `{"error": "<message>", "field": "<fieldId>"}`.
   - 200 OK on valid submission returning: `{"status": "ok", "requestId": "REQ-2026-001"}`.

---

## 4. Error Recovery & Keyboard Invariants

- **Value Retention:** On client or server error, all user inputs (`requestType`, `startDate`, `endDate`, `reason`) MUST remain preserved.
- **Accessible Error Association:** All inputs with errors link to their message via `aria-describedby` and set `aria-invalid="true"`.
- **Focus Management:** Upon submission error, keyboard focus automatically shifts to the first invalid field (e.g. if start date is valid but end date is missing, focus shifts directly to `endDate`).
- **CTA Clearance:** The Submit button must not obscure the focused input or be occluded by the virtual keyboard. Both in-flow submit buttons and accessible sticky footers with safe-area insets are acceptable provided clearance is maintained.

---

## 5. Verification & Acceptance Checks

- **Manual Date Entry:** Type `2026-11-01` and `2026-11-05` via keyboard; verify derived days indicates `5 days (inclusive)`.
- **Date Range & Bounds Errors:** Test out-of-range dates (`2028-01-01`), invalid calendar dates (`2026-02-31`), and inverted range (`2026-11-05` to `2026-11-01`); verify error displayed and focused correctly.
- **Real File Attachment & Server Receipt:** Upload an actual file (`.pdf`); verify file transmission, server acceptance, and receipt feedback.
- **Unsupported File Type Rejection:** Upload unsupported file (`.exe`); verify 422 rejection, inline error on `#file`, and `aria-describedby` association.
- **Server Error Flow:** Submit with `reason = 'REJECT'`; verify 422 HTTP response, error banner displayed, values preserved, and focus placed on reason field.
- **Correction & Resubmission:** Change reason to `Valid reason`, resubmit; verify 200 HTTP response and `Submitted: REQ-2026-001` confirmation with `requestId`.
- **Zero Horizontal Overflow:** Document `scrollWidth <= innerWidth` across 320px, 375px, 390px, and 430px viewports.
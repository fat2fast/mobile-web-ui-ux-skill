# Review: task-first mobile UX implementation

**Date:** 2026-10-15  
**Scope:** Local working tree for `plans/261015-1137-mobile-ux-task-first-improvement/plan.md`; no PR reference was supplied.  
**Verdict:** Request changes. The runnable examples and 19 browser tests work, but the request form and evidence gate do not meet the plan's stated contract.

## Findings

### Important — selected attachment is never submitted

`evals/implementations/task-first/request-form/src/main.jsx:43-50` sends JSON containing only `fileName` and `fileSize`. The server at `evals/implementations/task-first/request-form/server.js:11-48` accepts only that metadata and returns success. A user can select a document and receive a successful request ID while the document bytes never leave the browser. The scenario calls the task “attach supporting documentation” (`docs/request-form-scenario.md:15`), but its API contract does not explicitly define file delivery or storage. The browser test at `tests/task-ux/request-form.spec.cjs:103-142` checks only the displayed filename and success response. Reconcile the promised task with the API contract; if attachment delivery is intended, send and validate the actual file and assert receipt on the server. Until then, evidence can claim file selection only.

### Important — documented date and file constraints are not enforced

`docs/request-form-scenario.md:35-60` limits dates to 2026-01-01 through 2027-12-31 and attachments to PDF/PNG/JPG at 5 MB. The implementation server (`server.js:21-45`) checks only nonempty date strings, lexicographic order, and a client supplied size; it never validates calendar dates, allowed bounds, file type, or actual bytes. For example, same-value `2028-01-01` dates pass those checks. The client (`src/main.jsx:18-24,35-40`) also relies on permissive `Date` parsing and string order. Apply the documented rules on the server and add negative tests for invalid/out-of-range dates and unsupported/oversized files.

### Important — automated evidence gate can pass without executed evidence

`tests/task-ux/verify-evidence.py:47-70` searches for literal `` `ID | PASS` `` strings in the report. It does not read `tests/task-ux/artifacts/test-results.json`, verify its existence or outcome, verify the cited artifact paths, or tie a mandatory item to a test run. Thus the script can print `evidence complete` even if browser tests never ran. The report also cites nonexistent “Project build logs” for `FIXTURE-BUILDS` (`plans/261015-1137-mobile-ux-task-first-improvement/reports/task-ux-evidence.md:22`). This misses phase 04 Task 4.2's required result-and-artifact gate. Bind each mandatory item to a real test/build artifact and fail on absent or failed results.

### Important — task acceptance checks still assert a layout proxy or omit the claimed interaction

`tests/task-ux/request-form.spec.cjs:58-69` calls CTA clearance successful solely when the button parent is not `position: fixed`; it never focuses a low field or measures overlap/reachability after viewport resize. This repeats the pattern-only assertion that `docs/mobile-task-acceptance.md` explicitly rejects. `tests/task-ux/comparison.spec.cjs:69-85` clicks two selection buttons but does not exercise keyboard traversal, despite `COMPARISON-SELECTION | PASS` claiming keyboard navigation. Add outcome-based focus/geometry and keyboard tests, and narrow evidence claims where device behavior remains `NOT RUN`.

### Important — required baseline/implementation parity and task measurements are incomplete

Phase 04 Task 4.1 requires shared semantic invariant journeys on baseline and implementation and a before/after primary-task measurement. The comparison baseline has only one CSS/overflow test (`tests/task-ux/comparison.spec.cjs:7-25`); the form baseline checks fixed positioning and one 422 flow (`tests/task-ux/request-form.spec.cjs:6-41`). There is no shared keyboard, selection, date-rule, file, or recovery journey for these pairs. The order baseline records only a boolean overflow, rather than distance needed to reach the relevant action. The evidence report's before/after conclusions therefore exceed the measured comparisons. Run equivalent task probes against both variants and record observed outcomes and scroll distance.

### Important — first-error focus and inline error association fail on reachable paths

When the start date is present but the end date is blank, `evals/implementations/task-first/request-form/server.js:21-24` returns `field: 'startDate'`, so the UI focuses the valid start field rather than the missing end field. The request-type select (`src/main.jsx:97-109`) and file input (`src/main.jsx:197-212`) display possible inline errors without `aria-describedby` or `aria-invalid`. An oversized selected file reaches the latter path. These contradict the scenario's first-error and accessible association rules (`docs/request-form-scenario.md:55-58`). Return the actual invalid field and associate each rendered error with its control; cover these paths in the browser suite.

### Important — success response diverges from the scenario's API contract

`docs/request-form-scenario.md:47-49` specifies a successful response with `requestId`, but `evals/implementations/task-first/request-form/server.js:47-48` returns `receipt`, which the UI consumes at `src/main.jsx:63`. The tests accept the implementation's response and therefore do not detect the contract change. Restore the documented field or explicitly update the scenario and its consumers together.

### Suggestion — acceptance document contains malformed escape characters

`docs/mobile-task-acceptance.md:19-37` and later lines contain literal tabs, form feeds, backspaces, and an escape character inside paths and identifiers (35 control characters total). This makes historical provenance and successor checks hard to read and copy. Replace those characters with normal Markdown code spans and validate rendered text.

### Suggestion — plan status is ahead of its acceptance checkboxes

`plans/261015-1137-mobile-ux-task-first-improvement/plan.md:34-43` marks phase 04 complete while two mandatory acceptance criteria remain unchecked. Keep phase and plan status aligned with the corrected evidence and outstanding automated checks.

## Verification performed

- `cd tests/task-ux && npx playwright test`: **19 passed** on local WSL Chromium.
- `python3 scripts/validate_skill.py`: **PASS**, 332 local links checked.
- `python3 -m unittest discover -s scripts/tests -p 'test_*.py' -q`: **8 passed**.
- `python3 tests/task-ux/verify-evidence.py`: prints **`evidence complete`**; the gate defect above limits what this result proves.
- CI, physical-device keyboard/focus, screen reader, and human task walk-through: **NOT RUN** in this review.

## Unresolved questions

- Does “attach supporting documentation” require transferring the file to the fixture server, or only selecting and displaying it locally? The scenario and API contract need one answer before this item can be closed.

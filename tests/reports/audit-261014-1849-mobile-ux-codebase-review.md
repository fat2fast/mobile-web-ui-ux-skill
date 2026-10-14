# Independent codebase audit — Mobile Web UI/UX Skill

Date: 2026-10-14. Review mode: read-only investigation; this report records findings and recommended work, not a replay result.

## Executive summary

**GO with blocking fixes** for the next bounded verification and implementation phase. The skill's current instructions address the reported business-rule and evidence-label mistakes in source, but no fresh consumer replay proves the agent follows them. The archived answer pairs remain exploratory, and no improved fixture has before/after UX evidence.

Current checkout: `15470f315f98226e8d17399a206e60431988e27e` on `feat/261014-0637-mobile-ux-decision-intelligence`. This is the parent of reference merge `d204d5e63ff6`; their tracked trees are identical (`git diff d204d5e63ff6 HEAD` is empty). The checkout had unrelated untracked `plans/` content and a handoff file when the review began. This report is saved after the user's request; the audit itself changed no source, tests, or settings.

## Confirmed findings

| Severity and status | Evidence | Impact and root cause |
| --- | --- | --- |
| **P0 · CONFIRMED**, historical DATA-03 output | [With-skill answer](../../tests/v.0.1.0/with-skill/data-03/response.txt#L123) excludes a `Delivered` order from bulk follow-up. The [fixture handler](../../evals/fixtures/order-dashboard/src/main.jsx#L26) and [bulk action](../../evals/fixtures/order-dashboard/src/main.jsx#L32) impose no status restriction. | Implementing that answer would remove existing functionality. The answer inferred eligibility from status without tracing the owning handler. No deployed regression is established. |
| **P0 · CONFIRMED**, historical FORM-01 output | [Suggested validation](../../tests/v.0.1.0/with-skill/form-01/response.txt#L415) returns false when a domain suggestion exists; [submit code](../../tests/v.0.1.0/with-skill/form-01/response.txt#L454) then blocks submission. | A syntactically valid address could be rejected solely because the agent guessed a typo. This is unexecuted sample code, not a defect in the current runnable form. |
| **P0 · CONFIRMED**, historical evidence claims | DATA-02 says [“Verified”](../../tests/v.0.1.0/with-skill/data-02/response.txt#L24) but later records browser `NOT RUN` at line 130. A11Y-01 [claims AA conformance](../../tests/v.0.1.0/with-skill/a11y-01/response.txt#L23) from unmeasured “generous spacing”; DATA-03 [claims contrast satisfaction](../../tests/v.0.1.0/with-skill/data-03/response.txt#L104) without measurement. | A closing `NOT RUN` label did not constrain local claims. WCAG 2.2 permits a spacing exception for undersized targets, but the rendered geometry and adjacent targets must be checked before claiming it applies. |
| **P0 · CONFIRMED**, cross-case exposure | The [generator](../../scripts/create-comparison-project.py#L109) puts all cases in each condition workspace. A historical no-skill agent reports reading another case's [run-info](../../tests/v.0.1.0/no-skill/data-02/run-info.txt#L11). The [protocol](../../evals/comparison-protocol.md#L9) bars the other condition's artifacts but does not explicitly bar prior cases in the same condition. | A fresh conversation alone does not prevent filesystem leakage. Per-case isolation is needed before a strict replay. |
| **P1 · CONFIRMED**, limited CI | [CI](../../.github/workflows/validate.yml#L8) runs only [structural validation](../../scripts/validate_skill.py#L2). | Generator isolation, fixture build, interaction, desktop and accessibility checks are not release gates. The [README](../../README.md#L109) correctly disclaims UX proof from validation, so this is a coverage gap rather than a false CI claim. |

## Unconfirmed findings and remaining tests

- **NEEDS TEST — rule repair:** the current [decision contract](../../references/decision-contract.md#L17), [forms playbook](../../references/decisions/forms.md#L13), [accessibility playbook](../../references/decisions/accessibility.md#L12), and [skill workflow](../../SKILL.md#L82) now reject the historical mistakes. No output generated with this exact package has been independently reviewed for those cases.
- **NEEDS TEST — implemented improvement:** [dashboard baseline](../../evals/results/order-dashboard-baseline.md#L9) records working search, detail, follow-up and Back plus an awkward 1080px table in a 390px viewport; [form baseline](../../evals/results/form-baseline.md#L9) records HTTP 422 recovery and successful resubmit. Neither is an improved UI. After-state functionality, desktop regression, phone keyboard and screen reader checks are not recorded.
- **NEEDS TEST — old runtime controls:** [historical review](../../tests/reports/261014-mobile-ux-skill-comparison-review.md#L90) records missing model build, budgets, tool parity and ambient-instruction evidence. Agent-written run-info is not an independent runtime transcript. The archived answers cannot prove a controlled comparison.
- **PARTIAL — fixture match:** [FORM-01 manifest](../../tests/v.0.1.0/with-skill/form-01/manifest.json#L2) uses the order dashboard. Such a run can probe hypothetical reasoning, not runtime form behavior. The [generator](../../scripts/create-comparison-project.py#L75) uses one selected fixture for every case.

## Already addressed in source

The [operating modes](../../SKILL.md#L42) distinguish Improve/Build from read-only Audit/Verify. The [decision contract](../../references/decision-contract.md#L15) asks the agent to choose a justified UX pattern without sending professional pattern choices back to a non-designer. The [skill workflow](../../SKILL.md#L74) requires tracing handlers, validation, permissions and routes. The [DATA-03 case](../../evals/decisions/data-display-cases.md#L32) preserves follow-up for `Delivered`; [FORM-01 case](../../evals/decisions/forms-cases.md#L12) makes typo suggestions optional; [A11Y-01 case](../../evals/decisions/accessibility-cases.md#L12) requires measurement. **Status: PARTIAL** until independent replay.

## Architecture, evaluation, CI and documentation gaps

The [comparison protocol](../../evals/comparison-protocol.md#L7) names the controls but does not enforce them. The [generator test](../../scripts/tests/test_create_comparison_project.py#L17) confirms matching prompts, fixture hashes and exclusion of reviewer material; it does not check isolation between cases. The archived [comparison review](../../tests/reports/261014-mobile-ux-skill-comparison-review.md#L3) properly treats the pairs as exploratory.

The [README](../../README.md#L119) and [roadmap](../../docs/roadmap.md#L28) accurately withhold a UX-improvement claim. Two stateful records need clarification: [form baseline](../../evals/results/form-baseline.md#L5) says `UNCOMMITTED` for the capture even though that source hash is tracked now, and [decision evaluation](../../evals/results/decision-evaluation.md#L25) says the bulk fixture is absent although the dashboard has bulk follow-up. The [phase document](../../docs/phases/p02-mobile-ux-decision-intelligence.md#L5) explicitly labels its older snapshot and should not be interpreted as current status.

## Prioritized action plan

| Priority | Files and dependency | Definition of Done |
| --- | --- | --- |
| **P0** | Make the [generator](../../scripts/create-comparison-project.py) produce a clean workspace per case, condition and trial; update its [test](../../scripts/tests/test_create_comparison_project.py) and the [protocol](../../evals/comparison-protocol.md). Do this before replay. | The agent cannot read another case's prompts, run-info or answers from its workspace. Future outputs are archived outside later generation contexts. |
| **P0** | Freeze prompt, fixture hash, skill package, model/settings, tool inventory, budgets and ambient instructions in the comparison procedure before generation. | Both conditions have documented parity or an explicit unavailable-field limitation; raw answers are frozen before independent review. Missing controls never become a strict `PASS`. |
| **P0** | Replay DATA-03, FORM-01, DATA-02 and A11Y-01 plus adjacent counterexamples from [decision cases](../../evals/decisions/). Preserve v0.1.0 artifacts. | No unsupported Delivered exclusion, mandatory typo suggestion or unmeasured verification claim; record any failure without revising raw output. |
| **P1** | Improve one matching [fixture](../../evals/fixtures/) and add task and preservation assertions; then add meaningful generator and fixture checks to [CI](../../.github/workflows/validate.yml). | Same task has before/after evidence, preserved business behavior and desktop checks. A single fixture result is not presented as general skill superiority. |
| **P2** | Clarify the stale state in [results](../../evals/results/) and keep the [README](../../README.md) navigation current. | Every current claim points to a commit/hash, test, script or artifact; historical raw outputs remain unchanged. |

## Regression test plan

1. **DATA-03:** select Delivered alone and with Pending; assert follow-up includes every selected ID. Recheck selection reset, filter, sort, export, row action, URL/Back and desktop table.
2. **FORM-01:** try invalid syntax, valid syntax with a suggested domain, declining and accepting a suggestion, mixed-case local part, paste and server rejection. Assert submitted value and retained fields follow the existing rules.
3. **DATA-02/A11Y-01:** replay without a matching fixture or measured geometry; require `INFERRED` or `NOT RUN`. Check actual reflow, contrast or target geometry before `PASS`; include wrapping-neighbor and two-dimensional table counterexamples.
4. **Implemented UX:** replay the same task at phone and desktop widths, then add zoom, keyboard and assistive-technology checks relevant to the change. Separate emulation from physical-device evidence.

## Verification of this audit

`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts/tests -p test_create_comparison_project.py -v`: **PASS**, one test. `PYTHONDONTWRITEBYTECODE=1 python3 scripts/validate_skill.py`: **PASS**, structural files and local links. Neither is a UX test. Advisory review agreed with the separation between historical output defects, source-only repair and untested runtime behavior.

## Final recommendation

**GO with blocking fixes:** isolate cases and freeze the protocol before v0.1.1 replay; claim an actual mobile UX improvement only after an implemented UI has before/after task evidence and desktop/functionality regression checks.

## Unresolved question

Can the old runtime expose enough model build, settings, tool inventory and transcript evidence to re-evaluate the archived pairs? If not, keep v0.1.0 as exploratory history.

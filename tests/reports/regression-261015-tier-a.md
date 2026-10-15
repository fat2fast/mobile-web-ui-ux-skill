# Tier A targeted regression — 2026-10-15

Four frozen prompts ran in separate Codex agent contexts against one generated `with-skill` project made from source commit `61d178df8542181df903a50511d4178604b8668f`. Two advice counterexamples ran in separate contexts. Raw case outputs, prompts, manifests, and run-info are preserved under [`tests/261015-tier-a/`](../261015-tier-a/). The model identifier and raw transcripts were unavailable to the case agents; session locators and actual file reads are recorded in each run-info. This is a development regression, not controlled A/B or measured UX improvement.

An independent read-only reviewer checked frozen outputs and matched the four original prompt hashes and approved fixture/skill hashes to their manifests. Results:

| Case | Advice result | Executed UX checks |
| --- | --- | --- |
| DATA-03 | PASS: retains Follow-up for Pending, Shipped, Delivered; no invented status gate; accounts for selected orders hidden by filtering | NOT RUN |
| FORM-01 | PASS: concise advice, optional typo suggestion, no unsolicited code; acknowledges that order-dashboard has no contact form | NOT RUN |
| DATA-02 | PASS: aligned comparison recommendation, no invented percentage or `Verified` claim | NOT RUN |
| A11Y-01 | PASS: conditional 24px-circle spacing test and neighboring targets; no page-wide AA claim | NOT RUN |
| DATA-03 explicit rule | PASS: applies the supplied Pending/Shipped-only rule to mixed, row, detail, and bulk paths | NOT RUN |
| A11Y-01 boundary | PASS: 3px gap fails pairwise circle test; 4px gap meets pairwise geometry, conditional on rendered bounds and other neighbors | NOT RUN |

The separate FORM-01 code variant in [`tests/261015-tier-a/form-code/`](../261015-tier-a/form-code/) preserves required Name, Email, and Message fields. A valid `user@gmai.com` can submit unchanged; accepting its optional suggestion changes only the email. `node tests/261015-tier-a/form-code/test-form.cjs` passed source markup and simulated handler checks from the repo root and from the variant folder. Browser rendering, device keyboard, network submission, and screen reader checks were NOT RUN. The variant intentionally reports “Message ready to send” because no endpoint was supplied.

No skill rule patch was made: the fresh outputs did not reproduce the earlier failures, so there is no evidenced rule defect to repair. The old archives remain unchanged.

Unresolved questions: raw transcript identity and exact model version are unavailable for these Codex subagent runs. The DATA-02 scenario has no matching implemented fixture, so its UX benefit remains unmeasured.

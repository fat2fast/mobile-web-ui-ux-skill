# Visual implementation replay protocol

Frozen 2026-10-17 before catalog/navigation implementations. This is Tier A single-condition development evidence under the [comparison protocol](comparison-protocol.md), not a Tier B superiority study. Advice-only records and implementation results are graded separately. No consumer run is claimed by this document.

## Consumer boundary and input

Use a fresh conversation and the original navigation baseline produced for [scenario C](scenarios/navigation.md). Never seed the consumer with the task-first candidate. Supply only baseline app source, installed runtime payload (`SKILL.md`, `references/`, license), ordinary project instructions and the frozen prompt below. Keep this rubric, case answers, candidate source, earlier outputs and review artifacts outside its accessible input. A clean per-case worktree is optional; a demonstrated access boundary and fresh context are required.

Implementation prompt:

> On my phone I keep losing my place when moving from the overview to a task and editing it. Some less-used destinations are hard to find. Please make this existing app easier to use on phones while keeping its working behavior and desktop experience.

Advice-only prompt (separate run, no edits):

> On my phone I keep losing my place when moving from the overview to a task and editing it. Some less-used destinations are hard to find. Review this app and explain what you would change and how you would check it. Do not implement changes.

Do not append expected layouts, answer checklists, product restrictions or this rubric to either prompt. Freeze prompt bytes/hash before the run. Preserve baseline data/route/permission rules; the consumer discovers them from source.

## Retained evidence

Record baseline source SHA and file manifest; runtime payload version and a sorted path/SHA-256 manifest including every installed file; installer receipt and manifest identity; exact prompt/hash; exposed model/runtime/session identity (unknown when unavailable); ambient instructions/tools; files actually read; raw response and redacted runtime trace. Record the actual patch separately, checks/commands and their artifacts, source/run identity and remaining risks. Never substitute a self-authored trace for unavailable runtime evidence. Follow the comparison protocol's archive redaction and disclose its limits.

For implementation, retain before/after rendered screenshots, representative contrast and task checks, responsive/state results and desktop behavior on the consumer's actual patch. A response proposing code without changing files is advice, not implementation. Missing required provenance or execution evidence is NOT RUN/blocked; preserve observed failures without relabeling them.

## Independent reviewer rubric

Freeze raw response and diff before independent assessment. The reviewer did not generate the patch; give it baseline, actual diff, task prompt, payload identity and execution artifacts. Multiple layouts can pass. Grade each row PASS/FAIL/NOT RUN with a quote, source path or executed artifact; do not count pattern keywords.

| Dimension | Acceptance / counterexample |
| --- | --- |
| Source and priority | Trace actor/task priorities, components, handlers/rules and tokens. Mark inference. Reject invented permissions, transitions or validation. |
| Visual reasoning | Explain a viable alternative and why the chosen hierarchy/density fits the task. Preserve brand; justify any color correction with actual rendered measurement. A fashionable pattern name is insufficient. |
| Information and state | Preserve identity, labels/values/units, meaningful status and supported loading/empty/error/success/selected behavior. Reject hidden required data or color-only meaning. |
| Implementation | An actual scoped diff implements the choice and keeps existing actions/routes/deep links/Back/restricted access. An advice-only response cannot pass this row. |
| Task and desktop | Execute overview → task → edit → Back; secondary/restricted destinations, direct links, keyboard and desktop. Keep exact original save/cancel/permission behavior. |
| Measurement honesty | Distinguish source fact, inference, measurement and NOT RUN. Check actual contrast/state, narrow widths, text resize and desktop. Headless Chromium does not prove human/device/screen-reader usability or full WCAG conformance. |
| Provenance | Trace actual skill load, payload version/hash, fresh context, baseline-only input, actual patch and same-source/run checks. Missing trace cannot be inferred from install success. |

Report bounded transfer evidence only. This sample cannot close TabDo real-project pilot Gate 3. Tier B remains NOT RUN; no superiority claim follows from a single-condition replay. Activation evidence separately labels automatic selection, manual loading, and installation only. If a runtime cannot expose skill-load/session/patch evidence, record NOT RUN and stop the dependent replay gate.

# Mobile UX Verification Criteria

## Purpose

Check whether the proposed or implemented change helps users complete mobile tasks. **Do not give arbitrary numeric design scores or unmeasured benefit percentages.** A quantitative improvement needs a named baseline, after measurement and method. Otherwise describe the expected benefit as a hypothesis. Compare baseline and modified experience using observable evidence; a proposed UI remains `NOT RUN` until implemented and checked.

## Scenario evaluation

1. **Task completion:** Can the primary mobile user complete the specified task with the intended controls?
2. **Discoverability:** Can the user find the relevant action without guessing or relying on hover?
3. **Content integrity:** Are mandatory information and existing functions still reachable?
4. **Interaction clarity:** Can the user understand active state, feedback, errors, loading and recovery?
5. **Accessibility:** Are semantic controls, labels, keyboard focus, zoom and non-gesture alternatives preserved?
6. **Mobile robustness:** Does layout behave at small widths, long text, focus/keyboard and portrait/landscape when relevant?
7. **Regression:** Are desktop appearance/flows and route/business behavior intact?

## Suggested device-width matrix

320, 375, 390, 430 CSS px, plus one representative tablet and desktop viewport. Choose device profiles based on the target population; widths do not prove iOS/Android browser compatibility.

## Evidence labels

- **PASS:** An identified check ran and met its assertion; name the method and artifact. State whether it checked source, metadata or rendered behavior.
- **FAIL:** An identified check ran and failed its assertion; include reproduction steps.
- **NOT RUN:** A proposed interaction or assertion was not executed; provide the missing environment and replay steps.
- **INFERRED:** A bounded conclusion from inspected source or a design hypothesis; name its basis and limits. Inspecting source does not make an unrun interaction check `PASS`.

A headless click/fill on `input[type=date]` proves input reachability and value synchronization; it does not prove selection from the platform calendar popup, unsupported-picker fallback, or physical virtual-keyboard clearance. Mark those separately. For build/browser evidence, use artifacts from the same run and source revision; identify a dirty local worktree as such.

Keep source and metadata checks separate from UX results. A successful prompt-hash check, for example, establishes provenance, not form behavior.

## Baseline / after format

```text
Scenario and version:
Task:
Before: steps + obstacles + artifacts
After: steps + artifacts
Checks executed + browser/viewport:
Regressions:
Limitations / untested:
```

## Completion

Structural validation cannot establish UX quality. Record task and interaction results on the implemented UI before claiming improvement. Test on real devices for browser, keyboard or PWA behavior that emulation may miss.

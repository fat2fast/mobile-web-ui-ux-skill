# Mobile UX Evaluation Criteria

## Purpose

Measure if the skill helps an agent improve mobile user tasks. **Do not give arbitrary numeric design scores.** Compare baseline and modified experience using observable evidence.

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

- **PASS:** Tested or directly observed and meets criterion.
- **FAIL:** Tested and fails criterion; include reproduction steps.
- **NOT RUN:** No adequate tools/time/environment; provide manual steps.
- **INFERRED:** Based on source or design heuristics, requires observation.

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

## Release gating

Starter structural validation only ensures repository integrity. UX readiness requires runnable fixtures, baseline capture, modified implementation and recorded task/interaction results. Test on real devices for browser/keyboard/PWA behavior that emulation may miss.

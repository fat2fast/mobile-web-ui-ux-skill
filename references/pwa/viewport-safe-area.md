# Viewport and safe-area decisions

For the actor completing the primary task, prefer natural scrolling over a fixed-height shell. Inspect browser chrome expansion and collapse, orientation, top and bottom safe areas, navigation and sticky action overlap. Preserve desktop, zoom and existing actions. Consider `svh` for a conservative minimum or `dvh` for dynamic resizing only after target testing; retain normal-flow fallback. Avoid stacking fixed footers.

At 320, 375, 390, 430 and 1280 CSS px, use long labels and an open menu: critical content and actions must remain reachable without page-level horizontal scrolling. Counterexample: a fixed submit button covers the last field or bottom inset; move it into flow or reserve space and verify with keyboard and orientation. DOM geometry does not prove device chrome or safe-area behavior; mark those NOT RUN unless observed. Record target versions and source date from [capabilities](browser-capabilities.md).

Pass when scrolling reaches the last field and submit, sticky controls do not intersect focused controls or safe-area obstructions, and desktop behavior is preserved. Fail if any required action is covered or unreachable; inspect with expanded and collapsed chrome and both orientations on an actual supported device.

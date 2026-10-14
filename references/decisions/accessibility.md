# Mobile web accessibility decisions

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for normative criteria and [checklist](../../evals/accessibility-checklist.md) for assertions. Use [decision record](../decision-contract.md); do not claim conformance from source review alone.

- **Structure/labels:** associate visible labels and errors, use native buttons/links/tables where semantics fit ([1.3.1 A](https://www.w3.org/TR/WCAG22/#info-and-relationships), [3.3.2 A](https://www.w3.org/TR/WCAG22/#labels-or-instructions), [4.1.2 A](https://www.w3.org/TR/WCAG22/#name-role-value)).
- **Keyboard/focus:** all controls operable by keyboard; focus visible, and the focused component is not entirely hidden by author-created content ([2.1.1 A](https://www.w3.org/TR/WCAG22/#keyboard), [2.4.7 AA](https://www.w3.org/TR/WCAG22/#focus-visible), [2.4.11 AA](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum)). Preserve logical focus entry/return for modal overlays.
- **Text and reflow:** support text resize and single-column reflow except genuinely two-dimensional content ([1.4.4 AA](https://www.w3.org/TR/WCAG22/#resize-text), [1.4.10 AA](https://www.w3.org/TR/WCAG22/#reflow)). Do not discard data to remove scroll.
- **Contrast:** normal text 4.5:1 and large text 3:1 ([1.4.3 AA](https://www.w3.org/TR/WCAG22/#contrast-minimum)); essential control indicators and focus visuals have [1.4.11 AA](https://www.w3.org/TR/WCAG22/#non-text-contrast) conditions.
- **Error/status:** identify an input error in text, announce status without stealing focus, expose expanded state where applicable ([3.3.1 A](https://www.w3.org/TR/WCAG22/#error-identification), [4.1.3 AA](https://www.w3.org/TR/WCAG22/#status-messages), [4.1.2 A](https://www.w3.org/TR/WCAG22/#name-role-value)).
- **Targets:** [2.5.8 AA](https://www.w3.org/TR/WCAG22/#target-size-minimum) requires 24×24 CSS px or one of its exceptions, including spacing; [2.5.5 AAA](https://www.w3.org/TR/WCAG22/#target-size-enhanced) is 44×44 CSS px with different exceptions. Do not map native pt/dp directly to CSS px.

Apply these constraints to navigation, tables, forms, actions, content, overlays and touch decisions from the start. A horizontal comparison table can be valid under the two-dimensional reflow exception; maintain headers and row identity. [Cases](../../evals/decisions/accessibility-cases.md).

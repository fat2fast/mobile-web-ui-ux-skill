# Accessibility counterexample cases

Records follow the [decision contract](../../references/decision-contract.md); source-only reviews are `INFERRED`.

## A11Y-01 — Small spaced targets
- **Evidence:** `INFERRED` scenario with 20×20 CSS px targets separated enough for the [2.5.8 spacing exception](https://www.w3.org/TR/WCAG22/#target-size-minimum).
- **Mobile task:** activate a compact inline control without accidental neighbor activation.
- **Candidates:** enlarge to 24×24; retain size with measured spacing exception.
- **Selected:** enlarge when layout permits as usability guidance; spacing exception can meet AA if measured.
- **Rejected:** blanket claim that every target below 24px fails AA; exceptions exist. 44px is AAA target size with separate exceptions.
- **Preserved:** accessible name, function, keyboard focus and text reflow.
- **Verify:** `NOT RUN`; measure actual bounding boxes and 24px circles; test at zoom and touch. No conformance claim from dimensions alone.

## A11Y-02 — Horizontal comparison
- **Evidence:** `INFERRED` price-comparison case [DATA-02](./data-display-cases.md).
- **Mobile task:** compare aligned product attributes.
- **Candidates:** semantic scrolling table; stacked cards with repeated labels.
- **Selected:** semantic table when two-dimensional alignment carries meaning under [1.4.10](https://www.w3.org/TR/WCAG22/#reflow), with clear headers and scroll cues.
- **Rejected:** blanket conversion to cards because it can destroy comparison; horizontal scroll is not universally forbidden.
- **Preserved:** all products/values, header association, keyboard scroll and zoom.
- **Verify:** `NOT RUN`; check header announcements, row identity, reflow at effective 320 CSS px (such as 1280px at 400% zoom), 200% text resize separately, and a visible scroll affordance. Check cell text independently of the two-dimensional table exception.

## A11Y-03 — Modal focus
- **Evidence:** `INFERRED` [OVER-01](./overlays-cases.md) scenario.
- **Mobile task:** confirm/cancel and return to the invoking control.
- **Candidates:** native dialog/modal with managed focus; custom visual overlay without focus management.
- **Selected:** accessible modal with initial focus, contained tab sequence, Escape and focus return.
- **Rejected:** visual overlay that leaves keyboard focus behind it; it cannot preserve the task.
- **Preserved:** keyboard access, visible focus, status, background state, Close/Cancel and zoom.
- **Verify:** `NOT RUN`; keyboard and screen-reader replay on actual implementation, including 390px and zoom.

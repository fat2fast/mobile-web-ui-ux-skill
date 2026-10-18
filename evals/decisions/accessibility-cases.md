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
- **Candidates:** accessible modal with initial focus, contained Tab sequence, Escape/Cancel and focus return; full-page confirmation with a named heading, managed entry focus, keyboard-operable Confirm/Cancel and Back/return focus to the invoking control.
- **Selected:** modal for this brief decision on one named order; preserve initial focus, contained Tab sequence, Escape/Cancel and focus return while background interaction is locked.
- **Rejected:** accessible full-page confirmation remains feasible and keeps the background task inactive, but adds route/history overhead for two choices. Prefer it when more review context is required.
- **Anti-pattern:** a visual overlay without focus management leaves keyboard focus behind it and fails the accessibility constraint; it is not a feasible candidate.
- **Preserved:** keyboard access, visible focus, status, background state, Close/Cancel and zoom.
- **Verify:** `NOT RUN`; keyboard and screen-reader replay on actual implementation, including 390px and zoom.

## A11Y-04 — Normal and large text on brand surface

- **Evidence/source:** `INFERRED` illustrative brand button and heading, not a measured defect. Source of thresholds: [SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum); actual component/token owner must be inspected on implementation.
- **Mobile task:** read the action label and heading before acting.
- **Candidates:** preserve brand surface with a suitable on-color; change the scoped surface token after reviewing consumers.
- **Acceptable selection:** keep brand primary and correct on-color when it meets ≥4.5:1 for normal text and ≥3:1 for actual large text (18pt or 14pt bold, or equivalent CJK size). Either scoped alternative can pass with rendered measurements and preserved identity.
- **Counterexample:** treating a 16px bold label as large text, rounding 4.49 to a passing 4.5, or replacing the global palette from an unmeasured screenshot.
- **Preserved:** label, action handler, brand recognition, all supported states/themes and desktop.
- **Verify:** `NOT RUN`; record computed font size/weight, foreground/background, state trigger/oracle and unrounded ratio before/after. No current UI contrast or decision-quality runtime PASS.

## A11Y-05 — Essential indicator and keyboard focus

- **Evidence/source:** `INFERRED` custom control with an essential outline and author-supplied focus ring; [SC 1.4.11](https://www.w3.org/TR/WCAG22/#non-text-contrast), [2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible).
- **Mobile task:** identify the input and track keyboard focus.
- **Candidates:** scoped darker border/ring; supported additional contrasting outline that preserves the token system.
- **Acceptable selection:** retain a visible indicator meeting applicable ≥3:1 adjacent-color conditions. Decorative borders need not independently meet the essential-control test when other sufficient identifying information exists.
- **Counterexample:** checking only button text while an essential boundary disappears; exempting an enabled selected control as inactive; treating disabled exemption as permission to remove labels or state semantics.
- **Preserved:** keyboard order, control name/state, supported disabled behavior and desktop.
- **Verify:** `NOT RUN`; Tab to the actual element, assert focus, measure ring and relevant adjacent surfaces; record inactive/user-agent exception only when its criterion applies. Do not apply AAA focus geometry as an AA requirement.

## A11Y-06 — Error meaning beyond color

- **Evidence/source:** `INFERRED` form error with red border only; [SC 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color), [3.3.1](https://www.w3.org/TR/WCAG22/#error-identification), [4.1.3](https://www.w3.org/TR/WCAG22/#status-messages).
- **Mobile task:** find and correct the actual rejected input.
- **Candidates:** associated visible error text; error summary linking to fields plus associated inline text when many errors warrant it.
- **Acceptable selection:** use existing validation messages with field associations and appropriate status semantics. Preserve accepted inputs and server validation.
- **Counterexample:** a higher-contrast red border alone; adding an unsourced validation rule to create an error case; hiding all text and retaining only a colored status dot.
- **Preserved:** handler validation, field values, recovery, error content and desktop.
- **Verify:** `NOT RUN`; trigger an existing invalid transition, check visible explanation/association and keyboard correction. A color-only negative probe must detect removed meaning, independently of contrast arithmetic.

## A11Y-07 — Translucent badge and unresolved surface

- **Evidence/source:** `INFERRED` translucent status badge, with solid-ancestor and image-backed variants; [SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum).
- **Mobile task:** read status in its actual context.
- **Candidates:** preserve alpha with resolved solid paint stack; use an existing opaque status surface where a complex background prevents reliable measurement.
- **Acceptable selection:** composite foreground/background and ancestor opacity in paint order for the solid variant; request focused rendered review or use a justified opaque surface for image/gradient/blend cases. Mark unresolved measurements review required.
- **Counterexample:** comparing token hex values against assumed white, ignoring ancestor opacity, or labelling an inconclusive result PASS.
- **Preserved:** status text/semantics, existing state logic, brand roles and desktop.
- **Verify:** `NOT RUN`; assert supported states/themes, retain stack/ratio and screenshot evidence; a complex unresolved essential pair blocks a contrast PASS. No browser run is implied by this reasoning example.

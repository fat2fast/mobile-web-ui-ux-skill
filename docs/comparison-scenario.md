# Scenario C — Aligned Multi-Entity Comparison Table

## 1. Context & Rationale

A common mobile design error is converting all tabular layouts into vertical cards. While effective for single-record triage, card conversion fails when the primary user task is **direct cross-record metric comparison** across multiple entities.

This scenario defines the requirements for a semantic, horizontally scrolling comparison table where aligned units and values are essential to the user goal.

---

## 2. Actor Contract & Task

- **Actor:** IT decision-maker or infrastructure engineer comparing cloud computing tiers on a mobile device.
- **Goal:** Compare 4 service tiers side-by-side across aligned metrics (price, compute, memory, storage, bandwidth, SLA), identify the optimal plan, and trigger selection.
- **Starting Route:** `/`
- **Target Mobile Viewports:** 320 CSS px and 390 CSS px.
- **Success Criteria:** User can scroll horizontally smoothly to compare attributes; plan identity (column header) and row attributes remain identifiable; units of measurement remain aligned and clearly legible; selection action is reachable for all plans.

---

## 3. Dataset & Aligned Metrics

The dataset defines 4 distinct tiers compared across 7 aligned metrics:

| Attribute / Metric | Starter | Standard | Pro (Featured) | Enterprise |
|---|---|---|---|---|
| **Tier Identity** | Starter Plan | Standard Plan | Pro Plan | Enterprise Plan |
| **Monthly Price** | $19 / mo | $49 / mo | $99 / mo | $249 / mo |
| **vCPU** | 2 cores | 4 cores | 8 cores | 32 cores |
| **Memory** | 4 GB | 16 GB | 32 GB | 128 GB |
| **Storage** | 80 GB NVMe | 250 GB NVMe | 500 GB NVMe | 2 TB NVMe |
| **Bandwidth** | 2 TB / mo | 5 TB / mo | 10 TB / mo | Unlimited |
| **Uptime SLA** | 99.9% | 99.95% | 99.99% | 99.999% |
| **Action** | Select Starter | Select Standard | Select Pro | Select Enterprise |

---

## 4. Design Requirements & Mobile UX Patterns

- **Semantic Table Structure:** Use `<table>`, `<thead>`, `<tbody>`, with `<th scope="col">` for plans and `<th scope="row">` for attributes.
- **Pinned Row/Column Identity:** The attribute label column is sticky on horizontal scroll so row context is never lost during panning.
- **Scroll Affordance:** Explicit visual scroll cue (gradient shadow or indicator) signals that additional plans are reachable horizontally.
- **Touch & Keyboard Operability:** Smooth horizontal swipe scroll with momentum (`-webkit-overflow-scrolling: touch`); full keyboard navigation via `tabindex` or directional keys.
- **Preserved Zoom & Scale:** Viewport settings allow pinch-to-zoom without layout clipping.

---

## 5. Verification & Acceptance Checks

- **Structure & Semantics:** HTML table with accessible headers and complete aligned units.
- **Horizontal Scroll Measurement:** Container `scrollWidth > clientWidth` is permitted and expected here, provided sticky row labels remain readable.
- **Selection Action:** Clicking 'Select [Plan]' displays confirmation message `Selected plan: [Plan Name]`.
- **Keyboard Access:** All plan selection buttons reachable via keyboard Tab order.
- **Desktop Viewport (1280px):** All 4 plans display comfortably in one view without horizontal scroll.
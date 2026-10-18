# Visual baseline provenance — retrospective review note (2026-10-18)

> This is **not** the original "independent code-simplifier image review" named in `visual-baselines.json`. The underlying `phase-04-image-review-r2.md` report was not present in the PR when checked. This document records what can be verified independently during PR #11 follow-up, and does not invent a historical sign-off.

## What is verifiable

- The registry lists 43 `-r2-chromium-linux.png` reference snapshots with SHA-256 digests, pinned font/browser environment and `approved` values. `verify-evidence.py` cross-checks those digests against the actual current-run images.
- The older 43 `-chromium-linux.png` files without `-r2` are not used by the current `visual-states.spec.cjs` references or registry; the follow-up commit deletes those obsolete tracked copies.
- An independent assistant inspected **13 of the 43 current** `-r2` images directly from GitHub on 2026-10-18 (not a full 43-image design sign-off). The inspected images were:

  - `normal-catalog-390-r2-chromium-linux.png`
  - `normal-navigation-390-r2-chromium-linux.png`
  - `normal-orders-390-r2-chromium-linux.png`
  - `normal-form-390-r2-chromium-linux.png`
  - `normal-comparison-390-r2-chromium-linux.png`
  - `navigation-edit-error-390-r2-chromium-linux.png`
  - `orders-selected-empty-390-r2-chromium-linux.png`
  - `normal-catalog-1280-r2-chromium-linux.png`
  - `normal-navigation-320-r2-chromium-linux.png`
  - `normal-orders-1280-r2-chromium-linux.png`
  - `form-server-error-selected-390-r2-chromium-linux.png`
  - `catalog-selected-empty-390-r2-chromium-linux.png`
  - `comparison-selected-390-r2-chromium-linux.png`

## Sampled visual observations (bounded)

The inspected mobile images show distinct task-first list/form/navigation/comparison arrangements. Catalog pricing and units remain legible in the sampled list/comparison screens; the order selected-empty state retains its bulk action; the form server-error state visibly associates an error with Reason. The 320px navigation image wraps the More destinations control to the next row but retains readable navigation. The 1280px order dashboard still has a horizontally scrollable dense table; this is a deliberate pattern subject to its functional contract, not evidence that all columns fit simultaneously.

These observations are limited to the listed snapshots and do **not** establish that every state is visually correct, WCAG conformant, or usable on physical devices.

## Still missing — independent approval provenance

The pre-existing registry says `independent code-simplifier image review 2026-10-18; phase-04-image-review-r2.md` for all 43 approvals, but the original separate review trace, per-snapshot decisions and reviewer artifacts were **not available** in the branch at the time of this update. Neither a hash match nor this 13-image spot check independently authenticates those prior approvals.

**Required to close the review-evidence finding:** attach the genuine earlier reviewer report with a traceable source and complete per-snapshot scope, **or** commission and retain a fresh independent review of all 43 current references. Do not relabel this retrospective note as that missing historical review. Until then, report the original approval provenance as **UNVERIFIED** even if the deterministic visual CI checks pass.

This note does not change the existing deterministic PASS/FAIL checks or rewrite screenshot pixels.

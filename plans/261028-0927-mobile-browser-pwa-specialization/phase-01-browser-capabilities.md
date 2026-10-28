# Phase 01 — Browser capabilities, viewport and keyboard

**Status:** in progress · **Effort:** 6h · **Tasks:** 01–04 · **Maps:** P05-01/02/03 · **Depends:** Existing P02 forms/accessibility and P04 verification.


**Historical PR snapshot a7b3176 (2026-10-28):** Partial: all four guidance files exist; target-version detail and PWA-specific rendered viewport, overlay, keyboard and focus acceptance are not fully exercised. Device checks remain NOT RUN. See the [task status](plan.md#implementation-status--pr-15-2026-10-28).

## Files to create (implementation, not this plan branch)

- `references/pwa/browser-capabilities.md`: capabilities by iOS Safari tab/Home Screen, Android Chrome tab/installed, desktop and unknown/in-app browser; sources and as-of versions.
- `references/pwa/viewport-safe-area.md`: browser chrome, svh/lvh/dvh, sticky/footer, safe-area, orientation, fallback.
- `references/pwa/keyboard-focus.md`: visual viewport, native keyboard, focus/submit/error/recovery, optional APIs.
- `evals/browser-matrix.md`: evidence labels and manual vs automated matrix.

## Work items and verification

**01 (1.5h) Support matrix:** For manifest/display-mode, `beforeinstallprompt`, service worker, Push/Notification, `visualViewport`, keyboard API and safe-area, state feature detection, platform context, source date, fallback and `NOT RUN` devices. **DoD:** no unqualified universal support claim.

**02 (1.5h) Browser chrome/safe area:** Document address bar expand/shrink, top/bottom safe areas, app navigation overlap, dynamic viewport resize. Prefer natural scroll; `100svh`/`100dvh` only conditionally. **DoD:** task actions and critical content remain reachable in narrow layout, no disabled zoom, desktop preserved.

**03 (1.5h) Keyboard:** Test focus/validation/submit path and scrolling. Do not depend on experimental VirtualKeyboard API; `window.visualViewport` is optional. **DoD:** no surprise autofocus, stale scroll lock or obscured submit under specified tested context.

**04 (1.5h) Positive and negative examples:** 320/375/390/430/1280 CSS px; small viewport, long labels, menu/overlay focus. Provide counterexamples for fixed CTA under keyboard and safe-area overlap. **DoD:** source/DOM checks separated from real OS keyboard `NOT RUN`.

## Security / scope

No PWA code or dependence on OS APIs is imposed on a normal responsive project. Preserve form validation, auth and desktop. End phase with inspectable examples and verifiable acceptance; final routing to `SKILL.md` belongs to Phase 04.

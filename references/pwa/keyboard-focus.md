# Keyboard and focus decisions

For a user completing a form, preserve validation, values, submit handlers and desktop behavior. Avoid surprise autofocus and stale scroll locks. Prefer ordinary flow, native controls and scroll-to-reveal; use `visualViewport` only when detected and justified, never as the sole means to reach submit. Do not depend on the experimental VirtualKeyboard API. Test focus order, error announcement and recovery, submit, close and retry, including an overlay and long labels.

Counterexample: a fixed CTA hides behind the native keyboard while a locked overlay prevents scrolling. Release the lock and make the action reachable without relying on keyboard detection. DOM focus and resized-viewport automation are INFERRED for physical keyboard behavior; real iOS/Android keyboard, zoom and orientation remain NOT RUN until device observation. Record target versions and alternatives using [capabilities](browser-capabilities.md).

Pass when validation preserves entered values, the error and submit are reachable, closing the overlay restores focus to its trigger, and scroll remains available. Fail if focus is lost, a control is obscured or the user cannot recover and submit. An executed DOM focus assertion may PASS for that narrow assertion; it does not establish physical keyboard behavior.

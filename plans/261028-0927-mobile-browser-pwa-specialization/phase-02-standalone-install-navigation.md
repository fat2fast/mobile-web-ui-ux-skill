# Phase 02 — Installed PWA, installation and navigation

**Status:** completed (synthetic scope; device checks NOT RUN) · **Effort:** 6h · **Tasks:** 05–08 · **Maps:** P05-04/05/07 · **Depends:** Phase 01.


**Historical PR snapshot a7b3176 (2026-10-28):** Partial: guidance and scenario exist; tab Back/reload and origin/server-denial checks run, but manifest icon and bad scope, Forward/edit/focus restoration, emulated standalone and install/permission negative cases are missing. See the [task status](plan.md#implementation-status--pr-15-2026-10-28).

## Files to create

- `references/pwa/manifest-standalone.md` — identity, icon, origin, `id`/`start_url`/`scope`, worker registration, tab vs installed.
- `references/pwa/navigation-history.md` — Back/Forward/deep links/reload/focus/scroll, auth recovery and notification entry route.
- `references/pwa/install-prompts.md` — capability-gated, non-blocking install UX/alternatives, iOS instruction and in-app-browser fallback.
- `evals/scenarios/pwa-install-navigation.md` — small fictional task journey and counterexamples.

## Work items and verification

**05 (1.5h) Manifest + scope audit:** Compare target app and SERP example; verify start_url within manifest and worker scope, same-origin URLs, reachable icons and identity. **DoD:** wrong scopes and out-of-scope routes have explicit failure checks, not just a JSON lint.

**06 (1.5h) Tab vs standalone history:** Task overview → detail/edit → Back/Forward → deep-link reload; preserve role guards and scroll/focus. **DoD:** both modes have task-specific acceptance and unavailable modes are `NOT RUN` rather than claimed PASS.

**07 (1.5h) Conditional install UX:** `beforeinstallprompt` feature detect (non-universal), gesture to prompt; applicable iOS Home Screen guide; in-app-browser/unsupported fallback. Dismiss without blocking tasks or copying SERP's 7-day/3-dismiss policy. **DoD:** no unsolicited system prompt, false install claim or install banner on a non-PWA project.

**08 (1.5h) Frozen scenario:** Write expected/negative cases: absent manifest, wrong scope, external redirect, lost Back, stale permission, action hidden behind install banner; link each to an observation and preservation invariant. **DoD:** plan is executable in Phase 04 without new app business logic.

## Risks

Do not copy SERP route `/portal/` or Laravel implementation. Manifest values are hints, not OS guarantees. Auth and server-side access remain authoritative even when launched standalone.

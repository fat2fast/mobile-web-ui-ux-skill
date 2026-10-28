# Phase 03 — Offline, service worker updates and push permissions

**Status:** in progress · **Effort:** 8h · **Tasks:** 09–12 · **Maps:** P05-06/07 · **Depends:** Phases 01–02.


**Historical PR snapshot a7b3176 (2026-10-28):** Partial: guidance and some A/B, cache, offline POST and update tests exist; PUT, full permission lifecycle and several planned negative probes remain. Physical push delivery is NOT RUN. See the [task status](plan.md#implementation-status--pr-15-2026-10-28).

## Files to create

- `references/pwa/offline-cache-security.md` — data classification and cache policies.
- `references/pwa/sw-updates-recovery.md` — waiting/update/version, form drafts, rollback and reconnect.
- `references/pwa/push-permissions.md` — push value, consent, registration, revocation and notification deep-link authorization.
- `evals/scenarios/pwa-offline-push.md` — executable positive/negative acceptance contract.

## Work items and verification

**09 (2h) Cache boundary:** Treat private HTML/JSON/API, session, CSRF, tenant data and non-GET writes as network-only by default; allowlist approved public hashed assets and a data-free offline fallback only if product needs it. Document logout/account-switch and cache purge/version rules. **DoD:** failed connection cannot surface user A's private data to B, and no silent offline mutation success.

**10 (2h) Offline/update UX:** Online→offline→retry→online; stale data warning; SW waiting/activation, old asset cleanup and unsaved form. Do not auto-reload/`skipWaiting` on users with active work. **DoD:** deterministic state descriptions, recoverable error and no data-loss instruction.

**11 (2h) Permission/push:** Evaluate need for push vs in-app/email; request permission only via direct user action; distinguish permission/subscription/delivery. iOS Home Screen prerequisites are separate. Require same-origin notification target and fresh server-side authorization; support denied/revoked/unsubscribed/logout. **DoD:** no silent re-enrollment or untrusted open redirect; no private payload by default.

**12 (2h) Threat/counterexamples:** Create negative probes for private cache leak, origin/scope escape, cross-tenant click URL, stale HTML/CSRF, involuntary permission and worker that hijacks non-GET. Each probe must be intentionally detected then restored. **DoD:** runnable test plan with precise oracle and cleanup.

## Risk and non-goals

SERP's network-only navigation is a valuable case, not universal mandated policy. No VAPID server, background sync/offline queue, API changes or production push subscription implementation. Preserve existing business data, access, routes and browser/desktop operation.

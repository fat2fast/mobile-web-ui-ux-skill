# Offline, update and push scenario

Fictional users A and B share one browser context. Preserve authentication, mutations and unsaved drafts; no real account, push service or credential is needed. The fixture's actual controlled worker and cache are the observation surface, not a source-text check alone.

| Probe | Oracle and cleanup |
| --- | --- |
| Offline and retry | Controlled tab gets a public data-free fallback offline; reconnect and retry reach the network. Private HTML and JSON never appear in any cache key or body. |
| Logout and switch | A → logout → B in the same context; offline never exposes A's marker to B. |
| Mutations | Offline POST/PUT fail visibly and are not queued or replayed after reconnect. |
| Update and draft | Changed worker waits with existing draft intact and no automatic reload; explicit activation cleans only owned old caches, leaving unrelated sentinel cache. |
| Permission and click | Mock unsupported/denied/revoked state without spontaneous request; reject external URLs and have server deny same-origin cross-tenant detail. Mocking is not delivery evidence. |
| Negative private cache | Deliberately cache a private marker, use the same cache-wide oracle to detect that specific leak, remove it in `finally`, rerun healthy oracle. |
| Negative navigation | Inject unsafe external and forbidden same-origin targets; the same target/access checks detect the intended violations; restore and rerun. |
| Other threats | Inject stale HTML/CSRF, private or redirected response at a public URL, involuntary permission and intercepted non-GET; observe the specific invariant failing, then restore and rerun. |

Real OS permission, push subscription/delivery and device offline behavior are NOT RUN without separate execution. Do not convert simulations into device PASS.

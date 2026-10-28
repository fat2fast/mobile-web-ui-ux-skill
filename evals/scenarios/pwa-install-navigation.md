# PWA install and navigation scenario

Fictional actor: an authorized user opens an overview, edits a detail and returns to the overview. Preserve routes, entered values, focus and server-side access rules in tab and installed contexts. Record actual browser/version and mode; emulated standalone is a simulation, physical install NOT RUN unless observed.

| Case | Observation and oracle |
| --- | --- |
| Valid manifest | Resolve served `id`, `start_url`, `scope` and icon URLs; launch is same-origin and inside manifest scope, intended worker control is independently confirmed, icons load. |
| Missing manifest / wrong scope | Missing manifest leaves the ordinary task usable; launch outside declared scope or intended worker control is reported as failure, not called an installed pass. |
| History and deep link | Overview → detail/edit → Back/Forward and direct reload preserve the intended authorized route and recover focus/scroll. |
| External redirect / forbidden detail | External or unsafe notification target is rejected; same-origin unauthorized detail is denied by server, not accepted on origin alone. |
| Install unavailable or dismissed | No unsolicited prompt; dismissing the offer keeps primary action visible and the task completable. |
| Stale permission | A previously allowed notification state is rechecked; denial/revocation is not displayed as active subscription or delivery. |

Actual installation and platform permission UI are separate manual checks. No push server or production identity is required for the synthetic journey.

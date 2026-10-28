# SERP PWA research — transferable decisions, not copied implementation

**Inspected:** `fat2fast/serp/main@ad6d6e3736b74a277ffd411fb624eab3070b7a3a` and `mobile-web-ui-ux-skill/main@344d9d464a8eb4d769ea1f061d3e579d230f8ab7` (2026-10-28). Source review ≠ tests executed in SERP.

| SERP source | Observed design | Guidance to extract | Caveat |
| --- | --- | --- | --- |
| [PortalManifestController.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/app/Http/Controllers/Pwa/PortalManifestController.php) | Manifest `id=/portal`, `start_url=/portal/launch`, `scope=/portal/`, display standalone, maskable icon | Validate cross-field URL, origin, worker scope and launch | SERP path/brand are application-specific |
| [portal-sw.js](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/public/portal-sw.js) | Static allowlist cache; navigation network-only with data-free offline; non-GET/Livewire bypass; push notification click same-origin | Classify requests by data sensitivity; test actual worker behavior, not only source text | SERP `skipWaiting`/`clients.claim` not universal for apps with unsaved forms |
| [PortalOfflineController.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/app/Http/Controllers/Pwa/PortalOfflineController.php) | Public bilingual offline page; no user data; HTTP no-store | Graceful offline/retry without cached private signed-in page | Conditional on target app product/security |
| [PortalLaunchController.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/app/Http/Controllers/Pwa/PortalLaunchController.php) | Data-free branded launch in SW scope | Handle cold launch and route restoration | A separate launch screen is optional |
| [pwa-register.blade.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/resources/views/filament/hooks/pwa-register.blade.php) | Portal-only SW registration, beforeinstallprompt listener | Register in intended scope, feature-detect | Don't auto-register for non-PWA apps |
| [mobile-prompts.blade.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/resources/views/filament/livewire/pwa/mobile-prompts.blade.php) | Install/push prompt ordering, user dismissal, iOS guidance | Non-blocking, purposeful prompt, no nagging | Exact 7 days/3 refusals are SERP policies, not generic standards |
| [pwa-push-client.blade.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/resources/views/filament/hooks/pwa-push-client.blade.php) | Permission/PushManager/subscription state | Separate permission, subscription, delivery and access; user gesture | Skill does not implement web-push backend |
| [ServiceWorkerSourceTest.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/tests/Unit/Pwa/ServiceWorkerSourceTest.php) + [PortalManifestTest.php](https://github.com/fat2fast/serp/blob/ad6d6e3736b74a277ffd411fb624eab3070b7a3a/tests/Feature/Pwa/PortalManifestTest.php) | Static SW policy checks + manifest HTTP tests | Combine source contract with runnable browser and privacy negative probes | Not proof of complete Safari/headless/physical-device UX |

## External standards verified for plan design (as of 2026-10-28)

- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) — secure context (HTTPS/localhost) and lifecycle.
- [MDN: manifest start_url](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/start_url), [scope](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope) — URL/registration relationship and out-of-scope behavior.
- [MDN: beforeinstallprompt](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event) — limited availability, never assume event fires.
- [Apple: Web Push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers), [WebKit iOS Home Screen](https://webkit.org/blog/13878/) — installed iOS web-app prerequisites and direct gesture.
- [MDN: CacheStorage patterns](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching), [web.dev PWA updates](https://web.dev/learn/pwa/update) — versioning, cache cleanup and waiting worker.
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), [VirtualKeyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API), [viewport meta](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport) — distinguish layout viewport, visual viewport, limited keyboard API and browser chrome.

## Target already has

[Existing P05 task spec](../../docs/phases/p05-mobile-browser-pwa-specialization.md), current [verification guide](../../references/verification-criteria.md), current [Playwright config](../../tests/task-ux/playwright.config.cjs), existing [CI required gate](../../.github/workflows/validate.yml). Reuse: no PWA playbook directory and no PWA fixture were found in the reviewed tree.

**Source limitations:** SERP includes some planned/manual UAT rows; do not infer they are completed. Source code is not runtime evidence; capability evidence is not Safari emulation or hardware execution.

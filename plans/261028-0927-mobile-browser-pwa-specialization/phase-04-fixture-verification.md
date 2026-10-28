# Phase 04 — Runnable fixture, CI evidence and skill integration

**Status:** pending · **Effort:** 8h · **Tasks:** 13–17 · **Maps:** P05-08 and P04/06 evidence · **Depends:** Phases 01–03.

## Files to create/modify

- **CREATE** `evals/fixtures/pwa-browser/`: minimal same-origin localhost Node/JS PWA fixture, public static/offline/launch routes and synthetic user A/B private routes.
- **CREATE** `tests/task-ux/pwa-browser.spec.cjs`, `evals/results/pwa-browser-evidence.md`, `evals/tests/pwa-device-manual.md`.
- **MODIFY** `tests/task-ux/playwright.config.cjs`: one extra webServer, unique port. Keep existing browser project and test suite.
- **MODIFY** `SKILL.md`, `references/verification-criteria.md`, `references/project-discovery.md`, `docs/phases/p05-mobile-browser-pwa-specialization.md`, `docs/roadmap.md`, user docs as warranted.
- **ONLY IF REQUIRED** adjust `.github/workflows/validate.yml` and `scripts/install-skill.py`; the current installer recurses `references/**`. Version runtime changes coherently and verify install/update/rollback.

## Work items and executable gates

**13 (2h) Synthetic fixture:** Host manifest/registered SW on localhost, scoped routing, public offline fallback, hashed/static cache, synthetic auth user A/B and deterministic update version. No real push/credentials; fresh browser context, isolated cache prefix. **DoD:** fixture runs without external service.

**14 (2h) Playwright behavior:** Verify tab vs emulated standalone, Back/deep link/scope, offline+retry, only-public cache entries, non-GET bypass, A→logout→B isolation, version update with unsaved draft and cleanup, denied/unsupported permission fallback and safe notification target via mocks. **DoD:** explicit DOM + CacheStorage/fetch assertions; no hardware claim.

**15 (1.5h) Negative controls:** Intentionally inject private-cache and unsafe navigation conditions, assert test failure and restore state. Bind evidence to exact run/source/browser/artifact, not stale snapshot. **DoD:** negative probe rejects intended defect and normal test remains clean.

**16 (1.5h) Runtime handoff:** Add conditional `references/pwa/*` paths to `SKILL.md` only on relevant project evidence; check local link closure and installer payload. Update P05 statuses individually according to actual executions, maintain historic source claims; bump skill version only with runtime content. **DoD:** standard responsive flows unchanged, installer tests pass.

**17 (1h) CI and manual UAT contract:** Run `python3 scripts/validate_skill.py`, Python unit suite, `npm --prefix tests/task-ux test` (after fixtures installed), existing regression/visual and `required-ci` on clean PR head. Add browser-device manual matrix for iOS Safari tab/Home Screen and Android Chrome tab/installed, orientation, keyboard, update, offline/push. **All physical-device results remain NOT RUN** until separately executed. **DoD:** one-run evidence provenance and no duplicate full CI triggers.

## Test matrix

| Test | Automated observation | Exclusions |
| --- | --- | --- |
| Manifest/registration/scope | served origin + start URL within scope | OS install affordance |
| Offline public fallback and retry | Chromium SW + network toggle | real airplane mode |
| Logout/user switch | no cached private page, JSON or auth data | production auth |
| POST/PUT and CSRF | no worker cache or offline queue | real server writes |
| Update | old cache cleanup, avoid forced reload on drafts | OS update timing |
| Notification click/permission | mocked denial/gesture/same-origin target | actual push delivery |
| Responsive regression | 320/390/1280 CSS px, keyboard focus, accessible controls | real OS keyboard/zoom |

## Final exit gate

Current Playwright suite, existing Python/installer checks and PR `required-ci` PASS on the same clean commit; new PWA negative probes execute and detect intended faults; artifacts are traceable. No private cache by default, no automatic installation/push, no claim of tested Safari/Android devices. Physical-device smoke remains a documented future operator task, not a fake CI PASS.

**Handoff:** after Phase 04, independent review of changes, then merge only with user authorization.

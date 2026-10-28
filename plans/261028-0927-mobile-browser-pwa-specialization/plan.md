---
title: "P05 — Mobile Browser & PWA Specialization"
description: "Conditional mobile browser and PWA decision playbooks with safe synthetic regression evidence; informed by SERP."
status: pending
priority: P1
effort: 28h
branch: feat/261028-0927-mobile-browser-pwa-specialization
tags: [feature, frontend, experimental]
blockedBy: []
blocks: []
created: 2026-10-28
---

# P05 — Mobile Browser & PWA Specialization

**Planning only** · `pp-plan` hard mode · **Source:** `mobile-web-ui-ux-skill/main@344d9d464a8eb4d769ea1f061d3e579d230f8ab7` · **Reference:** `serp/main@ad6d6e3736b74a277ffd411fb624eab3070b7a3a`. See [source research](research-serp-pwa.md). Current [P05 scope](../../docs/phases/p05-mobile-browser-pwa-specialization.md) was last status-annotated 2026-10-17.

## Objective

Extend the existing **task-first agent skill**, not build a universal PWA framework. Agents first inspect target browser/role/task, manifest + service worker + auth scope, then recommend a conditional UX decision with options, preserved business contracts, browser fallback, verification and uncertainty. A responsive website does NOT automatically become a PWA.

## Current vs target

- Existing: `SKILL.md` PWA mention; `references/decisions/forms.md` and `references/verification-criteria.md` partly cover keyboard/viewport; Playwright Chromium, installer and run-bound CI evidence exist.
- Missing: dedicated `references/pwa/` decision playbooks, browser/capability matrix, tab-vs-standalone flow, private-cache/push safeguards and runnable PWA scenario.
- Source reference: SERP uses a scoped `/portal/` worker, manifest launch within scope, network-only navigations, data-free offline fallback, opt-in install/push guidance and auth-checked notification targets. **Learn the decisions, do not copy Laravel/Filament code.**

## Map every existing P05 work item

| Original task | Planned phase | Outcome |
| --- | --- | --- |
| P05-01 browser compatibility | [01](phase-01-browser-capabilities.md) | Support/capability/fallback matrix |
| P05-02 viewport & safe area | [01](phase-01-browser-capabilities.md) | Browser chrome, safe-area and sticky CTA guidance |
| P05-03 keyboard & focus | [01](phase-01-browser-capabilities.md) | Visual-viewport/form recovery guidance |
| P05-04 installed standalone | [02](phase-02-standalone-install-navigation.md) | Manifest/launch/scope audit |
| P05-05 navigation/history | [02](phase-02-standalone-install-navigation.md) | Tab/installed Back, deep link and access restoration |
| P05-06 offline/update | [03](phase-03-offline-updates-push.md) | Private-cache denial, offline fallback, worker update |
| P05-07 install & permission UX | [02](phase-02-standalone-install-navigation.md), [03](phase-03-offline-updates-push.md) | Conditional install and push consent |
| P05-08 device smoke/limitations | [04](phase-04-fixture-verification.md) | Manual UAT contract; device execution remains NOT RUN |

## Four implementation phases

| Phase | Effort | Deliverables | Exit gate |
| --- | --- | --- | --- |
| [01. Browser capabilities](phase-01-browser-capabilities.md) | 6h; 4 tasks | Dated matrix, viewport/safe-area, keyboard/focus guidance | No unsupported platform claims |
| [02. Standalone/install/navigation](phase-02-standalone-install-navigation.md) | 6h; 4 tasks | Manifest/route/install decision playbooks | Feature-gated prompts and route preservation |
| [03. Offline/updates/push](phase-03-offline-updates-push.md) | 8h; 4 tasks | Cache classification, update/recovery, push/privacy guide | No private-content caching or silent permission |
| [04. Runnable verification and integration](phase-04-fixture-verification.md) | 8h; 5 tasks | Synthetic localhost PWA, Playwright tests, updated runtime docs | Same-commit PR `required-ci` PASS and honest limitations |

**Dependencies:** 01 → 02 → 03 → 04. Implement as bounded PRs; don't duplicate existing push/PR full-CI jobs. All 17 tasks start `pending`.

## Scope boundaries

- Skill may **guide** existing PWA improvement, but cannot silently register a worker, add offline writes, enable push, modify a user project or start server/push deployment.
- No edits to `serp` or `TabDo`; no Laravel/Livewire code copied; no VAPID keys/production subscriptions.
- Default: do not cache authenticated HTML, API data, tokens, CSRF, private responses or mutations. A public/data-free offline page and hashed static assets may be considered with a target-specific reason.
- Keep existing P02 decision routes, desktop regression, installer/update/rollback and cross-project evidence contract.
- Real iOS/Android hardware test is **not performed in this plan**; provide manual replay instructions, mark device-only items `NOT RUN` (never translate emulation into device PASS).
- No mandatory app-install prompt, SW `skipWaiting`/reload or Push API requirement; only feature-detected, task-justified behavior.

## Acceptance contract for future implementation

1. `SKILL.md` progressively loads `references/pwa/*` only when the target app actually has browser/PWA-specific intent or code.
2. Each decision includes actor/task, condition, alternative/rejected option, preservation, capability source/date, fallback, security and test criteria.
3. Synthetic fixture runs controlled Chromium SW/CacheStorage flows, offline → reconnect, private response deny, logout/user switch, update/version handling, deep linking and intentionally failing negative probe.
4. Install/push checks differentiate beforeinstallprompt availability, standalone, permission request, subscription and notification delivery. No OS permission/delivery PASS in headless.
5. Existing Python, installer, Playwright, fixture tests pass; new test artifacts bind to exact source/run; `required-ci` remains mandatory.
6. P05 status docs update only with evidence. No Tier B advantage, iOS Safari compatibility or full WCAG claim without matching execution.

## Architecture

```text
Project discovery → browser/PWA capability gate
    ├─ regular responsive site → viewport/keyboard guidance only
    └─ existing/requested PWA
          → manifest/standalone/history decision
          → offline/SW/update/auth decision
          → optional install/push consent decision
          → scoped authorized code edits (future pp-cook only)
          → independent checks + PASS/FAIL/INFERRED/NOT RUN
          → evidence report, no automatic public upload
```

## Risk/mitigation

| Risk | Control |
| --- | --- |
| Private user/tenant content cached | Network-only by default, cache allowlist, user-A→B negative regression |
| Unsupported Safari install/push API | Dated sources, feature-detect, fallback, NOT RUN hardware |
| SW update loses unsaved work | Avoid automatic `skipWaiting`/reload; explicit update/waiting UX |
| Bad permission or notification click | User gesture; denial/revocation; origin + server-side access check |
| Old SW survives deployment | Explicit scope/version/cleanup/rollback plan; no broad origin cache delete |
| CI cost/duplication | One minimal fixture, reuse current Playwright and PR `required-ci` aggregator |

## Plan review and validation

- Source checked on 2026-10-28: target P05 status, `SKILL.md`, existing Playwright/CI and SERP manifest, worker, prompts, tests.
- Security adversarial review topics: authenticated cache leakage, push redirect/IDOR, unapproved permission, stale worker/unsaved edits and false browser-support claims. Each has an acceptance guard in phases.
- Full mapping: P05-01…P05-08 covered, no device test misrepresented as executed.
- **Open implementation choice:** Optional future physical-device UAT requires separate explicit environment/approval; no blocker for docs and synthetic CI work.
- This plan itself does not execute tests, install a PWA or implement runtime features.

**Handoff:** `@pp-cook plans/261028-0927-mobile-browser-pwa-specialization/plan.md` (separate authorized implementation).

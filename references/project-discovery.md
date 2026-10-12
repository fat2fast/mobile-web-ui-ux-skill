# Project Discovery

Use when starting work on an existing web project.

## Inspect only what matters

- Framework and app entry points: `package.json`, routes, SSR/client boundaries, styling.
- Layout and design tokens: breakpoints, typography, spacing, components, interaction conventions.
- Page(s) concerned and their shared components.
- Relevant tests and whether a runnable browser preview exists.
- If PWA features exist: manifest, service worker registration, display mode, offline fallback (do not rewrite these automatically).

## Infer user tasks

Identify up to three primary mobile tasks from UI structure, copy, route names and user request. Treat this as an **inference** without analytics or user research. State assumptions when material.

## Context capture (internal notes)

```text
Product category:
Affected route/component:
Top mobile task(s):
Target device/browser context:
Existing mobile behavior:
Desktop behavior to preserve:
Design system / stack:
Evidence available (code, browser, recordings):
Known constraints:
```

Do not use private analytics, credentials or internal data outside the permitted project context.

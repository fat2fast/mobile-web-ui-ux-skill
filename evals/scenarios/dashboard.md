# Scenario A — Dense Order Dashboard

**Status:** Specification only; runnable fixture not yet included.

## Product context

A responsive admin web app has an orders table with 8 columns, a sidebar, filter controls and per-record actions.

## Primary mobile task

Find an order, determine its status, and open its permitted action/details in a 390px-wide mobile browser.

## Baseline problem to reproduce

The table creates difficult horizontal navigation, record identity gets lost while scrolling, and actions are hard to discover.

## Expected agent behavior

- Identify mandatory record fields and high-frequency actions.
- Consider a mobile list/cards or focused horizontally scrollable table based on task context.
- Keep filters, record details, permissions and desktop table behavior.
- Validate both record view and at least one action path.

## Failure examples

Hiding status or total; removing export/filter; inventing a new API; converting to cards while losing bulk selection.

## Test evidence to capture later

Mobile screenshot, task steps, keyboard interaction, no undesired overflow, desktop regression screenshot.

# Constraints and Non-Goals

## Hard constraints

- Preserve desktop behavior and appearance unless change is explicitly requested and justified.
- Do not change server business logic, permissions, route semantics or domain data in pursuit of UI simplicity.
- Never hide essential data/features solely to fit a phone viewport; provide a route to reveal them.
- Prefer existing tokens, component library, styles and dependencies.
- Provide accessible alternatives to gestures and visual-only affordances.
- Preserve browser Back and deep linking when routes/history already support them.
- Avoid collecting/storing private data or transmitting screenshots without authorization.
- Work within agent/repo permissions; do not push/commit or add dependencies by default.
- Report testing limits truthfully.

## Non-goals

- Creating an entirely new visual identity or choosing fashionable gradients.
- Copying native app navigation without task-based justification.
- Replacing an entire stack or creating a new design system.
- Promising scores like "UX +50%" without a study.
- Running install or e2e flows if dependencies/environment are not approved/available.

## Change impact

Classify each planned edit as: local presentation, shared component, navigation behavior, route/data/business behavior, or platform/PWA behavior. Escalate the last two categories before broad edits where risk is material. Prefer reversible changes.

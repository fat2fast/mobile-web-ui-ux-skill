# MVP Scope — v0.1

## Included

- Agent Skills-compatible `SKILL.md` and modular references.
- Modes: Improve (default), Build Mobile View in an existing project, Audit Only, Verify Only.
- Project discovery that identifies product tasks, design system and code constraints.
- Initial decision playbooks: navigation, dense data/tables and forms.
- Small, reversible modifications, desktop and functionality preservation guidance.
- Manual verification checklist and audit report template.
- Scenario **specifications** for three representative mobile UX failures.
- Standard-library-only repository validator and CI smoke check.

## Explicitly not included yet

- Automated screenshot capture or comparison runner.
- Prebuilt React/Next.js/Tailwind UI component library.
- Search engine, CSV rule catalog or CLI installer.
- Native iOS/Android design or application building.
- Full PWA installation/offline/service-worker diagnostics.
- Guaranteed compatibility with every browser/framework.
- Claims that scenarios have already been tested in a real project.

## Acceptance criteria

- Metadata and file references pass local validation.
- The skill can guide decisions for at least one navigation, data display and form scenario without a visual redesign.
- Each decision indicates applicability, rejected options and behavior to preserve.
- The workflow demands runnable or manual validation and identifies checks that were not run.
- No task requires a non-designer to pick a UX pattern without a reason.

## Next release

Expand evidence-backed playbooks, add runnable fixtures and tool-driven responsive/interaction verification, then browser/PWA-specific heuristics.

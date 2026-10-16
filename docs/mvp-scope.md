# MVP Scope — v0.1

## Included

- Agent Skills-compatible `SKILL.md` and modular references.
- Modes: Improve (default), Build Mobile View in an existing project, Audit Only, Verify Only.
- Project discovery that identifies product tasks, design system and code constraints.
- Task-based decision guidance, loaded through the [playbook routes in SKILL.md](../SKILL.md).
- Small, reversible modifications, desktop and functionality preservation guidance.
- Manual verification checklist and audit report template.
- Original Dashboard/Navigation/Form scenario contracts under [evals/scenarios](../evals/scenarios/); navigation remains a specification without its own executable journey.
- Additional runnable orders, aligned comparison and contextual request-form journeys governed by [mobile task acceptance](mobile-task-acceptance.md). These do not replace the original navigation scope.
- Standard-library-only repository validation, tooling unit tests, fixture/implementation builds and current-run browser evidence checks in the [CI workflow](../.github/workflows/validate.yml).

## Explicitly not included yet

- Automated, controlled skill A/B comparison runner. Existing comparison tooling supports preparation and recording; it does not establish Tier B isolation by itself. See the [comparison protocol](../evals/comparison-protocol.md).
- Prebuilt React/Next.js/Tailwind UI component library.
- Search engine, CSV rule catalog or CLI installer.
- Native iOS/Android design or application building.
- Full PWA installation/offline/service-worker diagnostics.
- Guaranteed compatibility with every browser/framework.
- Claims of physical-device validation, broad real-project coverage, or skill superiority over a no-skill condition.

## Acceptance criteria

- Metadata and file references pass local validation.
- The skill can guide decisions for at least one navigation, data display and form scenario without a visual redesign.
- Each decision indicates applicability, rejected options and behavior to preserve.
- The workflow demands runnable or manual validation and identifies checks that were not run.
- No task requires a non-designer to pick a UX pattern without a reason.

## Next release

Complete executable coverage for the [original navigation scenario](../evals/scenarios/navigation.md), then focused physical-device keyboard/picker, screen-reader and human task checks. Run a controlled Tier B comparison before claiming an advantage over a no-skill condition. Use the [roadmap](roadmap.md) for release boundaries and [recorded task evidence](../tests/reports/task-ux-evidence.md) for executed checks and limits. Browser/PWA specialization remains later work.

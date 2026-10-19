# Development Roadmap

Use this page to choose the next work; phase files track task-level DoD, evidence and remaining work. Their checklists are manually reconciled with source and executed evidence; Git preserves earlier planning states. Existing task journeys extend the MVP scope without replacing its original Dashboard/Navigation/Form commitment.

## Evidence and open work

| Area | Evidence owner | Remaining boundary |
| --- | --- | --- |
| Product scope and skill foundation | [Product scope](product-scope.md), [MVP scope](mvp-scope.md), [runtime entry point](../SKILL.md), [validator](../scripts/validate_skill.py) | Structural checks do not prove agent activation, mode behavior or installation in a supported agent. |
| Decision guidance | [Runtime playbook routes](../SKILL.md), [decision cases](../evals/decisions/), [Tier A regression record](../tests/reports/regression-261015-tier-a.md) | Targeted regressions do not establish general decision quality or skill superiority. |
| Implemented task journeys | [Task acceptance](mobile-task-acceptance.md), [task browser suite](../tests/task-ux/), [recorded evidence](../tests/reports/task-ux-evidence.md) | Orders, comparison and request form have headless checks; the original navigation scenario still needs dedicated executable coverage. |
| Automated verification | [CI workflow](../.github/workflows/validate.yml), [current-run evidence verifier](../tests/task-ux/verify-evidence.py) | Refer to run-specific evidence for results; checked-in artifacts do not prove the current revision passed. |
| Human and device verification | [Verification criteria](../references/verification-criteria.md), [recorded limits](../tests/reports/task-ux-evidence.md) | Actual picker selection, physical keyboard/touch, screen reader, human discoverability and translation/zoom review remain open. |
| Controlled comparison | [Tier B protocol](../evals/comparison-protocol.md), [evaluation record](../evals/results/decision-evaluation.md) | Tier B remains `NOT RUN`; require matched controls, an access boundary and independent review. |

## External-project reporting (P04/P06)

The [cross-project evidence contract](../references/external-pilot-evidence.md) and [operator runbook](installation/cross-project-feedback.md) provide a portable text-only handoff for future approved pilots. Export/import integrity and privacy heuristics do not prove UX quality or authorize TabDo Gate 3. Review each imported record before any skill-rule change.

## Next work, in order

1. **Reconcile implementation records with CI evidence.** The [request fixture API](../evals/implementations/task-first/request-form/server.js) now hashes received file bytes, the [request regression suite](../tests/task-ux/request-form.spec.cjs) checks actual multipart content, and [redaction tests](../scripts/tests/test_archive_redaction.py) cover Linux/Windows/WSL paths. Confirm these against clean-commit CI without rewriting historical tests or claiming general secret removal.
2. **Reconcile original navigation coverage.** The [navigation suite](../tests/task-ux/navigation.spec.cjs) covers routes, active state, edit/save, Back/deep links, keyboard and local role guards. Match its executed clean-commit CI results to the [original navigation scenario](../evals/scenarios/navigation.md); keep untested human/device limits distinct.
3. **Validate existing journeys with people and devices.** Focus on request-form keyboard/picker/error recovery, screen-reader traversal, zoom/long labels and bulk-action discovery. Record device/browser, task, observation and limits; keep unavailable checks `NOT RUN`.
4. **Measure the skill's contribution.** Run a bounded Tier B trial using the existing protocol, then repeat before generalizing. Fixture correctness and generated-agent performance are separate claims.
5. **Prepare a bounded release.** Verify installation, activation and mode behavior in an explicitly tested agent. Synchronize published capability claims with that evidence.

Browser/PWA specialization and distribution scaling follow the evidence gaps above. Do not add a retrieval engine, component library or extra stack merely to expand the feature list; require a demonstrated use case.

## Release boundaries

- **Foundation:** runtime instructions and structural validation exist. Structural PASS alone does not prove behavioral reliability.
- **Useful alpha:** implemented fixture tasks have recorded automated evidence. This is the supported maturity description.
- **Original MVP completion:** executable Dashboard/Navigation/Form checks with desktop regressions investigated. The original navigation requirement remains open.
- **Broader readiness claims:** require evidence matching the claim. Headless geometry does not prove physical keyboard or screen-reader behavior; fixture improvements do not prove skill superiority. A comparative claim requires Tier B evidence.

## Phase references

[Scope](phases/p00-product-scope-evaluation-design.md) · [Foundation](phases/p01-agent-skill-foundation.md) · [Decisions](phases/p02-mobile-ux-decision-intelligence.md) · [Implementation](phases/p03-mobile-ux-implementation-workflow.md) · [Verification](phases/p04-verification-regression-skill-evaluation.md) · [Browser/PWA](phases/p05-mobile-browser-pwa-specialization.md) · [Distribution](phases/p06-distribution-quality-scaling.md)

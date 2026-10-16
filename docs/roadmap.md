# Development Roadmap

Phases are sequential milestones, not fixed-duration sprints.

| Phase | Goal | Completion evidence |
| --- | --- | --- |
| P00 Product scope & eval plan | Define user, constraints and three test scenarios | Product/MVP scope + scenario specs |
| P01 Skill foundation | Agent Skills metadata, workflow, lightweight validator | Local validation passes |
| P02 Decision intelligence | Eight task-based playbooks and decision comparison | Playbooks/cases exist; protocol-compliant comparison remains `NOT RUN` |
| P03 Implementation guidance | Apply patterns with minimal codebase changes | Dashboard and form fixture retrofits recorded |
| P04 Verification & evaluation | Before/after task tests, mobile widths, desktop regression | Three task-first scenarios have local headless browser checks; current-commit CI and physical device checks remain |
| P05 Browser/PWA specialization | Keyboard, visual viewport, standalone, offline/update | Browser-specific test matrix |
| P06 Distribution & scaling | Rule search if needed, more stacks, packaging/CLI | Publishable, tested distribution |

## Proposed initial issues

- [ ] P00-01 Agree on core persona and non-designer prompt
- [ ] P00-02 Freeze MVP boundaries and preserve rules
- [ ] P00-03 Turn 3 scenario specs into runnable fixtures
- [ ] P01-01 Review `SKILL.md` triggers with real user prompts
- [ ] P01-02 Verify links, frontmatter, directory structure
- [ ] P02-01 Test navigation playbook decisions on multiple web app types
- [ ] P02-02 Test data-display playbook against data integrity/accessibility
- [ ] P02-03 Test forms playbook with keyboard and validation states
- [x] P03-01 Execute first mobile-UX improvement on a sample app (local dashboard and form fixtures)
- [x] P04-01 Add browser task checks and recorded before/after evidence for the two fixtures

## Release gates

- **Scaffold ready:** P00/P01 docs and validator exist (current starter).
- **Useful alpha:** P02/P03 validated on ≥1 actual fixture (met for the local fixtures).
- **MVP 0.1 release:** P04 checks on all three scenarios, desktop regressions investigated.

The order and form fixtures have [before/after browser task evidence](../tests/reports/retrofit-261015-browser-evidence.md) at 320, 375, 390, 430 and 1280 CSS px. Targeted with-skill decision regressions are [recorded separately](../tests/reports/regression-261015-tier-a.md). Controlled Tier B comparison remains [recorded as `NOT RUN`](../evals/results/decision-evaluation.md). The task-first orders, comparison and request-form implementations now have local headless task checks; CI on the changed commit and physical-device behavior are still unverified. Fixture results do not establish general skill superiority.

# Development Roadmap

Phases are sequential milestones, not fixed-duration sprints.

| Phase | Goal | Completion evidence |
| --- | --- | --- |
| P00 Product scope & eval plan | Define user, constraints and three test scenarios | Product/MVP scope + scenario specs |
| P01 Skill foundation | Agent Skills metadata, workflow, lightweight validator | Local validation passes |
| P02 Decision intelligence | Eight task-based playbooks and decision comparison | Playbooks/cases exist; protocol-compliant comparison remains `NOT RUN` |
| P03 Implementation guidance | Apply patterns with minimal codebase changes | One reproducible fixture modified successfully |
| P04 Verification & evaluation | Before/after task tests, mobile widths, desktop regression | Recorded results, not hypothetical grades |
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
- [ ] P03-01 Execute first mobile-UX improvement on a sample app
- [ ] P04-01 Add Playwright tests & recorded before/after evidence

## Release gates

- **Scaffold ready:** P00/P01 docs and validator exist (current starter).
- **Useful alpha:** P02/P03 validated on ≥1 actual fixture.
- **MVP 0.1 release:** P04 checks on all three scenarios, desktop regressions investigated.

The order and form baselines now run; they remain intentionally awkward. Decision comparison is [recorded as `NOT RUN` under the strict protocol](../evals/results/decision-evaluation.md) despite one exploratory reviewed pair. Do not label this repository a tested UX MVP solely because structural validation or baseline tasks pass.

# P02 decision evaluation

Record format: [evidence template](../evidence-template.md). Protocol frozen in [comparison protocol](../comparison-protocol.md); input-only [prompts](../comparison-prompts.md). Review date: 2026-10-14.

## Exploratory pair: DATA-01 / prompt 4

- **Baseline:** repository commit `ad811cb030111ef0595b5c01176093c47db6afe5`; uncommitted fixture snapshot in each temporary workspace had manifest SHA-256 `e5ffd2a8cd0e678f27ff5f925a8382263de15aed72337c87feabdc3890807236`, computed with `sha256sum package.json vite.config.js index.html src/main.jsx src/style.css | sha256sum` (no lockfile copied). `src/main.jsx` was `6e8ab2efc4103a2e78cc74977aac905f573fb8f1411cf2ad9bcec8fc15e4b54a`. The live fixture later changed to fix deep-link Back; its full manifest is in [baseline evidence](./order-dashboard-baseline.md). The older copy only exists in temporary workspaces, another reproducibility limit for this exploratory result.
- **Model:** both generation agents explicitly pinned to `gpt-6.1-sol`, reasoning effort `low`; host did not expose a finer patch/build version. Independent reviewer also pinned to `gpt-6.1-sol` low.
- **Prompt:** exact prompt 4 in [frozen input file](../comparison-prompts.md). Each generator received the same 450-word response cap. No explicit runtime token or wall-clock cap was available; neither condition was given one. Full wrappers and precise generation timestamps were not saved at generation time.
- **Tools and runtime:** both had local read-only WSL shell access and no web; no code modification or browser tests. Windows host, WSL Ubuntu-24.04. Runtime tool menus may expose more capabilities; prompts prohibited their use. Temperature and seed were unavailable.
- **Isolation:** `fork_turns=none` for each independent agent. No-skill working copy `/tmp/mobile-ux-compare/no-skill` contained only dashboard `index.html`, `package.json`, `vite.config.js`, `src/main.jsx`, `src/style.css`; no `SKILL.md`/references/case files. Skill copy `/tmp/mobile-ux-compare/with-skill` contained identical fixture files plus `SKILL.md`, `references/` and `evals/evaluation-criteria.md`; reviewer-only case files and rubric were absent. The skill generator later reported it did not read evaluation criteria. Both reported reading only their assigned filesystem files and no prior outputs. **Host-level AGENTS.md instructions and installed-skill catalog metadata were nevertheless exposed to both despite `fork_turns=none`.** No-skill ran first. These temporary workspace copies are not committed; a future compliant run must freeze a new fixture snapshot and manifest.
- **Raw pinned outputs:** [without skill](./decision-data-01-no-skill.txt), [with skill](./decision-data-01-with-skill.txt). An earlier exploratory unpinned pair is preserved [without skill](./decision-data-01-pilot-no-skill.txt) and [with skill](./decision-data-01-pilot-with-skill.txt); it is excluded from the controlled result because exact model was not recorded.
- **Reviewer:** independent `comparison_reviewer` agent, reading both raw files after generation; no edits. Reviewer assessed task fit `PASS/PASS`, viable rejected alternative `FAIL/PASS`, proposed preservation `PASS/PASS`, test honesty `PASS/PASS` (order: no-skill/skill). Both chose a compact list. The skill output explicitly compared a horizontal table for column comparison; no-skill did not compare a viable rejected pattern. Both correctly said implementation/browser checks were not run. The no-skill output also suggested compacting navigation, outside the narrow data-display prompt; no visible contract loss resulted.
- **Comparison status: NOT RUN under the frozen protocol.** A pair was generated and independently reviewed, but host-level ambient instructions prevent proving the strict no-skill isolation condition, and exact wrappers/timestamps were not captured. The reviewer initially noted the difference in alternative reasoning, then rejected protocol compliance. No generated UI was implemented; preservation in implementation and UX improvement are `NOT RUN`. This exploratory pair cannot establish skill superiority.

## Coverage and status

| Domain | Case | Input | Pair status | Evidence / replay |
| --- | --- | --- | --- | --- |
| Navigation | NAV-01 | Prompt 1 | NOT RUN | [case](../decisions/navigation-cases.md); run both conditions from matching fixture copy |
| Navigation | NAV-02 | Prompt 2 | NOT RUN | [case](../decisions/navigation-cases.md); ecommerce fixture absent |
| Navigation | NAV-03 | Prompt 3 | NOT RUN | [case](../decisions/navigation-cases.md); triage fixture absent |
| Data display | DATA-01 | Prompt 4 | NOT RUN (protocol); exploratory pair reviewed | Raw outputs and reviewer above |
| Data display | DATA-02 | Prompt 5 | NOT RUN | [case](../decisions/data-display-cases.md); comparison fixture absent |
| Data display | DATA-03 | Prompt 6 | NOT RUN | [case](../decisions/data-display-cases.md); bulk scenario fixture absent |
| Forms | FORM-01 | Prompt 7 | NOT RUN | [case](../decisions/forms-cases.md); contact fixture absent |
| Forms | FORM-02 | Prompt 8 | NOT RUN | [case](../decisions/forms-cases.md); checkout fixture absent |
| Forms | FORM-03 | Prompt 9 | NOT RUN | [case](../decisions/forms-cases.md); runnable form exists, pair not generated |
| Accessibility | A11Y-01 | Prompt 10 | NOT RUN | [case](../decisions/accessibility-cases.md); spacing measurement absent |
| Accessibility | A11Y-02 | Prompt 11 | NOT RUN | [case](../decisions/accessibility-cases.md); comparison fixture absent |
| Accessibility | A11Y-03 | Prompt 12 | NOT RUN | [case](../decisions/accessibility-cases.md); overlay fixture absent |

P1 action/content/overlay cases have `INFERRED` text reviews in their case records; rendered behavior is `NOT RUN`. No clear false choice occurred in the paired DATA-01 result, so no playbook rule was revised. If a future false choice appears, preserve both original raw responses and case, link the rule revision to the case, and replay that case plus a nearby counterexample.

## Handoff to P03

Use the [order baseline](./order-dashboard-baseline.md), [form baseline](./form-baseline.md), decision cases and checklist as starting evidence. The fixtures remain intentionally awkward; P03 owns improved implementation and before/after checks. Re-run phone keyboard, screen reader, zoom/reflow and multiple browser/device checks before any UX readiness claim. P00-03 still lacks a third runnable navigation scenario. No commit/PR was made; fixture version uses the hashes above.

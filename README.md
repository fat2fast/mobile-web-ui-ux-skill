# Mobile Web UI/UX Skill

**Improve mobile web UI/UX — not just responsive layouts.**

An AI skill that helps vibe coders, developers, and product builders turn existing responsive websites into intuitive, touch-friendly mobile experiences **without requiring UI/UX design expertise**.

[Tiếng Việt](README.vi.md) · [Skill instructions](SKILL.md) · [MVP scope](docs/mvp-scope.md) · [Roadmap](docs/roadmap.md)

## Why this skill exists

A website can be responsive and still be frustrating on a phone. A desktop sidebar becomes a hard-to-navigate menu, tables are difficult to scan, forms are awkward with the on-screen keyboard, and important actions are easy to miss.

This skill focuses on **how people actually use a website on mobile**, not simply whether its layout fits a small screen. The AI agent should understand the product, choose appropriate mobile UX patterns, and improve the experience without asking the user to make specialist design decisions.

## What it helps you do

- **Understand the existing product:** identify the key mobile tasks, screens, components, and constraints.
- **Improve mobile usability:** prioritize navigation, data presentation, forms, touch interactions, and content hierarchy.
- **Make context-aware design decisions:** choose patterns based on user tasks rather than blindly applying bottom navigation, cards, or bottom sheets.
- **Work with existing code:** reuse components and design tokens while preserving branding, desktop behavior, routes, permissions, and business logic.
- **Verify changes:** check representative phone viewports and interaction flows when testing tools are available; clearly distinguish verified results from untested assumptions.

The skill supports mobile websites and responsive web apps. It can guide mobile views in PWA projects, while advanced browser-specific and installed-PWA checks are planned for later phases.

## Who it's for

- **Vibe coders** who want an AI coding agent to make good mobile UX decisions.
- **Developers** who can build responsive layouts but do not specialize in mobile interaction design.
- **Indie makers and product teams** improving mobile usability without redesigning the entire website.

## How it works

1. **Discover** the existing project and important mobile user tasks.
2. **Diagnose** usability problems beyond layout and CSS overflow.
3. **Decide** which mobile UX patterns fit the actual product context.
4. **Improve** the smallest relevant parts of the existing implementation.
5. **Verify** mobile behavior and desktop regressions; report what was and was not tested.

### Operating modes

| Mode | Purpose |
| --- | --- |
| **Improve** (default) | Optimize an existing responsive mobile experience. |
| **Build mobile view** | Design the mobile view of a new feature in an existing web project. |
| **Audit only** | Find and prioritize issues without modifying code. |
| **Verify** | Review mobile interactions and regressions without making edits. |

## Getting started

This project follows the [Agent Skills specification](https://agentskills.io/specification). A compatible agent needs access to the `mobile-web-ui-ux-skill` directory and its `SKILL.md` file.

1. Download or clone the repository.
2. Place the complete `mobile-web-ui-ux-skill` directory in your agent's supported skills location (for example, `.agents/skills/mobile-web-ui-ux-skill/` where supported).
3. Open an existing web project and ask your coding agent to improve its mobile UX.

Skills directories differ between agents. Refer to your agent's documentation for its supported installation path. If automatic skill discovery is unavailable, ask the agent to read this repository's `SKILL.md`.

### Create comparison projects

From WSL, create two independent copies of the same runnable fixture in an existing destination directory outside this repository:

```bash
# View detailed usage instructions
make help

# Create both projects at once (recommended)
make both DEST=~/work/mobile-ux-test

# Or create projects individually
make no-skill DEST=~/work/mobile-ux-test
make with-skill DEST=~/work/mobile-ux-test
```

Both commands use `order-dashboard` by default. Add `FIXTURE=mobile-form` to use the form fixture. Note that `DEST` must be an existing parent directory (create it beforehand if needed with `mkdir -p <DEST>`). The second project includes the skill at `.agents/skills/mobile-web-ui-ux-skill/`, with its runtime references. Reviewer cases and rubrics stay in this repository. The first has no project skill. Generated projects omit `node_modules` and `dist`; run `npm ci` inside each project before starting it. Existing destination projects are never overwritten. Use a new `DEST` for another trial, and keep reviewer cases and results outside both generated projects.

Each copy has identical `AGENTS.md` recording instructions and all 12 case folders from `evals/comparison-prompts.md`: `nav-01`–`nav-03`, `data-01`–`data-03`, `form-01`–`form-03`, and `a11y-01`–`a11y-03`. Each folder has its own `prompt.txt`, `run-info.txt`, and `manifest.json`. In a fresh Antigravity conversation for each case and project, send the exact text from that case's `prompt.txt` to both conditions. The agent is asked to write `response.txt` and fill `run-info.txt`. A fixture may not implement every scenario; record unrun checks honestly. Copy the matching case folders back under separate `no-skill/` and `with-skill/` parents for independent review. Check that both output files exist and no `PENDING` fields remain: agent-written metadata is a report, not an independent transcript, and unknown runtime fields must stay `unknown`. Compare all cases before deciding whether to change the skill.

## Example requests

**Improve an existing mobile website**

> Improve the mobile UI/UX of this existing responsive website. Identify the main mobile user tasks, choose suitable UX patterns, implement focused improvements, and preserve desktop behavior and business logic.

**Audit without changing code**

> Audit this dashboard on mobile. Explain which usability problems affect task completion, prioritize them, and recommend fixes. Do not modify code.

**Build the mobile view for a new feature**

> Build a mobile-friendly view for this new feature in our existing web app. Reuse our current design system and components. Choose the interaction patterns yourself and explain key decisions.

## Repository structure

```
SKILL.md                     Agent instructions and workflow
README.md / README.vi.md     Project documentation
docs/                        Product scope, MVP boundaries, roadmap
references/                  Runtime guidance, verification criteria and evidence record
references/decisions/        Eight task-based mobile UX playbooks
evals/fixtures/              Runnable order dashboard and form baselines
evals/scenarios/             Mobile UX evaluation scenarios
evals/decisions/             Decision cases and counterexamples
evals/evaluation-criteria.md Reviewer entry point to shared verification criteria
examples/                    Sample UX report
scripts/validate_skill.py    Structure and Markdown-link validator
.github/workflows/           CI validation
```

## Validation

Requires Python 3.9+ (standard library only):

```
python3 scripts/validate_skill.py
```

This validates the skill's structure, metadata, and local documentation links. **It does not measure usability or prove that mobile UX has improved.** Actual UX verification requires runnable examples, interaction tests, and/or device testing.

## Project status

**Decision guidance in progress.** The repository includes eight focused playbooks, a decision record contract, runnable order dashboard and form baselines, evaluation cases, and structural validation. The baselines intentionally retain mobile friction. Six exploratory answer pairs were [reviewed](tests/reports/261014-mobile-ux-skill-comparison-review.md); strict comparison remains `NOT RUN` because not all controls were documented. The guidance changes from that review have not been rerun with a fresh consumer. This is **not yet a tested mobile UX improvement system**.

Next milestones are a protocol-compliant decision comparison, an improved fixture with before/after task checks, real phone keyboard/accessibility tests, and browser/PWA-specific guidance. See [MVP scope](docs/mvp-scope.md), [decision evaluation](evals/results/decision-evaluation.md), and [roadmap](docs/roadmap.md).

## Contributing

Contributions, reproducible mobile UX cases, improved decision rules, and evaluation scenarios are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Released under the [MIT License](LICENSE).

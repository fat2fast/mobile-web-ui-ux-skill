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

Each copy has identical `AGENTS.md` recording instructions and all case folders from `evals/comparison-prompts.md`. For a targeted **Tier A** with-skill regression, use a separate conversation per case, keep prior answers and reviewer materials out of that conversation, and record possible file exposure. A shared fixture workspace is allowed; it does not by itself prove case isolation or contamination. For a **Tier B** skill versus no-skill superiority claim, use matched controls and a demonstrated boundary against sibling answers as specified by the [comparison protocol](evals/comparison-protocol.md). Keep historical outputs under [`tests/v.0.1.0/`](tests/v.0.1.0/) and [`tests/v0.1.1/`](tests/v0.1.1/); [targeted Tier A results](tests/261015-tier-a/) are separate. Record prompt hash, source snapshot, session locator where exposed, and checks actually run. Agent-written metadata is not an independent transcript; unavailable runtime fields remain `unknown`.

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
evals/fixtures/              Runnable baselines for mobile UX evaluation
evals/implementations/       Historical retrofits and task-first implementations
tests/task-ux/              Current task browser suite and evidence tools
evals/scenarios/             Mobile UX evaluation scenarios
evals/decisions/             Decision cases and counterexamples
evals/evaluation-criteria.md Reviewer entry point to shared verification criteria
examples/                    Sample UX report
scripts/validate_skill.py    Structure and Markdown-link validator
.github/workflows/           CI validation
tests/261015-retrofit/        Before/after browser checks and screenshots
```

## Validation

The current-run task UX verifier takes explicit build, browser and run-manifest paths, plus SHA and run ID. CI creates these in its runner temp directory, runs the browser suite and uploads `task-ux-evidence` after verification. Checked-in `tests/task-ux/artifacts/` records are historical; see [task UX evidence](tests/reports/task-ux-evidence.md) for the exact scope and device limits.

Requires Python 3.9+ (standard library only):

```
python3 scripts/validate_skill.py
```

This validates the skill's structure, metadata, and local documentation links. It does not measure usability. CI also runs tooling unit tests, fixture and implementation builds, and the [task browser suite](tests/task-ux/). The [workflow](.github/workflows/validate.yml) owns the current job and project set. [Earlier retrofit checks](tests/261015-retrofit/) remain historical evidence. Physical-device behavior remains untested.

## Project status

**Useful alpha with fixture-validated mobile tasks.** Historical dashboard/form retrofits are complemented by task-first orders, aligned comparison and contextual request-form implementations. See the [task acceptance contract](docs/mobile-task-acceptance.md), [browser suite](tests/task-ux/) and [recorded evidence](tests/reports/task-ux-evidence.md) for coverage and limits. Fresh [Tier A with-skill regressions](tests/reports/regression-261015-tier-a.md) passed four targeted advice cases and two counterexamples; a separate form code variant also passed its focused check. [Before/after Chromium browser checks](tests/reports/retrofit-261015-browser-evidence.md) cover dashboard and form tasks at phone widths and desktop, with screenshots and limits recorded. The six older exploratory pairs remain [archived](tests/reports/261014-mobile-ux-skill-comparison-review.md). A controlled Tier B skill comparison is still `NOT RUN`; these fixture results do not establish a general usability gain or physical-phone behavior.

Next milestones are executable coverage for the [original navigation scenario](evals/scenarios/navigation.md), focused real-phone and assistive-technology checks, and a controlled Tier B comparison. The newer comparison/request-form journeys do not replace that navigation commitment. Browser/PWA specialization follows those evidence gaps. See [MVP scope](docs/mvp-scope.md), [decision evaluation](evals/results/decision-evaluation.md), and [roadmap](docs/roadmap.md).

## Contributing

Contributions, reproducible mobile UX cases, improved decision rules, and evaluation scenarios are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Released under the [MIT License](LICENSE).

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
references/                  Project discovery, UX principles, workflows
references/decisions/        Navigation, data-display, and forms playbooks
evals/scenarios/             Mobile UX evaluation scenarios
evals/evaluation-criteria.md Evaluation criteria
examples/                    Sample UX report
scripts/validate_skill.py    Structure and Markdown-link validator
.github/workflows/           CI validation
```

## Validation

Requires Python 3.9+ (standard library only):

```
python scripts/validate_skill.py
```

This validates the skill's structure, metadata, and local documentation links. **It does not measure usability or prove that mobile UX has improved.** Actual UX verification requires runnable examples, interaction tests, and/or device testing.

## Project status

**v0.1 — initial foundation.** The repository currently includes the core workflow, three initial decision playbooks (navigation, data display, forms), evaluation scenario specifications, and structural validation. It is **not yet a fully tested automated mobile UX optimization system**.

Next milestones include refining decision playbooks, testing against working web-app fixtures, introducing repeatable mobile interaction checks, and deepening browser/PWA-specific guidance. See [MVP scope](docs/mvp-scope.md) and [roadmap](docs/roadmap.md).

## Contributing

Contributions, reproducible mobile UX cases, improved decision rules, and evaluation scenarios are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Released under the [MIT License](LICENSE).
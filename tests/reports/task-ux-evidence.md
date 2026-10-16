# Task UX evidence — 2026-10-16 local working tree

This report describes the current implementation check. Earlier reports and checked-in `tests/task-ux/artifacts/*.json` are historical records.

## Executed checks

| Check | Result | Scope |
| --- | --- | --- |
| `python3 scripts/validate_skill.py` | PASS | 22 required files, 355 local links |
| `python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v` | PASS | 8 tooling tests |
| `collect-build-results.py --build-local` | PASS | 4 fixtures and 3 task-first implementations |
| `npx playwright test` | PASS | 34 headless Chromium specs across order, comparison and request form |
| `verify-evidence.py` | PASS | Same local run ID, base SHA, fresh browser manifest, required passed specs and 7 builds |
| `check-evidence-rejections.py` | PASS | Rejects stale/mismatched identity, failed build, missing specs, runner error, interruption and bad manifest |

The browser run used WSL Ubuntu 24.04 and wrote JSON plus screenshots under `/tmp/mobile-ux-cook-20261016-release/`. The base commit is `b70877d54ba895d1864d284fb3a3affb34e63a2a`; this was a **dirty working-tree run**, so that SHA does not identify the changed source. The local result is not clean-commit evidence. A separate GitHub Actions run on committed source is recorded below.

## Clean-commit CI check

[Push run 38845489783](https://github.com/fat2fast/mobile-web-ui-ux-skill/actions/runs/38845489783) completed successfully for commit `67fc5d500beaf86d3e2b751d3ed4b5d2f8c73fab`. All seven build jobs, structural validation and the task browser job passed. Its downloaded `task-ux-evidence` artifact contains build and browser results stamped with `67fc5d5` and run ID `38845489783-1`, a matching run manifest, and six screenshots. The browser JSON reports zero unexpected failures; the CI verifier and rejection checks passed in the browser job. The [PR run 38845519072](https://github.com/fat2fast/mobile-web-ui-ux-skill/actions/runs/38845519072) also passed, using GitHub's PR merge SHA `3d71924bffd77c5a68f7b1762623d7a061cc69f2` in its artifact. These runs validate the implementation commit; later documentation commits need their own CI result.

## Observed browser outcomes

- Orders: zero horizontal scroll to the first record action at 320/390px; routes, Escape/backdrop dismissal, focus return, independent selection/detail, cross-filter bulk action including Delivered, empty recovery, CSV, 1280px table and breakpoint resize passed. Screenshots: `orders-320.png`, `orders-390.png`, `orders-1280.png`.
- Comparison: the semantic table retained aligned metrics, sticky labels, scroll cues, keyboard traversal and selection at 320/390px. Horizontal scroll remains inside the comparison container by design.
- Request form: manual ISO and native date-input values synchronized; inclusive days, 422 field focus and correction, network error focus, file remove and server-confirmed multipart bytes passed. Reduced-height Chromium checks passed at 320/375/390/430px. Screenshots: `request-form-320.png`, `request-form-390.png`, `request-form-error-390.png`.

## Limits and follow-up

- **NOT RUN:** actual selection inside the platform calendar popup, an unsupported-picker browser, physical iOS/Android virtual keyboard, touch handling, screen reader and human task walkthrough. The native date test clicks the control and fills its value; it proves synchronization, not popup use.
- **NOT RUN:** representative 20-record bulk task and long-label translation/zoom review. The four-record fixture proves state retention and geometry only.
- Headless test duration is automation time, not human task time. These fixture outcomes do not establish general skill superiority.

The skill decisions behind the list, comparison table and paired date controls are recorded in `evals/decisions/`.

# Scenario C — Responsive Menu vs Usable Navigation

**Status:** Specification only; runnable fixture not yet included.

## Product context

A project management web app has 10–12 sidebar destinations and a few repeated task flows.

## Primary mobile task

Move from the overview to a frequently used task, edit it, and return using browser Back.

## Baseline problem to reproduce

All links are hidden in a long hamburger menu, active location is unclear and global navigation competes with page actions.

## Expected agent behavior

- Infer or inspect task frequency; state assumptions.
- Decide between exposed high-priority destinations and grouped secondary menu, local tabs or contextual actions.
- Preserve routes, authorization, active state and browser back behavior.
- Keep essential destinations accessible without overcrowding the view.

## Failure examples

Adding a bottom bar with 12 icons; breaking deep links; unauthorized route exposure; permanently obscuring content.

## Test evidence to capture later

Before/after navigation steps, Back/deep-link checks, menu keyboard accessibility and desktop regression.

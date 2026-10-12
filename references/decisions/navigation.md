# Decision Playbook: Mobile Navigation

## Trigger

Users cannot find frequently used destinations; desktop sidebar collapses into a long hard-to-use menu; navigation blocks too much screen; back behavior is confusing.

## Diagnose

- How many **top-level destinations** exist? Which correspond to top tasks?
- Is the user browsing many sections or repeatedly switching among a small stable set?
- Is the navigation hierarchical? Are there access-controlled destinations?
- Does browser Back and deep linking currently work?
- Is screen height/keyboard reducing usable navigation space?

## Choose a pattern

| Conditions | Candidate | Reject when |
| --- | --- | --- |
| Small, stable set of high-frequency peer destinations | Bottom navigation | Many destinations, deep hierarchy, or bottom UI competition |
| Numerous destinations with occasional switching | Menu/drawer with grouped labels | Main task becomes buried with no visible entry |
| Small number of sibling views within one section | Local tabs | Tabs represent unrelated routes/tasks |
| One focused multi-step flow | Visible progress + explicit Back/Next | Global navigation unnecessarily interrupts the flow |
| Dense admin app with distinct contexts | Contextual actions + compact navigation | Critical tasks become undiscoverable |

## Guardrails

- Do not invent information architecture or rename routes without evidence/authorization.
- Reflect active state; avoid duplicate navigation patterns competing for the same role.
- Do not break browser Back, focus restoration or keyboard traversal.
- A fixed bottom bar must account for content padding, viewport/safe area and any on-screen keyboard.
- Verify important destinations remain discoverable; do not treat a bottom bar as mandatory.

## Example decision

**Before:** 12 desktop sidebar links become a hamburger list; users repeatedly open the menu for Orders and Tasks.

**Option:** Expose the two frequently used actions prominently and keep grouped secondary destinations in a menu, rather than placing 12 items in a bottom bar. Verify that task frequency is real before promoting routes globally.

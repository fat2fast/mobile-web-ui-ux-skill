# Content hierarchy decisions

Prioritize content by mobile task while retaining a labeled route to everything required. Use [decision record](../decision-contract.md).

| Conditions | Candidate and trade-off | Reject when |
| --- | --- | --- |
| Identity and status needed to scan | Summary with detail route | Required status, amount or ID is hidden or truncated ambiguously |
| Optional groups of long information | Native details/accordion with clear label and state | Users must open many groups just to complete task |
| Context lost while scrolling | Small sticky context header | It obscures content at zoom or competes with sticky CTA |
| Long translated names/IDs | Wrapping, safe word break, copy affordance | Truncation removes distinguishing information |

Test reflow at an effective 320 CSS px width (for example, 1280px viewport at 400% zoom) and test 200% text resizing separately; verify access to full names, IDs, totals, errors and actions. If information is collapsed, name the control and test keyboard/touch opening. A genuine two-dimensional comparison can retain horizontal scrolling with clear association, but cell text must remain readable.

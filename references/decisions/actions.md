# Action hierarchy decisions

Classify each action by frequency, consequence and recovery. Use [decision record](../decision-contract.md).

| Conditions | Candidate and trade-off | Reject when |
| --- | --- | --- |
| Frequent primary action in a short page | Visible inline CTA near task completion | It becomes hard to find after a long form |
| Long task with persistent completion action | Sticky CTA with content/keyboard clearance | It covers content, competes with another footer or keyboard |
| Infrequent secondary actions | Labeled contextual menu with visible trigger | Critical action is hidden behind guessing or hover |
| Destructive or irreversible action | Distinct label plus confirmation/review; undo when feasible | Confirmation alone lacks context, or undo cannot restore data |

Keep a visible route to the primary action and a safe route to cancel. Confirm the existing action handler and eligibility rules before proposing a review step or guardrail; do not exclude records or add actions based only on their status label. Disable repeat submission during loading when the underlying action supports that state, and announce progress and completion. Do not silently change permissions or business effects. Do not make swipe/long press the only way to act.

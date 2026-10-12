# Decision Playbook: Mobile Forms

## Trigger

Input feels slow; users encounter hidden errors, difficult keyboard/focus transitions, or obscured submit buttons.

## Diagnose

- What is the minimum information required to complete the task?
- Is the form one coherent group or a long multi-stage flow?
- What should the mobile keyboard show for each field?
- How are errors displayed, announced and recovered from?
- Do autocomplete, password managers, paste, and back-navigation work?

## Choose a pattern

| Conditions | Candidate | Reject when |
| --- | --- | --- |
| Short straightforward form | Single-column form with visible labels | Long form would overwhelm users |
| Multiple meaningful phases | Progressive sections/steps with clear progress | Extra steps slow a short simple form |
| Numeric/email/phone data | Appropriate `type`, `inputmode` and autocomplete | Custom masking breaks paste or accessibility |
| Validation errors | Inline errors + programmatic association and focus strategy | Validation fires too early or loses input |
| Keyboard covers actions | Natural document flow / keyboard-aware layout | Sticky CTA overlaps viewport or input |

## Guardrails

- Never rely on placeholder as the only accessible field label.
- Avoid forcing autofocus on load, which may unexpectedly open the keyboard.
- Preserve form values, error state, authentication and submit behavior.
- Avoid disabling zoom, blocking paste or implementing inaccessible custom keyboards.
- Validate with an actual mobile keyboard where available; emulator-only checks have limits.

## Example decision

**Before:** A signup form has placeholder-only labels and a fixed bottom submit control hidden while typing.

**Option:** Add persistent labels, proper input autocomplete and visible inline errors; move CTA into normal flow or adapt sticky behavior to keyboard visibility. Verify successful submission, error recovery, and no obscured fields.

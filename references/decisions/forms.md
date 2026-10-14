# Mobile form decisions

Inspect required fields, validation rules, server responses, focus order and recovery before changing form presentation.

| Conditions | Candidate and trade-off | Reject when |
| --- | --- | --- |
| Short coherent form | One column, persistent labels, natural submit flow | Splitting adds unnecessary steps |
| Long form with meaningful stages | Sections or steps with progress and preserved values | Back loses input, validation context or deep-link state |
| Email/phone/numeric data | Semantic `type`, fitting `inputmode`, and correct `autocomplete` | Masking or keyboard choice blocks paste or valid formats |
| Validation/server error | Inline error associated through `aria-describedby`, summary/focus when useful | Error appears away from field or destroys values |
| Submit near viewport edge | In-flow CTA, or sticky CTA with measured clearance and keyboard handling | It obscures focused field/content or competes with system keyboard |

Keep labels visible; placeholders are hints. Preserve existing client and server validation, submitted values, paste, password manager behavior, zoom and success/error paths. Make email typo suggestions optional: accepting a suggestion must be an explicit user action, while declining it must not block an address that existing validation accepts. Do not lowercase an entire email address: [SMTP preserves the local part's case](https://www.rfc-editor.org/rfc/rfc5321#section-2.4). Do not add a stricter domain rule without an existing product requirement. Use `aria-invalid` only on invalid fields; move focus deliberately after submit errors. A resized desktop viewport is not a physical keyboard test. Use the [decision contract](../decision-contract.md).

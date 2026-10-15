# Mobile form decisions

Inspect required fields, validation rules, server responses, focus order and recovery before changing form presentation.

| Conditions | Candidate and trade-off | Reject when |
| --- | --- | --- |
| Short coherent form | One column, persistent visible labels, natural submit flow | Splitting into a wizard adds unnecessary friction |
| Long form with meaningful stages | Sections or steps with progress indicator and preserved values | Back navigation loses input, validation context or deep-link state |
| Date and range inputs | Contextual date picker with mandatory manual text entry (`YYYY-MM-DD`) and clear format hints | Forces picker-only modal lockouts or blocks typing |
| Derived values and date bounds | Explain calculation (e.g. inclusive days) and validate date bounds ONLY when supported by source rules | Inventing unverified product validation rules |
| Mobile file attachment | Prominent mobile file picker button; offer camera only if capture is supported | Drag-and-drop emphasized as primary mobile affordance |
| Email/phone/numeric data | Semantic `type`, fitting `inputmode`, and correct `autocomplete` | Masking or keyboard choice blocks paste or valid formats |
| Validation/server error | Inline error associated through `aria-describedby`, focus first error, preserve valid values | Error appears away from field or destroys valid user entries |
| Submit CTA placement | Reachable CTA verified against keyboard and input clearance (in-flow or safe sticky bar) | CTA obscures focused inputs or gets hidden behind virtual keyboard |

## Form Patterns & Validation Guidance

- **Date Inputs & Derived Days:** Pair contextual date controls with accessible manual text entry alternatives. Calculate derived values (such as inclusive duration) and validate range order (e.g., end date on or after start date) only when grounded in existing project or fixture requirements.
- **Mobile File Upload:** Use standard touch-friendly file selectors. Emphasize file browse over drag-and-drop. Include camera capture (`capture="environment"`) only when camera workflow is explicitly required.
- **Error Recovery:** On client or server rejection (e.g. HTTP 422), always retain all valid user entries. Connect inline error messages via `aria-describedby` and automatically move focus to the first invalid control.
- **CTA Reachability vs CSS Position:** Assess submit actions by **functional clearance and reachability**, not by a rigid CSS rule (`position: static`). Both in-flow submit buttons and sticky bottom bars are acceptable provided the CTA does not obscure active input fields, labels, or the virtual keyboard during user interaction.

Keep labels visible; placeholders are hints. Preserve existing client and server validation, submitted values, paste, password manager behavior, zoom and success/error paths. Make email typo suggestions optional: accepting a suggestion must be an explicit user action, while declining it must not block an address that existing validation accepts. Do not lowercase an entire email address: [SMTP preserves the local part's case](https://www.rfc-editor.org/rfc/rfc5321#section-2.4). Do not add a stricter domain rule without an existing product requirement. Use `aria-invalid` only on invalid fields; move focus deliberately after submit errors. A resized desktop viewport is not a physical keyboard test. Use the [decision contract](../decision-contract.md).
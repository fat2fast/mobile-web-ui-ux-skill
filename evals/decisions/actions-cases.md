# Action cases

All proposed changes are `INFERRED` decision reviews under the [contract](../../references/decision-contract.md).

## ACT-01 — Ordinary follow-up
- **Evidence:** `PASS` dashboard baseline local follow-up status in [result](../results/order-dashboard-baseline.md).
- **Mobile task:** follow up one order after checking detail.
- **Candidates:** visible detail-page button; contextual menu with visible trigger.
- **Selected:** visible detail-page button for this frequent, low-consequence task.
- **Rejected:** contextual menu adds a tap and hides the task despite little competition on detail page.
- **Preserved:** permitted action, order identity, loading/result status, Back and desktop.
- **Verify:** `PASS` baseline action; `NOT RUN` proposed layout. Test touch/keyboard and repeated tap handling.

## ACT-02 — Delete order
- **Evidence:** `INFERRED` scenario; deletion is not implemented in the baseline.
- **Mobile task:** delete a selected order safely.
- **Candidates:** labeled Delete button with contextual review and undo where backend allows; swipe shortcut with the same visible Delete button.
- **Selected:** labeled button plus review of order ID; optional undo only if actual backend can restore it.
- **Rejected:** swipe as primary path because it is undiscoverable and conflicts with horizontal table scroll. A visible button is the equivalent control.
- **Preserved:** authorization, ID, confirmation, cancellation, audit effects, keyboard access, loading and desktop.
- **Verify:** `NOT RUN`; test unauthorized role, cancel, confirm, duplicate tap and restoration where supported.

## ACT-03 — Submit under keyboard
- **Evidence:** `PASS` 390px form screenshot shows fixed footer; keyboard overlap remains `NOT RUN` ([result](../results/form-baseline.md)).
- **Mobile task:** submit after editing Notes or Reference code.
- **Candidates:** in-flow CTA; sticky CTA with measured keyboard/field clearance.
- **Selected:** in-flow CTA until real device evidence supports a sticky bar; it follows the last field naturally.
- **Rejected:** sticky version without clearance because it can obscure editing context.
- **Preserved:** all values, server responses, visible errors, focus, zoom and desktop.
- **Verify:** `NOT RUN` proposed layout and physical keyboard. Test last field, scroll, submit and error focus on phone.

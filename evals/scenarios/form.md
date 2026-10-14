# Scenario B — Mobile Form With Keyboard

**Status:** Runnable baseline at [mobile form](../fixtures/mobile-form/README.md). See [observations](../results/form-baseline.md); physical keyboard behavior remains untested.

## Product context

A responsive signup or checkout web form with 6–10 inputs, client/server validation and submit flow.

## Primary mobile task

Complete the form, fix an intentional validation error and submit using a phone keyboard.

## Baseline problem to reproduce

Fixed submit bar gets obscured by virtual keyboard; placeholders disappear; errors are hard to locate.

## Expected agent behavior

- Maintain visible labels and meaningful field order.
- Select appropriate input types, autocomplete and accessible error semantics.
- Avoid aggressive autofocus and sticky controls that obscure focused fields.
- Preserve submitted data and both error/success flows.

## Failure examples

Removing validation; blocking paste; autofocus opens keyboard unexpectedly; client-side-only success claim.

## Test evidence to capture later

Mobile form states, error recovery, focus/scroll, keyboard visibility and successful submit.

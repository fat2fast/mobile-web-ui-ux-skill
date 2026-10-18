# Accessibility evaluation checklist

The runtime [accessibility checklist](../references/accessibility-checklist.md) contains WCAG assertions and evidence labels. Reviewer-only [accessibility cases](decisions/accessibility-cases.md) provide counterexamples and must not enter generator projects.

For the representative task suite, review text, essential borders, focus and status/error states against actual transitions. Required negative probes cover insufficient contrast, color-only status and removed focus; disabled exceptions do not exempt enabled essential boundaries. Require native measurement/scan attachments and same-source/run file hashes. Reject missing/skipped outcomes, copied titles from another spec/project, missing/changed/stale files and symlink escapes. Dirty local runs remain exploratory; incomplete scans and unsupported painting require disposition. No current-release or full-conformance claim follows from the existence of these checks.

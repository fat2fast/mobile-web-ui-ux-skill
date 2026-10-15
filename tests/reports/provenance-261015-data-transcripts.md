# DATA-01 / DATA-02 transcript provenance

Checked 2026-10-15 against archived `tests/v0.1.1/with-skill/data-01/transcript.jsonl`, `data-02/transcript.jsonl`, their manifests and run-info, and the still accessible source file named by both run-info records.

- **Observed:** `data-01` has 60 JSONL events. `data-02` has those exact 60 records as its prefix, then one more event. Both run-info records name the same Antigravity brain transcript source (`a62cd176-a9e5-4a12-b7fb-c6653aa1aa36`). The `data-02` archive begins with the DATA-01 `USER_INPUT`, and has no `USER_INPUT` containing its price-comparison prompt. Its later `VIEW_FILE` and `CODE_ACTION` events do refer to `data-02`, and its final answer covers the price-comparison task.
- **Inference:** The DATA-02 archive is a cumulative snapshot of the same source log used for DATA-01. It is not a case-specific independent transcript. The record does not show whether the exporter selected a cumulative/wrong source or Antigravity reused one brain log across separate conversations. The user states that each case used a separate agent conversation; common transcript prefix alone does not contradict that statement.
- **Disposition:** Both responses and manifests remain intact. DATA-02 transcript provenance is **ambiguous**; it cannot establish independent conversation context or controlled A/B evidence. Replays should record a distinct session locator when exposed and check for a case-specific input event before assigning a transcript to a case. A shared fixture workspace alone is not contamination evidence.

Commands used: `sha256sum`, `wc -l`, `cmp -n`, and `jq` over the two archives; source path existence checked with `ls -l`. The raw source was read only and no archive was rewritten.

Unresolved: Antigravity's conversation-to-brain mapping and the export command used for DATA-02 were not recorded, so the exact cause of source selection cannot be reconstructed from these artifacts.

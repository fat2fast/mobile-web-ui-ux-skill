# Cross-project mobile UX evidence — operator runbook

Use this only after a user has authorized the affected route, changed files, non-production credentials, data restrictions and acceptable tests. For TabDo, retain the separate Gate 3 user approval specified by [the pilot runbook](real-project-pilot.md). This workflow does not authorize editing that project.

## A. Produce locally in the consumer project

1. Record installed skill semantic version and **observed** payload SHA-256 / source commit; unknown source SHA remains `unknown`. Capture target before/after identities. If after has uncommitted edits, record `UNCOMMITTED`, `dirty` and a SHA-256 of a separate private changed-file manifest.
2. Audit/implement only the approved scope. Run relevant browser, keyboard, contrast, desktop and business regression checks; record actual method, assertion, observed outcome, revision and private artifact mapping. Never infer PASS from a screenshot alone.
3. Author sanitized `draft.json` from the [v1 contract](../../references/external-pilot-evidence.md); the source repo has `examples/pilot-evidence-safe/draft.json`, explicitly fictional. Do not include private log paths or screenshot bytes in the draft.
4. From the **installed skill**, run:

   ```bash
   python3 .agents/skills/mobile-web-ui-ux-skill/scripts/pilot-evidence.py export --input <private-draft.json> --out <parent>/<pilot-id>
   python3 .agents/skills/mobile-web-ui-ux-skill/scripts/pilot-evidence.py validate --package <parent>/<pilot-id> --policy public
   ```

5. Human owner checks exactly `manifest.json`, `checks.json`, `report.md`, sensitive narratives and PR links. Decide whether every value is authorized for publication. Record the package digest output **after approval**; any change voids that approval. Do not publish automatically.

## B. Import in the skill repository

```bash
mkdir -p evals/external-pilots
python3 scripts/pilot-evidence.py validate --package <approved-package> --policy public
python3 scripts/pilot-evidence.py import --package <approved-package> --destination evals/external-pilots --approve-public --approved-digest <approved-digest>
```

6. Reviewer completes `evals/external-pilots/<pilot-id>/review.md` (created `PENDING`), attaching only approved public sources, the observable assertions/replay plan, one of `DECISION|IMPLEMENTATION|VERIFICATION|PROJECT_SPECIFIC|UNDETERMINED` and `ACCEPTED|NEEDS_REPRO|INSUFFICIENT_EVIDENCE|REJECTED`. A separate reviewer may reject an imported PASS when actual run evidence is missing.
7. If and only if an accepted skill-level defect is reproducible, create a sanitized fixture test **and nearby counterexample**, patch the narrowest decision/workflow/verification reference and run regressions. Keep raw private artifacts with the project owner. Tier B superiority claims still require the existing controlled comparison protocol.
8. Open a normal skill-repository PR for review. The CLI never stages, pushes, posts a GitHub issue, merges, accesses credentials, or starts an app server.

## Operational notes

- Local package validation proves allowed structure, SHA agreement and basic privacy heuristics **only**, not WCAG, human usability, independent approval or absence of secrets.
- No new CI workflow is needed: `scripts/tests/test_pilot_evidence.py` runs in the existing Python unittest job.
- Existing imported IDs cannot be silently replaced. Resolve corrections in a new reviewed record, retaining old provenance as appropriate.
- Rollback: revert only the authorized pilot import subtree or PR; the importer does not delete original package or private evidence. No real TabDo pilot was executed to create this tool.

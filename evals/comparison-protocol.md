# Decision comparison protocol

Freeze this protocol before generating outputs. Source prompts: [input-only prompts](comparison-prompts.md); expected reasoning: [case files](decisions/) are reviewer-only and must not enter either generation context. This fills the P00-05 protocol gap for P02; it does not imply P00 is wholly complete.

## Conditions and controls

Record for **each pair**: (1) model identifier/version, (2) exact prompt text/version, (3) tool access, (4) token budget, (5) time budget, (6) baseline commit plus fixture file hash, (7) workspace snapshot/path, (8) runtime OS/environment and any ambient instructions. Also record temperature/seed if the runtime exposes them; otherwise say unavailable. Each condition uses the same model, budget, prompt and tools. The skill condition loads only runtime `SKILL.md` and needed `references/`; the no-skill condition receives no skill instructions through prompt, files, ambient AGENTS or previous-session memory.

Use separate clean workspace copies made from the same fixture snapshot. Conditions may run sequentially or in parallel when their project filesystems and agent contexts are isolated; concurrent timestamps alone do not indicate contamination. Do not let either condition read the other's outputs or run artifacts before both are frozen. Do not pass case answers, outputs, rubric or this protocol to the generators. Save unedited raw responses under `evals/results/` with prompt ID, condition, model and timestamp. A reviewer who did not generate either answer compares the outputs after both are frozen. If only one pair is available, report it as one trial without generalizing. Note nondeterminism and repeat independent runs if resources allow.

Clarification added 2026-10-14 after the first comparison runs: parallel execution in isolated projects is valid. This changes no prompt, answer, or reviewer rubric and does not resolve other missing controls.

## Reviewer rubric

For each answer, mark `PASS`/`FAIL`/`NOT RUN` with quote or artifact: (a) task fit, (b) explanation of a viable rejected alternative, (c) preservation of functions/data/routes/desktop/accessibility, (d) honest verification status. Multiple patterns can pass if task-based reasons and preservation hold. Do not score words such as “cards”, “bottom nav” or “sheet”. Distinguish decision quality from implemented UX. Record false choices and link any amended rule to original case and raw answer; rerun failed case and nearby counterexample before calling a rule repair verified.

Comparison is `NOT RUN` unless both raw outputs, exact controls and independent review exist for a pair. If agent runtime, clean isolation or reviewer is unavailable, record the missing condition and replay command/steps; never manufacture a PASS.

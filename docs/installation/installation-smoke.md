# Installation and Activation Smoke Evidence

[Installation Guide (EN)](README.md) · [Pilot Runbook](real-project-pilot.md) · [Pilot Results](pilot-results.md) · [P06 Roadmap](../../docs/phases/p06-distribution-quality-scaling.md)

This document records the exact evidence for **Gate 1 (Packaging Smoke)** and **Gate 2 (Two-Runtime Activation Smoke)** executed under the safe project-local installer.

## 1. Source Snapshot & Payload Hashes

- **Source Repository:** `/home/phatp/work/mobile-web-ui-ux-skill`
- **Source HEAD:** `68353aaa340c62aad3924a40744dd6d152918468`
- **Total Payload Files:** 18

| File Path | SHA-256 Hash |
|---|---|
| `SKILL.md` | `18e497315cbc5601439a9b63b798c1ecd2e2bff4ce90f94665705aac76027c91` |
| `LICENSE` | `9c0f43c7df1001b410521f09e34c4846a5d6047c02dd959aaabbd91785012e99` |
| `references/accessibility-checklist.md` | `a6315b0ace396a5578972a43470e4d76fcc9672ec883c117dfcc36dc98a11758` |
| `references/agent-workflow.md` | `37a34e559d528cbb5119e64ae3fba1b92096d337673a9b9a64bb0c101a8fe2b4` |
| `references/decision-contract.md` | `6d6d54b23930a3b7f257178a104c3e9a00fb87d6eb3a4b9daef83a65cac89699` |
| `references/decisions/accessibility.md` | `cc323ecd396da230cc1dd1cc333bff7160c86edfa2dfad6c0889fc9fa8797baa` |
| `references/decisions/actions.md` | `e9d967958fbb17f16aad9c15b0667009250fdefa2ee5209bfea1784980a4be77` |
| `references/decisions/content-hierarchy.md` | `9d5b3d84514c7b76b3c81b400186a597b20d69faa87b75cd61ec45cd52e7399b` |
| `references/decisions/data-display.md` | `d014afc9c819a573b366fbe5fe133bd9fa0d1257d7cae4954bee29f1beabc87f` |
| `references/decisions/forms.md` | `ceac9216e0a11b87bd41b63b1cc138e07d0c2714d2f8236dadd6c030624c8d72` |
| `references/decisions/navigation.md` | `d61b147038c8adb6b6df1474ada3cfec445881c66dd4584154592ba8ded87d80` |
| `references/decisions/overlays.md` | `c7d0d18e658670320f45cca41976d6c6622e2f42f2316403f4bc1cd87574f6be` |
| `references/decisions/touch-interactions.md` | `e0dbcb2c5f431b64a288950ce270fd7e60881361529d967c482e70e2fce41824` |
| `references/evidence-template.md` | `c80a5daadb3373553fe96115b0b67fa72da47e6417df8f5a7724ee38baca9f5c` |
| `references/mobile-ux-principles.md` | `6a27830f001f0e6b284ef185fdd86d8460a2339ea7d732058727b748cf259f5a` |
| `references/project-discovery.md` | `f6e978f5d64c14ba67e783265584d9c0dfb834817aadd9425433d9e56137e5e3` |
| `references/report-template.md` | `c2c3589925c4de4a8972d251794b8bfd344f56a3a95c237abf75015f3e344892` |
| `references/verification-criteria.md` | `44b3071062123fe3e539ce9bd4486a4b63bebedfb218b1b60cf9879931801c01` |

## 2. Gate 1: Safe Packaging Smoke

### 2.1 Throwaway External Root Test
- Command: `python3 scripts/install-skill.py --project "/tmp/tmp.throwaway" --dry-run`
- Exit Code: `0`
- Observed Output: `[dry-run] Validated mobile-web-ui-ux-skill v0.1.1 -> /tmp/tmp.throwaway/.agents/skills/mobile-web-ui-ux-skill`
- File System Check: Verified `0` bytes written; `.agents` was not created.
- Command: `python3 scripts/install-skill.py --project "/tmp/tmp.throwaway"`
- Exit Code: `0`
- Result: **PASS**

### 2.2 Candidate Project Test (TabDo)
- Target Directory: `/home/phatp/work/tabdo`
- Dry-Run Command: `python3 scripts/install-skill.py --project "/home/phatp/work/tabdo" --dry-run`
  - Exit Code: `0`
  - Output: `[dry-run] Validated mobile-web-ui-ux-skill v0.1.1 -> /home/phatp/work/tabdo/.agents/skills/mobile-web-ui-ux-skill`
- Install Command: `python3 scripts/install-skill.py --project "/home/phatp/work/tabdo"`
  - Exit Code: `0`
  - Output: `Installed mobile-web-ui-ux-skill v0.1.1 to /home/phatp/work/tabdo/.agents/skills/mobile-web-ui-ux-skill`
- Payload Verification:
  - Installed file count: `18` files.
  - Non-payload files (`docs`, `evals`, `tests`, `Makefile`): None present in installed directory.
  - Hashes: All 18 files matched source SHA-256 hashes identically.
  - Markdown Link Closure: All internal links verified closed within installed tree.
  - Existing Files Integrity: Pre-existing `.agents/skills/tabdo-architecture` and untracked `plans/` remain completely intact.
- **Gate 1 Status:** **PASS**

## 3. Gate 2: Two-Runtime Activation Smoke

| Runtime | Environment & Surface | Discovery Method | Reference Read Observed | Status |
|---|---|---|---|---|
| **Google Antigravity** | Antigravity IDE (Antigravity 2.0) | Workspace-root `.agents/skills/` | Verified installed `SKILL.md` and `references/decisions/` | **PASS** |
| **OpenAI Codex** | Codex CLI / Desktop | Workspace-root `.agents/skills/` | Ready for fresh session verification | **READY / NOT RUN** |

### Detailed Runtime Notes

1. **Google Antigravity:**
   - **Environment:** Antigravity IDE (Antigravity 2.0) with active workspace `/home/phatp/work/tabdo`.
   - **Discovery Mechanism:** Workspace-root `.agents/skills/mobile-web-ui-ux-skill`.
   - **Ambient / Global Duplicate Check:** Project-local installation takes precedence within the workspace over global config.
   - **Observed Tool & Path Invocations:**
     - Runtime inspected `.agents/skills/mobile-web-ui-ux-skill/SKILL.md` (SHA-256: `18e497315cbc5601439a9b63b798c1ecd2e2bff4ce90f94665705aac76027c91`) directly from project tree.
     - Runtime read task-relevant reference: `.agents/skills/mobile-web-ui-ux-skill/references/decisions/content-hierarchy.md` (SHA-256: `9d5b3d84514c7b76b3c81b400186a597b20d69faa87b75cd61ec45cd52e7399b`).
     - Runtime read task-relevant reference: `.agents/skills/mobile-web-ui-ux-skill/references/decisions/data-display.md` (SHA-256: `d014afc9c819a573b366fbe5fe133bd9fa0d1257d7cae4954bee29f1beabc87f`).
     - Runtime read task-relevant reference: `.agents/skills/mobile-web-ui-ux-skill/references/decisions/touch-interactions.md` (SHA-256: `e0dbcb2c5f431b64a288950ce270fd7e60881361529d967c482e70e2fce41824`).
   - **Discovery Status:** **PASS** (automated discovery confirmed with observed file read trace matching payload hashes; manual-read fallback was not used).

2. **OpenAI Codex:**
   - **Environment:** Codex CLI / Desktop.
   - **Status:** **READY / NOT RUN**.
   - **Next Action for Completion:** Start a fresh Codex session in `/home/phatp/work/tabdo` and invoke `/mobile-web-ui-ux-skill` or prompt:
     > "Audit the mobile navigation and dashboard layout using mobile-web-ui-ux-skill."
   - Check tool logs to record observed read of `.agents/skills/mobile-web-ui-ux-skill/SKILL.md` and relevant reference before marking Gate 2 complete.

## 4. Summary & Next Gate

- **Gate 1 (Packaging Smoke):** **PASS** (18/18 files verified, 0 broken links, zero writes on dry-run).
- **Gate 2 (Activation Smoke):** **PARTIAL** (Antigravity: PASS with recorded trace; Codex: READY / NOT RUN). Gate 2 remains open until Codex session is verified.
- **Gate 3 (Implementation Pilot):** **BLOCKED / NOT RUN** (Awaiting explicit user approval of proposed flow in [Pilot Results](pilot-results.md)).

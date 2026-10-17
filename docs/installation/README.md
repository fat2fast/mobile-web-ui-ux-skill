# Project-Local Skill Installation Guide

[Tiếng Việt](README.vi.md) · [Real-Project Pilot Runbook](real-project-pilot.md) · [Skill Instructions](../../SKILL.md) · [Main README](../../README.md)

This guide explains how to install, verify, update, and rollback an independent, project-local copy of `mobile-web-ui-ux-skill` in an existing web project without altering application code, dependencies, or configuration.

## Prerequisites

- **Python 3.9+** (uses standard library only; no external Python packages needed).
- An existing target web application directory.
- **WSL environments:** When running on Windows Subsystem for Linux (WSL), execute commands in an interactive WSL `bash` shell using `python3` and ensure paths reside on the same filesystem as your project and agent runtime.

## Installation

The installer copies only runtime instructions, references, and the license (`SKILL.md`, `references/**`, `LICENSE`) into `<project>/.agents/skills/mobile-web-ui-ux-skill`. It enforces an exclusive destination check and will reject overwrites, symlinks, or source repository overlap.

### Step 1: Dry-Run (Verification without writing)

Before writing any files, run a dry-run to validate the target path and payload closure:

```bash
python3 scripts/install-skill.py --project "/path/to/your/project" --dry-run
```

Or using Make:

```bash
make install-dry-run DEST="/path/to/your/project"
```

Expected output:
```text
[dry-run] Validated mobile-web-ui-ux-skill v0.1.1 -> /path/to/your/project/.agents/skills/mobile-web-ui-ux-skill
```

### Step 2: Install

Execute the installation:

```bash
python3 scripts/install-skill.py --project "/path/to/your/project"
```

Or using Make:

```bash
make install DEST="/path/to/your/project"
```

Expected output:
```text
Installed mobile-web-ui-ux-skill v0.1.1 to /path/to/your/project/.agents/skills/mobile-web-ui-ux-skill
```

## Checking Skill Version and Updating

### Check Skill Version
To display the version of the source repository:
```bash
python3 scripts/install-skill.py --version
# Or via Make:
make version
```

To compare the installed version in a target project against the available source version:
```bash
python3 scripts/install-skill.py --project "/path/to/your/project" --check-version
# Or via Make:
make check-version DEST="/path/to/your/project"
```

Output when up to date:
```text
Target project: /path/to/your/project
Installed version: v0.1.1
Available source version: v0.1.1
Status: UP_TO_DATE (Installed skill is up to date with source)
```

Output when an update is available:
```text
Target project: /path/to/your/project
Installed version: v0.1.0
Available source version: v0.1.1
Status: UPDATE_AVAILABLE (Run with --update to update safely)
```

### Self-Update with Safe Backup & Rollback

To update an existing installation to the latest source version:

```bash
# Preview update without writing files:
make update-dry-run DEST="/path/to/your/project"
# Or via Python:
python3 scripts/install-skill.py --project "/path/to/your/project" --update --dry-run

# Perform safe update:
make update DEST="/path/to/your/project"
# Or via Python:
python3 scripts/install-skill.py --project "/path/to/your/project" --update
```

**Backup & Rollback Safety Guarantees:**
1. **Automatic Pre-Update Backup:** Before modifying the destination directory, the updater creates a full backup at `<project>/.agents/skills/.mobile-web-ui-ux-skill.bak`.
2. **Automatic Rollback on Handled Error or Graceful Interruption:** If an I/O error or graceful user interruption (`SIGINT` / Ctrl+C) occurs during file copying, the updater catches the event and immediately triggers an automatic rollback, restoring the destination to its exact prior state.
3. **Manual Rollback:** Ungraceful termination (such as `SIGKILL` or power loss) bypasses process handlers, but the pre-update backup directory remains intact. You can restore it manually at any time:
   ```bash
   make rollback DEST="/path/to/your/project"
   # Or via Python:
   python3 scripts/install-skill.py --project "/path/to/your/project" --rollback
   ```

## Runtime Activation

Both OpenAI Codex and Google Antigravity recognize the shared `.agents/skills` directory at the project workspace root.

| Agent Runtime | Discovery Mechanism | Invocation Method | Notes |
|---|---|---|---|
| **OpenAI Codex** | Workspace `.agents/skills` directory | Explicit slash command (e.g. `/mobile-web-ui-ux-skill`) or task description mentioning skill | Reload/restart session if skill was added while session was running |
| **Google Antigravity** | Workspace `.agents/skills` directory | Natural-language prompt mentioning skill name or IDE active skills selector | In Antigravity IDE, verify skill appears under Customizations; App/CLI supports slash commands |

> [!NOTE]
> Documented agent capability differs from verified runtime execution. A manual `SKILL.md` read by an agent is an emergency fallback, not proof of automated skill discovery.

## Removal

To remove the installed skill:
- Delete only the verified directory: `<project>/.agents/skills/mobile-web-ui-ux-skill` (and optional backup `.mobile-web-ui-ux-skill.bak` if present).
- Do not modify or remove other skills located under `<project>/.agents/skills/`.

## Troubleshooting

- **Destination already exists (`exit 2`):** When installing, the tool refuses to overwrite an existing directory. Use `--update` to update safely, or delete the old directory if you intend a fresh install.
- **Ambient / Global skill conflict:** If a global skill with the same name is installed, ensure the agent prioritizes project-local skills, or inspect the runtime's active customizations list.
- **Monorepo root:** Always supply the root directory of the workspace where the coding agent is opened, so the agent finds `.agents/skills/` at its working root.

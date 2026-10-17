#!/usr/bin/env python3
"""Safe, standalone project-local installer and updater for mobile-web-ui-ux-skill.

Standard library only. Installs, updates, checks versions, or rolls back
an independent copy of the skill at `<project>/.agents/skills/mobile-web-ui-ux-skill`.
Does NOT modify application files, configuration, or environment.
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
from pathlib import Path

SKILL_NAME = "mobile-web-ui-ux-skill"
SOURCE_ROOT = Path(__file__).resolve().parents[1]


def extract_version(skill_md_path: Path) -> str | None:
    """Extract version from SKILL.md YAML frontmatter."""
    if not skill_md_path.is_file() or os.path.islink(skill_md_path):
        return None
    try:
        content = skill_md_path.read_text(encoding="utf-8")
    except OSError:
        return None
    match = re.match(r"\A---\s*\n(.*?)\n---\s*\n", content, re.S)
    if not match:
        return None
    frontmatter = match.group(1)
    version_match = re.search(r'version:\s*["\']?([^"\'\s]+)["\']?', frontmatter)
    if version_match:
        return version_match.group(1).strip()
    return None


def parse_version_tuple(v: str) -> tuple[int, ...] | None:
    """Parse version string like '0.1.1' into integer tuple (0, 1, 1)."""
    try:
        parts = [int(p) for p in v.strip().split(".") if p.isdigit()]
        return tuple(parts) if parts else None
    except Exception:
        return None


def collect_and_validate_payload(source_root: Path) -> tuple[set[Path], list[str]]:
    """Validate source payload and ensure local Markdown links are closed within it."""
    errors: list[str] = []
    payload_files: set[Path] = set()

    skill_file = source_root / "SKILL.md"
    license_file = source_root / "LICENSE"
    references_dir = source_root / "references"

    for file_path, name in [(skill_file, "SKILL.md"), (license_file, "LICENSE")]:
        if not file_path.exists():
            errors.append(f"Missing required source file: {name}")
        elif os.path.islink(file_path):
            errors.append(f"Source file cannot be a symlink: {name}")
        elif not file_path.is_file():
            errors.append(f"Source file is not a regular file: {name}")
        else:
            payload_files.add(file_path.resolve())

    if not references_dir.exists():
        errors.append("Missing required source directory: references")
    elif os.path.islink(references_dir):
        errors.append("Source references directory cannot be a symlink")
    elif not references_dir.is_dir():
        errors.append("Source references path is not a directory")
    else:
        for root, dirs, files in os.walk(references_dir):
            root_path = Path(root)
            if os.path.islink(root_path):
                errors.append(f"Directory under references cannot be a symlink: {root_path.relative_to(source_root)}")
                continue
            for d in sorted(dirs):
                dir_path = root_path / d
                if os.path.islink(dir_path):
                    errors.append(f"Directory under references cannot be a symlink: {dir_path.relative_to(source_root)}")
            for f in sorted(files):
                file_path = root_path / f
                if os.path.islink(file_path):
                    errors.append(f"File under references cannot be a symlink: {file_path.relative_to(source_root)}")
                elif not file_path.is_file():
                    errors.append(f"File under references is not a regular file: {file_path.relative_to(source_root)}")
                else:
                    payload_files.add(file_path.resolve())

    if errors:
        return payload_files, errors

    # Check Markdown link closure inside payload
    for file_path in sorted(payload_files):
        if file_path.suffix == ".md":
            try:
                body = file_path.read_text(encoding="utf-8")
            except OSError as e:
                errors.append(f"Cannot read payload file {file_path.name}: {e}")
                continue

            for dest in re.findall(r"(?<!!)\[[^\]\n]*\]\(([^\)\s]+)(?:\s+\"[^\"]*\")?\)", body):
                if (
                    dest.startswith(("http:", "https:", "mailto:", "#"))
                    or dest.startswith("<")
                    or dest.startswith("{")
                ):
                    continue
                local = dest.split("#", 1)[0].split("?", 1)[0]
                if not local:
                    continue
                target = (file_path.parent / local).resolve()
                if target not in payload_files:
                    errors.append(
                        f"Local link in payload escapes or target missing: {file_path.relative_to(source_root)} -> {dest}"
                    )

    return payload_files, errors


def validate_project_and_parents(
    raw_project: str, source_root: Path
) -> tuple[Path | None, Path | None, Path | None, Path | None, str | None]:
    """Validate target project path and .agents hierarchy.
    
    Returns (project_root, agents_dir, skills_dir, dest_dir, error_message).
    """
    clean_project = raw_project.strip()
    if not clean_project:
        return None, None, None, None, "--project path cannot be empty."

    project_path = Path(clean_project)
    if os.path.islink(project_path):
        return None, None, None, None, f"Target project cannot be a symlink: {project_path}"
    if not project_path.exists():
        return None, None, None, None, f"Target project directory does not exist: {project_path}"
    if not project_path.is_dir():
        return None, None, None, None, f"Target project path is not a directory: {project_path}"

    project_root = project_path.resolve()

    # Source overlap checks
    if project_root == source_root:
        return None, None, None, None, "Target project cannot be the skill source repository itself."
    if source_root in project_root.parents:
        return None, None, None, None, "Target project cannot be a descendant of the skill source repository."
    if project_root in source_root.parents:
        return None, None, None, None, "Target project cannot be an ancestor of the skill source repository."

    agents_dir = project_root / ".agents"
    if os.path.islink(agents_dir):
        return None, None, None, None, f"'.agents' in target project cannot be a symlink: {agents_dir}"
    if agents_dir.exists() and not agents_dir.is_dir():
        return None, None, None, None, f"'.agents' in target project is not a directory: {agents_dir}"

    skills_dir = agents_dir / "skills"
    if os.path.islink(skills_dir):
        return None, None, None, None, f"'.agents/skills' in target project cannot be a symlink: {skills_dir}"
    if skills_dir.exists() and not skills_dir.is_dir():
        return None, None, None, None, f"'.agents/skills' in target project is not a directory: {skills_dir}"

    dest_dir = skills_dir / SKILL_NAME
    return project_root, agents_dir, skills_dir, dest_dir, None


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="install-skill.py",
        description="Install, update, or check mobile-web-ui-ux-skill in an existing project safely.",
    )
    parser.add_argument(
        "--project",
        help="Path to the existing target project root directory.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="Validate environment and payload without writing any files.",
    )
    parser.add_argument(
        "--version",
        action="store_true",
        default=False,
        help="Show skill source version and exit.",
    )
    parser.add_argument(
        "--check-version",
        action="store_true",
        default=False,
        help="Check and compare installed version in target project against source version.",
    )
    parser.add_argument(
        "--update",
        action="store_true",
        default=False,
        help="Safely update an existing installation with automatic backup and rollback on failure.",
    )
    parser.add_argument(
        "--rollback",
        action="store_true",
        default=False,
        help="Rollback the skill to the backup created during the last update.",
    )
    return parser.parse_args(argv)


def do_install(
    dest_dir: Path,
    agents_dir: Path,
    skills_dir: Path,
    payload_files: set[Path],
    source_root: Path,
    version: str,
    dry_run: bool,
) -> int:
    """Execute clean initial installation."""
    if os.path.lexists(dest_dir):
        sys.stderr.write(
            f"Error: Destination already exists in target project: {dest_dir}\n"
            "Will not overwrite existing installation. Use --update to update safely.\n"
        )
        return 2

    if dry_run:
        print(f"[dry-run] Validated {SKILL_NAME} v{version} -> {dest_dir}")
        return 0

    created_agents = False
    created_skills = False
    created_dest = False

    try:
        if not agents_dir.exists():
            os.mkdir(agents_dir)
            created_agents = True

        if not skills_dir.exists():
            os.mkdir(skills_dir)
            created_skills = True

        # Exclusive destination directory creation
        os.mkdir(dest_dir)
        created_dest = True

        inject_error = os.environ.get("MOBILE_UX_INSTALL_INJECT_COPY_ERROR") == "1"
        copied_count = 0

        for src_file in sorted(payload_files):
            rel_path = src_file.relative_to(source_root)
            target_file = dest_dir / rel_path
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_file, target_file)
            copied_count += 1
            if inject_error and copied_count >= 1:
                raise IOError("Injected copy failure for rollback and cleanup test")

    except (Exception, KeyboardInterrupt) as err:
        # Ownership-based cleanup on error
        if created_dest and os.path.lexists(dest_dir):
            shutil.rmtree(dest_dir, ignore_errors=True)
        if created_skills and skills_dir.exists() and not any(skills_dir.iterdir()):
            try:
                skills_dir.rmdir()
            except OSError:
                pass
        if created_agents and agents_dir.exists() and not any(agents_dir.iterdir()):
            try:
                agents_dir.rmdir()
            except OSError:
                pass

        sys.stderr.write(f"Error during installation: {err}\n")
        return 1

    print(f"Installed {SKILL_NAME} v{version} to {dest_dir}")
    return 0


def do_check_version(dest_dir: Path, source_version: str, project_root: Path) -> int:
    """Check and compare installed version with source version using semantic tuple comparison."""
    print(f"Target project: {project_root}")
    if not dest_dir.exists():
        print(f"Status: NOT_INSTALLED ({SKILL_NAME} is not installed in this project)")
        print(f"Available source version: v{source_version}")
        return 0

    if not dest_dir.is_dir() or os.path.islink(dest_dir):
        sys.stderr.write(f"Error: Installed skill destination is not a regular directory: {dest_dir}\n")
        return 2

    installed_version = extract_version(dest_dir / "SKILL.md")
    if not installed_version:
        print(f"Status: UNKNOWN_VERSION (Could not determine version of installed SKILL.md)")
        print(f"Available source version: v{source_version}")
        return 0

    print(f"Installed version: v{installed_version}")
    print(f"Available source version: v{source_version}")

    t_installed = parse_version_tuple(installed_version)
    t_source = parse_version_tuple(source_version)

    if t_installed is not None and t_source is not None:
        if t_installed < t_source:
            print(f"Status: UPDATE_AVAILABLE (A newer source version v{source_version} is available. Run with --update to update)")
        elif t_installed > t_source:
            print(f"Status: NEWER_THAN_SOURCE (Installed skill v{installed_version} is newer than source v{source_version})")
        else:
            print("Status: UP_TO_DATE (Installed skill is up to date with source)")
    else:
        if installed_version == source_version:
            print("Status: UP_TO_DATE (Installed skill is up to date with source)")
        else:
            print(f"Status: VERSION_DIFFERS (Installed version v{installed_version} differs from source v{source_version})")
    return 0


def do_update(
    dest_dir: Path,
    skills_dir: Path,
    payload_files: set[Path],
    source_root: Path,
    source_version: str,
    dry_run: bool,
) -> int:
    """Safely update existing skill installation with backup staging and atomic rollback."""
    if not dest_dir.exists():
        sys.stderr.write(
            f"Error: Destination does not exist: {dest_dir}\n"
            f"Cannot update a skill that is not installed. Run without --update to install.\n"
        )
        return 2

    if not dest_dir.is_dir() or os.path.islink(dest_dir):
        sys.stderr.write(f"Error: Destination is not a regular directory: {dest_dir}\n")
        return 2

    installed_version = extract_version(dest_dir / "SKILL.md") or "unknown"
    backup_dir = skills_dir / f".{SKILL_NAME}.bak"
    new_backup_stage = skills_dir / f".{SKILL_NAME}.bak_stage"

    if dry_run:
        print(
            f"[dry-run] Update {SKILL_NAME} from v{installed_version} to v{source_version} in {dest_dir}\n"
            f"[dry-run] Backup would be saved at {backup_dir}"
        )
        return 0

    # 1. Staged backup creation to protect pre-existing backup if copy fails
    try:
        if new_backup_stage.exists():
            shutil.rmtree(new_backup_stage)
        inject_backup_err = os.environ.get("MOBILE_UX_INSTALL_INJECT_BACKUP_ERROR") == "1"
        if inject_backup_err:
            raise IOError("Injected backup failure for regression test")
        shutil.copytree(dest_dir, new_backup_stage)
    except Exception as err:
        sys.stderr.write(f"Error creating backup before update: {err}\nPre-existing backup and installation were not modified.\n")
        if new_backup_stage.exists():
            shutil.rmtree(new_backup_stage, ignore_errors=True)
        return 1

    # Staging backup succeeded: promote it to backup_dir
    backup_prev = skills_dir / f".{SKILL_NAME}.bak_prev"
    if backup_dir.exists():
        if backup_prev.exists():
            shutil.rmtree(backup_prev)
        os.rename(backup_dir, backup_prev)

    os.rename(new_backup_stage, backup_dir)
    if backup_prev.exists():
        shutil.rmtree(backup_prev, ignore_errors=True)

    # 2. Update destination files with rollback on error or interruption
    try:
        # Clear previous payload items in dest_dir
        for item in dest_dir.iterdir():
            if item.is_dir() and not os.path.islink(item):
                shutil.rmtree(item)
            else:
                item.unlink()

        inject_error = os.environ.get("MOBILE_UX_INSTALL_INJECT_COPY_ERROR") == "1"
        inject_sigint = os.environ.get("MOBILE_UX_INSTALL_INJECT_SIGINT") == "1"
        copied_count = 0

        for src_file in sorted(payload_files):
            rel_path = src_file.relative_to(source_root)
            target_file = dest_dir / rel_path
            target_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_file, target_file)
            copied_count += 1
            if inject_sigint and copied_count >= 1:
                raise KeyboardInterrupt("Simulated user interruption (SIGINT/Ctrl+C)")
            if inject_error and copied_count >= 1:
                raise IOError("Injected copy failure for update rollback test")

    except (Exception, KeyboardInterrupt) as err:
        # Rollback immediately from backup
        is_sigint = isinstance(err, KeyboardInterrupt)
        if is_sigint:
            sys.stderr.write("Update interrupted by user. Rolling back from backup...\n")
        else:
            sys.stderr.write(f"Error during update: {err}\nRolling back from backup...\n")
        try:
            if dest_dir.exists():
                shutil.rmtree(dest_dir)
            shutil.copytree(backup_dir, dest_dir)
            sys.stderr.write(f"Automatic rollback completed successfully. Restored previous version at {dest_dir}\n")
        except Exception as rollback_err:
            sys.stderr.write(
                f"Critical error during rollback: {rollback_err}\n"
                f"Backup is still preserved at {backup_dir}\n"
            )
        return 1

    print(f"Updated {SKILL_NAME} from v{installed_version} to v{source_version} in {dest_dir}")
    print(f"Backup preserved at: {backup_dir}")
    return 0


def do_rollback(dest_dir: Path, skills_dir: Path, dry_run: bool = False) -> int:
    """Rollback skill to the backup created during last update."""
    backup_dir = skills_dir / f".{SKILL_NAME}.bak"
    if not backup_dir.exists():
        sys.stderr.write(f"Error: No backup found at {backup_dir} to rollback from.\n")
        return 2

    if not backup_dir.is_dir() or os.path.islink(backup_dir):
        sys.stderr.write(f"Error: Backup path {backup_dir} is not a valid directory.\n")
        return 2

    backup_version = extract_version(backup_dir / "SKILL.md") or "unknown"

    if dry_run:
        print(f"[dry-run] Rollback {SKILL_NAME} to v{backup_version} at {dest_dir} (from {backup_dir})")
        return 0

    # Staged restoration: copy to stage before touching dest_dir
    stage_dir = skills_dir / f".{SKILL_NAME}.rollback_stage"
    try:
        if stage_dir.exists():
            shutil.rmtree(stage_dir)
        shutil.copytree(backup_dir, stage_dir)
    except Exception as err:
        sys.stderr.write(f"Error reading backup during rollback: {err}\nDestination installation was not modified.\n")
        if stage_dir.exists():
            shutil.rmtree(stage_dir, ignore_errors=True)
        return 1

    # Stage prepared successfully: now swap safely
    dest_prev = skills_dir / f".{SKILL_NAME}.rollback_prev"
    try:
        if dest_dir.exists():
            if dest_prev.exists():
                shutil.rmtree(dest_prev)
            os.rename(dest_dir, dest_prev)
        os.rename(stage_dir, dest_dir)
        if dest_prev.exists():
            shutil.rmtree(dest_prev, ignore_errors=True)
    except Exception as swap_err:
        sys.stderr.write(f"Error swapping restored files: {swap_err}\n")
        if dest_prev.exists() and not dest_dir.exists():
            os.rename(dest_prev, dest_dir)
        return 1

    print(f"Rolled back {SKILL_NAME} to v{backup_version} at {dest_dir} (from {backup_dir})")
    return 0


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    # 1. Source verification & version extraction
    source_root = SOURCE_ROOT.resolve()
    version = extract_version(source_root / "SKILL.md")
    if not version:
        sys.stderr.write("Error: Could not extract valid version from source SKILL.md frontmatter.\n")
        return 2

    # Handle standalone --version
    if args.version:
        print(f"{SKILL_NAME} v{version}")
        return 0

    # All other actions require --project
    if not args.project:
        sys.stderr.write("Error: the following arguments are required: --project\n")
        return 2

    # Prevent mutually conflicting action flags
    action_flags = [args.check_version, args.update, args.rollback]
    if sum(bool(f) for f in action_flags) > 1:
        sys.stderr.write("Error: Cannot specify more than one of --check-version, --update, --rollback at once.\n")
        return 2

    # Validate source payload
    payload_files, payload_errors = collect_and_validate_payload(source_root)
    if payload_errors:
        sys.stderr.write("Error: Source payload validation failed:\n")
        for err in payload_errors:
            sys.stderr.write(f"  - {err}\n")
        return 2

    # Validate project and destination hierarchy
    project_root, agents_dir, skills_dir, dest_dir, proj_err = validate_project_and_parents(
        args.project, source_root
    )
    if proj_err:
        sys.stderr.write(f"Error: {proj_err}\n")
        return 2

    assert project_root is not None
    assert agents_dir is not None
    assert skills_dir is not None
    assert dest_dir is not None

    # Route action
    if args.check_version:
        return do_check_version(dest_dir, version, project_root)

    if args.rollback:
        return do_rollback(dest_dir, skills_dir, args.dry_run)

    if args.update:
        return do_update(dest_dir, skills_dir, payload_files, source_root, version, args.dry_run)

    # Default action: install
    return do_install(dest_dir, agents_dir, skills_dir, payload_files, source_root, version, args.dry_run)


if __name__ == "__main__":
    sys.exit(main())

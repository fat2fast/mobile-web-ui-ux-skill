"""Unit and integration tests for the project-local skill installer and updater."""

import hashlib
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INSTALLER = ROOT / "scripts" / "install-skill.py"
SKILL_NAME = "mobile-web-ui-ux-skill"


def source_version():
    match = re.search(r'version:\s*"([^"\n]+)"', (ROOT / "SKILL.md").read_text(encoding="utf-8"))
    assert match is not None, "Source metadata version missing"
    return match.group(1)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


class InstallSkillTest(unittest.TestCase):
    def test_help_arbitrary_cwd(self):
        result = subprocess.run(
            [sys.executable, str(INSTALLER), "--help"],
            cwd=tempfile.gettempdir(),
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn("--project", result.stdout)
        self.assertIn("--dry-run", result.stdout)
        self.assertIn("--version", result.stdout)
        self.assertIn("--check-version", result.stdout)
        self.assertIn("--update", result.stdout)
        self.assertIn("--rollback", result.stdout)

    def test_version_flag(self):
        result = subprocess.run(
            [sys.executable, str(INSTALLER), "--version"],
            cwd=tempfile.gettempdir(),
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0)
        version = source_version()
        self.assertIn(f"{SKILL_NAME} v{version}", result.stdout)

    def test_dry_run_zero_writes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "my-project"
            project.mkdir()

            result = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--dry-run"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0)
            self.assertIn("[dry-run]", result.stdout)
            self.assertIn(SKILL_NAME, result.stdout)
            self.assertIn(".agents/skills/mobile-web-ui-ux-skill", result.stdout)
            # Must write zero bytes into project
            self.assertFalse((project / ".agents").exists())

    def test_success_install_and_content_integrity(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "app"
            project.mkdir()

            result = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0)
            self.assertIn(f"Installed {SKILL_NAME}", result.stdout)

            dest = project / ".agents" / "skills" / SKILL_NAME
            self.assertTrue(dest.is_dir())

            # Payload files
            installed_files = {p.relative_to(dest): p for p in dest.rglob("*") if p.is_file()}
            self.assertIn(Path("SKILL.md"), installed_files)
            self.assertIn(Path("LICENSE"), installed_files)

            # References presence
            for ref_file in (ROOT / "references").rglob("*"):
                if ref_file.is_file():
                    rel = ref_file.relative_to(ROOT)
                    self.assertIn(rel, installed_files)

            # Source payload matches destination hashes exactly
            for rel, installed_path in installed_files.items():
                source_path = ROOT / rel
                self.assertTrue(source_path.is_file(), f"Unexpected installed file: {rel}")
                self.assertEqual(
                    sha256_file(source_path),
                    sha256_file(installed_path),
                    f"Hash mismatch on {rel}",
                )

            # Non-payload items must NOT be present
            self.assertFalse((dest / "docs").exists())
            self.assertFalse((dest / "evals").exists())
            self.assertFalse((dest / "tests").exists())
            self.assertTrue((dest / "scripts" / "pilot-evidence.py").is_file())
            self.assertFalse((dest / "scripts" / "install-skill.py").exists())
            self.assertFalse((dest / "Makefile").exists())

            # The CLI must execute from the installed payload, without a source checkout on sys.path.
            example = ROOT / "examples" / "pilot-evidence-safe" / "draft.json"
            exported = project / "pilot-sample-001"
            command = subprocess.run(
                [sys.executable, str(dest / "scripts" / "pilot-evidence.py"),
                 "export", "--input", str(example), "--out", str(exported)],
                cwd=project, capture_output=True, text=True,
            )
            self.assertEqual(command.returncode, 0, command.stderr)
            self.assertEqual(
                {p.name for p in exported.iterdir()},
                {"manifest.json", "checks.json", "report.md"},
            )
            validation = subprocess.run(
                [sys.executable, str(dest / "scripts" / "pilot-evidence.py"),
                 "validate", "--package", str(exported), "--policy", "public"],
                cwd=project, capture_output=True, text=True,
            )
            self.assertEqual(validation.returncode, 0, validation.stderr)

            # Local link closure in installed package
            for md_path in dest.rglob("*.md"):
                body = md_path.read_text(encoding="utf-8")
                for link in re.findall(r"(?<!!)\[[^\]\n]*\]\(([^\)\s]+)(?:\s+\"[^\"]*\")?\)", body):
                    if (
                        link.startswith(("http:", "https:", "mailto:", "#"))
                        or link.startswith("<")
                        or link.startswith("{")
                    ):
                        continue
                    local = link.split("#", 1)[0].split("?", 1)[0]
                    if not local:
                        continue
                    target = (md_path.parent / local).resolve()
                    self.assertTrue(
                        target.is_relative_to(dest.resolve()),
                        f"Installed link escapes package: {md_path.relative_to(dest)} -> {link}",
                    )
                    self.assertTrue(
                        target.exists(),
                        f"Installed link broken: {md_path.relative_to(dest)} -> {link}",
                    )

    def test_install_with_spaces_and_unicode_in_path(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "dự án kiểm thử (special app)"
            project.mkdir()

            result = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0)
            skill_md = project / ".agents" / "skills" / SKILL_NAME / "SKILL.md"
            self.assertTrue(skill_md.is_file())

    def test_source_independence(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "isolated-project"
            project.mkdir()

            subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project)],
                check=True,
                capture_output=True,
                text=True,
            )

            dest = project / ".agents" / "skills" / SKILL_NAME
            # Check there are no symlinks inside dest
            for p in dest.rglob("*"):
                self.assertFalse(os.path.islink(p), f"Found symlink in installed payload: {p}")

    def test_missing_and_invalid_project(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            nonexistent = Path(temp_dir) / "does-not-exist"
            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(nonexistent)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 2)
            self.assertIn("does not exist", res.stderr)

            regular_file = Path(temp_dir) / "file.txt"
            regular_file.write_text("hello", encoding="utf-8")
            res2 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(regular_file)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res2.returncode, 2)
            self.assertIn("not a directory", res2.stderr)

            # Target project is a symlink
            real_dir = Path(temp_dir) / "real_dir"
            real_dir.mkdir()
            symlink_dir = Path(temp_dir) / "symlink_dir"
            try:
                symlink_dir.symlink_to(real_dir)
                res3 = subprocess.run(
                    [sys.executable, str(INSTALLER), "--project", str(symlink_dir)],
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(res3.returncode, 2)
                self.assertIn("symlink", res3.stderr)
            except OSError:
                pass

    def test_source_overlap_rejection(self):
        # 1. Source root itself
        res1 = subprocess.run(
            [sys.executable, str(INSTALLER), "--project", str(ROOT)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(res1.returncode, 2)
        self.assertIn("cannot be the skill source repository itself", res1.stderr)

        # 2. Descendant inside source root
        descendant = ROOT / "references"
        res2 = subprocess.run(
            [sys.executable, str(INSTALLER), "--project", str(descendant)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(res2.returncode, 2)
        self.assertIn("descendant", res2.stderr)

        # 3. Ancestor of source root
        ancestor = ROOT.parent
        res3 = subprocess.run(
            [sys.executable, str(INSTALLER), "--project", str(ancestor)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(res3.returncode, 2)
        self.assertIn("ancestor", res3.stderr)

    def test_occupied_destination_rejection(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "proj"
            dest = project / ".agents" / "skills" / SKILL_NAME
            dest.mkdir(parents=True)

            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 2)
            self.assertIn("Destination already exists", res.stderr)

            # Destination exists as a file
            shutil.rmtree(dest)
            dest.write_text("existing file", encoding="utf-8")
            res2 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res2.returncode, 2)
            self.assertIn("Destination already exists", res2.stderr)

            # Destination exists as dangling symlink
            dest.unlink()
            try:
                dest.symlink_to(Path(temp_dir) / "nonexistent-target")
                res3 = subprocess.run(
                    [sys.executable, str(INSTALLER), "--project", str(project)],
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(res3.returncode, 2)
                self.assertIn("Destination already exists", res3.stderr)
            except OSError:
                pass

    def test_symlink_in_destination_parents_rejection(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "proj"
            project.mkdir()
            other_dir = Path(temp_dir) / "other"
            other_dir.mkdir()

            try:
                # .agents is a symlink
                agents_link = project / ".agents"
                agents_link.symlink_to(other_dir)
                res = subprocess.run(
                    [sys.executable, str(INSTALLER), "--project", str(project)],
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(res.returncode, 2)
                self.assertIn("cannot be a symlink", res.stderr)
                agents_link.unlink()

                # .agents/skills is a symlink
                agents_dir = project / ".agents"
                agents_dir.mkdir()
                skills_link = agents_dir / "skills"
                skills_link.symlink_to(other_dir)
                res2 = subprocess.run(
                    [sys.executable, str(INSTALLER), "--project", str(project)],
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(res2.returncode, 2)
                self.assertIn("cannot be a symlink", res2.stderr)
            except OSError:
                pass

    def test_injected_copy_failure_cleanup(self):
        # Scenario 1: Fresh project, installer creates .agents and fails -> everything cleaned up
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "proj_fresh"
            project.mkdir()

            env = dict(os.environ, MOBILE_UX_INSTALL_INJECT_COPY_ERROR="1")
            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project)],
                env=env,
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 1)
            self.assertIn("Injected copy failure", res.stderr)
            # .agents was created by installer and should have been removed
            self.assertFalse((project / ".agents").exists())

        # Scenario 2: Existing .agents and existing skill sibling -> sibling and parents preserved!
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "proj_existing"
            existing_skill = project / ".agents" / "skills" / "other-existing-skill"
            existing_skill.mkdir(parents=True)
            (existing_skill / "SKILL.md").write_text("name: other\n", encoding="utf-8")
            (project / ".agents" / "config.json").write_text("{}", encoding="utf-8")

            env = dict(os.environ, MOBILE_UX_INSTALL_INJECT_COPY_ERROR="1")
            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project)],
                env=env,
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 1)
            self.assertFalse((project / ".agents" / "skills" / SKILL_NAME).exists())
            # Existing skill and config MUST still exist
            self.assertTrue((existing_skill / "SKILL.md").is_file())
            self.assertTrue((project / ".agents" / "config.json").is_file())

    def test_check_version_older_newer_and_equal(self):
        """Finding 6 regression: distinction between older, equal, and newer installed versions."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "check_proj"
            project.mkdir()

            # 1. Not installed
            res1 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--check-version"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res1.returncode, 0)
            self.assertIn("NOT_INSTALLED", res1.stdout)
            self.assertIn(f"Available source version: v{source_version()}", res1.stdout)

            # 2. Installed matching source version
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project)], check=True)
            res2 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--check-version"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res2.returncode, 0)
            self.assertIn(f"Installed version: v{source_version()}", res2.stdout)
            self.assertIn("UP_TO_DATE", res2.stdout)

            # 3. Installed older version (0.1.0)
            dest_skill_md = project / ".agents" / "skills" / SKILL_NAME / "SKILL.md"
            dest_skill_md.write_text("---\nmetadata:\n  version: \"0.1.0\"\n---\n", encoding="utf-8")
            res3 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--check-version"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res3.returncode, 0)
            self.assertIn("Installed version: v0.1.0", res3.stdout)
            self.assertIn("UPDATE_AVAILABLE", res3.stdout)

            # 4. Installed newer version (9.0.0)
            dest_skill_md.write_text("---\nmetadata:\n  version: \"9.0.0\"\n---\n", encoding="utf-8")
            res4 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--check-version"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res4.returncode, 0)
            self.assertIn("Installed version: v9.0.0", res4.stdout)
            self.assertIn("NEWER_THAN_SOURCE", res4.stdout)
            self.assertNotIn("UPDATE_AVAILABLE", res4.stdout)

    def test_rollback_dry_run_zero_writes(self):
        """Finding 1 regression: rollback dry-run must not modify files and must print preview."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "rb_dry_proj"
            project.mkdir()

            # Install and setup note
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project)], check=True)
            dest = project / ".agents" / "skills" / SKILL_NAME
            (dest / "note.txt").write_text("before-update", encoding="utf-8")

            # Update to create backup
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project), "--update"], check=True)
            # Destination note was removed by update, add after-update note
            (dest / "note.txt").write_text("after-update", encoding="utf-8")

            # Run rollback dry-run
            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--rollback", "--dry-run"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0)
            self.assertIn("[dry-run] Rollback", res.stdout)

            # Assert destination note is STILL after-update (zero writes!)
            self.assertEqual((dest / "note.txt").read_text(encoding="utf-8"), "after-update")

    def test_rollback_preserves_installation_when_backup_is_invalid(self):
        """Finding 2 regression: invalid backup must fail without deleting destination installation."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "rb_invalid_proj"
            project.mkdir()

            # Install valid skill
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project)], check=True)
            dest = project / ".agents" / "skills" / SKILL_NAME
            (dest / "keep_me.txt").write_text("precious installation data", encoding="utf-8")

            # Place a regular file as .bak instead of directory
            backup_file = project / ".agents" / "skills" / f".{SKILL_NAME}.bak"
            backup_file.write_text("corrupted file instead of directory", encoding="utf-8")

            # Run rollback
            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--rollback"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 2)
            self.assertIn("not a valid directory", res.stderr)

            # Destination MUST remain completely intact
            self.assertTrue(dest.is_dir())
            self.assertTrue((dest / "keep_me.txt").is_file())
            self.assertEqual((dest / "keep_me.txt").read_text(encoding="utf-8"), "precious installation data")

    def test_update_failure_preserves_previous_backup(self):
        """Finding 3 regression: failure during backup stage must preserve existing recovery point."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "up_backup_preserve_proj"
            project.mkdir()

            # Install initial version with note
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project)], check=True)
            dest = project / ".agents" / "skills" / SKILL_NAME
            (dest / "first_version.txt").write_text("recovery point 1", encoding="utf-8")

            # Update 1: creates backup containing recovery point 1
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project), "--update"], check=True)
            backup_dir = project / ".agents" / "skills" / f".{SKILL_NAME}.bak"
            self.assertTrue((backup_dir / "first_version.txt").is_file())

            # Now attempt Update 2 with injected failure in backup creation
            env = dict(os.environ, MOBILE_UX_INSTALL_INJECT_BACKUP_ERROR="1")
            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--update"],
                env=env,
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 1)
            self.assertIn("Pre-existing backup and installation were not modified", res.stderr)

            # Previous backup MUST STILL EXIST and be intact!
            self.assertTrue(backup_dir.is_dir())
            self.assertTrue((backup_dir / "first_version.txt").is_file())
            self.assertEqual((backup_dir / "first_version.txt").read_text(encoding="utf-8"), "recovery point 1")

    def test_update_interruption_triggers_automatic_rollback(self):
        """Finding 5 regression: KeyboardInterrupt/SIGINT triggers automatic rollback."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "sigint_proj"
            project.mkdir()

            # Install initial version with important data
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project)], check=True)
            dest = project / ".agents" / "skills" / SKILL_NAME
            (dest / "work_in_progress.txt").write_text("critical data", encoding="utf-8")

            # Run update with simulated SIGINT/KeyboardInterrupt
            env = dict(os.environ, MOBILE_UX_INSTALL_INJECT_SIGINT="1")
            res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--update"],
                env=env,
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 1)
            self.assertIn("Update interrupted by user. Rolling back from backup", res.stderr)
            self.assertIn("Automatic rollback completed successfully", res.stderr)

            # Destination must be fully restored
            self.assertTrue((dest / "work_in_progress.txt").is_file())
            self.assertEqual((dest / "work_in_progress.txt").read_text(encoding="utf-8"), "critical data")

    def test_update_flow_with_backup_and_manual_rollback(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "update_proj"
            project.mkdir()

            # Install initial version
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project)], check=True)
            dest = project / ".agents" / "skills" / SKILL_NAME
            (dest / "SKILL.md").write_text("---\nmetadata:\n  version: \"0.1.0\"\n---\n", encoding="utf-8")
            (dest / "custom_note.txt").write_text("my custom note", encoding="utf-8")

            # Update dry-run
            dry_res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--update", "--dry-run"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(dry_res.returncode, 0)
            self.assertIn("[dry-run] Update", dry_res.stdout)
            self.assertTrue((dest / "custom_note.txt").is_file())

            # Perform real update
            up_res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--update"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(up_res.returncode, 0)
            self.assertIn(f"Updated {SKILL_NAME} from v0.1.0 to v{source_version()}", up_res.stdout)

            # Updated skill matches the source payload exactly
            self.assertEqual((ROOT / "SKILL.md").read_bytes(), (dest / "SKILL.md").read_bytes())
            self.assertFalse((dest / "custom_note.txt").exists())

            # Backup preserved with original v0.1.0 content
            backup_dir = project / ".agents" / "skills" / f".{SKILL_NAME}.bak"
            self.assertTrue(backup_dir.is_dir())
            self.assertTrue((backup_dir / "custom_note.txt").is_file())
            self.assertIn("0.1.0", (backup_dir / "SKILL.md").read_text(encoding="utf-8"))

            # Manual rollback
            rb_res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--rollback"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(rb_res.returncode, 0)
            self.assertIn(f"Rolled back {SKILL_NAME} to v0.1.0", rb_res.stdout)
            self.assertTrue((dest / "custom_note.txt").is_file())
            self.assertIn("0.1.0", (dest / "SKILL.md").read_text(encoding="utf-8"))

    def test_update_failure_triggers_automatic_rollback(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "auto_rollback_proj"
            project.mkdir()

            # Install initial version with custom note
            subprocess.run([sys.executable, str(INSTALLER), "--project", str(project)], check=True)
            dest = project / ".agents" / "skills" / SKILL_NAME
            (dest / "SKILL.md").write_text("---\nmetadata:\n  version: \"0.1.0\"\n---\n", encoding="utf-8")
            (dest / "safe_data.txt").write_text("cannot lose this", encoding="utf-8")

            # Update with injected copy error
            env = dict(os.environ, MOBILE_UX_INSTALL_INJECT_COPY_ERROR="1")
            up_res = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--update"],
                env=env,
                capture_output=True,
                text=True,
            )
            self.assertEqual(up_res.returncode, 1)
            self.assertIn("Automatic rollback completed successfully", up_res.stderr)

            # Destination MUST be restored to original state
            self.assertTrue((dest / "safe_data.txt").is_file())
            self.assertEqual((dest / "safe_data.txt").read_text(encoding="utf-8"), "cannot lose this")
            self.assertIn("0.1.0", (dest / "SKILL.md").read_text(encoding="utf-8"))

    def test_update_uninstalled_and_rollback_without_backup_rejection(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "empty_proj"
            project.mkdir()

            # Update uninstalled project -> exit 2
            res1 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--update"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res1.returncode, 2)
            self.assertIn("Cannot update a skill that is not installed", res1.stderr)

            # Rollback without backup -> exit 2
            res2 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--rollback"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res2.returncode, 2)
            self.assertIn("No backup found", res2.stderr)

            # Conflicting flags -> exit 2
            res3 = subprocess.run(
                [sys.executable, str(INSTALLER), "--project", str(project), "--update", "--rollback"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res3.returncode, 2)
            self.assertIn("Cannot specify more than one", res3.stderr)


if __name__ == "__main__":
    unittest.main()

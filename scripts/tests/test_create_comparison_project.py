"""Check that comparison projects keep reviewer material outside the skill package."""

import hashlib
import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CREATOR = ROOT / "scripts" / "create-comparison-project.py"


class ComparisonProjectTest(unittest.TestCase):
    def test_conditions_share_inputs_without_exposing_reviewer_files(self):
        with tempfile.TemporaryDirectory() as temporary:
            parent = Path(temporary)
            for condition in ("no-skill", "with-skill"):
                subprocess.run(
                    [sys.executable, str(CREATOR), "--dest", temporary, "--condition", condition],
                    check=True,
                    capture_output=True,
                    text=True,
                )

            plain = parent / "no-skill"
            skilled = parent / "with-skill"
            skill = skilled / ".agents" / "skills" / "mobile-web-ui-ux-skill"
            self.assertFalse((plain / ".agents").exists())
            self.assertEqual(
                sorted(path.relative_to(skill).parts[0] for path in skill.iterdir()),
                ["SKILL.md", "references"],
            )
            self.assertFalse((skill / "evals").exists())
            self.assertFalse((skill / "docs").exists())
            recorder = Path("scripts/archive-comparison-case.py")
            for project in (plain, skilled):
                instructions = (project / "AGENTS.md").read_text(encoding="utf-8")
                self.assertIn("--source <absolute-raw-transcript-path>", instructions)
                self.assertTrue((project / recorder).is_file())
                manifest = json.loads((project / "data-03/manifest.json").read_text(encoding="utf-8"))
                run_info = (project / "data-03/run-info.txt").read_text(encoding="utf-8")
                self.assertIn(f"Prompt SHA-256: {manifest['prompt_sha256']}", run_info)
                self.assertIn("Conversation/session locator: PENDING", run_info)
                self.assertIn(
                    f"Workspace path: /home/user/work/{project.name} (redacted)",
                    (project / "data-03/run-info.txt").read_text(encoding="utf-8"),
                )
            for document in skill.rglob("*.md"):
                body = document.read_text(encoding="utf-8")
                for destination in re.findall(r"\]\(([^)\s]+)\)", body):
                    if destination.startswith(("https:", "http:", "mailto:", "#")):
                        continue
                    target = (document.parent / destination.split("#", 1)[0]).resolve()
                    self.assertTrue(target.is_relative_to(skill.resolve()), destination)
                    self.assertTrue(target.exists(), destination)

            for case in ("data-03", "form-01", "a11y-01"):
                baseline = json.loads((plain / case / "manifest.json").read_text(encoding="utf-8"))
                candidate = json.loads((skilled / case / "manifest.json").read_text(encoding="utf-8"))
                self.assertEqual(baseline["prompt_sha256"], candidate["prompt_sha256"])
                self.assertEqual(baseline["fixture_files_sha256"], candidate["fixture_files_sha256"])
                self.assertEqual(baseline["recording_helper_sha256"], candidate["recording_helper_sha256"])
                self.assertEqual(
                    candidate["recording_helper_sha256"],
                    hashlib.sha256((skilled / recorder).read_bytes()).hexdigest(),
                )
                self.assertIsNone(baseline["skill_files_sha256"])
                self.assertIn("references/decision-contract.md", candidate["skill_files_sha256"])

    def test_recorder_copies_transcript_and_redacts_real_paths(self):
        with tempfile.TemporaryDirectory() as temporary:
            parent = Path(temporary)
            subprocess.run(
                [sys.executable, str(CREATOR), "--dest", temporary, "--condition", "with-skill"],
                check=True, capture_output=True, text=True,
            )
            project = parent / "with-skill"
            case = project / "data-03"
            raw = parent / "runtime" / "transcript.jsonl"
            raw.parent.mkdir()
            raw.write_text(
                json.dumps({"content": f"file://{project}/data-03/prompt.txt /home/private-user/log"}) + "\n",
                encoding="utf-8",
            )
            (case / "response.txt").write_text(f"See {project}/src/main.jsx\n", encoding="utf-8")
            run_info = case / "run-info.txt"
            run_info.write_text(
                run_info.read_text(encoding="utf-8")
                .replace("Workspace path: /home/user/work/with-skill (redacted)", f"Workspace path: {project}")
                .replace("Raw transcript location or availability: PENDING", f"Raw transcript location or availability: {raw}"),
                encoding="utf-8",
            )

            subprocess.run(
                [sys.executable, str(project / "scripts/archive-comparison-case.py"),
                 "--case", "data-03", "--source", str(raw)],
                check=True, capture_output=True, text=True,
            )

            archived = case / "transcript.jsonl"
            record = json.loads(archived.read_text(encoding="utf-8"))
            self.assertIn("/home/user/work/with-skill/data-03/prompt.txt", record["content"])
            self.assertIn("/home/user/log", record["content"])
            self.assertIn("/home/private-user/log", raw.read_text(encoding="utf-8"))
            self.assertIn("/home/user/work/with-skill/src/main.jsx", (case / "response.txt").read_text())
            self.assertIn("data-03/transcript.jsonl (path-redacted copy)", run_info.read_text())
            for path in (archived, case / "response.txt", run_info):
                contents = path.read_text(encoding="utf-8")
                self.assertNotIn(str(project), contents)
                self.assertNotIn(str(raw), contents)
                self.assertNotIn("private-user", contents)

    def test_recorder_without_transcript_keeps_unavailable_explicit(self):
        with tempfile.TemporaryDirectory() as temporary:
            subprocess.run(
                [sys.executable, str(CREATOR), "--dest", temporary, "--condition", "no-skill"],
                check=True, capture_output=True, text=True,
            )
            project = Path(temporary) / "no-skill"
            case = project / "form-01"
            (case / "response.txt").write_text("Advice only.\n", encoding="utf-8")
            run_info = case / "run-info.txt"
            run_info.write_text(
                run_info.read_text(encoding="utf-8").replace(
                    "Raw transcript location or availability: PENDING",
                    "Raw transcript location or availability: unavailable",
                ),
                encoding="utf-8",
            )

            subprocess.run(
                [sys.executable, str(project / "scripts/archive-comparison-case.py"),
                 "--case", "form-01"],
                check=True, capture_output=True, text=True,
            )

            self.assertFalse((case / "transcript.jsonl").exists())
            self.assertIn("Raw transcript location or availability: unavailable", run_info.read_text())

    def test_recorder_without_source_rejects_unresolved_transcript_metadata(self):
        with tempfile.TemporaryDirectory() as temporary:
            subprocess.run(
                [sys.executable, str(CREATOR), "--dest", temporary, "--condition", "no-skill"],
                check=True, capture_output=True, text=True,
            )
            project = Path(temporary) / "no-skill"
            case = project / "form-01"
            response = case / "response.txt"
            response.write_text(f"See {project}/src/main.jsx\n", encoding="utf-8")
            before_response = response.read_bytes()
            run_info = case / "run-info.txt"
            original = run_info.read_text(encoding="utf-8")
            for field in (
                "Raw transcript location or availability: PENDING",
                "",
                "Raw transcript location or availability: unavailable\nRaw transcript location or availability: unavailable",
                "Raw transcript location or availability: ",
                "Raw transcript location or availability: /home/user/logs/transcript.jsonl",
            ):
                with self.subTest(field=field):
                    run_info.write_text(
                        original.replace("Raw transcript location or availability: PENDING", field),
                        encoding="utf-8",
                    )
                    before_run_info = run_info.read_bytes()
                    result = subprocess.run(
                        [sys.executable, str(project / "scripts/archive-comparison-case.py"),
                         "--case", "form-01"],
                        capture_output=True, text=True,
                    )
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn("run-info.txt", result.stderr)
                    self.assertEqual(response.read_bytes(), before_response)
                    self.assertEqual(run_info.read_bytes(), before_run_info)
                    self.assertFalse((case / "transcript.jsonl").exists())

    def test_recorder_without_source_rejects_existing_archive(self):
        with tempfile.TemporaryDirectory() as temporary:
            subprocess.run(
                [sys.executable, str(CREATOR), "--dest", temporary, "--condition", "no-skill"],
                check=True, capture_output=True, text=True,
            )
            project = Path(temporary) / "no-skill"
            case = project / "form-01"
            response = case / "response.txt"
            response.write_text(f"See {project}/src/main.jsx\n", encoding="utf-8")
            before_response = response.read_bytes()
            run_info = case / "run-info.txt"
            run_info.write_text(
                run_info.read_text(encoding="utf-8").replace(
                    "Raw transcript location or availability: PENDING",
                    "Raw transcript location or availability: unavailable",
                ),
                encoding="utf-8",
            )
            before_run_info = run_info.read_bytes()
            archive = case / "transcript.jsonl"
            archive.write_text("{}\n", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(project / "scripts/archive-comparison-case.py"),
                 "--case", "form-01"],
                capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("transcript.jsonl already exists", result.stderr)
            self.assertEqual(response.read_bytes(), before_response)
            self.assertEqual(run_info.read_bytes(), before_run_info)
            self.assertEqual(archive.read_text(encoding="utf-8"), "{}\n")

    def test_recorder_rejects_wrong_prompt_hash_and_duplicate_case_metadata(self):
        with tempfile.TemporaryDirectory() as temporary:
            subprocess.run(
                [sys.executable, str(CREATOR), "--dest", temporary, "--condition", "with-skill"],
                check=True, capture_output=True, text=True,
            )
            project = Path(temporary) / "with-skill"
            case = project / "data-03"
            (case / "response.txt").write_text("Advice.\n", encoding="utf-8")
            run_info = case / "run-info.txt"
            before = run_info.read_bytes()
            prompt = case / "prompt.txt"
            original_prompt = prompt.read_bytes()
            prompt.write_bytes(original_prompt + b"changed\n")
            recorder = project / "scripts/archive-comparison-case.py"
            result = subprocess.run(
                [sys.executable, str(recorder), "--case", "data-03"],
                capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("prompt.txt SHA-256 does not match", result.stderr)
            self.assertEqual(run_info.read_bytes(), before)

            prompt.write_bytes(original_prompt)
            other = json.loads((project / "data-02/manifest.json").read_text(encoding="utf-8"))
            (case / "manifest.json").write_text(json.dumps(other), encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(recorder), "--case", "data-03"],
                capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("manifest case does not match", result.stderr)
            self.assertEqual(run_info.read_bytes(), before)

    def test_recorder_rejects_missing_transcript_source(self):
        with tempfile.TemporaryDirectory() as temporary:
            subprocess.run(
                [sys.executable, str(CREATOR), "--dest", temporary, "--condition", "with-skill"],
                check=True, capture_output=True, text=True,
            )
            project = Path(temporary) / "with-skill"
            case = project / "data-03"
            (case / "response.txt").write_text("Advice.\n", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(project / "scripts/archive-comparison-case.py"),
                 "--case", "data-03", "--source", str(Path(temporary) / "missing" / "transcript.jsonl")],
                capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("--source must be an existing transcript.jsonl file", result.stderr)
            self.assertFalse((case / "transcript.jsonl").exists())

    def test_recorder_does_not_rewrite_response_when_run_info_is_invalid(self):
        with tempfile.TemporaryDirectory() as temporary:
            subprocess.run(
                [sys.executable, str(CREATOR), "--dest", temporary, "--condition", "with-skill"],
                check=True, capture_output=True, text=True,
            )
            project = Path(temporary) / "with-skill"
            case = project / "data-03"
            response = case / "response.txt"
            response.write_text(f"See {project}/src/main.jsx\n", encoding="utf-8")
            before = response.read_bytes()
            (case / "run-info.txt").write_text("missing location field\n", encoding="utf-8")
            raw = Path(temporary) / "runtime" / "transcript.jsonl"
            raw.parent.mkdir()
            raw.write_text("{}\n", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(project / "scripts/archive-comparison-case.py"),
                 "--case", "data-03", "--source", str(raw)],
                capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("run-info.txt needs one raw transcript location field", result.stderr)
            self.assertEqual(response.read_bytes(), before)
            self.assertFalse((case / "transcript.jsonl").exists())


if __name__ == "__main__":
    unittest.main()

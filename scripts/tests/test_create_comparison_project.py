"""Check that comparison projects keep reviewer material outside the skill package."""

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
                self.assertIsNone(baseline["skill_files_sha256"])
                self.assertIn("references/decision-contract.md", candidate["skill_files_sha256"])


if __name__ == "__main__":
    unittest.main()

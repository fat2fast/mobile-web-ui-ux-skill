"""Offline cross-project evidence CLI contract and negative tests."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "pilot-evidence.py"
SAMPLE = ROOT / "examples" / "pilot-evidence-safe" / "draft.json"
spec = importlib.util.spec_from_file_location("pilot_evidence", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PilotEvidenceTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.data = json.loads(SAMPLE.read_text())
        self.draft = self.root / "draft.json"
        self.package = self.root / self.data["pilot_id"]

    def run_cli(self, *args, expected=0):
        p = subprocess.run([sys.executable, str(SCRIPT), *map(str, args)], capture_output=True, text=True)
        self.assertEqual(p.returncode, expected, p.stderr + p.stdout)
        return p

    def write(self):
        self.draft.write_text(json.dumps(self.data), encoding="utf-8")

    def export(self):
        self.write()
        return self.run_cli("export", "--input", self.draft, "--out", self.package)

    def test_roundtrip_digest_and_approval(self):
        self.export()
        self.assertEqual({p.name for p in self.package.iterdir()}, set(module.MEMBERS))
        p = self.run_cli("validate", "--package", self.package, "--policy", "public")
        fp = p.stdout.split("digest=")[1].split()[0]
        dest = self.root / "external-pilots"
        dest.mkdir()
        self.run_cli("import", "--package", self.package, "--destination", dest,
                     "--approved-digest", fp, expected=2)
        self.run_cli("import", "--package", self.package, "--destination", dest,
                     "--approved-digest", "0" * 64, "--approve-public", expected=2)
        self.run_cli("import", "--package", self.package, "--destination", dest,
                     "--approved-digest", fp, "--approve-public")
        self.assertIn("Status: PENDING", (dest / self.data["pilot_id"] / "review.md").read_text())
        before = (dest / self.data["pilot_id"] / "report.md").read_bytes()
        self.run_cli("import", "--package", self.package, "--destination", dest,
                     "--approved-digest", fp, "--approve-public", expected=2)
        self.assertEqual(before, (dest / self.data["pilot_id"] / "report.md").read_bytes())

    def test_deterministic_export_and_uncommitted_revision(self):
        self.export()
        original = {p.name: p.read_bytes() for p in self.package.iterdir()}
        other = self.root / "other"
        other.mkdir()
        self.run_cli("export", "--input", self.draft, "--out", other / "pilot-sample-001")
        self.assertEqual(original, {p.name: p.read_bytes() for p in (other / "pilot-sample-001").iterdir()})
        self.data["project"].update(after_sha="UNCOMMITTED", dirty_state="dirty", file_manifest_sha256="b" * 64)
        for c in self.data["checks"]:
            if c["phase"] != "before":
                c["revision"] = "UNCOMMITTED"
        self.data["pilot_id"] = "pilot-dirty-002"
        self.package = self.root / self.data["pilot_id"]
        self.export()

    def test_privacy_rejections(self):
        for bad in ("/home/privateuser/secret", r"C:\Users\privateuser\secret", "/mnt/c/Users/user/private",
                    "contact@example.org", "Bearer secret123", "https://example.org/private?q=1",
                    "file:///secret", "../private", "password=secret"):
            with self.subTest(bad=bad):
                self.data = json.loads(SAMPLE.read_text())
                self.data["decision"]["reason"] = bad
                self.write()
                self.run_cli("export", "--input", self.draft, "--out", self.package, expected=2)
                self.assertFalse(self.package.exists())

    def test_schema_and_execution_fails_closed(self):
        mutations = [
            lambda x: x.update(schema_version=2),
            lambda x: x.update(unknown={"freeform": "text"}),
            lambda x: x["skill"].update(source_sha="unknown", payload_sha256="bad"),
            lambda x: x["project"].update(after_sha="UNCOMMITTED"),
            lambda x: x["checks"][0].update(status="PASS", method="source-review"),
            lambda x: x["checks"][1].pop("evidence_ref"),
            lambda x: x["checks"][1].update(revision=x["project"]["baseline_sha"]),
            lambda x: x["checks"][3].update(status="PASS"),
            lambda x: x["checks"][2].update(id=x["checks"][1]["id"]),
            lambda x: x["checks"].pop(2),
        ]
        for modify in mutations:
            self.data = json.loads(SAMPLE.read_text())
            modify(self.data)
            self.write()
            with self.subTest(modify=modify):
                self.run_cli("export", "--input", self.draft, "--out", self.package, expected=2)
                self.assertFalse(self.package.exists())

    def test_tampering_extra_symlink_and_invalid_utf8(self):
        self.export()
        original = (self.package / "checks.json").read_bytes()
        (self.package / "checks.json").write_bytes(original + b" ")
        self.run_cli("validate", "--package", self.package, expected=2)
        (self.package / "checks.json").write_bytes(original)
        (self.package / "extra.txt").write_text("content")
        self.run_cli("validate", "--package", self.package, expected=2)
        (self.package / "extra.txt").unlink()
        (self.package / "report.md").unlink()
        (self.package / "report.md").symlink_to(self.draft)
        self.run_cli("validate", "--package", self.package, expected=2)
        (self.package / "report.md").unlink()
        (self.package / "report.md").write_bytes(b"\xff")
        self.run_cli("validate", "--package", self.package, expected=2)

    def test_symlink_ancestor_and_size_limits(self):
        link = self.root / "symlink"
        link.symlink_to(self.root, target_is_directory=True)
        self.write()
        self.run_cli("export", "--input", self.draft, "--out", link / "pilot-sample-001", expected=2)
        self.draft.write_bytes(b"X" * (module.MAX_INPUT + 1))
        self.run_cli("export", "--input", self.draft, "--out", self.package, expected=2)
        self.assertFalse(self.package.exists())

    def test_duplicate_json_property_rejected(self):
        self.draft.write_bytes(b'{"pilot_id":"one", "pilot_id":"two"}')
        self.run_cli("export", "--input", self.draft, "--out", self.package, expected=2)


if __name__ == "__main__":
    unittest.main()

"""Home path redaction must retain JSONL structure and unrelated content."""
import json
import runpy
import unittest
from pathlib import Path

redact = runpy.run_path(str(Path(__file__).resolve().parents[1] / "archive-comparison-case.py"))["redact"]


class ArchiveRedactionTest(unittest.TestCase):
    def test_jsonl_home_paths_and_nested_escaped_windows_paths(self):
        paths = [
            "/home/Example/private", "/root/.agent/log",
            "/mnt/c/Users/Example/private", "/mnt/d/users/Example/private",
            r"C:\Users\Example\private", r"d:\users\Example\private",
            "C:/Users/Example/private",
        ]
        for path in paths:
            with self.subTest(path=path):
                data = (json.dumps({"path": path, "nested": json.dumps({"path": path})}) + "\n").encode()
                result = redact(data, None)
                record = json.loads(result)
                nested = json.loads(record["nested"])
                self.assertNotIn("Example", record["path"])
                self.assertNotIn("Example", nested["path"])
                self.assertTrue(record["path"].startswith("/home/user"))
                self.assertTrue(nested["path"].startswith("/home/user"))
                self.assertIn("private" if "private" in path else ".agent", record["path"])
                self.assertEqual(redact(result, None), result)

    def test_raw_paths_and_non_home_content(self):
        data = br'C:\Users\Example\private /mnt/c/Users/Example/private /root/.agent/log'
        result = redact(data, None)
        self.assertNotIn(b"Example", result)
        self.assertNotIn(b"/root/", result)
        unchanged = b"/rooted/project /homepage/test C:\\UsersGuide\\Example https://example.test/a"
        self.assertEqual(redact(unchanged, None), unchanged)


if __name__ == "__main__":
    unittest.main()

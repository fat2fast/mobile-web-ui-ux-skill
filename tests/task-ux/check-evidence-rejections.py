#!/usr/bin/env python3
"""Exercise verifier rejection paths using copies of the executed run."""
import argparse
import copy
import json
import runpy
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--build-results", type=Path, required=True)
    parser.add_argument("--test-results", type=Path, required=True)
    parser.add_argument("--run-manifest", type=Path, required=True)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()
    build = json.loads(args.build_results.read_text(encoding="utf-8"))
    browser = json.loads(args.test_results.read_text(encoding="utf-8"))
    manifest = json.loads(args.run_manifest.read_text(encoding="utf-8"))
    verify = runpy.run_path(str(Path(__file__).with_name("verify-evidence.py")))["verify"]

    if verify(build, browser, manifest, args.sha, args.run_id, args.test_results):
        raise SystemExit("Executed run should pass before rejection checks")

    def rejected(label, mutate):
        changed_build = copy.deepcopy(build)
        changed_browser = copy.deepcopy(browser)
        changed_manifest = copy.deepcopy(manifest)
        mutate(changed_build, changed_browser, changed_manifest)
        if not verify(changed_build, changed_browser, changed_manifest,
                      args.sha, args.run_id, args.test_results):
            raise SystemExit(f"Verifier accepted {label}")

    def add_interruption(build_report, test_report, invocation):
        pending = list(test_report["suites"])
        while pending:
            suite = pending.pop()
            for spec in suite.get("specs", []):
                for test in spec.get("tests", []):
                    test.setdefault("results", []).append({"status": "interrupted"})
                    return
            pending.extend(suite.get("suites", []))
        raise SystemExit("Executed report contains no tests")

    rejected("stale build run", lambda b, t, m: b.update(run_id="old-run"))
    rejected("mismatched browser SHA", lambda b, t, m: t["provenance"].update(sha="old-sha"))
    rejected("failed build", lambda b, t, m: next(iter(b["projects"].values())).update(success=False))
    rejected("missing specs", lambda b, t, m: t.update(suites=[]))
    rejected("runner error", lambda b, t, m: t.update(errors=[{"message": "interrupted"}]))
    rejected("interrupted test", add_interruption)
    rejected("mismatched manifest", lambda b, t, m: m.update(run_id="old-run"))
    print("evidence rejection checks passed")


if __name__ == "__main__":
    main()

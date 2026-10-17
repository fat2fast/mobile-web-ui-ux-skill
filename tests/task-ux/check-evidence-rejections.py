#!/usr/bin/env python3
"""Exercise verifier rejection paths using copies of the executed run."""
import argparse
import copy
import json
import re
import runpy
import tempfile
from pathlib import Path


def suites(report):
    pending = list(report["suites"])
    while pending:
        suite = pending.pop()
        yield suite
        pending.extend(suite.get("suites", []))


def specs(report):
    for suite in suites(report):
        for spec in suite.get("specs", []):
            yield suite, spec


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
    verifier = runpy.run_path(str(Path(__file__).with_name("verify-evidence.py")))
    verify = verifier["verify"]
    required = verifier["REQUIRED_TESTS"]

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
        for _, spec in specs(test_report):
            for test in spec.get("tests", []):
                test.setdefault("results", []).append({"status": "interrupted"})
                return
        raise SystemExit("Executed report contains no tests")

    def skip_comparison_desktop(build_report, test_report, invocation):
        for _, spec in specs(test_report):
            if "desktop layout at 1280px displays full comparison matrix" in spec.get("title", ""):
                for test in spec.get("tests", []):
                    test["status"] = "skipped"
                    test["results"] = [{"status": "skipped"}]
                # Keep summary at zero to exercise nested-result validation independently.
                test_report["stats"]["skipped"] = 0
                return
        raise SystemExit("Executed report contains no comparison desktop test")

    def skip_nonmandatory_spec(build_report, test_report, invocation):
        for _, spec in specs(test_report):
            if spec.get("title") == "baseline handles plan selection action":
                for test in spec.get("tests", []):
                    test["status"] = "skipped"
                    test["results"] = [{"status": "skipped"}]
                test_report["stats"]["skipped"] = 0
                return
        raise SystemExit("Executed report contains no optional-title baseline test")

    def remove_comparison_desktop(build_report, test_report, invocation):
        for suite in suites(test_report):
            suite["specs"] = [
                spec for spec in suite.get("specs", [])
                if "desktop layout at 1280px displays full comparison matrix" not in spec.get("title", "")
            ]

    rejected("skipped summary", lambda b, t, m: t["stats"].update(skipped=1))
    rejected("skipped comparison desktop result", skip_comparison_desktop)
    rejected("skipped test outside required title set", skip_nonmandatory_spec)
    rejected("missing comparison desktop test", remove_comparison_desktop)
    rejected("stale build run", lambda b, t, m: b.update(run_id="old-run"))
    rejected("mismatched browser SHA", lambda b, t, m: t["provenance"].update(sha="old-sha"))
    rejected("failed build", lambda b, t, m: next(iter(b["projects"].values())).update(success=False))
    rejected("missing specs", lambda b, t, m: t.update(suites=[]))
    rejected("runner error", lambda b, t, m: t.update(errors=[{"message": "interrupted"}]))
    rejected("interrupted test", add_interruption)
    rejected("mismatched manifest", lambda b, t, m: m.update(run_id="old-run"))
    def selected(report, check_id):
        pattern = required[check_id][2]
        return next((suite, spec) for suite, spec in specs(report) if re.search(pattern, spec.get("title", "")))

    def missing_contrast(b, t, m):
        suite, spec = selected(t, "contrast order")
        suite["specs"].remove(spec)

    def skip_check(check_id):
        def mutate(b, t, m):
            _, spec = selected(t, check_id)
            for test in spec["tests"]:
                test.update(status="skipped", results=[{"status": "skipped"}])
            t["stats"]["skipped"] = 0
        return mutate

    def wrong_source(b, t, m):
        suite, spec = selected(t, "contrast order")
        suite["specs"].remove(spec)
        copied = copy.deepcopy(spec)
        copied["file"] = "order.spec.cjs"
        suite["specs"].append(copied)

    def wrong_project(b, t, m):
        _, spec = selected(t, "contrast order")
        for test in spec["tests"]:
            test["projectName"] = "wrong-browser"

    def missing_attachment(b, t, m):
        _, spec = selected(t, "contrast order")
        spec["tests"][0]["results"][-1]["attachments"] = []

    rejected("missing contrast outcome", missing_contrast)
    rejected("skipped a11y outcome", skip_check("a11y form"))
    rejected("skipped negative probe", skip_check("focus probe"))
    rejected("matching title copied into wrong spec", wrong_source)
    rejected("matching title copied into wrong project", wrong_project)
    rejected("missing ux-evidence attachment", missing_attachment)

    # Mutate copies of the native attachment, never synthesize replacement good evidence.
    root = Path(manifest["artifacts"]).resolve()
    with tempfile.TemporaryDirectory(prefix="rejection-probes-", dir=root) as temporary:
        scratch = Path(temporary)
        def corrupt_attachment(label, mutate):
            def change(b, t, m):
                _, spec = selected(t, "contrast order")
                attachments = spec["tests"][0]["results"][-1]["attachments"]
                attachment = next(a for a in attachments if a["name"] == "ux-evidence")
                record = json.loads(Path(attachment["path"]).read_text(encoding="utf-8"))
                mutate(record)
                target = scratch / "record.json"
                target.write_text(json.dumps(record), encoding="utf-8")
                attachment["path"] = str(target)
            rejected(label, change)

        corrupt_attachment("stale attachment run", lambda r: r.update(run_id="stale"))
        corrupt_attachment("attachment source mismatch", lambda r: r.update(sha="wrong"))
        corrupt_attachment("attachment check mismatch", lambda r: r.update(check_id="a11y form"))
        corrupt_attachment("failed state oracle", lambda r: r.update(state_oracle="not-run"))
        corrupt_attachment("unresolved disposition", lambda r: r.update(disposition="review required"))
        corrupt_attachment("missing referenced file", lambda r: r["artifacts"][0].update(relative_path="missing-screenshot.png"))
        corrupt_attachment("wrong artifact hash", lambda r: r["artifacts"][0].update(sha256="0" * 64))
        def changed_content(record):
            original = root / record["artifacts"][0]["relative_path"]
            target = scratch / "changed.png"
            target.write_bytes(original.read_bytes() + b"changed")
            record["artifacts"][0]["relative_path"] = target.relative_to(root).as_posix()
        corrupt_attachment("changed artifact bytes", changed_content)
        corrupt_attachment("path traversal", lambda r: r["artifacts"][0].update(relative_path="../outside.png"))
        with tempfile.TemporaryDirectory(prefix="outside-ux-evidence-") as outside:
            target = Path(outside) / "outside.png"
            target.write_bytes(b"outside")
            link = scratch / "escape.png"
            link.symlink_to(target)
            corrupt_attachment("symlink escape", lambda r: r["artifacts"][0].update(relative_path=link.relative_to(root).as_posix()))
    print("evidence rejection checks passed")


if __name__ == "__main__":
    main()

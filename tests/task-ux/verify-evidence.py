#!/usr/bin/env python3
"""Verify current-run build and browser evidence for mandatory task outcomes."""
import argparse
import json
import re
from datetime import datetime, timedelta
from pathlib import Path

PROJECTS = {
    'evals/fixtures/order-dashboard', 'evals/fixtures/mobile-form',
    'evals/fixtures/comparison-table', 'evals/fixtures/request-form',
    'evals/implementations/task-first/order-dashboard',
    'evals/implementations/task-first/comparison-table',
    'evals/implementations/task-first/request-form',
}

REQUIRED_TESTS = {
    "order navigation": r"mobile navigation is reachable and dismisses",
    "order selection": r"selection, details, empty recovery and hidden selected orders",
    "order long list": r"bulk selection remains reachable with a 20-record test data variant",
    "order alternate markup": r"task journey accepts a semantic section",
    "order lost action probe": r"task assertions expose a seeded lost action",
    "order drawer probe": r"task assertions expose a seeded inaccessible drawer",
    "order checkbox probe": r"task assertions expose a seeded checkbox detail misfire",
    "order long label and boundary": r"long customer labels stay within the record",
    "order touch targets": r"mobile record controls have 44px hit regions",
    "order desktop": r"desktop table layout is preserved at 1280px",
    "order action reachability 320": r"primary task at 320px requires 0px horizontal scrolling",
    "order action reachability 390": r"primary task at 390px requires 0px horizontal scrolling",
    "order invariants": r"mobile search, detail, filter, sort, export, selection invariants",
    "comparison semantics": r"all metrics, units, and plan selection actions are preserved",
    "comparison scroll 320": r"comparison table at 320px preserves alignment",
    "comparison scroll 390": r"comparison table at 390px preserves alignment",
    "comparison desktop": r"desktop layout at 1280px displays full comparison matrix",
    "form baseline metadata rejection": r"baseline rejects JSON attachment metadata",
    "form implementation metadata rejection": r"implementation rejects JSON attachment metadata",
    "comparison keyboard": r"keyboard traversal navigates cells and triggers plan selection",
    "form manual date": r"manual date typing, reactive days derivation",
    "form native date": r"native date controls synchronize with manual ISO inputs",
    "form calendar validation": r"enforces calendar date validity and range bounds",
    "form reversed date": r"reversed dates are rejected by the server",
    "form network error": r"network error receives logical focus",
    "form file validation": r"enforces file type constraints, handles unsupported file",
    "form oversized file": r"oversized attachment remains server validated",
    "form recovery and bytes": r"touch file delivery, real byte transmission, error recovery",
    "form clearance 320": r"viewport 320px has zero horizontal overflow",
    "form clearance 375": r"viewport 375px has zero horizontal overflow",
    "form clearance 390": r"viewport 390px has zero horizontal overflow",
    "form clearance 430": r"viewport 430px has zero horizontal overflow",
}


def passed_titles(suites):
    titles = []
    for suite in suites:
        for spec in suite.get("specs", []):
            for test in spec.get("tests", []):
                if test.get("status") == "expected" and any(
                    result.get("status") == "passed" for result in test.get("results", [])
                ):
                    titles.append(spec.get("title", ""))
        titles.extend(passed_titles(suite.get("suites", [])))
    return titles


def has_result_status(suites, status):
    for suite in suites:
        for spec in suite.get("specs", []):
            for test in spec.get("tests", []):
                if test.get("status") == status or any(
                    result.get("status") == status for result in test.get("results", [])
                ):
                    return True
        if has_result_status(suite.get("suites", []), status):
            return True
    return False


def verify(build, browser, manifest, sha, run_id, results_path):
    errors = []
    for name, metadata in (("build", build), ("browser", browser.get("provenance", {}))):
        if metadata.get("sha") != sha or metadata.get("run_id") != run_id:
            errors.append(f"{name} SHA/run mismatch")
        if not metadata.get("generated_at"):
            errors.append(f"{name} timestamp missing")
    if (manifest.get("sha") != sha or manifest.get("run_id") != run_id
            or manifest.get("results") != str(results_path.resolve())
            or browser.get("provenance", {}).get("started_at") != manifest.get("started_at")):
        errors.append("Browser invocation manifest mismatch")
    try:
        started = datetime.fromisoformat(manifest["started_at"])
        test_started = datetime.fromisoformat(browser["stats"]["startTime"].replace("Z", "+00:00"))
        stamped = datetime.fromisoformat(browser["provenance"]["generated_at"])
        if not started - timedelta(seconds=2) <= test_started <= stamped:
            errors.append("Browser execution time is outside this run")
    except (KeyError, ValueError, TypeError):
        errors.append("Browser execution timestamps missing or invalid")

    projects = build.get("projects", {})
    if set(projects) != set(PROJECTS):
        errors.append("Current-run build project set is incomplete or unexpected")
    for name, result in projects.items():
        if result.get("success") is not True or result.get("exit_code") != 0:
            errors.append(f"Build failed: {name}")

    stats = browser.get("stats", {})
    if stats.get("unexpected") != 0 or browser.get("errors") or has_result_status(browser.get("suites", []), "interrupted"):
        errors.append("Playwright has unexpected failures, runner errors or interruptions")
    if stats.get("skipped") != 0 or has_result_status(browser.get("suites", []), "skipped"):
        errors.append("Full task suite must not contain skipped tests")
    titles = passed_titles(browser.get("suites", []))
    for item, pattern in REQUIRED_TESTS.items():
        if not any(re.search(pattern, title) for title in titles):
            errors.append(f"Missing passed browser test for {item}")
    return errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--build-results", type=Path, required=True)
    parser.add_argument("--test-results", type=Path, required=True)
    parser.add_argument("--run-manifest", type=Path, required=True)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()
    try:
        build = json.loads(args.build_results.read_text(encoding="utf-8"))
        browser = json.loads(args.test_results.read_text(encoding="utf-8"))
        manifest = json.loads(args.run_manifest.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise SystemExit(f"Evidence file missing or invalid: {exc}") from exc
    errors = verify(build, browser, manifest, args.sha, args.run_id, args.test_results)
    if errors:
        raise SystemExit("Evidence verification failed:\n - " + "\n - ".join(errors))
    print(f"evidence complete for {args.sha} / {args.run_id}: {len(passed_titles(browser['suites']))} passed specs")


if __name__ == "__main__":
    main()

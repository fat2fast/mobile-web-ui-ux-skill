#!/usr/bin/env python3
"""Verify automated evidence completeness for Task-First Mobile UX Improvement.

Checks that every mandatory automated acceptance item has an executed PASS result,
verifies test execution against artifacts/test-results.json, checks fixture builds
against artifacts/build-results.json, validates that all cited files exist on disk,
and verifies structural integrity via scripts/validate_skill.py.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
EVIDENCE_FILE = ROOT / "tests/reports/task-ux-evidence.md"
TEST_RESULTS_FILE = ROOT / "tests/task-ux/artifacts/test-results.json"
BUILD_RESULTS_FILE = ROOT / "tests/task-ux/artifacts/build-results.json"
VALIDATE_SKILL_SCRIPT = ROOT / "scripts/validate_skill.py"

MANDATORY_AUTOMATED = [
    "ORDER-MOBILE-FIT",
    "ORDER-INVARIANTS",
    "ORDER-DESKTOP",
    "COMPARISON-SEMANTICS",
    "COMPARISON-SCROLL-STICKY",
    "COMPARISON-SELECTION",
    "REQUEST-DATE-INPUT",
    "REQUEST-VALIDATION",
    "REQUEST-ERROR-RECOVERY",
    "REQUEST-RESUBMIT",
    "REQUEST-CTA-CLEARANCE",
    "FIXTURE-BUILDS",
    "STRUCTURAL-VALIDATION",
]

OPTIONAL_MANUAL = [
    "PHYSICAL-KEYBOARD-TEST",
    "HUMAN-TASK-WALKTHROUGH",
]

# Map mandatory item to required test title patterns in test-results.json
ITEM_TEST_PATTERNS = {
    "ORDER-MOBILE-FIT": [
        r"primary task at 320px requires 0px horizontal scrolling",
        r"primary task at 390px requires 0px horizontal scrolling",
    ],
    "ORDER-INVARIANTS": [
        r"mobile search, detail, filter, sort, export, selection invariants succeed",
        r"baseline preserves search, detail, filter, sort, export, selection invariants",
    ],
    "ORDER-DESKTOP": [
        r"desktop table layout is preserved at 1280px",
    ],
    "COMPARISON-SEMANTICS": [
        r"all metrics, units, and plan selection actions are preserved",
    ],
    "COMPARISON-SCROLL-STICKY": [
        r"comparison table at 320px preserves alignment, sticky labels and scroll cues",
        r"comparison table at 390px preserves alignment, sticky labels and scroll cues",
    ],
    "COMPARISON-SELECTION": [
        r"keyboard traversal navigates cells and triggers plan selection",
        r"baseline handles plan selection action",
    ],
    "REQUEST-DATE-INPUT": [
        r"manual date typing, reactive days derivation, and range validation work",
    ],
    "REQUEST-VALIDATION": [
        r"enforces calendar date validity and range bounds \(2026-2027\) with auto-focus",
        r"enforces file type constraints, handles unsupported file with accessible inline error",
    ],
    "REQUEST-ERROR-RECOVERY": [
        r"touch file delivery, real byte transmission, error recovery, focus shift, and resubmission",
    ],
    "REQUEST-RESUBMIT": [
        r"touch file delivery, real byte transmission, error recovery, focus shift, and resubmission",
    ],
    "REQUEST-CTA-CLEARANCE": [
        r"zero horizontal overflow and clear geometric CTA clearance at reduced height",
        r"baseline submit button uses fixed positioning that risks viewport occlusion at reduced height",
    ],
}


def main() -> int:
    errors: list[str] = []

    # 1. Evidence file existence and markdown checks
    if not EVIDENCE_FILE.is_file():
        print(f"FAIL: Evidence file missing: {EVIDENCE_FILE}")
        return 1

    content = EVIDENCE_FILE.read_text(encoding="utf-8")

    for item in MANDATORY_AUTOMATED:
        pattern = rf"`{item}\s*\|\s*PASS`"
        if not re.search(pattern, content):
            errors.append(f"Mandatory automated item {item} is not marked PASS in evidence table")

    for item in OPTIONAL_MANUAL:
        pattern = rf"`{item}\s*\|\s*(PASS|NOT RUN)`"
        if not re.search(pattern, content):
            errors.append(f"Manual item {item} is missing or has invalid status")

    for line in content.splitlines():
        if "| FAIL" in line:
            errors.append(f"Found failing item in evidence: {line.strip()}")

    # 2. Verify all cited artifact paths exist on disk
    cited_paths = set(re.findall(r"`((?:tests|evals|plans|scripts)/[^`]+)`", content))
    for rel_path in cited_paths:
        p = ROOT / rel_path
        if not p.exists():
            errors.append(f"Cited evidence artifact missing on disk: {rel_path}")
        elif p.is_file() and p.stat().st_size == 0:
            errors.append(f"Cited evidence artifact is empty (0 bytes): {rel_path}")

    # 3. Verify Playwright test results
    if not TEST_RESULTS_FILE.is_file():
        errors.append(f"Playwright test-results.json missing at {TEST_RESULTS_FILE}")
    else:
        try:
            results_data = json.loads(TEST_RESULTS_FILE.read_text(encoding="utf-8"))
            stats = results_data.get("stats", {})
            unexpected = stats.get("unexpected", 0)
            expected = stats.get("expected", 0)

            if unexpected > 0:
                errors.append(f"Playwright test run has {unexpected} unexpected failures")
            if expected < 24:
                errors.append(f"Playwright test run has only {expected} passed tests (expected >= 24)")

            passed_titles: list[str] = []

            def collect_specs(suite_obj):
                for spec in suite_obj.get("specs", []):
                    for t in spec.get("tests", []):
                        for res in t.get("results", []):
                            if res.get("status") == "passed":
                                passed_titles.append(spec.get("title", ""))
                for child_suite in suite_obj.get("suites", []):
                    collect_specs(child_suite)

            for top_suite in results_data.get("suites", []):
                collect_specs(top_suite)

            for item, patterns in ITEM_TEST_PATTERNS.items():
                for pat in patterns:
                    matched = any(re.search(pat, title) for title in passed_titles)
                    if not matched:
                        errors.append(f"No passed test found in test-results.json for {item} (pattern: {pat})")

        except Exception as e:
            errors.append(f"Failed to parse test-results.json: {e}")

    # 4. Verify Fixture and Implementation builds
    if not BUILD_RESULTS_FILE.is_file():
        errors.append(f"Build results missing at {BUILD_RESULTS_FILE}")
    else:
        try:
            build_data = json.loads(BUILD_RESULTS_FILE.read_text(encoding="utf-8"))
            if build_data.get("status") != "ok":
                errors.append(f"Build results status is not ok: {build_data.get('status')}")
            projects = build_data.get("projects", {})
            if len(projects) < 6:
                errors.append(f"Expected 6 projects in build-results.json, found {len(projects)}")
            for proj, pinfo in projects.items():
                if not pinfo.get("success") or pinfo.get("exit_code") != 0:
                    errors.append(f"Project build failed: {proj}")
        except Exception as e:
            errors.append(f"Failed to parse build-results.json: {e}")

    # 5. Verify structural validation
    try:
        proc = subprocess.run([sys.executable, str(VALIDATE_SKILL_SCRIPT)], capture_output=True, text=True)
        if proc.returncode != 0:
            errors.append(f"validate_skill.py failed with exit code {proc.returncode}:\n{proc.stderr or proc.stdout}")
    except Exception as e:
        errors.append(f"Failed to run validate_skill.py: {e}")

    if errors:
        print("FAIL: Verification evidence incomplete or invalid:")
        for err in errors:
            print(" -", err)
        return 1

    print("evidence complete")
    return 0


if __name__ == "__main__":
    sys.exit(main())
#!/usr/bin/env python3
"""Verify current-run build and browser evidence for mandatory task outcomes."""
import argparse
import hashlib
import json
import re
from datetime import datetime, timedelta
from pathlib import Path

PROJECTS = {
    "evals/fixtures/navigation",
    "evals/implementations/task-first/navigation",
    "evals/fixtures/catalog",
    "evals/implementations/task-first/catalog",
    'evals/fixtures/order-dashboard', 'evals/fixtures/mobile-form',
    'evals/fixtures/comparison-table', 'evals/fixtures/request-form',
    'evals/implementations/task-first/order-dashboard',
    'evals/implementations/task-first/comparison-table',
    'evals/implementations/task-first/request-form',
}

REQUIRED_TITLE_PATTERNS = {
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


# Each mandatory outcome is bound to its owning source and browser project.
REQUIRED_TESTS = {
    key: ("tests/task-ux/" + ("order.spec.cjs" if key.startswith("order ") else "comparison.spec.cjs" if key.startswith("comparison ") else "request-form.spec.cjs"), "chromium", pattern)
    for key, pattern in REQUIRED_TITLE_PATTERNS.items()
}
REQUIRED_TESTS.update({
    "contrast helper": ("tests/task-ux/contrast.spec.cjs", "chromium", r"^contrast helper reference and boundary assertions$"),
    **{f"contrast {name}": ("tests/task-ux/contrast.spec.cjs", "chromium", rf"^rendered contrast matrix {name}$") for name in ("order", "comparison", "form")},
    **{f"a11y {name}": ("tests/task-ux/accessibility.spec.cjs", "chromium", rf"^scoped accessibility states {name}$") for name in ("order", "comparison", "form")},
    "contrast probe": ("tests/task-ux/accessibility.spec.cjs", "chromium", r"^negative probe detects insufficient rendered text contrast$"),
    "color probe": ("tests/task-ux/accessibility.spec.cjs", "chromium", r"^negative probe detects color-only status$"),
    "focus probe": ("tests/task-ux/accessibility.spec.cjs", "chromium", r"^negative probe detects removed keyboard focus indicator$"),
    "inactive boundary": ("tests/task-ux/accessibility.spec.cjs", "chromium", r"^inactive exception does not exempt essential enabled borders$"),
    "order unobscured controls": ("tests/task-ux/accessibility.spec.cjs", "chromium", r"^order selection action row leaves record controls unobscured$"),
})
REQUIRED_TESTS.update({
    **{f"catalog task {width}": ("tests/task-ux/catalog.spec.cjs", "chromium", rf"^catalog workflow at {width}px preserves exact product information$") for width in (320,390,1280)},
    "catalog rendered states": ("tests/task-ux/catalog.spec.cjs", "chromium", r"^catalog rendered contrast and accessibility states$"),
})
REQUIRED_TESTS.update({
    **{f"navigation task {width}": ("tests/task-ux/navigation.spec.cjs", "chromium", rf"^navigation workflow at {width}px preserves edit and browser history$") for width in (320,390,1280)},
    "navigation routes and roles": ("tests/task-ux/navigation.spec.cjs", "chromium", r"^navigation direct links refresh and local role guards$"),
    "navigation rendered states": ("tests/task-ux/navigation.spec.cjs", "chromium", r"^navigation rendered accessibility and keyboard states$"),
})
REQUIRED_TESTS.update({
    f"pwa {name}": ("tests/task-ux/pwa-browser.spec.cjs", "chromium", f"^{re.escape(name)}$")
    for name in (
        'manifest, worker scope, history and deep link',
        'offline fallback, mutations and same-context account isolation',
        'offline fallback ignores unrelated cache entries',
        'worker rejects private or redirected precache responses',
        'simulated standalone keeps navigation and manifest scope rules',
        'HTTP cache negative control detects stale account content',
        'waiting update preserves draft and cleans only owned caches',
        'permission requires a gesture and notification targets stay in scope',
        'install offer is event gated and dismissible without blocking task',
        'notification denied fallback', 'notification unsupported fallback',
        'revoked permission and absent subscription do not claim delivery',
        'saving does not discard edits made while the request is pending',
        'stale CSRF is rejected and a current PUT reaches the server',
        *(f'task and overlay remain usable at {width}px' for width in (320, 390, 1280)),
    )
})
VISUAL_STATES = {"orders": ("selected-empty", "long-label"), "comparison": ("selected",),
                 "form": ("server-error-selected", "success"), "catalog": ("selected-empty",),
                 "navigation": ("edit-error", "long-detail", "restricted")}
VISUAL_IDS = {f"normal-{name}-{width}": rf"^visual normal {name} {width}$"
              for name in VISUAL_STATES for width in (320,375,390,430,1280)}
VISUAL_IDS.update({f"{name}-{state}-{width}": rf"^visual state {name} {state} {width}$"
                   for name, states in VISUAL_STATES.items() for state in states for width in (390,1280)})
REQUIRED_TESTS.update({"visual " + key: ("tests/task-ux/visual-states.spec.cjs", "chromium", pattern)
                       for key, pattern in VISUAL_IDS.items()})
REQUIRED_TESTS.update({"resize proxies " + name: ("tests/task-ux/visual-states.spec.cjs", "chromium", rf"^reflow and text resize proxies {name}$") for name in VISUAL_STATES})
REQUIRED_TESTS["visual action probe"] = ("tests/task-ux/visual-states.spec.cjs", "chromium", r"^visual negative probe detects a hidden required action$")
REQUIRED_TESTS["order responsive containment"] = ("tests/task-ux/visual-states.spec.cjs", "chromium", r"^order long-content and desktop scrolling contracts$")
ATTACHED_CHECKS = {key for key, (spec, _, _) in REQUIRED_TESTS.items()
                   if spec.endswith(("contrast.spec.cjs", "accessibility.spec.cjs", "catalog.spec.cjs", "navigation.spec.cjs", "visual-states.spec.cjs"))}
ROOT = Path(__file__).resolve().parents[2]


def passed_outcomes(suites, root_dir):
    outcomes = []
    for suite in suites:
        for spec in suite.get("specs", []):
            file = (Path(root_dir) / spec.get("file", suite.get("file", ""))).resolve()
            source = file.relative_to(ROOT).as_posix() if file.is_relative_to(ROOT) else "outside-repo"
            for test in spec.get("tests", []):
                results = test.get("results", [])
                if (test.get("status") == "expected" and test.get("expectedStatus") == "passed"
                        and results and results[-1].get("status") == "passed"):
                    outcomes.append({"file": source, "project": test.get("projectName"),
                                     "title": spec.get("title", ""),
                                     "attachments": results[-1].get("attachments", [])})
        outcomes.extend(passed_outcomes(suite.get("suites", []), root_dir))
    return outcomes


def contained_file(path, root):
    resolved = Path(path).resolve(strict=True)
    if not resolved.is_relative_to(root) or not resolved.is_file():
        raise ValueError("artifact escapes run root or is not a file")
    return resolved


def verify_attachment(outcome, check_id, artifact_root, sha, run_id):
    attachments = [a for a in outcome["attachments"] if a.get("name") == "ux-evidence"]
    if len(attachments) != 1:
        return [f"{check_id}: exactly one ux-evidence attachment required"]
    try:
        attachment = attachments[0]
        if attachment.get("contentType") != "application/json":
            raise ValueError("attachment is not JSON")
        file = contained_file(attachment["path"], artifact_root)
        record = json.loads(file.read_text(encoding="utf-8"))
        if (record.get("schema_version") != 1 or record.get("check_id") != check_id
                or record.get("sha") != sha or record.get("run_id") != run_id):
            raise ValueError("attachment schema/check/source/run mismatch")
        if record.get("state_oracle") != "passed" or record.get("disposition") != "PASS":
            raise ValueError("state oracle or disposition did not pass")
        for key in ("state", "trigger", "criterion"):
            if not isinstance(record.get(key), str) or not record[key].strip():
                raise ValueError(f"missing {key}")
        viewport = record.get("viewport", {})
        if not all(isinstance(viewport.get(k), int) and viewport[k] > 0 for k in ("width", "height")):
            raise ValueError("invalid viewport")
        if not isinstance(record.get("measurements"), list) or not record["measurements"]:
            raise ValueError("measurements missing")
        if not isinstance(record.get("artifacts"), list) or not record["artifacts"]:
            raise ValueError("artifact references missing")
        for artifact in record["artifacts"]:
            relative = Path(artifact["relative_path"])
            if relative.is_absolute() or ".." in relative.parts:
                raise ValueError("unsafe relative artifact path")
            target = contained_file(artifact_root / relative, artifact_root)
            if not artifact.get("kind") or hashlib.sha256(target.read_bytes()).hexdigest() != artifact.get("sha256"):
                raise ValueError("referenced artifact content/hash mismatch")
        if check_id.startswith("visual ") and check_id != "visual action probe":
            snapshot = record.get("snapshot", {})
            snapshot_id = check_id.removeprefix("visual ")
            if snapshot.get("snapshot_id") != snapshot_id:
                raise ValueError("snapshot identity mismatch")
            registry = json.loads((ROOT / "tests/task-ux/visual-baselines.json").read_text(encoding="utf-8"))
            matches = [entry for entry in registry["baselines"] if entry.get("snapshot_id") == snapshot_id]
            if len(matches) != 1:
                raise ValueError("missing or ambiguous reviewed baseline")
            approved = matches[0]
            if approved.get("verdict") != "approved" or not approved.get("reviewer", "").strip():
                raise ValueError("baseline lacks reviewer approval")
            for key in ("path", "sha256", "environment"):
                if snapshot.get(key) != approved.get(key):
                    raise ValueError("baseline hash/path/environment mismatch")
            font_files = record["measurements"][0]["font_files"]
            expected_fonts = []
            for name, weight, postscript in (("DejaVuSans.ttf",400,"DejaVuSans"),("DejaVuSans-Bold.ttf",700,"DejaVuSans-Bold")):
                font_hash = hashlib.sha256((ROOT / "tests/task-ux/fonts" / name).read_bytes()).hexdigest()
                expected_fonts.append({"file":name,"weight":weight,"postScriptName":postscript,"sha256":font_hash})
            if font_files != expected_fonts:
                raise ValueError("snapshot font bytes mismatch")
            font_identity = hashlib.sha256(json.dumps(expected_fonts,separators=(",", ":")).encode()).hexdigest()
            used_fonts = record["measurements"][0]["browser_used_fonts"]
            if not used_fonts or any(not font.get("isCustomFont") or font.get("postScriptName") not in {f["postScriptName"] for f in expected_fonts} for font in used_fonts):
                raise ValueError("browser used unpinned fonts")
            expected_environment = "linux-chromium-" + record["browser"]["version"] + "-dejavu-" + font_identity
            if snapshot["environment"] != expected_environment:
                raise ValueError("snapshot environment differs from executed browser")
            baseline_path = Path(approved["path"])
            if baseline_path.is_absolute() or ".." in baseline_path.parts:
                raise ValueError("unsafe baseline path")
            baseline = contained_file(ROOT / baseline_path, ROOT / "tests/task-ux/visual-states.spec.cjs-snapshots")
            if hashlib.sha256(baseline.read_bytes()).hexdigest() != approved["sha256"]:
                raise ValueError("reviewed baseline bytes changed")
            if snapshot["actual_path"] == snapshot["expected_path"]:
                raise ValueError("actual and expected must be distinct native files")
            for key in ("actual_path", "expected_path"):
                relative = Path(snapshot[key])
                if relative.is_absolute() or ".." in relative.parts:
                    raise ValueError("unsafe visual artifact path")
                visual_file = contained_file(artifact_root / relative, artifact_root)
                if not any(item["relative_path"] == relative.as_posix() for item in record["artifacts"]):
                    raise ValueError("visual file lacks native artifact reference")
                if hashlib.sha256(visual_file.read_bytes()).hexdigest() != approved["sha256"]:
                    raise ValueError("actual/expected pixels differ from zero-tolerance reviewed reference")
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as exc:
        return [f"{check_id}: invalid attachment: {exc}"]
    return []


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
    config = browser.get("config", {})
    root_dir = Path(config.get("rootDir", ".")).resolve()
    if root_dir != ROOT / "tests/task-ux":
        errors.append("Browser source root mismatch")
    outcomes = passed_outcomes(browser.get("suites", []), root_dir)
    artifact_root = Path(manifest.get("artifacts", ".")).resolve()
    if not manifest.get("artifacts") or artifact_root == ROOT or not artifact_root.is_dir():
        errors.append("Run artifact root missing or invalid")
    project_roots = {p.get("name"): Path(p.get("outputDir", ".")).resolve() for p in config.get("projects", [])}
    for item, (file, project, pattern) in REQUIRED_TESTS.items():
        matches = [o for o in outcomes if o["file"] == file and o["project"] == project and re.search(pattern, o["title"])]
        if not matches:
            errors.append(f"Missing passed browser test for {item}")
        elif item in ATTACHED_CHECKS:
            if project_roots.get(project) != artifact_root:
                errors.append(f"{item}: project output root differs from run manifest")
            if len(matches) != 1:
                errors.append(f"{item}: ambiguous mandatory outcome")
            else:
                errors.extend(verify_attachment(matches[0], item, artifact_root, sha, run_id))
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
    print(f"evidence complete for {args.sha} / {args.run_id}: {len(passed_outcomes(browser['suites'], browser['config']['rootDir']))} passed specs")


if __name__ == "__main__":
    main()

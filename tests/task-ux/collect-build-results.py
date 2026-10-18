#!/usr/bin/env python3
"""Collect build results from this CI run or run the builds locally."""
import argparse
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROJECTS = [
    "evals/fixtures/navigation",
    "evals/implementations/task-first/navigation",
    "evals/fixtures/catalog",
    "evals/implementations/task-first/catalog",
    "evals/fixtures/order-dashboard",
    "evals/fixtures/mobile-form",
    "evals/fixtures/comparison-table",
    "evals/fixtures/request-form",
    "evals/implementations/task-first/order-dashboard",
    "evals/implementations/task-first/comparison-table",
    "evals/implementations/task-first/request-form",
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sha", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--output", type=Path, required=True)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--input-dir", type=Path)
    source.add_argument("--build-local", action="store_true")
    args = parser.parse_args()

    results = {}
    for project in PROJECTS:
        if args.build_local:
            proc = subprocess.run(["npm", "--prefix", project, "run", "build"], cwd=ROOT)
            result = {"project": project, "success": proc.returncode == 0, "exit_code": proc.returncode,
                      "sha": args.sha, "run_id": args.run_id}
        else:
            manifest = args.input_dir / (project.replace("/", "-") + ".json")
            if not manifest.is_file():
                raise SystemExit(f"Missing current-run build manifest: {manifest}")
            result = json.loads(manifest.read_text(encoding="utf-8"))
        if result.get("project") != project or result.get("sha") != args.sha or result.get("run_id") != args.run_id:
            raise SystemExit(f"Build provenance mismatch: {project}")
        results[project] = {"success": result.get("success"), "exit_code": result.get("exit_code")}

    payload = {"sha": args.sha, "run_id": args.run_id,
               "generated_at": datetime.now(timezone.utc).isoformat(), "projects": results}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    if any(not item["success"] or item["exit_code"] != 0 for item in results.values()):
        raise SystemExit("One or more builds failed")


if __name__ == "__main__":
    main()

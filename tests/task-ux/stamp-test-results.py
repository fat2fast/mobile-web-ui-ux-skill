#!/usr/bin/env python3
"""Open a browser run, then bind its fresh Playwright report to that run."""
import argparse
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--results", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--begin", action="store_true")
    args = parser.parse_args()
    now = datetime.now(timezone.utc)

    if args.begin:
        if args.results.exists() or args.manifest.exists():
            raise SystemExit("Browser run output already exists; use a new run directory")
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        args.manifest.write_text(json.dumps({"sha": args.sha, "run_id": args.run_id,
                                             "started_at": now.isoformat(),
                                             "results": str(args.results.resolve())}), encoding="utf-8")
        return

    if not args.results.is_file() or not args.manifest.is_file():
        raise SystemExit("Browser report or run manifest missing")
    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    if (manifest.get("sha") != args.sha or manifest.get("run_id") != args.run_id
            or manifest.get("results") != str(args.results.resolve())):
        raise SystemExit("Browser run manifest does not match invocation")
    report = json.loads(args.results.read_text(encoding="utf-8"))
    if report.get("provenance"):
        raise SystemExit("Browser report already stamped")
    if not report.get("suites") or not report.get("stats"):
        raise SystemExit("Playwright report has no executed suites or stats")
    started = datetime.fromisoformat(manifest["started_at"])
    test_started = datetime.fromisoformat(report["stats"]["startTime"].replace("Z", "+00:00"))
    if not started - timedelta(seconds=2) <= test_started <= now:
        raise SystemExit("Playwright execution time predates this run")
    report["provenance"] = {"sha": args.sha, "run_id": args.run_id,
                            "started_at": manifest["started_at"],
                            "generated_at": now.isoformat()}
    args.results.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()

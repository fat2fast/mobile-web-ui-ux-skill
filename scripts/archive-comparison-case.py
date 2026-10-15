"""Redact local paths and archive an accessible comparison transcript."""

import argparse
import hashlib
import json
import re
from pathlib import Path


PROJECT = Path(__file__).resolve().parent.parent
HOME_PATH = re.compile(rb"/home/[^/\s\"'\\]+")


def redact(data: bytes, source: Path | None) -> bytes:
    if source is not None:
        data = data.replace(str(source).encode(), b"/home/user/.agent-logs/transcript.jsonl")
    data = data.replace(str(PROJECT).encode(), f"/home/user/work/{PROJECT.name}".encode())
    return HOME_PATH.sub(b"/home/user", data)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--case", required=True, help="Existing case directory name")
    parser.add_argument("--source", type=Path, help="Accessible runtime transcript.jsonl")
    args = parser.parse_args()

    case = PROJECT / args.case
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", args.case) or not (case / "prompt.txt").is_file():
        parser.error("--case must name an existing case directory")

    manifest_path = case / "manifest.json"
    if not manifest_path.is_file():
        parser.error(f"missing {manifest_path}")
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        parser.error(f"invalid manifest.json: {error}")
    if manifest.get("case") != args.case.upper():
        parser.error("manifest case does not match --case")
    prompt_hash = hashlib.sha256((case / "prompt.txt").read_bytes()).hexdigest()
    if manifest.get("prompt_sha256") != prompt_hash:
        parser.error("prompt.txt SHA-256 does not match manifest.json")

    source = args.source.expanduser().resolve() if args.source else None
    if source is not None:
        if not source.is_file() or source.name != "transcript.jsonl":
            parser.error("--source must be an existing transcript.jsonl file")
        if source == (case / "transcript.jsonl").resolve():
            parser.error("--source must differ from the archived transcript")
        transcript = redact(source.read_bytes(), source)
        for number, line in enumerate(transcript.splitlines(), 1):
            try:
                json.loads(line)
            except json.JSONDecodeError as error:
                parser.error(f"transcript line {number} is invalid JSON: {error}")

    for name in ("response.txt", "run-info.txt"):
        path = case / name
        if not path.is_file():
            parser.error(f"missing {path}")
    archive = case / "transcript.jsonl"
    if source is None and (archive.exists() or archive.is_symlink()):
        parser.error("transcript.jsonl already exists; supply its raw source or resolve the stale archive")

    updated = {}
    for name in ("response.txt", "run-info.txt"):
        data = redact((case / name).read_bytes(), source)
        if name == "run-info.txt":
            field = rb"(?m)^Raw transcript location or availability: ([^\r\n]*)"
            values = re.findall(field, data)
            if len(values) != 1:
                parser.error("run-info.txt needs one raw transcript location field")
            if source is not None:
                value = f"{args.case}/transcript.jsonl (path-redacted copy)".encode()
                data = re.sub(field, b"Raw transcript location or availability: " + value, data)
            elif values[0] != b"unavailable":
                parser.error("run-info.txt must record unavailable when --source is omitted")
        updated[name] = data

    for name, data in updated.items():
        (case / name).write_bytes(data)

    if source is not None:
        archive.write_bytes(transcript)
        print(f"Archived redacted transcript to {args.case}/transcript.jsonl")
    else:
        print(f"Redacted case metadata; transcript not supplied for {args.case}")


if __name__ == "__main__":
    main()

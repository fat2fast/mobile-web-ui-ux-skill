"""Redact local paths and archive an accessible comparison transcript."""

import argparse
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

    for name in ("response.txt", "run-info.txt"):
        path = case / name
        data = redact(path.read_bytes(), source)
        if name == "run-info.txt" and source is not None:
            label = b"Raw transcript location or availability: "
            value = f"{args.case}/transcript.jsonl (path-redacted copy)".encode()
            data, count = re.subn(rb"(?m)^Raw transcript location or availability: [^\r\n]*", label + value, data)
            if count != 1:
                parser.error("run-info.txt needs one raw transcript location field")
        path.write_bytes(data)

    if source is not None:
        (case / "transcript.jsonl").write_bytes(transcript)
        print(f"Archived redacted transcript to {args.case}/transcript.jsonl")
    else:
        print(f"Redacted case metadata; transcript not supplied for {args.case}")


if __name__ == "__main__":
    main()

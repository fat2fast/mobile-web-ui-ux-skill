"""Create a fixture project for a project-level skill comparison."""

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ("order-dashboard", "mobile-form")
CONDITIONS = ("no-skill", "with-skill")
SKILL_NAME = "mobile-web-ui-ux-skill"
CASES = (
    ("nav-01", 1),
    ("nav-02", 2),
    ("nav-03", 3),
    ("data-01", 4),
    ("data-02", 5),
    ("data-03", 6),
    ("form-01", 7),
    ("form-02", 8),
    ("form-03", 9),
    ("a11y-01", 10),
    ("a11y-02", 11),
    ("a11y-03", 12),
)
RUN_INSTRUCTIONS = """# Comparison run

This project is one side of a decision-only comparison. The same recording instructions are present in both projects.

When the user sends one frozen task, match it to the corresponding `*/prompt.txt` file. Read only prompt files to identify the case, then work only in that case folder. If the user names a case instead, read that case's `prompt.txt` as the task.

1. Read only this project and the instructions normally available to you. Do not open another comparison project, the source skill repository, or reviewer cases and rubrics. Do not edit the fixture application. The selected fixture may not implement the task's scenario; do not invent screens or claim checks ran when they did not.
2. Answer the task completely in the selected case's `response.txt`. Keep this file as the unedited answer for review; your final chat answer should reproduce it.
3. Fill every `PENDING` field in the selected case's `run-info.txt` with the actual UTC start/end times if observable, runtime and model identifier if exposed, agent mode, workspace path, tool access and tools used, files and instructions read, whether a skill file was actually read (with path or tool evidence), checks actually run, and any limits. Use `unknown` for information you cannot observe. Do not infer a model version or claim a test ran without evidence.
4. Confirm both output files exist. Do not grade or revise your answer against any case answer or rubric. The reviewer will do that after both runs finish.

The selected case's `prompt.txt` is frozen; its `manifest.json` records fixture file hashes and the project condition. Keep those files unchanged.
"""


def prompt_for(number: int) -> str:
    prefix = f"{number}. "
    for line in (ROOT / "evals" / "comparison-prompts.md").read_text(encoding="utf-8").splitlines():
        if line.startswith(prefix):
            return line[len(prefix) :]
    raise ValueError(f"comparison prompt {number} was not found")


def file_hashes(project: Path) -> dict[str, str]:
    return {
        str(path.relative_to(project)): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in sorted(project.rglob("*"))
        if path.is_file()
    }


def source_commit() -> str | None:
    result = subprocess.run(
        ["git", "-C", str(ROOT), "rev-parse", "HEAD"],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dest", required=True, type=Path, help="Existing parent directory")
    parser.add_argument("--fixture", choices=FIXTURES, default="order-dashboard")
    parser.add_argument("--condition", choices=CONDITIONS, required=True)
    args = parser.parse_args()

    parent = args.dest.expanduser().resolve()
    if not parent.is_dir():
        parser.error(f"destination parent must exist: {parent}")

    project = parent / args.condition
    if project.exists() or project.is_symlink():
        parser.error(f"project already exists; choose another DEST: {project}")
    if ROOT == project or ROOT in project.parents:
        parser.error("destination project must be outside the skill source repository")

    fixture = ROOT / "evals" / "fixtures" / args.fixture
    with tempfile.TemporaryDirectory(prefix=f".{args.condition}-", dir=parent) as temporary:
        staged = Path(temporary) / args.condition
        shutil.copytree(fixture, staged, ignore=shutil.ignore_patterns("node_modules", "dist"))
        fixture_hashes = file_hashes(staged)

        (staged / "AGENTS.md").write_text(RUN_INSTRUCTIONS, encoding="utf-8")

        if args.condition == "with-skill":
            skill = staged / ".agents" / "skills" / SKILL_NAME
            skill.mkdir(parents=True)
            shutil.copy2(ROOT / "SKILL.md", skill / "SKILL.md")
            shutil.copytree(ROOT / "references", skill / "references")
            skill_hashes = file_hashes(skill)
        else:
            skill_hashes = None

        prepared_at = datetime.now(timezone.utc).isoformat()
        instructions_hash = hashlib.sha256((staged / "AGENTS.md").read_bytes()).hexdigest()
        commit = source_commit()
        for case_dir, prompt_number in CASES:
            case = staged / case_dir
            case.mkdir()
            prompt_file = case / "prompt.txt"
            prompt_file.write_text(prompt_for(prompt_number) + "\n", encoding="utf-8")
            (case / "run-info.txt").write_text(
                "\n".join(
                    (
                        f"Case: {case_dir.upper()}",
                        f"Condition: {args.condition}",
                        "Runtime and version: PENDING",
                        "Model identifier and version: PENDING",
                        "Agent mode: PENDING",
                        "Started at UTC: PENDING",
                        "Finished at UTC: PENDING",
                        "Workspace path: PENDING",
                        "Tool access: PENDING",
                        "Tools actually used: PENDING",
                        "Files and ambient instructions read: PENDING",
                        "Skill file actually read and evidence: PENDING",
                        "Checks actually run and results: PENDING",
                        "Time/token limits: PENDING",
                        "Raw transcript location or availability: PENDING",
                        "Other limitations: PENDING",
                        "",
                    )
                ),
                encoding="utf-8",
            )
            manifest = {
                "case": case_dir.upper(),
                "condition": args.condition,
                "fixture": args.fixture,
                "fixture_files_sha256": fixture_hashes,
                "prompt_number": prompt_number,
                "prompt_sha256": hashlib.sha256(prompt_file.read_bytes()).hexdigest(),
                "prepared_at_utc": prepared_at,
                "recording_instructions_sha256": instructions_hash,
                "source_commit": commit,
                "skill_files_sha256": skill_hashes,
            }
            (case / "manifest.json").write_text(
                json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
            )

        staged.rename(project)

    print(f"Created {project} from {args.fixture}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Validate Mobile Web UI/UX Skill metadata, key files and local links.

Standard library only. This is NOT a UX/browser test.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPECTED_NAME = ROOT.name
REQUIRED = (
    'SKILL.md', 'README.md', 'README.vi.md', 'LICENSE',
    'docs/product-scope.md', 'docs/mvp-scope.md', 'docs/constraints.md', 'docs/roadmap.md',
    'references/project-discovery.md', 'references/agent-workflow.md',
    'references/mobile-ux-principles.md', 'references/report-template.md',
    'references/verification-criteria.md', 'references/evidence-template.md',
    'references/accessibility-checklist.md', 'references/external-pilot-evidence.md',
    'references/decisions/navigation.md', 'references/decisions/data-display.md',
    'references/decisions/forms.md', 'evals/evaluation-criteria.md',
    'evals/scenarios/dashboard.md', 'evals/scenarios/navigation.md',
    'evals/scenarios/form.md',
)


def validate():
    errors = []
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    errors += [f'Missing required file: {p}' for p in missing]

    skill = ROOT / 'SKILL.md'
    if skill.is_file():
        source = skill.read_text(encoding='utf-8')
        match = re.match(r'\A---\s*\n(.*?)\n---\s*\n', source, re.S)
        if not match:
            errors.append('SKILL.md must start with YAML frontmatter between --- markers')
        else:
            frontmatter = match.group(1)
            name_match = re.search(r'^name:\s*(\S+)\s*$', frontmatter, re.M)
            name = name_match.group(1) if name_match else ''
            if not name or len(name) > 64 or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', name):
                errors.append('Invalid SKILL.md name (1–64 chars, lowercase, digits/hyphen, no double hyphens)')
            elif name != EXPECTED_NAME:
                errors.append(f'SKILL.md name {name!r} must match directory {EXPECTED_NAME!r}')
            # Support a simple single-line or folded block description.
            desc_match = re.search(r'^description:\s*(.*)$', frontmatter, re.M)
            if not desc_match:
                errors.append('SKILL.md description missing')
            else:
                val = desc_match.group(1).strip()
                if val in ('>', '>-', '|', '|-'):
                    tail = frontmatter[desc_match.end():].splitlines()
                    content = []
                    for line in tail:
                        if not line.strip():
                            if content:
                                content.append('')
                            continue
                        if line[0].isspace():
                            content.append(line.strip())
                        else:
                            break
                    description = ' '.join(content).strip()
                else:
                    description = val.strip('"\' ')
                if not description or len(description) > 1024:
                    errors.append(f'SKILL.md description length must be 1–1024; got {len(description)}')
            if not source[match.end():].strip():
                errors.append('SKILL.md instructions body is empty')

    checked_links = 0
    for md in ROOT.rglob('*.md'):
        if any(p in {'node_modules', '.git'} for p in md.parts):
            continue
        body = md.read_text(encoding='utf-8')
        # Standard Markdown inline links; external links, anchors and placeholders excluded.
        for dest in re.findall(r'(?<!!)\[[^\]\n]*\]\(([^\)\s]+)(?:\s+"[^"]*")?\)', body):
            if (dest.startswith(('http:', 'https:', 'mailto:', '#')) or
                dest.startswith('<') or dest.startswith('{')):
                continue
            local = dest.split('#', 1)[0].split('?', 1)[0]
            if not local:
                continue
            target = (md.parent / local).resolve()
            checked_links += 1
            if not target.is_relative_to(ROOT.resolve()):
                errors.append(f'Local link escapes repo: {md.relative_to(ROOT)} -> {dest}')
            elif not target.exists():
                errors.append(f'Broken local link: {md.relative_to(ROOT)} -> {dest}')

    if errors:
        print('FAIL: mobile-web-ui-ux-skill structural validation')
        for error in errors:
            print(' -', error)
        return 1
    print(f'PASS: {EXPECTED_NAME} structure valid ({len(REQUIRED)} required files, {checked_links} local links checked)')
    print('NOTE: This is not a browser, mobile UX, or PWA behavior test.')
    return 0


if __name__ == '__main__':
    sys.exit(validate())

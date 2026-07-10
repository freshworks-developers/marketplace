#!/usr/bin/env python3
"""Detect fw-dev-tools skill reads by IDE path in agent stream-json logs."""
import json
import re
import sys

FW_SKILL = re.compile(r'fw-(?:setup|app-dev|ai-actions-app|review|publish)')
CLAUDE_SKILLS = re.compile(r'[/\\]\.claude[/\\]skills[/\\]fw-', re.I)
CURSOR_SKILLS = re.compile(r'[/\\]\.cursor[/\\]skills[/\\]fw-', re.I)
CODEX_SKILLS = re.compile(r'[/\\]\.codex[/\\]skills[/\\]fw-', re.I)


def _paths_from_tool_call(tc: dict) -> list[str]:
    paths: list[str] = []
    for key, body in tc.items():
        if not isinstance(body, dict):
            continue
        args = body.get('args') or {}
        if isinstance(args, dict):
            for field in ('path', 'targetDirectory'):
                val = args.get(field)
                if isinstance(val, str) and val:
                    paths.append(val)
            pattern = args.get('pattern')
            grep_path = args.get('path')
            if isinstance(pattern, str) and isinstance(grep_path, str) and FW_SKILL.search(pattern):
                paths.append(grep_path)
    return paths


def skill_path_reads(path: str) -> dict[str, int]:
    counts = {'claude': 0, 'cursor': 0, 'codex': 0}
    with open(path, encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if not line.startswith('{'):
                continue
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            if d.get('type') != 'tool_call':
                continue
            tc = d.get('tool_call') or {}
            for p in _paths_from_tool_call(tc):
                if CLAUDE_SKILLS.search(p):
                    counts['claude'] += 1
                if CURSOR_SKILLS.search(p):
                    counts['cursor'] += 1
                if CODEX_SKILLS.search(p):
                    counts['codex'] += 1
    return counts


def main() -> int:
    if len(sys.argv) != 2:
        print('usage: llm-log-skill-paths.py <log-file>', file=sys.stderr)
        return 2
    counts = skill_path_reads(sys.argv[1])
    for k, v in counts.items():
        print(f'{k}_reads:{v}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

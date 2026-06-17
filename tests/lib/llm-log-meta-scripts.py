#!/usr/bin/env python3
"""Detect per-app .meta.json script usage vs hand-written edits in agent logs."""
import json
import re
import sys

META_INIT = re.compile(r'meta-init\.sh', re.I)
META_UPDATE = re.compile(r'meta-update\.sh', re.I)
META_JSON = re.compile(r'\.meta\.json\b', re.I)
META_SCRIPT = re.compile(r'meta-(?:init|update|feedback|delete)\.sh', re.I)
HAND_WRITE_SHELL = re.compile(
    r'(?:>|>>)\s*[^\s\n|;&]*\.meta\.json\b|tee\s+[^\s\n|;&]*\.meta\.json\b',
    re.I,
)
WRITE_EDIT_TOOLS = re.compile(r'(?:write|edit|strReplace|apply_patch)', re.I)


def _tool_paths(tc: dict) -> list[tuple[str, str]]:
    found: list[tuple[str, str]] = []
    for key, body in tc.items():
        if not isinstance(body, dict):
            continue
        args = body.get('args') or {}
        if not isinstance(args, dict):
            continue
        for field in ('path', 'file_path', 'filePath', 'target_file'):
            val = args.get(field)
            if isinstance(val, str) and META_JSON.search(val):
                found.append((key, val))
    return found


def meta_script_evidence(path: str) -> dict:
    meta_init = False
    meta_update = False
    hand_write_count = 0

    with open(path, encoding='utf-8', errors='replace') as f:
        raw = f.read()

    is_stream_json = '"type":"tool_call"' in raw

    if is_stream_json:
        for line in raw.splitlines():
            line = line.strip()
            if not line.startswith('{'):
                continue
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            if d.get('type') != 'tool_call' or d.get('subtype') != 'completed':
                continue
            tc = d.get('tool_call') or {}

            shell = tc.get('shellToolCall') or {}
            cmd = (shell.get('args') or {}).get('command') or ''
            if cmd:
                if META_INIT.search(cmd):
                    meta_init = True
                if META_UPDATE.search(cmd):
                    meta_update = True
                if HAND_WRITE_SHELL.search(cmd) and not META_SCRIPT.search(cmd):
                    hand_write_count += 1

            for tool_kind, tool_path in _tool_paths(tc):
                if WRITE_EDIT_TOOLS.search(tool_kind):
                    hand_write_count += 1
    else:
        for line in raw.splitlines():
            line = line.strip()
            if META_INIT.search(line):
                meta_init = True
            if META_UPDATE.search(line):
                meta_update = True
            if HAND_WRITE_SHELL.search(line) and not META_SCRIPT.search(line):
                hand_write_count += 1

    return {
        'meta_init': meta_init,
        'meta_update': meta_update,
        'hand_write': hand_write_count > 0,
        'hand_write_count': hand_write_count,
    }


def main() -> int:
    if len(sys.argv) != 2:
        print('usage: llm-log-meta-scripts.py <log-file>', file=sys.stderr)
        return 2
    ev = meta_script_evidence(sys.argv[1])
    print(f'meta_init:{"yes" if ev["meta_init"] else "no"}')
    print(f'meta_update:{"yes" if ev["meta_update"] else "no"}')
    print(f'hand_write:{"yes" if ev["hand_write"] else "no"}')
    print(f'hand_write_count:{ev["hand_write_count"]}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

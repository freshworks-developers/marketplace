#!/usr/bin/env python3
"""Detect fw-publish metrics timing in agent logs (shell tool call order)."""
import json
import re
import sys

META_UPDATE_FW_PUBLISH = re.compile(r'meta-update\.sh[^\n]*fw-publish', re.I)
FDK_PACK = re.compile(r'\bfdk\s+pack\b', re.I)
META_DELETE = re.compile(r'meta-delete\.sh', re.I)
UNZIP_META = re.compile(r'unzip\s+-l[^\n]*|\.meta\.json', re.I)


def shell_commands_in_order(path: str) -> list[str]:
    commands: list[str] = []
    with open(path, encoding='utf-8', errors='replace') as f:
        raw = f.read()

    if '"type":"tool_call"' not in raw and '"type":"result"' not in raw:
        for line in raw.splitlines():
            line = line.strip()
            if line and not line.startswith('{'):
                commands.append(line)
        return commands

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
            commands.append(cmd)
    return commands


def publish_metrics_evidence(path: str) -> dict[str, bool]:
    commands = shell_commands_in_order(path)
    meta_idx = None
    pack_idx = None
    delete_idx = None
    unzip_meta = False

    for i, cmd in enumerate(commands):
        if meta_idx is None and META_UPDATE_FW_PUBLISH.search(cmd):
            meta_idx = i
        if pack_idx is None and FDK_PACK.search(cmd):
            pack_idx = i
        if META_DELETE.search(cmd):
            delete_idx = i
        if UNZIP_META.search(cmd) and '.meta.json' in cmd:
            unzip_meta = True

    # Also scan assistant result text for unzip -l listing containing .meta.json
    with open(path, encoding='utf-8', errors='replace') as f:
        raw = f.read()
    if re.search(r'unzip\s+-l[^\n]*\n[^\n]*\.meta\.json', raw, re.I):
        unzip_meta = True

    pre_pack = (
        meta_idx is not None
        and pack_idx is not None
        and meta_idx < pack_idx
    )
    return {
        'pre_pack_metrics': pre_pack,
        'meta_delete': delete_idx is not None,
        'zip_lists_meta': unzip_meta,
    }


def main() -> int:
    if len(sys.argv) != 2:
        print('usage: llm-log-publish-metrics.py <log-file>', file=sys.stderr)
        return 2
    ev = publish_metrics_evidence(sys.argv[1])
    for key, val in ev.items():
        print(f'{key}:{"yes" if val else "no"}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

#!/usr/bin/env python3
"""Detect publish *execution* in agent logs (shell/MCP), not prose mentions."""
import json
import re
import sys

SHELL_RE = re.compile(r'upload-app\.sh|\bfdk\s+pack\b', re.I)
MCP_PUBLISH_TOOLS = frozenset({'create_app_upload_url', 'submit_custom_app', 'add_app_version'})
READ_ONLY_TOOLS = frozenset({
    'grepToolCall', 'readToolCall', 'globToolCall', 'lsToolCall', 'listToolCall',
})


def publish_action_evidence(path: str) -> list[str]:
    evidence: list[str] = []

    def add(kind: str, detail: str) -> None:
        evidence.append(f'{kind}: {detail[:200]}')

    with open(path, encoding='utf-8', errors='replace') as f:
        raw = f.read()

    is_stream_json = '"type":"tool_call"' in raw or '"type":"result"' in raw

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
            tool_kind = next(iter(tc.keys()), '')
            if tool_kind in READ_ONLY_TOOLS:
                continue
            shell = tc.get('shellToolCall') or {}
            cmd = (shell.get('args') or {}).get('command') or ''
            if cmd and SHELL_RE.search(cmd):
                add('shell', cmd)
            for mcp_key in tc:
                if 'mcp' not in mcp_key.lower():
                    continue
                mcp = tc.get(mcp_key) or {}
                args = mcp.get('args') if isinstance(mcp.get('args'), dict) else mcp
                tool_name = (args or {}).get('toolName') or mcp.get('toolName') or ''
                if tool_name in MCP_PUBLISH_TOOLS:
                    add('mcp', tool_name)
    else:
        for pat in (
            r'(?m)^\s*(?:bash\s+)?[^\n]*upload-app\.sh[^\n]*$',
            r'(?m)^\s*fdk\s+pack\b[^\n]*$',
        ):
            for m in re.finditer(pat, raw, re.I):
                add('plain', m.group(0).strip())

    return evidence


def main() -> int:
    if len(sys.argv) != 2:
        print('usage: llm-log-publish-actions.py <log-file>', file=sys.stderr)
        return 2
    for line in publish_action_evidence(sys.argv[1]):
        print(line)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

#!/usr/bin/env bash
# Compare top-level "version" keys in marketplace manifests (Cursor vs Claude).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
v_cursor=$(python3 -c "import json;print(json.load(open('$ROOT/.cursor-plugin/marketplace.json'))['version'])")
v_claude=$(python3 -c "import json;print(json.load(open('$ROOT/.claude-plugin/marketplace.json'))['version'])")
v_codex=$(python3 -c "import json;import pathlib;p=pathlib.Path('$ROOT/.codex-plugin/plugin.json');print(json.load(open(p))['version'])")
if [[ "$v_cursor" != "$v_claude" ]] || [[ "$v_cursor" != "$v_codex" ]]; then
  echo "Version mismatch: Cursor=$v_cursor Claude=$v_claude Codex=$v_codex" >&2
  exit 1
fi
echo "Marketplace umbrella + .codex-plugin version aligned: $v_cursor"

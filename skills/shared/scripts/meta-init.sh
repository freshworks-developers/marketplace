#!/usr/bin/env bash
# Initialises <app-dir>/.meta.json from the template if not already present.
# Usage: meta-init.sh <app-dir> [ide-client]
#   ide-client is auto-detected if not provided.

set -euo pipefail

APP_DIR="${1:-}"
[ -z "$APP_DIR" ] && { echo "Usage: meta-init.sh <app-dir> [ide-client]" >&2; exit 1; }

# Already initialised — nothing to do.
[ -f "$APP_DIR/.meta.json" ] && exit 0

# Template is alongside this script (works both from repo and from ~/.fw-dev-tools/scripts/).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SCRIPT_DIR/.meta.template.json"
[ -f "$TEMPLATE" ] || { echo "Template not found: $TEMPLATE" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Auto-detect IDE client from environment variables.
# Order matters: specific checks first, generic AI_AGENT standard last.
# ---------------------------------------------------------------------------
detect_ide_client() {
  # Claude family — cowork before generic claude-code
  if [ "${CLAUDE_CODE_ENTRYPOINT:-}" = "local-agent" ]; then
    echo "claude-cowork"; return
  fi
  if [ -n "${CLAUDECODE:-}" ]; then
    echo "claude-code"; return
  fi

  # Cursor
  if [ -n "${CURSOR_AGENT:-}" ] || [ -n "${CURSOR_TRACE_ID:-}" ]; then
    echo "cursor"; return
  fi

  # OpenAI Codex CLI
  if [ -n "${CODEX_SANDBOX:-}" ]; then
    echo "codex"; return
  fi

  # VS Code + GitHub Copilot agent mode
  if [ "${AI_AGENT:-}" = "github_copilot_vscode_agent" ]; then
    echo "copilot"; return
  fi

  # Google Gemini CLI
  if [ -n "${GEMINI_CLI:-}" ]; then
    echo "gemini"; return
  fi

  # Kiro (JetBrains / AWS)
  if [ -n "${AGENT_CONTEXT_OUT:-}" ]; then
    echo "kiro"; return
  fi

  # Windsurf — macOS only, no dedicated env var
  if [ "${__CFBundleIdentifier:-}" = "com.exafunction.windsurf" ]; then
    echo "windsurf"; return
  fi

  # Generic fallback: any tool adopting the AI_AGENT standard.
  # Sanitise to lowercase alphanumeric + hyphens (max 64 chars).
  if [ -n "${AI_AGENT:-}" ]; then
    echo "${AI_AGENT}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_-]/-/g' | cut -c1-64
    return
  fi

  echo "unknown"
}

IDE_CLIENT="${2:-$(detect_ide_client)}"

# ---------------------------------------------------------------------------
# Generate tracking ID, build .meta.json — single node invocation.
# Pass values via env to avoid shell-injection through path or IDE names.
# ---------------------------------------------------------------------------
export META_TEMPLATE="$TEMPLATE"
export META_APP_DIR="$APP_DIR"
export META_IDE_CLIENT="$IDE_CLIENT"

node -e "
  const fs = require('fs');
  const crypto = require('crypto');

  // Tracking ID: 20-char alphanumeric
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const trackingId = Array.from(crypto.randomBytes(20))
    .map(b => chars[b % chars.length])
    .join('');

  // Read template, exclude install-only keys
  const installOnly = new Set(['version', 'method', 'client', 'installedAt', 'update_check']);
  const template = JSON.parse(fs.readFileSync(process.env.META_TEMPLATE, 'utf8'));
  const app = {};
  for (const [k, v] of Object.entries(template)) {
    if (!installOnly.has(k)) app[k] = v;
  }

  app.tracking_id = trackingId;
  app.ide_client  = process.env.META_IDE_CLIENT;
  app.start_time  = new Date().toISOString().replace(/\d{3}Z$/, '000Z');

  fs.writeFileSync(
    process.env.META_APP_DIR + '/.meta.json',
    JSON.stringify(app, null, 2) + '\n'
  );
"

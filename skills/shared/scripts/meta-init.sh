#!/usr/bin/env bash
# Initialises <app-dir>/.meta.json from the template if not already present.
# Usage: meta-init.sh <app-dir> <ide-client>
#   ide-client: claude-code | cursor | codex | unknown

set -euo pipefail

APP_DIR="${1:-}"
IDE_CLIENT="${2:-unknown}"
# Template is alongside this script (works both from repo and from ~/.fw-dev-tools/scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SCRIPT_DIR/.meta.template.json"

[ -z "$APP_DIR" ] && { echo "Usage: meta-init.sh <app-dir> <ide-client>" >&2; exit 1; }
[ -f "$APP_DIR/.meta.json" ] && exit 0
[ -f "$TEMPLATE" ] || { echo "Template not found: $TEMPLATE" >&2; exit 1; }

START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
TRACKING_ID=$(node -e "
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const { randomBytes } = require('crypto');
  const bytes = randomBytes(20);
  process.stdout.write(Array.from(bytes).map(b => chars[b % chars.length]).join(''));
")

node -e "
  const fs = require('fs');
  const installOnly = new Set(['version', 'method', 'client', 'installedAt', 'update_check']);
  const m = JSON.parse(fs.readFileSync('$TEMPLATE', 'utf8'));
  const app = {};
  for (const [k, v] of Object.entries(m)) {
    if (!installOnly.has(k)) app[k] = v;
  }
  app.tracking_id = '$TRACKING_ID';
  app.ide_client = '$IDE_CLIENT';
  app.start_time = '$START_TIME';
  fs.writeFileSync('$APP_DIR/.meta.json', JSON.stringify(app, null, 2) + '\n');
"

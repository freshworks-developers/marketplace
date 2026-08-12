#!/usr/bin/env bash
# Read <app-dir>/.fw-session.json to stdout.
# Usage: session-read.sh <app-dir>
# Exit 0 + JSON on success; exit 1 if missing; exit 2 if invalid JSON.

set -euo pipefail

APP_DIR="${1:-}"
[ -z "$APP_DIR" ] && { echo "Usage: session-read.sh <app-dir>" >&2; exit 1; }

SESSION="$APP_DIR/.fw-session.json"
[ -f "$SESSION" ] || exit 1

node -e "
  const fs = require('fs');
  try {
    JSON.parse(fs.readFileSync('$SESSION', 'utf8'));
    process.stdout.write(fs.readFileSync('$SESSION', 'utf8'));
  } catch (e) {
    process.stderr.write('Invalid .fw-session.json: ' + e.message + '\n');
    process.exit(2);
  }
"

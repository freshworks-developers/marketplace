#!/usr/bin/env bash
# Read <app-dir>/.fw-session.json to stdout.
# Usage: session-read.sh <app-dir>
# Exit 0 + JSON on success; exit 1 if missing; exit 2 if invalid JSON.

set -euo pipefail

APP_DIR="${1:-}"
[ -z "$APP_DIR" ] && { echo "Usage: session-read.sh <app-dir>" >&2; exit 1; }

SESSION="$APP_DIR/.fw-session.json"
[ -f "$SESSION" ] || exit 1

export SESSION
node <<'NODE'
  const fs = require('fs');
  const sessionPath = process.env.SESSION;
  try {
    const content = fs.readFileSync(sessionPath, 'utf8');
    JSON.parse(content);
    process.stdout.write(content);
  } catch (e) {
    process.stderr.write('Invalid .fw-session.json: ' + e.message + '\n');
    process.exit(2);
  }
NODE

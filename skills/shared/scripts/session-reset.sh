#!/usr/bin/env bash
# Delete <app-dir>/.fw-session.json (requires --force).
# Usage: session-reset.sh <app-dir> [--force]

set -euo pipefail

APP_DIR="${1:-}"
FORCE="${2:-}"

[ -z "$APP_DIR" ] && { echo "Usage: session-reset.sh <app-dir> [--force]" >&2; exit 1; }

SESSION="$APP_DIR/.fw-session.json"
[ -f "$SESSION" ] || exit 0

if [ "$FORCE" != "--force" ]; then
  echo "Refusing to reset session without --force" >&2
  exit 1
fi

rm -f "$SESSION"

#!/usr/bin/env bash
# Deletes <app-dir>/.meta.json after successful publish.
# Usage: meta-delete.sh <app-dir>

set -euo pipefail

APP_DIR="${1:-}"
[ -z "$APP_DIR" ] && { echo "Usage: meta-delete.sh <app-dir>" >&2; exit 1; }

META="$APP_DIR/.meta.json"
if [ -f "$META" ]; then
  rm "$META"
fi

#!/usr/bin/env bash
# Writes developer publish feedback to root-level "developer_feedback" in <app-dir>/.meta.json.
# Usage: meta-feedback.sh <app-dir> <rating> [comment...]
#   rating: liked | disliked
#   comment: optional; remaining args joined as free text (omit JSON "comment" key when empty)
# Do NOT call when the developer skips feedback — omit the "developer_feedback" key entirely.

set -euo pipefail

APP_DIR="${1:-}"
RATING="${2:-}"

[ -z "$APP_DIR" ] || [ -z "$RATING" ] && {
  echo "Usage: meta-feedback.sh <app-dir> <liked|disliked> [comment...]" >&2
  exit 1
}

META="$APP_DIR/.meta.json"
[ -f "$META" ] || { echo ".meta.json not found in $APP_DIR — run meta-init.sh first" >&2; exit 1; }

shift 2
COMMENT="${*:-}"

node -e "
  const fs = require('fs');
  const rating = process.argv[1];
  const comment = process.argv[2];
  const metaPath = process.argv[3];
  if (rating !== 'liked' && rating !== 'disliked') {
    console.error('rating must be \"liked\" or \"disliked\"');
    process.exit(1);
  }
  const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const feedback = { rating };
  const trimmed = (comment || '').trim();
  if (trimmed) feedback.comment = trimmed;
  m.developer_feedback = feedback;
  fs.writeFileSync(metaPath, JSON.stringify(m, null, 2) + '\n');
" "$RATING" "$COMMENT" "$META"

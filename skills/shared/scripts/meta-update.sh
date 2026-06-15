#!/usr/bin/env bash
# Updates skill metrics fields in <app-dir>/.meta.json.
# Usage: meta-update.sh <app-dir> <skill> <key=value> [<key=value> ...]
#   Supports: string, number, boolean values
#   Array append: key+=value (appends string to array field)
#
# Examples:
#   meta-update.sh ./my-app fw-app-dev invoked=1 skill_version=1.1.2 validate_iterations=3
#   meta-update.sh ./my-app fw-app-dev validation_error_categories+=lint-async-no-await

set -euo pipefail

APP_DIR="${1:-}"
SKILL="${2:-}"

[ -z "$APP_DIR" ] || [ -z "$SKILL" ] && { echo "Usage: meta-update.sh <app-dir> <skill> <key=value> ..." >&2; exit 1; }
[ -f "$APP_DIR/.meta.json" ] || { echo ".meta.json not found in $APP_DIR — run meta-init.sh first" >&2; exit 1; }

# Build assignments JSON from remaining args
ASSIGNMENTS="{"
APPENDS="{"
for arg in "${@:3}"; do
  if [[ "$arg" == *"+="* ]]; then
    key="${arg%%+=*}"
    val="${arg#*+=}"
    APPENDS="$APPENDS\"$key\":\"$val\","
  else
    key="${arg%%=*}"
    val="${arg#*=}"
    ASSIGNMENTS="$ASSIGNMENTS\"$key\":$(node -e "
      const v = '$val';
      if (v === 'true') process.stdout.write('true');
      else if (v === 'false') process.stdout.write('false');
      else if (!isNaN(v) && v !== '') process.stdout.write(v);
      else process.stdout.write(JSON.stringify(v));
    "),"
  fi
done
ASSIGNMENTS="${ASSIGNMENTS%,}}"
APPENDS="${APPENDS%,}}"

node -e "
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('$APP_DIR/.meta.json', 'utf8'));
  if (!m['$SKILL']) m['$SKILL'] = {};
  const assignments = $ASSIGNMENTS;
  const appends = $APPENDS;
  Object.assign(m['$SKILL'], assignments);
  for (const [k, v] of Object.entries(appends)) {
    if (!Array.isArray(m['$SKILL'][k])) m['$SKILL'][k] = [];
    if (!m['$SKILL'][k].includes(v)) m['$SKILL'][k].push(v);
  }
  fs.writeFileSync('$APP_DIR/.meta.json', JSON.stringify(m, null, 2) + '\n');
"

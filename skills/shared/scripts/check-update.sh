#!/usr/bin/env bash
# Checks for fw-dev-tools updates. Run on first skill invocation per session.
# Writes update_check block to ~/.fw-dev-tools/.meta.json.
# Prints one nudge line if update is available and not already nudged today. Silent otherwise.

set -euo pipefail

META="$HOME/.fw-dev-tools/.meta.json"

[ -f "$META" ] || exit 0

TODAY=$(date -u +"%Y-%m-%d")

# Read fields from .meta.json using node (already required by fw-dev-tools)
read_field() {
  node -e "
    try {
      const m = JSON.parse(require('fs').readFileSync('$META','utf8'));
      const v = $1;
      process.stdout.write(v == null ? '' : String(v));
    } catch { process.stdout.write(''); }
  "
}

CURRENT=$(read_field "m.version")
LAST_CHECKED=$(read_field "m.update_check && m.update_check.lastChecked")
LAST_NUDGED=$(read_field "m.update_check && m.update_check.lastNudged")

[ -z "$CURRENT" ] && exit 0

# Gate: already checked today
[ "$LAST_CHECKED" = "$TODAY" ] && {
  # Still show nudge if update available and not nudged today
  UPDATE_AVAILABLE=$(read_field "m.update_check && m.update_check.updateAvailable")
  LATEST=$(read_field "m.update_check && m.update_check.latestVersion")
  if [ "$UPDATE_AVAILABLE" = "true" ] && [ "$LAST_NUDGED" != "$TODAY" ]; then
    echo "⚠ fw-dev-tools v${CURRENT} → v${LATEST} available. Run: npx @freshworks/fw-dev-tools update"
    node -e "
      const fs = require('fs');
      const m = JSON.parse(fs.readFileSync('$META','utf8'));
      m.update_check.lastNudged = '$TODAY';
      fs.writeFileSync('$META', JSON.stringify(m, null, 2) + '\n');
    "
  fi
  exit 0
}

# Fetch latest from npm registry
LATEST=$(node -e "
  fetch('https://registry.npmjs.org/@freshworks%2ffw-dev-tools/latest', {
    headers: {'User-Agent': 'fw-dev-tools-check-update'},
    signal: AbortSignal.timeout(5000)
  })
  .then(r => r.json())
  .then(d => process.stdout.write(d.version || ''))
  .catch(() => process.stdout.write(''));
" 2>/dev/null || true)

# Write update_check fields back
node -e "
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('$META','utf8'));
  const current = '$CURRENT';
  const latest = '${LATEST:-}';
  const today = '$TODAY';
  const updateAvailable = latest && latest !== current;
  m.update_check = {
    ...m.update_check,
    lastChecked: today,
    latestVersion: latest || m.update_check?.latestVersion || null,
    updateAvailable: updateAvailable,
  };
  if (updateAvailable && m.update_check.lastNudged !== today) {
    m.update_check.lastNudged = today;
    fs.writeFileSync('$META', JSON.stringify(m, null, 2) + '\n');
    process.stdout.write('⚠ fw-dev-tools v' + current + ' → v' + latest + ' available. Run: npx @freshworks/fw-dev-tools update\n');
  } else {
    fs.writeFileSync('$META', JSON.stringify(m, null, 2) + '\n');
  }
"

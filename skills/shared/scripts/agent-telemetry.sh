#!/usr/bin/env bash
# Emit agent orchestration telemetry into <app-dir>/.meta.json (_agent block).
# Usage: agent-telemetry.sh <app-dir> <event> [key=value ...]
#
# Events: intent_detected | session_sync | escalation_triggered | deprecated_blocked | guardrail_violation
#
# Examples:
#   agent-telemetry.sh ./my-app intent_detected last_intent=create-new intent_confidence=0.9
#   agent-telemetry.sh ./my-app deprecated_blocked blocked_tool=implement_app

set -euo pipefail

APP_DIR="${1:-}"
EVENT="${2:-}"
shift 2 || true

[ -z "$APP_DIR" ] || [ -z "$EVENT" ] && {
  echo "Usage: agent-telemetry.sh <app-dir> <event> [key=value ...]" >&2
  exit 1
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure .meta.json exists
"$SCRIPT_DIR/meta-init.sh" "$APP_DIR" 2>/dev/null || true

ARGS=("$APP_DIR" "_agent" "last_event=$EVENT" "last_event_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)")
for arg in "$@"; do
  ARGS+=("$arg")
done

exec "$SCRIPT_DIR/meta-update.sh" "${ARGS[@]}"

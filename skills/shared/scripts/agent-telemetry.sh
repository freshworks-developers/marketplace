#!/usr/bin/env bash
# Emit agent orchestration telemetry into <app-dir>/.meta.json (_agent block).
# Usage: agent-telemetry.sh <app-dir> <event> [key=value ...] [--strict]
#
# Events: intent_detected | session_sync | escalation_triggered | deprecated_blocked | guardrail_violation
#
# Intent enforcement (soft by default): when event=intent_detected and a last_intent=<value>
# arg is present, the value is normalized (create->create-new, update->update-existing) and
# checked against the 6 canonical intents (create-new, add-feature, troubleshoot,
# update-existing, migrate, publish-status). An invalid value does NOT block the write by
# default — it is recorded as-is plus last_intent_valid=false, and a warning is printed to
# stderr, so a bad classification is visible without breaking the agent's turn (telemetry
# should fail open, not take down the task). Pass --strict to make an invalid last_intent a
# hard failure instead (exit 1, nothing written) — use this for callers that must guarantee
# clean telemetry (e.g. CI/eval harnesses).
#
# used_intents: a deduped, append-only history of every VALID canonical intent this app
# project has ever been classified as (via meta-update.sh's `key+=value` array-append).
# Distinct from last_intent (only the most recent classification). Invalid values are never
# added to used_intents — they stay visible only via last_intent_valid=false + the warning.
#
# Examples:
#   agent-telemetry.sh ./my-app intent_detected last_intent=create-new intent_confidence=0.9
#   agent-telemetry.sh ./my-app intent_detected last_intent=create           # alias -> create-new
#   agent-telemetry.sh ./my-app intent_detected last_intent=frobnicate       # warns, still writes
#   agent-telemetry.sh ./my-app intent_detected last_intent=frobnicate --strict  # exits 1, no write
#   agent-telemetry.sh ./my-app deprecated_blocked blocked_tool=implement_app

set -euo pipefail

APP_DIR="${1:-}"
EVENT="${2:-}"
shift 2 || true

[ -z "$APP_DIR" ] || [ -z "$EVENT" ] && {
  echo "Usage: agent-telemetry.sh <app-dir> <event> [key=value ...] [--strict]" >&2
  exit 1
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CANONICAL_INTENTS=(create-new add-feature troubleshoot update-existing migrate publish-status)

STRICT=0
RAW_ARGS=()
for arg in "$@"; do
  if [ "$arg" = "--strict" ]; then
    STRICT=1
  else
    RAW_ARGS+=("$arg")
  fi
done

is_canonical_intent() {
  local value="$1"
  for intent in "${CANONICAL_INTENTS[@]}"; do
    [ "$value" = "$intent" ] && return 0
  done
  return 1
}

FINAL_ARGS=()
for arg in "${RAW_ARGS[@]:-}"; do
  [ -z "$arg" ] && continue
  if [ "$EVENT" = "intent_detected" ] && [[ "$arg" == last_intent=* ]]; then
    value="${arg#last_intent=}"
    case "$value" in
      create) value="create-new" ;;
      update) value="update-existing" ;;
    esac
    if is_canonical_intent "$value"; then
      FINAL_ARGS+=("last_intent=$value" "last_intent_valid=true" "used_intents+=$value")
    elif [ "$STRICT" = "1" ]; then
      echo "agent-telemetry.sh: invalid last_intent '$value' — must be one of: ${CANONICAL_INTENTS[*]} (or aliases create/update). Refusing to write (--strict)." >&2
      exit 1
    else
      echo "agent-telemetry.sh: WARNING — last_intent '$value' is not a canonical intent (${CANONICAL_INTENTS[*]}). Recording as last_intent_valid=false; re-classify on next turn." >&2
      FINAL_ARGS+=("last_intent=$value" "last_intent_valid=false")
    fi
  else
    FINAL_ARGS+=("$arg")
  fi
done

# Ensure .meta.json exists
"$SCRIPT_DIR/meta-init.sh" "$APP_DIR" 2>/dev/null || true

ARGS=("$APP_DIR" "_agent" "last_event=$EVENT" "last_event_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)")
for arg in "${FINAL_ARGS[@]:-}"; do
  [ -z "$arg" ] && continue
  ARGS+=("$arg")
done

exec "$SCRIPT_DIR/meta-update.sh" "${ARGS[@]}"

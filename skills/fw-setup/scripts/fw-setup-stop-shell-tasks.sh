#!/usr/bin/env bash
# Stop common long-running FDK CLI processes (current user only).
set -euo pipefail

usage() {
  echo "Usage: $(basename "$0") [--dry-run] [--force]"
  echo "  --dry-run  list PIDs that would be signaled; do not kill"
  echo "  --force    send KILL if any match survives after TERM (1s pause)"
}

DRY_RUN=0
FORCE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --force) FORCE=1 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

# Bracket in first char avoids pgrep matching its own argv in some environments.
PATTERNS=(
  '[f]dk run'
  '[f]dk tunnel'
)

collect_pids() {
  local pat pids
  for pat in "${PATTERNS[@]}"; do
    pids=$(pgrep -f -u "${USER:-$(id -un)}" "$pat" 2>/dev/null || true)
    if [[ -n "$pids" ]]; then
      echo "$pids" | tr ' ' '\n'
    fi
  done | sort -u -n
}

describe_pid() {
  local pid=$1
  if ps -p "$pid" >/dev/null 2>&1; then
    ps -p "$pid" -o pid=,command= 2>/dev/null | sed 's/^ *//'
  else
    echo "$pid (already exited)"
  fi
}

signal_all() {
  local sig=$1
  local pid
  while read -r pid; do
    [[ -n "${pid:-}" ]] || continue
    if [[ "$DRY_RUN" -eq 1 ]]; then
      echo "would send $sig to PID $pid"
    else
      echo "sending $sig to PID $pid"
      kill "-${sig}" "$pid" 2>/dev/null || true
    fi
  done
}

pids=$(collect_pids | grep -E '^[0-9]+$' || true)
if [[ -z "${pids// }" ]]; then
  echo "No matching FDK long-run processes (patterns: fdk run, fdk tunnel)."
  exit 0
fi

echo "Matching PIDs:"
while read -r pid; do
  [[ -n "${pid:-}" ]] || continue
  describe_pid "$pid"
done <<<"$pids"

echo "$pids" | signal_all TERM

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry run complete (no signals sent)."
  exit 0
fi

sleep 1

if [[ "$FORCE" -eq 1 ]]; then
  remain=$(collect_pids | grep -E '^[0-9]+$' | wc -l | tr -d ' \n' || true)
  [[ -z "$remain" ]] && remain=0
  if [[ "$remain" -gt 0 ]]; then
    echo "Force: sending KILL to remaining match(es)"
    collect_pids | grep -E '^[0-9]+$' | signal_all KILL
  fi
fi

echo "Stop wave complete."

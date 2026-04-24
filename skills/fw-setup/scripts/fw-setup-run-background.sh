#!/usr/bin/env bash
# Run `fdk run` detached (nohup) so the invoking terminal returns immediately.
# Invoke from your app root (directory containing manifest.json).
set -euo pipefail

if ! command -v fdk >/dev/null 2>&1; then
  echo "error: fdk not found in PATH" >&2
  exit 1
fi

if [[ ! -f manifest.json ]]; then
  echo "error: manifest.json not found in $(pwd) — run this script from the app root" >&2
  exit 1
fi

LOG_DIR="${FDK_RUN_LOG_DIR:-${TMPDIR:-/tmp}/fw-setup-runs}"
mkdir -p "$LOG_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
LOG="$LOG_DIR/fdk-run-$STAMP.log"
PIDFILE="$LOG_DIR/fdk-run-$STAMP.pid"

nohup fdk run "$@" >>"$LOG" 2>&1 &
echo $! >"$PIDFILE"

echo "fdk run started in background."
echo "  pid: $(cat "$PIDFILE")"
echo "  log: $LOG"
echo "  pidfile: $PIDFILE"

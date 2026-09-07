#!/usr/bin/env bash
# Run LLM eval CLI for each supported agent and write batch bundle for all-tests-report.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TESTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BATCH_DIR="$SCRIPT_DIR/eval-batch-results"
mkdir -p "$BATCH_DIR"

agents=(claude cursor opencode)
total=${#agents[@]}
failed_runs=0
idx=0

for agent in "${agents[@]}"; do
  idx=$((idx + 1))
  if ! command -v "$agent" &>/dev/null; then
    echo ">>> SKIP: $agent CLI not on PATH"
    continue
  fi

  echo "════════════════════════════════════════════════════════"
  echo " LLM Eval [$idx/$total] agent=$agent"
  echo "════════════════════════════════════════════════════════"

  args=(--test "$SCRIPT_DIR/skill-eval-cli.js")

  set +e
  # Pass agent via env var — args after the test file are not forwarded to
  # process.argv when running under `node --test`
  FW_EVAL_CLI="$agent" node "${args[@]}"
  exit_code=$?
  set -e

  if [[ -f "$SCRIPT_DIR/eval-cli-results.json" ]]; then
    cp "$SCRIPT_DIR/eval-cli-results.json" "$BATCH_DIR/${agent}-results.json"
  fi

  if [[ $exit_code -ne 0 ]]; then
    failed_runs=$((failed_runs + 1))
    echo ">>> FAILED: $agent (exit $exit_code)"
  else
    echo ">>> PASSED: $agent"
  fi
done

node "$TESTS_DIR/lib/write-agent-bundle.mjs" eval

echo
echo "════════════════════════════════════════════════════════"
echo " LLM Eval batch complete — $failed_runs agent run(s) failed"
echo " Bundle: $BATCH_DIR/bundle.json"
echo "════════════════════════════════════════════════════════"

exit $failed_runs

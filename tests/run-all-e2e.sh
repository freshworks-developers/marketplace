#!/usr/bin/env bash
# Run all agent × workflow e2e combinations from repo source.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
E2E="$SCRIPT_DIR/e2e.sh"
RESULTS_DIR="$SCRIPT_DIR/e2e-batch-results"
mkdir -p "$RESULTS_DIR"

agents=(claude cursor codex)
workflows=(build build-review publish-guard)

summary_file="$RESULTS_DIR/summary.tsv"
: > "$summary_file"
printf 'agent\tworkflow\texit\tpassed\tfailed\twarned\n' >> "$summary_file"

total=0
failed_runs=0

for agent in "${agents[@]}"; do
  for workflow in "${workflows[@]}"; do
    total=$((total + 1))
    tag="${agent}-${workflow}"
    out_dir="${HOME}/Desktop/demo/e2e-${tag}"
    log="$RESULTS_DIR/${tag}.log"
    json_out="$RESULTS_DIR/${tag}-results.json"

    echo "════════════════════════════════════════════════════════"
    echo " E2E [$total/9] agent=$agent workflow=$workflow"
    echo "════════════════════════════════════════════════════════"

    set +e
    "$E2E" \
      --from-repo \
      --sample-app \
      --agent "$agent" \
      --workflow "$workflow" \
      --output-dir "$out_dir" \
      2>&1 | tee "$log"
    exit_code=${PIPESTATUS[0]}
    set -e

    if [[ -f "$SCRIPT_DIR/e2e-results.json" ]]; then
      cp "$SCRIPT_DIR/e2e-results.json" "$json_out"
    fi

    passed=0 failed=0 warned=0
    if [[ -f "$json_out" ]]; then
      read -r passed failed warned < <(node -e "
        const r = require('$json_out');
        console.log([r.passed||0, r.failed||0, r.warned||0].join(' '));
      ")
    fi

    printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$agent" "$workflow" "$exit_code" "$passed" "$failed" "$warned" >> "$summary_file"

    if [[ $exit_code -ne 0 ]]; then
      failed_runs=$((failed_runs + 1))
      echo ">>> FAILED: $tag (exit $exit_code)"
    else
      echo ">>> PASSED: $tag"
    fi
  done
done

echo
echo "════════════════════════════════════════════════════════"
echo " BATCH COMPLETE: $((9 - failed_runs))/9 passed, $failed_runs failed"
echo " Summary: $summary_file"
echo "════════════════════════════════════════════════════════"
column -t -s $'\t' "$summary_file" 2>/dev/null || cat "$summary_file"

exit $failed_runs

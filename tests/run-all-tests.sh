#!/usr/bin/env bash
# Runs all fw-dev-tools test layers and generates a unified HTML report
#
# Usage:
#   bash tests/run-all-tests.sh                         # installer + static + regex evals (~2 min)
#   bash tests/run-all-tests.sh --llm-eval              # + LLM behavioral evals (~15 min, needs claude CLI)
#   bash tests/run-all-tests.sh --e2e                   # + e2e (build workflow, ~30-60 min)
#   bash tests/run-all-tests.sh --e2e --workflow build-review
#   bash tests/run-all-tests.sh --e2e --agent cursor
#   bash tests/run-all-tests.sh --e2e --from-repo       # install from local source
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; RESET='\033[0m'

# ── Parse args ────────────────────────────────────────────────────────────────
RUN_E2E=false
RUN_LLM_EVAL=false
E2E_ARGS=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --e2e)         RUN_E2E=true;                       shift ;;
    --llm-eval)    RUN_LLM_EVAL=true;                  shift ;;
    --workflow)    E2E_ARGS="$E2E_ARGS --workflow $2"; shift 2 ;;
    --agent)       E2E_ARGS="$E2E_ARGS --agent $2";    shift 2 ;;
    --from-repo)   E2E_ARGS="$E2E_ARGS --from-repo";   shift ;;
    --from-tgz)    E2E_ARGS="$E2E_ARGS --from-tgz $2"; shift 2 ;;
    --auth-token)  E2E_ARGS="$E2E_ARGS --auth-token $2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

LAYERS=()
PASS_COUNTS=()
FAIL_COUNTS=()
LAYER_STATUS=()

# Extract pass/fail counts from a node:test NDJSON event file
ndjson_counts() {
  node -e "
const lines = require('fs').readFileSync(process.argv[1],'utf8').split('\n').filter(Boolean);
let p=0,f=0;
for(const l of lines){try{const e=JSON.parse(l);if(e.type==='test:pass')p++;else if(e.type==='test:fail')f++;}catch{}}
process.stdout.write(p+' '+f);
" "$1" 2>/dev/null || echo "0 0"
}

# run_layer: E2E-only helper — streams output live, then reads pass/fail counts from
# tests/e2e/e2e-results.json (written by e2e.sh). Not suitable for other layers.
run_layer() {
  local name="$1"
  local cmd="$2"
  local exit_code=0

  echo "──────────────────────────────────────────"
  echo "  $name"
  echo "──────────────────────────────────────────"
  eval "$cmd" 2>&1
  exit_code=$?

  local passes fails
  passes=$(node -e "try{const d=JSON.parse(require('fs').readFileSync('tests/e2e/e2e-results.json','utf8'));process.stdout.write(String(d.passed??0));}catch{process.stdout.write('0')}" 2>/dev/null)
  fails=$(node -e "try{const d=JSON.parse(require('fs').readFileSync('tests/e2e/e2e-results.json','utf8'));process.stdout.write(String(d.failed??0));}catch{process.stdout.write('0')}" 2>/dev/null)

  LAYERS+=("$name")
  PASS_COUNTS+=("${passes:-0}")
  FAIL_COUNTS+=("${fails:-0}")
  LAYER_STATUS+=("$exit_code")
}

# ── Layer 1: Installer tests ──────────────────────────────────────────────────
# spec reporter streams directly to stdout; NDJSON captured to file for counts
# Test file list is read from installer/package.json so new tests auto-pick up.
# Use an isolated $HOME so installer tests never write the developer's real ~/.fw-dev-tools.
ORIG_HOME="${HOME}"
INSTALLER_TEST_HOME="$(mktemp -d "${TMPDIR:-/tmp}/fw-installer-test.XXXXXX")"
export HOME="${INSTALLER_TEST_HOME}"
export FW_DEV_TOOLS_HOME="${INSTALLER_TEST_HOME}/.fw-dev-tools"
INSTALLER_TEST_FILES=$(node -e "
  const pkg = require('./installer/package.json');
  const files = pkg.scripts.test.match(/tests\/[\\w.-]+/g);
  if (!files?.length) { console.error('installer/package.json test script has no test files'); process.exit(1); }
  process.stdout.write(files.join(' '));
")
echo "──────────────────────────────────────────"
echo "  Installer Tests"
echo "──────────────────────────────────────────"
INST_EXIT=0
(cd installer && node --test --test-concurrency=1 \
  --test-reporter=spec --test-reporter-destination=stdout \
  --test-reporter=../tests/ndjson-reporter.mjs \
  --test-reporter-destination=../tests/installer-results.ndjson \
  $INSTALLER_TEST_FILES) || INST_EXIT=$?
read -r INST_PASS INST_FAIL <<< "$(ndjson_counts tests/installer-results.ndjson)"
LAYERS+=("Installer Tests"); PASS_COUNTS+=("$INST_PASS"); FAIL_COUNTS+=("$INST_FAIL"); LAYER_STATUS+=("$INST_EXIT")
export HOME="${ORIG_HOME}"
unset FW_DEV_TOOLS_HOME
rm -rf "${INSTALLER_TEST_HOME}"

# ── Layer 2: Static skill tests ───────────────────────────────────────────────
echo "──────────────────────────────────────────"
echo "  Static Skill Tests"
echo "──────────────────────────────────────────"
STAT_EXIT=0
node --test \
  --test-reporter=spec --test-reporter-destination=stdout \
  --test-reporter=./tests/ndjson-reporter.mjs \
  --test-reporter-destination=tests/static-results.ndjson \
  tests/static/skill-static.test.js \
  tests/static/bump-version.test.mjs \
  tests/static/repack-app-zip.test.mjs \
  tests/e2e/e2e-publish-guard-parser.test.mjs \
  tests/e2e/e2e-publish-metrics-parser.test.mjs \
  tests/e2e/e2e-skill-paths-parser.test.mjs \
  tests/e2e/e2e-meta-scripts-parser.test.mjs || STAT_EXIT=$?
read -r STAT_PASS STAT_FAIL <<< "$(ndjson_counts tests/static-results.ndjson)"
LAYERS+=("Static Skill Tests"); PASS_COUNTS+=("$STAT_PASS"); FAIL_COUNTS+=("$STAT_FAIL"); LAYER_STATUS+=("$STAT_EXIT")

# ── Layer 3: Regex evals ──────────────────────────────────────────────────────
echo "──────────────────────────────────────────"
echo "  Regex Eval Tests"
echo "──────────────────────────────────────────"
REG_EXIT=0
node --test \
  --test-reporter=spec --test-reporter-destination=stdout \
  --test-reporter=./tests/ndjson-reporter.mjs \
  --test-reporter-destination=tests/eval-regex-results.ndjson \
  tests/eval/regex/fw-app-dev.regex.test.mjs \
  tests/eval/regex/fw-setup.regex.test.mjs \
  tests/eval/regex/fw-review.regex.test.mjs \
  tests/eval/regex/fw-publish.regex.test.mjs \
  tests/eval/regex/fw-ai-actions.regex.test.mjs \
  tests/eval/regex/spec.regex.test.mjs || REG_EXIT=$?
read -r REG_PASS REG_FAIL <<< "$(ndjson_counts tests/eval-regex-results.ndjson)"
LAYERS+=("Regex Eval Tests"); PASS_COUNTS+=("$REG_PASS"); FAIL_COUNTS+=("$REG_FAIL"); LAYER_STATUS+=("$REG_EXIT")

# ── Layer 4: LLM behavioral evals (opt-in) ───────────────────────────────────
if [ "$RUN_LLM_EVAL" = true ]; then
  # Detect which CLI to use; pass via env var (process.argv args are not
  # forwarded to test files under `node --test`)
  FW_EVAL_CLI=""
  if ! command -v claude &>/dev/null && command -v cursor &>/dev/null; then
    FW_EVAL_CLI="cursor"
  fi
  if command -v claude &>/dev/null || command -v cursor &>/dev/null; then
    echo "──────────────────────────────────────────"
    echo "  LLM Eval Tests (CLI)"
    echo "──────────────────────────────────────────"
    LLM_EXIT=0
    FW_EVAL_CLI="$FW_EVAL_CLI" node --test \
      --test-reporter=spec --test-reporter-destination=stdout \
      --test-reporter=./tests/ndjson-reporter.mjs \
      --test-reporter-destination=tests/eval-cli-results.ndjson \
      tests/eval/skill-eval-cli.js || LLM_EXIT=$?
    read -r LLM_PASS LLM_FAIL <<< "$(ndjson_counts tests/eval-cli-results.ndjson)"
    LAYERS+=("LLM Eval Tests (CLI)"); PASS_COUNTS+=("$LLM_PASS"); FAIL_COUNTS+=("$LLM_FAIL"); LAYER_STATUS+=("$LLM_EXIT")
  else
    LAYERS+=("LLM Eval Tests (CLI)")
    PASS_COUNTS+=("skipped")
    FAIL_COUNTS+=("0")
    LAYER_STATUS+=("0")
    printf "  ${YELLOW}⚠${RESET} LLM Eval Tests skipped — install claude or cursor CLI to run\n"
  fi
else
  LAYERS+=("LLM Eval Tests (CLI)")
  PASS_COUNTS+=("skipped")
  FAIL_COUNTS+=("0")
  LAYER_STATUS+=("0")
  printf "  ${YELLOW}⚠${RESET} LLM Eval Tests skipped — run with --llm-eval to include (~15 min)\n"
fi

# ── Layer 5: E2E (opt-in) ─────────────────────────────────────────────────────
if [ "$RUN_E2E" = true ]; then
  if [[ "$E2E_ARGS" != *"--workflow"* ]]; then
    E2E_ARGS="$E2E_ARGS --workflow build"
  fi
  run_layer "E2E Tests" \
    "bash tests/e2e/e2e.sh ${E2E_ARGS}"
else
  LAYERS+=("E2E Tests")
  PASS_COUNTS+=("skipped")
  FAIL_COUNTS+=("0")
  LAYER_STATUS+=("0")
  printf "  ${YELLOW}⚠${RESET} E2E Tests skipped — run with --e2e to include\n"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════"
echo "  ALL TESTS SUMMARY"
echo "══════════════════════════════════════════"
OVERALL=0
for i in "${!LAYERS[@]}"; do
  name="${LAYERS[$i]}"
  status="${LAYER_STATUS[$i]}"
  passes="${PASS_COUNTS[$i]}"
  fails="${FAIL_COUNTS[$i]}"
  if [ "$status" -eq 0 ]; then
    printf "  ${GREEN}✓${RESET} %-35s pass:%-6s fail:%s\n" "$name" "$passes" "$fails"
  else
    printf "  ${RED}✗${RESET} %-35s pass:%-6s fail:%s\n" "$name" "$passes" "$fails"
    OVERALL=1
  fi
done
echo "══════════════════════════════════════════"
echo ""

# ── Write all-tests-results.json ──────────────────────────────────────────────
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

LAYERS_JSON=""
for i in "${!LAYERS[@]}"; do
  [ "$i" -gt 0 ] && LAYERS_JSON+=","
  LAYERS_JSON+="{\"name\":\"${LAYERS[$i]}\",\"passes\":\"${PASS_COUNTS[$i]}\",\"fails\":\"${FAIL_COUNTS[$i]}\",\"exit_code\":${LAYER_STATUS[$i]}}"
done

node -e "
const fs = require('fs');
const layers = [${LAYERS_JSON}];
const data = {
  timestamp: '${TS}',
  overall: ${OVERALL} === 0 ? 'pass' : 'fail',
  layers: layers.map(l => ({
    name: l.name,
    passes: l.passes,
    fails: l.fails,
    exit_code: l.exit_code
  }))
};
fs.writeFileSync('tests/all-tests-results.json', JSON.stringify(data, null, 2));
"

# Generate unified HTML report
node tests/all-tests-report.js

exit $OVERALL

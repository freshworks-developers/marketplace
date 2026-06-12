#!/usr/bin/env bash
# e2e test: install fw-dev-tools → generate app via LLM → fdk validate → structural checks → uninstall
set -euo pipefail

# ─── defaults ────────────────────────────────────────────────────────────────
BRANCH="main"
CLIENT="claude"
AUTH_TOKEN=""
OUTPUT_DIR="${HOME:-$(cd ~ && pwd)}/Desktop/demo/e2e-test-app"
PUBLISH=false
SKIP_BUILD=false
APP_PROMPT="Build a Freshdesk-Asana sync app that creates an Asana task whenever a Freshdesk ticket is created, and syncs ticket status changes back. Use iparams for Asana PAT and project ID."

PASS=0
FAIL=0
WARN=0

# ensure HOME is always set
HOME="${HOME:-$(cd ~ && pwd)}"

# ─── always write report on exit (even if script dies mid-run) ───────────────
_on_exit() {
  local exit_code=$?
  # only write if summary() hasn't already run (it sets _SUMMARY_DONE)
  if [[ "${_SUMMARY_DONE:-}" != "1" ]]; then
    summary
  fi
  exit $exit_code
}
trap _on_exit EXIT
_SUMMARY_DONE=0

# ─── colours ─────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; RESET='\033[0m'

CURRENT_PHASE="Setup"
CHECK_RESULTS=()

pass() { printf '%s✓%s %s\n' "${GREEN}" "${RESET}" "$1"; PASS=$((PASS+1)); CHECK_RESULTS+=("pass|${CURRENT_PHASE}|$1"); }
fail() { printf '%s✗%s %s\n' "${RED}"   "${RESET}" "$1"; FAIL=$((FAIL+1)); CHECK_RESULTS+=("fail|${CURRENT_PHASE}|$1"); }
warn() { printf '%s⚠%s %s\n' "${YELLOW}" "${RESET}" "$1"; WARN=$((WARN+1)); CHECK_RESULTS+=("warn|${CURRENT_PHASE}|$1"); }
header() {
  CURRENT_PHASE="${1#Phase [0-9]*: }"   # strip "Phase N: " prefix for cleaner phase names
  echo; echo "──────────────────────────────────────────"
  echo "  $1"
  echo "──────────────────────────────────────────"
}

# ─── usage ───────────────────────────────────────────────────────────────────
usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  --branch <name>       Installer branch (default: main)
  --client <name>       LLM client: claude | cursor | codex (default: claude)
  --auth-token <jwt>    JWT for fw-publish (required when --publish is set)
  --output-dir <path>   App output directory (default: ~/Desktop/demo/e2e-test-app)
  --app-prompt <text>   App generation prompt (default: Freshdesk-Asana sync)
  --publish             Run the fw-publish phase (requires --auth-token)
  --skip-build          Skip Phase 2 (use when app already built manually in --output-dir)
  -h, --help            Show this help
EOF
  exit 0
}

# ─── parse args ──────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)       BRANCH="$2";       shift 2 ;;
    --client)       CLIENT="$2";       shift 2 ;;
    --auth-token)   AUTH_TOKEN="$2";   shift 2 ;;
    --output-dir)   OUTPUT_DIR="${2/#\~/$HOME}"; shift 2 ;;
    --app-prompt)   APP_PROMPT="$2";   shift 2 ;;
    --publish)      PUBLISH=true;      shift   ;;
    --skip-build)   SKIP_BUILD=true;   shift   ;;
    -h|--help)      usage              ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

# ─── validate client ─────────────────────────────────────────────────────────
if [[ "$CLIENT" != "claude" && "$CLIENT" != "cursor" && "$CLIENT" != "codex" ]]; then
  echo "Error: --client must be claude | cursor | codex"; exit 1
fi

# ─── check LLM CLI availability ──────────────────────────────────────────────
check_cli() {
  case "$CLIENT" in
    claude)
      if ! command -v claude &>/dev/null; then
        echo "Error: 'claude' CLI not found. Install from https://claude.ai/code"; exit 1
      fi
      ;;
    cursor)
      if ! command -v cursor &>/dev/null; then
        echo "Error: 'cursor' CLI not found. Install Cursor and ensure 'cursor' is on PATH."; exit 1
      fi
      ;;
    codex)
      if ! command -v codex &>/dev/null; then
        echo "Error: 'codex' CLI not found. Install with: npm install -g @openai/codex"; exit 1
      fi
      ;;
  esac
}

# ─── invoke LLM ──────────────────────────────────────────────────────────────
invoke_llm() {
  local prompt="$1"
  local workdir="$2"
  echo "  Invoking $CLIENT with prompt..."
  case "$CLIENT" in
    claude)
      echo "$prompt" | claude --dangerously-skip-permissions 2>&1
      ;;
    cursor)
      cursor agent --print --force --approve-mcps --workspace "$workdir" "$prompt" 2>&1
      ;;
    codex)
      codex --dangerously-auto-approve-everything \
        --full-auto \
        "$prompt" 2>&1
      ;;
  esac
}

# ─── phase: install ──────────────────────────────────────────────────────────
phase_install() {
  header "Phase 1: Install fw-dev-tools (branch: $BRANCH)"

  local install_cmd
  if [[ "$BRANCH" == "main" ]]; then
    install_cmd="npx github:freshworks-developers/fw-dev-tools install --tools $CLIENT --yes"
  else
    install_cmd="npx github:freshworks-developers/fw-dev-tools#$BRANCH install --tools $CLIENT --yes"
  fi

  echo "  Running: $install_cmd"
  if eval "$install_cmd"; then
    pass "Installer exited 0"
  else
    fail "Installer failed (exit $?)"
    echo "  Aborting — cannot proceed without installed skills."
    exit 1
  fi

  # verify install paths
  case "$CLIENT" in
    claude)
      [[ -f "$HOME/.claude/CLAUDE.md" ]]         && pass "~/.claude/CLAUDE.md exists"       || fail "~/.claude/CLAUDE.md missing"
      [[ -d "$HOME/.claude/skills/fw-app-dev" ]] && pass "~/.claude/skills/fw-app-dev exists" || fail "~/.claude/skills/fw-app-dev missing"
      [[ -d "$HOME/.claude/skills/fw-review" ]]  && pass "~/.claude/skills/fw-review exists"  || fail "~/.claude/skills/fw-review missing"
      [[ -d "$HOME/.claude/skills/fw-publish" ]] && pass "~/.claude/skills/fw-publish exists"  || fail "~/.claude/skills/fw-publish missing"
      ;;
    cursor)
      [[ -f "$HOME/.cursor/rules/fw-dev-tools.mdc" ]] && pass "Cursor rules installed" || fail "Cursor rules missing"
      [[ -d "$HOME/.cursor/skills/fw-app-dev" ]]              && pass "~/.cursor/skills/fw-app-dev exists" || fail "~/.cursor/skills/fw-app-dev missing"
      ;;
    codex)
      [[ -d "$HOME/.codex/skills/fw-app-dev" ]] && pass "~/.codex/skills/fw-app-dev exists" || fail "~/.codex/skills/fw-app-dev missing"
      ;;
  esac

  [[ -f "$HOME/.fw-dev-tools/install.json" ]] && pass "~/.fw-dev-tools/install.json written" || fail "~/.fw-dev-tools/install.json missing"
}

# ─── phase: build app ─────────────────────────────────────────────────────────
phase_build() {
  header "Phase 2: Build app via $CLIENT"

  # wipe any previous run so the LLM starts from a clean slate
  if [[ -d "$OUTPUT_DIR" ]]; then
    echo "  Cleaning previous run at $OUTPUT_DIR"
    rm -rf "$OUTPUT_DIR"
  fi
  mkdir -p "$OUTPUT_DIR"
  echo "  Output dir: $OUTPUT_DIR"

  # craft the full prompt including the output dir so the LLM creates files there
  local full_prompt
  full_prompt="Working directory: $OUTPUT_DIR

$APP_PROMPT

Use the fw-app-dev skill (skills/fw-app-dev/SKILL.md). Follow the mandatory skill order:
1. fw-setup (check toolchain only — /fw-setup-status)
2. fw-app-dev (build the app, run fdk validate until 0 errors)
3. fw-review (MANDATORY before publish)
Create all app files inside $OUTPUT_DIR. Write app.info per skill instructions."

  local log="$OUTPUT_DIR/e2e-llm-output.log"
  local llm_exit=0
  echo "  Invoking $CLIENT (output streaming below)..."
  echo "  Log: $log"
  (cd "$OUTPUT_DIR" && invoke_llm "$full_prompt" "$OUTPUT_DIR") 2>&1 | tee "$log" || llm_exit=${PIPESTATUS[0]}
  if [[ $llm_exit -ne 0 ]]; then
    fail "LLM invocation failed (exit $llm_exit)"
  else
    pass "LLM invocation complete"
  fi
}

# ─── phase: structural checks ─────────────────────────────────────────────────
phase_structure() {
  header "Phase 3: App structure checks"

  # manifest
  if [[ -f "$OUTPUT_DIR/manifest.json" ]]; then
    pass "manifest.json exists"
    local pv
    pv=$(node -e "const m=require('$OUTPUT_DIR/manifest.json'); console.log(m['platform-version'] || '')" 2>/dev/null || true)
    [[ "$pv" == "3.0" ]] && pass "platform-version is 3.0" || fail "platform-version is '$pv' (expected 3.0)"
  else
    fail "manifest.json missing"
  fi

  # mandatory files
  [[ -f "$OUTPUT_DIR/README.md" ]]                        && pass "README.md exists"                       || fail "README.md missing"
  [[ -f "$OUTPUT_DIR/config/iparams.json" ]]              && pass "config/iparams.json exists"             || warn "config/iparams.json missing (may use iparams.html)"
  [[ -f "$OUTPUT_DIR/app/styles/images/icon.svg" ]]       && pass "app/styles/images/icon.svg exists"      || fail "app/styles/images/icon.svg missing (fdk validate will fail)"
}

# ─── phase: fdk validate ──────────────────────────────────────────────────────
phase_validate() {
  header "Phase 4: fdk validate"

  if ! command -v fdk &>/dev/null; then
    fail "fdk not on PATH — cannot validate"
    return
  fi

  local fdk_out exit_code
  fdk_out=$(cd "$OUTPUT_DIR" && fdk validate 2>&1) || exit_code=$?
  exit_code=${exit_code:-0}
  echo "$fdk_out"

  if [[ $exit_code -eq 0 ]]; then
    pass "fdk validate exited 0"
  else
    fail "fdk validate exited $exit_code"
  fi

  # extract error counts from output
  local platform_errors lint_errors
  platform_errors=$(echo "$fdk_out" | grep -oE '[0-9]+ platform error' | grep -oE '[0-9]+' || echo "0")
  lint_errors=$(echo "$fdk_out" | grep -oE '[0-9]+ lint error' | grep -oE '[0-9]+' || echo "0")

  [[ "${platform_errors:-0}" -eq 0 ]] && pass "0 platform errors" || fail "$platform_errors platform errors"
  [[ "${lint_errors:-0}" -eq 0 ]]     && pass "0 lint errors"     || fail "$lint_errors lint errors"
}

# ─── phase: app.info checks ───────────────────────────────────────────────────
phase_appinfo() {
  header "Phase 5: app.info checks"

  local ai="$OUTPUT_DIR/app.info"

  if [[ ! -f "$ai" ]]; then
    fail "app.info missing — LLM did not write metrics"
    return
  fi
  pass "app.info exists"

  # parse with node — write script to a temp file to avoid process.argv[1] = '-' issue
  local _script
  _script=$(mktemp /tmp/e2e-appinfo-XXXXXX.js)
  cat > "$_script" <<'EOF'
const fs = require('fs');
const ai = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
let p = 0, f = 0;

function check(desc, cond) {
  if (cond) { console.log('  PASS: ' + desc); p++; }
  else       { console.log('  FAIL: ' + desc); f++; }
}
function warn(desc) { console.log('  WARN: ' + desc); }

// top-level fields
check('tracking_id is 20 chars',  ai.tracking_id && ai.tracking_id.length === 20);
check('ide_client set',           ai.ide_client && ai.ide_client !== '');
check('start_time set',           ai.start_time && ai.start_time !== '');

// fw-app-dev block
const ad = ai['fw-app-dev'];
if (!ad) { console.log('  FAIL: fw-app-dev block missing'); f++; }
else {
  check('fw-app-dev.invoked > 0',       ad.invoked > 0);
  check('fw-app-dev.skill_version set', ad.skill_version && ad.skill_version !== '');
  check('fw-app-dev.validate_iterations >= 0', typeof ad.validate_iterations === 'number');
  if (ad.invoked === 0) warn('fw-app-dev.invoked is 0 — LLM may not have followed skill order');
}

// fw-review block
const rv = ai['fw-review'];
if (!rv) { console.log('  FAIL: fw-review block missing'); f++; }
else {
  if (rv.invoked > 0) { console.log('  PASS: fw-review.invoked > 0'); p++; }
  else { console.log('  WARN: fw-review.invoked is 0 — LLM may have skipped mandatory review'); }
  check('fw-review.skill_version set', rv.skill_version && rv.skill_version !== '');
}

process.exit(f > 0 ? 1 : 0);
EOF
  node "$_script" "$ai"; local node_exit=$?
  rm -f "$_script"
  [[ $node_exit -eq 0 ]] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
}

# ─── phase: publish ──────────────────────────────────────────────────────────
phase_publish() {
  header "Phase 6: fw-publish"

  if [[ -z "$AUTH_TOKEN" ]]; then
    warn "--publish set but no --auth-token provided — skipping publish phase"
    return
  fi

  local publish_prompt
  publish_prompt="Working directory: $OUTPUT_DIR
Auth token: $AUTH_TOKEN

Follow the fw-publish skill (skills/fw-publish/SKILL.md) to publish the app at $OUTPUT_DIR.
The JWT token is: $AUTH_TOKEN
Use this as the Bearer token for the MCP server auth."

  local pub_out
  pub_out=$(cd "$OUTPUT_DIR" && invoke_llm "$publish_prompt" "$OUTPUT_DIR")
  echo "$pub_out" > "$OUTPUT_DIR/e2e-publish-output.log"
  echo "$pub_out" | tail -20

  if echo "$pub_out" | grep -qi "successfully\|submitted\|publish.*success\|get_app_status"; then
    pass "Publish appears successful (log: e2e-publish-output.log)"
  else
    warn "Could not confirm publish success — check e2e-publish-output.log"
  fi
}

# ─── phase: uninstall ────────────────────────────────────────────────────────
phase_uninstall() {
  header "Phase 7: Uninstall"

  local uninstall_ref
  if [[ "$BRANCH" == "main" ]]; then
    uninstall_ref="github:freshworks-developers/fw-dev-tools"
  else
    uninstall_ref="github:freshworks-developers/fw-dev-tools#$BRANCH"
  fi
  if npx "$uninstall_ref" uninstall --tools "$CLIENT" --yes; then
    pass "Uninstall exited 0"
  else
    fail "Uninstall failed"
  fi

  # verify cleanup
  case "$CLIENT" in
    claude)
      [[ ! -f "$HOME/.claude/CLAUDE.md" ]] && pass "~/.claude/CLAUDE.md removed" || fail "~/.claude/CLAUDE.md still present"
      [[ ! -d "$HOME/.claude/skills/fw-app-dev" ]] && pass "~/.claude/skills/fw-app-dev removed" || fail "~/.claude/skills/fw-app-dev still present"
      ;;
    cursor)
      [[ ! -f "$HOME/.cursor/rules/fw-dev-tools.mdc" ]] && pass "Cursor rules removed" || fail "Cursor rules still present"
      ;;
    codex)
      [[ ! -d "$HOME/.codex/skills/fw-app-dev" ]] && pass "~/.codex/skills/fw-app-dev removed" || fail "~/.codex/skills/fw-app-dev still present"
      ;;
  esac

  [[ ! -f "$HOME/.fw-dev-tools/install.json" ]] && pass "install.json removed" || fail "install.json still present"
}

# ─── summary + JSON results ───────────────────────────────────────────────────
summary() {
  header "Results"
  printf '  %sPassed:%s   %s\n' "${GREEN}" "${RESET}" "$PASS"
  printf '  %sFailed:%s   %s\n' "${RED}"   "${RESET}" "$FAIL"
  printf '  %sWarnings:%s %s\n' "${YELLOW}" "${RESET}" "$WARN"
  echo

  # write e2e-results.json for the HTML reporter
  local ts overall
  ts=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  overall=$( [[ $FAIL -eq 0 ]] && echo "pass" || echo "fail" )

  # build checks JSON array from accumulated results
  local checks_json
  checks_json=$(printf '%s\n' "${CHECK_RESULTS[@]+"${CHECK_RESULTS[@]}"}" | python3 -c "
import sys, json
lines = [l.rstrip() for l in sys.stdin if l.strip()]
checks = []
for line in lines:
    parts = line.split('|', 2)
    if len(parts) == 3:
        checks.append({'status': parts[0], 'phase': parts[1], 'label': parts[2]})
print(json.dumps(checks))
" 2>/dev/null || echo "[]")

  cat > "$(dirname "$0")/e2e-results.json" <<EOF
{
  "timestamp": "$ts",
  "branch": "$BRANCH",
  "client": "$CLIENT",
  "outputDir": "$OUTPUT_DIR",
  "overall": "$overall",
  "passed": $PASS,
  "failed": $FAIL,
  "warned": $WARN,
  "checks": $checks_json
}
EOF

  echo "Results written to tests/e2e-results.json"

  # generate HTML report if node is available
  if command -v node &>/dev/null; then
    node "$(dirname "$0")/e2e-report.js" && echo "Report written to tests/e2e-report.html"
  fi

  _SUMMARY_DONE=1

  if [[ $FAIL -eq 0 ]]; then
    printf '%sE2E test passed.%s\n' "${GREEN}" "${RESET}"
    exit 0
  else
    printf '%sE2E test FAILED — %s check(s) failed.%s\n' "${RED}" "$FAIL" "${RESET}"
    exit 1
  fi
}

# ─── main ────────────────────────────────────────────────────────────────────
echo "fw-dev-tools e2e test"
echo "  branch:     $BRANCH"
echo "  client:     $CLIENT"
echo "  output-dir: $OUTPUT_DIR"
echo "  publish:    $( $PUBLISH && [[ -n "$AUTH_TOKEN" ]] && echo yes || echo no )"

check_cli
phase_install
phase_build
phase_structure
phase_validate
phase_appinfo
$PUBLISH && phase_publish
phase_uninstall
summary

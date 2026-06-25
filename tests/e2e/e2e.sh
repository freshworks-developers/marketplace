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
WORKFLOW="build"   # build | build-review | publish-guard | cold-build | cold-build-review
WORKFLOW_LABEL=""
REQUIRE_REVIEW=false
SAMPLE_APP=false
STRIP_FDK=false
E2E_FDK_SNAPSHOT=""
INSTALL_TGZ=""     # path to local .tgz when --from-tgz is used
INSTALL_FROM_REPO=false   # run directly from repo source (node installer/bin/cli.js)
APP_PROMPT="Build a Freshdesk-Asana sync app that creates an Asana task whenever a Freshdesk ticket is created, and syncs ticket status changes back. Use iparams for Asana PAT and project ID."
SAMPLE_APP_PROMPT="Build a Freshdesk serverless app that logs ticket creation events."
SAMPLE_APP_DIR="${HOME}/Desktop/demo/e2e-sample-app"

PASS=0
FAIL=0
WARN=0

# ensure HOME is always set
HOME="${HOME:-$(cd ~ && pwd)}"

# ─── always write report on exit (even if script dies mid-run) ───────────────
_on_exit() {
  local exit_code=$?
  if [[ "${STRIP_FDK:-false}" == "true" ]]; then
    restore_fdk_after_strip || true
  fi
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
_deprecate_flag() {
  echo "e2e: $1 is deprecated — use $2" >&2
}

_normalize_workflow() {
  case "$1" in
    build|build-only)           echo "build" ;;
    build-review)               echo "build-review" ;;
    publish-guard|publish-blocked) echo "publish-guard" ;;
    *)                          echo "$1" ;;
  esac
}

_apply_sample_app() {
  if [[ "$SAMPLE_APP" == "true" ]]; then
    APP_PROMPT="$SAMPLE_APP_PROMPT"
    OUTPUT_DIR="$SAMPLE_APP_DIR"
  fi
}

usage() {
  _SUMMARY_DONE=1
  cat <<EOF
Usage: $0 [options]

Installer source (pick one):
  --from-repo           Install from this marketplace repo (local dev)
  --from-tgz <path>     Install from a local .tgz pack
  --branch <tag>        npm dist-tag or version (default: main → latest). Unpublished git work: --from-repo

LLM agent:
  --agent <name>        claude | cursor | codex (default: claude)

App under test:
  --sample-app          Serverless ticket-logger prompt + ~/Desktop/demo/e2e-sample-app
  --prompt <text>       Custom app generation prompt
  --output-dir <path>   App directory (default: ~/Desktop/demo/e2e-test-app)

Workflow (what to exercise):
  --workflow <name>     build | build-review | publish-guard | cold-build | cold-build-review
                        build / build-review — install → LLM build → validate → uninstall
                        cold-build / cold-build-review — same, but FDK is removed first;
                          LLM must run /fw-setup-install before building
                        publish-guard — publish without review must be refused
  --strip-fdk           Remove FDK from nvm globals before LLM build (same as cold-build)
  --require-review      Fail if fw-review.invoked is 0 after build
  --skip-build          Skip LLM app generation (reuse app in --output-dir)
  --publish             Run fw-publish (requires --auth-token)

Other:
  --auth-token <jwt>    JWT for fw-publish
  -h, --help            Show this help

Legacy aliases (still accepted):
  --local-src           → --from-repo
  --local <path>        → --from-tgz <path>
  --client              → --agent
  --app-prompt          → --prompt
  --preset serverless-ticket-logger → --sample-app
  --scenario            → --workflow (build-only → build, publish-blocked → publish-guard)
  --strict-review       → --require-review
  --skip-llm            → --skip-build
EOF
  exit 0
}

# ─── parse args ──────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)         BRANCH="$2";              shift 2 ;;
    --from-repo)      INSTALL_FROM_REPO=true;   shift   ;;
    --from-tgz)       INSTALL_TGZ="${2/#\~/$HOME}"; shift 2 ;;
    --agent)          CLIENT="$2";              shift 2 ;;
    --client)         _deprecate_flag "--client" "--agent"; CLIENT="$2"; shift 2 ;;
    --auth-token)     AUTH_TOKEN="$2";          shift 2 ;;
    --output-dir)     OUTPUT_DIR="${2/#\~/$HOME}"; shift 2 ;;
    --prompt)         APP_PROMPT="$2";          shift 2 ;;
    --app-prompt)     _deprecate_flag "--app-prompt" "--prompt"; APP_PROMPT="$2"; shift 2 ;;
    --sample-app)     SAMPLE_APP=true;          shift   ;;
    --preset)
      if [[ "$2" == "serverless-ticket-logger" ]]; then
        _deprecate_flag "--preset serverless-ticket-logger" "--sample-app"
        SAMPLE_APP=true
        shift 2
      else
        echo "Error: unknown --preset '$2' (use --sample-app)"; exit 1
      fi
      ;;
    --workflow)
      case "$2" in
        cold-build)
          STRIP_FDK=true
          WORKFLOW=build
          WORKFLOW_LABEL=cold-build
          ;;
        cold-build-review)
          STRIP_FDK=true
          WORKFLOW=build-review
          REQUIRE_REVIEW=true
          WORKFLOW_LABEL=cold-build-review
          ;;
        *)
          WORKFLOW="$(_normalize_workflow "$2")"
          WORKFLOW_LABEL="$WORKFLOW"
          ;;
      esac
      shift 2
      ;;
    --strip-fdk)      STRIP_FDK=true;           shift   ;;
    --require-review|--strict-review)
      [[ "$1" == "--strict-review" ]] && _deprecate_flag "--strict-review" "--require-review"
      REQUIRE_REVIEW=true
      shift
      ;;
    --publish)        PUBLISH=true;             shift   ;;
    --skip-build)     SKIP_BUILD=true;          shift   ;;
    --skip-llm)       _deprecate_flag "--skip-llm" "--skip-build"; SKIP_BUILD=true; shift ;;
  # legacy aliases
    --local-src)      _deprecate_flag "--local-src" "--from-repo"; INSTALL_FROM_REPO=true; shift ;;
    --local)          _deprecate_flag "--local" "--from-tgz"; INSTALL_TGZ="${2/#\~/$HOME}"; shift 2 ;;
    --scenario)
      _deprecate_flag "--scenario" "--workflow"
      WORKFLOW="$(_normalize_workflow "$2")"
      shift 2
      ;;
    -h|--help)        usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

_apply_sample_app

if [[ -z "$WORKFLOW_LABEL" ]]; then
  WORKFLOW_LABEL="$WORKFLOW"
fi
if [[ "$STRIP_FDK" == "true" && "$WORKFLOW_LABEL" == "$WORKFLOW" ]]; then
  WORKFLOW_LABEL="cold-${WORKFLOW}"
fi

if [[ "$WORKFLOW" != "build" && "$WORKFLOW" != "build-review" && "$WORKFLOW" != "publish-guard" ]]; then
  echo "Error: --workflow must be build | build-review | publish-guard | cold-build | cold-build-review"; exit 1
fi

if [[ "$STRIP_FDK" == "true" && "$WORKFLOW" == "publish-guard" ]]; then
  echo "Error: --strip-fdk / cold-build is not compatible with publish-guard"; exit 1
fi

if [[ "$WORKFLOW" == "publish-guard" ]]; then
  SKIP_BUILD=true
fi

if [[ "$WORKFLOW" == "build-review" ]]; then
  REQUIRE_REVIEW=true
fi

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

# Activate Node 24.11.x for FDK 10.x. Homebrew/system Node on PATH breaks fdk's #!/usr/bin/env node.
activate_fdk_node() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  local node_line="24.11" node_bin=""

  if [[ -f "$OUTPUT_DIR/.nvmrc" ]]; then
    node_line=$(tr -d '[:space:]' < "$OUTPUT_DIR/.nvmrc")
  fi

  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck source=/dev/null
    . "$NVM_DIR/nvm.sh"
    nvm use "$node_line" >/dev/null 2>&1 || nvm use 24.11 >/dev/null 2>&1 || true
    node_bin=$(nvm which "$node_line" 2>/dev/null || nvm which 24.11 2>/dev/null || true)
    if [[ -n "$node_bin" && "$node_bin" != *"/.nvm/"* ]]; then
      node_bin=""
    fi
  fi

  if [[ -z "$node_bin" || ! -x "$node_bin" ]]; then
    local _candidate
    _candidate=$(ls -d "$NVM_DIR/versions/node/v24.11."*/bin/node 2>/dev/null | sort -V | tail -1 || true)
    [[ -n "$_candidate" && -x "$_candidate" ]] && node_bin="$_candidate"
  fi

  if [[ -n "$node_bin" && -x "$node_bin" ]]; then
    export PATH="$(dirname "$node_bin"):$PATH"
  fi

  local node_ver
  node_ver=$(node -v 2>/dev/null || echo "unknown")
  if [[ "$node_ver" != v24.11* ]]; then
    warn "Node $node_ver active — FDK 10.x expects v24.11.x (nvm install 24.11)"
  fi
}

fdk_on_path() {
  command -v fdk &>/dev/null
}

snapshot_fdk_before_strip() {
  if fdk_on_path; then
    E2E_FDK_SNAPSHOT=$(fdk version 2>&1 | head -1 | tr -d '\n' || echo "present")
  else
    E2E_FDK_SNAPSHOT=""
  fi
}

strip_fdk_globals() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
    warn "nvm not found — cannot strip global FDK"
    return 1
  fi
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  local node_ver
  for node_ver in 24.11 24 18; do
    nvm use "$node_ver" >/dev/null 2>&1 || continue
    npm uninstall -g @freshworks/fdk fdk 2>/dev/null || true
  done
  hash -r 2>/dev/null || true
}

restore_fdk_after_strip() {
  [[ -n "$E2E_FDK_SNAPSHOT" ]] || return 0
  fdk_on_path && return 0
  echo "  e2e: restoring FDK after cold-start run..."
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [[ -s "$NVM_DIR/nvm.sh" ]] || return 1
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm use 24.11 >/dev/null 2>&1 || nvm install 24.11 >/dev/null 2>&1 || true
  npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz >/dev/null 2>&1 || true
  hash -r 2>/dev/null || true
}

phase_strip_fdk() {
  header "Phase 1b: Strip FDK (cold start)"

  snapshot_fdk_before_strip
  if [[ -n "$E2E_FDK_SNAPSHOT" ]]; then
    pass "FDK was on PATH before strip ($E2E_FDK_SNAPSHOT)"
  else
    warn "FDK was not on PATH before strip"
  fi

  if strip_fdk_globals; then
    pass "attempted global FDK uninstall via nvm"
  fi

  if fdk_on_path; then
    fail "fdk still on PATH after strip — cold start not simulated"
  else
    pass "fdk not on PATH (cold start ready)"
  fi
}

phase_fw_setup_verify() {
  header "Phase 2b: fw-setup verification"

  local log="$OUTPUT_DIR/e2e-llm-output.log"
  local _llm_text _setup_evidence=false
  _llm_text="$(llm_log_text "$log")"

  if grep -qiE 'fw-setup-install|/fw-setup-install|fw-setup install' <<< "$_llm_text"; then
    _setup_evidence=true
  elif grep -qiE 'fw-setup.{0,40}(install|installed)|install.{0,40}fw-setup|latest-v24\.tgz' <<< "$_llm_text"; then
    _setup_evidence=true
  elif [[ -f "$log" ]] && grep -q 'fw-setup-install\.md' "$log" 2>/dev/null; then
    _setup_evidence=true
  fi

  if [[ "$_setup_evidence" == "true" ]]; then
    pass "LLM ran fw-setup install flow (log or tool evidence)"
  else
    fail "LLM did not show fw-setup install evidence (required when FDK was stripped)"
  fi

  activate_fdk_node
  if fdk_on_path; then
    pass "fdk on PATH after LLM session"
    local ver
    ver=$(fdk version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)
    [[ -n "$ver" ]] && pass "fdk version reported: $ver" || warn "fdk version output inconclusive"
  else
    fail "fdk still missing after LLM — fw-setup install did not restore toolchain"
  fi

  local ai="$OUTPUT_DIR/.meta.json"
  if [[ -f "$ai" ]]; then
    local su_invoked
    su_invoked=$(node -e "const m=require('$ai'); console.log((m['fw-setup']||{}).invoked||0)" 2>/dev/null || echo 0)
    [[ "${su_invoked:-0}" -gt 0 ]] && pass "fw-setup.invoked > 0 in per-app .meta.json" \
      || warn "fw-setup.invoked still 0 (setup may have run before manifest existed)"
  fi
}

# Extract agent response text from an LLM log (plain text or cursor/claude stream-json).
# Avoids false positives from tool_call logs that embed SKILL.md content (e.g. submit_custom_app).
llm_log_text() {
  local log="$1"
  if [[ ! -f "$log" ]]; then
    echo ""
    return
  fi
  if grep -q '"type":"result"' "$log" 2>/dev/null; then
    python3 - "$log" <<'PY'
import json, sys
path = sys.argv[1]
chunks = []
with open(path, encoding='utf-8', errors='replace') as f:
    for line in f:
        line = line.strip()
        if not line.startswith('{'):
            continue
        try:
            d = json.loads(line)
        except json.JSONDecodeError:
            continue
        if d.get('type') == 'result' and d.get('result'):
            chunks.append(str(d['result']))
        elif d.get('type') == 'assistant':
            for part in d.get('message', {}).get('content', []):
                if isinstance(part, dict) and part.get('type') == 'text':
                    chunks.append(part.get('text', ''))
print('\n'.join(chunks))
PY
  else
    cat "$log"
  fi
}

# Detect publish *execution* in an LLM log (completed shell/MCP tool calls only).
# Ignores prose mentions (e.g. blocker text naming create_app_upload_url) and
# read/grep/glob tool calls that only reference SKILL.md or search patterns.
# Prints one evidence line per action; empty when none found.
llm_log_publish_actions() {
  local log="$1"
  [[ -f "$log" ]] || return
  python3 "$(dirname "$0")/lib/llm-log-publish-actions.py" "$log"
}

# Publish metrics timing: meta-update fw-publish before fdk pack; meta-delete after success.
# Prints lines: pre_pack_metrics:yes|no meta_delete:yes|no zip_lists_meta:yes|no
llm_log_publish_metrics() {
  local log="$1"
  [[ -f "$log" ]] || return
  python3 "$(dirname "$0")/lib/llm-log-publish-metrics.py" "$log"
}

# IDE skill path reads in stream-json logs (claude_reads:N cursor_reads:N codex_reads:N).
llm_log_skill_paths() {
  local log="$1"
  [[ -f "$log" ]] || return
  python3 "$(dirname "$0")/lib/llm-log-skill-paths.py" "$log"
}

# Per-app .meta.json script usage vs hand-written edits (meta_init/update, hand_write).
llm_log_meta_scripts() {
  local log="$1"
  [[ -f "$log" ]] || return
  python3 "$(dirname "$0")/lib/llm-log-meta-scripts.py" "$log"
}

# Expected skill version from repo SKILL.md frontmatter (matches installed copy on --from-repo).
e2e_skill_version() {
  local skill="$1"
  local repo; repo="$(cd "$(dirname "$0")/../.." && pwd)"
  sed -n 's/^version:[[:space:]]*"\{0,1\}\([^"]*\)"\{0,1\}/\1/p' "$repo/skills/$skill/SKILL.md" | head -1
}

# Fail E2E when agent hand-writes .meta.json or skips meta-update.sh.
phase_meta_script_guard() {
  local phase_label="$1"
  local log="$2"
  [[ "$SKIP_BUILD" == "true" ]] && return
  [[ -f "$log" ]] || return

  local metrics meta_update hand_write
  metrics=$(llm_log_meta_scripts "$log" || true)
  meta_update=$(grep -E '^meta_update:' <<< "$metrics" | cut -d: -f2)
  hand_write=$(grep -E '^hand_write:' <<< "$metrics" | cut -d: -f2)

  if [[ "$hand_write" == "yes" ]]; then
    fail "$phase_label: agent hand-wrote .meta.json (use meta-init.sh / meta-update.sh only)"
  else
    pass "$phase_label: no hand-written .meta.json detected"
  fi

  if [[ "$meta_update" == "yes" ]]; then
    pass "$phase_label: meta-update.sh invoked in agent log"
  else
    fail "$phase_label: meta-update.sh not found in agent log"
  fi
}

# Absolute skill reference for E2E prompts — avoids ambiguous skills/fw-* paths.
e2e_fw_skill_ref() {
  local skill="$1"
  case "$CLIENT" in
    cursor) echo "${HOME}/.cursor/skills/${skill}/SKILL.md" ;;
    codex)  echo "${HOME}/.codex/skills/${skill}/SKILL.md" ;;
    claude) echo "the ${skill} Claude Code plugin (Skill tool or /${skill} — never read ~/.cursor/skills or ~/.codex/skills)" ;;
  esac
}

# Fail Cursor E2E when the agent reads fw skills from another IDE's install tree.
phase_skill_path_guard() {
  local phase_label="$1"
  local log="$2"
  [[ "$CLIENT" != "cursor" ]] && return
  [[ -f "$log" ]] || return

  local metrics claude_reads codex_reads
  metrics=$(llm_log_skill_paths "$log" || true)
  claude_reads=$(grep -E '^claude_reads:' <<< "$metrics" | cut -d: -f2)
  codex_reads=$(grep -E '^codex_reads:' <<< "$metrics" | cut -d: -f2)
  claude_reads=${claude_reads:-0}
  codex_reads=${codex_reads:-0}

  if [[ "$claude_reads" -gt 0 ]]; then
    fail "$phase_label: Cursor agent read fw skills from ~/.claude/skills ($claude_reads read(s))"
  else
    pass "$phase_label: no reads from ~/.claude/skills"
  fi
  if [[ "$codex_reads" -gt 0 ]]; then
    fail "$phase_label: Cursor agent read fw skills from ~/.codex/skills ($codex_reads read(s))"
  else
    pass "$phase_label: no reads from ~/.codex/skills"
  fi
}

# Claude install: local marketplace under ~/.fw-dev-tools/ and routing block in CLAUDE.md.
verify_claude_install_artifacts() {
  local expected_ver
  expected_ver="$(e2e_skill_version fw-app-dev)"

  [[ -f "$HOME/.fw-dev-tools/skills/fw-app-dev/SKILL.md" ]] \
    && pass "local marketplace skills copied to ~/.fw-dev-tools/skills" \
    || fail "~/.fw-dev-tools/skills/fw-app-dev/SKILL.md missing"

  [[ -f "$HOME/.fw-dev-tools/.claude-plugin/marketplace.json" ]] \
    && pass "local .claude-plugin manifest copied" \
    || fail "~/.fw-dev-tools/.claude-plugin/marketplace.json missing"

  if node -e "
    const fs = require('fs');
    const expected = process.argv[1];
    const skill = fs.readFileSync(process.env.HOME + '/.fw-dev-tools/skills/fw-app-dev/SKILL.md', 'utf8');
    const m = skill.match(/^version:\\s*\"?([^\"\\n]+)\"?/m);
    process.exit(m && m[1] === expected ? 0 : 1);
  " "$expected_ver"; then
    pass "local marketplace SKILL.md version matches fleet ($expected_ver)"
  else
    fail "local marketplace SKILL.md version mismatch (expected $expected_ver)"
  fi

  if node -e "
    const fs = require('fs');
    const expected = process.argv[1];
    const mp = JSON.parse(fs.readFileSync(process.env.HOME + '/.fw-dev-tools/.claude-plugin/marketplace.json', 'utf8'));
    process.exit(mp.version === expected ? 0 : 1);
  " "$expected_ver"; then
    pass "local marketplace.json version matches fleet ($expected_ver)"
  else
    fail "local marketplace.json version mismatch (expected $expected_ver)"
  fi

  if [[ ! -f "$HOME/.claude/CLAUDE.md" ]]; then
    fail "~/.claude/CLAUDE.md missing after Claude install"
    return
  fi
  if grep -q '<!-- fw-dev-tools start -->' "$HOME/.claude/CLAUDE.md" \
    && grep -q 'IDE skill paths' "$HOME/.claude/CLAUDE.md"; then
    pass "CLAUDE.md has fw-dev-tools routing block"
  else
    fail "CLAUDE.md missing fw-dev-tools routing block"
  fi
}

verify_claude_uninstall_artifacts() {
  if [[ -f "$HOME/.claude/CLAUDE.md" ]] \
    && grep -q '<!-- fw-dev-tools start -->' "$HOME/.claude/CLAUDE.md"; then
    fail "CLAUDE.md still contains fw-dev-tools routing block after uninstall"
  else
    pass "CLAUDE.md routing block removed (or CLAUDE.md absent)"
  fi
}

# ─── invoke LLM ──────────────────────────────────────────────────────────────
invoke_llm() {
  local prompt="$1"
  local workdir="$2"
  echo "  Invoking $CLIENT with prompt..."
  case "$CLIENT" in
    claude)
      echo "$prompt" | claude --dangerously-skip-permissions --print --verbose --output-format stream-json 2>&1
      ;;
    cursor)
      # stream-json + partial deltas so tee/log files update while the agent runs
      cursor agent --print --force --approve-mcps \
        --output-format stream-json --stream-partial-output \
        --workspace "$workdir" "$prompt" 2>&1
      ;;
    codex)
      codex exec --dangerously-bypass-approvals-and-sandbox \
        -C "$workdir" \
        "$prompt" 2>&1
      ;;
  esac
}

# Npx package spec for published @freshworks/fw-dev-tools (main = registry latest).
installer_npx_spec() {
  if [[ "$BRANCH" == "main" ]]; then
    echo '@freshworks/fw-dev-tools'
  else
    echo "@freshworks/fw-dev-tools@$BRANCH"
  fi
}

# install | uninstall — from repo, local .tgz, or npm (never github: URL).
installer_cli_cmd() {
  local subcmd="$1"
  local REPO_ROOT; REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
  if [[ "$INSTALL_FROM_REPO" == "true" ]]; then
    echo "node $REPO_ROOT/installer/bin/cli.js $subcmd --tools $CLIENT --yes"
  elif [[ -n "$INSTALL_TGZ" ]]; then
    echo "npx $INSTALL_TGZ $subcmd --tools $CLIENT --yes"
  else
    echo "npx $(installer_npx_spec) $subcmd --tools $CLIENT --yes"
  fi
}

# ─── phase: install ──────────────────────────────────────────────────────────
phase_install() {
  header "Phase 1: Install fw-dev-tools (branch: $BRANCH)"

  local install_cmd; install_cmd="$(installer_cli_cmd install)"

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
      # claude uses native plugin system — verify scripts dir and .meta.json state file
      [[ -d "$HOME/.fw-dev-tools/scripts" ]]       && pass "~/.fw-dev-tools/scripts exists"       || fail "~/.fw-dev-tools/scripts missing"
      [[ -f "$HOME/.fw-dev-tools/scripts/meta-init.sh" ]]   && pass "meta-init.sh installed"   || fail "meta-init.sh missing"
      [[ -f "$HOME/.fw-dev-tools/scripts/meta-update.sh" ]]  && pass "meta-update.sh installed"  || fail "meta-update.sh missing"
      [[ -f "$HOME/.fw-dev-tools/scripts/meta-delete.sh" ]]  && pass "meta-delete.sh installed"  || fail "meta-delete.sh missing"
      [[ -f "$HOME/.fw-dev-tools/scripts/check-update.sh" ]] && pass "check-update.sh installed" || fail "check-update.sh missing"
      verify_claude_install_artifacts
      ;;
    cursor)
      [[ -f "$HOME/.cursor/rules/fw-dev-tools.mdc" ]] && pass "Cursor rules installed" || fail "Cursor rules missing"
      [[ -d "$HOME/.cursor/skills/fw-app-dev" ]]      && pass "~/.cursor/skills/fw-app-dev exists" || fail "~/.cursor/skills/fw-app-dev missing"
      [[ -d "$HOME/.fw-dev-tools/scripts" ]]           && pass "~/.fw-dev-tools/scripts exists" || fail "~/.fw-dev-tools/scripts missing"
      ;;
    codex)
      [[ -d "$HOME/.codex/skills/fw-app-dev" ]] && pass "~/.codex/skills/fw-app-dev exists" || fail "~/.codex/skills/fw-app-dev missing"
      [[ -f ".mcp.json" ]] && pass ".mcp.json written in cwd" || fail ".mcp.json missing in cwd"
      [[ -d "$HOME/.fw-dev-tools/scripts" ]] && pass "~/.fw-dev-tools/scripts exists" || fail "~/.fw-dev-tools/scripts missing"
      ;;
  esac

  [[ -f "$HOME/.fw-dev-tools/.meta.json" ]] && pass "~/.fw-dev-tools/.meta.json written" || fail "~/.fw-dev-tools/.meta.json missing"

  if [[ -f "$HOME/.fw-dev-tools/.meta.json" ]]; then
    if node -e "
      const m = JSON.parse(require('fs').readFileSync(process.env.HOME + '/.fw-dev-tools/.meta.json', 'utf8'));
      const uc = m.update_check;
      if (!uc || typeof uc !== 'object') process.exit(1);
      for (const k of ['lastChecked', 'lastNudged', 'latestVersion', 'updateAvailable']) {
        if (!Object.hasOwn(uc, k)) process.exit(1);
      }
    "; then
      pass "install .meta.json has update_check block"
    else
      fail "install .meta.json missing update_check block"
    fi
  fi

  if [[ -x "$HOME/.fw-dev-tools/scripts/check-update.sh" ]]; then
    bash "$HOME/.fw-dev-tools/scripts/check-update.sh" >/dev/null 2>&1 || true
    _today=$(date -u +"%Y-%m-%d")
    if node -e "
      const m = JSON.parse(require('fs').readFileSync(process.env.HOME + '/.fw-dev-tools/.meta.json', 'utf8'));
      process.exit(m.update_check?.lastChecked === '$_today' ? 0 : 1);
    "; then
      pass "check-update.sh set update_check.lastChecked to today"
    else
      fail "check-update.sh did not set update_check.lastChecked"
    fi
  fi
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
  local setup_step
  if [[ "$STRIP_FDK" == "true" ]]; then
    setup_step="1. fw-setup — FDK is NOT installed on this machine. Run /fw-setup-install (FDK 10.x + Node 24.11), verify with /fw-setup-status, then continue"
  else
    setup_step="1. fw-setup (check toolchain only — /fw-setup-status)"
  fi
  full_prompt="Working directory: $OUTPUT_DIR

$APP_PROMPT

Read and follow $(e2e_fw_skill_ref fw-app-dev). Mandatory skill order:
${setup_step}
2. fw-app-dev (build the app, run fdk validate until 0 errors)
3. fw-review (MANDATORY before publish) — use $(e2e_fw_skill_ref fw-review)
Create all app files inside $OUTPUT_DIR. Record metrics with meta-init.sh and meta-update.sh only — never hand-write .meta.json."

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
  phase_skill_path_guard "Build" "$log"
  phase_meta_script_guard "Build" "$log"
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
  [[ -f "$OUTPUT_DIR/server.js" ]]                        && pass "server.js exists"                       || warn "server.js missing (may use server/ layout)"
  # icon.svg only required for frontend/hybrid apps (app/ dir present)
  if [[ -d "$OUTPUT_DIR/app" ]]; then
    [[ -f "$OUTPUT_DIR/app/styles/images/icon.svg" ]] && pass "app/styles/images/icon.svg exists" || fail "app/styles/images/icon.svg missing (fdk validate will fail)"
  else
    pass "serverless app — icon.svg not required"
  fi

  # 8.12 — no extra markdown docs beyond README.md
  local _extra_md
  _extra_md=$(find "$OUTPUT_DIR" -maxdepth 1 -name "*.md" ! -name "README.md" 2>/dev/null | head -5)
  if [[ -z "$_extra_md" ]]; then
    pass "no extra .md files in app root (only README.md allowed)"
  else
    warn "extra .md file(s) found in app root: ${_extra_md//$'\n'/, }"
  fi
}

# ─── phase: fdk validate ──────────────────────────────────────────────────────
phase_validate() {
  header "Phase 4: fdk validate"

  activate_fdk_node

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

# ─── phase: .meta.json checks ───────────────────────────────────────────────────
phase_appinfo() {
  header "Phase 5: .meta.json checks"

  local ai="$OUTPUT_DIR/.meta.json"

  if [[ ! -f "$ai" ]]; then
    if [[ "$SKIP_BUILD" == "true" ]]; then
      warn ".meta.json missing — expected (--skip-build, no LLM ran)"
    else
      fail ".meta.json missing — LLM did not write metrics"
    fi
    return
  fi
  pass ".meta.json exists"

  local expected_app_dev_ver expected_review_ver
  expected_app_dev_ver=$(e2e_skill_version fw-app-dev)
  expected_review_ver=$(e2e_skill_version fw-review)

  # parse with node — write script to a temp file to avoid process.argv[1] = '-' issue
  local _script
  _script=$(mktemp "${TMPDIR:-/tmp}/e2e-appinfo.XXXXXX") && _script="${_script}.js"
  cat > "$_script" <<'EOF'
const fs = require('fs');
const ai = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
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
  if (process.argv[4]) {
    check('fw-app-dev.skill_version matches installed SKILL.md',
      ad.skill_version === process.argv[4]);
  }
  check('fw-app-dev.validate_iterations >= 0', typeof ad.validate_iterations === 'number');
  if (ad.invoked === 0) warn('fw-app-dev.invoked is 0 — LLM may not have followed skill order');
}

// fw-review block
const rv = ai['fw-review'];
const strictReview = process.argv[3] === 'strict';
if (!rv) { console.log('  FAIL: fw-review block missing'); f++; }
else {
  if (rv.invoked > 0) { console.log('  PASS: fw-review.invoked > 0'); p++; }
  else if (strictReview) { console.log('  FAIL: fw-review.invoked is 0 — mandatory review skipped'); f++; }
  else { console.log('  WARN: fw-review.invoked is 0 — LLM may have skipped mandatory review'); }
  check('fw-review.skill_version set', rv.skill_version && rv.skill_version !== '');
  if (process.argv[5]) {
    check('fw-review.skill_version matches installed SKILL.md',
      rv.skill_version === process.argv[5]);
  }
}

process.exit(f > 0 ? 1 : 0);
EOF
  node "$_script" "$ai" $([[ "$REQUIRE_REVIEW" == "true" ]] && echo strict) "$expected_app_dev_ver" "$expected_review_ver"; local node_exit=$?
  rm -f "$_script"
  [[ $node_exit -eq 0 ]] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
}

# ─── phase: fw-review ───────────────────────────────────────────────────────
phase_review() {
  header "Phase 6: fw-review"

  local review_prompt
  review_prompt="Working directory: $OUTPUT_DIR

Review this app for marketplace submission.
Read and follow $(e2e_fw_skill_ref fw-review). Record metrics with meta-init.sh and meta-update.sh only — never hand-write .meta.json."

  local log="$OUTPUT_DIR/e2e-review-output.log"
  local llm_exit=0
  (cd "$OUTPUT_DIR" && invoke_llm "$review_prompt" "$OUTPUT_DIR") 2>&1 | tee "$log" || llm_exit=${PIPESTATUS[0]}
  if [[ $llm_exit -ne 0 ]]; then
    fail "Review LLM invocation failed (exit $llm_exit)"
    return
  fi
  pass "Review LLM invocation complete"

  phase_skill_path_guard "Review" "$log"
  phase_meta_script_guard "Review" "$log"

  if grep -qiE 'App Review Result|## .*[Pp]ass|## .*[Ww]arn|## .*[Ff]ail|PASS|WARN|FAIL' <<< "$(llm_log_text "$log")"; then
    pass "Structured review report detected in output"
  else
    fail "No structured review report found in LLM output"
  fi

  local ai="$OUTPUT_DIR/.meta.json"
  if [[ -f "$ai" ]]; then
    local rv_invoked
    rv_invoked=$(node -e "const m=require('$ai'); console.log((m['fw-review']||{}).invoked||0)" 2>/dev/null || echo 0)
    [[ "${rv_invoked:-0}" -gt 0 ]] && pass "fw-review.invoked > 0 after review phase" || fail "fw-review.invoked still 0 after review phase"
  else
    fail ".meta.json missing after review phase"
  fi
}

# ─── phase: publish blocked regression ──────────────────────────────────────
phase_publish_blocked() {
  header "Phase 6: publish-blocked regression"

  local blocked_dir="${OUTPUT_DIR}-publish-blocked"
  rm -rf "$blocked_dir"
  mkdir -p "$blocked_dir"
  cat > "$blocked_dir/manifest.json" <<'EOF'
{
  "platform-version": "3.0",
  "modules": { "common": { "location": "server", "events": { "onAppInstall": { "handler": "onAppInstallHandler" } } } },
  "engines": { "node": "24.11.0", "fdk": "10.0.1" }
}
EOF
  echo 'exports = {};' > "$blocked_dir/server.js"
  mkdir -p "$blocked_dir/config"
  echo '{}' > "$blocked_dir/config/iparams.json"

  local pub_prompt
  pub_prompt="Working directory: $blocked_dir

Publish this app to the marketplace.
Follow fw-publish (skills/fw-publish/SKILL.md)."

  local log="$blocked_dir/e2e-publish-blocked.log"
  local llm_exit=0
  (cd "$blocked_dir" && invoke_llm "$pub_prompt" "$blocked_dir") 2>&1 | tee "$log" || llm_exit=${PIPESTATUS[0]}
  if [[ $llm_exit -ne 0 ]]; then
    warn "Publish-blocked LLM invocation exited $llm_exit (may still have refused)"
  else
    pass "Publish-blocked LLM invocation complete"
  fi

  local _llm_text; _llm_text="$(llm_log_text "$log")"

  if grep -qiE 'fw-review|must run review|review.*first|cannot publish|do not publish|mandatory.*review|publish.*blocked|blocked.*publish' <<< "$_llm_text"; then
    pass "LLM refused publish without fw-review"
  else
    fail "LLM did not clearly refuse publish without fw-review"
  fi

  local _publish_evidence
  _publish_evidence="$(llm_log_publish_actions "$log")"
  if [[ -n "$_publish_evidence" ]]; then
    fail "LLM executed publish actions (shell/MCP): ${_publish_evidence//$'\n'/, }"
  else
    pass "No publish upload/submit actions detected"
  fi
}

# ─── phase: per-app .meta.json survives uninstall ───────────────────────────
phase_app_meta_survives() {
  header "Phase 8: per-app .meta.json survives uninstall"

  [[ -f "$OUTPUT_DIR/.meta.json" ]] && pass "per-app .meta.json present before uninstall" || { fail "per-app .meta.json missing before uninstall"; return; }
  local _before
  _before=$(cat "$OUTPUT_DIR/.meta.json")

  phase_uninstall

  if [[ -f "$OUTPUT_DIR/.meta.json" ]]; then
    pass "per-app .meta.json still present after uninstall"
    local _after
    _after=$(cat "$OUTPUT_DIR/.meta.json")
    [[ "$_before" == "$_after" ]] && pass "per-app .meta.json unchanged by uninstall" || warn "per-app .meta.json content changed (unexpected)"
  else
    fail "per-app .meta.json removed by global uninstall (should be preserved)"
  fi
  _UNINSTALL_ALREADY_RAN=1
}

# ─── phase: publish ──────────────────────────────────────────────────────────
phase_publish() {
  header "Phase 6: fw-publish"

  if [[ -z "$AUTH_TOKEN" ]]; then
    warn "--publish set but no --auth-token provided — skipping publish phase"
    return
  fi

  local publish_prompt pub_log
  pub_log="$OUTPUT_DIR/e2e-publish-output.log"
  publish_prompt="Working directory: $OUTPUT_DIR
Auth token: $AUTH_TOKEN

Follow the fw-publish skill (skills/fw-publish/SKILL.md) to publish the app at $OUTPUT_DIR.
The JWT token is: $AUTH_TOKEN
Use this as the Bearer token for the MCP server auth."

  local pub_out
  pub_out=$(cd "$OUTPUT_DIR" && invoke_llm "$publish_prompt" "$OUTPUT_DIR")
  echo "$pub_out" > "$pub_log"
  echo "$pub_out" | tail -20

  local _pack_ran=false
  if llm_log_publish_actions "$pub_log" | grep -qi 'fdk pack'; then
    _pack_ran=true
  fi

  if [[ "$_pack_ran" == "true" ]]; then
    local _metrics
    _metrics=$(llm_log_publish_metrics "$pub_log")
    if grep -q 'pre_pack_metrics:yes' <<< "$_metrics"; then
      pass "fw-publish meta-update ran before fdk pack (log order)"
    else
      fail "fw-publish meta-update must run before fdk pack when pack runs"
    fi
    if grep -q 'zip_lists_meta:yes' <<< "$_metrics"; then
      pass "publish log shows .meta.json in zip listing (unzip -l)"
    else
      warn "Could not confirm .meta.json in zip listing — check e2e-publish-output.log"
    fi
  else
    warn "fdk pack not detected in publish log — skipping pre-pack metrics order check"
  fi

  if echo "$pub_out" | grep -qi "successfully\|submitted\|publish.*success\|get_app_status"; then
    pass "Publish appears successful (log: e2e-publish-output.log)"
    if grep -q 'meta_delete:yes' <<< "$(llm_log_publish_metrics "$pub_log")"; then
      pass "meta-delete.sh ran after successful publish"
    else
      warn "meta-delete.sh not detected after publish success"
    fi
    [[ ! -f "$OUTPUT_DIR/.meta.json" ]] && pass "per-app .meta.json removed after publish" \
      || warn "per-app .meta.json still present after publish (expected delete on success)"
  else
    warn "Could not confirm publish success — check e2e-publish-output.log"
  fi
}

# ─── phase: uninstall ────────────────────────────────────────────────────────
phase_uninstall() {
  header "Phase 7: Uninstall"

  local uninstall_cmd; uninstall_cmd="$(installer_cli_cmd uninstall)"
  if eval "$uninstall_cmd"; then
    pass "Uninstall exited 0"
  else
    fail "Uninstall failed"
  fi

  # verify cleanup
  case "$CLIENT" in
    claude)
      [[ ! -d "$HOME/.fw-dev-tools/scripts" ]] && pass "~/.fw-dev-tools/scripts removed" || fail "~/.fw-dev-tools/scripts still present"
      verify_claude_uninstall_artifacts
      ;;
    cursor)
      [[ ! -f "$HOME/.cursor/rules/fw-dev-tools.mdc" ]] && pass "Cursor rules removed" || fail "Cursor rules still present"
      [[ ! -d "$HOME/.cursor/skills/fw-app-dev" ]] && pass "~/.cursor/skills/fw-app-dev removed" || fail "~/.cursor/skills/fw-app-dev still present"
      ;;
    codex)
      [[ ! -d "$HOME/.codex/skills/fw-app-dev" ]] && pass "~/.codex/skills/fw-app-dev removed" || fail "~/.codex/skills/fw-app-dev still present"
      ;;
  esac

  # 5.4 — uninstall must NOT remove Node or nvm
  if command -v node &>/dev/null; then
    pass "Node.js still on PATH after uninstall (not removed)"
  else
    fail "Node.js missing after uninstall — uninstall must not touch Node"
  fi
  local _nvm_dir="${NVM_DIR:-$HOME/.nvm}"
  if [[ -d "$_nvm_dir" ]]; then
    pass "nvm directory still present after uninstall (not removed)"
  else
    warn "nvm directory missing after uninstall — verify nvm was not touched"
  fi

  [[ ! -f "$HOME/.fw-dev-tools/.meta.json" ]] && pass "~/.fw-dev-tools/.meta.json removed" || fail "~/.fw-dev-tools/.meta.json still present"
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
  "workflow": "$WORKFLOW_LABEL",
  "stripFdk": $( [[ "$STRIP_FDK" == "true" ]] && echo true || echo false ),
  "sampleApp": $( [[ "$SAMPLE_APP" == "true" ]] && echo true || echo false ),
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
if [[ "$INSTALL_FROM_REPO" == "true" ]]; then
  echo "  source:     repo (--from-repo)"
elif [[ -n "$INSTALL_TGZ" ]]; then
  echo "  source:     tgz ($INSTALL_TGZ)"
else
  echo "  branch:     $BRANCH"
fi
echo "  agent:      $CLIENT"
echo "  output-dir: $OUTPUT_DIR"
echo "  workflow:   $WORKFLOW_LABEL"
echo "  sample-app: $( [[ "$SAMPLE_APP" == "true" ]] && echo yes || echo no )"
echo "  strip-fdk:  $( [[ "$STRIP_FDK" == "true" ]] && echo yes || echo no )"
echo "  require-review: $( [[ "$REQUIRE_REVIEW" == "true" ]] && echo yes || echo no )"
echo "  publish:    $( [[ "$PUBLISH" == "true" ]] && [[ -n "$AUTH_TOKEN" ]] && echo yes || echo no )"

_UNINSTALL_ALREADY_RAN=0

check_cli

if [[ "$WORKFLOW" == "publish-guard" ]]; then
  phase_install
  phase_publish_blocked
  phase_uninstall
  summary
  exit $([[ $FAIL -eq 0 ]] && echo 0 || echo 1)
fi

phase_install
[[ "$STRIP_FDK" == "true" ]] && phase_strip_fdk
$SKIP_BUILD || phase_build
[[ "$STRIP_FDK" == "true" ]] && phase_fw_setup_verify

# if Claude created app in a subfolder (fw-app-dev always creates a named folder),
# point checks at the subfolder rather than OUTPUT_DIR directly
if [[ ! -f "$OUTPUT_DIR/manifest.json" ]]; then
  _sub=$(find "$OUTPUT_DIR" -maxdepth 1 -name "manifest.json" 2>/dev/null | head -1)
  if [[ -z "$_sub" ]]; then
    _sub=$(find "$OUTPUT_DIR" -maxdepth 2 -name "manifest.json" 2>/dev/null | head -1)
  fi
  [[ -n "$_sub" ]] && OUTPUT_DIR="$(dirname "$_sub")"
fi

phase_structure
phase_validate
phase_appinfo
[[ "$WORKFLOW" == "build-review" ]] && phase_review
$PUBLISH && phase_publish
phase_app_meta_survives
[[ "${_UNINSTALL_ALREADY_RAN:-0}" -eq 0 ]] && phase_uninstall
summary

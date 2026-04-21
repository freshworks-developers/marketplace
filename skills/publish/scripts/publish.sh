#!/usr/bin/env bash
# Pack and/or publish a Freshworks app (steps are decoupled). Intended for agents in chat and CI.
#
# Usage:
#   publish.sh <APP_DIR> [--skip-validate] [--pack-only] [--force-pack]
#              [--target=test|dev] [--no-move-to-test]
#              [--name=...] [--description=...] [--support-email=...]
#
#   --target=test  (default) After upload, PATCH version to test (QA install).
#   --target=dev   Upload only; skip move-to-test (same as --no-move-to-test).
#
# Pack vs publish:
#   --pack-only   Run fdk pack only (no AMP). No API key required.
#   (default)     AMP upload: if dist/*.zip exists, skip fdk pack and upload that zip; else pack then upload.
#   --force-pack  Always run fdk pack even when dist/*.zip already exists.
#
# AMP hygiene (publish only, default on):
#   (default)     curl preflight: GET …/apps?per_page=1&type=custom → 200 before validate/pack.
#   --no-preflight Skip preflight (e.g. tight CI).
#   (always)      If .fdk/app-info.json has id but GET …/apps/{id} → 404, id is cleared → POST create.
set -euo pipefail

# AMP base host (collections path is used inside amp_upload.py)
export AMP_BASE="${AMP_BASE:-https://marketplace-us.freshworks.com}"

# Resolve before `cd "$APP_DIR"` — dirname "$0" can be relative and breaks after cd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

die() { echo "ERROR: $*" >&2; exit 1; }

# GET …/api/v2/apps?…&type=custom — same check as manual curl; fails fast on 401 before fdk pack.
amp_auth_preflight() {
  [[ "${NEED_PUBLISH:-0}" -eq 0 ]] && return 0
  [[ "${PREFLIGHT:-1}" -eq 0 ]] && return 0
  local tmp code
  tmp="$(mktemp)"
  code="$(
    curl -sS -o "$tmp" -w "%{http_code}" \
      "${AMP_BASE}/api/v2/apps?per_page=1&page=1&type=custom" \
      -H "Authorization: Bearer ${API_KEY}" \
      -H "accept: application/json"
  )"
  rm -f "$tmp"
  if [[ "$code" == "200" ]]; then
    echo "==> AMP preflight OK (curl GET …/apps?type=custom → HTTP 200)"
    return 0
  fi
  if [[ "$code" == "401" ]]; then
    die "AMP preflight HTTP 401 — invalid or expired JWT. Update apiKey in ~/.freshworks/publish-config.json or set FRESHWORKS_API_KEY (Developer Portal)."
  fi
  die "AMP preflight failed (curl GET …/apps?type=custom) HTTP ${code:-unknown}"
}

# If app id was copied from another developer account, GET /apps/{id} is 404 — clear id so upload uses POST create.
amp_repair_stale_app_id() {
  [[ -z "${APP_ID:-}" ]] && return 0
  local tmp code
  tmp="$(mktemp)"
  code="$(
    curl -sS -o "$tmp" -w "%{http_code}" \
      "${AMP_BASE}/api/v2/apps/${APP_ID}" \
      -H "Authorization: Bearer ${API_KEY}" \
      -H "accept: application/json"
  )"
  if [[ "$code" == "200" ]]; then
    rm -f "$tmp"
    return 0
  fi
  if [[ "$code" == "404" ]]; then
    rm -f "$tmp"
    echo "==> Stored app id ${APP_ID} not on this AMP account (HTTP 404). Clearing id in ${APP_INFO}; upload will CREATE a new app." >&2
    python3 - "$APP_INFO" <<'PY'
import json, pathlib, sys
p = pathlib.Path(sys.argv[1])
d = json.loads(p.read_text(encoding="utf-8"))
d.pop("id", None)
p.write_text(json.dumps(d, indent=2) + "\n", encoding="utf-8")
PY
    APP_ID=""
    return 0
  fi
  rm -f "$tmp"
  if [[ "$code" == "401" ]]; then
    die "AMP GET /apps/${APP_ID} HTTP 401 — JWT invalid or expired."
  fi
  die "AMP GET /apps/${APP_ID} HTTP ${code:-unknown} (cannot use stored app id)"
}

resolve_api_key() {
  if [[ -n "${FRESHWORKS_API_KEY:-}" ]]; then
    printf '%s' "$FRESHWORKS_API_KEY"
    return 0
  fi
  local cf="${HOME}/.freshworks/publish-config.json"
  if [[ -f "$cf" ]]; then
    python3 - "$cf" <<'PY' || true
import json, sys
path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    d = json.load(f)
for k in ("apiKey", "api_key", "token", "jwt"):
    v = d.get(k)
    if isinstance(v, str) and v.startswith("eyJ"):
        print(v, end="")
        sys.exit(0)
sys.exit(1)
PY
    return 0
  fi
  return 1
}

resolve_support_email() {
  local cf="${HOME}/.freshworks/publish-config.json"
  [[ -f "$cf" ]] || return 1
  python3 - "$cf" <<'PY' || true
import base64, json, sys

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    d = json.load(f)
for k in ("supportEmail", "support_email", "FRESHWORKS_SUPPORT_EMAIL"):
    v = d.get(k)
    if isinstance(v, str) and "@" in v:
        print(v.strip(), end="")
        sys.exit(0)
jwt = None
for k in ("apiKey", "api_key", "token", "jwt"):
    v = d.get(k)
    if isinstance(v, str) and v.startswith("eyJ"):
        jwt = v
        break
if not jwt or "." not in jwt:
    sys.exit(1)
part = jwt.split(".")[1]
part += "=" * (-len(part) % 4)
try:
    payload = json.loads(base64.urlsafe_b64decode(part))
except Exception:
    sys.exit(1)
for k in ("user_email", "email", "userEmail"):
    v = payload.get(k)
    if isinstance(v, str) and "@" in v:
        print(v.strip(), end="")
        sys.exit(0)
sys.exit(1)
PY
}

APP_DIR=""
SKIP_VALIDATE=0
PACK_ONLY=0
FORCE_PACK=0
NO_MOVE_TO_TEST=0
TARGET_MODE="test"
APP_NAME=""
DESCRIPTION=""
OVERVIEW="${FRESHWORKS_APP_OVERVIEW:-}"
ALTERNATE_EMAIL="${FRESHWORKS_ALTERNATE_EMAIL:-}"
SUPPORT_EMAIL="${FRESHWORKS_SUPPORT_EMAIL:-}"
PREFLIGHT=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-validate) SKIP_VALIDATE=1 ;;
    --pack-only) PACK_ONLY=1 ;;
    --force-pack) FORCE_PACK=1 ;;
    --no-preflight) PREFLIGHT=0 ;;
    --no-move-to-test) NO_MOVE_TO_TEST=1 ;;
    --target=test) TARGET_MODE="test"; NO_MOVE_TO_TEST=0 ;;
    --target=dev) TARGET_MODE="dev"; NO_MOVE_TO_TEST=1 ;;
    --name=*) APP_NAME="${1#--name=}" ;;
    --description=*) DESCRIPTION="${1#--description=}" ;;
    --overview=*) OVERVIEW="${1#--overview=}" ;;
    --alternate-email=*) ALTERNATE_EMAIL="${1#--alternate-email=}" ;;
    --support-email=*) SUPPORT_EMAIL="${1#--support-email=}" ;;
    -*)
      die "Unknown option: $1"
      ;;
    *)
      [[ -z "$APP_DIR" ]] || die "Unexpected extra argument: $1"
      APP_DIR="$(cd "$1" && pwd)"
      ;;
  esac
  shift
done

case "$TARGET_MODE" in
  test|dev) ;;
  *) die "Invalid --target=$TARGET_MODE (use test or dev)" ;;
esac

[[ -n "$APP_DIR" ]] || die "Usage: publish.sh <APP_DIR> [--skip-validate] [--pack-only] [--force-pack] [--no-preflight] [--target=test|dev] [--no-move-to-test] [--name=...] [--description=...] [--overview=...] [--alternate-email=...] [--support-email=...]"
[[ -f "$APP_DIR/manifest.json" ]] || die "No manifest.json in $APP_DIR"

MANIFEST="$APP_DIR/manifest.json"

if [[ -z "$APP_NAME" ]]; then
  if python3 - "$MANIFEST" <<'PY' 2>/dev/null | grep -q .
import json, sys
m = json.load(open(sys.argv[1], encoding="utf-8"))
n = m.get("name")
if isinstance(n, str) and n.strip():
    print(n.strip(), end="")
PY
  then
    APP_NAME="$(python3 - "$MANIFEST" <<'PY'
import json, sys
m = json.load(open(sys.argv[1], encoding="utf-8"))
print(m.get("name", "").strip(), end="")
PY
)"
  else
    APP_NAME="$(basename "$APP_DIR")"
  fi
fi

[[ -z "$DESCRIPTION" ]] && DESCRIPTION="Freshworks custom app published via marketplace publish flow."

NEED_PUBLISH=0
if [[ "$PACK_ONLY" -eq 0 ]]; then
  NEED_PUBLISH=1
fi

if [[ "$NEED_PUBLISH" -eq 1 ]]; then
  if [[ -z "$SUPPORT_EMAIL" ]]; then
    SUPPORT_EMAIL="$(resolve_support_email)" || true
  fi
  [[ -n "$SUPPORT_EMAIL" ]] || die "Set support email: FRESHWORKS_SUPPORT_EMAIL, --support-email=..., or add \"supportEmail\" to ~/.freshworks/publish-config.json (same file as apiKey)."
  API_KEY=""
  if ! API_KEY="$(resolve_api_key)" || [[ -z "$API_KEY" ]]; then
    die "No API key. Export FRESHWORKS_API_KEY (JWT from Developer Portal) or add apiKey to ~/.freshworks/publish-config.json"
  fi
else
  API_KEY=""
fi

amp_auth_preflight

cd "$APP_DIR"

if [[ "$SKIP_VALIDATE" -eq 0 ]]; then
  echo "==> fdk validate"
  fdk validate
else
  echo "==> Skipping fdk validate (--skip-validate)"
fi

ZIP=""
if [[ "$PACK_ONLY" -eq 1 || "$FORCE_PACK" -eq 1 ]]; then
  echo "==> fdk pack (--skip-coverage --skip-lint; auto-yes engines prompt if shown)"
  if [[ ! -f .report.json ]]; then
    echo "==> No .report.json — packing with --skip-coverage (may warn for marketplace submission)"
  fi
  set +e
  printf 'Y\n' | fdk pack --skip-coverage --skip-lint
  PACK_RC=$?
  set -e
  [[ "$PACK_RC" -eq 0 ]] || die "fdk pack failed (exit $PACK_RC)"
elif [[ "$NEED_PUBLISH" -eq 1 ]]; then
  # Publish (default or --publish-only): reuse existing zip if present
  EXISTING="$(ls -t dist/*.zip 2>/dev/null | head -n 1 || true)"
  if [[ -n "$EXISTING" && "$FORCE_PACK" -eq 0 ]]; then
    ZIP="$(cd "$(dirname "$EXISTING")" && pwd)/$(basename "$EXISTING")"
    echo "==> Reusing existing package (skip fdk pack): $ZIP"
    echo "    (Run with --force-pack to rebuild the zip.)"
  else
    if [[ ! -f .report.json ]]; then
      echo "==> No .report.json — packing with --skip-coverage (may warn for marketplace submission)"
    fi
    echo "==> fdk pack (--skip-coverage --skip-lint; auto-yes engines prompt if shown)"
    set +e
    printf 'Y\n' | fdk pack --skip-coverage --skip-lint
    PACK_RC=$?
    set -e
    [[ "$PACK_RC" -eq 0 ]] || die "fdk pack failed (exit $PACK_RC)"
  fi
fi

ZIP="$(ls -t dist/*.zip 2>/dev/null | head -n 1 || true)"
[[ -n "$ZIP" ]] || die "No zip under dist/. Run with --pack-only or --force-pack to create one."
ZIP="$(cd "$(dirname "$ZIP")" && pwd)/$(basename "$ZIP")"
echo "==> Package: $ZIP"

[[ "$PACK_ONLY" -eq 1 ]] && { echo "Pack-only complete."; exit 0; }

APP_INFO="$APP_DIR/.fdk/app-info.json"
APP_ID=""
if [[ -f "$APP_INFO" ]]; then
  APP_ID="$(python3 - "$APP_INFO" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    d = json.load(f)
v = d.get("id")
print(v if v is not None else "", end="")
PY
)"
fi

amp_repair_stale_app_id

echo "==> Upload to AMP (multipart modularApps; target=${TARGET_MODE})"
PY="${SCRIPT_DIR}/amp_upload.py"
[[ -f "$PY" ]] || die "Missing ${PY}"

py_extra=()
[[ -n "$ALTERNATE_EMAIL" ]] && py_extra+=( --alternate-email "$ALTERNATE_EMAIL" )
[[ -n "$OVERVIEW" ]] && py_extra+=( --overview "$OVERVIEW" )
[[ -n "$APP_ID" ]] && py_extra+=( --app-id "$APP_ID" )
[[ "$NO_MOVE_TO_TEST" -eq 1 ]] && py_extra+=( --no-move-to-test )

# Bash + set -u: empty py_extra would make "${py_extra[@]}" unbound on some versions.
python3 "$PY" "$APP_DIR" "$ZIP" \
  --api-key "$API_KEY" \
  --support-email "$SUPPORT_EMAIL" \
  --display-name "$APP_NAME" \
  --description "$DESCRIPTION" \
  ${py_extra[@]+"${py_extra[@]}"}

echo "OK: publish finished."

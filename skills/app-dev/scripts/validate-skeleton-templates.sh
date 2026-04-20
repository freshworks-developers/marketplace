#!/usr/bin/env bash
# Copy each assets/templates/*-skeleton to a temp dir and run fdk validate.
# Requires FDK 10.x and Node 24.x on PATH (see fdk-setup skill).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATES="$ROOT/assets/templates"
DEST="$(mktemp -d "${TMPDIR:-/tmp}/app-dev-skeleton-validate.XXXXXX")"
cleanup() { rm -rf "$DEST"; }
trap cleanup EXIT

if ! command -v fdk >/dev/null 2>&1; then
  echo "fdk not found on PATH; install FDK (fdk-setup skill) and retry." >&2
  exit 1
fi

failed=0
for name in frontend-skeleton hybrid-skeleton oauth-skeleton serverless-skeleton; do
  src="$TEMPLATES/$name"
  if [[ ! -d "$src" ]]; then
    echo "Missing template: $src" >&2
    exit 1
  fi
  cp -R "$src" "$DEST/$name"
  echo "==> fdk validate: $name"
  if (cd "$DEST/$name" && fdk validate); then
    echo "OK: $name"
  else
    echo "FAIL: $name" >&2
    failed=1
  fi
done

exit "$failed"

#!/usr/bin/env bash
# Upload a packaged app zip to the presigned S3 URL from create_app_upload_url.
# Usage: upload-app.sh <zip-path> <response-file>
#
# <response-file> is a path to a file containing the full JSON response from
# create_app_upload_url — the LLM writes the entire response as-is and never
# handles the uploadUrl directly. Exits non-zero on failure.
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $(basename "$0") <zip-path> <response-file>" >&2
  exit 2
fi

ZIP_PATH="$1"
RESPONSE_FILE="$2"

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "error: zip not found: $ZIP_PATH" >&2
  exit 1
fi

if [[ ! -f "$RESPONSE_FILE" ]]; then
  echo "error: response file not found: $RESPONSE_FILE" >&2
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "error: jq is required but not installed. Run: brew install jq" >&2
  exit 1
fi

UPLOAD_URL=$(jq -r '.uploadUrl' "$RESPONSE_FILE")

if [[ -z "$UPLOAD_URL" || "$UPLOAD_URL" == "null" ]]; then
  echo "error: uploadUrl not found in response file: $RESPONSE_FILE" >&2
  exit 1
fi

echo "Uploading $(basename "$ZIP_PATH") ($(du -sh "$ZIP_PATH" | cut -f1)) ..."

MAX_RETRIES=3
ATTEMPT=0

while [[ $ATTEMPT -lt $MAX_RETRIES ]]; do
  ATTEMPT=$((ATTEMPT + 1))
  echo "Attempt $ATTEMPT of $MAX_RETRIES ..."

  HTTP_STATUS=$(curl -sS -o /dev/null -w "%{http_code}" \
    -X PUT \
    -H "Content-Type: application/zip" \
    --data-binary @"$ZIP_PATH" \
    "$UPLOAD_URL")

  if [[ "$HTTP_STATUS" == "200" ]]; then
    echo "Upload successful (HTTP $HTTP_STATUS)."
    exit 0
  fi

  echo "error: upload failed with HTTP $HTTP_STATUS (attempt $ATTEMPT)." >&2

  if [[ $ATTEMPT -lt $MAX_RETRIES ]]; then
    echo "Retrying in 2s ..." >&2
    sleep 2
  fi
done

echo "error: all $MAX_RETRIES attempts failed. Call create_app_upload_url for a fresh response file and retry." >&2
exit 1

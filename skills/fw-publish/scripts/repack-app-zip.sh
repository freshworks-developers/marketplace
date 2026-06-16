#!/usr/bin/env bash
# Repack an FDK zip so manifest.json is at archive root (no ./ prefix).
# Usage: repack-app-zip.sh <source.zip> <output-dir> <output-zip-basename>
set -euo pipefail

SRC_ZIP="${1:?source zip path}"
OUT_DIR="${2:?temp unpack directory}"
OUT_ZIP="${3:?output zip path (full path)}"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
unzip -q -o "$SRC_ZIP" -d "$OUT_DIR"

cd "$OUT_DIR"
MEMBERS=()
for f in manifest.json .meta.json app config server README.md; do
  [ -e "$f" ] && MEMBERS+=("$f")
done
# Include any other top-level entries not already listed
for entry in *; do
  [[ " ${MEMBERS[*]} " == *" $entry "* ]] && continue
  MEMBERS+=("$entry")
done

if [ ${#MEMBERS[@]} -eq 0 ]; then
  echo "No files to pack in $OUT_DIR" >&2
  exit 1
fi

zip -r "$OUT_ZIP" "${MEMBERS[@]}"
echo "Repacked: $OUT_ZIP"

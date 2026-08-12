#!/usr/bin/env bash
# Merge fields into <app-dir>/.fw-session.json and set updated_at (ISO8601 UTC).
# Usage: session-write.sh <app-dir> [--merge-json '{...}'] [key=value ...]
#   Nested keys: progress.phase=validate, publish.tracking_id=trk-1

set -euo pipefail

APP_DIR="${1:-}"
shift || true
[ -z "$APP_DIR" ] && { echo "Usage: session-write.sh <app-dir> [--merge-json '{...}'] [key=value ...]" >&2; exit 1; }

SESSION="$APP_DIR/.fw-session.json"
MERGE_JSON="{}"
ASSIGNMENTS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --merge-json)
      MERGE_JSON="${2:-}"
      shift 2
      ;;
    *=*)
      ASSIGNMENTS+=("$1")
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

export SESSION MERGE_JSON
export ASSIGNMENTS_JSON
ASSIGNMENTS_JSON="$(node -e "
  const args = process.argv.slice(1);
  const out = {};
  for (const arg of args) {
    const i = arg.indexOf('=');
    if (i === -1) continue;
    out[arg.slice(0, i)] = arg.slice(i + 1);
  }
  process.stdout.write(JSON.stringify(out));
" "${ASSIGNMENTS[@]}")"

node <<'NODE'
const fs = require('fs');
const path = require('path');

const sessionPath = process.env.SESSION;
const mergeJson = JSON.parse(process.env.MERGE_JSON || '{}');
const assignments = JSON.parse(process.env.ASSIGNMENTS_JSON || '{}');

function setNested(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

let doc = {};
if (fs.existsSync(sessionPath)) {
  try {
    doc = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
  } catch (e) {
    console.error('Corrupt .fw-session.json — fix or run session-reset.sh --force');
    process.exit(2);
  }
} else {
  doc = {
    schema_version: '1.0.0',
    intent: assignments.intent || mergeJson.intent || 'create-new',
    progress: { phase: 'discover' },
  };
}

Object.assign(doc, mergeJson);
for (const [k, v] of Object.entries(assignments)) {
  if (k.includes('.')) setNested(doc, k, v);
  else doc[k] = v;
}

if (!doc.schema_version) doc.schema_version = '1.0.0';
if (!doc.progress) doc.progress = { phase: 'discover' };
if (!doc.intent) {
  console.error('First session write requires intent= (e.g. intent=create-new)');
  process.exit(1);
}

doc.updated_at = new Date().toISOString();
doc.last_milestone_at = doc.updated_at;

const milestones = doc.progress.milestones || [];
if (doc.publish && doc.publish.tracking_id && !doc.tracking_id) {
  doc.tracking_id = doc.publish.tracking_id;
}
if (doc.escalation && doc.escalation.fix_attempt_count !== undefined) {
  doc.fix_iteration_count = doc.escalation.fix_attempt_count;
}
if (!doc.step) {
  if (doc.publish && doc.publish.tracking_id) doc.step = 'published';
  else if (milestones.includes('review_passed')) doc.step = 'reviewed';
  else if (milestones.includes('validate_passed')) doc.step = 'validated';
  else doc.step = 'building';
}

fs.mkdirSync(path.dirname(sessionPath), { recursive: true });
fs.writeFileSync(sessionPath, JSON.stringify(doc, null, 2) + '\n');
process.stdout.write(JSON.stringify(doc));
NODE

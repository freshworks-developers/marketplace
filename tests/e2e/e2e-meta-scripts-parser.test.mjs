/**
 * Unit tests for .meta.json script enforcement (lib/llm-log-meta-scripts.py).
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PARSER = join(__dirname, 'lib', 'llm-log-meta-scripts.py');

function parseMetaScripts(logPath) {
  const out = execFileSync('python3', [PARSER, logPath], { encoding: 'utf8' }).trim();
  return Object.fromEntries(
    out.split('\n').filter(Boolean).map((line) => {
      const [k, v] = line.split(':');
      return [k, v];
    })
  );
}

test('detects meta-init and meta-update shell invocations', () => {
  const fixture = join(__dirname, 'fixtures', 'meta-scripts-correct.jsonl');
  const m = parseMetaScripts(fixture);
  assert.equal(m.meta_init, 'yes');
  assert.equal(m.meta_update, 'yes');
  assert.equal(m.hand_write, 'no');
});

test('detects hand-written .meta.json via editToolCall', () => {
  const fixture = join(__dirname, 'fixtures', 'meta-hand-write-edit.jsonl');
  const m = parseMetaScripts(fixture);
  assert.equal(m.hand_write, 'yes');
  assert.equal(m.hand_write_count, '1');
});

/**
 * Unit tests for publish metrics timing (lib/llm-log-publish-metrics.py).
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PARSER = join(__dirname, 'lib', 'llm-log-publish-metrics.py');

function parseMetrics(logPath) {
  const out = execFileSync('python3', [PARSER, logPath], { encoding: 'utf8' }).trim();
  const map = Object.fromEntries(
    out.split('\n').filter(Boolean).map((line) => {
      const [k, v] = line.split(':');
      return [k, v === 'yes'];
    })
  );
  return map;
}

test('detects meta-update fw-publish before fdk pack in shell tool order', () => {
  const dir = mkdtempSync(join(tmpdir(), 'e2e-metrics-'));
  const log = join(dir, 'log.jsonl');
  const lines = [
    {
      type: 'tool_call',
      subtype: 'completed',
      tool_call: {
        shellToolCall: {
          args: { command: 'bash ~/.fw-dev-tools/scripts/meta-update.sh ./app fw-publish invoked=1 skill_version=x.y.z' },
        },
      },
    },
    {
      type: 'tool_call',
      subtype: 'completed',
      tool_call: {
        shellToolCall: {
          args: { command: 'cd ./app && printf Y | fdk pack --skip-coverage --skip-lint' },
        },
      },
    },
  ];
  writeFileSync(log, lines.map((l) => JSON.stringify(l)).join('\n') + '\n', 'utf8');
  const m = parseMetrics(log);
  assert.equal(m.pre_pack_metrics, true);
});

test('fails pre_pack_metrics when fdk pack runs before meta-update', () => {
  const dir = mkdtempSync(join(tmpdir(), 'e2e-metrics-'));
  const log = join(dir, 'log.jsonl');
  const lines = [
    {
      type: 'tool_call',
      subtype: 'completed',
      tool_call: { shellToolCall: { args: { command: 'fdk pack --skip-coverage' } } },
    },
    {
      type: 'tool_call',
      subtype: 'completed',
      tool_call: {
        shellToolCall: {
          args: { command: 'meta-update.sh ./app fw-publish invoked=1' },
        },
      },
    },
  ];
  writeFileSync(log, lines.map((l) => JSON.stringify(l)).join('\n') + '\n', 'utf8');
  const m = parseMetrics(log);
  assert.equal(m.pre_pack_metrics, false);
});

test('detects meta-delete after publish', () => {
  const dir = mkdtempSync(join(tmpdir(), 'e2e-metrics-'));
  const log = join(dir, 'log.jsonl');
  writeFileSync(
    log,
    JSON.stringify({
      type: 'tool_call',
      subtype: 'completed',
      tool_call: { shellToolCall: { args: { command: 'bash ~/.fw-dev-tools/scripts/meta-delete.sh ./app' } } },
    }) + '\n',
    'utf8'
  );
  const m = parseMetrics(log);
  assert.equal(m.meta_delete, true);
});

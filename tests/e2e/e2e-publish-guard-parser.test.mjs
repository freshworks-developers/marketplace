/**
 * Unit tests for publish-guard E2E log parsing (lib/llm-log-publish-actions.py).
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PARSER = join(__dirname, 'lib', 'llm-log-publish-actions.py');

function parsePublishActions(logPath) {
  return execFileSync('python3', [PARSER, logPath], { encoding: 'utf8' }).trim();
}

test('cursor publish-guard log: prose MCP names are not publish actions', () => {
  const fixture = join(__dirname, 'fixtures', 'publish-guard-cursor-prose.jsonl');
  const evidence = parsePublishActions(fixture);
  assert.equal(evidence, '', `expected no publish actions, got: ${evidence}`);
});

test('detects upload-app.sh in completed shell tool call', () => {
  const dir = mkdtempSync(join(tmpdir(), 'e2e-parser-'));
  const log = join(dir, 'log.jsonl');
  writeFileSync(
    log,
    JSON.stringify({
      type: 'tool_call',
      subtype: 'completed',
      tool_call: {
        shellToolCall: {
          args: { command: 'bash ~/.fw-dev-tools/scripts/upload-app.sh /tmp/app.zip https://upload.example' },
        },
      },
    }) + '\n',
    'utf8'
  );
  const evidence = parsePublishActions(log);
  assert.match(evidence, /upload-app\.sh/);
});

test('ignores create_app_upload_url in grepToolCall pattern', () => {
  const dir = mkdtempSync(join(tmpdir(), 'e2e-parser-'));
  const log = join(dir, 'log.jsonl');
  writeFileSync(
    log,
    JSON.stringify({
      type: 'tool_call',
      subtype: 'completed',
      tool_call: {
        grepToolCall: {
          args: { pattern: 'list_custom_apps|create_app_upload_url', path: '/tmp' },
        },
      },
    }) + '\n',
    'utf8'
  );
  const evidence = parsePublishActions(log);
  assert.equal(evidence, '');
});

test('detects MCP submit_custom_app invocation', () => {
  const dir = mkdtempSync(join(tmpdir(), 'e2e-parser-'));
  const log = join(dir, 'log.jsonl');
  writeFileSync(
    log,
    JSON.stringify({
      type: 'tool_call',
      subtype: 'completed',
      tool_call: {
        mcpToolCall: {
          args: { toolName: 'submit_custom_app', arguments: { uploadId: 'x' } },
        },
      },
    }) + '\n',
    'utf8'
  );
  const evidence = parsePublishActions(log);
  assert.match(evidence, /submit_custom_app/);
});

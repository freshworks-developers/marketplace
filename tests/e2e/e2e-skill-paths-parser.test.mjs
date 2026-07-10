/**
 * Unit tests for IDE skill path detection (lib/llm-log-skill-paths.py).
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PARSER = join(__dirname, 'lib', 'llm-log-skill-paths.py');

function parseSkillPaths(logPath) {
  return execFileSync('python3', [PARSER, logPath], { encoding: 'utf8' }).trim();
}

test('detects reads under ~/.claude/skills for fw-dev-tools', () => {
  const fixture = join(__dirname, 'fixtures', 'cursor-wrong-skill-path.jsonl');
  const out = parseSkillPaths(fixture);
  assert.match(out, /claude_reads:2/);
  assert.match(out, /cursor_reads:0/);
});

test('detects reads under ~/.cursor/skills', () => {
  const fixture = join(__dirname, 'fixtures', 'cursor-correct-skill-path.jsonl');
  const out = parseSkillPaths(fixture);
  assert.match(out, /cursor_reads:2/);
  assert.match(out, /claude_reads:0/);
});

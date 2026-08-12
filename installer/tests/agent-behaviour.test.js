import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BEHAVIOUR_FILE = join(REPO_ROOT, 'specs', 'agent-behaviour.md');

test('agent-behaviour.md exists and has disambiguation section', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(content.includes('## Disambiguation'), 'must have disambiguation section');
  assert.ok(content.includes('#disambiguation'), 'must have disambiguation anchor');
});

test('disambiguation: one clarifying question rule', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(/exactly one.*clarifying question/i.test(content), 'must require one clarifying question');
  assert.ok(/never guess silently/i.test(content), 'must forbid silent guess');
});

test('disambiguation: max four options', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(/up to four/i.test(content), 'must limit to four options');
});

test('disambiguation: no destructive action without clarification', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(/Do \*\*not\*\* run destructive actions/i.test(content), 'must block destructive actions');
});

test('disambiguation: fix my app trigger template', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(content.includes('fix my app'), 'must include fix my app trigger');
  assert.ok(content.includes('troubleshoot'), 'must offer troubleshoot option');
});

test('disambiguation: escalation after one turn', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(/after one clarifying exchange/i.test(content), 'must define post-turn behavior');
  assert.ok(/Do not default to code changes/i.test(content), 'must not default to destructive path');
});

test('disambiguation: compound request handling', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(/Compound requests/i.test(content), 'must document compound intents');
  assert.ok(/never publish before review/i.test(content), 'must enforce review before publish');
});

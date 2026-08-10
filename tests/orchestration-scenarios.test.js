import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BEHAVIOUR_FILE = join(REPO_ROOT, 'specs', 'agent-behaviour.md');
const SCENARIOS_DIR = join(REPO_ROOT, 'tests', 'scenarios');

const INTENTS = [
  'create-new',
  'add-feature',
  'troubleshoot',
  'update-existing',
  'migrate',
  'publish-status',
];

test('golden-path scenario docs exist for all six intents', async () => {
  const files = await readdir(SCENARIOS_DIR);
  for (const intent of INTENTS) {
    assert.ok(files.includes(`${intent}.md`), `missing scenario doc for ${intent}`);
  }
});

function getIntentSection(content, intent) {
  const marker = `## Intent: ${intent} {#${intent}}`;
  const start = content.indexOf(marker);
  assert.ok(start >= 0, `missing section for ${intent}`);
  const rest = content.slice(start + marker.length);
  const next = rest.search(/^## /m);
  return next >= 0 ? rest.slice(0, next) : rest;
}

test('orchestration: each intent section has skill chain keywords', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  const chains = {
    'create-new': ['fw-setup', 'fw-app-dev', 'fw-review', 'fw-publish'],
    'add-feature': ['fw-app-dev', 'fw-review'],
    troubleshoot: ['/fdk-fix', 'fix_attempt_count'],
    'update-existing': ['fw-review', 'explicit'],
    migrate: ['fdk-migrate', 'migrate_complete'],
    'publish-status': ['list_custom_apps', 'get_app_status'],
  };
  for (const [intent, keywords] of Object.entries(chains)) {
    const section = getIntentSection(content, intent);
    for (const kw of keywords) {
      assert.ok(section.includes(kw), `${intent} section must mention ${kw}`);
    }
  }
});

test('guardrails: skip-review refusal documented', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(/skip review/i.test(content), 'must document skip-review guardrail');
  assert.ok(content.includes('guardrail_violation'), 'must reference guardrail telemetry');
});

test('escalation: deploy and fix limits documented', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(content.includes('deploy_attempt_count'), 'must document deploy counter');
  assert.ok(content.includes('fix_attempt_count'), 'must document fix counter');
  assert.ok(/Handoff message/i.test(content), 'must document escalation handoff');
});

test('telemetry: event table documented', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(content.includes('intent_detected'), 'must document intent_detected');
  assert.ok(content.includes('session_sync'), 'must document session_sync');
  assert.ok(content.includes('meta-init.sh'), 'must reference meta scripts');
});

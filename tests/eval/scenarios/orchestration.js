import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');

async function loadOrchestrationDocs() {
  const [tier1, tier2] = await Promise.all([
    readFile(join(REPO_ROOT, 'installer', 'src', 'specs', 'fw-dev-tools-spec.md'), 'utf8'),
    readFile(join(REPO_ROOT, 'specs', 'agent-behaviour.md'), 'utf8'),
  ]);
  return `${tier1}\n\n---\n\n${tier2}`;
}

const orchestrationSchema = {
  type: 'object',
  required: ['classified_intent', 'requires_confirmation_before_write', 'runs_review_before_publish'],
  properties: {
    classified_intent: { type: 'string' },
    requires_confirmation_before_write: { type: 'boolean' },
    runs_review_before_publish: { type: 'boolean' },
    explanation: { type: 'string' },
  },
};

export const ORCHESTRATION_SCENARIOS = [
  {
    id: 'orchestration-01-create-new',
    skill: 'orchestration',
    label: 'create-new: confirm product/app type before writes and review before publish',
    loadContent: loadOrchestrationDocs,
    prompt: 'Empty app directory, no manifest.json. User says: "Build a Freshdesk app with a ticket sidebar." What intent is this, can the agent write files before product/app type confirmation, and must review run before publish?',
    schema: orchestrationSchema,
    assert(output) {
      assert.equal(output.classified_intent, 'create-new');
      assert.equal(output.requires_confirmation_before_write, true);
      assert.equal(output.runs_review_before_publish, true);
    },
  },
  {
    id: 'orchestration-02-add-feature',
    skill: 'orchestration',
    label: 'add-feature: read full tree, scoped build, review before publish',
    loadContent: loadOrchestrationDocs,
    prompt: 'Valid manifest and existing app code. User says: "Add a settings page to my app." What intent is this, should the agent avoid writing before reading the full tree, and must review run before publish?',
    schema: orchestrationSchema,
    assert(output) {
      assert.equal(output.classified_intent, 'add-feature');
      assert.equal(output.requires_confirmation_before_write, true);
      assert.equal(output.runs_review_before_publish, true);
    },
  },
  {
    id: 'orchestration-03-troubleshoot',
    skill: 'orchestration',
    label: 'troubleshoot: route targeted fix and enforce review before publish',
    loadContent: loadOrchestrationDocs,
    prompt: 'User says: "fdk validate fails with iparam error." What intent is this, should the agent capture/track the error before editing, and must review run before any publish?',
    schema: orchestrationSchema,
    assert(output) {
      assert.equal(output.classified_intent, 'troubleshoot');
      assert.equal(output.requires_confirmation_before_write, true);
      assert.equal(output.runs_review_before_publish, true);
    },
  },
  {
    id: 'orchestration-04-update-existing',
    skill: 'orchestration',
    label: 'update-existing: load session and require explicit publish confirmation',
    loadContent: loadOrchestrationDocs,
    prompt: 'A previously published app has saved publish state. User wants to ship a new version. What intent is this, should the agent read context before edits, and must review run before publish?',
    schema: orchestrationSchema,
    assert(output) {
      assert.equal(output.classified_intent, 'update-existing');
      assert.equal(output.requires_confirmation_before_write, true);
      assert.equal(output.runs_review_before_publish, true);
    },
  },
  {
    id: 'orchestration-05-migrate',
    skill: 'orchestration',
    label: 'migrate: block other work until migration completes',
    loadContent: loadOrchestrationDocs,
    prompt: 'The app manifest has platform-version 2.3 / FDK 9. User also asks to add a feature. What intent should take priority, should writes for the feature wait until migration is confirmed/complete, and must review run before publish?',
    schema: orchestrationSchema,
    assert(output) {
      assert.equal(output.classified_intent, 'migrate');
      assert.equal(output.requires_confirmation_before_write, true);
      assert.equal(output.runs_review_before_publish, true);
    },
  },
  {
    id: 'orchestration-06-publish-status',
    skill: 'orchestration',
    label: 'publish-status: read-only marketplace status lookup',
    loadContent: loadOrchestrationDocs,
    prompt: 'User asks about marketplace rejection/approval status for an app version. What intent is this, should the agent avoid write/publish actions, and should it run review before a separate new publish request?',
    schema: orchestrationSchema,
    assert(output) {
      assert.equal(output.classified_intent, 'publish-status');
      assert.equal(output.requires_confirmation_before_write, true);
      assert.equal(output.runs_review_before_publish, true);
    },
  },
];

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_FILE = join(REPO_ROOT, 'specs', 'fw-session.schema.json');
const BEHAVIOUR_FILE = join(REPO_ROOT, 'specs', 'agent-behaviour.md');

const ISO8601_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const SECRET_FIELD_NAMES = [
  'api_key',
  'apiKey',
  'oauth_token',
  'access_token',
  'refresh_token',
  'iparam',
  'secret',
  'password',
  'authorization',
];

let schema;

async function loadSchema() {
  if (!schema) {
    schema = JSON.parse(await readFile(SCHEMA_FILE, 'utf8'));
  }
  return schema;
}

function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function validateValue(value, subSchema, path = '$') {
  const errors = [];

  if (subSchema.type) {
    const expected = subSchema.type;
    const actual = typeOf(value);
    if (expected === 'integer') {
      if (actual !== 'number' || !Number.isInteger(value)) {
        errors.push(`${path}: expected integer, got ${actual}`);
        return errors;
      }
    } else if (actual !== expected) {
      errors.push(`${path}: expected ${expected}, got ${actual}`);
      return errors;
    }
  }

  if (subSchema.enum && !subSchema.enum.includes(value)) {
    errors.push(`${path}: must be one of ${subSchema.enum.join(', ')}`);
  }

  if (subSchema.pattern && typeof value === 'string') {
    const re = new RegExp(subSchema.pattern);
    if (!re.test(value)) {
      errors.push(`${path}: must match pattern ${subSchema.pattern}`);
    }
  }

  if (subSchema.minimum !== undefined && typeof value === 'number' && value < subSchema.minimum) {
    errors.push(`${path}: must be >= ${subSchema.minimum}`);
  }

  if (subSchema.maximum !== undefined && typeof value === 'number' && value > subSchema.maximum) {
    errors.push(`${path}: must be <= ${subSchema.maximum}`);
  }

  if (subSchema.format === 'date-time' && typeof value === 'string' && !ISO8601_RE.test(value)) {
    errors.push(`${path}: must be ISO8601 date-time`);
  }

  if (subSchema.type === 'object' && value && typeof value === 'object') {
    if (subSchema.additionalProperties === false && subSchema.properties) {
      for (const key of Object.keys(value)) {
        if (!subSchema.properties[key]) {
          errors.push(`${path}.${key}: additional property not allowed`);
        }
      }
    }
    if (subSchema.required) {
      for (const key of subSchema.required) {
        if (!(key in value)) {
          errors.push(`${path}: missing required property "${key}"`);
        }
      }
    }
    if (subSchema.properties) {
      for (const [key, propSchema] of Object.entries(subSchema.properties)) {
        if (key in value) {
          errors.push(...validateValue(value[key], propSchema, `${path}.${key}`));
        }
      }
    }
  }

  if (subSchema.type === 'array' && Array.isArray(value) && subSchema.items) {
    value.forEach((item, i) => {
      errors.push(...validateValue(item, subSchema.items, `${path}[${i}]`));
    });
  }

  return errors;
}

function validateSession(doc) {
  return validateValue(doc, schema);
}

function assertValid(doc, label = 'document') {
  const errors = validateSession(doc);
  assert.equal(errors.length, 0, `${label} should be valid: ${errors.join('; ')}`);
}

function assertInvalid(doc, label = 'document') {
  const errors = validateSession(doc);
  assert.ok(errors.length > 0, `${label} should be invalid`);
}

// ---------------------------------------------------------------------------
// Schema file structure (TC-028)
// ---------------------------------------------------------------------------

test('fw-session.schema.json exists and declares draft 2020-12', async () => {
  const content = await readFile(SCHEMA_FILE, 'utf8');
  const parsed = JSON.parse(content);
  assert.equal(parsed.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.ok(parsed.required.includes('schema_version'));
  assert.ok(parsed.required.includes('intent'));
  assert.ok(parsed.required.includes('progress'));
  assert.ok(parsed.required.includes('updated_at'));
  assert.equal(parsed.additionalProperties, false);
});

test('schema defines all six Confluence intents', async () => {
  await loadSchema();
  const intents = schema.properties.intent.enum;
  assert.deepEqual(intents, [
    'create-new',
    'add-feature',
    'troubleshoot',
    'update-existing',
    'migrate',
    'publish-status',
  ]);
});

test('schema defines progress phases and publish/escalation blocks', async () => {
  await loadSchema();
  assert.ok(schema.properties.progress.properties.phase.enum.includes('validate'));
  assert.ok(schema.properties.publish);
  assert.ok(schema.properties.escalation.properties.deploy_attempt_count.maximum === 6);
  assert.ok(schema.properties.escalation.properties.fix_attempt_count.maximum === 3);
});

// ---------------------------------------------------------------------------
// Valid fixtures (TC-028, TC-016)
// ---------------------------------------------------------------------------

test('valid minimal create-new session passes validation', async () => {
  await loadSchema();
  assertValid({
    schema_version: '1.0.0',
    intent: 'create-new',
    progress: { phase: 'discover' },
    updated_at: '2026-08-10T10:00:00.000Z',
  });
});

test('valid session with milestones after validate passes (TC-016)', async () => {
  await loadSchema();
  assertValid({
    schema_version: '1.0.0',
    intent: 'create-new',
    intent_confidence: 0.92,
    progress: {
      phase: 'validate',
      milestones: ['setup_complete', 'validate_passed'],
      app_type: 'platform-3-react',
    },
    updated_at: '2026-08-10T12:30:00Z',
  });
});

test('valid session with publish and escalation blocks passes', async () => {
  await loadSchema();
  assertValid({
    schema_version: '1.0.0',
    intent: 'update-existing',
    progress: { phase: 'publish', milestones: ['review_passed'] },
    publish: {
      tracking_id: 'trk-123',
      last_version: '1.2.0',
      last_status: 'approved',
    },
    escalation: {
      deploy_attempt_count: 2,
      fix_attempt_count: 1,
      last_error_signature: 'validate:missing-iparam',
    },
    updated_at: '2026-08-10T15:00:00.000Z',
  });
});

// ---------------------------------------------------------------------------
// Invalid fixtures (TC-017)
// ---------------------------------------------------------------------------

test('missing required fields fails validation', async () => {
  await loadSchema();
  assertInvalid({ intent: 'create-new' });
  assertInvalid({
    schema_version: '1.0.0',
    intent: 'create-new',
    updated_at: '2026-08-10T10:00:00Z',
  });
});

test('invalid intent enum fails validation', async () => {
  await loadSchema();
  assertInvalid({
    schema_version: '1.0.0',
    intent: 'create',
    progress: { phase: 'discover' },
    updated_at: '2026-08-10T10:00:00Z',
  });
});

test('invalid progress phase fails validation', async () => {
  await loadSchema();
  assertInvalid({
    schema_version: '1.0.0',
    intent: 'troubleshoot',
    progress: { phase: 'unknown' },
    updated_at: '2026-08-10T10:00:00Z',
  });
});

test('escalation counts above max fail validation', async () => {
  await loadSchema();
  assertInvalid({
    schema_version: '1.0.0',
    intent: 'troubleshoot',
    progress: { phase: 'build' },
    escalation: { deploy_attempt_count: 7, fix_attempt_count: 0 },
    updated_at: '2026-08-10T10:00:00Z',
  });
});

// ---------------------------------------------------------------------------
// Security — no secret fields (TC-018)
// ---------------------------------------------------------------------------

test('schema rejects additional properties at root (secret fields blocked)', async () => {
  await loadSchema();
  for (const field of SECRET_FIELD_NAMES) {
    assertInvalid(
      {
        schema_version: '1.0.0',
        intent: 'create-new',
        progress: { phase: 'discover' },
        updated_at: '2026-08-10T10:00:00Z',
        [field]: 'must-not-persist',
      },
      `root.${field}`
    );
  }
});

test('schema rejects additional properties in progress object', async () => {
  await loadSchema();
  assertInvalid({
    schema_version: '1.0.0',
    intent: 'add-feature',
    progress: { phase: 'build', api_key: 'leaked' },
    updated_at: '2026-08-10T10:00:00Z',
  });
});

// ---------------------------------------------------------------------------
// Tier 2 session rules documented (TC-016, AC-3)
// ---------------------------------------------------------------------------

test('agent-behaviour.md session section documents read/write rules', async () => {
  const content = await readFile(BEHAVIOUR_FILE, 'utf8');
  assert.ok(content.includes('## Session lifecycle'), 'must have session section');
  assert.ok(content.includes('#session'), 'must have session anchor');
  assert.ok(content.includes('fw-session.schema.json'), 'must reference schema');
  assert.ok(/every interaction/i.test(content), 'must read every interaction');
  assert.ok(/start fresh/i.test(content), 'must offer start fresh on corrupt file');
  assert.ok(/app project root/i.test(content), 'must scope to project root');
  assert.ok(/validate_passed/i.test(content), 'must document validate milestone');
  assert.ok(/never write API keys/i.test(content), 'must prohibit secrets');
});

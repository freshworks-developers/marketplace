import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTS = join(REPO_ROOT, 'skills', 'shared', 'scripts');
const BASH = '/bin/bash';

const DEPRECATED_EXACT =
  '[DEPRECATED] This action is no longer supported. Please use the modern `fw-app-dev` skill instead located at `skills/fw-app-dev/SKILL.md`. Stopping execution.';

async function makeAppDir() {
  const dir = join(tmpdir(), `session-test-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

test('session-read.sh exits 1 when session missing', async () => {
  const appDir = await makeAppDir();
  try {
    await execFileAsync(BASH, [join(SCRIPTS, 'session-read.sh'), appDir]);
    assert.fail('should exit 1');
  } catch (err) {
    assert.equal(err.code, 1);
  }
  await rm(appDir, { recursive: true });
});

test('session-write.sh creates valid session with intent', async () => {
  const appDir = await makeAppDir();
  const { stdout } = await execFileAsync(BASH, [
    join(SCRIPTS, 'session-write.sh'),
    appDir,
    'intent=create-new',
    'progress.phase=setup',
  ]);
  const doc = JSON.parse(stdout);
  assert.equal(doc.intent, 'create-new');
  assert.equal(doc.progress.phase, 'setup');
  assert.equal(doc.step, 'building');
  assert.ok(doc.updated_at);
  await rm(appDir, { recursive: true });
});

test('session-write.sh accepts merge-json without assignments on Bash 3.2', async () => {
  const appDir = await makeAppDir();
  const { stdout } = await execFileAsync(BASH, [
    join(SCRIPTS, 'session-write.sh'),
    appDir,
    '--merge-json',
    '{"intent":"create","progress":{"phase":"build"}}',
  ]);
  const doc = JSON.parse(stdout);
  assert.equal(doc.intent, 'create-new');
  assert.equal(doc.progress.phase, 'build');
  await rm(appDir, { recursive: true });
});

test('session-write.sh deep-merges progress and preserves prior milestones', async () => {
  const appDir = await makeAppDir();
  await execFileAsync(BASH, [
    join(SCRIPTS, 'session-write.sh'),
    appDir,
    '--merge-json',
    '{"intent":"create-new","progress":{"phase":"validate","milestones":["validate_passed"]}}',
  ]);
  const { stdout } = await execFileAsync(BASH, [
    join(SCRIPTS, 'session-write.sh'),
    appDir,
    '--merge-json',
    '{"progress":{"phase":"review","milestones":["review_passed"]}}',
  ]);
  const doc = JSON.parse(stdout);
  assert.equal(doc.progress.phase, 'review');
  assert.deepEqual(doc.progress.milestones, ['validate_passed', 'review_passed']);
  assert.equal(doc.step, 'reviewed');
  await rm(appDir, { recursive: true });
});

test('session-write.sh recomputes step when milestones advance', async () => {
  const appDir = await makeAppDir();
  await execFileAsync(BASH, [
    join(SCRIPTS, 'session-write.sh'),
    appDir,
    'intent=create-new',
    'progress.phase=build',
  ]);
  const { stdout } = await execFileAsync(BASH, [
    join(SCRIPTS, 'session-write.sh'),
    appDir,
    '--merge-json',
    '{"progress":{"milestones":["validate_passed"]}}',
  ]);
  const doc = JSON.parse(stdout);
  assert.equal(doc.step, 'validated');
  await rm(appDir, { recursive: true });
});

test('session-write.sh rejects invalid schema writes before saving', async () => {
  const appDir = await makeAppDir();
  try {
    await execFileAsync(BASH, [
      join(SCRIPTS, 'session-write.sh'),
      appDir,
      '--merge-json',
      '{"intent":"troubleshoot","progress":{"phase":"build"},"escalation":{"fix_attempt_count":"2"}}',
    ]);
    assert.fail('should reject string fix_attempt_count');
  } catch (err) {
    assert.equal(err.code, 1);
    assert.match(err.stderr, /expected integer/);
  }
  await rm(appDir, { recursive: true });
});

test('session-write.sh rejects secret fields before saving', async () => {
  const appDir = await makeAppDir();
  try {
    await execFileAsync(BASH, [
      join(SCRIPTS, 'session-write.sh'),
      appDir,
      'intent=create-new',
      'api_key=secret',
    ]);
    assert.fail('should reject secret field');
  } catch (err) {
    assert.equal(err.code, 1);
    assert.match(err.stderr, /additional property not allowed/);
  }
  await rm(appDir, { recursive: true });
});

test('session-read.sh handles app paths containing quotes', async () => {
  const appDir = join(tmpdir(), `session-test-${Date.now()}-"quoted"`);
  await mkdir(appDir, { recursive: true });
  await writeFile(
    join(appDir, '.fw-session.json'),
    JSON.stringify({
      schema_version: '1.0.0',
      intent: 'create-new',
      progress: { phase: 'discover' },
      updated_at: '2026-08-10T10:00:00.000Z',
    }),
    'utf8'
  );
  const { stdout } = await execFileAsync(BASH, [join(SCRIPTS, 'session-read.sh'), appDir]);
  assert.equal(JSON.parse(stdout).intent, 'create-new');
  await rm(appDir, { recursive: true });
});

test('session-reset.sh requires --force', async () => {
  const appDir = await makeAppDir();
  await execFileAsync(BASH, [
    join(SCRIPTS, 'session-write.sh'),
    appDir,
    'intent=troubleshoot',
  ]);
  try {
    await execFileAsync(BASH, [join(SCRIPTS, 'session-reset.sh'), appDir]);
    assert.fail('should require --force');
  } catch (err) {
    assert.equal(err.code, 1);
  }
  await rm(appDir, { recursive: true });
});

test('agent-telemetry.sh writes _agent block to .meta.json', async () => {
  const appDir = await makeAppDir();
  await mkdir(join(appDir, 'config'), { recursive: true });
  await execFileAsync(BASH, [join(SCRIPTS, 'meta-init.sh'), appDir]);
  await execFileAsync(BASH, [
    join(SCRIPTS, 'agent-telemetry.sh'),
    appDir,
    'intent_detected',
    'last_intent=create-new',
  ]);
  const meta = JSON.parse(await readFile(join(appDir, '.meta.json'), 'utf8'));
  assert.equal(meta._agent.last_event, 'intent_detected');
  assert.equal(meta._agent.last_intent, 'create-new');
  await rm(appDir, { recursive: true });
});

test('Tier 1 and Tier 2 specs use exact DEPRECATED interceptor message', async () => {
  const tier1 = await readFile(
    join(REPO_ROOT, 'installer', 'src', 'specs', 'fw-dev-tools-spec.md'),
    'utf8'
  );
  const tier2 = await readFile(join(REPO_ROOT, 'specs', 'agent-behaviour.md'), 'utf8');
  const appDev = await readFile(join(REPO_ROOT, 'skills', 'fw-app-dev', 'SKILL.md'), 'utf8');
  assert.ok(tier1.includes(DEPRECATED_EXACT));
  assert.ok(tier2.includes(DEPRECATED_EXACT));
  assert.ok(appDev.includes(DEPRECATED_EXACT));
});

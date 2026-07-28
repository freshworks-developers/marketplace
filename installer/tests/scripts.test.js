import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { INSTALL_JSON } from '../src/utils.js';

const execFileAsync = promisify(execFile);
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCRIPTS_DIR = join(REPO_ROOT, 'skills', 'shared', 'scripts');

async function makeTmp() {
  const dir = join(tmpdir(), `scripts-test-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

async function runScript(name, args = []) {
  const script = join(SCRIPTS_DIR, name);
  const { stdout, stderr } = await execFileAsync('bash', [script, ...args], {
    env: { ...process.env, HOME: process.env.HOME },
    timeout: 10_000,
  });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

async function readMeta(dir) {
  return JSON.parse(await readFile(join(dir, '.meta.json'), 'utf8'));
}

// ---------------------------------------------------------------------------
// meta-init.sh
// ---------------------------------------------------------------------------

test('meta-init.sh creates .meta.json from template', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  assert.ok(existsSync(join(tmp, '.meta.json')), '.meta.json should be created');
  const meta = await readMeta(tmp);
  assert.equal(meta.source, 'ai_skills');
  assert.equal(meta.ide_client, 'cursor');
  assert.ok(meta.tracking_id.length === 20, 'tracking_id should be 20 chars');
  assert.match(meta.tracking_id, /^[a-z0-9]{20}$/, 'tracking_id should be lowercase alphanumeric');
  assert.match(meta.start_time, /^\d{4}-\d{2}-\d{2}T/, 'start_time should be ISO date');
  assert.ok(!Object.hasOwn(meta, 'update_check'), 'per-app .meta.json must not include install-only update_check');
  await rm(tmp, { recursive: true });
});

test('meta-init.sh is a no-op when .meta.json already exists', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  const first = await readMeta(tmp);

  await runScript('meta-init.sh', [tmp, 'claude-code']);
  const second = await readMeta(tmp);

  assert.equal(second.tracking_id, first.tracking_id, 'tracking_id must not change on re-run');
  assert.equal(second.ide_client, 'cursor', 'ide_client must not change on re-run');
  await rm(tmp, { recursive: true });
});

test('meta-init.sh exits with error when no app-dir given', async () => {
  await assert.rejects(
    () => runScript('meta-init.sh', []),
    { code: 1 },
    'should exit 1 with no args'
  );
});

// ---------------------------------------------------------------------------
// meta-update.sh
// ---------------------------------------------------------------------------

test('meta-update.sh sets string and number fields', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-update.sh', [tmp, 'fw-app-dev', 'invoked=1', 'skill_version=1.1.2', 'validate_iterations=3']);
  const meta = await readMeta(tmp);
  assert.equal(meta['fw-app-dev'].invoked, 1);
  assert.equal(meta['fw-app-dev'].skill_version, '1.1.2');
  assert.equal(meta['fw-app-dev'].validate_iterations, 3);
  await rm(tmp, { recursive: true });
});

test('meta-update.sh strips quotes from skill_version', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-update.sh', [tmp, 'fw-app-dev', 'invoked=1', 'skill_version="1.1.5"']);
  const meta = await readMeta(tmp);
  assert.equal(meta['fw-app-dev'].skill_version, '1.1.5');
  await rm(tmp, { recursive: true });
});

test('meta-update.sh sets boolean fields', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-update.sh', [tmp, 'fw-setup', 'setup_node_changed=true', 'setup_fdk_changed=false']);
  const meta = await readMeta(tmp);
  assert.equal(meta['fw-setup'].setup_node_changed, true);
  assert.equal(meta['fw-setup'].setup_fdk_changed, false);
  await rm(tmp, { recursive: true });
});

test('meta-update.sh appends to array with += syntax', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-update.sh', [tmp, 'fw-app-dev', 'validation_error_categories+=lint-async-no-await']);
  await runScript('meta-update.sh', [tmp, 'fw-app-dev', 'validation_error_categories+=missing-request-template']);
  const meta = await readMeta(tmp);
  assert.ok(meta['fw-app-dev'].validation_error_categories.includes('lint-async-no-await'));
  assert.ok(meta['fw-app-dev'].validation_error_categories.includes('missing-request-template'));
  assert.equal(meta['fw-app-dev'].validation_error_categories.length, 2);
  await rm(tmp, { recursive: true });
});

test('meta-update.sh does not duplicate array values', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-update.sh', [tmp, 'fw-app-dev', 'validation_error_categories+=lint-async-no-await']);
  await runScript('meta-update.sh', [tmp, 'fw-app-dev', 'validation_error_categories+=lint-async-no-await']);
  const meta = await readMeta(tmp);
  assert.equal(meta['fw-app-dev'].validation_error_categories.length, 1);
  await rm(tmp, { recursive: true });
});

test('meta-update.sh preserves top-level fields', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'claude-code']);
  const before = await readMeta(tmp);
  await runScript('meta-update.sh', [tmp, 'fw-review', 'invoked=1', 'skill_version=1.1.2']);
  const after = await readMeta(tmp);
  assert.equal(after.tracking_id, before.tracking_id);
  assert.equal(after.ide_client, before.ide_client);
  assert.equal(after.start_time, before.start_time);
  await rm(tmp, { recursive: true });
});

test('meta-update.sh exits with error when .meta.json is absent', async () => {
  const tmp = await makeTmp();
  await assert.rejects(
    () => runScript('meta-update.sh', [tmp, 'fw-app-dev', 'invoked=1']),
    { code: 1 }
  );
  await rm(tmp, { recursive: true });
});

// ---------------------------------------------------------------------------
// meta-feedback.sh
// ---------------------------------------------------------------------------

test('meta-feedback.sh writes liked with comment', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-feedback.sh', [tmp, 'liked', 'Setup was smooth']);
  const meta = await readMeta(tmp);
  assert.deepEqual(meta.developer_feedback, { rating: 'liked', comment: 'Setup was smooth' });
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh writes disliked without comment key', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-feedback.sh', [tmp, 'disliked']);
  const meta = await readMeta(tmp);
  assert.equal(meta.developer_feedback.rating, 'disliked');
  assert.ok(!Object.hasOwn(meta.developer_feedback, 'comment'));
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh writes disliked with comment', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-feedback.sh', [tmp, 'disliked', 'publish gates were confusing']);
  const meta = await readMeta(tmp);
  assert.deepEqual(meta.developer_feedback, {
    rating: 'disliked',
    comment: 'publish gates were confusing',
  });
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh omits comment key for whitespace-only comment', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-feedback.sh', [tmp, 'liked', '   ']);
  const meta = await readMeta(tmp);
  assert.equal(meta.developer_feedback.rating, 'liked');
  assert.ok(!Object.hasOwn(meta.developer_feedback, 'comment'));
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh overwrites prior feedback', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-feedback.sh', [tmp, 'liked', 'first']);
  await runScript('meta-feedback.sh', [tmp, 'disliked', 'changed mind']);
  const meta = await readMeta(tmp);
  assert.deepEqual(meta.developer_feedback, { rating: 'disliked', comment: 'changed mind' });
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh joins multi-word comment', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-feedback.sh', [tmp, 'liked', 'fast setup', 'clear docs']);
  const meta = await readMeta(tmp);
  assert.equal(meta.developer_feedback.comment, 'fast setup clear docs');
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh preserves skill blocks', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await runScript('meta-update.sh', [tmp, 'fw-app-dev', 'invoked=1']);
  await runScript('meta-feedback.sh', [tmp, 'liked']);
  const meta = await readMeta(tmp);
  assert.equal(meta['fw-app-dev'].invoked, 1);
  assert.equal(meta.developer_feedback.rating, 'liked');
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh rejects invalid rating', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  await assert.rejects(
    () => runScript('meta-feedback.sh', [tmp, 'skip']),
    { code: 1 }
  );
  const meta = await readMeta(tmp);
  assert.ok(!Object.hasOwn(meta, 'developer_feedback'));
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh exits when .meta.json is absent', async () => {
  const tmp = await makeTmp();
  await assert.rejects(
    () => runScript('meta-feedback.sh', [tmp, 'liked']),
    { code: 1 }
  );
  await rm(tmp, { recursive: true });
});

test('meta-feedback.sh exits when args missing', async () => {
  await assert.rejects(() => runScript('meta-feedback.sh', []), { code: 1 });
});

// ---------------------------------------------------------------------------
// meta-delete.sh
// ---------------------------------------------------------------------------

test('meta-delete.sh removes .meta.json', async () => {
  const tmp = await makeTmp();
  await runScript('meta-init.sh', [tmp, 'cursor']);
  assert.ok(existsSync(join(tmp, '.meta.json')));
  await runScript('meta-delete.sh', [tmp]);
  assert.ok(!existsSync(join(tmp, '.meta.json')), '.meta.json should be deleted');
  await rm(tmp, { recursive: true });
});

test('meta-delete.sh is a no-op when .meta.json is absent', async () => {
  const tmp = await makeTmp();
  await assert.doesNotReject(() => runScript('meta-delete.sh', [tmp]));
  await rm(tmp, { recursive: true });
});

// ---------------------------------------------------------------------------
// check-update.sh
// ---------------------------------------------------------------------------

test('check-update.sh exits silently when .meta.json is absent', async () => {
  const { stdout } = await runScript('check-update.sh');
  assert.equal(stdout, '', 'should produce no output when .meta.json missing');
});

test('check-update.sh writes lastChecked to .meta.json', async () => {
  const META = INSTALL_JSON;
  const metaDir = dirname(META);
  await mkdir(metaDir, { recursive: true });

  const original = existsSync(META) ? await readFile(META, 'utf8') : null;

  await writeFile(META, JSON.stringify({
    version: '1.1.2',
    client: 'cursor',
    method: 'npx',
    installedAt: '2026-01-01T00:00:00.000Z',
    update_check: { lastChecked: null, lastNudged: null, latestVersion: null, updateAvailable: false },
  }, null, 2) + '\n', 'utf8');

  await runScript('check-update.sh');

  const meta = JSON.parse(await readFile(META, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  assert.equal(meta.update_check.lastChecked, today, 'lastChecked should be set to today');

  // Restore original state
  if (original) {
    await writeFile(META, original, 'utf8');
  } else {
    await rm(META, { force: true });
  }
});

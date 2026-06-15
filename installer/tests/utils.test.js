import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { copySkills, writeInstallState, readInstallState, VERSION, INSTALL_JSON } from '../src/utils.js';

async function makeTmp() {
  const dir = join(tmpdir(), `utils-test-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

// ---------------------------------------------------------------------------
// copySkills
// ---------------------------------------------------------------------------

test('copySkills creates target dir if absent', async () => {
  const tmp = await makeTmp();
  const dest = join(tmp, 'skills-out');
  await copySkills(dest);
  assert.ok(existsSync(dest));
  await rm(tmp, { recursive: true });
});

test('copySkills copies all 5 skill subdirectories', async () => {
  const tmp = await makeTmp();
  const dest = join(tmp, 'skills-out');
  await copySkills(dest);
  const expected = ['fw-setup', 'fw-app-dev', 'fw-ai-actions-app', 'fw-review', 'fw-publish'];
  for (const skill of expected) {
    assert.ok(existsSync(join(dest, skill)), `${skill} should be copied`);
    assert.ok(existsSync(join(dest, skill, 'SKILL.md')), `${skill}/SKILL.md should exist`);
  }
  await rm(tmp, { recursive: true });
});

test('copySkills does not copy non-directory entries from skills/', async () => {
  const tmp = await makeTmp();
  const dest = join(tmp, 'skills-out');
  await copySkills(dest);
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(dest, { withFileTypes: true });
  for (const e of entries) {
    assert.ok(e.isDirectory(), `expected only dirs in skills-out, got file: ${e.name}`);
  }
  await rm(tmp, { recursive: true });
});

test('copySkills overwrites existing skills on re-run', async () => {
  const tmp = await makeTmp();
  const dest = join(tmp, 'skills-out');

  await copySkills(dest);

  const target = join(dest, 'fw-setup', 'SKILL.md');
  await writeFile(target, 'corrupted', 'utf8');
  assert.equal(await readFile(target, 'utf8'), 'corrupted');

  await copySkills(dest);
  const content = await readFile(target, 'utf8');
  assert.notEqual(content, 'corrupted', 'SKILL.md should be restored on re-run');
  await rm(tmp, { recursive: true });
});

// ---------------------------------------------------------------------------
// writeInstallState / readInstallState
// ---------------------------------------------------------------------------

test('writeInstallState writes correct JSON shape', async () => {
  const written = await writeInstallState({ client: 'cursor' });
  assert.equal(written.version, VERSION);
  assert.equal(written.client, 'cursor');
  assert.equal(written.method, 'npx');
  assert.ok(written.installedAt, 'installedAt should be set');
  assert.ok(!Number.isNaN(Date.parse(written.installedAt)), 'installedAt should be a valid ISO date');
  await rm(INSTALL_JSON, { force: true });
});

test('writeInstallState accepts custom method', async () => {
  const written = await writeInstallState({ client: 'claude-code', method: 'npm' });
  assert.equal(written.method, 'npm');
  await rm(INSTALL_JSON, { force: true });
});

test('readInstallState round-trips written state', async () => {
  await writeInstallState({ client: 'codex' });
  const state = await readInstallState();
  assert.equal(state.version, VERSION);
  assert.equal(state.client, 'codex');
  await rm(INSTALL_JSON, { force: true });
});

test('readInstallState returns null when file does not exist', async () => {
  await rm(INSTALL_JSON, { force: true });
  const state = await readInstallState();
  assert.equal(state, null);
});

test('readInstallState returns null for broken JSON', async () => {
  await mkdir(dirname(INSTALL_JSON), { recursive: true });
  await writeFile(INSTALL_JSON, '{ broken', 'utf8');
  const state = await readInstallState();
  assert.equal(state, null);
  await rm(INSTALL_JSON, { force: true });
});

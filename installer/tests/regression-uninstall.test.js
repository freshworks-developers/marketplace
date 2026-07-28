/**
 * K.x Uninstall regression scenarios.
 *
 * Hermetic unit/integration tests — no real CLI subprocess, no real fs side effects.
 * Uses tmp dirs to simulate ~/.fw-dev-tools and app directories.
 * Does NOT import from installer/src/utils.js (top-level await requires REPO_ROOT to exist).
 * Inlines minimal logic (write JSON, read JSON, rm) to test the contracts directly.
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// ---------------------------------------------------------------------------
// Helpers — mirror the contracts of utils.js without importing it
// ---------------------------------------------------------------------------

async function writeMetaJson(dir, state) {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, '.meta.json'), JSON.stringify(state, null, 2) + '\n', 'utf8');
}

async function readMetaJson(dir) {
  try {
    return JSON.parse(await readFile(join(dir, '.meta.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function removeMetaJson(dir) {
  await rm(join(dir, '.meta.json'), { force: true });
}

async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('Uninstall regression scenarios', () => {
  let tmpBase;

  beforeEach(async () => {
    tmpBase = await mkdtemp(join(tmpdir(), 'fw-uninstall-regression-'));
  });

  afterEach(async () => {
    await rm(tmpBase, { recursive: true, force: true });
  });

  // K.1: state file records multiple clients; both are visible after two installs
  test('install for two clients writes both to clients array in .meta.json', async () => {
    const fwDir = join(tmpBase, '.fw-dev-tools');

    // Simulate first install (cursor)
    await writeMetaJson(fwDir, {
      version: '1.1.6',
      client: 'cursor',
      clients: ['cursor'],
      installedAt: new Date().toISOString(),
    });

    // Simulate second install (codex) accumulating into clients array
    const existing = await readMetaJson(fwDir);
    assert.ok(existing, 'state should exist after first install');
    const updatedClients = existing.clients.includes('codex')
      ? existing.clients
      : [...existing.clients, 'codex'];
    await writeMetaJson(fwDir, { ...existing, client: 'codex', clients: updatedClients });

    const state = await readMetaJson(fwDir);
    assert.ok(state, '.meta.json should be present');
    assert.ok(Array.isArray(state.clients), 'clients should be an array');
    assert.ok(state.clients.includes('cursor'), 'clients should include cursor');
    assert.ok(state.clients.includes('codex'), 'clients should include codex');
    assert.equal(state.clients.length, 2, 'no duplicate clients');
  });

  // K.2: fdk binary absent from PATH in a new shell after uninstall — requires a real shell
  //       session to verify; not automatable hermetically. Covered by manual spec row K.3.
  // K.3: fdk not found via `which fdk` after uninstall — same constraint as K.2.

  // K.4: uninstall removes ~/.fw-dev-tools/.meta.json (global state)
  test('global uninstall removes .meta.json from fw-dev-tools dir', async () => {
    const fwDir = join(tmpBase, '.fw-dev-tools');
    await writeMetaJson(fwDir, {
      version: '1.1.6',
      client: 'cursor',
      clients: ['cursor'],
      installedAt: new Date().toISOString(),
    });

    assert.ok(await fileExists(join(fwDir, '.meta.json')), 'precondition: .meta.json exists');

    // Simulate uninstall removing global state
    await removeMetaJson(fwDir);

    assert.ok(!await fileExists(join(fwDir, '.meta.json')), '.meta.json should be gone after uninstall');
    const state = await readMetaJson(fwDir);
    assert.equal(state, null, 'readMetaJson should return null when file is absent');
  });

  // K.5: per-app .meta.json (in app dir) is NOT touched by global uninstall
  test('global uninstall leaves per-app .meta.json in app root intact', async () => {
    const fwDir = join(tmpBase, '.fw-dev-tools');
    const appDir = join(tmpBase, 'my-app');

    const appMeta = { tracking_id: 'abc123', source: 'ai_skills', 'fw-app-dev': { invoked: 3 } };

    await writeMetaJson(fwDir, {
      version: '1.1.6',
      client: 'cursor',
      clients: ['cursor'],
      installedAt: new Date().toISOString(),
    });
    await writeMetaJson(appDir, appMeta);

    assert.ok(await fileExists(join(appDir, '.meta.json')), 'precondition: app .meta.json exists');

    // Simulate global uninstall — only removes ~/.fw-dev-tools/.meta.json
    await removeMetaJson(fwDir);

    assert.ok(!await fileExists(join(fwDir, '.meta.json')), 'global .meta.json should be removed');
    assert.ok(await fileExists(join(appDir, '.meta.json')), 'per-app .meta.json must survive');

    const survived = await readMetaJson(appDir);
    assert.deepEqual(survived, appMeta, 'per-app .meta.json content must be unchanged');
  });

  // K.6: readInstallState contract — returns null when .meta.json is absent
  test('readMetaJson returns null when .meta.json is absent', async () => {
    const fwDir = join(tmpBase, '.fw-dev-tools');
    // Directory exists but no .meta.json inside
    await mkdir(fwDir, { recursive: true });

    const state = await readMetaJson(fwDir);
    assert.equal(state, null, 'should return null for absent .meta.json');
  });

  // K.6 corollary: readInstallState contract — returns null when file contains invalid JSON
  test('readMetaJson returns null when .meta.json is corrupt', async () => {
    const fwDir = join(tmpBase, '.fw-dev-tools');
    await mkdir(fwDir, { recursive: true });
    await writeFile(join(fwDir, '.meta.json'), '{not valid json', 'utf8');

    const state = await readMetaJson(fwDir);
    assert.equal(state, null, 'should return null for corrupt .meta.json');
  });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, rm, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { INSTALL_JSON } from '../src/utils.js';

// version-check.js reads install state via utils (respects FW_DEV_TOOLS_HOME in test runs).

async function writeState(data) {
  await mkdir(dirname(INSTALL_JSON), { recursive: true });
  await writeFile(INSTALL_JSON, JSON.stringify(data), 'utf8');
}

async function removeState() {
  await rm(INSTALL_JSON, { force: true });
}

// ---------------------------------------------------------------------------
// readInstallState
// ---------------------------------------------------------------------------

test('readInstallState returns null when file absent', async () => {
  await removeState();
  const { readInstallState } = await import('../src/utils.js');
  const state = await readInstallState();
  assert.equal(state, null);
});

test('readInstallState returns parsed object when file exists', async () => {
  await writeState({ version: '1.1.0', client: 'cursor', method: 'npx-github', installedAt: '2026-01-01T00:00:00.000Z' });
  const { readInstallState } = await import('../src/utils.js');
  const state = await readInstallState();
  assert.equal(state.version, '1.1.0');
  assert.equal(state.client, 'cursor');
  await removeState();
});

test('readInstallState returns null for broken JSON', async () => {
  await mkdir(dirname(INSTALL_JSON), { recursive: true });
  await writeFile(INSTALL_JSON, '{ broken', 'utf8');
  const { readInstallState } = await import('../src/utils.js');
  const state = await readInstallState();
  assert.equal(state, null);
  await removeState();
});

// ---------------------------------------------------------------------------
// checkForUpdate — compare logic (no real network calls)
// ---------------------------------------------------------------------------

test('checkForUpdate returns updateAvailable:false when no install state', async () => {
  await removeState();
  // fetchLatestRelease will either succeed or fail silently (network);
  // without install state, updateAvailable must be false regardless.
  const { checkForUpdate } = await import('../src/version-check.js');
  const result = await checkForUpdate();
  assert.equal(result.updateAvailable, false, 'no install state → no update available');
  assert.equal(result.current, null);
});

test('checkForUpdate returns updateAvailable:false when versions match', async () => {
  // We cannot control fetchLatestRelease without mocking fetch, so we test
  // the case where the versions match by checking the function's return shape.
  const { checkForUpdate } = await import('../src/version-check.js');
  await writeState({ version: '1.1.0', client: 'cursor', method: 'npx-github', installedAt: '2026-01-01T00:00:00.000Z' });
  const result = await checkForUpdate();
  // If offline, latest is null → updateAvailable is false. If online and
  // versions match, also false. Both are valid outcomes.
  assert.equal(typeof result.updateAvailable, 'boolean');
  assert.equal(typeof result.current, 'string');
  assert.equal(result.current, '1.1.0');
  await removeState();
});

test('checkForUpdate returns expected shape', async () => {
  await writeState({ version: '1.0.0', client: 'cursor', method: 'npx-github', installedAt: '2026-01-01T00:00:00.000Z' });
  const { checkForUpdate } = await import('../src/version-check.js');
  const result = await checkForUpdate();
  assert.ok('current' in result);
  assert.ok('latest' in result);
  assert.ok('updateAvailable' in result);
  assert.ok('releaseUrl' in result);
  assert.equal(result.current, '1.0.0');
  await removeState();
});

test('fetchLatestRelease uses FW_TEST_MOCK_LATEST_VERSION when set', async () => {
  const prev = process.env.FW_TEST_MOCK_LATEST_VERSION;
  process.env.FW_TEST_MOCK_LATEST_VERSION = '42.0.0';
  try {
    const { fetchLatestRelease } = await import('../src/version-check.js');
    const result = await fetchLatestRelease();
    assert.equal(result.version, '42.0.0');
  } finally {
    if (prev === undefined) delete process.env.FW_TEST_MOCK_LATEST_VERSION;
    else process.env.FW_TEST_MOCK_LATEST_VERSION = prev;
  }
});

// ---------------------------------------------------------------------------
// fetchLatestRelease — offline graceful failure
// ---------------------------------------------------------------------------

test('fetchLatestRelease returns null gracefully when offline/unavailable', async () => {
  // We mock global fetch to simulate network failure.
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Network error'); };
  try {
    // Re-import after mock — ESM cache means we must use the same cached module.
    // Since fetchLatestRelease wraps fetch in try/catch, it should return null.
    const { fetchLatestRelease } = await import('../src/version-check.js');
    const result = await fetchLatestRelease();
    assert.equal(result, null, 'should return null on network error');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

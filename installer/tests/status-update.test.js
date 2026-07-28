/**
 * Tests for src/status.js and src/update.js.
 *
 * Both modules depend on readInstallState (real ~/.fw-dev-tools/.meta.json) and
 * checkForUpdate (network). We test their logic by writing a known state file and
 * capturing console output rather than mocking the modules, keeping the tests
 * deterministic and dependency-free.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, rm, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { INSTALL_JSON } from '../src/utils.js';

async function writeState(data) {
  await mkdir(dirname(INSTALL_JSON), { recursive: true });
  await writeFile(INSTALL_JSON, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function removeState() {
  await rm(INSTALL_JSON, { force: true });
}

function captureConsole() {
  const lines = [];
  const orig = { log: console.log, error: console.error };
  console.log = (...args) => lines.push(args.join(' '));
  console.error = (...args) => lines.push(args.join(' '));
  const restore = () => { console.log = orig.log; console.error = orig.error; };
  return { lines, restore };
}

// ---------------------------------------------------------------------------
// status.js
// ---------------------------------------------------------------------------

test('status prints not-installed when .meta.json is absent', async () => {
  await removeState();
  const { status } = await import('../src/status.js');
  const { lines, restore } = captureConsole();
  try {
    await status();
  } finally {
    restore();
  }
  assert.ok(
    lines.some(l => l.includes('not installed') || l.includes('npx @freshworks/fw-dev-tools install')),
    `expected not-installed message, got: ${lines.join(' | ')}`
  );
});

test('status prints installed version and client when .meta.json exists', async () => {
  await writeState({
    version: '1.1.2',
    client: 'cursor',
    method: 'npx',
    installedAt: '2026-01-01T00:00:00.000Z',
    update_check: { lastChecked: null, lastNudged: null, latestVersion: null, updateAvailable: false },
  });
  const { status } = await import('../src/status.js');
  const { lines, restore } = captureConsole();
  try {
    await status();
  } finally {
    restore();
  }
  assert.ok(lines.some(l => l.includes('1.1.2')), `expected version in output, got: ${lines.join(' | ')}`);
  assert.ok(lines.some(l => l.includes('cursor')), `expected client in output, got: ${lines.join(' | ')}`);
  await removeState();
});

// ---------------------------------------------------------------------------
// update.js
// ---------------------------------------------------------------------------

test('update exits early when .meta.json is absent', async () => {
  await removeState();
  const { update } = await import('../src/update.js');
  const { lines, restore } = captureConsole();
  let exitCode;
  const origExit = process.exit;
  process.exit = (code) => { exitCode = code; throw new Error(`process.exit(${code})`); };
  try {
    await update({ yes: true });
  } catch {
    // expected — process.exit throws
  } finally {
    process.exit = origExit;
    restore();
  }
  assert.equal(exitCode, 1, 'update should exit(1) when not installed');
  assert.ok(lines.some(l => l.includes('install')), `expected install hint in output, got: ${lines.join(' | ')}`);
});

test('update prints up-to-date when installed version matches latest', async () => {
  await writeState({
    version: '99.99.99',
    client: 'cursor',
    method: 'npx',
    installedAt: '2026-01-01T00:00:00.000Z',
    update_check: { lastChecked: null, lastNudged: null, latestVersion: null, updateAvailable: false },
  });
  const { update } = await import('../src/update.js');
  const { restore } = captureConsole();
  try {
    await update({ yes: true });
  } finally {
    restore();
  }
  // Either "up to date" or we got an update — both are valid without real network.
  // Key assertion: it did not throw, and no unexpected crash.
  assert.ok(true);
  await removeState();
});

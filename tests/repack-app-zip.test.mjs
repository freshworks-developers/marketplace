/**
 * Unit tests for fw-publish/scripts/repack-app-zip.sh (.meta.json in zip).
 */
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const REPO_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPACK = join(REPO_DIR, 'skills/fw-publish/scripts/repack-app-zip.sh');

test('repack-app-zip.sh includes .meta.json at zip root when present', { skip: process.platform === 'win32' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'repack-meta-'));
  const appDir = join(dir, 'app');
  const srcZip = join(dir, 'src.zip');
  const unpackDir = join(dir, 'unpack');
  const outZip = join(dir, 'out.zip');

  mkdirSync(appDir);
  writeFileSync(join(appDir, 'manifest.json'), '{"platform-version":"3.0","modules":{}}');
  writeFileSync(join(appDir, '.meta.json'), '{"tracking_id":"abc123def456ghijklmn","fw-publish":{"invoked":1}}');
  execSync(`zip -j -q "${srcZip}" "${join(appDir, 'manifest.json')}" "${join(appDir, '.meta.json')}"`);

  execSync(`bash "${REPACK}" "${srcZip}" "${unpackDir}" "${outZip}"`, { encoding: 'utf8' });

  const listing = execSync(`unzip -l "${outZip}"`, { encoding: 'utf8' });
  assert.match(listing, /(^|\s)\.meta\.json(\s|$)/m, 'repacked zip must list .meta.json at archive root');
  assert.match(listing, /(^|\s)manifest\.json(\s|$)/m, 'repacked zip must list manifest.json at archive root');
});

test('repack-app-zip.sh source lists .meta.json in member loop', () => {
  const src = execSync(`cat "${REPACK}"`, { encoding: 'utf8' });
  assert.match(src, /\.meta\.json/, 'repack script must reference .meta.json in pack members');
});

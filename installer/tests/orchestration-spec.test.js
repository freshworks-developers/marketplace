import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURSOR_MCP_ENTRY } from '../src/orchestration-spec.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SPEC_FILE = join(REPO_ROOT, 'installer', 'src', 'specs', 'fw-dev-tools-spec.md');

// ---------------------------------------------------------------------------
// Static spec file
// ---------------------------------------------------------------------------

test('spec file exists and is readable', async () => {
  const content = await readFile(SPEC_FILE, 'utf8');
  assert.ok(content.length > 0, 'spec file must not be empty');
});

test('spec file contains routing table for all 5 skills', async () => {
  const content = await readFile(SPEC_FILE, 'utf8');
  assert.ok(content.includes('fw-app-dev'), 'should route to fw-app-dev');
  assert.ok(content.includes('fw-ai-actions-app'), 'should route to fw-ai-actions-app');
  assert.ok(content.includes('fw-review'), 'should route to fw-review');
  assert.ok(content.includes('fw-setup'), 'should route to fw-setup');
  assert.ok(content.includes('fw-publish'), 'should route to fw-publish');
});

test('spec file marks fw-review as MANDATORY', async () => {
  const content = await readFile(SPEC_FILE, 'utf8');
  assert.ok(content.includes('MANDATORY'), 'fw-review must be flagged mandatory');
});

test('spec file lists deprecated MCP tools', async () => {
  const content = await readFile(SPEC_FILE, 'utf8');
  assert.ok(content.includes('DEPRECATED'), 'should flag deprecated tools');
  assert.ok(content.includes('implement_app'), 'should list implement_app');
});

test('spec file includes update command hint', async () => {
  const content = await readFile(SPEC_FILE, 'utf8');
  assert.ok(content.includes('npx @freshworks/fw-dev-tools update'), 'should mention update command');
});

test('spec file has no HTML fences or MDC frontmatter', async () => {
  const content = await readFile(SPEC_FILE, 'utf8');
  assert.ok(!content.includes('<!-- fw-dev-tools'), 'spec file must not contain fenced block markers');
  assert.ok(!content.startsWith('---'), 'spec file must not start with MDC frontmatter');
});

// ---------------------------------------------------------------------------
// CURSOR_MCP_ENTRY
// ---------------------------------------------------------------------------

test('CURSOR_MCP_ENTRY has correct MCP server URL', () => {
  assert.equal(CURSOR_MCP_ENTRY.url, 'https://mcp.freshworks.dev/mcp');
});

test('CURSOR_MCP_ENTRY has Authorization header with placeholder token', () => {
  assert.ok(CURSOR_MCP_ENTRY.headers?.Authorization, 'should have Authorization header');
  assert.ok(
    CURSOR_MCP_ENTRY.headers.Authorization.startsWith('Bearer '),
    'should use Bearer scheme'
  );
  assert.ok(
    CURSOR_MCP_ENTRY.headers.Authorization.includes('<your-api-token>'),
    'should use placeholder, not a real token'
  );
});

test('CURSOR_MCP_ENTRY has no unexpected keys', () => {
  const allowed = new Set(['url', 'headers']);
  for (const key of Object.keys(CURSOR_MCP_ENTRY)) {
    assert.ok(allowed.has(key), `unexpected key: ${key}`);
  }
});

/**
 * Integration tests — end-to-end round-trips using real filesystem operations
 * in isolated temp directories.
 *
 * These tests exercise multiple modules together:
 *   mcp-merge + orchestration-spec + fenced-block + utils
 *
 * We cannot easily redirect the client handlers (cursor.js, claude.js, codex.js)
 * away from ~/.cursor, ~/.claude, ~/.codex because they resolve those paths at
 * module load time. Their constituent building-blocks are tested here instead.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { mergeMcpServer, patchMcpToken, readMcpToken } from '../src/mcp-merge.js';

import { copySkills, writeInstallState, readInstallState, VERSION, INSTALL_JSON } from '../src/utils.js';
import { CURSOR_MCP_ENTRY } from '../src/orchestration-spec.js';

async function makeTmp() {
  const dir = join(tmpdir(), `fw-integration-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

// ---------------------------------------------------------------------------
// Round-trip: install then uninstall state marker
// ---------------------------------------------------------------------------

test('install state round-trip: write → read → remove', async () => {
  await rm(INSTALL_JSON, { force: true });

  const state = await writeInstallState({ client: 'cursor' });
  assert.equal(state.version, VERSION);
  assert.equal(state.client, 'cursor');

  const read = await readInstallState();
  assert.deepEqual(read, state);

  await rm(INSTALL_JSON, { force: true });
  const afterRemove = await readInstallState();
  assert.equal(afterRemove, null);
});

// ---------------------------------------------------------------------------
// Round-trip: MCP merge, token patch, token read
// ---------------------------------------------------------------------------

test('MCP round-trip: create → patch token → read token → re-merge no-op', async () => {
  const tmp = await makeTmp();
  const mcpJson = join(tmp, 'mcp.json');

  // Step 1: create
  const r1 = await mergeMcpServer(mcpJson, CURSOR_MCP_ENTRY);
  assert.equal(r1.action, 'created');

  // Step 2: placeholder token is not set yet
  const t1 = await readMcpToken(mcpJson);
  assert.equal(t1, null, 'placeholder should not count as a real token');

  // Step 3: patch a real token
  await patchMcpToken(mcpJson, 'abc-real-token');
  const t2 = await readMcpToken(mcpJson);
  assert.equal(t2, 'abc-real-token');

  // Step 4: re-merging with the placeholder entry replaces the patched entry
  // with the placeholder URL/headers (which is the correct safe-merge behaviour).
  // The real token would then need re-patching — that's the documented update flow.
  const r2 = await mergeMcpServer(mcpJson, CURSOR_MCP_ENTRY);
  assert.ok(['unchanged', 'merged'].includes(r2.action), 'should not error on re-merge');

  await rm(tmp, { recursive: true });
});

test('MCP merge preserves existing third-party servers across multiple writes', async () => {
  const tmp = await makeTmp();
  const mcpJson = join(tmp, 'mcp.json');

  const existing = {
    mcpServers: {
      'my-other-mcp': { url: 'https://example.com/mcp' },
      'another-mcp': { url: 'https://other.dev/mcp', headers: { Authorization: 'Bearer xyz' } },
    },
  };
  await writeFile(mcpJson, JSON.stringify(existing, null, 2), 'utf8');

  await mergeMcpServer(mcpJson, CURSOR_MCP_ENTRY);
  await mergeMcpServer(mcpJson, CURSOR_MCP_ENTRY); // second call = unchanged

  const merged = JSON.parse(await readFile(mcpJson, 'utf8'));
  assert.deepEqual(merged.mcpServers['my-other-mcp'], existing.mcpServers['my-other-mcp']);
  assert.deepEqual(merged.mcpServers['another-mcp'], existing.mcpServers['another-mcp']);
  assert.ok(merged.mcpServers['fw-dev-mcp'], 'fw-dev-mcp should be present');

  await rm(tmp, { recursive: true });
});

// ---------------------------------------------------------------------------
// Round-trip: copySkills → verify → re-copy (simulated update)
// ---------------------------------------------------------------------------

test('copySkills → corrupt a file → re-copy restores it', async () => {
  const tmp = await makeTmp();
  const dest = join(tmp, 'skills');

  await copySkills(dest);
  const skillMd = join(dest, 'fw-setup', 'SKILL.md');
  const original = await readFile(skillMd, 'utf8');
  assert.ok(original.length > 0, 'SKILL.md should have content');

  await writeFile(skillMd, 'corrupted', 'utf8');
  assert.equal(await readFile(skillMd, 'utf8'), 'corrupted');

  await copySkills(dest); // simulates `fw-dev-tools update`
  const restored = await readFile(skillMd, 'utf8');
  assert.equal(restored, original, 'SKILL.md restored after re-copy');

  await rm(tmp, { recursive: true });
});


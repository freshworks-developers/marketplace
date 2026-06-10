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
import { upsertBlock, removeBlock } from '../src/fenced-block.js';
import { copySkills, writeInstallState, readInstallState, VERSION, INSTALL_JSON } from '../src/utils.js';
import { CURSOR_MCP_ENTRY, CLAUDE_MD_BLOCK, CURSOR_MDC } from '../src/orchestration-spec.js';

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
// Round-trip: CLAUDE.md fenced block — install then uninstall
// ---------------------------------------------------------------------------

test('CLAUDE.md install → uninstall round-trip leaves file clean', async () => {
  const original = '# My Config\n\nExisting content that must survive.\n';
  const withBlock = upsertBlock(original, CLAUDE_MD_BLOCK);

  assert.ok(withBlock.includes('<!-- fw-dev-tools start -->'));
  assert.ok(withBlock.includes('# My Config'), 'original content preserved');

  const restored = removeBlock(withBlock);
  assert.ok(!restored.includes('<!-- fw-dev-tools start -->'), 'block should be gone');
  assert.ok(!restored.includes('<!-- fw-dev-tools end -->'), 'block end should be gone');
  assert.ok(restored.includes('# My Config'), 'original header preserved');
  assert.ok(restored.includes('Existing content that must survive.'), 'original body preserved');
  assert.ok(!restored.includes('\n\n\n'), 'no triple newlines after removal');
});

test('CLAUDE.md update: re-running install replaces old block with new one', async () => {
  const oldBlock = `<!-- fw-dev-tools start -->
## Old routing block
Old content.
<!-- fw-dev-tools end -->`;

  const existing = `# Config\n\n${oldBlock}\n\nFooter content.\n`;
  const newResult = upsertBlock(existing, CLAUDE_MD_BLOCK);

  assert.ok(!newResult.includes('Old routing block'), 'old block content should be gone');
  assert.ok(newResult.includes('Freshworks Agentic Developer Toolkit'), 'new block should be present');
  assert.ok(newResult.includes('# Config'), 'pre-block content preserved');
  assert.ok(newResult.includes('Footer content.'), 'post-block content preserved');
  const count = (newResult.match(/<!-- fw-dev-tools start -->/g) ?? []).length;
  assert.equal(count, 1, 'exactly one block after update');
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

// ---------------------------------------------------------------------------
// CURSOR_MDC — structural integrity
// ---------------------------------------------------------------------------

test('CURSOR_MDC frontmatter parses to expected key-value pairs', () => {
  const lines = CURSOR_MDC.split('\n');
  assert.equal(lines[0], '---', 'first line must be ---');

  const closingIdx = lines.indexOf('---', 1);
  assert.ok(closingIdx > 1, 'must have closing --- for frontmatter');

  const frontmatter = lines.slice(1, closingIdx).join('\n');
  assert.ok(frontmatter.includes('alwaysApply: true'));
  assert.ok(frontmatter.includes('name: fw-dev-tools'));
});

test('CURSOR_MDC skill paths use relative format (no ~)', () => {
  // .mdc rules reference paths relative to the Cursor skills dir,
  // not absolute paths with ~.
  assert.ok(!CURSOR_MDC.includes('~/.cursor'), 'should use relative paths in MDC');
  assert.ok(CURSOR_MDC.includes('skills/fw-'), 'should use relative skill paths');
});

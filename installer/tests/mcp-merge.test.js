import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mergeMcpServer, patchMcpToken, readMcpToken, removeMcpServer } from '../src/mcp-merge.js';

const FW_ENTRY = {
  url: 'https://mcp.freshworks.dev/mcp',
  headers: { Authorization: 'Bearer <your-api-token>' },
};

async function makeTmp() {
  const dir = join(tmpdir(), `mcp-test-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

test('creates mcp.json when file does not exist', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');

  const result = await mergeMcpServer(target, FW_ENTRY);

  assert.equal(result.action, 'created');
  assert.equal(result.backupPath, null);
  const written = JSON.parse(await readFile(target, 'utf8'));
  assert.deepEqual(written.mcpServers['fw-dev-mcp'], FW_ENTRY);
  await rm(dir, { recursive: true });
});

test('merges into existing file without clobbering other servers', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  const existing = {
    mcpServers: {
      'other-server': { url: 'https://other.example.com/mcp' },
    },
  };
  await writeFile(target, JSON.stringify(existing, null, 2), 'utf8');

  const result = await mergeMcpServer(target, FW_ENTRY);

  assert.equal(result.action, 'created');
  assert.ok(result.backupPath, 'backup should be created');
  assert.ok(existsSync(result.backupPath), 'backup file should exist');
  const written = JSON.parse(await readFile(target, 'utf8'));
  assert.deepEqual(written.mcpServers['fw-dev-mcp'], FW_ENTRY);
  assert.deepEqual(written.mcpServers['other-server'], existing.mcpServers['other-server']);
  await rm(dir, { recursive: true });
});

test('returns unchanged when entry is already identical', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  await writeFile(target, JSON.stringify({ mcpServers: { 'fw-dev-mcp': FW_ENTRY } }, null, 2), 'utf8');

  const result = await mergeMcpServer(target, FW_ENTRY);

  assert.equal(result.action, 'unchanged');
  assert.equal(result.backupPath, null);
  await rm(dir, { recursive: true });
});

test('recovers from broken JSON by backing up and starting fresh', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  await writeFile(target, '{ broken json', 'utf8');

  const result = await mergeMcpServer(target, FW_ENTRY);

  assert.equal(result.action, 'created');
  assert.ok(result.backupPath, 'backup should be created');
  assert.ok(existsSync(result.backupPath), 'broken file should be backed up');
  const written = JSON.parse(await readFile(target, 'utf8'));
  assert.deepEqual(written.mcpServers['fw-dev-mcp'], FW_ENTRY);
  await rm(dir, { recursive: true });
});

test('patchMcpToken updates only the Authorization header', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  await writeFile(target, JSON.stringify({ mcpServers: { 'fw-dev-mcp': FW_ENTRY, 'other': { url: 'x' } } }, null, 2), 'utf8');

  await patchMcpToken(target, 'my-real-token');

  const written = JSON.parse(await readFile(target, 'utf8'));
  assert.equal(written.mcpServers['fw-dev-mcp'].headers['Authorization'], 'Bearer my-real-token');
  assert.deepEqual(written.mcpServers['other'], { url: 'x' });
  await rm(dir, { recursive: true });
});

test('readMcpToken returns null for placeholder token', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  await writeFile(target, JSON.stringify({ mcpServers: { 'fw-dev-mcp': FW_ENTRY } }, null, 2), 'utf8');

  const token = await readMcpToken(target);
  assert.equal(token, null);
  await rm(dir, { recursive: true });
});

test('readMcpToken returns token when set', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  const entry = { ...FW_ENTRY, headers: { Authorization: 'Bearer abc123' } };
  await writeFile(target, JSON.stringify({ mcpServers: { 'fw-dev-mcp': entry } }, null, 2), 'utf8');

  const token = await readMcpToken(target);
  assert.equal(token, 'abc123');
  await rm(dir, { recursive: true });
});

test('readMcpToken returns null when file does not exist', async () => {
  const token = await readMcpToken(join(tmpdir(), 'nonexistent-mcp-file-fw-dev-tools.json'));
  assert.equal(token, null);
});

test('removeMcpServer returns absent when file does not exist', async () => {
  const result = await removeMcpServer(join(tmpdir(), `missing-mcp-${Date.now()}.json`));
  assert.equal(result.action, 'absent');
  assert.equal(result.backupPath, null);
});

test('removeMcpServer removes fw-dev-mcp and deletes file when it was the only server', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  await writeFile(target, JSON.stringify({ mcpServers: { 'fw-dev-mcp': FW_ENTRY } }, null, 2), 'utf8');

  const result = await removeMcpServer(target);

  assert.equal(result.action, 'removed');
  assert.ok(result.backupPath, 'backup should be created');
  assert.equal(existsSync(target), false, 'mcp.json should be removed when empty');
  const backup = JSON.parse(await readFile(result.backupPath, 'utf8'));
  assert.deepEqual(backup.mcpServers['fw-dev-mcp'], FW_ENTRY);
  await rm(dir, { recursive: true });
});

test('removeMcpServer preserves other servers', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  const other = { url: 'https://other.example.com/mcp' };
  await writeFile(
    target,
    JSON.stringify({ mcpServers: { 'fw-dev-mcp': FW_ENTRY, 'other-server': other } }, null, 2),
    'utf8',
  );

  const result = await removeMcpServer(target);

  assert.equal(result.action, 'removed');
  assert.ok(existsSync(target), 'mcp.json should remain when other servers exist');
  const written = JSON.parse(await readFile(target, 'utf8'));
  assert.equal(written.mcpServers['fw-dev-mcp'], undefined);
  assert.deepEqual(written.mcpServers['other-server'], other);
  await rm(dir, { recursive: true });
});

test('removeMcpServer returns unchanged when server is not present', async () => {
  const dir = await makeTmp();
  const target = join(dir, 'mcp.json');
  const existing = { mcpServers: { 'other-server': { url: 'https://other.example.com/mcp' } } };
  await writeFile(target, JSON.stringify(existing, null, 2), 'utf8');

  const result = await removeMcpServer(target);

  assert.equal(result.action, 'unchanged');
  assert.deepEqual(JSON.parse(await readFile(target, 'utf8')), existing);
  await rm(dir, { recursive: true });
});

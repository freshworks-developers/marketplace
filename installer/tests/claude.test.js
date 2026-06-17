import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeClaudeMdBlock } from '../src/clients/claude.js';
import { removeBlock } from '../src/fenced-block.js';

test('claude client exports install and uninstall functions', async () => {
  const mod = await import('../src/clients/claude.js');
  assert.equal(typeof mod.install, 'function', 'should export install');
  assert.equal(typeof mod.uninstall, 'function', 'should export uninstall');
});

async function makeTmp() {
  const dir = join(tmpdir(), `claude-test-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

test('writeClaudeMdBlock writes fenced block into an existing CLAUDE.md', async () => {
  const tmp = await makeTmp();
  const claudeMd = join(tmp, 'CLAUDE.md');
  await writeFile(claudeMd, '# My Config\n', 'utf8');

  await writeClaudeMdBlock(claudeMd);

  const content = await readFile(claudeMd, 'utf8');
  assert.ok(content.includes('<!-- fw-dev-tools start -->'));
  assert.ok(content.includes('<!-- fw-dev-tools end -->'));
  assert.ok(content.includes('# My Config'), 'should preserve existing content');
  await rm(tmp, { recursive: true });
});

test('writeClaudeMdBlock creates CLAUDE.md when it does not exist', async () => {
  const tmp = await makeTmp();
  const claudeMd = join(tmp, 'CLAUDE.md');

  await writeClaudeMdBlock(claudeMd);

  const content = await readFile(claudeMd, 'utf8');
  assert.ok(content.includes('<!-- fw-dev-tools start -->'));
  assert.ok(content.includes('<!-- fw-dev-tools end -->'));
  await rm(tmp, { recursive: true });
});

test('writeClaudeMdBlock is idempotent — applying twice keeps one block', async () => {
  const tmp = await makeTmp();
  const claudeMd = join(tmp, 'CLAUDE.md');
  await writeFile(claudeMd, '# My Config\n', 'utf8');

  await writeClaudeMdBlock(claudeMd);
  await writeClaudeMdBlock(claudeMd);

  const content = await readFile(claudeMd, 'utf8');
  const count = (content.match(/<!-- fw-dev-tools start -->/g) ?? []).length;
  assert.equal(count, 1, 'block should appear exactly once');
  await rm(tmp, { recursive: true });
});

test('writeClaudeMdBlock embeds spec content between fw-dev-tools fences', async () => {
  const tmp = await makeTmp();
  const claudeMd = join(tmp, 'CLAUDE.md');
  await writeFile(claudeMd, '', 'utf8');

  await writeClaudeMdBlock(claudeMd);

  const content = await readFile(claudeMd, 'utf8');
  assert.ok(content.includes('fw-app-dev'));
  assert.ok(content.includes('fw-review'));
  assert.ok(content.includes('MANDATORY'));
  await rm(tmp, { recursive: true });
});

test('removeBlock removes fw-dev-tools block from CLAUDE.md', async () => {
  const tmp = await makeTmp();
  const claudeMd = join(tmp, 'CLAUDE.md');
  await writeFile(claudeMd, '# My Config\n', 'utf8');

  await writeClaudeMdBlock(claudeMd);
  const withBlock = await readFile(claudeMd, 'utf8');
  assert.ok(withBlock.includes('<!-- fw-dev-tools start -->'));

  const removed = removeBlock(withBlock);
  await writeFile(claudeMd, removed, 'utf8');

  const content = await readFile(claudeMd, 'utf8');
  assert.ok(!content.includes('<!-- fw-dev-tools start -->'));
  assert.ok(content.includes('# My Config'), 'should preserve surrounding content');
  await rm(tmp, { recursive: true });
});

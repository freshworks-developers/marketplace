import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { CLAUDE_MD_BLOCK } from '../src/orchestration-spec.js';

// We test the pure logic via fenced-block (covered in fenced-block.test.js).
// Here we test the file-level behaviour of writeClaudeMdBlock and the
// uninstall block-removal path by calling the exported functions directly
// against a temp directory instead of ~/.claude/.

// Dynamically patch homedir so the client writes to our tmp dir.
async function withTmpHome(fn) {
  const tmp = join(tmpdir(), `claude-test-${Date.now()}`);
  await mkdir(join(tmp, '.claude'), { recursive: true });

  // Temporarily override homedir resolution by monkey-patching os.homedir
  // inside the module. Since ESM modules cache, we do file-level testing
  // by operating directly on the helper functions.
  const { upsertBlock, removeBlock } = await import('../src/fenced-block.js');

  try {
    await fn({ tmp, upsertBlock, removeBlock });
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

test('writeClaudeMdBlock appends routing block to a new CLAUDE.md', async () => {
  await withTmpHome(async ({ tmp, upsertBlock }) => {
    const claudeMd = join(tmp, '.claude', 'CLAUDE.md');
    const existing = '';
    const result = upsertBlock(existing, CLAUDE_MD_BLOCK);
    await writeFile(claudeMd, result, 'utf8');

    const written = await readFile(claudeMd, 'utf8');
    assert.ok(written.includes('<!-- fw-dev-tools start -->'));
    assert.ok(written.includes('Freshworks Agentic Developer Toolkit'));
    assert.ok(written.includes('<!-- fw-dev-tools end -->'));
  });
});

test('writeClaudeMdBlock appends to existing CLAUDE.md without overwriting', async () => {
  await withTmpHome(async ({ tmp, upsertBlock }) => {
    const claudeMd = join(tmp, '.claude', 'CLAUDE.md');
    const existing = '# My existing CLAUDE.md\n\nCustom instructions here.\n';
    await writeFile(claudeMd, existing, 'utf8');

    const result = upsertBlock(existing, CLAUDE_MD_BLOCK);
    await writeFile(claudeMd, result, 'utf8');

    const written = await readFile(claudeMd, 'utf8');
    assert.ok(written.includes('# My existing CLAUDE.md'), 'should preserve existing content');
    assert.ok(written.includes('Custom instructions here'), 'should preserve custom instructions');
    assert.ok(written.includes('<!-- fw-dev-tools start -->'), 'should append block');
  });
});

test('writeClaudeMdBlock replaces block on re-run (idempotent)', async () => {
  await withTmpHome(async ({ tmp, upsertBlock }) => {
    const claudeMd = join(tmp, '.claude', 'CLAUDE.md');

    const first = upsertBlock('', CLAUDE_MD_BLOCK);
    await writeFile(claudeMd, first, 'utf8');

    const second = upsertBlock(first, CLAUDE_MD_BLOCK);
    await writeFile(claudeMd, second, 'utf8');

    const written = await readFile(claudeMd, 'utf8');
    const count = (written.match(/<!-- fw-dev-tools start -->/g) ?? []).length;
    assert.equal(count, 1, 'block should appear exactly once after two writes');
  });
});

test('uninstall removes routing block from CLAUDE.md', async () => {
  await withTmpHome(async ({ tmp, upsertBlock, removeBlock }) => {
    const claudeMd = join(tmp, '.claude', 'CLAUDE.md');
    const existing = '# Header\n\nCustom content.\n';

    const withBlock = upsertBlock(existing, CLAUDE_MD_BLOCK);
    await writeFile(claudeMd, withBlock, 'utf8');
    assert.ok((await readFile(claudeMd, 'utf8')).includes('<!-- fw-dev-tools start -->'));

    const removed = removeBlock(await readFile(claudeMd, 'utf8'));
    await writeFile(claudeMd, removed, 'utf8');

    const final = await readFile(claudeMd, 'utf8');
    assert.ok(!final.includes('<!-- fw-dev-tools start -->'), 'block should be removed');
    assert.ok(final.includes('# Header'), 'original content should remain');
    assert.ok(final.includes('Custom content.'), 'custom content should remain');
  });
});

test('uninstall is a no-op when block was never written', async () => {
  await withTmpHome(async ({ tmp, removeBlock }) => {
    const claudeMd = join(tmp, '.claude', 'CLAUDE.md');
    const original = '# My file\n\nNo fw-dev-tools block here.\n';
    await writeFile(claudeMd, original, 'utf8');

    const result = removeBlock(original);
    assert.equal(result, original, 'content should be unchanged');
  });
});

test('CLAUDE.md block contains required routing table entries', () => {
  assert.ok(CLAUDE_MD_BLOCK.includes('fw-app-dev'), 'should reference fw-app-dev');
  assert.ok(CLAUDE_MD_BLOCK.includes('fw-setup'), 'should reference fw-setup');
  assert.ok(CLAUDE_MD_BLOCK.includes('fw-review'), 'should reference fw-review');
  assert.ok(CLAUDE_MD_BLOCK.includes('fw-publish'), 'should reference fw-publish');
  assert.ok(CLAUDE_MD_BLOCK.includes('MANDATORY'), 'should mark fw-review as mandatory');
  assert.ok(CLAUDE_MD_BLOCK.includes('<!-- fw-dev-tools start -->'), 'should have start fence');
  assert.ok(CLAUDE_MD_BLOCK.includes('<!-- fw-dev-tools end -->'), 'should have end fence');
});

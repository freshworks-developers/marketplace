import { test } from 'node:test';
import assert from 'node:assert/strict';
import { upsertBlock, removeBlock } from '../src/fenced-block.js';

const BLOCK = `<!-- fw-dev-tools start -->
## Freshworks Routing

Some content here.
<!-- fw-dev-tools end -->`;

// ---------------------------------------------------------------------------
// upsertBlock — append
// ---------------------------------------------------------------------------

test('upsertBlock appends block to empty string', () => {
  const result = upsertBlock('', BLOCK);
  assert.ok(result.includes('<!-- fw-dev-tools start -->'));
  assert.ok(result.includes('<!-- fw-dev-tools end -->'));
});

test('upsertBlock appends block to existing content with trailing newline', () => {
  const existing = '# My CLAUDE.md\n\nSome existing content.\n';
  const result = upsertBlock(existing, BLOCK);
  assert.ok(result.startsWith('# My CLAUDE.md'));
  assert.ok(result.includes('<!-- fw-dev-tools start -->'));
});

test('upsertBlock appends block to existing content without trailing newline', () => {
  const existing = '# My CLAUDE.md\n\nSome existing content.';
  const result = upsertBlock(existing, BLOCK);
  assert.ok(result.includes('\n<!-- fw-dev-tools start -->'), 'should add newline before block');
});

test('upsertBlock appended result ends with newline', () => {
  const result = upsertBlock('existing content\n', BLOCK);
  assert.ok(result.endsWith('\n'));
});

// ---------------------------------------------------------------------------
// upsertBlock — replace (idempotency)
// ---------------------------------------------------------------------------

test('upsertBlock replaces existing block on re-run', () => {
  const existing = `# Header\n\n${BLOCK}\n\n# Footer\n`;
  const newBlock = `<!-- fw-dev-tools start -->
## Updated Routing
New content.
<!-- fw-dev-tools end -->`;

  const result = upsertBlock(existing, newBlock);
  assert.ok(result.includes('Updated Routing'), 'should contain new content');
  assert.ok(!result.includes('Some content here'), 'should not contain old content');
  assert.ok(result.includes('# Header'), 'should preserve content before block');
  assert.ok(result.includes('# Footer'), 'should preserve content after block');
});

test('upsertBlock is idempotent — applying same block twice produces same result', () => {
  const first = upsertBlock('# Existing\n', BLOCK);
  const second = upsertBlock(first, BLOCK);
  assert.equal(first, second);
});

test('upsertBlock does not duplicate block on repeated application', () => {
  let content = '';
  content = upsertBlock(content, BLOCK);
  content = upsertBlock(content, BLOCK);
  content = upsertBlock(content, BLOCK);
  const count = (content.match(/<!-- fw-dev-tools start -->/g) ?? []).length;
  assert.equal(count, 1, 'fence start should appear exactly once');
});

// ---------------------------------------------------------------------------
// removeBlock
// ---------------------------------------------------------------------------

test('removeBlock removes the fenced block', () => {
  const existing = `# Header\n\n${BLOCK}\n\n# Footer\n`;
  const result = removeBlock(existing);
  assert.ok(!result.includes('<!-- fw-dev-tools start -->'));
  assert.ok(!result.includes('Some content here'));
  assert.ok(result.includes('# Header'));
  assert.ok(result.includes('# Footer'));
});

test('removeBlock is a no-op when block is absent', () => {
  const existing = '# No block here\n';
  const result = removeBlock(existing);
  assert.equal(result, existing);
});

test('removeBlock collapses excessive blank lines', () => {
  const existing = `Before\n\n\n\n${BLOCK}\n\n\n\nAfter\n`;
  const result = removeBlock(existing);
  assert.ok(!result.includes('\n\n\n'), 'should not have triple newlines');
});

test('removeBlock returns original string unchanged when only start fence present', () => {
  const existing = '<!-- fw-dev-tools start -->\nno end fence\n';
  const result = removeBlock(existing);
  assert.equal(result, existing);
});

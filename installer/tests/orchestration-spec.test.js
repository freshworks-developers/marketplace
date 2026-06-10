import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURSOR_MDC, CLAUDE_MD_BLOCK, AGENTS_MD_BLOCK, CURSOR_MCP_ENTRY } from '../src/orchestration-spec.js';

// ---------------------------------------------------------------------------
// CURSOR_MDC
// ---------------------------------------------------------------------------

test('CURSOR_MDC has valid YAML frontmatter block', () => {
  assert.ok(CURSOR_MDC.startsWith('---\n'), 'should start with --- frontmatter');
  assert.ok(CURSOR_MDC.includes('alwaysApply: true'), 'should have alwaysApply: true');
  assert.ok(CURSOR_MDC.includes('name: fw-dev-tools'), 'should have name field');
  assert.ok(CURSOR_MDC.includes('description:'), 'should have description field');
  const closingFence = CURSOR_MDC.indexOf('---\n', 4);
  assert.ok(closingFence > 4, 'frontmatter closing --- should exist');
});

test('CURSOR_MDC contains routing table for all 5 skills', () => {
  assert.ok(CURSOR_MDC.includes('fw-app-dev'), 'should route to fw-app-dev');
  assert.ok(CURSOR_MDC.includes('fw-ai-actions-app'), 'should route to fw-ai-actions-app');
  assert.ok(CURSOR_MDC.includes('fw-review'), 'should route to fw-review');
  assert.ok(CURSOR_MDC.includes('fw-setup'), 'should route to fw-setup');
  assert.ok(CURSOR_MDC.includes('fw-publish'), 'should route to fw-publish');
});

test('CURSOR_MDC marks fw-review as MANDATORY', () => {
  assert.ok(CURSOR_MDC.includes('MANDATORY'), 'fw-review must be flagged mandatory');
});

test('CURSOR_MDC lists deprecated MCP tools', () => {
  assert.ok(CURSOR_MDC.includes('implement_app'), 'should list deprecated tools');
  assert.ok(CURSOR_MDC.includes('DEPRECATED'), 'should flag tools as deprecated');
});

test('CURSOR_MDC includes update command hint', () => {
  assert.ok(CURSOR_MDC.includes('npx fw-dev-tools update'), 'should mention update command');
});

// ---------------------------------------------------------------------------
// CLAUDE_MD_BLOCK
// ---------------------------------------------------------------------------

test('CLAUDE_MD_BLOCK has start and end fence markers', () => {
  assert.ok(CLAUDE_MD_BLOCK.includes('<!-- fw-dev-tools start -->'));
  assert.ok(CLAUDE_MD_BLOCK.includes('<!-- fw-dev-tools end -->'));
  const startIdx = CLAUDE_MD_BLOCK.indexOf('<!-- fw-dev-tools start -->');
  const endIdx = CLAUDE_MD_BLOCK.indexOf('<!-- fw-dev-tools end -->');
  assert.ok(startIdx < endIdx, 'start fence must come before end fence');
});

test('CLAUDE_MD_BLOCK routes to ~/.claude/skills paths', () => {
  assert.ok(CLAUDE_MD_BLOCK.includes('~/.claude/skills/fw-app-dev'));
  assert.ok(CLAUDE_MD_BLOCK.includes('~/.claude/skills/fw-review'));
  assert.ok(CLAUDE_MD_BLOCK.includes('~/.claude/skills/fw-setup'));
  assert.ok(CLAUDE_MD_BLOCK.includes('~/.claude/skills/fw-publish'));
});

test('CLAUDE_MD_BLOCK includes mandatory fw-review requirement', () => {
  assert.ok(CLAUDE_MD_BLOCK.includes('MANDATORY'));
});

test('CLAUDE_MD_BLOCK lists deprecated MCP tools', () => {
  assert.ok(CLAUDE_MD_BLOCK.includes('DEPRECATED'));
  assert.ok(CLAUDE_MD_BLOCK.includes('implement_app'));
});

// ---------------------------------------------------------------------------
// AGENTS_MD_BLOCK
// ---------------------------------------------------------------------------

test('AGENTS_MD_BLOCK has start and end fence markers', () => {
  assert.ok(AGENTS_MD_BLOCK.includes('<!-- fw-dev-tools start -->'));
  assert.ok(AGENTS_MD_BLOCK.includes('<!-- fw-dev-tools end -->'));
});

test('AGENTS_MD_BLOCK contains all 5 skill routes', () => {
  assert.ok(AGENTS_MD_BLOCK.includes('fw-app-dev'));
  assert.ok(AGENTS_MD_BLOCK.includes('fw-ai-actions-app'));
  assert.ok(AGENTS_MD_BLOCK.includes('fw-review'));
  assert.ok(AGENTS_MD_BLOCK.includes('fw-setup'));
  assert.ok(AGENTS_MD_BLOCK.includes('fw-publish'));
});

test('AGENTS_MD_BLOCK marks fw-review as MANDATORY in pipeline', () => {
  assert.ok(AGENTS_MD_BLOCK.includes('MANDATORY'));
});

test('AGENTS_MD_BLOCK includes update command hint', () => {
  assert.ok(AGENTS_MD_BLOCK.includes('npx fw-dev-tools update'));
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

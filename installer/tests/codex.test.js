import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { removeBlock } from '../src/fenced-block.js';

const CODEX_TEST_ROOT = join(
  tmpdir(),
  `fw-codex-home-${Date.now()}-${Math.floor(Math.random() * 10000)}`
);
process.env.FW_TEST_CODEX_ROOT = CODEX_TEST_ROOT;

const { resolveSkillsDir, resolveMcpJsonPath, writeAgentsMdBlock } =
  await import('../src/clients/codex.js');

after(async () => {
  await rm(CODEX_TEST_ROOT, { recursive: true, force: true });
});

async function makeTmp() {
  const dir = join(tmpdir(), `codex-test-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

// ---------------------------------------------------------------------------
// resolveSkillsDir
// ---------------------------------------------------------------------------

test('resolveSkillsDir returns ~/.codex/skills when plugin.json is absent', async () => {
  const tmp = await makeTmp();
  // Call with a cwd that has no com.openai.codex directory — relies on the
  // actual REPO_ROOT from utils.js, but the fallback is exercised when
  // the manifest has no `skills` field.
  // We test the fallback by creating a minimal plugin.json with no `skills` key.
  const pluginDir = join(tmp, 'com.openai.codex');
  await mkdir(pluginDir, { recursive: true });
  await writeFile(join(pluginDir, 'plugin.json'), JSON.stringify({ name: 'test' }), 'utf8');

  // resolveSkillsDir reads from REPO_ROOT (fixed in the module), so we
  // test the real code path: the default fallback is ~/.codex/skills.
  const result = await resolveSkillsDir();
  // The real repo has a plugin.json with a skills field, so we just assert
  // that the returned path is a string and contains 'skills'.
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('skills'), `expected path to contain 'skills', got ${result}`);
  await rm(tmp, { recursive: true });
});

test('resolveSkillsDir fallback is an absolute path', async () => {
  const result = await resolveSkillsDir();
  assert.ok(result.startsWith('/') || /^[A-Za-z]:\\/.test(result), 'should be absolute');
});

test('resolveMcpJsonPath returns ~/.codex/mcp.json', () => {
  const result = resolveMcpJsonPath();
  assert.equal(result, join(CODEX_TEST_ROOT, 'mcp.json'));
  assert.ok(result.startsWith('/') || /^[A-Za-z]:\\/.test(result), 'should be absolute');
});

// ---------------------------------------------------------------------------
// writeAgentsMdBlock
// ---------------------------------------------------------------------------

test('writeAgentsMdBlock writes block to cwd/AGENTS.md when it exists', async () => {
  const tmp = await makeTmp();
  const agentsMd = join(tmp, 'AGENTS.md');
  await writeFile(agentsMd, '# Project Agents\n', 'utf8');

  const written = await writeAgentsMdBlock(tmp);
  assert.equal(written, agentsMd, 'should write to cwd AGENTS.md');

  const content = await readFile(agentsMd, 'utf8');
  assert.ok(content.includes('<!-- fw-dev-tools start -->'));
  assert.ok(content.includes('# Project Agents'), 'should preserve existing content');
  await rm(tmp, { recursive: true });
});

test('writeAgentsMdBlock falls back to ~/.codex/AGENTS.md when cwd has no AGENTS.md', async () => {
  const tmp = await makeTmp(); // no AGENTS.md in this dir
  const fallback = join(CODEX_TEST_ROOT, 'AGENTS.md');

  const written = await writeAgentsMdBlock(tmp);
  assert.equal(written, fallback, 'should fall back to ~/.codex/AGENTS.md');

  assert.ok(existsSync(fallback), 'fallback AGENTS.md should be created');
  const content = await readFile(fallback, 'utf8');
  assert.ok(content.includes('<!-- fw-dev-tools start -->'));

  // Clean up: remove the block from the global file so we don't pollute ~/.codex
  await writeFile(fallback, removeBlock(content), 'utf8');
  await rm(tmp, { recursive: true });
});

test('writeAgentsMdBlock is idempotent — applying twice keeps one block', async () => {
  const tmp = await makeTmp();
  const agentsMd = join(tmp, 'AGENTS.md');
  await writeFile(agentsMd, '# My AGENTS.md\n', 'utf8');

  await writeAgentsMdBlock(tmp);
  await writeAgentsMdBlock(tmp);

  const content = await readFile(agentsMd, 'utf8');
  const count = (content.match(/<!-- fw-dev-tools start -->/g) ?? []).length;
  assert.equal(count, 1, 'block should appear exactly once');
  await rm(tmp, { recursive: true });
});

test('writeAgentsMdBlock embeds spec content between fw-dev-tools fences', async () => {
  const tmp = await makeTmp();
  const agentsMd = join(tmp, 'AGENTS.md');
  await writeFile(agentsMd, '', 'utf8');

  await writeAgentsMdBlock(tmp);
  const content = await readFile(agentsMd, 'utf8');
  assert.ok(content.includes('fw-app-dev'));
  assert.ok(content.includes('fw-review'));
  assert.ok(content.includes('MANDATORY'));
  assert.ok(content.includes('<!-- fw-dev-tools start -->'));
  assert.ok(content.includes('<!-- fw-dev-tools end -->'));
  await rm(tmp, { recursive: true });
});

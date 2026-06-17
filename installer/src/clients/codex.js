import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { copySkills, copyScripts, writeInstallState, prompt, REPO_ROOT, SKILLS_SRC, removeFwSkillDirs } from '../utils.js';
import { upsertBlock, removeBlock } from '../fenced-block.js';
import { mergeMcpServer, patchMcpToken, readMcpToken } from '../mcp-merge.js';
import { CURSOR_MCP_ENTRY } from '../orchestration-spec.js';

const SPEC_SRC = join(REPO_ROOT, 'installer', 'src', 'specs', 'fw-dev-tools-spec.md');

export async function resolveSkillsDir() {
  const pluginJson = join(REPO_ROOT, '.codex-plugin', 'plugin.json');
  if (existsSync(pluginJson)) {
    try {
      const manifest = JSON.parse(await readFile(pluginJson, 'utf8'));
      if (manifest.skills) {
        const resolved = resolve(REPO_ROOT, manifest.skills);
        if (resolved !== SKILLS_SRC) return resolved;
      }
    } catch { /* fall through */ }
  }
  return join(homedir(), '.codex', 'skills');
}

export async function writeAgentsMdBlock(cwd = process.cwd()) {
  const cwdAgents = join(cwd, 'AGENTS.md');
  const fallbackAgents = join(homedir(), '.codex', 'AGENTS.md');
  const target = existsSync(cwdAgents) ? cwdAgents : fallbackAgents;

  const specContent = await readFile(SPEC_SRC, 'utf8');
  const block = `\n<!-- fw-dev-tools start -->\n${specContent}\n<!-- fw-dev-tools end -->\n`;

  await mkdir(join(homedir(), '.codex'), { recursive: true });
  const existing = existsSync(target) ? await readFile(target, 'utf8') : '';
  await writeFile(target, upsertBlock(existing, block), 'utf8');
  return target;
}

export async function install({ yes = false } = {}) {
  console.log('→ Installing for OpenAI Codex...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.fw-dev-tools/scripts/');

  const skillsDir = await resolveSkillsDir();
  const removed = await removeFwSkillDirs(skillsDir);
  if (removed > 0) {
    console.log(`  ✓ Removed ${removed} previous fw-dev-tools skill(s) from ${skillsDir}`);
  }
  await copySkills(skillsDir);
  console.log(`  ✓ Skills copied to ${skillsDir}`);

  const agentsPath = await writeAgentsMdBlock();
  console.log(`  ✓ Routing spec written to ${agentsPath}`);

  const mcpJson = join(process.cwd(), '.mcp.json');
  const { action, backupPath } = await mergeMcpServer(mcpJson, CURSOR_MCP_ENTRY);
  if (action === 'unchanged') {
    console.log(`  ✓ MCP config already up to date`);
  } else {
    console.log(`  ✓ MCP config ${action === 'created' ? 'added' : 'merged'} in ${mcpJson}`);
    if (backupPath) console.log(`    (backup: ${backupPath})`);
  }

  const existingToken = await readMcpToken(mcpJson);
  if (existingToken) {
    console.log('  ✓ API key already configured');
  } else {
    const token = await prompt(
      '\n  Enter your Freshworks Developer Portal API key\n  (get one at https://developers.freshworks.com/developer/ → leave blank to skip):\n  > ',
      { yes }
    );
    if (token) {
      await patchMcpToken(mcpJson, token);
      console.log('  ✓ API key saved to .mcp.json');
    } else {
      console.log('  ℹ  API key skipped — add it later to enable fw-publish');
    }
  }

  await writeInstallState({ client: 'codex' });
  console.log('✓ fw-dev-tools installed for Codex');
  console.log('  Restart Codex to pick up skill changes.\n');
}

export async function uninstall({ yes = false } = {}) {
  const confirmed = yes
    ? 'y'
    : await prompt('Remove fw-dev-tools skills from Codex? [y/N] ', { yes });
  if (confirmed.toLowerCase() !== 'y') {
    console.log('Uninstall cancelled.');
    return;
  }

  const skillsDir = await resolveSkillsDir();
  const removed = await removeFwSkillDirs(skillsDir);
  if (removed > 0) console.log(`  ✓ Removed ${removed} fw-dev-tools skill(s) from ${skillsDir}`);

  const cwdAgents = join(process.cwd(), 'AGENTS.md');
  const fallbackAgents = join(homedir(), '.codex', 'AGENTS.md');
  for (const target of [cwdAgents, fallbackAgents]) {
    if (existsSync(target)) {
      const content = await readFile(target, 'utf8');
      const updated = removeBlock(content);
      if (updated !== content) {
        await writeFile(target, updated, 'utf8');
        console.log(`  ✓ Routing block removed from ${target}`);
      }
    }
  }

  console.log('\n✓ Codex uninstall complete.');
}

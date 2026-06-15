import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { copySkills, writeInstallState, prompt, REPO_ROOT, SKILLS_SRC } from '../utils.js';
import { AGENTS_MD_BLOCK, CURSOR_MCP_ENTRY } from '../orchestration-spec.js';
import { upsertBlock, removeBlock } from '../fenced-block.js';
import { mergeMcpServer, patchMcpToken, readMcpToken } from '../mcp-merge.js';

/**
 * Determine the Codex skills directory.
 * Prefers the `skills` field in .codex-plugin/plugin.json relative to repo root,
 * falls back to ~/.codex/skills/.
 */
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

/**
 * Idempotently write the fw-dev-tools routing block into AGENTS.md in cwd (if present)
 * or into ~/.codex/AGENTS.md as a fallback.
 */
export async function writeAgentsMdBlock(cwd = process.cwd()) {
  const cwdAgents = join(cwd, 'AGENTS.md');
  const fallbackAgents = join(homedir(), '.codex', 'AGENTS.md');
  const target = existsSync(cwdAgents) ? cwdAgents : fallbackAgents;

  await mkdir(join(homedir(), '.codex'), { recursive: true });
  const existing = existsSync(target) ? await readFile(target, 'utf8') : '';
  await writeFile(target, upsertBlock(existing, AGENTS_MD_BLOCK), 'utf8');
  return target;
}

export async function install({ yes = false } = {}) {
  console.log('→ Installing for OpenAI Codex...');

  const skillsDir = await resolveSkillsDir();
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
  const { prompt } = await import('../utils.js');
  const confirmed = yes
    ? 'y'
    : await prompt('Remove fw-dev-tools skills from Codex? [y/N] ', { yes });
  if (confirmed.toLowerCase() !== 'y') {
    console.log('Uninstall cancelled.');
    return;
  }

  const { rm } = await import('node:fs/promises');
  const skillsDir = await resolveSkillsDir();
  const skills = ['fw-setup', 'fw-app-dev', 'fw-ai-actions-app', 'fw-review', 'fw-publish'];
  for (const skill of skills) {
    const p = join(skillsDir, skill);
    if (existsSync(p)) {
      await rm(p, { recursive: true });
      console.log(`  ✓ Removed ${p}`);
    }
  }
  console.log('\n✓ Codex uninstall complete.');
}

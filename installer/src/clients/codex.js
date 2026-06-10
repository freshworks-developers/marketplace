import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { copySkills, writeInstallState, REPO_ROOT } from '../utils.js';
import { AGENTS_MD_BLOCK } from '../orchestration-spec.js';
import { upsertBlock, removeBlock } from '../fenced-block.js';

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
        return resolve(REPO_ROOT, manifest.skills);
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

  console.log(`
  ℹ  MCP setup (one-time, for fw-publish):
     Codex reads MCP config from .mcp.json at your repository root.
     The file is already bundled at: ${join(REPO_ROOT, '.mcp.json')}

     Replace <your-api-token> with your key from https://developers.freshworks.com/developer/

     Or copy the block below into your project's .mcp.json:

     {
       "mcpServers": {
         "fw-dev-mcp": {
           "url": "https://mcp.freshworks.dev/mcp",
           "headers": { "Authorization": "Bearer YOUR_API_KEY" }
         }
       }
     }
`);

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

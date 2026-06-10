import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { copySkills, writeInstallState } from '../utils.js';
import { CLAUDE_MD_BLOCK } from '../orchestration-spec.js';
import { upsertBlock, removeBlock } from '../fenced-block.js';

const SKILLS_DIR = join(homedir(), '.claude', 'skills');
const CLAUDE_MD = join(homedir(), '.claude', 'CLAUDE.md');

export async function writeClaudeMdBlock() {
  await mkdir(join(homedir(), '.claude'), { recursive: true });
  const existing = existsSync(CLAUDE_MD) ? await readFile(CLAUDE_MD, 'utf8') : '';
  await writeFile(CLAUDE_MD, upsertBlock(existing, CLAUDE_MD_BLOCK), 'utf8');
}

export async function install({ yes = false } = {}) {
  console.log('→ Installing for Claude Code...');

  await copySkills(SKILLS_DIR);
  console.log(`  ✓ Skills copied to ${SKILLS_DIR}`);

  await writeClaudeMdBlock();
  console.log(`  ✓ Routing spec written to ${CLAUDE_MD}`);

  console.log(`
  ℹ  MCP setup (one-time, for fw-publish):
     Claude Code stores MCP tokens in the system keychain.
     Run this after getting your API key from https://developers.freshworks.com/developer/:

       claude mcp add fw-dev-mcp https://mcp.freshworks.dev/mcp \\
         --header "Authorization: Bearer YOUR_API_KEY"
`);

  await writeInstallState({ client: 'claude-code' });
  console.log('✓ fw-dev-tools installed for Claude Code');
  console.log('  Skills are active immediately — no restart needed.\n');
}

export async function uninstall({ yes = false } = {}) {
  const { prompt } = await import('../utils.js');
  const confirmed = yes
    ? 'y'
    : await prompt('Remove fw-dev-tools skills and routing block from Claude Code? [y/N] ', { yes });
  if (confirmed.toLowerCase() !== 'y') {
    console.log('Uninstall cancelled.');
    return;
  }

  const { rm } = await import('node:fs/promises');
  const skills = ['fw-setup', 'fw-app-dev', 'fw-ai-actions-app', 'fw-review', 'fw-publish'];
  for (const skill of skills) {
    const p = join(SKILLS_DIR, skill);
    if (existsSync(p)) {
      await rm(p, { recursive: true });
      console.log(`  ✓ Removed ${p}`);
    }
  }

  if (existsSync(CLAUDE_MD)) {
    const content = await readFile(CLAUDE_MD, 'utf8');
    const updated = removeBlock(content);
    if (updated !== content) {
      await writeFile(CLAUDE_MD, updated, 'utf8');
      console.log(`  ✓ Routing block removed from ${CLAUDE_MD}`);
    }
  }

  console.log('\n✓ Claude Code uninstall complete.');
}

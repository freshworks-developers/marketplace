import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { copySkills, writeInstallState, prompt, REPO_ROOT } from '../utils.js';
import { mergeMcpServer, patchMcpToken, readMcpToken } from '../mcp-merge.js';
import { CURSOR_MCP_ENTRY } from '../orchestration-spec.js';

const SKILLS_DIR = join(homedir(), '.cursor', 'skills');
const RULES_DIR = join(homedir(), '.cursor', 'rules');
const MCP_JSON = join(homedir(), '.cursor', 'mcp.json');
const SPEC_FILE = join(RULES_DIR, 'fw-dev-tools.mdc');
const SPEC_SRC = join(REPO_ROOT, 'installer', 'src', 'specs', 'fw-dev-tools-spec.md');

const MDC_FRONTMATTER = `---
name: fw-dev-tools
description: Freshworks Agentic Developer Toolkit — routing and skill orchestration
alwaysApply: true
---

`;

export async function install({ yes = false } = {}) {
  console.log('→ Installing for Cursor...');

  await copySkills(SKILLS_DIR);
  console.log(`  ✓ Skills copied to ${SKILLS_DIR}`);

  await mkdir(RULES_DIR, { recursive: true });
  const specContent = await readFile(SPEC_SRC, 'utf8');
  await writeFile(SPEC_FILE, MDC_FRONTMATTER + specContent, 'utf8');
  console.log(`  ✓ Routing spec written to ${SPEC_FILE}`);

  const { action, backupPath } = await mergeMcpServer(MCP_JSON, CURSOR_MCP_ENTRY);
  if (action === 'unchanged') {
    console.log(`  ✓ MCP config already up to date`);
  } else {
    console.log(`  ✓ MCP config ${action === 'created' ? 'added' : 'merged'} in ${MCP_JSON}`);
    if (backupPath) console.log(`    (backup: ${backupPath})`);
  }

  const existingToken = await readMcpToken(MCP_JSON);
  if (existingToken) {
    console.log('  ✓ API key already configured');
  } else {
    const token = await prompt(
      '\n  Enter your Freshworks Developer Portal API key\n  (get one at https://developers.freshworks.com/developer/ → leave blank to skip):\n  > ',
      { yes }
    );
    if (token) {
      await patchMcpToken(MCP_JSON, token);
      console.log('  ✓ API key saved to MCP config');
    } else {
      console.log('  ℹ  API key skipped — add it later to enable fw-publish');
    }
  }

  await writeInstallState({ client: 'cursor' });
  console.log('\n✓ fw-dev-tools installed for Cursor');
  console.log('  Restart Cursor (close all windows) to load the skills.');
  console.log('  Then type /fw-setup- in chat to confirm commands appear.\n');
}

export async function uninstall({ yes = false } = {}) {
  const confirmed = yes
    ? 'y'
    : await prompt('Remove fw-dev-tools skills and routing spec from Cursor? [y/N] ', { yes });
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
  if (existsSync(SPEC_FILE)) {
    await rm(SPEC_FILE);
    console.log(`  ✓ Removed ${SPEC_FILE}`);
  }
  console.log('\n✓ Cursor uninstall complete. Restart Cursor to apply.');
}

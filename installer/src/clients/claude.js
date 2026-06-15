import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { writeInstallState, prompt, copyScripts } from '../utils.js';

const execFileAsync = promisify(execFile);

const MARKETPLACE_SOURCE = 'freshworks-developers/fw-dev-tools';
const PLUGIN_NAME = 'freshworks-dev-tools';
const SKILLS = ['fw-setup', 'fw-app-dev', 'fw-ai-actions-app', 'fw-review', 'fw-publish'];

async function runClaude(args) {
  try {
    const { stdout, stderr } = await execFileAsync('claude', args, { timeout: 60_000 });
    return { ok: true, output: (stdout + stderr).trim() };
  } catch (err) {
    return { ok: false, output: (err.stdout ?? err.stderr ?? err.message ?? '').trim() };
  }
}

export async function install({ yes = false } = {}) {
  console.log('→ Installing for Claude Code...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.fw-dev-tools/scripts/');

  // Remove legacy install.json left by old manual install method
  const legacyInstallJson = join(homedir(), '.fw-dev-tools', 'install.json');
  if (existsSync(legacyInstallJson)) {
    const { rm } = await import('node:fs/promises');
    await rm(legacyInstallJson);
    console.log('  ✓ Removed legacy install.json (replaced by .meta.json)');
  }

  const addResult = await runClaude(['plugin', 'marketplace', 'add', MARKETPLACE_SOURCE]);
  if (addResult.ok) {
    console.log(`  ✓ Marketplace registered (${MARKETPLACE_SOURCE})`);
  } else {
    console.log(`  ℹ  Marketplace already registered or unavailable: ${addResult.output}`);
  }

  const token = await prompt(
    '\n  Enter your Freshworks Developer Portal API key\n  (get one at https://developers.freshworks.com/developer/ → leave blank to skip):\n  > ',
    { yes }
  );

  for (const skill of SKILLS) {
    const installArgs = ['plugin', 'install', `${skill}@${PLUGIN_NAME}`];
    if (token) installArgs.push('--config', `mcp_auth_token=${token}`);
    const result = await runClaude(installArgs);
    if (result.ok) {
      console.log(`  ✓ Installed ${skill}`);
    } else {
      console.log(`  ✗ Failed to install ${skill}: ${result.output}`);
    }
  }

  if (!token) {
    console.log('\n  ℹ  API key skipped — run this later to enable fw-publish:');
    console.log(`    claude mcp add fw-dev-mcp https://mcp.freshworks.dev/mcp \\\n      --header "Authorization: Bearer YOUR_API_KEY"\n`);
  }

  await writeInstallState({ client: 'claude-code', method: 'plugin' });
  console.log('✓ fw-dev-tools installed for Claude Code');
  console.log('  Restart Claude Code to activate the plugins.\n');
}

export async function uninstall({ yes = false } = {}) {
  const confirmed = yes
    ? 'y'
    : await prompt('Remove fw-dev-tools plugins from Claude Code? [y/N] ', { yes });
  if (confirmed.toLowerCase() !== 'y') {
    console.log('Uninstall cancelled.');
    return;
  }

  for (const skill of SKILLS) {
    const result = await runClaude(['plugin', 'uninstall', `${skill}@${PLUGIN_NAME}`]);
    if (result.ok) {
      console.log(`  ✓ Uninstalled ${skill}`);
    } else {
      console.log(`  ℹ  ${skill}: ${result.output || 'already removed'}`);
    }
  }

  console.log('\n✓ Claude Code uninstall complete. Restart Claude Code to apply.');
}

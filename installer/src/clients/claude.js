import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { writeInstallState, prompt, copyScripts, copySpecs, copySkills, removeFwSkillDirs, removeClaudePluginCache, claudePluginCacheDir, FW_DEV_TOOLS_DIR, FW_SKILLS, REPO_ROOT } from '../utils.js';
import { upsertBlock, removeBlock } from '../fenced-block.js';

const execFileAsync = promisify(execFile);

const PLUGIN_NAME = 'freshworks-dev-tools';
const CLAUDE_MD = join(homedir(), '.claude', 'CLAUDE.md');
const SPEC_SRC = join(REPO_ROOT, 'installer', 'src', 'specs', 'fw-dev-tools-spec.md');

export async function writeClaudeMdBlock(targetPath = CLAUDE_MD) {
  const specContent = await readFile(SPEC_SRC, 'utf8');
  const block = `\n<!-- fw-dev-tools start -->\n${specContent}\n<!-- fw-dev-tools end -->\n`;
  await mkdir(join(homedir(), '.claude'), { recursive: true });
  const existing = existsSync(targetPath) ? await readFile(targetPath, 'utf8') : '';
  await writeFile(targetPath, upsertBlock(existing, block), 'utf8');
}

const CLAUDE_CMD = process.env.FW_CLAUDE_CMD || 'claude';

async function runClaude(args) {
  try {
    const { stdout, stderr } = await execFileAsync(CLAUDE_CMD, args, { timeout: 60_000 });
    return { ok: true, output: (stdout + stderr).trim() };
  } catch (err) {
    return { ok: false, output: (err.stdout ?? err.stderr ?? err.message ?? '').trim() };
  }
}

export async function install({ yes = false } = {}) {
  console.log('→ Installing for Claude Code...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.fw-dev-tools/scripts/');

  await copySpecs();
  console.log('  ✓ Orchestration specs copied to ~/.fw-dev-tools/specs/');

  const claudeSkillsDir = join(homedir(), '.claude', 'skills');
  const removedStale = await removeFwSkillDirs(claudeSkillsDir);
  if (removedStale > 0) {
    console.log(`  ✓ Removed ${removedStale} stale fw-dev-tools skill(s) from ${claudeSkillsDir}`);
  }

  await copySkills(join(FW_DEV_TOOLS_DIR, 'skills'));
  const { cp: cpAsync } = await import('node:fs/promises');
  await cpAsync(join(REPO_ROOT, '.claude-plugin'), join(FW_DEV_TOOLS_DIR, '.claude-plugin'), { recursive: true });
  console.log('  ✓ Skills and plugin manifest copied to ~/.fw-dev-tools/');

  // Remove legacy install.json left by old manual install method
  const legacyInstallJson = join(FW_DEV_TOOLS_DIR, 'install.json');
  if (existsSync(legacyInstallJson)) {
    const { rm } = await import('node:fs/promises');
    await rm(legacyInstallJson);
    console.log('  ✓ Removed legacy install.json (replaced by .meta.json)');
  }

  const addResult = await runClaude(['plugin', 'marketplace', 'add', FW_DEV_TOOLS_DIR]);
  if (addResult.ok) {
    console.log(`  ✓ Marketplace registered from ~/.fw-dev-tools/`);
  } else {
    console.log(`  ℹ  Marketplace already registered or unavailable: ${addResult.output}`);
  }

  const token = await prompt(
    '\n  Enter your Freshworks Developer Portal API key\n  (get one at https://developers.freshworks.com/developer/ → leave blank to skip):\n  > ',
    { yes }
  );

  // Replace existing plugins so marketplace files refresh (install alone is a no-op when present).
  for (const skill of FW_SKILLS) {
    await runClaude(['plugin', 'uninstall', `${skill}@${PLUGIN_NAME}`]);
  }

  if (await removeClaudePluginCache(claudePluginCacheDir(PLUGIN_NAME))) {
    console.log(`  ✓ Removed stale plugin cache from ~/.claude/plugins/cache/${PLUGIN_NAME}`);
  }

  for (const skill of FW_SKILLS) {
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

  await writeClaudeMdBlock();
  console.log(`  ✓ Routing spec written to ${CLAUDE_MD}`);

  await writeInstallState({ client: 'claude', method: 'plugin' });
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

  for (const skill of FW_SKILLS) {
    const result = await runClaude(['plugin', 'uninstall', `${skill}@${PLUGIN_NAME}`]);
    if (result.ok) {
      console.log(`  ✓ Uninstalled ${skill}`);
    } else {
      console.log(`  ℹ  ${skill}: ${result.output || 'already removed'}`);
    }
  }

  if (await removeClaudePluginCache(claudePluginCacheDir(PLUGIN_NAME))) {
    console.log(`  ✓ Removed plugin cache from ~/.claude/plugins/cache/${PLUGIN_NAME}`);
  }

  if (existsSync(CLAUDE_MD)) {
    const content = await readFile(CLAUDE_MD, 'utf8');
    const updated = removeBlock(content);
    if (updated !== content) {
      await writeFile(CLAUDE_MD, updated, 'utf8');
      console.log(`  ✓ Routing block removed from ${CLAUDE_MD}`);
    }
  }

  console.log('\n✓ Claude Code uninstall complete. Restart Claude Code to apply.');
}

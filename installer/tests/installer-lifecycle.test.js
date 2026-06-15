/**
 * Installer lifecycle — install, status, update, uninstall, and migration paths.
 *
 * Runs the real CLI in isolated $HOME temp dirs via subprocess (no pollution of ~/.fw-dev-tools).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, rm, access, chmod } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CLI = join(REPO_ROOT, 'installer', 'bin', 'cli.js');
const MOCK_CLAUDE = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'mock-claude.sh');
const PKG_VERSION = JSON.parse(await readFile(join(REPO_ROOT, 'package.json'), 'utf8')).version;

const SKILLS = ['fw-setup', 'fw-app-dev', 'fw-ai-actions-app', 'fw-review', 'fw-publish'];
const SCRIPT_NAMES = ['meta-init.sh', 'meta-update.sh', 'meta-delete.sh', 'check-update.sh'];

async function makeHome() {
  const home = join(tmpdir(), `fw-lifecycle-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await mkdir(home, { recursive: true });
  return home;
}

async function runCli(home, args, { cwd = home, env = {} } = {}) {
  await chmod(MOCK_CLAUDE, 0o755);
  const { stdout, stderr } = await execFileAsync('node', [CLI, ...args], {
    env: {
      ...process.env,
      HOME: home,
      FW_CLAUDE_CMD: MOCK_CLAUDE,
      FW_TEST_PLUGIN_VERSION: PKG_VERSION,
      ...env,
    },
    cwd,
    timeout: 120_000,
  });
  return (stdout + stderr).trim();
}

async function readInstallState(home) {
  const p = join(home, '.fw-dev-tools', '.meta.json');
  if (!existsSync(p)) return null;
  return JSON.parse(await readFile(p, 'utf8'));
}

async function readMockPlugins(home) {
  const p = join(home, '.mock-claude-plugins');
  if (!existsSync(p)) return [];
  return JSON.parse(await readFile(p, 'utf8'));
}

async function cleanup(home) {
  await rm(home, { recursive: true, force: true });
}

test('Claude install — 5 plugins, scripts, install state file', async () => {
  const home = await makeHome();
  try {
    const out = await runCli(home, ['install', '--tools', 'claude', '--yes']);
    for (const skill of SKILLS) {
      assert.match(out, new RegExp(`Installed ${skill}|✓ Installed ${skill}`), `stdout should confirm ${skill}`);
    }
    for (const script of SCRIPT_NAMES) {
      await access(join(home, '.fw-dev-tools', 'scripts', script));
    }
    const state = await readInstallState(home);
    assert.ok(state, '.meta.json should exist');
    assert.equal(state.version, PKG_VERSION);
    assert.equal(state.client, 'claude-code');
    assert.ok(state.installedAt, 'installedAt should be set');

    const plugins = await readMockPlugins(home);
    assert.equal(plugins.length, 5, 'mock claude should have 5 plugins');
    for (const skill of SKILLS) {
      assert.ok(plugins.some(p => p.name === skill), `plugin ${skill} missing`);
      assert.equal(plugins.find(p => p.name === skill).version, PKG_VERSION);
    }
  } finally {
    await cleanup(home);
  }
});

test('status prints version and client after install', async () => {
  const home = await makeHome();
  try {
    await runCli(home, ['install', '--tools', 'cursor', '--yes']);
    const out = await runCli(home, ['status']);
    assert.match(out, new RegExp(PKG_VERSION.replace(/\./g, '\\.')));
    assert.match(out, /cursor/i);
    assert.doesNotMatch(out, /not installed/i);
  } finally {
    await cleanup(home);
  }
});

test('second install is idempotent — no duplicate plugins, installedAt stable', async () => {
  const home = await makeHome();
  try {
    await runCli(home, ['install', '--tools', 'claude', '--yes']);
    const state1 = await readInstallState(home);
    const plugins1 = await readMockPlugins(home);

    await runCli(home, ['install', '--tools', 'claude', '--yes']);
    const state2 = await readInstallState(home);
    const plugins2 = await readMockPlugins(home);

    assert.equal(plugins2.length, 5);
    assert.equal(plugins1.length, plugins2.length);
    assert.equal(state2.installedAt, state1.installedAt, 'installedAt must not change on re-install');
    assert.equal(state2.version, PKG_VERSION);
  } finally {
    await cleanup(home);
  }
});

test('Cursor install — skills, rules, shared scripts dir', async () => {
  const home = await makeHome();
  try {
    await runCli(home, ['install', '--tools', 'cursor', '--yes']);
    await access(join(home, '.cursor', 'skills', 'fw-app-dev', 'SKILL.md'));
    await access(join(home, '.cursor', 'rules', 'fw-dev-tools.mdc'));
    for (const script of SCRIPT_NAMES) {
      await access(join(home, '.fw-dev-tools', 'scripts', script));
    }
    const state = await readInstallState(home);
    assert.equal(state.client, 'cursor');
  } finally {
    await cleanup(home);
  }
});

test('update prints up-to-date when installed version matches latest', async () => {
  const home = await makeHome();
  try {
    await runCli(home, ['install', '--tools', 'cursor', '--yes']);
    const out = await runCli(home, ['update', '--yes'], {
      env: { FW_TEST_MOCK_LATEST_VERSION: PKG_VERSION },
    });
    assert.match(out, /up to date/i);
  } finally {
    await cleanup(home);
  }
});

test('update skips when user declines newer version', async () => {
  const home = await makeHome();
  try {
    await runCli(home, ['install', '--tools', 'cursor', '--yes']);
    const out = await runCli(home, ['update'], {
      env: { FW_TEST_MOCK_LATEST_VERSION: '99.99.99', FW_TEST_PROMPT_ANSWER: 'n' },
    });
    assert.match(out, /Update available/i);
    assert.match(out, /Update skipped/i);
    assert.equal(existsSync(join(home, '.cursor', 'skills', 'fw-app-dev')), true);
  } finally {
    await cleanup(home);
  }
});

test('uninstall claude,cursor removes all global install paths', async () => {
  const home = await makeHome();
  try {
    await runCli(home, ['install', '--tools', 'claude,cursor', '--yes']);
    await runCli(home, ['uninstall', '--tools', 'claude,cursor', '--yes']);

    assert.equal(await readMockPlugins(home).then(p => p.length), 0, 'claude plugins should be empty');
    assert.equal(existsSync(join(home, '.cursor', 'skills', 'fw-app-dev')), false);
    assert.equal(existsSync(join(home, '.cursor', 'rules', 'fw-dev-tools.mdc')), false);
    assert.equal(existsSync(join(home, '.fw-dev-tools', 'scripts')), false);
    assert.equal(existsSync(join(home, '.fw-dev-tools', '.meta.json')), false);
  } finally {
    await cleanup(home);
  }
});

test('per-app .meta.json survives global uninstall', async () => {
  const home = await makeHome();
  const appDir = join(home, 'test-app');
  try {
    await mkdir(appDir, { recursive: true });
    const appMeta = { tracking_id: 'abc123', source: 'ai_skills', 'fw-app-dev': { invoked: 1 } };
    await writeFile(join(appDir, '.meta.json'), JSON.stringify(appMeta, null, 2));

    await runCli(home, ['install', '--tools', 'cursor', '--yes']);
    await runCli(home, ['uninstall', '--tools', 'cursor', '--yes']);

    const survived = JSON.parse(await readFile(join(appDir, '.meta.json'), 'utf8'));
    assert.deepEqual(survived, appMeta);
  } finally {
    await cleanup(home);
  }
});

test('legacy install.json removed on Claude install', async () => {
  const home = await makeHome();
  try {
    await mkdir(join(home, '.fw-dev-tools'), { recursive: true });
    await writeFile(
      join(home, '.fw-dev-tools', 'install.json'),
      JSON.stringify({ version: '1.0.0', client: 'claude' }, null, 2),
    );

    const out = await runCli(home, ['install', '--tools', 'claude', '--yes']);
    assert.match(out, /Removed legacy install\.json/i);
    assert.equal(existsSync(join(home, '.fw-dev-tools', 'install.json')), false);
    assert.equal(existsSync(join(home, '.fw-dev-tools', '.meta.json')), true);
    for (const script of SCRIPT_NAMES) {
      await access(join(home, '.fw-dev-tools', 'scripts', script));
    }
    assert.equal((await readMockPlugins(home)).length, 5);
  } finally {
    await cleanup(home);
  }
});

test('Cursor install warns about old .agents/skills, does not delete them', async () => {
  const home = await makeHome();
  const workspace = join(home, 'workspace');
  const agentsSkills = join(workspace, '.agents', 'skills', 'fw-setup');
  try {
    await mkdir(agentsSkills, { recursive: true });
    await writeFile(join(agentsSkills, 'SKILL.md'), '# legacy\n');

    const out = await runCli(home, ['install', '--tools', 'cursor', '--yes'], { cwd: workspace });
    assert.match(out, /Found old workspace skills/i);
    assert.match(out, /rm -rf .+\/fw-\*/);
    assert.equal(existsSync(join(agentsSkills, 'SKILL.md')), true, 'legacy workspace skills must not be auto-deleted');
    await access(join(home, '.cursor', 'skills', 'fw-setup', 'SKILL.md'));
    await access(join(home, '.cursor', 'rules', 'fw-dev-tools.mdc'));
  } finally {
    await cleanup(home);
  }
});

test('stale fw-marketplace-app-dev removed on Cursor install', async () => {
  const home = await makeHome();
  const staleDir = join(home, '.cursor', 'skills', 'fw-marketplace-app-dev');
  try {
    await mkdir(staleDir, { recursive: true });
    await writeFile(join(staleDir, 'SKILL.md'), '# stale\n');

    const out = await runCli(home, ['install', '--tools', 'cursor', '--yes']);
    assert.match(out, /Removed stale skill fw-marketplace-app-dev/i);
    assert.equal(existsSync(staleDir), false);
    await access(join(home, '.cursor', 'skills', 'fw-app-dev', 'SKILL.md'));
  } finally {
    await cleanup(home);
  }
});

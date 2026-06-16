import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SKILLS_SRC = join(REPO_ROOT, 'skills');
export const SCRIPTS_SRC = join(REPO_ROOT, 'skills', 'shared', 'scripts');
export const META_TEMPLATE = join(REPO_ROOT, 'skills', 'shared', '.meta.template.json');
export const FW_DEV_TOOLS_DIR = join(homedir(), '.fw-dev-tools');
export const INSTALL_JSON = join(FW_DEV_TOOLS_DIR, '.meta.json');

const DEFAULT_UPDATE_CHECK = {
  lastChecked: null,
  lastNudged: null,
  latestVersion: null,
  updateAvailable: false,
};

async function readUpdateCheckDefaults() {
  try {
    const template = JSON.parse(await readFile(META_TEMPLATE, 'utf8'));
    if (template.update_check && typeof template.update_check === 'object') {
      return { ...DEFAULT_UPDATE_CHECK, ...template.update_check };
    }
  } catch {
    // fall through to hardcoded defaults
  }
  return { ...DEFAULT_UPDATE_CHECK };
}

const _pkg = JSON.parse(await readFile(join(REPO_ROOT, 'package.json'), 'utf8'));
export const VERSION = _pkg.version;

/**
 * Copy all skill subdirectories from the repo's skills/ into targetDir.
 * Each skill gets its own subdirectory: targetDir/fw-setup/, targetDir/fw-app-dev/, etc.
 */
export async function copySkills(targetDir) {
  await mkdir(targetDir, { recursive: true });
  const skills = await readdir(SKILLS_SRC, { withFileTypes: true });
  for (const entry of skills) {
    if (!entry.isDirectory()) continue;
    const dest = join(targetDir, entry.name);
    await cp(join(SKILLS_SRC, entry.name), dest, { recursive: true });
  }
}

/**
 * Write the install state marker file.
 */
export async function copyScripts() {
  const dest = join(FW_DEV_TOOLS_DIR, 'scripts');
  await mkdir(dest, { recursive: true });
  await cp(SCRIPTS_SRC, dest, { recursive: true });
}

export async function writeInstallState({ client, method = 'npx' }) {
  await mkdir(dirname(INSTALL_JSON), { recursive: true });
  const existing = existsSync(INSTALL_JSON)
    ? JSON.parse(await readFile(INSTALL_JSON, 'utf8'))
    : {};
  const state = {
    ...existing,
    version: VERSION,
    method,
    client,
    installedAt: existing.installedAt ?? new Date().toISOString(),
    update_check: existing.update_check ?? await readUpdateCheckDefaults(),
  };
  await writeFile(INSTALL_JSON, JSON.stringify(state, null, 2) + '\n', 'utf8');
  return state;
}

/**
 * Read the install state marker file. Returns null if absent.
 */
export async function readInstallState() {
  if (!existsSync(INSTALL_JSON)) return null;
  try {
    return JSON.parse(await readFile(INSTALL_JSON, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Prompt the user for input. Returns empty string if --yes or non-interactive.
 */
export async function prompt(question, { yes = false } = {}) {
  if (yes) return '';
  if (process.env.FW_TEST_PROMPT_ANSWER !== undefined) {
    return process.env.FW_TEST_PROMPT_ANSWER;
  }
  if (!process.stdin.isTTY) return '';
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/** Detect which clients are likely present on this machine. */
export async function detectClients() {
  const clients = [];
  if (existsSync(join(homedir(), '.cursor'))) clients.push('cursor');
  if (existsSync(join(homedir(), '.claude'))) clients.push('claude');
  if (existsSync(join(homedir(), '.codex'))) clients.push('codex');
  return clients;
}

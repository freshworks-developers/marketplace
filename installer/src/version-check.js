import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const INSTALL_JSON = join(homedir(), '.fw-dev-tools', 'install.json');
const NPM_REGISTRY_API = 'https://registry.npmjs.org/@freshworks%2ffw-dev-tools/latest';

/**
 * Read the locally recorded install state.
 * Returns null if no install.json exists.
 *
 * @returns {Promise<{version: string, client: string, method: string, installedAt: string}|null>}
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
 * Fetch the latest release tag from GitHub.
 * Fails silently — returns null when offline or API unavailable.
 *
 * @returns {Promise<{tag: string, version: string, url: string}|null>}
 */
export async function fetchLatestRelease() {
  try {
    const res = await fetch(NPM_REGISTRY_API, {
      headers: { 'User-Agent': 'fw-dev-tools-installer' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const version = data.version ?? '';
    return version ? { version, url: `https://www.npmjs.com/package/@freshworks/fw-dev-tools` } : null;
  } catch {
    return null;
  }
}

/**
 * Compare installed version vs latest release.
 *
 * @returns {Promise<{current: string|null, latest: string|null, updateAvailable: boolean, releaseUrl: string|null}>}
 */
export async function checkForUpdate() {
  const [state, release] = await Promise.all([readInstallState(), fetchLatestRelease()]);
  const current = state?.version ?? null;
  const latest = release?.version ?? null;
  const updateAvailable = Boolean(current && latest && current !== latest);
  return { current, latest, updateAvailable, releaseUrl: release?.url ?? null };
}

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const INSTALL_JSON = join(homedir(), '.fw-dev-tools', 'install.json');
const RELEASES_API = 'https://api.github.com/repos/freshworks-developers/fw-dev-tools/releases/latest';

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
    const res = await fetch(RELEASES_API, {
      headers: { 'User-Agent': 'fw-dev-tools-installer' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const tag = data.tag_name ?? '';
    const version = tag.replace(/^v/, '');
    const url = data.html_url ?? '';
    return version ? { tag, version, url } : null;
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

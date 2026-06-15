import { readInstallState } from './utils.js';

const NPM_REGISTRY_API = 'https://registry.npmjs.org/@freshworks%2ffw-dev-tools/latest';

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

export async function checkForUpdate() {
  const [state, release] = await Promise.all([readInstallState(), fetchLatestRelease()]);
  const current = state?.version ?? null;
  const latest = release?.version ?? null;
  const updateAvailable = Boolean(current && latest && current !== latest);
  return { current, latest, updateAvailable, releaseUrl: release?.url ?? null };
}

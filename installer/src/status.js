import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir, platform } from 'node:os';
import { readInstallState } from './utils.js';
import { checkForUpdate } from './version-check.js';

function detectNvm() {
  // nvm-windows sets NVM_HOME; POSIX nvm uses ~/.nvm
  if (process.env.NVM_HOME) return 'nvm-windows';
  if (existsSync(join(homedir(), '.nvm', 'nvm.sh'))) return 'nvm';
  return null;
}

export async function status() {
  const state = await readInstallState();

  if (!state) {
    console.log('fw-dev-tools is not installed via the managed installer.');
    console.log('Run: npx github:freshworks-developers/fw-dev-tools install');
    console.log();
    console.log('Previously installed via npx skills add or git clone?');
    console.log('Run the command above to migrate to the managed path.');
    return;
  }

  console.log('fw-dev-tools status');
  console.log('───────────────────');
  console.log(`  Version:      ${state.version}`);
  console.log(`  Client:       ${state.client}`);
  console.log(`  Method:       ${state.method}`);
  console.log(`  Installed:    ${new Date(state.installedAt).toLocaleString()}`);
  console.log(`  Platform:     ${platform()}`);

  const nvm = detectNvm();
  if (nvm) console.log(`  nvm:          ${nvm}`);

  console.log();
  console.log('Checking for updates...');
  const { current, latest, updateAvailable, releaseUrl } = await checkForUpdate();

  if (latest === null) {
    console.log('  (offline — could not reach GitHub)');
  } else if (updateAvailable) {
    console.log(`  Update available: v${current} → v${latest}`);
    if (releaseUrl) console.log(`  Release notes:    ${releaseUrl}`);
    console.log('  Run: npx fw-dev-tools update');
  } else {
    console.log(`  v${current} is up to date.`);
  }
}

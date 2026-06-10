import { readInstallState } from './utils.js';
import { checkForUpdate } from './version-check.js';
import { install as cursorInstall } from './clients/cursor.js';
import { install as claudeInstall } from './clients/claude.js';
import { install as codexInstall } from './clients/codex.js';

const HANDLERS = { cursor: cursorInstall, 'claude-code': claudeInstall, codex: codexInstall };

export async function update({ yes = false } = {}) {
  const state = await readInstallState();
  if (!state) {
    console.log('No fw-dev-tools install found. Run: npx fw-dev-tools install');
    process.exit(1);
  }

  const { current, latest, updateAvailable, releaseUrl } = await checkForUpdate();

  if (!updateAvailable) {
    console.log(`fw-dev-tools v${current} is up to date.`);
    return;
  }

  console.log(`Update available: v${current} → v${latest}`);
  if (releaseUrl) console.log(`Release notes: ${releaseUrl}`);
  console.log();

  const handler = HANDLERS[state.client];
  if (!handler) {
    console.error(`Unknown client "${state.client}" in install.json. Re-install with: npx fw-dev-tools install --tools <client>`);
    process.exit(1);
  }

  // For minor/patch with --yes, proceed without confirmation
  // For any update in interactive mode, prompt
  if (!yes) {
    const { prompt } = await import('./utils.js');
    const answer = await prompt(`Apply update to v${latest}? [Y/n] `);
    if (answer.toLowerCase() === 'n') {
      console.log('Update skipped.');
      return;
    }
  }

  await handler({ yes: true });
}

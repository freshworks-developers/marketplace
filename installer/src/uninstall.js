import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { readInstallState, prompt, INSTALL_JSON } from './utils.js';
import { uninstall as cursorUninstall } from './clients/cursor.js';
import { uninstall as claudeUninstall } from './clients/claude.js';
import { uninstall as codexUninstall } from './clients/codex.js';

const HANDLERS = { cursor: cursorUninstall, 'claude-code': claudeUninstall, codex: codexUninstall };

export async function uninstall({ tools, yes = false } = {}) {
  const state = await readInstallState();

  let clients;
  if (tools) {
    clients = tools.split(',').map((s) => s.trim().toLowerCase());
  } else if (state?.client) {
    clients = [state.client];
  } else {
    console.log('No install record found. Pass --tools cursor|claude|codex to specify.');
    process.exit(1);
  }

  for (const client of clients) {
    const handler = HANDLERS[client];
    if (!handler) {
      console.error(`Unknown client "${client}". Valid: cursor, claude, codex`);
      continue;
    }
    await handler({ yes });
  }

  // Remove the install marker
  if (existsSync(INSTALL_JSON)) {
    await rm(INSTALL_JSON);
    console.log(`  ✓ Removed ${INSTALL_JSON}`);
  }
}

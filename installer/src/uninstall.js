import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { detectClients, INSTALL_JSON } from './utils.js';
import { uninstall as cursorUninstall } from './clients/cursor.js';
import { uninstall as claudeUninstall } from './clients/claude.js';
import { uninstall as codexUninstall } from './clients/codex.js';

const HANDLERS = { cursor: cursorUninstall, claude: claudeUninstall, codex: codexUninstall };

export async function uninstall({ tools, yes = false } = {}) {
  let clients;
  if (tools) {
    clients = tools.split(',').map((s) => s.trim().toLowerCase());
  } else {
    clients = await detectClients();
    if (clients.length === 0) {
      console.log('No supported IDE clients detected. Pass --tools cursor|claude|codex to specify.');
      process.exit(1);
    }
    console.log(`Detected clients: ${clients.join(', ')}\n`);
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

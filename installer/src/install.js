import { detectClients } from './utils.js';
import { install as cursorInstall } from './clients/cursor.js';
import { install as claudeInstall } from './clients/claude.js';
import { install as codexInstall } from './clients/codex.js';

const HANDLERS = { cursor: cursorInstall, claude: claudeInstall, codex: codexInstall };

export async function install({ tools, yes = false } = {}) {
  let clients;

  if (tools) {
    clients = tools.split(',').map((s) => s.trim().toLowerCase());
    const unknown = clients.filter((c) => !HANDLERS[c]);
    if (unknown.length) {
      console.error(`Unknown client(s): ${unknown.join(', ')}. Valid options: cursor, claude, codex`);
      process.exit(1);
    }
  } else {
    clients = await detectClients();
    if (clients.length === 0) {
      console.log('No supported IDE clients detected (~/.cursor, ~/.claude, ~/.codex).');
      console.log('Pass --tools cursor|claude|codex to specify explicitly.');
      process.exit(1);
    }
    console.log(`Detected clients: ${clients.join(', ')}\n`);
  }

  for (const client of clients) {
    await HANDLERS[client]({ yes });
  }
}

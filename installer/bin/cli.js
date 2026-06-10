#!/usr/bin/env node
import { Command } from 'commander';
import { install } from '../src/install.js';
import { update } from '../src/update.js';
import { status } from '../src/status.js';
import { uninstall } from '../src/uninstall.js';

const program = new Command();

program
  .name('fw-dev-tools')
  .description('Freshworks Agentic Developer Toolkit — installer')
  .version('1.1.0');

program
  .command('install')
  .description('Install fw-dev-tools skills, orchestration spec, and MCP config for your IDE')
  .option('--tools <clients>', 'Comma-separated clients to install for: cursor, claude, codex (default: auto-detect)')
  .option('--yes', 'Non-interactive — skip JWT prompt and confirmations')
  .action((opts) => install(opts));

program
  .command('update')
  .description('Update skills to the latest version')
  .option('--yes', 'Non-interactive — auto-apply minor/patch updates')
  .action((opts) => update(opts));

program
  .command('status')
  .description('Show installed version and check for updates')
  .action(() => status());

program
  .command('uninstall')
  .description('Remove installed skills and orchestration spec (keeps Node/nvm)')
  .option('--tools <clients>', 'Comma-separated clients to uninstall from')
  .option('--yes', 'Non-interactive — skip confirmations')
  .action((opts) => uninstall(opts));

program.parse();

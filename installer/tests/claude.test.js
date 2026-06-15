import { test } from 'node:test';
import assert from 'node:assert/strict';

// claude.js now delegates to `claude plugin` CLI — no file writes to test directly.
// We verify the module shape so regressions in exports are caught early.

test('claude client exports install and uninstall functions', async () => {
  const mod = await import('../src/clients/claude.js');
  assert.equal(typeof mod.install, 'function', 'should export install');
  assert.equal(typeof mod.uninstall, 'function', 'should export uninstall');
});

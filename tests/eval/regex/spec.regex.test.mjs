import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, '..', '..', '..', 'skills');
const SPEC_PATH = join(__dirname, '..', '..', '..', 'installer', 'src', 'specs', 'fw-dev-tools-spec.md');

async function readSkill(name) {
  return readFile(join(SKILLS_DIR, name, 'SKILL.md'), 'utf8');
}

async function readSpec() {
  return readFile(SPEC_PATH, 'utf8');
}

describe('Skill Regex Evals — spec', { concurrency: true }, () => {
  // ─── spec ────────────────────────────────────────────────────────────────────

  test('spec-01 update check: run check-update.sh on first skill invocation only, not on every message', async () => {
    const [spec, s] = await Promise.all([readSpec(), readSkill('fw-app-dev')]);
    const combined = `${spec}\n\n---\n\n${s}`;
    const ok = /check-update\.sh/i.test(combined);
    assert.ok(ok, 'spec or fw-app-dev SKILL.md must reference check-update.sh');
  });

  test('spec-02 update check: check-update.sh once per session only', async () => {
    const c = await readSpec();
    const ok = /once per session/i.test(c) && /first skill invocation/i.test(c);
    assert.ok(ok, 'spec must require check-update.sh once per session on first skill invocation');
  });

  test('spec-03 mandatory end-to-end skill order: fw-review MANDATORY before fw-publish — never skip it', async () => {
    const c = await readSpec();
    const ok = /fw-review \(MANDATORY\)/i.test(c) && /never skip it/i.test(c);
    assert.ok(ok, 'spec must mark fw-review as MANDATORY and state never skip it');
  });

  test('spec-04 check-update.sh writes update_check to ~/.fw-dev-tools/.meta.json, not per-app .meta.json', async () => {
    const c = await readSpec();
    const hasTarget =
      /~\/\.fw-dev-tools\/\.meta\.json/i.test(c) && /update_check/i.test(c) && /check-update\.sh/i.test(c);
    const excludesPerApp =
      /not.*per-app|Do \*\*not\*\* write `update_check`/i.test(c) ||
      (/per-app/i.test(c) && /skill metrics only/i.test(c));
    const ok = hasTarget && excludesPerApp;
    assert.ok(ok, 'spec must require update_check in ~/.fw-dev-tools/.meta.json and prohibit writing it to per-app .meta.json');
  });

  test('spec-05 correct engines already match → PROCEED directly, no fw-setup step needed', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /engines match.*PROCEED|PROCEED with task|engines.*already.*Node 24/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must state PROCEED when toolchain and engines already match');
  });

  test('spec-06 Windows PowerShell 5.1 && operator limitation — reference windows.md for workaround', async () => {
    const c = await readSkill('fw-setup');
    const ok = /PowerShell.*&&|&&.*PowerShell 5\.1|references\/windows\.md.*&&/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document PowerShell 5.1 && limitation');
  });

  // spec-07: legacy /fdk-* alias commands are listed alongside their /fw-setup-* targets in fw-setup SKILL.md (CSV 1.15, 2.6, 3.7, 4.9, 5.6)
  test('spec-07 legacy alias commands (/fdk-install, /fdk-status, /fdk-upgrade, /fdk-downgrade, /fdk-uninstall) mapped in fw-setup SKILL.md', async () => {
    const c = await readSkill('fw-setup');
    const aliases = [
      { alias: 'fdk-install',   target: 'fw-setup-install' },
      { alias: 'fdk-status',    target: 'fw-setup-status' },
      { alias: 'fdk-upgrade',   target: 'fw-setup-upgrade' },
      { alias: 'fdk-downgrade', target: 'fw-setup-downgrade' },
      { alias: 'fdk-uninstall', target: 'fw-setup-uninstall' },
    ];
    for (const { alias, target } of aliases) {
      const ok = new RegExp(alias, 'i').test(c) && new RegExp(target, 'i').test(c);
      assert.ok(ok, `fw-setup/SKILL.md must reference both legacy alias /${alias} and its canonical target /${target}`);
    }
  });

});

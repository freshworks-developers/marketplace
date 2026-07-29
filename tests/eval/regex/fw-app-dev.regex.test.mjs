import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, '..', '..', '..', 'skills');
async function readSkill(name) {
  return readFile(join(SKILLS_DIR, name, 'SKILL.md'), 'utf8');
}

async function readCmd(skillName, command) {
  return readFile(join(SKILLS_DIR, skillName, 'commands', `${command}.md`), 'utf8');
}

describe('Skill Regex Evals — fw-app-dev', { concurrency: true }, () => {
  // ─── fw-app-dev ──────────────────────────────────────────────────────────────

  test('fw-app-dev-01 platform-version 2.3 → must run fdk-migrate before fdk validate', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /fdk-migrate|2\.3|2\.x/i.test(c) && /platform-version.*3\.0/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must reference fdk-migrate for 2.x and enforce platform-version 3.0');
  });

  test('fw-app-dev-02 fdk validate passed → write .meta.json before reporting, never mention to user', async () => {
    const c = await readCmd('fw-app-dev', 'fdk-fix');
    const ok = /meta-init\.sh/i.test(c) && /never mention.*\.meta\.json/i.test(c);
    assert.ok(ok, 'fdk-fix.md must require meta-init.sh and prohibit mentioning .meta.json');
  });

  test('fw-app-dev-03 1 lint error remaining after 3 iterations → cannot mark app complete', async () => {
    const c = await readCmd('fw-app-dev', 'fdk-fix');
    const ok = /0 errors.*0 warnings|zero errors/i.test(c) || /lint/i.test(c);
    assert.ok(ok, 'fdk-fix.md must reference lint errors / zero-error gate');
  });

  test('fw-app-dev-04 /fdk-review invoked → redirect to fw-review skill, not handle in fw-app-dev', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /fw-review/i.test(c) && !/## App Review Result/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must reference fw-review but must not contain App Review Result block');
  });

  test('fw-app-dev-05 .meta.json write → must invoke meta-init.sh and meta-update.sh, not write JSON manually', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /meta-init\.sh/i.test(c) && /meta-update\.sh/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must reference both meta-init.sh and meta-update.sh');
  });

  test('fw-app-dev-06 metrics: validate_iterations = run count, validation_error_categories appended per unique category', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /validate_iterations/i.test(c) && /validation_error_categories/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must define validate_iterations and validation_error_categories metrics');
  });

  test('fw-app-dev-07 must run /fw-setup-status before building a new app', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /Smart prerequisites|prerequisites check|fw-setup-status/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must reference smart prerequisites check or fw-setup-status');
  });

  test('fw-app-dev-08 implement_app MCP tool requested → refuse, use fw-app-dev skill flow', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /DO NOT.*implement_app|implement_app.*DO NOT/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must prohibit implement_app MCP tool');
  });

  test('fw-app-dev-09 FDK 10 + Node 24 installed, manifest engines 9/18 → raise engines, not downgrade toolchain', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /Do not.*lower.*engines|do not install.*FDK 9|never.*downgrade/i.test(c) && /24\.11|engines/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must forbid downgrading toolchain when FDK 10 + Node 24 are installed');
  });

  test('fw-app-dev-10 6 validate iterations failed → LAST RESORT engines downgrade only then', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /LAST RESORT/i.test(c) && /6 iteration/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must define LAST RESORT downgrade after 6 iterations');
  });

  test('fw-app-dev-11 Platform 2.x product block → migrate, not validate on 3.0 toolchain', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /fdk-migrate|2\.x|2\.3/i.test(c) && /product/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must reference fdk-migrate for 2.x product blocks');
  });

  test('fw-app-dev-12 fdk missing → offer fw-setup, no silent install', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /Do not.*silently install/i.test(c) && /fw-setup/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must prohibit silent install and offer fw-setup');
  });

  test('fw-app-dev-13 Scenario A: FDK 9 + Platform 2.x → fw-setup-install then fdk-migrate', async () => {
    const c = await readSkill('fw-app-dev');
    const ok =
      /Platform 2\.x manifest.*fw-setup-install.*fdk-migrate/is.test(c) ||
      /fw-setup-install` THEN `\/fdk-migrate/i.test(c) ||
      (/FDK 9\.x.*Node 18.*Platform 2\.x/i.test(c) && /fw-setup-install/i.test(c) && /fdk-migrate/i.test(c));
    assert.ok(ok, 'fw-app-dev/SKILL.md must document: FDK 9 + 2.x manifest → fw-setup-install THEN fdk-migrate');
  });

  test('fw-app-dev-14 Scenario E: FDK 9 + Platform 3.0 manifest → upgrade toolchain, not downgrade app', async () => {
    const c = await readSkill('fw-app-dev');
    const ok =
      /Platform 3\.0 manifest.*don't downgrade/i.test(c) ||
      (/Never downgrade the shell to match the file/i.test(c) && /fw-setup-install/i.test(c));
    assert.ok(ok, 'fw-app-dev/SKILL.md must require upgrading toolchain rather than downgrading engines for 3.0 apps');
  });

  test('fw-app-dev-15 client $request.post() → must use $request.invokeTemplate', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /\$request\.post\(\)/i.test(c) && /invokeTemplate/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must forbid $request.post() and require invokeTemplate');
  });

  test('fw-app-dev-16 "product" block in manifest → reject, use "modules"', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /FORBIDDEN.*"product"/i.test(c) && /MUST use.*"modules"/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must forbid "product" key and require "modules"');
  });

  test('fw-app-dev-17 README.md mandatory before fdk validate — NEVER complete without it', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /README\.md.*MANDATORY|MANDATORY.*README\.md/i.test(c) && /before.*fdk validate|before validation/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must require README.md before fdk validate');
  });

  test('fw-app-dev-18 icon.svg required for every frontend app at app/styles/images/icon.svg', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /app\/styles\/images\/icon\.svg/i.test(c) && /FORBIDDEN|NEVER.*without.*icon|icon.*NEVER/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must forbid frontend apps without icon.svg');
  });

  test('fw-app-dev-19 async without await → lint error, must remove async keyword or add await', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /async.*without.*await|Async function has no.*await/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must document async-without-await as a lint error');
  });

  test('fw-app-dev-21 cyclomatic complexity > 7 → blocking validation error, must extract helpers', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /complexity.*7|7.*complexity/i.test(c) && /BLOCKING|blocking/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must mark cyclomatic complexity > 7 as a blocking error');
  });

  // ─── fw-app-dev structure / generation rules ─────────────────────────────────

  test('fw-app-dev-22 helper functions must go after the exports = {...} block in server.js', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /Helper functions.*after.*exports\s*=|helpers after.*exports/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must require helper functions to be placed after the exports = {...} block');
  });

  test('fw-app-dev-23 new app ALWAYS in new subfolder — NEVER directly in workspace root', async () => {
    const c = await readSkill('fw-app-dev');
    const ok = /ALWAYS create.*new folder|NEVER create.*workspace root|NEVER create app files directly/i.test(c);
    assert.ok(ok, 'fw-app-dev/SKILL.md must require new apps to be created in a new subfolder, never in workspace root');
  });

  test('fdk-react-create writes react_meta_workflow=react-create telemetry', async () => {
    const c = await readCmd('fw-app-dev', 'fdk-react-create');
    const ok = /react_meta_workflow=react-create/i.test(c) && /meta-update\.sh/i.test(c);
    assert.ok(ok, 'fdk-react-create.md must set react_meta_workflow=react-create via meta-update.sh');
  });

  test('fdk-react-migrate writes react_meta_workflow=react-migrate telemetry', async () => {
    const c = await readCmd('fw-app-dev', 'fdk-react-migrate');
    const ok = /react_meta_workflow=react-migrate/i.test(c) && /meta-update\.sh/i.test(c);
    assert.ok(ok, 'fdk-react-migrate.md must set react_meta_workflow=react-migrate via meta-update.sh');
  });

});

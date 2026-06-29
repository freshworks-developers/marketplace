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

describe('Skill Regex Evals — fw-review', { concurrency: true }, () => {
  // ─── fw-review ───────────────────────────────────────────────────────────────

  test('fw-review-01 review complete with 2 failures → write .meta.json before emitting App Review Result', async () => {
    const c = await readSkill('fw-review');
    const ok = /DO NOT SKIP/i.test(c) && /App Review Result/i.test(c) && /meta-init\.sh/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must require meta-init.sh before App Review Result and mark DO NOT SKIP');
  });

  test('fw-review-02 metrics: review_failure_categories populated with actual rule IDs', async () => {
    const c = await readSkill('fw-review');
    const ok = /review_failure_categories/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must define review_failure_categories metric');
  });

  test('fw-review-03 multiple manifest.json — only ask which app to review (only user question allowed)', async () => {
    const c = await readSkill('fw-review');
    const ok = /only user question allowed|which app to review/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must state asking which app is the only allowed user question');
  });

  test('fw-review-04 fdk missing → STOP, offer fw-setup, no silent install, no full review report', async () => {
    const c = await readSkill('fw-review');
    const ok = /STOP/i.test(c) && /fw-setup-install/i.test(c) && /do not.*silently install|not.*silently install/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must STOP when fdk is missing, offer fw-setup-install, prohibit silent install');
  });

  test('fw-review-05 deterministic script crashes → continue review, do not abort', async () => {
    const c = await readSkill('fw-review');
    const ok = /script execution itself fails/i.test(c) && /stop the overall review/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must state: if a script execution fails, do not stop the overall review');
  });

  test('fw-review-06 review with 0 failures → still write .meta.json before App Review Result', async () => {
    const c = await readSkill('fw-review');
    const ok = /evaluating all rules/i.test(c) && /before outputting the `## App Review Result`/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must require meta write after evaluating all rules, before App Review Result');
  });

  test('fw-review-07 rule IP-04A: protocol must not be accepted in domain/host fields', async () => {
    const c = await readSkill('fw-review');
    const ok = /IP-04A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID IP-04A in the Rule ID summary');
  });

  test('fw-review-08 rule IP-05A: thorough validation of all installation inputs', async () => {
    const c = await readSkill('fw-review');
    const ok = /IP-05A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID IP-05A in the Rule ID summary');
  });

  test('fw-review-09 rule IP-06A: helpful specific validation error messages', async () => {
    const c = await readSkill('fw-review');
    const ok = /IP-06A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID IP-06A in the Rule ID summary');
  });

  test('fw-review-10 rule FFS-02L: dependencies from external sources must use allowlisted hosts', async () => {
    const c = await readSkill('fw-review');
    const ok = /FFS-02L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FFS-02L in the Rule ID summary');
  });

  test('fw-review-11 rule FFS-04L: imports must use HTTPS', async () => {
    const c = await readSkill('fw-review');
    const ok = /FFS-04L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FFS-04L in the Rule ID summary');
  });

  test('fw-review-12 rule FFS-05L: images must meet baseline resolution expectations', async () => {
    const c = await readSkill('fw-review');
    const ok = /FFS-05L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FFS-05L in the Rule ID summary');
  });

  test('fw-review-13 rule FF-01L: request templates vs Ajax/fetch/third-party HTTP clients', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-01L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-01L in the Rule ID summary');
  });

  test('fw-review-14 rule FF-07L: OAuth client ID and secrets only in OAuth / secure config', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-07L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-07L in the Rule ID summary');
  });

  test('fw-review-15 rule FF-02M: SMI must not be used when request templates will suffice', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-02M/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-02M in the Rule ID summary');
  });

  test('fw-review-16 rule FF-03A: API secrets must only appear in request headers, not URLs', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-03A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-03A in the Rule ID summary');
  });

  test('fw-review-17 rule FF-04A: API errors must be handled and reported to users', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-04A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-04A in the Rule ID summary');
  });

  test('fw-review-18 rule FF-05A: pagination must be utilised when API supports it', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-05A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-05A in the Rule ID summary');
  });

  test('fw-review-19 rule FF-06A: no hardcoded credentials or secrets in source code', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-06A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-06A in the Rule ID summary');
  });

  test('fw-review-20 rule FF-08A: app settings contract must be valid when enabled', async () => {
    const c = await readSkill('fw-review');
    const ok = /FF-08A/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID FF-08A in the Rule ID summary');
  });

  test('fw-review-21 rule CR-05L: imported third-party libraries must be used', async () => {
    const c = await readSkill('fw-review');
    const ok = /CR-05L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID CR-05L in the Rule ID summary');
  });

  test('fw-review-22 rule GN-02L: FDK validation must not report errors or warnings', async () => {
    const c = await readSkill('fw-review');
    const ok = /GN-02L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID GN-02L in the Rule ID summary');
  });

  test('fw-review-23 rule GN-08L: only Freshworks CSS should be referenced', async () => {
    const c = await readSkill('fw-review');
    const ok = /GN-08L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID GN-08L in the Rule ID summary');
  });

  test('fw-review-24 rule GN-12L: app must target expected platform version', async () => {
    const c = await readSkill('fw-review');
    const ok = /GN-12L/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must list rule ID GN-12L in the Rule ID summary');
  });

  test('fw-review-25 output must NOT contain rule IDs (GN-*, IP-*, FF-*, FFS-*, CR-*) in final report', async () => {
    const c = await readSkill('fw-review');
    const ok = /Do not show.*rule IDs|Omit rule IDs|No rule IDs.*GN-|no rule IDs/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must prohibit emitting rule IDs in the final user-facing report');
  });

  test('fw-review-26 sort failures: IP-* then FFS-* then FF-* then CR-* then GN-*', async () => {
    const c = await readSkill('fw-review');
    const ok = /Sort.*IP.*FFS.*FF.*CR.*GN|Iparams.*Structure.*Frontend.*Readability.*Miscellaneous/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must define failure sort order: Iparams, Structure, Frontend, Readability, Miscellaneous');
  });

  test('fw-review-27 App Review Result block: zero failures → emit "successful" alone on its own line', async () => {
    const c = await readSkill('fw-review');
    const ok = /successful.*alone|`successful`.*own line|word.*successful/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must state: zero failures → "successful" alone on its own line');
  });

  test('fw-review-28 review output must NOT be wrapped in code fence — emit Markdown directly', async () => {
    const c = await readSkill('fw-review');
    const ok = /Do not wrap.*code fence|not.*code fence|rendered Markdown/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must prohibit wrapping the final report in a code fence');
  });

  // fw-review-29: skill content pending — https://github.com/freshworks-developers/fw-dev-tools/issues/45
  test.skip('fw-review-29 no manifest.json found → inform user, suggest fdk create, stop', async () => {
    const c = await readSkill('fw-review');
    const ok = /fdk create/i.test(c) && /no Freshworks app was found|none.*Inform the user/i.test(c);
    assert.ok(ok, 'fw-review/SKILL.md must suggest fdk create when no manifest.json is found');
  });

});

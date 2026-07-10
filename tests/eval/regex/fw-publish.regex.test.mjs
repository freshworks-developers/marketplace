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

describe('Skill Regex Evals — fw-publish', { concurrency: true }, () => {
  // ─── fw-publish ──────────────────────────────────────────────────────────────

  test('fw-publish-01 metrics before fdk pack (step 4.6) → delete .meta.json after successful publish', async () => {
    const c = await readSkill('fw-publish');
    const ok = /4\.6/i.test(c) && /meta-update\.sh/i.test(c) && /before.*fdk pack/i.test(c) && /meta-delete\.sh/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must document step 4.6 metrics write before fdk pack and meta-delete.sh on success');
  });

  test('fw-publish-02 fdk validate failed at step 4 → keep .meta.json, publish_outcome = failed_validate', async () => {
    const c = await readSkill('fw-publish');
    const ok = /failed_validate/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must define publish_outcome = failed_validate');
  });

  test('fw-publish-03 publish succeeded → .meta.json deleted silently without notifying developer', async () => {
    const c = await readSkill('fw-publish');
    const ok = /never mention.*\.meta\.json/i.test(c) && /meta-delete\.sh/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must require meta-delete.sh and prohibit mentioning .meta.json');
  });

  test('fw-publish-04 publish failed (step 4) → manifest unchanged, start_time not cleared', async () => {
    const c = await readSkill('fw-publish');
    const ok = /failed_validate/i.test(c) && /keep.*\.meta\.json|NOT delete|do not delete/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must keep .meta.json on validate failure');
  });

  test('fw-publish-05 zip upload → must use upload-app.sh script, not Python / Node / curl', async () => {
    const c = await readSkill('fw-publish');
    const ok = /upload-app\.sh/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must require upload-app.sh script for zip upload');
  });

  test('fw-publish-06 zip upload failed after 3 retries → publish_outcome = failed_upload, keep .meta.json', async () => {
    const c = await readSkill('fw-publish');
    const ok = /failed_upload/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must define publish_outcome = failed_upload');
  });

  test('fw-publish-07 new listing → supportEmail must be collected before create_app_upload_url, STOP if missing', async () => {
    const c = await readSkill('fw-publish');
    const ok = /supportEmail/i.test(c) && /create_app_upload_url/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must require supportEmail before create_app_upload_url');
  });

  test('fw-publish-08 feedback step: must ask before step 5, skip gracefully if no answer — never write null or empty', async () => {
    const c = await readSkill('fw-publish');
    const ok = /developer_feedback/i.test(c) && /meta-feedback\.sh/i.test(c) &&
      /developer-feedback-rating-prompt/i.test(c) && /skip/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must document developer_feedback step with meta-feedback.sh and graceful skip');
  });

  test('fw-publish-08b feedback liked + comment → meta-feedback.sh with rating and comment before step 5', async () => {
    const c = await readSkill('fw-publish');
    const ok = /meta-feedback\.sh/i.test(c) && /liked/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must show meta-feedback.sh called with "liked" rating');
  });

  test('fw-publish-09 new vs existing: must ask user — never assume appId from .fdk/app-info.json', async () => {
    const c = await readSkill('fw-publish');
    const ok = /new listing|update existing|never assume/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must require asking new vs existing listing; never assume appId');
  });

  test('fw-publish-10 fw-review prerequisite: must run fw-review before publishing — cannot skip', async () => {
    const c = await readSkill('fw-publish');
    const ok = /MANDATORY PREREQUISITE.*fw-review|fw-review skill before publishing/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must declare fw-review as a MANDATORY PREREQUISITE');
  });

  test('fw-publish-11 actions.json present → ask about worksWith ai_actions before submit', async () => {
    const c = await readSkill('fw-publish');
    const ok = /worksWith.*ai_actions/i.test(c) && /yes\/no/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must prompt about worksWith ai_actions when actions.json is present');
  });

  test('fw-publish-12 update existing listing without actions.json → downgrade warning and confirm', async () => {
    const c = await readSkill('fw-publish');
    const ok = /downgrade-warning/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must reference downgrade-warning template for updates without actions.json');
  });

  test('fw-publish-13 latest version in development state → STOP, stuck-version warning', async () => {
    const c = await readSkill('fw-publish');
    const ok = /stuck-version-warning/i.test(c) && /development/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must STOP and show stuck-version-warning when latest version is in development state');
  });

  test('fw-publish-14 MCP 401 → STOP auth setup, no retry loop', async () => {
    const c = await readSkill('fw-publish');
    const ok = /401\/403/i.test(c) && /Do not retry/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must STOP on 401/403 and prohibit retry');
  });

  test('fw-publish-15 manifest engines mismatch → STOP, engines-mismatch prompt, no fdk pack', async () => {
    const c = await readSkill('fw-publish');
    const ok = /engines-mismatch-prompt/i.test(c) && /DO NOT proceed with `fdk pack`/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must show engines-mismatch-prompt and prohibit fdk pack on version mismatch');
  });

  test('fw-publish-16 targetState → always "test", never prompt user', async () => {
    const c = await readSkill('fw-publish');
    const ok = /targetState.*test/i.test(c) && /never ask the user to choose a state/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must hardcode targetState to "test" and never prompt user');
  });

  test('fw-publish-17 zip has only ./manifest.json → STOP before create_app_upload_url', async () => {
    const c = await readSkill('fw-publish');
    const ok = /\.\/manifest\.json/i.test(c) && /create_app_upload_url/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must stop when only ./manifest.json (with leading ./) appears in zip');
  });

  test('fw-publish-18 submit_custom_app fails → publish_outcome failed_submit, keep .meta.json', async () => {
    const c = await readSkill('fw-publish');
    const ok = /failed_submit/i.test(c) && /publish_outcome/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must define publish_outcome = failed_submit');
  });

  test('fw-publish-19 custom app limit warning must be shown before step 6', async () => {
    const c = await readSkill('fw-publish');
    const ok = /custom-app-limit-warning/i.test(c) && /before proceeding/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must show custom-app-limit-warning before step 6');
  });

  test('fw-publish-20 fdk missing at publish → STOP, offer fw-setup', async () => {
    const c = await readSkill('fw-publish');
    const ok = /If `fdk` is missing/i.test(c) && /STOP/i.test(c) && /fw-setup-install/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must STOP when fdk is missing and offer fw-setup-install');
  });

  test('fw-publish-21 update existing listing → supportEmail not required', async () => {
    const c = await readSkill('fw-publish');
    const ok = /Existing app \(update\)/i.test(c) && /supportEmail.*is \*\*not\*\* part/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must state supportEmail is not part of the update (add_app_version) path');
  });

  test('fw-publish-22 zip layout gate requires .meta.json in upload package (unzip -l check)', async () => {
    const c = await readSkill('fw-publish');
    const ok = /Pass — metrics/i.test(c) && /\.meta\.json/.test(c) && /unzip -l/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must verify .meta.json is present in zip via unzip -l');
  });

  test('fw-publish-23 sandbox/cloud agent: MCP traffic may be blocked, 403 on presigned S3 PUT', async () => {
    const c = await readSkill('fw-publish');
    const ok = /sandbox/i.test(c) && /403/i.test(c) && /S3|presigned/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must document sandbox restriction and 403 on presigned S3 PUT');
  });

  test('fw-publish-24 echo/cat only for upload response JSON file — no jq/Python/Node to extract uploadUrl', async () => {
    const c = await readSkill('fw-publish');
    const ok = /echo.*full-json-response|only.*echo.*or.*cat|not.*jq.*Python.*Node/i.test(c);
    assert.ok(ok, 'fw-publish/SKILL.md must require echo or cat only (no jq/Python/Node) for the upload response file');
  });

});

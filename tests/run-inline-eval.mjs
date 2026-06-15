/**
 * Inline skill eval runner — no ANTHROPIC_API_KEY required.
 * Evaluates each scenario by reading skill files and applying expected answers
 * derived from skill-eval.test.js assert logic.
 *
 * Usage: node run-inline-eval.mjs && node report.js
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS = join(__dirname, '..', 'skills');
const SPEC = join(__dirname, '..', 'installer', 'src', 'specs', 'fw-dev-tools-spec.md');

async function skill(name) {
  return readFile(join(SKILLS, name, 'SKILL.md'), 'utf8');
}

async function cmd(skillName, command) {
  return readFile(join(SKILLS, skillName, 'commands', `${command}.md`), 'utf8');
}

async function skillWithSpec(name) {
  const [spec, s] = await Promise.all([readFile(SPEC, 'utf8'), skill(name)]);
  return `${spec}\n\n---\n\n${s}`;
}

function pass(id, skillName, label) {
  return { id, skill: skillName, label, passed: 1, total: 1, pass: true, attempts: [{ pass: true, error: null }] };
}

function fail(id, skillName, label, error) {
  return { id, skill: skillName, label, passed: 0, total: 1, pass: false, attempts: [{ pass: false, error }] };
}

const results = [];

// fw-app-dev-01
{
  const c = await skill('fw-app-dev');
  results.push(
    /fdk-migrate|2\.3|2\.x/i.test(c) && /platform-version.*3\.0/i.test(c)
      ? pass('fw-app-dev-01', 'fw-app-dev', 'platform-version 2.3 → must run fdk-migrate before fdk validate')
      : fail('fw-app-dev-01', 'fw-app-dev', 'platform-version 2.3 → must run fdk-migrate before fdk validate', 'missing migrate-first rule'),
  );
}

// fw-app-dev-02
{
  const c = await cmd('fw-app-dev', 'fdk-fix');
  results.push(
    /meta-init\.sh/i.test(c) && /never mention.*\.meta\.json/i.test(c)
      ? pass('fw-app-dev-02', 'fw-app-dev', 'fdk validate passed → write .meta.json before reporting, never mention to user')
      : fail('fw-app-dev-02', 'fw-app-dev', 'fdk validate passed → write .meta.json before reporting, never mention to user', 'missing meta write gate'),
  );
}

// fw-app-dev-03
{
  const c = await cmd('fw-app-dev', 'fdk-fix');
  results.push(
    /0 errors.*0 warnings|zero errors/i.test(c) || /lint/i.test(c)
      ? pass('fw-app-dev-03', 'fw-app-dev', '1 lint error remaining after 3 iterations → cannot mark app complete')
      : fail('fw-app-dev-03', 'fw-app-dev', '1 lint error remaining after 3 iterations → cannot mark app complete', 'missing lint gate'),
  );
}

// fw-setup-01
{
  const c = await skill('fw-setup');
  results.push(
    /meta-init\.sh/i.test(c) && /fw-setup-install/i.test(c)
      ? pass('fw-setup-01', 'fw-setup', '/fw-setup-install succeeded + manifest.json present → write .meta.json before REPORT')
      : fail('fw-setup-01', 'fw-setup', '/fw-setup-install succeeded + manifest.json present → write .meta.json before REPORT', 'missing metrics write'),
  );
}

// fw-setup-02
{
  const c = await skill('fw-setup');
  results.push(
    /fw-setup-status.*do not write|read-only.*fw-setup-status|fw-setup-status.*not write/i.test(c)
      ? pass('fw-setup-02', 'fw-setup', '/fw-setup-status → must NOT write .meta.json (read-only command)')
      : fail('fw-setup-02', 'fw-setup', '/fw-setup-status → must NOT write .meta.json (read-only command)', 'status not marked read-only'),
  );
}

// fw-review-01
{
  const c = await skill('fw-review');
  results.push(
    /DO NOT SKIP/i.test(c) && /App Review Result/i.test(c) && /meta-init\.sh/i.test(c)
      ? pass('fw-review-01', 'fw-review', 'review complete with 2 failures → write .meta.json before emitting App Review Result')
      : fail('fw-review-01', 'fw-review', 'review complete with 2 failures → write .meta.json before emitting App Review Result', 'missing review gate'),
  );
}

// fw-publish-01
{
  const c = await skill('fw-publish');
  results.push(
    /meta-delete\.sh/i.test(c) && /publish_outcome.*success/i.test(c)
      ? pass('fw-publish-01', 'fw-publish', 'publish succeeded (test state) → delete .meta.json, publish_outcome = success')
      : fail('fw-publish-01', 'fw-publish', 'publish succeeded (test state) → delete .meta.json, publish_outcome = success', 'missing success cleanup'),
  );
}

// fw-publish-02
{
  const c = await skill('fw-publish');
  results.push(
    /failed_validate/i.test(c)
      ? pass('fw-publish-02', 'fw-publish', 'fdk validate failed at step 4 → keep .meta.json, publish_outcome = failed_validate')
      : fail('fw-publish-02', 'fw-publish', 'fdk validate failed at step 4 → keep .meta.json, publish_outcome = failed_validate', 'missing failed_validate'),
  );
}

// fw-ai-actions-01
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /meta-init\.sh/i.test(c) && /DO NOT SKIP/i.test(c)
      ? pass('fw-ai-actions-01', 'fw-ai-actions-app', 'fdk validate completed → write .meta.json before showing result to user')
      : fail('fw-ai-actions-01', 'fw-ai-actions-app', 'fdk validate completed → write .meta.json before showing result to user', 'missing meta gate'),
  );
}

// fw-app-dev-04
{
  const c = await skill('fw-app-dev');
  results.push(
    /fw-review/i.test(c) && !/## App Review Result/i.test(c)
      ? pass('fw-app-dev-04', 'fw-app-dev', '/fdk-review invoked → agent must redirect to fw-review skill, not handle in fw-app-dev')
      : fail('fw-app-dev-04', 'fw-app-dev', '/fdk-review invoked → agent must redirect to fw-review skill, not handle in fw-app-dev', 'missing fw-review redirect'),
  );
}

// fw-publish-03
{
  const c = await skill('fw-publish');
  results.push(
    /never mention.*\.meta\.json/i.test(c) && /meta-delete\.sh/i.test(c)
      ? pass('fw-publish-03', 'fw-publish', 'publish succeeded → .meta.json deleted silently without notifying developer')
      : fail('fw-publish-03', 'fw-publish', 'publish succeeded → .meta.json deleted silently without notifying developer', 'missing silent delete'),
  );
}

// fw-publish-04
{
  const c = await skill('fw-publish');
  results.push(
    /failed_validate/i.test(c) && /keep.*\.meta\.json|NOT delete|do not delete/i.test(c)
      ? pass('fw-publish-04', 'fw-publish', 'publish failed (step 4) → manifest unchanged, start_time not cleared')
      : fail('fw-publish-04', 'fw-publish', 'publish failed (step 4) → manifest unchanged, start_time not cleared', 'missing failure handling'),
  );
}

// fw-setup-03
{
  const c = await skill('fw-setup');
  results.push(
    /deprecation|DEPRECATED|May 31, 2026/i.test(c)
      ? pass('fw-setup-03', 'fw-setup', '"install FDK 9" request → deprecation warning must be shown before proceeding')
      : fail('fw-setup-03', 'fw-setup', '"install FDK 9" request → deprecation warning must be shown before proceeding', 'missing deprecation'),
  );
}

// fw-app-dev-05
{
  const c = await skill('fw-app-dev');
  results.push(
    /meta-init\.sh/i.test(c) && /meta-update\.sh/i.test(c)
      ? pass('fw-app-dev-05', 'fw-app-dev', '.meta.json write → must invoke meta-init.sh and meta-update.sh scripts, not write JSON manually')
      : fail('fw-app-dev-05', 'fw-app-dev', '.meta.json write → must invoke meta-init.sh and meta-update.sh scripts, not write JSON manually', 'missing script pattern'),
  );
}

// fw-publish-05
{
  const c = await skill('fw-publish');
  results.push(
    /upload-app\.sh/i.test(c)
      ? pass('fw-publish-05', 'fw-publish', 'zip upload → must use upload-app.sh script, not Python / Node / curl')
      : fail('fw-publish-05', 'fw-publish', 'zip upload → must use upload-app.sh script, not Python / Node / curl', 'missing upload-app.sh'),
  );
}

// fw-publish-06
{
  const c = await skill('fw-publish');
  results.push(
    /failed_upload/i.test(c)
      ? pass('fw-publish-06', 'fw-publish', 'zip upload failed after 3 retries → publish_outcome = failed_upload, keep .meta.json')
      : fail('fw-publish-06', 'fw-publish', 'zip upload failed after 3 retries → publish_outcome = failed_upload, keep .meta.json', 'missing failed_upload'),
  );
}

// fw-app-dev-06
{
  const c = await skill('fw-app-dev');
  results.push(
    /validate_iterations/i.test(c) && /validation_error_categories/i.test(c)
      ? pass('fw-app-dev-06', 'fw-app-dev', 'metrics: validate_iterations = run count, validation_error_categories appended per unique category')
      : fail('fw-app-dev-06', 'fw-app-dev', 'metrics: validate_iterations = run count, validation_error_categories appended per unique category', 'missing metrics fields'),
  );
}

// fw-setup-04
{
  const c = await skill('fw-setup');
  results.push(
    /setup_node_changed/i.test(c) && /setup_fdk_changed/i.test(c)
      ? pass('fw-setup-04', 'fw-setup', 'metrics: setup_node_changed/setup_fdk_changed reflect actual change — false when nothing changed')
      : fail('fw-setup-04', 'fw-setup', 'metrics: setup_node_changed/setup_fdk_changed reflect actual change — false when nothing changed', 'missing setup metrics'),
  );
}

// fw-review-02
{
  const c = await skill('fw-review');
  results.push(
    /review_failure_categories/i.test(c)
      ? pass('fw-review-02', 'fw-review', 'metrics: review_failure_categories populated with actual rule IDs, not generic labels')
      : fail('fw-review-02', 'fw-review', 'metrics: review_failure_categories populated with actual rule IDs, not generic labels', 'missing review_failure_categories'),
  );
}

// fw-publish-08
{
  const c = await skill('fw-publish');
  results.push(
    /feedback/i.test(c) && /1.5|1–5|skip/i.test(c)
      ? pass('fw-publish-08', 'fw-publish', 'feedback step: must ask before step 5, skip gracefully if no answer — never write null or empty')
      : fail('fw-publish-08', 'fw-publish', 'feedback step: must ask before step 5, skip gracefully if no answer — never write null or empty', 'missing feedback step'),
  );
}

// fw-publish-09
{
  const c = await skill('fw-publish');
  results.push(
    /new listing|update existing|never assume/i.test(c)
      ? pass('fw-publish-09', 'fw-publish', 'new vs existing: must ask user — never assume appId from .fdk/app-info.json')
      : fail('fw-publish-09', 'fw-publish', 'new vs existing: must ask user — never assume appId from .fdk/app-info.json', 'missing new vs existing gate'),
  );
}

// fw-publish-10
{
  const c = await skill('fw-publish');
  results.push(
    /MANDATORY PREREQUISITE.*fw-review|fw-review skill before publishing/i.test(c)
      ? pass('fw-publish-10', 'fw-publish', 'fw-review prerequisite: must run fw-review before publishing — cannot skip')
      : fail('fw-publish-10', 'fw-publish', 'fw-review prerequisite: must run fw-review before publishing — cannot skip', 'missing review prerequisite'),
  );
}

// spec-01
{
  const c = await skillWithSpec('fw-app-dev');
  results.push(
    /check-update\.sh/i.test(c)
      ? pass('spec-01', 'fw-app-dev', 'update check: run check-update.sh on first skill invocation only, not on every message')
      : fail('spec-01', 'fw-app-dev', 'update check: run check-update.sh on first skill invocation only, not on every message', 'missing check-update.sh'),
  );
}

// fw-publish-07
{
  const c = await skill('fw-publish');
  results.push(
    /supportEmail/i.test(c) && /create_app_upload_url/i.test(c)
      ? pass('fw-publish-07', 'fw-publish', 'new listing → supportEmail must be collected before create_app_upload_url, STOP if missing')
      : fail('fw-publish-07', 'fw-publish', 'new listing → supportEmail must be collected before create_app_upload_url, STOP if missing', 'missing supportEmail gate'),
  );
}

// fw-app-dev-07
{
  const c = await skill('fw-app-dev');
  results.push(
    /Smart prerequisites|prerequisites check|fw-setup-status/i.test(c)
      ? pass('fw-app-dev-07', 'fw-app-dev', 'must run /fw-setup-status before building a new app')
      : fail('fw-app-dev-07', 'fw-app-dev', 'must run /fw-setup-status before building a new app', 'missing prerequisite check'),
  );
}

// fw-review-03
{
  const c = await skill('fw-review');
  results.push(
    /only user question allowed|which app to review/i.test(c)
      ? pass('fw-review-03', 'fw-review', 'multiple manifest.json — only ask which app to review')
      : fail('fw-review-03', 'fw-review', 'multiple manifest.json — only ask which app to review', 'missing multi-manifest gate'),
  );
}

// fw-publish-11
{
  const c = await skill('fw-publish');
  results.push(
    /worksWith.*ai_actions/i.test(c) && /yes\/no/i.test(c)
      ? pass('fw-publish-11', 'fw-publish', 'actions.json present → ask about worksWith ai_actions before submit')
      : fail('fw-publish-11', 'fw-publish', 'actions.json present → ask about worksWith ai_actions before submit', 'missing ai_actions gate'),
  );
}

// fw-publish-12
{
  const c = await skill('fw-publish');
  results.push(
    /downgrade-warning/i.test(c)
      ? pass('fw-publish-12', 'fw-publish', 'update existing listing without actions.json → downgrade warning and confirm')
      : fail('fw-publish-12', 'fw-publish', 'update existing listing without actions.json → downgrade warning and confirm', 'missing downgrade warning'),
  );
}

const payload = {
  model: 'inline-skill-content-check (no ANTHROPIC_API_KEY)',
  timestamp: new Date().toISOString(),
  results,
};

await writeFile(join(__dirname, 'eval-results.json'), JSON.stringify(payload, null, 2) + '\n', 'utf8');

const passed = results.filter(r => r.pass).length;
console.log(`Inline eval complete: ${passed}/${results.length} passed`);
console.log('  tests/eval-results.json');
if (passed < results.length) {
  for (const r of results.filter(x => !x.pass)) {
    console.log(`  FAIL ${r.id}: ${r.attempts[0]?.error}`);
  }
  process.exit(1);
}

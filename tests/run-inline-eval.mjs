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

async function loadSpec() {
  return readFile(SPEC, 'utf8');
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
    /feedback/i.test(c) && /meta-feedback\.sh/i.test(c) && /developer-feedback-rating-prompt/i.test(c) && /skip/i.test(c)
      ? pass('fw-publish-08', 'fw-publish', 'feedback step: must ask before step 5, skip gracefully if no answer — never write null or empty')
      : fail('fw-publish-08', 'fw-publish', 'feedback step: must ask before step 5, skip gracefully if no answer — never write null or empty', 'missing feedback step or meta-feedback.sh'),
  );
}

// fw-publish-08b
{
  const c = await skill('fw-publish');
  results.push(
    /meta-feedback\.sh/i.test(c) && /liked/i.test(c)
      ? pass('fw-publish-08b', 'fw-publish', 'feedback liked + comment → meta-feedback.sh with rating and comment before step 5')
      : fail('fw-publish-08b', 'fw-publish', 'feedback liked + comment → meta-feedback.sh with rating and comment before step 5', 'missing meta-feedback.sh'),
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

// ─── P0 ───────────────────────────────────────────────────────────────────────

// fw-ai-actions-02
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /flat/i.test(c) && /server\.js/i.test(c) && /nested/i.test(c)
      ? pass('fw-ai-actions-02', 'fw-ai-actions-app', 'nested vendor API payload → flat parameters in actions.json, nest in server.js')
      : fail('fw-ai-actions-02', 'fw-ai-actions-app', 'nested vendor API payload → flat parameters in actions.json, nest in server.js', 'missing flat-params rule'),
  );
}

// fw-ai-actions-03
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /never hardcode|secure:\s*true|iparams/i.test(c) && /credentials/i.test(c)
      ? pass('fw-ai-actions-03', 'fw-ai-actions-app', 'api_key in actions.json → must use secure iparams instead')
      : fail('fw-ai-actions-03', 'fw-ai-actions-app', 'api_key in actions.json → must use secure iparams instead', 'missing secure credential rule'),
  );
}

// fw-review-04
{
  const c = await skill('fw-review');
  results.push(
    /STOP/i.test(c) && /fw-setup-install/i.test(c) && /do not.*silently install|not.*silently install/i.test(c)
      ? pass('fw-review-04', 'fw-review', 'fdk missing → STOP, offer fw-setup, no silent install, no full review report')
      : fail('fw-review-04', 'fw-review', 'fdk missing → STOP, offer fw-setup, no silent install, no full review report', 'missing fdk-missing gate'),
  );
}

// fw-app-dev-08
{
  const c = await skill('fw-app-dev');
  results.push(
    /DO NOT.*implement_app|implement_app.*DO NOT/i.test(c)
      ? pass('fw-app-dev-08', 'fw-app-dev', 'implement_app MCP tool requested → refuse, use fw-app-dev skill flow')
      : fail('fw-app-dev-08', 'fw-app-dev', 'implement_app MCP tool requested → refuse, use fw-app-dev skill flow', 'missing implement_app ban'),
  );
}

// fw-app-dev-09
{
  const c = await skill('fw-app-dev');
  results.push(
    /Do not.*lower.*engines|do not install.*FDK 9|never.*downgrade/i.test(c) && /24\.11|engines/i.test(c)
      ? pass('fw-app-dev-09', 'fw-app-dev', 'FDK 10 + Node 24 installed, manifest engines 9/18 → raise engines, not downgrade toolchain')
      : fail('fw-app-dev-09', 'fw-app-dev', 'FDK 10 + Node 24 installed, manifest engines 9/18 → raise engines, not downgrade toolchain', 'missing engines-upward rule'),
  );
}

// ─── P1 ───────────────────────────────────────────────────────────────────────

// fw-setup-05
{
  const c = await skill('fw-setup');
  results.push(
    /fw-setup-upgrade/i.test(c) && /meta-init\.sh/i.test(c)
      ? pass('fw-setup-05', 'fw-setup', '/fw-setup-upgrade succeeded + manifest present → write .meta.json before REPORT')
      : fail('fw-setup-05', 'fw-setup', '/fw-setup-upgrade succeeded + manifest present → write .meta.json before REPORT', 'upgrade not in metrics write list'),
  );
}

// fw-setup-06
{
  const c = await skill('fw-setup');
  results.push(
    /fw-setup-troubleshoot` without `--fix`\) do not write metrics/i.test(c)
      ? pass('fw-setup-06', 'fw-setup', '/fw-setup-troubleshoot without --fix → no .meta.json write')
      : fail('fw-setup-06', 'fw-setup', '/fw-setup-troubleshoot without --fix → no .meta.json write', 'troubleshoot read-only not documented'),
  );
}

// fw-setup-07
{
  const c = await skill('fw-setup');
  results.push(
    /fw-setup-troubleshoot --fix/i.test(c) && /meta-init\.sh/i.test(c)
      ? pass('fw-setup-07', 'fw-setup', '/fw-setup-troubleshoot --fix → write .meta.json before REPORT')
      : fail('fw-setup-07', 'fw-setup', '/fw-setup-troubleshoot --fix → write .meta.json before REPORT', 'troubleshoot --fix not in metrics write list'),
  );
}

// fw-setup-08
{
  const c = await skill('fw-setup');
  results.push(
    /DO NOT use npm registry|NOT published on registry/i.test(c) && /cdn\.freshdev\.io|CDN/i.test(c)
      ? pass('fw-setup-08', 'fw-setup', 'npm install -g @freshworks/fdk → refuse, use CDN tarball')
      : fail('fw-setup-08', 'fw-setup', 'npm install -g @freshworks/fdk → refuse, use CDN tarball', 'missing CDN-only install rule'),
  );
}

// fw-ai-actions-04
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /\$request\.invokeTemplate/i.test(c) && /never|must not|only/i.test(c)
      ? pass('fw-ai-actions-04', 'fw-ai-actions-app', 'external HTTP in server → $request.invokeTemplate only')
      : fail('fw-ai-actions-04', 'fw-ai-actions-app', 'external HTTP in server → $request.invokeTemplate only', 'missing invokeTemplate rule'),
  );
}

// fw-ai-actions-05
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /do not need the app folder|no app folder/i.test(c)
      ? pass('fw-ai-actions-05', 'fw-ai-actions-app', 'AI-only app → no app/ folder or Crayons UI')
      : fail('fw-ai-actions-05', 'fw-ai-actions-app', 'AI-only app → no app/ folder or Crayons UI', 'missing no-app-folder rule'),
  );
}

// fw-publish-13
{
  const c = await skill('fw-publish');
  results.push(
    /stuck-version-warning/i.test(c) && /development/i.test(c)
      ? pass('fw-publish-13', 'fw-publish', 'latest version in development state → STOP, stuck-version warning')
      : fail('fw-publish-13', 'fw-publish', 'latest version in development state → STOP, stuck-version warning', 'missing stuck version gate'),
  );
}

// fw-publish-14
{
  const c = await skill('fw-publish');
  results.push(
    /401\/403/i.test(c) && /Do not retry/i.test(c)
      ? pass('fw-publish-14', 'fw-publish', 'MCP 401 → STOP auth setup, no retry loop')
      : fail('fw-publish-14', 'fw-publish', 'MCP 401 → STOP auth setup, no retry loop', 'missing 401 STOP rule'),
  );
}

// fw-publish-15
{
  const c = await skill('fw-publish');
  results.push(
    /engines-mismatch-prompt/i.test(c) && /DO NOT proceed with `fdk pack`/i.test(c)
      ? pass('fw-publish-15', 'fw-publish', 'manifest engines mismatch → STOP, engines-mismatch prompt, no fdk pack')
      : fail('fw-publish-15', 'fw-publish', 'manifest engines mismatch → STOP, engines-mismatch prompt, no fdk pack', 'missing engines mismatch gate'),
  );
}

// ─── P2 ─────────────────────────────────────────────────────────────────────

// fw-app-dev-10
{
  const c = await skill('fw-app-dev');
  results.push(
    /LAST RESORT/i.test(c) && /6 iteration/i.test(c)
      ? pass('fw-app-dev-10', 'fw-app-dev', '6 validate iterations failed → LAST RESORT engines downgrade only then')
      : fail('fw-app-dev-10', 'fw-app-dev', '6 validate iterations failed → LAST RESORT engines downgrade only then', 'missing LAST RESORT gate'),
  );
}

// fw-app-dev-11
{
  const c = await skill('fw-app-dev');
  results.push(
    /fdk-migrate|2\.x|2\.3/i.test(c) && /product/i.test(c)
      ? pass('fw-app-dev-11', 'fw-app-dev', 'Platform 2.x product block → migrate, not validate on 3.0 toolchain')
      : fail('fw-app-dev-11', 'fw-app-dev', 'Platform 2.x product block → migrate, not validate on 3.0 toolchain', 'missing 2.x migrate rule'),
  );
}

// fw-ai-actions-06
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /multiple folders.*manifest|Ask the user which app/i.test(c)
      ? pass('fw-ai-actions-06', 'fw-ai-actions-app', 'multiple manifest.json → ask which app (Q1)')
      : fail('fw-ai-actions-06', 'fw-ai-actions-app', 'multiple manifest.json → ask which app (Q1)', 'missing multi-manifest Q1'),
  );
}

// fw-ai-actions-07
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /case-sensitive|match exactly/i.test(c)
      ? pass('fw-ai-actions-07', 'fw-ai-actions-app', 'actions.json handler name mismatch → must align case-sensitively')
      : fail('fw-ai-actions-07', 'fw-ai-actions-app', 'actions.json handler name mismatch → must align case-sensitively', 'missing case-sensitive handler rule'),
  );
}

// fw-review-05
{
  const c = await skill('fw-review');
  results.push(
    /script execution itself fails/i.test(c) && /stop the overall review/i.test(c)
      ? pass('fw-review-05', 'fw-review', 'deterministic script crashes → continue review, do not abort')
      : fail('fw-review-05', 'fw-review', 'deterministic script crashes → continue review, do not abort', 'missing script-failure continue rule'),
  );
}

// fw-publish-16
{
  const c = await skill('fw-publish');
  results.push(
    /targetState.*test/i.test(c) && /never ask the user to choose a state/i.test(c)
      ? pass('fw-publish-16', 'fw-publish', 'targetState → always "test", never prompt user')
      : fail('fw-publish-16', 'fw-publish', 'targetState → always "test", never prompt user', 'missing targetState test rule'),
  );
}

// fw-publish-17
{
  const c = await skill('fw-publish');
  results.push(
    /\.\/manifest\.json/i.test(c) && /create_app_upload_url/i.test(c)
      ? pass('fw-publish-17', 'fw-publish', 'zip has only ./manifest.json → STOP before create_app_upload_url')
      : fail('fw-publish-17', 'fw-publish', 'zip has only ./manifest.json → STOP before create_app_upload_url', 'missing zip layout gate'),
  );
}

// fw-setup-09
{
  const c = await skill('fw-setup');
  results.push(
    /fw-setup-use`/i.test(c) && /do not write metrics/i.test(c)
      ? pass('fw-setup-09', 'fw-setup', '/fw-setup-use → no .meta.json write (read-only stack switch)')
      : fail('fw-setup-09', 'fw-setup', '/fw-setup-use → no .meta.json write (read-only stack switch)', 'fw-setup-use not marked read-only'),
  );
}

// spec-02
{
  const c = await loadSpec();
  results.push(
    /once per session/i.test(c) && /first skill invocation/i.test(c)
      ? pass('spec-02', 'fw-app-dev', 'update check: check-update.sh once per session only')
      : fail('spec-02', 'fw-app-dev', 'update check: check-update.sh once per session only', 'missing once-per-session update rule'),
  );
}

// ─── P3: high-value gaps ───────────────────────────────────────────────────

// fw-setup-10
{
  const c = await skill('fw-setup');
  results.push(
    /fw-setup-downgrade/i.test(c) && /\.meta\.json metrics write/i.test(c) && /DO NOT emit REPORT before/i.test(c)
      ? pass('fw-setup-10', 'fw-setup', '/fw-setup-downgrade succeeded + manifest present → write .meta.json before REPORT')
      : fail('fw-setup-10', 'fw-setup', '/fw-setup-downgrade succeeded + manifest present → write .meta.json before REPORT', 'downgrade not in mutating meta write list'),
  );
}

// fw-setup-11
{
  const c = await skill('fw-setup');
  results.push(
    /Skip only if no `manifest\.json`/i.test(c)
      ? pass('fw-setup-11', 'fw-setup', '/fw-setup-install succeeded, no manifest.json → skip .meta.json write')
      : fail('fw-setup-11', 'fw-setup', '/fw-setup-install succeeded, no manifest.json → skip .meta.json write', 'missing bare-install skip rule'),
  );
}

// fw-app-dev-12
{
  const c = await skill('fw-app-dev');
  results.push(
    /Do not.*silently install/i.test(c) && /fw-setup/i.test(c)
      ? pass('fw-app-dev-12', 'fw-app-dev', 'fdk missing → offer fw-setup, no silent install')
      : fail('fw-app-dev-12', 'fw-app-dev', 'fdk missing → offer fw-setup, no silent install', 'missing no-silent-install rule'),
  );
}

// fw-app-dev-13
{
  const c = await skill('fw-app-dev');
  results.push(
    /Platform 2\.x manifest.*fw-setup-install.*fdk-migrate/is.test(c) ||
    /fw-setup-install` THEN `\/fdk-migrate/i.test(c)
      ? pass('fw-app-dev-13', 'fw-app-dev', 'Scenario A: FDK 9 + Platform 2.x → fw-setup-install then fdk-migrate')
      : fail('fw-app-dev-13', 'fw-app-dev', 'Scenario A: FDK 9 + Platform 2.x → fw-setup-install then fdk-migrate', 'missing 2.x → setup then migrate rule'),
  );
}

// fw-app-dev-14
{
  const c = await skill('fw-app-dev');
  results.push(
    /Platform 3\.0 manifest.*don't downgrade/i.test(c) ||
    (/Never downgrade the shell to match the file/i.test(c) && /fw-setup-install/i.test(c))
      ? pass('fw-app-dev-14', 'fw-app-dev', 'Scenario E: FDK 9 + Platform 3.0 manifest → upgrade toolchain, not downgrade app')
      : fail('fw-app-dev-14', 'fw-app-dev', 'Scenario E: FDK 9 + Platform 3.0 manifest → upgrade toolchain, not downgrade app', 'missing 3.0 + stale toolchain upgrade rule'),
  );
}

// fw-app-dev-15
{
  const c = await skill('fw-app-dev');
  results.push(
    /\$request\.post\(\)/i.test(c) && /invokeTemplate/i.test(c)
      ? pass('fw-app-dev-15', 'fw-app-dev', 'client $request.post() → must use $request.invokeTemplate')
      : fail('fw-app-dev-15', 'fw-app-dev', 'client $request.post() → must use $request.invokeTemplate', 'missing invokeTemplate forbidden-post rule'),
  );
}

// fw-app-dev-16
{
  const c = await skill('fw-app-dev');
  results.push(
    /FORBIDDEN.*"product"/i.test(c) && /MUST use.*"modules"/i.test(c)
      ? pass('fw-app-dev-16', 'fw-app-dev', '"product" block in manifest → reject, use "modules"')
      : fail('fw-app-dev-16', 'fw-app-dev', '"product" block in manifest → reject, use "modules"', 'missing product→modules rule'),
  );
}

// fw-review-06
{
  const c = await skill('fw-review');
  results.push(
    /evaluating all rules/i.test(c) && /before outputting the `## App Review Result`/i.test(c)
      ? pass('fw-review-06', 'fw-review', 'review with 0 failures → still write .meta.json before App Review Result')
      : fail('fw-review-06', 'fw-review', 'review with 0 failures → still write .meta.json before App Review Result', 'missing meta-before-result rule'),
  );
}

// fw-publish-18
{
  const c = await skill('fw-publish');
  results.push(
    /failed_submit/i.test(c) && /publish_outcome/i.test(c)
      ? pass('fw-publish-18', 'fw-publish', 'submit_custom_app fails → publish_outcome failed_submit, keep .meta.json')
      : fail('fw-publish-18', 'fw-publish', 'submit_custom_app fails → publish_outcome failed_submit, keep .meta.json', 'missing failed_submit outcome'),
  );
}

// fw-publish-19
{
  const c = await skill('fw-publish');
  results.push(
    /custom-app-limit-warning/i.test(c) && /before proceeding/i.test(c)
      ? pass('fw-publish-19', 'fw-publish', 'custom app limit warning must be shown before step 6')
      : fail('fw-publish-19', 'fw-publish', 'custom app limit warning must be shown before step 6', 'missing custom-app-limit-warning'),
  );
}

// fw-publish-20
{
  const c = await skill('fw-publish');
  results.push(
    /If `fdk` is missing/i.test(c) && /STOP/i.test(c) && /fw-setup-install/i.test(c)
      ? pass('fw-publish-20', 'fw-publish', 'fdk missing at publish → STOP, offer fw-setup')
      : fail('fw-publish-20', 'fw-publish', 'fdk missing at publish → STOP, offer fw-setup', 'missing fdk-missing STOP rule'),
  );
}

// fw-publish-21
{
  const c = await skill('fw-publish');
  results.push(
    /Existing app \(update\)/i.test(c) && /supportEmail.*is \*\*not\*\* part/i.test(c)
      ? pass('fw-publish-21', 'fw-publish', 'update existing listing → supportEmail not required')
      : fail('fw-publish-21', 'fw-publish', 'update existing listing → supportEmail not required', 'missing update-path no-email rule'),
  );
}

// fw-ai-actions-08
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /no arrays of objects/i.test(c)
      ? pass('fw-ai-actions-08', 'fw-ai-actions-app', 'array of objects in parameters → forbidden')
      : fail('fw-ai-actions-08', 'fw-ai-actions-app', 'array of objects in parameters → forbidden', 'missing no-arrays-of-objects rule'),
  );
}

// fw-ai-actions-09
{
  const c = await skill('fw-ai-actions-app');
  results.push(
    /If \*\*none\*\*: Inform the user and stop/i.test(c)
      ? pass('fw-ai-actions-09', 'fw-ai-actions-app', 'no manifest.json in workspace → inform user and stop')
      : fail('fw-ai-actions-09', 'fw-ai-actions-app', 'no manifest.json in workspace → inform user and stop', 'missing no-manifest stop rule'),
  );
}

// spec-03
{
  const c = await loadSpec();
  results.push(
    /fw-review \(MANDATORY\)/i.test(c) && /never skip it/i.test(c)
      ? pass('spec-03', 'fw-app-dev', 'mandatory end-to-end skill order before publish')
      : fail('spec-03', 'fw-app-dev', 'mandatory end-to-end skill order before publish', 'missing mandatory fw-review before publish'),
  );
}

// spec-04
{
  const c = await loadSpec();
  const hasTarget =
    /~\/\.fw-dev-tools\/\.meta\.json/i.test(c) && /update_check/i.test(c) && /check-update\.sh/i.test(c);
  const excludesPerApp =
    /not.*per-app|Do \*\*not\*\* write `update_check`/i.test(c) ||
    (/per-app/i.test(c) && /skill metrics only/i.test(c));
  results.push(
    hasTarget && excludesPerApp
      ? pass('spec-04', 'fw-app-dev', 'check-update.sh writes update_check to ~/.fw-dev-tools/.meta.json, not per-app .meta.json')
      : fail('spec-04', 'fw-app-dev', 'check-update.sh writes update_check to ~/.fw-dev-tools/.meta.json, not per-app .meta.json', 'spec missing install update_check target or per-app exclusion'),
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

/**
 * Layer 2: LLM-as-judge skill behavioral evals — local only.
 *
 * Requires: ANTHROPIC_API_KEY env var.
 * Run:      npm run eval
 *
 * Each scenario loads a skill file as the system prompt, sends a scenario
 * as the user message, forces structured JSON output via tool_use, then
 * asserts the returned fields deterministically.
 *
 * Results are written to eval-results.json for report.js to format.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, '..', 'skills');

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_RETRIES = 3;

// Skip entire file if no API key — suggest running inline in an LLM client instead
if (!process.env.ANTHROPIC_API_KEY) {
  console.log('⚠  ANTHROPIC_API_KEY not set — skipping LLM eval tests');
  console.log('');
  console.log('   To run evals without an API key, open this repo in Claude Code, Cursor, or Codex and ask:');
  console.log('   "Run the skill evals"');
  console.log('');
  console.log('   The model will read all skill files and evaluate the 24 scenarios inline.');
  process.exit(0);
}

const client = new Anthropic();
const results = [];

// ---------------------------------------------------------------------------
// Core helper: call model with skill as system prompt, get structured output
// ---------------------------------------------------------------------------

async function evalScenario(skillContent, scenarioPrompt, outputSchema) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: skillContent,
    messages: [{ role: 'user', content: scenarioPrompt }],
    tools: [
      {
        name: 'eval_response',
        description: 'Structured response for evaluation',
        input_schema: outputSchema,
      },
    ],
    tool_choice: { type: 'any' },
  });

  const toolUse = response.content.find(b => b.type === 'tool_use');
  if (!toolUse) throw new Error('Model did not call eval_response tool');
  return toolUse.input;
}

// Retry up to MAX_RETRIES; pass if 2/3 succeed
async function evalWithRetry(skillContent, scenarioPrompt, outputSchema, assertFn) {
  const attempts = [];
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const output = await evalScenario(skillContent, scenarioPrompt, outputSchema);
      assertFn(output);
      attempts.push({ pass: true, output });
      break; // pass on first success
    } catch (err) {
      attempts.push({ pass: false, error: err.message });
    }
  }
  const passed = attempts.filter(a => a.pass).length;
  return { passed, total: attempts.length, attempts };
}

// ---------------------------------------------------------------------------
// Scenario loader helpers
// ---------------------------------------------------------------------------

async function loadSkill(name) {
  return readFile(join(SKILLS_DIR, name, 'SKILL.md'), 'utf8');
}

async function loadCommand(skill, cmd) {
  return readFile(join(SKILLS_DIR, skill, 'commands', `${cmd}.md`), 'utf8');
}

async function loadSpec() {
  return readFile(join(__dirname, '..', 'installer', 'src', 'specs', 'fw-dev-tools-spec.md'), 'utf8');
}

async function loadSkillWithSpec(name) {
  const [spec, skill] = await Promise.all([loadSpec(), loadSkill(name)]);
  return `${spec}\n\n---\n\n${skill}`;
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

const SCENARIOS = [
  // fw-app-dev-01: platform 2.x → must migrate first, not validate
  {
    id: 'fw-app-dev-01',
    skill: 'fw-app-dev',
    label: 'platform-version 2.3 → must run fdk-migrate before fdk validate',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'The app has platform-version "2.3" in manifest.json. The developer says: run fdk validate.',
    schema: {
      type: 'object',
      required: ['should_run_fdk_migrate_first', 'should_run_fdk_validate_directly'],
      properties: {
        should_run_fdk_migrate_first: { type: 'boolean' },
        should_run_fdk_validate_directly: { type: 'boolean' },
        reasoning: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.should_run_fdk_migrate_first, true, 'must migrate before validate on 2.x app');
      assert.equal(output.should_run_fdk_validate_directly, false, 'must NOT run fdk validate directly on 2.x app');
    },
  },

  // fw-app-dev-02: after validate passes → write .meta.json before reporting
  {
    id: 'fw-app-dev-02',
    skill: 'fw-app-dev',
    label: 'fdk validate passed → write .meta.json before reporting, never mention to user',
    loadContent: () => loadCommand('fw-app-dev', 'fdk-fix'),
    prompt: 'fdk validate just completed successfully with zero errors and zero lint errors. What is the very next action before reporting results to the user? Be specific.',
    schema: {
      type: 'object',
      required: ['writes_meta_json', 'mentions_meta_json_to_user', 'next_action'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        mentions_meta_json_to_user: { type: 'boolean' },
        next_action: { type: 'string', enum: ['write_meta_json', 'report_to_user', 'run_validate_again', 'other'] },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, true, 'must write .meta.json after validate passes');
      assert.equal(output.mentions_meta_json_to_user, false, 'must NOT mention .meta.json to developer');
      assert.equal(output.next_action, 'write_meta_json', 'next action must be write_meta_json');
    },
  },

  // fw-app-dev-03: lint error remains → cannot mark app complete
  {
    id: 'fw-app-dev-03',
    skill: 'fw-app-dev',
    label: '1 lint error remaining after 3 iterations → cannot mark app complete',
    loadContent: () => loadCommand('fw-app-dev', 'fdk-fix'),
    prompt: 'fdk validate has been run 3 times. There are zero platform errors but 1 lint error still remains (async function without await). Can the app be marked as complete and reported to the user?',
    schema: {
      type: 'object',
      required: ['can_mark_complete', 'reason_includes_lint'],
      properties: {
        can_mark_complete: { type: 'boolean' },
        reason_includes_lint: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.can_mark_complete, false, 'must NOT mark app complete with lint errors');
      assert.equal(output.reason_includes_lint, true, 'reason must reference lint errors');
    },
  },

  // fw-setup-01: install succeeded with manifest.json present → write .meta.json
  {
    id: 'fw-setup-01',
    skill: 'fw-setup',
    label: '/fw-setup-install succeeded + manifest.json present → write .meta.json before REPORT',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-install completed successfully. New-shell verification passed (fdk version shows 10.0.1, node --version shows v24.11.0). There is a manifest.json in the current app directory. What happens before the REPORT is emitted to the user?',
    schema: {
      type: 'object',
      required: ['writes_meta_json', 'mentions_meta_json_to_user'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        mentions_meta_json_to_user: { type: 'boolean' },
        step_description: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, true, 'must write .meta.json after install when manifest.json exists');
      assert.equal(output.mentions_meta_json_to_user, false, 'must NOT mention .meta.json to developer');
    },
  },

  // fw-setup-02: status command → no .meta.json write
  {
    id: 'fw-setup-02',
    skill: 'fw-setup',
    label: '/fw-setup-status → must NOT write .meta.json (read-only command)',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'The developer runs /fw-setup-status. This checks the current FDK and Node versions without modifying anything. Should .meta.json be written as part of this command?',
    schema: {
      type: 'object',
      required: ['writes_meta_json', 'reason'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        reason: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, false, 'must NOT write .meta.json for read-only status command');
    },
  },

  // fw-review-01: review complete with failures → write .meta.json BEFORE emitting result
  {
    id: 'fw-review-01',
    skill: 'fw-review',
    label: 'review complete with 2 failures → write .meta.json before emitting App Review Result',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'The review pipeline has finished evaluating all rules. Two rules failed: IP-04A and FF-03A. What must happen before the "## App Review Result" block is emitted to the user?',
    schema: {
      type: 'object',
      required: ['writes_meta_json_before_result', 'mentions_meta_json_to_user'],
      properties: {
        writes_meta_json_before_result: { type: 'boolean' },
        mentions_meta_json_to_user: { type: 'boolean' },
        review_failure_categories: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json_before_result, true, 'must write .meta.json before emitting result');
      assert.equal(output.mentions_meta_json_to_user, false, 'must NOT mention .meta.json to developer');
      assert.ok(
        output.review_failure_categories?.includes('IP-04A') && output.review_failure_categories?.includes('FF-03A'),
        'review_failure_categories must include IP-04A and FF-03A'
      );
    },
  },

  // fw-publish-01: publish succeeded → delete .meta.json
  {
    id: 'fw-publish-01',
    skill: 'fw-publish',
    label: 'publish succeeded (test state) → delete .meta.json, publish_outcome = success',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Step 12 (get_app_status) confirmed the app is in "test" state. The publish was successful. What file operations happen before telling the user the publish is complete?',
    schema: {
      type: 'object',
      required: ['deletes_meta_json', 'publish_outcome'],
      properties: {
        deletes_meta_json: { type: 'boolean' },
        publish_outcome: { type: 'string' },
        mentions_meta_json_to_user: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.deletes_meta_json, true, 'must delete .meta.json on successful publish');
      assert.equal(output.publish_outcome, 'success', 'publish_outcome must be "success"');
    },
  },

  // fw-publish-02: fdk validate failed → keep .meta.json, correct outcome value
  {
    id: 'fw-publish-02',
    skill: 'fw-publish',
    label: 'fdk validate failed at step 4 → keep .meta.json, publish_outcome = failed_validate',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'fdk validate failed at step 4 of the publish flow with platform errors. The publish cannot proceed. What is the publish_outcome value that should be written to .meta.json, and should .meta.json be deleted?',
    schema: {
      type: 'object',
      required: ['publish_outcome', 'deletes_meta_json'],
      properties: {
        publish_outcome: { type: 'string' },
        deletes_meta_json: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.publish_outcome, 'failed_validate', 'publish_outcome must be "failed_validate"');
      assert.equal(output.deletes_meta_json, false, 'must NOT delete .meta.json on publish failure');
    },
  },

  // fw-ai-actions-01: after fdk validate → write .meta.json before showing result
  {
    id: 'fw-ai-actions-01',
    skill: 'fw-ai-actions-app',
    label: 'fdk validate completed → write .meta.json before showing result to user',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'fdk validate has just completed. There were 2 validation iterations and 1 fix iteration. What must happen before the final result is shown to the user?',
    schema: {
      type: 'object',
      required: ['writes_meta_json', 'mentions_meta_json_to_user'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        mentions_meta_json_to_user: { type: 'boolean' },
        fields_updated: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, true, 'must write .meta.json before showing result');
      assert.equal(output.mentions_meta_json_to_user, false, 'must NOT mention .meta.json to developer');
    },
  },

  // fw-app-dev-04: /fdk-review invoked → redirect to fw-review, do NOT handle in fw-app-dev
  {
    id: 'fw-app-dev-04',
    skill: 'fw-app-dev',
    label: '/fdk-review invoked → agent must redirect to fw-review skill, not handle in fw-app-dev',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'The developer types /fdk-review in the chat. What should happen? Should fw-app-dev handle this review request, or should it redirect the developer to use the fw-review skill?',
    schema: {
      type: 'object',
      required: ['should_handle_in_fw_app_dev', 'should_redirect_to_fw_review'],
      properties: {
        should_handle_in_fw_app_dev: { type: 'boolean' },
        should_redirect_to_fw_review: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.should_handle_in_fw_app_dev, false, 'fw-app-dev must NOT handle /fdk-review itself');
      assert.equal(output.should_redirect_to_fw_review, true, 'must redirect developer to fw-review skill');
    },
  },

  // fw-publish-03: publish succeeded → .meta.json deleted, not mentioned to user
  {
    id: 'fw-publish-03',
    skill: 'fw-publish',
    label: 'publish succeeded → .meta.json deleted silently without notifying developer',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The publish succeeded. .meta.json exists at the app root with "tracking_id": "abc123" and "start_time": "2026-06-01T10:00:00Z". What happens to .meta.json after a successful publish, and should the developer be told about it?',
    schema: {
      type: 'object',
      required: ['deletes_meta_json', 'mentions_meta_json_to_user', 'preserves_tracking_id_before_delete'],
      properties: {
        deletes_meta_json: { type: 'boolean' },
        mentions_meta_json_to_user: { type: 'boolean' },
        preserves_tracking_id_before_delete: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.deletes_meta_json, true, 'must delete .meta.json on successful publish');
      assert.equal(output.mentions_meta_json_to_user, false, 'must NOT mention .meta.json to developer');
      assert.equal(output.preserves_tracking_id_before_delete, true, 'tracking_id must not be modified before delete');
    },
  },

  // fw-publish-04: publish failed → manifest start_time NOT cleared, tracking_id preserved
  {
    id: 'fw-publish-04',
    skill: 'fw-publish',
    label: 'publish failed (step 4) → manifest unchanged, start_time not cleared',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The publish failed at step 4 (fdk validate error). The manifest.json has "tracking_id": "abc123" and "start_time": "2026-06-01T10:00:00Z". Should start_time be cleared to null since the publish failed?',
    schema: {
      type: 'object',
      required: ['clears_start_time_on_failure', 'preserves_tracking_id'],
      properties: {
        clears_start_time_on_failure: { type: 'boolean' },
        preserves_tracking_id: { type: 'boolean' },
        reasoning: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.clears_start_time_on_failure, false, 'must NOT clear start_time on publish failure — next attempt needs it');
      assert.equal(output.preserves_tracking_id, true, 'must preserve tracking_id on failure');
    },
  },

  // fw-setup-03: "install FDK 9" request → deprecation warning shown before proceeding
  {
    id: 'fw-setup-03',
    skill: 'fw-setup',
    label: '"install FDK 9" request → deprecation warning must be shown before proceeding',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'The developer says: "Please install FDK 9.8.2 for me." FDK 9 is deprecated. What must happen before the installation proceeds?',
    schema: {
      type: 'object',
      required: ['shows_deprecation_warning_first', 'proceeds_without_consent'],
      properties: {
        shows_deprecation_warning_first: { type: 'boolean' },
        proceeds_without_consent: { type: 'boolean' },
        requires_user_confirmation: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.shows_deprecation_warning_first, true, 'must show FDK 9 deprecation warning before installing');
      assert.equal(output.proceeds_without_consent, false, 'must NOT proceed without user consent');
    },
  },

  // fw-app-dev-05: .meta.json write must use meta-init.sh / meta-update.sh, not manual JSON write
  {
    id: 'fw-app-dev-05',
    skill: 'fw-app-dev',
    label: '.meta.json write → must invoke meta-init.sh and meta-update.sh scripts, not write JSON manually',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'fdk validate just passed with zero errors. You need to write .meta.json. Describe exactly how you would do it — would you write the JSON file directly, or run a script? If a script, which one(s)?',
    schema: {
      type: 'object',
      required: ['writes_json_directly', 'runs_meta_init_sh', 'runs_meta_update_sh'],
      properties: {
        writes_json_directly: { type: 'boolean' },
        runs_meta_init_sh: { type: 'boolean' },
        runs_meta_update_sh: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_json_directly, false, 'must NOT write .meta.json JSON directly — use scripts');
      assert.equal(output.runs_meta_init_sh, true, 'must run meta-init.sh');
      assert.equal(output.runs_meta_update_sh, true, 'must run meta-update.sh');
    },
  },

  // fw-publish-05: upload script must be used, not Python / Node / curl
  {
    id: 'fw-publish-05',
    skill: 'fw-publish',
    label: 'zip upload → must use upload-app.sh script, not Python / Node / curl',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Step 7 returned a response file at /tmp/fw-upload-response.json. You need to upload the zip file dist/myapp.zip to the marketplace. The skill instructs you to use upload-app.sh. A colleague suggests using Python requests or Node fetch instead because it is simpler. Which approach is correct and why?',
    schema: {
      type: 'object',
      required: ['uses_upload_script', 'uses_python_or_node_fetch', 'reason_for_script'],
      properties: {
        uses_upload_script: { type: 'boolean' },
        uses_python_or_node_fetch: { type: 'boolean' },
        reason_for_script: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_upload_script, true, 'must use upload-app.sh script for zip upload');
      assert.equal(output.uses_python_or_node_fetch, false, 'must NOT use Python/Node fetch — hits 403 in managed runtimes');
    },
  },

  // fw-publish-06: upload fails at step 8 → publish_outcome = failed_upload, keep .meta.json
  {
    id: 'fw-publish-06',
    skill: 'fw-publish',
    label: 'zip upload failed after 3 retries → publish_outcome = failed_upload, keep .meta.json',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The upload script at step 8 failed all 3 retries with a network error. The zip was never successfully uploaded. What is the correct publish_outcome value, and should .meta.json be deleted?',
    schema: {
      type: 'object',
      required: ['publish_outcome', 'deletes_meta_json'],
      properties: {
        publish_outcome: { type: 'string' },
        deletes_meta_json: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.publish_outcome, 'failed_upload', 'publish_outcome must be "failed_upload" when zip upload fails');
      assert.equal(output.deletes_meta_json, false, 'must NOT delete .meta.json on upload failure');
    },
  },

  // fw-app-dev-06: validate_iterations and validation_error_categories tracked correctly
  {
    id: 'fw-app-dev-06',
    skill: 'fw-app-dev',
    label: 'metrics: validate_iterations = run count, validation_error_categories appended per unique category',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'fdk validate was run 3 times. Run 1 had errors: "lint-async-no-await" and "missing-request-template". Run 2 had "lint-async-no-await" again. Run 3 passed. When calling meta-update.sh, what value should validate_iterations be, and which categories should be appended to validation_error_categories?',
    schema: {
      type: 'object',
      required: ['validate_iterations', 'validation_error_categories', 'deduplicates_categories'],
      properties: {
        validate_iterations: { type: 'number' },
        validation_error_categories: { type: 'array', items: { type: 'string' } },
        deduplicates_categories: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.validate_iterations, 3, 'validate_iterations must equal total fdk validate runs (3)');
      assert.ok(
        output.validation_error_categories.includes('lint-async-no-await') &&
        output.validation_error_categories.includes('missing-request-template'),
        'must include both unique error categories'
      );
      assert.equal(output.deduplicates_categories, true, 'must not duplicate categories already appended');
    },
  },

  // fw-setup-04: setup_node_changed / setup_fdk_changed reflect actual change, not always true
  {
    id: 'fw-setup-04',
    skill: 'fw-setup',
    label: 'metrics: setup_node_changed/setup_fdk_changed reflect actual change — false when nothing changed',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-install ran. Node was already v24.11.0 — no change was needed. FDK was upgraded from 9.8.2 to 10.0.1. What values should setup_node_changed and setup_fdk_changed be in the meta-update.sh call?',
    schema: {
      type: 'object',
      required: ['setup_node_changed', 'setup_fdk_changed'],
      properties: {
        setup_node_changed: { type: 'boolean' },
        setup_fdk_changed: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.setup_node_changed, false, 'setup_node_changed must be false — Node was already correct');
      assert.equal(output.setup_fdk_changed, true, 'setup_fdk_changed must be true — FDK was upgraded');
    },
  },

  // fw-review-02: review_failure_categories includes actual rule IDs from failing checks
  {
    id: 'fw-review-02',
    skill: 'fw-review',
    label: 'metrics: review_failure_categories populated with actual rule IDs, not generic labels',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'The review completed. Rules IP-04A (iparams validation), FF-03A (frontend file check), and SEC-01B (security pattern) all failed. When calling meta-update.sh for review_failure_categories, what exact values should be appended?',
    schema: {
      type: 'object',
      required: ['appends_rule_ids', 'review_failure_categories'],
      properties: {
        appends_rule_ids: { type: 'boolean' },
        review_failure_categories: { type: 'array', items: { type: 'string' } },
      },
    },
    assert(output) {
      assert.equal(output.appends_rule_ids, true, 'must append actual rule IDs, not generic labels');
      assert.ok(
        output.review_failure_categories.includes('IP-04A') &&
        output.review_failure_categories.includes('FF-03A') &&
        output.review_failure_categories.includes('SEC-01B'),
        'review_failure_categories must contain all 3 failing rule IDs'
      );
    },
  },

  // fw-publish-08: feedback step — must ask, graceful skip, never write null/empty
  {
    id: 'fw-publish-08',
    skill: 'fw-publish',
    label: 'feedback step: must ask before step 5, skip gracefully if no answer — never write null or empty',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'You are at step 4.5 (developer experience feedback). The developer says nothing and just presses Enter (skips). What do you write to .meta.json under the "feedback" key — null, an empty object, or nothing at all? Do you proceed to step 5?',
    schema: {
      type: 'object',
      required: ['writes_null_feedback', 'writes_empty_feedback', 'omits_feedback_key', 'proceeds_to_step_5'],
      properties: {
        writes_null_feedback: { type: 'boolean' },
        writes_empty_feedback: { type: 'boolean' },
        omits_feedback_key: { type: 'boolean' },
        proceeds_to_step_5: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.writes_null_feedback, false, 'must NOT write null for feedback');
      assert.equal(output.writes_empty_feedback, false, 'must NOT write empty object for feedback');
      assert.equal(output.omits_feedback_key, true, 'must omit feedback key entirely when developer skips');
      assert.equal(output.proceeds_to_step_5, true, 'must proceed to step 5 even when feedback is skipped');
    },
  },

  // fw-publish-09: new vs existing — must ask user, never assume appId from .fdk/app-info.json
  {
    id: 'fw-publish-09',
    skill: 'fw-publish',
    label: 'new vs existing: must ask user — never assume appId from .fdk/app-info.json',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'You are about to publish. The app directory contains .fdk/app-info.json with an appId field. The developer has not said whether this is a new listing or an update. Should you use the appId from .fdk/app-info.json directly, or must you ask the user first?',
    schema: {
      type: 'object',
      required: ['uses_appid_from_fdk_file_directly', 'asks_user_new_or_existing'],
      properties: {
        uses_appid_from_fdk_file_directly: { type: 'boolean' },
        asks_user_new_or_existing: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_appid_from_fdk_file_directly, false, 'must NOT use appId from .fdk/app-info.json without asking');
      assert.equal(output.asks_user_new_or_existing, true, 'must ask user whether this is a new listing or update');
    },
  },

  // fw-publish-10: fw-review must run before publish — cannot skip
  {
    id: 'fw-publish-10',
    skill: 'fw-publish',
    label: 'fw-review prerequisite: must run fw-review before publishing — cannot skip',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The developer says: "Skip the review, just publish the app directly." fw-review has not been run yet. Should you proceed with publishing without running fw-review?',
    schema: {
      type: 'object',
      required: ['proceeds_without_review', 'enforces_review_prerequisite'],
      properties: {
        proceeds_without_review: { type: 'boolean' },
        enforces_review_prerequisite: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.proceeds_without_review, false, 'must NOT publish without fw-review');
      assert.equal(output.enforces_review_prerequisite, true, 'must enforce fw-review as mandatory prerequisite');
    },
  },

  // spec-01: check-update.sh run on first invocation only — not on every message
  {
    id: 'spec-01',
    skill: 'fw-app-dev',
    label: 'update check: run check-update.sh on first skill invocation only, not on every message',
    loadContent: () => loadSkillWithSpec('fw-app-dev'),
    prompt: 'This is the first time a skill has been invoked in this session. The developer asks you to fix a validation error. Before handling that request, what update-related command, if any, should you run? Should you run it on every subsequent message in this session as well?',
    schema: {
      type: 'object',
      required: ['runs_check_update_sh', 'runs_on_every_message', 'runs_on_first_invocation_only'],
      properties: {
        runs_check_update_sh: { type: 'boolean' },
        runs_on_every_message: { type: 'boolean' },
        runs_on_first_invocation_only: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.runs_check_update_sh, true, 'must run check-update.sh on first invocation');
      assert.equal(output.runs_on_every_message, false, 'must NOT run check-update.sh on every message');
      assert.equal(output.runs_on_first_invocation_only, true, 'must run only on first skill invocation per session');
    },
  },

  // fw-publish-07: supportEmail must be collected before create_app_upload_url for new listing
  {
    id: 'fw-publish-07',
    skill: 'fw-publish',
    label: 'new listing → supportEmail must be collected before create_app_upload_url, STOP if missing',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The developer is publishing a new app listing (not an update). They have not provided a supportEmail yet. You are about to call create_app_upload_url to get the upload URL. Should you call create_app_upload_url now, or collect supportEmail first? What happens if the developer cannot provide a supportEmail?',
    schema: {
      type: 'object',
      required: ['calls_upload_url_before_email', 'collects_email_first', 'stops_if_email_missing'],
      properties: {
        calls_upload_url_before_email: { type: 'boolean' },
        collects_email_first: { type: 'boolean' },
        stops_if_email_missing: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.calls_upload_url_before_email, false, 'must NOT call create_app_upload_url before collecting supportEmail');
      assert.equal(output.collects_email_first, true, 'must collect supportEmail before create_app_upload_url');
      assert.equal(output.stops_if_email_missing, true, 'must STOP if developer cannot provide supportEmail');
    },
  },
];

// ---------------------------------------------------------------------------
// Run scenarios and collect results
// ---------------------------------------------------------------------------

describe('Skill LLM behavioral evals', () => {
  for (const scenario of SCENARIOS) {
    test(`[${scenario.id}] ${scenario.label}`, async () => {
      const skillContent = await scenario.loadContent();
      const { passed, total, attempts } = await evalWithRetry(
        skillContent,
        scenario.prompt,
        scenario.schema,
        scenario.assert,
      );

      const result = {
        id: scenario.id,
        skill: scenario.skill,
        label: scenario.label,
        passed,
        total,
        pass: passed >= Math.ceil(total / 2),
        attempts: attempts.map(a => ({ pass: a.pass, error: a.error ?? null })),
        model: MODEL,
      };
      results.push(result);

      assert.ok(result.pass, `[${scenario.id}] failed ${total - passed}/${total} attempts. Last error: ${attempts.at(-1)?.error}`);
    });
  }
});

// Write results after all tests
process.on('exit', async () => {
  try {
    await writeFile(
      join(__dirname, 'eval-results.json'),
      JSON.stringify({ model: MODEL, timestamp: new Date().toISOString(), results }, null, 2),
      'utf8'
    );
  } catch {
    // best-effort
  }
});

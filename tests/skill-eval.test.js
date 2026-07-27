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
  console.log('   The model will read all skill files and evaluate the 78 scenarios inline.');
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

  // fw-publish-01: publish succeeded → delete .meta.json (metrics were pre-pack)
  {
    id: 'fw-publish-01',
    skill: 'fw-publish',
    label: 'metrics before fdk pack (step 4.6) → delete .meta.json after successful publish',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Step 12 confirmed the app is in "test" state. When were fw-publish metrics (invoked, skill_version) written relative to fdk pack, and what file operation happens in step 13 before telling the user?',
    schema: {
      type: 'object',
      required: ['deletes_meta_json', 'metrics_before_pack'],
      properties: {
        deletes_meta_json: { type: 'boolean' },
        metrics_before_pack: { type: 'boolean' },
        mentions_meta_json_to_user: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.deletes_meta_json, true, 'must delete .meta.json on successful publish');
      assert.equal(output.metrics_before_pack, true, 'fw-publish metrics must be written before fdk pack (step 4.6)');
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
    prompt: 'You are at step 4.5 (developer experience feedback). The developer chooses Skip (or presses Enter without 👍/👎). Should you call meta-feedback.sh? What happens to the "developer_feedback" key in .meta.json? Do you proceed to step 5?',
    schema: {
      type: 'object',
      required: ['calls_meta_feedback_sh', 'writes_null_feedback', 'writes_empty_feedback', 'omits_feedback_key', 'proceeds_to_step_5'],
      properties: {
        calls_meta_feedback_sh: { type: 'boolean' },
        writes_null_feedback: { type: 'boolean' },
        writes_empty_feedback: { type: 'boolean' },
        omits_feedback_key: { type: 'boolean' },
        proceeds_to_step_5: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.calls_meta_feedback_sh, false, 'must NOT call meta-feedback.sh when developer skips');
      assert.equal(output.writes_null_feedback, false, 'must NOT write null for feedback');
      assert.equal(output.writes_empty_feedback, false, 'must NOT write empty object for feedback');
      assert.equal(output.omits_feedback_key, true, 'must omit developer_feedback key entirely when developer skips');
      assert.equal(output.proceeds_to_step_5, true, 'must proceed to step 5 even when feedback is skipped');
    },
  },

  // fw-publish-08b: feedback liked + comment — meta-feedback.sh only
  {
    id: 'fw-publish-08b',
    skill: 'fw-publish',
    label: 'feedback liked + comment → meta-feedback.sh with rating and comment before step 5',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Step 4.5: the developer chose 👍 Liked it and said "Setup was smooth". How do you persist feedback in .meta.json before fdk pack? Name the exact script and arguments pattern.',
    schema: {
      type: 'object',
      required: ['uses_meta_feedback_sh', 'rating_liked', 'includes_comment', 'manual_json_write'],
      properties: {
        uses_meta_feedback_sh: { type: 'boolean' },
        rating_liked: { type: 'boolean' },
        includes_comment: { type: 'boolean' },
        manual_json_write: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.uses_meta_feedback_sh, true, 'must use meta-feedback.sh');
      assert.equal(output.rating_liked, true, 'rating must be liked');
      assert.equal(output.includes_comment, true, 'comment must be passed when developer provided text');
      assert.equal(output.manual_json_write, false, 'must NOT hand-write feedback JSON');
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

  // fw-app-dev-07: prerequisite check — /fw-setup-status before build
  {
    id: 'fw-app-dev-07',
    skill: 'fw-app-dev',
    label: 'must run /fw-setup-status before building a new app',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'A developer asks you to build a new Freshdesk serverless app from scratch. You have not checked the toolchain yet. What is the first fw-setup command you must run before creating any app files or running fdk validate?',
    schema: {
      type: 'object',
      required: ['first_command', 'proceeds_without_setup_check'],
      properties: {
        first_command: { type: 'string' },
        proceeds_without_setup_check: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.match(output.first_command, /fw-setup-status/i, 'must run /fw-setup-status first');
      assert.equal(output.proceeds_without_setup_check, false, 'must not proceed without toolchain check');
    },
  },

  // fw-review-03: multi-manifest — only allowed question is which app
  {
    id: 'fw-review-03',
    skill: 'fw-review',
    label: 'multiple manifest.json — only ask which app to review',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'The workspace contains two apps: ./ticket-logger/manifest.json and ./sync-app/manifest.json. The developer says "review this app". Besides asking which app folder to review, may you ask other clarifying questions about scope, features, or publishing intent before running the review?',
    schema: {
      type: 'object',
      required: ['asks_which_app', 'asks_other_questions_before_review'],
      properties: {
        asks_which_app: { type: 'boolean' },
        asks_other_questions_before_review: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.asks_which_app, true, 'must ask which app when multiple manifests exist');
      assert.equal(output.asks_other_questions_before_review, false, 'must not ask extra questions beyond app selection');
    },
  },

  // fw-publish-11: actions.json → ask worksWith ai_actions
  {
    id: 'fw-publish-11',
    skill: 'fw-publish',
    label: 'actions.json present → ask about worksWith ai_actions before submit',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'You are publishing an app that contains config/actions.json with AI Actions definitions. Before submit, should you automatically set worksWith: ai_actions in the marketplace listing, or must you ask the developer first?',
    schema: {
      type: 'object',
      required: ['asks_developer_about_ai_actions', 'auto_sets_without_asking'],
      properties: {
        asks_developer_about_ai_actions: { type: 'boolean' },
        auto_sets_without_asking: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.asks_developer_about_ai_actions, true, 'must ask about worksWith: ai_actions');
      assert.equal(output.auto_sets_without_asking, false, 'must not set ai_actions flag without asking');
    },
  },

  // fw-publish-12: update without actions.json → downgrade warning
  {
    id: 'fw-publish-12',
    skill: 'fw-publish',
    label: 'update existing listing without actions.json → downgrade warning and confirm',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'You are updating an existing marketplace listing. The new app package has no config/actions.json, but the live listing currently has worksWith: ai_actions enabled. Should you proceed silently, or show a downgrade warning and get confirmation before continuing?',
    schema: {
      type: 'object',
      required: ['shows_downgrade_warning', 'proceeds_without_confirmation'],
      properties: {
        shows_downgrade_warning: { type: 'boolean' },
        proceeds_without_confirmation: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.shows_downgrade_warning, true, 'must warn about ai_actions downgrade');
      assert.equal(output.proceeds_without_confirmation, false, 'must not proceed without confirmation');
    },
  },

  // ─── P0: highest-risk behavioral gates ─────────────────────────────────────

  {
    id: 'fw-ai-actions-02',
    skill: 'fw-ai-actions-app',
    label: 'nested vendor API payload → flat parameters in actions.json, nest in server.js',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'The Stripe API expects a nested object: { "customer": { "email": "...", "name": "..." } }. How should you define the actions.json request parameters schema?',
    schema: {
      type: 'object',
      required: ['parameters_stay_flat', 'nest_in_server_js'],
      properties: {
        parameters_stay_flat: { type: 'boolean' },
        nest_in_server_js: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.parameters_stay_flat, true, 'request parameters must stay flat');
      assert.equal(output.nest_in_server_js, true, 'nested structure must be built in server.js');
    },
  },

  {
    id: 'fw-ai-actions-03',
    skill: 'fw-ai-actions-app',
    label: 'api_key in actions.json → must use secure iparams instead',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'The developer asks you to add api_key directly in actions.json parameters for convenience. Should you do that?',
    schema: {
      type: 'object',
      required: ['allows_api_key_in_actions_json', 'uses_secure_iparams'],
      properties: {
        allows_api_key_in_actions_json: { type: 'boolean' },
        uses_secure_iparams: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.allows_api_key_in_actions_json, false, 'must not put secrets in actions.json');
      assert.equal(output.uses_secure_iparams, true, 'must use secure iparams or OAuth');
    },
  },

  {
    id: 'fw-review-04',
    skill: 'fw-review',
    label: 'fdk missing → STOP, offer fw-setup, no silent install, no full review report',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'You are about to run fw-review but `fdk --version` fails (command not found). What should you do? Should you emit a full "## App Review Result" block as if all phases ran?',
    schema: {
      type: 'object',
      required: ['stops_pipeline', 'offers_fw_setup', 'silent_install', 'emits_full_review_result'],
      properties: {
        stops_pipeline: { type: 'boolean' },
        offers_fw_setup: { type: 'boolean' },
        silent_install: { type: 'boolean' },
        emits_full_review_result: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.stops_pipeline, true, 'must STOP when fdk missing');
      assert.equal(output.offers_fw_setup, true, 'must offer /fw-setup-install');
      assert.equal(output.silent_install, false, 'must not silently install fdk');
      assert.equal(output.emits_full_review_result, false, 'must not emit full App Review Result without fdk');
    },
  },

  {
    id: 'fw-app-dev-08',
    skill: 'fw-app-dev',
    label: 'implement_app MCP tool requested → refuse, use fw-app-dev skill flow',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'The developer says: use the implement_app MCP tool to build this Freshdesk app quickly. Should you call implement_app?',
    schema: {
      type: 'object',
      required: ['should_call_implement_app', 'should_use_fw_app_dev_skill'],
      properties: {
        should_call_implement_app: { type: 'boolean' },
        should_use_fw_app_dev_skill: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.should_call_implement_app, false, 'must NOT call deprecated implement_app');
      assert.equal(output.should_use_fw_app_dev_skill, true, 'must use fw-app-dev skill workflow');
    },
  },

  {
    id: 'fw-app-dev-09',
    skill: 'fw-app-dev',
    label: 'FDK 10 + Node 24 installed, manifest engines 9/18 → raise engines, not downgrade toolchain',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'Shell has FDK 10.0.1 and Node v24.11.0. manifest.json engines are "fdk": "9.8.2", "node": "18.20.8". platform-version is "3.0". Should you downgrade the machine to FDK 9 / Node 18 to match manifest engines?',
    schema: {
      type: 'object',
      required: ['downgrades_toolchain', 'updates_manifest_engines_upward'],
      properties: {
        downgrades_toolchain: { type: 'boolean' },
        updates_manifest_engines_upward: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.downgrades_toolchain, false, 'must NOT downgrade toolchain to match legacy engines');
      assert.equal(output.updates_manifest_engines_upward, true, 'must align manifest engines upward to 10.x/24.x');
    },
  },

  // ─── P1: setup, ai-actions HTTP, publish guards ────────────────────────────

  {
    id: 'fw-setup-05',
    skill: 'fw-setup',
    label: '/fw-setup-upgrade succeeded + manifest present → write .meta.json before REPORT',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-upgrade completed successfully. Verification passed in a new shell. manifest.json exists in the app directory. Should .meta.json be written before the REPORT?',
    schema: {
      type: 'object',
      required: ['writes_meta_json'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, true, 'upgrade must write .meta.json when manifest exists');
    },
  },

  {
    id: 'fw-setup-06',
    skill: 'fw-setup',
    label: '/fw-setup-troubleshoot without --fix → no .meta.json write',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'The developer runs /fw-setup-troubleshoot (diagnostic only, no --fix flag). Should .meta.json be written?',
    schema: {
      type: 'object',
      required: ['writes_meta_json'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, false, 'troubleshoot without --fix must not write metrics');
    },
  },

  {
    id: 'fw-setup-07',
    skill: 'fw-setup',
    label: '/fw-setup-troubleshoot --fix → write .meta.json before REPORT',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-troubleshoot --fix completed successfully and fixed PATH issues. manifest.json exists. Should .meta.json be written before REPORT?',
    schema: {
      type: 'object',
      required: ['writes_meta_json'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, true, 'troubleshoot --fix must write .meta.json when manifest exists');
    },
  },

  {
    id: 'fw-setup-08',
    skill: 'fw-setup',
    label: 'npm install -g @freshworks/fdk → refuse, use CDN tarball',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'The developer asks you to run: npm install -g @freshworks/fdk@10.0.1. Should you use this method to install FDK?',
    schema: {
      type: 'object',
      required: ['uses_npm_registry', 'uses_cdn_tarball'],
      properties: {
        uses_npm_registry: { type: 'boolean' },
        uses_cdn_tarball: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_npm_registry, false, 'must NOT install FDK from npm registry');
      assert.equal(output.uses_cdn_tarball, true, 'must use CDN tarball install path');
    },
  },

  {
    id: 'fw-ai-actions-04',
    skill: 'fw-ai-actions-app',
    label: 'external HTTP in server → $request.invokeTemplate only',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'You need to call a third-party REST API from the AI Actions server.js handler. Can you use axios or fetch directly?',
    schema: {
      type: 'object',
      required: ['allows_axios_or_fetch', 'uses_invoke_template'],
      properties: {
        allows_axios_or_fetch: { type: 'boolean' },
        uses_invoke_template: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.allows_axios_or_fetch, false, 'must not use axios/fetch for external HTTP');
      assert.equal(output.uses_invoke_template, true, 'must use $request.invokeTemplate');
    },
  },

  {
    id: 'fw-ai-actions-05',
    skill: 'fw-ai-actions-app',
    label: 'AI-only app → no app/ folder or Crayons UI',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'Building a pure AI Actions integration (actions.json + server only). Should you create an app/ folder with Crayons UI and icon.svg?',
    schema: {
      type: 'object',
      required: ['creates_app_folder', 'ai_actions_only_layout'],
      properties: {
        creates_app_folder: { type: 'boolean' },
        ai_actions_only_layout: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.creates_app_folder, false, 'must not create app/ folder for AI-only apps');
      assert.equal(output.ai_actions_only_layout, true, 'must use actions.json + server layout only');
    },
  },

  {
    id: 'fw-publish-13',
    skill: 'fw-publish',
    label: 'latest version in development state → STOP, stuck-version warning',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'list_app_versions shows the latest version is stuck in "development" state. Should you proceed to create_app_upload_url anyway?',
    schema: {
      type: 'object',
      required: ['stops_for_stuck_version', 'shows_stuck_version_warning'],
      properties: {
        stops_for_stuck_version: { type: 'boolean' },
        shows_stuck_version_warning: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.stops_for_stuck_version, true, 'must STOP when version stuck in development');
      assert.equal(output.shows_stuck_version_warning, true, 'must show stuck-version-warning template');
    },
  },

  {
    id: 'fw-publish-14',
    skill: 'fw-publish',
    label: 'MCP 401 → STOP auth setup, no retry loop',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'list_custom_apps returned HTTP 401 Unauthorized. Should you retry the MCP call three times, or stop and show auth setup instructions?',
    schema: {
      type: 'object',
      required: ['stops_immediately', 'retries_without_fixing_auth'],
      properties: {
        stops_immediately: { type: 'boolean' },
        retries_without_fixing_auth: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.stops_immediately, true, 'must STOP on 401 and show auth instructions');
      assert.equal(output.retries_without_fixing_auth, false, 'must not retry MCP without fixing token');
    },
  },

  {
    id: 'fw-publish-15',
    skill: 'fw-publish',
    label: 'manifest engines mismatch → STOP, engines-mismatch prompt, no fdk pack',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'fdk is installed (10.0.1 / Node 24.11) but manifest engines say fdk 9.8.2 and node 18.20.8. Should you run fdk pack and continue publish?',
    schema: {
      type: 'object',
      required: ['stops_for_mismatch', 'runs_fdk_pack_anyway'],
      properties: {
        stops_for_mismatch: { type: 'boolean' },
        runs_fdk_pack_anyway: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.stops_for_mismatch, true, 'must STOP on engines mismatch');
      assert.equal(output.runs_fdk_pack_anyway, false, 'must not run fdk pack until resolved');
    },
  },

  // ─── P2: additional gates ──────────────────────────────────────────────────

  {
    id: 'fw-app-dev-10',
    skill: 'fw-app-dev',
    label: '6 validate iterations failed → LAST RESORT engines downgrade only then',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'fdk validate has been run 6 times on FDK 10 + Node 24 and still fails. The developer asks to downgrade manifest engines to FDK 9 / Node 18 immediately to unblock. Should you downgrade engines before exhausting the 6-iteration loop?',
    schema: {
      type: 'object',
      required: ['downgrade_before_six_iterations', 'last_resort_only_after_six'],
      properties: {
        downgrade_before_six_iterations: { type: 'boolean' },
        last_resort_only_after_six: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.downgrade_before_six_iterations, false, 'must not downgrade engines as first move');
      assert.equal(output.last_resort_only_after_six, true, 'LAST RESORT only after 6 failed iterations');
    },
  },

  {
    id: 'fw-app-dev-11',
    skill: 'fw-app-dev',
    label: 'Platform 2.x product block → migrate, not validate on 3.0 toolchain',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'manifest.json has platform-version "2.3" and a legacy "product" block. FDK 10 and Node 24 are installed. Should you run fdk validate directly?',
    schema: {
      type: 'object',
      required: ['should_run_fdk_migrate_first', 'should_run_fdk_validate_directly'],
      properties: {
        should_run_fdk_migrate_first: { type: 'boolean' },
        should_run_fdk_validate_directly: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.should_run_fdk_migrate_first, true, 'must migrate Platform 2.x first');
      assert.equal(output.should_run_fdk_validate_directly, false, 'must not validate 2.x manifest directly');
    },
  },

  {
    id: 'fw-ai-actions-06',
    skill: 'fw-ai-actions-app',
    label: 'multiple manifest.json → ask which app (Q1)',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'Workspace has ./slack-bot/manifest.json and ./teams-bot/manifest.json. User says "build the AI action". Should you pick one silently or ask which app directory to use?',
    schema: {
      type: 'object',
      required: ['asks_which_app', 'picks_silently'],
      properties: {
        asks_which_app: { type: 'boolean' },
        picks_silently: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.asks_which_app, true, 'must ask which app when multiple manifests');
      assert.equal(output.picks_silently, false, 'must not pick app directory silently');
    },
  },

  {
    id: 'fw-ai-actions-07',
    skill: 'fw-ai-actions-app',
    label: 'actions.json handler name mismatch → must align case-sensitively',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'actions.json defines handler "createTicket" but server.js exports "createticket". Is this acceptable?',
    schema: {
      type: 'object',
      required: ['acceptable_mismatch', 'must_match_case_sensitive'],
      properties: {
        acceptable_mismatch: { type: 'boolean' },
        must_match_case_sensitive: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.acceptable_mismatch, false, 'handler name mismatch is not acceptable');
      assert.equal(output.must_match_case_sensitive, true, 'function names must match exactly');
    },
  },

  {
    id: 'fw-review-05',
    skill: 'fw-review',
    label: 'deterministic script crashes → continue review, do not abort',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'The fw-review script external-import-sources.js crashed with an exception while checking the app. Should you abort the entire review pipeline?',
    schema: {
      type: 'object',
      required: ['aborts_entire_review', 'continues_other_rules'],
      properties: {
        aborts_entire_review: { type: 'boolean' },
        continues_other_rules: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.aborts_entire_review, false, 'must not abort entire review on script failure');
      assert.equal(output.continues_other_rules, true, 'must continue evaluating remaining rules');
    },
  },

  {
    id: 'fw-publish-16',
    skill: 'fw-publish',
    label: 'targetState → always "test", never prompt user',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Before submit_custom_app, should you ask the developer which marketplace state to publish to (test vs live)?',
    schema: {
      type: 'object',
      required: ['asks_user_for_state', 'target_state_is_test'],
      properties: {
        asks_user_for_state: { type: 'boolean' },
        target_state_is_test: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.asks_user_for_state, false, 'must not ask user to choose state');
      assert.equal(output.target_state_is_test, true, 'targetState must always be test');
    },
  },

  {
    id: 'fw-publish-17',
    skill: 'fw-publish',
    label: 'zip has only ./manifest.json → STOP before create_app_upload_url',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'After fdk pack, the zip lists only "./manifest.json" at root (with leading ./) and no bare "manifest.json" member. Can you call create_app_upload_url?',
    schema: {
      type: 'object',
      required: ['can_call_upload_url', 'must_repack_or_stop'],
      properties: {
        can_call_upload_url: { type: 'boolean' },
        must_repack_or_stop: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.can_call_upload_url, false, 'must not upload zip with only ./manifest.json');
      assert.equal(output.must_repack_or_stop, true, 'must STOP and repack with root manifest.json');
    },
  },

  {
    id: 'fw-setup-09',
    skill: 'fw-setup',
    label: '/fw-setup-use → no .meta.json write (read-only stack switch)',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'The developer runs /fw-setup-use 24.11 to switch Node for this shell. manifest.json exists. Should .meta.json metrics be written?',
    schema: {
      type: 'object',
      required: ['writes_meta_json'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, false, 'fw-setup-use must not write .meta.json');
    },
  },

  {
    id: 'spec-02',
    skill: 'fw-app-dev',
    label: 'update check: check-update.sh once per session only',
    loadContent: () => loadSpec(),
    prompt: 'This is the developer\'s fifth message in the same Cursor session. fw-dev-tools was already loaded earlier. Should you run check-update.sh again on this message?',
    schema: {
      type: 'object',
      required: ['runs_check_update_again', 'once_per_session'],
      properties: {
        runs_check_update_again: { type: 'boolean' },
        once_per_session: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.runs_check_update_again, false, 'must not run check-update on every message');
      assert.equal(output.once_per_session, true, 'update check is once per session');
    },
  },

  // ─── P3: high-value gaps from second audit ─────────────────────────────────

  {
    id: 'fw-setup-10',
    skill: 'fw-setup',
    label: '/fw-setup-downgrade succeeded + manifest present → write .meta.json before REPORT',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-downgrade to FDK 9.x completed successfully. Verification passed. manifest.json exists in the app directory. Should .meta.json be written before REPORT?',
    schema: {
      type: 'object',
      required: ['writes_meta_json'],
      properties: { writes_meta_json: { type: 'boolean' }, explanation: { type: 'string' } },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, true, 'downgrade must write .meta.json when manifest exists');
    },
  },

  {
    id: 'fw-setup-11',
    skill: 'fw-setup',
    label: '/fw-setup-install succeeded, no manifest.json → skip .meta.json write',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-install completed successfully on a bare machine with no app project open. There is no manifest.json anywhere in the working directory. Should .meta.json metrics be written?',
    schema: {
      type: 'object',
      required: ['writes_meta_json'],
      properties: { writes_meta_json: { type: 'boolean' }, explanation: { type: 'string' } },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, false, 'bare install without manifest must skip metrics');
    },
  },

  {
    id: 'fw-app-dev-12',
    skill: 'fw-app-dev',
    label: 'fdk missing → offer fw-setup, no silent install',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'You are about to build a new app but `fdk --version` fails (command not found). Should you silently run /fw-setup-install, or STOP and ask the user first?',
    schema: {
      type: 'object',
      required: ['stops_for_missing_fdk', 'silent_install', 'offers_fw_setup'],
      properties: {
        stops_for_missing_fdk: { type: 'boolean' },
        silent_install: { type: 'boolean' },
        offers_fw_setup: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.stops_for_missing_fdk, true, 'must STOP when fdk missing');
      assert.equal(output.silent_install, false, 'must not silently install fdk');
      assert.equal(output.offers_fw_setup, true, 'must offer fw-setup');
    },
  },

  {
    id: 'fw-app-dev-13',
    skill: 'fw-app-dev',
    label: 'Scenario A: FDK 9 + Platform 2.x → fw-setup-install then fdk-migrate',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'Installed toolchain: FDK 9.8.2, Node 18.20.8. manifest.json has platform-version "2.3" and engines fdk 9.x / node 18.x. User asks to work on this app. What is the correct first sequence?',
    schema: {
      type: 'object',
      required: ['runs_fw_setup_install_first', 'runs_fdk_migrate', 'runs_fdk_validate_directly'],
      properties: {
        runs_fw_setup_install_first: { type: 'boolean' },
        runs_fdk_migrate: { type: 'boolean' },
        runs_fdk_validate_directly: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.runs_fw_setup_install_first, true, 'must upgrade toolchain first (Scenario A)');
      assert.equal(output.runs_fdk_migrate, true, 'must migrate after toolchain upgrade');
      assert.equal(output.runs_fdk_validate_directly, false, 'must not validate 2.x app on legacy toolchain');
    },
  },

  {
    id: 'fw-app-dev-14',
    skill: 'fw-app-dev',
    label: 'Scenario E: FDK 9 + Platform 3.0 manifest → upgrade toolchain, not downgrade app',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'Installed: FDK 9.8.2, Node 18.20.8. manifest.json is already platform-version "3.0" with engines fdk 9.8.2 and node 18.20.8. Should you downgrade the app manifest to match the old toolchain, or upgrade the toolchain?',
    schema: {
      type: 'object',
      required: ['downgrades_app_engines', 'upgrades_toolchain'],
      properties: {
        downgrades_app_engines: { type: 'boolean' },
        upgrades_toolchain: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.downgrades_app_engines, false, 'must not downgrade 3.0 app to FDK 9/Node 18');
      assert.equal(output.upgrades_toolchain, true, 'must upgrade toolchain to FDK 10 + Node 24');
    },
  },

  {
    id: 'fw-app-dev-15',
    skill: 'fw-app-dev',
    label: 'client $request.post() → must use $request.invokeTemplate',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'In app/scripts/app.js you need to call an external API from the Freshdesk client UI. Can you use $request.post() directly?',
    schema: {
      type: 'object',
      required: ['allows_request_post', 'uses_invoke_template'],
      properties: {
        allows_request_post: { type: 'boolean' },
        uses_invoke_template: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.allows_request_post, false, 'must not use $request.post in client');
      assert.equal(output.uses_invoke_template, true, 'must use $request.invokeTemplate via request templates');
    },
  },

  {
    id: 'fw-app-dev-16',
    skill: 'fw-app-dev',
    label: '"product" block in manifest → reject, use "modules"',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'A generated manifest.json contains `"product": { "freshdesk": {} }` instead of a modules block. Is this valid for Platform 3.0?',
    schema: {
      type: 'object',
      required: ['is_valid_platform3', 'must_use_modules'],
      properties: {
        is_valid_platform3: { type: 'boolean' },
        must_use_modules: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.is_valid_platform3, false, 'product block is forbidden on Platform 3.0');
      assert.equal(output.must_use_modules, true, 'must use modules not product');
    },
  },

  {
    id: 'fw-app-dev-17',
    skill: 'fw-app-dev',
    label: 'Create sidebar app → React Meta + DEW, metaConfig in manifest',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'User asks: "Create a Freshdesk ticket sidebar app to show ticket info." No stack preference stated. Which scaffold and UI stack should you use?',
    schema: {
      type: 'object',
      required: ['uses_react_meta', 'uses_dew', 'meta_config_in_manifest'],
      properties: {
        uses_react_meta: { type: 'boolean' },
        uses_dew: { type: 'boolean' },
        meta_config_in_manifest: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_react_meta, true, 'default UI must be React Meta');
      assert.equal(output.uses_dew, true, 'must recommend DEW');
      assert.equal(output.meta_config_in_manifest, true, 'metaConfig must be in manifest.json');
    },
  },

  {
    id: 'fw-app-dev-18',
    skill: 'fw-app-dev',
    label: 'Migrate JS → /fdk-react-migrate',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'User has a Platform 3.0 vanilla JS app with app/scripts/app.js and Crayons CDN. They want to move to React Meta. Which command/workflow should you use?',
    schema: {
      type: 'object',
      required: ['uses_fdk_react_migrate'],
      properties: {
        uses_fdk_react_migrate: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_fdk_react_migrate, true, 'must use /fdk-react-migrate for vanilla→Meta');
    },
  },

  {
    id: 'fw-app-dev-19',
    skill: 'fw-app-dev',
    label: 'Meta app: no Crayons; DEW packages present',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'You are creating a new React Meta app. Can you add @freshworks/crayons and the Crayons CDN script to index.html?',
    schema: {
      type: 'object',
      required: ['allows_crayons', 'requires_dew'],
      properties: {
        allows_crayons: { type: 'boolean' },
        requires_dew: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.allows_crayons, false, 'Crayons forbidden in Meta workflow');
      assert.equal(output.requires_dew, true, 'DEW recommended/required for Meta default');
    },
  },

  {
    id: 'fw-app-dev-20',
    skill: 'fw-app-dev',
    label: 'Platform 2.x → /fdk-migrate first',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'User asks to convert a Platform 2.3 app to React Meta. manifest has platform-version "2.3". What is the first migration command before /fdk-react-migrate?',
    schema: {
      type: 'object',
      required: ['runs_fdk_migrate_first'],
      properties: {
        runs_fdk_migrate_first: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.runs_fdk_migrate_first, true, 'must /fdk-migrate 2.x to 3.0 first');
    },
  },

  {
    id: 'fw-app-dev-21',
    skill: 'fw-app-dev',
    label: '"Vanilla JS" → vanilla skeleton',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'User explicitly says: "Create a vanilla JS sidebar app with Crayons, no React." Which template should you use?',
    schema: {
      type: 'object',
      required: ['uses_vanilla_skeleton', 'uses_react_meta'],
      properties: {
        uses_vanilla_skeleton: { type: 'boolean' },
        uses_react_meta: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_vanilla_skeleton, true, 'explicit vanilla → frontend-skeleton');
      assert.equal(output.uses_react_meta, false, 'must not default to Meta when vanilla requested');
    },
  },

  {
    id: 'fw-app-dev-22',
    skill: 'fw-app-dev',
    label: 'Router includes path="*"',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'In a React Meta app, what React Router path should the home/fallback route use?',
    schema: {
      type: 'object',
      required: ['home_route_path'],
      properties: {
        home_route_path: { type: 'string' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.home_route_path, '*', 'home route must be path="*"');
    },
  },

  {
    id: 'fw-app-dev-23',
    skill: 'fw-app-dev',
    label: 'metaConfig in manifest.json only',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'Where must metaConfig.framework "react" be declared for a Meta app?',
    schema: {
      type: 'object',
      required: ['location'],
      properties: {
        location: { type: 'string' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.match(output.location, /manifest\.json/i, 'metaConfig must be in manifest.json');
    },
  },

  {
    id: 'fw-app-dev-24',
    skill: 'fw-app-dev',
    label: 'TypeScript .tsx valid',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'Can a React Meta app use TypeScript .tsx components and tsconfig.json?',
    schema: {
      type: 'object',
      required: ['typescript_supported'],
      properties: {
        typescript_supported: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.typescript_supported, true, 'TypeScript must be supported for Meta apps');
    },
  },

  {
    id: 'fw-app-dev-25',
    skill: 'fw-app-dev',
    label: 'User asks for Tailwind → allowed',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'User asks to add Tailwind CSS to their React Meta app. Should you refuse because DEW is the default, or allow Tailwind alongside DEW?',
    schema: {
      type: 'object',
      required: ['allows_tailwind', 'documents_config'],
      properties: {
        allows_tailwind: { type: 'boolean' },
        documents_config: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.allows_tailwind, true, 'Tailwind must be allowed');
      assert.equal(output.documents_config, true, 'should document vite/postcss/tailwind config');
    },
  },

  {
    id: 'fw-app-dev-26',
    skill: 'fw-app-dev',
    label: 'Custom vite.config.js — FDK merge precedence',
    loadContent: () => loadSkill('fw-app-dev'),
    prompt: 'Developer adds vite.config.js at project root for aliases. On conflict with FDK internal Vite config (entry points, app/config aliases), who wins?',
    schema: {
      type: 'object',
      required: ['fdk_wins_on_conflict', 'allows_custom_vite'],
      properties: {
        fdk_wins_on_conflict: { type: 'boolean' },
        allows_custom_vite: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.allows_custom_vite, true, 'custom vite.config.js is allowed');
      assert.equal(output.fdk_wins_on_conflict, true, 'FDK must win on entry/alias conflicts');
    },
  },

  {
    id: 'fw-review-06',
    skill: 'fw-review',
    label: 'review with 0 failures → still write .meta.json before App Review Result',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'The fw-review pipeline completed with zero failures — all rules passed. The skill says to write .meta.json "before emitting ## App Review Result". Does this requirement apply only when there are failures, or unconditionally?',
    schema: {
      type: 'object',
      required: ['writes_meta_json_before_result'],
      properties: {
        writes_meta_json_before_result: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json_before_result, true, 'must write .meta.json even when all rules pass');
    },
  },

  {
    id: 'fw-publish-18',
    skill: 'fw-publish',
    label: 'submit_custom_app fails → publish_outcome failed_submit, keep .meta.json',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'submit_custom_app failed at step 10 with an API error. What publish_outcome should be written, and should .meta.json be deleted?',
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
      assert.equal(output.publish_outcome, 'failed_submit', 'publish_outcome must be failed_submit');
      assert.equal(output.deletes_meta_json, false, 'must keep .meta.json on submit failure');
    },
  },

  {
    id: 'fw-publish-19',
    skill: 'fw-publish',
    label: 'custom app limit warning must be shown before step 6',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'You are about to start step 6 (new vs existing app routing) in the publish flow. Must you show the custom app limit warning text first?',
    schema: {
      type: 'object',
      required: ['must_show_limit_warning', 'can_skip_warning'],
      properties: {
        must_show_limit_warning: { type: 'boolean' },
        can_skip_warning: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.must_show_limit_warning, true, 'must show custom-app-limit-warning before step 6');
      assert.equal(output.can_skip_warning, false, 'warning is mandatory');
    },
  },

  {
    id: 'fw-publish-20',
    skill: 'fw-publish',
    label: 'fdk missing at publish → STOP, offer fw-setup',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'User wants to publish but `fdk --version` fails. Should you continue to fdk validate or STOP and offer /fw-setup-install?',
    schema: {
      type: 'object',
      required: ['continues_publish', 'offers_fw_setup'],
      properties: {
        continues_publish: { type: 'boolean' },
        offers_fw_setup: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.continues_publish, false, 'must STOP publish when fdk missing');
      assert.equal(output.offers_fw_setup, true, 'must offer fw-setup install');
    },
  },

  {
    id: 'fw-publish-21',
    skill: 'fw-publish',
    label: 'update existing listing → supportEmail not required',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Developer chose "update existing app" (add_app_version path). Must you collect supportEmail before create_app_upload_url?',
    schema: {
      type: 'object',
      required: ['requires_support_email', 'can_proceed_without_email'],
      properties: {
        requires_support_email: { type: 'boolean' },
        can_proceed_without_email: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.requires_support_email, false, 'supportEmail not required for update path');
      assert.equal(output.can_proceed_without_email, true, 'can proceed to upload URL without email on update');
    },
  },

  {
    id: 'fw-ai-actions-08',
    skill: 'fw-ai-actions-app',
    label: 'array of objects in parameters → forbidden',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'The API needs a list of tag objects [{name, color}]. Can you define parameters.tags as an array of objects in actions.json?',
    schema: {
      type: 'object',
      required: ['allows_array_of_objects', 'build_in_server_js'],
      properties: {
        allows_array_of_objects: { type: 'boolean' },
        build_in_server_js: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.allows_array_of_objects, false, 'arrays of objects forbidden in parameters');
      assert.equal(output.build_in_server_js, true, 'construct complex shapes in server.js');
    },
  },

  {
    id: 'fw-ai-actions-09',
    skill: 'fw-ai-actions-app',
    label: 'no manifest.json in workspace → inform user and stop',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'User asks to build an AI Actions integration but a workspace search finds no manifest.json files. What should you do?',
    schema: {
      type: 'object',
      required: ['informs_user_and_stops', 'creates_manifest_anyway'],
      properties: {
        informs_user_and_stops: { type: 'boolean' },
        creates_manifest_anyway: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.informs_user_and_stops, true, 'must inform user and stop when no manifest');
      assert.equal(output.creates_manifest_anyway, false, 'must not silently invent app directory');
    },
  },

  {
    id: 'spec-03',
    skill: 'fw-app-dev',
    label: 'mandatory end-to-end skill order before publish',
    loadContent: () => loadSpec(),
    prompt: 'User built an app with fw-app-dev and wants to publish immediately without review. What is the correct skill order from toolchain to marketplace?',
    schema: {
      type: 'object',
      required: ['includes_fw_review_before_publish', 'can_skip_fw_review'],
      properties: {
        includes_fw_review_before_publish: { type: 'boolean' },
        can_skip_fw_review: { type: 'boolean' },
        skill_order: { type: 'string' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.includes_fw_review_before_publish, true, 'fw-review must come before fw-publish');
      assert.equal(output.can_skip_fw_review, false, 'cannot skip mandatory fw-review');
    },
  },

  {
    id: 'spec-04',
    skill: 'fw-app-dev',
    label: 'check-update.sh writes update_check to ~/.fw-dev-tools/.meta.json, not per-app .meta.json',
    loadContent: () => loadSpec(),
    prompt: 'You are about to run check-update.sh on the first skill invocation of this session. Which .meta.json file does it update? Which fields does it write? Should you add update_check fields to the app directory .meta.json via meta-update.sh?',
    schema: {
      type: 'object',
      required: [
        'updates_install_meta_json',
        'writes_update_check_fields',
        'writes_update_check_to_per_app_meta',
      ],
      properties: {
        updates_install_meta_json: { type: 'boolean' },
        writes_update_check_fields: { type: 'boolean' },
        writes_update_check_to_per_app_meta: { type: 'boolean' },
        target_path: { type: 'string' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.updates_install_meta_json, true, 'must update ~/.fw-dev-tools/.meta.json');
      assert.equal(output.writes_update_check_fields, true, 'must write update_check fields via script');
      assert.equal(output.writes_update_check_to_per_app_meta, false, 'must NOT write update_check to per-app .meta.json');
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

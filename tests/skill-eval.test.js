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

// Skip entire file if no API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.log('⚠  ANTHROPIC_API_KEY not set — skipping LLM eval tests');
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

  // fw-app-dev-02: after validate passes → write app.info before reporting
  {
    id: 'fw-app-dev-02',
    skill: 'fw-app-dev',
    label: 'fdk validate passed → write app.info before reporting, never mention to user',
    loadContent: () => loadCommand('fw-app-dev', 'fdk-fix'),
    prompt: 'fdk validate just completed successfully with zero errors and zero lint errors. What is the very next action before reporting results to the user? Be specific.',
    schema: {
      type: 'object',
      required: ['writes_app_info', 'mentions_app_info_to_user', 'next_action'],
      properties: {
        writes_app_info: { type: 'boolean' },
        mentions_app_info_to_user: { type: 'boolean' },
        next_action: { type: 'string', enum: ['write_app_info', 'report_to_user', 'run_validate_again', 'other'] },
      },
    },
    assert(output) {
      assert.equal(output.writes_app_info, true, 'must write app.info after validate passes');
      assert.equal(output.mentions_app_info_to_user, false, 'must NOT mention app.info to developer');
      assert.equal(output.next_action, 'write_app_info', 'next action must be write_app_info');
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

  // fw-setup-01: install succeeded with manifest.json present → write app.info
  {
    id: 'fw-setup-01',
    skill: 'fw-setup',
    label: '/fw-setup-install succeeded + manifest.json present → write app.info before REPORT',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-install completed successfully. New-shell verification passed (fdk version shows 10.0.1, node --version shows v24.11.0). There is a manifest.json in the current app directory. What happens before the REPORT is emitted to the user?',
    schema: {
      type: 'object',
      required: ['writes_app_info', 'mentions_app_info_to_user'],
      properties: {
        writes_app_info: { type: 'boolean' },
        mentions_app_info_to_user: { type: 'boolean' },
        step_description: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_app_info, true, 'must write app.info after install when manifest.json exists');
      assert.equal(output.mentions_app_info_to_user, false, 'must NOT mention app.info to developer');
    },
  },

  // fw-setup-02: status command → no app.info write
  {
    id: 'fw-setup-02',
    skill: 'fw-setup',
    label: '/fw-setup-status → must NOT write app.info (read-only command)',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'The developer runs /fw-setup-status. This checks the current FDK and Node versions without modifying anything. Should app.info be written as part of this command?',
    schema: {
      type: 'object',
      required: ['writes_app_info', 'reason'],
      properties: {
        writes_app_info: { type: 'boolean' },
        reason: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_app_info, false, 'must NOT write app.info for read-only status command');
    },
  },

  // fw-review-01: review complete with failures → write app.info BEFORE emitting result
  {
    id: 'fw-review-01',
    skill: 'fw-review',
    label: 'review complete with 2 failures → write app.info before emitting App Review Result',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'The review pipeline has finished evaluating all rules. Two rules failed: IP-04A and FF-03A. What must happen before the "## App Review Result" block is emitted to the user?',
    schema: {
      type: 'object',
      required: ['writes_app_info_before_result', 'mentions_app_info_to_user'],
      properties: {
        writes_app_info_before_result: { type: 'boolean' },
        mentions_app_info_to_user: { type: 'boolean' },
        review_failure_categories: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    assert(output) {
      assert.equal(output.writes_app_info_before_result, true, 'must write app.info before emitting result');
      assert.equal(output.mentions_app_info_to_user, false, 'must NOT mention app.info to developer');
      assert.ok(
        output.review_failure_categories?.includes('IP-04A') && output.review_failure_categories?.includes('FF-03A'),
        'review_failure_categories must include IP-04A and FF-03A'
      );
    },
  },

  // fw-publish-01: publish succeeded → delete app.info
  {
    id: 'fw-publish-01',
    skill: 'fw-publish',
    label: 'publish succeeded (test state) → delete app.info, publish_outcome = success',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Step 12 (get_app_status) confirmed the app is in "test" state. The publish was successful. What file operations happen before telling the user the publish is complete?',
    schema: {
      type: 'object',
      required: ['deletes_app_info', 'publish_outcome'],
      properties: {
        deletes_app_info: { type: 'boolean' },
        publish_outcome: { type: 'string' },
        mentions_app_info_to_user: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.deletes_app_info, true, 'must delete app.info on successful publish');
      assert.equal(output.publish_outcome, 'success', 'publish_outcome must be "success"');
    },
  },

  // fw-publish-02: fdk validate failed → keep app.info, correct outcome value
  {
    id: 'fw-publish-02',
    skill: 'fw-publish',
    label: 'fdk validate failed at step 4 → keep app.info, publish_outcome = failed_validate',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'fdk validate failed at step 4 of the publish flow with platform errors. The publish cannot proceed. What is the publish_outcome value that should be written to app.info, and should app.info be deleted?',
    schema: {
      type: 'object',
      required: ['publish_outcome', 'deletes_app_info'],
      properties: {
        publish_outcome: { type: 'string' },
        deletes_app_info: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.publish_outcome, 'failed_validate', 'publish_outcome must be "failed_validate"');
      assert.equal(output.deletes_app_info, false, 'must NOT delete app.info on publish failure');
    },
  },

  // fw-ai-actions-01: after fdk validate → write app.info before showing result
  {
    id: 'fw-ai-actions-01',
    skill: 'fw-ai-actions-app',
    label: 'fdk validate completed → write app.info before showing result to user',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'fdk validate has just completed. There were 2 validation iterations and 1 fix iteration. What must happen before the final result is shown to the user?',
    schema: {
      type: 'object',
      required: ['writes_app_info', 'mentions_app_info_to_user'],
      properties: {
        writes_app_info: { type: 'boolean' },
        mentions_app_info_to_user: { type: 'boolean' },
        fields_updated: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    assert(output) {
      assert.equal(output.writes_app_info, true, 'must write app.info before showing result');
      assert.equal(output.mentions_app_info_to_user, false, 'must NOT mention app.info to developer');
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

  // fw-publish-03: publish succeeded → start_time cleared, tracking_id preserved, silent to user
  {
    id: 'fw-publish-03',
    skill: 'fw-publish',
    label: 'publish succeeded → manifest start_time cleared to null, tracking_id preserved, silent to user',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The publish succeeded. Before deleting app.info, the manifest.json had "tracking_id": "abc123" and "start_time": "2026-06-01T10:00:00Z". After successful publish, what should be done to manifest.json, and should the developer be told about these manifest changes?',
    schema: {
      type: 'object',
      required: ['clears_start_time', 'preserves_tracking_id', 'mentions_manifest_changes_to_user'],
      properties: {
        clears_start_time: { type: 'boolean' },
        preserves_tracking_id: { type: 'boolean' },
        mentions_manifest_changes_to_user: { type: 'boolean' },
        start_time_new_value: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.clears_start_time, true, 'must clear start_time to null on success');
      assert.equal(output.preserves_tracking_id, true, 'must preserve tracking_id after publish');
      assert.equal(output.mentions_manifest_changes_to_user, false, 'must NOT mention manifest changes to developer');
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

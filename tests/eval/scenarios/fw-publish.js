import assert from 'node:assert/strict';
import { loadSkill, loadCommand, loadSpec, loadSkillWithSpec } from '../scenario-helpers.js';
export const FW_PUBLISH_SCENARIOS = [
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

  // fw-publish-03: publish succeeded → .meta.json deleted, not mentioned to user
  {
    id: 'fw-publish-03',
    skill: 'fw-publish',
    label: 'publish succeeded → .meta.json deleted silently without notifying developer',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The publish succeeded. .meta.json exists at the app root with "tracking_id": "abc123" and "start_time": "2026-06-01T10:00:00Z". What happens to .meta.json after a successful publish, and should the developer be told about it? Does the skill call meta-update.sh to zero out any fields before calling meta-delete.sh?',
    schema: {
      type: 'object',
      required: ['deletes_meta_json', 'mentions_meta_json_to_user', 'calls_meta_update_before_delete'],
      properties: {
        deletes_meta_json: { type: 'boolean' },
        mentions_meta_json_to_user: { type: 'boolean' },
        calls_meta_update_before_delete: { type: 'boolean' },
      },
    },
    assert(output) {
      assert.equal(output.deletes_meta_json, true, 'must delete .meta.json on successful publish');
      assert.equal(output.mentions_meta_json_to_user, false, 'must NOT mention .meta.json to developer');
      assert.equal(output.calls_meta_update_before_delete, false, 'must NOT call meta-update.sh to zero fields before deletion — just call meta-delete.sh directly');
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

  // fw-publish-08: feedback step — must ask, graceful skip, never write null/empty
  {
    id: 'fw-publish-08',
    skill: 'fw-publish',
    label: 'no feedback response → skip gracefully before step 5, never write null or empty string',
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

  // fw-publish-22: MCP server unavailable → show setup instructions, do not retry
  {
    id: 'fw-publish-22',
    skill: 'fw-publish',
    label: 'MCP server unavailable → show MCP setup instructions, do not retry indefinitely',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'list_custom_apps returned a connection error — the fw-dev-mcp server is not configured. Should you retry the call 5 times, or stop and show MCP setup instructions?',
    schema: {
      type: 'object',
      required: ['retries_without_setup', 'shows_mcp_setup_instructions'],
      properties: {
        retries_without_setup: { type: 'boolean' },
        shows_mcp_setup_instructions: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.retries_without_setup, false, 'must NOT retry without fixing MCP configuration');
      assert.equal(output.shows_mcp_setup_instructions, true, 'must show MCP setup instructions when server unavailable');
    },
  },

  // fw-publish-23: update path → must call list_app_versions first
  {
    id: 'fw-publish-23',
    skill: 'fw-publish',
    label: 'update path → must call list_app_versions first to check for stuck version',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Developer chose to update an existing app. Before calling add_app_version, should you call list_app_versions to check if the latest version is stuck in development state?',
    schema: {
      type: 'object',
      required: ['calls_list_app_versions_first', 'skips_version_check'],
      properties: {
        calls_list_app_versions_first: { type: 'boolean' },
        skips_version_check: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.calls_list_app_versions_first, true, 'must call list_app_versions before add_app_version');
      assert.equal(output.skips_version_check, false, 'must NOT skip the version check on update path');
    },
  },

  // fw-publish-24: no existing apps → use create_app_upload_url (new), not add_app_version (update)
  {
    id: 'fw-publish-24',
    skill: 'fw-publish',
    label: 'list_custom_apps returns empty → use create_app_upload_url (new), not add_app_version (update)',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'list_custom_apps returns an empty array — the developer has no apps yet. Should you call add_app_version (update) or create_app_upload_url (new listing)?',
    schema: {
      type: 'object',
      required: ['uses_add_app_version', 'uses_create_app_upload_url'],
      properties: {
        uses_add_app_version: { type: 'boolean' },
        uses_create_app_upload_url: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_add_app_version, false, 'must NOT call add_app_version when no apps exist');
      assert.equal(output.uses_create_app_upload_url, true, 'must call create_app_upload_url for a new listing');
    },
  },

  {
    id: 'fw-publish-26',
    skill: 'fw-publish',
    label: 'JWT product ambiguity → pauses to ask Freshdesk vs Freshservice before pack',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Developer wants to publish their app. The Developer API key is product-specific. Before proceeding to fdk pack, should the skill ask the developer to confirm which product (Freshdesk or Freshservice) their API key is configured for?',
    schema: {
      type: 'object',
      required: ['confirms_product_before_pack', 'proceeds_without_confirmation'],
      properties: {
        confirms_product_before_pack: { type: 'boolean' },
        proceeds_without_confirmation: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.confirms_product_before_pack, true, 'must confirm API key product match before fdk pack');
      assert.equal(output.proceeds_without_confirmation, false, 'must not proceed to pack without product confirmation');
    },
  },

  {
    id: 'fw-publish-27',
    skill: 'fw-publish',
    label: 'get_app_status called after submit to confirm test state',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The fw-publish skill is loaded above. After submit_custom_app or add_app_version completes, the skill describes a status check. Based solely on that document: does it call get_app_status with the appId to confirm app-level state (calls_get_app_status = true)? Does it verify the app reached "test" state (verifies_test_state = true)?',
    schema: {
      type: 'object',
      required: ['calls_get_app_status', 'verifies_test_state'],
      properties: {
        calls_get_app_status: { type: 'boolean' },
        verifies_test_state: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.calls_get_app_status, true, 'must call get_app_status after submit');
      assert.equal(output.verifies_test_state, true, 'must verify app reached test state');
    },
  },

  {
    id: 'fw-publish-28',
    skill: 'fw-publish',
    label: 'final message includes app id, version state, and install location',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'The app was successfully submitted. What must the final message to the developer include — the app id, the version state, and where to install custom apps in their product (e.g. Admin -> Apps)?',
    schema: {
      type: 'object',
      required: ['includes_app_id', 'includes_version_state', 'includes_install_location'],
      properties: {
        includes_app_id: { type: 'boolean' },
        includes_version_state: { type: 'boolean' },
        includes_install_location: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.includes_app_id, true, 'final message must include the app id');
      assert.equal(output.includes_version_state, true, 'final message must include the version state');
      assert.equal(output.includes_install_location, true, 'final message must include where to install the app');
    },
  },

  {
    id: 'fw-publish-29',
    skill: 'fw-publish',
    label: 'JWT/API key must never be pasted into chat — use MCP Authorization header only',
    loadContent: () => loadSkill('fw-publish'),
    prompt: 'Developer is setting up marketplace publishing. Should the skill ask the developer to paste their JWT or API key directly into the chat conversation, or should the credential only be configured in the MCP Authorization header?',
    schema: {
      type: 'object',
      required: ['asks_to_paste_key_in_chat', 'uses_mcp_header_only'],
      properties: {
        asks_to_paste_key_in_chat: { type: 'boolean' },
        uses_mcp_header_only: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.asks_to_paste_key_in_chat, false, 'must NOT ask developer to paste JWT/API key into chat');
      assert.equal(output.uses_mcp_header_only, true, 'credential must only be configured in MCP Authorization header');
    },
  },

];

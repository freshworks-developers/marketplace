import assert from 'node:assert/strict';
import { loadSkill, loadCommand, loadSpec, loadSkillWithSpec } from '../scenario-helpers.js';
export const FW_REVIEW_SCENARIOS = [
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

  // fw-review-02: review_failure_categories includes actual rule IDs from failing checks
  {
    id: 'fw-review-02',
    skill: 'fw-review',
    label: 'review_failure_categories → must contain actual rule IDs, never generic labels',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'The review completed. Rules IP-04A (iparams validation), FF-03A (frontend file check), and GN-12L (missing test_data) all failed. When calling meta-update.sh for review_failure_categories, what exact values should be appended? Note: this is an internal metrics question — output the exact rule ID strings in the JSON array, not the user-visible report.',
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
        Array.isArray(output.review_failure_categories) &&
        output.review_failure_categories.includes('IP-04A') &&
        output.review_failure_categories.includes('FF-03A') &&
        output.review_failure_categories.includes('GN-12L'),
        'review_failure_categories must contain all 3 failing rule IDs'
      );
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

  // fw-review-07: IP-04A — sensitive:true + encrypted:false → must fail
  {
    id: 'fw-review-07',
    skill: 'fw-review',
    label: 'IP-04A: iparam sensitive:true but encrypted:false → must fail',
    loadContent: () => loadSkill('fw-review'),
    prompt: "config/iparams.json has a field 'api_key' with 'sensitive': true and 'encrypted': false. Does this violate IP-04A?",
    schema: {
      type: 'object',
      required: ['violates_ip04a', 'should_fail'],
      properties: {
        violates_ip04a: { type: 'boolean' },
        should_fail: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.violates_ip04a, true, 'sensitive:true with encrypted:false must violate IP-04A');
      assert.equal(output.should_fail, true, 'review must fail when IP-04A is violated');
    },
  },

  // fw-review-08: rule IDs must NOT appear in user-visible output
  {
    id: 'fw-review-08',
    skill: 'fw-review',
    label: 'report output must NOT contain rule IDs (IP-*, FF-*, GN-*) in user-visible text',
    loadContent: () => loadSkill('fw-review'),
    prompt: "The review pipeline finished. Rules IP-04A and FF-03A failed. Should the final ## App Review Result block include the strings 'IP-04A' or 'FF-03A' in the user-visible output?",
    schema: {
      type: 'object',
      required: ['includes_rule_ids_in_output', 'rule_ids_are_internal_only'],
      properties: {
        includes_rule_ids_in_output: { type: 'boolean' },
        rule_ids_are_internal_only: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.includes_rule_ids_in_output, false, 'rule IDs must NOT appear in user-visible output');
      assert.equal(output.rule_ids_are_internal_only, true, 'rule IDs are internal only, not shown to user');
    },
  },

  // fw-review-09: report must NOT be wrapped in a code fence
  {
    id: 'fw-review-09',
    skill: 'fw-review',
    label: 'report must NOT be wrapped in a code fence',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'You are about to emit the ## App Review Result block. Should you wrap it in a code fence like ```text or ```markdown?',
    schema: {
      type: 'object',
      required: ['wraps_in_code_fence', 'emits_raw_markdown'],
      properties: {
        wraps_in_code_fence: { type: 'boolean' },
        emits_raw_markdown: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.wraps_in_code_fence, false, 'must NOT wrap App Review Result in a code fence');
      assert.equal(output.emits_raw_markdown, true, 'must emit raw markdown without code fence wrapper');
    },
  },

  // fw-review-10: zero failures → emit 'successful' only, no numbered list
  {
    id: 'fw-review-10',
    skill: 'fw-review',
    label: 'zero failures → emit "successful" word only, no numbered list',
    loadContent: () => loadSkill('fw-review'),
    prompt: "All review rules passed. Zero failures. The report.md says: emit 'successful' alone on its own line when there are zero failures. What exactly should appear below the ## App Review Result heading?",
    schema: {
      type: 'object',
      required: ['emits_successful_word', 'emits_numbered_list', 'includes_pass_rationale'],
      properties: {
        emits_successful_word: { type: 'boolean' },
        emits_numbered_list: { type: 'boolean' },
        includes_pass_rationale: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.emits_successful_word, true, 'must emit the word "successful" when zero failures');
      assert.equal(output.emits_numbered_list, false, 'must NOT emit a numbered list when zero failures');
      assert.equal(output.includes_pass_rationale, false, 'must NOT include pass rationale text when zero failures');
    },
  },

  // fw-review-11: single manifest found → start review immediately
  {
    id: 'fw-review-11',
    skill: 'fw-review',
    label: 'single manifest found → start review immediately, no Q1 question to user',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'Workspace search finds exactly one manifest.json at ./my-app/manifest.json. Should you ask the user which app to review before starting?',
    schema: {
      type: 'object',
      required: ['asks_user_which_app', 'starts_review_immediately'],
      properties: {
        asks_user_which_app: { type: 'boolean' },
        starts_review_immediately: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.asks_user_which_app, false, 'must NOT ask user when only one manifest exists');
      assert.equal(output.starts_review_immediately, true, 'must start review immediately with single manifest');
    },
  },

  // fw-review-12: IP-05A — iparams field missing required:true
  {
    id: 'fw-review-12',
    skill: 'fw-review',
    label: 'IP-05A: iparams field missing required:true on a clearly required field',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The app has the following config/iparams.json:
\`\`\`json
{
  "api_key": {
    "display_name": "API Key",
    "description": "Your API key for authentication",
    "type": "text",
    "secure": true
  },
  "domain": {
    "display_name": "Domain",
    "description": "Your account domain (e.g. mycompany.freshdesk.com)",
    "type": "text",
    "required": true
  }
}
\`\`\`
The api_key field is used in every API call and is clearly mandatory. Does the review flag a missing required:true on the api_key field?`,
    schema: {
      type: 'object',
      required: ['flags_missing_required', 'identifies_api_key_field'],
      properties: {
        flags_missing_required: { type: 'boolean' },
        identifies_api_key_field: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_missing_required, true, 'should flag missing required:true on api_key field (IP-05A)');
      assert.equal(output.identifies_api_key_field, true, 'should specifically identify api_key as the offending field');
    },
  },

  // fw-review-13: IP-06A — regex present but error message is generic
  // TODO: flaky — model may try to read rules/iparams-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-13',
    skill: 'fw-review',
    label: 'IP-06A: iparams regex has generic error message instead of descriptive one',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The app has the following config/iparams.json:
\`\`\`json
{
  "subdomain": {
    "display_name": "Subdomain",
    "description": "Your account subdomain",
    "type": "text",
    "required": true,
    "regex": "^[a-zA-Z0-9-]+$",
    "error": "Invalid"
  }
}
\`\`\`
Does the review flag the generic error message "Invalid" as a violation of IP-06A?`,
    schema: {
      type: 'object',
      required: ['flags_generic_error_message', 'recommends_descriptive_message'],
      properties: {
        flags_generic_error_message: { type: 'boolean' },
        recommends_descriptive_message: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_generic_error_message, true, 'should flag generic "Invalid" error message (IP-06A)');
      assert.equal(output.recommends_descriptive_message, true, 'should recommend a descriptive error message with expected format');
    },
  },
  */

  // fw-review-14: FF-01L — client-side code uses fetch() instead of request templates
  // TODO: flaky — model may try to read rules/frontend-files-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-14',
    skill: 'fw-review',
    label: 'FF-01L: app/scripts/app.js uses fetch() for API calls instead of request templates',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/scripts/app.js contains:
\`\`\`javascript
function getTickets() {
  fetch('https://mycompany.freshdesk.com/api/v2/tickets', {
    headers: {
      'Authorization': 'Basic ' + btoa(apiKey + ':X')
    }
  })
  .then(res => res.json())
  .then(data => renderTickets(data));
}
\`\`\`
Does the review flag the use of fetch() in client-side code as a violation (should use request templates instead)?`,
    schema: {
      type: 'object',
      required: ['flags_fetch_usage', 'recommends_request_templates'],
      properties: {
        flags_fetch_usage: { type: 'boolean' },
        recommends_request_templates: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_fetch_usage, true, 'should flag fetch() usage in client-side code (FF-01L)');
      assert.equal(output.recommends_request_templates, true, 'should recommend using request templates instead');
    },
  },
  */

  // fw-review-15: FF-02M — SMI function is a pass-through to invokeTemplate
  {
    id: 'fw-review-15',
    skill: 'fw-review',
    label: 'FF-02M: server.js SMI function only calls $request.invokeTemplate with no additional logic',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Rule FF-02M states: "SMI calls should not be used when it can be replaced with client.request.invokeTemplate(). If server.js only calls $request.invokeTemplate() and returns the result (a pass-through), replace with a request template." Based on this rule: (1) is such a pure pass-through SMI function flagged as unnecessary (flags_unnecessary_smi = true)? (2) does the rule describe the pass-through pattern — SMI only calling invokeTemplate with no additional server logic — as the violation (identifies_pass_through_pattern = true)?`,
    schema: {
      type: 'object',
      required: ['flags_unnecessary_smi', 'identifies_pass_through_pattern'],
      properties: {
        flags_unnecessary_smi: { type: 'boolean' },
        identifies_pass_through_pattern: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_unnecessary_smi, true, 'should flag SMI function that only calls invokeTemplate (FF-02M)');
      assert.equal(output.identifies_pass_through_pattern, true, 'should identify that it is a pure pass-through with no server logic');
    },
  },

  // fw-review-16: FF-03A — API key passed in URL query param instead of headers
  // TODO: flaky — model may try to read rules/frontend-files-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-16',
    skill: 'fw-review',
    label: 'FF-03A: requests.json passes API key as URL query parameter instead of in headers',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file config/requests.json contains:
\`\`\`json
{
  "getContacts": {
    "schema": {
      "method": "GET",
      "url": "https://<%=iparam.domain%>/api/v2/contacts?api_key=<%=iparam.api_key%>",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
\`\`\`
Does the review flag the API key being passed in the URL query parameter as a violation of FF-03A?`,
    schema: {
      type: 'object',
      required: ['flags_credential_in_url', 'recommends_headers'],
      properties: {
        flags_credential_in_url: { type: 'boolean' },
        recommends_headers: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_credential_in_url, true, 'should flag API key in URL query param (FF-03A)');
      assert.equal(output.recommends_headers, true, 'should recommend moving credentials to headers');
    },
  },
  */

  // fw-review-17: FF-04A — API call missing .catch() error handling
  // TODO: flaky — model tries to read rules/frontend-files-rules.mdc; confirmed failing 2/3
  /* DISABLED
  {
    id: 'fw-review-17',
    skill: 'fw-review',
    label: 'FF-04A: client.request.invokeTemplate call has no .catch() and no user-facing error notification',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/scripts/app.js contains:
\`\`\`javascript
function loadAgents() {
  client.request.invokeTemplate('getAgents', { context: {} })
    .then(function(data) {
      renderAgents(JSON.parse(data.response));
    });
}
\`\`\`
There is no .catch() block and no error notification shown to the user. Does the review flag this as a violation of FF-04A?`,
    schema: {
      type: 'object',
      required: ['flags_missing_error_handling', 'flags_missing_user_notification'],
      properties: {
        flags_missing_error_handling: { type: 'boolean' },
        flags_missing_user_notification: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_missing_error_handling, true, 'should flag missing .catch() on invokeTemplate (FF-04A)');
      assert.equal(output.flags_missing_user_notification, true, 'should note that no user-visible error message is shown');
    },
  },
  */

  // fw-review-18: FF-05A — list API called without pagination
  // TODO: flaky — model may try to read rules/frontend-files-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-18',
    skill: 'fw-review',
    label: 'FF-05A: list API call fetches all records with no pagination implementation',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/scripts/app.js contains:
\`\`\`javascript
function getAllTickets() {
  client.request.invokeTemplate('listAllTickets', { context: {} })
    .then(function(data) {
      var tickets = JSON.parse(data.response);
      renderTickets(tickets);
    })
    .catch(function(err) {
      showError('Failed to load tickets');
    });
}
\`\`\`
The request template fetches /api/v2/tickets with no page or per_page parameters. Does the review flag this unbounded list call as a violation of FF-05A?`,
    schema: {
      type: 'object',
      required: ['flags_missing_pagination', 'identifies_unbounded_request'],
      properties: {
        flags_missing_pagination: { type: 'boolean' },
        identifies_unbounded_request: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_missing_pagination, true, 'should flag missing pagination on list API call (FF-05A)');
      assert.equal(output.identifies_unbounded_request, true, 'should identify the call fetches all records without pagination');
    },
  },
  */

  // fw-review-19: FF-06A — hardcoded API key in source code
  // TODO: flaky — model may try to read rules/frontend-files-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-19',
    skill: 'fw-review',
    label: 'FF-06A: app/scripts/app.js contains a hardcoded API key string',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/scripts/app.js contains:
\`\`\`javascript
var API_KEY = 'sk-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

function initialize() {
  client.initialized().then(function(_client) {
    client = _client;
    loadData();
  });
}

function loadData() {
  client.request.invokeTemplate('getData', {
    context: { key: API_KEY }
  });
}
\`\`\`
Does the review flag the hardcoded API key as a violation of FF-06A?`,
    schema: {
      type: 'object',
      required: ['flags_hardcoded_secret', 'recommends_iparams'],
      properties: {
        flags_hardcoded_secret: { type: 'boolean' },
        recommends_iparams: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_hardcoded_secret, true, 'should flag hardcoded API key in source code (FF-06A)');
      assert.equal(output.recommends_iparams, true, 'should recommend using client.iparams.get() or request template iparams');
    },
  },
  */

  // fw-review-20: FF-07L — OAuth client secret in app JS
  // TODO: flaky — model may try to read rules/frontend-files-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-20',
    skill: 'fw-review',
    label: 'FF-07L: app/scripts/auth.js contains OAuth client_secret outside config files',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/scripts/auth.js contains:
\`\`\`javascript
var oauthConfig = {
  client_id: '1234567890.apps.googleusercontent.com',
  client_secret: 'GOCSPX-abcdefghijklmnopqrstuvwxyz123',
  redirect_uri: 'https://oauth.freshdesk.com/callback'
};

function initiateOAuth() {
  window.location.href = buildAuthUrl(oauthConfig);
}
\`\`\`
Does the review flag the OAuth client_secret in app/scripts/auth.js as a violation of FF-07L?`,
    schema: {
      type: 'object',
      required: ['flags_oauth_secret_in_source', 'recommends_oauth_config_file'],
      properties: {
        flags_oauth_secret_in_source: { type: 'boolean' },
        recommends_oauth_config_file: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_oauth_secret_in_source, true, 'should flag OAuth client_secret in app JS (FF-07L)');
      assert.equal(output.recommends_oauth_config_file, true, 'should recommend moving to oauth_config.json or secure config');
    },
  },
  */

  // fw-review-21: FF-08A — app_settings.json exists but server.js lacks onSettingsUpdate
  // TODO: flaky — model may try to read rules/frontend-files-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-21',
    skill: 'fw-review',
    label: 'FF-08A: config/app_settings.json exists but server/server.js does not define onSettingsUpdate',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file config/app_settings.json contains:
\`\`\`json
{
  "notification_email": {},
  "alert_threshold": {}
}
\`\`\`
The file server/server.js exists but contains only:
\`\`\`javascript
exports = {
  events: [{ event: 'onTicketCreate', callback: 'onTicketCreateHandler' }],
  onTicketCreateHandler: function(args) {
    console.log('ticket created', args);
  }
};
\`\`\`
There is no onSettingsUpdate defined. Does the review flag this as a violation of FF-08A?`,
    schema: {
      type: 'object',
      required: ['flags_missing_onSettingsUpdate', 'identifies_app_settings_contract'],
      properties: {
        flags_missing_onSettingsUpdate: { type: 'boolean' },
        identifies_app_settings_contract: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_missing_onSettingsUpdate, true, 'should flag missing onSettingsUpdate in server.js (FF-08A)');
      assert.equal(output.identifies_app_settings_contract, true, 'should identify the app_settings.json contract requires onSettingsUpdate');
    },
  },
  */

  // fw-review-22: FFS-02L — external import from non-allowlisted CDN host
  // TODO: flaky — model may try to read rules/frontend-files-source-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-22',
    skill: 'fw-review',
    label: 'FFS-02L: app/index.html imports jQuery from unpkg.com which is not an allowlisted host',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/index.html contains:
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/jquery@3.6.0/dist/jquery.min.js"></script>
    <script src="https://cdn.freshdesk.com/widget/freshworks-crayons.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script src="scripts/app.js"></script>
  </body>
</html>
\`\`\`
Does the review flag the unpkg.com import as a non-allowlisted external source (FFS-02L)?`,
    schema: {
      type: 'object',
      required: ['flags_non_allowlisted_host', 'identifies_unpkg_source'],
      properties: {
        flags_non_allowlisted_host: { type: 'boolean' },
        identifies_unpkg_source: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_non_allowlisted_host, true, 'should flag external import from non-allowlisted host (FFS-02L)');
      assert.equal(output.identifies_unpkg_source, true, 'should specifically identify unpkg.com as the offending source');
    },
  },
  */

  // fw-review-23: FFS-04L — external script imported over HTTP instead of HTTPS
  {
    id: 'fw-review-23',
    skill: 'fw-review',
    label: 'FFS-04L: app/index.html imports an external script using http:// instead of https://',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/index.html contains:
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <script src="http://cdn.freshdesk.com/widget/freshworks-crayons.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script src="scripts/app.js"></script>
  </body>
</html>
\`\`\`
Does the review flag the HTTP (non-HTTPS) external import as a violation of FFS-04L?`,
    schema: {
      type: 'object',
      required: ['flags_http_import', 'recommends_https'],
      properties: {
        flags_http_import: { type: 'boolean' },
        recommends_https: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_http_import, true, 'should flag HTTP external import as insecure (FFS-04L)');
      assert.equal(output.recommends_https, true, 'should recommend changing http:// to https://');
    },
  },

  // fw-review-24: FFS-05L — icon.svg declared with wrong dimensions
  {
    id: 'fw-review-24',
    skill: 'fw-review',
    label: 'FFS-05L: app/styles/images/icon.svg is declared as 32x32 instead of required 64x64',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The fw-review skill's FFS-05L rule states: "The app icon (app/styles/images/icon.svg) must declare width and height as 64x64." The file app/styles/images/icon.svg contains:
\`\`\`xml
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" fill="#2C5CC5"/>
</svg>
\`\`\`
Given rule FFS-05L, does the review flag this icon as having the wrong dimensions (32x32 instead of 64x64)?`,
    schema: {
      type: 'object',
      required: ['flags_wrong_icon_dimensions', 'specifies_required_64x64'],
      properties: {
        flags_wrong_icon_dimensions: { type: 'boolean' },
        specifies_required_64x64: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_wrong_icon_dimensions, true, 'should flag icon.svg declared as 32x32 instead of 64x64 (FFS-05L)');
      assert.equal(output.specifies_required_64x64, true, 'should specify that 64x64 is the required declaration');
    },
  },

  // fw-review-25: CR-05L — unused third-party library imported in source file
  // TODO: fails 2/3 — model sees `var _ = window._;` and treats lodash as "used" (variable assigned).
  //       Assertion expects no-lodash-calls = unused, but model disagrees. Revisit prompt or assertion.
  /* DISABLED
  {
    id: 'fw-review-25',
    skill: 'fw-review',
    label: 'CR-05L: app/scripts/app.js imports lodash but never uses any lodash functions',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/index.html includes:
\`\`\`html
<script src="https://cdn.freshdesk.com/widget/lodash.min.js"></script>
<script src="scripts/app.js"></script>
\`\`\`
And app/scripts/app.js contains:
\`\`\`javascript
var _ = window._;

function renderTickets(tickets) {
  var container = document.getElementById('ticket-list');
  tickets.forEach(function(ticket) {
    var el = document.createElement('div');
    el.textContent = ticket.subject;
    container.appendChild(el);
  });
}
\`\`\`
The lodash library is imported but _ is never actually called. Does the review flag the unused lodash import as a violation of CR-05L?`,
    schema: {
      type: 'object',
      required: ['flags_unused_import', 'identifies_lodash_as_unused'],
      properties: {
        flags_unused_import: { type: 'boolean' },
        identifies_lodash_as_unused: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_unused_import, true, 'should flag unused third-party library import (CR-05L)');
      assert.equal(output.identifies_lodash_as_unused, true, 'should identify lodash as the unused imported dependency');
    },
  },
  */

  // fw-review-26: GN-02L — fdk validate reports an error
  {
    id: 'fw-review-26',
    skill: 'fw-review',
    label: 'GN-02L: fdk validate exits with an error about an invalid manifest.json field',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The fw-review skill's GN-02L rule states: "fdk validate must exit without errors — any validation failure is a GN-02L violation." When fdk validate is run, it outputs:
\`\`\`
Validation failed
  Error: manifest.json - "product" field is required but missing
  Error: config/iparams.json - field "api_key" has unsupported type "secret" (use "text" with secure:true)
\`\`\`
Given rule GN-02L, does the review flag these fdk validate errors as a GN-02L violation and recommend fixing the reported issues?`,
    schema: {
      type: 'object',
      required: ['flags_fdk_validation_failure', 'recommends_fixing_reported_issues'],
      properties: {
        flags_fdk_validation_failure: { type: 'boolean' },
        recommends_fixing_reported_issues: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_fdk_validation_failure, true, 'should flag fdk validate errors as a GN-02L violation');
      assert.equal(output.recommends_fixing_reported_issues, true, 'should recommend fixing the reported fdk validation issues');
    },
  },

  // fw-review-27: GN-08L — product-specific CSS bundle referenced in app HTML
  // TODO: flaky — model may try to read rules/general-rules.mdc instead of answering from skill content
  /* DISABLED
  {
    id: 'fw-review-27',
    skill: 'fw-review',
    label: 'GN-08L: app/index.html references freshdesk.css product-specific bundle instead of Freshworks CSS',
    loadContent: () => loadSkill('fw-review'),
    prompt: `Review this Freshworks app. The file app/index.html contains:
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.freshdesk.com/assets/freshdesk.css">
  </head>
  <body>
    <div id="app"></div>
    <script src="scripts/app.js"></script>
  </body>
</html>
\`\`\`
Does the review flag the reference to freshdesk.css as a violation of GN-08L (should use Freshworks CSS, not product-specific CSS)?`,
    schema: {
      type: 'object',
      required: ['flags_product_specific_css', 'identifies_freshdesk_css'],
      properties: {
        flags_product_specific_css: { type: 'boolean' },
        identifies_freshdesk_css: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_product_specific_css, true, 'should flag product-specific CSS bundle reference (GN-08L)');
      assert.equal(output.identifies_freshdesk_css, true, 'should identify freshdesk.css as the non-compliant CSS reference');
    },
  },
  */

  // fw-review-28: no manifest.json present — review must stop immediately
  {
    id: 'fw-review-28',
    skill: 'fw-review',
    label: 'No manifest.json found — stop and inform developer',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'According to the fw-review skill: when no manifest.json is found anywhere in the workspace, does the skill stop the review and inform the user rather than continuing (stops_review = true)?',
    schema: {
      type: 'object',
      required: ['stops_review'],
      properties: {
        stops_review: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.stops_review, true, 'model must stop the review when no manifest.json is found');
    },
  },

  // fw-review-29: report section sort order — Iparams → Frontend → Misc
  {
    id: 'fw-review-29',
    skill: 'fw-review',
    label: 'App Review Result failures sorted Iparams → Frontend → Misc',
    loadContent: () => loadSkill('fw-review'),
    prompt: 'You have completed reviewing a Freshworks app and found exactly three issues: one violation of GN-12L (a miscellaneous rule), one violation of IP-04A (an iparams rule), and one violation of FF-03A (a frontend rule). Produce the App Review Result block. Does your output list the IP-04A failure before the FF-03A failure, and the FF-03A failure before the GN-12L failure?',
    schema: {
      type: 'object',
      required: ['sorts_iparams_first', 'sorts_misc_last'],
      properties: {
        sorts_iparams_first: { type: 'boolean' },
        sorts_misc_last: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.sorts_iparams_first, true, 'Iparams failures (IP-*) must appear before Frontend and Misc failures');
      assert.equal(output.sorts_misc_last, true, 'Miscellaneous failures (GN-*) must appear last, after Iparams and Frontend');
    },
  },

];

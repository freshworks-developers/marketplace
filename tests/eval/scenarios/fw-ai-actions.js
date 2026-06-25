import assert from 'node:assert/strict';
import { loadSkill, loadCommand, loadSpec, loadSkillWithSpec, loadRule } from '../scenario-helpers.js';
export const FW_AI_ACTIONS_SCENARIOS = [
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

  // fw-ai-actions-10: fw-setup-status prerequisite before building AI Actions app
  {
    id: 'fw-ai-actions-10',
    skill: 'fw-ai-actions-app',
    label: 'fw-setup-status prerequisite before building AI Actions app',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'Developer asks you to build an AI Actions integration. You have NOT checked the toolchain yet. What is the prerequisite check you must run before creating any files?',
    schema: {
      type: 'object',
      required: ['runs_fw_setup_status_first', 'proceeds_without_toolchain_check'],
      properties: {
        runs_fw_setup_status_first: { type: 'boolean' },
        proceeds_without_toolchain_check: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.runs_fw_setup_status_first, true, 'must run fw-setup-status before creating any files');
      assert.equal(output.proceeds_without_toolchain_check, false, 'must NOT proceed without checking toolchain first');
    },
  },

  // fw-ai-actions-11: actions.json description field — keep concise for LLM tool selection
  {
    id: 'fw-ai-actions-11',
    skill: 'fw-ai-actions-app',
    label: 'actions.json description field — must be concise (<200 chars) for LLM tool selection',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: "You are writing the 'description' field for an AI action. The developer asks for a 500-character description. Should you write a 500-character description, or keep it concise (under 200 chars) for reliable LLM tool selection?",
    schema: {
      type: 'object',
      required: ['writes_long_description', 'keeps_description_concise'],
      properties: {
        writes_long_description: { type: 'boolean' },
        keeps_description_concise: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_long_description, false, 'must NOT write a 500-char description that hurts LLM tool selection');
      assert.equal(output.keeps_description_concise, true, 'must keep description concise (under 200 chars) for reliable LLM tool selection');
    },
  },

  // fw-ai-actions-12: test_data directory with sample JSON fixtures created for each action
  {
    id: 'fw-ai-actions-12',
    skill: 'fw-ai-actions-app',
    label: 'Generates test_data/ directory with sample JSON fixtures for each action',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'Create an AI actions app for Freshservice with two actions: getTicket (takes ticket_id as integer) and createNote (takes ticket_id as integer and note_body as string). Generate the complete app structure including all required files.',
    schema: {
      type: 'object',
      required: ['creates_test_data_dir', 'includes_sample_json_fixtures'],
      properties: {
        creates_test_data_dir: { type: 'boolean' },
        includes_sample_json_fixtures: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.creates_test_data_dir, true, 'model must create server/test_data/ directory');
      assert.equal(output.includes_sample_json_fixtures, true, 'model must include sample JSON fixture files for each action under test_data/');
    },
  },

  // fw-ai-actions-13: manifest.json includes modules section with ai_actions config
  {
    id: 'fw-ai-actions-13',
    skill: 'fw-ai-actions-app',
    label: 'manifest.json includes modules section with ai_actions configuration',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'Build an AI actions app for Freshdesk that creates a support ticket from a customer email. The action is called createTicketFromEmail and takes email_subject (string), email_body (string), and customer_email (string). Generate the manifest.json for this app.',
    schema: {
      type: 'object',
      required: ['includes_modules_section', 'includes_ai_actions_config'],
      properties: {
        includes_modules_section: { type: 'boolean' },
        includes_ai_actions_config: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.includes_modules_section, true, 'manifest.json must include a modules section');
      assert.equal(output.includes_ai_actions_config, true, 'manifest.json modules section must include ai_actions or invocationEvent configuration');
    },
  },

  // fw-ai-actions-14: broken endpoint detection — model surfaces 404 and does not proceed
  {
    id: 'fw-ai-actions-14',
    skill: 'fw-ai-actions-app',
    label: 'Surfaces broken external API endpoint and does not proceed with integration',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'According to the fw-ai-actions skill: when an external API endpoint consistently returns 404 Not Found (the endpoint appears broken or non-existent), should the skill surface this as a broken endpoint issue (surfaces_broken_endpoint = true) and NOT proceed with building the integration assuming the endpoint works (does_not_assume_endpoint_works = true)?',
    schema: {
      type: 'object',
      required: ['surfaces_broken_endpoint', 'does_not_assume_endpoint_works'],
      properties: {
        surfaces_broken_endpoint: { type: 'boolean' },
        does_not_assume_endpoint_works: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.surfaces_broken_endpoint, true, 'model must clearly surface the broken endpoint in its response');
      assert.equal(output.does_not_assume_endpoint_works, true, 'model must not proceed with integration assuming the 404 endpoint works');
    },
  },

  // fw-ai-actions-15: README.md generated documenting actions and parameters
  {
    id: 'fw-ai-actions-15',
    skill: 'fw-ai-actions-app',
    label: 'Generates README.md documenting available actions and their parameters',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'Create a complete AI actions app for Freshservice that integrates with PagerDuty. It should have two actions: triggerIncident (takes service_id as string and incident_title as string) and resolveIncident (takes incident_id as string). Generate all required files for the app.',
    schema: {
      type: 'object',
      required: ['generates_readme', 'documents_actions_in_readme'],
      properties: {
        generates_readme: { type: 'boolean' },
        documents_actions_in_readme: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.generates_readme, true, 'model must generate a README.md file for the app');
      assert.equal(output.documents_actions_in_readme, true, 'README.md must document the available actions and their parameters');
    },
  },

  // fw-ai-actions-16: flags missing test_data/ as a blocking issue during review
  {
    id: 'fw-ai-actions-16',
    skill: 'fw-ai-actions-app',
    label: 'Flags absence of test_data/ directory as a blocking issue during app review',
    loadContent: () => Promise.all([loadSkill('fw-ai-actions-app'), loadRule('fw-ai-actions-app', 'rules/ai-actions-test-data')]).then(parts => parts.join('\n\n---\n\n')),
    prompt: 'The fw-ai-actions rules are loaded above. An app has this structure: actions.json, manifest.json, server/server.js, config/requests.json, config/iparams.json — but NO server/test_data/ directory. actions.json defines two actions: getAsset and updateAsset. Based on the loaded rules: (1) should this missing test_data/ directory be flagged as an issue (flags_missing_test_data = true)? (2) is this a blocking issue that must be fixed before the app is complete (is_blocking = true)?',
    schema: {
      type: 'object',
      required: ['flags_missing_test_data', 'is_blocking'],
      properties: {
        flags_missing_test_data: { type: 'boolean' },
        is_blocking: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.flags_missing_test_data, true, 'model must flag the missing test_data/ directory as an issue');
      assert.equal(output.is_blocking, true, 'model must treat the missing test_data/ directory as a blocking issue');
    },
  },

  {
    id: 'fw-ai-actions-17',
    skill: 'fw-ai-actions-app',
    label: 'scoping from CSV/spec → actions.json entries match spec exactly, no extras added',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'According to the fw-ai-actions skill scoping rules: a CSV spec defines exactly 3 actions — create_ticket, update_ticket, close_ticket. Should the resulting actions.json contain exactly those 3 entries and no others (actions_json_reflects_spec = true, adds_unspecified_actions = false)?',
    schema: {
      type: 'object',
      required: ['actions_json_reflects_spec', 'adds_unspecified_actions'],
      properties: {
        actions_json_reflects_spec: { type: 'boolean' },
        adds_unspecified_actions: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.actions_json_reflects_spec, true, 'actions.json must contain exactly the entries defined in the spec');
      assert.equal(output.adds_unspecified_actions, false, 'must not add actions that are not in the spec');
    },
  },

  {
    id: 'fw-ai-actions-18',
    skill: 'fw-ai-actions-app',
    label: 'README.md created when documenting AI actions integration',
    loadContent: () => loadSkill('fw-ai-actions-app'),
    prompt: 'According to the fw-ai-actions skill: creating a README.md is explicitly marked as MANDATORY after implementing an AI actions integration. Based on that rule: is creates_readme = true and skips_readme = false?',
    schema: {
      type: 'object',
      required: ['creates_readme', 'skips_readme'],
      properties: {
        creates_readme: { type: 'boolean' },
        skips_readme: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.creates_readme, true, 'must create README.md when documenting the integration');
      assert.equal(output.skips_readme, false, 'must not skip README creation for AI actions integration');
    },
  },

];

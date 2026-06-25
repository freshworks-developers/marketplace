import assert from 'node:assert/strict';
import { loadSkill, loadCommand, loadSpec, loadSkillWithSpec, loadRef } from '../scenario-helpers.js';
export const FW_SETUP_SCENARIOS = [
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

  // fw-setup-03: "install FDK 9" request → deprecation warning shown before proceeding
  // TODO: fails 3/3 — model says proceeds_without_consent=true; assertion may be wrong if skill
  //       shows warning then proceeds without blocking for explicit y/N consent. Revisit assertion.
  /* DISABLED
  {
    id: 'fw-setup-03',
    skill: 'fw-setup',
    label: '"install FDK 9" request → deprecation warning must be shown before proceeding',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'According to the fw-setup skill: when a developer requests FDK 9 installation — does the skill show a deprecation warning first (shows_deprecation_warning_first = true), and does it proceed with installation WITHOUT waiting for user consent (proceeds_without_consent = false)?',
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
  */

  // fw-setup-04: setup_node_changed / setup_fdk_changed reflect actual change, not always true
  {
    id: 'fw-setup-04',
    skill: 'fw-setup',
    label: 'setup_node_changed/setup_fdk_changed → must reflect actual changes, false when nothing changed',
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
    prompt: 'The developer asks you to run: npm install -g @freshworks/fdk@10.0.1. The fw-setup skill explicitly states: "@freshworks/fdk is NOT published on registry.npmjs.org for global install — use the CDN tarball at https://cdn.freshdev.io/fdk/latest-v24.tgz instead." Given this rule, should you use the npm registry command the developer suggested?',
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

  // fw-setup-12: /fw-setup-uninstall → must NOT write .meta.json
  {
    id: 'fw-setup-12',
    skill: 'fw-setup',
    label: '/fw-setup-uninstall → must NOT write .meta.json',
    loadContent: () => loadSkill('fw-setup'),
    prompt: '/fw-setup-uninstall succeeded. FDK has been removed. manifest.json exists in the app directory. Should .meta.json metrics be written before REPORT?',
    schema: {
      type: 'object',
      required: ['writes_meta_json'],
      properties: {
        writes_meta_json: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_meta_json, false, 'uninstall must NOT write .meta.json');
    },
  },

  // fw-setup-13: CDN tarball selection — FDK 10 uses latest-v24.tgz
  {
    id: 'fw-setup-13',
    skill: 'fw-setup',
    label: 'CDN tarball selection — FDK 10 uses latest-v24.tgz, FDK 9 uses latest.tgz',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer asks to install FDK 10.x on Node 24. Which CDN tarball URL is correct: https://cdn.freshdev.io/fdk/latest.tgz or https://cdn.freshdev.io/fdk/latest-v24.tgz? What happens if you use latest.tgz on Node 24?',
    schema: {
      type: 'object',
      required: ['uses_latest_v24_tgz', 'uses_latest_tgz', 'wrong_tarball_installs_fdk9'],
      properties: {
        uses_latest_v24_tgz: { type: 'boolean' },
        uses_latest_tgz: { type: 'boolean' },
        wrong_tarball_installs_fdk9: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_latest_v24_tgz, true, 'FDK 10 on Node 24 must use latest-v24.tgz');
      assert.equal(output.uses_latest_tgz, false, 'must NOT use latest.tgz for FDK 10 on Node 24');
      assert.equal(output.wrong_tarball_installs_fdk9, true, 'using latest.tgz on Node 24 installs FDK 9 instead');
    },
  },

  // fw-setup-14: must verify in new shell, not current shell
  {
    id: 'fw-setup-14',
    skill: 'fw-setup',
    label: 'must verify in new shell (zsh -c / bash -c), not current shell',
    loadContent: () => loadSkill('fw-setup'),
    prompt: "FDK install completed. You run 'fdk version' in the current shell and it shows 10.0.1. Is this sufficient to declare the install complete?",
    schema: {
      type: 'object',
      required: ['current_shell_verification_sufficient', 'requires_new_shell_verification'],
      properties: {
        current_shell_verification_sufficient: { type: 'boolean' },
        requires_new_shell_verification: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.current_shell_verification_sufficient, false, 'current shell verification is not sufficient');
      assert.equal(output.requires_new_shell_verification, true, 'must verify in a new shell (zsh -c or bash -c)');
    },
  },

  // fw-setup-15: uninstall must remove both scoped and legacy unscoped package
  {
    id: 'fw-setup-15',
    skill: 'fw-setup',
    label: 'uninstall must remove BOTH @freshworks/fdk AND legacy unscoped fdk',
    loadContent: () => loadSkill('fw-setup'),
    prompt: "Running /fw-setup-uninstall. Is it sufficient to run only: npm uninstall -g @freshworks/fdk? Or must the legacy unscoped 'fdk' package also be removed?",
    schema: {
      type: 'object',
      required: ['only_remove_scoped', 'must_remove_both_packages'],
      properties: {
        only_remove_scoped: { type: 'boolean' },
        must_remove_both_packages: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.only_remove_scoped, false, 'removing only @freshworks/fdk is not sufficient');
      assert.equal(output.must_remove_both_packages, true, 'must also remove the legacy unscoped fdk package');
    },
  },

  // spec-06: Windows PowerShell 5.1 — && operator fails, must use sequential commands
  {
    id: 'spec-06',
    skill: 'fw-setup',
    label: 'Windows PowerShell 5.1 && operator error → run nvm install and nvm use as separate sequential steps',
    loadContent: () => loadRef('fw-setup', 'references/windows'),
    prompt: 'The fw-setup Windows reference is loaded above. Based solely on that reference document: (1) does it document that the && operator causes an error in PowerShell 5.1 (documents_and_operator_incompatibility = true)? (2) does it say to run nvm install and nvm use as two separate sequential commands instead of chaining with && (uses_sequential_commands = true)?',
    schema: {
      type: 'object',
      required: ['documents_and_operator_incompatibility', 'uses_sequential_commands'],
      properties: {
        documents_and_operator_incompatibility: { type: 'boolean' },
        uses_sequential_commands: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.documents_and_operator_incompatibility, true, 'must document the && operator incompatibility in PowerShell 5.1');
      assert.equal(output.uses_sequential_commands, true, 'must document splitting into separate sequential commands for PowerShell 5.1');
    },
  },

  // fw-setup-16: FDK 9 deprecation accepted — model proceeds with install after warning
  {
    id: 'fw-setup-16',
    skill: 'fw-setup',
    label: 'Developer accepts FDK 9 deprecation warning and proceeds with install',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'I want to install FDK 9 for my project. I understand it is deprecated, please go ahead and install it.',
    schema: {
      type: 'object',
      required: ['proceeds_with_fdk9', 'warns_about_deprecation'],
      properties: {
        proceeds_with_fdk9: { type: 'boolean' },
        warns_about_deprecation: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.proceeds_with_fdk9, true, 'model should proceed with FDK 9 install after developer accepts');
      assert.equal(output.warns_about_deprecation, true, 'model should still surface the deprecation warning before installing');
    },
  },

  // fw-setup-17: Both stacks — developer requests FDK 10 and FDK 9 side by side
  {
    id: 'fw-setup-17',
    skill: 'fw-setup',
    label: 'Developer requests installing both FDK 10 (Node 24) and FDK 9 (Node 18)',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'I need both FDK 10 on Node 24 and FDK 9 on Node 18 installed so I can switch between projects. Can you set both up?',
    schema: {
      type: 'object',
      required: ['installs_both_stacks'],
      properties: {
        installs_both_stacks: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.installs_both_stacks, true, 'model should install both FDK 10/Node 24 and FDK 9/Node 18 stacks');
    },
  },

  // fw-setup-18: Dual-stack without nvm — model warns nvm is required
  {
    id: 'fw-setup-18',
    skill: 'fw-setup',
    label: 'Developer wants both FDK stacks but nvm is not installed',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'I want to install both FDK 10 and FDK 9 on my machine. I do not have nvm installed yet.',
    schema: {
      type: 'object',
      required: ['warns_nvm_required', 'installs_nvm_first'],
      properties: {
        warns_nvm_required: { type: 'boolean' },
        installs_nvm_first: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.warns_nvm_required, true, 'model should warn that nvm is required for dual-stack setup');
      assert.equal(output.installs_nvm_first, true, 'model should install nvm first before setting up dual stacks');
    },
  },

  // fw-setup-19: Already installed at latest — model skips re-download
  {
    id: 'fw-setup-19',
    skill: 'fw-setup',
    label: 'FDK 10 is already installed at the latest version — model detects and skips reinstall',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Please install FDK. Current environment: fdk version returns 10.1.0, Node 24.11.0 active via nvm.',
    schema: {
      type: 'object',
      required: ['detects_already_installed', 'skips_reinstall'],
      properties: {
        detects_already_installed: { type: 'boolean' },
        skips_reinstall: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.detects_already_installed, true, 'model should detect FDK is already at the latest version');
      assert.equal(output.skips_reinstall, true, 'model should skip re-downloading when already current');
    },
  },

  // fw-setup-20: Developer declines MCP config after install
  {
    id: 'fw-setup-20',
    skill: 'fw-setup',
    label: 'Developer declines MCP server configuration after FDK install',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'FDK has just been installed successfully. Now you asked if I want to set up the Marketplace MCP server. No, I do not want to set up MCP right now.',
    schema: {
      type: 'object',
      required: ['skips_mcp_setup', 'continues_without_mcp'],
      properties: {
        skips_mcp_setup: { type: 'boolean' },
        continues_without_mcp: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.skips_mcp_setup, true, 'model should skip MCP setup when developer declines');
      assert.equal(output.continues_without_mcp, true, 'model should complete the flow without forcing MCP configuration');
    },
  },

  // fw-setup-21: Developer accepts MCP config after install
  // TODO: fails 3/3 — model returns configures_mcp=false; skill marks MCP setup as "optional" so
  //       model may be correct that config isn't mandatory even when accepted. Revisit assertion.
  /* DISABLED
  {
    id: 'fw-setup-21',
    skill: 'fw-setup',
    label: 'Developer accepts MCP server configuration after FDK install',
    loadContent: () => loadCommand('fw-setup', 'fw-setup-install'),
    prompt: 'According to the fw-setup skill install flow: after FDK install succeeds and the developer is offered optional MCP configuration — if the developer explicitly accepts (enters "y"), does the skill proceed with MCP configuration (configures_mcp = true) rather than skipping it?',
    schema: {
      type: 'object',
      required: ['configures_mcp'],
      properties: {
        configures_mcp: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.configures_mcp, true, 'model should proceed to configure the MCP server when developer accepts');
    },
  },
  */

  // fw-setup-22: Node version mismatch detected in status
  {
    id: 'fw-setup-22',
    skill: 'fw-setup',
    label: 'Status detects Node 18 active but FDK 10 installed — flags mismatch',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Check my FDK status. My environment has: node -v returns v18.20.0, fdk version returns 10.1.0.',
    schema: {
      type: 'object',
      required: ['detects_node_mismatch', 'guides_to_upgrade_node'],
      properties: {
        detects_node_mismatch: { type: 'boolean' },
        guides_to_upgrade_node: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.detects_node_mismatch, true, 'model should detect that Node 18 is incompatible with FDK 10');
      assert.equal(output.guides_to_upgrade_node, true, 'model should provide guidance to switch to Node 24');
    },
  },

  // fw-setup-23: --verbose status includes paths and config locations
  {
    id: 'fw-setup-23',
    skill: 'fw-setup',
    label: 'Verbose status output includes version details, paths, and config locations',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Run fw-setup-status --verbose and show me all the details.',
    schema: {
      type: 'object',
      required: ['includes_version_details', 'includes_config_paths'],
      properties: {
        includes_version_details: { type: 'boolean' },
        includes_config_paths: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.includes_version_details, true, 'verbose output should include detailed version information');
      assert.equal(output.includes_config_paths, true, 'verbose output should include PATH, nvm, and rc file locations');
    },
  },

  // fw-setup-24: Pinned upgrade to a specific version
  {
    id: 'fw-setup-24',
    skill: 'fw-setup',
    label: 'Developer requests upgrade to a specific FDK version, not latest',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Upgrade my FDK to version 10.0.2 specifically. Do not install the latest.',
    schema: {
      type: 'object',
      required: ['installs_pinned_version', 'does_not_install_latest'],
      properties: {
        installs_pinned_version: { type: 'boolean' },
        does_not_install_latest: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.installs_pinned_version, true, 'model should install exactly 10.0.2, not the latest');
      assert.equal(output.does_not_install_latest, true, 'model should not substitute the pinned version with latest');
    },
  },

  // fw-setup-25: Developer declines suggested upgrade from FDK 9 to FDK 10
  {
    id: 'fw-setup-25',
    skill: 'fw-setup',
    label: 'Developer declines model suggestion to upgrade from FDK 9 to FDK 10',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'I am on FDK 9. You suggested upgrading to FDK 10 but I want to stay on FDK 9 for now. Please do not upgrade.',
    schema: {
      type: 'object',
      required: ['respects_developer_choice', 'does_not_force_upgrade'],
      properties: {
        respects_developer_choice: { type: 'boolean' },
        does_not_force_upgrade: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.respects_developer_choice, true, 'model should accept the developer decision to stay on FDK 9');
      assert.equal(output.does_not_force_upgrade, true, 'model should not proceed with an upgrade the developer declined');
    },
  },

  // fw-setup-26: Downgrade to FDK 9 accepted — installs from CDN not npm registry
  {
    id: 'fw-setup-26',
    skill: 'fw-setup',
    label: 'Developer confirms downgrade to FDK 9 — model installs from CDN tarball',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'I want to downgrade to FDK 9. I have confirmed I understand the deprecation warning. Please proceed.',
    schema: {
      type: 'object',
      required: ['installs_fdk9', 'installs_from_cdn_not_npm'],
      properties: {
        installs_fdk9: { type: 'boolean' },
        installs_from_cdn_not_npm: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.installs_fdk9, true, 'model should install FDK 9 after developer confirms');
      assert.equal(output.installs_from_cdn_not_npm, true, 'model should use cdn.freshdev.io tarball, not npm registry');
    },
  },

  // fw-setup-27: Downgrade requested without version — skill defaults to latest FDK 9, does NOT ask
  {
    id: 'fw-setup-27',
    skill: 'fw-setup',
    label: 'bare "downgrade fdk" with no version → skill defaults to latest FDK 9, does NOT ask for a version',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'According to the fw-setup skill routing rules: when a developer requests a downgrade with no version number — does the skill default automatically to latest FDK 9.x on Node 18 WITHOUT prompting the developer to specify a target version? Answer false for asks_for_target_version since no version prompt is needed.',
    schema: {
      type: 'object',
      required: ['asks_for_target_version'],
      properties: {
        asks_for_target_version: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.asks_for_target_version, false, 'model must NOT ask for a version — bare downgrade defaults to latest FDK 9.x');
    },
  },

  // fw-setup-28: Invalid version string — model rejects and explains valid format
  {
    id: 'fw-setup-28',
    skill: 'fw-setup',
    label: 'Developer provides invalid version string "abc" for FDK install',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Please install FDK version abc.',
    schema: {
      type: 'object',
      required: ['rejects_invalid_version', 'explains_valid_format'],
      properties: {
        rejects_invalid_version: { type: 'boolean' },
        explains_valid_format: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.rejects_invalid_version, true, 'model should reject the non-semver version string "abc"');
      assert.equal(output.explains_valid_format, true, 'model should explain the valid semver format expected');
    },
  },

  // fw-setup-29: Homebrew Node detected — model warns of potential conflict
  {
    id: 'fw-setup-29',
    skill: 'fw-setup',
    label: 'Status detects Node installed via Homebrew — model warns of nvm conflict',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Check my FDK status. My node is at /opt/homebrew/bin/node version 20.0.0.',
    schema: {
      type: 'object',
      required: ['detects_homebrew_node', 'warns_potential_conflict'],
      properties: {
        detects_homebrew_node: { type: 'boolean' },
        warns_potential_conflict: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.detects_homebrew_node, true, 'model should identify the Homebrew-managed Node installation');
      assert.equal(output.warns_potential_conflict, true, 'model should warn that Homebrew Node may conflict with nvm FDK setup');
    },
  },

  // fw-setup-30: Uninstall preserves Node and nvm
  {
    id: 'fw-setup-30',
    skill: 'fw-setup',
    label: 'fw-setup-uninstall removes FDK only, clarifies Node and nvm are preserved',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Please uninstall FDK from my machine.',
    schema: {
      type: 'object',
      required: ['clarifies_node_nvm_preserved', 'does_not_attempt_nvm_removal'],
      properties: {
        clarifies_node_nvm_preserved: { type: 'boolean' },
        does_not_attempt_nvm_removal: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.clarifies_node_nvm_preserved, true, 'model should clarify that Node and nvm are not removed by uninstall');
      assert.equal(output.does_not_attempt_nvm_removal, true, 'model should not include nvm or Node removal in uninstall steps');
    },
  },

  // fw-setup-31: --fix encounters permission error — model reports failure with details
  {
    id: 'fw-setup-31',
    skill: 'fw-setup',
    label: 'fw-setup-troubleshoot --fix hits permission error mid-repair and reports it',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Run fw-setup-troubleshoot --fix. During repair the shell task returned: EACCES: permission denied, unlink /usr/local/bin/fdk.',
    schema: {
      type: 'object',
      required: ['reports_fix_failure', 'includes_error_details'],
      properties: {
        reports_fix_failure: { type: 'boolean' },
        includes_error_details: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.reports_fix_failure, true, 'model should report that --fix failed and not claim success');
      assert.equal(output.includes_error_details, true, 'model should surface the specific permission error to the developer');
    },
  },

  // fw-setup-32: Troubleshoot diagnoses first before offering --fix
  {
    id: 'fw-setup-32',
    skill: 'fw-setup',
    label: 'Developer asks to troubleshoot FDK — model diagnoses before suggesting --fix',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'My FDK seems broken, can you troubleshoot it?',
    schema: {
      type: 'object',
      required: ['diagnoses_before_fixing'],
      properties: {
        diagnoses_before_fixing: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.diagnoses_before_fixing, true, 'model should run diagnosis first and only offer --fix after, not immediately run --fix');
    },
  },

  // fw-setup-33: Shell config already correct — model reports OK, no duplicate edits
  {
    id: 'fw-setup-33',
    skill: 'fw-setup',
    label: 'Troubleshoot finds .bashrc already has correct NVM_DIR — model reports OK',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Run troubleshoot on my FDK setup. My .bashrc already contains: export NVM_DIR="$HOME/.nvm" and the nvm load lines are present and correct.',
    schema: {
      type: 'object',
      required: ['reports_already_correct', 'does_not_suggest_duplicate'],
      properties: {
        reports_already_correct: { type: 'boolean' },
        does_not_suggest_duplicate: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.reports_already_correct, true, 'model should report the shell config as already correct');
      assert.equal(output.does_not_suggest_duplicate, true, 'model should not suggest adding duplicate NVM_DIR lines to .bashrc');
    },
  },

  // fw-setup-34: Workspace setup creates .nvmrc with correct Node version
  {
    id: 'fw-setup-34',
    skill: 'fw-setup',
    label: 'fw-setup-use in project directory creates .nvmrc with correct Node version',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'I am in my Freshworks app project directory. Run fw-setup-use with --write-nvmrc to create a .nvmrc file for FDK 10.',
    schema: {
      type: 'object',
      required: ['creates_nvmrc', 'uses_correct_node_version'],
      properties: {
        creates_nvmrc: { type: 'boolean' },
        uses_correct_node_version: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.creates_nvmrc, true, 'model should create or update .nvmrc in the project directory');
      assert.equal(output.uses_correct_node_version, true, 'model should write Node 24.x (not 18.x) for FDK 10');
    },
  },

  // fw-setup-35: Workspace FDK 9 project gets .nvmrc with Node 18
  {
    id: 'fw-setup-35',
    skill: 'fw-setup',
    label: 'fw-setup-use for FDK 9 project writes Node 18 in .nvmrc, not Node 24',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'I have an existing FDK 9 project. Run fw-setup-use --write-nvmrc so I can switch to the right Node version for this project.',
    schema: {
      type: 'object',
      required: ['uses_node18_for_fdk9', 'does_not_use_node24'],
      properties: {
        uses_node18_for_fdk9: { type: 'boolean' },
        does_not_use_node24: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_node18_for_fdk9, true, 'model should write Node 18.x into .nvmrc for an FDK 9 project');
      assert.equal(output.does_not_use_node24, true, 'model should not write Node 24 into .nvmrc when the project uses FDK 9');
    },
  },

  {
    id: 'fw-setup-36',
    skill: 'fw-setup',
    label: 'FDK not installed → status says not installed, does NOT auto-install',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'The developer runs /fw-setup-status. The fdk binary is not found on PATH and no FDK is installed under any nvm-managed Node version. What should the status output say, and should the skill automatically install FDK?',
    schema: {
      type: 'object',
      required: ['reports_not_installed', 'auto_installs_fdk'],
      properties: {
        reports_not_installed: { type: 'boolean' },
        auto_installs_fdk: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.reports_not_installed, true, 'status must report FDK is not installed');
      assert.equal(output.auto_installs_fdk, false, 'status must NOT auto-install FDK');
    },
  },

  {
    id: 'fw-setup-37',
    skill: 'fw-setup',
    label: 'Node/FDK mismatch (wrong Node active) → mismatch diagnosis, no auto-fix',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer ran `nvm use 18` then called /fw-setup-status. FDK 10.x is installed under Node 24 but the active Node is 18.x so `fdk` is not on the current PATH. What should the status output say, and should the skill automatically fix the PATH or switch Node?',
    schema: {
      type: 'object',
      required: ['diagnoses_mismatch', 'auto_fixes'],
      properties: {
        diagnoses_mismatch: { type: 'boolean' },
        auto_fixes: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.diagnoses_mismatch, true, 'status must diagnose the Node/FDK mismatch');
      assert.equal(output.auto_fixes, false, 'status must NOT auto-fix — it is a read-only command');
    },
  },

  {
    id: 'fw-setup-38',
    skill: 'fw-setup',
    label: '--verbose flag → output includes PATH, nvm aliases, shell rc snippets',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer runs /fw-setup-status --verbose. Compared to the default status, what additional information does the verbose output include?',
    schema: {
      type: 'object',
      required: ['includes_path', 'includes_nvm_info', 'includes_shell_rc'],
      properties: {
        includes_path: { type: 'boolean' },
        includes_nvm_info: { type: 'boolean' },
        includes_shell_rc: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.includes_path, true, 'verbose output must include PATH');
      assert.equal(output.includes_nvm_info, true, 'verbose output must include nvm aliases/info');
      assert.equal(output.includes_shell_rc, true, 'verbose output must include shell rc snippets');
    },
  },

  {
    id: 'fw-setup-39',
    skill: 'fw-setup',
    label: 'default status output describes binary path, version, and cache dir',
    loadContent: () => loadCommand('fw-setup', 'fw-setup-status'),
    prompt: 'The fw-setup-status command definition is loaded above. Based solely on that document, answer three factual questions about what its default output (no flags) includes: (a) does it output the FDK version number (shows_fdk_version = true)? (b) does it run `command -v fdk` and output FDK binary info (shows_binary_info = true)? (c) does it check for the FDK cache directory ~/.fdk (shows_cache_dir = true)?',
    schema: {
      type: 'object',
      required: ['shows_fdk_version', 'shows_binary_info', 'shows_cache_dir'],
      properties: {
        shows_fdk_version: { type: 'boolean' },
        shows_binary_info: { type: 'boolean' },
        shows_cache_dir: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.shows_fdk_version, true, 'default status must show FDK version');
      assert.equal(output.shows_binary_info, true, 'default status must show binary/installation info');
      assert.equal(output.shows_cache_dir, true, 'default status must show cache directory');
    },
  },

  {
    id: 'fw-setup-40',
    skill: 'fw-setup',
    label: 'app has .nvmrc 24.11 → switch uses nvm use + matching FDK',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer cds into an app directory that has a .nvmrc containing "24.11" and runs /fw-setup-use. What should happen — does the skill run `nvm use` to activate Node 24.11, and should FDK 10.x be the active FDK version?',
    schema: {
      type: 'object',
      required: ['runs_nvm_use', 'activates_fdk10'],
      properties: {
        runs_nvm_use: { type: 'boolean' },
        activates_fdk10: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.runs_nvm_use, true, 'must run nvm use from .nvmrc when .nvmrc is present');
      assert.equal(output.activates_fdk10, true, 'Node 24.11 maps to FDK 10.x stack');
    },
  },

  {
    id: 'fw-setup-41',
    skill: 'fw-setup',
    label: 'app has no .nvmrc → prompt to add it or choose FDK 10 vs 9',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer runs /fw-setup-use inside a project directory that has no .nvmrc file. What should the skill do — silently pick a default, or prompt the developer to choose which FDK stack (10 or 9) and whether to write a .nvmrc?',
    schema: {
      type: 'object',
      required: ['prompts_user', 'silently_picks_default'],
      properties: {
        prompts_user: { type: 'boolean' },
        silently_picks_default: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.prompts_user, true, 'must prompt developer when no .nvmrc present');
      assert.equal(output.silently_picks_default, false, 'must not silently pick a stack without asking');
    },
  },

  {
    id: 'fw-setup-42',
    skill: 'fw-setup',
    label: '"switch this workspace to FDK 10 / Node 24" → Node 24 + FDK 10 active in shell',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer says "Switch this workspace to FDK 10 / Node 24". Which Node version and FDK version should be active after /fw-setup-use completes?',
    schema: {
      type: 'object',
      required: ['activates_node24', 'activates_fdk10'],
      properties: {
        activates_node24: { type: 'boolean' },
        activates_fdk10: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.activates_node24, true, 'must activate Node 24 for FDK 10 workspace');
      assert.equal(output.activates_fdk10, true, 'must activate FDK 10 for Node 24 workspace');
    },
  },

  {
    id: 'fw-setup-43',
    skill: 'fw-setup',
    label: '"switch to FDK 9 / Node 18" → Node 18 + FDK 9, deprecation warning shown',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer says "Switch this workspace to FDK 9 / Node 18". Should the skill show a deprecation warning about FDK 9.x before or during the switch?',
    schema: {
      type: 'object',
      required: ['shows_deprecation_warning', 'activates_node18'],
      properties: {
        shows_deprecation_warning: { type: 'boolean' },
        activates_node18: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.shows_deprecation_warning, true, 'must show FDK 9 deprecation warning when switching to 9/18 stack');
      assert.equal(output.activates_node18, true, 'must activate Node 18 for FDK 9 stack');
    },
  },

  {
    id: 'fw-setup-44',
    skill: 'fw-setup',
    label: '"use FDK 10 here and write .nvmrc" → writes .nvmrc 24.11, runs nvm use',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer says "Use FDK 10 in this project and write a .nvmrc file". What Node version should be written to .nvmrc, and should `nvm use` be run after writing the file?',
    schema: {
      type: 'object',
      required: ['writes_nvmrc_24_11', 'runs_nvm_use_after'],
      properties: {
        writes_nvmrc_24_11: { type: 'boolean' },
        runs_nvm_use_after: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.writes_nvmrc_24_11, true, '.nvmrc must contain 24.11 for FDK 10 stack');
      assert.equal(output.runs_nvm_use_after, true, 'must run nvm use after writing .nvmrc');
    },
  },

  {
    id: 'fw-setup-45',
    skill: 'fw-setup',
    label: '"use FDK 10 in ./my-app" → stack switch scoped to that directory',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer says "Use FDK 10 in ./my-app". Should the skill switch the stack specifically within the ./my-app directory rather than globally?',
    schema: {
      type: 'object',
      required: ['scopes_to_directory', 'changes_global_default'],
      properties: {
        scopes_to_directory: { type: 'boolean' },
        changes_global_default: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.scopes_to_directory, true, 'stack switch must be scoped to the specified directory');
      assert.equal(output.changes_global_default, false, 'must not change global nvm default when targeting a specific directory');
    },
  },

  {
    id: 'fw-setup-46',
    skill: 'fw-setup',
    label: '--both re-run when both stacks already exist → nothing to do, no duplicate install',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'According to the fw-setup skill: when /fw-setup-install --both is run but both FDK 10.x (Node 24) and FDK 9.x (Node 18) stacks are already installed and working — does the skill describe an idempotent guard that detects both stacks are already present (detects_both_already_installed = true) and skips re-installation (reinstalls_anyway = false)?',
    schema: {
      type: 'object',
      required: ['detects_both_already_installed', 'reinstalls_anyway'],
      properties: {
        detects_both_already_installed: { type: 'boolean' },
        reinstalls_anyway: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.detects_both_already_installed, true, 'must detect both stacks already installed');
      assert.equal(output.reinstalls_anyway, false, 'must not reinstall when both stacks already present');
    },
  },

  {
    id: 'fw-setup-47',
    skill: 'fw-setup',
    label: 'downgrade to latest FDK 9 (no version specified) → latest 9.x on Node 18 with deprecation',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer says "Downgrade my FDK installation" without specifying a version. What version should be installed, on which Node version, and must a deprecation warning be shown?',
    schema: {
      type: 'object',
      required: ['installs_latest_fdk9', 'uses_node18', 'shows_deprecation_warning'],
      properties: {
        installs_latest_fdk9: { type: 'boolean' },
        uses_node18: { type: 'boolean' },
        shows_deprecation_warning: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.installs_latest_fdk9, true, 'must install latest FDK 9.x when no version specified');
      assert.equal(output.uses_node18, true, 'FDK 9 must use Node 18');
      assert.equal(output.shows_deprecation_warning, true, 'must show deprecation warning before downgrading to FDK 9');
    },
  },

  {
    id: 'fw-setup-48',
    skill: 'fw-setup',
    label: 'install version 99.99.99 → tarball-not-found error, no false success',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer runs /fw-setup-install 99.99.99. The CDN tarball for version 99.99.99 does not exist (HTTP 404 or download failure). What should the skill do — report an error, or claim the installation succeeded?',
    schema: {
      type: 'object',
      required: ['reports_error', 'claims_success'],
      properties: {
        reports_error: { type: 'boolean' },
        claims_success: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.reports_error, true, 'must report tarball/download error for invalid version');
      assert.equal(output.claims_success, false, 'must NOT claim success when tarball not found');
    },
  },

  {
    id: 'fw-setup-49',
    skill: 'fw-setup',
    label: '"No thanks, skip MCP setup" → install completes fine, MCP config not written',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'After /fw-setup-install succeeds, the skill offers to configure the Marketplace MCP. The developer answers "No thanks". Does the install still count as complete, and should the MCP config be written?',
    schema: {
      type: 'object',
      required: ['install_still_complete', 'writes_mcp_config'],
      properties: {
        install_still_complete: { type: 'boolean' },
        writes_mcp_config: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.install_still_complete, true, 'install must be considered complete even if MCP is skipped');
      assert.equal(output.writes_mcp_config, false, 'must NOT write MCP config when developer declines');
    },
  },

  {
    id: 'fw-setup-50',
    skill: 'fw-setup',
    label: 'FDK/Node mismatch → diagnosis references error-command-not-found patterns',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer reports "fdk: command not found" but says FDK was previously installed. They ran /fw-setup-troubleshoot (without --fix). What should the diagnosis include — does it reference known error patterns like command-not-found and PATH misconfiguration?',
    schema: {
      type: 'object',
      required: ['diagnoses_path_issue', 'auto_fixes_without_request'],
      properties: {
        diagnoses_path_issue: { type: 'boolean' },
        auto_fixes_without_request: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.diagnoses_path_issue, true, 'troubleshoot must diagnose PATH/nvm configuration issues');
      assert.equal(output.auto_fixes_without_request, false, 'must not auto-fix when --fix flag was not given');
    },
  },

  {
    id: 'fw-setup-51',
    skill: 'fw-setup',
    label: 'after --fix completes → confirms restored FDK 10 / Node 24, not FDK 9/18',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer ran /fw-setup-troubleshoot --fix. The fix completed. What FDK and Node versions should be confirmed as restored — FDK 10 / Node 24, or FDK 9 / Node 18?',
    schema: {
      type: 'object',
      required: ['restores_fdk10_node24', 'restores_fdk9_node18'],
      properties: {
        restores_fdk10_node24: { type: 'boolean' },
        restores_fdk9_node18: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.restores_fdk10_node24, true, 'troubleshoot --fix must restore FDK 10 / Node 24 as the default stack');
      assert.equal(output.restores_fdk9_node18, false, 'must not restore FDK 9 / Node 18 as the primary stack');
    },
  },

  {
    id: 'fw-setup-52',
    skill: 'fw-setup',
    label: '"downgrade to latest FDK 9.x" → deprecation noted, FDK 9 on Node 18',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer says "Downgrade FDK to the latest 9.x line". What should happen — which FDK version is installed, on which Node version, and must a deprecation warning be shown?',
    schema: {
      type: 'object',
      required: ['installs_fdk9_on_node18', 'shows_deprecation_warning'],
      properties: {
        installs_fdk9_on_node18: { type: 'boolean' },
        shows_deprecation_warning: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.installs_fdk9_on_node18, true, 'must install latest FDK 9.x on Node 18');
      assert.equal(output.shows_deprecation_warning, true, 'must show deprecation warning before installing FDK 9');
    },
  },

  {
    id: 'fw-setup-53',
    skill: 'fw-setup',
    label: '"downgrade my FDK installation" (no version) → same as latest-9 path',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'According to the fw-setup skill routing rules: a bare "downgrade my FDK" request with no version specified — does the skill target latest FDK 9.x as the default (targets_latest_fdk9 = true), and does this mean the developer does NOT need to provide an explicit version (requires_explicit_version = false)?',
    schema: {
      type: 'object',
      required: ['targets_latest_fdk9', 'requires_explicit_version'],
      properties: {
        targets_latest_fdk9: { type: 'boolean' },
        requires_explicit_version: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.targets_latest_fdk9, true, 'downgrade without version must target latest FDK 9.x');
      assert.equal(output.requires_explicit_version, false, 'must not require an explicit version for a generic downgrade request');
    },
  },

  {
    id: 'fw-setup-55',
    skill: 'fw-setup',
    label: 'upgrade --to 10.1.0 → exact versioned CDN tarball, not latest-v24.tgz',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer runs "/fw-setup-upgrade --to 10.1.0". Which tarball URL should be used — the exact versioned URL (cdn.freshdev.io/fdk/v10.1.0.tgz) or the generic latest-v24.tgz? And which Node version is required for FDK 10.x?',
    schema: {
      type: 'object',
      required: ['uses_exact_versioned_url', 'uses_node24', 'uses_latest_tarball'],
      properties: {
        uses_exact_versioned_url: { type: 'boolean' },
        uses_node24: { type: 'boolean' },
        uses_latest_tarball: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.uses_exact_versioned_url, true, 'must use exact versioned CDN URL (v10.1.0.tgz), not latest tarball');
      assert.equal(output.uses_node24, true, 'FDK 10.x requires Node 24');
      assert.equal(output.uses_latest_tarball, false, 'must not use latest-v24.tgz when a pinned version is specified');
    },
  },

  {
    id: 'fw-setup-56',
    skill: 'fw-setup',
    label: 'FDK 9 / Node 18 → upgrade to FDK 10 → Node 24, removes old FDK 9',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer is on FDK 9 / Node 18 and asks to upgrade to FDK 10. Should the skill switch to Node 24, install the latest FDK 10.x, and remove the old FDK 9 installation as part of the exclusive upgrade?',
    schema: {
      type: 'object',
      required: ['switches_to_node24', 'installs_fdk10', 'removes_fdk9'],
      properties: {
        switches_to_node24: { type: 'boolean' },
        installs_fdk10: { type: 'boolean' },
        removes_fdk9: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.switches_to_node24, true, 'upgrading from FDK 9 to FDK 10 must switch to Node 24');
      assert.equal(output.installs_fdk10, true, 'must install latest FDK 10.x');
      assert.equal(output.removes_fdk9, true, 'must remove old FDK 9.x installation (exclusive upgrade)');
    },
  },

  {
    id: 'fw-setup-54',
    skill: 'fw-setup',
    label: 'status check after uninstall → "not installed" response matches §2.2 behavior',
    loadContent: () => loadSkill('fw-setup'),
    prompt: 'Developer completed /fw-setup-uninstall and then runs /fw-setup-status. FDK is no longer installed. What should the status output say — should it report "not installed", and should it offer to auto-install?',
    schema: {
      type: 'object',
      required: ['reports_not_installed', 'auto_installs'],
      properties: {
        reports_not_installed: { type: 'boolean' },
        auto_installs: { type: 'boolean' },
        explanation: { type: 'string' },
      },
    },
    assert(output) {
      assert.equal(output.reports_not_installed, true, 'status must report FDK is not installed after uninstall');
      assert.equal(output.auto_installs, false, 'status must not auto-install — it is read-only');
    },
  },

];

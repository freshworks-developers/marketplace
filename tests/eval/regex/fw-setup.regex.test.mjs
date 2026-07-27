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

async function readCmd(skillName, command) {
  return readFile(join(SKILLS_DIR, skillName, 'commands', `${command}.md`), 'utf8');
}

describe('Skill Regex Evals — fw-setup', { concurrency: true }, () => {
  // ─── fw-setup ────────────────────────────────────────────────────────────────

  test('fw-setup-01 /fw-setup-install succeeded + manifest.json present → write .meta.json before REPORT', async () => {
    const c = await readSkill('fw-setup');
    const ok = /meta-init\.sh/i.test(c) && /fw-setup-install/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must reference meta-init.sh and fw-setup-install');
  });

  test('fw-setup-02 /fw-setup-status → must NOT write .meta.json (read-only command)', async () => {
    const c = await readSkill('fw-setup');
    const ok = /Read-only commands.*\/fw-setup-status|fw-setup-status.*do not write|read-only.*fw-setup-status|fw-setup-status.*not write/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must mark fw-setup-status as read-only (no .meta.json write)');
  });

  test('fw-setup-03 "install FDK 9" request → deprecation warning must be shown before proceeding', async () => {
    const c = await readSkill('fw-setup');
    const ok = /deprecation|DEPRECATED|May 31, 2026/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document FDK 9 deprecation (May 31, 2026)');
  });

  test('fw-setup-04 metrics: setup_node_changed/setup_fdk_changed reflect actual change', async () => {
    const c = await readSkill('fw-setup');
    const ok = /setup_node_changed/i.test(c) && /setup_fdk_changed/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must define setup_node_changed and setup_fdk_changed metrics');
  });

  test('fw-setup-05 /fw-setup-upgrade succeeded + manifest present → write .meta.json before REPORT', async () => {
    const c = await readSkill('fw-setup');
    const ok = /fw-setup-upgrade/i.test(c) && /meta-init\.sh/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must include fw-setup-upgrade in the mutating commands that write .meta.json');
  });

  test('fw-setup-06 /fw-setup-troubleshoot without --fix → no .meta.json write', async () => {
    const c = await readSkill('fw-setup');
    const ok = /fw-setup-troubleshoot` without `--fix`\) do not write metrics|troubleshoot.*without.*--fix.*do not write|Read-only commands.*troubleshoot/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must mark fw-setup-troubleshoot (no --fix) as read-only');
  });

  test('fw-setup-07 /fw-setup-troubleshoot --fix → write .meta.json before REPORT', async () => {
    const c = await readSkill('fw-setup');
    const ok = /fw-setup-troubleshoot --fix/i.test(c) && /meta-init\.sh/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must include fw-setup-troubleshoot --fix in mutating commands');
  });

  test('fw-setup-08 npm install -g @freshworks/fdk → refuse, use CDN tarball', async () => {
    const c = await readSkill('fw-setup');
    const ok = /DO NOT use npm registry|NOT published on registry/i.test(c) && /cdn\.freshdev\.io/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must forbid npm registry and require cdn.freshdev.io');
  });

  test('fw-setup-09 /fw-setup-use → no .meta.json write (read-only stack switch)', async () => {
    const c = await readSkill('fw-setup');
    const ok = /fw-setup-use`/i.test(c) && /do not write metrics/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must mark fw-setup-use as non-mutating (no metrics write)');
  });

  test('fw-setup-10 /fw-setup-downgrade succeeded + manifest present → write .meta.json before REPORT', async () => {
    const c = await readSkill('fw-setup');
    const ok = /fw-setup-downgrade/i.test(c) && /\.meta\.json metrics write/i.test(c) && /DO NOT emit REPORT before/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must include fw-setup-downgrade in mutating commands and require meta write before REPORT');
  });

  test('fw-setup-11 /fw-setup-install succeeded, no manifest.json → skip .meta.json write', async () => {
    const c = await readSkill('fw-setup');
    const ok = /Skip only if no `manifest\.json`/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must state: skip .meta.json write if no manifest.json exists');
  });

  test('fw-setup-12 nvm ALWAYS required — never install Node globally, never sudo npm', async () => {
    const c = await readSkill('fw-setup');
    const ok = /Use nvm ALWAYS|NEVER install Node globally|NEVER use `sudo npm`/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require nvm and forbid global Node install / sudo npm');
  });

  test('fw-setup-13 CDN tarball names: latest-v24.tgz for FDK 10, latest.tgz for FDK 9', async () => {
    const c = await readSkill('fw-setup');
    const ok = /latest-v24\.tgz/i.test(c) && /latest\.tgz/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must specify latest-v24.tgz (FDK 10) and latest.tgz (FDK 9)');
  });

  test('fw-setup-14 new shell verification: zsh -c or bash -c — current shell insufficient', async () => {
    const c = await readSkill('fw-setup');
    const ok = /zsh -c|bash -c/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require zsh -c or bash -c for new-shell verification');
  });

  test('fw-setup-15 uninstall must remove both @freshworks/fdk AND legacy unscoped fdk package', async () => {
    const c = await readSkill('fw-setup');
    const ok = /npm uninstall -g.*fdk|unscoped/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require uninstalling both @freshworks/fdk and legacy unscoped fdk');
  });

  test('fw-setup-16 ~/.fdk cache directory must be removed on downgrade/uninstall', async () => {
    const c = await readSkill('fw-setup');
    const ok = /~\/\.fdk.*remov|remov.*~\/\.fdk|FDK Cache Directory Removal/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require removing ~/.fdk on downgrade/uninstall');
  });


  // fw-setup-17 and fw-setup-18: skill content pending — https://github.com/freshworks-developers/fw-dev-tools/issues/45
  test.skip('fw-setup-17 dual-stack FDK 10 + FDK 9 can coexist on same machine via nvm', async () => {
    const c = await readSkill('fw-setup');
    const ok = /coexist|dual.stack|Both.*FDK.*can/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document dual-stack coexistence via nvm');
  });

  test.skip('fw-setup-18 nvm required for dual-stack — must install nvm first if missing', async () => {
    const c = await readSkill('fw-setup');
    const ok = /nvm is required|nvm.*required.*install.*nvm first|install nvm first/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require nvm installation before dual-stack setup');
  });

  test('fw-setup-19 Node 24.11.x specificity — FDK 10.1+ requires Node 24.11.x not higher', async () => {
    const c = await readSkill('fw-setup');
    const ok = /24\.11|Node 24\.11/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must specify Node 24.11.x for FDK 10.x');
  });

  test('fw-setup-20 FDK 10.x + Node 24 is recommended; FDK 9.x + Node 18 is deprecated', async () => {
    const c = await readSkill('fw-setup');
    const ok = /FDK 10\.x.*Node 24.*Recommended|Recommended.*FDK 10/i.test(c) &&
      /FDK 9\.x.*deprecated|deprecated.*FDK 9/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must recommend FDK 10+Node 24 and mark FDK 9+Node 18 as deprecated');
  });

  test('fw-setup-21 shell config backup before modification: cp ~/.zshrc ~/.zshrc.bak', async () => {
    const c = await readSkill('fw-setup');
    const ok = /\.zshrc\.bak|shell config.*backup|backup.*shell config/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require shell config backup before modifications');
  });

  test('fw-setup-22 npm cache clean --force after uninstall to prevent reinstall issues', async () => {
    const c = await readSkill('fw-setup');
    const ok = /npm cache clean --force/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require npm cache clean --force after uninstall');
  });

  test('fw-setup-23 Windows: use where.exe (not where) and PowerShell for new-shell verification', async () => {
    const c = await readSkill('fw-setup');
    const ok = /where\.exe/i.test(c) && /PowerShell/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must reference where.exe and PowerShell for Windows verification');
  });

  test('fw-setup-24 ZERO TOLERANCE: never say installation complete with any verification failure', async () => {
    const c = await readSkill('fw-setup');
    const ok = /ZERO TOLERANCE|never.*say.*installation complete|NEVER say.*complete.*verification/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must state ZERO TOLERANCE for claiming success with verification failures');
  });

  test('fw-setup-25 publishing requires FDK 10.x — FDK 9.x cannot publish to marketplace', async () => {
    const c = await readSkill('fw-setup');
    const ok = /Publishing requires FDK 10|publish.*requires.*FDK 10|FDK 10.*required.*publishing/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must state that marketplace publishing requires FDK 10.x');
  });

  test('fw-setup-26 subagent shell Task for mutating ops: install, upgrade, downgrade, uninstall, troubleshoot --fix', async () => {
    const c = await readSkill('fw-setup');
    const ok = /Spawn.*shell.*Task|shell.*Task.*mutating|subagent.*shell/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require spawning shell Tasks for mutating operations');
  });

  test('fw-setup-27 slash-command closeout: Task ends after REPORT, no fdk run / fdk tunnel', async () => {
    const c = await readSkill('fw-setup');
    const ok = /Do not start `fdk run`|Do not.*start.*fdk run|fdk run.*not.*Task|Slash-command.*closeout/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must prohibit fdk run / fdk tunnel from install/upgrade Tasks');
  });

  test('fw-setup-28 nvm alias default must use numeric Node semver, not alias fdk', async () => {
    const c = await readSkill('fw-setup');
    const ok = /nvm alias default.*semver|nvm alias default.*Node semver|Numeric.*semver.*e\.g/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must require nvm alias default with numeric semver');
  });

  test('fw-setup-29 Homebrew tap correction: freshworks-developers/homebrew-tap not freshworks/tap', async () => {
    const c = await readSkill('fw-setup');
    const ok = /freshworks-developers\/homebrew-tap/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must reference correct Homebrew tap: freshworks-developers/homebrew-tap');
  });

  test('fw-setup-30 post-install MCP setup: offer Marketplace MCP after successful install/upgrade only', async () => {
    const c = await readSkill('fw-setup');
    const ok = /Post-install MCP|MCP.*after successful install|Marketplace MCP setup/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document offering MCP setup after successful install/upgrade');
  });

  test('fw-setup-31 fdk run non-blocking: use scripts/fw-setup-run-background.sh from app root', async () => {
    const c = await readSkill('fw-setup');
    const ok = /fw-setup-run-background\.sh/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must reference fw-setup-run-background.sh for non-blocking fdk run');
  });

  test('fw-setup-32 Windows PATH sanity: nvm-managed node must resolve before MSI/winget/choco node', async () => {
    const c = await readSkill('fw-setup');
    const ok = /PATH.*precedence|Installer-based setups|MSI.*winget.*choco.*scoop/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document Windows PATH precedence for nvm-managed node');
  });

  test('fw-setup-33 quick detect script: bash scripts/fw-setup-quick-detect.sh before spawning subagents', async () => {
    const c = await readSkill('fw-setup');
    const ok = /fw-setup-quick-detect\.sh/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must reference fw-setup-quick-detect.sh');
  });

  test('fw-setup-34 interactive troubleshooting SOP: ONE command at a time, wait for human output', async () => {
    const c = await readSkill('fw-setup');
    const ok = /ONE command at a time|step-by-step SOP|interactive-troubleshooting-guide/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must reference interactive troubleshooting SOP with ONE command at a time');
  });

  test('fw-setup-35 Windows: PowerShell 5.1 && operator limitation documented in windows.md reference', async () => {
    const c = await readSkill('fw-setup');
    const ok = /PowerShell.*&&|&&.*PowerShell 5\.1|references\/windows\.md.*&&/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document PowerShell && limitation and reference windows.md');
  });

  // ─── fw-setup alias / flag coverage ──────────────────────────────────────────

  test('fw-setup-36 /fdk-install legacy alias routes to /fw-setup-install', async () => {
    const c = await readSkill('fw-setup');
    const ok = /\/fdk-install.*legacy|legacy.*\/fdk-install/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document /fdk-install as a legacy alias for /fw-setup-install');
  });

  test('fw-setup-37 /fdk-status legacy alias routes to /fw-setup-status', async () => {
    const c = await readSkill('fw-setup');
    const ok = /\/fdk-status.*legacy|legacy.*\/fdk-status/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document /fdk-status as a legacy alias for /fw-setup-status');
  });

  test('fw-setup-38 /fdk-upgrade and /fdk-downgrade legacy aliases documented', async () => {
    const c = await readSkill('fw-setup');
    const hasUpgrade = /\/fdk-upgrade.*legacy|legacy.*\/fdk-upgrade/i.test(c);
    const hasDowngrade = /\/fdk-downgrade.*legacy|legacy.*\/fdk-downgrade/i.test(c);
    const ok = hasUpgrade && hasDowngrade;
    assert.ok(ok, 'fw-setup/SKILL.md must document /fdk-upgrade and /fdk-downgrade as legacy aliases');
  });

  test('fw-setup-39 /fdk-uninstall legacy alias documented', async () => {
    const c = await readSkill('fw-setup');
    const ok = /\/fdk-uninstall.*legacy|legacy.*\/fdk-uninstall/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md must document /fdk-uninstall as a legacy alias');
  });

  test('fw-setup-40 --both flag has idempotent guard — skips already-installed stacks', async () => {
    const c = await readCmd('fw-setup', 'fw-setup-install');
    const ok = /Both stacks already installed.*Nothing to do|Nothing to do.*both stacks|already installed.*skipping/i.test(c);
    assert.ok(ok, 'fw-setup-install.md must skip already-installed stacks when --both is re-run');
  });

  test('fw-setup-41 --version X.Y.Z pinned install documented in routing table', async () => {
    const c = await readSkill('fw-setup');
    const ok = /--version\s+X\.Y\.Z|--version.*X\.Y|optional version.*X\.Y/i.test(c);
    assert.ok(ok, 'fw-setup/SKILL.md routing table must document --version X.Y.Z for pinned installs');
  });

  test('fw-setup-42 post-install MCP setup is opt-in — user can skip it', async () => {
    const c = await readCmd('fw-setup', 'fw-setup-install');
    const ok = /Configure MCP now.*y\/N|y\/N.*Configure MCP|Skipped.*Configure MCP later/i.test(c);
    assert.ok(ok, 'fw-setup-install.md must offer MCP setup as opt-in with a y/N prompt so user can skip');
  });

});

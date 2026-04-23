---
name: fdk-setup
description: "Installs and manages Freshworks Development Kit (FDK) with Node.js via nvm for Platform 3.0 development. Supports FDK 10.x (Node 24, recommended) and FDK 9.x (Node 18, deprecated May 30, 2026). Slash commands: /fdk-setup-install (--version), /fdk-setup-upgrade (--to), /fdk-setup-downgrade, /fdk-setup-uninstall, /fdk-setup-status (--verbose), /fdk-setup-troubleshoot (--fix), /fdk-setup-use (workspace nvm + .nvmrc). Legacy /fdk-install, etc. Publishing requires FDK 10.x + Node 24."
compatibility: "Node.js 24.x (FDK 10.x) or Node.js 18.x (FDK 9.x), nvm, Platform 3.0"
argument-hint: "[install|upgrade|downgrade|uninstall|status] [version]"
allowed-tools: "shell, task, read, write, strreplace, glob, grep"
---

# FDK Setup

**MOST IMPORTANT - ZERO TOLERANCE: FDK installation is NEVER complete until verification shows FDK accessible globally AND persists across new shells. NEVER say "installation complete" with ANY verification failures.**

**MANDATORY ENFORCEMENT:** Verify every mutating operation (install, upgrade, downgrade, uninstall, and **`/fdk-setup-troubleshoot --fix`**) with actual shell tests. **`/fdk-setup-status`**, **`/fdk-setup-troubleshoot`** (no **`--fix`**), and **`/fdk-setup-use`** are non-Task flows (**`/fdk-setup-use`** may only add **`.nvmrc`** when the user asked for **`--write-nvmrc`**). Keep iterating until verification passes. No exceptions.

You are a Freshworks FDK installation and version management enforcement layer.

**Progressive disclosure:** For **per-project Node / FDK stack switching**, use **`commands/fdk-setup-use.md`** first, then `references/macos.md` / `references/cross-scenarios.md` for **`.nvmrc`** patterns. For complex multi-Node scenarios, PATH conflicts, or OS-specific installation issues, load `references/cross-scenarios.md`. For macOS-specific issues, load `references/macos.md`. For Windows-specific issues, load `references/windows.md` (**PowerShell 5.1 `&&`**, **`where` vs `where.exe`**, PATH refresh after **`nvm use`**). For `fdk: command not found` errors, load `references/error-command-not-found.md`. **For interactive manual troubleshooting when automated `--fix` fails**, load `references/interactive-troubleshooting-guide.md` and follow the step-by-step SOP protocol (ONE command at a time, wait for human output, adapt based on results). For **non-blocking local `fdk run`**, execute `scripts/fdk-run-background.sh` from the app root (shell script, not a slash command); use `scripts/stop-fdk-shell-tasks.sh` to signal matching `fdk run` / `fdk tunnel` processes.

## Routing

Parse user request and execute the appropriate operation:

| Trigger | Operation |
|---------|-----------|
| "install fdk", "setup fdk", `/fdk-setup-install`, `/fdk-install` (legacy); optional version **`X.Y.Z`** or **`--version X.Y.Z`** | Install FDK 10.x (default) or 9.x with deprecation notice (see `commands/fdk-setup-install.md`) |
| "upgrade fdk", "update fdk", `/fdk-setup-upgrade`, `/fdk-upgrade` (legacy); optional **`--to X.Y.Z`** | Upgrade to latest FDK 10 line or pinned semver (see `commands/fdk-setup-upgrade.md`) |
| "migrate fdk 9 to 10", "fdk 9 to 10" | Use `/fdk-setup-install` (installs FDK 10 on Node 24) or `/fdk-setup-upgrade` |
| "downgrade fdk", "use fdk 9", `/fdk-setup-downgrade 9.6.0`, `/fdk-downgrade` (legacy) | Downgrade FDK 10.x → 10.0.y or 10.x → 9.x (see `commands/fdk-setup-downgrade.md`) |
| "uninstall fdk", "remove fdk", `/fdk-setup-uninstall`, `/fdk-uninstall` (legacy) | Uninstall FDK only (keeps Node/nvm; no `--all`) |
| "check fdk", "fdk status", `/fdk-setup-status`, `/fdk-status` (legacy); optional **`--verbose`** | Status (inline; verbose adds PATH/nvm/rc diagnostics) |
| "fdk broken", "fdk not found", `/fdk-setup-troubleshoot`; **`--fix`** only if user asks | Diagnose inline; **`--fix`** spawns shell Task (see `commands/fdk-setup-troubleshoot.md`) |
| "use fdk for this repo", "switch node for fdk", **`cd`** app then wrong **`fdk`**, `/fdk-setup-use` | **Workspace stack:** **`nvm use`** from **`.nvmrc`** or explicit **10**/**9** (Node **24.11** vs **18**); optional **`--write-nvmrc`** (inline only — see `commands/fdk-setup-use.md`) |

**FDK 9.x Deprecation Warning (Always show when installing/downgrading to FDK 9.x):**
```
WARNING: FDK 9.x + Node 18.x is DEPRECATED (ends May 30, 2026)

- Development: Allowed for Platform 3.0 apps
- Publishing: NOT SUPPORTED - requires FDK 10.x + Node 24.x
- Recommendation: Use FDK 10.x for all new development

Continue with FDK 9.x installation? (y/N)
```

## Core Rules - UNIVERSAL ENFORCEMENT

- **Platform 3.0 ONLY** - Platform 2.3 is deprecated, NEVER support it - ZERO TOLERANCE
- **FDK 10.x + Node 24 RECOMMENDED** - Primary stack for Platform 3.0 development and publishing
- **FDK 9.x + Node 18 ALLOWED** - Supported for Platform 3.0 development until May 30, 2026 (deprecated)
- **Publishing requires FDK 10.x** - Marketplace submission requires Node 24 + FDK 10.x
- **Use nvm ALWAYS** - NEVER install Node globally, NEVER use `sudo npm`
- **FDK CLI only** - Use official commands from Freshworks documentation
- **Subagent execution** - Spawn **shell** Tasks for mutating flows: install, upgrade, downgrade, uninstall, and **`/fdk-setup-troubleshoot --fix`**. **`/fdk-setup-status`** (with or without **`--verbose`**), **`/fdk-setup-troubleshoot`** without **`--fix`**, and **`/fdk-setup-use`** stay **inline** (no Task).
- **Slash-command closeout** - Shell Tasks for `/fdk-setup-install`, `/fdk-setup-upgrade`, `/fdk-setup-downgrade`, `/fdk-setup-uninstall`, and **`/fdk-setup-troubleshoot --fix`** (and legacy `/fdk-*` aliases where applicable) MUST return as soon as verification + final REPORT are done (or aborted). Do not start `fdk run`, `fdk tunnel`, watchers, or other long-running processes from those Tasks
- **Complete cleanup** - Downgrade/uninstall MUST remove ~/.fdk directory
- **Global persistence** - All operations MUST set nvm default and update shell config
- **Verify always** - Every operation MUST verify in new shell
- **Warn on FDK 9.x** - Always warn that FDK 9.x is deprecated (May 30, 2026)
- If certainty < 100%, respond: "Insufficient FDK installation certainty."

**CRITICAL UNIVERSAL RULES - NO EXCEPTIONS:**

1. **Platform 3.0 Enforcement** - ONLY support Platform 3.0. Platform 2.3 is deprecated. Both FDK 10.x (Node 24) and FDK 9.x (Node 18) work with Platform 3.0.

2. **FDK Version Support Matrix:**
   - **FDK 10.x + Node 24.x** - Recommended, required for publishing, supported until Dec 2027
   - **FDK 9.x + Node 18.x** - Allowed for development, DEPRECATED (ends May 30, 2026), cannot publish

3. **Complete Uninstall Before Version Switch** - When switching between FDK 10.x ↔ 9.x, ALWAYS uninstall current version completely (npm + ~/.fdk + cache) before installing target version.

4. **Global Version Persistence** - All operations MUST set `nvm alias default` and update shell config (~/.zshrc or ~/.bashrc) to ensure FDK persists across all terminals.

5. **~/.fdk Directory Removal** - ALWAYS remove ~/.fdk on downgrade and uninstall. This directory contains cache, config, and version references that cause conflicts.

6. **New Shell Verification** - ALWAYS verify operations work in new shell: `zsh -c 'fdk version'` or `bash -c 'fdk version'`. Current shell verification is insufficient.

7. **npm Cache Cleanup** - ALWAYS run `npm cache clean --force` after uninstall to prevent reinstall issues.

8. **Shell Config Backup** - ALWAYS backup shell config before modifications: `cp ~/.zshrc ~/.zshrc.bak`

9. **Slash-command shell Task closeout** - For `/fdk-setup-install`, `/fdk-setup-upgrade`, `/fdk-setup-downgrade`, `/fdk-setup-uninstall`, **`/fdk-setup-troubleshoot --fix`** (and legacy `/fdk-*` where applicable), the `subagent_type: "shell"` Task ends after the operation: emit REPORT, then **return**. Do not attach `fdk run`, `fdk tunnel`, `tail -f`, file watchers, or dev servers to that Task. For local preview after install, point the user at `scripts/fdk-run-background.sh` instead of running `fdk run` inside the same Task.

You are not a tutor. You are an enforcement layer.

## CRITICAL: CDN Tarball Reality (Based on Real-World Apr 2026 Session)

**DO NOT use npm registry for FDK installation.** `@freshworks/fdk` is NOT published on registry.npmjs.org for global install.

### Correct Installation Sources:

| FDK Version | Node Version | Installation Command |
|-------------|--------------|---------------------|
| **FDK 10.x** (Recommended) | **Node 24.11.x** | `npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz` |
| **FDK 9.x** (Deprecated) | **Node 18.x** | `npm install -g https://cdn.freshdev.io/fdk/latest.tgz` |

### Critical Notes:

1. **Homebrew tap correction:** Use `freshworks-developers/homebrew-tap` (NOT `freshworks/tap`)
2. **Node 24.11.x specificity:** FDK 10.1.0+ requires Node 24.11.x specifically (NOT 24.14.x or higher)
3. **Legacy package name:** Uninstall BOTH `@freshworks/fdk` AND `fdk` (unscoped) - older versions used unscoped name
4. **Tarball branches:**
   - `latest.tgz` → FDK 9.x line (Node 18)
   - `latest-v24.tgz` → FDK 10.x line (Node 24)
5. **Per-Node globals:** Each nvm Node version has its own global packages - check all active Nodes
6. **Verification must check version:** Don't just check if `fdk` command exists - verify it's the correct major version (9.x or 10.x)

### Common Failure Patterns:

- ❌ `npm install -g @freshworks/fdk@10` → 404 (not on registry)
- ❌ `npm install -g https://cdn.freshdev.io/fdk/latest.tgz` on Node 24 → installs FDK 9.x, fails at runtime
- ❌ `fdk version` on Node 24.14.x with FDK 10.1.0 → engine mismatch error
- ❌ Only uninstalling `@freshworks/fdk` → leaves legacy `fdk` package behind

### Correct Workflow:

```bash
# Uninstall both package names
npm uninstall -g @freshworks/fdk 2>/dev/null
npm uninstall -g fdk 2>/dev/null
rm -rf ~/.fdk
npm cache clean --force

# Install FDK 10 on Node 24.11.x
nvm install 24.11
nvm use 24.11
nvm alias default 24.11
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

# Verify
fdk version  # Should show 10.x.x
node --version  # Should show v24.11.x
```

## Quick Detection (Pre-Subagent)

Run these checks directly before spawning subagents to provide context:

```bash
fdk version 2>&1 || echo "FDK not installed"
node --version 2>&1 || echo "Node not installed"
command -v nvm &>/dev/null && echo "nvm installed" || echo "nvm missing"
nvm current 2>&1 || echo "No nvm version active"
ls ~/.fdk 2>&1 || echo "No ~/.fdk directory"
```

**Report format:**
```
DETECTION:
- FDK: [version/not installed]
- Node: [version/not installed]
- nvm: [installed/missing]
- nvm current: [version/none]
- ~/.fdk: [exists/missing]
```

---

## Operation 1: Install

**Trigger:** FDK not installed or user requests installation.

**Steps:**

1. Detect OS: `uname -s` (macOS: Darwin, Linux: Linux, Windows: use `$env:OS`)

2. Check prerequisites:
   ```bash
   command -v nvm || echo "nvm missing"
   node --version || echo "node missing"
   ```

3. Spawn subagent with this prompt:

```
Install FDK 10 with Node 24 using official Freshworks CLI.

DETECTION:
- OS: [detected from step 1]
- nvm: [installed/missing]
- Node: [version/missing]

INSTALLATION METHOD:

macOS (Homebrew):
  brew tap freshworks/tap
  brew install fdk

Windows (Chocolatey):
  choco install fdk
  
Linux/Manual (nvm + npm):
  nvm install 24
  nvm use 24
  nvm alias fdk 24
  npm install -g @freshworks/fdk

VERIFICATION:
  fdk version
  node --version

REPORT:
  ✓ FDK version: [version]
  ✓ Node version: [version]
  ✓ Installation method: [brew/choco/npm]
```

4. **MANDATORY VERIFICATION (CRITICAL):**
   ```bash
   # Test 1: FDK accessible in current shell
   fdk version || echo "FAILED: FDK not in current shell"
   
   # Test 2: FDK accessible in new shell (CRITICAL)
   zsh -c 'fdk version' || bash -c 'fdk version' || echo "FAILED: FDK not persistent"
   
   # Test 3: Node version correct
   node --version | grep "v24" || echo "FAILED: Wrong Node version"
   
   # Test 4: nvm configured
   nvm current | grep "24" || echo "FAILED: nvm not using Node 24"
   ```

5. **Report format:**
   ```
   [VALID] FDK installed successfully
   
   Verification: ✓ Current shell | ✓ New shell | ✓ Node 24 | ✓ nvm configured
   
   Installation: [method]
   FDK version: [version]
   Node version: [version]

Next steps:
   1. Restart terminal (or source ~/.zshrc)
   2. Run: fdk version
   3. Create app: fdk create
   ```

**Error handling:** If installation fails, read `references/macos.md` or `references/windows.md` for OS-specific troubleshooting.

**CRITICAL RULES:**
- [INVALID] NEVER say "installation complete" without new shell verification
- [VALID] ALWAYS verify in new shell: `zsh -c 'fdk version'`
- [VALID] ALWAYS verify Node 24 is active
- [INVALID] NEVER skip verification steps

---

## Operation 2: Upgrade

**Trigger:** User wants a newer FDK (latest 10.x line or a **pinned** version).

**Canonical command:** `commands/fdk-setup-upgrade.md` (`/fdk-setup-upgrade`, optional **`--to X.Y.Z`**).

- **Latest FDK 10 line:** CDN `https://cdn.freshdev.io/fdk/latest-v24.tgz` on Node **24.11.x** (uninstall scoped + legacy `fdk`, remove `~/.fdk`, then install).
- **Pinned 10.x.y / 9.x.y:** CDN `https://cdn.freshdev.io/fdk/vX.Y.Z.tgz` (verify **HTTP 200** with `curl` before `npm install -g`).

Do **not** use `npm install -g @freshworks/fdk@latest` from the public npm registry for FDK 10 (see **CDN Tarball Reality** above).

**CRITICAL RULES:**
- [VALID] ALWAYS verify upgrade in a new shell after install
- [VALID] For `--to`, confirm tarball URL returns 200 before installing
- [INVALID] NEVER claim success without `fdk version` matching the requested line

---

## Operation 3: Downgrade

**Trigger:** User needs specific FDK version.

**Steps:**

1. Parse target version from user request (e.g., "10.0.0")

2. Check current version: `fdk version`

3. Spawn subagent:

```
Downgrade FDK to version [TARGET] and set as global default.

CURRENT: [from step 2]
TARGET: [from step 1]

COMPLETE UNINSTALL:
  npm uninstall -g @freshworks/fdk
  rm -rf ~/.fdk
  npm cache clean --force

INSTALL TARGET:
   nvm use fdk
  npm install -g @freshworks/fdk@[TARGET]

GLOBAL SWITCH:
  nvm alias default fdk
  echo "nvm use fdk > /dev/null 2>&1" >> ~/.zshrc
  source ~/.zshrc

VERIFICATION:
  fdk version  # Must show [TARGET]
  zsh -c 'fdk version'  # Test new shell

REPORT:
  ✓ Uninstalled: [old]
  ✓ Installed: [TARGET]
  ✓ Global switch: Active in all terminals
```

4. **MANDATORY VERIFICATION (CRITICAL - ALL TESTS MUST PASS):**
   ```bash
   # Test 1: Version matches target
   CURRENT=$(fdk version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
   [[ "$CURRENT" == "[TARGET]" ]] || echo "FAILED: Version mismatch"
   
   # Test 2: Works in new shell (MOST CRITICAL)
   NEW_SHELL=$(zsh -c 'fdk version' 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
   [[ "$NEW_SHELL" == "[TARGET]" ]] || echo "FAILED: Not persistent"
   
   # Test 3: ~/.fdk removed
   [ ! -d ~/.fdk ] || echo "FAILED: ~/.fdk still exists"
   
   # Test 4: nvm default set
   nvm alias default | grep "fdk" || echo "FAILED: nvm default not set"
   
   # Test 5: Only one version
   npm list -g @freshworks/fdk | grep -c "@freshworks/fdk@" | grep "1" || echo "WARNING: Multiple versions"
   ```

5. **Report format:**
   ```
   [VALID] FDK downgraded successfully to [TARGET]
   
   Verification: ✓ Version match | ✓ New shell | ✓ ~/.fdk removed | ✓ nvm default | ✓ Single version
   
   Changes:
   - Uninstalled: [old]
   - Installed: [TARGET]
   - Global switch: Active
   - Cache: Cleared
   
   Critical test: Open NEW terminal and run: fdk version
   Expected output: [TARGET]
   ```

**Critical:** Complete uninstall prevents version conflicts. Global switch ensures persistence across ALL terminals.

**CRITICAL RULES:**
- [INVALID] NEVER skip complete uninstall before downgrade
- [INVALID] NEVER skip ~/.fdk removal
- [INVALID] NEVER skip nvm default alias
- [INVALID] NEVER skip new shell verification
- [VALID] ALWAYS verify ALL 5 tests pass
- [VALID] If ANY test fails, re-run operation

---

## Operation 4: Uninstall

**Trigger:** User wants to remove FDK completely.

**Steps:**

1. Check if FDK exists: `command -v fdk`

2. Spawn subagent:

```
Completely remove FDK and all artifacts.

DETECTION:
  fdk version || echo "not installed"
  ls ~/.fdk || echo "no cache"

COMPLETE REMOVAL:
  npm uninstall -g @freshworks/fdk
  npm uninstall -g @freshworks/fdk --force  # If first fails
  rm -rf ~/.fdk
  npm cache clean --force
  
MANUAL CLEANUP (if npm fails):
  NPM_PREFIX=$(npm config get prefix)
  rm -f "$NPM_PREFIX/bin/fdk"
  rm -rf "$NPM_PREFIX/lib/node_modules/@freshworks/fdk"

SHELL CONFIG CLEANUP:
  cp ~/.zshrc ~/.zshrc.bak
  sed -i '/fdk/d' ~/.zshrc

VERIFICATION:
  command -v fdk && echo "FAILED" || echo "SUCCESS"
  [ ! -d ~/.fdk ] && echo "Cache removed"

REPORT:
  ✓ npm package: Removed
  ✓ Binary: Removed
  ✓ Cache (~/.fdk): Removed
  ✓ Shell config: Cleaned
  
PRESERVED:
  ✓ Node 24: [version]
  ✓ nvm: [version]
```

3. **MANDATORY VERIFICATION (CRITICAL - ALL TESTS MUST PASS):**
   ```bash
   # Test 1: FDK command removed
   command -v fdk && echo "FAILED: FDK still exists" || echo "PASSED"
   
   # Test 2: Not in new shell
   zsh -c 'command -v fdk' && echo "FAILED: FDK in new shell" || echo "PASSED"
   
   # Test 3: ~/.fdk removed
   [ ! -d ~/.fdk ] || echo "FAILED: ~/.fdk still exists"
   
   # Test 4: Not in npm global
   npm list -g @freshworks/fdk 2>&1 | grep -q "empty" || npm list -g @freshworks/fdk 2>&1 | grep -q "@freshworks/fdk" && echo "FAILED: Still in npm"
   
   # Test 5: Binary removed
   [ ! -f /usr/local/bin/fdk ] && [ ! -f ~/.local/bin/fdk ] || echo "FAILED: Binary exists"
   ```

4. **Report format:**
   ```
   [VALID] FDK uninstalled completely
   
   Verification: ✓ Command removed | ✓ New shell | ✓ ~/.fdk removed | ✓ npm clean | ✓ Binary removed
   
   Removed:
   - npm package: @freshworks/fdk
   - Binary: [path]
   - Cache: ~/.fdk
   - Shell config: Cleaned (backup: ~/.zshrc.bak)
   
   Preserved:
   - Node 24: [version]
   - nvm: [version]
   
   Critical test: Open NEW terminal and run: fdk version
   Expected output: command not found
   ```

**CRITICAL RULES:**
- [INVALID] NEVER say "uninstall complete" without new shell verification
- [INVALID] NEVER skip ~/.fdk removal
- [INVALID] NEVER skip npm cache cleanup
- [VALID] ALWAYS verify ALL 5 tests pass
- [VALID] ALWAYS backup shell config before modifications
- [VALID] If ANY test fails, re-run manual cleanup steps

---

## Operation 5: Status

**Trigger:** User checks FDK installation.

**Steps:**

1. Run checks directly (no subagent needed):

```bash
echo "=== FDK Status ==="
fdk version 2>&1 || echo "Not installed"
node --version 2>&1 || echo "Not installed"
nvm --version 2>&1 || echo "Not installed"
   which fdk
[ -d ~/.fdk ] && echo "Cache exists" || echo "No cache"
echo "=================="
```

2. Report findings to user.

---

## Progressive Disclosure

Load these references only when needed:

- **Complex scenarios:** Read `references/cross-scenarios.md`
- **macOS issues:** Read `references/macos.md`
- **Windows issues:** Read `references/windows.md`

Do not load these files unless the operation fails or user has a complex setup.

---

## Error Recovery

| Error | Action |
|-------|--------|
| `fdk: command not found` | Run Operation 1 (Install) |
| `npm permission denied` | Use nvm, never sudo npm |
| `Node version mismatch` | Run `nvm use fdk` |
| Version conflicts | Run Operation 4 (Uninstall) then Operation 1 (Install) |
| OS-specific failure | Read `references/[os].md` |

---

## Verification Gates - MANDATORY

**[ALERT] ZERO TOLERANCE: An operation is NEVER complete unless ALL gates pass.**

| Gate | Checks |
|------|--------|
| **1 – Command exists** | `command -v fdk` succeeds (install/upgrade/downgrade) OR fails (uninstall) |
| **2 – New shell** | `zsh -c 'fdk version'` shows correct version (install/upgrade/downgrade) OR fails (uninstall) |
| **3 – Version match** | `fdk version` output matches expected version (install/upgrade/downgrade) |
| **4 – Cache state** | `~/.fdk` removed (downgrade/uninstall) OR exists (install/upgrade) |
| **5 – npm state** | Single version in `npm list -g @freshworks/fdk` (install/upgrade/downgrade) OR empty (uninstall) |
| **6 – nvm default** | `nvm alias default` set to fdk (downgrade) |

**If any gate fails:** do not call the operation complete; fix and re-verify.

---

## Critical Validations (Always Check)

### Installation Validation

| Check | Requirement |
|-------|-------------|
| FDK version | Must be 10.0.0+ for Platform 3.0 |
| Node version | Must be 24.x (recommended for FDK 10) |
| nvm | Must be installed and configured |
| Global access | `which fdk` must return path |
| New shell | `zsh -c 'fdk version'` must succeed |

### Downgrade Validation

| Check | Requirement |
|-------|-------------|
| Complete uninstall | Previous version removed via npm |
| Cache cleared | `~/.fdk` directory removed |
| Target installed | Exact version specified by user |
| Global switch | `nvm alias default` set to fdk |
| Shell config | Updated with `nvm use fdk` |
| New shell | Version persists in new terminal |

### Uninstall Validation

| Check | Requirement |
|-------|-------------|
| npm package | Removed from global packages |
| Binary | Removed from bin directories |
| Cache | `~/.fdk` directory removed |
| Shell config | FDK references removed (with backup) |
| npm cache | Cleaned with `--force` flag |
| New shell | `fdk` command not found |

---

## Error Catalog

| Error | Severity | Action |
|-------|----------|--------|
| `fdk: command not found` | CRITICAL | Run Operation 1 (Install) |
| `npm permission denied` | CRITICAL | Use nvm, NEVER `sudo npm` |
| `Node version mismatch` | HIGH | Run `nvm use fdk` or `nvm use 24` |
| Version conflicts | HIGH | Run Operation 4 (Uninstall) then Operation 1 (Install) |
| `~/.fdk` persists after uninstall | MEDIUM | Manual removal: `rm -rf ~/.fdk` |
| Old version in new shell | HIGH | Re-run downgrade with global switch |
| Multiple FDK versions | MEDIUM | Uninstall all, reinstall target version |
| OS-specific failure | VARIES | Read `references/[os].md` |

---

## Anti-Patterns

**Do not:**
- Install Node without nvm
- Use `sudo npm install -g`
- Skip complete uninstall before downgrade
- Leave ~/.fdk directory after uninstall
- Create documentation files (README, CHANGELOG)
- Write installation steps manually - use subagents
- Say "complete" without new shell verification
- Skip any verification gate

**Always:**
- Use official FDK CLI commands
- Verify after every operation
- Preserve existing Node versions
- Clean up completely on uninstall
- Set global default on downgrade
- Test in new shell
- Run ALL verification gates
- Report verification results

---

## Summary

- **SKILL.md** — core enforcement, operations, verification gates, error catalog
- **references/cross-scenarios.md** — complex multi-Node scenarios, PATH conflicts, dual version setups
- **references/macos.md** — macOS-specific installation, Homebrew, zsh configuration
- **references/windows.md** — Windows-specific installation, Chocolatey, PowerShell configuration
- **commands/** — slash definitions: `/fdk-setup-*` (Confluence-style); legacy `/fdk-*` names remain valid aliases in routing above

When uncertain, load the specific `references/` file before implementing.

---

## Constraints (Enforced Automatically)

- **Strict mode:** Always reject Platform 2.3/FDK 9.x requests
- **No inference without source:** If not in references, respond "Insufficient FDK installation certainty"
- **Verification mandatory:** Every operation MUST pass all verification gates
- **Production-ready only:** Generate complete, persistent installations
- **Global persistence:** Downgrade MUST work across all terminals
- **Complete cleanup:** Uninstall MUST remove all artifacts

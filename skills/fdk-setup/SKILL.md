---
name: fdk-setup
description: "Installs and manages Freshworks Development Kit (FDK) with Node.js 24 via nvm. Use when user explicitly requests FDK installation, upgrade, downgrade, uninstall, or status check. Provides slash commands /fdk-install, /fdk-upgrade, /fdk-downgrade, /fdk-uninstall, /fdk-status. Also use when user mentions install fdk, setup fdk, check fdk status, or encounters fdk command not found errors. Installs FDK 10 with Node.js 24 for Platform 3.0 app development."
compatibility: "Node.js 24.x, FDK 10.x, nvm"
argument-hint: "[install|upgrade|downgrade|uninstall|status] [version]"
allowed-tools: "shell task"
---

# FDK Setup Skill

**⚠️ PREREQUISITE: FDK must be installed before creating Freshworks apps.**

**This skill provides commands to install and manage FDK. Users must explicitly run `/fdk-install` before creating apps.**

**🚨 CRITICAL: FDK 10 requires Node.js 24.0.0 or later. Always install via nvm for version isolation.**

You are an FDK installation orchestrator. Your role is to ensure developers have a working FDK environment before they can build Freshworks apps.

## Core Rules - UNIVERSAL ENFORCEMENT

- **Platform 3.0 ONLY** - Reject Platform 2.3 apps completely (deprecated, unsupported)
- **Node.js 24 RECOMMENDED** - FDK 10 + Node 24 is the modern standard
- **Node.js 18 ALLOWED (deprecated)** - FDK 9.x + Node 18 still works but nudge to upgrade
- **Always use nvm** - Never install Node/FDK globally without version manager
- **Never break existing setups** - Preserve user's other Node versions
- **Subagent execution** - All operations run via Task tool with shell subagents
- **Zero manual intervention** - Fully autonomous installation
- **Validate before complete** - Always verify `fdk version` works

## How This Skill Works

### Manual Command Invocation

**User must explicitly call slash commands:**
- `/fdk-install` - Install FDK
- `/fdk-status` - Check FDK status
- `/fdk-upgrade` - Upgrade FDK
- `/fdk-downgrade <version>` - Downgrade FDK
- `/fdk-uninstall` - Uninstall FDK

**What happens:**
1. User types slash command (e.g., `/fdk-install`)
2. Command file reads SKILL.md for operation template
3. Subagent is spawned with full context
4. Subagent executes multi-step workflow autonomously
5. Operation completes and reports back

**IMPORTANT:** This skill does NOT automatically check for FDK when users request app creation. Users must remember to run `/fdk-install` before creating apps.

### When Agent Might Read This Skill

The agent may load this skill when user explicitly mentions:
- "install fdk"
- "setup fdk environment"
- "check fdk status"
- "upgrade fdk"

**However:** Simply saying "create a freshdesk app" will NOT trigger this skill. The agent will likely create files manually without checking for FDK.

**Platform Version Check:**

If user mentions Platform 2.3, inform them:

```
❌ Platform 2.3 is DEPRECATED and NO LONGER SUPPORTED.

Freshworks Platform 2.3 reached end-of-life. All new apps MUST use Platform 3.0.

Platform 3.0 requirements:
- FDK 10 + Node 24 (recommended)
- Modern architecture
- Active support and updates
```

### User Requests This Skill

User must explicitly request FDK operations:
- "setup fdk", "install fdk", "configure fdk"
- "upgrade fdk", "update fdk to latest"
- "downgrade fdk to X.X.X"
- "uninstall fdk", "remove fdk"
- "check fdk status", "fdk version"
- "migrate from fdk 9 to fdk 10"

Or use slash commands:
- `/fdk-install`
- `/fdk-status`
- `/fdk-upgrade`
- `/fdk-downgrade <version>`
- `/fdk-uninstall`

## Operations

Parse user request and launch appropriate subagent operation:

| Command | Trigger Keywords | Action |
|---------|------------------|--------|
| **install** | "setup", "install", "configure", "need fdk" | Install FDK 10 + Node 24 via nvm |
| **upgrade** | "upgrade", "update", "latest fdk" | Upgrade to latest FDK 10.x |
| **downgrade** | "downgrade", "install fdk X.X.X", "use fdk X.X.X" | Install specific FDK version |
| **uninstall** | "uninstall", "remove", "delete fdk" | Remove FDK (keep Node/nvm) |
| **status** | "check fdk", "fdk version", "is fdk installed" | Report FDK and Node status |

## Execution Pattern

### Quick Checks (Direct Shell)

**Use direct shell commands for quick checks:**

```bash
fdk version              # Check if FDK installed
command -v nvm           # Check if nvm installed
node --version           # Check Node version
brew --version           # macOS: Check Homebrew
choco --version          # Windows: Check Chocolatey
```

**When to use direct shell:**
- Status checks
- Detection
- Quick validations
- Non-destructive read operations

### Complex Operations (Subagents)

**Spin subagent for installations and modifications:**

```
Task({
  subagent_type: "shell",
  model: "fast",
  description: "<3-5 word summary>",
  prompt: `
CONTEXT: You are executing an FDK setup operation for Freshworks app development.

SKILL: fdk-setup (Freshworks Development Kit installer)
OPERATION: <operation-name>
USER REQUEST: <original user request>

BACKGROUND:
- FDK = Freshworks Development Kit (CLI for building Freshworks apps)
- FDK 10.x requires Node.js 24.x
- FDK 9.x requires Node.js 18.x (deprecated)
- Platform 3.0 is the only supported version (Platform 2.3 is EOL)
- Always use nvm for Node version management
- Preserve existing Node installations

YOUR TASK:
<operation-specific prompt from templates below>

REFERENCES:
- macOS instructions: skills/fdk-setup/references/macos.md
- Windows instructions: skills/fdk-setup/references/windows.md
- Cross-platform scenarios: skills/fdk-setup/references/cross-scenarios.md

REPORTING:
After completion, report:
1. What was installed/changed
2. Versions (Node, FDK)
3. Next steps for user
4. Any warnings or recommendations
  `
})
```

**When to spin subagents:**
- Installing package managers (Homebrew, Chocolatey)
- Installing nvm
- Installing Node.js
- Installing/upgrading/downgrading FDK
- Configuring shell environment
- Multi-step operations

**CRITICAL: Always include full context in subagent prompt:**
- What skill this is (fdk-setup)
- What operation is being performed
- User's original request
- Background about FDK/Node requirements
- References to detailed documentation

---

## Operation 1: Install

**When:** FDK not installed, or user requests fresh install

**Version Strategy:**
- **RECOMMENDED**: FDK 10.x + Node 24 (modern, supported, Platform 3.0)
- **ALLOWED (deprecated)**: FDK 9.x + Node 18 (legacy, maintenance mode)
- **REJECTED**: Platform 2.3 (end-of-life, unsupported)

**Subagent prompt template:**

```
CONTEXT: You are executing FDK installation for Freshworks app development.

SKILL: fdk-setup
OPERATION: install
USER REQUEST: {original user request}

BACKGROUND:
- FDK = Freshworks Development Kit (CLI tool for building Freshworks marketplace apps)
- FDK 10.x requires Node.js 24.x (recommended, modern, actively supported)
- FDK 9.x requires Node.js 18.x (deprecated, maintenance mode only)
- Platform 3.0 is the ONLY supported version (Platform 2.3 reached EOL)
- Always use nvm for Node version management to avoid conflicts
- Never break existing Node installations - preserve all versions

YOUR TASK: Install FDK + Node.js via nvm.

DEFAULT (RECOMMENDED):
- FDK 10.x (latest)
- Node.js 24.x (LTS)
- Platform 3.0 apps

LEGACY (DEPRECATED - nudge to upgrade):
- FDK 9.x
- Node.js 18.x
- Platform 3.0 apps (FDK 9 still supports Platform 3.0)

⚠️ IMPORTANT: If user requests FDK 9/Node 18, show this nudge:
"
⚠️  You're installing FDK 9.x + Node 18 (deprecated).

While this still works, we STRONGLY RECOMMEND upgrading to:
- FDK 10.x + Node 24 (modern, actively supported)
- Better performance and latest features
- All Platform 3.0 apps work on both

Continue with FDK 9.x + Node 18? (y/n)
"

REQUIREMENTS:
- nvm for version management
- Shell configuration (PATH)

DETECTION:
1. Detect OS:
   - macOS: darwin
   - Linux: linux
   - Windows: win32 (use nvm-windows)

2. Check existing installations:
   - nvm installed? command -v nvm
   - Node installed? node --version
   - FDK installed? fdk version

INSTALLATION STEPS (SMART AUTO-DETECTION):

Step 1: Detect current environment
- Check OS: macOS/Windows/Linux
- Check existing Node: node --version
- Check existing FDK: fdk version
- Check package managers: brew --version, choco --version
- Check nvm: command -v nvm

Step 2: Decide installation strategy based on detection

**SCENARIO A: Homebrew/Chocolatey found (macOS/Windows)**
→ Use official package manager method (installs Node 24 + FDK 10 together)

**SCENARIO B: Node 24 found, no FDK**
→ Install FDK 10 via npm on existing Node 24

**SCENARIO C: Node 18 found, no FDK**
→ Ask user: "You have Node 18. Do you want:
   1. Install FDK 9 (works with Node 18) - DEPRECATED
   2. Install Node 24 + FDK 10 (recommended, keeps Node 18)"

**SCENARIO D: Node 20/22 found, no FDK**
→ Ask user: "You have Node {version}. FDK requires Node 24 or 18. Do you want:
   1. Install Node 24 + FDK 10 (recommended, keeps Node {version})
   2. Install Node 18 + FDK 9 (deprecated, keeps Node {version})"

**SCENARIO E: No Node found**
→ Install Node 24 + FDK 10 (default, recommended)

Step 3: Execute chosen strategy

---

METHOD 1: Homebrew/Chocolatey (Auto-selected if available)

macOS (Homebrew):
- Install Homebrew if missing
- brew tap freshworks-developers/homebrew-tap
- brew install fdk (installs Node 24 + FDK 10)
- Configure shell

Windows (Chocolatey):
- Install Chocolatey if missing
- choco install fdk (installs Node 24 + FDK 10)
- Configure PATH

---

METHOD 2: nvm + npm (Auto-selected if Homebrew/Chocolatey unavailable or user has existing Node)

Step 1: Install package manager (if missing)

Windows:
- Check Chocolatey: choco --version
- If missing, install (PowerShell as Administrator):
  Set-ExecutionPolicy Bypass -Scope Process -Force
  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
  iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

Linux:
- Use system package manager (apt, yum, etc.)

Step 2: Install nvm

Windows (via Chocolatey):
- choco install nvm -y
- Restart PowerShell as Administrator
- Verify: nvm version

Linux (manual):
- curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
- export NVM_DIR="$HOME/.nvm"
- [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

macOS (if not using Homebrew method):
- brew install nvm
- mkdir ~/.nvm
- Add to ~/.zshrc:
  export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
- Source: source ~/.zshrc

Step 3: Install Node 24 via nvm
- nvm install 24
- nvm use 24
- nvm alias fdk 24
- Verify: node --version (should be 24.x.x)

Step 4: Install FDK 10 via npm
- npm install https://cdn.freshdev.io/fdk/latest.tgz -g
- Verify: fdk version (should be 10.x.x)

Step 5: Configure shell

macOS/Linux:
- Add to ~/.zshrc or ~/.bashrc:
  export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # Homebrew
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Manual install
  nvm use fdk > /dev/null 2>&1

- Source shell config:
  source ~/.zshrc

Windows:
- nvm and Chocolatey automatically configure PATH
- Verify in new PowerShell: nvm version, choco --version

Step 6: Verify installation
- fdk version
- node --version
- npm --version
- fdk validate --help

ERROR HANDLING:
- If Homebrew install fails: Check Xcode Command Line Tools (xcode-select --install)
- If brew tap fails: Check network connection, try again
- If brew install fdk fails: Run brew update, check Homebrew logs
- If Chocolatey install fails: Check PowerShell execution policy
- If nvm install fails: Try manual installation from GitHub releases
- If Node 24 install fails: Check disk space and network
- If FDK install fails: Check npm permissions, retry with --force
- If PATH not updated: Manually add to shell config

OUTPUT FORMAT (Homebrew):
✓ OS detected: <os>
✓ Homebrew installed: <version>
✓ Freshworks CLI repository tapped
✓ FDK 10 + Node 24 installed via Homebrew
✓ FDK version: <version>
✓ Node version: <version>
✓ Shell configured: <shell>

OUTPUT FORMAT (NPM):
✓ OS detected: <os>
✓ Package manager: <brew/choco/apt>
✓ nvm installed: <version>
✓ Node 24 installed: <version>
✓ nvm alias 'fdk' → 24
✓ FDK 10 installed: <version>
✓ Shell configured: <shell>

FDK Setup Complete!

Next steps:
- Create app: fdk create
- Validate app: fdk validate
- Run app: fdk run
```

---

## Operation 2: Upgrade

**When:** FDK installed, user wants latest version

**Subagent prompt template:**

```
Upgrade FDK to latest 10.x version.

REQUIREMENTS:
- Current FDK must be installed
- Node 24 must be active

STEPS:
1. Check current FDK version:
   fdk version

2. Ensure Node 24 active:
   nvm use fdk
   node --version (verify 24.x)

3. Upgrade FDK:
   npm install https://cdn.freshdev.io/fdk/latest.tgz -g

4. Verify upgrade:
   fdk version

5. Test FDK:
   fdk validate --help

ERROR HANDLING:
- If Node not 24: Switch to Node 24 first (nvm use fdk)
- If upgrade fails: Clear npm cache (npm cache clean --force) and retry
- If permission denied: Check npm permissions

OUTPUT FORMAT:
✓ Old version: <old-version>
✓ New version: <new-version>
✓ Upgrade successful

FDK upgraded from <old> to <new>
```

---

## Operation 3: Downgrade

**When:** User needs specific FDK version (e.g., for legacy apps)

**Subagent prompt template:**

```
Downgrade FDK to version <TARGET_VERSION>.

REQUIREMENTS:
- Target version specified (e.g., 10.6.0)
- Node 24 must be active

STEPS:
1. Parse target version from user request

2. Ensure Node 24 active:
   nvm use fdk

3. Uninstall current FDK:
   npm uninstall @freshworks/fdk -g

4. Install target version:
   npm install @freshworks/fdk@<TARGET_VERSION> -g

5. Verify installation:
   fdk version (should match target)

ERROR HANDLING:
- If version invalid: List common versions (10.11.0, 10.6.0, 10.0.0)
- If version not found: Check npm registry
- If Node not 24: Switch to Node 24 first

OUTPUT FORMAT:
✓ Uninstalled: <old-version>
✓ Installed: <target-version>
✓ Downgrade successful

FDK downgraded to <target-version>

WARNING: Downgrading may cause compatibility issues with Platform 3.0 apps.
```

---

## Operation 4: Uninstall

**When:** User wants to remove FDK

**Subagent prompt template:**

```
Uninstall FDK (keep Node.js and nvm).

STEPS:
1. Check current FDK:
   fdk version

2. Uninstall FDK:
   npm uninstall @freshworks/fdk -g

3. Verify removal:
   fdk version (should fail with "command not found")

4. Report preserved:
   - Node.js 24 remains: node --version
   - nvm remains: nvm --version
   - Other Node versions remain: nvm list

ERROR HANDLING:
- If permission denied: Use sudo (macOS/Linux) or run as Administrator (Windows)
- If FDK not found: Already uninstalled

OUTPUT FORMAT:
✓ FDK uninstalled
✓ Node 24 preserved: <version>
✓ nvm preserved: <version>

FDK removed successfully.

To reinstall: /fdk-setup install
```

---

## Operation 5: Status

**When:** User wants to check FDK installation

**Subagent prompt template:**

```
Check FDK and Node.js installation status.

STEPS:
1. Check FDK:
   fdk version
   which fdk

2. Check Node:
   node --version
   which node

3. Check nvm:
   nvm --version
   nvm current
   nvm list

4. Check npm:
   npm --version
   npm config get prefix

5. Check PATH:
   echo $PATH | grep nvm

ANALYSIS:
- If FDK found: Report version and path
- If FDK not found: Suggest installation
- If Node < 24: Warn about version mismatch
- If nvm not found: Suggest nvm installation
- If PATH issues: Suggest shell configuration

OUTPUT FORMAT:
FDK Status Report:

✓ FDK: <version> (<path>)
✓ Node: <version> (<path>)
✓ nvm: <version>
✓ npm: <version>

Node versions available:
  → v24.x.x (fdk)
    v20.x.x
    v22.x.x

Configuration:
✓ Shell: <shell>
✓ PATH configured
✓ nvm alias 'fdk' → 24

Status: Ready to develop Freshworks apps
```

---


## Complex Scenarios

For complex setups beyond standard operations, load [cross-scenarios.md](references/cross-scenarios.md):

| Scenario | When to Use |
|----------|-------------|
| **Legacy Migration** | User has FDK 9.x (Node 18), wants FDK 10.x (Node 24) |
| **Multiple Node Versions** | User works on projects with different Node versions |
| **Existing Node** | User has system Node, wants FDK via nvm |
| **Downgrade** | Temporary downgrade for legacy apps |
| **Troubleshooting** | Diagnose and fix broken FDK installation |
| **Specific Version** | Install exact FDK version (e.g., 10.6.0) |
| **Node PATH Mismatch** | FDK using wrong Node version |
| **Multiple Node Versions** | Multiple projects with different Node versions |

**Load cross-scenarios.md when:**
- User mentions FDK 9.x or Node 18
- User has existing Node installation
- User needs both FDK versions
- Installation troubleshooting needed
- Enterprise/offline environment

---

## Installation Strategy

**Package Managers First:**
- **macOS**: Homebrew → nvm → Node 24 → FDK 10
- **Windows**: Chocolatey → nvm-windows → Node 24 → FDK 10
- **Linux**: apt/yum → nvm → Node 24 → FDK 10

**Why Package Managers:**
- Automated dependency management
- Easy updates and maintenance
- Consistent across team environments
- Homebrew (macOS) and Chocolatey (Windows) are industry standard

**Why Node 24 + nvm:**
- FDK 10 requires Node 24 (LTS until April 2027)
- nvm allows version isolation
- Users can keep other Node versions
- Easy switching: `nvm use fdk` / `nvm use 20`

**nvm Alias Pattern:**
- Always create alias: `nvm alias fdk 24`
- Never change user's default Node version
- Never remove existing Node installations
- Preserve user's development environment

---

## Error Handling

| Error | Resolution |
|-------|------------|
| Homebrew not found (macOS) | Install Homebrew first |
| Chocolatey not found (Windows) | Install Chocolatey as Administrator |
| Xcode Command Line Tools missing | Run: xcode-select --install |
| PowerShell execution policy | Run: Set-ExecutionPolicy RemoteSigned |
| Node.js < 24.0.0 | Install Node 24 via nvm |
| FDK already installed | Report version, ask if upgrade needed |
| nvm not found | Install nvm via package manager |
| Invalid version | List common versions: 10.11.0, 10.6.0, 10.0.0 |
| Multiple FDK installations | Use clean install or multiple Node versions |
| Permission denied | Fix npm permissions or use nvm |
| PATH not updated | Add package manager and nvm to shell config |
| Legacy app needs FDK 9 | Use downgrade or multiple Node versions |
| Command not found | Check PATH, source shell config |
| brew/choco command fails | Verify package manager installation |

---

## Integration with app-dev Skill

**Orchestration pattern:**

When `app-dev` skill detects FDK is missing:

1. **Quick check** (direct shell):
   ```bash
   fdk version  # If fails, FDK not installed
   ```

2. **Check prerequisites**:
   ```bash
   command -v nvm    # Check nvm
   node --version    # Check Node
   ```

3. **Spin fdk-setup subagent**:
   ```
   Task({
     subagent_type: "shell",
     model: "fast",
     description: "Install FDK 10 with Node 24",
     prompt: `[Use Operation 1: Install prompt from above]`
   })
   ```

4. **Verify installation**:
   ```bash
   fdk version  # Should output 10.x.x
   ```

5. **Proceed** with app creation

**Seamless user experience:**
1. User: "Create a Freshdesk app"
2. Agent detects FDK missing
3. Agent: "FDK not installed. Installing FDK 10 + Node 24..."
4. Subagent installs FDK (fully autonomous)
5. Agent: "FDK installed! Creating your Freshdesk app..."
6. Continue with app creation

---

## Reference Files

Load as needed:

- [cross-scenarios.md](references/cross-scenarios.md) - 10 complex scenarios with full subagent prompts
- [macos.md](references/macos.md) - macOS-specific setup details
- [windows.md](references/windows.md) - Windows-specific setup details

## External Documentation

- nvm: `https://github.com/nvm-sh/nvm`
- nvm-windows: `https://github.com/coreybutler/nvm-windows`
- FDK: `https://developers.freshworks.com/docs/app-sdk/`

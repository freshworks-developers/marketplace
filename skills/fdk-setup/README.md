<h1 align="center">FDK Setup</h1>

<p align="center"><strong>Platform 3.0 Development - FDK 10.x (recommended) & FDK 9.x (deprecated)</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Plugin-00a67e?style=for-the-badge" alt="Cursor Plugin">
  <img src="https://img.shields.io/badge/FDK-10.x_|_9.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24.x_(recommended)-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 24.x">
  <img src="https://img.shields.io/badge/Node.js-18.x_(deprecated)-orange?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 18.x">
  <img src="https://img.shields.io/badge/macOS-Supported-000000?style=flat-square&logo=apple&logoColor=white" alt="macOS">
  <img src="https://img.shields.io/badge/Windows-Supported-0078D6?style=flat-square&logo=windows&logoColor=white" alt="Windows">
</p>

<p align="center">Manual commands for FDK lifecycle management on macOS and Windows.<br>Install, upgrade, downgrade, and uninstall FDK using <strong>subagents</strong> with <strong>nvm</strong>.</p>

<p align="center"><code>Platform 3.0</code> · <code>FDK 10.x Recommended</code> · <code>FDK 9.x Allowed</code> · <code>Publishing Requires FDK 10.x</code></p>

> **FDK VERSION SUPPORT**: 
> - **FDK 10.x + Node 24.x** (Recommended) - Required for publishing, supported until Dec 2027
> - **FDK 9.x + Node 18.x** (Deprecated) - Allowed for development only, ends May 30, 2026

> **PLATFORM 3.0 ONLY**: Platform 2.3 is deprecated. Both FDK versions support Platform 3.0.

> **IMPORTANT**: Run **`/fdk-setup-install`** (or legacy **`/fdk-install`**) before creating Freshworks apps. This skill does NOT auto-check prerequisites on generic “create app” prompts.

## Install

### Install via CLI:

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill fdk-setup
```

**For local development:**
```bash
npx skills add file:///path/to/marketplace-main --skill fdk-setup
```

### Install as Claude Plugin

**Step1**

```bash
claude plugin marketplace add freshworks-developers/marketplace
```

**Step2**

```bash
claude plugin install fdk-setup@freshworks-developers
```

## Verify Installation

The plugin should appear in Cursor/Claude Settings → Plugins → Installed Plugins.

Check available commands:
```bash
# In Cursor/Claude chat, type:
/fdk-setup-
# You should see 6 commands in autocomplete (plus legacy /fdk-* if registered)
```

## FDK Version Support Policy

**Platform 3.0 Development:** Both FDK 10.x and FDK 9.x work with Platform 3.0.

### FDK 10.x + Node 24.x (Recommended)
- **Status:** Active, supported until December 2027
- **Use for:** All new development
- **Publishing:** Required for marketplace submission
- **Command:** `/fdk-setup-install` (default)

### FDK 9.x + Node 18.x (Deprecated)
- **Status:** Deprecated, support ends May 30, 2026
- **Use for:** Development only (legacy projects)
- **Publishing:** NOT SUPPORTED
- **Command:** `/fdk-setup-downgrade` (shows deprecation warning)
- **Warning:** Automatic prompt before installation

### Platform 2.3 (Rejected)
- **Status:** Deprecated, no support
- **This skill:** Platform 3.0 ONLY

## Usage

### Manual Commands (Always Work)

**You must explicitly run these commands:**

```bash
/fdk-setup-install              # Install FDK 10.x + Node 24 (recommended)
/fdk-setup-install --version 10.1.0  # Pin FDK 10.x.y (CDN v10.1.0.tgz)
/fdk-setup-upgrade              # Upgrade to latest FDK 10 line (Node 24.11)
/fdk-setup-upgrade --to 10.1.0 # Pin semver (CDN v10.1.0.tgz)
/fdk-setup-downgrade            # FDK 9 latest line + Node 18 (deprecated)
/fdk-setup-downgrade 9.6.0      # Pin FDK 9.x.y (CDN v9.6.0.tgz)
/fdk-setup-uninstall            # Remove FDK only (npm + ~/.fdk + cache; keeps nvm)
/fdk-setup-status               # Inline status
/fdk-setup-status --verbose     # PATH, npm prefix, nvm, rc snippets
/fdk-setup-troubleshoot         # Diagnose (inline)
/fdk-setup-troubleshoot --fix   # Shell Task: zshrc-safe nvm + FDK 10 on 24.11
/fdk-setup-use                  # Workspace: nvm use + .nvmrc (FDK 10 vs 9); optional --write-nvmrc
# Legacy: /fdk-install, /fdk-upgrade, /fdk-downgrade, /fdk-uninstall, /fdk-status
```

**Local dev (background, not a slash command):** from your app directory (where `manifest.json` lives), run the script by absolute path, for example:

`bash /path/to/marketplace/skills/fdk-setup/scripts/fdk-run-background.sh`

Logs and a PID file go under `${TMPDIR:-/tmp}/fdk-setup-runs/` unless `FDK_RUN_LOG_DIR` is set. To signal matching `fdk run` / `fdk tunnel` processes: `bash .../scripts/stop-fdk-shell-tasks.sh` (`--dry-run`, `--force`).

### Key Features

**Install (`/fdk-setup-install`):**
- Installs FDK 10.x with Node.js 24.11 via nvm + CDN (default **latest-v24.tgz**)
- Optional **`--version X.Y.Z`** pins **`vX.Y.Z.tgz`** (FDK **10.x.y** only; refuse 9.x here)
- Auto-detects existing Node installations
- Sets up global persistence across all terminals
- Comprehensive verification in new shells

**Upgrade (`/fdk-setup-upgrade`):**
- Upgrades to latest FDK 10 line, or **`--to X.Y.Z`** for a pinned release (`https://cdn.freshdev.io/fdk/vX.Y.Z.tgz`)
- Complete uninstall of previous version before upgrade
- Removes ~/.fdk directory to prevent conflicts
- Preserves Node 24 configuration

- Moves from FDK 9 + Node 18 to FDK 10 + Node 24.11 (keeps Node 18 in nvm)

**Downgrade (`/fdk-setup-downgrade`):**
- Downgrades from FDK 10.x to FDK 9.x (Node 24 → Node 18)
- Optional **pinned 9.x.y** (`v9.x.y.tgz`) or **latest** 9 line (`latest.tgz`) after HTTP check
- Shows deprecation warning (FDK 9.x ends May 30, 2026)
- Requires confirmation before proceeding
- Complete cleanup of FDK 10.x before installing 9.x
- Warns that publishing requires FDK 10.x
- Use for development only

**Uninstall (`/fdk-setup-uninstall`):**
- Complete removal: npm package + binary + node_modules
- Removes ~/.fdk directory completely
- Cleans npm cache to prevent reinstall issues
- Removes shell config references (with backup)
- Manual binary removal if npm uninstall fails
- Comprehensive verification of complete removal
- **No `uninstall --all`** — Node and nvm are never removed by this skill

**Status / troubleshoot:**
- **`/fdk-setup-status --verbose`** — extended diagnostics (still inline, no Task)
- **`/fdk-setup-troubleshoot`** — diagnose PATH / nvm / FDK (inline)
- **`/fdk-setup-troubleshoot --fix`** — shell Task with conservative **`~/.zshrc`** / **`~/.bashrc`** edits

**Use (`/fdk-setup-use`) — workspace stack (inline):**
- **`nvm use`** from **`.nvmrc`** or explicit **10** / **9** (Node **24.11** vs **18**)
- Optional **`--write-nvmrc`** to pin **`24.11`** (FDK 10) or **`18`** (FDK 9) in the app repo
- Does not change global default alias by itself; switches the **active shell** (and documents next steps if **`fdk`** is missing on that Node)

### ⚠️ IMPORTANT: Run Before Creating Apps

**Before creating any Freshworks app, you MUST run:**
```bash
/fdk-setup-install
```

**Why?** Cursor does not automatically check for FDK prerequisites. If you skip this step and try to create an app, the agent may create files manually without proper validation.

### When Agent Might Auto-Invoke

The agent *may* automatically load this skill when you explicitly mention:
- "install fdk"
- "setup fdk"
- "check fdk status"

**However:** If you just say "create a freshdesk app", the agent may skip the FDK check. Always run **`/fdk-setup-install`** first.

## How It Works

### Command Flow (Manual Invocation)

```
User types: /fdk-setup-install
    ↓
Cursor reads: commands/fdk-setup-install.md
    ↓
Command reads: SKILL.md (operation template)
    ↓
Creates: Task tool with shell subagent
    ↓
Subagent receives: Full context (what FDK is, requirements, etc.)
    ↓
Subagent executes: Multi-step installation workflow
    ↓
Returns: Installation status and next steps
```

**Key Point:** This flow ONLY works when you explicitly type the slash command. It does NOT automatically trigger when you request app creation.

### Subagent Workflow

When you run a command (e.g., `/fdk-setup-install`), it spawns a **dedicated shell subagent** that:

1. **Auto-detects environment** - OS, Node.js, package managers (Homebrew/Chocolatey)
2. **Smart decision-making** - Chooses best installation method automatically
3. **Asks only when needed** - User input only for meaningful choices
4. **Installs/manages** - FDK and Node.js via optimal method
5. **Preserves existing** - Never removes user's Node versions
6. **Verifies setup** - Tests all components work correctly
7. **Reports status** - Comprehensive output with next steps


**Benefits:**
- Autonomous execution (minimal user intervention)
- Smart auto-detection (Homebrew/Chocolatey/nvm)
- Isolated error handling
- Progress tracking

**Limitation:**
- Only works when YOU explicitly invoke commands
- Does NOT automatically check FDK before app creation
- You must remember to run **`/fdk-setup-install`** first

## What's Included

### Core Files

```
fdk-setup/
├── SKILL.md                   # Main skill logic and operation templates
├── README.md                  # This file
│
├── .cursor-plugin/
│   └── plugin.json            # Command registration for Cursor
│
├── .claude-plugin/
│   └── plugin.json            # Command registration for Claude Code
│
├── commands/                  # Slash command definitions (/fdk-setup *)
│   ├── fdk-setup-install.md   # optional --version
│   ├── fdk-setup-upgrade.md   # optional --to
│   ├── 
│   ├── fdk-setup-downgrade.md # optional 9.x.y pin
│   ├── fdk-setup-uninstall.md
│   ├── fdk-setup-status.md    # optional --verbose
│   ├── fdk-setup-troubleshoot.md  # optional --fix
│   └── fdk-setup-use.md           # workspace nvm / .nvmrc
│
├── scripts/
│   ├── fdk-run-background.sh  # nohup fdk run … (returns immediately)
│   └── stop-fdk-shell-tasks.sh # SIGTERM matching fdk run / fdk tunnel (optional --force)
│
└── references/                # Loaded by SKILL.md on-demand
    ├── cross-scenarios.md     # Complex installation scenarios
    ├── macos.md               # macOS-specific details
    ├── windows.md             # Windows-specific details
    └── real-world-scenarios.md # Real-world testing scenarios
```

### Command Registration

Commands are registered in `plugin.json`:

```json
{
  "commands": [
    {
      "name": "fdk-setup-install",
      "description": "Install FDK 10 + Node 24",
      "file": "commands/fdk-setup-install.md"
    }
  ]
}
```

Claude Code/Cursor reads `plugin.json` to discover and register slash commands.

### Key Features

- **Smart Auto-Detection** - Detects Homebrew/Chocolatey, Node versions, asks only when needed
- **Subagent Execution** - Mutating commands use shell Tasks; **`/fdk-setup-status`**, **`/fdk-setup-troubleshoot`** (no **`--fix`**), and **`/fdk-setup-use`** are inline
- **Version Isolation** - Uses nvm to preserve existing Node versions
- **Error Recovery** - Automatic retry and fallback strategies
- **Cross-Platform** - macOS (Homebrew), Windows (Chocolatey), Linux (nvm)

## Requirements

- **Cursor IDE** or **Claude Code**
- **nvm** (installed automatically on macOS/Linux)
- **nvm-windows** (manual install required on Windows)
- **Node.js 24.0.0+** (installed automatically via nvm)

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT

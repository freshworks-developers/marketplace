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
> - **FDK 9.x + Node 18.x** (Deprecated) - Allowed for development only, ends March 2026

> **PLATFORM 3.0 ONLY**: Platform 2.3 is deprecated. Both FDK versions support Platform 3.0.

> **IMPORTANT**: This skill provides manual commands. You must explicitly run `/fdk-install` before creating Freshworks apps. The skill does NOT automatically check for FDK prerequisites.

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
/fdk-
# You should see 5 commands in autocomplete
```

## FDK Version Support Policy

**Platform 3.0 Development:** Both FDK 10.x and FDK 9.x work with Platform 3.0.

### FDK 10.x + Node 24.x (Recommended)
- **Status:** Active, supported until December 2027
- **Use for:** All new development
- **Publishing:** Required for marketplace submission
- **Command:** `/fdk-install` (default)

### FDK 9.x + Node 18.x (Deprecated)
- **Status:** Deprecated, support ends March 2026
- **Use for:** Development only (legacy projects)
- **Publishing:** NOT SUPPORTED
- **Command:** `/fdk-downgrade` (shows deprecation warning)
- **Warning:** Automatic prompt before installation

### Platform 2.3 (Rejected)
- **Status:** Deprecated, no support
- **This skill:** Platform 3.0 ONLY

## Usage

### Manual Commands (Always Work)

**You must explicitly run these commands:**

```bash
/fdk-install                    # Install FDK 10.x + Node 24 (recommended)
/fdk-upgrade                    # Upgrade to latest FDK 10.x
/fdk-downgrade                  # Downgrade to FDK 9.x + Node 18 (shows deprecation warning)
/fdk-uninstall                  # Complete removal: npm + ~/.fdk + cache + shell config
/fdk-status                     # Check installation status
```

**Local dev (background, not a slash command):** from your app directory (where `manifest.json` lives), run the script by absolute path, for example:

`bash /path/to/marketplace/skills/fdk-setup/scripts/fdk-run-background.sh`

Logs and a PID file go under `${TMPDIR:-/tmp}/fdk-setup-runs/` unless `FDK_RUN_LOG_DIR` is set. To signal matching `fdk run` / `fdk tunnel` processes: `bash .../scripts/stop-fdk-shell-tasks.sh` (`--dry-run`, `--force`).

### Key Features

**Install (`/fdk-install`):**
- Installs FDK 10.x with Node.js 24.x via nvm (default)
- Auto-detects existing Node installations
- Sets up global persistence across all terminals
- Comprehensive verification in new shells

**Upgrade (`/fdk-upgrade`):**
- Upgrades to latest FDK 10.x version
- Complete uninstall of previous version before upgrade
- Removes ~/.fdk directory to prevent conflicts
- Preserves Node 24 configuration

**Downgrade (`/fdk-downgrade`):**
- Downgrades from FDK 10.x to FDK 9.x (Node 24 → Node 18)
- Shows deprecation warning (FDK 9.x ends March 2026)
- Requires confirmation before proceeding
- Complete cleanup of FDK 10.x before installing 9.x
- Warns that publishing requires FDK 10.x
- Use for development only

**Uninstall (`/fdk-uninstall`):**
- Complete removal: npm package + binary + node_modules
- Removes ~/.fdk directory completely
- Cleans npm cache to prevent reinstall issues
- Removes shell config references (with backup)
- Manual binary removal if npm uninstall fails
- Comprehensive verification of complete removal

### ⚠️ IMPORTANT: Run Before Creating Apps

**Before creating any Freshworks app, you MUST run:**
```bash
/fdk-install
```

**Why?** Cursor does not automatically check for FDK prerequisites. If you skip this step and try to create an app, the agent may create files manually without proper validation.

### When Agent Might Auto-Invoke

The agent *may* automatically load this skill when you explicitly mention:
- "install fdk"
- "setup fdk"
- "check fdk status"

**However:** If you just say "create a freshdesk app", the agent will likely skip the FDK check and create files manually. Always run `/fdk-install` first.

## How It Works

### Command Flow (Manual Invocation)

```
User types: /fdk-install
    ↓
Cursor reads: commands/fdk-install.md
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

When you run a command (e.g., `/fdk-install`), it spawns a **dedicated shell subagent** that:

1. **Auto-detects environment** - OS, Node.js, package managers (Homebrew/Chocolatey)
2. **Smart decision-making** - Chooses best installation method automatically
3. **Asks only when needed** - User input only for meaningful choices
4. **Installs/manages** - FDK and Node.js via optimal method
5. **Preserves existing** - Never removes user's Node versions
6. **Verifies setup** - Tests all components work correctly
7. **Reports status** - Comprehensive output with next steps

Slash commands that use a shell Task (`/fdk-install`, `/fdk-upgrade`, `/fdk-downgrade`, `/fdk-uninstall`) **must close out** when done: return after the final report—do not leave `fdk run` or similar running inside that Task (`/fdk-status` is inline only).

**Benefits:**
- Autonomous execution (minimal user intervention)
- Smart auto-detection (Homebrew/Chocolatey/nvm)
- Isolated error handling
- Progress tracking

**Limitation:**
- Only works when YOU explicitly invoke commands
- Does NOT automatically check FDK before app creation
- You must remember to run `/fdk-install` first

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
├── commands/                  # Slash command definitions
│   ├── fdk-install.md         # /fdk-install (smart auto-detection)
│   ├── fdk-upgrade.md         # /fdk-upgrade
│   ├── fdk-downgrade.md       # /fdk-downgrade <version>
│   ├── fdk-uninstall.md       # /fdk-uninstall
│   └── fdk-status.md          # /fdk-status
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
      "name": "fdk-install",
      "description": "Smart FDK installation with auto-detection",
      "file": "commands/fdk-install.md"
    }
  ]
}
```

Claude Code/Cursor reads `plugin.json` to discover and register slash commands.

### Key Features

- **Smart Auto-Detection** - Detects Homebrew/Chocolatey, Node versions, asks only when needed
- **Subagent Execution** - All commands use Task tool with shell subagents
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

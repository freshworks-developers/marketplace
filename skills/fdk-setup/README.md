<h1 align="center">FDK Setup</h1>

<p align="center"><strong>Automated Freshworks FDK installation and management</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Plugin-00a67e?style=for-the-badge" alt="Cursor Plugin">
  <img src="https://img.shields.io/badge/FDK-10.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/macOS-Supported-000000?style=flat-square&logo=apple&logoColor=white" alt="macOS">
  <img src="https://img.shields.io/badge/Windows-Supported-0078D6?style=flat-square&logo=windows&logoColor=white" alt="Windows">
</p>

<p align="center">Manual commands for FDK lifecycle management on macOS and Windows.<br>Install, upgrade, downgrade, and uninstall FDK using <strong>subagents</strong> with <strong>nvm</strong> and <strong>Node.js 24</strong>.</p>

<p align="center"><code>Manual Commands</code> · <code>Subagent-Based</code> · <code>nvm</code> · <code>Node.js 24</code> · <code>Autonomous Execution</code></p>

> **⚠️ IMPORTANT**: This skill provides manual commands. You must explicitly run `/fdk-install` before creating Freshworks apps. The skill does NOT automatically check for FDK prerequisites.

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

## Usage

### Manual Commands (Always Work)

**You must explicitly run these commands:**

```bash
/fdk-install                    # Smart install: auto-detects Node, asks only when needed
/fdk-upgrade                    # Upgrade to latest FDK (preserves Node version)
/fdk-downgrade 10.0.0           # Downgrade to specific version (asks about Node if needed)
/fdk-uninstall                  # Remove FDK (keeps Node.js/nvm)
/fdk-status                     # Check installation status
```

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

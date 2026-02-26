<h1 align="center">FDK Setup</h1>

<p align="center"><strong>Automated Freshworks FDK installation and management</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Plugin-00a67e?style=for-the-badge" alt="Cursor Plugin">
  <img src="https://img.shields.io/badge/FDK-9.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/macOS-Supported-000000?style=flat-square&logo=apple&logoColor=white" alt="macOS">
  <img src="https://img.shields.io/badge/Windows-Supported-0078D6?style=flat-square&logo=windows&logoColor=white" alt="Windows">
</p>

<p align="center">100% automated FDK lifecycle management for macOS and Windows.<br>Install, upgrade, downgrade, and uninstall FDK using <strong>subagents</strong> with <strong>nvm</strong> and <strong>Node.js 18</strong>.</p>

<p align="center"><code>Subagent-Based</code> · <code>nvm</code> · <code>Node.js 18</code> · <code>Multi-Version Support</code> · <code>Autonomous Execution</code></p>

## Install

### Install via CLI:

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill fdk-setup
```

### Install as Claude Plugin

**Step1**

```bash
claude plugin marketplace add freshworks-developers/marketplace
```

**Step2**

```bash
claude plugin install <fdk-setup>@freshworks-developers
```

## Verify Installation

The plugin should appear in Cursor/Claude Settings → Plugins → Installed Plugins.


## Usage

**Auto-invoked by AI Agent:**
- Ask: "install fdk", "upgrade fdk", "how do I set up FDK?"
- Agent automatically loads the skill and spawns subagents

**Slash Commands:**
```bash
/fdk-setup install              # Install FDK with Node.js 18 via nvm
/fdk-setup upgrade              # Upgrade to latest FDK
/fdk-setup downgrade 9.6.0      # Downgrade to specific version
/fdk-setup uninstall            # Remove FDK (keeps Node.js/nvm)
/fdk-setup                      # Check installation status
```

## How It Works

Each command spawns a **dedicated shell subagent** that:

1. **Checks prerequisites** - OS, Node.js, nvm, existing FDK
2. **Installs/manages nvm** - Node Version Manager for version isolation
3. **Installs Node.js 18** - Latest 18.x via nvm (keeps other versions)
4. **Manages FDK** - Install/upgrade/downgrade via npm or Homebrew
5. **Configures environment** - PATH, shell aliases, nvm aliases
6. **Verifies setup** - Tests all components work correctly
7. **Reports status** - Comprehensive output with versions and next steps

**Benefits of Subagents:**
- Autonomous execution (no user intervention)
- Parallel command execution
- Isolated error handling
- Progress tracking
- Clean context management

## What's Included

**Skills:**
- `fdk-setup` - Subagent-based FDK lifecycle management

**Commands:**
- `/fdk-setup install` - Install FDK with Node.js 18 via nvm
- `/fdk-setup upgrade` - Upgrade to latest FDK version
- `/fdk-setup downgrade` - Downgrade to specific FDK version
- `/fdk-setup uninstall` - Remove FDK (keeps Node.js/nvm)
- `/fdk-setup` - Check installation status

**References:**
- `macos.md` - nvm + Node.js 18 + FDK setup for macOS
- `windows.md` - nvm-windows + Node.js 18 + FDK setup for Windows

**Key Features:**
- **nvm Integration** - Manages Node.js 18 alongside other versions
- **Version Isolation** - FDK uses Node 18, other projects use their versions
- **Subagent Execution** - Autonomous multi-step operations
- **Parallel Checks** - Fast prerequisite validation
- **Error Recovery** - Automatic retry and fallback strategies

## Requirements

- **Cursor IDE** or **Claude Code**
- **nvm** (installed automatically on macOS/Linux)
- **nvm-windows** (manual install required on Windows)
- **Node.js 18.13.0+** (installed automatically via nvm)

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT

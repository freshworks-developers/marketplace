<h1 align="center">Freshworks Marketplace Skills</h1>

<p align="center"><strong>App Development Kit for AI coding assistants (Claude Code, Cursor, etc.) that provide Freshworks Platform 3.0 guidance.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Skill-00a67e?style=for-the-badge" alt="Cursor Skill">
  <img src="https://img.shields.io/badge/Crayons-4.x-00a67e?style=for-the-badge" alt="Crayons">
  <img src="https://img.shields.io/badge/FDK-10.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/FDK-10.x-0052cc?style=flat-square" alt="FDK">
  <img src="https://img.shields.io/badge/Plugins-3-764abc?style=flat-square" alt="Plugins">
</p>

<p align="center">Agentic App Development Kit for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code></p>

## Installation

### npx skills

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill app-dev
npx skills add https://github.com/freshworks-developers/marketplace --skill fdk-setup
npx skills add https://github.com/freshworks-developers/marketplace --skill publish
```


## Available Skills

| Skill | Description | Execution Mode |
|-------|-------------|----------------|
| [**app-dev**](skills/app-dev/) | Build, debug, review, and migrate Freshworks Platform 3.0 apps | Direct |
| [**fdk-setup**](skills/fdk-setup/) | Automated FDK 10 installation with Node.js 24 via nvm using subagents | **Subagent-Based** |
| [**publish**](skills/publish/) | Guide for publishing Freshworks apps to the marketplace | Direct |

### Subagent-Based Skills

The **fdk-setup** skill uses Cursor's Task tool to spawn dedicated shell subagents for complex multi-step operations:

**Features:**
- ✅ **nvm Integration** - Manages Node.js 24 alongside other versions
- ✅ **Version Isolation** - FDK uses Node 24, other projects keep their versions
- ✅ **Autonomous Execution** - No user intervention required
- ✅ **Parallel Checks** - Fast prerequisite validation
- ✅ **Error Recovery** - Automatic retry and fallback strategies
- ✅ **Progress Tracking** - Real-time status updates
- ✅ **Backward Compatibility** - Supports FDK 9.x → 10.x migration, multiple Node versions, legacy apps
- ✅ **Cross-Platform** - macOS, Windows, Linux, CI/CD, Docker

**Operations:**
```bash
/fdk-setup-install          # Subagent: nvm → Node 24.11 → FDK 10 (CDN); optional --version X.Y.Z
/fdk-setup-upgrade          # Subagent: latest FDK 10 line; optional --to X.Y.Z
/fdk-setup-migrate          # Subagent: FDK 9 + Node 18 → FDK 10 + Node 24.11
/fdk-setup-downgrade        # Subagent: FDK 10 → 9; optional 9.x.y semver (deprecated)
/fdk-setup-uninstall        # Subagent: remove FDK only (keep Node/nvm)
/fdk-setup-status           # Inline; optional --verbose diagnostics
/fdk-setup-troubleshoot     # Inline diagnose; --fix = shell Task (rc + nvm + FDK)
/fdk-setup-use              # Workspace: nvm use / .nvmrc for FDK 10 vs 9 stack (inline)
```

**Cross-Scenarios (7 scenarios via subagents):**
- 🔄 **Legacy Migration** - FDK 9.x → 10.x with Node 18 → 24
- 📦 **Existing Node** - Install FDK alongside system Node.js
- ⬇️ **Downgrade** - Temporary downgrade for legacy app maintenance
- 🔧 **Troubleshooting** - Diagnose and fix broken installations (auto-fix mode)
- 🎯 **Specific Version** - Install exact FDK version (e.g., 10.6.0)
- 🛤️ **Node PATH Mismatch** - Fix FDK using wrong Node version
- 🔀 **Multiple Node Versions** - Multiple projects with different Node versions

See [cross-scenarios.md](skills/fdk-setup/references/cross-scenarios.md) for detailed subagent prompts.

## Structure

Each skill follows the Agent Skills Specification:

```
skill-name/
├── SKILL.md           # Main skill file with frontmatter + instructions
├── commands/          # Slash commands with always: true (fdk-setup)
├── references/        # Additional documentation loaded on demand
└── assets/            # Templates, logos, etc.
```

### Project-Level Installation

Skills are also available project-wide via `.cursor/skills/`:

```
.cursor/
├── README.md          # Configuration documentation
└── skills/
    └── fdk-setup/     # Symlink to ../../skills/fdk-setup
```

This allows project contributors to use skills without global installation.


## Skill Discovery

Skills are automatically discovered via `SKILL.md` frontmatter:

```yaml
---
name: "freshworks-app-dev-skill"
description: "Build Platform 3.0 apps"
version: "1.0.0"
---
```

No manifest generation or registry required. Each skill is self-contained and declarative.

## Troubleshooting

Having issues with skills installation or usage?

- 📋 [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) - Complete guide for Cursor and Claude Code skill issues

**Common issues:**
- Skills not recognized → Check `SKILL.md` and `plugin.json` structure
- Commands not working → Verify `rulesDirectory` and `commandsDirectory` in plugin.json
- Rules not applying → Ensure rules are in `skills/{skill}/rules/` (not `.cursor/rules/`)

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)
- 💡 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Skills installation & usage guide

## License

MIT

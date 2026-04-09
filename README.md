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

### For Cursor:

```bash
npx skills add https://github.com/freshworks-developers/marketplace/skills/app-dev --skill
npx skills add https://github.com/freshworks-developers/marketplace/skills/fdk-setup --skill
npx skills add https://github.com/freshworks-developers/marketplace/skills/publish --skill
```

### Or add individual skills
```bash
npx skills add https://github.com/freshworks-developers/marketplace/skills/app-dev --skill app-dev
```


## Available Skills

| Skill | Description | Execution Mode |
|-------|-------------|----------------|
| [**freshworks-app-dev-skill**](skills/app-dev/) | Build, debug, review, and migrate Freshworks Platform 3.0 apps | Direct |
| [**freshworks-fdk-setup-skill**](skills/fdk-setup/) | Automated FDK 10 installation with Node.js 24 via nvm using subagents | **Subagent-Based** |
| [**freshworks-publish-skill**](skills/publish/) | Guide for publishing Freshworks apps to the marketplace | Direct |

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
/fdk-install                # Spawns subagent: nvm → Node 24 → FDK 10
/fdk-upgrade                # Spawns subagent: ensure Node 24 → upgrade FDK
/fdk-downgrade 10.0.0       # Spawns subagent: ensure Node 24 → downgrade FDK only
/fdk-uninstall              # Spawns subagent: remove FDK (keep Node/nvm)
/fdk-status                 # Spawns subagent: status check
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

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT

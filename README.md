<h1 align="center">Freshworks Marketplace Skills</h1>

<p align="center"><strong>Skills for AI coding assistants (Claude Code, Cursor, etc.) that provide Freshworks Platform 3.0 guidance.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Skill-00a67e?style=for-the-badge" alt="Cursor Skill">
  <img src="https://img.shields.io/badge/Crayons-4.x-00a67e?style=for-the-badge" alt="Crayons">
  <img src="https://img.shields.io/badge/FDK-9.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/FDK-9.6+-0052cc?style=flat-square" alt="FDK">
  <img src="https://img.shields.io/badge/Plugins-3-764abc?style=flat-square" alt="Plugins">
</p>

<p align="center">Production-ready Cursor plugins for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code></p>

## Installation

### For Claude Code:

```bash
databricks experimental aitools skills install
```
This installs skills to ~/.claude/skills/ for use with Claude Code.

### For Cursor:

```bash
npx skills add https://github.com/freshworks-developers/marketplace/skills/app-dev --skill
npx skills add https://github.com/freshworks-developers/marketplace/skills/fdk-setup --skill
npx skills add https://github.com/freshworks-developers/marketplace/skills/publish --skill
```

### Or add individual skills
```bash
npx skills add https://github.com/freshworks-developers/marketplace/skills/app-dev
```

### In chat:

# Or add individual skills
npx skills add https://github.com/freshworks-developers/marketplace/skills/app-dev
```




## Available Skills

| Skill | Description | Execution Mode |
|-------|-------------|----------------|
| [**freshworks-app-dev-skill**](skills/app-dev/) | Build, debug, review, and migrate Freshworks Platform 3.0 apps | Direct |
| [**freshworks-fdk-setup-skill**](skills/fdk-setup/) | Automated FDK installation with Node.js 18 via nvm using subagents | **Subagent-Based** |
| [**freshworks-publish-skill**](skills/publish/) | Guide for publishing Freshworks apps to the marketplace | Direct |

### Subagent-Based Skills

The **fdk-setup** skill uses Cursor's Task tool to spawn dedicated shell subagents for complex multi-step operations:

**Features:**
- ✅ **nvm Integration** - Manages Node.js 18 alongside other versions
- ✅ **Version Isolation** - FDK uses Node 18, other projects keep their versions
- ✅ **Autonomous Execution** - No user intervention required
- ✅ **Parallel Checks** - Fast prerequisite validation
- ✅ **Error Recovery** - Automatic retry and fallback strategies
- ✅ **Progress Tracking** - Real-time status updates

**Operations:**
```bash
/fdk-setup install          # Spawns subagent: nvm → Node 18 → FDK
/fdk-setup upgrade          # Spawns subagent: ensure Node 18 → upgrade FDK
/fdk-setup downgrade 9.6.0  # Spawns subagent: ensure Node 18 → downgrade FDK only
/fdk-setup uninstall        # Spawns subagent: remove FDK (keep Node/nvm)
/fdk-setup                  # Spawns subagent: status check
```

## Structure

Each skill follows the Agent Skills Specification:

```
skill-name/
├── SKILL.md           # Main skill file with frontmatter + instructions
├── references/        # Additional documentation loaded on demand
├── assets/            # Templates, logos, etc.
└── .cursor/
    └── commands/      # Slash commands (optional)
```

### Subagent Architecture

Skills can use **subagent-based execution** for complex operations:

```javascript
// In SKILL.md, when operation is triggered:
Task({
  subagent_type: "shell",      // Shell specialist for commands
  model: "fast",               // Fast model for straightforward tasks
  description: "Brief summary", // 3-5 words
  prompt: `Detailed instructions with:
    - Requirements
    - Step-by-step workflow
    - Error handling
    - Output format
  `
})
```
## Manifest Management

Generate manifest after adding or updating skills:

```bash
python3 scripts/generate_manifest.py
```

Validate that manifest is up to date (for CI):

```bash
python3 scripts/generate_manifest.py validate
```

The manifest is used by the CLI to discover available skills.

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT

<h1 align="center">Freshworks Marketplace Skills</h1>

<p align="center"><strong>App Development Kit for AI coding assistants (Claude Code, Cursor, etc.) that provide Freshworks Platform 3.0 guidance.</strong></p>

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
| [**freshworks-fdk-setup-skill**](skills/fdk-setup/) | Automated FDK installation with Node.js 18 via nvm using subagents | **Subagent-Based** |
| [**freshworks-publish-skill**](skills/publish/) | Validate, pack, and publish Platform 3.0 apps (FDK + AMP API) via pure shell subagents | **Subagent-based** ([SKILL.md](skills/publish/SKILL.md)) |

### Subagent-Based Skills

Both **fdk-setup** and **publish** skills use Cursor's Task tool to spawn dedicated shell subagents for complex multi-step operations following **skills-main patterns**:

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


## Skill Discovery

Skills are discovered automatically by AI agents through the `skills/` directory structure. Each skill has a `SKILL.md` file with frontmatter metadata that agents read to understand capabilities and when to trigger.

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT

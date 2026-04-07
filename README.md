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
  <img src="https://img.shields.io/badge/FDK-10.0.0-0052cc?style=flat-square" alt="FDK">
  <img src="https://img.shields.io/badge/Multi_IDE-Support-764abc?style=flat-square" alt="Multi-IDE">
</p>

<p align="center">Agentic App Development Kit for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code></p>

## Installation

### Claude Code (via Plugin Marketplace)

```bash
# Add marketplace
claude plugin marketplace add freshworks-developers/marketplace

# Install the plugin (single plugin with all skills)
claude plugin install freshworks@freshworks-marketplace
```

### Cursor (via Plugin Marketplace)

In Cursor Agent chat, add the marketplace and install:

```
/add-plugin freshworks
```

Or search for "freshworks" in the plugin marketplace.

### npx skills

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill app-dev
```


## App Development Skill

[**freshworks-app-dev-skill**](skills/app-dev/) - Expert-level development skill for building, debugging, reviewing, and migrating Freshworks Platform 3.0 marketplace applications.

**Features:**
- ✅ **Platform 3.0 Enforcement** - Zero tolerance for legacy patterns
- ✅ **Validation-Driven** - Iterates until `fdk validate` shows zero errors
- ✅ **Manifest Generation** - Auto-generates correct Platform 3.0 manifests
- ✅ **OAuth Integration** - Full support for OAuth 2.0 configuration
- ✅ **Request Templates** - Proper request template syntax and validation
- ✅ **Crayons UI** - Integrated Crayons 4.x component support

**Commands:**
```bash
/app-dev                    # General app development assistance
/fdk-fix                    # Fix validation errors
/fdk-migrate                # Migrate Platform 2.x to 3.0
/fdk-review                 # Review manifest and configs
```

## Structure


```
marketplace/
├── .cursor/
│   ├── rules/         # Platform 3.0 enforcement rules
│   └── agents/        # Specialized agents
├── .claude-plugin/    # Claude Code plugin config
├── .cursor-plugin/    # Cursor plugin config
└── skills/
    └── app-dev/       # App development skill
```

Each skill follows the Agent Skills Specification:

```
skill-name/
├── SKILL.md           # Main skill file with frontmatter + instructions
├── references/        # Additional documentation loaded on demand
├── assets/            # Templates, logos, etc.
└── commands/          # Slash commands (optional)
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

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
  <img src="https://img.shields.io/badge/Plugins-5-764abc?style=flat-square" alt="Plugins">
</p>

<p align="center">Agentic App Development Kit for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code></p>

> [!NOTE]
> Feedback and bug reports: **[GitHub Issues](https://github.com/freshworks-developers/marketplace/issues)**. **AI agents:** start from **[AGENTS.md](AGENTS.md)** for routing, skills layout, and repo norms.

> [!TIP]
> **Human install & routing:** use **this README** (installation below), **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for Cursor / Claude Code skill issues, and the **[Freshworks Developer Portal](https://developers.freshworks.com/)** for product documentation and API keys.

## Installation

### npx skills

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-setup
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-ai-app-dev
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-review
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-publish
```


## Available Skills

Rows are ordered for a typical **toolchain → app → publish** journey. One-line summaries only—each folder has its own **`README.md`** and **`SKILL.md`**. **Routing, lifecycle, slash commands, rules inventory, and MCP** live in **[`AGENTS.md`](AGENTS.md)** (do not duplicate them here).

| Skill | One-line summary |
|-------|------------------|
| [**fw-setup**](skills/fw-setup/) | FDK and Node.js install / lifecycle via nvm |
| [**fw-app-dev**](skills/fw-app-dev/) | Full Platform 3.0 marketplace apps: manifest, requests, OAuth, serverless, UI |
| [**fw-ai-app-dev**](skills/fw-ai-app-dev/) | AI Actions (`actions.json`), SMI, request templates, validation |
| [**fw-review**](skills/fw-review/) | Structured pre-submission audit (rules + scripts) |
| [**fw-publish**](skills/fw-publish/) | Marketplace publish via MCP (validate, pack, upload, submit/update) |

## Structure

Each skill follows the Agent Skills Specification:

```
skill-name/
├── SKILL.md           # Main skill file with frontmatter + instructions
├── commands/          # Slash commands (where the skill defines them)
├── rules/             # Editor or audit rules (.mdc and/or .md)
├── scripts/           # Optional deterministic checks
├── references/        # Additional documentation loaded on demand
└── assets/            # Templates, logos, etc.
```

### Project-Level Installation

Skills are also available project-wide via `.cursor/skills/`:

```
.cursor/
├── README.md          # Configuration documentation
└── skills/
    └── <skill-name>/  # Symlink or copy from ../../skills/<skill-name>
```

This allows project contributors to use skills without global installation.

**Rules, slash commands, and check scripts:** full file inventory and marketplace paths are in **[`AGENTS.md`](AGENTS.md)** under **Rules and slash commands (inventory)**—update that section when you add or rename files.


## Skill Discovery

Skills are automatically discovered via `SKILL.md` frontmatter:

```yaml
---
name: "<skill-id>"
description: "Short description for discovery"
version: "1.0.0"
---
```

Other skills use the same frontmatter shape with their own `name` (see the **Available Skills** table). No manifest generation or registry required; each skill is self-contained and declarative.

## MCP (marketplace publish)

Publishing uses the **`freshworks-marketplace`** server. This repo **bundles** **`.mcp.json`** at the repository root (URL + `Authorization` header). **Claude Code** vs **Cursor** token placement, copy-paste blocks, and tool names are documented in **[`AGENTS.md`](AGENTS.md)** (MCP section) and the publish skill’s own files under **`skills/fw-publish/`**—not duplicated here.

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

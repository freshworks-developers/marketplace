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

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code> · <code>fw-review</code></p>

> [!NOTE]
> Feedback and bug reports: **[GitHub Issues](https://github.com/freshworks-developers/marketplace/issues)**. **AI agents:** start from **[AGENTS.md](AGENTS.md)** for routing, skills layout, and repo norms.

> [!TIP]
> **Human install & routing:** use **this README** (installation below), **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for Cursor / Claude Code skill issues, and the **[Freshworks Developer Portal](https://developers.freshworks.com/)** for product documentation and API keys.

## Installation

### npx skills

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-ai-app-dev
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-review
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-setup
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-publish
```


## Available Skills

| Skill | Description | Execution Mode |
|-------|-------------|----------------|
| [**fw-app-dev**](skills/fw-app-dev/) | Build, debug, review, and migrate Freshworks Platform 3.0 apps | Direct |
| [**fw-ai-app-dev**](skills/fw-ai-app-dev/) | AI Actions: `actions.json`, SMI, request templates, integrations, validation | Direct |
| [**fw-review**](skills/fw-review/) | Automated marketplace app audit: iparams, frontend, script checks, structured report | Direct |
| [**fw-setup**](skills/fw-setup/) | Automated FDK 10 installation with Node.js 24 via nvm using subagents | **Subagent-Based** |
| [**fw-publish**](skills/fw-publish/) | Guide for publishing Freshworks apps to the marketplace | Direct |

### Automated app review (`fw-review`)

[**fw-review**](skills/fw-review/) is a separate skill from **fw-app-dev**’s `/fdk-review` (validate rounds). It runs a **fixed, silent pipeline**: read `manifest.json` and iparams per `rules/*.md`, execute **deterministic** checks from `scripts/*.js` for SC-* rule IDs, apply frontend FF-* rules, and emit a structured **App Review Result** (format in `skills/fw-review/rules/report.md`). Use it when you want a **repeatable audit** before QA or marketplace submission. **FDK** is not bundled with the repo—ensure `fdk` is available (e.g. via [**fw-setup**](skills/fw-setup/)) for phases that need it. More detail: [`skills/fw-review/README.md`](skills/fw-review/README.md).

### Subagent-Based Skills

The **fw-setup** skill uses Cursor's Task tool to spawn dedicated shell subagents for complex multi-step operations:

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
/fw-setup-install          # Subagent: nvm → Node 24.11 → FDK 10 (CDN); optional --version X.Y.Z
/fw-setup-upgrade          # Subagent: latest FDK 10 line; optional --to X.Y.Z
/fw-setup-downgrade        # Subagent: FDK 10 → 9; optional 9.x.y semver (deprecated)
/fw-setup-uninstall        # Subagent: remove FDK only (keep Node/nvm)
/fw-setup-status           # Inline; optional --verbose diagnostics
/fw-setup-troubleshoot     # Inline diagnose; --fix = shell Task (rc + nvm + FDK)
/fw-setup-use              # Workspace: nvm use / .nvmrc for FDK 10 vs 9 stack (inline)
```

**Cross-Scenarios (7 scenarios via subagents):**
- 🔄 **Legacy Migration** - FDK 9.x → 10.x with Node 18 → 24
- 📦 **Existing Node** - Install FDK alongside system Node.js
- ⬇️ **Downgrade** - Temporary downgrade for legacy app maintenance
- 🔧 **Troubleshooting** - Diagnose and fix broken installations (auto-fix mode)
- 🎯 **Specific Version** - Install exact FDK version (e.g., 10.6.0)
- 🛤️ **Node PATH Mismatch** - Fix FDK using wrong Node version
- 🔀 **Multiple Node Versions** - Multiple projects with different Node versions

See [cross-scenarios.md](skills/fw-setup/references/cross-scenarios.md) for detailed subagent prompts.

## Structure

Each skill follows the Agent Skills Specification:

```
skill-name/
├── SKILL.md           # Main skill file with frontmatter + instructions
├── commands/          # Slash commands (e.g. fw-setup, fw-app-dev)
├── rules/             # Editor rules (.mdc) or review rules (.md)
├── scripts/           # Optional deterministic checks (e.g. fw-review)
├── references/        # Additional documentation loaded on demand
└── assets/            # Templates, logos, etc.
```

### Project-Level Installation

Skills are also available project-wide via `.cursor/skills/`:

```
.cursor/
├── README.md          # Configuration documentation
└── skills/
    └── fw-setup/     # Symlink to ../../skills/fw-setup
```

This allows project contributors to use skills without global installation.

**Rules, slash commands, and check scripts:** every `rules/*` and `commands/*` file (and **fw-review** `scripts/*`) is enumerated in **[`AGENTS.md`](AGENTS.md)** under **Rules and slash commands (inventory)**—update that section when you add or rename files so marketplace `rulesPath` / `commandsPath` stay accurate.


## Skill Discovery

Skills are automatically discovered via `SKILL.md` frontmatter:

```yaml
---
name: "fw-app-dev"
description: "Build Platform 3.0 apps"
version: "1.0.0"
---
```

Other skills in this repo use `name` values such as `fw-setup`, `fw-publish`, `fw-ai-app-dev`, and `fw-review` in the same frontmatter shape. No manifest generation or registry required; each skill is self-contained and declarative.

## MCP (marketplace publish)

Publishing uses the **`freshworks-marketplace`** server. This repo **bundles** **`.mcp.json`** at the repository root (URL + `Authorization` header). **Claude Code** can use the plugin’s **`userConfig`** token with that file’s **`${user_config.mcp_auth_token}`** placeholder; **Cursor** should merge the same server block into **`.cursor/mcp.json`** with a real **`Bearer <JWT>`** (see **`AGENTS.md`** and **`skills/fw-publish/SKILL.md`**).

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

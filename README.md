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
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-setup
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-ai-app-dev
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-review
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-publish
```


## Available Skills

Skills are ordered roughly how you use them from a **cold machine** through a **shipped marketplace app**. You do not need every skill for every task (for example, AI Actions–only work may never touch **fw-app-dev** UI locations).

| Skill | Description | Execution Mode |
|-------|-------------|----------------|
| [**fw-setup**](skills/fw-setup/) | Install, upgrade, and troubleshoot **FDK** and **Node.js** (nvm), including persistence across shells | **Subagent-Based** |
| [**fw-app-dev**](skills/fw-app-dev/) | Build, debug, migrate, and validate full **Platform 3.0** marketplace apps (manifest, modules, requests, OAuth, serverless, Crayons) | Direct |
| [**fw-ai-app-dev**](skills/fw-ai-app-dev/) | **AI Actions** and integrations: `actions.json`, SMI, request templates, schemas, test data, `fdk validate` | Direct |
| [**fw-review**](skills/fw-review/) | Structured **pre-submission audit**: iparams, frontend rules, deterministic `scripts/*.js` checks, fixed report format | Direct |
| [**fw-publish**](skills/fw-publish/) | **Marketplace publish** via MCP: `fdk validate` / `fdk pack`, app upload, submit or update version | Direct |

### From toolchain to marketplace (complete lifecycle)

1. **Toolchain — [fw-setup](skills/fw-setup/)**  
   Start here on a new machine, CI image, or broken shell: install **FDK 10.x** on **Node 24.x** (recommended for publishing), align **nvm** / PATH, and recover from version drift. Without a working `fdk`, later steps (`fdk validate`, `fdk pack`, review scripts that assume FDK) stall. Slash commands such as `/fw-setup-install`, `/fw-setup-status`, and `/fw-setup-troubleshoot` wrap that work (see **Subagent-Based Skills** below for how **fw-setup** runs).

2. **Application development — [fw-app-dev](skills/fw-app-dev/)**  
   Build or migrate the **full** Platform 3.0 app: `manifest.json` (`modules`), `config/requests.json`, OAuth, serverless handlers, frontend locations, Crayons UI, and `fdk validate` with guided fixes. Commands like `/fdk-fix`, `/fdk-migrate`, `/fdk-refactor`, and `/fdk-review` (validate rounds) live here. This skill does **not** install FDK—pair it with **fw-setup**.

3. **AI Actions & APIs — [fw-ai-app-dev](skills/fw-ai-app-dev/)**  
   When the product surface is **`actions.json`** plus serverless SMI (not a full sidebar UI app), use this skill for flat request schemas, `$request.invokeTemplate`, `server/server.js` patterns, test payloads, and integration checklists. It complements **fw-app-dev**; for a combined app (UI + actions), use both as the work requires.

4. **Pre-flight audit — [fw-review](skills/fw-review/)**  
   Before heavy QA or marketplace submission, run a **repeatable, policy-driven** pass: manifest and iparams rules, frontend FF-* checks, and SC-* checks backed by `scripts/*.js`, producing an **App Review Result** per `skills/fw-review/rules/report.md`. This is **not** the same as **fw-app-dev**’s `/fdk-review` (which re-runs `fdk validate`). Ensure **FDK** is on PATH when a phase needs it (**fw-setup**).

5. **Publish — [fw-publish](skills/fw-publish/)**  
   After the app validates and packs: configure the **`freshworks-marketplace`** MCP client (repo root **`.mcp.json`** template), then drive upload and **submit** or **update version** tools. Requires a Developer Portal JWT and a built zip from `fdk pack`. **fw-app-dev** (or **fw-ai-app-dev**) fixes validation issues; **fw-review** is optional but reduces surprises at upload.

**Typical thread:** **fw-setup** → **fw-app-dev** (and/or **fw-ai-app-dev**) → optional **fw-review** → **fw-publish**.

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

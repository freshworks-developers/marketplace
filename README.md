<h1 align="center">Freshworks Developer Tools</h1>

<p align="center"><strong>AI-powered toolkit for building Freshworks apps in Claude Code, Cursor, and OpenAI Codex</strong></p>

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

<p align="center">Build Freshworks marketplace apps faster with AI assistance.<br>Supports <strong>Platform 3.0</strong> with modern best practices.</p>

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code></p>

> [!NOTE]
> **Need help?** Report issues on [GitHub Issues](https://github.com/freshworks-developers/fw-dev-tools/issues). For AI agents, see [AGENTS.md](AGENTS.md) for technical details.

> [!TIP]
> **Getting started?** Jump to **[Installation](#installation)** (**[Contents](#contents)**). Use **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** if installs fail; use the [Developer Portal profile](https://developers.freshworks.com/developer/) when you need MCP / API keys for publish.

> **Pins & runbooks:** **[docs/engine-matrix.md](docs/engine-matrix.md)** (FDK / Node), **[docs/network-requirements.md](docs/network-requirements.md)** (firewall).

## Contents

| Section | Purpose |
|---------|---------|
| [What You Can Do](#what-you-can-do) | Capability overview |
| [Prerequisites](#prerequisites) | Before you run **`fdk`** or publish |
| [Installation](#installation) | Cursor, Claude Code, Codex — marketplace vs **`npx skills`** |
| [Available Tools](#available-tools) | Five skills at a glance |
| [Workflow](#step-by-step-workflow) | Idea → validated app → publish |
| [MCP (publish)](#mcp-marketplace-publish) | MCP / JWT — steps in **[AGENTS.md](AGENTS.md)** |
| [Troubleshooting](#troubleshooting) | Skills, rules, PATH, Codex |
| [Support](#support) | Docs, issues, conduct |
| [Contributing](#contributing) | Plugin layout, PR hygiene |

## What You Can Do

- **Set up your development environment** -  `fw-setup` Install and manage the Freshworks Development Kit (FDK) and Node.js.
- **Scaffold a Platform 3.0 app** — `/fdk-fix` and `/fdk-migrate` get you from a blank folder or a legacy 2.x app to a passing `fdk validate` output
- **Connect third-party APIs** — `fw-ai-actions-app` generates `actions.json`, SMI handlers, and OAuth request templates for services like Slack or Google
- **Catch issues before review** — `fw-review` runs the same checks marketplace reviewers use and outputs a structured report you can act on
- **Publish without leaving your IDE** — `fw-publish` guides you through `fdk validate → pack → upload → submit` via MCP, no browser required

## Prerequisites

| Topic | Guidance |
|-------|----------|
| **Installing these skills into an IDE** | Works without FDK installed first; skill content lives in **`skills/*/SKILL.md`** and plugin manifests. |
| **Running Freshworks workflows (`fdk`, validate, pack)** | Use **fw-setup** (FDK **10.x**, Node **24.11.x** per **[docs/engine-matrix.md](docs/engine-matrix.md)**). |
| **Publishing to Marketplace (MCP)** | One-time **Developer Portal JWT** + **fw-dev-mcp** config — see **[MCP (marketplace publish)](#mcp-marketplace-publish)** → **[AGENTS.md](AGENTS.md)** (no keys in chat). |
| **Corporate networks** | Firewall / proxy: **[docs/network-requirements.md](docs/network-requirements.md)**. |

---

## Installation

Skills are packaged for **Cursor**, **Claude Code**, and **OpenAI Codex**. How you attach them differs slightly by client.

### Quick install

**Claude Code:**

```bash
claude plugin marketplace add freshworks-developers/fw-dev-tools
claude plugin install fw-setup@freshworks-dev-tools
claude plugin install fw-app-dev@freshworks-dev-tools
claude plugin install fw-ai-actions-app@freshworks-dev-tools
claude plugin install fw-review@freshworks-dev-tools
claude plugin install fw-publish@freshworks-dev-tools
```

**Cursor** — Skills CLI:

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-setup
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-ai-actions-app
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-review
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-publish
```

**OpenAI Codex:**

```bash
codex plugin marketplace add freshworks-developers/fw-dev-tools
```

> After install: restart your IDE, then type `/fw-setup-` in chat — autocomplete should list available commands.
> For publish workflows: configure the **fw-dev-mcp** JWT first — see **[AGENTS.md](AGENTS.md)**.

---


**Helpful links:**

| Need | Doc |
|------|-----|
| MCP bearer token, tool names | **[AGENTS.md](AGENTS.md)** |
| Rules/commands not appearing | **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** |
| FDK ↔ Node version matrix | **[docs/engine-matrix.md](docs/engine-matrix.md)** |
| Contributing / plugin inventories | **[CONTRIBUTING.md](CONTRIBUTING.md)** |

---


## Available Tools

Each tool helps with a specific part of app development. Use them in order for a complete workflow:

| Tool | What it does |
|------|--------------|
| [**fw-setup**](skills/fw-setup/) | Install and manage FDK (Freshworks Development Kit) and Node.js |
| [**fw-app-dev**](skills/fw-app-dev/) | Build complete marketplace apps with UI, OAuth, and integrations |
| [**fw-ai-actions-app**](skills/fw-ai-actions-app/) | Add AI Actions and connect to third-party services |
| [**fw-review**](skills/fw-review/) | Check your app for common issues before submission |
| [**fw-publish**](skills/fw-publish/) | Upload and publish your app to the Freshworks Marketplace |

## Step-by-Step Workflow

### 1. Set up your environment — [fw-setup](skills/fw-setup/)

Installs FDK 10.x + Node.js 24.x via nvm. Run this first — other skills require it.

| Command | What it does |
|---------|-------------|
| `/fw-setup-install` | Install FDK and Node.js |
| `/fw-setup-status` | Check what's currently installed |
| `/fw-setup-troubleshoot` | Fix PATH and shell config issues |

### 2. Build your app — [fw-app-dev](skills/fw-app-dev/)

Scaffold and develop a Platform 3.0 app with Crayons UI, OAuth, and serverless functions.

| Command | What it does |
|---------|-------------|
| `/fdk-fix` | Fix `fdk validate` errors automatically |
| `/fdk-migrate` | Upgrade a legacy 2.x app to Platform 3.0 |
| `/fdk-review` | Full app audit before submission |

> **Validation order:** fw-setup first (when Node/FDK is wrong) → `/fdk-migrate` (legacy apps) → `fdk validate`

### 3. Add AI features — [fw-ai-actions-app](skills/fw-ai-actions-app/) _(optional)_

Connect to external APIs (Slack, Google, etc.) and add AI Actions using `actions.json`, SMI handlers, and request templates.

### 4. Review before submitting — [fw-review](skills/fw-review/)

Runs the same checks marketplace reviewers use: manifest, iparams, frontend, and security. Outputs a structured report with blocking vs non-blocking findings.

### 5. Publish — [fw-publish](skills/fw-publish/)

Guides you through `fdk validate → pack → upload → submit` via MCP without leaving your IDE.

**One-time setup:**
1. API key from [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) - API key for Freddy AI Copilot for VS Code plugin & AI Developer Tools. or Connect to Developer MCP server (For MCP configuration)
2. Configure the **fw-dev-mcp** server in your IDE — see [MCP section below](#mcp-marketplace-publish)

## MCP (marketplace publish)

Publishing uses the **fw-dev-mcp server**. This repo bundles `.mcp.json` at the repository root (URL + `Authorization` header). Cursor, Claude Code, and Codex MCP token placement (where applicable), copy-paste blocks, and tool names are documented in **[AGENTS.md](AGENTS.md)** (MCP section) and the publish skill's own files under **[skills/fw-publish/](skills/fw-publish/)**—not duplicated here.

## Troubleshooting

Having issues with skills installation or usage?

- 📋 [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) - Issues for **Cursor**, **Claude Code**, and **OpenAI Codex** (where applicable)

**Common issues:**
- Skills not recognized → Check `SKILL.md` and `plugin.json` structure
- Commands not working → Verify `rulesDirectory` and `commandsDirectory` in plugin.json
- Rules not applying → Ensure rules are in `skills/{skill}/rules/` (not `.cursor/rules/`)

## Resources

| Doc | Purpose |
|-----|---------|
| [Platform 3.0 App Development](https://developers.freshworks.com/docs/app-sdk/v3.0/) | Official SDK docs |
| [Marketplace Publishing Guide](https://developers.freshworks.com/docs/marketplace/) | Submission requirements |
| [FDK CLI Reference](https://developers.freshworks.com/docs/fdk/) | CLI commands |
| [Validation Errors Guide](skills/fw-app-dev/references/errors/) | Fix `fdk validate` failures |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Install and runtime issues |
| [AGENTS.md](AGENTS.md) | MCP config and AI agent routing |

## Support

- [Report Issues](https://github.com/freshworks-developers/fw-dev-tools/issues)
- [Freshworks Developer Docs](https://developers.freshworks.com/)
- Community standards: [CODE_OF_CONDUCT.MD](CODE_OF_CONDUCT.MD)

## Contributing

Contributions welcome — new commands, rule fixes, reference docs, and new skills. See **[CONTRIBUTING.md](CONTRIBUTING.md)** for:
- Skill and rule file structure
- How to keep `AGENTS.md` and plugin manifests in sync
- PR process and docs hygiene scripts
- Marketplace listing kit (canonical strings, logos, blurbs)

## License

MIT

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
| [Publishing & discovery](#publishing--discovery) | Where to publish, discover, and **[listing-kit](#listing-kit-maintainers)** fields |
| [Available Tools](#available-tools) | Five skills at a glance |
| [Workflow](#step-by-step-workflow) | Idea → validated app → publish |
| [MCP (publish)](#mcp-marketplace-publish) | MCP / JWT — steps in **[AGENTS.md](AGENTS.md)** |
| [Troubleshooting](#troubleshooting) | Skills, rules, PATH, Codex |
| [Support](#support) | Docs, issues, conduct |
| [Contributors](#for-contributors) | Plugin layout, PR hygiene |

## What You Can Do

This toolkit helps you:

- ✅ **Set up your development environment** - Install and manage the Freshworks Development Kit (FDK) and Node.js
- ✅ **Build apps faster** - Create marketplace apps with AI guidance for Platform 3.0
- ✅ **Add AI features** - Integrate AI Actions and third-party APIs into your apps
- ✅ **Review your code** - Run automated checks before submitting to the marketplace
- ✅ **Publish to marketplace** - Upload and submit your app versions directly

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

### Choose an install shape

| Install shape | What you get | When to use |
|---------------|----------------|-------------|
| **Skills CLI (`npx skills add …`)** | One skill per command (`--skill fw-setup`, etc.). Repeat for each skill you need. | Works from any terminal—**Cursor**, **Claude Code** environments that support Skills CLI ([TROUBLESHOOTING.md](TROUBLESHOOTING.md) if load fails). |
| **Marketplace-style / umbrella** | Registers the repo’s **`freshworks-dev-tools`** plugin descriptors so clients load **rules**, **commands**, and optional **MCP** together. Use each client’s **marketplace**, **plugin**, or **registry** flow—not a second parallel copy of **`skills/`**. | Prefer when you want the full toolkit with one onboarding path per IDE. Details: **[`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json)**, **[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)**, **[`.codex-plugin/plugin.json`](.codex-plugin/plugin.json)**. |

**Naming:** Slash commands (**`/fw-setup-install`**, **`/fdk-fix`**, …) are **Cursor / Claude Code** affordances. **OpenAI Codex** uses the same instructions in each skill’s **`SKILL.md`** (for app work, start from **[fw-app-dev](skills/fw-app-dev/)**); there is no **`/` command bar** in Codex—invoke workflows in natural language from **`SKILL.md`**.

### Install matrix (Cursor · Claude Code · Codex)

| Client | Marketplace / umbrella | CLI / local fork |
|--------|-------------------------|-------------------|
| **Cursor** | Add skills through the **Skills** flow your build supports; plugin registry is **[`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json)** (`freshworks-dev-tools`). If autocomplete or rules misbehave after install → **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** (**rulesDirectory** / **`commandsDirectory`** checks). | **`npx skills add …`** (below); local dev **`npx skills add file:///path/to/fw-dev-tools`** `--skill …` |
| **Claude Code** | **`claude plugin marketplace add freshworks-developers/fw-dev-tools`**, then **`claude plugin install <plugin>@freshworks-developers`** per skill you want (examples in **[skills/fw-setup/README.md](skills/fw-setup/README.md)** § *Install as Claude Plugin*). Umbrella **[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)** lists all plugins. | Same **`npx skills add`** as Cursor; MCP token shape matches **`.mcp.json`** (see **[AGENTS.md](AGENTS.md)**). |
| **OpenAI Codex** | **[`.codex-plugin/plugin.json`](.codex-plugin/plugin.json)** + optional **[`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json)** · from clone: `codex plugin marketplace add ./` per [Codex plugins](https://developers.openai.com/codex/plugins/build/). Restart Codex **after** add. MCP comes from **`mcpServers` → [.mcp.json](.mcp.json)** — configure JWT **before** **`fw-publish`** (see **[AGENTS.md](AGENTS.md)**). | Not the primary Codex path; prefer **Codex marketplace add** above so MCP + **`skills/`** paths resolve reliably. |

### Quick start — CLI (all five skills)

Copy and paste in a terminal (**Cursor**/**Claude-friendly** Skills CLI):

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-setup
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-ai-actions-app
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-review
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-publish
```

**After install:**

1. **Restart** Cursor / Claude Code (**OpenAI Codex:** restart Codex session after **`codex plugin marketplace add`** so **`skills/`** loads).
2. In chat (**Cursor / Claude Code**): type **`/fw-setup-`** — autocomplete should list **fw-setup** / **fw-app-dev** slash commands.
3. **Publish workflows only:** Configure **fw-dev-mcp** JWT using **[AGENTS.md](AGENTS.md)** (Portal: **API key for Freddy AI Copilot for VS Code plugin & AI Developer Tools.** → **Connect to Developer MCP server** → **Copy**).

**Helpful routing (don’t memorize — bookmark):**

| Need | Doc |
|------|-----|
| MCP bearer vs **`user_config`**, tool names | **[AGENTS.md](AGENTS.md)** |
| Rules/commands not appearing, nested **`marketplace/`** clones | **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** |
| FDK ↔ Node semver truth | **[docs/engine-matrix.md](docs/engine-matrix.md)** |
| Contributing / plugin inventories | **[CONTRIBUTING.md](CONTRIBUTING.md)** |

---

## Publishing & discovery

Use this when you distribute the umbrella plugin or want users to discover it outside **`README.md`**.

### Submission and discovery surfaces

| Surface | Purpose |
|---------|---------|
| [**Cursor — Publish to Cursor Marketplace**](https://cursor.com/marketplace/publish) | Vendor submission docs and review expectations (OS, etc.). |
| [**cursor.directory**](https://cursor.directory/) | Community directory of Cursor tools (optional third-party listing). |
| [**Claude Code — Plugin marketplaces**](https://docs.anthropic.com/en/plugin-marketplaces) | **`claude plugin marketplace add …`** and team registries; pair with GitHub Topics on the repo. |
| [**OpenAI Codex — Build plugins**](https://developers.openai.com/codex/plugins/build/) | **`codex plugin marketplace add …`** and plugin layout (this repo includes **[`.codex-plugin/plugin.json`](.codex-plugin/plugin.json)**). |
| [**claudemarketplaces.com**](https://claudemarketplaces.com/) | Independent community catalog—**not** operated by Anthropic; list only if you accept their terms. |

**GitHub:** good defaults for search are Topics such as **`freshworks`**, **`fdk`**, **`platform-3.0`**, **`marketplace`**, **`cursor-plugin`**, **`claude-plugin`**, **`codex-plugin`**, and **`mcp`** (match **[`.cursor-plugin/plugin.json`](.cursor-plugin/plugin.json)** `keywords` where possible).

### Listing kit (maintainers)

Canonical strings come from **`.cursor-plugin/plugin.json`**, **`.claude-plugin/plugin.json`**, and **`.codex-plugin/plugin.json`**—**bump the table when you change `version` or copy** (see **[`scripts/check-marketplace-versions.sh`](scripts/check-marketplace-versions.sh)**).

| Field | Value |
|-------|--------|
| **Plugin id** | `freshworks-dev-tools` |
| **Display name** | Freshworks Developer Tools |
| **Version** | `1.1.0` |
| **Short tagline** | FDK setup, Platform 3.0 apps, AI Actions, and marketplace publish. |
| **Description (umbrella)** | Freshworks Platform 3.0 app development, AI Actions, publishing, and FDK management skills. For MCP: add **fw-dev-mcp** per **[AGENTS.md](AGENTS.md)** (Developer Portal JWT). |
| **Long blurb (Cursor `interface`)** | Cursor plugin root for Freshworks skills: **fw-setup** (FDK/nvm), **fw-app-dev** (Platform 3.0 apps), **fw-ai-actions-app** (AI Actions), **fw-publish** (MCP). Copy **`.mcp.json`** from this repository into project **`.cursor/mcp.json`** and add your Developer Portal JWT. |
| **Long blurb (Claude `interface`)** | Aggregate plugin for Freshworks marketplace development: install and manage FDK with **fw-setup**, build full apps with **fw-app-dev**, AI Actions integrations with **fw-ai-actions-app**, and publish with **fw-publish** via MCP. MCP template: **`.mcp.json`** at repository root; configure Marketplace API token when prompted. |
| **Long blurb (Codex `interface`)** | Uses each skill’s **`SKILL.md`** (authoritative workflows). Slash commands from Cursor/Claude marketplaces (`/fw-setup-*`, `/fdk-*`) are conventions for those clients; Codex consumes skills plus optional MCP (`.mcp.json`) for **fw-publish**. Pair **fw-setup → fw-app-dev → fw-review → fw-publish**. |
| **Homepage** | [https://github.com/freshworks-developers/fw-dev-tools](https://github.com/freshworks-developers/fw-dev-tools) |
| **Product docs** | [https://developers.freshworks.com/](https://developers.freshworks.com/) (Codex **`interface.websiteURL`**) |
| **License** | MIT |
| **Category** | developer-tools |
| **Keywords (merge from manifests)** | `freshworks`, `platform-3.0`, `marketplace`, `fdk`, `app-development`, `mcp`, `crm` |
| **Logo (repo-relative)** | [`assets/fw-logo.svg`](assets/fw-logo.svg) |
| **Logo (raw URL for forms)** | `https://raw.githubusercontent.com/freshworks-developers/fw-dev-tools/main/assets/fw-logo.svg` |
| **Author** | Freshworks Developers · `skills@dev-assist.freshservice.com` |

**Per-skill Claude plugins** (from **[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)** `plugins[]` — after `claude plugin marketplace add freshworks-developers/fw-dev-tools`, install with `claude plugin install <name>@freshworks-developers`):

| Plugin `name` | `interface.displayName` | `interface.shortDescription` |
|---------------|-------------------------|----------------------------|
| `fw-setup` | Freshworks FDK Setup | FDK and Node.js toolchain install and lifecycle via nvm. |
| `fw-app-dev` | Freshworks App Development | Platform 3.0 apps: manifest, requests, OAuth, serverless, and UI. |
| `fw-ai-actions-app` | Freshworks AI Actions (fw-ai-actions-app) | actions.json, SMI handlers, request templates, and API integrations. |
| `fw-review` | Freshworks App Review | Rules + scripts for structured marketplace app audits. |
| `fw-publish` | Freshworks Marketplace Publish | MCP: validate, pack, app-upload, submit/update. |

**Install strings (umbrella):**

| Client | Command / note |
|--------|----------------|
| **Skills CLI** | `npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-setup` (repeat with `fw-app-dev`, `fw-ai-actions-app`, `fw-review`, `fw-publish`) — see [Installation](#installation). |
| **Claude Code registry** | `claude plugin marketplace add freshworks-developers/fw-dev-tools` then `claude plugin install <plugin-id>@freshworks-developers` for each skill (`fw-setup`, `fw-app-dev`, …). |
| **Codex (from clone)** | `codex plugin marketplace add ./` (see [Codex plugins](https://developers.openai.com/codex/plugins/build/)). |

**MCP (publish only):** server id **`fw-dev-mcp`**, config template **`.mcp.json`** — do not paste tokens into listings; point to **[AGENTS.md](AGENTS.md)**.

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

Here's how to go from idea to published app:

### 1. Setup Your Environment

Start with **fw-setup** to install the development tools you need (FDK 10.x and Node.js 24.x). This is required before building any apps.

**Commands you can use:**
- `/fw-setup-install` - Install FDK and Node.js
- `/fw-setup-status` - Check what's currently installed
- `/fw-setup-troubleshoot` - Fix common setup problems

👉 [Read the fw-setup guide](skills/fw-setup/)

### 2. Build Your App

Use **fw-app-dev** to create your marketplace app. This includes:
- Creating the app structure
- Adding UI components with Crayons
- Setting up OAuth for third-party integrations
- Adding serverless functions
- Fixing validation errors

Validation order matters: run **fw-setup** first when Node/FDK is missing or wrong, run **`/fdk-migrate`** for legacy 2.x apps/engines, then run `fdk validate`.

**Commands you can use:**
- `/fdk-fix` - Fix validation errors automatically
- `/fdk-migrate` - Upgrade older apps to Platform 3.0
- `/fdk-review` - Check your app for issues

👉 [Read the fw-app-dev guide](skills/fw-app-dev/)

### 3. Add AI Features (Optional)

If you want to add AI-powered features, use **fw-ai-actions-app** to:
- Connect to external APIs (Slack, Google, etc.)
- Add AI Actions that automate tasks
- Create request templates for API calls
- Add test data for development

👉 [Read the fw-ai-actions-app guide](skills/fw-ai-actions-app/)

### 4. Review Your App (Recommended)

Before publishing, run **fw-review** to catch common issues:
- Check configuration files
- Validate frontend code
- Run security checks
- Generate a review report

👉 [Read the fw-review guide](skills/fw-review/)

### 5. Publish to Marketplace

Finally, use **fw-publish** to upload your app:
- Validate and package your app
- Upload to Freshworks servers via the **fw-dev-mcp server**
- Submit for review or update existing versions
- Check publishing status

**Setup required:**
1. Get your API key from [Freshworks Developer Portal](https://developers.freshworks.com/developer/): **API key for Freddy AI Copilot for VS Code plugin & AI Developer Tools.** → **Connect to Developer MCP server** → **Copy**
2. Configure the **fw-dev-mcp server** in your IDE (see MCP section below for details)

👉 [Read the fw-publish guide](skills/fw-publish/)

## MCP (marketplace publish)

Publishing uses the **fw-dev-mcp server**. This repo bundles `.mcp.json` at the repository root (URL + `Authorization` header). Cursor, Claude Code, and Codex MCP token placement (where applicable), copy-paste blocks, and tool names are documented in **[AGENTS.md](AGENTS.md)** (MCP section) and the publish skill's own files under **[skills/fw-publish/](skills/fw-publish/)**—not duplicated here.

## Troubleshooting

Having issues with skills installation or usage?

- 📋 [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) - Issues for **Cursor**, **Claude Code**, and **OpenAI Codex** (where applicable)

**Common issues:**
- Skills not recognized → Check `SKILL.md` and `plugin.json` structure
- Commands not working → Verify `rulesDirectory` and `commandsDirectory` in plugin.json
- Rules not applying → Ensure rules are in `skills/{skill}/rules/` (not `.cursor/rules/`)

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/fw-dev-tools/issues)
- 💡 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Skills installation & usage guide
- 🤝 Community standards: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## For Contributors

See **[CONTRIBUTING.md](CONTRIBUTING.md)** (structure, plugin manifests, docs hygiene). Technical routing for AI agents: **[AGENTS.md](AGENTS.md)**. Each skill has **`SKILL.md`** (authoritative) and usually **`README.md`**; changing **`rules/`** or **`commands/`** requires updating the skill inventory in **AGENTS.md** and keeping **`.cursor-plugin/marketplace.json`** / **`.claude-plugin/marketplace.json`** aligned.

## License

MIT - free to use and modify

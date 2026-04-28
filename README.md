<h1 align="center">Freshworks Developer Tools</h1>

<p align="center"><strong>AI-powered toolkit for building Freshworks apps in Claude Code and Cursor</strong></p>

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
> **Getting started?** Follow the installation steps below, check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if you run into issues, and visit the [Freshworks Developer Portal](https://developers.freshworks.com/) for API keys.

## What You Can Do

This toolkit helps you:

- ✅ **Set up your development environment** - Install and manage the Freshworks Development Kit (FDK) and Node.js
- ✅ **Build apps faster** - Create marketplace apps with AI guidance for Platform 3.0
- ✅ **Add AI features** - Integrate AI Actions and third-party APIs into your apps
- ✅ **Review your code** - Run automated checks before submitting to the marketplace
- ✅ **Publish to marketplace** - Upload and submit your app versions directly

## Quick Start

Copy and paste these commands in your terminal to install all tools:

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-setup
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-ai-app-dev
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-review
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-publish
```

## Available Tools

Each tool helps with a specific part of app development. Use them in order for a complete workflow:

| Tool | What it does |
|------|--------------|
| [**fw-setup**](skills/fw-setup/) | Install and manage FDK (Freshworks Development Kit) and Node.js |
| [**fw-app-dev**](skills/fw-app-dev/) | Build complete marketplace apps with UI, OAuth, and integrations |
| [**fw-ai-app-dev**](skills/fw-ai-app-dev/) | Add AI Actions and connect to third-party services |
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

If you want to add AI-powered features, use **fw-ai-app-dev** to:
- Connect to external APIs (Slack, Google, etc.)
- Add AI Actions that automate tasks
- Create request templates for API calls
- Add test data for development

👉 [Read the fw-ai-app-dev guide](skills/fw-ai-app-dev/)

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
1. Get your API key from [Freshworks Developer Portal](https://developers.freshworks.com/developer/) (look for "API key for Freddy AI Copilot VS Code plugin")
2. Configure the **fw-dev-mcp server** in your IDE (see MCP section below for details)

👉 [Read the fw-publish guide](skills/fw-publish/)

## MCP (marketplace publish)

Publishing uses the **fw-dev-mcp server**. This repo bundles `.mcp.json` at the repository root (URL + `Authorization` header). Claude Code vs Cursor token placement, copy-paste blocks, and tool names are documented in **[AGENTS.md](AGENTS.md)** (MCP section) and the publish skill's own files under **[skills/fw-publish/](skills/fw-publish/)**—not duplicated here.

## Troubleshooting

Having issues with skills installation or usage?

- 📋 [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) - Complete guide for Cursor and Claude Code skill issues

**Common issues:**
- Skills not recognized → Check `SKILL.md` and `plugin.json` structure
- Commands not working → Verify `rulesDirectory` and `commandsDirectory` in plugin.json
- Rules not applying → Ensure rules are in `skills/{skill}/rules/` (not `.cursor/rules/`)

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/fw-dev-tools/issues)
- 💡 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Skills installation & usage guide

## For Contributors

Want to help improve these tools? 

- Technical documentation for AI agents: [AGENTS.md](AGENTS.md)
- Each skill folder has detailed `SKILL.md` and `README.md` files
- Skills are auto-discovered and don't require manual registration

## License

MIT - free to use and modify

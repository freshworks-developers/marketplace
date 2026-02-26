<h1 align="center">Freshworks App Development</h1>

<p align="center"><strong>Expert-level skill for building Freshworks Platform 3.0 marketplace applications</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Plugin-00a67e?style=for-the-badge" alt="Cursor Plugin">
  <img src="https://img.shields.io/badge/Crayons-4.x-00a67e?style=for-the-badge" alt="Crayons">
  <img src="https://img.shields.io/badge/FDK-9.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/FDK-9.6+-0052cc?style=flat-square" alt="FDK">
  <img src="https://img.shields.io/badge/References-140+-764abc?style=flat-square" alt="References">
</p>

<p align="center">Production-ready plugin for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Validation</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>Auto-fix</code></p>

## Features

- ✅ Platform 3.0 enforcement with zero tolerance for legacy patterns
- ✅ Complete app templates (Frontend, Serverless, Hybrid, OAuth)
- ✅ Crayons v4.x component library integration
- ✅ Automatic validation and error fixing
- ✅ Request template patterns
- ✅ Module and location reference for all products

## Install

### Install via CLI:

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill freshworks-app-dev
```

### Install as Claude Plugin

**Step1**

```bash
claude plugin marketplace add freshworks-developers/marketplace
```

**Step2**

```bash
claude plugin install app-dev@freshworks-developers
```

## Verify Installation

The plugin should appear in Cursor Settings → Plugins → Installed Plugins.

## What's Included

**Skills:**
- `freshworks-app-dev` - Expert-level development skill for Platform 3.0

**Rules:**
- `app-templates.mdc` - Complete app templates
- `freshworks-platform3.mdc` - Platform 3.0 rules
- `platform3-modules-locations.mdc` - Module reference
- `validation-autofix.mdc` - Validation patterns
- `validation-workflow.mdc` - Autofix workflow

**Commands:**
- `/migrate` - Check platform version; migrate 2.x → 3.0
- `/review` - Run 3 rounds of `fdk validate`
- `/fix` - Fix all platform and lint errors
- `/refactor` - Reduce function complexity (≤ 7)

**References:**
- Progressive disclosure documentation (140+ files)

**Assets:**
- App skeleton templates (Frontend, Serverless, Hybrid)

## Usage

Invoke with `@freshworks-app-dev` in chat, or it activates automatically when working on Freshworks Platform 3.0 apps. When active, it:
- Enforces Platform 3.0 patterns
- Generates correct manifest structure
- Uses proper request templates
- Implements Crayons components
- Validates and autofixes errors

## Requirements

- Cursor IDE
- Node.js >= 18.0.0
- FDK >= 9.6.0

## Support

For issues or questions:
- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT

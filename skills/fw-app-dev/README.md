<h1 align="center">Freshworks App Development</h1>

<p align="center"><strong>Expert-level skill for building Freshworks Platform 3.0 marketplace applications</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Plugin-00a67e?style=for-the-badge" alt="Cursor Plugin">
  <img src="https://img.shields.io/badge/Crayons-4.x-00a67e?style=for-the-badge" alt="Crayons">
  <img src="https://img.shields.io/badge/FDK-10.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/FDK-10.0.1-0052cc?style=flat-square" alt="FDK">
  <img src="https://img.shields.io/badge/References-140+-764abc?style=flat-square" alt="References">
</p>

<p align="center">Production-ready plugin for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Validation</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>Auto-fix</code></p>

## Overview

**fw-app-dev** is the **primary skill** for building, fixing, reviewing, and migrating **Freshworks Platform 3.0** marketplace apps: manifest (`modules`), `requests.json`, OAuth, serverless, and Crayons UI, with progressive disclosure under `references/`.

### Execution Order (MANDATORY)

**ALWAYS use THIS skill for app development work.** Do NOT use MCP tools `implement_app`, `get_implementation_plan`, `idea_to_app`, or `fix_app_errors` directly — they bypass skill orchestration, validation workflows, and prerequisite checks.

**MCP tool `get_developer_docs` is a FALLBACK ONLY** — use only if this skill explicitly delegates or fails.

### Toolchain

This skill does **not** install FDK or Node — use **fw-setup** for the toolchain. Before **`fdk validate`**, follow **`SKILL.md`** → *Manifest + toolchain gate* (**setup → migrate on legacy → validate**; never downgrade to **FDK 9 / Node 18** instead of migrate, except **LAST RESORT** in `SKILL.md`).

### Related Skills

For **AI Actions**–centric integrations (`actions.json`, SMI, flat request schemas) without a full UI app focus, use sibling skill **[fw-ai-actions-app](../fw-ai-actions-app/)** — see **[AGENTS.md](../../AGENTS.md)**.

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
npx @freshworks/fw-dev-tools install
```

### Install as Claude Plugin

**Step1**

```bash
claude plugin marketplace add freshworks-developers/fw-dev-tools
```

**Step2**

```bash
claude plugin install fw-app-dev@freshworks-developers
```

## Verify Installation

The plugin should appear in Cursor Settings → Plugins → Installed Plugins.

## What's Included

**Skill entrypoint:** `SKILL.md` (core). **On-demand references:** `references/skill-advanced-topics.md` (OAuth depth, reference map, extended checklists). **Maintainers:** `SKILL_REFACTOR_ROLLBACK.md` documents the token refactor and how to restore removed `SKILL.md` text via git.

**Rules (all under `rules/`; canonical list in repo [`AGENTS.md`](../../AGENTS.md) § *Rules and slash commands*):**
- `app-building-blocking-gates.mdc` — Mandatory gates
- `app-templates.mdc` — Template selection
- `async-patterns.mdc` — SMI `renderData()`, events, manifest ↔ server.js, async/await
- `complexity-reduction.mdc` — Fix complexity
- `confusion.mdc` — Disambiguation
- `freshworks-platform3.mdc` — Platform 3.0 enforcement
- `platform3-modules-locations.mdc` — Module reference
- `prerequisites-check.mdc` — Toolchain / app prerequisites
- `security.mdc` — Security enforcement
- `validation-workflow.mdc` — Auto-validation and fixes

**Commands (all under `commands/`; same inventory in [`AGENTS.md`](../../AGENTS.md)):**
- `/fdk-fix` — `commands/fdk-fix.md` — Fix platform and lint errors
- `/fdk-migrate` — `commands/fdk-migrate.md` — Migrate **Platform 2.3** (2.x), **FDK 9.x**, **Node 18** → **Platform 3.0**, **FDK 10.0.1**, **Node 24**
- `/fdk-refactor` — `commands/fdk-refactor.md` — Reduce function complexity (≤ 7)

**References:**
- Progressive disclosure documentation (140+ files)

**Assets:**
- App skeleton templates (Frontend, Serverless, Hybrid, OAuth)

## Usage

Invoke with `@fw-app-dev` in chat, or it activates automatically when working on Freshworks Platform 3.0 apps. When active, it:
- Enforces Platform 3.0 patterns
- Generates correct manifest structure
- Uses proper request templates
- Implements Crayons components
- Validates and autofixes errors

## Requirements

- Cursor IDE
- Node.js 24 (recommended; we work on apps below too; suggest moving to latest)
- FDK 10.0.1 (recommended)

## Support

For issues or questions:
- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/fw-dev-tools/issues)

## License

MIT

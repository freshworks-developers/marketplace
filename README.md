<h1 align="center">Freshworks Developer Tools</h1>

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
  <img src="https://img.shields.io/badge/Plugins-6-764abc?style=flat-square" alt="Plugins">
</p>

<p align="center">Agentic App Development Kit for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code></p>

> [!NOTE]
> Feedback and bug reports: **[GitHub Issues](https://github.com/freshworks-developers/fw-dev-tools/issues)**. **AI agents:** start from **[AGENTS.md](AGENTS.md)** for routing, skills layout, and repo norms.

> [!TIP]
> **Human install & routing:** use **this README** (installation below), **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for Cursor / Claude Code skill issues, and the **[Freshworks Developer Portal](https://developers.freshworks.com/)** for product documentation and API keys.

## Installation

### npx skills

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-setup
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-ai-actions-app
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-review
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-publish
```


## Available Skills

The table lists skills in lifecycle order. One-line summaries here; full playbooks in each folder’s **`README.md`** / **`SKILL.md`**. Slash commands, rules file inventory, and MCP wiring are in **[`AGENTS.md`](AGENTS.md)**.

| Skill | One-line summary |
|-------|------------------|
| [**fw-setup**](skills/fw-setup/) | FDK and Node.js install / lifecycle via nvm |
| [**fw-app-dev**](skills/fw-app-dev/) | Full Platform 3.0 marketplace apps: manifest, requests, OAuth, serverless, UI |
| [**fw-ai-app-dev**](skills/fw-ai-app-dev/) | AI Actions (`actions.json`), SMI, request templates, validation |
| [**fw-ai-actions-app**](skills/fw-ai-actions-skill/) | Standalone AI Actions skill: rules, references, optional integration agents |
| [**fw-review**](skills/fw-review/) | Structured pre-submission audit (rules + scripts) |
| [**fw-publish**](skills/fw-publish/) | Marketplace publish via MCP (validate, pack, upload, submit/update) |

### AI Actions integration agents

Markdown agent definitions for scoping, implementing, and validating third-party **AI Actions** live under [**skills/fw-ai-actions-skill/agents/**](skills/fw-ai-actions-skill/agents/). Copy them into your project (for example `.cursor/agents/`) or reference them when configuring subagents. For full marketplace apps, pair with [**fw-app-dev**](skills/fw-app-dev/) (similar `agents/` layout).

| Agent | File | Role |
|-------|------|------|
| Integration Scoper | [integration-scoper.md](skills/fw-ai-actions-skill/agents/integration-scoper.md) | Requirements → API mapping, feasibility, plan docs (no app code) |
| Integration Scope Implementer | [integration-scope-implementer.md](skills/fw-ai-actions-skill/agents/integration-scope-implementer.md) | Plans, implementation, `fdk validate`, status docs on an integration branch |
| AI Action Integration Validator | [ai-action-integration-validator.md](skills/fw-ai-actions-skill/agents/ai-action-integration-validator.md) | Spec parity, strict validation, manifest hygiene, app-scoped handoff |

### From toolchain to marketplace (lifecycle)

Typical path from a **cold machine** to a **listed or testable marketplace app**. Skip steps your task does not need (for example, AI Actions–only work may never open **fw-app-dev** UI locations).

1. **Toolchain — [fw-setup](skills/fw-setup/)**  
   Install and stabilize **FDK** (10.x for publishing) and **Node** (24.x) with **nvm**, fix PATH and shell persistence, and recover from version drift. Without a working `fdk`, later steps (`fdk validate`, `fdk pack`, and some **fw-review** script assumptions) stall. Slash commands such as `/fw-setup-install`, `/fw-setup-status`, and `/fw-setup-troubleshoot` are defined in that skill’s `commands/` (see **AGENTS.md** inventory).

2. **Application development — [fw-app-dev](skills/fw-app-dev/)**  
   Build or migrate the **full** Platform 3.0 app: `manifest.json` (`modules`), `config/requests.json`, OAuth, serverless handlers, frontend locations, Crayons, and `fdk validate` with guided fixes (`/fdk-fix`, `/fdk-migrate`, `/fdk-refactor`, `/fdk-review` for validate rounds). Does **not** install FDK—use **fw-setup** first when the toolchain is missing.

3. **AI Actions & APIs — [fw-ai-app-dev](skills/fw-ai-app-dev/)**  
   When the surface is **`actions.json`** plus serverless SMI (not a full sidebar UI app), use this skill for request templates, schemas, test data, and integration guardrails. Complements **fw-app-dev**; combined UI + actions apps may need both.

4. **Pre-flight audit — [fw-review](skills/fw-review/)**  
   Optional **repeatable, policy-driven** pass before heavy QA or submission: iparams and manifest rules, frontend FF-* checks, SC-* checks via `scripts/*.js`, and an **App Review Result** per `skills/fw-review/rules/report.md`. **Not** the same as **fw-app-dev**’s `/fdk-review` (which re-runs `fdk validate`). Ensure **FDK** on PATH when a phase needs it.

5. **Publish — [fw-publish](skills/fw-publish/)**  
   After validate and pack: configure **`fw-dev-mcp`** MCP using the repo root **`.mcp.json`** shape, then app upload and **submit** or **update version**. Requires a Developer Portal JWT. **fw-app-dev** / **fw-ai-app-dev** fix validation issues; **fw-review** reduces surprises before upload.

**Typical thread:** **fw-setup** → **fw-app-dev** (and/or **fw-ai-app-dev**) → optional **fw-review** → **fw-publish**.

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

**fw-ai-actions-app** also ships **integration agent** prompts under `agents/`:

```
skills/
├── fw-ai-actions-skill/
│   ├── SKILL.md
│   ├── agents/        # scoper, implementer, validator (.md)
│   ├── rules/
│   └── references/
├── fw-app-dev/
├── fw-ai-app-dev/
└── fw-setup/
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

Publishing uses the **`fw-dev-mcp`** server. This repo **bundles** **`.mcp.json`** at the repository root (URL + `Authorization` header). **Claude Code** vs **Cursor** token placement, copy-paste blocks, and tool names are documented in **[`AGENTS.md`](AGENTS.md)** (MCP section) and the publish skill’s own files under **`skills/fw-publish/`**—not duplicated here.

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

## License

MIT

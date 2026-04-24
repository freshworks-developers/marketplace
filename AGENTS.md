# Agent instructions (Freshworks marketplace skills)

This repository is a **multi-IDE skill marketplace** for AI assistants working on **Freshworks Platform 3.0** marketplace apps. **This file** is the agent entry point and routing layer. For human overview, install URLs, and badges, see **`README.md`**. For contribution layout and conventions, see **`CONTRIBUTING.md`**. For FDK/skill install problems, see **`TROUBLESHOOTING.md`**.

## Skills and MCP tools available

### Skills (installed via this repo)

| Skill | Entry point | What it does |
|-------|-------------|--------------|
| **fdk-setup** | `skills/fdk-setup/SKILL.md` | Install, upgrade, downgrade, or uninstall **FDK 10.x** and **Node 24.x** via nvm. Manages toolchain versions and verifies persistence across shells. Slash commands: `/fdk-setup-install`, `/fdk-setup-upgrade`, `/fdk-setup-downgrade`, `/fdk-setup-uninstall`, `/fdk-setup-status`, `/fdk-setup-troubleshoot`, `/fdk-setup-use`. |
| **app-dev** | `skills/app-dev/SKILL.md` | Build, fix, review, or migrate **Platform 3.0** apps end-to-end: idea collection, implementation planning, code generation, manifest enforcement, `fdk validate` with up to 6 auto-fix iterations, and post-generation guidance. Handles manifest structure, `requests.json`, OAuth, serverless, frontend Crayons, and tracking fields (`tracking_id`, `start_time`). |
| **publish** | `skills/publish/SKILL.md` | Publish a built Platform 3.0 app to the **Freshworks Marketplace** via MCP tools: `fdk validate`, `fdk pack`, presigned S3 upload, then `submit_marketplace_app` or `update_marketplace_app_version`. Supports new apps and version updates. Checks auth token before any publish step. Also supports listing apps and checking publish status. |

### MCP tools (openai-server, publish)

This plugin bundles **`.mcp.json`** at the repository root. In **Claude Code**, the MCP server is auto-loaded — the plugin prompts for your API key at install time (token is stored in the system keychain via `userConfig`). In **Cursor**, add the `freshworks-marketplace` server to `~/.cursor/mcp.json` or `.cursor/mcp.json` with your API key. Get the key from [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) → **"API key for Freddy AI Copilot VS Code plugin"** section → **Copy**.

| Tool | Purpose |
|------|---------|
| `list_marketplace_apps` | List all apps on the developer account |
| `create_app_upload_url` | Get presigned S3 URL for zip upload |
| `submit_marketplace_app` | Create a new app + first version |
| `update_marketplace_app_version` | Upload a new version to an existing app |
| `get_marketplace_app_status` | Check app state and latest version |

**Skills orchestrate tools.** Follow each skill’s playbook rather than inventing parallel flows; each skill documents preconditions, tool use, and error handling.

## Which skill to follow

| User goal | Open first | Notes |
|-----------|------------|--------|
| Build, fix, review, or migrate a **Platform 3.0 app** (manifest, requests, OAuth, serverless, UI) | `skills/app-dev/SKILL.md` | **Does not** install FDK or Node |
| Install, upgrade, or troubleshoot **FDK** and **Node** (nvm, PATH, versions) | `skills/fdk-setup/SKILL.md` | Use before relying on `fdk validate` when the toolchain is missing or wrong |
| Publish a built app to the marketplace, check status, list apps | `skills/publish/SKILL.md` | Requires MCP tools configured (API key from Developer Portal profile) |

If all three apply (new machine + new app + publish): **fdk-setup first**, then **app-dev**, then **publish**.

## Non-negotiables (app work)

When generating or editing **Freshworks apps** (not this repo’s markdown), **`skills/app-dev/SKILL.md`** is authoritative. In short:

- **Platform version** `"3.0"`; **`modules`**, not legacy `product`
- **External HTTP** only via **`$request.invokeTemplate` / `client.request.invokeTemplate`** and **`config/requests.json`** templates (no `$request.post|get|put|delete`)
- **OAuth** uses the **`integrations`** wrapper in `oauth_config.json`
- **`fdk validate`**: **zero** platform errors and **zero** lint errors before calling an app complete; **`README.md`** and **`app/styles/images/icon.svg`** (frontend) where the skill requires them
- **New app engines**: **`fdk` `10.0.1`** and **`node` `24.11.0`** unless **app-dev** `SKILL.md` **LAST RESORT** rules apply

## Repository layout (skills)

- **`skills/{app-dev|fdk-setup|publish}/SKILL.md`** — skill entry and frontmatter
- **`skills/*/rules/*.mdc`** — always-on rules (referenced by plugins)
- **`skills/*/commands/*.md`** — slash-command bodies (IDE-agnostic)
- **`skills/*/references/**`** — load **on demand** (API, errors, events, playbooks); index: `skills/app-dev/references/skill-advanced-topics.md`
- **`skills/*/assets/templates/**`** — app skeletons
- **`.mcp.json`** — bundled MCP server config (openai-server URL + token placeholder)
- **`.claude/settings.json`** — Claude Code project permissions (MCP defaults for this repo; server key must match `.mcp.json`)
- **`.claude-plugin/marketplace.json`**, **`.cursor-plugin/marketplace.json`** — multi-skill registries

**Single source of truth:** rules and commands live under each skill’s `rules/` and `commands/`; IDE plugin JSON points there—do not duplicate command/rule trees under `.cursor/` inside skills.

## Editing this repo (maintenance)

- Prefer **small, focused diffs**; match existing markdown and plugin patterns
- **`CONTRIBUTING.md`** — contribution and structure expectations
- **Skill evaluation tooling** (optional): `.agents/skills/skill-creator/scripts/` (for example `quick_validate.py`, `package_skill.py`)

## Human-facing install

See **`README.md`** for `npx skills add` URLs and Cursor copy paths. **`TROUBLESHOOTING.md`** covers IDE and skill load issues.

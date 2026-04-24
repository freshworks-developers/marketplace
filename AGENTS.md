# Agent instructions (Freshworks marketplace skills)

This repository is a **multi-IDE skill marketplace** for AI assistants working on **Freshworks Platform 3.0** marketplace apps. **This file** is the agent entry point and routing layer. For human overview, install URLs, and badges, see **`README.md`**. For contribution layout and conventions, see **`CONTRIBUTING.md`**. For FDK/skill install problems, see **`TROUBLESHOOTING.md`**.

## Skills and MCP tools available

### Skills (installed via this repo)

| Skill | Entry point | What it does |
|-------|-------------|--------------|
| **fw-setup** | `skills/fw-setup/SKILL.md` | Install, upgrade, downgrade, or uninstall **FDK 10.x** and **Node 24.x** via nvm. Manages toolchain versions and verifies persistence across shells. Slash commands: `/fw-setup-install`, `/fw-setup-upgrade`, `/fw-setup-downgrade`, `/fw-setup-uninstall`, `/fw-setup-status`, `/fw-setup-troubleshoot`, `/fw-setup-use`. |
| **fw-app-dev** | `skills/fw-app-dev/SKILL.md` | Build, fix, review, or migrate **Platform 3.0** apps end-to-end: idea collection, implementation planning, code generation, manifest enforcement, `fdk validate` with up to 6 auto-fix iterations, and post-generation guidance. Handles manifest structure, `requests.json`, OAuth, serverless, frontend Crayons, and tracking fields (`tracking_id`, `start_time`). |
| **fw-ai-app-dev** | `skills/fw-ai-app-dev/SKILL.md` | **AI Actions** and third-party integrations: `actions.json`, SMI handlers, flat request schemas, `$request.invokeTemplate`, test data, validation, debugging endpoints, and integration scoping (no full UI app folder). Pair with **fw-app-dev** when the work is a full marketplace app with locations and Crayons. |
| **fw-publish** | `skills/fw-publish/SKILL.md` | Publish a built Platform 3.0 app to the **Freshworks Marketplace** via MCP tools: `fdk validate`, `fdk pack`, **app-upload**, then `submit_marketplace_app` or `update_marketplace_app_version`. Supports new apps and version updates. Checks auth token before any publish step. Also supports listing apps and checking publish status. |

### MCP tools (openai-server, publish)

This repository’s **canonical MCP server definition** lives only under the publish skill: **`skills/fw-publish/.mcp.json`** (`freshworks-marketplace` → `https://mcp.freshworks.dev/mcp`, `Authorization` header). In **Claude Code**, installing the **fw-publish** plugin (or marketplace that includes it) uses that file’s shape and prompts for your API key (token in keychain via **`userConfig.mcp_auth_token`**, referenced as **`${user_config.mcp_auth_token}`**). In **Cursor**, copy or merge that entry into **`~/.cursor/mcp.json`** or **`.cursor/mcp.json`** and replace the bearer value with your JWT (Cursor does not resolve **`user_config`** — use a literal **`Bearer <token>`** or an env placeholder your client supports). Get the key from [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) → **"API key for Freddy AI Copilot VS Code plugin"** → **Copy**.

| Tool | Purpose |
|------|---------|
| `list_marketplace_apps` | List all apps on the developer account |
| `create_app_upload_url` | Get **app-upload** URL for the zip binary |
| `submit_marketplace_app` | Create a new app + first version |
| `update_marketplace_app_version` | Upload a new version to an existing app |
| `get_marketplace_app_status` | Check app state and latest version |

**Skills orchestrate tools.** Follow each skill’s playbook rather than inventing parallel flows; each skill documents preconditions, tool use, and error handling.

## Which skill to follow

| User goal | Open first | Notes |
|-----------|------------|--------|
| Build, fix, review, or migrate a **Platform 3.0 app** (manifest, requests, OAuth, serverless, UI) | `skills/fw-app-dev/SKILL.md` | **Does not** install FDK or Node |
| **AI Actions** integrations (`actions.json`, SMI, request templates, third-party APIs, test data) | `skills/fw-ai-app-dev/SKILL.md` | **Does not** install FDK or Node; not a substitute for full **fw-app-dev** UI/marketplace app work |
| Install, upgrade, or troubleshoot **FDK** and **Node** (nvm, PATH, versions) | `skills/fw-setup/SKILL.md` | Use before relying on `fdk validate` when the toolchain is missing or wrong |
| Publish a built app to the marketplace, check status, list apps | `skills/fw-publish/SKILL.md` | Requires MCP tools configured (API key from Developer Portal profile) |

If **toolchain + app + publish** apply: **fw-setup** first, then **fw-app-dev** or **fw-ai-app-dev** (by task), then **fw-publish** when publishing.

## Non-negotiables (app work)

When generating or editing **Freshworks apps** (not this repo’s markdown), **`skills/fw-app-dev/SKILL.md`** is authoritative. In short:

- **Platform version** `"3.0"`; **`modules`**, not legacy `product`
- **External HTTP** only via **`$request.invokeTemplate` / `client.request.invokeTemplate`** and **`config/requests.json`** templates (no `$request.post|get|put|delete`)
- **OAuth** uses the **`integrations`** wrapper in `oauth_config.json`
- **`fdk validate`**: **zero** platform errors and **zero** lint errors before calling an app complete; **`README.md`** and **`app/styles/images/icon.svg`** (frontend) where the skill requires them
- **New app engines**: **`fdk` `10.0.1`** and **`node` `24.11.0`** unless **fw-app-dev** `SKILL.md` **LAST RESORT** rules apply

## Repository layout (skills)

- **`skills/{fw-app-dev|fw-ai-app-dev|fw-setup|fw-publish}/SKILL.md`** — skill entry and frontmatter
- **`skills/*/rules/*.mdc`** — always-on rules (referenced by plugins)
- **`skills/*/commands/*.md`** — slash-command bodies (IDE-agnostic)
- **`skills/*/references/**`** — load **on demand** (API, errors, events, playbooks); index: `skills/fw-app-dev/references/skill-advanced-topics.md`
- **`skills/*/assets/templates/**`** — app skeletons
- **`skills/fw-publish/.mcp.json`** — canonical **`freshworks-marketplace`** MCP server URL + `Authorization` header shape; see **`skills/fw-publish/SKILL.md`** for Cursor vs Claude setup notes
- **`.claude/settings.json`** — Claude Code project permissions (MCP defaults for this repo; server key must match **`skills/fw-publish/.mcp.json`**)
- **`.claude-plugin/marketplace.json`**, **`.cursor-plugin/marketplace.json`** — multi-skill registries (`name`: **`freshworks-developer-tooling`**; each plugin lists `author`, `license`, `category`, `strict`, `version`, optional `interface`, like [Salesforce B2C marketplace.json](https://github.com/SalesforceCommerceCloud/b2c-developer-tooling/blob/main/.claude-plugin/marketplace.json))

**Single source of truth:** rules and commands live under each skill’s `rules/` and `commands/`; IDE plugin JSON points there—do not duplicate command/rule trees under `.cursor/` inside skills.

## Editing this repo (maintenance)

- Prefer **small, focused diffs**; match existing markdown and plugin patterns
- **`CONTRIBUTING.md`** — contribution and structure expectations
- **Skill evaluation tooling** (optional): `.agents/skills/skill-creator/scripts/` (for example `quick_validate.py`, `package_skill.py`)

## Human-facing install

See **`README.md`** for `npx skills add` URLs and Cursor copy paths. **`TROUBLESHOOTING.md`** covers IDE and skill load issues.

# Agent instructions (Freshworks marketplace skills)

This repository is a **multi-IDE skill marketplace** for AI assistants working on **Freshworks Platform 3.0** marketplace apps. **This file** is the agent entry point and routing layer. For human overview, install URLs, and badges, see **`README.md`**. For contribution layout and conventions, see **`CONTRIBUTING.md`**. For FDK/skill install problems, see **`TROUBLESHOOTING.md`**.

## Skills and MCP tools available

### Skills (installed via this repo)

| Skill | Entry point | What it does |
|-------|-------------|--------------|
| **fw-setup** | `skills/fw-setup/SKILL.md` | Install, upgrade, downgrade, or uninstall **FDK 10.x** and **Node 24.x** via nvm. Manages toolchain versions and verifies persistence across shells. Slash commands: `/fw-setup-install`, `/fw-setup-upgrade`, `/fw-setup-downgrade`, `/fw-setup-uninstall`, `/fw-setup-status`, `/fw-setup-troubleshoot`, `/fw-setup-use`. |
| **fw-app-dev** | `skills/fw-app-dev/SKILL.md` | Build, fix, review, or migrate **Platform 3.0** apps end-to-end: idea collection, implementation planning, code generation, manifest enforcement, `fdk validate` with up to 6 auto-fix iterations, and post-generation guidance. Handles manifest structure, `requests.json`, OAuth, serverless, frontend Crayons, and tracking fields (`tracking_id`, `start_time`). |
| **fw-ai-app-dev** | `skills/fw-ai-app-dev/SKILL.md` | **AI Actions** and third-party integrations: `actions.json`, SMI handlers, flat request schemas, `$request.invokeTemplate`, test data, validation, debugging endpoints, and integration scoping (no full UI app folder). Pair with **fw-app-dev** when the work is a full marketplace app with locations and Crayons. |
| **fw-review** | `skills/fw-review/SKILL.md` | **Automated marketplace app audit**: manifest and iparams review, frontend rules, deterministic `scripts/*.js` checks for SC-* rule IDs, and structured **App Review Result** output per `rules/report.md`. Silent pipeline; does not install FDK — use **fw-setup** when `fdk` may be missing. |
| **fw-publish** | `skills/fw-publish/SKILL.md` | Publish a built Platform 3.0 app to the **Freshworks Marketplace** via MCP tools: `fdk validate`, `fdk pack`, **app-upload**, then `submit_marketplace_app` or `update_marketplace_app_version`. Supports new apps and version updates. Checks auth token before any publish step. Also supports listing apps and checking publish status. |

### MCP tools (openai-server, publish)

This repository **bundles MCP config at the root**: **`.mcp.json`** (`fw-dev-mcp` → `https://mcp.freshworks.dev/mcp`, `Authorization` header). In **Claude Code**, installing the marketplace plugin uses that shape and prompts for your API key (token in keychain via **`userConfig.mcp_auth_token`**, referenced as **`${user_config.mcp_auth_token}`**). In **Cursor**, copy or merge the same `mcpServers` block into **`~/.cursor/mcp.json`** or **`.cursor/mcp.json`** and replace the bearer value with your JWT (Cursor does not resolve **`user_config`** — use a literal **`Bearer <token>`** or an env placeholder your client supports). Get the key from [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) → **"API key for Freddy AI Copilot VS Code plugin"** → **Copy**.

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
| Structured **app review** (iparams, frontend, script-backed checks, fixed report format) | `skills/fw-review/SKILL.md` | **Does not** install FDK; verify CLI with **fw-setup** (`/fw-setup-status`) or `fdk --version` before phases that need `fdk` |
| Install, upgrade, or troubleshoot **FDK** and **Node** (nvm, PATH, versions) | `skills/fw-setup/SKILL.md` | Use before relying on `fdk validate` when the toolchain is missing or wrong |
| Publish a built app to the marketplace, check status, list apps | `skills/fw-publish/SKILL.md` | Requires MCP tools configured (API key from Developer Portal profile) |

If **toolchain + app + publish** apply: **fw-setup** first, then **fw-app-dev** or **fw-ai-app-dev** (by task), optionally **fw-review** before submission, then **fw-publish** when publishing.

**End-to-end reference (cold machine → ship):** **fw-setup** (FDK/Node) → **fw-app-dev** (full UI app) and/or **fw-ai-app-dev** (`actions.json` / SMI) → optional **fw-review** (structured audit; not the same as **fw-app-dev** `/fdk-review`) → **fw-publish** (MCP upload/submit). Humans: expanded narrative under **`README.md`** *From toolchain to marketplace (lifecycle)*; agents: tables above plus per-skill `SKILL.md`.

## Non-negotiables (app work)

When generating or editing **Freshworks apps** (not this repo’s markdown), **`skills/fw-app-dev/SKILL.md`** is authoritative. In short:

- **Platform version** `"3.0"`; **`modules`**, not legacy `product`
- **External HTTP** only via **`$request.invokeTemplate` / `client.request.invokeTemplate`** and **`config/requests.json`** templates (no `$request.post|get|put|delete`)
- **OAuth** uses the **`integrations`** wrapper in `oauth_config.json`
- **`fdk validate`**: **zero** platform errors and **zero** lint errors before calling an app complete; **`README.md`** and **`app/styles/images/icon.svg`** (frontend) where the skill requires them
- **Before `fdk validate`**: follow **`skills/fw-app-dev/SKILL.md`** (*Manifest + toolchain gate*): **`fw-setup`** if **FDK 10 + Node 24** is missing, then **`/fdk-migrate`** for legacy **2.x** or old **`engines`**, then validate; do not downgrade to **FDK 9 / Node 18** as a shortcut
- **New app engines**: **`fdk` `10.0.1`** and **`node` `24.11.0`** unless **fw-app-dev** `SKILL.md` **LAST RESORT** rules apply

## Repository layout (skills)

- **`skills/{fw-app-dev|fw-ai-app-dev|fw-review|fw-setup|fw-publish}/SKILL.md`** — skill entry and frontmatter
- **`skills/*/rules/*.{mdc,md}`** — editor rules (`.mdc`) or **fw-review** audit rules (`.md`); loaded via each plugin’s `rulesDirectory` / `rulesPath`
- **`skills/*/commands/*.md`** — slash-command bodies where the skill defines them (**fw-app-dev**, **fw-setup** only); stem of filename → `/command-name` in the IDE
- **`skills/fw-review/scripts/*.js`** — deterministic SC-* checks (not slash commands); mapped from `skills/fw-review/rules/script-check-rules.md`
- **`skills/*/references/**`** — load **on demand** (API, errors, events, playbooks); index: `skills/fw-app-dev/references/skill-advanced-topics.md`
- **`skills/*/assets/templates/**`** — app skeletons
- **`skills/fw-publish/subagents/**`** — optional deep-dive prompts (no `rules/` or `commands/` trees in that skill)
- **`.mcp.json`** (repository root) — canonical **`fw-dev-mcp`** MCP server URL + `Authorization` header shape; see **`skills/fw-publish/SKILL.md`** for Cursor vs Claude setup notes
- **`.claude/settings.json`** — Claude Code project permissions (MCP defaults for this repo; server key must match **`.mcp.json`**)
- **`.claude-plugin/marketplace.json`**, **`.cursor-plugin/marketplace.json`** — multi-skill registries (`name`: **`freshworks-dev-tools`**; each plugin lists `author`, `license`, `category`, `strict`, `version`, optional `interface`, like [Salesforce B2C marketplace.json](https://github.com/SalesforceCommerceCloud/b2c-developer-tooling/blob/main/.claude-plugin/marketplace.json))

**Single source of truth:** rules and commands live under each skill’s `rules/` and `commands/` where present; IDE plugin JSON points there—do not duplicate command/rule trees under `.cursor/` inside skills.

## Rules and slash commands (inventory)

Use this list when adding or renaming files so **`.cursor-plugin/marketplace.json`** `rulesPath` / `commandsPath` and plugin `plugin.json` entries stay aligned.

### fw-setup — `skills/fw-setup/`

| Slash command | Command file |
|---------------|----------------|
| `/fw-setup-install` | `commands/fw-setup-install.md` |
| `/fw-setup-upgrade` | `commands/fw-setup-upgrade.md` |
| `/fw-setup-downgrade` | `commands/fw-setup-downgrade.md` |
| `/fw-setup-uninstall` | `commands/fw-setup-uninstall.md` |
| `/fw-setup-status` | `commands/fw-setup-status.md` |
| `/fw-setup-troubleshoot` | `commands/fw-setup-troubleshoot.md` |
| `/fw-setup-use` | `commands/fw-setup-use.md` |

**Rules (`.mdc`):** `rules/fdk-enforcement.mdc`

*(Legacy `/fdk-*` names may still appear in some environments if the client registered aliases; prefer `/fw-setup-*`.)*

### fw-app-dev — `skills/fw-app-dev/`

| Slash command | Command file |
|---------------|----------------|
| `/fdk-fix` | `commands/fdk-fix.md` |
| `/fdk-migrate` | `commands/fdk-migrate.md` |
| `/fdk-refactor` | `commands/fdk-refactor.md` |
| `/fdk-review` | `commands/fdk-review.md` |

**Rules (`.mdc`):** `app-building-blocking-gates.mdc`, `app-templates.mdc`, `async-patterns.mdc`, `complexity-reduction.mdc`, `confusion.mdc`, `freshworks-platform3.mdc`, `platform3-modules-locations.mdc`, `prerequisites-check.mdc`, `security.mdc`, `validation-workflow.mdc`

### fw-ai-app-dev — `skills/fw-ai-app-dev/`

**Commands:** none (orchestration in `SKILL.md`, optional prompts under `agents/`).

**Rules (`.mdc`):** `ai-actions-api-docs.mdc`, `ai-actions-platform.mdc`, `ai-actions-readme.mdc`, `ai-actions-requests.mdc`, `ai-actions-schemas.mdc`, `ai-actions-server.mdc`, `ai-actions-test-data.mdc`, `ai-actions-validation.mdc`

### fw-review — `skills/fw-review/`

**Commands:** none (silent pipeline in `SKILL.md`; checks via `scripts/*.js` per `rules/script-check-rules.md`).

**Rules (`.md`):** `frontend-files-rules.md`, `iparam-rules.md`, `report.md`, `script-check-rules.md`

### fw-publish — `skills/fw-publish/`

**Commands:** none. **Rules:** none. Playbooks in `SKILL.md`, `references/`, and `subagents/`; MCP in repo root **`.mcp.json`**.

## Editing this repo (maintenance)

- Prefer **small, focused diffs**; match existing markdown and plugin patterns
- **`CONTRIBUTING.md`** — contribution and structure expectations
- **Skill evaluation tooling** (optional): `.agents/skills/skill-creator/scripts/` (for example `quick_validate.py`, `package_skill.py`)

## Human-facing install

See **`README.md`** for `npx skills add` URLs and Cursor copy paths. **`TROUBLESHOOTING.md`** covers IDE and skill load issues.

# Agent instructions (Freshworks marketplace skills)

This repository is a **multi-IDE skill marketplace** for AI assistants working on **Freshworks Platform 3.0** marketplace apps. **This file** is the agent entry point and routing layer. For human overview, install URLs, and badges, see **`README.md`**. For contribution layout and conventions, see **`CONTRIBUTING.md`**. For FDK/skill install problems, see **`TROUBLESHOOTING.md`**. **Engine / Node / FDK authoritative pins:** **`docs/engine-matrix.md`**.

## OpenAI Codex

The same skill content is packaged for **OpenAI Codex** via **`.codex-plugin/plugin.json`**. Slash commands listed in this file are **Cursor / Claude** affordances; Codex loads **`skills/*/SKILL.md`** and optional **MCP** from **`.mcp.json`**.

## Skills and MCP tools available

### Skills (installed via this repo)

| Skill | Entry point | What it does |
|-------|-------------|--------------|
| **fw-setup** | `skills/fw-setup/SKILL.md` | Install, upgrade, downgrade, or uninstall **FDK 10.x + Node 24.11.x** (and **deprecated** **FDK 9.x + Node 18**) via nvm / nvm-windows. Verifies persistence across shells (**Unix** and **Windows**). Slash commands: `/fw-setup-install`, … |
| **fw-app-dev** | `skills/fw-app-dev/SKILL.md` | Build, fix, review, or migrate **Platform 3.0** apps end-to-end: idea collection, implementation planning, code generation, manifest enforcement, `fdk validate` with up to 6 auto-fix iterations, and post-generation guidance. Handles manifest structure, `requests.json`, OAuth, serverless, frontend Crayons, and tracking fields (`tracking_id`, `start_time`). |
| **fw-ai-actions-app** | `skills/fw-ai-actions-app/SKILL.md` | **AI Actions** and third-party integrations: `actions.json`, SMI handlers, flat request schemas, `$request.invokeTemplate`, test data, validation, debugging endpoints, and integration scoping (no full UI app folder). Pair with **fw-app-dev** when the work is a full marketplace app with locations and Crayons. |
| **fw-review** | `skills/fw-review/SKILL.md` | **Automated marketplace app audit**: manifest and iparams review, frontend rules, deterministic `scripts/*.js` checks for SC-* rule IDs, and structured **App Review Result** output per `rules/report.md`. Silent pipeline; does not install FDK — use **fw-setup** when `fdk` may be missing. |
| **fw-publish** | `skills/fw-publish/SKILL.md` | Publish a built Platform 3.0 app via MCP (**openai-server**): `fdk validate`, `fdk pack`, **`create_app_upload_url`**, zip upload, **`submit_custom_app`** / **`add_app_version`**, **`get_app_status`**. Tool names match **`skills/fw-publish/references/openai-server-mcp-tools.md`**. Checks auth before publish. |

### MCP tools (fw-dev-mcp server)

This repository **bundles MCP config at the root**: **`.mcp.json`** (`fw-dev-mcp` → `https://mcp.freshworks.dev/mcp`, `Authorization` header). In **Claude Code**, installing the marketplace plugin uses that shape and prompts for your API key (token in keychain via **`userConfig.mcp_auth_token`**, referenced as **`${user_config.mcp_auth_token}`**). In **Cursor**, copy or merge the same `mcpServers` block into **`~/.cursor/mcp.json`** or **`.cursor/mcp.json`** and replace the bearer value with your JWT (Cursor does not resolve **`user_config`** — use a literal **`Bearer <token>`** or an env placeholder your client supports). Get the key from [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/): **Developer API Key** → **Connect to Developer MCP server** → **Copy**.

| Tool | Purpose | Skill Handover Point |
|------|---------|---------------------|
| **`list_custom_apps`** | List all custom apps. Returns **`count`** and **`apps`** (each: **`id`**, **`name`**, **`type`**, **`state`**, **`products`**, **`latestVersion`**). Optional **`page`**, **`perPage`**. | **fw-publish** Step 1 (auth check), Step 6 (app selection for updates) |
| **`list_app_versions`** | List all versions for one app. Returns array with **`id`**, **`version`**, **`platformVersion`**, **`state`**, **`updatedAt`** per version. | **fw-publish** Step 6 (**CRITICAL** - check for stuck **`development`** versions before **`add_app_version`**) |
| **`create_app_upload_url`** | Generate presigned S3 upload URL. Returns **`uploadId`**, **`uploadUrl`**, **`httpMethod`** (`"PUT"`), **`expiresInSeconds`**. | **fw-publish** Step 7 (after `fdk pack`, before zip upload) |
| **`submit_custom_app`** | Create new custom app + first version. Requires **`appName`**, **`appDescription`**, **`appOverview`**, **`supportEmail`**, **`platformVersion`**, **`modules`**, **`uploadId`**. | **fw-publish** Step 10 (new app path) |
| **`add_app_version`** | Add new version to existing app. Requires **`appId`** (from **`list_custom_apps`** + user selection), **`platformVersion`**, **`modules`**, **`uploadId`**. **Cannot proceed** if any version is in **`development`** state. | **fw-publish** Step 10 (existing app path, after version check) |
| **`get_app_status`** | Get aggregate app-level status. Returns **`state`** reflecting all versions. On failures, **`state`** often rolls back to **`development`**. | **fw-publish** Step 12 (post-publish verification) |
| **`get_developer_docs`** | Fetch developer documentation. **FALLBACK ONLY** - use only if **fw-app-dev** skill fails or when skill explicitly delegates. | FALLBACK (use fw-app-dev skill first) |

**DEPRECATED MCP tools** (do NOT use - always use **fw-app-dev** skill instead): **`implement_app`**, **`get_implementation_plan`**, **`idea_to_app`**, **`fix_app_errors`**. These tools bypass skill orchestration, validation workflows, and prerequisite checks. Always route app development work through **`skills/fw-app-dev/SKILL.md`**.

**Skills orchestrate tools.** Follow each skill’s playbook rather than inventing parallel flows; each skill documents preconditions, tool use, and error handling.

## Which skill to follow

| User goal | Open first | Notes |
|-----------|------------|--------|
| Build, fix, review, or migrate a **Platform 3.0 app** (manifest, requests, OAuth, serverless, UI) | `skills/fw-app-dev/SKILL.md` | **Does not** install FDK or Node |
| **AI Actions** integrations (`actions.json`, SMI, request templates, third-party APIs, test data) | `skills/fw-ai-actions-app/SKILL.md` | **Does not** install FDK or Node; not a substitute for full **fw-app-dev** UI/marketplace app work |
| Structured **app review** (iparams, frontend, script-backed checks, fixed report format) | `skills/fw-review/SKILL.md` | **Does not** install FDK; verify CLI with **fw-setup** (`/fw-setup-status`) or `fdk --version` before phases that need `fdk` |
| Install, upgrade, or troubleshoot **FDK** and **Node** (nvm, PATH, versions) | `skills/fw-setup/SKILL.md` | Use before relying on `fdk validate` when the toolchain is missing or wrong |
| Publish a built app to the marketplace, check status, list apps | `skills/fw-publish/SKILL.md` | Requires MCP tools configured (JWT from Portal: **API key for Freddy AI Copilot for VS Code plugin & AI Developer Tools.** → **Connect to Developer MCP server**) |

If **toolchain + app + publish** apply: **fw-setup** first, then **fw-app-dev** or **fw-ai-actions-app** (by task), **MANDATORY fw-review** before submission, then **fw-publish** when publishing.

**End-to-end reference (cold machine → ship):** **fw-setup** (FDK/Node) → **fw-app-dev** (full UI app) and/or **fw-ai-actions-app** (`actions.json` / SMI) → **MANDATORY fw-review** (structured audit; not the same as **fw-app-dev** `/fdk-review`) → **fw-publish** (MCP upload/submit). Humans: expanded narrative under **`README.md`** *From toolchain to marketplace (lifecycle)*; agents: tables above plus per-skill `SKILL.md`.

## Non-negotiables (app work)

When generating or editing **Freshworks apps** (not this repo’s markdown), **`skills/fw-app-dev/SKILL.md`** is authoritative. In short:

- **Platform version** `"3.0"`; **`modules`**, not legacy `product`
- **External HTTP** only via **`$request.invokeTemplate` / `client.request.invokeTemplate`** and **`config/requests.json`** templates (no `$request.post|get|put|delete`)
- **OAuth** uses the **`integrations`** wrapper in `oauth_config.json`
- **`fdk validate`**: **zero** platform errors and **zero** lint errors before calling an app complete; **`README.md`** and **`app/styles/images/icon.svg`** (frontend) where the skill requires them
- **Before `fdk validate`:** follow **`skills/fw-app-dev/SKILL.md`** (*Manifest + toolchain gate*): **`fw-setup`** if **FDK 10 + Node 24** is missing; **`/fdk-migrate`** for legacy **2.x** or old **`engines`**; then validate. **Do not** downgrade toolchain or **`engines`** to **FDK 9 / Node 18** as a shortcut (except **LAST RESORT** in that `SKILL.md` after six validate iterations when only the toolchain blocks validation).
- **New app engines**: **`fdk` `10.0.1`** and **`node` `24.11.0`** unless **fw-app-dev** `SKILL.md` **LAST RESORT** rules apply

## Repository layout (skills)

- **`skills/{fw-app-dev|fw-ai-actions-app|fw-review|fw-setup|fw-publish}/SKILL.md`** — skill entry and frontmatter
- **`skills/*/rules/*.{mdc,md}`** — editor rules (`.mdc`) or **fw-review** audit rules (`.md`); loaded via each plugin’s `rulesDirectory` / `rulesPath`
- **`skills/*/commands/*.md`** — slash-command bodies where the skill defines them (**fw-app-dev**, **fw-setup** only); stem of filename → `/command-name` in the IDE
- **`skills/fw-review/scripts/*.js`** — deterministic SC-* checks (not slash commands); mapped from `skills/fw-review/rules/script-check-rules.md`
- **`skills/*/references/**`** — load **on demand** (API, errors, events, playbooks); index: `skills/fw-app-dev/references/skill-advanced-topics.md`
- **`skills/*/assets/templates/**`** — app skeletons
- **`skills/fw-publish/subagents/**`** — optional deep-dive prompts (no `rules/` or `commands/` trees in that skill)
- **`.mcp.json`** (repository root) — canonical **`fw-dev-mcp`** MCP server URL + `Authorization` header shape; see **`skills/fw-publish/SKILL.md`** for Cursor vs Claude setup notes
- **`.claude/`** (repository root) — **not versioned**; create local Claude Code project settings if needed (MCP server id should match **`.mcp.json`** when configuring publish)
- **`.claude-plugin/marketplace.json`**, **`.cursor-plugin/marketplace.json`** — multi-skill registries (`name`: **`freshworks-dev-tools`**; **`displayName`**: **Freshworks Developer Tools**; optional **`logo`** → **`assets/fw-logo.svg`**); each plugin lists `author`, `license`, `category`, `strict`, `version`, optional `interface` (same pattern as [Salesforce B2C marketplace.json](https://github.com/SalesforceCommerceCloud/b2c-developer-tooling/blob/main/.claude-plugin/marketplace.json)).
- **`assets/fw-logo.svg`** — Umbrella branding for Plugins / marketplace UIs (referenced from **`.cursor-plugin`**, **`.claude-plugin`**, **`.codex-plugin`**, **`.agents/plugins`**).

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

**Rules (`.mdc`):** `app-building-blocking-gates.mdc`, `app-templates.mdc`, `async-patterns.mdc`, `complexity-reduction.mdc`, `confusion.mdc`, `freshworks-platform3.mdc`, `platform3-modules-locations.mdc`, `prerequisites-check.mdc`, `smart-prerequisites-check.mdc`, `security.mdc`, `validation-workflow.mdc`

### fw-ai-actions-app — `skills/fw-ai-actions-app/`

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
- **`docs/engine-matrix.md`** — FDK / Node pin source of truth when changing toolchain guidance
- **Skill evaluation tooling** (optional): `.agents/skills/skill-creator/scripts/` (for example `quick_validate.py`, `package_skill.py`)

## Human-facing install

See **[README.md](README.md#contents)** (human **Installation**) for Skills CLI (`npx skills add`), **Cursor** / **Claude** / **Codex** umbrella manifests, MCP pointers, and **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for IDE load issues.

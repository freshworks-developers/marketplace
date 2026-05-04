---
name: fw-publish
description: "Publish any Freshworks Platform 3.0 custom app via MCP tools: fdk validate/pack, app-upload, and submit/update through openai-server. Use when the user wants to push an app to the Marketplace for QA (test) or review, check publish status, or list existing apps. Pair with fw-app-dev for manifest or module fixes. Works with Cursor, Claude Code, and any MCP-compliant client."
version: "1.3.0"
compatibility: "Freshworks Platform 3.0, MCP (fw-dev-mcp), Developer Portal JWT"
---

# Publish (Platform 3.0 custom app)

**MANDATORY PREREQUISITE:** Run **fw-review** skill before publishing to ensure marketplace compliance. The review checks iparams, frontend files, security patterns, and generates a structured audit report. Do not proceed with publishing until review passes.

**Goal:** Take **any** Platform **3.0** app folder (with `manifest.json`), produce `dist/*.zip`, and publish it to the **Freshworks Marketplace** via MCP tools. Target state is **test** (default, installable for QA) or **review** (submit for marketplace listing).

## Agent playbook (MCP tools)

**Tool names and parameters** match Freshworks **`openai-server`** ([`references/openai-server-mcp-tools.md`](references/openai-server-mcp-tools.md)). Hosted MCP: **`https://mcp.freshworks.dev/mcp`**.

### 1. Auth token preflight (MUST be step 1)

Before any MCP tool call, verify that the MCP publish tools are available and authenticated:
- Attempt to call **`list_custom_apps`** (optionally `{}` or `{ "page": 1, "perPage": 10 }` — follow **`tools/list`** / server schema)
- If tools are not available or the call returns an auth error, **STOP and notify the user:**

```
Publish requires a Marketplace API token configured in your MCP settings.

To set this up:
1. Go to https://developers.freshworks.com/developer/
2. **Developer API Key** → **Connect to Developer MCP server**
3. Click **Copy**
4. Configure it for your IDE:
   Claude Code:
     The freshworks plugin prompts for "MCP server URL" and
     "Marketplace API token (JWT)" at install time. If you skipped the
     prompts, run /config and update the plugin settings. The token is
     stored securely in the system keychain.

   Cursor:
     Add the server to ~/.cursor/mcp.json (global) or
     .cursor/mcp.json (project-level). The canonical template is
     **`.mcp.json`** at this repository’s root (same `mcpServers` shape);
     use **`Bearer <your-jwt-token>`** in place of Claude’s
     **`${user_config.mcp_auth_token}`** — Cursor does not expand
     **`user_config`**.
     {
       "mcpServers": {
         "fw-dev-mcp": {
           "url": "https://mcp.freshworks.dev/mcp",
           "headers": {
             "Authorization": "Bearer <your-jwt-token>"
           }
         }
       }
     }
     Replace <your-jwt-token> with your Developer Portal JWT, then
     restart Cursor.

5. Re-run the publish command
```

The JWT is a **single credential** — it authenticates to `openai-server` and is forwarded verbatim to MAPI. It contains `developer_account_id` and `uuid` claims. There is no separate MAPI token.

**DO NOT proceed with any publish step until auth is confirmed.**

### 2. Determine app directory

**Use the same steps as fw-app-dev `/fdk-fix` Step 1** — see [`../fw-app-dev/commands/fdk-fix.md`](../fw-app-dev/commands/fdk-fix.md) (*Determine app directory*):

1. Search the workspace for `manifest.json` files.
2. If **multiple folders** contain manifest.json: Ask the user which app to publish.
3. If **one folder**: Use that directory.
4. If **none**: Inform the user and stop.

**Maintenance:** When **fw-app-dev** command playbooks change their “determine app directory” steps (e.g. `fdk-fix`, `fdk-migrate`, `fdk-review`, `fdk-refactor`), update this step to stay in lockstep with [`fdk-fix.md`](../fw-app-dev/commands/fdk-fix.md) Step 1 unless intentionally diverging.

### 3. Check Node.js and FDK versions (before pack)

- Read `engines.node` and `engines.fdk` from `manifest.json` in the app directory
- Check active versions: `node --version` and `fdk --version`
- **If mismatch, STOP and inform user:**
  ```
  Your app requires Node.js X.Y.Z and FDK A.B.C (from manifest.json engines).

  Current environment: Node vW.X.Y, FDK vP.Q.R

  Would you like me to install/switch to the required versions? (yes/no)

  If yes, I'll use the fw-setup skill to:
  - Install Node.js X.Y.Z (if not present) and switch to it
  - Install/upgrade to FDK A.B.C

  If no, you can manually run:
  - /fw-setup-use (in app directory) - switches Node version
  - /fw-setup-install --version A.B.C - installs FDK version
  - /fw-setup-upgrade --to A.B.C - upgrades FDK version
  ```
- **DO NOT proceed with `fdk pack` until versions match or user explicitly overrides**

### 4. fdk validate

Run `cd <app-directory> && fdk validate` — zero platform errors and zero lint errors required. On failure, suggest using the **fw-app-dev** skill to fix issues.

### 5. fdk pack

From the app directory:

```bash
cd <app-directory> && printf 'Y\n' | fdk pack --skip-coverage --skip-lint
```

Produces `dist/*.zip`. Reuse an existing zip only if `--force-pack` is not needed (agent judgment).

### 6. New listing vs update + select app

**Do not** read **`appId`** from **`.fdk/app-info.json`** for routing or MCP calls. Always resolve the target Marketplace app through **`list_custom_apps`** and **developer selection**.

1. Ask whether this publish is a **new Marketplace listing** or an **update** to an existing listing (skip if the user already said which).
2. **New listing:** use **`submit_custom_app`** after upload (steps 7–10). No `appId` required beforehand.
3. **Update:** call **`list_custom_apps`**. Present **`apps`** from the response (or the paginated list) to the developer (**`id`**, **`name`**, **`type`**, **`products`**, **`latestVersion`**, etc.). **They select** which listing receives this build; use that **`appId`** with **`add_app_version`** in step 10 **when that tool is registered on your MCP server** — confirm with **`tools/list`**; if **`add_app_version`** is absent, stop and tell the developer updates require the tool (openai-server exposes it in phase 2 per **`AppPublishFeature.java`**) or use the developer portal.
4. If they chose **update** but the list is **empty**, explain that no apps exist on the account and offer **new listing** or cancel.

Optional: if only **one** app exists and the developer already confirmed **update**, you may select it **after** showing it and asking for a quick confirm — still **do not** use `.fdk/app-info.json` for `appId`.

### 7. Create app-upload URL

Call `create_app_upload_url` — returns `uploadId` + `uploadUrl` + `expiresInSeconds`.

### 8. App-upload (PUT zip binary)

From the app directory (where `fdk pack` wrote `dist/`):

```bash
curl -X PUT --data-binary @dist/<app>.zip "<uploadUrl>"
```

Do **not** base64-encode the zip. Do **not** paste the **app-upload** URL into chat or tickets.

### 9. Read manifest.json

Read `manifest.json` in the app directory. Extract:
- `platform-version` (e.g. `"3.0"`)
- `modules` keys (e.g. `["common", "support_ticket"]`)
- `name` (if present) for `appName`

### 10. Call the appropriate MCP tool

**New app** — **`submit_custom_app`**:

| Parameter | Source |
|-----------|--------|
| `appName` | manifest `name` or directory name |
| `appDescription` | ask user or default |
| `appOverview` | ask user or derive from description (max 150 chars) |
| `supportEmail` | ask user (required for new app; no separate on-disk token file) |
| `alternateEmail` | optional |
| `platformVersion` | manifest `platform-version` |
| `modules` | manifest `modules` keys (see **`openai-server`** tool schema — at least one non-`common` module may be required) |
| `uploadId` | from step 7 |
| `targetState` | `"test"` (default) or `"review"` (ask user) |
| `zipFileName` | optional (e.g. `my-app.zip`) |
| `worksWith` | optional; include `"ai_actions"` if AI Actions app |

**Existing app** — **`add_app_version`** (when available on MCP):

| Parameter | Source |
|-----------|--------|
| `appId` | **Developer-selected** `appId` from **`list_custom_apps`** (step 6) — not from `.fdk/app-info.json` |
| `platformVersion` | manifest `platform-version` |
| `modules` | manifest `modules` keys |
| `uploadId` | from step 7 |
| `targetState` | `"test"` (default) or `"review"` |
| `zipFileName` | optional |
| `worksWith` | optional |

### 11. Persist app identity (optional, local only)

You **may** write or update `.fdk/app-info.json` in the app directory with `id` and `version` from the response as a **local record**. **The next publish still follows step 6** — **`list_custom_apps`** + developer selection for updates — **do not** skip listing or rely on this file for `appId`.

### 12. Verify status

Call **`get_app_status`** with the **`appId`** returned from submit/update (or the selected listing id) to confirm app-level state.

### 13. Report to user

Tell the user: **app id**, **version state**, and where to install custom apps in their product (**Admin -> Apps** or equivalent).

## MCP tools reference (`openai-server`)

See **[`references/openai-server-mcp-tools.md`](references/openai-server-mcp-tools.md)** for full names, parameters, and optional app-generation tools on the same server.

| Tool | Purpose |
|------|---------|
| **`list_custom_apps`** | Returns **`count`** and **`apps`** (each: **`id`**, **`name`**, **`type`**, **`subType`**, **`subscriptionType`**, **`state`**, **`products`**, **`latestVersion`**). Optional **`page`**, **`perPage`**. |
| **`create_app_upload_url`** | Presigned upload; returns **`uploadId`**, **`uploadUrl`**, **`expiresInSeconds`** |
| **`submit_custom_app`** | New app + first version after zip **PUT** |
| **`add_app_version`** | New version on existing app (**`appId`** from **`list_custom_apps`**) — confirm **`tools/list`**; phase 2 registration in some **`openai-server`** builds |
| **`get_app_status`** | App-level status by **`appId`** |

Also available on the same MCP server (optional idea → plan → implement guides): **`get_app_details`**, **`get_implementation_plan`**, **`implement_app`** — see the reference doc.

## Error handling

- **401/403 from any MCP tool:** STOP immediately and show the auth setup instructions from step 1. The token may be expired, misconfigured, or missing. Do not retry — prompt the user to fix their token and re-run.
- **Validation errors (400):** Suggest manifest fixes or use fw-app-dev skill. Common: products vs modules mismatch.
- **Upload failures:** Retry `create_app_upload_url` + re-upload.
- **fdk validate / fdk pack failures:** Use fw-app-dev skill to fix; check Node/FDK version alignment.

## Preconditions

| Requirement | Notes |
|-------------|--------|
| `manifest.json` | App root; must be Platform 3.0 with `modules`. |
| `fdk` on PATH | `fdk validate` + `fdk pack`. |
| MCP tools configured | Claude Code: from root **`.mcp.json`** when the marketplace plugin is installed (prompted at install via `userConfig`). Cursor: merge that file’s server block into `~/.cursor/mcp.json`. |
| Support email | Required for **create** (new app); updates reuse publisher metadata from the existing marketplace app. |
| App identity for updates | Developer picks **`appId`** from **`list_custom_apps`** (step 6). Do not use `.fdk/app-info.json` for routing. |

## Optional: list apps

For **updates**, **`list_custom_apps`** is part of **step 6** (developer selects `appId`). You may also call it anytime to inspect apps on the account without publishing.

## Links

- **[`references/openai-server-mcp-tools.md`](references/openai-server-mcp-tools.md)** — MCP tools implemented in **`mp-openai`** **`openai-server`**

- Developer Portal — copy API key: [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) (**API key for Freddy AI Copilot for VS Code plugin & AI Developer Tools.** → **Connect to Developer MCP server**)
- Marketplace API overview (public): [api.freshworks.com/marketplace/v2](https://api.freshworks.com/marketplace/v2)

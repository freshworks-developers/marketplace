---
name: fw-publish
description: "Publish any Freshworks Platform 3.0 custom app via MCP tools: fdk validate/pack, app-upload, and submit/update through openai-server. Use when the user wants to push an app to the Marketplace for QA (test) or review, check publish status, or list existing apps. Pair with fw-app-dev for manifest or module fixes. Works with Cursor, Claude Code, and any MCP-compliant client."
---

# Publish (Platform 3.0 custom app)

**Goal:** Take **any** Platform **3.0** app folder (with `manifest.json`), produce `dist/*.zip`, and publish it to the **Freshworks Marketplace** via MCP tools. Target state is **test** (default, installable for QA) or **review** (submit for marketplace listing).

## Agent playbook (MCP tools)

### 1. Auth token preflight (MUST be step 1)

Before any MCP tool call, verify that the MCP publish tools are available and authenticated:
- Attempt to call `list_marketplace_apps`
- If tools are not available or the call returns an auth error, **STOP and notify the user:**

```
Publish requires a Marketplace API token configured in your MCP settings.

To set this up:
1. Go to https://developers.freshworks.com/developer/
2. Find the **"API key for Freddy AI Copilot VS Code plugin"** section and click **Copy**
3. Configure it for your IDE:

   Claude Code:
     The freshworks plugin prompts for "MCP server URL" and
     "Marketplace API token (JWT)" at install time. If you skipped the
     prompts, run /config and update the plugin settings. The token is
     stored securely in the system keychain.

   Cursor:
     Add the server to ~/.cursor/mcp.json (global) or
     .cursor/mcp.json (project-level). The canonical template is
     **`skills/fw-publish/.mcp.json`** in this repo (same `mcpServers` shape);
     use **`Bearer <your-jwt-token>`** in place of Claude’s
     **`${user_config.mcp_auth_token}`** — Cursor does not expand
     **`user_config`**.
     {
       "mcpServers": {
         "freshworks-marketplace": {
           "url": "https://mcp.freshworks.dev/mcp",
           "headers": {
             "Authorization": "Bearer <your-jwt-token>"
           }
         }
       }
     }
     Replace <your-jwt-token> with your Developer Portal JWT, then
     restart Cursor.

4. Re-run the publish command
```

The JWT is a **single credential** — it authenticates to `openai-server` and is forwarded verbatim to MAPI. It contains `developer_account_id` and `uuid` claims. There is no separate MAPI token.

**DO NOT proceed with any publish step until auth is confirmed.**

### 2. Check Node.js and FDK versions (before pack)

- Read `engines.node` and `engines.fdk` from `manifest.json`
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

### 3. Resolve APP_DIR

Absolute path to the folder containing `manifest.json`.

### 4. fdk validate

Run `fdk validate` — zero platform errors and zero lint errors required. On failure, suggest using the **fw-app-dev** skill to fix issues.

### 5. fdk pack

```bash
printf 'Y\n' | fdk pack --skip-coverage --skip-lint
```

Produces `dist/*.zip`. Reuse an existing zip only if `--force-pack` is not needed (agent judgment).

### 6. Determine new vs update

- Check `.fdk/app-info.json` for `id`
- If `id` exists: this is an **update** — use `update_marketplace_app_version`
- If no `id`: call `list_marketplace_apps` to see if the app already exists
  - If found: ask user to pick the app, then use `update_marketplace_app_version`
  - If not found or user confirms new: use `submit_marketplace_app`

### 7. Create app-upload URL

Call `create_app_upload_url` — returns `uploadId` + `uploadUrl` + `expiresInSeconds`.

### 8. App-upload (PUT zip binary)

```bash
curl -X PUT --data-binary @dist/<app>.zip "<uploadUrl>"
```

Do **not** base64-encode the zip. Do **not** paste the **app-upload** URL into chat or tickets.

### 9. Read manifest.json

Extract:
- `platform-version` (e.g. `"3.0"`)
- `modules` keys (e.g. `["common", "support_ticket"]`)
- `name` (if present) for `appName`

### 10. Call the appropriate MCP tool

**New app** — `submit_marketplace_app`:

| Parameter | Source |
|-----------|--------|
| `appName` | manifest `name` or directory name |
| `appDescription` | ask user or default |
| `appOverview` | ask user or derive from description (max 150 chars) |
| `supportEmail` | ask user (required for new app; no separate on-disk token file) |
| `alternateEmail` | optional |
| `platformVersion` | manifest `platform-version` |
| `modules` | manifest `modules` keys |
| `uploadId` | from step 7 |
| `targetState` | `"test"` (default) or `"review"` (ask user) |
| `appType` | `"custom"` (default) unless user specifies |
| `worksWith` | optional; include `"ai_actions"` if AI Actions app |

**Existing app** — `update_marketplace_app_version`:

| Parameter | Source |
|-----------|--------|
| `appId` | from `.fdk/app-info.json` `id` or `list_marketplace_apps` |
| `platformVersion` | manifest `platform-version` |
| `modules` | manifest `modules` keys |
| `uploadId` | from step 7 |
| `targetState` | `"test"` (default) or `"review"` |
| `worksWith` | optional |

### 11. Persist app identity

On success, write/update `.fdk/app-info.json` with `id` and `version` from the response so the next run routes to update.

### 12. Verify status

Call `get_marketplace_app_status(appId)` to confirm the version state.

### 13. Report to user

Tell the user: **app id**, **version state**, and where to install custom apps in their product (**Admin -> Apps** or equivalent).

## MCP tools reference

| Tool | Purpose |
|------|---------|
| `list_marketplace_apps` | List all apps on the developer account |
| `create_app_upload_url` | Get **app-upload** URL for the zip binary |
| `submit_marketplace_app` | Create a new app + first version |
| `update_marketplace_app_version` | Upload a new version to an existing app |
| `get_marketplace_app_status` | Check app state and latest version |

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
| MCP tools configured | Claude Code: from **`skills/fw-publish/.mcp.json`** when the publish plugin is installed (prompted at install via `userConfig`). Cursor: merge that file’s server block into `~/.cursor/mcp.json`. |
| Support email | Required for **create** (new app); updates reuse publisher metadata from the existing marketplace app. |
| App identity for updates | `.fdk/app-info.json` with `id` after first successful publish. |

## Optional: list apps

Call `list_marketplace_apps` MCP tool (no parameters). Returns app id, name, type, products, and latest version for each app.

## Links

- Developer Portal (API key): [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/)
- Marketplace API overview (public): [api.freshworks.com/marketplace/v2](https://api.freshworks.com/marketplace/v2)

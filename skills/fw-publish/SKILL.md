---
name: fw-publish
description: "Publish any Freshworks Platform 3.0 custom app via MCP tools: fdk validate/pack, app-upload, and submit/update through openai-server. At publish time, ask new vs existing listing; list_custom_apps for updates so the developer selects appId, then MCP handover (submit_custom_app or add_app_version with uploadId). Use when the user wants to push an app to the Marketplace for QA (test) or review, check publish status, or list existing apps. Pair with fw-app-dev for manifest or module fixes. Works with Cursor, Claude Code, and any MCP-compliant client."
version: "1.0.0"
compatibility: "Freshworks Platform 3.0, MCP (fw-dev-mcp), Developer Portal JWT"
---

# Publish (Platform 3.0 custom app)

**MANDATORY PREREQUISITE:** Run **fw-review** skill before publishing to ensure marketplace compliance. The review checks iparams, frontend files, security patterns, and generates a structured audit report. Do not proceed with publishing until review passes.

**Goal:** Take **any** Platform **3.0** app folder (with `manifest.json`), produce `dist/*.zip`, and publish it to the **Freshworks Marketplace** via MCP tools. Target state is **test** (default, installable for QA) or **review** (submit for marketplace listing).

**Sandbox / agent egress:** Publish **does not work** in **sandbox** (or equivalent) modes that block MCP traffic to `https://mcp.freshworks.dev/mcp` or outbound HTTPS (including **`curl`** PUT to the app-upload URL). Some **cloud or CI agent** runtimes send HTTPS through a **proxy, gateway, or assumed IAM role** that is **not allowed** to `PUT` to the Marketplace app-upload bucket (`fa-*-app-uploads`…): S3 returns **`403` / `AccessDenied`** even when the presigned URL is valid. That is **not** fixed by switching to Python or `requests` — the block is **environment policy**, not curl vs urllib. **Do not** run this playbook in a sandboxed agent or restricted shell. If the user’s client offers sandbox vs full network access, choose **non-sandbox** / allow network for publish. On **403 PUT** after following step 8 exactly, **hand over** the one-line **`curl`** for the user to run **on their local machine** (see step 8).

## Agent playbook (MCP tools)

**Tool names and parameters** match Freshworks **`openai-server`** ([`references/openai-server-mcp-tools.md`](references/openai-server-mcp-tools.md)). Hosted MCP: **`https://mcp.freshworks.dev/mcp`**.

### 1. Auth token preflight (MUST be step 1)

Before any MCP tool call, verify that the MCP publish tools are available and authenticated:
- Attempt to call **`list_custom_apps`** (optionally `{}` or `{ "page": 1, "perPage": 10 }` — follow **`tools/list`** / server schema). Treat this as an **auth / connectivity smoke test** only — **do not** use this call alone to pick **`appId`**. At **publish time** (step 6), you will ask **new vs existing** again and, for **existing**, call **`list_custom_apps`** for **developer selection** and **MCP handover**.
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

### 4. fdk validate (pre-publish)

Run `cd <app-directory> && fdk validate` and treat the result as the **validity gate** for upload:

- **Required for any upload/submit:** **zero platform errors** and **zero lint errors** (same bar as **fw-app-dev**). If either fails, **STOP** — use the **fw-app-dev** skill to fix; **do not** call **`create_app_upload_url`** or upload a zip.
- **`fdk pack --skip-coverage --skip-lint`** (step 5) only skips **pack-time** coverage/lint work — it **does not** waive this step. Never infer “app is valid” from pack alone.

**Marketplace backend:** An **invalid** zip may still be accepted: the API can create a **Draft** version without rejecting the package. **Do not** treat a successful **`submit_custom_app`** / **`add_app_version`** as proof the app is installable — enforce a **clean `fdk validate`** before step 7.

### 5. fdk pack

From the app directory (non-interactive; skips pack-time coverage/lint so automation does not block on coverage):

```bash
cd <app-directory> && printf 'Y\n' | fdk pack --skip-coverage --skip-lint
```

Produces `dist/*.zip`. Reuse an existing zip only if `--force-pack` is not needed (agent judgment).

**Invalid apps:** **Do not** pass invalid builds through the pipeline. If step 4 did not pass with zero platform and zero lint errors, **STOP** — do not run **`fdk pack`** for this publish flow and do not continue to steps 6–13. (`--skip-coverage` / `--skip-lint` on **pack** only avoids extra work inside **pack**; it is not a substitute for a clean **validate**.)

**Zip layout gate (required before step 7):** After **`fdk pack`**, pick the zip you will upload (`dist/*.zip` from this pack; if several exist, use the newest by modification time or the path **`fdk pack`** printed). Run:

```bash
unzip -l 'dist/<app>.zip'
```

Inspect the **Name** column (last column of each file row):

- **Pass — continue:** At least one archive member is named exactly **`manifest.json`** at the **root** of the zip (not only under a subfolder).
- **Fail — STOP; do not call `create_app_upload_url`:** **`manifest.json` is missing**, or only **`./manifest.json`** appears (leading `./` prefix), or the only manifest lives under a nested path (e.g. `some-folder/manifest.json`) without a root **`manifest.json`**. The Marketplace pipeline often matches **exact stored path names**; **`./manifest.json` is not treated the same** as **`manifest.json`** for those checks.

**If the gate fails — remediation:**

1. Run **`fdk pack`** again from **`<app-directory>`** (same as above).
2. If the listing still fails the gate: unpack to a clean directory and re-zip with **explicit** top-level members (avoid **`zip -r … .`**, which commonly records **`./`** prefixes). Example (adjust folder names to match the unpacked tree):

```bash
rm -rf /tmp/fw-repack && mkdir -p /tmp/fw-repack && unzip -q -o 'dist/<app>.zip' -d /tmp/fw-repack
cd /tmp/fw-repack && zip -r '<app-directory>/dist/<app>-resubmit.zip' manifest.json app config server README.md
```

List only paths that exist after unzip (omit **`server`**, **`README.md`**, etc. if absent). Add any other top-level files or directories the app needs. Re-run **`unzip -l`** until the gate passes, then upload **that** zip in step 8.

### 6. Publish-time routing: new listing vs existing app (MCP handover)

Do this **at publish time** — **after** you have a valid zip **that passes the zip layout gate** (steps 4–5) and **before** **`create_app_upload_url`** (step 7). This is the fork that decides which MCP tool receives the **`uploadId`** after upload.

**Do not** read **`appId`** from **`.fdk/app-info.json`** for routing or MCP calls.

1. **Ask explicitly:** Is this publish a **new** Marketplace listing, or an **update** to an **existing** app? (Skip only if the user already stated the same in this session.)

2. **New listing:** No **`appId`** yet. After steps 7–9, call **`submit_custom_app`** in step 10 with **`uploadId`** + manifest metadata. **MCP handover:** new-app payload + presigned **`uploadId`** only.

3. **Existing app (update):**
   
   a. **Call `list_custom_apps`** (paginate if needed). Show **`apps`** to the developer — at minimum **`id`**, **`name`**, **`type`**, **`products`**, **`latestVersion`** — and **require them to select** the target listing. Record that **`appId`**.
   
   b. **CRITICAL - Check for stuck versions:** Call **`list_app_versions`** with the selected **`appId`**. Returns array of versions with **`id`**, **`version`**, **`platformVersion`**, **`state`**, **`updatedAt`**.
      - **If ANY version has `state: "development"`**, **STOP immediately** and inform the user:
        ```
        Cannot publish new version - app has a version stuck in "development" state.
        
        Version details: [show the stuck version(s) - id, version, state]
        
        This usually means a previous deployment failed. You must:
        1. Log into the Developer Portal: https://developers.freshworks.com/developer/
        2. Navigate to your app
        3. Find the version in "development" state
        4. Delete or resolve that version
        5. Return here and retry the publish
        
        The MCP publish flow cannot proceed until all versions are out of "development" state.
        ```
      - **If all versions are in `test`, `published`, or other non-development states**, proceed to step 7.
   
   c. **MCP handover (after version check passes):** After steps 7–9, call **`add_app_version`** in step 10 with the **developer-selected `appId`**, **`uploadId`**, and manifest fields.

4. If they chose **update** but the list is **empty**, no listing exists — offer **new listing** or cancel.

Optional: if only **one** app exists and they already chose **update**, show that row and ask for a one-line confirm before using its **`appId`** — still **never** take **`appId`** from `.fdk/app-info.json`.

### 7. Create app-upload URL

Call `create_app_upload_url` — returns `uploadId` + `uploadUrl` + `expiresInSeconds`.

### 8. App-upload (PUT zip binary)

Use a **single plain `curl`** only — **do not** substitute **Python** (`urllib.request`, `requests`, …), **Node** (`fetch` / `node -e`), **`jq`**-assembled URLs, or other HTTP clients for this step unless you are **certain** traffic reaches **S3 directly** with the **exact** presigned URL bytes. Agents often pick Python anyway; in **managed / cloud** environments that path still hits **403** when egress or IAM blocks bucket `PUT`. **`curl` from the developer’s local terminal** is the supported, reproducible path.

Also **no** shell variables or **`node -e`** / **`jq`** to parse or splice the upload URL into the command — those patterns often **mangle** presigned URLs (`?`, `&`, `%`) and cause **`403`** on PUT.

From the app directory (where `fdk pack` wrote `dist/`):

0. Use the **same** `dist/*.zip` file that **passed the zip layout gate** (step 5), including **`…-resubmit.zip`** if you rebuilt it there.
1. Copy the **`uploadUrl`** value from step 7 **exactly** as returned by MCP (full string).
2. Run **one** command: paste that URL **inside single quotes** so the shell does not interpret query characters. Use a literal path for the zip. Prefer running this **`curl`** on the **user’s machine** (local Terminal / IDE terminal with **full network**, not a locked-down remote worker).
3. If **`curl` from the agent returns `403`** but the URL is pasted correctly: **stop retrying with Python or other clients**; give the user the **same** command block to run **locally**, then continue MCP steps (**`submit_custom_app`** / **`add_app_version`**) from the IDE after they confirm **HTTP 200**. Mint a **fresh** **`uploadId`** via **`create_app_upload_url`** if the presigned URL may have expired.

```bash
curl -X PUT -H "Content-Type: application/zip" --data-binary @dist/<app>.zip 'https://…full-presigned-upload-url…'
```

Optional — print only the HTTP status (useful when debugging):

```bash
curl -sS -o /dev/null -w "%{http_code}" -X PUT -H "Content-Type: application/zip" --data-binary @dist/<app>.zip 'https://…full-presigned-upload-url…'
```

If the presigned URL was generated with different **signed headers**, match the **`Content-Type`** (and any other signed headers) the API used when creating the URL; if you get **`403`**, try the header value from that step. A successful S3 PUT typically returns **200**.

**Auto-run / sandbox:** Restricted sandboxes often cause upload **`403`** or network failures — use **non-sandbox** / full network for this step (see **Sandbox** at top).

Do **not** base64-encode the zip. Do **not** paste the **app-upload** URL into chat or tickets.

### 9. Read manifest.json

Read `manifest.json` in the app directory. Extract:
- `platform-version` (e.g. `"3.0"`)
- `modules` keys (e.g. `["common", "support_ticket"]`)
- `name` (if present) for `appName`

### 10. Call the appropriate MCP tool (deploy / version handover)

Use the **publish-time choice from step 6**: **new** → **`submit_custom_app`**; **existing** → **`add_app_version`** with the **developer-selected `appId`**.

**New app** — **`submit_custom_app`**:

| Parameter | Source |
|-----------|--------|
| `appName` | manifest `name` or directory name |
| `appDescription` | ask user or default |
| `appOverview` | ask user or derive from description (max 150 chars) |
| `supportEmail` | **Ask the user** (required for new app). **Never** use `git config user.email` or other git metadata — it may be unset, personal, or wrong for marketplace support. |
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

Optionally, call **`list_app_versions`** with the **`appId`** to verify the new version reached **`test`** state and see the per-version breakdown. This is useful to confirm deployment success and detect if the new version is stuck in **`development`** (indicating deployment failure — user should check Developer Portal for failure details).

### 13. Report to user

Tell the user: **app id**, **version state**, and where to install custom apps in their product (**Admin -> Apps** or equivalent).

## MCP tools reference (fw-dev-mcp)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **`list_custom_apps`** | List all custom apps on developer account. Returns **`count`** and **`apps`** (each: **`id`**, **`name`**, **`type`**, **`subType`**, **`subscriptionType`**, **`state`**, **`products`**, **`latestVersion`**). Optional **`page`**, **`perPage`**. Results sorted by most recently updated first. | Step 1 (auth preflight), Step 6.3a (existing app selection) |
| **`list_app_versions`** | List all versions for one app. Returns array with **`id`**, **`version`**, **`platformVersion`**, **`state`**, **`updatedAt`** per version. | **Step 6.3b (CRITICAL - check for `development` state before `add_app_version`)**, Step 12 (optional verification) |
| **`create_app_upload_url`** | Generate presigned S3 upload URL. Returns **`uploadId`**, **`uploadUrl`**, **`httpMethod`** (`"PUT"`), **`expiresInSeconds`**. | Step 7 (before zip upload) |
| **`submit_custom_app`** | Create new custom app + first version. Requires **`appName`**, **`appDescription`**, **`appOverview`**, **`supportEmail`**, **`platformVersion`**, **`modules`**, **`uploadId`**. Optional: **`alternateEmail`**, **`zipFileName`**, **`worksWith`** (e.g., `["ai_actions"]`). App moves to **`test`** state after successful submit. | Step 10 (new app path) |
| **`add_app_version`** | Add new version to existing app. Requires **`appId`** (from **`list_custom_apps`** + user selection), **`platformVersion`**, **`modules`**, **`uploadId`**. Optional: **`zipFileName`**, **`worksWith`**. **CANNOT proceed if ANY version is in `development` state** (must be checked via **`list_app_versions`** first; user must delete stuck version via Developer Portal). | Step 10 (existing app path, after version state check passes) |
| **`get_app_status`** | Get aggregate app-level status. Returns **`id`**, **`name`**, **`type`**, **`subType`**, **`subscriptionType`**, **`state`** (reflects all versions), **`products`**. When deployment fails, **`state`** often rolls back to or includes **`development`**. | Step 12 (post-publish verification) |

**Other tools on `fw-dev-mcp` server:**
- **`get_developer_docs`**: Fetch developer documentation. **FALLBACK ONLY** - use only if **fw-app-dev** skill fails or when skill explicitly delegates.
- **DEPRECATED** (do NOT use): **`implement_app`**, **`get_implementation_plan`**, **`idea_to_app`**, **`fix_app_errors`**. Always use **fw-app-dev** skill for app development work.

## Error handling

- **401/403 from any MCP tool:** STOP immediately and show the auth setup instructions from step 1. The token may be expired, misconfigured, or missing. Do not retry — prompt the user to fix their token and re-run.
- **403 on PUT to `uploadUrl` (app-upload):** (1) **Presigned URL corruption** — shell mangled `?` / `&` / `%`, or **wrong `Content-Type`** vs what was signed. Fix: plain **`curl`**, URL in **single quotes** (step 8), **`Content-Type: application/zip`**, no variable splicing. (2) **Agent / cloud egress** — urllib, `requests`, or even `curl` from a **restricted worker** can get **S3 `AccessDenied`** because the request never reaches S3 with the presigned signature as intended (proxy, IAM, or network policy). Fix: **do not** switch to Python; have the **developer run step 8 `curl` locally**; refresh **`create_app_upload_url`** if needed. (3) **Sandbox** — allow full network or run upload outside sandbox.
- **Validation errors (400):** Suggest manifest fixes or use fw-app-dev skill. Common: products vs modules mismatch.
- **Upload failures:** Retry `create_app_upload_url` + re-upload.
- **fdk validate / fdk pack failures:** Use fw-app-dev skill to fix; check Node/FDK version alignment. **Do not** upload if validate did not pass (step 4) — draft listings can still be created from bad zips.
- **Manifest / package layout errors after upload or submit:** Re-run the **Zip layout gate** (end of step 5). If **`./manifest.json`** appears without root **`manifest.json`**, repack per step 5 remediation before **`create_app_upload_url`**.

## Preconditions

| Requirement | Notes |
|-------------|--------|
| Upload host | **`curl` PUT** must reach S3 for the presigned bucket; cloud agent egress may always **403** — use **local** terminal or unconstrained network (step 8). |
| Non-sandbox execution | MCP + **`curl`** upload need outbound HTTPS; sandboxed agents/shells typically break publish — use full network / disable sandbox for this flow. |
| `manifest.json` | App root; must be Platform 3.0 with `modules`. |
| Zip member names | After **`fdk pack`**, the upload zip must list **`manifest.json`** at archive root (not only **`./manifest.json`**). See **Zip layout gate** at end of step 5. |
| `fdk` on PATH | `fdk validate` + `fdk pack`. |
| MCP tools configured | Claude Code: from root **`.mcp.json`** when the marketplace plugin is installed (prompted at install via `userConfig`). Cursor: merge that file’s server block into `~/.cursor/mcp.json`. |
| Support email | Required for **create** (new app); ask the user — **never** derive from `git config`. Updates reuse publisher metadata from the existing marketplace app. |
| App identity for updates | At publish time (step 6): developer picks **`appId`** from **`list_custom_apps`** after choosing **update**. Do not use `.fdk/app-info.json` for routing. |

## Optional: list apps

For **updates**, **`list_custom_apps`** is part of **step 6** at **publish time** (developer selects **`appId`** before **`create_app_upload_url`**). You may also call it anytime to inspect apps on the account without publishing — that browse call is separate from the **publish-time** selection and **`appId`** handover to **`add_app_version`**.

## Links

- **[`references/openai-server-mcp-tools.md`](references/openai-server-mcp-tools.md)** — MCP tools implemented in **`mp-openai`** **`openai-server`**

- Developer Portal — copy API key: [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) (**API key for Freddy AI Copilot for VS Code plugin & AI Developer Tools.** → **Connect to Developer MCP server**)
- Marketplace API overview (public): [api.freshworks.com/marketplace/v2](https://api.freshworks.com/marketplace/v2)

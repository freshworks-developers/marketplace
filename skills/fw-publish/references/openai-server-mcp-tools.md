# MCP tools (openai-server / `fw-dev-mcp`)

Canonical tool **names and behavior** come from the Freshworks **`openai-server`** module in **`mp-openai`**. Implementations live under:

`openai-server/src/main/java/com/freshworks/marketplace/openai/server/mcp/`

Your MCP client connects to **`https://mcp.freshworks.dev/mcp`** (repository root **`.mcp.json`**). Call **`tools/list`** on your client if you need to confirm which tools the running server exposes.

---

## Publish flow — `AppPublishFeature.java`

| Tool | Purpose |
|------|---------|
| **`list_custom_apps`** | Returns **`count`** and **`apps`**. Each app includes **`id`**, **`name`**, **`type`**, **`subType`**, **`subscriptionType`**, **`state`**, **`products`**, and **`latestVersion`** (**`id`**, **`versionNumber`**, **`state`**). Optional **`page`** (1-based, default 1), **`perPage`** (default 10). |
| **`create_app_upload_url`** | Mint **`uploadId`** + presigned **`uploadUrl`**; **`PUT`** zip bytes to **`uploadUrl`** before submit/update. |
| **`submit_custom_app`** | Create a **new** Platform **3.x** custom app + first version after zip upload. Params include **`appName`**, **`appDescription`**, **`appOverview`**, **`supportEmail`**, optional **`alternateEmail`**, **`platformVersion`** (e.g. `"3.0"`), **`modules`** (list from **`manifest.json`** keys), **`uploadId`**, optional **`targetState`** (`test` / `review`), optional **`zipFileName`**, optional **`worksWith`** (e.g. **`ai_actions`**). |
| **`add_app_version`** | Add a **new version** to an **existing** app (**`appId`** from **`list_custom_apps`**). Same zip/upload prerequisite as submit. **Note:** In **`openai-server`** the **`@McpTool`** registration for **`add_app_version`** may be **disabled until phase 2** — confirm **`tools/list`** includes this tool before relying on it for updates. |
| **`get_app_status`** | **`appId`** (numeric) — app-level status after **`submit_custom_app`** / review flows. |

Older informal names (**`list_marketplace_apps`**, **`submit_marketplace_app`**, **`update_marketplace_app_version`**, **`get_marketplace_app_status`**) do **not** match **`openai-server`** — use the names in this table.

---

## App generation guides — `AppGenerationFeature.java`

| Tool | Purpose |
|------|---------|
| **`get_app_details`** | **`appIdea`** — structure collecting requirements from a raw idea. |
| **`get_implementation_plan`** | **`appDetails`** — plan from structured details. |
| **`implement_app`** | **`implementationPlan`** — implementation guidance from a plan. |

Optional MCP **prompt** **`idea_to_app`** orchestrates the three steps.

---

## See also

- **[`../SKILL.md`](../SKILL.md)** — publish playbook (`list_custom_apps`, **`submit_custom_app`**, **`add_app_version`** when exposed).
- **[`../../../AGENTS.md`](../../../AGENTS.md)** — MCP server wiring and JWT.

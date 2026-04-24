# Manifest metadata for MCP publish (subagent stub)

**Modules:** Read **`manifest.json` → `modules`** (object keys). Pass them to **`submit_marketplace_app`** / **`update_marketplace_app_version`** as the tool expects (see **[../SKILL.md](../SKILL.md)**).

**Naming and copy:** Derive **`appName`** from manifest **`name`** or the app directory name; **`appDescription`** / **`appOverview`** from the user or manifest where available. **`supportEmail`** is required for **new** app submission — ask the user if unknown.

**Existing app:** After a successful publish, **`.fdk/app-info.json`** should hold **`id`** (and version metadata) so the next run uses **`update_marketplace_app_version`**. If **`id`** is stale (e.g. app deleted on the portal), use **`list_marketplace_apps`** and reconcile with the user before updating.

If the server returns product or module mapping errors, use the **app-dev** skill to align **`manifest.json`** with Platform 3.0 expectations.

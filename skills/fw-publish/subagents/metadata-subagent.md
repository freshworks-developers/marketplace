# Manifest metadata for MCP publish (subagent stub)

**Modules:** Read **`manifest.json` → `modules`** (object keys). Pass them to **`submit_custom_app`** / **`add_app_version`** as **`openai-server`** expects (see **[../SKILL.md](../SKILL.md)**, **[../references/openai-server-mcp-tools.md](../references/openai-server-mcp-tools.md)**).

**JWT ↔ product (pre-publish):** Before pack/validate, run **[../SKILL.md](../SKILL.md)** step **2.5** — classify **`support_*`** (Freshdesk) vs **`service_*`** (Freshservice) module keys; confirm the user’s MCP JWT matches the product(s) or choose **one product at a time** for multiproduct (sequential full publish passes).

**Naming and copy:** Derive **`appName`** from manifest **`name`** or the app directory name; **`appDescription`** / **`appOverview`** from the user or manifest where available.

**`supportEmail` (new listings):** Required for **`submit_custom_app`**. **MANDATORY:** Prompt and confirm **`supportEmail`** with the user **before** **`create_app_upload_url`** (see **[../SKILL.md](../SKILL.md)** step **6.5**). Without it, **`submit_custom_app`** fails after upload — users often blame “app-upload”. **Do not** use **`git config user.email`** (may be missing or unsuitable for marketplace support).

**Existing app:** **`add_app_version`** uses **`appId`** from **`list_custom_apps`** + **developer selection** (see **[../SKILL.md](../SKILL.md)** step 6). **`.fdk/app-info.json`** is optional local metadata only — **do not** use it to choose **`appId`**. If the listing was deleted on the portal, **`list_custom_apps`** will not include it — reconcile with the user.

After a successful publish, you **may** write **`.fdk/app-info.json`** for convenience; the **next** update still uses **list + pick**.

If the server returns product or module mapping errors, use the **fw-app-dev** skill to align **`manifest.json`** with Platform 3.0 expectations.

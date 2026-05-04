# Skills: questions, coverage, changes

## 1. Questions agents must resolve

| ID | Question | Skills |
|----|----------|--------|
| **Q1** | **Which app folder?** — folder with **`manifest.json`** (one hit → use; several → ask). | fw-app-dev, fw-publish, fw-review, fw-ai-app-dev*, fw-ai-actions-app* |
| **Q2** | **New Marketplace listing or update existing listing?** — asked at **publish time** (after **`fdk pack`**, before upload URL). | fw-publish only |
| **Q3** | **Which `appId`?** — only if **Q2** = update listing. | fw-publish only |
| **T** | **Node + `fdk`** OK for this app before **`fdk validate`** / pack? | fw-setup, **fw-publish** Step 3, fw-app-dev prereqs |

\* **Q1** for **fw-ai** skills: implicit project root today — align with app-dev **Q1** in **`SKILL.md`**.

**Q2/Q3** are **portal** choices (not “enhance my app” in chat). **`manifest.json`** does **not** answer **Q2/Q3**.

---

## 2. What’s already there (one table)

| Skill | Q1 | Q2 | Q3 | T |
|-------|----|----|----|---|
| **fw-app-dev** | Slash commands search **`manifest.json`**, ask if multiple | — | — | Prereqs + **fw-setup** pointer |
| **fw-publish** | **Step 2** — same manifest search + ask as app-dev | **Step 6** (publish time, after pack, before upload URL) — ask new vs existing; **`list_custom_apps`** + developer selects **`appId`**; **MCP handover** = **`uploadId`** + selected **`appId`** for **`add_app_version`** (**not** `.fdk/app-info.json`) | same | **Step 3** before pack |
| **fw-review** | Reads **one** `manifest` from context; **no** ask if many | — | — | **fdk** preflight where needed |
| **fw-ai-app-dev** / **fw-ai-actions-app** | Implicit root | — | — | **fdk validate** path |
| **fw-setup** | **cd** app for **/fw-setup-use** / **.nvmrc** | — | — | **Core** |

---

## 3. Changes needed

**Q1 — use the same folder logic as fw-app-dev** *(search **`manifest.json`**, **one** hit → use it, **several** → **ask**)* **for:**

- **fw-review** — **`SKILL.md`**: same logic as **fw-app-dev** when multiple manifests exist *(today: no multi-root ask)*.
- **fw-ai-app-dev** — **`SKILL.md`**: same logic as **fw-app-dev** *(today: implicit root only)*.
- **fw-ai-actions-app** — **`SKILL.md`**: same logic as **fw-app-dev**.
- **fw-publish** — **`SKILL.md`** Step **2** (app folder): same logic as **fw-app-dev**; keep in sync if **fw-app-dev** commands change.

**Publish-only** *(not covered by fw-app-dev Q1)*

- **`fw-publish`** — explicit **Q2**/**Q3** at **publish time** (after valid zip, before **`create_app_upload_url`**); for **updates**, **`list_custom_apps`** + developer selects **`appId`**, then **`add_app_version`** with **`uploadId`** (**do not** route updates from `.fdk/app-info.json`). Step **1** **`list_custom_apps`** is auth-only, not app selection.
- **MCP** — **`add_app_version`** may be phase 2 on some **`openai-server`** builds (**`submit_custom_app`** works today). See **`skills/fw-publish/references/openai-server-mcp-tools.md`**.

---

## See also

- **`publish-flow-combined.md`** — full notes, gaps, **SKILL.md** / zip / auth.

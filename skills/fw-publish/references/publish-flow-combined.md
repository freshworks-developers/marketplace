# Skills: questions before proceeding, coverage, gaps

This reference lists **what must be known** before a skill can run safely, whether **today’s skills** already answer it (and how), and **gaps + fixes** we’re aligning on.

---

## 1. Questions — app scope & publish (Q1–Q3)

| ID | Question | Applies to |
|----|------------|------------|
| **Q1** | **Which app folder?** — directory that contains **`manifest.json`** (same idea as **fw-app-dev** `<app-directory>` / app root). | **fw-app-dev**, **fw-review**, **fw-publish**, **fw-ai-app-dev**, **fw-ai-actions-app** |
| **Q2** | **New Marketplace listing or update existing listing?** *(portal — not the same as “enhance the code” in chat)* | **fw-publish** only |
| **Q3** | **Which listing (`appId`)?** — only when publishing an **update** to an existing listing. | **fw-publish** only |

**Q1 resolution (shared):** search the workspace for **`manifest.json`** — **one** path → use that folder; **multiple** → **ask** the developer which app folder. **fw-app-dev** slash commands (`/fdk-fix`, etc.) already do this; **fw-publish** **Step 2** uses the **same** rule so publish picks the same tree as dev before **`fdk validate`** / **`fdk pack`**. **Q2/Q3** are **not** inferred from **`manifest.json`** alone — for **updates**, use **`list_custom_apps`** and **developer selection** of **`appId`** (do **not** rely on **`.fdk/app-info.json`** for routing).

---

## 2. Toolchain (Node + FDK) — separate check

Not part of **Q1–Q3**. Before **`fdk validate`** / **`fdk pack`**, the shell must run **Node** and **`fdk`** versions compatible with the app — **fw-publish** checks this in **Step 3** (read **`manifest.json`** and compare to **`node --version`** / **`fdk version`**). **fw-setup** installs or switches versions; **fw-app-dev** prerequisites point there when the CLI is wrong.

| Concern | Where handled |
|---------|----------------|
| Match Node + FDK to what the app needs | **fw-publish** Step 3 · **fw-setup** · **fw-app-dev** prerequisites |

---

## 3. Per skill — Q1–Q3 answered? How?

| Skill | Q1 folder | Q2 new vs update | Q3 appId |
|-------|-----------|------------------|----------|
| **fw-app-dev** | **Yes** — slash commands: search **`manifest.json`**, **ask if multiple** (`/fdk-fix`, `/fdk-review`, `/fdk-refactor`, `/fdk-migrate`). Greenfield: **new subfolder** under parent — no ambiguity. | N/A | N/A |
| **fw-review** | **Partial** — reads **`manifest.json`** first; **no** multi-root disambiguation; pipeline says **do not ask** | N/A | N/A |
| **fw-publish** | **Yes** — **Step 2** = same **manifest path** pattern as **fw-app-dev** (search → ask if multiple → lock **app folder**). | **Yes** — **Step 6** — ask **new vs update**; **`list_custom_apps`** + developer picks **`appId`** | **Yes** — **Step 6** — **`list`** + select (**not** **`app-info`**) |
| **fw-ai-app-dev** / **fw-ai-actions-app** | **Implicit** — project “app root”; **no** multi-manifest procedure in **SKILL.md** | N/A | N/A |
| **fw-setup** | **Rarely** — **`/fw-setup-use`** / **`.nvmrc`** when you **`cd`** into the app | N/A | N/A |

**Toolchain:** **fw-setup** = primary; **fw-publish** Step 3 = gate before pack; **fw-app-dev** = prerequisite routing.

---

## 4. Gaps and how we fix them

| Gap | Fix |
|-----|-----|
| **Q1** not same everywhere | Use **fw-app-dev** rule (search **`manifest.json`**, ask if multiple) in **`fw-review`**, **`fw-ai-app-dev`**, **`fw-ai-actions-app`** **`SKILL.md`** — see **`skills-preflight.md`** §3. **fw-publish** Step **2** already aligned. |
| **Q2 / Q3** not always explicit at publish time | Clear **new listing vs update listing**; use **`list_custom_apps`** + developer pick for **Q3** (updates); optional **pre-publish confirmation**. Do **not** rely on **`.fdk/app-info.json`** for **`appId`**. |
| **App folder path not in `app-info`** | **By design** — **`app-info`** holds Marketplace **`id`**, not path. **Q1** each run. |
| **Update MCP** not live | **`add_app_version`** Phase 2 — **submit** works today. |

---

## 5. Short pointer (publish + review)

1. **Q1** — **fw-publish Step 2** = **same manifest paths** as **fw-app-dev**: one **`manifest.json`** → use it; **many** → **ask**.
2. **fw-publish** adds **Q2** + **Q3** (portal listing only); **updates** use **`list_custom_apps`** + developer **`appId`** selection — **not** `.fdk/app-info.json`.
3. Optional one-line **confirm** before upload.
4. **Toolchain** — **fw-publish** Step 3 / **fw-setup** (not mixed with Q1–Q3).

**Short one-pager (questions + coverage + changes only):** **`skills-preflight.md`**.

---

## Auth & zip

JWT: **`.mcp.json`**, **`fw-publish/SKILL.md`**. Zip / server: **`manual-test-matrix-mcp.md`**.

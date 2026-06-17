---
name: fdk-migrate
description: Migrate a legacy Freshworks app from platform-version 2.3 (2.x), FDK 9.x, and Node 18 to Platform 3.0 with FDK 10.0.1 and Node 24.11.0. Transforms manifest, request templates, Crayons UI, and validates on the new toolchain. Does not install fdk/Node—use fw-setup (or prompt user to add it) per SKILL.md.
globs: ["**/manifest.json"]
always: false
---

# FDK Migrate: Platform 2.x → 3.0

**Usage:** `/fdk-migrate`

**Orchestration (matches fw-app-dev SKILL):** (1) If **FDK 10 + Node 24** is **not** installed → **`fw-setup`** first, **then** this migrate flow, **then** **`fdk validate`**. (2) If **FDK 10 + Node 24** **is** installed and the app is legacy → this migrate flow **then** **`fdk validate`**. (3) If the app is already **3.0** with **24.x / 10.x** engines → you do **not** need this command for migration; use **`/fdk-fix`** only (for structured pre-submission review, use **fw-review** skill). **Never** “fix” migration by installing **FDK 9** or switching to **Node 18** — that is the opposite of this command.

You are migrating a **legacy** Freshworks app to **Platform 3.0**. Typical source state:

- **`platform-version`**: `"2.3"` (or `"2.2"` / `"2.1"` / missing)
- **`manifest.json` → `engines`**: often **`fdk`** `9.x` and **`node`** `18.x`**
- **Patterns**: `product` block, `whitelisted-domains`, `$request.post` / `.get`, plain HTML controls

**Target:** **`platform-version` `"3.0"`**, **`modules`** layout, request templates, Crayons, and **`engines`** **`"node": "24.11.0"`**, **`"fdk": "10.0.1"`** (fw-app-dev default).

## Step 0: Verify environment (upgrade off 9.x / Node 18 first)

**CRITICAL:** Do **not** use **FDK 9.x on Node 18** to validate a finished **Platform 3.0** app. Upgrade the **machine** (shell) to **Node 24.x** + **FDK 10.x** before you rely on `fdk validate` for the migrated tree. Platform 3.0 migration aligns with **fw-app-dev**: **FDK 10.0.1** and **Node.js 24.x** (templates use Node **24.11.0**, FDK **10.0.1**).

**Toolchain** (same split as `/fdk-fix`, `/fdk-refactor`, and always-on **`rules/validation-workflow.mdc`**):

- **fw-app-dev** does not install **`fdk`**, **Node**, **nvm**, or **PATH**.
- Use **`fw-setup`** when present: `/fw-setup-install`, `/fw-setup-upgrade`, `/fw-setup-use`, `/fw-setup-status`.
- If **fw-setup** is missing: prompt the user to add it (`npx @freshworks/fw-dev-tools install`), then continue Step 0.
- Do not invent one-off global `npm install` scripts here. Canonical wording: **SKILL.md** → *FDK / Node.js toolchain — not provided by fw-app-dev*.

1. Check Node.js version:
   ```bash
   node --version
   ```
   - **REQUIRED for migration validation:** Node.js **24.x** (e.g. v24.11.x; major **24** required for the FDK 10 line)
   - **IF NOT Node 24.x:** Stop and inform the user:
     ```
     ERROR: Platform 3.0 migration requires Node.js 24.x (with FDK 10.x).
     Current version: [detected version]

     To fix:
     nvm install 24.11
     nvm use 24.11
     ```
     Point them to **fw-setup** for a full install path (**SKILL.md** → *FDK / Node.js toolchain — not provided by fw-app-dev*). Do not substitute ad hoc `npm install -g` recipes for Freshworks FDK tarballs.

2. Check FDK version:
   ```bash
   fdk version
   ```
   - **REQUIRED:** FDK **10.0.1** or newer **10.x** on Node 24.x (fw-app-dev pins **`10.0.1`** in `engines` after migration)
   - **IF NOT FDK 10.x:** Stop and inform the user:
     ```
     ERROR: Platform 3.0 migration expects FDK 10.x on Node 24.x for validation and publishing.
     Current version: [detected version]

     To fix:
     1. Install the fw-setup skill:
        npx @freshworks/fw-dev-tools install

     2. Use /fw-setup-install or /fw-setup-upgrade (or legacy /fdk-install, /fdk-upgrade) to install FDK 10.x on Node 24.x
     ```

3. **ONLY proceed to Step 1 if BOTH conditions are met:**
   - Node.js 24.x is active
   - FDK 10.x is installed

*(Legacy **manifest** `engines` may still show 9.x / 18 until Step 3 — that is expected until you update them.)*

## Step 1: Locate manifest.json files

1. Search the workspace for all `manifest.json` files.
2. For each manifest found, read it and extract the `platform-version` field (if present).
3. If **multiple folders** contain manifest.json:
   - List each folder path and its platform-version.
   - **Ask the user** to choose which folder/app to migrate.
   - Do NOT proceed until the user selects one.
4. If **one folder** contains manifest.json: proceed with that app.
5. If **no manifest.json** found: inform the user and stop.

## Step 2: Assess migration need

Once the target folder is determined:

- If `platform-version` is `"3.0"`: Inform the user the app is already on Platform 3.0. Offer to align **`engines`** or fix validation only if they ask.
- If `platform-version` is `"2.3"`, `"2.2"`, `"2.1"`, or missing: Proceed with migration.

## Step 3: Migrate to Platform 3.0

Use the Freshworks App Development Skill and references. Apply these transformations:

1. **Manifest structure**: Replace `product` with `modules` structure.
2. **Remove**: `whitelisted-domains` (use request templates instead).
3. **Request API**: Replace `$request.post()`, `.get()`, `.put()`, `.delete()` with `$request.invokeTemplate()`.
4. **OAuth**: Ensure `integrations` wrapper and `oauth_iparams` in oauth_config.json.
5. **UI**: Replace plain HTML (`<button>`, `<input>`, etc.) with Crayons components.
6. **Engines**: Set `manifest.json` → `engines` to **`"node": "24.11.0"`, `"fdk": "10.0.1"`** (fw-app-dev default). If validation is still blocked after **six** `fdk validate` fix iterations or the CLI cannot run on **10.0.1** + **24.11.0**, **LAST RESORT** once: **`18.20.8` / `9.8.2`** per **SKILL.md** (mandatory deprecation warning); publishing still needs **10.0.1** + Node **24.x**.

## Step 4: Validate

**Toolchain:** Before `fdk validate`, re-check **Step 0** if the shell may have changed. **fw-app-dev** does not install the CLI — use **fw-setup** or prompt the user to add it (**SKILL.md** → *FDK / Node.js toolchain — not provided by fw-app-dev*). Same rule as **`rules/validation-workflow.mdc`** (always-on when fw-app-dev is loaded).

If FDK shows **`App engines major version mismatch`** and offers to sync **`engines`**: with **Node 24.x + FDK 10.x** active, **accept** (**Y**) or set **`manifest.json` → `engines`** to match **`node --version`** / **`fdk version`** — **never** downgrade the shell to **9.x / 18**.

Run `fdk validate` in the app directory. Fix any fatal errors (and lint per fw-app-dev zero-tolerance). Present the migrated app when validation passes.

## Step 5: MANDATORY — Write .meta.json (DO NOT SKIP, DO NOT present migrated app before this is done)

**You MUST complete this step before telling the user migration is complete. Do not present the migrated app until these scripts succeed.**

**Scripts only — DO NOT hand-write JSON.** Never use Write, Edit, StrReplace, or shell redirects to create or modify `<app-directory>/.meta.json`. Use only `meta-init.sh` and `meta-update.sh` from `~/.fw-dev-tools/scripts/`. Set `skill_version` to the **bare semver** from the `version:` key in **fw-app-dev** `SKILL.md` frontmatter (e.g. `version: "1.1.5"` → `skill_version=1.1.5`; no quotes).

```bash
bash ~/.fw-dev-tools/scripts/meta-init.sh <app-directory> <ide-client>
bash ~/.fw-dev-tools/scripts/meta-update.sh <app-directory> fw-app-dev \
  invoked=1 skill_version=<version> migrate_iterations=<n> validate_iterations=<n>
```

For each distinct validation error category, also run:
```bash
bash ~/.fw-dev-tools/scripts/meta-update.sh <app-directory> fw-app-dev \
  validation_error_categories+=<category>
```

**Never mention `.meta.json` to the developer**

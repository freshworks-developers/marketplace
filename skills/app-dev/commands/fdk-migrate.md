---
name: fdk-migrate
description: Migrate a Freshworks app from Platform 2.x to Platform 3.0. Transforms manifest structure, replaces legacy APIs, updates UI components to Crayons, and validates the migrated app.
globs: ["**/manifest.json"]
always: false
---

# FDK Migrate Command

**Usage:** `/fdk-migrate`

You are helping migrate a Freshworks app from Platform 2.x to Platform 3.0. Follow these steps exactly.

## Step 0: Verify Environment Prerequisites

**CRITICAL:** Platform 3.0 migration and validation align with **app-dev**: **FDK 10.x** and **Node.js 24.x** (templates use Node **24.11.0**, FDK **10.0.0**).

1. Check Node.js version:
   ```bash
   node --version
   ```
   - **REQUIRED:** Node.js **24.x** (e.g. v24.11.x; major **24** required for the FDK 10 line)
   - **IF NOT Node 24.x:** Stop and inform user:
     ```
     ERROR: Platform 3.0 work in this skill requires Node.js 24.x (with FDK 10.x).
     Current version: [detected version]
     
     To fix:
     nvm install 24.11
     nvm use 24.11
     ```
     Point them to the **fdk-setup** skill for a full install path.

2. Check FDK version:
   ```bash
   fdk version
   ```
   - **REQUIRED:** FDK **10.x** (e.g. 10.0.0 - 10.x.x)
   - **IF NOT FDK 10.x:** Stop and inform user:
     ```
     ERROR: Platform 3.0 migration expects FDK 10.x on Node 24.x for validation and publishing.
     Current version: [detected version]
     
     To fix:
     1. Install the fdk-setup skill:
        npx skills add https://github.com/freshworks-developers/marketplace --skill fdk-setup
     
     2. Use /fdk-install or /fdk-upgrade to install FDK 10.x on Node 24.x
     ```

3. **ONLY proceed to Step 1 if BOTH conditions are met:**
   - Node.js 24.x is active
   - FDK 10.x is installed

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

- If `platform-version` is `"3.0"`: Inform the user the app is already on Platform 3.0. No migration needed.
- If `platform-version` is `"2.3"`, `"2.2"`, `"2.1"`, or missing: Proceed with migration.

## Step 3: Migrate to Platform 3.0

Use the Freshworks App Development Skill and references. Apply these transformations:

1. **Manifest structure**: Replace `product` with `modules` structure.
2. **Remove**: `whitelisted-domains` (use request templates instead).
3. **Request API**: Replace `$request.post()`, `.get()`, `.put()`, `.delete()` with `$request.invokeTemplate()`.
4. **OAuth**: Ensure `integrations` wrapper and `oauth_iparams` in oauth_config.json.
5. **UI**: Replace plain HTML (`<button>`, `<input>`, etc.) with Crayons components.
6. **Engines**: Set `manifest.json` → `engines` to **`"node": "24.11.0"`, `"fdk": "10.0.0"`** (app-dev default). Use deprecated **18.20.8** / **9.8.2** only if **SKILL.md** toolchain-mismatch fallback applies after `fdk validate` cannot run.

## Step 4: Validate

Run `fdk validate` in the app directory. Fix any fatal errors. Present the migrated app when validation passes.

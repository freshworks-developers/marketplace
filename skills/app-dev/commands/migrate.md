# Platform Migration Command

You are helping migrate a Freshworks app from Platform 2.x to Platform 3.0. Follow these steps exactly.

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
6. **Engines**: Ensure `engines` block with `node` and `fdk` versions.

## Step 4: Validate

Run `fdk validate` in the app directory. Fix any fatal errors. Present the migrated app when validation passes.

# Deterministic script checks

For every **Fail**, cite file path and line (or block) from the script output and give a concrete fix.

## SC-01A — External imports must use trusted sources

**Goal:**
- External script and style imports must come only from trusted sources.

**Inspect**

- Run `scripts/external-import-sources.js`.

**Pass**

- All detected external imports resolve to trusted sources.

**Fail**

- Any external import resolves to an untrusted or invalid source.

**Not applicable**

- No external script or style imports are present.

**Fix message**

- Replace the untrusted external import with an approved source or bundle the asset locally.

## SC-02A — External imports must use HTTPS

**Goal:**
- External script and style imports must use `https://`, not `http://`.

**Inspect**

- Run `scripts/https-imports.js`.

**Pass**

- All detected external imports use HTTPS.

**Fail**

- Any external import still uses HTTP.

**Not applicable**

- No external imports are present.

**Fix message**

- Change insecure import URLs from `http://` to `https://`.

## SC-03A — Icon and image assets must meet baseline resolution expectations

**Goal:**
- App icon and image assets should meet the expected baseline resolution checks.

**Inspect**

- Run `scripts/image-resolution.js`.

**Pass**

- Icon and image assets satisfy the script's baseline checks.

**Fail**

- Icon or logo assets are too small, or `app/styles/images/icon.svg` is not declared as `64x64`.

**Not applicable**

- No matching icon or logo assets are present.

**Fix message**

- Provide production-ready icon assets and ensure `app/styles/images/icon.svg` is declared as `64x64`.

## SC-04A — Settings update references must have a matching handler

**Goal:**
- If the app references settings updates, it must implement the matching handler.

**Inspect**

- Run `scripts/settings-update-handler.js`.

**Pass**

- Settings update handling is either implemented or not required.

**Fail**

- The manifest references settings updates but no matching handler implementation is found.

**Not applicable**

- The app does not reference settings updates.

**Fix message**

- Add the missing settings update handler implementation or remove the unused settings update reference.

## SC-05A — OAuth config values must stay in configuration files

**Goal:**
- OAuth client IDs, secrets, and tokens must appear only in intended configuration files.

**Inspect**

- Run `scripts/oauth-config-usage.js`.

**Pass**

- OAuth client values appear only in approved configuration files.

**Fail**

- OAuth client values appear in non-config source files.

**Not applicable**

- No OAuth client values are present.

**Fix message**

- Move OAuth client IDs, secrets, and tokens into secure config files such as `oauth_config.json`, secure iparams, or `.env`.

## SC-06A — Mutable browser globals must be avoided

**Goal:**
- Client code should avoid mutable globals on `window` or `globalThis`.

**Inspect**

- Run `scripts/global-variables.js`.

**Pass**

- No mutable browser globals are detected.

**Fail**

- Client code assigns mutable values to `window.*` or `globalThis.*`.

**Not applicable**

- No client-side JS/TS files are present.

**Fix message**

- Replace mutable browser globals with module scope, closures, or explicit state containers.

## SC-07A — Imported third-party libraries must be used

**Goal:**
- Imported third-party libraries should be used in the file that imports them.

**Inspect**

- Run `scripts/unused-library-imports.js`.

**Pass**

- Imported third-party libraries appear to be used.

**Fail**

- A third-party library is imported but does not appear to be used.

**Not applicable**

- No third-party imports are present.

**Fix message**

- Remove unused third-party imports or use the imported dependency where intended.

## SC-08A — Manifest must pass baseline FDK structure checks

**Goal:**
- `manifest.json` should satisfy baseline FDK structure expectations.

**Inspect**

- Run `scripts/fdk-errors-warnings.js`.

**Pass**

- The manifest passes the baseline FDK structure checks.

**Fail**

- The manifest is missing required baseline structure or contains deprecated structure.

**Not applicable**

- `manifest.json` is missing or unreadable.

**Fix message**

- Fix manifest structure issues such as missing `platform-version`, `modules`, or `engines`, and remove deprecated fields where required.

## SC-09A — Sensitive values must not be logged

**Goal:**
- Sensitive values should never be logged to the console or logger output.

**Inspect**

- Run `scripts/sensitive-console-logs.js`.

**Pass**

- No sensitive logging patterns are detected.

**Fail**

- Sensitive values such as passwords, secrets, tokens, API keys, or PII are logged.

**Not applicable**

- No console or logger statements are present.

**Fix message**

- Remove sensitive values from logs and use safe redaction or high-level status messages instead.

## SC-10A — Only Freshworks CSS should be referenced

**Goal:**
- Product-specific CSS bundles should not be referenced; only Freshworks CSS should be used.

**Inspect**

- Run `scripts/freshworks-css-only.js`.

**Pass**

- Only allowed Freshworks CSS references are detected.

**Fail**

- Product-specific CSS bundles such as `freshdesk.css` or `freshservice.css` are referenced.

**Not applicable**

- No CSS imports or stylesheet links are present.

**Fix message**

- Remove product-specific CSS references and use the correct Freshworks CSS bundle instead.

## SC-11A — App must target the expected platform version

**Goal:**
- The app must declare and target the expected marketplace platform version.

**Inspect**

- Run `scripts/platform-version-upgrade.js`.

**Pass**

- The app already targets the expected platform version.

**Fail**

- The app is missing a platform version or is below the expected version.

**Not applicable**

- `manifest.json` is missing or unreadable.

**Fix message**

- Add `platform-version` to `manifest.json` or upgrade it to the expected version.

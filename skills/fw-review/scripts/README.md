# App Review Scripts

These scripts are deterministic checks used by the **fw-review** skill. Each script takes an app root path and prints JSON:

```bash
node scripts/<script-name>.js /path/to/app
```

## Script summary

- `external-import-sources.js`
  - Scans matching text files across the app root such as HTML, CSS, JS, TS, and JSON for external `src`, `href`, `url()`, and `@import` URLs.
  - Fails when an external import uses a source outside the trusted allowlist.

- `https-imports.js`
  - Scans matching text files across the app root such as HTML, CSS, JS, TS, and JSON for external imports that still use `http://`.
  - Fails when an import is not using HTTPS.

- `image-resolution.js`
  - Scans image assets for icon/logo files and checks `app/styles/images/icon.svg`.
  - Fails when icon assets look too small or `icon.svg` is not declared as `64x64`.

- `settings-update-handler.js`
  - Reads `manifest.json` and scans matching app source files across the app root for a matching settings-update handler implementation.
  - Fails when the app references settings updates but does not implement the handler.

- `oauth-config-usage.js`
  - Scans matching text files across the app root for OAuth client IDs, secrets, or tokens outside approved config files.
  - Fails when OAuth credentials appear in normal source code.

- `global-variables.js`
  - Scans JS/TS source files across the app root for mutable globals assigned on `window` or `globalThis`.
  - Fails when browser globals are used as mutable state.

- `unused-library-imports.js`
  - Scans JS/TS source files across the app root for third-party imports that do not appear to be used in the same file.
  - Fails when a library is imported but unused.

- `fdk-errors-warnings.js`
  - Reads only `manifest.json`.
  - Fails when baseline FDK structure issues are found, such as missing `platform-version`, `modules`, or `engines`.

- `sensitive-console-logs.js`
  - Scans HTML and JS/TS files across the app root for console or logger calls that mention sensitive values.
  - Fails when logs appear to contain secrets, tokens, API keys, or similar sensitive data.

- `freshworks-css-only.js`
  - Scans HTML and CSS files across the app root for linked or imported product-specific CSS bundles.
  - Fails when blocked CSS bundles like `freshdesk.css` are referenced.

- `platform-version-upgrade.js`
  - Reads only `manifest.json`.
  - Fails when the app is missing a platform version or is below the expected platform version.

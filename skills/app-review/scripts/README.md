# App Review Scripts

These scripts are deterministic checks used by the `app-review` skill. Each script accepts an app root and prints JSON:

```bash
node scripts/<script-name>.js /path/to/app
```

## Output contract

Each script returns a JSON object with this shape:

```json
{
  "internal": {
    "rule_id": "FFS-02L",
    "visibility": "internal"
  },
  "passed": true,
  "summary": "Human-readable summary",
  "details": []
}
```

Important:

- `internal.rule_id` is internal metadata only.
- The user-facing review output must not show `internal.rule_id`.
- `passed`, `summary`, and `details` are the fields intended for downstream evaluation and report generation.

## Shared behavior

Most scripts share the same recursive scan approach:

- Start from the provided app root.
- Recursively walk subdirectories with `fs.readdir(..., { withFileTypes: true })`.
- Skip these directories:
  - `.cache`
  - `.cursor`
  - `.fdk`
  - `.git`
  - `.next`
  - `build`
  - `coverage`
  - `dist`
  - `node_modules`
- Normalize output paths with forward slashes.
- Read files as UTF-8 text unless the script only needs file stats.

Shared helper in `common.js`:

- `createRuleResult(ruleId, passed, summary, details)` wraps the script result and stores the rule ID under `internal.rule_id`.
- `runCli(run)` resolves the target directory from `process.argv[2] || process.cwd()`, runs the checker, prints formatted JSON, and sets the process exit code to `0` for pass and `1` for fail.

## Script details

### `external-import-sources.js`

- Internal rule ID: `FFS-02L`
- File types scanned:
  - `.css`, `.html`, `.js`, `.json`, `.jsx`, `.ts`, `.tsx`
- Purpose:
  - Detect externally hosted imports and fail when the hostname is not in the allowlist.
  - For npm-backed CDN or registry URLs, also fail when the package name does not match declared app dependencies.
  - Treat host allowlisting as an infrastructure check only, not a package safety guarantee.
- Patterns used:
  - HTML attributes:
    - `/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/gi`
  - CSS imports and URLs:
    - `/(?:url|@import)\s*\(\s*["']?(https?:\/\/[^"')]+)["']?\s*\)/gi`
- Validation flow:
  1. Scan each eligible text file.
  2. Extract matching `http://` or `https://` URLs from `src`, `href`, `url(...)`, and `@import`.
  3. De-duplicate URLs per file with a `Set`.
  4. Parse the hostname using `new URL(urlValue)`.
  5. If URL parsing fails, fall back to:
     - `/^https?:\/\/([^/:?#]+)/i`
  6. Compare the hostname against the external-host allowlist.
  7. A source is accepted when:
     - `hostname === allowlistedDomain`, or
     - `hostname.endsWith('.' + allowlistedDomain)`
  8. Read dependency declarations from:
     - `manifest.json -> dependencies`
     - `package.json -> dependencies`
     - `package.json -> devDependencies`
     - `package.json -> peerDependencies`
     - `package.json -> optionalDependencies`
  9. If the allowlisted host is npm-backed, extract the package name from the URL.
  10. When a package name is extracted and there is at least one declared dependency, fail if the package is not declared.
- Current allowlisted external hosts:
  - `ajax.googleapis.com`
  - `cdn.freshdev.io`
  - `cdn.jsdelivr.net`
  - `cdnjs.cloudflare.com`
  - `code.jquery.com`
  - `esm.sh`
  - `fonts.googleapis.com`
  - `fonts.gstatic.com`
  - `ga.jspm.io`
  - `maxcdn.bootstrapcdn.com`
  - `npm.jspm.io`
  - `registry.npmjs.org`
  - `stackpath.bootstrapcdn.com`
  - `static.freshdev.io`
  - `unpkg.com`
- NPM-backed hosts with package-name validation:
  - `cdn.jsdelivr.net`
  - `esm.sh`
  - `ga.jspm.io`
  - `npm.jspm.io`
  - `registry.npmjs.org`
  - `unpkg.com`
- Package extraction behavior:
  - `https://cdn.jsdelivr.net/npm/react@18/...` -> `react`
  - `https://unpkg.com/lodash@4/...` -> `lodash`
  - `https://esm.sh/@scope/pkg@1.2.3` -> `@scope/pkg`
  - `https://ga.jspm.io/npm:react@18/index.js` -> `react`
  - `https://registry.npmjs.org/@scope%2fpkg/-/pkg-1.0.0.tgz` -> `@scope/pkg`
- Fail behavior:
  - Adds a detail when the external source hostname is not allowlisted.
  - Adds a detail when the URL is malformed and no hostname can be extracted.
  - Adds a detail when an npm-backed external import points to a package that is not declared in app dependencies.
- Security nuance:
  - Allowlisting these hosts does **not** mean packages served from them are inherently safe.
  - Package safety still depends on package-level controls (approved package allowlists, pinned versions, integrity verification, and review process).

### `https-imports.js`

- Internal rule ID: `FFS-04L`
- File types scanned:
  - `.css`, `.html`, `.js`, `.json`, `.jsx`, `.ts`, `.tsx`
- Purpose:
  - Detect any external import that still uses `http://`.
- Patterns used:
  - HTML attributes:
    - `/(?:src|href)\s*=\s*["']http:\/\/[^"']+/gi`
  - CSS:
    - `/(?:url|@import)\s*\(\s*["']?http:\/\/[^"')]+/gi`
- Validation flow:
  1. Walk all eligible files.
  2. Run both regexes against file content.
  3. For every match, compute the line number from the byte offset.
  4. Capture the full trimmed line as the excerpt.
  5. Emit a failure detail for each insecure match.
- How it decides pass/fail:
  - Pass when zero `http://` import patterns are found.
  - Fail when one or more matches are found.

### `image-resolution.js`

- Internal rule ID: `FFS-05L`
- Image file types discovered:
  - `.gif`, `.ico`, `.jpeg`, `.jpg`, `.png`, `.svg`, `.webp`
- Accepted upload file types:
  - `.jpeg`, `.jpg`, `.png`
- Purpose:
  - Mirror DevPortal frontend image-upload validation for marketplace assets.
  - Enforce accepted image type, upload size, dimensions, aspect ratio, count limits, and S3-safe filenames.
- Validation flow:
  1. Recursively collect image assets from the app root.
  2. Skip ignored folders such as `node_modules`, `dist`, `.git`, and `.fdk`.
  3. Fail image uploads whose extension is not `.jpeg`, `.jpg`, or `.png`.
  4. Fail any image larger than `2 MB` (`2097152` bytes).
  5. Fail filenames that do not match the S3-safe filename regex:
     - `/^[A-Za-z0-9!_.\-*'()]+$/`
  6. Classify files by path/name:
     - cover art: path/name contains `cover_arts`, `cover-art`, or `cover_art`
     - screenshot: path/name contains `screenshot` or `screenshots`
     - module screenshot: screenshot path/name also contains `module`
  7. Read `.png`, `.jpg`, and `.jpeg` dimensions directly from the image file bytes.
  8. Apply cover art validation:
     - minimum `400x400`
     - must be square (`1:1` aspect ratio)
     - max count `1`
  9. Apply screenshot validation:
     - minimum `850x850`
     - max count `5`
  10. Apply module screenshot validation:
     - same minimum `850x850`
     - max `2` screenshots per module
- DevPortal copy vs validation:
  - App icon UI copy recommends/displays `500x500`.
  - The validation logic accepts any square image at least `400x400`.
  - Screenshot UI copy recommends/displays `1600x1000`.
  - The validation logic accepts screenshots at least `850x850`.
- Notes:
  - PNG dimensions are read from the PNG header.
  - JPEG dimensions are read from JPEG Start Of Frame markers.
  - Duplicate screenshot removal by filename happens in DevPortal upload behavior; this script validates filenames and count constraints but does not mutate or remove duplicate files.
  - Module detection is path-based, so module screenshot count depends on screenshot files being organized with module-related path names.

### `settings-update-handler.js`

- Internal rule ID: `DS-03L`
- File types scanned:
  - `.js`, `.json`, `.jsx`, `.ts`, `.tsx`
- Additional file read:
  - `manifest.json`
- Purpose:
  - Detect apps that reference settings update handling in the manifest but do not implement the handler in code.
- Validation flow:
  1. Read and parse `manifest.json`.
  2. Recursively scan eligible source files.
  3. Decide whether the manifest references settings updates by checking:
     - `JSON.stringify(manifest).includes('onSettingsUpdate')`
  4. Search file contents for handler-like references using:
     - `/onSettingsUpdate|on_settings_update/i`
  5. If the manifest references settings updates but no file contains a matching handler token, emit a failure detail against `manifest.json`.
- How it decides pass/fail:
  - Pass when the manifest does not reference settings updates.
  - Pass when the manifest references settings updates and at least one file contains a matching handler token.
  - Fail only when the manifest references settings updates and no matching handler token exists anywhere in scanned files.

### `oauth-config-usage.js`

- Internal rule ID: `FF-07L`
- File types scanned:
  - `.env`, `.html`, `.js`, `.json`, `.jsx`, `.ts`, `.tsx`
- Purpose:
  - Detect OAuth credentials appearing outside approved config locations.
- Regex patterns used:
  - `/client[_-]?id\s*[:=]\s*['"][^'"]{10,}['"]/gi`
  - `/client[_-]?secret\s*[:=]\s*['"][^'"]{10,}['"]/gi`
  - `/oauth[_-]?token\s*[:=]\s*['"][^'"]{10,}['"]/gi`
- Config-file exemption:
  - A file is treated as config when its relative path matches:
    - `/oauth_config\.json$|config\/|config\\|iparams\.json$|\.env$/i`
- Comment-line exemption:
  - A matched line is ignored when it starts with:
    - `//`
    - `/*`
    - `*`
- Validation flow:
  1. Walk eligible files.
  2. Skip files considered config locations.
  3. Run the three OAuth regexes on remaining files.
  4. For each match, compute line number and excerpt.
  5. Ignore matches on obvious comment lines.
  6. Emit a failure detail for the remaining matches.
- Notes:
  - The `{10,}` minimum length is a heuristic to reduce obvious false positives.
  - This check is text-based and does not evaluate runtime behavior.

### `global-variables.js`

- Internal rule ID: `CR-04L`
- File types scanned:
  - `.js`, `.jsx`, `.ts`, `.tsx`
- Purpose:
  - Catch code that writes mutable state to browser globals like `window.*` and `globalThis.*`.
  - Prevent hidden cross-module coupling.
  - Prevent state collisions and accidental overwrites.
  - Reduce debugging and testing complexity caused by shared global state.
  - Reduce accidental data leakage across app flows.
- Regex patterns used:
  - `/window\.\s*[A-Za-z_$][\w$]*\s*=/g`
  - `/globalThis\.\s*[A-Za-z_$][\w$]*\s*=/g`
- Additional skip logic:
  - Ignore files that match `/\.min\.js$/i`
  - Ignore files whose relative path contains `node_modules/`
- Validation flow:
  1. Scan each JS/TS file.
  2. For each pattern, collect every assignment match.
  3. Compute line number and line excerpt.
  4. Emit a failure detail for each assignment.
- What counts as a hit:
  - `window.someValue = ...`
  - `globalThis.someValue = ...`
- What this script does not currently check:
  - Nested property chains such as `window.app.state = ...`
  - Reads from globals
  - Indirect mutation via helper functions

### `unused-library-imports.js`

- Internal rule ID: `CR-05L`
- File types scanned:
  - `.js`, `.jsx`, `.ts`, `.tsx`
- Purpose:
  - Detect third-party imports that appear unused within the same file.
- Import patterns used:
  - CommonJS:
    - `/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g`
  - ES modules:
    - `/import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/g`
- Validation flow:
  1. Walk JS/TS files.
  2. Extract imported identifier and source from `require(...)` and `import ... from ...`.
  3. Skip relative imports when `source.startsWith('.')`.
  4. Escape the identifier with `escapeRegExp(...)`.
  5. Count identifier occurrences using:
     - `new RegExp('\\b' + escapedIdentifier + '\\b', 'g')`
  6. If the identifier appears only once, treat it as unused.
     - The single occurrence is the import statement itself.
  7. Emit a failure detail with the import statement as the excerpt.
- Known limitations:
  - Default-import style only. It does not fully analyze named imports, namespace imports, destructuring, or alias-heavy import patterns.
  - This is a usage heuristic, not an AST-based reference resolver.

### `freshworks-css-only.js`

- Internal rule ID: `GN-08L`
- File types scanned:
  - `.css`, `.html`
- Purpose:
  - Prevent use of product-specific CSS bundles when only the allowed Freshworks CSS should be referenced.
- Regex patterns used:
  - Link tags:
    - `/<link[^>]+href\s*=\s*["']([^"']+\.css)["']/gi`
  - CSS imports:
    - `/@import\s+(?:url\()?\s*["']([^"']+\.css)["']/gi`
- Blocked CSS file names:
  - `freshdesk.css`
  - `freshmarketer.css`
  - `freshsales.css`
  - `freshservice.css`
  - `freshteam.css`
- Validation flow:
  1. Walk HTML and CSS files.
  2. Extract `.css` references from link tags and `@import`.
  3. Lowercase the matched reference.
  4. Fail when the reference contains any blocked CSS file name.
- Matching behavior:
  - Uses `href.includes(cssFile)` style matching after lowercasing.
  - This allows detection in local paths, CDN paths, or nested asset URLs as long as the blocked file name appears in the string.

### `platform-version-upgrade.js`

- Internal rule ID: `GN-12L`
- File read:
  - `manifest.json`
- Purpose:
  - Ensure the app declares a platform version and that the version is at least the expected minimum.
- Constant used:
  - `EXPECTED_PLATFORM_VERSION = 3.0`
- Validation flow:
  1. Read and parse `manifest.json`.
  2. Fail immediately if the manifest is missing or if `platform-version` is absent.
  3. Parse the declared version with:
     - `Number.parseFloat(String(manifest['platform-version']))`
  4. Fail when:
     - parsing results in `NaN`, or
     - the parsed value is below `3.0`
- Notes:
  - This script only validates the version threshold.
  - It does not validate broader manifest structure.
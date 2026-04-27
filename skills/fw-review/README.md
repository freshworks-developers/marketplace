# fw-review

Automated **Freshworks Platform 3.0** marketplace app audit: manifest and iparams review, frontend rules, deterministic `scripts/*.js` checks, and a fixed **App Review Result** report format.

## Overview

**fw-review** is a silent, pipeline-style skill. Agents follow `SKILL.md`, evaluate the rule IDs listed here, run mapped scripts from `scripts/` where specified, and emit output per `rules/report.md`. It does not install FDK; use **fw-setup** (`/fw-setup-status`) when the CLI may be absent.

## Install

### Install via CLI

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-review
```

**Local clone:**

```bash
npx skills add file:///path/to/fw-dev-tools-main --skill fw-review
```

### Install as Claude plugin

**Step 1**

```bash
claude plugin marketplace add freshworks-developers/fw-dev-tools
```

**Step 2**

```bash
claude plugin install fw-review@freshworks-developers
```

## Rule Inventory

| Rule ID | Area | Source | Summary |
|---------|------|--------|---------|
| IP-04A | Installation parameters | `rules/iparam-rules.md` | Protocol must not be accepted in domain or host fields. |
| IP-05A | Installation parameters | `rules/iparam-rules.md` | Installation inputs must have thorough validation. |
| IP-06A | Installation parameters | `rules/iparam-rules.md` | Validation failures must show helpful, specific messages. |
| FFS-02L | File and folder structure | `rules/script-check-rules.md`, `scripts/external-import-sources.js` | External imports must use allowlisted hosts. |
| FFS-04L | File and folder structure | `rules/script-check-rules.md`, `scripts/https-imports.js` | External imports must use HTTPS. |
| FFS-05L | File and folder structure | `rules/script-check-rules.md`, `scripts/image-resolution.js` | Image assets must meet baseline resolution expectations. |
| FF-01L | Frontend | `rules/frontend-files-rules.md` | Client API calls must use request templates instead of raw Ajax/fetch/HTTP clients. |
| FF-07L | Frontend | `rules/frontend-files-rules.md`, `rules/script-check-rules.md`, `scripts/oauth-config-usage.js` | OAuth client IDs, secrets, and tokens must stay in secure configuration. |
| FF-02M | Frontend | `rules/frontend-files-rules.md` | SMI must not be used when request templates are sufficient. |
| FF-03A | Frontend | `rules/frontend-files-rules.md` | API secrets must appear in request headers, not URLs. |
| FF-04A | Frontend | `rules/frontend-files-rules.md` | API errors must be handled and reported to users. |
| FF-05A | Frontend | `rules/frontend-files-rules.md` | List API calls must use pagination when supported. |
| FF-06A | Frontend | `rules/frontend-files-rules.md` | Source code must not hardcode credentials or secrets. |
| CR-05L | Code readability | `rules/script-check-rules.md`, `scripts/unused-library-imports.js` | Imported third-party libraries must be used. |
| GN-02L | Miscellaneous | `rules/script-check-rules.md`, `scripts/fdk-errors-warnings.js` | FDK validation must not report errors or warnings. |
| GN-08L | Miscellaneous | `rules/script-check-rules.md`, `scripts/freshworks-css-only.js` | Only Freshworks CSS should be referenced. |
| GN-12L | Miscellaneous | `rules/script-check-rules.md`, `scripts/platform-version-upgrade.js` | App must target the expected platform version. |

## Script Output Contract

Script-backed checks are deterministic Node CLIs. Each script takes an app root path and prints JSON:

```bash
node scripts/<script-name>.js /path/to/app
```

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
- `passed`, `summary`, and `details` are intended for downstream evaluation and report generation.

Shared helper in `scripts/common.js`:

- `createRuleResult(ruleId, passed, summary, details)` wraps the script result and stores the rule ID under `internal.rule_id`.
- `runCli(run)` resolves the target directory from `process.argv[2] || process.cwd()`, runs the checker, prints formatted JSON, and sets the process exit code to `0` for pass and `1` for fail.

## Shared Script Behavior

Most scripts use the same recursive scan approach:

- Start from the provided app root.
- Recursively walk subdirectories with `fs.readdir(..., { withFileTypes: true })`.
- Skip `.cache`, `.cursor`, `.fdk`, `.git`, `.next`, `build`, `coverage`, `dist`, and `node_modules`.
- Normalize output paths with forward slashes.
- Read files as UTF-8 text unless the script only needs file stats.

## Detailed Rules

### Installation Parameters

Installation-time configuration review is scoped to `manifest.json`, default iparams (`config/iparams.json` or `config/iparams.yaml`), custom settings UI (`config/iparams.html`, `config/assets/iparams.js`, and related `config/` assets), and install lifecycle consistency in `server/server.js`. Read `manifest.json` first, then determine whether the app uses default iparams or custom iparams; do not assume both exist.

#### IP-04A - Protocol Must Not Be Accepted In Domain Or Host Fields

**Goal:** Values meant to be hostnames must not accept `http://` or `https://`. Domain and host fields should contain only the hostname.

**Inspect:** Check default iparam fields whose name, description, or hint indicates domain, host, base URL, or endpoint host. For custom iparams, inspect JavaScript validation for string checks, regexes, trimming, and protocol rejection.

**Pass:** The field rejects or strips `http://` and `https://`, validates the remaining hostname, and uses hints/placeholders that show host-only input such as `api.example.com`.

**Fail:** A domain or host field accepts a full URL with scheme, or its regex explicitly allows `://`.

**Not applicable:** No domain, host, or base-URL hostname fields exist.

**Fix message:** Reject values matching `/^https?:\/\//i`, or strip the scheme after trim and validate the remaining hostname. Align hint text with host-only behavior.

#### IP-05A - Thorough Validation Of Installation Inputs

**Goal:** Every install-time field must be required when needed and constrained by type, regex, choices, or custom validation.

**Inspect:** For default iparams, review `required`, `type`, `regex`, `secure`, and dropdown choices. For custom iparams, review validation before `postConfigs` or save. Also check `manifest.json` and `server/server.js` when non-empty iparams imply install-time validation.

**Pass:** The app has one clear iparam mode, required fields are enforced, format-sensitive fields are validated, sensitive fields use `secure: true`, OAuth iparams are typed and required where needed, and `onAppInstall` plus its handler align when install validation is required.

**Fail:** Both default and custom iparams define conflicting UIs, required fields are not enforced, format-sensitive fields have no validation, or the manifest declares `onAppInstall` without a matching implementation.

**Not applicable:** Only empty `{}` iparams exist and there is no custom UI, though duplicate config modes should still be checked.

**Fix message:** Add `required`, `regex`, or custom validation. Add `onAppInstall` and `onAppInstallHandler` when install-time validation is required.

#### IP-06A - Helpful, Specific Validation Error Messages

**Goal:** Validation failures must tell the admin what went wrong and how to fix it.

**Inspect:** In default iparams, check `"error"` strings next to regex or validation metadata. In custom iparam JS, check user-visible toast, inline, or save error messages.

**Pass:** Each validation rule has a specific error message that explains the expected format. User-facing `display_name`, `description`, and `hint` text should not be misleading.

**Fail:** Messages are generic, missing, silent, or only logged to the console.

**Not applicable:** There are no validation rules or meaningful inputs to validate.

**Fix message:** Add descriptive `error` text for each regex. In custom JS, surface actionable messages with `fwNotify` or inline validation.

### File And Folder Structure

#### FFS-02L - Dependencies From External Sources Must Use Allowlisted Hosts

**Implemented by:** `scripts/external-import-sources.js`

**File types scanned:** `.css`, `.html`, `.js`, `.json`, `.jsx`, `.ts`, `.tsx`

**Goal:** External script and stylesheet imports must come from known allowlisted delivery hosts.

**Purpose:**

- Detect externally hosted imports and fail when the hostname is not in the allowlist.
- For npm-backed CDN or registry URLs, also fail when the package name does not match declared app dependencies.
- Treat host allowlisting as an infrastructure check only, not a package safety guarantee.

**Patterns used:**

- HTML attributes: `/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/gi`
- CSS imports and URLs: `/(?:url|@import)\s*\(\s*["']?(https?:\/\/[^"')]+)["']?\s*\)/gi`

**Validation flow:**

1. Scan each eligible text file.
2. Extract matching `http://` or `https://` URLs from `src`, `href`, `url(...)`, and `@import`.
3. De-duplicate URLs per file with a `Set`.
4. Parse the hostname using `new URL(urlValue)`.
5. If URL parsing fails, fall back to `/^https?:\/\/([^/:?#]+)/i`.
6. Compare the hostname against the external-host allowlist.
7. Accept a source when `hostname === allowlistedDomain` or `hostname.endsWith('.' + allowlistedDomain)`.
8. Read dependency declarations from `manifest.json` dependencies and `package.json` dependencies, devDependencies, peerDependencies, and optionalDependencies.
9. If the allowlisted host is npm-backed, extract the package name from the URL.
10. When a package name is extracted and there is at least one declared dependency, fail if the package is not declared.

**Allowlisted external hosts:** `ajax.googleapis.com`, `cdn.freshdev.io`, `cdn.jsdelivr.net`, `cdnjs.cloudflare.com`, `code.jquery.com`, `esm.sh`, `fonts.googleapis.com`, `fonts.gstatic.com`, `ga.jspm.io`, `maxcdn.bootstrapcdn.com`, `npm.jspm.io`, `registry.npmjs.org`, `stackpath.bootstrapcdn.com`, `static.freshdev.io`, `unpkg.com`

**NPM-backed hosts with package-name validation:** `cdn.jsdelivr.net`, `esm.sh`, `ga.jspm.io`, `npm.jspm.io`, `registry.npmjs.org`, `unpkg.com`

**Package extraction examples:**

- `https://cdn.jsdelivr.net/npm/react@18/...` -> `react`
- `https://unpkg.com/lodash@4/...` -> `lodash`
- `https://esm.sh/@scope/pkg@1.2.3` -> `@scope/pkg`
- `https://ga.jspm.io/npm:react@18/index.js` -> `react`
- `https://registry.npmjs.org/@scope%2fpkg/-/pkg-1.0.0.tgz` -> `@scope/pkg`

**Pass:** All external imports resolve to allowlisted hosts, and CDN npm packages are declared when dependency metadata exists.

**Fail:** An external import uses a non-allowlisted host, an invalid URL, or an undeclared CDN npm package.

**Not applicable:** No external script or style imports are present.

**Fix message:** Replace the non-allowlisted external import with an approved host/source, declare the package dependency, or bundle the asset locally.

**Security nuance:** Allowlisting these hosts does not mean packages served from them are inherently safe. Package safety still depends on package-level controls such as approved package allowlists, pinned versions, integrity verification, and review process.

#### FFS-04L - Imports Must Use HTTPS

**Implemented by:** `scripts/https-imports.js`

**File types scanned:** `.css`, `.html`, `.js`, `.json`, `.jsx`, `.ts`, `.tsx`

**Goal:** External script and style imports must use `https://`, not `http://`.

**Patterns used:**

- HTML attributes: `/(?:src|href)\s*=\s*["']http:\/\/[^"']+/gi`
- CSS: `/(?:url|@import)\s*\(\s*["']?http:\/\/[^"')]+/gi`

**Validation flow:**

1. Walk all eligible files.
2. Run both regexes against file content.
3. For every match, compute the line number from the byte offset.
4. Capture the full trimmed line as the excerpt.
5. Emit a failure detail for each insecure match.

**Pass:** Zero `http://` import patterns are found.

**Fail:** One or more insecure import matches are found.

**Not applicable:** No external imports are present.

**Fix message:** Change insecure import URLs from `http://` to `https://`.

#### FFS-05L - Images Must Meet Baseline Resolution Expectations

**Implemented by:** `scripts/image-resolution.js`

**Image file types discovered:** `.gif`, `.ico`, `.jpeg`, `.jpg`, `.png`

**SVG file checked:** `icon.svg`

**Goal:** App icon and logo assets should satisfy baseline production-readiness checks.

**Validation flow:**

1. Recursively collect asset paths from the app root.
2. Skip ignored folders such as `node_modules`, `dist`, `.git`, and `.fdk`.
3. For `.gif`, `.ico`, `.jpeg`, `.jpg`, and `.png` files, fail when file size is greater than `0` and less than `1024` bytes and the relative path contains `icon` or `logo`.
4. Find `icon.svg`.
5. Read `width` and `height` attributes from `icon.svg`.
6. Fail when `icon.svg` declares dimensions other than `64x64`.

**Pass:** Icon and logo assets satisfy the baseline checks.

**Fail:** Icon or logo image files are too small, or `icon.svg` is not declared as `64x64`.

**Not applicable:** No matching icon or logo assets are present.

**Fix message:** Provide production-ready icon assets and ensure `app/styles/images/icon.svg` is declared as `64x64`.

**Notes:** The script does not inspect actual PNG/JPEG dimensions, screenshot size, upload type allowlists, upload size limits, count limits, or S3-safe filenames.

### Frontend

#### FF-01L - Request Templates Vs Ajax / Fetch / Third-Party HTTP Clients

**Goal:** Client-side code that talks to product or custom APIs must use the platform Request API, request templates in `config/requests.json`, and `client.request.invoke` or `client.request.invokeTemplate`, not raw Ajax, `axios`, `fetch()`, or `XMLHttpRequest`, unless clearly justified.

**Inspect:** Review product-facing UI and client bundles under paths such as `app/`, `src/`, and HTML/JS loaded in the product. Serverless `server/` code can use `axios`, `fetch`, or other HTTP clients for outbound calls, so judge ambiguous files by runtime context.

**Pass:** No disallowed client HTTP patterns are present for API calls that should use request templates.

**Fail:** Client UI uses `$.ajax`, `axios`, `new XMLHttpRequest`, or `fetch()` for API calls without a documented platform exception.

**Fix message:** Move API calls to request templates and call them through `client.request.invoke` or `client.request.invokeTemplate`.

#### FF-07L - OAuth Client ID And Secrets Only In OAuth / Secure Config

**Implemented by:** `scripts/oauth-config-usage.js` plus frontend review criteria.

**File types scanned:** `.env`, `.html`, `.js`, `.json`, `.jsx`, `.ts`, `.tsx`

**Goal:** OAuth client IDs, client secrets, and long-lived OAuth tokens must appear only in intended secure configuration such as `config/oauth_config.json`, secure iparams, encrypted fields, or request template iparam bindings.

**Regex patterns used:**

- `/client[_-]?id\s*[:=]\s*['"][^'"]{10,}['"]/gi`
- `/client[_-]?secret\s*[:=]\s*['"][^'"]{10,}['"]/gi`
- `/oauth[_-]?token\s*[:=]\s*['"][^'"]{10,}['"]/gi`

**Config-file exemption:** A file is treated as config when its relative path matches `/oauth_config\.json$|config\/|config\\|iparams\.json$|\.env$/i`.

**Comment-line exemption:** A matched line is ignored when it starts with `//`, `/*`, or `*`.

**Validation flow:**

1. Walk eligible files.
2. Skip files considered config locations.
3. Run the three OAuth regexes on remaining files.
4. For each match, compute line number and excerpt.
5. Ignore matches on obvious comment lines.
6. Emit a failure detail for the remaining matches.

**Pass:** OAuth values appear only in approved configuration files.

**Fail:** OAuth client values appear in general app source, client scripts, HTML, or other non-config files.

**Not applicable:** No OAuth client values are present.

**Fix message:** Move OAuth client IDs, secrets, and tokens into secure config files such as `oauth_config.json`, secure iparams, request template bindings, or `.env`.

**Notes:** The `{10,}` minimum length is a heuristic to reduce obvious false positives. This check is text-based and does not evaluate runtime behavior.

#### FF-02M - SMI Must Not Be Used When Request Templates Will Suffice

**Goal:** Server Method Invocation should not be used when the method only proxies to `$request.invokeTemplate()`.

**Inspect:** Review SMI functions in `server/server.js` and compare them with request templates. Event handlers are not judged by this rule.

**Pass:** The SMI function performs real server-side logic beyond simply calling `$request.invokeTemplate()`.

**Fail:** The SMI function only calls `$request.invokeTemplate()` and returns the result.

**Not applicable:** There is no `server.js` or no request-template-backed SMI pattern.

**Fix message:** Remove the unnecessary SMI function and invoke the request template directly from the client where appropriate.

#### FF-03A - API Secrets Must Only Appear In Request Headers, Not URLs

**Goal:** Credentials must be sent in request headers, never in URL query parameters.

**Inspect:** Review `config/requests.json` and API call templates for query parameters such as `?api_key=<%= iparam.api_key %>`.

**Pass:** Credentials are placed in headers.

**Fail:** Credentials appear in URLs or query strings.

**Not applicable:** No request template or API calls use credentials.

**Fix message:** Move credentials to request headers only.

#### FF-04A - API Errors Must Be Handled And Reported To Users

**Goal:** API and platform interface failures must be caught and shown to the user.

**Inspect:** Review `client.request.invoke()`, `client.request.invokeTemplate()`, `client.db.get()`, `client.db.set()`, and other FDK interfaces for `.catch()` blocks, error callbacks, and user-visible notifications.

**Pass:** All errors are caught and user-visible messages are shown.

**Fail:** Errors are uncaught, catch blocks are empty, or errors are only logged with `console.error`.

**Not applicable:** No API or platform calls are made.

**Fix message:** Catch errors and add appropriate user-visible messages.

#### FF-05A - Pagination Must Be Utilised When The API Supports It

**Goal:** List API calls must implement pagination when the API supports it.

**Inspect:** Review list endpoints and collection fetches for pagination parameters, loops, next-page handling, or documented bounds.

**Pass:** List API calls implement pagination.

**Fail:** The code makes a single unbounded request to fetch all records.

**Not applicable:** No list API calls are made.

**Fix message:** Implement pagination for list API calls.

#### FF-06A - No Hardcoded Credentials Or Secrets In Source Code

**Goal:** API keys, passwords, tokens, and credentials must not be hardcoded in source files.

**Inspect:** Review source files for literal secrets. Values should come from `client.iparams.get()`, request template iparam bindings, secure app settings, or approved config.

**Pass:** Secrets are not hardcoded in source code.

**Fail:** Hardcoded secrets appear in source code.

**Not applicable:** No hardcoded secrets are present.

**Fix message:** Use developer app settings, secure iparams, or request template bindings for secrets.

### Code Readability

#### CR-05L - Imported Third-Party Libraries Must Be Used

**Implemented by:** `scripts/unused-library-imports.js`

**File types scanned:** `.js`, `.jsx`, `.ts`, `.tsx`

**Goal:** Imported third-party libraries should be used in the file that imports them.

**Import patterns used:**

- CommonJS: `/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g`
- ES modules: `/import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/g`

**Validation flow:**

1. Walk JS/TS files.
2. Extract imported identifier and source from `require(...)` and `import ... from ...`.
3. Skip relative imports when `source.startsWith('.')`.
4. Escape the identifier with `escapeRegExp(...)`.
5. Count identifier occurrences using `new RegExp('\\b' + escapedIdentifier + '\\b', 'g')`.
6. If the identifier appears only once, treat it as unused because the single occurrence is the import statement itself.
7. Emit a failure detail with the import statement as the excerpt.

**Pass:** Imported third-party libraries appear to be used.

**Fail:** A third-party library is imported but its identifier does not appear elsewhere in the file.

**Not applicable:** No third-party imports are present.

**Fix message:** Remove unused third-party imports or use the imported dependency where intended.

**Known limitations:** This is a regex-based check. It does not fully analyze named imports, namespace imports, destructuring, side-effect-only imports, or alias-heavy import patterns.

### Miscellaneous

#### GN-02L - FDK Validation Must Not Report Errors Or Warnings

**Implemented by:** `scripts/fdk-errors-warnings.js`

**Command executed:** `fdk validate`

**Goal:** `fdk validate` should complete without errors or warnings.

**Validation flow:**

1. Run `fdk validate` with the provided app root as the working directory.
2. Collect stdout and stderr.
3. Strip ANSI color codes.
4. Extract non-empty lines containing `error`, `warning`, or `warn`.
5. Ignore success summaries such as `0 errors` and `0 warnings`.
6. Fail when `fdk validate` exits unsuccessfully or warning/error lines are present.
7. Return at most the first 10 output issue lines in `details`.

**Timeout:** Fails if `fdk validate` does not finish within `120` seconds.

**FDK availability:** Fails with a clear message when `fdk` is not available on `PATH`.

**Pass:** `fdk validate` exits successfully and produces no warning/error lines.

**Fail:** `fdk validate` exits unsuccessfully, reports warning/error lines, cannot start, or times out.

**Not applicable:** FDK CLI is unavailable on `PATH` for environments where validation cannot be run.

**Fix message:** Fix the reported FDK validation issues, then rerun `fdk validate`. The script shows at most the first 10 issues per run.

#### GN-08L - Only Freshworks CSS Should Be Referenced

**Implemented by:** `scripts/freshworks-css-only.js`

**File types scanned:** `.css`, `.html`

**Goal:** Product-specific CSS bundles should not be referenced; only Freshworks CSS should be used.

**Regex patterns used:**

- Link tags: `/<link[^>]+href\s*=\s*["']([^"']+\.css)["']/gi`
- CSS imports: `/@import\s+(?:url\()?\s*["']([^"']+\.css)["']/gi`

**Blocked CSS file names:** `freshdesk.css`, `freshmarketer.css`, `freshsales.css`, `freshservice.css`, `freshteam.css`

**Validation flow:**

1. Walk HTML and CSS files.
2. Extract `.css` references from link tags and `@import`.
3. Lowercase the matched reference.
4. Fail when the reference contains any blocked CSS file name.

**Matching behavior:** Uses `href.includes(cssFile)` style matching after lowercasing. This detects local paths, CDN paths, and nested asset URLs when the blocked file name appears in the string.

**Pass:** Only allowed Freshworks CSS references are detected.

**Fail:** Product-specific CSS bundles are referenced.

**Not applicable:** No CSS imports or stylesheet links are present.

**Fix message:** Remove product-specific CSS references and use the correct Freshworks CSS bundle instead.

#### GN-12L - App Must Target The Expected Platform Version

**Implemented by:** `scripts/platform-version-upgrade.js`

**File read:** `manifest.json`

**Constant used:** `EXPECTED_PLATFORM_VERSION = 3.0`

**Goal:** The app must declare a platform version and that version must be at least the expected minimum.

**Validation flow:**

1. Read and parse `manifest.json`.
2. Fail immediately if the manifest is missing or if `platform-version` is absent.
3. Parse the declared version with `Number.parseFloat(String(manifest['platform-version']))`.
4. Fail when parsing results in `NaN` or the parsed value is below `3.0`.

**Pass:** `manifest.json` declares `platform-version` as `3.0` or newer.

**Fail:** `manifest.json` is missing, does not declare `platform-version`, or declares a version below `3.0`.

**Not applicable:** `manifest.json` is missing or unreadable.

**Fix message:** Add `platform-version` to `manifest.json` or upgrade it to the expected version.

**Notes:** This script only validates the version threshold. It does not validate broader manifest structure.

## What's Included

| Path | Purpose |
|------|---------|
| `SKILL.md` | Workflow, authoritative rule ID summary, prerequisites |
| `rules/` | Detailed criteria for iparam, frontend, script-backed checks, and report output |
| `scripts/` | Node CLIs for script-backed checks listed in the rule inventory |
| `.claude-plugin/` / `.cursor-plugin/` | Plugin metadata for marketplace installs |

## Requirements

- Target app: Platform 3.0 marketplace layout (`manifest.json`, `config/`, `app/`, etc.)
- **FDK** on `PATH` when phases require `fdk` (otherwise install via **fw-setup**)
- **Node.js** to run `scripts/*.js` (same machine as the audit)

## Support

- [Freshworks Developer Docs](https://developers.freshworks.com/)
- [GitHub issues](https://github.com/freshworks-developers/fw-dev-tools/issues)

## License

MIT (same as this repository).

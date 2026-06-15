---
name: fw-new-react-app-validate
description: Run fdk validate on a React Meta app with an explicit autofix error-class table for platform + lint errors.
globs: ["**/manifest.json"]
always: false
---

# /fw-new-react-app-validate

Run `fdk validate` and **fix everything** until **0 platform + 0 lint** errors. Loop up to **6 iterations**.

## 1. Determine app directory

Follow **`../fw-app-dev/commands/fdk-fix.md`** Step 1.

## 2. Confirm React Meta

- `manifest.json` → `metaConfig.framework` must be `"react"`.
- If missing, this is the wrong workflow. Ask if the user wants `fw-react-migrate` instead.

## 3. Toolchain gate

```bash
node --version
fdk version
```

- Node **24.x** + FDK **10.x**, or **STOP** and direct to `fw-setup`.
- `manifest.json` `engines` must be `"node": "24.11.0"` and `"fdk": "10.0.0"`. If it's older (e.g. Node 18 / FDK 9.x) and the toolchain is current, **raise** the manifest engines — never downgrade the shell.

## 4. Run

```bash
fdk validate
```

Capture the full output.

## 5. Autofix table

Apply fixes by error class. Re-run validate after each fix pass.

### Platform errors (blocking)

| Error | Cause | Fix |
|-------|-------|-----|
| `Icon '...icon.svg' not found` | File missing on disk | Create `app/styles/images/icon.svg` with a 64×64 SVG; ensure `icon` path in manifest matches the disk path |
| `must NOT have additional properties 'name' in manifest.json` | `"name"` field in manifest | **Remove** `"name"` — app name lives in the developer portal |
| `must NOT have fewer than 1 properties` (functions/requests/events) | Empty `{}` block in manifest | Drop the key entirely if unused |
| `Request template '<x>' is declared but not associated with module` | Template in `requests.json` missing from `modules.common.requests` | Add `"<x>": {}` under `modules.common.requests` |
| Template declared in manifest but missing in `requests.json` | Reverse mismatch | Add the template definition to `requests.json` or remove the manifest declaration |
| `Invalid host` in request template | `https://` or path inside host | Strip protocol and path; host is bare FQDN |
| `Path must start with /` | Missing leading slash in path | Prepend `/` |
| `<%= %>` substitution invalid | Used `{{...}}` | Replace with `<%= iparam.* %>` / `<%= context.* %>` / `<%= access_token %>` |
| Wrong module for location | e.g. Freshdesk `ticket_sidebar` under `modules.common` | Move it to `modules.support_ticket.location` |
| `Function '<name>' declared but not implemented` | SMI in manifest, missing in `server/server.js` exports | Add it to `exports = { ... }` |
| `Event '<name>' handler not found` | `events.<name>.handler: "x"` but no `exports.x` | Match names exactly |
| `App engines major version mismatch` | Manifest engines older than installed CLI | **Raise** manifest engines to `24.11.0` / `10.0.0` minimum; clean `node_modules`, `coverage`, `.fdk`; `npm install`; revalidate |

### Lint errors (also blocking)

| Error | Cause | Fix |
|-------|-------|-----|
| `Async function has no 'await' expression` | `async` function with no `await` | Remove `async`, **or** add a real `await` |
| `'args' is defined but never used` (or `'_args' is defined…`) | Unused parameter | **Remove the parameter entirely** — `_args` does not silence this |
| `Function has complexity X. Maximum allowed is 7` | Long `||` chain or nested branches | Use `Set`/`Map.has`; extract helpers below `exports` |
| `Unreachable code after return` | Dead code after `return` | Delete it |
| `Missing semicolon` | Stylistic lint | Add `;` |
| `'console.log' on iparams or args` | Logging secrets | Remove the log; never log `args` or `args.iparams` |

### React Meta–specific issues (not always reported by fdk, but cause runtime failures)

| Symptom | Fix |
|---------|-----|
| Crayons components render empty | Call `defineCustomElements()` from `@freshworks/crayons/loader` once per entry, **before** `createRoot`. Import `@freshworks/crayons/css/crayons-min.css` once. |
| `window.app` is undefined | Add `<script src="{{{appclient}}}"></script>` (triple braces) to the surface's HTML |
| `client` undefined in components | Wait for `window.app.initialized()` to resolve before rendering the real UI |
| `FwDataTable` empty | Set `columns` and `rows` as element properties via ref + `useEffect`, not as JSX props |
| Router pushes URL into Freshdesk | Replace `BrowserRouter` with `HashRouter` |
| Tailwind classes not applied | Add the source path to `content` in `tailwind.config.js`; ensure `tailwind.css` is imported by an entry the bundler reaches |

## 6. Iterate

After each fix pass, re-run:

```bash
fdk validate
```

Stop when **0 platform + 0 lint**. If still failing after **6 iterations**:

- Surface the remaining errors with file paths and short remediation hints.
- Do **not** silently downgrade engines.
- Do **not** declare the app "complete" — say so explicitly.

## 7. Report

Pass:

```
[VALID] Validation passed: 0 platform errors, 0 lint errors.

Next steps:
  cd <app-directory>
  fdk run
  Open the product URL with ?dev=true (or &dev=true)
```

Fail (after 6 iterations): list the remaining errors and the next concrete action.

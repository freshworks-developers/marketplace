---
name: fw-new-react-app
description: Primary one-shot command for greenfield React Meta app generation from a single prompt.
globs: ["**/manifest.json"]
always: false
---

# /fw-new-react-app

Single-shot generator. Infer features and surfaces, `fdk create` → `react-starter-template`, validate to **0 / 0**.

Interactive mode: **`/fw-new-react-app-scaffold`**.

## Step 1 — Determine target

- **New app:** create empty kebab-case folder (no manifest yet).
- **Existing React Meta app:** follow **`../fw-app-dev/commands/fdk-fix.md`** Step 1.

## Step 2 — Toolchain gate

```bash
node --version
fdk version
```

- Node **24.x** + FDK **10.x** per [`docs/engine-matrix.md`](../../../docs/engine-matrix.md).
- If missing: **`/fw-setup-install`** or **`/fw-setup-upgrade`**; re-check before continuing.

## Step 3 — Classify the prompt

Match requested features and surfaces from the prompt:

| Signal in prompt | Feature set |
|------------------|-------------|
| "full_page_app", "dashboard", "Crayons", "fw-data-table", "fw-tabs" | Crayons React, full-page layout |
| "ticket_sidebar", "Tailwind", "dark mode", "compact layout" | Tailwind sidebar layout |
| "Redux", "@reduxjs/toolkit", "createSlice", "Provider" | Redux Toolkit state flow |
| Two surfaces + "React Router" + "iparams" + "requests.json" + "SMI" | Hybrid app with router + iparams + requests + server methods |

If the prompt mixes flags (e.g. Crayons + Tailwind + Redux + Router), pick **all** matching feature flags.

If the prompt is ambiguous or contradicts itself (e.g. "no UI but with Crayons buttons"), ask **one** clarifying question and stop. Otherwise **do not ask** — generate.

| CTI, Zoom iframe, embed | [../references/patterns/cti-embed.md](../references/patterns/cti-embed.md) |
| 7+ placeholder surfaces | [../references/patterns/placeholder-multi-surface.md](../references/patterns/placeholder-multi-surface.md) |
| OAuth sidebar, Asana | [../references/templates/oauth-react-sidebar.md](../references/templates/oauth-react-sidebar.md) |
| Multi-product FD+FS sidebar | [../references/patterns/multi-product-sidebar.md](../references/patterns/multi-product-sidebar.md) |
| invokeTemplate from frontend | [../references/patterns/frontend-invoke-template.md](../references/patterns/frontend-invoke-template.md) |

## Step 4 — Load references

For each feature flag the prompt requires, load the matching reference files **once** at the start. Do not re-read them mid-generation.

| Flag | Reference |
|------|-----------|
| Crayons React | [../references/patterns/crayons-react.md](../references/patterns/crayons-react.md) |
| Tailwind | [../references/patterns/tailwind-setup.md](../references/patterns/tailwind-setup.md) |
| Redux Toolkit | [../references/patterns/redux-toolkit.md](../references/patterns/redux-toolkit.md) |
| Router + multi-surface | [../references/patterns/router-and-multi-surface.md](../references/patterns/router-and-multi-surface.md) |
| iparams | [../references/templates/iparams-examples.md](../references/templates/iparams-examples.md) |
| External HTTP / requests | [../references/templates/requests-examples.md](../references/templates/requests-examples.md) |
| Server SMI | [../references/templates/server-smi-examples.md](../references/templates/server-smi-examples.md) |

Always load:

- [../rules/react-meta-bootstrap.mdc](../rules/react-meta-bootstrap.mdc)
- [../rules/react-meta-dependencies.mdc](../rules/react-meta-dependencies.mdc)
- [../rules/react-meta-crayons-react.mdc](../rules/react-meta-crayons-react.mdc) (when Crayons is used)

## Step 5 — Create folder + scaffold

1. Choose a kebab-case folder name based on the app name in the prompt (e.g. `agent-productivity-dashboard`).
2. Create it as a **new empty directory** in the parent of the workspace.
3. Run `fdk create` and select **`react-starter-template`**.

## Step 6 — Apply the matched pattern set

Write every file in the order:

1. `manifest.json` (multi-module if needed; never empty `requests`/`functions`/`events` blocks).
2. `package.json` (base deps from the template + only the feature-flag adds from [../rules/react-meta-dependencies.mdc](../rules/react-meta-dependencies.mdc)).
3. `app/styles/images/icon.svg` (default 64×64 SVG, see SKILL.md or fw-app-dev rules — required).
4. `app/<surface>.html` for **each** surface, with `<script src="{{{appclient}}}"></script>`.
5. `app/components/<EntryFile>.jsx` for each surface — bootstrap with `window.app.initialized()`, `defineCustomElements()` once if Crayons.
6. Surface-specific `App` components, hooks, slices, store, routes, etc., per the matching pattern reference.
7. `config/iparams.json` (if applicable).
8. `config/requests.json` (if applicable; sync with `modules.common.requests` in manifest).
9. `server/server.js` (if applicable; lint-clean per [../references/templates/server-smi-examples.md](../references/templates/server-smi-examples.md)).
10. `tailwind.config.js` and `postcss.config.js` at project root (if Tailwind).
11. Optional `README.md` only if the user asked or if `fw-app-dev` is also loaded and requires it.

## Step 7 — Install + validate

If errors remain, apply [fw-new-react-app-validate.md](fw-new-react-app-validate.md) autofix table.

```bash
npm install
fdk validate
```

Iterate up to **6 times** until **0 / 0**.

## Step 8 — Report

```
[VALID] App generated at <path>/

Validation: 0 platform errors, 0 lint errors

Next steps:
  cd <path>
  fdk run
  Open the product URL with ?dev=true (or &dev=true)
  Helpers: http://localhost:10001/system_settings, /custom_configs, /web/test
```

Do **not** generate `APPS-SUMMARY.md`, `.validation-report.md`, or `ARCHITECTURE.md` unless the user asks.

## Hard rules during generation

- One surface = one HTML + one JSX entry. **Never** load the full-page bundle in a sidebar.
- Routing only in `full_page_app`.
- `<%= ... %>` substitution syntax — never `{{...}}`.
- Secrets: `secure: true` iparams; never read in frontend; use `<%= encode(iparam.*) %>` for Basic auth.
- Server lint: no `async` without `await`; no unused params; complexity ≤ 7; helpers after `exports`; SMI returns via `renderData`.
- Manifest ↔ files: every `requests.json` key in `modules.common.requests`; every SMI fn in `modules.common.functions`; every event handler matches an `exports` key.
- Engines: `"node": "24.11.0"`, `"fdk": "10.0.0"` minimum per engine-matrix; never downgrade toolchain.

## When to refuse / clarify

Ask **one** clarifying question only when:

- The prompt names two contradictory frameworks (e.g. "Tailwind + only Crayons no plain HTML").
- The prompt asks for a Platform 2.x manifest, OAuth without enough detail, or a feature outside these React Meta patterns that needs `fw-app-dev` for canonical rules.

Otherwise generate and validate.

---
name: fw-new-react-app-scaffold
description: Scaffold a new Freshworks React Meta app with fdk create + react-starter-template, then layer on selected features (Crayons React, Tailwind, Redux Toolkit, React Router, server SMI).
globs: ["**/manifest.json"]
always: false
---

# /fw-new-react-app-scaffold

Interactive scaffolder for a **new** React Meta app. Use this when the user wants to start from scratch and select features step by step. For one-shot generation from a complete prompt, use **`/fw-new-react-app`** instead.

## 1. Toolchain gate

Run inline before doing anything else:

```bash
node --version
fdk version
```

- Must be **Node 24.x** and **FDK 10.x** (see docs/engine-matrix.md).
- If FDK is not 10.x, run `/fw-setup-upgrade` (or `/fw-setup-install` if missing), then continue.

## 2. Folder

- Ask for the app's kebab-case folder name (e.g. `agent-dashboard-app`).
- Create it as a **new empty directory** in the parent of the workspace; never scatter app files in an unrelated repo root.

## 3. Generate from template

```bash
fdk create
# select: react-starter-template
```

Confirm the generated tree includes `package.json`, `app/index.html`, `app/components/Main.jsx`, `vitest.config.js`, `.babelrc`.

## 4. Feature selection (ask the user)

Ask the user which of these the app needs (one or more):

| Flag | Meaning | Reference to load |
|------|---------|-------------------|
| **Crayons React** | Use `<FwButton>`, `<FwDataTable>`, etc. | [../references/patterns/crayons-react.md](../references/patterns/crayons-react.md) |
| **Tailwind CSS** | Utility classes, dark mode | [../references/patterns/tailwind-setup.md](../references/patterns/tailwind-setup.md) |
| **Redux Toolkit** | `createSlice`, `<Provider>` | [../references/patterns/redux-toolkit.md](../references/patterns/redux-toolkit.md) |
| **React Router** | Multiple routes inside `full_page_app` | [../references/patterns/router-and-multi-surface.md](../references/patterns/router-and-multi-surface.md) |
| **iparams** | Install-time configuration | [../references/templates/iparams-examples.md](../references/templates/iparams-examples.md) |
| **External HTTP API** | `requests.json` + server SMI | [../references/templates/requests-examples.md](../references/templates/requests-examples.md) + [../references/templates/server-smi-examples.md](../references/templates/server-smi-examples.md) |

If the prompt clearly names a scenario family, skip the question and infer feature flags directly:

- Dashboard/full-page emphasis → Crayons React
- Sidebar + utility CSS emphasis → Tailwind-only sidebar
- Notes/state-management emphasis → Crayons React + Redux Toolkit
- Multi-surface + API + routing emphasis → Crayons React + React Router + iparams + requests + server SMI

## 5. Surfaces

- Ask which placeholders the app needs (`full_page_app`, `ticket_sidebar`, etc.).
- Apply [../references/patterns/router-and-multi-surface.md](../references/patterns/router-and-multi-surface.md) for module placement.
- Each surface gets its **own** HTML file and **own** JSX entry. **Routing only in `full_page_app`.**

## 6. Apply feature templates

For each selected flag, apply the matching files from the reference docs and update `package.json` per [../rules/react-meta-dependencies.mdc](../rules/react-meta-dependencies.mdc).

If Crayons React is selected, also apply [../rules/react-meta-crayons-react.mdc](../rules/react-meta-crayons-react.mdc) — `defineCustomElements()` + CSS import once per entry; never mix raw `<fw-button>` with `<FwButton>`.

## 7. Manifest

Use the multi-module template in `SKILL.md` § "Inline reference: minimal multi-module manifest". Keep only the blocks the app actually uses; never emit empty `requests`/`functions`/`events` objects.

## 8. Install + validate

```bash
npm install
fdk validate
```

If errors remain, follow [fw-new-react-app-validate.md](fw-new-react-app-validate.md) autofix table. Loop up to 6 iterations or until **0 platform + 0 lint**.

## 9. Report

Output:

- App path
- Validation result (must be 0/0)
- Run instructions: `fdk run` + product URL with `?dev=true`
- Local helpers: `http://localhost:10001/system_settings`, `/custom_configs`, `/web/test`

Do **not** invent extra documentation files (no `APPS-SUMMARY.md`, no `.validation-report.md`) unless the user asks.

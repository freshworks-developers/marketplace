---
name: fw-new-react-app
version: "1.0.0"
description: Greenfield scaffolding of Freshworks Platform 3.0 React Meta apps (metaConfig.framework react, JSX entries, FDK bundler via react-starter-template). Covers Crayons React, Tailwind, Redux Toolkit, React Router, multi-surface placeholders, CTI embed, OAuth sidebar, iparams, requests.json, and server SMI. Use when creating a new React Meta app or adding surfaces to an existing React Meta app—not for migrating vanilla app/scripts/*.js (use fw-react-migrate). Targets 0 platform + 0 lint from fdk validate.
compatibility: "Freshworks Platform 3.0; Node.js 24.x + FDK 10.x per docs/engine-matrix.md and fw-setup. Does not install FDK/Node."
argument-hint: "[fw-new-react-app|fw-new-react-app-scaffold|fw-new-react-app-add-surface|fw-new-react-app-validate]"
allowed-tools: "shell read write strreplace glob grep"
---

# Freshworks React Meta — new apps (fw-new-react-app)

**Scope:** **Greenfield** React Meta apps via `fdk create` → `react-starter-template`, or **add a surface** to an app that already has `metaConfig.framework: "react"`.

**Does not:** migrate vanilla `app/scripts/*.js` → use **`fw-react-migrate`**. Does not install FDK/Node → **`fw-setup`**. Does not own OAuth/security/complex serverless → **`fw-app-dev`**.

## EXECUTION ORDER

| User goal | Skill |
|-----------|-------|
| New React Meta app from prompt | **This skill** → `/fw-new-react-app` |
| Interactive scaffold with feature flags | **This skill** → `/fw-new-react-app-scaffold` |
| Add surface to existing React Meta app | **This skill** → `/fw-new-react-app-add-surface` |
| Migrate vanilla PF3 frontend to React Meta | **`fw-react-migrate`** |
| PF 2.x → 3.0 manifest | **`fw-app-dev`** `/fdk-migrate` first |
| Install FDK / Node | **`fw-setup`** |

## App directory (before any work)

Follow **`../fw-app-dev/commands/fdk-fix.md`** Step 1 (*Determine app directory*):

1. Search workspace for `manifest.json`.
2. Multiple apps → ask user which folder.
3. One app → use that directory.
4. **New app:** create empty kebab-case folder; no manifest yet.

## Toolchain + manifest gate

1. `node --version` → **24.x**; `fdk version` → **FDK 10.x** per [`docs/engine-matrix.md`](../../docs/engine-matrix.md).
2. If missing/wrong → **`fw-setup`** (`/fw-setup-install` or `/fw-setup-upgrade`); do not proceed without CLI.
3. Existing app not `"platform-version": "3.0"` → stop; **`fw-app-dev`** `/fdk-migrate` first.
4. Before **`fdk validate`**: follow **`fw-app-dev`** *Manifest + toolchain gate*; align `engines` upward; never downgrade to FDK 9 / Node 18 as a shortcut.

## Scenario matrix

| Scenario | Surfaces | Key references |
|----------|----------|----------------|
| Full-page dashboard | `full_page_app` | crayons-react.md |
| Tailwind ticket sidebar | `ticket_sidebar` | tailwind-setup.md |
| Hybrid API + SMI | `full_page_app` + `ticket_sidebar` | router-and-multi-surface.md, requests, server-smi |
| Multi-surface placeholders (7+) | many | placeholder-multi-surface.md |
| CTI embed | `cti_global_sidebar` | cti-embed.md |
| OAuth sidebar | `ticket_sidebar` | oauth-react-sidebar.md |
| Multi-product sidebar | FD + FS `ticket_sidebar` | multi-product-sidebar.md |
| Frontend invokeTemplate only | any | frontend-invoke-template.md |
| client.db state | sidebar | client-db.md |
| Custom iparams React UI | config | custom-iparams-react.md |
| Interface method demos | placeholders | interface-methods.md |
| Vitest + mocked client | any with tests | vitest-client-mocks.md |

**Pattern routing:**

- Crayons → [references/patterns/crayons-react.md](references/patterns/crayons-react.md)
- Tailwind → [references/patterns/tailwind-setup.md](references/patterns/tailwind-setup.md)
- Redux → [references/patterns/redux-toolkit.md](references/patterns/redux-toolkit.md)
- Router + multi-surface → [references/patterns/router-and-multi-surface.md](references/patterns/router-and-multi-surface.md)
- Placeholders → [references/patterns/placeholder-multi-surface.md](references/patterns/placeholder-multi-surface.md)
- CTI → [references/patterns/cti-embed.md](references/patterns/cti-embed.md)
- iparams → [references/templates/iparams-examples.md](references/templates/iparams-examples.md)
- OAuth sidebar → [references/templates/oauth-react-sidebar.md](references/templates/oauth-react-sidebar.md)
- Requests + SMI → [references/templates/requests-examples.md](references/templates/requests-examples.md), [server-smi-examples.md](references/templates/server-smi-examples.md)
- Tests → [references/patterns/vitest-client-mocks.md](references/patterns/vitest-client-mocks.md)
- Interface demos → [references/patterns/interface-methods.md](references/patterns/interface-methods.md)

## Canonical generation flow

1. Classify features + surfaces from prompt.
2. Create empty app folder (kebab-case).
3. `fdk create` → **`react-starter-template`**.
4. Write manifest first; apply matched references.
5. `npm install` → `fdk validate` (≤6 loops via [commands/fw-new-react-app-validate.md](commands/fw-new-react-app-validate.md)).
6. Report path, 0/0, `fdk run ?dev=true`, `http://localhost:10001/system_settings`.

## Pre-write checklist (12 points)

1. `metaConfig.framework` is `"react"`.
2. Every HTML shell has `<script src="{{{appclient}}}"></script>`.
3. One surface = one HTML + one JSX entry; no full-page bundle in sidebar.
4. `window.app.initialized()` before real UI.
5. Crayons: `defineCustomElements()` + CSS once per entry tree.
6. Dependencies match feature flags only ([rules/react-meta-dependencies.mdc](rules/react-meta-dependencies.mdc)).
7. Module placement: `full_page_app` / `cti_global_sidebar` → `common`; Freshdesk sidebar → `support_ticket`.
8. Secrets: `secure: true` iparams; server-side only.
9. Request templates: `<%= ... %>` never `{{}}`.
10. Server lint: async/await, no unused params, complexity ≤ 7.
11. Manifest ↔ files synced (requests, functions, icons).
12. **HashRouter** only in `full_page_app` — not `BrowserRouter` (host owns iframe URL).

## Engines (manifest example)

```json
"engines": { "node": "24.11.0", "fdk": "10.0.0" }
```

Minimum per **engine-matrix**; projects may pin higher (e.g. `10.1.2`).

## Slash commands

- [`/fw-new-react-app`](commands/fw-new-react-app.md) — one-shot from prompt
- [`/fw-new-react-app-scaffold`](commands/fw-new-react-app-scaffold.md) — interactive
- [`/fw-new-react-app-add-surface`](commands/fw-new-react-app-add-surface.md) — add surface (redirects to **fw-react-migrate** if no `metaConfig`)
- [`/fw-new-react-app-validate`](commands/fw-new-react-app-validate.md) — validate + autofix

## Related skills

- **fw-react-migrate** — vanilla / pre-meta → React Meta
- **fw-app-dev** — manifest, OAuth, requests, server, `/fdk-migrate`
- **fw-setup** — FDK + Node
- **fw-review** — pre-publish audit
- **fw-publish** — marketplace upload

Use cases: [references/USE-CASES.md](references/USE-CASES.md) (NU-1 … NU-5).

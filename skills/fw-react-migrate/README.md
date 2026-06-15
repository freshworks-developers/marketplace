<h1 align="center">Freshworks React Meta — Migrate</h1>

<p align="center"><strong>Migrate Platform 3.0 vanilla frontends to React Meta</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/React-Meta-00a67e?style=for-the-badge" alt="React Meta">
  <img src="https://img.shields.io/badge/FDK-10.x-0052cc?style=for-the-badge" alt="FDK">
</p>

## Overview

**fw-react-migrate** converts existing PF 3.0 apps from vanilla `app/scripts/*.js` (or pre-meta React) to **React Meta** while preserving server, OAuth, and `requests.json`.

Requires **`platform-version: "3.0"`** — for 2.x use **fw-app-dev** `/fdk-migrate` first.

## Install

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-react-migrate
```

```bash
claude plugin marketplace add freshworks-developers/fw-dev-tools
claude plugin install fw-react-migrate@freshworks-developers
```

## Slash commands

| Command | Purpose |
|---------|---------|
| `/fw-react-migrate` | Full or light migration |
| `/fw-react-migrate-review` | Pre-merge review |

## Use cases

| ID | Pattern | Description |
|----|---------|-------------|
| MG-1 | invokeTemplate sidebar | Vanilla sidebar → React Meta |
| MG-2 | Dual-surface OAuth | Sidebar + full page; server kept |
| MG-3 | Multi-product same URL | FD + FS share one `index.html` |
| MG-4 | Server trim | Timer/state moves to `client.db` |
| MG-5 | Pre-meta light path | Add `metaConfig` only |
| MG-6 | Folder flattening | Nested layout → FDK root |

Full catalog: [references/USE-CASES.md](references/USE-CASES.md). Prompts: [fw-react-app-usecases.md](../../../fw-react-app-usecases.md).

## References

- **Patterns:** `references/patterns/` — entry bootstrap, multi-surface, flatten, server-trim, utils+tests
- **Before/after:** `references/before-after/` — pattern-specific migration walkthroughs

## Related skills

- **fw-new-react-app** — greenfield + add-surface
- **fw-app-dev** — manifest/OAuth/server lint
- **fw-setup** — toolchain

MIT

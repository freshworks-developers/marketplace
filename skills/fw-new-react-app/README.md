<h1 align="center">Freshworks React Meta — New Apps</h1>

<p align="center"><strong>Greenfield Platform 3.0 React Meta scaffolding</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/React-Meta-00a67e?style=for-the-badge" alt="React Meta">
  <img src="https://img.shields.io/badge/FDK-10.x-0052cc?style=for-the-badge" alt="FDK">
</p>

## Overview

**fw-new-react-app** scaffolds **new** React Meta apps via `fdk create` → `react-starter-template`, with pattern libraries for Crayons, Tailwind, Redux, Router, multi-surface placeholders, CTI embed, OAuth sidebar, and hybrid SMI apps.

**Does not** migrate vanilla `app/scripts/*.js` — use **[fw-react-migrate](../fw-react-migrate/)**.

## Install

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-new-react-app
```

```bash
claude plugin marketplace add freshworks-developers/fw-dev-tools
claude plugin install fw-new-react-app@freshworks-developers
```

## Slash commands

| Command | Purpose |
|---------|---------|
| `/fw-new-react-app` | One-shot from prompt |
| `/fw-new-react-app-scaffold` | Interactive feature flags |
| `/fw-new-react-app-add-surface` | Add surface to React Meta app |
| `/fw-new-react-app-validate` | Validate + autofix |

## Use cases

| ID | Scenario | Key reference |
|----|----------|---------------|
| NU-1 | Tailwind ticket sidebar | `tailwind-setup.md` |
| NU-2 | Hybrid dashboard + SMI | `router-and-multi-surface.md` |
| NU-3 | 7+ placeholder surfaces | `placeholder-multi-surface.md` |
| NU-4 | CTI embed | `cti-embed.md` |
| NU-5 | Add surface | `fw-new-react-app-add-surface` |

Full catalog: [references/USE-CASES.md](references/USE-CASES.md). Prompts: [fw-react-app-usecases.md](../../../fw-react-app-usecases.md).

## Related skills

- **fw-react-migrate** — vanilla → React Meta
- **fw-app-dev** — manifest, OAuth, `/fdk-migrate`
- **fw-setup** — FDK + Node toolchain

MIT

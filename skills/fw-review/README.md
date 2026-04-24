# fw-review

Automated **Freshworks Platform 3.0** marketplace app audit: manifest and iparams review, frontend rules, deterministic `scripts/*.js` checks, and a fixed **App Review Result** report format.

## Overview

**fw-review** is a silent, pipeline-style skill. Agents follow `SKILL.md` phases and linked `rules/*.md` criteria, run mapped scripts from `scripts/` for SC-* rule IDs, and emit output per `rules/report.md`. It does not install FDK; use **fw-setup** (`/fw-setup-status`) when the CLI may be absent.

## Install

### Install via CLI

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-review
```

**Local clone:**

```bash
npx skills add file:///path/to/marketplace-main --skill fw-review
```

### Install as Claude plugin

**Step 1**

```bash
claude plugin marketplace add freshworks-developers/marketplace
```

**Step 2**

```bash
claude plugin install fw-review@freshworks-developers
```

## What's included

| Path | Purpose |
|------|---------|
| `SKILL.md` | Workflow, rule ID summary, prerequisites |
| `rules/` | IP-*, FF-*, SC-* criteria and report layout |
| `scripts/` | Node CLIs for script-backed checks (see `scripts/README.md`) |
| `.claude-plugin/` / `.cursor-plugin/` | Plugin metadata for marketplace installs |

## Requirements

- Target app: Platform 3.0 marketplace layout (`manifest.json`, `config/`, `app/`, etc.)
- **FDK** on `PATH` when phases require `fdk` (otherwise install via **fw-setup**)
- **Node.js** to run `scripts/*.js` (same machine as the audit)

## Support

- [Freshworks Developer Docs](https://developers.freshworks.com/)
- [Issues — marketplace](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT (same as this repository).

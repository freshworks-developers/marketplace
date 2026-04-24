# fw-publish

Guide for publishing **Freshworks Platform 3.0** custom apps to the **Freshworks Marketplace** using MCP tools: validate, pack, **app-upload**, then submit or update an app version.

## Overview

**fw-publish** documents auth preflight, `fdk validate` / `fdk pack`, binary upload, and marketplace API steps. MCP server reference config lives at **`skills/fw-publish/.mcp.json`**. Pair with **fw-app-dev** for manifest and validation fixes before packing.

## Install

### Install via CLI

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill fw-publish
```

**Local clone:**

```bash
npx skills add file:///path/to/marketplace-main --skill fw-publish
```

### Install as Claude plugin

**Step 1**

```bash
claude plugin marketplace add freshworks-developers/marketplace
```

**Step 2**

```bash
claude plugin install fw-publish@freshworks-developers
```

## What's included

| Path | Purpose |
|------|---------|
| `SKILL.md` | Orchestration, MCP tool usage, error handling |
| `.mcp.json` | Reference `freshworks-marketplace` server block (URL + `Authorization`) |
| `subagents/` | Optional deep dives (validation, packing, metadata, API publishing) |
| `references/` | Extra orchestration notes |
| `examples/test-app/` | Minimal sample app for dry runs |

## Requirements

- **Developer Portal** JWT for MCP (`Authorization: Bearer …`); see **AGENTS.md** and **SKILL.md** for Cursor vs Claude Code token placement
- **FDK 10.x** and **Node 24.x** for validate/pack (see **fw-setup**)
- Built zip from `fdk pack` before upload

## Support

- [Freshworks Developer Portal](https://developers.freshworks.com/developer/)
- [Issues — marketplace](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT (same as this repository).

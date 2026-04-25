# fw-publish

Guide for publishing **Freshworks Platform 3.0** custom apps to the **Freshworks Marketplace** using MCP tools: validate, pack, **app-upload**, then submit or update an app version.

## Overview

**fw-publish** documents auth preflight, `fdk validate` / `fdk pack`, binary upload, and marketplace API steps. MCP server reference config is **`.mcp.json`** at the **repository root** (same monorepo as this skill). Pair with **fw-app-dev** for manifest and validation fixes before packing.

## Install

### Install via CLI

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-publish
```

**Local clone:**

```bash
npx skills add file:///path/to/fw-dev-tools-main --skill fw-publish
```

### Install as Claude plugin

**Step 1**

```bash
claude plugin marketplace add freshworks-developers/fw-dev-tools
```

**Step 2**

```bash
claude plugin install fw-publish@freshworks-developers
```

## What's included

| Path | Purpose |
|------|---------|
| `SKILL.md` | Orchestration, MCP tool usage, error handling |
| *(repo root)* `.mcp.json` | Reference `fw-dev-mcp` server block (URL + `Authorization`); bundled at monorepo root, not under `skills/fw-publish/` |
| `subagents/` | Optional deep dives (validation, packing, metadata, API publishing) |
| `references/` | Extra orchestration notes |
| `examples/test-app/` | Minimal sample app for dry runs |

This skill has **no** `rules/` or `commands/` trees (playbooks in `SKILL.md`, `subagents/`, `references/`). Repo-wide inventory: [`AGENTS.md`](../../AGENTS.md) → **fw-publish**.

## Requirements

- **Developer Portal** JWT for MCP (`Authorization: Bearer …`); see **AGENTS.md** and **SKILL.md** for Cursor vs Claude Code token placement
- **FDK 10.x** and **Node 24.x** for validate/pack (see **fw-setup**)
- Built zip from `fdk pack` before upload

## Support

- [Freshworks Developer Portal](https://developers.freshworks.com/developer/)
- [GitHub issues](https://github.com/freshworks-developers/fw-dev-tools/issues)

## License

MIT (same as this repository).

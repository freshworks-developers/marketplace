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
| `references/` | Extra orchestration notes; **`openai-server-mcp-tools.md`** maps **`mp-openai`** MCP tool names |
| `examples/test-app/` | Minimal sample app for dry runs |

This skill has **no** `rules/` or `commands/` trees (playbooks in `SKILL.md`, `subagents/`, `references/`). Repo-wide inventory: [`AGENTS.md`](../../AGENTS.md) → **fw-publish**.

## Requirements

- **Developer Portal API key** for MCP authentication — [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) → **Developer API Key** → **Connect to Developer MCP server** → **Copy**
- **MCP server configuration**: `fw-dev-mcp` at `https://mcp.freshworks.dev/mcp` with `Authorization` header
  - **Claude Code**: API key stored in keychain via `userConfig.mcp_auth_token`, referenced as `${user_config.mcp_auth_token}`
  - **Cursor**: Copy `.mcp.json` server block to `~/.cursor/mcp.json` and use literal `Bearer <token>` (Cursor doesn't resolve `user_config`)
- **FDK 10.x** and **Node 24.x** for validate/pack (see **fw-setup**)
- Built zip from `fdk pack` before upload

### MCP Tools Available

Names match **`openai-server`** — see **[`references/openai-server-mcp-tools.md`](references/openai-server-mcp-tools.md)**.

| Tool | Role |
|------|--------|
| **`list_custom_apps`** | Returns **`count`** and **`apps`** (each with **`id`**, **`name`**, **`type`**, **`state`**, **`latestVersion`**, …). Optional **`page`**, **`perPage`**. |
| **`create_app_upload_url`** | Presigned upload + **`uploadId`** |
| **`submit_custom_app`** | New app + first version |
| **`add_app_version`** | New version (confirm **`tools/list`**) |
| **`get_app_status`** | Status by **`appId`** |

## Support

- [Freshworks Developer Portal](https://developers.freshworks.com/developer/)
- [GitHub issues](https://github.com/freshworks-developers/fw-dev-tools/issues)

## License

MIT (same as this repository).

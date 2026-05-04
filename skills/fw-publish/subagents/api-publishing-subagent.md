# Marketplace publish via MCP (subagent stub)

**Use the host skill:** [../SKILL.md](../SKILL.md) — full sequence, parameters, and error handling.

Publishing goes through **openai-server MCP tools** (`list_custom_apps`, `create_app_upload_url`, `submit_custom_app`, `add_app_version`, `get_app_status`) — see **[../references/openai-server-mcp-tools.md](../references/openai-server-mcp-tools.md)**. The JWT is configured in the MCP client (see **`.mcp.json`** at the repository root and plugin `userConfig`), not in shell environment variables for a separate upload script.

**Authority:** Tool contracts and server behavior live in **openai-server** (this repo documents only how agents orchestrate calls).

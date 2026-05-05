# Marketplace publish via MCP (subagent stub)

**Use the host skill:** [../SKILL.md](../SKILL.md) — full sequence, parameters, and error handling.

**App-upload:** only **plain `curl` PUT** per **SKILL.md** step 8 — **not** Python `urllib` / `requests` (often **403** from managed agent egress). Hand over **curl** to the developer locally if the agent cannot get **200**.

Publishing goes through **fw-dev-mcp** tools (`list_custom_apps`, `create_app_upload_url`, `submit_custom_app`, `add_app_version`, `get_app_status`). The JWT is configured in the MCP client (see **`.mcp.json`** at the repository root and plugin `userConfig`), not in shell environment variables for a separate upload script.

**Authority:** Tool contracts and server behavior live in **openai-server** (this repo documents only how agents orchestrate calls).

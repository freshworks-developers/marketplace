# Orchestration note

Publishing uses a **single MCP-backed path** documented in **[../SKILL.md](../SKILL.md)**:

1. Auth preflight (`list_marketplace_apps`).
2. `fdk validate` and `fdk pack`.
3. `create_app_upload_url`, **app-upload** (PUT zip binary via `curl` to `uploadUrl`), then `submit_marketplace_app` or `update_marketplace_app_version`.
4. `get_marketplace_app_status` and update `.fdk/app-info.json` as needed.

The files under **`../subagents/`** are short troubleshooting stubs aligned with that playbook.

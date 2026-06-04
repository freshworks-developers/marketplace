# MCP availability check (post-generation, optional)

After showing the completion message, check if MCP is already configured:

```javascript
// Check if MCP tools are available
try {
  CallMcpTool("fw-dev-mcp", "list_custom_apps", {});
  // Success: MCP already configured, skip prompt
} catch {
  // MCP not configured: offer setup
  // See AGENTS.md and skills/fw-publish/SKILL.md for full setup instructions
}
```

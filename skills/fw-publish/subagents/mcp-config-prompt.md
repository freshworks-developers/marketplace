# MCP Configuration Prompt (Subagent)

**Purpose:** Prompt user to configure Marketplace API authentication for publishing tools. Called by fw-setup, fw-app-dev, or any skill after successful completion.

**When to use:** After FDK installation, app generation, or when MCP tools are needed but not configured.

**Precondition check:** Before showing this prompt, verify MCP is NOT already configured:
```javascript
// Try to call list_marketplace_apps
// If successful → skip this prompt (already configured)
// If fails → show this prompt
```

---

## Prompt Flow

### Step 1: Check if already configured

```bash
# Attempt to call MCP tool
CallMcpTool("fw-dev-mcp", "list_marketplace_apps", {})

# If successful:
#   Skip this entire prompt (MCP already configured)
# If fails (auth error or tool not found):
#   Continue to Step 2
```

### Step 2: Offer configuration (don't force)

```
═══════════════════════════════════════════════════════════
Optional: Configure Marketplace Publishing

Would you like to set up publishing tools now?

This connects your IDE to the Freshworks Marketplace API
so you can publish apps directly from this environment.

You can skip this and configure later.

Configure MCP now? (y/N)
═══════════════════════════════════════════════════════════
```

**Wait for user response.**

---

### Step 3A: User says YES

#### 3A.1: Get API Key

```
Step 1: Get your API key
────────────────────────────────────────────────────────────

1. Go to: https://developers.freshworks.com/developer/
2. Find: "API key for Freddy AI Copilot VS Code plugin" section
3. Click: Copy

This JWT token authenticates you to the Marketplace API.
────────────────────────────────────────────────────────────
```

#### 3A.2: Detect IDE

Check which IDE is running:

**Detection logic:**
```bash
if [[ -n "$CLAUDE_CODE_SESSION" ]] || command -v claude >/dev/null 2>&1; then
  IDE="claude"
elif [[ -n "$CURSOR_SESSION" ]] || [[ -f "$HOME/.cursor/mcp.json" ]]; then
  IDE="cursor"
else
  IDE="cursor"  # default assumption
fi
```

#### 3A.3: Configure based on IDE

**If Claude Code:**

```
Step 2: Configure Claude Code
────────────────────────────────────────────────────────────

1. Run: /config
2. Find: 'freshworks-dev-tools' plugin settings
3. Set: 'mcp_auth_token' to your copied API key
4. Save (token stored securely in system keychain)

The MCP server URL is already configured in .mcp.json

✓ After saving, publish tools will be available
────────────────────────────────────────────────────────────
```

**If Cursor:**

```
Step 2: Configure Cursor
────────────────────────────────────────────────────────────

I'll create ~/.cursor/mcp.json with your API key.

IMPORTANT: This file will contain your API key in plain text.
- Keep it secure
- Do not commit to version control
- Add to .gitignore if needed

Ready to proceed? (y/N)
```

**If user confirms:**

```bash
# Prompt for API key (hidden input)
echo ""
read -sp "Paste your API key (input hidden): " api_key
echo ""

if [[ -z "$api_key" ]]; then
  echo "⚠ No API key provided. Skipping MCP configuration."
  exit 0
fi

# Create config directory and file
MCP_CONFIG="$HOME/.cursor/mcp.json"
mkdir -p "$(dirname "$MCP_CONFIG")"

# Write mcp.json
cat > "$MCP_CONFIG" <<'EOF'
{
  "mcpServers": {
    "fw-dev-mcp": {
      "url": "https://mcp.freshworks.dev/mcp",
      "headers": {
        "Authorization": "Bearer API_KEY_PLACEHOLDER"
      }
    }
  }
}
EOF

# Replace placeholder with actual key (avoid exposing in command)
sed -i.bak "s|API_KEY_PLACEHOLDER|$api_key|g" "$MCP_CONFIG"
rm -f "$MCP_CONFIG.bak"

# Set secure permissions
chmod 600 "$MCP_CONFIG"

echo "✓ MCP server configured at: $MCP_CONFIG"
echo "✓ Publish tools are now available"
echo ""
echo "⚠ Restart Cursor to apply changes"
```

**Output:**
```
✓ MCP configured successfully
✓ File: ~/.cursor/mcp.json (permissions: 600)
✓ Publish tools available after restart

Next: Restart Cursor, then use fw-publish skill to publish apps
────────────────────────────────────────────────────────────
```

---

### Step 3B: User says NO or skips

```
Skipped. You can configure MCP later using any of these methods:

1. Run: /fw-setup-install (choose MCP option)
2. Manually edit:
   - Claude Code: Run /config → set mcp_auth_token
   - Cursor: Edit ~/.cursor/mcp.json
3. See: README.md or AGENTS.md for detailed setup

Publish tools will prompt for configuration when needed.
```

---

## Usage from Skills

### fw-setup (after FDK install)

```javascript
// At end of /fw-setup-install, after all verification passes:
POST_INSTALL_MCP_PROMPT:
  Read and follow: skills/fw-publish/subagents/mcp-config-prompt.md
```

### fw-app-dev (after app generation)

```javascript
// After "App generated successfully" message:
if (app_validation_passed && zero_errors) {
  show_next_steps();
  
  // Then offer MCP config (once)
  Read and follow: skills/fw-publish/subagents/mcp-config-prompt.md
}
```

### fw-publish (on auth failure)

```javascript
// Step 1 of publish workflow:
try {
  list_marketplace_apps();
} catch (auth_error) {
  // MCP not configured
  Read and follow: skills/fw-publish/subagents/mcp-config-prompt.md
  
  // After configuration, retry publish
}
```

---

## Security Notes

1. **Never log API keys** - use `-sp` for hidden input
2. **Cursor stores plaintext** - warn user about file security
3. **Claude Code uses keychain** - secure by default
4. **File permissions** - always `chmod 600` for mcp.json
5. **Never commit tokens** - remind about .gitignore

---

## Error Handling

**If API key validation fails:**
```
⚠ Could not verify API key

This might mean:
- The key was not copied correctly
- The key has expired
- The Marketplace API is temporarily unavailable

Please try:
1. Copy the key again from Developer Portal
2. Re-run configuration
3. Contact support if issue persists
```

**If file write fails:**
```
⚠ Could not write MCP configuration

Check:
- File permissions on ~/.cursor/
- Disk space available
- Try: mkdir -p ~/.cursor && chmod 755 ~/.cursor
```

---

## Testing

After configuration, verify with:
```bash
# Test MCP connection
CallMcpTool("fw-dev-mcp", "list_marketplace_apps", {})

# Expected: List of apps (or empty array if no apps)
# If auth error: Configuration failed, retry
```

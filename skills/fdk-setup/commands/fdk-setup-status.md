---
name: fdk-setup-status
description: Check FDK and Node.js installation status (/fdk-setup status); optional --verbose diagnostics
always: true
argument-hint: "[--verbose]"
---

# FDK setup — status (`/fdk-setup-status`)

**`/fdk-setup status`**. Read-only; **no** shell Task.

## Behaviour

| User intent | Action |
|-------------|--------|
| `/fdk-setup-status` | Run the **default** block below (short summary). |
| `/fdk-setup-status --verbose` | Run **default** then the **verbose** block (PATH, nvm, npm prefix, shell hints). |

## Execution (default)

Run checks directly (no subagent):

```bash
echo "=== FDK Status ==="
echo "Node: $(node --version 2>&1 || echo 'Not installed')"
echo "nvm: $(nvm --version 2>&1 || echo 'Not installed')"
echo "FDK binary: $(command -v fdk || echo 'Not on PATH')"
echo "FDK cache: $([ -d ~/.fdk ] && echo 'Present (~/.fdk)' || echo 'Not found')"

# FDK version - diagnose PATH/Node mismatch if version check fails
if command -v fdk >/dev/null 2>&1; then
  FDK_PATH=$(command -v fdk)
  FDK_OUT=$(fdk version 2>&1)
  FDK_EXIT=$?
  
  if [ $FDK_EXIT -eq 0 ]; then
    # Success - extract version (handles both "Installed: X.Y.Z" and "X.Y.Z" formats)
    FDK_VER=$(echo "$FDK_OUT" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    echo "FDK version: $FDK_VER"
  else
    # Failed - diagnose Node/npm prefix mismatch
    echo "FDK version: Binary at $FDK_PATH but 'fdk version' failed"
    echo "  Current Node: $(node --version 2>&1 || echo 'not found')"
    echo "  npm prefix: $(npm config get prefix 2>&1 || echo 'not found')"
    echo ""
    echo "  DIAGNOSIS: Node version mismatch (FDK installed on different Node version)"
    echo "  → Load references/error-command-not-found.md for fix"
  fi
else
  echo "FDK version: Not installed"
fi
echo "=================="
```

## Execution (`--verbose`)

After the default block, run (still **inline**, no Task). On **Windows PowerShell**, run the **PowerShell** equivalents from **`references/windows.md`** (e.g. **`where.exe fdk`**, **`$env:Path -split ';'`**) — the block below is **Unix-style** for bash/zsh.

```bash
echo ""
echo "=== FDK Status (verbose) ==="
echo "--- PATH (first 800 chars) ---"
echo "$PATH" | head -c 800
echo ""
echo "--- node / npm ---"
command -v node 2>/dev/null; command -v npm 2>/dev/null
npm config get prefix 2>/dev/null || true
echo "--- nvm ---"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm current 2>/dev/null || true
  nvm alias 2>/dev/null || true
else
  echo "nvm.sh not sourced in this shell (NVM_DIR=$NVM_DIR)"
fi
echo "--- fdk candidates ---"
type -a fdk 2>/dev/null || true
NPF="$(npm config get prefix 2>/dev/null)"
[ -n "$NPF" ] && ls -la "$NPF/bin/fdk" 2>/dev/null || true
echo "--- shell rc (nvm lines only) ---"
for rc in "$HOME/.zshrc" "$HOME/.bashrc" "$HOME/.profile"; do
  [ -f "$rc" ] || continue
  echo "# $rc"
  grep -nE 'NVM_DIR|nvm\\.sh|nvm use|freshworks|fdk' "$rc" 2>/dev/null || echo "(no matching lines)"
done
echo "============================"
```

For interpretation of common failures, load **`references/error-command-not-found.md`**.

**Closeout:** `/fdk-setup-status` runs inline only. Do not spawn `fdk run`, tunnels, or watchers.

**Legacy alias:** **`/fdk-status`**.

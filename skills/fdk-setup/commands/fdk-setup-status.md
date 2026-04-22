---
name: fdk-setup-status
description: Check FDK and Node.js installation status (Confluence /fdk-setup status); optional --verbose diagnostics
always: true
argument-hint: "[--verbose]"
---

# FDK setup — status (`/fdk-setup-status`)

Confluence **`/fdk-setup status`**. Read-only; **no** shell Task.

## Behaviour

| User intent | Action |
|-------------|--------|
| `/fdk-setup-status` | Run the **default** block below (short summary). |
| `/fdk-setup-status --verbose` | Run **default** then the **verbose** block (PATH, nvm, npm prefix, shell hints). |

## Execution (default)

Run checks directly (no subagent):

```bash
echo "=== FDK Status ==="
fdk version 2>&1 || echo "Not installed"
node --version 2>&1 || echo "Not installed"
nvm --version 2>&1 || echo "Not installed"
command -v fdk || true
which fdk 2>/dev/null || true
[ -d ~/.fdk ] && echo "Cache: ~/.fdk exists" || echo "No ~/.fdk cache"
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

---
name: fdk-setup-downgrade
description: Downgrade FDK version (10.x → 10.0.y or 10.x → 9.x); deprecation warnings for 9.x
always: true
argument-hint: "[version|latest]"
---

# FDK setup — downgrade (`/fdk-setup-downgrade`)

**`/fdk-setup-downgrade`** supports:
1. **FDK 10.x → 10.0.y** (e.g., 10.1.0 → 10.0.1) on Node 24
2. **FDK 10.x → 9.x** (e.g., 10.x → 9.8.2) on Node 18 with deprecation notice

**DEPRECATION WARNING (FDK 9.x):** FDK 9.x + Node 18.x support ends May 30, 2026. Publishing to marketplace requires FDK 10.x + Node 24.x. See: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/

## Agent pre-step

Replace **`__FDK_DOWNGRADE_TARGET__`** in the Task prompt:

- **`latest`** — user did not pass a semver (use **`https://cdn.freshdev.io/fdk/latest.tgz`** FDK 9.x on Node 18).
- **`10.x.y`** — from **`/fdk-setup-downgrade 10.0.1`** (downgrade within FDK 10 line, stays on Node 24).
- **`9.x.y`** — from **`/fdk-setup-downgrade 9.6.0`**, **`--to 9.6.0`**, or natural language. Strip leading **`v`**.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK version (10.x → 10.0.y or 10.x → 9.x)",
  prompt: `
Downgrade FDK to a specific version.

TARGET_VER="__FDK_DOWNGRADE_TARGET__"
# Host must replace with: "latest" OR "9.6.0" OR "10.0.1" etc.

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Determine target major version
if [[ "$TARGET_VER" == latest ]] || [[ "$TARGET_VER" =~ ^9\\. ]]; then
  IS_NINE=1
  echo "========================================="
  echo "WARNING: FDK 9.x + Node 18.x DEPRECATED"
  echo "========================================="
  echo "Support ends: May 30, 2026"
  echo "Publishing requires FDK 10.x + Node 24.x"
  echo "Documentation: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/"
  echo ""
  read -p "Continue with FDK 9.x downgrade? (y/N): " confirm
  if [[ "$confirm" != [yY] ]]; then
    echo "Downgrade cancelled."
    exit 0
  fi
  NODE_VER="18.20"
else
  IS_NINE=0
  NODE_VER="24.11"
fi

if [[ "$TARGET_VER" == latest ]]; then
  FDK_URL="https://cdn.freshdev.io/fdk/latest.tgz"
else
  FDK_URL="https://cdn.freshdev.io/fdk/v${TARGET_VER}.tgz"
fi

HTTP=$(curl -sS -o /dev/null -w "%{http_code}" -L -I "$FDK_URL" || echo "000")
if [[ "$HTTP" != "200" ]]; then
  echo "========================================="
  echo "ERROR: FDK tarball not available"
  echo "========================================="
  echo "URL: $FDK_URL"
  echo "HTTP Status: $HTTP"
  echo ""
  if [[ "$TARGET_VER" =~ ^9\\. ]]; then
    echo "This FDK 9.x version may not be published to the CDN."
    echo "Try: /fdk-setup-downgrade (no version, uses latest 9.x)"
    echo "Or check https://cdn.freshdev.io/fdk/ for available versions"
  fi
  exit 1
fi

echo "Downgrading to FDK $TARGET_VER on Node $NODE_VER"

# Remove FDK from current Node
npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force

if [[ "$IS_NINE" == 1 ]]; then
  # Downgrading to FDK 9: remove FDK 10 from Node 24 (exclusive operation)
  if nvm list | grep -q "v24"; then
    echo "Removing FDK 10.x from Node 24 (exclusive downgrade to FDK 9)..."
    nvm use 24 2>/dev/null || nvm use 24.11 2>/dev/null || true
    npm uninstall -g @freshworks/fdk 2>/dev/null || true
    npm uninstall -g fdk 2>/dev/null || true
  fi
  
  nvm list | grep v18 || nvm install 18.20
  nvm use 18.20
  NODE_VER="18.20"
else
  # Downgrading within FDK 10 line: remove FDK 9 from Node 18 if exists
  if nvm list | grep -q "v18"; then
    echo "Removing FDK 9.x from Node 18 (staying on FDK 10 line)..."
    nvm use 18 2>/dev/null || nvm use 18.20 2>/dev/null || true
    npm uninstall -g @freshworks/fdk 2>/dev/null || true
    npm uninstall -g fdk 2>/dev/null || true
  fi
  
  nvm list | grep "v24\\.11" || nvm install 24.11
  nvm use 24.11
  NODE_VER="24.11"
fi
node --version

npm install -g "$FDK_URL" || exit 1

if [[ "$IS_NINE" == 1 ]]; then
  fdk version | grep -E '^9\\.' || { echo "FAILED: Not FDK 9.x"; exit 1; }
  
  # Get actual installed Node 18 version
  NODE_18_VER=$(nvm current)
  nvm alias default "$NODE_18_VER"
  
  echo "Downgrade complete: FDK 9.x on $NODE_18_VER (DEPRECATED)"
  echo ""
  echo "nvm alias default set to $NODE_18_VER — new terminals will use Node 18"
  echo "Current terminal: already on $NODE_18_VER"
else
  fdk version | grep -E '^10\\.' || { echo "FAILED: Not FDK 10.x"; exit 1; }
  nvm alias default 24.11
  echo "Downgrade complete: FDK 10.x on Node 24.11"
fi

MANDATORY VERIFICATION (auto-decline FDK upgrade prompts):
  printf 'n\n' | fdk version || echo "FAILED: FDK not in current shell"
  if [[ "$IS_NINE" == 1 ]]; then
    printf 'n\n' | fdk version | grep -q "Installed: 9\\." || echo "FAILED: Not FDK 9.x"
    node --version | grep -E '^v18\\.' || echo "FAILED: Not Node 18"
    nvm current | grep -E '^v18\\.' || echo "FAILED: nvm current is not Node 18"
  else
    printf 'n\n' | fdk version | grep -q "Installed: 10\\." || echo "FAILED: Not FDK 10.x"
    node --version | grep -E '^v24\\.11\\.' || echo "WARNING: Node 24.11.x recommended"
    nvm current | grep -E '^v24\\.' || echo "FAILED: nvm current is not Node 24"
  fi
  zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; printf "n\n" | fdk version' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; printf "n\n" | fdk version' || echo "FAILED: Not persistent"

REPORT:
  echo "FDK downgrade complete — URL: $FDK_URL"
  echo "Return to FDK 10: /fdk-setup-upgrade (latest or --to 10.x.y) or /fdk-setup-install"

SLASH_COMMAND_CLOSEOUT: Return after REPORT (or abort). No fdk run/tunnel in this Task.
  `
})
```

**Windows (nvm-windows + PowerShell):** Do not chain with **`&&`** on **PowerShell 5.1** — use separate lines or **`;`** / **`$LASTEXITCODE`** checks (see **`references/windows.md`**). To confirm the CLI on PATH, use **`where.exe fdk`** — **`where fdk`** is **`Where-Object`**, not a PATH search, and often looks “empty” even when **`fdk`** is installed.

**Legacy alias:** **`/fdk-downgrade`**.

---
name: fdk-setup-downgrade
description: Downgrade FDK version (10.x → 10.0.y or 10.x → 9.x); deprecation warnings for 9.x
always: true
argument-hint: "[version|latest]"
---

# FDK setup — downgrade (`/fdk-setup-downgrade`)

Confluence **`/fdk-setup-downgrade`** supports:
1. **FDK 10.x → 10.0.y** (e.g., 10.1.0 → 10.0.1) on Node 24
2. **FDK 10.x → 9.x** (e.g., 10.x → 9.8.2) on Node 18 with deprecation notice

**DEPRECATION WARNING (FDK 9.x):** FDK 9.x + Node 18.x support ends March 2026. Publishing to marketplace requires FDK 10.x + Node 24.x. See: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/

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
  echo "Support ends: March 2026"
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
[[ "$HTTP" == "200" ]] || { echo "FAILED: tarball not reachable (HTTP $HTTP): $FDK_URL"; exit 1; }

echo "Downgrading to FDK $TARGET_VER on Node $NODE_VER"

npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force

if [[ "$IS_NINE" == 1 ]]; then
  nvm list | grep v18 || nvm install 18
  nvm use 18
else
  nvm list | grep "v24\\.11" || nvm install 24.11
  nvm use 24.11
fi
node --version

npm install -g "$FDK_URL" || exit 1

if [[ "$IS_NINE" == 1 ]]; then
  fdk version | grep -E '^9\\.' || { echo "FAILED: Not FDK 9.x"; exit 1; }
  nvm alias default 18
  SHELL_RC="$HOME/.zshrc"
  [ -f "$HOME/.bashrc" ] && SHELL_RC="$HOME/.bashrc"
  if [ -f "$SHELL_RC" ]; then
    cp "$SHELL_RC" "$SHELL_RC.bak.fdk-downgrade.$(date +%Y%m%d_%H%M%S)"
    sed -i '/nvm use 24/d' "$SHELL_RC" 2>/dev/null || sed -i '' '/nvm use 24/d' "$SHELL_RC" 2>/dev/null || true
    echo "" >> "$SHELL_RC"
    echo "# FDK 9.x (Node 18) - DEPRECATED, ends March 2026" >> "$SHELL_RC"
    echo "nvm use 18 > /dev/null 2>&1" >> "$SHELL_RC"
  fi
  echo "Downgrade complete: FDK 9.x on Node 18 (DEPRECATED)"
else
  fdk version | grep -E '^10\\.' || { echo "FAILED: Not FDK 10.x"; exit 1; }
  nvm alias default 24.11
  echo "Downgrade complete: FDK 10.x on Node 24.11"
fi
fi

MANDATORY VERIFICATION:
  fdk version | grep -E '^9\\.' || echo "FAILED: Not FDK 9.x"
  node --version | grep -E '^v18\\.' || echo "FAILED: Not Node 18"
  zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 18 >/dev/null; fdk version' | grep -E '^9\\.' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 18 >/dev/null; fdk version' | grep -E '^9\\.' || echo "FAILED: Not persistent"
  [ ! -d ~/.fdk ] || echo "FAILED: ~/.fdk still exists"
  nvm current | grep -E '^v18\\.' || echo "FAILED: nvm current is not Node 18"

REPORT:
  echo "FDK downgrade complete — URL: $NINE_URL"
  echo "Return to FDK 10: /fdk-setup-upgrade (latest or --to 10.x.y) or /fdk-setup-migrate"

SLASH_COMMAND_CLOSEOUT: Return after REPORT (or abort). No fdk run/tunnel in this Task.
  `
})
```

**Windows (nvm-windows + PowerShell):** Do not chain with **`&&`** on **PowerShell 5.1** — use separate lines or **`;`** / **`$LASTEXITCODE`** checks (see **`references/windows.md`**). To confirm the CLI on PATH, use **`where.exe fdk`** — **`where fdk`** is **`Where-Object`**, not a PATH search, and often looks “empty” even when **`fdk`** is installed.

**Legacy alias:** **`/fdk-downgrade`**.

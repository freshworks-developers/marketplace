---
name: fdk-setup-downgrade
description: Downgrade FDK 10.x to 9.x with deprecation warnings (Confluence /fdk-setup downgrade); optional pinned 9.x.y
always: true
argument-hint: "[9.x.y|latest]"
---

# FDK setup — downgrade (`/fdk-setup-downgrade`)

Confluence **`/fdk-setup downgrade`** / **`/fdk-setup-downgrade 9.6.0`**. Same behaviour as legacy **`/fdk-downgrade`**, with optional **pinned FDK 9.x.y** via CDN **`v9.x.y.tgz`**.

**DEPRECATION WARNING:** FDK 9.x + Node 18.x support ends March 2026.

## Agent pre-step

Replace **`__FDK_DOWNGRADE_TARGET__`** in the Task prompt:

- **`latest`** — user did not pass a semver (use **`https://cdn.freshdev.io/fdk/latest.tgz`** on Node 18).
- **`9.x.y`** — from **`/fdk-setup-downgrade 9.6.0`**, **`--to 9.6.0`**, or natural language. Strip leading **`v`**.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK 10.x to 9.x (latest or pinned semver)",
  prompt: `
Downgrade from FDK 10.x (Node 24) to FDK 9.x (Node 18).

TARGET_9="__FDK_DOWNGRADE_TARGET__"
# Host must replace with: "latest" OR "9.6.0" etc.

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

DEPRECATION WARNING TO USER:
echo "========================================="
echo "WARNING: FDK 9.x + Node 18.x DEPRECATED"
echo "========================================="
echo "Support ends: March 2026 | Publishing requires FDK 10 + Node 24"
read -p "Continue with FDK 9.x downgrade? (y/N): " confirm
if [[ "$confirm" != [yY] ]]; then
  echo "Downgrade cancelled."
  exit 0
fi

if [[ "$TARGET_9" == latest ]]; then
  NINE_URL="https://cdn.freshdev.io/fdk/latest.tgz"
else
  NINE_URL="https://cdn.freshdev.io/fdk/v${TARGET_9}.tgz"
fi

HTTP=$(curl -sS -o /dev/null -w "%{http_code}" -L -I "$NINE_URL" || echo "000")
[[ "$HTTP" == "200" ]] || { echo "FAILED: tarball not reachable (HTTP $HTTP): $NINE_URL"; exit 1; }

nvm use 24 2>/dev/null || true
npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force

nvm list | grep v18 || nvm install 18
nvm use 18
node --version

npm install -g "$NINE_URL" || exit 1
fdk version | grep -E '^9\\.' || { echo "FAILED: Not FDK 9.x"; exit 1; }

nvm alias default 18
nvm alias fdk 18 2>/dev/null || true
SHELL_RC="$HOME/.zshrc"
[ -f "$HOME/.bashrc" ] && SHELL_RC="$HOME/.bashrc"
if [ -f "$SHELL_RC" ]; then
  cp "$SHELL_RC" "$SHELL_RC.bak.fdk-downgrade.$(date +%Y%m%d_%H%M%S)"
  sed -i '/nvm use 24/d' "$SHELL_RC" 2>/dev/null || sed -i '' '/nvm use 24/d' "$SHELL_RC" 2>/dev/null || true
  sed -i '/nvm use fdk/d' "$SHELL_RC" 2>/dev/null || sed -i '' '/nvm use fdk/d' "$SHELL_RC" 2>/dev/null || true
  echo "" >> "$SHELL_RC"
  echo "# FDK 9.x (Node 18) - DEPRECATED, ends March 2026" >> "$SHELL_RC"
  echo "nvm use 18 > /dev/null 2>&1" >> "$SHELL_RC"
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

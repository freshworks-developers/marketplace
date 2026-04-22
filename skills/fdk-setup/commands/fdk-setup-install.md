---
name: fdk-setup-install
description: Install FDK (10.x or 9.x) with Node.js via nvm; supports bare version (X.Y.Z) or --version flag
always: true
argument-hint: “[X.Y.Z|--version X.Y.Z]”
---

# FDK setup — install (`/fdk-setup-install`)

**`/fdk-setup install`**. Supports **FDK 10.x** (Node 24) and **FDK 9.x** (Node 18, deprecated).

## Behaviour

| User intent | `__FDK_INSTALL_VERSION__` | FDK tarball | Node |
|-------------|---------------------------|-------------|------|
| `/fdk-setup-install` (no args) | `latest` | `https://cdn.freshdev.io/fdk/latest-v24.tgz` | 24.11 |
| `/fdk-setup-install 10.1.0` | `10.1.0` | `https://cdn.freshdev.io/fdk/v10.1.0.tgz` | 24.11 |
| `/fdk-setup-install --version 10.1.0` | `10.1.0` | `https://cdn.freshdev.io/fdk/v10.1.0.tgz` | 24.11 |
| `/fdk-setup-install 9.8.2` | `9.8.2` | `https://cdn.freshdev.io/fdk/v9.8.2.tgz` | 18.20 |
| `/fdk-setup-install --version 9.8.2` | `9.8.2` | `https://cdn.freshdev.io/fdk/v9.8.2.tgz` | 18.20 |

**FDK 9.x deprecation:** Shows warning and requires user confirmation. Support ends March 2026. See: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/

## Agent pre-step

Parse version from:
- Bare version: `/fdk-setup-install 10.1.0` or `/fdk-setup-install 9.8.2`
- Flag syntax: `/fdk-setup-install --version 10.1.0`
- Default (no args): `latest` → FDK 10 line on Node 24

Replace **`__FDK_INSTALL_VERSION__`** with:
- **`latest`** — default FDK 10 line
- **`10.x.y`** — FDK 10 semver (strip leading `v`)
- **`9.x.y`** — FDK 9 semver (strip leading `v`); **SHOW DEPRECATION NOTICE**

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install FDK 10 with Node 24 (optional pinned semver)",
  prompt: `
Install FDK 10 with Node 24.11 using nvm + Freshworks CDN tarball only.

FDK_VER="__FDK_INSTALL_VERSION__"
# Host must replace token: "latest" OR "10.1.0" (FDK 10 semver only)

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# FDK 9.x deprecation notice
if [[ "$FDK_VER" =~ ^9\\. ]]; then
  echo "========================================="
  echo "WARNING: FDK 9.x + Node 18.x DEPRECATED"
  echo "========================================="
  echo "Support ends: March 2026"
  echo "Publishing to marketplace requires FDK 10.x + Node 24.x"
  echo "Documentation: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/"
  echo ""
  read -p "Continue installing FDK 9.x? (y/N): " confirm
  if [[ "$confirm" != [yY] ]]; then
    echo "Installation cancelled. Use /fdk-setup-install (no args) for FDK 10.x"
    exit 0
  fi
fi

if [[ "$FDK_VER" == latest ]]; then
  FDK_URL="https://cdn.freshdev.io/fdk/latest-v24.tgz"
  NODE_VER="24.11"
elif [[ "$FDK_VER" =~ ^9\\. ]]; then
  FDK_URL="https://cdn.freshdev.io/fdk/v${FDK_VER}.tgz"
  NODE_VER="18.20"
else
  FDK_URL="https://cdn.freshdev.io/fdk/v${FDK_VER}.tgz"
  NODE_VER="24.11"
fi

HTTP=$(curl -sS -o /dev/null -w "%{http_code}" -L -I "$FDK_URL" || echo "000")
[[ "$HTTP" == "200" ]] || { echo "FAILED: tarball not reachable (HTTP $HTTP): $FDK_URL"; exit 1; }

echo "OS: $(uname -s)"
echo "Installing from: $FDK_URL"

nvm install $NODE_VER 2>/dev/null || true
nvm use $NODE_VER
nvm alias default $NODE_VER

npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force

npm install -g "$FDK_URL" || exit 1

MANDATORY VERIFICATION (ALL TESTS MUST PASS, auto-decline FDK upgrade prompts):
  printf 'n\n' | fdk version || echo "FAILED: FDK not in current shell"
  if [[ "$FDK_VER" =~ ^9\\. ]]; then
    printf 'n\n' | fdk version | grep -E '^9\\.' || echo "FAILED: Wrong FDK major (expected 9.x)"
    node --version | grep "v18\\." || echo "FAILED: Node 18.x required for FDK 9.x"
  elif [[ "$FDK_VER" == latest ]] || [[ "$FDK_VER" =~ ^10\\. ]]; then
    printf 'n\n' | fdk version | grep -E '^10\\.' || echo "FAILED: Wrong FDK major (expected 10.x)"
    node --version | grep "v24\\.11\\." || echo "WARNING: Node 24.11.x recommended for FDK 10.x"
  fi
  zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; printf "n\n" | fdk version' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; printf "n\n" | fdk version' || echo "FAILED: FDK not persistent"
  nvm current | grep "24" || echo "FAILED: nvm not using Node 24"
  npm list -g fdk 2>&1 | grep "empty" || npm list -g fdk || echo "INFO: legacy fdk package check"
  npm list -g @freshworks/fdk --depth=0 | grep "@freshworks/fdk@10" || echo "FAILED: @freshworks/fdk@10 not installed"

REPORT FORMAT:
  [VALID] FDK installed successfully
  Tarball: $FDK_URL
  FDK version: $(printf 'n\n' | fdk version 2>&1)
  Node version: $(node --version 2>&1)

CRITICAL: If ANY mandatory test fails, do not say "installation complete".

SLASH_COMMAND_CLOSEOUT: After verification and final REPORT (or abort), return from this shell Task immediately. Do not start fdk run, fdk tunnel, tail -f, watchers, or dev servers from this Task.
  `
})
```

**Legacy alias:** **`/fdk-install`**.

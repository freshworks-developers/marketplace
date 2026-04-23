---
name: fdk-setup-install
description: Install FDK (10.x or 9.x) with Node.js via nvm; supports bare version (X.Y.Z) or --version flag; use --both to install both FDK 10.x + FDK 9.x stacks
always: true
argument-hint: “[X.Y.Z|--version X.Y.Z|--both]”
---

# FDK setup — install (`/fdk-setup-install`)

**`/fdk-setup install`**. Supports **FDK 10.x** (Node 24), **FDK 9.x** (Node 18, deprecated), and **both stacks** simultaneously.

## Behaviour

| User intent | `__FDK_INSTALL_VERSION__` | FDK tarball | Node |
|-------------|---------------------------|-------------|------|
| `/fdk-setup-install` (no args) | `latest` | `https://cdn.freshdev.io/fdk/latest-v24.tgz` | 24.11 |
| `/fdk-setup-install 10.1.0` | `10.1.0` | `https://cdn.freshdev.io/fdk/v10.1.0.tgz` | 24.11 |
| `/fdk-setup-install --version 10.1.0` | `10.1.0` | `https://cdn.freshdev.io/fdk/v10.1.0.tgz` | 24.11 |
| `/fdk-setup-install 9.8.2` | `9.8.2` | `https://cdn.freshdev.io/fdk/v9.8.2.tgz` | 18.20 |
| `/fdk-setup-install --version 9.8.2` | `9.8.2` | `https://cdn.freshdev.io/fdk/v9.8.2.tgz` | 18.20 |
| `/fdk-setup-install --both` | `both` | Both latest-v24.tgz + latest 9.x | 24.11 + 18.20 |

**FDK 9.x deprecation:** Shows warning and requires user confirmation. Support ends May 30, 2026. See: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/

**`--both` flag:** Installs both latest FDK 10.x on Node 24.11 AND latest FDK 9.x on Node 18.20 in one command. Sets `nvm alias default 24.11` (FDK 10.x as primary).

## Agent pre-step

Parse version from:
- Bare version: `/fdk-setup-install 10.1.0` or `/fdk-setup-install 9.8.2`
- Flag syntax: `/fdk-setup-install --version 10.1.0`
- Both stacks: `/fdk-setup-install --both`
- Default (no args): `latest` → FDK 10.x line on Node 24

Replace **`__FDK_INSTALL_VERSION__`** with:
- **`latest`** — latest FDK 10.x (default)
- **`10.x.y`** — specific FDK 10.x semver (strip leading `v`)
- **`9.x.y`** — specific FDK 9.x semver (strip leading `v`); **SHOW DEPRECATION NOTICE**
- **`both`** — install both latest FDK 10.x on Node 24.11 AND latest FDK 9.x on Node 18.20

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install FDK with Node (supports single or both stacks)",
  prompt: `
Install FDK with Node.js using nvm + Freshworks CDN tarball.

FDK_VER="__FDK_INSTALL_VERSION__"
# Host must replace token: "latest" OR "10.1.0" OR "9.8.2" OR "both"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# --both flag: install both stacks (skip existing)
if [[ "$FDK_VER" == "both" ]]; then
  echo "========================================="
  echo "INSTALLING BOTH FDK STACKS"
  echo "========================================="
  echo "Stack 1: Latest FDK 10.x on Node 24.11 (primary)"
  echo "Stack 2: Latest FDK 9.x on Node 18.20 (deprecated, expires May 30, 2026)"
  echo ""
  
  # Check existing installations
  HAS_FDK_10=0
  HAS_FDK_9=0
  
  if nvm list | grep -q "v24"; then
    nvm use 24.11 2>/dev/null || nvm use 24 2>/dev/null || true
    if command -v fdk >/dev/null 2>&1; then
      FDK_VER_CHECK=$(fdk version 2>&1 | grep -m 1 -oE '[0-9]+\.[0-9]+\.[0-9]+')
      if [[ "$FDK_VER_CHECK" =~ ^10\\. ]]; then
        HAS_FDK_10=1
        echo "✓ FDK 10.x already installed on Node 24 (skipping)"
      fi
    fi
  fi
  
  if nvm list | grep -q "v18"; then
    nvm use 18.20 2>/dev/null || nvm use 18 2>/dev/null || true
    if command -v fdk >/dev/null 2>&1; then
      FDK_VER_CHECK=$(fdk version 2>&1 | grep -m 1 -oE '[0-9]+\.[0-9]+\.[0-9]+')
      if [[ "$FDK_VER_CHECK" =~ ^9\\. ]]; then
        HAS_FDK_9=1
        echo "✓ FDK 9.x already installed on Node 18 (skipping)"
      fi
    fi
  fi
  
  if [[ $HAS_FDK_10 -eq 1 ]] && [[ $HAS_FDK_9 -eq 1 ]]; then
    echo ""
    echo "Both stacks already installed. Nothing to do."
    nvm use 24.11 2>/dev/null || nvm use 24 2>/dev/null
    nvm alias default 24.11 2>/dev/null || nvm alias default 24 2>/dev/null
    exit 0
  fi
  
  read -p "Continue? (y/N): " confirm
  if [[ "$confirm" != [yY] ]]; then
    echo "Installation cancelled."
    exit 0
  fi
  
  # Install Stack 1 (latest FDK 10.x) if missing
  if [[ $HAS_FDK_10 -eq 0 ]]; then
    echo ""
    echo "=== Installing Stack 1: Latest FDK 10.x on Node 24.11 ==="
    nvm install 24.11 2>/dev/null || true
    nvm use 24.11
    npm uninstall -g @freshworks/fdk 2>/dev/null || true
    npm uninstall -g fdk 2>/dev/null || true
    npm cache clean --force
    npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz || exit 1
    
    FDK_10_VER=$(fdk version 2>&1 | grep -m 1 -oE '[0-9]+\.[0-9]+\.[0-9]+')
    NODE_24_VER=$(node --version)
    echo "✓ Installed FDK $FDK_10_VER on $NODE_24_VER"
  fi
  
  # Install Stack 2 (latest FDK 9.x) if missing
  if [[ $HAS_FDK_9 -eq 0 ]]; then
    echo ""
    echo "=== Installing Stack 2: Latest FDK 9.x on Node 18.20 ==="
    nvm install 18.20 2>/dev/null || true
    nvm use 18.20
    npm uninstall -g @freshworks/fdk 2>/dev/null || true
    npm uninstall -g fdk 2>/dev/null || true
    npm cache clean --force
    npm install -g https://cdn.freshdev.io/fdk/latest.tgz || exit 1
    
    FDK_9_VER=$(fdk version 2>&1 | grep -m 1 -oE '[0-9]+\.[0-9]+\.[0-9]+')
    NODE_18_VER=$(node --version)
    echo "✓ Installed FDK $FDK_9_VER on $NODE_18_VER"
  fi
  
  # Set primary to Node 24
  nvm use 24.11 2>/dev/null || nvm use 24 2>/dev/null
  nvm alias default 24.11 2>/dev/null || nvm alias default 24 2>/dev/null
  
  echo ""
  echo "========================================="
  echo "BOTH STACKS READY"
  echo "========================================="
  echo "Primary (current): Node 24.11 + FDK 10.x"
  echo "Secondary: Node 18.20 + FDK 9.x"
  echo ""
  echo "Switch stacks:"
  echo "  /fdk-setup-use 10  → Node 24 + FDK 10.x"
  echo "  /fdk-setup-use 9   → Node 18 + FDK 9.x"
  echo ""
  echo "Verify:"
  echo "  node --version && fdk version"
  
  exit 0
fi

# Single stack installation (existing logic)
if [[ "$FDK_VER" =~ ^9\\. ]]; then
  echo "========================================="
  echo "WARNING: FDK 9.x + Node 18.x DEPRECATED"
  echo "========================================="
  echo "Support ends: May 30, 2026"
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

MANDATORY VERIFICATION (ALL TESTS MUST PASS):
  fdk version || echo "FAILED: FDK not in current shell"
  if [[ "$FDK_VER" =~ ^9\\. ]]; then
    fdk version | grep -E '^9\\.' || echo "FAILED: Wrong FDK major (expected 9.x)"
    node --version | grep "v18\\." || echo "FAILED: Node 18.x required for FDK 9.x"
  elif [[ "$FDK_VER" == latest ]] || [[ "$FDK_VER" =~ ^10\\. ]]; then
    fdk version | grep -E '^10\\.' || echo "FAILED: Wrong FDK major (expected 10.x)"
    node --version | grep "v24\\.11\\." || echo "WARNING: Node 24.11.x recommended for FDK 10.x"
  fi
  zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; fdk version' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; fdk version' || echo "FAILED: FDK not persistent"
  nvm current | grep "24" || echo "FAILED: nvm not using Node 24"
  npm list -g fdk 2>&1 | grep "empty" || npm list -g fdk || echo "INFO: legacy fdk package check"
  npm list -g @freshworks/fdk --depth=0 | grep "@freshworks/fdk@10" || echo "FAILED: @freshworks/fdk@10 not installed"

REPORT FORMAT:
  [VALID] FDK installed successfully
  Tarball: $FDK_URL
  FDK version: $(fdk version 2>&1)
  Node version: $(node --version 2>&1)

CRITICAL: If ANY mandatory test fails, do not say "installation complete".

SLASH_COMMAND_CLOSEOUT: After verification and final REPORT (or abort), return from this shell Task immediately. Do not start fdk run, fdk tunnel, tail -f, watchers, or dev servers from this Task.
  `
})
```

**Legacy alias:** **`/fdk-install`**.

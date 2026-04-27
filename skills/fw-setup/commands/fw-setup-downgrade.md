---
name: fw-setup-downgrade
description: Downgrade FDK version (10.x → 10.0.y or 10.x → 9.x); deprecation warnings for 9.x
always: true
argument-hint: "[version|latest]"
---

# FDK setup — downgrade (`/fw-setup-downgrade`)

**`/fw-setup-downgrade`** supports:
1. **FDK 10.x → 10.0.y** (e.g., 10.1.0 → 10.0.1) on Node 24
2. **FDK 10.x → 9.x** (e.g., 10.x → 9.8.2) on Node 18 with deprecation notice

**DEPRECATION WARNING (FDK 9.x):** FDK 9.x + Node 18.x support ends May 30, 2026. Publishing to marketplace requires FDK 10.x + Node 24.x. See: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/

## Agent pre-step

Replace **`__FDK_DOWNGRADE_TARGET__`** in the Task prompt:

- **`latest`** — user did not pass a semver (use **`https://cdn.freshdev.io/fdk/latest.tgz`** FDK 9.x on Node 18).
- **`10.x.y`** — from **`/fw-setup-downgrade 10.0.1`** (downgrade within FDK 10.x line, stays on Node 24).
- **`9.x.y`** — from **`/fw-setup-downgrade 9.6.0`**, **`--to 9.6.0`**, or natural language. Strip leading **`v`**.

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
    echo "Try: /fw-setup-downgrade (no version, uses latest 9.x)"
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
  # Downgrading to FDK 9.x: remove FDK 10.x from Node 24 (exclusive operation)
  if nvm list | grep -q "v24"; then
    echo "Removing FDK 10.x from Node 24 (exclusive downgrade to FDK 9.x)..."
    nvm use 24 2>/dev/null || nvm use 24.11 2>/dev/null || true
    npm uninstall -g @freshworks/fdk 2>/dev/null || true
    npm uninstall -g fdk 2>/dev/null || true
  fi
  
  nvm list | grep v18 || nvm install 18.20
  nvm use 18.20
  NODE_VER="18.20"
else
  # Downgrading within FDK 10.x line: remove FDK 9.x from Node 18 if exists
  if nvm list | grep -q "v18"; then
    echo "Removing FDK 9.x from Node 18 (staying on FDK 10.x line)..."
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
  echo "Return to FDK 10.x: /fw-setup-upgrade (latest or --to 10.x.y) or /fw-setup-install"

SLASH_COMMAND_CLOSEOUT: Return after REPORT (or abort). No fdk run/tunnel in this Task.
  `
})
```

**Windows (nvm-windows + PowerShell):** 

The bash script above is for Unix systems. For Windows PowerShell, use this PowerShell-native implementation:

```powershell
Task({
  subagent_type: “shell”,
  model: “fast”,
  description: “Downgrade FDK version (10.x → 10.0.y or 10.x → 9.x) - Windows”,
  prompt: `
Downgrade FDK to a specific version on Windows.

$TARGET_VER = “__FDK_DOWNGRADE_TARGET__”
# Host must replace with: “latest” OR “9.6.0” OR “10.0.1” etc.

# Determine target major version
$IS_NINE = $false
if ($TARGET_VER -eq “latest” -or $TARGET_VER -match “^9\.”) {
  $IS_NINE = $true
  Write-Host “=========================================” -ForegroundColor Yellow
  Write-Host “WARNING: FDK 9.x + Node 18.x DEPRECATED” -ForegroundColor Yellow
  Write-Host “=========================================” -ForegroundColor Yellow
  Write-Host “Support ends: May 30, 2026”
  Write-Host “Publishing requires FDK 10.x + Node 24.x”
  Write-Host “Documentation: https://developers.freshworks.com/docs/app-sdk/v3/freshworks-app-sdk/”
  Write-Host “”
  $confirm = Read-Host “Continue with FDK 9.x downgrade? (y/N)”
  if ($confirm -ne “y” -and $confirm -ne “Y”) {
    Write-Host “Downgrade cancelled.”
    exit 0
  }
  $NODE_VER = “18.20”
} else {
  $IS_NINE = $false
  $NODE_VER = “24.11”
}

if ($TARGET_VER -eq “latest”) {
  $FDK_URL = “https://cdn.freshdev.io/fdk/latest.tgz”
} else {
  $FDK_URL = “https://cdn.freshdev.io/fdk/v$TARGET_VER.tgz”
}

# Check if tarball exists
try {
  $response = Invoke-WebRequest -Uri $FDK_URL -Method Head -UseBasicParsing -ErrorAction Stop
  $HTTP = $response.StatusCode
} catch {
  $HTTP = “000”
}

if ($HTTP -ne 200) {
  Write-Host “=========================================” -ForegroundColor Red
  Write-Host “ERROR: FDK tarball not available” -ForegroundColor Red
  Write-Host “=========================================” -ForegroundColor Red
  Write-Host “URL: $FDK_URL”
  Write-Host “HTTP Status: $HTTP”
  Write-Host “”
  if ($TARGET_VER -match “^9\.”) {
    Write-Host “This FDK 9.x version may not be published to the CDN.”
    Write-Host “Try: /fw-setup-downgrade (no version, uses latest 9.x)”
    Write-Host “Or check https://cdn.freshdev.io/fdk/ for available versions”
  } elseif ($TARGET_VER -match “^10\.0\.”) {
    Write-Host “Downgrade to FDK 10.0.y is supported (stays on Node 24.11).”
    Write-Host “Verify the version exists at: https://cdn.freshdev.io/fdk/”
  }
  exit 1
}

Write-Host “Downgrading to FDK $TARGET_VER on Node $NODE_VER” -ForegroundColor Green

# Remove FDK from current Node
npm uninstall -g @freshworks/fdk 2>$null
npm uninstall -g fdk 2>$null
if (Test-Path “$env:USERPROFILE\.fdk”) {
  Remove-Item -Recurse -Force “$env:USERPROFILE\.fdk”
}
npm cache clean --force

if ($IS_NINE) {
  # Downgrading to FDK 9.x: remove FDK 10.x from Node 24 (exclusive operation)
  $nvmList = nvm list
  if ($nvmList -match “24”) {
    Write-Host “Removing FDK 10.x from Node 24 (exclusive downgrade to FDK 9.x)...”
    nvm use 24 2>$null
    npm uninstall -g @freshworks/fdk 2>$null
    npm uninstall -g fdk 2>$null
  }
  
  if (-not ($nvmList -match “18”)) {
    nvm install 18.20
  }
  nvm use 18.20
  $NODE_VER = “18.20”
} else {
  # Downgrading within FDK 10.x line: remove FDK 9.x from Node 18 if exists
  $nvmList = nvm list
  if ($nvmList -match “18”) {
    Write-Host “Removing FDK 9.x from Node 18 (staying on FDK 10.x line)...”
    nvm use 18 2>$null
    npm uninstall -g @freshworks/fdk 2>$null
    npm uninstall -g fdk 2>$null
  }
  
  if (-not ($nvmList -match “24\.11”)) {
    nvm install 24.11
  }
  nvm use 24.11
  $NODE_VER = “24.11”
}

node --version

npm install -g “$FDK_URL”
if ($LASTEXITCODE -ne 0) {
  Write-Host “ERROR: npm install failed” -ForegroundColor Red
  exit 1
}

# Refresh PATH in current PowerShell session (Windows-specific)
# This ensures 'fdk' command is immediately available after npm install
Write-Host “Refreshing PATH in current session...” -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable(“Path”,”Machine”) + “;” + [System.Environment]::GetEnvironmentVariable(“Path”,”User”)

# Verify installation
$fdkVer = fdk version 2>&1 | Out-String
if ($IS_NINE) {
  if ($fdkVer -notmatch “9\.”) {
    Write-Host “FAILED: Not FDK 9.x” -ForegroundColor Red
    exit 1
  }
  
  # Set nvm default to Node 18
  $currentNode = nvm current
  nvm alias default $currentNode
  
  Write-Host “Downgrade complete: FDK 9.x on $currentNode (DEPRECATED)” -ForegroundColor Green
  Write-Host “”
  Write-Host “nvm alias default set to $currentNode — new terminals will use Node 18”
  Write-Host “Current terminal: already on $currentNode”
} else {
  if ($fdkVer -notmatch “10\.”) {
    Write-Host “FAILED: Not FDK 10.x” -ForegroundColor Red
    exit 1
  }
  nvm alias default 24.11
  Write-Host “Downgrade complete: FDK 10.x on Node 24.11” -ForegroundColor Green
}

# MANDATORY VERIFICATION
Write-Host “`nVerification:” -ForegroundColor Cyan

# Check PATH first (use where.exe, NOT where - where is alias for Where-Object)
$fdkPath = where.exe fdk 2>$null
if ($fdkPath) {
  Write-Host “✓ FDK found in PATH: $fdkPath” -ForegroundColor Green
} else {
  Write-Host “⚠ WARNING: FDK not found in PATH (try closing and reopening terminal)” -ForegroundColor Yellow
}

fdk version
if ($IS_NINE) {
  if ((fdk version 2>&1 | Out-String) -notmatch “9\.”) {
    Write-Host “FAILED: Not FDK 9.x” -ForegroundColor Red
  }
  if ((node --version) -notmatch “v18\.”) {
    Write-Host “FAILED: Not Node 18” -ForegroundColor Red
  }
} else {
  if ((fdk version 2>&1 | Out-String) -notmatch “10\.”) {
    Write-Host “FAILED: Not FDK 10.x” -ForegroundColor Red
  }
  if ((node --version) -notmatch “v24\.11\.”) {
    Write-Host “WARNING: Node 24.11.x recommended” -ForegroundColor Yellow
  }
}

# REPORT
Write-Host “`nFDK downgrade complete — URL: $FDK_URL” -ForegroundColor Green
Write-Host “Return to FDK 10.x: /fw-setup-upgrade (latest or --to 10.x.y) or /fw-setup-install”

# SLASH_COMMAND_CLOSEOUT: Return after REPORT
  `
})
```

**Key differences from Unix version:**
- Uses PowerShell-native syntax (`$VAR`, `-match`, `if/else`, `2>$null`)
- Uses `Invoke-WebRequest` instead of `curl` for HTTP checks
- Uses `Test-Path` and `Remove-Item` for file operations
- No `&&` chaining (not supported in PowerShell 5.1)
- Uses `where.exe fdk` for PATH verification (not `where fdk`)

**Legacy alias:** **`/fw-setup-downgrade`**.

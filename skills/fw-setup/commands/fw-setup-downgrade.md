---
name: fw-setup-downgrade
description: Downgrade FDK version (10.x → 10.0.y or 10.x → 9.x) with step-by-step progress
always: true
argument-hint: "[version|latest]"
---

# FDK setup — downgrade (`/fw-setup-downgrade`)

**`/fw-setup-downgrade`** supports:
1. **FDK 10.x → 10.0.y** (e.g., 10.1.0 → 10.0.1) on Node 24
2. **FDK 10.x → 9.x** (e.g., 10.x → 9.8.2) on Node 18 with deprecation notice

**DEPRECATION WARNING (FDK 9.x):** FDK 9.x + Node 18.x support ends May 31, 2026. Publishing to marketplace requires FDK 10.x + Node 24.x.

## Agent pre-step

If the user gave no version argument (bare `/fw-setup-downgrade` with no semver), set `__FDK_DOWNGRADE_TARGET__` to `latest` — do not ask the developer for a target version.

Replace **`__FDK_DOWNGRADE_TARGET__`** in the Task prompts:

- **`latest`** — user did not pass a semver (use latest FDK 9.x on Node 18)
- **`10.x.y`** — from **`/fw-setup-downgrade 10.0.1`** (downgrade within FDK 10.x line, stays on Node 24)
- **`9.x.y`** — from **`/fw-setup-downgrade 9.6.0`** or **`--to 9.6.0`**. Strip leading **`v`**.

## Execution

### macOS/Linux (Bash/Zsh) - Single-step execution

**Note:** This version is tested and working on macOS/Linux. Terminal output is cleaner on Unix systems, so a single-step approach works well.

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK version (10.x → 10.0.y or 10.x → 9.x)",
  prompt: `
Downgrade FDK to a specific version - auto-detects installation method (nvm, Homebrew, Chocolatey).

TARGET_VER="__FDK_DOWNGRADE_TARGET__"
# Host must replace with: "latest" OR "9.6.0" OR "10.0.1" etc.

# Detect installation method
detect_install_method() {
  if command -v brew >/dev/null 2>&1 && brew list fdk >/dev/null 2>&1; then
    echo "homebrew"
  elif command -v choco >/dev/null 2>&1 && choco list --local-only fdk 2>/dev/null | grep -q "^fdk"; then
    echo "chocolatey"
  elif [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "nvm"
  elif command -v nvm >/dev/null 2>&1 && [[ "$OSTYPE" =~ ^(msys|win32|cygwin) ]]; then
    echo "nvm-windows"
  else
    echo "npm-global"
  fi
}

INSTALL_METHOD=$(detect_install_method)
echo "Installation method: $INSTALL_METHOD"

# Load nvm if available
if [[ "$INSTALL_METHOD" == "nvm" ]]; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi

# Determine target major version
if [[ "$TARGET_VER" == latest ]] || [[ "$TARGET_VER" =~ ^9\\. ]]; then
  IS_NINE=1
  echo "========================================="
  echo "WARNING: FDK 9.x + Node 18.x DEPRECATED"
  echo "========================================="
  echo "Support ends: May 31, 2026"
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

echo "Downgrading to FDK $TARGET_VER"

# Handle Homebrew (system-wide, no multi-version support)
if [[ "$INSTALL_METHOD" == "homebrew" ]]; then
  if [[ "$IS_NINE" == 1 ]]; then
    echo "ERROR: Homebrew does not support FDK 9.x downgrade"
    echo "FDK 9.x is deprecated. Use brew to stay on FDK 10.x or switch to nvm for multi-version support"
    exit 1
  fi
  
  echo "Downgrading FDK via Homebrew (system-wide)..."
  brew uninstall fdk 2>/dev/null || true
  
  if [[ "$TARGET_VER" == latest ]]; then
    brew install fdk || exit 1
  else
    # Homebrew doesn't easily support pinned versions via formula
    echo "WARNING: Homebrew may not support specific FDK 10.0.y versions"
    echo "Attempting install from CDN tarball..."
    npm install -g "$FDK_URL" || exit 1
  fi
  
  fdk version
  echo "Downgrade complete (Homebrew/system-wide)"
  exit 0
fi

# Handle Chocolatey (system-wide, no multi-version support)
if [[ "$INSTALL_METHOD" == "chocolatey" ]]; then
  echo "Downgrading FDK via Chocolatey (system-wide)..."
  choco uninstall fdk -y 2>/dev/null || true
  
  if [[ "$TARGET_VER" == latest ]]; then
    if [[ "$IS_NINE" == 1 ]]; then
      echo "WARNING: FDK 9.x deprecated (ends May 31, 2026)"
      # Chocolatey latest may be FDK 10.x; explicitly request 9.x if available
      choco install fdk --version=9.8.2 -y || exit 1
    else
      choco install fdk -y || exit 1
    fi
  else
    if [[ "$IS_NINE" == 1 ]]; then
      echo "WARNING: FDK 9.x deprecated (ends May 31, 2026)"
    fi
    choco install fdk --version=$TARGET_VER -y || exit 1
  fi
  
  refreshenv 2>/dev/null || true
  fdk version
  echo "Downgrade complete (Chocolatey/system-wide)"
  exit 0
fi

# For nvm/nvm-windows/npm-global: multi-version support via npm install
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
  printf 'n\\n' | fdk version || echo "FAILED: FDK not in current shell"
  if [[ "$IS_NINE" == 1 ]]; then
    printf 'n\\n' | fdk version | grep -q "Installed: 9\\." || echo "FAILED: Not FDK 9.x"
    node --version | grep -E '^v18\\.' || echo "FAILED: Not Node 18"
    nvm current | grep -E '^v18\\.' || echo "FAILED: nvm current is not Node 18"
  else
    printf 'n\\n' | fdk version | grep -q "Installed: 10\\." || echo "FAILED: Not FDK 10.x"
    node --version | grep -E '^v24\\.11\\.' || echo "WARNING: Node 24.11.x recommended"
    nvm current | grep -E '^v24\\.' || echo "FAILED: nvm current is not Node 24"
  fi
  zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; printf "n\\n" | fdk version' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use $NODE_VER >/dev/null; printf "n\\n" | fdk version' || echo "FAILED: Not persistent"

REPORT:
  echo "FDK downgrade complete — URL: $FDK_URL"
  echo "Return to FDK 10.x: /fw-setup-upgrade (latest or --to 10.x.y) or /fw-setup-install"

SLASH_COMMAND_CLOSEOUT: Return after REPORT (or abort). No fdk run/tunnel in this Task.
  `
})
```

### Windows PowerShell - Step-by-step execution (NEW)

**Note:** Concurrent runs of these steps **from different terminals** reuse `%TEMP%\fdk_downgrade_*` filenames and may collide—serialize downgrades per machine until state files migrate to isolated directories.

### Step 1: Pre-flight checks

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "FDK Downgrade - Step 1: Pre-flight checks",
  prompt: `
$ErrorActionPreference = 'Stop'
$TARGET_VER = "__FDK_DOWNGRADE_TARGET__"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  FDK DOWNGRADE - Step 1/5" -ForegroundColor Cyan
Write-Host "  Pre-flight checks" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Determine target major version
$IS_NINE = ($TARGET_VER -eq "latest" -or $TARGET_VER -match "^9\\.")
if ($IS_NINE) {
  $NODE_VER = "18.20"
  Write-Host "⚠  WARNING: FDK 9.x + Node 18.x DEPRECATED" -ForegroundColor Yellow
  Write-Host "   Support ends: May 31, 2026" -ForegroundColor Yellow
  Write-Host "   Publishing requires FDK 10.x + Node 24.x" -ForegroundColor Yellow
  Write-Host ""
  
  # Note: User confirmation should be handled by agent before executing this step
  # Agent should check if user explicitly requested FDK 9.x downgrade
  Write-Host "Proceeding with FDK 9.x downgrade (deprecated)..." -ForegroundColor Yellow
} else {
  $NODE_VER = "24.11"
}

# Build FDK URL
if ($TARGET_VER -eq "latest") {
  $FDK_URL = "https://cdn.freshdev.io/fdk/latest.tgz"
} else {
  $FDK_URL = "https://cdn.freshdev.io/fdk/v$TARGET_VER.tgz"
}

# Verify tarball exists
Write-Host "Checking tarball availability..." -ForegroundColor Gray
try {
  $response = Invoke-WebRequest -Uri $FDK_URL -Method Head -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
  $HTTP = $response.StatusCode
} catch {
  $HTTP = 0
}

if ($HTTP -ne 200) {
  Write-Host ""
  Write-Host "❌ ERROR: FDK tarball not available" -ForegroundColor Red
  Write-Host "   URL: $FDK_URL" -ForegroundColor Red
  Write-Host "   HTTP Status: $HTTP" -ForegroundColor Red
  exit 1
}

Write-Host "✓ Tarball verified" -ForegroundColor Green
Write-Host ""
Write-Host "Target: FDK $TARGET_VER on Node $NODE_VER" -ForegroundColor Cyan
Write-Host ""

# Save state for next steps
$IS_NINE | Out-File -FilePath "$env:TEMP\fdk_downgrade_is_nine.txt" -Encoding ASCII
$NODE_VER | Out-File -FilePath "$env:TEMP\fdk_downgrade_node_ver.txt" -Encoding ASCII
$FDK_URL | Out-File -FilePath "$env:TEMP\fdk_downgrade_url.txt" -Encoding ASCII

Write-Host "✅ Step 1/5 complete" -ForegroundColor Green
Write-Host ""
  `
})
```

### Step 2: Cleanup existing installations

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "FDK Downgrade - Step 2: Cleanup",
  prompt: `
$ErrorActionPreference = 'Stop'

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  FDK DOWNGRADE - Step 2/5" -ForegroundColor Cyan
Write-Host "  Cleanup existing installations" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load state
$IS_NINE = [bool]::Parse((Get-Content "$env:TEMP\fdk_downgrade_is_nine.txt"))

Write-Host "Removing FDK from current Node..." -ForegroundColor Gray
npm uninstall -g @freshworks/fdk 2>$null | Out-Null
npm uninstall -g fdk 2>$null | Out-Null

if (Test-Path "$env:USERPROFILE\.fdk") {
  Write-Host "Removing ~/.fdk directory..." -ForegroundColor Gray
  Remove-Item -Recurse -Force "$env:USERPROFILE\.fdk"
}

Write-Host "Cleaning npm cache..." -ForegroundColor Gray
npm cache clean --force 2>&1 | Out-Null

Write-Host "✓ Current installation removed" -ForegroundColor Green
Write-Host ""

# Clean up other Node versions for exclusive downgrade
$nvmList = nvm list

if ($IS_NINE) {
  # Downgrading to 9.x: remove from Node 24
  if ($nvmList -match "24") {
    Write-Host "Removing FDK 10.x from Node 24..." -ForegroundColor Gray
    nvm use 24 2>$null | Out-Null
    npm uninstall -g @freshworks/fdk 2>$null | Out-Null
    npm uninstall -g fdk 2>$null | Out-Null
    Write-Host "✓ Removed from Node 24" -ForegroundColor Green
  }
} else {
  # Staying on 10.x: remove from Node 18
  if ($nvmList -match "18") {
    Write-Host "Removing FDK 9.x from Node 18..." -ForegroundColor Gray
    nvm use 18 2>$null | Out-Null
    npm uninstall -g @freshworks/fdk 2>$null | Out-Null
    npm uninstall -g fdk 2>$null | Out-Null
    Write-Host "✓ Removed from Node 18" -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "✅ Step 2/5 complete" -ForegroundColor Green
Write-Host ""
  `
})
```

### Step 3: Switch Node version

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "FDK Downgrade - Step 3: Switch Node",
  prompt: `
$ErrorActionPreference = 'Stop'

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  FDK DOWNGRADE - Step 3/5" -ForegroundColor Cyan
Write-Host "  Switch Node version" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load state
$IS_NINE = [bool]::Parse((Get-Content "$env:TEMP\fdk_downgrade_is_nine.txt"))
$NODE_VER = Get-Content "$env:TEMP\fdk_downgrade_node_ver.txt"

$nvmList = nvm list

if ($IS_NINE) {
  if (-not ($nvmList -match "18")) {
    Write-Host "Installing Node 18.20..." -ForegroundColor Gray
    nvm install 18.20
  } else {
    Write-Host "Node 18 already installed" -ForegroundColor Gray
  }
  Write-Host "Switching to Node 18.20..." -ForegroundColor Gray
  nvm use 18.20
} else {
  if (-not ($nvmList -match "24\\.11")) {
    Write-Host "Installing Node 24.11..." -ForegroundColor Gray
    nvm install 24.11
  } else {
    Write-Host "Node 24.11 already installed" -ForegroundColor Gray
  }
  Write-Host "Switching to Node 24.11..." -ForegroundColor Gray
  nvm use 24.11
}

$currentNode = node --version
Write-Host "✓ Now using: $currentNode" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Step 3/5 complete" -ForegroundColor Green
Write-Host ""
  `
})
```

### Step 4: Install FDK (warnings suppressed)

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "FDK Downgrade - Step 4: Install FDK",
  prompt: `
$ErrorActionPreference = 'Stop'

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  FDK DOWNGRADE - Step 4/5" -ForegroundColor Cyan
Write-Host "  Install FDK" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load state
$FDK_URL = Get-Content "$env:TEMP\fdk_downgrade_url.txt"

Write-Host "Installing FDK from:" -ForegroundColor Gray
Write-Host "  $FDK_URL" -ForegroundColor Gray
Write-Host ""
Write-Host "This may take 1-2 minutes..." -ForegroundColor Gray
Write-Host "(npm deprecation warnings are suppressed)" -ForegroundColor Gray
Write-Host ""

# Install with output filtering - only show critical errors
$npmOutput = npm install -g "$FDK_URL" --loglevel=error 2>&1
$npmExit = $LASTEXITCODE

# Only show actual errors, not deprecation warnings
$errors = $npmOutput | Where-Object { 
  $_ -match "ERR!" -or $_ -match "ERROR:" -or $_ -match "ENOENT" -or $_ -match "EACCES" -or $_ -match "EPERM"
}

if ($errors) {
  $errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
}

if ($npmExit -ne 0) {
  Write-Host ""
  Write-Host "❌ npm install failed (exit code: $npmExit)" -ForegroundColor Red
  exit 1
}

Write-Host "✓ FDK installation complete" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Step 4/5 complete" -ForegroundColor Green
Write-Host ""
  `
})
```

### Step 5: Verify and finalize

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "FDK Downgrade - Step 5: Verify",
  prompt: `
$ErrorActionPreference = 'Continue'

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  FDK DOWNGRADE - Step 5/5" -ForegroundColor Cyan
Write-Host "  Verification" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Load state
$IS_NINE = [bool]::Parse((Get-Content "$env:TEMP\fdk_downgrade_is_nine.txt"))
$NODE_VER = Get-Content "$env:TEMP\fdk_downgrade_node_ver.txt"
$FDK_URL = Get-Content "$env:TEMP\fdk_downgrade_url.txt"

# Refresh PATH
Write-Host "Refreshing PATH..." -ForegroundColor Gray
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")


# Quick version checks (suppress fdk upgrade prompt with 'n')
Write-Host ""
$fdkVerRaw = ("n" | fdk version 2>&1 | Out-String)
$fdkVer = ($fdkVerRaw | Select-String -Pattern "Installed:\s*(\S+)").Matches.Groups[1].Value
$nodeVer = node --version 2>&1
$nvmCur = (nvm current 2>&1).ToString().Trim()

# Validate expected versions
$fail = $false
if ($IS_NINE) {
  if ($fdkVer -match "^9\\.") {
    Write-Host "✓ FDK $fdkVer verified" -ForegroundColor Green
  } else {
    Write-Host "❌ Expected FDK 9.x, got: $fdkVer" -ForegroundColor Red
    $fail = $true
  }
  
  if ($nodeVer -match "^v18\\.") {
    Write-Host "✓ Node $nodeVer verified" -ForegroundColor Green
  } else {
    Write-Host "❌ Expected Node 18.x, got: $nodeVer" -ForegroundColor Red
    $fail = $true
  }
  
  # Set nvm default (with version to avoid help dump)
  if (-not $fail) {
    $nvmVerClean = $nvmCur -replace 'v',''
    nvm alias default $nvmVerClean 2>&1 | Out-Null
    Write-Host "✓ nvm alias default → $nvmVerClean" -ForegroundColor Green
  }
  
} else {
  if ($fdkVer -match "^10\\.") {
    Write-Host "✓ FDK $fdkVer verified" -ForegroundColor Green
  } else {
    Write-Host "❌ Expected FDK 10.x, got: $fdkVer" -ForegroundColor Red
    $fail = $true
  }
  
  if ($nodeVer -match "^v24\\.") {
    Write-Host "✓ Node $nodeVer verified" -ForegroundColor Green
  } else {
    Write-Host "⚠  Expected Node 24.11.x, got: $nodeVer" -ForegroundColor Yellow
  }
  
  # Set nvm default
  if (-not $fail) {
    nvm alias default 24.11 2>&1 | Out-Null
    Write-Host "✓ nvm alias default → 24.11" -ForegroundColor Green
  }
}

# Quick PATH check
if (where.exe fdk 2>$null) {
  Write-Host "✓ FDK in PATH" -ForegroundColor Green
}

# Cleanup temp files
Remove-Item "$env:TEMP\fdk_downgrade_is_nine.txt" -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\fdk_downgrade_node_ver.txt" -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\fdk_downgrade_url.txt" -ErrorAction SilentlyContinue

# Final report
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
if ($fail) {
  Write-Host "⚠  Downgrade completed with warnings" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Run /fw-setup-status for details" -ForegroundColor Yellow
} else {
  Write-Host "✅ DOWNGRADE COMPLETE!" -ForegroundColor Green
  Write-Host ""
  if ($IS_NINE) {
    Write-Host "FDK 9.x on Node 18" -ForegroundColor Cyan
    Write-Host "(DEPRECATED - ends May 31, 2026)" -ForegroundColor Yellow
  } else {
    Write-Host "FDK 10.x on Node 24.11" -ForegroundColor Cyan
  }
}
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source: $FDK_URL" -ForegroundColor Gray
if ($IS_NINE) {
  Write-Host ""
  Write-Host "To return to FDK 10.x:" -ForegroundColor Gray
  Write-Host "  /fw-setup-upgrade" -ForegroundColor Gray
  Write-Host "  /fw-setup-install" -ForegroundColor Gray
}
Write-Host ""
  `
})
```

## Key improvements

**Step-by-step approach:**
- **5 independent steps** - each can be debugged separately
- **Clear progress indicators** - user knows exactly where they are
- **State persistence** - temp files pass data between steps
- **No hanging** - each step completes quickly
- **Visual feedback** - ✓, ❌, ⚠ with color coding

**Output management:**
- **Suppressed npm warnings** - only critical errors shown
- **Clean UI** - boxed sections, clear headings
- **Progress tracking** - "Step X/5" throughout

**Error handling:**
- **Better isolation** - if step fails, you know which one
- **Graceful degradation** - warnings vs hard failures
- **Recovery guidance** - suggests next steps

## Key improvements (Windows only)

**Why step-by-step for Windows:**
- Addresses PowerShell's verbose output and ANSI escape sequences
- Prevents hanging during long npm installs
- Provides clear progress feedback
- Easier debugging when steps fail

**Step-by-step approach:**
- **5 independent steps** - each can be debugged separately
- **Clear progress indicators** - user knows exactly where they are (Step X/5)
- **State persistence** - temp files pass data between steps
- **No hanging** - each step completes quickly
- **Visual feedback** - ✓, ❌, ⚠ with color coding

**Output management:**
- **Suppressed npm warnings** - only critical errors shown in Step 4
- **Clean UI** - boxed sections, clear headings
- **Progress tracking** - "Step X/5" throughout

**Windows-specific fixes:**
- **`where.exe fdk`** not `where fdk` (PowerShell alias issue)
- **No `&&` chaining** (PowerShell 5.1 incompatible)
- **Proper PATH refresh** - merges Machine + User paths
- **Temp file cleanup** - no state leakage
- **Single backslashes** in file paths (not double)

**macOS/Linux approach:**
- Single-step execution works well (cleaner terminal output)
- No ANSI escape sequence issues
- Less verbose npm output
- Tested and working on remote

**Legacy alias:** `/fdk-downgrade`

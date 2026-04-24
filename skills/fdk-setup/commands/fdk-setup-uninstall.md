---
name: fdk-setup-uninstall
description: Uninstall FDK completely — keeps Node.js and nvm (/fdk-setup uninstall)
always: true
---

# FDK setup — uninstall (`/fdk-setup-uninstall`)

**`/fdk-setup uninstall`**: removes **FDK and `~/.fdk` cache` only** — **Node.js and nvm stay installed**. There is **no** **`uninstall --all`** in this skill (no automated removal of nvm / all Node versions).

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Uninstall FDK completely",
  prompt: `
Completely remove FDK from ALL Node versions and all artifacts.

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null || true

DETECTION:
  echo "=== Current FDK Status ==="
  fdk version 2>/dev/null || echo "Not installed on current Node"
  ls ~/.fdk 2>/dev/null || echo "No ~/.fdk cache"
  
  # Check if FDK exists on multiple Node versions
  echo ""
  echo "=== Checking all Node versions for FDK ==="
  if command -v nvm >/dev/null 2>&1; then
    CURRENT_NODE=$(nvm current 2>/dev/null || echo "none")
    
    # Check Node 24 if it exists
    if nvm list 2>/dev/null | grep -q "v24"; then
      echo "Checking Node 24..."
      nvm use 24 2>/dev/null || nvm use 24.11 2>/dev/null || true
      if command -v fdk >/dev/null 2>&1; then
        FDK_24=$(fdk version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        echo "  → FDK $FDK_24 found on Node 24"
      else
        echo "  → No FDK on Node 24"
      fi
    fi
    
    # Check Node 18 if it exists
    if nvm list 2>/dev/null | grep -q "v18"; then
      echo "Checking Node 18..."
      nvm use 18 2>/dev/null || nvm use 18.20 2>/dev/null || true
      if command -v fdk >/dev/null 2>&1; then
        FDK_18=$(fdk version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        echo "  → FDK $FDK_18 found on Node 18"
      else
        echo "  → No FDK on Node 18"
      fi
    fi
    
    # Restore original Node version
    if [[ "$CURRENT_NODE" != "none" ]]; then
      nvm use "$CURRENT_NODE" 2>/dev/null || true
    fi
  fi

COMPLETE REMOVAL FROM ALL NODE VERSIONS:
  echo ""
  echo "=== Removing FDK from all Node versions ==="
  
  # Remove from current Node first
  echo "Removing from current Node..."
  npm uninstall -g @freshworks/fdk 2>/dev/null || true
  npm uninstall -g fdk 2>/dev/null || true
  npm uninstall -g @freshworks/fdk --force 2>/dev/null || true
  
  # If nvm is available, remove from other Node versions
  if command -v nvm >/dev/null 2>&1; then
    CURRENT_NODE=$(nvm current 2>/dev/null || echo "none")
    
    # Remove from Node 24 if it exists
    if nvm list 2>/dev/null | grep -q "v24"; then
      echo "Removing from Node 24..."
      nvm use 24 2>/dev/null || nvm use 24.11 2>/dev/null || true
      npm uninstall -g @freshworks/fdk 2>/dev/null || true
      npm uninstall -g fdk 2>/dev/null || true
      npm uninstall -g @freshworks/fdk --force 2>/dev/null || true
    fi
    
    # Remove from Node 18 if it exists
    if nvm list 2>/dev/null | grep -q "v18"; then
      echo "Removing from Node 18..."
      nvm use 18 2>/dev/null || nvm use 18.20 2>/dev/null || true
      npm uninstall -g @freshworks/fdk 2>/dev/null || true
      npm uninstall -g fdk 2>/dev/null || true
      npm uninstall -g @freshworks/fdk --force 2>/dev/null || true
    fi
    
    # Restore original Node version
    if [[ "$CURRENT_NODE" != "none" ]] && [[ "$CURRENT_NODE" != "system" ]]; then
      nvm use "$CURRENT_NODE" 2>/dev/null || true
    fi
  fi
  
  # Remove ~/.fdk cache (shared across all Node versions)
  echo "Removing ~/.fdk cache..."
  rm -rf ~/.fdk
  
  # Clean npm cache
  echo "Cleaning npm cache..."
  npm cache clean --force

MANUAL CLEANUP (if npm fails):
  echo "Manual cleanup (if needed)..."
  NPM_PREFIX=$(npm config get prefix 2>/dev/null || echo "$HOME/.npm-global")
  rm -f "$NPM_PREFIX/bin/fdk" 2>/dev/null || true
  rm -rf "$NPM_PREFIX/lib/node_modules/@freshworks/fdk" 2>/dev/null || true
  rm -rf "$NPM_PREFIX/lib/node_modules/fdk" 2>/dev/null || true

SHELL CONFIG CLEANUP:
  echo "Cleaning shell config..."
  cp ~/.zshrc ~/.zshrc.bak 2>/dev/null || true
  cp ~/.bashrc ~/.bashrc.bak 2>/dev/null || true
  sed -i '/fdk/d' ~/.zshrc 2>/dev/null || sed -i '' '/fdk/d' ~/.zshrc 2>/dev/null || true
  sed -i '/fdk/d' ~/.bashrc 2>/dev/null || sed -i '' '/fdk/d' ~/.bashrc 2>/dev/null || true

MANDATORY VERIFICATION:
  echo ""
  echo "=== Verification ==="
  command -v fdk && echo "⚠ FAILED: FDK still exists on current Node" || echo "✓ PASSED: FDK removed from current Node"
  zsh -c 'command -v fdk' 2>/dev/null && echo "⚠ FAILED: FDK in new shell" || echo "✓ PASSED: FDK not in new shell"
  [ ! -d ~/.fdk ] && echo "✓ PASSED: ~/.fdk removed" || echo "⚠ FAILED: ~/.fdk still exists"
  
  # Verify on all Node versions
  if command -v nvm >/dev/null 2>&1; then
    if nvm list 2>/dev/null | grep -q "v24"; then
      nvm use 24 2>/dev/null || nvm use 24.11 2>/dev/null || true
      command -v fdk >/dev/null 2>&1 && echo "⚠ WARNING: FDK still on Node 24" || echo "✓ PASSED: FDK removed from Node 24"
    fi
    if nvm list 2>/dev/null | grep -q "v18"; then
      nvm use 18 2>/dev/null || nvm use 18.20 2>/dev/null || true
      command -v fdk >/dev/null 2>&1 && echo "⚠ WARNING: FDK still on Node 18" || echo "✓ PASSED: FDK removed from Node 18"
    fi
  fi

REPORT FORMAT:
  echo ""
  echo "========================================="
  echo "FDK uninstalled completely from all Node versions"
  echo "Node.js and nvm preserved"
  echo "========================================="

SLASH_COMMAND_CLOSEOUT: After verification and REPORT (or abort), return from this shell Task immediately.
  `
})
```

**Windows (PowerShell):**

For Windows users with nvm-windows, use this PowerShell-native implementation:

```powershell
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Uninstall FDK completely - Windows",
  prompt: `
Completely remove FDK from ALL Node versions and all artifacts on Windows.

Write-Host "=== Current FDK Status ===" -ForegroundColor Cyan
try { fdk version } catch { Write-Host "Not installed on current Node" }
if (Test-Path "$env:USERPROFILE\.fdk") {
  Write-Host "~/.fdk cache exists"
} else {
  Write-Host "No ~/.fdk cache"
}

# Check if FDK exists on multiple Node versions
Write-Host ""
Write-Host "=== Checking all Node versions for FDK ===" -ForegroundColor Cyan
if (Get-Command nvm -ErrorAction SilentlyContinue) {
  $currentNode = nvm current 2>$null
  
  # Check Node 24 if it exists
  $nvmList = nvm list
  if ($nvmList -match "24") {
    Write-Host "Checking Node 24..."
    nvm use 24 2>$null
    if (Get-Command fdk -ErrorAction SilentlyContinue) {
      $fdk24 = (fdk version 2>&1 | Out-String) -replace '.*?(\d+\.\d+\.\d+).*','$1'
      Write-Host "  → FDK $fdk24 found on Node 24"
    } else {
      Write-Host "  → No FDK on Node 24"
    }
  }
  
  # Check Node 18 if it exists
  if ($nvmList -match "18") {
    Write-Host "Checking Node 18..."
    nvm use 18 2>$null
    if (Get-Command fdk -ErrorAction SilentlyContinue) {
      $fdk18 = (fdk version 2>&1 | Out-String) -replace '.*?(\d+\.\d+\.\d+).*','$1'
      Write-Host "  → FDK $fdk18 found on Node 18"
    } else {
      Write-Host "  → No FDK on Node 18"
    }
  }
  
  # Restore original Node version
  if ($currentNode -and $currentNode -ne "none") {
    nvm use $currentNode 2>$null
  }
}

# COMPLETE REMOVAL FROM ALL NODE VERSIONS
Write-Host ""
Write-Host "=== Removing FDK from all Node versions ===" -ForegroundColor Cyan

# Remove from current Node first
Write-Host "Removing from current Node..."
npm uninstall -g @freshworks/fdk 2>$null
npm uninstall -g fdk 2>$null
npm uninstall -g @freshworks/fdk --force 2>$null

# If nvm is available, remove from other Node versions
if (Get-Command nvm -ErrorAction SilentlyContinue) {
  $currentNode = nvm current 2>$null
  $nvmList = nvm list
  
  # Remove from Node 24 if it exists
  if ($nvmList -match "24") {
    Write-Host "Removing from Node 24..."
    nvm use 24 2>$null
    npm uninstall -g @freshworks/fdk 2>$null
    npm uninstall -g fdk 2>$null
    npm uninstall -g @freshworks/fdk --force 2>$null
  }
  
  # Remove from Node 18 if it exists
  if ($nvmList -match "18") {
    Write-Host "Removing from Node 18..."
    nvm use 18 2>$null
    npm uninstall -g @freshworks/fdk 2>$null
    npm uninstall -g fdk 2>$null
    npm uninstall -g @freshworks/fdk --force 2>$null
  }
  
  # Restore original Node version
  if ($currentNode -and $currentNode -ne "none" -and $currentNode -ne "system") {
    nvm use $currentNode 2>$null
  }
}

# Remove ~/.fdk cache (shared across all Node versions)
Write-Host "Removing ~/.fdk cache..."
if (Test-Path "$env:USERPROFILE\.fdk") {
  Remove-Item -Recurse -Force "$env:USERPROFILE\.fdk"
}

# Clean npm cache
Write-Host "Cleaning npm cache..."
npm cache clean --force

# MANUAL CLEANUP (if npm fails)
Write-Host "Manual cleanup (if needed)..."
$npmPrefix = npm config get prefix 2>$null
if ($npmPrefix) {
  if (Test-Path "$npmPrefix\fdk.cmd") { Remove-Item "$npmPrefix\fdk.cmd" -Force 2>$null }
  if (Test-Path "$npmPrefix\fdk") { Remove-Item "$npmPrefix\fdk" -Force 2>$null }
  if (Test-Path "$npmPrefix\node_modules\@freshworks\fdk") {
    Remove-Item -Recurse -Force "$npmPrefix\node_modules\@freshworks\fdk" 2>$null
  }
  if (Test-Path "$npmPrefix\node_modules\fdk") {
    Remove-Item -Recurse -Force "$npmPrefix\node_modules\fdk" 2>$null
  }
}

# MANDATORY VERIFICATION
Write-Host ""
Write-Host "=== Verification ===" -ForegroundColor Cyan
if (Get-Command fdk -ErrorAction SilentlyContinue) {
  Write-Host "⚠ FAILED: FDK still exists on current Node" -ForegroundColor Yellow
} else {
  Write-Host "✓ PASSED: FDK removed from current Node" -ForegroundColor Green
}

if (-not (Test-Path "$env:USERPROFILE\.fdk")) {
  Write-Host "✓ PASSED: ~/.fdk removed" -ForegroundColor Green
} else {
  Write-Host "⚠ FAILED: ~/.fdk still exists" -ForegroundColor Yellow
}

# Verify on all Node versions
if (Get-Command nvm -ErrorAction SilentlyContinue) {
  $nvmList = nvm list
  if ($nvmList -match "24") {
    nvm use 24 2>$null
    if (Get-Command fdk -ErrorAction SilentlyContinue) {
      Write-Host "⚠ WARNING: FDK still on Node 24" -ForegroundColor Yellow
    } else {
      Write-Host "✓ PASSED: FDK removed from Node 24" -ForegroundColor Green
    }
  }
  if ($nvmList -match "18") {
    nvm use 18 2>$null
    if (Get-Command fdk -ErrorAction SilentlyContinue) {
      Write-Host "⚠ WARNING: FDK still on Node 18" -ForegroundColor Yellow
    } else {
      Write-Host "✓ PASSED: FDK removed from Node 18" -ForegroundColor Green
    }
  }
}

# REPORT
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "FDK uninstalled completely from all Node versions" -ForegroundColor Green
Write-Host "Node.js and nvm preserved" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
  `
})
```

**Legacy alias:** **`/fdk-uninstall`**.

<# 
  fw-setup-use (Windows / nvm-windows)

  Why this exists:
  - nvm-windows updates a single system-wide symlink when you run `nvm use`, which makes
    "workspace-only" switches look like they changed the global default (issue b).
  - Many Windows shells keep a stale PATH after installs/switches, so `fdk` appears missing
    until PATH is refreshed (issue a).

  Behavior:
  - Default (no -GlobalDefault): DO NOT run `nvm use`. Instead, prepend the selected Node's
    folder to PATH for this PowerShell session only (and refresh PATH from Machine+User).
  - With -GlobalDefault: run `nvm use` (persists via nvm-windows symlink semantics) and also
    `nvm alias default` when available.

  Usage (from repo root):
    pwsh -NoProfile -ExecutionPolicy Bypass -File skills/fw-setup/scripts/fw-setup-use.ps1 `
      -WorkDir . -Stack 10

    pwsh -NoProfile -ExecutionPolicy Bypass -File skills/fw-setup/scripts/fw-setup-use.ps1 `
      -WorkDir . -Stack auto -WriteNvmrc

    pwsh -NoProfile -ExecutionPolicy Bypass -File skills/fw-setup/scripts/fw-setup-use.ps1 `
      -WorkDir . -Stack 10 -GlobalDefault
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)]
  [string]$WorkDir = ".",

  # auto | 10 | 9 | 24.11 | 18 (case-insensitive)
  [Parameter(Mandatory = $true)]
  [string]$Stack,

  [switch]$WriteNvmrc,

  # Persist selection for new shells (runs `nvm use` + best-effort `nvm alias default`)
  [switch]$GlobalDefault
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-InstallMethod {
  # Check Chocolatey first (Windows-specific)
  if (Get-Command choco -ErrorAction SilentlyContinue) {
    $chocoList = choco list --local-only fdk 2>$null | Out-String
    if ($chocoList -match "^fdk") {
      return "chocolatey"
    }
  }
  
  # Check Homebrew (rare on Windows but possible via WSL)
  if (Get-Command brew -ErrorAction SilentlyContinue) {
    $brewList = brew list fdk 2>$null | Out-String
    if ($brewList) {
      return "homebrew"
    }
  }
  
  # Check nvm-windows (most common on Windows)
  $nvmCandidates = @()
  if ($env:NVM_HOME) { $nvmCandidates += $env:NVM_HOME }
  $nvmCandidates += "C:\\ProgramData\\nvm"
  if ($env:APPDATA) { $nvmCandidates += (Join-Path $env:APPDATA "nvm") }
  
  foreach ($candidate in $nvmCandidates) {
    if (Test-Path -LiteralPath (Join-Path $candidate "nvm.exe")) {
      return "nvm-windows"
    }
  }
  
  return "unknown"
}

function Refresh-WindowsPath {
  $machine = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
  $user = [System.Environment]::GetEnvironmentVariable("Path", "User")
  if ([string]::IsNullOrWhiteSpace($machine)) { $machine = "" }
  if ([string]::IsNullOrWhiteSpace($user)) { $user = "" }
  $env:Path = "$machine;$user"
}

function Get-NvmRoot {
  $candidates = @()
  if ($env:NVM_HOME) { $candidates += $env:NVM_HOME }

  # Typical install locations
  $candidates += "C:\\ProgramData\\nvm"
  if ($env:APPDATA) {
    $candidates += (Join-Path $env:APPDATA "nvm")
  }

  foreach ($c in $candidates) {
    if ([string]::IsNullOrWhiteSpace($c)) { continue }
    if (Test-Path -LiteralPath $c) {
      return (Resolve-Path -LiteralPath $c).Path
    }
  }

  throw "nvm-windows root not found. Expected NVM_HOME (or a standard install path). Install nvm-windows, then retry."
}

function Normalize-RequestedVersion([string]$raw) {
  $t = $raw.Trim()
  if ($t -eq "") { throw "Empty .nvmrc / version token." }

  # allow bare majors
  if ($t -eq "10") { return "24.11" }
  if ($t -eq "9") { return "18" }

  return $t
}

function Resolve-InstalledVersionFolder([string]$nvmRoot, [string]$requested) {
  # Prefer exact folder names under NVM_HOME: v24.11.0, v18.20.8, etc.
  if (-not (Test-Path -LiteralPath $nvmRoot)) { throw "NVM root does not exist: $nvmRoot" }

  $dirs = Get-ChildItem -LiteralPath $nvmRoot -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^v\d+\.\d+\.\d+$' } |
    ForEach-Object { $_.FullName }

  if (-not $dirs -or $dirs.Count -eq 0) {
    throw "No installed Node versions found under: $nvmRoot (expected folders like v24.11.0)."
  }

  # Exact match on folder prefix: requested 24.11 -> v24.11.*
  $req = $requested.Trim()
  if ($req -match '^\d+$') {
    # major-only fallback
    $major = [int]$req
    $match = $dirs | Where-Object { $_ -match "\\v$major\.\d+\.\d+$" } | Sort-Object { $_ } -Descending | Select-Object -First 1
    if ($match) { return $match }
  }

  if ($req -match '^\d+\.\d+$') {
    $esc = [regex]::Escape($req)
    $match = $dirs | Where-Object { $_ -match "\\v$esc\.\d+$" } | Sort-Object { $_ } -Descending | Select-Object -First 1
    if ($match) { return $match }
  }

  if ($req -match '^\d+\.\d+\.\d+$') {
    $esc = [regex]::Escape($req)
    $match = $dirs | Where-Object { $_ -match "\\v$esc$" } | Select-Object -First 1
    if ($match) { return $match }
  }

  throw "Could not resolve an installed Node folder for requested '$requested' under $nvmRoot. Run: nvm install $requested"
}

function Ensure-NvmExeOnPath([string]$nvmRoot) {
  $nvmExe = Join-Path $nvmRoot "nvm.exe"
  if (-not (Test-Path -LiteralPath $nvmExe)) {
    # Some installs expose `nvm` on PATH without nvm.exe in NVM_HOME; best effort.
    return
  }

  $nvmBin = $nvmRoot.TrimEnd("\\")
  if ($env:Path -notlike "*$nvmBin*") {
    $env:Path = "$nvmBin;$env:Path"
  }
}

function Invoke-NvmExe {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments,

    [switch]$AllowNonZeroExit
  )

  $nvmRoot = Get-NvmRoot
  Ensure-NvmExeOnPath $nvmRoot
  $nvmExe = Join-Path $nvmRoot "nvm.exe"
  if (-not (Test-Path -LiteralPath $nvmExe)) {
    throw "nvm.exe not found at: $nvmExe (is nvm-windows installed correctly?)"
  }

  & $nvmExe @Arguments
  if ($LASTEXITCODE -ne 0 -and -not $AllowNonZeroExit) {
    throw "nvm.exe failed ($LASTEXITCODE): nvm.exe $($Arguments -join ' ')"
  }
}

Refresh-WindowsPath

$INSTALL_METHOD = Get-InstallMethod
Write-Host "Installation method: $INSTALL_METHOD" -ForegroundColor Cyan

# Handle Chocolatey/Homebrew (system-wide only, no version switching)
if ($INSTALL_METHOD -eq "chocolatey" -or $INSTALL_METHOD -eq "homebrew") {
  if ($GlobalDefault) {
    Write-Host "✓ Already global ($INSTALL_METHOD installs are system-wide)" -ForegroundColor Green
  } else {
    Write-Host "⚠ $INSTALL_METHOD installations are system-wide; no per-session switching available" -ForegroundColor Yellow
  }
  
  Write-Host "`n=== workspace use (windows - $INSTALL_METHOD) ==="
  Write-Host ("PWD=" + (Get-Location).Path)
  
  try {
    $nodeVer = (& node.exe --version 2>&1 | Out-String).Trim()
    Write-Host ("node: " + $nodeVer)
  } catch {
    Write-Host ("node: ERROR " + $_.Exception.Message)
  }
  
  try {
    $fdkCmd = Get-Command fdk -ErrorAction SilentlyContinue
    if ($fdkCmd) {
      $fdkOut = (& fdk version 2>&1 | Out-String).Trim()
      Write-Host ("fdk: " + $fdkOut)
    } else {
      Write-Host "fdk: MISSING (install via $INSTALL_METHOD)"
    }
  } catch {
    Write-Host ("fdk: ERROR " + $_.Exception.Message)
  }
  
  Write-Host "================================"
  exit 0
}

# Only nvm-windows from here on
if ($INSTALL_METHOD -ne "nvm-windows") {
  throw "Unknown installation method: $INSTALL_METHOD (expected nvm-windows, chocolatey, or homebrew)"
}

$resolvedWork = if ([System.IO.Path]::IsPathRooted($WorkDir)) {
  $WorkDir
} else {
  (Resolve-Path -LiteralPath $WorkDir).Path
}
Set-Location -LiteralPath $resolvedWork

$requested = ""
if ($Stack -ieq "auto") {
  $nvmrc = Join-Path $resolvedWork ".nvmrc"
  if (-not (Test-Path -LiteralPath $nvmrc)) {
    throw "STACK=auto but .nvmrc not found in: $resolvedWork"
  }
  $requested = Normalize-RequestedVersion (Get-Content -LiteralPath $nvmrc -Raw)
} else {
  $requested = Normalize-RequestedVersion $Stack
}

if ($WriteNvmrc) {
  $line = if ($requested -eq "24.11") { "24.11" } elseif ($requested -eq "18") { "18" } else { $requested }
  Set-Content -LiteralPath (Join-Path $resolvedWork ".nvmrc") -Value $line -NoNewline
}

$nvmRoot = Get-NvmRoot
Ensure-NvmExeOnPath $nvmRoot

# Ensure requested line exists (no-op if already installed)
Invoke-NvmExe @("install", $requested) -AllowNonZeroExit

if ($GlobalDefault) {
  try {
    Invoke-NvmExe @("use", $requested)
  } catch {
    throw
  }
  try {
    Invoke-NvmExe @("alias", "default", $requested)
  } catch {
    # `alias` may be unavailable depending on nvm-windows version; `use` still persisted selection.
  }
  Refresh-WindowsPath
} else {
  # Session-only: avoid `nvm use` side effects on the global symlink.
  Refresh-WindowsPath
  $nodeHome = Resolve-InstalledVersionFolder $nvmRoot $requested
  $nodeExeDir = $nodeHome
  if (Test-Path -LiteralPath (Join-Path $nodeHome "node.exe")) {
    $nodeExeDir = $nodeHome
  } elseif (Test-Path -LiteralPath (Join-Path (Join-Path $nodeHome "bin") "node.exe")) {
    $nodeExeDir = Join-Path $nodeHome "bin"
  } else {
    throw "Could not find node.exe under: $nodeHome (expected node.exe in version root or in bin\\)"
  }

  if ($env:Path -notlike "*$nodeExeDir*") {
    $env:Path = "$nodeExeDir;$env:Path"
  }
}

Write-Host "=== workspace use (windows) ==="
Write-Host ("PWD=" + (Get-Location).Path)

try {
  $nodeVer = (& node.exe --version 2>&1 | Out-String).Trim()
  Write-Host ("node: " + $nodeVer)
} catch {
  Write-Host ("node: ERROR " + $_.Exception.Message)
}

try {
  $fdkCmd = Get-Command fdk -ErrorAction SilentlyContinue
  if ($fdkCmd) {
    $fdkOut = (& fdk version 2>&1 | Out-String).Trim()
    Write-Host ("fdk: " + $fdkOut)
  } else {
    Write-Host "fdk: MISSING on this Node prefix"
    Write-Host "Hint: run /fw-setup-install (FDK 10.x) or /fw-setup-downgrade (FDK 9.x) after Node is correct."
  }
} catch {
  Write-Host ("fdk: ERROR " + $_.Exception.Message)
}

Write-Host "================================"

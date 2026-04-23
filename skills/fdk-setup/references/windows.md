# FDK Setup — Windows

## Prerequisites

- **nvm-windows** — Recommended for managing Node.js versions
- **Node.js v24.11.x** — Recommended line for **FDK 10.x** + `latest-v24.tgz` (same single source of truth as `SKILL.md`; avoid bare `24` if it drifts to non-24.11 builds)
- **PowerShell** — Run as Administrator for installation

## PowerShell: `&&`, PATH, and finding `fdk`

### `&&` is not valid in Windows PowerShell 5.1

**Windows PowerShell 5.1** (the default shell on many Windows Server / older desktops) does **not** support **`&&`** as a command separator. You will see:

`The token '&&' is not a valid statement separator in this version.`

**Use one of these instead:**

1. **Separate lines** (simplest):

```powershell
nvm use 18
npm install -g "https://cdn.freshdev.io/fdk/v9.7.4.tgz"
```

2. **Semicolon** (runs the next command even if the first failed — only use when safe):

```powershell
nvm use 18; npm install -g "https://cdn.freshdev.io/fdk/v9.7.4.tgz"
```

3. **Conditional** (recommended when you need “only if nvm succeeded”):

```powershell
nvm use 18
if ($LASTEXITCODE -ne 0) { throw "nvm use 18 failed" }
npm install -g "https://cdn.freshdev.io/fdk/v9.7.4.tgz"
```

4. **PowerShell 7+** — **`&&`** is supported there; upgrade PowerShell or use **Windows Terminal** with PS 7 if you want bash-like chaining.

### Do not use `where fdk` in PowerShell

In PowerShell, **`where`** is an alias for **`Where-Object`**, not the **`where.exe`** program from `System32`. **`where fdk`** will usually **not** list the FDK binary and looks like “no path / not installed” even when **`fdk`** works.

**Always use:**

```powershell
where.exe fdk
# or
Get-Command fdk -All
```

### “FDK installed” in a script but your terminal still cannot find `fdk`

1. Run **`nvm use 18`** (or **`24`**) in **this same window** so the active Node matches where **`npm install -g`** put the CLI.
2. **Refresh PATH** in the current session (nvm-windows updates user/machine PATH; some hosts need a reload):

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

3. Re-check with **`where.exe fdk`** and **`Get-Command npm`**.
4. **Open a new PowerShell window** after installs if the symlink under the nvm Node folder was just created.

### CDN tarball names (avoid guesswork)

| Stack | Typical tarball (verify HTTP 200 before scripting) |
|-------|------------------------------------------------------|
| FDK **10** + Node **24** | `https://cdn.freshdev.io/fdk/latest-v24.tgz` or pinned `https://cdn.freshdev.io/fdk/v10.x.y.tgz` |
| FDK **9** + Node **18** | `https://cdn.freshdev.io/fdk/latest.tgz` or pinned `https://cdn.freshdev.io/fdk/v9.x.y.tgz` |

Do **not** assume names like **`latest-v18.tgz`** unless Freshworks documentation or an HTTP check confirms they exist for your session.

## Step 1: Install nvm-windows

**Download and Install:**

1. Download the latest installer from [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)
2. Run `nvm-setup.exe` as Administrator
3. Follow the installation wizard

**Or via Chocolatey:**
```powershell
# Run as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
choco install nvm
```

**Verify installation:**
```powershell
nvm version
```

## Step 2: Install Node.js (24.11 line for FDK 10.x)

```powershell
# Pin the 24.11 line (matches fdk-setup commands + publishing expectations)
nvm install 24.11

# Set as active version
nvm use 24.11

# Verify
node --version  # Should show v24.11.x
```

## Step 3: Configure Environment for FDK

**Set Node 24 as default for FDK:**

```powershell
# Create batch script for FDK environment
# Save to C:\Users\<YourUsername>\fdk-env.bat
@echo off
nvm use 24.11
echo FDK environment active (Node.js 24.11 — FDK 10.x)
```

**Or add to PowerShell profile:**

```powershell
# Open profile
notepad $PROFILE

# Add these lines:
function Use-FDK {
    nvm use 24.11
    Write-Host "FDK environment active (Node.js 24.11 — FDK 10.x line)" -ForegroundColor Green
}
Set-Alias fdk-env Use-FDK
```

## Step 4: Install FDK via npm

```powershell
# Authoritative stack for FDK 10.x + Platform 3.0 publishing: Node 24.11.x (same as SKILL.md / commands)
nvm install 24.11 2>$null
nvm use 24.11

# Uninstall old FDK (if any)
npm uninstall -g @freshworks/fdk 2>$null
npm uninstall -g fdk 2>$null

# Install FDK 10.x line globally (CDN — not registry.npmjs.org)
npm install -g "https://cdn.freshdev.io/fdk/latest-v24.tgz"

# Verify (use where.exe — see section above)
fdk version
where.exe fdk
```

Ensure **`fdk version`** reports **10.x** for Platform 3.0 publishing workflows.

## Step 5: Verify Complete Setup

```powershell
# Check all components (keep one line of truth: 24.11 + FDK 10.x — same family as manifest engines in app-dev)
nvm list             # Active line should be v24.11.x
node --version       # Should show v24.11.x
npm --version        # Should show 9.x or 10.x
fdk version          # Should show 10.x.x (pin exact semver in app manifest as needed)

# Test FDK
fdk --help
```

## Managing Multiple Node Versions

With nvm-windows, you can keep multiple Node versions and switch as needed:

```powershell
# List installed versions
nvm list

# Install other versions
nvm install 20
nvm install 22

# Switch between versions
nvm use 24.11       # FDK 10.x + latest-v24.tgz stack
nvm use 20          # Use Node 20 for other projects

# Set default version (optional)
nvm use 24.11       # Sets as current for new terminals when working on FDK 10.x apps
```

## PATH Configuration

nvm-windows automatically manages PATH. If `fdk` is not recognized:

1. **Check Node is active:**
   ```powershell
   node --version
   ```

2. **Check npm global path:**
   ```powershell
   npm config get prefix
   ```
   Should show: `C:\Users\<YourUsername>\AppData\Roaming\npm`

3. **Verify PATH includes npm:**
   ```powershell
   $env:Path -split ';' | Select-String npm
   ```

4. **If missing, add npm to PATH:**
   ```powershell
   $npmPath = "$env:APPDATA\npm"
   $current = [Environment]::GetEnvironmentVariable("Path", "User")
   if ($current -notlike "*$npmPath*") {
       [Environment]::SetEnvironmentVariable("Path", "$current;$npmPath", "User")
   }
   ```

5. **Restart PowerShell** and verify:
   ```powershell
   where.exe fdk
   ```

## Important Notes

- Use **npm** (not YARN) for FDK installation
- For **FDK 10.x**, use **Node 24.11.x**: `nvm use 24.11` (aligns with `fdk-setup` slash commands)
- nvm-windows requires Administrator privileges for installation
- After nvm installation, restart PowerShell

## Troubleshooting

### `fdk` not found after installation

```powershell
# Switch to the SAME Node line you used for npm install -g (FDK 10.x → 24.11)
nvm use 24.11

# Refresh PATH in this window (see PowerShell section above)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Reinstall FDK 10.x line if needed
npm install -g "https://cdn.freshdev.io/fdk/latest-v24.tgz"

# Check installation — use where.exe, not "where"
where.exe fdk
Get-Command fdk -All
```

### Multiple Node versions causing issues

```powershell
# Always use Node 24.11 for FDK 10
nvm use 24.11

# Verify
node --version  # Should show v24.11.x
fdk version     # Should work now
```

## Uninstall

```powershell
# Uninstall FDK only (keep Node.js and nvm)
npm uninstall -g @freshworks/fdk 2>$null
npm uninstall -g fdk 2>$null

# To remove Node 24 (optional)
nvm uninstall 24

# To remove nvm-windows completely (optional)
# Use Add/Remove Programs or:
choco uninstall nvm
```

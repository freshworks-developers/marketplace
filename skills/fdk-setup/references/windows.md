# FDK Setup — Windows

## Prerequisites

- **nvm-windows** — Recommended for managing Node.js versions
- **Node.js v18.13.0 or later** — Installed via nvm-windows
- **PowerShell** — Run as Administrator for installation

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

## Step 2: Install Node.js 18

```powershell
# Install latest Node.js 18.x
nvm install 18

# Set as active version
nvm use 18

# Verify
node --version  # Should show v18.x.x
```

## Step 3: Configure Environment for FDK

**Set Node 18 as default for FDK:**

```powershell
# Create batch script for FDK environment
# Save to C:\Users\<YourUsername>\fdk-env.bat
@echo off
nvm use 18
echo FDK environment active (Node.js 18)
```

**Or add to PowerShell profile:**

```powershell
# Open profile
notepad $PROFILE

# Add these lines:
function Use-FDK {
    nvm use 18
    Write-Host "FDK environment active (Node.js 18)" -ForegroundColor Green
}
Set-Alias fdk-env Use-FDK
```

## Step 4: Install FDK via npm

```powershell
# Ensure Node 18 is active
nvm use 18

# Uninstall old FDK (if any)
npm uninstall fdk -g

# Install FDK globally
npm install https://cdn.freshdev.io/fdk/latest.tgz -g

# Verify
fdk version
```

Ensure version is 9.0.0 or later (9.4.1+ recommended for Platform 3.0).

## Step 5: Verify Complete Setup

```powershell
# Check all components
nvm list             # Should show 18.x.x with asterisk (active)
node --version       # Should show v18.x.x
npm --version        # Should show 9.x or 10.x
fdk version          # Should show 9.4.1 or later

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
nvm use 18          # Use Node 18 for FDK
nvm use 20          # Use Node 20 for other projects

# Set default version (optional)
nvm use 18          # Sets as current for new terminals
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
- Always use Node.js 18 for FDK: `nvm use 18`
- nvm-windows requires Administrator privileges for installation
- After nvm installation, restart PowerShell

## Troubleshooting

### `fdk` not found after installation

```powershell
# Switch to Node 18
nvm use 18

# Reinstall FDK
npm install https://cdn.freshdev.io/fdk/latest.tgz -g

# Check installation
where.exe fdk
```

### Multiple Node versions causing issues

```powershell
# Always use Node 18 for FDK
nvm use 18

# Verify
node --version  # Should show v18.x.x
fdk version     # Should work now
```

## Uninstall

```powershell
# Uninstall FDK only (keep Node.js and nvm)
npm uninstall fdk -g

# To remove Node 18 (optional)
nvm uninstall 18

# To remove nvm-windows completely (optional)
# Use Add/Remove Programs or:
choco uninstall nvm
```

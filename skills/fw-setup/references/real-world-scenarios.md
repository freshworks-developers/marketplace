# Real-World FDK Setup Scenarios

Compiled from Freshworks Community, Stack Overflow, Reddit, and official documentation (2021-2026).

## Installation Issues

### 1. NVM Symlink Path with Spaces (Windows)
**Source:** community.freshworks.dev/t/cannot-install-fdk-version/10143

**Problem:**
- FDK installation fails on Windows
- NVM symlink path contains spaces (default: "Program Files")
- npm install fails silently or with permission errors

**Symptoms:**
```
npm install https://cdn.freshdev.io/fdk/latest.tgz -g
# Fails with path errors
```

**Solution:**
- Set NVM symlink to path without spaces (e.g., `C:\nodejs`)
- Reinstall NVM with correct symlink path
- Then install FDK

**Detection:**
```bash
# Check NVM symlink path
where node
# If contains "Program Files", needs fix
```

---

### 2. ngrok Certificate Error (Corporate Firewall)
**Source:** community.freshworks.dev/t/failed-fdk-installation-with-ngrok-installation-error/12680

**Problem:**
- FDK installation fails during ngrok download
- Corporate firewall intercepts SSL certificates
- Error: `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`

**Symptoms:**
```
npm ERR! ngrok - install failed, retrying
npm ERR! ngrok - error downloading from URL RequestError: unable to get local issuer certificate
```

**Solution (Windows):**
```powershell
# Use Chocolatey approach
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

choco install nvm
npm install https://cdn.freshdev.io/fdk/latest.tgz -g
```

**Alternative:**
- Configure npm proxy settings
- Add corporate CA certificates to Node.js
- Use VPN or bypass proxy for installation

---

### 3. Wrong Node Version / Syntax Errors
**Source:** community.freshworks.dev/t/having-problem-in-fdk-installation/6492

**Problem:**
- FDK installed but throws syntax errors
- Using old Node version (< 14)
- Error: `SyntaxError: Unexpected token =`

**Symptoms:**
```bash
fdk version
# /usr/local/lib/node_modules/fdk/lib/configs.js:55
# static INVALID_KEY = Symbol.for('invalid_key');
# SyntaxError: Unexpected token =
```

**Root Cause:**
- Node version too old (< 14)
- FDK requires Node 14+ (FDK 9.x) or Node 24+ (FDK 10.x)

**Solution:**
```bash
# Check Node version
node --version

# If < 14, upgrade via nvm
nvm install 24
nvm use 24
nvm alias fdk 24

# Reinstall FDK
npm install https://cdn.freshdev.io/fdk/latest.tgz -g
```

---

### 4. sqlite3 Installation Error
**Source:** community.freshworks.dev/t/freshworks-sdk-fdk-not-getting-installed-throwing-sqlite3-manual-install-error/2027

**Problem:**
- FDK installation fails during sqlite3 compilation
- node-gyp rebuild fails
- Missing build tools or Python

**Symptoms:**
```
Error: Please install sqlite3 package manually
node-gyp rebuild failed
```

**Root Causes:**
- Missing Python (required for node-gyp)
- Missing build tools (gcc, make, etc.)
- Wrong Node version for sqlite3 binary

**Solution (macOS):**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install via Homebrew
brew install python3
```

**Solution (Linux):**
```bash
# Install build essentials
sudo apt-get install build-essential python3
```

**Solution (Windows):**
```powershell
# Install windows-build-tools (if needed)
npm install --global windows-build-tools
```

---

### 5. NVM PATH Not Set (macOS/Linux)
**Source:** community.freshworks.dev/t/having-problem-in-fdk-installation/6492

**Problem:**
- FDK installed but not found in PATH
- nvm not properly configured in shell
- Commands work in one terminal but not others

**Symptoms:**
```bash
fdk version
# command not found: fdk

which fdk
# (no output)
```

**Solution:**
```bash
# Add to ~/.zshrc or ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Source shell config
source ~/.zshrc

# Verify
command -v nvm
fdk version
```

---

## Runtime Issues

### 6. Port Already in Use (EADDRINUSE)
**Source:** community.freshworks.dev/t/eaddrinuse-error-while-locally-running-the-app/3531

**Problem:**
- `fdk run` fails with port conflict
- Port 10001 already in use
- Previous FDK process still running

**Symptoms:**
```
uncaughtException: listen EADDRINUSE: address already in use :::10001
Error: listen EADDRINUSE: address already in use :::10001
```

**Root Causes:**
- Another FDK app running in different terminal
- Zombie FDK process from previous crash
- Other application using port 10001

**Solution (macOS/Linux):**
```bash
# Find process using port 10001
lsof -i :10001

# Kill the process
kill -9 <PID>

# Or kill all node processes
pkill -9 node
```

**Solution (Windows):**
```powershell
# Find process using port 10001
netstat -ano | findstr :10001

# Kill the process
taskkill /PID <PID> /F

# Or kill all node processes
taskkill /IM node.exe /F
```

---

### 7. Permission Denied (EACCES) - Global npm Install
**Source:** community.freshworks.dev/t/facing-issue-while-installing-fdk-with-npm/905

**Problem:**
- npm install -g fails with permission errors
- Installing FDK globally without proper permissions
- System Node installation conflicts

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied
```

**Solution (RECOMMENDED - Use nvm):**
```bash
# Install nvm (avoids permission issues)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node via nvm
nvm install 24
nvm use 24

# Now install FDK (no sudo needed)
npm install https://cdn.freshdev.io/fdk/latest.tgz -g
```

**Alternative (Change npm prefix):**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

**BAD SOLUTION (Don't use sudo):**
```bash
# ❌ DON'T DO THIS - causes more problems
sudo npm install https://cdn.freshdev.io/fdk/latest.tgz -g
```

---

## Platform & Architecture Issues

### 8. M1/M2 Mac (ARM64) Compatibility
**Source:** General GitHub issues, not FDK-specific but applies

**Problem:**
- FDK or dependencies fail on Apple Silicon
- Architecture mismatch (x64 vs ARM64)
- Rosetta emulation issues

**Symptoms:**
```
Error: The module was compiled against a different Node.js version
dyld: mach-o file, but is an incompatible architecture
```

**Solution:**
```bash
# Ensure using ARM64 Node
arch
# Should output: arm64

# Install Node 24 ARM64 via nvm
nvm install 24
nvm use 24

# Verify architecture
node -p "process.arch"
# Should output: arm64

# Clean install FDK
npm install https://cdn.freshdev.io/fdk/latest.tgz -g
```

**If issues persist (use Rosetta):**
```bash
# Install x64 Node via Rosetta
arch -x86_64 zsh
nvm install 24
nvm use 24
npm install https://cdn.freshdev.io/fdk/latest.tgz -g
```

---

### 9. Corporate Proxy/Firewall Issues
**Source:** community.freshworks.dev/t/connection-errors-followed-by-certificate-errors-using-fdk/13087

**Problem:**
- npm install fails behind corporate proxy
- SSL certificate validation errors
- Connection timeouts

**Symptoms:**
```
npm ERR! network request to https://cdn.freshdev.io/fdk/latest.tgz failed
npm ERR! network This is a problem related to network connectivity
npm ERR! network Proxy issue or bad network settings
```

**Solution:**
```bash
# Configure npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# If proxy requires auth
npm config set proxy http://username:password@proxy.company.com:8080

# Disable SSL verification (ONLY for corporate proxies)
npm config set strict-ssl false

# Then install FDK
npm install https://cdn.freshdev.io/fdk/latest.tgz -g
```

**Alternative (Use VPN):**
- Connect to company VPN that bypasses proxy
- Install FDK while on VPN
- Disconnect VPN after installation

---

## Version & Migration Issues

### 10. Platform 2.3 and Node 18 deprecation

**Source:** Freshworks product timeline (aligns with **`docs/engine-matrix.md`**)

**Problem:**
- **platform-version 2.3** and **Node 18** (**FDK 9.x**) share an end-of-support date: **May 31, 2026**
- Earlier milestones (e.g. new apps on 2.3 disabled) may be documented separately on the Developer Portal

**Migration Required:**
- All apps MUST migrate to Platform 3.0
- FDK 9.x supports Platform 3.0 (Node 18)
- FDK 10.x supports Platform 3.0 (Node 24)

**Solution:**
```bash
# Check current platform version
cat manifest.json | grep platform-version

# If 2.3, migrate immediately
# Use Freddy Developer Co-pilot for migration assistance
# Follow: https://developers.freshworks.com/docs/migration-guide/
```

---

### 11. FDK Validate Errors - manifest.json Schema
**Source:** developers.freshworks.com/docs/guides/submission-guidelines/app-validation/

**Problem:**
- `fdk validate` fails with schema errors
- manifest.json missing required fields
- Invalid data types in manifest

**Symptoms:**
```bash
fdk validate
# Error: manifest.json validation failed
# Missing required property: platform-version
# Invalid type for engines.fdk (expected string)
```

**Solution:**
```bash
# Auto-fix common issues
fdk validate --fix

# Manually check manifest.json
cat manifest.json

# Required fields:
# - platform-version (string)
# - product (object)
# - engines.node (string)
# - engines.fdk (string)
```

**Common Fixes:**
```json
{
  "platform-version": "3.0",
  "product": {
    "freshdesk": {
      "location": {
        "ticket_sidebar": {
          "url": "index.html",
          "icon": "icon.svg"
        }
      }
    }
  },
  "engines": {
    "node": "24.11.0",
    "fdk": "10.0.0"
  }
}
```

---

### 12. Multiple FDK Instances Conflict
**Source:** Real-world developer experience

**Problem:**
- Multiple FDK versions installed globally
- FDK 9.x and 10.x conflict
- Wrong FDK version used for project

**Symptoms:**
```bash
fdk version
# 9.6.0

# But project requires FDK 10
cat package.json | grep fdk
# "fdk": "^10.0.0"
```

**Solution:**
```bash
# Check all installed FDK versions
npm list -g @freshworks/fdk

# Uninstall all FDK versions
npm uninstall @freshworks/fdk -g

# Install specific version
npm install @freshworks/fdk@10.0.0 -g

# Or use dual setup (see cross-scenarios.md)
```

---

## Summary: Most Common Issues

| Issue | Frequency | Platform | Severity |
|-------|-----------|----------|----------|
| NVM PATH not set | Very High | macOS/Linux | Medium |
| Port 10001 in use | High | All | Low |
| Wrong Node version | High | All | High |
| Permission denied (EACCES) | High | macOS/Linux | Medium |
| NVM symlink with spaces | Medium | Windows | High |
| Corporate proxy/SSL | Medium | All | Medium |
| sqlite3 build failure | Medium | All | Medium |
| ngrok certificate error | Low | Windows | Medium |
| M1/M2 ARM64 issues | Low | macOS | Medium |
| Platform 2.3 deprecation | Critical | All | Critical |

---

## Quick Diagnostic Checklist

When FDK installation fails, check in this order:

1. **Node version**: `node --version` (should be 24.x for FDK 10.x)
2. **nvm installed**: `command -v nvm` (should output path)
3. **nvm PATH**: `echo $NVM_DIR` (should be ~/.nvm)
4. **npm permissions**: `npm config get prefix` (should be ~/.nvm/...)
5. **Proxy settings**: `npm config get proxy` (check if behind firewall)
6. **Port availability**: `lsof -i :10001` (should be empty)
7. **Build tools**: `gcc --version` or `xcode-select -p` (for sqlite3)
8. **Platform version**: `cat manifest.json | grep platform-version` (should be 3.0)

---

## References

- Freshworks Developer Community: https://community.freshworks.dev/c/app-platform/
- Official Troubleshooting Guide: https://developers.freshworks.com/docs/guides/troubleshooting-101/
- FDK CLI Setup: https://developers.freshworks.com/docs/guides/setup/cli-setup/
- Platform Migration: https://developers.freshworks.com/docs/migration-guide/

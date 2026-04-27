# Cross-Platform FDK Setup Scenarios

> **Installation method agnostic:** Handles nvm (macOS/Linux), Homebrew (macOS), Chocolatey (Windows), and nvm-windows.

## Table of Contents

1. [Detect Installation Method](#detect-installation-method)
2. [Legacy Migration (FDK 9.x → 10.x)](#legacy-migration)
3. [Version Switching](#version-switching)
4. [Global vs Local Scope](#global-vs-local-scope)
5. [Shell Persistence](#shell-persistence)

---

## Detect Installation Method

**Always detect first before taking action:**

```bash
detect_fdk_method() {
  # Homebrew (macOS)
  if command -v brew >/dev/null 2>&1 && brew list fdk >/dev/null 2>&1; then
    echo "homebrew"
    return 0
  fi
  
  # Chocolatey (Windows)
  if command -v choco >/dev/null 2>&1 && choco list --local-only fdk >/dev/null 2>&1; then
    echo "chocolatey"
    return 0
  fi
  
  # nvm (macOS/Linux)
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "nvm"
    return 0
  fi
  
  # nvm-windows
  if command -v nvm >/dev/null 2>&1 && [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "nvm-windows"
    return 0
  fi
  
  # npm global (fallback)
  if command -v fdk >/dev/null 2>&1; then
    echo "npm-global"
    return 0
  fi
  
  echo "not-installed"
  return 1
}

METHOD=$(detect_fdk_method)
echo "FDK installation method: $METHOD"
```

---

## Legacy Migration

### Context
- User has FDK 9.x
- Wants to upgrade to FDK 10.x
- Must preserve ability to use both (nvm only) OR switch completely (Homebrew/Chocolatey)

### By Installation Method

#### nvm (macOS/Linux)
Both FDK versions can coexist on different Node versions:

```bash
# Install FDK 10.x on Node 24
/fw-setup-install --both

# Or separately:
/fw-setup-install          # FDK 10.x on Node 24
/fw-setup-downgrade        # FDK 9.x on Node 18 (if needed)

# Switch between them:
/fw-setup-use 10           # Current shell only
/fw-setup-use 10 --global  # All new shells
```

**Windows note:** for nvm-windows, prefer the **`fw-setup-use.ps1`** path described in **`commands/fw-setup-use.md`** — non-`--global` switches are **session-scoped** and avoid flipping the global symlink.

#### Homebrew (macOS)
Only one FDK version system-wide:

```bash
# Upgrade to FDK 10.x (replaces FDK 9.x)
brew upgrade fdk

# Or manual:
brew uninstall fdk
brew install fdk  # Gets latest (FDK 10.x)

# Downgrade to FDK 9.x (if needed):
brew uninstall fdk
brew install https://cdn.freshdev.io/fdk/homebrew/fdk-9.8.2.rb
```

**Note:** Homebrew installs are system-wide. Cannot have both FDK 9 and 10 simultaneously.

#### Chocolatey (Windows)
Only one FDK version system-wide:

```bash
# Upgrade to FDK 10.x (replaces FDK 9.x)
choco upgrade fdk

# Or manual:
choco uninstall fdk
choco install fdk  # Gets latest (FDK 10.x)

# Downgrade to FDK 9.x (if needed):
choco uninstall fdk
choco install fdk --version=9.8.2
```

**Note:** Chocolatey installs are system-wide. Cannot have both FDK 9 and 10 simultaneously.

#### nvm-windows
Both FDK versions can coexist on different Node versions:

```bash
# Install Node 24 + FDK 10.x
nvm install 24.11.0
nvm use 24.11.0
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

# Install Node 18 + FDK 9.x (if needed)
nvm install 18.20.8
nvm use 18.20.8
npm install -g https://cdn.freshdev.io/fdk/latest.tgz

# Switch between them:
nvm use 24.11.0  # FDK 10.x
nvm use 18.20.8  # FDK 9.x

# Set default:
nvm alias default 24.11.0
```

---

## Version Switching

### Summary by Method

| Method | Multiple Versions? | Switch Command | Scope |
|--------|-------------------|----------------|-------|
| **nvm** | ✅ Yes (per Node version) | `nvm use 24.11` or `/fw-setup-use 10` | Per-shell or global |
| **Homebrew** | ❌ No (system-wide) | `brew switch fdk <version>` (if available) | System-wide only |
| **Chocolatey** | ❌ No (system-wide) | Reinstall with `choco install fdk --version=X` | System-wide only |
| **nvm-windows** | ✅ Yes (per Node version) | `nvm use 24.11.0` | Per-shell or global |

### nvm: Workspace Switching

```bash
# Project A (FDK 10.x)
cd /path/to/project-a
echo "24.11" > .nvmrc
nvm use  # or /fw-setup-use

# Project B (FDK 9.x legacy)
cd /path/to/project-b
echo "18" > .nvmrc
nvm use  # or /fw-setup-use
```

### Homebrew/Chocolatey: System-Wide Only

Cannot switch per-project. Must reinstall to change versions:

```bash
# Switch to FDK 9.x
brew uninstall fdk
brew install fdk@9  # If formula exists

# Or use nvm alongside Homebrew for version management
```

---

## Global vs Local Scope

### nvm

| Command | Current Shell | New Shells | Persistent? |
|---------|---------------|------------|-------------|
| `nvm use 24.11` | ✅ Changed | ❌ Unchanged | No |
| `nvm alias default 24.11` | ❌ Unchanged | ✅ Changed | Yes |
| `/fw-setup-use 10` | ✅ Changed | ❌ Unchanged | No |
| `/fw-setup-use 10 --global` | ✅ Changed | ✅ Changed | Yes (updates .zshrc/.bashrc) |

### Homebrew / Chocolatey

All changes are system-wide and persistent by default.

### nvm-windows

| Command | Current Shell | New Shells | Persistent? |
|---------|---------------|------------|-------------|
| `nvm use 24.11.0` | ✅ Changed | ✅ Changed | Yes (nvm-windows symlink is system-wide) |
| `nvm alias default 24.11.0` | ❌ Unchanged | ✅ Changed | Yes |

**Workspace-only switching (without changing the system-wide symlink):** use **`skills/fw-setup/scripts/fw-setup-use.ps1`** from **`/fw-setup-use`** on Windows — it prepends the selected Node install directory to the **current session** `PATH` and refreshes `PATH` from Machine+User.

---

## Shell Persistence

### macOS/Linux (nvm)

**Auto-load nvm on shell startup:**

Add to `~/.zshrc` (zsh) or `~/.bashrc` (bash):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24.11 >/dev/null 2>&1 || true  # Optional: auto-switch to default
```

**Check which file to edit:**

```bash
echo $SHELL
# /bin/zsh  → edit ~/.zshrc
# /bin/bash → edit ~/.bashrc
```

### macOS (Homebrew)

No shell config needed. Homebrew installs are already on PATH via `/usr/local/bin`.

### Windows (Chocolatey)

No shell config needed. Chocolatey adds to system PATH automatically.

### Windows (nvm-windows)

**Auto-load in PowerShell:**

Add to `$PROFILE` (edit via `notepad $PROFILE`):

```powershell
nvm use 24.11.0 2>$null
```

**Auto-load in Git Bash / WSL:**

Add to `~/.bashrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24.11 >/dev/null 2>&1 || true
```

---

## Troubleshooting by Method

### nvm: "command not found: fdk"

**Cause:** Wrong Node version active (FDK installed on different Node).

**Fix:**
```bash
nvm use 24.11  # Switch to Node with FDK 10.x
# OR
nvm use 18     # Switch to Node with FDK 9.x
```

### Homebrew: "command not found: fdk"

**Cause:** Not installed or not on PATH.

**Fix:**
```bash
brew install fdk
# OR
brew link fdk  # If installed but not linked
```

### Chocolatey: "command not found: fdk"

**Cause:** Not installed or PATH not refreshed.

**Fix:**
```bash
choco install fdk
refreshenv  # Refresh PATH in current shell
```

### nvm-windows: "command not found: fdk"

**Cause:** Wrong Node version active.

**Fix:**
```bash
nvm list  # See installed versions
nvm use 24.11.0  # Switch to Node with FDK
```

---

## Recommendations by Use Case

| Use Case | Recommended Method | Why |
|----------|-------------------|-----|
| **Team development** (multiple FDK versions) | nvm or nvm-windows | Per-project version switching |
| **Single user** (one FDK version) | Homebrew or Chocolatey | Simpler, no version management needed |
| **CI/CD pipelines** | npm global install from CDN | Reproducible, version-pinned |
| **Migration projects** (both 9.x and 10.x) | nvm or nvm-windows | Can run both simultaneously |
| **Windows only** | nvm-windows or Chocolatey | Native Windows support |
| **macOS only** | nvm or Homebrew | Native macOS integration |
| **Linux** | nvm | Standard Node version manager |

---

## Quick Reference

### Install FDK 10.x

```bash
# nvm
/fw-setup-install

# Homebrew
brew install fdk

# Chocolatey
choco install fdk

# nvm-windows
nvm install 24.11.0 && nvm use 24.11.0
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz
```

### Switch to FDK 10.x

```bash
# nvm
/fw-setup-use 10 --global

# Homebrew/Chocolatey
# (already system-wide, no switching needed)

# nvm-windows
nvm use 24.11.0
```

### Check Current FDK

```bash
fdk version
node --version
```

### Uninstall FDK

```bash
# nvm
/fw-setup-uninstall

# Homebrew
brew uninstall fdk

# Chocolatey
choco uninstall fdk

# nvm-windows
npm uninstall -g @freshworks/fdk
```

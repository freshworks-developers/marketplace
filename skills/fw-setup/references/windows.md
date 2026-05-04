# FDK Setup — Windows

## Prerequisites

- **nvm-windows** — Recommended for managing Node.js versions
- **Node.js v24.11.x** — Recommended line for **FDK 10.x** + `latest-v24.tgz` (same single source of truth as `SKILL.md`; avoid bare `24` if it drifts to non-24.11 builds)
- **PowerShell** — Run as Administrator for installation

---

## Installer-based setups: Node, `fdk`, and PATH conflicts (read before mixing stacks)

Freshworks tooling assumes **`nvm use 24.11`** then **`npm install -g`** the CDN tarball (`latest-v24.tgz` for FDK 10.x). Anything that installs **standalone Node**, an **alternate global `fdk`**, or **reorders PATH** breaks that assumption until **you know which binaries win**.

### The core issue: PATH precedence

Windows runs the **first** `node.exe` / **`fdk`** on **`PATH`** (machine vs user ordering matters). Symptoms:

| Symptom | Likely cause |
|---------|----------------|
| **`node`** is **not** **`v24.11.*`** after `nvm use 24.11` | **`Program Files\nodejs`**, Chocolatey / winget / Scoop **Node** still **ahead** of nvm-windows’ symlink target |
| **`where.exe node`** lists **`C:\Program Files\nodejs\node.exe` first | Standalone **MSI** or **winget** (`OpenJS.NodeJS`) Node; nvm may not reorder ahead of it for this shell |
| **Different `npm` / prefix** in Administrator vs normal PowerShell | **Split PATH**: install/run **consistently** (avoid mixing **elevated** global npm with daily **user** terminals) |
| **`where.exe fdk`** shows **two paths** | **`choco install fdk`** (Chocolatey-managed) **plus** CDN global via npm under active nvm; or stale **`fdk.cmd`** |

**Mandatory diagnostics** (paste outputs when debugging):

```powershell
where.exe node
Get-Command node -All | Format-Table Name, Source -AutoSize
"NVM_HOME=$env:NVM_HOME; NVM_SYMLINK=$env:NVM_SYMLINK"
nvm version
nvm current
nvm list
node --version
npm config get prefix
where.exe npm
where.exe fdk 2>$null
Get-Command fdk -ErrorAction SilentlyContinue | Format-Table Name, Source -AutoSize
npm list -g --depth=0 2>$null | Select-String -Pattern "fdk|freshworks"
```

**Strong signal:** `Get-Command node` resolves **`…\Program Files\nodejs\…`** while you expect **`nvm`** → **PATH conflict** until uninstall/reorder (**sections below**).

### A. Official Node MSI / winget `OpenJS.*` ("installer from nodejs.org")

Usually **`C:\Program Files\nodejs\`**. **Coexists poorly** with nvm-windows unless **only one wins PATH**.

- **For Matrix-aligned FDK 10 (`latest-v24.tgz`):** Prefer **nvm `24.11.x`** as the **only** **`node`** for FDK work. Typical fix: **uninstall “Node.js”** from **Apps** / **`winget uninstall OpenJS.NodeJS.LTS`** (exact id varies), **or** edit **Machine/User PATH** so **nvm symlink root** precedes **`Program Files\nodejs`** — **log out / reboot** stubborn shells.
- Re-check with **`where.exe node`** after every change.

### B. Microsoft Store Node.js

Sandboxed quirks and versioning delays — **avoid** for reproducible **`fdk`**; use **nodejs.org MSI** aligned with **`nvm-windows`** per this guide.

### C. Chocolatey (`nodejs`, `nodejs-lts`, optional `nvm`)

- **`choco install nodejs`** adds another **`node`** on PATH — **uninstall** or accept **PATH surgery** if you standardize on **nvm install 24.11**.
- **`choco install nvm`** (nvm-windows) per **Step 1** below is fine; still run **`nvm install 24.11`** **after**.

### D. Winget / Scoop

- **Winget** may install **MSI Node** (same as **A**). **Scoop** shims often sit early in **User PATH** — **`scoop which node`** vs **`where.exe node`** to see order.
- **Remediation:** Pick **one** Node source for **FDK**; remove the others or fix **PATH** so **`nvm use 24.11`** + **`node -v`** shows **`v24.11.*`**.

### E. `choco install fdk` vs CDN `npm install -g` (two different `fdk` stories)

| Source | Notes |
|--------|--------|
| **CDN tarball on active Node** (skill default) | **`fdk`** lives under **that** Node’s global npm bin (via **`nvm use`**) |
| **`choco install fdk`** | **System-wide** Chocolatey package — **not** the same upgrade/pin path as **tarball + engine matrix** |

If both exist, **`where.exe fdk`** may show **two** entries. For **`docs/engine-matrix.md`**: install **`fdk`** **via npm + CDN** under **`nvm use 24.11`**; **`choco uninstall fdk`** if it shadows (then re-verify).

### F. Typical repair order (non-destructive → clean)

1. Close **all** terminals / IDEs (PATH cache).
2. **`nvm use 24.11`** → **`node --version`** must be **`v24.11.*`**. If not → **A–D** until fixed.
3. **`npm uninstall -g @freshworks/fdk`**; **`npm uninstall -g fdk`**; **`npm cache clean --force`**; remove **`%USERPROFILE%\.fdk`** when switching lines.
4. **`npm install -g "https://cdn.freshdev.io/fdk/latest-v24.tgz"`** on **that** **`node`**.
5. **New PowerShell** → **`where.exe fdk`**, **`fdk version`**.

### G. Other edge cases

| Case | Action |
|------|--------|
| **nvm root path with spaces** (“Program Files”) | May hit symlink edge cases ([`real-world-scenarios.md`](real-world-scenarios.md)); prefer default install location **without** spaces |
| **npm `EACCES` / can't write globals** | **`references/npm-permissions-sop.md`** — avoid **`Program Files`** npm prefix; use **user-writable** prefix + **nvm** profile |
| **Antivirus** blocks npm extract | Allow **npm cache** dir; retry; IT exception if needed |
| **WSL vs Windows** | **Separate** `PATH` — install **`fdk`** in the **same** environment you run **`fdk validate`** (document both if you use both) |

### H. IT policy: cannot uninstall MSI Node

If corporate image pins **Node ≠ 24.11.x**, **`latest-v24.tgz`** may **fail engine checks** at runtime. Request **allowlisted Node 24.11** or **dedicated nvm profile** with **user-writable** global prefix.

---

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

### FDK Downgrade Support (Windows)

**FDK 10.x → 10.0.y** (e.g., 10.1.0 → 10.0.1):
- **Supported** - Downgrades within the FDK 10.x line while staying on Node 24.11
- Use `/fw-setup-downgrade 10.0.1` (or desired 10.0.y version)
- PowerShell-native implementation handles version detection correctly
- No Node version switch required (stays on 24.11)
- **PATH refresh**: Script automatically refreshes PATH in current session to make `fdk` immediately available

**FDK 10.x → 9.x** (e.g., 10.1.0 → 9.8.2):
- **Supported** - Cross-major downgrade with Node 24 → Node 18 switch
- Use `/fw-setup-downgrade 9.8.2` or `/fw-setup-downgrade` (latest 9.x)
- Shows deprecation warning before proceeding
- Automatically switches from Node 24.11 to Node 18.20
- **PATH refresh**: Script automatically refreshes PATH in current session

**After downgrade, if `where.exe fdk` shows no path:**
1. Close and reopen your PowerShell terminal (nvm-windows symlink may need new session)
2. Or manually refresh PATH:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### FDK Uninstall with Multiple Versions

If you installed both FDK 10.x and FDK 9.x using `/fw-setup-install --both`, the `/fw-setup-uninstall` command will:
- **Remove FDK from ALL Node versions** (both Node 24 and Node 18)
- Delete the shared `~/.fdk` cache directory
- Clean npm cache
- Preserve Node.js and nvm-windows installation

The uninstall script automatically detects and removes FDK from:
1. Current active Node version
2. Node 24.x (if present)
3. Node 18.x (if present)

### fw-setup-use: session vs global (Windows)

**Authoritative UX:** Slash command **`/fw-setup-use`** (see **`commands/fw-setup-use.md`**) prefers **`skills/fw-setup/scripts/fw-setup-use.ps1`** for **workspace-only / non-`--global`** switches. That prepends the selected Node binaries to **this PowerShell session’s PATH** **without flipping** nvm-windows’ **single system-wide symlink**—so teammates’ default stays unchanged unless they opt in.

**nvm-windows behavior:** **`nvm use <version>`** alone updates which Node version symlinks point at and persists as the effective default machine-wide for many shells—so it can resemble a “global” switch compared to POSIX nvm sessions.

**`--global` on `/fw-setup-use`:** Pass **`-GlobalDefault`** to **`fw-setup-use.ps1`** (see command file)—runs **`nvm use`** / alias behavior so switching **persists intentionally** via nvm-windows. Use when the repo must stay on Node **24.11** vs **18** for everyone opening new terminals **and** everyone agrees.

**Summary**

| Scenario | Prefer |
|---------|--------|
| Don’t disturb org-wide default symlink; need FDK in **this IDE shell** only | **`fw-setup-use.ps1`** without `-GlobalDefault` |
| Persist Node + FDK for **all future shells** (team aligned) | **`-GlobalDefault`** **or** explicit **`nvm use …`** **+** **`nvm alias default …`** |

Do **not** claim “without `--global`” and **`nvm use`** mean the same as **`fw-setup-use.ps1` session PATH** behavior—they are **different mechanics** documented in **`commands/fw-setup-use.md`**.

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
# Pin the 24.11 line (matches fw-setup commands + publishing expectations)
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
# Check all components (keep one line of truth: 24.11 + FDK 10.x — same family as manifest engines in fw-app-dev)
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
- For **FDK 10.x**, use **Node 24.11.x**: `nvm use 24.11` (aligns with `fw-setup` slash commands)
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

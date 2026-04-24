# Error: `fdk: command not found`

User reports `zsh: command not found: fdk` (or `fdk` missing in any shell) after installing Freshworks FDK, especially FDK 10.x (`@freshworks/fdk`) with nvm.

## Windows / PowerShell first

On **Windows PowerShell**, two common false alarms:

1. **`where fdk` shows nothing** — **`where`** is the **`Where-Object`** cmdlet alias, not **`where.exe`**. Use **`where.exe fdk`** or **`Get-Command fdk`**. See **`references/windows.md`** (“Do not use `where fdk`”).
2. **`&&` parse error** — **Windows PowerShell 5.1** does not support **`&&`**. Use **newlines**, **`;`**, or **`if ($LASTEXITCODE -eq 0) { ... }`**, or upgrade to **PowerShell 7+**. See **`references/windows.md`** (“`&&` is not valid”).

## Symptoms

- Terminal: `fdk -v`, `fdk version`, or `fdk` → `command not found: fdk`
- `which fdk` → empty
- User may have just upgraded to FDK 10.x via `npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz`
- User may have `nvm use fdk` (or similar) in `~/.zshrc`

## Root Cause (Most Common)

**The active Node version's global `bin/` is not the one where `fdk` was installed.**

For FDK 10.x on the Node-24 line, the supported install is typically:

- Package: `@freshworks/fdk` (scoped), not the legacy global name `fdk` alone
- Node: `v24.11.x` (FDK enforces this minor line for the v24 tarball)
- Binary path pattern:  
  `~/.nvm/versions/node/v24.11.x/bin/fdk` → symlink into  
  `~/.nvm/versions/node/v24.11.x/lib/node_modules/@freshworks/fdk/`

If the shell starts on another Node (e.g. `v24.14.x`) because `nvm alias fdk` or `default` points at `24` → 24.14, that prefix may have no `fdk` binary → `command not found`.

## Secondary Causes

1. **nvm not loaded** in non-interactive shells / IDE tasks (no `NVM_DIR` + `nvm.sh` source)
2. **PATH precedence**: another `node` / toolchain wins before nvm's shims
3. **Never installed** on the current Node prefix (install was done under a different `nvm use`)

## Diagnostics

Run these commands to identify the issue:

```bash
# 1) Where is node from?
command -v node
node --version

# 2) Is fdk on PATH for THIS node?
command -v fdk
ls -la "$(dirname "$(command -v node)")/fdk" 2>/dev/null

# 3) Which global CLI is installed for this prefix?
npm list -g @freshworks/fdk --depth=0
npm list -g fdk --depth=0

# 4) nvm aliases (look for wrong target: fdk -> 24 (-> v24.14...) instead of 24.11)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm alias
```

**Strong signal:** `npm list -g @freshworks/fdk` shows `@freshworks/fdk@10.x` under `v24.11.1`, but `node --version` in the failing shell is `v24.14.x` (or anything not `v24.11.x`).

## Fix (Preferred): Align nvm with the Node that has FDK 10

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Ensure Node 24.11.x is installed
nvm install 24.11

# Install FDK 10.x on Node 24.11.x
nvm use 24.11
npm uninstall -g @freshworks/fdk 2>/dev/null
npm uninstall -g fdk 2>/dev/null
rm -rf ~/.fdk
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

# Point your habitual alias at 24.11 (not bare "24", which may track 24.14+)
nvm alias fdk 24.11
nvm alias default 24.11

# Use it now
nvm use fdk

# Verify
command -v fdk
fdk version
```

Then ensure `~/.zshrc` (or profile) ends with something equivalent to `nvm use fdk` or `nvm use 24.11`.

## Fix (Alternative): Install FDK on whatever Node the shell uses

Only if intentionally staying on e.g. 24.14 and Freshworks documents a matching tarball for that line:

```bash
nvm use 24.14   # example
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz   # only if valid for that Node per release notes
```

**Prefer the "align Node to 24.11.x" approach** when using the FDK 10.x + latest-v24.tgz flow described in internal upgrade docs.

## Verification

```bash
nvm use fdk   # or: nvm use 24.11
node --version   # expect v24.11.x
fdk version      # expect Installed: 10.x.x
which fdk        # expect .../versions/node/v24.11.x/bin/fdk

# Test in new shell
zsh -c 'source ~/.zshrc && fdk version'
```

## Common Mistakes

- **Wrong tarball:** `npm install https://cdn.freshdev.io/fdk/latest.tgz` (unscoped `fdk`) may install an older FDK line (e.g. 9.x) with different Node engine rules than `latest-v24.tgz` + `@freshworks/fdk@10`
- **Pipe errors:** Piping `fdk version | head` can trigger `EPIPE` / winston noise; use plain `fdk version` for checks
- **Multiple Node versions:** Each nvm Node has its own global packages - `npm list -g` only shows packages for the current Node

## One-Line Summary for Agents

> `command not found: fdk` usually means the shell's active Node prefix is not `v24.11.x` (where `@freshworks/fdk@10` was installed); fix `nvm alias fdk` / `nvm use` so `PATH` includes `.../v24.11.x/bin`.

## Quick Resolution Steps

1. **Check current Node:** `node --version`
2. **If not v24.11.x:** Run `nvm use 24.11` or `nvm install 24.11 && nvm use 24.11`
3. **Verify fdk:** `fdk version`
4. **If still fails:** Reinstall on Node 24.11.x: `npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz`
5. **Set default:** `nvm alias default 24.11`
6. **Update shell config:** Add `nvm use 24.11 > /dev/null 2>&1` to `~/.zshrc`

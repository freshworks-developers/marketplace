---
name: fw-setup-use
description: Workspace FDK stack switch — nvm use from .nvmrc or explicit 10/9 (Node 24.11 vs 18); optional --write-nvmrc and --global flags
always: true
argument-hint: "[10|9|24.11|18] [--write-nvmrc] [--global] [directory]"
---

# FDK setup — use (`/fw-setup-use`)

**`/fw-setup use`**: align **this shell** (and optionally **`.nvmrc`**) with the **Node + FDK** stack the workspace needs. **Does not** install or change FDK semver by itself — if **`fdk`** is missing on the chosen Node, route to **`/fw-setup-install`**, **`/fw-setup-upgrade`**, or **`/fw-setup-downgrade`**.

> **Windows users:** same slash-command experience — just run **`/fw-setup-use 9`** in your IDE. The agent automatically uses the correct implementation (`fw-setup-use.ps1`) behind the scenes.

**Scope:**
- **Without `--global`**: 
  - **macOS/Linux (nvm)**: Changes only current shell (`nvm use`)
  - **Windows (nvm-windows)**: **Use the PowerShell implementation** (`scripts/fw-setup-use.ps1`) — it avoids `nvm use` so the **system-wide nvm-windows symlink is not flipped**; it prepends the selected Node install directory to **this session’s** `PATH` and refreshes `PATH` from Machine+User (helps `fdk` resolve immediately).
  - **Homebrew/Chocolatey**: System-wide already (no version switching)
- **With `--global`**: Sets as default for all new shells across all environments:
  - **nvm (macOS/Linux)**: `nvm alias default <version>` + updates `~/.zshrc` and `~/.bashrc` with `nvm use` line
  - **nvm-windows**: Runs `nvm use` + best-effort `nvm alias default` (persists via nvm-windows symlink semantics)
  - **Homebrew (macOS)**: System-wide already (no action needed)
  - **Chocolatey (Windows)**: System-wide already (no action needed)

**Important Windows Note:** Raw `nvm use` on nvm-windows flips a **single system-wide symlink**, which makes “workspace-only” switches look global. **`/fw-setup-use` on Windows should prefer `fw-setup-use.ps1`** unless the user explicitly passed **`--global`** (then persisting via `nvm use` is intended).

## When to use

- After **`cd`** into an app, **`fdk`** is missing or the wrong major → usually **wrong active Node** (global npm prefix).
- Switching between a **FDK 10.x** app (any Node **24.x**) and a **FDK 9.x** app (any Node **18.x**) during migrations.
- **Compatibility:** Node 24.x works with any FDK 10.y; Node 18.x works with any FDK 9.y

## Behaviour (agent routing)

| User intent | What to do |
|-------------|------------|
| **`/fw-setup-use`** only, **`.nvmrc`** present | **`cd`** app root → load **nvm** → **`nvm use`** → **`node --version`**, **`fdk version`**. |
| **`/fw-setup-use`** only, **no** **`.nvmrc`** | Tell user: add **`.nvmrc`** (**`24.11`** for FDK 10.x, **`18`** for FDK 9.x) or pass **`10`**, **`9`**, **`24.11`**, or **`18`**. |
| **`/fw-setup-use 10`** or **`24.11`** | **macOS/Linux:** **`nvm use 24.11`** (current shell only) → verify **`fdk version`** is **10.x**. **Windows:** run **`fw-setup-use.ps1`** (session `PATH`; avoids flipping nvm-windows global symlink unless **`--global`**). |
| **`/fw-setup-use 9`** or **`18`** | **macOS/Linux:** **`nvm use 18`** (current shell only) → verify **`fdk version`** is **9.x** (deprecated). **Windows:** run **`fw-setup-use.ps1`** (same semantics as the 10/24.11 row). |
| **`/fw-setup-use 10 --global`** | **`nvm use 24.11`** + **`nvm alias default 24.11`** (sets for all new shells). |
| **`/fw-setup-use 9 --global`** | **`nvm use 18`** + **`nvm alias default 18`** (sets for all new shells). |
| **`--write-nvmrc`** with **`10`** / **`24.11`** | Write **`.nvmrc`** containing **`24.11`**, then **`nvm use`**. |
| **`--write-nvmrc`** with **`9`** / **`18`** | Write **`.nvmrc`** containing **`18`**, then **`nvm use`**. |
| Path at end (e.g. **`/fw-setup-use 10 ./my-app`**) | **`cd`** that directory first; same rules. |

**Pinned FDK semver** (e.g. exactly **10.1.0**) still requires **`/fw-setup-install --version`** or **`/fw-setup-upgrade --to`** once Node matches.

## Per-app checklist (run in order)

1. **`cd`** to app root (directory with **`manifest.json`**, if any).
2. If **`.nvmrc`** missing and user wants FDK 10.x line → recommend **`24.11`** (not bare **`24`**, avoids drift off **24.11**).
3. **`export NVM_DIR="$HOME/.nvm"`** and **`[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`**.
4. **`nvm use`** (reads **`.nvmrc`**) or **`nvm use 24.11`** / **`nvm use 18`** per table above.
5. **`node --version`** and **`fdk version`** — **any FDK 10.y** with **any Node 24.x**, **any FDK 9.y** with **any Node 18.x**.
6. **TROUBLESHOOT mismatched stacks** (e.g., 2 Nodes but only 1 FDK):
   - If **Node 24.11 + Node 18** both present but **FDK only on one**:
     - **STOP and ask user:** "You have Node 24.11 and Node 18, but FDK is only installed on Node X. Would you like me to install FDK on the missing Node version? (yes/no)"
     - **If yes:** Use `/fw-setup-install X.Y.Z` (for FDK 10.x on Node 24) or `/fw-setup-downgrade X.Y.Z` (for FDK 9.x on Node 18)
     - **After install:** Re-run `nvm use` and verify both `node --version` and `fdk version` match expected stack
   - If **`fdk`** completely missing: Route to **`/fw-setup-install`** (FDK 10.x) or **`/fw-setup-downgrade`** (FDK 9.x)

## Execution (inline only — no Task)

Before running the block, set shell variables (or inline the values):

- **`WORK_DIR`** — app root (default **`.`**); use the path the user gave (absolute or relative).
- **`STACK`** — **`auto`** (use **`.nvmrc`** only), **`10`** or **`24.11`**, **`9`** or **`18`**.
- **`SET_GLOBAL`** — **`true`** if user passed **`--global`** flag, otherwise **`false`** (default).

### Windows (PowerShell) — preferred for nvm-windows

Run the repo-bundled script (path depends on how the skill is installed):

```powershell
# Typical: full dev-tools repo checkout
pwsh -NoProfile -ExecutionPolicy Bypass -File "skills/fw-setup/scripts/fw-setup-use.ps1" `
  -WorkDir "$env:WORK_DIR" `
  -Stack "$env:STACK" `
  $(if ($env:SET_GLOBAL -eq "true") { "-GlobalDefault" }) `
  $(if ($env:WRITE_NVMRC -eq "true") { "-WriteNvmrc" })

# Typical: skill copied into .cursor/skills/fw-setup
pwsh -NoProfile -ExecutionPolicy Bypass -File ".cursor/skills/fw-setup/scripts/fw-setup-use.ps1" `
  -WorkDir "$env:WORK_DIR" `
  -Stack "$env:STACK" `
  $(if ($env:SET_GLOBAL -eq "true") { "-GlobalDefault" }) `
  $(if ($env:WRITE_NVMRC -eq "true") { "-WriteNvmrc" })
```

Notes:
- **`--global`** maps to **`-GlobalDefault`** (PowerShell reserves `Set-*` verb naming; avoid a parameter literally named `SetGlobal`).
- If the user did not pass **`--write-nvmrc`**, omit **`-WriteNvmrc`** (do not set `WRITE_NVMRC`).

### macOS/Linux (bash) — nvm / Homebrew / Chocolatey

```bash
# Detect installation method
detect_install_method() {
  if command -v brew >/dev/null 2>&1 && brew list fdk >/dev/null 2>&1; then
    echo "homebrew"
  elif command -v choco >/dev/null 2>&1 && choco list --local-only fdk >/dev/null 2>&1; then
    echo "chocolatey"
  elif [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "nvm"
  elif command -v nvm >/dev/null 2>&1; then
    echo "nvm-windows"
  else
    echo "unknown"
  fi
}

INSTALL_METHOD=$(detect_install_method)

# For nvm-based installs
if [[ "$INSTALL_METHOD" == "nvm" ]] || [[ "$INSTALL_METHOD" == "nvm-windows" ]]; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || { echo "nvm not found"; exit 1; }
fi

cd "${WORK_DIR:-.}" || exit 1

# Parse --global flag (default: false)
SET_GLOBAL="${SET_GLOBAL:-false}"

set_global_persist() {
  local node_ver="$1"
  
  if [[ "$SET_GLOBAL" != "true" ]]; then
    return 0
  fi
  
  case "$INSTALL_METHOD" in
    nvm)
      # Set nvm alias
      nvm alias default "$node_ver"
      
      # Update shell RC files to auto-load this version
      for rc in "$HOME/.zshrc" "$HOME/.bashrc"; do
        [ -f "$rc" ] || continue
        
        # Remove old fw-setup-use lines
        sed -i.bak '/# fw-setup-use --global/d' "$rc" 2>/dev/null || sed -i '' '/# fw-setup-use --global/d' "$rc" 2>/dev/null
        
        # Add new line
        echo "" >> "$rc"
        echo "# fw-setup-use --global (auto-set Node $node_ver)" >> "$rc"
        echo "export NVM_DIR=\"\$HOME/.nvm\"" >> "$rc"
        echo "[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"" >> "$rc"
        echo "nvm use $node_ver >/dev/null 2>&1 || true" >> "$rc"
      done
      echo "✓ Set as global default: nvm alias + updated ~/.zshrc and ~/.bashrc"
      ;;
      
    nvm-windows)
      # Windows nvm uses different command
      nvm alias default "$node_ver"
      echo "✓ Set as global default for nvm-windows"
      ;;
      
    homebrew|chocolatey)
      echo "✓ Already global (Homebrew/Chocolatey installs are system-wide)"
      ;;
      
    *)
      echo "⚠ Unknown install method; skipping global persistence"
      ;;
  esac
}

pick_node() {
  case "${STACK:-auto}" in
    auto)
      if [ -f .nvmrc ]; then
        nvm use
      else
        echo "No .nvmrc here; pass stack: 10 (or 24.11) or 9 (or 18), or use --write-nvmrc"
        exit 2
      fi
      ;;
    10|24.11)
      if [[ "$INSTALL_METHOD" == "nvm" ]] || [[ "$INSTALL_METHOD" == "nvm-windows" ]]; then
        nvm install 24.11 2>/dev/null || true
        nvm use 24.11
        set_global_persist "24.11"
      else
        echo "Node version switching not supported for $INSTALL_METHOD installations"
        echo "FDK version is system-wide"
      fi
      ;;
    9|18)
      if [[ "$INSTALL_METHOD" == "nvm" ]] || [[ "$INSTALL_METHOD" == "nvm-windows" ]]; then
        nvm install 18 2>/dev/null || true
        nvm use 18
        set_global_persist "18"
      else
        echo "Node version switching not supported for $INSTALL_METHOD installations"
        echo "FDK version is system-wide"
      fi
      ;;
    *)
      echo "Unknown STACK=${STACK:-}"
      exit 1
      ;;
  esac
}

pick_node

echo "=== workspace use ==="
echo "PWD=$(pwd)"
NODE_VER=$(node --version 2>&1)
echo "node: $NODE_VER"

if command -v fdk >/dev/null 2>&1; then
  # Parse FDK version (handles both "Installed: X.Y.Z" and "X.Y.Z" formats)
  FDK_OUT=$(fdk version 2>&1)
  FDK_VER=$(echo "$FDK_OUT" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
  echo "fdk: $FDK_VER"
  
  # Extract major versions for compatibility check
  NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v\([0-9]*\)\..*/\1/')
  FDK_MAJOR=$(echo "$FDK_VER" | sed 's/\([0-9]*\)\..*/\1/')
  
  # Check for version mismatch: Node 24.x works with any FDK 10.y, Node 18.x works with any FDK 9.y
  if [[ "$NODE_MAJOR" == "24" ]] && [[ "$FDK_MAJOR" == "9" ]]; then
    echo ""
    echo "WARNING: Node 24.x + FDK 9.x mismatch"
    echo "Node 24.x requires FDK 10.x (any 10.y version)"
    echo "Action: /fw-setup-install or /fw-setup-upgrade for FDK 10.x"
  elif [[ "$NODE_MAJOR" == "18" ]] && [[ "$FDK_MAJOR" == "10" ]]; then
    echo ""
    echo "WARNING: Node 18.x + FDK 10.x mismatch"
    echo "Node 18.x requires FDK 9.x (deprecated) OR switch to Node 24.x"
    echo "Action: /fw-setup-use 10 (switch to Node 24) OR /fw-setup-downgrade (FDK 9.x)"
  fi
else
  echo "fdk: MISSING on Node $NODE_VER"
  echo ""
  NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v\([0-9]*\)\..*/\1/')
  if [[ "$NODE_MAJOR" == "24" ]]; then
    echo "Recommended: /fw-setup-install (installs any FDK 10.x on Node 24.x)"
  elif [[ "$NODE_MAJOR" == "18" ]]; then
    echo "For Node 18: /fw-setup-downgrade (installs FDK 9.x, deprecated)"
    echo "Recommended: /fw-setup-use 10 (switch to Node 24.x + FDK 10.x)"
  else
    echo "Unknown Node version. Use /fw-setup-install for FDK 10.x on Node 24.x"
  fi
fi
echo "====================="
```

**Additional flags:**

- **`--write-nvmrc`**: After choosing **STACK** **`10`**/**`24.11`** write **`24.11`** to **`.nvmrc`**; for **`9`**/**`18`** write **`18`**, then **`nvm use`** again.
- **`--global`**: Run **`nvm alias default <version>`** to set chosen Node as default for all new shells.

**Scope summary:**

| Command | Current shell | New shells (macOS/Linux) | New shells (Windows) | .nvmrc file |
|---------|---------------|-------------------------|---------------------|-------------|
| `/fw-setup-use 10` | ✅ Node 24 | ❌ Unchanged | ✅ Node 24 (session PATH; symlink unchanged)** | ❌ Not created |
| `/fw-setup-use 10 --global` | ✅ Node 24 | ✅ Node 24 (default) | ✅ Node 24 (default) | ❌ Not created |
| `/fw-setup-use 10 --write-nvmrc` | ✅ Node 24 | ❌ Unchanged | ✅ Node 24 (session PATH; symlink unchanged)** | ✅ Created (24.11) |
| `/fw-setup-use 10 --global --write-nvmrc` | ✅ Node 24 | ✅ Node 24 (default) | ✅ Node 24 (default) | ✅ Created (24.11) |

**Windows nvm-windows:** when following this command file, use **`fw-setup-use.ps1`** for the non-`--global` rows so new shells stay on the prior default symlink while the current session picks up the right `node`/`npm` globals (including `fdk`). **`fw-setup-use.ps1`** now auto-detects installation method (Chocolatey → Homebrew → nvm-windows) and handles `--global` flag appropriately:
- **Chocolatey/Homebrew with `--global`**: prints confirmation message ("Already global")
- **Chocolatey/Homebrew without `--global`**: prints warning message (system-wide, no per-session switching)
- **nvm-windows with `--global`**: runs `nvm use` + `nvm alias default` (persists symlink)
- **nvm-windows without `--global`**: session-only PATH change (no symlink flip)

**Closeout:** No **`fdk run`** / tunnel. This command modifies shell state and optionally **`.nvmrc`** / **nvm default alias**.

**See also:** **`references/macos.md`** (**.nvmrc**), **`references/cross-scenarios.md`** (multi-project switching), **`references/error-command-not-found.md`**.

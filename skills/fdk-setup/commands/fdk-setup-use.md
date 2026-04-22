---
name: fdk-setup-use
description: Workspace FDK stack switch — nvm use from .nvmrc or explicit 10/9 (Node 24.11 vs 18); optional --write-nvmrc
always: true
argument-hint: "[10|9|24.11|18] [--write-nvmrc] [directory]"
---

# FDK setup — use (`/fdk-setup-use`)

Confluence-style **`/fdk-setup use`**: align **this shell** (and optionally **`.nvmrc`**) with the **Node + FDK** stack the workspace needs. **Does not** install or change FDK semver by itself — if **`fdk`** is missing on the chosen Node, route to **`/fdk-setup-install`**, **`/fdk-setup-upgrade`**, or **`/fdk-setup-downgrade`**.

## When to use

- After **`cd`** into an app, **`fdk`** is missing or the wrong major → usually **wrong active Node** (global npm prefix).
- Switching between a **FDK 10** app (Node **24.11**) and a **FDK 9** app (Node **18**) during migrations.

## Behaviour (agent routing)

| User intent | What to do |
|-------------|------------|
| **`/fdk-setup-use`** only, **`.nvmrc`** present | **`cd`** app root → load **nvm** → **`nvm use`** → **`node --version`**, **`fdk version`**. |
| **`/fdk-setup-use`** only, **no** **`.nvmrc`** | Tell user: add **`.nvmrc`** (**`24.11`** for FDK 10, **`18`** for FDK 9) or pass **`10`**, **`9`**, **`24.11`**, or **`18`**. |
| **`/fdk-setup-use 10`** or **`24.11`** | **`nvm use 24.11`** (install that line via nvm if needed), then verify **`fdk version`** is **10.x**. |
| **`/fdk-setup-use 9`** or **`18`** | **`nvm use 18`**, then verify **`fdk version`** is **9.x** (deprecated). |
| **`--write-nvmrc`** with **`10`** / **`24.11`** | Write **`.nvmrc`** containing **`24.11`**, then **`nvm use`**. |
| **`--write-nvmrc`** with **`9`** / **`18`** | Write **`.nvmrc`** containing **`18`**, then **`nvm use`**. |
| Path at end (e.g. **`/fdk-setup-use 10 ./my-app`**) | **`cd`** that directory first; same rules. |

**Pinned FDK semver** (e.g. exactly **10.1.0**) still requires **`/fdk-setup-install --version`** or **`/fdk-setup-upgrade --to`** once Node matches.

## Per-app checklist (run in order)

1. **`cd`** to app root (directory with **`manifest.json`**, if any).
2. If **`.nvmrc`** missing and user wants FDK 10 line → recommend **`24.11`** (not bare **`24`**, avoids drift off **24.11**).
3. **`export NVM_DIR="$HOME/.nvm"`** and **`[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`**.
4. **`nvm use`** (reads **`.nvmrc`**) or **`nvm use 24.11`** / **`nvm use 18`** per table above.
5. **`node --version`** and **`fdk version`** — **10.x** with Node **24.x** (prefer **24.11**), **9.x** with **v18.x**.
6. **TROUBLESHOOT mismatched stacks** (e.g., 2 Nodes but only 1 FDK):
   - If **Node 24.11 + Node 18** both present but **FDK only on one**:
     - **STOP and ask user:** "You have Node 24.11 and Node 18, but FDK is only installed on Node X. Would you like me to install FDK on the missing Node version? (yes/no)"
     - **If yes:** Use `/fdk-setup-install X.Y.Z` (for FDK 10.x on Node 24) or `/fdk-setup-downgrade X.Y.Z` (for FDK 9.x on Node 18)
     - **After install:** Re-run `nvm use` and verify both `node --version` and `fdk version` match expected stack
   - If **`fdk`** completely missing: Route to **`/fdk-setup-install`** (FDK 10) or **`/fdk-setup-downgrade`** (FDK 9)

## Execution (inline only — no Task)

Before running the block, set shell variables (or inline the values):

- **`WORK_DIR`** — app root (default **`.`**); use the path the user gave (absolute or relative).
- **`STACK`** — **`auto`** (use **`.nvmrc`** only), **`10`** or **`24.11`**, **`9`** or **`18`**.

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || { echo "nvm not found"; exit 1; }

cd "${WORK_DIR:-.}" || exit 1

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
      nvm install 24.11 2>/dev/null || true
      nvm use 24.11
      ;;
    9|18)
      nvm install 18 2>/dev/null || true
      nvm use 18
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
  FDK_VER=$(fdk version 2>&1 | head -1)
  echo "fdk: $FDK_VER"
  
  # Check for version mismatch
  if [[ "$NODE_VER" =~ ^v24\. ]] && [[ "$FDK_VER" =~ ^9\. ]]; then
    echo ""
    echo "WARNING: Node 24 + FDK 9.x mismatch detected"
    echo "Expected: FDK 10.x for Node 24"
    echo "Action: Use /fdk-setup-install or /fdk-setup-upgrade for FDK 10.x"
  elif [[ "$NODE_VER" =~ ^v18\. ]] && [[ "$FDK_VER" =~ ^10\. ]]; then
    echo ""
    echo "WARNING: Node 18 + FDK 10.x mismatch detected"
    echo "Expected: FDK 9.x for Node 18 (deprecated) OR switch to Node 24"
    echo "Action: Use /fdk-setup-use 10 (switch to Node 24) OR /fdk-setup-downgrade (FDK 9 on Node 18)"
  fi
else
  echo "fdk: MISSING on Node $NODE_VER"
  echo ""
  if [[ "$NODE_VER" =~ ^v24\. ]]; then
    echo "Recommended: /fdk-setup-install (installs FDK 10.x on Node 24)"
  elif [[ "$NODE_VER" =~ ^v18\. ]]; then
    echo "For Node 18: /fdk-setup-downgrade (installs FDK 9.x, deprecated)"
    echo "Recommended: /fdk-setup-use 10 (switch to Node 24 + FDK 10)"
  else
    echo "Unknown Node version. Use /fdk-setup-install for FDK 10.x on Node 24"
  fi
fi
echo "====================="
```

If user passed **`--write-nvmrc`**, after choosing **STACK** **`10`**/**`24.11`** write **`24.11`** to **`.nvmrc`**; for **`9`**/**`18`** write **`18`**, then **`nvm use`** again.

**Closeout:** No **`fdk run`** / tunnel. This command is **read-only** except for optional **`.nvmrc`** creation.

**See also:** **`references/macos.md`** (**.nvmrc**), **`references/cross-scenarios.md`** (multi-project switching), **`references/error-command-not-found.md`**.

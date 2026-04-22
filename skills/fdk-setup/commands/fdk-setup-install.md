---
name: fdk-setup-install
description: Install FDK 10 with Node.js 24 via nvm (Confluence /fdk-setup install); optional --version X.Y.Z pins CDN tarball
always: true
argument-hint: "[--version X.Y.Z]"
---

# FDK setup — install (`/fdk-setup-install`)

Confluence **`/fdk-setup install`**. Optional **`--version X.Y.Z`** pins a **FDK 10.x.y** build from the CDN (`vX.Y.Z.tgz`). Omitting it installs the **latest FDK 10 line** for Node 24 (`latest-v24.tgz`).

## Behaviour

| User intent | `__FDK_INSTALL_VERSION__` (see below) | FDK tarball | Node |
|-------------|--------------------------------------|-------------|------|
| `/fdk-setup-install` (no flag) | `latest` | `https://cdn.freshdev.io/fdk/latest-v24.tgz` | 24.11 |
| `/fdk-setup-install --version 10.1.0` | `10.1.0` (strip leading `v`) | `https://cdn.freshdev.io/fdk/v10.1.0.tgz` | 24.11 |

- **FDK 9.x** is **not** installed via this command — use **`/fdk-setup-downgrade`** (or **`/fdk-setup-upgrade --to 9.x.y`** if already on nvm 18).
- **Pinned install** uses **nvm + CDN** only (do not use Homebrew/Chocolatey for a semver pin — they do not map to `vX.Y.Z.tgz`).
- On **macOS**, for **latest only**, you may still follow **`references/macos.md`** (Homebrew) **outside** this Task if the user explicitly wants brew; this Task is the **canonical** reproducible path.

## Agent pre-step

Replace **`__FDK_INSTALL_VERSION__`** in the Task prompt with:

- **`latest`** — no `--version` / user asked for default FDK 10 line.
- **`10.x.y`** — from **`--version`** or phrases like “install FDK 10.1.0”. Normalize: strip leading **`v`**.

Reject **`9.*`** here; tell the user to use **`/fdk-setup-downgrade`**.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install FDK 10 with Node 24 (optional pinned semver)",
  prompt: `
Install FDK 10 with Node 24.11 using nvm + Freshworks CDN tarball only.

FDK_VER="__FDK_INSTALL_VERSION__"
# Host must replace token: "latest" OR "10.1.0" (FDK 10 semver only)

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

if [[ "$FDK_VER" =~ ^9\\. ]]; then
  echo "REFUSE: FDK 9.x is not installed via /fdk-setup-install. Use /fdk-setup-downgrade or /fdk-setup-upgrade --to 9.x.y on Node 18."
  exit 1
fi

if [[ "$FDK_VER" == latest ]]; then
  FDK_URL="https://cdn.freshdev.io/fdk/latest-v24.tgz"
else
  FDK_URL="https://cdn.freshdev.io/fdk/v${FDK_VER}.tgz"
fi

HTTP=$(curl -sS -o /dev/null -w "%{http_code}" -L -I "$FDK_URL" || echo "000")
[[ "$HTTP" == "200" ]] || { echo "FAILED: tarball not reachable (HTTP $HTTP): $FDK_URL"; exit 1; }

echo "OS: $(uname -s)"
echo "Installing from: $FDK_URL"

nvm install 24.11 2>/dev/null || true
nvm use 24.11
nvm alias default 24.11

npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force

npm install -g "$FDK_URL" || exit 1

MANDATORY VERIFICATION (ALL 7 TESTS MUST PASS):
  fdk version || echo "FAILED: FDK not in current shell"
  fdk version | grep -E '^10\\.' || echo "FAILED: Wrong FDK major (expected 10.x)"
  zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 24.11 >/dev/null; fdk version' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 24.11 >/dev/null; fdk version' || echo "FAILED: FDK not persistent"
  node --version | grep "v24\\.11\\." || echo "WARNING: Node 24.11.x recommended for FDK 10.1.0+"
  nvm current | grep "24" || echo "FAILED: nvm not using Node 24"
  npm list -g fdk 2>&1 | grep "empty" || npm list -g fdk || echo "INFO: legacy fdk package check"
  npm list -g @freshworks/fdk --depth=0 | grep "@freshworks/fdk@10" || echo "FAILED: @freshworks/fdk@10 not installed"

REPORT FORMAT:
  [VALID] FDK installed successfully
  Tarball: $FDK_URL
  FDK version: $(fdk version 2>&1)
  Node version: $(node --version 2>&1)

CRITICAL: If ANY mandatory test fails, do not say "installation complete".

SLASH_COMMAND_CLOSEOUT: After verification and final REPORT (or abort), return from this shell Task immediately. Do not start fdk run, fdk tunnel, tail -f, watchers, or dev servers from this Task.
  `
})
```

**Legacy alias:** **`/fdk-install`**.

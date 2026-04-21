---
name: fdk-setup-migrate
description: Migrate FDK 9.x + Node 18 → FDK 10.x + Node 24.11 (Confluence /fdk-setup migrate)
always: true
---

# FDK setup — migrate (`/fdk-setup-migrate`)

Confluence **`/fdk-setup migrate`**: move from **FDK 9.x / Node 18** to **FDK 10.x / Node 24.11** for Platform 3.0 + publishing.

Preserves **Node 18** in nvm for legacy projects; sets **default** to Node **24.11** for FDK 10.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Migrate FDK 9 to FDK 10 with Node 24.11",
  prompt: `
Migrate from FDK 9.x (Node 18) to FDK 10.x (Node 24.11).

DETECTION:
  echo "FDK: $(fdk version 2>&1)"
  echo "Node: $(node --version 2>&1)"
  command -v nvm || echo "nvm missing — install nvm first (see SKILL.md)"

SUMMARY TO USER:
  echo "This will: uninstall FDK 9 globals, install Node 24.11 + FDK 10 from CDN, set nvm default to 24.11."
  echo "Node 18 remains available via: nvm use 18"
  read -p "Continue migration? (y/N): " c
  [[ "$c" == [yY]* ]] || { echo "Cancelled"; exit 0; }

# Ensure nvm loaded in non-interactive shells
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install Node 24.11 alongside 18
nvm install 24.11
nvm use 24.11

# Remove FDK from active Node (may be 9 on 18 or mixed)
npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force

# Install FDK 10 line from CDN (NOT latest.tgz on Node 24)
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

# Default shell uses FDK 10 stack
nvm alias default 24.11
nvm alias fdk 24.11 2>/dev/null || true

VERIFICATION:
  fdk version | grep -E '^10\\.' || { echo "FAILED: expected FDK 10.x"; exit 1; }
  node --version | grep "v24\\.11\\." || echo "WARNING: prefer v24.11.x"
  zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 24.11 >/dev/null; fdk version' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 24.11 >/dev/null; fdk version'

REPORT:
  echo "Migration complete: FDK 10.x on Node 24.11 (default)."
  echo "Switch back to Node 18 only for legacy: nvm use 18"
  echo "Pin exact FDK later: /fdk-setup-upgrade --to 10.x.y"

SLASH_COMMAND_CLOSEOUT: Return after REPORT. Do not start fdk run / tunnel inside this Task.
  `
})
```

For edge cases (PATH, multiple nodes, brew), load **`references/cross-scenarios.md`** Scenario 1.

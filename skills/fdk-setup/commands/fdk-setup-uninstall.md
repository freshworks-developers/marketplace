---
name: fdk-setup-uninstall
description: Uninstall FDK completely — keeps Node.js and nvm (Confluence /fdk-setup uninstall)
always: true
---

# FDK setup — uninstall (`/fdk-setup-uninstall`)

Confluence **`/fdk-setup uninstall`**: removes **FDK and `~/.fdk` cache` only** — **Node.js and nvm stay installed**. There is **no** **`uninstall --all`** in this skill (no automated removal of nvm / all Node versions).

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Uninstall FDK completely",
  prompt: `
Completely remove FDK and all artifacts.

DETECTION:
  fdk version || echo "not installed"
  ls ~/.fdk || echo "no cache"

COMPLETE REMOVAL:
  npm uninstall -g @freshworks/fdk 2>/dev/null || true
  npm uninstall -g fdk 2>/dev/null || true
  npm uninstall -g @freshworks/fdk --force 2>/dev/null || true
  rm -rf ~/.fdk
  npm cache clean --force

MANUAL CLEANUP (if npm fails):
  NPM_PREFIX=$(npm config get prefix)
  rm -f "$NPM_PREFIX/bin/fdk"
  rm -rf "$NPM_PREFIX/lib/node_modules/@freshworks/fdk"
  rm -rf "$NPM_PREFIX/lib/node_modules/fdk"

SHELL CONFIG CLEANUP:
  cp ~/.zshrc ~/.zshrc.bak 2>/dev/null || true
  sed -i '/fdk/d' ~/.zshrc 2>/dev/null || sed -i '' '/fdk/d' ~/.zshrc 2>/dev/null || true

MANDATORY VERIFICATION (ALL 5 TESTS MUST PASS):
  command -v fdk && echo "FAILED: FDK still exists" || echo "PASSED"
  zsh -c 'command -v fdk' && echo "FAILED: FDK in new shell" || echo "PASSED"
  [ ! -d ~/.fdk ] || echo "FAILED: ~/.fdk still exists"
  npm list -g @freshworks/fdk 2>&1 | grep -q "empty" || echo "check npm list"
  npm list -g fdk 2>&1 | grep -q "empty" || echo "check legacy fdk"

REPORT FORMAT:
  [VALID] FDK uninstalled completely — Node and nvm preserved.

SLASH_COMMAND_CLOSEOUT: After verification and REPORT (or abort), return from this shell Task immediately.
  `
})
```

**Legacy alias:** **`/fdk-uninstall`**.

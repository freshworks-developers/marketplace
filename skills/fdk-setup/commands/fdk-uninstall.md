---
name: fdk-uninstall
description: Uninstall FDK completely (keeps Node.js and nvm)
always: true
---

# FDK Uninstall

Completely remove FDK and all artifacts.

## Critical Requirements

- Remove npm package with force fallback
- Remove ~/.fdk directory completely
- Clean npm cache
- Remove shell config references (with backup)
- Manual binary removal if npm fails
- Verify complete removal in new shell

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
  npm uninstall -g @freshworks/fdk
  npm uninstall -g @freshworks/fdk --force  # If first fails
  rm -rf ~/.fdk
  npm cache clean --force
  
MANUAL CLEANUP (if npm fails):
  NPM_PREFIX=$(npm config get prefix)
  rm -f "$NPM_PREFIX/bin/fdk"
  rm -rf "$NPM_PREFIX/lib/node_modules/@freshworks/fdk"

SHELL CONFIG CLEANUP:
  cp ~/.zshrc ~/.zshrc.bak
  sed -i '/fdk/d' ~/.zshrc

MANDATORY VERIFICATION (ALL 5 TESTS MUST PASS):
  # Test 1: FDK command removed
  command -v fdk && echo "FAILED: FDK still exists" || echo "PASSED"
  
  # Test 2: Not in new shell
  zsh -c 'command -v fdk' && echo "FAILED: FDK in new shell" || echo "PASSED"
  
  # Test 3: ~/.fdk removed
  [ ! -d ~/.fdk ] || echo "FAILED: ~/.fdk still exists"
  
  # Test 4: Not in npm global
  npm list -g @freshworks/fdk 2>&1 | grep -q "empty" || npm list -g @freshworks/fdk 2>&1 | grep -q "@freshworks/fdk" && echo "FAILED: Still in npm"
  
  # Test 5: Binary removed
  [ ! -f /usr/local/bin/fdk ] && [ ! -f ~/.local/bin/fdk ] || echo "FAILED: Binary exists"

REPORT FORMAT:
  [VALID] FDK uninstalled completely
  
  Verification: ✓ Command removed | ✓ New shell | ✓ ~/.fdk removed | ✓ npm clean | ✓ Binary removed
  
  Removed:
  - npm package: @freshworks/fdk
  - Binary: [path]
  - Cache: ~/.fdk
  - Shell config: Cleaned (backup: ~/.zshrc.bak)
  
  Preserved:
  - Node 24: [version]
  - nvm: [version]
  
  Critical test: Open NEW terminal and run: fdk version
  Expected output: command not found

CRITICAL: If ANY test fails, re-run manual cleanup steps.

SLASH_COMMAND_CLOSEOUT: After verification and final REPORT (or abort), return from this shell Task immediately. Do not start fdk run, fdk tunnel, tail -f, watchers, or dev servers from this Task.
  `
})
```

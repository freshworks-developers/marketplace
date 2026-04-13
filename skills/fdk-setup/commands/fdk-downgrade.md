---
name: fdk-downgrade
description: Downgrade FDK to specific version with global switch
always: true
argument-hint: "<version>"
---

# FDK Downgrade

Downgrade FDK to specific version and set as global default.

## Critical Requirements

- Complete uninstall of current version
- Remove ~/.fdk directory
- Install target version
- Set nvm alias default
- Update shell configuration for global persistence
- Verify in new shell

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK with global switch",
  prompt: `
Downgrade FDK to version {TARGET_VERSION} and set as global default.

CURRENT: $(fdk version)
TARGET: {TARGET_VERSION}

COMPLETE UNINSTALL:
  npm uninstall -g @freshworks/fdk
  rm -rf ~/.fdk
  npm cache clean --force

INSTALL TARGET:
  nvm use 24
  npm install -g @freshworks/fdk@{TARGET_VERSION}

GLOBAL SWITCH:
  nvm alias default 24
  echo "nvm use 24 > /dev/null 2>&1" >> ~/.zshrc
  source ~/.zshrc

MANDATORY VERIFICATION (ALL 5 TESTS MUST PASS):
  # Test 1: Version matches target
  CURRENT=$(fdk version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
  [[ "$CURRENT" == "{TARGET_VERSION}" ]] || echo "FAILED: Version mismatch"
  
  # Test 2: Works in new shell (MOST CRITICAL)
  NEW_SHELL=$(zsh -c 'fdk version' 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
  [[ "$NEW_SHELL" == "{TARGET_VERSION}" ]] || echo "FAILED: Not persistent"
  
  # Test 3: ~/.fdk removed
  [ ! -d ~/.fdk ] || echo "FAILED: ~/.fdk still exists"
  
  # Test 4: nvm default set
  nvm alias default | grep "24" || echo "FAILED: nvm default not set"
  
  # Test 5: Only one version
  npm list -g @freshworks/fdk | grep -c "@freshworks/fdk@" | grep "1" || echo "WARNING: Multiple versions"

REPORT FORMAT:
  [VALID] FDK downgraded successfully to {TARGET_VERSION}
  
  Verification: ✓ Version match | ✓ New shell | ✓ ~/.fdk removed | ✓ nvm default | ✓ Single version
  
  Changes:
  - Uninstalled: [old version]
  - Installed: {TARGET_VERSION}
  - Global switch: Active
  - Cache: Cleared
  
  Critical test: Open NEW terminal and run: fdk version
  Expected output: {TARGET_VERSION}

CRITICAL: If ANY test fails, re-run operation.
  `
})
```

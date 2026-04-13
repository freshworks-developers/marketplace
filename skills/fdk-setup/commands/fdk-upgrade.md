---
name: fdk-upgrade
description: Upgrade FDK to latest version
always: true
---

# FDK Upgrade

Upgrade FDK to latest version using official CLI.

## Critical Requirements

- Complete uninstall of current version
- Remove ~/.fdk directory
- Install latest version
- Verify in new shell
- Ensure only one version installed

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Upgrade FDK to latest",
  prompt: `
Upgrade FDK to latest version using official CLI.

CURRENT VERSION: $(fdk version)

COMPLETE UNINSTALL:
  npm uninstall -g @freshworks/fdk
  rm -rf ~/.fdk
  npm cache clean --force

INSTALL LATEST:
  npm install -g @freshworks/fdk@latest

MANDATORY VERIFICATION (ALL 4 TESTS MUST PASS):
  # Test 1: Version upgraded
  fdk version
  
  # Test 2: Works in new shell
  zsh -c 'fdk version' || bash -c 'fdk version'
  
  # Test 3: ~/.fdk removed (then recreated by new version)
  [ -d ~/.fdk ] && echo "Cache recreated by new version" || echo "WARNING: No cache"
  
  # Test 4: Only one version installed
  npm list -g @freshworks/fdk | grep -c "@freshworks/fdk@" | grep "1" || echo "WARNING: Multiple versions"

REPORT FORMAT:
  [VALID] FDK upgraded successfully
  
  Verification: ✓ Version upgraded | ✓ New shell | ✓ Cache clean | ✓ Single version
  
  Upgraded: [old] → [new]
  Node version: [version]
  
  Next steps:
  1. Run: fdk version
  2. Test: fdk create

CRITICAL: If ANY test fails, do not say "upgrade complete".

SLASH_COMMAND_CLOSEOUT: After verification and final REPORT (or abort), return from this shell Task immediately. Do not start fdk run, fdk tunnel, tail -f, watchers, or dev servers from this Task; use scripts/fdk-run-background.sh outside this Task if the user needs a server.
  `
})
```

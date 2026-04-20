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

COMPLETE UNINSTALL (both scoped and legacy):
  # Uninstall both package names (scoped and legacy)
  npm uninstall -g @freshworks/fdk 2>/dev/null
  npm uninstall -g fdk 2>/dev/null
  
  # Remove cache and config
  rm -rf ~/.fdk
  
  # Clean npm cache
  npm cache clean --force

INSTALL LATEST FDK 10:
  # CRITICAL: Use CDN tarball for FDK 10
  # Ensure Node 24.11.x for FDK 10.1.0+
  nvm use 24.11 || nvm install 24.11
  nvm alias default 24.11
  
  # Install from CDN (latest-v24.tgz = FDK 10 line)
  npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

MANDATORY VERIFICATION (ALL 6 TESTS MUST PASS):
  # Test 1: FDK 10.x installed
  fdk version | grep "^10\." || echo "FAILED: Not FDK 10.x"
  
  # Test 2: Works in new shell
  zsh -c 'fdk version' || bash -c 'fdk version'
  
  # Test 3: Node 24.11.x active
  node --version | grep "v24\.11\." || echo "WARNING: Node 24.11.x recommended"
  
  # Test 4: No legacy fdk package
  npm list -g fdk 2>&1 | grep "empty" && echo "PASS: No legacy fdk" || echo "WARNING: Legacy fdk may exist"
  
  # Test 5: @freshworks/fdk@10.x present
  npm list -g @freshworks/fdk | grep "@freshworks/fdk@10" || echo "FAILED: Wrong package version"
  
  # Test 6: Only one version per nvm Node
  npm list -g @freshworks/fdk | grep -c "@freshworks/fdk@" | grep "1" || echo "INFO: Check other nvm versions"

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

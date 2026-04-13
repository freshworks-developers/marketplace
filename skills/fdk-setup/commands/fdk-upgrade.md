---
name: fdk-upgrade
description: Upgrade FDK to latest version
always: true
---

# FDK Upgrade

Upgrade FDK to latest version using official CLI.

## Critical Requirements

- Check current version
- Upgrade to latest via npm
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

UPGRADE:
  npm install -g @freshworks/fdk@latest

MANDATORY VERIFICATION (ALL 3 TESTS MUST PASS):
  # Test 1: Version upgraded
  fdk version
  
  # Test 2: Works in new shell
  zsh -c 'fdk version' || bash -c 'fdk version'
  
  # Test 3: Only one version installed
  npm list -g @freshworks/fdk

REPORT FORMAT:
  [VALID] FDK upgraded successfully
  
  Verification: ✓ Version upgraded | ✓ New shell | ✓ Single version
  
  Upgraded: [old] → [new]
  Node version: [version]
  
  Next steps:
  1. Run: fdk version
  2. Test: fdk create

CRITICAL: If ANY test fails, do not say "upgrade complete".
  `
})
```

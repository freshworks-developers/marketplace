---
name: fdk-install
description: Install FDK 10 with Node.js 24 via nvm
always: true
---

# FDK Install

Install FDK 10 with Node 24 using official Freshworks CLI.

## Critical Requirements

- Install nvm if not present
- Install Node.js 24.x via nvm
- Install FDK globally via npm
- Configure shell for persistence
- Verify in new shell (not just current shell)

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install FDK with Node 24",
  prompt: `
Install FDK 10 with Node 24 using official Freshworks CLI.

DETECTION:
- OS: $(uname -s)
- nvm: $(command -v nvm || echo "missing")
- Node: $(node --version || echo "missing")

INSTALLATION METHOD:

macOS (Homebrew - RECOMMENDED):
  brew tap freshworks-developers/homebrew-tap
  brew install fdk
  
Windows (Chocolatey):
  choco install fdk
  
Linux/Manual (nvm + npm - CDN tarball):
  # CRITICAL: Use CDN tarball, NOT npm registry
  # @freshworks/fdk is NOT on registry.npmjs.org
  
  # Install Node 24.11.x (FDK 10.1.0+ requires 24.11.x specifically)
  nvm install 24.11
  nvm use 24.11
  nvm alias default 24.11
  
  # Remove any legacy FDK installations
  npm uninstall -g @freshworks/fdk 2>/dev/null
  npm uninstall -g fdk 2>/dev/null
  rm -rf ~/.fdk
  
  # Install FDK 10 from CDN (latest-v24.tgz = FDK 10 line)
  npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz
  
  # Verify correct version
  fdk version  # Should show 10.x.x

MANDATORY VERIFICATION (ALL 7 TESTS MUST PASS):
  # Test 1: FDK accessible in current shell
  fdk version || echo "FAILED: FDK not in current shell"
  
  # Test 2: FDK version is 10.x (not 9.x)
  fdk version | grep "^10\." || echo "FAILED: Wrong FDK version (not 10.x)"
  
  # Test 3: FDK accessible in new shell (CRITICAL)
  zsh -c 'fdk version' || bash -c 'fdk version' || echo "FAILED: FDK not persistent"
  
  # Test 4: Node version correct (24.11.x for FDK 10.1.0+)
  node --version | grep "v24\.11\." || echo "WARNING: Node 24.11.x recommended for FDK 10.1.0+"
  
  # Test 5: nvm configured
  nvm current | grep "24" || echo "FAILED: nvm not using Node 24"
  
  # Test 6: Check for legacy fdk package
  npm list -g fdk 2>&1 | grep "empty" || npm list -g fdk || echo "INFO: Legacy fdk package check"
  
  # Test 7: Check @freshworks/fdk package
  npm list -g @freshworks/fdk | grep "@freshworks/fdk@10" || echo "FAILED: @freshworks/fdk not installed or wrong version"

REPORT FORMAT:
  [VALID] FDK installed successfully
  
  Verification: ✓ Current shell | ✓ New shell | ✓ Node 24 | ✓ nvm configured | ✓ Global access
  
  Installation: [method]
  FDK version: [version]
  Node version: [version]
  
  Next steps:
  1. Restart terminal (or source ~/.zshrc)
  2. Run: fdk version
  3. Create app: fdk create

CRITICAL: If ANY test fails, do not say "installation complete".

SLASH_COMMAND_CLOSEOUT: After verification and final REPORT (or abort), return from this shell Task immediately. Do not start fdk run, fdk tunnel, tail -f, watchers, or dev servers from this Task; use scripts/fdk-run-background.sh outside this Task if the user needs a server.
  `
})
```

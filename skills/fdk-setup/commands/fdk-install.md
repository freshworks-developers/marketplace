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

macOS (Homebrew):
  brew tap freshworks/tap
  brew install fdk
  
Windows (Chocolatey):
  choco install fdk
  
Linux/Manual (nvm + npm):
  nvm install 24
  nvm use 24
  nvm alias default 24
  npm install -g @freshworks/fdk

MANDATORY VERIFICATION (ALL 5 TESTS MUST PASS):
  # Test 1: FDK accessible in current shell
  fdk version || echo "FAILED: FDK not in current shell"
  
  # Test 2: FDK accessible in new shell (CRITICAL)
  zsh -c 'fdk version' || bash -c 'fdk version' || echo "FAILED: FDK not persistent"
  
  # Test 3: Node version correct
  node --version | grep "v24" || echo "FAILED: Wrong Node version"
  
  # Test 4: nvm configured
  nvm current | grep "24" || echo "FAILED: nvm not using Node 24"
  
  # Test 5: FDK globally accessible
  which fdk || echo "FAILED: FDK not in PATH"

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

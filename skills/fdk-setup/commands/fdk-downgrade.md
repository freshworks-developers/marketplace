---
name: fdk-downgrade
description: Downgrade FDK 10.x to 9.x with deprecation warnings and global switch
always: true
argument-hint: "[9.x.x]"
---

# FDK Downgrade

Downgrade from FDK 10.x (Node 24) to FDK 9.x (Node 18) with complete cleanup and global switch.

**DEPRECATION WARNING:** FDK 9.x + Node 18.x support ends March 2026.

## Critical Requirements

- Show deprecation warning before proceeding
- Complete uninstall of FDK 10.x
- Remove ~/.fdk directory
- Install Node 18 and FDK 9.x
- Set nvm alias default to Node 18
- Update shell configuration for global persistence
- Verify in new shell
- Warn that publishing requires FDK 10.x

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK 10.x to 9.x with warnings",
  prompt: `
Downgrade from FDK 10.x (Node 24) to FDK 9.x (Node 18) for Platform 3.0 development.

DEPRECATION WARNING TO USER:
echo "========================================="
echo "WARNING: FDK 9.x + Node 18.x DEPRECATED"
echo "========================================="
echo ""
echo "Support ends: March 2026"
echo ""
echo "Limitations:"
echo "- Development: Allowed for Platform 3.0 apps"
echo "- Publishing: NOT SUPPORTED (requires FDK 10.x + Node 24.x)"
echo "- Recommendation: Use FDK 10.x for all new development"
echo ""
read -p "Continue with FDK 9.x downgrade? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
  echo "Downgrade cancelled."
  exit 0
fi

CURRENT: $(fdk version)
TARGET: FDK 9.x (latest or specified version)

COMPLETE UNINSTALL OF FDK 10.x:
  # Switch to Node 24 first
  nvm use 24
  
  # Uninstall npm package
  npm uninstall -g @freshworks/fdk
  
  # Remove FDK cache and config
  rm -rf ~/.fdk
  
  # Clean npm cache
  npm cache clean --force
  
  # Verify removal
  fdk version 2>&1 | grep "command not found" || echo "WARNING: FDK still exists"

INSTALL NODE 18:
  # Check if Node 18 exists
  nvm list | grep v18 || nvm install 18
  
  # Switch to Node 18
  nvm use 18
  
  # Verify
  node --version

INSTALL FDK 9.x:
  # CRITICAL: Use latest.tgz for FDK 9 line (NOT latest-v24.tgz)
  # @freshworks/fdk@9 is NOT on npm registry
  npm install -g https://cdn.freshdev.io/fdk/latest.tgz
  
  # Verify installation
  fdk version | grep "^9\." || echo "FAILED: Not FDK 9.x"

GLOBAL SWITCH TO NODE 18:
  # Set nvm default to Node 18
  nvm alias default 18
  nvm alias fdk 18
  
  # Update shell config
  SHELL_RC="$HOME/.zshrc"
  [ -f "$HOME/.bashrc" ] && SHELL_RC="$HOME/.bashrc"
  
  # Backup shell config
  cp "$SHELL_RC" "$SHELL_RC.bak.$(date +%Y%m%d_%H%M%S)"
  
  # Remove old FDK references
  sed -i.tmp '/nvm use 24/d' "$SHELL_RC"
  sed -i.tmp '/nvm use fdk/d' "$SHELL_RC"
  rm -f "$SHELL_RC.tmp"
  
  # Add Node 18 reference
  echo "" >> "$SHELL_RC"
  echo "# FDK 9.x (Node 18) - DEPRECATED, ends March 2026" >> "$SHELL_RC"
  echo "nvm use 18 > /dev/null 2>&1" >> "$SHELL_RC"
  
  # Source shell
  source "$SHELL_RC"

MANDATORY VERIFICATION (ALL 5 TESTS MUST PASS):
  # Test 1: FDK 9.x installed
  fdk version | grep "^9\." || echo "FAILED: Not FDK 9.x"
  
  # Test 2: Node 18 active
  node --version | grep "^v18\." || echo "FAILED: Not Node 18"
  
  # Test 3: Works in new shell
  zsh -c 'fdk version' | grep "^9\." || echo "FAILED: Not persistent"
  
  # Test 4: ~/.fdk removed
  [ ! -d ~/.fdk ] || echo "FAILED: ~/.fdk still exists"
  
  # Test 5: nvm default set to 18
  nvm alias default | grep "18" || echo "FAILED: nvm default not set"

REPORT FORMAT:
  echo ""
  echo "========================================="
  echo "FDK Downgrade Complete"
  echo "========================================="
  echo ""
  echo "Previous: FDK 10.x + Node 24.x"
  echo "Current:  FDK 9.x + Node 18.x"
  echo ""
  echo "IMPORTANT REMINDERS:"
  echo "- FDK 9.x support ends March 2026"
  echo "- Publishing requires FDK 10.x + Node 24.x"
  echo "- Use for development only"
  echo ""
  echo "To upgrade back to FDK 10.x:"
  echo "  /fdk-upgrade"
  echo ""
  echo "Verification: Open NEW terminal and run: fdk version"
  echo "Expected: 9.x.x"

CRITICAL: If ANY test fails, re-run operation.

SLASH_COMMAND_CLOSEOUT: After verification and final REPORT (or abort), return from this shell Task immediately. Do not start fdk run, fdk tunnel, tail -f, watchers, or dev servers from this Task; use scripts/fdk-run-background.sh outside this Task if the user needs a server.
  `
})
```

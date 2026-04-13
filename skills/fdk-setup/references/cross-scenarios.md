# Cross-Scenario FDK Setup: Detailed Subagent Specifications

> **Platform 3.0 Development:** Supports FDK 10.x (Node 24, recommended) and FDK 9.x (Node 18, deprecated March 2026). Publishing requires FDK 10.x.

## Table of Contents

1. [Existing Node Installation](#scenario-1-existing-node)
2. [Downgrade to FDK 9.x (Deprecated)](#scenario-2-downgrade-to-fdk-9x)
3. [Troubleshooting Broken FDK](#scenario-3-troubleshooting)
4. [Install Specific FDK Version](#scenario-4-install-specific-fdk-version)
5. [Node PATH Mismatch](#scenario-5-node-path-mismatch)
6. [Multiple Node Versions (Team Development)](#scenario-6-multiple-node-versions-team-development)

---

## Scenario 1: Existing Node Installation

### Context

User has:
- System Node.js (20.x or 22.x) installed via Homebrew/apt/direct installer
- Not using nvm
- Wants to add FDK without breaking existing Node setup

### Strategy

Install nvm alongside system Node, use nvm only for FDK, keep system Node as default.

### Subagent Prompt

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install FDK with nvm alongside system Node",
  prompt: `Install FDK 10 + Node 24 via nvm on system with existing Node installation.

CONTEXT:
- User has system Node (not via nvm)
- Wants to add FDK without breaking existing setup
- System Node should remain default for other projects

DETECTION:
1. Check existing Node:
   which node
   node --version

2. Check if via nvm:
   echo $NVM_DIR
   nvm --version 2>/dev/null || echo "nvm not found"

3. Check Node installation method:
   if [[ $(which node) == *"nvm"* ]]; then
     echo "Node via nvm"
   elif [[ $(which node) == *"homebrew"* ]] || [[ $(which node) == *"/usr/local"* ]]; then
     echo "Node via Homebrew"
   elif [[ $(which node) == *"/usr/bin"* ]]; then
     echo "Node via system package manager"
   else
     echo "Node via direct installer"
   fi

NVM INSTALLATION (Don't touch system Node):
4. Install nvm:
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

5. Source nvm in current shell:
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

6. Verify nvm:
   nvm --version

NODE 24 INSTALLATION:
7. Install Node 24 via nvm:
   nvm install 24

8. Create FDK alias:
   nvm alias fdk 24

9. Verify Node 24:
   nvm use fdk
   node --version

PATH PRIORITY CONFIGURATION:
10. Configure shell to use system Node by default:
    cat >> ~/.zshrc << 'EOF'

# nvm setup (for FDK only)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Alias to switch to FDK environment
alias fdk-env='nvm use fdk && echo "FDK environment (Node 24)"'

# Keep system Node as default (don't auto-switch)
# Use 'fdk-env' command to switch to FDK Node 24
EOF

11. Source shell config:
    source ~/.zshrc

FDK INSTALLATION:
12. Switch to Node 24:
    nvm use fdk

13. Install FDK:
    npm install https://cdn.freshdev.io/fdk/latest.tgz -g

14. Verify FDK:
    fdk version

VERIFICATION:
15. Test isolation:
    # System Node (default)
    which node
    node --version

    # FDK Node 24
    fdk-env
    which node
    node --version
    fdk version

SETUP REPORT:
Print summary:
✓ System Node preserved: [system node version]
✓ nvm installed
✓ Node 24 installed via nvm
✓ FDK 10.x installed on Node 24
✓ No conflicts

USAGE:
- Default: System Node ([version])
- FDK commands: Use 'fdk-env' first
  $ fdk-env
  $ fdk validate
  $ fdk run

BENEFITS:
- System Node untouched
- FDK isolated in nvm
- No PATH conflicts
- Easy to remove (just delete ~/.nvm)

ERROR HANDLING:
- If nvm conflicts with system Node: Check $PATH order
- If FDK not found: Run 'fdk-env' first
- If npm permission issues: Use nvm Node, not system Node
`
})
```

---

## Scenario 2: Downgrade to FDK 9.x (Deprecated)

### Context

User needs to:
- Downgrade from FDK 10.x to FDK 9.x
- Work on legacy project requiring FDK 9.x
- Understand deprecation timeline and limitations

**DEPRECATION NOTICE:** FDK 9.x + Node 18.x support ends March 2026.

### Goals

- Show clear deprecation warning
- Complete uninstall of FDK 10.x
- Install Node 18 and FDK 9.x
- Set global version to FDK 9.x
- Warn that publishing requires FDK 10.x

### Subagent Prompt

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK 10.x to 9.x with warnings",
  prompt: `Downgrade from FDK 10.x (Node 24) to FDK 9.x (Node 18).

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

CURRENT SETUP DETECTION:
1. Check current FDK:
   fdk version

2. Check current Node:
   node --version

3. Check nvm:
   nvm --version

FDK 10.x COMPLETE UNINSTALLATION:
4. Switch to Node 24:
   nvm use 24

5. Completely uninstall FDK 10.x:
   echo "Completely removing FDK 10.x..."
   
   npm uninstall @freshworks/fdk -g
   rm -rf ~/.fdk
   npm cache clean --force

6. Verify complete removal:
   fdk version 2>&1 | grep "command not found" && echo "FDK 10.x completely removed"
   [ ! -d ~/.fdk ] && echo "~/.fdk directory removed"

NODE 18 INSTALLATION:
7. Check if Node 18 already installed:
   nvm list | grep v18

8. Install Node 18 if not present:
   nvm install 18

9. Switch to Node 18:
   nvm use 18
   node --version

FDK 9.x INSTALLATION:
10. Install FDK 9.x:
    npm install -g @freshworks/fdk@9

11. Verify installation:
    fdk version

GLOBAL VERSION SWITCH:
12. Update default nvm alias to Node 18:
    nvm alias default 18
    nvm alias fdk 18

13. Update shell config for global switch:
    SHELL_RC="$HOME/.zshrc"
    [ -f "$HOME/.bashrc" ] && SHELL_RC="$HOME/.bashrc"
    
    cp "$SHELL_RC" "$SHELL_RC.bak.$(date +%Y%m%d_%H%M%S)"
    
    sed -i.tmp '/nvm use 24/d' "$SHELL_RC"
    sed -i.tmp '/nvm use fdk/d' "$SHELL_RC"
    rm -f "$SHELL_RC.tmp"
    
    echo "" >> "$SHELL_RC"
    echo "# FDK 9.x (Node 18) - DEPRECATED, ends March 2026" >> "$SHELL_RC"
    echo "nvm use 18 > /dev/null 2>&1" >> "$SHELL_RC"

14. Source shell and verify:
    source "$SHELL_RC"
    bash -c 'fdk version' || zsh -c 'fdk version'

VERIFICATION:
15. Test FDK 9.x:
    fdk version | grep "^9\."
    node --version | grep "^v18\."
    fdk validate --help

DOWNGRADE REPORT:
Print summary:
FDK 10.x completely uninstalled
Node 18 installed
FDK 9.x installed
Global version switched to FDK 9.x on Node 18
nvm default set to Node 18
Shell configuration updated

IMPORTANT REMINDERS:
- FDK 9.x support ends March 2026
- Publishing requires FDK 10.x + Node 24.x
- Use for development only
- Node 24 still available: nvm use 24

TO UPGRADE BACK TO FDK 10.x:
  /fdk-upgrade

ERROR HANDLING:
- If FDK 10 uninstall fails: Use npm uninstall --force
- If ~/.fdk removal fails: Check permissions
- If FDK 9 install fails: Check npm registry access
- If Node 18 install fails: Check nvm installation
`
})
```

### Expected Output

```
=========================================
WARNING: FDK 9.x + Node 18.x DEPRECATED
=========================================

Support ends: March 2026

Limitations:
- Development: Allowed for Platform 3.0 apps
- Publishing: NOT SUPPORTED (requires FDK 10.x + Node 24.x)
- Recommendation: Use FDK 10.x for all new development

Continue with FDK 9.x downgrade? (y/N): y

FDK 10.x completely removed
~/.fdk directory removed
Node 18 installed: v18.20.0
FDK 9.8.2 installed
Global version switched to FDK 9.x on Node 18

Downgrade Complete!

Previous: FDK 10.x + Node 24.x
Current:  FDK 9.x + Node 18.x

IMPORTANT REMINDERS:
- FDK 9.x support ends March 2026
- Publishing requires FDK 10.x + Node 24.x
- Use for development only

To upgrade back: /fdk-upgrade
```

---

## Scenario 3: Troubleshooting Broken FDK

### Context

FDK installed but not working:
- `fdk: command not found`
- Permission errors
- Wrong version
- Multiple conflicting installations

### Subagent Prompt

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Diagnose and fix broken FDK",
  prompt: `Diagnose and repair broken FDK installation.

CONTEXT:
- FDK installed but not working
- Common issues: PATH, permissions, multiple installations
- Need systematic diagnosis and repair

DIAGNOSTIC PHASE:

1. Check if FDK binary exists:
   which fdk
   if [ $? -eq 0 ]; then
     echo "✓ FDK binary found: $(which fdk)"
     ls -la $(which fdk)
   else
     echo "✗ FDK binary not found"
   fi

2. Check Node.js:
   which node
   node --version
   npm --version

3. Check npm global directory:
   npm config get prefix
   NPM_PREFIX=$(npm config get prefix)
   echo "npm global prefix: $NPM_PREFIX"
   ls -la "$NPM_PREFIX/bin/fdk" 2>/dev/null || echo "FDK not in npm global bin"

4. Check PATH:
   echo "PATH: $PATH"
   echo "$PATH" | tr ':' '\n' | grep -E "(nvm|npm|node)"

5. Check for multiple FDK installations:
   echo "Searching for FDK installations..."
   find /usr/local -name fdk -type f 2>/dev/null
   find ~/.nvm -name fdk -type f 2>/dev/null
   find /opt/homebrew -name fdk -type f 2>/dev/null
   find ~/. -name fdk -type f 2>/dev/null | grep -v ".npm"

6. Check npm global packages:
   npm list -g @freshworks/fdk 2>/dev/null || echo "FDK not in npm global packages"

7. Check nvm:
   command -v nvm && nvm --version || echo "nvm not found"
   if command -v nvm >/dev/null; then
     nvm current
     nvm list
   fi

DIAGNOSIS SUMMARY:
echo "=== DIAGNOSIS SUMMARY ==="
echo "Node: $(node --version 2>/dev/null || echo 'not found')"
echo "npm: $(npm --version 2>/dev/null || echo 'not found')"
echo "FDK: $(fdk version 2>/dev/null || echo 'not found')"
echo "nvm: $(nvm --version 2>/dev/null || echo 'not found')"
echo "========================="

COMMON FIXES:

FIX A: Permission issues
if [ -d "$NPM_PREFIX" ]; then
  echo "Fixing npm permissions..."
  sudo chown -R $(whoami) "$NPM_PREFIX"
  echo "✓ Permissions fixed"
fi

FIX B: PATH issues
if ! echo "$PATH" | grep -q "$(npm config get prefix)/bin"; then
  echo "Adding npm global bin to PATH..."
  echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
  source ~/.zshrc
  echo "✓ PATH updated"
fi

FIX C: Multiple conflicting installations
echo "Removing all FDK installations..."
npm uninstall @freshworks/fdk -g 2>/dev/null
brew uninstall fdk 2>/dev/null
sudo rm -f /usr/local/bin/fdk 2>/dev/null
echo "✓ Old installations removed"

FIX D: Wrong Node version
if command -v nvm >/dev/null; then
  echo "Switching to Node 24..."
  nvm install 24
  nvm use 24
  echo "✓ Node 24 activated"
fi

FIX E: Corrupted npm cache
echo "Cleaning npm cache..."
npm cache clean --force
echo "✓ npm cache cleaned"

CLEAN REINSTALL:

echo "Performing clean FDK installation..."

1. Ensure Node 24:
   if command -v nvm >/dev/null; then
     nvm use 24 || nvm install 24
   fi
   node --version

2. Install FDK:
   npm install https://cdn.freshdev.io/fdk/latest.tgz -g

3. Verify installation:
   which fdk
   fdk version

VERIFICATION:

echo "=== VERIFICATION ==="

1. Test FDK command:
   fdk version && echo "✓ fdk version works" || echo "✗ fdk version failed"

2. Test FDK help:
   fdk validate --help && echo "✓ fdk validate --help works" || echo "✗ fdk validate --help failed"

3. Test in new shell:
   bash -c 'fdk version' && echo "✓ fdk works in new shell" || echo "✗ fdk fails in new shell"

4. Create test app (optional):
   mkdir -p /tmp/fdk-test
   cd /tmp/fdk-test
   fdk create --product freshdesk --template your_first_app
   cd your_first_app
   fdk validate && echo "✓ Test app validates" || echo "✗ Test app validation failed"
   cd -
   rm -rf /tmp/fdk-test

TROUBLESHOOTING REPORT:

echo "=== TROUBLESHOOTING COMPLETE ==="
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "FDK: $(fdk version)"
echo "FDK path: $(which fdk)"
echo "================================"

MANUAL STEPS IF STILL BROKEN:

If FDK still not working:

1. Check shell config:
   cat ~/.zshrc | grep -E "(nvm|npm|node|PATH)"

2. Source shell config:
   source ~/.zshrc

3. Restart terminal

4. If using nvm, ensure it's loaded:
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

5. Check for shell-specific issues:
   echo $SHELL
   # If bash: check ~/.bashrc
   # If zsh: check ~/.zshrc

6. Last resort - complete reinstall:
   # Remove everything
   rm -rf ~/.nvm
   rm -rf ~/.npm
   npm uninstall @freshworks/fdk -g

   # Reinstall from scratch
   # Follow Scenario 1 (fresh install)

ERROR HANDLING:
- If permission denied: Use sudo for system directories
- If npm not found: Install Node.js first
- If nvm issues: Reinstall nvm
- If PATH not updating: Check shell config syntax
`
})
```

---


---

## Scenario 4: Install Specific FDK Version

### Context

User needs specific FDK version for:
- Team consistency
- Compatibility with existing apps
- Testing specific version

### Subagent Prompt

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install specific FDK version",
  prompt: `Install FDK version <TARGET_VERSION> with Node 24.

CONTEXT:
- User needs specific FDK version (not latest)
- For team consistency or compatibility
- Node 24 required

STEPS:
1. Parse target version from user request

2. Ensure Node 24 active:
   nvm use fdk || nvm use 24

3. Check if version already installed:
   current=$(fdk version 2>/dev/null)
   if [ "$current" = "<TARGET_VERSION>" ]; then
     echo "FDK <TARGET_VERSION> already installed"
     exit 0
   fi

4. Uninstall current FDK (if exists):
   npm uninstall @freshworks/fdk -g 2>/dev/null || true

5. Install specific version:
   npm install @freshworks/fdk@<TARGET_VERSION> -g

6. Verify installation:
   fdk version

VERIFICATION:
- fdk version should output <TARGET_VERSION>
- node --version should output 24.x.x
- fdk validate --help should work

OUTPUT FORMAT:
✓ Node 24 active: v24.x.x
✓ FDK <TARGET_VERSION> installed
✓ Verification successful

FDK <TARGET_VERSION> ready!

ERROR HANDLING:
- If version not found: Check npm registry, suggest valid versions
- If Node not 24: Switch to Node 24 first
- If install fails: Check npm permissions
`
})
```

---

## Scenario 5: Node PATH Mismatch

### Context

FDK installed but using wrong Node version:
- FDK installed on Node 24
- System using Node 20 or 22
- PATH pointing to wrong Node

### Subagent Prompt

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Fix Node PATH mismatch",
  prompt: `Fix Node PATH mismatch - ensure FDK uses Node 24.

CONTEXT:
- FDK installed but not working correctly
- Wrong Node version in PATH
- Need to point to Node 24

DIAGNOSIS:
1. Check current Node:
   which node
   node --version

2. Check FDK:
   which fdk
   fdk version

3. Check nvm:
   nvm current
   nvm list

4. Check if FDK installed on Node 24:
   ls ~/.nvm/versions/node/v24.*/bin/fdk

5. Check PATH:
   echo $PATH | tr ':' '\n' | grep node

ANALYSIS:
- If Node is not 24.x: PATH mismatch
- If FDK exists but not in PATH: Configuration issue
- If multiple Node versions in PATH: Priority issue

FIX:
1. Switch to Node 24:
   nvm use fdk || nvm use 24

2. Update shell configuration:
   cat >> ~/.zshrc << 'SHELL_EOF'

# Ensure Node 24 for FDK
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use fdk > /dev/null 2>&1
SHELL_EOF

3. Source shell:
   source ~/.zshrc

4. Verify fix:
   node --version (should be 24.x.x)
   fdk version (should work)

VERIFICATION:
- Open new terminal and check: node --version
- Check FDK works: fdk validate --help

OUTPUT FORMAT:
✓ Node PATH fixed: v24.x.x
✓ FDK now accessible
✓ Shell configured

PATH mismatch resolved!

Current setup:
- Node: v24.x.x
- FDK: 10.x.x
- nvm alias: fdk → 24

ERROR HANDLING:
- If nvm not found: Install nvm first
- If Node 24 not installed: Install Node 24
- If shell config fails: Manually edit ~/.zshrc
`
})
```

---

## Scenario 6: Multiple Node Versions (Team Development)

### Context

Developer works on multiple projects:
- Project A: Node 20 (non-Freshworks)
- Project B: Node 24 (Freshworks apps)
- Need easy switching

### Subagent Prompt

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Setup multiple Node versions with FDK",
  prompt: `Configure multiple Node versions for multi-project development.

CONTEXT:
- Developer works on multiple projects
- Different projects need different Node versions
- Freshworks apps need Node 24 + FDK
- Other projects use Node 20, 22, etc.

STRATEGY:
Use nvm with project-specific .nvmrc files

STEPS:
1. Install all needed Node versions:
   nvm install 20
   nvm install 22
   nvm install 24

2. Create nvm aliases:
   nvm alias default 20  # Default for non-Freshworks projects
   nvm alias fdk 24      # For Freshworks development

3. Install FDK on Node 24:
   nvm use 24
   npm install https://cdn.freshdev.io/fdk/latest.tgz -g

4. Create .nvmrc files for projects:

   # Freshworks projects
   cd ~/projects/freshworks-app
   echo "24" > .nvmrc

   # Other projects
   cd ~/projects/other-app
   echo "20" > .nvmrc

5. Configure auto-switching:
   Add to ~/.zshrc:

   # Auto-switch Node version based on .nvmrc
   autoload -U add-zsh-hook
   load-nvmrc() {
     if [[ -f .nvmrc && -r .nvmrc ]]; then
       nvm use
     elif [[ $(nvm version) != $(nvm version default) ]]; then
       nvm use default
     fi
   }
   add-zsh-hook chpwd load-nvmrc
   load-nvmrc

6. Source shell:
   source ~/.zshrc

USAGE:
- cd ~/projects/freshworks-app → Auto-switches to Node 24
- cd ~/projects/other-app → Auto-switches to Node 20
- Manual switch: nvm use fdk (Node 24)
- Manual switch: nvm use 20 (Node 20)

VERIFICATION:
- cd freshworks-app && node --version (24.x.x)
- cd other-app && node --version (20.x.x)
- cd freshworks-app && fdk version (10.x.x)

OUTPUT FORMAT:
✓ Node 20 installed
✓ Node 22 installed
✓ Node 24 installed
✓ nvm aliases configured
✓ FDK 10 installed on Node 24
✓ .nvmrc files created
✓ Auto-switching configured

Multiple Node Setup Complete!

Node versions:
  v20.x.x (default)
  v22.x.x
  v24.x.x (fdk)

FDK: 10.x.x (Node 24 only)

Auto-switching enabled:
- cd to project → auto-switches to .nvmrc version
- Freshworks projects → Node 24
- Other projects → Node 20/22

ERROR HANDLING:
- If nvm install fails: Check disk space
- If auto-switching not working: Check zsh hooks
- If .nvmrc not recognized: Verify nvm installation
`
})
```

---

## Testing Matrix

| Scenario | macOS | Windows | Linux |
|----------|-------|---------|-------|
| 1. Existing Node | Supported | Supported | Supported |
| 2. Downgrade to FDK 9.x | Supported | Supported | Supported |
| 3. Troubleshooting | Supported | Supported | Supported |
| 4. Specific FDK Version | Supported | Supported | Supported |
| 5. Node PATH Mismatch | Supported | Supported | Supported |
| 6. Multiple Node Versions | Supported | Supported | Supported |

---

## Quick Reference

| Need | Use Scenario |
|------|--------------|
| Already have Node installed | Scenario 1 |
| Downgrade to FDK 9.x (deprecated) | Scenario 2 |
| FDK not working | Scenario 3 |
| Install specific FDK version | Scenario 4 |
| Node PATH issues | Scenario 5 |
| Multiple projects, different Node versions | Scenario 6 |

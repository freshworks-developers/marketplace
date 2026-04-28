# Interactive Troubleshooting Guide (Agent Reference)

**Context**: Agent guide for Phase 3 of `/fw-setup-troubleshoot` when automated `--fix` fails.

**Protocol**: ONE command at a time → wait for human output → interpret → provide NEXT command → adapt based on results.

---

## Entry Point

**When to use**: 
- `--fix` Task exits with error
- User reports "fix didn't work"
- User asks for manual steps

**Agent's first message**:
```
⚠️ The automated fix encountered an issue: [error message from Task]

Let's troubleshoot this manually step-by-step.

I'll give you one command at a time. Run each command and paste the output back to me.

Ready? (Reply "yes" or describe what error you're seeing)
```

---

## Decision Tree

### Node 1: Classify the Failure

**Based on Task error message or user symptoms**:

| Error Pattern | Go To |
|---------------|-------|
| `FAILED: nvm not found` | **Branch A: Install nvm** |
| `FAILED: fdk not 10.x` OR `fdk: command not found` | **Branch B: FDK PATH Issue** |
| `Works in current shell, fails in new shell` | **Branch C: Shell Persistence** |
| `npm permission denied` | **Branch D: npm Permissions** |
| Other / Unclear | **Branch E: General Diagnostics** |

---

## Branch A: Install nvm from Scratch

**Context**: nvm not found at `$HOME/.nvm/nvm.sh`

### Step A1: Verify nvm is missing

**Command to give**:
```bash
ls -la ~/.nvm
```

**Interpret**:
- Shows directory listing → nvm IS installed, go to **Branch B**
- `No such file or directory` → Continue to A2

### Step A2: Install nvm

**Agent message**:
```
nvm is not installed. Let's install it.

Run this command (it will take ~30 seconds):
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

When it finishes, paste the last 5 lines of output.
```

**Expected output**: `=> nvm is installed successfully...`

**If fails**: Check internet connection, suggest manual download from https://github.com/nvm-sh/nvm

### Step A3: Load nvm in current shell

**Command**:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm --version
```

**Expected**: Version number (e.g., `0.40.1`)

**If fails**: Check if `~/.nvm/nvm.sh` exists: `ls -la ~/.nvm/nvm.sh`

### Step A4: Install Node 24.11

**Command**:
```bash
nvm install 24.11
```

**Expected**: Download progress → `Now using node v24.11.x`

### Step A5: Install FDK

**Command**:
```bash
nvm use 24.11
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz
```

**Expected**: Install progress → `added 1 package`

**Verify**:
```bash
fdk version
```

**Expected**: `10.x.x`

### Step A6: Add to shell config

**Command** (for macOS/Linux with zsh):
```bash
cat >> ~/.zshrc << 'EOF'

# FDK Setup (added by manual troubleshooting)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24.11 >/dev/null 2>&1
EOF
```

**For bash users**, use `~/.bashrc` instead.

### Step A7: Verify in new shell

**Agent message**:
```
Final check: Open a BRAND NEW terminal window (don't just run this in current terminal).

In that new terminal, run:
  fdk version

What do you see?
```

**Expected**: `10.x.x` → **SUCCESS**

**If fails**: Go to **Branch C: Shell Persistence**

---

## Branch B: FDK PATH Issue (nvm exists, fdk missing)

**Context**: nvm is installed but `fdk: command not found`

Load **`references/error-command-not-found.md`** for detailed PATH troubleshooting.

### Step B1: Check which Node is active

**Command**:
```bash
command -v node
node --version
```

**Expected**: Path like `~/.nvm/versions/node/v24.11.x/bin/node` and version `v24.11.x`

**If different Node version** (e.g., v24.14.x, v20.x):
```
The active Node version is [version], but FDK needs Node 24.11.

Let's switch to Node 24.11.

Run:
  nvm use 24.11

Then check:
  node --version
```

### Step B2: Check if FDK is installed for active Node

**Command**:
```bash
npm list -g @freshworks/fdk
```

**Expected**: `@freshworks/fdk@10.x.x`

**If empty/error**:
```
FDK is not installed for this Node version.

Run:
  npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

Then verify:
  fdk version
```

### Step B3: Check nvm aliases

**Command**:
```bash
nvm alias
```

**Look for**:
- `default -> 24.11` (or `default -> 24` which may drift to 24.14+)
- `fdk -> 24.11`

**If `default -> 24` (bare 24)**:
```
Your nvm default points to "24" which can drift to newer versions.

Let's pin it to 24.11:
  nvm alias default 24.11
  nvm alias fdk 24.11

Then in a NEW terminal:
  fdk version
```

### Step B4: Verify in new shell

**Same as A7**

---

## Branch C: Shell Persistence (works now, fails in new shell)

**Context**: Commands work in current shell but not in new terminal

### Step C1: Check if nvm is in shell config

**Command**:
```bash
grep -n "nvm.sh" ~/.zshrc ~/.bashrc 2>/dev/null || echo "nvm not in shell config"
```

**Interpret**:
- Shows line numbers → nvm IS sourced → Go to C3 (check NVM_DIR)
- `nvm not in shell config` → Continue to C2

### Step C2: Add nvm to shell config

**Determine shell**:
```bash
echo $SHELL
```

**For zsh** (`/bin/zsh`):
```
Add nvm to your zsh config:

  cat >> ~/.zshrc << 'EOF'

  # FDK Setup
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm use 24.11 >/dev/null 2>&1
  EOF

Then test in a NEW terminal:
  fdk version
```

**For bash** (`/bin/bash`):
```
Same as above but use ~/.bashrc instead of ~/.zshrc
```

### Step C3: Check NVM_DIR variable

**Command**:
```bash
grep "NVM_DIR" ~/.zshrc ~/.bashrc 2>/dev/null
```

**Expected**: `export NVM_DIR="$HOME/.nvm"`

**If missing or wrong path**:
```
Your NVM_DIR is incorrect. Let's fix it.

Edit your shell config to ensure it has:
  export NVM_DIR="$HOME/.nvm"

Then source:
  source ~/.zshrc
```

### Step C4: Set nvm default

**Command**:
```bash
nvm alias default 24.11
```

**Then verify in NEW terminal**

---

## Branch D: npm Permission Errors

**Context**: `npm permission denied`, `EACCES`, `EPERM`

Load **`references/npm-permissions-sop.md`**

### Step D1: Check npm prefix

**Command**:
```bash
npm config get prefix
```

**Interpret**:
- `/usr/local` or `/usr` → System directory (permission issue) → Continue D2
- `~/.npm-global` or similar home directory → Already fixed, different issue

### Step D2: Change npm prefix to user directory

**Commands**:
```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
```

### Step D3: Add to PATH

**For zsh**:
```bash
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

**For bash**:
```bash
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Step D4: Reinstall FDK

**Command**:
```bash
nvm use 24.11
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz
```

**Verify**: `fdk version`

---

## Branch E: General Diagnostics (Unclear Failure)

**Context**: Error doesn't match known patterns

### Step E1: Gather system info

**Commands** (one at a time):
```bash
# OS
uname -a

# Shell
echo $SHELL

# Current PATH
echo $PATH

# nvm status
command -v nvm && nvm --version || echo "nvm not found"

# Node status
command -v node && node --version || echo "node not found"

# FDK status
command -v fdk && fdk version || echo "fdk not found"
```

**Agent analyzes outputs and routes to appropriate branch**

### Step E2: Check for common blockers

**Corporate proxy**:
```
Are you behind a corporate proxy or firewall?

If yes, you may need to configure npm proxy:
  npm config set proxy http://proxy.company.com:8080
  npm config set https-proxy http://proxy.company.com:8080
```

**Antivirus/Security software**:
```
Is antivirus or security software installed?

Some security tools block npm installations. Try temporarily disabling and retry.
```

**Disk space**:
```bash
df -h ~
```

**If < 1GB free**: Suggest cleanup

---

## Verification Protocol

Before declaring success, agent MUST verify:

### 1. Current shell works
```bash
fdk version
```

### 2. New shell works (persistence check)
```
Open a BRAND NEW terminal window.

In that new terminal, run:
  fdk version

What do you see?
```

### 3. Human confirmation
```
Does everything work now? (yes/no)
```

**Only mark as resolved when all three pass.**

---

## Anti-Patterns (Agent Must Avoid)

❌ **Don't retry automation** - If `--fix` failed once, don't suggest running it again  
❌ **Don't batch commands** - ONE command at a time, wait for output  
❌ **Don't assume success** - Always verify in NEW shell  
❌ **Don't use jargon** - Explain technical terms as you go  
❌ **Don't suggest nuclear options** - Avoid "reinstall macOS" or "delete everything"  
❌ **Don't escalate to support** - No "email devrels" or "create GitHub issue"  

---

## Edge Cases

### Same error after 3 attempts

```
We've tried [approach] but seeing the same error.

Let me try a different approach. Quick questions:

1. What operating system? (macOS / Windows / Linux / WSL)
2. Corporate/restricted environment? (yes/no)
3. Recently modified shell config files? (yes/no)

This helps me suggest an alternative fix.
```

**Based on answers, try alternative approaches:**
- **Windows + multiple Node installs (MSI/winget/choco/scoop):** See **`references/windows.md`** — *Installer-based setups*; fix PATH so **`nvm use 24.11`** yields **`v24.11.*`** before reinstalling FDK from CDN.
- **Corporate: Check proxy settings, suggest Homebrew alternative (macOS)** or **Chocolatey/winget PATH cleanup (Windows)** per **`references/windows.md`**
- Modified config: Suggest backing up and creating minimal config
- WSL: Check WSL-specific nvm installation

### Out of scope issue

```
This looks like [issue type - e.g., "a Docker networking problem"].

I specialize in FDK/Node/npm setup. For this issue:
- [Link to relevant docs if known]
- Or: Would you like me to help with a workaround?
```

### User gives up

```
I understand this is frustrating. 

What we've confirmed so far:
- [List what's working]
- [List what's still broken]

Options:
1. Take a break and try again later (sometimes helps!)
2. Try a clean environment (new user account to test)
3. I can document the exact state for you to review later

What would you prefer?
```

---

## Success Criteria

Interactive session ends when:
- ✅ `fdk version` works in CURRENT shell
- ✅ `fdk version` works in NEW shell (persistence verified)
- ✅ Human confirms "yes, it's working" or "all set"

**Agent's closing message**:
```
✅ All set! FDK is now working correctly.

Summary of what we fixed:
- [List steps taken]

Your setup is complete. You can now run FDK commands from any new terminal.
```

---

## Quick Reference: Command Patterns

### Diagnostic commands (safe, read-only)
- `ls -la ~/.nvm`
- `nvm --version`
- `node --version`
- `npm list -g @freshworks/fdk`
- `grep "nvm.sh" ~/.zshrc`
- `echo $PATH`

### Fix commands (write operations - explain before giving)
- `nvm install 24.11` - Downloads Node
- `npm install -g [url]` - Installs FDK
- `echo '...' >> ~/.zshrc` - Adds to shell config
- `nvm alias default 24.11` - Sets default Node version

### Verification commands (always use in NEW shell)
- `fdk version`
- `node --version`
- `nvm current`

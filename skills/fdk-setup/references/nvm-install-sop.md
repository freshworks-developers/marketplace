# nvm Installation SOP (Manual Steps)

**Context**: Step-by-step nvm installation when automated fix fails or nvm is not present.

---

## Prerequisites

- Internet connection
- Terminal access
- macOS, Linux, or WSL (Windows Subsystem for Linux)

---

## Step 1: Verify nvm is Not Already Installed

**Run**:
```bash
ls -la ~/.nvm
```

**If you see**: Directory listing with `nvm.sh` file  
→ **nvm IS installed**, problem is likely loading/PATH. See `shell-persistence-sop.md`

**If you see**: `No such file or directory`  
→ **Continue to Step 2**

---

## Step 2: Install nvm

### Option A: Automatic Installation Script (Recommended)

**Run**:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

**What this does**:
- Downloads nvm installation script from official GitHub repo
- Installs nvm to `~/.nvm`
- Automatically adds nvm to your shell config (`~/.zshrc`, `~/.bashrc`, or `~/.profile`)

**Expected output** (last few lines):
```
=> Appending nvm source string to /Users/yourname/.zshrc
=> nvm is installed successfully!
=> Close and reopen your terminal to start using nvm
```

**If download fails**:
- Check internet connection
- Check if corporate firewall is blocking GitHub
- Try Option B (manual installation)

### Option B: Manual Installation (If Script Fails)

1. **Download nvm**:
```bash
cd ~
git clone https://github.com/nvm-sh/nvm.git .nvm
cd .nvm
git checkout v0.40.1
```

2. **Add to shell config** (see Step 3)

---

## Step 3: Load nvm in Current Shell

**The install script updates your shell config, but doesn't affect your CURRENT terminal.**

### For zsh users (macOS default):

**Run**:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

### For bash users:

**Run**:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

**Verify nvm is loaded**:
```bash
nvm --version
```

**Expected**: `0.40.1` (or your installed version)

**If still not found**:
- Check if `~/.nvm/nvm.sh` exists: `ls -la ~/.nvm/nvm.sh`
- If missing, repeat Step 2

---

## Step 4: Verify Shell Config Was Updated

**Check which shell you're using**:
```bash
echo $SHELL
```

**For zsh** (`/bin/zsh`):
```bash
grep -n "nvm.sh" ~/.zshrc
```

**For bash** (`/bin/bash`):
```bash
grep -n "nvm.sh" ~/.bashrc
```

**Expected**: Shows line numbers like `15:[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`

**If empty** (install script didn't update config):

### Manually add nvm to shell config

**For zsh**:
```bash
cat >> ~/.zshrc << 'EOF'

# nvm (Node Version Manager)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
EOF
```

**For bash**:
```bash
cat >> ~/.bashrc << 'EOF'

# nvm (Node Version Manager)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
EOF
```

---

## Step 5: Test in New Terminal

**Open a BRAND NEW terminal window** (don't just run commands in current terminal).

**In the new terminal, run**:
```bash
nvm --version
```

**Expected**: `0.40.1` (or your version)

**If still not found**:
- Your shell config may not be loading
- Check if you have multiple shell config files (e.g., both `.zshrc` and `.zprofile`)
- See `shell-persistence-sop.md` for advanced troubleshooting

---

## Step 6: Install Node.js (If Needed)

Once nvm is working:

```bash
# Install Node.js 24.11 (for FDK 10)
nvm install 24.11

# Set as default
nvm alias default 24.11

# Verify
node --version
```

**Expected**: `v24.11.x`

---

## Common Issues

### Issue: "curl: command not found"

**Solution**: Install curl first
```bash
# macOS
xcode-select --install

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install curl

# Linux (CentOS/RHEL)
sudo yum install curl
```

### Issue: "Permission denied" when running install script

**Do NOT use sudo** with nvm install script.

**Solution**: Check your home directory permissions
```bash
ls -la ~
```

Home directory should be owned by you, not root.

### Issue: Corporate firewall blocks GitHub

**Solution**: Download manually via browser
1. Visit https://github.com/nvm-sh/nvm/releases
2. Download `nvm-0.40.1.tar.gz`
3. Extract to `~/.nvm`
4. Continue from Step 3

### Issue: Install script says "nvm already installed"

**If nvm command doesn't work**:
1. The old installation may be broken
2. Remove old installation: `rm -rf ~/.nvm`
3. Repeat Step 2

---

## Windows Users (Non-WSL)

**nvm does NOT work on native Windows PowerShell/CMD.**

**Options**:
1. **Use nvm-windows** instead: https://github.com/coreybutler/nvm-windows
2. **Use WSL** (Windows Subsystem for Linux) and follow this guide
3. **Use Volta** as nvm alternative: https://volta.sh/

For FDK setup on Windows, see `references/windows.md`.

---

## Verification Checklist

Before continuing to FDK installation, verify:

- [ ] `nvm --version` shows version in CURRENT terminal
- [ ] `nvm --version` shows version in NEW terminal (persistence)
- [ ] `nvm list` shows available Node versions (or empty if none installed yet)
- [ ] Shell config file (`~/.zshrc` or `~/.bashrc`) contains nvm source lines

**If all checked**: You're ready to install Node and FDK!

**Next steps**: See `references/node-version-sop.md` or return to interactive troubleshooting.

# Shell Persistence SOP (Manual Steps)

**Problem**: Commands work in current terminal but fail in new terminal windows.

**Root Cause**: Shell configuration not loading nvm/Node/FDK on startup.

---

## Quick Diagnosis

**Test current shell**:
```bash
fdk version
```

**Expected**: Shows version number

**Test new shell**:
1. Open a BRAND NEW terminal window (⌘N on Mac, or new tab)
2. Run: `fdk version`

**If you see**: `command not found`  
→ **Persistence issue - follow this guide**

**If works in both**:  
→ **No persistence issue, problem is elsewhere**

---

## Understanding Shell Startup

### macOS (zsh default since Catalina)

**Interactive login shell** loads in this order:
1. `~/.zshenv` (always)
2. `~/.zprofile` (login shells)
3. `~/.zshrc` (interactive shells) ← **Most common for nvm**
4. `~/.zlogin` (login shells, after zshrc)

**Most terminal apps open interactive shells** → Use `~/.zshrc`

### Linux (bash common)

**Interactive login shell** loads:
1. `~/.bash_profile` (if exists)
2. OR `~/.bash_login` (if exists)
3. OR `~/.profile` (if exists)

**Interactive non-login shell** loads:
1. `~/.bashrc` ← **Most common for nvm**

**Most terminal apps open non-login shells** → Use `~/.bashrc`

### How to check which shell you're using:

```bash
echo $SHELL
```

- `/bin/zsh` → Use `~/.zshrc`
- `/bin/bash` → Use `~/.bashrc`

---

## Step 1: Check Which Config Files Exist

**Run**:
```bash
ls -la ~/ | grep -E '\.(zshrc|bashrc|zprofile|bash_profile|profile)$'
```

**Look for**:
- `.zshrc` (zsh users)
- `.bashrc` (bash users)
- `.zprofile`, `.bash_profile`, `.profile` (may override other files)

**Common issue**: Multiple config files where one overrides another.

---

## Step 2: Check If nvm Is in Config

### For zsh users:

```bash
grep -n "nvm.sh" ~/.zshrc
```

### For bash users:

```bash
grep -n "nvm.sh" ~/.bashrc
```

**Expected**: Shows line numbers like:
```
15:export NVM_DIR="$HOME/.nvm"
16:[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

**If empty**: nvm is NOT in your config → **Go to Step 3**

**If shows lines**: nvm IS in config → **Go to Step 4** (check if it's being sourced)

---

## Step 3: Add nvm to Shell Config

### For zsh (macOS default):

```bash
cat >> ~/.zshrc << 'EOF'

# nvm (Node Version Manager) - added manually
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
EOF
```

### For bash (Linux default):

```bash
cat >> ~/.bashrc << 'EOF'

# nvm (Node Version Manager) - added manually
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
EOF
```

**After adding, test in NEW terminal**:
```bash
# Open new terminal, then:
nvm --version
```

**If works**: Problem solved!  
**If still fails**: Continue to Step 4

---

## Step 4: Check If Config Is Being Sourced

### Test if config file is loading:

**For zsh**:
```bash
cat >> ~/.zshrc << 'EOF'
echo "zshrc loaded"
EOF
```

**For bash**:
```bash
cat >> ~/.bashrc << 'EOF'
echo "bashrc loaded"
EOF
```

**Open NEW terminal**:
- If you see "zshrc loaded" or "bashrc loaded" → Config IS loading
- If you don't see message → Config NOT loading

**Remove the test line**:
```bash
# For zsh
sed -i '' '/echo "zshrc loaded"/d' ~/.zshrc

# For bash
sed -i '/echo "bashrc loaded"/d' ~/.bashrc
```

**If config NOT loading**, see Step 5.

---

## Step 5: Fix Config Loading (Advanced)

### Issue: `.bash_profile` exists and overrides `.bashrc`

**Check**:
```bash
ls -la ~/.bash_profile
```

**If exists**: It may NOT source `.bashrc`

**Fix**: Add this to `~/.bash_profile`:
```bash
cat >> ~/.bash_profile << 'EOF'

# Source bashrc if it exists
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
EOF
```

### Issue: `.zprofile` exists and overrides `.zshrc`

**Check**:
```bash
cat ~/.zprofile
```

**If it sets PATH or loads nvm**: It may conflict

**Fix options**:
1. **Move nvm config from `.zshrc` to `.zprofile`**
2. **Or remove conflicting lines from `.zprofile`**

### Issue: Corporate/IT-managed shell config

Some companies manage shell configs centrally.

**Check**:
```bash
grep -r "nvm\|NVM" /etc/profile /etc/bashrc /etc/zshrc 2>/dev/null
```

**If found**: IT config may conflict

**Solution**: Add nvm config to a file loaded AFTER system configs:
- For zsh: `~/.zshrc.local` (if supported)
- For bash: `~/.bashrc.local` (if supported)

---

## Step 6: Set nvm Default Node Version

Even if nvm is in shell config, it may not activate a Node version by default.

**Check current Node in NEW terminal**:
```bash
# Open new terminal
node --version
```

**If `command not found`**: No default Node set

**Fix**:
```bash
nvm alias default 24.11
```

**This creates a default alias so nvm automatically activates Node 24.11 on shell startup.**

**Test in NEW terminal**:
```bash
node --version
```

**Expected**: `v24.11.x`

---

## Step 7: Alternative - Explicit `nvm use` in Config

If default alias doesn't work, explicitly run `nvm use` in shell config:

### For zsh:

```bash
cat >> ~/.zshrc << 'EOF'

# Auto-activate Node 24.11
nvm use 24.11 >/dev/null 2>&1
EOF
```

### For bash:

```bash
cat >> ~/.bashrc << 'EOF'

# Auto-activate Node 24.11
nvm use 24.11 >/dev/null 2>&1
EOF
```

**The `>/dev/null 2>&1` suppresses output so you don't see "Now using node..." every time you open a terminal.**

---

## Step 8: Verify Persistence

**Open 3 NEW terminal windows** and in each run:
```bash
fdk version
```

**All should show**: `10.x.x` (or your FDK version)

**If all work**: ✅ Persistence fixed!

**If still fails in new terminal**: Check Step 9 (edge cases)

---

## Step 9: Edge Cases

### macOS Terminal.app vs iTerm2 vs VS Code terminal

Different terminal apps may load configs differently.

**Test each terminal app** you use:
- macOS Terminal.app
- iTerm2
- VS Code integrated terminal
- Cursor IDE terminal

**If works in one but not another**: That terminal app may have special config.

**For VS Code/Cursor**: Check if they have their own shell integration overrides.

### tmux / screen users

If you use tmux or screen, they start non-login shells.

**Add to `~/.zshrc` or `~/.bashrc`**:
```bash
# Force nvm load in tmux/screen
[ -z "$TMUX" ] || [ -z "$STY" ] || {
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
}
```

### SSH sessions

If connecting via SSH and nvm doesn't work:

**Check if login shell**:
```bash
shopt -q login_shell && echo "login" || echo "non-login"
```

**If non-login**: SSH may not source `.bash_profile`

**Fix**: Force source in `.bashrc`:
```bash
# In ~/.bashrc
if [ -f ~/.bash_profile ]; then
    . ~/.bash_profile
fi
```

---

## Verification Checklist

- [ ] `nvm --version` works in NEW terminal
- [ ] `node --version` shows expected version in NEW terminal  
- [ ] `fdk version` works in NEW terminal
- [ ] Shell config file contains nvm source lines
- [ ] `nvm alias default` points to correct Node version
- [ ] Works in ALL terminal apps you use (Terminal, iTerm, VS Code, etc.)

---

## Still Not Working?

### Debug: Check what's in PATH

**In NEW terminal**:
```bash
echo $PATH
```

**Look for**: `~/.nvm/versions/node/v24.11.x/bin` (or similar)

**If missing**: nvm is not loading or Node not activated

### Debug: Manually load nvm and check

**In NEW terminal**:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24.11
fdk version
```

**If NOW works**: Confirms nvm config is the issue (not nvm itself)

**Solution**: Double-check Steps 3-5

### Last resort: Clean shell config

**Backup current config**:
```bash
cp ~/.zshrc ~/.zshrc.backup  # or ~/.bashrc
```

**Create minimal config**:
```bash
cat > ~/.zshrc << 'EOF'
# Minimal nvm config
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24.11 >/dev/null 2>&1

# Add your other essentials here (PATH, aliases, etc.)
EOF
```

**Test in NEW terminal**

**If works**: Something in your old config was conflicting. Gradually add back sections to find the culprit.

---

## Success Criteria

**Persistence is fixed when**:
- ✅ `fdk version` works immediately in ANY new terminal window
- ✅ No need to manually run `nvm use` or `source ~/.zshrc`
- ✅ Works consistently across terminal restarts

**Return to interactive troubleshooting or continue to next setup step.**

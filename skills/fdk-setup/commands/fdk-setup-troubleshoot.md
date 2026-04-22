---
name: fdk-setup-troubleshoot
description: Diagnose FDK / nvm / shell PATH; optional --fix runs automated repair Task; on failure switches to interactive human-guided SOP mode
always: true
argument-hint: "[--fix]"
---

# FDK setup — troubleshoot (`/fdk-setup-troubleshoot`)

**Universal FDK troubleshooter**: Automated fix → Interactive manual SOP fallback. No retry loops, no support escalation.

## Behaviour

| Intent | Execution | On Failure |
|--------|-----------|------------|
| `/fdk-setup-troubleshoot` | **Inline diagnostics** — identify issues, suggest `--fix` or manual path | N/A (diagnostic only) |
| `/fdk-setup-troubleshoot --fix` | **Automated repair Task** — backup rc files, fix nvm/PATH/FDK | **→ Interactive SOP Mode** |

## Three-Phase Flow

### Phase 1: Inline Diagnostics (No `--fix`)

Run diagnostics and interpret:
- Wrong **Node** active vs where **`npm install -g`** put **`fdk`** (load `references/error-command-not-found.md`)
- **nvm** missing from **`~/.zshrc`** / **`~/.bashrc`** or **`NVM_DIR`** wrong
- **`nvm alias default`** / **`fdk`** pointing at bare **`24`** instead of **24.11**

**Output**: Diagnosis + recommendation (suggest `--fix` or manual steps based on complexity)

### Phase 2: Automated Fix (With `--fix`)

Run **Task** (see below) that:
1. Backs up dotfiles with timestamp
2. Ensures nvm is loaded
3. Installs/aligns Node 24.11 + FDK 10
4. Verifies in clean shell

**Success**: Report completion, ask user to verify in NEW terminal  
**Failure**: **Automatically enter Phase 3** (Interactive SOP Mode)

### Phase 3: Interactive SOP Mode (When `--fix` Fails)

**Entry conditions**:
- `--fix` Task exits with error
- User reports automation didn't work
- User explicitly asks for manual steps

**Protocol**:
1. ✅ Load `references/interactive-troubleshooting-guide.md`
2. ✅ Provide ONE diagnostic command at a time
3. ✅ Wait for human to paste output
4. ✅ Interpret output and provide NEXT specific command
5. ✅ Adapt path based on actual results
6. ❌ NEVER retry `--fix` Task in loop
7. ❌ NEVER suggest "try again" without new information
8. ❌ NEVER ask for diagnostic bundle or support escalation

**Example transition to Phase 3**:
```
⚠️ The automated fix encountered an issue:
  FAILED: nvm not found at $HOME/.nvm/nvm.sh

Let's troubleshoot this manually step-by-step.

I'll guide you through diagnostic commands. Run each command and paste the output back.

**Step 1: Check if nvm is installed on your system**

Run:
  ls -la ~/.nvm

Paste the output here.
```

Always load **`references/error-command-not-found.md`** when symptoms match `fdk: command not found`.

## Inline diagnostics (no `--fix`)

Run the **verbose** block from **`commands/fdk-setup-status.md`**, then summarize:

- Wrong **Node** active vs where **`npm install -g`** put **`fdk`** (see error-command-not-found).
- **nvm** missing from **`~/.zshrc`** / **`~/.bashrc`** or **`NVM_DIR`** wrong.
- **`nvm alias default`** / **`fdk`** pointing at bare **`24`** instead of **24.11**.

Do **not** edit **`~/.zshrc`** inline unless the user invoked **`--fix`** (then use the Task below).

## Execution (`--fix` only)

**Principles for the Task:** never remove whole rc files; **copy-once backup** with a timestamp; only **append** a small **nvm** block if **nvm** exists but is not sourced; prefer **`nvm alias default 24.11`** and **`nvm alias fdk 24.11`**; reinstall FDK from **`latest-v24.tgz`** only after **`nvm use 24.11`**; use **`sed -i`** with **GNU/BSD fallback** like **`fdk-setup-uninstall`**.

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Auto-fix FDK/nvm shell PATH (zshrc-safe)",
  prompt: `
You are fixing a broken FDK 10 + nvm setup on macOS or Linux. Be conservative with dotfiles.

export NVM_DIR="$HOME/.nvm"

# 1) Backups
TS=$(date +%Y%m%d_%H%M%S)
for rc in "$HOME/.zshrc" "$HOME/.bashrc"; do
  [ -f "$rc" ] && cp "$rc" "$rc.bak.fdk-troubleshoot.$TS"
done

# 2) Ensure nvm exists
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "FAILED: nvm not found at $NVM_DIR/nvm.sh — install nvm first (see SKILL.md / references/macos.md)"
  exit 1
fi

. "$NVM_DIR/nvm.sh"

# 3) Append minimal nvm loader ONLY if rc exists and neither file sources nvm.sh
append_nvm_loader() {
  local rc="$1"
  [ -f "$rc" ] || return 0
  if grep -q 'nvm.sh' "$rc" 2>/dev/null; then
    return 0
  fi
  echo "" >> "$rc"
  echo "# nvm (added by fdk-setup-troubleshoot --fix $TS)" >> "$rc"
  echo 'export NVM_DIR="$HOME/.nvm"' >> "$rc"
  echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> "$rc"
}

append_nvm_loader "$HOME/.zshrc"
append_nvm_loader "$HOME/.bashrc"

# 4) Align Node + FDK on 24.11 (avoid bare "24" alias drift)
nvm install 24.11 2>/dev/null || true
nvm use 24.11
npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz || exit 1

nvm alias default 24.11
nvm alias fdk 24.11 2>/dev/null || true

# 5) Idempotent hint lines (do not duplicate endlessly)
hint="# FDK 10 / Node 24.11 (fdk-setup-troubleshoot --fix $TS)"
for rc in "$HOME/.zshrc" "$HOME/.bashrc"; do
  [ -f "$rc" ] || continue
  grep -qF "fdk-setup-troubleshoot" "$rc" 2>/dev/null && continue
  echo "" >> "$rc"
  echo "$hint" >> "$rc"
  echo 'nvm use 24.11 >/dev/null 2>&1 || true' >> "$rc"
done

# 6) Verify in subshells
fdk version | grep -E '^10\\.' || { echo "FAILED: fdk not 10.x"; exit 1; }
zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 24.11 >/dev/null; command -v fdk && fdk version' \
  || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 24.11 >/dev/null; command -v fdk && fdk version' \
  || { echo "FAILED: fdk not on PATH in clean shell"; exit 1; }

echo "REPORT: troubleshoot --fix complete. Backups: *.bak.fdk-troubleshoot.$TS"
echo "Ask user to: source ~/.zshrc  (or open a new terminal)"

SLASH_COMMAND_CLOSEOUT: Return immediately after REPORT. No fdk run / tunnel / watchers.
  `
})
```

**Notes**

- **`--fix`** targets **FDK 10 on Node 24.11**. It does **not** switch users to FDK 9 / Node 18.
- If **`~/.zshrc`** already sources **`nvm.sh`**, the Task **does not** duplicate it — it only adds **nvm use 24.11** hint lines when the marker is missing.

**Closeout:** without **`--fix`**, never spawn this Task.

---

## Interactive SOP Mode (Fallback When `--fix` Fails)

### Entry Point

**Detect failure**:
- Task exits with error message (e.g., "FAILED: nvm not found", "FAILED: fdk not 10.x")
- User reports: "the fix didn't work" or "still seeing error"

**Agent response template**:
```
⚠️ The automated fix encountered an issue: [error message]

Let's troubleshoot this manually. I'll guide you step-by-step.

Ready? (Reply "yes" to start, or describe what error you're seeing now)
```

### Decision Tree (Agent's Internal Logic)

Load **`references/interactive-troubleshooting-guide.md`** for detailed branching logic.

**Quick reference**:

| Symptom | Load Reference | First Command |
|---------|---------------|---------------|
| `nvm not found` | `references/nvm-install-sop.md` | `ls -la ~/.nvm` |
| `nvm found but fdk missing` | `references/error-command-not-found.md` | `nvm list` |
| `Node wrong version` | `references/node-version-sop.md` | `node --version` |
| `Works in current shell, fails in new shell` | `references/shell-persistence-sop.md` | `grep -n "nvm.sh" ~/.zshrc` |
| `npm permission denied` | `references/npm-permissions-sop.md` | `npm config get prefix` |

### Interactive Protocol

**Rule**: ONE command at a time, wait for human feedback, interpret, adapt.

**Example Flow: nvm not found**

```
Step 1: Check if nvm is installed

Run:
  ls -la ~/.nvm

Paste the output.
```

**Human**: `ls: /Users/bob/.nvm: No such file or directory`

```
nvm is not installed. Let's install it.

Step 2: Install nvm (Node Version Manager)

Run this command (it will take ~30 seconds):
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

When it finishes, paste the last few lines.
```

**Human**: `=> nvm is installed successfully...`

```
Good! Now load nvm into your current shell.

Step 3: Load nvm

Run these commands:
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

Then verify:
  nvm --version

Paste the version number.
```

**Human**: `0.40.1`

```
Perfect! nvm is working. Next: install Node 24.11.

Step 4: Install Node.js 24.11

Run:
  nvm install 24.11

This will download Node. When done, paste output.
```

...continues until resolved...

```
Final verification: Open a BRAND NEW terminal window.

In that new terminal, run:
  fdk version

What do you see?
```

**Human**: `10.0.1`

```
✅ All set! FDK is now working correctly.

Summary of what we fixed:
- Installed nvm (Node Version Manager)
- Installed Node.js 24.11
- Installed FDK 10.0.1
- Configured shell to load nvm automatically

Your setup is complete.
```

### Verification Checklist (Agent Use)

Before declaring success, ensure:
- [ ] Command works in CURRENT shell
- [ ] Command works in NEW shell (verify persistence)
- [ ] Human explicitly confirms "it's working"

### Anti-Patterns (What NOT to Do)

❌ Don't retry `--fix` Task after it fails  
❌ Don't give 5+ commands in one message  
❌ Don't assume human knows technical jargon (explain as you go)  
❌ Don't suggest "reinstall everything" without diagnosis  
❌ Don't ask for diagnostic bundles or support tickets  

### Edge Cases

**If stuck after 3 attempts with same error**:
```
We're seeing the same error repeatedly. Let me try a different approach.

Quick questions:
1. What OS are you using? (macOS / Windows / Linux)
2. Are you in a corporate/restricted environment?
3. Have you recently modified ~/.zshrc or ~/.bashrc?

This will help me suggest an alternative fix.
```

**If issue is outside FDK/Node scope**:
```
This looks like [describe issue - e.g., "a Git configuration problem"].

I specialize in FDK/Node/npm setup. For this specific issue:
- [Suggest relevant documentation]
- Or: I can help with a workaround if you'd like
```

### Success Criteria

Interactive session ends when:
- ✅ Verification passes in NEW terminal
- ✅ Human says "it's working" or "all set"
- ✅ Human asks to stop

### Reference Files (Progressive Disclosure)

Load these on-demand based on detected issue:

- **`references/interactive-troubleshooting-guide.md`** - Master decision tree (always load in Phase 3)
- **`references/nvm-install-sop.md`** - Install nvm from scratch
- **`references/node-version-sop.md`** - Switch/persist Node versions
- **`references/shell-persistence-sop.md`** - Fix shell config for persistence
- **`references/npm-permissions-sop.md`** - Fix npm EACCES/EPERM errors
- **`references/error-command-not-found.md`** - FDK PATH alignment (already exists)

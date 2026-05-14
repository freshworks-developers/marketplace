# Skills Troubleshooting Guide

**Fix issues with Freshworks skills in Cursor, Claude Code, and OpenAI Codex**

This guide covers **real problems you'll actually encounter** when installing and using these skills, not generic advice. **Codex** uses **`.codex-plugin/plugin.json`** and **`skills/*/SKILL.md`**; many slash-command and Cursor-rule checks below do not apply there—see [OpenAI Codex](#openai-codex).

**Before GitHub Issues:** use **[ISSUES.md](ISSUES.md)** — **mandatory** issue-body template + checklists (issues without the template may be closed).

**Corporate networks / TLS / proxy:** **[docs/network-requirements.md](docs/network-requirements.md)**.

---

## Quick Start: Is Your Skill Broken?

### Test 1: Are skills installed?

**Cursor:**
```bash
ls ~/.cursor/skills/
# Should show: fw-app-dev  fw-ai-actions-app  fw-review  fw-setup  fw-publish (subset depends on what you installed)
```

**Claude Code:**
```bash
ls ~/.claude/skills/
# Should show: fw-app-dev  fw-ai-actions-app  fw-review  fw-setup  fw-publish (subset depends on what you installed)
```

**If empty:** You need to install skills first. See [Installation](#installation-from-scratch).

---

### Test 2: Do commands work?

**In Cursor or Claude Code, type:**
```
/fdk-fix
```

- ✅ Command shows in autocomplete → Commands work
- ❌ "Command not found" → See [Issue #3: Commands Not Working](#issue-3-claude-code-ignoring-commands)

---

### Test 3: Do rules apply? (Cursor only)

**Create a test file `test.js`:**
```javascript
const result = await $request.post('https://api.example.com', {});
```

**Expected:** Cursor immediately warns you:
```
❌ Platform 3.0: Use $request.invokeTemplate() not .post()
```

**If no warning:** Rules aren't loading. See [Issue #1](#issue-1-cursor-rules-not-loading-after-installation).

---

### Test 4: OpenAI Codex plugin (optional)

**If you use Codex** with the bundled plugin (**[`.codex-plugin/plugin.json`](.codex-plugin/plugin.json)**):

1. **Repo root matters:** Run `codex plugin marketplace add ./` only from the directory that contains `.codex-plugin/plugin.json` (after `git clone`).
2. Restart Codex so it picks up **`skills/`** and **`.mcp.json`** references.
3. **Slash commands** (`/fdk-fix`, `/fw-setup-install`) are **Cursor / Claude Code** conventions. In Codex, rely on each skill’s **`SKILL.md`** workflows.
4. **Publish MCP:** If Marketplace tools fail with auth errors, set the Portal JWT per **[AGENTS.md](AGENTS.md)** and **`skills/fw-publish/SKILL.md`**.

More detail: **[README.md](README.md)** (Quick Start → OpenAI Codex); see **[Codex-specific problems](#codex-specific-problems)** below.

---

## How Skills Actually Work

**Claude Code:**
- Everything is in the `SKILL.md` file
- Agent reads SKILL.md and follows instructions
- Commands are just markdown files
- No separate "rules" system

**Cursor:**
- Needs THREE things to work:
  1. `SKILL.md` - The main skill
  2. `.cursor-plugin/plugin.json` - Config file
  3. `rules/*.mdc` - Rule files that enforce patterns
- If ANY of these are broken, parts of the skill won't work

**OpenAI Codex:**
- Uses **`.codex-plugin/plugin.json`** at repo root (**`skills`**, **`mcpServers`** → **`.mcp.json`**)
- Loads **`skills/*/SKILL.md`** as the source of truth; no separate bundled **`.mdc`** rules layer in the Codex UI
- Optional **MCP** for **fw-publish**; token setup is client-specific—see **AGENTS.md**

**Key Difference:**
- Claude Code: Install and it works (usually)
- Cursor: Install and it might be broken (often needs fixing)
- Codex: Plugin path + repo layout must be correct; behavior follows **SKILL.md**, not slash autocomplete

---

## Installation from Scratch

### Method 1: npx (Easiest)

```bash
# For Cursor
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-setup

# For Claude Code  
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-app-dev
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-setup
```

**Then restart your IDE.**

**If npx fails** or hangs, use Method 2.

---

### Method 2: Manual Installation (Most Reliable)

```bash
# 1. Download this repo
cd ~/Downloads
git clone https://github.com/freshworks-developers/fw-dev-tools.git
cd fw-dev-tools

# 2. For Cursor:
mkdir -p ~/.cursor/skills
cp -r skills/fw-app-dev ~/.cursor/skills/
cp -r skills/fw-setup ~/.cursor/skills/

# 2. For Claude Code:
mkdir -p ~/.claude/skills
cp -r skills/fw-app-dev ~/.claude/skills/
cp -r skills/fw-setup ~/.claude/skills/

# 3. Verify installation
ls ~/.cursor/skills/fw-app-dev/SKILL.md  # Should exist
ls ~/.cursor/skills/fw-app-dev/.cursor-plugin/plugin.json  # Should exist

# 4. Restart your IDE completely (close ALL windows)
```

**Verify it worked:**
- Type `/fdk` and see if commands autocomplete
- For Cursor: Test rules with the Platform 2.x code test above
- **For Codex:** From repo root after `codex plugin marketplace add ./`, open a conversation and confirm the assistant can summarize **`skills/fw-app-dev/SKILL.md`** (proves **`skills`** path resolves). For MCP publish failures, jump to **[Codex-specific problems](#codex-specific-problems)**.

---

## Codex-specific problems

**Plugin path / “plugin not found”:** You must register the marketplace from the **cloned repository root** (same folder as **`.codex-plugin/plugin.json`**). If you moved only **`skills/`** without the umbrella manifest, Codex cannot load the bundled plugin correctly.

**“Slash commands don't work” on Codex:** Expected. Prefer natural-language prompts that reference **`SKILL.md`** sections (same rules as **`AGENTS.md`**: **`SKILL.md` is authoritative**).

**MCP tools missing or HTTP 401 on publish:** Configure **`fw-dev-mcp`** JWT per **[AGENTS.md](AGENTS.md)** and **[skills/fw-publish/](skills/fw-publish/)**. **Codex** reads **`mcpServers`** from **[.mcp.json](.mcp.json)** via the plugin manifest; put your JWT in the client-supported form (typically `Authorization: Bearer <your-jwt>`).

---

## Known Issues

### Issue #1: Cursor Rules Not Loading After Installation

**What You See:**
```
Installed skill via npx or git clone
Commands show up and work
But rules don't apply - no Platform 3.0 enforcement
Can write Platform 2.x code without warnings
```

**What's Actually Wrong:**
The skill you installed has a broken or outdated `plugin.json` file. It's missing the `rulesDirectory` declaration that tells Cursor where the rules are.

**Why This Happens:**
- Skill was built for older Cursor versions (pre-0.40)
- Skill developer forgot to add `rulesDirectory` field
- You installed from an old branch/tag

**Check If This Is Your Issue:**
```bash
cat ~/.cursor/skills/fw-app-dev/.cursor-plugin/plugin.json
```

Look for these lines:
```json
{
  "rulesDirectory": "./rules",
  "commandsDirectory": "./commands"
}
```

**If missing, you need to manually fix the skill:**

```bash
cd ~/.cursor/skills/fw-app-dev/

# Backup original
cp .cursor-plugin/plugin.json .cursor-plugin/plugin.json.backup

# Add the missing fields
# Edit .cursor-plugin/plugin.json and add these lines after "name":
# "rulesDirectory": "./rules",
# "commandsDirectory": "./commands",
```

**Or edit directly:**
```bash
# For macOS/Linux:
cat .cursor-plugin/plugin.json | \
  python3 -c "import sys,json; d=json.load(sys.stdin); d['rulesDirectory']='./rules'; d['commandsDirectory']='./commands'; print(json.dumps(d,indent=2))" \
  > .cursor-plugin/plugin.json.new && \
  mv .cursor-plugin/plugin.json.new .cursor-plugin/plugin.json
```

**After fixing, restart Cursor.**

**Verify it worked:**
- Open a `.js` file
- Write Platform 2.x code like `$request.post('url', {})`
- Cursor should immediately warn you
- If no warning, check Issue #2 (duplicate rules)

---

### Issue #2: Duplicate Rules/Commands in `.cursor/` Subdirectories

**Symptom:**
```
Have both:
  skills/fw-app-dev/rules/*.mdc
  skills/fw-app-dev/.cursor/rules/*.mdc

Cursor only finds one or gets confused
Updates don't apply
```

**Root Cause:**
Legacy structure from pre-0.40 Cursor versions. Old pattern was:
```
skill/
└── .cursor/
    ├── rules/
    └── commands/
```

New pattern (post-0.40, multi-IDE compatible):
```
skill/
├── .cursor-plugin/plugin.json  # Config only
├── rules/                      # IDE-agnostic
└── commands/                   # IDE-agnostic
```

**Technical Details:**
- Cursor changed skill loading in v0.40+
- `.cursor/` subdirs are now IGNORED
- Only root-level `rules/` and `commands/` with plugin.json declaration
- Duplicates cause undefined behavior (which one loads?)

**Fix:**
```bash
cd ~/.cursor/skills/fw-app-dev/

# Remove old structure
rm -rf .cursor/commands
rm -rf .cursor/rules
# Keep .cursor-plugin/ for config

# Verify rules at root
ls -la rules/
ls -la commands/
```

**Verification:**
```bash
# Should NOT exist:
ls .cursor/rules 2>&1 | grep "No such file"
ls .cursor/commands 2>&1 | grep "No such file"

# SHOULD exist:
ls rules/*.mdc | wc -l  # > 0
ls .cursor-plugin/plugin.json  # exists
```

---

### Issue #3: Commands Don't Show Up

**What You See:**
```
Type /fdk-fix
Nothing happens - no autocomplete, no command
Type / and see other commands but not the skill commands
```

**Quick Check - Is the skill actually installed?**
```bash
# Cursor
ls ~/.cursor/skills/fw-app-dev/SKILL.md
ls ~/.cursor/skills/fw-app-dev/commands/

# Claude Code
ls ~/.claude/skills/fw-app-dev/SKILL.md
ls ~/.claude/skills/fw-app-dev/commands/
```

**If files don't exist:** Skill isn't installed. See [Installation from Scratch](#installation-from-scratch).

**If files exist but commands still don't work:**

**Option 1: Restart your IDE** (close ALL windows, reopen)
- Most common fix for command discovery

**Option 2: Reinstall the skill**
```bash
# For Cursor - remove and reinstall
rm -rf ~/.cursor/skills/fw-app-dev
# Then follow installation steps again

# For Claude Code - remove and reinstall  
rm -rf ~/.claude/skills/fw-app-dev
# Then follow installation steps again
```

**Option 3: The skill is broken**

Check if command files actually exist:
```bash
ls ~/.cursor/skills/fw-app-dev/commands/*.md
```

**Should see files like:**
```
fdk-fix.md
fdk-migrate.md
fdk-refactor.md
fdk-review.md
```

**If you see NO .md files or they're in wrong location:**
- The skill you installed is broken
- Report it: https://github.com/freshworks-developers/fw-dev-tools/issues
- Include: "Commands missing from fw-app-dev skill" + what you see when you run `ls` above

**For Claude Code specifically:**

Ask Claude directly:
```
What skills do you have loaded? List all commands.
```

If Claude doesn't list `/fdk-fix`, `/fdk-migrate` etc., the SKILL.md file is broken. Report this as a bug.

---

### Issue #4: Cursor Rules Exist But Never Apply

**What You See:**
```
Skill installed, rules folder has .mdc files
But Platform 2.x code doesn't trigger warnings
Rules just... don't work
```

**Quick Test:**
```bash
# Check if rules exist
ls ~/.cursor/skills/fw-app-dev/rules/*.mdc

# Should show multiple .mdc files
```

**If you see files but rules still don't apply:**

This is usually **Issue #1** (plugin.json missing rulesDirectory). Go back to [Issue #1](#issue-1-cursor-rules-not-loading-after-installation) first.

**If Issue #1 is fixed and rules STILL don't work:**

The skill developer broke the rule files. This is a skill bug, not your fault.

**Report it:**
```bash
# Get diagnostic info
cd ~/.cursor/skills/fw-app-dev/
cat .cursor-plugin/plugin.json | grep rules
ls -la rules/*.mdc
```

Post this output at: https://github.com/freshworks-developers/fw-dev-tools/issues

**Temporary Workaround:**
Reinstall from the latest version (skill may have been fixed):
```bash
rm -rf ~/.cursor/skills/fw-app-dev
# Reinstall using Method 2 (manual installation)
```

---

### Issue #5: Skills in Wrong Directory Structure

**Symptom:**
```
Installed to:
  ~/.cursor/skills/fw-dev-tools/skills/fw-app-dev/

Instead of:
  ~/.cursor/skills/fw-app-dev/
```

**Root Cause:**
`npx skills add` or `git clone` created extra nesting.

**Technical Details:**
Cursor skill loader expects:
```
~/.cursor/skills/
├── fw-app-dev/
│   └── SKILL.md
└── fw-setup/
    └── SKILL.md
```

Not:
```
~/.cursor/skills/
└── marketplace/
    └── skills/
        ├── fw-app-dev/
        └── fw-setup/
```

Extra layers are ignored.

**Fix:**
```bash
cd ~/.cursor/skills/

# If you have marketplace/ wrapper:
mv marketplace/skills/* .
rm -rf marketplace

# Verify
ls -la fw-app-dev/SKILL.md
ls -la fw-setup/SKILL.md
```

**Why This Happens:**
- Cloning entire repo instead of just skills
- `npx skills add` with wrong path syntax
- Manual copy included parent directories

---

### Issue #6: Permission Denied on macOS (Gatekeeper)

**Symptom:**
```bash
./scripts/fw-setup-run-background.sh
# zsh: operation not permitted
```

**Root Cause:**
macOS Gatekeeper blocking unsigned scripts.

**Technical Details:**
macOS 13+ Ventura requires:
- Scripts to be signed OR
- Quarantine attribute removed OR  
- Explicitly allowed in System Settings

**Fix (Quick):**
```bash
cd ~/.cursor/skills/fw-setup/

# Remove quarantine attribute
xattr -r -d com.apple.quarantine scripts/
xattr -r -d com.apple.quarantine .

# Make executable
chmod +x scripts/*.sh
```

**Fix (Proper):**
System Settings → Privacy & Security → "Allow apps from: App Store and identified developers"

Then allow the script when prompted.

**Verification:**
```bash
xattr -l scripts/fw-setup-run-background.sh
# Should NOT show com.apple.quarantine
```

---

### Issue #7: Some Rules Work, Others Don't (Cursor)

**What You See:**
```
Some rules trigger warnings
Other rules never do
Inconsistent enforcement
```

**This means:**
- Skill is partially working
- Some rule files are broken
- Others are fine

**What You Should Do:**

**Don't try to debug this yourself.** This is a skill developer issue.

**Report it with specifics:**
1. Which rules work (give example of code that triggers warning)
2. Which rules don't (give example of code that should warn but doesn't)
3. Post at: https://github.com/freshworks-developers/fw-dev-tools/issues

**Example good bug report:**
```markdown
Platform 3.0 rule works:
- Writing $request.post() triggers warning ✅

Complexity rule doesn't work:
- Writing function with 15 if statements, no warning ❌

Environment:
- Cursor version: 0.41.3
- Skill: fw-app-dev
- Rules exist: ls ~/.cursor/skills/fw-app-dev/rules/*.mdc shows 9 files
```

---

### Issue #8: Claude Code Not Following Skill Instructions

**What You See:**
```
Claude Code loads the skill
But doesn't follow the rules/patterns
Accepts Platform 2.x code when it shouldn't
```

**Reality Check:**

Claude Code doesn't have Cursor's automatic rule enforcement. It relies on:
1. What's written in SKILL.md
2. Claude actually reading and following it

**If Claude isn't enforcing Platform 3.0:**

Ask Claude directly:
```
Are you enforcing Platform 3.0 rules? What should I use instead of $request.post()?
```

**If Claude says "I don't have Platform 3.0 rules":**
- The skill isn't loaded
- Reinstall it

**If Claude says "Yes, use $request.invokeTemplate()":**
- Skill IS working
- Claude just missed this one instance
- Remind Claude: "This violates Platform 3.0, fix it"

**Claude Code is more flexible but less strict than Cursor.**

If you want **automatic enforcement**, use Cursor.  
If you want **guidance but not enforcement**, Claude Code is fine.

---

### Issue #9: Skills Stopped Working After Cursor Update

**What You See:**
```
Updated Cursor to latest version
Skills disappeared or stopped working
Commands gone
```

**This happens when:**
Cursor changed how skills work between versions. Your old skill format is outdated.

**Fix: Reinstall the skills**

```bash
# 1. Remove old skills
rm -rf ~/.cursor/skills/fw-app-dev
rm -rf ~/.cursor/skills/fw-setup

# 2. Reinstall latest version
cd ~/Downloads
git clone https://github.com/freshworks-developers/fw-dev-tools.git
cd fw-dev-tools
cp -r skills/fw-app-dev ~/.cursor/skills/
cp -r skills/fw-setup ~/.cursor/skills/

# 3. Restart Cursor (close ALL windows)
```

**Why reinstalling works:**
- Latest skill format is compatible with latest Cursor
- Old skills + new Cursor = broken
- Fresh install = everything matches

**After reinstalling:**
- Test commands: Type `/fdk` and see autocomplete
- Test rules: Write `$request.post()` and see if warning appears

---

### Issue #10: Git Cloning Skills Gets Wrong Files

**Symptom:**
```bash
git clone https://github.com/freshworks-developers/fw-dev-tools.git
cd fw-dev-tools/

# Now what? How do I install skills?
```

**Root Cause:**
This repo is a MONOREPO. Skills are in `skills/` subdirectory.

**Correct Installation from Git Clone:**

```bash
# 1. Clone repo
git clone https://github.com/freshworks-developers/fw-dev-tools.git
cd fw-dev-tools/

# 2. For Cursor:
cp -r skills/fw-app-dev ~/.cursor/skills/
cp -r skills/fw-setup ~/.cursor/skills/

# 3. For Claude Code:
cp -r skills/fw-app-dev ~/.claude/skills/
cp -r skills/fw-setup ~/.claude/skills/

# 4. Restart IDE
```

**Do NOT:**
```bash
# ❌ Wrong:
cp -r marketplace ~/.cursor/skills/

# ❌ Wrong:
ln -s $(pwd) ~/.cursor/skills/fw-dev-tools

# ❌ Wrong:
mv marketplace ~/.cursor/skills/
```

**Why:**
IDE expects each skill in its own directory under `~/.cursor/skills/`, not a wrapper repo.

---

## Configuration Reference

### Cursor plugin.json Schema

**Minimal Required:**
```json
{
  "name": "skill-name",
  "rulesDirectory": "./rules",
  "commandsDirectory": "./commands"
}
```

**Full Schema:**
```json
{
  "name": "skill-name",
  "displayName": "Human Readable Name",
  "version": "1.0.0",
  "description": "What this skill does",
  "author": {
    "name": "Author Name",
    "email": "author@example.com"
  },
  "homepage": "https://github.com/...",
  "repository": "https://github.com/...",
  "license": "MIT",
  "keywords": ["freshworks", "fdk"],
  "category": "developer-tools",
  "tags": ["automation"],
  "rulesDirectory": "./rules",
  "commandsDirectory": "./commands",
  "commands": [
    {
      "name": "command-name",
      "description": "What command does",
      "file": "commands/command-name.md"
    }
  ]
}
```

**Critical Fields:**
- `name` - Used for skill identification (must match directory name)
- `rulesDirectory` - WHERE rules are (relative to plugin.json)
- `commandsDirectory` - WHERE commands are (relative to plugin.json)

---

### Claude Code SKILL.md Schema

**Minimal Required:**
```yaml
---
name: skill-name
description: What this skill does
---

# Skill Content Here
```

**Full Schema:**
```yaml
---
name: skill-name
description: Multi-line description of what skill does and when to use it
compatibility: Platform versions, Node versions, etc
argument-hint: "[optional-args]"
allowed-tools: "shell read write grep"
---

# Skill Title

Instructions for agent...

## Progressive Disclosure

For X, load `references/x.md`
For Y, load `references/y.md`
```

**Critical Fields:**
- `name` - Skill identifier
- `description` - When to use this skill (agent decision making)
- Content after frontmatter - The actual skill instructions

---

### Rule (.mdc) File Schema

**Minimal Required:**
```yaml
---
name: rule-name
description: What this rule enforces
---

# Rule Content
```

**Full Schema:**
```yaml
---
name: rule-name
description: What this rule enforces
alwaysApply: true
globs: ["**/*.js", "**/*.ts"]
---

# Rule Title

Enforcement logic...
```

**Critical Fields:**
- `name` - MUST match filename (without `.mdc`)
- `alwaysApply` - `true` = load automatically, `false` = on-demand
- `globs` - File patterns that auto-trigger this rule

---

## Debugging Techniques

### Enable Cursor Dev Tools

```
Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
Type: "Toggle Developer Tools"
```

**Console Tab:**
Look for skill loading errors:
```
Failed to load skill: fw-app-dev
Error: rulesDirectory not specified
```

**Network Tab:**
Check if skill files are being fetched (for remote skills)

---

### Check Claude Code Context

Ask Claude:
```
What skills do you have loaded?
List all rules you're enforcing
What commands are available from skills?
```

Should respond with accurate list. If not, skill didn't load.

---

### Verify File Permissions

```bash
# All files should be readable
find ~/.cursor/skills/fw-app-dev -type f ! -perm -u=r

# Should output nothing
# If shows files, fix with:
chmod -R u+r ~/.cursor/skills/fw-app-dev
```

---

### Test Rule Application (Cursor)

Create test file that violates a rule:

**Test for Platform 3.0 enforcement:**
```javascript
// test-violation.js
const data = await $request.post('https://api.example.com', {
  body: { test: true }
});
```

Save file. Cursor should immediately warn:
```
Platform 3.0 enforcement: Use $request.invokeTemplate() not .post()
```

If no warning, rule not applying. Check:
1. Rule has `alwaysApply: true`
2. plugin.json has `rulesDirectory`
3. Rule name matches filename

---

## Advanced Configuration

### Custom Skill Directory

**Cursor:**
Not supported. Must use `~/.cursor/skills/`

**Claude Code:**
Check settings for custom path option (may vary by version)

---

### Multi-Project Skills

**Problem:** Different projects need different skill versions

**Solution:** Use project-level skill overrides (if supported)

**For now:** Install globally, use project-specific `.nvmrc` or similar for environment differences

---

### Skill Priority/Loading Order

**Cursor:**
- `alwaysApply: true` rules load first
- Then file-pattern-matched rules (globs)
- Then on-demand rules

**Claude Code:**
- SKILL.md always loaded
- References loaded on-demand when mentioned
- No priority system (all context is equal)

---

## Known Limitations

### Cursor
- Cannot have skills in custom directories
- Rule globs limited to simple patterns (no regex)
- No skill dependency system (skill A requires skill B)
- Commands cannot call other commands directly

### Claude Code
- No automatic rule system (must be in SKILL.md)
- Progressive disclosure relies on explicit mentions
- Large skills consume context window
- No multi-skill coordination

### OpenAI Codex
- Slash commands (`/fdk-fix`, `/fw-setup-*`) are **not** guaranteed; use **`SKILL.md`** workflows explicitly
- Must install plugin from **repository root** (see [.codex-plugin/plugin.json](.codex-plugin/plugin.json))
- MCP token wiring is client-specific; follow **AGENTS.md** and **fw-publish**

---

## Getting Help

Use **[ISSUES.md](ISSUES.md)** at the repository root for:

- What **not** to paste (secrets)
- The **mandatory** **issue body template** (filled in) plus **checkboxes** for attachments (validate, pack, zip layout, publish HTTP codes, MCP errors)
- **Skill-install** diagnostic commands when skills fail to load

**Quick reminders:** avoid generic lines like “my skill doesn’t work” without context; include **IDE + version**, **exact errors**, **minimal repro**, and what you already tried from this guide.

**Report issues:** [https://github.com/freshworks-developers/fw-dev-tools/issues](https://github.com/freshworks-developers/fw-dev-tools/issues)

---

**Last Updated:** 2026-05-14

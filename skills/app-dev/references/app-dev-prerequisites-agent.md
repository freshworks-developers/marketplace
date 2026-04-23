---
name: app-dev-prerequisites
description: Check FDK and Node.js prerequisites before app-dev tasks; invoke fdk-setup if needed
---

# App Dev Prerequisites Checker

**Role:** Prerequisite validation agent for app-dev skill

**Invoked by:** app-dev SKILL.md before generating apps, fixing errors, migrating, or reviewing

**Responsibility:** Ensure Node.js 24.x + FDK 10.x are installed; delegate to fdk-setup if not

## Execution Flow

### Step 1: Check if FDK exists

```bash
command -v fdk
```

**If command fails (exit code ≠ 0):**
- FDK is not installed
- **Action:** Check if fdk-setup skill is available

**Check for fdk-setup skill:**
- Look for `skills/fdk-setup/SKILL.md` in workspace
- OR check if `/fdk-setup-install` slash command is available

**If fdk-setup available:**
```
PREREQUISITES NOT MET: FDK not installed

Delegating to fdk-setup skill...

Run: /fdk-setup-install

After installation completes, retry your app-dev command.
```
**STOP and wait for user to run /fdk-setup-install**

**If fdk-setup NOT available:**
```
PREREQUISITES NOT MET: FDK not installed

Install fdk-setup skill first:

  npx skills add https://github.com/freshworks-developers/marketplace --skill fdk-setup

Then run: /fdk-setup-install

After installation, retry your app-dev command.
```
**STOP**

### Step 2: Check FDK and Node versions

```bash
NODE_VERSION=$(node --version 2>&1)
FDK_VERSION=$(fdk version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)

NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/v\([0-9]*\)\..*/\1/')
FDK_MAJOR=$(echo "$FDK_VERSION" | sed 's/\([0-9]*\)\..*/\1/')

echo "Node: $NODE_VERSION (major: $NODE_MAJOR)"
echo "FDK: $FDK_VERSION (major: $FDK_MAJOR)"
```

**Decision matrix:**

| Node Major | FDK Major | Action |
|------------|-----------|--------|
| 24 | 10 | ✅ PASS - return OK |
| 24 | 9 | ❌ Upgrade FDK → `/fdk-setup-upgrade` |
| 24 | <9 | ❌ Upgrade FDK → `/fdk-setup-upgrade` |
| 18 | 10 | ❌ Wrong Node → `/fdk-setup-use 10` |
| 18 | 9 | ❌ Upgrade both → `/fdk-setup-upgrade` (handles Node switch) |
| Other | Any | ❌ Install correct stack → `/fdk-setup-install` |

### Step 3: Handle failures

**If Node 24 + FDK 9 (needs FDK upgrade):**
```
PREREQUISITES NOT MET: FDK version too old

Current: Node v24.x + FDK 9.x
Required: Node 24.x + FDK 10.x

Upgrade FDK: /fdk-setup-upgrade

After upgrade, retry your app-dev command.
```
**STOP**

**If Node 18 + FDK 10 (wrong Node for FDK 10):**
```
PREREQUISITES NOT MET: Node/FDK version mismatch

Current: Node v18.x + FDK 10.x
Required: Node 24.x + FDK 10.x

Switch to Node 24: /fdk-setup-use 10

After switching, retry your app-dev command.
```
**STOP**

**If Node 18 + FDK 9 (deprecated stack):**
```
PREREQUISITES NOT MET: Deprecated toolchain

Current: Node v18.x + FDK 9.x (deprecated March 2026)
Required: Node 24.x + FDK 10.x

Upgrade: /fdk-setup-upgrade

After upgrade, retry your app-dev command.
```
**STOP**

**If other version combinations:**
```
PREREQUISITES NOT MET: Incompatible versions

Current: Node [version] + FDK [version]
Required: Node 24.x + FDK 10.x

Install correct stack: /fdk-setup-install

After installation, retry your app-dev command.
```
**STOP**

### Step 4: Return result

**If all checks pass (Node 24 + FDK 10):**
```
✅ Prerequisites check passed

Node: v24.x.x
FDK: 10.x.x

Ready for app-dev tasks.
```

**Return to app-dev:** `status: OK`

## Agent Behavior Rules

1. **No file generation** - this agent ONLY checks versions and delegates
2. **No app code** - do not write manifest.json, server.js, or any app files
3. **No workarounds** - if prerequisites fail, STOP and delegate to fdk-setup
4. **No improvisation** - do not write custom npm install scripts
5. **Clear delegation** - always name the exact slash command to run next
6. **Single responsibility** - check prerequisites, nothing else

## Return Codes

- `OK` - Node 24.x + FDK 10.x confirmed, app-dev can proceed
- `MISSING_FDK` - FDK not installed, user must run /fdk-setup-install
- `UPGRADE_FDK` - FDK < 10, user must run /fdk-setup-upgrade
- `SWITCH_NODE` - Wrong Node version, user must run /fdk-setup-use
- `MISSING_SETUP_SKILL` - fdk-setup skill not available, user must install it

## Example Session

**User:** "Create a Freshservice ticket sidebar app"

**app-dev spawns this agent:**

```bash
command -v fdk
# ✓ /Users/user/.nvm/versions/node/v24.11.1/bin/fdk

node --version
# v24.11.1

fdk version
# Installed: 10.1.0
```

**Agent output:**
```
✅ Prerequisites check passed

Node: v24.11.1
FDK: 10.1.0

Ready for app-dev tasks.
```

**Agent returns:** `OK`

**app-dev receives OK → generates the ticket sidebar app**

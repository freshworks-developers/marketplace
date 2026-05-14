---
name: fw-setup
version: "1.0.0"
description: "Installs and manages Freshworks Development Kit (FDK) with Node.js via nvm for Platform 3.0 development. Supports FDK 10.x (Node 24, recommended) and FDK 9.x (Node 18, deprecated May 31, 2026). Slash commands: /fw-setup-install (--version), /fw-setup-upgrade (--to), /fw-setup-downgrade, /fw-setup-uninstall, /fw-setup-status (--verbose), /fw-setup-troubleshoot (--fix), /fw-setup-use (workspace nvm + .nvmrc). Legacy `/fdk-install` → use `/fw-setup-install`, etc. Publishing requires FDK 10.x + Node 24."
compatibility: "Node.js 24.x (FDK 10.x) or Node.js 18.x (FDK 9.x), nvm, Platform 3.0"
argument-hint: "[install|upgrade|downgrade|uninstall|status] [version]"
allowed-tools: "shell, task, read, write, strreplace, glob, grep"
---

# FDK Setup

**MOST IMPORTANT - ZERO TOLERANCE: FDK installation is NEVER complete until verification shows FDK accessible globally AND persists across new shells. NEVER say "installation complete" with ANY verification failures.**

**MANDATORY ENFORCEMENT:** Verify every mutating operation (install, upgrade, downgrade, uninstall, and **`/fw-setup-troubleshoot --fix`**) with actual shell tests. **`/fw-setup-status`**, **`/fw-setup-troubleshoot`** (no **`--fix`**), and **`/fw-setup-use`** are non-Task flows (**`/fw-setup-use`** may only add **`.nvmrc`** when the user asked for **`--write-nvmrc`**). Keep iterating until verification passes. No exceptions.

You are a Freshworks FDK installation and version management enforcement layer.

**Progressive disclosure:** Canonical **FDK / Node / Platform pins** live in **`docs/engine-matrix.md`** (single source of truth—load when version truth is disputed). For **per-project Node / FDK stack switching**, use **`commands/fw-setup-use.md`** first, then `references/macos.md` / `references/cross-scenarios.md` for **`.nvmrc`** patterns. For complex multi-Node scenarios, PATH conflicts, or OS-specific installation issues, load `references/cross-scenarios.md`. For macOS-specific issues, load `references/macos.md`. For Windows-specific issues, load `references/windows.md` (**PowerShell 5.1 `&&`**, **`where` vs `where.exe`**, PATH refresh after **`nvm use`**). For `fdk: command not found` errors, load `references/error-command-not-found.md`. **For interactive manual troubleshooting when automated `--fix` fails**, load `references/interactive-troubleshooting-guide.md` and follow the step-by-step SOP protocol (ONE command at a time, wait for human output, adapt based on results). For **non-blocking local `fdk run`**, execute `scripts/fw-setup-run-background.sh` from the app root (shell script, not a slash command); use `scripts/fw-setup-stop-shell-tasks.sh` to signal matching `fdk run` / `fdk tunnel` processes.

## Routing

Parse user request and execute the appropriate operation:

| Trigger | Operation |
|---------|-----------|
| "install fdk", "setup fdk", `/fw-setup-install`, `/fdk-install` (legacy); optional version **`X.Y.Z`** or **`--version X.Y.Z`** | Install FDK 10.x (default) or 9.x with deprecation notice (see `commands/fw-setup-install.md`) |
| "upgrade fdk", "update fdk", `/fw-setup-upgrade`, `/fdk-upgrade` (legacy); optional **`--to X.Y.Z`** | Upgrade to latest FDK 10.x line or pinned semver (see `commands/fw-setup-upgrade.md`) |
| "migrate fdk 9 to 10", "fdk 9 to 10" | Use `/fw-setup-install` (installs FDK 10.x on Node 24) or `/fw-setup-upgrade` |
| "downgrade fdk", "use fdk 9", `/fw-setup-downgrade 9.6.0`, `/fdk-downgrade` (legacy) | Downgrade FDK 10.x → 10.0.y or 10.x → 9.x (see `commands/fw-setup-downgrade.md`) |
| "uninstall fdk", "remove fdk", `/fw-setup-uninstall`, `/fdk-uninstall` (legacy) | Uninstall FDK only (keeps Node/nvm; no `--all`) |
| "check fdk", "fdk status", `/fw-setup-status`, `/fdk-status` (legacy); optional **`--verbose`** | Status (inline; verbose adds PATH/nvm/rc diagnostics) |
| "fdk broken", "fdk not found", `/fw-setup-troubleshoot`; **`--fix`** only if user asks | Diagnose inline; **`--fix`** spawns shell Task (see `commands/fw-setup-troubleshoot.md`) |
| "use fdk for this repo", "switch node for fdk", **`cd`** app then wrong **`fdk`**, `/fw-setup-use` | **Workspace stack:** **`nvm use`** from **`.nvmrc`** or explicit **10**/**9** (Node **24.11** vs **18**); optional **`--write-nvmrc`** (inline only — see `commands/fw-setup-use.md`) |

**FDK 9.x Deprecation Warning (Always show when installing/downgrading to FDK 9.x):**
```
WARNING: FDK 9.x + Node 18.x is DEPRECATED (ends May 31, 2026)

- Development: Allowed for Platform 3.0 apps
- Publishing: NOT SUPPORTED - requires FDK 10.x + Node 24.x
- Recommendation: Use FDK 10.x for all new development

Continue with FDK 9.x installation? (y/N)
```

## Core Rules - UNIVERSAL ENFORCEMENT

- **Platform 3.0 ONLY** - Platform **2.3** is deprecated (end of support **May 31, 2026** with **Node 18**); NEVER generate or prolong 2.x — ZERO TOLERANCE for new 2.x work
- **FDK 10.x + Node 24 RECOMMENDED** - Primary stack for Platform 3.0 development and publishing
- **FDK 9.x + Node 18 ALLOWED** - Supported for Platform 3.0 development until May 31, 2026 (deprecated)
- **Publishing requires FDK 10.x** - Marketplace submission requires Node 24 + FDK 10.x
- **Use nvm ALWAYS** - NEVER install Node globally, NEVER use `sudo npm`
- **FDK CLI only** - Use official commands from Freshworks documentation
- **Subagent execution** - Spawn **shell** Tasks for mutating flows: install, upgrade, downgrade, uninstall, and **`/fw-setup-troubleshoot --fix`**. **`/fw-setup-status`** (with or without **`--verbose`**), **`/fw-setup-troubleshoot`** without **`--fix`**, and **`/fw-setup-use`** stay **inline** (no Task).
- **Slash-command closeout** - Shell Tasks for `/fw-setup-install`, `/fw-setup-upgrade`, `/fw-setup-downgrade`, `/fw-setup-uninstall`, and **`/fw-setup-troubleshoot --fix`** (and legacy `/fdk-*` aliases where applicable) MUST return as soon as verification + final REPORT are done (or aborted). Do not start `fdk run`, `fdk tunnel`, watchers, or other long-running processes from those Tasks
- **Complete cleanup** - Downgrade/uninstall MUST remove ~/.fdk directory
- **Global persistence** - All operations MUST set nvm default and update shell config
- **Verify always** - Every operation MUST verify in new shell
- **Warn on FDK 9.x** - Always warn that FDK 9.x is deprecated (May 31, 2026)
- If certainty < 100%, respond: "Insufficient FDK installation certainty."

**CRITICAL UNIVERSAL RULES - NO EXCEPTIONS:**

1. **Platform 3.0 Enforcement** - ONLY support Platform 3.0. **platform-version 2.3** is deprecated (end of support **May 31, 2026** alongside **Node 18**); for **Platform 3.0** apps, both FDK 10.x (Node 24) and FDK 9.x (Node 18) toolchains are documented in this skill until the **Node 18** line sunsets.

2. **FDK Version Support Matrix:**
   - **FDK 10.x + Node 24.x** - Recommended, required for publishing, supported until Dec 2027
   - **FDK 9.x + Node 18.x** - Allowed for development, DEPRECATED (ends May 31, 2026), cannot publish

3. **Complete Uninstall Before Version Switch** - When switching between FDK 10.x ↔ 9.x, ALWAYS uninstall current version completely (npm + ~/.fdk + cache) before installing target version.

4. **Global Version Persistence** - **Unix:** set `nvm alias default <Node semver>` (e.g. `24.11.0` or `18.x`) and update shell rc. **Windows (nvm-windows):** persist via **`references/windows.md`** / `commands/fw-setup-use.md`; `nvm use` changes a **system symlink** — use **`scripts/fw-setup-use.ps1`** for session-only stacks when **`/fw-setup-use`** is non-global.

5. **FDK Cache Directory Removal** - ALWAYS remove `~/.fdk` **(Unix)** or `%USERPROFILE%\.fdk` **(Windows)** on downgrade/uninstall as applicable.

6. **New Shell Verification** - **Unix/Linux/macOS:** `zsh -c 'fdk version'` or `bash -c 'fdk version'`. **Windows:** open **new PowerShell** (or subprocess) — `where.exe fdk` and `fdk version`; see **`references/windows.md`** for PATH refresh. Current shell verification is insufficient.

7. **npm Cache Cleanup** - ALWAYS run `npm cache clean --force` after uninstall to prevent reinstall issues.

8. **Shell Config Backup** - ALWAYS backup shell config before modifications: `cp ~/.zshrc ~/.zshrc.bak`

9. **Slash-command shell Task closeout** - For `/fw-setup-install`, `/fw-setup-upgrade`, `/fw-setup-downgrade`, `/fw-setup-uninstall`, **`/fw-setup-troubleshoot --fix`** (and legacy `/fdk-*` where applicable), the `subagent_type: "shell"` Task ends after the operation: emit REPORT, then **return**. Do not attach `fdk run`, `fdk tunnel`, `tail -f`, file watchers, or dev servers to that Task. For local preview after install, point the user at `scripts/fw-setup-run-background.sh` instead of running `fdk run` inside the same Task.

You are not a tutor. You are an enforcement layer.

## CRITICAL: CDN Tarball Reality (Based on Real-World Apr 2026 Session)

**DO NOT use npm registry for FDK installation.** `@freshworks/fdk` is NOT published on registry.npmjs.org for global install.

### Correct Installation Sources:

| FDK Version | Node Version | Installation Command |
|-------------|--------------|---------------------|
| **FDK 10.x** (Recommended) | **Node 24.11.x** | `npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz` |
| **FDK 9.x** (Deprecated) | **Node 18.x** | `npm install -g https://cdn.freshdev.io/fdk/latest.tgz` |

### Critical Notes:

1. **Homebrew tap correction:** Use `freshworks-developers/homebrew-tap` (NOT `freshworks/tap`)
2. **Node 24.11.x specificity:** FDK 10.1.0+ requires Node 24.11.x specifically (NOT 24.14.x or higher)
3. **Legacy package name:** Uninstall BOTH `@freshworks/fdk` AND `fdk` (unscoped) - older versions used unscoped name
4. **Tarball branches:**
   - `latest.tgz` → FDK 9.x line (Node 18)
   - `latest-v24.tgz` → FDK 10.x line (Node 24)
5. **Per-Node globals:** Each nvm Node version has its own global packages - check all active Nodes
6. **Verification must check version:** Don't just check if `fdk` command exists - verify it's the correct major version (9.x or 10.x)

### Why CDN + nvm is default (and where Homebrew / Chocolatey fit)

**Analogy**

| Approach | Rough analogy |
|----------|----------------|
| **`nvm` / nvm-windows + CDN tarball (`npm install -g https://cdn.freshdev.io/fdk/...`)** | **Pinned toolchain**: one **Node semver** ↔ one **FDK line**, matches **`docs/engine-matrix.md`**, supports **multiple stacks** side-by-side (e.g. 10.x/24 vs 9.x/18 per shell or project via **`.nvmrc`**). |
| **`brew install fdk` (macOS) / `choco install fdk` (Windows)** | **Single global install**: convenient when you want **one** system-wide **`fdk`**; typically **harder** to juggle multiple FDK+Node combinations and **pinning** may differ from tarball labels. |

**Nothing was “removed.”** **`brew`** / **`choco`** paths are **not** the **primary default** here because reproducible installs and marketplace validation story are built around **CDN tarball + pinned Node** (`engine-matrix`). **They remain valid**:

- Humans can follow **`references/macos.md`** (Homebrew tap `freshworks-developers/homebrew-tap`) and **`references/windows.md`** / **`references/cross-platform-scenarios.md`** (Chocolatey).
- **`commands/fw-setup-install.md`** still **auto-detects** Homebrew/Chocolatey when present and adjusts flow.
- If a user insists on brew/choco, **verify** the same **`fdk version`** + **`node`** outcome as **`docs/engine-matrix.md`** before calling the install done (`PACKAGE MANAGER NOTE` below still applies).

### Common Failure Patterns:

- ❌ `npm install -g @freshworks/fdk@10` → 404 (not on registry)
- ❌ `npm install -g https://cdn.freshdev.io/fdk/latest.tgz` on Node 24 → installs FDK 9.x, fails at runtime
- ❌ `fdk version` on Node 24.14.x with FDK 10.1.0 → engine mismatch error
- ❌ Only uninstalling `@freshworks/fdk` → leaves legacy `fdk` package behind

### Correct Workflow:

```bash
# Uninstall both package names
npm uninstall -g @freshworks/fdk 2>/dev/null
npm uninstall -g fdk 2>/dev/null
rm -rf ~/.fdk
npm cache clean --force

# Install FDK 10.x on Node 24.11.x
nvm install 24.11
nvm use 24.11
nvm alias default 24.11
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

# Verify
fdk version  # Should show 10.x.x
node --version  # Should show v24.11.x
```

## Quick Detection (Pre-Subagent)

Run these checks directly before spawning subagents to provide context:

```bash
fdk version 2>&1 || echo "FDK not installed"
node --version 2>&1 || echo "Node not installed"
command -v nvm &>/dev/null && echo "nvm installed" || echo "nvm missing"
nvm current 2>&1 || echo "No nvm version active"
ls ~/.fdk 2>&1 || echo "No ~/.fdk directory"
```

**Report format:**
```
DETECTION:
- FDK: [version/not installed]
- Node: [version/not installed]
- nvm: [installed/missing]
- nvm current: [version/none]
- ~/.fdk: [exists/missing]
```

---

## Operation 1: Install

**Trigger:** FDK not installed or user requests installation.

**AUTHORITATIVE SOURCE:** Follow **CDN Tarball Reality** (above). Do **not** use `@freshworks/fdk` from the public npm registry, `brew install fdk`, or `choco install fdk` as primary install paths—they do **not** replace **nvm/nvm-windows + CDN tarball + pinned Node**.

**Steps:**

1. Detect OS: `uname -s` (macOS: Darwin, Linux: Linux); on Windows PowerShell `$env:OS`.

2. Check prerequisites (`nvm`/Node). On Windows use **nvm-windows** (see `references/windows.md`). **Do not** use **native** `nvm` on CMD without nvm-windows. If **`where.exe node`** shows **`Program Files\nodejs`** first or **winget/choco/Store** Node competes with nvm, read **`references/windows.md`** (*Installer-based setups*) before **`npm install -g`**.

3. Spawn subagent with this prompt:

```
Install FDK 10.x (default) using nvm + CDN tarball per repository docs (see CDN Tarball Reality + docs/engine-matrix.md).

DETECTION:
- OS: [detected]
- nvm / nvm-windows: [installed/missing]
- Node: [version/missing]

AUTHORITATIVE INSTALL (FDK 10.x line):
- Node: nvm install 24.11.0 && nvm use 24.11.0 && nvm alias default 24.11.0 (Unix nvm) OR equivalent nvm-windows commands.
- Remove old globals: npm uninstall -g @freshworks/fdk; npm uninstall -g fdk; rm -rf ~/.fdk (Unix) or remove %USERPROFILE%\.fdk on Windows.
- npm cache clean --force
- npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz

FDK 9.x (deprecated): only if user confirms after warning — Node 18.x + npm install -g https://cdn.freshdev.io/fdk/latest.tgz — never publish with 9.x.

PACKAGE MANAGER NOTE: Homebrew/Chocolatey are NOT authoritative for pinning; if user insists, verify same semver as CDN and still require correct Node via nvm when possible.

VERIFICATION OS split:
- macOS/Linux new shell: zsh -c 'fdk version' || bash -c 'fdk version'
- Windows: new PowerShell window — where.exe fdk; fdk version (see references/windows.md for PATH refresh if needed).

REPORT: FDK version, Node version, method = cdn_tarball+nvm.
```

4. **MANDATORY VERIFICATION (CRITICAL):** Use **Mandatory verification gates** section below (**Unix/Linux vs Windows** branches). Do **not** claim completion if the OS-appropriate gates fail.

5. **Report format:**
   ```
   [VALID] FDK installed successfully
   
   Verification: ✓ Gates passed (current + new shell) per OS
   
   Installation: cdn_tarball+nvm
   FDK version: [version]
   Node version: [version]

Next steps:
   1. Restart terminal (Unix: source shell rc if needed)
   2. Run: fdk version
   3. Create app: fdk create
   ```

6. **Post-install: MCP server configuration (optional, skippable)**

   After a successful install, offer to configure the MCP connection for publish tools:

   ```
   Would you like to configure the Marketplace MCP server for publishing?
   This connects your IDE to the Freshworks openai-server so you can
   use publish tools (list apps, submit, update, check status).
   You can skip this and set it up later.  (y/N)
   ```

   **If user says yes:**
   - Ask for their **API key**: API key from [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/) - API key for Freddy AI Copilot for VS Code plugin & Agentic Developer Toolkit. or Connect to Developer MCP server (For MCP configuration)
   - The MCP server URL is fixed: `https://mcp.freshworks.dev/mcp`
   - Detect IDE and write config:

     **Claude Code:** Guide them to run `/config` and set the plugin's `mcp_auth_token` field (stored in system keychain via `userConfig`). The server URL is defined in **`.mcp.json`** at this repository’s root.

     **Cursor:** Write or update `~/.cursor/mcp.json`:
     ```json
     {
       "mcpServers": {
         "fw-dev-mcp": {
           "url": "https://mcp.freshworks.dev/mcp",
           "headers": {
             "Authorization": "Bearer <JWT>"
           }
         }
       }
     }
     ```
   - Confirm: "MCP server configured. Publish tools are now available."

   **If user says no or skips:**
   - "Skipped. Configure MCP later via your IDE settings (see AGENTS.md)."

   **Rules:**
   - NEVER ask the user to paste the JWT into chat — write to config file or direct to IDE settings UI
   - Only offer this step after **successful install or upgrade**, not during status/troubleshoot/downgrade/uninstall

**Error handling:** If installation fails, read `references/macos.md` or `references/windows.md` for OS-specific troubleshooting.

**CRITICAL RULES:**
- [INVALID] NEVER say "installation complete" until **Mandatory verification gates** below pass for the user's OS (Unix vs Windows).
- On **macOS/Linux**, new-shell check uses `zsh -c 'fdk version'` or `bash -c 'fdk version'`.
- On **Windows**, new-shell check opens a **new PowerShell window** (or subprocess) and runs `where.exe fdk` + `fdk version`; follow `references/windows.md` if PATH is stale.
- [VALID] Node **24.11.x** active for FDK 10.x line unless user explicitly installs deprecated FDK 9 + Node 18 after confirmation.
- [INVALID] NEVER skip verification steps

---

## Operation 2: Upgrade

**Trigger:** User wants a newer FDK (latest 10.x line or a **pinned** version).

**Canonical command:** `commands/fw-setup-upgrade.md` (`/fw-setup-upgrade`, optional **`--to X.Y.Z`**).

- **Latest FDK 10.x line:** CDN `https://cdn.freshdev.io/fdk/latest-v24.tgz` on Node **24.11.x** (uninstall scoped + legacy `fdk`, remove `~/.fdk`, then install).
- **Pinned 10.x.y / 9.x.y:** CDN `https://cdn.freshdev.io/fdk/vX.Y.Z.tgz` (verify **HTTP 200** with `curl` before `npm install -g`).

Do **not** use `npm install -g @freshworks/fdk@latest` from the public npm registry for FDK 10.x (see **CDN Tarball Reality** above).

**CRITICAL RULES:**
- [VALID] ALWAYS verify upgrade in a new shell after install
- [VALID] For `--to`, confirm tarball URL returns 200 before installing
- [INVALID] NEVER claim success without `fdk version` matching the requested line

---

## Operation 3: Downgrade

**Trigger:** User needs a specific FDK semver, FDK 9.x line (deprecated), or `latest` 9.x.

**Canonical command:** `commands/fw-setup-downgrade.md` (`/fw-setup-downgrade`). **Do not** improvise `nvm use fdk` or `npm install -g @freshworks/fdk@[TARGET]` from the public registry.

**Authoritative flow:**
- Uninstall globals (`@freshworks/fdk`, `fdk`), remove cache directory (`~/.fdk` / Windows user profile `.fdk`).
- Select Node line: **24.11.x** + `latest-v24.tgz` / `vX.Y.Z.tgz` for FDK **10.x**; **18.x** + `latest.tgz` or `vX.Y.Z.tgz` for FDK **9.x** (deprecated).
- `npm install -g <CDN tarball URL>` only (see **CDN Tarball Reality**).
- Verify in **new shell** per **Mandatory verification gates** (Unix vs Windows).

**Spawn** the shell Task defined in `commands/fw-setup-downgrade.md` (bash on Unix; multi-step PowerShell on Windows)—do not use the legacy template that referenced npm registry pins.

**CRITICAL RULES:**
- [INVALID] NEVER skip complete uninstall + `~/.fdk` removal before installing target
- [VALID] ALWAYS verify ALL OS-appropriate gates + `fdk version` matches target

---

## Operation 4: Uninstall

**Trigger:** User wants to remove FDK completely.

**Canonical command:** `commands/fw-setup-uninstall.md` (`/fw-setup-uninstall`). Use that Task script (bash on Unix; PowerShell block on Windows)—do not rely solely on abbreviated prompts.

**Removal must include:** `npm uninstall -g @freshworks/fdk` **and** `npm uninstall -g fdk` (legacy unscoped global), **`~/.fdk`** cache, **forced** npm cache clean, shell rc edits only when safe (prefer backup). On **Windows**, use PowerShell equivalents and `%USERPROFILE%\.fdk` as in **`commands/fw-setup-uninstall.md`**.

**Verification:** **`fdk` absent** from current shell and **OS-appropriate new shell** (`zsh -c`/new PowerShell)—see gates below.

**CRITICAL RULES:**
- [INVALID] NEVER say "uninstall complete" until OS-appropriate gates pass (`fdk` absent in new shell)
- [INVALID] NEVER skip `~/.fdk` / Windows profile cache removal
- [VALID] ALWAYS backup rc files before `sed`/edits (`--fix` parity)

---

## Operation 5: Status

**Trigger:** User checks FDK installation.

**Steps:**

1. Run checks directly (no subagent needed):

```bash
echo "=== FDK Status ==="
fdk version 2>&1 || echo "Not installed"
node --version 2>&1 || echo "Not installed"
nvm --version 2>&1 || echo "Not installed"
   which fdk
[ -d ~/.fdk ] && echo "Cache exists" || echo "No cache"
echo "=================="
```

2. Report findings to user.

---

## Progressive Disclosure

Load these references only when needed:

- **Complex scenarios:** Read `references/cross-scenarios.md`
- **macOS issues:** Read `references/macos.md`
- **Windows issues:** Read `references/windows.md` (PowerShell `where`/`where.exe`, `&&` on PS 5.1, MSI/winget/Chocolatey/`fdk` vs CDN tarball + PATH)
- **npm permission / EACCES:** Read `references/npm-permissions-sop.md`

Do not load these files unless the operation fails or user has a complex setup.

---

## Error Recovery

| Error | Action |
|-------|--------|
| `fdk: command not found` | Run Operation 1 (Install) |
| `npm permission denied` | Load `references/npm-permissions-sop.md`; use nvm-managed prefix, never `sudo npm` on shared systems without approval |
| `Node version mismatch` | Align Node to **docs/engine-matrix.md** (`nvm use 24.11.0` for FDK 10.x line, etc.) |
| **Windows: `node -v` wrong after `nvm use`**, or **`Get-Command node`** → **`Program Files\nodejs`** | **PATH** precedence (MSI/winget/choco/scoop vs nvm-windows) — **`references/windows.md`** *Installer-based setups* |
| Version conflicts | Run Operation 4 (Uninstall) then Operation 1 (Install) |
| OS-specific failure | Read `references/[os].md` |

---

## Verification gates — mandatory (Unix vs Windows)

**[ALERT] ZERO TOLERANCE:** An operation is **never** complete unless **ALL** applicable gates pass **for that OS**.

**Unix / Linux / macOS (bash/zsh)**

| Gate | Checks |
|------|--------|
| **1 – Command presence** | `command -v fdk` succeeds (install/upgrade/downgrade) **or** absent (uninstall) |
| **2 – New shell** | `bash -lc` or `zsh -lc`: `command -v fdk && fdk version` matches expected semver OR `command -v fdk` absent for uninstall |
| **3 – Version match** | `fdk version` matches expected major.line for FDK **10 vs 9** |
| **4 – Cache** | `~/.fdk` per matrix (removed when uninstall/downgrade dictates) |
| **5 – Globals** | `npm list -g …` reflects single install path (after uninstall both `@freshworks/fdk` **and** `fdk`) |
| **6 – nvm default** | Default Node alias targets **Numeric** semver (e.g. `24.11.0`), not a fake `fdk` label |

**Windows (PowerShell; see `references/windows.md`)**

| Gate | Checks |
|------|--------|
| **1–3** | `where.exe fdk`; `fdk version` in **new** PowerShell window or `powershell.exe -NoProfile -Command 'fdk version'`; refresh PATH after `npm install -g` if needed |
| **4** | `%USERPROFILE%\\.fdk` removed when downgrade/uninstall require it |
| **5–6** | `nvm-windows` default Node version aligns with **FDK major** (`nvm current`, `nvm list`) |
| **7 – PATH sanity** | If **standalone Node** exists (MSI/winget/choco/Scoop): **`where.exe node`** / **`Get-Command node`** should resolve **nvm-managed** **`node`** for FDK **`latest-v24`** work — else fix per **`references/windows.md`** *Installer-based setups* |

**`/fw-setup-troubleshoot --fix`** is **preferentially** Unix-shell/rc-oriented; on Windows use **manual SOP + `references/windows.md`** unless a PowerShell repair Task is invoked.

---

## Critical validations

### Installation

| Check | Requirement |
|-------|-------------|
| FDK | **10.x** for primary Platform 3.0 authoring (9.x deprecated per engine matrix) |
| Node | **24.11.x** for FDK **10.1+** line (exact pin subject to **`docs/engine-matrix.md`**); **18.x** only for deprecated FDK 9.x |
| nvm | nvm **or** nvm-windows configured |
| New shell | **Unix:** `bash -lc` / `zsh -lc`; **Windows:** fresh PowerShell + `where.exe fdk` |

### Downgrade

| Check | Requirement |
|-------|-------------|
| Uninstall prior | Globals + caches removed (`~/.fdk` / Win profile) |
| Target | CDN tarball only — **never** `@freshworks/fdk@[semver]` from registry |
| nvm alias | **`nvm alias default` → Node semver** for the chosen line—not `alias default fdk` |

### Uninstall

| Check | Requirement |
|-------|-------------|
| Globals **and** legacy unscoped **`fdk`** removed | ✓ |
| Cache | `~/.fdk` (and Windows equivalent) removed |
| New shell | `fdk` not on PATH |

## Error Catalog

| Error | Severity | Action |
|-------|----------|--------|
| `fdk: command not found` | CRITICAL | Run Operation 1 (Install) |
| `npm permission denied` | CRITICAL | Use nvm, NEVER `sudo npm` |
| `Node version mismatch` | HIGH | Align Node per **`docs/engine-matrix.md`** (`nvm use 24.11.x` for FDK 10 line, `18.x` for deprecated 9.x) |
| Version conflicts | HIGH | Run Operation 4 (Uninstall) then Operation 1 (Install) |
| `~/.fdk` persists after uninstall | MEDIUM | Manual removal: `rm -rf ~/.fdk` |
| Old version in new shell | HIGH | Re-run downgrade with global switch |
| Multiple FDK versions | MEDIUM | Uninstall all, reinstall target version |
| OS-specific failure | VARIES | Read `references/[os].md` |

---

## Anti-Patterns

**Do not:**
- Install Node without nvm
- Use `sudo npm install -g`
- Skip complete uninstall before downgrade
- Leave ~/.fdk directory after uninstall
- Create documentation files (README, CHANGELOG)
- Write installation steps manually - use subagents
- Say "complete" without new shell verification
- Skip any verification gate

**Always:**
- Use official FDK CLI commands
- Verify after every operation
- Preserve existing Node versions
- Clean up completely on uninstall
- Set global default on downgrade
- Test in new shell
- Run ALL verification gates
- Report verification results

---

## Summary

- **SKILL.md** — core enforcement, operations, verification gates, error catalog
- **references/cross-scenarios.md** — complex multi-Node scenarios, PATH conflicts, dual version setups
- **references/macos.md** — macOS-specific installation, Homebrew, zsh configuration
- **references/windows.md** — Windows-specific installation, Chocolatey, PowerShell configuration
- **commands/** — slash definitions: `/fw-setup-*` (Confluence-style); legacy `/fdk-*` names remain valid aliases in routing above

When uncertain, load the specific `references/` file before implementing.

---

## Constraints (Enforced Automatically)

- **Strict mode:** Reject **Platform 2.x / 2.3** requests only. **FDK 9.x** is allowed with deprecation UX until **`docs/engine-matrix.md`** end-of-support date—not rejected outright.
- **No inference without source:** If not in references, respond "Insufficient FDK installation certainty"
- **Verification mandatory:** Every operation MUST pass all verification gates
- **Production-ready only:** Generate complete, persistent installations
- **Global persistence:** Downgrade MUST work across all terminals
- **Complete cleanup:** Uninstall MUST remove all artifacts

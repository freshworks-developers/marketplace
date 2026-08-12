---
name: fw-setup
version: "1.3.0"
description: "Installs and manages Freshworks Development Kit (FDK) with Node.js via nvm for Platform 3.0 development. Supports FDK 10.x (Node 24, recommended) and FDK 9.x (Node 18, deprecated May 31, 2026). Slash commands: /fw-setup-install (--version), /fw-setup-upgrade (--to), /fw-setup-downgrade, /fw-setup-uninstall, /fw-setup-status (--verbose), /fw-setup-troubleshoot (--fix), /fw-setup-use (workspace nvm + .nvmrc). Legacy `/fdk-install` → use `/fw-setup-install`, etc. Publishing requires FDK 10.x + Node 24."
compatibility: "Node.js 24.x (FDK 10.x) or Node.js 18.x (FDK 9.x), nvm, Platform 3.0"
argument-hint: "[install|upgrade|downgrade|uninstall|status] [version]"
allowed-tools: "shell, task, read, write, strreplace, glob, grep"
---

## Entry contract

- **Invoked by:** controller when toolchain missing or user requests FDK/Node setup
- **Preconditions:** User consent for mutating install/upgrade/downgrade operations
- **Returns:** `done` (fdk + node verified globally) | `blocked` (user declined install) | `escalate` (verification failed after retries)
- **On complete:** hand control back to the controller — controller resumes prior intent chain (e.g. fw-app-dev)
- **Session:** `session-read.sh` at start; on success — `session-write.sh <app-dir> progress.phase=setup` when app dir present

# FDK Setup

**MOST IMPORTANT - ZERO TOLERANCE: FDK installation is NEVER complete until verification shows FDK accessible globally AND persists across new shells. NEVER say "installation complete" with ANY verification failures.**

**MANDATORY ENFORCEMENT:** Verify every mutating operation (install, upgrade, downgrade, uninstall, and **`/fw-setup-troubleshoot --fix`**) with actual shell tests. **`/fw-setup-status`**, **`/fw-setup-troubleshoot`** (no **`--fix`**), and **`/fw-setup-use`** are non-Task flows (**`/fw-setup-use`** may only add **`.nvmrc`** when the user asked for **`--write-nvmrc`**). Keep iterating until verification passes. No exceptions.

You are a Freshworks FDK installation and version management enforcement layer.

**Progressive disclosure:** Canonical **FDK / Node / Platform pins** live in **`docs/engine-matrix.md`** (single source of truth—load when version truth is disputed). For **per-project Node / FDK stack switching**, use **`commands/fw-setup-use.md`** first, then `references/macos.md` / `references/cross-scenarios.md` for **`.nvmrc`** patterns. For complex multi-Node scenarios, PATH conflicts, or OS-specific installation issues, load `references/cross-scenarios.md`. For macOS-specific issues, load `references/macos.md`. For Windows-specific issues, load `references/windows.md` (**PowerShell 5.1 `&&`**, **`where` vs `where.exe`**, PATH refresh after **`nvm use`**). For `fdk: command not found` errors, load `references/error-command-not-found.md`. **For interactive manual troubleshooting when automated `--fix` fails**, load `references/interactive-troubleshooting-guide.md` and follow the step-by-step SOP protocol (ONE command at a time, wait for human output, adapt based on results). For **non-blocking local `fdk run`**, execute `scripts/fw-setup-run-background.sh` from the app root (shell script, not a slash command); use `scripts/fw-setup-stop-shell-tasks.sh` to signal matching `fdk run` / `fdk tunnel` processes.

## Routing

Parse user request and execute the appropriate operation:

| Trigger | Operation |
|---------|-----------|
| "install fdk", "setup fdk", `/fw-setup-install`, `/fdk-install` (legacy); optional version **`X.Y.Z`** or **`--version X.Y.Z`** | Install FDK 10.x (default) or 9.x with deprecation notice (see `commands/fw-setup-install.md`). Append `--both` to install both FDK 10 + FDK 9 stacks; idempotent (skips if both already installed). |
| "upgrade fdk", "update fdk", `/fw-setup-upgrade`, `/fdk-upgrade` (legacy); optional **`--to X.Y.Z`** | Upgrade to latest FDK 10.x line or pinned semver (see `commands/fw-setup-upgrade.md`) |
| "migrate fdk 9 to 10", "fdk 9 to 10" | Use `/fw-setup-install` (installs FDK 10.x on Node 24) or `/fw-setup-upgrade` |
| "downgrade fdk", "use fdk 9", `/fw-setup-downgrade 9.6.0`, `/fdk-downgrade` (legacy) | Downgrade FDK 10.x → 10.0.y or 10.x → 9.x (see `commands/fw-setup-downgrade.md`). Bare "downgrade fdk" with no version → defaults to latest FDK 9.x on Node 18; no need to ask the developer for a target version. |
| "uninstall fdk", "remove fdk", `/fw-setup-uninstall`, `/fdk-uninstall` (legacy) | Uninstall FDK only (keeps Node/nvm; no `--all`) |
| "check fdk", "fdk status", `/fw-setup-status`, `/fdk-status` (legacy); optional **`--verbose`** | Status (inline; verbose adds PATH/nvm/rc diagnostics) |
| "fdk broken", "fdk not found", `/fw-setup-troubleshoot`; **`--fix`** only if user asks | Diagnose inline; **`--fix`** spawns shell Task (see `commands/fw-setup-troubleshoot.md`) |
| "use fdk for this repo", "switch node for fdk", **`cd`** app then wrong **`fdk`**, `/fw-setup-use` | **Workspace stack:** **`nvm use`** from **`.nvmrc`** or explicit **10**/**9** (Node **24.11** vs **18**); optional **`--write-nvmrc`** (inline only — see `commands/fw-setup-use.md`) |

**FDK 9.x deprecation (install/downgrade to 9.x):** Show verbatim from [`references/templates/fdk9-deprecation-warning.txt`](references/templates/fdk9-deprecation-warning.txt).

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

3. **Dual-stack coexistence (nvm)** - FDK 10.x/Node 24 and FDK 9.x/Node 18 can coexist on one machine via `nvm use` / `.nvmrc` and `/fw-setup-use`. **nvm** (or nvm-windows) is required for dual-stack — install nvm first if missing (per `/fw-setup-install`). Do **not** uninstall the other stack when switching.

4. **Complete uninstall (same Node only)** - When **replacing** an FDK version on the **same Node version** (e.g. 10.0.0 → 10.1.0 on Node 24.11.x), uninstall globals (`@freshworks/fdk`, legacy `fdk`), remove `~/.fdk`, run `npm cache clean --force`, then install target tarball.

5. **Global Version Persistence** - **Unix:** set `nvm alias default <Node semver>` (e.g. `24.11.0` or `18.x`) and update shell rc. **Windows (nvm-windows):** persist via **`references/windows.md`** / `commands/fw-setup-use.md`; `nvm use` changes a **system symlink** — use **`scripts/fw-setup-use.ps1`** for session-only stacks when **`/fw-setup-use`** is non-global.

6. **FDK Cache Directory Removal** - ALWAYS remove `~/.fdk` **(Unix)** or `%USERPROFILE%\.fdk` **(Windows)** on downgrade/uninstall as applicable.

7. **New Shell Verification** - **Unix/Linux/macOS:** `zsh -c 'fdk version'` or `bash -c 'fdk version'`. **Windows:** open **new PowerShell** (or subprocess) — `where.exe fdk` and `fdk version`; see **`references/windows.md`** for PATH refresh. Current shell verification is insufficient.

8. **npm Cache Cleanup** - ALWAYS run `npm cache clean --force` after uninstall to prevent reinstall issues.

9. **Shell Config Backup** - ALWAYS backup shell config before modifications: `cp ~/.zshrc ~/.zshrc.bak`

10. **Slash-command shell Task closeout** - For `/fw-setup-install`, `/fw-setup-upgrade`, `/fw-setup-downgrade`, `/fw-setup-uninstall`, **`/fw-setup-troubleshoot --fix`** (and legacy `/fdk-*` where applicable), the `subagent_type: "shell"` Task ends after the operation: emit REPORT, then **return**. Do not attach `fdk run`, `fdk tunnel`, `tail -f`, file watchers, or dev servers to that Task. For local preview after install, point the user at `scripts/fw-setup-run-background.sh` instead of running `fdk run` inside the same Task.

11. **MANDATORY: .meta.json metrics write after every mutating command — DO NOT SKIP, DO NOT emit REPORT before this is done.** Applies to: `/fw-setup-install`, `/fw-setup-upgrade`, `/fw-setup-downgrade`, `/fw-setup-troubleshoot --fix`. Skip only if no `manifest.json` exists in the app directory (bare install with no app present). Read-only commands (`/fw-setup-status`, `/fw-setup-use`, `/fw-setup-troubleshoot` without `--fix`) do not write metrics. Never mention `.meta.json` to the developer.

**Scripts only — DO NOT hand-write JSON.** Never use Write, Edit, StrReplace, or shell redirects to create or modify `<app-directory>/.meta.json`. Use only `meta-init.sh`, `meta-update.sh`, `meta-feedback.sh`, and `meta-delete.sh` from `~/.fw-dev-tools/scripts/`. Set `skill_version` to the **bare semver** from the `version:` key in **this** file's YAML frontmatter (e.g. `version: "1.1.5"` → `skill_version=1.1.5`; no quotes).

`meta-init.sh` auto-detects the IDE client from environment variables — no need to pass it manually.

```bash
bash ~/.fw-dev-tools/scripts/meta-init.sh <app-directory>
bash ~/.fw-dev-tools/scripts/meta-update.sh <app-directory> fw-setup \
  invoked=1 skill_version=<version> setup_node_changed=<true|false> setup_fdk_changed=<true|false>
```

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

- ❌ `npm install -g @freshworks/fdk` (any version/tag from public npm registry) → 404 (not on registry); use CDN tarball URLs only
- ❌ `npm install -g https://cdn.freshdev.io/fdk/latest.tgz` on Node 24 → installs FDK 9.x, fails at runtime
- ❌ `fdk version` on Node 24.14.x with FDK 10.1.0 → engine mismatch error
- ❌ Only uninstalling `@freshworks/fdk` → leaves legacy `fdk` package behind

### Install execution

Run **`/fw-setup-install`** and follow [`commands/fw-setup-install.md`](commands/fw-setup-install.md) only (CDN tarball + pinned Node per **`docs/engine-matrix.md`**).

## Quick Detection (Pre-Subagent)

Run these checks directly before spawning subagents to provide context:

**Inline:** `bash scripts/fw-setup-quick-detect.sh` (same checks as **`/fw-setup-status`** default block).

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

1. Run **`/fw-setup-install`** → follow [`commands/fw-setup-install.md`](commands/fw-setup-install.md) only (shell Task, brew/choco auto-detect, verification gates in that command).
2. Enforce **CDN Tarball Reality** (above) — not registry `@freshworks/fdk` as primary.
3. On failure: `references/macos.md` or `references/windows.md`.

**Post-install MCP (optional):** After successful install/upgrade only — offer Marketplace MCP setup; **Cursor** config shape: [`references/templates/cursor-mcp-config.json`](references/templates/cursor-mcp-config.json); **Claude Code:** `.mcp.json` + `mcp_auth_token` per **AGENTS.md**. Never paste JWT in chat.

---

## Operation 2: Upgrade

**Trigger:** User wants a newer FDK (latest 10.x line or a **pinned** version).

**Canonical command:** `commands/fw-setup-upgrade.md` (`/fw-setup-upgrade`, optional **`--to X.Y.Z`**).

- **Latest FDK 10.x line:** CDN `https://cdn.freshdev.io/fdk/latest-v24.tgz` on Node **24.11.x** (uninstall scoped + legacy `fdk`, remove `~/.fdk`, then install).
- **Pinned 10.x.y / 9.x.y:** CDN `https://cdn.freshdev.io/fdk/vX.Y.Z.tgz` (verify **HTTP 200** with `curl` before `npm install -g`).

Do **not** use `npm install -g @freshworks/fdk` from the public npm registry (any version or tag) — use CDN tarball URLs only (see **CDN Tarball Reality** above).

**CRITICAL RULES:**
- [VALID] ALWAYS verify upgrade in a new shell after install
- [VALID] For `--to`, confirm tarball URL returns 200 before installing
- [INVALID] NEVER claim success without `fdk version` matching the requested line

---

## Operation 3: Downgrade

**Trigger:** User needs a specific FDK semver, FDK 9.x line (deprecated), or `latest` 9.x.

**Canonical command:** `commands/fw-setup-downgrade.md` (`/fw-setup-downgrade`). **Do not** improvise `nvm use fdk` or `npm install -g @freshworks/fdk` from the public npm registry (any version or tag).

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

**Inline only.** Run bash blocks in [`commands/fw-setup-status.md`](commands/fw-setup-status.md) (default; `--verbose` adds PATH/nvm/rc diagnostics).

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
| Target | CDN tarball only — **never** any `@freshworks/fdk` install from public npm registry |
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

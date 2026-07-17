# Changelog

All notable changes to `@freshworks/fw-dev-tools` are documented here.

---

## [Unreleased]

### Bug Fixes
- **Codex installer:** write MCP config to `~/.codex/mcp.json` instead of `process.cwd()/.mcp.json` so install location no longer depends on shell working directory ([#42](https://github.com/freshworks-developers/fw-dev-tools/issues/42))
- **Installer:** `copySkills()` copies only installable skill dirs (`fw-*`), not `skills/shared/` ([#29](https://github.com/freshworks-developers/fw-dev-tools/issues/29))

### Documentation
- **SECURITY.md:** disclose that `.meta.json` skill metrics are included in marketplace publish zips by design ([#43](https://github.com/freshworks-developers/fw-dev-tools/issues/43))

---

## [1.2.0] — 2026-06-22

### Unified Installer CLI
- Single `npx @freshworks/fw-dev-tools install` replaces all previous install methods (`npx skills add`, manual copy)
- Supports Claude Code, Cursor, and Codex with `install`, `update`, `status`, and `uninstall` subcommands
- Install state tracked in `~/.fw-dev-tools/.meta.json`

### App Metrics & Developer Feedback
- All 5 skills write structured metrics to `<app-root>/.meta.json` via `meta-init.sh` / `meta-update.sh` scripts
- `meta-feedback.sh` captures a post-publish liked/disliked rating that travels with the app zip
- Platform ingests metrics from the uploaded zip automatically — never exposed to the developer

### Post-Build Review/Publish Chain
- After a successful `fdk validate`, fw-app-dev prompts to review and publish — chaining fw-review → fw-publish in one flow

### Update Check
- `check-update.sh` runs on first skill invocation per session and nudges once per day if a newer version is available

### Bug Fixes
- **macOS Tahoe (Darwin 25+):** fixed EPERM when writing `.meta.json` — switched to atomic write (`.tmp` → rename) in `writeInstallState()` to avoid macOS TCC/provenance restrictions on files created by npx
- **Cursor uninstall** only ran for the last-installed client — now correctly removes all installed clients
- **Codex** `ERR_FS_CP_EINVAL` on install when plugin path matched skills source

### Test Suite
- 195 static skill tests (no LLM)
- 118 installer tests (unit, integration, lifecycle subprocess)
- E2E suite: `--workflow build`, `build-review`, `publish-guard`

---

## [1.0.0] — Initial Release

### 5 Skills for Freshworks Platform 3.0 development

| Skill | Purpose |
|-------|---------|
| **fw-setup** | Install, upgrade, and manage FDK and Node.js toolchain |
| **fw-app-dev** | Build, validate, and iterate on Platform 3.0 apps |
| **fw-ai-actions-app** | Build AI Actions apps with serverless and frontend support |
| **fw-review** | Pre-submission app review against marketplace guidelines |
| **fw-publish** | Pack and publish apps to the Freshworks marketplace |

Install via: `npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill <skill-name>`

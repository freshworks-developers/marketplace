# Filing an issue (fw-dev-tools)

**Why:** faster triage and fixes.  
**Where:** [Open an issue](https://github.com/freshworks-developers/fw-dev-tools/issues).

For install and IDE problems, see **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** first. Use this page when you open a GitHub issue so maintainers get enough signal without secrets.

---

## Never paste

JWT / API keys · OAuth secrets · domain install tokens · `iparams` values → say **“configured”** or **`[REDACTED]`**.

---

## Avoid vague reports

**Not enough:**

- “My skill doesn’t work”
- “Commands not showing”

**Include:**

- IDE **and version** (Cursor **Help → About**, Claude Code / Codex version if applicable)
- **OS** and shell (macOS / Linux / Windows + bash / zsh / PowerShell)
- **Exact** error text (IDE devtools, terminal, MCP) — redact secrets
- **Minimal repro** steps (what you clicked / ran, from empty state if possible)
- What you **already tried** from [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**If skills fail to load**, attach output of (adjust skill folder name):

```bash
ls -la ~/.cursor/skills/fw-app-dev/
cat ~/.cursor/skills/fw-app-dev/.cursor-plugin/plugin.json
head -20 ~/.cursor/skills/fw-app-dev/SKILL.md
```

---

## One block — paste this filled in

```
Goal: (new app | update | validate only | skills install | publish)
OS + shell:
IDE + version: (Cursor | Claude | Codex + version)
Skill(s) involved: (e.g. fw-publish, fw-app-dev, fw-setup)
node -v / fdk --version: (same terminal you used)
fdk validate: (0+0 errors OR paste first errors)
If publish: step that died + HTTP status from upload (e.g. curl last line); note if upload was curl vs agent/Python
Proxy/VPN/sandbox or cloud agent: Y/N
```

---

## Checkboxes — tick what you’re attaching

- [ ] Full **`fdk validate`** output (not last line only)
- [ ] **`fdk pack`** output + **exact zip path**
- [ ] **`unzip -l`** on that zip → **`manifest.json`** at archive root (not only `./manifest.json`) — first lines are enough
- [ ] Snippet of **`manifest.json`**: `platform-version`, `engines`, `modules` only (no secrets)
- [ ] Publish: **new vs update** · **`appId`** if update · which MCP or CLI step failed · **HTTP codes** from upload (403 on S3 PUT often means **local `curl`** needed — see [fw-publish/SKILL.md](skills/fw-publish/SKILL.md) step 8)
- [ ] MCP / IDE **error text** (redacted) — if **list apps** works but publish fails, include **network-ish** lines (timeout, 5xx, TLS, **403 on PUT**)
- [ ] **`ls ~/.cursor/skills/`** or **`ls ~/.claude/skills/`** + install error if skills broke
- [ ] **Chat transcript** for that session — **trim** to the broken flow · **scrub** secrets
- [ ] Portal: **appId** (updates) · version **state** · any visible error text (no creds)
- [ ] **fw-review:** rule IDs (e.g. `SC-*`) if that’s the blocker
- [ ] (Cursor) **plugin.json** has **`rulesDirectory`** / commands registered; no duplicate nested `.cursor/` trees under the skill (see TROUBLESHOOTING)

---

## Optional — full issue template

Copy below into the GitHub issue body and fill in.

````markdown
**Environment:**
- IDE: (Cursor / Claude Code / OpenAI Codex) + version
- OS: (macOS / Linux / Windows — version)
- Skill: (e.g. fw-app-dev, fw-publish, fw-setup)

**Problem:**
[Specific issue — one paragraph]

**Expected:**
[What should happen]

**Actual:**
[What actually happens — include HTTP codes for publish/upload if relevant]

**Diagnostics:**
```bash
# Paste output from debugging commands (redact secrets)
```

**Already tried:**
- [ ] Steps from TROUBLESHOOTING.md relevant to this problem
- [ ] Verified plugin.json has rulesDirectory (Cursor)
- [ ] Checked rule names match filenames
- [ ] Removed duplicate .cursor/ subdirectories under the skill
- [ ] Restarted IDE
````

---

## Links

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — install, rules, commands, IDE-specific fixes  
- [AGENTS.md](AGENTS.md) — skill routing and MCP for agents  
- [fw-publish skill](skills/fw-publish/SKILL.md) — publish and upload (`curl`) flow

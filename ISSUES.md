# Filing an issue (fw-dev-tools)

**Why:** faster triage and fixes.  
**Where:** [Open an issue](https://github.com/freshworks-developers/fw-dev-tools/issues).

For install and IDE problems, see **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** first.

---

## Mandatory — no exceptions

Your issue **must** include the filled-in **issue body template** below: copy the markdown from **`### Goal`** through the **proxy** section into the GitHub issue description and **fill every section** with real values or **`N/A`**. **Issues without this template may be closed or left unanswered** until you add it.

---

## Never paste

JWT / API keys · OAuth secrets · domain install tokens · `iparams` values → say **“configured”** or **`[REDACTED]`**.

---

## Avoid vague reports

**Not enough:**

- “My skill doesn’t work”
- “Commands not showing”

**Include (in addition to the mandatory template):**

- **Minimal repro** steps (what you clicked / ran, from empty state if possible)
- What you **already tried** from [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**If skills fail to load**, attach output of (adjust skill folder name):

```bash
ls -la ~/.cursor/skills/fw-app-dev/
cat ~/.cursor/skills/fw-app-dev/.cursor-plugin/plugin.json
head -20 ~/.cursor/skills/fw-app-dev/SKILL.md
```

---

## Issue body template (copy into GitHub)

Copy from **`### Goal`** down through **`### Proxy, VPN, sandbox, or cloud agent`** into your issue body. Fill blank lines with answers or **`N/A`**. You can delete the `<!-- ... -->` hint comments once filled. **Do not** wrap the pasted template in an extra outer code fence on GitHub.

````markdown
### Goal

<!-- one of: new app | update | validate only | skills install | publish -->



### OS + shell



### IDE + version

<!-- Cursor | Claude | Codex — use Help → About (or product equivalent) -->



### Skill(s) involved

<!-- e.g. fw-publish, fw-app-dev, fw-setup — or N/A -->



### Toolchain

<!-- Same terminal: paste full output of `node -v` and `fdk version` -->



### `fdk validate`

<!-- 0 platform errors + 0 lint errors — OR paste first errors verbatim -->



### Publish / MCP

<!-- If not applicable: N/A. Otherwise: step that failed; HTTP codes from upload terminal; curl vs bundled upload script vs other -->



### Proxy, VPN, sandbox, or cloud agent

<!-- Y or N -->

````

---

## Checkboxes — tick what you’re attaching

- [ ] Full **`fdk validate`** output (not last line only)
- [ ] **`fdk pack`** output + **exact zip path**
- [ ] **`unzip -l`** on that zip → **`manifest.json`** at archive root (not only `./manifest.json`) — first lines are enough
- [ ] Snippet of **`manifest.json`**: `platform-version`, `engines`, `modules` only (no secrets)
- [ ] Publish: **new vs update** · **`appId`** if update · which MCP or CLI step failed · **HTTP codes** from upload (403 on S3 PUT often means **local `curl`** / bundled script — see [fw-publish/SKILL.md](skills/fw-publish/SKILL.md) step 8)
- [ ] MCP / IDE **error text** (redacted) — if **list apps** works but publish fails, include **network-ish** lines (timeout, 5xx, TLS, **403 on PUT**)
- [ ] **`ls ~/.cursor/skills/`** or **`ls ~/.claude/skills/`** + install error if skills broke
- [ ] **Chat transcript** for that session — **trim** to the broken flow · **scrub** secrets
- [ ] Portal: **appId** (updates) · version **state** · any visible error text (no creds)
- [ ] **fw-review:** rule IDs (e.g. `SC-*`) if that’s the blocker
- [ ] (Cursor) **plugin.json** has **`rulesDirectory`** / commands registered; no duplicate nested `.cursor/` trees under the skill (see TROUBLESHOOTING)

---

## Optional — more detail below the template

After the mandatory template, you may add short **Problem / Expected / Actual** paragraphs and **bash** output in fenced blocks (still redact secrets).

---

## Links

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — install, rules, commands, IDE-specific fixes  
- [AGENTS.md](AGENTS.md) — skill routing and MCP for agents  
- [fw-publish skill](skills/fw-publish/SKILL.md) — publish and upload flow

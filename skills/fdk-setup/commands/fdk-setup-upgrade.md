---
name: fdk-setup-upgrade
description: Upgrade FDK — latest FDK 10 line (Node 24.11) or pinned version via --to X.Y.Z
always: true
argument-hint: "[--to X.Y.Z|latest]"
---

# FDK setup — upgrade (`/fdk-setup-upgrade`)

Matches **`/fdk-setup upgrade`** with optional **`--to X.Y.Z`**.

## Behaviour

| User intent | Action |
|-------------|--------|
| `/fdk-setup-upgrade` or “upgrade fdk” (no version) | Install **latest FDK 10 line** from `https://cdn.freshdev.io/fdk/latest-v24.tgz` on **Node 24.11.x**. |
| `/fdk-setup-upgrade --to 10.1.0` or “upgrade fdk to 10.1.0” | Install **exact semver** from `https://cdn.freshdev.io/fdk/v10.1.0.tgz` (same pattern for other 10.x.y). |
| `--to 9.x.y` | **Deprecated:** FDK 9 on **Node 18** only; show March 2026 + publishing warning before proceeding. |

**Before building the Task prompt:** read the user’s target from **`--to`** or phrases like “to 10.1.0”. Substitute **`FDK_TARGET`** in the shell block below:

- empty / `latest` → `FDK_TARGET=latest` (use `latest-v24.tgz`, Node 24.11)
- `10.x.y` → `FDK_TARGET=10.x.y` (use `v10.x.y.tgz`, Node 24.11)
- `9.x.y` → `FDK_TARGET=9.x.y` (use `v9.x.y.tgz`, Node 18; deprecation flow)

Normalize: strip a leading **`v`** from semver (`v10.1.0` → `10.1.0`).

**CDN rule (verified pattern):** `https://cdn.freshdev.io/fdk/v<SEMVER>.tgz` for pinned versions; **`latest-v24.tgz`** for “latest 10.x line” on Node 24.

## Agent pre-step

Replace **`__FDK_TARGET__`** in the Task prompt with one of:

- **`latest`** — user asked only “upgrade” / no `--to` (use `latest-v24.tgz` + Node 24.11).
- **`10.1.0`** — user passed `--to 10.1.0` or “to 10.1.0” (strip leading `v` if present; use `https://cdn.freshdev.io/fdk/v10.1.0.tgz` + Node 24.11).
- **`9.6.0`** — only if user explicitly asked for a **9.x** target (deprecated path + Node 18).

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Upgrade FDK (optional --to semver)",
  prompt: `
Upgrade FDK. User target is __FDK_TARGET__ (replace this token before running).

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

CURRENT_FDK=$(fdk version 2>&1 || echo "not installed")
CURRENT_NODE=$(node --version 2>&1 || echo "not installed")
echo "Before: FDK=$CURRENT_FDK Node=$CURRENT_NODE"

TARGET="__FDK_TARGET__"

if [[ "$TARGET" == latest ]]; then
  FDK_URL="https://cdn.freshdev.io/fdk/latest-v24.tgz"
  nvm install 24.11 2>/dev/null || true
  nvm use 24.11
  nvm alias default 24.11
elif [[ "$TARGET" =~ ^9\\. ]]; then
  echo "DEPRECATED: FDK 9.x ends March 2026; publishing requires FDK 10 + Node 24."
  read -p "Continue install of FDK $TARGET on Node 18? (y/N): " ok
  [[ "$ok" == [yY]* ]] || exit 1
  FDK_URL="https://cdn.freshdev.io/fdk/v${TARGET}.tgz"
  nvm install 18 2>/dev/null || true
  nvm use 18
  nvm alias default 18
else
  FDK_URL="https://cdn.freshdev.io/fdk/v${TARGET}.tgz"
  nvm install 24.11 2>/dev/null || true
  nvm use 24.11
  nvm alias default 24.11
fi

HTTP=$(curl -sS -o /dev/null -w "%{http_code}" -L -I "$FDK_URL" || echo "000")
[[ "$HTTP" == "200" ]] || { echo "FAILED: tarball not reachable (HTTP $HTTP): $FDK_URL"; exit 1; }

npm uninstall -g @freshworks/fdk 2>/dev/null || true
npm uninstall -g fdk 2>/dev/null || true
rm -rf ~/.fdk
npm cache clean --force

npm install -g "$FDK_URL" || exit 1

fdk version
node --version
zsh -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; fdk version' || bash -c 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; fdk version'

if [[ "$TARGET" == latest ]] || [[ "$TARGET" =~ ^10\\. ]]; then
  fdk version | grep -E '^10\\.' || echo "FAILED: expected FDK 10.x"
elif [[ "$TARGET" =~ ^9\\. ]]; then
  fdk version | grep -E '^9\\.' || echo "FAILED: expected FDK 9.x"
fi

echo "REPORT: upgraded using $FDK_URL"

SLASH_COMMAND_CLOSEOUT: Return after verification. No fdk run/tunnel in this Task.
  `
})
```

**Legacy alias:** users may still type **`/fdk-upgrade`**; route them to this command’s behaviour.

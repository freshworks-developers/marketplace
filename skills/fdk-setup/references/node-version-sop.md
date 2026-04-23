# Node Version Management SOP (Manual Steps)

**Problem**: Wrong Node version active, or need to switch between Node versions.

**Use Cases**:
- FDK 10 requires Node 24.11+
- FDK 9 requires Node 18.x (deprecated)
- Multiple projects need different Node versions

---

## Quick Diagnosis

**Check active Node version**:
```bash
node --version
```

**For FDK 10**: Should see `v24.11.x` or later v24.x  
**For FDK 9** (deprecated): Should see `v18.x.x`

**If wrong version or `command not found`**: Follow this guide

---

## Prerequisites

**nvm must be installed**. Check:
```bash
nvm --version
```

**If not found**: See `references/nvm-install-sop.md` first

---

## Step 1: List Available Node Versions

**Check which Node versions are installed**:
```bash
nvm list
```

**Example output**:
```
       v18.20.0
->     v24.11.1
       v24.14.0
```

The `->` shows currently active version.

**Interpret**:
- Node 24.11.1 is available → Use it (Step 2)
- Node 24.11 is NOT listed → Install it (Step 3)

---

## Step 2: Switch to Existing Node Version

### Temporary switch (current shell only):

```bash
nvm use 24.11
```

**Expected output**:
```
Now using node v24.11.1
```

**Verify**:
```bash
node --version
```

**This ONLY affects current terminal**. New terminals will use default version.

### Permanent switch (set as default):

```bash
nvm alias default 24.11
```

**This sets Node 24.11 as default for ALL new terminals.**

**Verify in NEW terminal**:
```bash
node --version
```

---

## Step 3: Install Node Version

**If Node 24.11 is not in `nvm list`**, install it:

```bash
nvm install 24.11
```

**What this does**:
- Downloads Node.js v24.11.x (latest patch version in 24.11 line)
- Installs to `~/.nvm/versions/node/v24.11.x/`
- Automatically switches to it after install

**Expected output**:
```
Downloading and installing node v24.11.1...
...
Now using node v24.11.1
```

**Verify**:
```bash
node --version
npm --version
```

---

## Step 4: Set Default Node Version

**After installing, set as default so new terminals use it**:

```bash
nvm alias default 24.11
```

**Optionally, create a named alias**:
```bash
nvm alias fdk 24.11
```

**Now you can use**:
```bash
nvm use fdk
```

**Check aliases**:
```bash
nvm alias
```

**Example output**:
```
default -> 24.11 (-> v24.11.1)
fdk -> 24.11 (-> v24.11.1)
```

---

## Step 5: Verify Persistence

**Open a BRAND NEW terminal window**.

**Run**:
```bash
node --version
```

**Expected**: `v24.11.x`

**If wrong version or `command not found`**:  
→ See `references/shell-persistence-sop.md`

---

## Working with Multiple Node Versions

### Use Case: Different Projects Need Different Versions

**Project A** (FDK 10 app): Needs Node 24.11  
**Project B** (legacy FDK 9 app): Needs Node 18

### Solution 1: `.nvmrc` Files (Recommended)

**Create `.nvmrc` in project root**:

**For FDK 10 project**:
```bash
cd ~/projects/my-fdk10-app
echo "24.11" > .nvmrc
```

**For FDK 9 project**:
```bash
cd ~/projects/my-fdk9-app
echo "18.20" > .nvmrc
```

**Then in each project directory**:
```bash
nvm use
```

**nvm automatically reads `.nvmrc` and switches to that version!**

### Solution 2: Manual Switching

**When working on Project A**:
```bash
nvm use 24.11  # or: nvm use fdk
```

**When working on Project B**:
```bash
nvm use 18
```

### Solution 3: Automatic Switching (Advanced)

**Add to `~/.zshrc` or `~/.bashrc`**:
```bash
# Auto-load .nvmrc when changing directory
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  elif [[ $(nvm version) != $(nvm version default)  ]]; then
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

**Now nvm automatically switches when you `cd` into a directory with `.nvmrc`!**

---

## Common Issues

### Issue: "Version not found" when switching

**Example**:
```bash
nvm use 24.11
# N/A: version "24.11" is not yet installed
```

**Solution**: Install first
```bash
nvm install 24.11
nvm use 24.11
```

### Issue: Switching doesn't persist to new terminal

**Symptom**: `nvm use 24.11` works, but new terminals show different version

**Solution**: Set default alias
```bash
nvm alias default 24.11
```

### Issue: "default" alias points to wrong version

**Check**:
```bash
nvm alias
```

**If shows**: `default -> 24 (-> v24.14.0)` but you want v24.11

**Problem**: Bare "24" alias tracks latest 24.x (can drift to 24.14, 24.15, etc.)

**Solution**: Pin to specific minor version
```bash
nvm alias default 24.11
```

### Issue: nvm installed multiple patch versions

**Example**:
```bash
nvm list
# v24.11.0
# v24.11.1
```

**Use the latest patch version**:
```bash
nvm use 24.11.1
nvm alias default 24.11.1
```

**Or**: Let nvm choose latest patch automatically
```bash
nvm use 24.11  # Uses highest 24.11.x
```

### Issue: npm global packages missing after Node switch

**Problem**: Each Node version has its own global npm packages

**Example**:
- Installed FDK on Node 24.11
- Switched to Node 24.14
- FDK command missing

**Solution 1**: Install FDK on the new Node version
```bash
nvm use 24.14
npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz
```

**Solution 2**: Switch back to Node version that has FDK
```bash
nvm use 24.11
```

**Best Practice**: Use specific Node version (24.11) for FDK, not bare "24"

---

## Uninstalling Old Node Versions

**List installed versions**:
```bash
nvm list
```

**Uninstall a version**:
```bash
nvm uninstall 24.14.0
```

**Warning**: Cannot uninstall currently active version. Switch first:
```bash
nvm use 24.11
nvm uninstall 24.14.0
```

**Cannot uninstall default alias target**. Change default first:
```bash
nvm alias default 24.11
nvm uninstall 18
```

---

## FDK-Specific Recommendations

### For FDK 10 Users (Node 24.11+)

**Install Node 24.11 specifically**:
```bash
nvm install 24.11
nvm alias default 24.11
nvm alias fdk 24.11
```

**Why 24.11 not bare "24"?**
- Bare "24" tracks latest 24.x (24.14, 24.15, etc. as released)
- FDK CDN tarball `latest-v24.tgz` targets 24.11 specifically
- Using different 24.x versions can cause PATH issues (see `references/error-command-not-found.md`)

### For FDK 9 Users (Node 18 - Deprecated)

**FDK 9 is deprecated (ends May 30, 2026)**. Migrate to FDK 10 when possible.

**If you must use FDK 9**:
```bash
nvm install 18.20
nvm alias fdk9 18.20  # Named alias for legacy projects
```

**Then**:
- FDK 10 projects: `nvm use fdk` (points to 24.11)
- FDK 9 projects: `nvm use fdk9` (points to 18.20)

---

## Verification Checklist

- [ ] `node --version` shows expected version
- [ ] `nvm current` matches expected version
- [ ] `nvm alias default` points to correct version
- [ ] Node version persists in NEW terminal
- [ ] FDK works on this Node version: `fdk version`

---

## Advanced: Lock Node Version in CI/CD

### GitHub Actions

**`.github/workflows/ci.yml`**:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '24.11'  # Pin exact version
```

### Docker

**`Dockerfile`**:
```dockerfile
FROM node:24.11-alpine
RUN npm install -g https://cdn.freshdev.io/fdk/latest-v24.tgz
```

### package.json engines field

**`package.json`**:
```json
{
  "engines": {
    "node": ">=24.11.0 <25.0.0"
  }
}
```

**This warns if wrong Node version is used.**

---

## Success Criteria

**Node version management is working when**:
- ✅ Can switch between Node versions with `nvm use`
- ✅ Default version persists to new terminals
- ✅ FDK works on active Node version
- ✅ (Optional) `.nvmrc` auto-switching works per project

**Return to interactive troubleshooting or continue FDK setup.**

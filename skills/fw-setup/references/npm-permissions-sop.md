# npm permission errors (EACCES / EPERM) — fw-setup

Use this when **`npm ERR! code EACCES`**, **`EACCES`**, **`permission denied`** on global **`npm install -g`** (FDK CDN tarball installs), or **`fdk`** not landing in PATH after install.

## 1. Confirm prefix (where globals go)

```bash
npm config get prefix
which npm
node --version
```

- **Prefer nvm-managed Node** (`~/.nvm/...`): globals install under **`$NVM_DIR`**, avoids `/usr/local` clashes.
- If prefix is **`/usr/local`** without nvm → **risk of EACCES** on macOS/Linux.

## 2. Fix paths (recommended)

### Unix / Linux / macOS

1. **Use nvm** — never use `sudo npm install -g`.
2. `nvm use 24.11.x` / `18.x` **before** CDN install (`latest-v24.tgz` / `latest.tgz`).
3. If `~/bin`/`~/.npm-global` was used incorrectly, uninstall broken globals (`npm uninstall -g …`), then reinstall under **`nvm current`** prefix.

See **`references/nvm-install-sop.md`** and **`references/shell-persistence-sop.md`**.

### Windows (PowerShell, elevated only when needed)

1. Prefer **nvm-windows** (`nvm root` exposes install path)—install FDK **`npm install -g`** with that active Node only.
2. If permissions fail inside Program Files folders, reinstall Node **`nvm-windows`** profiles so globals are user-writable.
3. **Refresh PATH** (`references/windows.md` — **Refresh-WindowsPath** patterns / **new PowerShell**).
4. **Competing Node** (MSI/winget/choco/Scoop vs nvm): **`references/windows.md`** *Installer-based setups* — fix **`where.exe node`** order before retrying globals.

## 3. Cleanup after failed installs

```bash
npm cache clean --force
npm uninstall -g @freshworks/fdk fdk 2>/dev/null
rm -rf ~/.fdk    # Unix; Windows remove %USERPROFILE%\.fdk
```

Retry from **`commands/fw-setup-install.md`**.

## 4. Corporate / locked devices

Ask before applying **`chmod`/`chown`** on system directories. Prefer **`nvm` / nvm-windows** only (`/fw-setup-troubleshoot --fix` may edit rc files—coordinate with admins on **managed PCs**).

## 5. Reference

Cross-link: **`references/error-command-not-found.md`** (PATH), **`docs/network-requirements.md`** (repository root — corporate proxy/TLS affecting npm/CDN).

# Engine matrix (single source of truth)

Authoritative **Platform 3.0** toolchain pins for this skill bundle. **Agents should prefer this file** over ad-hoc semver statements in chat.

| Stack | FDK | Node (nvm / nvm-windows) | Notes |
|-------|-----|--------------------------|--------|
| **Publish to Marketplace** | **10.x** | **24.11.x** (see FDK release notes for exact minimum **24.11** patch) | Required for submission / review. |
| **Active dev (recommended)** | **10.x** | **24.11.x** | Default for new apps. CDN: `https://cdn.freshdev.io/fdk/latest-v24.tgz` (or `vX.Y.Z.tgz` pinned). |
| **Legacy / migration** | **9.x** *(deprecated May 31, 2026)* | **18.x** | Development only — **not** for publishing. CDN: `latest.tgz` / `vX.Y.Z.tgz`. Show deprecation warning. |
| **Forbidden** | Platform **2.x** | *(any)* | Reject — migrate to Platform **3.0** per **fw-app-dev** `/fdk-migrate`. **Platform 2.3** support ends **May 31, 2026** (same calendar as **Node 18** below). |

## Deprecation timeline (authoritative)

| Item | End of support |
|------|----------------|
| **Node 18** (FDK **9.x** line) | **May 31, 2026** |
| **platform-version 2.3** | **May 31, 2026** — migrate to **`"3.0"`** before this date. |

## CDN (no public npm global for FDK)

Global install uses **tarball URLs** — **`@freshworks/fdk` is not installable from registry.npmjs.org** for this workflow. See **`skills/fw-setup/SKILL.md`** *CDN Tarball Reality*.

## Homebrew / Chocolatey (optional)

Those paths are **convenience / system-wide** installers (brew on macOS, Chocolatey on Windows). They **do not replace** the **engine-matrix** contract: you still need the **matching Node major** active on PATH for the FDK you run. Prefer **`nvm` + CDN tarball** in docs and **`/fw-setup-install`** for reproducible pinning. If you already use brew/choco for `fdk`, see **`skills/fw-setup/references/macos.md`** (Homebrew tap) and **`skills/fw-setup/commands/fw-setup-install.md`** (detection branches).

## Air-gapped / offline

This bundle assumes **HTTPS** access to **`cdn.freshdev.io`** and (for `npm`) registry or mirror. **Offline** installs require pre-downloaded tarballs and manual `npm install -g <local.tgz>` outside the default agent flow—document as exceptional.

## Updates

When **FDK minor** releases change Node engine requirements, DevRel should update this matrix and **`skills/fw-setup/SKILL.md`** in the same change.

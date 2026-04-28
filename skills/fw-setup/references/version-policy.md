# FDK Version Policy

## Installation Commands (Use Latest)

All fw-setup commands default to **latest** versions unless user specifies exact semver:

### FDK 10.x (Primary, Node 24)
- **Command:** `/fw-setup-install` (no args)
- **CDN URL:** `https://cdn.freshdev.io/fdk/latest-v24.tgz`
- **Result:** Latest FDK 10.x (e.g., 10.1.0, 10.2.0, etc.)
- **Node:** 24.11.x

### FDK 9.x (Deprecated, Node 18)
- **Command:** `/fw-setup-downgrade` (no args)
- **CDN URL:** `https://cdn.freshdev.io/fdk/latest.tgz`
- **Result:** Latest FDK 9.x (e.g., 9.8.2, 9.9.0, etc.)
- **Node:** 18.20.x
- **⚠️ DEPRECATED:** **Node 18** + **FDK 9.x** and **platform-version 2.3** share end of support **May 31, 2026** (see **`docs/engine-matrix.md`**). FDK 9.x will not be supported on that toolchain after this date.

### Both Stacks
- **Command:** `/fw-setup-install --both`
- **Installs:**
  - Latest FDK 10.x on Node 24.11
  - Latest FDK 9.x on Node 18.20
- **Primary:** Node 24 + FDK 10

### Specific Versions (Pinned)
- **FDK 10.x:** `/fw-setup-install 10.1.0` or `/fw-setup-upgrade --to 10.1.0`
- **FDK 9.x:** `/fw-setup-downgrade 9.8.2`
- **CDN URL:** `https://cdn.freshdev.io/fdk/v{VERSION}.tgz`

## Manifest Engines (Use Pinned for Validation)

**fw-app-dev** skill uses **pinned versions** in `manifest.json` → `engines` for validation compatibility:

### Default (New Apps)
```json
{
  "engines": {
    "fdk": "10.0.1",
    "node": "24.11.0"
  }
}
```

### Last Resort (After 6 validation iterations fail)
```json
{
  "engines": {
    "fdk": "9.8.2",
    "node": "18.20.8"
  }
}
```

## Why Different?

| Context | Version Type | Reason |
|---------|--------------|--------|
| **Install commands** | Latest | Users get newest features/fixes automatically |
| **Manifest engines** | Pinned | Validation consistency; marketplace compatibility |

## Summary

- **Installing FDK?** → Use latest (no version arg)
- **Writing manifest.json?** → Use pinned (10.0.1 or 9.8.2)
- **Specific version needed?** → Pass exact semver as arg

This policy ensures:
1. Users get latest FDK by default
2. Apps validate consistently
3. Flexibility for pinned versions when needed

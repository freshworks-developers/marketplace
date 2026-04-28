# Network requirements (corporate firewalls & TLS)

Typical Freshworks custom-app development with this bundle needs **outbound HTTPS** to the following (ports **443** unless noted).

| Host | Purpose |
|------|---------|
| **`cdn.freshdev.io`** | FDK CDN tarballs (`npm install -g https://…tgz`). |
| **`registry.npmjs.org`** (or corporate **npm** mirror) | Node package restore for `npm` / FDK dependencies. |
| **`mcp.freshworks.dev`** | Marketplace **MCP** (publish, list apps) via **`.mcp.json`**. |
| **`developers.freshworks.com`** | Developer portal profile, API keys, documentation. |

## TLS inspection

If a corporate **HTTPS proxy** re-signs traffic, ensure **Node** and **`fdk`** trust the enterprise **root CA** (system keychain or **`NODE_EXTRA_CA_CERTS`**—follow your security team’s Node policy).

## Symptoms

- **`npm ERR! network`** / timeout — allowlist npm + CDN; check proxy `HTTP(S)_PROXY`.
- **`fdk` hangs on first run** — may be dependency download; verify registry access.
- **MCP `401`/`403`** — key rotation or missing `Authorization` header in IDE config—not a firewall allowlist issue.

See also **`skills/fw-setup/references/npm-permissions-sop.md`** for EACCES unrelated to network.

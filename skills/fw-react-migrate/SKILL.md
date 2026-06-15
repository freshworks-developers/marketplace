---
name: fw-react-migrate
version: "1.0.0"
description: Migrates existing Platform 3.0 frontends to React Meta (metaConfig.framework react, JSX entries, FDK bundler). Handles vanilla app/scripts/*.js, crayons CDN HTML, dual-surface OAuth apps, multi-product sidebars, folder flattening, and light-path pre-meta React. Preserves server, OAuth, requests.json, and events. For PF 2.x run fw-app-dev /fdk-migrate first. For greenfield apps use fw-new-react-app.
compatibility: "Freshworks Platform 3.0 only; Node.js 24.x + FDK 10.x per docs/engine-matrix.md. Does not install FDK/Node."
argument-hint: "[fw-react-migrate|fw-react-migrate-review]"
allowed-tools: "shell read write strreplace glob grep"
---

# Freshworks React Meta — migrate (fw-react-migrate)

**Scope:** **Frontend / React Meta pipeline only.** Preserve `server/`, `config/oauth_config.json`, `config/requests.json`, and event handler names unless explicitly trimming dead SMI (see [references/patterns/server-trim.md](references/patterns/server-trim.md)).

**Does not:** greenfield `fdk create` → **`fw-new-react-app`**. PF 2.x → **`fw-app-dev`** `/fdk-migrate` first. Toolchain → **`fw-setup`**.

## EXECUTION ORDER

| Condition | Path |
|-----------|------|
| `platform-version` ≠ `3.0` | Stop → **`/fdk-migrate`** |
| JSX exists, no `metaConfig` | **Light path** → [before-after/pre-meta-light-path.md](references/before-after/pre-meta-light-path.md) |
| `app/scripts/*.js` or crayons CDN in HTML | **Full path** → checklist below |
| Nested `product-samples/` layout | **Flatten first** → [patterns/folder-flattening.md](references/patterns/folder-flattening.md) |

## App directory

Follow **`../fw-app-dev/commands/fdk-fix.md`** Step 1 before editing.

## Toolchain gate

Node **24.x** + FDK **10.x** per [`docs/engine-matrix.md`](../../docs/engine-matrix.md). Missing → **`fw-setup`**. Align `manifest.json` `engines` upward; never downgrade toolchain.

## Migration checklist (ordered)

1. **Backup** — branch; inventory all `location.url` / `icon` and `app/*.html`.
2. **Toolchain** — add `package.json` (react-starter-template shape) if missing; `npm install`.
3. **`metaConfig`** — `{ "framework": "react" }`; bump `engines`, add `scripts.fdk-unit-test`.
4. **Icons** — every manifest `icon` path exists on disk.
5. **Per surface** — thin HTML + `*Main.jsx` per [patterns/vanilla-to-meta-entry.md](references/patterns/vanilla-to-meta-entry.md) and [multi-surface-conversion.md](references/patterns/multi-surface-conversion.md).
6. **DOM → React** — state/hooks; extract pure logic to `app/utils/` + tests ([utils-extraction-and-tests.md](references/patterns/utils-extraction-and-tests.md)).
7. **Init gate** — `app.initialized()` on every entry; sidebar: `instance.resize` + `app.activated`.
8. **Custom iparams** — React under `config/assets/components/` if applicable.
9. **Cleanup** — delete `app/scripts/*.js` **only after** `fdk validate` 0/0.
10. **Validate** — ≤6 iterations; smoke-test each surface `?dev=true`.

## Before-state classifier

| Signal | Reference |
|--------|-----------|
| Single sidebar + invokeTemplate | [before-after/invoke-template-sidebar.md](references/before-after/invoke-template-sidebar.md) |
| Sidebar + full page + OAuth | [before-after/dual-surface-oauth.md](references/before-after/dual-surface-oauth.md) |
| FD + FS same HTML | [before-after/multi-product-same-url.md](references/before-after/multi-product-same-url.md) |
| Timer logic in server | [before-after/server-trim-client-timer.md](references/before-after/server-trim-client-timer.md) |
| OAuth sidebar + invokeTemplate | [before-after/oauth-sidebar-migrate.md](references/before-after/oauth-sidebar-migrate.md) |
| JSX without metaConfig | [before-after/pre-meta-light-path.md](references/before-after/pre-meta-light-path.md) |

## Canonical entry bootstrap

```jsx
defineCustomElements(); // if Crayons
useLayoutEffect(() => {
  window.app.initialized().then((client) => {
    window.client = client;
    const resize = () => client.instance.resize({ height: '460px' }).catch(() => {});
    resize();
    client.events.on('app.activated', resize);
    setChild(<FeatureApp client={client} />);
  });
}, []);
```

## Pitfalls

- Missing `{{{appclient}}}` on any shell.
- Deleting scripts before validate passes.
- Rewriting OAuth / server when only frontend migrates.
- `{{}}` in request templates.
- Orphan `requests.json` keys.

## Slash commands

- [`/fw-react-migrate`](commands/fw-react-migrate.md)
- [`/fw-react-migrate-review`](commands/fw-react-migrate-review.md)

## Rules

- [rules/fw-react-migrate.mdc](rules/fw-react-migrate.mdc)
- [rules/fw-react-migrate-gates.mdc](rules/fw-react-migrate-gates.mdc)

## Related skills

- **fw-new-react-app** — greenfield + add-surface on React Meta apps
- **fw-app-dev** — manifest/OAuth/server lint
- **fw-setup** — toolchain

Use cases: [references/USE-CASES.md](references/USE-CASES.md) (MG-1 … MG-6).

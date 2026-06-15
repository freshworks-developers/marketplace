# Before/After: pre-meta React light path (MG-5)

**Migration type:** Pre-meta React → official React Meta (minimal rewrite).

## Before

```
app/
  components/*.jsx            # React already (App, Modal, placeholders)
  index.html                  # module entry to components/index.jsx
  ticketSidebar.html, ...     # 15 HTML shells
  reducer/, store/, hooks/     # Redux + custom hooks
package.json                  # react deps present
manifest.json                 # NO metaConfig
```

- JSX components and `createRoot` bootstrap already in place.
- Multi-surface placeholder app (full page, CTI, ticket/contact placements).
- Jest tests may already exist.
- **Missing:** `metaConfig.framework: "react"`.

## After (light path)

```json
// manifest.json — primary change
"metaConfig": { "framework": "react" }
```

Plus alignment fixes:
- `engines.node` / `engines.fdk` → FDK 10.x / Node 24.x
- Ensure every HTML has `{{{appclient}}}` + `type="module"` entries
- Remove obsolete vanilla iparams assets if React iparams replaced them

## Agent actions (light path only)

1. Add `metaConfig.framework: "react"` to manifest.
2. Align `engines` with installed FDK (`fdk version`, `node --version`).
3. Audit HTML shells — `{{{appclient}}}`, `#root`, module script paths.
4. Run `fdk validate` — fix module/bundler issues only.
5. **Do not** rewrite components, Redux store, or placeholder structure.

## When full migration IS needed

Upgrade to full path if:
- Surfaces still use `app/scripts/*.js` or crayons CDN-only (not `@freshworks/crayons/react`).
- HTML entries lack `type="module"`.
- No `package.json` or wrong React version for FDK 10.

## Surface inventory (15 urls example)

| Category | Examples |
|----------|----------|
| common | `index.html`, `ctiGlobalSidebar.html` |
| support_ticket | `ticketSidebar.html`, `topNavigation.html`, `ticketBackground.html`, … |
| support_contact | `contactSidebar.html`, `contactBackground.html` |
| service_ticket | `ticketSidebarService.html` |

Each may already have `app/components/placeholders/<name>.jsx` — no new entries needed for light path.

## Full-page entry pattern (existing)

`app/components/index.jsx` — Redux Provider, I18n, `app.initialized()` gate, **no** sidebar resize.

## Pitfalls

- Full component rewrite on light path — wasteful; app already works.
- Forgetting `metaConfig` on multi-surface apps — FDK won't bundle JSX correctly.
- Mixing jest + vitest — keep existing test runner unless user asks to swap.
- Adding HashRouter to sidebar placeholders — already correctly scoped to full page.

## Validate

```bash
fdk validate
npm test                    # existing test suite
# Spot-check index.html + one sidebar ?dev=true
```

## Contrast with MG-1

| | MG-1 full path | MG-5 light path |
|-|--------------|-----------------|
| Starting UI | vanilla `app.js` | JSX components exist |
| Work scope | full rewrite | manifest + toolchain alignment |
| Tests added | vitest (new) | existing suite kept |
| Server | none | kept if events/SMI exist |

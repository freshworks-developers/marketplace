# fw-react-migrate — use case catalog

Canonical prompts: [fw-react-app-usecases.md](../../../../fw-react-app-usecases.md) (repo root).

| ID | Use case | Command | Reference(s) | Acceptance |
|----|----------|---------|--------------|------------|
| MG-1 | Vanilla sidebar → React Meta | `/fw-react-migrate` | `patterns/vanilla-to-meta-entry.md`, `before-after/invoke-template-sidebar.md` | `invokeTemplate` in utils; scripts deleted post-validate |
| MG-2 | Dual-surface OAuth | `/fw-react-migrate` | `patterns/multi-surface-conversion.md`, `before-after/dual-surface-oauth.md` | OAuth/server untouched; dual `*Main.jsx` |
| MG-3 | Multi-product same URL | `/fw-react-migrate` | `before-after/multi-product-same-url.md`, `patterns/multi-product-sidebar.md` (fw-new-react-app) | FD+FS share `index.html`; `client.db` ok |
| MG-4 | Server trim | `/fw-react-migrate` | `patterns/server-trim.md`, `before-after/server-trim-client-timer.md` | Timer client-side; manifest functions cleaned |
| MG-5 | Pre-meta React light path | `/fw-react-migrate` | `before-after/pre-meta-light-path.md` | `metaConfig` only; no component rewrite |
| MG-6 | Folder flattening | `/fw-react-migrate` | `patterns/folder-flattening.md` | Root layout; nested folder removed |
| — | OAuth sidebar migrate | `/fw-react-migrate` | `before-after/oauth-sidebar-migrate.md` | OAuth + sidebar preserved |

## Verification checklist

| ID | Verify |
|----|--------|
| MG-1 | Vanilla sidebar with `invokeTemplate` → React Meta; utils + tests; scripts removed post-validate |
| MG-5 | JSX app without `metaConfig` → add `metaConfig` only |
| MG-2 | Dual HTML surfaces + OAuth; server handlers preserved |

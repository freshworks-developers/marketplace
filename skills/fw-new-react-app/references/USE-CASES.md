# fw-new-react-app — use case catalog

Canonical prompts: [fw-react-app-usecases.md](../../../../fw-react-app-usecases.md) (repo root).

| ID | Use case | Command | Reference(s) | Acceptance |
|----|----------|---------|--------------|------------|
| NU-1 | Tailwind ticket sidebar | `/fw-new-react-app` | `patterns/tailwind-setup.md` | 1 surface; `fdk validate` 0/0; `fdk run ?dev=true` |
| NU-2 | Hybrid dashboard + SMI | `/fw-new-react-app` | `router-and-multi-surface.md`, `templates/requests-examples.md`, `templates/server-smi-examples.md` | 2 surfaces; HashRouter in full page only; SMI wired |
| NU-3 | Multi-surface placeholders (7+) | `/fw-new-react-app` or `-scaffold` | `patterns/placeholder-multi-surface.md` | 7+ surfaces; `PlaceholderWrapper`; lifecycle events |
| NU-4 | CTI embed greenfield | `/fw-new-react-app` | `patterns/cti-embed.md` | `cti_global_sidebar`; resize + SMI config load |
| NU-5 | Add surface to React Meta app | `/fw-new-react-app-add-surface` | command playbook | Manifest + HTML + JSX; no wipe |

## Verification checklist

| ID | Verify |
|----|--------|
| NU-3 | Manifest with 7+ surfaces; shared `PlaceholderWrapper`; lifecycle events on each placeholder |
| NU-4 | `CtiMain.jsx` pattern: init → SMI config → resize → embed iframe |
| NU-2 variant | OAuth sidebar greenfield from `templates/oauth-react-sidebar.md` |

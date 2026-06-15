# React Meta — quick reference

## Location module map (expanded)

| Surface | Module | Example HTML |
|---------|--------|-----------------------------------|
| `full_page_app` | `modules.common` | `index.html` |
| `cti_global_sidebar` | `modules.common` | `ctiGlobalSidebar.html` |
| `ticket_sidebar` | `modules.support_ticket` | `ticketSidebar.html` |
| `ticket_top_navigation` | `modules.support_ticket` | `ticketTopNav.html` |
| `ticket_background` | `modules.support_ticket` | `ticketBackground.html` |
| `ticket_conversation_editor` | `modules.support_ticket` | `ticketConversationEditor.html` |
| `time_entry_background` | `modules.support_ticket` | `timeEntryBackground.html` |
| `ticket_requester_info` | `modules.support_ticket` | `ticketRequesterInfo.html` |
| `new_ticket_requester_info` | `modules.support_ticket` | `newTicketRequesterInfo.html` |
| `ticket_attachment` | `modules.support_ticket` | `ticketAttachment.html` |
| `contact_sidebar` | `modules.support_contact` | `contactSidebar.html` |
| `company_background` | `modules.support_company` | `companySidebar.html` |
| `ticket_sidebar` (Freshservice) | `modules.service_ticket` | `ticketSidebarService.html` |

Confirm against [product docs](https://developers.freshworks.com/docs/app-sdk/v3.0/) if unsure.

## Icon paths

| Convention | Path | Seen in |
|--------------|------|---------|
| **fw-app-dev default** | `app/styles/images/icon.svg` | react-starter-template, hybrid examples |
| **Common variants** | `app/icon.svg` or manifest-relative `icon.svg` | single-surface and multi-surface apps |

Every manifest `location.icon` must resolve on disk after `fdk validate`.

## Routing

- **Use `HashRouter`** in `full_page_app` only — routes live in URL fragment (`#/…`).
- **Do not use `BrowserRouter`** in FDK placeholders (some legacy apps used it; host owns iframe URL — fragment routing avoids collisions).

## Custom iparams React contract

1. **`window.getConfigs(configs)`** — hydrate form state.
2. **`window.postConfigs()`** — plain object to persist on Save.
3. **`window.validate()`** — boolean; `false` blocks save.

See [templates/custom-iparams-react.md](templates/custom-iparams-react.md).

## Hook patterns (sketches)

- **`useFreshworksData(key)`** — `client.data.get` + loading/error.
- **`useInvokeTemplate(name)`** — `invokeTemplate` + JSON parse ([frontend-invoke-template.md](patterns/frontend-invoke-template.md)).
- **`useServerMethod(name)`** — `client.request.invoke`.
- **`PlaceholderWrapper`** — lifecycle for multi-surface ([placeholder-multi-surface.md](patterns/placeholder-multi-surface.md)).

## Client APIs (after init)

`request.invokeTemplate`, `request.invoke`, `data.get`, `db.*`, `iparams.get`, `interface.trigger`, `instance.*`, `events.on/off`.

## Engines

Minimum per [docs/engine-matrix.md](../../../docs/engine-matrix.md): Node **24.11.x**, FDK **10.x**. Manifest example:

```json
"engines": { "node": "24.11.0", "fdk": "10.0.0" }
```

Migrated apps may pin **10.1.2** — valid if ≥ minimum.

## Docs

- [App SDK v3.0](https://developers.freshworks.com/docs/app-sdk/v3.0/)
- [Placeholders](https://developers.freshworks.com/docs/app-sdk/v3.0/freshdesk/front-end-apps/placeholders/)
- [Request templates](https://developers.freshworks.com/docs/app-sdk/v3.0/freshdesk/front-end-apps/requests/)

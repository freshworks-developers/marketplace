# `config/iparams.json` — examples

Use this when the user asks for installation parameters (many app prompts request "API key", "domain", "subdomain", etc.).

This file lives at `config/iparams.json` and the FDK reads it at install time and (in `fdk run`) presents a form at `http://localhost:10001/custom_configs`.

## Freshdesk domain + API key example

```json
{
  "freshdesk_domain": {
    "display_name": "Freshdesk Domain",
    "description": "Your Freshdesk instance domain, for example mycompany.freshdesk.com",
    "type": "text",
    "required": true
  },
  "freshdesk_api_key": {
    "display_name": "Freshdesk API Key",
    "description": "API key from Profile Settings in Freshdesk. Stored securely on the platform.",
    "type": "text",
    "required": true,
    "secure": true
  }
}
```

Critical fields:

- **`display_name`** — shown to admins on the install screen.
- **`description`** — short hint; helps QA and admins.
- **`type`** — common values: `text`, `paragraph`, `number`, `email`, `phone_number`, `url`, `checkbox`, `dropdown`, `multiselect`, `date`.
- **`required`** — set to `true` for fields the app cannot run without.
- **`secure: true`** — **mandatory** for API keys, tokens, secrets. The platform stores secure iparams encrypted and only exposes them to **server-side** code (request templates and `args.iparams` inside server functions). Frontend code can never read a secure iparam.

## Other common shapes

### Dropdown

```json
{
  "default_priority": {
    "display_name": "Default Priority",
    "type": "dropdown",
    "required": true,
    "options": ["Low", "Medium", "High", "Urgent"],
    "default_value": "Medium"
  }
}
```

### Multi-select

```json
{
  "tracked_statuses": {
    "display_name": "Statuses to track",
    "type": "multiselect",
    "options": ["Open", "Pending", "Resolved", "Closed"],
    "default_value": ["Open", "Pending"]
  }
}
```

### URL with regex validation

```json
{
  "webhook_url": {
    "display_name": "Slack webhook URL",
    "type": "url",
    "required": true,
    "regex": {
      "regex_starts_with_https": "^https://hooks\\.slack\\.com/services/.+$"
    }
  }
}
```

`regex` is an object whose keys become the error labels shown to admins.

### Checkbox

```json
{
  "enable_notifications": {
    "display_name": "Enable notifications",
    "type": "checkbox",
    "default_value": true
  }
}
```

## Where iparams are read

| Code location | API |
|---------------|-----|
| Server (request template substitution) | `<%= iparam.<key> %>` inside `config/requests.json` |
| Server (function body) | `args.iparams.<key>` inside SMI / event handlers |
| Frontend | `client.iparams.get('<key>')` — **never returns** secure iparams; for those, route the call through an SMI |

## Manifest tie-in (lifecycle)

If iparams exist and the app needs to react when they change (cache them, validate them, set defaults), add lifecycle event handlers:

```json
"events": {
  "onAppInstall":   { "handler": "onAppInstallHandler" },
  "onAppUninstall": { "handler": "onAppUninstallHandler" }
}
```

Hybrid API-backed flows use these as minimal stubs (see [server-smi-examples.md](server-smi-examples.md)).

## Validation rules

- **Exactly one** of `config/iparams.json` **or** custom `config/iparams.html` (+ assets) — never both.
- Keys must be `[a-z0-9_]+` (snake_case).
- Empty file (`{}`) is valid for apps that don't need iparams; the file itself must exist when the manifest declares iparams or when the FDK template requires it.
- Mark every secret field with `secure: true`. Validation does **not** flag missing `secure`, but the marketplace review will reject API keys that aren't secure.

## Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Frontend reads `client.iparams.get('api_key')` and gets `undefined` | The iparam is `secure: true` | Read it server-side via `args.iparams.api_key` or `<%= iparam.api_key %>` in a request template; never expose secrets to frontend |
| Install screen rejects valid input | Wrong `regex` syntax (must be JS regex literal as a string, no leading/trailing slashes) | Use `"^https://..."` not `"/^https:\\/\\/.../"` |
| Admin sees "Untitled" field | Missing `display_name` | Add `display_name` to every iparam |
| App refuses to install with empty key | `required: true` blocks empty install | Either provide a `default_value` or accept that admins must fill it |

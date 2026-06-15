# `config/requests.json` — examples

Use this for hybrid or API-backed React Meta apps that call an external HTTP API (Freshdesk REST, Slack, Jira, etc.). Request templates are how the platform proxies authenticated calls server-side without exposing secrets.

## Core rules

- **Host** is an FQDN only — no protocol path inside the host: ✅ `mycompany.freshdesk.com` ❌ `https://mycompany.freshdesk.com/api`.
- **Path** starts with `/`.
- Substitution syntax is **`<%= iparam.<key> %>`** (install param), **`<%= context.<key> %>`** (per-call payload), **`<%= access_token %>`** (OAuth). **Never `{{variable}}`**.
- For **Basic auth with API keys**, use the platform helper **`<%= encode(iparam.<key>) %>`** to base64-encode the secret. For Freshdesk specifically, the API key alone (without the `:X` suffix) is what `encode()` expects — the platform inserts the password placeholder.
- Every key in `config/requests.json` must be declared in `manifest.json` under `modules.common.requests` (empty object value is fine).

## Freshdesk REST API example (3 templates)

```json
{
  "getTickets": {
    "schema": {
      "method": "GET",
      "host": "<%= iparam.freshdesk_domain %>",
      "path": "/api/v2/tickets",
      "headers": {
        "Authorization": "Basic <%= encode(iparam.freshdesk_api_key) %>",
        "Content-Type": "application/json"
      }
    }
  },
  "getTicketById": {
    "schema": {
      "method": "GET",
      "host": "<%= iparam.freshdesk_domain %>",
      "path": "/api/v2/tickets/<%= context.ticketId %>",
      "headers": {
        "Authorization": "Basic <%= encode(iparam.freshdesk_api_key) %>",
        "Content-Type": "application/json"
      }
    }
  },
  "updateTicket": {
    "schema": {
      "method": "PUT",
      "host": "<%= iparam.freshdesk_domain %>",
      "path": "/api/v2/tickets/<%= context.ticketId %>",
      "headers": {
        "Authorization": "Basic <%= encode(iparam.freshdesk_api_key) %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## Mandatory manifest sync block (paste under `modules.common`)

```json
"requests": {
  "getTickets": {},
  "getTicketById": {},
  "updateTicket": {}
}
```

If a key is in `requests.json` but missing from manifest, `fdk validate` returns:
> `Request template <name> is declared but not associated with module`.

If a key is in manifest but missing from `requests.json`, validation fails with a similar mismatch error. Keep both files in lockstep.

## Where templates are invoked

### Frontend (React Meta)

```js
const res = await client.request.invokeTemplate('getTickets', {});
const tickets = JSON.parse(res.response);
```

With a context payload:

```js
const res = await client.request.invokeTemplate('getTicketById', {
  context: { ticketId: 12840 }
});
```

With a body (PUT/POST):

```js
const res = await client.request.invokeTemplate('updateTicket', {
  context: { ticketId: 12840 },
  body: JSON.stringify({ status: 4 })
});
```

### Server (SMI / events)

```js
const res = await $request.invokeTemplate('getTickets', {});
```

This pattern routes calls through SMI functions (see [server-smi-examples.md](server-smi-examples.md)) so the frontend never deals with template names directly — the frontend only knows about `client.request.invoke('fetchTickets', ...)`.

## Common auth patterns

### Bearer token (OAuth)

```json
"headers": {
  "Authorization": "Bearer <%= access_token %>",
  "Content-Type": "application/json"
}
```

OAuth providers also need template-level options:

```json
"updateTicket": {
  "options": { "oauth": "freshdesk" },
  "schema": { ... }
}
```

### API key in custom header

```json
"headers": {
  "X-Api-Key": "<%= iparam.api_key %>",
  "Content-Type": "application/json"
}
```

### Pre-encoded Basic auth (when the user supplies `user:pass` already)

```json
"headers": {
  "Authorization": "Basic <%= encode(iparam.basic_auth) %>"
}
```

## Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Validation: `Invalid host` | Host has `https://` or a path | Strip protocol and path; host is just the FQDN |
| Validation: `Path must start with /` | Path missing leading slash | Add `/` |
| 401 on Freshdesk | Auth header missing or built wrong | Use `"Basic <%= encode(iparam.freshdesk_api_key) %>"` exactly |
| 404 on `/api/v2/tickets/<id>` | Forgot to pass `ticketId` in `context` | `client.request.invokeTemplate('getTicketById', { context: { ticketId } })` |
| Body ignored on PUT | Forgot `JSON.stringify` | Always `body: JSON.stringify(payload)` |
| Manifest validation: orphan template | `requests.json` key not in `modules.common.requests` | Add the matching key in manifest |
| Frontend exception "iparam undefined" | Tried to read a `secure: true` iparam in the browser | Move the call to a server SMI; the template substitutes the secret server-side |

## Quick checklist before saving `requests.json`

- [ ] Every host is a bare FQDN.
- [ ] Every path starts with `/`.
- [ ] Every secret reference uses `<%= iparam.<key> %>` (not `{{...}}`).
- [ ] Basic auth uses `encode()`.
- [ ] Every key has a matching `modules.common.requests.<key>: {}` entry in `manifest.json`.
- [ ] No mock data, no localhost URLs, no committed credentials.

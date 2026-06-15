# Frontend `invokeTemplate`

Use when the **browser** calls Freshworks request templates directly — typically when iparams hold the API credential and the template hits a third-party REST API. Contrast with SMI + server-side `$request.invokeTemplate` when secrets must stay off the client.

## When to use

- Templates use **non-secure** iparams readable via install config, or platform allows frontend template invocation for your auth model.
- Simple CRUD from sidebar/full-page without custom server functions.
- Each template is declared in `config/requests.json` **and** `modules.common.requests`.

## Steps

1. **Define templates** in `config/requests.json` with `<%= context.* %>` for runtime params and `<%= iparam.* %>` for install params.
2. **Declare keys** in `manifest.json` → `modules.common.requests.<templateName>: {}`.
3. **Wrap calls** in a util module — parse response, coerce context types to strings.
4. **Pass `client`** from bootstrap; never import `window.client` inside pure helpers (keeps tests easy).
5. **Handle errors** — check `result.status` for 4xx/5xx before `JSON.parse`.

## requests.json snippet

```json
{
  "fetchCustomers": {
    "schema": {
      "method": "GET",
      "host": "<%= iparam.shopify_subdomain %>.myshopify.com",
      "path": "/admin/api/2023-04/customers.json",
      "query": {
        "limit": "<%= context.limit %>",
        "since_id": "<%= context.since_id %>"
      },
      "headers": {
        "X-Shopify-Access-Token": "<%= iparam.shopify_access_token %>"
      }
    }
  }
}
```

## Util pattern

```js
// app/utils/shopify-api.js
export function parseTemplateResponse(result) {
  if (!result || result.response === undefined) return null;
  return JSON.parse(result.response);
}

export function buildCustomerContext(options) {
  return {
    limit: String(options.limit || 50),
    since_id: options.sinceId ? String(options.sinceId) : ''
  };
}

export async function fetchCustomers(client, options) {
  const result = await client.request.invokeTemplate('fetchCustomers', {
    context: buildCustomerContext(options)
  });
  return parseTemplateResponse(result);
}

export async function searchCustomers(client, query) {
  const result = await client.request.invokeTemplate('searchCustomers', {
    context: { query: query }
  });
  return parseTemplateResponse(result);
}
```

## Component usage

```jsx
useEffect(() => {
  let cancelled = false;
  fetchCustomers(client, { limit: 50 })
    .then(data => { if (!cancelled) setCustomers(extractCustomerList(data)); })
    .catch(err => setError(err.message));
  return () => { cancelled = true; };
}, [client]);
```

## OAuth templates

Pass `options.account` when template schema uses OAuth:

```js
await client.request.invokeTemplate('get_asana_workspace', {
  options: { account: oauthAccountName }
});
```

## Frontend vs server invokeTemplate

| Call from | API | Secrets |
|-----------|-----|---------|
| Frontend | `client.request.invokeTemplate(name, { context, options })` | Non-secure iparams only |
| Server SMI | `$request.invokeTemplate(name, { context, body, options })` | Secure iparams + OAuth |

## Pitfalls

| Symptom | Fix |
|---------|-----|
| "template not declared" | Sync `requests.json` key with `manifest.modules.common.requests` |
| 401 from external API | Verify iparam names match `<%= iparam.field %>` exactly |
| Context empty in template | Pass `context: { key: String(value) }` — ERB expects strings |
| Leaked API key in DevTools | Move token to secure iparam + server SMI instead |
| `JSON.parse` throws | Wrap parser; log raw `result.response` on failure |
| Pagination broken | Coerce `since_id` / `limit` to strings in context builder |

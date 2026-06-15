# `server/server.js` — SMI examples

Use this for hybrid or API-backed React Meta apps that need server-side functions (Server Method Invocation) or lifecycle event handlers (`onAppInstall`, `onAppUninstall`).

## Lint rules that govern this file

These match `fdk validate` / `fw-app-dev` rules and **block** the build when violated:

1. **`async` only with actual `await`.** A function declared `async` with no `await` triggers `Async function has no 'await' expression`. Either add `await` or remove `async`.
2. **No unused parameters.** Drop them entirely. `_args` still triggers the lint error.
3. **Helpers go after the `exports = { ... }` block.** Hoisting works for `function` declarations; this convention keeps the contract first.
4. **Cyclomatic complexity ≤ 7 per function.** For long OR chains use `Set` / `Map`. For nested branches extract helpers.
5. **SMI returns** must use the `renderData` callback, not bare `return`. The runtime won't deliver a plain return value.
6. **`try/catch`** every external call — `$request.invokeTemplate` and `$db.*` reject on error.

## Full hybrid example — `server/server.js`

```js
exports = {
  fetchTickets() {
    return getTickets()
      .then((res) => renderData(null, JSON.parse(res.response)))
      .catch((err) => renderData(toError(err)));
  },

  fetchTicket(args) {
    if (!args || !args.id) {
      return renderData({ status: 400, message: 'Missing ticket id' });
    }
    return getTicketById(args.id)
      .then((res) => renderData(null, JSON.parse(res.response)))
      .catch((err) => renderData(toError(err)));
  },

  updateTicketStatus(args) {
    if (!args || !args.id || typeof args.status !== 'number') {
      return renderData({ status: 400, message: 'Missing or invalid id/status' });
    }
    return updateStatus(args.id, args.status)
      .then((res) => renderData(null, JSON.parse(res.response)))
      .catch((err) => renderData(toError(err)));
  },

  onAppInstallHandler() {
    renderData();
  },

  onAppUninstallHandler() {
    renderData();
  }
};

function getTickets() {
  return $request.invokeTemplate('getTickets', {});
}

function getTicketById(id) {
  return $request.invokeTemplate('getTicketById', {
    context: { ticketId: id }
  });
}

function updateStatus(id, status) {
  return $request.invokeTemplate('updateTicket', {
    context: { ticketId: id },
    body: JSON.stringify({ status })
  });
}

function toError(err) {
  return {
    status: err && err.status ? err.status : 500,
    message: err && err.message ? err.message : 'Request failed'
  };
}
```

Why each piece is shaped this way:

- The `exports = { ... }` block lists the **contract** keys — the same names that appear in `manifest.json` under `modules.common.functions` and (for lifecycle) `events.<name>.handler`.
- Each handler returns a Promise chain (no `async`/`await` because the body is just chaining and `renderData` calls — no `await` would be used). This keeps the lint quiet about `async` without `await`.
- Helpers are simple `function` declarations after `exports`. Each helper does one thing; complexity stays at 1.
- `renderData(error, data)` is the SMI/event return mechanism. `renderData()` (no args) signals success with no body — fine for `onAppInstall` / `onAppUninstall` stubs.
- Input validation lives in the handler, not the helper. Validation messages are short and don't echo back secrets.
- `JSON.parse(res.response)` once at the boundary, so the frontend sees an object, not a string.

## Frontend invocation recap

```js
const res = await client.request.invoke('fetchTickets', {});
const tickets = JSON.parse(res.response);
```

`res.response` is a **JSON string** of the value passed as the second argument to `renderData`. Always `JSON.parse` it on the frontend.

## Variants

### Async/await form (when you actually need `await`)

```js
exports = {
  async fetchTickets() {
    try {
      const res = await $request.invokeTemplate('getTickets', {});
      renderData(null, JSON.parse(res.response));
    } catch (err) {
      renderData({ status: err?.status ?? 500, message: err?.message ?? 'Request failed' });
    }
  }
};
```

This form is also valid. Pick one style per file and stick with it. The Promise-chain form above keeps every function complexity-1.

### Lifecycle that does real work

```js
exports = {
  onAppInstallHandler(args) {
    if (!args || !args.iparams) {
      return renderData({ message: 'Missing install payload' });
    }
    return $db.set('install_meta', { domain: args.iparams.freshdesk_domain, installed_at: Date.now() })
      .then(() => renderData())
      .catch((err) => renderData({ message: err?.message ?? 'install failed' }));
  }
};
```

Notes:

- Receiving `args` is fine **iff** you use it. Otherwise drop the parameter entirely.
- Lifecycle handlers may use `$db`, `$request.invokeTemplate`, `$schedule.create`, etc.
- Don't `console.log(args)` or `console.log(args.iparams)` — secrets leak into platform logs.

### Server function with several branches (keep complexity ≤ 7)

```js
const ALLOWED_STATUSES = new Set([2, 3, 4, 5]);

exports = {
  updateTicketStatus(args) {
    if (!args || typeof args.id === 'undefined') {
      return renderData({ status: 400, message: 'id required' });
    }
    if (!ALLOWED_STATUSES.has(args.status)) {
      return renderData({ status: 400, message: 'invalid status' });
    }
    return $request.invokeTemplate('updateTicket', {
      context: { ticketId: args.id },
      body: JSON.stringify({ status: args.status })
    })
      .then((res) => renderData(null, JSON.parse(res.response)))
      .catch((err) => renderData({ status: err?.status ?? 500, message: err?.message ?? 'failed' }));
  }
};
```

Using `Set.has` instead of a long `||` chain keeps the cyclomatic complexity at ~3.

## Manifest sync (hybrid example)

```json
"functions": {
  "fetchTickets": {},
  "fetchTicket": {},
  "updateTicketStatus": {}
},
"events": {
  "onAppInstall":   { "handler": "onAppInstallHandler" },
  "onAppUninstall": { "handler": "onAppUninstallHandler" }
}
```

Every key in `functions` must be a key on `exports` in `server.js`. Every `events.<name>.handler` must also be a key on `exports`. Mismatches fail validation immediately.

## Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Async function has no 'await' expression` | Declared `async` but the body has no `await` | Drop `async`, or add real `await` |
| `'args' is defined but never used` | Function takes an arg it never reads | Remove the parameter; do **not** use `_args` |
| `Function has complexity 8. Maximum allowed is 7.` | Long if/else or `||` chain | Use `Set`/`Map` for membership; extract helpers |
| Frontend gets `undefined` from `client.request.invoke` | Server function used `return value` instead of `renderData(null, value)` | Always use `renderData` for SMI/events |
| Frontend sees `[object Object]` as the response | Forgot `JSON.parse(res.response)` | Parse once on the frontend |
| `helpers must be declared after exports` | Helper before `exports = { ... }` | Move helpers below the `exports` block |
| Lifecycle never fires | `events.<name>.handler` doesn't match `exports.<name>` | Align names exactly |
| `console.log(args)` leaks secrets in platform logs | Logged the whole `args` or `args.iparams` | Log specific non-secret fields only |

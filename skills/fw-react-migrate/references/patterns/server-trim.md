# Pattern: Server trim after client-side migration

## When to use

- Legacy app put UI/timer/state logic in `server/server.js` that the React client can own.
- MG-4: delete `server/server.js` after moving timer to `client.db`.
- **Migration-specific** — greenfield apps would not delete server code without analysis.

## Decision tree

```
Does any manifest function/event still call server exports?
├── YES → Keep server; only trim unused handlers
└── NO  → Can server/ be removed entirely?
         ├── OAuth / webhook / scheduled sync needed? → KEEP server
         └── Pure client UI (timers, local state, client.db)? → DELETE server
```

## Client-side timer pattern (delete server)

**Before:** timer tick, session count, notifications via SMI.  
**After:** `app/utils/timer.js` + `client.db.set('timer_state')` + `client.interface.trigger('showNotify')`.

### Steps

1. **Port logic** — move pure functions to `app/utils/` (testable without server).
2. **Replace server storage** — `client.db.get/set` for per-agent state.
3. **Replace server notifications** — `client.interface.trigger('showNotify', { type, message })`.
4. **Audit manifest** — remove `modules.*.functions` blocks with no handler.
5. **Delete** `server/server.js` and `server/test_data/` if unused.
6. **Update tests** — replace `tests/server.test.js` with `tests/timer.test.js` (utils only).
7. **Validate** — `fdk validate` must pass with no orphan function references.

## When NOT to trim

| Keep server | Example |
|-------------|---------|
| OAuth token exchange | dual-surface OAuth + Google Sheets sync |
| Ticket event handlers | `onTicketCreate` → `syncTicketData` |
| SMI invoked from client | `request.invoke('getInstallConfig')` |
| Secrets / API keys server-side | third-party tokens not safe in client |

MG-2 dual-surface OAuth: server **kept** — sync and ticket event handlers still run server-side.

## Manifest cleanup example

```json
// REMOVE when no server functions remain:
"functions": {
  "startTimer": { "timeout": 10 }
}
```

Also remove matching `exports` from deleted `server.js` and any `request.invoke` calls in client.

## Pitfalls

- Deleting server while manifest still references handlers → validate failure.
- Moving secrets to client — never expose API keys; trim UI logic only.
- `client.db` for cross-agent data — it is per-agent; use server + `$db` for shared state.
- Forgetting to remove `server/package.json` or test fixtures.
- Assuming all timers are client-only — scheduled/background work needs server or platform events.

## Verification

```bash
fdk validate                           # 0 errors
grep -r "request.invoke" app/          # no calls to deleted SMI
grep -r "functions" manifest.json    # only live handlers
npm run fdk-unit-test                  # utils tests pass
```

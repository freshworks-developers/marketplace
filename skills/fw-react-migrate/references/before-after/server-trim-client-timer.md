# Before/After: server trim + client timer (MG-4)

**Migration type:** Server trim — timer moves entirely client-side.

## Before

```
app/
  scripts/app.js, mod.js      # vanilla DOM timer
  views/freshdesk.html, mod.html
server/server.js              # timer tick, session logic via SMI
```

- Timer state and notifications handled server-side (SMI).
- Multiple HTML views for different contexts.

## After

```
app/
  index.html                  # single sidebar surface
  components/
    TimerMain.jsx             # init + resize
    TimerApp.jsx              # timer UI, client.db persist
  utils/timer.js              # formatTime, normalizeState, hydrateRunning
tests/timer.test.js
manifest.json                 # NO functions block
(server/ deleted)
```

## Agent actions (ordered)

1. Add `metaConfig`, toolchain.
2. Collapse views → one `index.html` + `TimerMain.jsx`.
3. Port timer math → `app/utils/timer.js` (pure, testable).
4. Replace server persistence → `client.db.set('timer_state', state)`.
5. Replace server notify → `client.interface.trigger('showNotify', ...)`.
6. **Delete** `server/server.js`; remove manifest `functions` entries.
7. Delete `app/scripts/`, `app/views/`.

## Server trim rationale

| Was on server | Now on client |
|---------------|---------------|
| Timer interval / phase transitions | `useEffect` + `setInterval` in `TimerApp` |
| Session count per day | `client.db` + `todayKey()` in utils |
| Desktop notifications | `client.interface.trigger('showNotify')` |
| No cross-agent shared state | No server needed |

## Preserved

- `support_ticket` + `service_ticket` both → `index.html` (multi-product).
- Sidebar resize pattern (520×280px).

## Pitfalls

- Keeping dead `functions` in manifest after server delete → validate fails.
- Using server for per-agent timer when `client.db` suffices.
- Leaving obsolete view HTML after single-surface React.
- Not testing `hydrateRunning` edge cases — timer drift on tab refocus.

## Validate

```bash
fdk validate                    # no server/, no orphan functions
npm run fdk-unit-test
# ticket_sidebar ?dev=true — start/pause/complete cycle
```

See also: `patterns/server-trim.md`

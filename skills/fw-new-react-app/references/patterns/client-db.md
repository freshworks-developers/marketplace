# Client-side `client.db` persistence

Use for **per-agent, per-install** key-value storage in the browser — UI preferences, timer state, ticket↔external-ID links. Not shared across agents or accounts.

## When to use

- Persist sidebar state between ticket navigations or app activations.
- Store small JSON blobs (< few KB) — linked record IDs, session count, theme choice.
- Avoid server/db when data is agent-local and non-sensitive.

**Do not use** for secrets, cross-agent data, or large payloads.

## Steps

1. **Pick a stable key** — e.g. `timer_state`, `app_theme`, or ticket-scoped key.
2. **Load on mount** — `client.db.get(key)` in `useEffect`; merge with defaults.
3. **Save on change** — call `client.db.set(key, object)` after state updates (debounce if high churn).
4. **Guard errors** — db may be unavailable in tests or restricted contexts; try/catch.
5. **Key length** — platform limits key size (~30 chars); truncate ticket IDs if needed.

## Theme preference

```jsx
const STORAGE_KEY = 'app_theme';

useEffect(() => {
  window.client.db.get(STORAGE_KEY).then(stored => {
    if (stored?.theme) setTheme(stored.theme);
  }).catch(() => {});
}, []);

function setTheme(next) {
  setThemeState(next);
  window.client.db.set(STORAGE_KEY, { theme: next }).catch(() => {});
}
```

## Timer / session state

```jsx
const STORAGE_KEY = 'timer_state';

const persist = useCallback(async (next) => {
  try { await client.db.set(STORAGE_KEY, next); }
  catch (err) { console.warn('Could not save state', err); }
}, [client]);

const applyState = useCallback((updater) => {
  setState(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    persist(next);
    return next;
  });
}, [persist]);

// Load on mount
useEffect(() => {
  client.db.get(STORAGE_KEY)
    .then(stored => setState(hydrateRunning(normalizeState(stored))))
    .catch(() => setState(defaultState()))
    .finally(() => setReady(true));
}, [client]);
```

## Ticket ↔ external record

```js
export function ticketDbKey(ticketId) {
  return String(ticketId).substr(0, 30); // platform key limit
}

export async function getLinkedIssue(client, ticketId) {
  try { return await client.db.get(ticketDbKey(ticketId)); }
  catch { return null; }
}

export async function saveLinkedIssue(client, ticketId, issueData) {
  const key = ticketDbKey(ticketId);
  await Promise.all([
    client.db.set(String(issueData.issueID), { ...issueData }), // reverse lookup
    client.db.set(key, { ...issueData })
  ]);
}
```

## Data shape tips

- Store `{ lastDate, sessionsToday, phase, remainingMs, endAt }` for timers — recompute `remainingMs` from `endAt` on load if `running`.
- Store `{ issueID, issueUrl, repo, number }` for external links.
- Always spread `{ ...obj }` on set to avoid reference mutation bugs.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| State resets every navigation | Persist in `applyState`, not only on unmount |
| Key too long error | Truncate IDs (`substr(0, 30)`) |
| Stale timer after reload | Persist ISO `endAt`; hydrate elapsed time on read |
| Data visible to other agents | Expected — db is per-agent; use server for shared data |
| Tests fail on db | Mock `client.db.get/set` (see vitest-client-mocks.md) |
| Orphan keys | dual-write enables lookup by external ID; prune on unlink if needed |

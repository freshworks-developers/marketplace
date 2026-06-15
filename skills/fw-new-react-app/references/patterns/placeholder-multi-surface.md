# PlaceholderWrapper + multi-surface placeholders

Use when one React Meta app mounts on **7+ product surfaces** (sidebars, top-nav, backgrounds, CTI) and each surface needs its own bundle entry with shared client init and lifecycle handling.

## When to use

- App declares many `modules.*.location` placeholders in `manifest.json`.
- Each placeholder gets its own HTML shell + JSX entry (not one router for all).
- Sidebars/backgrounds need `app.activated` / `app.deactivated` to refresh or pause work.
- Only `full_page_app` needs client-side routing — wrap **that** entry with `HashRouter`, not placeholders.

## Steps

1. **Add `PlaceholderWrapper.jsx`** — shared init, lifecycle context, `renderPlaceholder` helper.
2. **One HTML per surface** — thin shell with `#root` + `<script type="module" src="./components/placeholders/<name>.jsx">`.
3. **One placeholder JSX per surface** — UI component + bottom call: `renderPlaceholder(MySurface, 'ticket_sidebar')`.
4. **Declare every surface in manifest** under the correct module (`support_ticket`, `service_ticket`, `common`, etc.).
5. **Full-page only:** in `app/components/index.jsx`, init client then wrap `<App />` in `<HashRouter>`.

## PlaceholderWrapper (core pattern)

```jsx
// app/components/placeholders/PlaceholderWrapper.jsx
export function useAppLifecycle() {
  return useContext(AppLifecycleContext); // { isInitialized, isActive }
}

function PlaceholderWrapper({ children, placeholderName }) {
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let mounted = true;
    const clientRef = { current: null };
    const onActivated = () => mounted && setIsActive(true);
    const onDeactivated = () => mounted && setIsActive(false);

    (window.client ? Promise.resolve(window.client) : window.app.initialized().then(c => { window.client = c; return c; }))
      .then(client => {
        if (!mounted) return;
        clientRef.current = client;
        setIsReady(true);
        client.events.on('app.activated', onActivated);
        client.events.on('app.deactivated', onDeactivated);
      });

    return () => {
      mounted = false;
      clientRef.current?.events.off('app.activated', onActivated);
      clientRef.current?.events.off('app.deactivated', onDeactivated);
    };
  }, [placeholderName]);

  if (!isReady) return <div className="loading">Loading…</div>;
  return (
    <AppLifecycleContext.Provider value={{ isInitialized: isReady, isActive }}>
      {children}
    </AppLifecycleContext.Provider>
  );
}

export function renderPlaceholder(Component, placeholderName) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <PlaceholderWrapper placeholderName={placeholderName}>
        <Component />
      </PlaceholderWrapper>
    </StrictMode>
  );
}
```

## Per-surface entry

```jsx
// app/components/placeholders/ticketSidebar.jsx
function TicketSidebar() {
  const { isActive } = useAppLifecycle();
  useEffect(() => {
    window.client.instance.resize({ height: '420px' }).catch(() => {});
    if (isActive) loadTicket(); // refresh on tab focus
  }, [isActive]);
  return <div>…</div>;
}
renderPlaceholder(TicketSidebar, 'ticket_sidebar');
```

## Full-page entry (HashRouter here only)

```jsx
// app/components/index.jsx — full-page entry pattern
return (
  <ThemeProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </ThemeProvider>
);
```

## Manifest surface map (7+ surfaces example)

- `common`: `full_page_app`, `cti_global_sidebar`
- `support_ticket`: `ticket_sidebar`, `ticket_top_navigation`, `ticket_requester_info`, `ticket_attachment`, `ticket_conversation_editor`, `new_ticket_requester_info`, `ticket_background`, `time_entry_background`
- `support_contact`: `contact_sidebar`, `contact_background`
- `service_ticket`: `ticket_sidebar` — often a **separate** HTML/JSX ([multi-product-sidebar.md](./multi-product-sidebar.md))

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Stale data when agent re-opens sidebar | Subscribe to `app.activated`; refetch there |
| Memory leaks / duplicate listeners | `events.off` in effect cleanup; guard with `isMounted` |
| Router breaks host URL | Never add `HashRouter` to placeholder entries |
| `window.client` undefined in child | Wait for `isReady` from wrapper before API calls |
| Freshservice install fails | Declare `service_ticket` module even if UI is minimal |
| Duplicate init on StrictMode | Cache client on `window.client` after first `app.initialized()` |

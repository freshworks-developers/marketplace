# Interface methods — optional pattern

Use when the app demonstrates **`client.interface.trigger`** from React (modals, notify, setValue, CTI dialer) — typically **placeholder/sample** apps, not production integrations.

## When to use

- User asks for interface-method catalog or demo placeholders.
- Pair with [placeholder-multi-surface.md](placeholder-multi-surface.md) for multi-surface samples.

## Common triggers (Freshdesk)

| Method | Typical use |
|--------|-------------|
| `showModal` | Open modal with URL |
| `showDialog` | Confirmation dialog |
| `showNotify` | Toast-style notification |
| `setValue` | Set ticket/contact field |
| `triggerDialer` | CTI dialer (with CTI apps) |

## Sketch (after init)

```jsx
async function openNotify(client) {
  await client.interface.trigger('showNotify', {
    type: 'success',
    title: 'Done',
    message: 'Action completed.',
  });
}
```

## Instance comms (related)

- `client.instance.send` / `receive` / `get` — cross-instance messaging (multi-surface demos).
- `client.instance.resize` — every sidebar; see CTI/placeholder patterns.

## Pitfalls

- Call **only after** `app.initialized()`.
- Interface availability varies by **surface** — check [../react-meta-quick-reference.md](../react-meta-quick-reference.md).
- Do not use `BrowserRouter` in sidebars; use **HashRouter** in full_page only.

## Related patterns

Pair with [placeholder-multi-surface.md](placeholder-multi-surface.md) for multi-surface samples. Convert vanilla interface-method triggers to React handlers.

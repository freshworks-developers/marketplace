# OAuth + React sidebar template

Use when a **ticket sidebar** connects to a third-party OAuth provider (Asana, GitHub, etc.) — install-time OAuth + iparams for defaults, runtime token use via templates/SMI.

## When to use

- `config/oauth_config.json` defines provider(s).
- Sidebar creates/links records in external system per ticket.
- OAuth account selected at install; templates use `options.account`.
- Optional dynamic iparams (workspace/project dropdowns) via custom iparams page.

## Steps

1. **oauth_config.json** — client_id, client_secret, authorize/token URLs, `oauth_iparams`, `token_type: "account"`.
2. **manifest** — `modules.common.requests` for API templates; `modules.common.functions.getOAuthAccounts` SMI.
3. **Server SMI** — `getOAuthAccounts` returns connected account names for `oauthName`.
4. **AsanaMain entry** — init client, resize sidebar, render app.
5. **AsanaApp bootstrap** — parallel fetch OAuth accounts + `client.iparams.get()` for install defaults.
6. **API utils** — `invokeTemplate` with `options: { account }`; task creation via template or SMI.

## oauth_config.json

```json
{
  "integrations": {
    "asana": {
      "display_name": "Asana",
      "client_id": "<id>",
      "client_secret": "<secret>",
      "authorize_url": "https://<%= oauth_iparams.host %>/-/oauth_authorize",
      "token_url": "https://<%= oauth_iparams.host %>/-/oauth_token",
      "token_type": "account",
      "oauth_iparams": {
        "host": { "display_name": "host", "type": "text", "required": true }
      }
    }
  }
}
```

## AsanaMain (sidebar bootstrap)

```jsx
const SIDEBAR_HEIGHT = '720px';

function AsanaMain() {
  const [child, setChild] = useState(<p>Loading Asana…</p>);

  useLayoutEffect(() => {
    window.app.initialized().then((client) => {
      window.client = client;
      const resize = () => client.instance.resize({ height: SIDEBAR_HEIGHT }).catch(() => {});
      resize();
      client.events.on('app.activated', resize);
      setChild(<AsanaApp client={client} />);
    });
  }, []);

  return <div className="asana-root">{child}</div>;
}
```

## AsanaApp bootstrap

```jsx
useEffect(() => {
  async function bootstrap() {
    const [accounts, iparams] = await Promise.all([
      fetchOAuthAccounts(client),  // client.request.invoke('getOAuthAccounts', { oauthName: 'asana' })
      client.iparams.get()
    ]);
    setAccounts(accounts);
    setDefaultAccount(accounts[0] || '');
    setDefaultWorkspace(parseIparamGid(iparams.asana_workspace));
    setDefaultProject(parseIparamGid(iparams.asana_projects)?.[0] || '');
  }
  bootstrap();
}, [client]);
```

## invokeTemplate with OAuth account

```js
export async function fetchOAuthAccounts(client) {
  const result = await client.request.invoke('getOAuthAccounts', { oauthName: 'asana' });
  return result.response || [];
}

export async function createTask(client, account, payload) {
  const result = await client.request.invokeTemplate('create_asana_task', {
    options: { account },
    context: payload
  });
  return parseTemplateResponse(result);
}
```

## Pitfalls

| Symptom | Fix |
|---------|-----|
| "No OAuth accounts" in sidebar | Complete OAuth at install; verify `oauthName` matches config key |
| Template 401 | Pass `options.account` — template won't auto-pick token |
| Workspace dropdown empty | Run iparams page init; call `getOAuthAccounts` SMI first |
| Secret in frontend | client_secret stays in oauth_config; never in React code |
| Resize too short | Re-run `instance.resize` on `app.activated` |
| GID vs display name | `parseIparamGid` strips `"Name (12345)"` → `"12345"` |

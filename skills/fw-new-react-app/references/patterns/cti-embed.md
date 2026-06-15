# CTI global sidebar embed

Use when building a **telephony / contact-center** app that lives in `cti_global_sidebar` — a persistent narrow iframe beside the agent workspace (dialler widgets, softphone panels).

## When to use

- Manifest declares `modules.common.location.cti_global_sidebar`.
- UI embeds a third-party web app (iframe) or agent toolbar.
- Frontend needs install-time config (domains, feature flags) from server — not readable from secure iparams in the browser.
- Fixed dimensions matter — CTI panel has constrained width/height.

## Steps

1. **Manifest** — put `cti_global_sidebar` under `modules.common.location` with `url: "index.html"` (or dedicated HTML).
2. **Declare SMI** — add `getInstallConfig` (or similar) to `modules.common.functions` and export handler in `server/server.js`.
3. **Entry component** — `CtiMain.jsx`: init client → load agent context → SMI config → resize → render embed.
4. **Server handler** — read `args.iparams`, return **non-secret** config the iframe needs (domains, booleans, channel prefs).
5. **Embed component** — receive `client`, `config`, `agentId`; handle postMessage / engagement events.

## Manifest snippet

```json
{
  "modules": {
    "common": {
      "location": {
        "cti_global_sidebar": { "url": "index.html", "icon": "icon.svg" }
      },
      "functions": {
        "getInstallConfig": { "timeout": 10 },
        "searchRecords": { "timeout": 20 }
      },
      "requests": { "fdSearchContacts": {}, "zoomAccessToken": {} }
    }
  }
}
```

## CtiMain init pattern

```jsx
// app/components/CtiMain.jsx
function CtiMain() {
  const [client, setClient] = useState(null);
  const [config, setConfig] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    window.app.initialized().then(async (appClient) => {
      setClient(appClient);
      try {
        const { loggedInUser } = await appClient.data.get('loggedInUser');
        setAgentId(loggedInUser?.id ?? null);
      } catch { setAgentId(null); }

      try {
        const res = await appClient.request.invoke('getInstallConfig', {});
        const raw = res.response;
        setConfig(typeof raw === 'string' ? JSON.parse(raw) : raw);
      } catch {
        setError('Could not load install configuration.');
      }

      appClient.instance.resize({ height: '520px', width: '320px' }).catch(() => {});
    });
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!client) return <p>Loading…</p>;
  return <ZoomContactCenter client={client} config={config} agentId={agentId} />;
}
```

## Server: getInstallConfig

```js
// server/server.js
exports = {
  getInstallConfig: function (args) {
    return getInstallConfigHandler(args)
      .then(data => renderData(null, data))
      .catch(err => renderData(toError(err)));
  }
};

function getInstallConfigHandler(args) {
  const ip = args.iparams;
  return Promise.resolve({
    freshdeskDomain: ip.freshdesk_domain,
    zoomDomain: ip.zoom_domain || 'zoom.us',
    enableStatusSync: !!ip.enable_status_sync,
    channelPrefs: { voice: true, chat: true }
    // Never return API keys or OAuth secrets
  });
}
```

## Resize on activate (optional)

```jsx
const resize = () => client.instance.resize({ height: '520px', width: '320px' }).catch(() => {});
resize();
client.events.on('app.activated', resize);
```

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Blank panel, no config | Declare `getInstallConfig` in manifest **and** export from server |
| Secrets exposed to iframe | SMI returns only public config; keep tokens server-side |
| Panel clipped | Call `instance.resize` after init; CTI default height is small |
| `loggedInUser` missing locally | Guard with try/catch; some simulators omit agent data |
| OAuth tokens in frontend | Use `invokeTemplate` / SMI from server, not iparams in CTI JS |
| iframe CSP blocks embed | Build embed URL server-side; whitelist domain in iparams |

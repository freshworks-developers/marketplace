# Playbook: Microsoft Graph (account OAuth + hybrid UI)

**Use when:** calling Microsoft Graph with **account-level OAuth** (delegated user) from a server method.

## 1. `config/oauth_config.json` (excerpt)

Use a single integration name (example: `microsoft_graph`) with `token_type`: `account`, `authorize_url` / `token_url` from **Microsoft identity platform** (search official **Microsoft OAuth 2.0 authorization code flow** docs for current URLs and `scope` strings — they change over time).

```json
{
  "integrations": {
    "microsoft_graph": {
      "display_name": "Microsoft Graph",
      "client_id": "{{azure_app_client_id}}",
      "client_secret": "{{azure_app_client_secret}}",
      "authorize_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      "token_url": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      "options": {
        "scope": "openid profile User.Read offline_access"
      },
      "token_type": "account"
    }
  }
}
```

Replace `authorize_url` / `token_url` / `scope` with values from **current** Microsoft documentation (use **web search** if unsure).

## 2. `config/requests.json`

```json
{
  "graphMe": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "graph.microsoft.com",
      "path": "/v1.0/me",
      "headers": {
        "Authorization": "Bearer <%= access_token %>"
      }
    },
    "options": {
      "oauth": "microsoft_graph"
    }
  }
}
```

## 3. `manifest.json`

- `modules.common.requests.graphMe`
- `modules.common.functions` entry for your SMI (e.g. `fetchGraphProfile`)
- `support_ticket` location if using sidebar UI
- **Non-empty secure iparams** for Azure secrets → add `onAppInstall` / `onAppUninstall` in `modules.common.events`

## 4. `server/server.js`

```javascript
exports = {
  fetchGraphProfile: async function(args) {
    try {
      const response = await $request.invokeTemplate('graphMe', {
        context: {}
      });

      renderData(null, { success: true, data: response.response });
    } catch (error) {
      console.error('Graph error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

## 5. Validation notes

- OAuth **must** use `integrations` wrapper.
- Template uses `<%= access_token %>`, **not** `<%= iparam.azure_token %>`.
- Async handler → include `await`; use `renderData` for SMI outcomes (`rules/async-patterns.mdc`).

## 6. Official details

Tenant-specific endpoints (`/organizations/` vs `common`), admin consent, and additional Graph scopes: **web search** Microsoft Learn / Graph reference — do not hard-code undocumented assumptions from this playbook alone.

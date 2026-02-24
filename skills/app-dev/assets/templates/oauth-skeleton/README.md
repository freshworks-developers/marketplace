# OAuth App Skeleton

Freshworks Platform 3.0 OAuth integration template for third-party services (GitHub, Google, Microsoft, etc.).

## Structure

```
oauth-skeleton/
├── app/                      # Frontend
│   ├── index.html           # UI with Crayons components
│   ├── scripts/app.js       # Frontend logic (calls SMI)
│   └── styles/
│       ├── style.css
│       └── images/icon.svg
├── server/
│   └── server.js            # Backend SMI functions
├── config/
│   ├── oauth_config.json    # OAuth configuration (REQUIRED)
│   ├── iparams.json         # App-specific parameters (NOT OAuth credentials)
│   └── requests.json        # OAuth API request templates
└── manifest.json            # App configuration

```

## Features

- **OAuth 2.0 Integration**: Secure third-party service authentication
- **Platform 3.0 Structure**: Uses `integrations` wrapper and `oauth_iparams`
- **Request Templates**: OAuth-enabled API calls with `<%= access_token %>`
- **Crayons UI**: Modern Freshworks Design System components

## Configuration

### 1. OAuth Setup (`config/oauth_config.json`)
- OAuth credentials in `oauth_iparams` object
- Uses `<%= oauth_iparams.client_id %>` and `<%= oauth_iparams.client_secret %>`
- Configure authorization and token URLs for your service

### 2. App Settings (choose ONE)
- **Default**: `config/iparams.json` - Platform generates Settings form (most common)
- **Custom**: `config/iparams.html` + `config/assets/iparams.js` - Build custom Settings UI
- App-specific settings (NOT OAuth credentials)
- Accessed via `<%= iparam.parameter_name %>` in requests

### 3. Request Templates (`config/requests.json`)
- Use `<%= access_token %>` for OAuth authorization
- Must include `"options": { "oauth": "integration_name" }`

## OAuth Provider Setup

Before using this skeleton:
1. Register OAuth app with the third-party service (GitHub, Google, etc.)
2. Get Client ID and Client Secret
3. Configure redirect URL in provider settings
4. Update `oauth_config.json` with provider URLs and scopes

## Running Locally

```bash
fdk run
```

## Validation

```bash
fdk validate
```

## Notes

- **Platform 3.0 Requirement**: OAuth MUST use `integrations` wrapper
- **Credential Security**: OAuth credentials stay in `oauth_config.json`, never in `iparams.json`
- **Token Management**: Platform handles token refresh automatically

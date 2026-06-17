# OAuth hybrid skeleton (Platform 3.0)

GitHub account OAuth (`config/oauth_config.json`) + request template using `<%= access_token %>` and `"options.oauth": "github"`. Replace GitHub with another provider using `references/architecture/oauth-configuration-latest.md` and `references/playbooks/microsoft-graph-account-oauth.md` for Graph.

## Setup

1. Register your OAuth app with the provider (GitHub, Google, etc.) and note **client ID** / **client secret**.
2. Set redirect URL to `http://localhost:10001/auth/callback` (local) or `https://oauth.freshdev.io/auth/callback` (production).
3. On app installation, the customer should enter **OAuth Client ID** and **OAuth Client Secret** from the fields defined in `oauth_iparams` inside `config/oauth_config.json` — not in `config/iparams.json` if its required at per installation level and if not then the developer can add the values at the app level.
4. Complete OAuth authorization in the product, then run **fdk validate** and **fdk run**.

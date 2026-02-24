>title: Fixing `config` directory error with OAuth configurations
>tags: request-method, request-template, oauth, oauth_configs.json
>context: oauth_configs.json
>content:

# Fixing `config` directory error with OAuth configurations

## FDK validation fails with the error
```
Config directory has invalid file(s) - oauth.json  
```

## Steps to fix the `oauth` configurations
1. In `configs` directory, create a new file `oauth_configs.json`.
2. In `configs/oauth_configs.json`, define the OAuth crendetials for the app.

>code:
### In `configs` directory, create a new file `oauth_configs.json`.
The OAuth configurations are defined a specific configurations file in `configs/oauth_configs.json`.

### In `configs/oauth_configs.json`, define the OAuth crendetials for the app
The `oauth_configs.json` contains attributes such as `client_id`, `client_secret`, `authorize_url`, `token_url` and `token_type`.
```json
{
  "client_id": "1aXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXc8d1",
  "client_secret": "q8NbXXXXXXXXXXXXXXXX1p1",
  "authorize_url": "https://login.domain.com/authorize.srf",
  "token_url": "https://login.domain.com/token.srf",
  "options": {
    "scope": "read"
  },
  "token_type": "account"
}
```
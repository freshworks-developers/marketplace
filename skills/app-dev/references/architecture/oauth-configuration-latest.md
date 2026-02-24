# Platform 3.0 OAuth Configuration

## Critical Change from Platform 2.x

In Platform 3.0, OAuth configurations **MUST** be wrapped in an `integrations` object. This is a breaking change from Platform 2.x.

## OAuth Prerequisites

1. Register your app in the third-party developer portal to obtain `client_id` and `client_secret`
2. Set the redirect URL:
   - **Testing:** `http://localhost:10001/auth/callback`
   - **Production:** `https://oauth.freshdev.io/auth/callback`

## Considerations

1. Third-party application must adhere to OAuth 2.0 framework (RFC 6749)
2. OAuth request in `config/oauth_config.json` supported from FDK 9.0.0+ and platform 2.3+
3. Supports accessing a maximum of **three** OAuth-secured resources
4. One of the 3 OAuth configurations should facilitate agent installation

## Configuration Structure

### config/oauth_config.json

**Platform 3.0 Format (Correct):**
```json
{
  "integrations": {
    "<oauth_configuration_name1>": {
      "display_name": "value",
      "client_id": "value",
      "client_secret": "value",
      "authorize_url": "url value",
      "token_url": "url value",
      "options": {
        "scope": "read"
      },
      "token_type": "account"
    },
    "<oauth_configuration_name2>": {
      "display_name": "value",
      "client_id": "value",
      "client_secret": "value",
      "authorize_url": "url value",
      "token_url": "url value",
      "options": {
        "scope": "read"
      },
      "token_type": "agent"
    }
  }
}
```

### OAuth Configuration Attributes

#### Required Attributes
1. **display_name** - Display name for the OAuth integration (mandatory)
2. **client_id** - Issued by third-party developer portal (mandatory)
3. **client_secret** - Issued by third-party developer portal (mandatory)
4. **authorize_url** - Third-party authorization request URL
5. **token_url** - Request URL for obtaining the access token
6. **token_type** - Level of access (`account` or `agent`)

#### Optional Attributes
7. **options** - Additional parameters (scope, custom headers)
8. **oauth_iparams** - For unique authorization URLs per OAuth provider

## Example: GitHub OAuth

### config/oauth_config.json
```json
{
  "integrations": {
    "github": {
      "display_name": "GitHub",
      "client_id": "{{client_id}}",
      "client_secret": "{{client_secret}}",
      "authorize_url": "https://github.com/login/oauth/authorize",
      "token_url": "https://github.com/login/oauth/access_token",
      "options": {
        "scope": "repo"
      },
      "token_type": "account"
    }
  }
}
```

### config/requests.json
```json
{
  "getGitHubRepos": {
    "schema": {
      "method": "GET",
      "host": "api.github.com",
      "path": "/user/repos",
      "headers": {
        "Authorization": "bearer <%= access_token %>",
        "Content-Type": "application/json"
      }
    },
    "options": {
      "oauth": "github"
    }
  }
}
```

### config/iparams.json
```json
{
  "client_id": {
    "display_name": "GitHub Client ID",
    "description": "Enter your GitHub OAuth App Client ID",
    "type": "text",
    "required": true
  },
  "client_secret": {
    "display_name": "GitHub Client Secret",
    "description": "Enter your GitHub OAuth App Client Secret",
    "type": "text",
    "required": true,
    "secure": true
  }
}
```

## OAuth with Dynamic Domains (oauth_iparams)

When OAuth requires dynamic domains (like Shopify or OneDrive), use `oauth_iparams`:

### config/oauth_config.json
```json
{
  "integrations": {
    "shopify": {
      "display_name": "Shopify",
      "client_id": "1aXXX-XXXX-XXXXXXXXc8d1",
      "client_secret": "q8NbXXXXXXXXX1p1",
      "oauth_iparams": {
        "domain": {
          "display_name": "Shopify domain",
          "description": "Enter domain name",
          "type": "text",
          "required": true
        }
      },
      "authorize_url": "https://{{ oauth_iparams.domain }}/authorize.srf",
      "token_url": "https://{{ oauth_iparams.domain }}/token.srf",
      "options": {
        "scope": "read"
      },
      "token_type": "account"
    },
    "onedrive": {
      "display_name": "OneDrive",
      "client_id": "1aXXX-XXXX-XXXXXXXXc8d1",
      "client_secret": "q8NbXXXXXXXXX1p1",
      "oauth_iparams": {
        "domain": {
          "display_name": "OneDrive domain",
          "description": "Enter domain name",
          "type": "text",
          "required": true
        }
      },
      "authorize_url": "https://{{ oauth_iparams.domain }}/authorize.srf",
      "token_url": "https://{{ oauth_iparams.domain }}/token.srf",
      "options": {
        "scope": "read"
      },
      "token_type": "agent"
    }
  }
}
```

## Using OAuth Access Token in Request Templates

### In config/requests.json
```json
{
  "asanaGetWorkspace": {
    "schema": {
      "method": "GET",
      "host": "app.asana.com",
      "path": "/api/1.0/workspaces",
      "headers": {
        "Authorization": "bearer <%= access_token %>",
        "Content-Type": "application/json"
      }
    },
    "options": {
      "oauth": "asana"
    }
  }
}
```

**Key Points:**
1. Use `<%= access_token %>` in the Authorization header
2. Add `options.oauth` with the OAuth configuration name
3. The access token is automatically refreshed

## Multiple OAuth Integrations

You can have up to 3 OAuth integrations:

```json
{
  "integrations": {
    "github": {
      "display_name": "GitHub",
      "client_id": "{{github_client_id}}",
      "client_secret": "{{github_client_secret}}",
      "authorize_url": "https://github.com/login/oauth/authorize",
      "token_url": "https://github.com/login/oauth/access_token",
      "options": {
        "scope": "repo"
      },
      "token_type": "account"
    },
    "slack": {
      "display_name": "Slack",
      "client_id": "{{slack_client_id}}",
      "client_secret": "{{slack_client_secret}}",
      "authorize_url": "https://slack.com/oauth/authorize",
      "token_url": "https://slack.com/api/oauth.access",
      "options": {
        "scope": "channels:read channels:write"
      },
      "token_type": "agent"
    },
    "jira": {
      "display_name": "Jira",
      "client_id": "{{jira_client_id}}",
      "client_secret": "{{jira_client_secret}}",
      "authorize_url": "https://auth.atlassian.com/authorize",
      "token_url": "https://auth.atlassian.com/oauth/token",
      "options": {
        "scope": "read:jira-work write:jira-work"
      },
      "token_type": "account"
    }
  }
}
```

## Common Validation Errors

### Error: "OAuth config must have required property 'integrations'"
**Cause:** Missing `integrations` wrapper in `config/oauth_config.json`

**❌ Wrong (Platform 2.x format):**
```json
{
  "client_id": "...",
  "client_secret": "...",
  "authorize_url": "...",
  "token_url": "..."
}
```

**✅ Correct (Platform 3.0 format):**
```json
{
  "integrations": {
    "oauth_name": {
      "client_id": "...",
      "client_secret": "...",
      "authorize_url": "...",
      "token_url": "..."
    }
  }
}
```

### Error: "OAuth config must NOT have additional properties"
**Cause:** Unsupported configuration properties

**Supported Properties:**
- `display_name` (required)
- `client_id` (required)
- `client_secret` (required)
- `authorize_url` (required)
- `token_url` (required)
- `token_type` (required)
- `options` (optional)
- `oauth_iparams` (optional)

**Remove any other properties!**

### Error: "OAuth request missing options"
**Cause:** Request template doesn't specify OAuth configuration

**Solution:** Add `options.oauth` in request template:
```json
{
  "myOAuthRequest": {
    "schema": {
      "method": "GET",
      "host": "api.example.com",
      "path": "/data",
      "headers": {
        "Authorization": "bearer <%= access_token %>"
      }
    },
    "options": {
      "oauth": "oauth_config_name"
    }
  }
}
```

## Token Types

### account
- Token is valid at the account level
- All agents in the account can use the same token
- Use for account-wide integrations

### agent
- Token is valid for individual agents
- Each agent must authorize separately
- Use for agent-specific integrations

## Migration from Platform 2.2/2.3

### Platform 2.x (Old)
```json
{
  "client_id": "xxx",
  "client_secret": "yyy",
  "authorize_url": "https://example.com/authorize",
  "token_url": "https://example.com/token",
  "options": {
    "scope": "read"
  },
  "token_type": "account"
}
```

### Platform 3.0 (New)
```json
{
  "integrations": {
    "example": {
      "display_name": "Example Service",
      "client_id": "xxx",
      "client_secret": "yyy",
      "authorize_url": "https://example.com/authorize",
      "token_url": "https://example.com/token",
      "options": {
        "scope": "read"
      },
      "token_type": "account"
    }
  }
}
```

**Key Differences:**
1. ✅ Wrapped in `integrations` object
2. ✅ Each OAuth config has a unique name
3. ✅ Added `display_name` attribute
4. ✅ Supports multiple OAuth configurations

## Best Practices

1. **Always use integrations wrapper** - Required in Platform 3.0
2. **Add display_name** - Helps users understand which service they're authorizing
3. **Use oauth_iparams for dynamic domains** - When domains vary per installation
4. **Secure client_secret** - Store in iparams as secure field
5. **Test locally** - Use `http://localhost:10001/auth/callback` for local testing
6. **One agent token** - At least one OAuth config should use `token_type: "agent"`
7. **Maximum 3 integrations** - Platform supports up to 3 OAuth resources


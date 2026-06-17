# FDK Create - App Structure Reference

## Overview

The `fdk create` command generates the initial app structure based on the app type you select. Understanding this structure helps ensure proper app architecture from the start.

**App-dev default `engines`:** **`node` `24.11.0`**, **`fdk` `10.0.1`** in `manifest.json` for new Platform 3.0 apps (matches skill templates). If `fdk validate` will not run, use **fw-setup** first; **LAST RESORT** engines to **9.8.2 / 18.20.8** only per **SKILL.md** after six validate iterations or CLI blocked on 10.0.1+24.11.0.

---

## Basic Command

```bash
fdk create
```

You'll be prompted to select:
1. Product (Freshdesk, Freshservice, Freshsales, etc.)
2. App template (Your first app, Your first serverless app, etc.)
3. App name

---

## App Types and Structures

### 1. Frontend App (Your first app)

**Command Selection:**
- Template: "Your first app"
- Creates a basic frontend app with UI

**Generated Structure:**
```
my-app/
├── app/
│   ├── index.html          # Main HTML file
│   ├── app.js              # Frontend JavaScript
│   ├── client.js           # Frontend client SDK (auto-included)
│   └── styles/
│       ├── style.css       # Styling
│       └── images/
│           └── icon.svg    # App icon
├── manifest.json           # App manifest
└── README.md
```

**manifest.json (Frontend Only):**
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {},
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  },
  "engines": {
    "node": "24.11.0",
    "fdk": "10.0.1"
  }
}
```

---

### 2. Serverless App (Your first serverless app)

**Command Selection:**
- Template: "Your first serverless app"
- Creates a backend-only app with no UI

**Generated Structure:**
```
my-serverless-app/
├── server/
│   └── server.js           # Backend code
├── config/
│   ├── iparams.json        # Installation parameters
│   └── requests.json       # Request templates (if needed)
├── manifest.json           # App manifest
└── README.md
```

**manifest.json (Serverless):**
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "events": {
        "onAppInstall": {
          "handler": "onAppInstallHandler"
        }
      },
      "requests": {
        "externalApi": {}
      }
    },
    "support_ticket": {
      "events": {
        "onTicketCreate": {
          "handler": "onTicketCreateHandler"
        }
      }
    }
  },
  "engines": {
    "node": "24.11.0",
    "fdk": "10.0.1"
  }
}
```

**server/server.js (Serverless):**
```javascript
exports = {
  onAppInstallHandler: async function(payload) {
    console.log('App installed');
    renderData();
  },

  onTicketCreateHandler: async function(payload) {
    console.log('Ticket created:', payload.data.ticket.id);
    renderData();
  }
};
```

---

### 3. Hybrid App (Frontend + Backend/SMI)

**Command Selection:**
- Template: "Your first app" + manually add `server/` folder
- OR start with serverless and add frontend files

**Generated Structure:**
```
my-hybrid-app/
├── app/
│   ├── index.html          # Frontend HTML
│   ├── app.js              # Frontend JavaScript
│   └── styles/
│       ├── style.css
│       └── images/
│           └── icon.svg
├── server/
│   └── server.js           # Backend SMI methods
├── config/
│   ├── iparams.json        # Installation parameters
│   └── requests.json       # Request templates
├── manifest.json           # App manifest
└── README.md
```

**manifest.json (Hybrid - Frontend + SMI):**
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "requests": {
        "externalApi": {}
      },
      "functions": {
        "fetchData": {}
      }
    },
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  },
  "engines": {
    "node": "24.11.0",
    "fdk": "10.0.1"
  }
}
```

**app/app.js (Frontend calling SMI):**
```javascript
document.addEventListener('DOMContentLoaded', async function() {
  await client.instance.context().then(function(context) {
    console.log('Context:', context);
  });

  // Call SMI method
  document.getElementById('btnFetch').addEventListener('click', async function() {
    const result = await client.request.invoke('fetchData', {
      param1: 'value1'
    });
    console.log('SMI Result:', result);
  });
});
```

**server/server.js (SMI method):**
```javascript
exports = {
  fetchData: async function(args) {
    const { param1 } = args;
    const iparams = args.iparams;

    // Call external API using request template
    const response = await $request.invokeTemplate('externalApi', {
      context: {},
      body: JSON.stringify({ query: param1 })
    });

    return { success: true, data: response };
  }
};
```

---

### 4. OAuth App

**Command Selection:**
- Start with any template, then add OAuth configuration manually

**Generated Structure:**
```
my-oauth-app/
├── app/
│   ├── index.html
│   ├── app.js
│   └── styles/
├── server/
│   └── server.js
├── config/
│   ├── iparams.json
│   ├── requests.json       # OAuth-enabled requests
│   └── oauth_config.json   # OAuth configuration + oauth_iparams
├── manifest.json
└── README.md
```

**config/oauth_config.json:**

The installing developer must register a Google OAuth app, then enter **Client ID** and **Client Secret** on the installation page (`oauth_iparams` — not `config/iparams.json`) before `fdk run` / OAuth authorization.

```json
{
  "integrations": {
    "google": {
      "display_name": "Google",
      "client_id": "<%= oauth_iparams.client_id %>",
      "client_secret": "<%= oauth_iparams.client_secret %>",
      "authorize_url": "https://accounts.google.com/o/oauth2/v2/auth",
      "token_url": "https://oauth2.googleapis.com/token",
      "token_type": "account",
      "options": {
        "scope": "https://www.googleapis.com/auth/userinfo.email"
      },
      "oauth_iparams": {
        "client_id": {
          "display_name": "Google OAuth Client ID",
          "description": "Client ID from Google Cloud Console OAuth credentials",
          "type": "text",
          "required": true
        },
        "client_secret": {
          "display_name": "Google OAuth Client Secret",
          "description": "Client secret from Google Cloud Console OAuth credentials",
          "type": "text",
          "required": true,
          "secure": true
        }
      }
    }
  }
}
```

**config/requests.json (OAuth):**
```json
{
  "getUserInfo": {
    "schema": {
      "method": "GET",
      "host": "www.googleapis.com",
      "path": "/oauth2/v2/userinfo",
      "headers": {
        "Authorization": "Bearer <%= access_token %>"
      }
    },
    "options": {
      "oauth": "google"
    }
  }
}
```

**manifest.json (OAuth App):**
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "requests": {
        "getUserInfo": {}
      },
      "functions": {
        "fetchUserInfo": {}
      }
    },
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  },
  "engines": {
    "node": "24.11.0",
    "fdk": "10.0.1"
  }
}
```

---

## Key Differences by App Type

| Feature | Frontend | Serverless | Hybrid (SMI) | OAuth |
|---------|----------|------------|--------------|-------|
| `app/` folder | [VALID] | [INVALID] | [VALID] | [VALID] |
| `server/` folder | [INVALID] | [VALID] | [VALID] | [VALID] |
| `config/` folder | [INVALID] | [VALID] | [VALID] | [VALID] |
| Location in manifest | [VALID] | [INVALID] | [VALID] | [VALID] |
| Events in manifest | [INVALID] | [VALID] | Optional | Optional |
| Functions in manifest | [INVALID] | [INVALID] | [VALID] | [VALID] |
| Requests in manifest | [INVALID] | [VALID] | [VALID] | [VALID] |
| `oauth_config.json` | [INVALID] | [INVALID] | [INVALID] | [VALID] |

---

## Manifest Structure Rules

### All Apps Must Have:
1. `"platform-version": "3.0"`
2. `modules` structure (NOT `product`)
3. At least one product module (even if empty): `"support_ticket": {}`
4. `engines` with node and fdk versions

### Frontend Apps Need:
- `modules.<product>.location` with placement details
- NO `requests` unless calling external APIs
- NO `functions` unless using SMI

### Serverless Apps Need:
- `modules.<product>.events` for event handlers
- `modules.common.requests` for external API calls
- NO `location` (no UI)

### Hybrid Apps Need:
- Both `location` (for frontend) and `functions` (for SMI)
- `modules.common.requests` for backend API calls
- `modules.common.functions` declaring all SMI methods

### OAuth Apps Need:
- `modules.common.requests` with OAuth-enabled request templates
- `config/oauth_config.json` with OAuth provider details
- `config/requests.json` with `auth_type: "oauth"`

---

## Common Mistakes

[INVALID] **Wrong: Missing product module**
```json
{
  "modules": {
    "common": {}
  }
}
```

[VALID] **Correct: At least one product module**
```json
{
  "modules": {
    "common": {},
    "support_ticket": {}
  }
}
```

[INVALID] **Wrong: Undeclared SMI function**
```javascript
// server.js
exports = {
  myFunction: function() {}  // Not declared in manifest
}
```

[VALID] **Correct: Declared in manifest**
```json
{
  "modules": {
    "common": {
      "functions": {
        "myFunction": {}
      }
    }
  }
}
```

[INVALID] **Wrong: Using "product" structure**
```json
{
  "product": {
    "freshdesk": {}
  }
}
```

[VALID] **Correct: Using "modules" structure**
```json
{
  "modules": {
    "support_ticket": {}
  }
}
```

---

## Next Steps After FDK Create

1. **Review manifest.json** - Ensure correct platform version and module structure
2. **Add request templates** - If calling external APIs, define in `config/requests.json`
3. **Configure iparams** - Add installation parameters in `config/iparams.json`
4. **Implement logic** - Add frontend logic in `app/app.js` or backend in `server/server.js`
5. **Test locally** - Run `fdk run` and test in development mode
6. **Validate** - Run `fdk validate` before packaging

---

## Platform 3.0 Enforcement

When the skill sees `fdk create` or app generation requests:
1. [VALID] Use `"platform-version": "3.0"` always
2. [VALID] Use `modules` structure (NOT `product`)
3. [INVALID] NEVER include `whitelisted-domains`
4. [VALID] Always include `engines` block
5. [VALID] Declare all requests, functions, and events in manifest
6. [VALID] Use correct module names (`support_ticket`, `service_ticket`, etc.)
7. [VALID] Include at least one product module even if empty

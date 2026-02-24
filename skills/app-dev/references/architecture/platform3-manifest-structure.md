# Platform 3.0 Manifest Structure

## Critical Requirements

### Must Have
1. ✅ `"platform-version": "3.0"` - Always use 3.0, never 2.3 or 2.x
2. ✅ `"modules"` structure - Never use legacy `"product"` structure  
3. ✅ At least ONE product module in addition to `common` (even if empty `{}`)
4. ✅ `"engines"` block with node and fdk versions

### Example Minimal Manifest
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {},
    "support_ticket": {}
  },
  "engines": {
    "node": "18.20.8",
    "fdk": "9.7.4"
  }
}
```

## Common Module

The common module allows developers to build apps that work across multiple Freshworks products.

### Capabilities
1. Build front-end apps, serverless apps, and full-stack SMI apps
2. React to various events (app setup, external events, scheduled events)
3. Access users based on the included modules and subscriptions

### Limitations
1. **Cannot be used alone** - Requires at least one additional product module
2. Certain module combinations are not supported
3. Full-page apps have limited compatibility with some products

### Common Module Structure
```json
{
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {
        "requestMethod1": {},
        "requestMethod2": {}
      },
      "functions": {
        "serverMethodName1": {},
        "serverMethodName2": {}
      },
      "events": {
        "onAppInstall": {
          "handler": "onAppInstallHandler"
        },
        "onAppUninstall": {
          "handler": "onAppUninstallHandler"
        }
      }
    },
    "support_ticket": {}
  }
}
```

## Product-Specific Modules

### Freshdesk
- `support_email` – Handles email-based support interactions
- `support_ticket` – Manages support ticket creation and tracking
- `support_contact` – Manages customer contact details for support
- `support_company` – Stores and manages company information
- `support_portal` – Provides a self-service portal for customers
- `support_agent` – Interfaces for agent-specific functionalities

**Common Module Placeholders:**
- `full_page_app` – Full-screen view
- `cti_global_sidebar` – Sidebar integration for CTI features

### Freshservice
- `service_ticket` – IT service ticket management
- `service_asset` – IT assets and inventory
- `service_change` – Change requests and approvals
- `service_user` – User data within service context

**Common Module Placeholders:**
- `full_page_app` – Full-page format

### Freshsales Suite & Freshsales Classic
- `deal` – Tracks sales deals and opportunities
- `appointment` – Manages scheduling and appointments
- `cpq_document` – CPQ-related documents
- `product` – Product catalog management
- `contact` – Contact management
- `sales_account` – Sales accounts and related data
- `sales_activities` – Sales activities and related data
- `phone` – Phone interactions and call logs
- `task` – Tasks and follow-ups
- `user_agent_availability` – User agent availability
- `lead` – Sales leads (Freshsales Classic only)

**Common Module Placeholders:**
- `full_page_app` – Full-screen app experience
- `left_nav_cti` – CTI features in sidebar
- `left_nav_chat` – Chat functionality in sidebar

### Freshcaller
- `call` – Call initiation and tracking
- `caller_conversation` – Call-related conversations
- `caller_metrics` – Call performance metrics
- `caller_agent` – Caller agent-specific functionalities
- `notification` – Calling-related notifications

### Freshchat
- `chat_user` – Chat user profiles and settings
- `chat_conversation` – Real-time chat conversations

## Global Application Manifest

For apps that work across multiple products:

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    },
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "service_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "deal": {
      "location": {
        "deal_entity_menu": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  },
  "engines": {
    "node": "18.20.8",
    "fdk": "9.7.4"
  }
}
```

## Declaring Resources in Manifest

### Request Templates
```json
{
  "modules": {
    "common": {
      "requests": {
        "getDeals": {},
        "sendToExternalAPI": {}
      }
    }
  }
}
```

### SMI Functions
```json
{
  "modules": {
    "common": {
      "functions": {
        "bookmarkTicket": {"timeout": 10},
        "fetchData": {"timeout": 15}
      }
    }
  }
}
```

**Timeout Options:** 20, 25, or 30 seconds

### Events
```json
{
  "modules": {
    "common": {
      "events": {
        "onAppInstall": {
          "handler": "onAppInstallHandler"
        },
        "onAppUninstall": {
          "handler": "onAppUninstallHandler"
        }
      }
    },
    "support_ticket": {
      "events": {
        "onTicketCreate": {
          "handler": "onTicketCreateHandler"
        }
      }
    }
  }
}
```

## Engines Block

Required in all Platform 3.0 apps:

```json
{
  "engines": {
    "node": "18.20.8",
    "fdk": "9.7.4"
  }
}
```

## Validation Rules

When you run `fdk validate`, it checks:

1. ✅ `platform-version` is "3.0"
2. ✅ `modules` structure is present (not `product`)
3. ✅ At least one product module exists
4. ✅ `engines` block is defined
5. ✅ All requests are declared in `modules.common.requests`
6. ✅ All functions are declared in `modules.common.functions`
7. ✅ Event handlers match declared events
8. ✅ Locations are in correct modules (common vs product-specific)

## Common Validation Errors

### Error: "At least one module apart from common must be mentioned"
**Solution:** Add a product module, even if empty:
```json
{
  "modules": {
    "common": { ... },
    "support_ticket": {}
  }
}
```

### Error: "Invalid location(s) mentioned in modules"
**Solution:** Move product-specific locations from `common` to product module:
```json
❌ Wrong:
{
  "modules": {
    "common": {
      "location": {
        "ticket_sidebar": { ... }
      }
    }
  }
}

✅ Correct:
{
  "modules": {
    "common": {},
    "support_ticket": {
      "location": {
        "ticket_sidebar": { ... }
      }
    }
  }
}
```

### Error: "Requested function not found or registered"
**Solution:** Declare all SMI functions in manifest:
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

## Best Practices

1. **Always start with a valid skeleton** - Use FDK templates or skill templates
2. **Declare before using** - All requests, functions, and events must be in manifest
3. **Product-specific locations** - Put in product module, not common
4. **Empty modules are OK** - If you only need common module, add empty product module
5. **Validate early** - Run `fdk validate` before testing


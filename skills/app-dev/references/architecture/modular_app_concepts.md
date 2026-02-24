>title: what are SKUs and modules
>tags: modules, sku, global_apps
>context:
>content:

# what are SKUs and modules

SKUs are bundles of Freshworks products. Customers subscribe to SKU plans to access various products. Apps are only available to customers subscribed to the relevant products within the SKU. Subscriptions can be for individual products or SKU bundles. Apps with multiple modules map their functionality to specific products.

---
>title: How different subscriptions affect the functionality of an app with multiple modules.
>tags: modules
>context:
>content:

# How different subscriptions affect the functionality of an app with multiple modules

## Summary
1. Impact Factors  
2. Scenarios  
3. Important Points  

## Impact Factors
1. **Module Mapping:**  
   - Each module corresponds to specific functionalities and product access.  
   - The user's subscription determines which modules are functional.
2. **App Logic Distribution:**  
   - If an essential feature relies on a module not included in the subscription, that feature is unavailable.
3. **Common Module Usage:**  
   - When used alongside other modules, the subscription compatibility of those modules determines available features.

## Scenarios
1. **App Designed for a Specific Product:**  
   - Subscribing to only that product's SKU activates all relevant features.
2. **App with Modules Across Products:**  
   - Features depend on the user's subscription for each respective product.
3. **App Using the Common Module:**  
   - Subscription restrictions apply to both common and additional modules.

## Important Points
1. Subscriptions affect functionalities tied to specific modules.
2. The common module's functions may remain accessible if compatible products are subscribed.
3. Consult Freshworks documentation or your app developer for detailed compatibility information.

---
>title: what are common module
>tags: common_module, modules
>context:
>content:

# what are common module

The common module allows developers to build apps that work across multiple Freshworks products. It provides functionalities like serverless events, request templates, and SMI functions. However, you must include at least one additional product-specific module for deployment.

## Capabilities
1. Build front-end apps, serverless apps, and full-stack SMI apps.
2. React to various events (app setup, external events, scheduled events).
3. Access users based on the included modules and subscriptions.

## Limitations
1. Cannot be used alone; requires an additional module.
2. Certain module combinations are not supported.
3. Full-page apps have limited compatibility with some products.

---
>title: modules association with respective freshworks products
>tags: modules, mapping
>context:
>content:

# modules association with respective freshworks products

| Product                | Modules Included                                                                 | Common Placeholders Available       | Notes                                                                                   |
|------------------------|----------------------------------------------------------------------------------|-------------------------------------|-----------------------------------------------------------------------------------------|
| Freshdesk              | support_email, support_ticket, support_portal, support_agent, support_contact, support_company | full_page_app, cti_global_sidebar   | -                                                                                       |
| Freshservice           | service_ticket, service_asset, service_change, service_user                      | full_page_app                       | -                                                                                       |
| Freshsales Suite (Classic, Chat, Caller) | appointment, contact, cpq_document, deal, phone, product, sales_account, task | full_page_app, left_nav_cti, left_nav_chat | -                                                                                       |
| Freshsales Classic     | lead                                                                             | full_page_app, left_nav_cti, left_nav_chat | chat_conversation also works but full_page_app cannot be rendered in standalone Freshchat. |
| Freshcaller            | call, caller_conversation, caller_metrics, caller_agent, notification             | N/A                                 | These modules are not compatible with the common module for app deployment.             |
| Freshchat              | chat_user                                                                        | N/A                                 | The chat_user module is not compatible with the common module for app deployment.         |

---
>title: What kind of apps can you build for common module?
>tags: common_module
>context:
>content:

# What kind of apps can you build for common module?

You can build the following types of apps with the common module:

1. **Front-end App:**  
   - As long as the only other module(s) in the manifest are not: caller_agent, call, caller_metrics, notification, caller_conversation, or chat_user.
2. **Serverless App:**  
   - The app reacts to app setup events, external events, scheduled events, or product-specific events as defined by the other modules.
3. **Full-stack SMI App:**  
   - Provided the other modules are not among: caller_agent, call, caller_metrics, notification, caller_conversation, or chat_user.

---
>title: Who can access an app built for only the common module?
>tags: common_module
>context:
>content:

# Who can access an app built for only the common module?

An app built with only the common module (plus at least one product-specific module) is accessible by users with any of the following subscriptions:
1. A stand-alone Freshdesk subscription.
2. A stand-alone Freshservice subscription.
3. A stand-alone Freshsales Classic subscription.
4. A Freshsales Suite subscription that includes Freshsales Classic, Freshchat, and Freshcaller.
5. A Freshsales Suite subscription that includes only Freshchat.
6. A Freshsales Suite subscription that includes only Freshsales Classic.

---
>title: How to define modules for global application
>tags: common_module
>context:
>content:

# How to define modules for global application

Below is an example `manifest.json` snippet defining modules for a global app:

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
  }
}
```

---
>title: How to use common module placeholders  
>tags: common_module  
>context: manifest.json  
>content:

# How to use common module placeholders

## Examples

### Full Page App
   ```json
   "modules": {
     "common": {
       "location": {
         "full_page_app": {
           "url": "myfirstapp.html",
           "icon": "logo.svg"
         }
       }
     }
   }
```

### CTI Global Sidebar:

```json
"modules": {
  "common": {
    "location": {
      "cti_global_sidebar": {
        "url": "myfirstapp.html",
        "icon": "logo.svg"
      }
    }
  }
}
```

### Product-specific Example (support_ticket):

```json
"modules": {
  "support_ticket": {
    "location": {
      "ticket_sidebar": {
        "url": "index.html",
        "icon": "styles/images/icon.svg"
      }
    }
  }
}
```

---

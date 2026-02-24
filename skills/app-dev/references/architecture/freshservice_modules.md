>title: what are modules supported by Freshservice
>tags: freshservice_modules
>context: manifest.json
>content:

# What are modules supported by Freshservice

Freshservice supports following modules in `manifest.json`:

## Supported Modules

1. `service_ticket` - under `modules.service_ticket`
2. `service_asset` - under `modules.service_asset`
3. `service_change` - under `modules.service_change`
4. `service_user` - under `modules.service_user`

---
>title: how to use modules supported by Freshservice
>tags: freshservice_modules
>context: manifest.json
>content:

# How to use modules supported by Freshservice

To use the supported modules, modify your `manifest.json` as below:

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
    "service_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "ticket_sidebar.html",
          "icon": "styles/images/icon.svg"
        },
        "ticket_requester_info": {
          "url": "ticket_requester_info.html",
          "icon": "styles/images/icon.svg"
        },
        "ticket_conversation_editor": {
          "url": "ticket_conversation_editor.html",
          "icon": "styles/images/icon.svg"
        },
        "new_ticket_sidebar": {
          "url": "new_ticket_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "service_asset": {
      "location": {
        "asset_top_navigation": {
          "url": "asset_top_navigation.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "service_change": {
      "location": {
        "change_sidebar": {
          "url": "change_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}
```

---
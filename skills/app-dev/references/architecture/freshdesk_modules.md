>title: what are modules supported by Freshdesk
>tags: freshdesk_modules
>context: manifest.json
>content:

# what are modules supported by Freshdesk

## Modules in manifest.json

Freshdesk supports the following modules in `manifest.json`:
1. `support_email` - under `modules.support_email`
2. `support_ticket` - under `modules.support_ticket`
3. `support_portal` - under `modules.support_portal`
4. `support_agent` - under `modules.support_agent`
5. `support_contact` - under `modules.support_contact`
6. `support_company` - under `modules.support_company`

---

>title: how to use modules supported by Freshdesk
>tags: freshdesk_modules
>context: manifest.json
>content:

# how to use modules supported by Freshdesk

## Manifest Configuration

To use the modules supported by Freshdesk, modify your `manifest.json` as below:

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
          "url": "ticket_sidebar.html",
          "icon": "styles/images/icon.svg"
        },
        "ticket_requester_info": {
          "url": "ticket_requester_info.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "support_email": {
      "location": {
        "new_email_requester_info": {
          "url": "new_email_requester_info.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "support_contact": {
      "location": {
        "contact_sidebar": {
          "url": "contact_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}
```
---
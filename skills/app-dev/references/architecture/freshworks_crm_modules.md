>title: what are modules supported by Freshsales Suite
>tags: freshworks_crm_modules
>context: manifest.json
>content:

# What are modules supported by Freshsales Suite

Freshservice supports following modules in `manifest.json`.

## Supported Modules

1. `appointment` - under `modules.appointment`
2. `contact` - under `modules.contact`
3. `cpq_document` - under `modules.cpq_document`
4. `deal` - under `modules.deal`
5. `phone` - under `modules.phone`
6. `product` - under `modules.product`
7. `sales_account` - under `modules.sales_account`
8. `task` - under `modules.task`

---

>title: how to use modules supported by Freshsales Suite
>tags: freshworks_crm_modules
>context: manifest.json
>content:

# How to use modules supported by Freshsales Suite

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        },
        "left_nav_cti": {
          "url": "left_nav_cti.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    },
    "deal": {
      "location": {
        "deal_entity_menu": {
          "url": "deal_entity_menu.html",
          "icon": "styles/images/icon.svg"
        },
        "deal_quick_actions": {
          "url": "deal_quick_actions.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}
```

---
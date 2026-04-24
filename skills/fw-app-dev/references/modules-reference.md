# Platform 3.0 Modules & Locations Reference

**Complete module and location tables for all Freshworks products.**

## Freshdesk Modules

### support_ticket
**Locations:** ticket_sidebar, ticket_requester_info, ticket_top_navigation, ticket_background, time_entry_background, ticket_attachment, ticket_conversation_editor, new_ticket_requester_info, new_ticket_background

### support_contact
**Locations:** contact_sidebar, contact_background

### support_company
**Locations:** company_sidebar, company_background

### support_agent
**Locations:** agent_sidebar, agent_background

### support_email
**Locations:** email_sidebar

### support_portal
**Locations:** portal_sidebar

## Freshservice Modules

### service_ticket
**Locations:** ticket_sidebar, ticket_requester_info, ticket_background, ticket_conversation_editor, new_ticket_requester_info

### service_asset
**Locations:** asset_sidebar, asset_background

### service_change
**Locations:** change_sidebar, change_background

### service_release
**Locations:** release_sidebar

### service_problem
**Locations:** problem_sidebar

### service_agent
**Locations:** agent_sidebar

## Freshsales Modules

### deal
**Locations:** deal_sidebar, deal_background

### contact
**Locations:** contact_sidebar, contact_background

### account
**Locations:** account_sidebar, account_background

### lead
**Locations:** lead_sidebar, lead_background

### sales_activity
**Locations:** activity_sidebar

## Freshchat Modules

### conversation
**Locations:** conversation_sidebar, conversation_background

### contact
**Locations:** contact_sidebar

## Freshcaller Modules

### call
**Locations:** call_sidebar, call_background

### contact
**Locations:** contact_sidebar

## Common Locations (All Products)

**In `modules.common.location`:**
- `full_page_app` - Standalone full-page app
- `cti_global_sidebar` - Global CTI sidebar

## Module Selection Guide

| Product | Primary Module | Common Use Case | Example Location |
|---------|----------------|-----------------|------------------|
| Freshdesk | support_ticket | Ticket sidebar | ticket_sidebar |
| Freshservice | service_ticket | Ticket sidebar | ticket_sidebar |
| Freshsales | deal | Deal sidebar | deal_sidebar |
| Freshchat | conversation | Chat sidebar | conversation_sidebar |
| Freshcaller | call | Call sidebar | call_sidebar |

## Validation Rules

1. MUST include at least ONE product module (even if empty: `{}`)
2. `common` module for global placeholders only
3. Product modules for product-specific locations
4. Declare requests, functions, events in manifest
5. Location MUST be in correct module (ticket_sidebar in support_ticket, NOT common)

## Example: Multi-Module App

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
      }
    },
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "ticket.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "support_contact": {
      "location": {
        "contact_sidebar": {
          "url": "contact.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}
```

## Quick Lookup

**Need ticket sidebar?**
- Freshdesk: `modules.support_ticket.location.ticket_sidebar`
- Freshservice: `modules.service_ticket.location.ticket_sidebar`

**Need contact sidebar?**
- Freshdesk: `modules.support_contact.location.contact_sidebar`
- Freshsales: `modules.contact.location.contact_sidebar`

**Need full page app?**
- All products: `modules.common.location.full_page_app`

**Need deal sidebar?**
- Freshsales: `modules.deal.location.deal_sidebar`

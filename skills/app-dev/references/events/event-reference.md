# Serverless Events Reference

Complete list of events by product and module.

## Common Events (configured at `modules.common.events`)

**App Lifecycle Events:**
- `onAppInstall` - Triggered when app is installed
  - **CRITICAL:** MUST be included if app uses iparams
  - Handler receives iparams in `args.iparams` for validation/initialization
- `afterAppUpdate` - Triggered after app update
- `onAppUninstall` - Triggered when app is uninstalled
  - **CRITICAL:** MUST be included if app has scheduled events, background tasks, webhooks
  - Handler should clean up scheduled events, cancel webhooks

**External Events:**
- `onExternalEvent` - Triggered by external webhook/event

**Scheduled Events:**
- Created dynamically using `$schedule.create()` - NOT declared in manifest

## Freshdesk Events

### support_ticket Events (in `modules.support_ticket.events`)
- `onTicketCreate`, `onTicketUpdate`, `onTicketDelete`
- `onTimeEntryCreate`, `onTimeEntryUpdate`, `onTimeEntryDelete`
- `onTicketFieldCreate`, `onTicketFieldDelete`
- `onConversationCreate`, `onConversationUpdate`, `onConversationDelete`
- `onCannedResponseCreate`, `onCannedResponseUpdate`, `onCannedResponseDelete`

### support_contact Events (in `modules.support_contact.events`)
- `onContactCreate`, `onContactUpdate`, `onContactDelete`

### support_company Events (in `modules.support_company.events`)
- `onCompanyCreate`, `onCompanyUpdate`, `onCompanyDelete`

### support_agent Events (in `modules.support_agent.events`)
- `onAgentCreate`, `onAgentUpdate`, `onAgentDelete`
- `onAgentStatusCreate`, `onAgentStatusUpdate`, `onAgentStatusDelete`
- `onAgentAvailabilityUpdate`
- `onGroupCreate`, `onGroupUpdate`, `onGroupDelete`

## Freshservice Events

### service_ticket Events (in `modules.service_ticket.events`)
- Similar to support_ticket events (check platform docs for complete list)

### service_asset Events (in `modules.service_asset.events`)
- Asset-specific events

### service_change Events (in `modules.service_change.events`)
- Change-specific events

### service_user Events (in `modules.service_user.events`)
- `onUserCreate`, `onUserUpdate`, `onUserDelete`

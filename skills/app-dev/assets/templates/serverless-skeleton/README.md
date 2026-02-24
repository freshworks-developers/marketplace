# Serverless App Skeleton

Freshworks Platform 3.0 serverless app template for event handlers and remote requests (no frontend UI).

## Project Structure

```
serverless-skeleton/
├── README.md
├── config/
│   └── iparams.json           # Installation parameter config
├── manifest.json              # Project manifest
├── .fdk/
│   └── configs.json          # FDK configuration
└── server/                    # Business logic for remote request and event handlers
    ├── lib/
    │   └── handle-response.js
    ├── server.js
    └── test_data/
        ├── common/            # Product-agnostic events
        │   ├── afterAppUpdate.json
        │   ├── onAppInstall.json
        │   ├── onAppUninstall.json
        │   ├── onExternalEvent.json
        │   └── onScheduledEvent.json
        └── support_ticket/    # Freshdesk-specific events
            ├── onCannedResponseCreate.json
            ├── onCannedResponseDelete.json
            ├── onCannedResponseUpdate.json
            ├── onConversationCreate.json
            ├── onConversationDelete.json
            ├── onConversationUpdate.json
            ├── onTicketCreate.json
            ├── onTicketDelete.json
            ├── onTicketFieldCreate.json
            ├── onTicketFieldDelete.json
            ├── onTicketFieldUpdate.json
            ├── onTicketUpdate.json
            ├── onTimeEntryCreate.json
            ├── onTimeEntryDelete.json
            └── onTimeEntryUpdate.json
```

## Running Locally

```bash
fdk run
```

## Validation

```bash
fdk validate
```

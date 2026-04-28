# AI Actions App

A Freshworks marketplace app that provides AI actions for external API integration.

## Features

- **Get Resource** - Retrieve resource details by ID
- **Create Resource** - Create new resources in the external system
- **Bearer Token Authentication** - Secure API authentication

## Setup

1. Install the app in your Freshworks product
2. Configure credentials in app settings:
   - API Key
   - API Base URL (e.g., api.example.com)

## Actions Available

- `getResource` - Retrieve a resource by ID
- `createResource` - Create a new resource

## Testing

```bash
cd <app-directory>
fdk run
```

Open https://localhost:10001/web/test, select type "actions", and test each action.

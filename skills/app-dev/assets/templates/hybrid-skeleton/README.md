# Hybrid App Skeleton

Freshworks Platform 3.0 hybrid app template combining frontend UI with backend Server Method Invocation (SMI).

## Structure

```
hybrid-skeleton/
├── app/                      # Frontend
│   ├── index.html           # UI with Crayons components
│   ├── scripts/app.js       # Frontend logic (calls SMI)
│   └── styles/
│       ├── style.css
│       └── images/icon.svg
├── server/
│   └── server.js            # Backend SMI functions
├── config/
│   ├── iparams.json         # Installation parameters
│   └── requests.json        # External API request templates
└── manifest.json            # App configuration

```

## Features

- **Frontend**: UI with button to trigger backend call
- **Backend**: SMI function that calls external API
- **Request Templates**: Secure API calls with iparams
- **Crayons UI**: Modern Freshworks Design System components

## Usage

1. Update `manifest.json` with your product module (e.g., `service_ticket` for Freshservice)
2. **Configure installation parameters** (choose ONE):
   - Keep `config/iparams.json` for default Settings form (recommended), OR
   - Replace with `config/iparams.html` + `config/assets/iparams.js` for custom Settings UI
3. Define API calls in `config/requests.json`
4. Implement business logic in `server/server.js`
5. Update frontend in `app/` as needed

## Running Locally

```bash
fdk run
```

## Validation

```bash
fdk validate
```

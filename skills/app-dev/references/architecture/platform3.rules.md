# Platform 3.0 Rules

## Execution Model

- Frontend: app.js executes in browser iframe context
- Backend: server.js executes in Node.js runtime
- No shared memory between frontend and backend
- Frontend communicates with backend via client.request.invoke()
- Backend communicates with frontend via callback responses
- Each request/response is stateless
- No persistent connections between frontend and backend

## Lifecycle

- App installation: manifest.json validated, iparams collected
- App initialization: app.js loaded in iframe, server.js loaded in runtime
- Request flow: frontend → client.request.invoke() → backend handler → response → frontend
- App uninstallation: cleanup handlers execute, resources released
- No global state persists across requests
- Each request creates new execution context

## Invocation Boundaries

- Frontend cannot access Node.js APIs (fs, http, etc.)
- Backend cannot access DOM APIs (window, document, etc.)
- Frontend cannot directly call external APIs (use backend proxy)
- Backend must use client.request.invoke() for external HTTP calls
- Frontend console.log() outputs to browser DevTools only
- Backend console.log() outputs to terminal/fdk logs only
- No cross-boundary variable access
- No cross-boundary function calls

## Logging Rules

- Frontend logs: visible in browser DevTools console only
- Backend logs: visible in terminal when running `fdk run`
- Terminal shows backend logs only
- Browser DevTools shows frontend logs only
- No log forwarding between boundaries
- Backend logs include request context automatically
- Frontend logs include iframe context automatically
- Log levels: error, warn, info, debug (backend only)

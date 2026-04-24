# Playbook: Slack Incoming Webhook (hybrid, no OAuth)

**Use when:** posting a JSON message to Slack from a Freshdesk sidebar app using a **fixed Incoming Webhook** (secret URL path stored as **secure iparam** — not OAuth).

## 1. `manifest.json` (excerpt)

`modules.common.requests` + `modules.common.functions` + `support_ticket` location (same shape as `assets/templates/hybrid-skeleton/manifest.json`). Add product **events** only if you need automatic posts (e.g. `onTicketCreate` under `modules.support_ticket.events`).

## 2. `config/iparams.json`

```json
{
  "slack_webhook_path": {
    "display_name": "Slack webhook path",
    "description": "Path only: /services/T000/B000/XXXXXXXXXXXXXXXXXXXXXXXX from the Incoming Webhook URL (host is always hooks.slack.com).",
    "type": "text",
    "required": true,
    "secure": true
  }
}
```

## 3. `config/requests.json`

```json
{
  "postSlackIncomingWebhook": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "hooks.slack.com",
      "path": "<%= iparam.slack_webhook_path %>",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
```

Declare `postSlackIncomingWebhook` under `modules.common.requests` in the manifest.

## 4. `server/server.js` (SMI pattern)

```javascript
exports = {
  notifySlack: async function(args) {
    const text = args.text || 'Hello from Freshworks';

    try {
      const response = await $request.invokeTemplate('postSlackIncomingWebhook', {
        context: {},
        body: JSON.stringify({ text: text })
      });

      renderData(null, { success: true, response: response.response });
    } catch (error) {
      console.error('Slack webhook error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

## 5. Frontend

`client.request.invoke('notifySlack', { text: 'Ticket updated' })` from `app/scripts/app.js` (see `assets/templates/hybrid-skeleton/app/scripts/app.js`).

## 6. Validation notes

- `path` must start with `/`; **host** is FQDN only (`hooks.slack.com`).
- Every template key exists in manifest `modules.common.requests`.
- No `async` without `await`; complexity ≤ 7; helpers **after** `exports`.
- **Non-empty iparams** → include `onAppInstall` / handlers per **SKILL.md**.

## 7. Optional: `onTicketCreate`

Add under `modules.support_ticket.events` → handler calls the same `invokeTemplate` with text built from `args.data` (see `references/test-payloads/server/test_data/support_ticket/` for sample envelope shape). For payload nuance, load `references/events/onTicketUpdate-payload-contract.md` if you later switch to `onTicketUpdate`.

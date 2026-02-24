>title: check if my manifest is correct
>tags: manifest-errors
>context: app.js, server.js
>code:

# check if my manifest is correct

If your manifest follows a similar syntax as given below, then it is correct.

```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "location": {
        "ticket_sidebar": {
          "url": "template.html",
          "icon": "logo.svg"
        }
      },
      "requests": {
        "createTicket": {},
        "getTickets": {}
      }
    }
  },
  "engines": {
    "node": "18.17.1",
    "fdk": "9.0.4"
  }
}
```
---

>title: Request template 'fetchAgentInfo' is not defined in manifest.json
>tags: manifest-errors
>context: app.js, server.js
>content:

# Request template 'fetchAgentInfo' is not defined in manifest.json

Request templates need to be declared in manifest.json as shown below

```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "location": {
        "ticket_sidebar": {
          "url": "template.html",
          "icon": "logo.svg"
        }
      },
      "requests": {
        "createTicket": {},
        "getTickets": {}
      }
    }
  },
  "engines": {
    "node": "18.17.1",
    "fdk": "9.0.4"
  }
}
```
---

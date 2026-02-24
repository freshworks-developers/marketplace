>title: what is call module in Freshcaller
>tags: module=call, call, freshcaller
>context:
>content:

# what is call module in Freshcaller

Call Module Usage: Call Module Usage is allowed for following subscriptions

**Subscription Types**

1.  A stand-alone Freshcaller subscription.
2.  A Freshsales suite subscription with:
    a. Freshsales Classic
    b. Freshchat
    c. Freshcaller.
3.  A Freshsales suite subscription with:
    a. Freshchat.
4.  A Freshsales suite subscription with:
    a. Freshcaller.
5.  A Freshsales suite subscription with:
    a. Freshsales Classic.

**App Types**

It Allows users to build only Serverless apps.

---

>title: what are the serverless events supported by call module of Freshcaller
>tags: module=call, call, freshcaller, serverless_events
>context:
>content:

# what are the serverless events supported by call module of Freshcaller

Supported Events

An app built for this module can react to the following events:

**Common events**

In the app manifest, configure these events at `modules.common`.

1.  App set-up events
    a. `onAppInstall`
    b. `afterAppUpdate`
    c. `onAppUninstall`
2.  External events
    a. `onAppInstall`
    b. `onExternalEvent`
    c. `onAppUninstall`
3.  Scheduled events

**Product-specific events**

In the app manifest, configure these events at `modules.call`.

1. `onCallCreate`
2. `onCallUpdate`

---

>title: how to configure product events supported by call module of Freshcaller
>tags: module=call, call, freshcaller, product_events
>context: manifest.json, server.js
>content:
>code:

# how to configure product events supported by call module of Freshcaller

Steps to Configure Product Events

Step 1: Subscribe to an Event**

Subscribe to an event by configuring an event listener in `manifest.json`:

```js
{
  "events": {
    "<productEventName>": {
        "handler": "<eventCallbackMethod>"
    }
  }
}

```

**Step 2: Define Callback in `server.js`**

In `server.js` file under the exports block, enter the callback function definition as follows:

```js
exports = {
// args is a JSON block containing the payload information
// args["iparam"] will contain the installation parameter values
//eventCallbackMethod is the call-back function name specified in manifest.json
eventCallbackMethod: function(args) {
  console.log("Logging arguments from the event: " + JSON.stringify(payload));
}};

```

**Step 3: Use the Appropriate Payload Attribute for Callback**

Use the appropriate payload attribute for callback with below syntax:

```js
{
  "currentHost": {
    "subscribed_modules": [ "call" ],
    "endpoint_urls": {
      "freshcaller": "value"
    }
  },
  "data" : {
    //Contains the list of objects related to the event.
  },
  "event"  : "value",
  "iparams" : {
      "Param1" : "value",
      "Param2" : "value"
  },
  "region"  : "value",
  "timestamp"  : "value"
}

```

---
>title: how to configure events supported by call module of Freshcaller
>tags: module=call, call, freshcaller, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by call module of Freshcaller

Steps to Configure Call Events

**Step 1: Subscribe to Call Event**

Subscribe to call by configuring an event listener in `manifest.json`:

```js
{
  "events": {
    "onCallCreate": {
      "handler": "onCallCreateCallback"
    }
  }
}

```

**Step 2: Define Callback in `server.js`**

In `server.js` file under the exports block, enter the callback function definition as follows:

```js
exports = {
  onCallCreateCallback: function(payload) {
    console.log("Logging arguments from onCallCreate event: " + JSON.stringify(payload));
  }
}

```

**Step 3: Use the Appropriate Payload Attribute for Callback**

Use the appropriate payload attribute for callback with below syntax:

```js
{
  "currentHost": {
    "subscribed_modules": [
      "call", "caller_conversation"
    ],
    "endpoint_urls": {
      "freshcaller": "https://subdomain.freshcaller.com"
    }
  },
  "data": {
    "actor": {
      "type": "system"
    },
    "associations": {},
    "call": {
      "assigned_agent_id": 139694,
      "id": 135,
      "parent_call_id": null,
      "participants": [
        {
          "call_id": 135,
          "caller_id": 7994085,
          "caller_number": "+11234568791",
          "id": 321
        },
        {
          "call_id": 135,
          "id": 322,
          "participant_id": 694,
          "participant_type": "Agent",
          "updated_time": "2020-03-10T11:28:05.000Z"
        }
      ],
      "phone_number": "+12133701559",
      "phone_number_id": 46851
    }
  },
  "event": "onCallCreate",
  "region": "US",
  "timestamp": 1583839686
}

```

---

>title: what are the REST APIs supported by call module of Freshcaller
>tags: module=call, call, freshcaller, rest_api
>context:
>content:

# what are the REST APIs supported by call module of Freshcaller

Supported APIs

The Freshcaller Call module supports following APIs

-  `GET /api/v1/calls`
-  `GET /api/v1/calls/{call_id}` 
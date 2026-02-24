>title: what is caller agent module in Freshsales Suite
>tags: module=caller_agent, module=caller_agent, caller_agent, freshcaller
>context:
>content:

# What is caller agent module in Freshsales Suite

Caller Agent Module Usage is allowed for following subscriptions

## Subscription options

1. A stand-alone Freshcaller subscription.
2. A Freshsales suite subscription with:
   - Freshsales Classic  
   - Freshchat  
   - Freshcaller.
3. A Freshsales suite subscription with:
   -. Freshchat.
4. A Freshsales suite subscription with:
   - Freshcaller.
5. A Freshsales suite subscription with:
   - Freshsales Classic.

It Allows users to build only Serverless apps.

---
>title: what are the serverless events supported by caller agent module of Freshsales Suite
>tags: module=caller_agent, caller_agent, freshcaller, serverless_events
>context: manifest.json
>content:

# What are the serverless events supported by caller agent module of Freshsales Suite

An app built for this module can react to the following events.

## Common events  
In the app manifest, configure these events at `modules.common`.

## App set-up events 
1. `onAppInstall`  
2. `afterAppUpdate`  
3. `onAppUninstall`

## External events
1. `onAppInstall`  
2. `onExternalEvent`  
3. `onAppUninstall`

## Scheduled events

## Product-specific events 
In the app manifest, configure these events at `modules.caller_agent`.  
- `onAgentUpdate`

---
>title: how to configure product events supported by caller agent module of Freshsales Suite
>tags: module=caller_agent, caller_agent, freshcaller, product_events
>context: manifest.json, server.js
>content:

# How to configure product events supported by caller agent module of Freshsales Suite

## Summary of steps 
- Subscribe to an event by configuring an event listener in `manifest.json`.  
- Enter the callback function definition in `server.js`.  
- Use the appropriate payload attribute for callback.

### Step 1: Subscribe to an event

In `manifest.json`:

```json
"events": {
  "<productEventName>": {
      "handler": "<eventCallbackMethod>"
  }
}
```

### Step 2: In `server.js` file under the exports block, enter the callback function definition as follows:

In server.js under the exports block:

```js
  exports = {
  // args is a JSON block containing the payload information
  // args["iparam"] will contain the installation parameter values
  //eventCallbackMethod is the caller_agent-back function name specified in manifest.json
  eventCallbackMethod: function(args) {
    console.log("Logging arguments from the event: " + JSON.stringify(payload));
  }};
```

### Step 3: Use the appropriate payload attribute for callback with below syntax

```json
{
  "currentHost": {
    "subscribed_modules": [ "caller_agent" ],
    "endpoint_urls": {
      "freshcaller": "value"
    }
  },
  "data" : {
    //Contains the list of objects related to the event
  },
  "event"  : "value",
  "iparams" : {
      "Param1" : "value",
      "Param2" : "value"
  },
  "region"  : "value",
  "timestamp"  : "value",
}
```

---
>title: how to configure events supported by caller agent module of Freshsales Suite
>tags: caller_agent, freshcaller, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by caller agent module of Freshsales Suite

## In `manifest.json`: 

- Subscribe to caller_agent by configuring an event listener 
  ```json
  "events": {
    "onAgentUpdate": {
      "handler": "onAgentUpdateCallback"
    }
  }
  ```
## In `server.js` file :
- Under the exports block, enter the callback function definition as follows:

 ```js
  exports = {
    onAgentUpdateCallback: function(payload) {
      console.log("Logging arguments from onAgentUpdate event: " + JSON.stringify(payload));
    }
  }
  ```
## Use the appropriate payload attribute for callback with below syntax

  ```json
  {
    "currentHost":{
      "subscribed_modules": [
        "caller_agent"
      ],
      "endpoint_urls": {
        "freshcaller": "https://subdomain.freshcaller.com"
      }
    },
    "data": {
      "actor": {
        "account_id": 682861,
        "agent": {},
        "id": 856523,
        "uuid": "389398835151017469"
      },
      "agent": {
        "account_id": 682861,
        "id": 787096,
        "user_id": 856523
      },
      "associations": {},
      "changes": {
        "model_changes": {}
      }
    },
    "event": "onAgentUpdate",
    "region": "US",
    "timestamp": 1583839672,
    "version": "2.0"
  }
  ```


---
>title: what are the REST APIs supported by caller agent module of Freshsales Suite
>tags: module=caller_agent, caller_agent, freshcaller, rest_api
>context:
>content:

# What are the REST APIs supported by caller agent module of Freshsales Suite

The Freshcaller Caller Agent module supports following APIs:

- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/users/{user_id}`
- `PUT /api/v1/users/{user_id}`
- `GET /api/v1/user_statuses`

---
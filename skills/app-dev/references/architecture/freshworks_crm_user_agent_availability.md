>title: what is user agent availability module in Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm
>context: 
>content:

# what is user agent availability module in Freshsales Suite

User Agent Availability Module allows users to build Serverless apps alone. Its usage is allowed for following subscriptions:
1. A Freshsales suite subscription with:
   1. Freshsales Classic
   2. Freshchat
   3. Freshcaller.
2. A Freshsales suite subscription with:
   1. Freshchat.
3. A Freshsales suite subscription with:
   1. Freshcaller.
4. A Freshsales suite subscription with:
   1. Freshsales Classic.

---

>title: what are the placeholders supported for user agent availability module in Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm
>context: manifest.json
>content:

# what are the placeholders supported for user agent availability module in Freshsales Suite

It supports following Common placeholders. In the app manifest, configure these placeholders at `modules.common`.
1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

---

>title: how to use placeholders supported for user agent availability module in Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm
>context: manifest.json
>content:

# how to use placeholders supported for user agent availability module in Freshsales Suite

The user agent availability module doesn't support building frontend or full stack apps hence there are no placeholders available for the module. However, other modules can be used along with it.
To use the module modify your `manifest.json` as below:
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "events": {
        "onAppInstall": {
          "handler": "onAppInstallHandler"
        },
        "onExternalEvent": {
          "handler": "onExternalEventHandler"
        }
      }
    },
    "user_agent_availability": {
      "events": {
        "onUserAgentAvailabilityUpdate": {
          "handler": "onUserAgentAvailabilityUpdateHandler"
        }
      }
    }
  },
  "engines": {
    "node": "18.20.3",
    "fdk": "9.3.1"
  }
}
```
---

>title: what are data methods supported for user agent availability module in Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm, data_method
>context: 
>content:

# what are data methods supported for user agent availability module in Freshsales Suite

Since the module doesn't support frontend apps no data methods are available.

---

>title: what are events methods supported for user agent availability module in Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm, events_method
>context: 
>content:

# what are events methods supported for user agent availability module in Freshsales Suite

Since the module doesn't support frontend apps no events methods are available.

---

>title: what are interface methods supported for user agent availability module in Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm, interface_method
>context:
>content:

# what are interface methods supported for user agent availability module in Freshsales Suite

Since the module doesn't support frontend apps no events methods are available.

---

>title: how to use instance methods supported for user agent availability module in Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm, instance_methods
>context: 
>content:

# what are instance methods supported for user agent availability module in Freshsales Suite

Since the module doesn't support frontend apps no events methods are available.

---

>title: what are the serverless events supported by user agent availability module of Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm, serverless_events
>context: manifest.json, server.js
>content:

# what are the serverless events supported by user agent availability module of Freshsales Suite

An app built for this module can react to the following events:
1. Common events: In the app manifest, configure these events at `modules.common`.
   1. App set-up events
      1. `onAppInstall`
      2. `afterAppUpdate`
      3. `onAppUninstall`
   2. External events
      1. `onAppInstall`
      2. `onExternalEvent`
      3. `onAppUninstall`
   3. Scheduled events
2. Product-specific events: In the app manifest, configure these events at `modules.user_agent_availability`.
   1. `onUserAgentAvailabilityUpdate`

---

>title: how to configure product events supported by user agent availability module of Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by user agent availability module of Freshsales Suite

## Steps:
### Step 1: Subscribe to an event by configuring an event listener in `manifest.json`:
  ```json
    {
    "events": {
        "<productEventName>": {
            "handler": "<eventCallbackMethod>"
        }
      }
    }
  ```
### Step 2: In `server.js` file under the exports block, enter the callback function definition as follows:
```js
  exports = {
  // args is a JSON block containing the payload information
  // args["iparam"] will contain the installation parameter values
  //eventCallbackMethod is the call-back function name specified in manifest.json
  eventCallbackMethod: function(args) {
    console.log("Logging arguments from the event: " + JSON.stringify(payload));
  }};
```
### Step 3: Use the appropriate payload attribute for callback with below syntax:
```json
{
  "currentHost": {
    "subscribed_modules": [ "useragentavailability" ],
    "endpoint_urls": {
      "freshworks_crm": "value"
    }
  },
  "data" : {
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
>title: how to configure events supported by user agent availability module of Freshsales Suite
>tags: module=user_agent_availability, user_agent_availability, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by user agent availability module of Freshsales Suite

## Steps:

### Step 1. Subscribe to task by configuring an event listener in `manifest.json`:
  
  ```json
  {
    "events": {
    "onUserAgentAvailabilityUpdate": {
      "handler": "onUserAgentAvailabilityUpdateCallback"
    }
  }
  }
  ```

### Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

  ```js
  exports = {
    onUserAgentAvailabilityUpdateCallback: function(payload) {
      console.log("Logging arguments from onUserAgentAvailabilityUpdateCallback event: " + JSON.stringify(payload));
    }
  }
  ```

### Step 3. Use the appropriate payload attribute for callback with below syntax:

```json
{
  "currentHost": {
    "subscribed_modules": [ "useragentavailability" ],
    "endpoint_urls": {
      "freshworks_crm": "https://sample.myfreshworks.com",
      "freshsales": "https://sample.freshsales.io"
    }
  },
    "data": {
      "actor": {
          "id": "132",
          "name": "Abu Khan",
          "type": "agent"
      },
      "associations": {},
      "changes": {
          "channel_preferences": {
              "changed": [
                  [
                      {
                        "available": false,
                        "channel": "chat",
                        "enabled": true
                      },
                      {
                          "available": true,
                          "channel": "chat",
                          "enabled": true
                      }
                  ],
                  [
                      {
                          "available": false,
                          "channel": "freshsales",
                          "enabled": true
                      },
                      {
                          "available": true,
                          "channel": "freshsales",
                          "enabled": true
                      }
                  ]
                ]
            }
      },
      "user_agent_availability": {
          "channel_preferences": [
              {
                  "available": true,
                  "channel": "chat",
                  "enabled": true
              },
              {
                  "available": true,
                  "channel": "freshsales",
                  "enabled": true
              }
          ],
          "user_information": [
              {
                  "account_id": 1712320639099,
                  "email": "abuthahir.sulaiman@freshworks.com",
                  "name": "Abu Khan",
                  "updated_at": "2024-08-12T09:05:36.683Z",
                  "user_id": 132
              }
          ],
          "user_uuid": "697330448392323085"
        }
    },
  "event": "onUserAgentAvailabilityUpdate",
  "iparams": {},
  "region": "US",
  "timestamp": 1593007407.3063838,
  "version": "2.0"
}
```

---
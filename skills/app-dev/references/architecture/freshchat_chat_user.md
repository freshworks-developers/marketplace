>title: what is caller agent module in Freshsales Suite
>tags: module=chat_user, chat_user, freshchat
>context: 
>content:

# What is caller agent module in Freshsales Suite

Caller Agent Module Usage is allowed for following subscriptions:

## Allowed Subscriptions:
1. A stand-alone Freshchat subscription.
2. A Freshsales suite subscription with:
   - Freshsales Classic
   - Freshchat
   - Freshcaller.
3. A Freshsales suite subscription with:
   - Freshchat.
4. A Freshsales suite subscription with:
   - Freshcaller.
5. A Freshsales suite subscription with:
   - Freshsales Classic.

## Additional Information:
It allows users to build only Serverless apps.

---

>title: what are the serverless events supported by caller agent module of Freshsales Suite
>tags: module=chat_user, chat_user, freshchat, serverless_events
>context: manifest.json
>content:

# What are the serverless events supported by caller agent module of Freshsales Suite

An app built for this module can react to the following events:

## Common Events:
In the app manifest, configure these events at `modules.common`.
1. App set-up events
   - `onAppInstall`
   - `afterAppUpdate`
   - `onAppUninstall`
2. External events
   - `onAppInstall`
   - `onExternalEvent`
   - `onAppUninstall`
3. Scheduled events

## Product-Specific Events:
In the app manifest, configure these events at `modules.chat_user`.
1. `onUserCreate`
2. `onUserUpdate`

---

>title: how to configure product events supported by caller agent module of Freshsales Suite
>tags: module=chat_user, chat_user, freshchat, product_events
>context: manifest.json, server.js
>content:

# How to configure product events supported by caller agent module of Freshsales Suite

## Steps:
1. Subscribe to an event by configuring an event listener in `manifest.json`:
    ```json
    {
      "events": {
        "<productEventName>": {
            "handler": "<eventCallbackMethod>"
        }
      }
    }
    ```
2. Define the callback function in `server.js` file under the exports block:
    ```javascript
    exports = {
      // args is a JSON block containing the payload information
      // args["iparam"] will contain the installation parameter values
      // eventCallbackMethod is the chat_user-back function name specified in manifest.json
      eventCallbackMethod: function(args) {
        console.log("Logging arguments from the event: " + JSON.stringify(payload));
      }
    };
    ```
3. Use the appropriate payload attribute for the callback:
    ```json
    {
      "currentHost": {
        "subscribed_modules": [ "chat_user" ],
        "endpoint_urls": {
          "freshchat": "value"
        }
      },
      "data": {
        // Contains the list of objects related to the event.
      },
      "event": "value",
      "iparams": {
          "Param1": "value",
          "Param2": "value"
      },
      "region": "value",
      "timestamp": "value"
    }
    ```

---

>title: how to configure events supported by caller agent module of Freshsales Suite
>tags: module=chat_user, chat_user, freshchat, product_events
>context: manifest.json, server.js
>content:

# How to configure events supported by caller agent module of Freshsales Suite

## Steps:
1. Subscribe to chat_user by configuring an event listener in `manifest.json`:
    ```json
    {
      "events": {
        "onUserCreate": {
          "handler": "onUserCreateCallback"
        }
      }
    }
    ```
2. Define the callback function in `server.js` file under the exports block:
    ```javascript
    exports = {
      onUserCreateCallback: function(payload) {
        console.log("Logging arguments from onUserCreateCallback event: " + JSON.stringify(payload));
      }
    };
    ```
3. Use the appropriate payload attribute for the callback:
    ```json
    {
      "currentHost": {
        "subscribed_modules": [ "chat_user" ],
        "endpoint_urls": {
          "freshchat": "https://sample.myfreshworks.com"
        }
      },
      "data": {
        "actor": {},
        "associations": {},
        "user": {
          "avatar": {
            "url": "https://s3.amazonaws.com/fresh-chat-names/img/john_doe.png"
          },
          "created_time": "2019-07-29T14:51:56.933Z",
          "email": "john.doe@gmail.com",
          "first_name": "John",
          "id": "b3c2c92e-d650-4c40-bb7d-aeb3423cd4d2",
          "last_name": "Doe",
          "phone": "9876543212",
          "properties": [
            {
              "name": "plan",
              "value": "Estate"
            }
          ],
          "reference_id": "john.doe.198"
        }
      },
      "event": "onUserCreate",
      "region": "US",
      "timestamp": 1571036504512,
      "version": "1.0.0"
    }
    ```

---

>title: what are the REST APIs supported by caller agent module of Freshsales Suite
>tags: module=chat_user, chat_user, freshchat, rest_api
>context: 
>content:

# What are the REST APIs supported by caller agent module of Freshsales Suite

The Freshchat Caller Agent module supports the following APIs:

## Supported APIs:
- `POST /users`
- `GET /users`
- `POST /users/fetch`
- `GET /users/{user_id}`
- `PUT /users/{user_id}`
- `DELETE /users/{user_id}`
- `GET /v2/users/{user_id}/conversations`
---


>title: How to use External Events in Freshworks Global app
>tags: external-events, serverless, webhooks, integration
>context: manifest.json, server.js
>content:

# How to use External Events in Freshworks Global app
External events are events that occur in an external product or a third-party service. External events enable developers to create serverless apps that can consume events from third-party services. This integration enables developers to build apps that can subscribe to external events and create tickets, contacts, or any other resource in Freshworks products. 

## Steps to use External Events
1. Generate a target URL - link to where the app receives webhook data.
2. Create a webhook in the external product or service, to subscribe to external events. When creating a webhook specify the target URL for the webhook to send data.
3. Configure event listeners in the `manifest.json` file. When an external event occurs, the webhook uses the target URL, notifies the app about the external event, and sends data to the app event listener that invokes a callback method.
4. The app logic in the callback method defined in `server.js`, runs with the help of the event-specific payload passed to the callback method.
5. The generateTargetUrl() method is supported only in `onAppInstall()` and product event callbacks.

---
>title: Considerations for External Events
>tags: external-events, serverless, webhooks, integration
>context: 
>content:

# Considerations for External Events

## Important Points
1. The rate limit for external events is 250 triggers per minute.
2. The app execution timeout is 20 seconds.
3. The serverless environment supports webhook data (incoming content) whose content type is one of the following:
   - `application/json`
   - `application/xml`
   - `text/xml`
   - `application/x-www-form-urlencoded`
4. You can register multiple webhooks. But, events from all the webhook URLs of the app will receive the response in the same handler method.

---
>title: How to generate webhook URL for External Events in Freshworks Global app
>tags: external-events, serverless, webhooks, integration
>context: manifest.json, server.js
>content:

# How to generate webhook URL for External Events in Freshworks Global app

## Steps to generate and register a webhook URL
1. Navigate to the `manifest.json` file. 
2. Subscribe to the onAppInstall event by using the following sample `manifest.json` content
   ```json
    {
      "modules": {
        "common": {
          "events": {
            "onAppInstall": {
              "handler": "onAppInstallCallback"
            }
          }
        }
      }
    }
   ```
3. Navigate to the `server.js`. In the callback method for the `onAppInstall` event, do the following:
   - Include the generateTargetUrl() method. The webhook URL generated is unique for each app installation.
   - Include an API request to the external product, for webhook registration. In the API request, ensure to specify the authorization mechanism (Basic) and the JSON object that the external product requires to successfully register the webhook.
   ```js
   exports = {
     onAppInstallHandler: function(payload) {
       generateTargetUrl()
       .then(function(url) {
         //Include API call to the third party to register your webhook
       },
       function(err) {
         // Handle error
       });
     }
   };
   ```
4. Upon successful registration, the external product sends a webhook id. Store this id to enable webhook deregistration when the app is uninstalled.

---
>title: How to configure the External Event in Freshworks Global app
>tags: external-events, serverless, webhooks, integration
>context: manifest.json, server.js
>content:

# How to configure the External Event in Freshworks Global app

## Steps to register an external event and the corresponding handler
1. From your app’s root directory, navigate to the `manifest.json` file.
2. In the modules.common.events object, specify the external event and the corresponding callback method.
   ```json
    {
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
        }
      }
    }
   ```
3. Navigate to the `server.js` file
4. In the `exports` block, enter the callback function definition as follows:
   ```js
   exports = {
     onAppInstallHandler: function(payload) {
       generateTargetUrl()
         .then(function(url) {
           //API call to the external product to register the webhook.
       })
         .fail(function(err) {
           // Handle error
       });
     },
     onExternalEventHandler: function(payload) {
       //This is the callback function definition.
       //Include the logic to perform any action.
       console.log("Logging arguments from the event:" + JSON.stringify(payload));
     }
   }
   ```

---
>title: payload description for External Events in Freshworks Global app
>tags: external-events, serverless, webhooks, integration
>context: 
>content:

# payload description for External Events in Freshworks Global app

## Example payload for an external event
```json
{
  "currentHost": {
    "endpoint_urls": {
      "<product_name>": "value"
    },
    "subscribed_modules": [
      "value"
    ]
  },
  "data": {
    //Contains the list of objects related to the event.
  },
  "event": "onExternalEvent",
  "headers": {
    "Content-Type": "value"
  },
  "iparams": {
    "param1" : "value",
    "param2" : "value"
  },
  "options": "value",
  "region": "value",
  "timestamp": "value"
}
```

## Payload attributes description
1. `currentHost` (object) - A global app, with module-specific app logic, can be deployed on various Freshworks products. It contains information pertaining to the Freshworks product on which the app is currently running.
   - `endpoint_urls` (object) - Product name and account URL (domain name) of the host where the app can access the product resources, specified as a key (product name) - value (account URL) pairs. You can use the domain name to construct API calls that can access product resources.
   - `subscribed_modules` (array of strings) - All modules that the app user has subscribed to and present in the app manifest.
2. `data` (object) - Event-specific webhook data, specified as a JSON object of `<key>:<value>` pairs.
3. `event` (string) - Identifier of the event - onExternalEvent.
4. `headers` (object) - Headers associated with the webhook data, specified as a JSON object of `<header parameter name>:<header parameter value>` pairs.
5. `iparams` (object) - Installation parameters specified as a JSON object of `<parameter name>: <parameter value>` pairs.
6. `region` (string) - Region where the Freshworks product account is deployed. Possible values: US, EU, EUC, AUS, and IND.
7. `timestamp` (number) - Timestamp of when the external event occurs, specified in the epoch format.

---
>title: payload example for External Events in Freshworks Global app
>tags: external-events, serverless, webhooks, integration
>context: 
>content:

# payload example for External Events in Freshworks Global app

## Example payload for external event
```json
{
  "currentHost": {
    "endpoint_urls": {
      "freshsales": "https://subdomain.freshworks.com",
      "freshworks_crm": "https://subdomain.myfreshworks.com"
    },
    "subscribed_modules": [ "deal" ]
  },
  "data": {
    "call": {
      "id": 123456,
      "phone_number": "+1234567891"
    }
  },
  "event": "onExternalEvent",
  "headers": {
    "Content-Type": "application/json"
  },
  "iparams": {},
  "region": "US",
  "timestamp": 1496400354326
}
```

---
>title: how to deregister for External Events in Freshworks Global app
>tags: external-events, serverless, webhooks, integration
>context: manifest.json, server.js
>content:

# how to deregister for External Events in Freshworks Global app

## Steps to automatically deregister a webhook
1. From the app’s root directory, navigate to the manifest.json file.
2. Subscribe to the `onAppUninstall` event by using the following sample `manifest.json` content:
   ```json
    {
      "modules": {
        "common": {
          "events": {
            "onAppInstall": {
              "handler": "onAppInstallHandler"
            },
            "onExternalEvent": {
              "handler": "onExternalEventHandler"
            },
            "onAppUninstall": {
              "handler": "onAppUninstallHandler"
            }
          }
        }
      }
    }
   ```
3. Navigate to the `server.js` file.
4. In the callback method associated with the `onAppUninstall` event,
5. Include the mechanism to retrieve the webhook id saved during app installation.
6. Include an API request to the external product, for webhook deregistration.
   ```js
   exports = {
     onAppInstallHandler: function(payload) {
       generateTargetUrl()
         .then(function(url) {
         //API call to the external product to register the webhook.
       })
         .fail(function(err) {
         // Handle error
       });
     },
     onExternalEventHandler: function(payload) {
       //This is the callback function definition.
       //Include the logic to perform any action.
       console.log("Logging arguments from the event:" + JSON.stringify(payload));
     },
     onAppUninstallHandler: function(payload) {
       //Include API call to the external product to deregister the webhook
     }
   }
   ```

---
>title: How to test External Events locally for a global app
>tags: external-events, serverless, webhooks, integration, testing
>context:
>content:

# How to test External Events locally for a global app

## Steps to test External Events locally
1. Launch the app using `fdk run`
2. Navigate to the system settings page at `http://localhost:10001/system_settings`. All modules configured in the App manifest are listed.
3. In the system settings page,
   - Select the modules for which you want to test the app logic. The Enter account URL section is displayed, with a prompt to enter the account URLs for all selected modules.
   - In the Enter account URL section, enter valid account URL(s) for the product(s) to which the selected modules belong.
   - Click Continue.
4. If you have configured installation parameters navigate to `http://localhost:10001/custom_configs`. Enter appropriate values for the installation parameters and click Install.
5. Navigate to `http://localhost:10001/web/test` to test the serverless events that the app uses.
6. From the Select module drop-down, select Common.
7. From the Select an event drop-down, select `onExternalEvent`. The payload for the event is populated on the page.
8. Click Simulate. If the event is successfully simulated, you will see `Success` displayed. The event payload is added to the `<app's root directory>/server/test_data` folder.
9. If there is a problem, you will see `Failed` message displayed. Check if the payload is valid and then resume testing.

---
>title: How to test External Events locally using ngrok
>tags: external-events, serverless, webhooks, integration, testing, ngrok
>context:
>content:

# How to test External Events locally using ngrok

## Testing external events on your computer using ngrok
The FDK uses the node module ngrok to create secure tunnels between a local FDK instance and the ngrok cloud. According to ngrok.io, ngrok exposes local servers behind NATs and firewalls to the Internet, over secure tunnels. The FDK leverages this feature to expose the webhook registered in external products, to test external events app integrations.

## Steps to use ngrok
1. Run `fdk run --tunnel` from app home directory
2. If you have ngrok authorization privileges, run `fdk run --tunnel --tunnel-auth`
3. The tunnel is opened and an appropriate message specifying the URL to test serverless events is displayed.
4. Navigate to `https://localhost:10001/web/test`
5. From the drop-down list, select the `OnAppInstall` event to proceed with webhook registration.
6. Once the webhook is registered, go to a third-party service from where your app must receive external events and trigger an event. The event payload will be received in the app as an argument to the external event.

---

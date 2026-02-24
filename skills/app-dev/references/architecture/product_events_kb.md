>title: Product event handling in FDK
>tags: events, product, serverless 
>context: manifest.json, server.js 
>content:

Freshworks Product events are the events that occur in freshworks product such as ticket creation, ticket updation, creating conversations, etc.
1. `manifest.json` has the eventCallbackMethod which acts as a handler when a product event gets triggered
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "events": {
        "onAppInstall": {
          "handler": "onAppInstallHandler"
        },
        "onAppUninstall": {
          "handler": "onAppUninstallHandler"
        }
      }
    },
    "{productModuleName}": {
      "events": {
        "{eventName}": {
          "handler": "productEventHandlerFunction"
      }
    }
  }
  }
}
```
`{productModuleName}` can be any freshworks modules (e.g., `support_ticket`, `service_ticket`, `deal`, etc.), `{eventName}` with the event name supported for that module (e.g., `onTicketCreate`, `onDealCreate`, etc.), and `{productEventHandlerFunction}` will be a funciton that will handle the product event trigger.

1. Callback method / product event handler function is defined like this in in `server.js`:
```js
exports = {
  someProductEventHandlerFunction: function(payload) {
    // App logic goes here

    // for example
    $request.invokeTemplate('some_request_method_template', {
        // can be any request context}
    });
    // some logic like this if required
    $db.set('some_key', 'some_value');
  }
};
```
The `payload` is a JSON block containing payload information, where `payload["iparams"]` contains the installation parameter values.

1. This is how a basic payload for the product some `productEventHandlerFunction` product event handler will look like, there can be more attributes but these are the basic ones:
```json
{
  "currentHost": {
    "subscribed_modules": [ "value1", "value2" ],
    "endpoint_urls": {
      "<product_name>": "value"
      }
  },
  "data": {
   //Contains the list of objects related to the event.
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
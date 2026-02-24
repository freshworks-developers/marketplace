>title: what is caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller
>context:
>content:

Call Module Usage is allowed for following subscriptions
1. A stand-alone Freshcaller subscription.
2. A Freshsales suite subscription with:
   a. Freshsales Classic
   b. Freshchat
   c. Freshcaller.
3. A Freshsales suite subscription with:
   a. Freshcaller.

It Allows users to build:
- Front-end apps however you cannot build a full-page app.
- Serverless apps.
- Full stack SMI apps however you cannot build a full-page SMI app.

---
>title: what are the placeholders supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller
>context:
>content:

It supports following Module-specific placeholders. In the app manifest, configure these placeholders at `modules.caller_conversation`.
1. Conversation Card as `conversation_card`
2. Widget conversation card as `widget_conversation_card`

---
>title: how to use placeholders supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller
>context:
>code:

To use the supported placeholder modify your `manifest.json` as below 

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "requests": {}
    },
    "caller_conversation": {
      "location": {
        "conversation_card": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "widget_conversation_card": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        }
      }
    }
  }
}
```

---
>title: what are data methods supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, data_method
>context:
>content:

# What are data methods supported for caller conversation module in Freshcaller

You can use the `client.data.get()` data method to retrieve the following objects regardless of the placeholders where the app is deployed

1. `currentHost`
2. `loggedInAgent` - to retrieve information of the agent who is logged into the Freshworks product web UI or widget.
3. `currentCall` - to retrieve information of an on-going call.
4. `currentCaller` - to retrieve information of the current caller.
5. `currentNumber` - to retrieve information of the number from which an outgoing call is made.

---

>title: example of data method usage supported for caller conversation module in Freshcaller 
>tags: module=caller_conversation, caller_conversation, freshcaller
>context:
>code:

# Example of data method usage supported for caller conversation module in Freshcaller

1. To retrieve to retrieve information of an on-going call use

```js
async function getcurrentCallData() {
    try {
      const data = await client.data.get("currentCall");
      // success operation
      //data: {currentCall: {"id": "c2937604-0a08-43c2-a09c-e77f5f565a0e", ...}}
    } catch (error) {
      // failure operation
    }
  }

  getcurrentCallData();

```
2. To retrieve information of the current caller.

```js
async function getcurrentCallerData() {
    try {
      const data = await client.data.get("currentCaller");
      // success operation
      //data: {currentCaller: {"id": "c2937604-0a08-43c2-a09c-e77f5f565a0e", ...}}
    } catch (error) {
       // failure operation
     }
  }

  getcurrentCallerData();
```

---

>title: what are events methods supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, events_method
>context:
>content:

# What are events methods supported for caller conversation module in Freshcaller

The caller conversation module supports following events for `conversation_card` and `widget_conversation_card` placeholders

1. Click events
`call.holdToggled` - When an agent holds or releases a call.
`call.muteToggled` - When an agent mutes or unmutes a call.
`call.recordingStarted` - When an agent manually starts call recording. 
`call.recordingPaused` - When an agent pauses call recording.
`call.recordingResumed` - When an agent resumes call recording.

2. Change events
`agent.statusChanged` - When an agent's status is changed.
`call.ended` - When a call is disconnected.
`call.contactEdited` - When an agent links another contact to a current call.
`call.linkedToAnotherContact` - When an agent links another contact to a current call

3. Intercept events
`call.saveAndClose` - When an agent clicks the Save and close button.

---

>title: how to use events methods supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, events_method
>context:
>content:

# How to use events methods supported for caller conversation module in Freshcaller

To enable your app to react to front-end events, in the app.js file,

1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization,
  a. Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs. 
  b. Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

> code:

1. To enable your app to react to a user's click that puts a call on hold or releases a call on hold.
```js
{
      //Configure event listener and subscribe to event
      //Register callback
      client.events.on("call.holdToggled", eventCallback);
      var eventCallback = function (event) {
        //Retrieve event data
        var data = event.helper.getData();
        // App logic
      };
    }
  ```

2. to enable your app to react to a user's click that starts call recording.

```js
{
      //Configure event listener and subscribe to event
      //Register callback
      client.events.on("call.recordingStarted", eventCallback);
      var eventCallback = function (event) {
        //Retrieve event data
        var data = event.helper.getData();
        // App logic
      };
    }
```

---

>title: what are interface methods supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, interface_methods
>context:
>content:

# What are interface methods supported for caller conversation module in Freshcaller

1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

Freshcaller caller conversation module supports following interface methods

1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`

---

>title: how to use interface methods supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, interface_methods
>context:
>code:

How to use interface methods supported for caller conversation module in Freshcaller

1. To show lead information use

```js
try {
      let data = await client.interface.trigger("show", {
        id: "lead",
        value: 1
      });
      console.log(data); // success message
    } catch (error) {
      // failure operation
      console.error(error);
    }`
```

2. To open add account window

```js
try {
      let data = await client.interface.trigger("open", {
        id: "account"
      });
      console.log(data); // success message
    } catch (error) {
      // failure operation
      console.error(error);
    }`

```

---
>title: what are instance methods supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, instance_methods
>context:
>content:

# What are instance methods supported for caller conversation module in Freshcaller

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to
  a. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
  b. Send data from a modal to a parent placeholder and get the data in the parent.
  c. Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance.
  a. If a modal is the app instance where context() is used, it retrieves,
    i. The (modal's) instance id
    ii. The placeholder name of the app instance
    iii. The instance id of the parent that opened the modal
    iv. The data (if any) that was passed from the parent
  b. If context() is used in a parent placeholder, it retrieves,
    i. The instance id
    ii. The placeholder name of the app instance

---
>title: how to use instance methods supported for caller conversation module in Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, instance_methods
>context:
>code:

# How to use instance methods supported for caller conversation module in Freshcaller

1. To Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
    a. In parent UI

```js
try {
      await client.interface.trigger("showModal", {
        title: "Information Form",
        template: "modal.html",
        data: {
          name: "James",
          email: "James@freshworks.com"
        }
      });
    } catch (error) {
      console.error(error);
    }
```
b. In modal UI

```js
try {
      let context = await client.instance.context();
      console.log("Modal instance method context", context);
      /* Output: Modal instance method context
      {
        instanceId: "4",
        location: "modal",
        parentId: "1",
        modalData: {name: "James", email: "James@freshworks.com"} }"
      */
    } catch (error) {
      console.error(error);
    }
```
2. To Send data from a modal to a parent placeholder and get the data in the parent.
  a. In parent UI

```js
client.instance.receive(
      function(event) {
        let data = event.helper.getData();
        console.log(data);
        /* Output:
        {
          senderId: "4",
          message: {
            name: "James",
            email: "james.dean@freshworks.com"
          }
        }*/
      }
    );

```
b. In modal UI
```js
client.instance.send({
      message: {
        name: "James",
        email: "james.dean@freshworks.com"
      }
    });
    /* message can be a string, object, or array */
```
3. To Send data from one instance to another instance and receive data at the destination
    a. In placeholder 1
```js
client.instance.get().then(
      function(data) {
        console.log(data);
        /* output: [
          {
            instanceId: "1",
            location: "place_holder1"
          },
          {
            instanceId: "2",
            location: "place_holder2"
          }
        ]; */
        var pl2App = data.find(x => x.location === "place_holder2");
        client.instance.send({
          message: {
            name: "James",
            email: "james.dean@freshworks.com"
          },
          receiver: pl2App.instanceId
        });
        /* 2 - instance ID of the receiver */
      }
    );
```
b. In placeholder 2
```js
client.instance.receive(
    function(event) {
        let data = event.helper.getData();
        console.log(data);
        /* Output:
        {
          senderId: "1",
          message: {
            name: "James",
            email: "james.dean@freshworks.com"
          }
        }
        */
      }
    );
```

---
>title: what are the serverless events supported by caller conversation module of Freshcaller 
>tags: module=caller_conversation, caller_conversation, freshcaller, serverless_events
>context:
>content:

# What are the serverless events supported by caller conversation module of Freshcaller

An app built for this module can react to the following events.

1. Common events: In the app manifest, configure these events at `modules.common`.
  a. App set-up events
    i. `onAppInstall`
    ii. `afterAppUpdate`
    iii. `onAppUninstall`
  b. External events
    i. `onAppInstall`
    ii. `onExternalEvent`
    iii. `onAppUninstall`
  c. Scheduled events

2. Product-specific events: In the app manifest, configure these events at `modules.caller_conversation`.
  a. `onCallCreate`
  b. `onCallUpdate`

---
>title: how to configure product events supported by caller conversation module of Freshcaller 
>tags: module=caller_conversation, caller_conversation, freshcaller, product_events
>context:
>code:

# How to configure product events supported by caller conversation module of Freshcaller

## Step 1. Subscribe to an event by configuring an event listener in `manifest.json`

```json
{
  "events": {
    "<productEventName>": {
      "handler": "<eventCallbackMethod>"
    }
  }
}
```

## Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

```js
exports = {
    // args is a JSON block containing the payload information
    // args["iparam"] will contain the installation parameter values
    // eventCallbackMethod is the callback function name specified in manifest.json
    eventCallbackMethod: function(args) {
        console.log("Logging arguments from the event: " + JSON.stringify(args));
    }
};
```

## Step 3. Use the appropriate payload attribute for callback with below syntax

```json
{
  "currentHost": {
    "subscribed_modules": ["call", "caller_conversation"],
    "endpoint_urls": {
      "freshcaller": "value"
    }
  },
  "data": {
    "example_key": "example_value"
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
>title: how to configure events supported by caller conversation module of Freshcaller
>tags: module=caller_conversation, caller_conversation, freshcaller, product_events
>context:
>code:

# How to configure events supported by caller conversation module of Freshcaller

## Step 1. Subscribe to call event by configuring an event listener in `manifest.json`

```json
{
  "events": {
    "onCallCreate": {
      "handler": "onCallCreateCallback"
    }
  }
}
```

## Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

```js
exports = {
    onCallCreateCallback: function(payload) {
        console.log("Logging arguments from onCallCreateCallback event: " + JSON.stringify(payload));
    }
};
```

## Step 3. Use the appropriate payload attribute for callback with below syntax

```json
{
  "currentHost": {
    "subscribed_modules": ["call", "caller_conversation"],
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
      "id": 135,
      "participants": [],
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
>title: what is support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk
>context: 
>content:

# what is support agent module in Freshdesk
An app user with a stand-alone Freshdesk subscription or a subscription to any SKU that has Freshdesk as one of the products can use this module. Using this module you can build a front end app, a serverless app and also a full stack SMI app for Freshdesk Ticket feature. The front end and SMI apps is deployed on the supported product’s left-navigation pane. The app cannot be deployed on any other pages of the product.	 

---
>title: what are the placeholders supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk
>context: manifest.json
>content:

# what are the placeholders supported for support agent module in Freshdesk
1. It supports following Common placeholders. In the app manifest, configure these placeholders at modules.common.
   1. Full Page App as `full_page_app`
   2. CTI Global sidebar as `cti_global_sidebar`

---
>title: how to use placeholders supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk
>context: manifest.json
>content:

# how to use placeholders supported for support agent module in Freshdesk
To use the placeholder modify your `manifest.json` as below 
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        },
        "cti_global_sidebar": {
          "url": "cti_global_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    }
  }
}
```

---
>title: data methods supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk, data_method
>context: 
>content:

# data methods supported for support agent module in Freshdesk
You can use the `client.data.get()` data method to retrieve the following objects.
Objects accessible regardless of the placeholders
1. currentHost
2. loggedInUser

---
>title: example of data method usage supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk
>context: 
>content:

# example of data method usage supported for support agent module in Freshdesk

1. To retrieve current host information
  ```js
  async function getCurrentHostData() {
    try {
      const data = await client.data.get("currentHost");
      // success operation
      // "data" is {subscribed_modules: [“contact”, “deal”, ... }}
    } catch (error) {
      // failure operation
    }
  }

  getCurrentHostData();
  ```
2. For loggedInUser information
  ```js
  async function getLoggedInUserData() {
    try {
      const data = await client.data.get("loggedInUser");
      // success operation
      // "data" is {loggedInUser: {‘available’: “true”, ... }}
    } catch (error) {
      // failure operation
    }
  }

  getLoggedInUserData();
  ```

---
>title: what are events methods supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk, events_method
>context: 
>content:

# what are events methods supported for support agent module in Freshdesk
Common event: An app deployed at cti_global_sidebar can react to the `cti.triggerDialer` event. It gets triggered when user clicks on
1. Ticket details page > CONTACT DETAILS widget
2. Ticket list page > Contact hover card
3. New ticket page > CONTACT DETAILS widget
4. Contact list page > Contact hover card
5. Contact details page > Contact header and DETAILS widget

---
>title: how to use events methods supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk, events_method
>context: 
>content:

# how to use events methods supported for support agent module in Freshdesk
To use `cti.triggerDialer` use following code
```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("cti.triggerDialer", eventCallback);
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

---
>title: what are interface methods supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk, interface_methods
>context: 
>content:

# what are interface methods supported for support agent module in Freshdesk
1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Display or hide CTI dialler
5. Display or hide missed calls in the CTI widget
6. `click` method on Open Ticket or Contact details page

---
>title: how to use interface methods supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk, interface_methods
>context: 
>content:

# how to use interface methods supported for support agent module in Freshdesk

## To show modal or dialog
    ```js
    try {
    let data = client.interface.trigger('showDialog', {
    title: 'Sample Dialog',
    template: 'dialog.html' });
    console.log(data); // success message
    } catch (error) {
        // failure operation
    console.error(error);
    }
    ```
## To display notifications
    ```js
    client.interface.trigger("showNotify", {
        type: “<Possible values: info, success, warning, danger, alert>”,
        title: "<Display name>",
        message: "<text message to be displayed in the notification box>"
        }
    )
    ```

---
>title: what are instance methods supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk, instance_methods
>context: 
>content:

# what are instance methods supported for support agent module in Freshdesk
- `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
- `client.instance.close()` to close the instance
- Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to
   - Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   - Send data from a modal to a parent placeholder and get the data in the parent.
   - Send data from one instance to another instance and receive data at the destination.

---
>title: how to use instance methods supported for support agent module in Freshdesk
>tags: module=support_agent, support_agent, freshdesk, instance_methods
>context: 
>content:

# how to use instance methods supported for support agent module in Freshdesk
Freshdesk provides several instance methods that allow you to interact with the support agent interface programmatically. These methods are useful for customizing the agent experience, automating workflows, and integrating with other systems

1. To Send data from a parent placeholder to a modal and retrieve the context/data in the modal
This process involves triggering a modal from a parent placeholder and passing data to it. The modal can then retrieve the passed data using the client.instance.context() method.

  - In parent placeholder UI
   The parent placeholder triggers the modal and sends data to it using the client.interface.trigger("showModal") method.


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

   - In modal UI
   The modal retrieves the data sent by the parent placeholder using the client.instance.context() method.
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
This process involves sending data from a modal to its parent placeholder. The parent placeholder can receive the data using the client.instance.receive() method.
   - In modal UI
   The modal sends data to the parent placeholder using the client.instance.send() method.

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
   - In parent placeholder UI
   The parent placeholder receives the data sent by the modal using the client.instance.receive() method.

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
This process involves sending data from one instance (e.g., a placeholder) to another instance. The sender uses the client.instance.send() method, and the receiver uses the client.instance.receive() method.

   - In placeholder or instance 1
   The sender retrieves all instances using client.instance.get() and sends data to a specific instance.
   ```js
    client.instance.get().then(
    function(data) {
    console.log(data);
        /* output: [
        {
            instanceId: "1",
            location: "place_holder1"},
        {
            instanceId: "2",
            location: "place_holder2"}
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
   - In placeholder or instance 2
   The receiver listens for incoming data using the client.instance.receive() method.

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
>title: what are the serverless events supported by support agent module of Freshdesk
>tags: module=support_agent, support_agent, freshdesk, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by support agent module of Freshdesk
An app built for this module can react to the following events.
## Common events: In the app manifest, configure these events at `modules.common`.
   ### App set-up events
      1. `onAppInstall`
      2. `afterAppUpdate`
      3. `onAppUninstall`
   ### External events
      1. `onAppInstall`
      2. `onExternalEvent`
      3. `onAppUninstall`
   ### Scheduled events
## Product-specific events: In the app manifest, configure these events at `modules.support_agent`.
   1. `onAgentCreate`
   2. `onAgentUpdate`
   3. `onAgentDelete`
   4. `onAgentStatusCreate`
   5. `onAgentStatusDelete`
   6. `onAgentStatusUpdate`
   7. `onAgentAvailabilityUpdate`
   8. `onGroupCreate`
   9. `onGroupUpdate`
   10. `onGroupDelete`

---
>title: how to configure product events supported by support agent module of Freshdesk
>tags: module=support_agent, support_agent, freshdesk, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by support agent module of Freshdesk

## Subscribe to an event by configuring an event listener in `manifest.json`
```json
{
  "events": {
    "<productEventName>": {
      "handler": "<eventCallbackMethod>"
    }
  }
}
```
## In `server.js` file under the exports block, enter the callback function definition as follows:
  ```js
   exports = {
   // args is a JSON block containing the payload information
   // args["iparam"] will contain the installation parameter values
   //eventCallbackMethod is the call-back function name specified in manifest.json
   eventCallbackMethod: function(args) {
     console.log("Logging arguments from the event: " + JSON.stringify(payload));
   }};
  ```
## Use the appropriate payload attribute for callback with below syntax
  ```json
  {
    "currentHost": {
      "subscribed_modules": [ "support_agent" ],
      "endpoint_urls": {
        "freshdesk": "value"
      }
    },
    "data" : {},
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
>title: how to configure agent create event supported by support agent module of Freshdesk
>tags: module=support_agent, support_agent, freshdesk, product_events, agent_events
>context: manifest.json, server.js
>content:

# how to configure agent create event supported by support agent module of Freshdesk

## Subscribe to agent event by configuring an event listener in `manifest.json`
```json
{
  "events": {
    "onAgentCreate": {
      "handler": "onAgentCreateCallback"
    }
  }
}
```
## In `server.js` file under the exports block, enter the callback function definition as follows:
  ```js
  exports = {
    onAgentCreateCallback: function(payload) {
     console.log("Logging arguments from onAgentCreate event: " + JSON.stringify(payload));
    }
  }
  ```
## Use the appropriate payload attribute for callback with below syntax
  ```json
  {
    "currentHost": {
      "subscribed_modules": [ "support_agent" ],
      "endpoint_urls": {
        "freshdesk": "https://subdomain.freshdesk.com"
      }
    },
    "data": {
      "actor": {
        "account_id": 13,
        "first_name": "Minerva",
        "id": 51,
        "name": "Minerva",
        "preferences": {}
      },
      "tags": [],
      "time_zone": "Chennai",
      "timezone": "Asia/Kolkata",
      "agent": {
        "account_id": 13,
        "active": false,
        "active_since": null,
        "address": null,
        "agent_type": {
          "id": 1,
          "name": "support_agent"
        },
        "contribution_groups": [],
        "name": "Rachel",
        "preferences": {},
        "user_preferences": {}
      },
      "ticket_permission": {
        "id": 1,
        "permission": "all_tickets"
      },
      "associations": {}
    },
    "event": "onAgentCreate",
    "region": "AUS",
    "timestamp": 1632216299.987576,
    "version": "1.3.6"
  }
  ```

---
>title: what are the REST APIs supported by support agent module of Freshdesk
>tags: module=support_agent, support_agent, freshdesk, rest_api
>context: 
>content:

# what are the REST APIs supported by support agent module of Freshdesk
The Freshdesk support agent module supports following APIs
`GET /api/v2/agents/[id]`
`GET /api/v2/agents`
`POST /api/v2/agents/`
`PUT /api/v2/agents/[id]`
`DELETE /api/v2/agents/[id]`
`GET /api/v2/agents/me`
`POST /api/v2/agents/bulk`
`GET /api/v2/agents/autocomplete?term=[keyword]`

---
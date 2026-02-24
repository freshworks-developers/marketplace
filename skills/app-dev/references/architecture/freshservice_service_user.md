>title: what is service user module in Freshservice
>tags: module=service_user, service_user, freshservice
>context: 
>content:

# what is service user module in Freshservice

An app user with a stand-alone Freshservice subscription or a subscription to any SKU that has Freshservice as one of the products can use this module. Using this module you can build a frontend app, a serverless app and also a full stack SMI app for Freshservice User feature.

---
>title: what are the placeholders supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice
>context: manifest.json
>content:

# what are the placeholders supported for service user module in Freshservice

## Common placeholders

 Full Page App as `full_page_app`

## Module-specific placeholders

 `contact_sidebar`

---
>title: how to use placeholders supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice
>context: manifest.json
>content:

# how to use placeholders supported for service user module in Freshservice

To use the Support user placeholder modify your `manifest.json` as below 
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    },
    "service_user": {
      "location": {
        "contact_sidebar": {
          "url": "contact_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}
```

---
>title: what are data methods supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice, data_method
>context: apps.js
>content:

# what are data methods supported for service user module in Freshservice

You can use the `client.data.get()` data method to retrieve the following objects.

## Objects accessible regardless of the placeholders

- `currentHost`
- `loggedInUser`

## Placeholder-specific objects

- An app deployed in the User details page can retrieve the following objects:
  - `department` - to retrieve information of the department.
  - `requester` - to retrieve information of a requester/contact.

---
>title: example of data method usage supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice
>context: apps.js
>content:

# example of data method usage supported for service user module in Freshservice

## To retrieve information of the department
  ```js
  async function getDepartmentDetails() {
    try {
      const data = await client.data.get("department");
      // success output
      // data is {{"department": {"departments": [{"created_at": "2017-10-26T19:40:31+05:30","custom_field": {},}
      console.log(data);
    } catch (error) {
      // failure operation
      console.log(error);
    }
  }
  getDepartmentDetails();
  ```
## For requester information
  ```js
  client.data.get("requester").then (
    function(data) {
      // success output
      // data is {requester: {"active": "true"}}
    },
    function(error) {
      // failure operation
    }
  );
  ```

---
>title: what are events methods supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice, events_method
>context: 
>content:

# what are events methods supported for service user module in Freshservice

Event methods are not supported for this module.

---
>title: what are interface methods supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice, interface_methods
>context: apps.js
>content:

# what are interface methods supported for service user module in Freshservice

Using interface methods an app can, on the product UI,

1. Display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as starting or stopping a timer or navigating to specific pages.
3. Show/Hide certain fields, field values, and elements (such as icons or other relevant information).
4. Enable/Disable certain buttons.
5. Set the values of certain fields.

Freshservice supports following interface methods

## Interface Methods

1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`

---
>title: how to use interface methods supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice, interface_methods
>context: apps.js
>content:

# how to use interface methods supported for service user module in Freshservice

## To show modal or dialog
    ```js
    try {
      let data = client.interface.trigger('showModal', {
      title: 'Sample App Form',
      template: './views/modal.html' });
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
>title: what are instance methods supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice, instance_methods
>context: apps.js
>content:

# what are instance methods supported for service user module in Freshservice

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to
   - Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   - Send data from a modal to a parent placeholder and get the data in the parent.
   - Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance. 
   - If a modal is the app instance where context() is used, it retrieves,
      - The (modal’s) instance id
      - The placeholder name of the app instance
      - The instance id of the parent that opened the modal
      - The data (if any) that was passed from the parent
   - If context() is used in a parent placeholder, it retrieves,
      - The instance id
      - The placeholder name of the app instance

---

>title: how to use instance methods supported for service user module in Freshservice
>tags: module=service_user, service_user, freshservice, instance_methods
>context: apps.js
>content:

# how to use instance methods supported for service user module in Freshservice

## To Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
  ###  In parent UI
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
  ###  In modal UI
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
## To Send data from a modal to a parent placeholder and get the data in the parent.
  ### In parent UI
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
  ### In modal UI
   ```js
    client.instance.send({
    message: {
        name: "James",
        email: "james.dean@freshworks.com"
    }
    });
    /* message can be a string, object, or array */
   ```
## To Send data from one instance to another instance and receive data at the destination

   ### In placeholder 1

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
  ### In placeholder 2
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
>title: what are the serverless events supported by service user module of Freshservice
>tags: module=service_user, service_user, freshservice, serverless_events
>context: manifest.json, server.js
>content:

# what are the serverless events supported by service user module of Freshservice

An app built for this module can react to the following events.

## Common events

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

## Product-specific events

In the app manifest, configure these events at `modules.service_user`
- `onUserCreate`
- `onUserUpdate`
- `onUserDelete`

---
>title: how to configure product events supported by service user module of Freshservice
>tags: module=service_user, service_user, freshservice, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by service user module of Freshservice

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
        "subscribed_modules": [ "service_user" ],
        "endpoint_urls": {
          "freshservice": "value"
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
>title: what are the REST APIs supported by service user module of Freshservice
>tags: module=service_user, service_user, freshservice, rest_api
>context: 
>content:

# what are the REST APIs supported by service user module of Freshservice

The Freshservice Support User module supports following APIs
It provides the endpoint along with Oauth scope required for every api

## Requester Apis
- `POST /api/v2/requesters` - ITSM Scope: freshservice.requesters.create, MSP Scope: freshservice.requesters.create
- `GET /api/v2/requesters/[id]` - ITSM Scope: freshservice.requesters.view, MSP Scope: freshservice.requesters.view
- `GET /api/v2/requesters` - ITSM Scope: freshservice.requesters.view, MSP Scope: freshservice.requesters.view
- `GET /api/v2/requesters?query=[query]` - ITSM Scope: freshservice.requesters.view, MSP Scope: freshservice.requesters.view
- `GET /api/v2/requester_fields` - ITSM Scope: freshservice.requesters.fields.view, MSP Scope: freshservice.requesters.fields.view
- `PUT /api/v2/requesters/[id]` - ITSM Scope: freshservice.requesters.edit, MSP Scope: freshservice.requesters.edit
- `DELETE /api/v2/requesters/[id]` - ITSM Scope: freshservice.requesters.delete, MSP Scope: freshservice.requesters.delete
- `DELETE /api/v2/requesters/[id]/forget` - ITSM Scope: freshservice.requesters.delete, MSP Scope: freshservice.requesters.delete
- `PUT /api/v2/requesters/[id]/convert_to_agent` - ITSM Scope: freshservice.requesters.manage, MSP Scope: freshservice.requesters.manage
- `PUT /api/v2/requesters/[id]/merge?secondary_requesters=111,222,333` - ITSM Scope: freshservice.requesters.edit, MSP Scope: freshservice.requesters.edit

## Agent Apis
- `POST /api/v2/agents` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `GET /api/v2/agents/[id]` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `GET /api/v2/agents` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `GET /api/v2/agents?query=[query]` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `PUT /api/v2/agents/[id]` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `DELETE /api/v2/agents/[id]` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `DELETE /api/v2/agents/[id]/forget` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `PUT /api/v2/agents/[id]/reactivate` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `PUT /api/v2/agents/[id]/convert_to_requester` - ITSM Scope: freshservice.agents.manage, MSP Scope: freshservice.agents.manage
- `GET /api/v2/agent_fields` - ITSM Scope: freshservice.agents.fields.view, MSP Scope: freshservice.agents.fields.view

---
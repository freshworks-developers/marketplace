>title: what is cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm
>context: 
>content:

# what is cpq_document module in Freshsales Suite

Appointment Module Usage is allowed for following subscriptions

## Subscriptions
1. A Freshsales suite subscription with:
   1. Freshsales Classic
   2. Freshchat
   3. Freshcaller.
2. A Freshsales suite subscription with:
   1. Freshsales Classic.
3. A stand-alone Freshsales Classic subscription.

## Allows users to build
1. Front-end apps
2. Serverless apps.
3. Full stack SMI apps

---

>title: what are the placeholders supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm
>context: manifest.json
>content:

# what are the placeholders supported for cpq_document module in Freshsales Suite

## Common placeholders
1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

---

>title: how to use placeholders supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm
>context: manifest.json
>content:

# how to use placeholders supported for cpq_document module in Freshsales Suite

To use the supported placeholder modify your `manifest.json` as below 

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
        "left_nav_cti": {
          "url": "left_nav_cti.html",
          "icon": "styles/images/icon.svg"
        },
        "left_nav_chat": {
          "url": "left_nav_chat.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}
```

---

>title: what are data methods supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, data_method
>context: 
>content:

# what are data methods supported for cpq_document module in Freshsales Suite

You can use the `client.data.get()` data method to retrieve the following objects. 

## Objects
1. The objects accessible regardless of the placeholders
   1. `currentHost`
   2. `loggedInUser`

---

>title: example of data method usage supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm
>context: 
>content:

# example of data method usage supported for cpq_document module in Freshsales Suite

To retrieve the currentHost object that contains information on, `subscribed_modules` & `endpoint_urls` use the code below.

```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success output for cpq_document
    // {subscribed_modules: [“contact”, “cpq_document”, ... ]}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getCurrentHostData();
```

---

>title: what are events methods supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, events_method
>context: 
>content:

# what are events methods supported for cpq_document module in Freshsales Suite

The cpq_document module supports following events:

## Event List
1. If your app is built to be deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when the corresponding event trigger occurs.

---

>title: how to use events methods supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, events_method
>context: apps.js
>content:

# how to use events methods supported for cpq_document module in Freshsales Suite

To enable your app to react to front-end events, in the `app.js` file:

## Steps
1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization,
   1. Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   2. Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

## Code
To use `calling` event use following code:
```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("calling", eventCallback);
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

---

>title: what are interface methods supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, interface_methods
>context: 
>content:

# what are interface methods supported for cpq_document module in Freshsales Suite

1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Interface Methods
Freshsales Suite cpq_document module supports following interface methods:
1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`

---

>title: how to use interface methods supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, interface_methods
>context: 
>content:

# how to use interface methods supported for cpq_document module in Freshsales Suite

## Code
1. To show modal
    ```js
    try {
      let data = client.interface.trigger('showModal', {
        title: 'Sample App Form',
        template: './views/modal.html' 
      });
      console.log(data); // success message
    } catch (error) {
      // failure operation
      console.error(error);
    }
    ```

---

>title: what are instance methods supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, instance_methods
>context: 
>content:

# what are instance methods supported for cpq_document module in Freshsales Suite

## Methods
1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to
   1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   2. Send data from a modal to a parent placeholder and get the data in the parent.
   3. Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance. 
   1. If a modal is the app instance where context() is used, it retrieves:
      1. The (modal’s) instance id
      2. The placeholder name of the app instance
      3. The instance id of the parent that opened the modal
      4. The data (if any) that was passed from the parent
   2. If context() is used in a parent placeholder, it retrieves:
      1. The instance id
      2. The placeholder name of the app instance

---

>title: how to use instance methods supported for cpq_document module in Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, instance_methods
>context: 
>content:

# how to use instance methods supported for cpq_document module in Freshsales Suite

## Code
1. To Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   1. In parent UI
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
   2. In modal UI
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
   1. In parent UI
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
   2. In modal UI
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
   1. In placeholder 1
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
   2. In placeholder 2
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

>title: what are the serverless events supported by cpq_document module of Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by cpq_document module of Freshsales Suite

An app built for this module can react to the following events.

## Events
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
2. Product-specific events: In the app manifest, configure these events at `modules.cpq_document`.
   1. `onCpqDocumentCreate`
   2. `onCpqDocumentUpdate`
   3. `onCpqDocumentDelete`

---

>title: how to configure product events supported by cpq_document module of Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by cpq_document module of Freshsales Suite

## Steps
1. Subscribe to an event by configuring an event listener in `manifest.json`
2. In `server.js` file under the exports block, enter the callback function definition
3. Use the appropriate payload attribute for callback

### Subscribe to an event by configuring an event listener in `manifest.json`
    ```json
    {
      "events": {
        "<productEventName>": {
            "handler": "<eventCallbackMethod>"
        }
      }
    }
    ```
### In `server.js` file under the exports block, enter the callback function definition as follows:
    ```js
    exports = {
    // args is a JSON block containing the payload information
    // args["iparam"] will contain the installation parameter values
    //eventCallbackMethod is the call-back function name specified in manifest.json
    eventCallbackMethod: function(args) {
      console.log("Logging arguments from the event: " + JSON.stringify(payload));
    }};
    ```
### Use the appropriate payload attribute for callback with below syntax:
    ```json
    {
      "currentHost": {
        "subscribed_modules": [ "cpq_document" ],
        "endpoint_urls": {
          "freshworks_crm": "value"
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
      "timestamp"  : "value",
    }
    ```

---

>title: how to configure events supported by cpq_document module of Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by cpq_document module of Freshsales Suite

## Steps

### Step 1. Subscribe to cpq_document by configuring an event listener in `manifest.json`
  
  ```json
  {
    "events": {
      "onCpqDocumentCreate": {
        "handler": "onCpqDocumentCreateCallback"
      }
    }
  }
  ```

### Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

  ```js
  exports = {
    onCpqDocumentCreateCallback: function(payload) {
      console.log("Logging arguments from onCpqDocumentCreateCallback event: " + JSON.stringify(payload));
    }
  }
  ```

### Step 3. Use the appropriate payload attribute for callback with below syntax:
  
  ```json
  {
    "currentHost": {
      "subscribed_modules": [ "CpqDocument" ],
      "endpoint_urls": {
        "freshworks_crm": "https://sample.myfreshworks.com",
        "freshsales": "https://sample.freshsales.io"
      }
    },
    "data": {
      "actor": {
        "deal_pipeline_id": 27149,
        "email": "jim.doe@xyz.com",
        "id": 39897,
        "job_title": "Engineer",
        "name": "Jim Doe",
        "uuid": "195818342547907164"
      },
      "associations": {},
      "cpq_document": {
        "amount": 677,
        "base_currency_amount": "677.0",
        "billing_address": "604-5854 Beckford St.",
        "billing_city": "Glendale",
        "billing_country": "USA",
        "billing_state": "Arizona",
        "billing_zipcode": "100652",
        "contact_id": 8441389,
        "cpq_document_template_id": 168209
      }
    },
    "event": "onCpqDocumentCreate",
    "iparams": {},
    "region": "US",
    "timestamp": 1593023454.5852625,
    "version": "2.0"
  }
  ```

---

>title: what are the REST APIs supported by cpq_document module of Freshsales Suite
>tags: module=cpq_document, cpq_document, freshworks_crm, rest_api
>context: 
>content:

# what are the REST APIs supported by cpq_document module of Freshsales Suite

The Freshsales Suite cpq_document module supports following APIs:

## APIs
`POST /api/cpq/cpq_documents`
`GET /api/cpq/cpq_documents/[id]`
`PUT /api/cpq/cpq_documents/[id]`
`PUT /api/cpq/cpq_documents/cpq_documents_bulk_update`
`POST /api/cpq/cpq_documents/cpq_documents_bulk_assign`
`DELETE /api/cpq/cpq_documents/[id]`
`PUT /api/cpq/cpq_documents/[id]/restore`
`POST /api/cpq/cpq_documents/cpq_documents_bulk_delete`
`POST /api/cpq/cpq_documents/cpq_documents_bulk_restore`
`DELETE /api/cpq/cpq_documents/[id]/forget`
`PUT api/cpq/cpq_documents/[id]?include=products`
`GET api/cpq/cpq_documents/[id]/related_products`

---


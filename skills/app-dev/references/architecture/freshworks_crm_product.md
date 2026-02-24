>title: what is product module in Freshsales Suite
>tags: module=product, product, freshworks_crm
>context:
>content:

# what is product module in Freshsales Suite

Product Module Usage is allowed for following subscriptions:
1. A stand-alone Freshsales Classic subscription.
2. A Freshsales suite subscription with:
   1. Freshsales Classic
   2. Freshchat
   3. Freshcaller.
3. A Freshsales suite subscription with:
   1. Freshsales Classic.

## It Allows users to build:
1. Front-end apps when deployed on the supported product's left-navigation pane.
2. Serverless apps.
3. Full stack SMI apps, with the front-end component accessible only from the left-navigation pane.

---

>title: what are the placeholders supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm
>context: manifest.json
>content:

# what are the placeholders supported for product module in Freshsales Suite

## Common placeholders
In the app manifest, configure these placeholders at `modules.common`:
1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

---

>title: how to use placeholders supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm
>context: manifest.json
>content:

# how to use placeholders supported for product module in Freshsales Suite

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
      },
      "requests": {}
    }
  }
}
```

---

>title: what are data methods supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm, data_method
>context: 
>content:

# what are data methods supported for product module in Freshsales Suite

## Data methods summary
You can use the `client.data.get()` data method to retrieve the following objects. The objects accessible regardless of the placeholders:
1. currentHost
2. loggedInUser

---

>title: example of data method usage supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm
>context:
>content:

# example of data method usage supported for product module in Freshsales Suite

## Retrieve the `currentHost` object
```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success operation
    // "data" is {subscribed_modules: [“contact”, “deal”, ... ]}
  } catch (error) {
    // failure operation
  }
}

getCurrentHostData();
```

## Retrieve the logged in user data
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

>title: what are events methods supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm, events_method
>context:
>content:

# what are events methods supported for product module in Freshsales Suite

## Supported events
The product module supports following events:
1. If your app is built to be deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when the corresponding event trigger occurs. When a user clicks the call icon or phone number link that is displayed on any of the following pages of the product UI:
   1. Contact list page > Contact hover card > Make call widget
   2. Contact list page > Work phone field
   3. Contact details page > Work phone and Mobile fields
   4. Contact details page > Make call widget

---

>title: how to use events methods supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm, events_method
>context: apps.js
>content:

# how to use events methods supported for product module in Freshsales Suite

To enable your app to react to front-end events, in the app.js file:

## Steps to subscribe and handle events
1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization:
   1. Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   2. Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

## Example: using `calling` event
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

>title: what are interface methods supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm, interface_methods
>context:
>content:

# what are interface methods supported for product module in Freshsales Suite

## Interface methods summary
1. Using interface methods, an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Freshsales Suite product module supports following interface methods
1. Display modals or dialog boxes:
   - `showModal` method
   - `showDialog` method
2. Display confirmation messages:
   - `showConfirm` method
3. Display notifications:
   - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`

---

>title: how to use interface methods supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm, interface_methods
>context: apps.js
>content:

# how to use interface methods supported for product module in Freshsales Suite

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

>title: what are instance methods supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm, instance_methods
>context:
>content:

# what are instance methods supported for product module in Freshsales Suite

## Supported instance methods and how to use them

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   2. Send data from a modal to a parent placeholder and get the data in the parent.
   3. Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance.

### If a modal is the app instance where context() is used, the following contextual info can be retrieved:
   1. The (modal’s) instance id
   2. The placeholder name of the app instance
   3. The instance id of the parent that opened the modal
   4. The data (if any) that was passed from the parent

### If context() is used in a parent placeholder:
   1. The instance id
   2. The placeholder name of the app instance

---

>title: how to use instance methods supported for product module in Freshsales Suite
>tags: module=product, product, freshworks_crm, instance_methods
>context: apps.js
>content:

# how to use instance methods supported for product module in Freshsales Suite

1. Send data from a parent placeholder to a modal and retrieve data in the modal
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

2. Send data from a modal to a parent placeholder and get the data in the parent
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

3. Send data from one instance to another instance and receive data at the destination
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

>title: what are the serverless events supported by product module of Freshsales Suite
>tags: module=product, product, freshworks_crm, serverless_events
>context:
>content:

# what are the serverless events supported by product module of Freshsales Suite

## Supported serverless events
An app built for this module can react to the following events.

### Common events
In the app manifest, configure these events at `modules.common`:
1. App set-up events:
   1. `onAppInstall`
   2. `afterAppUpdate`
   3. `onAppUninstall`
2. External events:
   1. `onAppInstall`
   2. `onExternalEvent`
   3. `onAppUninstall`
3. Scheduled events

### Product-specific events
In the app manifest, configure these events at `modules.product`:
1. `onProductCreate`
2. `onProductUpdate`

---

>title: how to configure product events supported by product module of Freshsales Suite
>tags: module=product, product, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by product module of Freshsales Suite

## Steps to configure product events

### Step 1. Subscribe to an event by configuring an event listener in `manifest.json`

```json
    {
      "events": {
        "<productEventName>": {
            "handler": "<eventCallbackMethod>"
        }
      }
    }
```

### Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

```js
    exports = {
    // args is a JSON block containing the payload information
    // args["iparam"] will contain the installation parameter values
    //eventCallbackMethod is the call-back function name specified in manifest.json
    eventCallbackMethod: function(args) {
      console.log("Logging arguments from the event: " + JSON.stringify(payload));
    }};
```

### Step 3. Use the appropriate payload attribute for callback with below syntax:

```json
    {
      "currentHost": {
        "subscribed_modules": [ "product" ],
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

>title: how to configure events supported by product module of Freshsales Suite
>tags: module=product, product, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by product module of Freshsales Suite

## Steps to configure events

### Step 1. Subscribe to appointment by configuring an event listener in `manifest.json`

```json
  {
    "events": {
      "onProductCreate": {
        "handler": "onProductCreateCallback"
      }
    }
  }
```

### Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

```js
  exports = {
    onProductCreateCallback: function(payload) {
      console.log("Logging arguments from onProductCreateCallback event: " + JSON.stringify(payload));
    }
  }
```

### Step 3. Use the appropriate payload attribute for callback with below syntax

```json
  {
    "currentHost": {
      "subscribed_modules": [ "product" ],
      "endpoint_urls": {
        "freshworks_crm": "https://sample.myfreshworks.com",
        "freshsales": "https://sample.freshsales.io"
      }
    },
    "data": {
      "actor": {
        "id": 0,
        "name": "System",
        "type": "system"
      },
      "associations": {},
      "product": {
        "category": "Hardware",
        "description": "Extra 2GB RAM",
        "id": 547921,
        "name": "Samsung",
        "parent_product": 547920,
        "product_code": "S11",
        "sku_number": "MOSA12309",
        "updated_at": "2022-09-07T08:47:04Z",
        "valid_till": "2023-01-05T00:00:00Z"
      }
    },
    "event": "onProductCreate",
    "region": "US",
    "timestamp": 1496400354326,
    "version": "2.0"
  }
```

---

>title: what are the REST APIs supported by product module of Freshsales Suite
>tags: module=product, product, freshworks_crm, rest_api
>context:
>content:

# what are the REST APIs supported by product module of Freshsales Suite

## Supported REST APIs
The Freshsales Suite product module supports following APIs:
- `POST /api/cpq/products`
- `GET /api/cpq/products/[id]`
- `PUT /api/cpq/products/[id]`
- `PUT /api/cpq/products/products_bulk_update`
- `POST /api/cpq/products/products_bulk_assign`
- `DELETE /api/cpq/products/[id]`
- `PUT /api/cpq/products/[id]/restore`
- `POST /api/cpq/products/products_bulk_delete`
- `POST /api/cpq/products/products_bulk_restore`
- `PUT api/cpq/products/[id]?include=product_pricings` - To add, edit and delete the prices of the product
- `PUT api/deals/[id]?include=products` - To add, edit and delete the products to the deal. Maximum of 100 products can be added to the deal.

---
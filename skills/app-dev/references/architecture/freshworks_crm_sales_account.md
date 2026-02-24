>title: what is sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm
>context: 
>content:

# what is sales account module in Freshsales Suite

## Sales Account Module Usage is allowed for following subscriptions

1. A Freshsales suite subscription with:
   - Freshsales Classic
   - Freshchat
   - Freshcaller
2. A Freshsales suite subscription with:
   - Freshchat
3. A Freshsales suite subscription with:
   - Freshcaller
4. A Freshsales suite subscription with:
   - Freshsales Classic

## It Allows users to build:

- Front-end apps
- Serverless apps
- Full stack SMI apps

---

>title: what are the placeholders supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm
>context: manifest.json
>content:

# what are the placeholders supported for sales account module in Freshsales Suite

## Common placeholders

In the app manifest, configure these placeholders at `modules.common`.

1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

## Module-specific placeholders

In the app manifest, configure these placeholders at `modules.sales_account`.

1. Sales Account Entity Menu as `sales_account_entity_menu`
2. Sales Account Quick Actions as `sales_account_quick_actions`

---

>title: how to use placeholders supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm
>context: manifest.json
>content:

# how to use placeholders supported for sales account module in Freshsales Suite

## Supported placeholder configuration

To use the supported placeholder modify your `manifest.json` as below:

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
  },
  "sales_account": {
    "location": {
      "sales_account_entity_menu": {
        "url": "sales_account_entity_menu.html",
        "icon": "logo.svg"
      },
      "sales_account_quick_actions": {
        "url": "sales_account_quick_actions.html",
        "icon": "logo.svg"
      }
    }
  }
}
```

---

>title: what are data methods supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, data_method
>context: 
>content:

# what are data methods supported for sales account module in Freshsales Suite

## Summary of data methods

1. Use the `client.data.get()` data method to retrieve the following objects accessible regardless of the placeholders:
   - `currentHost`
   - `loggedInUser`
2. An app deployed in the Sales account details page can retrieve the following objects in Placeholder-specific events:
   - `currentEntityInfo`

---

>title: example of data method usage supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm
>context: 
>content:

# example of data method usage supported for sales account module in Freshsales Suite

## Retrieve `currentHost` object

To retrieve the `currentHost` object that contains information on:
```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success operation
    // "data" is {subscribed_modules: ["contact", "deal", ...]}
  } catch (error) {
    // failure operation
  }
}

getCurrentHostData();
```

## Retrieve `loggedInUser` object

To retrieve information on the user logged into the Freshworks product UI:
```js
async function getLoggedInUserData() {
  try {
    const data = await client.data.get("loggedInUser");
    // success operation
    // "data" is {loggedInUser: {'available': "true", ...}}
  } catch (error) {
    // failure operation
  }
}

getLoggedInUserData();
```

## Retrieve `currentEntityInfo` object

To retrieve information of an account when an agent is on the Sales account details page:
```js
async function getCurrentEntityInfo() {
  try {
    const data = await client.data.get("currentEntityInfo");
    // success output for account
    // data: {"currentEntityInfo": {"currentEntityId": 12, "currentEntityType": "sales_account"}}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}

getCurrentEntityInfo();
```

---

>title: what are events methods supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, events_method
>context: 
>content:

# what are events methods supported for sales account module in Freshsales Suite

## Summary of supported events

1. If your app is built to be deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when the corresponding event trigger occurs. When a user clicks the call icon or phone number link that is displayed on any of the following pages of the product UI:
   - Contact list page > Contact hover card > Make call widget
   - Contact list page > Work phone field
   - Contact details page > Work phone and Mobile fields
   - Contact details page > Make call widget
2. An app deployed in the Sales account details page can react to the following Placeholder-specific front-end events:
   - `account.update` - to enable your app to react when a user updates a sales account.

---

>title: how to use events methods supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, events_method
>context: apps.js
>content:

# how to use events methods supported for sales account module in Freshsales Suite

## Steps to react to front-end events

To enable your app to react to front-end events, in the app.js file:

1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization:
   - Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   - Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

### Use `calling` event

To use `calling` event, use the following code:
```js
{
  // Configure event listener and subscribe to event
  // Register callback
  client.events.on("calling", eventCallback);
  var eventCallback = function (event) {
    // Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

### Use `account.update` event

To use `account.update` event, use the following code:
```js
{
  // Configure event listener and subscribe to event
  // Register callback
  client.events.on("account.update", eventCallback);
  var eventCallback = function (event) {
    // Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

---

>title: what are interface methods supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, interface_methods
>context: 
>content:

# what are interface methods supported for sales account module in Freshsales Suite

## Using interface methods

1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Supported interface methods

1. Display modals or dialog boxes - `showModal` method and `showDialog` method.
2. Display confirmation messages - `showConfirm` method.
3. Display notifications - `showNotify` method. It supports `info`, `success`, `warning`, `danger`, and `alert`.
4. To enable your app to open the ADD LEAD, ADD CONTACT, ADD ACCOUNT, ADD DEAL, or CALL LOG windows using `client.interface.trigger("open", {id: "<window-name>"})` where `window-name` can be `lead`, `contact`, `account`, `deal`, and `calllog`.
5. Open lead, contact, account, or deal details page via `client.interface.trigger("show", { id: "<lead, contact, account, or deal>", value: <id of the lead, contact, account, or deal to be opened>})`.

---

>title: how to use interface methods supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, interface_methods
>context: apps.js
>content:

# how to use interface methods supported for sales account module in Freshsales Suite

## Show modal or dialog

To show modal or dialog:
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

## Display notifications

To display notifications:
```js
client.interface.trigger("showNotify", {
  type: "<Possible values: info, success, warning, danger, alert>",
  title: "<Display name>",
  message: "<text message to be displayed in the notification box>"
});
```

---

>title: what are instance methods supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, instance_methods
>context: 
>content:

# what are instance methods supported for sales account module in Freshsales Suite

## Supported instance methods

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance.
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   - Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   - Send data from a modal to a parent placeholder and get the data in the parent.
   - Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance.
   - If a modal is the app instance where context() is used, it retrieves:
     - The (modal’s) instance id
     - The placeholder name of the app instance
     - The instance id of the parent that opened the modal
     - The data (if any) that was passed from the parent
   - If context() is used in a parent placeholder, it retrieves:
     - The instance id
     - The placeholder name of the app instance

---

>title: how to use instance methods supported for sales account module in Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, instance_methods
>context: apps.js
>content:

# how to use instance methods supported for sales account module in Freshsales Suite

1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal

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
    modalData: {name: "James", email: "James@freshworks.com"}
  }
  */
} catch (error) {
  console.error(error);
}
```

2. Send data from a modal to a parent placeholder and get the data in the parent

  1. In parent UI

```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log(data);
  /* Output:
  {
    senderId: "4",
    message: {
      name: "James",
      email: "james.dean@freshworks.com"
    }
  }
  */
});
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
client.instance.get().then(function(data) {
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
});
```

  2. In placeholder 2

```js
client.instance.receive(function(event) {
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
});
```

---

>title: what are the serverless events supported by sales account module of Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by sales account module of Freshsales Suite

## Supported serverless events

An app built for this module can react to the following events.

### Common events

In the app manifest, configure these events at `modules.common`.

1. App set-up events:
   - `onAppInstall`
   - `afterAppUpdate`
   - `onAppUninstall`
2. External events:
   - `onAppInstall`
   - `onExternalEvent`
   - `onAppUninstall`
3. Scheduled events

### Product-specific events

In the app manifest, configure these events at `modules.sales_account`.

- `onSalesAccountCreate`
- `onSalesAccountUpdate`

---

>title: how to configure product events supported by sales account module of Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by sales account module of Freshsales Suite

## Steps to configure product events

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

### Enter the callback function definition in `server.js`

```js
exports = {
  // args is a JSON block containing the payload information
  // args["iparam"] will contain the installation parameter values
  // eventCallbackMethod is the call-back function name specified in manifest.json
  eventCallbackMethod: function(args) {
    console.log("Logging arguments from the event: " + JSON.stringify(payload));
  }
};
```

### Use the appropriate payload attribute for callback

```json
{
  "currentHost": {
    "subscribed_modules": ["sales_account"],
    "endpoint_urls": {
      "freshworks_crm": "value"
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

>title: how to configure events supported by sales account module of Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by sales account module of Freshsales Suite

## Steps to configure sales account events

### Subscribe to sales_account by configuring an event listener in `manifest.json`

```json
{
"events": {
  "onSalesAccountCreate": {
    "handler": "onSalesAccountCreateCallback"
    }
  }
}
```

### Enter the callback function definition in `server.js`

```js
exports = {
  onSalesAccountCreateCallback: function(payload) {
    console.log("Logging arguments from onSalesAccountCreateCallback event: " + JSON.stringify(payload));
  }
};
```

### Use the appropriate payload attribute for callback

```json
{
  "currentHost": {
    "subscribed_modules": ["sales_account"],
    "endpoint_urls": {
      "freshworks_crm": "https://sample.myfreshworks.com",
      "freshsales": "https://sample.freshsales.io"
    }
  },
  "data": {
    "actor": {
      "id": 39897,
      "uuid": "195818342547907164"
    },
    "associations": {
      "business_type": null,
      "creator": {},
      "industry_type": null,
      "owner": {}
    },
    "sales_account": {
      "id": 1100844,
      "mcr_id": 1275859140088463400
    }
  },
  "event": "onSalesAccountCreate",
  "iparams": {},
  "region": "US",
  "timestamp": 1593023498.1006536,
  "version": "2.0"
}
```

---

>title: what are the REST APIs supported by sales account module of Freshsales Suite
>tags: module=sales_account, sales_account, freshworks_crm
>context:
>content:

# what are the REST APIs supported by sales account module of Freshsales Suite
The Freshsales Suite Sales Account module supports following APIs
`POST /api/sales_accounts`
`GET /api/sales_accounts/[id]`
`GET /api/sales_accounts/view/[view_id]`
`GET /api/sales_accounts/filters`
`PUT /api/sales_accounts/[id]`
`POST /api/sales_accounts/upsert`
`POST /api/sales_accounts/bulk_upsert`
`POST /api/sales_accounts/[id]/clone`
`DELETE /api/sales_accounts/[id]`
`DELETE /api/sales_accounts/[id]/forget`
`POST /api/sales_accounts/bulk_destroy`
`GET /api/settings/sales_accounts/fields`
`GET /api/settings/sales_accounts/fields?include=field_group`

---
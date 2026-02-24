>title: what is service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice
>context: 
>content:

# what is service asset module in Freshservice

An app user with a stand-alone Freshservice subscription or a subscription to any SKU that has Freshservice as one of the products can use this module. Using this module you can build a front end app, a serverless app and also a full stack SMI app for Freshservice Asset feature. For SMI and Serverless apps, the app reacts to app set-up events, external events, or scheduled events. The app cannot react to product-specific events such as, creating a ticket, updating a ticket, creating a conversation, and so on.

---

>title: what are the placeholders supported for service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice
>context: manifest.json
>content:

# what are the placeholders supported for service asset module in Freshservice

## Common placeholders

It supports following Common placeholders. In the app manifest, configure these placeholders at `modules.common`.

1. Full Page App as `full_page_app`

## Module-specific placeholders

It supports following Module-specific placeholders. In the app manifest, configure these placeholders at `modules.service_asset`

1. `asset_sidebar`
2. `asset_top_navigation`
3. `asset_background`

---

>title: how to use placeholders supported for service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice
>context: manifest.json
>content:

# how to use placeholders supported for service asset module in Freshservice

To use the service asset placeholder modify your `manifest.json` as below:

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
    "service_asset": {
      "location": {
        "asset_sidebar": {
          "url": "asset_sidebar.html",
          "icon": "styles/images/icon.svg"
        },
        "asset_top_navigation": {
          "url": "asset_top_navigation.html",
          "icon": "styles/images/icon.svg"
        },
        "asset_background": {
          "url": "asset_background.html",
          "icon": "styles/images/icon.svg"          
        }
      }
    }
  }
}
```

---

>title: How to Write an App for Background Placeholders for service_asset module
>tags: module=service_asset, service_asset, freshservice
>context: manifest.json
>content:

# How to Write an App for Background Placeholders for service_asset module

## What Are Background Placeholders

Background placeholders are entry points in the Freshworks Developer Platform where your app’s logic runs without rendering any UI to the agent. Unlike sidebar or modal placeholders that load HTML/CSS, background placeholders load an invisible page (e.g., `background.html`) and execute JavaScript in the background context.


## In **Platform 3.0**, the **support_ticket** module supports these background placeholders:

- `asset_background`: The app runs in the background of the Asset details page of Freshservice

These placeholders let you react to page loads and data changes, perform automated tasks, and integrate external services without cluttering the UI.

## What Is It Used For

Background placeholders are ideal for:

- **Data synchronization**: Fetching or updating external systems when a ticket or its timeline changes.
- **Automated workflows**: Triggering scheduled or event-driven processes (e.g., setting default values, auto-tagging, enrichment).
- **Event interception**: Listening for field changes (status, tags) and reacting before or after the native UI updates.
- **Analytics & logging**: Recording user or ticket activity without requiring a visible interface.
- **Notifications**: Sending alerts (email, Slack) when certain ticket conditions are met, even if the agent doesn’t click anything.
- **Data Manipulation**: Hiding a ticket field when certain validation criteria is met.

Because these run in the background, they have minimal impact on page performance and keep the UI clean for the agent.

## How to Use background placeholders

### Step 1. Declare in the Manifest

In your `manifest.json`, under the `service_asset` module, add the background placeholders to the `location` block. For example:

```json
"service_asset": {
  "events": {
    "onTicketUpdate": {
      "handler": "onTicketUpdateCallback"
    }
  },
  "location": {
    "asset_background": {
    "url": "background.html"
    }
  }
}
```

### Step 2. Create the Background HTML

Even though it’s not visible, each placeholder URL needs a corresponding HTML file. Typically, `background.html` looks like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="{{{appclient}}}"></script>
    <title>Background</title>
  </head>
  <body>
    <main>
      <section>This app runs in back ground. Hence no UI</section>
    </main>
  </body>
  <script src="/app.js />
</html>
```

### Step 3. Additionally, you can implement your background logic

Declare requests, functions in app.js and add iparams or request templates as needed.

```js
//app.js
var client;
client = await app.initialized();
client.events.on('app.activated', () => {
  console.log(`asset_background:  app is activated`);
});
```


---

>title: what are data methods supported for service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice, data_method
>context: 
>content:

# what are data methods supported for service asset module in Freshservice

You can use the `client.data.get()` data method to retrieve the following objects.

## Objects accessible regardless of the placeholders

1. currentHost
2. loggedInUser

## Placeholder-specific objects 

An app deployed in the New email page can retrieve the following objects.

1. `asset` - to retrieve information of an asset.

---

>title: example of data method usage supported for service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice
>context: 
>content:

# example of data method usage supported for service asset module in Freshservice

## Retrieve asset information

```js
async function getAssetDetails() {
  try {
    const data = await client.data.get("asset");
    // success output
    // data is {"agent_id": null, "agent_name": null, "asset_tag": "ASSET-1",....}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getAssetDetails();
```

---

>title: what are interface methods supported for service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice, interface_methods
>context: 
>content:

# what are interface methods supported for service asset module in Freshservice

## Using interface methods an app can, on the product UI:

1. Display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Supported interface methods

Freshservice supports following interface methods:

1. Display modals - `showModal` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, and `error`

---

>title: how to use interface methods supported for service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice, interface_methods
>context: apps.js
>content:

# how to use interface methods supported for service asset module in Freshservice

## Show modal or dialog

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

## Display notifications

```js
client.interface.trigger("showNotify", {
    type: “<Possible values: info, success, warning, danger, alert>”,
    title: "<Display name>",
    message: "<text message to be displayed in the notification box>"
    }
)
```

---

>title: what are instance methods supported for service asset module in Freshservice
>tags: module=service_asset, service_asset, freshservice, instance_methods
>context: 
>content:

# what are instance methods supported for service asset module in Freshservice

## Supported instance methods

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   2. Send data from a modal to a parent placeholder and get the data in the parent.
   3. Send data from one instance to another instance and receive data at the destination.

## Retrieve contextual information

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
>title: how to use instance methods supported for service asset module in Freshservice
>tags: service_asset, freshservice, instance_methods
>context: app.js
>content:

# how to use instance methods supported for service asset module in Freshservice
The following are 3 examples showing instance method usage for service asset module

## Parent to Modal Communication

### In parent UI
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

### In modal UI

```js
try {
  let context = await client.instance.context();
  console.log("Modal instance method context", context);
  // Expected output:
  // { instanceId: "4", location: "modal", parentId: "1", modalData: {name: "James", email: "James@freshworks.com"} }
} catch (error) {
  console.error(error);
}
```

## Modal to Parent Communication

### In parent UI
```js
  client.instance.receive(function (event) {
    let data = event.helper.getData();
    console.log(data);
    // Expected output:
    // senderId: "4", message: { name: "James", email: "james.dean@freshworks.com" }
  });
```

### In modal UI
```js
client.instance.send({
  message: {
// message can be a string, object, or array
    name: "James",
    email: "james.dean@freshworks.com"
  }
});
```

## Instance to Instance Communication

### In placeholder 1
```js
client.instance.get().then(function(data) {
  console.log(data);
  // Expected output example:
  // [
  //   { instanceId: "1", location: "place_holder1" },
  //   { instanceId: "2", location: "place_holder2" }
  // ]
  var pl2App = data.find(x => x.location === "place_holder2");
  client.instance.send({
    message: {
      name: "James",
      email: "james.dean@freshworks.com"
    },
    receiver: pl2App.instanceId
  });
});
```

### In placeholder 2

```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log(data);
  // Expected output:
  // { senderId: "1", message: { name: "James", email: "james.dean@freshworks.com" } }
});
```

---

>title: what are the serverless events supported by service asset module of Freshservice
>tags: module=service_asset, service_asset, freshservice, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by service asset module of Freshservice

## Common events

An app built for this module can react to the following events. In the app manifest, configure these events at `modules.common`.

### App set-up events

1. `onAppInstall`
2. `afterAppUpdate`
3. `onAppUninstall`

### External events

1. `onAppInstall`
2. `onExternalEvent`
3. `onAppUninstall`

### Scheduled events

---

>title: what are the REST APIs supported by service asset module of Freshservice
>tags: module=service_asset, service_asset, freshservice, rest_api
>context: 
>content:

# what are the REST APIs supported by service asset module of Freshservice

The Freshservice service asset module supports following APIs
It provides the endpoint along with Oauth scope required for every api

## Assets API
- `GET /api/v2/assets` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view
- `POST /api/v2/assets` - ITSM Scope: freshservice.assets.manage, MSP Scope: freshservice.assets.manage
- `GET /api/v2/assets/[display_id]` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view
- `GET /api/v2/assets` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view
- `GET /api/v2/assets?search=[query]` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view
- `GET /api/v2/assets?filter=[query] ` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view
- `PUT /api/v2/assets/[display_id]` - ITSM Scope: freshservice.assets.manage, MSP Scope: freshservice.assets.manage
- `DELETE /api/v2/assets/[display_id]` - ITSM Scope: freshservice.assets.delete, MSP Scope: freshservice.assets.delete
- `PUT /api/v2/assets/[display_id]/restore` - ITSM Scope: freshservice.assets.delete, MSP Scope: freshservice.assets.delete
- `PUT /api/v2/assets/[display_id]/delete_forever` - ITSM Scope: freshservice.assets.delete, MSP Scope: freshservice.assets.delete

### Asset Components API
- `GET /api/v2/assets/[display_id]/components` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view
- `POST /api/v2/assets/[display_id]/components` - ITSM Scope: freshservice.assets.manage, MSP Scope: freshservice.assets.manage
- `PUT /api/v2/assets/[display_id]/components/[component_id]` - ITSM Scope: freshservice.assets.manage, MSP Scope: freshservice.assets.manage

### Asset Requests/Contracts API
- `GET /api/v2/assets/[display_id]/requests` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view
- `GET /api/v2/assets/[display_id]/contracts` - ITSM Scope: freshservice.assets.view, MSP Scope: freshservice.assets.view


---
